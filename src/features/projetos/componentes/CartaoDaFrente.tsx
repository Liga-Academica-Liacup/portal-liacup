/*
 * O cartão de uma frente de trabalho, como no protótipo: o nome da frente em
 * <h2> e, abaixo, o texto dela, direto no cartão. Sem a caixa tracejada, sem o
 * selo "Pendente" e sem a frase de exemplo do protótipo, que eram o lugar do
 * texto que a liga ainda não tinha mandado (REFERENCIA-VISUAL.md, seção 7).
 *
 * As quatro frentes têm a mesma letra e o mesmo estilo, a Secretaria também:
 * o texto dela vai ao ar sem marca de rascunho (Q5 (a) do Gabriel, 23/11/2026).
 *
 * Mora em features/projetos, e não usa o Cartao de componentes/ui: o Cartao
 * tem o raio, o preenchimento e a letra do .card do design system, e não os do
 * cartão desta página no protótipo (design.md da change, D1).
 */
import type { Frente } from '../tipos'
import estilos from './CartaoDaFrente.module.css'

type PropsDoCartaoDaFrente = {
  frente: Frente
}

export function CartaoDaFrente({ frente }: PropsDoCartaoDaFrente) {
  return (
    <li className={estilos.cartao}>
      <h2 className={estilos.nome}>{frente.nome}</h2>
      <p className={estilos.texto}>{frente.texto}</p>
    </li>
  )
}
