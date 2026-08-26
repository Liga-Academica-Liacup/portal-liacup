/*
 * Cliente do Supabase para o SERVIDOR.
 *
 * ESTE E O UNICO ARQUIVO DO PROJETO AUTORIZADO A LER A CHAVE DE SERVICO.
 *
 * A chave de servico IGNORA todas as politicas de acesso. Se ela chegar ao
 * navegador, qualquer pessoa passa a ter acesso total ao banco — e nao ha como
 * despublicar o que ja foi baixado. E o unico item desta feature capaz de dano
 * irreversivel.
 *
 * Quatro barreiras protegem isso, tres automaticas:
 *   1. o nome da variavel nao tem o prefixo NEXT_PUBLIC_, entao o Next nao a expoe;
 *   2. o lint recusa a leitura da variavel em qualquer outro arquivo;
 *   3. um script varre o PACOTE COMPILADO atras do valor e do nome;
 *   4. o .env.example separa segredo de publico.
 *
 * A barreira 3 e a que fecha a porta: as duas primeiras verificam o codigo, ela
 * verifica o artefato. Um valor chega ao navegador sem nenhum arquivo de cliente
 * mencionar a variavel — basta um componente de servidor passa-lo como prop.
 *
 * QUANDO USAR `criarClienteDeServico`
 * So onde a operacao precisa ignorar as politicas: purga de dado pessoal, e
 * preparacao e limpeza dos testes de politica.
 *
 * QUANDO NAO USAR
 * Em leitura ou escrita comum. Para isso existe `criarClienteDeServidor`, que
 * respeita as politicas — e politica que nunca e exercida nao protege ninguem.
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from './tipos'

function exigir(nome: string, valor: string | undefined): string {
  if (!valor) {
    throw new Error(
      `Falta a variavel de ambiente ${nome}. Copie .env.example para .env.local e preencha. ` +
        'Ver README, secao "O banco de dados".'
    )
  }
  return valor
}

/** Cliente de servidor que RESPEITA as politicas de acesso. O padrao. */
export function criarClienteDeServidor() {
  const url = exigir('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
  const chavePublica = exigir(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return createClient<Database>(url, chavePublica, { auth: { persistSession: false } })
}

/**
 * SEGUNDOS ate o conteudo publico ser buscado de novo.
 *
 * Cinco minutos: para um site institucional, mostrar conteudo de alguns minutos
 * atras e indistinguivel de estar tudo em dia, e a diferenca entre isso e ler o
 * banco a cada acesso e o site continuar de pe quando o banco nao esta.
 */
export const SEGUNDOS_DE_REVALIDACAO = 300

/**
 * Cliente de leitura publica: ESTATICO COM REVALIDACAO, nunca dinamico a cada
 * acesso (T055, research.md D3).
 *
 * ISTO NAO RESOLVE A PAUSA DO PLANO GRATUITO — resolve que a pausa NAO DERRUBA O
 * SITE PUBLICO. Com o banco pausado, uma pagina dinamica da erro na tela; uma
 * pagina estatica com revalidacao serve a ultima versao boa e falha a
 * atualizacao em silencio. Quem visita nao percebe nada.
 *
 * O que CONTINUA QUEBRADO com o banco pausado, e esta escrito assim no README: o
 * formulario de contato nao grava a mensagem, e o painel nao abre. Os dois
 * exigem o banco vivo, e os dois sao da F25.
 *
 * A revalidacao viaja no `fetch` do proprio cliente, e nao numa constante de
 * rota, de proposito: assim ela vale para toda pagina que consumir esta camada,
 * inclusive as que a F03 ainda vai escrever, sem ninguem precisar lembrar de
 * repetir a configuracao em cada arquivo.
 */
export function criarClienteDeLeituraPublica(revalidarEm = SEGUNDOS_DE_REVALIDACAO) {
  const url = exigir('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
  const chavePublica = exigir(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return createClient<Database>(url, chavePublica, {
    auth: { persistSession: false },
    global: {
      fetch: (entrada, init) =>
        fetch(entrada, { ...init, next: { revalidate: revalidarEm } } as RequestInit),
    },
  })
}

/**
 * Cliente que IGNORA as politicas de acesso. Use apenas para purga e para
 * preparacao e limpeza de teste — nunca no caminho que esta sendo verificado,
 * senao o teste ignora as politicas dos dois lados e nao testa nada.
 */
export function criarClienteDeServico() {
  const url = exigir('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
  const chaveDeServico = exigir('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY)
  return createClient<Database>(url, chaveDeServico, { auth: { persistSession: false } })
}
