import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { TAGS_DO_AXE } from './apoio'
import {
  DOC,
  PROTOTIPO_DE_EXEMPLO,
  ROTULOS,
  compararTrechos,
  iniciaisPelaRegraDoD6,
  lerPagina,
  medirIniciais,
  sobraDoTexto,
  textoVisivelDaPagina,
} from './sobre-e-equipe'
import type { Trecho } from './sobre-e-equipe'

/*
 * A PÁGINA SOBRE PUBLICADA (pagina-sobre-e-equipe, design.md D4, D6 e D9,
 * item 1; spec pagina-sobre). Roda com o site publicado (a 3000, `baseURL`),
 * em cada uma das sete larguras.
 *
 * O texto NÃO está escrito aqui: vem do docs/conteudo-institucional.md (§2.1
 * a §2.6 e §4.1) e os rótulos da REFERENCIA-VISUAL.md §7, lidos pelo
 * sobre-e-equipe.ts. A nota de fonte do fim do §2.4, "(Estatuto, Art. 2º)",
 * fica fora da página e da comparação (Q10 (a)). Se uma palavra da página
 * diferir do documento, o spec fica vermelho com o trecho, o esperado e o
 * recebido.
 *
 * Cada medida diz quanto mediu (RP-12).
 */

const ENDERECO = '/sobre'

/*
 * O que a spec pagina-sobre manda não aparecer ("Nada pendente nem de
 * demonstração"). São marcas do protótipo, e não texto da liga. O título e a
 * frase da faixa do protótipo e os cinco objetivos de exemplo são lidos da
 * REFERENCIA-VISUAL.md §7 e do protótipo.
 */
const PROIBIDOS_DA_SPEC = [
  'Pendente',
  '(pendente)',
  'Foto',
  'Foto de uma atividade da Liga',
  'Texto da história da Liga a ser escrito pela diretoria',
  'painel administrativo',
]

async function abrirPagina(page: Page) {
  await page.goto(ENDERECO)
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  await page.mouse.move(0, 0)
}

const numeroDoItem = (indice: number) => String(indice + 1).padStart(2, '0')

/* ------------------------------------------------------------------------ */
/* 1. O texto                                                                */
/* ------------------------------------------------------------------------ */

