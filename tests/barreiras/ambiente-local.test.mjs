/*
 * @vitest-environment node
 *
 * O teste da conferência do ambiente local (change endurecer-agentes-e-git-local, D4).
 *
 * Confere as funções de scripts/conferir-ambiente-local/funcoes.mjs com exemplos
 * escritos aqui: nenhum caso lê o .git/config desta máquina, e nenhum valor real
 * aparece. Roda no ambiente node, e não no jsdom da configuração: não há tela.
 *
 * O contador no fim diz quantos casos foram conferidos, porque um arquivo sem caso
 * também passaria (RP-12).
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  acharRegistro,
  aplicarRegistro,
  compararArvore,
  conferirConfigDoGit,
  desligaOsGanchos,
  ehVigiado,
  executaveisDoGitNaRaiz,
  ganchosAtivosDoGit,
  lerRegistro,
  montarResumo,
  paradasAntesDoGit,
  regrasAtivas,
  URL_DO_ORIGIN,
} from '../../scripts/conferir-ambiente-local/funcoes.mjs'

let casos = 0
const caso = (nome, corpo) =>
  it(nome, () => {
    corpo()
    casos++
  })

// Um .git/config como o de um clone novo, só com chaves da lista.
const CONFIG_LIMPO = [
  '[core]',
  '\trepositoryformatversion = 0',
  '\tfilemode = false',
  '\tbare = false',
  '\tlogallrefupdates = true',
  '\tsymlinks = false',
  '\tignorecase = true',
  '[remote "origin"]',
  `\turl = ${URL_DO_ORIGIN}`,
  '\tfetch = +refs/heads/*:refs/remotes/origin/*',
  '[branch "main"]',
  '\tremote = origin',
  '\tmerge = refs/heads/main',
  '\tvscode-merge-base = origin/main',
  '[lfs]',
  '\trepositoryformatversion = 0',
].join('\r\n')

const comLinhas = (...linhas) => `${CONFIG_LIMPO}\n${linhas.join('\n')}\n`

describe('o .git/config', () => {
  caso('só com chaves da lista: nada para', () => {
    expect(conferirConfigDoGit(CONFIG_LIMPO)).toEqual({ total: 12, foraDaLista: [], problemas: [] })
  })
  caso('core.fsmonitor para, mesmo se estivesse na lista do core', () => {
    const r = conferirConfigDoGit(comLinhas('[core]', '\tfsmonitor = true'), ['core.fsmonitor'])
    expect(r.problemas).toEqual(['chave que nunca entra na lista: core.fsmonitor'])
  })
  caso('as seis que nunca entram param, com qualquer caixa', () => {
    const r = conferirConfigDoGit(
      comLinhas(
        '[core]',
        'fsmonitor = x',
        'hooksPath = x',
        'sshCommand = x',
        'pager = x',
        'editor = x',
        'askPass = x'
      )
    )
    expect(r.problemas).toHaveLength(6)
  })
  caso('alias.x fica fora da lista, pelo nome e sem o valor', () => {
    const r = conferirConfigDoGit(comLinhas('[alias]', '\tx = !rm -rf .'))
    expect(r.foraDaLista).toEqual(['alias.x'])
    expect(JSON.stringify(r)).not.toContain('rm -rf')
  })
  caso('includeIf e include param', () => {
    const r = conferirConfigDoGit(
      comLinhas('[includeIf "gitdir:~/x/"]', '\tpath = ~/y', '[include]', '\tpath = z')
    )
    expect(r.problemas).toHaveLength(2)
  })
  caso('remote.origin.url diferente para, sem mostrar o valor', () => {
    const r = conferirConfigDoGit(
      comLinhas('[remote "origin"]', '\turl = https://exemplo.invalid/x.git')
    )
    expect(r.problemas).toEqual([
      expect.stringContaining('remote.<subseção>.url com valor diferente'),
    ])
    expect(JSON.stringify(r)).not.toContain('exemplo.invalid')
  })
  caso('remote.origin.url entre aspas e com comentário vale o mesmo', () => {
    const r = conferirConfigDoGit(comLinhas('[remote "origin"]', `\turl = "${URL_DO_ORIGIN}" # x`))
    expect(r.problemas).toEqual([])
  })
  caso('branch.<nome>.remote fora de origin para', () => {
    const r = conferirConfigDoGit(comLinhas('[branch "feat/x"]', '\tremote = outro'))
    expect(r.problemas).toHaveLength(1)
  })
  caso('outra chave de remote, como uploadpack, fica fora da lista', () => {
    const r = conferirConfigDoGit(comLinhas('[remote "origin"]', '\tuploadpack = x'))
    expect(r.foraDaLista).toEqual(['remote.<subseção>.uploadpack'])
  })
  caso('core.* que não existia hoje fica fora da lista', () => {
    const r = conferirConfigDoGit(comLinhas('[core]', '\tautocrlf = true'))
    expect(r.foraDaLista).toEqual(['core.autocrlf'])
  })
  caso('seção na forma antiga [core.x] e linha que não se entende param', () => {
    const r = conferirConfigDoGit(comLinhas('[core.x]', '\ty = 1', 'isto não é chave'))
    expect(r.foraDaLista).toEqual(['core.<subseção>.y'])
    expect(r.problemas).toEqual(['linha 19 que a conferência não entende'])
  })
  // Achado 4 do revisor: a subseção pode levar credencial, e nunca é impressa.
  caso('a subseção nunca sai na mensagem: [url "https://<token>@…"]', () => {
    const r = conferirConfigDoGit(
      comLinhas('[url "https://TOKEN-FICTICIO@github.com/"]', '\tinsteadOf = https://github.com/')
    )
    expect(r.foraDaLista).toEqual(['url.<subseção>.insteadof'])
    expect(JSON.stringify(r)).not.toContain('TOKEN-FICTICIO')
  })
  caso('a subseção de branch e de includeIf também não sai', () => {
    const r = conferirConfigDoGit(
      comLinhas('[branch "feat/SEGREDO"]', '\tremote = outro', '[includeIf "gitdir:~/SEGREDO/"]')
    )
    expect(r.problemas).toEqual([
      'branch.<subseção>.remote com valor diferente do esperado (linha 18)',
    ])
    expect(JSON.stringify(r)).not.toContain('SEGREDO')
  })
  caso('continuação com barra invertida é lida como uma chave só', () => {
    const r = conferirConfigDoGit(comLinhas('[alias]', '\tx = a \\', '\t\tb'))
    expect(r.total).toBe(13)
    expect(r.foraDaLista).toEqual(['alias.x'])
  })
})

describe('os ganchos do Git e as regras do .git/info', () => {
  caso('só .sample: nenhum ativo', () => {
    expect(ganchosAtivosDoGit(['pre-commit.sample', 'pre-push.sample'])).toEqual([])
  })
  caso('qualquer outro arquivo é gancho ativo', () => {
    expect(ganchosAtivosDoGit(['pre-commit', 'post-checkout.sample', 'x.sample.bak'])).toEqual([
      'pre-commit',
      'x.sample.bak',
    ])
  })
  caso('o exclude conta só linha que não é comentário nem vazia', () => {
    const exclude =
      '# git ls-files --others --exclude-from=.git/info/exclude\r\n\r\nAGENTS.md\r\n  \n'
    expect(regrasAtivas(exclude)).toEqual(['AGENTS.md'])
  })
})

describe('os ganchos do Claude Code', () => {
  caso('disableAllHooks ligado desliga', () => {
    expect(desligaOsGanchos('{"disableAllHooks": true}')).toBe(true)
  })
  caso('sem a chave, ligados', () => {
    expect(desligaOsGanchos('{"permissions": {}}')).toBe(false)
  })
  caso('JSON que não se lê lança, e a conferência para', () => {
    expect(() => desligaOsGanchos('{ isto não')).toThrow()
  })
})

/*
 * Achados 3 e 5 do revisor: tudo o que o passo 1 acusa para antes de rodar o Git,
 * inclusive o .git/info/attributes (um filtro roda programa no git hash-object), o
 * disableAllHooks e um executável do Git na raiz, que o Windows acharia primeiro.
 */
