/*
 * A FUNÇÃO DE DECISÃO DA BARREIRA (change endurecer-agentes-e-git-local, D1 e D2).
 *
 * Só funções, sem efeito ao ser importado: quem lê a entrada do Claude Code e sai
 * com 0 ou 2 é o .claude/ganchos/barrar-git-de-escrita.mjs, e o teste de tabela
 * (tests/barreiras/git-de-escrita.test.mjs) importa daqui.
 *
 * O QUE ELA RECUSA:
 * - todo `git` que não esteja na lista fechada de leitura, e todo `gh`;
 * - o Git com outro nome (`git-add`, `git-lfs`, `git-receive-pack`);
 * - todo comando que cite a configuração do Claude Code (.claude/settings ou
 *   .claude/ganchos), por decisão do Gabriel de 21/11/2026, item 2;
 * - o que ela não consegue analisar (falha fechada).
 *
 * ONDE ELA OLHA: no texto literal e em formas normalizadas dele, sem as aspas e os
 * escapes que só o shell de dentro tira (`gi''t`, `g"i"t`, `` g`it ``, `g^it`,
 * `g\it`) e com o `$IFS` trocado por espaço. Falso positivo é aceito (Q8).
 *
 * O QUE ELA NÃO PEGA (D1): um agente que escreve um programa e o roda, e o nome
 * montado em tempo de execução (`$(printf 'g%s' it)`). Esse resíduo é declarado, e
 * quem o cobre é a conferência do ambiente (scripts/conferir-ambiente-local.mjs) e
 * o `git status` depois de cada passagem.
 */

/*
 * A lista fechada de leitura (D2). Cada operação aqui tem uso hoje; operação que
 * também tem forma de escrita fica fora, mesmo tendo forma de leitura (stash list,
 * tag -l, remote -v, config --get, reflog, worktree list, notes).
 */
export const OPERACOES_DE_LEITURA = [
  'status',
  'diff',
  'log',
  'show',
  'ls-files',
  'ls-tree',
  'grep',
  'check-ignore',
  'rev-parse',
  'ls-remote',
  'rev-list',
  'merge-base',
  'cat-file',
  'blame',
  'branch',
  'version',
  '--version',
]

// `git branch` só lista: sem argumento, ou só com estas opções.
const OPCOES_DE_LISTAR_BRANCH = [
  '--list',
  '-a',
  '--all',
  '-r',
  '--remotes',
  '-v',
  '-vv',
  '--show-current',
]

// Opções globais que só mudam onde o Git lê. São puladas para achar a operação.
const GLOBAIS_SEM_VALOR = ['--no-pager', '-P', '--no-optional-locks', '--literal-pathspecs']
const GLOBAIS_COM_VALOR = ['-C', '--git-dir', '--work-tree']

/*
 * Opções globais recusadas: `-c core.pager=…` ou `-c core.fsmonitor=…` rodam programa
 * a partir de qualquer leitura. Desvio da sugestão do briefing, que era pular o `-c`.
 */
const GLOBAIS_RECUSADAS = ['-c', '--config-env', '--exec-path']

/*
 * Opções longas recusadas dentro da lista, porque escrevem arquivo ou rodam
 * programa. O Git aceita opção longa abreviada (`--outp=x` vale `--output=x`), então
 * a abreviação também é recusada.
 */
const LONGAS_RECUSADAS_EM_TODA_OPERACAO = ['--output']
const LONGAS_RECUSADAS_POR_OPERACAO = {
  grep: ['--open-files-in-pager'],
  'ls-remote': ['--upload-pack'],
}
// Opções curtas recusadas, também dentro de um grupo (`-nO`).
const CURTAS_RECUSADAS_POR_OPERACAO = { grep: 'O', 'ls-remote': 'u' }

/*
 * ONDE PROCURAR (D2): o nome do comando é `git`, `gh`, com ou sem extensão do
 * Windows, depois do começo do texto ou de um destes caracteres, e seguido de fim,
 * espaço, aspas, `)` ou `;`. Assim `.git/`, `.gitignore` e `portal-git` não contam.
 * Acrescentei, além do conjunto do D2, `<`, `>` e `,` antes, e `` ` ``, `|`, `&`,
 * `<`, `>`, `}`, `,` e `$` depois: só recusam mais (`{git,add}` é expansão do bash,
 * e `git${IFS}add` é `git add`).
 */
