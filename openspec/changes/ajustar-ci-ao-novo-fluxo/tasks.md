# Tarefas — ajustar o CI ao novo fluxo

São 11 tarefas, com quatro de folga. Elas seguem as recomendações das Qn da proposta. Se o Gabriel
escolher outra opção, mudam estas tarefas:

- Q1: a 1.3 e a 1.4;
- Q2 (a): entram 2 tarefas no grupo 1, e a conta vai a 13;
- Q3: a 2.1;
- Q4 (a): entra a auditoria de base antes da 4.3;
- Q5: a 4.3;
- Q6 (b): a 1.1.

Os comandos estão em sintaxe de bash (Git Bash). Os escopos nominais estão no `design.md`, D11.
Depois de **cada** passagem de subagente, o líder técnico roda `git status --porcelain`,
`git diff --cached --name-only` e `node scripts/conferir-ambiente-local.mjs --change
ajustar-ci-ao-novo-fluxo`.

## 1. O CI: permissões, ações presas e o segredo

- [ ] 1.1 **dev:** LB-08 e LB-17 no `ci.yml` (D2, D3, Q6 (a)). Isso inclui `permissions: contents:
      read` no topo, `persist-credentials: false` em todo checkout e as três ações presas pelo sha
      do commit do último patch da `v4`, com `# v4.x.y` na linha. Verificar:
      - `grep -c '^permissions:' .github/workflows/ci.yml` dá 1, e `grep -c 'permissions:'` também
        dá 1, ou seja, nenhum job amplia;
      - `grep -c 'persist-credentials: false'` é igual a `grep -c 'actions/checkout@'`;
      - `grep -cE 'uses: [^#]+@v[0-9]' .github/workflows/ci.yml` dá 0, com código 1;
      - o relatório traz a tabela ação · tag · sha · endereço consultado, com 3 linhas.
- [ ] 1.2 **dev:** a verificação das ações presas (D4): o script, o teste em `tests/barreiras/`, o
      `verificar:acoes` encadeado no `verificar` e o passo no job `Verificacoes`. Verificar:
      - `npm test` com código 0, com o número de casos da verificação na saída;
      - `npm run verificar:acoes` com código 0 e a linha `arquivos: 1 · referências: R · presas por
        commit: R · locais: 0 · fora da regra: 0`;
      - RP-12: com uma linha do `ci.yml` trocada para `@v4`, dá código 1 e nomeia
        `ci.yml:<linha>`. Desfeita a troca, dá 0, e o `sha256sum` do `ci.yml` é igual ao de antes.
        As duas saídas vão literais para o relatório;
      - `git diff main -- package.json` mostra só linhas dentro de `scripts`.
