#!/usr/bin/env node
/*
 * A CONFERÊNCIA DO AMBIENTE LOCAL (change endurecer-agentes-e-git-local, D4;
 * LB-05 e LB-06).
 *
 * Uso: node scripts/conferir-ambiente-local.mjs [--change <nome>]
 *
 * Roda com o `node` direto, e nunca por `npm run`: o npm lê o `.npmrc` e roda
 * scripts `pre` e `post` antes da conferência que existe para conferir o ambiente.
 *
 * O QUE CONFERE, NESTA ORDEM, COM A FALHA FECHADA:
 *
 * 1. Sem rodar o Git, lê como texto o `.git/config` (contra uma lista de chaves
 *    permitidas), a pasta `.git/hooks/`, o `.git/info/exclude`, o
 *    `.git/info/attributes`, o `disableAllHooks` das configurações do Claude Code e
 *    os nomes da raiz. Chave fora da lista, gancho do Git, linha ativa no attributes,
 *    ganchos do Claude Code desligados ou um `git.exe` na raiz param a conferência
 *    ANTES de rodar qualquer `git`, e a saída diz o motivo. O exclude não faz o Git
 *    rodar programa: entra como diferença.
 * 2. Com o Git, só leitura: `git ls-tree` da `main` e `git hash-object` (sem `-w`)
 *    de cada arquivo vigiado do disco, que aplica a mesma conversão de fim de linha
 *    do Git. O disco é listado pelo sistema de arquivos, e não pelo `git ls-files`,
 *    para alcançar o que o `.gitignore` e o exclude escondem. Entre os vigiados estão
 *    este arquivo e o ./conferir-ambiente-local/funcoes.mjs (change
 *    completar-ci-do-novo-fluxo, D7, Q7 (b)): a conferência compara a si mesma.
 *
 * NUNCA IMPRIME VALOR: do `.git/config` sai só a seção e a chave, com a subseção
 * trocada por `<subseção>`. Da diferença de arquivo sai o sha256 do conteúdo do
 * disco, que é o que o líder técnico copia para o registro sem citar o caminho num
 * comando (a barreira recusa comando que cite .claude/settings ou .claude/ganchos).
 *
 * DIFERENÇA DECIDIDA: com `--change`, o registro
 * `openspec/changes/<change>/ambiente-decidido.txt`, ou, depois do archive, o da
 * única pasta de `openspec/changes/archive/` que termina em `-<change>`, aceita a
 * diferença nomeada, com a decisão citada em cada linha:
 *
 *   arquivo <caminho> <sha256 do conteúdo no disco, ou "ausente">  # decisão
 *   exclude <regra do .git/info/exclude>  # decisão
 *
 * SEMPRE CONFERE: não há teste de "fui chamado direto?" (achado 2 do revisor); as
 * funções que o teste usa estão em ./conferir-ambiente-local/funcoes.mjs. Sai com 0
 * só sem diferença não aceita; todo erro sai com 1.
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const lerSeExiste = (caminho) => (existsSync(caminho) ? readFileSync(caminho, 'utf8') : null)
const daRaiz = (relativo) => join(RAIZ, ...relativo.split('/'))
const sha256DoDisco = (c) =>
  createHash('sha256')
    .update(readFileSync(daRaiz(c)))
    .digest('hex')

/*
 * O Git roda com um ambiente mínimo, montado por nome: sem variável GIT_* herdada,
 * sem a configuração do sistema e sem pasta pessoal, então ele lê só o .git/config
 * que o passo 1 conferiu. Nada do ambiente é repassado inteiro.
 */
function rodarGit(args, entrada) {
  return execFileSync('git', args, {
    cwd: RAIZ,
    input: entrada,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { PATH: process.env.PATH, SYSTEMROOT: process.env.SYSTEMROOT, GIT_CONFIG_NOSYSTEM: '1' },
  })
}

// Lista os arquivos vigiados do disco, pelo sistema de arquivos.
function arquivosVigiadosNoDisco(f, pasta = RAIZ, prefixo = '') {
  const achados = []
  for (const item of readdirSync(pasta, { withFileTypes: true })) {
    const relativo = prefixo + item.name
    if (item.isDirectory()) {
      if (!f.PASTAS_FORA.has(item.name.toLowerCase())) {
        achados.push(...arquivosVigiadosNoDisco(f, join(pasta, item.name), `${relativo}/`))
      }
    } else if (f.ehVigiado(relativo)) {
      achados.push(relativo)
    }
  }
  return achados
}

function lerArgumentos(argv) {
  if (argv.length === 0) return { change: null }
  if (argv.length === 2 && argv[0] === '--change' && /^[a-z0-9][a-z0-9-]*$/.test(argv[1])) {
    return { change: argv[1] }
  }
  throw new Error('uso: node scripts/conferir-ambiente-local.mjs [--change <nome-da-change>]')
}

