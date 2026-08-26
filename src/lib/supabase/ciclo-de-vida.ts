/*
 * T050, T052 e T053 — arquivar, restaurar e edicao concorrente (FR-028 a FR-032).
 *
 * Mora em `lib/supabase/` porque as regras aqui valem para TODAS as colecoes de
 * conteudo, e nao para um dominio. Quem chama e `features/<dominio>/dados.ts`,
 * que continua sendo o unico lugar que fala com o banco.
 *
 * A COLUNA `alterado_em` FAZ DOIS TRABALHOS, e e por isso que a edicao
 * concorrente nao precisou de coluna nova: ela e a data da ultima alteracao e e
 * a MARCA DE VERSAO. Toda escrita informa qual versao abriu; se nao bater com a
 * do banco, alguem salvou no meio do caminho.
 */
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Resultado de uma escrita que pode encontrar conflito.
 *
 * O conflito devolve `conteudoTentado` porque a alternativa e pior do que
 * parece: avisar sem devolver troca perda silenciosa por perda barulhenta — a
 * pessoa ve o aviso E perde o que escreveu. A redacao da mensagem na tela e da
 * F17; o que sustenta essa mensagem e daqui (FR-032).
 */
export type ResultadoDeEscrita<T> =
  | { ok: true; alteradoEm: string }
  | { ok: false; motivo: 'conflito'; conteudoTentado: T }
  | { ok: false; motivo: 'erro'; mensagem: string }

type Cliente = SupabaseClient

/**
 * Altera um registro informando a versao que a pessoa abriu.
 *
 * Recusa quando a versao nao bate, e o mecanismo e a propria condicao da
 * consulta: `alterado_em = versaoQueAbriu`. Se outra pessoa salvou antes, a
 * condicao nao encontra linha e nada e escrito — a verificacao e a escrita
 * acontecem no mesmo comando, e por isso nao ha janela entre "conferi" e
 * "gravei", que e onde a checagem em duas etapas falha.
 */
export async function alterarComVersao<T extends Record<string, unknown>>(
  cliente: Cliente,
  colecao: string,
  id: string,
  versaoQueAbriu: string,
  conteudo: T
): Promise<ResultadoDeEscrita<T>> {
  const { data, error } = await cliente
    .from(colecao)
    /* O construtor sem tipos de esquema recusa um objeto generico. A colecao
       chega como valor — e o que permite a funcao valer para as onze —, entao
       nao ha tabela conhecida contra a qual conferir estes campos. Quem confere
       o formato e features/<dominio>/dados.ts, que e tipado. */
    .update(conteudo as never)
    .eq('id', id)
    .eq('alterado_em', versaoQueAbriu)
    .select('alterado_em')

  if (error) return { ok: false, motivo: 'erro', mensagem: error.message }

  const linhas = (data ?? []) as { alterado_em: string }[]
  const primeira = linhas[0]
  if (!primeira) return { ok: false, motivo: 'conflito', conteudoTentado: conteudo }

  return { ok: true, alteradoEm: primeira.alterado_em }
}

/**
 * Arquiva. NAO remove — e a diferenca inteira do FR-028.
 *
 * Nao existe funcao de remover neste arquivo, e a ausencia e deliberada: no
 * banco a remocao definitiva ja e recusada por falta de politica E de concessao
 * (migracoes 0009, 0010 e 0012). Oferecer aqui uma funcao que o banco recusaria
 * so produziria um erro confuso mais tarde.
 */
export async function arquivar(
  cliente: Cliente,
  colecao: string,
  id: string,
  versaoQueAbriu: string
): Promise<ResultadoDeEscrita<{ arquivado: boolean }>> {
  return alterarComVersao(cliente, colecao, id, versaoQueAbriu, { arquivado: true })
}

/** Restaura o que foi arquivado. O mesmo caminho, de volta (FR-029). */
export async function restaurar(
  cliente: Cliente,
  colecao: string,
  id: string,
  versaoQueAbriu: string
): Promise<ResultadoDeEscrita<{ arquivado: boolean }>> {
  return alterarComVersao(cliente, colecao, id, versaoQueAbriu, { arquivado: false })
}
