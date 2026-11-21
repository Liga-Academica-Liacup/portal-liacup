import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import type { CDPSession, Locator, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { ALVO_MINIMO, TAGS_DO_AXE, primeiraLinha } from './apoio'

/*
 * A PÁGINA DO PROCESSO SELETIVO PUBLICADA (pagina-processo-seletivo, design.md
 * D6 e D8, item 1; spec pagina-processo-seletivo).
 *
 * Roda com o site publicado (a 3000, `baseURL`), em cada uma das sete larguras.
 *
 * O texto NÃO está escrito aqui. Ele é lido do docs/conteudo-institucional.md
 * (§1 o Instagram, §5 o título, §5.1 o aviso, §5.2 a §5.5 e §6), e os títulos
 * e sobretítulos das seções do docs/REFERENCIA-VISUAL.md §7, onde o Gabriel os
 * registrou (Q3 (a)). Se a página divergir do documento, este spec fica
 * vermelho, dizendo o trecho, o esperado e o recebido; se o documento mudar, o
 * spec acompanha (constitution, princípio 5).
 *
 * As respostas do §6 terminam, quase todas, com uma nota de fonte em itálico
 * entre parênteses, como "_(Edital, 2.2)_". Pela Q4 (a) ela não vai ao ar: o
 * teste a tira antes de comparar, e confere que nenhuma aparece na página.
 *
 * Cada medida diz quanto mediu (RP-12): "nada falhou" e "nada foi medido" não
 * podem dar a mesma saída verde.
 */

const ENDERECO = '/processo-seletivo'

/* O selo vem do briefing da change e da spec ("Inscrições fechadas"), e não do documento. */
const SELO = 'Inscrições fechadas'

/*
 * O que a spec manda NÃO aparecer ("A página não traz o que a liga deixou de
 * fora"), mais os dois botões do estado aberto (Q2 (a)) e o sobretítulo velho
 * (Q3 (a)). As datas do cronograma encerrado são lidas do §5.6, abaixo.
 */
const PROIBIDOS = [
  'desempate',
  'Prova de conhecimentos',
  'O que cai na prova',
  'Aula de integração',
  '2026.2',
  'Inscrições abertas',
  'Fazer inscrição',
  'Baixar o edital',
  'Cronograma',
]

/* ------------------------------------------------------------------------ */
/* O documento                                                               */
/* ------------------------------------------------------------------------ */

const raiz = process.cwd()
const DOCUMENTO = readFileSync(join(raiz, 'docs', 'conteudo-institucional.md'), 'utf8')
const REFERENCIA = readFileSync(join(raiz, 'docs', 'REFERENCIA-VISUAL.md'), 'utf8')

const normalizar = (texto: string) => texto.replace(/\s+/g, ' ').trim()

/* O trecho do documento do cabeçalho `inicio` até o próximo cabeçalho de nível igual ou maior. */
function secaoDoDocumento(inicio: string): string {
  const comeco = DOCUMENTO.indexOf(`\n${inicio}`)
  if (comeco === -1) throw new Error(`conteudo-institucional.md sem a seção "${inicio}"`)
  const nivel = /^#+/.exec(inicio)?.[0] ?? '###'
  const resto = DOCUMENTO.slice(comeco + 1)
  const proximo = resto.slice(inicio.length).search(new RegExp(`\\n#{1,${nivel.length}} `))
  return proximo === -1 ? resto : resto.slice(0, inicio.length + proximo)
}

function ler(padrao: RegExp, texto: string, nome: string): string {
  const achado = padrao.exec(texto)?.[1]
  if (!achado) throw new Error(`não achei ${nome} no documento`)
  return normalizar(achado)
}

type Pergunta = { pergunta: string; resposta: string; nota: string | null }

function lerDocumento() {
  const s1 = secaoDoDocumento('## 1.')
  const s5 = secaoDoDocumento('## 5.')
  const s51 = secaoDoDocumento('### 5.1')
  const s52 = secaoDoDocumento('### 5.2')
  const s53 = secaoDoDocumento('### 5.3')
  const s54 = secaoDoDocumento('### 5.4')
  const s55 = secaoDoDocumento('### 5.5')
  const s56 = secaoDoDocumento('### 5.6')
  const s6 = secaoDoDocumento('## 6.')

  const instagram = ler(/\|\s*Instagram\s*\|\s*\*\*`(@[^`]+)`\*\*/, s1, 'o Instagram no §1')
  const titulo = ler(/^## 5\.\s+(.+?)\s+—/, s5, 'o título do §5')
  const aviso = ler(
    /\*\*Aviso de inscrições fechadas\*\*[^\n]*\n\s*\n>\s*(.+)/,
    s51,
    'o aviso de inscrições fechadas no §5.1'
  )
  const apresentacao = ler(/^>\s*(.+)$/m, s52, 'a apresentação do §5.2')
  /* O §5.3 é um parágrafo só, a primeira linha de texto depois do cabeçalho. */
  const quemPode = normalizar(
    s53
      .split('\n')
      .slice(1)
      .find((linha) => linha.trim() !== '') ?? ''
  )
  if (!quemPode) throw new Error('não achei o texto do §5.3 no documento')
  const preRequisitos = [...s54.matchAll(/^\d+\.\s+(.+)$/gm)].map((m) => normalizar(m[1] ?? ''))
  const etapas = [...s55.matchAll(/^\d+\.\s+\*\*(.+?)\*\*\s+—\s+(.+)$/gm)].map((m) => ({
    nome: normalizar(m[1] ?? ''),
    carater: normalizar(m[2] ?? ''),
  }))
  /* As datas do cronograma encerrado, inteiras e sem o ano ("28/08"). */
  const datas = [...s56.matchAll(/\b(\d{2}\/\d{2})\/\d{4}\b/g)].flatMap((m) => [m[0], m[1] ?? ''])

  /* §6: "**Pergunta?**" numa linha e a resposta na seguinte, com a nota de fonte no fim. */
  const perguntas: Pergunta[] = [...s6.matchAll(/^\*\*(.+\?)\*\*\n(.+)$/gm)].map((m) => {
    const bruta = normalizar(m[2] ?? '')
    const nota = /\s*_\(([^)]*)\)_\s*$/.exec(bruta)
    return {
      pergunta: normalizar(m[1] ?? ''),
      resposta: nota ? normalizar(bruta.slice(0, nota.index)) : bruta,
      nota: nota ? `(${nota[1]})` : null,
    }
  })

  /* REFERENCIA-VISUAL.md §7: títulos e sobretítulos das seções, na ordem das seções. */
  const linha = REFERENCIA.split('\n').find((l) =>
    l.startsWith('| Processo seletivo, títulos de seção')
  )
  if (!linha) throw new Error('REFERENCIA-VISUAL.md §7 sem a linha dos títulos de seção')
  const aspas = (trecho: string) => [...trecho.matchAll(/"([^"]+)"/g)].map((m) => m[1] ?? '')
  const titulos = aspas(ler(/Títulos do protótipo: (.+?)\. Sobretítulos/, linha, 'os títulos'))
  const sobretitulos = aspas(ler(/não tem datas: (.+?)\. São/, linha, 'os sobretítulos'))

  if (preRequisitos.length !== 3) throw new Error(`§5.4 com ${preRequisitos.length} itens, e não 3`)
  if (etapas.length !== 2) throw new Error(`§5.5 com ${etapas.length} etapas, e não 2`)
  if (perguntas.length !== 8) throw new Error(`§6 com ${perguntas.length} perguntas, e não 8`)
  if (titulos.length !== 3 || sobretitulos.length !== 3) {
    throw new Error(
      `REFERENCIA-VISUAL.md §7: ${titulos.length} títulos e ${sobretitulos.length} sobretítulos, e não 3 e 3`
    )
  }
  if (datas.length === 0) throw new Error('§5.6 sem datas')

  return {
    instagram,
    enderecoDoInstagram: `https://www.instagram.com/${instagram.slice(1)}/`,
    titulo,
    aviso,
    apresentacao,
    quemPode,
    preRequisitos,
    etapas,
    perguntas,
    titulos,
    sobretitulos,
    datas: [...new Set(datas)],
  }
}

