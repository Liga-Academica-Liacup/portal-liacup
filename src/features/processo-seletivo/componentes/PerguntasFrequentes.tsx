/*
 * "Perguntas que sempre chegam": as perguntas frequentes, na ordem do
 * conteudo-institucional.md, seção 6, todas fechadas quando a página abre.
 *
 * Cada pergunta é um <details> com um <summary>, sem JavaScript (design.md da
 * change, D6). O navegador cuida do resto:
 *   - toque, clique, Enter e Espaço abrem e fecham a resposta;
 *   - o leitor de tela ouve se a pergunta está expandida ou recolhida;
 *   - a busca da página (Ctrl+F) abre a resposta que tem o termo procurado.
 *
 * A pergunta não é título: dentro do <summary>, que tem papel de botão, um
 * <h3> perderia a semântica. O título da seção é o <h2>.
 *
 * O "+" do protótipo, que vira "–" com a resposta aberta, é decorativo e não
 * é anunciado: o estado já vem do próprio <details>.
 *
 * Carregando, erro e vazio: o vazio é impossível hoje, porque o dado é
 * estático e o teste de unidade do conteúdo exige as oito perguntas. Os três
 * estados chegam na R3, com o banco (Q12 (a) do Gabriel, 21/11/2026).
 */
import { TituloDeSecao, type TextoDoTituloDeSecao } from '@/componentes/padroes/TituloDeSecao'
import type { PerguntaFrequente } from '../tipos'
import estilos from './PerguntasFrequentes.module.css'

type PropsDasPerguntasFrequentes = {
  titulo: TextoDoTituloDeSecao
  perguntas: readonly PerguntaFrequente[]
}

export function PerguntasFrequentes({ titulo, perguntas }: PropsDasPerguntasFrequentes) {
  if (perguntas.length === 0) return null

  return (
    <section className={estilos.secao} aria-labelledby="titulo-das-perguntas">
      <div className={estilos.conteudo}>
        <TituloDeSecao titulo={titulo} id="titulo-das-perguntas" tamanho="grande" />
        {/* As perguntas são uma lista, anunciada com o número de itens. Papel de
            lista explícito: o Safari tira o papel de toda lista sem marcador
            (design.md da change pagina-sobre-e-equipe, D7). */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima */}
        <ul role="list" className={estilos.lista}>
          {perguntas.map(({ pergunta, resposta }) => (
            <li key={pergunta}>
              <details className={estilos.pergunta}>
                <summary className={estilos.resumo}>
                  <span className={estilos.textoDaPergunta}>{pergunta}</span>
                  <span className={estilos.sinal} aria-hidden="true" />
                </summary>
                <p className={estilos.resposta}>{resposta}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
