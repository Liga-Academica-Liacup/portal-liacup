import { expect, test } from '@playwright/test'
import type { APIRequestContext, Locator, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { ORIGEM_NAO_PUBLICADO, ORIGEM_PUBLICADO } from '../../playwright.config'
import {
  COLUNAS_DO_RODAPE,
  PAGINAS_PUBLICAS,
  estaNaLista,
  paginaDeDestaque,
  paginasDaColuna,
  paginasDoMenu,
} from '../../src/lib/utils/paginas-publicas'
import {
  ALVO_MINIMO,
  FONTE_MINIMA_DE_CAMPO,
  TAGS_DO_AXE,
  contarPedidos,
  esperarAnimacoes,
  primeiraLinha,
} from './apoio'

/*
 * AS PÁGINAS DA LISTA E A MOLDURA (layout-e-hero, design.md D7, itens 1, 2 e 5).
 *
 * As páginas vêm da lista única (src/lib/utils/paginas-publicas.json), e não
 * de uma lista copiada aqui: página que entra na lista passa a ser medida sem
 * ninguém editar este arquivo. Cada largura é um projeto do Playwright.
 *
 * Cada teste percorre a lista inteira, junta os problemas de todas as páginas
 * e só então falha, nomeando a página e o que deu errado. Os contadores contam
 * só o que foi verificado ATÉ O FIM: página que falha não conta. Sem contador,
 * "nada falhou" e "nada foi medido" dariam a mesma saída verde (RP-12).
 */

const BOTAO_DE_MENU = 'Abrir menu de navegação'

/*
 * Os dois canais do rodapé, com o que REFERENCIA-VISUAL.md §7 exige de cada um.
 * Ao lado do ícone do Instagram, o texto escrito é "liacup.unb", sem o @
 * (Gabriel, 21/11). A comparação é exata: "@liacup.unb" escrito falha.
 */
const CANAIS_DO_RODAPE = [
  {
    canal: 'Instagram',
    href: 'https://www.instagram.com/liacup.unb/',
    texto: 'liacup.unb',
    novaAba: true,
    /* O nome acessível diz o destino: que é o Instagram e que abre em nova aba. */
    nomeDiz: [/instagram/i, /nova aba/i],
  },
  {
    canal: 'e-mail',
    href: 'mailto:liacup.unb@gmail.com',
    texto: 'liacup.unb@gmail.com',
    novaAba: false,
    /* O nome acessível diz o destino: um e-mail novo para o endereço. */
    nomeDiz: [/e-mail/i, /liacup\.unb@gmail\.com/],
  },
] as const

/* A primeira resposta, sem seguir redirecionamento. */
async function conferirResposta(
  request: APIRequestContext,
  endereco: string
): Promise<string | null> {
  const resposta = await request.get(`${ORIGEM_PUBLICADO}${endereco}`, { maxRedirects: 0 })
  const location = resposta.headers()['location']
  if (resposta.status() === 200 && location === undefined) return null
  return (
    `${endereco} recebeu ${resposta.status()}, Location ${location ?? 'ausente'}` +
    ' (esperado 200 sem redirecionamento)'
  )
}

type Alvo = {
  regiao: string
  descricao: string
  pequeno: boolean
  ehCampo: boolean
  campoComFontePequena: boolean
}

/*
 * Mede todo alvo visível dentro de `escopo`. Escondido (display none,
 * visibility hidden, opacidade zero ou sem caixa) não é alvo de ninguém e não
 * entra: medir o que ninguém toca seria falso positivo.
 */
async function medirAlvos(page: Page, escopo: string): Promise<Alvo[]> {
  return page.evaluate(
    ({ escopo, minimo, fonteMinima }) => {
      const seletor =
        'a[href], button, input, select, textarea, summary, [role="button"], [tabindex]:not([tabindex="-1"])'
      const raiz = document.querySelector(escopo)
      if (!raiz) return []
      const alvos: Alvo[] = []
      for (const elemento of Array.from(raiz.querySelectorAll<HTMLElement>(seletor))) {
        const visivel = elemento.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
        const caixa = elemento.getBoundingClientRect()
        if (!visivel || caixa.width === 0 || caixa.height === 0) continue
        const regiao = elemento.closest('dialog')
          ? 'menu lateral'
          : elemento.closest('header')
            ? 'cabeçalho'
            : elemento.closest('footer')
              ? 'rodapé'
              : elemento.closest('main')
                ? 'conteúdo'
                : 'fora das regiões'
        const nome = (elemento.getAttribute('aria-label') ?? elemento.textContent ?? '').trim()
        const ehCampo = elemento.matches('input, select, textarea')
        const fonte = parseFloat(window.getComputedStyle(elemento).fontSize)
        alvos.push({
          regiao,
          descricao:
            `${regiao}: <${elemento.tagName.toLowerCase()}> "${nome.slice(0, 40)}" ` +
            `${Math.round(caixa.width * 100) / 100}x${Math.round(caixa.height * 100) / 100}` +
            (ehCampo ? ` fonte ${fonte}px` : ''),
          pequeno: caixa.width < minimo || caixa.height < minimo,
          ehCampo,
          campoComFontePequena: ehCampo && fonte < fonteMinima,
        })
      }
      return alvos
    },
    { escopo, minimo: ALVO_MINIMO, fonteMinima: FONTE_MINIMA_DE_CAMPO }
  )
}

/* Abre o menu lateral pelo botão, se ele existir nesta largura. Devolve se abriu. */
async function abrirMenuSeExistir(page: Page): Promise<boolean> {
  const botao = page.getByRole('button', { name: BOTAO_DE_MENU })
  if (!(await botao.isVisible())) return false
  await botao.click()
  await expect(page.locator('dialog[open]')).toBeVisible()
  await esperarAnimacoes(page, 'dialog[open]')
  return true
}

async function violacoesDoAxe(page: Page, incluir?: string): Promise<string[]> {
  const construtor = new AxeBuilder({ page }).withTags(TAGS_DO_AXE)
  const resultado = await (incluir ? construtor.include(incluir) : construtor).analyze()
  return resultado.violations.map(
    (violacao) => `${violacao.id} (${violacao.nodes.length} elementos): ${violacao.help}`
  )
}

type MedidaDaPagina = {
  problemas: string[]
  alvos: Alvo[]
  violacoes: number
  pedidos: number
  externos: number
  menuAberto: boolean
  rolagem: string
}

/* Item 1 do D7 numa página: moldura, axe, rolagem, alvos e pedidos externos. */
async function medirPagina(page: Page, endereco: string): Promise<MedidaDaPagina> {
  const problemas: string[] = []
  const alvos: Alvo[] = []
  let violacoes = 0
  let menuAberto = false
  let rolagem = 'não medida'

  const pedidos = await contarPedidos(page, async () => {
    await page.goto(endereco, { waitUntil: 'networkidle' })

    const caminhoFinal = new URL(page.url()).pathname
    if (caminhoFinal !== endereco)
      problemas.push(`terminou em ${caminhoFinal}, e não em ${endereco}`)

    for (const [papel, nome] of [
      ['banner', 'cabeçalho'],
      ['contentinfo', 'rodapé'],
      ['main', 'conteúdo principal'],
    ] as const) {
      const quantos = await page.getByRole(papel).count()
      if (quantos !== 1)
        problemas.push(`${nome} (papel ${papel}) aparece ${quantos} vezes, e não 1`)
    }

    const doAxe = await violacoesDoAxe(page)
    violacoes += doAxe.length
    problemas.push(...doAxe.map((v) => `axe, menu fechado: ${v}`))

    const medida = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    rolagem = `scrollWidth ${medida.scrollWidth} / clientWidth ${medida.clientWidth}`
    if (medida.scrollWidth > medida.clientWidth) {
      problemas.push(
        `rolagem horizontal: scrollWidth ${medida.scrollWidth} maior que clientWidth ${medida.clientWidth}`
      )
    }

    alvos.push(...(await medirAlvos(page, 'body')))

    menuAberto = await abrirMenuSeExistir(page)
    if (menuAberto) {
      alvos.push(...(await medirAlvos(page, 'dialog[open]')))
      const doAxeComMenu = await violacoesDoAxe(page, 'dialog[open]')
      violacoes += doAxeComMenu.length
      problemas.push(...doAxeComMenu.map((v) => `axe, menu aberto: ${v}`))
      await page.keyboard.press('Escape')
      await expect(page.locator('dialog[open]')).toHaveCount(0)
    }
  })

  for (const alvo of alvos) {
    if (alvo.pequeno) problemas.push(`alvo abaixo de ${ALVO_MINIMO} px: ${alvo.descricao}`)
    if (alvo.campoComFontePequena) {
      problemas.push(`campo com fonte abaixo de ${FONTE_MINIMA_DE_CAMPO} px: ${alvo.descricao}`)
    }
  }
  problemas.push(...pedidos.externos.map((url) => `pedido a domínio externo: ${url}`))

  return {
    problemas,
    alvos,
    violacoes,
    pedidos: pedidos.total,
    externos: pedidos.externos.length,
    menuAberto,
    rolagem,
  }
}

/* O nome acessível calculado pelo Playwright, lido da árvore de acessibilidade. */
async function nomeAcessivel(link: Locator): Promise<string> {
  const arvore = await link.ariaSnapshot()
  const achado = /^- link "((?:[^"\\]|\\.)*)"/.exec(arvore.trim())
  return achado?.[1]?.replace(/\\"/g, '"') ?? ''
}

