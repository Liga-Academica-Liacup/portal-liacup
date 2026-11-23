#!/usr/bin/env node
/*
 * Valida, em modo estrito, todas as specs e todas as changes em andamento, com
 * o OpenSpec PRESO no projeto (devDependency exata), e não com o global de quem
 * roda. Roda com `npm run verificar:specs`, na máquina e no CI.
 *
 * Por que existe, em vez de `openspec validate` direto no package.json: o
 * OpenSpec 2.1.0 tem duas saídas de rede, a telemetria de uso e a checagem de
 * versão no registro, e o Gabriel decidiu (Q3 (a) da completar-ci-do-novo-fluxo)
 * que as duas ficam desligadas. O `npm` no Windows roda o script no `cmd`, onde
 * `VAR=x comando` não funciona. Este script põe as três variáveis e chama o
 * binário do pacote com o `node`, sem shell, igual em todo terminal.
 *
 *   OPENSPEC_TELEMETRY=0        desliga a telemetria (dist/telemetry/opt-out.js)
 *   DO_NOT_TRACK=1              desliga a telemetria, a checagem de versão e a
 *                               telemetria da dependência `skills`
 *   OPENSPEC_NO_UPDATE_CHECK=1  desliga a checagem de versão no registro
 *
 * O contador (RP-12): a saída do OpenSpec termina em
 * `Totals: N passed, M failed (N items)`. Sem essa linha, ou com 0 itens, a
 * validação NÃO VERIFICOU nada, e o código é 1, e não 0.
 *
 * Ver openspec/changes/completar-ci-do-novo-fluxo/design.md, D3.
 */
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const PACOTE = '@fission-ai/openspec'

const SEM_REDE = {
  OPENSPEC_TELEMETRY: '0',
  DO_NOT_TRACK: '1',
  OPENSPEC_NO_UPDATE_CHECK: '1',
}

function naoVerificou(motivo) {
  console.error(`\nNÃO VERIFICADO — specs e changes do OpenSpec\n\n  ${motivo}\n`)
  process.exit(1)
}

/*
 * O pacote não exporta o package.json nem o bin: resolve a entrada dele, sobe
 * até a pasta do pacote e lê o `bin` declarado no package.json, pelo disco.
 */
function binarioDoOpenspec() {
  try {
    const entrada = createRequire(join(raiz, 'package.json')).resolve(PACOTE)
    let pasta = dirname(entrada)
    while (!pasta.endsWith(join('@fission-ai', 'openspec'))) {
      const acima = dirname(pasta)
      if (acima === pasta) return null
      pasta = acima
    }
    const { version, bin } = JSON.parse(readFileSync(join(pasta, 'package.json'), 'utf8'))
    const arquivo = typeof bin === 'string' ? bin : bin?.openspec
    return arquivo ? { caminho: join(pasta, arquivo), versao: version } : null
  } catch {
    return null
  }
}

const binario = binarioDoOpenspec()
if (!binario) {
  naoVerificou(`O pacote ${PACOTE} não está instalado. Rode \`npm ci\` antes.`)
}

console.log(`OpenSpec ${binario.versao}, do projeto · telemetria e checagem de versão desligadas`)

const { status, stdout, stderr, error } = spawnSync(
  process.execPath,
  [binario.caminho, 'validate', '--all', '--strict'],
  { cwd: raiz, encoding: 'utf8', env: { ...process.env, ...SEM_REDE } }
)

if (error) naoVerificou(`O OpenSpec não rodou: ${error.message}`)
process.stdout.write(stdout)
process.stderr.write(stderr)

const totais = /Totals: (\d+) passed, (\d+) failed \((\d+) items?\)/.exec(`${stdout}\n${stderr}`)
if (!totais) {
  naoVerificou('A saída não trouxe a linha "Totals": não se sabe quantos itens foram validados.')
}
if (Number(totais[3]) === 0) {
  naoVerificou('O OpenSpec validou 0 itens: nenhuma spec nem change foi lida.')
}

process.exit(status ?? 1)
