/*
 * Unico lugar da feature que fala com a fonte de dados.
 * Nenhum componente chama o banco direto — essa e a regra da secao 4 dos padroes.
 *
 * Na F00 nao existe banco: o Supabase entra na F02. Aqui os dados sao de memoria,
 * so para dar forma ao arquivo. Quando a F02 chegar, o que muda e o corpo destas
 * funcoes; a assinatura e quem as chama continuam iguais.
 */
import type { Exemplo } from './tipos'

const EXEMPLOS_EM_MEMORIA: readonly Exemplo[] = [
  { id: '1', titulo: 'Primeiro exemplo', publicado: true, criadoEm: '2026-08-20' },
  { id: '2', titulo: 'Segundo exemplo', publicado: true, criadoEm: '2026-08-19' },
  { id: '3', titulo: 'Rascunho não publicado', publicado: false, criadoEm: '2026-08-18' },
]

export async function listarExemplos(): Promise<Exemplo[]> {
  return [...EXEMPLOS_EM_MEMORIA]
}
