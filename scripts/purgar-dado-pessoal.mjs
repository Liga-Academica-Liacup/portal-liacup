#!/usr/bin/env node
/*
 * T040 — purga de dado pessoal (FR-020, FR-025, FR-026).
 *
 * DOIS PRAZOS, UM PROCEDIMENTO SO, e isso e deliberado:
 *
 *   mensagens ............ 24 MESES a partir de quando chegaram
 *   controle de origem ... 24 HORAS a partir do momento registrado
 *
 * Dois mecanismos de purga sao, na pratica, um que ninguem executa: o segundo
 * vira "aquele outro script" e ninguem lembra dele. Aqui os dois prazos correm
 * no mesmo comando, e o relatorio traz os dois numeros.
 *
 * ISTO E O PROCEDIMENTO MANUAL, E ELE E UM ADIAMENTO REGISTRADO. O ADR-0001 R6
 * promete purga AUTOMATICA; a F25 e a dona nominal dessa automacao, junto do
 * agendador que ja vai existir la. Enquanto isso, este script existe, e foi
 * EXECUTADO ao menos uma vez com dados envelhecidos de proposito — procedimento
 * escrito e nunca executado e procedimento que nao funciona.
 *
 * USA A CHAVE DE SERVICO, e precisa mesmo: a remocao definitiva e recusada para
 * todo mundo, inclusive a diretoria, por ausencia de politica E de concessao
 * (migracoes 0009, 0010 e 0012). A purga e a unica coisa que remove.
 *
 * NENHUM VALOR DE CHAVE NEM DADO PESSOAL SAI DAQUI. O relatorio traz contagens.
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const TESTE = process.argv.includes('--teste')
const SIMULAR = process.argv.includes('--simular')

const MESES_DE_MENSAGEM = 24
const HORAS_DE_ORIGEM = 24

function doAmbienteOuDoArquivo(nome) {
  if (process.env[nome]) return process.env[nome]
  try {
    const linha = readFileSync('.env', 'utf8')
      .split('\n')
      .find((l) => l.startsWith(`${nome}=`))
    return (
      linha
        ?.slice(nome.length + 1)
        .trim()
        .replace(/^"|"$/g, '') || null
    )
  } catch {
    return null
  }
}

function exigir(nome) {
  const valor = doAmbienteOuDoArquivo(nome)
  if (!valor) {
    console.error(`\nFalta a variavel ${nome}. Ver README, secao "Apagar dado pessoal".\n`)
    process.exit(1)
  }
  return valor
}

const url = exigir(TESTE ? 'SUPABASE_TESTE_URL' : 'NEXT_PUBLIC_SUPABASE_URL')
const chave = exigir(TESTE ? 'SUPABASE_TESTE_SERVICE_ROLE_KEY' : 'SUPABASE_SERVICE_ROLE_KEY')
const banco = createClient(url, chave, { auth: { persistSession: false } })

const agora = new Date()
const limiteDeMensagem = new Date(agora)
limiteDeMensagem.setMonth(limiteDeMensagem.getMonth() - MESES_DE_MENSAGEM)
const limiteDeOrigem = new Date(agora.getTime() - HORAS_DE_ORIGEM * 60 * 60 * 1000)

async function contar(tabela, coluna, limite) {
  const { count, error } = await banco
    .from(tabela)
    .select('id', { count: 'exact', head: true })
    .lt(coluna, limite.toISOString())
  if (error) throw new Error(`nao foi possivel contar ${tabela}: ${error.message}`)
  return count ?? 0
}

async function apagar(tabela, coluna, limite) {
  const { data, error } = await banco
    .from(tabela)
    .delete()
    .lt(coluna, limite.toISOString())
    .select('id')
  if (error) throw new Error(`nao foi possivel apagar de ${tabela}: ${error.message}`)
  return (data ?? []).length
}

const alvos = [
  {
    tabela: 'mensagens',
    coluna: 'recebida_em',
    limite: limiteDeMensagem,
    prazo: `${MESES_DE_MENSAGEM} meses`,
  },
  {
    tabela: 'controle_de_origem',
    coluna: 'momento',
    limite: limiteDeOrigem,
    prazo: `${HORAS_DE_ORIGEM} horas`,
  },
]

console.log(`\nPurga de dado pessoal — ${TESTE ? 'PROJETO DE TESTE' : 'PRODUCAO'}`)
console.log(
  `Executada em ${agora.toISOString()}${SIMULAR ? '  (SIMULACAO: nada e apagado)' : ''}\n`
)

let total = 0
try {
  for (const alvo of alvos) {
    const quantos = SIMULAR
      ? await contar(alvo.tabela, alvo.coluna, alvo.limite)
      : await apagar(alvo.tabela, alvo.coluna, alvo.limite)
    total += quantos
    console.log(
      `  ${alvo.tabela.padEnd(20)} prazo: ${alvo.prazo.padEnd(10)}` +
        ` ${SIMULAR ? 'a apagar' : 'apagados'}: ${quantos}`
    )
  }
} catch (erro) {
  console.error('\n=== NAO EXECUTADA ===\n')
  console.error(`  registros apagados: 0\n`)
  console.error(`  ${erro.message}\n`)
  console.error('  A purga NAO rodou. Isto nao e "nada havia para apagar": e nao ter')
  console.error('  conseguido olhar. Os dois se parecem no relatorio se ninguem disser qual foi.\n')
  process.exit(1)
}

console.log(`\n  total ${SIMULAR ? 'a apagar' : 'apagado'}: ${total} registro(s)`)
console.log(
  total === 0
    ? '\n  Zero e um resultado legitimo: nada tinha passado do prazo. A conferencia\n' +
        '  de que a purga funciona esta nos testes, com dados envelhecidos de proposito.\n'
    : `\n  ${total} registro(s) removidos definitivamente. Nao ha como desfazer.\n`
)
