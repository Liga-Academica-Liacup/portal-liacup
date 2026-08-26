/*
 * T025 — as celulas de PERMISSAO da matriz, nas onze colecoes de conteudo.
 *
 * Este arquivo prova que o site funciona: o publico ve o que a liga publicou, e
 * a diretoria autenticada ve e escreve tudo. Sozinho ele nao prova nada sobre
 * seguranca — quem faz isso e o arquivo de recusa, ao lado.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  clienteAnonimo,
  clienteAutenticado,
  clienteDeServico,
  semTipos,
  type Cliente,
} from './clientes'
import { COLECOES_DE_CONTEUDO, colunaDeTexto, linhaMinima, MARCA } from './colecoes'
import { permitiu } from './matriz'
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

describe.each(COLECOES_DE_CONTEUDO)('%s — celulas de permissao', (colecao) => {
  it('o publico le o que esta publicado e nao arquivado', async () => {
    const { publicado } = semeado.get(colecao)!
    const r = await semTipos(anonimo).from(colecao).select('id').eq('id', publicado)
    permitiu(r, `${colecao}: anonimo le publicado`)
    expect(r.data).toHaveLength(1)
  })

  it('a diretoria le rascunho e arquivado', async () => {
    const { rascunho, arquivado } = semeado.get(colecao)!
    const r = await semTipos(diretoria).from(colecao).select('id').in('id', [rascunho, arquivado])
    permitiu(r, `${colecao}: diretoria le rascunho e arquivado`)
    expect(r.data).toHaveLength(2)
  })

  it('a diretoria cria', async () => {
    const r = await semTipos(diretoria)
      .from(colecao)
      .insert(linhaMinima(colecao, { albumId }))
      .select('id')
    permitiu(r, `${colecao}: diretoria cria`)
  })

  it('a diretoria altera', async () => {
    const { publicado } = semeado.get(colecao)!
    const coluna = colunaDeTexto(colecao)
    const r = await semTipos(diretoria)
      .from(colecao)
      .update({ [coluna]: `${MARCA} alterado` })
      .eq('id', publicado)
      .select('id')
    permitiu(r, `${colecao}: diretoria altera`)
    expect(r.data).toHaveLength(1)
  })

  it('a diretoria arquiva, que e alterar a coluna arquivado', async () => {
    const { publicado } = semeado.get(colecao)!
    const r = await semTipos(diretoria)
      .from(colecao)
      .update({ arquivado: true })
      .eq('id', publicado)
      .select('id')
    permitiu(r, `${colecao}: diretoria arquiva`)
    expect(r.data).toHaveLength(1)
    /* Devolve ao estado publicado para nao contaminar os testes seguintes. */
    await semTipos(servico).from(colecao).update({ arquivado: false }).eq('id', publicado)
  })
})
