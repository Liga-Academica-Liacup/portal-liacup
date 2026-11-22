/*
 * Os tipos do conteúdo da página Sobre.
 *
 * O conteúdo mora em `conteudo.ts`, separado da composição, para que trocar um
 * parágrafo não mexa em nenhum componente. Os docentes orientadores, que o
 * Sobre também mostra, são dado da Equipe e moram em src/features/equipe (Q5
 * (a) da change pagina-sobre-e-equipe): quem junta os dois é a rota.
 */
import type { TextoDoTituloDeSecao } from '@/componentes/padroes/TituloDeSecao'

/** Um item de "O que a Liga se propõe a fazer": o nome da seção do documento e os parágrafos dela. */
export type ItemDosObjetivos = {
  readonly nome: string
  readonly paragrafos: readonly string[]
}

export type ConteudoDoSobre = {
  /** O título principal, rótulo de interface (Q2 (b)). */
  readonly titulo: string
  /** A apresentação, seção 2.1. */
  readonly apresentacao: string
  readonly historia: {
    readonly secao: TextoDoTituloDeSecao
    /** A história, seção 2.2. */
    readonly texto: string
  }
  readonly objetivos: {
    readonly secao: TextoDoTituloDeSecao
    /** As seções 2.3 a 2.6, na ordem do documento (Q3 (a)). */
    readonly itens: readonly ItemDosObjetivos[]
  }
  /** O título do bloco dos docentes no Sobre (Q4 (a)). */
  readonly secaoDosDocentes: TextoDoTituloDeSecao
}
