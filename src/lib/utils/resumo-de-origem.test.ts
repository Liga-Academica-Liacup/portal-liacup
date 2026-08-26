import { describe, expect, it } from 'vitest'
import { resumirOrigem } from './resumo-de-origem'

const SAL = 'sal-de-teste-que-nao-e-o-de-producao'

describe('resumo de origem', () => {
  it('o mesmo endereco com o mesmo sal da o mesmo resumo — e o que permite contar repeticao', () => {
    expect(resumirOrigem('203.0.113.7', SAL)).toBe(resumirOrigem('203.0.113.7', SAL))
  })

  it('enderecos diferentes dao resumos diferentes', () => {
    expect(resumirOrigem('203.0.113.7', SAL)).not.toBe(resumirOrigem('203.0.113.8', SAL))
  })

  /* O teste que sustenta a rotacao: trocar o sal invalida tudo que veio antes. */
  it('o mesmo endereco com sal diferente da resumo diferente', () => {
    expect(resumirOrigem('203.0.113.7', SAL)).not.toBe(resumirOrigem('203.0.113.7', `${SAL}-2`))
  })

  it('o resumo NAO contem o endereco em lugar nenhum', () => {
    expect(resumirOrigem('203.0.113.7', SAL)).not.toContain('203.0.113')
  })

  it('sem sal, recusa em vez de resumir — resumo sem sal e reversivel em minutos', () => {
    expect(() => resumirOrigem('203.0.113.7', undefined)).toThrow(/SAL_DO_RESUMO_DE_ORIGEM/)
  })

  it('endereco vazio e recusado', () => {
    expect(() => resumirOrigem('  ', SAL)).toThrow(/vazio/)
  })
})
