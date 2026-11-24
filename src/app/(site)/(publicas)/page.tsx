import { ContatoDaInicial } from '@/features/contato/componentes/ContatoDaInicial'
import { CONTEUDO_DO_CONTATO } from '@/features/contato/conteudo'
import { NumerosDaLiga } from '@/features/numeros-da-liga/componentes/NumerosDaLiga'
import { NUMEROS_DA_LIGA } from '@/features/numeros-da-liga/conteudo'
import { FaixaDaInicial } from '@/features/processo-seletivo/componentes/FaixaDaInicial'
import { CONTEUDO_DO_PROCESSO_SELETIVO } from '@/features/processo-seletivo/conteudo'
import { montarMetadados } from '@/lib/utils/metadados'
import { HeroDaInicial } from './_inicio/HeroDaInicial'

/*
 * A página inicial, endereço /.
 *
 * Com o site NAO publicado, o interruptor (src/proxy.ts) nem chega aqui: ele
 * serve /em-construcao no lugar, sem mudar o endereço. Por isso esta página só
 * aparece com o site publicado: nas prévias da Vercel e, depois da
 * lancamento-r1, em produção.
 *
 * A rota só compõe, na ordem de leitura do protótipo, sem os blocos que a R1
 * não tem (agenda, notícias e conteúdo educativo, da R2 e da R5): o hero, os
 * números, a faixa do processo seletivo e o contato (design.md da change
 * inicio-completo, D1 e D6). Cada bloco mora na feature do seu domínio, e a
 * rota lê os dados e os passa por props: uma feature não importa de outra.
 *
 * A faixa lê o mesmo CONTEUDO_DO_PROCESSO_SELETIVO da página
 * /processo-seletivo, e não uma cópia: as duas nunca se contradizem.
 */
/* Título, descrição, canônico e Open Graph saem da entrada da página na lista
   única, por uma função só (PADROES-DE-CODIGO.md, seção 11). */
export const metadata = montarMetadados('/')

export default function PaginaInicial() {
  return (
    <>
      <HeroDaInicial />
      <NumerosDaLiga numeros={NUMEROS_DA_LIGA} />
      <FaixaDaInicial
        titulo={CONTEUDO_DO_PROCESSO_SELETIVO.titulo}
        inscricoes={CONTEUDO_DO_PROCESSO_SELETIVO.inscricoes}
        rotuloDoBotao={CONTEUDO_DO_PROCESSO_SELETIVO.chamadaDaInicial.rotuloDoBotao}
      />
      <ContatoDaInicial titulo={CONTEUDO_DO_CONTATO.blocoDaInicial} />
    </>
  )
}
