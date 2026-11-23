import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import type { APIRequestContext, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { ORIGEM_NAO_PUBLICADO, ORIGEM_PUBLICADO } from '../../playwright.config'
import { TAGS_DO_AXE, primeiraLinha } from './apoio'
import { sobraDoTexto, textoVisivelDaPagina } from './sobre-e-equipe'

/*
 * A PÁGINA PROJETOS (pagina-projetos, design.md D4 e D6, item 1; spec
 * pagina-projetos). Roda com o site publicado (a 3000, `baseURL`), em cada uma
 * das sete larguras, e o interruptor nos dois modos (Q4 (a)).
 *
 * NENHUM TEXTO DA PÁGINA ESTÁ ESCRITO AQUI. Tudo é lido:
 *
 *   - do docs/conteudo-institucional.md §3: as quatro frentes. O nome é o
 *     título de nível 3 sem a nota "_( … )_" e sem o que vem depois de " — ";
 *     o texto é o parágrafo do título, ou, quando a seção tem citação (a
 *     Secretaria), a citação "> _…_", sem "> " e sem "_";
 *   - da docs/REFERENCIA-VISUAL.md §7, linha "Projetos, faixa do topo": o
 *     sobretítulo e o título principal, rótulos de interface;
 *   - do prototipo/Portal-LIACUP.html: a frase da faixa e o texto de exemplo
 *     dos cartões ("Descrição de … a ser escrita pela diretoria."), que NÃO vão
 *     ao ar, para provar que não foram sem copiá-los aqui.
 *
 * Se a leitura achar menos do que o documento tem, o spec para com a contagem,
 * em vez de conferir nada e ficar verde. Cada medida diz quanto mediu (RP-12).
 */

const ENDERECO = '/projetos'
const raiz = process.cwd()
const DOCUMENTO = readFileSync(join(raiz, 'docs', 'conteudo-institucional.md'), 'utf8')
const REFERENCIA = readFileSync(join(raiz, 'docs', 'REFERENCIA-VISUAL.md'), 'utf8')
const PROTOTIPO = readFileSync(join(raiz, 'prototipo', 'Portal-LIACUP.html'), 'utf8')

const normalizar = (texto: string) => texto.replace(/\s+/g, ' ').trim()
const escapar = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/* ------------------------------------------------------------------------ */
/* O documento, a referência e o protótipo                                   */
/* ------------------------------------------------------------------------ */

/* O §3 inteiro: do título "## 3." até o próximo título de nível 2. */
function secaoTres(): string {
  const comeco = DOCUMENTO.indexOf('\n## 3.')
  if (comeco === -1) throw new Error('conteudo-institucional.md sem a seção "## 3."')
  const resto = DOCUMENTO.slice(comeco + 1)
  const fim = resto.slice(1).search(/\n## /)
  return fim === -1 ? resto : resto.slice(0, fim + 1)
}

/* A nota de fonte do fim de um título, como "_(Estatuto, Art. 2º § 1º)_". */
const NOTA_DE_FONTE = /\s*_\(([^)]*)\)_\s*$/

type FrenteDoDocumento = { nome: string; texto: string; origem: string; nota: string | null }

/*
 * Os blocos de um título de nível 3: as citações ("> ") e os parágrafos (o
 * resto, separado por linha vazia), cada um numa linha só.
 */
function blocosDoCorpo(linhas: string[]) {
  const citacoes: string[] = []
  const paragrafos: string[] = []
  let atual: string[] = []
  let tipo: 'citacao' | 'paragrafo' | null = null
  const fechar = () => {
    if (atual.length > 0 && tipo)
      (tipo === 'citacao' ? citacoes : paragrafos).push(normalizar(atual.join(' ')))
    atual = []
    tipo = null
  }
  for (const linha of linhas) {
    if (linha.trim() === '') {
      fechar()
      continue
    }
    const tipoDaLinha = linha.startsWith('>') ? 'citacao' : 'paragrafo'
    if (tipo !== tipoDaLinha) fechar()
    tipo = tipoDaLinha
    atual.push(tipoDaLinha === 'citacao' ? linha.replace(/^>\s?/, '') : linha)
  }
  fechar()
  return { citacoes, paragrafos }
}

/*
 * As frentes do §3: todo título de nível 3 com nota de fonte ou com aviso
 * depois de " — ". O título que não tem nenhum dos dois ("Como o texto
 * provisório aparece no site") é explicação, e não frente; a saída o nomeia.
 */
function lerFrentes() {
  const blocos = secaoTres()
    .split(/\n(?=### )/)
    .slice(1)
  const frentes: FrenteDoDocumento[] = []
  const foraDasFrentes: string[] = []
  for (const bloco of blocos) {
    const [cabecalhoBruto = '', ...corpo] = bloco.split('\n')
    const cabecalho = cabecalhoBruto.replace(/^### /, '').trim()
    const nota = NOTA_DE_FONTE.exec(cabecalho)
    const semNota = nota ? cabecalho.slice(0, nota.index) : cabecalho
    const temAviso = semNota.includes(' — ')
    if (!nota && !temAviso) {
      foraDasFrentes.push(normalizar(cabecalho))
      continue
    }
    const nome = normalizar(semNota.split(' — ')[0] ?? '')
    const { citacoes, paragrafos } = blocosDoCorpo(corpo)
    let texto: string
    let origem: string
    if (citacoes.length > 0) {
      if (citacoes.length !== 1)
        throw new Error(`§3, "${nome}": ${citacoes.length} citações, e não 1`)
      texto = normalizar((citacoes[0] ?? '').replace(/^_(.*)_$/, '$1'))
      origem = 'citação'
    } else {
      if (paragrafos.length !== 1)
        throw new Error(`§3, "${nome}": ${paragrafos.length} parágrafos sem citação, e não 1`)
      texto = paragrafos[0] ?? ''
      origem = 'parágrafo'
    }
    if (!nome || !texto)
      throw new Error(`§3: frente sem nome ou sem texto no título "${cabecalho}"`)
    if (/[*_⚠]/.test(`${nome} ${texto}`))
      throw new Error(`§3, "${nome}": marca de Markdown ou aviso que sobrou na leitura: "${texto}"`)
    frentes.push({ nome, texto, origem, nota: nota ? `(${nota[1]})` : null })
  }
  if (frentes.length !== 4)
    throw new Error(
      `§3: ${frentes.length} frentes lidas (${frentes.map((frente) => frente.nome).join(', ')}), e não 4`
    )
  return { frentes, foraDasFrentes }
}

/* A linha "Projetos, faixa do topo" da REFERENCIA-VISUAL.md §7. */
function lerRotulos() {
  const linha = REFERENCIA.split('\n').find((linhaDaTabela) =>
    linhaDaTabela.startsWith('| Projetos, faixa do topo |')
  )
  if (!linha) throw new Error('REFERENCIA-VISUAL.md §7 sem a linha "Projetos, faixa do topo"')
  const sobretitulo = /Sobretítulo "([^"]+)"/.exec(linha)?.[1]
  const tituloPrincipal = /título principal "([^"]+)"/.exec(linha)?.[1]
  if (!sobretitulo || !tituloPrincipal)
    throw new Error(
      'REFERENCIA-VISUAL.md §7: sobretítulo ou título principal de Projetos não achado'
    )
  return { sobretitulo: normalizar(sobretitulo), tituloPrincipal: normalizar(tituloPrincipal) }
}

