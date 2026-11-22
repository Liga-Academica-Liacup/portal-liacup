/*
 * "Quem pode se inscrever": o quadro do protótipo, com os quatro itens em
 * lista e nenhum parágrafo (conteudo-institucional.md, seção 5.3, subseção
 * "Texto da página", que vale também pela 5.4; correção do Gabriel,
 * 21/11/2026).
 *
 * As bolinhas verdes da lista são decorativas e não são anunciadas.
 *
 * Carregando, erro e vazio: o vazio é impossível hoje, porque o dado é
 * estático e o teste de unidade do conteúdo exige os quatro itens. Os três
 * estados chegam na R3, com o banco (Q12 (a) do Gabriel, 21/11/2026).
 */
import { TituloDeSecao, type TextoDoTituloDeSecao } from '@/componentes/padroes/TituloDeSecao'
import estilos from './QuemPodeSeInscrever.module.css'

type PropsDeQuemPodeSeInscrever = {
  titulo: TextoDoTituloDeSecao
  itens: readonly string[]
}

export function QuemPodeSeInscrever({ titulo, itens }: PropsDeQuemPodeSeInscrever) {
  return (
    <section aria-labelledby="titulo-dos-requisitos">
      <TituloDeSecao titulo={titulo} id="titulo-dos-requisitos" />
      {/* Papel de lista explícito: o Safari tira o papel de toda lista sem marcador
          (design.md da change pagina-sobre-e-equipe, D7). */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima */}
      <ul role="list" className={estilos.quadro}>
        {itens.map((item) => (
          <li key={item} className={estilos.item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
