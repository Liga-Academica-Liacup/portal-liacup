#!/usr/bin/env node
/*
 * AS AÇÕES PRESAS (change ajustar-ci-ao-novo-fluxo, D4; LB-17; e change
 * completar-ci-do-novo-fluxo, D4, A2 da ajustar-ci).
 *
 * Uso: npm run verificar:acoes (roda também no job Verificacoes do CI).
 *
 * Uma ação presa por etiqueta (`@v4`) ou por ramo (`@main`) muda quando o dono da
 * ação move a etiqueta, e o CI passa a rodar código que ninguém revisou. Presa pelo
 * commit, ela só muda quando alguém muda o fluxo, e isso aparece no diff.
 *
 * O QUE LÊ: todo `.github/workflows/*.yml` e `*.yaml`, todo `action.yml` ou
 * `action.yaml` dentro de `.github/actions/`, se a pasta existir, e a definição de
 * toda ação local citada por `uses: ./…`, em qualquer pasta: o `action.yml` ou o
 * `action.yaml` dela (ou o próprio arquivo, num fluxo reutilizável `./….yml`). A
 * definição lida também é conferida, e as ações locais que ela cita também. A raiz é
 * a pasta atual, como na verificação de tokens: o `npm run` e o CI rodam na raiz.
 *
 * ONDE ACHA `uses:`, linha a linha:
 *   - no bloco: `uses: …`, `- uses: …` ou `- - uses: …`;
 *   - na lista ou no mapa escritos numa linha só, depois de `- ` e de `chave: `:
 *     `- { uses: … } # v…`, `steps: [{ uses: … }]`, `jobs: { x: { uses: … } }`. Ali,
 *     `uses` é chave logo depois de `{`, de `[` ou de `,`, fora de aspas, e o
 *     comentário do fim da linha vale para cada `uses` dela.
 *
 * O QUE ACEITA, em toda chave `uses:`:
 *   - ação externa `dono/repo(/caminho)@<40 hex>` seguida de `# v<número>…`;
 *   - ação do próprio repositório (`./…`), contada à parte, como "locais", quando a
 *     definição dela existe dentro do repositório;
 *   - imagem `docker://…@sha256:<64 hex>`, que é imutável como o commit e conta junto
 *     das presas.
 * Todo o resto fica fora da regra, com `arquivo:linha` e o motivo; também a ação
 * local sem definição, ou fora do repositório, que a verificação não consegue ler.
 *
 * TRÊS SAÍDAS (RP-12): NÃO VERIFICADO com zero arquivos de fluxo (código 1); FORA DA
 * REGRA com qualquer referência recusada (código 1); VERIFICADO (código 0). As três
 * dizem quanto leram.
 *
 * SEMPRE CONFERE: não há teste de "fui chamado direto?", pelo achado 2 do revisor na
 * conferência do ambiente. Por isso o teste (tests/barreiras/acoes-presas.test.mjs)
 * roda este script como processo, sobre pastas montadas por ele.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, posix } from 'node:path'

const RAIZ = process.cwd()

const SHA_DE_COMMIT = /^[0-9a-f]{40}$/
const EXTERNA = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[^@\s]+)?@([^@\s]+)$/
const DOCKER_PRESA = /^docker:\/\/[^@\s]+@sha256:[0-9a-f]{64}$/
const COMENTARIO_DE_VERSAO = /^v\d/

// O que vem antes do valor numa linha: `- ` de item de lista e `chave: ` de mapa.
const PREFIXO_DE_ITEM = /^-\s+/
const PREFIXO_DE_CHAVE = /^(?:"[^"]*"|'[^']*'|[^\s'"#{}[\],-][^:#{}[\],'"]*?)\s*:\s+/
// `uses` como chave, com ou sem aspas: no começo do valor da linha, ou no ponto em que
// a lista ou o mapa de uma linha espera uma chave.
const USES_COMO_CHAVE = /^(['"]?)uses\1\s*:/
// O valor, com ou sem aspas, e o comentário opcional depois dele.
const VALOR_E_COMENTARIO = /^\s*(['"]?)([^\s'"#]+)\1(?:\s+#\s*(.*?))?\s*$/

/*
 * Classifica o valor de uma linha `uses:`. Devolve { tipo: 'presa' }, { tipo:
 * 'local', alvo } ou { tipo: 'fora', motivo }.
 */
