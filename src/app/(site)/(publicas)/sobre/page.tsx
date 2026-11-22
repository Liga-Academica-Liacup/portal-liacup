import { TituloDeSecao } from '@/componentes/padroes/TituloDeSecao'
import { ListaDeDocentes } from '@/features/equipe/componentes/ListaDeDocentes'
import { CONTEUDO_DA_EQUIPE } from '@/features/equipe/conteudo'
import { FaixaDoSobre } from '@/features/sobre/componentes/FaixaDoSobre'
import { HistoriaDaLiga } from '@/features/sobre/componentes/HistoriaDaLiga'
import { ObjetivosDaLiga } from '@/features/sobre/componentes/ObjetivosDaLiga'
import { CONTEUDO_DO_SOBRE } from '@/features/sobre/conteudo'
import { montarMetadados } from '@/lib/utils/metadados'
import estilos from './page.module.css'

/*
 * A página Sobre, endereço /sobre.
 *
 * Com o site NAO publicado, o interruptor (src/proxy.ts) leva este endereço à
 * raiz, que mostra a página em construção. Esta página só aparece com o site
 * publicado: nas prévias da Vercel e, depois da lancamento-r1, em produção.
 *
 * A rota só compõe, na ordem do protótipo: a faixa do topo, a história ao lado
 * do quadro da foto, o que a Liga se propõe a fazer e os docentes
 * orientadores. O texto mora em src/features/sobre/conteudo.ts; os docentes,
 * em src/features/equipe/conteudo.ts, porque a Equipe mostra os mesmos (Q5
 * (a)). As duas features não se importam uma da outra: quem as junta é esta
 * rota (PADROES-DE-CODIGO.md, seção 1).
 */
/* Título, descrição, canônico e Open Graph saem da entrada da página na lista
   única, por uma função só (PADROES-DE-CODIGO.md, seção 11). */
export const metadata = montarMetadados('/sobre')

export default function PaginaSobre() {
  const conteudo = CONTEUDO_DO_SOBRE
  const docentes = CONTEUDO_DA_EQUIPE.docentes

  return (
    <>
      <FaixaDoSobre titulo={conteudo.titulo} apresentacao={conteudo.apresentacao} />
      <HistoriaDaLiga titulo={conteudo.historia.secao} texto={conteudo.historia.texto} />
      <ObjetivosDaLiga titulo={conteudo.objetivos.secao} itens={conteudo.objetivos.itens} />

      {/* Sem docente, o bloco inteiro some, título incluído, como os outros
          blocos (PADROES-DE-CODIGO.md, 2.6). Hoje o caso é impossível. */}
      {docentes.length > 0 ? (
        <section className={estilos.secaoDosDocentes} aria-labelledby="titulo-dos-docentes">
          <div className={estilos.conteudo}>
            <TituloDeSecao
              titulo={conteudo.secaoDosDocentes}
              id="titulo-dos-docentes"
              tamanho="grande"
              espacoAbaixo="largo"
            />
            <ListaDeDocentes docentes={docentes} fundo="superficie" />
          </div>
        </section>
      ) : null}
    </>
  )
}
