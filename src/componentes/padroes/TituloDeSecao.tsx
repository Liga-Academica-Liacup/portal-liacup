/*
 * O sobretítulo pequeno, em maiúsculas, e o título de uma seção, como no
 * protótipo ("ETAPAS" sobre "Como funciona", "NOSSA HISTÓRIA" sobre "Como a
 * Liga começou").
 *
 * O título é <h2>: a página tem um <h1> só, na faixa do topo, e cada seção
 * desce um nível (PADROES-DE-CODIGO.md, 11.1). O `id` serve para a seção se
 * nomear pelo título, com aria-labelledby.
 *
 * Mora em componentes/padroes desde a change pagina-sobre-e-equipe (D6),
 * porque o Processo seletivo e o Sobre o usam. O texto chega por props: este
 * componente não sabe de que página é.
 */
import estilos from './TituloDeSecao.module.css'

/** O texto de um título de seção: o sobretítulo e o título. */
export type TextoDoTituloDeSecao = {
  readonly sobretitulo: string
  readonly titulo: string
}

/** 'padrao' é o .t-h2 de 32 px; 'grande', o de 34 px (FAQ do Processo seletivo e o Sobre). */
type TamanhoDoTitulo = 'padrao' | 'grande'

/**
 * O espaço abaixo do título, como no protótipo: 'padrao' antes de uma lista ou
 * quadro, 'curto' antes de um parágrafo (história do Sobre), 'largo' antes de
 * uma grade de cartões (docentes do Sobre) e 'nenhum' quando o título fica
 * numa coluna própria (objetivos do Sobre).
 */
type EspacoAbaixoDoTitulo = 'padrao' | 'curto' | 'largo' | 'nenhum'

type PropsDoTituloDeSecao = {
  titulo: TextoDoTituloDeSecao
  /** Usado pela seção no aria-labelledby. */
  id: string
  tamanho?: TamanhoDoTitulo
  espacoAbaixo?: EspacoAbaixoDoTitulo
}

const CLASSE_DO_ESPACO: Record<EspacoAbaixoDoTitulo, string | undefined> = {
  padrao: estilos.espacoPadrao,
  curto: estilos.espacoCurto,
  largo: estilos.espacoLargo,
  nenhum: estilos.espacoNenhum,
}

export function TituloDeSecao({
  titulo,
  id,
  tamanho = 'padrao',
  espacoAbaixo = 'padrao',
}: PropsDoTituloDeSecao) {
  return (
    <>
      <p className={estilos.sobretitulo}>{titulo.sobretitulo}</p>
      <h2
        id={id}
        className={`${estilos.titulo} ${estilos[tamanho]} ${CLASSE_DO_ESPACO[espacoAbaixo]}`}
      >
        {titulo.titulo}
      </h2>
    </>
  )
}
