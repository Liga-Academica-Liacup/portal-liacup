/*
 * As regras da página Equipe: as iniciais do círculo dos docentes e a
 * conferência do conteúdo.
 *
 * Funções puras, sem React e sem banco, para o teste poder chamá-las com o
 * conteúdo de verdade e com conteúdos inventados (PADROES-DE-CODIGO.md, 4).
 */
import type { ConteudoDaEquipe } from './tipos'

/** Os seis cargos da seção 4.3 (Estatuto, Art. 11º). */
export const NUMERO_DE_CARGOS = 6

/** Os cinco fundadores discentes da seção 4.2. */
export const NUMERO_DE_FUNDADORES = 5

/** As duas docentes da seção 4.1. */
export const NUMERO_DE_DOCENTES = 2

/**
 * As iniciais do círculo de um docente, tiradas do nome (design.md da change
 * pagina-sobre-e-equipe, D6; Q7 do Gabriel, 22/11/2026):
 *
 *   1. tira as palavras de tratamento, que terminam em ponto ("Profa.",
 *      "Dra.", "Prof.", "Me.") — toda palavra assim, e não uma lista fixa;
 *   2. junta a primeira letra da primeira palavra que sobra e a da última;
 *   3. em maiúsculas.
 *
 * "Profa. Dra. Mariana Sodário Cruz" dá "MC"; "Profa. Dra. Kerolyn Ramos
 * Garcia" dá "KG". Nome de uma palavra só dá uma letra; nome vazio, nada.
 */
export function iniciaisDoNome(nome: string): string {
  const palavras = nome
    .trim()
    .split(/\s+/)
    .filter((palavra) => palavra !== '' && !palavra.endsWith('.'))
  if (palavras.length === 0) return ''
  const primeira = palavras[0]!
  const ultima = palavras[palavras.length - 1]!
  const letras = palavras.length === 1 ? [primeira] : [primeira, ultima]
  return letras.map((palavra) => Array.from(palavra)[0]!.toLocaleUpperCase('pt-BR')).join('')
}

const vazio = (texto: string) => texto.trim() === ''

/** Texto vazio e texto repetido numa lista, nomeando a lista e a posição. */
function problemasDaLista(nomeDaLista: string, textos: readonly string[]): string[] {
  const problemas: string[] = []
  const vistos = new Set<string>()
  textos.forEach((texto, indice) => {
    if (vazio(texto)) problemas.push(`${nomeDaLista} ${indice + 1} vazio`)
    else if (vistos.has(texto)) problemas.push(`${nomeDaLista} "${texto}" repetido`)
    vistos.add(texto)
  })
  return problemas
}

/** Uma lista com tamanho diferente do documento, com as duas contagens. */
function problemaDoTamanho(nome: string, tamanho: number, esperado: number, secao: string) {
  return tamanho === esperado ? [] : [`${tamanho} ${nome}; a seção ${secao} tem ${esperado}`]
}

/**
 * Diz o que está errado no conteúdo, uma frase por problema, nomeando o item.
 * Lista vazia quer dizer conteúdo válido.
 */
export function problemasDoConteudo(conteudo: ConteudoDaEquipe): string[] {
  const { faixa, titulos, cargos, fundadores, docentes } = conteudo
  const problemas: string[] = []

  if (vazio(faixa.sobretitulo)) problemas.push('sobretítulo da faixa vazio')
  if (vazio(faixa.titulo)) problemas.push('título da faixa vazio')
  for (const [bloco, titulo] of Object.entries(titulos)) {
    if (vazio(titulo)) problemas.push(`bloco "${bloco}" sem título`)
  }

  problemas.push(...problemaDoTamanho('cargos', cargos.length, NUMERO_DE_CARGOS, '4.3'))
  problemas.push(
    ...problemasDaLista(
      'cargo',
      cargos.map((item) => item.cargo)
    )
  )
  cargos.forEach((item) => {
    if (!vazio(item.cargo) && vazio(item.linha)) problemas.push(`cargo "${item.cargo}" sem a linha`)
  })

  problemas.push(...problemaDoTamanho('fundadores', fundadores.length, NUMERO_DE_FUNDADORES, '4.2'))
  problemas.push(...problemasDaLista('fundador', fundadores))

  problemas.push(...problemaDoTamanho('docentes', docentes.length, NUMERO_DE_DOCENTES, '4.1'))
  problemas.push(
    ...problemasDaLista(
      'docente',
      docentes.map((docente) => docente.nome)
    )
  )
  docentes.forEach((docente) => {
    if (vazio(docente.nome)) return
    if (vazio(docente.cargo)) problemas.push(`docente "${docente.nome}" sem cargo`)
    if (vazio(docente.formacao)) problemas.push(`docente "${docente.nome}" sem formação`)
    if (iniciaisDoNome(docente.nome).length < 2) {
      problemas.push(`docente "${docente.nome}" sem as duas iniciais no nome`)
    }
  })

  return problemas
}
