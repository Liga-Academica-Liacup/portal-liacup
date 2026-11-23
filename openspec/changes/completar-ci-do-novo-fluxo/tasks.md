# Tarefas — completar o CI do novo fluxo

São 14 tarefas, com uma de folga. Elas seguem as recomendações da proposta: Q1 (c), Q2 (b), Q3
(a), Q4 (b), Q5 (a), Q6 (a), Q7 (b), Q8 (a) e Q9 (a). Se o Gabriel decidir diferente no Portão 1,
o especificador ajusta antes do apply.

Os comandos estão em sintaxe de bash (Git Bash). Os escopos nominais estão no `design.md`, D11.
Antes de qualquer `npm`, `test -e .npmrc` dá 1 e `npm config get registry` devolve
`https://registry.npmjs.org/`. Depois de **cada** passagem de subagente, o líder técnico roda
`git status --porcelain`, `git diff --cached --name-only` e
`node scripts/conferir-ambiente-local.mjs --change completar-ci-do-novo-fluxo`.

## 1. A saída do LB-02 e o tempo do CI

- [ ] 1.1 **Líder técnico:** a evidência do LB-02 e o tempo do CI (D9), no `relatorio.md`, numa
      seção própria. Verificar:
      - **a execução `45099474006`:** evento, ramo, sha `d7cc5c9`, conclusão e
        `run_attempt: 2`, com os dois jobs de cada tentativa e os horários. Também as 2
        implantações do `segredos-da-main`, a regra única `{name: "main", type: "branch"}` e o
        `401` de `GET /actions/secrets`, cada um com a consulta da API pública que o deu;
      - **a lista de execuções de push da `main`** desde o merge do PR #23, lida pela API pública,
        com 0 execuções com conclusão `failure`;
      - **as palavras do Gabriel**, literais: a frase de 22/11/2026 (com "Organization vazia", que
        fecha o ACI-A5) e a resposta da Q4;
      - **a tabela do D9**, com os 4 números, os ids das execuções e a frase "uma execução de cada
        evento, não mediana".

## 2. O resíduo A1 e os segredos

- [ ] 2.1 **dev:** o `ci.yml` do D1 e do D2, com a ação de baixar anexo do D4.
      - **Dado de entrada**, lido pelo líder técnico antes da passagem: o sha das 4 ações por
        `git ls-remote --tags https://github.com/actions/<nome>`, sem restringir a ref. A tabela vai
        para o relatório: ação · tag · sha · tem linha `^{}`? · endereço · faixa do aviso
        conferida. Isso fecha o ACI-A4.

      Verificar:
      - `npm run verificar:acoes` dá 0, com `fora da regra: 0` e `referências` igual a
        `grep -c 'uses:' .github/workflows/ci.yml`;
      - `grep -n 'secrets\.' .github/workflows/ci.yml` mostra 2 linhas, uma no job dos tipos e uma
        no da chave. `grep -c 'environment:'` dá 2, com nomes diferentes;
      - o relatório traz, para cada job com segredo, os passos anteriores ao segredo, e todos são
        das 4 formas do D2. O job da chave não tem `npm ci`, e o passo dele roda
        `node scripts/verificar-chave-de-servico.mjs`;
      - `npm run build` aparece só no `Verificacoes` e no job do build. `grep -c
        'continue-on-error'` dá 0, `grep -c 'permissions:'` dá 1, e `grep -c
        'persist-credentials: false'` é igual a `grep -c 'actions/checkout@'`;
      - `npm run verificar` dá 0.
- [ ] 2.2 **Líder técnico:** o README do CI e os passos do Gabriel (D1, D8, Migration Plan).
      Verificar:
      - `grep -c 'chave-de-servico-da-main' README.md .github/workflows/ci.yml` dá pelo menos 1 em
        cada, e `grep -c 'Conferencias com segredo' README.md .github/workflows/ci.yml` dá 0 nos
        dois;
      - o passo 5 da "Configuração inicial" diz que cada ambiente tem um segredo e que nenhum fica
        no nível do repositório nem no da organização (ACI-A5);
      - a entrega do Portão 2 traz os passos 2 e 5 do Migration Plan, na ordem, com o passo 2 antes
        do merge.

## 3. O OpenSpec no portão

- [ ] 3.1 **dev:** `@fission-ai/openspec@2.1.0` como `devDependency` exata (D3, Q3 (a)). Verificar,
      com cada número no relatório:
      - `npm ls --depth=0` lista `@fission-ai/openspec@2.1.0`, e as dependências diretas são 23;
      - `grep -c '"hasInstallScript": true' package-lock.json` dá 3 antes e depois. Se subir, o dev
        para e o líder técnico leva ao Gabriel;
      - o número de pacotes que a instalação acrescentou;
      - o `npm audit --audit-level=high` antes e depois, com a contagem por severidade, e nenhum
        aviso alto ou crítico novo vindo do OpenSpec ou das dependências dele;
      - `openspec --version` e `npx openspec --version` dão `2.1.0` os dois;
      - a telemetria conferida, com a fonte, e desligada pela opção documentada se existir.
