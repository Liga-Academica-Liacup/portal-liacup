import { afterAll, describe, expect, it } from 'vitest'
import { CONTEUDO_DO_CONTATO } from './conteudo'

/*
 * Confere o conteúdo do topo da página Contato (design.md da change
 * pagina-contato, D5): o sobretítulo e o título, não vazios e sem travessão.
 *
 * Se o texto bate com a REFERENCIA-VISUAL.md, seção 7, quem confere é o teste
 * de ponta a ponta, que lê o documento e a página publicada.
 *
 * A contagem sai impressa no fim: sem ela, "nada falhou" e "nada foi
 * conferido" dão a mesma saída (RP-12).
 */
let rotulosConferidos = 0

describe('conteúdo de Contato', () => {
  it('o topo tem o sobretítulo e o título, não vazios e sem travessão', () => {
    const rotulos = Object.entries(CONTEUDO_DO_CONTATO.topo)
    const vazios = rotulos.filter(([, texto]) => texto.trim() === '').map(([nome]) => nome)
    const comTravessao = rotulos.filter(([, texto]) => texto.includes('—')).map(([nome]) => nome)
    rotulosConferidos = rotulos.length - vazios.length
    expect(vazios, 'rótulos vazios no topo').toEqual([])
    expect(comTravessao, 'rótulos com travessão no topo').toEqual([])
    expect(rotulos.map(([nome]) => nome)).toEqual(['sobretitulo', 'titulo'])
  })

  /*
   * process.stdout, e não console.log: o Vitest esconde o console.log de um
   * afterAll, e a contagem precisa aparecer na saída de `npm test`.
   */
  afterAll(() => {
    process.stdout.write(`contato · topo: ${rotulosConferidos} rótulos\n`)
  })
})

/*
 * Confere o topo do bloco de contato da inicial (change inicio-completo, D5):
 * o sobretítulo e o título, não vazios, sem travessão, e sem a frase nem o
 * botão do protótipo (Q4 (a) e Q5 (a) do Gabriel, 23/11/2026).
 */
let rotulosDaInicialConferidos = 0

/** O que o protótipo traz no bloco e não vai ao ar. */
const FORA_DO_BLOCO_DA_INICIAL = ['canal mais rápido', 'Mandar uma mensagem', '—']

describe('conteúdo do bloco de contato da inicial', () => {
  it('o bloco tem o sobretítulo e o título, não vazios, sem travessão, frase nem botão', () => {
    const rotulos = Object.entries(CONTEUDO_DO_CONTATO.blocoDaInicial)
    const vazios = rotulos.filter(([, texto]) => texto.trim() === '').map(([nome]) => nome)
    const proibidos = rotulos.flatMap(([nome, texto]) =>
      FORA_DO_BLOCO_DA_INICIAL.filter((termo) => texto.includes(termo)).map(
        (termo) => `${nome}: "${termo}"`
      )
    )
    rotulosDaInicialConferidos = rotulos.length - vazios.length
    expect(vazios, 'rótulos vazios no bloco da inicial').toEqual([])
    expect(proibidos, 'termos proibidos no bloco da inicial').toEqual([])
    expect(rotulos.map(([nome]) => nome)).toEqual(['sobretitulo', 'titulo'])
  })

  afterAll(() => {
    process.stdout.write(`contato · bloco da inicial: ${rotulosDaInicialConferidos} rótulos\n`)
  })
})
