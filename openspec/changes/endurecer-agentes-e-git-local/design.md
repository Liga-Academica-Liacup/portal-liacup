# Design — endurecer os agentes e o Git local

## Context

Ver `proposal.md`, seção Why. Estado medido pelo líder técnico em 21/11/2026, na `main` `da06378`,
e lido pelo especificador:

| O que | Situação |
| --- | --- |
| Configuração do Claude Code no projeto | Não existe `.claude/settings.json`, `.claude/settings.local.json` nem `.mcp.json`. Seis skills com `allowed-tools: Bash(openspec:*)` na linha 4. `dev-frontend`, `dev-dados` e `qa-acessibilidade` têm `Bash`, e o `guardiao-visual` também |
| Ferramentas de terminal | `Bash`, `PowerShell` e `mcp__terminal__run_in_terminal`, que digita no terminal do Gabriel. O gancho `PreToolUse` dispara também nas chamadas dos subagentes. Só o código 2 bloqueia: qualquer outro código diferente de 0 deixa passar (falha aberta). Regra de negação casa por prefixo. `disableAllHooks` desliga os ganchos, e as regras de negação continuam valendo |
| Git local | `.git/hooks/` só com `*.sample`. `.git/info/exclude` com uma linha ativa, `AGENTS.md`, posta pelo Gabriel (Q17 da `pagina-processo-seletivo`) |
| `AGENTS.md` | Escrito pelo `next dev` (16.4.6) quando `agentRules` não é falso e há um agente de IA na sessão. Com `agentRules: false`, o Next apaga o bloco dele e o arquivo, se ficar vazio. O `experimental.agentFeedback` escreve no mesmo arquivo e vem desligado. O texto do arquivo tem instruções a agentes, e é tratado como dado |
| Testes de política | `tests/politicas/ambiente.ts` copia o `.env` inteiro para o `process.env`, sem sobrescrever o que já existe. Só `tests/politicas/clientes.ts` chama `exigir`, com três nomes: `SUPABASE_TESTE_URL`, `SUPABASE_TESTE_ANON_KEY` e `SUPABASE_TESTE_SERVICE_ROLE_KEY`. `npm test` exclui `tests/politicas/**` e `tests/banco/**` (`vitest.config.mts`) |
| Leitura de `process.env[…]` | `tests/politicas/ambiente.ts:42`, `scripts/purgar-dado-pessoal.mjs:36`, `scripts/verificar-chave-de-servico.mjs:45` e `scripts/verificar-tipos-do-banco.mjs:56`, sempre com nome em constante. `scripts/iniciar-servidor.mjs:39` repassa o ambiente inteiro ao processo filho. O I-01 citou três desses pontos; os dois de `verificar-*` são achado do especificador |
| Dependências | 22 diretas: 4 de produção e 18 de desenvolvimento |

## Goals / Non-Goals

**Goals:**

- A recusa de escrita no Git passa a ser trava para comando de agente, com a falha fechada no que a
  barreira não entende.
- O que a barreira não pega, a conferência do ambiente e do índice pega depois de cada passagem,
  antes do próximo agente.
- Toda verificação nova é vista falhando e diz quanto mediu (RP-12).

**Non-Goals:**

- Impedir que um agente com terminal rode código arbitrário. A ameaça é o erro e o disfarce comum,
  inclusive por texto plantado (D1).
- Mudar o terminal do Gabriel, o GitHub Desktop ou as configurações globais da máquina.
- Automatizar a classificação da regra 2. Ela é mecânica, por listas, mas quem a aplica é o líder
  técnico, e o guardião a confere pela lista do diff.

## Decisions

### D1 — A ameaça e as duas camadas (Q1)

- **A ameaça:** um agente que roda `git add`, `git rm`, `git restore` ou `git push` por hábito, por
  engano ou porque um texto plantado o mandou, inclusive em forma disfarçada. **Fora da ameaça:** um
  agente que escreve um programa e o roda. Com `Bash`, isso sempre é possível (`node arquivo.mjs`
  que chama o Git, ou escrever direto em `.git/`). Esse resíduo é declarado, e quem o cobre é a
  conferência do ambiente (D4) junto com o `git diff --cached --name-only` e o `git status
  --porcelain` que o líder técnico roda depois de cada passagem.
- **Camada 1, o gancho** (`.claude/ganchos/barrar-git-de-escrita.mjs`, em `node` puro, sem
  dependência). Ele é registrado em `PreToolUse` com matcher `Bash|PowerShell|mcp__terminal__run_in_terminal`
  e lê o texto do comando no campo de entrada de cada ferramenta. O `dev-frontend` confere o nome do
  campo no esquema de cada uma, e campo ausente dá recusa. Permitir é sair com 0 e sem saída. Recusar
  é sair com 2, com a mensagem no erro padrão. Todo erro é capturado e sai com 2.
