/*
 * AS FUNÇÕES DA CONFERÊNCIA DO AMBIENTE LOCAL (change endurecer-agentes-e-git-local,
 * D4; LB-05 e LB-06).
 *
 * Só funções, sem efeito ao ser importado e sem ler disco: quem lê o disco e roda o
 * Git é o scripts/conferir-ambiente-local.mjs, e o teste
 * (tests/barreiras/ambiente-local.test.mjs) importa daqui.
 *
 * NUNCA IMPRIME VALOR: do `.git/config` sai só a seção e a chave, com a subseção
 * trocada por `<subseção>` (um `[url "https://<token>@github.com/"]` levaria a
 * credencial); do `.git/info/attributes`, só o número da linha; das configurações do
 * Claude Code, só se os ganchos estão desligados.
 */

// A lista de chaves do .git/config (Q10 (a), lista do Gabriel de 21/11/2026).
export const URL_DO_ORIGIN = 'https://github.com/Liga-Academica-Liacup/portal-liacup.git'
export const FETCH_DO_ORIGIN = '+refs/heads/*:refs/remotes/origin/*'
/*
 * As chaves core.* que existiam no .git/config desta máquina em 21/11/2026, lidas
 * pelo nome na primeira execução desta conferência. Chave core.* nova para a
 * conferência, e entra aqui só por decisão escrita do Gabriel.
 */
export const CHAVES_CORE_PERMITIDAS = [
  'core.repositoryformatversion',
  'core.filemode',
  'core.bare',
  'core.logallrefupdates',
  'core.symlinks',
  'core.ignorecase',
]
// Rodam programa ou mudam onde o Git procura gancho: nunca entram, mesmo que existam.
export const CHAVES_QUE_NUNCA_ENTRAM = [
  'core.fsmonitor',
  'core.hookspath',
  'core.sshcommand',
  'core.pager',
  'core.editor',
  'core.askpass',
]

/*
 * Executáveis que o Windows acharia na pasta atual antes do Git do PATH (achado 5 do
 * revisor): na raiz do projeto, qualquer um deles para a conferência.
 */
const EXECUTAVEIS_DO_GIT = new Set(['git', 'git.exe', 'git.cmd', 'git.bat', 'git.com'])

// Pastas que a conferência não percorre nem vigia, em qualquer profundidade.
export const PASTAS_FORA = new Set(['node_modules', '.next', '.git'])

/*
 * Os caminhos vigiados (D4 e D6): configuração e instrução que uma ferramenta de
 * agente de IA lê sozinha ao abrir a pasta. O nome se compara sem diferença de
 * maiúscula, porque o disco do Windows também não diferencia.
 */
const PASTAS_VIGIADAS = new Set(['.claude', '.cursor', '.clinerules'])
const NOMES_VIGIADOS = new Set([
  'claude.md',
  'claude.local.md',
  'agents.md',
  'gemini.md',
  '.mcp.json',
  '.cursorrules',
  '.windsurfrules',
  '.clinerules',
])

export function ehVigiado(caminho) {
  const partes = caminho.split('/')
  if (partes.some((p) => PASTAS_FORA.has(p.toLowerCase()))) return false
  const baixo = partes.map((p) => p.toLowerCase())
  if (baixo.slice(0, -1).some((p) => PASTAS_VIGIADAS.has(p))) return true
  if (NOMES_VIGIADOS.has(baixo.at(-1))) return true
  const junto = baixo.join('/')
  return (
    junto === 'openspec/config.yaml' ||
    junto === '.github/copilot-instructions.md' ||
    junto.startsWith('.github/instructions/')
  )
}

// Lê o valor de uma linha do .git/config: aspas, escapes, comentário e continuação.
// O valor começa na coluna `inicio` da linha `i`.
function lerValor(linhas, i, inicio) {
  let valor = ''
  let entreAspas = false
  let pendente = ''
  let linha = linhas[i]
  let j0 = inicio
  for (;;) {
    let continua = false
    for (let j = j0; j < linha.length; j++) {
      const c = linha[j]
      if (c === '\\') {
        if (j === linha.length - 1) {
          continua = true
          break
        }
        const p = linha[++j]
        valor += pendente + ({ n: '\n', t: '\t', b: '\b' }[p] ?? p)
        pendente = ''
      } else if (c === '"') {
        valor += pendente
        pendente = ''
        entreAspas = !entreAspas
      } else if (!entreAspas && (c === '#' || c === ';')) {
        break
      } else if (!entreAspas && (c === ' ' || c === '\t')) {
        if (valor !== '') pendente += c
      } else {
        valor += pendente + c
        pendente = ''
      }
    }
    if (!continua) break
    i += 1
    if (i >= linhas.length) throw new Error('continuação no fim do arquivo')
    linha = linhas[i]
    j0 = 0
  }
  if (entreAspas) throw new Error('aspas sem par')
  return { valor, proxima: i + 1 }
}

