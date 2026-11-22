/*
 * O quadro da foto, sem foto: a superfície, o raio, a sombra e o filtro do
 * quadro do protótipo, com uma borboleta da liga grande no centro, em
 * opacidade baixa, sem texto (REFERENCIA-VISUAL.md, seção 7).
 *
 * Decorativo inteiro: escondido do leitor de tela, e sem foco. Quando a liga
 * mandar a foto, troca só o conteúdo do quadro.
 *
 * Quem usa decide a altura e a proporção pela className, porque cada página
 * tem a sua (no Sobre, 380 px no desktop e 4 / 3 até 1024 px).
 *
 * O hero da inicial tem um quadro igual, com os mesmos tokens, e não foi
 * migrado para este componente na change pagina-sobre-e-equipe, para a inicial
 * não mudar um pixel (design.md da change, D4). Fica como dívida.
 */
import { BorboletaDaLiga } from '@/componentes/ui/BorboletaDaLiga'
import estilos from './QuadroSemFoto.module.css'

type PropsDoQuadroSemFoto = {
  /** A altura ou a proporção do quadro, de quem usa. */
  className?: string
}

export function QuadroSemFoto({ className = '' }: PropsDoQuadroSemFoto) {
  return (
    <div className={`${estilos.quadro} ${className}`} aria-hidden="true">
      <BorboletaDaLiga className={estilos.borboleta} />
    </div>
  )
}
