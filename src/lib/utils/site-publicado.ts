/*
 * Diz se o site esta publicado, a partir do valor da variavel SITE_PUBLICADO.
 *
 * So o texto exato `true` publica. Sem tirar espaco e sem ignorar maiuscula:
 * `TRUE`, ` true`, `1`, `sim`, vazio ou ausente deixam o site NAO publicado.
 * Um erro de digitacao na Vercel esconde o site, nunca o expoe antes da hora.
 *
 * Ver openspec/changes/interruptor-em-construcao/design.md, D2.
 */
export function sitePublicado(valor: string | undefined): boolean {
  return valor === 'true'
}
