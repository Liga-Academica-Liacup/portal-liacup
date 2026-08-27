/*
 * Canais de contato da liga.
 *
 * ONDE ELE MORA, E POR QUE ISSO MUDOU NA F03
 * Até a F02 ele era renderizado solto no `<main>` da página provisória, e o
 * comentário aqui dizia que o rodapé trazia só a linha institucional. A F03
 * desfez esse arranjo: agora ele vive **dentro do rodapé** (FR-021), que é onde
 * a liga pediu, e o rodapé é o mesmo em todas as dez páginas públicas.
 *
 * POR QUE `<address>` E NÃO `<nav>`
 * Ele era um `<nav>`, o que funcionava quando estava sozinho na página. Dentro
 * do `<footer>` isso criaria um SEGUNDO landmark de navegação, e o FR-020 exige
 * exatamente uma região de cada papel — dois menus obrigam quem usa leitor de
 * tela a adivinhar qual é o do site.
 *
 * `<address>` não é a saída de menor esforço: é o elemento cujo significado é
 * "informação de contato desta seção ou documento", que é literalmente o que
 * estes dois links são.
 *
 * OS VALORES SÃO OS CONFIRMADOS, E NENHUM NOVO ENTRA
 * `docs/conteudo-institucional.md`, seção 7: e-mail `liacup.unb@gmail.com` e
 * Instagram `@liacup.unb`. O e-mail que aparece no protótipo é inventado e não
 * existe em nenhum arquivo desta feature (FR-023).
 */
import { Icone } from '@/componentes/ui/Icone'
import estilos from './LinksDeContato.module.css'

export function LinksDeContato() {
  return (
    <address className={estilos.linksDeContato} aria-label="Canais de contato da LIACUP">
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
    </address>
  )
}
