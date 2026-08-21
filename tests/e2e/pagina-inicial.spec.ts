import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/*
 * Teste de ponta a ponta da pagina provisoria.
 *
 * Cobre quatro coisas que a spec exige: que a pagina carrega (FR-013), que o
 * axe-core nao acusa violacao (FR-014), que nao ha rolagem horizontal em nenhuma
 * das sete larguras (FR-015) e que o carregamento nao chama nenhum dominio
 * externo (FR-027, SC-014).
 *
 * Cada largura e um projeto do Playwright, entao a saida diz qual falhou.
 */

test('a pagina inicial carrega com a logo e a frase', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portal em construção')
  await expect(page.getByAltText('Logo da LIACUP')).toBeVisible()
})

test('exibe os links de contato com os enderecos corretos', async ({ page }) => {
  await page.goto('/')

  const linksDeContato = page.getByLabel('Canais de contato da LIACUP')

  await expect(linksDeContato.getByRole('link', { name: '@liacup.unb' })).toHaveAttribute(
    'href',
    'https://www.instagram.com/liacup.unb/'
  )
  await expect(linksDeContato.getByRole('link', { name: 'liacup.unb@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:liacup.unb@gmail.com'
  )
})

test('nao acusa nenhuma violacao de acessibilidade', async ({ page }) => {
  await page.goto('/')

  const resultado = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  // Imprime o numero para a evidencia: reportar numero, nao adjetivo.
  console.log(`Violacoes de acessibilidade: ${resultado.violations.length}`)
  expect(resultado.violations).toEqual([])
})

test('nao gera rolagem horizontal nesta largura', async ({ page }, informacoes) => {
  await page.goto('/')

  const medida = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

  expect(
    medida.scrollWidth,
    `${informacoes.project.name}: scrollWidth ${medida.scrollWidth} maior que clientWidth ${medida.clientWidth}`
  ).toBeLessThanOrEqual(medida.clientWidth)
})

test('nao faz nenhuma requisicao a dominio externo', async ({ page }) => {
  const externas: string[] = []

  page.on('request', (requisicao) => {
    const url = new URL(requisicao.url())
    const ehLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
    const ehDadoEmbutido = url.protocol === 'data:' || url.protocol === 'blob:'
    if (!ehLocal && !ehDadoEmbutido) externas.push(requisicao.url())
  })

  await page.goto('/', { waitUntil: 'networkidle' })

  console.log(`Requisicoes a dominio externo: ${externas.length}`)
  expect(externas, `Dominios externos chamados: ${externas.join(', ')}`).toEqual([])
})
