import { defineConfig, devices } from '@playwright/test'

/*
 * As sete larguras vem do item C1 do docs/checklist-validacao.md e do FR-015.
 * Cada uma vira um projeto proprio, para que a saida diga QUAL largura falhou.
 */
export const LARGURAS = [360, 390, 430, 480, 768, 1024, 1280] as const

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:3000',
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
   */
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
