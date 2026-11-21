#!/usr/bin/env node
/*
 * Mede desempenho e acessibilidade com o Lighthouse, nos dois modos do
 * interruptor. Roda com `npm run test:desempenho`, depois de `npm run build`.
 *
 *   1. site PUBLICADO: cada página da lista única de páginas públicas
 *      (src/lib/utils/paginas-publicas.json). Página que entra na lista passa
 *      a ser medida sem ninguém editar este arquivo;
 *   2. site NÃO publicado: só a raiz, que mostra "Portal em construção". É o
 *      que a produção mostra até a lancamento-r1.
 *
 * Cada modo sobe o servidor no modo explícito (scripts/iniciar-servidor.mjs),
 * para o `.env.local` de quem roda não trocar o modo. Limiar, preset e número
 * de execuções vêm do lighthouserc.json, que este script não repete: aqui só
 * entram, por argumento, os endereços e o comando de iniciar.
 *
 * A saída diz quantas páginas mediu em cada modo e a nota de cada execução.
 * Se um modo reprova, o script para e devolve o código de saída do lhci.
 *
 * Ver openspec/changes/layout-e-hero/design.md, D8.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const ORIGEM = 'http://localhost:3000'
const lerJson = (caminho) => JSON.parse(readFileSync(join(raiz, caminho), 'utf8'))
const MANIFESTO = join(raiz, '.lighthouseci', 'manifest.json')

const paginas = lerJson('src/lib/utils/paginas-publicas.json')
const executavelDoLhci = createRequire(import.meta.url).resolve('@lhci/cli/src/cli.js')

const MODOS = [
  {
    nome: 'site publicado',
    modo: 'publicado',
    urls: paginas.map((pagina) => `${ORIGEM}${pagina.endereco}`),
  },
  { nome: 'site não publicado', modo: 'nao-publicado', urls: [`${ORIGEM}/`] },
]

/** As notas de cada execução, lidas do que o lhci gravou em .lighthouseci/. */
function notasDaUltimaMedicao() {
  if (!existsSync(MANIFESTO)) return ['  (sem notas: o lhci não chegou a gravar o resultado)']
  return JSON.parse(readFileSync(MANIFESTO, 'utf8')).map(
    ({ url, summary }) =>
      `  ${url}: desempenho ${Math.round(summary.performance * 100)}, ` +
      `acessibilidade ${Math.round(summary.accessibility * 100)}`
  )
}

const resumo = []

for (const { nome, modo, urls } of MODOS) {
  console.log(`\n[desempenho · ${nome}] páginas a medir: ${urls.length} (${urls.join(', ')})\n`)

  // Apagado antes, para a nota impressa nunca ser a do modo anterior.
  rmSync(MANIFESTO, { force: true })

  // Sem shell: cada argumento vai inteiro, com espaço e tudo, em qualquer terminal.
  const { status } = spawnSync(
    process.execPath,
    [
      executavelDoLhci,
      'autorun',
      '--config=lighthouserc.json',
      `--collect.startServerCommand=node scripts/iniciar-servidor.mjs ${modo}`,
      ...urls.map((url) => `--collect.url=${url}`),
    ],
    { cwd: raiz, stdio: 'inherit' }
  )

  const notas = notasDaUltimaMedicao()
  resumo.push(`[desempenho · ${nome}] páginas medidas: ${urls.length}`, ...notas)

  if (status !== 0) {
    console.log(`\n${resumo.join('\n')}`)
    console.error(`\nO Lighthouse reprovou no modo "${nome}" (código ${status}).`)
    process.exit(status ?? 1)
  }
}

console.log(`\n${resumo.join('\n')}`)
