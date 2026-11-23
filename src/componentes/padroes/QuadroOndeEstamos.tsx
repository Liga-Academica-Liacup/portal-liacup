/*
 * O quadro "Onde estamos": a borboleta da liga num círculo lilás claro, como
 * no protótipo, e o endereço da sede, como texto, e não como link
 * (design.md da change pagina-contato, D4).
 *
 * A borboleta fica aqui, e não o marcador de localização do rodapé: a
 * REFERENCIA-VISUAL.md, seção 5, tira a borboleta só do Instagram e do e-mail.
 */
import { BorboletaDaLiga } from '@/componentes/ui/BorboletaDaLiga'
import { CONTATO_DA_LIGA } from './contato-da-liga'
import figuras from './FigurasDeContato.module.css'
import { QuadroDeContato } from './QuadroDeContato'

export function QuadroOndeEstamos() {
  const { rotulo, valor } = CONTATO_DA_LIGA.sede

  return (
    <QuadroDeContato variante="texto" rotulo={rotulo} valor={valor}>
      <span className={figuras.circuloDaBorboleta}>
        <BorboletaDaLiga className={figuras.borboleta} />
      </span>
    </QuadroDeContato>
  )
}
