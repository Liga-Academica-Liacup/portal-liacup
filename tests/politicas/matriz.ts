/*
 * T028 — as celulas da matriz, e o contador que diz QUANTAS foram exercidas.
 *
 * Sem o contador, uma suite que nao exercita nada e uma suite que exercita tudo
 * produzem a mesma saida verde. E o contador precisa separar PERMISSAO de
 * RECUSA: uma suite so de permissoes prova que o site funciona e nao prova
 * bloqueio nenhum — e bloqueio e a razao de esta feature existir (RP-12).
 */
import { expect } from 'vitest'
import { semTipos, type Cliente } from './clientes'

export const contagem = { permissoes: 0, recusas: 0 }

type Resultado = { error: { message: string; code?: string } | null }
type Tentativa = () => PromiseLike<Resultado>

/** Celula de permissao: a operacao precisa dar certo. */
export function permitiu(resultado: Resultado, oQue: string): void {
  contagem.permissoes += 1
  expect(resultado.error, `deveria permitir: ${oQue}`).toBeNull()
}

/**
 * Celula de recusa em ESCRITA: a operacao precisa FALHAR.
 *
 * Aqui o banco devolve erro de verdade, entao a distincao e simples. A parte
 * dificil e a leitura, logo abaixo.
 */
export function recusou(resultado: Resultado, oQue: string): void {
  contagem.recusas += 1
  expect(resultado.error, `deveria recusar, e nao recusou: ${oQue}`).not.toBeNull()
}

/**
 * Celula de recusa em LEITURA — e este e o ponto delicado de toda a suite.
 *
 * O Postgres nao devolve erro quando a politica esconde uma linha: ele devolve
 * lista vazia. Entao "recebi vazio" NAO prova bloqueio — uma tabela sem linha
 * nenhuma devolve exatamente a mesma coisa, e o teste passaria com o banco
 * aberto e vazio.
 *
 * O que prova bloqueio e a comparacao: o cliente de servico ENXERGA a linha, o
 * anonimo NAO. A linha existe, e o que muda entre as duas leituras e so a
 * politica. Por isso o cliente de servico aparece aqui — ele nao esta sendo
 * verificado, ele e a testemunha de que havia o que esconder.
 */
export async function invisivelPara(
  anonimo: Cliente,
  servico: Cliente,
  tabela: string,
  id: string,
  oQue: string
): Promise<void> {
  contagem.recusas += 1

  const testemunha = await semTipos(servico).from(tabela).select('id').eq('id', id)
  expect(
    testemunha.data?.length,
    `preparacao falhou: a linha nem existe, entao esconde-la nao prova nada (${oQue})`
  ).toBe(1)

  const visto = await semTipos(anonimo).from(tabela).select('id').eq('id', id)
  expect(visto.data ?? [], `deveria estar invisivel: ${oQue}`).toHaveLength(0)
}

/**
 * Celula de recusa em ALTERACAO.
 *
 * Mesma armadilha da leitura, por um motivo diferente: quando a politica esconde
 * a linha, o UPDATE nao da erro — ele simplesmente nao encontra linha para
 * alterar e volta sem reclamar. Um teste que so olhasse `error` passaria com a
 * tabela aberta.
 *
 * O que prova a recusa e a testemunha: depois da tentativa, o cliente de servico
 * confere que o valor no banco continua o de antes.
 */
export async function naoAlterou(
  tentativa: Tentativa,
  servico: Cliente,
  tabela: string,
  id: string,
  coluna: string,
  valorEsperado: unknown,
  oQue: string
): Promise<void> {
  contagem.recusas += 1
  await tentativa()
  const depois = await semTipos(servico).from(tabela).select(coluna).eq('id', id).single()
  expect(
    (depois.data as Record<string, unknown> | null)?.[coluna],
    `alterou o que nao devia: ${oQue}`
  ).toEqual(valorEsperado)
}

/**
 * Celula de recusa em REMOCAO.
 *
 * Vale para o anonimo E para a diretoria: apagar arquiva, e a remocao definitiva
 * nao e operacao da aplicacao (FR-028). Como no UPDATE, o DELETE bloqueado volta
 * sem erro — a prova e a linha continuar la.
 */
export async function naoRemoveu(
  tentativa: Tentativa,
  servico: Cliente,
  tabela: string,
  id: string,
  oQue: string
): Promise<void> {
  contagem.recusas += 1
  await tentativa()
  const depois = await semTipos(servico).from(tabela).select('id').eq('id', id)
  expect(depois.data ?? [], `removeu de verdade o que nao devia: ${oQue}`).toHaveLength(1)
}
