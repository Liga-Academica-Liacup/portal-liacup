/*
 * Canais de contato da liga. E o unico lugar da tela onde eles aparecem: o
 * rodape traz so a linha institucional, para o mesmo e-mail nao ficar repetido
 * duas vezes na mesma pagina.
 *
 * Os dados sao os confirmados em docs/conteudo-institucional.md, secao 7:
 * e-mail liacup.unb@gmail.com e Instagram @liacup.unb.
 */
import { Icone } from '@/componentes/ui/Icone'
import estilos from './LinksDeContato.module.css'

export function LinksDeContato() {
  return (
    <nav className={estilos.linksDeContato} aria-label="Canais de contato da LIACUP">
      <a
        className={estilos.link}
        href="https://www.instagram.com/liacup.unb/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icone nome="instagram" />
        <span>@liacup.unb</span>
      </a>
      <a className={estilos.link} href="mailto:liacup.unb@gmail.com">
        <Icone nome="email" />
        <span>liacup.unb@gmail.com</span>
      </a>
    </nav>
  )
}
