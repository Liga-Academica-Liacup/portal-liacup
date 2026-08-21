/*
 * Teste de unidade do componente de icone.
 * A secao 7 dos padroes exige teste para todo componente de ui/.
 */
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Icone } from './Icone'

describe('Icone', () => {
  it('desenha a variante pedida', () => {
    const { container } = render(<Icone nome="instagram" />)
    expect(container.querySelector('svg')).toHaveAttribute('data-icone', 'instagram')
  })

  it('desenha desenhos diferentes para nomes diferentes', () => {
    const instagram = render(<Icone nome="instagram" />).container.innerHTML
    const email = render(<Icone nome="email" />).container.innerHTML
    expect(instagram).not.toEqual(email)
  })

  it('e escondido de leitor de tela, porque o texto do link ja diz tudo', () => {
    const { container } = render(<Icone nome="email" />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('fica fora da ordem de tabulacao', () => {
    const { container } = render(<Icone nome="email" />)
    expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false')
  })
})
