/*
 * Apoio de leitura do pagina-inicial.spec.ts (change inicio-completo, design.md
 * D7). Não é spec: o Playwright só roda arquivos `*.spec.ts`.
 *
 * NENHUM TEXTO DA INICIAL ESTÁ ESCRITO AQUI. Tudo é lido:
 *
 *   - do docs/conteudo-institucional.md: os quatro números do §9, lidos entre
 *     os parênteses da frase "Os indicadores aprovados (...)"; o aviso de
 *     inscrições fechadas do §5.1; o @ e o e-mail da tabela do §1; e, do §2.0,
 *     o texto de apoio da agenda e a mensagem de quando não há evento, que são
 *     da R2 e não podem aparecer;
 *   - da docs/REFERENCIA-VISUAL.md §7, linhas "Inicial, números", "Inicial,
 *     faixa do processo seletivo" e "Inicial, bloco de contato": os rótulos
 *     entre aspas, as cores nomeadas e o texto de exemplo que não vai;
 *   - do prototipo/Portal-LIACUP.html, página HOME: os blocos que ficam fora
 *     da R1, o texto de exemplo da faixa e o que o bloco de contato tinha e
 *     não vai ao ar, para provar que não foram sem copiá-los aqui;
 *   - do src/estilos/tokens.css: o nome de cada cor medida, para o registro
 *     de contraste nomear as duas cores (RP-09).
 *
 * Se a leitura achar menos do que o documento tem, ela para com a contagem,
 * em vez de conferir nada e ficar verde (RP-12).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const raiz = process.cwd()
const DOCUMENTO = readFileSync(join(raiz, 'docs', 'conteudo-institucional.md'), 'utf8')
const REFERENCIA = readFileSync(join(raiz, 'docs', 'REFERENCIA-VISUAL.md'), 'utf8')
const PROTOTIPO = readFileSync(join(raiz, 'prototipo', 'Portal-LIACUP.html'), 'utf8')
const TOKENS = readFileSync(join(raiz, 'src', 'estilos', 'tokens.css'), 'utf8')

export const normalizar = (texto: string) => texto.replace(/\s+/g, ' ').trim()
export const escapar = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function ler(padrao: RegExp, texto: string, nome: string): string {
  const achado = padrao.exec(texto)?.[1]
  if (!achado) throw new Error(`não achei ${nome}`)
  return normalizar(achado)
}

const aspas = (trecho: string) =>
  [...trecho.matchAll(/"([^"]+)"/g)].map((achado) => normalizar(achado[1] ?? ''))

/* O trecho do documento do cabeçalho `inicio` até o próximo de nível igual ou maior. */
function secaoDoDocumento(inicio: string): string {
  const comeco = DOCUMENTO.indexOf(`\n${inicio}`)
  if (comeco === -1) throw new Error(`conteudo-institucional.md sem a seção "${inicio}"`)
  const nivel = /^#+/.exec(inicio)?.[0] ?? '###'
  const resto = DOCUMENTO.slice(comeco + 1)
  const proximo = resto.slice(inicio.length).search(new RegExp(`\\n#{1,${nivel.length}} `))
  return proximo === -1 ? resto : resto.slice(0, inicio.length + proximo)
}

/* ------------------------------------------------------------------------ */
/* O documento de conteúdo                                                   */
/* ------------------------------------------------------------------------ */

const QUANTIDADE_DE_NUMEROS = 4

