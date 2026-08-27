/*
 * O QUE É
 * Botão de ação da camada base. Burro de propósito: não sabe o que é uma
 * notícia, não chama banco, não conhece rota. Recebe props e desenha.
 *
 * QUANDO USAR
 * Ação que *acontece* — enviar, confirmar, abrir, filtrar, fechar.
 *
 * QUANDO NÃO USAR
 * Navegação. Se leva a outro endereço, é `<a>`, não botão — regra da seção 5 dos
 * padrões de código. Um `<button>` que navega quebra o menu de contexto, o abrir
 * em nova aba e o que o leitor de tela anuncia. Para isso existe, desde a F03, o
 * `LinkComAparenciaDeBotao`, que tem a MESMA aparência e é um link de verdade.
 *
 * APARÊNCIA (F03, FR-045)
 * O `Botao.module.css` foi **apagado**. Toda a aparência vem de
 * `AparenciaDeBotao.module.css`, pelo `classesDaAparencia`, e é exatamente a
 * mesma que o link consome. A remoção do arquivo antigo é o que torna isso
 * verificável: enquanto ele existisse, "compartilham a aparência" seria
 * promessa; sem ele, é a única forma de este componente continuar existindo.
 *
 * FIDELIDADE
 * Tipografia restaurada ao .btn aprovado pela ADR-0004, decisão 2.3: família
 * --font-heading, peso --font-heading-weight (400), tamanho --font-size-controle
 * (14px). A F00 usava --font-body / --font-size-h6 / 600, três desvios sem
 * registro. Altura de 44px ratificada pela decisão 2.1. Cor de fundo do primário
 * e do fantasma vêm do adendo de contraste da ADR-0003.
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { classesDaAparencia, type VarianteDeBotao } from './aparencia-de-botao'

type PropsComuns = {
  /** Conteúdo do botão. Composição, não uma prop `texto`. */
  children: ReactNode
  /** Ocupa toda a largura disponível. Combina com qualquer variante. */
  larguraTotal?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>

/*
 * A variante `icone` exige `aria-label`, e isso é cobrado pelo TIPO, não por
 * revisão: o Icone é sempre decorativo e não anuncia nada, então um botão de
 * ícone sem rótulo é lido como "botão" e mais nada. Estado impossível não
 * compila (FR-002).
 *
 * `className` e `style` ficam de fora dos dois — o `style` entrou na F03. Com a
 * aparência agora compartilhada com o link, um estilo solto em qualquer um dos
 * dois é a segunda fonte de verdade que a origem única existe para impedir.
 */
type PropsDoBotao =
  | (PropsComuns & { variante?: 'primario' | 'secundario' | 'fantasma' })
  | (PropsComuns & { variante: 'icone'; 'aria-label': string })

export function Botao({ children, larguraTotal = false, type = 'button', ...resto }: PropsDoBotao) {
  const { variante = 'primario', ...atributos } = resto as PropsComuns & {
    variante?: VarianteDeBotao
  }

  return (
    <button type={type} className={classesDaAparencia(variante, larguraTotal)} {...atributos}>
      {children}
    </button>
  )
}
