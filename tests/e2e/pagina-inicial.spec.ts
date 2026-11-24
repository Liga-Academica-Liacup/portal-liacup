import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import { LARGURAS, ORIGEM_NAO_PUBLICADO } from '../../playwright.config'
import { CONTEUDO_DO_CONTATO } from '../../src/features/contato/conteudo'
import { NUMEROS_DA_LIGA } from '../../src/features/numeros-da-liga/conteudo'
import { CONTEUDO_DO_PROCESSO_SELETIVO } from '../../src/features/processo-seletivo/conteudo'
import { estaNaLista } from '../../src/lib/utils/paginas-publicas'
import { ALVO_MINIMO, TAGS_DO_AXE } from './apoio'
import {
  DOC,
  PROTOTIPO_DA_INICIAL,
  REF,
  contraste as contrasteEntre,
  escapar,
  hex,
  nomeDaCor,
  normalizar,
  razao,
  rgbDoHex,
} from './leitura-da-inicial'
import type { Rgb } from './leitura-da-inicial'

/*
 * A PÁGINA INICIAL PUBLICADA (layout-e-hero, design.md D6 e D7, item 4; e
 * inicio-completo, design.md D7, itens 1 a 5; spec pagina-inicial).
 *
 * Com o site publicado (a 3000, `baseURL`), a raiz mostra a inicial: o hero, os
 * números, a faixa do processo seletivo e o bloco de contato, e não mais
 * "Portal em construção". A página em construção continua coberta na 3001
 * pelo interruptor.spec.ts, que não muda; aqui, a 3001 só confere que nenhum
 * bloco novo vaza para ela.
 *
 * O texto do hero é lido do docs/conteudo-institucional.md, seção 2.0, e não
 * escrito aqui: o documento é a fonte única de todo texto que vai ao ar
 * (constitution, princípio 5). Se a página divergir dele, este spec fica
 * vermelho; se o documento mudar, o spec acompanha. O texto dos blocos novos
 * é lido do documento, da REFERENCIA-VISUAL.md §7 e do protótipo pelo
 * leitura-da-inicial.ts, e comparado também com os arquivos de dados.
 *
 * Axe, rolagem, alvos e pedidos externos da raiz estão também no
 * paginas-publicas.spec.ts, que mede toda página da lista.
 */

const SOBRETITULO = 'Universidade de Brasília'
const TITULO_EM_CONSTRUCAO = 'Portal em construção'

/* Os botões do hero e a página a que cada um leva (spec pagina-inicial). */
const BOTOES_DO_HERO = [
  { rotulo: 'Quero participar', endereco: '/processo-seletivo' },
  { rotulo: 'Conheça a Liga', endereco: '/sobre' },
] as const

function textoDoHero() {
  const documento = readFileSync(join(process.cwd(), 'docs', 'conteudo-institucional.md'), 'utf8')
  const inicio = documento.indexOf('### 2.0')
  const fim = documento.indexOf('\n### ', inicio + 1)
  const secao = documento.slice(inicio, fim === -1 ? undefined : fim)
  const ler = (padrao: RegExp, nome: string) => {
    const achado = padrao.exec(secao)?.[1]?.trim()
    if (!achado) throw new Error(`conteudo-institucional.md §2.0 sem ${nome}`)
    return achado
  }
  return {
    titulo: ler(/\*\*Título:\*\*\s*(.+)/, 'o título'),
    lema: ler(/\*\*Lema[^*]*:\*\*\s*(.+)/, 'o lema'),
    apresentacao: ler(/^>\s*(.+)$/m, 'a apresentação'),
  }
}

const TEXTO = textoDoHero()

async function abrirRaiz(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}

/*
 * Os blocos da raiz, achados pela estrutura e pelo texto lido dos documentos,
 * e não por classe CSS: o hero é a <section> do <main> com o h1; os números, a
 * <section> logo depois dela; a faixa e o contato, a <section> com o h2 que a
 * §7 dá a cada um.
 */
const heroDe = (page: Page) =>
  page
    .getByRole('main')
    .locator('section')
    .filter({ has: page.getByRole('heading', { level: 1 }) })
const numerosDe = (page: Page) => heroDe(page).locator('xpath=following-sibling::section[1]')
const secaoComTitulo = (page: Page, titulo: string) =>
  page
    .getByRole('main')
    .locator('section')
    .filter({ has: page.getByRole('heading', { level: 2, name: titulo, exact: true }) })
const faixaDe = (page: Page) => secaoComTitulo(page, REF.faixa.titulo)
const contatoDe = (page: Page) => secaoComTitulo(page, REF.contato.titulo)

test('a raiz publicada responde 200, sem redirecionamento, e não mostra a página em construção', async ({
  page,
  request,
}, informacoes) => {
  const resposta = await request.get('/', { maxRedirects: 0 })
  expect(
    { status: resposta.status(), location: resposta.headers()['location'] },
    'a raiz publicada precisa responder 200 sem Location'
  ).toEqual({ status: 200, location: undefined })

  await abrirRaiz(page)
  expect(new URL(page.url()).pathname).toBe('/')
  const emConstrucao = await page.getByText(TITULO_EM_CONSTRUCAO).count()
  console.log(
    `[${informacoes.project.name}] raiz publicada: status ${resposta.status()}` +
      ` · "${TITULO_EM_CONSTRUCAO}" encontrado ${emConstrucao} vezes`
  )
  expect(emConstrucao).toBe(0)
})

test('o hero tem o sobretítulo, o título, o lema e a apresentação do documento de conteúdo', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const conteudo = page.getByRole('main')
  const titulo = conteudo.getByRole('heading', { level: 1 })
  const sobretitulo = conteudo.getByText(SOBRETITULO, { exact: true })
  const lema = conteudo.getByText(TEXTO.lema, { exact: true })
  const apresentacao = conteudo.getByText(TEXTO.apresentacao, { exact: true })

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(titulo).toHaveText(TEXTO.titulo)
  for (const [nome, elemento] of [
    ['sobretítulo', sobretitulo],
    ['lema', lema],
    ['apresentação', apresentacao],
  ] as const) {
    await expect(
      elemento,
      `${nome} ausente ou diferente do conteudo-institucional.md`
    ).toBeVisible()
  }

  /* "Acima do título" e "logo abaixo": a ordem na tela e na leitura. */
  const [caixaSobre, caixaTitulo, caixaLema, caixaApresentacao] = await Promise.all(
    [sobretitulo, titulo, lema, apresentacao].map(async (elemento) => elemento.boundingBox())
  )
  expect(caixaSobre && caixaTitulo && caixaLema && caixaApresentacao).toBeTruthy()
  if (caixaSobre && caixaTitulo && caixaLema && caixaApresentacao) {
    expect(caixaSobre.y + caixaSobre.height, 'sobretítulo acima do título').toBeLessThanOrEqual(
      caixaTitulo.y + 1
    )
    expect(caixaLema.y, 'lema logo abaixo do título').toBeGreaterThanOrEqual(
      caixaTitulo.y + caixaTitulo.height - 1
    )
    expect(caixaApresentacao.y, 'apresentação abaixo do lema').toBeGreaterThanOrEqual(
      caixaLema.y + caixaLema.height - 1
    )
  }
  const lemaVemDepoisDoTitulo = await titulo.evaluate(
    (h1, texto) => h1.nextElementSibling?.textContent?.trim() === texto,
    TEXTO.lema
  )
  expect(lemaVemDepoisDoTitulo, 'o lema não é o elemento logo depois do título').toBe(true)

  const palavras = [TEXTO.titulo, TEXTO.lema, TEXTO.apresentacao].map(
    (texto) => texto.split(/\s+/).length
  )
  console.log(
    `[${informacoes.project.name}] hero contra o conteudo-institucional.md §2.0: título ${palavras[0]}` +
      ` palavras · lema ${palavras[1]} · apresentação ${palavras[2]} · sobretítulo "${SOBRETITULO}"`
  )
})

test('os botões do hero só aparecem para páginas que estão na lista', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  /*
   * O escopo é o hero, e não o <main> inteiro (inicio-completo, tarefa 3.1): a
   * faixa do processo seletivo tem um botão com o mesmo rótulo e o mesmo
   * destino do primeiro botão do hero (Q3 (a) do Gabriel, 23/11/2026). O que o
   * escopo do <main> garantia sozinho, que nenhum outro link do conteúdo tem
   * esse rótulo, continua garantido logo abaixo, pela conta fora do hero.
   */
  const conteudo = heroDe(page)
  await expect(conteudo, 'o hero: uma <section> do <main> com o h1').toHaveCount(1)
  const linhas: string[] = []
  for (const botao of BOTOES_DO_HERO) {
    const link = conteudo.getByRole('link', { name: botao.rotulo, exact: true })
    const naLista = estaNaLista(botao.endereco)
    if (naLista) {
      await expect(link, `"${botao.rotulo}" ausente com ${botao.endereco} na lista`).toBeVisible()
      await expect(link).toHaveAttribute('href', botao.endereco)
    } else {
      await expect(link, `"${botao.rotulo}" aparece sem ${botao.endereco} na lista`).toHaveCount(0)
    }
    linhas.push(
      `"${botao.rotulo}" ${naLista ? 'presente' : 'ausente'} (${botao.endereco} ${naLista ? 'na' : 'fora da'} lista)`
    )
  }
  /*
   * Fora do hero, no <main>, o rótulo de um botão do hero só pode estar no
   * botão da faixa, e com o mesmo destino: nenhum outro link do conteúdo o usa.
   */
  const foraDoHero: string[] = []
  for (const botao of BOTOES_DO_HERO) {
    const porRotulo = { name: botao.rotulo, exact: true } as const
    const noConteudo = await page.getByRole('main').getByRole('link', porRotulo).count()
    const noHero = await conteudo.getByRole('link', porRotulo).count()
    const naFaixa = faixaDe(page).getByRole('link', porRotulo)
    const quantosNaFaixa = await naFaixa.count()
    const sobra = noConteudo - noHero - quantosNaFaixa
    if (sobra !== 0)
      foraDoHero.push(`"${botao.rotulo}": ${sobra} link(s) no <main> fora do hero e da faixa`)
    for (const destino of await naFaixa.evaluateAll((links) =>
      links.map((link) => link.getAttribute('href'))
    ))
      if (destino !== botao.endereco)
        foraDoHero.push(`"${botao.rotulo}" na faixa leva a ${destino}, e não a ${botao.endereco}`)
    linhas.push(
      `"${botao.rotulo}" no <main>: ${noConteudo} (hero ${noHero}, faixa ${quantosNaFaixa}, fora dos dois ${sobra})`
    )
  }
  expect(foraDoHero, foraDoHero.join('\n')).toEqual([])
  /*
   * O botão que aparece leva de verdade à página dele (pagina-processo-seletivo,
   * design.md D8, item 3): clicado, o endereço muda e o título principal da
   * página nova aparece. Nenhum endereço é escrito aqui além do da tabela acima.
   */
  const presentes = BOTOES_DO_HERO.filter((botao) => estaNaLista(botao.endereco))
  const navegados: string[] = []
  for (const botao of presentes) {
    await abrirRaiz(page)
    await heroDe(page).getByRole('link', { name: botao.rotulo, exact: true }).click()
    await expect(page, `"${botao.rotulo}" não levou a ${botao.endereco}`).toHaveURL(
      (url) => url.pathname === botao.endereco
    )
    const titulo = page.getByRole('heading', { level: 1 })
    await expect(titulo, `${botao.endereco} sem título principal`).toHaveCount(1)
    navegados.push(
      `"${botao.rotulo}" → ${botao.endereco}, h1 "${(await titulo.innerText()).trim()}"`
    )
  }
  console.log(
    `[${informacoes.project.name}] botões do hero conferidos: ${linhas.length} · ${linhas.join(' · ')}` +
      `\n[${informacoes.project.name}] botões do hero seguidos pelo clique: ${navegados.length} de ${presentes.length}` +
      (navegados.length > 0 ? ` · ${navegados.join(' · ')}` : '')
  )
  expect(navegados.length).toBe(presentes.length)
  /*
   * Nesta entrega o Sobre está na lista (pagina-sobre-e-equipe, D9, item 2):
   * os dois botões aparecem, e o "Conheça a Liga" leva a /sobre. Sem isto,
   * uma lista que perdesse o Sobre deixaria o teste verde, com o botão ausente.
   */
  expect(
    presentes.map((botao) => botao.rotulo),
    'nesta entrega os dois botões do hero aparecem'
  ).toEqual(BOTOES_DO_HERO.map((botao) => botao.rotulo))
})

