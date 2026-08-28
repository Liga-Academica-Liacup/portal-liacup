/*
 * Cabeçalho de todas as páginas públicas. Server Component: sem props de
 * domínio, sem banco, sem feature.
 *
 * A MARCA É TEXTO, e isso foi decidido em 27/08/2026 (FR-004).
 * O `.nav-brand` aprovado é texto puro — família de título, peso 400, 18px.
 * Logo aqui seria desvio a registrar no FIDELIDADE.md e gastaria orçamento
 * horizontal em 360 px, onde a conversão e o botão do painel também moram. A
 * logo já aparece com destaque na página inicial.
 *
 * O ORÇAMENTO VERTICAL É APERTADO, e o número está aqui para quem for mexer:
 * o teto é 64 px no mobile (FR-002) e o alvo de toque mínimo é 44 px. Sobram
 * 20 px para preenchimento vertical, ou seja, **10 px de cada lado**. Com
 * --space-2 (8,8 px) o cabeçalho mede 61,6 px e cabe; com --space-3 (13,2 px)
 * mede 70,4 px e estoura. Na prática, o orçamento é um valor de espaçamento só.
 */
import Link from 'next/link'
import { NavegacaoPublica } from './NavegacaoPublica'
import estilos from './Cabecalho.module.css'

export function Cabecalho() {
  return (
    <header className={estilos.cabecalho}>
      <Link className={estilos.marca} href="/" data-testid="marca-do-cabecalho">
        LIACUP
      </Link>

      <NavegacaoPublica />
    </header>
  )
}
