/*
 * A conferência do conteúdo da página Sobre.
 *
 * Função pura, sem React e sem banco, para o teste poder chamá-la com o
 * conteúdo de verdade e com conteúdos inventados (PADROES-DE-CODIGO.md, 4).
 */
import type { ConteudoDoSobre } from './tipos'

/** As seções 2.3 a 2.6 do documento: objetivo geral, finalidade, impacto e protagonismo. */
export const NUMERO_DE_ITENS_DOS_OBJETIVOS = 4

/** A seção 2.3 tem dois parágrafos, e cada uma das outras três, um. */
export const NUMERO_DE_PARAGRAFOS_DOS_OBJETIVOS = 5

/*
 * A nota de fonte em itálico do fim de uma seção do documento, como
 * "(Estatuto, Art. 2º)", não vai ao ar (Q10 (a)). Um parágrafo que termina
 * entre parênteses, com ou sem o sublinhado do itálico, é sinal de que a nota
 * foi copiada junto.
 */
const NOTA_DE_FONTE_NO_FIM = /\([^()]*\)_?\s*$/

const vazio = (texto: string) => texto.trim() === ''

/** Quantos parágrafos os itens têm, somados. */
export function contarParagrafos(conteudo: ConteudoDoSobre): number {
  return conteudo.objetivos.itens.reduce((soma, item) => soma + item.paragrafos.length, 0)
}

/**
 * Diz o que está errado no conteúdo, uma frase por problema, nomeando o item.
 * Lista vazia quer dizer conteúdo válido.
 */
export function problemasDoConteudo(conteudo: ConteudoDoSobre): string[] {
  const problemas: string[] = []

  if (vazio(conteudo.titulo)) problemas.push('título vazio')
  if (vazio(conteudo.apresentacao)) problemas.push('apresentação vazia')
  if (vazio(conteudo.historia.texto)) problemas.push('história vazia')

  const secoes = {
    história: conteudo.historia.secao,
    objetivos: conteudo.objetivos.secao,
    docentes: conteudo.secaoDosDocentes,
  }
  for (const [nome, secao] of Object.entries(secoes)) {
    if (vazio(secao.titulo)) problemas.push(`seção "${nome}" sem título`)
    if (vazio(secao.sobretitulo)) problemas.push(`seção "${nome}" sem sobretítulo`)
  }

  const { itens } = conteudo.objetivos
  if (itens.length !== NUMERO_DE_ITENS_DOS_OBJETIVOS) {
    problemas.push(
      `${itens.length} itens em "O que a Liga se propõe a fazer"; as seções 2.3 a 2.6 são ` +
        `${NUMERO_DE_ITENS_DOS_OBJETIVOS}`
    )
  }
  const paragrafos = contarParagrafos(conteudo)
  if (paragrafos !== NUMERO_DE_PARAGRAFOS_DOS_OBJETIVOS) {
    problemas.push(
      `${paragrafos} parágrafos nos itens; as seções 2.3 a 2.6 têm ` +
        `${NUMERO_DE_PARAGRAFOS_DOS_OBJETIVOS}`
    )
  }

  const vistos = new Set<string>()
  itens.forEach((item, indice) => {
    const nome = vazio(item.nome) ? `item ${indice + 1}` : `item "${item.nome}"`
    if (vazio(item.nome)) problemas.push(`${nome} sem nome`)
    if (!vazio(item.nome) && vistos.has(item.nome)) problemas.push(`${nome} repetido`)
    vistos.add(item.nome)
    if (item.paragrafos.length === 0) problemas.push(`${nome} sem parágrafo`)
    item.paragrafos.forEach((paragrafo, posicao) => {
      if (vazio(paragrafo)) problemas.push(`parágrafo ${posicao + 1} do ${nome} vazio`)
      if (NOTA_DE_FONTE_NO_FIM.test(paragrafo)) {
        problemas.push(`parágrafo ${posicao + 1} do ${nome} com nota de fonte no fim`)
      }
    })
  })

  return problemas
}
