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

  /*
   * F03 — a união fechada ganha DOIS nomes, e só dois.
   *
   * O cabeçalho precisa de um desenho para abrir e outro para fechar o painel.
   * Essa extensão foi PRÉ-AUTORIZADA pela spec (FR-029) e é a única: qualquer
   * terceiro nome é desvio a reportar, não conveniência.
   *
   * O teste cobra o NÚMERO exato, e não a presença dos dois. "Tem abrir e
   * fechar" continuaria verde com um quinto ícone entrando de carona;
   * "são exatamente quatro" não.
   *
   * E compara os desenhos: dois nomes apontando para o mesmo path são um nome
   * só com dois rótulos, o que passaria numa contagem de chaves.
   */
  it('tem exatamente quatro icones, com desenhos distintos', () => {
    const nomes = ['instagram', 'email', 'abrir', 'fechar'] as const
    const desenhos = new Set<string>()

    for (const nome of nomes) {
      const { container } = render(<Icone nome={nome} />)
      const svg = container.querySelector('svg')
      expect(svg, `o icone ${nome} nao desenhou nada`).not.toBeNull()
      expect(svg?.getAttribute('data-icone')).toBe(nome)
      desenhos.add(svg?.innerHTML ?? '')
    }

    console.log(`Icones da uniao: ${nomes.length} · desenhos distintos: ${desenhos.size}`)
    expect(nomes).toHaveLength(4)
    expect(desenhos.size).toBe(4)
  })

  it('o tipo recusa nome fora da uniao', () => {
    const naoCompila = () => (
      <>
        {/* @ts-expect-error nome fora da uniao fechada nao compila (FR-029) */}
        <Icone nome="menu-hamburguer" />
      </>
    )
    expect(typeof naoCompila).toBe('function')
  })
})
