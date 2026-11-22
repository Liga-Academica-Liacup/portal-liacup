/*
 * "Fundadores discentes": os cinco nomes da seção 4.2 do documento, na ordem
 * dele, no lugar do bloco "Ligantes" do protótipo (Q8 (a) do Gabriel,
 * 22/11/2026). Os nomes têm a letra dos nomes dos ligantes do protótipo, sem
 * círculo, foto nem curso. É composição nova sobre a área do protótipo, a
 * aprovar no lado a lado (design.md da change, D5).
 *
 * Carregando, erro e vazio: o vazio é impossível hoje, porque o dado é
 * estático e o teste de unidade do conteúdo exige os cinco nomes. Os três
 * estados chegam na R3, com o banco (design.md da change, D8).
 */
import estilos from './FundadoresDiscentes.module.css'
import { TituloDoBloco } from './TituloDoBloco'

type PropsDosFundadoresDiscentes = {
  titulo: string
  fundadores: readonly string[]
}

export function FundadoresDiscentes({ titulo, fundadores }: PropsDosFundadoresDiscentes) {
  if (fundadores.length === 0) return null

  return (
    <section className={estilos.secao} aria-labelledby="titulo-dos-fundadores">
      <TituloDoBloco id="titulo-dos-fundadores">{titulo}</TituloDoBloco>
      {/* Papel de lista explícito: o Safari tira o papel de toda lista sem marcador
          (design.md da change pagina-sobre-e-equipe, D7). */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima */}
      <ul role="list" className={estilos.grade}>
        {fundadores.map((nome) => (
          <li key={nome} className={estilos.nome}>
            {nome}
          </li>
        ))}
      </ul>
    </section>
  )
}
