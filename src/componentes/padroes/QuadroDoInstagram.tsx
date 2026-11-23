/*
 * O quadro do Instagram da liga: a logo da liga no círculo (e não uma
 * borboleta, REFERENCIA-VISUAL.md, seção 5), o rótulo e o @, e o quadro
 * inteiro como link para o perfil, em nova aba (seção 7).
 */
import Image from 'next/image'
import { CONTATO_DA_LIGA } from './contato-da-liga'
import figuras from './FigurasDeContato.module.css'
import { QuadroDeContato } from './QuadroDeContato'

export function QuadroDoInstagram() {
  const { rotulo, valor, endereco } = CONTATO_DA_LIGA.instagram

  return (
    <QuadroDeContato variante="externo" endereco={endereco} rotulo={rotulo} valor={valor}>
      <Image src="/logo-liacup-256.png" alt="" width={100} height={100} className={figuras.logo} />
    </QuadroDeContato>
  )
}
