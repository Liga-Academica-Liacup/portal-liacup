/*
 * Teste da regra de negocio pura. Roda sem banco e sem React — que e exatamente
 * o motivo de regras.ts existir separado de dados.ts (secao 4 dos padroes).
 */
import { describe, expect, it } from 'vitest'
import { apenasPublicados, ordenarPorMaisRecente } from './regras'
import type { Exemplo } from './tipos'

const item = (id: string, publicado: boolean, criadoEm: string): Exemplo => ({
  id,
  titulo: `Item ${id}`,
  publicado,
  criadoEm,
})

describe('apenasPublicados', () => {
  it('devolve so o que esta publicado', () => {
    const entrada = [item('1', true, '2026-08-20'), item('2', false, '2026-08-19')]
    expect(apenasPublicados(entrada).map((i) => i.id)).toEqual(['1'])
  })

  it('devolve lista vazia quando nada esta publicado', () => {
    expect(apenasPublicados([item('1', false, '2026-08-20')])).toEqual([])
  })

  it('aguenta lista vazia', () => {
    expect(apenasPublicados([])).toEqual([])
  })
})

describe('ordenarPorMaisRecente', () => {
  it('coloca o mais recente primeiro', () => {
    const entrada = [item('antigo', true, '2026-01-01'), item('novo', true, '2026-08-20')]
    expect(ordenarPorMaisRecente(entrada).map((i) => i.id)).toEqual(['novo', 'antigo'])
  })

  it('nao altera a lista recebida', () => {
    const entrada = [item('a', true, '2026-01-01'), item('b', true, '2026-08-20')]
    ordenarPorMaisRecente(entrada)
    expect(entrada.map((i) => i.id)).toEqual(['a', 'b'])
  })

  it('aguenta lista de um item so', () => {
    expect(ordenarPorMaisRecente([item('unico', true, '2026-05-05')])).toHaveLength(1)
  })
})