describe('o que para antes de rodar o Git', () => {
  const LIMPO = {
    textoConfig: CONFIG_LIMPO,
    nomesDosGanchos: ['pre-commit.sample'],
    textoAttributes: '# comentário\n',
    configsDoClaude: [['.claude/settings.json', '{"permissions": {}}']],
    nomesNaRaiz: ['README.md', '.git', 'gitignore', '.gitignore'],
  }
  caso('ambiente limpo: nada para', () => {
    const r = paradasAntesDoGit(LIMPO)
    expect(r.paradas).toEqual([])
    expect(r.medidas).toMatchObject({ chaves: 12, foraDaLista: 0, ganchosDoGit: 0 })
  })
  caso('linha ativa no attributes para, sem mostrar a regra', () => {
    const r = paradasAntesDoGit({ ...LIMPO, textoAttributes: '# x\n* filter=FILTRO-X\n' })
    expect(r.paradas).toEqual(['.git/info/attributes · regra ativa na linha 2'])
  })
  caso('disableAllHooks ligado para, e o resumo diz desligados', () => {
    const r = paradasAntesDoGit({
      ...LIMPO,
      configsDoClaude: [['.claude/settings.local.json', '{"disableAllHooks": true}']],
    })
    expect(r.paradas).toEqual([
      'Claude Code · disableAllHooks ligado em .claude/settings.local.json',
    ])
    expect(r.medidas.claudeDesligado).toBe(true)
  })
  caso('configuração do Claude Code que não se lê para', () => {
    const r = paradasAntesDoGit({ ...LIMPO, configsDoClaude: [['x.json', '{ não']] })
    expect(r.paradas).toEqual(['Claude Code · x.json não é JSON que a conferência consiga ler'])
  })
  caso('git, git.exe, git.cmd, git.bat ou git.com na raiz param', () => {
    const nomesNaRaiz = ['git', 'GIT.EXE', 'git.cmd', 'git.bat', 'git.com', 'git.sh', 'gitx']
    expect(executaveisDoGitNaRaiz(nomesNaRaiz)).toEqual(nomesNaRaiz.slice(0, 5))
    expect(paradasAntesDoGit({ ...LIMPO, nomesNaRaiz }).paradas).toHaveLength(5)
  })
  caso('gancho do Git e chave fora da lista também param', () => {
    const r = paradasAntesDoGit({
      ...LIMPO,
      textoConfig: comLinhas('[alias]', '\tx = y'),
      nomesDosGanchos: ['pre-commit'],
    })
    expect(r.paradas).toEqual([
      '.git/config · chave fora da lista: alias.x',
      '.git/hooks · gancho ativo: pre-commit',
    ])
  })
})

