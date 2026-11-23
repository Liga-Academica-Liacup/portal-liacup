/*
 * O quadro do e-mail da liga: o ícone do Gmail no círculo (e não uma
 * borboleta, REFERENCIA-VISUAL.md, seção 5), o rótulo e o endereço, e o quadro
 * inteiro como link que abre um e-mail novo para ele (seção 7).
 *
 * O ícone é public/icone-email-gmail.png, cópia idêntica de
 * assets/icone-email-gmail.png (design.md da change pagina-contato, D1).
 */
import Image from 'next/image'
import { CONTATO_DA_LIGA } from './contato-da-liga'
import figuras from './FigurasDeContato.module.css'
import { QuadroDeContato } from './QuadroDeContato'

export function QuadroDoEmail() {
  const { rotulo, valor } = CONTATO_DA_LIGA.email

  return (
    <QuadroDeContato variante="email" endereco={valor} rotulo={rotulo} valor={valor}>
      <span className={figuras.circuloDoEmail}>
        <Image
          src="/icone-email-gmail.png"
          alt=""
          width={52}
          height={52}
          className={figuras.iconeDoEmail}
        />
      </span>
    </QuadroDeContato>
  )
}
