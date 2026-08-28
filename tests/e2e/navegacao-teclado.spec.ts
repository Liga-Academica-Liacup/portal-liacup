/*
 * OS SETE PERCURSOS DE TECLADO (FR-042).
 *
 * POR QUE ESTE ARQUIVO EXISTE SEPARADO
 * O axe-core **não testa operabilidade por teclado**. Prisão de foco, retorno de
 * foco, ordem de foco e link de pular conteúdo passam inteiros por ele sem
 * acusar nada. Esta é a feature da navegação: é aqui que mora a maior parte do
 * que pode dar errado, e é a parte que ficaria verde sem ninguém notar.
 *
 * A REGRA DESTE ARQUIVO: só teclas de verdade.
 * Nada de `element.focus()` para "posicionar" o foco, nada de `click()` para
 * abrir o painel. Cada percurso usa `page.keyboard.press` e pergunta onde o foco
 * REALMENTE parou. Conferir que `aria-expanded` existe no HTML é checar
 * configuração; conferir que o foco não sai do painel é checar resultado — e a
 * distinção entre as duas já custou caro nesta obra mais de uma vez.
 *
 * A saída declara `7/7`. Sem o contador, "nenhum percurso falhou" e "nenhum
 * percurso rodou" produzem a mesma linha verde (RP-12).
 */
import { expect, test } from '@playwright/test'

/* Os percursos exercitam o painel, que só existe abaixo de 1024 px. */
const PROJETO_MOBILE = 'largura-360'

/** Descreve o elemento focado agora, do jeito que a pessoa o encontraria. */
async function focoAtual(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const alvo = document.activeElement as HTMLElement | null
    if (!alvo)
      return {
        etiqueta: 'nenhum',
        texto: '',
        testid: '',
        id: '',
        visivel: false,
        topo: 0,
        base: 0,
        largura: 0,
        altura: 0,
        topCalculado: '',
        focoVisivel: false,
      }
    const caixa = alvo.getBoundingClientRect()
    const estilo = window.getComputedStyle(alvo)
    return {
      etiqueta: alvo.tagName.toLowerCase(),
      texto: (alvo.textContent ?? '').trim().slice(0, 40),
      testid: alvo.getAttribute('data-testid') ?? '',
      id: alvo.id,
      topo: Math.round(caixa.top * 100) / 100,
      base: Math.round(caixa.bottom * 100) / 100,
      largura: Math.round(caixa.width * 100) / 100,
      altura: Math.round(caixa.height * 100) / 100,
      topCalculado: estilo.top,
      focoVisivel: alvo.matches(':focus-visible'),
      // "Visível" aqui é o que a pessoa vê: dentro da tela, não só no DOM.
      visivel:
        estilo.visibility !== 'hidden' &&
        estilo.display !== 'none' &&
        caixa.top >= 0 &&
        caixa.bottom <= window.innerHeight &&
        caixa.width > 0,
    }
  })
}

/*
 * DOIS contadores, e nao um.
 *
 * A primeira versao usava um contador so, compartilhado entre os sete percursos
 * do FR-042 e os casos adicionais dos Edge Cases. A saida virou `10/7` — um
 * numero que nao descreve nada, porque somava duas coisas diferentes. Um
 * contador que conta o conjunto errado e pior que nenhum: ele parece medicao.
 */
const percursos: string[] = []
const casosAdicionais: string[] = []

function registrar(nome: string) {
  percursos.push(nome)
  console.log(`percurso ${percursos.length}/7 verificado: ${nome}`)
}

function registrarAdicional(nome: string) {
  casosAdicionais.push(nome)
  console.log(`caso adicional ${casosAdicionais.length}/3 verificado: ${nome}`)
}

/*
 * MODO SERIAL, e o motivo é o contador.
 *
 * Os contadores vivem no escopo do módulo, e o Playwright distribui os testes
 * entre workers paralelos — cada worker carrega o módulo de novo, com o array
 * zerado. Medido: a saída virou `PERCURSOS DE TECLADO: 1/7` repetida sete
 * vezes, uma por worker, cada uma contando só o que caiu nela.
 *
 * Um contador que depende de onde o teste foi parar não mede nada, e ainda por
 * cima parece medição. Em série, os sete percursos correm no mesmo worker e o
 * número volta a descrever o conjunto. O custo é alguns segundos numa suíte que
 * roda em um projeto só.
 */
