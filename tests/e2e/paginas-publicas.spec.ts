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
          return {
            topo: Number(caixa.top.toFixed(2)),
            base: Number(caixa.bottom.toFixed(2)),
            altura: Number(caixa.height.toFixed(2)),
          }
        })
        /* Topos diferentes nao significam linhas diferentes: em 1024 px os
           inline-flex ficam desalinhados por menos de 1 px dentro da mesma
           faixa vertical. Duas linhas reais nao se sobrepoem verticalmente. */
        const linhas: { topo: number; base: number }[] = []
        for (const item of [...itens].sort((a, b) => a.topo - b.topo)) {
          const linha = linhas.find((faixa) => item.topo < faixa.base && item.base > faixa.topo)
          if (linha) {
            linha.topo = Math.min(linha.topo, item.topo)
            linha.base = Math.max(linha.base, item.base)
          } else {
            linhas.push({ topo: item.topo, base: item.base })
          }
        }
        const caixaDaLista = lista.getBoundingClientRect()
        const topos = itens.map((item) => item.topo)
        return {
          alturaDaLista: Number(caixaDaLista.height.toFixed(2)),
          maiorAlturaDeItem: Math.max(...itens.map((item) => item.altura)),
          quantidadeDeLinhas: linhas.length,
          desnivelDosTopos: Number((Math.max(...topos) - Math.min(...topos)).toFixed(2)),
        }
      })
      console.log(
        `[${largura}px] geometria da navegacao direta: lista ${geometria.alturaDaLista} px · ` +
          `maior item ${geometria.maiorAlturaDeItem} px · ` +
          `${geometria.quantidadeDeLinhas} linha(s) · ` +
          `desnivel dos topos ${geometria.desnivelDosTopos} px`
      )
      expect(geometria.quantidadeDeLinhas, `${largura}px: a lista direta quebrou linha`).toBe(1)
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

/*
 * US5 — o que o leitor de tela recebe, e a pista que nao depende de cor.
 *
 * Depois do episodio do aria-label no <address>, a regra desta feature e
 * explicita: PRESENTE NO DOM E ANUNCIADO SAO COISAS DIFERENTES. `aria-current`
 * no HTML prova configuracao; o que prova resultado e a arvore de
 * acessibilidade do navegador, que e de onde o leitor de tela le.
 */
