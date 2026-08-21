/*
 * Exemplo da camada base (componentes/ui).
 *
 * Componente burro de proposito: nao sabe o que e uma noticia, nao chama banco,
 * nao conhece rota. Recebe props e desenha. E isso que o torna reaproveitavel.
 *
 * A variante primaria usa --color-accent-600 e nao --color-accent: e a
 * reatribuicao do ADR-0003, que leva o contraste de 3,48:1 para 4,84:1. Ela vive
 * aqui, no componente de botao, e nao em CSS solto — que e onde os padroes de
 * codigo mandam a regra de botao morar.
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import estilos from './Botao.module.css'

type VarianteDoBotao = 'primario' | 'secundario' | 'fantasma'

type PropsDoBotao = {
  /** Conteudo do botao. Composicao vence configuracao: nada de prop `texto`. */
  children: ReactNode
  /** Variante visual. Variante em vez de booleanas soltas evita estados impossiveis. */
  variante?: VarianteDoBotao
  /** Ocupa toda a largura disponivel. */
  larguraTotal?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

export function Botao({
  children,
  variante = 'primario',
  larguraTotal = false,
  type = 'button',
  ...resto
}: PropsDoBotao) {
  const classes = [estilos.botao, estilos[variante], larguraTotal ? estilos.larguraTotal : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...resto}>
      {children}
    </button>
  )
}
