import { afterAll, describe, expect, it } from 'vitest'
import { CONTEUDO_DO_SOBRE } from './conteudo'
import { contarParagrafos, problemasDoConteudo } from './regras'
import type { ConteudoDoSobre, ItemDosObjetivos } from './tipos'

/*
 * Confere o conteúdo da página Sobre (design.md da change
 * pagina-sobre-e-equipe, D8).
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
const conteudo = CONTEUDO_DO_SOBRE
let contagens = { itens: 0, paragrafos: 0 }

/** Uma cópia do conteúdo de verdade com outros itens. */
function comItens(itens: readonly ItemDosObjetivos[]): ConteudoDoSobre {
  return { ...conteudo, objetivos: { ...conteudo.objetivos, itens } }
}

describe('conteúdo do Sobre', () => {
  it('o conteúdo da página não tem nenhum problema', () => {
    const problemas = problemasDoConteudo(conteudo)
    contagens = { itens: conteudo.objetivos.itens.length, paragrafos: contarParagrafos(conteudo) }
    expect(problemas, `Problemas no conteúdo: ${problemas.join('; ')}`).toEqual([])
  })

  it('tem os quatro itens das seções 2.3 a 2.6, na ordem, com cinco parágrafos', () => {
    expect(conteudo.objetivos.itens.map((item) => item.nome)).toEqual([
      'Objetivo geral',
      'Finalidade institucional',
      'Impacto social',
      'Protagonismo estudantil',
    ])
    expect(conteudo.objetivos.itens.map((item) => item.paragrafos.length)).toEqual([2, 1, 1, 1])
  })

  it('acusa um item a menos, com as duas contagens', () => {
    expect(problemasDoConteudo(comItens(conteudo.objetivos.itens.slice(0, 3)))).toEqual([
      '3 itens em "O que a Liga se propõe a fazer"; as seções 2.3 a 2.6 são 4',
      '4 parágrafos nos itens; as seções 2.3 a 2.6 têm 5',
    ])
  })

  it('acusa item repetido e item sem nome', () => {
    const itens = conteudo.objetivos.itens.map((item, indice) =>
      indice === 2
        ? { ...item, nome: 'Objetivo geral' }
        : indice === 3
          ? { ...item, nome: ' ' }
          : item
    )
    expect(problemasDoConteudo(comItens(itens))).toEqual([
      'item "Objetivo geral" repetido',
      'item 4 sem nome',
    ])
  })

  it('acusa a nota de fonte do documento copiada no fim do parágrafo (Q10 (a))', () => {
    const itens = conteudo.objetivos.itens.map((item, indice) =>
      indice === 1 ? { ...item, paragrafos: [`${item.paragrafos[0]} _(Estatuto, Art. 2º)_`] } : item
    )
    expect(problemasDoConteudo(comItens(itens))).toEqual([
      'parágrafo 1 do item "Finalidade institucional" com nota de fonte no fim',
    ])
  })

  it('acusa parágrafo vazio e apresentação vazia', () => {
    const itens = conteudo.objetivos.itens.map((item, indice) =>
      indice === 0 ? { ...item, paragrafos: [item.paragrafos[0]!, ''] } : item
    )
    expect(problemasDoConteudo({ ...comItens(itens), apresentacao: '' })).toEqual([
      'apresentação vazia',
      'parágrafo 2 do item "Objetivo geral" vazio',
    ])
  })

  /*
   * process.stdout, e não console.log: o Vitest esconde o console.log de um
   * afterAll, e as contagens precisam aparecer na saída de `npm test`.
   */
  afterAll(() => {
    process.stdout.write(
      `Sobre · itens: ${contagens.itens} · parágrafos: ${contagens.paragrafos}\n`
    )
  })
})