- **Camada 2, as regras de negação** em `.claude/settings.json`, para quando o gancho estiver
  desligado ou o `node` não abrir:
  - `Bash(git <op>:*)` para `add`, `commit`, `push`, `rm`, `mv`, `restore`, `reset`, `checkout`,
    `switch`, `stash`, `merge`, `rebase`, `cherry-pick`, `tag`, `branch -d`, `branch -D`, `clean`,
    `fetch`, `pull`, `clone`, `init`, `config`, `apply`, `am`, `revert`, `update-index` e
    `update-ref`;
  - `Bash(gh:*)` (Q3);
  - as mesmas regras para `PowerShell`, se a ferramenta aceitar regra por prefixo. O dev mede, e se
    não aceitar, o relatório diz isso;
  - pela Q9 (b), negação de `Edit` e `Write` em `.git/**`, na sintaxe de caminho que a documentação
    do Claude Code dá para regra de arquivo, também medida pelo dev.

  A camada 2 não pega `git -C . add` nem `bash -c`. É limite conhecido, escrito no README.
- **Por que não só uma camada:** só regras reprova o critério do briefing; só gancho falha aberto
  quando os ganchos são desligados.

### D2 — A função de decisão do gancho

- **Onde procurar.** O gancho procura **todo** aparecimento das palavras `git`, `git.exe` e `gh`
  como nome de comando, em qualquer ponto do texto. Conta como nome de comando a palavra que vem
  depois do começo do texto, de espaço, de `;`, `&`, `|`, `(`, `)`, `{`, `` ` ``, `'`, `"`, `$`,
  `=`, `/` ou `\`, e que é seguida de espaço, fim, aspas, `)` ou `;`. Assim a busca alcança o que
  vem depois de `;`, `&&`, `||` e `|`, dentro de `$(…)` e de crase, dentro de
  `bash -c`/`sh -c`/`powershell -Command`/`cmd /c`/`node -e`, depois de `xargs` e de `-exec`, e
  com caminho (`/usr/bin/git`). Não alcança `.git/`, `.gitignore` nem `portal-git`, que são
  precedidos de `.` ou `-`.
- **`gh`:** todo aparecimento é recusado (Q3 (b)).
- **Opções globais do `git`:** `-C <pasta>`, `--no-pager`, `-P`, `--no-optional-locks`,
  `--literal-pathspecs`, `--git-dir` e `--work-tree` são puladas para achar a operação. **`-c`,
  `--config-env` e `--exec-path` são recusadas**, porque `-c core.pager=…` ou
  `-c core.fsmonitor=…` roda programa a partir de qualquer leitura. É desvio da sugestão do
  briefing, que era pular o `-c`, e o motivo está acima. Outra opção qualquer antes da operação
  também dá recusa.
- **A lista de leitura**, com o uso de cada operação hoje:

  | Operação | Para quê |
  | --- | --- |
  | `status`, `diff`, `log`, `show` | Conferência de escopo, revisão do diff e histórico |
  | `ls-files`, `ls-tree`, `grep`, `check-ignore` | Formas da §5 e auditoria de base |
  | `rev-parse`, `ls-remote` | Regra 5 do Git no `CLAUDE.md` e o B-01 |
  | `rev-list`, `merge-base` | A busca commit a commit da §5 e o `main...HEAD` |
  | `cat-file`, `blame` | Leitura de objeto e de autoria |
  | `branch` | Só sem argumento, ou só com `--list`, `-a`, `--all`, `-r`, `--remotes`, `-v`, `-vv` ou `--show-current` |
  | `version`, `--version` | Versão |

  Ficam fora, mesmo tendo forma de leitura, porque têm forma de escrita e nenhum agente precisa
  deles: `stash list`, `tag -l`, `remote -v`, `config --get`, `reflog`, `worktree list` e `notes`.
- **Opções recusadas dentro da lista**, porque escrevem arquivo ou rodam programa: `--output` (em
  qualquer operação), `-O` e `--open-files-in-pager` (`grep`) e `-u` e `--upload-pack`
  (`ls-remote`).
- **Falha fechada:** operação fora da lista, apelido (`git st`), `git` sem operação, aspas sem par,
  campo de entrada ausente ou exceção dão recusa.
- **Citação (Q8 (a)):** `grep -n "git push" docs/x.md` é recusado, porque a função não distingue
  citação de invocação. O líder técnico registra a recusa e lê o arquivo pela ferramenta de leitura.
- **A mensagem de recusa**, em português, no erro padrão:
  `Recusado pela barreira do Git: "<trecho>" não está na lista de leitura. Quem escreve no Git é o Gabriel: prepare os arquivos e entregue o comando pronto (CLAUDE.md, "Regras de Git").`

### D3 — O teste da função e a demonstração a partir de um subagente

- **Teste de tabela** em `tests/barreiras/git-de-escrita.test.mjs`, importando a função exportada
  pelo gancho. `tests/barreiras/` não está no `exclude` do `vitest.config.mts`, então roda no
  `npm test`, sem mudar a configuração. A saída imprime
  `comandos conferidos: N · permitidos: P · recusados: R`. A tabela traz pelo menos:
  - **permitidos:** `git status`, `git status --porcelain`, `git diff --cached --name-only`,
    `git log --oneline -n 5 main`, `git -C . status`, `git rev-parse HEAD && git ls-remote origin
    main`, cada forma da lista fechada da §5 com as lacunas preenchidas (as quatro com o segredo
    inclusive), `cat .git/info/exclude`, `cat .gitignore`, `npm test`,
    `openspec validate --all --strict` e `ls src`;
  - **recusados:** cada operação da camada 2, `git branch nova`, `git branch -m a b`,
    `git -C . add -n x`, `git --no-pager add x`, `git -c core.pager=x status`,
    `git --exec-path=x status`, `bash -c "git add -n README.md"`, `sh -c 'git rm x'`,
    `powershell -Command "git add ."`, `cmd /c git add .`, `echo ok && git commit -m x`,
    `ls; git push`, `echo $(git stash)`, `` echo `git reset` ``, `xargs git add`,
    `find . -exec git add {} ;`, `node -e "require('child_process').execSync('git add .')"`,
    `/usr/bin/git add x`, `git.exe add x`, `git st`, `git`, `git status "`, `git log --output=x`,
    `git grep -O vi x`, `git ls-remote --upload-pack=x origin`, `gh pr create`,
    `gh api -X POST x` e `grep -n "git push" docs/x.md`.