test.describe.configure({ mode: 'serial' })

test.describe('percurso integral por teclado', () => {
  /*
   * O `test.skip` no nível do describe não recebe `testInfo` — só fixtures. Em
   * `beforeEach` ele recebe, e é por isso que a condição mora aqui.
   */
  test.beforeEach(({}, informacoes) => {
    test.skip(
      informacoes.project.name !== PROJETO_MOBILE,
      `os percursos exercitam o painel, que so existe abaixo de 1024 px (projeto ${PROJETO_MOBILE})`
    )
  })

  test('1 — o primeiro Tab alcança o link de pular, e ele fica visível', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const foco = await focoAtual(page)
    console.log(
      `  primeiro Tab parou em: <${foco.etiqueta}> "${foco.texto}" · ` +
        `caixa=${foco.topo}..${foco.base} × ${foco.largura}x${foco.altura} · ` +
        `top=${foco.topCalculado} · :focus-visible=${foco.focoVisivel} · visivel=${foco.visivel}`
    )
    expect(foco.texto).toBe('Pular para o conteúdo')
    // FR-017: ele fica VISÍVEL ao receber foco. Fora da tela não é atalho.
    expect(foco.visivel, 'o link de pular recebeu foco mas continuou fora da tela').toBe(true)
    registrar('primeiro Tab alcança o link de pular, visível')
  })

  test('2 — acionar o link move o FOCO para o conteúdo principal', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    const foco = await focoAtual(page)
    console.log(`  depois do Enter, foco em: <${foco.etiqueta}> id="${foco.id}"`)
    // Move o FOCO, e não só a tela: sem isso, quem depende do teclado continua
    // no cabeçalho depois de "pular".
    expect(foco.id).toBe('conteudo-principal')
    registrar('Enter no link move o foco para o main')
  })

  test('3 — o botão do painel é alcançável e acionável por teclado', async ({ page }) => {
    await page.goto('/')

    let achou = false
    for (let i = 0; i < 12 && !achou; i += 1) {
      await page.keyboard.press('Tab')
      achou = (await focoAtual(page)).testid === 'abrir-painel'
    }
    console.log(`  botão do painel alcançado por Tab: ${achou}`)
    expect(achou, 'o acionador do painel nao foi alcancado por Tab').toBe(true)

    await page.keyboard.press('Enter')
    await expect(page.getByTestId('painel-de-navegacao')).toHaveAttribute('open', '')
    await expect(page.getByTestId('abrir-painel')).toHaveAttribute('aria-expanded', 'true')
    registrar('botão alcançável por Tab e acionável por Enter')
  })

  test('4 — com o painel aberto, Tab percorre e VOLTA ao início', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('abrir-painel').press('Enter')

    /*
     * O QUE ESTE PERCURSO COBRA, E POR QUE NÃO É "o foco nunca sai do <dialog>".
     *
     * Medido em 28/08/2026, com Chromium: ao completar o ciclo, o Chrome insere
     * UMA parada em `<body>` antes de voltar ao primeiro item do painel — a
     * sequência observada foi 9 destinos, depois `<BODY>`, depois "Início" de
     * novo. É comportamento nativo do `<dialog>` modal, não do nosso código.
     *
     * Essa parada não é o risco. O risco do FR-011 é o foco alcançar um
     * CONTROLE DA PÁGINA ATRÁS — a marca, o CTA, os links do rodapé — porque aí
     * quem usa teclado sai do painel sem perceber e opera uma página que o
     * `showModal()` deveria ter tornado inerte.
     *
     * Então a asserção é essa: nenhum elemento interativo fora do painel é
     * alcançado. Uma parada vazia no `body` é registrada e contada, e não é
     * tratada como escape — descrever o comportamento do navegador como defeito
     * nosso mandaria a próxima pessoa consertar a coisa errada.
     */
    const ondeEstaOFoco = async () =>
      page.evaluate(() => {
        const alvo = document.activeElement as HTMLElement | null
        const painel = document.querySelector('[data-testid="painel-de-navegacao"]')
        const ehInterativo =
          !!alvo &&
          alvo.matches('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
        return {
          texto: (alvo?.textContent ?? '').trim().slice(0, 30),
          dentro: painel?.contains(alvo) ?? false,
          ehInterativo,
        }
      })

    const destinos = new Set<string>()
    let paradasVazias = 0
    const escapes: string[] = []

    for (const tecla of ['Tab', 'Shift+Tab'] as const) {
      // Mais passos que itens, de propósito: se o foco escapasse, apareceria.
      for (let i = 0; i < 14; i += 1) {
        await page.keyboard.press(tecla)
        const foco = await ondeEstaOFoco()
        if (foco.dentro) destinos.add(foco.texto)
        else if (foco.ehInterativo) escapes.push(`${tecla} ${i + 1}: "${foco.texto}"`)
        else paradasVazias += 1
      }
    }

    console.log(
      `  28 teclas (14 Tab + 14 Shift+Tab) · destinos distintos no painel: ${destinos.size} · ` +
        `paradas vazias do navegador: ${paradasVazias} · escapes para controle da página: ${escapes.length}`
    )
    expect(escapes, `o foco alcançou controle fora do painel: ${escapes.join(' | ')}`).toEqual([])
    expect(destinos.size, 'o ciclo nao alcancou os nove destinos').toBe(9)
    registrar('Tab e Shift+Tab ciclam sem alcançar controle fora do painel')
  })

  test('5 — Esc fecha e devolve o foco ao botão', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('abrir-painel').press('Enter')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Escape')

    await expect(page.getByTestId('painel-de-navegacao')).not.toHaveAttribute('open', '')
    const foco = await focoAtual(page)
    console.log(`  depois do Esc, foco em: testid="${foco.testid}"`)
    expect(foco.testid).toBe('abrir-painel')
    await expect(page.getByTestId('abrir-painel')).toHaveAttribute('aria-expanded', 'false')
    registrar('Esc fecha e devolve o foco ao acionador')
  })

  test('6 — escolher um destino pelo teclado fecha o painel', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('abrir-painel').press('Enter')
    await page.keyboard.press('Tab')

    const destino = await focoAtual(page)
    await page.keyboard.press('Enter')
    await page.waitForLoadState('domcontentloaded')

    console.log(
      `  destino escolhido por Enter: "${destino.texto}" · URL: ${new URL(page.url()).pathname}`
    )
    await expect(page.getByTestId('painel-de-navegacao')).not.toHaveAttribute('open', '')
    registrar('escolher destino por Enter fecha o painel')
  })

  test('7 — a ordem de foco corresponde à ordem visual', async ({ page }) => {
    await page.goto('/')

    /*
     * PARA NO FIM DO CICLO, e ignora a parada em `<body>`.
     *
     * A primeira versão dava 8 Tabs fixos e acusava "2 fora de ordem" — que eram
     * a parada vazia do navegador e a VOLTA ao primeiro elemento. Comparar a
     * volta do ciclo com o último elemento é comparar o começo com o fim, e
     * qualquer página reprovaria.
     */
    const posicoes: { texto: string; topo: number; esquerda: number }[] = []
    let primeiro = ''
    for (let i = 0; i < 14; i += 1) {
      await page.keyboard.press('Tab')
      const p = await page.evaluate(() => {
        const alvo = document.activeElement as HTMLElement | null
        const ehInterativo =
          !!alvo &&
          alvo.matches('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
        if (!ehInterativo) return { texto: '', topo: 0, esquerda: 0 }
        const caixa = alvo?.getBoundingClientRect()
        return {
          texto: (alvo?.textContent ?? '').trim().slice(0, 24),
          topo: Math.round(caixa?.top ?? 0),
          esquerda: Math.round(caixa?.left ?? 0),
        }
      })
      if (!p.texto) continue
      if (primeiro === '') primeiro = p.texto
      else if (p.texto === primeiro) break // ciclo completo: parar antes de comparar o fim com o começo
      posicoes.push(p)
    }

    const forasDeOrdem = posicoes.filter((atual, i) => {
      if (i === 0) return false
      const anterior = posicoes[i - 1]!
      // Ordem visual = de cima para baixo; empatando no topo, da esquerda para
      // a direita. Tolerância de 2 px para arredondamento de renderização.
      if (atual.topo > anterior.topo + 2) return false
      if (Math.abs(atual.topo - anterior.topo) <= 2) return atual.esquerda < anterior.esquerda - 2
      return true
    })

    console.log(
      `  elementos na sequência de Tab: ${posicoes.length} · fora da ordem visual: ${forasDeOrdem.length}`
    )
    expect(posicoes.length, 'a sequencia de Tab nao alcancou nada').toBeGreaterThan(0)
    expect(forasDeOrdem.map((p) => p.texto)).toEqual([])
    registrar('ordem de foco corresponde à ordem visual')
  })
})

