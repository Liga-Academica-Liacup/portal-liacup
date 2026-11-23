/*
 * A faixa clara do topo da página Projetos, como no protótipo: o sobretítulo
 * "Projetos" e o título principal "Ensino, Extensão, Pesquisa e Secretaria",
 * sem a frase de baixo do protótipo, que prometia um painel que ainda não
 * existe (Q2 (a) do Gabriel, 23/11/2026).
 *
 * Tem a forma e os tokens da faixa da Equipe, e não a importa: uma feature não
 * importa de outra (PADROES-DE-CODIGO.md, 1). As duas faixas iguais ficam
 * registradas como dívida, para uma change que as una (design.md da change, D1).
 */
import estilos from './FaixaDeProjetos.module.css'

type PropsDaFaixaDeProjetos = {
  sobretitulo: string
  titulo: string
}

export function FaixaDeProjetos({ sobretitulo, titulo }: PropsDaFaixaDeProjetos) {
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
