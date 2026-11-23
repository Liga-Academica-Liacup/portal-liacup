/*
 * O topo da página Contato, como no protótipo: o sobretítulo "Contato" e o
 * título principal "Fale com a Liga", no fundo da página, sem faixa de outra
 * cor e sem a frase de baixo do protótipo (Q1 (a) do Gabriel, 23/11/2026).
 *
 * Tem a forma do topo das faixas da Equipe e de Projetos, e não as importa:
 * uma feature não importa de outra (PADROES-DE-CODIGO.md, 1). O título aqui
 * tem tamanho próprio no protótipo, e o espaço em volta é da rota, que é dona
 * da grade (design.md da change, D1 e D4).
 */
import estilos from './TopoDoContato.module.css'

type PropsDoTopoDoContato = {
  sobretitulo: string
  titulo: string
  /** O id do título, para a seção da página se nomear por ele. */
  idDoTitulo: string
}

export function TopoDoContato({ sobretitulo, titulo, idDoTitulo }: PropsDoTopoDoContato) {
  return (
    <div>
      <p className={estilos.sobretitulo}>{sobretitulo}</p>
      <h1 id={idDoTitulo} className={estilos.titulo}>
        {titulo}
      </h1>
    </div>
  )
}
