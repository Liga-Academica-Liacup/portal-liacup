# Tarefas — atualizar o Next

12 tarefas. Comandos em sintaxe de bash (Git Bash). `<tmp>` é uma pasta fora do repositório.
Escopos (Q2 = a): `dev-frontend`, `package.json` e `package-lock.json`; `guardiao-visual`,
`openspec/changes/atualizar-next/prints/`.

## 1. Linha de base, antes de instalar

- [x] 1.1 Conferir o registro hoje (D1): `npm view next dist-tags.latest`,
      `npm view eslint-config-next@16.4.6 version` e
      `npm view next@16.4.6 optionalDependencies.sharp`. Verificar: as três saídas no relatório,
      iguais a `16.4.6`, `16.4.6` e `^0.35.5`. Qualquer outra, para e reporta
- [x] 1.2 Números de antes: cópia do `package-lock.json` em `<tmp>/lock-antes.json`;
      `npm audit --json > <tmp>/audit-antes.json`, totais por severidade lidos de
      `metadata.vulnerabilities` com `node -e`; `npm audit --audit-level=critical`;
      `npm ls next sharp eslint-config-next proxy-addr`; total de `npm test` e de
      `npx playwright test --list`. Verificar: no relatório, crítico 2, alto 21, moderado 12,
      baixo 2, info 0 (37), código 1 no `--audit-level=critical` e a saída literal do `npm ls`, com
      16.3.1, 0.35.3, 16.3.1 e 2.0.7. Número diferente do medido pelo líder, reporta antes de seguir
- [x] 1.3 **Guardião visual:** build de produção e prints da raiz sem `SITE_PUBLICADO`, em 390 e
      1280 px, em `prints/antes-raiz-390.png` e `prints/antes-raiz-1280.png` (D4). Verificar: os
      dois arquivos existem, a largura e a altura lidas dos bytes 16 a 23 de cada PNG estão no
      relatório, e o `sha256sum` de cada um também

## 2. Troca

- [x] 2.1 `npm install next@16.4.6 eslint-config-next@16.4.6 --save-exact` (D2, D3). Verificar:
      `git diff --stat package.json` com 2 linhas a mais e 2 a menos; `grep -c '"16.4.6"'
      package.json` igual a 2, sem `^`; `npm ls next eslint-config-next` com 16.4.6; `npm ls sharp`
      com 0.35.5 ou acima (critério de aceite; abaixo disso, para e volta ao Gabriel, sem forçar
      nenhuma versão); dependências diretas iguais a 22
- [x] 2.2 O `proxy-addr` (Q1 = a): copiar o `package-lock.json` para `<tmp>/lock-pos-next.json`,
      depois `npm update proxy-addr`. Verificar: `npm ls proxy-addr` com 2.0.8; `diff` com a cópia
      mostra só a entrada do `proxy-addr`; `git diff --stat package.json` igual ao da 2.1

## 3. Verificação

- [x] 3.1 `npm run verificar` e `npm test`. Verificar: os dois com código 0; os contadores de cada
      etapa do `verificar` no relatório; o total de `npm test` igual ao da 1.2
- [x] 3.2 `npm run test:e2e`, com as portas 3000 e 3001 livres antes (`netstat`). Verificar:
      código 0; `passed` igual ao total da 1.2, 0 `failed`, 0 `skipped`; uma compilação só na
      saída (`grep -c "Creating an optimized production build"` igual a 1)
- [x] 3.3 Lighthouse (RP-06): `npm run build && npm run test:desempenho`, sem `SITE_PUBLICADO` no
      ambiente e sem `.env.local`. Verificar: código 0; desempenho (90 ou mais) e acessibilidade
      (95 ou mais) da raiz, em número, no relatório
- [x] 3.4 **Guardião visual:** prints depois, com o mesmo procedimento da 1.3, e a comparação pixel
      a pixel (D4). Verificar: `pixels diferentes: 0` em 390 e em 1280, com o total de pixels de
      cada largura; o resultado do `cmp` de cada par; o comparador visto acusando uma diferença
      injetada, com código 1 e a contagem. Maior que zero, para e reporta com o lado a lado
- [x] 3.5 Números de depois: `npm audit --json > <tmp>/audit-depois.json`,
      `npm audit --audit-level=critical` e `npm ls next sharp eslint-config-next proxy-addr`; e o
      resumo do diff do `package-lock.json`, comparando com `node -e` as entradas `packages` de
      `<tmp>/lock-antes.json` e do lock atual. Verificar: `npm audit --audit-level=critical` com
      código 0; tabela antes e depois por severidade no relatório; nenhum aviso de `next` nem de
      `sharp` no JSON novo; a saída literal do `npm ls`, antes (1.2) e depois; o resumo com a
      contagem de pacotes que mudaram de versão e a lista de/para, mais os que entraram e saíram

## 4. Fechamento

- [x] 4.1 Chamar o `revisor` sobre o diff. Verificar: o relatório dele traz quantos arquivos,
      critérios de aceite e regras conferiu, e o `git status` depois da passagem não mudou
- [x] 4.2 Escopo e relatório. Apagar `prints/` antes do `openspec archive`. Verificar:
      `git status --porcelain` só com `package.json`, `package-lock.json` e
      `openspec/changes/atualizar-next/`, sem nenhum `.png`; `npm run verificar:artefatos` com
      código 0; o relatório declara, com essas palavras, que o guardião-appsec não auditou esta
      branch

## Workflow follow-up

- `openspec validate atualizar-next --strict` com código 0
- `openspec archive atualizar-next` antes do PR, porque a `main` é protegida
- Entrega ao Gabriel no modelo do `CLAUDE.md`, com os comandos Git em bash e a mensagem em arquivo
  para `git commit -F`
- Depois do merge, avisar a change `montar-guardiao-appsec` para trazer a `main` e o guardião
  auditar esta troca