test('o texto da página é o do conteudo-institucional.md, sem a nota de fonte do §2.4, e nada a mais', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const lido = await lerPagina(page)
  const [historia, objetivos, docentes] = lido.blocos

  const trechos: Trecho[] = [
    {
      nome: '§2.1, apresentação',
      esperado: DOC.apresentacao.paragrafos.join(' | '),
      recebido: lido.paragrafosDaFaixa.join(' | '),
    },
    {
      nome: '§2.2, história',
      esperado: DOC.historia.paragrafos.join(' | '),
      recebido: historia?.paragrafos.join(' | ') ?? '(ausente)',
    },
    ...DOC.itens.flatMap((item, i) => [
      {
        nome: `§${item.numero}, nome do item ${numeroDoItem(i)}`,
        esperado: item.nome,
        recebido: objetivos?.itens[i]?.titulo ?? '(ausente)',
      },
      ...item.paragrafos.map((paragrafo, j) => ({
        nome: `§${item.numero}, parágrafo ${j + 1}`,
        esperado: paragrafo,
        recebido: objetivos?.itens[i]?.paragrafos[j] ?? '(ausente)',
      })),
    ]),
    ...DOC.docentes.flatMap((docente, i) => [
      {
        nome: `§4.1, docente ${i + 1}, nome`,
        esperado: docente.nome,
        recebido: docentes?.itens[i]?.titulo ?? '(ausente)',
      },
      {
        nome: `§4.1, docente ${i + 1}, cargo e formação`,
        esperado: `${docente.cargo} | ${docente.formacao}`,
        recebido: docentes?.itens[i]?.paragrafos.join(' | ') ?? '(ausente)',
      },
    ]),
  ]
  /* Rótulos de interface: REFERENCIA-VISUAL.md §7 (Q2 (b) e Q4 (a)). */
  const rotulos: Trecho[] = [
    { nome: 'título principal', esperado: ROTULOS.sobre.h1, recebido: lido.h1s.join(' | ') },
    { nome: 'sobretítulo da faixa (nenhum)', esperado: '', recebido: lido.sobretituloDaFaixa },
    ...ROTULOS.sobre.blocos.flatMap((bloco, i) => [
      {
        nome: `bloco ${i + 1}, título`,
        esperado: bloco.titulo,
        recebido: lido.blocos[i]?.titulo ?? '(ausente)',
      },
      {
        nome: `bloco ${i + 1}, sobretítulo`,
        esperado: bloco.sobretitulo,
        recebido: lido.blocos[i]?.sobretitulo ?? '(ausente)',
      },
    ]),
  ]
  /* O número de cada item é decorativo, e o par de iniciais sai do nome pela regra do D6. */
  const numeros = DOC.itens.map((_, i) => numeroDoItem(i))
  const iniciais = DOC.docentes.map((d) => iniciaisPelaRegraDoD6(d.nome))
  const decorativos: Trecho[] = [
    ...numeros.map((numero, i) => ({
      nome: `número do item ${numero}, fora do leitor de tela`,
      esperado: numero,
      recebido: objetivos?.itens[i]?.decorativos.join(' | ') ?? '(ausente)',
    })),
    ...iniciais.map((par, i) => ({
      nome: `iniciais do docente ${i + 1}, fora do leitor de tela`,
      esperado: par,
      recebido: docentes?.itens[i]?.decorativos.join(' | ') ?? '(ausente)',
    })),
  ]

  const falhas = compararTrechos([...trechos, ...rotulos, ...decorativos])
  if (lido.h1s.length !== 1)
    falhas.push(`a página tem ${lido.h1s.length} títulos de nível 1: ${lido.h1s.join(' | ')}`)
  if (lido.blocos.length !== ROTULOS.sobre.blocos.length)
    falhas.push(
      `a página tem ${lido.blocos.length} blocos com h2, e não ${ROTULOS.sobre.blocos.length}`
    )
  if (objetivos?.tipoDaLista !== 'ol')
    falhas.push(
      `os itens do que a Liga se propõe a fazer estão em <${objetivos?.tipoDaLista}>, e não numa lista ordenada <ol>`
    )
  if ((objetivos?.itens.length ?? 0) !== DOC.itens.length)
    falhas.push(
      `a página tem ${objetivos?.itens.length ?? 0} itens, e o documento ${DOC.itens.length}`
    )
  if ((docentes?.itens.length ?? 0) !== DOC.docentes.length)
    falhas.push(
      `a página tem ${docentes?.itens.length ?? 0} docentes, e o documento ${DOC.docentes.length}`
    )
  if ((historia?.itens.length ?? 0) !== 0)
    falhas.push(`o bloco da história tem ${historia?.itens.length} itens de lista, e não 0`)

  /* Nada a mais: sem os trechos, os rótulos, os números e as iniciais, não sobra texto no <main>. */
  const sobra = sobraDoTexto(lido.textoDoConteudo, [
    ...trechos.flatMap((t) => t.esperado.split(' | ')),
    ...rotulos.map((t) => t.esperado),
    ...numeros,
    ...iniciais,
  ])
  if (sobra !== '')
    falhas.push(
      `texto no conteúdo que não está no documento nem nos rótulos: "${sobra.slice(0, 200)}"`
    )

  const p = informacoes.project.name
  const paragrafosPorSecao = [DOC.apresentacao, DOC.historia, ...DOC.itens]
    .map((s) => `§${s.numero} ${s.paragrafos.length}`)
    .join(' · ')
  const notas = [DOC.apresentacao, DOC.historia, ...DOC.itens].flatMap((s) =>
    s.notas.map((nota) => `${nota} do §${s.numero}`)
  )
  console.log(
    `[${p}] trechos do conteudo-institucional.md conferidos: ${trechos.length}` +
      ` (§2.1 1 · §2.2 1 · §2.3 a §2.6 ${DOC.itens.reduce((n, i) => n + 1 + i.paragrafos.length, 0)} · §4.1 ${DOC.docentes.length * 2})` +
      ` · rótulos de interface conferidos: ${rotulos.length} · decorativos conferidos: ${decorativos.length}` +
      ` · com divergência: ${falhas.filter((f) => f.startsWith('trecho')).length}\n` +
      `[${p}] parágrafos lidos por seção: ${paragrafosPorSecao}` +
      ` · itens: ${DOC.itens.length} · parágrafos dos itens: ${DOC.itens.reduce((n, i) => n + i.paragrafos.length, 0)}\n` +
      `[${p}] notas de fonte tiradas da comparação: ${notas.length} (${notas.join(', ') || 'nenhuma'})` +
      ` · texto fora do documento: ${sobra.length} caracteres\n` +
      DOC.docentes
        .map(
          (d, i) =>
            `[${p}] docente ${i + 1} do §4.1: nome "${d.nome}" · cargo "${d.cargo}" · formação "${d.formacao}"`
        )
        .join('\n')
  )
  expect(falhas, `a página diverge do documento:\n${falhas.join('\n')}`).toEqual([])
})

