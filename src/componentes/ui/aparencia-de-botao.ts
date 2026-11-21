/*
 * As classes do botão da camada base, para quem precisa da aparência de botão
 * num elemento que não é <button>.
 *
 * Um contrato visual só (ADR-0006; Q4 (c) do Gabriel na layout-e-hero): o
 * Botao usa esta função, e um link que parece botão usa a mesma. Assim os dois
 * têm sempre os mesmos estados de repouso, hover, pressionado, foco e página
 * atual. É uma função, e não um componente, porque quem desenha o link muda: o
 * botão de destaque do cabeçalho precisa do LinkDaNavegacao, que marca a página
 * atual, e o hero usa o Link comum. Esta função não conhece rota.
 *
 * Link é <a>, porque navega (PADROES-DE-CODIGO.md, 5). A variante de ícone fica
 * só no Botao, que cobra o rótulo acessível pelo tipo.
 */
import estilos from './Botao.module.css'

export type VarianteDoBotao = 'primario' | 'secundario' | 'fantasma' | 'icone'

/** As variantes que um link com aparência de botão pode ter. */
export type VarianteDoLinkBotao = Exclude<VarianteDoBotao, 'icone'>

/** `total` ocupa toda a largura disponível; `natural`, a do conteúdo. */
export type LarguraDoBotao = 'natural' | 'total'

export function aparenciaDeBotao(
  variante: VarianteDoBotao,
  largura: LarguraDoBotao = 'natural'
): string {
  return [estilos.botao, estilos[variante], largura === 'total' ? estilos.larguraTotal : '']
    .filter(Boolean)
    .join(' ')
}
