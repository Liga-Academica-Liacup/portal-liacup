/*
 * @vitest-environment node
 *
 * O ambiente dos testes de politica (change endurecer-agentes-e-git-local, D7).
 *
 * O carregador de tests/politicas/ambiente.ts so leva ao process.env os nomes da
 * lista, e `exigir` recusa nome fora dela antes de ler qualquer coisa. Este teste
 * roda no `npm test`, sem banco, contra um .env temporario no diretorio
 * temporario do sistema, com valores falsos. O .env real nao e lido: nenhum caso
 * chama `carregarAmbiente` sem caminho, nem `exigir` com nome da lista.
 *
 * O nome fora da lista e SEGREDO_FORA_DA_LISTA, e nao um segredo real do
 * projeto: com o nome real, o teste leria a variavel e a mensagem de uma
 * assercao que falhasse poderia mostrar o valor (D7, desvio do briefing).
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { carregarAmbiente, exigir, NOMES_DO_AMBIENTE } from '../politicas/ambiente'

const FORA_DA_LISTA = ['SEGREDO_FORA_DA_LISTA', 'OUTRA_VARIAVEL'] as const
const TODOS = [...NOMES_DO_AMBIENTE, ...FORA_DA_LISTA]

let pasta = ''
let numero = 0
let guardado: Record<string, string | undefined> = {}

/** Escreve um .env temporario novo, para cada caso ter um caminho ainda nao carregado. */
function arquivoTemporario(linhas: string[]): string {
  numero += 1
  const caminho = join(pasta, `env-${numero}`)
  writeFileSync(caminho, linhas.join('\n') + '\n', 'utf8')
  return caminho
}

const linhasDoArquivo = TODOS.map((nome) => `${nome}="valor-falso-de-${nome.toLowerCase()}"`)

beforeAll(() => {
  pasta = mkdtempSync(join(tmpdir(), 'liacup-ambiente-'))
})

afterAll(() => {
  rmSync(pasta, { recursive: true, force: true })
})

beforeEach(() => {
  guardado = Object.fromEntries(TODOS.map((nome) => [nome, process.env[nome]]))
  for (const nome of TODOS) delete process.env[nome]
})

afterEach(() => {
  for (const nome of TODOS) {
    const valor = guardado[nome]
    if (valor === undefined) delete process.env[nome]
    else process.env[nome] = valor
  }
})

describe('o ambiente dos testes de politica', () => {
  it('leva ao process.env so os tres nomes da lista', () => {
    carregarAmbiente(arquivoTemporario(['# comentario', ...linhasDoArquivo]))

    const entraram = TODOS.filter((nome) => process.env[nome] !== undefined)
    expect(entraram).toEqual([...NOMES_DO_AMBIENTE])
    for (const nome of FORA_DA_LISTA) expect(nome in process.env).toBe(false)
    expect(process.env.SUPABASE_TESTE_URL).toBe('valor-falso-de-supabase_teste_url')

    console.log(`variáveis no arquivo: ${linhasDoArquivo.length} · entraram: ${entraram.length}`)
  })

  it('mantem a precedencia do ambiente sobre o arquivo', () => {
    process.env.SUPABASE_TESTE_ANON_KEY = 'valor-falso-do-ambiente'
    carregarAmbiente(arquivoTemporario(linhasDoArquivo))
    expect(process.env.SUPABASE_TESTE_ANON_KEY).toBe('valor-falso-do-ambiente')
  })

  it('exigir recusa nome fora da lista, com o nome e a lista, sem valor', () => {
    process.env.SEGREDO_FORA_DA_LISTA = 'valor-falso-que-nao-pode-aparecer'
    let mensagem = ''
    try {
      exigir('SEGREDO_FORA_DA_LISTA')
    } catch (erro) {
      mensagem = erro instanceof Error ? erro.message : String(erro)
    }
    expect(mensagem).toContain('SEGREDO_FORA_DA_LISTA')
    for (const nome of NOMES_DO_AMBIENTE) expect(mensagem).toContain(nome)
    expect(mensagem).not.toContain('valor-falso')
  })
})
