/*
 * Carrega o .env para dentro do process.env sem dependencia nova.
 *
 * O Vitest so expoe automaticamente variaveis com prefixo do Vite, e as daqui
 * nao tem — de proposito, porque a chave de servico do projeto de teste nao pode
 * virar variavel de navegador nem por acidente.
 *
 * O ambiente tem precedencia sobre o arquivo: e assim que o CI passa os valores
 * como segredo, sem .env nenhum na maquina.
 */
import { readFileSync } from 'node:fs'

let carregado = false

export function carregarAmbiente(): void {
  if (carregado) return
  carregado = true
  let bruto: string
  try {
    bruto = readFileSync('.env', 'utf8')
  } catch {
    return /* Sem arquivo: o ambiente ja deve trazer tudo. `exigir` reclama se nao trouxer. */
  }
  for (const linha of bruto.split('\n')) {
    const corte = linha.indexOf('=')
    if (corte === -1 || linha.trimStart().startsWith('#')) continue
    const nome = linha.slice(0, corte).trim()
    if (process.env[nome]) continue
    process.env[nome] = linha
      .slice(corte + 1)
      .trim()
      .replace(/^"|"$/g, '')
  }
}

/**
 * Devolve o valor ou explode dizendo o NOME que falta — nunca o valor de
 * nenhuma variavel, nem em mensagem de erro (FR-021).
 */
export function exigir(nome: string): string {
  carregarAmbiente()
  const valor = process.env[nome]
  if (!valor) {
    throw new Error(
      `Falta a variavel ${nome}. Os testes de politica rodam contra o PROJETO DE ` +
        'TESTE, nunca o de producao. Ver README, secao "O banco de dados".'
    )
  }
  return valor
}
