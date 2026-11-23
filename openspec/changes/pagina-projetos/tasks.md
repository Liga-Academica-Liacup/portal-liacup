# Tarefas — página Projetos

12 tarefas, três de folga. Comandos em sintaxe de bash (Git Bash). Escopos nominais no `design.md`,
D7. As tarefas seguem as recomendações das Qn (Q1 (a), Q2 (a), Q3 (a), Q4 (a), Q5 (a)); se o
Gabriel decidir outra, o especificador ajusta antes do apply.

**Antes do Portão 1, fora da conta:** o líder técnico roda
`npx openspec validate pagina-projetos --strict`.

## 1. Pendências e documentos

- [ ] 1.1 **Líder técnico:** a prova do push da `completar-ci-do-novo-fluxo` (Q9 (a) de lá), no
      `relatorio.md`, seção "Prova do push da `completar-ci-do-novo-fluxo`", pela API pública, sem
      `gh` (D9). Verificar, na seção:
      - os jobs da #44 com `http 200`, `jobs: 4` e `success: 4`, nome e duração de cada um;
      - as implantações de `chave-de-servico-da-main` e de `segredos-da-main`, cada uma só com
        `ref: main`, e o número delas;
      - os anexos da #43 e da #44 (nome, tamanho, expiração); o conteúdo do anexo do `.next` escrito
        como "não medido", com o motivo, se a API pública não o der;
      - a confirmação do Gabriel, literal, e a existência dos segredos como palavra dele;
      - a linha "PR #24: 7,2 min · contra 5,95: +1,25 min (+21 %) · contra 5,73: +1,47 min (+26 %)".
- [ ] 1.2 **Documentos, no Portão 1, com a decisão escrita do Gabriel:**
      - líder técnico, na `REFERENCIA-VISUAL.md` §7: a linha "Projetos, faixa do topo", com o
        sobretítulo "Projetos" e o título "Ensino, Extensão, Pesquisa e Secretaria" como rótulos de
        interface, sem frase (Q2 (a));
      - `especificador`, no `conteudo-institucional.md` §3 (Q3 (a)): a linha da descrição e a frase,
        logo abaixo do título "## 3." (D3).
      Verificar: `grep -c '^| Projetos, faixa do topo' docs/REFERENCIA-VISUAL.md` dá 1; `grep -c
      '^> Ensino, Extensão, Pesquisa e Secretaria: as quatro frentes de trabalho' docs/conteudo-institucional.md`
      dá 1; `git diff --numstat docs/REFERENCIA-VISUAL.md docs/conteudo-institucional.md` com 0
      linhas removidas; o aceite literal do Gabriel no `relatorio.md`.

## 2. A página

- [ ] 2.1 Os dados de `/projetos` e o teste de unidade deles (D5). Verificar: `npm test` com código
      0, e a saída imprime `frentes: 4` e os quatro nomes na ordem do §3.
- [ ] 2.2 A faixa e a grade de cartões (D1, D4). Verificar: `npm run lint` e
      `npm run verificar:tokens` com código 0; `wc -l` de cada componente novo com até 150 linhas;
      `git diff --numstat src/estilos/tokens.css` com 0 linhas removidas; no relatório, o corte de
      colunas lido do protótipo, o componente de cartão usado (D1) e os pares de cor do título e do
      parágrafo contra a superfície do cartão, nomeados e medidos (RP-09).
- [ ] 2.3 A rota `/projetos` e a entrada dela na lista, com o teste de unidade da lista (D3).
      Verificar, com `npm run build`, a 3000 publicada e a 3001 não publicada, por `curl -s`:
      - `npm test` imprime `Entradas da lista de páginas públicas conferidas: 5`;
      - na 3000, `/projetos` responde 200, com 1 `<h1>` "Ensino, Extensão, Pesquisa e Secretaria" e
        o `<title>` "Projetos · LIACUP";
      - `grep -c` no HTML de `/projetos` de "Pendente", "a ser escrita", "texto provisório",
        "Estatuto" e "eixo" dá 0 em cada um;
      - na 3001, `curl -s -o /dev/null -w '%{http_code} %{redirect_url}'` em `/projetos` dá `307`
        para `/`.

## 3. Verificações