/*
 * Lê o .git/config. Devolve as entradas ({ nome, impresso, valor, linha }) e os
 * problemas. `nome` tem a subseção e serve só para comparar; `impresso` a troca por
 * `<subseção>` e é o único que vai para mensagem. Linha que a conferência não
 * entende é problema, e para.
 */
export function lerConfigDoGit(texto) {
  const linhas = texto.replace(/\r/g, '').split('\n')
  const entradas = []
  const problemas = []
  let secao = null
  let i = 0
  while (i < linhas.length) {
    const numero = i + 1
    const linha = linhas[i].trim()
    if (linha === '' || linha.startsWith('#') || linha.startsWith(';')) {
      i += 1
      continue
    }
    const cabecalho = /^\[([A-Za-z0-9.-]+)(?:\s+"((?:[^"\\]|\\.)*)")?\]\s*(?:[#;].*)?$/.exec(linha)
    if (cabecalho) {
      const [nome, ...legado] = cabecalho[1].split('.')
      const sub =
        cabecalho[2] !== undefined ? cabecalho[2].replace(/\\(.)/g, '$1') : legado.join('.')
      const base = nome.toLowerCase()
      secao = {
        nome: base + (sub !== '' ? `.${sub}` : ''),
        impresso: base + (sub !== '' ? '.<subseção>' : ''),
      }
      i += 1
      continue
    }
    const chave = /^([A-Za-z][A-Za-z0-9-]*)\s*(=.*)?$/.exec(linha)
    if (!chave || secao === null) {
      problemas.push(`linha ${numero} que a conferência não entende`)
      i += 1
      continue
    }
    const sufixo = `.${chave[1].toLowerCase()}`
    const entrada = { nome: secao.nome + sufixo, impresso: secao.impresso + sufixo, linha: numero }
    if (chave[2] === undefined) {
      entradas.push({ ...entrada, valor: 'true' })
      i += 1
      continue
    }
    try {
      const { valor, proxima } = lerValor(linhas, i, linhas[i].indexOf('=') + 1)
      entradas.push({ ...entrada, valor })
      i = proxima
    } catch (erro) {
      problemas.push(`linha ${numero} que a conferência não entende (${erro.message})`)
      i += 1
    }
  }
  return { entradas, problemas }
}

/*
 * Confere o .git/config contra a lista. Devolve o total de chaves, os nomes fora da
 * lista e os problemas. Nenhuma mensagem leva valor nem subseção.
 */
export function conferirConfigDoGit(texto, chavesCore = CHAVES_CORE_PERMITIDAS) {
  const { entradas, problemas } = lerConfigDoGit(texto)
  const permitidasCore = new Set(chavesCore.map((c) => c.toLowerCase()))
  const foraDaLista = []
  const esperado = (entrada, valor) => {
    if (entrada.valor !== valor) {
      problemas.push(`${entrada.impresso} com valor diferente do esperado (linha ${entrada.linha})`)
    }
  }
  for (const entrada of entradas) {
    const { nome, impresso } = entrada
    if (nome.startsWith('include.') || nome.startsWith('includeif.')) {
      problemas.push(`${impresso}: include muda o arquivo de configuração que o Git lê`)
    } else if (CHAVES_QUE_NUNCA_ENTRAM.includes(nome)) {
      problemas.push(`chave que nunca entra na lista: ${impresso}`)
    } else if (nome === 'remote.origin.url') {
      esperado(entrada, URL_DO_ORIGIN)
    } else if (nome === 'remote.origin.fetch') {
      esperado(entrada, FETCH_DO_ORIGIN)
    } else if (/^branch\..+\.remote$/.test(nome)) {
      esperado(entrada, 'origin')
    } else if (/^branch\..+\.(merge|vscode-merge-base)$/.test(nome)) {
      // Permitidas com qualquer valor: o nome da branch de origem.
    } else if (nome === 'lfs.repositoryformatversion') {
      // Permitida com qualquer valor.
    } else if (nome.startsWith('core.') && permitidasCore.has(nome)) {
      // Existia hoje (Q10 (a)).
    } else {
      foraDaLista.push(impresso)
    }
  }
  return { total: entradas.length, foraDaLista, problemas }
}

