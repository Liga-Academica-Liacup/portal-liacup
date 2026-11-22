# Tarefas — páginas Sobre e Equipe

14 tarefas, uma de folga. Se uma correção passar de 15, a `/equipe` sai inteira para uma change
própria: a 4.1, a 5.2 e as partes de Equipe da 2.2, 5.3 e 6.1 (proposta). Comandos em sintaxe de
bash (Git Bash). Escopos nominais no `design.md`, D12. As tarefas seguem as recomendações das Q1 a
Q10; o que o Gabriel decidir diferente, o `especificador` ajusta aqui antes do apply.

**Antes do Portão 1, fora da conta:** o líder técnico gera os seis prints da Q3
(`prints/q3-opcao-{a,b,c}-{390,1280}.png`) a partir de um esboço estático fora de `src/`, e roda
`openspec validate pagina-sobre-e-equipe --strict`.

## 1. Pendências e documentos

- [ ] 1.1 Pendências da Q20 (D6, D7): `role="list"` nas seis listas sem marcador de hoje; o nome da
      liga pela Q1; o título de seção em `src/componentes/padroes/`, com o tipo renomeado; a
      borboleta em `src/componentes/ui/`. Verificar:
      - `git grep -c 'list-style: none' -- src` e `git grep -c 'role="list"' -- src` impressos,
        com o segundo pelo menos igual ao primeiro;
      - `git grep -n "NOME_DA_LIGA =" -- src` com 1 linha;
      - `git ls-files src/features/processo-seletivo | grep -c TituloDeSecao` dá 0 depois do
        commit, e `git grep -c "type TituloDeSecao" -- src` dá 0;
      - `npm test`, `npm run lint` e `npm run verificar:tokens` com código 0;
      - na 3000 publicada, o nome visível do cabeçalho e o título da Início iguais aos de antes
        (`curl -s` antes e depois, comparados).
- [ ] 1.2 **Líder técnico:** a 11.2 e a 11.3 nos `PADROES-DE-CODIGO.md`, com o texto do briefing,
      colado (D10). Verificar: `grep -c "^### 11.2 Só em produção, no lançamento" docs/PADROES-DE-CODIGO.md`
      e `grep -c "^### 11.3 Como se verifica" docs/PADROES-DE-CODIGO.md` dão 1 cada, e
      `git diff --numstat docs/PADROES-DE-CODIGO.md` mostra 0 linhas removidas.
- [ ] 1.3 **Documentos, no Portão 1, depois da decisão escrita do Gabriel:**
      - `especificador`, no `conteudo-institucional.md`: a linha "Nomes da diretoria atual ·
        Pendente" no §8, com o placar ("de 16 itens, 9 resolvidos"); e o texto da Q2 (a), da Q6
        (b) e da Q9, se escolhidas;
      - líder técnico, na `REFERENCIA-VISUAL.md` §7: os rótulos da Q2 e da Q4 e a regra da Q7.
      Verificar: `grep -c "Nomes da diretoria atual" docs/conteudo-institucional.md` dá 1; `git
      diff --numstat` dos dois documentos mostra só as linhas autorizadas, nomeadas no relatório; o
      aceite literal do Gabriel transcrito no `relatorio.md`.

## 2. Base comum

- [ ] 2.1 Componentes comuns (D4, D6): o quadro com a borboleta em `padroes/`, o círculo da foto
      em `ui/` (Q7) e o cartão de docente em `features/equipe/`. Verificar: `npm run lint` e `npm
      run verificar:tokens` com código 0; nenhum componente novo com mais de 150 linhas (`wc -l`);
      `git diff --numstat src/estilos/tokens.css` com 0 linhas removidas.
- [ ] 2.2 Os dados das duas páginas, com o teste de unidade (D8). Verificar: `npm test` com código
      0, e a saída imprime `itens: 4 · parágrafos: 5` e `cargos: 6 · fundadores: 5 · docentes: 2`.

## 3. Sobre

- [ ] 3.1 A página `/sobre` e a entrada dela na lista (D3, D4). Verificar, com `npm run build`, a
      3000 publicada e a 3001 não publicada, por `curl -s`:
      - na 3000, `/sobre` responde 200, com 1 `<h1>` "Sobre a LIACUP" e o `<title>` "Sobre ·
        LIACUP";
      - `grep -c` de "Kerolyn Ramos Garcia" dá pelo menos 1; de "Pendente", "Foto de uma
        atividade", "borboleta não é enfeite" e "Estatuto, Art. 2º" dá 0;
      - a raiz da 3000 tem "Conheça a Liga" com `href="/sobre"`;
      - na 3001, `curl -s -o /dev/null -w '%{http_code} %{redirect_url}'` em `/sobre` dá `307`
        para `/`.

