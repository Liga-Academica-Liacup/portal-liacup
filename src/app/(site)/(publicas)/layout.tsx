import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Cabecalho } from '@/componentes/layout/Cabecalho'
import { RodapePublico } from '@/componentes/layout/RodapePublico'

/*
 * A moldura das páginas públicas: cabeçalho, conteúdo e rodapé.
 *
 * Vale para as páginas deste grupo, (publicas), e não para /em-construcao, que
 * fica fora dele de propósito: a página "Portal em construção" é a que a
 * produção mostra até o lançamento, e ela não muda (design.md da layout-e-hero,
 * D1). Grupo de rotas, a pasta com parênteses, não muda endereço: a raiz
 * continua sendo /, e o interruptor (src/proxy.ts) continua igual.
 *
 * Página nova do site entra aqui dentro, numa pasta com o endereço dela, e na
 * lista única de páginas públicas (src/lib/utils/paginas-publicas.json), na
 * mesma change. O passo a passo está no README.
 */

/*
 * O ícone da aba é a logo da liga (REFERENCIA-VISUAL.md, seção 7). Mora aqui,
 * e não no src/app/ raiz nem num arquivo de convenção do Next (favicon.ico,
 * icon.png), porque esses valem para toda rota, e a página em construção da
 * produção não muda até o lançamento.
 *
 * Os quatro arquivos de public/ são cópias exatas, sem redimensionar, das
 * variantes de assets/: icone-da-aba-32, -48 e -96 vêm de logo-liacup-32, -48 e
 * -96, e icone-da-tela-de-inicio-180 vem de logo-liacup-180 (o ícone que o
 * iPhone usa ao pôr o site na tela de início). Os tamanhos 192 e 512 do Android
 * ficam para o manifesto web, que é da lancamento-r1.
 */
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/icone-da-aba-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icone-da-aba-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icone-da-aba-96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/icone-da-tela-de-inicio-180.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function LayoutDasPaginasPublicas({ children }: { children: ReactNode }) {
  return (
    <>
      <Cabecalho />
      <main>{children}</main>
      <RodapePublico />
    </>
  )
}