- **RP-12 do teste:** o dev põe `add` na lista de leitura, vê o teste vermelho com o número de casos
  que falharam, desfaz, e vê verde de novo. `sha256sum` do gancho igual antes e depois.
- **Demonstração a partir de um subagente** (critério do briefing), feita pelo
  `qa-acessibilidade`, que tem `Bash`. Todas as formas de escrita usam `-n` (simulação), então nada
  é escrito mesmo se a barreira falhar:
  1. **Antes de o gancho existir**, no começo do apply: `git rm -n --cached README.md`,
     `git add -n README.md`, `git -C . add -n README.md` e `bash -c "git add -n README.md"` rodam,
     com código 0 e a linha `add 'README.md'` ou `rm 'README.md'`. É a execução vermelha: sem
     barreira, as formas passam;
  2. **Depois** de o Gabriel carregar o gancho (tarefa 1.3): as quatro são recusadas com a mensagem
     do D2, e `git status`, `git diff --stat` e `git log --oneline -n 3` rodam. É a execução verde;
  3. **Só a camada 2:** com os ganchos desligados por `disableAllHooks: true` num
     `.claude/settings.local.json` criado e apagado pelo Gabriel, `git add -n README.md` é recusado
     pela regra de negação, e `git -C . add -n README.md` passa, que é o limite do D1. Se a sessão
     não puder recarregar as configurações de novo, o passo 3 fica **não medido**, com essas
     palavras, e o Gabriel decide no Portão 2.

  Antes e depois de cada passo, o líder técnico registra `git diff --cached --name-only` (vazio) e
  `git status --porcelain`. As saídas vão literais para o relatório.

### D4 — A conferência do ambiente local (LB-05, LB-06, Q6, Q10)

- **O comando:** `node scripts/conferir-ambiente-local.mjs [--change <nome>]`. Roda com o `node`
  direto e **sem `npm run`**, porque o `npm` lê o `.npmrc` e roda scripts `pre`/`post` antes da
  conferência que existe para conferir o ambiente. Por isso o `package.json` não muda. É desvio da
  sugestão do briefing (`npm run`), pelo motivo acima.
