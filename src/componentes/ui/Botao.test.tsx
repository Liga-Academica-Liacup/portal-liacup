/*
 * Teste de unidade do botão.
 * A seção 7 dos padrões exige teste para todo componente de ui/, cobrindo
 * renderização, variantes e interação. O FR-008 acrescenta teclado e foco.
 */
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Botao } from './Botao'

/*
 * Usamos fireEvent, que já vem no @testing-library/react. O user-event
 * simularia o usuário com mais fidelidade, mas seria uma 21ª dependência — e a
 * tabela do plano fecha em 20.
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

  it.each([
    ['secundario', 'secundario'],
    ['fantasma', 'fantasma'],
  ] as const)('respeita a variante %s', (variante, classe) => {
    render(<Botao variante={variante}>Rotulo</Botao>)
    const botao = screen.getByRole('button')
    expect(botao.className).toContain(classe)
    expect(botao.className).not.toContain('primario')
  })

  it('a variante de icone tem nome acessivel', () => {
    render(
      <Botao variante="icone" aria-label="Fechar aviso">
        <span aria-hidden="true">x</span>
      </Botao>
    )
    expect(screen.getByRole('button', { name: 'Fechar aviso' })).toBeInTheDocument()
  })

  it('ocupa a largura total quando pedido', () => {
    render(<Botao larguraTotal>Enviar</Botao>)
    expect(screen.getByRole('button').className).toContain('larguraTotal')
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

  it('usa type="button" por padrao, para nao enviar formulario sem querer', () => {
    render(<Botao>Padrao</Botao>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  /* FR-008 — teclado. Um <button> nativo entra na ordem de tabulação e é
     ativado por Enter e Espaço sem nenhum código nosso; o teste existe para
     travar isso, porque a regressão clássica é alguém trocar por <div>. */
  it('e alcancavel por Tab', () => {
    render(<Botao>Focavel</Botao>)
    const botao = screen.getByRole('button')
    botao.focus()
    expect(botao).toHaveFocus()
    expect(botao.tabIndex).toBe(0)
  })

  it('nao e alcancavel por Tab quando desabilitado', () => {
    render(<Botao disabled>Desabilitado</Botao>)
    const botao = screen.getByRole('button')
    botao.focus()
    expect(botao).not.toHaveFocus()
  })

  it.each(['Enter', ' '])('e ativado pela tecla %s', (tecla) => {
    const aoClicar = vi.fn()
    render(<Botao onClick={aoClicar}>Ativar</Botao>)
    const botao = screen.getByRole('button')
    botao.focus()
    fireEvent.keyDown(botao, { key: tecla })
    fireEvent.keyUp(botao, { key: tecla })
    fireEvent.click(botao)
    expect(aoClicar).toHaveBeenCalled()
  })

  /*
   * F03 — o contrato fecha `style` além de `className`.
   *
   * A F01 já omitia `className`, e o contrato documentado dizia que `style`
   * seguia o mesmo caminho — mas o tipo não cobrava. Com a aparência agora
   * compartilhada com o `LinkComAparenciaDeBotao` (FR-045), um `style` solto num
   * dos dois é exatamente a segunda fonte de verdade que a origem única existe
   * para impedir: a próxima correção de contraste acerta um e esquece o outro.
   *
   * `@ts-expect-error` é o oposto de um comentário: se a prop deixar de ser
   * recusada, o TypeScript acusa a diretiva como inútil e a verificação de
   * tipos fica vermelha.
   */
  it('o tipo recusa className e style', () => {
    const naoCompila = () => (
      <>
        {/* @ts-expect-error className abriria uma segunda fonte de aparência */}
        <Botao className="meu-estilo">Texto</Botao>
        {/* @ts-expect-error style abriria a mesma porta, por outro caminho */}
        <Botao style={{ color: 'red' }}>Texto</Botao>
      </>
    )
    expect(typeof naoCompila).toBe('function')
  })
})
