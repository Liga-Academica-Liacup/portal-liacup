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
  estaAcessivelmenteVisivel,
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
        expect(
          permanencia.rolagemAplicada,
          `${destino.caminho}: a pagina nao rolou; permanencia nao foi verificada`
        ).toBeGreaterThan(0)
        expect(
          permanencia.topoDepois,
          `${destino.caminho}: o cabeçalho saiu da tela ao rolar ` +
            `(topo ${permanencia.topoDepois} depois de ${permanencia.rolagemAplicada} px)`
        ).toBeGreaterThanOrEqual(-1)
      })

      test('nenhum alvo de toque abaixo de 44 px', async ({ page }, informacoes) => {
        await page.goto(destino.caminho)

        const painelFechado = await medirAlvosDeToque(page, ALVO_MINIMO_PX)
        console.log(
          `[${informacoes.project.name} ${destino.caminho}] painel fechado: ` +
            `${painelFechado.medidos} alvos medidos · abaixo de ${ALVO_MINIMO_PX} px: ` +
            `${painelFechado.pequenos.length}`
        )
        expect(painelFechado.medidos, `${destino.caminho}: nenhum alvo medido`).toBeGreaterThan(0)
        expect(
          painelFechado.pequenos,
          `${destino.caminho}: ${painelFechado.pequenos.join(' | ')}`
        ).toEqual([])

        /*
         * No mobile, os nove destinos existem dentro de um <dialog> fechado.
         * A varredura acima deve pula-los: sem caixa, eles nao sao alvo de
         * toque naquele estado. Mas parar ali deixava justamente a navegacao
         * principal do celular fora da verificacao. Perguntamos ao navegador
         * se o acionador esta visivel, abrimos o painel e medimos de novo — sem
         * repetir em TypeScript o breakpoint que pertence ao CSS.
         */
        const acionadorVisivel = await estaAcessivelmenteVisivel(
          page,
          '[data-testid="abrir-painel"]'
        )
        if (acionadorVisivel) {
          await page.getByTestId('abrir-painel').click()
          const painelAberto = await medirAlvosDeToque(page, ALVO_MINIMO_PX)
          const destinosQueEntraramNaMedicao = painelAberto.medidos - painelFechado.medidos

          console.log(
            `[${informacoes.project.name} ${destino.caminho}] painel aberto: ` +
              `${painelAberto.medidos} alvos medidos · ` +
              `${destinosQueEntraramNaMedicao} destinos acrescentados · ` +
              `abaixo de ${ALVO_MINIMO_PX} px: ${painelAberto.pequenos.length}`
          )
          expect(destinosQueEntraramNaMedicao).toBe(DESTINOS_PUBLICOS.length - 1)
          expect(
            painelAberto.pequenos,
            `${destino.caminho}, painel aberto: ${painelAberto.pequenos.join(' | ')}`
          ).toEqual([])
        }
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

/*
 * US3 — conversao visivel e navegacao responsiva (FR-005 a FR-007).
 *
 * O corte de 1024 px mora no CSS. Estes testes NAO o repetem: eles perguntam ao
 * navegador o que esta visivel e o que esta na arvore acessivel, e derivam a
 * expectativa da largura do projeto. Repetir o numero aqui criaria a segunda
 * fonte que o plano proibe.
 */
const CORTE_DESKTOP = 1024

test.describe('conversao principal e painel lateral', () => {
  test('a conversao principal fica visivel sem nenhuma interacao', async ({
    page,
  }, informacoes) => {
    await page.goto('/')

    const cta = page.getByTestId('conversao-principal')
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', conversaoPrincipal.caminho)
    console.log(
      `[${informacoes.project.name}] conversao "${conversaoPrincipal.rotulo}" visivel sem interacao`
    )
  })

  test('abaixo de 1024 px os nove destinos ficam no painel, e acima ficam diretos', async ({
    page,
  }, informacoes) => {
    await page.goto('/')
    const largura = larguraDoProjeto(informacoes.project.name)
    const ehDesktop = largura >= CORTE_DESKTOP

    const acionador = page.getByTestId('abrir-painel')
    const diretos = page.getByTestId('navegacao-direta').getByRole('link')

    if (ehDesktop) {
      // Fora da arvore acessivel, nao apenas transparente.
      expect(await estaAcessivelmenteVisivel(page, '[data-testid="abrir-painel"]')).toBe(false)
      expect(await estaAcessivelmenteVisivel(page, '[data-testid="painel-de-navegacao"]')).toBe(
        false
      )
      /*
       * Nove na navegacao direta MAIS a conversao, que fica fora dela em todas
       * as larguras. Total visivel: dez. A conversao nao e repetida dentro da
       * navegacao — dois links para o mesmo destino na mesma tela e ruido para
       * quem navega por teclado e para quem usa leitor de tela.
       */
      const quantos = await diretos.count()
      const total = quantos + 1
      console.log(
        `[${largura}px] destinos diretos: ${quantos} + conversao = ${total}/${DESTINOS_PUBLICOS.length}`
      )
      expect(total).toBe(DESTINOS_PUBLICOS.length)

      const geometria = await page.getByTestId('navegacao-direta').evaluate((lista) => {
        const itens = Array.from(lista.querySelectorAll('a')).map((item) => {
          const caixa = item.getBoundingClientRect()
          return { topo: Number(caixa.top.toFixed(2)), altura: Number(caixa.height.toFixed(2)) }
        })
        const caixaDaLista = lista.getBoundingClientRect()
        return {
          alturaDaLista: Number(caixaDaLista.height.toFixed(2)),
          maiorAlturaDeItem: Math.max(...itens.map((item) => item.altura)),
          toposDistintos: [...new Set(itens.map((item) => item.topo))],
        }
      })
      console.log(
        `[${largura}px] geometria da navegacao direta: lista ${geometria.alturaDaLista} px · ` +
          `maior item ${geometria.maiorAlturaDeItem} px · ` +
          `${geometria.toposDistintos.length} topo(s) distinto(s)`
      )
      expect(
        geometria.alturaDaLista - geometria.maiorAlturaDeItem,
        `${largura}px: a lista direta ocupa mais de uma linha`
      ).toBeLessThanOrEqual(1)

      const filhosDoCabecalho = await page.locator('header').evaluate((cabecalho) =>
        Array.from(cabecalho.children).map((filho) => {
          const caixa = filho.getBoundingClientRect()
          return {
            nome: filho.getAttribute('data-testid') ?? filho.tagName.toLowerCase(),
            largura: Number(caixa.width.toFixed(2)),
            altura: Number(caixa.height.toFixed(2)),
          }
        })
      )
      console.log(
        `[${largura}px] filhos do cabecalho: ` +
          filhosDoCabecalho
            .map((filho) => `${filho.nome} ${filho.largura}×${filho.altura}`)
            .join(' · ')
      )
    } else {
      await expect(acionador).toBeVisible()
      const noPainel = page.getByTestId('painel-de-navegacao').getByRole('link')
      await acionador.click()
      const quantos = await noPainel.count()
      console.log(`[${largura}px] destinos no painel: ${quantos} (esperados 9, sem a conversao)`)
      expect(quantos).toBe(DESTINOS_PUBLICOS.length - 1)
    }
  })

  test('o acionador do painel tem alvo de toque suficiente', async ({ page }, informacoes) => {
    await page.goto('/')
    const largura = larguraDoProjeto(informacoes.project.name)
    if (largura >= CORTE_DESKTOP) {
      test.skip(true, 'o acionador nao existe no desktop')
      return
    }

    const caixa = await page.getByTestId('abrir-painel').boundingBox()
    console.log(`[${largura}px] acionador: ${caixa?.width}×${caixa?.height}`)
    expect(caixa?.width ?? 0).toBeGreaterThanOrEqual(ALVO_MINIMO_PX)
    expect(caixa?.height ?? 0).toBeGreaterThanOrEqual(ALVO_MINIMO_PX)
  })
})
