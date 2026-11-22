# Proposta — endurecer os agentes e o Git local

## Why

Duas regras de segurança dos agentes dependem hoje só de alguém obedecer. "Agente não escreve no
Git" é instrução: na rodada 1 da `pagina-processo-seletivo`, o `dev-frontend` rodou `git rm` e
`git restore --staged`. "Arquivo de agente alterado para o ciclo" também é instrução: o `AGENTS.md`
que o `next dev` grava na raiz só fica fora do Git por uma linha do `.git/info/exclude` desta
máquina, e nada confere `.git/config`, `.git/hooks/` nem o próprio exclude (LB-05, LB-06). Sete
riscos aceitos da R0 apontam para esta change, com prazo na R0, e a regra 2 da dieta só passa a
valer quando estiver escrita. Change sem tela.

## What Changes

1. **Barreira versionada contra escrita no Git**, para todo agente, inclusive o líder técnico, nas
   três ferramentas que rodam comando: `Bash`, `PowerShell` e `mcp__terminal__run_in_terminal`
   (ajuste 1). Ela recusa antes de rodar todo `git` que não esteja numa lista fechada de leitura
   (status, diff, log, show, ls-files, ls-tree, grep, rev-parse, rev-list, ls-remote, check-ignore,
   cat-file, blame, merge-base e `branch` só para listar), mesmo disfarçado (`git -C . add`,
   `bash -c "git add …"`, depois de `;`, `&&`, `|` ou dentro de `$(…)`), e recusa também o que não
   conseguir analisar. Tudo o que não é leitura fica recusado: add, commit, push, rm, mv, restore,
   reset, checkout, switch, stash, merge, rebase, cherry-pick, tag, `branch -d/-D`, clean, fetch
   (Q2) e todo `gh` (Q3). A `mcp__terminal__run_in_terminal`, que digita no terminal do Gabriel,
   fica negada inteira no projeto, porque ferramenta MCP só aceita regra de negação pelo nome
   inteiro (`design.md`, D1). O que o Gabriel digita no terminal dele não muda.
2. **Conferência do ambiente local**, um comando versionado que o líder técnico roda antes de cada
   leva de pedidos de comando, antes dos comandos Git da entrega e depois de cada subagente. Ela
   compara com a `main`, pelo conteúdo e sem depender do `git status`, os arquivos de configuração e
   de instrução dos agentes que estão no disco. Lê `.git/config`, `.git/hooks/` e
   `.git/info/exclude` antes de rodar qualquer `git`. Para, com código diferente de 0, em toda
   diferença sem decisão registrada (LB-05, LB-06).
3. **`AGENTS.md` fora do repositório em qualquer clone** (Q4), e a lista do AS-17 passa a incluir
   os arquivos de instrução a agentes desse tipo. O AS-17 passa a conferir também o `agentRules:
   false` e o `experimental.agentFeedback` desligado no `next.config.*` (ajuste 3). A entrega traz
   o comando para o Gabriel tirar a linha do `.git/info/exclude` depois do merge.
4. **Os testes de política carregam só as variáveis que usam**, por nome, de uma lista. O segredo de
   bypass da Vercel deixa de entrar no ambiente deles.
5. **As quatro pendências do guardião na `pagina-processo-seletivo`**, escritas na §5: a busca por
   commit cobre tudo o que o push publica (B-01); o que conta como leitura dinâmica do ambiente,
   com os pontos que existem hoje (I-01); a precondição do `curl --version` (I-02); e a lacuna
   `<rota>` no parágrafo do `<endereço>` (I-03). Sem `gh` (Q3), quem confere, antes do P23, que a
   prévia serve o commit certo, e o host, é o Gabriel, no painel da Vercel (ajuste 2). O
   `design.md` arquivado não se edita.
6. **A regra 2 da dieta**, escrita na §5 e na spec `equipe-de-agentes`. O guardião confere na
   proporção do risco, e quem decide é a lista de arquivos do diff, não o julgamento:
   - change só de tela estática da R1: AS-01, AS-02, AS-04, AS-07 e AS-15;
   - checklist inteiro quando o diff toca `.claude/`, arquivos `.git*`, CI, `package.json` ou
     lockfile, `supabase/`, `src/proxy.ts`, `next.config`, variáveis de ambiente, cabeçalhos,
     autenticação ou dado pessoal (Q11).

   Vale a partir da primeira change aprovada no Portão 1 depois do merge desta.
7. **Os outros cinco riscos da R0:** LB-14 (Q5), LB-15 (o README prende o OpenSpec em 2.1.0),
   LB-24 (Q7), LB-25 (a hierarquia do README ganha o `SEGURANCA.md`) e LB-26 (o protótipo nomeado
   como "coberto só pela origem declarada").

**Decisão registrada para o AS-17**, pela aprovação do Gabriel de 21/11/2026: o gancho novo em
`.claude/ganchos/`, o `.claude/settings.json` com o gancho, as regras de negação e a negação da
`mcp__terminal__run_in_terminal` inteira, a linha nova do `guardiao-appsec.md` sobre a regra 2 e o
`allowed-tools: Bash(openspec:*)` das seis skills (Q5). Nenhuma variável de ambiente, servidor MCP
nem ferramenta de agente nova.

