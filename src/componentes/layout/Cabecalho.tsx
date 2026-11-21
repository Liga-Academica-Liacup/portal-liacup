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
import { aparenciaDeBotao } from '@/componentes/ui/aparencia-de-botao'
import estilos from './Cabecalho.module.css'
import { LinkDaNavegacao } from './LinkDaNavegacao'
import { MenuLateral } from './MenuLateral'

/* O que a marca mostra: a sigla e, acima de 1024 px, também o nome da liga. */
const SIGLA = 'LIACUP'
const NOME_DA_LIGA = 'Liga Acadêmica Multiprofissional de Cuidados Paliativos · UnB'

/** O fim do nome acessível da marca, só para leitor de tela: o nome não diz o destino. */
const DESTINO_DA_MARCA = ', página inicial'

export function Cabecalho() {
  const paginas = paginasDoMenu()
  const destaque = paginaDeDestaque()

  return (
    <header className={estilos.cabecalho}>
      <div className={estilos.linha}>
        {/* O nome acessível começa pelo que a marca mostra, sem aria-label:
            "LIACUP" e, acima de 1024 px, também o nome da liga, que só então
            aparece. No fim, ", página inicial", porque o nome sozinho não diz
            o destino. Assim quem fala o nome com controle por voz acha o link
            pelo que está escrito (WCAG 2.5.3).
            O nome inteiro mora num trecho só para leitor de tela, na caixa de
            1 px da técnica C7 (Q10 (a) do Gabriel, 21/11/2026), e o texto da
            tela fica fora da árvore de acessibilidade, para não ser lido duas
            vezes. Com só o ", página inicial" na caixa e o resto vindo da
            tela, o navegador separa a caixa com um espaço, e o nome saía
            "LIACUP , página inicial" (medido no Chromium, rodada 3). As mesmas
            constantes desenham a tela e o nome, para os dois não se
            separarem. Há um trecho por lado do ponto de troca, e só um
            aparece por largura. */}
        <Link href="/" className={estilos.marca}>
          {/* alt vazio: o nome "LIACUP", ao lado, já diz o que a logo diz. */}
          <Image
            src="/logo-liacup-256.png"
            alt=""
            width={46}
            height={46}
            priority
            className={estilos.logo}
          />
          <span className={estilos.nomes} aria-hidden="true">
            <span className={estilos.sigla}>{SIGLA}</span>
            {/* O espaço do começo separa "LIACUP" do nome no texto copiado da
                tela; no começo da linha, ele não aparece. */}
            <span className={estilos.nomeDaLiga}> {NOME_DA_LIGA}</span>
          </span>
          <span className={`${estilos.soParaLeitorDeTela} ${estilos.nomeAteOPontoDeTroca}`}>
            {SIGLA + DESTINO_DA_MARCA}
          </span>
          <span className={`${estilos.soParaLeitorDeTela} ${estilos.nomeAcimaDoPontoDeTroca}`}>
            {`${SIGLA} ${NOME_DA_LIGA}${DESTINO_DA_MARCA}`}
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
