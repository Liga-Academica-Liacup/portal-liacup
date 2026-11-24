/*
 * O quadro do Instagram da liga: a logo da liga no círculo (e não uma
 * borboleta, REFERENCIA-VISUAL.md, seção 5), o rótulo e o @, e o quadro
 * inteiro como link para o perfil, em nova aba (seção 7).
 */
import Image from 'next/image'
import { CONTATO_DA_LIGA } from './contato-da-liga'
import figuras from './FigurasDeContato.module.css'
import { QuadroDeContato, type ApresentacaoDoQuadro } from './QuadroDeContato'

type PropsDoQuadroDoInstagram = {
  /** "solto" na página Contato; "cartao" no bloco de contato da inicial. */
  apresentacao?: ApresentacaoDoQuadro
}

export function QuadroDoInstagram({ apresentacao = 'solto' }: PropsDoQuadroDoInstagram) {
  const { rotulo, valor, endereco } = CONTATO_DA_LIGA.instagram

  return (
    <QuadroDeContato
      apresentacao={apresentacao}
      variante="externo"
      endereco={endereco}
      rotulo={rotulo}
      valor={valor}
    >
      <Image src="/logo-liacup-256.png" alt="" width={100} height={100} className={figuras.logo} />
    </QuadroDeContato>
  )
}
