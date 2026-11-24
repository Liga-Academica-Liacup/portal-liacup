/*
 * OS NÚMEROS DA LIGA
 *
 * Para quem não programa: os quatro números que aparecem na página inicial,
 * logo abaixo do hero, moram aqui, e só aqui. Para trocar um número, troque o
 * valor abaixo. Nenhum componente precisa mudar.
 *
 * Revisar estes números faz parte da passagem de gestão
 * (docs/conteudo-institucional.md, seção 9). Na R3, o painel assume este lugar.
 *
 * De onde vem cada parte (design.md da change inicio-completo, "Fontes do
 * texto que vai ao ar"):
 *   - "21", "7", "4" e "2026": docs/conteudo-institucional.md, seção 9, na
 *     ordem da frase "Os indicadores aprovados (...)";
 *   - os rótulos: os do protótipo aprovado, rótulos de interface
 *     (REFERENCIA-VISUAL.md, seção 7, linha "Inicial, números"; Q1 (a) do
 *     Gabriel, 23/11/2026).
 *
 * Quem confere este arquivo é o `conteudo.test.ts`: quantidade diferente de
 * quatro, número vazio ou rótulo vazio deixam `npm test` vermelho, nomeando o
 * item. Se o texto bate com o documento, quem confere é o teste de ponta a
 * ponta, que lê o documento.
 */
import type { NumerosDaLiga } from './tipos'

export const NUMEROS_DA_LIGA: NumerosDaLiga = [
  { valor: '21', rotulo: 'membros ativos' },
  { valor: '7', rotulo: 'cursos representados' },
  { valor: '4', rotulo: 'ações realizadas' },
  { valor: '2026', rotulo: 'ano de fundação' },
]
