/*
 * Esquemas de validacao compartilhados entre tela e servidor.
 *
 * Na F00 nao ha formulario nem escrita, entao aqui fica so a forma do arquivo.
 * O Zod entra junto com a primeira feature que recebe dado do usuario, e o
 * mesmo esquema passa a ser usado nos dois lados — e o que impede a validacao
 * do cliente e a do servidor de divergirem com o tempo (secao 4 dos padroes).
 */
export type ResultadoDaValidacao<T> =
  { valido: true; dados: T } | { valido: false; erros: readonly string[] }

export function textoNaoVazio(valor: string): ResultadoDaValidacao<string> {
  const limpo = valor.trim()
  if (limpo.length === 0) {
    return { valido: false, erros: ['Este campo é obrigatório.'] }
  }
  return { valido: true, dados: limpo }
}
