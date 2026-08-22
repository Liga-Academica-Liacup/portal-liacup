import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Etiqueta } from './Etiqueta'

describe('Etiqueta', () => {
  it('desenha o texto que recebe', () => {
    render(<Etiqueta>Extensao</Etiqueta>)
    expect(screen.getByText('Extensao')).toBeInTheDocument()
  })

  it('usa a variante neutra por padrao', () => {
    render(<Etiqueta>Padrao</Etiqueta>)
    expect(screen.getByText('Padrao').className).toContain('neutra')
  })

  it.each(['destaque', 'apoio', 'neutra', 'contorno'] as const)(
    'respeita a variante %s',
    (variante) => {
      render(<Etiqueta variante={variante}>Rotulo</Etiqueta>)
      expect(screen.getByText('Rotulo').className).toContain(variante)
    }
  )

  it('aguenta texto longo sem virar outro elemento', () => {
    const longo = 'Cuidados paliativos na atencao primaria a saude da pessoa idosa'
    render(<Etiqueta>{longo}</Etiqueta>)
    expect(screen.getByText(longo).tagName).toBe('SPAN')
  })

  it('nao e interativa: sem papel de botao e fora da ordem de tabulacao', () => {
    render(<Etiqueta>Classificacao</Etiqueta>)
    const etiqueta = screen.getByText('Classificacao')
    expect(etiqueta).not.toHaveAttribute('role')
    expect(etiqueta).not.toHaveAttribute('tabindex')
  })
})
