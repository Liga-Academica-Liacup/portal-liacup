/*
 * Os tipos do conteúdo da página Equipe, e dos docentes que a página Sobre
 * também mostra.
 *
 * O conteúdo mora em `conteudo.ts`, separado da composição, para que trocar um
 * nome ou uma linha não mexa em nenhum componente. Na R3, nomes e fotos da
 * diretoria viram dado do banco, e o `dados.ts` desta pasta passa a ler com
 * estes mesmos tipos.
 */

/** Um cargo da diretoria: o nome do cargo e a linha que o resume (seção 4.3). */
export type CargoDaDiretoria = {
  readonly cargo: string
  readonly linha: string
}

/** Um docente orientador: o nome com o tratamento, o cargo e a formação (seção 4.1). */
export type Docente = {
  readonly nome: string
  readonly cargo: string
  readonly formacao: string
}

export type ConteudoDaEquipe = {
  /** O sobretítulo e o título principal da faixa, rótulos de interface (Q2 (b)). */
  readonly faixa: {
    readonly sobretitulo: string
    readonly titulo: string
  }
  /** Os títulos dos blocos, rótulos de interface (Q4 (a)). */
  readonly titulos: {
    readonly diretoria: string
    readonly fundadores: string
    readonly docentes: string
  }
  /** Os seis cargos da seção 4.3, na ordem do documento. */
  readonly cargos: readonly CargoDaDiretoria[]
  /** Os cinco fundadores discentes da seção 4.2, na ordem do documento. */
  readonly fundadores: readonly string[]
  /** As duas docentes da seção 4.1, na ordem do documento. */
  readonly docentes: readonly Docente[]
}
