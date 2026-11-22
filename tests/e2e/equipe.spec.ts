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
 * A PÁGINA EQUIPE PUBLICADA (pagina-sobre-e-equipe, design.md D5, D6 e D9,
 * item 1; spec pagina-equipe). Roda com o site publicado (a 3000, `baseURL`),
 * em cada uma das sete larguras.
 *
 * O texto NÃO está escrito aqui: os seis cargos e as linhas vêm do
 * docs/conteudo-institucional.md §4.3 (colunas "Cargo" e "Em uma linha"), os
 * fundadores do §4.2, os docentes do §4.1, e os rótulos da
 * REFERENCIA-VISUAL.md §7, lidos pelo sobre-e-equipe.ts. O que o protótipo
 * tinha de exemplo (os oito diretores inventados) é lido do protótipo.
 *
 * Cada medida diz quanto mediu (RP-12).
 */

const ENDERECO = '/equipe'

/*
 * O que a spec pagina-equipe manda não aparecer no texto visível ("O que o
 * protótipo tinha e a página não tem" e "Nada pendente nem de demonstração").
 * Os oito nomes, os oito cursos e a frase "Gestão 2026: …" são lidos do
 * protótipo e da REFERENCIA-VISUAL.md §7, e somam-se a estes.
 */
const PROIBIDOS_NO_TEXTO = [
  'Ligantes',
  'Foto do ligante',
  'Foto',
  '(nome pendente)',
  'Nomes e fotos entram pelo painel',
  'Pendente',
  '(pendente)',
  'Gestão 2026',
  'semestre',
]

/*
 * Q11 (a decidir pelo Gabriel): o cenário "O que o protótipo tinha e a página
 * não tem", da spec pagina-equipe, lido ao pé da letra, proíbe "Tesouraria" na
 * página. Mas a linha do §4.3 do Diretor(a) financeiro(a) é "Tesouraria,
 * balanços semestrais e captação de recursos", e ela vai ao ar: o cenário,
 * literal, contradiz o documento.
 *
 * Este spec confere a intenção do cenário, sem editar a spec:
 *
 *   - nenhum TÍTULO da página, de qualquer nível, é um dos oito cargos de
 *     exemplo do protótipo, lidos dele;
 *   - cada cargo de exemplo também fica ausente do TEXTO VISÍVEL inteiro, menos
 *     o que aparece dentro de uma linha do §4.3 (cargo ou "Em uma linha"),
 *     calculado aqui com a mesma busca, que diferencia maiúscula. Hoje só
 *     "Tesouraria" colide, e ela fica conferida só nos títulos. A saída
 *     imprime quem colide e em que linha (revisor, achado 1).
 *
 * Os nomes de exemplo, "Ligantes", "Foto", "(nome pendente)" e "Gestão 2026"
 * ficam ausentes do TEXTO VISÍVEL, e não do HTML cru: o JSON da lista no
 * <script> tem "semestre" (a descrição do Processo seletivo), e isso não é
 * texto da página.
 */
const CARGOS_DE_EXEMPLO = PROTOTIPO_DE_EXEMPLO.diretoria.map((d) => d.cargo)
const COLISOES_COM_O_DOCUMENTO = CARGOS_DE_EXEMPLO.flatMap((exemplo) => {
  const linha = DOC.cargos.find((c) => c.cargo.includes(exemplo) || c.linha.includes(exemplo))
  return linha ? [{ exemplo, motivo: `está na linha do §4.3 de "${linha.cargo}"` }] : []
})
const CARGOS_PROIBIDOS_NO_TEXTO = CARGOS_DE_EXEMPLO.filter(
  (exemplo) => !COLISOES_COM_O_DOCUMENTO.some((c) => c.exemplo === exemplo)
)

async function abrirPagina(page: Page) {
  await page.goto(ENDERECO)
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  await page.mouse.move(0, 0)
}

