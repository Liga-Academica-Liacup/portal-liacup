import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import type { Browser, Locator, Page, TestInfo } from '@playwright/test'
import { LARGURAS, ORIGEM_PUBLICADO } from '../../playwright.config'
import {
  PAGINAS_PUBLICAS,
  paginaDeDestaque,
  paginasDoMenu,
} from '../../src/lib/utils/paginas-publicas'
import { esperarAnimacoes, primeiraLinha } from './apoio'

/*
 * EM QUANTAS LARGURAS O MENU FOI TESTADO, NO TOTAL (pagina-processo-seletivo,
 * design.md D12). Cada largura é um projeto, num processo próprio, e nenhum vê
 * o resultado dos outros. Então cada um grava o seu numa pasta da execução, lê
 * a pasta inteira e imprime o total que ela tem. A pasta fica dentro da saída
 * do Playwright (test-results), que ele apaga no começo de cada execução: um
 * total nunca soma resultado de execução anterior. Quem termina por último vê
 * as sete larguras, e a linha dele é o total da execução.
 */
type ResultadoDaLargura = { largura: number; testado: boolean; falhas: number }

function registrarLargura(informacoes: TestInfo, resultado: ResultadoDaLargura): string {
  const pasta = join(informacoes.project.outputDir, 'menu-por-largura')
  mkdirSync(pasta, { recursive: true })
  writeFileSync(join(pasta, `${resultado.largura}.json`), JSON.stringify(resultado))
  const todos = readdirSync(pasta)
    .filter((arquivo) => arquivo.endsWith('.json'))
    .map((arquivo) => JSON.parse(readFileSync(join(pasta, arquivo), 'utf8')) as ResultadoDaLargura)
  const testadas = todos.filter((r) => r.testado).sort((a, b) => a.largura - b.largura)
  return (
    `[${informacoes.project.name}] menu lateral testado em ${testadas.length} de ${LARGURAS.length} larguras` +
    ` (${testadas.map((r) => r.largura).join(', ') || 'nenhuma'})` +
    ` · com falha em ${testadas.filter((r) => r.falhas > 0).length}` +
    ` · larguras com resultado nesta execução até aqui: ${todos.length} de ${LARGURAS.length}`
  )
}

/*
 * O CABEÇALHO DE CADA LARGURA E O MENU LATERAL POR TECLADO (layout-e-hero,
 * design.md D4 e D7, item 3).
 *
 * Cada projeto do Playwright testa a PRÓPRIA largura, e nenhum fica pulado:
 *
 *   - até 1024 px, onde o cabeçalho é o de celular, com o botão de menu, o
 *     teste roda os seis comportamentos do D4 no menu lateral;
 *   - acima de 1024 px, onde não há menu lateral, o teste confere que os
 *     destinos estão em linha, visíveis, com a barra da página atual.
 *
 * O ponto de troca é o que o dev-frontend mediu no protótipo (relatorio.md,
 * tarefa 1.4: o botão aparece em 1024 px e some em 1025 px). Ele fica escrito
 * aqui de propósito: se o botão de menu sumisse em 768 px por defeito, um teste
 * que só perguntasse "o botão está visível?" passaria a conferir os links em
 * linha e ficaria verde. Com a largura esperada escrita, a forma errada do
 * cabeçalho é falha, e não troca silenciosa do que se testa.
 *
 * O axe-core não testa operabilidade: prisão de foco, retorno de foco e
 * fechamento no Esc passam inteiros por ele. Aqui se pergunta onde o foco
 * REALMENTE parou, depois de teclas de verdade. Para chegar ao botão de menu,
 * Tab; para abrir, Enter. Nada de element.focus() para posicionar o foco.
 *
 * Os seis comportamentos rodam um depois do outro, cada um num passo
 * (test.step) com a página recarregada, e o teste junta as falhas de todos
 * antes de falhar: uma falha no Esc não esconde uma falha no foco. A saída diz,
 * em cada largura, quantos comportamentos foram testados, para que "não
 * testou" não pareça "passou".
 */

