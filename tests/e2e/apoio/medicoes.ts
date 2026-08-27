/*
 * Medições reutilizáveis das páginas públicas.
 *
 * POR QUE UM ARQUIVO DE APOIO
 * A matriz da F03 é 10 destinos × 7 larguras = 70 combinações, e cada uma mede
 * as mesmas seis coisas. Repetir o `page.evaluate` em cada caso produziria seis
 * cópias que divergem — que é o mesmo defeito que o catálogo único resolve para
 * a lista de destinos, um nível abaixo.
 *
 * DUAS COISAS QUE ESTE ARQUIVO NÃO FAZ, DE PROPÓSITO
 *
 *   1. Não conhece os destinos. Quem os traz é
 *      `src/componentes/layout/destinos-publicos.ts`, importado pelo teste. Uma
 *      lista de caminhos aqui seria a segunda lista que o FR-044 proíbe.
 *   2. Não define o corte de 1024 px. O breakpoint mora no CSS; aqui se pergunta
 *      ao navegador o que está **visível**, não em que largura deveria estar.
 *      Repetir o número em TypeScript criaria duas fontes para o mesmo corte.
 *
 * Toda função devolve o número medido junto com o veredito, porque verificação
 * que não diz quanto mediu não distingue "nada falhou" de "nada foi medido"
 * (RP-12).
 */
import type { Page } from '@playwright/test'

/** Alvo de toque mínimo. Regra nossa, do Princípio II e da ADR-0004 §2.1. */
export const ALVO_MINIMO_PX = 44

/** Teto do cabeçalho fixo no mobile, do FR-002. */
export const ALTURA_MAXIMA_CABECALHO_MOBILE_PX = 64

/** As larguras mobile, onde o teto de 64 px vale (FR-002). */
export const LARGURAS_MOBILE = [360, 390, 430, 480] as const

const SELETOR_INTERATIVO = 'a, button, input, textarea, select, [role="button"]'

export type ContagemDeLandmarks = {
  banner: number
  navigation: number
  main: number
  contentinfo: number
}

/**
 * Conta as regiões de referência por papel, do jeito que o leitor de tela as vê.
 *
 * Conta o papel ACESSÍVEL, não a etiqueta HTML: um `<nav>` dentro de `<main>`
 * continua sendo `navigation`, e um `<header>` aninhado NÃO é `banner`. É a
 * diferença que faz o FR-020 ("uma de cada") ser verificável de verdade — e foi
 * por causa dela que o `LinksDeContato` virou `<address>`: como `<nav>`, ele
 * criava um segundo landmark de navegação no rodapé.
 */
export async function contarLandmarks(page: Page): Promise<ContagemDeLandmarks> {
  return page.evaluate(() => {
    const contar = (seletor: string, apenasRaiz: boolean) =>
      Array.from(document.querySelectorAll(seletor)).filter((elemento) => {
        const estilo = window.getComputedStyle(elemento)
        if (estilo.display === 'none' || estilo.visibility === 'hidden') return false
        if (elemento.getAttribute('aria-hidden') === 'true') return false
        if (!apenasRaiz) return true
        // header/footer só são banner/contentinfo quando não estão dentro de
        // article, aside, main, nav ou section.
        return !elemento.closest('article, aside, main, nav, section')
      }).length

    return {
      banner: contar('header, [role="banner"]', true),
      navigation: contar('nav, [role="navigation"]', false),
      main: contar('main, [role="main"]', false),
      contentinfo: contar('footer, [role="contentinfo"]', true),
    }
  })
}

export type MedidaDeRolagem = { scrollWidth: number; clientWidth: number }

/** FR-038 · RP-05. Devolve os dois números, não só o veredito. */
export async function medirRolagemHorizontal(page: Page): Promise<MedidaDeRolagem> {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
}

/**
 * FR-002 e FR-003. Mede a altura renderizada do cabeçalho.
 *
 * Usa `getBoundingClientRect().height`, que é o que a pessoa vê ocupado, e não
 * a altura declarada em CSS — que ignoraria conteúdo transbordando e daria um
 * número bonito para um cabeçalho alto.
 */
export async function medirAlturaDoCabecalho(page: Page): Promise<number> {
  return page.evaluate(() => {
    const cabecalho = document.querySelector('header')
    if (!cabecalho) return Number.NaN
    return Number(cabecalho.getBoundingClientRect().height.toFixed(2))
  })
}

