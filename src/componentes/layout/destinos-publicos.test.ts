/*
 * Contrato do catálogo canônico de destinos públicos.
 *
 * POR QUE ESTE TESTE EXISTE
 * O FR-044 exige **uma lista e dois consumidores**: a navegação que a pessoa vê
 * e as verificações que medem as páginas. Duas listas mantidas em paralelo
 * divergem, e aqui a divergência seria silenciosa e verde — uma página fora da
 * verificação não faz nada falhar.
 *
 * Este arquivo defende as invariantes de `data-model.md`, seção 1. O SC-017
 * defende a outra metade, no teste de ponta a ponta: número de páginas
 * verificadas igual ao número de destinos entregues.
 */
import { describe, expect, it } from 'vitest'
import { DESTINOS_PUBLICOS, conversaoPrincipal, caminhosPublicos } from './destinos-publicos'

describe('catálogo de destinos públicos', () => {
  it('tem exatamente dez destinos', () => {
    // Reporta o número, não só a comparação: verificação que não diz quanto
    // mediu não distingue "nada falhou" de "nada foi medido" (RP-12).
    console.log(`Destinos no catálogo: ${DESTINOS_PUBLICOS.length}`)
    expect(DESTINOS_PUBLICOS).toHaveLength(10)
  })

  it('traz os dez rótulos e caminhos aprovados, na ordem do data-model', () => {
    expect(DESTINOS_PUBLICOS.map((destino) => [destino.rotulo, destino.caminho])).toEqual([
      ['Início', '/'],
      ['Sobre', '/sobre'],
      ['Notícias', '/noticias'],
      ['Conteúdo educativo', '/conteudo-educativo'],
      ['Eventos', '/eventos'],
      ['Projetos', '/projetos'],
      ['Materiais', '/materiais'],
      ['Galeria', '/galeria'],
      ['Processo seletivo', '/processo-seletivo'],
      ['Contato', '/contato'],
    ])
  })

  it('não repete rótulo nem caminho', () => {
    const rotulos = new Set(DESTINOS_PUBLICOS.map((destino) => destino.rotulo))
    const caminhos = new Set(DESTINOS_PUBLICOS.map((destino) => destino.caminho))
    console.log(`Rótulos únicos: ${rotulos.size} · caminhos únicos: ${caminhos.size}`)
    expect(rotulos.size).toBe(DESTINOS_PUBLICOS.length)
    expect(caminhos.size).toBe(DESTINOS_PUBLICOS.length)
  })

  it('usa rótulo não vazio em todos os destinos', () => {
    for (const destino of DESTINOS_PUBLICOS) {
      expect(destino.rotulo.trim()).not.toBe('')
    }
  })

  it('usa caminho absoluto e sem barra final, exceto a raiz', () => {
    for (const destino of DESTINOS_PUBLICOS) {
      expect(destino.caminho.startsWith('/')).toBe(true)
      if (destino.caminho !== '/') {
        expect(destino.caminho.endsWith('/')).toBe(false)
      }
    }
  })

  it('tem exatamente uma conversão principal, e ela é o processo seletivo', () => {
    const conversoes = DESTINOS_PUBLICOS.filter((destino) => destino.ehConversaoPrincipal)
    console.log(`Conversões principais declaradas: ${conversoes.length}`)
    expect(conversoes).toHaveLength(1)
    expect(conversaoPrincipal.caminho).toBe('/processo-seletivo')
    expect(conversaoPrincipal.rotulo).toBe('Processo seletivo')
  })

  it('expõe os caminhos na mesma ordem do catálogo', () => {
    expect(caminhosPublicos).toEqual(DESTINOS_PUBLICOS.map((destino) => destino.caminho))
  })

  it('entrega o catálogo congelado, para nenhum consumidor alterá-lo', () => {
    // Duas listas divergem; uma lista mutável vira duas sem ninguém notar.
    expect(Object.isFrozen(DESTINOS_PUBLICOS)).toBe(true)
    expect(DESTINOS_PUBLICOS.every((destino) => Object.isFrozen(destino))).toBe(true)
  })
})
