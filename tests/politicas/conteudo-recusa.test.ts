/*
 * T026 — as celulas de RECUSA da matriz, nas onze colecoes de conteudo.
 *
 * ESTE E O ARQUIVO QUE PROVA A FEATURE. O de permissao prova que o site
 * funciona; este prova que ele nao esta aberto.
 *
 * Nenhuma celula daqui passa por "recebi vazio" ou por "nao deu erro". Leitura
 * bloqueada devolve lista vazia, e alteracao bloqueada volta em silencio — os
 * dois se confundem com uma tabela vazia e com uma alteracao que deu certo. Por
 * isso toda recusa e provada por comparacao com o que o cliente de servico
 * enxerga, e a explicacao de cada caso esta em matriz.ts.
 */
import { afterAll, beforeAll, describe, it } from 'vitest'
import {
  clienteAnonimo,
  clienteAutenticado,
  clienteDeServico,
  semTipos,
  type Cliente,
} from './clientes'
import { COLECOES_DE_CONTEUDO, colunaDeTexto, linhaMinima, MARCA } from './colecoes'
import { invisivelPara, naoAlterou, naoRemoveu, recusou } from './matriz'
import { limpar, semear, semearAlbum, type Semeadura } from './preparo'

let servico: Cliente
let anonimo: Cliente
let diretoria: Cliente
let albumId: string
const semeado = new Map<string, Semeadura>()

beforeAll(async () => {
  servico = clienteDeServico()
  anonimo = clienteAnonimo()
  diretoria = await clienteAutenticado()
  await limpar(servico, COLECOES_DE_CONTEUDO)
  albumId = await semearAlbum(servico)
  for (const colecao of COLECOES_DE_CONTEUDO) {
    semeado.set(colecao, await semear(servico, colecao, { albumId }))
  }
}, 120_000)

afterAll(async () => {
  await limpar(servico, COLECOES_DE_CONTEUDO)
}, 120_000)

describe.each(COLECOES_DE_CONTEUDO)('%s — celulas de recusa', (colecao) => {
  it('o anonimo NAO ve rascunho', async () => {
    const { rascunho } = semeado.get(colecao)!
    await invisivelPara(anonimo, servico, colecao, rascunho, `${colecao}: rascunho`)
  })

  it('o anonimo NAO ve arquivado', async () => {
    const { arquivado } = semeado.get(colecao)!
    await invisivelPara(anonimo, servico, colecao, arquivado, `${colecao}: arquivado`)
  })

  it('o anonimo NAO cria', async () => {
    const r = await semTipos(anonimo).from(colecao).insert(linhaMinima(colecao, { albumId }))
    recusou(r, `${colecao}: anonimo cria`)
  })

  it('o anonimo NAO altera', async () => {
    const { publicado } = semeado.get(colecao)!
    const coluna = colunaDeTexto(colecao)
    await naoAlterou(
      () =>
        semTipos(anonimo)
          .from(colecao)
          .update({ [coluna]: 'invadido' })
          .eq('id', publicado),
      servico,
      colecao,
      publicado,
      coluna,
      MARCA,
      `${colecao}: anonimo altera`
    )
  })

  it('o anonimo NAO arquiva', async () => {
    const { publicado } = semeado.get(colecao)!
    await naoAlterou(
      () => semTipos(anonimo).from(colecao).update({ arquivado: true }).eq('id', publicado),
      servico,
      colecao,
      publicado,
      'arquivado',
      false,
      `${colecao}: anonimo arquiva`
    )
  })

  it('o anonimo NAO remove', async () => {
    const { publicado } = semeado.get(colecao)!
    await naoRemoveu(
      () => semTipos(anonimo).from(colecao).delete().eq('id', publicado),
      servico,
      colecao,
      publicado,
      `${colecao}: anonimo remove`
    )
  })

  /*
   * A unica celula em que a diretoria tambem e recusada, e a mais facil de
   * escrever errado: e tentador deixar quem edita apagar o proprio engano. Mas
   * apagar arquiva (FR-028), e isto protege a diretoria dela mesma — o registro
   * so sai do banco pela purga.
   */
  it('NEM A DIRETORIA remove de verdade', async () => {
    const { publicado } = semeado.get(colecao)!
    await naoRemoveu(
      () => semTipos(diretoria).from(colecao).delete().eq('id', publicado),
      servico,
      colecao,
      publicado,
      `${colecao}: diretoria remove de verdade`
    )
  })
})