const DOC = lerDocumento()

/* ------------------------------------------------------------------------ */
/* A página                                                                  */
/* ------------------------------------------------------------------------ */

const resumos = (page: Page) => page.locator('main details > summary')

async function abrirPagina(page: Page) {
  await page.goto(ENDERECO)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.mouse.move(0, 0)
}

/* Abre as perguntas pelo clique de verdade, uma por uma, e devolve quantas ficaram abertas. */
async function abrirTodas(page: Page): Promise<number> {
  const total = await resumos(page).count()
  for (let i = 0; i < total; i += 1) {
    const resumo = resumos(page).nth(i)
    if (!(await resumo.evaluate((s) => (s.parentElement as HTMLDetailsElement).open))) {
      await resumo.click()
    }
  }
  await page.mouse.move(0, 0)
  return page.locator('main details[open]').count()
}

/* O que a página mostra, lido pela estrutura dela, e não por classe CSS. */
async function lerPagina(page: Page) {
  return page.evaluate(() => {
    const n = (t: string | null | undefined) => (t ?? '').replace(/\s+/g, ' ').trim()
    const main = document.querySelector('main')
    if (!main) throw new Error('a página não tem <main>')
    const h1s = Array.from(main.querySelectorAll('h1'))
    const h1 = h1s[0]
    const faixa = h1?.closest('section')
    const secoes = Array.from(main.querySelectorAll('section'))
    const secaoCom = (seletor: string) =>
      secoes.find((s) => s !== faixa && s.querySelector(seletor))
    const titulosDe = (secao: Element | undefined) => {
      const h2 = secao?.querySelector('h2')
      return { titulo: n(h2?.textContent), sobretitulo: n(h2?.previousElementSibling?.textContent) }
    }
    /* Os parágrafos da seção que vêm depois do h2 e não estão numa lista. */
    const paragrafosDepoisDoTitulo = (secao: Element | undefined) => {
      const h2 = secao?.querySelector('h2')
      if (!secao || !h2) return []
      return Array.from(secao.querySelectorAll('p'))
        .filter((p) => h2.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING)
        .filter((p) => !p.closest('li'))
        .map((p) => n(p.textContent))
    }
    const etapas = secaoCom('ol')
    const requisitos = secaoCom('ul')
    const perguntas = secaoCom('details')
    return {
      h1s: h1s.map((h) => n(h.textContent)),
      selo: n(h1?.previousElementSibling?.textContent),
      apresentacao: n(h1?.nextElementSibling?.textContent),
      aviso: n(faixa?.querySelector('a[href]')?.closest('p')?.textContent),
      ordemDasSecoes: secoes.map((s) =>
        s === faixa
          ? 'faixa'
          : s === etapas
            ? 'etapas'
            : s === requisitos
              ? 'requisitos'
              : s === perguntas
                ? 'perguntas'
                : 'outra'
      ),
      etapas: {
        ...titulosDe(etapas),
        itens: Array.from(etapas?.querySelectorAll('ol > li') ?? []).map((li) =>
          Array.from(li.querySelectorAll('p')).map((p) => n(p.textContent))
        ),
      },
      requisitos: {
        ...titulosDe(requisitos),
        paragrafos: paragrafosDepoisDoTitulo(requisitos),
        itens: Array.from(requisitos?.querySelectorAll('ul > li') ?? []).map((li) =>
          n(li.textContent)
        ),
      },
      perguntas: {
        ...titulosDe(perguntas),
        itens: Array.from(perguntas?.querySelectorAll('details') ?? []).map((d) => ({
          pergunta: n(d.querySelector(':scope > summary')?.textContent),
          resposta: n(
            Array.from(d.children)
              .filter((filho) => filho.tagName !== 'SUMMARY')
              .map((filho) => filho.textContent)
              .join(' ')
          ),
        })),
      },
      /*
       * Todo nó de texto do conteúdo, separado por espaço. Não é o innerText:
       * ele aplica o text-transform, e o sobretítulo "Etapas" sairia "ETAPAS".
       */
      textoVisivel: n(
        (() => {
          const partes: string[] = []
          const caminho = document.createTreeWalker(main, NodeFilter.SHOW_TEXT)
          for (let no = caminho.nextNode(); no; no = caminho.nextNode()) {
            partes.push(no.textContent ?? '')
          }
          return partes.join(' ')
        })()
      ),
      /* Todo o texto do documento, inclusive o das respostas fechadas. */
      textoInteiro: n(document.body.textContent),
    }
  })
}

