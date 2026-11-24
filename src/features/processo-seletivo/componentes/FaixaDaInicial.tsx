/*
 * A faixa do processo seletivo da página inicial, como o cartão lilás do
 * protótipo: o selo, o título de seção, o aviso e o botão que leva a
 * /processo-seletivo (design.md da change inicio-completo, D1 e D4).
 *
 * Todo texto chega por props, do mesmo CONTEUDO_DO_PROCESSO_SELETIVO que a
 * página /processo-seletivo usa: a faixa e a página nunca se contradizem.
 * Nada do texto de exemplo do protótipo ("2026.2", datas, "Ver o edital").
 *
 * Mora nesta feature, e não na rota, porque trata o estado das inscrições:
 * quando o estado aberto entrar na união SituacaoDasInscricoes, o TypeScript
 * aponta este componente junto com a FaixaDoTopo.
 *
 * O botão só aparece se /processo-seletivo estiver na lista única de páginas
 * públicas, como os do hero. Ele é um link com a aparência "claro" do contrato
 * do botão (Q9 (a)), e não a primária, que tem a cor do cartão (Q7 (a)).
 *
 * Carregando, erro e vazio: não se aplicam. O conteúdo é fixo, e o
 * conteudo.test.ts confere que o selo, o aviso e o rótulo não estão vazios.
 */
import Link from 'next/link'
import { aparenciaDeBotao } from '@/componentes/ui/aparencia-de-botao'
import { estaNaLista } from '@/lib/utils/paginas-publicas'
import type { SituacaoDasInscricoes } from '../tipos'
import { AvisoComLink } from './AvisoComLink'
import estilos from './FaixaDaInicial.module.css'

const ENDERECO_DA_PAGINA = '/processo-seletivo'
const ID_DO_TITULO = 'titulo-da-faixa-do-processo-seletivo'

type PropsDaFaixaDaInicial = {
  titulo: string
  inscricoes: SituacaoDasInscricoes
  rotuloDoBotao: string
}

/* O selo vem antes do título, e o aviso, depois; os dois dependem do estado. */
function Inscricoes({ inscricoes, titulo }: Omit<PropsDaFaixaDaInicial, 'rotuloDoBotao'>) {
  switch (inscricoes.estado) {
    case 'fechado':
      return (
        <>
          <p className={estilos.selo}>{inscricoes.selo}</p>
          <h2 id={ID_DO_TITULO} className={estilos.titulo}>
            {titulo}
          </h2>
          <AvisoComLink
            aviso={inscricoes.aviso}
            classes={{ paragrafo: estilos.aviso, link: estilos.link }}
          />
        </>
      )
    default: {
      // Estado novo na união sem tratamento aqui: o TypeScript recusa.
      const estadoNaoTratado: never = inscricoes.estado
      return estadoNaoTratado
    }
  }
}

export function FaixaDaInicial({ titulo, inscricoes, rotuloDoBotao }: PropsDaFaixaDaInicial) {
  return (
    <section className={estilos.secao} aria-labelledby={ID_DO_TITULO}>
      <div className={estilos.cartao}>
        <div className={estilos.circulo} aria-hidden="true" />
        <div className={estilos.texto}>
          <Inscricoes inscricoes={inscricoes} titulo={titulo} />
        </div>
        {estaNaLista(ENDERECO_DA_PAGINA) ? (
          <Link
            href={ENDERECO_DA_PAGINA}
            className={`${aparenciaDeBotao('claro')} ${estilos.botao}`}
          >
            {rotuloDoBotao}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
