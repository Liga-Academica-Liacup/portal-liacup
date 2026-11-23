import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import type { APIRequestContext, Locator, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { LARGURAS, ORIGEM_NAO_PUBLICADO, ORIGEM_PUBLICADO } from '../../playwright.config'
import { ALVO_MINIMO, TAGS_DO_AXE, primeiraLinha } from './apoio'
import { textoVisivelDaPagina } from './sobre-e-equipe'

/*
 * A PÁGINA CONTATO (pagina-contato, design.md D4 e D6, item 1; spec
 * pagina-contato). Roda com o site publicado (a 3000, `baseURL`), em cada uma
 * das sete larguras, e o interruptor nos dois modos.
 *
 * NENHUM TEXTO DA PÁGINA ESTÁ ESCRITO AQUI. Tudo é lido:
 *
 *   - do docs/conteudo-institucional.md §1, pela coluna "Campo" da tabela: o @
 *     da linha "Instagram" (o trecho entre crases, sem "**" e sem
 *     " — confirmado"), o e-mail da linha "E-mail" (sem crases) e a sede da
 *     linha "Sede", com " — " trocado por " · " (Q2 (b)), contando as trocas;
 *   - da docs/REFERENCIA-VISUAL.md §7: os rótulos da linha "Contato, página",
 *     o corte da composição (Q3 (b)) e, da linha dos links do Instagram e do
 *     e-mail, o destino do Instagram;
 *   - do prototipo/Portal-LIACUP.html: a frase de baixo do título, os textos
 *     do formulário e os dados de exemplo dos canais, que NÃO vão ao ar, para
 *     provar que não foram sem copiá-los aqui.
 *
 * Se a leitura achar menos do que o documento tem, o spec para com a contagem,
 * em vez de conferir nada e ficar verde. Cada medida diz quanto mediu (RP-12).
 */

const ENDERECO = '/contato'
const raiz = process.cwd()
const DOCUMENTO = readFileSync(join(raiz, 'docs', 'conteudo-institucional.md'), 'utf8')
const REFERENCIA = readFileSync(join(raiz, 'docs', 'REFERENCIA-VISUAL.md'), 'utf8')
const PROTOTIPO = readFileSync(join(raiz, 'prototipo', 'Portal-LIACUP.html'), 'utf8')

const normalizar = (texto: string) => texto.replace(/\s+/g, ' ').trim()
const escapar = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/* ------------------------------------------------------------------------ */
/* O documento, a referência e o protótipo                                   */
/* ------------------------------------------------------------------------ */

/* O §1 inteiro: do título "## 1." até o próximo título de nível 2. */
function secaoUm(): string {
  const comeco = DOCUMENTO.indexOf('\n## 1.')
  if (comeco === -1) throw new Error('conteudo-institucional.md sem a seção "## 1."')
  const resto = DOCUMENTO.slice(comeco + 1)
  const fim = resto.slice(1).search(/\n## /)
  return fim === -1 ? resto : resto.slice(0, fim + 1)
}

/* A célula "Valor" da linha da tabela do §1 cujo "Campo", sem "**", é `campo`. */
function valorDoCampo(campo: string): string {
  const linhas = secaoUm()
    .split('\n')
    .filter((linha) => linha.startsWith('|'))
    .map((linha) => linha.split('|').map((celula) => celula.trim()))
    .filter((celulas) => celulas[1]?.replace(/\*\*/g, '') === campo)
  if (linhas.length !== 1)
    throw new Error(`§1: ${linhas.length} linhas com o campo "${campo}" na tabela, e não 1`)
  return linhas[0]?.[2] ?? ''
}

function lerDocumento() {
  const celulaDoInstagram = valorDoCampo('Instagram')
  const celulaDoEmail = valorDoCampo('E-mail')
  const celulaDaSede = valorDoCampo('Sede')
  const instagram = /`([^`]+)`/.exec(celulaDoInstagram)?.[1] ?? ''
  const email = /^`([^`]+)`$/.exec(celulaDoEmail)?.[1] ?? ''
  const travessoes = celulaDaSede.split(' — ').length - 1
  const sede = normalizar(celulaDaSede.split(' — ').join(' · '))
  if (!instagram.startsWith('@') || !email.includes('@') || !sede)
    throw new Error(
      `§1: Instagram "${instagram}", e-mail "${email}" ou sede "${sede}" não lidos da tabela`
    )
  if (/[*`—]/.test(`${instagram} ${email} ${sede}`))
    throw new Error(`§1: marca de Markdown ou travessão que sobrou na leitura`)
  if (travessoes !== 1)
    throw new Error(`§1, "Sede": ${travessoes} travessões trocados por " · ", e não 1`)
  return { instagram, email, sede, travessoes }
}

/* A linha "Contato, página" e a dos links do Instagram e do e-mail, da §7. */
function lerReferencia() {
  const linhaDe = (comeco: string) => {
    const linha = REFERENCIA.split('\n').find((linhaDaTabela) => linhaDaTabela.startsWith(comeco))
    if (!linha) throw new Error(`REFERENCIA-VISUAL.md §7 sem a linha "${comeco}"`)
    return linha
  }
  const contato = linhaDe('| Contato, página |')
  const links = linhaDe('| Inicial, Contato e rodapé, links do Instagram e do e-mail |')
  const sobretitulo = /Sobretítulo "([^"]+)"/.exec(contato)?.[1]
  const tituloPrincipal = /título principal "([^"]+)"/.exec(contato)?.[1]
  const quadros = /quadros, nesta ordem: "([^"]+)", "([^"]+)" e "([^"]+)"/.exec(contato)
  const corte = Number(/até (\d+) px/.exec(contato)?.[1])
  const destinoDoInstagram = /abre `(https:\/\/[^`]+)`/.exec(links)?.[1]
  if (!sobretitulo || !tituloPrincipal || !quadros || !corte || !destinoDoInstagram)
    throw new Error(
      'REFERENCIA-VISUAL.md §7: sobretítulo, título, rótulos dos quadros, corte ou destino do Instagram não achados'
    )
  return {
    sobretitulo: normalizar(sobretitulo),
    tituloPrincipal: normalizar(tituloPrincipal),
    quadros: [quadros[1], quadros[2], quadros[3]].map((rotulo) => normalizar(rotulo ?? '')),
    corte,
    destinoDoInstagram,
  }
}

/*
 * O que o protótipo tinha e não vai ao ar. O arquivo traz o HTML dentro de um
 * texto com "\n", as aspas como \" e a barra como "u002F", com barra invertida.
 */
function lerPrototipo(tituloPrincipal: string, valoresCertos: string[], rotulos: string[]) {
  const inicio = PROTOTIPO.indexOf(`>${tituloPrincipal}<\\u002Fh1>`)
  const fim = PROTOTIPO.indexOf('<\\u002Fsection>', inicio)
  if (inicio === -1 || fim === -1) throw new Error('protótipo: seção Contato não achada')
  const secao = PROTOTIPO.slice(inicio, fim)
  const todos = (padrao: RegExp, onde: string) =>
    Array.from(onde.matchAll(padrao), (achado) => normalizar(achado[1] ?? '')).filter(Boolean)

  const frase = /^>[^<]+<\\u002Fh1>\\n\s*<p[^>]*>([^<]+)<\\u002Fp>/.exec(secao)?.[1]
  const formulario = secao.slice(secao.indexOf('<h2'))
  const textosDoFormulario = [
    ...todos(/<h2[^>]*>([^<]+)<\\u002Fh2>/g, formulario),
    ...todos(/<label[^>]*>([^<]+)<\\u002Flabel>/g, formulario),
    ...todos(/placeholder=\\"([^\\"]+)\\"/g, formulario),
    ...todos(/<option>([^<]+)<\\u002Foption>/g, formulario),
    ...todos(/<button[^>]*>([^<]+)<\\u002Fbutton>/g, formulario),
  ]
  /* Rótulo do formulário que também é rótulo de interface da §7 ("E-mail") não é proibido. */
  const doFormulario = textosDoFormulario.filter((texto) => !rotulos.includes(texto))
  const comoRotulo = textosDoFormulario.filter((texto) => rotulos.includes(texto))

  const canais = /canais: \[([\s\S]*?)\]/.exec(PROTOTIPO)?.[1] ?? ''
  const exemplosDosCanais = [
    ...todos(/placeholder: \\?"([^"\\]+)\\?"/g, canais),
    ...todos(/nota: \\?"([^"\\]+)\\?"/g, canais),
    ...todos(/valor: \\?"([^"\\]+)\\?"/g, canais).filter((valor) => !valoresCertos.includes(valor)),
  ]
  if (!frase || textosDoFormulario.length < 5 || exemplosDosCanais.length < 3)
    throw new Error(
      `protótipo: frase ${frase ? 'achada' : 'não achada'}, ${textosDoFormulario.length} textos do formulário, ${exemplosDosCanais.length} exemplos dos canais`
    )
  return {
    frase: normalizar(frase),
    doFormulario: [...new Set(doFormulario)],
    comoRotulo,
    exemplosDosCanais: [...new Set(exemplosDosCanais)],
    camposDoFormulario: (formulario.match(/<(input|textarea|sc-raw-select|select)\b/g) ?? [])
      .length,
  }
}

const DOC = lerDocumento()
const ROTULOS = lerReferencia()
const VALORES = [DOC.instagram, DOC.email, DOC.sede]
const PROTOTIPO_DE_EXEMPLO = lerPrototipo(ROTULOS.tituloPrincipal, VALORES, ROTULOS.quadros)

/* Os dois quadros que são links (§7, "links do Instagram e do e-mail"). */
const LINKS = [
  {
    rotulo: ROTULOS.quadros[0] ?? '',
    valor: DOC.instagram,
    href: ROTULOS.destinoDoInstagram,
    novaAba: true,
  },
  {
    rotulo: ROTULOS.quadros[1] ?? '',
    valor: DOC.email,
    href: `mailto:${DOC.email}`,
    novaAba: false,
  },
]

/* ------------------------------------------------------------------------ */
/* A página                                                                  */
/* ------------------------------------------------------------------------ */

async function abrirPagina(page: Page) {
  await page.goto(ENDERECO)
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  await page.mouse.move(0, 0)
}

type QuadroLido = {
  tag: string
  visiveis: string[]
  soParaLeitor: string[]
  links: number
  dentroDeLink: boolean
}

/*
 * O que o <main> mostra, lido pela estrutura (h1, a lista, os itens), e não
 * por classe CSS. Texto "só para leitor de tela" é o de elemento com 1 px ou
 * menos: não é texto visível, e sai à parte.
 */
async function lerPagina(page: Page) {
  return page.evaluate(() => {
    const limpar = (texto: string | null | undefined) => (texto ?? '').replace(/\s+/g, ' ').trim()
    const main = document.querySelector('main')
    if (!main) throw new Error('a página não tem <main>')
    const ehSoParaLeitor = (elemento: Element) => {
      const caixa = elemento.getBoundingClientRect()
      return caixa.width <= 1 && caixa.height <= 1
    }
    const textosDe = (raizDoTexto: Element) => {
      const visiveis: string[] = []
      const soParaLeitor: string[] = []
      const caminho = document.createTreeWalker(raizDoTexto, NodeFilter.SHOW_TEXT)
      for (let no = caminho.nextNode(); no; no = caminho.nextNode()) {
        const pai = no.parentElement
        const texto = limpar(no.textContent)
        if (!pai || !texto || pai.closest('script, style, noscript, template')) continue
        if (pai.closest('[aria-hidden="true"]')) continue
        ;(ehSoParaLeitor(pai) ? soParaLeitor : visiveis).push(texto)
      }
      return { visiveis, soParaLeitor }
    }
    const h1s = Array.from(main.querySelectorAll('h1'))
    const titulo = h1s[0]
    const topo = titulo?.parentElement ?? null
    const anterior = titulo?.previousElementSibling
    const listas = Array.from(main.querySelectorAll('ul, ol'))
    const lista = listas[0] ?? null
    const itens = Array.from(lista?.children ?? []).filter((filho) => filho.tagName === 'LI')
    const quadros = itens.map((item) => {
      const quadro = item.firstElementChild
      return {
        tag: quadro ? quadro.tagName.toLowerCase() : '(nenhum)',
        ...textosDe(item),
        links: item.querySelectorAll('a').length,
        dentroDeLink: item.closest('a') !== null,
      }
    })
    const imagens = Array.from(main.querySelectorAll('img, svg')).map((imagem) => ({
      tag: imagem.tagName.toLowerCase(),
      alt: imagem.getAttribute('alt'),
      escondida: imagem.closest('[aria-hidden="true"]') !== null,
    }))
    return {
      titulosPrincipais: h1s.map((h1) => limpar(h1.textContent)),
      titulos: Array.from(main.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]')).map(
        (elemento) => `${elemento.tagName.toLowerCase()} "${limpar(elemento.textContent)}"`
      ),
      sobretitulo: anterior?.tagName === 'P' ? limpar(anterior.textContent) : '',
      frasesDoTopo: Array.from(topo?.querySelectorAll('p') ?? [])
        .filter((paragrafo) => paragrafo !== anterior)
        .map((paragrafo) => limpar(paragrafo.textContent)),
      listas: listas.length,
      tipoDaLista: lista ? lista.tagName.toLowerCase() : null,
      quadros: quadros as QuadroLido[],
      imagens,
      campos: document.querySelectorAll('form, input, textarea, select').length,
      botoesNoConteudo: main.querySelectorAll('button, [role="button"]').length,
      ...textosDe(main),
    }
  })
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
        `trecho "${trecho.nome}" difere (${primeiraDiferenca(trecho.esperado, trecho.recebido)}):\n` +
        `    esperado: "${trecho.esperado}"\n    recebido: "${trecho.recebido}"`
    )
}

