import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Cartao } from './Cartao'

describe('Cartao', () => {
  it('desenha o cartao completo', () => {
    render(
      <Cartao>
        <Cartao.Kicker>Noticia</Cartao.Kicker>
        <Cartao.Titulo>Jornada do Julho Verde</Cartao.Titulo>
        <Cartao.Corpo>Um resumo curto do que aconteceu.</Cartao.Corpo>
        <Cartao.Meta>20/08/2026</Cartao.Meta>
      </Cartao>
    )
    expect(screen.getByRole('heading', { name: 'Jornada do Julho Verde' })).toBeInTheDocument()
    expect(screen.getByText('Noticia')).toBeInTheDocument()
    expect(screen.getByText('20/08/2026')).toBeInTheDocument()
  })

  it('aguenta cartao sem titulo', () => {
    render(
      <Cartao>
        <Cartao.Corpo>So corpo.</Cartao.Corpo>
      </Cartao>
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('So corpo.')).toBeInTheDocument()
  })

  it('aguenta cartao sem corpo', () => {
    render(
      <Cartao>
        <Cartao.Titulo>So titulo</Cartao.Titulo>
      </Cartao>
    )
    expect(screen.getByRole('heading', { name: 'So titulo' })).toBeInTheDocument()
  })

  it('aguenta cartao so com meta', () => {
    render(
      <Cartao>
        <Cartao.Meta>Somente metadados</Cartao.Meta>
      </Cartao>
    )
    expect(screen.getByText('Somente metadados')).toBeInTheDocument()
  })

  it.each([2, 3, 4, 5, 6] as const)('usa h%i quando o nivel e informado', (nivel) => {
    render(
      <Cartao>
        <Cartao.Titulo nivel={nivel}>Titulo</Cartao.Titulo>
      </Cartao>
    )
    expect(screen.getByRole('heading', { level: nivel })).toBeInTheDocument()
  })

  it('usa h3 por padrao', () => {
    render(
      <Cartao>
        <Cartao.Titulo>Padrao</Cartao.Titulo>
      </Cartao>
    )
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it.each(['sm', 'md', 'lg'] as const)('aplica a elevacao %s', (elevacao) => {
    const { container } = render(
      <Cartao elevacao={elevacao}>
        <Cartao.Corpo>x</Cartao.Corpo>
      </Cartao>
    )
    expect(container.querySelector('article')?.className).toContain(elevacao)
  })

  it('nao aplica sombra quando a elevacao e nenhuma', () => {
    const { container } = render(
      <Cartao>
        <Cartao.Corpo>x</Cartao.Corpo>
      </Cartao>
    )
    const classes = container.querySelector('article')?.className ?? ''
    expect(classes).toContain('cartao')
    expect(classes.split(' ').length).toBe(1)
  })
})
