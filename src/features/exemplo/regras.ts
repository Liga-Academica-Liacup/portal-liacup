/*
 * Regra de negocio pura: sem banco, sem React, sem efeito colateral.
 * E assim que ela vira testavel de verdade — ver regras.test.ts.
 */
import type { Exemplo } from './tipos'

/** So o que esta publicado aparece para quem visita o site. */
export function apenasPublicados(itens: readonly Exemplo[]): Exemplo[] {
  return itens.filter((item) => item.publicado)
}

/** Mais recente primeiro. Ordena uma copia: a entrada nao e alterada. */
export function ordenarPorMaisRecente(itens: readonly Exemplo[]): Exemplo[] {
  return [...itens].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
}
