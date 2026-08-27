import Image from 'next/image'
import estilos from './page.module.css'

/*
 * Início — conteúdo provisório.
 *
 * A F03 entrega a moldura, não o conteúdo. A página inicial de verdade — hero,
 * indicadores, agenda, notícias, chamadas — é a F04.
 *
 * O cabeçalho, o rodapé e os canais de contato saíram daqui: agora vêm do
 * layout do grupo `(site)` e são os mesmos nas dez páginas (FR-001). Antes da
 * F03 esta página os renderizava por conta própria, porque era a única que
 * existia.
 *
 * A logo servida aqui é a variante de 256 px (78 KB), não o arquivo original de
 * 749 KB — que reprovaria o LCP e criaria pressão para baixar o limiar do
 * Lighthouse. O limiar não desce.
 */
export default function PaginaInicial() {
  return (
    <div className={estilos.principal}>
      <Image
        src="/logo-liacup-256.png"
        alt="Logo da LIACUP"
        width={180}
        height={180}
        priority
        className={estilos.logo}
      />
      <h1 className={estilos.titulo}>Portal em construção</h1>
      <p className={estilos.subtitulo}>Liga Acadêmica Multiprofissional de Cuidados Paliativos</p>
    </div>
  )
}
