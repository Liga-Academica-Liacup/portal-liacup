/*
 * O QUE É
 * Bloco que ocupa o lugar de uma lista quando não há o que mostrar. Cobre os
 * três estados que a seção 2.6 dos padrões exige de todo componente que exibe
 * dado: carregando, erro e vazio.
 *
 * QUANDO USAR
 * Sempre que uma lista puder vir vazia, falhar ou demorar. "Nenhuma notícia
 * publicada ainda" é resposta; tela em branco não é.
 *
 * QUANDO NÃO USAR
 * Como aviso geral da página. O `tom="alerta"` usa `role="alert"`, que
 * interrompe quem usa leitor de tela — reservado para erro de carregamento, não
 * para chamar atenção.
 *
 * FIDELIDADE
 * Não vem do liacup.css: nasceu na F00. Não tem classe de origem para comparar
 * e por isso não aparece no FIDELIDADE.md.
 */
import type { ReactNode } from 'react'
import estilos from './EstadoVazio.module.css'

type PropsDoEstadoVazio = {
  /** Titulo curto do estado, ex.: "Nada por aqui ainda". */
  titulo: string
  /** Explicacao opcional do que fazer a seguir. */
  descricao?: string
  /** Acao opcional, ex.: um botao para tentar de novo. */
  acao?: ReactNode
  /** Papel semantico: `status` para vazio/carregando, `alert` para erro. */
  tom?: 'status' | 'alerta'
}

export function EstadoVazio({ titulo, descricao, acao, tom = 'status' }: PropsDoEstadoVazio) {
  return (
    <div
      className={estilos.caixa}
      role={tom === 'alerta' ? 'alert' : 'status'}
      aria-live={tom === 'alerta' ? 'assertive' : 'polite'}
    >
      <p className={estilos.titulo}>{titulo}</p>
      {descricao ? <p className={estilos.descricao}>{descricao}</p> : null}
      {acao}
    </div>
  )
}
