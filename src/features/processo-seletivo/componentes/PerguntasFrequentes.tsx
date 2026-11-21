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
 * Lista vazia não desenha nada. O teste de unidade do conteúdo garante as oito.
 */
import type { PerguntaFrequente, TituloDeSecao as Titulo } from '../tipos'
import estilos from './PerguntasFrequentes.module.css'
import { TituloDeSecao } from './TituloDeSecao'

type PropsDasPerguntasFrequentes = {
  titulo: Titulo
  perguntas: readonly PerguntaFrequente[]
}

export function PerguntasFrequentes({ titulo, perguntas }: PropsDasPerguntasFrequentes) {
  if (perguntas.length === 0) return null

  return (
    <section className={estilos.secao} aria-labelledby="titulo-das-perguntas">
      <div className={estilos.conteudo}>
        <TituloDeSecao titulo={titulo} id="titulo-das-perguntas" tamanho="perguntas" />
        {perguntas.map(({ pergunta, resposta }) => (
          <details key={pergunta} className={estilos.pergunta}>
            <summary className={estilos.resumo}>
              <span className={estilos.textoDaPergunta}>{pergunta}</span>
              <span className={estilos.sinal} aria-hidden="true" />
            </summary>
            <p className={estilos.resposta}>{resposta}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