- **Ordem, falha fechada:**
  1. **Sem rodar o Git**, o script lê como texto:
     - o `.git/config`, contra a lista de chaves permitidas (Q10 (a)): `core.repositoryformatversion`,
       `core.filemode`, `core.bare`, `core.logallrefupdates`, `core.symlinks`, `core.ignorecase`,
       `remote.origin.url` (igual a uma constante do script, que o Gabriel confere no Portão 2),
       `remote.origin.fetch` (igual a `+refs/heads/*:refs/remotes/origin/*`), `branch.<nome>.remote`
       (igual a `origin`) e `branch.<nome>.merge`. Chave fora da lista, `include`, `includeIf` ou
       seção que o script não entende param a conferência. Ele imprime o nome da chave, nunca o
       valor;
     - `.git/hooks/`: todo arquivo que não termina em `.sample` para;
     - `.git/info/exclude` e `.git/info/attributes`: toda linha que não é comentário nem vazia;
     - `disableAllHooks` em `~/.claude/settings.json` e em `.claude/settings.local.json`: se ligado,
       para.

     Se o passo 1 parar, o script sai antes de rodar qualquer `git`, porque um `core.fsmonitor` ou um
     gancho rodaria nele.
  2. **Com o Git, só leitura:** `git ls-tree -r main` dos caminhos vigiados e `git hash-object` (sem
     `-w`) de cada arquivo do disco, com a mesma conversão de fim de linha que o Git aplica. Os
     arquivos do disco são listados pelo sistema de arquivos, e não pelo `git ls-files`, para
     alcançar o que o `.gitignore` e o exclude escondem.
- **Caminhos vigiados:** todo arquivo de `.claude/`, `CLAUDE.md`, `.mcp.json`, `openspec/config.yaml`
  e os arquivos de instrução a agentes do D6, em qualquer pasta, fora `node_modules/`, `.next/` e
  `.git/`. Arquivo diferente do da `main`, só no disco ou só na `main` conta como diferença.
- **Diferença decidida:** o registro fica em `openspec/changes/<change>/ambiente-decidido.txt`, e só
  o líder técnico o escreve. Uma linha por diferença, com a decisão citada:

  ```
  arquivo .claude/settings.json <sha256 do conteúdo no disco>  # proposta aprovada, item 1 e Q1
  exclude AGENTS.md  # Gabriel, Q17 da pagina-processo-seletivo, 21/11/2026
  ```

  Com `--change`, o script aceita a diferença só se o sha256 do disco for o registrado, e imprime
  cada linha aceita. O líder técnico atualiza o sha256 depois de cada passagem do dev que mexe no
  arquivo, e só depois de ler o diff dele. Agente que mexer no registro aparece na conferência de
  escopo, e o arquivo está no diff que o `revisor` e o guardião leem.
- **Saída:**
  `arquivos comparados: N · iguais à main: I · diferentes: D (aceitos por decisão: A) · regras de exclusão: E · ganchos do Git ativos: G · chaves do .git/config: K (fora da lista: F) · ganchos do Claude Code: ligados|desligados`.
  Sai com 0 só sem diferença não aceita.
- **Quando roda:** antes de cada leva de formas da §5, antes de entregar os comandos Git e depois de
  cada subagente, junto com o `git status` da conferência de escopo. Isso fica escrito na §5 e no
  `CLAUDE.md`.
- **Teste:** `tests/barreiras/ambiente-local.test.mjs`, sobre as funções puras do script, com
  exemplos de `.git/config` (`core.fsmonitor`, `alias.x`, `includeIf`), lista de ganchos, exclude,
  e árvore contra disco. Roda no `npm test` e imprime quantos casos conferiu.
- **RP-12 no repositório:**
  1. depois de o dev criar o `.claude/settings.json` e o gancho, e antes do registro: vermelho,
     com os dois arquivos só no disco e a linha `AGENTS.md` do exclude;
  2. o líder técnico escreve o registro: verde;
  3. o dev cria `.claude/DEMO-RP12.txt`: vermelho, com o arquivo nomeado;
  4. o dev apaga o arquivo: verde.

  As quatro saídas vão literais, com o código de saída.

### D5 — `AGENTS.md` (Q4 (c))

- `agentRules: false` no `next.config.ts`, com um comentário que diz por quê. `experimental` não
  ganha `agentFeedback`.
- No `.gitignore`, um bloco comentado com `AGENTS.md`, que pega qualquer pasta. Os outros arquivos
  do D6 não entram no `.gitignore`: quem os pega é a conferência (D4), que para.
- **RP-12:**
  - **vermelho:** com `agentRules: true` posto para a demonstração, `next dev` a partir da sessão
    do agente. O `AGENTS.md` aparece (`test -e AGENTS.md` com código 0);
  - **verde:** com `agentRules: false`, o `next dev` apaga o arquivo e não o recria
    (`test -e AGENTS.md` com código 1, depois de o servidor subir e ser derrubado);
  - **se o Next não detectar o agente na sessão do subagente**, o vermelho é o `AGENTS.md` que já
    está no disco antes da mudança, e o verde é o arquivo apagado pelo primeiro `next dev` com
    `agentRules: false`. O relatório diz qual dos dois caminhos rodou.
