#!/usr/bin/env node
/*
 * Tira o print de página inteira de cada página da lista única de páginas
 * públicas (src/lib/utils/paginas-publicas.json), com o site PUBLICADO, em 390 e
 * 1280 px. Roda com `npm run prints:site`, depois de `npm run build`.
 *
 * Por que existe: quem confere o Portão 2 olha a tela sem rodar comando. O CI
 * guarda estes prints como anexo de cada execução (design.md da
 * completar-ci-do-novo-fluxo, D5). Página que entra na lista ganha print sem
 * ninguém editar este arquivo.
 *
 *   - sobe o `next start` no modo publicado por scripts/iniciar-servidor.mjs,
 *     como o Lighthouse, numa porta só dele (3002), e sempre o derruba no fim;
 *   - 390 × 844 e 1280 × 800, as medidas dos prints do protótipo;
 *   - movimento reduzido, e o print só com as fontes e as imagens carregadas;
 *   - grava em test-results/prints-do-site/<pagina>-<largura>.png, com `inicio`
 *     para `/`. A pasta já é ignorada, e é apagada no começo.
 *
 * O contador (RP-12): `páginas: P · larguras: 2 · prints: N`. Página com status
 * diferente de 200 dá código 1 e é nomeada. Lista vazia, ou N diferente de
 * P × 2, é NÃO VERIFICADO, também com código 1.
 */
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const PORTA = '3002'
const ORIGEM = `http://localhost:${PORTA}`
const PASTA = join(raiz, 'test-results', 'prints-do-site')
const LARGURAS = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
]
const PRINT = { fullPage: true, animations: 'disabled' }
const ESPERA_DO_SERVIDOR = 60_000

function naoVerificou(motivo) {
  console.error(`\nNÃO VERIFICADO — prints das páginas\n\n  ${motivo}\n`)
  return 1
}

/** `/` vira `inicio`; `/processo-seletivo` vira `processo-seletivo`. */
const nomeDaPagina = (endereco) =>
  endereco.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'inicio'

function lerPaginas() {
  const lista = JSON.parse(readFileSync(join(raiz, 'src/lib/utils/paginas-publicas.json'), 'utf8'))
  return Array.isArray(lista) ? lista.map(({ endereco }) => endereco) : []
}

/** Espera o servidor responder. Se ele terminar antes, ou o tempo acabar, devolve o motivo. */
async function esperarServidor(servidor) {
  const limite = Date.now() + ESPERA_DO_SERVIDOR
  while (Date.now() < limite) {
    if (servidor.exitCode !== null) return `o servidor terminou com código ${servidor.exitCode}`
    try {
      await fetch(`${ORIGEM}/`, { redirect: 'manual' })
      return null
    } catch {
      await new Promise((pronto) => setTimeout(pronto, 500))
    }
  }
  return `o servidor não respondeu em ${ESPERA_DO_SERVIDOR / 1000} s`
}

/*
 * No Windows, matar o processo do iniciar-servidor.mjs não alcança o `next
 * start` que ele abriu, e a porta ficaria presa: o `taskkill /T` derruba a
 * árvore. No Linux, o SIGTERM chega ao script, que o repassa ao Next.
 */
async function derrubarServidor(servidor) {
  if (servidor.exitCode !== null) return
  const terminou = new Promise((pronto) => servidor.once('exit', pronto))
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(servidor.pid), '/T', '/F'], { stdio: 'ignore' })
  } else {
    servidor.kill('SIGTERM')
  }
  await Promise.race([terminou, new Promise((pronto) => setTimeout(pronto, 10_000))])
}

async function tirarPrints(enderecos) {
  const falhas = []
  let prints = 0
  const navegador = await chromium.launch()
  try {
    for (const tamanho of LARGURAS) {
      const contexto = await navegador.newContext({
        viewport: tamanho,
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
      })
      const aba = await contexto.newPage()
      for (const endereco of enderecos) {
        const arquivo = `${nomeDaPagina(endereco)}-${tamanho.width}.png`
        try {
          const resposta = await aba.goto(`${ORIGEM}${endereco}`, { waitUntil: 'load' })
          const status = resposta?.status() ?? 'sem resposta'
          if (status !== 200) {
            falhas.push(`${endereco} em ${tamanho.width} px: status ${status}`)
            continue
          }
          await aba.evaluate(() => document.fonts.ready.then(() => true))
          await aba.waitForFunction(() => [...document.images].every((imagem) => imagem.complete))
          await aba.screenshot({ ...PRINT, path: join(PASTA, arquivo) })
          prints += 1
          console.log(`ok     ${arquivo}`)
        } catch (erro) {
          falhas.push(`${endereco} em ${tamanho.width} px: ${String(erro?.message).split('\n')[0]}`)
        }
      }
      await contexto.close()
    }
  } finally {
    await navegador.close()
  }
  return { prints, falhas }
}

async function principal() {
  const enderecos = lerPaginas()
  if (enderecos.length === 0) return naoVerificou('A lista única de páginas públicas está vazia.')

  rmSync(PASTA, { recursive: true, force: true })
  mkdirSync(PASTA, { recursive: true })

  const servidor = spawn(process.execPath, ['scripts/iniciar-servidor.mjs', 'publicado', PORTA], {
    cwd: raiz,
    stdio: ['ignore', 'ignore', 'inherit'],
  })
  try {
    const motivo = await esperarServidor(servidor)
    if (motivo) return naoVerificou(`O site não subiu: ${motivo}. Rode \`npm run build\` antes.`)

    const { prints, falhas } = await tirarPrints(enderecos)
    console.log(`\npáginas: ${enderecos.length} · larguras: ${LARGURAS.length} · prints: ${prints}`)
    for (const falha of falhas) console.error(`  falhou: ${falha}`)
    if (falhas.length > 0) return 1
    const esperados = enderecos.length * LARGURAS.length
    if (prints !== esperados) return naoVerificou(`Esperava ${esperados} prints; saíram ${prints}.`)
    return 0
  } finally {
    await derrubarServidor(servidor)
  }
}

process.exit(await principal())
