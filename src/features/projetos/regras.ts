/*
 * As regras da página Projetos: o título da faixa a partir dos nomes das
 * frentes, e a conferência do conteúdo.
 *
 * Funções puras, sem React e sem banco, para o teste poder chamá-las com o
 * conteúdo de verdade e com conteúdos inventados (PADROES-DE-CODIGO.md, 4).
 */
import type { ConteudoDeProjetos } from './tipos'

/** As quatro frentes da seção 3, na ordem do documento (Decisão D3 de lá). */
export const NOMES_DAS_FRENTES = ['Ensino', 'Extensão', 'Pesquisa', 'Secretaria'] as const

/**
 * O que não pode aparecer em nenhum texto da página (design.md da change, D5):
 * marca de conteúdo pendente, de rascunho ou de nota de fonte, e a palavra
 * "eixo", que a seção 3 troca por "frentes de trabalho".
 *
 * As palavras valem do começo de uma palavra em diante, sem diferença de
 * maiúscula: "eixo" pega "Eixos", e "pendente" não pega "independente".
 */
export const TERMOS_PROIBIDOS: readonly { termo: string; padrao: RegExp }[] = [
  { termo: 'Pendente', padrao: /(?<!\p{L})pendente/iu },
  { termo: 'a ser escrit', padrao: /(?<!\p{L})a ser escrit/iu },
  { termo: 'provisório', padrao: /(?<!\p{L})provisório/iu },
  { termo: 'eixo', padrao: /(?<!\p{L})eixo/iu },
  { termo: 'Estatuto', padrao: /(?<!\p{L})estatuto/iu },
  { termo: '_', padrao: /_/u },
  { termo: '⚠', padrao: /⚠/u },
]

/** Junta os nomes como se escreve em português: "A, B, C e D". */
export function juntarNomes(nomes: readonly string[]): string {
  if (nomes.length <= 1) return nomes.join('')
  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`
}

const vazio = (texto: string) => texto.trim() === ''

/** Os termos proibidos que o texto tem, cada um nomeando onde foi achado. */
function termosAchados(texto: string, onde: string): string[] {
  return TERMOS_PROIBIDOS.filter(({ padrao }) => padrao.test(texto)).map(
    ({ termo }) => `termo "${termo}" ${onde}`
  )
}

/**
 * Diz o que está errado no conteúdo, uma frase por problema, nomeando a
 * frente. Lista vazia quer dizer conteúdo válido.
 */
export function problemasDoConteudo(conteudo: ConteudoDeProjetos): string[] {
  const { faixa, frentes } = conteudo
  const problemas: string[] = []

  if (vazio(faixa.sobretitulo)) problemas.push('sobretítulo da faixa vazio')
  if (vazio(faixa.titulo)) problemas.push('título da faixa vazio')

  const esperados = NOMES_DAS_FRENTES.length
  if (frentes.length !== esperados) {
    problemas.push(`${frentes.length} frentes; a seção 3 tem ${esperados}`)
  }

  const nomesVistos = new Set<string>()
  const textosVistos = new Set<string>()
  frentes.forEach((frente, indice) => {
    if (vazio(frente.nome)) {
      problemas.push(`frente ${indice + 1} sem nome`)
      return
    }
    const nome = `"${frente.nome}"`
    if (nomesVistos.has(frente.nome)) problemas.push(`frente ${nome} repetida`)
    nomesVistos.add(frente.nome)
    if (vazio(frente.texto)) problemas.push(`frente ${nome} sem texto`)
    else if (textosVistos.has(frente.texto)) problemas.push(`texto da frente ${nome} repetido`)
    textosVistos.add(frente.texto)
    problemas.push(...termosAchados(frente.nome, `no nome da frente ${nome}`))
    problemas.push(...termosAchados(frente.texto, `no texto da frente ${nome}`))
  })

  const tituloEsperado = juntarNomes(frentes.map((frente) => frente.nome))
  if (!vazio(faixa.titulo) && faixa.titulo !== tituloEsperado) {
    problemas.push(
      `título da faixa "${faixa.titulo}" não junta os nomes das frentes; o esperado é "${tituloEsperado}"`
    )
  }
  problemas.push(...termosAchados(faixa.sobretitulo, 'no sobretítulo da faixa'))
  problemas.push(...termosAchados(faixa.titulo, 'no título da faixa'))

  return problemas
}
