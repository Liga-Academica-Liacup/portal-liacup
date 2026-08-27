/*
 * Rodapé de todas as páginas públicas. Server Component: não conhece feature,
 * banco nem rota.
 *
 * O QUE ELE PODE DIZER, E POR QUÊ
 * Só o que está em `docs/conteudo-institucional.md` com fonte nomeada (FR-024).
 * São três coisas, e nenhuma a mais:
 *
 *   1. a linha institucional — nome por extenso e universidade;
 *   2. a sede em FORMA CURTA, "FCTS · Campus UnB Ceilândia" (Estatuto, Art. 1º).
 *      A decisão de 27/08 é forma curta e não endereço postal: sem logradouro,
 *      sem CEP. O endereço completo, se for ao ar, é assunto da F13;
 *   3. os canais de contato, pelo componente que já existe.
 *
 * O protótipo traz "Faculdade de Medicina · Campus Darcy Ribeiro" — inventado.
 * A seção 7 do documento institucional manda corrigir, e é o que a linha da
 * sede aqui faz.
 *
 * Nenhum número, nenhuma associação de pessoa a cargo, nenhum endereço novo.
 */
import { LinksDeContato } from './LinksDeContato'
import estilos from './Rodape.module.css'

export function Rodape() {
  return (
    <footer className={estilos.rodape}>
      <p className={estilos.linha}>
        Liga Acadêmica Multiprofissional de Cuidados Paliativos &middot; Universidade de Brasília
      </p>
      <p className={estilos.sede}>FCTS &middot; Campus UnB Ceilândia</p>
      <LinksDeContato />
    </footer>
  )
}
