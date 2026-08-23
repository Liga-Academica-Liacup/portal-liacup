#!/usr/bin/env node
/*
 * T015 — prova que nenhuma tabela existe sem controle de acesso por linha.
 *
 * Consulta o catalogo do Postgres e lista TABELA POR TABELA com a situacao. Nao
 * afirma "esta tudo protegido": mostra a lista e o contador.
 *
 * O contador existe pelo mesmo motivo que o verificador de tokens imprime
 * quantos arquivos varreu e que o teste de alvo de toque imprime quantos
 * elementos mediu: sem ele, "nenhuma tabela sem RLS" e "nao olhei tabela
 * nenhuma" produzem a mesma saida verde (RP-12).
 *
 * Sem dependencia nova: usa a ferramenta de linha de comando do Supabase, que ja
 * e a dependencia 22.
 *
 * NENHUM VALOR DE CREDENCIAL SAI DAQUI. A conexao e lida do .env e nunca
 * impressa; a saida de erro passa por um filtro que mascara qualquer coisa
 * parecida com uma string de conexao.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const CONSULTA = 'supabase/verificacoes/rls-por-tabela.sql'
const PRODUCAO = process.argv.includes('--producao')

const mascarar = (texto) =>
  String(texto ?? '')
    .replace(/postgres[^\s"]*/gi, '<CONEXAO-OCULTA>')
    .replace(/db\.[a-z0-9]+\.supabase\.co/gi, '<HOST-OCULTO>')

function conexao() {
  const alvo = PRODUCAO ? 'SUPABASE_DIRECT_CONNECT_URL' : 'SUPABASE_TESTE_DIRECT_CONNECT_URL'
  const linha = readFileSync('.env', 'utf8')
    .split('\n')
    .find((l) => l.startsWith(`${alvo}=`))
  if (!linha) {
    console.error(`\nFalta ${alvo} no .env. Ver README, secao "O banco de dados".`)
    process.exit(1)
  }
  return linha
    .slice(alvo.length + 1)
    .trim()
    .replace(/^"|"$/g, '')
}

function consultarCatalogo() {
  try {
    /* shell: true porque no Windows o `npx` e um .cmd, e execFileSync sem shell
       nao o encontra. */
    const bruto = execFileSync(
      'npx',
      ['supabase', 'db', 'query', '--db-url', `"${conexao()}"`, '--file', CONSULTA],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], shell: true }
    )
    const inicio = bruto.indexOf('{')
    if (inicio === -1) throw new Error('a consulta nao devolveu JSON')
    return JSON.parse(bruto.slice(inicio)).rows ?? []
  } catch (erro) {
    console.error('\nNao foi possivel consultar o catalogo do banco.\n')
    console.error(
      mascarar(erro.stderr ?? erro.message)
        .split('\n')
        .slice(0, 4)
        .join('\n')
    )
    process.exit(1)
  }
}

const tabelas = consultarCatalogo()
const semRls = tabelas.filter((t) => !t.rls_ativo)

console.log(
  `\nControle de acesso por linha — ${PRODUCAO ? 'PRODUCAO' : 'TESTE'} — ` +
    `${tabelas.length} tabela(s) verificada(s)\n`
)
for (const t of tabelas) {
  const marca = t.rls_ativo ? 'ATIVO  ' : 'AUSENTE'
  console.log(`  ${marca}  ${String(t.tabela).padEnd(24)} politicas: ${t.politicas}`)
}
console.log(`\n  verificadas: ${tabelas.length} · sem controle de acesso: ${semRls.length}`)

/* Verde sem ter olhado nada nao conta (RP-12). */
if (tabelas.length === 0) {
  console.error('\nA consulta nao devolveu tabela nenhuma. O contador em zero invalida o verde.')
  process.exit(1)
}
if (semRls.length > 0) {
  console.error(
    `\nTabela sem controle de acesso e bug, nao pendencia: ${semRls.map((t) => t.tabela).join(', ')}`
  )
  console.error('Ative na propria migracao que cria a tabela (RP-11).')
  process.exit(1)
}
console.log('\nNenhuma tabela sem controle de acesso.\n')
