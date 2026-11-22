/*
 * A faixa roxa do topo da página Sobre, como no protótipo: o título principal
 * e, abaixo, a apresentação da seção 2.1 do documento (Q2 (b) do Gabriel,
 * 22/11/2026). Sem sobretítulo, sem "A borboleta não é enfeite" e sem a frase
 * da metamorfose, que eram do protótipo e não vão ao ar.
 *
 * A borboleta do canto é decorativa: escondida do leitor de tela, e nunca por
 * cima do texto (REFERENCIA-VISUAL.md, seção 4).
 */
import { BorboletaDaLiga } from '@/componentes/ui/BorboletaDaLiga'
import estilos from './FaixaDoSobre.module.css'

type PropsDaFaixaDoSobre = {
  titulo: string
  apresentacao: string
}

export function FaixaDoSobre({ titulo, apresentacao }: PropsDaFaixaDoSobre) {
  return (
    <section className={estilos.faixa} aria-labelledby="titulo-da-pagina">
      <BorboletaDaLiga className={estilos.borboleta} />
      <div className={estilos.conteudo}>
        <h1 id="titulo-da-pagina" className={estilos.titulo}>
          {titulo}
        </h1>
        <p className={estilos.apresentacao}>{apresentacao}</p>
      </div>
    </section>
  )
}
