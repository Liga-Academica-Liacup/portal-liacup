/*
 * O QUE É
 * Linha que divide blocos de conteúdo. Converte a classe .hr.
 *
 * QUANDO USAR
 * Separar dois assuntos diferentes na mesma página.
 *
 * QUANDO NÃO USAR
 * Criar respiro entre elementos. Para isso existe espaçamento por token — um
 * separador ali vira ruído para quem ouve a página.
 *
 * ARMADILHA
 * `decorativo` é o padrão de propósito. A maior parte dos separadores é enfeite
 * e não deve ser anunciada; um leitor de tela lendo "separador" a cada respiro
 * visual atrapalha mais do que ajuda. Só marque `decorativo={false}` quando a
 * linha realmente divide dois assuntos e essa divisão é informação.
 */
import estilos from './Separador.module.css'

type PropsDoSeparador = {
  /** Enfeite visual (padrão) ou divisão semântica anunciável. */
  decorativo?: boolean
}

export function Separador({ decorativo = true }: PropsDoSeparador) {
  if (decorativo) {
    return <div className={estilos.separador} role="presentation" />
  }
  return <hr className={estilos.separador} />
}