/*
 * CASOS ADICIONAIS — os que a spec lista nos Edge Cases e que os sete percursos
 * não cobrem.
 *
 * O de redimensionamento existe porque a linha do retorno de foco tem uma guarda
 * (`offsetParent`) que NÃO serve ao fechamento comum: ela serve ao acionador que
 * SUMIU. A demonstração RP-12 do percurso 5 removeu a linha e fechou o painel em
 * largura de mobile — cenário em que o `<dialog>` nativo já devolve o foco
 * sozinho — e por isso não exercitou o motivo pelo qual a linha foi escrita.
 *
 * O risco concreto: `aoFechar` faz três coisas — destrava a rolagem, sincroniza
 * o estado e devolve o foco — e as três dependem do evento `close` disparar. Se
 * a largura cruzar para desktop com o painel aberto e o `<dialog>` sair da
 * árvore, uma página de desktop poderia ficar sem rolagem, sem nada na tela
 * explicando por quê.
 */
test.describe('casos adicionais do painel', () => {
  test.beforeEach(({}, informacoes) => {
    test.skip(informacoes.project.name !== PROJETO_MOBILE, `roda no projeto ${PROJETO_MOBILE}`)
  })

  test('redimensionar para desktop com o painel aberto destrava a rolagem e não deixa foco órfão', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByTestId('abrir-painel').press('Enter')

    const comPainelAberto = await page.evaluate(() => ({
      overflow: document.body.style.overflow,
      aberto: (document.querySelector('[data-testid="painel-de-navegacao"]') as HTMLDialogElement)
        ?.open,
    }))
    expect(comPainelAberto.aberto, 'o painel nao abriu').toBe(true)
    expect(comPainelAberto.overflow, 'a rolagem nao foi travada com o painel aberto').toBe('hidden')

    // A travessia que a spec prevê nos Edge Cases.
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.waitForTimeout(300)

    const depois = await page.evaluate(() => {
      const painel = document.querySelector(
        '[data-testid="painel-de-navegacao"]'
      ) as HTMLDialogElement | null
      const ativo = document.activeElement as HTMLElement | null
      const caixa = ativo?.getBoundingClientRect()
      const estiloAtivo = ativo ? window.getComputedStyle(ativo) : null
      return {
        overflow: document.body.style.overflow,
        painelAberto: painel?.open ?? false,
        rolagemFunciona: document.documentElement.scrollHeight > 0,
        focoEtiqueta: ativo?.tagName.toLowerCase() ?? 'nenhum',
        // Foco órfão: num elemento que existe mas não ocupa espaço nenhum.
        /*
         * Foco órfão = foco num elemento que a pessoa NÃO VÊ.
         *
         * A primeira versão checava só caixa de tamanho zero, o que cobre
         * `display: none` e mais nada. Elemento escondido com
         * `visibility: hidden` ou `opacity: 0` continua tendo caixa, e focá-lo
         * é o defeito de verdade: o cursor de teclado fica num lugar invisível e
         * a próxima tecla age onde ninguém está olhando.
         *
         * Checar a visibilidade calculada cobre as três formas de esconder, e
         * torna esta verificação independente de COMO o acionador é escondido no
         * desktop — que é o que a deixa valendo se alguém trocar o CSS.
         */
        focoOrfao:
          !!ativo &&
          ativo !== document.body &&
          (estiloAtivo?.display === 'none' ||
            estiloAtivo?.visibility === 'hidden' ||
            Number(estiloAtivo?.opacity ?? 1) === 0 ||
            ((caixa?.width ?? 0) === 0 && (caixa?.height ?? 0) === 0)),
      }
    })

    console.log(
      `  apos 390→1280 com painel aberto: overflow="${depois.overflow}" · ` +
        `painel aberto=${depois.painelAberto} · foco em <${depois.focoEtiqueta}> · ` +
        `foco orfao=${depois.focoOrfao}`
    )

    expect(
      depois.painelAberto,
      'o painel continuou aberto numa largura em que ele nao existe'
    ).toBe(false)
    expect(
      depois.overflow,
      'a rolagem do fundo ficou travada depois de passar para desktop — a pagina nao rola e nada na tela explica'
    ).not.toBe('hidden')
    expect(depois.focoOrfao, 'o foco ficou num elemento invisivel na tela').toBe(false)
    registrarAdicional('resize mobile→desktop destrava a rolagem e não deixa foco órfão')
  })

  test('clicar no backdrop fecha e devolve o foco ao acionador', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('abrir-painel').press('Enter')

    // O backdrop não é elemento: clicar fora da caixa do painel atinge o dialog.
    await page.mouse.click(10, 400)
    await page.waitForTimeout(150)

    const foco = await focoAtual(page)
    console.log(`  apos clique no backdrop: painel fechado · foco em testid="${foco.testid}"`)
    await expect(page.getByTestId('painel-de-navegacao')).not.toHaveAttribute('open', '')
    expect(foco.testid).toBe('abrir-painel')
    registrarAdicional('clique no backdrop fecha e devolve o foco')
  })

  test('a rolagem do fundo é travada e restaurada ao valor anterior', async ({ page }) => {
    await page.goto('/')
    const antes = await page.evaluate(() => document.body.style.overflow)
    await page.getByTestId('abrir-painel').press('Enter')
    const durante = await page.evaluate(() => document.body.style.overflow)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(150)
    const depois = await page.evaluate(() => document.body.style.overflow)

    console.log(`  overflow do body: antes="${antes}" · durante="${durante}" · depois="${depois}"`)
    expect(durante).toBe('hidden')
    // Restaura o valor ANTERIOR, e não um vazio presumido.
    expect(depois).toBe(antes)
    registrarAdicional('trava de rolagem restaura o valor anterior')
  })
})