const PONTO_DE_TROCA = 1024
const NOME_DO_BOTAO = 'Abrir menu de navegação'
const PAGINA_DE_PARTIDA = PAGINAS_PUBLICAS[0]?.endereco ?? '/'

const botaoDeMenu = (page: Page) => page.getByRole('button', { name: NOME_DO_BOTAO })
const menu = (page: Page) => page.locator('dialog')
const navegacaoEmLinha = (page: Page) =>
  page.getByRole('navigation', { name: 'Navegação principal' })

async function menuAberto(page: Page): Promise<boolean> {
  return menu(page).evaluate((dialogo: HTMLDialogElement) => dialogo.open)
}

/* O foco está neste elemento agora? */
async function temFoco(locator: Locator): Promise<boolean> {
  return locator.evaluate((elemento) => elemento === document.activeElement)
}

async function descreverFoco(page: Page): Promise<string> {
  return page.evaluate(() => {
    const alvo = document.activeElement as HTMLElement | null
    if (!alvo || alvo === document.body) return '<body>'
    const nome = (alvo.getAttribute('aria-label') ?? alvo.textContent ?? '').trim().slice(0, 40)
    return `<${alvo.tagName.toLowerCase()}> "${nome}"`
  })
}

/* Tab até o foco chegar em `alvo`. Devolve quantas teclas foram. */
async function tabAte(page: Page, alvo: Locator, maximo = 20): Promise<number> {
  for (let teclas = 1; teclas <= maximo; teclas += 1) {
    await page.keyboard.press('Tab')
    if (await temFoco(alvo)) return teclas
  }
  throw new Error(
    `${maximo} Tabs e o foco não chegou ao alvo; parou em ${await descreverFoco(page)}`
  )
}

/* Do começo da página, Tab até o botão de menu e Enter. */
async function abrirPeloTeclado(page: Page): Promise<void> {
  await tabAte(page, botaoDeMenu(page))
  await page.keyboard.press('Enter')
  await expect(menu(page), 'Enter no botão de menu não abriu o menu').toBeVisible()
  await esperarAnimacoes(page, 'dialog')
}

/* Um ponto na área escurecida, à direita da gaveta, no meio da altura. */
async function pontoFora(page: Page): Promise<{ x: number; y: number }> {
  const caixa = await menu(page).boundingBox()
  const tela = page.viewportSize()
  const largura = tela?.width ?? 0
  if (!caixa || caixa.x + caixa.width >= largura - 4) {
    throw new Error('o menu ocupa a largura toda: não há área fora dele para tocar')
  }
  return { x: (caixa.x + caixa.width + largura) / 2, y: (tela?.height ?? 0) / 2 }
}

type Contexto = { page: Page; browser: Browser }
type Comportamento = { nome: string; medir: (contexto: Contexto) => Promise<string> }

