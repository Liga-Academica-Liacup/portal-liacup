# Design — trocar o Spec Kit pelo OpenSpec

## Context

Ver `proposal.md` — Why. O que importa aqui é o estado medido do repositório em 18/11/2026:

| O que | Onde | Tamanho |
|---|---|---|
| Spec Kit | `.specify/` | 21 arquivos |
| Skills do Spec Kit | `.claude/skills/speckit-*` | 10 skills, versionadas |
| Specs da fase anterior | `specs/001`, `002`, `003` | 31 arquivos. **Não há `004`** |
| OpenSpec recém-instalado | `openspec/`, `.claude/skills/openspec-*`, `.agents/skills/` | 6 skills, duplicadas em dois lugares |
| `openspec/config.yaml` | criado pelo `init` | campo `context` vazio |

O CI é um job único chamado `Verificacoes`, com 13 etapas e nenhuma `continue-on-error`. Nenhuma
delas lê `specs/` ou `.specify/`, o que torna as movimentações seguras do ponto de vista do CI.
O `.prettierignore`, sim, cita os dois caminhos — e já ignora `docs/`, o destino.

## Goals / Non-Goals

**Goals:**

- Uma ferramenta de SDD só, visível a quem abre o repositório.
- O contexto do projeto onde o OpenSpec o lê, sem depender de ninguém colar a constitution.
- `openspec/specs/` descrevendo o que a `main` faz hoje, para a próxima change ter de onde partir.
- Nada apagado: tudo que sai do caminho continua consultável em `docs/historico/`.

**Non-Goals:**

- Nenhum arquivo de `src/`, `tests/`, `scripts/` ou `supabase/` muda de comportamento.
- Nenhuma verificação do CI entra ou sai — isso é a change `ajustar-ci-ao-novo-fluxo`.
- A F03 não é descrita em spec nenhuma: ela não está na `main`.
- Os subagentes de `.claude/agents/` são a change seguinte, `montar-equipe-de-agentes`.

## Decisions

### D1 — Mover, nunca apagar; `git mv`, não copiar e excluir

As movimentações usam `git mv`, que preserva o histórico de cada arquivo. Copiar e apagar
produziria o mesmo resultado na árvore e perderia a linhagem de 52 arquivos.
**Alternativa descartada:** apagar e confiar no histórico do Git. O plano v7 diz que o material da
fase anterior vai para `docs/historico/`, "fora do caminho", não para fora do repositório — e
quem assumir o projeto não vai arqueologia de commits para entender uma decisão de agosto.

### D2 — O `context` do config é um resumo da constitution, e as `rules` são os limites por artefato

O OpenSpec lê `context` em toda geração de artefato e o campo tem limite de 51.200 bytes. A
constitution tem 4.583 bytes, então caberia inteira — mas o campo serve para **restringir o que o
agente escreve**, e repetir o documento inteiro a cada artefato gasta contexto sem acrescentar
regra. O campo traz: o contexto da liga em três linhas, os dez princípios em forma de restrição, e
a hierarquia de decisão. O documento continua sendo a fonte, e o campo diz onde ele está.

O campo `rules` é separado de propósito: `context` descreve o projeto, `rules` restringe cada
artefato. O limite de 15 tarefas e o de cinco minutos de leitura vêm do princípio 7 da
constitution, e escrevê-los em `rules` é o que os faz valer em toda proposta futura sem ninguém
precisar lembrar — a constitution passa a ser aplicada pela ferramenta, não pela memória.

### D3 — O arquivamento acontece antes do PR, e é ele que preenche `openspec/specs/`

**Decidido pelo Gabriel no Portão 1**, contra a recomendação de usar `openspec sync specs`.
As três specs nascem como delta em `openspec/changes/<change>/specs/`, que é o caminho que o
OpenSpec valida; `openspec archive` as promove para `openspec/specs/` e move a change para
`openspec/changes/archive/`. Tudo isso **dentro do commit que vai para o PR**.

O motivo é a proteção da `main`: arquivar depois do merge significaria um segundo PR só para
mexer em `openspec/`. O custo é que o Portão 2 passa a olhar uma change já arquivada — e se ele
pedir ajuste, ela volta do arquivo antes do merge, como `docs/PLANO-DE-DESENVOLVIMENTO.md`
seção 9 agora registra.

