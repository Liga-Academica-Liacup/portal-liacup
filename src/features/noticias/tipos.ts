/** Tipos do dominio. Uma feature nunca importa os tipos de outra. */

/**
 * O que uma noticia e para quem le o site. NAO e a linha do banco: a linha tem
 * `arquivado`, `autor_id` e `ordem`, que sao de quem edita, nao de quem visita.
 * O tipo do dominio e menor de proposito — o que nao esta aqui nao chega a tela
 * nem por acidente.
 */
export type NoticiaPublica = {
  id: string
  titulo: string
  resumo: string | null
  imagemUrl: string | null
  linkExterno: string | null
  dataNoticia: string
}
