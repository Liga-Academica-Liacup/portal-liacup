import { PaginaEmConstrucao } from '@/componentes/layout/PaginaEmConstrucao'

/*
 * A raiz do site.
 *
 * Ate a change `pagina-inicial`, a raiz e a pagina provisoria, com o site
 * publicado ou nao. Com o site NAO publicado, o interruptor (src/proxy.ts) nem
 * chega aqui: ele serve /em-construcao no lugar, sem mudar o endereco. Por isso
 * trocar esta pagina pela inicial nova nao a poe no ar antes do lancamento.
 */
export default function PaginaInicial() {
  return <PaginaEmConstrucao />
}