type Trecho = { nome: string; esperado: string; recebido: string }

/* ------------------------------------------------------------------------ */
/* 1. O texto                                                                */
/* ------------------------------------------------------------------------ */

test('o texto da página é o do conteudo-institucional.md, sem as notas de fonte, e nada a mais', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const abertas = await abrirTodas(page)
  const lido = await lerPagina(page)

  const trechos: Trecho[] = [
    { nome: '§5, título principal', esperado: DOC.titulo, recebido: lido.h1s.join(' | ') },
    { nome: '§5.1, aviso de inscrições fechadas', esperado: DOC.aviso, recebido: lido.aviso },
    { nome: '§5.2, apresentação', esperado: DOC.apresentacao, recebido: lido.apresentacao },
    {
      nome: '§5.3, quem pode se inscrever',
      esperado: DOC.quemPode,
      recebido: lido.requisitos.paragrafos.join(' | '),
    },
    ...DOC.preRequisitos.map((esperado, i) => ({
      nome: `§5.4, pré-requisito ${i + 1}`,
      esperado,
      recebido: lido.requisitos.itens[i] ?? '(ausente)',
    })),
    ...DOC.etapas.flatMap((etapa, i) => [
      {
        nome: `§5.5, etapa ${i + 1}, nome`,
        esperado: etapa.nome,
        recebido: lido.etapas.itens[i]?.[0] ?? '(ausente)',
      },
      {
        nome: `§5.5, etapa ${i + 1}, caráter`,
        esperado: etapa.carater,
        recebido: lido.etapas.itens[i]?.slice(1).join(' | ') ?? '(ausente)',
      },
    ]),
    ...DOC.perguntas.flatMap((item, i) => [
      {
        nome: `§6, pergunta ${i + 1}`,
        esperado: item.pergunta,
        recebido: lido.perguntas.itens[i]?.pergunta ?? '(ausente)',
      },
      {
        nome: `§6, resposta de "${item.pergunta}"`,
        esperado: item.resposta,
        recebido: lido.perguntas.itens[i]?.resposta ?? '(ausente)',
      },
    ]),
  ]
  /* Rótulos de interface: o selo (spec) e os títulos e sobretítulos (REFERENCIA-VISUAL.md §7). */
  const rotulos: Trecho[] = [
    { nome: 'selo', esperado: SELO, recebido: lido.selo },
    ...(['etapas', 'requisitos', 'perguntas'] as const).flatMap((secao, i) => [
      {
        nome: `seção ${i + 1}, título`,
        esperado: DOC.titulos[i] ?? '',
        recebido: lido[secao].titulo,
      },
      {
        nome: `seção ${i + 1}, sobretítulo`,
        esperado: DOC.sobretitulos[i] ?? '',
        recebido: lido[secao].sobretitulo,
      },
    ]),
  ]

  const falhas: string[] = []
  for (const trecho of [...trechos, ...rotulos]) {
    if (trecho.recebido !== trecho.esperado) {
      falhas.push(
        `trecho "${trecho.nome}" difere do documento:\n    esperado: "${trecho.esperado}"\n    recebido: "${trecho.recebido}"`
      )
    }
  }
  const contagem = {
    perguntasNaPagina: lido.perguntas.itens.length,
    itensDaLista: lido.requisitos.itens.length,
    etapasNaPagina: lido.etapas.itens.length,
  }
  if (contagem.perguntasNaPagina !== DOC.perguntas.length)
    falhas.push(
      `a página tem ${contagem.perguntasNaPagina} perguntas, e o documento ${DOC.perguntas.length}`
    )
  if (contagem.itensDaLista !== DOC.preRequisitos.length)
    falhas.push(
      `a página tem ${contagem.itensDaLista} pré-requisitos, e o documento ${DOC.preRequisitos.length}`
    )
  if (contagem.etapasNaPagina !== DOC.etapas.length)
    falhas.push(
      `a página tem ${contagem.etapasNaPagina} etapas, e o documento ${DOC.etapas.length}`
    )
  if (lido.h1s.length !== 1)
    falhas.push(`a página tem ${lido.h1s.length} títulos de nível 1: ${lido.h1s.join(' | ')}`)

  /* A ordem do protótipo: faixa, etapas, quem pode se inscrever e perguntas. */
  const ordem = lido.ordemDasSecoes.join(' > ')
  if (ordem !== 'faixa > etapas > requisitos > perguntas')
    falhas.push(`seções na ordem "${ordem}", e não "faixa > etapas > requisitos > perguntas"`)

  /* Q4 (a): nenhuma nota de fonte na página, nem dentro de resposta fechada. */
  const notas = DOC.perguntas.flatMap((item) => (item.nota ? [item.nota] : []))
  const notasNaPagina = notas.filter((nota) => lido.textoInteiro.includes(nota.slice(1, -1)))
  for (const nota of notasNaPagina) falhas.push(`a nota de fonte "${nota}" aparece na página`)
  if (/decisão D\d/.test(lido.textoInteiro)) falhas.push('"decisão Dn" aparece na página')

  /*
   * Nada a mais: tirado do texto visível cada trecho e rótulo conferido acima,
   * uma vez cada, não sobra texto. Assim pega frase que a composição escreva
   * por conta própria, fora dos dados e do documento.
   */
  let sobra = lido.textoVisivel
  for (const { esperado } of [...trechos, ...rotulos].sort(
    (a, b) => b.esperado.length - a.esperado.length
  )) {
    if (esperado) sobra = sobra.replace(esperado, ' ')
  }
  sobra = normalizar(sobra)
  if (sobra !== '')
    falhas.push(
      `texto no conteúdo que não está no documento nem nos rótulos: "${sobra.slice(0, 200)}"`
    )

  const conferidos =
    trechos.length + rotulos.length - falhas.filter((f) => f.startsWith('trecho')).length
  console.log(
    `[${informacoes.project.name}] trechos do conteudo-institucional.md conferidos: ${trechos.length}` +
      ` (§5 título 1 · §5.1 aviso 1 · §5.2 1 · §5.3 1 · §5.4 ${DOC.preRequisitos.length}` +
      ` · §5.5 ${DOC.etapas.length * 2} · §6 ${DOC.perguntas.length * 2})` +
      ` · rótulos de interface conferidos: ${rotulos.length} · iguais: ${conferidos} de ${trechos.length + rotulos.length}\n` +
      `[${informacoes.project.name}] perguntas abertas para ler as respostas: ${abertas} de ${contagem.perguntasNaPagina}` +
      ` · notas de fonte tiradas do documento: ${notas.length} · na página: ${notasNaPagina.length}` +
      ` · texto fora do documento: ${sobra.length} caracteres · ordem das seções: ${ordem}`
  )
  expect(falhas, `a página diverge do documento:\n${falhas.join('\n')}`).toEqual([])
  expect(abertas).toBe(DOC.perguntas.length)
})

