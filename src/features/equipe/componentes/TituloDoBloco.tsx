/*
 * O título de um bloco da página Equipe ("Diretoria", "Fundadores
 * discentes", "Docentes orientadores"): um <h2> sem sobretítulo, como no
 * protótipo. O `id` serve para a seção se nomear pelo título, com
 * aria-labelledby.
 */
import estilos from './TituloDoBloco.module.css'

type PropsDoTituloDoBloco = {
  id: string
  children: string
}

export function TituloDoBloco({ id, children }: PropsDoTituloDoBloco) {
  return (
    <h2 id={id} className={estilos.titulo}>
      {children}
    </h2>
  )
}
