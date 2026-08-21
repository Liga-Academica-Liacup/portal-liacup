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
})