/*
 * O que o protótipo tinha e não vai ao ar. O arquivo traz o HTML dentro de um
 * texto com "\n" e a barra como "u002F", escritos com barra invertida.
 */
function lerPrototipo(tituloPrincipal: string, nomes: string[]) {
  const frase = new RegExp(
    `>${escapar(tituloPrincipal)}<\\\\u002Fh1>\\\\n\\s*<p[^>]*>([^<]+)<\\\\u002Fp>`
  ).exec(PROTOTIPO)?.[1]
  const modelo = />(Descrição de \{\{ p\.pilar \}\} [^<]+)<\\u002Fp>/.exec(PROTOTIPO)?.[1]
  if (!frase || !modelo)
    throw new Error(
      `protótipo: frase da faixa ${frase ? 'achada' : 'não achada'}, texto de exemplo dos cartões ${modelo ? 'achado' : 'não achado'}`
    )
  return {
    fraseDaFaixa: normalizar(frase),
    exemplosDosCartoes: nomes.map((nome) => normalizar(modelo.replace('{{ p.pilar }}', nome))),
  }
}

const DOC = lerFrentes()
const ROTULOS = lerRotulos()
const PROTOTIPO_DE_EXEMPLO = lerPrototipo(
  ROTULOS.tituloPrincipal,
  DOC.frentes.map((frente) => frente.nome)
)

