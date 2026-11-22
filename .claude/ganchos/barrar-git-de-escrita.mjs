#!/usr/bin/env node
/*
 * A BARREIRA DO GIT — camada 1 (change endurecer-agentes-e-git-local, D1 e D2).
 *
 * Quem escreve no Git é o Gabriel. Este gancho roda antes de toda chamada das
 * ferramentas que rodam comando (Bash, PowerShell e mcp__terminal__run_in_terminal),
 * inclusive as dos subagentes. A decisão mora em ./decisao-do-git.mjs, que só tem
 * funções; este arquivo só lê a entrada e sai.
 *
 * COMO O CLAUDE CODE O CHAMA: a entrada é um JSON no stdin, com o comando em
 * `tool_input.command` e a pasta em `cwd`. Sair com 0, sem nada no stdout, deixa
 * passar. Sair com 2 recusa, e o erro padrão vai ao Claude. QUALQUER outro código
 * diferente de 0 é erro não bloqueante, que deixa o comando rodar: por isso todo erro,
 * inclusive o de carregar o módulo da decisão, é capturado e sai com 2 (falha
 * fechada).
 *
 * SEMPRE DECIDE: não há teste de "fui chamado direto?". Achado 2 do revisor: com esse
 * teste, um argv[1] diferente do caminho do arquivo fazia o gancho sair com 0 sem
 * decidir nada.
 */
import { readFileSync } from 'node:fs'

try {
  const { decidir, mensagemDeRecusa } = await import('./decisao-do-git.mjs')
  const entrada = JSON.parse(readFileSync(0, 'utf8'))
  const decisao = decidir(entrada?.tool_input?.command, { cwd: entrada?.cwd })
  if (decisao.permitido) {
    process.exitCode = 0
  } else {
    process.stderr.write(mensagemDeRecusa(decisao))
    process.exitCode = 2
  }
} catch (erro) {
  process.stderr.write(
    'Recusado pela barreira do Git: o gancho não conseguiu decidir, e na dúvida recusa.\n' +
      `Motivo: ${erro?.message}.\n`
  )
  process.exitCode = 2
}
