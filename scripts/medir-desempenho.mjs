#!/usr/bin/env node
/*
 * Mede desempenho, acessibilidade e SEO com o Lighthouse, nos dois modos do
 * interruptor. Roda com `npm run test:desempenho`, depois de `npm run build`.
 *
 *   1. site PUBLICADO: cada página da lista única de páginas públicas
 *      (src/lib/utils/paginas-publicas.json). Página que entra na lista passa
 *      a ser medida sem ninguém editar este arquivo;
 *   2. site NÃO publicado: só a raiz, que mostra "Portal em construção". É o
 *      que a produção mostra até a lancamento-r1.
 *
 * Cada modo sobe o servidor no modo explícito (scripts/iniciar-servidor.mjs),
 * para o `.env.local` de quem roda não trocar o modo. Limiar de desempenho e
 * de acessibilidade, preset e número de execuções vêm do lighthouserc.json, que
 * este script não repete: aqui só entram, por argumento, os endereços e o
 * comando de iniciar.
 *
 * O SEO tem mínimo de 95 só no modo publicado (decisão do Gabriel, Q7 (a) da
 * pagina-processo-seletivo). Por isso o mínimo mora aqui, e não numa asserção
 * do lighthouserc.json, que valeria para os dois modos. No não publicado, a
 * nota só é impressa. A medição é local, contra a versão compilada, e nenhuma
 * página declara "noindex": nenhuma auditoria sai da conta. A regra de tirar só
 * a "is-crawlable" vale para medição feita num endereço de prévia, que a Vercel
 * marca como não indexável, e não acontece aqui (design.md da change, D9).
 *
 * A saída diz quantas páginas mediu em cada modo, contadas no resultado que o
 * Lighthouse gravou (.lighthouseci/manifest.json), e não na lista de endereços
 * pedidos: sem resultado, a conta dá 0 e o modo reprova. Também imprime as três
 * notas de cada execução.
 *
 * Ver openspec/changes/layout-e-hero/design.md, D8, e
 * openspec/changes/pagina-processo-seletivo/design.md, D9.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = fileURLToPath(new URL('..', import.meta.url))
const ORIGEM = 'http://localhost:3000'
const lerJson = (caminho) => JSON.parse(readFileSync(join(raiz, caminho), 'utf8'))
const MANIFESTO = join(raiz, '.lighthouseci', 'manifest.json')
/** Sobre a nota do Lighthouse, de 0 a 1, sem arredondar: 0,945 reprova. */
const SEO_MINIMO = 0.95

const paginas = lerJson('src/lib/utils/paginas-publicas.json')
const executavelDoLhci = createRequire(import.meta.url).resolve('@lhci/cli/src/cli.js')

const MODOS = [
  {
    nome: 'site publicado',
    modo: 'publicado',
    urls: paginas.map((pagina) => `${ORIGEM}${pagina.endereco}`),
    cobraSeo: true,
  },
  { nome: 'site não publicado', modo: 'nao-publicado', urls: [`${ORIGEM}/`], cobraSeo: false },
]

/** A nota de 0 a 100, arredondada. Só para imprimir: a conta usa a nota como o Lighthouse a grava. */
const nota = (valor) => (typeof valor === 'number' ? Math.round(valor * 100) : 'sem nota')

/** SEO abaixo do mínimo, ou sem nota. Compara a nota sem arredondar. */
const seoAbaixoDoMinimo = (valor) => !(typeof valor === 'number' && valor >= SEO_MINIMO)

/** As execuções que o lhci gravou em .lighthouseci/. Sem manifesto, nenhuma. */
function execucoesDaUltimaMedicao() {
  if (!existsSync(MANIFESTO)) return []
  return JSON.parse(readFileSync(MANIFESTO, 'utf8'))
}

const resumo = []
let reprovado = null

for (const { nome, modo, urls, cobraSeo } of MODOS) {
  console.log(`\n[desempenho · ${nome}] páginas a medir: ${urls.length} (${urls.join(', ')})\n`)

  // Apagado antes, para a nota impressa nunca ser a do modo anterior.
  rmSync(MANIFESTO, { force: true })

  // Sem shell: cada argumento vai inteiro, com espaço e tudo, em qualquer terminal.
  const { status } = spawnSync(
    process.execPath,
    [
      executavelDoLhci,
      'autorun',
      '--config=lighthouserc.json',
      `--collect.startServerCommand=node scripts/iniciar-servidor.mjs ${modo}`,
      ...urls.map((url) => `--collect.url=${url}`),
    ],
    { cwd: raiz, stdio: 'inherit' }
  )

  const execucoes = execucoesDaUltimaMedicao()
  const medidas = new Set(execucoes.map(({ url }) => url)).size
  resumo.push(`[desempenho · ${nome}] páginas medidas: ${medidas} de ${urls.length} pedidas`)
  if (execucoes.length === 0) {
    resumo.push('  (sem notas: o lhci não gravou o resultado)')
  }

  const seoAbaixo = []
  for (const { url, summary } of execucoes) {
    const abaixo = cobraSeo && seoAbaixoDoMinimo(summary.seo)
    resumo.push(
      `  ${url}: desempenho ${nota(summary.performance)}, ` +
        `acessibilidade ${nota(summary.accessibility)}, SEO ${nota(summary.seo)}` +
        (cobraSeo ? '' : ' (SEO só impresso neste modo, sem mínimo)') +
        // Sem isto, 0,945 sairia "SEO 95" ao lado de "SEO abaixo de 95".
        (abaixo ? ` (abaixo do mínimo; sem arredondar: ${summary.seo ?? 'sem nota'})` : '')
    )
    if (abaixo) seoAbaixo.push(url)
  }

  if (status !== 0) {
    reprovado = `O Lighthouse reprovou no modo "${nome}" (código ${status}).`
  } else if (medidas === 0 || medidas < urls.length) {
    reprovado =
      `O modo "${nome}" mediu ${medidas} de ${urls.length} páginas: ` +
      'o resultado do Lighthouse não tem todas as páginas pedidas.'
  } else if (seoAbaixo.length > 0) {
    reprovado =
      `SEO abaixo de ${nota(SEO_MINIMO)} no modo "${nome}", em: ` +
      `${[...new Set(seoAbaixo)].join(', ')}.`
  }

  if (reprovado) break
}

console.log(`\n${resumo.join('\n')}`)
if (reprovado) {
  console.error(`\n${reprovado}`)
  process.exit(1)
}