/*
 * Um ponto dentro da caixa do link e fora da caixa do texto dele, já na tela.
 * É o que prova que o quadro inteiro é o alvo, e não só as letras.
 */
async function pontoForaDoTexto(link: Locator) {
  return link.evaluate((elemento) => {
    elemento.scrollIntoView({ block: 'center' })
    const caixa = elemento.getBoundingClientRect()
    const faixa = document.createRange()
    faixa.selectNodeContents(elemento)
    const texto = faixa.getBoundingClientRect()
    const margem = 2
    const candidatos = [
      { x: caixa.left + margem, y: caixa.top + margem },
      { x: caixa.right - margem, y: caixa.top + margem },
      { x: caixa.left + margem, y: caixa.bottom - margem },
      { x: caixa.right - margem, y: caixa.bottom - margem },
    ]
    const foraDoTexto = candidatos.find(
      (p) => p.x < texto.left || p.x > texto.right || p.y < texto.top || p.y > texto.bottom
    )
    const atingido = foraDoTexto ? document.elementFromPoint(foraDoTexto.x, foraDoTexto.y) : null
    return {
      ponto: foraDoTexto ?? null,
      atingeOLink: atingido !== null && elemento.contains(atingido),
      caixa: { largura: caixa.width, altura: caixa.height },
      texto: { largura: texto.width, altura: texto.height },
    }
  })
}

/*
 * Clica de verdade no ponto e diz que link recebeu o clique. A navegação é
 * cancelada no próprio clique, para o teste não abrir o Instagram nem o
 * aplicativo de e-mail: o que se mede é QUEM recebe o toque.
 */
async function hrefDoClique(page: Page, x: number, y: number): Promise<string | null> {
  await page.evaluate(() => {
    const janela = window as unknown as { __hrefDoClique?: string | null }
    janela.__hrefDoClique = undefined
    document.addEventListener(
      'click',
      (evento) => {
        const link = (evento.target as Element | null)?.closest('a')
        janela.__hrefDoClique = link?.getAttribute('href') ?? null
        evento.preventDefault()
      },
      { capture: true, once: true }
    )
  })
  await page.mouse.click(x, y)
  return page.evaluate(
    () => (window as unknown as { __hrefDoClique?: string | null }).__hrefDoClique ?? null
  )
}

/* Os dois canais do rodapé numa página já aberta. Devolve os problemas e os nomes lidos. */
async function conferirCanais(page: Page) {
  const problemas: string[] = []
  const conferidos: string[] = []
  const rodape = page.getByRole('contentinfo')

  for (const canal of CANAIS_DO_RODAPE) {
    const link = rodape.locator(`a[href="${canal.href}"]`)
    const quantos = await link.count()
    if (quantos !== 1) {
      problemas.push(`${canal.canal}: ${quantos} links para ${canal.href} no rodapé, e não 1`)
      continue
    }
    const antes = problemas.length

    const alvo = await link.getAttribute('target')
    const rel = (await link.getAttribute('rel'))?.split(/\s+/) ?? []
    if (canal.novaAba) {
      if (alvo !== '_blank') problemas.push(`${canal.canal}: target "${alvo}", e não "_blank"`)
      for (const parte of ['noopener', 'noreferrer']) {
        if (!rel.includes(parte))
          problemas.push(`${canal.canal}: rel "${rel.join(' ')}" sem ${parte}`)
      }
    } else if (alvo === '_blank') {
      problemas.push(`${canal.canal}: abre em nova aba, e não devia`)
    }

    const escrito = (await link.innerText()).trim()
    if (escrito !== canal.texto || !(await link.isVisible())) {
      problemas.push(`${canal.canal}: texto escrito "${escrito}", e não "${canal.texto}" visível`)
    }

    const nome = await nomeAcessivel(link)
    for (const parte of canal.nomeDiz) {
      if (!parte.test(nome))
        problemas.push(`${canal.canal}: nome acessível "${nome}" não diz ${parte}`)
    }
    /*
     * WCAG 2.5.3: o nome contém o que está escrito na tela, para quem fala o
     * que vê. Compara com o texto LIDO, e não com o esperado.
     */
    if (escrito === '' || !nome.includes(escrito)) {
      problemas.push(
        `${canal.canal}: nome acessível "${nome}" não contém o texto escrito "${escrito}" (WCAG 2.5.3)`
      )
    }

    const medida = await pontoForaDoTexto(link)
    const { largura, altura } = medida.caixa
    if (largura < ALVO_MINIMO || altura < ALVO_MINIMO) {
      problemas.push(
        `${canal.canal}: caixa do link ${largura}x${altura}, abaixo de ${ALVO_MINIMO} px`
      )
    }
    if (!medida.ponto) {
      problemas.push(`${canal.canal}: a caixa do link é do tamanho do texto, sem ponto fora dele`)
    } else {
      const recebeu = await hrefDoClique(page, medida.ponto.x, medida.ponto.y)
      if (!medida.atingeOLink || recebeu !== canal.href) {
        problemas.push(
          `${canal.canal}: o clique em (${Math.round(medida.ponto.x)}, ${Math.round(medida.ponto.y)}),` +
            ` fora do texto, chegou a "${recebeu}", e não ao link`
        )
      }
    }

    if (problemas.length === antes) {
      conferidos.push(
        `${canal.canal} escrito "${escrito}", contido no nome "${nome}" (WCAG 2.5.3)` +
          ` · caixa ${Math.round(largura)}x${Math.round(altura)}` +
          ` · texto ${Math.round(medida.texto.largura)}x${Math.round(medida.texto.altura)}`
      )
    }
  }
  return { problemas, conferidos }
}