/* Os seis comportamentos do D4, na ordem do design. */
const COMPORTAMENTOS: Comportamento[] = [
  {
    nome: 'abre e fecha pelo botão, que anuncia aberto e fechado',
    medir: async ({ page }) => {
      const rotulos = paginasDoMenu().map((pagina) => pagina.rotulo)
      const destaque = paginaDeDestaque()
      const botao = botaoDeMenu(page)
      await expect(botao, 'antes de abrir').toHaveAttribute('aria-expanded', 'false')
      await abrirPeloTeclado(page)

      await expect(page.getByRole('dialog', { name: 'Navegação' })).toBeVisible()
      await expect(botao, 'com o menu aberto').toHaveAttribute('aria-expanded', 'true')
      const destinos = (
        await menu(page).getByRole('navigation').getByRole('link').allInnerTexts()
      ).map((texto) => texto.trim())
      expect(destinos, 'os destinos do menu não são os da lista').toEqual(rotulos)
      if (destaque) {
        await expect(menu(page).getByRole('link', { name: destaque.rotulo })).toBeVisible()
      }
      const marca = await conferirMarcaDoMenu(page)

      await tabAte(page, menu(page).getByRole('button', { name: 'Fechar menu' }))
      await page.keyboard.press('Enter')
      expect(await menuAberto(page), 'Enter no botão de fechar não fechou o menu').toBe(false)
      await expect(botao, 'depois de fechar').toHaveAttribute('aria-expanded', 'false')
      return `destinos ${JSON.stringify(destinos)} · aria-expanded false, true, false · ${marca}`
    },
  },
  {
    nome: 'fecha no Esc',
    medir: async ({ page }) => {
      await abrirPeloTeclado(page)
      await page.keyboard.press('Tab')
      await page.keyboard.press('Escape')
      expect(await menuAberto(page), 'Esc não fechou o menu').toBe(false)
      await expect(botaoDeMenu(page)).toHaveAttribute('aria-expanded', 'false')
      return 'Esc fechou o menu'
    },
  },
  {
    nome: 'fecha no toque fora, e não no toque dentro',
    medir: async ({ page, browser }) => {
      /* Toque de verdade: um contexto com tela de toque, na largura deste projeto. */
      const tela = page.viewportSize()
      if (!tela) throw new Error('o projeto não tem largura de tela')
      const contexto = await browser.newContext({
        hasTouch: true,
        baseURL: ORIGEM_PUBLICADO,
        viewport: tela,
      })
      try {
        const toque = await contexto.newPage()
        await toque.goto(PAGINA_DE_PARTIDA)
        await abrirPeloTeclado(toque)
        const caixa = await menu(toque).boundingBox()
        if (!caixa) throw new Error('o menu aberto não tem caixa')
        /* Dentro da gaveta, num ponto sem controle: o menu continua aberto. */
        await toque.touchscreen.tap(caixa.x + caixa.width / 2, caixa.y + caixa.height - 8)
        expect(
          await menuAberto(toque),
          'um toque DENTRO do menu, sem controle, fechou o menu'
        ).toBe(true)
        const fora = await pontoFora(toque)
        await toque.touchscreen.tap(fora.x, fora.y)
        await expect
          .poll(() => menuAberto(toque), { message: 'o toque fora do menu não fechou o menu' })
          .toBe(false)
        return `toque fora em (${Math.round(fora.x)}, ${Math.round(fora.y)}), gaveta de ${Math.round(caixa.width)} px`
      } finally {
        await contexto.close()
      }
    },
  },
  {
    nome: 'fecha ao escolher um destino, e mostra a página dele',
    medir: async ({ page }) => {
      const destinos = paginasDoMenu()
      for (const destino of destinos) {
        await page.goto(PAGINA_DE_PARTIDA)
        await abrirPeloTeclado(page)
        const link = menu(page).getByRole('navigation').locator(`a[href="${destino.endereco}"]`)
        await tabAte(page, link)
        await page.keyboard.press('Enter')
        await expect(page).toHaveURL((url) => url.pathname === destino.endereco)
        await expect
          .poll(() => menuAberto(page), {
            message: `escolher "${destino.rotulo}" não fechou o menu`,
          })
          .toBe(false)
        await expect(page.getByRole('main')).toBeVisible()
      }
      /*
       * O botão de destaque do fim do menu, navegando de verdade para outra
       * página (pagina-processo-seletivo, design.md D8, item 3): da Início, o
       * endereço muda e o título principal passa a ser o da página escolhida.
       */
      const destaque = paginaDeDestaque()
      let navegou = 'sem botão de destaque na lista'
      if (destaque) {
        await page.goto(PAGINA_DE_PARTIDA)
        await abrirPeloTeclado(page)
        const botao = menu(page).locator(`a[href="${destaque.endereco}"]`)
        await expect(botao, `o fim do menu não mostra "${destaque.rotulo}"`).toHaveCount(1)
        await tabAte(page, botao)
        await page.keyboard.press('Enter')
        await expect(page).toHaveURL((url) => url.pathname === destaque.endereco)
        await expect
          .poll(() => menuAberto(page), {
            message: `escolher "${destaque.rotulo}" no fim do menu não fechou o menu`,
          })
          .toBe(false)
        await expect(
          page.getByRole('heading', { level: 1 }),
          `depois de escolher "${destaque.rotulo}", o título principal não é o da página`
        ).toHaveText(destaque.rotulo)
        navegou = `"${destaque.rotulo}" por Enter: de ${PAGINA_DE_PARTIDA} a ${new URL(page.url()).pathname}, h1 "${destaque.rotulo}"`
      }
      return `destinos do menu escolhidos por Enter: ${destinos.length} · botão de destaque ${navegou}`
    },
  },
  {
    nome: 'prende o foco: Tab e Shift+Tab não saem do menu aberto',
    medir: async ({ page }) => {
      await abrirPeloTeclado(page)
      const focaveis = await menu(page).evaluate(
        (dialogo) =>
          Array.from(
            dialogo.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
          ).filter((elemento) => elemento.checkVisibility()).length
      )
      const vistos = new Set<string>()
      const escapes: string[] = []
      let teclas = 0
      /* Mais teclas que controles, nos dois sentidos: se o foco escapasse, apareceria. */
      for (const tecla of ['Tab', 'Shift+Tab'] as const) {
        for (let vez = 0; vez < (focaveis + 2) * 2; vez += 1) {
          await page.keyboard.press(tecla)
          teclas += 1
          const foco = await page.evaluate(() => {
            const dialogo = document.querySelector('dialog')
            const alvo = document.activeElement
            return {
              dentro: !!dialogo && !!alvo && alvo !== dialogo && dialogo.contains(alvo),
              chave: alvo
                ? `${alvo.tagName}|${alvo.getAttribute('aria-label') ?? alvo.textContent}`
                : '',
            }
          })
          if (foco.dentro) vistos.add(foco.chave)
          else escapes.push(`${tecla} nº ${vez + 1}: ${await descreverFoco(page)}`)
        }
      }
      expect(escapes, `o foco saiu do menu aberto: ${escapes.join(' | ')}`).toEqual([])
      expect(vistos.size, 'o ciclo não passou por todos os controles do menu').toBe(focaveis)
      return `${teclas} teclas · controles do menu alcançados: ${vistos.size} de ${focaveis} · escapes: 0`
    },
  },
  {
    nome: 'devolve o foco ao botão que abriu, pelos três jeitos de fechar',
    medir: async ({ page }) => {
      const jeitos: { nome: string; fechar: () => Promise<void> }[] = [
        {
          nome: 'botão de fechar',
          fechar: async () => {
            await tabAte(page, menu(page).getByRole('button', { name: 'Fechar menu' }))
            await page.keyboard.press('Enter')
          },
        },
        { nome: 'Esc', fechar: () => page.keyboard.press('Escape') },
        {
          nome: 'clique fora',
          fechar: async () => {
            const fora = await pontoFora(page)
            await page.mouse.click(fora.x, fora.y)
          },
        },
      ]
      for (const jeito of jeitos) {
        await page.goto(PAGINA_DE_PARTIDA)
        await abrirPeloTeclado(page)
        await jeito.fechar()
        await expect
          .poll(() => menuAberto(page), { message: `${jeito.nome} não fechou o menu` })
          .toBe(false)
        const foco = await descreverFoco(page)
        expect(
          await temFoco(botaoDeMenu(page)),
          `depois de fechar pelo ${jeito.nome}, o foco ficou em ${foco}, e não no botão de menu`
        ).toBe(true)
      }
      return `jeitos de fechar com o foco de volta: ${jeitos.length}`
    },
  },
]

