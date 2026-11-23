#!/usr/bin/env node
/*
 * AS AÇÕES PRESAS (change ajustar-ci-ao-novo-fluxo, D4; LB-17).
 *
 * Uso: npm run verificar:acoes (roda também no job Verificacoes do CI).
 *
 * Uma ação presa por etiqueta (`@v4`) ou por ramo (`@main`) muda quando o dono da
 * ação move a etiqueta, e o CI passa a rodar código que ninguém revisou. Presa pelo
 * commit, ela só muda quando alguém muda o fluxo, e isso aparece no diff.
 *
 * O QUE LÊ: todo `.github/workflows/*.yml` e `*.yaml`, e todo `action.yml` ou
 * `action.yaml` dentro de `.github/actions/`, se a pasta existir. A raiz é a pasta
 * atual, como na verificação de tokens: o `npm run` e o CI rodam na raiz do projeto.
 *
 * O QUE ACEITA, linha a linha, em toda chave `uses:`, no bloco (`- uses: …`) e no
 * mapa de uma linha (`- { uses: … } # v…`, com `uses` logo depois de `{` ou de `,`):
 *   - ação externa `dono/repo(/caminho)@<40 hex>` seguida de `# v<número>…`;
 *   - ação do próprio repositório (`./…`), contada à parte, como "locais";
 *   - imagem `docker://…@sha256:<64 hex>`, que é imutável como o commit e conta junto
 *     das presas.
 * Todo o resto fica fora da regra, com `arquivo:linha` e o motivo.
 *
 * TRÊS SAÍDAS (RP-12): NÃO VERIFICADO com zero arquivos de fluxo (código 1); FORA DA
 * REGRA com qualquer referência recusada (código 1); VERIFICADO (código 0). As três
 * dizem quanto leram.
 *
 * SEMPRE CONFERE: não há teste de "fui chamado direto?", pelo achado 2 do revisor na
 * conferência do ambiente. Por isso o teste (tests/barreiras/acoes-presas.test.mjs)
 * roda este script como processo, sobre pastas montadas por ele.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const RAIZ = process.cwd()

const SHA_DE_COMMIT = /^[0-9a-f]{40}$/
const EXTERNA = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[^@\s]+)?@([^@\s]+)$/
const DOCKER_PRESA = /^docker:\/\/[^@\s]+@sha256:[0-9a-f]{64}$/
const COMENTARIO_DE_VERSAO = /^v\d/

// A chave `uses:` de um passo ou de um job, com ou sem `- ` antes e com ou sem aspas.
const LINHA_USES = /^\s*(?:-\s+)?(['"]?)uses\1\s*:(.*)$/
/*
 * O mapa de uma linha, `- { name: x, uses: dono/repo@… } # v…`: o miolo entre as
 * chaves e o comentário depois delas. Dentro do miolo, `uses` vem no começo ou
 * depois de uma vírgula, e o valor vai até a vírgula seguinte.
 */
