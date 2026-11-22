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

1. **Barreira versionada contra escrita no Git**, para todo agente, inclusive o líder técnico. Ela
   recusa antes de rodar todo `git` que não esteja numa lista fechada de leitura (status, diff, log,
   show, ls-files, ls-tree, grep, rev-parse, rev-list, ls-remote, check-ignore, cat-file, blame,
   merge-base e `branch` só para listar), mesmo disfarçado (`git -C . add`, `bash -c "git add …"`,
   depois de `;`, `&&`, `|` ou dentro de `$(…)`), e recusa também o que não conseguir analisar.
   Tudo o que não é leitura fica recusado: add, commit, push, rm, mv, restore, reset, checkout,
   switch, stash, merge, rebase, cherry-pick, tag, `branch -d/-D`, clean, fetch (Q2) e todo `gh`
   (Q3). O terminal do Gabriel não muda: a barreira só vale para comando que passa pelo Claude Code.
2. **Conferência do ambiente local**, um comando versionado que o líder técnico roda antes de cada
   leva de pedidos de comando, antes dos comandos Git da entrega e depois de cada subagente. Ela
   compara com a `main`, pelo conteúdo e sem depender do `git status`, os arquivos de configuração e
   de instrução dos agentes que estão no disco. Lê `.git/config`, `.git/hooks/` e
   `.git/info/exclude` antes de rodar qualquer `git`. Para, com código diferente de 0, em toda
   diferença sem decisão registrada (LB-05, LB-06).
3. **`AGENTS.md` fora do repositório em qualquer clone** (Q4), e a lista do AS-17 passa a incluir
   os arquivos de instrução a agentes desse tipo. A entrega traz o comando para o Gabriel tirar a
   linha do `.git/info/exclude` depois do merge.
4. **Os testes de política carregam só as variáveis que usam**, por nome, de uma lista. O segredo de
   bypass da Vercel deixa de entrar no ambiente deles.
5. **As quatro pendências do guardião na `pagina-processo-seletivo`**, escritas na §5: a busca por
   commit cobre tudo o que o push publica (B-01); o que conta como leitura dinâmica do ambiente,
   com os pontos que existem hoje (I-01); a precondição do `curl --version` (I-02); e a lacuna
   `<rota>` no parágrafo do `<endereço>` (I-03). O `design.md` arquivado não se edita.
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

**Decisão registrada para o AS-17**, se o Gabriel aprovar esta proposta: o gancho novo em
`.claude/ganchos/`, o `.claude/settings.json` com o gancho e as regras de negação, a linha nova do
`guardiao-appsec.md` sobre a regra 2 e o `allowed-tools: Bash(openspec:*)` das seis skills (Q5).
Nenhuma variável de ambiente, servidor MCP nem ferramenta de agente nova.

**Critérios de aceite:**

- A barreira, a partir de um subagente, recusa `git rm`, `git add`, `git -C . add` e
  `bash -c "git add …"`, e deixa passar `git status`, `git diff` e `git log`, com o índice intacto.
  Fica registrada em duas execuções com resultados opostos (RP-12).
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

Q1 a Q7 vêm do briefing; Q8 a Q11 são ambiguidades achadas na leitura. O detalhe técnico de cada
uma está no `design.md`.

**Q1. Forma da barreira.**
- (a) Só regras de negação nas configurações do projeto. Custo: casam por prefixo, não pegam
  `git -C . add` nem `bash -c`, e reprovam o critério.
- (b) Só o gancho que lê o comando antes de rodar. Custo: se os ganchos forem desligados nas
  configurações do usuário, ou se o `node` não abrir, nada recusa.
- (c) As duas. Custo: dois lugares para manter.
- Recomendo (c): o gancho é a barreira, e as regras seguram as formas diretas sem ele.

**Q2. `git fetch`.**
- (a) Liberado. Custo: escreve referências e `FETCH_HEAD`, e vai à rede.
- (b) Recusado a agente. Custo: quando a `main` local estiver atrás, o líder técnico para e pede o
  `fetch` ao Gabriel.
- Recomendo (b): o B-01 se resolve com `git ls-remote`, que é leitura.

**Q3. `gh`.**
- (a) Recusar só `gh pr`. Custo: `gh api -X POST`, `gh release` e `gh repo` escrevem igual.
- (b) Recusar todo `gh`. Custo: o líder técnico deixa de consultar o status do commit pelo `gh`,
  como fez no P23 da `pagina-processo-seletivo`, e passa a ler no GitHub ou na Vercel.
- Recomendo (b).

**Q4. `AGENTS.md`.**
- (a) Linha no `.gitignore`. Custo: o arquivo continua no disco, com instrução a agentes.
- (b) `agentRules: false` no `next.config.ts`. Custo: depende de a opção existir em versões
  futuras do Next.
