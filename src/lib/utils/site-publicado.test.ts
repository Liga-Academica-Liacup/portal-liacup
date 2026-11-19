import { afterAll, describe, expect, it } from 'vitest'
import { sitePublicado } from './site-publicado'

/*
 * Os oito casos do cenario "Valores parecidos nao publicam", mais o `true`: nove.
 * Cada caso conferido ate o fim entra no contador, que sai impresso no fim:
 * sem o numero, "nada falhou" e "nada foi conferido" dao a mesma saida (RP-12).
 */
const NAO_PUBLICAM: ReadonlyArray<{ nome: string; valor: string | undefined }> = [
  { nome: 'ausente', valor: undefined },
  { nome: 'vazio', valor: '' },
  { nome: 'TRUE', valor: 'TRUE' },
  { nome: 'True', valor: 'True' },
  { nome: '1', valor: '1' },
  { nome: 'sim', valor: 'sim' },
  { nome: 'false', valor: 'false' },
  { nome: '" true" (com espaco)', valor: ' true' },
]

let casosConferidos = 0

describe('sitePublicado', () => {
  it('o texto exato `true` publica', () => {
    expect(sitePublicado('true')).toBe(true)
    casosConferidos += 1
  })

  it.each(NAO_PUBLICAM)('$nome nao publica', ({ valor }) => {
    expect(sitePublicado(valor)).toBe(false)
    casosConferidos += 1
  })

  /*
   * process.stdout, e nao console.log: o Vitest esconde o console.log de um
   * afterAll, e o contador precisa aparecer na saida de `npm test`.
   */
  afterAll(() => {
    process.stdout.write(`Valores de SITE_PUBLICADO conferidos: ${casosConferidos}\n`)
  })
})
