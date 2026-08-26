/*
 * As onze colecoes de conteudo e o minimo necessario para criar uma linha em
 * cada uma. Uma lista so, para que "as onze" seja um fato do arquivo e nao algo
 * a conferir contando `describe` com o olho.
 */
export const COLECOES_DE_CONTEUDO = [
  'noticias',
  'eventos',
  'conteudos_educativos',
  'projetos',
  'materiais',
  'leituras',
  'faq',
  'ligantes',
  'docentes',
  'galeria_albuns',
  'galeria_fotos',
] as const

export type ColecaoDeConteudo = (typeof COLECOES_DE_CONTEUDO)[number]

/*
 * Todo dado de teste leva esta marca no texto, para que qualquer linha esquecida
 * por uma execucao interrompida seja obvia — e removivel — depois.
 */
export const MARCA = '[TESTE-DE-POLITICA]'

/** Campos obrigatorios de cada colecao. `contexto.albumId` so serve a galeria. */
export function linhaMinima(
  colecao: ColecaoDeConteudo,
  contexto: { albumId?: string } = {}
): Record<string, unknown> {
  switch (colecao) {
    case 'eventos':
      return { titulo: MARCA, data_evento: '2026-01-01' }
    case 'projetos':
      return { titulo: MARCA, eixo: 'ensino' }
    case 'faq':
      return { pergunta: MARCA, resposta: MARCA }
    case 'ligantes':
    case 'docentes':
      return { nome: MARCA }
    case 'galeria_fotos':
      return { album_id: contexto.albumId, legenda: MARCA }
    default:
      return { titulo: MARCA }
  }
}

/** A coluna de texto que cada colecao usa, para as tentativas de alteracao. */
export function colunaDeTexto(colecao: ColecaoDeConteudo): string {
  if (colecao === 'faq') return 'pergunta'
  if (colecao === 'ligantes' || colecao === 'docentes') return 'nome'
  if (colecao === 'galeria_fotos') return 'legenda'
  return 'titulo'
}