/* ------------------------------------------------------------------------ */
/* A página                                                                  */
/* ------------------------------------------------------------------------ */

async function abrirPagina(page: Page) {
  await page.goto(ENDERECO)
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  await page.mouse.move(0, 0)
}

const PROPRIEDADES_DA_LETRA = [
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'color',
  'textTransform',
  'textDecorationLine',
] as const

type CartaoLido = {
  nome: string
  titulos: number
  paragrafos: string[]
  filhos: string[]
  descendentes: number
  letra: Record<string, string>
  esquerda: number
  topo: number
  altura: number
}

/*
 * O que o <main> mostra, lido pela estrutura (h1, h2, listas, parágrafos), e
 * não por classe CSS. Os cartões são os itens da lista que tem os h2.
 */
async function lerPagina(page: Page) {
  return page.evaluate((propriedades) => {
    const limpar = (texto: string | null | undefined) => (texto ?? '').replace(/\s+/g, ' ').trim()
    const main = document.querySelector('main')
    if (!main) throw new Error('a página não tem <main>')
    const h1s = Array.from(main.querySelectorAll('h1'))
    const tituloPrincipal = h1s[0]
    const faixa = tituloPrincipal?.closest('section') ?? null
    const anterior = tituloPrincipal?.previousElementSibling
    const titulos = Array.from(
      main.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]')
    ).map((titulo) => ({
      nivel: Number(titulo.getAttribute('aria-level') ?? titulo.tagName.slice(1)) || 0,
      texto: limpar(titulo.textContent),
    }))
    const h2s = Array.from(main.querySelectorAll('h2'))
    const lista = h2s[0]?.closest('ul, ol') ?? null
    const itens = Array.from(lista?.children ?? []).filter((filho) => filho.tagName === 'LI')
    const cartoes = itens.map((item) => {
      const paragrafo = item.querySelector('p')
      const estilo = paragrafo ? getComputedStyle(paragrafo) : null
      const letra: Record<string, string> = {}
      for (const propriedade of propriedades)
        letra[propriedade] = estilo ? String(estilo[propriedade]) : '(sem parágrafo)'
      const caixa = item.getBoundingClientRect()
      return {
        nome: limpar(item.querySelector('h2')?.textContent),
        titulos: item.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]').length,
        paragrafos: Array.from(item.querySelectorAll('p')).map((p) => limpar(p.textContent)),
        filhos: Array.from(item.children).map((filho) => filho.tagName.toLowerCase()),
        descendentes: item.querySelectorAll('*').length,
        letra,
        esquerda: Math.round(caixa.left),
        topo: Math.round(caixa.top),
        altura: Math.round(caixa.height * 10) / 10,
      }
    })
    /* Todo nó de texto do <main>, e não o innerText, que aplica o text-transform. */
    const partes: string[] = []
    const caminho = document.createTreeWalker(main, NodeFilter.SHOW_TEXT)
    for (let noDeTexto = caminho.nextNode(); noDeTexto; noDeTexto = caminho.nextNode())
      partes.push(noDeTexto.textContent ?? '')
    return {
      titulosPrincipais: h1s.map((titulo) => limpar(titulo.textContent)),
      sobretituloDaFaixa: anterior?.tagName === 'P' ? limpar(anterior.textContent) : '',
      paragrafosDaFaixa: Array.from(faixa?.querySelectorAll('p') ?? [])
        .filter((paragrafo) => paragrafo !== anterior)
        .map((paragrafo) => limpar(paragrafo.textContent)),
      titulos,
      h2s: h2s.map((titulo) => limpar(titulo.textContent)),
      h2sNaLista: h2s.filter((titulo) => lista && titulo.closest('li')?.parentElement === lista)
        .length,
      tipoDaLista: lista ? lista.tagName.toLowerCase() : null,
      cartoes: cartoes as CartaoLido[],
      textoDoConteudo: limpar(partes.join(' ')),
    }
  }, PROPRIEDADES_DA_LETRA)
}

