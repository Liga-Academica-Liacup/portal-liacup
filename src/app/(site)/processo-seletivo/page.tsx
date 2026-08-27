import estilos from '../pagina-em-construcao.module.css'

/*
 * Processo seletivo — rota entregue pela F03 SEM conteudo, de proposito.
 *
 * A F03 entrega a moldura das dez paginas publicas; o conteudo desta e de uma
 * feature posterior (F04 a F13). A rota existe agora porque o catalogo de
 * destinos a lista, e destino que a navegacao mostra precisa responder — link
 * quebrado no ar e pior que pagina declarada incompleta.
 *
 * O aviso e visivel para quem visita, e isso e regra: o Principio 6 manda
 * marcar o espaco reservado, e o Principio 8 manda declarar o incompleto.
 * NENHUMA frase institucional, numero ou nome de pessoa entra aqui antes da
 * feature dona — texto inventado que parece verdadeiro, num site sobre cuidados
 * paliativos, e pior que espaco em branco.
 */
export default function Pagina() {
  return (
    <div className={estilos.pagina}>
      <h1 className={estilos.titulo}>Processo seletivo</h1>
      <p className={estilos.aviso}>Página em construção</p>
    </div>
  )
}
