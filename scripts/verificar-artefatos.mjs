#!/usr/bin/env node
/*
 * RP-13 — artefato gerado nao entra no controle de versao.
 *
 * POR QUE UM SCRIPT, E NAO SO UMA LINHA NO .gitignore:
 *
 * As duas coisas nao fazem o mesmo trabalho, e essa e a confusao que produziu o
 * bug que originou este verificador. O `.gitignore` diz ao git o que NAO
 * ACRESCENTAR. Ele nao tem efeito nenhum sobre arquivo que JA ESTA rastreado —
 * esse continua sendo versionado, commit apos commit, com o `.gitignore`
 * parecendo cobri-lo.
 *
 * Foi o que aconteceu aqui, duas vezes:
 *
 *   `tsconfig.tsbuildinfo` — entrou no repositorio antes de a linha existir.
 *   A linha `*.tsbuildinfo` foi acrescentada depois e nao mudou nada: o arquivo
 *   seguiu rastreado, aparecendo modificado a cada build.
 *
 *   `supabase/.temp/cli-latest` — mesma historia, com a pasta de estado local da
 *   ferramenta do Supabase.
 *
 * Ler o `.gitignore` e concluir "esta coberto" e a leitura errada, e ela e a
 * leitura natural. Por isso a pergunta certa nao e "o que o .gitignore lista",
 * e sim "o que o git esta rastreando AGORA" — que e o que este script pergunta.
 *
 * O QUE ELE MEDE: percorre TODOS os arquivos rastreados e acusa os que sao
 * artefato gerado. Imprime quantos varreu, porque varrer zero e nao achar nada
 * produzem a mesma saida verde (RP-12).
 */
import { execFileSync } from 'node:child_process'

/*
 * Artefato gerado: sai de um comando, nao das maos de ninguem. Reconstruivel a
 * partir do que esta versionado, diferente em cada maquina, e conflita em todo
 * merge — as tres coisas ao mesmo tempo.
 */
const GERADOS = [
  { padrao: /^node_modules\//, motivo: 'dependencias: reconstruido por `npm ci`' },
  { padrao: /^\.next\//, motivo: 'build do Next' },
  { padrao: /^(out|build)\//, motivo: 'saida de build' },
  { padrao: /^coverage\//, motivo: 'relatorio de cobertura' },
  { padrao: /^(playwright-report|test-results|blob-report)\//, motivo: 'relatorio de teste' },
  { padrao: /^\.lighthouseci\//, motivo: 'relatorio de desempenho' },
  { padrao: /\.tsbuildinfo$/, motivo: 'cache incremental do TypeScript' },
  { padrao: /^supabase\/\.temp\//, motivo: 'estado local da ferramenta do Supabase' },
  { padrao: /\.log$/, motivo: 'registro de execucao' },
  { padrao: /^next-env\.d\.ts$/, motivo: 'declaracao de tipos gerada pelo Next' },
  { padrao: /^src\/lib\/supabase\/tipos\.ts$/, motivo: 'tipos gerados do esquema do banco' },
]

/*
 * VERSIONADO POR DECISAO — a lista e nominal, e cada linha precisa de um motivo
 * que alguem consiga CONFERIR, nao de uma justificativa que soe bem.
 *
 * Sem esta lista, a regra teria de aceitar qualquer arquivo gerado e pararia de
 * valer. Com ela larga demais, vira deposito.
 *
 * O MOTIVO NOMEIA UM COMANDO, e o comando e EXECUTADO quando a excecao entra.
 * Esta regra nasceu de um erro que este proprio arquivo cometeu: a primeira
 * versao trazia DUAS excecoes, e a do `next-env.d.ts` dizia que tira-lo
 * quebraria a verificacao de tipos num clone novo. Ninguem mediu. Quando alguem
 * mediu — escondendo o `.next` E o `next-env.d.ts` e rodando `tsc --noEmit` —
 * o resultado foi codigo 0. O motivo era falso, e a excecao caiu.
 *
 * A licao e a distincao que atravessa este projeto: "tem motivo escrito" e
 * configuracao, "o motivo confere" e resultado. Uma lista pode exigir a
 * primeira e passar verde com a segunda errada. Por isso o motivo precisa
 * nomear o comando que demonstra o que quebra, e nao descrever uma
 * consequencia plausivel — que e o que sobra quando ninguem mediu (RP-13).
 *
 * Uma linha hoje, e ela satisfaz a regra por construcao.
 */
const VERSIONADO_POR_DECISAO = new Map([
  [
    'src/lib/supabase/tipos.ts',
    'e o contrato tipado que a F03 em diante consome, e precisa existir sem ' +
      'acesso ao banco. Nao fica a deriva, e o comando que demonstra e ' +
      '`npm run banco:tipos:check`: ele regera a partir do esquema e falha se ' +
      'o versionado divergir (F02 D5)',
  ],
])

function naoVerificou(motivo) {
  console.error('\n=== NAO VERIFICADO — artefatos no controle de versao ===\n')
  console.error('  arquivos rastreados examinados: 0\n')
  console.error(`  ${motivo}\n`)
  console.error('  Nenhum arquivo foi examinado, entao NADA foi provado. Um .gitignore')
  console.error('  bem escrito nao e prova: ele nao tem efeito sobre o que ja esta')
  console.error('  rastreado, e e exatamente ai que este verificador olha.\n')
  process.exit(1)
}

let rastreados
try {
  rastreados = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
} catch (erro) {
  naoVerificou(`Nao foi possivel perguntar ao git o que esta rastreado: ${erro.message}`)
}

if (rastreados.length === 0) {
  naoVerificou('O git nao devolveu arquivo rastreado nenhum.')
}

const acusados = []
const excecoes = []

for (const caminho of rastreados) {
  const regra = GERADOS.find((g) => g.padrao.test(caminho))
  if (!regra) continue
  if (VERSIONADO_POR_DECISAO.has(caminho)) {
    excecoes.push(caminho)
  } else {
    acusados.push({ caminho, motivo: regra.motivo })
  }
}

console.log('\nArtefatos gerados no controle de versao\n')
console.log(`  arquivos rastreados examinados: ${rastreados.length}`)
console.log(`  padroes de artefato gerado: ${GERADOS.length}`)
console.log(`  versionados por decisao: ${excecoes.length}`)
for (const caminho of excecoes) console.log(`    ${caminho}`)
console.log(`\n  artefatos gerados rastreados indevidamente: ${acusados.length}`)

if (acusados.length > 0) {
  console.error('\n=== FALHA — artefatos gerados no controle de versao ===\n')
  for (const { caminho, motivo } of acusados) {
    console.error(`  ${caminho}`)
    console.error(`    ${motivo}`)
  }
  console.error('\n  ACRESCENTAR A LINHA NO .gitignore NAO RESOLVE: ela nao tem efeito')
  console.error('  sobre arquivo ja rastreado. E preciso tirar do rastreamento:\n')
  console.error(`    git rm --cached ${acusados.map((a) => a.caminho).join(' ')}\n`)
  console.error('  E, se o arquivo tiver de ficar versionado, registrar o motivo em')
  console.error('  VERSIONADO_POR_DECISAO neste arquivo — decisao deliberada se escreve.\n')
  process.exit(1)
}

console.log('\n=== VERIFICADO — artefatos no controle de versao ===\n')
console.log(`  ${rastreados.length} arquivo(s) rastreados examinados contra ${GERADOS.length}`)
console.log(`  padroes: nenhum artefato gerado versionado sem decisao registrada.\n`)
