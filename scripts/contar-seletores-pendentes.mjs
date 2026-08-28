#!/usr/bin/env node
/*
 * Conta os seletores que ainda esperam conversão no `liacup.css`.
 *
 * POR QUE ISTO É UM SCRIPT, E NÃO UM COMANDO DENTRO DO PRÓPRIO CSS
 *
 * A F03 escreveu o comando de contagem como texto no banner do `liacup.css`, e
 * ele passou a **se contar**. Duas coisas deram errado ao mesmo tempo:
 *
 *   1. o texto do comando trazia uma substituicao de espacos em branco cuja
 *      escrita termina em asterisco seguido de barra — a mesma sequencia que
 *      FECHA um comentario de CSS. O bloco terminou antes da hora e o resto do
 *      banner virou conteudo do arquivo, a ponto de uma contagem ler o nome de
 *      uma classe e um titulo de paragrafo como se fossem seletores;
 *
 *      (esta linha nao repete a sequencia de proposito: escrever o exemplo
 *      literal aqui dentro quebraria ESTE comentario tambem, e foi exatamente
 *      o que aconteceu na primeira versao deste arquivo)
 *   2. três linhas do próprio comando começam com caractere que passa no
 *      `^[^/@}]` e contêm `{`, então entravam na conta. O comando devolvia 25
 *      onde o número certo é 22.
 *
 * A classe do defeito, para o catálogo: **a regra de contagem morava dentro da
 * coisa contada, e o instrumento passou a se medir junto.** A decisão de
 * escrever o comando em vez de descrever a regra em prosa estava certa; o erro
 * foi o lugar. Aqui fora, o script tira os comentários ANTES de contar, e por
 * isso é imune ao que estiver escrito neles.
 *
 * REGRA DE CONTAGEM: do primeiro seletor pendente até o fim do arquivo,
 * separando por vírgula. Os primeiros seletores pendentes são os da família
 * `.radio`/`.seg`, que ficam ACIMA do banner — é por isso que "abaixo do
 * banner" nunca reproduziu o número.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ARQUIVO = resolve(process.cwd(), 'liacup.css')
const PRIMEIRO_PENDENTE = '.radio'

function naoVerificou(motivo) {
  console.error('\n=== NAO VERIFICADO — seletores pendentes no liacup.css ===\n')
  console.error('  seletores contados: 0\n')
  console.error(`  ${motivo}\n`)
  console.error('  Zero contado e zero pendente produzem o mesmo numero. Sem saber qual')
  console.error('  dos dois aconteceu, a contagem nao prova nada.\n')
  process.exit(1)
}

let css
try {
  css = readFileSync(ARQUIVO, 'utf8')
} catch (erro) {
  naoVerificou(`nao foi possivel ler ${ARQUIVO}: ${erro.message}`)
}

/*
 * Comentarios fora ANTES de qualquer coisa. Preserva as quebras de linha para
 * os numeros de linha continuarem batendo com o arquivo original.
 */
const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, (bloco) => bloco.replace(/[^\n]/g, ' '))

const linhas = semComentarios.split('\n')
const inicio = linhas.findIndex((linha) => linha.trimStart().startsWith(PRIMEIRO_PENDENTE))
if (inicio < 0) {
  naoVerificou(
    `nao encontrei o primeiro seletor pendente (${PRIMEIRO_PENDENTE}) fora de comentario`
  )
}

const seletores = []
for (const linha of linhas.slice(inicio)) {
  const encontrado = linha.match(/^([^/@}][^{]*)\{/)
  if (!encontrado) continue
  for (const parte of encontrado[1].split(',')) {
    const limpo = parte.trim()
    if (limpo) seletores.push(limpo)
  }
}

if (seletores.length === 0) {
  naoVerificou('nenhum seletor foi contado a partir do primeiro pendente')
}

/* Agrupa por familia, que e como a leitura humana confere o total. */
const familias = new Map()
for (const seletor of seletores) {
  const familia = seletor.match(/^\.[a-z-]+/)?.[0] ?? seletor
  familias.set(familia, (familias.get(familia) ?? 0) + 1)
}

console.log('\nSeletores pendentes no liacup.css\n')
console.log(`  contagem a partir de ${PRIMEIRO_PENDENTE}, ate o fim do arquivo`)
console.log(`  linhas de comentario removidas antes de contar: sim\n`)
for (const [familia, quantidade] of [...familias].sort()) {
  console.log(`    ${familia.padEnd(16)} ${quantidade}`)
}
console.log(`\n  TOTAL: ${seletores.length} seletores\n`)