- **Também:** `git ls-files -- AGENTS.md` vazio, e `git check-ignore -v -- AGENTS.md` aponta a linha
  do `.gitignore`, que tem precedência sobre o exclude. O caso sem a linha do exclude é conferido
  pelo Gabriel depois do merge (D14).
- **Efeito na §5:** como o diff mexe no `.gitignore`, as formas de conteúdo e de contagem do guardião
  valem nesta change só para arquivos já rastreados na `main`. É a regra da §5, e ela se aplica sem
  exceção.

### D6 — A lista do AS-17

- **Critério:** entra no AS-17 todo arquivo que uma ferramenta de agente de IA lê sozinha, ao abrir
  a pasta, como instrução ou como configuração.
- **Acréscimos à lista de hoje:** `CLAUDE.md` e `CLAUDE.local.md` em qualquer pasta, `AGENTS.md` em
  qualquer pasta, `GEMINI.md`, `.cursorrules`, `.cursor/`, `.windsurfrules`, `.clinerules`,
  `.github/copilot-instructions.md` e `.github/instructions/`.
- Ferramenta nova com arquivo próprio ganha linha por change. A conferência do D4 vigia a mesma
  lista.

### D7 — O ambiente dos testes de política

- Uma constante em `tests/politicas/ambiente.ts` com os três nomes do Context.
- `carregarAmbiente` aceita o caminho do arquivo, com `.env` como padrão, leva ao `process.env` só
  os nomes da lista e mantém a precedência do ambiente.
- `exigir(nome)` recusa nome fora da lista antes de ler o ambiente, com o nome e a lista na
  mensagem, nunca valor.
- **Teste** em `tests/barreiras/ambiente-dos-testes-de-politica.test.ts`, que roda no `npm test`
  sem banco:
  - um `.env` temporário no diretório temporário do sistema, com os três nomes (valores falsos) e
    mais dois: `SEGREDO_FORA_DA_LISTA` e `OUTRA_VARIAVEL`;
  - o teste confere que só os três entram, salva e restaura o `process.env`, e imprime
    `variáveis no arquivo: 5 · entraram: 3`.
- **Desvio do briefing, com motivo:** o arquivo temporário usa `SEGREDO_FORA_DA_LISTA`, e não
  `VERCEL_AUTOMATION_BYPASS_SECRET`. Com o nome real, o teste leria a variável pelo nome. Se ela
  existisse no ambiente de quem roda, a mensagem da asserção que falhasse mostraria o valor. E a
  conferência da §5, `git grep -c --untracked -e 'VERCEL_AUTOMATION_BYPASS_SECRET'` fora de
  `docs`, `openspec`, `README.md` e `.env.example`, deixaria de dar código 1. A propriedade testada
  é a mesma para qualquer nome fora da lista.
- **RP-12:** o dev volta o carregador a levar o arquivo inteiro, vê o teste vermelho, desfaz, e vê
  verde.
- `npm run test:banco` roda se o projeto de teste estiver no ar. Se não estiver, o relatório diz
  **não medido**.

### D8 — A regra 2 da dieta (Q11 (a))

O texto entra na §5, depois da conferência curta, com as listas abaixo. Fora da auditoria de base,
a ordem de decisão é esta:

1. Algum arquivo do diff está na **lista do gatilho**, ou o diff acrescenta `process.env` ou
   `NEXT_PUBLIC_`? Então o checklist inteiro.
2. A change é só de documentação que descreve? Então a conferência curta, AS-01 e AS-09.
3. A change é da R1, e todo arquivo do diff está na **lista de tela**? Então AS-01, AS-02, AS-04,
   AS-07 e AS-15.
4. Qualquer outro caso: o checklist inteiro.

- **O diff** é o da §5: `git diff --name-only main...HEAD` mais `git status --porcelain
  --untracked-files=all`. A conferência de conteúdo usa `git diff -G 'process\.env|NEXT_PUBLIC_'
  --name-only main...HEAD`, e, nos arquivos não rastreados, `git grep -c --untracked`.
- **Lista do gatilho:**
  - `.claude/`, `CLAUDE.md`, `.mcp.json`, `openspec/config.yaml`,
    `openspec/changes/MODELO-relatorio.md` e os arquivos do D6;
  - todo arquivo ou pasta cujo nome começa com `.git`, em qualquer pasta (`.gitignore`,
    `.gitattributes`, `.github/`, o que inclui o CI), mais `.npmrc` e `.nvmrc`;
  - `package.json` e `package-lock.json`;
  - `supabase/`, `src/lib/supabase/`, `tests/politicas/` e `tests/banco/`;
  - `src/proxy.ts`, `next.config.*` e `vercel.json`;
  - `.env*` e `scripts/`;
  - `src/app/(interno)/` e todo `route.ts`;
  - `docs/constitution.md`, `docs/PADROES-DE-CODIGO.md`, `docs/SEGURANCA.md`,
    `docs/DADOS-PESSOAIS.md`, `docs/EQUIPE-DE-AGENTES.md`, `docs/PLANO-DE-DESENVOLVIMENTO.md` e
    `docs/ADR-*`;
  - as specs `equipe-de-agentes`, `camada-de-dados`, `fundacao-e-ci` e `publicacao-do-site`.
