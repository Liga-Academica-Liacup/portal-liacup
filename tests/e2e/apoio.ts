/*
 * Apoio comum aos specs da moldura, do menu e da inicial (layout-e-hero, D7).
 *
 * Não é spec: o Playwright só roda arquivos `*.spec.ts`. Fica aqui o que os
 * três usam igual, para que o limiar e as etiquetas do axe morem num lugar só.
 */
import type { Page, Request } from '@playwright/test'

/* As etiquetas dos specs que já existiam, mais a WCAG 2.2 AA. Nunca menos. */
export const TAGS_DO_AXE = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

/* RP-04 e constitution, princípio 2. */
export const ALVO_MINIMO = 44

/* Constitution: campo de formulário com fonte de 16 px. */
export const FONTE_MINIMA_DE_CAMPO = 16

/* A primeira linha da mensagem de um erro do expect, para o resumo da falha. */
export function primeiraLinha(erro: unknown): string {
  const texto = erro instanceof Error ? erro.message : String(erro)
  return texto.split('\n').find((linha) => linha.trim() !== '') ?? texto
}

/* Pedido que sai da máquina: nem localhost, nem dado embutido na página. */
export function ehPedidoExterno(pedido: Request): boolean {
  const url = new URL(pedido.url())
  const ehLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
  const ehDadoEmbutido = url.protocol === 'data:' || url.protocol === 'blob:'
  return !ehLocal && !ehDadoEmbutido
}

/*
 * Conta os pedidos feitos enquanto `acao` roda: todos e os externos. Conta os
 * dois porque "0 externos" só diz alguma coisa ao lado de "n pedidos feitos".
 */
export async function contarPedidos(
  page: Page,
  acao: () => Promise<void>
): Promise<{ total: number; externos: string[] }> {
  const externos: string[] = []
  let total = 0
  const aoPedir = (pedido: Request) => {
    total += 1
    if (ehPedidoExterno(pedido)) externos.push(pedido.url())
  }
  page.on('request', aoPedir)
  try {
    await acao()
  } finally {
    page.off('request', aoPedir)
  }
  return { total, externos }
}

/* Espera as animações de um elemento terminarem (a gaveta do menu entra deslizando). */
export async function esperarAnimacoes(page: Page, seletor: string): Promise<void> {
  await page
    .locator(seletor)
    .evaluate((elemento) =>
      Promise.all(elemento.getAnimations({ subtree: true }).map((animacao) => animacao.finished))
    )
}
