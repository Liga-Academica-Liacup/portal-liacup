/*
 * "Como funciona": a linha do tempo do protótipo, com as cinco etapas da
 * seleção e sem datas (conteudo-institucional.md, seção 5.5; o cronograma do
 * edital encerrado não vai ao ar).
 *
 * Cada etapa mostra o nome, com a letra dos títulos, e abaixo o caráter dela.
 * O " · " do documento vira essa quebra de linha (design.md da change, D4). É
 * uma lista numerada, porque a ordem importa; as bolinhas da linha do tempo
 * são decorativas e não são anunciadas.
 *
 * Carregando, erro e vazio: o vazio é impossível hoje, porque o dado é
 * estático e o teste de unidade do conteúdo exige as cinco etapas. Os três
 * estados chegam na R3, com o banco (Q12 (a) do Gabriel, 21/11/2026).
 */
import { TituloDeSecao, type TextoDoTituloDeSecao } from '@/componentes/padroes/TituloDeSecao'
import type { Etapa } from '../tipos'
import estilos from './Etapas.module.css'

type PropsDasEtapas = {
  titulo: TextoDoTituloDeSecao
  etapas: readonly Etapa[]
}

export function Etapas({ titulo, etapas }: PropsDasEtapas) {
  if (etapas.length === 0) return null

  return (
    <section aria-labelledby="titulo-das-etapas">
      <TituloDeSecao titulo={titulo} id="titulo-das-etapas" />
      {/* Papel de lista explícito: o Safari tira o papel de toda lista sem marcador,
          e o VoiceOver deixa de dizer quantos itens há (design.md da change
          pagina-sobre-e-equipe, D7). */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima */}
      <ol role="list" className={estilos.linhaDoTempo}>
        {etapas.map((etapa) => (
          <li key={etapa.nome} className={estilos.etapa}>
            <p className={estilos.nome}>{etapa.nome}</p>
            <p className={estilos.carater}>{etapa.carater}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
