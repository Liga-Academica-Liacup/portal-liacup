/*
 * Os tipos dos números da liga, os indicadores que a página inicial mostra
 * logo abaixo do hero (docs/conteudo-institucional.md, seção 9).
 *
 * Os números moram em `conteudo.ts`, separados da composição, porque a
 * diretoria os revisa na passagem de gestão (seção 9) e o painel da R3 vai
 * editá-los. Quando o painel existir, o `dados.ts` desta pasta passa a ler com
 * estes mesmos tipos (design.md da change inicio-completo, D3).
 */

/**
 * Um número e o rótulo dele. Os dois são texto, e não quantidade: o "2026" é
 * ano, e nenhum cálculo usa os números.
 */
export type NumeroDaLiga = {
  readonly valor: string
  readonly rotulo: string
}

/** Os números, na ordem da seção 9. */
export type NumerosDaLiga = readonly NumeroDaLiga[]
