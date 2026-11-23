import { afterAll, describe, expect, it } from 'vitest'
import { CONTEUDO_DE_PROJETOS } from './conteudo'
import { NOMES_DAS_FRENTES, juntarNomes, problemasDoConteudo } from './regras'
import type { ConteudoDeProjetos, Frente } from './tipos'

/*
 * Confere o conteúdo da página Projetos (design.md da change pagina-projetos,
 * D5).
 *
 * O primeiro teste é o que importa: ele lê o conteúdo de verdade e fica
 * vermelho nomeando a frente errada. Os outros mostram que a conferência pega
 * cada problema, com conteúdos inventados aqui mesmo, para ninguém precisar
 * estragar o arquivo de dados para ver a conferência funcionar.
 *
 * Se o texto bate com o docs/conteudo-institucional.md, quem confere é o teste
 * de ponta a ponta, que lê o documento e a página publicada.
 *
 * A contagem e os nomes saem impressos no fim: sem eles, "nada falhou" e "nada
 * foi conferido" dão a mesma saída (RP-12).
 */
const conteudo = CONTEUDO_DE_PROJETOS
let frentesConferidas = 0
let nomesConferidos: string[] = []

/** Uma cópia do conteúdo de verdade com as frentes trocadas. */
function comFrentes(frentes: readonly Frente[]): ConteudoDeProjetos {
  return { ...conteudo, frentes }
}

/** Uma cópia das frentes com o texto de uma delas trocado. */
function comTexto(indice: number, texto: string): readonly Frente[] {
  return conteudo.frentes.map((frente, i) => (i === indice ? { ...frente, texto } : frente))
}

describe('conteúdo de Projetos', () => {
  it('o conteúdo da página não tem nenhum problema', () => {
    const problemas = problemasDoConteudo(conteudo)
    frentesConferidas = conteudo.frentes.length
    nomesConferidos = conteudo.frentes.map((frente) => frente.nome)
    expect(problemas, `Problemas no conteúdo: ${problemas.join('; ')}`).toEqual([])
  })

  it('tem as quatro frentes da seção 3, na ordem do documento', () => {
    expect(conteudo.frentes.map((frente) => frente.nome)).toEqual([...NOMES_DAS_FRENTES])
  })

  it('o título da faixa junta os quatro nomes, para os dois não se desencontrarem', () => {
    expect(conteudo.faixa.titulo).toBe(juntarNomes(conteudo.frentes.map((frente) => frente.nome)))
    expect(juntarNomes(['A', 'B', 'C', 'D'])).toBe('A, B, C e D')
    expect(juntarNomes(['A', 'B'])).toBe('A e B')
    expect(juntarNomes(['A'])).toBe('A')
  })

  it('acusa uma frente a menos, com as duas contagens e o título que não fecha', () => {
    expect(problemasDoConteudo(comFrentes(conteudo.frentes.slice(0, 3)))).toEqual([
      '3 frentes; a seção 3 tem 4',
      'título da faixa "Ensino, Extensão, Pesquisa e Secretaria" não junta os nomes das ' +
        'frentes; o esperado é "Ensino, Extensão e Pesquisa"',
    ])
  })

  it('acusa frente repetida, texto repetido e texto vazio', () => {
    const [ensino, extensao, pesquisa] = conteudo.frentes
    const frentes = [ensino!, { ...extensao!, texto: ensino!.texto }, pesquisa!, ensino!]
    expect(problemasDoConteudo(comFrentes(frentes))).toEqual([
      'texto da frente "Extensão" repetido',
      'frente "Ensino" repetida',
      'texto da frente "Ensino" repetido',
      'título da faixa "Ensino, Extensão, Pesquisa e Secretaria" não junta os nomes das ' +
        'frentes; o esperado é "Ensino, Extensão, Pesquisa e Ensino"',
    ])
    expect(problemasDoConteudo(comFrentes(comTexto(3, ' ')))).toEqual([
      'frente "Secretaria" sem texto',
    ])
  })

  it('acusa cada termo de rascunho, de nota de fonte e a palavra "eixo", nomeando a frente', () => {
    const casos: [number, string, string][] = [
      [3, 'Pendente. ', 'termo "Pendente" no texto da frente "Secretaria"'],
      [
        0,
        'Descrição a ser escrita pela diretoria. ',
        'termo "a ser escrit" no texto da frente "Ensino"',
      ],
      [3, 'Texto provisório. ', 'termo "provisório" no texto da frente "Secretaria"'],
      [1, 'Os três eixos. ', 'termo "eixo" no texto da frente "Extensão"'],
      [2, '(Estatuto, Art. 2º § 2º) ', 'termo "Estatuto" no texto da frente "Pesquisa"'],
      [3, '_', 'termo "_" no texto da frente "Secretaria"'],
      [3, '⚠️ ', 'termo "⚠" no texto da frente "Secretaria"'],
    ]
    const achados = casos.map(([indice, prefixo]) =>
      problemasDoConteudo(comFrentes(comTexto(indice, prefixo + conteudo.frentes[indice]!.texto)))
    )
    expect(achados).toEqual(casos.map(([, , esperado]) => [esperado]))
  })

  it('"pendente" dentro de outra palavra não é o termo: "independente" passa', () => {
    const texto = `Uma ação independente. ${conteudo.frentes[0]!.texto}`
    expect(problemasDoConteudo(comFrentes(comTexto(0, texto)))).toEqual([])
  })

  /*
   * process.stdout, e não console.log: o Vitest esconde o console.log de um
   * afterAll, e a contagem precisa aparecer na saída de `npm test`.
   */
  afterAll(() => {
    process.stdout.write(
      `Projetos · frentes: ${frentesConferidas}\n` +
        `Projetos · nomes, na ordem: ${nomesConferidos.join(', ')}\n`
    )
  })
})
