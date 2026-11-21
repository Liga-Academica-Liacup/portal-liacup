/*
 * O cabeçalho de toda página pública, como no protótipo aprovado.
 *
 * Desktop (acima de 1024 px): logo, "LIACUP", o nome da liga com "· UnB", o
 * botão de destaque e os links do menu em linha. Celular e tablet (até
 * 1024 px): logo, "LIACUP", o botão de destaque e o botão que abre o menu
 * lateral. O ponto de troca é o do protótipo, medido nele: o botão de menu
 * aparece em 1024 px e some em 1025 px.
 *
 * Tudo o que aparece vem da lista única de páginas públicas
 * (src/lib/utils/paginas-publicas.json). Sem o botão "Painel" do protótipo: o
 * painel é da R3 (REFERENCIA-VISUAL.md, seção 4). O botão de destaque só
 * aparece quando uma página da lista está marcada como destaque.
 *
 * Server Component. As únicas ilhas cliente são o MenuLateral e o
 * LinkDaNavegacao, que precisam do navegador.
 */
import Image from 'next/image'
import Link from 'next/link'
import { paginaDeDestaque, paginasDoMenu } from '@/lib/utils/paginas-publicas'
import { aparenciaDeBotao } from './aparencia-de-botao'
import estilos from './Cabecalho.module.css'
import { LinkDaNavegacao } from './LinkDaNavegacao'
import { MenuLateral } from './MenuLateral'

export function Cabecalho() {
  const paginas = paginasDoMenu()
  const destaque = paginaDeDestaque()

  return (
    <header className={estilos.cabecalho}>
      <div className={estilos.linha}>
        {/* O nome acessível diz o destino: no celular só "LIACUP" aparece, e ele
            sozinho não diz que o link leva à página inicial. Começa pelo texto
            visível, para quem fala o nome com controle por voz. */}
        <Link href="/" className={estilos.marca} aria-label="LIACUP, página inicial">
          {/* alt vazio: o nome "LIACUP", ao lado, já diz o que a logo diz. */}
          <Image
            src="/logo-liacup-256.png"
            alt=""
            width={46}
            height={46}
            priority
            className={estilos.logo}
          />
          <span className={estilos.nomes}>
            <span className={estilos.sigla}>LIACUP</span>
            <span className={estilos.nomeDaLiga}>
              Liga Acadêmica Multiprofissional de Cuidados Paliativos · UnB
            </span>
          </span>
        </Link>

        {destaque ? (
          <LinkDaNavegacao
            endereco={destaque.endereco}
            className={`${aparenciaDeBotao('primario')} ${estilos.destaque}`}
          >
            {destaque.rotulo}
          </LinkDaNavegacao>
        ) : null}

        <MenuLateral paginas={paginas} destaque={destaque} />
      </div>

      <nav className={estilos.navegacao} aria-label="Navegação principal">
        <ul className={estilos.lista}>
          {paginas.map((pagina) => (
            <li key={pagina.endereco}>
              <LinkDaNavegacao endereco={pagina.endereco} className={estilos.destino}>
                <span className={estilos.rotuloDoDestino}>{pagina.rotulo}</span>
              </LinkDaNavegacao>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
