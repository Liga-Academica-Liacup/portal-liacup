import { HeroDaInicial } from './_inicio/HeroDaInicial'

/*
 * A página inicial, endereço /.
 *
 * Com o site NAO publicado, o interruptor (src/proxy.ts) nem chega aqui: ele
 * serve /em-construcao no lugar, sem mudar o endereço. Por isso esta página só
 * aparece com o site publicado: nas prévias da Vercel e, depois da
 * lancamento-r1, em produção.
 *
 * Nesta change, só o hero. Números, eventos, notícias, conteúdo educativo,
 * faixa do processo seletivo e contato chegam na inicio-completo e na R2.
 */
export default function PaginaInicial() {
  return <HeroDaInicial />
}
