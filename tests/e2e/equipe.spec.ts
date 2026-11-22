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
const CARGOS_DE_EXEMPLO = PROTOTIPO_DE_EXEMPLO.diretoria.map((diretor) => diretor.cargo)
const COLISOES_COM_O_DOCUMENTO = CARGOS_DE_EXEMPLO.flatMap((exemplo) => {
  const linha = DOC.cargos.find(
    (doDocumento) => doDocumento.cargo.includes(exemplo) || doDocumento.linha.includes(exemplo)
  )
  return linha ? [{ exemplo, motivo: `está na linha do §4.3 de "${linha.cargo}"` }] : []
})
const CARGOS_PROIBIDOS_NO_TEXTO = CARGOS_DE_EXEMPLO.filter(
  (exemplo) => !COLISOES_COM_O_DOCUMENTO.some((colisao) => colisao.exemplo === exemplo)
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
    ...DOC.cargos.flatMap((cargo, indice) => [
      {
        nome: `§4.3, cargo ${indice + 1}`,
        esperado: cargo.cargo,
        recebido: diretoria?.itens[indice]?.titulo ?? '(ausente)',
      },
      {
        nome: `§4.3, linha de "${cargo.cargo}"`,
        esperado: cargo.linha,
        recebido: diretoria?.itens[indice]?.paragrafos.join(' | ') ?? '(ausente)',
      },
    ]),
    ...DOC.fundadores.map((nome, indice) => ({
      nome: `§4.2, fundador ${indice + 1}`,
      esperado: nome,
      recebido: fundadores?.itens[indice]?.texto ?? '(ausente)',
    })),
    ...DOC.docentes.flatMap((docente, indice) => [
      {
        nome: `§4.1, docente ${indice + 1}, nome`,
        esperado: docente.nome,
        recebido: docentes?.itens[indice]?.titulo ?? '(ausente)',
      },
      {
        nome: `§4.1, docente ${indice + 1}, cargo e formação`,
        esperado: `${docente.cargo} | ${docente.formacao}`,
        recebido: docentes?.itens[indice]?.paragrafos.join(' | ') ?? '(ausente)',
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
    {
      nome: 'título principal',
      esperado: ROTULOS.equipe.tituloPrincipal,
      recebido: lido.titulosPrincipais.join(' | '),
    },
    {
      nome: 'frase da faixa (nenhuma)',
      esperado: '',
      recebido: lido.paragrafosDaFaixa.join(' | '),
    },
    ...ROTULOS.equipe.blocos.flatMap((bloco, indice) => [
      {
        nome: `bloco ${indice + 1}, título`,
        esperado: bloco.titulo,
        recebido: lido.blocos[indice]?.titulo ?? '(ausente)',
      },
      {
        nome: `bloco ${indice + 1}, sobretítulo (nenhum)`,
        esperado: '',
        recebido: lido.blocos[indice]?.sobretitulo ?? '(ausente)',
      },
    ]),
    /* O título do bloco dos fundadores é o do §4.2 (Q8 (a)). */
    {
      nome: 'título do bloco dos fundadores igual ao do §4.2',
      esperado: DOC.tituloDosFundadores,
      recebido: fundadores?.titulo ?? '(ausente)',
    },
  ]
  const iniciais = DOC.docentes.map((docente) => iniciaisPelaRegraDoD6(docente.nome))
  const decorativos: Trecho[] = iniciais.map((par, indice) => ({
    nome: `iniciais do docente ${indice + 1}, fora do leitor de tela`,
    esperado: par,
    recebido: docentes?.itens[indice]?.decorativos.join(' | ') ?? '(ausente)',
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
  if (lido.titulosPrincipais.length !== 1)
    falhas.push(
      `a página tem ${lido.titulosPrincipais.length} títulos de nível 1: ${lido.titulosPrincipais.join(' | ')}`
    )
  if (lido.blocos.length !== ROTULOS.equipe.blocos.length)
    falhas.push(
      `a página tem ${lido.blocos.length} blocos com h2, e não ${ROTULOS.equipe.blocos.length}`
    )
  /* Os fundadores são uma lista, sem foto, círculo nem curso: só o nome em cada item. */
  for (const [posicao, item] of (fundadores?.itens ?? []).entries()) {
    if (item.titulo !== null || item.paragrafos.length > 0 || item.decorativos.length > 0)
      falhas.push(`fundador ${posicao + 1} tem mais que o nome: "${item.texto}"`)
  }

  const sobra = sobraDoTexto(lido.textoDoConteudo, [
    ...trechos.flatMap((trecho) => trecho.esperado.split(' | ')),
    ...rotulos.map((rotulo) => rotulo.esperado),
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
      ` · com divergência: ${falhas.filter((falha) => falha.startsWith('trecho')).length}\n` +
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
    ...exemplos.map((diretor) => diretor.nome),
    ...exemplos.map((diretor) => diretor.curso),
    ...CARGOS_PROIBIDOS_NO_TEXTO,
  ]
  const achados = procurados.filter((termo) => texto.includes(termo))
  /* Q11: a intenção do cenário, nos títulos. Todo título da página, de qualquer nível. */
  const titulos = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]')).map(
      (titulo) => (titulo.textContent ?? '').replace(/\s+/g, ' ').trim()
    )
  )
  const titulosDeExemplo = titulos.filter((titulo) => CARGOS_DE_EXEMPLO.includes(titulo))

  console.log(
    `[${informacoes.project.name}] termos proibidos procurados no texto visível: ${procurados.length}` +
      ` (${PROIBIDOS_NO_TEXTO.length} da spec · 1 frase da faixa do protótipo` +
      ` · ${exemplos.length} nomes, ${exemplos.length} cursos e ${CARGOS_PROIBIDOS_NO_TEXTO.length} cargos de exemplo do protótipo) · achados: ${achados.length}` +
      ` · caracteres lidos: ${texto.length}\n` +
      `[${informacoes.project.name}] títulos da página conferidos contra os ${CARGOS_DE_EXEMPLO.length} cargos de exemplo do protótipo (Q11): ${titulos.length}` +
      ` · iguais a um cargo de exemplo: ${titulosDeExemplo.length}
` +
      `[${informacoes.project.name}] cargos de exemplo procurados no texto visível: ${CARGOS_PROIBIDOS_NO_TEXTO.join(', ')}` +
      ` · só nos títulos, por colidir com o §4.3: ${COLISOES_COM_O_DOCUMENTO.map((colisao) => `"${colisao.exemplo}" (${colisao.motivo})`).join(', ') || 'nenhum'}`
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
    const cartoes = Array.from(lista?.children ?? []).filter((filho) => filho.tagName === 'LI')
    const porCartao = cartoes.map((cartao) => {
      const elementos = [cartao, ...Array.from(cartao.querySelectorAll('*'))]
      const achados: string[] = []
      for (const elemento of elementos) {
        const nome = `<${elemento.tagName.toLowerCase()}>`
        if (
          elemento !== cartao &&
          elemento.matches('img, svg, picture, video, canvas, [role="img"]')
        )
          achados.push(`${nome} imagem ou desenho`)
        if (elemento !== cartao && elemento.getAttribute('aria-hidden') === 'true')
          achados.push(`${nome} decorativo`)
        const estilo = getComputedStyle(elemento)
        if (estilo.backgroundImage !== 'none') achados.push(`${nome} com imagem de fundo`)
        const caixa = elemento.getBoundingClientRect()
        const raio = parseFloat(estilo.borderTopLeftRadius)
        if (
          elemento !== cartao &&
          caixa.width > 0 &&
          Math.abs(caixa.width - caixa.height) < 1 &&
          raio >= caixa.width / 2 - 0.5
        )
          achados.push(`${nome} redondo ${Math.round(caixa.width)} px`)
        for (const pseudo of ['::before', '::after']) {
          const estiloDoPseudo = getComputedStyle(elemento, pseudo)
          if (estiloDoPseudo.content !== 'none' && estiloDoPseudo.content !== 'normal')
            achados.push(`${nome}${pseudo} com conteúdo ${estiloDoPseudo.content}`)
        }
      }
      return {
        cargo: (cartao.querySelector('h3')?.textContent ?? '').trim(),
        achados,
        esquerda: Math.round(cartao.getBoundingClientRect().left),
        topo: Math.round(cartao.getBoundingClientRect().top),
      }
    })
    const primeiraLinha = porCartao.filter((medido) => medido.topo === porCartao[0]?.topo)
    return { cartoes: porCartao.length, porCartao, colunas: primeiraLinha.length }
  })

  const falhas = medida.porCartao.flatMap((medido) =>
    medido.achados.map((achado) => `cartão "${medido.cargo}": ${achado}`)
  )
  const acusados = falhas.length
  const circulos = medida.porCartao.filter((medido) => medido.achados.length > 0).length
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

/*
 * Os fundadores: 5 colunas acima de 1024 px, os cinco nomes numa linha só
 * (Gabriel, Q13 (b), 22/11/2026), e 2 colunas até 1024 px, o corte do
 * protótipo que a grade dos ligantes tinha.
 */
test('os fundadores ficam numa linha de 5 colunas no desktop e em 2 colunas até 1024 px', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const largura = page.viewportSize()?.width ?? 0
  const medida = await page.getByRole('main').evaluate((main) => {
    const lista = main.querySelectorAll('h2')[1]?.closest('section')?.querySelector('ul, ol')
    const topos = Array.from(lista?.children ?? [])
      .filter((filho) => filho.tagName === 'LI')
      .map((nome) => Math.round(nome.getBoundingClientRect().top))
    const linhas = [...new Set(topos)]
    return {
      nomes: topos.length,
      linhas: linhas.length,
      naPrimeiraLinha: topos.filter((topo) => topo === linhas[0]).length,
    }
  })
  const colunasEsperadas = largura > 1024 ? 5 : 2
  const falhas: string[] = []
  if (medida.nomes !== DOC.fundadores.length)
    falhas.push(`${medida.nomes} fundadores na grade, e não ${DOC.fundadores.length}`)
  if (medida.naPrimeiraLinha !== colunasEsperadas)
    falhas.push(
      `a grade dos fundadores tem ${medida.naPrimeiraLinha} colunas em ${largura} px, e não ${colunasEsperadas}`
    )
  if (largura > 1024 && medida.linhas !== 1)
    falhas.push(`os fundadores ocupam ${medida.linhas} linhas em ${largura} px, e não 1`)

  console.log(
    `[${informacoes.project.name}] fundadores medidos: ${medida.nomes}` +
      ` · colunas dos fundadores: ${medida.naPrimeiraLinha} (esperadas ${colunasEsperadas} em ${largura} px)` +
      ` · linhas: ${medida.linhas}`
  )
  expect(medida.nomes, 'o teste precisa ter medido os nomes').toBeGreaterThan(0)
  expect(falhas, falhas.join('\n')).toEqual([])
})

test('as iniciais dos docentes aparecem, ficam fora da árvore de acessibilidade e têm contraste medido; nenhuma imagem de pessoa', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const esperadas = DOC.docentes.map((docente) => iniciaisPelaRegraDoD6(docente.nome))
  const medida = await medirIniciais(page, esperadas)
  const { imagens } = await lerPagina(page)
  const projeto = informacoes.project.name
  console.log(
    `[${projeto}] iniciais: ${medida.foraDaArvoreNoDom.join(', ')} (fora da árvore de acessibilidade)` +
      ` · calculadas pela regra do D6 a partir de ${DOC.docentes.length} nomes do §4.1: ${esperadas.join(', ')}` +
      ` · visíveis: ${medida.visiveis.join(', ') || 'nenhuma'}` +
      ` · na árvore de acessibilidade: ${medida.naArvore.length}` +
      ` · imagens no conteúdo: ${imagens}\n` +
      medida.contrastes.map((linha) => `[${projeto}] contraste das iniciais ${linha}`).join('\n')
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
