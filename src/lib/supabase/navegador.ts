/*
 * Cliente do Supabase para o NAVEGADOR.
 *
 * Usa apenas a chave publica. Ela vai para o navegador de proposito, e so e
 * segura porque TODA tabela tem controle de acesso por linha ativo (RP-11):
 * tabela sem controle mais esta chave e tabela aberta para qualquer pessoa ler
 * e escrever.
 *
 * QUANDO USAR
 * Componente de cliente que precisa ler dado publico.
 *
 * QUANDO NAO USAR
 * Escrita. Toda escrita passa por Server Action ou rota de servidor, nunca do
 * navegador direto para o banco (Principio IV).
 *
 * ESTE ARQUIVO NAO PODE LER A CHAVE DE SERVICO. A barreira 2 do lint recusa, e
 * a barreira 3 varre o pacote compilado atras dela.
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from './tipos'

export function criarClienteDeNavegador() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const chavePublica = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !chavePublica) {
    throw new Error(
      'Faltam NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Copie .env.example para .env.local e preencha. Ver README, secao "O banco de dados".'
    )
  }

  return createClient<Database>(url, chavePublica)
}
