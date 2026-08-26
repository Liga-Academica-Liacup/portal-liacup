/*
 * Preparacao e limpeza — e SO isto — feitas com o cliente de servico.
 *
 * Ele ignora as politicas, que e exatamente o que a preparacao precisa: para
 * provar que o anonimo nao ve um rascunho, primeiro alguem tem de conseguir
 * criar o rascunho. O que ele nao pode e aparecer dentro de um `expect` sobre a
 * politica — la ele seria a resposta e a pergunta ao mesmo tempo.
 */
import { semTipos, type Cliente } from './clientes'
import { linhaMinima, MARCA, type ColecaoDeConteudo } from './colecoes'

export type Semeadura = { publicado: string; rascunho: string; arquivado: string }

/**
 * Cria em uma colecao os tres estados que a matriz distingue: publicado,
 * rascunho e arquivado. Sem os tres, "o anonimo so ve o publicado" nao tem como
 * ser verificado — so o que existe pode ser escondido.
 */
export async function semear(
  servico: Cliente,
  colecao: ColecaoDeConteudo,
  contexto: { albumId?: string } = {}
): Promise<Semeadura> {
  const base = linhaMinima(colecao, contexto)
  const { data, error } = await semTipos(servico)
    .from(colecao)
    .insert([
      { ...base, publicado: true, arquivado: false },
      { ...base, publicado: false, arquivado: false },
      { ...base, publicado: true, arquivado: true },
    ])
    .select('id')
  const [publicado, rascunho, arquivado] = (data ?? []) as { id: string }[]
  if (error || !publicado || !rascunho || !arquivado) {
    throw new Error(
      `Nao foi possivel semear ${colecao}: ${error?.message ?? 'insercao incompleta'}`
    )
  }
  return { publicado: publicado.id, rascunho: rascunho.id, arquivado: arquivado.id }
}

/** Cria um album para as fotos penderem de algum lugar. */
export async function semearAlbum(servico: Cliente): Promise<string> {
  const { data, error } = await servico
    .from('galeria_albuns')
    .insert({ titulo: MARCA, publicado: true, arquivado: false })
    .select('id')
    .single()
  if (error || !data) throw new Error(`Nao foi possivel criar o album de teste: ${error?.message}`)
  return data.id
}

/*
 * Limpeza. A ordem importa: a foto referencia o album com `on delete restrict`,
 * entao o album so sai depois das fotos. E o restrict e proposital — apagar
 * album arquiva, e nao leva a galeria junto por engano (FR-030).
 */
export async function limpar(servico: Cliente, colecoes: readonly string[]): Promise<void> {
  for (const colecao of ['galeria_fotos', ...colecoes.filter((c) => c !== 'galeria_fotos')]) {
    await semTipos(servico).from(colecao).delete().like(colunaMarcada(colecao), `${MARCA}%`)
  }
}

function colunaMarcada(colecao: string): string {
  if (colecao === 'faq') return 'pergunta'
  if (colecao === 'ligantes' || colecao === 'docentes') return 'nome'
  if (colecao === 'galeria_fotos') return 'legenda'
  if (colecao === 'mensagens') return 'texto'
  return 'titulo'
}
