/*
 * T038 — resumo irreversivel do endereco de origem (FR-026, FR-027).
 *
 * POR QUE ISTO EXISTE E NAO GUARDAMOS O IP: o ADR-0001 §3 diz que o portal nao
 * guarda endereco de IP, e o ADR-0002 precisa conter abuso do formulario de
 * contato. As duas coisas so cabem juntas se o que for guardado nao permitir
 * voltar ao endereco — e o adendo do ADR-0002 registra exatamente isso.
 *
 * POR QUE O SAL E SECRETO E ROTACIONAVEL: sem sal, ou com sal publico, o resumo
 * e reversivel por forca bruta. O espaco IPv4 inteiro tem cerca de 4,3 bilhoes
 * de valores — uma maquina comum percorre isso em minutos e monta a tabela
 * inversa completa. Nao ha resumo forte o bastante para um espaco desse tamanho;
 * o que protege e o segredo. Trocar o sal invalida todos os resumos anteriores
 * de uma vez, que e o comportamento desejado numa rotacao.
 *
 * SEM DEPENDENCIA NOVA: `node:crypto` e biblioteca padrao.
 */
import { createHmac } from 'node:crypto'

/**
 * Resumo irreversivel do endereco. Serve para responder "e o mesmo de antes?" e
 * nada mais — nao da para voltar ao endereco, nem para localizar ninguem.
 *
 * Lanca quando o sal falta, em vez de resumir sem sal: um resumo sem sal parece
 * igualmente opaco e e reversivel em minutos, e essa e a diferenca que ninguem
 * enxerga olhando a coluna no banco.
 */
export function resumirOrigem(endereco: string, sal = process.env.SAL_DO_RESUMO_DE_ORIGEM): string {
  if (!sal) {
    throw new Error(
      'Falta a variavel SAL_DO_RESUMO_DE_ORIGEM. Sem sal secreto, o resumo do endereco ' +
        'e reversivel por forca bruta e deixa de cumprir o ADR-0002. Ver .env.example.'
    )
  }
  const normalizado = endereco.trim().toLowerCase()
  if (!normalizado) {
    throw new Error('Endereco vazio: nao ha o que resumir.')
  }
  return createHmac('sha256', sal).update(normalizado).digest('base64url')
}
