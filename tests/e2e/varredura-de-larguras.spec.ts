/*
 * O PONTO CEGO ENTRE AS LARGURAS AMOSTRADAS.
 *
 * A matriz de `paginas-publicas.spec.ts` mede sete larguras. Sete pontos de um
 * contínuo — e a divergência do CTA em 1024 px vivia inteira entre dois deles:
 * a faixa de duas linhas vai de 1024 a 1146 px, e NENHUMA das sete cai dentro de
 * 1025–1146. A estimativa que fizemos sem varrer errou o fim da faixa por três
 * vezes.
 *
 * É a lição da F01 aplicada ao eixo da largura: *cada verificação media
 * corretamente uma página incompleta.* Aqui cada verificação mede corretamente
 * sete pontos de um contínuo.
 *
 * ESTE TESTE É PERMANENTE, e não uma medição de uma vez. A medição que
 * estabeleceu a faixa está registrada no FIDELIDADE.md; o que fica aqui é a
 * única parte que pode REGREDIR: a promessa do Princípio 3 — "nenhuma página
 * gera rolagem horizontal em nenhuma largura" — no trecho onde a amostragem não
 * olha.
 *
 * CUSTO: roda em UM projeto só e numa página só. 33 passos, ~10 s. As
 * fronteiras exatas da faixa não são verificadas aqui de propósito: elas mudam
 * com renderização de fonte, e um teste que falha por 1 px de deriva vira ruído
 * que alguém desliga.
 */
import { expect, test } from '@playwright/test'

const PROJETO_RESPONSAVEL = 'largura-1280'
const INICIO = 1024
const FIM = 1280
const PASSO = 8

test('não há rolagem horizontal entre as larguras que a matriz amostra', async ({
  page,
}, informacoes) => {
  test.skip(
    informacoes.project.name !== PROJETO_RESPONSAVEL,
    `a varredura roda uma vez, no projeto ${PROJETO_RESPONSAVEL}`
  )

  const comRolagem: string[] = []
  let passos = 0

  for (let largura = INICIO; largura <= FIM; largura += PASSO) {
    await page.setViewportSize({ width: largura, height: 900 })
    await page.goto('/')
    const medida = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    passos += 1
    if (medida.scrollWidth > medida.clientWidth) {
      comRolagem.push(`${largura}px: ${medida.scrollWidth} > ${medida.clientWidth}`)
    }
  }

  console.log(
    `Varredura ${INICIO}–${FIM} px, passo ${PASSO}: ${passos} larguras medidas · ` +
      `com rolagem horizontal: ${comRolagem.length}`
  )
  expect(passos, 'a varredura nao mediu nada').toBeGreaterThan(0)
  expect(comRolagem, comRolagem.join(' | ')).toEqual([])
})
