import { afterAll, describe, expect, it } from 'vitest'
import { CONTEUDO_DA_EQUIPE } from './conteudo'
import { iniciaisDoNome, problemasDoConteudo } from './regras'
import type { ConteudoDaEquipe } from './tipos'

/*
 * Confere o conteúdo da página Equipe e a regra das iniciais dos docentes
 * (design.md da change pagina-sobre-e-equipe, D6 e D8).
 *
 * O primeiro teste é o que importa: ele lê o conteúdo de verdade e fica
 * vermelho nomeando o item errado. Os outros mostram que a conferência pega
 * cada problema, com conteúdos inventados aqui mesmo, para ninguém precisar
 * estragar o arquivo de dados para ver a conferência funcionar.
 *
 * Se o texto bate com o docs/conteudo-institucional.md, quem confere é o teste
 * de ponta a ponta, que lê o documento e a página publicada.
 *
 * As contagens e as iniciais saem impressas no fim: sem elas, "nada falhou" e
 * "nada foi conferido" dão a mesma saída (RP-12).
 */
const conteudo = CONTEUDO_DA_EQUIPE
let contagens = { cargos: 0, fundadores: 0, docentes: 0 }
let iniciais: string[] = []

/** Uma cópia do conteúdo de verdade com uma parte trocada. */
function com(parte: Partial<ConteudoDaEquipe>): ConteudoDaEquipe {
  return { ...conteudo, ...parte }
}

describe('conteúdo da Equipe', () => {
  it('o conteúdo da página não tem nenhum problema', () => {
    const problemas = problemasDoConteudo(conteudo)
    contagens = {
      cargos: conteudo.cargos.length,
      fundadores: conteudo.fundadores.length,
      docentes: conteudo.docentes.length,
    }
    expect(problemas, `Problemas no conteúdo: ${problemas.join('; ')}`).toEqual([])
  })

  it('tem os seis cargos da seção 4.3, na ordem do documento', () => {
    expect(conteudo.cargos.map((item) => item.cargo)).toEqual([
      'Presidente',
      'Vice-presidente',
      'Diretor(a) financeiro(a)',
      'Secretário(a)-Geral',
      'Diretor(a) de ensino e extensão',
      'Diretor(a) de pesquisa e mídia',
    ])
  })

  it('acusa um cargo a menos, com as duas contagens', () => {
    expect(problemasDoConteudo(com({ cargos: conteudo.cargos.slice(0, 5) }))).toEqual([
      '5 cargos; a seção 4.3 tem 6',
    ])
  })

  it('acusa fundador repetido e a contagem a mais', () => {
    const fundadores = [...conteudo.fundadores, conteudo.fundadores[0]!]
    expect(problemasDoConteudo(com({ fundadores }))).toEqual([
      '6 fundadores; a seção 4.2 tem 5',
      'fundador "Ágata Heloisa Pereira da Conceição" repetido',
    ])
  })

  it('acusa cargo sem a linha e docente sem formação', () => {
    const cargos = conteudo.cargos.map((item, i) => (i === 3 ? { ...item, linha: ' ' } : item))
    const docentes = conteudo.docentes.map((d, i) => (i === 1 ? { ...d, formacao: '' } : d))
    expect(problemasDoConteudo(com({ cargos, docentes }))).toEqual([
      'cargo "Secretário(a)-Geral" sem a linha',
      'docente "Profa. Dra. Kerolyn Ramos Garcia" sem formação',
    ])
  })
})

describe('iniciais do círculo dos docentes', () => {
  it('os dois docentes do documento dão "MC" e "KG"', () => {
    iniciais = conteudo.docentes.map((docente) => iniciaisDoNome(docente.nome))
    expect(iniciais).toEqual(['MC', 'KG'])
  })

  it('a primeira letra da primeira e da última palavra, e não da segunda', () => {
    expect(iniciaisDoNome('Profa. Dra. Kerolyn Ramos Garcia')).toBe('KG')
    expect(iniciaisDoNome('Profa. Dra. Kerolyn Ramos Garcia')).not.toBe('KR')
  })

  it('tira toda palavra de tratamento que termina em ponto, e não uma lista fixa', () => {
    expect(iniciaisDoNome('Prof. Me. João da Silva')).toBe('JS')
    expect(iniciaisDoNome('Dr. ana souza')).toBe('AS')
  })

  it('letra acentuada, espaço sobrando, nome de uma palavra e nome vazio', () => {
    expect(iniciaisDoNome('  Profa.   Ágata   Conceição ')).toBe('ÁC')
    expect(iniciaisDoNome('Profa. Mariana')).toBe('M')
    expect(iniciaisDoNome('Profa. Dra.')).toBe('')
  })

  /*
   * process.stdout, e não console.log: o Vitest esconde o console.log de um
   * afterAll, e as contagens precisam aparecer na saída de `npm test`.
   */
  afterAll(() => {
    process.stdout.write(
      `Equipe · cargos: ${contagens.cargos} · fundadores: ${contagens.fundadores} · ` +
        `docentes: ${contagens.docentes}\n` +
        `Equipe · iniciais: ${iniciais.join(', ')}\n`
    )
  })
})