test('a página não traz o que a liga deixou de fora, com todas as perguntas abertas', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const abertas = await abrirTodas(page)
  /*
   * Os nós de texto da página, fora de <script> e <style>, e não o innerText:
   * ele aplica o text-transform, e um sobretítulo "Cronograma" sairia
   * "CRONOGRAMA" e escaparia. A busca diferencia maiúscula de propósito: a
   * apresentação do §5.2 diz "o cronograma daquele semestre", e isso é texto
   * aprovado; o que a spec proíbe é o sobretítulo "Cronograma".
   */
  const texto = await page.evaluate(() => {
    const partes: string[] = []
    const caminho = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let no = caminho.nextNode(); no; no = caminho.nextNode()) {
      if (no.parentElement?.closest('script, style, noscript, template')) continue
      partes.push(no.textContent ?? '')
    }
    return partes.join(' ').replace(/\s+/g, ' ')
  })
  const procurados = [...PROIBIDOS, ...DOC.datas]
  const achados = procurados.filter((termo) => texto.includes(termo))
  console.log(
    `[${informacoes.project.name}] termos proibidos procurados: ${procurados.length}` +
      ` (${PROIBIDOS.length} da spec · ${DOC.datas.length} datas do §5.6)` +
      ` · perguntas abertas: ${abertas} · achados: ${achados.length}` +
      ` · caracteres lidos: ${texto.length}`
  )
  expect(texto.length, 'o teste precisa ter lido texto').toBeGreaterThan(0)
  expect(achados, `a página mostra: ${achados.join(', ')}`).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 2. As perguntas por teclado                                               */