test.describe('estado e proposito anunciados', () => {
  test('as dez paginas atuais sao marcadas, com token valido', async ({ page }, informacoes) => {
    const largura = larguraDoProjeto(informacoes.project.name)
    test.skip(
      largura !== 360 && largura !== 1280,
      'a cobertura focada da Fase 7 usa as larguras-limite mobile e desktop'
    )

    /*
     * O QUE ESTE TESTE PROVA, E O QUE ELE NAO PROVA — medido, nao suposto.
     *
     * A intencao era ler a arvore de acessibilidade pelo CDP, como se fez com o
     * <address> na Fase 3, e cobrar "anunciado" em vez de "presente no DOM".
     * Medido em 28/08/2026: o `Accessibility.getFullAXTree` deste Chrome NAO
     * expoe `aria-current` como propriedade do no. O link "Sobre" volta com
     * `props=[["focusable",true],["url","..."]]` e nada mais, mesmo com
     * `aria-current="page"` no DOM e o link visivel.
     *
     * Entao a verificacao pelo canal mais forte NAO ESTA DISPONIVEL aqui, e
     * dizer o contrario seria inventar. O que sobra, e que nao e pouco:
     *
     *   - o atributo existe e carrega o token exato `page`, que e o que o leitor
     *     de tela le. Token invalido nao seria anunciado;
     *   - o axe-core roda em todas as dez rotas e tem a regra
     *     `aria-valid-attr-value`, que reprova `aria-current` com valor invalido.
     *     Zero violacoes nas dez rotas cobre essa metade;
     *   - exatamente UM destino distinto e marcado nas DEZ rotas, e nenhum em
     *     caminho fora do catalogo (coberto no teste de unidade).
     *
     * Isto e mais fraco que o caso do <address>, onde a arvore expos o nome e
     * respondeu a pergunta direto. Fica escrito qual ferramenta prova o que.
     */
    for (const destino of DESTINOS_PUBLICOS) {
      await page.goto(destino.caminho)

      // No mobile, os nove destinos secundarios so ficam visiveis com o painel
      // aberto. A conversao principal permanece visivel fora dele.
      if (largura === 360 && !destino.ehConversaoPrincipal) {
        await page.getByTestId('abrir-painel').click()
      }

      const marcados = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[aria-current]')).map((a) => ({
          texto: (a.textContent ?? '').trim(),
          valor: a.getAttribute('aria-current'),
          visivel:
            (a as HTMLElement).checkVisibility?.({
              checkOpacity: true,
              checkVisibilityCSS: true,
            }) ?? true,
        }))
      )
      const visiveis = marcados.filter((m) => m.visivel)
      const destinosDistintos = new Set(visiveis.map((m) => m.texto))

      console.log(
        `[${largura}px ${destino.caminho}] marcados no DOM: ${marcados.length} · ` +
          `visiveis: ${visiveis.length} · destinos distintos: ${destinosDistintos.size}`
      )

      expect(
        visiveis.length,
        `${destino.caminho}: nenhum destino visivel marcado como pagina atual`
      ).toBeGreaterThan(0)
      expect(
        destinosDistintos.size,
        `${destino.caminho}: mais de um destino distinto marcado`
      ).toBe(1)
      expect(visiveis[0]?.texto, `${destino.caminho}: destino marcado incorreto`).toBe(
        destino.rotulo
      )
      // Token exato: qualquer outro valor nao e anunciado como pagina atual.
      expect(new Set(marcados.map((m) => m.valor))).toEqual(new Set(['page']))
    }
  })

  test('a pista da pagina atual sobrevive a remocao da cor', async ({ page }, informacoes) => {
    await page.goto('/sobre')

    /*
     * Compara o link atual com um irmao nao-atual, ignorando TODA propriedade de
     * cor. Se a unica diferenca fosse cromatica, a lista abaixo ficaria vazia — e
     * quem nao distingue as cores nao teria como saber em que pagina esta
     * (criterio 1.4.1 do WCAG).
     */
    const resultado = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href]')) as HTMLElement[]
      const atual = links.find((l) => l.getAttribute('aria-current') === 'page')
      const outro = links.find(
        (l) => l !== atual && l.getAttribute('aria-current') !== 'page' && l.closest('nav')
      )
      if (!atual || !outro)
        return { erro: 'nao achei o par para comparar', diferencas: [] as string[] }

      const a = window.getComputedStyle(atual)
      const b = window.getComputedStyle(outro)
      const ehCor = (nome: string) => /color|shadow|background|outline-color|fill|stroke/.test(nome)
      const diferencas: string[] = []
      for (let i = 0; i < a.length; i += 1) {
        const nome = a.item(i)
        if (ehCor(nome)) continue
        if (a.getPropertyValue(nome) !== b.getPropertyValue(nome)) {
          diferencas.push(
            `${nome}: atual "${a.getPropertyValue(nome)}" vs outro "${b.getPropertyValue(nome)}"`
          )
        }
      }
      return { erro: '', diferencas }
    })

    console.log(
      `[${informacoes.project.name}] diferencas NAO cromaticas entre a pagina atual e um irmao: ` +
        `${resultado.diferencas.length} — ${resultado.diferencas.slice(0, 3).join(' | ')}`
    )
    expect(resultado.erro).toBe('')
    expect(
      resultado.diferencas.length,
      'a unica diferenca da pagina atual e a COR: quem nao a distingue nao sabe onde esta'
    ).toBeGreaterThan(0)

    /* O CTA e visualmente diferente dos links do menu mesmo sem ser atual, por
       isso compara-lo com um irmao provaria a coisa errada. Aqui a comparacao e
       do CTA consigo mesmo, com e sem o estado, e ignora cor por construcao. */
    await page.goto(conversaoPrincipal.caminho)
    const pistaDaConversao = await page.getByTestId('conversao-principal').evaluate((cta) => {
      const antes = getComputedStyle(cta).textDecorationLine
      const valor = cta.getAttribute('aria-current')
      cta.removeAttribute('aria-current')
      const depois = getComputedStyle(cta).textDecorationLine
      if (valor !== null) cta.setAttribute('aria-current', valor)
      return { antes, depois }
    })
    console.log(
      `[${informacoes.project.name}] pista nao cromatica da conversao: ` +
        `atual="${pistaDaConversao.antes}" · sem estado="${pistaDaConversao.depois}"`
    )
    expect(pistaDaConversao.antes).toContain('underline')
    expect(pistaDaConversao.depois).not.toContain('underline')
  })

  test('o painel tem nome acessivel e o botao anuncia o que controla', async ({
    page,
  }, informacoes) => {
    await page.goto('/')
    const acionadorVisivel = await estaAcessivelmenteVisivel(page, '[data-testid="abrir-painel"]')
    test.skip(!acionadorVisivel, 'o painel nao existe nesta largura')

    const botao = page.getByTestId('abrir-painel')
    await expect(botao).toHaveAttribute('aria-controls', 'painel-de-navegacao')
    await expect(botao).toHaveAttribute('aria-expanded', 'false')
    await botao.click()
    await expect(botao).toHaveAttribute('aria-expanded', 'true')

    const nome = await page.evaluate(() =>
      document.querySelector('[data-testid="painel-de-navegacao"]')?.getAttribute('aria-label')
    )
    console.log(`[${informacoes.project.name}] nome acessivel do painel: "${nome}"`)
    expect(nome).toBe('Menu de navegação')
  })
})