/* ------------------------------------------------------------------------ */
/* 1. O texto                                                                */
/* ------------------------------------------------------------------------ */

test('o @, o e-mail e a sede são os do conteudo-institucional.md §1, os rótulos são os da §7, e nada a mais', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const lido = await lerPagina(page)
  const falhas: string[] = []
  const quadro = (indice: number) => lido.quadros[indice]

  for (const [indice, item] of lido.quadros.entries())
    if (item.visiveis.length !== 2)
      falhas.push(
        `quadro ${indice + 1}: ${item.visiveis.length} textos visíveis (${JSON.stringify(item.visiveis)}), e não 2, o rótulo e o dado`
      )

  const trechos: Trecho[] = [
    {
      nome: '§1, Instagram',
      esperado: DOC.instagram,
      recebido: quadro(0)?.visiveis[1] ?? '(ausente)',
    },
    { nome: '§1, E-mail', esperado: DOC.email, recebido: quadro(1)?.visiveis[1] ?? '(ausente)' },
    {
      nome: '§1, Sede, com " — " trocado por " · "',
      esperado: DOC.sede,
      recebido: quadro(2)?.visiveis[1] ?? '(ausente)',
    },
  ]
  const rotulos: Trecho[] = [
    { nome: 'sobretítulo', esperado: ROTULOS.sobretitulo, recebido: lido.sobretitulo },
    {
      nome: 'título principal',
      esperado: ROTULOS.tituloPrincipal,
      recebido: lido.titulosPrincipais.join(' | '),
    },
    ...ROTULOS.quadros.map((rotulo, indice) => ({
      nome: `rótulo do quadro ${indice + 1}`,
      esperado: rotulo,
      recebido: quadro(indice)?.visiveis[0] ?? '(ausente)',
    })),
    {
      nome: 'frase abaixo do título (nenhuma)',
      esperado: '',
      recebido: lido.frasesDoTopo.join(' | '),
    },
  ]
  falhas.push(...compararTrechos([...trechos, ...rotulos]))
  if (lido.quadros.length !== ROTULOS.quadros.length)
    falhas.push(`a página tem ${lido.quadros.length} quadros, e a §7 ${ROTULOS.quadros.length}`)

  /* Tirado cada esperado, uma vez, o que sobra é texto que ninguém registrou. */
  let sobra = lido.visiveis.join(' ')
  for (const esperado of [...trechos, ...rotulos]
    .map((trecho) => trecho.esperado)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length))
    sobra = sobra.replace(esperado, ' ')
  sobra = normalizar(sobra)
  if (sobra !== '')
    falhas.push(
      `texto no conteúdo que não está no documento nem nos rótulos: "${sobra.slice(0, 200)}"`
    )

  const projeto = informacoes.project.name
  console.log(
    `[${projeto}] trechos do conteudo-institucional.md §1 conferidos: ${trechos.length}` +
      ` (Instagram, E-mail, Sede) · rótulos da §7 conferidos: ${rotulos.length}` +
      ` · com divergência: ${falhas.filter((falha) => falha.startsWith('trecho')).length}\n` +
      `[${projeto}] travessões trocados: ${DOC.travessoes} · lidos do §1: "${DOC.instagram}", "${DOC.email}", sede com ${DOC.sede.length} caracteres\n` +
      `[${projeto}] quadros: ${lido.quadros.length} · texto fora do documento: ${sobra.length} caracteres` +
      ` · texto só para leitor de tela: ${lido.soParaLeitor.length} trecho(s) ${JSON.stringify(lido.soParaLeitor)}`
  )
  expect(falhas, `a página diverge do documento:\n${falhas.join('\n')}`).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 2. O que não vai ao ar                                                    */
