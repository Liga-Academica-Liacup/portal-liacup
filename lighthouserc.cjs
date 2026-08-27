/*
 * Configuração do Lighthouse CI.
 *
 * POR QUE .cjs E NÃO .json
 * O FR-044 exige **uma lista e dois consumidores**: as páginas que a navegação
 * desenha e as páginas que as verificações medem. JSON não consegue derivar
 * nada — as dez URLs teriam de ser escritas à mão aqui, criando a segunda lista
 * que diverge em silêncio no dia em que um destino for acrescentado. Em `.cjs`,
 * as URLs saem do mesmo `destinos-publicos.json` que a navegação lê.
 *
 * O `@lhci/cli` descobre este arquivo sozinho: `lighthouserc.cjs` está na lista
 * de nomes procurados, ANTES do `.json`. Isso importa — se ele não descobrisse,
 * o `autorun` rodaria sem configuração nenhuma, sem URLs e sem limiares, e
 * passaria tendo medido o padrão. Verde que não mediu nada.
 *
 * PERFIL MOBILE, DECLARADO E CONFERIDO
 * Não existe `preset: "mobile"` no Lighthouse — os únicos presets são `perf`,
 * `experimental` e `desktop`, e mobile é o PADRÃO. Aqui ele é declarado campo a
 * campo em vez de deixado implícito, e o
 * `scripts/verificar-paginas-lighthouse.mjs` confere o perfil no relatório
 * GERADO, não nesta configuração. É o que o FR-039 passou a exigir.
 */
const destinos = require('./src/componentes/layout/destinos-publicos.json')

const ORIGEM = 'http://localhost:3000'
const EXECUCOES_POR_ROTA = 3

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start',
      url: destinos.map((destino) => `${ORIGEM}${destino.caminho}`),
      numberOfRuns: EXECUCOES_POR_ROTA,
      settings: {
        formFactor: 'mobile',
        throttlingMethod: 'simulate',
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 1.75,
          disabled: false,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
}