**Critérios de aceite:**

- A barreira, a partir de um subagente, recusa `git rm`, `git add`, `git -C . add` e
  `bash -c "git add …"`, e deixa passar `git status`, `git diff` e `git log`, com o índice intacto.
  Fica registrada em duas execuções com resultados opostos (RP-12).
- `git add -n README.md` é recusado por cada uma das três ferramentas de comando, com a camada que
  recusou registrada.
- `git ls-files -- AGENTS.md` vazio, e nenhum `AGENTS.md` no disco nem no `git status --porcelain`
  depois de um `next dev`. A conferência sem a linha do exclude fica com o Gabriel, depois do merge.
- Um teste falha se o ambiente dos testes de política ganhar variável do `.env` fora da lista.
- A conferência do ambiente para quando um arquivo de `.claude/` ou uma linha do exclude muda sem
  decisão registrada, e confere `.git/config` e `.git/hooks/` (RP-12).
- A §6 sem os sete riscos, com a data e a change em cada saída.
- `npm run verificar`, `npm test`, `npx playwright test` e `openspec validate --all --strict` com
  código 0. A raiz não publicada continua idêntica, pixel a pixel, ao print arquivado.

**Conta de tarefas: 14, com uma de folga** (`tasks.md`). Se passar de 15, os itens 4 e 5 saem
inteiros para a `ajustar-ci-ao-novo-fluxo`.

## Decisões do Gabriel

Decididas no Portão 1, em **21/11/2026**. A mensagem literal está no `relatorio.md`, seção
"Decisões do Gabriel no Portão 1". As opções e o custo de cada uma, de Q1 a Q11, estão na versão
desta proposta que foi ao Portão 1 (commit `7bcdec0`). O detalhe técnico está no `design.md`.

- **Q1 · forma da barreira: (c)**, o gancho mais as regras de negação. O gancho é a barreira, e as
  regras seguram as formas diretas sem ele (D1).
- **Q2 · `git fetch`: (b)**, recusado a agente. Com a `main` local atrás, o líder técnico para e
  pede o `fetch` ao Gabriel (D9).
- **Q3 · `gh`: (b)**, todo recusado. A conferência do commit da prévia passa ao Gabriel, no painel
  da Vercel (ajuste 2, D9).
- **Q4 · `AGENTS.md`: (c)**, a linha no `.gitignore` e o `agentRules: false`. O
  `experimental.agentFeedback` continua desligado, e ligá-lo é mudança do AS-17 (ajuste 3, D5, D6).
- **Q5 · LB-14: (a)**, esta proposta aprovada é a decisão registrada. Nenhum arquivo muda.
- **Q6 · precondição da §5: (a)**, o `.claude/settings.json` igual ao da `main` ou igual ao
  registrado como decidido na change em curso (D4, D9).
- **Q7 · LB-24: (a)**, o ADR-0005 intocado. O README e a `PADROES-DE-CODIGO.md` §8 remetem a ele
  (D10).
- **Q8 · comando que só cita escrita no Git: (a)**, recusado. O líder técnico lê o arquivo pela
  ferramenta de leitura (D2).
- **Q9 · escrita em `.git/` por ferramenta de arquivo: (b)**, negada por regra, mais a conferência
  (D1).
- **Q10 · `.git/config`: (a)**, lista de chaves permitidas, com a lista do Gabriel:
  `remote.origin.url` igual a `https://github.com/Liga-Academica-Liacup/portal-liacup.git`,
  `remote.origin.fetch`, os padrões `branch.<nome>.remote`, `branch.<nome>.merge` e
  `branch.<nome>.vscode-merge-base`, `lfs.repositoryformatversion` e as chaves `core.*` que já
  existem hoje no `.git/config` desta máquina (D4).
- **Q11 · gatilhos que não são caminho e lista de tela: (a)**, as listas do D8 mais a busca por
  `process.env` e `NEXT_PUBLIC_`.
- **Q12 · a execução vermelha a partir de um subagente roda as quatro formas com `-n` antes de o
  gancho existir.** Opções que foram ao Gabriel, na entrega do líder técnico: (a) aceitar, só nesta
  change; (b) trocar pela execução vermelha do teste de tabela. **Escolhida: (a)**, só nesta change
  e só com `-n`. A exceção e os quatro comandos literais estão no `relatorio.md` (D3, tarefa 1.1).

**Ajustes do Gabriel no Portão 1**, sem tarefa nova:

1. A barreira cobre as três ferramentas que rodam comando, e `git add -n` é mostrado recusado por
   cada uma (D1, D3, tarefas 1.3 e 1.4).
2. Sem `gh`, quem confere antes do P23 que a prévia serve o commit certo, e o host, é o Gabriel, no
   painel da Vercel. Isso entra na §5 no lugar do `gh api` (D9, tarefa 5.1).