test('o quadro da foto e as borboletas são decorativos, sem texto e sem imagem inventada', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  /*
   * O escopo das contas do quadro e das imagens é o hero, e não o <main>
   * inteiro (inicio-completo, tarefa 3.1): o bloco de contato tem a logo e o
   * ícone do Gmail, que a spec pede, e a faixa tem o círculo decorativo, um
   * <div aria-hidden>. As contas que valem para o conteúdo inteiro (desenho
   * fora do leitor de tela, nenhum focável escondido, imagem decorativa)
   * continuam no <main>, logo abaixo.
   */
  const hero = heroDe(page)
  await expect(hero, 'o hero: uma <section> do <main> com o h1').toHaveCount(1)
  const medida = await hero.evaluate((conteudo) => {
    const desenhos = Array.from(conteudo.querySelectorAll('svg'))
    const foraDoLeitor = desenhos.filter((desenho) => desenho.closest('[aria-hidden="true"]'))
    const escondidos = Array.from(conteudo.querySelectorAll<HTMLElement>('[aria-hidden="true"]'))
    const quadros = escondidos.filter((elemento) => elemento.tagName === 'DIV')
    return {
      desenhos: desenhos.length,
      foraDoLeitor: foraDoLeitor.length,
      quadros: quadros.length,
      textoNosQuadros: quadros.map((quadro) => quadro.textContent?.trim() ?? '').join(''),
      desenhosNosQuadros: quadros.reduce((n, q) => n + q.querySelectorAll('svg').length, 0),
      imagens: conteudo.querySelectorAll('img, picture, video, [role="img"]').length,
      focaveisEscondidos: escondidos.reduce(
        (n, e) => n + e.querySelectorAll('a[href], button, [tabindex]').length,
        0
      ),
    }
  })
  const marcacao = await page.getByText(/Foto institucional/i).count()

  /* O <main> inteiro: o que valia antes para o conteúdo todo continua valendo. */
  const noConteudo = await page.getByRole('main').evaluate((conteudo) => {
    const desenhos = Array.from(conteudo.querySelectorAll('svg'))
    const escondidos = Array.from(conteudo.querySelectorAll<HTMLElement>('[aria-hidden="true"]'))
    const imagens = Array.from(conteudo.querySelectorAll('img, picture, video, [role="img"]'))
    const foraDoHero = imagens.filter((imagem) => !imagem.closest('section')?.querySelector('h1'))
    return {
      desenhos: desenhos.length,
      foraDoLeitor: desenhos.filter((desenho) => desenho.closest('[aria-hidden="true"]')).length,
      focaveisEscondidos: escondidos.reduce(
        (n, e) => n + e.querySelectorAll('a[href], button, [tabindex]').length,
        0
      ),
      imagensForaDoHero: foraDoHero.length,
      imagensAnunciadas: foraDoHero
        .filter(
          (imagem) =>
            !imagem.closest('[aria-hidden="true"]') &&
            !(imagem.tagName === 'IMG' && imagem.getAttribute('alt') === '')
        )
        .map((imagem) => `<${imagem.tagName.toLowerCase()}> alt ${imagem.getAttribute('alt')}`),
    }
  })

  console.log(
    `[${informacoes.project.name}] desenhos no hero: ${medida.desenhos}` +
      ` · fora do leitor de tela: ${medida.foraDoLeitor} · quadros: ${medida.quadros}` +
      ` com ${medida.desenhosNosQuadros} borboleta(s) e ${medida.textoNosQuadros.length} caracteres de texto` +
      ` · imagens no hero: ${medida.imagens} · focáveis escondidos no hero: ${medida.focaveisEscondidos}` +
      ` · "Foto institucional": ${marcacao}\n` +
      `[${informacoes.project.name}] no <main>: desenhos ${noConteudo.desenhos}, fora do leitor ${noConteudo.foraDoLeitor}` +
      ` · focáveis escondidos ${noConteudo.focaveisEscondidos}` +
      ` · imagens fora do hero ${noConteudo.imagensForaDoHero}, anunciadas ${noConteudo.imagensAnunciadas.length}`
  )
  expect(medida.desenhos, 'o hero precisa ter as borboletas').toBeGreaterThan(0)
  expect(medida.foraDoLeitor, 'desenho do hero anunciado ao leitor de tela').toBe(medida.desenhos)
  expect(medida.quadros, 'o quadro da foto não foi encontrado').toBe(1)
  expect(medida.desenhosNosQuadros, 'o quadro sem a borboleta da liga').toBeGreaterThan(0)
  expect(medida.textoNosQuadros, 'texto dentro do quadro da foto').toBe('')
  expect(medida.imagens, 'imagem no lugar da foto, que ainda não existe').toBe(0)
  expect(medida.focaveisEscondidos, 'controle focável escondido do leitor de tela').toBe(0)
  expect(marcacao).toBe(0)
  expect(noConteudo.foraDoLeitor, 'desenho do conteúdo anunciado ao leitor de tela').toBe(
    noConteudo.desenhos
  )
  expect(noConteudo.focaveisEscondidos, 'controle focável escondido no conteúdo').toBe(0)
  expect(noConteudo.imagensAnunciadas, 'imagem do conteúdo anunciada ao leitor de tela').toEqual([])
})

/*
 * As borboletas voam: a posição muda com a animação. Por isso a medida para a
 * animação em oito poses do voo, e não só na pose de repouso, e compara a
 * caixa de cada borboleta com a caixa de cada linha de texto do conteúdo.
 */
test('nenhuma borboleta fica por cima de texto, em nenhuma pose do voo', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const POSES = 8
  const medida = await page.getByRole('main').evaluate((conteudo, poses) => {
    const borboletas = Array.from(conteudo.querySelectorAll('svg')).filter((desenho) =>
      desenho.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
    )
    const linhas: { texto: string; caixa: DOMRect }[] = []
    const percurso = document.createTreeWalker(conteudo, NodeFilter.SHOW_TEXT)
    for (let no = percurso.nextNode(); no; no = percurso.nextNode()) {
      const texto = no.textContent?.trim() ?? ''
      if (!texto || !no.parentElement?.checkVisibility()) continue
      const faixa = document.createRange()
      faixa.selectNodeContents(no)
      for (const caixa of Array.from(faixa.getClientRects())) {
        if (caixa.width > 0 && caixa.height > 0) linhas.push({ texto: texto.slice(0, 30), caixa })
      }
    }
    const sobreposicoes = new Set<string>()
    let comparacoes = 0
    for (let pose = 0; pose < poses; pose += 1) {
      for (const borboleta of borboletas) {
        for (const animacao of borboleta.getAnimations()) {
          const duracao = Number(animacao.effect?.getComputedTiming().duration ?? 0)
          animacao.pause()
          animacao.currentTime = (duracao * pose) / poses
        }
        const b = borboleta.getBoundingClientRect()
        for (const linha of linhas) {
          comparacoes += 1
          const largura = Math.min(b.right, linha.caixa.right) - Math.max(b.left, linha.caixa.left)
          const altura = Math.min(b.bottom, linha.caixa.bottom) - Math.max(b.top, linha.caixa.top)
          if (largura > 0.5 && altura > 0.5) {
            sobreposicoes.add(`${borboleta.getAttribute('class')} sobre "${linha.texto}"`)
          }
        }
      }
    }
    return {
      borboletas: borboletas.length,
      linhas: linhas.length,
      comparacoes,
      sobreposicoes: [...sobreposicoes],
    }
  }, POSES)

  console.log(
    `[${informacoes.project.name}] borboletas visíveis medidas: ${medida.borboletas}` +
      ` · linhas de texto: ${medida.linhas} · poses do voo: ${POSES}` +
      ` · comparações: ${medida.comparacoes} · por cima de texto: ${medida.sobreposicoes.length}`
  )
  expect(medida.borboletas).toBeGreaterThan(0)
  expect(medida.linhas).toBeGreaterThan(0)
  expect(medida.sobreposicoes, medida.sobreposicoes.join('\n')).toEqual([])
})

/*
 * RP-09: o par nomeia as duas cores e a superfície medida. A cor do lema é a
 * da Q7 do Gabriel (21/11): --color-accent-600, e não mais a -700. O mínimo
 * continua 4,5:1, porque no celular o lema tem 20 px e não conta como texto
 * grande.
 */
const TOKEN_DO_LEMA = '--color-accent-600'

