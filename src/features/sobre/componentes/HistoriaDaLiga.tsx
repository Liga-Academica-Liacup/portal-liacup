/*
 * "Como a Liga começou": a história da seção 2.2 do documento, ao lado do
 * quadro da foto no desktop e acima dele no celular, como no protótipo.
 *
 * Sem o cartão tracejado "Pendente" do protótipo: o texto chegou, e vai num
 * parágrafo. O quadro fica sem foto, com a borboleta da liga, como o hero da
 * inicial (REFERENCIA-VISUAL.md, seção 7), e é decorativo.
 */
import { QuadroSemFoto } from '@/componentes/padroes/QuadroSemFoto'
import { TituloDeSecao, type TextoDoTituloDeSecao } from '@/componentes/padroes/TituloDeSecao'
import estilos from './HistoriaDaLiga.module.css'

type PropsDaHistoriaDaLiga = {
  titulo: TextoDoTituloDeSecao
  texto: string
}

export function HistoriaDaLiga({ titulo, texto }: PropsDaHistoriaDaLiga) {
  return (
    <section className={estilos.secao} aria-labelledby="titulo-da-historia">
      <div className={estilos.grade}>
        <div>
          <TituloDeSecao
            titulo={titulo}
            id="titulo-da-historia"
            tamanho="grande"
            espacoAbaixo="curto"
          />
          <p className={estilos.texto}>{texto}</p>
        </div>
        <QuadroSemFoto className={estilos.quadro} />
      </div>
    </section>
  )
}