function lerDocumento() {
  const s9 = secaoDoDocumento('## 9.')
  const parentese = ler(/Os indicadores aprovados \(([^)]+)\)/, s9, 'o parêntese do §9')
  const partes = parentese.split(/,\s*/)
  const numeros = partes.map((parte) => {
    const numero = /\d+/.exec(parte)?.[0]
    if (!numero) throw new Error(`§9: a parte "${parte}" do parêntese não tem número`)
    return numero
  })
  if (numeros.length !== QUANTIDADE_DE_NUMEROS)
    throw new Error(`§9: ${numeros.length} números lidos, e não ${QUANTIDADE_DE_NUMEROS}`)

  const s51 = secaoDoDocumento('### 5.1')
  const aviso = ler(
    /\*\*Aviso de inscrições fechadas\*\*[^\n]*\n\s*\n>\s*(.+)/,
    s51,
    'o aviso de inscrições fechadas no §5.1'
  )
  const s1 = secaoDoDocumento('## 1.')
  const instagram = ler(/\|\s*Instagram\s*\|\s*\*\*`(@[^`]+)`\*\*/, s1, 'o Instagram no §1')
  const email = ler(/\|\s*E-mail\s*\|\s*`([^`]+)`/, s1, 'o e-mail no §1')
  const s20 = secaoDoDocumento('### 2.0')
  const semEvento = ler(
    /Quando não houver evento futuro[^\n]*\n\s*\n>\s*(.+)/,
    s20,
    'a mensagem sem evento do §2.0'
  )
  const apoioDaAgenda = ler(/Texto de apoio[^"]*"([^"]+)"/, s20, 'o texto de apoio da agenda')
  return { parentese, numeros, aviso, instagram, email, semEvento, apoioDaAgenda }
}

/* ------------------------------------------------------------------------ */
/* A REFERENCIA-VISUAL.md §7                                                 */
/* ------------------------------------------------------------------------ */

function linhaDa7(comeco: string): string {
  const linhas = REFERENCIA.split('\n').filter((linha) => linha.startsWith(`| ${comeco} |`))
  if (linhas.length !== 1)
    throw new Error(`REFERENCIA-VISUAL.md §7: ${linhas.length} linhas "${comeco}", e não 1`)
  return linhas[0] ?? ''
}

const HEX = '(#[0-9a-fA-F]{6})'

function lerReferencia() {
  const numeros = linhaDa7('Inicial, números')
  const rotulos = aspas(ler(/rótulos do protótipo: (.+?)\. São rótulos/, numeros, 'os rótulos'))
  if (rotulos.length !== QUANTIDADE_DE_NUMEROS)
    throw new Error(`§7, "Inicial, números": ${rotulos.length} rótulos, e não 4`)

  const faixa = linhaDa7('Inicial, faixa do processo seletivo')
  const botao = /o botão "([^"]+)", que leva a `([^`]+)`/.exec(faixa)
  const cartao = new RegExp(
    `o cartão sai em \`(--[\\w-]+)\` \`${HEX}\`, e não no lilás \`${HEX}\``
  ).exec(faixa)
  const textoClaro = new RegExp(`título, aviso e link em \`(--[\\w-]+)\` \`${HEX}\``).exec(faixa)
  const anel = /O anel de foco do botão e do link é `(--[\w-]+)`/.exec(faixa)
  const exemplos = aspas(
    ler(/O texto de exemplo do protótipo \((.+?)\) não vai/, faixa, 'os exemplos da faixa')
  )
  if (!botao || !cartao || !textoClaro || !anel || exemplos.length < 3)
    throw new Error(
      '§7, "Inicial, faixa do processo seletivo": botão, cartão, texto claro, anel ou exemplos não achados'
    )

  const contato = linhaDa7('Inicial, bloco de contato')
  const topo = /Sobretítulo "([^"]+)" e título da seção "([^"]+)"/.exec(contato)
  const quadros = /Dois quadros, "([^"]+)" e "([^"]+)"/.exec(contato)
  const links = linhaDa7('Inicial, Contato e rodapé, links do Instagram e do e-mail')
  const paginaContato = linhaDa7('Contato, página')
  const quadrosDaPagina = /quadros, nesta ordem: "([^"]+)", "([^"]+)" e "([^"]+)"/.exec(
    paginaContato
  )
  if (!topo || !quadros || !quadrosDaPagina)
    throw new Error('§7: topo, quadros da inicial ou quadros da página Contato não achados')

  return {
    rotulos,
    faixa: {
      selo: ler(/o selo "([^"]+)"/, faixa, 'o selo'),
      titulo: ler(/o título "([^"]+)"/, faixa, 'o título'),
      rotuloDoBotao: normalizar(botao[1] ?? ''),
      destinoDoBotao: botao[2] ?? '',
      exemplos,
      tokenDoCartao: cartao[1] ?? '',
      hexDoCartao: (cartao[2] ?? '').toLowerCase(),
      hexDoLilas: (cartao[3] ?? '').toLowerCase(),
      tokenDoTexto: textoClaro[1] ?? '',
      hexDoTexto: (textoClaro[2] ?? '').toLowerCase(),
      tokenDoAnel: anel[1] ?? '',
    },
    contato: {
      sobretitulo: normalizar(topo[1] ?? ''),
      titulo: normalizar(topo[2] ?? ''),
      quadros: [quadros[1], quadros[2]].map((rotulo) => normalizar(rotulo ?? '')),
      botaoQueNaoVai: ler(/sem o botão "([^"]+)"/, contato, 'o botão que sai'),
      quadroQueNaoVai: normalizar(quadrosDaPagina[3] ?? ''),
      destinoDoInstagram: ler(/abre `(https:\/\/[^`]+)`/, links, 'o destino do Instagram'),
    },
  }
}

/* ------------------------------------------------------------------------ */
/* O protótipo, página HOME                                                  */
/* ------------------------------------------------------------------------ */

/*
 * O arquivo traz o HTML dentro de um texto, com as aspas como \" e a barra
 * como "u002F" com barra invertida, como o contato.spec.ts já lê.
 */
function lerPrototipo(tituloDaFaixa: string, tituloDoContato: string, valoresCertos: string[]) {
  const inicio = PROTOTIPO.indexOf('<!-- ═══════════ HOME ═══════════ -->')
  const fim = PROTOTIPO.indexOf('<!-- ═══════════ SOBRE ═══════════ -->', inicio)
  if (inicio === -1 || fim === -1) throw new Error('protótipo: página HOME não achada')
  const secoes = PROTOTIPO.slice(inicio, fim).split('<section').slice(1)
  const todos = (padrao: RegExp, onde: string) =>
    Array.from(onde.matchAll(padrao), (achado) => normalizar(achado[1] ?? '')).filter(
      (texto) => texto !== '' && !texto.includes('{{')
    )
  const h2De = (secao: string) => todos(/<h2[^>]*>([^<]+)<\\u002Fh2>/g, secao)[0] ?? ''
  const botoesDe = (secao: string) => todos(/<a class=\\"btn[^>]*>([^<]+)<\\u002Fa>/g, secao)
  const paragrafosDe = (secao: string) => todos(/<p[^>]*>([^<]+)<\\u002Fp>/g, secao)

  const hero = secoes.filter((secao) => secao.includes('<h1'))
  const faixa = secoes.filter((secao) => secao.includes('cta-box'))
  const contato = secoes.filter((secao) => h2De(secao) === tituloDoContato)
  const fora = secoes.filter(
    (secao) => !hero.includes(secao) && !faixa.includes(secao) && !contato.includes(secao)
  )
  if (hero.length !== 1 || faixa.length !== 1 || contato.length !== 1)
    throw new Error(
      `protótipo HOME: ${hero.length} heros, ${faixa.length} faixas e ${contato.length} blocos de contato, e não 1 de cada`
    )

  /* Fora da R1: o título, o sobretítulo, os parágrafos fixos e os botões de cada bloco. */
  const blocosForaDaR1 = fora.map((secao) => ({
    titulo: h2De(secao),
    termos: [...new Set([h2De(secao), ...paragrafosDe(secao), ...botoesDe(secao)])].filter(Boolean),
  }))

  /* A faixa: o selo, o resto do título depois de "Processo seletivo", a frase e o botão. */
  const secaoDaFaixa = faixa[0] ?? ''
  const tituloDoExemplo = h2De(secaoDaFaixa)
  const restoDoTitulo = tituloDoExemplo.startsWith(tituloDaFaixa)
    ? normalizar(tituloDoExemplo.slice(tituloDaFaixa.length))
    : tituloDoExemplo
  const exemplosDaFaixa = [
    ...todos(/<span class=\\"tag\\"[^>]*>([^<]+)</g, secaoDaFaixa),
    restoDoTitulo,
    ...paragrafosDe(secaoDaFaixa),
    ...botoesDe(secaoDaFaixa),
  ].filter(Boolean)

  /* O contato: a frase de baixo do título, o botão e os dados de exemplo dos canais. */
  const secaoDoContato = contato[0] ?? ''
  const frase = ler(
    /<\\u002Fh2>\\n\s*<p[^>]*>([^<]+)<\\u002Fp>/,
    secaoDoContato,
    'a frase do contato no protótipo'
  )
  const canais = /canaisHome: \[([\s\S]*?)\]/.exec(PROTOTIPO)?.[1] ?? ''
  const exemplosDosCanais = [
    ...todos(/placeholder: \\?"([^"\\]+)\\?"/g, canais),
    ...todos(/nota: \\?"([^"\\]+)\\?"/g, canais),
    ...todos(/valor: \\?"([^"\\]+)\\?"/g, canais).filter((valor) => !valoresCertos.includes(valor)),
  ]
  const termosForaDaR1 = blocosForaDaR1.flatMap((bloco) => bloco.termos)
  if (blocosForaDaR1.length !== 3 || termosForaDaR1.length < 9)
    throw new Error(
      `protótipo HOME: ${blocosForaDaR1.length} blocos fora da R1 com ${termosForaDaR1.length} termos, e não 3 com pelo menos 9`
    )
  if (exemplosDaFaixa.length < 4 || exemplosDosCanais.length < 3)
    throw new Error(
      `protótipo HOME: ${exemplosDaFaixa.length} exemplos da faixa e ${exemplosDosCanais.length} dos canais`
    )
  return {
    blocosForaDaR1,
    termosForaDaR1: [...new Set(termosForaDaR1)],
    exemplosDaFaixa: [...new Set(exemplosDaFaixa)],
    fraseDoContato: frase,
    botoesDoContato: botoesDe(secaoDoContato),
    exemplosDosCanais: [...new Set(exemplosDosCanais)],
  }
}

export const DOC = lerDocumento()
export const REF = lerReferencia()
export const PROTOTIPO_DA_INICIAL = lerPrototipo(REF.faixa.titulo, REF.contato.titulo, [
  DOC.instagram,
  DOC.email,
])

/* ------------------------------------------------------------------------ */
/* Cores (RP-09)                                                             */
/* ------------------------------------------------------------------------ */

export type Rgb = readonly [number, number, number]

/* Os tokens de cor do tokens.css escritos em hexadecimal, pelo valor. */
const NOMES_DAS_CORES = new Map<string, string[]>()
for (const [, nome, valor] of TOKENS.matchAll(/(--color-[\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) {
  const chave = (valor ?? '').toLowerCase()
  NOMES_DAS_CORES.set(chave, [...(NOMES_DAS_CORES.get(chave) ?? []), nome ?? ''])
}
if (NOMES_DAS_CORES.size < 10) throw new Error('tokens.css: menos de 10 cores lidas')

export const hex = (cor: Rgb) =>
  `#${cor.map((canal) => Math.round(canal).toString(16).padStart(2, '0')).join('')}`

export function rgbDoHex(valor: string): Rgb {
  const limpo = valor.replace('#', '')
  return [0, 2, 4].map((inicio) => parseInt(limpo.slice(inicio, inicio + 2), 16)) as unknown as Rgb
}

/* "--color-bg #f5ead8"; sem token com esse valor, só o hexadecimal. */
export function nomeDaCor(cor: Rgb, preferido?: string): string {
  const nomes = NOMES_DAS_CORES.get(hex(cor)) ?? []
  const nome = preferido && nomes.includes(preferido) ? preferido : nomes[0]
  return nome ? `${nome} ${hex(cor)}` : hex(cor)
}

function luminancia([r, g, b]: Rgb): number {
  const canal = (valor: number) => {
    const c = valor / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
}

export function contraste(a: Rgb, b: Rgb): number {
  const [clara, escura] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return ((clara ?? 0) + 0.05) / ((escura ?? 0) + 0.05)
}

/* Arredondado para baixo, com vírgula, como a tabela do design.md D4. */
export const razao = (valor: number) =>
  `${(Math.floor(valor * 100) / 100).toFixed(2).replace('.', ',')}:1`
