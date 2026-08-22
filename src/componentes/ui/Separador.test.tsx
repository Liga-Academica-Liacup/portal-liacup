import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Separador } from './Separador'

describe('Separador', () => {
  it('e decorativo por padrao: nao e anunciado', () => {
    const { container } = render(<Separador />)
    const elemento = container.firstElementChild
    expect(elemento?.getAttribute('role')).toBe('presentation')
    expect(container.querySelector('hr')).not.toBeInTheDocument()
  })

  it('vira separador semantico quando a divisao e informacao', () => {
    const { container } = render(<Separador decorativo={false} />)
    expect(container.querySelector('hr')).toBeInTheDocument()
    expect(container.firstElementChild?.getAttribute('role')).toBeNull()
  })
})