// Achado 6 do revisor: depois do archive, o registro mora em openspec/changes/archive/.
describe('onde está o registro da change', () => {
  const ARCHIVE = ['2026-11-18-outra', '2026-11-21-x']
  caso('a change em curso tem o registro: usa o dela', () => {
    expect(acharRegistro('x', { ativoExiste: true, pastasDoArchive: ARCHIVE })).toBe(
      'openspec/changes/x/ambiente-decidido.txt'
    )
  })
  caso('a change foi arquivada: usa a única pasta que termina em -<nome>', () => {
    expect(acharRegistro('x', { ativoExiste: false, pastasDoArchive: ARCHIVE })).toBe(
      'openspec/changes/archive/2026-11-21-x/ambiente-decidido.txt'
    )
  })
  caso('nenhuma pasta: registro ausente', () => {
    expect(acharRegistro('y', { ativoExiste: false, pastasDoArchive: ARCHIVE })).toBeNull()
  })
  // Achado 6 do revisor, rodada 2: só a pasta AAAA-MM-DD-<nome> exata casa.
  caso('o nome é só o fim do nome de outra change: não casa', () => {
    const outra = ['2026-11-21-endurecer-agentes-e-git-local', 'rascunho-git-local']
    expect(acharRegistro('git-local', { ativoExiste: false, pastasDoArchive: outra })).toBeNull()
  })
  caso('duas pastas casando: para', () => {
    const duas = [...ARCHIVE, '2026-11-22-x']
    expect(() => acharRegistro('x', { ativoExiste: false, pastasDoArchive: duas })).toThrow(
      'duas pastas'
    )
  })
})

