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
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const CONSULTA = readFileSync('supabase/verificacoes/rls-por-tabela.sql', 'utf8')

function consultarCatalogo() {
  try {
    return execFileSync('npx', ['supabase', 'db', 'execute', '--stdin'], {
      input: CONSULTA,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })
  } catch (erro) {
    console.error(
      '\nNao foi possivel consultar o catalogo do banco.\n\n' +
        'A ferramenta do Supabase precisa estar conectada ao projeto. Ver o README,\n' +
        'secao "O banco de dados". Nenhum valor de credencial e impresso aqui.\n'
    )
    console.error(
      String(erro.stderr ?? '')
        .split('\n')
        .slice(0, 3)
        .join('\n')
    )
    process.exit(1)
  }
}

const saida = consultarCatalogo()
const linhas = saida
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('tabela') && !l.startsWith('-') && !l.startsWith('('))

const tabelas = linhas.map((l) => {
  const [tabela, rls, politicas] = l.split('|').map((c) => c.trim())
  return { tabela, rlsAtivo: rls === 't' || rls === 'true', politicas: Number(politicas ?? 0) }
})

const semRls = tabelas.filter((t) => !t.rlsAtivo)

console.log(`\nControle de acesso por linha — ${tabelas.length} tabela(s) verificada(s)\n`)
for (const t of tabelas) {
  const marca = t.rlsAtivo ? 'ATIVO   ' : 'AUSENTE '
  console.log(`  ${marca} ${t.tabela.padEnd(24)} politicas: ${t.politicas}`)
}
console.log(`\n  verificadas: ${tabelas.length} · sem controle de acesso: ${semRls.length}`)

if (tabelas.length === 0) {
  console.error(
    '\nA consulta nao devolveu tabela nenhuma. Verde sem ter olhado nada nao conta (RP-12).'
  )
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
