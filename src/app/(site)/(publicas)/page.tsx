import { montarMetadados } from '@/lib/utils/metadados'
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
/* Título, descrição, canônico e Open Graph saem da entrada da página na lista
   única, por uma função só (PADROES-DE-CODIGO.md, seção 11). */
export const metadata = montarMetadados('/')

export default function PaginaInicial() {
  return <HeroDaInicial />
}