describe('os caminhos vigiados', () => {
  const vigiados = [
    '.claude/settings.json',
    '.claude/ganchos/barrar-git-de-escrita.mjs',
    '.claude/DEMO-RP12.txt',
    'CLAUDE.md',
    'src/CLAUDE.md',
    'CLAUDE.local.md',
    'AGENTS.md',
    'docs/agents.md',
    'GEMINI.md',
    '.mcp.json',
    'openspec/config.yaml',
    '.cursorrules',
    '.cursor/rules/x.mdc',
    '.windsurfrules',
    '.clinerules',
    '.clinerules/x.md',
    '.github/copilot-instructions.md',
    '.github/instructions/x.instructions.md',
  ]
  const fora = [
    'README.md',
    'node_modules/x/AGENTS.md',
    '.next/CLAUDE.md',
    '.git/info/exclude',
    'openspec/changes/x/config.yaml',
    '.github/workflows/ci.yml',
    'scripts/conferir-ambiente-local.mjs',
  ]
  caso(`vigia ${vigiados.length} caminhos de agente`, () => {
    expect(vigiados.filter((c) => !ehVigiado(c))).toEqual([])
  })
  caso(`não vigia ${fora.length} caminhos que não são de agente`, () => {
    expect(fora.filter((c) => ehVigiado(c))).toEqual([])
  })
})

describe('a árvore da main contra o disco', () => {
  const main = new Map([
    ['CLAUDE.md', 'a1'],
    ['.claude/agents/revisor.md', 'b1'],
    ['.claude/skills/x/SKILL.md', 'c1'],
  ])
  caso('igual: nenhuma diferença', () => {
    expect(compararArvore(main, new Map(main))).toEqual({
      comparados: 3,
      iguais: 3,
      diferencas: [],
    })
  })
  caso('diferente, só no disco e só na main contam como diferença', () => {
    const disco = new Map([
      ['CLAUDE.md', 'a2'],
      ['.claude/agents/revisor.md', 'b1'],
      ['.claude/settings.json', 'd1'],
    ])
    const r = compararArvore(main, disco)
    expect(r.comparados).toBe(4)
    expect(r.iguais).toBe(1)
    expect(r.diferencas.map((d) => `${d.situacao}: ${d.caminho}`)).toEqual([
      'só no disco: .claude/settings.json',
      'só na main: .claude/skills/x/SKILL.md',
      'diferente da main: CLAUDE.md',
    ])
  })
})