type Trecho = { nome: string; esperado: string; recebido: string }

/* A primeira palavra que difere, para a falha dizer onde, e não só que difere. */
function primeiraDiferenca(esperado: string, recebido: string): string {
  const de = esperado.split(' ')
  const para = recebido.split(' ')
  const indice = de.findIndex((palavra, posicao) => palavra !== para[posicao])
  const posicao = indice === -1 ? de.length : indice
  return `palavra ${posicao + 1}: esperado "${de[posicao] ?? '(fim)'}", recebido "${para[posicao] ?? '(fim)'}"`
}

function compararTrechos(trechos: Trecho[]): string[] {
  return trechos
    .filter((trecho) => trecho.recebido !== trecho.esperado)
    .map(
      (trecho) =>
        `trecho "${trecho.nome}" difere do documento (${primeiraDiferenca(trecho.esperado, trecho.recebido)}):\n` +
        `    esperado: "${trecho.esperado}"\n    recebido: "${trecho.recebido}"`
    )
}

/* ------------------------------------------------------------------------ */
/* 1. O texto                                                                */
/* ------------------------------------------------------------------------ */

test('o texto da página é o do conteudo-institucional.md §3, frente por frente, e nada a mais', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const lido = await lerPagina(page)
  const falhas: string[] = []

  const trechos: Trecho[] = DOC.frentes.flatMap((frente, indice) => {
    const cartao = lido.cartoes.find((lidoNaPagina) => lidoNaPagina.nome === frente.nome)
    if (!cartao) falhas.push(`a frente "${frente.nome}" do §3 não está na página`)
    return [
      {
        nome: `§3, nome da frente ${indice + 1}`,
        esperado: frente.nome,
        recebido: lido.cartoes[indice]?.nome ?? '(ausente)',
      },
      {
        nome: `§3, texto de "${frente.nome}" (${frente.origem})`,
        esperado: frente.texto,
        recebido: cartao?.paragrafos.join(' | ') ?? '(ausente)',
      },
    ]
  })
  /* Rótulos de interface: REFERENCIA-VISUAL.md §7, "Projetos, faixa do topo" (Q2 (a)). */
  const rotulos: Trecho[] = [
    {
      nome: 'sobretítulo da faixa',
      esperado: ROTULOS.sobretitulo,
      recebido: lido.sobretituloDaFaixa,
    },
    {
      nome: 'título principal',
      esperado: ROTULOS.tituloPrincipal,
      recebido: lido.titulosPrincipais.join(' | '),
    },
    {
      nome: 'frase da faixa (nenhuma)',
      esperado: '',
      recebido: lido.paragrafosDaFaixa.join(' | '),
    },
  ]
  falhas.push(...compararTrechos([...trechos, ...rotulos]))
  if (lido.cartoes.length !== DOC.frentes.length)
    falhas.push(`a página tem ${lido.cartoes.length} cartões, e o §3 ${DOC.frentes.length} frentes`)

  const sobra = sobraDoTexto(lido.textoDoConteudo, [
    ...trechos.map((trecho) => trecho.esperado),
    ...rotulos.map((rotulo) => rotulo.esperado),
  ])
  if (sobra !== '')
    falhas.push(
      `texto no conteúdo que não está no documento nem nos rótulos: "${sobra.slice(0, 200)}"`
    )

  const projeto = informacoes.project.name
  console.log(
    `[${projeto}] trechos do conteudo-institucional.md §3 conferidos: ${trechos.length}` +
      ` (${DOC.frentes.length} nomes · ${DOC.frentes.length} textos) · rótulos de interface conferidos: ${rotulos.length}` +
      ` · com divergência: ${falhas.filter((falha) => falha.startsWith('trecho')).length}\n` +
      `[${projeto}] lidos do documento: frentes: ${DOC.frentes.length}` +
      ` (${DOC.frentes.map((frente) => `${frente.nome}, ${frente.origem}, ${frente.texto.length} caracteres`).join(' · ')})` +
      ` · títulos de nível 3 do §3 fora das frentes: ${DOC.foraDasFrentes.length} (${DOC.foraDasFrentes.join(', ')})` +
      ` · notas de fonte tiradas: ${DOC.frentes.filter((frente) => frente.nota).length}\n` +
      `[${projeto}] na página: cartões: ${lido.cartoes.length} (${lido.cartoes.map((cartao) => cartao.nome).join(', ')})` +
      ` · texto fora do documento: ${sobra.length} caracteres`
  )
  expect(falhas, `a página diverge do documento:\n${falhas.join('\n')}`).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 2. O que não vai ao ar                                                    */
/* ------------------------------------------------------------------------ */

/*
 * O que a spec pagina-projetos manda não aparecer ("Nada pendente nem de
 * demonstração", "A Secretaria sem marca de rascunho", "Sem nota de fonte" e
 * "A palavra certa"), e a lista do design.md D6. A frase da faixa e os
 * exemplos dos cartões vêm do protótipo; as notas de fonte, do §3.
 */
const PROIBIDOS_DA_SPEC = [
  'Pendente',
  'a ser escrita',
  'texto provisório',
  'pendente de confirmação',
  'O Estatuto não descreve',
  'Estatuto',
  'eixo',
  'eixos',
  'mídia e comunicação',
  '⚠',
]

test('a página não traz marcador de rascunho, nota de fonte, "eixo" nem o que o protótipo tinha de exemplo', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const texto = await textoVisivelDaPagina(page)
  const notas = DOC.frentes.flatMap((frente) => (frente.nota ? [frente.nota] : []))
  const procurados = [
    ...PROIBIDOS_DA_SPEC,
    PROTOTIPO_DE_EXEMPLO.fraseDaFaixa,
    ...PROTOTIPO_DE_EXEMPLO.exemplosDosCartoes,
    ...notas,
  ]
  /* O texto visível de cada região, para a falha dizer onde o termo está. */
  const regioes = await page.evaluate(() => {
    const porRegiao = new Map<string, string[]>()
    const caminho = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let noDeTexto = caminho.nextNode(); noDeTexto; noDeTexto = caminho.nextNode()) {
      const pai = noDeTexto.parentElement
      if (!pai || pai.closest('script, style, noscript, template')) continue
      const cartao = pai.closest('main li')
      const regiao = cartao
        ? `cartão "${(cartao.querySelector('h2')?.textContent ?? '').trim()}"`
        : pai.closest('main section:has(h1)')
          ? 'faixa do topo'
          : pai.closest('dialog')
            ? 'menu lateral'
            : pai.closest('header')
              ? 'cabeçalho'
              : pai.closest('footer')
                ? 'rodapé'
                : pai.closest('main')
                  ? 'resto do conteúdo'
                  : 'fora das regiões'
      porRegiao.set(regiao, [...(porRegiao.get(regiao) ?? []), noDeTexto.textContent ?? ''])
    }
    return Array.from(porRegiao, ([onde, partes]) => ({
      onde,
      texto: partes.join(' ').replace(/\s+/g, ' '),
    }))
  })
  /* Palavra inteira, sem diferenciar maiúscula: "eixo" não acha "deixou". */
  const acha = (termo: string, onde: string) =>
    new RegExp(`(?<!\\p{L})${escapar(termo)}(?!\\p{L})`, 'iu').test(onde)
  const achados = procurados
    .filter((termo) => acha(termo, texto))
    .map((termo) => {
      const onde = regioes
        .filter((regiao) => acha(termo, regiao.texto))
        .map((regiao) => regiao.onde)
      return `"${termo}" em ${onde.join(', ') || 'texto que atravessa regiões'}`
    })

  console.log(
    `[${informacoes.project.name}] termos proibidos procurados no texto visível: ${procurados.length}` +
      ` (${PROIBIDOS_DA_SPEC.length} da spec · 1 frase da faixa do protótipo` +
      ` · ${PROTOTIPO_DE_EXEMPLO.exemplosDosCartoes.length} exemplos dos cartões do protótipo · ${notas.length} notas de fonte do §3)` +
      ` · achados: ${achados.length} · regiões lidas: ${regioes.length} · caracteres lidos: ${texto.length}`
  )
  expect(texto.length, 'o teste precisa ter lido texto').toBeGreaterThan(0)
  expect(achados, `a página mostra:\n${achados.join('\n')}`).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 3. A estrutura, a grade e a letra da Secretaria                           */
/* ------------------------------------------------------------------------ */

test('um h1, quatro h2 na ordem do §3 numa lista de quatro cartões, sem caixa interna, e a Secretaria com a letra das outras', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const lido = await lerPagina(page)
  const falhas: string[] = []
  const nomes = DOC.frentes.map((frente) => frente.nome)

  if (lido.titulosPrincipais.length !== 1)
    falhas.push(`a página tem ${lido.titulosPrincipais.length} títulos de nível 1`)
  if (JSON.stringify(lido.h2s) !== JSON.stringify(nomes))
    falhas.push(`os h2 são ${JSON.stringify(lido.h2s)}, e não ${JSON.stringify(nomes)}`)
  /* Nenhum título pula nível. */
  lido.titulos.forEach((titulo, posicao) => {
    const anterior = posicao === 0 ? 0 : (lido.titulos[posicao - 1]?.nivel ?? 0)
    if (titulo.nivel > anterior + 1)
      falhas.push(
        `o título "${titulo.texto}" é de nível ${titulo.nivel} logo depois de um de nível ${anterior}`
      )
  })
  if (lido.h2sNaLista !== nomes.length)
    falhas.push(
      `${lido.h2sNaLista} dos ${lido.h2s.length} h2 estão em itens da mesma lista, e não ${nomes.length}`
    )

  /* Como o leitor de tela anuncia: a árvore de acessibilidade do Chromium. */
  const listaAnunciada = page
    .getByRole('main')
    .getByRole('list')
    .filter({ has: page.getByRole('heading', { level: 2 }) })
  const listasAnunciadas = await listaAnunciada.count()
  const itensAnunciados =
    listasAnunciadas === 1 ? await listaAnunciada.getByRole('listitem').count() : 0
  if (listasAnunciadas !== 1 || itensAnunciados !== nomes.length)
    falhas.push(
      `listas anunciadas com os cartões: ${listasAnunciadas}, com ${itensAnunciados} itens, e não 1 com ${nomes.length}`
    )

  /* Cada cartão: só o h2 e o parágrafo, sem caixa interna, selo nem outro título. */
  for (const cartao of lido.cartoes) {
    if (
      JSON.stringify(cartao.filhos) !== '["h2","p"]' ||
      cartao.descendentes !== 2 ||
      cartao.titulos !== 1
    )
      falhas.push(
        `cartão "${cartao.nome}": filhos ${JSON.stringify(cartao.filhos)}, ${cartao.descendentes} elementos dentro e ${cartao.titulos} títulos, e não h2 e p só`
      )
  }

  /* Q5 (a): a Secretaria com a letra, o estilo e a cor das outras três, sem itálico. */
  const referencia = lido.cartoes.find((cartao) => cartao.nome !== 'Secretaria')
  const secretaria = lido.cartoes.find((cartao) => cartao.nome === 'Secretaria')
  if (!referencia || !secretaria)
    falhas.push('não achei o cartão da Secretaria e um das outras para comparar')
  for (const cartao of lido.cartoes) {
    for (const propriedade of PROPRIEDADES_DA_LETRA) {
      if (referencia && cartao.letra[propriedade] !== referencia.letra[propriedade])
        falhas.push(
          `a frente "${cartao.nome}" tem ${propriedade} "${cartao.letra[propriedade]}", e "${referencia.nome}" "${referencia.letra[propriedade]}"`
        )
    }
    if (cartao.letra.fontStyle !== 'normal')
      falhas.push(
        `a frente "${cartao.nome}" tem fontStyle "${cartao.letra.fontStyle}", e não "normal"`
      )
  }

  /* O corte do protótipo, lido pelo dev: 1 coluna até 768 px, 2 acima (D4). */
  const largura = page.viewportSize()?.width ?? 0
  const colunasEsperadas = largura > 768 ? 2 : 1
  const colunas = new Set(lido.cartoes.map((cartao) => cartao.esquerda)).size
  if (colunas !== colunasEsperadas)
    falhas.push(`a grade tem ${colunas} colunas em ${largura} px, e não ${colunasEsperadas}`)
  /* Cartões da mesma linha com a mesma altura (D4). */
  const linhas = [...new Set(lido.cartoes.map((cartao) => cartao.topo))].map((topo) =>
    lido.cartoes.filter((cartao) => cartao.topo === topo)
  )
  for (const linha of linhas) {
    const alturas = linha.map((cartao) => cartao.altura)
    if (Math.max(...alturas) - Math.min(...alturas) > 1)
      falhas.push(
        `cartões ${linha.map((cartao) => `"${cartao.nome}" ${cartao.altura} px`).join(' e ')} na mesma linha, com alturas diferentes`
      )
  }

  const letraDaSecretaria = secretaria
    ? PROPRIEDADES_DA_LETRA.map(
        (propriedade) => `${propriedade} ${secretaria.letra[propriedade]}`
      ).join(', ')
    : 'não medida'
  console.log(
    `[${informacoes.project.name}] títulos: h1 ${lido.titulosPrincipais.length} · h2 ${lido.h2s.length} (${lido.h2s.join(', ')})` +
      ` · títulos lidos: ${lido.titulos.length} · lista <${lido.tipoDaLista}> anunciada: ${listasAnunciadas} com ${itensAnunciados} itens` +
      ` · cartões medidos: ${lido.cartoes.length}\n` +
      `[${informacoes.project.name}] colunas da grade: ${colunas} (esperadas ${colunasEsperadas} em ${largura} px)` +
      ` · linhas: ${linhas.length} · alturas por linha: ${linhas.map((linha) => linha.map((cartao) => cartao.altura).join('/')).join(' · ')}\n` +
      `[${informacoes.project.name}] letra do texto comparada em ${lido.cartoes.length} cartões, ${PROPRIEDADES_DA_LETRA.length} propriedades cada · Secretaria: ${letraDaSecretaria}`
  )
  expect(lido.cartoes.length, 'o teste precisa ter medido os cartões').toBeGreaterThan(0)
  expect(falhas, falhas.join('\n')).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 4. axe e rolagem                                                          */
/* ------------------------------------------------------------------------ */

test('o axe não acusa violação e não há rolagem horizontal', async ({ page }, informacoes) => {
  await abrirPagina(page)
  const resultado = await new AxeBuilder({ page }).withTags(TAGS_DO_AXE).analyze()
  const violacoes = resultado.violations.map(
    (violacao) => `${violacao.id} (${violacao.nodes.length} elementos): ${violacao.help}`
  )
  const rolagem = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  const projeto = informacoes.project.name
  console.log(
    `[${projeto}] ${ENDERECO} Violacoes de acessibilidade: ${violacoes.length}` +
      ` · regras aplicadas: ${resultado.passes.length + resultado.violations.length}\n` +
      `[${projeto}] ${ENDERECO} rolagem horizontal: scrollWidth ${rolagem.scrollWidth} / clientWidth ${rolagem.clientWidth}`
  )
  expect(violacoes, `axe em ${ENDERECO}:\n${violacoes.join('\n')}`).toEqual([])
  expect(rolagem.scrollWidth).toBeLessThanOrEqual(rolagem.clientWidth)
})

/* ------------------------------------------------------------------------ */
/* 5. O interruptor (Q4 (a))                                                 */
/* ------------------------------------------------------------------------ */

const TITULO_EM_CONSTRUCAO = 'Portal em construção'

/* A origem que a conferência do 307 pede. É o servidor não publicado, a 3001. */
const ORIGEM_DA_CONFERENCIA_DO_307 = ORIGEM_NAO_PUBLICADO

type PrimeiraResposta = { status: number; destino: string | null }

/* A primeira resposta, sem seguir redirecionamento, com o caminho do destino. */
async function primeiraResposta(
  request: APIRequestContext,
  origem: string
): Promise<PrimeiraResposta> {
  const resposta = await request.get(`${origem}${ENDERECO}`, { maxRedirects: 0 })
  const location = resposta.headers()['location']
  return {
    status: resposta.status(),
    destino: location === undefined ? null : new URL(location, origem).pathname,
  }
}

const descrever = (resposta: PrimeiraResposta) =>
  `${resposta.status} ${resposta.destino === null ? 'sem Location' : `para ${resposta.destino}`}`

test('o interruptor: /projetos leva 307 para / no não publicado, chegando à página em construção, e responde 200 sem Location no publicado', async ({
  page,
  request,
}, informacoes) => {
  const falhas: string[] = []
  const verificados: string[] = []

  /* Não publicado: 307 para /, e, seguido, a página em construção inteira. */
  const naoPublicado = await primeiraResposta(request, ORIGEM_DA_CONFERENCIA_DO_307)
  if (naoPublicado.status !== 307 || naoPublicado.destino !== '/') {
    falhas.push(
      `modo não publicado: ${ENDERECO} recebeu ${descrever(naoPublicado)} (esperado 307 para /)`
    )
  } else {
    try {
      await page.goto(`${ORIGEM_NAO_PUBLICADO}${ENDERECO}`)
      const caminhoFinal = new URL(page.url()).pathname
      expect(caminhoFinal, `${ENDERECO} terminou em ${caminhoFinal}, e não em /`).toBe('/')
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITULO_EM_CONSTRUCAO)
      const logo = page.getByAltText('Logo da LIACUP')
      await expect(logo).toBeVisible()
      await expect
        .poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth))
        .toBeGreaterThan(0)
      const contato = page.getByLabel('Canais de contato da LIACUP')
      await expect(contato.getByRole('link', { name: '@liacup.unb' })).toHaveAttribute(
        'href',
        'https://www.instagram.com/liacup.unb/'
      )
      await expect(contato.getByRole('link', { name: 'liacup.unb@gmail.com' })).toHaveAttribute(
        'href',
        'mailto:liacup.unb@gmail.com'
      )
      verificados.push(
        `não publicado ${descrever(naoPublicado)}, seguido até a página em construção`
      )
    } catch (erro) {
      falhas.push(`modo não publicado, depois do redirecionamento: ${primeiraLinha(erro)}`)
    }
  }

  /* Publicado: 200, sem redirecionamento. */
  const publicado = await primeiraResposta(request, ORIGEM_PUBLICADO)
  if (publicado.status !== 200 || publicado.destino !== null)
    falhas.push(
      `modo publicado: ${ENDERECO} recebeu ${descrever(publicado)} (esperado 200 sem Location)`
    )
  else verificados.push(`publicado ${descrever(publicado)}`)

  console.log(
    `[${informacoes.project.name}] projetos no interruptor: ${verificados.length} de 2 modos\n  ` +
      verificados.join('\n  ')
  )
  expect(falhas, `interruptor com defeito em ${ENDERECO}:\n${falhas.join('\n')}`).toEqual([])
  expect(verificados).toHaveLength(2)
})