/* ------------------------------------------------------------------------ */
/* 1. O texto                                                                */
/* ------------------------------------------------------------------------ */

test('o texto da página é o do conteudo-institucional.md, cargo por cargo, e nada a mais', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const lido = await lerPagina(page)
  const [diretoria, fundadores, docentes] = lido.blocos

  const trechos: Trecho[] = [
    ...DOC.cargos.flatMap((cargo, i) => [
      {
        nome: `§4.3, cargo ${i + 1}`,
        esperado: cargo.cargo,
        recebido: diretoria?.itens[i]?.titulo ?? '(ausente)',
      },
      {
        nome: `§4.3, linha de "${cargo.cargo}"`,
        esperado: cargo.linha,
        recebido: diretoria?.itens[i]?.paragrafos.join(' | ') ?? '(ausente)',
      },
    ]),
    ...DOC.fundadores.map((nome, i) => ({
      nome: `§4.2, fundador ${i + 1}`,
      esperado: nome,
      recebido: fundadores?.itens[i]?.texto ?? '(ausente)',
    })),
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
    {
      nome: 'sobretítulo da faixa',
      esperado: ROTULOS.equipe.sobretitulo,
      recebido: lido.sobretituloDaFaixa,
    },
    { nome: 'título principal', esperado: ROTULOS.equipe.h1, recebido: lido.h1s.join(' | ') },
    {
      nome: 'frase da faixa (nenhuma)',
      esperado: '',
      recebido: lido.paragrafosDaFaixa.join(' | '),
    },
    ...ROTULOS.equipe.blocos.flatMap((bloco, i) => [
      {
        nome: `bloco ${i + 1}, título`,
        esperado: bloco.titulo,
        recebido: lido.blocos[i]?.titulo ?? '(ausente)',
      },
      {
        nome: `bloco ${i + 1}, sobretítulo (nenhum)`,
        esperado: '',
        recebido: lido.blocos[i]?.sobretitulo ?? '(ausente)',
      },
    ]),
    /* O título do bloco dos fundadores é o do §4.2 (Q8 (a)). */
    {
      nome: 'título do bloco dos fundadores igual ao do §4.2',
      esperado: DOC.tituloDo42,
      recebido: fundadores?.titulo ?? '(ausente)',
    },
  ]
  const iniciais = DOC.docentes.map((d) => iniciaisPelaRegraDoD6(d.nome))
  const decorativos: Trecho[] = iniciais.map((par, i) => ({
    nome: `iniciais do docente ${i + 1}, fora do leitor de tela`,
    esperado: par,
    recebido: docentes?.itens[i]?.decorativos.join(' | ') ?? '(ausente)',
  }))

  const falhas = compararTrechos([...trechos, ...rotulos, ...decorativos])
  const contagem = {
    cargos: diretoria?.itens.length ?? 0,
    fundadores: fundadores?.itens.length ?? 0,
    docentes: docentes?.itens.length ?? 0,
  }
  if (contagem.cargos !== DOC.cargos.length)
    falhas.push(`a página tem ${contagem.cargos} cargos, e o §4.3 ${DOC.cargos.length}`)
  if (contagem.fundadores !== DOC.fundadores.length)
    falhas.push(`a página tem ${contagem.fundadores} fundadores, e o §4.2 ${DOC.fundadores.length}`)
  if (contagem.docentes !== DOC.docentes.length)
    falhas.push(`a página tem ${contagem.docentes} docentes, e o §4.1 ${DOC.docentes.length}`)
  if (lido.h1s.length !== 1)
    falhas.push(`a página tem ${lido.h1s.length} títulos de nível 1: ${lido.h1s.join(' | ')}`)
  if (lido.blocos.length !== ROTULOS.equipe.blocos.length)
    falhas.push(
      `a página tem ${lido.blocos.length} blocos com h2, e não ${ROTULOS.equipe.blocos.length}`
    )
  /* Os fundadores são uma lista, sem foto, círculo nem curso: só o nome em cada item. */
  for (const [i, item] of (fundadores?.itens ?? []).entries()) {
    if (item.titulo !== null || item.paragrafos.length > 0 || item.decorativos.length > 0)
      falhas.push(`fundador ${i + 1} tem mais que o nome: "${item.texto}"`)
  }

  const sobra = sobraDoTexto(lido.textoDoConteudo, [
    ...trechos.flatMap((t) => t.esperado.split(' | ')),
    ...rotulos.map((t) => t.esperado),
    ...iniciais,
  ])
  if (sobra !== '')
    falhas.push(
      `texto no conteúdo que não está no documento nem nos rótulos: "${sobra.slice(0, 200)}"`
    )

  console.log(
    `[${informacoes.project.name}] trechos do conteudo-institucional.md conferidos: ${trechos.length}` +
      ` (§4.3 ${DOC.cargos.length * 2} · §4.2 ${DOC.fundadores.length} · §4.1 ${DOC.docentes.length * 2})` +
      ` · rótulos de interface conferidos: ${rotulos.length}` +
      ` · com divergência: ${falhas.filter((f) => f.startsWith('trecho')).length}\n` +
      `[${informacoes.project.name}] lidos do documento: cargos: ${DOC.cargos.length} · fundadores: ${DOC.fundadores.length} · docentes: ${DOC.docentes.length}` +
      ` · na página: cargos: ${contagem.cargos} · fundadores: ${contagem.fundadores} · docentes: ${contagem.docentes}` +
      ` · texto fora do documento: ${sobra.length} caracteres`
  )
  expect(falhas, `a página diverge do documento:\n${falhas.join('\n')}`).toEqual([])
})

