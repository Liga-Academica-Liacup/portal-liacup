import { expect, test } from '@playwright/test'
import type { APIRequestContext, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { ORIGEM_NAO_PUBLICADO, ORIGEM_PUBLICADO } from '../../playwright.config'

/*
 * O interruptor "em construcao" (src/proxy.ts), nos dois modos.
 * design.md, D6, itens 1 a 7. Cada largura e um projeto do Playwright.
 *
 * Dois servidores da mesma compilacao (playwright.config.ts):
 *   - 3001, NAO publicado: o que a producao mostra ate a R1;
 *   - 3000, publicado: o que as previas mostram.
 *
 * As primeiras respostas sao pedidas SEM seguir redirecionamento
 * (`maxRedirects: 0`), e o destino e comparado pelo caminho, porque o
 * `Location` pode vir absoluto ou relativo.
 *
 * Os contadores contam so o que foi verificado ATE O FIM. Rota que falha nao
 * conta, e a mensagem de falha nomeia a rota e o status que ela recebeu.
 * Sem contador, "nada falhou" e "nada foi medido" dariam a mesma saida verde.
 */

const TITULO_EM_CONSTRUCAO = 'Portal em construção'
/*
 * As quatro rotas da spec publicacao-do-site (pagina-sobre-e-equipe): a
 * vitrine e as tres paginas que existem fora da raiz. Todas existem com o site
 * publicado, entao la cada uma responde 200, sem redirecionamento.
 */
const QUATRO_ROTAS = ['/vitrine', '/sobre', '/equipe', '/processo-seletivo'] as const
const TAGS_DO_AXE = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

type PrimeiraResposta = { status: number; location: string | undefined }

/* A primeira resposta, sem seguir redirecionamento. */
async function primeiraResposta(
  request: APIRequestContext,
  origem: string,
  rota: string
): Promise<PrimeiraResposta> {
  const resposta = await request.get(`${origem}${rota}`, { maxRedirects: 0 })
  return { status: resposta.status(), location: resposta.headers()['location'] }
}

/* O caminho do destino, venha o `Location` absoluto ou relativo. */
function caminhoDoDestino(location: string | undefined, origem: string): string | null {
  return location === undefined ? null : new URL(location, origem).pathname
}

function descrever(rota: string, resposta: PrimeiraResposta): string {
  return `${rota} recebeu ${resposta.status}, Location ${resposta.location ?? 'ausente'}`
}

/*
 * Confere a resposta esperada e devolve o problema, ou null se ela estiver
 * certa. `destino` igual a null quer dizer "sem Location".
 */
function conferir(
  rota: string,
  resposta: PrimeiraResposta,
  origem: string,
  status: number,
  destino: string | null
): string | null {
  const caminho = caminhoDoDestino(resposta.location, origem)
  if (resposta.status === status && caminho === destino) return null
  const esperado = destino === null ? `${status} sem Location` : `${status} para ${destino}`
  return `${descrever(rota, resposta)} (esperado ${esperado})`
}

/* A pagina em construcao inteira: titulo, logo carregada e os dois canais. */
async function conferirPaginaEmConstrucao(page: Page) {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITULO_EM_CONSTRUCAO)

  const logo = page.getByAltText('Logo da LIACUP')
  await expect(logo).toBeVisible()
  /* Largura natural maior que zero: a imagem chegou, nao ficou quebrada (D4). */
  await expect
    .poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth))
    .toBeGreaterThan(0)

  const contato = page.getByLabel('Canais de contato da LIACUP')
  await expect(contato.getByRole('link', { name: '@liacup.unb' })).toHaveAttribute(
    'href',
    'https://www.instagram.com/liacup.unb/'
  )
  await expect(contato.getByRole('link', { name: 'liacup.unb@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:liacup.unb@gmail.com'
  )
}

/* A primeira linha da mensagem de um erro do expect, para o resumo da falha. */
function primeiraLinha(erro: unknown): string {
  const texto = erro instanceof Error ? erro.message : String(erro)
  return texto.split('\n').find((linha) => linha.trim() !== '') ?? texto
}

test.describe('site NAO publicado (3001)', () => {
  /* Item 1. */
  test('as quatro rotas redirecionam (307) para a raiz e chegam a pagina em construcao', async ({
    page,
    request,
  }, informacoes) => {
    const falhas: string[] = []
    let verificadas = 0

    for (const rota of QUATRO_ROTAS) {
      const resposta = await primeiraResposta(request, ORIGEM_NAO_PUBLICADO, rota)
      const problema = conferir(rota, resposta, ORIGEM_NAO_PUBLICADO, 307, '/')
      if (problema) {
        falhas.push(problema)
        continue
      }
      try {
        await page.goto(`${ORIGEM_NAO_PUBLICADO}${rota}`)
        const caminhoFinal = new URL(page.url()).pathname
        expect(caminhoFinal, `${rota} terminou em ${caminhoFinal}, e nao em /`).toBe('/')
        await conferirPaginaEmConstrucao(page)
        verificadas += 1
      } catch (erro) {
        falhas.push(`${rota}, depois do redirecionamento: ${primeiraLinha(erro)}`)
      }
    }

    console.log(
      `[${informacoes.project.name}] rotas verificadas: ${verificadas} · modo nao publicado`
    )
    expect(falhas, `rotas com defeito no modo nao publicado:\n${falhas.join('\n')}`).toEqual([])
    expect(verificadas).toBe(QUATRO_ROTAS.length)
  })

  /* Item 2: a raiz, com conteudo. */
  test('a raiz responde 200, com / na barra, e mostra a pagina em construcao', async ({
    page,
    request,
  }) => {
    const resposta = await primeiraResposta(request, ORIGEM_NAO_PUBLICADO, '/')
    expect(conferir('/', resposta, ORIGEM_NAO_PUBLICADO, 200, null), descrever('/', resposta)).toBe(
      null
    )

    await page.goto(`${ORIGEM_NAO_PUBLICADO}/`)
    expect(new URL(page.url()).pathname).toBe('/')
    await conferirPaginaEmConstrucao(page)
  })

  /* Item 2: RP-07 na unica pagina que o visitante recebe. */
  test('a raiz nao acusa nenhuma violacao de acessibilidade', async ({ page }, informacoes) => {
    await page.goto(`${ORIGEM_NAO_PUBLICADO}/`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITULO_EM_CONSTRUCAO)

    const resultado = await new AxeBuilder({ page }).withTags(TAGS_DO_AXE).analyze()

    console.log(
      `[${informacoes.project.name}] Violacoes de acessibilidade: ${resultado.violations.length}` +
        ` · regras aplicadas: ${resultado.passes.length + resultado.violations.length}` +
        ` · raiz nao publicada`
    )
    if (resultado.violations.length > 0) {
      console.log(resultado.violations.map((v) => `${v.id}: ${v.help}`).join('\n'))
    }
    expect(resultado.violations).toEqual([])
  })

  /* Item 2: RP-05 na unica pagina que o visitante recebe. */
  test('a raiz nao gera rolagem horizontal nesta largura', async ({ page }, informacoes) => {
    await page.goto(`${ORIGEM_NAO_PUBLICADO}/`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITULO_EM_CONSTRUCAO)

    const medida = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))

    console.log(
      `[${informacoes.project.name}] raiz nao publicada: scrollWidth ${medida.scrollWidth}` +
        ` · clientWidth ${medida.clientWidth}`
    )
    expect(
      medida.scrollWidth,
      `${informacoes.project.name}: scrollWidth ${medida.scrollWidth} maior que clientWidth ${medida.clientWidth}`
    ).toBeLessThanOrEqual(medida.clientWidth)
  })

  /* Item 3. */
  test('/em-construcao responde 200, sem redirecionamento', async ({ page, request }) => {
    const resposta = await primeiraResposta(request, ORIGEM_NAO_PUBLICADO, '/em-construcao')
    expect(
      conferir('/em-construcao', resposta, ORIGEM_NAO_PUBLICADO, 200, null),
      descrever('/em-construcao', resposta)
    ).toBe(null)

    await page.goto(`${ORIGEM_NAO_PUBLICADO}/em-construcao`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITULO_EM_CONSTRUCAO)
  })

  /*
   * Item 4: arquivos pedidos direto (D4, Q6). A logo escapa do interruptor e
   * chega como imagem; /vitrine.rsc e /robots.txt tem extensao, mas nao de
   * imagem nem de fonte, entao passam pelo interruptor e levam 307 para /.
   * Se escapassem, o conteudo da vitrine vazaria antes do lancamento.
   */
  test('arquivos pedidos direto: a logo responde 200 como imagem, .rsc e .txt levam 307 para /', async ({
    request,
  }, informacoes) => {
    const casos = [
      { rota: '/logo-liacup-256.png', status: 200, destino: null, imagem: true },
      { rota: '/vitrine.rsc', status: 307, destino: '/', imagem: false },
      { rota: '/robots.txt', status: 307, destino: '/', imagem: false },
    ] as const

    const falhas: string[] = []
    const conferidos: string[] = []

    for (const caso of casos) {
      const resposta = await request.get(`${ORIGEM_NAO_PUBLICADO}${caso.rota}`, {
        maxRedirects: 0,
      })
      const primeira = { status: resposta.status(), location: resposta.headers()['location'] }
      const problema = conferir(
        caso.rota,
        primeira,
        ORIGEM_NAO_PUBLICADO,
        caso.status,
        caso.destino
      )
      if (problema) {
        falhas.push(problema)
        continue
      }
      if (caso.imagem) {
        const tipo = resposta.headers()['content-type'] ?? 'ausente'
        if (!/^image\//.test(tipo)) {
          falhas.push(`${descrever(caso.rota, primeira)}, Content-Type ${tipo} (esperado image/*)`)
          continue
        }
      }
      conferidos.push(descrever(caso.rota, primeira))
    }

    console.log(
      `[${informacoes.project.name}] arquivos conferidos: ${conferidos.length}\n  ` +
        conferidos.join('\n  ')
    )
    expect(falhas, `arquivos com defeito no modo nao publicado:\n${falhas.join('\n')}`).toEqual([])
    expect(conferidos).toHaveLength(casos.length)
  })
})