// Passo 1: lê o .git, as configurações do Claude Code e a raiz como texto, sem o Git.
function passoSemGit(f) {
  if (!existsSync(join(RAIZ, '.git')) || !lstatSync(join(RAIZ, '.git')).isDirectory()) {
    throw new Error('.git não é uma pasta: a conferência não sabe ler este clone')
  }
  const textoConfig = lerSeExiste(join(RAIZ, '.git', 'config'))
  if (textoConfig === null) throw new Error('.git/config não existe')
  const pastaGanchos = join(RAIZ, '.git', 'hooks')
  const configsDoClaude = [
    ['~/.claude/settings.json', join(homedir(), '.claude', 'settings.json')],
    ['.claude/settings.json', join(RAIZ, '.claude', 'settings.json')],
    ['.claude/settings.local.json', join(RAIZ, '.claude', 'settings.local.json')],
  ]
    .map(([nome, caminho]) => [nome, lerSeExiste(caminho)])
    .filter(([, texto]) => texto !== null)
  const { paradas, medidas } = f.paradasAntesDoGit({
    textoConfig,
    nomesDosGanchos: existsSync(pastaGanchos) ? readdirSync(pastaGanchos) : [],
    textoAttributes: lerSeExiste(join(RAIZ, '.git', 'info', 'attributes')) ?? '',
    configsDoClaude,
    nomesNaRaiz: readdirSync(RAIZ),
  })
  const exclude = lerSeExiste(join(RAIZ, '.git', 'info', 'exclude')) ?? ''
  const regras = f.regrasAtivas(exclude).map((regra) => ({ tipo: 'exclude', regra }))
  return { paradas, regras, medidas: { ...medidas, regras: regras.length } }
}

// Passo 2: a árvore da main contra o disco, com o Git, só leitura.
function passoComGit(f) {
  const main = new Map()
  const arvore = rodarGit(['ls-tree', '-r', '-z', '--full-tree', 'refs/heads/main'])
  for (const registro of arvore.split('\0')) {
    const tab = registro.indexOf('\t')
    if (tab === -1) continue
    const [, tipo, sha] = registro.slice(0, tab).split(' ')
    const caminho = registro.slice(tab + 1)
    if (tipo === 'blob' && f.ehVigiado(caminho)) main.set(caminho, sha)
  }
  const noDisco = arquivosVigiadosNoDisco(f)
  const disco = new Map()
  if (noDisco.length > 0) {
    const shas = rodarGit(['hash-object', '--stdin-paths'], noDisco.join('\n') + '\n')
      .trim()
      .split('\n')
    if (shas.length !== noDisco.length) throw new Error('git hash-object devolveu outra contagem')
    noDisco.forEach((c, i) => disco.set(c, shas[i]))
  }
  return f.compararArvore(main, disco)
}

// O registro de diferenças decididas da change, se houver --change. Diz qual caminho leu.
function lerRegistroDaChange(f, change, paradas) {
  if (change === null) return []
  const archive = join(RAIZ, 'openspec', 'changes', 'archive')
  const pastasDoArchive = existsSync(archive)
    ? readdirSync(archive, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
    : []
  const ativoExiste = existsSync(daRaiz(`openspec/changes/${change}/ambiente-decidido.txt`))
  const caminho = f.acharRegistro(change, { ativoExiste, pastasDoArchive })
  const texto = caminho === null ? null : lerSeExiste(daRaiz(caminho))
  if (texto === null) {
    console.log(`registro: ausente (${caminho ?? change})`)
    return []
  }
  const registro = f.lerRegistro(texto)
  registro.problemas.forEach((p) => paradas.push(`registro · ${p}`))
  console.log(`registro: ${registro.entradas.length} linhas (${caminho})`)
  return registro.entradas
}

async function principal() {
  const f = await import('./conferir-ambiente-local/funcoes.mjs')
  const { change } = lerArgumentos(process.argv.slice(2))
  const { paradas, regras, medidas } = passoSemGit(f)

  if (paradas.length > 0) {
    paradas.forEach((p) => console.log(`PARA · ${p}`))
    console.log('parou antes de rodar o Git, pelos motivos acima')
    console.log(f.montarResumo({ ...medidas, comparados: 0, iguais: 0, diferentes: 0, aceitos: 0 }))
    return 1
  }

  const arvore = passoComGit(f)
  const diferencas = [...arvore.diferencas, ...regras]
  const entradas = lerRegistroDaChange(f, change, paradas)
  const { aceitas, naoAceitas, semUso } = f.aplicarRegistro(diferencas, entradas, sha256DoDisco)

  aceitas.forEach((d) => console.log(`ACEITA · ${f.descrever(d)} · ${d.linha}`))
  semUso.forEach((e) => console.log(`AVISO · linha do registro sem diferença: ${e.linha}`))
  naoAceitas.forEach((d) => {
    const noDisco = d.tipo === 'arquivo' && d.situacao !== 'só na main'
    console.log(
      `DIFERENÇA · ${f.descrever(d)}${noDisco ? ` · sha256 ${sha256DoDisco(d.caminho)}` : ''}`
    )
  })
  paradas.forEach((p) => console.log(`PARA · ${p}`))
  console.log(
    f.montarResumo({
      ...medidas,
      comparados: arvore.comparados,
      iguais: arvore.iguais,
      diferentes: diferencas.length,
      aceitos: aceitas.length,
    })
  )
  return naoAceitas.length + paradas.length === 0 ? 0 : 1
}

try {
  process.exitCode = await principal()
} catch (erro) {
  console.log(`PARA · erro na conferência: ${erro?.message}`)
  process.exitCode = 1
}