test('a página não traz o que o protótipo tinha de exemplo nem marcador de pendente, e nenhum título é cargo de exemplo', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const texto = await textoVisivelDaPagina(page)
  const exemplos = PROTOTIPO_DE_EXEMPLO.diretoria
  const procurados = [
    ...PROIBIDOS_NO_TEXTO,
    ROTULOS.equipe.fraseDoPrototipo,
    ...exemplos.map((d) => d.nome),
    ...exemplos.map((d) => d.curso),
    ...CARGOS_PROIBIDOS_NO_TEXTO,
  ]
  const achados = procurados.filter((termo) => texto.includes(termo))
  /* Q11: a intenção do cenário, nos títulos. Todo título da página, de qualquer nível. */
  const titulos = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]')).map((h) =>
      (h.textContent ?? '').replace(/\s+/g, ' ').trim()
    )
  )
  const titulosDeExemplo = titulos.filter((t) => CARGOS_DE_EXEMPLO.includes(t))

  console.log(
    `[${informacoes.project.name}] termos proibidos procurados no texto visível: ${procurados.length}` +
      ` (${PROIBIDOS_NO_TEXTO.length} da spec · 1 frase da faixa do protótipo` +
      ` · ${exemplos.length} nomes, ${exemplos.length} cursos e ${CARGOS_PROIBIDOS_NO_TEXTO.length} cargos de exemplo do protótipo) · achados: ${achados.length}` +
      ` · caracteres lidos: ${texto.length}\n` +
      `[${informacoes.project.name}] títulos da página conferidos contra os ${CARGOS_DE_EXEMPLO.length} cargos de exemplo do protótipo (Q11): ${titulos.length}` +
      ` · iguais a um cargo de exemplo: ${titulosDeExemplo.length}
` +
      `[${informacoes.project.name}] cargos de exemplo procurados no texto visível: ${CARGOS_PROIBIDOS_NO_TEXTO.join(', ')}` +
      ` · só nos títulos, por colidir com o §4.3: ${COLISOES_COM_O_DOCUMENTO.map((c) => `"${c.exemplo}" (${c.motivo})`).join(', ') || 'nenhum'}`
  )
  expect(texto.length, 'o teste precisa ter lido texto').toBeGreaterThan(0)
  expect(titulos.length, 'o teste precisa ter lido títulos').toBeGreaterThan(0)
  expect(achados, `a página mostra: ${achados.join(' | ')}`).toEqual([])
  expect(
    titulosDeExemplo,
    `títulos que são cargos de exemplo do protótipo: ${titulosDeExemplo.join(' | ')}`
  ).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 2. Os cartões de cargo, as iniciais e a grade                             */
