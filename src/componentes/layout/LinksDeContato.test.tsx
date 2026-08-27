import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LinksDeContato } from './LinksDeContato'

describe('LinksDeContato', () => {
  it('exibe os dois canais de contato da liga', () => {
    render(<LinksDeContato />)

    expect(screen.getByRole('link', { name: '@liacup.unb' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'liacup.unb@gmail.com' })).toBeInTheDocument()
  })

  it('aponta cada canal para o endereco correto', () => {
    render(<LinksDeContato />)

    expect(screen.getByRole('link', { name: '@liacup.unb' })).toHaveAttribute(
      'href',
      'https://www.instagram.com/liacup.unb/'
    )
    expect(screen.getByRole('link', { name: 'liacup.unb@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:liacup.unb@gmail.com'
    )
  })

  it('protege o link externo do Instagram', () => {
    render(<LinksDeContato />)

    expect(screen.getByRole('link', { name: '@liacup.unb' })).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    )
  })

  /*
   * A partir da F03 este componente mora dentro do rodapé, e a semântica muda
   * por causa disso.
   *
   * Ele era um `<nav>`, o que fazia sentido quando vivia solto no `<main>` da
   * página provisória. Dentro do `<footer>` ele cria um SEGUNDO landmark de
   * navegação na página, e o FR-020 exige exatamente uma região de cada papel.
   * Dois landmarks de navegação obrigam quem usa leitor de tela a adivinhar
   * qual é o menu do site.
   *
   * `<address>` é o elemento certo pelo significado, não por conveniência: ele
   * existe para informação de contato do documento ou da seção — que é
   * literalmente o que estes dois links são.
   */
  it('usa o contêiner de contato, e não um segundo landmark de navegação', () => {
    const { container } = render(<LinksDeContato />)

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(container.querySelector('address')).not.toBeNull()
  })

  it('dá nome acessível ao bloco de contato', () => {
    // `address` não tem papel implícito, então o nome é cobrado pelo rótulo.
    const { container } = render(<LinksDeContato />)

    const endereco = container.querySelector('address')
    expect(endereco?.getAttribute('aria-label')).toBe('Canais de contato da LIACUP')
  })

  it('não escreve nenhum endereço além dos dois confirmados', () => {
    // FR-023: nenhum e-mail, perfil ou telefone novo. O e-mail inventado do
    // protótipo não é escrito aqui — nem para ser testado contra.
    const { container } = render(<LinksDeContato />)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))

    console.log(`Canais de contato renderizados: ${hrefs.length}`)
    expect(hrefs).toEqual(['https://www.instagram.com/liacup.unb/', 'mailto:liacup.unb@gmail.com'])
  })
})
