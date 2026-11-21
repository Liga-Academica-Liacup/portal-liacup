/*
 * Os tipos do conteúdo da página do processo seletivo.
 *
 * O conteúdo mora em `conteudo.ts`, separado da composição, para que trocar uma
 * pergunta, um pré-requisito ou o aviso não mexa em nenhum componente. Na R3,
 * o painel assume esse lugar (`conteudo-institucional.md`, seção 5.1), e o
 * `dados.ts` desta pasta passa a ler do banco com estes mesmos tipos.
 *
 * O estado das inscrições é uma união de valores. Hoje só existe `'fechado'`
 * (decisão do Gabriel, Q2 (a) da change pagina-processo-seletivo). Quando o
 * estado aberto entrar, numa change própria, ele acrescenta um membro à união
 * `SituacaoDasInscricoes`, e o TypeScript aponta todo lugar que precisa tratá-lo.
 */

/** Um texto com um link no meio: o que vem antes, o link e o que vem depois. */
export type TextoComLink = {
  readonly antesDoLink: string
  readonly textoDoLink: string
  readonly depoisDoLink: string
  /** Endereço externo, aberto em nova aba. */
  readonly endereco: string
  /** Diz o destino e contém o texto visível do link (WCAG 2.5.3). */
  readonly nomeAcessivelDoLink: string
}

/** Inscrições fechadas: o selo e o aviso que convida a acompanhar a liga. */
export type InscricoesFechadas = {
  readonly estado: 'fechado'
  readonly selo: string
  readonly aviso: TextoComLink
}

/** Os estados possíveis das inscrições. Hoje, só fechado (Q2 (a)). */
export type SituacaoDasInscricoes = InscricoesFechadas

export type EstadoDasInscricoes = SituacaoDasInscricoes['estado']

/** O sobretítulo pequeno, em maiúsculas, e o título de uma seção. */
export type TituloDeSecao = {
  readonly sobretitulo: string
  readonly titulo: string
}

/** Uma etapa da seleção: o nome e o caráter dela (eliminatória, classificatória). */
export type Etapa = {
  readonly nome: string
  readonly carater: string
}

/** Uma pergunta frequente, com a resposta sem a nota de fonte (Q4 (a)). */
export type PerguntaFrequente = {
  readonly pergunta: string
  readonly resposta: string
}

export type ConteudoDoProcessoSeletivo = {
  readonly titulo: string
  readonly apresentacao: string
  readonly inscricoes: SituacaoDasInscricoes
  readonly secoes: {
    readonly etapas: TituloDeSecao
    readonly requisitos: TituloDeSecao
    readonly perguntas: TituloDeSecao
  }
  readonly etapas: readonly Etapa[]
  readonly quemPodeSeInscrever: string
  readonly preRequisitos: readonly string[]
  readonly perguntas: readonly PerguntaFrequente[]
}