/* Item 1 do D7. */
test('cada página da lista responde 200 e passa na moldura, no axe, na rolagem, nos alvos e nos pedidos', async ({
  page,
  request,
}, informacoes) => {
  const falhas: string[] = []
  const canaisConferidos: string[] = []
  let verificadas = 0
  let alvosMedidos = 0
  let alvosPequenos = 0
  let campos = 0
  let violacoes = 0
  let pedidos = 0
  let externos = 0
  let paginasComMenuAberto = 0
  const rolagens: string[] = []

  for (const { endereco } of PAGINAS_PUBLICAS) {
    const problemaDaResposta = await conferirResposta(request, endereco)
    if (problemaDaResposta) {
      falhas.push(problemaDaResposta)
      continue
    }
    try {
      const medida = await medirPagina(page, endereco)
      const canais = await conferirCanais(page)
      alvosMedidos += medida.alvos.length
      alvosPequenos += medida.alvos.filter((alvo) => alvo.pequeno).length
      campos += medida.alvos.filter((alvo) => alvo.ehCampo).length
      violacoes += medida.violacoes
      pedidos += medida.pedidos
      externos += medida.externos
      if (medida.menuAberto) paginasComMenuAberto += 1
      rolagens.push(`${endereco} ${medida.rolagem}`)
      const problemas = [...medida.problemas, ...canais.problemas]
      if (problemas.length > 0) {
        falhas.push(...problemas.map((problema) => `${endereco}: ${problema}`))
        continue
      }
      canaisConferidos.push(...canais.conferidos.map((linha) => `${endereco} ${linha}`))
      verificadas += 1
    } catch (erro) {
      falhas.push(`${endereco}: ${primeiraLinha(erro)}`)
    }
  }

  const largura = informacoes.project.name
  console.log(
    `[${largura}] páginas verificadas: ${verificadas} de ${PAGINAS_PUBLICAS.length} na lista\n` +
      `[${largura}] alvos medidos: ${alvosMedidos} · abaixo de ${ALVO_MINIMO} px: ${alvosPequenos}` +
      ` · com o menu lateral aberto em ${paginasComMenuAberto} páginas · campos de formulário: ${campos}\n` +
      `[${largura}] Violacoes de acessibilidade: ${violacoes}\n` +
      `[${largura}] rolagem horizontal medida em ${rolagens.length} páginas: ${rolagens.join(' · ')}
` +
      `[${largura}] pedidos feitos: ${pedidos} · a domínio externo: ${externos}\n` +
      `[${largura}] links de contato conferidos: ${canaisConferidos.length}\n  ` +
      canaisConferidos.join('\n  ')
  )
  expect(falhas, `páginas da lista com defeito:\n${falhas.join('\n')}`).toEqual([])
  expect(verificadas).toBe(PAGINAS_PUBLICAS.length)
  expect(alvosMedidos, 'o teste precisa ter medido algum alvo').toBeGreaterThan(0)
})

/* Item 2 do D7. */
test('todo link interno do cabeçalho, do menu e do rodapé leva a um endereço da lista, que responde 200', async ({
  page,
  request,
}, informacoes) => {
  const falhas: string[] = []
  const statusPorEndereco = new Map<string, number>()
  let internos = 0
  let externos = 0

  for (const { endereco } of PAGINAS_PUBLICAS) {
    await page.goto(endereco)
    /* Todos os links da moldura no DOM, inclusive os que esta largura esconde. */
    const links = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLAnchorElement>('header a[href], footer a[href]')
      ).map((link) => ({
        href: link.getAttribute('href') ?? '',
        absoluto: link.href,
        regiao: link.closest('dialog') ? 'menu' : link.closest('header') ? 'cabeçalho' : 'rodapé',
        nome: (link.getAttribute('aria-label') ?? link.textContent ?? '').trim(),
      }))
    )

    for (const link of links) {
      const destino = new URL(link.absoluto)
      if (destino.origin !== new URL(ORIGEM_PUBLICADO).origin) {
        externos += 1
        continue
      }
      internos += 1
      const caminho = destino.pathname
      const onde = `${endereco}, ${link.regiao}, "${link.nome}" (href ${link.href})`
      if (!estaNaLista(caminho)) {
        falhas.push(`${onde}: ${caminho} não está na lista de páginas públicas`)
        continue
      }
      if (!statusPorEndereco.has(caminho)) {
        const resposta = await request.get(`${ORIGEM_PUBLICADO}${caminho}`, { maxRedirects: 0 })
        statusPorEndereco.set(caminho, resposta.status())
      }
      const status = statusPorEndereco.get(caminho)
      if (status !== 200) falhas.push(`${onde}: ${caminho} recebeu ${status}, e não 200`)
    }
  }

  console.log(
    `[${informacoes.project.name}] links internos da moldura conferidos: ${internos}` +
      ` · endereços distintos: ${statusPorEndereco.size}` +
      ` · links externos (Instagram e e-mail, conferidos no outro teste): ${externos}`
  )
  expect(falhas, `links da moldura com defeito:\n${falhas.join('\n')}`).toEqual([])
  expect(internos, 'o teste precisa ter conferido algum link').toBeGreaterThan(0)
})

