#!/usr/bin/env node
/*
 * T015 — prova que nenhuma tabela existe sem controle de acesso por linha.
 *
 * Consulta o catalogo do Postgres e lista TABELA POR TABELA com a situacao. Nao
 * afirma "esta tudo protegido": mostra a lista e o contador.
 *
 * O contador existe pelo mesmo motivo que o verificador de tokens imprime
 * quantos arquivos varreu: sem ele, "nenhuma tabela sem RLS" e "nao olhei
 * tabela nenhuma" produzem a mesma saida verde (RP-12).
 *
 * Por isso este script tem TRES saidas, e as tres sao diferentes entre si:
 *
 *   1. NAO VERIFICADO — nao conectou ou nao leu o catalogo. Sai com erro,
 *      dizendo "verificadas: 0". Saber que o banco esta fechado nao e a mesma
 *      coisa que achar que esta aberto e protegido.
 *   2. FALHA — leu o catalogo e achou tabela sem controle de acesso. Sai com
 *      erro, nomeando a tabela.
 *   3. VERIFICADO — leu o catalogo, todas ativas. Unico caso que sai com zero.
 *
 * COMO SE CONECTA, E POR QUE NAO HA SENHA AQUI: pela API de gerenciamento do
 * Supabase, autenticada pelo `npx supabase login` de quem roda. A invocacao e
 * `supabase db query --linked --project-ref <ref> --file <arquivo>`. O `--ref`
 * sozinho e recusado pela ferramenta: ela exige o `--linked` junto.
 *
 * O identificador do projeto NAO e segredo: ele ja esta dentro da
 * NEXT_PUBLIC_SUPABASE_URL, que vai para o navegador. E dali que este script o
 * deriva — nenhuma variavel secreta e lida.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const CONSULTA = 'supabase/verificacoes/rls-por-tabela.sql'
const PRODUCAO = process.argv.includes('--producao')
const AMBIENTE = PRODUCAO ? 'PRODUCAO' : 'TESTE'
const VARIAVEL = PRODUCAO ? 'NEXT_PUBLIC_SUPABASE_URL' : 'SUPABASE_TESTE_URL'

/* Nada com cara de credencial atravessa daqui para a tela, mesmo vindo de uma
   mensagem de erro que nao controlamos. */
const mascarar = (texto) =>
  String(texto ?? '')
    .replace(/postgres(ql)?:\/\/[^\s"']*/gi, '<CONEXAO-OCULTA>')
    .replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]+/g, '<TOKEN-OCULTO>')
    .replace(/sbp_[A-Za-z0-9]+/g, '<TOKEN-OCULTO>')

/* Encerra pela saida 1: nao verificou. O contador em zero e explicito, e a
   mensagem diz que isto nao e um verde. */
function naoVerificou(motivo, detalhe) {
  console.error(`\n=== NAO VERIFICADO — ${AMBIENTE} ===\n`)
  console.error(`  verificadas: 0 · sem controle de acesso: nao apurado\n`)
  console.error(`  ${motivo}\n`)
  if (detalhe) {
    /* Ruido do npm nunca e a causa, e empurra a causa real para fora das
       primeiras linhas — a mensagem ficaria dizendo o que nao interessa. */
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
  console.error('  Nenhuma tabela foi lida, entao NADA foi provado sobre o controle')
  console.error('  de acesso. Banco fechado e banco desprotegido nao se parecem aqui.')
  console.error('  Ver README, secao "O banco de dados": e preciso `npx supabase login`.\n')
  process.exit(1)
}

/* O identificador do projeto mora dentro da URL: https://<ref>.supabase.co */
function referencia() {
  let env
  try {
    env = readFileSync('.env', 'utf8')
  } catch {
    return naoVerificou('Nao existe arquivo .env nesta pasta.')
  }
  const linha = env.split('\n').find((l) => l.startsWith(`${VARIAVEL}=`))
  const url = linha
    ?.slice(VARIAVEL.length + 1)
    .trim()
    .replace(/^"|"$/g, '')
  const ref = /^https:\/\/([a-z0-9]{20})\.supabase\.co\/?$/.exec(url ?? '')?.[1]
  if (!ref) {
    return naoVerificou(
      `A ${VARIAVEL} do .env nao esta no formato https://<ref>.supabase.co, ` +
        'entao nao da para saber qual projeto verificar.'
    )
  }
  return ref
}

function consultarCatalogo(ref) {
  let bruto
  try {
    /* shell: true porque no Windows o `npx` e um .cmd, e execFileSync sem shell
       nao o encontra. */
    bruto = execFileSync(
      'npx',
      ['supabase', 'db', 'query', '--linked', '--project-ref', ref, '--file', CONSULTA],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], shell: true }
    )
  } catch (erro) {
    return naoVerificou(
      `Nao foi possivel consultar o catalogo do projeto ${ref}.`,
      erro.stderr || erro.stdout || erro.message
    )
  }
  const inicio = bruto.indexOf('{')
  if (inicio === -1) {
    return naoVerificou(`A consulta ao projeto ${ref} nao devolveu JSON.`, bruto)
  }
  let resposta
  try {
    resposta = JSON.parse(bruto.slice(inicio))
  } catch (erro) {
    return naoVerificou(`A resposta do projeto ${ref} nao pode ser lida.`, erro.message)
  }
  /* A ferramenta responde erro com codigo de saida zero. Sem esta linha, um
     erro viraria "0 tabelas" e o script diria verde por nao ter olhado nada. */
  if (resposta._tag === 'Error' || resposta.error) {
    return naoVerificou(
      `O banco do projeto ${ref} recusou a consulta.`,
      resposta.error?.message ?? JSON.stringify(resposta.error ?? resposta)
    )
  }
  if (!Array.isArray(resposta.rows)) {
    return naoVerificou(`A resposta do projeto ${ref} nao trouxe linhas do catalogo.`, bruto)
  }
  return resposta.rows
}

const ref = referencia()
const tabelas = consultarCatalogo(ref)

/* Catalogo lido e vazio tambem e verificadas: 0 — nao ha o que provar. */
if (tabelas.length === 0) {
  naoVerificou(
    `O catalogo do projeto ${ref} nao devolveu tabela nenhuma. ` +
      'Ou as migracoes nao foram aplicadas, ou a consulta olhou o esquema errado.'
  )
}

const semRls = tabelas.filter((t) => !t.rls_ativo)

console.log(`\nControle de acesso por linha — ${AMBIENTE} — projeto ${ref}\n`)
for (const t of tabelas) {
  const marca = t.rls_ativo ? 'ATIVO  ' : 'AUSENTE'
  console.log(`  ${marca}  ${String(t.tabela).padEnd(24)} politicas: ${t.politicas}`)
}
console.log(`\n  verificadas: ${tabelas.length} · sem controle de acesso: ${semRls.length}`)

if (semRls.length > 0) {
  console.error(`\n=== FALHA — ${AMBIENTE} ===\n`)
  console.error(
    `  Tabela sem controle de acesso e bug, nao pendencia: ${semRls.map((t) => t.tabela).join(', ')}`
  )
  console.error('  Ative na propria migracao que cria a tabela (RP-11).\n')
  process.exit(1)
}

console.log(
  `\n=== VERIFICADO — ${AMBIENTE} ===\n\n` +
    `  ${tabelas.length} tabela(s) lidas do catalogo, nenhuma sem controle de acesso.\n`
)
