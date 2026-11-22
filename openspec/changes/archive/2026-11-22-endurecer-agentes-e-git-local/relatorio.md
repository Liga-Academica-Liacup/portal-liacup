# Relatório — endurecer-agentes-e-git-local

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** em `openspec/changes/endurecer-agentes-e-git-local/`:
  - `proposal.md`, `design.md` (D1 a D14) e `tasks.md`;
  - `specs/equipe-de-agentes/spec.md`: 5 MODIFIED e 4 ADDED, com 43 cenários;
  - `specs/camada-de-dados/spec.md`: 1 ADDED, com 3 cenários.

  No total, **10 requisitos (5 ADDED e 5 MODIFIED) e 46 cenários**, e **14 tarefas, com uma de
  folga**. Divisão pronta, se passar de 15: as tarefas 4.1 e 5.1 (itens 4 e 5 da proposta) vão para
  a `ajustar-ci-ao-novo-fluxo`.
- **Questões em aberto:** onze, todas na proposta, com opções, custo e recomendação. Q1 a Q7 vêm do
  briefing; Q8 a Q11 são minhas:
  - Q1 · forma da barreira. Recomendo (c), gancho mais regras de negação;
  - Q2 · `git fetch`. Recomendo (b), recusado;
  - Q3 · `gh`. Recomendo (b), todo recusado;
  - Q4 · `AGENTS.md`. Recomendo (c), `.gitignore` mais `agentRules: false`;
  - Q5 · LB-14. Recomendo (a), esta proposta é a decisão;
  - Q6 · a precondição da §5. Recomendo (a), igual à `main` ou ao registrado como decidido;
  - Q7 · LB-24. Recomendo (a), o ADR intocado;
  - Q8 · comando que só cita uma escrita no Git. Recomendo (a), recusado;
  - Q9 · escrita em `.git/` pelas ferramentas de arquivo. Recomendo (b), negada;
  - Q10 · `.git/config`. Recomendo (a), lista de chaves permitidas;
  - Q11 · gatilhos que não são caminho e a lista de tela. Recomendo (a), listas do D8 mais a busca
    por `process.env` e `NEXT_PUBLIC_`.
- **Desvios do briefing, com motivo:**
  - o `-c` do `git` é recusado, e não pulado. `-c core.pager=…` roda programa a partir de qualquer
    leitura (D2);
  - a conferência roda com `node` direto, e não por `npm run`, porque o `npm` lê o `.npmrc` e roda
    scripts `pre` antes dela. O `package.json` não muda (D4);
  - o teste do ambiente usa `SEGREDO_FORA_DA_LISTA`, e não `VERCEL_AUTOMATION_BYPASS_SECRET`. Com
    o nome real, o teste leria a variável pelo nome e quebraria a conferência da §5 que exige
    código 1 (D7);
  - o `.gitignore` ganha só `AGENTS.md`. Os outros arquivos do D6 são pegos pela conferência.
- **Achado:** além dos três pontos do I-01, `scripts/verificar-chave-de-servico.mjs:45` e
  `scripts/verificar-tipos-do-banco.mjs:56` também leem `process.env[…]` por nome em constante.
  Entram no texto novo (D9).
- **Incompleto:**
  - não rodei `openspec validate`, porque não tenho terminal. As descrições de requisito foram
    contadas à mão, todas abaixo de 500 caracteres;
  - fica para o `dev-frontend` medir: o campo de entrada do `mcp__terminal__run_in_terminal`, se a
    ferramenta `PowerShell` aceita regra por prefixo, e a sintaxe de caminho de `Edit` e `Write`
    em `.git/`;
  - fica para o Gabriel, no Portão 2: o valor do `remote.origin.url` que a conferência espera, que
    não li e não inventei;
  - a linha 220 do protótipo (LB-26) foi tirada do relatório da auditoria, e não relida.
- **Rodada 2: ajustes do Portão 1** (21/11/2026). Mudaram `proposal.md`, `design.md`, `tasks.md` e
  `specs/equipe-de-agentes/spec.md`; `specs/camada-de-dados/spec.md` não mudou.
  - Proposta: "Decisões do Gabriel" com a opção escolhida de Q1 a Q12, a data, a Q12 com as duas
    opções, e os quatro ajustes; What Changes, critérios, Impact e Fora de escopo com as três
    ferramentas e a negação da `mcp__terminal__run_in_terminal` inteira.
  - Design: D1 (campo `command`, matcher ancorado, regras com espaço para `Bash` e `PowerShell`,
    ferramenta MCP negada inteira com o custo, `Edit(/.git/**)` e `Edit(**/.git/**)`, recarga ao
    salvar); D3 com a Q12 (a), o critério do `-n` corrigido e quatro passos (o 3 pelas outras duas
    ferramentas; o 4 mede `disableAllHooks`); D4 com a lista da Q10; D6 com `agentRules` e
    `agentFeedback`; D9 com o commit da prévia pelo Gabriel e os números do LB-26; D10, D13, riscos
    e Open Questions sem o passo de reabrir a sessão.
  - Tarefas: 1.1, 1.3, 1.4, 2.1, 2.2, 3.1 e 5.1 ajustadas. Conta: **14**, sem tarefa nova.
  - Specs: 3 cenários novos na `equipe-de-agentes` (outra ferramenta de comando, o terminal de
    quem opera, o framework que volta a escrever instrução) e 1 nos cabeçalhos da prévia (o commit
    conferido pelo Gabriel). Total: **10 requisitos (5 ADDED e 5 MODIFIED) e 50 cenários** (47 e
    3). A descrição da barreira ficou com cerca de 420 caracteres, contados à mão.
  - Incompleto: `openspec validate` não rodado, sem terminal. O passo 4 do D3 fica para medir no
    apply: se a regra de negação não recusar com `disableAllHooks`, o cenário "Os ganchos estão
    desligados" não se cumpre, e o líder técnico leva ao Gabriel.
- **Rodada 3: achados 1 a 3 do revisor, rodada 2** (22/11/2026). Mudaram `design.md`, `tasks.md` e
  `specs/equipe-de-agentes/spec.md`.
  - Spec: 1 ADDED novo, "A configuração que segura a barreira só muda pelo Gabriel", com 5 cenários
    (escrita por ferramenta de arquivo, comando que cita, pasta atual dentro da configuração, mudança
    pelo Gabriel, conferência como primeiro comando da lista Git). Descrição com 447 caracteres,
    contados à mão. Total: **11 requisitos (6 ADDED e 5 MODIFIED) e 55 cenários** (52 e 3).
  - Design: D1 com as 3 regras de `Edit` da brecha (5 no total); D2 e D4 com o módulo de funções e o
    ponto de entrada que sempre decide; D13 com `decisao-do-git.mjs`, `funcoes.mjs` e a escrita de
    `.claude/settings*.json` e `.claude/ganchos/` só pelo Gabriel depois da decisão.
  - Tarefas: 1.3 com `Edit: 5`; no follow-up, "cinco requisitos novos", consequência do ADDED novo.
    Conta: **14**.
  - Vago: o D3 ainda diz "importando a função exportada pelo gancho", e o D2 não descreve a recusa
    por citação da configuração; não mexi, por estar fora dos achados. A spec descreve os caminhos
    pelo papel, e não pelo nome, pela regra de spec sem nome de arquivo.
  - Incompleto: `openspec validate` não rodado, sem terminal.

## Decisões do Gabriel no Portão 1

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel de 21/11/2026.

