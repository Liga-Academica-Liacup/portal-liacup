import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { estaNaLista } from '../../src/lib/utils/paginas-publicas'

/*
 * A PÁGINA INICIAL PUBLICADA (layout-e-hero, design.md D6 e D7, item 4; spec
 * pagina-inicial).
 *
 * Com o site publicado (a 3000, `baseURL`), a raiz mostra a inicial com o hero,
 * e não mais "Portal em construção". A página em construção continua coberta
 * na 3001 pelo interruptor.spec.ts, que não muda.
 *
 * O texto do hero é lido do docs/conteudo-institucional.md, seção 2.0, e não
 * escrito aqui: o documento é a fonte única de todo texto que vai ao ar
 * (constitution, princípio 5). Se a página divergir dele, este spec fica
 * vermelho; se o documento mudar, o spec acompanha.
 *
 * Axe, rolagem, alvos e pedidos externos da raiz estão no
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
  const conteudo = page.getByRole('main')
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
   * O botão que aparece leva de verdade à página dele (pagina-processo-seletivo,
   * design.md D8, item 3): clicado, o endereço muda e o título principal da
   * página nova aparece. Nenhum endereço é escrito aqui além do da tabela acima.
   */
  const presentes = BOTOES_DO_HERO.filter((botao) => estaNaLista(botao.endereco))
  const navegados: string[] = []
  for (const botao of presentes) {
    await abrirRaiz(page)
    await page.getByRole('main').getByRole('link', { name: botao.rotulo, exact: true }).click()
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
  const medida = await page.getByRole('main').evaluate((conteudo) => {
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

  console.log(
    `[${informacoes.project.name}] desenhos no conteúdo: ${medida.desenhos}` +
      ` · fora do leitor de tela: ${medida.foraDoLeitor} · quadros: ${medida.quadros}` +
      ` com ${medida.desenhosNosQuadros} borboleta(s) e ${medida.textoNosQuadros.length} caracteres de texto` +
      ` · imagens: ${medida.imagens} · "Foto institucional": ${marcacao}`
  )
  expect(medida.desenhos, 'o hero precisa ter as borboletas').toBeGreaterThan(0)
  expect(medida.foraDoLeitor, 'desenho do hero anunciado ao leitor de tela').toBe(medida.desenhos)
  expect(medida.quadros, 'o quadro da foto não foi encontrado').toBe(1)
  expect(medida.desenhosNosQuadros, 'o quadro sem a borboleta da liga').toBeGreaterThan(0)
  expect(medida.textoNosQuadros, 'texto dentro do quadro da foto').toBe('')
  expect(medida.imagens, 'imagem no lugar da foto, que ainda não existe').toBe(0)
  expect(medida.focaveisEscondidos, 'controle focável escondido do leitor de tela').toBe(0)
  expect(marcacao).toBe(0)
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
