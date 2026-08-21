#!/usr/bin/env node
/*
 * Verificacao de tokens (FR-010).
 *
 * Procura cor e medida escritas a mao fora dos arquivos de token. Sem nenhuma
 * dependencia: o que precisa ser detectado e estreito e especifico deste projeto,
 * e um script que qualquer pessoa le inteiro e mais manutenivel que uma
 * configuracao que ninguem entende.
 *
 * A regra e ABSOLUTA de proposito: nada de "px pequeno pode". Regra com excecao
 * fuzzy produz falso positivo, e falso positivo destroi a confianca na
 * verificacao — que e o mesmo que nao ter verificacao.
 *
 * Ver docs/PADROES-DE-CODIGO.md, secao 3, e specs/001-fundacao-tecnica/research.md, D4.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const RAIZ = process.cwd()
const PASTA_VARRIDA = join(RAIZ, 'src')

/** Onde cor e medida PODEM ser escritas: e para isso que este arquivo existe. */
const ARQUIVOS_DE_TOKEN = ['src/estilos/tokens.css']

/** Pontos de corte permitidos pela secao 3 dos padroes. Valor solto no meio e divida. */
const CORTES_PERMITIDOS = [480, 768, 1024]

const EXTENSOES = ['.css', '.ts', '.tsx']

const COR_HEX = /#[0-9a-fA-F]{3,8}\b/g
const COR_FUNCAO = /\b(?:rgb|rgba|hsl|hsla|oklch|lab)\(/g
const MEDIDA_PX = /\b\d+(?:\.\d+)?px\b/g
const IMPORTANTE = /!important/g
const MEDIA_QUERY = /@media[^{]*/g

/** Sugere o token mais proximo, para a mensagem dizer o que usar no lugar. */
function sugerirToken(valor) {
  const mapa = {
    '#82558f': '--color-accent-600',
    '#683f74': '--color-accent-700',
    '#645c50': '--color-neutral-700',
    '#56633f': '--color-accent-2-700',
    '#9b6aaf': '--color-accent',
    '#f5ead8': '--color-bg',
    '#ebddc5': '--color-surface',
    '#201e1d': '--color-text',
  }
  const achado = mapa[valor.toLowerCase()]
  if (achado) return `use var(${achado})`
  if (valor.endsWith('px'))
    return 'use um token de espacamento (--space-*), raio (--radius-*) ou tipografia (--font-size-*)'
  return 'use um token de cor de src/estilos/tokens.css'
}

function listarArquivos(pasta) {
  const achados = []
  for (const entrada of readdirSync(pasta)) {
    const caminho = join(pasta, entrada)
    if (statSync(caminho).isDirectory()) {
      achados.push(...listarArquivos(caminho))
    } else if (EXTENSOES.some((ext) => entrada.endsWith(ext))) {
      achados.push(caminho)
    }
  }
  return achados
}

function ehArquivoDeToken(caminhoRelativo) {
  return ARQUIVOS_DE_TOKEN.includes(caminhoRelativo.split(sep).join('/'))
}

/** Larguras dentro de @media sao permitidas se forem os cortes definidos. */
function pxPermitidoNaLinha(linha, valor) {
  const consultas = linha.match(MEDIA_QUERY)
  if (!consultas) return false
  const numero = Number.parseFloat(valor)
  return consultas.some((c) => c.includes(valor)) && CORTES_PERMITIDOS.includes(numero)
}

const problemas = []
const arquivos = listarArquivos(PASTA_VARRIDA)
let arquivosDeTokenIgnorados = 0

for (const caminho of arquivos) {
  const rel = relative(RAIZ, caminho)
  const conteudo = readFileSync(caminho, 'utf8')
  const linhas = conteudo.split('\n')
  const dentroDosTokens = ehArquivoDeToken(rel)
  if (dentroDosTokens) arquivosDeTokenIgnorados += 1

  // Comentario de bloco atravessa varias linhas: sem acompanhar o estado, a
  // mencao a "256px" dentro de um comentario vira falso positivo — e falso
  // positivo destroi a confianca na verificacao.
  let dentroDeComentario = false

  linhas.forEach((linha, indice) => {
    const numero = indice + 1
    let semComentario = linha.replace(/\/\*.*?\*\//g, '')
    if (dentroDeComentario) {
      const fim = semComentario.indexOf('*/')
      if (fim === -1) {
        semComentario = ''
      } else {
        semComentario = semComentario.slice(fim + 2)
        dentroDeComentario = false
      }
    }
    const abre = semComentario.lastIndexOf('/*')
    if (abre !== -1 && !semComentario.slice(abre).includes('*/')) {
      semComentario = semComentario.slice(0, abre)
      dentroDeComentario = true
    }
    semComentario = semComentario.replace(/\/\/.*$/, '')

    if (!dentroDosTokens) {
      for (const achado of semComentario.match(COR_HEX) ?? []) {
        problemas.push({ rel, numero, valor: achado, motivo: 'cor escrita a mao' })
      }
      for (const achado of semComentario.match(COR_FUNCAO) ?? []) {
        if (semComentario.includes('color-mix')) continue
        problemas.push({ rel, numero, valor: achado, motivo: 'cor escrita a mao' })
      }
      for (const achado of semComentario.match(MEDIDA_PX) ?? []) {
        if (pxPermitidoNaLinha(semComentario, achado)) continue
        problemas.push({ rel, numero, valor: achado, motivo: 'medida escrita a mao' })
      }
    }

    if (semComentario.match(IMPORTANTE)) {
      const anterior = linhas[indice - 1] ?? ''
      const temExplicacao =
        linha.includes('/*') || anterior.includes('/*') || anterior.includes('//')
      if (!temExplicacao) {
        problemas.push({
          rel,
          numero,
          valor: '!important',
          motivo: 'sem comentario explicando qual estilo de terceiro esta sendo vencido',
        })
      }
    }
  })
}

console.log(
  `Verificacao de tokens: ${arquivos.length} arquivo(s) varrido(s) em src/, ` +
    `sendo ${arquivosDeTokenIgnorados} arquivo(s) de token onde cor e medida sao permitidas.`
)

if (problemas.length === 0) {
  console.log('Nenhuma cor ou medida escrita a mao fora dos arquivos de token.')
  process.exit(0)
}

console.error(`\n${problemas.length} problema(s):\n`)
for (const p of problemas) {
  console.error(`  ${p.rel}:${p.numero}  ${p.valor}  — ${p.motivo}; ${sugerirToken(p.valor)}`)
}
console.error('\nVer docs/PADROES-DE-CODIGO.md, secao 3.')
process.exit(1)
