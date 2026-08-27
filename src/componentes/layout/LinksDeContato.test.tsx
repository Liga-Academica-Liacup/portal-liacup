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

  /*
   * Cobra o NOME ACESSÍVEL EXPOSTO, não a presença do atributo.
   *
   * A versão anterior deste teste fazia
   * `expect(endereco?.getAttribute('aria-label')).toBe(...)`, e isso prova que o
   * atributo está no DOM — não que ele é anunciado. As duas coisas produzem
   * exatamente o mesmo atributo, então o teste não conseguia distingui-las. É
   * verificação de configuração, no formato mais inocente possível.
   *
   * `getByRole` computa papel e nome acessível pelas regras da especificação, do
   * mesmo jeito que o leitor de tela. Se alguém trocar o elemento por um que não
   * admita nomeação, ou tirar o rótulo, este teste falha; o anterior passaria.
   *
   * MEDIDO em 27/08/2026, porque a dúvida era legítima e três ferramentas não
   * concordam:
   *   - árvore do Chrome (CDP `Accessibility.getFullAXTree`):
   *     `role="group" name="Canais de contato da LIACUP" ignorado=false`;
   *   - axe-core, regra `aria-prohibited-attr` (tags `wcag2a`, `wcag412`):
   *     **0 ocorrências** — não considera o rótulo proibido aqui;
   *   - `getByRole` do Playwright: não enxerga o elemento, porque não mapeia
   *     `<address>` para `group`.
   *
   * A árvore do navegador é a que decide o que o leitor de tela recebe, e ela
   * expõe o nome. A divergência do Playwright fica registrada para ninguém
   * "consertar" isto de novo a partir da ferramenta errada.
   */
  it('expõe o bloco de contato com nome acessível', () => {
    render(<LinksDeContato />)

    expect(screen.getByRole('group', { name: 'Canais de contato da LIACUP' })).toBeInTheDocument()
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
