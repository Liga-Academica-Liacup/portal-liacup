/*
 * Carrega do .env para dentro do process.env, sem dependencia nova, so os nomes
 * que os testes de politica usam.
 *
 * O Vitest so expoe automaticamente variaveis com prefixo do Vite, e as daqui
 * nao tem — de proposito, porque a chave de servico do projeto de teste nao pode
 * virar variavel de navegador nem por acidente.
 *
 * O ambiente tem precedencia sobre o arquivo: e assim que o CI passa os valores
 * como segredo, sem .env nenhum na maquina.
 *
 * Fora da lista, nada do arquivo entra no process.env, e `exigir` recusa o nome
 * antes de ler o ambiente (endurecer-agentes-e-git-local, D7). Nome novo entra
 * na lista por change, e a lista esta no diff que o guardiao le.
 */
import { readFileSync } from 'node:fs'

/** Os unicos nomes que os testes de politica leem do ambiente. */
export const NOMES_DO_AMBIENTE = [
  'SUPABASE_TESTE_URL',
  'SUPABASE_TESTE_ANON_KEY',
  'SUPABASE_TESTE_SERVICE_ROLE_KEY',
] as const

const permitidos: ReadonlySet<string> = new Set(NOMES_DO_AMBIENTE)
const carregados = new Set<string>()

export function carregarAmbiente(caminho = '.env'): void {
  if (carregados.has(caminho)) return
  carregados.add(caminho)
  let bruto: string
  try {
    bruto = readFileSync(caminho, 'utf8')
  } catch {
    return /* Sem arquivo: o ambiente ja deve trazer tudo. `exigir` reclama se nao trouxer. */
  }
  for (const linha of bruto.split('\n')) {
    const corte = linha.indexOf('=')
    if (corte === -1 || linha.trimStart().startsWith('#')) continue
    const nome = linha.slice(0, corte).trim()
    if (!permitidos.has(nome)) continue
    if (process.env[nome]) continue
    process.env[nome] = linha
      .slice(corte + 1)
      .trim()
      .replace(/^"|"$/g, '')
  }
}

/**
 * Devolve o valor ou explode dizendo o NOME que falta — nunca o valor de
 * nenhuma variavel, nem em mensagem de erro (FR-021). Nome fora da lista e
 * recusado antes de qualquer leitura, do arquivo ou do ambiente.
 */
export function exigir(nome: string): string {
  if (!permitidos.has(nome)) {
    throw new Error(
      `A variavel ${nome} nao esta na lista dos testes de politica ` +
        `(${NOMES_DO_AMBIENTE.join(', ')}). Nome novo entra na lista por change.`
    )
  }
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
