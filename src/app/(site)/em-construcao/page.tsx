import { PaginaEmConstrucao } from '@/componentes/layout/PaginaEmConstrucao'

/*
 * Endereco proprio da pagina provisoria: /em-construcao.
 *
 * Com o site NAO publicado, e esta pagina que o visitante recebe ao abrir a
 * raiz: o interruptor (src/proxy.ts) a serve sem mudar o endereco da barra.
 * Com o site publicado, o interruptor responde 404 aqui, para nada da pagina
 * provisoria sobrar depois do lancamento.
 *
 * Sem `noindex` de proposito: em producao, o que ela entrega e a resposta da
 * raiz, e um `noindex` aqui tiraria o site do buscador (design.md, D3).
 */
export default function PaginaEmConstrucaoRota() {
  return <PaginaEmConstrucao />
}