/* ------------------------------------------------------------------------ */

/* Spec pagina-contato, "Nada errado nem de demonstração", e design.md D6. */
const PROIBIDOS_DA_SPEC = [
  'liacup@unb.br',
  'Faculdade de Medicina',
  'Darcy Ribeiro',
  'Perfil do Instagram',
  'Logo do e-mail',
  'Foto de perfil',
  'Reuniões',
  'Imprensa',
  '—',
]

/* O texto de cada região da página, para a falha dizer onde o termo está. */
async function textoPorRegiao(page: Page, so: 'pagina' | 'conteudo') {
  return page.evaluate((escopo) => {
    const porRegiao = new Map<string, string[]>()
    const raizDoTexto = escopo === 'conteudo' ? document.querySelector('main') : document.body
    if (!raizDoTexto) return []
    const caminho = document.createTreeWalker(raizDoTexto, NodeFilter.SHOW_TEXT)
    for (let no = caminho.nextNode(); no; no = caminho.nextNode()) {
      const pai = no.parentElement
      if (!pai || pai.closest('script, style, noscript, template')) continue
      const item = pai.closest('main li')
      const regiao = item
        ? `quadro ${Array.from(item.parentElement?.children ?? []).indexOf(item) + 1}`
        : pai.closest('main')
          ? 'topo do conteúdo'
          : pai.closest('dialog')
            ? 'menu lateral'
            : pai.closest('header')
              ? 'cabeçalho'
              : pai.closest('footer')
                ? 'rodapé'
                : 'fora das regiões'
      porRegiao.set(regiao, [...(porRegiao.get(regiao) ?? []), no.textContent ?? ''])
    }
    return Array.from(porRegiao, ([onde, partes]) => ({
      onde,
      texto: partes.join(' ').replace(/\s+/g, ' '),
    }))
  }, so)
}

