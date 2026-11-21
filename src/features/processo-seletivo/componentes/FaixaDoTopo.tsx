/*
 * A faixa roxa do topo da página do processo seletivo, como no protótipo: o
 * selo, o título principal, a apresentação e, no lugar dos botões "Fazer
 * inscrição" e "Baixar o edital", o aviso de inscrições fechadas
 * (conteudo-institucional.md, seção 5.1; Q1 (b) e Q2 (a) do Gabriel).
 *
 * Todo texto chega por props, do conteudo.ts. O círculo lilás do canto é
 * decorativo e fica atrás do texto.
 *
 * O link do aviso abre o Instagram em nova aba, sem dar à página aberta acesso
 * a esta (noopener) nem o endereço de origem (noreferrer). O nome acessível
 * diz o destino e contém o texto visível, "@liacup.unb".
 */
import type { SituacaoDasInscricoes, TextoComLink } from '../tipos'
import estilos from './FaixaDoTopo.module.css'

type PropsDaFaixaDoTopo = {
  titulo: string
  apresentacao: string
  inscricoes: SituacaoDasInscricoes
}

function Aviso({ aviso }: { aviso: TextoComLink }) {
  return (
    <p className={estilos.aviso}>
      {aviso.antesDoLink}
      <a
        className={estilos.link}
        href={aviso.endereco}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={aviso.nomeAcessivelDoLink}
      >
        {aviso.textoDoLink}
      </a>
      {aviso.depoisDoLink}
    </p>
  )
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
        <Aviso aviso={inscricoes.aviso} />
      </div>
    </section>
  )
}