- **Lista de tela:**
  - `src/app/(site)/`, fora os `route.ts`, `src/componentes/`, `src/features/`, `src/estilos/` e
    `src/lib/utils/`;
  - `public/`, `assets/` e `tests/e2e/`;
  - `README.md`, `docs/conteudo-institucional.md` e `docs/REFERENCIA-VISUAL.md`;
  - `openspec/changes/<change>/` e o caminho dela em `openspec/changes/archive/`;
  - as specs de `openspec/specs/` que não estão no gatilho.

  `conteudo-institucional.md` e `REFERENCIA-VISUAL.md` ficam na lista de tela porque são a fonte
  da tela. O texto que vai ao ar está coberto por AS-04, que é do conjunto reduzido. Na conferência
  curta eles continuam governando: a ordem acima decide antes.
- **Quem aplica:** o líder técnico manda a lista e a classificação ao guardião, com o passo que
  decidiu. O guardião confere a classificação pela própria lista e, se discordar, aplica o checklist
  inteiro e diz por quê.
- **Entrada em vigor:** a partir da primeira change aprovada no Portão 1 depois do merge desta.
  Esta change usa o checklist inteiro, porque toca `.claude/`, `.gitignore`, `scripts/` e
  `next.config.ts`.
- **Onde fica escrito:** na §5, que é a fonte única. A §2 da `EQUIPE-DE-AGENTES.md` e o item 2 da
  dieta no `CLAUDE.md` remetem a ela, sem "só vale depois de escrito". O `guardiao-appsec.md` ganha
  uma linha ao lado da conferência curta: "Conferência proporcional: pelas listas e pela ordem da §5,
  e só lá."

### D9 — O texto novo da §5 (B-01, I-01, I-02, I-03, Q6, LB-26)

- **Precondição (Q6 (a), LB-05, LB-06).** O parágrafo "Antes de **qualquer** forma, o líder técnico
  confere que não existe no disco…" passa a dizer:
  - antes de cada leva de formas, o líder técnico roda
    `node scripts/conferir-ambiente-local.mjs --change <change>`, e só segue com código 0;
  - o `.claude/settings.json` vale igual ao da `main` ou igual ao registrado como decidido na change
    em curso;
  - `.claude/settings.local.json` e `.mcp.json`, que não existem na `main`, param a conferência;
  - a conferência lê `.git/config`, `.git/hooks/` e `.git/info/` antes de rodar o Git.

  A precondição do `.npmrc` não muda.
- **B-01.** Antes da segunda forma com o segredo, o líder técnico registra `git rev-parse main` e o
  sha de `git ls-remote origin refs/heads/main`. A busca commit a commit em `git rev-list
  main..HEAD` só roda se os dois forem iguais, e então cobre todo commit que o push da branch
  publica. Se forem diferentes, o líder técnico para e pede ao Gabriel o `git fetch` e a atualização
  da `main` local (Q2 (b)).
- **I-01.** A frase "nenhum código lê o ambiente de forma dinâmica hoje" sai. No lugar:
  - **leitura dinâmica** é ler `process.env` com nome que vem de variável ou de argumento, percorrer
    o ambiente, ou repassá-lo inteiro;
  - hoje, `ambiente.ts` (`exigir`, restrito à lista pelo D7), `purgar-dado-pessoal.mjs:36`,
    `verificar-chave-de-servico.mjs:45` e `verificar-tipos-do-banco.mjs:56` leem por nome em
    constante;
  - `iniciar-servidor.mjs:39` repassa o ambiente inteiro ao `next start`, sem imprimir;
  - o líder técnico confere as linhas no momento de escrever, porque o D7 mexe no `ambiente.ts`.
  O "limite conhecido" sobre o `ambiente.ts` carregar o `.env` inteiro sai, porque deixa de ser
  verdade.
- **I-02.** "Antes da primeira execução das quatro formas, o líder técnico confere `curl --version`:
  o `-H @-` existe desde a 7.55. Versão anterior: não roda, e o item fica não verificado." A
  restrição de rota a `/` e `/processo-seletivo` era daquela change, e o `<rota>` da §5 já é a regra
  geral. O D11 arquivado não se edita.
