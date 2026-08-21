/*
 * Teste de unidade de componente da camada base.
 * A secao 7 dos padroes exige isto para todo componente de ui/, em toda feature.
 * Este arquivo e o modelo do formato.
 */
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Botao } from './Botao'

/*
 * Usamos fireEvent, que ja vem no @testing-library/react. O @testing-library/user-event
 * simularia o usuario com mais fidelidade, mas seria uma 21a dependencia — e a tabela
 * do plan.md fecha em 20. Dependencia nova se justifica antes de entrar, nao depois.
 */

describe('Botao', () => {
  it('desenha o conteudo que recebe', () => {
    render(<Botao>Enviar mensagem</Botao>)
    expect(screen.getByRole('button', { name: 'Enviar mensagem' })).toBeInTheDocument()
  })

  it('responde ao clique', () => {
    const aoClicar = vi.fn()
    render(<Botao onClick={aoClicar}>Confirmar</Botao>)
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
    expect(aoClicar).toHaveBeenCalledTimes(1)
  })

  it('usa a variante primaria quando nenhuma e informada', () => {
    render(<Botao>Padrao</Botao>)
    expect(screen.getByRole('button').className).toContain('primario')
  })

  it('respeita a variante informada', () => {
    render(<Botao variante="fantasma">Fantasma</Botao>)
    const botao = screen.getByRole('button')
    expect(botao.className).toContain('fantasma')
    expect(botao.className).not.toContain('primario')
  })

  it('nao dispara clique quando desabilitado', () => {
    const aoClicar = vi.fn()
    render(
      <Botao onClick={aoClicar} disabled>
        Desabilitado
      </Botao>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(aoClicar).not.toHaveBeenCalled()
  })

  it('e um button de verdade, nao uma div com onClick', () => {
    render(<Botao>Semantico</Botao>)
    expect(screen.getByRole('button').tagName).toBe('BUTTON')
  })
})
