/*
 * "Como funciona": a linha do tempo do protótipo, com as duas etapas da
 * seleção e sem datas (conteudo-institucional.md, seção 5.5; o cronograma do
 * edital encerrado não vai ao ar).
 *
 * Cada etapa mostra o nome, com a letra dos títulos, e abaixo o caráter dela.
 * O travessão do documento vira essa quebra de linha (design.md da change,
 * D4). É uma lista numerada, porque a ordem importa; as bolinhas da linha do
 * tempo são decorativas e não são anunciadas.
 *
 * Lista vazia não desenha nada: a seção não aparece sem etapa. O teste de
 * unidade do conteúdo garante as duas.
 */
import type { Etapa, TituloDeSecao as Titulo } from '../tipos'
import estilos from './Etapas.module.css'
import { TituloDeSecao } from './TituloDeSecao'

type PropsDasEtapas = {
  titulo: Titulo
  etapas: readonly Etapa[]
}

export function Etapas({ titulo, etapas }: PropsDasEtapas) {
  if (etapas.length === 0) return null

  return (
    <section aria-labelledby="titulo-das-etapas">
      <TituloDeSecao titulo={titulo} id="titulo-das-etapas" />
      <ol className={estilos.linhaDoTempo}>
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