## 4. Equipe

- [ ] 4.1 A página `/equipe` e a entrada dela na lista (D3, D5). Verificar, como na 3.1:
      - na 3000, `/equipe` responde 200, com 1 `<h1>` "Quem faz a LIACUP" e o `<title>` "Equipe ·
        LIACUP";
      - os seis cargos do §4.3 e os cinco nomes do §4.2 na resposta, na ordem;
      - `grep -c` de "Ligantes", "nome pendente", "Mariana Castro", "Tesouraria", "Gestão 2026" e
        "semestre" dá 0;
      - na 3001, `/equipe` dá `307` para `/`.

## 5. Verificações

- [ ] 5.1 **qa:** o spec de `/sobre` (D9, item 1), com o texto lido do documento e a nota do §2.4
      tirada (Q10). Verificar: `npx playwright test` verde nas 7 larguras, e a saída imprime
      quantos trechos conferiu, os parágrafos por seção e `Violacoes de acessibilidade: 0`.
- [ ] 5.2 **qa:** o spec de `/equipe` (D9, item 1). Verificar: `npx playwright test` verde nas 7
      larguras, com `cargos: 6`, `fundadores: 5`, `docentes: 2` e `Violacoes de acessibilidade: 0`
      na saída.
- [ ] 5.3 **qa:** os ajustes (D9, item 2): lista com 4 páginas, interruptor com 4 rotas e `/sobre`
      200 no publicado, "Conheça a Liga", menu e rodapé, e as listas anunciadas. Verificar: `npx
      playwright test` inteiro verde nos dois modos, com `páginas verificadas: 4 de 4`, `rotas
      verificadas: 4` e o número de listas conferidas por página; `git diff --exit-code
      playwright.config.ts` com código 0.
- [ ] 5.4 RP-12: as seis demonstrações do D9, cada uma com a saída vermelha e a verde no relatório.
      Verificar: depois delas, `git status --porcelain` igual ao de antes, `sha256sum -c` com OK
      nos arquivos tocados e `git grep -c DEMO-RP12` com código 1.

## 6. Conferência

- [ ] 6.1 **Guardião visual:** lado a lado de `/sobre` e `/equipe` em 390 e 1280 px contra
      `sobre-*` e `equipe-*`, do menu aberto em 390 contra `menu-aberto-390.png`, do hero da
      inicial com o "Conheça a Liga" e do rodapé com a coluna "Conteúdo". Inclui a raiz não
      publicada contra os prints arquivados da change anterior. Verificar: os PNG em
      `openspec/changes/pagina-sobre-e-equipe/prints/`; cada diferença no relatório com veredito;
      0 pixel diferente na raiz não publicada.
- [ ] 6.2 `npm run verificar` e `npm run build && npm run test:desempenho` com código 0. Verificar:
      `páginas medidas: 4` no publicado e `1` no não publicado; desempenho ≥ 90, acessibilidade ≥
      95 e SEO ≥ 95 em `/sobre` e `/equipe`; 22 dependências diretas; `git diff --exit-code
      package.json package-lock.json src/proxy.ts lighthouserc.json .github/` com código 0.
- [ ] 6.3 `revisor` sobre o diff e `guardiao-appsec` com o **checklist inteiro** (passo 1 da
      conferência proporcional: `docs/PADROES-DE-CODIGO.md` e a spec `publicacao-do-site` estão no
      gatilho). Verificar: o veredito de cada um no relatório, nenhum BLOQUEADO aberto, e `git
      status` igual antes e depois das duas passagens.

## Workflow follow-up

- `openspec validate pagina-sobre-e-equipe --strict` com código 0.
- `openspec archive pagina-sobre-e-equipe` antes do PR. Depois, `openspec validate --all --strict`,
  com `pagina-sobre` e `pagina-equipe` criadas e, em `navegacao-publica`, "A lista única decide
  quais páginas públicas existem e onde aparecem" trocado por "A lista única decide as páginas
  públicas, onde aparecem e em que ordem".
- Entrega ao Gabriel no modelo do `CLAUDE.md`.
- Depois de a Vercel gerar a prévia, e antes do merge: o **P23** em
  `https://portal-liacup-git-feat-pagina-sobre-e-equipe-liacup1.vercel.app/sobre` e `/equipe`,
  depois de o Gabriel confirmar o host e o commit no painel, com 200 e sem `Location`. Saída literal
  e mascarada no relatório.
- Depois do merge, em produção: a raiz continua mostrando a página em construção, e `/sobre` e
  `/equipe` levam 307 para `/`.
