/*
 * A matriz pública: 10 destinos × 7 larguras = 70 combinações.
 *
 * SUBSTITUI `pagina-inicial.spec.ts`, e a substituição é o ponto.
 *
 * Aquele arquivo media **uma** página, com o caminho `/` escrito à mão em cada
 * `page.goto`. Enquanto o site tinha uma página só, media 100% do site. A F03
 * entrega dez, e um teste com o caminho escrito à mão continuaria verde tendo
 * medido 1 de 10 — o SC-004 lê-se como cumprido e nove páginas nunca são
 * olhadas. Foi a frase do encerramento da Fase 0: *cada verificação media
 * corretamente uma página incompleta*.
 *
 * Por isso os casos aqui são DERIVADOS do catálogo canônico. Acrescentar um
 * destino ao JSON faz aparecerem sete casos novos, sem tocar neste arquivo — e
 * se a rota não existir, eles ficam vermelhos nomeando o caminho (FR-044,
 * SC-017).
 *
 * A largura vem do projeto do Playwright, um por largura, para a saída dizer
 * QUAL largura falhou.
 */
import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import {
  DESTINOS_PUBLICOS,
  conversaoPrincipal,
} from '../../src/componentes/layout/destinos-publicos'
import {
  ALTURA_MAXIMA_CABECALHO_MOBILE_PX,
  ALVO_MINIMO_PX,
  LARGURAS_MOBILE,
  cabecalhoPermaneceVisivelAoRolar,
  contarLandmarks,
  medirAlturaDoCabecalho,
  medirAlvosDeToque,
  medirRolagemHorizontal,
} from './apoio/medicoes'

const larguraDoProjeto = (nome: string) => Number(nome.replace('largura-', ''))

