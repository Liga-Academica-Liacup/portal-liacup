import { readdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import proximoCoreWebVitals from 'eslint-config-next/core-web-vitals'
import proximoTypescript from 'eslint-config-next/typescript'
import jsxA11y from 'eslint-plugin-jsx-a11y'

const raiz = dirname(fileURLToPath(import.meta.url))

/*
 * O eslint-config-next 16 ja e config flat nativa e registra os plugins `import`
 * e `jsx-a11y`. Por isso nao usamos FlatCompat, que exigiria @eslint/eslintrc —
 * uma dependencia transitiva usada como direta, que e justamente o que a tabela
 * de dependencias do plan.md nao admite. Os dois plugins seguem declarados no
 * package.json porque usamos as regras deles diretamente aqui embaixo.
 */

/*
 * ZONAS GERADAS — a parte que nao pode apodrecer.
 *
 * A regra "uma feature nunca importa de outra" precisa de uma zona por feature.
 * Escrever essas zonas a mao significa que criar features/eventos e esquecer de
 * registra-la deixa o buraco aberto, com o CI verde. Entao lemos os diretorios
 * de src/features/ agora, em tempo de carga, e emitimos uma zona por feature.
 * Feature nova nasce protegida, sem ninguem lembrar de nada.
 */
function zonasEntreFeatures() {
  const base = join(raiz, 'src', 'features')
  if (!existsSync(base)) return []
  return readdirSync(base, { withFileTypes: true })
    .filter((entrada) => entrada.isDirectory())
    .map((entrada) => ({
      target: `./src/features/${entrada.name}`,
      from: './src/features',
      except: [`./${entrada.name}`],
      message:
        `A feature "${entrada.name}" nao pode importar de outra feature. ` +
        'Duas features que precisam conversar conversam pela rota que as compoe, em src/app/. ' +
        'Ver docs/PADROES-DE-CODIGO.md, secao 1.',
    }))
}

const zonasFixas = [
  {
    target: './src/componentes/ui',
    from: './src/features',
    message:
      'componentes/ui nao pode importar de features. A camada base nao conhece dominio: ' +
      'ela recebe props e desenha. Ver docs/PADROES-DE-CODIGO.md, secao 1.',
  },
  {
    target: './src/componentes/ui',
    from: './src/lib/supabase',
    message: 'componentes/ui nao pode falar com o banco. Quem fala e features/<dominio>/dados.ts.',
  },
  {
    target: './src/componentes/ui',
    from: './src/app',
    message: 'componentes/ui nao pode conhecer rota. Ver docs/PADROES-DE-CODIGO.md, secao 1.',
  },
  {
    target: './src/componentes/padroes',
    from: './src/features',
    message: 'componentes/padroes nao pode importar de features.',
  },
  {
    target: './src/componentes/padroes',
    from: './src/lib/supabase',
    message: 'componentes/padroes nao pode falar com o banco.',
  },
  {
    target: './src/componentes/layout',
    from: './src/features',
    message:
      'componentes/layout nao pode importar de features. Um cabecalho nao conhece noticia: ' +
      'quem compoe e a rota, que passa por props. Ver docs/PADROES-DE-CODIGO.md, secao 1.',
  },
  {
    target: './src/componentes/layout',
    from: './src/lib/supabase',
    message:
      'componentes/layout nao pode falar com o banco. Quem fala e features/<dominio>/dados.ts.',
  },
  {
    target: './src/componentes/layout',
    from: './src/app',
    message: 'componentes/layout nao pode conhecer rota. Ver docs/PADROES-DE-CODIGO.md, secao 1.',
  },
  {
    target: './src/lib',
    from: './src/features',
    message:
      'lib nao pode importar de features. Camada de apoio que conhece quem apoia deixa de ser apoio. ' +
      'Ver docs/PADROES-DE-CODIGO.md, secao 1.',
  },
  {
    target: './src/lib',
    from: './src/componentes',
    message: 'lib nao pode importar de componentes.',
  },
  {
    target: './src/lib',
    from: './src/app',
    message: 'lib nao pode importar de app.',
  },
]

const configuracao = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
      'liacup.css',
      'next-env.d.ts',
    ],
  },
  ...proximoCoreWebVitals,
  ...proximoTypescript,
  {
    // O plugin ja vem registrado pelo config do Next; aqui so subimos o conjunto
    // de regras para o recomendado completo (Principio II da constitution).
    rules: { ...jsxA11y.configs.recommended.rules },
  },
  {
    rules: {
      'import/no-restricted-paths': [
        'error',
        { basePath: raiz, zones: [...zonasFixas, ...zonasEntreFeatures()] },
      ],
    },
  },
]

export default configuracao
