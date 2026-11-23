/*
 * As quatro frentes de trabalho da seção 3 do documento, na ordem dele, cada
 * uma num cartão, na grade do protótipo: duas colunas no desktop, uma no
 * celular. Os cartões da mesma linha ficam com a mesma altura, como no
 * protótipo (design.md da change pagina-projetos, D4).
 *
 * Carregando, erro e vazio: o vazio é impossível hoje, porque o dado é
 * estático e o teste de unidade do conteúdo exige as quatro frentes. Os três
 * estados chegam quando o detalhamento vier pelo painel, fora desta change
 * (design.md da change, D5).
 */
import type { Frente } from '../tipos'
import { CartaoDaFrente } from './CartaoDaFrente'
import estilos from './GradeDeFrentes.module.css'

type PropsDaGradeDeFrentes = {
  frentes: readonly Frente[]
}

export function GradeDeFrentes({ frentes }: PropsDaGradeDeFrentes) {
  if (frentes.length === 0) return null

  return (
    <div className={estilos.secao}>
      {/* Papel de lista explícito: o Safari tira o papel de toda lista sem marcador
          (design.md da change pagina-sobre-e-equipe, D7). */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima */}
      <ul role="list" className={estilos.grade}>
        {frentes.map((frente) => (
          <CartaoDaFrente key={frente.nome} frente={frente} />
        ))}
      </ul>
    </div>
  )
}
