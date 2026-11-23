/*
 * Os tipos do conteúdo da página Contato.
 *
 * O conteúdo mora em `conteudo.ts`, separado da composição, para que trocar um
 * rótulo não mexa em nenhum componente. Os dados de contato da liga (Instagram,
 * e-mail e sede) não moram aqui: moram ao lado do bloco de contato, em
 * src/componentes/padroes/contato-da-liga.ts, porque a inicial também os usa
 * (design.md da change pagina-contato, D1). O formulário da R4 vai morar nesta
 * pasta.
 */

export type ConteudoDoContato = {
  /** O sobretítulo e o título principal do topo, rótulos de interface (Q1 (a)). */
  readonly topo: {
    readonly sobretitulo: string
    readonly titulo: string
  }
}