/*
 * A INDICAÇÃO DA PÁGINA ATUAL, como ela aparece na tela, e não só o atributo.
 *
 * REFERENCIA-VISUAL.md §3: a página atual é marcada para o leitor de tela
 * (aria-current="page") e por uma forma que não depende só de cor. Cada lugar
 * mostra a sua forma, e o teste mede a que o lugar mostra:
 *
 *   - links em linha (desktop): a barra da Q6, o ::after de um elemento dentro
 *     do link, com espessura, ponta redonda, da largura do rótulo e abaixo dele;
 *   - menu lateral: o sublinhado do texto e a barra à esquerda, como no
 *     protótipo (prints/lado-a-lado-menu-aberto-390.png).
 *
 * As barras são elemento de interface: contraste de pelo menos 3:1 com o fundo
 * atrás delas (WCAG 1.4.11).
 */
const CONTRASTE_MINIMO_DA_BARRA = 3

type Barra = {
  origem: string
  largura: number
  espessura: number
  pontaRedonda: boolean
  cor: number[]
  fundo: number[]
  /* Distância do pé da caixa do texto ao topo da barra; negativa se a barra sobe no texto. */
  abaixoDoTexto: number
  /* A barra fica à esquerda do texto, sem encostar nele? */
  aEsquerdaDoTexto: boolean
}

