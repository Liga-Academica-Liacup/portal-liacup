/*
 * O CONTEÚDO DA PÁGINA CONTATO
 *
 * Para quem não programa: o sobretítulo e o título da página /contato moram
 * aqui, e só aqui. Os componentes não guardam texto; eles recebem este
 * conteúdo e o desenham.
 *
 * De onde vem cada parte (design.md da change pagina-contato, "Fontes do texto
 * que vai ao ar"):
 *   - sobretítulo "Contato" e título "Fale com a Liga": rótulos de interface,
 *     registrados na REFERENCIA-VISUAL.md, seção 7, linha "Contato, página".
 *     Sem frase embaixo do título: a do protótipo não está no
 *     docs/conteudo-institucional.md (Q1 (a) do Gabriel, 23/11/2026);
 *   - o Instagram, o e-mail e o endereço: não moram aqui, e sim em
 *     src/componentes/padroes/contato-da-liga.ts, junto do bloco de contato.
 *
 * Quem confere este arquivo é o `conteudo.test.ts`: rótulo vazio deixa
 * `npm test` vermelho.
 */
import type { ConteudoDoContato } from './tipos'

export const CONTEUDO_DO_CONTATO: ConteudoDoContato = {
  topo: { sobretitulo: 'Contato', titulo: 'Fale com a Liga' },
  /*
   * O topo do bloco de contato da página inicial (change inicio-completo):
   * sobretítulo "Contato" e título "Onde a Liga responde", rótulos de
   * interface registrados na REFERENCIA-VISUAL.md, seção 7, linha "Inicial,
   * bloco de contato". Sem a frase do protótipo, que não está no
   * docs/conteudo-institucional.md, e sem o botão "Mandar uma mensagem", que é
   * da R4 (Q4 (a) e Q5 (a) do Gabriel, 23/11/2026).
   */
  blocoDaInicial: { sobretitulo: 'Contato', titulo: 'Onde a Liga responde' },
}