/** FR-002: o cabeçalho continua visível depois de rolar. */
export async function cabecalhoPermaneceVisivelAoRolar(page: Page): Promise<{
  topoAntes: number
  topoDepois: number
  rolagemAplicada: number
}> {
  const topoAntes = await page.evaluate(
    () => document.querySelector('header')?.getBoundingClientRect().top ?? Number.NaN
  )
  await page.evaluate(() => window.scrollTo(0, 400))
  await page.waitForTimeout(120)
  const resultado = await page.evaluate(() => ({
    topoDepois: document.querySelector('header')?.getBoundingClientRect().top ?? Number.NaN,
    rolagemAplicada: window.scrollY,
  }))
  await page.evaluate(() => window.scrollTo(0, 0))
  return { topoAntes, ...resultado }
}

export type MedidaDeAlvos = { medidos: number; pequenos: string[] }

/**
 * FR-037 · RP-04. Mede só o que está **visível**: elemento escondido não é alvo
 * de toque de ninguém, e falso positivo destrói a confiança na verificação.
 *
 * Devolve `medidos` junto com a lista, porque zero pequenos com zero medidos é
 * o verde que não mediu nada — foi o que pegou os 20 alvos da F01.
 */
export async function medirAlvosDeToque(page: Page, minimo: number): Promise<MedidaDeAlvos> {
  return page.evaluate(
    ({ seletor, alvoMinimo }) => {
      const pequenos: string[] = []
      let medidos = 0

      for (const elemento of Array.from(document.querySelectorAll(seletor))) {
        const caixa = elemento.getBoundingClientRect()
        const estilo = window.getComputedStyle(elemento)
        const escondido =
          estilo.display === 'none' ||
          estilo.visibility === 'hidden' ||
          (caixa.width === 0 && caixa.height === 0)
        if (escondido) continue

        medidos += 1
        if (caixa.width < alvoMinimo || caixa.height < alvoMinimo) {
          const identificacao =
            elemento.getAttribute('aria-label') ?? elemento.textContent?.trim() ?? ''
          pequenos.push(
            `${elemento.tagName.toLowerCase()} "${identificacao.slice(0, 30)}" ` +
              `${caixa.width.toFixed(1)}×${caixa.height.toFixed(1)}`
          )
        }
      }
      return { medidos, pequenos }
    },
    { seletor: SELETOR_INTERATIVO, alvoMinimo: minimo }
  )
}

/**
 * Lê propriedades calculadas de um elemento. Base da comparação de aparência
 * entre `Botao` e `LinkComAparenciaDeBotao` (SC-018).
 *
 * Lê o estilo CALCULADO, não a classe aplicada: duas classes com nomes
 * diferentes e o mesmo resultado passam, e duas com o mesmo nome e resultados
 * diferentes falham. É a verificação do resultado, não da configuração.
 */
export async function lerPropriedadesCalculadas(
  page: Page,
  seletor: string,
  propriedades: readonly string[]
): Promise<Record<string, string>> {
  return page.evaluate(
    ({ alvo, lista }) => {
      const elemento = document.querySelector(alvo)
      if (!elemento) return {}
      const estilo = window.getComputedStyle(elemento)
      const saida: Record<string, string> = {}
      for (const propriedade of lista) saida[propriedade] = estilo.getPropertyValue(propriedade)
      return saida
    },
    { alvo: seletor, lista: propriedades }
  )
}

/**
 * Diz se um elemento está na árvore acessível e visível.
 *
 * Serve ao contrato de navegação: abaixo de 1024 px o acionador do painel
 * existe; a partir de 1024 px ele precisa estar **ausente da árvore
 * acessível**, não apenas transparente. Pergunta ao navegador o resultado; não
 * repete o breakpoint.
 */
export async function estaAcessivelmenteVisivel(page: Page, seletor: string): Promise<boolean> {
  return page.evaluate((alvo) => {
    const elemento = document.querySelector(alvo)
    if (!elemento) return false
    if (elemento.getAttribute('aria-hidden') === 'true') return false
    const estilo = window.getComputedStyle(elemento)
    if (estilo.display === 'none' || estilo.visibility === 'hidden') return false
    const caixa = elemento.getBoundingClientRect()
    return caixa.width > 0 && caixa.height > 0
  }, seletor)
}