// Gancho ativo do Git: todo arquivo de .git/hooks/ que não termina em .sample.
export function ganchosAtivosDoGit(nomes) {
  return nomes.filter((n) => !n.endsWith('.sample'))
}

// As linhas ativas de um arquivo de regras: toda linha que não é comentário nem vazia.
function linhasAtivas(texto) {
  return texto
    .replace(/\r/g, '')
    .split('\n')
    .map((l, i) => ({ numero: i + 1, regra: l.trimEnd() }))
    .filter(({ regra }) => regra.trim() !== '' && !regra.startsWith('#'))
}

// Regras do .git/info/exclude: toda linha que não é comentário nem vazia.
export function regrasAtivas(texto) {
  return linhasAtivas(texto).map(({ regra }) => regra)
}

// Os ganchos do Claude Code estão desligados neste arquivo de configuração?
export function desligaOsGanchos(textoJson) {
  const config = JSON.parse(textoJson)
  return Boolean(config?.disableAllHooks)
}

// Os nomes da raiz que o Windows rodaria no lugar do Git.
export function executaveisDoGitNaRaiz(nomes) {
  return nomes.filter((n) => EXECUTAVEIS_DO_GIT.has(n.toLowerCase()))
}

/*
 * O passo 1 (D4), sem o Git. Tudo o que ele acusa para a conferência ANTES de rodar
 * qualquer `git` (achado 3 do revisor): o .git/config fora da lista, um gancho do
 * Git, uma linha ativa no .git/info/attributes (um filtro roda programa no
 * `git hash-object`), os ganchos do Claude Code desligados, ou um executável do Git
 * na raiz. `configsDoClaude` é uma lista de [nome, texto].
 */
export function paradasAntesDoGit({
  textoConfig,
  nomesDosGanchos,
  textoAttributes,
  configsDoClaude,
  nomesNaRaiz,
}) {
  const paradas = []
  const config = conferirConfigDoGit(textoConfig)
  config.problemas.forEach((p) => paradas.push(`.git/config · ${p}`))
  config.foraDaLista.forEach((n) => paradas.push(`.git/config · chave fora da lista: ${n}`))
  const ganchos = ganchosAtivosDoGit(nomesDosGanchos)
  ganchos.forEach((g) => paradas.push(`.git/hooks · gancho ativo: ${g}`))
  linhasAtivas(textoAttributes).forEach(({ numero }) =>
    paradas.push(`.git/info/attributes · regra ativa na linha ${numero}`)
  )
  let claudeDesligado = false
  for (const [nome, texto] of configsDoClaude) {
    try {
      if (desligaOsGanchos(texto)) {
        claudeDesligado = true
        paradas.push(`Claude Code · disableAllHooks ligado em ${nome}`)
      }
    } catch {
      paradas.push(`Claude Code · ${nome} não é JSON que a conferência consiga ler`)
    }
  }
  executaveisDoGitNaRaiz(nomesNaRaiz).forEach((n) =>
    paradas.push(`raiz do projeto · ${n} seria rodado no lugar do Git`)
  )
  const medidas = {
    chaves: config.total,
    foraDaLista: config.foraDaLista.length,
    ganchosDoGit: ganchos.length,
    claudeDesligado,
  }
  return { paradas, medidas }
}

// Compara a árvore da main com o disco: Map caminho → sha do blob, nos dois lados.
export function compararArvore(main, disco) {
  const caminhos = [...new Set([...main.keys(), ...disco.keys()])].sort()
  const diferencas = []
  let iguais = 0
  for (const caminho of caminhos) {
    if (!disco.has(caminho)) diferencas.push({ tipo: 'arquivo', caminho, situacao: 'só na main' })
    else if (!main.has(caminho)) {
      diferencas.push({ tipo: 'arquivo', caminho, situacao: 'só no disco' })
    } else if (main.get(caminho) !== disco.get(caminho)) {
      diferencas.push({ tipo: 'arquivo', caminho, situacao: 'diferente da main' })
    } else iguais += 1
  }
  return { comparados: caminhos.length, iguais, diferencas }
}

