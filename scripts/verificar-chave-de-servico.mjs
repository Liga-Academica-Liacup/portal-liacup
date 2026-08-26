#!/usr/bin/env node
/*
 * T032 — BARREIRA 3: a chave de servico no PACOTE COMPILADO (FR-014, SC-007).
 *
 * As barreiras 1 e 2 verificam o CODIGO: o nome sem prefixo publico e a zona de
 * lint que restringe a leitura a um arquivo. Esta verifica o ARTEFATO, e e a
 * unica capaz de pegar o caminho indireto — um valor chega ao navegador sem
 * nenhum arquivo de cliente mencionar a variavel, basta um componente de
 * servidor passa-lo como prop. Nesse caso as duas primeiras ficam verdes.
 *
 * ONDE PROCURA CADA COISA, e a distincao importa:
 *
 *   O VALOR e procurado em TODO o resultado do build. Ele nao deveria aparecer
 *   em lugar nenhum: o servidor le a variavel em tempo de execucao, e nada a
 *   grava no disco. Valor no build e vazamento, esteja onde estiver.
 *
 *   O NOME e procurado so no que o navegador recebe — os pacotes de `static/` e
 *   as paginas ja geradas (.html e .rsc). Nos arquivos de servidor o nome
 *   aparece legitimamente, porque e la que servidor.ts le a variavel.
 *
 * NENHUM VALOR DE CHAVE SAI DAQUI. O que se imprime e caminho de arquivo e
 * contagem — nunca o trecho encontrado.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const BUILD = '.next'
const NOME_DA_CHAVE = 'SUPABASE_SERVICE_ROLE_KEY'

/* Extensoes que carregam texto. Imagem e fonte nao guardam credencial. */
const LEGIVEIS = /\.(js|mjs|cjs|json|html|rsc|txt|map|css)$/i

function naoVerificou(motivo) {
  console.error('\n=== NAO VERIFICADO — chave de servico no pacote ===\n')
  console.error('  arquivos varridos: 0 · ocorrencias: nao apurado\n')
  console.error(`  ${motivo}\n`)
  console.error('  Nenhum arquivo foi lido, entao NADA foi provado sobre o pacote.')
  console.error('  Esta e a unica barreira que olha o que foi realmente entregue:')
  console.error('  sem ela, "a chave nao vaza" e uma afirmacao sobre o codigo-fonte.')
  console.error('  Rode `npm run build` antes desta verificacao.\n')
  process.exit(1)
}

function valorDaChave() {
  if (process.env[NOME_DA_CHAVE]) return process.env[NOME_DA_CHAVE]
  try {
    const linha = readFileSync('.env', 'utf8')
      .split('\n')
      .find((l) => l.startsWith(`${NOME_DA_CHAVE}=`))
    const valor = linha
      ?.slice(NOME_DA_CHAVE.length + 1)
      .trim()
      .replace(/^"|"$/g, '')
    return valor || null
  } catch {
    return null
  }
}

function* arquivos(pasta) {
  let entradas
  try {
    entradas = readdirSync(pasta, { withFileTypes: true })
  } catch {
    return
  }
  for (const entrada of entradas) {
    const caminho = join(pasta, entrada.name)
    if (entrada.isDirectory()) {
      yield* arquivos(caminho)
    } else if (LEGIVEIS.test(entrada.name)) {
      yield caminho
    }
  }
}

/* O que o navegador recebe: os pacotes servidos e as paginas ja geradas. */
const vaiParaONavegador = (caminho) => {
  const p = relative(BUILD, caminho).split(sep).join('/')
  return p.startsWith('static/') || /\.(html|rsc)$/i.test(p)
}

try {
  if (!statSync(BUILD).isDirectory()) throw new Error('nao e pasta')
} catch {
  naoVerificou(`Nao existe a pasta ${BUILD}: o projeto nao foi compilado.`)
}

const chave = valorDaChave()
const achadosDeValor = []
const achadosDeNome = []
let varridos = 0
let doNavegador = 0

for (const caminho of arquivos(BUILD)) {
  varridos += 1
  const paraONavegador = vaiParaONavegador(caminho)
  if (paraONavegador) doNavegador += 1

  let conteudo
  try {
    conteudo = readFileSync(caminho, 'utf8')
  } catch {
    continue
  }
  if (chave && conteudo.includes(chave)) achadosDeValor.push(caminho)
  if (paraONavegador && conteudo.includes(NOME_DA_CHAVE)) achadosDeNome.push(caminho)
}

console.log('\nChave de servico no pacote compilado\n')
console.log(`  arquivos varridos: ${varridos}`)
console.log(`  destes, entregues ao navegador: ${doNavegador}`)
console.log(`  ocorrencias do VALOR (em todo o build): ${achadosDeValor.length}`)
console.log(`  ocorrencias do NOME (so no que vai ao navegador): ${achadosDeNome.length}`)

/*
 * Varrer zero arquivo e "nao achei a chave" produzem a mesma saida verde se o
 * contador nao existir — e a segunda e um build que nem rodou (RP-12).
 */
if (varridos === 0 || doNavegador === 0) {
  naoVerificou(
    `A varredura encontrou ${varridos} arquivo(s), sendo ${doNavegador} entregues ao ` +
      'navegador. Sem arquivo de navegador nao ha o que verificar.'
  )
}

/*
 * Sem o valor em maos, a verificacao do NOME continua valendo, mas a do VALOR
 * nao aconteceu — e dizer isso e diferente de dizer que nao achou nada.
 */
if (!chave) {
  console.error(`\n=== PARCIALMENTE VERIFICADO ===\n`)
  console.error(`  A ${NOME_DA_CHAVE} nao esta no ambiente nem no .env, entao a busca pelo`)
  console.error('  VALOR nao foi feita — so a busca pelo nome. E a busca pelo valor que pega')
  console.error('  o vazamento por prop, que e o caso que esta barreira existe para achar.\n')
  process.exit(1)
}

if (achadosDeValor.length > 0 || achadosDeNome.length > 0) {
  console.error('\n=== FALHA — chave de servico no pacote ===\n')
  for (const caminho of achadosDeValor) {
    console.error(`  VALOR da chave em: ${caminho}`)
  }
  for (const caminho of achadosDeNome) {
    console.error(`  NOME da chave em arquivo de navegador: ${caminho}`)
  }
  console.error('\n  A chave de servico ignora todas as politicas de acesso. No navegador,')
  console.error('  nao ha como despublicar o que ja foi baixado: a unica reacao possivel e')
  console.error('  ROTACIONAR A CHAVE no painel do Supabase, agora, antes de investigar.\n')
  process.exit(1)
}

console.log('\n=== VERIFICADO — chave de servico no pacote ===\n')
console.log(`  ${varridos} arquivo(s) varridos, ${doNavegador} deles entregues ao navegador:`)
console.log('  nenhuma ocorrencia do valor nem do nome da chave de servico.\n')