/* Spec navegacao-publica: a moldura mostra só o que está na lista, e nada do protótipo que saiu. */
test('o cabeçalho, o menu e o rodapé mostram só os destinos da lista, sem o que o protótipo tinha e o site não tem', async ({
  page,
}, informacoes) => {
  const falhas: string[] = []
  let conferidos = 0
  const rotulosDoMenu = paginasDoMenu().map((pagina) => pagina.rotulo)
  const destaque = paginaDeDestaque()

  for (const { endereco } of PAGINAS_PUBLICAS) {
    await page.goto(endereco)
    const rotulosDe = async (locator: Locator) =>
      (await locator.getByRole('link', { includeHidden: true }).allTextContents()).map((t) =>
        t.trim()
      )

    const emLinha = await rotulosDe(
      page.getByRole('navigation', { name: 'Navegação principal', includeHidden: true })
    )
    const noMenu = await rotulosDe(
      page.locator('dialog').getByRole('navigation', { includeHidden: true })
    )
    for (const [lugar, achados] of [
      ['links em linha', emLinha],
      ['menu lateral', noMenu],
    ] as const) {
      if (JSON.stringify(achados) !== JSON.stringify(rotulosDoMenu)) {
        falhas.push(
          `${endereco}, ${lugar}: ${JSON.stringify(achados)}, e não ${JSON.stringify(rotulosDoMenu)}`
        )
      }
      conferidos += achados.length
    }

    const rodape = page.getByRole('contentinfo')
    for (const coluna of COLUNAS_DO_RODAPE) {
      const esperados = paginasDaColuna(coluna).map((pagina) => pagina.rotulo)
      const titulo = rodape.getByRole('heading', { name: coluna, exact: true })
      if (esperados.length === 0) {
        if ((await titulo.count()) !== 0)
          falhas.push(`${endereco}: coluna "${coluna}" sem página aparece`)
        continue
      }
      const achados = await rotulosDe(rodape.getByRole('navigation', { name: coluna }))
      if (JSON.stringify(achados) !== JSON.stringify(esperados)) {
        falhas.push(
          `${endereco}, coluna "${coluna}": ${JSON.stringify(achados)}, e não ${JSON.stringify(esperados)}`
        )
      }
      conferidos += achados.length
    }

    const cabecalho = page.getByRole('banner')
    const textoDoCabecalho = await cabecalho.innerText()
    const rotuloDoDestaque = destaque?.rotulo ?? 'Processo seletivo'
    const temDestaque = await cabecalho
      .getByRole('link', { name: rotuloDoDestaque, exact: true })
      .count()
    if (destaque === undefined && temDestaque > 0) {
      falhas.push(
        `${endereco}: o cabeçalho mostra "${rotuloDoDestaque}" sem página de destaque na lista`
      )
    }
    if (/\bPainel\b/.test(textoDoCabecalho)) falhas.push(`${endereco}: o cabeçalho mostra "Painel"`)

    const textoDoRodape = await rodape.innerText()
    if (!textoDoRodape.includes('FCTS · Campus UnB Ceilândia · Brasília/DF')) {
      falhas.push(
        `${endereco}: o rodapé não tem a linha de endereço "FCTS · Campus UnB Ceilândia · Brasília/DF"`
      )
    }
    for (const proibido of [
      'liacup@unb.br',
      'Darcy Ribeiro',
      'Painel da diretoria',
      'Protótipo do Portal',
    ]) {
      if (textoDoRodape.includes(proibido))
        falhas.push(`${endereco}: o rodapé mostra "${proibido}"`)
    }
  }

  console.log(
    `[${informacoes.project.name}] destinos da moldura conferidos contra a lista: ${conferidos}` +
      ` em ${PAGINAS_PUBLICAS.length} páginas · destaque na lista: ${destaque?.rotulo ?? 'nenhum'}`
  )
  expect(falhas, `moldura com defeito:\n${falhas.join('\n')}`).toEqual([])
  expect(conferidos).toBeGreaterThan(0)
})

/*
 * Spec navegacao-publica: o Instagram abre em nova aba sem dar à página aberta
 * acesso à de origem nem o endereço dela. Medido no resultado, e não só no
 * atributo: a aba nova é interceptada aqui, sem sair da máquina.
 */
test('o Instagram abre em nova aba, sem window.opener e sem Referer', async ({
  page,
  context,
}, informacoes) => {
  const falhas: string[] = []
  let abertas = 0
  let comOpener = 0
  let comReferer = 0
  const instagram = CANAIS_DO_RODAPE[0]

  for (const { endereco } of PAGINAS_PUBLICAS) {
    const visto: { pedido: boolean; referer: string | undefined } = {
      pedido: false,
      referer: undefined,
    }
    await context.route(`${instagram.href}**`, async (rota) => {
      visto.pedido = true
      visto.referer = rota.request().headers()['referer']
      await rota.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<title>interceptado</title>',
      })
    })
    await page.goto(endereco)
    const link = page.getByRole('contentinfo').locator(`a[href="${instagram.href}"]`)
    const { ponto } = await pontoForaDoTexto(link)
    if (!ponto) {
      falhas.push(`${endereco}: sem ponto do link fora do texto`)
      continue
    }
    const [aba] = await Promise.all([
      page.waitForEvent('popup'),
      page.mouse.click(ponto.x, ponto.y),
    ])
    await aba.waitForLoadState()
    const temOpener = await aba.evaluate(() => window.opener !== null)
    const urlDaAba = aba.url()
    await aba.close()
    await context.unrouteAll()

    if (urlDaAba !== instagram.href) falhas.push(`${endereco}: a aba nova abriu ${urlDaAba}`)
    if (temOpener) {
      comOpener += 1
      falhas.push(`${endereco}: a aba nova tem window.opener`)
    }
    if (!visto.pedido) falhas.push(`${endereco}: a aba nova não pediu ${instagram.href}`)
    if (visto.referer !== undefined) {
      comReferer += 1
      falhas.push(`${endereco}: a aba nova recebeu Referer "${visto.referer}"`)
    }
    if (urlDaAba === instagram.href && !temOpener && visto.pedido && visto.referer === undefined) {
      abertas += 1
    }
  }

  console.log(
    `[${informacoes.project.name}] abas do Instagram abertas pelo canto do link: ${abertas}` +
      ` · com window.opener: ${comOpener} · com Referer: ${comReferer}`
  )
  expect(falhas, falhas.join('\n')).toEqual([])
  expect(abertas).toBe(PAGINAS_PUBLICAS.length)
})

/*
 * Constitution e ADR-0006: todo controle alcançado por Tab tem foco visível, e
 * o foco se distingue do hover. Só teclas de verdade para chegar ao foco.
 *
 * O anel é o contorno (outline) e a sombra (box-shadow) calculados. Medidos em
 * três estados do MESMO elemento: focado por Tab, em repouso (sem foco e sem
 * ponteiro) e sob o ponteiro, sem foco. Passa só se o foco muda o anel em
 * relação ao repouso, e o hover não muda. Comparar com o repouso, e não só
 * perguntar "tem sombra?", é o que pega um controle que já tem sombra parado e
 * não ganha anel nenhum ao receber o foco.
 */
type Anel = { contorno: string; sombra: string; visivel: boolean }

async function anelDe(page: Page, seletor: string): Promise<Anel> {
  return page.locator(seletor).evaluate((alvo) => {
    const estilo = window.getComputedStyle(alvo)
    const transparente = (cor: string) =>
      cor === 'transparent' || /rgba\([^)]*,\s*0\)$/.test(cor.replace(/\s+/g, ' '))
    const temContorno =
      estilo.outlineStyle !== 'none' &&
      parseFloat(estilo.outlineWidth) > 0 &&
      !transparente(estilo.outlineColor)
    const contorno = temContorno
      ? `${estilo.outlineWidth} ${estilo.outlineStyle} ${estilo.outlineColor} afastado ${estilo.outlineOffset}`
      : 'nenhum'
    return {
      contorno,
      sombra: estilo.boxShadow,
      visivel: temContorno || estilo.boxShadow !== 'none',
    }
  })
}

const mesmoAnel = (a: Anel, b: Anel) => a.contorno === b.contorno && a.sombra === b.sombra
const escreverAnel = (anel: Anel) => `contorno ${anel.contorno}, sombra ${anel.sombra}`

