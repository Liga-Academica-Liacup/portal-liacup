/*
 * O sobretítulo pequeno, em maiúsculas, e o título de uma seção da página do
 * processo seletivo, como no protótipo ("ETAPAS" sobre "Como funciona").
 *
 * O título é <h2>: a página tem um <h1> só, na faixa do topo, e cada seção
 * desce um nível (PADROES-DE-CODIGO.md, 11.1). O `id` serve para a seção se
 * nomear pelo título, com aria-labelledby.
 */
import type { TituloDeSecao as Titulo } from '../tipos'
import estilos from './TituloDeSecao.module.css'

type TamanhoDoTitulo = 'padrao' | 'perguntas'

type PropsDoTituloDeSecao = {
  titulo: Titulo
  /** Usado pela seção no aria-labelledby. */
  id: string
  /** O título das perguntas é maior no protótipo (34 px, contra 32 px). */
  tamanho?: TamanhoDoTitulo
}

export function TituloDeSecao({ titulo, id, tamanho = 'padrao' }: PropsDoTituloDeSecao) {
  return (
    <>
      <p className={estilos.sobretitulo}>{titulo.sobretitulo}</p>
      <h2 id={id} className={`${estilos.titulo} ${estilos[tamanho]}`}>
        {titulo.titulo}
      </h2>
    </>
  )
}
