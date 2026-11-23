#!/usr/bin/env node
/*
 * A BUSCA DE SEGREDO ANTES DO ENVIO (change ajustar-ci-ao-novo-fluxo, D5; Q3 (b)).
 *
 * Uso: node scripts/buscar-segredo-antes-do-envio.mjs
 *
 * É o segundo comando da lista Git, logo depois da conferência do ambiente, e roda
 * com o `node` direto, nunca por `npm run`: o npm leria o `.npmrc` e rodaria scripts
 * antes dela.
 *
 * O QUE EXAMINA: cada commit de `origin/main..HEAD`, com a mensagem, o autor e quem
 * fez o commit (o objeto do commit inteiro, lido por `cat-file commit`), e com cada
 * arquivo que o commit mudou, no conteúdo daquele commit; e, como roda antes do
 * `git add`, cada arquivo
 * rastreado alterado e cada não rastreado que não está ignorado, lido do disco. O
 * apagado é pulado. Um arquivo com versão já preparada no índice (`MM`, `AM`, `M `)
 * tem também essa versão examinada, lida por `cat-file blob :<caminho>`, porque é ela
 * que entra no próximo commit; se for igual à do disco, conta uma vez só. O caminho de
 * cada arquivo examinado também passa pelos formatos, e cada conteúdo é lido byte a
 * byte e, se parece UTF-16, também decodificado assim (change
 * completar-ci-do-novo-fluxo, D6, Q6 (a)). Os formatos, as duas leituras e a saída
 * estão em ./buscar-segredo-antes-do-envio/funcoes.mjs, que o teste usa.
 *
 * O GIT, SÓ LEITURA, com operações da lista da barreira: `rev-parse --verify`,
 * `rev-list --parents`, `show --name-only` (no merge, `diff --name-only` contra o
 * primeiro pai), `cat-file commit` (a mensagem), `cat-file blob` (do commit e do
 * índice) e `status --porcelain`.
 * Todas com `--no-optional-locks`, para o `status` não regravar o índice, e com um
 * ambiente mínimo montado por nome, como na conferência do ambiente.
 *
 * CÓDIGOS: 0 sem achado, 1 com achado, 2 não verificado. `origin/main` velho só
 * aumenta o intervalo: a busca examina a mais, nunca a menos.
 *
 * SEMPRE BUSCA: não há teste de "fui chamado direto?" (achado 2 do revisor na
 * conferência do ambiente).
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/*
 * O erro sai só com a operação, sem a saída do Git: o `cat-file` com erro poderia
 * trazer trecho de conteúdo, e a busca nunca imprime conteúdo.
 */
function rodarGit(argumentos, codificacao = 'utf8') {
  try {
    return execFileSync('git', ['--no-optional-locks', ...argumentos], {
      cwd: RAIZ,
      encoding: codificacao,
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { PATH: process.env.PATH, SYSTEMROOT: process.env.SYSTEMROOT, GIT_CONFIG_NOSYSTEM: '1' },
    })
  } catch {
    throw new Error(`git ${argumentos[0]} terminou com erro`)
  }
}

function lerDoDisco(caminho) {
  const completo = join(RAIZ, ...caminho.split('/'))
  try {
    return statSync(completo).isFile() ? readFileSync(completo) : null
  } catch {
    return null
  }
}

function montarLeitor(funcoes) {
  return {
    origem: () => rodarGit(['rev-parse', '--verify', '--quiet', 'refs/remotes/origin/main']),
    commits: () =>
      funcoes.lerRevList(rodarGit(['rev-list', '--parents', 'refs/remotes/origin/main..HEAD'])),
    arquivosDoCommit: ({ sha, pais }) =>
      funcoes.lerListaZ(
        pais.length > 1
          ? rodarGit(['diff', '--name-only', '-z', '--diff-filter=d', `${sha}^1`, sha])
          : rodarGit([
              'show',
              '--no-show-signature',
              '--name-only',
              '--format=',
              '-z',
              '--diff-filter=d',
              sha,
            ])
      ),
    /*
     * O objeto do commit como está guardado: o cabeçalho, com as linhas `author` e
     * `committer` (nome e e-mail), uma linha vazia e a mensagem inteira. A linha de
     * um achado é a linha da saída de `git cat-file commit <sha>`.
     */
    mensagemDoCommit: (sha) => rodarGit(['cat-file', 'commit', sha], 'buffer'),
    conteudoNoCommit: (sha, caminho) =>
      rodarGit(['cat-file', 'blob', `${sha}:${caminho}`], 'buffer'),
    arquivosDaArvore: () =>
      funcoes.lerStatus(rodarGit(['status', '--porcelain', '-z', '--untracked-files=all'])),
    conteudoNoDisco: lerDoDisco,
    // `:<caminho>` é a versão do índice (estágio 0), com o caminho a partir da raiz.
    conteudoNoIndice: (caminho) => rodarGit(['cat-file', 'blob', `:${caminho}`], 'buffer'),
  }
}

async function principal() {
  const funcoes = await import('./buscar-segredo-antes-do-envio/funcoes.mjs')
  return funcoes.executar({
    leitor: montarLeitor(funcoes),
    nomesNaRaiz: readdirSync(RAIZ),
    imprimir: (linha) => console.log(linha),
  })
}

try {
  process.exitCode = await principal()
} catch (erro) {
  console.log(`=== NAO VERIFICADO — busca de segredo ===\n  erro na busca: ${erro?.message}`)
  process.exitCode = 2
}