> Portão 1 da endurecer-agentes-e-git-local: aprovado. Registre cada decisão literal no relatorio.md.
>
> Q1 (c). Q2 (b). Q3 (b). Q4 (c). Q5 (a). Q6 (a). Q7 (a). Q8 (a). Q9 (b). Q11 (a).
> Q10 (a). Valor do remote.origin.url, lido pelo gestor no .git/config: https://github.com/Liga-Academica-Liacup/portal-liacup.git. A lista aceita também os padrões branch.<nome>.remote, branch.<nome>.merge e branch.<nome>.vscode-merge-base (o VS Code grava este sozinho), lfs.repositoryformatversion e as chaves core.* que já existem hoje.
> Q12 (a), só nesta change e só com -n. Registre a exceção e os comandos literais no relatório.
>
> Ajustes, sem tarefa nova:
> 1. A barreira cobre toda ferramenta que roda comando, não só a Bash: a PowerShell e o mcp__terminal__run_in_terminal, que está na sua sessão e vem da configuração do Gabriel, não do repositório. O matcher do gancho e as regras de negação incluem as três. Se o campo de entrada de alguma não puder ser lido com certeza, a ferramenta inteira fica negada no projeto. O critério de recusa vale também por essas ferramentas: mostre git add -n recusado por cada uma.
> 2. Sem gh, a conferência de que a prévia serve o commit certo, antes do P23, passa a ser do Gabriel no painel da Vercel, junto com o host. Escreva isso na §5 no lugar do gh api.
> 3. O experimental.agentFeedback do Next continua desligado. Ponha-o na conferência do guardião (AS-17), junto com o agentRules: false.
> 4. Releia a linha 220 do protótipo antes de fechar o LB-26.
>
> Depois do merge, entregue o comando para o Gabriel tirar a linha AGENTS.md do .git/info/exclude e conferir que o next dev não recria o arquivo.
>
> Pode rodar o /opsx:apply.

**Q12 (a), a exceção registrada:** só nesta change, e só com `-n` (simulação, que não escreve no
índice nem na árvore), um subagente roda, uma vez, antes de existir o `.claude/settings.json`, os
quatro comandos da tarefa 1.1, literais:

```
git rm -n --cached README.md
git add -n README.md
git -C . add -n README.md
bash -c "git add -n README.md"
```

A mesma lista roda de novo na tarefa 1.4, depois do gancho, para ser recusada. Fora dessas duas
execuções, a regra "agente não roda comando de escrita no Git" vale sem exceção.

## A brecha da configuração do Claude Code e a decisão do Gabriel (21/11/2026)

**A brecha**, mostrada pelo passo 4 do D3: um `.claude/settings.local.json` com `disableAllHooks`
desliga o gancho, e o que sobra (as regras de negação) não recusa `git -C . add` nem `bash -c`. As
regras de negação protegiam `.git/`, mas não `.claude/settings.json`, `.claude/settings.local.json`
nem `.claude/ganchos/`. Então um agente com Write, Edit ou terminal podia desligar a barreira
inteira escrevendo um desses arquivos. A conferência do ambiente pegaria isso depois da passagem,
mas não antes de o comando seguinte rodar. O arquivo do passo 4 foi apagado pelo Gabriel, e a
conferência voltou a sair com código 0, com os ganchos ligados.

**A decisão**, literal, da mensagem do Gabriel de 21/11/2026:

