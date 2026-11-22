# Tarefas — endurecer os agentes e o Git local

14 tarefas, com uma de folga. Se uma correção levar a conta a mais de 15, os itens 4 e 5 da proposta
saem inteiros para a `ajustar-ci-ao-novo-fluxo`: as tarefas 4.1 e 5.1. As formas da 1.1 e da 1.4
usam `-n` (simulação) e não escrevem nada, nem se a barreira falhar (D3). Os
comandos estão em sintaxe de bash (Git Bash). Os escopos nominais estão no `design.md`, D13. As
tarefas seguem as decisões do Gabriel de 21/11/2026, Q1 a Q12, e os quatro ajustes dele, sem tarefa
nova (proposta, "Decisões do Gabriel").

Depois de **cada** passagem de subagente, o líder técnico roda a conferência de escopo (`git status
--porcelain`, `git diff --cached --name-only`). Do fim da 2.1 em diante, roda também
`node scripts/conferir-ambiente-local.mjs --change endurecer-agentes-e-git-local`.

## 1. A barreira do Git

- [x] 1.1 **qa, antes de qualquer configuração:** a execução vermelha do D3, passo 1, pela exceção
      da Q12 (a): só nesta change, só com `-n`, uma vez, com os comandos literais registrados no
      `relatorio.md`. O subagente roda, em ordem:
      - `git rm -n --cached README.md`;
      - `git add -n README.md`;
      - `git -C . add -n README.md`;
      - `bash -c "git add -n README.md"`.

      Verificar:
      - as quatro com código 0, nenhuma recusa. O `git rm -n` imprime `rm 'README.md'`, e os três
        `git add -n` não imprimem nada, que é o comportamento do Git para arquivo sem mudança. Tudo
        literal no relatório;
      - `git diff --cached --name-only` vazio antes e depois, registrado pelo líder técnico;
      - `test -e .claude/settings.json` com código 1 no momento da execução.
- [x] 1.2 **dev:** o gancho, a função de decisão (D2) e o teste de tabela em
      `tests/barreiras/git-de-escrita.test.mjs` (D3). Verificar:
      - `npm test` com código 0, e a saída tem `comandos conferidos: N · permitidos: P · recusados:
        R`, com todos os casos da lista do D3;
      - RP-12: com `add` posto na lista de leitura, o teste fica vermelho, com o número de casos
        que falharam no relatório. Desfeito, fica verde, e o `sha256sum` do gancho é igual ao de
        antes;
      - `echo '{}' | node .claude/ganchos/barrar-git-de-escrita.mjs; echo $?` dá `2`, que é a
        falha fechada com entrada sem comando.
- [x] 1.3 **dev:** `.claude/settings.json` com o gancho em `PreToolUse` (matcher
      `^(Bash|PowerShell|mcp__terminal__run_in_terminal)$`, lendo `tool_input.command`) e as regras
      de negação do D1 (Q1, Q3, Q9 e ajuste 1). Verificar:
      - `node -e "const d=require('./.claude/settings.json').permissions.deny; const
        c=p=>d.filter(r=>r.startsWith(p)).length; console.log('Bash:',c('Bash('),'· PowerShell:',
        c('PowerShell('),'· terminal:',d.filter(r=>r==='mcp__terminal__run_in_terminal').length,
        '· Edit:',c('Edit('))"` com código 0, e a saída
        `Bash: 28 · PowerShell: 28 · terminal: 1 · Edit: 5` (as 2 do `.git/` e as 3 da decisão do
        Gabriel sobre a brecha da configuração, D1);
      - nenhuma regra com `:*` e nenhuma `Write(` (`grep -c -e ':\*' -e 'Write(' .claude/settings.json`
        dá 0, com código 1);
      - `git diff --exit-code main -- .claude/agents .claude/skills` com código 0.
- [x] 1.4 **qa, líder técnico e Gabriel:** a execução verde. A configuração vale na hora em que o
      arquivo é salvo, e esta execução prova que carregou; se não carregar, o Gabriel reabre a
      sessão, e isso vai para o relatório. O subagente refaz as quatro formas da 1.1 e roda
      `git status`, `git diff --stat` e `git log --oneline -n 3` (D3, passo 2), e tenta criar
      `.git/DEMO-RP12` com a ferramenta Write (Q9). O líder técnico roda `git add -n README.md`
      pelo `PowerShell` e pela `mcp__terminal__run_in_terminal` (D3, passo 3). Por fim, o D3, passo
      4, só com a camada 2, com o `.claude/settings.local.json` criado e apagado pelo Gabriel.
      Verificar:
      - as quatro recusadas pelo `Bash`. A recusa do gancho se distingue pelo código 2 e pela
        mensagem do D2;
      - `git add -n README.md` recusado por cada uma das três ferramentas, com a camada que recusou
        em cada caso; na `mcp__terminal__run_in_terminal`, a esperada é a negação da ferramenta
        inteira;
      - as três leituras com código 0, e `test -e .git/DEMO-RP12` com código 1;
      - no passo 4, `git add -n README.md` e `git -C . add -n README.md` recusados pela regra de
        negação, e o resultado do `bash -c` registrado como o limite medido do D1. Se a regra não
        recusar o primeiro, o líder técnico para e leva ao Gabriel;
      - `git diff --cached --name-only` vazio e `git status --porcelain` igual ao da 1.1, fora os
        arquivos da change. Tudo literal no relatório.

