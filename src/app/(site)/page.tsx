import Image from 'next/image'
import { LinksDeContato } from '@/componentes/layout/LinksDeContato'
import { Rodape } from '@/componentes/layout/Rodape'
import estilos from './page.module.css'

/*
 * Pagina provisoria (FR-004).
 *
 * Existe so para provar que o caminho do codigo ate o ar funciona. Nao e o site:
 * as paginas reais entram na Fase 1 do plano de desenvolvimento.
 *
 * A logo servida aqui e a variante de 256px (78 KB), nao o arquivo original de
 * 749 KB — que reprovaria o LCP e criaria pressao para baixar o limiar do
 * Lighthouse. O limiar nao desce.
 */
export default function PaginaInicial() {
  return (
    <>
      <main className={estilos.principal}>
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
        <LinksDeContato />
      </main>
      <Rodape />
    </>
  )
}
