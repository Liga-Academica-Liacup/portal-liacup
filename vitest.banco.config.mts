import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

/*
 * Os testes que precisam do BANCO rodam separados dos de unidade, e por tres
 * motivos:
 *
 * 1. Eles precisam do PROJETO SUPABASE DE TESTE no ar. `npm test` tem de
 *    continuar rodando em qualquer maquina, inclusive sem banco.
 * 2. Eles falam com a rede, entao sao lentos por natureza.
 * 3. Ambiente `node`, nao `jsdom`: aqui nao ha componente nenhum.
 *
 * `isolate: false` e `singleFork` nao sao ajuste de desempenho: eles fazem os
 * arquivos compartilharem o mesmo contador de celulas. Com o isolamento padrao,
 * cada arquivo teria o seu, e o relatorio final diria um numero menor do que o
 * que a suite realmente exerceu.
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/politicas/**/*.test.ts', 'tests/banco/**/*.test.ts'],
    isolate: false,
    fileParallelism: false,
    pool: 'forks',
    maxForks: 1,
    minForks: 1,
    /* Sem isto, o contador de celulas do zz-relatorio nao aparece na saida — e
       um contador que ninguem le nao serve para nada (RP-12). */
    disableConsoleIntercept: true,
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