/* ------------------------------------------------------------------------ */

/* O estado que o Chromium expõe ao leitor de tela, lido da árvore de acessibilidade. */
async function estadoAnunciado(cdp: CDPSession, indice: number) {
  const { result } = await cdp.send('Runtime.evaluate', {
    expression: `document.querySelectorAll('main details > summary')[${indice}]`,
  })
  if (!result.objectId) throw new Error(`a pergunta ${indice + 1} não existe`)
  const { nodes } = await cdp.send('Accessibility.getPartialAXTree', {
    objectId: result.objectId,
    fetchRelatives: false,
  })
  const no = nodes[0]
  const expandido = no?.properties?.find((p) => p.name === 'expanded')?.value.value
  return {
    papel: String(no?.role?.value ?? ''),
    nome: String(no?.name?.value ?? ''),
    expandido: typeof expandido === 'boolean' ? expandido : null,
  }
}

/* O anel: contorno e sombra calculados. */
const anelDe = (resumo: Locator) =>
  resumo.evaluate((alvo) => {
    const e = getComputedStyle(alvo)
    const temContorno =
      e.outlineStyle !== 'none' &&
      parseFloat(e.outlineWidth) > 0 &&
      !/rgba\([^)]*,\s*0\)$/.test(e.outlineColor)
    return {
      texto: `contorno ${temContorno ? `${e.outlineWidth} ${e.outlineStyle} ${e.outlineColor}` : 'nenhum'}, sombra ${e.boxShadow}`,
      visivel: temContorno || e.boxShadow !== 'none',
    }
  })

const estado = (resumo: Locator) =>
  resumo.evaluate((s) => ({
    aberto: (s.parentElement as HTMLDetailsElement).open,
    temFoco: s === document.activeElement,
    focoVisivel: s.matches(':focus-visible'),
    rolagem: window.scrollY,
    respostaVisivel: Array.from(s.parentElement?.children ?? [])
      .filter((filho) => filho !== s)
      .some((filho) => (filho as HTMLElement).checkVisibility()),
  }))

