import { ListaDeContatos } from '@/componentes/padroes/ListaDeContatos'
import { QuadroDoEmail } from '@/componentes/padroes/QuadroDoEmail'
import { QuadroDoInstagram } from '@/componentes/padroes/QuadroDoInstagram'
import { QuadroOndeEstamos } from '@/componentes/padroes/QuadroOndeEstamos'
import { TopoDoContato } from '@/features/contato/componentes/TopoDoContato'
import { CONTEUDO_DO_CONTATO } from '@/features/contato/conteudo'
import { montarMetadados } from '@/lib/utils/metadados'
import estilos from './page.module.css'

/*
 * A página Contato, endereço /contato.
 *
 * Com o site NAO publicado, o interruptor (src/proxy.ts) leva este endereço à
 * raiz, que mostra a página em construção. Esta página só aparece com o site
 * publicado: nas prévias da Vercel e, depois da lancamento-r1, em produção.
 *
 * A rota só compõe, na ordem de leitura: o topo e a lista dos três quadros de
 * contato. Sem o formulário do protótipo, que é da R4.
 *
 * A grade é desta rota, e não do bloco de contato (design.md da change
 * pagina-contato, D1 e D4): até 1024 px, uma coluna; acima, o topo à esquerda
 * e os quadros à direita, alinhados ao topo do título. É a melhoria aprovada
 * pelo Gabriel sobre o protótipo (Q3 (b), 23/11/2026; REFERENCIA-VISUAL.md,
 * seção 7). Na R4, o formulário traz de volta a composição do protótipo, e a
 * mudança é aqui; o bloco não muda.
 */
/* Título, descrição, canônico e Open Graph saem da entrada da página na lista
   única, por uma função só (PADROES-DE-CODIGO.md, seção 11). */
export const metadata = montarMetadados('/contato')

export default function PaginaContato() {
  const { topo } = CONTEUDO_DO_CONTATO

  return (
    <section className={estilos.secao} aria-labelledby="titulo-da-pagina">
      <div className={estilos.grade}>
        <TopoDoContato
          sobretitulo={topo.sobretitulo}
          titulo={topo.titulo}
          idDoTitulo="titulo-da-pagina"
        />
        <ListaDeContatos>
          <QuadroDoInstagram />
          <QuadroDoEmail />
          <QuadroOndeEstamos />
        </ListaDeContatos>
      </div>
    </section>
  )
}