/* ------------------------------------------------------------------------ */

test('os seis cartões de cargo não têm círculo, borboleta nem imagem, e a grade tem 2 colunas no celular e 4 no desktop', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const largura = page.viewportSize()?.width ?? 0
  const medida = await page.getByRole('main').evaluate((main) => {
    const lista = main.querySelectorAll('h2')[0]?.closest('section')?.querySelector('ul, ol')
    const cartoes = Array.from(lista?.children ?? []).filter((e) => e.tagName === 'LI')
    const porCartao = cartoes.map((li) => {
      const elementos = [li, ...Array.from(li.querySelectorAll('*'))]
      const achados: string[] = []
      for (const e of elementos) {
        const nome = `<${e.tagName.toLowerCase()}>`
        if (e !== li && e.matches('img, svg, picture, video, canvas, [role="img"]'))
          achados.push(`${nome} imagem ou desenho`)
        if (e !== li && e.getAttribute('aria-hidden') === 'true') achados.push(`${nome} decorativo`)
        const estilo = getComputedStyle(e)
        if (estilo.backgroundImage !== 'none') achados.push(`${nome} com imagem de fundo`)
        const caixa = e.getBoundingClientRect()
        const raio = parseFloat(estilo.borderTopLeftRadius)
        if (
          e !== li &&
          caixa.width > 0 &&
          Math.abs(caixa.width - caixa.height) < 1 &&
          raio >= caixa.width / 2 - 0.5
        )
          achados.push(`${nome} redondo ${Math.round(caixa.width)} px`)
        for (const pseudo of ['::before', '::after']) {
          const p = getComputedStyle(e, pseudo)
          if (p.content !== 'none' && p.content !== 'normal')
            achados.push(`${nome}${pseudo} com conteúdo ${p.content}`)
        }
      }
      return {
        cargo: (li.querySelector('h3')?.textContent ?? '').trim(),
        achados,
        x: Math.round(li.getBoundingClientRect().left),
        y: Math.round(li.getBoundingClientRect().top),
      }
    })
    const primeiraLinha = porCartao.filter((c) => c.y === porCartao[0]?.y)
    return { cartoes: porCartao.length, porCartao, colunas: primeiraLinha.length }
  })

  const falhas = medida.porCartao.flatMap((c) => c.achados.map((a) => `cartão "${c.cargo}": ${a}`))
  const acusados = falhas.length
  const circulos = medida.porCartao.filter((c) => c.achados.length > 0).length
  if (medida.cartoes !== DOC.cargos.length)
    falhas.push(`${medida.cartoes} cartões de cargo, e não ${DOC.cargos.length}`)
  /* O corte do protótipo: 4 colunas acima de 1024 px, 2 até 1024 px (design.md, D5). */
  const colunasEsperadas = largura > 1024 ? 4 : 2
  if (medida.colunas !== colunasEsperadas)
    falhas.push(`a grade tem ${medida.colunas} colunas em ${largura} px, e não ${colunasEsperadas}`)

  console.log(
    `[${informacoes.project.name}] cartões de cargo medidos: ${medida.cartoes}` +
      ` · círculos nos cargos: ${circulos} (cartões com círculo, desenho ou imagem; elementos acusados: ${acusados})` +
      ` · colunas da grade: ${medida.colunas} (esperadas ${colunasEsperadas} em ${largura} px)`
  )
  expect(medida.cartoes, 'o teste precisa ter medido os cartões').toBeGreaterThan(0)
  expect(falhas, falhas.join('\n')).toEqual([])
})

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