test('todo controle alcançado por Tab tem foco visível, que muda do repouso e não aparece no hover', async ({
  page,
}, informacoes) => {
  const falhas: string[] = []
  const contagem = { alcancados: 0, semFocusVisible: 0, igualAoRepouso: 0, mudaNoHover: 0 }
  const MARCA = '[data-qa-foco]'

  for (const { endereco } of PAGINAS_PUBLICAS) {
    await page.goto(endereco)
    await page.mouse.move(0, 0)
    const vistos: string[] = []
    for (let tecla = 0; tecla < 60; tecla += 1) {
      await page.keyboard.press('Tab')
      const foco = await page.evaluate(() => {
        const alvo = document.activeElement as HTMLElement | null
        document
          .querySelectorAll('[data-qa-foco]')
          .forEach((marcado) => marcado.removeAttribute('data-qa-foco'))
        if (!alvo || alvo === document.body) return null
        alvo.setAttribute('data-qa-foco', '')
        /* Identidade do ELEMENTO, e não do texto: "Início" aparece no cabeçalho e no rodapé. */
        if (!alvo.hasAttribute('data-qa-ordem')) {
          alvo.setAttribute(
            'data-qa-ordem',
            String(document.querySelectorAll('[data-qa-ordem]').length)
          )
        }
        return {
          chave: alvo.getAttribute('data-qa-ordem') ?? '',
          descricao: `<${alvo.tagName.toLowerCase()}> "${(alvo.getAttribute('aria-label') ?? alvo.textContent ?? '').trim().slice(0, 40)}"`,
          focoVisivel: alvo.matches(':focus-visible'),
        }
      })
      if (foco === null) {
        if (vistos.length > 0) break
        continue
      }
      if (vistos.includes(foco.chave)) break
      vistos.push(foco.chave)
      contagem.alcancados += 1

      const comFoco = await anelDe(page, MARCA)
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
      const emRepouso = await anelDe(page, MARCA)
      await page.locator(MARCA).hover()
      const noHover = await anelDe(page, MARCA)
      await page.mouse.move(0, 0)
      await page.locator(MARCA).evaluate((alvo: HTMLElement) => alvo.focus())

      const onde = `${endereco}: ${foco.descricao}`
      if (!foco.focoVisivel) {
        contagem.semFocusVisible += 1
        falhas.push(`${onde} focado por Tab sem :focus-visible`)
      }
      if (!comFoco.visivel || mesmoAnel(comFoco, emRepouso)) {
        contagem.igualAoRepouso += 1
        falhas.push(
          `${onde}: o foco não mostra anel novo; focado ${escreverAnel(comFoco)} · em repouso ${escreverAnel(emRepouso)}`
        )
      }
      if (!mesmoAnel(noHover, emRepouso)) {
        contagem.mudaNoHover += 1
        falhas.push(
          `${onde}: o hover muda o anel, que devia ser só do foco; no hover ${escreverAnel(noHover)} · em repouso ${escreverAnel(emRepouso)}`
        )
      }
    }
  }

  console.log(
    `[${informacoes.project.name}] controles alcançados por Tab: ${contagem.alcancados}` +
      ` · sem :focus-visible: ${contagem.semFocusVisible}` +
      ` · foco sem anel novo em relação ao repouso: ${contagem.igualAoRepouso}` +
      ` · anel que muda no hover: ${contagem.mudaNoHover}`
  )
  expect(falhas, falhas.join('\n')).toEqual([])
  expect(contagem.alcancados, 'o Tab precisa ter alcançado algum controle').toBeGreaterThan(0)
})

/* Spec navegacao-publica, cabeçalho no celular: no máximo 64 px de altura. */
test('o cabeçalho de celular tem no máximo 64 px de altura', async ({ page }, informacoes) => {
  await page.goto(PAGINAS_PUBLICAS[0]?.endereco ?? '/')
  const temBotao = await page.getByRole('button', { name: BOTAO_DE_MENU }).isVisible()
  const altura = (await page.getByRole('banner').boundingBox())?.height ?? 0
  console.log(
    `[${informacoes.project.name}] cabeçalho: ${altura} px de altura · forma: ` +
      (temBotao ? 'celular, com botão de menu' : 'desktop, sem limite de 64 px')
  )
  expect(altura).toBeGreaterThan(0)
  if (temBotao) expect(altura, 'cabeçalho de celular acima de 64 px').toBeLessThanOrEqual(64)
})

/* Item 5 do D7: a página que a produção mostra hoje não chama domínio externo. */
test('a raiz não publicada não faz nenhum pedido a domínio externo', async ({
  page,
}, informacoes) => {
  const pedidos = await contarPedidos(page, async () => {
    await page.goto(`${ORIGEM_NAO_PUBLICADO}/`, { waitUntil: 'networkidle' })
  })
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portal em construção')

  console.log(
    `[${informacoes.project.name}] raiz não publicada: pedidos feitos: ${pedidos.total}` +
      ` · a domínio externo: ${pedidos.externos.length}`
  )
  expect(pedidos.total, 'o teste precisa ter visto algum pedido').toBeGreaterThan(0)
  expect(pedidos.externos, `domínios externos chamados: ${pedidos.externos.join(', ')}`).toEqual([])
})

/*
 * Spec fundacao-e-ci: com o site não publicado, a raiz "não vê o cabeçalho, o
 * menu nem o rodapé das páginas públicas". A página em construção tem um
 * <footer> próprio, só com a linha institucional: por isso o rodapé da moldura
 * é procurado pelo que só ele tem, as colunas e a linha de endereço.
 */
