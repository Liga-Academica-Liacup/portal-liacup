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
import { classesDaAparencia } from '@/componentes/ui/aparencia-de-botao'
import { NavegacaoPublica } from './NavegacaoPublica'
import { conversaoPrincipal } from './destinos-publicos'
import estilos from './Cabecalho.module.css'

export function Cabecalho() {
  return (
    <header className={estilos.cabecalho}>
      <Link className={estilos.marca} href="/" data-testid="marca-do-cabecalho">
        LIACUP
      </Link>

      <NavegacaoPublica />

      {/*
       * A CONVERSÃO PRINCIPAL — visível em todas as larguras, fora do painel.
       *
       * FR-005: é a razão de o site existir para a liga, e o público chega pelo
       * Instagram, no celular. Um destino que exige descobrir um botão de menu
       * antes de ser encontrado perde a maior parte de quem chegaria nele.
       *
       * POR QUE `<Link>` COM A FUNÇÃO, E NÃO O `LinkComAparenciaDeBotao`
       *
       * `classesDaAparencia` é função pura, sem rota e sem componente, e
       * `componentes/layout` pode conhecer rota — então o cabeçalho consegue a
       * navegação de cliente do `<Link>` E a mesma origem única de aparência,
       * sem devolver o controle de `className` que o componente existe para
       * fechar. O FR-045 não é afrouxado aqui: ele é usado.
       *
       * A alternativa era o componente com um `<a>` puro, que recarrega a página
       * inteira. Seria o custo mais caro possível no único link que esta feature
       * existe para destacar, para quem chega em rede ruim — e o Lighthouse não
       * mostraria, porque mede carga inicial.
       *
       * O componente continua sendo o certo para destino EXTERNO, como o
       * "Fazer inscrição" da F12, que vai para o formulário da liga e tem de ser
       * um `<a>` de verdade. A divisão é por significado: rota interna usa
       * `<Link>` com a função; endereço externo usa o componente.
       */}
      <Link
        className={classesDaAparencia('primario', false)}
        href={conversaoPrincipal.caminho}
        data-testid="conversao-principal"
      >
        {conversaoPrincipal.rotulo}
      </Link>
    </header>
  )
}
