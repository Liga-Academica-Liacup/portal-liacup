# Tarefas — interruptor "em construção"

14 tarefas, com as decisões do Portão 1 (19/11/2026) aplicadas. Comandos em sintaxe de bash (Git
Bash). Escopos: `dev-frontend`, os arquivos nominais do `design.md` D10, que incluem
`playwright.config.ts`, `.env.example` e `README.md` (Q5 = a); `qa-acessibilidade`,
`tests/e2e/interruptor.spec.ts`; `guardiao-visual`,
`openspec/changes/interruptor-em-construcao/prints/`.

## 1. O interruptor

- [x] 1.1 **Guardião visual, antes de qualquer mudança:** print da raiz da `main` em 390 e 1280 px,
      página inteira, em `prints/antes-raiz-390.png` e `prints/antes-raiz-1280.png`. Verificar: os
      dois arquivos existem, e a largura lida do cabeçalho de cada PNG (`node -e`, bytes 16 a 19) é
      390 e 1280
- [x] 1.2 Função pura do valor exato e o teste de unidade dela (D2): `true` publica; ausente, vazio,
      `TRUE`, `True`, `1`, `sim`, `false` e ` true` não publicam, e a saída imprime quantos casos
      conferiu. Verificar: `npm test` com código 0 e o contador igual a 9. RP-12: com a comparação
      trocada por uma insensível a caixa, `npm test` sai com código 1 e nomeia `TRUE` e `True`;
      desfeita a troca, código 0. As duas saídas vão para o relatório
- [x] 1.3 A página em construção num lugar só (D3): o componente `PaginaEmConstrucao`, com a
      marcação e o CSS de hoje sem alteração, usado pela raiz e pela rota `/em-construcao`.
      Verificar: `npx playwright test tests/e2e/pagina-inicial.spec.ts` verde nas 7 larguras, com o
      mesmo número de testes de antes; `git diff --stat src/estilos/tokens.css` vazio; o CSS movido
      aparece como renomeação com 100% de semelhança em `git diff -M --stat`
- [x] 1.4 O interceptador (D1, D3, D4). Verificar com uma compilação e dois servidores
      (`npm run build`, depois `SITE_PUBLICADO=true npm run start &` e
      `SITE_PUBLICADO=false npm run start -- -p 3001 &`), usando
      `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n"`, que não segue redirecionamento:
      - na 3001: `/` e `/em-construcao` dão `200`, sem destino, e o corpo tem "Portal em construção"
        (`curl -s ... | grep -c`); `/vitrine`, `/sobre`, `/processo-seletivo` e
        `/endereco-que-nao-existe` dão `307` com destino terminando em `/`, sem caminho depois do
        endereço; `curl -sI localhost:3001/logo-liacup-256.png` traz `200` e
        `Content-Type: image/png`;
      - na 3000: `/` dá `200` com "Portal em construção"; `/vitrine` dá `200` sem "Portal em
        construção"; `/sobre`, `/endereco-que-nao-existe` e `/em-construcao` dão `404`, sem
        destino.

      Os 12 resultados (7 na 3001, 5 na 3000) vão para o relatório

## 2. Os dois modos no e2e

- [x] 2.1 `playwright.config.ts` com dois servidores (D5): 3000 publicado, com `build` e `start`; 3001
      não publicado, só `start`, com `SITE_PUBLICADO=false` explícito. Verificar: `npx playwright test`
      roda `pagina-inicial.spec.ts` e `vitrine.spec.ts` verdes, com os mesmos números de antes; a
      saída do Playwright mostra uma compilação só (`grep -c "Creating an optimized production build"`
      igual a 1); `git diff --exit-code .github/ lighthouserc.json` com código 0
- [x] 2.2 Spec novo, modo não publicado (D6, itens 1 a 4): as três rotas com 307 para `/` e a página
      final; a raiz com 200, conteúdo, axe e rolagem; `/em-construcao` com 200; e a logo pedida
      direto. Verificar: `npx playwright test tests/e2e/interruptor.spec.ts` verde nas 7 larguras,
      com `rotas verificadas: 3` e `Violacoes de acessibilidade: 0` na saída de cada largura
