/*
 * O montador de classes da aparência compartilhada.
 *
 * `Botao` e `LinkComAparenciaDeBotao` chamam esta função e não conhecem o CSS
 * diretamente. Assim a única coisa que decide como um controle se parece é o
 * par `AparenciaDeBotao.module.css` + este arquivo (FR-045).
 *
 * O `Botao` aceita quatro variantes; o link, três. A diferença não é descuido:
 * `icone` é variante de botão sem consumidor de link-ícone, e criar API sem
 * consumidor foi o que a F01 recusou. Por isso os dois tipos abaixo — o
 * compartilhado e o do botão — em vez de um só com uma prop "não use isto".
 */
import estilos from './AparenciaDeBotao.module.css'

/** As variantes que botão e link compartilham. */
export type VarianteCompartilhada = 'primario' | 'secundario' | 'fantasma'

/** As do botão: as compartilhadas mais a de ícone. */
export type VarianteDeBotao = VarianteCompartilhada | 'icone'

export function classesDaAparencia(variante: VarianteDeBotao, larguraTotal: boolean): string {
  return [estilos.base, estilos[variante], larguraTotal ? estilos.larguraTotal : '']
    .filter(Boolean)
    .join(' ')
}
