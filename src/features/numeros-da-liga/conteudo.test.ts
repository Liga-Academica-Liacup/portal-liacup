import { afterAll, describe, expect, it } from 'vitest'
import { NUMEROS_DA_LIGA } from './conteudo'
import { problemasDosNumeros } from './regras'

/*
 * Confere os números da liga (design.md da change inicio-completo, D3): quatro
 * itens, nenhum número nem rótulo vazio.
 *
 * O primeiro teste é o que importa: ele lê o conteúdo de verdade. Os outros
 * mostram que a conferência pega cada problema, com conteúdos inventados aqui
 * mesmo, para ninguém precisar estragar o arquivo de dados para ver a
 * conferência funcionar.
 *
 * Se os números batem com o docs/conteudo-institucional.md, seção 9, quem
 * confere é o teste de ponta a ponta, que lê o documento e a página publicada.
 *
 * A contagem sai impressa no fim: sem ela, "nada falhou" e "nada foi
 * conferido" dão a mesma saída (RP-12).
 */
let numerosConferidos = 0

describe('números da liga', () => {
  it('os números de verdade não têm nenhum problema', () => {
    const problemas = problemasDosNumeros(NUMEROS_DA_LIGA)
    numerosConferidos = NUMEROS_DA_LIGA.length
    expect(problemas, `Problemas nos números: ${problemas.join('; ')}`).toEqual([])
  })

  it('acusa uma quantidade diferente de quatro', () => {
    expect(problemasDosNumeros(NUMEROS_DA_LIGA.slice(0, 3))).toEqual(['3 números; a seção 9 tem 4'])
  })

  it('acusa número vazio e rótulo vazio, nomeando o item', () => {
    const numeros = NUMEROS_DA_LIGA.map((numero, indice) => {
      if (indice === 1) return { ...numero, valor: ' ' }
      if (indice === 3) return { ...numero, rotulo: '' }
      return numero
    })
    expect(problemasDosNumeros(numeros)).toEqual([
      'item 2 ("cursos representados") sem número',
      'item 4 ("2026") sem rótulo',
    ])
  })

  /*
   * process.stdout, e não console.log: o Vitest esconde o console.log de um
   * afterAll, e a contagem precisa aparecer na saída de `npm test`.
   */
  afterAll(() => {
    process.stdout.write(`números: ${numerosConferidos}\n`)
  })
})