describe('o registro de diferenças decididas', () => {
  const SHA = 'a'.repeat(64)
  const REGISTRO = [
    '# registro da change',
    `arquivo .claude/settings.json ${SHA}  # proposta aprovada, item 1 e Q1`,
    'exclude AGENTS.md  # Gabriel, Q17 da pagina-processo-seletivo, 21/11/2026',
    'arquivo .claude/velho.md ausente  # decisão x',
  ].join('\r\n')
  const diferencas = [
    { tipo: 'arquivo', caminho: '.claude/settings.json', situacao: 'só no disco' },
    { tipo: 'exclude', regra: 'AGENTS.md' },
    { tipo: 'arquivo', caminho: '.claude/velho.md', situacao: 'só na main' },
  ]
  caso('lê as três formas de linha', () => {
    const r = lerRegistro(REGISTRO)
    expect(r.problemas).toEqual([])
    expect(r.entradas).toHaveLength(3)
  })
  caso('linha sem decisão citada, ou fora do formato, é problema', () => {
    const r = lerRegistro(`arquivo x ${SHA}\nexclude y #\nqualquer coisa  # z`)
    expect(r.problemas).toHaveLength(3)
  })
  caso('aceita a diferença com o sha256 registrado e a regra igual', () => {
    const { entradas } = lerRegistro(REGISTRO)
    const r = aplicarRegistro(diferencas, entradas, () => SHA)
    expect(r.aceitas).toHaveLength(3)
    expect(r.naoAceitas).toEqual([])
  })
  caso('não aceita o arquivo que mudou depois do registro', () => {
    const { entradas } = lerRegistro(REGISTRO)
    const r = aplicarRegistro(diferencas, entradas, () => 'b'.repeat(64))
    expect(r.naoAceitas.map((d) => d.caminho)).toEqual(['.claude/settings.json'])
  })
  caso('sem registro, nada é aceito; linha sem diferença sobra como aviso', () => {
    expect(aplicarRegistro(diferencas, [], () => SHA).naoAceitas).toHaveLength(3)
    const { entradas } = lerRegistro(REGISTRO)
    expect(aplicarRegistro([], entradas, () => SHA).semUso).toHaveLength(3)
  })
  caso('o attributes para antes do Git, e o registro não o aceita', () => {
    expect(lerRegistro('attributes * filter=x  # decisão').problemas).toHaveLength(1)
  })
  caso('arquivo novo, como .claude/DEMO-RP12.txt, não é aceito pelo registro', () => {
    const { entradas } = lerRegistro(REGISTRO)
    const demo = { tipo: 'arquivo', caminho: '.claude/DEMO-RP12.txt', situacao: 'só no disco' }
    expect(aplicarRegistro([demo], entradas, () => SHA).naoAceitas).toEqual([demo])
  })
})

describe('o resumo', () => {
  caso('tem a forma do D4', () => {
    expect(
      montarResumo({
        comparados: 3,
        iguais: 1,
        diferentes: 2,
        aceitos: 1,
        regras: 1,
        ganchosDoGit: 0,
        chaves: 17,
        foraDaLista: 0,
        claudeDesligado: false,
      })
    ).toBe(
      'arquivos comparados: 3 · iguais à main: 1 · diferentes: 2 (aceitos por decisão: 1) · ' +
        'regras de exclusão: 1 · ganchos do Git ativos: 0 · chaves do .git/config: 17 ' +
        '(fora da lista: 0) · ganchos do Claude Code: ligados'
    )
  })
})

/*
 * Achado 2 do revisor: a conferência rodava só quando o argv[1] era o caminho do
 * módulo, e saía com 0 sem conferir nada quando os dois diferiam. Aqui ela é
 * carregada por import, com um argumento inválido: precisa parar com 1 antes de
 * ler o repositório.
 */
describe('o ponto de entrada', () => {
  caso('carregada com outro argv[1], a conferência roda e sai com 1', () => {
    const script = fileURLToPath(
      new URL('../../scripts/conferir-ambiente-local.mjs', import.meta.url)
    )
    const r = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `await import(${JSON.stringify(pathToFileURL(script).href)})`,
        'x',
        '--argumento-invalido',
      ],
      { encoding: 'utf8' }
    )
    expect(r.status).toBe(1)
    expect(r.stdout).toContain('PARA · erro na conferência: uso:')
  })
})

// Roda por último no arquivo: a ordem dos testes de um arquivo é a de declaração.
it('a conferência diz quantos casos conferiu', () => {
  console.log(`\n  casos da conferência do ambiente: ${casos}\n`)
  expect(casos).toBeGreaterThan(0)
})
