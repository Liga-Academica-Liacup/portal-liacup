/*
 * As classes de um link com aparência de botão. Uma função, e não um
 * componente, porque quem desenha o link muda: o botão de destaque precisa do
 * LinkDaNavegacao (que marca a página atual), e o hero usa o Link comum.
 */
import estilos from './AparenciaDeBotao.module.css'

export type VarianteDoLinkBotao = 'primario' | 'secundario'

export type LarguraDoLinkBotao = 'natural' | 'total'

export function aparenciaDeBotao(
  variante: VarianteDoLinkBotao,
  largura: LarguraDoLinkBotao = 'natural'
): string {
  return [estilos.botao, estilos[variante], largura === 'total' ? estilos.larguraTotal : '']
    .filter(Boolean)
    .join(' ')
}