test(`o lema sai em ${TOKEN_DO_LEMA}, com contraste de pelo menos 4,5:1 sobre a superfície`, async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const lema = page.getByRole('main').getByText(TEXTO.lema, { exact: true })
  const medida = await lema.evaluate((elemento, nomeDoToken) => {
    const paraRgb = (cor: string) => {
      const tela = document.createElement('canvas').getContext('2d')
      if (!tela) return [0, 0, 0, 0]
      tela.fillStyle = cor
      tela.fillRect(0, 0, 1, 1)
      return Array.from(tela.getImageData(0, 0, 1, 1).data)
    }
    const token = getComputedStyle(document.documentElement).getPropertyValue(nomeDoToken).trim()
    let superficie: Element | null = elemento
    let fundo = 'rgba(0, 0, 0, 0)'
    let imagemDeFundo = 'none'
    while (superficie) {
      const estilo = getComputedStyle(superficie)
      if (estilo.backgroundImage !== 'none') imagemDeFundo = estilo.backgroundImage
      if (paraRgb(estilo.backgroundColor)[3] === 255) {
        fundo = estilo.backgroundColor
        break
      }
      superficie = superficie.parentElement
    }
    const nomeDaSuperficie = superficie
      ? `<${superficie.tagName.toLowerCase()}${superficie.className ? ` class="${String(superficie.className)}"` : ''}>`
      : 'nenhuma'
    return {
      cor: getComputedStyle(elemento).color,
      corRgb: paraRgb(getComputedStyle(elemento).color),
      token,
      tokenRgb: paraRgb(token),
      fundo,
      fundoRgb: paraRgb(fundo),
      imagemDeFundo,
      superficie: nomeDaSuperficie,
      tamanho: getComputedStyle(elemento).fontSize,
    }
  }, TOKEN_DO_LEMA)

  const luminancia = ([r = 0, g = 0, b = 0]: number[]) => {
    const canal = (valor: number) => {
      const c = valor / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
  }
  const [clara, escura] = [luminancia(medida.corRgb), luminancia(medida.fundoRgb)].sort(
    (a, b) => b - a
  )
  const contraste = ((clara ?? 0) + 0.05) / ((escura ?? 0) + 0.05)

  console.log(
    `[${informacoes.project.name}] lema ${medida.cor} (${TOKEN_DO_LEMA} ${medida.token}, ${medida.tamanho})` +
      ` sobre ${medida.fundo} da superfície ${medida.superficie}: ${contraste.toFixed(2)}:1` +
      ` · imagem de fundo no caminho: ${medida.imagemDeFundo}`
  )
  /* soft: a cor e o contraste falham cada um com a sua mensagem; um não esconde o outro. */
  expect
    .soft(medida.corRgb.slice(0, 3), `o lema não está em ${TOKEN_DO_LEMA}`)
    .toEqual(medida.tokenRgb.slice(0, 3))
  expect
    .soft(medida.imagemDeFundo, 'gradiente ou imagem atrás do lema: contraste não medível assim')
    .toBe('none')
  expect(contraste, `lema com ${contraste.toFixed(2)}:1, abaixo de 4,5:1`).toBeGreaterThanOrEqual(
    4.5
  )
})

/* ======================================================================== */
/* OS BLOCOS NOVOS (inicio-completo, design.md D7, itens 1 a 5)              */
/* ======================================================================== */

/* O que a spec manda não aparecer na faixa ("Nada do exemplo do protótipo"). */
const PROIBIDOS_DA_SPEC_NA_FAIXA = [
  '2026.2',
  'Inscrições abertas',
  '28 de agosto',
  'prova de conhecimentos',
  'Ver o edital',
]

/* O que a spec manda não aparecer no contato ("Nada errado nem de demonstração"). */
const PROIBIDOS_DA_SPEC_NO_CONTATO = [
  'liacup@unb.br',
  'Perfil do Instagram',
  'Logo do e-mail',
  'Foto de perfil do Instagram da liga',
]

/* O destino do botão da faixa é o da §7; o botão só aparece se a página está na lista. */
const BOTAO_DA_FAIXA_NA_LISTA = estaNaLista(REF.faixa.destinoDoBotao)

/* O aviso, montado do arquivo de dados como a página o desenha. */
const AVISO_DOS_DADOS = (() => {
  const { aviso } = CONTEUDO_DO_PROCESSO_SELETIVO.inscricoes
  return normalizar(`${aviso.antesDoLink}${aviso.textoDoLink}${aviso.depoisDoLink}`)
})()

type Trecho = { nome: string; esperado: string; recebido: string }

/* A primeira palavra diferente, o esperado e o recebido inteiros. */
function diferencaDoTrecho(trecho: Trecho, fonte: string): string | null {
  if (trecho.recebido === trecho.esperado) return null
  const esperadas = trecho.esperado.split(' ')
  const recebidas = trecho.recebido.split(' ')
  let palavra = 0
  while (palavra < esperadas.length && esperadas[palavra] === recebidas[palavra]) palavra += 1
  return (
    `trecho "${trecho.nome}" difere ${fonte}, na palavra ${palavra + 1}:` +
    ` esperado "${esperadas[palavra] ?? '(fim)'}", recebido "${recebidas[palavra] ?? '(fim)'}"\n` +
    `    esperado: "${trecho.esperado}"\n    recebido: "${trecho.recebido}"`
  )
}

/* Tirado do texto cada esperado, uma vez, do mais longo ao mais curto: o que sobra. */
function sobraDoTexto(texto: string, esperados: string[]): string {
  let sobra = texto
  for (const esperado of [...esperados].sort((a, b) => b.length - a.length))
    sobra = sobra.replace(esperado, ' ')
  return normalizar(sobra)
}

/* Palavra inteira, sem diferenciar maiúscula; termo sem letra, por inclusão. */
const acha = (termo: string, onde: string) =>
  /\p{L}/u.test(termo)
    ? new RegExp(`(?<!\\p{L})${escapar(termo)}(?!\\p{L})`, 'iu').test(onde)
    : onde.includes(termo)

/*
 * O <main> da raiz, lido pela estrutura: as <section> filhas, cada uma com o
 * título, o texto visível (sem o que é só para leitor de tela, de 1 px ou
 * menos) e, nos blocos novos, as partes que a spec nomeia.
 */
async function lerRaiz(page: Page) {
  return page.getByRole('main').evaluate(
    (main, titulos) => {
      const n = (texto: string | null | undefined) => (texto ?? '').replace(/\s+/g, ' ').trim()
      const visivel = (elemento: Element | null) => {
        for (let atual = elemento; atual; atual = atual.parentElement) {
          const caixa = atual.getBoundingClientRect()
          if (caixa.width <= 1 || caixa.height <= 1) return false
        }
        return true
      }
      const textoVisivel = (raiz: Element | null | undefined) => {
        if (!raiz) return ''
        const partes: string[] = []
        const caminho = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT)
        for (let no = caminho.nextNode(); no; no = caminho.nextNode())
          if (visivel(no.parentElement)) partes.push(no.textContent ?? '')
        return n(partes.join(' '))
      }
      const secoes = Array.from(main.children).filter((filho) => filho.tagName === 'SECTION')
      const comTitulo = (titulo: string) =>
        secoes.find((secao) =>
          Array.from(secao.querySelectorAll('h2')).some((h2) => n(h2.textContent) === titulo)
        )
      const hero = secoes.find((secao) => secao.querySelector('h1'))
      const numeros =
        hero?.nextElementSibling?.tagName === 'SECTION' ? hero.nextElementSibling : null
      const faixa = comTitulo(titulos.faixa)
      const contato = comTitulo(titulos.contato)
      const h2De = (secao: Element | undefined) =>
        Array.from(secao?.querySelectorAll('h2') ?? []).find((h2) => n(h2.textContent) !== '')
      const h2DaFaixa = h2De(faixa)
      const linkDoAviso = faixa?.querySelector('a[target="_blank"]')
      const botaoDaFaixa = Array.from(faixa?.querySelectorAll('a') ?? []).filter(
        (link) => link !== linkDoAviso
      )
      const h2DoContato = h2De(contato)
      const folhasVisiveis = (raiz: Element) =>
        Array.from(raiz.querySelectorAll('span, p'))
          .filter(
            (elemento) =>
              elemento.children.length === 0 &&
              !elemento.closest('[aria-hidden="true"]') &&
              visivel(elemento) &&
              n(elemento.textContent) !== ''
          )
          .map((elemento) => n(elemento.textContent))
      return {
        secoes: secoes.map((secao, indice) => ({
          indice,
          titulo: n(secao.querySelector('h1, h2, h3')?.textContent),
          texto: textoVisivel(secao),
          textoSemTitulos: n(
            Array.from(secao.querySelectorAll('h1, h2, h3, h4, h5, h6')).reduce(
              (texto, titulo) => texto.replace(n(titulo.textContent), ' '),
              textoVisivel(secao)
            )
          ),
          bloco:
            secao === hero
              ? 'hero'
              : secao === numeros
                ? 'números'
                : secao === faixa
                  ? 'faixa'
                  : secao === contato
                    ? 'contato'
                    : 'outro',
        })),
        numeros: {
          achado: Boolean(numeros),
          texto: textoVisivel(numeros),
          itens: Array.from(numeros?.querySelectorAll('li') ?? []).map((item) => ({
            valor: n(item.children[0]?.textContent),
            rotulo: n(item.children[1]?.textContent),
          })),
        },
        faixa: {
          achada: Boolean(faixa),
          texto: textoVisivel(faixa),
          selo: n(h2DaFaixa?.previousElementSibling?.textContent),
          titulo: n(h2DaFaixa?.textContent),
          aviso: n(linkDoAviso?.closest('p')?.textContent),
          textoDoLink: n(linkDoAviso?.textContent),
          botoes: botaoDaFaixa.map((link) => n(link.textContent)),
        },
        contato: {
          achado: Boolean(contato),
          texto: textoVisivel(contato),
          sobretitulo: n(h2DoContato?.previousElementSibling?.textContent),
          titulo: n(h2DoContato?.textContent),
          quadros: Array.from(contato?.querySelectorAll('li') ?? []).map(folhasVisiveis),
        },
      }
    },
    { faixa: REF.faixa.titulo, contato: REF.contato.titulo }
  )
}

/* ------------------------------------------------------------------------ */
/* 1. O texto: documento, §7 e arquivos de dados                             */
/* ------------------------------------------------------------------------ */