test('cada pergunta: o Tab chega, o Enter abre, o Espaço fecha sem rolar, o estado é anunciado, 44 px e foco visível', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Accessibility.enable')
  const total = await resumos(page).count()
  /* O anel de cada pergunta em repouso, antes de qualquer foco. */
  const emRepouso = await Promise.all(
    Array.from({ length: total }, (_, i) => anelDe(resumos(page).nth(i)))
  )

  const falhas: string[] = []
  const contagem = {
    alcancadas: 0,
    enter: 0,
    espaco: 0,
    rolou: 0,
    anunciadas: 0,
    alvos: 0,
    foco: 0,
  }
  let menor = { largura: Infinity, altura: Infinity }
  let teclasDeTab = 0

  for (let i = 0; i < total; i += 1) {
    const resumo = resumos(page).nth(i)
    const nome = normalizar((await resumo.textContent()) ?? '')
    const onde = `pergunta ${i + 1} "${nome}"`
    try {
      /* Tab de verdade até a pergunta: da primeira, o caminho desde o topo; das outras, poucas teclas. */
      let chegou = false
      for (let tecla = 0; tecla < (i === 0 ? 80 : 6); tecla += 1) {
        await page.keyboard.press('Tab')
        teclasDeTab += 1
        if ((await estado(resumo)).temFoco) {
          chegou = true
          break
        }
      }
      if (!chegou) throw new Error('o Tab não chegou à pergunta')
      contagem.alcancadas += 1

      const comFoco = await anelDe(resumo)
      const antes = await estado(resumo)
      const anuncioAntes = await estadoAnunciado(cdp, i)
      if (!antes.focoVisivel || !comFoco.visivel || comFoco.texto === emRepouso[i]?.texto) {
        falhas.push(
          `${onde}: foco sem anel visível (:focus-visible ${antes.focoVisivel}; focada ${comFoco.texto}; em repouso ${emRepouso[i]?.texto})`
        )
      } else contagem.foco += 1

      if (antes.aberto) throw new Error('já estava aberta antes do Enter')
      await page.keyboard.press('Enter')
      const depoisDoEnter = await estado(resumo)
      const anuncioAberto = await estadoAnunciado(cdp, i)
      if (!depoisDoEnter.aberto || !depoisDoEnter.respostaVisivel) {
        falhas.push(`${onde}: a tecla Enter não abriu a resposta`)
      } else contagem.enter += 1

      /*
       * O Espaço é medido sozinho: se o Enter falhou, a pergunta é aberta pelo
       * clique, e o foco fica nela, para que o defeito de uma tecla não
       * esconda o da outra, nem conte como "fechou" uma pergunta que nem abriu.
       */
      if (!depoisDoEnter.aberto) await resumo.click()
      const antesDoEspaco = await estado(resumo)
      await page.keyboard.press('Space')
      const depoisDoEspaco = await estado(resumo)
      const anuncioFechado = await estadoAnunciado(cdp, i)
      if (!antesDoEspaco.aberto) {
        falhas.push(`${onde}: nem o clique abriu a resposta, e o Espaço não pôde ser medido`)
      } else if (depoisDoEspaco.aberto || depoisDoEspaco.respostaVisivel) {
        falhas.push(`${onde}: a tecla Espaço não fechou a resposta`)
      } else contagem.espaco += 1

      if (
        depoisDoEnter.rolagem !== antes.rolagem ||
        depoisDoEspaco.rolagem !== antesDoEspaco.rolagem
      ) {
        contagem.rolou += 1
        falhas.push(
          `${onde}: a página rolou: scrollY ${antes.rolagem} antes, ${depoisDoEnter.rolagem} depois do Enter, ${depoisDoEspaco.rolagem} depois do Espaço`
        )
      }
      if (!depoisDoEspaco.temFoco) falhas.push(`${onde}: o foco saiu da pergunta depois do Espaço`)

      const anuncios = [anuncioAntes, anuncioAberto, anuncioFechado]
      const sequencia = anuncios.map((a) => a.expandido).join(', ')
      if (sequencia !== 'false, true, false' || anuncios.some((a) => a.nome !== nome)) {
        falhas.push(
          `${onde}: estado anunciado ${sequencia} (esperado false, true, false), papel ${anuncioAntes.papel}, nome "${anuncioAntes.nome}"`
        )
      } else contagem.anunciadas += 1

      const caixa = await resumo.boundingBox()
      if (!caixa) throw new Error('a pergunta não tem caixa')
      menor = {
        largura: Math.min(menor.largura, caixa.width),
        altura: Math.min(menor.altura, caixa.height),
      }
      if (caixa.width < ALVO_MINIMO || caixa.height < ALVO_MINIMO) {
        falhas.push(
          `${onde}: alvo de ${caixa.width}x${caixa.height} px, abaixo de ${ALVO_MINIMO} px`
        )
      } else contagem.alvos += 1
    } catch (erro) {
      falhas.push(`${onde}: ${primeiraLinha(erro)}`)
    }
  }

  const p = informacoes.project.name
  console.log(
    `[${p}] perguntas medidas: ${total} · alcançadas por Tab: ${contagem.alcancadas} (${teclasDeTab} teclas)` +
      ` · Enter abriu: ${contagem.enter} · Espaço fechou: ${contagem.espaco} · página rolou: ${contagem.rolou}\n` +
      `[${p}] estado anunciado (expanded false, true, false, na árvore de acessibilidade do Chromium): ${contagem.anunciadas} de ${total}` +
      ` · foco visível: ${contagem.foco} de ${total}\n` +
      `[${p}] alvos das perguntas medidos: ${total} · abaixo de ${ALVO_MINIMO} px: ${total - contagem.alvos}` +
      ` · menor: ${Math.round(menor.largura * 100) / 100} x ${Math.round(menor.altura * 100) / 100} px`
  )
  expect(falhas, `perguntas com defeito:\n${falhas.join('\n')}`).toEqual([])
  expect(total, 'a página precisa ter as perguntas do documento').toBe(DOC.perguntas.length)
})

