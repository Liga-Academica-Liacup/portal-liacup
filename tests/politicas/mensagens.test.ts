/*
 * T027 — mensagens: a matriz INVERTIDA. E T023 — o controle de origem.
 *
 * Nas colecoes de conteudo o anonimo le e nao escreve. Aqui e o contrario: ele
 * escreve (o formulario de contato) e nao le nada.
 *
 * A CELULA QUE QUASE SEMPRE FALTA e a terceira: ler UMA mensagem pelo
 * identificador conhecido. Uma politica que esconde a lista mas deixa buscar por
 * id nao protege nada, porque id vaza em link, em log e em captura de tela — e
 * quem procura uma mensagem especifica ja sabe qual quer.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { clienteAnonimo, clienteAutenticado, clienteDeServico, type Cliente } from './clientes'
import { MARCA } from './colecoes'
import { invisivelPara, naoAlterou, naoRemoveu, permitiu, recusou } from './matriz'
import { limpar } from './preparo'

let servico: Cliente
let anonimo: Cliente
let diretoria: Cliente
let mensagemId: string

const nova = () => ({ nome: MARCA, email: 'contato@example.com', texto: MARCA })

beforeAll(async () => {
  servico = clienteDeServico()
  anonimo = clienteAnonimo()
  diretoria = await clienteAutenticado()
  await limpar(servico, ['mensagens'])
  const { data, error } = await servico.from('mensagens').insert(nova()).select('id').single()
  if (error || !data) throw new Error(`Nao foi possivel semear mensagens: ${error?.message}`)
  mensagemId = data.id
}, 120_000)

afterAll(async () => {
  await limpar(servico, ['mensagens'])
  await servico.from('controle_de_origem').delete().like('resumo_do_endereco', 'teste-%')
}, 120_000)

describe('mensagens — a matriz invertida', () => {
  it('qualquer pessoa envia uma mensagem — e o formulario de contato', async () => {
    const r = await anonimo.from('mensagens').insert(nova())
    permitiu(r, 'mensagens: anonimo insere')
  })

  it('o anonimo NAO le a lista', async () => {
    const lista = await anonimo.from('mensagens').select('id')
    const testemunha = await servico.from('mensagens').select('id')
    expect(
      testemunha.data?.length,
      'preparacao falhou: sem mensagem no banco, esconder a lista nao prova nada'
    ).toBeGreaterThan(0)
    expect(lista.data ?? [], 'a lista de mensagens deveria estar invisivel').toHaveLength(0)
  })

  it('o anonimo NAO le UMA mensagem pelo identificador conhecido', async () => {
    await invisivelPara(anonimo, servico, 'mensagens', mensagemId, 'mensagens: leitura por id')
  })

  it('o anonimo NAO altera', async () => {
    await naoAlterou(
      () => anonimo.from('mensagens').update({ situacao: 'lida' }).eq('id', mensagemId),
      servico,
      'mensagens',
      mensagemId,
      'situacao',
      'nao_lida',
      'mensagens: anonimo altera'
    )
  })

  it('o anonimo NAO remove', async () => {
    await naoRemoveu(
      () => anonimo.from('mensagens').delete().eq('id', mensagemId),
      servico,
      'mensagens',
      mensagemId,
      'mensagens: anonimo remove'
    )
  })

  it('a diretoria le e marca como lida', async () => {
    const leitura = await diretoria.from('mensagens').select('id').eq('id', mensagemId)
    permitiu(leitura, 'mensagens: diretoria le')
    expect(leitura.data).toHaveLength(1)

    const marca = await diretoria
      .from('mensagens')
      .update({ situacao: 'lida' })
      .eq('id', mensagemId)
      .select('id')
    permitiu(marca, 'mensagens: diretoria marca como lida')
  })

  it('NEM A DIRETORIA remove — so a purga remove', async () => {
    await naoRemoveu(
      () => diretoria.from('mensagens').delete().eq('id', mensagemId),
      servico,
      'mensagens',
      mensagemId,
      'mensagens: diretoria remove'
    )
  })
})

/*
 * T023 — controle de origem: nenhuma politica, e e isso que se verifica.
 *
 * Com o controle de acesso ativo e nenhuma politica, toda operacao e recusada
 * para o anonimo E para a diretoria. So a chave de servico atravessa.
 */
describe('controle de origem — fechado para todos menos o servidor', () => {
  it('o anonimo NAO escreve', async () => {
    const r = await anonimo
      .from('controle_de_origem')
      .insert({ resumo_do_endereco: 'teste-anonimo' })
    recusou(r, 'controle_de_origem: anonimo escreve')
  })

  it('a DIRETORIA tambem NAO escreve', async () => {
    const r = await diretoria
      .from('controle_de_origem')
      .insert({ resumo_do_endereco: 'teste-diretoria' })
    recusou(r, 'controle_de_origem: diretoria escreve')
  })

  it('nem o anonimo nem a diretoria leem', async () => {
    const { data, error } = await servico
      .from('controle_de_origem')
      .insert({ resumo_do_endereco: 'teste-testemunha' })
      .select('id')
      .single()
    if (error || !data) throw new Error(`preparacao falhou: ${error?.message}`)

    await invisivelPara(anonimo, servico, 'controle_de_origem', data.id, 'origem: anonimo le')
    await invisivelPara(diretoria, servico, 'controle_de_origem', data.id, 'origem: diretoria le')
  })
})