test('o texto dos números, da faixa e do contato é o do documento e da §7, palavra por palavra, igual ao dos arquivos de dados, e nada a mais', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const lido = await lerRaiz(page)
  const falhas: string[] = []
  for (const [bloco, achado] of [
    ['números', lido.numeros.achado],
    ['faixa', lido.faixa.achada],
    ['contato', lido.contato.achado],
  ] as const)
    if (!achado) falhas.push(`bloco ${bloco} não achado no <main>`)

  /* Contra o documento e a §7. */
  const doDocumento: Trecho[] = [
    ...DOC.numeros.flatMap((numero, indice) => [
      {
        nome: `número ${indice + 1} (§9)`,
        esperado: numero,
        recebido: lido.numeros.itens[indice]?.valor ?? '(ausente)',
      },
      {
        nome: `rótulo do número ${indice + 1} (§7)`,
        esperado: REF.rotulos[indice] ?? '',
        recebido: lido.numeros.itens[indice]?.rotulo ?? '(ausente)',
      },
    ]),
    { nome: 'selo da faixa (§7)', esperado: REF.faixa.selo, recebido: lido.faixa.selo },
    { nome: 'título da faixa (§7)', esperado: REF.faixa.titulo, recebido: lido.faixa.titulo },
    { nome: 'aviso da faixa (§5.1)', esperado: DOC.aviso, recebido: lido.faixa.aviso },
    {
      nome: 'texto do link do aviso (§1)',
      esperado: DOC.instagram,
      recebido: lido.faixa.textoDoLink,
    },
    {
      nome: 'sobretítulo do contato (§7)',
      esperado: REF.contato.sobretitulo,
      recebido: lido.contato.sobretitulo,
    },
    {
      nome: 'título do contato (§7)',
      esperado: REF.contato.titulo,
      recebido: lido.contato.titulo,
    },
    ...REF.contato.quadros.flatMap((rotulo, indice) => [
      {
        nome: `rótulo do quadro ${indice + 1} (§7)`,
        esperado: rotulo,
        recebido: lido.contato.quadros[indice]?.[0] ?? '(ausente)',
      },
      {
        nome: `dado do quadro ${indice + 1} (§1)`,
        esperado: [DOC.instagram, DOC.email][indice] ?? '',
        recebido: lido.contato.quadros[indice]?.[1] ?? '(ausente)',
      },
    ]),
  ]
  if (BOTAO_DA_FAIXA_NA_LISTA)
    doDocumento.push({
      nome: 'rótulo do botão da faixa (§7)',
      esperado: REF.faixa.rotuloDoBotao,
      recebido: lido.faixa.botoes.join(' | ') || '(ausente)',
    })
  for (const trecho of doDocumento) {
    const diferenca = diferencaDoTrecho(trecho, 'do documento')
    if (diferenca) falhas.push(diferenca)
  }
  if (lido.numeros.itens.length !== DOC.numeros.length)
    falhas.push(`${lido.numeros.itens.length} números na página, e não ${DOC.numeros.length}`)
  if (lido.contato.quadros.length !== REF.contato.quadros.length)
    falhas.push(
      `${lido.contato.quadros.length} quadros no contato, e não ${REF.contato.quadros.length}`
    )

  /* Contra os arquivos de dados: a página desenha o que eles têm, e não uma cópia. */
  const dosDados: Trecho[] = [
    ...NUMEROS_DA_LIGA.map((numero, indice) => ({
      nome: `número ${indice + 1} (numeros-da-liga/conteudo.ts)`,
      esperado: `${numero.valor} ${numero.rotulo}`,
      recebido: `${lido.numeros.itens[indice]?.valor ?? ''} ${lido.numeros.itens[indice]?.rotulo ?? ''}`,
    })),
    {
      nome: 'selo (processo-seletivo/conteudo.ts)',
      esperado: CONTEUDO_DO_PROCESSO_SELETIVO.inscricoes.selo,
      recebido: lido.faixa.selo,
    },
    {
      nome: 'título (processo-seletivo/conteudo.ts)',
      esperado: CONTEUDO_DO_PROCESSO_SELETIVO.titulo,
      recebido: lido.faixa.titulo,
    },
    {
      nome: 'aviso (processo-seletivo/conteudo.ts)',
      esperado: AVISO_DOS_DADOS,
      recebido: lido.faixa.aviso,
    },
    {
      nome: 'topo do contato (contato/conteudo.ts)',
      esperado: `${CONTEUDO_DO_CONTATO.blocoDaInicial.sobretitulo} ${CONTEUDO_DO_CONTATO.blocoDaInicial.titulo}`,
      recebido: `${lido.contato.sobretitulo} ${lido.contato.titulo}`,
    },
  ]
  if (BOTAO_DA_FAIXA_NA_LISTA)
    dosDados.push({
      nome: 'rótulo do botão (processo-seletivo/conteudo.ts)',
      esperado: CONTEUDO_DO_PROCESSO_SELETIVO.chamadaDaInicial.rotuloDoBotao,
      recebido: lido.faixa.botoes.join(' | ') || '(ausente)',
    })
  for (const trecho of dosDados) {
    const diferenca = diferencaDoTrecho(trecho, 'do arquivo de dados')
    if (diferenca) falhas.push(diferenca)
  }

  /* Nada a mais: o texto visível de cada bloco, tirados os trechos conferidos. */
  const sobras = [
    {
      bloco: 'números',
      sobra: sobraDoTexto(
        lido.numeros.texto,
        doDocumento.filter((t) => t.nome.includes('número')).map((t) => t.esperado)
      ),
    },
    {
      bloco: 'faixa',
      sobra: sobraDoTexto(lido.faixa.texto, [
        REF.faixa.selo,
        REF.faixa.titulo,
        DOC.aviso,
        ...(BOTAO_DA_FAIXA_NA_LISTA ? [REF.faixa.rotuloDoBotao] : []),
      ]),
    },
    {
      bloco: 'contato',
      sobra: sobraDoTexto(lido.contato.texto, [
        REF.contato.sobretitulo,
        REF.contato.titulo,
        ...REF.contato.quadros,
        DOC.instagram,
        DOC.email,
      ]),
    },
  ]
  for (const { bloco, sobra } of sobras)
    if (/[\p{L}\p{N}]/u.test(sobra))
      falhas.push(`bloco ${bloco}: texto fora do documento e da §7: "${sobra}"`)

  console.log(
    `[${informacoes.project.name}] números lidos do documento: ${DOC.numeros.length}` +
      ` (${DOC.numeros.join(', ')}, do parêntese "${DOC.parentese}") · rótulos lidos da §7: ${REF.rotulos.length}` +
      `\n[${informacoes.project.name}] trechos conferidos: ${doDocumento.length} contra o documento e a §7` +
      ` · ${dosDados.length} contra os arquivos de dados · aviso: ${DOC.aviso.split(' ').length} palavras` +
      ` · caracteres de texto fora do documento: ${sobras.map((s) => `${s.bloco} ${s.sobra.length}`).join(', ')}` +
      ` · diferenças: ${falhas.length}`
  )
  expect(falhas, `a inicial diverge:\n${falhas.join('\n')}`).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 2. Os números: lista, posição e colunas                                   */
/* ------------------------------------------------------------------------ */

/* O corte do data-resp4 lido pelo dev no protótipo (relatório, tarefa 2.1). */
const CORTE_DOS_NUMEROS = 1024

test('os números: uma lista anunciada de 4 itens, logo depois do hero e no fundo dele, em 2 colunas até 1024 px e 4 acima', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const secao = numerosDe(page)
  await expect(secao, 'a <section> logo depois do hero').toHaveCount(1)
  const listas = secao.getByRole('list')
  const anunciadas = await listas.count()
  const itens = anunciadas === 1 ? await listas.getByRole('listitem').allInnerTexts() : []
  const medida = await secao.evaluate((elemento) => {
    const caixas = Array.from(elemento.querySelectorAll('li')).map((item) =>
      item.getBoundingClientRect()
    )
    const primeira = caixas[0]
    const hero = elemento.previousElementSibling
    return {
      colunas: primeira ? caixas.filter((c) => Math.abs(c.top - primeira.top) < 1).length : 0,
      linhas: new Set(caixas.map((c) => Math.round(c.top))).size,
      fundo: getComputedStyle(elemento).backgroundColor,
      fundoDoHero: hero ? getComputedStyle(hero).backgroundColor : '(sem hero)',
      heroAntes: Boolean(hero?.querySelector('h1')),
      nomeDaLista: elemento.querySelector('ul, ol')?.getAttribute('aria-label') ?? null,
    }
  })
  const largura = page.viewportSize()?.width ?? 0
  const colunasEsperadas = largura > CORTE_DOS_NUMEROS ? 4 : 2
  const esperados = DOC.numeros.map((numero, indice) => `${numero} ${REF.rotulos[indice] ?? ''}`)
  const falhas: string[] = []
  if (anunciadas !== 1) falhas.push(`${anunciadas} listas anunciadas no bloco, e não 1`)
  const recebidos = itens.map(normalizar)
  if (JSON.stringify(recebidos) !== JSON.stringify(esperados))
    falhas.push(
      `itens anunciados ${JSON.stringify(recebidos)}, e não ${JSON.stringify(esperados)}, nesta ordem`
    )
  if (!medida.heroAntes) falhas.push('o bloco dos números não vem logo depois do hero')
  if (medida.fundo !== medida.fundoDoHero)
    falhas.push(`fundo ${medida.fundo}, e não o do hero (${medida.fundoDoHero})`)
  if (medida.nomeDaLista !== null)
    falhas.push(`a lista tem nome acessível inventado: "${medida.nomeDaLista}"`)
  if (medida.colunas !== colunasEsperadas)
    falhas.push(`${largura} px: ${medida.colunas} colunas, e não ${colunasEsperadas}`)

  console.log(
    `[${informacoes.project.name}] números: lista anunciada ${anunciadas}, itens ${itens.length}` +
      ` (${recebidos.join(' · ')}) · colunas ${medida.colunas} em ${medida.linhas} linha(s), esperado ${colunasEsperadas}` +
      ` · fundo ${medida.fundo}, o do hero ${medida.fundoDoHero}`
  )
  expect(falhas, falhas.join('\n')).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 3. A faixa: o link do aviso e o botão                                     */
/* ------------------------------------------------------------------------ */

const linkDoAvisoDe = (page: Page) => faixaDe(page).locator('a[target="_blank"]')
const botaoDaFaixaDe = (page: Page) => faixaDe(page).locator('a:not([target="_blank"])')

test('a faixa: o link do aviso leva ao Instagram em nova aba, sem opener nem Referer, com nome acessível, e o botão segue a lista e leva a /processo-seletivo', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const falhas: string[] = []
  const link = linkDoAvisoDe(page)
  const quantos = await link.count()
  if (quantos !== 1) falhas.push(`${quantos} links em nova aba na faixa, e não 1`)
  const href = await link.first().getAttribute('href')
  const rel = (await link.first().getAttribute('rel'))?.split(/\s+/) ?? []
  const arvore = await link.first().ariaSnapshot()
  const nome = /- link "([^"]*)"/.exec(arvore)?.[1] ?? '(sem nome)'
  const textoVisivel = normalizar(await link.first().innerText())
  if (href !== REF.contato.destinoDoInstagram)
    falhas.push(`o link do aviso leva a ${href}, e não a ${REF.contato.destinoDoInstagram}`)
  for (const parte of ['noopener', 'noreferrer'])
    if (!rel.includes(parte))
      falhas.push(`o link do aviso tem rel "${rel.join(' ')}", sem ${parte}`)
  if (!nome.includes(textoVisivel))
    falhas.push(`o nome acessível "${nome}" não contém o texto visível "${textoVisivel}"`)
  if (!/instagram/i.test(nome)) falhas.push(`o nome acessível "${nome}" não diz o destino`)
  if (!/nova aba/i.test(nome))
    falhas.push(`o nome acessível "${nome}" não diz que abre em nova aba`)

  const botao = botaoDaFaixaDe(page)
  const botoes = await botao.count()
  let navegou = 'não clicado'
  if (!BOTAO_DA_FAIXA_NA_LISTA) {
    if (botoes !== 0)
      falhas.push(`${botoes} botões na faixa sem ${REF.faixa.destinoDoBotao} na lista`)
  } else if (botoes !== 1) {
    falhas.push(`${botoes} botões na faixa, e não 1`)
  } else {
    const destino = await botao.getAttribute('href')
    if (destino !== REF.faixa.destinoDoBotao)
      falhas.push(`o botão da faixa leva a ${destino}, e não a ${REF.faixa.destinoDoBotao}`)
    await botao.click()
    await expect(page).toHaveURL((url) => url.pathname === REF.faixa.destinoDoBotao)
    navegou = `${new URL(page.url()).pathname}, h1 "${normalizar(await page.getByRole('heading', { level: 1 }).innerText())}"`
  }

  console.log(
    `[${informacoes.project.name}] link do aviso: href ${href} · rel "${rel.join(' ')}" · nome "${nome}"` +
      ` · texto visível "${textoVisivel}"\n[${informacoes.project.name}] botão da faixa: ${botoes}` +
      ` (${REF.faixa.destinoDoBotao} ${BOTAO_DA_FAIXA_NA_LISTA ? 'na' : 'fora da'} lista) · clique: ${navegou}`
  )
  expect(falhas, falhas.join('\n')).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 4. A faixa e /processo-seletivo: fonte única                              */
/* ------------------------------------------------------------------------ */

test('a faixa e /processo-seletivo mostram o mesmo selo e o mesmo aviso', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const naFaixa = (await lerRaiz(page)).faixa
  await page.goto(REF.faixa.destinoDoBotao)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const naPagina = await page.getByRole('main').evaluate((main) => {
    const n = (texto: string | null | undefined) => (texto ?? '').replace(/\s+/g, ' ').trim()
    const h1 = main.querySelector('h1')
    const faixa = h1?.closest('section')
    return {
      selo: n(h1?.previousElementSibling?.textContent),
      aviso: n(faixa?.querySelector('a[target="_blank"]')?.closest('p')?.textContent),
    }
  })
  const pares = [
    { nome: 'selo', faixa: naFaixa.selo, pagina: naPagina.selo },
    { nome: 'aviso', faixa: naFaixa.aviso, pagina: naPagina.aviso },
  ]
  const iguais = pares.filter((par) => par.faixa !== '' && par.faixa === par.pagina)
  const divergencias = pares
    .filter((par) => !iguais.includes(par))
    .map(
      (par) =>
        `faixa e página divergem no ${par.nome}:\n    faixa da inicial (/): "${par.faixa}"\n    ${REF.faixa.destinoDoBotao}: "${par.pagina}"`
    )
  console.log(
    `[${informacoes.project.name}] faixa e página: ${iguais.length} trechos iguais de ${pares.length}` +
      ` (${pares.map((par) => `${par.nome} ${par.faixa.split(' ').length} palavras`).join(', ')})`
  )
  expect(divergencias, divergencias.join('\n')).toEqual([])
  expect(iguais).toHaveLength(2)
})