test('o toque abre e fecha cada pergunta', async ({ browser, page }, informacoes) => {
  const tela = page.viewportSize()
  if (!tela) throw new Error('o projeto não tem largura de tela')
  const contexto = await browser.newContext({
    hasTouch: true,
    viewport: tela,
    baseURL: informacoes.project.use.baseURL,
  })
  const falhas: string[] = []
  let tocadas = 0
  try {
    const toque = await contexto.newPage()
    await toque.goto(ENDERECO)
    const total = await resumos(toque).count()
    for (let i = 0; i < total; i += 1) {
      const resumo = resumos(toque).nth(i)
      await resumo.scrollIntoViewIfNeeded()
      const caixa = await resumo.boundingBox()
      if (!caixa) {
        falhas.push(`pergunta ${i + 1}: sem caixa`)
        continue
      }
      const aberta = () => resumo.evaluate((s) => (s.parentElement as HTMLDetailsElement).open)
      await toque.touchscreen.tap(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2)
      const depoisDoPrimeiro = await aberta()
      await toque.touchscreen.tap(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2)
      const depoisDoSegundo = await aberta()
      if (!depoisDoPrimeiro || depoisDoSegundo) {
        falhas.push(
          `pergunta ${i + 1}: aberta depois do 1º toque ${depoisDoPrimeiro}, depois do 2º ${depoisDoSegundo}`
        )
      } else tocadas += 1
    }
    console.log(
      `[${informacoes.project.name}] perguntas tocadas: ${total} · abriram no 1º toque e fecharam no 2º: ${tocadas}`
    )
    expect(falhas, falhas.join('\n')).toEqual([])
    expect(tocadas).toBe(DOC.perguntas.length)
  } finally {
    await contexto.close()
  }
})

/* ------------------------------------------------------------------------ */
/* 3. axe e rolagem, com as perguntas fechadas e abertas                     */
/* ------------------------------------------------------------------------ */

async function violacoes(page: Page): Promise<string[]> {
  const resultado = await new AxeBuilder({ page }).withTags(TAGS_DO_AXE).analyze()
  return resultado.violations.map((v) => `${v.id} (${v.nodes.length} elementos): ${v.help}`)
}

const rolagem = (page: Page) =>
  page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

test('o axe não acusa violação com as perguntas fechadas nem com todas abertas, e não há rolagem horizontal', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const fechadas = await page.locator('main details:not([open])').count()
  const comElasFechadas = await violacoes(page)
  const rolagemFechadas = await rolagem(page)
  const abertas = await abrirTodas(page)
  const comElasAbertas = await violacoes(page)
  const rolagemAbertas = await rolagem(page)

  const p = informacoes.project.name
  console.log(
    `[${p}] Violacoes de acessibilidade: ${comElasFechadas.length + comElasAbertas.length}` +
      ` (com as ${fechadas} perguntas fechadas: ${comElasFechadas.length} · com as ${abertas} abertas: ${comElasAbertas.length})\n` +
      `[${p}] rolagem horizontal: fechadas scrollWidth ${rolagemFechadas.scrollWidth} / clientWidth ${rolagemFechadas.clientWidth}` +
      ` · abertas scrollWidth ${rolagemAbertas.scrollWidth} / clientWidth ${rolagemAbertas.clientWidth}`
  )
  expect(fechadas, 'as perguntas começam fechadas').toBe(DOC.perguntas.length)
  expect(abertas, 'todas as perguntas precisam abrir').toBe(DOC.perguntas.length)
  expect(comElasFechadas, `axe, perguntas fechadas:\n${comElasFechadas.join('\n')}`).toEqual([])
  expect(comElasAbertas, `axe, perguntas abertas:\n${comElasAbertas.join('\n')}`).toEqual([])
  expect(rolagemFechadas.scrollWidth).toBeLessThanOrEqual(rolagemFechadas.clientWidth)
  expect(rolagemAbertas.scrollWidth).toBeLessThanOrEqual(rolagemAbertas.clientWidth)
})

