/*
 * O QUE É
 * Rótulo curto que classifica alguma coisa. Não é interativo.
 *
 * QUANDO USAR
 * Classificar — categoria de notícia, frente de projeto, situação do processo
 * seletivo.
 *
 * QUANDO NÃO USAR
 * Como botão. Etiqueta não clica. Se precisa clicar para filtrar, é um botão
 * com aparência de etiqueta — e isso é outro componente, com foco, teclado e
 * papel de botão.
 *
 * FIDELIDADE
 * Raio --radius-pill, que é o valor efetivo do .tag depois da cascata final do
 * liacup.css, e não o calc(--radius-md * 0.75) declarado no bloco. A variante
 * de contorno teve a cor corrigida pelo adendo da ADR-0003.
 */
import type { ReactNode } from 'react'
import estilos from './Etiqueta.module.css'

type VarianteDaEtiqueta = 'destaque' | 'apoio' | 'neutra' | 'contorno'

type PropsDaEtiqueta = {
  children: ReactNode
  /** União fechada. Mapeia .tag-accent, .tag-accent-2, .tag-neutral e .tag-outline. */
  variante?: VarianteDaEtiqueta
}

export function Etiqueta({ children, variante = 'neutra' }: PropsDaEtiqueta) {
  return <span className={`${estilos.etiqueta} ${estilos[variante]}`}>{children}</span>
}
