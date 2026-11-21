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
let contagens = { etapas: 0, quemPodeSeInscrever: 0, perguntas: 0 }

/** Uma cópia do conteúdo de verdade com uma parte trocada. */
function com(parte: Partial<ConteudoDoProcessoSeletivo>): ConteudoDoProcessoSeletivo {
  return { ...conteudo, ...parte }
}

describe('conteúdo do processo seletivo', () => {
  it('o conteúdo da página não tem nenhum problema', () => {
    const problemas = problemasDoConteudo(conteudo)
    contagens = {
      etapas: conteudo.etapas.length,
      quemPodeSeInscrever: conteudo.quemPodeSeInscrever.length,
      perguntas: conteudo.perguntas.length,
    }
    expect(problemas, `Problemas no conteúdo: ${problemas.join('; ')}`).toEqual([])
  })

  it('tem 5 etapas, 4 itens de quem pode se inscrever e 8 perguntas, como o documento', () => {
    expect(conteudo.etapas).toHaveLength(5)
    expect(conteudo.quemPodeSeInscrever).toHaveLength(4)
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

  it('acusa item de quem pode se inscrever vazio, nomeando a posição', () => {
    const quemPodeSeInscrever = conteudo.quemPodeSeInscrever.map((item, indice) =>
      indice === 1 ? '' : item
    )
    expect(problemasDoConteudo(com({ quemPodeSeInscrever }))).toEqual([
      'item 2 de "quem pode se inscrever" vazio',
    ])
  })

  it('acusa número de itens de quem pode se inscrever diferente de quatro', () => {
    const quemPodeSeInscrever = conteudo.quemPodeSeInscrever.slice(0, 3)
    expect(problemasDoConteudo(com({ quemPodeSeInscrever }))).toEqual([
      '3 itens em "quem pode se inscrever"; a seção 5.3 tem 4',
    ])
  })

  it('acusa item de quem pode se inscrever com a nota de fonte do documento no fim', () => {
    const quemPodeSeInscrever = conteudo.quemPodeSeInscrever.map((item, indice) =>
      indice === 2 ? `${item} _(Edital, item 2.2)_` : item
    )
    expect(problemasDoConteudo(com({ quemPodeSeInscrever }))).toEqual([
      'item 3 de "quem pode se inscrever" com nota de fonte no fim',
    ])
  })

  it('acusa número de etapas diferente de cinco', () => {
    const etapas = conteudo.etapas.slice(0, 2)
    expect(problemasDoConteudo(com({ etapas }))).toEqual(['2 etapas; a seção 5.5 tem 5'])
  })

  it('acusa etapa sem o caráter', () => {
    const etapas = conteudo.etapas.map((etapa, indice) =>
      indice === 2 ? { ...etapa, carater: '' } : etapa
    )
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
      `etapas: ${contagens.etapas} · quem pode se inscrever: ${contagens.quemPodeSeInscrever} · ` +
        `perguntas: ${contagens.perguntas}\n`
    )
  })
})
