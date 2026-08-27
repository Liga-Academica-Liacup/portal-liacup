/*
 * Contrato do link com aparência de botão.
 *
 * POR QUE ELE EXISTE
 * A conversão principal do site — "Processo seletivo" — precisa parecer um
 * botão e **navegar**. O `Botao` da F01 renderiza `<button>`, e o comentário
 * dele diz, em "QUANDO NÃO USAR", que navegação não é o papel dele: um
 * `<button>` que navega quebra o menu de contexto, o abrir em nova aba e o que
 * o leitor de tela anuncia.
 *
 * Faltava componente, e isso foi reportado como achado da feature (FR-030) em
 * vez de contornado com estilo solto. Três consumidores nomeados antes de ele
 * existir: o cabeçalho aqui, a chamada da home na F04 e o "Botão de inscrição"
 * que o `conteudo-institucional.md` §5.1 já especifica para a F12.
 *
 * AS RECUSAS SÃO COBRADAS PELO TIPO, e por isso aparecem como
 * `@ts-expect-error`. Essa diretiva é o oposto de um comentário: se a prop
 * DEIXAR de ser recusada, o TypeScript passa a acusar a diretiva como inútil e
 * `npm run verificar:tipos` fica vermelho. Estado impossível não compila —
 * mesma mecânica que a variante `icone` do `Botao` usa desde a F01.
 */
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LinkComAparenciaDeBotao } from './LinkComAparenciaDeBotao'

describe('LinkComAparenciaDeBotao', () => {
  it('é um <a> de verdade, não um <button> que navega', () => {
    render(
      <LinkComAparenciaDeBotao href="/processo-seletivo">Processo seletivo</LinkComAparenciaDeBotao>
    )

    const link = screen.getByRole('link', { name: 'Processo seletivo' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/processo-seletivo')
  })

  it('usa a variante primária quando nenhuma é informada', () => {
    render(<LinkComAparenciaDeBotao href="/x">Padrão</LinkComAparenciaDeBotao>)
    expect(screen.getByRole('link').className).toContain('primario')
  })

  it.each([
    ['secundario', 'secundario'],
    ['fantasma', 'fantasma'],
  ] as const)('respeita a variante %s', (variante, classe) => {
    render(
      <LinkComAparenciaDeBotao href="/x" variante={variante}>
        Rótulo
      </LinkComAparenciaDeBotao>
    )
    const link = screen.getByRole('link')
    expect(link.className).toContain(classe)
    expect(link.className).not.toContain('primario')
  })

  it('ocupa a largura total quando pedido', () => {
    render(
      <LinkComAparenciaDeBotao href="/x" larguraTotal>
        Enviar
      </LinkComAparenciaDeBotao>
    )
    expect(screen.getByRole('link').className).toContain('larguraTotal')
  })

  it('é alcançável por Tab, como qualquer link', () => {
    render(<LinkComAparenciaDeBotao href="/x">Focável</LinkComAparenciaDeBotao>)
    const link = screen.getByRole('link')
    link.focus()
    expect(link).toHaveFocus()
  })

  it('repassa atributos seguros de <a>', () => {
    render(
      <LinkComAparenciaDeBotao href="https://exemplo.org" target="_blank" rel="noopener noreferrer">
        Externo
      </LinkComAparenciaDeBotao>
    )
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  describe('o tipo recusa o que abriria buraco na origem única de aparência', () => {
    it('recusa className, style, icone e disabled', () => {
      // Nenhuma destas linhas roda: o valor da asserção é o próprio `tsc`.
      const naoCompila = () => (
        <>
          {/* @ts-expect-error className abriria uma segunda fonte de aparência (FR-045) */}
          <LinkComAparenciaDeBotao href="/x" className="meu-estilo" />
          {/* @ts-expect-error style abriria a mesma porta, por outro caminho */}
          <LinkComAparenciaDeBotao href="/x" style={{ color: 'red' }} />
          {/* @ts-expect-error não existe link-ícone: variante sem consumidor real */}
          <LinkComAparenciaDeBotao href="/x" variante="icone" />
          {/* @ts-expect-error link não desabilita: sem href não é navegação, é botão */}
          <LinkComAparenciaDeBotao href="/x" disabled />
          {/* @ts-expect-error href é obrigatório: link sempre navega */}
          <LinkComAparenciaDeBotao>Sem destino</LinkComAparenciaDeBotao>
        </>
      )
      expect(typeof naoCompila).toBe('function')
    })
  })
})