const MAPA_DE_UMA_LINHA = /^\s*(?:-\s+)?\{(.*)\}\s*(?:#(.*))?$/
const USES_NO_MAPA = /(?:^|,)\s*(['"]?)uses\1\s*:([^,]*)/
// O valor, com ou sem aspas, e o comentário opcional depois dele.
const VALOR_E_COMENTARIO = /^\s*(['"]?)([^\s'"#]+)\1(?:\s+#\s*(.*?))?\s*$/

/*
 * Classifica o valor de uma linha `uses:`. Devolve { tipo: 'presa' | 'local' } ou
 * { tipo: 'fora', motivo }.
 */
function classificar(restoDaLinha) {
  const partes = VALOR_E_COMENTARIO.exec(restoDaLinha)
  if (!partes) return { tipo: 'fora', motivo: 'valor que a verificação não sabe ler' }
  const [, , valor, comentario] = partes
  if (valor.startsWith('./')) return { tipo: 'local' }
  if (valor.startsWith('docker://')) {
    return DOCKER_PRESA.test(valor)
      ? { tipo: 'presa' }
      : { tipo: 'fora', motivo: 'imagem docker sem @sha256:<64 hex>' }
  }
  const externa = EXTERNA.exec(valor)
  if (!externa) return { tipo: 'fora', motivo: 'referência sem a forma dono/repo@<ref>' }
  if (!SHA_DE_COMMIT.test(externa[1])) {
    return { tipo: 'fora', motivo: `presa por etiqueta ou ramo (@${externa[1]}), não por commit` }
  }
  if (comentario === undefined || !COMENTARIO_DE_VERSAO.test(comentario)) {
    return { tipo: 'fora', motivo: 'presa por commit, sem a versão num comentário `# v…`' }
  }
  return { tipo: 'presa' }
}

/*
 * O resto da linha depois de `uses:`, no bloco ou no mapa de uma linha, na forma que
 * classificar() lê: o valor e o comentário. Sem `uses:` na linha, devolve null.
 */
function restoDoUses(linha) {
  const noBloco = LINHA_USES.exec(linha)
  if (noBloco) return noBloco[2]
  const mapa = MAPA_DE_UMA_LINHA.exec(linha)
  const noMapa = mapa && USES_NO_MAPA.exec(mapa[1])
  if (!noMapa) return null
  return mapa[2] === undefined ? noMapa[2] : `${noMapa[2].trimEnd()} #${mapa[2]}`
}

// Confere o texto de um arquivo. Devolve os contadores e os problemas, com a linha.
function conferirTexto(texto) {
  const resultado = { referencias: 0, presas: 0, locais: 0, problemas: [] }
  texto.split(/\r?\n/).forEach((linha, indice) => {
    const resto = restoDoUses(linha)
    if (resto === null) return
    resultado.referencias += 1
    const classificacao = classificar(resto)
    if (classificacao.tipo === 'presa') resultado.presas += 1
    else if (classificacao.tipo === 'local') resultado.locais += 1
    else resultado.problemas.push({ linha: indice + 1, motivo: classificacao.motivo })
  })
  return resultado
}

// Os arquivos de fluxo e de ação, relativos à raiz, com barra normal.
function arquivosDeFluxo() {
  const achados = []
  const fluxos = join(RAIZ, '.github', 'workflows')
  if (existsSync(fluxos)) {
    for (const entrada of readdirSync(fluxos, { withFileTypes: true })) {
      if (entrada.isFile() && /\.ya?ml$/i.test(entrada.name)) {
        achados.push(`.github/workflows/${entrada.name}`)
      }
    }
  }
  const procurarAcoes = (pasta, prefixo) => {
    for (const entrada of readdirSync(pasta, { withFileTypes: true })) {
      const relativo = `${prefixo}/${entrada.name}`
      if (entrada.isDirectory()) procurarAcoes(join(pasta, entrada.name), relativo)
      else if (/^action\.ya?ml$/i.test(entrada.name)) achados.push(relativo)
    }
  }
  const acoes = join(RAIZ, '.github', 'actions')
  if (existsSync(acoes)) procurarAcoes(acoes, '.github/actions')
  return achados.sort()
}

function principal() {
  const arquivos = arquivosDeFluxo()
  const total = { referencias: 0, presas: 0, locais: 0, fora: 0 }
  const problemas = []
  for (const arquivo of arquivos) {
    const conferido = conferirTexto(readFileSync(join(RAIZ, ...arquivo.split('/')), 'utf8'))
    total.referencias += conferido.referencias
    total.presas += conferido.presas
    total.locais += conferido.locais
    total.fora += conferido.problemas.length
    conferido.problemas.forEach((problema) =>
      problemas.push(`${arquivo}:${problema.linha} · ${problema.motivo}`)
    )
  }
  const resumo =
    `arquivos: ${arquivos.length} · referências: ${total.referencias} · ` +
    `presas por commit: ${total.presas} · locais: ${total.locais} · fora da regra: ${total.fora}`

  console.log('\nAções do CI presas por commit\n')
  if (arquivos.length === 0) {
    console.log('=== NAO VERIFICADO — ações presas ===')
    console.log('  Nenhum arquivo em .github/workflows/ nem em .github/actions/: nada foi lido.')
    console.log(`  ${resumo}\n`)
    return 1
  }
  if (problemas.length > 0) {
    console.log('=== FORA DA REGRA — ações presas ===')
    problemas.forEach((problema) => console.log(`  ${problema}`))
    console.log('  A forma aceita é `uses: dono/repo@<sha de 40> # v<versão>`.')
    console.log(`  ${resumo}\n`)
    return 1
  }
  console.log('=== VERIFICADO — ações presas ===')
  console.log(`  ${resumo}\n`)
  return 0
}

try {
  process.exitCode = principal()
} catch (erro) {
  console.log(`=== NAO VERIFICADO — ações presas ===\n  erro na leitura: ${erro?.message}\n`)
  process.exitCode = 1
}
