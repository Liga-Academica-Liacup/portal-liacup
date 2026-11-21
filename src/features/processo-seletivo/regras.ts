/*
 * A conferência do conteúdo da página do processo seletivo.
 *
 * Função pura, sem React e sem banco, para o teste poder chamá-la com o
 * conteúdo de verdade e com conteúdos inventados (PADROES-DE-CODIGO.md, 4).
 * Na R3, quando o painel gravar este conteúdo, a mesma conferência vale antes
 * de gravar.
 */
import type { ConteudoDoProcessoSeletivo } from './tipos'

/**
 * A seção 5.5 tem cinco etapas: formulário, análise do produto, entrevista,
 * resultado e integração (decisão do Gabriel, 21/11/2026).
 */
export const NUMERO_DE_ETAPAS = 5

/**
 * O quadro "Quem pode se inscrever" tem quatro itens, como o gabarito (seção
 * 5.3, "Texto da página"; correção do Gabriel, 21/11/2026).
 */
export const NUMERO_DE_ITENS_DE_QUEM_PODE_SE_INSCREVER = 4

/*
 * A nota de fonte em itálico do fim das respostas e dos itens do documento,
 * como "(Edital, 2.2)" ou "(decisão D6)", não vai ao ar (Q4 (a)). Um texto que
 * termina entre parênteses, com ou sem o sublinhado do itálico, é sinal de que
 * a nota foi copiada junto.
 */
const NOTA_DE_FONTE_NO_FIM = /\([^()]*\)_?\s*$/

const vazio = (texto: string) => texto.trim() === ''

/**
 * Diz o que está errado no conteúdo, uma frase por problema, nomeando o item.
 * Lista vazia quer dizer conteúdo válido.
 */
export function problemasDoConteudo(conteudo: ConteudoDoProcessoSeletivo): string[] {
  const problemas: string[] = []

  if (vazio(conteudo.titulo)) problemas.push('título vazio')
  if (vazio(conteudo.apresentacao)) problemas.push('apresentação vazia')

  const { selo, aviso } = conteudo.inscricoes
  if (vazio(selo)) problemas.push('selo vazio')
  if (vazio(aviso.textoDoLink)) problemas.push('aviso sem o texto do link')
  if (!aviso.endereco.startsWith('https://')) {
    problemas.push(`link do aviso "${aviso.endereco}" não começa com "https://"`)
  }
  if (!aviso.nomeAcessivelDoLink.includes(aviso.textoDoLink)) {
    problemas.push(`o nome acessível do link do aviso não contém o texto "${aviso.textoDoLink}"`)
  }

  for (const [chave, secao] of Object.entries(conteudo.secoes)) {
    if (vazio(secao.titulo)) problemas.push(`seção "${chave}" sem título`)
    if (vazio(secao.sobretitulo)) problemas.push(`seção "${chave}" sem sobretítulo`)
  }

  if (conteudo.etapas.length !== NUMERO_DE_ETAPAS) {
    problemas.push(`${conteudo.etapas.length} etapas; a seção 5.5 tem ${NUMERO_DE_ETAPAS}`)
  }
  conteudo.etapas.forEach((etapa, indice) => {
    if (vazio(etapa.nome)) problemas.push(`etapa ${indice + 1} sem nome`)
    if (vazio(etapa.carater)) problemas.push(`etapa "${etapa.nome}" sem o caráter`)
  })

  const itens = conteudo.quemPodeSeInscrever
  if (itens.length !== NUMERO_DE_ITENS_DE_QUEM_PODE_SE_INSCREVER) {
    problemas.push(
      `${itens.length} itens em "quem pode se inscrever"; a seção 5.3 tem ` +
        `${NUMERO_DE_ITENS_DE_QUEM_PODE_SE_INSCREVER}`
    )
  }
  itens.forEach((item, indice) => {
    if (vazio(item)) problemas.push(`item ${indice + 1} de "quem pode se inscrever" vazio`)
    if (NOTA_DE_FONTE_NO_FIM.test(item)) {
      problemas.push(`item ${indice + 1} de "quem pode se inscrever" com nota de fonte no fim`)
    }
  })

  if (conteudo.perguntas.length === 0) problemas.push('nenhuma pergunta')
  const vistas = new Set<string>()
  conteudo.perguntas.forEach(({ pergunta, resposta }, indice) => {
    const nome = vazio(pergunta) ? `pergunta ${indice + 1}` : `pergunta "${pergunta}"`
    if (vazio(pergunta)) problemas.push(`${nome} sem texto`)
    if (vazio(resposta)) problemas.push(`${nome} sem resposta`)
    if (NOTA_DE_FONTE_NO_FIM.test(resposta)) {
      problemas.push(`${nome} com nota de fonte no fim da resposta`)
    }
    if (!vazio(pergunta) && vistas.has(pergunta)) problemas.push(`${nome} repetida`)
    vistas.add(pergunta)
  })

  return problemas
}
