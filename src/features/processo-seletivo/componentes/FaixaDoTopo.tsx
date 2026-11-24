/*
 * A faixa roxa do topo da página do processo seletivo, como no protótipo: o
 * selo, o título principal, a apresentação e, no lugar dos botões "Fazer
 * inscrição" e "Baixar o edital", o aviso de inscrições fechadas
 * (conteudo-institucional.md, seção 5.1; Q1 (b) e Q2 (a) do Gabriel).
 *
 * Todo texto chega por props, do conteudo.ts. O círculo lilás do canto é
 * decorativo e fica atrás do texto.
 *
 * O aviso, com o link do Instagram, é o AvisoComLink, o mesmo da faixa da
 * página inicial; as cores e os estados do link ficam aqui.
 */
import type { SituacaoDasInscricoes } from '../tipos'
import { AvisoComLink } from './AvisoComLink'
import estilos from './FaixaDoTopo.module.css'

type PropsDaFaixaDoTopo = {
  titulo: string
  apresentacao: string
  inscricoes: SituacaoDasInscricoes
}

export function FaixaDoTopo({ titulo, apresentacao, inscricoes }: PropsDaFaixaDoTopo) {
  return (
    <section className={estilos.faixa} aria-labelledby="titulo-da-pagina">
      <div className={estilos.circulo} aria-hidden="true" />
      <div className={estilos.conteudo}>
        <p className={estilos.selo}>{inscricoes.selo}</p>
        <h1 id="titulo-da-pagina" className={estilos.titulo}>
          {titulo}
        </h1>
        <p className={estilos.apresentacao}>{apresentacao}</p>
        {/* Hoje o único estado é 'fechado' (Q2 (a)). O estado aberto, quando
            entrar, acrescenta aqui os botões de inscrição e do edital. */}
        <AvisoComLink
          aviso={inscricoes.aviso}
          classes={{ paragrafo: estilos.aviso, link: estilos.link }}
        />
      </div>
    </section>
  )
}
