# Tarefas — trocar o Spec Kit pelo OpenSpec

15 tarefas, numeradas por grupo — o teto da constitution. Portão 1 aprovado em 18/11/2026 com as emendas E1 a E4;
as decisões Q1, Q2 e Q3 estão em `proposal.md`.

## 1. Contexto e regras do projeto no OpenSpec

- [x] 1.1 Preencher `context` em `openspec/config.yaml` a partir de `docs/constitution.md`
      (contexto da liga, os dez princípios como restrição, hierarquia de decisão) e `rules` com os
      limites por artefato — proposta em português, de cinco minutos de leitura, sempre listando o
      que fica fora de escopo; `tasks` com no máximo 15 tarefas, cada uma com critério
      verificável; specs descrevendo comportamento, sem nome de biblioteca. Verificar com
      `openspec context --json`, que precisa devolver a raiz resolvida sem erro de parse

## 2. Spec Kit fora do caminho

- [x] 2.1 `git mv` de `.specify/` e das 10 skills `.claude/skills/speckit-*` para
      `docs/historico/spec-kit/`, verificando com `find docs/historico/spec-kit -type f | wc -l`
      que os 21 arquivos do Spec Kit e as 10 skills chegaram inteiros
- [x] 2.2 `git mv` de `specs/001-fundacao-tecnica`, `002-design-system` e `003-camada-de-dados`
      para `docs/historico/specs/`, verificando que `specs/` deixou de existir na raiz e que
      `find docs/historico/specs -type f | wc -l` devolve 31
- [x] 2.3 **(Q1)** `git mv docs/F00-fundacao.md docs/F00-runbook-gabriel.md docs/historico/`,
      verificando que `grep -ril speckit docs/ --exclude-dir=historico` devolve só o plano v7 e o
      ADR-0002
- [x] 2.4 Limpar os dois caminhos que as movimentações deixam mortos: as linhas `specs/` e
      `.specify/` do `.prettierignore` (o destino `docs/` já está ignorado) e o comentário de
      `scripts/verificar-tokens.mjs:14`; verificar com `npm run formatar:check` e
      `npm run verificar:tokens` verdes
- [x] 2.5 **(Q2)** Acrescentar `.agents/` ao `.gitignore` e demonstrar a exceção do RP-13:
      `openspec update` seguido de `git status --porcelain` sem nenhuma linha de
      `.claude/skills/openspec-*`

## 3. README

- [x] 3.1 Escrever a seção "Como trabalhamos": o ciclo do OpenSpec (explore, propose, apply,
      archive antes do PR), os dois portões, o apontamento para `docs/EQUIPE-DE-AGENTES.md` e a
      versão do CLI do OpenSpec em uso, colhida de `openspec --version`; verificar que nenhuma
      linha do README cita `/speckit.*`
- [x] 3.2 Corrigir, no README, tudo que as movimentações invalidam: a tabela "Onde ficam as
      decisões" (linhas 4 e 5 citam `specs/<feature>/`, e a linha 1 diz "9 princípios" quando a
      constitution v3 tem dez), o link de dependências para `specs/001-fundacao-tecnica/plan.md` e
      a árvore de pastas; verificar que todo caminho citado no README existe no disco
- [x] 3.3 Atualizar o bloco "Estado atual" do README, que ainda diz "fundacao tecnica (F00)",
      para o estado do plano v7; verificar que o texto não promete página que não existe

## 4. Medir e arquivar

- [x] 4.1 Rodar `openspec validate --all --strict` e guardar a saída inteira — é o primeiro dos
      dois validates e vai para o relatório de entrega
- [x] 4.2 Rodar `grep -ri speckit . --exclude-dir=node_modules --exclude-dir=.git` e registrar a
      contagem por arquivo, com as exceções de Q1 nomeadas uma a uma
- [x] 4.3 Rodar `npm run verificar`, `npm test` e `npx playwright test`, registrando o resultado
      de cada um com número; o Lighthouse e o CI completo rodam no PR
- [x] 4.4 **(Q3)** Rodar `openspec archive` nesta change **antes do PR** e conferir que as três
      specs chegaram a `openspec/specs/` e que a change está em `openspec/changes/archive/`
- [x] 4.5 Rodar `openspec validate --all --strict` de novo, agora sobre as specs promovidas, e
      guardar a saída — é o segundo validate, e responde se elas se sustentam sem a change

## 5. Entrega

- [x] 5.1 Entregar ao Gabriel o relatório e os comandos Git para **ele** rodar — branch
      `chore/trocar-spec-kit-por-openspec` a partir da `main`, mensagem no padrão convencional em
      português, sem rodapé de coautoria — conferindo que `docs/PLANO-DE-DESENVOLVIMENTO.md` e
      `docs/EQUIPE-DE-AGENTES.md`, já atualizados pelo gestor, entram no mesmo commit

## Workflow follow-up

- Portão 2: o gestor confere o PR e o Gabriel incorpora. Esta change não tem prévia visual:
  nenhuma tela muda. Se o Portão 2 pedir ajuste, a change volta do arquivo antes do merge.
- O subagente `revisor` não existe ainda; ele nasce na change `montar-equipe-de-agentes` e passa a
  revisar os diffs a partir dela.
