/*
 * @vitest-environment node
 *
 * O teste da verificação das ações presas (change ajustar-ci-ao-novo-fluxo, D4).
 *
 * O script sempre confere a pasta atual ao ser carregado, sem teste de "fui chamado
 * direto?". Então cada caso monta uma pasta temporária com os fluxos do caso e roda
 * o script como processo dentro dela, conferindo o código de saída e a saída. Nenhum
 * caso lê o .github deste repositório.
 *
 * O contador no fim diz quantos casos foram conferidos, porque um arquivo sem caso
 * também passaria (RP-12).
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, it } from 'vitest'

const SCRIPT = fileURLToPath(new URL('../../scripts/verificar-acoes-presas.mjs', import.meta.url))
const SHA = 'a'.repeat(40)
const pastas = []

let casos = 0
const caso = (nome, corpo) =>
  it(nome, () => {
    corpo()
    casos++
  })

// Monta uma pasta com os arquivos dados ({ caminho: texto }) e roda o script nela.
function rodar(arquivos) {
  const raiz = mkdtempSync(join(tmpdir(), 'acoes-presas-'))
  pastas.push(raiz)
  for (const [caminho, texto] of Object.entries(arquivos)) {
    const destino = join(raiz, ...caminho.split('/'))
    mkdirSync(dirname(destino), { recursive: true })
    writeFileSync(destino, texto)
  }
  const processo = spawnSync(process.execPath, [SCRIPT], { cwd: raiz, encoding: 'utf8' })
  return { codigo: processo.status, saida: processo.stdout }
}

const fluxo = (...usos) =>
  [
    'name: CI',
    'jobs:',
    '  x:',
    '    steps:',
    ...usos.map((uso) => `      - uses: ${uso}`),
    '',
  ].join('\n')

afterAll(() => pastas.forEach((pasta) => rmSync(pasta, { recursive: true, force: true })))

describe('a forma aceita', () => {
  caso('ação presa por commit, com a versão no comentário: verde', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo(`actions/checkout@${SHA} # v4.4.0`),
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain(
      'arquivos: 1 · referências: 1 · presas por commit: 1 · locais: 0 · fora da regra: 0'
    )
  })
  caso('com aspas, com caminho dentro do repositório e num job reutilizável: verde', () => {
    const resultado = rodar({
      '.github/workflows/a.yaml': [
        'jobs:',
        `  x:\n    uses: dono/repo/.github/workflows/y.yml@${SHA} # v1`,
        '  z:',
        '    steps:',
        `      - uses: 'dono/repo/sub@${SHA}' # v2.0.1`,
        `      - "uses": "dono/repo@${SHA}"   #   v3`,
        '',
      ].join('\n'),
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain('referências: 3 · presas por commit: 3')
  })
  caso('ação local conta à parte, e docker com digest conta como presa', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo(
        './.github/actions/x',
        `docker://alpine@sha256:${'b'.repeat(64)}`
      ),
      '.github/actions/x/action.yml': `runs:\n  steps:\n    - uses: dono/repo@${SHA} # v1\n`,
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain(
      'arquivos: 2 · referências: 3 · presas por commit: 2 · locais: 1 · fora da regra: 0'
    )
  })
  caso('mapa de uma linha, presa por commit, com uses depois de { e de vírgula: verde', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': [
        'jobs:',
        '  x:',
        '    steps:',
        `      - { uses: dono/repo@${SHA} } # v1`,
        `      - {uses: 'dono/repo/sub@${SHA}', with: { a: b }}   #  v2.0.1`,
        `      - { name: Baixar, uses: dono/repo@${SHA} } # v3`,
        '',
      ].join('\n'),
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain(
      'arquivos: 1 · referências: 3 · presas por commit: 3 · locais: 0 · fora da regra: 0'
    )
  })
  caso('lista de uma linha, presa por commit, com uma ou duas ações: verde', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': [
        'jobs:',
        '  x:',
        `    steps: [{ uses: dono/repo@${SHA} }] # v1`,
        '  y:',
        `    steps: [{ name: A, uses: "dono/repo@${SHA}" }, {uses: dono/b@${SHA}}]   # v2.0.1`,
        `  z: { runs-on: ubuntu-latest, steps: [ { uses: dono/c@${SHA} } ] } # v3`,
        '',
      ].join('\n'),
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain(
      'arquivos: 1 · referências: 4 · presas por commit: 4 · locais: 0 · fora da regra: 0'
    )
  })
  caso('mapa de uma linha depois de uma chave e item de item, presos por commit: verde', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': [
        'jobs:',
        `  x: { uses: dono/repo/.github/workflows/y.yml@${SHA} } # v1`,
        '  z:',
        '    steps:',
        `      - - uses: dono/repo@${SHA} # v2`,
        `      - { name: 'a, b {c}', uses: dono/d@${SHA}, with: { x: "[1]" } } # v3`,
        '',
      ].join('\n'),
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain('referências: 3 · presas por commit: 3 · locais: 0')
  })
  caso('ação local fora de .github/actions, presa por commit: lida e verde', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo('./acoes/preparar', './acoes/preparar/'),
      'acoes/preparar/action.yaml': [
        'runs:',
        '  using: composite',
        `  steps: [{ uses: dono/repo@${SHA} }] # v1`,
        '',
      ].join('\n'),
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain(
      'arquivos: 2 · referências: 3 · presas por commit: 1 · locais: 2 · fora da regra: 0'
    )
  })
  caso('ação local que cita outra ação local, em outra pasta: as duas lidas, verde', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo('./a'),
      'a/action.yml': 'runs:\n  steps:\n    - uses: ./b/c\n',
      'b/c/action.yml': `runs:\n  steps:\n    - uses: dono/repo@${SHA} # v1\n`,
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain(
      'arquivos: 3 · referências: 3 · presas por commit: 1 · locais: 2 · fora da regra: 0'
    )
  })
  caso('linha comentada e texto que só cita uses: não contam', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': [
        'jobs:',
        '  x:',
        '    steps:',
        '      # - uses: actions/checkout@v4',
        '      - run: echo "uses: actions/checkout@v4"',
        `      - uses: dono/repo@${SHA} # v1`,
        '',
      ].join('\n'),
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain('referências: 1 ·')
  })
})

describe('o que fica fora da regra', () => {
  caso('presa por etiqueta: vermelho, com arquivo e linha', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo(`dono/repo@${SHA} # v1`, 'actions/checkout@v4'),
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain(
      '.github/workflows/ci.yml:6 · presa por etiqueta ou ramo (@v4)'
    )
    expect(resultado.saida).toContain(
      'referências: 2 · presas por commit: 1 · locais: 0 · fora da regra: 1'
    )
  })
  caso('mapa de uma linha presa por etiqueta, ou por commit sem a versão: vermelho', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': [
        'jobs:',
        '  x:',
        '    steps:',
        '      - { uses: actions/checkout@v4 }',
        '      - {uses: actions/checkout@v4}',
        '      - { name: Preparar, uses: "actions/setup-node@v4", with: { node-version: 22 } }',
        `      - { uses: dono/repo@${SHA} }`,
        '',
      ].join('\n'),
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain('ci.yml:4 · presa por etiqueta ou ramo (@v4)')
    expect(resultado.saida).toContain('ci.yml:5 · presa por etiqueta ou ramo (@v4)')
    expect(resultado.saida).toContain('ci.yml:6 · presa por etiqueta ou ramo (@v4)')
    expect(resultado.saida).toContain('ci.yml:7 · presa por commit, sem a versão')
    expect(resultado.saida).toContain(
      'referências: 4 · presas por commit: 0 · locais: 0 · fora da regra: 4'
    )
  })
  caso('lista de uma linha presa por etiqueta: vermelho, com cada ação da linha', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': [
        'jobs:',
        '  x:',
        '    steps: [{ uses: actions/x@v1 }]',
        `    outro: [{ uses: dono/repo@${SHA} }, { name: B, uses: 'actions/y@main' }] # v1`,
        '  z: { steps: [ { uses: actions/z@v2, with: { a: 1 } } ] }',
        '',
      ].join('\n'),
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain(
      '.github/workflows/ci.yml:3 · presa por etiqueta ou ramo (@v1)'
    )
    expect(resultado.saida).toContain('ci.yml:4 · presa por etiqueta ou ramo (@main)')
    expect(resultado.saida).toContain('ci.yml:5 · presa por etiqueta ou ramo (@v2)')
    expect(resultado.saida).toContain(
      'referências: 4 · presas por commit: 1 · locais: 0 · fora da regra: 3'
    )
  })
  caso(
    'mapa de uma linha depois de uma chave, e item de item, presos por etiqueta: vermelho',
    () => {
      const resultado = rodar({
        '.github/workflows/ci.yml': [
          'jobs:',
          '  x: { uses: dono/repo/.github/workflows/y.yml@v1 }',
          '  z:',
          '    steps:',
          '      - - uses: actions/x@v4',
          '      - { name: "a, {b}", uses: actions/y@v4 }',
          '      - { uses: { a: b } }',
          '',
        ].join('\n'),
      })
      expect(resultado.codigo).toBe(1)
      expect(resultado.saida).toContain('ci.yml:2 · presa por etiqueta ou ramo (@v1)')
      expect(resultado.saida).toContain('ci.yml:5 · presa por etiqueta ou ramo (@v4)')
      expect(resultado.saida).toContain('ci.yml:6 · presa por etiqueta ou ramo (@v4)')
      expect(resultado.saida).toContain('ci.yml:7 · referência sem a forma dono/repo@<ref>')
      expect(resultado.saida).toContain('fora da regra: 4')
    }
  )
  caso('ação local fora de .github/actions, presa por etiqueta: vermelho, na linha dela', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo(`dono/repo@${SHA} # v1`, './acoes/preparar'),
      'acoes/preparar/action.yml': [
        'runs:',
        '  using: composite',
        '  steps:',
        '    - uses: actions/setup-node@v4',
        '    - { uses: actions/cache@v4 }',
        '',
      ].join('\n'),
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain(
      'acoes/preparar/action.yml:4 · presa por etiqueta ou ramo (@v4)'
    )
    expect(resultado.saida).toContain(
      'acoes/preparar/action.yml:5 · presa por etiqueta ou ramo (@v4)'
    )
    expect(resultado.saida).toContain(
      'arquivos: 2 · referências: 4 · presas por commit: 1 · locais: 1 · fora da regra: 2'
    )
  })
  caso('ação local sem definição, ou fora do repositório: vermelho', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo('./nao-existe', './../fora', './x/../../fora'),
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain(
      'ci.yml:5 · ação local sem action.yml nem action.yaml (./nao-existe)'
    )
    expect(resultado.saida).toContain('ci.yml:6 · ação local fora do repositório (./../fora)')
    expect(resultado.saida).toContain('ci.yml:7 · ação local fora do repositório')
    expect(resultado.saida).toContain('locais: 0 · fora da regra: 3')
  })
  caso('presa por ramo e por sha curto: vermelho', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo('dono/repo@main', `dono/repo@${SHA.slice(0, 7)} # v1`),
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain('ci.yml:5 · presa por etiqueta ou ramo (@main)')
    expect(resultado.saida).toContain('ci.yml:6 · presa por etiqueta ou ramo')
    expect(resultado.saida).toContain('fora da regra: 2')
  })
  caso('presa por commit sem o comentário, ou com comentário que não é versão: vermelho', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo(`dono/repo@${SHA}`, `dono/repo@${SHA} # fixado`),
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain('ci.yml:5 · presa por commit, sem a versão')
    expect(resultado.saida).toContain('ci.yml:6 · presa por commit, sem a versão')
  })
  caso('sem referência e docker sem digest: vermelho', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo('actions/checkout', 'docker://alpine:3'),
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain('ci.yml:5 · referência sem a forma dono/repo@<ref>')
    expect(resultado.saida).toContain('ci.yml:6 · imagem docker sem @sha256:<64 hex>')
  })
  caso('uses: sem valor na linha (bloco de várias linhas): vermelho', () => {
    const resultado = rodar({ '.github/workflows/ci.yml': fluxo('', '>-') })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain('ci.yml:5 · valor que a verificação não sabe ler')
    expect(resultado.saida).toContain('ci.yml:6 · referência sem a forma dono/repo@<ref>')
  })
  caso('ação presa por etiqueta dentro de .github/actions também conta', () => {
    const resultado = rodar({
      '.github/workflows/ci.yml': fluxo(`dono/repo@${SHA} # v1`),
      '.github/actions/a/b/action.yaml': 'runs:\n  steps:\n    - uses: dono/repo@v2\n',
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain(
      '.github/actions/a/b/action.yaml:3 · presa por etiqueta ou ramo'
    )
  })
})

describe('o que não verifica', () => {
  caso('sem nenhum arquivo de fluxo: não verificado, com código 1', () => {
    const resultado = rodar({
      'README.md': 'nada\n',
      '.github/workflows/notas.txt': 'uses: x@v1\n',
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain('NAO VERIFICADO')
    expect(resultado.saida).toContain('arquivos: 0 · referências: 0')
  })
})

/*
 * process.stdout, e não console.log: o Vitest esconde o console.log, e o contador
 * precisa aparecer na saída de `npm test` (o mesmo de src/lib/utils/site-publicado.test.ts).
 */
afterAll(() => {
  process.stdout.write(`casos da verificação das ações presas: ${casos}
`)
})

// Roda por último no arquivo: a ordem dos testes de um arquivo é a de declaração.
it('a verificação das ações presas conferiu pelo menos um caso', () => {
  expect(casos).toBeGreaterThan(0)
})
