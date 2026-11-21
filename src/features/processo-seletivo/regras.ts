/*
 * A conferência do conteúdo da página do processo seletivo.
 *
 * Função pura, sem React e sem banco, para o teste poder chamá-la com o
 * conteúdo de verdade e com conteúdos inventados (PADROES-DE-CODIGO.md, 4).
 * Na R3, quando o painel gravar este conteúdo, a mesma conferência vale antes
 * de gravar.
 */
import type { ConteudoDoProcessoSeletivo } from './tipos'

/** O edital tem duas etapas: formulário e entrevista (seção 5.5). */
export const NUMERO_DE_ETAPAS = 2

/*
 * A nota de fonte em itálico do fim das respostas do documento, como
 * "(Edital, 2.2)" ou "(decisão D6)", não vai ao ar (Q4 (a)). Uma resposta que
 * termina entre parênteses é sinal de que a nota foi copiada junto.
 */
const NOTA_DE_FONTE_NO_FIM = /\([^()]*\)\s*$/

const vazio = (texto: string) => texto.trim() === ''

/**
 * Diz o que está errado no conteúdo, uma frase por problema, nomeando o item.
 * Lista vazia quer dizer conteúdo válido.
 */
export function problemasDoConteudo(conteudo: ConteudoDoProcessoSeletivo): string[] {
  const problemas: string[] = []

  if (vazio(conteudo.titulo)) problemas.push('título vazio')
  if (vazio(conteudo.apresentacao)) problemas.push('apresentação vazia')
  if (vazio(conteudo.quemPodeSeInscrever)) problemas.push('"quem pode se inscrever" vazio')

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
    problemas.push(`${conteudo.etapas.length} etapas; o edital tem ${NUMERO_DE_ETAPAS}`)
  }
  conteudo.etapas.forEach((etapa, indice) => {
    if (vazio(etapa.nome)) problemas.push(`etapa ${indice + 1} sem nome`)
    if (vazio(etapa.carater)) problemas.push(`etapa "${etapa.nome}" sem o caráter`)
  })

  if (conteudo.preRequisitos.length === 0) problemas.push('nenhum pré-requisito')
  conteudo.preRequisitos.forEach((requisito, indice) => {
    if (vazio(requisito)) problemas.push(`pré-requisito ${indice + 1} vazio`)
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
