import { afterAll, describe, expect, it } from 'vitest'
import { ENDERECO_DO_SITE, montarMetadados } from './metadados'
import { PAGINAS_PUBLICAS } from './paginas-publicas'

/*
 * Confere o montarMetadados (design.md da pagina-processo-seletivo, D10): cada
 * página da lista ganha título, descrição, canônico absoluto e Open Graph a
 * partir da entrada dela, e nada que outro layout já dá.
 *
 * Percorre a lista de verdade, então página nova entra na conta sozinha. O
 * número de páginas conferidas sai impresso no fim (RP-12).
 */
let paginasConferidas = 0

describe('montarMetadados', () => {
  it.each(PAGINAS_PUBLICAS.map((pagina) => [pagina.endereco, pagina] as const))(
    'monta os metadados de %s a partir da entrada da lista',
    (endereco, pagina) => {
      const metadados = montarMetadados(endereco)
      expect(metadados.title).toEqual({ absolute: pagina.titulo })
      expect(metadados.description).toBe(pagina.descricao)
      expect(String(metadados.metadataBase)).toBe(`${ENDERECO_DO_SITE}/`)
      expect(metadados.alternates?.canonical).toBe(endereco)
      // O canônico absoluto é o endereço do site seguido do da página.
      const canonico = new URL(
        String(metadados.alternates?.canonical),
        String(metadados.metadataBase)
      )
      expect(canonico.href).toBe(`${ENDERECO_DO_SITE}${endereco}`)
      expect(metadados.openGraph).toEqual({
        title: pagina.titulo,
        description: pagina.descricao,
        url: endereco,
        locale: 'pt_BR',
        type: 'website',
      })
      paginasConferidas += 1
    }
  )

  it('não repete o que a raiz e o layout das páginas públicas já dão', () => {
    const metadados = montarMetadados('/')
    expect(metadados.icons).toBeUndefined()
    expect(Object.keys(metadados).sort()).toEqual(
      ['alternates', 'description', 'metadataBase', 'openGraph', 'title'].sort()
    )
  })

  it('lança erro para endereço fora da lista, nomeando o endereço', () => {
    expect(() => montarMetadados('/endereco-que-nao-existe')).toThrow(
      '"/endereco-que-nao-existe" não está na lista'
    )
    expect(() => montarMetadados('/processo')).toThrow('"/processo" não está na lista')
  })

  afterAll(() => {
    process.stdout.write(
      `Páginas com metadados conferidos: ${paginasConferidas} de ${PAGINAS_PUBLICAS.length}\n`
    )
  })
})
