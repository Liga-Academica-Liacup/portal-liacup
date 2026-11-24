/*
 * O bloco de contato da página inicial, como no protótipo aprovado: numa seção
 * em superfície, o sobretítulo "Contato" e o título de seção à esquerda e, à
 * direita, os quadros do Instagram e do e-mail, cada um num cartão clicável em
 * toda a área (design.md da change inicio-completo, D5).
 *
 * Sem a frase e sem o botão "Mandar uma mensagem" do protótipo (Q4 (a) e Q5 (a)
 * do Gabriel, 23/11/2026), e sem o quadro "Onde estamos", que é da página
 * Contato.
 *
 * Os quadros são os mesmos da página Contato, de src/componentes/padroes, na
 * apresentação "cartao" (Q6 (a)): nenhum código copiado, e a página Contato,
 * que usa a apresentação "solto", não muda.
 *
 * O texto do topo chega por props: quem o lê de `conteudo.ts` é a rota da
 * inicial. Os dados dos canais moram em contato-da-liga.ts, ao lado dos quadros.
 *
 * Carregando, erro e vazio: não se aplicam. Os dados são fixos e os dois
 * quadros sempre existem; o teste de unidade da lista confere que são dois.
 */
import { ListaDeContatos } from '@/componentes/padroes/ListaDeContatos'
import { QuadroDoEmail } from '@/componentes/padroes/QuadroDoEmail'
import { QuadroDoInstagram } from '@/componentes/padroes/QuadroDoInstagram'
import { TituloDeSecao, type TextoDoTituloDeSecao } from '@/componentes/padroes/TituloDeSecao'
import estilos from './ContatoDaInicial.module.css'

type PropsDoContatoDaInicial = {
  titulo: TextoDoTituloDeSecao
}

const ID_DO_TITULO = 'titulo-do-contato-da-inicial'

export function ContatoDaInicial({ titulo }: PropsDoContatoDaInicial) {
  return (
    <section className={estilos.secao} aria-labelledby={ID_DO_TITULO}>
      <div className={estilos.grade}>
        <div>
          <TituloDeSecao titulo={titulo} id={ID_DO_TITULO} tamanho="grande" espacoAbaixo="nenhum" />
        </div>
        <ListaDeContatos>
          <QuadroDoInstagram apresentacao="cartao" />
          <QuadroDoEmail apresentacao="cartao" />
        </ListaDeContatos>
      </div>
    </section>
  )
}
