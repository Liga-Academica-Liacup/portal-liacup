/*
 * A conferência dos números da liga, como função pura, sem React: o
 * `conteudo.test.ts` a usa no conteúdo de verdade e em conteúdos inventados,
 * para mostrar que ela pega cada problema (RP-12).
 */
import type { NumerosDaLiga } from './tipos'

/** Quantos números a seção 9 do docs/conteudo-institucional.md aprova. */
export const QUANTIDADE_DE_NUMEROS = 4

/** Os problemas dos números, um por linha, nomeando o item. Vazio: nenhum. */
export function problemasDosNumeros(numeros: NumerosDaLiga): string[] {
  const problemas: string[] = []

  if (numeros.length !== QUANTIDADE_DE_NUMEROS) {
    problemas.push(`${numeros.length} números; a seção 9 tem ${QUANTIDADE_DE_NUMEROS}`)
  }

  numeros.forEach((numero, indice) => {
    const item = `item ${indice + 1}`
    if (numero.valor.trim() === '') {
      problemas.push(`${item} ("${numero.rotulo}") sem número`)
    }
    if (numero.rotulo.trim() === '') {
      problemas.push(`${item} ("${numero.valor}") sem rótulo`)
    }
  })

  return problemas
}
