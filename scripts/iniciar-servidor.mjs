#!/usr/bin/env node
/*
 * Inicia a versão compilada do site (`next start`) num modo do interruptor
 * escolhido de propósito, e não no que estiver no `.env.local` de quem roda.
 *
 *   node scripts/iniciar-servidor.mjs publicado        site publicado
 *   node scripts/iniciar-servidor.mjs nao-publicado    site não publicado
 *   node scripts/iniciar-servidor.mjs publicado 3001   em outra porta
 *
 * Por que existe: o Lighthouse mede o site nos dois modos (design.md da
 * layout-e-hero, D8). Escrever `SITE_PUBLICADO=true npm run start` funciona no
 * Git Bash e no Linux do CI, mas não no `cmd` do Windows. Em vez de acrescentar
 * uma dependência só para isso (RP-01), este script põe a variável e inicia o
 * Next, igual em todo terminal. O valor do processo vence o do `.env.local`.
 *
 * Precisa de `npm run build` antes, como o `npm run start`.
 */
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'

const MODOS = { publicado: 'true', 'nao-publicado': 'false' }

const [modo, porta = '3000'] = process.argv.slice(2)

if (!(modo in MODOS)) {
  console.error(
    `Modo "${modo ?? ''}" desconhecido. Use "publicado" ou "nao-publicado". ` +
      'Ex.: node scripts/iniciar-servidor.mjs publicado'
  )
  process.exit(1)
}

const executavelDoNext = createRequire(import.meta.url).resolve('next/dist/bin/next')

console.log(`Iniciando o site com SITE_PUBLICADO=${MODOS[modo]} (${modo}), na porta ${porta}.`)

const servidor = spawn(process.execPath, [executavelDoNext, 'start', '-p', porta], {
  stdio: 'inherit',
  env: { ...process.env, SITE_PUBLICADO: MODOS[modo] },
})

servidor.on('exit', (codigo) => process.exit(codigo ?? 0))
for (const sinal of ['SIGINT', 'SIGTERM']) {
  process.on(sinal, () => servidor.kill(sinal))
}