test('a página não traz dado errado, legenda de exemplo, travessão, a frase nem o formulário do protótipo', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const texto = await textoVisivelDaPagina(page)
  const naPagina = [...PROIBIDOS_DA_SPEC, ...PROTOTIPO_DE_EXEMPLO.exemplosDosCanais]
  const noConteudo = [PROTOTIPO_DE_EXEMPLO.frase, ...PROTOTIPO_DE_EXEMPLO.doFormulario]
  const regioesDaPagina = await textoPorRegiao(page, 'pagina')
  const regioesDoConteudo = await textoPorRegiao(page, 'conteudo')
  const textoDoConteudo = regioesDoConteudo.map((regiao) => regiao.texto).join(' ')

  /* Palavra inteira, sem diferenciar maiúscula: "Nome" não acha "Nomes". */
  const acha = (termo: string, onde: string) =>
    /\p{L}/u.test(termo)
      ? new RegExp(`(?<!\\p{L})${escapar(termo)}(?!\\p{L})`, 'iu').test(onde)
      : onde.includes(termo)
  const procurar = (termos: string[], onde: string, regioes: { onde: string; texto: string }[]) =>
    termos
      .filter((termo) => acha(termo, onde))
      .map((termo) => {
        const lugares = regioes.filter((regiao) => acha(termo, regiao.texto)).map((r) => r.onde)
        return `"${termo}" em ${lugares.join(', ') || 'texto que atravessa regiões'}`
      })
  const achados = [
    ...procurar(naPagina, texto, regioesDaPagina),
    ...procurar(noConteudo, textoDoConteudo, regioesDoConteudo),
  ]
  const campos = await page.locator('form, input, textarea, select').count()
  if (campos !== 0) achados.push(`${campos} campos de formulário na página`)

  console.log(
    `[${informacoes.project.name}] termos proibidos procurados: ${naPagina.length + noConteudo.length}` +
      ` (${PROIBIDOS_DA_SPEC.length} da spec e ${PROTOTIPO_DE_EXEMPLO.exemplosDosCanais.length} exemplos dos canais do protótipo, na página inteira;` +
      ` a frase e ${PROTOTIPO_DE_EXEMPLO.doFormulario.length} textos do formulário do protótipo, no conteúdo)` +
      ` · achados: ${achados.length} · campos de formulário: ${campos}` +
      ` (o protótipo tem ${PROTOTIPO_DE_EXEMPLO.camposDoFormulario}) · regiões lidas: ${regioesDaPagina.length}` +
      ` · caracteres lidos: ${texto.length}` +
      ` · do formulário fora da busca por serem rótulo da §7: ${JSON.stringify(PROTOTIPO_DE_EXEMPLO.comoRotulo)}`
  )
  expect(texto.length, 'o teste precisa ter lido texto').toBeGreaterThan(0)
  expect(achados, `a página mostra:\n${achados.join('\n')}`).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 3. A estrutura                                                            */
/* ------------------------------------------------------------------------ */

test('um h1, nenhum outro título, a lista anunciada com 3 itens, imagens decorativas e "Onde estamos" sem link', async ({
  page,
}, informacoes) => {
  await abrirPagina(page)
  const lido = await lerPagina(page)
  const falhas: string[] = []

  if (lido.titulosPrincipais.length !== 1)
    falhas.push(`a página tem ${lido.titulosPrincipais.length} títulos de nível 1`)
  if (lido.titulos.length !== 1)
    falhas.push(`títulos no conteúdo: ${JSON.stringify(lido.titulos)}, e não só o h1`)

  /* Como o leitor de tela anuncia: a árvore de acessibilidade do Chromium. */
  const listas = page.getByRole('main').getByRole('list')
  const listasAnunciadas = await listas.count()
  const itensAnunciados = listasAnunciadas === 1 ? await listas.getByRole('listitem').count() : 0
  if (listasAnunciadas !== 1 || itensAnunciados !== ROTULOS.quadros.length)
    falhas.push(
      `listas anunciadas no conteúdo: ${listasAnunciadas}, com ${itensAnunciados} itens, e não 1 com ${ROTULOS.quadros.length}`
    )

  /* As imagens: fora do leitor de tela, pelo alt vazio ou pelo aria-hidden. */
  const anunciadas = lido.imagens.filter((imagem) => !imagem.escondida && imagem.alt !== '')
  for (const imagem of anunciadas)
    falhas.push(
      `<${imagem.tag}> no conteúdo anunciada ao leitor de tela (alt ${JSON.stringify(imagem.alt)})`
    )
  const arvore = await page.getByRole('main').ariaSnapshot()
  const imagensNaArvore = (arvore.match(/^\s*- img\b/gm) ?? []).length
  if (imagensNaArvore !== 0) falhas.push(`${imagensNaArvore} imagens na árvore de acessibilidade`)

  /* "Onde estamos": texto, nem link nem dentro de link. */
  const ondeEstamos = lido.quadros[2]
  if (
    !ondeEstamos ||
    ondeEstamos.links !== 0 ||
    ondeEstamos.dentroDeLink ||
    ondeEstamos.tag === 'a'
  )
    falhas.push(
      `quadro "${ROTULOS.quadros[2]}": <${ondeEstamos?.tag}>, ${ondeEstamos?.links} links dentro, e não texto`
    )
  if (lido.botoesNoConteudo !== 0) falhas.push(`${lido.botoesNoConteudo} botões no conteúdo`)

  console.log(
    `[${informacoes.project.name}] títulos no conteúdo: ${lido.titulos.length} (${lido.titulos.join(', ')})` +
      ` · lista <${lido.tipoDaLista}> anunciada: ${listasAnunciadas} com ${itensAnunciados} itens · quadros: ${lido.quadros.length}` +
      ` (${lido.quadros.map((quadro) => `<${quadro.tag}>`).join(', ')})\n` +
      `[${informacoes.project.name}] imagens no conteúdo: ${lido.imagens.length} (${lido.imagens.map((i) => i.tag).join(', ')})` +
      ` · anunciadas: ${anunciadas.length} · na árvore: ${imagensNaArvore} · botões no conteúdo: ${lido.botoesNoConteudo}`
  )
  expect(lido.quadros.length, 'o teste precisa ter lido os quadros').toBeGreaterThan(0)
  expect(falhas, falhas.join('\n')).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 4. Os dois links                                                          */
/* ------------------------------------------------------------------------ */

/* O quadro: o primeiro filho do item da lista cujo rótulo é `rotulo`. */
function quadroDe(page: Page, rotulo: string): Locator {
  return page
    .getByRole('main')
    .locator('li')
    .filter({ hasText: new RegExp(`^\\s*${escapar(rotulo)}`, 'i') })
    .locator(':scope > *')
    .first()
}

/* Os quatro cantos do quadro, a 2 px da borda, cada um fora da caixa do texto. */
async function cantosDoQuadro(quadro: Locator) {
  return quadro.evaluate((elemento) => {
    elemento.scrollIntoView({ block: 'center' })
    const caixa = elemento.getBoundingClientRect()
    const faixa = document.createRange()
    const texto = elemento.querySelector('[aria-hidden="true"] ~ *') ?? elemento
    faixa.selectNodeContents(texto)
    const doTexto = faixa.getBoundingClientRect()
    const margem = 2
    const cantos = [
      { nome: 'superior esquerdo', x: caixa.left + margem, y: caixa.top + margem },
      { nome: 'superior direito', x: caixa.right - margem, y: caixa.top + margem },
      { nome: 'inferior esquerdo', x: caixa.left + margem, y: caixa.bottom - margem },
      { nome: 'inferior direito', x: caixa.right - margem, y: caixa.bottom - margem },
    ]
    return {
      caixa: {
        largura: Math.round(caixa.width * 10) / 10,
        altura: Math.round(caixa.height * 10) / 10,
      },
      cantos: cantos.map((canto) => {
        const atingido = document.elementFromPoint(canto.x, canto.y)
        const dx = Math.max(doTexto.left - canto.x, canto.x - doTexto.right, 0)
        const dy = Math.max(doTexto.top - canto.y, canto.y - doTexto.bottom, 0)
        return {
          ...canto,
          distanciaDoTexto: Math.round(Math.hypot(dx, dy)),
          hrefDoLink: atingido?.closest('a')?.getAttribute('href') ?? null,
          atingido: atingido ? `<${atingido.tagName.toLowerCase()}>` : '(nada)',
        }
      }),
    }
  })
}

type Anel = { contorno: string; sombra: string; visivel: boolean }

async function anelDe(alvo: Locator): Promise<Anel> {
  return alvo.evaluate((elemento) => {
    const estilo = window.getComputedStyle(elemento)
    const temContorno =
      estilo.outlineStyle !== 'none' &&
      parseFloat(estilo.outlineWidth) > 0 &&
      !/rgba\([^)]*,\s*0\)$/.test(estilo.outlineColor)
    return {
      contorno: temContorno
        ? `${estilo.outlineWidth} ${estilo.outlineStyle} ${estilo.outlineColor}`
        : 'nenhum',
      sombra: estilo.boxShadow,
      visivel: temContorno || estilo.boxShadow !== 'none',
    }
  })
}

/* Tab até o link com `href`, contando as teclas; null se o Tab não chega. */
async function tabAte(page: Page, href: string): Promise<number | null> {
  await page.mouse.move(0, 0)
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  for (let tecla = 1; tecla <= 80; tecla += 1) {
    await page.keyboard.press('Tab')
    const atual = await page.evaluate(() => document.activeElement?.getAttribute('href') ?? null)
    if (atual === href) return tecla
  }
  return null
}

test('os quadros do Instagram e do e-mail são links inteiros: destino, nova aba, rel, nome acessível, cantos, alvo e foco', async ({
  page,
  context,
}, informacoes) => {
  const falhas: string[] = []
  const linhas: string[] = []
  let conferidos = 0

  for (const esperado of LINKS) {
    await abrirPagina(page)
    const quadro = quadroDe(page, esperado.rotulo)
    if ((await quadro.count()) !== 1) {
      falhas.push(`quadro "${esperado.rotulo}" não achado na lista`)
      continue
    }
    const antes = falhas.length
    const onde = `quadro "${esperado.rotulo}"`
    const link = page.getByRole('main').locator(`a[href="${esperado.href}"]`)
    const quantos = await link.count()
    if (quantos !== 1) {
      falhas.push(`${onde}: ${quantos} links para ${esperado.href} no conteúdo, e não 1`)
      continue
    }

    /*
     * O foco por Tab, antes de qualquer clique, na página recém-aberta: anel novo
     * em relação ao repouso, e o hover sem anel (ADR-0006).
     */
    const teclas = await tabAte(page, esperado.href)
    let focoDescrito = 'não alcançado por Tab'
    if (teclas === null) {
      falhas.push(`${onde}: o Tab não chega ao link`)
    } else {
      const focoVisivel = await link.evaluate((elemento) => elemento.matches(':focus-visible'))
      const comFoco = await anelDe(link)
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
      const emRepouso = await anelDe(link)
      await link.hover()
      const noHover = await anelDe(link)
      await page.mouse.move(0, 0)
      const mesmo = (a: Anel, b: Anel) => a.contorno === b.contorno && a.sombra === b.sombra
      if (!focoVisivel) falhas.push(`${onde}: focado por Tab sem :focus-visible`)
      if (!comFoco.visivel || mesmo(comFoco, emRepouso))
        falhas.push(
          `${onde}: o foco não mostra anel novo (focado ${comFoco.contorno}, repouso ${emRepouso.contorno})`
        )
      if (!mesmo(noHover, emRepouso))
        falhas.push(`${onde}: o hover muda o anel (${noHover.contorno}), que devia ser só do foco`)
      focoDescrito = `foco na tecla ${teclas}: contorno ${comFoco.contorno} · repouso ${emRepouso.contorno} · hover ${noHover.contorno}`
    }

    /* O destino, a aba e o rel. */
    const alvo = await link.getAttribute('target')
    const rel = (await link.getAttribute('rel'))?.split(/\s+/).filter(Boolean) ?? []
    if (esperado.novaAba) {
      if (alvo !== '_blank')
        falhas.push(`${onde}: o link tem target ${JSON.stringify(alvo)}, e não "_blank"`)
      for (const parte of ['noopener', 'noreferrer'])
        if (!rel.includes(parte))
          falhas.push(`${onde}: o link tem rel "${rel.join(' ')}", sem ${parte}`)
    } else if (alvo === '_blank') {
      falhas.push(`${onde}: o link abre em nova aba (target "_blank"), e não devia`)
    }

    /* O nome acessível começa pelo texto visível, na ordem. */
    const arvore = await link.ariaSnapshot()
    const nome = /- link "([^"]*)"/.exec(arvore)?.[1] ?? '(sem nome)'
    const comeco = `${esperado.rotulo} ${esperado.valor}`
    if (!nome.toLowerCase().startsWith(comeco.toLowerCase()))
      falhas.push(`${onde}: o nome acessível é "${nome}", e não começa por "${comeco}"`)
    if (esperado.novaAba && !/nova aba/i.test(nome))
      falhas.push(`${onde}: o nome acessível "${nome}" não diz que abre em nova aba`)

    /* Cada canto do quadro pertence ao link; e o quadro mede pelo menos 44 × 44. */
    const medida = await cantosDoQuadro(quadro)
    const cantosNoLink = medida.cantos.filter((canto) => canto.hrefDoLink === esperado.href)
    for (const canto of medida.cantos.filter((c) => c.hrefDoLink !== esperado.href))
      falhas.push(
        `${onde}: o ponto (${Math.round(canto.x)}, ${Math.round(canto.y)}), canto ${canto.nome}, a ${canto.distanciaDoTexto} px do texto, fora do link: caiu em ${canto.atingido}, link ${JSON.stringify(canto.hrefDoLink)}`
      )
    /* O alvo é a caixa do próprio link, e não a do quadro. */
    const caixaDoLink = await link.boundingBox()
    const alvoDoLink = {
      largura: Math.round((caixaDoLink?.width ?? 0) * 10) / 10,
      altura: Math.round((caixaDoLink?.height ?? 0) * 10) / 10,
    }
    if (alvoDoLink.largura < ALVO_MINIMO || alvoDoLink.altura < ALVO_MINIMO)
      falhas.push(
        `${onde}: o link mede ${alvoDoLink.largura} × ${alvoDoLink.altura} px, abaixo de ${ALVO_MINIMO}`
      )

    /*
     * O clique de verdade no canto inferior direito: quem o recebe. Só se o
     * canto é do link: fora dele, a falha já foi dita acima, e esperar a aba
     * nova só daria tempo esgotado.
     */
    const canto = medida.cantos[3]
    const cantoNoLink = canto?.hrefDoLink === esperado.href
    let resultadoDoClique = 'não clicado: o canto não é do link'
    if (canto && cantoNoLink && esperado.novaAba && alvo === '_blank') {
      const visto: { pedido: boolean; referer: string | undefined } = {
        pedido: false,
        referer: undefined,
      }
      await context.route(`${esperado.href}**`, async (rota) => {
        visto.pedido = true
        visto.referer = rota.request().headers()['referer']
        await rota.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<title>interceptado</title>',
        })
      })
      const [aba] = await Promise.all([
        page.waitForEvent('popup'),
        page.mouse.click(canto.x, canto.y),
      ])
      await aba.waitForLoadState()
      const temOpener = await aba.evaluate(() => window.opener !== null)
      const urlDaAba = aba.url()
      await aba.close()
      await context.unrouteAll()
      if (urlDaAba !== esperado.href) falhas.push(`${onde}: a aba nova abriu ${urlDaAba}`)
      if (!visto.pedido) falhas.push(`${onde}: a aba nova não pediu ${esperado.href}`)
      if (temOpener) falhas.push(`${onde}: a aba nova tem window.opener`)
      if (visto.referer !== undefined)
        falhas.push(`${onde}: a aba nova recebeu Referer "${visto.referer}"`)
      resultadoDoClique = `aba nova ${urlDaAba}, opener ${temOpener ? 'sim' : 'não'}, Referer ${visto.referer ?? 'nenhum'}`
    } else if (canto && cantoNoLink && !esperado.novaAba) {
      /* O e-mail: a navegação é cancelada no clique, para não abrir o aplicativo. */
      await page.evaluate(() => {
        const janela = window as unknown as { __hrefDoClique?: string | null }
        janela.__hrefDoClique = undefined
        document.addEventListener(
          'click',
          (evento) => {
            janela.__hrefDoClique =
              (evento.target as Element | null)?.closest('a')?.getAttribute('href') ?? null
            evento.preventDefault()
          },
          { capture: true, once: true }
        )
      })
      await page.mouse.click(canto.x, canto.y)
      const recebeu = await page.evaluate(
        () => (window as unknown as { __hrefDoClique?: string | null }).__hrefDoClique ?? null
      )
      if (recebeu !== esperado.href)
        falhas.push(`${onde}: o clique no canto ${canto.nome} foi para ${JSON.stringify(recebeu)}`)
      resultadoDoClique = `clique recebido por ${recebeu}`
    }

    if (falhas.length === antes) conferidos += 1
    linhas.push(
      `${onde}: href ${esperado.href} · target ${JSON.stringify(alvo)} · rel "${rel.join(' ')}" · nome "${nome}"\n    ` +
        `alvo do link ${alvoDoLink.largura} × ${alvoDoLink.altura} px (quadro ${medida.caixa.largura} × ${medida.caixa.altura}) · cantos no link: ${cantosNoLink.length} de ${medida.cantos.length}` +
        ` (${medida.cantos.map((c) => `${c.nome} a ${c.distanciaDoTexto} px do texto`).join(', ')}) · ${resultadoDoClique}\n    ${focoDescrito}`
    )
  }

  console.log(
    `[${informacoes.project.name}] links conferidos: ${conferidos} de ${LINKS.length}` +
      ` · alvos medidos: ${linhas.length} · abaixo de ${ALVO_MINIMO} px: ${falhas.filter((f) => f.includes(`abaixo de ${ALVO_MINIMO}`)).length}\n  ` +
      linhas.join('\n  ')
  )
  expect(falhas, `links com defeito:\n${falhas.join('\n')}`).toEqual([])
  expect(conferidos).toBe(LINKS.length)
})

