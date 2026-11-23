# Tarefas — página Contato

14 tarefas, uma de folga. Comandos em sintaxe de bash (Git Bash). Escopos nominais no `design.md`,
D7. As tarefas seguem as decisões do Gabriel no Portão 1, 23/11/2026 (Q1 (a), Q2 (b), Q3 (b), Q4
(a)), literais no `relatorio.md`. A Q3 (b) não era a recomendação; specs, `design.md` e estas
tarefas foram ajustadas a ela antes do apply.

**Antes do apply, fora da conta:** o líder técnico roda de novo
`npx openspec validate pagina-contato --strict`, depois do ajuste à Q3 (b).

## 1. Pendências e documentos

- [x] 1.1 **Líder técnico:** a evidência herdada da `pagina-projetos` e a prova do push pela
      execução #46 (D9), no `relatorio.md`. Verificar, nas seções "Evidência herdada da
      `pagina-projetos`" e "Prova do push: execução #46":
      - a evidência da `pagina-projetos` literal: P23 em `/projetos` com 200, o host e o commit da
        prévia, as formas 3 e 4 do segredo, a produção com a raiz em construção e `/projetos` com
        307;
      - a forma 2 do segredo, commit a commit, em `fd31de0` e em `b2572e6`, cada uma com código 1 e
        saída vazia;
      - a #46 pela API pública, com `http 200`, `jobs: 4` e `success: 4`, e a #44 com `tentativa 1`
        (prova de que o Re-run não aconteceu);
      - a decisão do Gabriel literal, dizendo que a saída da chave do `segredos-da-main` é palavra
        dele.
- [x] 1.2 **Documentos, no Portão 1, com a decisão escrita do Gabriel, pelo líder técnico**, com o
      texto pronto do `relatorio.md`, "Texto proposto para a tarefa 1.2":
      - na `REFERENCIA-VISUAL.md` §7, a linha "Contato, página": sobretítulo "Contato", título
        "Fale com a Liga", rótulos "Instagram", "E-mail" e "Onde estamos", como rótulos de
        interface; sem frase (Q1 (a)); o endereço do §1 com " — " trocado por " · " (Q2 (b)); a
        composição da Q3 (b) como melhoria aprovada sobre o protótipo, uma coluna até 1024 px e,
        acima, título à esquerda e os três quadros à direita, com a nota de que, na R4, o
        formulário traz de volta a composição do protótipo;
      - no `conteudo-institucional.md` §1 (Q4 (a)): a linha da descrição e a frase, logo abaixo do
        título "## 1." (D3).
      Verificar: `grep -c '^| Contato, página' docs/REFERENCIA-VISUAL.md` dá 1, e a linha cita
      "Q3 (b) da `pagina-contato`" e a R4; `grep -c '^> Contato da Liga Acadêmica
      Multiprofissional' docs/conteudo-institucional.md` dá 1; `git diff --numstat main --
      docs/REFERENCIA-VISUAL.md docs/conteudo-institucional.md` com 0 linhas removidas; as decisões
      literais do Gabriel no `relatorio.md`.
- [x] 1.3 **Líder técnico, antes do Portão 1:** os prints da Q3, por esboço estático fora de `src/`,
      com a faixa "ESBOÇO PARA DECISÃO, NÃO É O SITE", só com texto do documento e os rótulos
      propostos (método da Q3 da `pagina-sobre-e-equipe`). Verificar: `ls
      openspec/changes/pagina-contato/prints/q3-opcao-*.png | wc -l` dá 6; `file` diz PNG nos 6; o
      método, as fontes usadas e a rolagem horizontal 0 nas 6 capturas no `relatorio.md`.

## 2. A página

- [x] 2.1 O bloco de contato em `src/componentes/padroes/`, com os dados num lugar só, e a cópia do
      ícone do Gmail em `public/` (D1, D4, D5). Verificar: `npm run lint` com código 0 (a regra de
      camadas passa); `wc -l` de cada arquivo novo com até 150 linhas; `sha256sum
      assets/icone-email-gmail.png public/icone-email-gmail.png` com os dois iguais; `npm test` com
      código 0, imprimindo `quadros: 3` e `quadros na composição da inicial: 2`; `git diff
      --exit-code main -- src/componentes/layout src/componentes/ui` com código 0.
- [x] 2.2 O topo, os dados de `features/contato` e a rota `/contato`, na composição da Q3 (b) (D1,
      D4): uma coluna até 1024 px; acima, sobretítulo e título à esquerda e os três quadros à
      direita, alinhados ao topo do título; a grade na rota, e não no bloco. Verificar: `npm run
      lint` e `npm run verificar:tokens` com código 0; `wc -l` de cada componente novo com até 150
      linhas; `git diff --numstat src/estilos/tokens.css` com 0 linhas removidas; na 3000, em 1280
      e em 1024, a posição da lista em relação ao título medida no navegador e escrita no relatório
      (à direita em 1280, abaixo em 1024); no relatório, o corte (1024 px) e as proporções das
      colunas, o espaço entre elas e a largura máxima lidos da grade `data-resp` da seção Contato
      do protótipo, o tamanho do círculo, e os pares de cor do sobretítulo, do rótulo e do valor
      contra o fundo, nomeados e medidos (RP-09).
- [x] 2.3 A entrada de `/contato` na lista, com o teste de unidade da lista (D3). Verificar, com
      `npm run build`, a 3000 publicada e a 3001 não publicada, por `curl -s`:
      - `npm test` imprime `Entradas da lista de páginas públicas conferidas: 6`;
      - na 3000, `/contato` responde 200, com 1 `<h1>` "Fale com a Liga" e o `<title>`
        "Contato · LIACUP";
      - `grep -c` no HTML de `/contato` de `liacup@unb.br`, "Darcy Ribeiro", "Faculdade de
        Medicina", "Perfil do Instagram", "Logo do e-mail", "—" e `<input` dá 0 em cada um;
      - na 3001, `curl -s -o /dev/null -w '%{http_code} %{redirect_url}'` em `/contato` dá `307`
        para `/`.

