/** Funcao pura generica. Nao conhece feature, nao conhece componente. */
export function formatarDataBrasileira(iso: string): string {
  const partes = iso.split('-')
  const [ano, mes, dia] = partes
  if (!ano || !mes || !dia) return iso
  return `${dia}/${mes}/${ano}`
}