/* ------------------------------------------------------------------------ */
/* 5. O que não vai ao ar, e nenhuma seção vazia                             */
/* ------------------------------------------------------------------------ */

test('a raiz não traz o exemplo da faixa, o que saiu do contato nem os blocos fora da R1, e nenhuma seção fica sem texto', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const lido = await lerRaiz(page)
  const grupos = [
    {
      nome: 'exemplo da faixa',
      termos: [
        ...new Set([
          ...PROIBIDOS_DA_SPEC_NA_FAIXA,
          ...REF.faixa.exemplos,
          ...PROTOTIPO_DA_INICIAL.exemplosDaFaixa,
        ]),
      ],
    },
    {
      nome: 'o que saiu do contato',
      termos: [
        ...new Set([
          ...PROIBIDOS_DA_SPEC_NO_CONTATO,
          PROTOTIPO_DA_INICIAL.fraseDoContato,
          REF.contato.botaoQueNaoVai,
          ...PROTOTIPO_DA_INICIAL.botoesDoContato,
          REF.contato.quadroQueNaoVai,
          ...PROTOTIPO_DA_INICIAL.exemplosDosCanais,
        ]),
      ],
    },
    {
      nome: 'fora da R1',
      termos: [
        ...new Set([...PROTOTIPO_DA_INICIAL.termosForaDaR1, DOC.semEvento, DOC.apoioDaAgenda]),
      ],
    },
  ]
  const textoDoConteudo = lido.secoes.map((secao) => secao.texto).join(' ')
  const achados: string[] = []
  for (const grupo of grupos)
    for (const termo of grupo.termos.filter((t) => acha(t, textoDoConteudo))) {
      const onde = lido.secoes
        .filter((secao) => acha(termo, secao.texto))
        .map((secao) => `seção ${secao.indice + 1} (${secao.bloco}, "${secao.titulo}")`)
      achados.push(`${grupo.nome}: "${termo}" em ${onde.join(', ') || 'texto entre seções'}`)
    }
  /* Datas na faixa, no formato dd/mm; travessão no contato. */
  const datas = lido.faixa.texto.match(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/g) ?? []
  for (const data of datas) achados.push(`data "${data}" na faixa`)
  if (lido.contato.texto.includes('—')) achados.push('travessão no bloco de contato')
  /* Nenhuma seção com só o título: sem texto além dele. */
  for (const secao of lido.secoes.filter((s) => !/[\p{L}\p{N}]/u.test(s.textoSemTitulos)))
    achados.push(`seção ${secao.indice + 1} ("${secao.titulo}") sem texto além do título`)

  const procurados = grupos.reduce((n, grupo) => n + grupo.termos.length, 0)
  console.log(
    `[${informacoes.project.name}] termos proibidos procurados: ${procurados}` +
      ` (${grupos.map((g) => `${g.nome} ${g.termos.length}`).join(', ')}, mais datas dd/mm na faixa e travessão no contato)` +
      ` · blocos fora da R1 lidos do protótipo: ${PROTOTIPO_DA_INICIAL.blocosForaDaR1.map((b) => `"${b.titulo}"`).join(', ')}` +
      ` · seções lidas: ${lido.secoes.length} · caracteres lidos: ${textoDoConteudo.length} · achados: ${achados.length}`
  )
  expect(textoDoConteudo.length, 'o teste precisa ter lido texto').toBeGreaterThan(0)
  expect(achados, `a raiz mostra:\n${achados.join('\n')}`).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 6. Contraste da faixa (RP-09)                                             */
/* ------------------------------------------------------------------------ */

/* A cor que o navegador desenha, camada sobre camada, num pixel de canvas. */
async function compor(page: Page, camadas: string[]): Promise<Rgb> {
  const cor = await page.evaluate((lista) => {
    const tela = document.createElement('canvas').getContext('2d')
    if (!tela) return 'sem canvas'
    for (const camada of lista) {
      tela.fillStyle = '#010203'
      tela.fillStyle = camada
      if (tela.fillStyle === '#010203') return `cor não lida pelo canvas: ${camada}`
      tela.fillRect(0, 0, 1, 1)
    }
    return Array.from(tela.getImageData(0, 0, 1, 1).data).slice(0, 3)
  }, camadas)
  if (typeof cor === 'string') throw new Error(cor)
  return [cor[0] ?? 0, cor[1] ?? 0, cor[2] ?? 0]
}

type CoresDoElemento = { cor: string; fundo: string; anel: string; anelLargura: string }

const coresDe = (alvo: Locator): Promise<CoresDoElemento> =>
  alvo.evaluate((elemento) => {
    const estilo = getComputedStyle(elemento)
    return {
      cor: estilo.color,
      fundo: estilo.backgroundColor,
      anel: `${estilo.outlineStyle} ${estilo.outlineColor}`,
      anelLargura: estilo.outlineWidth,
    }
  })

/* O cartão (o ancestral opaco do título), o círculo e por onde ele passa. */
async function superficiesDaFaixa(page: Page) {
  const lido = await faixaDe(page).evaluate((secao) => {
    const h2 = secao.querySelector('h2')
    let cartao = h2?.parentElement ?? null
    while (cartao && cartao !== secao && !/^rgb\(/.test(getComputedStyle(cartao).backgroundColor))
      cartao = cartao.parentElement
    const circulo = cartao?.querySelector(':scope > [aria-hidden="true"]') ?? null
    const disco = circulo?.getBoundingClientRect()
    const limite = cartao?.getBoundingClientRect()
    const toca = (caixas: DOMRect[]) =>
      Boolean(disco && limite) &&
      caixas.some((caixa) => {
        if (!disco || !limite) return false
        const raio = disco.width / 2
        const cx = disco.left + raio
        const cy = disco.top + raio
        const x = Math.max(caixa.left, Math.min(cx, caixa.right))
        const y = Math.max(caixa.top, Math.min(cy, caixa.bottom))
        const dentroDoCartao =
          x >= limite.left && x <= limite.right && y >= limite.top && y <= limite.bottom
        return dentroDoCartao && Math.hypot(x - cx, y - cy) < raio
      })
    const linhasDe = (elemento: Element | null | undefined) => {
      if (!elemento) return []
      const faixa = document.createRange()
      faixa.selectNodeContents(elemento)
      return Array.from(faixa.getClientRects())
    }
    const link = secao.querySelector('a[target="_blank"]')
    const botao = Array.from(secao.querySelectorAll('a')).find((a) => a !== link)
    const partes = {
      selo: linhasDe(h2?.previousElementSibling),
      título: linhasDe(h2),
      aviso: linhasDe(link?.closest('p')),
      link: link ? [link.getBoundingClientRect()] : [],
      botão: botao ? [botao.getBoundingClientRect()] : [],
    }
    return {
      cartao: cartao ? getComputedStyle(cartao).backgroundColor : '',
      circulo: circulo ? getComputedStyle(circulo).backgroundColor : '',
      sobreOCirculo: Object.entries(partes)
        .filter(([, caixas]) => toca(caixas))
        .map(([nome]) => nome),
    }
  })
  if (!lido.cartao || !lido.circulo) throw new Error('faixa sem o cartão opaco ou sem o círculo')
  return {
    ...lido,
    cartaoRgb: await compor(page, [lido.cartao]),
    circuloRgb: await compor(page, [lido.cartao, lido.circulo]),
  }
}

/* Pressiona sem soltar em cima: solta longe, para não seguir o link. */
async function pressionado<T>(page: Page, alvo: Locator, ler: () => Promise<T>): Promise<T> {
  await alvo.hover()
  await page.mouse.down()
  try {
    return await ler()
  } finally {
    await page.mouse.move(0, 0)
    await page.mouse.up()
  }
}

/* Tab, do começo da página, até `alvo` ter o foco. null se o Tab não chega. */
async function tabAte(page: Page, alvo: Locator, limite = 80): Promise<number | null> {
  await page.mouse.move(0, 0)
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  for (let tecla = 1; tecla <= limite; tecla += 1) {
    await page.keyboard.press('Tab')
    if (await alvo.evaluate((elemento) => elemento === document.activeElement)) return tecla
  }
  return null
}

test('a faixa é legível: cada par do D4, sobre o cartão e sobre o círculo, em repouso, hover, pressionado e foco, com as cores nomeadas', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  await page.mouse.move(0, 0)
  const faixa = faixaDe(page)
  await faixa.scrollIntoViewIfNeeded()
  const superficie = await superficiesDaFaixa(page)
  const cartao = `o cartão ${nomeDaCor(superficie.cartaoRgb)}`
  const circulo = `o círculo ${hex(superficie.circuloRgb)}`
  const linhas: string[] = []
  const falhas: string[] = []
  let medidas = 0
  const medir = (nome: string, frente: Rgb, fundo: Rgb, ondeFundo: string, minimo: number) => {
    const valor = contrasteEntre(frente, fundo)
    medidas += 1
    linhas.push(
      `${nome}: ${nomeDaCor(frente)} sobre ${ondeFundo}: ${razao(valor)}${minimo > 0 ? ` (mín. ${minimo})` : ' (informativo)'}`
    )
    if (minimo > 0 && valor < minimo)
      falhas.push(
        `${nome}: ${nomeDaCor(frente)} sobre ${ondeFundo} mede ${razao(valor)}, abaixo de ${minimo}:1`
      )
  }
  const lilas = rgbDoHex(REF.faixa.hexDoLilas)
  if (hex(superficie.cartaoRgb) === hex(lilas))
    falhas.push(`o cartão está no lilás da marca ${REF.faixa.hexDoLilas}: texto pequeno sobre ele`)
  if (hex(superficie.cartaoRgb) !== REF.faixa.hexDoCartao)
    falhas.push(
      `o cartão é ${hex(superficie.cartaoRgb)}, e não o ${REF.faixa.tokenDoCartao} ${REF.faixa.hexDoCartao} da §7`
    )

  /* Os textos em repouso. */
  for (const [nome, alvo] of [
    ['título', faixa.getByRole('heading', { level: 2 })],
    ['aviso', linkDoAvisoDe(page).locator('xpath=ancestor::p[1]')],
  ] as const) {
    const cores = await coresDe(alvo)
    const frente = await compor(page, [cores.cor])
    medir(`${nome}, texto`, frente, superficie.cartaoRgb, cartao, 4.5)
    medir(`${nome}, texto`, frente, superficie.circuloRgb, circulo, 4.5)
  }

  /* O selo: o texto sobre o fundo dele; o fundo contra o cartão, informativo. */
  const selo = await coresDe(faixa.locator('h2').locator('xpath=preceding-sibling::*[1]'))
  const fundoDoSelo = await compor(page, [superficie.cartao, selo.fundo])
  medir(
    'selo, texto',
    await compor(page, [selo.cor]),
    fundoDoSelo,
    `o fundo do selo ${nomeDaCor(fundoDoSelo)}`,
    4.5
  )
  medir('selo, fundo', fundoDoSelo, superficie.cartaoRgb, cartao, 0)

  /* O link do aviso nos três estados: o fundo do estado composto sobre o cartão e sobre o círculo. */
  const link = linkDoAvisoDe(page)
  const estadosDoLink: { estado: string; cores: CoresDoElemento }[] = [
    { estado: 'repouso', cores: await coresDe(link) },
  ]
  await link.hover()
  estadosDoLink.push({ estado: 'hover', cores: await coresDe(link) })
  estadosDoLink.push({
    estado: 'pressionado',
    cores: await pressionado(page, link, () => coresDe(link)),
  })
  for (const { estado, cores } of estadosDoLink) {
    const frente = await compor(page, [cores.cor])
    const sobreCartao = await compor(page, [superficie.cartao, cores.fundo])
    const sobreCirculo = await compor(page, [superficie.cartao, superficie.circulo, cores.fundo])
    medir(
      `link, ${estado}`,
      frente,
      sobreCartao,
      `${cartao} com o fundo do estado, ${hex(sobreCartao)}`,
      4.5
    )
    medir(
      `link, ${estado}`,
      frente,
      sobreCirculo,
      `o círculo com o fundo do estado, ${hex(sobreCirculo)}`,
      4.5
    )
  }
  const fundosDoLink = estadosDoLink.map((e) => e.cores.fundo)
  if (new Set(fundosDoLink).size !== 3)
    falhas.push(`o link não muda de fundo em cada estado: ${fundosDoLink.join(' · ')}`)

  /* O botão nos quatro estados: o texto sobre o fundo dele, o fundo contra o cartão e o círculo. */
  const botao = botaoDaFaixaDe(page)
  if ((await botao.count()) === 1) {
    await page.mouse.move(0, 0)
    const estadosDoBotao: { estado: string; cores: CoresDoElemento }[] = [
      { estado: 'repouso', cores: await coresDe(botao) },
    ]
    await botao.hover()
    estadosDoBotao.push({ estado: 'hover', cores: await coresDe(botao) })
    estadosDoBotao.push({
      estado: 'pressionado',
      cores: await pressionado(page, botao, () => coresDe(botao)),
    })
    const teclas = await tabAte(page, botao)
    if (teclas === null) falhas.push('o Tab não chega ao botão da faixa')
    else estadosDoBotao.push({ estado: 'foco', cores: await coresDe(botao) })
    for (const { estado, cores } of estadosDoBotao) {
      const fundo = await compor(page, [superficie.cartao, cores.fundo])
      medir(
        `botão, ${estado}, texto`,
        await compor(page, [cores.cor]),
        fundo,
        `o fundo do botão ${nomeDaCor(fundo)}`,
        4.5
      )
      medir(`botão, ${estado}, fundo`, fundo, superficie.cartaoRgb, cartao, 3)
      medir(`botão, ${estado}, fundo`, fundo, superficie.circuloRgb, circulo, 3)
    }
    const repouso = await compor(page, [superficie.cartao, estadosDoBotao[0]?.cores.fundo ?? ''])
    if (hex(repouso) === hex(superficie.cartaoRgb))
      falhas.push(`o fundo do botão em repouso é a cor do cartão, ${hex(repouso)}`)
    const fundosDoBotao = estadosDoBotao.slice(0, 3).map((e) => e.cores.fundo)
    if (new Set(fundosDoBotao).size !== 3)
      falhas.push(
        `o botão não muda de fundo no hover e no pressionado: ${fundosDoBotao.join(' · ')}`
      )
  } else if (BOTAO_DA_FAIXA_NA_LISTA) {
    falhas.push('o botão da faixa não foi achado')
  }

  /* O anel de foco do link e do botão contra o cartão e o círculo (o e2e do anel, abaixo, confere a cor). */
  for (const [nome, alvo] of [
    ['link', link],
    ['botão', botao],
  ] as const) {
    if ((await alvo.count()) !== 1) continue
    const teclas = await tabAte(page, alvo)
    if (teclas === null) {
      falhas.push(`o Tab não chega ao ${nome} da faixa`)
      continue
    }
    const cores = await coresDe(alvo)
    const anel = await compor(page, [cores.anel.replace(/^\S+\s/, '')])
    medir(`anel do ${nome}`, anel, superficie.cartaoRgb, cartao, 3)
    medir(`anel do ${nome}`, anel, superficie.circuloRgb, circulo, 3)
  }

  console.log(
    `[${informacoes.project.name}] contraste da faixa: ${medidas} medidas · abaixo do mínimo: ${falhas.length}` +
      ` · o círculo ${hex(superficie.circuloRgb)} é ${superficie.circulo} sobre o cartão ${hex(superficie.cartaoRgb)}` +
      ` e passa por baixo de: ${superficie.sobreOCirculo.join(', ') || 'nada'}\n  ` +
      linhas.join('\n  ')
  )
  expect(medidas, 'o teste precisa ter medido').toBeGreaterThan(20)
  expect(falhas, `pares da faixa reprovados:\n${falhas.join('\n')}`).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 7. O anel de foco da faixa (Q9 (a), acréscimo do Gabriel)                 */
/* ------------------------------------------------------------------------ */

/*
 * O anel no pixel: três capturas da caixa do elemento com folga, o anel creme,
 * o anel trocado por verde puro só para a medida, e sem foco. O anel são os
 * pixels que mudam entre as duas primeiras; os que ficam sobre algo a menos
 * de 3:1 do creme (o texto creme das linhas de cima e de baixo, no link) são
 * contados à parte. É registro, não asserção: o achado é do dev-frontend, e a
 * decisão sobre ele não é deste teste.
 */
async function anelNoPixel(page: Page, alvo: Locator, corDoAnel: Rgb) {
  await alvo.evaluate((elemento) => elemento.scrollIntoView({ block: 'center' }))
  const caixa = await alvo.boundingBox()
  const vista = page.viewportSize()
  if (!caixa || !vista) return null
  const folga = 8
  const x = Math.max(0, Math.floor(caixa.x - folga))
  const y = Math.max(0, Math.floor(caixa.y - folga))
  const clip = {
    x,
    y,
    width: Math.min(vista.width - x, Math.ceil(caixa.width + 2 * folga)),
    height: Math.min(vista.height - y, Math.ceil(caixa.height + 2 * folga)),
  }
  const comAnel = await page.screenshot({ clip })
  await alvo.evaluate((elemento) =>
    (elemento as HTMLElement).style.setProperty('outline-color', 'rgb(0, 255, 0)', 'important')
  )
  const anelVerde = await page.screenshot({ clip })
  await alvo.evaluate((elemento) => (elemento as HTMLElement).style.removeProperty('outline-color'))
  await alvo.evaluate((elemento) => (elemento as HTMLElement).blur())
  const semAnel = await page.screenshot({ clip })
  const leitor = await page.context().newPage()
  try {
    return await leitor.evaluate(
      async ({ imagens, anel }) => {
        const pixels = async (base64: string) => {
          const imagem = new Image()
          imagem.src = `data:image/png;base64,${base64}`
          await imagem.decode()
          const tela = document.createElement('canvas')
          tela.width = imagem.width
          tela.height = imagem.height
          const contexto = tela.getContext('2d')
          contexto?.drawImage(imagem, 0, 0)
          return (
            contexto?.getImageData(0, 0, imagem.width, imagem.height).data ??
            new Uint8ClampedArray()
          )
        }
        const [a, b, c] = await Promise.all(imagens.map(pixels))
        const canal = (valor: number) => {
          const v = valor / 255
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
        }
        const lum = (r: number, g: number, bl: number) =>
          0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(bl)
        const lumDoAnel = lum(anel[0] ?? 0, anel[1] ?? 0, anel[2] ?? 0)
        let doAnel = 0
        let sobreClaro = 0
        let quaseIgual = 0
        if (!a || !b || !c) return { doAnel, sobreClaro, quaseIgual }
        for (let i = 0; i < a.length; i += 4) {
          const muda = Math.max(
            Math.abs((a[i] ?? 0) - (b[i] ?? 0)),
            Math.abs((a[i + 1] ?? 0) - (b[i + 1] ?? 0)),
            Math.abs((a[i + 2] ?? 0) - (b[i + 2] ?? 0))
          )
          if (muda <= 24) continue
          doAnel += 1
          const embaixo = lum(c[i] ?? 0, c[i + 1] ?? 0, c[i + 2] ?? 0)
          const [clara, escura] = [lumDoAnel, embaixo].sort((p, q) => q - p)
          const razaoDoPixel = ((clara ?? 0) + 0.05) / ((escura ?? 0) + 0.05)
          if (razaoDoPixel < 3) sobreClaro += 1
          if (razaoDoPixel < 1.5) quaseIgual += 1
        }
        return { doAnel, sobreClaro, quaseIgual }
      },
      {
        imagens: [comAnel, anelVerde, semAnel].map((imagem) => imagem.toString('base64')),
        anel: [...corDoAnel],
      }
    )
  } finally {
    await leitor.close()
  }
}

test('o anel de foco da faixa: o Tab chega ao link do aviso e ao botão, e cada um mostra o anel em --color-bg #f5ead8, e não o anel do site', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const faixa = faixaDe(page)
  await faixa.scrollIntoViewIfNeeded()
  const superficie = await superficiesDaFaixa(page)
  const tokenDoAnel = await page.evaluate(
    (nome) => getComputedStyle(document.documentElement).getPropertyValue(nome).trim(),
    REF.faixa.tokenDoAnel
  )
  const esperado = await compor(page, [tokenDoAnel])
  const falhas: string[] = []
  const linhas: string[] = []
  if (hex(esperado) !== REF.faixa.hexDoTexto)
    falhas.push(
      `${REF.faixa.tokenDoAnel} vale ${hex(esperado)}, e não ${REF.faixa.hexDoTexto} da §7`
    )

  /* O anel do site: o do primeiro botão do hero, focado por Tab. */
  const doHero = heroDe(page).getByRole('link').first()
  const teclasDoHero = await tabAte(page, doHero)
  const anelDoSite =
    teclasDoHero === null
      ? null
      : await compor(page, [(await coresDe(doHero)).anel.replace(/^\S+\s/, '')])
  if (!anelDoSite) falhas.push('o Tab não chega ao primeiro botão do hero, para ler o anel do site')

  let conferidos = 0
  for (const [nome, alvo] of [
    ['link do aviso', linkDoAvisoDe(page)],
    ['botão', botaoDaFaixaDe(page)],
  ] as const) {
    if ((await alvo.count()) !== 1) {
      falhas.push(`${nome} da faixa: ${await alvo.count()} elementos, e não 1`)
      continue
    }
    /* Da página recém-aberta: o blur() não volta o ponto de partida do Tab ao começo. */
    await abrirRaiz(page)
    const teclas = await tabAte(page, alvo)
    if (teclas === null) {
      falhas.push(`${nome} da faixa: o Tab não chega`)
      continue
    }
    const anel = await alvo.evaluate((elemento) => {
      const estilo = getComputedStyle(elemento)
      return {
        focoVisivel: elemento.matches(':focus-visible'),
        estilo: estilo.outlineStyle,
        largura: parseFloat(estilo.outlineWidth),
        deslocamento: estilo.outlineOffset,
        cor: estilo.outlineColor,
      }
    })
    const cor = await compor(page, [anel.cor])
    const antes = falhas.length
    if (!anel.focoVisivel) falhas.push(`${nome}: focado por Tab sem :focus-visible`)
    if (anel.estilo === 'none' || !(anel.largura > 0))
      falhas.push(`${nome}: sem anel (estilo ${anel.estilo}, largura ${anel.largura} px)`)
    if (hex(cor) !== hex(esperado))
      falhas.push(
        `${nome}: anel ${nomeDaCor(cor)}, e não ${REF.faixa.tokenDoAnel} ${hex(esperado)}; contra o cartão ${hex(superficie.cartaoRgb)}: ${razao(contrasteEntre(cor, superficie.cartaoRgb))}`
      )
    if (anelDoSite && hex(cor) === hex(anelDoSite))
      falhas.push(`${nome}: o anel é o do site, ${nomeDaCor(anelDoSite)}`)
    const pixel = await anelNoPixel(page, alvo, cor)
    if (falhas.length === antes) conferidos += 1
    linhas.push(
      `${nome}: foco na tecla ${teclas} desde o começo da página · anel ${anel.estilo} ${anel.largura} px, deslocamento ${anel.deslocamento}` +
        ` · cor ${nomeDaCor(cor, REF.faixa.tokenDoAnel)} (esperada ${REF.faixa.tokenDoAnel} ${hex(esperado)})` +
        ` · contra o cartão ${nomeDaCor(superficie.cartaoRgb)}: ${razao(contrasteEntre(cor, superficie.cartaoRgb))}` +
        ` · contra o círculo ${hex(superficie.circuloRgb)}: ${razao(contrasteEntre(cor, superficie.circuloRgb))}` +
        `\n    no pixel: ${pixel ? `${pixel.doAnel} pixels de anel; sobre cor a menos de 3:1 do anel (creme sobre creme): ${pixel.sobreClaro}; a menos de 1,5:1: ${pixel.quaseIgual}` : 'não medido (sem caixa)'}`
    )
  }

  console.log(
    `[${informacoes.project.name}] anel de foco da faixa: ${conferidos} de 2 conferidos` +
      ` · anel do site ${anelDoSite ? nomeDaCor(anelDoSite) : '(não lido)'}, contra o cartão ${anelDoSite ? razao(contrasteEntre(anelDoSite, superficie.cartaoRgb)) : '-'}\n  ` +
      linhas.join('\n  ')
  )
  expect(falhas, `anel de foco da faixa:\n${falhas.join('\n')}`).toEqual([])
  expect(conferidos).toBe(2)
})

/* ------------------------------------------------------------------------ */
/* 8. O contato: a lista, os cartões inteiros como links, as imagens         */
/* ------------------------------------------------------------------------ */

test('o contato: lista anunciada de 2, cada cartão é um link inteiro, com destino, nova aba, nome acessível, 44 px e foco, e as imagens são decorativas', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const contato = contatoDe(page)
  await expect(contato, 'o bloco de contato').toHaveCount(1)
  const falhas: string[] = []
  const linhas: string[] = []
  const listas = contato.getByRole('list')
  const anunciadas = await listas.count()
  const itens = anunciadas === 1 ? await listas.getByRole('listitem').count() : 0
  if (anunciadas !== 1 || itens !== REF.contato.quadros.length)
    falhas.push(
      `${anunciadas} listas anunciadas com ${itens} itens, e não 1 com ${REF.contato.quadros.length}`
    )

  const esperados = [
    {
      rotulo: REF.contato.quadros[0] ?? '',
      valor: DOC.instagram,
      href: REF.contato.destinoDoInstagram,
      novaAba: true,
    },
    {
      rotulo: REF.contato.quadros[1] ?? '',
      valor: DOC.email,
      href: `mailto:${DOC.email}`,
      novaAba: false,
    },
  ]
  let cantosNoLink = 0
  let cantosMedidos = 0
  for (const [indice, esperado] of esperados.entries()) {
    const item = contato.locator('li').nth(indice)
    const onde = `cartão "${esperado.rotulo}"`
    const link = item.locator('a')
    if ((await link.count()) !== 1) {
      falhas.push(`${onde}: ${await link.count()} links, e não 1`)
      continue
    }
    if ((await link.getAttribute('href')) !== esperado.href)
      falhas.push(`${onde}: leva a ${await link.getAttribute('href')}, e não a ${esperado.href}`)
    const alvo = await link.getAttribute('target')
    const rel = (await link.getAttribute('rel'))?.split(/\s+/) ?? []
    if (esperado.novaAba) {
      if (alvo !== '_blank') falhas.push(`${onde}: target ${alvo}, e não _blank`)
      for (const parte of ['noopener', 'noreferrer'])
        if (!rel.includes(parte)) falhas.push(`${onde}: rel "${rel.join(' ')}", sem ${parte}`)
    } else if (alvo === '_blank') falhas.push(`${onde}: abre em nova aba, e não devia`)
    const nome = /- link "([^"]*)"/.exec(await link.ariaSnapshot())?.[1] ?? '(sem nome)'
    const comeco = `${esperado.rotulo} ${esperado.valor}`
    if (!nome.toLowerCase().startsWith(comeco.toLowerCase()))
      falhas.push(`${onde}: o nome acessível "${nome}" não começa por "${comeco}"`)
    if (esperado.novaAba && !/nova aba/i.test(nome))
      falhas.push(`${onde}: o nome acessível "${nome}" não diz que abre em nova aba`)

    /* Um ponto a 2 px de cada canto do item e do primeiro filho dele pertence ao link. */
    const cantos = await item.evaluate((li, href) => {
      li.scrollIntoView({ block: 'center' })
      const caixas = [
        { nome: 'item', caixa: li.getBoundingClientRect() },
        { nome: 'cartão', caixa: li.firstElementChild?.getBoundingClientRect() },
      ]
      return caixas.flatMap(({ nome, caixa }) =>
        caixa
          ? [
              [caixa.left + 2, caixa.top + 2, 'superior esquerdo'],
              [caixa.right - 2, caixa.top + 2, 'superior direito'],
              [caixa.left + 2, caixa.bottom - 2, 'inferior esquerdo'],
              [caixa.right - 2, caixa.bottom - 2, 'inferior direito'],
            ].map(([x, y, canto]) => {
              const atingido = document.elementFromPoint(Number(x), Number(y))
              return {
                onde: `${nome}, canto ${canto} (${Math.round(Number(x))}, ${Math.round(Number(y))})`,
                noLink: atingido?.closest('a')?.getAttribute('href') === href,
                atingido: atingido ? `<${atingido.tagName.toLowerCase()}>` : '(nada)',
              }
            })
          : []
      )
    }, esperado.href)
    cantosMedidos += cantos.length
    for (const canto of cantos) {
      if (canto.noLink) cantosNoLink += 1
      else falhas.push(`${onde}: o ponto do ${canto.onde} fica fora do link, em ${canto.atingido}`)
    }
    const caixa = await link.boundingBox()
    if (!caixa || caixa.width < ALVO_MINIMO || caixa.height < ALVO_MINIMO)
      falhas.push(
        `${onde}: o link mede ${caixa?.width} × ${caixa?.height} px, abaixo de ${ALVO_MINIMO}`
      )

    /* O foco por Tab contorna o cartão: o anel é do próprio link, que é o cartão. */
    const teclas = await tabAte(page, link)
    const anel =
      teclas === null
        ? 'não alcançado por Tab'
        : await link.evaluate((elemento) => {
            const estilo = getComputedStyle(elemento)
            return elemento.matches(':focus-visible') &&
              estilo.outlineStyle !== 'none' &&
              parseFloat(estilo.outlineWidth) > 0
              ? `${estilo.outlineWidth} ${estilo.outlineStyle} ${estilo.outlineColor}`
              : 'sem anel'
          })
    if (teclas === null || anel === 'sem anel') falhas.push(`${onde}: foco por Tab ${anel}`)
    linhas.push(
      `${onde}: href ${esperado.href} · target ${alvo} · nome "${nome}" · ${Math.round((caixa?.width ?? 0) * 10) / 10} × ${Math.round((caixa?.height ?? 0) * 10) / 10} px · cantos no link ${cantos.filter((c) => c.noLink).length} de ${cantos.length} · foco: ${anel}`
    )
  }

  /* As imagens: fora do leitor de tela, pelo alt vazio ou pelo aria-hidden. */
  const imagens = await contato.evaluate((secao) =>
    Array.from(secao.querySelectorAll('img, svg, picture, [role="img"]')).map((imagem) => ({
      tag: imagem.tagName.toLowerCase(),
      decorativa:
        Boolean(imagem.closest('[aria-hidden="true"]')) ||
        (imagem.tagName === 'IMG' && imagem.getAttribute('alt') === ''),
    }))
  )
  const naArvore = ((await contato.ariaSnapshot()).match(/^\s*- img\b/gm) ?? []).length
  for (const imagem of imagens.filter((i) => !i.decorativa))
    falhas.push(`<${imagem.tag}> do contato anunciada ao leitor de tela`)
  if (naArvore !== 0) falhas.push(`${naArvore} imagens do contato na árvore de acessibilidade`)
  if (imagens.length !== REF.contato.quadros.length)
    falhas.push(
      `${imagens.length} imagens no contato, e não ${REF.contato.quadros.length} (a logo e o Gmail)`
    )

  console.log(
    `[${informacoes.project.name}] contato: lista anunciada ${anunciadas} com ${itens} itens` +
      ` · alvos medidos: ${esperados.length} · cantos no link: ${cantosNoLink} de ${cantosMedidos}` +
      ` · imagens ${imagens.length}, decorativas ${imagens.filter((i) => i.decorativa).length}, na árvore ${naArvore}\n  ` +
      linhas.join('\n  ')
  )
  expect(falhas, `contato com defeito:\n${falhas.join('\n')}`).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 9. A ordem dos blocos, os títulos e a ordem de foco, nas 7 larguras       */
/* ------------------------------------------------------------------------ */

test('a ordem dos blocos, um h1 e dois h2 sem salto, e a ordem de foco no conteúdo igual à de leitura nas 7 larguras', async ({
  page,
}, informacoes) => {
  const falhas: string[] = []
  const linhas: string[] = []
  const ordens = new Set<string>()
  const ordemDosBlocos = ['hero', 'números', 'faixa', 'contato']
  const titulosEsperados = [
    `h1 ${TEXTO.titulo}`,
    `h2 ${REF.faixa.titulo}`,
    `h2 ${REF.contato.titulo}`,
  ]
  for (const largura of LARGURAS) {
    await page.setViewportSize({ width: largura, height: 900 })
    await abrirRaiz(page)
    const lido = await lerRaiz(page)
    const blocos = lido.secoes.map((secao) => secao.bloco)
    if (JSON.stringify(blocos) !== JSON.stringify(ordemDosBlocos))
      falhas.push(
        `${largura} px: blocos ${blocos.join(' → ')}, e não ${ordemDosBlocos.join(' → ')}`
      )
    const estrutura = await page.getByRole('main').evaluate((main) => {
      const n = (texto: string | null | undefined) => (texto ?? '').replace(/\s+/g, ' ').trim()
      const rotulo = (elemento: Element) =>
        n(elemento.getAttribute('aria-label') ?? (elemento as HTMLElement).innerText).slice(0, 40)
      return {
        titulos: Array.from(main.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
          (titulo) => `${titulo.tagName.toLowerCase()} ${n(titulo.textContent)}`
        ),
        focaveis: Array.from(
          main.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]')
        )
          .filter((elemento) => elemento.tabIndex >= 0 && !elemento.closest('[aria-hidden="true"]'))
          .map(rotulo),
      }
    })
    if (JSON.stringify(estrutura.titulos) !== JSON.stringify(titulosEsperados))
      falhas.push(
        `${largura} px: títulos ${JSON.stringify(estrutura.titulos)}, e não ${JSON.stringify(titulosEsperados)}`
      )
    const niveis = estrutura.titulos.map((titulo) => Number(titulo[1]))
    for (const [i, nivel] of niveis.entries())
      if (i > 0 && nivel > (niveis[i - 1] ?? 0) + 1)
        falhas.push(`${largura} px: salto de título, de h${niveis[i - 1]} para h${nivel}`)

    /* Tab do começo da página até o rodapé, anotando os focos no conteúdo. */
    await page.mouse.move(0, 0)
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
    const porTab: string[] = []
    for (let tecla = 0; tecla < 80; tecla += 1) {
      await page.keyboard.press('Tab')
      const foco = await page.evaluate(() => {
        const alvo = document.activeElement as HTMLElement | null
        if (!alvo || alvo === document.body) return { regiao: 'nenhum', rotulo: '' }
        const rotulo = (alvo.getAttribute('aria-label') ?? alvo.innerText)
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 40)
        return {
          regiao: alvo.closest('main') ? 'conteúdo' : alvo.closest('footer') ? 'rodapé' : 'outro',
          rotulo,
        }
      })
      if (foco.regiao === 'rodapé') break
      if (foco.regiao === 'conteúdo') porTab.push(foco.rotulo)
    }
    const ordem = porTab.join(' → ')
    ordens.add(ordem)
    if (ordem !== estrutura.focaveis.join(' → '))
      falhas.push(
        `${largura} px: foco por Tab "${ordem}", e não a ordem de leitura "${estrutura.focaveis.join(' → ')}"`
      )
    linhas.push(
      `${largura} px: blocos ${blocos.join(' → ')} · títulos ${estrutura.titulos.length} · focos no conteúdo ${porTab.length}: ${ordem}`
    )
  }
  if (ordens.size !== 1)
    falhas.push(`a ordem de foco muda entre as larguras: ${[...ordens].join(' | ')}`)
  console.log(
    `[${informacoes.project.name}] ordem e títulos: ${LARGURAS.length} larguras medidas` +
      ` · ordens de foco diferentes entre elas: ${ordens.size}\n  ` +
      linhas.join('\n  ')
  )
  expect(falhas, falhas.join('\n')).toEqual([])
})