type Indicacao = { ariaCurrent: string | null; sublinhado: boolean; barras: Barra[] }

async function medirIndicacao(link: Locator): Promise<Indicacao> {
  return link.evaluate((elemento) => {
    const paraRgb = (cor: string) => {
      const tela = document.createElement('canvas').getContext('2d')
      if (!tela) return [0, 0, 0, 0]
      tela.fillStyle = cor
      tela.fillRect(0, 0, 1, 1)
      return Array.from(tela.getImageData(0, 0, 1, 1).data)
    }
    const fundoAtras = (de: Element) => {
      for (let atual: Element | null = de; atual; atual = atual.parentElement) {
        const rgb = paraRgb(getComputedStyle(atual).backgroundColor)
        if (rgb[3] === 255) return rgb
      }
      return [255, 255, 255, 255]
    }
    /* Só os nós de texto: o Range de um elemento traria também a caixa da barra. */
    const caixasDoTexto: DOMRect[] = []
    const caminho = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT)
    for (let no = caminho.nextNode(); no; no = caminho.nextNode()) {
      if ((no.textContent ?? '').trim() === '') continue
      const faixa = document.createRange()
      faixa.selectNodeContents(no)
      caixasDoTexto.push(...Array.from(faixa.getClientRects()).filter((c) => c.width > 0))
    }
    if (caixasDoTexto.length === 0) throw new Error('o link da página atual não tem texto')
    const textoEmbaixo = Math.max(...caixasDoTexto.map((c) => c.bottom))
    const textoEsquerda = Math.min(...caixasDoTexto.map((c) => c.left))
    const barras: Barra[] = []

    for (const dono of [elemento, ...Array.from(elemento.querySelectorAll('*'))]) {
      /* 1. Barra desenhada num ::after (os links em linha, Q6). */
      const depois = getComputedStyle(dono, '::after')
      if (depois.content !== 'none' && depois.content !== 'normal' && depois.display !== 'none') {
        const caixaDoDono = dono.getBoundingClientRect()
        const borda = parseFloat(depois.borderTopWidth) || 0
        const altura = parseFloat(depois.height) || 0
        const corDaBorda = paraRgb(depois.borderTopColor)
        const corDoFundo = paraRgb(depois.backgroundColor)
        const cor = borda > 0 && depois.borderTopStyle !== 'none' ? corDaBorda : corDoFundo
        const topo = caixaDoDono.top + (parseFloat(depois.top) || 0)
        barras.push({
          origem: `<${dono.tagName.toLowerCase()}>::after`,
          largura: parseFloat(depois.width) || 0,
          /* Com border-box, a altura calculada já inclui a borda: somar contaria duas vezes. */
          espessura:
            depois.boxSizing === 'border-box' && altura > 0
              ? altura
              : (depois.borderTopStyle !== 'none' ? borda : 0) + altura,
          pontaRedonda: parseFloat(depois.borderTopLeftRadius) > 0,
          cor,
          fundo: fundoAtras(dono),
          abaixoDoTexto: topo - textoEmbaixo,
          aEsquerdaDoTexto: false,
        })
      }
      /* 2. Barra que é um elemento decorativo (o menu lateral). */
      if (dono !== elemento && dono.getAttribute('aria-hidden') === 'true') {
        const caixa = dono.getBoundingClientRect()
        const estilo = getComputedStyle(dono)
        const cor = paraRgb(estilo.backgroundColor)
        if (caixa.width > 0 && caixa.height > 0 && cor[3] !== 0) {
          barras.push({
            origem: `<${dono.tagName.toLowerCase()} aria-hidden>`,
            largura: caixa.width,
            espessura: caixa.height,
            pontaRedonda: parseFloat(estilo.borderTopLeftRadius) > 0,
            cor,
            fundo: fundoAtras(dono.parentElement ?? dono),
            abaixoDoTexto: caixa.top - textoEmbaixo,
            aEsquerdaDoTexto: caixa.right <= textoEsquerda,
          })
        }
      }
    }
    return {
      ariaCurrent: elemento.getAttribute('aria-current'),
      sublinhado: getComputedStyle(elemento).textDecorationLine.includes('underline'),
      barras,
    }
  })
}