/* ------------------------------------------------------------------------ */
/* 4. O link do aviso                                                        */
/* ------------------------------------------------------------------------ */

async function nomeAcessivel(link: Locator): Promise<string> {
  const arvore = await link.ariaSnapshot()
  const achado = /^- link "((?:[^"\\]|\\.)*)"/.exec(arvore.trim())
  return achado?.[1]?.replace(/\\"/g, '"') ?? ''
}

test('o link do aviso leva ao Instagram em nova aba, sem opener nem Referer, com nome que diz o destino e contém o texto', async ({
  page,
  context,
}, informacoes) => {
  await abrirPagina(page)
  const faixa = page.getByRole('region', { name: DOC.titulo })
  const links = faixa.getByRole('link')
  const quantos = await links.count()
  expect(quantos, 'a faixa do topo precisa ter um link, o do aviso').toBe(1)
  const link = links.first()

  const falhas: string[] = []
  const href = await link.getAttribute('href')
  const alvo = await link.getAttribute('target')
  const rel = ((await link.getAttribute('rel')) ?? '').split(/\s+/)
  const escrito = normalizar(await link.innerText())
  const nome = await nomeAcessivel(link)
  const caixa = await link.boundingBox()

  if (href !== DOC.enderecoDoInstagram)
    falhas.push(`destino "${href}", e não "${DOC.enderecoDoInstagram}"`)
  if (alvo !== '_blank') falhas.push(`target "${alvo}", e não "_blank"`)
  for (const parte of ['noopener', 'noreferrer'])
    if (!rel.includes(parte)) falhas.push(`rel "${rel.join(' ')}" sem ${parte}`)
  if (escrito !== DOC.instagram)
    falhas.push(`texto escrito "${escrito}", e não "${DOC.instagram}" (§1)`)
  /* WCAG 2.5.3: o nome contém o texto LIDO na tela; e diz o destino. */
  if (!escrito || !nome.includes(escrito))
    falhas.push(`nome acessível "${nome}" não contém o texto escrito "${escrito}"`)
  for (const parte of [/instagram/i, /nova aba/i])
    if (!parte.test(nome)) falhas.push(`nome acessível "${nome}" não diz ${parte}`)
  if (!caixa || caixa.width < ALVO_MINIMO || caixa.height < ALVO_MINIMO)
    falhas.push(`alvo de ${caixa?.width}x${caixa?.height} px, abaixo de ${ALVO_MINIMO} px`)

  /* O resultado, e não só o atributo: a aba nova é interceptada, sem sair da máquina. */
  const visto: { pedido: boolean; referer: string | undefined } = {
    pedido: false,
    referer: undefined,
  }
  await context.route(`${DOC.enderecoDoInstagram}**`, async (rota) => {
    visto.pedido = true
    visto.referer = rota.request().headers()['referer']
    await rota.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<title>interceptado</title>',
    })
  })
  const [aba] = await Promise.all([page.waitForEvent('popup'), link.click()])
  await aba.waitForLoadState()
  const temOpener = await aba.evaluate(() => window.opener !== null)
  const urlDaAba = aba.url()
  await aba.close()
  await context.unrouteAll()
  if (urlDaAba !== DOC.enderecoDoInstagram) falhas.push(`a aba nova abriu ${urlDaAba}`)
  if (temOpener) falhas.push('a aba nova tem window.opener')
  if (!visto.pedido) falhas.push('a aba nova não pediu o Instagram')
  if (visto.referer !== undefined) falhas.push(`a aba nova recebeu Referer "${visto.referer}"`)

  console.log(
    `[${informacoes.project.name}] link do aviso: ${href} · target ${alvo} · rel "${rel.join(' ')}"` +
      ` · escrito "${escrito}" · nome "${nome}" · caixa ${Math.round((caixa?.width ?? 0) * 100) / 100}x${Math.round((caixa?.height ?? 0) * 100) / 100}` +
      ` · aba nova: ${urlDaAba}, window.opener ${temOpener ? 'sim' : 'não'}, Referer ${visto.referer ?? 'ausente'}` +
      ` · conferências com falha: ${falhas.length}`
  )
  expect(falhas, `link do aviso com defeito:\n${falhas.join('\n')}`).toEqual([])
})