test('a página não traz nota de fonte, marcador de pendente nem o que o protótipo tinha de exemplo', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const texto = await textoVisivelDaPagina(page)
  const notas = [DOC.apresentacao, DOC.historia, ...DOC.itens].flatMap((s) => s.notas)
  const procurados = [
    ...PROIBIDOS_DA_SPEC,
    ROTULOS.sobre.tituloDoPrototipo,
    PROTOTIPO_DE_EXEMPLO.fraseDaMetamorfose,
    ...PROTOTIPO_DE_EXEMPLO.objetivos,
    ...notas,
    /* Q10 (a): nenhuma nota de fonte, nem outra que não a do §2.4. */
    'Estatuto',
  ]
  const achados = procurados.filter((termo) => texto.includes(termo))
  /* "Kerolyn Ramos" só pode aparecer seguido de "Garcia" (spec pagina-sobre). */
  const kerolynSemGarcia = (texto.match(/Kerolyn Ramos(?! Garcia)/g) ?? []).length
  console.log(
    `[${informacoes.project.name}] termos proibidos procurados: ${procurados.length}` +
      ` (${PROIBIDOS_DA_SPEC.length} da spec · 1 título e 1 frase da faixa do protótipo` +
      ` · ${PROTOTIPO_DE_EXEMPLO.objetivos.length} objetivos de exemplo do protótipo` +
      ` · ${notas.length + 1} de nota de fonte) · achados: ${achados.length}` +
      ` · "Kerolyn Ramos" sem "Garcia": ${kerolynSemGarcia} · caracteres lidos: ${texto.length}`
  )
  expect(texto.length, 'o teste precisa ter lido texto').toBeGreaterThan(0)
  expect(achados, `a página mostra: ${achados.join(' | ')}`).toEqual([])
  expect(kerolynSemGarcia, 'o nome da docente aparece como "Kerolyn Ramos" sozinho').toBe(0)
})

/* ------------------------------------------------------------------------ */
/* 2. As iniciais e o que é decorativo                                       */
/* ------------------------------------------------------------------------ */

