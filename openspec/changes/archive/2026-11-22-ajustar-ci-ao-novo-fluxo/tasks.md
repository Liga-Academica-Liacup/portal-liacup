# Tarefas — ajustar o CI ao novo fluxo

São 11 tarefas, com quatro de folga. Elas seguem as decisões do Gabriel no Portão 1, de
22/11/2026, transcritas literais no `relatorio.md`: Q1 (a), Q2 (b), Q3 (b) com comprimento mínimo
em todos os formatos, Q4 (b), Q5 (b) e Q6 (a).

Os comandos estão em sintaxe de bash (Git Bash). Os escopos nominais estão no `design.md`, D11.
Depois de **cada** passagem de subagente, o líder técnico roda `git status --porcelain`,
`git diff --cached --name-only` e `node scripts/conferir-ambiente-local.mjs --change
ajustar-ci-ao-novo-fluxo`.

## 1. O CI: permissões, ações presas e o segredo

- [x] 1.1 **dev:** LB-08 e LB-17 no `ci.yml` (D2, D3, Q6 (a)). Isso inclui `permissions: contents:
      read` no topo, `persist-credentials: false` em todo checkout e as três ações presas pelo sha
      do commit do último patch da `v4`, com `# v4.x.y` na linha. **Dado de entrada**, sem precisar
      de rede: os sha da tabela do D3, lidos pelo líder técnico com `git ls-remote --tags` em
      22/11/2026 (tags leves, sem `^{}`): `actions/checkout` v4.4.0
      `11d5960a326750d5838078e36cf38b85af677262`; `actions/setup-node` v4.4.0
      `49933ea5288caeca8642d1e84afbd3f7d6820020`; `actions/upload-artifact` v4.6.2
      `ea165f8d65b6e75b540449e92b4886f43607fa02`. Verificar:
      - `grep -c '^permissions:' .github/workflows/ci.yml` dá 1, e `grep -c 'permissions:'` também
        dá 1, ou seja, nenhum job amplia;
      - `grep -c 'persist-credentials: false'` é igual a `grep -c 'actions/checkout@'`;
      - `grep -cE 'uses: [^#]+@v[0-9]' .github/workflows/ci.yml` dá 0, com código 1;
      - o relatório traz a tabela ação · tag · sha · endereço consultado, com 3 linhas.
- [x] 1.2 **dev:** a verificação das ações presas (D4): o script, o teste em `tests/barreiras/`, o
      `verificar:acoes` encadeado no `verificar` e o passo no job `Verificacoes`. Verificar:
      - `npm test` com código 0, com o número de casos da verificação na saída;
      - `npm run verificar:acoes` com código 0 e a linha `arquivos: 1 · referências: R · presas por
        commit: R · locais: 0 · fora da regra: 0`;
      - RP-12: com uma linha do `ci.yml` trocada para `@v4`, dá código 1 e nomeia
        `ci.yml:<linha>`. Desfeita a troca, dá 0, e o `sha256sum` do `ci.yml` é igual ao de antes.
        As duas saídas vão literais para o relatório;
      - `git diff main -- package.json` mostra só linhas dentro de `scripts`.
- [x] 1.3 **dev:** o LB-02 (D1, Q1 (a)): o `Verificacoes` sem segredo, o job `Conferencias com
      segredo` só no push para a `main`, no ambiente `segredos-da-main`, com `npm ci
      --ignore-scripts`, e os comentários do `ci.yml` reescritos. Verificar:
      - `grep -n 'secrets\.' .github/workflows/ci.yml` mostra 2 linhas, as duas com número maior
        que o da linha de `grep -n 'Conferencias com segredo'`;
      - `grep -c -- '--ignore-scripts' .github/workflows/ci.yml` dá 1, e o job com segredo não tem
        outro `npm ci`;
      - a prova da instalação, numa pasta temporária fora do repositório, só com `package.json` e
        `package-lock.json` copiados. Antes, `test -e .npmrc` dá 1 nas duas pastas e `npm config
        get registry` devolve `https://registry.npmjs.org/`. Depois, `npm ci --ignore-scripts` e
        `npx supabase --version` dão código 0, e a saída literal vai para o relatório;
      - a prova de que o job não fica verde sem segredo (D1): o dev lê
        `scripts/verificar-tipos-do-banco.mjs` e `scripts/verificar-chave-de-servico.mjs` e roda
        cada um sem a variável do segredo, como no executor do CI: sem `.env` na pasta e sem
        credencial local da CLI do Supabase, e a barreira 3 depois de um build. O relatório traz,
        de cada um, a forma de isolar, a última linha de estado e o código de saída, que precisa
        ser diferente de 0. Se algum sair 0 sem o segredo, é defeito, e a correção entra nesta
        tarefa, com a mesma prova depois dela;
      - `npm run verificar` com código 0.
