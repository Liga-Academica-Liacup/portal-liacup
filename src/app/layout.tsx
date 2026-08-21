import type { Metadata } from 'next'
import { Caprasimo, Figtree } from 'next/font/google'
import '@/estilos/global.css'

/*
 * As fontes sao baixadas em tempo de build e servidas pelo proprio dominio.
 * Nenhuma requisicao ao Google acontece quando alguem abre a pagina — que e
 * o que o ADR-0003, secao 3, decide: num site sobre cuidados paliativos, o
 * endereco de IP de quem visita nao vai para terceiro sem necessidade.
 */
const fonteTitulo = Caprasimo({
  subsets: ['latin'],
  weight: '400',
  variable: '--fonte-titulo',
  display: 'swap',
})


export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fonteTitulo.variable} ${fonteCorpo.variable}`}>
      <body>{children}</body>
    </html>
  )
}
