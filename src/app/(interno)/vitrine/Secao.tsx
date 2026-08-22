/*
 * Moldura de cada bloco da vitrine. Existe só para dar título e espaçamento
 * consistentes, e para manter a hierarquia de cabeçalhos correta: <h1> único na
 * página e um <h2> por componente, sem pular nível.
 */
import type { ReactNode } from 'react'
import estilos from './page.module.css'

export function Secao({
  titulo,
  descricao,
  children,
}: {
  titulo: string
  descricao?: string
  children: ReactNode
}) {
  return (
    <section className={estilos.secao}>
      <h2 className={estilos.tituloSecao}>{titulo}</h2>
      {descricao ? <p className={estilos.descricaoSecao}>{descricao}</p> : null}
      <div className={estilos.amostras}>{children}</div>
    </section>
  )
}

/** Um exemplo isolado, com legenda dizendo o que está sendo mostrado. */
export function Amostra({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <figure className={estilos.amostra}>
      <div className={estilos.palco}>{children}</div>
      <figcaption className={estilos.legenda}>{rotulo}</figcaption>
    </figure>
  )
}