- [x] 1.4 **Líder técnico:** o README (D8) e os passos do Gabriel no GitHub (D1). O líder técnico
      escreve no README a seção do CI e, na "Configuração inicial", a configuração final: o
      ambiente `segredos-da-main` com a regra de branch só `main`, os 2 segredos nele e nenhum no
      nível do repositório. Ele prepara, para a entrega do Portão 2, os 5 passos do D1 na ordem,
      junto com os comandos Git. Verificar:
      - `grep -c 'segredos-da-main' README.md .github/workflows/ci.yml` dá pelo menos 1 em cada;
      - `grep -c 'O CI e um job so' README.md` dá 0;
      - a seção 6 da entrega do Portão 2 traz os 5 passos do D1 na ordem, com o passo 1 antes do
        merge, o passo 4 só depois do push verde, e o porquê da ordem numa frase;
      - a resposta do Gabriel sobre o ambiente e os segredos, com 2 no ambiente e 0 no
        repositório, e a conferência das execuções da `main` ficam para a primeira tarefa da
        `completar-ci-do-novo-fluxo` (Q5 (b)), e o relatório desta change diz isso.

## 2. A busca de segredo antes do envio

- [x] 2.1 **dev:** o script, as funções e o teste (D5, D6, Q3 (b)), com os 6 formatos da proposta,
      todos com comprimento mínimo e nenhum exato. O piso dos dois do GitHub, 60 e 30, vem do
      formato publicado, com margem, e não de medição. Verificar:
      - `npm test` com código 0, com o número de casos da busca na saída. Os casos cobrem cada
        formato achando; cada formato achando uma chave mais longa que o publicado, com o número
        de caracteres do trecho achado; o prefixo solto e o texto da expressão sem achar; o
        commit intermediário; o binário não comprimido; e a falta de `origin/main` com código 2;
      - nenhuma das 6 expressões no script termina em quantificador exato: cada uma termina em
        `{n,}`;
      - nenhuma chave falsa escrita inteira nos arquivos novos. A busca da 2.2, passo 1, sobre a
        árvore, dá 0 achados com esses arquivos entre os lidos.
- [x] 2.2 **qa:** o RP-12 na máquina (D6), com os três passos, sem nenhum commit. Verificar:
      - passo 1: `node scripts/buscar-segredo-antes-do-envio.mjs` dá 0, com os contadores. Os
        arquivos lidos incluem `proposal.md`, `design.md` e o `relatorio.md` desta change, que
        citam as expressões;
      - passo 2: com o arquivo da chave falsa, dá 1, com `arquivo:linha` e
        `[MASCARADO · <n> caracteres · …]`, e nenhum trecho do valor na saída;
      - passo 3: sem o arquivo, dá 0, com os mesmos contadores do passo 1;
      - as três saídas literais, com o código de saída, no relatório. No fim, `git status
        --porcelain` é igual ao de antes do passo 1.
- [x] 2.3 **Líder técnico:** os textos do segundo comando (D7) e o registro no
      `ambiente-decidido.txt`. Verificar:
      - `grep -c 'buscar-segredo-antes-do-envio' CLAUDE.md docs/EQUIPE-DE-AGENTES.md
        docs/SEGURANCA.md README.md` dá pelo menos 1 em cada;
      - `node scripts/conferir-ambiente-local.mjs --change ajustar-ci-ao-novo-fluxo` com código 0
        e `aceitos por decisão: 1`, que é a linha do `CLAUDE.md`.

## 3. Os textos de segurança e o plano

