import { CartoesDaDiretoria } from '@/features/equipe/componentes/CartoesDaDiretoria'
import { FaixaDaEquipe } from '@/features/equipe/componentes/FaixaDaEquipe'
import { FundadoresDiscentes } from '@/features/equipe/componentes/FundadoresDiscentes'
import { ListaDeDocentes } from '@/features/equipe/componentes/ListaDeDocentes'
import { TituloDoBloco } from '@/features/equipe/componentes/TituloDoBloco'
import { CONTEUDO_DA_EQUIPE } from '@/features/equipe/conteudo'
import { montarMetadados } from '@/lib/utils/metadados'
import estilos from './page.module.css'

/*
 * A página Equipe, endereço /equipe.
 *
 * Com o site NAO publicado, o interruptor (src/proxy.ts) leva este endereço à
 * raiz, que mostra a página em construção. Esta página só aparece com o site
 * publicado: nas prévias da Vercel e, depois da lancamento-r1, em produção.
 *
 * A rota só compõe, na ordem do protótipo: a faixa do topo, a diretoria e, na
 * faixa de superfície, os fundadores discentes (no lugar do bloco "Ligantes",
 * Q8 (a)) e os docentes orientadores. O texto mora em
 * src/features/equipe/conteudo.ts, e nenhum componente o guarda.
 */
/* Título, descrição, canônico e Open Graph saem da entrada da página na lista
   única, por uma função só (PADROES-DE-CODIGO.md, seção 11). */
export const metadata = montarMetadados('/equipe')

export default function PaginaEquipe() {
  const conteudo = CONTEUDO_DA_EQUIPE

  return (
    <>
      <FaixaDaEquipe sobretitulo={conteudo.faixa.sobretitulo} titulo={conteudo.faixa.titulo} />
      <CartoesDaDiretoria titulo={conteudo.titulos.diretoria} cargos={conteudo.cargos} />

      <div className={estilos.faixaDeSuperficie}>
        <div className={estilos.conteudo}>
          <FundadoresDiscentes
            titulo={conteudo.titulos.fundadores}
            fundadores={conteudo.fundadores}
          />
          {/* Sem docente, o bloco inteiro some, título incluído, como os outros
              blocos (PADROES-DE-CODIGO.md, 2.6). Hoje o caso é impossível. */}
          {conteudo.docentes.length > 0 ? (
            <section aria-labelledby="titulo-dos-docentes">
              <TituloDoBloco id="titulo-dos-docentes">{conteudo.titulos.docentes}</TituloDoBloco>
              <ListaDeDocentes docentes={conteudo.docentes} fundo="creme" />
            </section>
          ) : null}
        </div>
      </div>
    </>
  )
}
