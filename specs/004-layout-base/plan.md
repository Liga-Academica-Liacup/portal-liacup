# Plano de implementação: Layout base (F03)

**Branch**: `feat/F03-layout-base` | **Data**: 2026-08-27 | **Spec**: [spec.md](./spec.md)

**Input**: especificação aprovada em `specs/004-layout-base/spec.md`, com as correções de FR-039 e
SC-018 aprovadas por Gabriel em 27/08/2026.

## Sumário

Entregar a moldura das dez páginas públicas: cabeçalho fixo de até 64 px no mobile, navegação
desktop, painel lateral acessível, conversão principal sempre visível, rodapé com contatos e rotas
provisórias explicitamente marcadas.

A abordagem técnica usa um layout do grupo `(site)`, um catálogo JSON único para navegação e todas
as verificações, Server Components por padrão e uma única ilha cliente apoiada no `<dialog>` nativo.
Botão e link-botão compartilham o mesmo módulo de aparência. Playwright percorre 10 páginas × 7
larguras, e o Lighthouse passa a derivar as mesmas dez URLs e conferir os relatórios reais. A
pesquisa completa está em [research.md](./research.md).

## Contexto técnico

**Linguagem/Versão**: TypeScript 5.9.3 estrito · React 19.2.8 · Next.js 16.3.1 (App Router) · Node
22 ou superior

**Dependências principais**: **nenhuma nova.** Permanecem 22 diretas — 4 de execução e 18 de
desenvolvimento

**Armazenamento**: nenhum. A moldura não lê banco e não cria entidade persistente

**Testes**: Vitest + Testing Library para componentes de `ui/` e contratos isolados · Playwright +
axe-core para rotas, landmarks, teclado, alvos, responsividade e igualdade visual · Lighthouse CI
contra build de produção

**Plataforma alvo**: navegadores modernos atendidos pelo Next.js, com mobile a partir de 360 px como
caso principal e desktop a partir do corte aprovado de 1024 px

**Tipo de projeto**: aplicação web Next.js existente, com App Router e um único pacote

**Metas de desempenho**: Lighthouse mobile simulado com desempenho ≥ 90 e acessibilidade ≥ 95 em
10/10 rotas, três execuções por rota

**Restrições**: cabeçalho ≤ 64 px em 360/390/430/480 · alvo de toque ≥ 44 px · zero rolagem
horizontal em 7 larguras · zero violações axe · zero valores de estilo à mão · zero token existente
alterado · exatamente uma região de cada tipo · zero dependências novas esperadas

**Escala/Escopo**: 10 destinos públicos · 10 rotas · 7 larguras · 70 combinações página/largura ·
7 percursos de teclado · 5 seletores `.nav` removidos · 1 token novo com origem nomeada · 2 ícones
novos · 1 catálogo compartilhado

## Checagem contra a constituição

_PORTÃO: passa antes da Fase 0 e foi reavaliado após a Fase 1._

| Princípio | Como este plano cumpre | Situação |
| --- | --- | --- |
| **I — Quem mantém vem antes** | HTML nativo, rotas explícitas, catálogo único, comentários contratuais e zero dependências novas | ✅ |
| **II — Acessibilidade** | `<dialog>` modal, foco real, retorno de foco, skip link, `aria-current`, indicação não cromática, 44 px, axe e contraste medidos | ✅ |
| **III — Mobile é principal** | orçamento de 61,6 px no cabeçalho, CTA fora do menu, sete larguras e Lighthouse mobile explícito | ✅ |
| **IV — Segurança e dados** | nenhuma coleta, banco, segredo ou chamada externa nova | ✅ (não se aplica) |
| **V — A spec manda** | FR-039 e SC-018 foram reportados e corrigidos por Gabriel antes do plano; nenhum conteúdo de F04–F13 entra | ✅ |
| **VI — Fidelidade** | família `.nav` convertida pelo valor efetivo, correção da ADR-0003 aplicada e `FIDELIDADE.md` exige motivo por diferença | ✅ |
| **VII — Nada entra sem verificação** | 10×7, 7/7 teclado, Lighthouse 30/30, Vitest e demonstrações falhar→verde com contadores | ✅ |
| **VIII — Honestidade** | nove páginas dizem visivelmente que estão em construção; limites ficam registrados | ✅ |
| **IX — Componentização** | layout público compõe; ilha cliente mínima; `ui/` genérico; aparência compartilhada; nenhuma feature conhece outra | ✅ |