## 2. A conferência do ambiente local

- [x] 2.1 **dev e líder técnico:** `scripts/conferir-ambiente-local.mjs` e o teste dele em
      `tests/barreiras/ambiente-local.test.mjs` (D4, Q10). O líder técnico escreve o
      `ambiente-decidido.txt` da change. Verificar:
      - `npm test` com código 0, com o número de casos da conferência impresso;
      - RP-12, os quatro passos do D4, cada um com a saída literal e o código de saída:
        1. sem registro: diferente de 0, nomeando `.claude/settings.json`, o gancho e a linha
           `AGENTS.md` do exclude;
        2. com registro: 0, com `aceitos por decisão` igual ao número de linhas do registro;
        3. com `.claude/DEMO-RP12.txt`: diferente de 0, nomeando o arquivo;
        4. sem ele: 0;
      - a primeira execução lista os nomes das chaves do `.git/config` desta máquina, sem valor, e o
        dev põe na lista exatamente as chaves `core.*` que existem hoje (Q10 (a), D4). O
        `remote.origin.url` esperado é a constante
        `https://github.com/Liga-Academica-Liacup/portal-liacup.git`;
      - nenhuma de `core.fsmonitor`, `core.hooksPath`, `core.sshCommand`, `core.pager`,
        `core.editor` e `core.askPass` na lista. Se alguma existir hoje, é achado para o Gabriel, e
        a conferência para. Outra chave fora da lista do D4 vai ao Gabriel como decisão, e não
        entra na lista pelo dev;
      - `git grep -c DEMO-RP12 -- .claude` com código 1 no fim.
- [x] 2.2 **Líder técnico:** os textos da barreira e da conferência (D6, D9 precondição, D10):
      - `SEGURANCA.md` §4 (AS-17 com a lista do D6, o `agentRules` e o `agentFeedback`) e §5 (a
        precondição nova);
      - `CLAUDE.md` ("Escopo de escrita é instrução, não trava" e a regra 1 do Git);
      - `README.md` ("A barreira do Git": as três ferramentas, o que fazer se a barreira não
        aparecer, o comando da conferência e o limite do D1).

      Verificar:
      - `grep -c "conferir-ambiente-local" docs/SEGURANCA.md CLAUDE.md README.md` dá pelo menos 1
        em cada;
      - `grep -c "AGENTS.md" docs/SEGURANCA.md` dá pelo menos 1;
      - `grep -c "mcp__terminal__run_in_terminal" README.md` e `grep -c "não aparecer" README.md`
        dão pelo menos 1 cada, e `grep -c "/hooks" README.md` dá 0;
      - a frase "cada `test -e` devolve código 1" some da §5 (`grep -c` dá 0).

## 3. `AGENTS.md`

- [x] 3.1 **dev:** `agentRules: false` no `next.config.ts` e o bloco do `.gitignore` (D5, Q4 (c)).
      Verificar:
      - RP-12 do D5, vermelho e verde, com o caminho que rodou dito no relatório;
      - `git ls-files -- AGENTS.md` vazio;
      - `git check-ignore -v -- AGENTS.md` aponta `.gitignore:<linha>:AGENTS.md`;
      - `grep -c agentFeedback next.config.ts` dá 0;
      - o AS-17 cita os dois (ajuste 3; o texto é da 2.2): `grep -c "agentRules" docs/SEGURANCA.md`
        e `grep -c "agentFeedback" docs/SEGURANCA.md` dão pelo menos 1 cada;
      - `npm run build` com código 0.

## 4. O ambiente dos testes de política

- [x] 4.1 **dev:** a lista de nomes, `exigir` restrito a ela e o teste em
      `tests/barreiras/ambiente-dos-testes-de-politica.test.ts` (D7). Verificar:
      - `npm test` com código 0, e a saída tem `variáveis no arquivo: 5 · entraram: 3`;
      - RP-12: com o carregador levando o arquivo inteiro, o teste fica vermelho. Desfeito, fica
        verde;
      - `git grep -c --untracked -e 'VERCEL_AUTOMATION_BYPASS_SECRET' -- . ':!docs' ':!openspec'
        ':!README.md' ':!.env.example'` com código 1;
      - `npm run test:banco` com código 0 e a contagem de células, ou **não medido**, com o motivo,
        se o projeto de teste não estiver no ar.

## 5. Os textos de segurança e de governança