- [x] 2.3 Spec novo, modo publicado e primeira resposta (D6, itens 5 a 7): `/vitrine` mostra a
      vitrine; nenhuma das três rotas mostra a página em construção; `/em-construcao` dá 404; e
      `/sobre` e `/endereco-que-nao-existe`, sem seguir redirecionamento, dão 307 com caminho `/`
      no modo não publicado e 404 sem `Location` no publicado. Verificar: o mesmo comando verde nas
      7 larguras, com `rotas verificadas: 3` e `respostas conferidas: 4` na saída de cada largura
- [x] 2.4 RP-12 (D7, demonstrações 2 a 4), com as seis saídas no relatório. Verificar:
      - com o interceptador apagado temporariamente, o spec do modo não publicado sai com código 1 e
        nomeia `/vitrine`, `/sobre` e `/processo-seletivo`, com o status recebido (200 ou 404 no
        lugar de 307); restaurado, código 0;
      - com o interceptador ignorando a variável, o spec do modo publicado sai com código 1 em
        `/vitrine` e em `/sobre` (307 no lugar de 200 e de 404); restaurado, código 0;
      - com a regra do 404 de `/em-construcao` removida, o item 6 sai com código 1 (200 no lugar de
        404); restaurada, código 0.

      Depois, `git status --porcelain src/` igual ao de antes das demonstrações

## 3. Documentação

- [x] 3.1 `.env.example` com o bloco de `SITE_PUBLICADO=true` (D8, Q4 = a). Verificar:
      `grep -n "^SITE_PUBLICADO=true$" .env.example` mostra uma linha, e o comentário diz, em
      português, que não é segredo, que só `true` publica, que o valor vale só para a máquina de
      quem copia e que em produção a variável fica ausente até a R1
- [x] 3.2 README (D8): a frase "Na F00 nenhuma variavel e usada ainda" corrigida. A seção "Variaveis
      de ambiente" explica o que o visitante vê em cada modo, Production sem a variável, Preview com
      `true`, que a mudança só vale depois de nova implantação, como lançar e voltar atrás, e o
      `.env.local`. A seção "Como testar" diz que o e2e usa as portas 3000 e 3001. Verificar:
      `npm run formatar:check` com código 0; `grep -c "SITE_PUBLICADO" README.md` maior ou igual a
      3; `grep -c "nova implanta" README.md` maior ou igual a 1;
      `grep -c "Na F00 nenhuma variavel" README.md` igual a 0

## 4. Conferência

- [x] 4.1 **Guardião visual:** prints da raiz com o site não publicado em 390 e 1280 px, e o lado a
      lado com os prints de antes (1.1). Verificar: 2 PNG novos e 2 lado a lado em
      `openspec/changes/interruptor-em-construcao/prints/`; a seção do `guardiao-visual` no relatório
      com zero diferenças não explicadas (RP-08, RP-14)
- [x] 4.2 Lighthouse no modo não publicado (RP-06): `npm run build && npm run test:desempenho`, sem
      `SITE_PUBLICADO` no ambiente e sem `.env.local`. Verificar: código 0, e desempenho e
      acessibilidade da raiz registrados em número no relatório; `git diff --exit-code
      lighthouserc.json` com código 0
- [x] 4.3 `npm run verificar` com código 0 e os contadores de cada etapa no relatório. Verificar
      também: dependências diretas iguais a 22 antes e depois; `git diff --exit-code
      package-lock.json` com código 0; `npm run verificar:artefatos` com código 0 (RP-01, RP-13);
      `git status --porcelain` só com os arquivos do D10, o spec novo e os prints da change
- [x] 4.4 Chamar o `revisor` sobre o diff. Verificar: o relatório dele traz quantos arquivos,
      critérios de aceite e regras conferiu, e `git status` depois da passagem não mudou

## Workflow follow-up

- `openspec validate interruptor-em-construcao --strict` com código 0
- `openspec archive interruptor-em-construcao` antes do PR, porque a `main` é protegida
- `openspec validate --all --strict` de novo, com `openspec/specs/publicacao-do-site/spec.md`
  criado e o requisito "Página provisória no ar" atualizado em `openspec/specs/fundacao-e-ci/spec.md`
- Entrega ao Gabriel no modelo do `CLAUDE.md`, com os comandos Git em bash, a mensagem em arquivo
  para `git commit -F` e o passo a passo da Vercel: Production sem a variável, Preview com `true`,
  nova implantação depois de mudar
- No Portão 2, na prévia: `/vitrine` abre a vitrine e `/em-construcao` dá 404. Depois do merge, em
  produção: `/vitrine` dá 307 para a raiz, e a raiz mostra a página em construção