**Portão antes da pesquisa: PASSA.** Nenhuma violação precisa de justificativa.

**Reavaliação após o design**: `data-model.md` não cria armazenamento; os contratos mantêm o link
genérico fora de `layout`, restringem a fronteira cliente e fecham `className/style`; o quickstart
mede todos os critérios com saída objetiva. `LinksDeContato` muda para `<address>` justamente para
não violar o landmark único. **Portão continua passando.**

## Estrutura do projeto

### Documentação desta feature

```text
specs/004-layout-base/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── FIDELIDADE.md
├── EVIDENCIAS-F03.md             # criado/preenchido na implementação
├── contracts/
│   ├── componentes.md
│   ├── navegacao.md
│   └── verificacoes.md
└── checklists/
    └── requirements.md
```

### Código-fonte previsto

```text
src/
├── app/
│   ├── layout.tsx                         # raiz global; não recebe moldura pública
│   ├── (interno)/vitrine/
│   │   ├── BotaoDemo.tsx                  # pares Botao/Link para SC-018
│   │   └── IconeDemo.tsx                  # quatro ícones
│   └── (site)/
│       ├── layout.tsx                     # skip + cabeçalho + main + rodapé
│       ├── layout.module.css
│       ├── page.tsx                       # rota /
│       ├── sobre/page.tsx
│       ├── noticias/page.tsx
│       ├── conteudo-educativo/page.tsx
│       ├── eventos/page.tsx
│       ├── projetos/page.tsx
│       ├── materiais/page.tsx
│       ├── galeria/page.tsx
│       ├── processo-seletivo/page.tsx
│       └── contato/page.tsx
├── componentes/
│   ├── ui/
│   │   ├── AparenciaDeBotao.module.css
│   │   ├── aparencia-de-botao.ts
│   │   ├── Botao.tsx + Botao.test.tsx
│   │   ├── LinkComAparenciaDeBotao.tsx + .test.tsx
│   │   └── Icone.tsx + Icone.test.tsx
│   └── layout/
│       ├── destinos-publicos.json
│       ├── destinos-publicos.ts
│       ├── Cabecalho.tsx + Cabecalho.module.css
│       ├── NavegacaoPublica.tsx + NavegacaoPublica.module.css
│       ├── Rodape.tsx + Rodape.module.css
│       └── LinksDeContato.tsx + .module.css + .test.tsx
└── estilos/tokens.css                    # somente +--font-size-marca

tests/e2e/
├── apoio/medicoes.ts
├── paginas-publicas.spec.ts
├── navegacao-teclado.spec.ts
└── vitrine.spec.ts                       # comparação visual compartilhada

scripts/verificar-paginas-lighthouse.mjs
lighthouserc.cjs                          # substitui lighthouserc.json
liacup.css                                # família .nav removida; 27 → 22
package.json                              # test:desempenho encadeia verificador
```

**Decisão de estrutura**: a moldura mora no grupo de rotas públicas; os componentes de layout ficam
na camada já protegida pelo ESLint; `LinkComAparenciaDeBotao` fica em `ui/` porque é primitivo
genérico com consumidores futuros nomeados. O catálogo mora junto da navegação e é importado por
testes/configuração, nunca ao contrário.

## Decisões de desenho executáveis

### Moldura e semântica

- Um `<header>`, um `<nav>` acessível, um `<main>` focável por fragmento e um `<footer>` por página.
- `LinksDeContato` usa `<address>`, não `<nav>`.
- O skip link é o primeiro focável e só aparece visualmente com foco.
- O cabeçalho permanece visível durante rolagem, com superfície opaca de token existente.
- A página atual usa `aria-current="page"` e marcador que não depende só de cor.

### Responsividade e painel