test('as iniciais dos docentes aparecem, ficam fora da árvore de acessibilidade e têm contraste medido; nenhuma imagem de pessoa', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const esperadas = DOC.docentes.map((d) => iniciaisPelaRegraDoD6(d.nome))
  const medida = await medirIniciais(page, esperadas)
  const { imagens } = await lerPagina(page)
  const p = informacoes.project.name
  console.log(
    `[${p}] iniciais: ${medida.foraDaArvoreNoDom.join(', ')} (fora da árvore de acessibilidade)` +
      ` · calculadas pela regra do D6 a partir de ${DOC.docentes.length} nomes do §4.1: ${esperadas.join(', ')}` +
      ` · visíveis: ${medida.visiveis.join(', ') || 'nenhuma'}` +
      ` · na árvore de acessibilidade: ${medida.naArvore.length}` +
      ` · imagens no conteúdo: ${imagens}\n` +
      medida.contrastes.map((linha) => `[${p}] contraste das iniciais ${linha}`).join('\n')
  )
  expect(
    medida.falhas,
    `iniciais com defeito em ${ENDERECO}:\n${medida.falhas.join('\n')}`
  ).toEqual([])
  expect(medida.contrastes).toHaveLength(esperadas.length)
  expect(imagens, 'imagem no conteúdo, e a liga não mandou foto').toBe(0)
})

