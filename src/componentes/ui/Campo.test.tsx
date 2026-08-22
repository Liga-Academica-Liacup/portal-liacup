import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Campo } from './Campo'

describe('Campo', () => {
  it('associa o rotulo ao controle', () => {
    render(<Campo rotulo="Seu nome" />)
    const controle = screen.getByLabelText('Seu nome')
    expect(controle).toBeInTheDocument()
    expect(controle.tagName).toBe('INPUT')
  })

  it('liga o texto de ajuda ao controle', () => {
    render(<Campo rotulo="E-mail" ajuda="Usamos so para responder voce." />)
    const controle = screen.getByLabelText('E-mail')
    const ajuda = screen.getByText('Usamos so para responder voce.')
    expect(controle.getAttribute('aria-describedby')).toContain(ajuda.id)
  })

  it('anuncia o erro e marca o controle como invalido', () => {
    render(<Campo rotulo="E-mail" erro="Informe um e-mail valido." />)
    const controle = screen.getByLabelText('E-mail')
    const erro = screen.getByRole('alert')
    expect(controle).toHaveAttribute('aria-invalid', 'true')
    expect(controle.getAttribute('aria-describedby')).toContain(erro.id)
    expect(erro).toHaveAttribute('aria-live', 'polite')
  })

  it('o erro nao depende so de cor: tem texto e icone', () => {
    render(<Campo rotulo="E-mail" erro="Informe um e-mail valido." />)
    const erro = screen.getByRole('alert')
    expect(erro).toHaveTextContent('Informe um e-mail valido.')
    expect(erro.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('nao marca como invalido quando nao ha erro', () => {
    render(<Campo rotulo="Seu nome" />)
    expect(screen.getByLabelText('Seu nome')).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('junta ajuda e erro no mesmo aria-describedby', () => {
    render(<Campo rotulo="E-mail" ajuda="Sem espacos." erro="Invalido." />)
    const descritoPor = screen.getByLabelText('E-mail').getAttribute('aria-describedby') ?? ''
    expect(descritoPor.split(' ')).toHaveLength(2)
  })

  it('dois campos com o mesmo rotulo nao colidem', () => {
    render(
      <>
        <Campo rotulo="Nome" />
        <Campo rotulo="Nome" />
      </>
    )
    const campos = screen.getAllByLabelText('Nome')
    expect(campos).toHaveLength(2)
    expect(campos[0]?.id).not.toBe(campos[1]?.id)
  })

  it('mantem o rotulo para leitor de tela quando escondido da tela', () => {
    render(<Campo rotulo="Buscar" rotuloEscondido />)
    expect(screen.getByLabelText('Buscar')).toBeInTheDocument()
    expect(screen.getByText('Buscar').className).toContain('rotuloEscondido')
  })

  it('desenha textarea quando o tipo pede', () => {
    render(<Campo rotulo="Mensagem" tipo="textarea" />)
    expect(screen.getByLabelText('Mensagem').tagName).toBe('TEXTAREA')
  })

  it('desenha input de e-mail quando o tipo pede', () => {
    render(<Campo rotulo="E-mail" tipo="email" />)
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email')
  })

  it('desabilitado: perceptivel programaticamente e fora da ordem de tabulacao', () => {
    render(<Campo rotulo="Nome" desabilitado />)
    const controle = screen.getByLabelText('Nome')
    expect(controle).toBeDisabled()
    controle.focus()
    expect(controle).not.toHaveFocus()
  })

  it('erro e desabilitado ao mesmo tempo: o erro continua visivel', () => {
    render(<Campo rotulo="Nome" erro="Campo obrigatorio." desabilitado />)
    expect(screen.getByLabelText('Nome')).toBeDisabled()
    expect(screen.getByRole('alert')).toHaveTextContent('Campo obrigatorio.')
  })

  it('e alcancavel por Tab quando habilitado', () => {
    render(<Campo rotulo="Nome" />)
    const controle = screen.getByLabelText('Nome')
    controle.focus()
    expect(controle).toHaveFocus()
  })

  it('avisa quem o usa quando o valor muda', () => {
    const aoMudar = vi.fn()
    render(<Campo rotulo="Nome" valor="" aoMudar={aoMudar} />)
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } })
    expect(aoMudar).toHaveBeenCalledWith('Ana')
  })
})