3. O `experimental.agentFeedback` continua desligado e entra na conferência do AS-17, junto com o
   `agentRules: false` (D6, tarefa 3.1).
4. A linha 220 do protótipo, relida pelo líder técnico em 21/11/2026, fecha o LB-26 (D9).

Depois do merge, a entrega traz o comando para o Gabriel tirar a linha `AGENTS.md` do
`.git/info/exclude` e conferir que o `next dev` não recria o arquivo (D14).

## Fora de escopo

- O CI (`ajustar-ci-ao-novo-fluxo`), qualquer tela, os cabeçalhos de segurança (`lancamento-r1`) e
  o banco (R2).
- Barrar código arbitrário de agente com terminal. Quem tem `Bash` roda qualquer programa. A
  barreira pega o erro e o disfarce comum, e o que escapa dela é pego pela conferência do
  ambiente e do índice depois de cada passagem (`design.md`, D1).
- As configurações globais do Git e do Claude Code fora do repositório. A única exceção é a chave
  que desliga os ganchos, que a conferência lê.
- Mudar as skills do OpenSpec, as ferramentas de qualquer agente, o ADR-0005 ou artefato arquivado.
  A negação da `mcp__terminal__run_in_terminal` no projeto (ajuste 1) é a única mudança de
  ferramenta, e vale para todos, sem mexer na definição de nenhum agente.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `equipe-de-agentes`:
  - MODIFIED: "Nenhum agente escreve no Git" (a lista de operações e o líder técnico), "O que o
    guardião não verifica sozinho vira pedido de comando" (só com o ambiente conferido), "A
    configuração dos agentes é item do checklist" (arquivos de instrução gerados por ferramenta, e
    a geração de instrução pelo framework), "Change só de documentação tem conferência curta"
    (convive com a regra proporcional) e "Os cabeçalhos da prévia são conferidos sem expor o
    segredo de acesso" (B-01, I-02 e o commit conferido pelo Gabriel);
  - ADDED: a barreira, nas três ferramentas que rodam comando, a conferência do ambiente local, a
    conferência proporcional e nenhum arquivo de instrução a agentes gerado no repositório.
- `camada-de-dados`: ADDED, os testes de política carregam só as variáveis da lista.

## Requisitos permanentes

| RP | Aplica? | Em uma linha |
| --- | --- | --- |
| RP-01 | Sim | Nenhuma dependência nova: 22 diretas antes e depois; o gancho é `node` puro |
| RP-02 | Sim | `verificar:tokens` com código 0; nenhum CSS muda |
| RP-03 | Sim | `tokens.css` intocado |
| RP-04 a RP-07 | Não | Nenhuma tela. O e2e continua verde, com axe 0, como hoje |
| RP-08, RP-09 | Não | Nenhuma tela; a raiz não publicada é comparada pixel a pixel |
| RP-10 | Sim | O segredo de bypass sai do ambiente dos testes, e nunca é impresso nem transcrito |
| RP-11 | Não | Nenhuma tabela |
| RP-12 | Sim | A barreira, a conferência, o carregador de variáveis e o `AGENTS.md`: cada um visto falhando e voltando, com contador |
| RP-13 | Sim | O `AGENTS.md` é artefato gerado e fica fora; `verificar:artefatos` com código 0 |
| RP-14 | Não | Nenhuma tela; sem `guardiao-visual` |

## Impact

| O que | Efeito | Quem escreve |
| --- | --- | --- |
| `.claude/settings.json`, `.claude/ganchos/`, `tests/barreiras/` | A barreira e o teste dela | `dev-frontend` |
| `scripts/conferir-ambiente-local.mjs` | A conferência do ambiente, rodada com `node` direto. O `package.json` não muda (`design.md`, D4) | `dev-frontend` |
| `next.config.ts`, `.gitignore` | `AGENTS.md` fora (Q4) | `dev-frontend` |
| `tests/politicas/ambiente.ts` | A lista de variáveis | `dev-frontend` |
| `docs/SEGURANCA.md` §4, §5, §6 e §7; `docs/EQUIPE-DE-AGENTES.md` §2; `docs/PADROES-DE-CODIGO.md` §8; `README.md`; `CLAUDE.md`; `.claude/agents/guardiao-appsec.md` | Os textos | líder técnico |
| `src/`, `tests/e2e/`, `.github/`, `package-lock.json`, `.claude/skills/`, os outros agentes | Nada muda | — |
| Produção e prévias | Nada muda | — |
| Sessão do Claude Code | As regras e o gancho valem na hora em que o `.claude/settings.json` é salvo, e a execução verde da 1.4 prova que carregaram. Se não carregarem, o Gabriel reabre a sessão, e isso vai para o relatório | — |
| `mcp__terminal__run_in_terminal` | Negada no projeto: nenhum agente digita no terminal do Gabriel. Servidor de desenvolvimento roda pelo `Bash`, em segundo plano | `dev-frontend`, na regra |