- Abaixo de 1024 px: marca, CTA de processo seletivo e botão do painel visíveis.
- A partir de 1024 px: navegação textual direta; botão e diálogo fora da árvore acessível.
- `<dialog>` fornece modalização; eventos próprios fecham por destino, Esc e backdrop.
- A trava de rolagem restaura o valor anterior, inclusive em unmount e resize.
- O plano B de 1024 reduz somente o gap de `--space-4` para `--space-3`; nova largura é proibida.

### Aparência compartilhada

- Um CSS Module e um helper fornecem classes para `Botao` e link.
- Ambos recusam `className` e `style` pelo tipo.
- O link aceita três variantes textuais e largura total; não aceita ícone nem desabilitado.
- A vitrine compara propriedades calculadas contratadas e informa a quantidade de pares.

### Fonte única e verificação

- O JSON canônico contém exatamente dez caminhos únicos e uma conversão principal.
- Playwright e Lighthouse importam esse arquivo diretamente.
- Rotas são explícitas; destino sem arquivo precisa falhar como 404.
- O pós-Lighthouse lê `manifest.json`, não arquivos soltos, e comprova 10/10 e 30/30.
- Toda verificação nova ganha demonstração falhar→verde registrada em `EVIDENCIAS-F03.md`.

## Dependências e justificativa

**Total: 22 — 4 de execução e 18 de desenvolvimento. Nenhuma entra e nenhuma sai.**

| Capacidade | O que já cobre |
| --- | --- |
| React/Next | Server Components, App Router, `usePathname`, `<Link>` e ilha cliente |
| Plataforma web | `<dialog>`, foco, eventos de teclado e estilo calculado |
| CSS Modules | tokens, responsividade e aparência compartilhada |
| Vitest + Testing Library | contratos dos componentes de `ui/` |
| Playwright + axe-core | teclado real, landmarks, 10×7, alvos, scroll e acessibilidade |
| Lighthouse CI | desempenho/acessibilidade mobile contra build |

Bibliotecas de drawer, foco, scroll lock, variantes e ícones foram recusadas em
[research.md](./research.md), D4, D5, D9 e D12.

## Fidelidade e contraste

O arquivo [FIDELIDADE.md](./FIDELIDADE.md) é o registro obrigatório do RP-08/RP-09. A implementação
deve preencher, no mínimo:

- valores efetivos dos cinco seletores `.nav` antes da remoção;
- `--color-text` sobre `--color-bg` e `--color-surface`;
- `--color-accent-700` sobre as duas superfícies;
- CTA: texto `--color-bg` sobre `--color-accent-600`;
- `--color-neutral-700` do rodapé sobre as duas superfícies;
- bordas/separadores, deixando explícito quando são decorativos;
- cada mudança comportamental/visual: 44 px, cabeçalho ≤ 64, comportamento fixo, painel e marcador atual.

Toda linha não idêntica exige motivo e veredito. Número de contraste sempre nomeia as duas cores e
a superfície.

## Riscos e respostas

| Risco | Resposta do plano |
| --- | --- |
| Duas listas de destinos divergirem | catálogo JSON único + adaptador + consumidores diretos |
| 404 ter pontuação Lighthouse aceitável | pós-script exige auditoria HTTP e URL final esperada |
| Dois landmarks de navegação | `LinksDeContato` vira `<address>` e o teste conta landmarks |
| Menu fechar sem devolver foco | percursos reais por Esc/destino/backdrop e teste de foco ativo |
| Resize deixar scroll travado | cleanup restaura valor anterior e caso específico mobile→desktop |
| `Botao` e link voltarem a divergir | mesmo CSS/helper + comparação de estilo calculado |
| Seletor `.nav a` afetar CTA | classes explícitas apenas nos links textuais |
| Cabeçalho não caber em 1024 | plano B fechado; falha posterior vira parada, não novo breakpoint |
| Verificador passar sem medir | contadores 10/10, 30/30, 7/7 e totais de alvos/violações |
| Página provisória parecer conteúdo real | somente título e aviso de construção, sem texto institucional |

## Rastreamento de complexidade

Sem violações da constituição a justificar. Seção mantida vazia de propósito.
