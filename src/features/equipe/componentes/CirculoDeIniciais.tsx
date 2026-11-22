/*
 * O círculo da foto de um docente, com as iniciais do nome no lugar da foto,
 * enquanto a liga não manda as fotos (Q7 do Gabriel, 22/11/2026;
 * REFERENCIA-VISUAL.md, seção 7).
 *
 * As iniciais saem do nome pela regra do `regras.ts` ("MC", "KG"), e não
 * ficam escritas em lugar nenhum. O círculo inteiro é decorativo e fica fora
 * da árvore de acessibilidade: o nome completo está escrito ao lado, e as
 * iniciais não são lidas duas vezes.
 *
 * Mora em features/equipe, e não em componentes/ui, porque só o cartão de
 * docente o usa (design.md da change, D6). Quando a foto chegar, ela
 * substitui as iniciais dentro do mesmo círculo.
 */
import { iniciaisDoNome } from '../regras'
import estilos from './CirculoDeIniciais.module.css'

type PropsDoCirculoDeIniciais = {
  /** O nome como está na seção 4.1, com o tratamento. */
  nome: string
}

export function CirculoDeIniciais({ nome }: PropsDoCirculoDeIniciais) {
  return (
    <div className={estilos.circulo} aria-hidden="true">
      {iniciaisDoNome(nome)}
    </div>
  )
}
