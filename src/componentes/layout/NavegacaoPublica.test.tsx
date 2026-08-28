/*
 * Derivação da página atual (FR-016 · data-model §2).
 *
 * A COMPARAÇÃO É EXATA, e o teste do caminho sem correspondência é o que mais
 * importa aqui. Um `startsWith` marcaria `/noticias` quando a pessoa está em
 * `/noticias-antigas` — e "chutar o mais parecido" é pior que não marcar nada:
 * quem usa leitor de tela ouviria "página atual" numa página que não é.
 */
import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { DESTINOS_PUBLICOS } from './destinos-publicos'

const caminhoSimulado = vi.hoisted(() => ({ atual: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => caminhoSimulado.atual }))

import { NavegacaoPublica } from './NavegacaoPublica'

/* O <dialog> do jsdom não implementa showModal; o painel não é o objeto deste
   teste, e a derivação acontece igual com ele fechado. */
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true
    }
    HTMLDialogElement.prototype.close = function () {
      this.open = false
      this.dispatchEvent(new Event('close'))
    }
  }
})

function marcados() {
  return screen
    .getAllByRole('link')
    .filter((link) => link.getAttribute('aria-current') === 'page')
    .map((link) => link.textContent)
}

describe('NavegacaoPublica — página atual', () => {
  it.each(DESTINOS_PUBLICOS.map((d) => [d.caminho, d.rotulo]))(
    'marca exatamente um destino em %s',
    (caminho, rotulo) => {
      caminhoSimulado.atual = caminho as string
      render(<NavegacaoPublica />)

      const atuais = marcados()
      // Os destinos do menu aparecem na navegacao direta e no painel; a conversao
      // aparece uma vez. Em ambos os casos deve haver UM destino semantico atual.
      expect(new Set(atuais).size).toBe(1)
      expect(atuais[0]).toBe(rotulo)
    }
  )

  it('não marca nada num caminho fora do catálogo', () => {
    caminhoSimulado.atual = '/noticias-antigas'
    render(<NavegacaoPublica />)

    const atuais = marcados()
    console.log(
      `/noticias-antigas · caminho fora do catálogo · destinos marcados: ${atuais.length}`
    )
    expect(atuais).toEqual([])
  })

  it('não marca por prefixo: /projetos não é marcado em /projetos-antigos', () => {
    caminhoSimulado.atual = '/projetos-antigos'
    render(<NavegacaoPublica />)

    const atuais = marcados()
    console.log(
      `/projetos-antigos · caminho fora do catálogo · destinos marcados: ${atuais.length}`
    )
    expect(atuais).toEqual([])
  })

  it('o botão do painel anuncia o estado e a região que controla', () => {
    caminhoSimulado.atual = '/'
    render(<NavegacaoPublica />)

    const botao = screen.getByRole('button', { name: 'Abrir menu de navegação' })
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(botao).toHaveAttribute('aria-controls', 'painel-de-navegacao')
  })
})
