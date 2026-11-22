import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { BorboletaDaLiga } from './BorboletaDaLiga'

describe('BorboletaDaLiga', () => {
  it('é decorativa: escondida do leitor de tela e fora da ordem de foco', () => {
    const { container } = render(<BorboletaDaLiga />)
    const desenho = container.querySelector('svg')
    expect(desenho?.getAttribute('aria-hidden')).toBe('true')
    expect(desenho?.getAttribute('focusable')).toBe('false')
  })

  it('recebe a classe de quem usa, junto com a própria', () => {
    const { container } = render(<BorboletaDaLiga className="de-quem-usa" />)
    const classes = container.querySelector('svg')?.getAttribute('class')?.split(' ') ?? []
    expect(classes).toContain('de-quem-usa')
    expect(classes.length).toBeGreaterThan(1)
  })
})