/*
 * Onde está o registro da change (achado 6 do revisor). Primeiro o da change em
 * curso; se não existir, o da única pasta de openspec/changes/archive/ chamada
 * exatamente `AAAA-MM-DD-<nome>`: data de 10 caracteres, hífen e o nome inteiro, para
 * um nome que é só o fim de outro não casar (achado 6 do revisor, rodada 2). Duas
 * pastas casando: lança, e a conferência para. Devolve o caminho relativo à raiz,
 * com `/`, ou null.
 */
const PREFIXO_DO_ARCHIVE = /^\d{4}-\d{2}-\d{2}-$/

function ePastaDaChange(pasta, change) {
  return pasta.slice(11) === change && PREFIXO_DO_ARCHIVE.test(pasta.slice(0, 11))
}

export function acharRegistro(change, { ativoExiste, pastasDoArchive }) {
  if (ativoExiste) return `openspec/changes/${change}/ambiente-decidido.txt`
  const casam = pastasDoArchive.filter((p) => ePastaDaChange(p, change))
  if (casam.length > 1) {
    throw new Error(`duas pastas do archive são AAAA-MM-DD-${change}: ${casam.join(', ')}`)
  }
  return casam.length === 1 ? `openspec/changes/archive/${casam[0]}/ambiente-decidido.txt` : null
}

/*
 * Lê o registro de diferenças decididas. Toda linha cita a decisão depois de `#`.
 * Só `arquivo` e `exclude`: o attributes para antes do Git, e o registro não o aceita.
 */
export function lerRegistro(texto) {
  const entradas = []
  const problemas = []
  texto
    .replace(/\r/g, '')
    .split('\n')
    .forEach((bruta, i) => {
      const linha = bruta.trim()
      if (linha === '' || linha.startsWith('#')) return
      const corte = linha.indexOf(' #')
      const corpo = corte === -1 ? '' : linha.slice(0, corte).trim()
      const decisao = corte === -1 ? '' : linha.slice(corte + 2).trim()
      const arquivo = /^arquivo (\S+) ([0-9a-f]{64}|ausente)$/.exec(corpo)
      const regra = /^exclude (.+)$/.exec(corpo)
      if (decisao === '' || (!arquivo && !regra)) {
        problemas.push(`linha ${i + 1} do registro fora do formato, ou sem a decisão citada`)
      } else if (arquivo) {
        entradas.push({ tipo: 'arquivo', caminho: arquivo[1], sha256: arquivo[2], linha })
      } else {
        entradas.push({ tipo: 'exclude', regra: regra[1], linha })
      }
    })
  return { entradas, problemas }
}

/*
 * Aplica o registro às diferenças. Arquivo é aceito só se o sha256 do disco for o
 * registrado; regra, só se for a mesma, letra por letra.
 */
export function aplicarRegistro(diferencas, entradas, sha256DoDisco) {
  const usadas = new Set()
  const aceitas = []
  const naoAceitas = []
  for (const d of diferencas) {
    const entrada = entradas.find((e) =>
      d.tipo === 'arquivo'
        ? e.tipo === 'arquivo' &&
          e.caminho === d.caminho &&
          e.sha256 === (d.situacao === 'só na main' ? 'ausente' : sha256DoDisco(d.caminho))
        : e.tipo === d.tipo && e.regra === d.regra
    )
    if (entrada) {
      usadas.add(entrada)
      aceitas.push({ ...d, linha: entrada.linha })
    } else naoAceitas.push(d)
  }
  return { aceitas, naoAceitas, semUso: entradas.filter((e) => !usadas.has(e)) }
}

export function descrever(d) {
  return d.tipo === 'arquivo'
    ? `arquivo ${d.situacao}: ${d.caminho}`
    : `regra ativa no .git/info/${d.tipo}: ${d.regra}`
}

export function montarResumo(m) {
  return (
    `arquivos comparados: ${m.comparados} · iguais à main: ${m.iguais} · ` +
    `diferentes: ${m.diferentes} (aceitos por decisão: ${m.aceitos}) · ` +
    `regras de exclusão: ${m.regras} · ganchos do Git ativos: ${m.ganchosDoGit} · ` +
    `chaves do .git/config: ${m.chaves} (fora da lista: ${m.foraDaLista}) · ` +
    `ganchos do Claude Code: ${m.claudeDesligado ? 'desligados' : 'ligados'}`
  )
}
