/*
 * Exemplo da camada de layout. Nao conhece feature nem banco.
 *
 * So a linha institucional. O e-mail e o Instagram vivem no LinksDeContato, que
 * e onde foram pedidos — repetir o mesmo endereco duas vezes na mesma tela nao
 * ajuda ninguem a encontrar e ainda dobra o lugar para corrigir quando mudar.
 */
import estilos from './Rodape.module.css'

export function Rodape() {
  return (
    <footer className={estilos.rodape}>
      <p className={estilos.linha}>
        Liga Acadêmica Multiprofissional de Cuidados Paliativos &middot; Universidade de Brasília
      </p>
    </footer>
  )
}
