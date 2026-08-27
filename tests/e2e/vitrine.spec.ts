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

/*
 * SC-018 — os seis pares botao/link com a MESMA aparencia calculada.
 *
 * "Verificado, nao olhado" (SC-018) tem uma exigencia embutida: o teste precisa
 * comparar o RESULTADO que o navegador calcula, e nao a classe que foi
 * aplicada. Duas classes com nomes diferentes e o mesmo resultado passam; duas
 * com o mesmo nome e resultados diferentes falham.
 *
 * A LISTA DE PROPRIEDADES E DERIVADA de src/componentes/ui/AparenciaDeBotao.module.css
 * — ver tests/e2e/apoio/propriedades-da-aparencia.ts para os dois motivos. Em
 * uma frase: lista digitada seria a cobertura, e lista de exclusoes seria o
 * mesmo defeito pelo avesso.
 *
 * Sao 3 variantes x 2 larguras = 6 pares. O teste reporta quantos pares e
 * quantas propriedades comparou: sem os dois contadores, "nenhuma divergencia"
 * e "comparei tres coisas" produzem a mesma saida verde.
 */
import { propriedadesDeclaradasNaAparencia } from './apoio/propriedades-da-aparencia'

test('os seis pares botao/link tem aparencia calculada identica', async ({ page }) => {
  await page.goto('/vitrine')

  const propriedades = propriedadesDeclaradasNaAparencia()
  /*
   * O par e identificado pelo CONTEINER, e nao por um atributo no controle.
   *
   * `Botao` e `LinkComAparenciaDeBotao` recusam pelo tipo o que nao esta no
   * contrato — `data-*` inclusive —, e essa recusa e parte do que faz a origem
   * unica valer. Marcar o conteiner foi a escolha: o teste se adapta ao
   * componente, nao o contrario. Afrouxar o tipo para o teste conseguir medir
   * seria medir outra coisa.
   */
  const pares = await page.locator('[data-par-visual]').evaluateAll((conteineres, lista) => {
    const resultado: { par: string; divergencias: string[]; comparadas: number }[] = []

    for (const conteiner of conteineres) {
      const par = conteiner.getAttribute('data-par-visual') ?? ''
      const botao = conteiner.querySelector('button')
      const link = conteiner.querySelector('a')

      if (!botao || !link) {
        resultado.push({
          par,
          divergencias: [`par incompleto: botao=${Boolean(botao)} link=${Boolean(link)}`],
          comparadas: 0,
        })
        continue
      }

      const estiloBotao = window.getComputedStyle(botao)
      const estiloLink = window.getComputedStyle(link)
      const divergencias: string[] = []
      for (const propriedade of lista) {
        const a = estiloBotao.getPropertyValue(propriedade)
        const b = estiloLink.getPropertyValue(propriedade)
        if (a !== b) divergencias.push(`${propriedade}: botao "${a}" contra link "${b}"`)
      }
      resultado.push({ par, divergencias, comparadas: lista.length })
    }
    return resultado
  }, propriedades)

  const divergentes = pares.filter((p) => p.divergencias.length > 0)
  console.log(
    `Pares visuais: ${pares.length}/6 · propriedades comparadas por par: ${propriedades.length} · ` +
      `pares divergentes: ${divergentes.length}`
  )
  for (const p of divergentes) console.log(`  ${p.par}: ${p.divergencias.join(' | ')}`)

  expect(propriedades.length, 'nenhuma propriedade derivada do CSS da aparencia').toBeGreaterThan(0)
  expect(pares.length, 'a vitrine nao expos os seis pares identificaveis').toBe(6)
  expect(divergentes.map((p) => `${p.par}: ${p.divergencias.join(' | ')}`)).toEqual([])
})

test('a vitrine mostra os quatro icones da uniao fechada', async ({ page }) => {
  await page.goto('/vitrine')

  const nomes = await page
    .locator('svg[data-icone]')
    .evaluateAll((svgs) => [...new Set(svgs.map((s) => s.getAttribute('data-icone') ?? ''))].sort())
  console.log(`Icones distintos na vitrine: ${nomes.length} — ${nomes.join(', ')}`)
  expect(nomes).toEqual(['abrir', 'email', 'fechar', 'instagram'])
})
