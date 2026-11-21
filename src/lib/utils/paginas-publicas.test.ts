import { afterAll, describe, expect, it, vi } from 'vitest'
import {
  ENTRADAS_DA_LISTA,
  PAGINAS_PUBLICAS,
  estaNaLista,
  paginaDeDestaque,
  paginasDaColuna,
  paginasDoMenu,
  problemasDaLista,
} from './paginas-publicas'

/*
 * Confere a lista única das páginas públicas (design.md da layout-e-hero, D3).
 *
 * O primeiro teste é o que importa: ele lê o JSON de verdade e fica vermelho
 * nomeando a entrada errada. Os outros mostram que a conferência pega cada
 * problema, com listas inventadas aqui mesmo, para ninguém precisar estragar o
 * JSON para ver a conferência funcionar.
 *
 * O número de entradas conferidas sai impresso no fim: sem ele, "nada falhou"
 * e "nada foi conferido" dão a mesma saída (RP-12).
 */
let entradasConferidas = 0

const valida = {
  endereco: '/',
  rotulo: 'Início',
  noMenu: true,
  colunaDoRodape: 'Portal',
  destaque: false,
}

describe('lista de páginas públicas', () => {
  it('a lista do site não tem nenhum problema', () => {
    const problemas = problemasDaLista(ENTRADAS_DA_LISTA)
    entradasConferidas = ENTRADAS_DA_LISTA.length
    expect(problemas, `Problemas na lista: ${problemas.join('; ')}`).toEqual([])
    expect(ENTRADAS_DA_LISTA.length, 'a lista não pode estar vazia').toBeGreaterThan(0)
  })

  it('acusa endereço repetido, nomeando-o', () => {
    const problemas = problemasDaLista([valida, { ...valida, rotulo: 'Outra' }])
    expect(problemas).toEqual(['endereço "/" repetido'])
  })

  it('acusa endereço que não começa com "/"', () => {
    expect(problemasDaLista([{ ...valida, endereco: 'sobre' }])).toEqual([
      'endereço "sobre" não começa com "/"',
    ])
  })

  it('acusa rótulo vazio', () => {
    expect(problemasDaLista([{ ...valida, rotulo: '  ' }])).toEqual([
      'rótulo vazio no endereço "/"',
    ])
  })

  it('acusa coluna do rodapé desconhecida', () => {
    expect(problemasDaLista([{ ...valida, colunaDoRodape: 'Painel' }])).toEqual([
      'coluna do rodapé "Painel" desconhecida no endereço "/"',
    ])
  })

  it('acusa mais de uma página de destaque', () => {
    const problemas = problemasDaLista([
      { ...valida, endereco: '/a', destaque: true },
      { ...valida, endereco: '/b', destaque: true },
    ])
    expect(problemas).toEqual(['2 páginas de destaque ("/a", "/b"); o máximo é uma'])
  })

  it('as consultas leem a lista, e não uma cópia', () => {
    expect(paginasDoMenu()).toEqual(PAGINAS_PUBLICAS.filter((pagina) => pagina.noMenu))
    expect(paginasDaColuna('Portal')).toEqual(
      PAGINAS_PUBLICAS.filter((pagina) => pagina.colunaDoRodape === 'Portal')
    )
    expect(paginaDeDestaque()).toEqual(PAGINAS_PUBLICAS.find((pagina) => pagina.destaque))
    expect(estaNaLista('/')).toBe(PAGINAS_PUBLICAS.some((pagina) => pagina.endereco === '/'))
    expect(estaNaLista('/endereco-que-nao-existe')).toBe(false)
  })

  /*
   * Com a lista de verdade, que hoje tem uma entrada só, no menu e na coluna
   * "Portal", uma consulta que ignorasse o próprio filtro devolveria o mesmo
   * que a certa, e o teste de cima passaria (visto na rodada 5 do qa). Aqui o
   * módulo é carregado de novo lendo uma lista de teste no lugar do JSON, com
   * uma página em cada situação, e cada consulta tem de separar as dela.
   */
  it('cada consulta filtra pelo campo dela, numa lista de teste com uma página de cada tipo', async () => {
    const listaDeTeste = [
      { endereco: '/', rotulo: 'Início', noMenu: true, colunaDoRodape: 'Portal', destaque: false },
      {
        endereco: '/so-no-rodape',
        rotulo: 'Só no rodapé',
        noMenu: false,
        colunaDoRodape: 'Conteúdo',
        destaque: false,
      },
      {
        endereco: '/destaque',
        rotulo: 'Destaque',
        noMenu: true,
        colunaDoRodape: null,
        destaque: true,
      },
    ]
    const enderecos = (paginas: readonly { endereco: string }[]) =>
      paginas.map((pagina) => pagina.endereco)
    vi.resetModules()
    vi.doMock('./paginas-publicas.json', () => ({ default: listaDeTeste }))
    try {
      const modulo = await import('./paginas-publicas')
      expect(enderecos(modulo.PAGINAS_PUBLICAS), 'o módulo não leu a lista de teste').toEqual(
        enderecos(listaDeTeste)
      )
      expect(enderecos(modulo.paginasDoMenu()), 'paginasDoMenu').toEqual(['/', '/destaque'])
      expect(enderecos(modulo.paginasDaColuna('Portal')), 'coluna Portal').toEqual(['/'])
      expect(enderecos(modulo.paginasDaColuna('Conteúdo')), 'coluna Conteúdo').toEqual([
        '/so-no-rodape',
      ])
      expect(modulo.paginaDeDestaque()?.endereco, 'paginaDeDestaque').toBe('/destaque')
      expect(modulo.estaNaLista('/so-no-rodape'), 'estaNaLista, página da lista').toBe(true)
      expect(modulo.estaNaLista('/so-no'), 'estaNaLista, só o começo do endereço').toBe(false)
      expect(modulo.estaNaLista('/sobre'), 'estaNaLista, página fora da lista').toBe(false)
    } finally {
      vi.doUnmock('./paginas-publicas.json')
      vi.resetModules()
    }
  })

  it('a lista vem congelada, para nenhum componente alterá-la', () => {
    expect(Object.isFrozen(PAGINAS_PUBLICAS)).toBe(true)
    expect(PAGINAS_PUBLICAS.every((pagina) => Object.isFrozen(pagina))).toBe(true)
  })

  /*
   * process.stdout, e não console.log: o Vitest esconde o console.log de um
   * afterAll, e o contador precisa aparecer na saída de `npm test`.
   */
  afterAll(() => {
    process.stdout.write(
      `Entradas da lista de páginas públicas conferidas: ${entradasConferidas}\n`
    )
  })
})