- **I-03.** No parágrafo do `<endereço>`, "O pedido escolhe só o caminho" passa a "O pedido escolhe
  só a rota, no padrão da lacuna `<rota>`". As duas conferências continuam iguais.
- **LB-26.** No "Limite conhecido" do arquivo binário, uma frase nova: o
  `prototipo/Portal-LIACUP.html` é texto, mas guarda um manifesto em base64 com conteúdo comprimido
  (linha 220, conferida pelo líder técnico ao escrever). Esse conteúdo fica **coberto só pela
  origem declarada**, o protótipo aprovado pela liga (`REFERENCIA-VISUAL.md`).

### D10 — README, padrões e `CLAUDE.md` (LB-14, LB-15, LB-24, LB-25)

- **LB-15:** o README instala `npm install -g @fission-ai/openspec@2.1.0`, e diz que a troca de
  versão é uma change, com a versão de antes e a de depois e a saída de `openspec --version`.
- **LB-25:** a linha 3 da hierarquia do README fica igual à da constitution, com o
  `docs/SEGURANCA.md`.
- **LB-24 (Q7 (a)):** no README ("Se o portal quebrar em produção") e na `PADROES-DE-CODIGO.md` §8
  ("Correção urgente"), uma frase: "O `revisor` e o `guardiao-appsec` passam pela correção antes
  do merge, como em toda change." A frase remete ao ADR-0005 §2.4, que é anterior ao guardião e
  não se edita.
- **LB-14 (Q5 (a)):** nenhum arquivo muda. A saída na §6 cita esta proposta.
- **README, passo manual novo** ("A barreira do Git"):
  - o que a barreira recusa e o que deixa passar;
  - que ela não vale no terminal do Gabriel;
  - que o gancho só vale depois de a sessão ser reaberta (no terminal, também pelo menu `/hooks`; no app de desktop o menu não existe), sempre
    que o `.claude/settings.json` mudar;
  - o comando da conferência do ambiente;
  - o limite do D1.
- **`CLAUDE.md`:**
  - a seção "Escopo de escrita é instrução, não trava" passa a dizer que a escrita no Git por
    comando é trava (D1), que pasta continua sendo instrução, e que a obrigação do líder técnico
    depois de cada subagente inclui a conferência do ambiente;
  - a regra 1 do Git ganha a barreira;
  - o item 2 da dieta remete à §5.

### D11 — Nenhuma tela muda

- O `qa-acessibilidade` roda `npx playwright test` inteiro.
- O `qa-acessibilidade` compara a raiz não publicada com
  `openspec/changes/archive/2026-11-21-pagina-processo-seletivo/prints/raiz-nao-publicada-{390,1280}.png`,
  pelo método daquela change:
  - `npm run build` e `node scripts/iniciar-servidor.mjs nao-publicado 3001`;
  - Chromium do Playwright, escala 1, 390 × 844 e 1280 × 800, página inteira, 3 s de espera depois
    das fontes;
  - comparação pixel a pixel por script temporário no diretório temporário, fora do repositório.
- Resultado esperado: **0 de 329.160** e **0 de 1.024.000** pixels diferentes.
- `git diff --exit-code main -- src tests/e2e public playwright.config.ts` com código 0.
- Nenhum print novo é versionado, então a §7 não muda por causa desta comparação.

### D12 — A saída dos riscos da §6

- Depois da última passagem do guardião sem BLOQUEADO, e antes do archive, o líder técnico tira as
  sete linhas da tabela.
- A §6 ganha a subseção "Saíram da lista", com uma linha por risco: código, achado, data da saída,
  a change e onde está a evidência (a seção do `relatorio.md` e a tarefa).
- LB-14 sai por decisão (Q5 (a)), e os outros seis, por correção auditada.
- Se um deles não for conferido pelo guardião, ele fica na tabela, e o motivo vai para a entrega.

### D13 — Escopo nominal

| Quem | Arquivos |
| --- | --- |
| `dev-frontend` | `.claude/settings.json`; `.claude/ganchos/barrar-git-de-escrita.mjs`; `scripts/conferir-ambiente-local.mjs`; `tests/barreiras/` (os três testes); `tests/politicas/ambiente.ts`; `next.config.ts`; `.gitignore`. Os arquivos de demonstração (`.claude/DEMO-RP12.txt` e o `agentRules: true`) são criados e desfeitos na mesma tarefa |
| `qa-acessibilidade` | Nenhum arquivo versionado. A demonstração do D3 e a comparação do D11 usam scripts no diretório temporário |
| Líder técnico | `docs/SEGURANCA.md` (§4 AS-17, §5, §6 e o limite do binário); `docs/EQUIPE-DE-AGENTES.md` §2; `docs/PADROES-DE-CODIGO.md` §8; `README.md`; `CLAUDE.md`; `.claude/agents/guardiao-appsec.md` (uma linha); `openspec/changes/endurecer-agentes-e-git-local/ambiente-decidido.txt` |
| Gabriel | Reabrir a sessão para carregar o gancho; o `.claude/settings.local.json` do passo 3 do D3, criado e apagado por ele; depois do merge, a linha do exclude (D14) |
| `especificador` | `openspec/changes/endurecer-agentes-e-git-local/` |

