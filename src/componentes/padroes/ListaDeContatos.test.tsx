import { render, screen, within } from '@testing-library/react'
import { afterAll, describe, expect, it } from 'vitest'
import { CONTATO_DA_LIGA } from './contato-da-liga'
import { ListaDeContatos } from './ListaDeContatos'
import { QuadroDoEmail } from './QuadroDoEmail'
import { QuadroDoInstagram } from './QuadroDoInstagram'
import { QuadroOndeEstamos } from './QuadroOndeEstamos'

/*
 * Confere o bloco de contato (design.md da change pagina-contato, D5): a lista
 * com os três quadros, como na página Contato, e com só Instagram e E-mail,
 * como a inicial vai usar; os destinos dos dois links; e que nenhum texto traz
 * o travessão nem um dado errado do protótipo (REFERENCIA-VISUAL.md, seção 6).
 *
 * Se o texto bate com o docs/conteudo-institucional.md, quem confere é o teste
 * de ponta a ponta, que lê o documento e a página publicada.
 *
 * As contagens saem impressas no fim: sem elas, "nada falhou" e "nada foi
 * conferido" dão a mesma saída (RP-12).
 */
let quadrosDaPagina = 0
let quadrosDaInicial = 0

/** O que não pode aparecer em texto nenhum do bloco. */
const TERMOS_PROIBIDOS = ['—', 'liacup@unb.br', 'Darcy Ribeiro', 'Faculdade de Medicina']

function renderizarAPagina() {
  return render(
    <ListaDeContatos>
      <QuadroDoInstagram />
      <QuadroDoEmail />
      <QuadroOndeEstamos />
    </ListaDeContatos>
  )
}

describe('bloco de contato', () => {
  it('a lista da página Contato tem os três quadros, na ordem Instagram, E-mail, Onde estamos', () => {
    renderizarAPagina()
    const itens = within(screen.getByRole('list')).getAllByRole('listitem')
    quadrosDaPagina = itens.length
    expect(itens.map((item) => item.textContent)).toEqual([
      expect.stringMatching(/^Instagram\s*@liacup\.unb/),
      expect.stringMatching(/^E-mail\s*liacup\.unb@gmail\.com$/),
      expect.stringMatching(/^Onde estamos\s*FCTS · Campus UnB Ceilândia/),
    ])
  })

  it('a composição da inicial tem só Instagram e E-mail, sem copiar nada', () => {
    render(
      <ListaDeContatos>
        <QuadroDoInstagram />
        <QuadroDoEmail />
      </ListaDeContatos>
    )
    const itens = within(screen.getByRole('list')).getAllByRole('listitem')
    quadrosDaInicial = itens.length
    expect(itens).toHaveLength(2)
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('o Instagram abre o perfil em nova aba, sem acesso à página de origem nem o endereço dela', () => {
    renderizarAPagina()
    const link = screen.getByRole('link', { name: /^Instagram @liacup\.unb/ })
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/liacup.unb/')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')?.split(' ')).toEqual(
      expect.arrayContaining(['noopener', 'noreferrer'])
    )
    expect(link).toHaveAccessibleName('Instagram @liacup.unb (abre em nova aba)')
  })

  it('o e-mail abre um e-mail novo para o endereço da liga, na mesma aba', () => {
    renderizarAPagina()
    const link = screen.getByRole('link', { name: /^E-mail liacup\.unb@gmail\.com/ })
    expect(link).toHaveAttribute('href', 'mailto:liacup.unb@gmail.com')
    expect(link).not.toHaveAttribute('target')
    expect(link).toHaveAccessibleName('E-mail liacup.unb@gmail.com')
  })

  it('"Onde estamos" é texto, e não link, e as imagens são decorativas', () => {
    const { container } = renderizarAPagina()
    expect(screen.getAllByRole('link')).toHaveLength(2)
    const endereco = screen.getByText(CONTATO_DA_LIGA.sede.valor)
    expect(endereco.closest('a')).toBeNull()
    for (const imagem of container.querySelectorAll('img')) {
      expect(imagem).toHaveAttribute('alt', '')
    }
    expect(screen.queryAllByRole('img')).toHaveLength(0)
  })

  it('nenhum texto do bloco tem travessão nem dado errado do protótipo', () => {
    const { container } = renderizarAPagina()
    const texto = container.textContent ?? ''
    const achados = TERMOS_PROIBIDOS.filter((termo) => texto.includes(termo))
    expect(achados, 'termos proibidos achados no bloco').toEqual([])
    const dados = Object.values(CONTATO_DA_LIGA).flatMap((canal) => Object.values(canal))
    const nosDados = TERMOS_PROIBIDOS.filter((termo) => dados.some((dado) => dado.includes(termo)))
    expect(nosDados, 'termos proibidos achados em contato-da-liga.ts').toEqual([])
  })

  /*
   * process.stdout, e não console.log: o Vitest esconde o console.log de um
   * afterAll, e a contagem precisa aparecer na saída de `npm test`.
   */
  afterAll(() => {
    process.stdout.write(
      `quadros: ${quadrosDaPagina}\n` + `quadros na composição da inicial: ${quadrosDaInicial}\n`
    )
  })
})

/*
 * A apresentação "cartao" (change inicio-completo, design.md, D5; Q6 (a) do
 * Gabriel): a inicial usa os mesmos quadros, num cartão, e a página Contato,
 * sem o argumento, continua no "solto", sem a classe do cartão.
 */
let quadrosEmCartao = 0

describe('bloco de contato, apresentação cartão', () => {
  it('a composição da inicial em cartão tem Instagram e E-mail, cada um um link em cartão', () => {
    render(
      <ListaDeContatos>
        <QuadroDoInstagram apresentacao="cartao" />
        <QuadroDoEmail apresentacao="cartao" />
      </ListaDeContatos>
    )
    const itens = within(screen.getByRole('list')).getAllByRole('listitem')
    const links = screen.getAllByRole('link')
    quadrosEmCartao = links.filter((link) => link.className.includes('cartao')).length
    expect(itens).toHaveLength(2)
    expect(links).toHaveLength(2)
    expect(quadrosEmCartao).toBe(2)
    expect(links[0]).toHaveAccessibleName('Instagram @liacup.unb (abre em nova aba)')
    expect(links[0]).toHaveAttribute('href', 'https://www.instagram.com/liacup.unb/')
    expect(links[1]).toHaveAccessibleName('E-mail liacup.unb@gmail.com')
    expect(links[1]).toHaveAttribute('href', 'mailto:liacup.unb@gmail.com')
  })

  it('sem o argumento, nenhum quadro da página Contato ganha a classe do cartão', () => {
    const { container } = renderizarAPagina()
    const comCartao = [...container.querySelectorAll('li > *')].filter((quadro) =>
      quadro.className.includes('cartao')
    )
    expect(comCartao).toHaveLength(0)
  })

  afterAll(() => {
    process.stdout.write(`apresentação cartão: ${quadrosEmCartao}\n`)
  })
})