test.describe('site publicado (3000)', () => {
  /* Item 5. */
  test('as quatro rotas respondem 200 sem redirecionamento e nenhuma mostra a pagina em construcao', async ({
    page,
    request,
  }, informacoes) => {
    const falhas: string[] = []
    let verificadas = 0

    for (const rota of QUATRO_ROTAS) {
      const resposta = await primeiraResposta(request, ORIGEM_PUBLICADO, rota)
      const problema = conferir(rota, resposta, ORIGEM_PUBLICADO, 200, null)
      if (problema) {
        falhas.push(problema)
        continue
      }
      try {
        await page.goto(`${ORIGEM_PUBLICADO}${rota}`)
        if (rota === '/vitrine') {
          await expect(page.getByRole('heading', { level: 1 })).toHaveText(
            'Vitrine do design system'
          )
        }
        await expect(
          page.getByText(TITULO_EM_CONSTRUCAO),
          `${rota} (status ${resposta.status}) mostrou a pagina em construcao`
        ).toHaveCount(0)
        verificadas += 1
      } catch (erro) {
        falhas.push(`${rota} (status ${resposta.status}): ${primeiraLinha(erro)}`)
      }
    }

    console.log(`[${informacoes.project.name}] rotas verificadas: ${verificadas} · modo publicado`)
    expect(falhas, `rotas com defeito no modo publicado:\n${falhas.join('\n')}`).toEqual([])
    expect(verificadas).toBe(QUATRO_ROTAS.length)
  })

  /* Item 6. */
  test('/em-construcao responde 404, sem Location', async ({ request }) => {
    const resposta = await primeiraResposta(request, ORIGEM_PUBLICADO, '/em-construcao')
    expect(
      conferir('/em-construcao', resposta, ORIGEM_PUBLICADO, 404, null),
      `${descrever('/em-construcao', resposta)} (esperado 404 sem Location)`
    ).toBe(null)
  })
})