- [x] 5.1 **Líder técnico:** na §5, o B-01, o I-01, o I-02, o I-03, o LB-26, com os números da
      linha 220 relida, e a conferência do commit e do host da prévia pelo Gabriel, no painel da
      Vercel, antes do P23, no lugar do `gh api` (D9, ajustes 2 e 4), com as linhas do I-01
      conferidas no momento de escrever. Verificar:
      - `grep -c "serve o commit" docs/SEGURANCA.md` dá pelo menos 1;
      - `grep -c "1.192.346" docs/SEGURANCA.md` dá pelo menos 1;
      - `grep -c "ls-remote origin refs/heads/main" docs/SEGURANCA.md` dá pelo menos 1;
      - `grep -c "de forma dinâmica hoje" docs/SEGURANCA.md` dá 0;
      - `grep -c "curl --version" docs/SEGURANCA.md` dá pelo menos 1;
      - `grep -c "O pedido escolhe só o caminho" docs/SEGURANCA.md` dá 0;
      - `grep -c "Portal-LIACUP.html" docs/SEGURANCA.md` dá pelo menos 1.
- [x] 5.2 **Líder técnico:** a regra 2 da dieta (D8, Q11): o texto e as listas na §5, a §2 da
      `EQUIPE-DE-AGENTES.md`, o item 2 da dieta no `CLAUDE.md` e uma linha no `guardiao-appsec.md`.
      Verificar:
      - `grep -c "Conferência proporcional" docs/SEGURANCA.md .claude/agents/guardiao-appsec.md` dá
        pelo menos 1 em cada;
      - `grep -c "Só vale depois de escrito" CLAUDE.md` dá 0;
      - `git diff --stat main -- .claude/agents` mostra só o `guardiao-appsec.md`, com 1 a 3 linhas.
- [x] 5.3 **Líder técnico:** LB-15, LB-25 e LB-24 no README, e LB-24 na `PADROES-DE-CODIGO.md` §8
      (D10, Q7 (a)). Verificar:
      - `grep -c "@fission-ai/openspec@2.1.0" README.md` dá 1;
      - a linha 3 da tabela "Onde ficam as decisões" cita `docs/SEGURANCA.md`;
      - `grep -c "guardiao-appsec" README.md docs/PADROES-DE-CODIGO.md` sobe em 1 em cada,
        contra a `main`;
      - `git diff --exit-code main -- docs/ADR-0005-modelo-de-branches.md` com código 0.

## 6. Conferência final

- [x] 6.1 **qa:** `npx playwright test` inteiro e a comparação da raiz não publicada (D11).
      Verificar:
      - `npx playwright test` com código 0, com o número de testes no relatório;
      - **0 de 329.160** (390) e **0 de 1.024.000** (1280) pixels diferentes contra os
        `raiz-nao-publicada-*` arquivados;
      - `git diff --exit-code main -- src tests/e2e public playwright.config.ts` com código 0.
- [x] 6.2 **Líder técnico:** as verificações do briefing. Verificar, com o código e os contadores de
      cada uma no relatório:
      - `npm run verificar`, `npm test` e `openspec validate --all --strict` com código 0;
      - `node scripts/conferir-ambiente-local.mjs --change endurecer-agentes-e-git-local` com
        código 0;
      - 22 dependências diretas;
      - `git diff --exit-code main -- package.json package-lock.json .github .claude/skills` com
        código 0;
      - `git status --porcelain` só com arquivos do D13, na seção "Líder técnico — conferência de
        escopo".
- [x] 6.3 **`revisor` e `guardiao-appsec`**, o guardião com o checklist inteiro, porque a change
      toca `.claude/`, `.gitignore`, `scripts/` e `next.config.ts`. Depois, o líder técnico tira da
      §6 os riscos conferidos e escreve a subseção "Saíram da lista" (D12). Verificar:
      - o veredito de cada um no relatório, e nenhum BLOQUEADO aberto;
      - `git status` igual antes e depois das duas passagens;
      - `sed -n '/^## 6\./,/^### Saíram da lista/p' docs/SEGURANCA.md | grep -cE
        '^\| LB-(05|06|14|15|24|25|26) '` dá 0, que é a tabela de riscos em aberto sem os sete;
      - a subseção "Saíram da lista" tem 7 linhas, cada uma com a data, a change e a evidência.
        Risco não conferido fica na tabela, e o motivo vai para a entrega.

## Workflow follow-up

- `openspec validate endurecer-agentes-e-git-local --strict` com código 0.
- `openspec archive endurecer-agentes-e-git-local` antes do PR, porque a `main` é protegida. Depois,
  `openspec validate --all --strict` com código 0, com os cinco requisitos novos e os cinco
  modificados em `equipe-de-agentes`, e o requisito novo em `camada-de-dados`.
- Entrega ao Gabriel no modelo do `CLAUDE.md`, com os comandos do D14 na seção 6.
- Depois do merge, pelo Gabriel: os comandos do D14. A saída volta ao líder técnico e fecha o
  critério "sem a linha do exclude".
