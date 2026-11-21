import { afterAll, describe, expect, it } from 'vitest'
import { CONTEUDO_DO_PROCESSO_SELETIVO } from './conteudo'
import { problemasDoConteudo } from './regras'
import type { ConteudoDoProcessoSeletivo } from './tipos'

/*
 * Confere o conteúdo da página do processo seletivo (design.md da change
 * pagina-processo-seletivo, D5).
 *
 * O primeiro teste é o que importa: ele lê o conteúdo de verdade e fica
 * vermelho nomeando o item errado. Os outros mostram que a conferência pega
 * cada problema, com conteúdos inventados aqui mesmo, para ninguém precisar
 * estragar o arquivo de dados para ver a conferência funcionar.
 *
 * Se o texto bate com o docs/conteudo-institucional.md, quem confere é o teste
 * de ponta a ponta, que lê o documento e a página publicada.
 *
 * As contagens saem impressas no fim: sem elas, "nada falhou" e "nada foi
 * conferido" dão a mesma saída (RP-12).
 */
const conteudo = CONTEUDO_DO_PROCESSO_SELETIVO
let contagens = { etapas: 0, preRequisitos: 0, perguntas: 0 }

/** Uma cópia do conteúdo de verdade com uma parte trocada. */
function com(parte: Partial<ConteudoDoProcessoSeletivo>): ConteudoDoProcessoSeletivo {
  return { ...conteudo, ...parte }
}

describe('conteúdo do processo seletivo', () => {
  it('o conteúdo da página não tem nenhum problema', () => {
    const problemas = problemasDoConteudo(conteudo)
    contagens = {
      etapas: conteudo.etapas.length,
      preRequisitos: conteudo.preRequisitos.length,
      perguntas: conteudo.perguntas.length,
    }
    expect(problemas, `Problemas no conteúdo: ${problemas.join('; ')}`).toEqual([])
  })

  it('tem 2 etapas, 3 pré-requisitos e 8 perguntas, como o documento', () => {
    expect(conteudo.etapas).toHaveLength(2)
    expect(conteudo.preRequisitos).toHaveLength(3)
    expect(conteudo.perguntas).toHaveLength(8)
  })

  it('nasce no estado de inscrições fechadas (Q2 (a))', () => {
    expect(conteudo.inscricoes.estado).toBe('fechado')
  })

  it('acusa pergunta sem resposta, nomeando a pergunta', () => {
    const perguntas = conteudo.perguntas.map((item, indice) =>
      indice === 2 ? { ...item, resposta: ' ' } : item
    )
    expect(problemasDoConteudo(com({ perguntas }))).toEqual([
      'pergunta "Quanto tempo por semana?" sem resposta',
    ])
  })

  it('acusa pergunta repetida', () => {
    const perguntas = [...conteudo.perguntas, conteudo.perguntas[0]!]
    expect(problemasDoConteudo(com({ perguntas }))).toEqual([
      'pergunta "Precisa ser de qual curso?" repetida',
    ])
  })

  it('acusa resposta com a nota de fonte do documento no fim', () => {
    const perguntas = conteudo.perguntas.map((item, indice) =>
      indice === 6 ? { ...item, resposta: `${item.resposta} (Estatuto, Art. 6º, I)` } : item
    )
    expect(problemasDoConteudo(com({ perguntas }))).toEqual([
      'pergunta "Com que frequência são as reuniões?" com nota de fonte no fim da resposta',
    ])
  })

  it('acusa pré-requisito vazio, nomeando a posição', () => {
    const preRequisitos = [conteudo.preRequisitos[0]!, '', conteudo.preRequisitos[2]!]
    expect(problemasDoConteudo(com({ preRequisitos }))).toEqual(['pré-requisito 2 vazio'])
  })

  it('acusa número de etapas diferente de dois', () => {
    const etapas = [conteudo.etapas[0]!]
    expect(problemasDoConteudo(com({ etapas }))).toEqual(['1 etapas; o edital tem 2'])
  })

  it('acusa etapa sem o caráter', () => {
    const etapas = [conteudo.etapas[0]!, { ...conteudo.etapas[1]!, carater: '' }]
    expect(problemasDoConteudo(com({ etapas }))).toEqual([
      'etapa "Entrevista online via Meet" sem o caráter',
    ])
  })

  it('acusa nome acessível do link que não contém o texto visível', () => {
    const inscricoes = {
      ...conteudo.inscricoes,
      aviso: { ...conteudo.inscricoes.aviso, nomeAcessivelDoLink: 'Instagram da Liga' },
    }
    expect(problemasDoConteudo(com({ inscricoes }))).toEqual([
      'o nome acessível do link do aviso não contém o texto "@liacup.unb"',
    ])
  })

  /*
   * process.stdout, e não console.log: o Vitest esconde o console.log de um
   * afterAll, e as contagens precisam aparecer na saída de `npm test`.
   */
  afterAll(() => {
    process.stdout.write(
      `etapas: ${contagens.etapas} · pré-requisitos: ${contagens.preRequisitos} · ` +
        `perguntas: ${contagens.perguntas}\n`
    )
  })
})
