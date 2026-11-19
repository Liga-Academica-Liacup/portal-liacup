# Relatório — montar-equipe-de-agentes

Esta change cria a equipe, então cinco dos seis agentes ainda não existiam para trabalhar nela. O
líder técnico fez o trabalho deles, e cada seção abaixo diz isso em vez de simular.

## especificador

Não entrou: o agente nasce nesta change. O líder técnico escreveu os artefatos.

- **Artefatos:** `proposal.md`, `design.md`, `specs/equipe-de-agentes/spec.md`, `tasks.md` ·
  7 requisitos · 15 tarefas
- **Questões em aberto:** Q1 (escopo de escrita é instrução, não trava) e Q2 (modo de equipes),
  as duas decididas no Portão 1
- **Incompleto:** nada

## dev-frontend

Não entrou: esta change não mexe em tela nem em `src/`.

## dev-dados

Não entrou: esta change não toca no banco.

## guardiao-visual

Não entrou: nenhuma tela muda, então não há print a comparar. O agente nasce com gabarito — 21
prints em `prototipo/prints/` — e sem página própria até a R1.

## qa-acessibilidade

Não entrou: nenhuma página nova. As verificações existentes rodaram pelo líder técnico —
`npm run verificar` código 0 (244 arquivos rastreados examinados, 56 varridos por tokens, 149 pela
chave de serviço com 35 entregues ao navegador) e `npm test` 71 passados de 71.

## revisor

A revisão rodou num subagente substituto com as instruções de `.claude/agents/revisor.md` coladas
no prompt, porque o agente `revisor` ainda não estava carregado: o Claude Code lê `.claude/agents/`
ao iniciar, e o arquivo nasceu depois. Os seis agentes passaram a estar disponíveis na mesma sessão,
ainda antes do commit.

**A trava foi exercitada, no `revisor` real.** O Gabriel pediu que ele criasse `tmp-trava.txt` na
raiz. Resultado medido:

| O que se mediu | Resultado |
| --- | --- |
| Arquivo criado | **Não.** `tmp-trava.txt` não existe na raiz |
| Ferramentas que o agente enxergou | `Read`, `Glob`, `Grep` e o canal de devolução. Nada mais, nem como ferramenta diferida |
| O que o impediu | **Ausência de ferramenta.** `Write` e `Bash` devolveram `No such tool available`, sem chegar a nenhuma política de permissão |
| `git status --porcelain` depois da passagem | 16 entradas, todas já no índice. Nenhuma linha nova |

A distinção que o projeto persegue, medida: o `revisor` não deixa de escrever porque foi instruído
a não escrever. Ele não tem por onde.

**Achado do próprio teste, corrigido:** o arquivo do `revisor` mandava escrever o relatório em
`openspec/changes/<change>/relatorio.md` — instrução impossível para um agente sem escrita, e foi
ele que apontou. O arquivo passou a dizer que ele devolve o relatório ao líder técnico, que o
transcreve.

- **Veredito:** aprovado com ressalva
- **Conferiu:** 16 arquivos · 11 das 15 tarefas (as que deixam rastro em arquivo) · as 7 regras de
  Git uma a uma · as 7 partes do modelo de entrega · 6 `description` · 5 declarações de escopo ·
  15 caminhos citados, todos existentes no disco
- **Achados, e o que foi feito:**
  1. os seis agentes não apontavam para `MODELO-relatorio.md` — **corrigido**, uma linha em cada;
  2. este `relatorio.md` não existia — **corrigido**;
  3. as 15 tarefas estavam desmarcadas com o trabalho feito — **corrigido**;
  4. o D1 do design dizia "seis linhas" de regras de Git, e são sete desde a E2 — **corrigido**;
  5. `MODELO-relatorio.md` tinha 73 linhas para um modelo que deve caber em uma tela —
     **corrigido**, 56 linhas;
  6. no modelo literal do `CLAUDE.md`, a linha `| Comando | Código de saída | Contadores |` não tem
     linha separadora e não renderiza como tabela — virou Q1, o Gabriel decidiu pela opção (a) e
     está **corrigido**: a separadora entrou, e o modelo deixa de ser cópia literal da E3 nesse
     ponto por decisão registrada.
- **Não conseguiu conferir:** as tarefas 4.3, 4.4 e 5.2 (comandos de terminal), se
  `docs/EQUIPE-DE-AGENTES.md` mudou apenas nas seções 3, 6 e 7, o `git status` depois de cada
  passagem, e a contagem A/M/R/D — tudo por não ter terminal.

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente.

- **Arquivos fora do escopo, por agente:** nenhum, em duas passagens. A do revisor substituto não
  deixou alteração nenhuma no `git status`; a do `revisor` real, no teste de trava, também não — e
  nela o `git status` era o próprio critério, porque o pedido era justamente que ele escrevesse.
- **Fora de escopo na change como um todo:** nenhum arquivo em `src/`, `tests/`, `scripts/`,
  `supabase/` ou `.github/`.

## Medição do modo de equipes (tarefa 4.2)

Claude Code **2.1.212**, medido em 18/11/2026: não existe modo de equipes para ligar. Subagentes da
mesma sessão não conversam entre si — a mensagem de um subagente sai e volta pela sessão principal.
Sessões diferentes trocam mensagens, mas cada agente como sessão própria foi descartado: permissões
são por sessão, a memória compartilhada já é o repositório, e seriam seis contextos para coordenar o
que um coordena. **Nada foi ligado.** O gestor já registrou o resultado na seção 3 de
`docs/EQUIPE-DE-AGENTES.md`.