- [x] 3.1 **Líder técnico:** a §3, a §5 e a §6 do `SEGURANCA.md` e a R1 do plano (D8, Q2 (b),
      Q4 (b)). Verificar:
      - `` grep -cF 'a `ajustar-ci-ao-novo-fluxo` na R0' docs/SEGURANCA.md `` dá 0;
      - `grep -cE '^\| LB-09 .*papeis-da-diretoria-no-banco' docs/SEGURANCA.md` dá 1;
      - `grep -c 'completar-ci-do-novo-fluxo' docs/PLANO-DE-DESENVOLVIMENTO.md` dá pelo menos 1;
      - `grep -c 'buscar-segredo-antes-do-envio' docs/SEGURANCA.md` dá pelo menos 2: o da 2.3 e o
        da §3.

## 4. Conferência final

- [x] 4.1 **qa:** `npx playwright test` inteiro e a comparação da raiz não publicada (D10).
      Verificar:
      - `npx playwright test` com código 0, com o número de testes no relatório;
      - 0 pixels diferentes em 390 e em 1280 px, com o total de cada um, contra os
        `raiz-nao-publicada-*` da `pagina-sobre-e-equipe` arquivada;
      - `git diff --exit-code main -- src tests/e2e public playwright.config.ts` com código 0.
- [x] 4.2 **Líder técnico:** as verificações do briefing. Verificar, com o código e os contadores
      de cada uma no relatório:
      - `npm run verificar`, `npm test` e `openspec validate --all --strict` com código 0;
      - 22 dependências diretas;
      - `git diff --exit-code main -- package-lock.json .claude src` com código 0;
      - o tempo "antes" no relatório, com a fonte (proposta, critério 6);
      - `git status --porcelain` só com arquivos do D11.
- [x] 4.3 **`revisor` e `guardiao-appsec`**, o guardião com o checklist inteiro, porque o diff toca
      a lista do gatilho (`.github/`, `scripts/`, `package.json`, `CLAUDE.md`). Depois, o líder
      técnico passa LB-08 e LB-17 para "Saíram da lista". O LB-02 fica na §6 (Q5 (b)): a linha
      dele passa a dizer que a correção é parcial na configuração, com o resíduo A1 numa linha
      própria (Q8 (b) do Portão 2), e que ele sai só pelas três condições da primeira tarefa da
      `completar-ci-do-novo-fluxo`; a coluna "Change que resolve" aponta essa change. Verificar:
      - o veredito de cada um no relatório, e nenhum BLOQUEADO aberto;
      - `git status` igual antes e depois das duas passagens;
      - `sed -n '/^## 6\./,/^### Saíram da lista/p' docs/SEGURANCA.md | grep -cE
        '^\| LB-(08|17) '` dá 0, e "Saíram da lista" ganha 2 linhas, cada uma com a data, a
        change e a evidência;
      - `sed -n '/^## 6\./,/^### Saíram da lista/p' docs/SEGURANCA.md | grep -cE
        '^\| LB-02 .*completar-ci-do-novo-fluxo'` dá 1.

## Workflow follow-up

- `openspec validate ajustar-ci-ao-novo-fluxo --strict` com código 0.
- `openspec archive ajustar-ci-ao-novo-fluxo` antes do PR. Depois, `openspec validate --all
  --strict` com código 0: na `fundacao-e-ci`, 1 requisito modificado e 5 novos; na
  `equipe-de-agentes`, 1 novo.
- A entrega do Portão 2 no modelo do `CLAUDE.md`. Na seção 6, a conferência do ambiente, depois
  `node scripts/buscar-segredo-antes-do-envio.mjs`, e só então `git add`, `git commit -F` e `git
  push`. Em seguida, os 5 passos do Gabriel no GitHub, na ordem do D1, com o merge no passo 3.
- No PR, pelo Gabriel e pelo líder técnico: `Verificacoes` verde, `Conferencias com segredo`
  pulado, e o tempo do PR (D9), na entrega do Portão 2.
- Depois do merge, na primeira tarefa da `completar-ci-do-novo-fluxo` (Q5 (b)): a execução do push,
  com os dois jobs e o ambiente no job com segredo; a resposta do Gabriel com 2 segredos no
  ambiente e 0 no repositório e na organização; nenhuma execução da `main` vermelha entre o merge
  e a remoção; o PAT antigo revogado, depois de o Gabriel conferir que não é o do login local da
  CLI (Q10 (a) do Portão 2); o tempo do push; e só então o LB-02 sai da §6.