- [ ] 3.2 **dev:** o `verificar:specs`, encadeado no `verificar`, e o passo no `Verificacoes`
      (D3). Verificar:
      - `npm run verificar:specs` dá 0, com a linha `Totals: N passed, 0 failed`;
      - **RP-12:** com uma change descartável plantada em `openspec/changes/`, tendo um requisito
        sem cenário, o código é diferente de 0 e a saída nomeia o item. Apagada a change, dá 0 com
        o mesmo `Totals` de antes. As duas saídas vão literais para o relatório, e o
        `git status --porcelain` fica igual ao de antes;
      - `grep -c 'verificar:specs' .github/workflows/ci.yml package.json` dá pelo menos 1 em cada,
        e `npm run verificar` dá 0.

## 4. Os prints das páginas

- [ ] 4.1 **dev:** a rotina dos prints, o passo e o anexo no `Verificacoes` (D5). Verificar:
      - depois de `npm run build`, `npm run prints:site` dá 0, com
        `páginas: 4 · larguras: 2 · prints: 8`, e `ls test-results/prints-do-site | wc -l` dá 8;
      - **RP-12:** com uma página que não existe acrescentada à lista única, dá 1 e nomeia a
        página. Restaurada a lista, dá 0, e o `sha256sum` de `src/lib/utils/paginas-publicas.json`
        é igual ao de antes. As duas saídas vão literais para o relatório;
      - `npm run verificar:artefatos` dá 0, e `git status --porcelain` não mostra nada de
        `test-results/`;
      - no `ci.yml`, o passo vem depois do e2e e antes do Lighthouse, e o envio tem
        `if-no-files-found: error` e `retention-days: 7`. `npm run verificar:acoes` dá 0;
      - **no Portão 2:** a API pública de anexos da execução do PR lista `prints-do-site`, e o log
        do passo mostra `prints: 8`.

## 5. As ressalvas que pedem código

- [ ] 5.1 **dev:** as ações presas passam a ver a forma compacta e a ação local em qualquer pasta
      (D4, ACI-A2). Verificar:
      - `npm test` dá 0. `casos da verificação das ações presas` passa de 13, com casos para a
        lista e o mapa numa linha só e para a ação local fora de `.github/actions/`, cada um presa
        por etiqueta (vermelho) e por commit (verde);
      - **RP-12 no `ci.yml`:** uma linha trocada para a forma compacta, presa por etiqueta, dá 1 e
        nomeia `ci.yml:<linha>`. Desfeita a troca, dá 0, com o `sha256sum` igual ao de antes.
- [ ] 5.2 **dev:** a busca de segredo com UTF-16, o nome do arquivo e a mensagem nova (D6, Q6 (a),
      ACI-A3 e o 1 e o 2 da rodada 3 da `ajustar-ci`). Verificar:
      - `npm test` dá 0, e `casos da busca de segredo` passa de 36. Os casos novos são UTF-16LE
        com e sem marca, UTF-16BE com marca, a chave no nome e o texto da mensagem;
      - `grep -c 'se ele já entrou num commit' scripts/buscar-segredo-antes-do-envio/funcoes.mjs`
        dá 0;
      - **RP-12 na máquina:** com um arquivo não rastreado em UTF-16LE, sem marca, com a chave
        falsa montada por `node -e` com o prefixo partido, dá 1 com o valor mascarado. Apagado o
        arquivo, dá 0 com os mesmos contadores de antes.
- [ ] 5.3 **dev e líder técnico:** a conferência do ambiente compara os próprios dois arquivos (D7,
      Q7 (b), E-A3). Verificar:
      - `npm test` dá 0, com o caso novo;
      - o líder técnico registra o sha256 dos dois arquivos no `ambiente-decidido.txt`, citando a
        proposta. `node scripts/conferir-ambiente-local.mjs --change completar-ci-do-novo-fluxo`
        dá 0, com `aceitos por decisão: 2`;
      - **RP-12:** com uma linha a mais num dos dois arquivos, depois do registro, dá 1 e nomeia o
        arquivo. Desfeita a mudança, dá 0. As duas saídas vão literais para o relatório.

## 6. Os textos

