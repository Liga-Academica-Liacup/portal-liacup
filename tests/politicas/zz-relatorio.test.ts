/*
 * T028 — o contador da suite de politicas.
 *
 * Roda por ultimo (por isso o nome comeca com zz) e diz QUANTAS celulas foram
 * exercidas, separando permissao de recusa.
 *
 * A asserção que importa e a segunda: se o numero de recusas for zero, a suite
 * provou que o site funciona e nao provou bloqueio nenhum — que e o mesmo verde
 * de nao ter rodado nada. E a mesma ideia do contador de alvos de toque da F01 e
 * do contador de tabelas do verificador de RLS (RP-12).
 */
import { expect, it } from 'vitest'
import { contagem } from './matriz'

it('a suite diz quantas celulas exerceu, e quantas provaram bloqueio', () => {
  const total = contagem.permissoes + contagem.recusas
  console.log(
    `\n  celulas verificadas: ${total} · de permissao: ${contagem.permissoes}` +
      ` · de recusa: ${contagem.recusas}\n`
  )
  expect(total, 'nenhuma celula foi exercida: o verde nao significa nada').toBeGreaterThan(0)
  expect(
    contagem.recusas,
    'zero celulas de recusa: a suite provou permissao e nao provou bloqueio nenhum'
  ).toBeGreaterThan(0)
})
