#!/usr/bin/env node
/*
 * Pós-verificador do Lighthouse — confere o RESULTADO, não a configuração.
 *
 * POR QUE ELE EXISTE, SE O `lhci assert` JÁ FALHA QUANDO A NOTA CAI
 *
 * Porque o `assert` responde "as notas que eu vi passaram", e a pergunta que
 * interessa é outra: **as dez páginas foram medidas?** As duas parecem a mesma
 * e não são. Quatro maneiras de o `lhci` ficar verde sem ter medido o que se
 * pensa que mediu:
 *
 *   1. um destino novo no catálogo cuja rota não existe — o Next devolve 404, e
 *      uma página 404 é pequena, rápida e pontua BEM. Verde para uma página que
 *      não existe;
 *   2. uma rota que redireciona para outra — mede-se a mesma página duas vezes
 *      e uma nunca é olhada;
 *   3. o perfil voltar a desktop sem ninguém notar, e as notas subirem por
 *      motivo errado;
 *   4. relatório velho na pasta inflando a contagem.
 *
 * Contra (1) e (2) ele exige status HTTP aprovado e URL final igual à pedida.
 * Contra (3) lê `formFactor` e `throttlingMethod` do LHR gerado. Contra (4) lê
 * o `manifest.json`, que é reescrito a cada execução, e não os arquivos soltos
 * da pasta.
 *
 * E imprime quanto mediu, sempre: 10/10 caminhos e 30/30 relatórios. Um
 * verificador que varre zero e um que aprova tudo são indistinguíveis sem o
 * contador (RP-12).
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PASTA = join(RAIZ, '.lighthouseci')
const MANIFEST = join(PASTA, 'manifest.json')

const EXECUCOES_ESPERADAS = 3
const DESEMPENHO_MINIMO = 0.9
const ACESSIBILIDADE_MINIMA = 0.95
const PERFIL_ESPERADO = 'mobile'
const THROTTLING_ESPERADO = 'simulate'

function naoVerificou(motivo) {
  console.error('\n=== NAO VERIFICADO — paginas medidas pelo Lighthouse ===\n')
  console.error('  caminhos conferidos: 0')
  console.error('  relatorios conferidos: 0\n')
  console.error(`  ${motivo}\n`)
  console.error('  Nenhum relatorio foi examinado, entao NADA foi provado. Nota alta')
  console.error('  em pagina nenhuma nao e nota alta em todas as paginas.\n')
  process.exit(1)
}

const destinos = JSON.parse(
  readFileSync(join(RAIZ, 'src/componentes/layout/destinos-publicos.json'), 'utf8')
)
const caminhosEsperados = destinos.map((destino) => destino.caminho)

if (!existsSync(MANIFEST)) {
  naoVerificou(`Nao existe ${MANIFEST}. O \`lhci autorun\` rodou?`)
}

let manifest
try {
  manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
} catch (erro) {
  naoVerificou(`Nao foi possivel ler o manifest: ${erro.message}`)
}

if (!Array.isArray(manifest) || manifest.length === 0) {
  naoVerificou('O manifest nao lista nenhum relatorio.')
}

const caminhoDaUrl = (url) => {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

const falhas = []
const porCaminho = new Map()
let relatoriosLidos = 0

for (const entrada of manifest) {
  const pedido = caminhoDaUrl(entrada.url)
  const arquivo = join(PASTA, entrada.jsonPath.split(/[\\/]/).pop())

  if (!existsSync(arquivo)) {
    falhas.push(`${pedido}: o manifest aponta para ${arquivo}, que nao existe`)
    continue
  }

  const lhr = JSON.parse(readFileSync(arquivo, 'utf8'))
  relatoriosLidos += 1
  porCaminho.set(pedido, (porCaminho.get(pedido) ?? 0) + 1)

  if (!caminhosEsperados.includes(pedido)) {
    falhas.push(`${pedido}: medido, mas nao pertence ao catalogo de destinos publicos`)
  }

  // (1) e (2): a pagina existe mesmo, e e a pagina pedida?
  const status = lhr.audits?.['http-status-code']
  if (status && status.score !== 1) {
    falhas.push(`${pedido}: auditoria http-status-code reprovou — a rota respondeu com erro`)
  }
  const final = caminhoDaUrl(lhr.finalDisplayedUrl ?? lhr.finalUrl ?? entrada.url)
  if (final !== pedido) {
    falhas.push(`${pedido}: redirecionou para ${final} — a rota pedida nao foi a medida`)
  }

  // (3): o perfil e o que o FR-039 exige, lido do relatorio e nao da config.
  const config = lhr.configSettings ?? {}
  if (config.formFactor !== PERFIL_ESPERADO) {
    falhas.push(`${pedido}: formFactor "${config.formFactor}", esperado "${PERFIL_ESPERADO}"`)
  }
  if (config.throttlingMethod !== THROTTLING_ESPERADO) {
    falhas.push(
      `${pedido}: throttlingMethod "${config.throttlingMethod}", esperado "${THROTTLING_ESPERADO}"`
    )
  }

  const desempenho = lhr.categories?.performance?.score ?? 0
  const acessibilidade = lhr.categories?.accessibility?.score ?? 0
  if (desempenho < DESEMPENHO_MINIMO) {
    falhas.push(`${pedido}: desempenho ${desempenho} abaixo de ${DESEMPENHO_MINIMO}`)
  }
  if (acessibilidade < ACESSIBILIDADE_MINIMA) {
    falhas.push(`${pedido}: acessibilidade ${acessibilidade} abaixo de ${ACESSIBILIDADE_MINIMA}`)
  }
}

// O caso que o `assert` nunca pega: um destino do catalogo que ninguem mediu.
for (const esperado of caminhosEsperados) {
  const execucoes = porCaminho.get(esperado) ?? 0
  if (execucoes === 0) {
    falhas.push(`${esperado}: NENHUM relatorio — o destino esta no catalogo e nao foi medido`)
  } else if (execucoes !== EXECUCOES_ESPERADAS) {
    falhas.push(`${esperado}: ${execucoes} execucoes, esperadas ${EXECUCOES_ESPERADAS}`)
  }
}

const relatoriosEsperados = caminhosEsperados.length * EXECUCOES_ESPERADAS
const caminhosMedidos = caminhosEsperados.filter((c) => (porCaminho.get(c) ?? 0) > 0).length

console.log('\nPaginas medidas pelo Lighthouse\n')
console.log(`  caminhos do catalogo: ${caminhosEsperados.length}`)
console.log(`  caminhos medidos: ${caminhosMedidos}/${caminhosEsperados.length}`)
console.log(`  relatorios lidos: ${relatoriosLidos}/${relatoriosEsperados}`)
console.log(`  execucoes por caminho esperadas: ${EXECUCOES_ESPERADAS}`)
console.log(`  perfil exigido: ${PERFIL_ESPERADO} / ${THROTTLING_ESPERADO}`)
console.log(`\n  problemas encontrados: ${falhas.length}`)

if (falhas.length > 0) {
  console.error('\n=== FALHA — paginas medidas pelo Lighthouse ===\n')
  for (const falha of falhas) console.error(`  ${falha}`)
  console.error(
    '\n  Nota alta nao prova cobertura: uma rota inexistente devolve 404, e 404 e\n' +
      '  pequeno, rapido e pontua bem. Por isso este verificador exige status,\n' +
      '  URL final, perfil e CONTAGEM, e nao so as notas.\n'
  )
  process.exit(1)
}

console.log('\n=== VERIFICADO — paginas medidas pelo Lighthouse ===\n')
console.log(
  `  ${caminhosMedidos}/${caminhosEsperados.length} caminhos e ` +
    `${relatoriosLidos}/${relatoriosEsperados} relatorios, todos em ` +
    `${PERFIL_ESPERADO}/${THROTTLING_ESPERADO}, sem redirecionamento e sem erro de status.\n`
)
