import type { Metadata } from 'next'
import { BotaoDemo } from './BotaoDemo'
import { CampoDemo } from './CampoDemo'
import { CartaoDemo } from './CartaoDemo'
import { EstadoVazioDemo } from './EstadoVazioDemo'
import { EtiquetaDemo } from './EtiquetaDemo'
import { IconeDemo } from './IconeDemo'
import { LinhaDeInscricaoDemo } from './LinhaDeInscricaoDemo'
import { ParesVisuaisDemo } from './ParesVisuaisDemo'
import { SeparadorDemo } from './SeparadorDemo'
import estilos from './page.module.css'

/*
 * Vitrine do design system.
 *
 * Não é página do site: mora no grupo de rotas (interno), não recebe link de
 * nenhuma página pública e não é indexada. É onde a liga revisa o sistema e
 * onde as verificações automáticas rodam.
 *
 * Esta página só COMPÕE. Cada componente tem seu próprio arquivo de
 * demonstração ao lado, e é assim de propósito: componente novo acrescenta um
 * arquivo em vez de engordar uma página que só cresce, e cada arquivo cabe no
 * limite de 150 linhas da seção 2 dos padrões sem precisar de exceção.
 *
 * Regra de crescimento (FR-013): componente ou estado que não aparece aqui é
 * entrega incompleta.
 */
export const metadata: Metadata = {
  title: 'Vitrine do design system — Portal LIACUP',
  robots: { index: false, follow: false },
}

export default function PaginaDaVitrine() {
  return (
    <main className={estilos.pagina}>
      <h1>Vitrine do design system</h1>

      <p className={estilos.aviso}>
        Página interna. Não faz parte do site público, não recebe link de nenhuma página pública e
        não é indexada por buscador. Serve para revisar todos os componentes, em todas as variantes
        e em todos os estados, de uma vez só.
      </p>

      <BotaoDemo />
      <LinhaDeInscricaoDemo />
      <ParesVisuaisDemo />
      <CartaoDemo />
      <EtiquetaDemo />
      <CampoDemo />
      <SeparadorDemo />
      <IconeDemo />
      <EstadoVazioDemo />
    </main>
  )
}