test('a raiz não publicada não mostra o cabeçalho, o menu nem o rodapé das páginas públicas', async ({
  page,
}, informacoes) => {
  await page.goto(`${ORIGEM_NAO_PUBLICADO}/`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portal em construção')

  const colunas = new RegExp(`^(${[...COLUNAS_DO_RODAPE, 'Contato'].join('|')})$`)
  const procurados = [
    ['cabeçalho (papel banner)', page.getByRole('banner', { includeHidden: true })],
    [
      'links em linha ("Navegação principal")',
      page.getByRole('navigation', { name: 'Navegação principal', includeHidden: true }),
    ],
    ['botão de menu', page.getByRole('button', { name: BOTAO_DE_MENU, includeHidden: true })],
    ['menu lateral (<dialog>)', page.locator('dialog')],
    [
      'rodapé da moldura (colunas Portal, Conteúdo ou Contato)',
      page
        .locator('footer')
        .filter({ has: page.getByRole('heading', { name: colunas, includeHidden: true }) }),
    ],
    ['linha de endereço do rodapé da moldura', page.getByText('FCTS · Campus UnB Ceilândia')],
  ] as const

  const encontrados: string[] = []
  for (const [nome, locator] of procurados) {
    const quantos = await locator.count()
    if (quantos > 0) encontrados.push(`${nome}: ${quantos}`)
  }
  const rodapes = await page.locator('footer').count()

  console.log(
    `[${informacoes.project.name}] raiz não publicada: elementos da moldura procurados: ${procurados.length}` +
      ` · encontrados: ${encontrados.length}` +
      ` · <footer> na página: ${rodapes} (a página em construção tem 1)`
  )
  expect(
    encontrados,
    `a moldura aparece na raiz não publicada: ${encontrados.join(' | ')}`
  ).toEqual([])
})

/*
 * Guardião, achado A2: todo link da moldura que sai do site usa https: (ou é
 * mailto:), e todo link que abre nova aba leva noopener e noreferrer. Vale
 * para qualquer link, e não só para os dois que se conhecem hoje.
 */
test('todo link da moldura para fora do site usa https: ou mailto:, e nova aba leva noopener e noreferrer', async ({
  page,
}, informacoes) => {
  const falhas: string[] = []
  const contagem = { externos: 0, https: 0, mailto: 0, novaAba: 0, internos: 0 }

  for (const { endereco } of PAGINAS_PUBLICAS) {
    await page.goto(endereco)
    const links = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
          'header a[href], footer a[href], dialog a[href]'
        )
      ).map((link) => ({
        href: link.getAttribute('href') ?? '',
        absoluto: link.href,
        origemDaPagina: window.location.origin,
        alvo: link.getAttribute('target'),
        rel: (link.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean),
        regiao: link.closest('dialog') ? 'menu' : link.closest('header') ? 'cabeçalho' : 'rodapé',
        nome: (link.getAttribute('aria-label') ?? link.textContent ?? '').trim().slice(0, 40),
      }))
    )

    for (const link of links) {
      const onde = `${endereco}, ${link.regiao}, "${link.nome}" (href ${link.href})`
      const url = new URL(link.absoluto)
      if (url.protocol === 'mailto:') {
        contagem.externos += 1
        contagem.mailto += 1
      } else if (url.origin !== link.origemDaPagina) {
        contagem.externos += 1
        if (url.protocol === 'https:') contagem.https += 1
        else falhas.push(`${onde}: sai do site por ${url.protocol}, e não por https:`)
      } else {
        contagem.internos += 1
      }
      if (link.alvo === '_blank') {
        contagem.novaAba += 1
        for (const parte of ['noopener', 'noreferrer']) {
          if (!link.rel.includes(parte)) {
            falhas.push(`${onde}: target="_blank" com rel "${link.rel.join(' ')}", sem ${parte}`)
          }
        }
      }
    }
  }

  console.log(
    `[${informacoes.project.name}] links externos da moldura conferidos: ${contagem.externos}` +
      ` (https: ${contagem.https} · mailto: ${contagem.mailto})` +
      ` · com target="_blank": ${contagem.novaAba} · internos, fora desta regra: ${contagem.internos}`
  )
  expect(falhas, `links externos com defeito:\n${falhas.join('\n')}`).toEqual([])
  expect(contagem.externos, 'o teste precisa ter conferido algum link externo').toBeGreaterThan(0)
})

/*
 * RODAPÉ, COLUNA DE CONTATO E LINHA FINAL (REFERENCIA-VISUAL.md §7, regras de
 * 21/11 do Gabriel):
 *
 *   - Instagram, e-mail e endereço, cada um com um ícone decorativo ao lado
 *     (aria-hidden), que o leitor de tela não anuncia;
 *   - os três itens com passo uniforme de 44 px, medido do topo da primeira
 *     linha de texto de um ao topo da primeira linha do seguinte, com 1 px de
 *     tolerância. O endereço não é link;
 *   - nenhum alvo de toque da página por cima de outro;
 *   - a linha final centralizada: a sobra à esquerda e a sobra à direita do
 *     texto, na caixa da linha (a que tem o traço divisor) e no rodapé, diferem
 *     no máximo 1 px.
 */
const PASSO_DO_CONTATO = 44
const TOLERANCIA_DO_PASSO = 1
const TOLERANCIA_DA_CENTRALIZACAO = 1
/* Interseção menor que isso, em cada eixo, é arredondamento, e não sobreposição. */
const RUIDO_DE_SOBREPOSICAO = 0.01

type ItemDeContato = {
  texto: string
  topoDoTexto: number | null
  ehAlvo: boolean
  alvosDentro: number
  icones: { total: number; decorativos: number; visiveis: number; descricao: string[] }
}

type SobraDaLinha = {
  esquerda: number
  direita: number
  esquerdaNoRodape: number
  direitaNoRodape: number
}

type MedidaDoRodape = {
  erro: string | null
  itens: ItemDeContato[]
  alvos: number
  pares: number
  sobrepostos: string[]
  linhaFinal: { texto: string; linhas: SobraDaLinha[] } | null
}

