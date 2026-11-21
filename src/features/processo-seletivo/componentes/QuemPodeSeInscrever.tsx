/*
 * "Quem pode se inscrever": o quadro do protótipo, com o texto de quem pode se
 * inscrever em parágrafo e, depois dele, os pré-requisitos em lista
 * (conteudo-institucional.md, seções 5.3 e 5.4). O texto vem antes porque o
 * primeiro pré-requisito fala das "faculdades supracitadas" (design.md, D4).
 *
 * As bolinhas verdes da lista são decorativas e não são anunciadas.
 */
import type { TituloDeSecao as Titulo } from '../tipos'
import estilos from './QuemPodeSeInscrever.module.css'
import { TituloDeSecao } from './TituloDeSecao'

type PropsDeQuemPodeSeInscrever = {
  titulo: Titulo
  texto: string
  preRequisitos: readonly string[]
}

export function QuemPodeSeInscrever({ titulo, texto, preRequisitos }: PropsDeQuemPodeSeInscrever) {
  return (
    <section aria-labelledby="titulo-dos-requisitos">
      <TituloDeSecao titulo={titulo} id="titulo-dos-requisitos" />
      <div className={estilos.quadro}>
        <p className={estilos.texto}>{texto}</p>
        {preRequisitos.length > 0 ? (
          <ul className={estilos.lista}>
            {preRequisitos.map((requisito) => (
              <li key={requisito} className={estilos.item}>
                {requisito}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