> Apaguei o .claude/settings.local.json. Rode a conferência de novo, esperando código 0.
>
> Antes do guardião, feche uma brecha que o passo 4 mostrou: um agente com escrita desliga a barreira inteira escrevendo .claude/settings.local.json com disableAllHooks, ou editando o .claude/settings.json ou o .claude/ganchos/. Hoje as regras de negação protegem o .git/, mas não esses arquivos. Decisão do Gabriel, nesta change, sem tarefa nova:
> 1. Regras de negação de Edit para .claude/settings.json, .claude/settings.local.json e .claude/ganchos/**. Mostre o Write de um settings.local.json recusado, a partir de um subagente.
> 2. O gancho recusa comando de Bash, PowerShell ou terminal que cite .claude/settings ou .claude/ganchos, como na Q8: falso positivo aceito. Mostre um echo para .claude/settings.local.json recusado e um cat de outro arquivo passando.
> 3. Daqui para frente, mudar esses arquivos é passo do Gabriel: o líder técnico prepara o conteúdo e entrega o comando, como no Git. Escreva isso no CLAUDE.md e na §5.
> 4. Na lista de comandos Git de toda change, o primeiro passo do Gabriel passa a ser node scripts/conferir-ambiente-local.mjs, com a regra de parar se não der 0. Escreva no CLAUDE.md, no formato do próximo passo, e use já no Portão 2 desta change.
> Registre a brecha e a decisão no relatorio.md. Depois siga: guardiao-appsec com o checklist inteiro, a saída dos sete riscos da §6, o archive e o Portão 2.

## dev-frontend

### Passagem A, 21/11/2026: tarefas 1.2, 1.3 e 2.1 até o passo 1 do RP-12 do D4

- **Arquivos** (todos novos): `.claude/ganchos/barrar-git-de-escrita.mjs` (360 linhas),
  `.claude/settings.json`, `scripts/conferir-ambiente-local.mjs` (535),
  `tests/barreiras/git-de-escrita.test.mjs` e `tests/barreiras/ambiente-local.test.mjs`. **Tokens
  novos:** nenhum. Os dois testes rodam no `npm test` sem mudar a configuração; cada um escolhe o
  ambiente `node` só para si, pela linha `@vitest-environment node`.
- **1.2:** `npm test` código 0 · 15 arquivos, 276 testes · `comandos conferidos: 123 · permitidos:
  57 · recusados: 66`. RP-12: `sha256sum` antes `6a868ac0…9166227`; com `'add'` na lista de
  leitura, código 1, `Tests 16 failed | 112 passed (128)` (14 casos da tabela, o processo do
  gancho e o contador); desfeito, código 0, 128 de 128, e `sha256sum` igual, `6a868ac0…9166227`.
  `echo '{}' | node .claude/ganchos/barrar-git-de-escrita.mjs; echo $?` dá `2`.
- **1.3:** `Bash: 28 · PowerShell: 28 · terminal: 1 · Edit: 2` (código 0) · `grep -c -e ':\*'
  -e 'Write(' .claude/settings.json` dá `0`, código 1 · `git diff --exit-code main --
  .claude/agents .claude/skills` dá **código 1**, pelo `guardiao-appsec.md` (+2 linhas da 5.2, do
  líder técnico, que eu não toquei). O gancho carregou ao salvar: `echo gh` foi recusado por ele,
  com a mensagem do D2.
- **2.1:** a primeira execução listou 6 chaves `core.*`, só os nomes: `repositoryformatversion`,
  `filemode`, `bare`, `logallrefupdates`, `symlinks` e `ignorecase`, e elas são a lista. **Nenhuma
  das seis que nunca entram existe.** O `remote.origin.url` confere com a constante, e não há
  outra chave fora da lista (17 chaves). `casos da conferência do ambiente: 29`. RP-12 do D4, passo
  1, sem registro, literal:

  ```
  registro: ausente (endurecer-agentes-e-git-local)
  DIFERENÇA · arquivo diferente da main: .claude/agents/guardiao-appsec.md
  DIFERENÇA · arquivo só no disco: .claude/ganchos/barrar-git-de-escrita.mjs
  DIFERENÇA · arquivo só no disco: .claude/settings.json
  DIFERENÇA · arquivo só no disco: AGENTS.md
  DIFERENÇA · arquivo diferente da main: CLAUDE.md
  DIFERENÇA · regra ativa no .git/info/exclude: AGENTS.md
  arquivos comparados: 18 · iguais à main: 13 · diferentes: 6 (aceitos por decisão: 0) · regras de exclusão: 1 · ganchos do Git ativos: 0 · chaves do .git/config: 17 (fora da lista: 0) · ganchos do Claude Code: ligados
  código 1
  ```

- **Comandos:** `verificar` **código 1**, só no `prettier --check`, pelo `README.md`, que o líder
  técnico está editando. Fora dele: artefatos, tipos, `eslint .`, tokens (97 arquivos) e chave
  (536) com código 0 · `npm test` 276 de 276 · `playwright` 322 de 322, código 0.
- **Recusas do gancho a comandos meus:** três, e nenhuma é defeito. Um heredoc com o comentário
  "Git roda com…" (citação, Q8 (a)); `env -i PATH="$PATH" GIT_CONFIG_NOSYSTEM=1 git ls-tree …;
  … git config --list …`, recusado pela variável `GIT_*` e pelo `git config`, que eu não devia ter
  pedido; e a sondagem `echo gh`.
- **Desvios do D2 e do D4:** o gancho também recusa `GIT_*=` na linha (o mesmo efeito do `-c`), a
  abreviação de opção longa (`--outp`), `-O` e `-u` dentro de grupo, e reconhece o nome de comando
  com mais vizinhos (`<`, `>`, `,`, `}`); só recusa mais. O exclude, o attributes e o
  `disableAllHooks` não param a conferência antes do Git, porque não fazem o Git rodar programa.
  Se parassem, o passo 1 não nomearia o `settings.json` nem o gancho. Neste caso, `diferentes`
  conta também as regras do `.git/info/`. O Git da conferência roda só com `PATH`, `SYSTEMROOT` e
  `GIT_CONFIG_NOSYSTEM=1`.
- **Para o líder técnico:** no I-01, um ponto novo, `scripts/conferir-ambiente-local.mjs:359`, que
  lê `PATH` e `SYSTEMROOT` por nome em constante. No D8, o texto `process.env` aparece em
  `tests/barreiras/git-de-escrita.test.mjs:61`. O `AGENTS.md` do disco aparece como diferença até
  a 3.1. Nesta sessão, o Vitest esconde o `console.log` de teste que passou: o contador aparece com
  `npm test -- --reporter=default`.
- **Melhorias propostas:** vigiar também `.agents/`, que o `openspec init` gera, que fica fora do
  Git e guarda skills que outra ferramenta de agente pode ler. Precisa de decisão do Gabriel (D6).
- **Incompleto:** os passos 2 a 4 do RP-12 do D4, a 3.1 e a 4.1 ficam para a passagem B, depois de
  o líder técnico escrever o `ambiente-decidido.txt`. A sondagem `echo gh` não substitui a
  execução verde da 1.4, que é do `qa-acessibilidade`.

### Passagem B, 21/11/2026: passos 3 e 4 do RP-12 do D4, tarefas 3.1 e 4.1

- **Arquivos:** M `next.config.ts`, M `.gitignore` (bloco na linha 54), M `tests/politicas/ambiente.ts`
  (71 linhas), A `tests/barreiras/ambiente-dos-testes-de-politica.test.ts` (90). `.claude/DEMO-RP12.txt`
  criado e apagado. O gancho, o `settings.json` e o script não mudaram. **Tokens novos:** nenhum.
- **D4, passo 3** (as 6 linhas `ACEITA` iguais às do passo 2, omitidas aqui), literal:

  ```
  DIFERENÇA · arquivo só no disco: .claude/DEMO-RP12.txt
  arquivos comparados: 19 · iguais à main: 13 · diferentes: 7 (aceitos por decisão: 6) · regras de exclusão: 1 · ganchos do Git ativos: 0 · chaves do .git/config: 17 (fora da lista: 0) · ganchos do Claude Code: ligados
  código 1
  ```

  **Passo 4**, apagado (`test -e` código 1): `arquivos comparados: 18 · iguais à main: 13 ·
  diferentes: 6 (aceitos por decisão: 6) · …`, **código 0**. `git grep -c DEMO-RP12 -- .claude`:
  sem saída, **código 1**.
- **3.1, RP-12 do D5, caminho 1** (o Next detectou o agente na sessão do subagente). Vermelho:
  `agentRules: true`, `AGENTS.md` apagado antes, `timeout 40 next dev -p 3005` (código 124) imprimiu
  `✓ Generated AGENTS.md for AI agents.`, e `test -e AGENTS.md` deu **0**, com o mesmo sha256 do
  registro, `063098f6…415eb7f0`. Verde: `agentRules: false`, o `next dev` imprimiu `✓ Removed agent
  rules from AGENTS.md because agentRules is disabled.`, e `test -e` deu **1**; um segundo
  `next dev` (30 s) não imprimiu nenhuma linha com "agent", e `test -e` continuou **1**. Porta 3005
  livre depois de cada um. `git ls-files -- AGENTS.md` vazio (código 0) · `git check-ignore -v --
  AGENTS.md` → `.gitignore:54:AGENTS.md	AGENTS.md` (código 0) · `grep -c agentFeedback
  next.config.ts` → `0` (código 1) · `npm run build` **código 0**, 5 rotas.
- **4.1:** `NOMES_DO_AMBIENTE` com os três nomes; o carregador aceita o caminho e só leva a lista;
  `exigir` recusa nome fora dela antes de ler arquivo ou ambiente. O teste imprime `variáveis no
  arquivo: 5 · entraram: 3`. RP-12: com o filtro comentado, **código 1**, `Tests 1 failed | 2 passed
  (3)`; desfeito, código 0, 3 de 3, e `sha256sum` igual antes e depois, `d9acc010…b0908c85`.
  `npm run test:banco` **código 0**: `Tests 147 passed (147)`, `celulas verificadas: 143 · de
  permissao: 58 · de recusa: 85`.
- **Comandos:** `npm test -- --reporter=default` **código 0**, 16 arquivos, 279 testes (`comandos
  conferidos: 123 · permitidos: 57 · recusados: 66`; `casos da conferência do ambiente: 29`) ·
  `npx playwright test` **código 0**, 322 de 322 · `npm run verificar` **código 0** (artefatos 401,
  tokens 97, chave 512; o Prettier passou) · conferência final **código 0**, `diferentes: 5 (aceitos
  por decisão: 5)`, com `AVISO · linha do registro sem diferença: arquivo AGENTS.md …`.
- **Achado, critério não cumprido:** a busca da 4.1, `git grep -c --untracked -e
  'VERCEL_AUTOMATION_BYPASS_SECRET' -- . ':!docs' ':!openspec' ':!README.md' ':!.env.example'`, dá
  **código 0**: `tests/barreiras/git-de-escrita.test.mjs:2` (linhas 27 e 81, da passagem A). São as
  formas da §5, literais, como o D3 pede; o teste só passa o texto à função do gancho e não lê a
  variável. D3 e 4.1 conflitam, e não corrigi: (a) trocar o nome por um fictício na tabela, ou
  (b) excluir `tests/barreiras/` da busca. Decisão do líder técnico ou do Gabriel.
- **Para o líder técnico:** a linha `arquivo AGENTS.md` do registro já não casa nada (o `AVISO`). No
  I-01, `ambiente.ts` lê `process.env[nome]` nas linhas 42, 43 e 63, com `nome` só da lista. No D8,
  o teste novo tem `process.env` nas linhas 48 a 79. Recusa do gancho a comando meu: uma, um `echo`
  com o texto "git grep:" (citação, Q8 (a)).
- **Incompleto:** o critério da busca do segredo da 4.1, acima. Se `exigir` um dia aceitar nome fora
  da lista, o terceiro caso do teste novo leria o `.env` real; hoje a recusa vem antes da leitura.

### Passagem C, 21/11/2026: achados 1 a 6 do revisor e itens 1 e 2 da decisão do Gabriel

- **Arquivos:** A `.claude/ganchos/decisao-do-git.mjs` (403 linhas, só funções) · M
  `.claude/ganchos/barrar-git-de-escrita.mjs` (39, só o ponto de entrada) · M `.claude/settings.json`
  (+3 regras `Edit`) · A `scripts/conferir-ambiente-local/funcoes.mjs` (393) · M
  `scripts/conferir-ambiente-local.mjs` (213, só a execução) · M os dois testes de `tests/barreiras/`.
  Um `git.cmd` temporário na raiz, criado e apagado (fora do escopo, para a prova do achado 5).
- **RP-12, vermelho** (testes novos contra os módulos antigos): `vitest run tests/barreiras` **código
  1**, `Tests 40 failed | 161 passed (201)`. Vermelhos: as 11 formas do achado 1 (`git${IFS}add`,
  `git$IFS add`, `/mingw64/…/git-add`, `git-add`, `git-lfs push`, `git-receive-pack`, `GIT-ADD.EXE`,
  `bash -c "gi''t add ."`, `bash -c 'g"i"t add .'`, `` g`it add . ``, `cmd /c g^it add .` e o
  `execSync('git-add .')`); os 9 casos e a pasta atual do item 7; os dois pontos de entrada (gancho
  e script saíam com 0 carregados por `import`); e 15 da conferência (subseção, attributes,
  `disableAllHooks`, executável na raiz, registro no archive). **`g\it add .` já era recusado antes**
  (o valor de bash do lexer tira o escape): o achado não se confirmou nessa forma, e o caso ficou na
  tabela.
- **Verde:** o mesmo comando, **código 0**, `Tests 201 passed (201)`. Duas expectativas antigas
  mudaram pelo achado 4 (`remote.origin.url` e `remote.origin.uploadpack` viraram
  `remote.<subseção>.…`), e dois permitidos viraram recusados pelo item 7 (`sha256sum` e `node` do
  gancho, que citam `.claude/ganchos`).
- **Gancho, ao vivo, depois de trocar o ponto de entrada:** `ls .claude/ganchos` recusado com a
  mensagem do item 7, literal; `cat README.md` rodou, código 0.
- **Conferência:** com `git.cmd` na raiz, **código 1**: `PARA · raiz do projeto · git.cmd seria rodado
  no lugar do Git` e `parou antes de rodar o Git, pelos motivos acima`; apagado, o Git rodou de novo.
  Sem `--change`, **código 1**, 6 diferenças, como esperado sem registro.
- **Comandos finais, depois do item 8:** `npm test -- --reporter=default` **código 0**, 16 arquivos,
  319 testes (`comandos conferidos: 146 · permitidos: 58 · recusados: 88 (citam a configuração do
  Claude Code: 9)`; `casos da conferência do ambiente: 43`) · `npm run verificar` **código 0**
  (artefatos 401, tokens 97, chave 517; Prettier passou) · `npx playwright test` **código 0**, 322 de
  322.
- **Desvios (só recusam mais):** o item 7 recusa todo comando com `.claude` **e** `settings` ou
  `ganchos` em qualquer ponto (pega `cd .claude && … settings.local.json`), e também quando o `cwd` da
  entrada está dentro de `.claude`; a forma normalizada também tira `$var`, `${…}`, `$(…)` e
  `` `…` ``; teto de 2000 análises por comando; o gancho carrega a decisão por `import()` dentro do
  `try`, então módulo ausente ou quebrado sai com 2 (provado no rascunho). A conferência imprime o
  sha256 do disco em cada `DIFERENÇA` de arquivo, porque depois do item 7 o líder técnico não roda
  `sha256sum` nesses caminhos; e o registro não aceita mais linha `attributes`, que agora para antes
  do Git.
- **Para o líder técnico:** o registro precisa de linha nova para `decisao-do-git.mjs` (`692eeffb…`)
  e dos sha256 novos: gancho `f8a0b232…`, `settings.json` `3171c172…` (a saída inteira está na
  conferência sem `--change`). Recusas a comandos meus: quatro, todas esperadas (dois `node -e` e um
  heredoc com JSON citando `git`, e `rm git.cmd`, que apaguei por um programa no rascunho).
- **Melhorias propostas:** nenhuma de tela.
- **Incompleto:** não fiz a prova do Write de `settings.local.json` recusado a partir de um subagente
  (pedido 1 do Gabriel): se a regra falhasse, o arquivo ficaria no disco e ninguém o apagaria por
  comando. Fica para o líder técnico decidir quem a faz. Resíduo declarado, sem mudança: nome montado
  em tempo de execução (`$(printf 'g%s' it)`), e glob (`.claude/s*`) não são pegos pelo texto; sobra a regra
  `Edit` e a conferência. `cd .claude` numa chamada e o arquivo na seguinte só é pego se o `cwd` da
  entrada acompanhar o `cd`: **não medido**.

### Passagem D, 22/11/2026: achado 6 (baixa) do revisor, rodada 2

- **Arquivos:** M `scripts/conferir-ambiente-local/funcoes.mjs` (401 linhas): `acharRegistro` troca o
  `endsWith('-<change>')` por `ePastaDaChange`, que casa só `AAAA-MM-DD-<change>` (os 11 primeiros
  caracteres batem com `^\d{4}-\d{2}-\d{2}-$` e o resto é o nome inteiro, sem regex montada do nome) ·
  M `tests/barreiras/ambiente-local.test.mjs` (429): caso novo, `git-local` contra
  `2026-11-21-endurecer-agentes-e-git-local` e `rascunho-git-local`, espera `null`.
- **RP-12, vermelho** (caso novo, correção ausente): `vitest run tests/barreiras/ambiente-local.test.mjs`
  **código 1**, `Tests 1 failed | 44 passed (45)`; o erro foi `duas pastas do archive terminam em
  -git-local`. **Verde:** o mesmo comando, **código 0**, `Tests 45 passed (45)`.
- **Comandos finais:** `npm test -- --reporter=default` **código 0**, 16 arquivos, 320 testes
  (`casos da conferência do ambiente: 44`) · `npm run verificar` **código 0** (artefatos 401, tokens
  97, chave 537). A primeira rodada do `verificar` saiu com 1 pelo Prettier no teste novo; formatei e
  rodei de novo. `npx playwright test`: não rodado nesta passagem (fora do pedido).
- **Recusa da barreira:** uma, falso positivo esperado (heredoc citando `git-local`); a edição foi
  feita pela ferramenta de edição.
- **Melhorias propostas:** nenhuma. **Incompleto:** nada.

## dev-dados

Não entra: a change não tem banco nem tabela.

## guardiao-visual

Não entra: a change não tem tela. A raiz não publicada é comparada pixel a pixel pelo
`qa-acessibilidade` (`design.md`, D11).

## qa-acessibilidade

### Tarefa 1.1, execução vermelha (D3, passo 1), 21/11/2026

Antes, pelo líder técnico: `git diff --cached --name-only` vazio (código 0); `test -e
.claude/settings.json` código 1; `git status --porcelain` só com ` M
openspec/changes/endurecer-agentes-e-git-local/relatorio.md`.

Pelo subagente, pelo `Bash`, uma chamada, literal:

```
$ test -e .claude/settings.json
código 1
$ git rm -n --cached README.md
rm 'README.md'
código 0
$ git add -n README.md
código 0
$ git -C . add -n README.md
código 0
$ bash -c "git add -n README.md"
código 0
$ git diff --cached --name-only
código 0
```

Resultado: 4 de 4 com código 0, 0 recusados. Os três `git add -n` não imprimem nada porque o
`README.md` está rastreado e sem mudança, que é o comportamento do Git (achado do qa, que levou à
correção do critério da 1.1 na rodada 2 do especificador). Depois, pelo líder técnico: `git diff
--cached --name-only` vazio (código 0) e o mesmo `git status --porcelain`.

### Tarefa 6.1, conferência final (D11), 21/11/2026

| Comando | Código de saída | Contadores |
| ------- | --------------- | ---------- |
| `npx playwright test` | 0 | 322 testes (7 larguras, 360 a 1280) · 322 passed · 0 failed · 0 skipped · 0 flaky |
| `npm run build` | 0 | 5 rotas estáticas (`/`, `/_not-found`, `/em-construcao`, `/processo-seletivo`, `/vitrine`) |
| comparação da raiz não publicada, 390 × 844 | 0 | arquivado 390x844 · novo 390x844 · **0 de 329.160** pixels diferentes |
| comparação da raiz não publicada, 1280 × 800 | 0 | arquivado 1280x800 · novo 1280x800 · **0 de 1.024.000** pixels diferentes |
| `git diff --exit-code main -- src tests/e2e public playwright.config.ts` | 0 | nenhuma linha |

- **Método:** `node scripts/iniciar-servidor.mjs nao-publicado 3001` em segundo plano (`/`
  respondeu 200); Chromium do Playwright, `deviceScaleFactor` 1, página inteira, `networkidle`,
  `document.fonts.ready` e 3 s de espera; comparação RGBA canal a canal (decodificação pelo `sharp`
  do repositório), por script no diretório temporário do sistema. Prints e scripts ficaram lá,
  nada versionado. O servidor foi derrubado no fim (porta 3001 livre); o código 1 da tarefa em
  segundo plano é o do `taskkill`, não falha do site.
- **Comparador visto falhando (RP-12):** com 1 pixel do print novo de 390 alterado em (100, 100),
  o mesmo comparador deu 1 de 329.160 e código 1; sem a alteração, 0 e código 0.
- **Repositório:** `git status --porcelain` igual antes e depois da passagem; nenhum arquivo
  escrito fora este bloco.
- **Defeitos:** nenhum · **sem cobertura:** a comparação cobre só a raiz não publicada, nas duas
  larguras do D11; as outras páginas e larguras ficam cobertas pela suíte do Playwright acima.

### Tarefa 1.4, execução verde (D3, passos 2 a 4), 21/11/2026

**Passo 2, pelo subagente, pelo `Bash`, um comando por chamada.** Mensagem comum das recusas, só
mudando o comando e a operação:

```
PreToolUse:Bash hook error: [node "$CLAUDE_PROJECT_DIR/.claude/ganchos/barrar-git-de-escrita.mjs"]: Recusado pela barreira do Git: "<comando>" não está na lista de leitura. Quem escreve no Git é o Gabriel: prepare os arquivos e entregue o comando pronto (CLAUDE.md, "Regras de Git").
Motivo: a operação "<op>" não está na lista de leitura.
```

| Comando | Resultado | Camada |
| --- | --- | --- |
| `git rm -n --cached README.md` | recusado, operação `rm` | gancho |
| `git add -n README.md` | recusado, operação `add` | gancho |
| `git -C . add -n README.md` | recusado, operação `add` | gancho |
| `bash -c "git add -n README.md"` | recusado; o gancho citou o `git add -n README.md` de dentro | gancho |
| `git status` · `git diff --stat` · `git log --oneline -n 3` | passaram (`11 files changed, 570 insertions(+), 227 deletions(-)`; `7bcdec0 docs: propõe a endurecer-agentes-e-git-local` no topo) | — |
| Write em `.git/DEMO-RP12` | recusado: `File is in a directory that is denied by your permission settings.` | regra de negação |
| `test -e .git/DEMO-RP12` · `git diff --cached --name-only` | código 1 · vazio, código 0 | — |

O subagente rodou também, antes da forma literal do primeiro comando, `cd C:/Projetos/portal-liacup
&& git rm -n --cached README.md`, recusado da mesma forma.

**Passo 3, pelo líder técnico** (o subagente não tem estas ferramentas):

- `PowerShell`, `git add -n README.md`, literal:
  ```
  PreToolUse:PowerShell hook error: [node "$CLAUDE_PROJECT_DIR/.claude/ganchos/barrar-git-de-escrita.mjs"]: Recusado pela barreira do Git: "git add -n README.md" não está na lista de leitura. Quem escreve no Git é o Gabriel: prepare os arquivos e entregue o comando pronto (CLAUDE.md, "Regras de Git").
  Motivo: a operação "add" não está na lista de leitura.
  ```
  Camada: gancho. `git status --short` pelo `PowerShell` passou.
- `mcp__terminal__run_in_terminal`: assim que o `.claude/settings.json` foi salvo, a ferramenta saiu
  do conjunto do líder técnico, com o aviso da sessão "Denied by a permission rule:
  mcp__terminal__run_in_terminal". Nenhuma chamada, de `git add -n` ou de qualquer outro comando,
  pode ser feita por ela. Camada: regra de negação da ferramenta inteira (ajuste 1). O gancho não
  chega a ser chamado.
- **Código de saída do gancho**, rodado direto com a entrada em arquivo: `{"tool_input":{"command":
  "git add -n README.md"}}` dá a mensagem acima e **código 2**; `{"tool_input":{"command":"git status
  --porcelain"}}` dá **código 0**, sem saída.

**Passo 4, só a camada 2**, com `.claude/settings.local.json` = `{"disableAllHooks": true}`, criado
pelo Gabriel; pelo líder técnico, pelo `Bash`, um comando por chamada:

| Comando | Resultado |
| --- | --- |
| `git rm -n --cached README.md` | `Permission to use Bash with command git rm -n --cached README.md; echo "código $?" has been denied.` |
| `git add -n README.md` | `Permission to use Bash with command git add -n README.md; echo "código $?" has been denied.` |
| `git -C . add -n README.md` | **passou:** `add 'README.md'`, código 0 |
| `bash -c "git add -n README.md"` | **passou:** `add 'README.md'`, código 0 |

Os dois `add` imprimem a linha porque agora o `README.md` tem mudança. Nada foi escrito: `git diff
--cached --name-only` vazio, código 0, depois do passo. **Limite medido da camada 2:** ela recusa as
formas diretas e não recusa `git -C . add` nem `bash -c`. A documentação dá o exemplo de uma regra
que casa `git -C . push`, mas na medição o `-C .` passou. Com os ganchos desligados, só as formas
diretas ficam barradas.

- **Cobertura:** nenhuma página nova; a suíte inteira (322 testes) e a raiz não publicada (6.1)
- **Medições:** as do Playwright na 6.1, sem defeito
- **Verificação nova demonstrada falhando:** a barreira (1.1 contra 1.4) e o comparador da raiz (6.1)
- **Defeitos:** nenhum · **sem cobertura:** o que está na 6.1

## revisor

O revisor não escreve: o líder técnico registra cada rodada em resumo.

### Rodada 1, 21/11/2026

- **Veredito:** reprovado · 22 arquivos · 7 critérios de aceite · cerca de 20 regras.
- **Achados:**
  1. alta: o gancho deixava passar `git${IFS}add`, o Git com hífen (`git-add`, `git-lfs`) e aspas ou
     escape que só o shell de dentro tira (D2);
  2. média: o ponto de entrada do gancho e o do script saíam com 0 sem decidir, quando `argv[1]`
     diferia do caminho do módulo;
  3. média: `.git/info/attributes` e `disableAllHooks` não paravam a conferência antes do Git;
  4. média: a §5 descrevia a proteção da brecha antes de ela existir;
  5. média: o AS-17 não bloqueava arquivo de instrução a agentes que aparece;
  6. média: evidência faltando no relatório (a correção do nome do segredo, a 6.2, os `grep` de
     verificação, o item da 1.4 não cumprido);
  7. baixas: a conferência curta contra a lista de tela; o I-01 incompleto; a subseção do
     `.git/config` impressa inteira; um `git.exe` na raiz; a §1 dos padrões sem as pastas novas.
- **Encaminhamento:** passagem C do dev-frontend (1 a 3, e o executável e a subseção), textos do
  líder técnico (4 a 7), evidência no relatório.

### Rodada 2, 22/11/2026 (invocação nova, sem o relatório anterior)

- **Veredito:** reprovado · 23 arquivos · 11 critérios (7 de aceite e 4 da decisão da brecha) · 15
  regras. Os 11 têm evidência; o 6 (§6) é a 6.3, depois desta passagem.
- **Achados:**
  1. média: o gancho deixa passar expansões estáticas do shell, como `${X:-git} add .`,
     `$'\x67it' add .`, `g{i..i}t add .` e `/mingw64/bin/g?t.exe add .`, e nenhum texto as declara
     como resíduo;
  2. média: `~/.claude/settings.json` com `disableAllHooks` desliga o gancho, e nenhuma regra de
     negação o protege;
  3. média: o RP-12 do D4 não estava literal no relatório;
  4. baixa: esta seção estava em branco;
  5. baixa: o texto dizia que a conferência pega o programa próprio, mas um commit, uma tag ou um
     push não mudam o índice;
  6. baixa: a busca do registro no archive por `endsWith` aceitava outra change;
  7. baixa: a §5 não dizia como o guardião confere o diff dos arquivos protegidos;
  8. baixa: a spec delta não tinha a decisão da brecha;
  9. baixa: as contagens de `Edit` e o D13 desatualizados;
  10. informativa: a `EQUIPE-DE-AGENTES.md` sem a barreira.
- **Encaminhamento:** 3 a 10 corrigidos (o 3 abaixo; o 6 na passagem D; o 8 e o 9 na rodada 3 do
  especificador; o 4, o 5, o 7 e o 10 pelo líder técnico). O 1 e o 2 mexem em `.claude/ganchos/` e
  nas regras de negação, que só o Gabriel muda; vão a ele como Q13 e Q14.

### Rodada 3, 22/11/2026 (invocação nova; escopo do Gabriel: só a Q14 e o texto da Q13)

- **Veredito:** aprovado com ressalva · 10 arquivos · 10 critérios (5 da Q14 e 5 da Q13). O núcleo
  das duas decisões confere: as duas regras `~/` no `settings.json`, 28 + 28 + 1 + 7 regras, gancho
  igual, uma linha só do `settings.json` no registro; a frase do Gabriel e os resíduos nos três
  textos, sem contradição entre eles.
- **Ressalvas, nenhuma corrigida** (corrigir reabriria o revisor e o guardião; vão ao Gabriel no
  Portão 2):
  1. baixa: `tasks.md:46` ainda espera `Edit: 5`, e o arquivo tem 7;
  2. baixa: `design.md:78` diz "5 regras de `Edit` no total";
  3. baixa: frases absolutas ("deixa passar só", "recusa todo o resto") no `SEGURANCA.md:463-464` e
     no `README.md:302` e `:305`, com o limite longe delas no README;
  4. informativa: "A configuração que segura a barreira" não cita os dois caminhos `~/.claude/` da
     Q14;
  5. informativa: a `EQUIPE-DE-AGENTES.md` diz "são trava" sem o limite;
  6. informativa: a prova da Q14 testou só o `settings.local.json`, que não existia, e não teve
     contraprova antes da regra;
  7. informativa: o RP-12 literal mostra os sha anteriores à Q13 e à Q14, sem aviso.

### Decisões do Gabriel sobre Q13 e Q14, 22/11/2026

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel.

> Decisões do Gabriel (registre literal no relatorio.md):
>
> Q13 (b). Motivo, medido pelo gestor chamando o gancho direto: ele recusa env git, xargs git, G=git; $G e node -e com execSync("git add"), mas deixa passar sh scripts/x.sh e npm run qualquer. Um script escrito pelo agente com git add dentro passa, e a regra geral da opção (a) não fecha esse caminho. Escreva na §5, no CLAUDE.md e no README, com estas palavras ou equivalentes: "a barreira é contra engano, não contra agente que esconde o comando; contra isso valem as leituras depois de cada passagem (índice, HEAD, commits alcançáveis, remoto, conferência do ambiente) e o fato de que só o Gabriel faz push". Na lista de resíduos, inclua os nomes montados pelo shell (achado 1) e o script ou npm script que roda git.
>
> Q14 (a). Entregue o conteúdo novo do .claude/settings.json com Edit(~/.claude/settings.json) e Edit(~/.claude/settings.local.json) e o comando de cópia. O primeiro comando é a conferência do ambiente, com a regra de parar se não der 0.
>
> O revisor roda a terceira rodada só sobre a Q14 e o texto da Q13. Se pedir correção de novo, pare e traga ao Gabriel. Depois siga: guardiao-appsec com o checklist inteiro, a saída dos sete riscos da §6, o archive e o Portão 2.

**Aplicação da Q14 (a), 22/11/2026.** O líder técnico preparou o conteúdo novo do
`.claude/settings.json` fora do repositório (JSON válido, 7 regras `Edit(`, sha256
`b8a83050ecea1d4469766e7815e68beca31e35b3e52e4f0076be61f9071dc9d0`) e pôs o sha no registro antes da
cópia. O Gabriel rodou a conferência (código 0), copiou o arquivo e rodou a conferência de novo
(código 0). O gestor conferiu no disco o sha256, o JSON, as 7 regras e o diff: só a vírgula e as
duas linhas `Edit(~/.claude/...)`. Depois, o líder técnico tirou do registro a linha do sha antigo,
e a conferência deu `diferentes: 6 (aceitos por decisão: 6)`, código 0.

**Prova da Q14, pelo `qa-acessibilidade`**, a pedido do Gabriel ("faça a tentativa de escrita em
~/.claude/settings.local.json por um subagente (deve ser recusada; se passar, pare e traga)"). Antes,
o líder técnico conferiu que o arquivo não existia (em `C:\Users\gabri\.claude` só havia o
`settings.json`). Na primeira invocação, o subagente se recusou a tentar, porque o pedido chegava por
mensagem de agente; com o pedido literal do Gabriel repassado, fez uma chamada só, Write de
`C:/Users/gabri/.claude/settings.local.json` com `{}`:

```
File is in a directory that is denied by your permission settings.
```

Recusado pela regra de negação, sem prompt. Depois, o líder técnico conferiu: em
`C:\Users\gabri\.claude` continua só o `settings.json`.

### RP-12 do D4, literal, refeito pelo líder técnico em 22/11/2026 (achado 3 da rodada 2)

```
=== passo 1, sem registro (sem --change)
DIFERENÇA · arquivo diferente da main: .claude/agents/guardiao-appsec.md · sha256 b054fa3fa60fab257c8ce3f4410585d6c7ca4f1628f1dc0b7d18e507330a35f7
DIFERENÇA · arquivo só no disco: .claude/ganchos/barrar-git-de-escrita.mjs · sha256 f8a0b2322c05561d34ea9fceb528e628e8c700f5ab403769eb90376649333665
DIFERENÇA · arquivo só no disco: .claude/ganchos/decisao-do-git.mjs · sha256 692eeffb48af3332e13c94a1199e781c1e4c4e185796c64a748e48ab56d099da
DIFERENÇA · arquivo só no disco: .claude/settings.json · sha256 3171c17214aa34accabaf569d277d004fb13e3893f0c44e80db902b7f489958e
DIFERENÇA · arquivo diferente da main: CLAUDE.md · sha256 044600cd3fa3d31b17c97bc3c3789ccc0a45a2be29330b56c9400a73c7c0ac4d
DIFERENÇA · regra ativa no .git/info/exclude: AGENTS.md
arquivos comparados: 18 · iguais à main: 13 · diferentes: 6 (aceitos por decisão: 0) · regras de exclusão: 1 · ganchos do Git ativos: 0 · chaves do .git/config: 18 (fora da lista: 0) · ganchos do Claude Code: ligados
código 1
=== passo 2, com registro
registro: 6 linhas (openspec/changes/endurecer-agentes-e-git-local/ambiente-decidido.txt)
ACEITA · arquivo diferente da main: .claude/agents/guardiao-appsec.md · arquivo .claude/agents/guardiao-appsec.md b054fa3fa60fab257c8ce3f4410585d6c7ca4f1628f1dc0b7d18e507330a35f7  # proposta aprovada no Portão 1, 21/11/2026, a linha da regra 2 (D8)
ACEITA · arquivo só no disco: .claude/ganchos/barrar-git-de-escrita.mjs · arquivo .claude/ganchos/barrar-git-de-escrita.mjs f8a0b2322c05561d34ea9fceb528e628e8c700f5ab403769eb90376649333665  # proposta aprovada no Portão 1, 21/11/2026, item 1 e Q1 (c); achado 2 do revisor, rodada 1
ACEITA · arquivo só no disco: .claude/ganchos/decisao-do-git.mjs · arquivo .claude/ganchos/decisao-do-git.mjs 692eeffb48af3332e13c94a1199e781c1e4c4e185796c64a748e48ab56d099da  # proposta aprovada no Portão 1, 21/11/2026, D2; achados 1 e 2 do revisor, rodada 1; decisão do Gabriel de 21/11/2026 sobre a brecha, item 2
ACEITA · arquivo só no disco: .claude/settings.json · arquivo .claude/settings.json 3171c17214aa34accabaf569d277d004fb13e3893f0c44e80db902b7f489958e  # proposta aprovada no Portão 1, 21/11/2026, item 1, Q1 (c), Q3 (b), Q9 (b) e ajuste 1; decisão do Gabriel de 21/11/2026 sobre a brecha, item 1
ACEITA · arquivo diferente da main: CLAUDE.md · arquivo CLAUDE.md 044600cd3fa3d31b17c97bc3c3789ccc0a45a2be29330b56c9400a73c7c0ac4d  # proposta aprovada no Portão 1, 21/11/2026, D10; decisão do Gabriel de 21/11/2026 sobre a brecha, itens 3 e 4; achado 5 do revisor, rodada 2
ACEITA · regra ativa no .git/info/exclude: AGENTS.md · exclude AGENTS.md  # Gabriel, Q17 da pagina-processo-seletivo, 21/11/2026; sai depois do merge desta change (D14)
arquivos comparados: 18 · iguais à main: 13 · diferentes: 6 (aceitos por decisão: 6) · regras de exclusão: 1 · ganchos do Git ativos: 0 · chaves do .git/config: 18 (fora da lista: 0) · ganchos do Claude Code: ligados
código 0
=== passo 3, com .claude/DEMO-RP12.txt (as 6 linhas ACEITA iguais às do passo 2)
DIFERENÇA · arquivo só no disco: .claude/DEMO-RP12.txt · sha256 8ff56676ed1051767655a49dbca3fbecb45ca97c163c4f6ed7b3fb24fdbf26ae
arquivos comparados: 19 · iguais à main: 13 · diferentes: 7 (aceitos por decisão: 6) · regras de exclusão: 1 · ganchos do Git ativos: 0 · chaves do .git/config: 18 (fora da lista: 0) · ganchos do Claude Code: ligados
código 1
=== passo 4, sem ele (as 6 linhas ACEITA iguais às do passo 2)
arquivos comparados: 18 · iguais à main: 13 · diferentes: 6 (aceitos por decisão: 6) · regras de exclusão: 1 · ganchos do Git ativos: 0 · chaves do .git/config: 18 (fora da lista: 0) · ganchos do Claude Code: ligados
código 0
```

O passo 1 roda sem `--change`, que é a conferência sem registro. Os passos 3 e 4 imprimiram também
as 6 linhas `ACEITA`, idênticas às do passo 2; estão omitidas só aqui, e a saída inteira dos dois
está na sessão.

## guardiao-appsec

O guardião não escreve: o líder técnico registra o relatório em uma tela por passagem, com a lista
de achados inteira; a saída de comando e o aceite do Gabriel vão literais.

### Passagem única, 22/11/2026: levantamento e decisão (duas invocações novas)

- **Veredito final:** **APROVADO COM RESSALVAS** · bloqueante 0 · alta 0 · média 0 · baixa 3 ·
  informativa 3 · conferência completa (o diff toca `.claude/`, `.gitignore`, `scripts/`,
  `next.config.ts` e `tests/politicas/`; a conferência proporcional ainda não vale). 24 de 25
  arquivos do diff conferidos; o `relatorio.md` não foi aberto, por regra do guardião.
- **Estados:** AS-01 sem achado nos 24 (o `relatorio.md`, não verificado para os padrões além do
  valor do segredo da Vercel); AS-02, AS-03, AS-06, AS-08, AS-09 e AS-10 sem achado; AS-04, AS-05,
  AS-07, AS-11 a AS-16 não se aplicam (AS-15: o diff não mexe em cabeçalho; o LB-07 segue aberto);
  AS-17 com os achados A2 a A5.
- **Os sete riscos da §6:** todos conferidos. LB-05 e LB-06 pela conferência do ambiente; LB-14
  pela decisão Q5 (a); LB-15, LB-24 e LB-25 pelo README e pela §8 dos padrões; LB-26 pelo ajuste 4
  (o protótipo nomeado na §5). Saíram da tabela em 22/11/2026, para "Saíram da lista".
- **A1 retirado** na decisão: a Write em `.claude/settings.local.json` e a Edit em
  `.claude/ganchos/decisao-do-git.mjs` recusadas (21/11), a Write em `~/.claude/settings.local.json`
  recusada (22/11), nenhum arquivo novo depois. Sem contraprova anterior às regras, a causa da
  recusa não fica provada, mas a propriedade se cumpre.
- **Achados (lista inteira):**
  - **A2 · AS-17 · baixa · provável:** `.agents/` (6 `SKILL.md` e `.openspec-target`, ignorada pelo
    `.gitignore:48`) fica fora da lista do AS-17 e da conferência. Cenário: um agente muda um
    `SKILL.md` ali, o `git status` não mostra, e outra ferramenta de agente carrega a instrução.
    Critério: `.agents/` entra no AS-17 e nos caminhos vigiados, com teste; ou decisão do Gabriel.
  - **A3 · AS-17 · baixa · confirmado:** a conferência não confere os próprios arquivos
    (`scripts/conferir-ambiente-local.mjs` e `scripts/conferir-ambiente-local/funcoes.mjs`).
    Cenário: um agente muda `ehVigiado` ou `desligaOsGanchos`, e a conferência passa a dar 0 com
    `.claude/` alterado. Critério: a conferência compara os próprios arquivos com a `main` ou com o
    registro, com teste.
  - **A4 · AS-17 · baixa · confirmado:** a lista de tela da conferência proporcional inclui
    `openspec/changes/<change>/`, o que alcança o `ambiente-decidido.txt` e specs delta das specs do
    gatilho. Critério: esses arquivos caem no passo 1.
  - **A5 · AS-17 · informativa · confirmado:** a configuração global e a de sistema do Git não são
    lidas, e a §5 não diz isso. Critério: a §5 declara o limite.
  - **A6 · AS-01 · informativa · confirmado:** conflito que já existe na `main`: a §5 restringe as
    formas de contagem aos arquivos rastreados na `main` quando o diff mexe no `.gitignore`, e exige
    a busca de segredo no `relatorio.md` antes da entrega. Critério: a §5 diz como se conclui o AS-01
    do `relatorio.md` nesse caso; até lá, vai ao Gabriel no portão.
  - **A7 · AS-01 · informativa · confirmado:** "O commit da prévia" da §5 diz "antes das quatro
    formas", mas só a do `curl` usa a prévia. Critério: a §5 diz a quais formas se aplica.
- **Pedidos de comando** (Git Bash, `MSYS_NO_PATHCONV=1`; precondições: conferência do ambiente
  com código 0; `test -e .npmrc` código 1; registro `https://registry.npmjs.org/`; `git rev-parse
  main` = `git ls-remote origin refs/heads/main` = `da0637826dc263e89275b112037f13246d7c1a0f`;
  `git rev-list main..HEAD` = `7bcdec0b6231d21fbfff290245714adade694be3`; `curl` 8.7.1; a linha do
  `.env`, por script que só conta: 1 com o nome, 0 vazia, 0 com aspas, 0 com `#`, 0 com espaço ou
  tab depois do `=` ou no fim, 0 com `\r`):
  - P1 a P5 · AS-01 · `git grep -c -a --untracked -e '<padrão>' -- '…/relatorio.md'` · **recusados**:
    o diff mexe no `.gitignore`, e o `relatorio.md` não é rastreado na `main` (§5);
  - P6 · AS-01 · a forma `--untracked` com o segredo da Vercel · saída vazia · `[código de saída: 1]`;
  - P7 · AS-01 · a forma por commit, `<rev>` = `7bcdec0` · saída vazia · `[código de saída: 1]`.
    Desvio declarado ao guardião: rodados sem a conferência do commit da prévia, que não existe (A7);
    o guardião julgou que valem. `git diff --cached --name-only` vazio no momento;
  - P8 · `git log --all --oneline -S 'eyJhbGci'` e P9 · `git log --all --oneline -S 'sb_secret_'`,
    a mesma saída nos dois, `[código de saída: 0]`:
    ```
    bff7ee8 wip: implementa a pagina-processo-seletivo antes das decisões do Portão 2
    5800996 feat: entrega a moldura das páginas públicas e o hero da inicial
    a7283fa wip: auditoria-de-base-appsec, blocos 1 a 5 e tabela de achados
    4048223 chore: monta o guardiao-appsec e arquiva a change
    20b30d5 wip: guardiao-appsec montado, auditoria bloqueada pelo next da main
    ```
  - P10 a P17 · AS-17 · `git diff main -- '<arquivo>'` de `CLAUDE.md`, `.claude/agents/guardiao-appsec.md`,
    `.gitignore`, `next.config.ts`, `docs/SEGURANCA.md`, `README.md`, `docs/EQUIPE-DE-AGENTES.md` e
    `docs/PADROES-DE-CODIGO.md` · `[código de saída: 0]` cada. A saída é o próprio diff da change
    (584 linhas), entregue literal ao guardião e reproduzível pelo mesmo comando; não se transcreve
    aqui. Busca de valor com cara de chave na saída inteira: código 1;
  - P18 · `git check-ignore -v -- 'AGENTS.md'` · `.gitignore:54:AGENTS.md	AGENTS.md` ·
    `[código de saída: 0]`;
  - P19 · `git ls-files -- 'AGENTS.md'` · saída vazia · `[código de saída: 0]`.
- **Riscos aceitos pelo Gabriel:** nenhum.

### Decisões do Gabriel no Portão 2, 22/11/2026

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel.

> Decisões do Gabriel (registre literal no relatorio.md arquivado):
> Q15 (a), com a busca corrigida pelo gestor. Os padrões soltos acham 1 ocorrência de eyJhbGci e 1 de sb_secret_ no relatório, mas são o texto dos pedidos P8 e P9 do guardião, não chave. A busca que vale é o padrão seguido do formato de chave: eyJhbGci[A-Za-z0-9_-]{20,}, sb_secret_[A-Za-z0-9_-]{10,}, sbp_[A-Za-z0-9]{20,}, github_pat_ e PRIVATE KEY. O gestor rodou e deu 0; o Gabriel roda de novo antes do commit.
> Q16 (b): as ressalvas A2 a A7 do guardião e as 7 da terceira rodada do revisor vão para o briefing da ajustar-ci-ao-novo-fluxo.
> Não precisa de nova lista de comandos: o Gabriel usa a sua, com o passo 2 trocado pela busca acima.

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum. Nesta change, os
escopos nominais são os do `design.md`, D13.

- **Arquivos fora do escopo, por agente:**
  - `dev-frontend`, passagem C: um `git.cmd` temporário na raiz, criado e apagado para provar o
    achado 5 do revisor; não ficou no disco nem no `git status`;
  - `qa-acessibilidade`, prova da brecha: as tentativas de escrita em `.claude/`, pedidas pelo líder
    técnico, todas recusadas e nenhuma gravada;
  - nas outras passagens, nenhum. `git diff --cached --name-only` vazio depois de cada uma.
- **Conferência do ambiente depois de cada passagem:** código 0 depois do registro, salvo os
  vermelhos de propósito (passo 1 e passo 3 do D4) e o momento em que o `.claude/settings.local.json`
  do passo 4 do D3 estava no disco (código 1, `PARA · Claude Code · disableAllHooks ligado`). O
  registro foi refeito depois da passagem C, com o diff do gancho, do módulo novo e do
  `settings.json` lido pelo líder técnico, e a conferência voltou a 0 (`diferentes: 6 (aceitos por
  decisão: 6)`). O contador `diferentes` soma arquivos e regras do exclude: 18 comparados, 13 iguais,
  5 arquivos diferentes e 1 regra.

### Prova da brecha fechada (decisão do Gabriel, itens 1 e 2), pelo `qa-acessibilidade`

| Ação | Resultado | Quem recusou |
| --- | --- | --- |
| Write de `.claude/settings.local.json` com `{}` | `File is in a directory that is denied by your permission settings.` | regra de negação |
| Edit de `.claude/ganchos/decisao-do-git.mjs` | a mesma mensagem | regra de negação |
| Bash `echo '{}' > .claude/settings.local.json` | `Recusado pela barreira: o comando cita a configuração do Claude Code (.claude/settings ou .claude/ganchos). Mudar esses arquivos é passo do Gabriel.` | gancho |
| Bash `cat README.md \| head -3` | passou, código 0 | — |
| conferência do ambiente | código 0, `ganchos do Claude Code: ligados` | — |

Nenhum arquivo foi gravado: a conferência seguinte não acusa nenhum arquivo novo em `.claude/`.

### A correção do nome do segredo no teste de tabela (tarefa 4.1)

A passagem B achou o nome real da variável do segredo da Vercel em
`tests/barreiras/git-de-escrita.test.mjs` (duas linhas), o que fazia a busca da 4.1 dar código 0.
O D3 pedia as formas da §5 literais na tabela, e a §5 do `SEGURANCA.md` só permite o nome em
`docs/`, `openspec/`, `README.md` e `.env.example`. O `SEGURANCA.md` é nível 3 da hierarquia, e o
design é nível 5: vence a §5. O líder técnico trocou o nome por `SEGREDO_DE_EXEMPLO`, numa
constante; a forma do comando é a mesma. Depois: a busca da 4.1 deu **código 1**, sem saída, e os
testes de `tests/barreiras/` deram 161 de 161.

### Tarefa 6.2 e as verificações de texto, 21/11/2026, depois da passagem C

| Comando | Código de saída | Contadores |
| --- | --- | --- |
| `npm run verificar` | 0 | `537 arquivo(s) varridos, 74 deles entregues ao navegador: nenhuma ocorrencia do valor nem do nome da chave de servico` |
| `npm test -- --reporter=default` | 0 | 16 arquivos, 319 testes · `comandos conferidos: 146 · permitidos: 58 · recusados: 88 (citam a configuração do Claude Code: 9)` · `casos da conferência do ambiente: 43` · `variáveis no arquivo: 5 · entraram: 3` |
| `openspec validate --all --strict` | 0 | — |
| dependências diretas | — | 22 |
| `git diff --exit-code main -- package.json package-lock.json .github .claude/skills` | 0 | — |
| `git diff --exit-code main -- docs/ADR-0005-modelo-de-branches.md` | 0 | — |
| `node scripts/conferir-ambiente-local.mjs --change endurecer-agentes-e-git-local` | 0 | `arquivos comparados: 18 · iguais à main: 13 · diferentes: 6 (aceitos por decisão: 6)` |

Verificações de texto (`grep -c -F`): `conferir-ambiente-local` 2 no `SEGURANCA.md`, 2 no
`CLAUDE.md`, 1 no `README.md`; `AGENTS.md` 3 no `SEGURANCA.md`; `/hooks` 0 no `README.md`; "cada
`test -e` devolve código 1" 0; `ls-remote origin refs/heads/main` 1; "de forma dinâmica hoje" 0;
`curl --version` 1; "O pedido escolhe só o caminho" 0; `Portal-LIACUP.html` 1; "serve o commit" 1;
`1.192.346` 1; "Conferência proporcional" 1 no `SEGURANCA.md` e 1 no `guardiao-appsec.md`; "Só vale
depois de escrito" 0 no `CLAUDE.md`; `@fission-ai/openspec@2.1.0` 1 no `README.md`;
`guardiao-appsec` de 0 para 1 no `README.md` e no `PADROES-DE-CODIGO.md`; `git diff --stat main --
.claude/agents` só no `guardiao-appsec.md`, com 2 linhas.

### Critério da 1.4 que não se cumpriu como o design esperava

O D3, passo 4, esperava `git -C . add -n README.md` **recusado pela regra de negação** com os
ganchos desligados, porque a documentação do Claude Code dá o exemplo de uma regra que casa `git
-C . push`. Medido: **passou**. É o limite da camada 2, registrado no README e na seção da tarefa
1.4. Com o gancho ligado, a forma é recusada.
