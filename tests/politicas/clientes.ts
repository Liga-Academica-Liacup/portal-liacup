/*
 * T024 — os TRES clientes dos testes de politica, com papeis que nao se misturam.
 *
 * | Cliente        | Papel                                                     |
 * | -------------- | --------------------------------------------------------- |
 * | anonimo        | exerce as celulas da coluna "Anonimo" da matriz            |
 * | autenticado    | exerce as celulas da coluna "Diretoria"                    |
 * | de servico     | SO preparacao e limpeza. Nunca no que esta sendo verificado |
 *
 * A SEPARACAO DO CLIENTE DE SERVICO E O QUE IMPEDE O TESTE DE MENTIR. Ele ignora
 * todas as politicas. Se preparar E verificar, ignora as politicas dos dois
 * lados: a suite fica verde com o banco inteiro aberto, e ninguem descobre.
 *
 * TUDO AQUI APONTA PARA O PROJETO DE TESTE. Nenhuma funcao deste arquivo le a
 * NEXT_PUBLIC_SUPABASE_URL nem a SUPABASE_SERVICE_ROLE_KEY, que sao as de
 * producao — um teste que apaga dado precisa ser incapaz de encontrar producao,
 * nao apenas evita-la por convencao.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { randomBytes } from 'node:crypto'
import type { Database } from '@/lib/supabase/tipos'
import { exigir } from './ambiente'

export type Cliente = SupabaseClient<Database>

const semSessao = { auth: { persistSession: false, autoRefreshToken: false } }

/** Quem visita o site sem ter entrado em lugar nenhum. */
export function clienteAnonimo(): Cliente {
  return createClient<Database>(
    exigir('SUPABASE_TESTE_URL'),
    exigir('SUPABASE_TESTE_ANON_KEY'),
    semSessao
  )
}

/**
 * IGNORA as politicas. So preparacao e limpeza — se aparecer dentro de um
 * `expect`, o teste deixou de testar politica.
 */
export function clienteDeServico(): Cliente {
  return createClient<Database>(
    exigir('SUPABASE_TESTE_URL'),
    exigir('SUPABASE_TESTE_SERVICE_ROLE_KEY'),
    semSessao
  )
}

/*
 * A senha e sorteada a cada execucao e vive so na memoria deste processo: nao
 * esta no .env, nao esta no repositorio e nao aparece em log. Uma credencial de
 * teste versionada e uma credencial real com um rotulo tranquilizador.
 */
const EMAIL_DE_TESTE = 'diretoria.teste@example.com'

/** Alguem da diretoria, autenticado. Cria a conta se ainda nao existir. */
export async function clienteAutenticado(): Promise<Cliente> {
  const servico = clienteDeServico()
  const senha = `t${randomBytes(18).toString('base64url')}`

  const { data: criado, error: erroCriacao } = await servico.auth.admin.createUser({
    email: EMAIL_DE_TESTE,
    password: senha,
    email_confirm: true,
  })

  if (erroCriacao) {
    /* Ja existia de uma execucao anterior: troca a senha por esta, sorteada agora. */
    const { data: lista } = await servico.auth.admin.listUsers()
    const existente = lista?.users.find((u) => u.email === EMAIL_DE_TESTE)
    if (!existente)
      throw new Error(`Nao foi possivel preparar o usuario de teste: ${erroCriacao.message}`)
    const { error } = await servico.auth.admin.updateUserById(existente.id, { password: senha })
    if (error) throw new Error(`Nao foi possivel preparar o usuario de teste: ${error.message}`)
  }

  const anonimo = clienteAnonimo()
  const { error } = await anonimo.auth.signInWithPassword({
    email: EMAIL_DE_TESTE,
    password: senha,
  })
  if (error) throw new Error(`Nao foi possivel autenticar o usuario de teste: ${error.message}`)

  void criado
  return anonimo
}

/**
 * O MESMO cliente, visto sem os tipos do esquema.
 *
 * Os ajudantes da matriz recebem o nome da tabela como VALOR — e o que permite
 * escrever as celulas uma vez e roda-las nas onze colecoes, em vez de onze
 * copias que envelhecem em ritmos diferentes. Os tipos gerados descrevem cada
 * tabela separadamente, entao um nome que so existe em tempo de execucao nao tem
 * como ser conferido por eles.
 *
 * ISTO NAO AFROUXA O CAMINHO DE PRODUCAO. `features/<dominio>/dados.ts` continua
 * inteiramente tipado, e a T020 mostra o `verificar:tipos` recusando uma coluna
 * inexistente la. O que se abre aqui e o codigo dos testes, onde o nome da
 * tabela e, por desenho, um dado.
 */
export function semTipos(cliente: Cliente): SupabaseClient {
  return cliente as unknown as SupabaseClient
}
