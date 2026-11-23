# Tarefas — página inicial completa da R1

13 tarefas, duas de folga. Comandos em sintaxe de bash (Git Bash). Escopos nominais no `design.md`,
D8. As tarefas seguem a recomendação de cada Qn. Se o Gabriel decidir outra opção no Portão 1, o
especificador ajusta specs, `design.md` e estas tarefas antes do apply.

**Antes do Portão 1, fora da conta:** o líder técnico roda
`npx openspec validate inicio-completo --strict` (o especificador não tem terminal).

## 1. Documentos

- [ ] 1.1 **Líder técnico, depois do Portão 1:** na `REFERENCIA-VISUAL.md` §7, linha "Inicial,
      Contato e rodapé, links do Instagram e do e-mail", apagar só a frase de 20/11 e o espaço antes
      dela. A linha fica como o "Depois" da proposta, item 1. Verificar:
      - `grep -c 'poder copiar' docs/REFERENCIA-VISUAL.md` dá 0;
      - `grep -c -F` com o texto literal da Q9 (b), da proposta, dá 1;
      - `git diff --word-diff main -- docs/REFERENCIA-VISUAL.md` mostra um trecho removido, a frase de
        20/11, e nenhum acrescentado;
      - `npx playwright test tests/e2e/contato.spec.ts` com código 0.
- [ ] 1.2 **Líder técnico, depois do Portão 1, com a decisão escrita do Gabriel:** na §7, as linhas
      novas da inicial com os rótulos e as decisões das Q1 a Q7, cada rótulo entre aspas, para o e2e
      ler: "Inicial, números" (Q1), "Inicial, faixa do processo seletivo" (Q2, Q3 e Q7), "Inicial,
      bloco de contato" (Q4, Q5 e Q6); no `conteudo-institucional.md`, só se a Q1 (c) ou a Q4 (b)
      forem escolhidas. Verificar: `grep -c '^| Inicial, ' docs/REFERENCIA-VISUAL.md` dá 7 (as 4 de
      hoje, contadas à mão pelo especificador, mais as 3 novas); `git diff --numstat main -- docs/REFERENCIA-VISUAL.md
      docs/conteudo-institucional.md` com 1 linha removida no total, a da tarefa 1.1; as decisões
      literais do Gabriel no `relatorio.md`.

## 2. A página

- [ ] 2.1 Os números em `src/features/numeros-da-liga/`, com tipos, conteúdo, teste de unidade e o
      componente (D1, D3). Verificar: `npm test` com código 0, imprimindo `números: 4`; `npm run
      lint` e `npm run verificar:tokens` com código 0; `wc -l` de cada arquivo novo com até 150
      linhas; no relatório, o vão entre o hero e os cartões medido contra o gabarito em 390 e 1280,
      o corte do `data-resp4` e os pares de contraste nomeados (RP-09).
- [ ] 2.2 A faixa em `src/features/processo-seletivo/componentes/`, e o rótulo do botão no conteúdo
      (D1, D4). Verificar: `npm test` com código 0; `git diff --numstat main --
      src/features/processo-seletivo/conteudo.ts src/features/processo-seletivo/tipos.ts
      src/features/processo-seletivo/conteudo.test.ts` com 0 linhas removidas; `git diff --exit-code
      main -- src/features/processo-seletivo/componentes/FaixaDoTopo.tsx` com código 0, ou, se o
      `Aviso` for extraído, `npx playwright test tests/e2e/processo-seletivo.spec.ts` verde sem
      alteração no spec; no relatório, o corte da grade e cada par de contraste da faixa, sobre o
      cartão e sobre o círculo, com o hover e o pressionado (RP-09).
- [ ] 2.3 O bloco de contato em `src/features/contato/`, e a variante "cartão" do quadro em
      `src/componentes/padroes/` (D1, D5; Q6 (a)). Verificar: `npm test` com código 0, imprimindo
      `quadros na composição da inicial: 2` e `apresentação cartão: 2`; `npm run lint` com código 0
      (a regra de camadas passa); `git diff --numstat main -- src/features/contato/conteudo.ts
      src/features/contato/tipos.ts` com 0 linhas removidas; `npx playwright test
      tests/e2e/contato.spec.ts` verde sem alteração no spec; no relatório, o hover e o pressionado
      medidos sobre o cartão.
- [ ] 2.4 A rota da raiz, na ordem do D6. Verificar, com `npm run build`, a 3000 publicada e a 3001
      não publicada, por `curl -s`:
      - `git diff --exit-code main -- 'src/app/(site)/(publicas)/_inicio' src/lib/utils/paginas-publicas.json
        src/proxy.ts` com código 0;
      - na 3000, `/` responde 200, com 1 `<h1>`, e `grep -c` de `>Processo seletivo</h2>` e de
        `>Onde a Liga responde</h2>` dá 1 em cada um (o rodapé tem `<h2>` próprios; a contagem dentro
        do `<main>` é do e2e, tarefa 3.1);
      - `grep -c` no HTML de `/` de "Próximos eventos", "O que anda acontecendo", "Conteúdo
        educativo", "2026.2", "Ver o edital", "Mandar uma mensagem", "canal mais rápido",
        `liacup@unb.br`, "Perfil do Instagram" e "—" dá 0 em cada um;
      - na 3001, o HTML de `/` traz "Portal em construção" e nenhum dos números.

