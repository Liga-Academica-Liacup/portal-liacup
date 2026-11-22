/*
 * A faixa clara do topo da página Equipe, como no protótipo: o sobretítulo
 * "Equipe" e o título principal "Quem faz a LIACUP", sem a frase "Gestão
 * 2026: …", que era do protótipo e não vai ao ar (Q2 (b) do Gabriel,
 * 22/11/2026).
 */
import estilos from './FaixaDaEquipe.module.css'

type PropsDaFaixaDaEquipe = {
  sobretitulo: string
  titulo: string
}

export function FaixaDaEquipe({ sobretitulo, titulo }: PropsDaFaixaDaEquipe) {
  return (
    <section className={estilos.faixa} aria-labelledby="titulo-da-pagina">
      <div className={estilos.conteudo}>
        <p className={estilos.sobretitulo}>{sobretitulo}</p>
        <h1 id="titulo-da-pagina" className={estilos.titulo}>
          {titulo}
        </h1>
      </div>
    </section>
  )
}