/* ------------------------------------------------------------------------ */
/* 5. A composição da Q3 (b) e a ordem de foco, nas 7 larguras               */
/* ------------------------------------------------------------------------ */

test('a composição da Q3 (b): uma coluna até o corte da §7, duas acima, com a lista alinhada ao topo do título, e a ordem de foco igual nas 7 larguras', async ({
  page,
}, informacoes) => {
  const falhas: string[] = []
  const linhas: string[] = []
  const contagem = { uma: 0, duas: 0 }
  const ordens: string[] = []
  const ordemEsperada = LINKS.map((link) => link.rotulo).join(' → ')

  for (const largura of LARGURAS) {
    await page.setViewportSize({ width: largura, height: 900 })
    await abrirPagina(page)
    const medida = await page.evaluate(() => {
      const main = document.querySelector('main')
      const titulo = main?.querySelector('h1')
      const topo = titulo?.parentElement
      const lista = main?.querySelector('ul, ol')
      if (!topo || !lista) return null
      const t = topo.getBoundingClientRect()
      const l = lista.getBoundingClientRect()
      const caixa = (r: DOMRect) => ({
        x: Math.round(r.left * 10) / 10,
        y: Math.round(r.top * 10) / 10,
        direita: Math.round(r.right * 10) / 10,
        base: Math.round(r.bottom * 10) / 10,
      })
      return {
        topo: caixa(t),
        lista: caixa(l),
        topoAntesDaLista: Boolean(
          topo.compareDocumentPosition(lista) & Node.DOCUMENT_POSITION_FOLLOWING
        ),
      }
    })
    if (!medida) {
      falhas.push(`${largura} px: topo ou lista não achados`)
      continue
    }
    const { topo, lista } = medida
    const aDireita = lista.x >= topo.direita - 0.5
    const abaixo = lista.y >= topo.base - 0.5
    const diferencaDoTopo = Math.round((lista.y - topo.y) * 10) / 10
    const esperada = largura > ROTULOS.corte ? 'duas' : 'uma'
    const recebida = aDireita && !abaixo ? 'duas' : abaixo && !aDireita ? 'uma' : 'nenhuma das duas'
    const posicao = `lista em x ${lista.x}, y ${lista.y}; topo de x ${topo.x} a ${topo.direita}, de y ${topo.y} a ${topo.base}`
    if (recebida !== esperada)
      falhas.push(
        `${largura} px: esperada a lista ${esperada === 'duas' ? 'inteira à direita do título (x ≥ ' + topo.direita + ')' : 'inteira abaixo do título (y ≥ ' + topo.base + ')'}, recebida ${recebida === 'duas' ? 'à direita' : recebida === 'uma' ? 'abaixo' : 'nem à direita nem abaixo'} (${posicao})`
      )
    else if (esperada === 'duas' && Math.abs(diferencaDoTopo) > 1)
      falhas.push(
        `${largura} px: o topo da lista está ${diferencaDoTopo} px do topo do título, e não alinhado (${posicao})`
      )
    if (recebida === 'uma') contagem.uma += 1
    if (recebida === 'duas') contagem.duas += 1
    if (!medida.topoAntesDaLista) falhas.push(`${largura} px: no código, a lista vem antes do topo`)

    /* A ordem de foco no conteúdo, por Tab, do começo da página ao rodapé. */
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    const noConteudo: string[] = []
    for (let tecla = 0; tecla < 80; tecla += 1) {
      await page.keyboard.press('Tab')
      const foco = await page.evaluate(() => {
        const alvo = document.activeElement
        if (!alvo || alvo === document.body) return { regiao: 'nenhum', rotulo: '' }
        const item = alvo.closest('main li')
        const rotulo = item
          ? (Array.from(item.querySelectorAll('span, p')).find(
              (elemento) =>
                !elemento.closest('[aria-hidden="true"]') &&
                elemento.children.length === 0 &&
                (elemento.textContent ?? '').trim() !== ''
            )?.textContent ?? '')
          : ''
        return {
          regiao: alvo.closest('main') ? 'conteúdo' : alvo.closest('footer') ? 'rodapé' : 'outro',
          rotulo: rotulo.trim(),
        }
      })
      if (foco.regiao === 'rodapé') break
      if (foco.regiao === 'conteúdo') noConteudo.push(foco.rotulo || '(sem rótulo)')
    }
    const ordem = noConteudo.join(' → ')
    ordens.push(ordem)
    if (ordem !== ordemEsperada)
      falhas.push(`${largura} px: ordem de foco no conteúdo "${ordem}", e não "${ordemEsperada}"`)
    linhas.push(
      `${largura} px: ${recebida === 'duas' ? 'duas colunas' : recebida === 'uma' ? 'uma coluna' : recebida}` +
        ` · lista menos topo: x ${Math.round((lista.x - topo.direita) * 10) / 10} px da direita do topo, y ${diferencaDoTopo} px · foco: ${ordem}`
    )
  }

  const esperadas = {
    uma: LARGURAS.filter((largura) => largura <= ROTULOS.corte).length,
    duas: LARGURAS.filter((largura) => largura > ROTULOS.corte).length,
  }
  console.log(
    `[${informacoes.project.name}] composição: ${contagem.uma} larguras em uma coluna, ${contagem.duas} em duas` +
      ` (esperado ${esperadas.uma} e ${esperadas.duas}, corte da §7: ${ROTULOS.corte} px)` +
      ` · ordem de foco no conteúdo igual nas ${LARGURAS.length} larguras: ${new Set(ordens).size === 1 && ordens[0] === ordemEsperada ? 'sim' : 'não'}\n  ` +
      linhas.join('\n  ')
  )
  expect(falhas, `composição com defeito:\n${falhas.join('\n')}`).toEqual([])
  expect(contagem).toEqual(esperadas)
})

/* ------------------------------------------------------------------------ */
/* 6. axe e rolagem                                                          */
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
/* 7. O interruptor                                                          */
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

test('o interruptor: /contato leva 307 para / no não publicado, chegando à página em construção, e responde 200 sem Location no publicado', async ({
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
      await expect(contato.getByRole('link', { name: DOC.instagram })).toHaveAttribute(
        'href',
        ROTULOS.destinoDoInstagram
      )
      await expect(contato.getByRole('link', { name: DOC.email })).toHaveAttribute(
        'href',
        `mailto:${DOC.email}`
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
    `[${informacoes.project.name}] contato no interruptor: ${verificados.length} de 2 modos\n  ` +
      verificados.join('\n  ')
  )
  expect(falhas, `interruptor com defeito em ${ENDERECO}:\n${falhas.join('\n')}`).toEqual([])
  expect(verificados).toHaveLength(2)
})