- [ ] 3.1 **qa:** o spec de `/projetos` (D6, item 1), com o texto lido do §3, os rótulos da §7 e os
      exemplos lidos do protótipo. Verificar: `npx playwright test` verde nas 7 larguras, e a saída
      imprime quantos trechos conferiu, `frentes: 4`, os termos proibidos procurados e os achados
      (0), as colunas da grade por largura, `projetos no interruptor: 2 de 2 modos` e
      `Violacoes de acessibilidade: 0`.
- [ ] 3.2 **qa:** os ajustes (D6, itens 2 e 3). Verificar: `npx playwright test` inteiro verde nos
      dois modos, com `páginas verificadas: 5 de 5` e `rotas verificadas: 4`; `git diff --exit-code
      tests/e2e/interruptor.spec.ts playwright.config.ts` com código 0.
- [ ] 3.3 RP-12: as oito demonstrações do D6, cada uma com a saída vermelha e a verde no
      relatório. Verificar: depois delas, `git status --porcelain` igual ao de antes, `sha256sum -c`
      com OK nos arquivos tocados e `git grep -c DEMO-RP12` com código 1.

## 4. Conferência

- [ ] 4.1 **Guardião visual:** lado a lado de `/projetos` em 390 e 1280 px contra `projetos-*`, do
      menu aberto em 390 contra `menu-aberto-390.png`, do cabeçalho em 1280 e do rodapé com
      "Projetos" na coluna "Conteúdo". A faixa sem frase (Q2), os cartões sem caixa tracejada nem
      selo e o texto real no lugar do exemplo entram como decisão do briefing ou do Gabriel. Inclui
      a raiz não publicada contra os prints arquivados da `pagina-sobre-e-equipe`. Verificar: os PNG
      em `openspec/changes/pagina-projetos/prints/`; cada diferença no relatório com veredito; 0
      pixel diferente na raiz não publicada.
- [ ] 4.2 `npm run verificar` e `npm run build && npm run test:desempenho` com código 0. Verificar:
      `páginas medidas: 5` no publicado e `1` no não publicado; desempenho ≥ 90, acessibilidade ≥ 95
      e SEO ≥ 95 em `/projetos`; 23 dependências diretas; `git diff --exit-code main -- package.json
      package-lock.json src/proxy.ts lighthouserc.json playwright.config.ts .github/ scripts/
      docs/SEGURANCA.md docs/PLANO-DE-DESENVOLVIMENTO.md docs/PADROES-DE-CODIGO.md
      openspec/specs/publicacao-do-site openspec/specs/fundacao-e-ci` com código 0.
- [ ] 4.3 `revisor` sobre o diff e `guardiao-appsec` pela conferência proporcional (D7). O líder
      técnico manda ao guardião a lista do diff (`git diff --name-only main...HEAD` mais
      `git status --porcelain --untracked-files=all`), a busca
      `git diff -G 'process\.env|NEXT_PUBLIC_' --name-only main...HEAD` (e `git grep -c --untracked`
      nos não rastreados) e a classificação no **passo 3**: AS-01, AS-02, AS-04, AS-07 e AS-15.
      Verificar: nenhum arquivo da lista fora da lista de tela; a busca vazia; o veredito de cada um
      no relatório; nenhum BLOQUEADO aberto; `git status` igual antes e depois das duas passagens.
- [ ] 4.4 **Depois do push, antes do merge:** o P23 (D8) em
      `https://portal-liacup-git-feat-pagina-projetos-liacup1.vercel.app/projetos`, pelas formas da
      `SEGURANCA.md` §5. Verificar: a confirmação do Gabriel do host, letra por letra, e do commit no
      painel, registrada antes do `curl`; a resposta com `HTTP/2 200` e sem `Location`, literal e
      mascarada no relatório; as três buscas do segredo com código 1 e saída vazia.

## Workflow follow-up

- `npx openspec validate pagina-projetos --strict` com código 0.
- `npx openspec archive pagina-projetos` antes do PR. Depois, `npx openspec validate --all --strict`,
  com `pagina-projetos` criada e, em `navegacao-publica`, "A lista única decide as páginas públicas,
  onde aparecem e em que ordem" trocado por "A lista única decide as páginas públicas, a ordem delas
  e o lugar de cada uma".
- Entrega ao Gabriel no modelo do `CLAUDE.md`, com a seção "Passagem para a `lancamento-r1`" do
  `relatorio.md` citada para o gestor.
- Depois do merge, em produção: a raiz continua mostrando a página em construção, e `/projetos` leva
  307 para `/`.