Não mudam: `src/`, `tests/e2e/`, `playwright.config.ts`, `vitest.config.mts`,
`vitest.banco.config.mts`, `package.json`, `package-lock.json`, `.github/`, `.claude/skills/`, os
outros seis arquivos de `.claude/agents/`, `docs/ADR-0005-modelo-de-branches.md` e todo artefato
arquivado. Arquivo fora destas listas é desvio, e vai nomeado na entrega.

### D14 — Entrega ao Gabriel, depois do merge

Comandos para a seção 6 da entrega, em bash, na `main` atualizada:

```bash
sed -i -E '/^AGENTS\.md[[:space:]]*$/d' .git/info/exclude
grep -c -v -e '^#' -e '^[[:space:]]*$' .git/info/exclude   # esperado: 0 (código 1)
node scripts/conferir-ambiente-local.mjs                    # esperado: código 0, sem --change
timeout 60 npm run dev                                      # derruba sozinho em 60 s
test -e AGENTS.md; echo "AGENTS.md existe? código $?"       # esperado: código 1
git status --porcelain                                      # esperado: vazio
```

O `[[:space:]]*` pega o `\r` de um exclude salvo no Windows. A saída volta ao líder técnico e fecha
o critério "sem a linha do exclude". No terminal do Gabriel não há agente na sessão, e o Next não
escreveria o arquivo de qualquer jeito. A prova de que o `next dev` com agente não o recria é a da
tarefa 3.1, feita a partir da sessão do agente.

## Risks / Trade-offs

| Risco | Mitigação |
| --- | --- |
| O gancho só vale depois de recarregado, e a dieta pede uma sessão por change | A tarefa 1.4 começa pelo Gabriel reabrindo a sessão (retomando a mesma conversa), porque no app de desktop o menu `/hooks` não existe. A demonstração prova que o gancho está ativo. O passo está no README |
| O gancho falha aberto se o `node` não abrir | Camada 2 (D1), e a conferência acusa ganchos desligados |
| Agente com terminal escreve no Git por um programa próprio | Limite declarado (D1). `git diff --cached --name-only`, `git status --porcelain` e a conferência do D4 depois de cada passagem |
| Falso positivo do gancho (Q8) recusa uma forma da §5 com texto como `git push` | A recusa vai para o relatório, e o líder técnico usa a ferramenta de leitura |
| A lista de chaves do `.git/config` para numa chave inofensiva no meio do apply | O dev não acrescenta chave por conta própria. O líder técnico leva a chave ao Gabriel como decisão, e ela entra na lista por decisão escrita |
| O registro de diferenças decididas é editável por agente | Está no diff que o `revisor` e o guardião leem, cada linha cita a decisão, e o líder técnico confere na conferência de escopo |
| O Next não detecta o agente na sessão do subagente, e o vermelho do D5 não aparece | Caminho alternativo do D5, declarado no relatório |
| Mexer no `.gitignore` restringe as formas do guardião nesta change | É a regra da §5, e ela vale. O que não for verificável fica não verificado, com o motivo |
| As linhas citadas no I-01 mudam com o D7 | O líder técnico confere ao escrever (D9) |
| 14 tarefas, com uma de folga | Se passar de 15, os itens 4 e 5 da proposta saem inteiros para a `ajustar-ci-ao-novo-fluxo`: as tarefas 4.1 e 5.1 |

## Migration Plan

1. Merge pelo Gabriel. O `.claude/settings.json` chega à `main`, e a conferência passa a compará-lo
   com ela.
2. Os comandos do D14, pelo Gabriel.
3. Se for preciso voltar atrás: reverter o commit da change. Os ganchos somem com o arquivo, e o
   exclude pode voltar a ter a linha `AGENTS.md`.

## Open Questions

Nenhuma que possa esperar. As onze decisões pendentes estão na proposta, Q1 a Q11, com opções,
custo e recomendação. Este design segue as recomendações. Opção diferente muda o D1 (Q1 e Q9), o
D2 (Q3 e Q8), o D4 (Q6 e Q10), o D5 (Q4), o D8 (Q11) ou o D9 (Q2).