async function medirRodape(page: Page): Promise<MedidaDoRodape> {
  return page.evaluate(
    ({ ruido }) => {
      const medida: MedidaDoRodape = {
        erro: null,
        itens: [],
        alvos: 0,
        pares: 0,
        sobrepostos: [],
        linhaFinal: null,
      }
      const rodape = document.querySelector('footer')
      if (!rodape) {
        medida.erro = 'a página não tem <footer>'
        return medida
      }
      const seletorDeAlvo =
        'a[href], button, input, select, textarea, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'

      /* Os nós de texto de um elemento, fora dos SVG, sem os só de espaço. */
      const textosDe = (elemento: Element) => {
        const nos: Text[] = []
        const caminho = document.createTreeWalker(elemento, NodeFilter.SHOW_TEXT)
        for (let no = caminho.nextNode(); no; no = caminho.nextNode()) {
          if (no.parentElement?.closest('svg')) continue
          if ((no.textContent ?? '').trim() !== '') nos.push(no as Text)
        }
        return nos
      }

      /* A coluna de contato é a do título "Contato"; os itens são os filhos do <address>. */
      const titulo = Array.from(rodape.querySelectorAll('h2, h3')).find(
        (h) => h.textContent?.trim() === 'Contato'
      )
      const endereco = titulo?.parentElement?.querySelector('address')
      if (!endereco) {
        medida.erro = 'o rodapé não tem a coluna "Contato" com um <address>'
        return medida
      }
      for (const item of Array.from(endereco.children)) {
        const textos = textosDe(item)
        let topoDoTexto: number | null = null
        const primeiro = textos[0]
        if (primeiro) {
          const faixa = document.createRange()
          faixa.selectNodeContents(primeiro)
          topoDoTexto = faixa.getClientRects()[0]?.top ?? null
        }
        const svgs = Array.from(item.querySelectorAll('svg'))
        medida.itens.push({
          texto: textos
            .map((no) => no.textContent ?? '')
            .join('')
            .trim(),
          topoDoTexto,
          ehAlvo: item.matches(seletorDeAlvo),
          alvosDentro: item.querySelectorAll(seletorDeAlvo).length,
          icones: {
            total: svgs.length,
            decorativos: svgs.filter((svg) => svg.getAttribute('aria-hidden') === 'true').length,
            visiveis: svgs.filter((svg) => {
              const caixa = svg.getBoundingClientRect()
              return caixa.width > 0 && caixa.height > 0
            }).length,
            descricao: svgs.map(
              (svg) =>
                `<svg aria-hidden="${svg.getAttribute('aria-hidden')}" focusable="${svg.getAttribute('focusable')}">`
            ),
          },
        })
      }

      /* Sobreposição: todo par de alvos visíveis da página, em que um não contém o outro. */
      const alvos = Array.from(document.querySelectorAll<HTMLElement>(seletorDeAlvo))
        .filter((alvo) => alvo.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
        .map((alvo) => ({ alvo, caixa: alvo.getBoundingClientRect() }))
        .filter(({ caixa }) => caixa.width > 0 && caixa.height > 0)
      medida.alvos = alvos.length
      const nomeDe = (alvo: HTMLElement) =>
        `<${alvo.tagName.toLowerCase()}> "${(alvo.getAttribute('aria-label') ?? alvo.textContent ?? '').trim().slice(0, 30)}"`
      for (let i = 0; i < alvos.length; i += 1) {
        for (let j = i + 1; j < alvos.length; j += 1) {
          const a = alvos[i]
          const b = alvos[j]
          if (!a || !b || a.alvo.contains(b.alvo) || b.alvo.contains(a.alvo)) continue
          medida.pares += 1
          const largura =
            Math.min(a.caixa.right, b.caixa.right) - Math.max(a.caixa.left, b.caixa.left)
          const altura =
            Math.min(a.caixa.bottom, b.caixa.bottom) - Math.max(a.caixa.top, b.caixa.top)
          if (largura > ruido && altura > ruido) {
            medida.sobrepostos.push(
              `${nomeDe(a.alvo)} e ${nomeDe(b.alvo)} se sobrepõem em ` +
                `${Math.round(largura * 100) / 100}x${Math.round(altura * 100) / 100} px`
            )
          }
        }
      }

      /*
       * A linha final: o elemento do texto com "©", inteiro. O React grava
       * "© {ano} LIACUP…" em mais de um nó de texto, então se mede o elemento,
       * e os retângulos de uma mesma linha visual são juntados num só. A caixa
       * da linha é o primeiro ancestral mais largo que o texto.
       */
      const copyright = textosDe(rodape).find((no) => (no.textContent ?? '').includes('©'))
      const elementoDoTexto = copyright?.parentElement
      if (copyright && elementoDoTexto) {
        const faixa = document.createRange()
        faixa.selectNodeContents(elementoDoTexto)
        const linhas: { top: number; left: number; right: number }[] = []
        for (const retangulo of Array.from(faixa.getClientRects())) {
          if (retangulo.width === 0) continue
          const mesma = linhas.find((linha) => Math.abs(linha.top - retangulo.top) < 1)
          if (mesma) {
            mesma.left = Math.min(mesma.left, retangulo.left)
            mesma.right = Math.max(mesma.right, retangulo.right)
          } else {
            linhas.push({ top: retangulo.top, left: retangulo.left, right: retangulo.right })
          }
        }
        const larguraDoTexto = faixa.getBoundingClientRect().width
        let caixaDaLinha: HTMLElement | null = elementoDoTexto
        while (
          caixaDaLinha &&
          caixaDaLinha !== rodape &&
          caixaDaLinha.getBoundingClientRect().width <= larguraDoTexto + 1
        ) {
          caixaDaLinha = caixaDaLinha.parentElement
        }
        const conteudo = (elemento: Element) => {
          const caixa = elemento.getBoundingClientRect()
          const estilo = window.getComputedStyle(elemento)
          return {
            esquerda:
              caixa.left + parseFloat(estilo.borderLeftWidth) + parseFloat(estilo.paddingLeft),
            direita:
              caixa.right - parseFloat(estilo.borderRightWidth) - parseFloat(estilo.paddingRight),
          }
        }
        const daLinha = conteudo(caixaDaLinha ?? rodape)
        const doRodape = conteudo(rodape)
        medida.linhaFinal = {
          texto: (elementoDoTexto.textContent ?? '').trim(),
          linhas: linhas.map((linha) => ({
            esquerda: linha.left - daLinha.esquerda,
            direita: daLinha.direita - linha.right,
            esquerdaNoRodape: linha.left - doRodape.esquerda,
            direitaNoRodape: doRodape.direita - linha.right,
          })),
        }
      }
      return medida
    },
    { ruido: RUIDO_DE_SOBREPOSICAO }
  )
}

const arredondar = (valor: number) => Math.round(valor * 100) / 100

test('o rodapé: ícones decorativos no contato, passo de 44 px, alvos sem sobreposição e linha final centralizada', async ({
  page,
}, informacoes) => {
  const falhas: string[] = []
  const contagem = {
    paginas: 0,
    itens: 0,
    icones: 0,
    iconesDecorativos: 0,
    passos: 0,
    passosForaDoLimite: 0,
    alvos: 0,
    pares: 0,
    sobrepostos: 0,
    linhasFinais: 0,
    linhasDescentralizadas: 0,
  }
  const notas: string[] = []

  for (const { endereco } of PAGINAS_PUBLICAS) {
    await page.goto(endereco)
    const medida = await medirRodape(page)
    if (medida.erro) {
      falhas.push(`${endereco}: ${medida.erro}`)
      continue
    }
    contagem.paginas += 1
    const onde = (texto: string) => `${endereco}, rodapé: ${texto}`

    /* Ícones: um por item, decorativo e na tela. */
    const { itens } = medida
    contagem.itens += itens.length
    if (itens.length !== 3) {
      falhas.push(onde(`a coluna de contato tem ${itens.length} itens, e não 3`))
    }
    for (const item of itens) {
      contagem.icones += item.icones.total
      contagem.iconesDecorativos += item.icones.decorativos
      if (item.icones.total !== 1) {
        falhas.push(onde(`"${item.texto}" tem ${item.icones.total} ícones, e não 1`))
      } else if (item.icones.decorativos !== 1) {
        falhas.push(
          onde(`o ícone de "${item.texto}" não é decorativo: ${item.icones.descricao.join(' ')}`)
        )
      } else if (item.icones.visiveis !== 1) {
        falhas.push(onde(`o ícone de "${item.texto}" não aparece na tela`))
      }
    }

    /* O endereço não é link nem tem link dentro. */
    const itemDoEndereco = itens.find((item) => item.texto.includes('FCTS'))
    if (!itemDoEndereco) falhas.push(onde('a coluna de contato não tem o endereço'))
    else if (itemDoEndereco.ehAlvo || itemDoEndereco.alvosDentro > 0) {
      falhas.push(onde(`o endereço "${itemDoEndereco.texto}" é alvo de toque, e não devia`))
    }

    /* Passo de 44 px, de topo a topo do texto. */
    const passos: string[] = []
    for (let i = 1; i < itens.length; i += 1) {
      const anterior = itens[i - 1]
      const atual = itens[i]
      if (!anterior || !atual) continue
      if (anterior.topoDoTexto === null || atual.topoDoTexto === null) {
        falhas.push(onde(`"${anterior.texto}" ou "${atual.texto}" sem texto para medir`))
        continue
      }
      const passo = atual.topoDoTexto - anterior.topoDoTexto
      contagem.passos += 1
      passos.push(String(arredondar(passo)))
      if (Math.abs(passo - PASSO_DO_CONTATO) > TOLERANCIA_DO_PASSO) {
        contagem.passosForaDoLimite += 1
        falhas.push(
          onde(
            `de "${anterior.texto}" a "${atual.texto}" o passo é ${arredondar(passo)} px, e não ` +
              `${PASSO_DO_CONTATO} ± ${TOLERANCIA_DO_PASSO} px`
          )
        )
      }
    }

    /* Nenhum alvo sobreposto. */
    contagem.alvos += medida.alvos
    contagem.pares += medida.pares
    contagem.sobrepostos += medida.sobrepostos.length
    falhas.push(...medida.sobrepostos.map((texto) => `${endereco}: ${texto}`))

    /* Linha final centralizada. */
    const sobras: string[] = []
    if (!medida.linhaFinal || medida.linhaFinal.linhas.length === 0) {
      falhas.push(onde('a linha final com "©" não foi encontrada'))
    } else {
      for (const linha of medida.linhaFinal.linhas) {
        contagem.linhasFinais += 1
        const naLinha = Math.abs(linha.esquerda - linha.direita)
        const noRodape = Math.abs(linha.esquerdaNoRodape - linha.direitaNoRodape)
        sobras.push(
          `${arredondar(linha.esquerda)} | ${arredondar(linha.direita)} px na linha, ` +
            `${arredondar(linha.esquerdaNoRodape)} | ${arredondar(linha.direitaNoRodape)} px no rodapé`
        )
        if (naLinha > TOLERANCIA_DA_CENTRALIZACAO || noRodape > TOLERANCIA_DA_CENTRALIZACAO) {
          contagem.linhasDescentralizadas += 1
          falhas.push(
            onde(
              `a linha final "${medida.linhaFinal.texto}" não está centralizada: sobra à ` +
                `esquerda e à direita de ${arredondar(linha.esquerda)} e ` +
                `${arredondar(linha.direita)} px na linha (diferença ${arredondar(naLinha)}) e de ` +
                `${arredondar(linha.esquerdaNoRodape)} e ${arredondar(linha.direitaNoRodape)} px ` +
                `no rodapé (diferença ${arredondar(noRodape)}), acima de ` +
                `${TOLERANCIA_DA_CENTRALIZACAO} px`
            )
          )
        }
      }
    }
    notas.push(
      `${endereco} passos ${passos.join(' e ')} px · linha final, sobra esquerda | direita: ${sobras.join(' · ')}`
    )
  }

  const p = informacoes.project.name
  console.log(
    `[${p}] rodapé conferido em ${contagem.paginas} de ${PAGINAS_PUBLICAS.length} páginas\n` +
      `[${p}] contato: itens ${contagem.itens} · ícones ${contagem.icones}, decorativos ${contagem.iconesDecorativos}\n` +
      `[${p}] passos de topo a topo do texto medidos: ${contagem.passos}` +
      ` · fora de ${PASSO_DO_CONTATO} ± ${TOLERANCIA_DO_PASSO} px: ${contagem.passosForaDoLimite}\n` +
      `[${p}] alvos da página: ${contagem.alvos} · pares conferidos: ${contagem.pares}` +
      ` · sobrepostos: ${contagem.sobrepostos}\n` +
      `[${p}] linhas finais medidas: ${contagem.linhasFinais}` +
      ` · fora do centro por mais de ${TOLERANCIA_DA_CENTRALIZACAO} px: ${contagem.linhasDescentralizadas}\n  ` +
      notas.join('\n  ')
  )
  expect(falhas, `rodapé com defeito:\n${falhas.join('\n')}`).toEqual([])
  expect(contagem.paginas).toBe(PAGINAS_PUBLICAS.length)
  expect(contagem.passos, 'o teste precisa ter medido algum passo').toBeGreaterThan(0)
  expect(contagem.pares, 'o teste precisa ter conferido algum par de alvos').toBeGreaterThan(0)
  expect(contagem.linhasFinais, 'o teste precisa ter medido a linha final').toBeGreaterThan(0)
})

/*
 * ÍCONE DA ABA (REFERENCIA-VISUAL.md §7, "Aba do navegador", Gabriel, 21/11).
 *
 * Nas páginas públicas, os <link rel="icon"> e o apple-touch-icon apontam para
 * arquivos que respondem 200 com tipo de imagem. Na raiz não publicada, que é a
 * produção até a R1 e não pode mudar, não há nenhum <link> de ícone.
 */
const SELETOR_DE_ICONE =
  'link[rel~="icon"], link[rel~="apple-touch-icon"], link[rel~="apple-touch-icon-precomposed"], link[rel~="mask-icon"]'

test('as páginas da lista têm o ícone da aba e o da tela de início, e os arquivos respondem 200 com tipo de imagem', async ({
  page,
  request,
}, informacoes) => {
  const falhas: string[] = []
  const contagem = { paginas: 0, links: 0, icon: 0, apple: 0, respondem: 0 }
  const vistos: string[] = []

  for (const { endereco } of PAGINAS_PUBLICAS) {
    await page.goto(endereco)
    const links = await page.locator(SELETOR_DE_ICONE).evaluateAll((elementos) =>
      elementos.map((link) => ({
        rel: link.getAttribute('rel') ?? '',
        href: link.getAttribute('href') ?? '',
        absoluto: (link as HTMLLinkElement).href,
        sizes: link.getAttribute('sizes') ?? '',
      }))
    )
    const icon = links.filter((link) => link.rel.split(/\s+/).includes('icon'))
    const apple = links.filter((link) => link.rel.split(/\s+/).includes('apple-touch-icon'))
    contagem.links += links.length
    contagem.icon += icon.length
    contagem.apple += apple.length
    if (icon.length === 0) falhas.push(`${endereco}: nenhum <link rel="icon">`)
    if (apple.length === 0) falhas.push(`${endereco}: nenhum <link rel="apple-touch-icon">`)

    let todosRespondem = true
    for (const link of links) {
      const resposta = await request.get(link.absoluto, { maxRedirects: 0 })
      const tipo = resposta.headers()['content-type'] ?? ''
      const bytes = (await resposta.body()).length
      if (resposta.status() !== 200 || !tipo.startsWith('image/') || bytes === 0) {
        todosRespondem = false
        falhas.push(
          `${endereco}: <link rel="${link.rel}" href="${link.href}"> respondeu ${resposta.status()},` +
            ` tipo "${tipo}", ${bytes} bytes (esperado 200 com image/*)`
        )
        continue
      }
      contagem.respondem += 1
      vistos.push(`${link.rel} ${link.href} ${link.sizes} · 200 ${tipo} ${bytes} bytes`)
    }
    if (todosRespondem && icon.length > 0 && apple.length > 0) contagem.paginas += 1
  }

  console.log(
    `[${informacoes.project.name}] ícone da aba conferido em ${contagem.paginas} de ${PAGINAS_PUBLICAS.length} páginas` +
      ` · <link> de ícone: ${contagem.links} (icon ${contagem.icon} · apple-touch-icon ${contagem.apple})` +
      ` · respondem 200 com image/*: ${contagem.respondem}\n  ` +
      vistos.join('\n  ')
  )
  expect(falhas, `ícone da aba com defeito:\n${falhas.join('\n')}`).toEqual([])
  expect(contagem.paginas).toBe(PAGINAS_PUBLICAS.length)
})

test('a raiz não publicada não tem nenhum <link> de ícone', async ({ page }, informacoes) => {
  await page.goto(`${ORIGEM_NAO_PUBLICADO}/`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portal em construção')
  const todos = await page.locator('link').count()
  const deIcone = await page
    .locator(SELETOR_DE_ICONE)
    .evaluateAll((elementos) =>
      elementos.map(
        (link) => `<link rel="${link.getAttribute('rel')}" href="${link.getAttribute('href')}">`
      )
    )

  console.log(
    `[${informacoes.project.name}] raiz não publicada: <link> na página: ${todos}` +
      ` · de ícone: ${deIcone.length}`
  )
  expect(todos, 'o teste precisa ter visto algum <link> na página').toBeGreaterThan(0)
  expect(deIcone, `a raiz não publicada tem <link> de ícone: ${deIcone.join(' ')}`).toEqual([])
})