const ANTES = String.raw`(^|[\s;&|(){}\x60'"$=/\\<>,])`
const NOME = String.raw`(git|gh)(?:\.exe|\.cmd|\.bat|\.com)?`
const DEPOIS = String.raw`(?=$|[\s'"\x60);|&<>},$])`
const APARECIMENTO = new RegExp(ANTES + '(' + NOME + ')' + DEPOIS, 'gi')
// A palavra inteira é o comando, com ou sem caminho (`/usr/bin/git`, `C:\…\git.exe`).
const PALAVRA_COMANDO = new RegExp(String.raw`^(?:.*[/\\])?` + NOME + '$', 'i')

/*
 * O Git com outro nome: `git-<letra>` como nome de comando (`git-add`,
 * `/mingw64/libexec/git-core/git-add`, `git-lfs`, `git-receive-pack`). A palavra
 * precisa terminar no nome, para `tests/barreiras/git-de-escrita.test.mjs` não contar.
 */
const NOME_COM_HIFEN =
  /(?:^|[/\\=:{,])git-[a-z0-9][a-z0-9-]*(?:\.exe|\.cmd|\.bat|\.com)?(?=$|[,}])/i

/*
 * Variável de ambiente do Git posta na linha (`GIT_PAGER=x git log`,
 * `$env:GIT_EXTERNAL_DIFF=…`) tem o mesmo efeito do `-c`: roda programa a partir de
 * uma leitura. Recusada pelo mesmo motivo.
 */
const VARIAVEL_DO_GIT = /(?:^|[^A-Za-z0-9_])GIT_[A-Za-z0-9_]*\s*=/i

/*
 * A configuração do Claude Code (decisão do Gabriel de 21/11/2026, item 2): o
 * comando que cita `.claude` junto com `settings` ou `ganchos`, em qualquer ponto e
 * com qualquer separador (`/`, `\`, ou um `cd .claude` antes), é recusado.
 */
const CITA_A_PASTA = /\.claude/i
const CITA_O_ARQUIVO = /settings|ganchos/i
const PASTA_ATUAL_NA_CONFIGURACAO = /(?:^|[\\/])\.claude(?:[\\/]|$)/i

// Separadores de comando. `(` e `)` pegam `$(…)`; a crase pega `` `…` ``.
const SEPARADORES = new Set([';', '&', '|', '(', ')', '`', '<', '>', '\n'])
const ESPACOS = new Set([' ', '\t', '\r'])

// Profundidade máxima de texto dentro de texto (`bash -c "sh -c '…'"`), e o número
// máximo de análises de um comando: passou, é recusa.
const PROFUNDIDADE_MAXIMA = 12
const ANALISES_MAXIMAS = 2000

class Recusa extends Error {
  constructor(trecho, motivo) {
    super(motivo)
    this.trecho = trecho
    this.motivo = motivo
  }
}

/*
 * Divide o texto em palavras e separadores, como o bash faria, sem expandir nada.
 * Cada palavra traz dois valores: `valor`, com a barra invertida como escape (bash),
 * e `literal`, com a barra invertida mantida (PowerShell e cmd). Aspas sem par
 * lançam erro.
 */
export function lexar(texto) {
  const itens = []
  let valor = ''
  let literal = ''
  let emPalavra = false
  const fecharPalavra = () => {
    if (emPalavra) itens.push({ tipo: 'palavra', valor, literal })
    valor = ''
    literal = ''
    emPalavra = false
  }
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    if (ESPACOS.has(c)) {
      fecharPalavra()
    } else if (SEPARADORES.has(c)) {
      fecharPalavra()
      itens.push({ tipo: 'separador', valor: c })
    } else if (c === "'") {
      const fim = texto.indexOf("'", i + 1)
      if (fim === -1) throw new Recusa(texto, 'aspas simples sem par')
      valor += texto.slice(i + 1, fim)
      literal += texto.slice(i + 1, fim)
      emPalavra = true
      i = fim
    } else if (c === '"') {
      let j = i + 1
      let dentro = ''
      for (; j < texto.length && texto[j] !== '"'; j++) {
        if (texto[j] === '\\' && j + 1 < texto.length && '"\\$`\n'.includes(texto[j + 1])) {
          dentro += texto[j + 1]
          j++
        } else {
          dentro += texto[j]
        }
      }
      if (j >= texto.length) throw new Recusa(texto, 'aspas duplas sem par')
      valor += dentro
      literal += texto.slice(i + 1, j)
      emPalavra = true
      i = j
    } else if (c === '\\') {
      literal += c
      if (i + 1 < texto.length) {
        valor += texto[i + 1]
        literal += texto[i + 1]
        i++
      }
      emPalavra = true
    } else {
      valor += c
      literal += c
      emPalavra = true
    }
  }
  fecharPalavra()
  return itens
}

