import Image from 'next/image'
import { LinksDeContato } from '@/componentes/layout/LinksDeContato'
import { Rodape } from '@/componentes/layout/Rodape'
import estilos from './PaginaEmConstrucao.module.css'

/*
 * Pagina provisoria (FR-004): logo, frase, nome da liga e canais de contato.
 *
 * Mora aqui, num lugar so, porque duas rotas a desenham: a raiz e o endereco
 * proprio /em-construcao. Quem decide qual das duas o visitante ve e o
 * interruptor em src/proxy.ts. Este componente nao conhece rota nem variavel.
 *
 * A logo servida aqui e a variante de 256px (78 KB), nao o arquivo original de
 * 749 KB — que reprovaria o LCP e criaria pressao para baixar o limiar do
 * Lighthouse. O limiar nao desce.
 */
export function PaginaEmConstrucao() {
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