O validate roda **duas vezes**, antes e depois do arquivamento, porque são duas perguntas
diferentes: a primeira é "a change está íntegra"; a segunda é "as specs promovidas continuam
válidas sozinhas, sem a change que as criou".
**Alternativa descartada:** escrever direto em `openspec/specs/`. Deixa esta change sem delta
nenhum, o que obrigaria `skip_specs: true` e tornaria `openspec validate --all --strict` um
comando que não mede nada — justo o critério de aceite desta change.

### D4 — Nível das specs de base: o que a `main` garante, não o que ela contém

Cada spec descreve comportamento observável e verificável por comando, não inventário de arquivo.
São 5, 3 e 5 requisitos, com um cenário cada. Duas emendas do Portão 1 moldaram esse corte: a
vitrine saiu de `design-tokens`, porque a R1 refaz os componentes e decide se ela fica, e o
Lighthouse ganhou requisito próprio em `fundacao-e-ci`, separado do e2e — são dois portões
diferentes, com limiares diferentes, e juntá-los num cenário só escondia isso. Pelo mesmo motivo
o requisito do `npm run verificar` deixou de fixar quantidade e ordem das conferências: a lista
muda na change `ajustar-ci-ao-novo-fluxo`, e spec que conta etapas vira spec desatualizada. É deliberadamente menos do que as 46 exigências da
spec da F03: spec de base existe para a próxima change saber o que não pode quebrar.

### D5 — `docs/F00-*` saem do caminho junto com o Spec Kit (**aprovado no Portão 1**)

`docs/F00-fundacao.md` e `docs/F00-runbook-gabriel.md` são o briefing e o runbook da F00, escritos
inteiramente em torno de `/speckit.*`. Eles descrevem um processo que deixa de existir, e são a
maior parte das ocorrências restantes da palavra. Vão para `docs/historico/`.
`docs/PLANO-DE-DESENVOLVIMENTO.md` e `docs/ADR-0002` **ficam como estão**: o plano precisa
continuar registrando que o Spec Kit saiu, e ADR não se edita.

### D6 — Versionar `.claude/skills/openspec-*`, ignorar `.agents/` (**aprovado no Portão 1**)

As duas pastas têm conteúdo idêntico; `.claude/skills/` é a que o Claude Code lê, e era onde as
skills do Spec Kit já estavam versionadas. `.agents/` entra no `.gitignore`.
Pelo RP-13, a exceção é nominal e o motivo nomeia um comando: as skills são geradas por
`openspec init`/`openspec update`, e **`openspec update` seguido de `git status --porcelain`
vazio** demonstra que o versionado confere com o que a ferramenta produz agora. Sem elas no
repositório, quem clonar não tem os comandos do fluxo — que é exatamente o que quebra.

O README registra a versão do CLI usada no teste. Sem ela a demonstração não se repete: uma
versão posterior do `openspec update` pode gerar skills diferentes, e aí o `git status` sujo
diria "alguém editou à mão" quando na verdade a ferramenta mudou.

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Uma movimentação quebra um caminho que ninguém lembrava | Antes de mover, `grep` por `specs/` e `.specify` em CI, scripts e configs. Levantado: só `.prettierignore` e um comentário em `scripts/verificar-tokens.mjs` |
| O `.prettierignore` deixa de cobrir os arquivos movidos e o `formatar:check` fica vermelho | `docs/` já está ignorado, e o destino é dentro de `docs/`. Conferido rodando `npm run formatar:check` depois da movimentação |
| O `git mv` no Windows com o GitHub Desktop aberto deixa `index.lock` preso | Regra 3 do `EQUIPE-DE-AGENTES.md`: fechar o GitHub Desktop antes. Vai escrito na entrega |
| O `revisor` não existe ainda para revisar este diff | O subagente é da change seguinte. Esta change é revisada pelo gestor no Portão 2, e isso fica declarado em vez de simulado |
| O Portão 2 pede ajuste numa change já arquivada | A change volta do arquivo antes do merge. O procedimento está em `docs/PLANO-DE-DESENVOLVIMENTO.md` seção 9, passo 9 |
| Spec de base descrever o que a `main` **deveria** fazer, e não o que ela faz | Cada requisito nasceu de um comando que existe no `package.json` ou de uma etapa do `ci.yml`, conferidos neste repositório |

## Open Questions

Nenhuma. Q1, Q2 e Q3 foram decididas no Portão 1 e estão registradas em `proposal.md` —
Q1 e Q2 como recomendado, Q3 trocando o `sync` pelo arquivamento antes do PR.