- [ ] 1.3 **dev:** o LB-02 (D1, Q1 (a)): o `Verificacoes` sem segredo, o job `Conferencias com
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
      - `npm run verificar` com código 0.
- [ ] 1.4 **Líder técnico e Gabriel:** o README (D8) e o passo manual (D1). O líder técnico escreve
      no README a seção do CI e o passo na "Configuração inicial". Antes de abrir o PR, o Gabriel
      cria o ambiente `segredos-da-main` com a regra de branch só `main`, põe nele
      `SUPABASE_ACCESS_TOKEN` e `SUPABASE_SERVICE_ROLE_KEY`, e apaga os dois do nível do
      repositório. Verificar:
      - a resposta do Gabriel, transcrita literal no relatório, diz: o ambiente com a regra
        `main`, 2 segredos no ambiente e 0 segredos no repositório;
      - `grep -c 'segredos-da-main' README.md .github/workflows/ci.yml` dá pelo menos 1 em cada;
      - `grep -c 'O CI e um job so' README.md` dá 0.

## 2. A busca de segredo antes do envio

- [ ] 2.1 **dev:** o script, as funções e o teste (D5, D6, Q3 (b)), com os 6 formatos da proposta.
      Verificar:
      - `npm test` com código 0, com o número de casos da busca na saída. Os casos cobrem cada
        formato achando; o prefixo solto e o texto da expressão sem achar; o commit intermediário;
        o binário não comprimido; e a falta de `origin/main` com código 2;
      - nenhuma chave falsa escrita inteira nos arquivos novos. A busca da 2.2, passo 1, sobre a
        árvore, dá 0 achados com esses arquivos entre os lidos.
- [ ] 2.2 **qa:** o RP-12 na máquina (D6), com os três passos, sem nenhum commit. Verificar:
      - passo 1: `node scripts/buscar-segredo-antes-do-envio.mjs` dá 0, com os contadores. Os
        arquivos lidos incluem `proposal.md`, `design.md` e o `relatorio.md` desta change, que
        citam as expressões;
      - passo 2: com o arquivo da chave falsa, dá 1, com `arquivo:linha` e
        `[MASCARADO · <n> caracteres · …]`, e nenhum trecho do valor na saída;
      - passo 3: sem o arquivo, dá 0, com os mesmos contadores do passo 1;
      - as três saídas literais, com o código de saída, no relatório. No fim, `git status
        --porcelain` é igual ao de antes do passo 1.
- [ ] 2.3 **Líder técnico:** os textos do segundo comando (D7) e o registro no
      `ambiente-decidido.txt`. Verificar:
      - `grep -c 'buscar-segredo-antes-do-envio' CLAUDE.md docs/EQUIPE-DE-AGENTES.md
        docs/SEGURANCA.md README.md` dá pelo menos 1 em cada;
      - `node scripts/conferir-ambiente-local.mjs --change ajustar-ci-ao-novo-fluxo` com código 0
        e `aceitos por decisão: 1`, que é a linha do `CLAUDE.md`.

## 3. Os textos de segurança e o plano

- [ ] 3.1 **Líder técnico:** a §3, a §5 e a §6 do `SEGURANCA.md` e a R1 do plano (D8, Q2 (b),
      Q4 (b)). Verificar:
      - `` grep -cF 'a `ajustar-ci-ao-novo-fluxo` na R0' docs/SEGURANCA.md `` dá 0;
      - `grep -cE '^\| LB-09 .*papeis-da-diretoria-no-banco' docs/SEGURANCA.md` dá 1;
      - `grep -c 'completar-ci-do-novo-fluxo' docs/PLANO-DE-DESENVOLVIMENTO.md` dá pelo menos 1;
      - `grep -c 'buscar-segredo-antes-do-envio' docs/SEGURANCA.md` dá pelo menos 2: o da 2.3 e o
        da §3.

## 4. Conferência final

- [ ] 4.1 **qa:** `npx playwright test` inteiro e a comparação da raiz não publicada (D10).
      Verificar:
      - `npx playwright test` com código 0, com o número de testes no relatório;
      - 0 pixels diferentes em 390 e em 1280 px, com o total de cada um, contra os
        `raiz-nao-publicada-*` da `pagina-sobre-e-equipe` arquivada;
      - `git diff --exit-code main -- src tests/e2e public playwright.config.ts` com código 0.
- [ ] 4.2 **Líder técnico:** as verificações do briefing. Verificar, com o código e os contadores
      de cada uma no relatório:
      - `npm run verificar`, `npm test` e `openspec validate --all --strict` com código 0;
      - 22 dependências diretas;
      - `git diff --exit-code main -- package-lock.json .claude src` com código 0;
      - o tempo "antes" no relatório, com a fonte (proposta, critério 6);
      - `git status --porcelain` só com arquivos do D11.
- [ ] 4.3 **`revisor` e `guardiao-appsec`**, o guardião com o checklist inteiro, porque o diff toca
      a lista do gatilho (`.github/`, `scripts/`, `package.json`, `CLAUDE.md`). Depois, o líder
      técnico passa LB-02, LB-08 e LB-17 para "Saíram da lista" (Q5 (a)). Verificar:
      - o veredito de cada um no relatório, e nenhum BLOQUEADO aberto;
      - `git status` igual antes e depois das duas passagens;
      - `sed -n '/^## 6\./,/^### Saíram da lista/p' docs/SEGURANCA.md | grep -cE
        '^\| LB-(02|08|17) '` dá 0, e "Saíram da lista" ganha 3 linhas, cada uma com a data, a
        change e a evidência.

## Workflow follow-up

- `openspec validate ajustar-ci-ao-novo-fluxo --strict` com código 0.
- `openspec archive ajustar-ci-ao-novo-fluxo` antes do PR. Depois, `openspec validate --all
  --strict` com código 0: na `fundacao-e-ci`, 1 requisito modificado e 5 novos; na
  `equipe-de-agentes`, 1 novo.
- A entrega do Portão 2 no modelo do `CLAUDE.md`. Na seção 6, a conferência do ambiente, depois
  `node scripts/buscar-segredo-antes-do-envio.mjs`, e só então `git add`, `git commit -F` e `git
  push`.
- No PR, pelo Gabriel e pelo líder técnico: `Verificacoes` verde, `Conferencias com segredo`
  pulado, e o tempo do PR (D9), na entrega do Portão 2.
- Depois do merge: a execução do push, com os dois jobs, é a primeira tarefa da
  `completar-ci-do-novo-fluxo` (Q5 (a)).