/* ------------------------------------------------------------------------ */
/* 10. Os dois modos do interruptor                                          */
/* ------------------------------------------------------------------------ */

test('com o site não publicado, a raiz é a página em construção, sem nenhum bloco novo', async ({
  page,
}, informacoes) => {
  await page.goto(`${ORIGEM_NAO_PUBLICADO}/`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITULO_EM_CONSTRUCAO)
  const texto = normalizar(await page.locator('body').innerText())
  const procurados = [
    ...DOC.numeros.map((numero, indice) => `${numero} ${REF.rotulos[indice] ?? ''}`),
    ...REF.rotulos,
    REF.faixa.selo,
    DOC.aviso,
    REF.contato.titulo,
  ]
  const achados = procurados.filter((termo) => acha(termo, texto))
  const titulos = await page
    .getByRole('heading', { level: 2 })
    .filter({
      hasText: new RegExp(`^(${escapar(REF.faixa.titulo)}|${escapar(REF.contato.titulo)})$`),
    })
    .count()
  console.log(
    `[${informacoes.project.name}] não publicado: h1 "${TITULO_EM_CONSTRUCAO}" · termos dos blocos novos procurados: ${procurados.length}` +
      ` · achados: ${achados.length} · h2 da faixa ou do contato: ${titulos}`
  )
  expect(achados, `a página em construção mostra: ${achados.join(', ')}`).toEqual([])
  expect(titulos).toBe(0)
})

