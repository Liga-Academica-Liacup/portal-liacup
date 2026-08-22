/*
 * O QUE É
 * Botão de ação da camada base. Burro de propósito: não sabe o que é uma
 * notícia, não chama banco, não conhece rota. Recebe props e desenha.
 *
 * QUANDO USAR
 * Ação que *acontece* — enviar, confirmar, abrir, filtrar, fechar.
 *
 * QUANDO NÃO USAR
 * Navegação. Se leva a outro endereço, é <a>, não botão — regra da seção 5 dos
 * padrões de codigo. Um <button> que navega quebra o menu de contexto, o abrir
 * em nova aba e o que o leitor de tela anuncia.
 *
 * FIDELIDADE
 * Tipografia restaurada ao .btn aprovado pela ADR-0004, decisão 2.3: família
 * --font-heading, peso --font-heading-weight (400), tamanho --font-size-controle
 * (14px). A F00 usava --font-body / --font-size-h6 / 600, três desvios sem
 * registro. Altura de 44px ratificada pela decisão 2.1. Cor de fundo do primário
 * e do fantasma vêm do adendo de contraste da ADR-0003.
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import estilos from './Botao.module.css'

type VarianteDoBotao = 'primario' | 'secundario' | 'fantasma' | 'icone'

type PropsComuns = {
  /** Conteúdo do botão. Composição, não uma prop `texto`. */
  children: ReactNode
  /** Ocupa toda a largura disponível. Combina com qualquer variante. */
  larguraTotal?: boolean
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

/*
 * A variante `icone` exige `aria-label`, e isso é cobrado pelo TIPO, não por
 * revisão: o Icone é sempre decorativo e não anuncia nada, então um botão de
 * ícone sem rótulo é lido como "botão" e mais nada. Estado impossível não
 * compila (FR-002).
 */
type PropsDoBotao =
  | (PropsComuns & { variante?: 'primario' | 'secundario' | 'fantasma' })
  | (PropsComuns & { variante: 'icone'; 'aria-label': string })

export function Botao({ children, larguraTotal = false, type = 'button', ...resto }: PropsDoBotao) {
  const { variante = 'primario', ...atributos } = resto as PropsComuns & {
    variante?: VarianteDoBotao
  }

  const classes = [estilos.botao, estilos[variante], larguraTotal ? estilos.larguraTotal : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...atributos}>
      {children}
    </button>
  )
}
