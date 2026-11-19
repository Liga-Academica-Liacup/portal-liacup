import { defineConfig, devices } from '@playwright/test'

/*
 * As sete larguras vem do item C1 do docs/checklist-validacao.md e do FR-015.
 * Cada uma vira um projeto proprio, para que a saida diga QUAL largura falhou.
 */
export const LARGURAS = [360, 390, 430, 480, 768, 1024, 1280] as const

/*
 * Os dois modos do interruptor "em construcao" (src/proxy.ts), um servidor
 * para cada. A 3000 e o `baseURL`: fica PUBLICADA para que os specs da raiz e
 * da vitrine rodem sem nenhuma mudanca. A 3001 fica NAO publicada, que e o que
 * a producao mostra ate a R1. O spec do interruptor importa as duas origens.
 */
export const ORIGEM_PUBLICADO = 'http://localhost:3000'
export const ORIGEM_NAO_PUBLICADO = 'http://localhost:3001'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: ORIGEM_PUBLICADO,
    trace: 'on-first-retry',
  },
  projects: LARGURAS.map((largura) => ({
    name: `largura-${largura}`,
    use: { ...devices['Desktop Chrome'], viewport: { width: largura, height: 900 } },
  })),
  /*
   * Roda contra a versao COMPILADA, nunca contra o servidor de desenvolvimento:
   * em modo dev nao ha minificacao nem otimizacao de imagem, e o numero que sai
   * nao descreve o que o visitante recebe.
   *
   * Uma compilacao so, dois servidores. O Playwright sobe a lista NA ORDEM e
   * espera cada um responder antes do proximo: o primeiro compila e inicia, e
   * o segundo so inicia, com a compilacao do primeiro. O modo e lido quando o
   * servidor inicia, nao quando compila (design.md, D5).
   *
   * `false` explicito, e nao variavel ausente, na 3001: o `next start` le o
   * `.env.local` de quem roda, e quem tiver `SITE_PUBLICADO=true` ali veria a
   * 3001 publicada. O valor do processo vence o do arquivo.
   *
   * `stdout: 'pipe'` deixa a saida do build e do start aparecer no terminal,
   * para que se possa contar quantas vezes a compilacao rodou.
   */
  webServer: [
    {
      name: 'publicado-3000',
      command: 'npm run build && npm run start',
      url: ORIGEM_PUBLICADO,
      env: { SITE_PUBLICADO: 'true' },
      stdout: 'pipe',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    {
      name: 'nao-publicado-3001',
      command: 'npm run start -- -p 3001',
      url: ORIGEM_NAO_PUBLICADO,
      env: { SITE_PUBLICADO: 'false' },
      stdout: 'pipe',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
})