test('o quadro da história e as borboletas são decorativos e não ficam por cima de texto; o quadro fica ao lado no desktop e abaixo no celular', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const largura = page.viewportSize()?.width ?? 0
  const medida = await page.getByRole('main').evaluate((main) => {
    const desenhos = Array.from(main.querySelectorAll('svg'))
    const visiveis = desenhos.filter((d) =>
      d.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
    )
    const historia = main.querySelectorAll('h2')[0]?.closest('section')
    const quadro = Array.from(
      historia?.querySelectorAll<HTMLElement>('[aria-hidden="true"]') ?? []
    ).find((e) => e.tagName === 'DIV')
    const texto = historia?.querySelector('h2 ~ p')
    const linhas: { texto: string; caixa: DOMRect }[] = []
    const percurso = document.createTreeWalker(main, NodeFilter.SHOW_TEXT)
    for (let no = percurso.nextNode(); no; no = percurso.nextNode()) {
      const conteudo = no.textContent?.trim() ?? ''
      if (!conteudo || !no.parentElement?.checkVisibility()) continue
      if (no.parentElement.closest('[aria-hidden="true"]')) continue
      const faixa = document.createRange()
      faixa.selectNodeContents(no)
      for (const caixa of Array.from(faixa.getClientRects())) {
        if (caixa.width > 0 && caixa.height > 0)
          linhas.push({ texto: conteudo.slice(0, 30), caixa })
      }
    }
    const sobreposicoes: string[] = []
    let comparacoes = 0
    const caixas = [
      ...visiveis.map((d) => ({
        nome: `borboleta ${String(d.getAttribute('class'))}`,
        caixa: d.getBoundingClientRect(),
      })),
      ...(quadro ? [{ nome: 'quadro da história', caixa: quadro.getBoundingClientRect() }] : []),
    ]
    for (const { nome, caixa } of caixas) {
      for (const linha of linhas) {
        comparacoes += 1
        const l = Math.min(caixa.right, linha.caixa.right) - Math.max(caixa.left, linha.caixa.left)
        const a = Math.min(caixa.bottom, linha.caixa.bottom) - Math.max(caixa.top, linha.caixa.top)
        if (l > 0.5 && a > 0.5) sobreposicoes.push(`${nome} sobre "${linha.texto}"`)
      }
    }
    const q = quadro?.getBoundingClientRect()
    const t = texto?.getBoundingClientRect()
    return {
      desenhos: desenhos.length,
      foraDoLeitor: desenhos.filter((d) => d.closest('[aria-hidden="true"]')).length,
      quadro: quadro
        ? {
            texto: (quadro.textContent ?? '').trim(),
            borboletas: quadro.querySelectorAll('svg').length,
            focaveis: quadro.querySelectorAll('a[href], button, [tabindex]').length,
          }
        : null,
      posicao:
        q && t
          ? {
              aoLado: q.left >= t.right - 1 && q.top < t.bottom,
              abaixo: q.top >= t.bottom - 1,
              texto: `texto x ${Math.round(t.left)}-${Math.round(t.right)} y ${Math.round(t.top)}-${Math.round(t.bottom)}`,
              quadro: `quadro x ${Math.round(q.left)}-${Math.round(q.right)} y ${Math.round(q.top)}-${Math.round(q.bottom)}`,
            }
          : null,
      linhas: linhas.length,
      caixas: caixas.length,
      comparacoes,
      sobreposicoes,
    }
  })

  const falhas: string[] = [...medida.sobreposicoes]
  if (medida.desenhos === 0) falhas.push('nenhuma borboleta na página')
  if (medida.foraDoLeitor !== medida.desenhos)
    falhas.push(`${medida.desenhos - medida.foraDoLeitor} desenhos anunciados ao leitor de tela`)
  if (!medida.quadro) falhas.push('o quadro da foto da história não foi encontrado')
  else {
    if (medida.quadro.texto !== '') falhas.push(`texto no quadro: "${medida.quadro.texto}"`)
    if (medida.quadro.borboletas === 0) falhas.push('o quadro está sem a borboleta da liga')
    if (medida.quadro.focaveis > 0) falhas.push('controle focável dentro do quadro decorativo')
  }
  /* No gabarito: lado a lado em 1280 e empilhado em 390 (design.md, D4). */
  if (largura === 1280 && !medida.posicao?.aoLado)
    falhas.push(
      `em 1280 px o quadro não está ao lado do texto: ${medida.posicao?.texto} · ${medida.posicao?.quadro}`
    )
  if (largura === 390 && !medida.posicao?.abaixo)
    falhas.push(
      `em 390 px o quadro não está abaixo do texto: ${medida.posicao?.texto} · ${medida.posicao?.quadro}`
    )

  console.log(
    `[${informacoes.project.name}] desenhos: ${medida.desenhos} · fora do leitor de tela: ${medida.foraDoLeitor}` +
      ` · quadro: ${medida.quadro ? `${medida.quadro.borboletas} borboleta(s), ${medida.quadro.texto.length} caracteres de texto` : 'ausente'}` +
      ` · posição: ${medida.posicao ? (medida.posicao.aoLado ? 'ao lado' : medida.posicao.abaixo ? 'abaixo' : 'outra') : 'não medida'}` +
      ` (${medida.posicao?.texto} · ${medida.posicao?.quadro})` +
      `\n[${informacoes.project.name}] caixas decorativas: ${medida.caixas} · linhas de texto: ${medida.linhas}` +
      ` · comparações: ${medida.comparacoes} · por cima de texto: ${medida.sobreposicoes.length}`
  )
  expect(medida.linhas).toBeGreaterThan(0)
  expect(falhas, falhas.join('\n')).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 3. axe e rolagem                                                          */
/* ------------------------------------------------------------------------ */

test('o axe não acusa violação e não há rolagem horizontal', async ({ page }, informacoes) => {
  await abrirPagina(page)
  const resultado = await new AxeBuilder({ page }).withTags(TAGS_DO_AXE).analyze()
  const violacoes = resultado.violations.map(
    (v) => `${v.id} (${v.nodes.length} elementos): ${v.help}`
  )
  const rolagem = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  const p = informacoes.project.name
  console.log(
    `[${p}] ${ENDERECO} Violacoes de acessibilidade: ${violacoes.length}` +
      ` · regras aplicadas: ${resultado.passes.length + resultado.violations.length}\n` +
      `[${p}] ${ENDERECO} rolagem horizontal: scrollWidth ${rolagem.scrollWidth} / clientWidth ${rolagem.clientWidth}`
  )
  expect(violacoes, `axe em ${ENDERECO}:\n${violacoes.join('\n')}`).toEqual([])
  expect(rolagem.scrollWidth).toBeLessThanOrEqual(rolagem.clientWidth)
})