## 3. Verificações

- [ ] 3.1 **qa:** os blocos novos no spec da inicial (D7, itens 1 a 5). Verificar: `npx playwright
      test` inteiro verde nos dois modos, nas 7 larguras, e a saída imprime quantos trechos conferiu,
      `números lidos do documento: 4`, `faixa e página: 2 trechos iguais`, as medidas de contraste
      da faixa com as cores nomeadas, os termos proibidos procurados e os achados (0), `páginas
      verificadas: 6 de 6`, `rotas verificadas: 4` e `Violacoes de acessibilidade: 0`; `git diff
      --exit-code main -- tests/e2e/paginas-publicas.spec.ts tests/e2e/interruptor.spec.ts
      playwright.config.ts` com código 0.
- [ ] 3.2 RP-12: as nove demonstrações do D7, cada uma com a saída vermelha e a verde no relatório.
      Verificar: depois delas, `git status --porcelain` igual ao de antes, `sha256sum -c` com OK nos
      arquivos tocados e `git grep -c --untracked DEMO-RP12 -- src tests/e2e` com código 1.

## 4. Conferência

- [ ] 4.1 **Guardião visual:** lado a lado da raiz inteira em 390 e 1280 px contra `inicio-*`, com
      cada diferença classificada. Os blocos de agenda, notícias e conteúdo educativo entram como
      "fora da R1"; a frase e o botão do contato, os rótulos e o texto da faixa e a cor do cartão
      entram como decisão do briefing ou do Gabriel (Q1 a Q7); o hero, como já aprovado na
      `layout-e-hero`. Também `/contato` em 390 e 1280 antes e depois (Q6 (a)) e a raiz não publicada
      contra os prints arquivados da `pagina-contato`. Verificar: os PNG em
      `openspec/changes/inicio-completo/prints/`; cada diferença no relatório com veredito; 0 pixel
      diferente em `/contato` e na raiz não publicada.
- [ ] 4.2 **Líder técnico, antes do guardião:** no `docs/SEGURANCA.md` §7, a linha de origem dos PNG
      do `guardiao-visual` (no caminho do archive, como as anteriores), o total novo e a versão com
      o nome da change. Verificar: `grep -c 'inicio-completo' docs/SEGURANCA.md` com as linhas
      esperadas; `git diff --numstat main -- docs/SEGURANCA.md` mostrando só a §7 e o cabeçalho; o
      total igual à soma da coluna "Arquivos"; `npm run verificar:artefatos` com código 0.
- [ ] 4.3 `npm run verificar` e `npm run build && npm run test:desempenho` com código 0. Verificar:
      `páginas medidas: 6` no publicado e `1` no não publicado; desempenho ≥ 90, acessibilidade ≥ 95
      e SEO ≥ 95 em `/`; 23 dependências diretas; `git diff --exit-code main -- package.json
      package-lock.json src/proxy.ts lighthouserc.json playwright.config.ts .github/ scripts/
      docs/PLANO-DE-DESENVOLVIMENTO.md docs/PADROES-DE-CODIGO.md openspec/specs` com código 0.
- [ ] 4.4 `revisor` sobre o diff e `guardiao-appsec` pela conferência proporcional (D8). O líder
      técnico manda ao guardião a lista do diff (`git diff --name-only main...HEAD` mais
      `git status --porcelain --untracked-files=all`), a busca `git diff -G 'process\.env|NEXT_PUBLIC_'
      --name-only main...HEAD` (e `git grep -c --untracked` nos não rastreados) e a classificação:
      **passo 1, checklist inteiro**, pelo `docs/SEGURANCA.md`. Verificar: nenhum arquivo da lista
      fora da lista de tela, fora o `docs/SEGURANCA.md`; a busca vazia; o veredito de cada um no
      relatório; nenhum BLOQUEADO aberto; `git status` igual antes e depois das duas passagens.
- [ ] 4.5 **Depois do push, antes do merge:** o P23 (D9) em
      `https://portal-liacup-git-feat-inicio-completo-liacup1.vercel.app/`, pelas formas da
      `SEGURANCA.md` §5. Verificar: a confirmação do Gabriel do host, letra por letra, e do commit no
      painel, registrada antes do `curl`; a resposta com `200`, sem `Location` e com
      `X-Matched-Path: /`, literal e mascarada no relatório; as buscas do segredo com código 1 e
      saída vazia; o registro commitado antes do merge.

## Workflow follow-up

- `npx openspec validate inicio-completo --strict` com código 0.
- `npx openspec archive inicio-completo` antes do PR. Depois, o `## Purpose` de
  `openspec/specs/pagina-inicial/spec.md` atualizado (hoje diz que a página "é o hero"), e
  `npx openspec validate --all --strict`. Se o archive cair em outra data, o caminho da linha do §7
  muda no mesmo diff.
- Entrega ao Gabriel no modelo do `CLAUDE.md`.
- Depois do merge, em produção: a raiz continua mostrando a página em construção.
