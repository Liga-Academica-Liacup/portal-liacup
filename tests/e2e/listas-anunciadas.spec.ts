import { expect, test } from '@playwright/test'
import { PAGINAS_PUBLICAS } from '../../src/lib/utils/paginas-publicas'

/*
 * LISTA SEM MARCADOR VISÍVEL CONTINUA ANUNCIADA COMO LISTA (pagina-sobre-e-
 * equipe, design.md D7 e D9, item 2; spec navegacao-publica, requisito "Lista
 * sem marcador visível continua anunciada como lista").
 *
 * O Safari do iPhone tira o papel de lista de toda <ul> e <ol> sem marcador
 * desenhado, e o VoiceOver deixa de dizer "lista, 5 itens". O Chromium, onde
 * este spec roda, não faz isso, então a árvore de acessibilidade dele não
 * serviria de medida: o que se mede é o que faz o WebKit manter o papel, o
 * atributo role="list" escrito na lista.
 *
 * Percorre as páginas da lista única (src/lib/utils/paginas-publicas.json), e
 * não uma lista copiada aqui: página nova passa a ser conferida sozinha. Em
 * cada página, toda <ul>, <ol> e <menu> do documento, inclusive as do menu
 * lateral fechado, que aparecem quando ele abre. "Sem marcador visível" é
 * medido no estilo calculado de cada item: nenhum item com display list-item
 * e um list-style-type ou list-style-image que desenhe marcador.
 *
 * Imprime quantas listas conferiu em cada página (RP-12).
 */

type ListaLida = {
  descricao: string
  semMarcador: boolean
  comPapel: boolean
}

test('toda lista sem marcador visível declara role="list", em cada página da lista', async ({
  page,
}, informacoes) => {
  const falhas: string[] = []
  const linhas: string[] = []
  let total = 0
  let semMarcador = 0
  let paginas = 0

  for (const { endereco } of PAGINAS_PUBLICAS) {
    await page.goto(endereco)
    const listas: ListaLida[] = await page.evaluate(() =>
      Array.from(document.body.querySelectorAll('ul, ol, menu')).map((lista) => {
        const itens = Array.from(lista.children).filter((filho) => filho.tagName === 'LI')
        const desenhaMarcador = (li: Element) => {
          const estilo = getComputedStyle(li)
          return (
            estilo.display.includes('list-item') &&
            (estilo.listStyleType !== 'none' || estilo.listStyleImage !== 'none')
          )
        }
        const regiao = lista.closest('dialog')
          ? 'menu lateral'
          : lista.closest('header')
            ? 'cabeçalho'
            : lista.closest('footer')
              ? 'rodapé'
              : lista.closest('main')
                ? 'conteúdo'
                : 'fora das regiões'
        const titulo =
          lista.closest('section, nav')?.querySelector('h2, h3')?.textContent ??
          lista.closest('nav')?.getAttribute('aria-label') ??
          ''
        const primeiro = (itens[0]?.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 30)
        return {
          descricao:
            `<${lista.tagName.toLowerCase()}> no ${regiao}` +
            `${titulo ? `, em "${titulo.trim()}"` : ''}, ${itens.length} itens, o 1º "${primeiro}"`,
          semMarcador: itens.length > 0 && !itens.some(desenhaMarcador),
          comPapel: lista.getAttribute('role') === 'list',
        }
      })
    )
    const daPagina = listas.filter((l) => l.semMarcador)
    const semPapel = daPagina.filter((l) => !l.comPapel)
    for (const lista of semPapel)
      falhas.push(`${endereco}: lista sem marcador e sem role="list": ${lista.descricao}`)
    total += listas.length
    semMarcador += daPagina.length
    if (daPagina.length > 0) paginas += 1
    linhas.push(
      `${endereco}: listas no documento: ${listas.length} · sem marcador visível conferidas: ${daPagina.length}` +
        ` · com role="list": ${daPagina.length - semPapel.length} · com marcador: ${listas.length - daPagina.length}`
    )
  }

  console.log(
    `[${informacoes.project.name}] listas anunciadas conferidas em ${paginas} de ${PAGINAS_PUBLICAS.length} páginas` +
      ` · listas lidas: ${total} · sem marcador visível: ${semMarcador} · sem role="list": ${falhas.length}\n  ` +
      linhas.join('\n  ')
  )
  expect(falhas, `listas que o VoiceOver do iPhone não anuncia:\n${falhas.join('\n')}`).toEqual([])
  expect(paginas, 'toda página da lista tem pelo menos as listas da moldura').toBe(
    PAGINAS_PUBLICAS.length
  )
})