function classificar(restoDaLinha) {
  const partes = VALOR_E_COMENTARIO.exec(restoDaLinha)
  if (!partes) return { tipo: 'fora', motivo: 'valor que a verificação não sabe ler' }
  const [, , valor, comentario] = partes
  if (valor.startsWith('./')) return { tipo: 'local', alvo: valor }
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

const ehEspaco = (caractere) => caractere === ' ' || caractere === '\t'
// `#` só abre comentário no começo ou depois de espaço, como no YAML.
const abreComentario = (texto, i) => texto[i] === '#' && (i === 0 || ehEspaco(texto[i - 1]))

// A posição logo depois da aspa que fecha a que está em `inicio`.
function fimDasAspas(texto, inicio) {
  const aspa = texto[inicio]
  for (let i = inicio + 1; i < texto.length; i++) {
    if (aspa === '"' && texto[i] === '\\') i += 1
    else if (aspa === "'" && texto[i] === "'" && texto[i + 1] === "'") i += 1
    else if (texto[i] === aspa) return i + 1
  }
  return texto.length
}

/*
 * O valor de um `uses:` dentro da lista ou do mapa, a partir de `inicio`: entre
 * aspas, inteiro; sem aspas, até `,`, `{`, `}`, `[`, `]` ou comentário. Um valor que
 * é outra lista ou outro mapa sai como o caractere que o abre, e classificar() o
 * recusa.
 */
function valorNoFluxo(texto, inicio) {
  let i = inicio
  while (i < texto.length && ehEspaco(texto[i])) i += 1
  if (texto[i] === '"' || texto[i] === "'") {
    const fim = fimDasAspas(texto, i)
    return { valor: texto.slice(i, fim), fim }
  }
  if (texto[i] === '{' || texto[i] === '[') return { valor: texto[i], fim: i }
  let fim = i
  while (fim < texto.length && !/[,{}[\]]/.test(texto[fim]) && !abreComentario(texto, fim)) {
    fim += 1
  }
  return { valor: texto.slice(i, fim).trim(), fim }
}

/*
 * Os `uses:` de uma lista ou de um mapa escritos numa linha só (o texto começa em
 * `{` ou `[`). Devolve o resto de cada um, valor e comentário, na forma que
 * classificar() lê.
 */
function usesNoFluxo(texto) {
  const valores = []
  let comentario
  let esperaChave = false
  let podeAbrirAspas = true
  let i = 0
  while (i < texto.length) {
    const caractere = texto[i]
    if (ehEspaco(caractere)) {
      i += 1
      continue
    }
    if (abreComentario(texto, i)) {
      comentario = texto.slice(i + 1)
      break
    }
    const chave = esperaChave ? USES_COMO_CHAVE.exec(texto.slice(i)) : null
    if (chave) {
      const { valor, fim } = valorNoFluxo(texto, i + chave[0].length)
      valores.push(valor)
      i = fim
      esperaChave = podeAbrirAspas = false
      continue
    }
    if ((caractere === '"' || caractere === "'") && podeAbrirAspas) {
      i = fimDasAspas(texto, i)
      esperaChave = podeAbrirAspas = false
      continue
    }
    esperaChave = '{[,'.includes(caractere)
    podeAbrirAspas = '{[,:'.includes(caractere)
    i += 1
  }
  return valores.map((valor) => (comentario === undefined ? valor : `${valor} #${comentario}`))
}

/*
 * O resto de cada `uses:` da linha: um só no bloco, depois de quantos `- ` houver;
 * nenhum ou vários na lista ou no mapa de uma linha. Linha comentada, ou valor que
 * não é `uses:`, lista nem mapa, dá nenhum.
 */
function restosDaLinha(linha) {
  let resto = linha.trimStart()
  for (let item; (item = PREFIXO_DE_ITEM.exec(resto));) resto = resto.slice(item[0].length)
  const noBloco = USES_COMO_CHAVE.exec(resto)
  if (noBloco) return [resto.slice(noBloco[0].length)]
  // Uma chave só antes do valor: `a: b: c` não é YAML de bloco.
  const chave = PREFIXO_DE_CHAVE.exec(resto)
  if (chave) resto = resto.slice(chave[0].length)
  return resto.startsWith('{') || resto.startsWith('[') ? usesNoFluxo(resto) : []
}

// Cada referência de um arquivo, com a linha e a classificação.
const referenciasDoTexto = (texto) =>
  texto
    .split(/\r?\n/)
    .flatMap((linha, indice) =>
      restosDaLinha(linha).map((resto) => ({ linha: indice + 1, ...classificar(resto) }))
    )

const ehArquivo = (relativo) => {
  const completo = join(RAIZ, ...relativo.split('/'))
  return existsSync(completo) && statSync(completo).isFile()
}

/*
 * A definição de uma ação local: `<pasta>/action.yml` ou `<pasta>/action.yaml`, ou o
 * próprio arquivo num fluxo reutilizável. Devolve { arquivo } ou { motivo }.
 */
function definicaoDaAcaoLocal(alvo) {
  const relativo = posix.normalize(alvo).replace(/\/+$/, '')
  if (relativo === '..' || relativo.startsWith('../') || relativo === '') {
    return { motivo: `ação local fora do repositório (${alvo})` }
  }
  const candidatos = /\.ya?ml$/i.test(relativo)
    ? [relativo]
    : ['action.yml', 'action.yaml'].map((nome) => (relativo === '.' ? nome : `${relativo}/${nome}`))
  const achado = candidatos.find(ehArquivo)
  return achado
    ? { arquivo: achado }
    : { motivo: `ação local sem action.yml nem action.yaml (${alvo})` }
}

// Os arquivos de fluxo e de ação de sempre, relativos à raiz, com barra normal.
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
  const lidos = new Set(arquivos)
  const total = { referencias: 0, presas: 0, locais: 0, fora: 0 }
  const problemas = []
  const recusar = (arquivo, linha, motivo) => {
    total.fora += 1
    problemas.push(`${arquivo}:${linha} · ${motivo}`)
  }
  // A lista cresce enquanto é lida: cada definição local nova entra no fim.
  for (let posicao = 0; posicao < arquivos.length; posicao++) {
    const arquivo = arquivos[posicao]
    const texto = readFileSync(join(RAIZ, ...arquivo.split('/')), 'utf8')
    for (const referencia of referenciasDoTexto(texto)) {
      total.referencias += 1
      if (referencia.tipo === 'presa') total.presas += 1
      else if (referencia.tipo === 'fora') recusar(arquivo, referencia.linha, referencia.motivo)
      else {
        const definicao = definicaoDaAcaoLocal(referencia.alvo)
        if (definicao.motivo) recusar(arquivo, referencia.linha, definicao.motivo)
        else {
          total.locais += 1
          if (!lidos.has(definicao.arquivo)) {
            lidos.add(definicao.arquivo)
            arquivos.push(definicao.arquivo)
          }
        }
      }
    }
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
