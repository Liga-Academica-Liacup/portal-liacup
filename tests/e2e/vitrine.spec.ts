import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/*
 * As quatro verificações da vitrine (contracts/vitrine.md).
 *
 * Cada largura é um projeto do Playwright, então a saída diz qual falhou.
 * Todas imprimem números — o critério do projeto é reportar número, não
 * adjetivo.
 */

test('a vitrine carrega com uma seção por componente', async ({ page }) => {
  await page.goto('/vitrine')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Vitrine do design system')

  const secoes = await page.getByRole('heading', { level: 2 }).count()
  console.log(`Seções de componente na vitrine: ${secoes}`)
  expect(secoes).toBeGreaterThanOrEqual(8)
})

test('não acusa nenhuma violação de acessibilidade', async ({ page }) => {
  await page.goto('/vitrine')

  const resultado = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  console.log(`Violacoes de acessibilidade na vitrine: ${resultado.violations.length}`)
  if (resultado.violations.length > 0) {
    console.log(resultado.violations.map((v) => `${v.id}: ${v.help}`).join('\n'))
  }
  expect(resultado.violations).toEqual([])
})

test('nenhum alvo de toque abaixo de 44 px', async ({ page }, informacoes) => {
  await page.goto('/vitrine')

  const medicao = await page.evaluate(() => {
    const ALVO_MINIMO = 44
    const seletor = 'a, button, input, textarea, select, [role="button"]'
    const pequenos: string[] = []
    let medidos = 0

    for (const elemento of Array.from(document.querySelectorAll(seletor))) {
      const caixa = elemento.getBoundingClientRect()
      const estilo = window.getComputedStyle(elemento)

      /* Elemento escondido ou de dimensão zero não é alvo de toque de ninguém.
         Ignorá-lo evita falso positivo — e falso positivo destrói a confiança
         na verificação. */
      const escondido =
        estilo.display === 'none' ||
        estilo.visibility === 'hidden' ||
        (caixa.width === 0 && caixa.height === 0)
      if (escondido) continue

      medidos += 1
      if (caixa.width < ALVO_MINIMO || caixa.height < ALVO_MINIMO) {
        const identificacao = elemento.getAttribute('aria-label') ?? elemento.textContent ?? ''
        pequenos.push(
          `${elemento.tagName.toLowerCase()} "${identificacao.trim().slice(0, 30)}" ` +
            `${Math.round(caixa.width)}x${Math.round(caixa.height)}`
        )
      }
    }
    return { medidos, pequenos }
  })

  /* O contador existe pelo mesmo motivo que o verificador de tokens imprime
     quantos arquivos varreu: sem ele, "nenhum abaixo de 44" e "não mediu nada"
     produzem a mesma saída verde. */
  console.log(
    `[${informacoes.project.name}] Alvos de toque medidos: ${medicao.medidos} · ` +
      `abaixo de 44 px: ${medicao.pequenos.length}`
  )

  expect(medicao.medidos, 'o teste precisa ter medido alguma coisa').toBeGreaterThan(0)
  expect(medicao.pequenos, `alvos abaixo de 44 px: ${medicao.pequenos.join(' | ')}`).toEqual([])
})

test('não gera rolagem horizontal nesta largura', async ({ page }, informacoes) => {
  await page.goto('/vitrine')

  const medida = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

  expect(
    medida.scrollWidth,
    `${informacoes.project.name}: scrollWidth ${medida.scrollWidth} maior que clientWidth ${medida.clientWidth}`
  ).toBeLessThanOrEqual(medida.clientWidth)
})

test('nenhum link do site público leva à vitrine', async ({ page }) => {
  await page.goto('/')

  const paraVitrine = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a'))
      .map((a) => a.getAttribute('href') ?? '')
      .filter((href) => href.includes('/vitrine'))
  )

  console.log(`Links da pagina publica apontando para /vitrine: ${paraVitrine.length}`)
  expect(
    paraVitrine,
    `a vitrine nao pode ser alcancavel pela navegacao publica; encontrados: ${paraVitrine.join(', ')}`
  ).toEqual([])
})

test('a vitrine não é indexada por buscador', async ({ page }) => {
  await page.goto('/vitrine')
  const robots = await page.locator('meta[name="robots"]').getAttribute('content')
  console.log(`meta robots da vitrine: ${robots}`)
  expect(robots).toContain('noindex')
})

/*
 * FR-008 — foco visível. O axe-core NÃO testa isto: não há regra de axe para
 * visibilidade de anel de foco. Percorre a página inteira por Tab e exige que
 * cada elemento alcançado tenha contorno próprio, e não o padrão do navegador
 * removido pelo reset.
 */
test('todo elemento alcançável por Tab tem foco visível', async ({ page }, informacoes) => {
  await page.goto('/vitrine')

  const resultado = await page.evaluate(() => {
    const seletor = 'a, button, input, textarea, select, [role="button"]'
    const semFoco: string[] = []
    let verificados = 0

    for (const elemento of Array.from(document.querySelectorAll(seletor))) {
      const alvo = elemento as HTMLElement
      if (alvo.hasAttribute('disabled')) continue
      alvo.focus()
      if (document.activeElement !== alvo) continue

      verificados += 1
      const estilo = window.getComputedStyle(alvo)
      const temContorno = estilo.outlineStyle !== 'none' && parseFloat(estilo.outlineWidth) > 0
      const temSombra = estilo.boxShadow !== 'none'
      if (!temContorno && !temSombra) {
        semFoco.push(
          `${alvo.tagName.toLowerCase()} "${(alvo.textContent ?? '').trim().slice(0, 24)}"`
        )
      }
    }
    return { verificados, semFoco }
  })

  console.log(
    `[${informacoes.project.name}] Elementos com foco verificado: ${resultado.verificados} · ` +
      `sem foco visível: ${resultado.semFoco.length}`
  )

  expect(resultado.verificados, 'o teste precisa ter focado alguma coisa').toBeGreaterThan(0)
  expect(resultado.semFoco, `sem foco visível: ${resultado.semFoco.join(' | ')}`).toEqual([])
})