function contraste(a: number[], b: number[]): number {
  const luminancia = ([r = 0, g = 0, bl = 0]: number[]) => {
    const canal = (valor: number) => {
      const c = valor / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(bl)
  }
  const [clara = 0, escura = 0] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (clara + 0.05) / (escura + 0.05)
}

const rgb = (cor: number[]) => `rgb(${cor.slice(0, 3).join(', ')})`

/* Uma barra que se vê: espessura, largura e contraste de interface. Devolve o problema, ou null. */
function problemaDaBarra(barra: Barra): string | null {
  const razao = contraste(barra.cor, barra.fundo)
  if (barra.espessura < 1 || barra.largura < 1) {
    return `${barra.origem} sem tamanho: ${barra.largura}x${barra.espessura} px`
  }
  if (razao < CONTRASTE_MINIMO_DA_BARRA) {
    return `${barra.origem} ${rgb(barra.cor)} sobre ${rgb(barra.fundo)}: ${razao.toFixed(2)}:1, abaixo de ${CONTRASTE_MINIMO_DA_BARRA}:1`
  }
  return null
}

const descreverBarra = (barra: Barra) =>
  `${barra.origem} ${Math.round(barra.largura * 10) / 10}x${barra.espessura} px, ` +
  `${barra.pontaRedonda ? 'ponta redonda' : 'ponta reta'}, ${rgb(barra.cor)} sobre ${rgb(barra.fundo)} ` +
  `${contraste(barra.cor, barra.fundo).toFixed(2)}:1`

/* Links em linha: aria-current e a barra do ::after, redonda, abaixo do rótulo. */
async function conferirBarraEmLinha(atual: Locator): Promise<string> {
  const indicacao = await medirIndicacao(atual)
  expect(indicacao.ariaCurrent, 'a página atual em linha sem aria-current="page"').toBe('page')
  const barra = indicacao.barras.find((b) => b.origem.endsWith('::after'))
  if (!barra) {
    throw new Error(
      'a página atual em linha não mostra a barra do ::after: a indicação ficaria só na cor' +
        ` (sublinhado: ${indicacao.sublinhado ? 'sim' : 'não'})`
    )
  }
  const problema = problemaDaBarra(barra)
  if (problema) throw new Error(`a barra da página atual em linha não se vê: ${problema}`)
  expect(barra.pontaRedonda, `a barra ${descreverBarra(barra)} não tem a ponta redonda (Q6)`).toBe(
    true
  )
  expect(
    barra.abaixoDoTexto,
    `a barra ${descreverBarra(barra)} sobe no rótulo, em vez de ficar abaixo dele`
  ).toBeGreaterThanOrEqual(0)
  return `${descreverBarra(barra)}, ${Math.round(barra.abaixoDoTexto * 10) / 10} px abaixo da caixa do texto`
}

/* Menu lateral: aria-current, o sublinhado e a barra à esquerda, como no protótipo. */
async function conferirMarcaDoMenu(page: Page): Promise<string> {
  const atual = menu(page).getByRole('navigation').locator('a[aria-current="page"]')
  await expect(atual, 'nenhum destino do menu marcado como página atual').toHaveCount(1)
  const indicacao = await medirIndicacao(atual)
  expect(indicacao.sublinhado, 'a página atual do menu não está sublinhada').toBe(true)
  const barra = indicacao.barras.find((b) => b.aEsquerdaDoTexto)
  if (!barra) throw new Error('a página atual do menu não mostra a barra à esquerda do rótulo')
  const problema = problemaDaBarra(barra)
  if (problema) throw new Error(`a barra da página atual do menu não se vê: ${problema}`)
  return `página atual "${(await atual.innerText()).trim()}": aria-current, sublinhado e barra ${descreverBarra(barra)}`
}

/* Acima do ponto de troca: os destinos da lista em linha, visíveis, com a barra da página atual. */
async function conferirDestinosEmLinha(page: Page): Promise<string> {
  const rotulos = paginasDoMenu().map((pagina) => pagina.rotulo)
  const navegacao = navegacaoEmLinha(page)
  for (const rotulo of rotulos) {
    await expect(
      navegacao.getByRole('link', { name: rotulo, exact: true }),
      `o destino "${rotulo}" não está visível em linha`
    ).toBeVisible()
  }
  const atual = navegacao.locator('a[aria-current="page"]')
  await expect(atual, 'nenhum destino em linha marcado como página atual').toHaveCount(1)
  const marcado = (await atual.innerText()).trim()
  const barra = await conferirBarraEmLinha(atual)
  expect(await menuAberto(page), 'o menu lateral está aberto numa largura sem botão').toBe(false)
  return `destinos em linha visíveis: ${rotulos.length} de ${rotulos.length} · página atual "${marcado}" com aria-current e barra ${barra}`
}

test('o cabeçalho desta largura: até 1024 px, o menu lateral nos seis comportamentos do D4; acima, os destinos em linha', async ({
  page,
  browser,
}, informacoes) => {
  const projeto = informacoes.project.name
  const largura = page.viewportSize()?.width ?? 0
  expect(largura, 'o projeto precisa ter uma largura de tela').toBeGreaterThan(0)
  const deCelular = largura <= PONTO_DE_TROCA

  await page.goto(PAGINA_DE_PARTIDA)
  const forma = {
    'botão de menu visível': await botaoDeMenu(page).isVisible(),
    'destinos em linha visíveis': await navegacaoEmLinha(page).isVisible(),
  }
  expect(
    forma,
    `em ${largura} px o cabeçalho devia ser o de ${deCelular ? 'celular' : 'desktop'} (ponto de troca: ${PONTO_DE_TROCA} px)`
  ).toEqual({ 'botão de menu visível': deCelular, 'destinos em linha visíveis': !deCelular })

  if (!deCelular) {
    const nota = await test.step('destinos em linha, sem menu lateral', () =>
      conferirDestinosEmLinha(page))
    console.log(
      `[${projeto}] cabeçalho de desktop, sem botão de menu · ${nota}` +
        ` · menu lateral: não existe nesta largura, comportamentos do D4 a testar: 0\n` +
        registrarLargura(informacoes, { largura, testado: false, falhas: 0 })
    )
    return
  }

  const testados: string[] = []
  const falhas: string[] = []
  for (const [indice, comportamento] of COMPORTAMENTOS.entries()) {
    const rotulo = `${indice + 1}/${COMPORTAMENTOS.length} ${comportamento.nome}`
    try {
      const nota = await test.step(rotulo, async () => {
        await page.goto(PAGINA_DE_PARTIDA)
        return comportamento.medir({ page, browser })
      })
      testados.push(`${rotulo}: ${nota}`)
    } catch (erro) {
      falhas.push(`o menu falhou em "${comportamento.nome}": ${primeiraLinha(erro)}`)
    }
  }

  console.log(
    `[${projeto}] cabeçalho de celular, com botão de menu · menu lateral testado nesta largura:` +
      ` ${testados.length} de ${COMPORTAMENTOS.length} comportamentos do D4 · com falha: ${falhas.length}` +
      (testados.length > 0 ? `\n  ${testados.join('\n  ')}` : '') +
      (falhas.length > 0 ? `\n  FALHA ${falhas.join('\n  FALHA ')}` : '') +
      `\n${registrarLargura(informacoes, {
        largura,
        testado: testados.length + falhas.length === COMPORTAMENTOS.length,
        falhas: falhas.length,
      })}`
  )
  expect(falhas, `[${projeto}] ${falhas.join(`\n[${projeto}] `)}`).toEqual([])
  expect(testados.length).toBe(COMPORTAMENTOS.length)
})