- [ ] 6.1 **Líder técnico:** a §6 e o cabeçalho do `SEGURANCA.md` (D8). As duas saídas valem só
      com o veredito do guardião da 7.3. Verificar:
      - `sed -n '/^## 6\./,/^### Saíram da lista/p' docs/SEGURANCA.md | grep -cE
        '^\| (LB-02|A1 da) '` dá 0;
      - `sed -n '/^### Saíram da lista/,/^## 7\./p' docs/SEGURANCA.md | grep -cE
        '^\| (LB-02|A1 da) .*completar-ci-do-novo-fluxo'` dá 2, e as duas linhas têm data, change e
        evidência;
      - `grep -c 'I3 do guardião' docs/SEGURANCA.md` dá pelo menos 1, na linha da Q12 (b), que
        continua com o prazo `R2` e a change `papeis-da-diretoria-no-banco`;
      - `grep -c '^\*\*Versão 3.2' docs/SEGURANCA.md` dá 1, e o cabeçalho cita o que a 3.1 não
        citava (I2).
- [ ] 6.2 **Líder técnico:** numa tarefa só, todas as ressalvas que são só texto (D8, as linhas
      "tarefa 6.2" da tabela). Verificar:
      - o relatório traz, para cada uma dessas linhas, o `grep` que acha o texto novo e a contagem.
        Entre eles: `grep -c 'antes das quatro formas' docs/SEGURANCA.md` dá 0 (E-A7);
        `grep -c 'contra engano' docs/EQUIPE-DE-AGENTES.md` dá pelo menos 1 (E-R3.5);
        `grep -cE 'As (seis|sete)' README.md` dá 0 (a contagem do `verificar`); e
        `grep -c 'Desde a .completar-ci-do-novo-fluxo.' docs/SEGURANCA.md` dá 1 (§3);
      - a linha 6 da R1 no plano diz o que a change entregou;
      - `npm run formatar:check` dá 0.

## 7. Conferência final

- [ ] 7.1 **qa:** `npx playwright test` inteiro e a comparação da raiz não publicada (D10).
      Verificar:
      - `npx playwright test` dá 0, com o número de testes no relatório;
      - 0 pixels diferentes em 390 e em 1280 px, com o total de cada largura, contra os
        `raiz-nao-publicada-*` da `pagina-sobre-e-equipe` arquivada;
      - `git diff --exit-code main -- src public tests/e2e playwright.config.ts` dá 0.
- [ ] 7.2 **Líder técnico:** as verificações do briefing e a tabela das ressalvas. Verificar, com o
      código e os contadores no relatório:
      - `npm run verificar`, `npm test` e `openspec validate --all --strict` dão 0;
      - 23 dependências diretas, e a mudança do `package-lock.json` explicada pela 3.1;
      - `git diff --exit-code main -- .claude CLAUDE.md openspec/config.yaml src` dá 0;
      - `git status --porcelain` só mostra arquivos do D11;
      - a tabela das ressalvas tem 42 linhas, e cada destino está cumprido ou decidido no Portão 1;
      - `node scripts/buscar-segredo-antes-do-envio.mjs` dá 0.
- [ ] 7.3 **`revisor` e `guardiao-appsec`.** O guardião aplica o checklist inteiro, porque o diff
      toca `.github/`, `scripts/`, `package.json`, `package-lock.json` e `docs/SEGURANCA.md`.
      Verificar:
      - o veredito de cada um no relatório, e nenhum BLOQUEADO aberto;
      - o guardião confirma o A1 pela leitura do `ci.yml` (tabela do D2) e a evidência do LB-02 da
        1.1. Se não confirmar, as duas linhas voltam à §6 antes do archive;
      - o `git status` fica igual antes e depois das duas passagens.

## Workflow follow-up

- `openspec validate completar-ci-do-novo-fluxo --strict` dá 0.
- `openspec archive completar-ci-do-novo-fluxo` antes do PR. Depois, `openspec validate --all
  --strict` dá 0: na `fundacao-e-ci`, 4 requisitos modificados e 4 novos; na `equipe-de-agentes`,
  2 modificados. O caminho do arquivo nas duas linhas de "Saíram da lista" fica igual ao da pasta
  criada.
- A entrega do Portão 2 segue o modelo do `CLAUDE.md`. Na seção 6 vêm a conferência do ambiente e
  `node scripts/buscar-segredo-antes-do-envio.mjs`, e só então `git add`, `git commit -F` e
  `git push`. Antes do merge, o Gabriel faz o passo 2 do Migration Plan.
- No PR, conferido pelo Gabriel e pelo líder técnico: `Verificacoes` verde, o anexo dos prints, os
  três jobs do push pulados, e o tempo do PR (D9).
- Depois do merge (Q9 (a)), registrado na primeira tarefa da change seguinte, a `pagina-projetos`:
  - os quatro jobs verdes no push;
  - a chave apagada do `segredos-da-main`, e o "Re-run all jobs" verde;
  - a confirmação escrita do Gabriel: um segredo por ambiente, regra só `main` nos dois, nenhum no
    repositório nem na organização;
  - o tamanho do anexo do build e o tempo do push.

  Se o push ficar vermelho, a correção é imediata, antes de qualquer outra change.
