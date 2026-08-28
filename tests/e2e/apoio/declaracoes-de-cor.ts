/*
 * As declarações de cor que o cabeçalho, o painel e o rodapé DECLARAM —
 * derivadas dos arquivos, nunca digitadas.
 *
 * POR QUE ISTO EXISTE
 * A T040 fala em "nove combinações de contraste". Nove é um número que alguém
 * contou à mão: uma décima combinação que apareça amanhã não entra sozinha, e o
 * detector continua dizendo "todas". Já custou caro nesta feature — na Fase 4 a
 * comparação visual reportou "6/6 pares, 0 divergências" comparando `{` e `;`,
 * e quem acusou foi o contador ao lado da asserção, não a asserção.
 *
 * Então o conjunto sai daqui, do mesmo jeito que o FR-044 fez com os destinos:
 * uma lista, dois consumidores. Acrescentar uma regra de cor a qualquer um dos
 * três componentes faz aparecer uma declaração nova aqui, e o teste de contraste
 * fica vermelho até alguém medi-la.
 *
 * O QUE CONTA COMO DECLARAÇÃO DE COR, e por quê:
 *
 *   `color`          → primeiro plano. Precisa de par e de limite.
 *   `border*`        → borda. Precisa de par, de limite APLICÁVEL e de veredito
 *                      escrito "necessária" ou "decorativa" (SC 1.4.11).
 *   `background`     → superfície. Não é primeiro plano de nada sozinha; é a
 *                      segunda metade dos pares acima.
 *
 * Valores sem cor — `none`, `transparent`, `0` — não entram: não há o que medir.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export type PapelDaCor = 'primeiroPlano' | 'borda' | 'superficie'

export type DeclaracaoDeCor = {
  /** `arquivo:linha`, que é a identidade estável da declaração. */
  id: string
  arquivo: string
  linha: number
  propriedade: string
  valor: string
  papel: PapelDaCor
}

/*
 * Os três componentes sob medição nesta fase. A lista está aqui e não no teste
 * porque é ela que define o alcance do FR-034 — "todas as combinações que o
 * cabeçalho e o rodapé produzem".
 */
const ARQUIVOS = [
  'src/componentes/layout/Cabecalho.module.css',
  'src/componentes/layout/NavegacaoPublica.module.css',
  'src/componentes/layout/Rodape.module.css',
] as const

const SEM_COR = /^(none|transparent|0|inherit|currentcolor)$/i

/** Referencia a uma cor de verdade, e nao a qualquer custom property. */
const REFERENCIA_COR = /--color-|#[0-9a-f]{3}|rgba?\(|color-mix\(/i

function papelDe(propriedade: string): PapelDaCor | null {
  if (propriedade === 'color') return 'primeiroPlano'
  if (propriedade.startsWith('border')) return 'borda'
  if (propriedade === 'background' || propriedade === 'background-color') return 'superficie'
  return null
}

/** Lê as três folhas e devolve toda declaração que carrega cor. */
export function declaracoesDeCorDaMoldura(): DeclaracaoDeCor[] {
  const encontradas: DeclaracaoDeCor[] = []

  for (const arquivo of ARQUIVOS) {
    const conteudo = readFileSync(resolve(process.cwd(), arquivo), 'utf8')
    // Comentários fora: um valor citado em prosa não é declaração.
    const linhas = conteudo
      .replace(/\/\*[\s\S]*?\*\//g, (bloco) => bloco.replace(/[^\n]/g, ' '))
      .split('\n')

    linhas.forEach((linha, indice) => {
      const encontrado = linha.match(/^\s*(?<propriedade>[a-z-]+)\s*:\s*(?<valor>[^;]+);/)
      if (!encontrado?.groups) return
      const propriedade = encontrado.groups.propriedade!
      const valor = encontrado.groups.valor!.trim()

      const papel = papelDe(propriedade)
      if (!papel) return
      /*
       * A borda precisa referenciar uma COR, e não qualquer `var()`.
       *
       * A primeira versão testava só `var\(`, e `border-radius: var(--radius-pill)`
       * entrou na lista como se fosse cor. Um par a mais, derivado de uma
       * declaração que não tem o que medir, é o mesmo defeito da lista digitada
       * — só que com cara de derivação.
       */
      if (papel === 'borda' && !REFERENCIA_COR.test(valor)) return
      if (SEM_COR.test(valor)) return

      encontradas.push({
        id: `${arquivo.split('/').pop()}:${indice + 1}`,
        arquivo,
        linha: indice + 1,
        propriedade,
        valor,
        papel,
      })
    })
  }

  if (encontradas.length === 0) {
    throw new Error(
      'nenhuma declaracao de cor derivada dos tres componentes da moldura. ' +
        'Zero declaracoes faria o teste de contraste passar sem medir nada.'
    )
  }
  return encontradas
}

/** Só as que exigem par medido: primeiro plano e borda. Superfície é fundo. */
export function declaracoesQueExigemPar(): DeclaracaoDeCor[] {
  return declaracoesDeCorDaMoldura().filter((d) => d.papel !== 'superficie')
}
