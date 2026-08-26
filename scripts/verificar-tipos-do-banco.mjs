#!/usr/bin/env node
/*
 * T017 — impede que os tipos versionados divirjam do banco em silencio.
 *
 * Regera os tipos a partir do esquema e compara com `src/lib/supabase/tipos.ts`.
 * Se diferirem, falha dizendo o que mudou. Sem este passo, "os tipos estao
 * atualizados" e promessa: o arquivo continua compilando depois que alguem
 * altera o banco, so que descrevendo um esquema que nao existe mais (FR-005).
 *
 * TRES SAIDAS, como o verificador de RLS, e pelo mesmo motivo (RP-12):
 *   1. NAO VERIFICADO — nao deu para regerar. Sai com erro, "comparadas: 0".
 *   2. DIVERGENTE — regerou e o versionado esta diferente. Sai com erro.
 *   3. VERIFICADO — regerou e bate, com o numero de linhas comparadas.
 *
 * O identificador do projeto NAO e segredo: vem da NEXT_PUBLIC_SUPABASE_URL,
 * que ja vai para o navegador. No CI ele chega pela variavel de ambiente; na
 * maquina de quem desenvolve, pelo .env. Nenhum segredo e lido por este script
 * — a autenticacao e o `supabase login` de quem roda, ou a SUPABASE_ACCESS_TOKEN
 * do CI, que a ferramenta le sozinha.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const VERSIONADO = 'src/lib/supabase/tipos.ts'
const VARIAVEL = 'NEXT_PUBLIC_SUPABASE_URL'

const mascarar = (texto) =>
  String(texto ?? '')
    .replace(/postgres(ql)?:\/\/[^\s"']*/gi, '<CONEXAO-OCULTA>')
    .replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]+/g, '<TOKEN-OCULTO>')
    .replace(/sbp_[A-Za-z0-9]+/g, '<TOKEN-OCULTO>')

function naoVerificou(motivo, detalhe) {
  console.error('\n=== NAO VERIFICADO — tipos do banco ===\n')
  console.error('  linhas comparadas: 0\n')
  console.error(`  ${motivo}\n`)
  if (detalhe) {
    const causa = mascarar(detalhe)
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !/^npm (warn|notice|error|http)\b/i.test(l))
    if (causa.length > 0) {
      console.error('  Motivo relatado pela ferramenta:')
      for (const linha of causa.slice(0, 4)) console.error(`    ${linha}`)
      console.error('')
    }
  }
  console.error('  Nada foi comparado, entao NADA foi provado sobre os tipos.')
  console.error('  Falta autenticacao: `npx supabase login` na maquina, ou o segredo')
  console.error('  SUPABASE_ACCESS_TOKEN no repositorio, para o CI.\n')
  process.exit(1)
}

/* Ambiente primeiro (e assim que o CI passa o valor), .env depois. */
function referencia() {
  let url = process.env[VARIAVEL]
  if (!url) {
    try {
      const linha = readFileSync('.env', 'utf8')
        .split('\n')
        .find((l) => l.startsWith(`${VARIAVEL}=`))
      url = linha
        ?.slice(VARIAVEL.length + 1)
        .trim()
        .replace(/^"|"$/g, '')
    } catch {
      /* Sem .env: a mensagem abaixo ja cobre. */
    }
  }
  const ref = /^https:\/\/([a-z0-9]{20})\.supabase\.co\/?$/.exec(url ?? '')?.[1]
  if (!ref) {
    naoVerificou(
      `A ${VARIAVEL} nao chegou no formato https://<ref>.supabase.co, nem pelo ` +
        'ambiente nem pelo .env, entao nao da para saber de qual projeto regerar.'
    )
  }
  return ref
}

/* Fim de linha nao e diferenca de esquema: o Windows grava CRLF, o CI grava LF,
   e sem esta normalizacao o passo falharia em uma das duas maquinas sempre. */
const normalizar = (texto) => texto.replace(/\r\n/g, '\n').trimEnd()

const ref = referencia()

let geradoAgora
try {
  geradoAgora = execFileSync(
    'npx',
    ['supabase', 'gen', 'types', 'typescript', '--project-id', ref],
    {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      maxBuffer: 32 * 1024 * 1024,
    }
  )
} catch (erro) {
  naoVerificou(
    `Nao foi possivel regerar os tipos do projeto ${ref}.`,
    erro.stderr || erro.stdout || erro.message
  )
}

let versionado
try {
  versionado = readFileSync(VERSIONADO, 'utf8')
} catch {
  naoVerificou(`O arquivo ${VERSIONADO} nao existe. Rode \`npm run banco:tipos\`.`)
}

const A = normalizar(geradoAgora)
const B = normalizar(versionado)

/* Saida vazia da ferramenta compararia "nada com nada" e daria verde (RP-12). */
if (A.length === 0) {
  naoVerificou(`A ferramenta devolveu tipos vazios para o projeto ${ref}.`)
}

const linhasA = A.split('\n')
const linhasB = B.split('\n')

console.log(`\nTipos do banco — projeto ${ref}\n`)
console.log(`  regerado agora: ${linhasA.length} linha(s)`)
console.log(`  versionado:     ${linhasB.length} linha(s)`)
console.log(`\n  linhas comparadas: ${Math.max(linhasA.length, linhasB.length)}`)

if (A !== B) {
  const total = Math.max(linhasA.length, linhasB.length)
  const diferentes = []
  for (let i = 0; i < total; i += 1) {
    if (linhasA[i] !== linhasB[i]) diferentes.push(i + 1)
  }
  console.error('\n=== DIVERGENTE — tipos do banco ===\n')
  console.error(`  ${diferentes.length} linha(s) diferem entre o banco e o versionado.`)
  console.error(`  Primeiras: ${diferentes.slice(0, 5).join(', ')}\n`)
  for (const n of diferentes.slice(0, 3)) {
    console.error(`  linha ${n}`)
    console.error(`    banco:      ${(linhasA[n - 1] ?? '<ausente>').trim().slice(0, 90)}`)
    console.error(`    versionado: ${(linhasB[n - 1] ?? '<ausente>').trim().slice(0, 90)}`)
  }
  console.error('\n  O esquema mudou e o arquivo nao acompanhou, ou alguem editou o')
  console.error('  arquivo a mao — que o D5 proibe. Rode `npm run banco:tipos` e')
  console.error('  versione o resultado.\n')
  process.exit(1)
}

console.log('\n=== VERIFICADO — tipos do banco ===\n')
console.log(`  ${linhasB.length} linha(s) conferidas, identicas ao esquema do projeto ${ref}.\n`)
