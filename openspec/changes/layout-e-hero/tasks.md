# Tarefas — layout e hero

15 tarefas, sem folga. Comandos em sintaxe de bash (Git Bash). Escopos nominais no `design.md`,
D9. Nenhuma tarefa começa antes de o Gabriel decidir Q1, Q2 e Q3 no Portão 1; se a Q1 for (a), a
emenda ao `conteudo-institucional.md` entra antes da tarefa 1.7, pelo líder técnico ou pelo gestor.

## 1. A moldura e o hero

- [ ] 1.1 **Guardião visual, antes de qualquer mudança:** print da raiz não publicada da `main` em
      390 e 1280 px, página inteira, em `prints/antes-raiz-nao-publicada-390.png` e
      `prints/antes-raiz-nao-publicada-1280.png`. Verificar: os dois arquivos existem, com 390 e
      1280 px de largura lidos do cabeçalho do PNG
- [ ] 1.2 A lista única, o módulo que a lê e o teste de unidade dela (D3), e a seção "Como
      acrescentar uma página ao menu" no README. Verificar: `npm test` com código 0 e o contador de
      entradas da lista igual a 1; `npm run formatar:check` com código 0
- [ ] 1.3 O layout das páginas públicas, fora do alcance de `/em-construcao`, e a raiz trocando a
      página em construção pela inicial (D1). Verificar, com `npm run build`, um servidor publicado
      na 3000 e um não publicado na 3001, e `curl -s`: na 3001, `/` tem "Portal em construção" e
      não tem o cabeçalho novo; na 3000, `/` responde 200, tem o título do hero e não tem "Portal em
      construção". E `git diff --exit-code src/proxy.ts src/componentes/layout/PaginaEmConstrucao*
      src/componentes/layout/Rodape* src/componentes/layout/LinksDeContato*` com código 0
- [ ] 1.4 O cabeçalho, nas duas formas, com página atual e estados do ADR-0006 (D4). Verificar: o
      ponto de troca medido no protótipo e o corte escolhido registrados no relatório;
      `npm run verificar:tokens` e `npm run lint` com código 0; nenhum componente novo com mais de
      150 linhas (`wc -l`)
- [ ] 1.5 O menu lateral (D4). Verificar: os seis comportamentos conferidos à mão em 390 px na
      prévia local e registrados no relatório, antes do teste automático da tarefa 2.2
- [ ] 1.6 O rodapé novo (D5, Q3). Verificar: `curl -s localhost:3000/` contém
      `liacup.unb@gmail.com`, `@liacup.unb` e "Campus UnB Ceilândia", e
      `grep -c` de `liacup@unb.br`, "Darcy Ribeiro", "Painel" e "Protótipo do Portal" na resposta
      dá 0
- [ ] 1.7 O hero (D6, Q1, Q2). Verificar: o texto do hero conferido palavra por palavra contra o
      `conteudo-institucional.md` (ou contra a decisão da Q1) e registrado no relatório; `grep -c
      "Foto institucional"` na resposta de `localhost:3000/` igual a 0; o lugar do componente
      registrado no relatório

## 2. Verificações

- [ ] 2.1 **qa:** spec das páginas da lista e da moldura (D7, itens 1, 2 e 5). Verificar:
      `npx playwright test` verde nas 7 larguras, com `páginas verificadas: 1`, o número de alvos
      medidos, o número de links conferidos e `Violacoes de acessibilidade: 0` na saída de cada
      largura
- [ ] 2.2 **qa:** spec do menu por teclado (D7, item 3). Verificar: verde nas 7 larguras, com o
      número de larguras em que o menu lateral foi testado impresso, maior que zero
- [ ] 2.3 **qa:** `pagina-inicial.spec.ts` reescrito para a inicial publicada (D7, item 4), e
      `interruptor.spec.ts` intocado. Verificar: `npx playwright test` inteiro verde nos dois modos;
      `git diff --exit-code tests/e2e/interruptor.spec.ts playwright.config.ts` com código 0
- [ ] 2.4 Lighthouse nos dois modos, lendo a lista, sem dependência nova (D8). Verificar:
      `npm run build && npm run test:desempenho` com código 0, a saída dizendo 1 página no modo
      publicado e 1 no não publicado, e desempenho e acessibilidade de cada uma em número no
      relatório; limiar e preset iguais aos de antes (`git diff lighthouserc.json` sem mudança
      nessas linhas); `git diff --exit-code .github/` com código 0
- [ ] 2.5 RP-12, as cinco demonstrações do D7, cada uma com a saída vermelha e a verde no
      relatório. Verificar: depois delas, `git status --porcelain` igual ao de antes das
      demonstrações

## 3. Conferência

- [ ] 3.1 **Guardião visual:** lado a lado em 390 e 1280 px contra `inicio-390.png`,
      `inicio-1280.png` e `menu-aberto-390.png`, só cabeçalho, menu aberto, hero e rodapé, e a raiz
      não publicada depois contra a tarefa 1.1. Verificar: os PNG em
      `openspec/changes/layout-e-hero/prints/`; cada diferença listada no relatório como adaptação
      aprovada, melhoria proposta ou defeito; zero diferenças na página em construção
- [ ] 3.2 `npm run verificar` com código 0 e os contadores de cada etapa no relatório. Verificar
      também: 22 dependências diretas; `git diff --exit-code package-lock.json` e
      `npm run verificar:artefatos` com código 0; `git status --porcelain` só com arquivos do D9
- [ ] 3.3 `revisor` sobre o diff e `guardiao-appsec` com o checklist inteiro (a regra 2 da dieta
      ainda não vale). Verificar: veredito de cada um no relatório, nenhum BLOQUEADO aberto, e
      `git status` igual antes e depois das duas passagens

## Workflow follow-up

- `openspec validate layout-e-hero --strict` com código 0
- `openspec archive layout-e-hero` antes do PR, porque a `main` é protegida; depois,
  `openspec validate --all --strict`, com `navegacao-publica` e `pagina-inicial` criadas e, em
  `fundacao-e-ci`, "Página provisória no ar" trocado por "Página provisória enquanto o site não
  está publicado"
- Entrega ao Gabriel no modelo do `CLAUDE.md`
- No Portão 2, na prévia: a raiz mostra cabeçalho, hero e rodapé. Depois do merge, em produção: a
  raiz continua mostrando a página em construção
