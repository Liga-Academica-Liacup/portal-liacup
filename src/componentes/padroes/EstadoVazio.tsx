/*
 * Exemplo de composicao reutilizavel (componentes/padroes).
 *
 * Existe porque a secao 2.6 dos padroes de codigo exige que todo componente que
 * mostra dado trate carregando, erro e vazio — com texto em portugues que ajude
 * quem esta do outro lado. "Nenhuma noticia publicada ainda" e resposta; tela em
 * branco nao e.
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
