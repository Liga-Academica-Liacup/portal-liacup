/*
 * Os tipos do conteúdo da página Projetos.
 *
 * O conteúdo mora em `conteudo.ts`, separado da composição, para que trocar o
 * texto de uma frente não mexa em nenhum componente. Quando o detalhamento das
 * frentes vier pelo painel, o `dados.ts` desta pasta passa a ler com estes
 * mesmos tipos.
 */

/** Uma frente de trabalho: o nome e o texto dela (conteudo-institucional.md, seção 3). */
export type Frente = {
  readonly nome: string
  readonly texto: string
}

export type ConteudoDeProjetos = {
  /** O sobretítulo e o título principal da faixa, rótulos de interface (Q2 (a)). */
  readonly faixa: {
    readonly sobretitulo: string
    readonly titulo: string
  }
  /** As quatro frentes da seção 3, na ordem do documento. */
  readonly frentes: readonly Frente[]
}