/*
 * As formas normalizadas do texto (achado 1 do revisor, passagem C): o `$` antes de
 * aspas (`$''`) sai, `$IFS` e `${IFS}` viram espaço, e saem as aspas, a crase, o `^`
 * e a barra invertida. A segunda forma também tira a expansão de variável e a
 * substituição de comando (`g${x}it`, `` g`true`it ``). Só devolve forma diferente
 * do texto.
 */
export function formasNormalizadas(texto) {
  const base = texto.replace(/\$(?=['"])/g, '').replace(/\$\{IFS\}|\$IFS(?![A-Za-z0-9_])/gi, ' ')
  const semAspas = (t) => t.replace(/['"`^\\]/g, '')
  const semExpansao = (t) =>
    t
      .replace(/\$\([^()]*\)/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/\$\{[^}]*\}/g, '')
      .replace(/\$(?:[A-Za-z_][A-Za-z0-9_]*|[0-9@*#?$!-])/g, '')
  const formas = new Set([semAspas(base), semAspas(semExpansao(base))])
  formas.delete(texto)
  return [...formas]
}

// O comando cita a configuração do Claude Code, no literal ou numa forma normalizada?
export function citaAConfiguracao(texto) {
  return [texto, ...formasNormalizadas(texto)].some(
    (t) => CITA_A_PASTA.test(t) && CITA_O_ARQUIVO.test(t)
  )
}

// O nome é a opção, ou uma abreviação dela que o Git aceitaria (`--outp` por `--output`).
function ehOuAbrevia(nome, opcao) {
  return nome === opcao || (opcao.startsWith('--') && nome.length > 3 && opcao.startsWith(nome))
}

// Confere uma chamada do `git` com os argumentos que vêm depois dela.
function conferirChamadaDoGit(args, trecho) {
  let i = 0
  while (i < args.length) {
    const a = args[i]
    const nome = a.split('=')[0]
    if (GLOBAIS_RECUSADAS.some((r) => ehOuAbrevia(nome, r))) {
      throw new Recusa(trecho, `a opção global ${nome} roda programa a partir de qualquer leitura`)
    }
    if (GLOBAIS_SEM_VALOR.includes(a)) {
      i += 1
    } else if (GLOBAIS_COM_VALOR.includes(a)) {
      if (i + 1 >= args.length) throw new Recusa(trecho, `a opção ${a} está sem valor`)
      i += 2
    } else if (GLOBAIS_COM_VALOR.some((g) => g.startsWith('--') && a.startsWith(g + '='))) {
      i += 1
    } else {
      break
    }
  }
  const operacao = args[i]
  if (operacao === undefined) throw new Recusa(trecho, 'git sem operação')
  if (!OPERACOES_DE_LEITURA.includes(operacao)) {
    throw new Recusa(trecho, `a operação "${operacao}" não está na lista de leitura`)
  }
  const resto = args.slice(i + 1)
  if (operacao === 'branch') {
    const estranho = resto.find((a) => !OPCOES_DE_LISTAR_BRANCH.includes(a))
    if (estranho !== undefined) {
      throw new Recusa(trecho, `git branch só lista; "${estranho}" não é opção de listar`)
    }
    return
  }
  const longas = [
    ...LONGAS_RECUSADAS_EM_TODA_OPERACAO,
    ...(LONGAS_RECUSADAS_POR_OPERACAO[operacao] ?? []),
  ]
  const curta = CURTAS_RECUSADAS_POR_OPERACAO[operacao]
  for (const a of resto) {
    if (a.startsWith('--') && a !== '--') {
      const nome = a.split('=')[0]
      if (longas.some((l) => ehOuAbrevia(nome, l))) {
        throw new Recusa(trecho, `a opção ${nome} escreve arquivo ou roda programa`)
      }
    } else if (curta && /^-[^-]/.test(a) && a.includes(curta)) {
      throw new Recusa(trecho, `a opção -${curta} escreve arquivo ou roda programa`)
    }
  }
}

// Há `git` ou `gh` como nome de comando em algum ponto do texto?
function temAparecimento(texto) {
  return texto.match(APARECIMENTO) !== null || NOME_COM_HIFEN.test(texto)
}

// Confere cada palavra de um comando simples. Lança Recusa no primeiro problema.
function conferirPalavras(palavras, texto, profundidade, contexto) {
  palavras.forEach((palavra, indice) => {
    for (const v of new Set([palavra.valor, palavra.literal])) {
      const trecho = [v, ...palavras.slice(indice + 1).map((p) => p.valor)].join(' ')
      if (NOME_COM_HIFEN.test(v)) {
        throw new Recusa(trecho, 'git-<nome> é o Git com outro nome')
      }
      const chamada = PALAVRA_COMANDO.exec(v)
      if (chamada) {
        if (chamada[1].toLowerCase() === 'gh') throw new Recusa(trecho, 'todo gh é recusado (Q3)')
        conferirChamadaDoGit(
          palavras.slice(indice + 1).map((p) => p.valor),
          trecho
        )
        conferirChamadaDoGit(
          palavras.slice(indice + 1).map((p) => p.literal),
          trecho
        )
        continue
      }
      // Texto dentro da palavra (`bash -c "git add"`, `node -e "…'git add .'…"`):
      // cada aparecimento é analisado como comando, do ponto em que aparece.
      for (const achado of v.matchAll(APARECIMENTO)) {
        // achado[1] é o caractere de antes (ou vazio, no começo); o nome vem logo depois.
        const subtexto = v.slice(achado.index + achado[1].length)
        if (subtexto === texto) {
          throw new Recusa(subtexto, 'aparecimento de git ou gh que a barreira não sabe analisar')
        }
        analisar(subtexto, profundidade + 1, contexto)
      }
    }
  })
}

// Analisa um texto de comando e as formas normalizadas dele. Lança Recusa no primeiro problema.
function analisar(texto, profundidade, contexto) {
  contexto.analises += 1
  if (profundidade > PROFUNDIDADE_MAXIMA || contexto.analises > ANALISES_MAXIMAS) {
    throw new Recusa(texto, 'texto dentro de texto além do que a barreira analisa')
  }
  if (VARIAVEL_DO_GIT.test(texto)) {
    throw new Recusa(texto, 'variável de ambiente do Git posta na linha roda programa como o -c')
  }
  let itens = null
  try {
    itens = lexar(texto)
  } catch (erro) {
    // Aspas sem par só importam se há `git` ou `gh` no texto: sem eles, não há o que barrar.
    if (temAparecimento(texto)) throw erro
  }
  if (itens !== null) {
    // Agrupa as palavras em comandos simples, entre separadores.
    const comandos = [[]]
    for (const item of itens) {
      if (item.tipo === 'separador') comandos.push([])
      else comandos[comandos.length - 1].push(item)
    }
    for (const palavras of comandos) conferirPalavras(palavras, texto, profundidade, contexto)
  }
  for (const forma of formasNormalizadas(texto)) analisar(forma, profundidade + 1, contexto)
}

/*
 * A função de decisão. Devolve { permitido: true } ou
 * { permitido: false, tipo, trecho, motivo }, com tipo 'configuracao' ou 'git'.
 * `opcoes.cwd` é a pasta em que o comando roda, da entrada do Claude Code. Nunca lança.
 */
export function decidir(comando, opcoes = {}) {
  if (typeof comando !== 'string') {
    return {
      permitido: false,
      tipo: 'git',
      trecho: '(sem comando)',
      motivo: 'campo tool_input.command ausente',
    }
  }
  try {
    const cwd = typeof opcoes?.cwd === 'string' ? opcoes.cwd : ''
    if (citaAConfiguracao(comando) || PASTA_ATUAL_NA_CONFIGURACAO.test(cwd)) {
      return { permitido: false, tipo: 'configuracao', trecho: comando, motivo: 'configuração' }
    }
    analisar(comando, 0, { analises: 0 })
    return { permitido: true }
  } catch (erro) {
    if (erro instanceof Recusa) {
      return { permitido: false, tipo: 'git', trecho: erro.trecho, motivo: erro.motivo }
    }
    return {
      permitido: false,
      tipo: 'git',
      trecho: comando,
      motivo: `erro na análise: ${erro?.message}`,
    }
  }
}

export const MENSAGEM_DA_CONFIGURACAO =
  'Recusado pela barreira: o comando cita a configuração do Claude Code ' +
  '(.claude/settings ou .claude/ganchos). Mudar esses arquivos é passo do Gabriel.\n'

export function mensagemDeRecusa({ tipo, trecho, motivo }) {
  if (tipo === 'configuracao') return MENSAGEM_DA_CONFIGURACAO
  return (
    `Recusado pela barreira do Git: "${trecho}" não está na lista de leitura. ` +
    'Quem escreve no Git é o Gabriel: prepare os arquivos e entregue o comando pronto ' +
    '(CLAUDE.md, "Regras de Git").\n' +
    `Motivo: ${motivo}.\n`
  )
}
