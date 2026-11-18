# Proposta — trocar o Spec Kit pelo OpenSpec

## Why

O plano v7 decidiu trocar a ferramenta de SDD: o processo do Spec Kit ficou maior que o produto
(a spec da F03, que é cabeçalho e menu, tem 461 linhas e 52 tarefas). Hoje as duas ferramentas
convivem no repositório, e o OpenSpec recém-instalado não conhece a constitution — todo agente
que abrir o projeto começa sem as regras e com dois conjuntos de comandos à vista.

Esta change não entrega nenhuma página. Ela deixa o repositório com uma ferramenta só, com o
contexto do projeto onde o OpenSpec o lê, e com uma descrição curta do que a `main` já faz.

## What Changes

- **Contexto e regras do projeto no OpenSpec.** `openspec/config.yaml` ganha o campo `context`
  escrito a partir de `docs/constitution.md` — contexto da liga, os dez princípios e a hierarquia
  de decisão — e o campo `rules`, com os limites de cada artefato: proposta em português, que cabe
  em cinco minutos de leitura e sempre lista o que fica fora de escopo; `tasks` com no máximo 15
  tarefas, cada uma com critério verificável; specs que descrevem comportamento, sem nome de
  biblioteca.
- **Spec Kit fora do caminho, sem nada apagado.** Movidos, não removidos:
  `.specify/` (21 arquivos) e as 10 skills `.claude/skills/speckit-*` vão para
  `docs/historico/spec-kit/`; `specs/001-fundacao-tecnica`, `002-design-system` e
  `003-camada-de-dados` (31 arquivos) vão para `docs/historico/specs/`.
  **Não existe uma pasta `specs/004`** — o briefing cita "001 a 004" e o repositório tem três.
- **Três specs de base**, curtas, descrevendo o que a `main` faz hoje: `fundacao-e-ci`,
  `design-tokens` e `camada-de-dados`. A F03 não entra: ela não está na `main`.
- **README.** Entra a seção "Como trabalhamos", apontando para o OpenSpec e para
  `docs/EQUIPE-DE-AGENTES.md`, e registrando a **versão do CLI do OpenSpec** em uso — sem ela o
  teste do RP-13 (`openspec update` e `git status --porcelain` vazio) só fecha por coincidência.
  Saem as menções a `/speckit.*`. Os links e a tabela de hierarquia que apontam para
  `specs/<feature>/` passam a apontar para os caminhos novos.
- **`.prettierignore`.** As linhas `specs/` e `.specify/` passam a apontar para caminhos que não
  existem mais; o destino `docs/` já está ignorado. As duas linhas saem.
- **A change é arquivada antes do PR**, e não depois do merge: a `main` é protegida, e arquivar
  depois exigiria um segundo PR só para isso. `docs/PLANO-DE-DESENVOLVIMENTO.md` (seção 9) e
  `docs/EQUIPE-DE-AGENTES.md` (seção 4) já foram atualizados pelo gestor com essa ordem e entram
  no commit desta change.
- **Nenhuma verificação do CI é removida** e nenhum arquivo de `src/` é tocado.

## Capabilities

### New Capabilities

- `fundacao-e-ci`: o esqueleto do projeto e o portão automático — Next.js com TypeScript estrito,
  as verificações do `npm run verificar`, o CI de um job só e a página "Portal em construção".
- `design-tokens`: a única fonte de cor, espaçamento, raio, sombra e tipografia e os componentes
  de base que a consomem. A vitrine fica de fora: a R1 refaz os componentes e decide se ela fica.
- `camada-de-dados`: o esquema versionado do Supabase, o controle de acesso por linha em toda
  tabela e os tipos gerados a partir do esquema.

### Modified Capabilities

Nenhuma. `openspec/specs/` está vazio: estas três são as primeiras.

## Impact

| O que | Efeito |
|---|---|
| `src/`, `tests/`, `scripts/`, `supabase/` | Nenhum arquivo tocado |
| `.github/workflows/ci.yml` | Nenhuma verificação removida nem acrescentada |
| `.specify/`, `specs/`, `.claude/skills/speckit-*` | Movidos para `docs/historico/`, preservados |
| `.prettierignore` | Duas linhas removidas, nenhuma regra afrouxada |
| `README.md` | Seção nova e links corrigidos |
| `openspec/` | Config com contexto, três specs de base e esta change |
| Dependências do projeto | **Nenhuma nova** — o OpenSpec é CLI global, não entra no `package.json` |

## Decisões do Portão 1 (aprovado em 18/11/2026)

**Q1 — o critério "zero `speckit` fora de `docs/historico/`" foi reescrito.** Aprovado como
recomendado: `docs/F00-fundacao.md` e `docs/F00-runbook-gabriel.md` vão para `docs/historico/`;
`docs/PLANO-DE-DESENVOLVIMENTO.md` e `docs/ADR-0002-envio-de-email.md` **ficam como estão** — o
plano precisa continuar registrando que o Spec Kit saiu, e ADR não se edita. O critério passa a
ser: zero ocorrências fora de `docs/historico/`, do plano v7 e do ADR-0002.

**Q2 — as skills duplicadas.** Aprovado como recomendado: versionar `.claude/skills/openspec-*` e
ignorar `.agents/`. A exceção do RP-13 nomeia o comando que a demonstra — `openspec update`
seguido de `git status --porcelain` vazio — e o README registra a versão do CLI com que o teste
foi feito, porque o resultado depende dela.

**Q3 — as specs de base chegam a `openspec/specs/` pelo arquivamento, não pelo sync.** O Gabriel
decidiu contra a recomendação: em vez de `openspec sync specs`, esta change roda
`openspec validate --all --strict`, depois `openspec archive`, e o validate de novo — tudo antes
do PR, porque a `main` é protegida e arquivar depois do merge exigiria um segundo PR.