- (c) As duas. Custo: duas linhas.
- Recomendo (c): (b) tira o arquivo do disco, e (a) segura se a opção mudar. O
  `experimental.agentFeedback`, que escreve no mesmo arquivo, fica desligado, como já é o padrão.
  Ligá-lo exige decisão do Gabriel, e o guardião trata a mudança como AS-17.

**Q5. LB-14, o `allowed-tools: Bash(openspec:*)` das seis skills.**
- (a) Esta proposta aprovada é a decisão registrada. Custo: nenhum arquivo muda.
- (b) Tirar das skills. Custo: o `openspec update` as regera com a linha, e mexer nelas à mão é
  bloqueio do AS-17.
- Recomendo (a).

**Q6. A precondição da §5 sobre `.claude/settings.json`.**
- (a) Passa a aceitar o arquivo igual ao da `main`, ou igual ao que está registrado como decidido
  na change em curso. A aprovação desta proposta é a decisão. Custo: um registro a manter por
  change.
- (b) Fica "igual ao da `main`". Custo: nenhum pedido de comando roda nesta change até o merge, e
  o guardião não confirma nada por comando.
- Recomendo (a).

**Q7. LB-24 e o ADR-0005.**
- (a) O ADR fica intocado. O README e a `PADROES-DE-CODIGO.md` §8 passam a dizer que o guardião
  audita a correção urgente antes do merge, e remetem ao ADR. Custo: a regra em dois lugares.
- (b) ADR novo, que substitui a seção 2.4. Custo: um ADR para uma frase.
- Recomendo (a).

**Q8. Comando que só cita uma escrita no Git**, como `grep -n "git push" docs/x.md`, ou um
`git log -S 'git add'`.
- (a) É recusado. Custo: falso positivo raro, que o líder técnico contorna lendo o arquivo.
- (b) A barreira tenta separar citação de invocação. Custo: reabre o disfarce dentro de
  `bash -c` e de `node -e`.
- Recomendo (a).

**Q9. Escrita direta em `.git/` pelas ferramentas de arquivo** (Write e Edit), que não passam por
comando.
- (a) Só a conferência pega, depois. Custo: um gancho do Git plantado roda até a próxima
  conferência.
- (b) Regra de negação para escrita em `.git/`, mais a conferência. Custo: uma regra a mais.
- Recomendo (b). Nenhum agente precisa escrever ali.

**Q10. A leitura do `.git/config`.**
- (a) Lista de chaves permitidas: chave fora dela para a conferência. Custo: chave inofensiva que o
  GitHub Desktop acrescente também para, até virar decisão.
- (b) Lista de chaves perigosas. Custo: chave que ninguém previu passa calada.
- Recomendo (a), que é falha fechada.

**Q11. Os gatilhos que não são caminho de arquivo** (variáveis de ambiente, cabeçalhos,
autenticação, dado pessoal) **e a lista do que conta como "tela".**
- (a) As listas de caminhos do `design.md` (D8), mais uma conferência mecânica: diff que acrescenta
  `process.env` ou `NEXT_PUBLIC_` vai para o checklist inteiro. Custo: uma busca a mais por change.
- (b) Só as listas de caminhos. Custo: um componente de tela que passe a ler variável de ambiente
  fica na conferência reduzida.
- Recomendo (a).

## Fora de escopo

- O CI (`ajustar-ci-ao-novo-fluxo`), qualquer tela, os cabeçalhos de segurança (`lancamento-r1`) e
  o banco (R2).
- Barrar código arbitrário de agente com terminal. Quem tem `Bash` roda qualquer programa. A
  barreira pega o erro e o disfarce comum, e o que escapa dela é pego pela conferência do
  ambiente e do índice depois de cada passagem (`design.md`, D1).
- As configurações globais do Git e do Claude Code fora do repositório. A única exceção é a chave
  que desliga os ganchos, que a conferência lê.
- Mudar as skills do OpenSpec, as ferramentas de qualquer agente, o ADR-0005 ou artefato arquivado.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `equipe-de-agentes`:
  - MODIFIED: "Nenhum agente escreve no Git" (a lista de operações e o líder técnico), "O que o
    guardião não verifica sozinho vira pedido de comando" (só com o ambiente conferido), "A
    configuração dos agentes é item do checklist" (arquivos de instrução gerados por ferramenta),
    "Change só de documentação tem conferência curta" (convive com a regra proporcional) e "Os
    cabeçalhos da prévia são conferidos sem expor o segredo de acesso" (B-01 e I-02);
  - ADDED: a barreira, a conferência do ambiente local, a conferência proporcional e nenhum
    arquivo de instrução a agentes gerado no repositório.
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
| Sessão do Claude Code | O gancho só vale depois de o Gabriel reabrir a sessão; no app de desktop não existe o menu `/hooks` (passo manual, no README) | Gabriel |