## 3. Verificações

- [x] 3.1 **qa:** o spec de `/contato` (D6, item 1), com o texto lido do §1, os rótulos da §7 e os
      termos proibidos lidos do protótipo. Verificar: `npx playwright test` verde nas 7 larguras, e
      a saída imprime quantos trechos conferiu, `travessões trocados: 1`, os termos proibidos
      procurados e os achados (0), `quadros: 3`, os links conferidos (2) e o ponto do canto de cada
      um, `composição: 6 larguras em uma coluna, 1 em duas`, `contato no interruptor: 2 de 2 modos`
      e `Violacoes de acessibilidade: 0`.
- [x] 3.2 **qa:** os ajustes (D6, itens 2 e 3). Verificar: `npx playwright test` inteiro verde nos
      dois modos, com `páginas verificadas: 6 de 6` e `rotas verificadas: 4`; `git diff --exit-code
      tests/e2e/interruptor.spec.ts playwright.config.ts` com código 0.
- [x] 3.3 RP-12: as onze demonstrações do D6, cada uma com a saída vermelha e a verde no relatório.
      Verificar: depois delas, `git status --porcelain` igual ao de antes, `sha256sum -c` com OK nos
      arquivos tocados e `git grep -c --untracked DEMO-RP12 -- src tests/e2e` com código 1.

## 4. Conferência

- [x] 4.1 **Guardião visual:** lado a lado de `/contato` em 390 e 1280 px contra `contato-*`, do menu
      aberto em 390 contra `menu-aberto-390.png`, do cabeçalho em 1280 e do rodapé com "Contato" na
      coluna "Conteúdo". O formulário ausente e os quadros na coluna da direita acima de 1024 px
      entram como "melhoria aprovada pelo Gabriel (Q3 (b))", com o esboço
      `prints/q3-opcao-b-1280.png` como referência da decisão; a frase ausente (Q1 (a)), as
      legendas ausentes (§6), a logo e o Gmail no lugar das imagens de exemplo e o endereço da Q2
      (b) entram como decisão do briefing ou do Gabriel. Inclui a raiz não publicada contra os
      prints arquivados da
      `pagina-projetos`. Verificar: os PNG em `openspec/changes/pagina-contato/prints/`; cada
      diferença no relatório com veredito; 0 pixel diferente na raiz não publicada.
- [x] 4.2 **Líder técnico, antes do guardião:** no `docs/SEGURANCA.md` §7, as linhas de origem dos
      6 prints da Q3, dos PNG do `guardiao-visual` (no caminho do archive, como as anteriores) e de
      `public/icone-email-gmail.png` (cópia idêntica de `assets/`, com o sha256), o total novo e a
      versão 3.4 com o nome da change. Verificar: `grep -c 'pagina-contato' docs/SEGURANCA.md` com
      as linhas esperadas; `git diff --numstat main -- docs/SEGURANCA.md` mostrando só a §7 e o
      cabeçalho; o total igual à soma da coluna "Arquivos"; `npm run verificar:artefatos` com
      código 0.
- [x] 4.3 `npm run verificar` e `npm run build && npm run test:desempenho` com código 0. Verificar:
      `páginas medidas: 6` no publicado e `1` no não publicado; desempenho ≥ 90, acessibilidade ≥ 95
      e SEO ≥ 95 em `/contato`; 23 dependências diretas; `git diff --exit-code main -- package.json
      package-lock.json src/proxy.ts lighthouserc.json playwright.config.ts .github/ scripts/
      docs/PLANO-DE-DESENVOLVIMENTO.md docs/PADROES-DE-CODIGO.md openspec/specs/publicacao-do-site
      openspec/specs/fundacao-e-ci` com código 0.
- [x] 4.4 `revisor` sobre o diff e `guardiao-appsec` pela conferência proporcional (D7). O líder
      técnico manda ao guardião a lista do diff (`git diff --name-only main...HEAD` mais
      `git status --porcelain --untracked-files=all`), a busca `git diff -G 'process\.env|NEXT_PUBLIC_'
      --name-only main...HEAD` (e `git grep -c --untracked` nos não rastreados) e a classificação:
      **passo 1, checklist inteiro**, pelo `docs/SEGURANCA.md`. Verificar: nenhum arquivo da lista
      fora da lista de tela, fora o `docs/SEGURANCA.md`; a busca vazia; o veredito de cada um no
      relatório; nenhum BLOQUEADO aberto; `git status` igual antes e depois das duas passagens.
- [x] 4.5 **Depois do push, antes do merge:** o P23 (D8) em
      `https://portal-liacup-git-feat-pagina-contato-liacup1.vercel.app/contato`, pelas formas da
      `SEGURANCA.md` §5. Verificar: a confirmação do Gabriel do host, letra por letra, e do commit no
      painel, registrada antes do `curl`; a resposta com `HTTP/2 200` e sem `Location`, literal e
      mascarada no relatório; as buscas do segredo com código 1 e saída vazia.

## Workflow follow-up

- `npx openspec validate pagina-contato --strict` com código 0.
- `npx openspec archive pagina-contato` antes do PR. Depois, `npx openspec validate --all --strict`,
  com `pagina-contato` criada. Se o archive cair em outra data, o caminho das linhas do §7 muda no
  mesmo diff.
- Entrega ao Gabriel no modelo do `CLAUDE.md`.
- Depois do merge, em produção: a raiz continua mostrando a página em construção, e `/contato` leva
  307 para `/`.