/* ------------------------------------------------------------------------ */
/* 11. axe, rolagem, alvos e campos                                          */
/* ------------------------------------------------------------------------ */

test('o axe não acusa violação, não há rolagem horizontal, os alvos dos blocos novos medem 44 px e não há campo de formulário', async ({
  page,
}, informacoes) => {
  await abrirRaiz(page)
  const resultado = await new AxeBuilder({ page }).withTags(TAGS_DO_AXE).analyze()
  const violacoes = resultado.violations.map(
    (violacao) => `${violacao.id} (${violacao.nodes.length} elementos): ${violacao.help}`
  )
  const rolagem = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  const alvos = await page
    .getByRole('main')
    .locator('section')
    .filter({ hasNot: page.getByRole('heading', { level: 1 }) })
    .locator('a[href], button')
    .evaluateAll((elementos) =>
      elementos.map((elemento) => {
        const caixa = elemento.getBoundingClientRect()
        return {
          rotulo: (elemento.getAttribute('aria-label') ?? (elemento as HTMLElement).innerText)
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 30),
          largura: Math.round(caixa.width * 10) / 10,
          altura: Math.round(caixa.height * 10) / 10,
        }
      })
    )
  const pequenos = alvos.filter((alvo) => alvo.largura < ALVO_MINIMO || alvo.altura < ALVO_MINIMO)
  const campos = await page.locator('main input, main select, main textarea').count()
  const projeto = informacoes.project.name
  console.log(
    `[${projeto}] / Violacoes de acessibilidade: ${violacoes.length}` +
      ` · regras aplicadas: ${resultado.passes.length + resultado.violations.length}\n` +
      `[${projeto}] / rolagem horizontal: scrollWidth ${rolagem.scrollWidth} / clientWidth ${rolagem.clientWidth}\n` +
      `[${projeto}] / alvos medidos nos blocos novos: ${alvos.length} · abaixo de ${ALVO_MINIMO} px: ${pequenos.length}` +
      ` (${alvos.map((a) => `"${a.rotulo}" ${a.largura} × ${a.altura}`).join(', ')}) · campos de formulário: ${campos}`
  )
  expect(violacoes, `axe em /:\n${violacoes.join('\n')}`).toEqual([])
  expect(rolagem.scrollWidth).toBeLessThanOrEqual(rolagem.clientWidth)
  expect(alvos.length, 'o teste precisa ter medido os alvos').toBeGreaterThan(0)
  expect(pequenos, 'alvos abaixo de 44 px').toEqual([])
  expect(campos).toBe(0)
})