test.describe('matriz das páginas públicas', () => {
  for (const destino of DESTINOS_PUBLICOS) {
    test.describe(`${destino.rotulo} (${destino.caminho})`, () => {
      test('responde sem erro e não redireciona para outro destino', async ({ page }) => {
        const resposta = await page.goto(destino.caminho)

        expect(resposta, `sem resposta para ${destino.caminho}`).not.toBeNull()
        expect(resposta!.status(), `${destino.caminho}: status ${resposta!.status()}`).toBeLessThan(
          400
        )

        const final = new URL(page.url()).pathname
        expect(final, `${destino.caminho} redirecionou para ${final}`).toBe(destino.caminho)
      })

      test('tem um único h1 próprio', async ({ page }) => {
        await page.goto(destino.caminho)

        const titulos = page.getByRole('heading', { level: 1 })
        await expect(titulos).toHaveCount(1)
        await expect(titulos).not.toHaveText('')
      })

      test('tem exatamente uma região de cada papel', async ({ page }) => {
        await page.goto(destino.caminho)

        const landmarks = await contarLandmarks(page)
        console.log(
          `[${destino.caminho}] banner ${landmarks.banner} · navigation ${landmarks.navigation} · ` +
            `main ${landmarks.main} · contentinfo ${landmarks.contentinfo}`
        )
        expect(landmarks).toEqual({ banner: 1, navigation: 1, main: 1, contentinfo: 1 })
      })

      test('a marca do cabeçalho leva à página inicial', async ({ page }) => {
        await page.goto(destino.caminho)

        const marca = page.getByTestId('marca-do-cabecalho')
        await expect(marca).toHaveAttribute('href', '/')
      })

      test('não acusa nenhuma violação de acessibilidade', async ({ page }) => {
        await page.goto(destino.caminho)

        const resultado = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()

        if (resultado.violations.length > 0) {
          console.log(
            `[${destino.caminho}] ` +
              resultado.violations.map((v) => `${v.id}: ${v.help}`).join(' | ')
          )
        }
        expect(resultado.violations).toEqual([])
      })

      test('não gera rolagem horizontal', async ({ page }, informacoes) => {
        await page.goto(destino.caminho)

        const medida = await medirRolagemHorizontal(page)
        expect(
          medida.scrollWidth,
          `${informacoes.project.name} ${destino.caminho}: scrollWidth ${medida.scrollWidth} ` +
            `maior que clientWidth ${medida.clientWidth}`
        ).toBeLessThanOrEqual(medida.clientWidth)
      })

      test('o cabeçalho cabe no orçamento e permanece visível ao rolar', async ({
        page,
      }, informacoes) => {
        await page.goto(destino.caminho)
        const largura = larguraDoProjeto(informacoes.project.name)

        const altura = await medirAlturaDoCabecalho(page)
        console.log(`[${largura}px ${destino.caminho}] altura do cabeçalho: ${altura} px`)
        expect(Number.isNaN(altura), `${destino.caminho}: nenhum <header> encontrado`).toBe(false)

        if ((LARGURAS_MOBILE as readonly number[]).includes(largura)) {
          expect(
            altura,
            `${largura}px ${destino.caminho}: cabeçalho com ${altura} px, ` +
              `acima do teto de ${ALTURA_MAXIMA_CABECALHO_MOBILE_PX} px`
          ).toBeLessThanOrEqual(ALTURA_MAXIMA_CABECALHO_MOBILE_PX)
        }

        const permanencia = await cabecalhoPermaneceVisivelAoRolar(page)
        if (permanencia.rolagemAplicada > 0) {
          expect(
            permanencia.topoDepois,
            `${destino.caminho}: o cabeçalho saiu da tela ao rolar ` +
              `(topo ${permanencia.topoDepois} depois de ${permanencia.rolagemAplicada} px)`
          ).toBeGreaterThanOrEqual(-1)
        }
      })

      test('nenhum alvo de toque abaixo de 44 px', async ({ page }, informacoes) => {
        await page.goto(destino.caminho)

        const medida = await medirAlvosDeToque(page, ALVO_MINIMO_PX)
        console.log(
          `[${informacoes.project.name} ${destino.caminho}] alvos medidos: ${medida.medidos} · ` +
            `abaixo de ${ALVO_MINIMO_PX} px: ${medida.pequenos.length}`
        )
        expect(medida.medidos, `${destino.caminho}: nenhum alvo medido`).toBeGreaterThan(0)
        expect(medida.pequenos, `${destino.caminho}: ${medida.pequenos.join(' | ')}`).toEqual([])
      })

      test('não faz nenhuma requisição a domínio externo', async ({ page }) => {
        const externas: string[] = []

        page.on('request', (requisicao) => {
          const url = new URL(requisicao.url())
          const ehLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
          const ehDadoEmbutido = url.protocol === 'data:' || url.protocol === 'blob:'
          if (!ehLocal && !ehDadoEmbutido) externas.push(requisicao.url())
        })

        await page.goto(destino.caminho, { waitUntil: 'networkidle' })

        expect(externas, `${destino.caminho} chamou: ${externas.join(', ')}`).toEqual([])
      })
    })
  }
})

/*
 * SC-017 — a outra metade do FR-044.
 *
 * O contador acima prova que cada destino foi medido; este prova que o NÚMERO
 * de destinos medidos é igual ao número de destinos entregues. Sem ele, remover
 * um destino do catálogo deixaria tudo verde com nove páginas.
 */
test('a matriz cobre todos os destinos do catálogo, e nenhum a mais', async ({
  page,
}, informacoes) => {
  const alcancados: string[] = []

  for (const destino of DESTINOS_PUBLICOS) {
    const resposta = await page.goto(destino.caminho)
    if (resposta && resposta.status() < 400) alcancados.push(destino.caminho)
  }

  const total = DESTINOS_PUBLICOS.length
  console.log(
    `[${informacoes.project.name}] páginas verificadas: ${alcancados.length}/${total} · ` +
      `destinos do catálogo: ${total}`
  )

  const ausentes = DESTINOS_PUBLICOS.map((d) => d.caminho).filter((c) => !alcancados.includes(c))
  expect(ausentes, `destinos do catálogo sem rota: ${ausentes.join(', ')}`).toEqual([])
  expect(alcancados.length).toBe(total)
})

test('a conversão principal do catálogo aponta para o processo seletivo', async ({ page }) => {
  await page.goto('/')
  expect(conversaoPrincipal.caminho).toBe('/processo-seletivo')

  const cta = page.getByTestId('conversao-principal')
  await expect(cta).toHaveAttribute('href', conversaoPrincipal.caminho)
})