/*
 * FECHAMENTO DO ARQUIVO, depois dos dois grupos.
 *
 * Ele nao pode morar no `afterAll` dos sete percursos: naquele ponto os tres
 * casos adicionais ainda nao rodaram, e a saida seria `7/7 · 0/3` mesmo com a
 * suite perfeita. Tambem nao imprime numero nos seis projetos pulados — zero
 * ali significaria "nao se aplicava", mas pareceria "mediu e encontrou zero".
 *
 * As contagens sao ASSERCOES. Console sem assercao e relatorio, nao garantia:
 * perder um `registrar` deixaria os dez testes verdes e so mudaria uma linha
 * que ninguem e obrigado a ler.
 */
test.afterAll(({}, informacoes) => {
  if (informacoes.project.name !== PROJETO_MOBILE) return
  // Uma falha anterior ja explica por que o conjunto nao chegou a 7/7. Nao
  // empilhar uma segunda falha de contador sobre a causa original.
  if (informacoes.status !== 'passed' || informacoes.errors.length > 0) return

  expect(percursos, 'a suite nao registrou os sete percursos').toHaveLength(7)
  expect(new Set(percursos).size, 'ha percurso duplicado no contador').toBe(7)
  expect(casosAdicionais, 'a suite nao registrou os tres casos adicionais').toHaveLength(3)
  expect(new Set(casosAdicionais).size, 'ha caso adicional duplicado no contador').toBe(3)

  console.log(
    `\nPERCURSOS DE TECLADO: ${percursos.length}/7 · CASOS ADICIONAIS: ${casosAdicionais.length}/3`
  )
})
