/*
 * @vitest-environment node
 *
 * O teste de tabela da barreira do Git (change endurecer-agentes-e-git-local, D3).
 *
 * A função de decisão do gancho é importada e conferida contra duas listas: o que
 * precisa passar (as leituras de todo dia e cada forma da lista fechada da §5 do
 * docs/SEGURANCA.md, com as lacunas preenchidas) e o que precisa ser recusado (cada
 * operação da camada 2, os disfarces comuns e a falha fechada).
 *
 * Roda no ambiente node, e não no jsdom da configuração: não há tela, e o
 * gancho é rodado como processo. A linha acima escolhe o ambiente só deste arquivo.
 *
 * O contador no fim diz quantos comandos foram conferidos, porque uma tabela vazia
 * também passaria (RP-12).
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import { decidir, mensagemDeRecusa } from '../../.claude/ganchos/decisao-do-git.mjs'

const GANCHO = fileURLToPath(
  new URL('../../.claude/ganchos/barrar-git-de-escrita.mjs', import.meta.url)
)

// O valor do segredo nunca entra aqui: as formas leem o .env pela entrada padrão.
// O nome é fictício: pela §5 do SEGURANCA.md, só docs/, openspec/, README.md e
// .env.example podem citar o nome real da variável. A forma do comando é a mesma.
const NOME_DO_SEGREDO = 'SEGREDO_DE_EXEMPLO'
const LE_O_SEGREDO = `sed -n 's/^${NOME_DO_SEGREDO}=//p' .env | tr -d '\\r\\n'`
const HOST = 'portal-liacup-git-chore-endurecer-agentes-e-git-local-liacup1.vercel.app'

const PERMITIDOS = [
  // As leituras de todo dia
  'git status',
  'git status --porcelain',
  'git status --porcelain --untracked-files=all',
  'git diff --cached --name-only',
  'git diff --stat',
  'git diff --exit-code main -- .claude/agents .claude/skills',
  'git diff --name-status main...HEAD',
  'git log --oneline -n 5 main',
  'git log --oneline -n 3',
  'git -C . status',
  'git --no-pager log --oneline -n 3',
  'git rev-parse HEAD && git ls-remote origin main',
  'git rev-parse main',
  'git ls-remote origin refs/heads/main',
  'git rev-list main..HEAD',
  'git merge-base main HEAD',
  'git cat-file -t HEAD',
  'git blame README.md',
  'git show --stat HEAD',
  'git branch',
  'git branch --show-current',
  'git branch -a -vv',
  'git version',
  'git --version',
  'git grep -c DEMO-RP12 -- .claude',
  'git ls-files -- AGENTS.md',
  // As formas da lista fechada da §5, com as lacunas preenchidas
  "git log --all --oneline -S 'senha'",
  'git log --oneline -n 20 main',
  "git grep -n -I -e 'process.env' main -- 'src/proxy.ts'",
  "git grep -n -I --untracked -e 'segredo' -- 'openspec/changes/x/relatorio.md'",
  'git diff --stat main..HEAD',
  "git diff main -- 'next.config.ts'",
  "git grep -c -a -e 'chave' main -- 'assets'",
  "git grep -c -a --untracked -e 'chave' -- 'public'",
  "git ls-files -- '.env.local'",
  'git ls-tree -r --name-only main',
  "git check-ignore -v -- 'AGENTS.md'",
  'npm ls --depth=0',
  'npm audit --audit-level=high',
  'npm audit --omit=dev',
  'openspec --version',
  "curl -q -sS -I --max-time 20 --proto =https 'https://www.liacup.com.br/'",
  "MSYS_NO_PATHCONV=1 git grep -n -I -e '/inicio' main -- 'README.md'",
  // As quatro formas com o segredo de proteção da Vercel
  `{ printf 'x-vercel-protection-bypass: '; ${LE_O_SEGREDO}; printf '\\n'; } | curl -q -sS -I --max-time 20 --proto =https -H @- 'https://${HOST}/processo-seletivo'`,
  `${LE_O_SEGREDO} | git grep -c -a -F -f - 7bcdec0`,
  `${LE_O_SEGREDO} | git grep -c -a -F --untracked -f -`,
  `${LE_O_SEGREDO} | git grep -c -a -F --cached -f -`,
  `git grep -c --untracked -e '${NOME_DO_SEGREDO}' -- . ':!docs' ':!openspec' ':!README.md' ':!.env.example'`,
  // O que não é Git, e cita `.git` sem ser comando
  'cat .git/info/exclude',
  'cat .gitignore',
  'npm test',
  'openspec validate --all --strict',
  'ls src',
  'npx vitest run tests/barreiras/git-de-escrita.test.mjs',
  'node scripts/conferir-ambiente-local.mjs --change endurecer-agentes-e-git-local',
  // O que cita .claude sem ser a configuração do Claude Code
  'cat README.md',
  'ls .claude/agents',
  "cat 'docs/PADROES-DE-CODIGO.md'",
]

// As operações da camada 2 (D1): as mesmas das regras de negação do .claude/settings.json.
const OPERACOES_DA_CAMADA_2 = [
  'add',
  'commit',
  'push',
  'rm',
  'mv',
  'restore',
  'reset',
  'checkout',
  'switch',
  'stash',
  'merge',
  'rebase',
  'cherry-pick',
  'tag',
  'branch -d',
  'branch -D',
  'clean',
  'fetch',
  'pull',
  'clone',
  'init',
  'config',
  'apply',
  'am',
  'revert',
  'update-index',
  'update-ref',
]

const RECUSADOS = [
  ...OPERACOES_DA_CAMADA_2.map((op) => `git ${op} x`),
  'gh pr create',
  'gh api -X POST x',
  // Formas e disfarces
  'git branch nova',
  'git branch -m a b',
  'git -C . add -n x',
  'git --no-pager add x',
  'git -c core.pager=x status',
  'git --exec-path=x status',
  'git --config-env=core.pager=X status',
  'bash -c "git add -n README.md"',
  "sh -c 'git rm x'",
  'powershell -Command "git add ."',
  'cmd /c git add .',
  'echo ok && git commit -m x',
  'ls; git push',
  'echo $(git stash)',
  'echo `git reset`',
  'xargs git add',
  'find . -exec git add {} ;',
  `node -e "require('child_process').execSync('git add .')"`,
  '/usr/bin/git add x',
  'git.exe add x',
  'GIT.EXE add x',
  '"C:\\Program Files\\Git\\cmd\\git.exe" add x',
  'git"" add x',
  "g'i't add x",
  '{git,add} x',
  'GIT_PAGER=x git log',
  // Falha fechada
  'git st',
  'git',
  'git status "',
  'git log --output=x',
  'git log --outp=x',
  'git grep -O vi x',
  'git grep -nO x',
  'git grep --open-files-in-pager=vi x',
  'git ls-remote --upload-pack=x origin',
  'git ls-remote -u x origin',
  // Citação (Q8 (a)): a função não distingue citação de invocação
  'grep -n "git push" docs/x.md',
  // Passagem C, achado 1 do revisor: o separador do shell e o nome com hífen
  'git${IFS}add -n README.md',
  'git$IFS add -n README.md',
  '/mingw64/libexec/git-core/git-add x',
  'git-add x',
  'git-lfs push',
  'git-receive-pack',
  'GIT-ADD.EXE x',
  // Aspas ou escape que só o shell de dentro tira
  `bash -c "gi''t add ."`,
  `bash -c 'g"i"t add .'`,
  'g`it add .',
  'cmd /c g^it add .',
  'g\\it add .',
  `node -e "require('child_process').execSync('git-add .')"`,
]

// Decisão do Gabriel de 21/11/2026, item 2: o comando que cita a configuração do Claude Code.
const CITAM_A_CONFIGURACAO = [
  "echo '{}' > .claude/settings.local.json",
  'cat .claude\\settings.json',
  'sha256sum .claude/ganchos/barrar-git-de-escrita.mjs',
  "echo '{}' | node .claude/ganchos/barrar-git-de-escrita.mjs; echo $?",
  'ls .claude/ganchos',
  "cat .cla''ude/settings.json",
  'cat .CLAUDE/Settings.json',
  'Get-Content .claude\\\\ganchos\\\\x.mjs',
  'cd .claude && echo x > settings.local.json',
]

const MENSAGEM_DA_CONFIGURACAO =
  'Recusado pela barreira: o comando cita a configuração do Claude Code ' +
  '(.claude/settings ou .claude/ganchos). Mudar esses arquivos é passo do Gabriel.'

const conta = { permitidos: 0, recusados: 0, configuracao: 0 }

describe('a barreira deixa passar a leitura', () => {
  it.each(PERMITIDOS)('%s', (comando) => {
    const decisao = decidir(comando)
    expect(decisao, decisao.motivo).toEqual({ permitido: true })
    conta.permitidos++
  })
})

describe('a barreira recusa a escrita e o que não entende', () => {
  it.each(RECUSADOS)('%s', (comando) => {
    expect(decidir(comando).permitido).toBe(false)
    conta.recusados++
  })
})

describe('a barreira recusa o comando que cita a configuração do Claude Code', () => {
  it.each(CITAM_A_CONFIGURACAO)('%s', (comando) => {
    const decisao = decidir(comando)
    expect(decisao.permitido).toBe(false)
    expect(mensagemDeRecusa(decisao)).toBe(`${MENSAGEM_DA_CONFIGURACAO}\n`)
    conta.configuracao++
  })

  it('a pasta atual dentro de .claude também é citação', () => {
    expect(decidir('cat settings.json', { cwd: 'C:\\Projetos\\x\\.claude' }).permitido).toBe(false)
    expect(decidir('cat settings.json', { cwd: '/c/Projetos/x/.Claude/ganchos' }).permitido).toBe(
      false
    )
    expect(decidir('cat settings.json', { cwd: 'C:\\Projetos\\x' })).toEqual({ permitido: true })
  })
})

describe('o gancho, rodado como o Claude Code o roda', () => {
  const rodar = (entrada) => spawnSync(process.execPath, [GANCHO], { input: entrada })

  it('entrada sem comando sai com 2 (falha fechada)', () => {
    expect(rodar('{}').status).toBe(2)
  })

  it('entrada que não é JSON sai com 2', () => {
    expect(rodar('isto não é json').status).toBe(2)
  })

  it('leitura sai com 0 e sem saída', () => {
    const r = rodar(JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'git status' } }))
    expect(r.status).toBe(0)
    expect(r.stdout.toString()).toBe('')
    expect(r.stderr.toString()).toBe('')
  })

  it('escrita sai com 2 e a mensagem do D2 no erro padrão', () => {
    const r = rodar(
      JSON.stringify({ tool_name: 'PowerShell', tool_input: { command: 'git add -n README.md' } })
    )
    expect(r.status).toBe(2)
    expect(r.stderr.toString()).toContain(
      'Recusado pela barreira do Git: "git add -n README.md" não está na lista de leitura.'
    )
  })

  it('o comando que cita a configuração sai com 2 e a mensagem própria', () => {
    const comando = "echo '{}' > .claude/settings.local.json"
    const r = rodar(JSON.stringify({ tool_name: 'Bash', tool_input: { command: comando } }))
    expect(r.status).toBe(2)
    expect(r.stderr.toString()).toBe(`${MENSAGEM_DA_CONFIGURACAO}\n`)
  })

  /*
   * Achado 2 do revisor: o gancho decidia rodar pela comparação do argv[1] com o
   * caminho do módulo, e saía com 0 (permitia) quando os dois diferiam. Aqui o
   * gancho é carregado por import, sem argv[1], e precisa decidir do mesmo jeito.
   */
  it('carregado com outro argv[1], o gancho decide do mesmo jeito', () => {
    const r = spawnSync(
      process.execPath,
      ['--input-type=module', '-e', `await import(${JSON.stringify(pathToFileURL(GANCHO).href)})`],
      { input: '{}' }
    )
    expect(r.status).toBe(2)
  })
})

// Roda por último no arquivo: a ordem dos testes de um arquivo é a de declaração.
it('a tabela diz quantos comandos conferiu', () => {
  const recusados = conta.recusados + conta.configuracao
  const total = conta.permitidos + recusados
  console.log(
    `
  comandos conferidos: ${total} · permitidos: ${conta.permitidos} · recusados: ${recusados} (citam a configuração do Claude Code: ${conta.configuracao})
`
  )
  expect(conta.permitidos, 'algum caso de permissão não chegou ao fim').toBe(PERMITIDOS.length)
  expect(conta.recusados, 'algum caso de recusa não chegou ao fim').toBe(RECUSADOS.length)
  expect(conta.configuracao, 'algum caso da configuração não chegou ao fim').toBe(
    CITAM_A_CONFIGURACAO.length
  )
})
