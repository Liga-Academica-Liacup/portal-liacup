import { FaixaDeProjetos } from '@/features/projetos/componentes/FaixaDeProjetos'
import { GradeDeFrentes } from '@/features/projetos/componentes/GradeDeFrentes'
import { CONTEUDO_DE_PROJETOS } from '@/features/projetos/conteudo'
import { montarMetadados } from '@/lib/utils/metadados'

/*
 * A página Projetos, endereço /projetos.
 *
 * Com o site NAO publicado, o interruptor (src/proxy.ts) leva este endereço à
 * raiz, que mostra a página em construção. Esta página só aparece com o site
 * publicado: nas prévias da Vercel e, depois da lancamento-r1, em produção.
 *
 * A rota só compõe, na ordem do protótipo: a faixa do topo e a grade das quatro
 * frentes de trabalho. O texto mora em src/features/projetos/conteudo.ts, e
 * nenhum componente o guarda.
 */
/* Título, descrição, canônico e Open Graph saem da entrada da página na lista
   única, por uma função só (PADROES-DE-CODIGO.md, seção 11). */
export const metadata = montarMetadados('/projetos')

export default function PaginaProjetos() {
  const conteudo = CONTEUDO_DE_PROJETOS

  return (
    <>
      <FaixaDeProjetos sobretitulo={conteudo.faixa.sobretitulo} titulo={conteudo.faixa.titulo} />
      <GradeDeFrentes frentes={conteudo.frentes} />
    </>
  )
}
