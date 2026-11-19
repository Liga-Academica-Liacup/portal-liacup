import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { sitePublicado } from '@/lib/utils/site-publicado'

/*
 * O interruptor "em construcao".
 *
 * Para quem nao programa: este arquivo roda antes de qualquer pagina, a cada
 * visita, e decide se o visitante ve o site ou so a pagina "Portal em
 * construcao". Quem liga e desliga e a variavel SITE_PUBLICADO, configurada na
 * Vercel (Settings > Environment Variables). So o texto exato `true` publica;
 * qualquer outro valor, ou a variavel ausente, deixa o site escondido. Mudou a
 * variavel na Vercel, e preciso implantar de novo para valer. O passo a passo
 * esta no README, secao "Variaveis de ambiente".
 *
 * O que ele faz, por endereco (design.md, D1):
 *
 *   endereco          site NAO publicado                site publicado
 *   /                 mostra /em-construcao, endereco   passa
 *                     continua / na barra
 *   /em-construcao    passa                             404, a pagina normal
 *                                                       de nao encontrada
 *   qualquer outro    307 (redirecionamento             passa
 *                     temporario) para /
 *
 * So escapam do interruptor os estilos e scripts compilados, o otimizador de
 * imagem e os arquivos de imagem ou de fonte. Todo o resto passa por aqui,
 * inclusive endereco com extensao, como /vitrine.rsc ou /robots.txt. A lista e
 * o motivo estao no `config.matcher`, no fim do arquivo (D4, Q6).
 */

const RAIZ = '/'
const PAGINA_EM_CONSTRUCAO = '/em-construcao'

/*
 * Caminho reservado que nao tem pagina nenhuma, de proposito: mandar o pedido
 * para ca faz o Next responder o 404 normal, igual ao de qualquer endereco que
 * nao existe. Comeca com `_` porque pasta com `_` em src/app nunca vira rota,
 * entao ninguem cria uma pagina aqui sem querer (D3).
 */
const CAMINHO_SEM_PAGINA = '/_sem-pagina'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (sitePublicado(process.env.SITE_PUBLICADO)) {
    if (pathname === PAGINA_EM_CONSTRUCAO) {
      return NextResponse.rewrite(new URL(CAMINHO_SEM_PAGINA, request.url))
    }
    return NextResponse.next()
  }

  if (pathname === RAIZ) {
    return NextResponse.rewrite(new URL(PAGINA_EM_CONSTRUCAO, request.url))
  }
  if (pathname === PAGINA_EM_CONSTRUCAO) {
    return NextResponse.next()
  }
  /* Sem a busca original (?x=1): a raiz nao usa nenhuma. */
  return NextResponse.redirect(new URL(RAIZ, request.url), 307)
}

/*
 * Onde o interruptor NAO roda, nos dois modos (D4, Q6):
 *   - _next/static: os estilos, scripts e fontes compilados;
 *   - _next/image: o otimizador de imagem, por onde a logo passa;
 *   - endereco terminado em uma destas 9 extensoes de imagem ou fonte:
 *     png, jpg, jpeg, webp, avif, svg, ico, woff, woff2. Ex.:
 *     /logo-liacup-256.png, da pasta public/.
 * Sem isso, a pagina em construcao perderia a logo e o estilo.
 *
 * Por que so essas, e nao "qualquer arquivo": o Next guarda o conteudo das
 * paginas tambem em arquivos com extensao, como /vitrine.rsc, /vitrine.html,
 * /robots.txt e /sitemap.xml. Se toda extensao escapasse, a vitrine ou a
 * pagina inicial poderiam vazar por esses enderecos antes do lancamento.
 * Por isso .rsc, .html, .txt, .xml e qualquer outra extensao passam pelo
 * interruptor.
 *
 * Consequencia para quem mantem o site: um arquivo de outra extensao posto na
 * pasta public/, como um PDF, leva 307 para / enquanto o site nao estiver
 * publicado. Publicado, ele abre normalmente.
 *
 * Maiusculas contam: a comparacao diferencia maiusculas de minusculas. Um
 * endereco como /LOGO.PNG nao esta na lista, entao passa pelo interruptor e,
 * com o site nao publicado, leva 307 para / (falha fechada: esconde, nao
 * vaza). Nomeie os arquivos de public/ com extensao em minusculas.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff|woff2)$).*)',
  ],
}