/*
 * Item 7: o pedido do Gabriel, o status e o Location da primeira resposta.
 * Desde a pagina-sobre-e-equipe, /sobre existe: no publicado responde 200, e o
 * 404 fica com o endereco inexistente (spec publicacao-do-site).
 */
test('primeira resposta de /sobre e de um endereco inexistente, nos dois modos', async ({
  request,
}, informacoes) => {
  const casos = [
    {
      origem: ORIGEM_NAO_PUBLICADO,
      modo: 'nao publicado',
      rota: '/sobre',
      status: 307,
      destino: '/',
    },
    {
      origem: ORIGEM_NAO_PUBLICADO,
      modo: 'nao publicado',
      rota: '/endereco-que-nao-existe',
      status: 307,
      destino: '/',
    },
    { origem: ORIGEM_PUBLICADO, modo: 'publicado', rota: '/sobre', status: 200, destino: null },
    {
      origem: ORIGEM_PUBLICADO,
      modo: 'publicado',
      rota: '/endereco-que-nao-existe',
      status: 404,
      destino: null,
    },
  ] as const

  const falhas: string[] = []
  const conferidas: string[] = []

  for (const { origem, modo, rota, status, destino } of casos) {
    const resposta = await primeiraResposta(request, origem, rota)
    const problema = conferir(rota, resposta, origem, status, destino)
    if (problema) {
      falhas.push(`${modo}: ${problema}`)
    } else {
      conferidas.push(`${modo} ${descrever(rota, resposta)}`)
    }
  }

  console.log(
    `[${informacoes.project.name}] respostas conferidas: ${conferidas.length}\n  ` +
      conferidas.join('\n  ')
  )
  expect(falhas, `primeiras respostas com defeito:\n${falhas.join('\n')}`).toEqual([])
  expect(conferidas).toHaveLength(casos.length)
})
