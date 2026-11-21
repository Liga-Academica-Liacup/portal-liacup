import { Etapas } from '@/features/processo-seletivo/componentes/Etapas'
import { FaixaDoTopo } from '@/features/processo-seletivo/componentes/FaixaDoTopo'
import { PerguntasFrequentes } from '@/features/processo-seletivo/componentes/PerguntasFrequentes'
import { QuemPodeSeInscrever } from '@/features/processo-seletivo/componentes/QuemPodeSeInscrever'
import { CONTEUDO_DO_PROCESSO_SELETIVO } from '@/features/processo-seletivo/conteudo'
import { montarMetadados } from '@/lib/utils/metadados'
import estilos from './page.module.css'

/*
 * A página do processo seletivo, endereço /processo-seletivo.
 *
 * Com o site NAO publicado, o interruptor (src/proxy.ts) leva este endereço à
 * raiz, que mostra a página em construção. Esta página só aparece com o site
 * publicado: nas prévias da Vercel e, depois da lancamento-r1, em produção.
 *
 * A rota só compõe, na ordem do protótipo: a faixa do topo, as etapas e o
 * quadro de quem pode se inscrever (lado a lado no desktop, um abaixo do outro
 * no celular) e as perguntas frequentes. O texto mora em
 * src/features/processo-seletivo/conteudo.ts, e nenhum componente o guarda.
 */
/* Título, descrição, canônico e Open Graph saem da entrada da página na lista
   única, por uma função só (PADROES-DE-CODIGO.md, seção 11). */
export const metadata = montarMetadados('/processo-seletivo')

export default function PaginaDoProcessoSeletivo() {
  const conteudo = CONTEUDO_DO_PROCESSO_SELETIVO

  return (
    <>
      <FaixaDoTopo
        titulo={conteudo.titulo}
        apresentacao={conteudo.apresentacao}
        inscricoes={conteudo.inscricoes}
      />

      <div className={estilos.secaoDasColunas}>
        <div className={estilos.colunas}>
          <Etapas titulo={conteudo.secoes.etapas} etapas={conteudo.etapas} />
          <QuemPodeSeInscrever
            titulo={conteudo.secoes.requisitos}
            itens={conteudo.quemPodeSeInscrever}
          />
        </div>
      </div>

      <PerguntasFrequentes titulo={conteudo.secoes.perguntas} perguntas={conteudo.perguntas} />
    </>
  )
}
