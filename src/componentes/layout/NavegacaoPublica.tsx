/*
 * A navegação do site público.
 *
 * FONTE ÚNICA
 * Os destinos vêm de `destinos-publicos.ts` e de lugar nenhum mais. Não existe
 * lista escrita aqui, e é essa ausência que faz o FR-044 valer: acrescentar um
 * destino ao catálogo faz aparecer um link aqui, sete casos no Playwright e
 * três relatórios no Lighthouse, sem editar nada.
 *
 * ESTADO DESTA FASE
 * Server Component estrutural: desenha os dez destinos como links. O
 * comportamento responsivo — conversão fora do painel, painel lateral,
 * navegação direta a partir de 1024 px — entra na Fase 4, e a marcação da
 * página atual na Fase 7. Cada um com o teste que o cobra escrito antes.
 */
import Link from 'next/link'
import { DESTINOS_PUBLICOS } from './destinos-publicos'
import estilos from './NavegacaoPublica.module.css'

export function NavegacaoPublica() {
  return (
    <nav className={estilos.navegacao} aria-label="Navegação principal">
      <ul className={estilos.lista}>
        {DESTINOS_PUBLICOS.map((destino) => (
          <li key={destino.caminho}>
            <Link className={estilos.destino} href={destino.caminho}>
              {destino.rotulo}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
