# Relatório — interruptor-em-construcao

Copiado de `openspec/changes/MODELO-relatorio.md`. Cada agente escreve a própria seção; a do agente
que não entrou recebe uma linha dizendo por quê. Número quando houver número. Incompleto declarado
incompleto.

## especificador

- **Artefatos (estado atual, depois da rodada 2):** `openspec/changes/interruptor-em-construcao/`
  `proposal.md`, `specs/publicacao-do-site/spec.md` (capacidade nova, 6 requisitos ADDED,
  13 cenários), `specs/fundacao-e-ci/spec.md` (1 requisito MODIFIED, "Página provisória no ar",
  5 cenários), `design.md` (D1 a D10), `tasks.md` · 7 requisitos, 18 cenários · 14 tarefas
- **Questões em aberto (estado atual):** nenhuma. Q1 a Q5 foram decididas pelo Gabriel no Portão 1,
  em 19/11/2026, e nenhuma questão nova surgiu
- **Incompleto:** não rodei `openspec instructions` nem `openspec validate --strict` em nenhuma
  rodada, porque este agente não roda comando. A validação é do líder técnico. Não confirmei no
  código do Playwright que os dois servidores sobem em sequência: o `design.md` D5 supõe isso, e a
  tarefa 2.1 confere
- **Rodada 1 (superada):** 7 requisitos, 16 cenários e 14 tarefas, com a opção (a) de Q1 a Q5. Q1
  e Q2 vieram do líder técnico. Q3, Q4 e Q5 o especificador encontrou ao escrever
- **Rodada 2 (Portão 1, 19/11/2026):** aplicadas Q1 = a, Q2 = decisão própria do Gabriel (307 para
  a raiz em todo endereço de página que não é `/` nem `/em-construcao`), Q3 = c, Q4 = a e Q5 = a,
  mais a E1 e o pedido novo de status e `Location`:
  - `proposal.md`: o "What Changes" e os critérios de aceite trazem o 307 e o 404 de
    `/em-construcao`; as questões viraram "Decisões do Portão 1"; o Impact cita o escopo nominal;
    o `canonical` entrou no fora de escopo;
  - `specs/fundacao-e-ci`: o requisito foi reescrito para o redirecionamento; o cenário "outro
    endereço" passou de 200 para 307; entrou o cenário de `/em-construcao`; saiu "A aparência não
    muda" (E1);
  - `specs/publicacao-do-site`: o requisito "publicado" ganhou o 404 sem redirecionamento e o 404
    de `/em-construcao` (+1 cenário); o requisito de verificação ganhou o cenário da primeira
    resposta (+1 cenário); os demais foram ajustados ao 307;
  - `design.md`: o D1 virou a tabela pedido × modo; o D3 tem o 404 de `/em-construcao` pelo
    interceptador, com duas alternativas descartadas; o D6 tem 7 itens, com `respostas conferidas:
    4`, e axe e rolagem só na raiz, porque todo endereço leva a ela; o D7 passou a quatro
    demonstrações; o D10 é novo, com o escopo nominal; a seção Open Questions registra as decisões;
  - `tasks.md`: a 1.4 confere 12 respostas; a 2.3 cobre a primeira resposta; a 2.4 tem três
    demonstrações; a 4.1 só fotografa a raiz, porque `/sobre` agora redireciona; a 4.3 confere o
    escopo. Continuam 14 tarefas
- **Observação da rodada 2, não é questão:** `/em-construcao` responde 200 em produção com o mesmo
  conteúdo da raiz. É a cópia que o motivo da Q2 quer evitar, mas foi decidido assim (Q3 = c).
  Ficou registrado como risco no `design.md`, com a mitigação: nenhum link aponta para ela, e o
  `canonical` é da `lancamento-r1`
- **Rodada 3 · Q6 (Portão 2, 19/11/2026):** Q6 = a aplicada só no `design.md` arquivado, no lugar,
  sem mover a change: D4 reescrito (lista das 9 extensões, motivo, regra genérica de extensão
  descartada, consequências aceitas de `/robots.txt` e `/sitemap.xml`, de outra extensão em
  `public/` e de maiúsculas "conforme `src/proxy.ts`"); D6 item 4 com `/vitrine.rsc` e
  `/robots.txt` em 307 para `/` e a logo em 200; D7 passou a cinco demonstrações; Q6 registrada em
  Open Questions. Para não contradizer o D4, também mudou o rótulo da primeira linha da tabela do
  D1, de "Recurso ou arquivo" para "Recurso compilado, imagem ou fonte". Specs sem mudança: o
  requisito "A página em construção chega inteira" fala de imagens, fontes, estilos e scripts, e
  todos continuam passando. `proposal.md` e `tasks.md` não foram tocados

## dev-frontend

Tarefas 1.2, 1.3, 1.4, 2.1, 3.1 e 3.2.

- **Arquivos:** A `src/proxy.ts` · A `src/lib/utils/site-publicado.ts` · A
  `src/lib/utils/site-publicado.test.ts` · A `src/componentes/layout/PaginaEmConstrucao.tsx` · A
  `src/componentes/layout/PaginaEmConstrucao.module.css` + D `src/app/(site)/page.module.css`
  (movido) · M `src/app/(site)/page.tsx` · A `src/app/(site)/em-construcao/page.tsx` · M
  `playwright.config.ts` · M `.env.example` · M `README.md` · **tokens novos:** nenhum
- **Comandos:** `verificar` 0 (270 arquivos rastreados, 0 artefatos; 61 arquivos de `src/`
  varridos, 0 tokens à mão; 177 arquivos do build, 0 ocorrências da chave) · `npm test` 0, 80/80
  em 10 arquivos (eram 71/71 em 9), `Valores de SITE_PUBLICADO conferidos: 9` · `playwright` (só
  os dois specs existentes) 0, 84/84
- **Melhorias de UI ou UX propostas:** nenhuma
- **Incompleto:** a renomeação "100% de semelhança" por `git diff -M --stat` não foi medida, porque
  o arquivo novo não está no índice e o líder vetou `git add -N`. No lugar: `diff` entre
  `git show HEAD:'src/app/(site)/page.module.css'` e o arquivo novo, saída vazia, código 0 (27
  linhas); a marcação de `return (` até o fim, antiga e nova, também com `diff` vazio (19 linhas).
  A 2.4 (as três demonstrações do interceptador) é do `qa-acessibilidade`

**1.2 · RP-12.** Vermelha, com `return valor?.toLowerCase() === 'true'`: `npm test` código 1,
`Valores de SITE_PUBLICADO conferidos: 7`, `× 'TRUE' nao publica`, `× 'True' nao publica`,
`Tests  2 failed | 78 passed (80)`. Restaurada (`diff` com a cópia, vazio): código 0,
`conferidos: 9`, `Tests  80 passed (80)`.

**1.3.** `npx playwright test tests/e2e/pagina-inicial.spec.ts`: 35 passed antes e 35 depois.
`git diff --exit-code --stat src/estilos/tokens.css`: código 0, vazio.

**1.4.** `npm run build` código 0, rotas `/`, `/_not-found`, `/em-construcao`, `/vitrine`
estáticas, mais `ƒ Proxy (Middleware)`. Saída literal (`%{http_code} %{redirect_url}`, sem seguir):

```
== 3001 (SITE_PUBLICADO=false) ==
/                          200   | 'Portal em construção' no corpo: 1
/em-construcao             200   | 'Portal em construção' no corpo: 1
/vitrine                   307 http://localhost:3001/
/sobre                     307 http://localhost:3001/
/processo-seletivo         307 http://localhost:3001/
/endereco-que-nao-existe   307 http://localhost:3001/
/logo-liacup-256.png (curl -sI)
HTTP/1.1 200 OK
Content-Type: image/png
== 3000 (SITE_PUBLICADO=true) ==
/                          200   | 'Portal em construção' no corpo: 1
/vitrine                   200   | 'Portal em construção' no corpo: 0
/sobre                     404
/endereco-que-nao-existe   404
/em-construcao             404
```

Além das 12: `/sobre?x=1` na 3001 dá `307 http://localhost:3001/` (busca descartada);
`/_next/image?url=%2Flogo-liacup-256.png&w=384&q=75` dá `200 image/png`; o CSS de `/_next/static`
dá 200; `/qualquer.png` dá 404 (D4). Servidores derrubados com `taskkill`; `netstat` sem nada em
3000 e 3001.

**2.1.** `npx playwright test tests/e2e/pagina-inicial.spec.ts tests/e2e/vitrine.spec.ts`: antes
84 passed (35 + 49), código 0; depois 84 passed (35 + 49), código 0.
`grep -c "Creating an optimized production build"` na saída: 1. A ordem na saída: build e
`Ready` do `[publicado-3000]`, depois `next start -p 3001` e `Ready` do `[nao-publicado-3001]`.
`git diff --exit-code --stat .github/ lighthouserc.json package.json package-lock.json`: código 0.
Para contar a compilação, os dois servidores têm `stdout: 'pipe'`: antes, o Playwright descartava
a saída do build e o `grep` dava 0.

**3.1.** `grep -n "^SITE_PUBLICADO=true$" .env.example`: `28:SITE_PUBLICADO=true`. **3.2.**
`formatar:check` 0; `grep -c`: `SITE_PUBLICADO` 8, `nova implanta` 3, `Na F00 nenhuma variavel` 0.

**Desvios, todos dentro dos arquivos do D10:** (1) no `.env.example`, a frase do topo "Na F00
nenhuma destas variaveis e usada ainda" virou "era usada", com uma linha dizendo que
`SITE_PUBLICADO` é usada, porque o bloco novo a tornava falsa; (2) no README, duas frases que esta
change torna falsas ganharam complemento: "Como publicar" (o que entra na `main` vai ao ar, mas
atrás do interruptor) e a vitrine "Em produção, o mesmo endereço" (só depois do lançamento).
Nenhum texto de tela mudou.

**Ajuste da revisão.** No README, seção "Como testar", a frase "a porta 3000 precisa estar livre ou
com o site publicado, e a 3001 livre ou não publicada" virou "as portas 3000 e 3001 precisam estar
livres: feche o `npm run dev` e qualquer `npm start`", com o motivo: um servidor já aberto é
reaproveitado, o site não é compilado de novo, e o teste pode passar contra código velho.
`formatar:check` 0; `grep -n "precisa" README.md` mostra a linha 66. Nenhum outro arquivo tocado.

### Ajuste da Q6

Decisão do Gabriel, Q6 (a). Só `src/proxy.ts`: o `config.matcher` troca a regra genérica de
extensão por exatamente 9 extensões, e os comentários do topo e do matcher explicam por que `.rsc`,
`.html`, `.txt` e `.xml` passam pelo interruptor e que um PDF em `public/` leva 307 com o site não
publicado. A lógica da função `proxy` não mudou.

```diff
-  matcher: ['/((?!_next/static|_next/image|.*\\.[^/]+$).*)'],
+  matcher: [
+    '/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff|woff2)$).*)',
+  ],
```

**Maiúsculas.** O Next compila o matcher em `.next/server/functions-config-manifest.json` como
`"regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next\\/static|_next\\/image|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff|woff2)$).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$"`,
e o `getMiddlewareRouteMatcher` faz `new RegExp(matcher.regexp)`, sem a flag `i`. Então a
comparação diferencia maiúsculas: `/LOGO-LIACUP-256.PNG` passa pelo interruptor e leva 307 (falha
fechada), medido abaixo. Está no comentário.

`npm run build` código 0 (rotas `/`, `/_not-found`, `/em-construcao`, `/vitrine` estáticas,
`ƒ Proxy (Middleware)`). Saída literal (`%{http_code} %{redirect_url} %{content_type}`, sem seguir).
O CSS e a fonte saíram do HTML da raiz da 3001:

```
== 3001 (SITE_PUBLICADO=false) ==
/vitrine.rsc                                            307 http://localhost:3001/
/robots.txt                                             307 http://localhost:3001/
/sitemap.xml                                            307 http://localhost:3001/
/vitrine.html                                           307 http://localhost:3001/
/logo-liacup-256.png                                    200  image/png
/_next/image?url=%2Flogo-liacup-256.png&w=256&q=75      200  image/png
/                                                       200  text/html; charset=utf-8
/_next/static/chunks/29oggh5-taso9.css                  200  text/css; charset=UTF-8
/_next/static/media/12b67b3c78c4367a-s.p.0dhaz04vjmr2w.woff2 200  font/woff2
/LOGO-LIACUP-256.PNG                                    307 http://localhost:3001/
/manual.pdf                                             307 http://localhost:3001/
== 3000 (SITE_PUBLICADO=true) ==
/vitrine                                                200  text/html; charset=utf-8
/em-construcao                                          404  text/html; charset=utf-8
/vitrine.rsc                                            404  text/x-component
```

Servidores derrubados com `taskkill //T //F`; `netstat` sem nada escutando em 3000 e 3001.
`npm run verificar` código 0 (270 arquivos rastreados, 0 artefatos; 61 arquivos de `src/`, 0 tokens
à mão; 178 arquivos do build, 0 ocorrências da chave) · `npm test` código 0, `Tests  80 passed (80)`
em 10 arquivos, `Valores de SITE_PUBLICADO conferidos: 9` · `npx playwright test` código 0,
`147 passed`. Testes e design não foram tocados.

## dev-dados

- **Migrações:** `<números>` · **tabelas:** `<nomes>`
- **Acesso por linha:** `banco:rls` <código> · políticas: <n permissões, n recusas>
- **Tipos:** `banco:tipos:check` <código>
- **Incompleto:** <o que, ou "nada">

## guardiao-visual

- **Comparado:** 1 página (a raiz `/`, modo não publicado) em 2 larguras (390 e 1280), antes ×
  depois desta change. Com o protótipo, não: `prototipo/prints/` não tem a página em construção,
  então não há gabarito para ela
- **Diferenças:** 0 encontradas · 0 justificadas · 0 não explicadas (RP-14)
- **Cada diferença, uma linha:** nenhuma; 0 pixels diferentes nas duas larguras
- **Não comparado:** `/em-construcao` e as demais rotas, porque a 4.1 fotografa só a raiz (todo
  outro endereço redireciona para ela); a raiz contra o protótipo, porque não há print dela lá

### 1.1 · prints de antes

Na `main` (HEAD `73c7d89`), sem nenhuma mudança no código, sem `SITE_PUBLICADO`. Script
temporário fora do repositório, no scratchpad da sessão, com `@playwright/test` (Chromium) do
projeto; espera a logo (`img.complete` e `naturalWidth > 0`) e `document.fonts.ready`, depois
`screenshot({ fullPage: true })`, janela de 390 × 844 e 1280 × 844.

| Comando                                                   | Código de saída | Resultado                                                 |
| --------------------------------------------------------- | --------------- | --------------------------------------------------------- |
| `npm run build`                                           | 0               | rotas `/`, `/_not-found` e `/vitrine`, todas estáticas    |
| `npm run start -- -p 3100` (segundo plano)                | 1, ao ser morto | `curl` em `/` deu `200` antes dos prints                  |
| `node print-antes.mjs <url> <saída390> <saída1280> <repo>` | 0               | `/` respondeu `200` nas duas larguras                     |
| `node -e` lendo os bytes 16 a 19 e 20 a 23 de cada PNG    | 0               | `antes-raiz-390.png` 390 × 844 · `antes-raiz-1280.png` 1280 × 844 |
| `taskkill //PID 51928 //T //F`                            | 0               | servidor derrubado                                        |
| `netstat -ano \| grep ":3100 " \| grep LISTENING`         | 1               | nada escutando na 3100                                    |
| `curl --max-time 5 http://localhost:3100/`                | 7               | conexão recusada: o servidor caiu                         |

- **Arquivos:** `prints/antes-raiz-390.png` (66 580 bytes) e `prints/antes-raiz-1280.png`
  (71 533 bytes)
- **Altura igual à da janela (844):** a página cabe inteira na tela nas duas larguras, então o
  print de página inteira tem a altura da janela. Não é corte: o rodapé aparece nos dois
- **Incompleto:** nada

### 4.1 · antes e depois

Árvore de trabalho com a change implementada (HEAD `73c7d89` + arquivos não commitados), servidor
de produção com `SITE_PUBLICADO=false` no ambiente do processo. Mesmo script da 1.1
(`print-antes.mjs`, no scratchpad, fora do repositório). A comparação desenha cada PNG num
`canvas` do Chromium do `@playwright/test` e compara RGBA pixel a pixel. Nenhuma dependência nova.

| Comando                                                        | Código de saída | Resultado                                                         |
| -------------------------------------------------------------- | --------------- | ----------------------------------------------------------------- |
| `npm run build`                                                | 0               | `/`, `/_not-found`, `/em-construcao`, `/vitrine` estáticas + `ƒ Proxy (Middleware)` |
| `SITE_PUBLICADO=false npm run start -- -p 3100` (segundo plano) | 1, ao ser morto | `curl` em `/` 200; `/sobre` 307 para `/`: modo não publicado      |
| `node print-antes.mjs <url> <saída390> <saída1280> <repo>`     | 0               | `/` respondeu 200 nas duas larguras                               |
| `node -e` lendo os bytes 16 a 23 de cada PNG                   | 0               | antes e depois: 390 × 844 e 1280 × 844; mesmo tamanho em bytes (66 580 e 71 533) |
| `node comparar-4.1.mjs <prints> <repo>`                        | 0               | `390px antes 390x844 depois 390x844 pixels diferentes: 0 de 329160` · `1280px antes 1280x844 depois 1280x844 pixels diferentes: 0 de 1080320` |
| `cmp antes-raiz-<n>.png depois-raiz-<n>.png`, nas duas         | 0 e 0           | arquivos idênticos byte a byte                                    |
| `node lado-a-lado-4.1.mjs <prints> <repo>`                     | 0               | `lado-a-lado-raiz-390.png` e `lado-a-lado-raiz-1280.png`          |
| `taskkill //PID 55316 //T //F`                                 | 0               | servidor derrubado                                                |
| `netstat -ano \| grep ":3100 " \| grep LISTENING`              | 1               | nada escutando na 3100                                            |
| `curl --max-time 5 http://localhost:3100/`                     | 7               | conexão recusada: o servidor caiu                                 |

- **O comparador acusa diferença de verdade (vermelho, só no scratchpad):** com um print da mesma
  raiz e `h1{letter-spacing:1px}` injetado, `comparar-4.1.mjs` deu código 1 e
  `pixels diferentes: 46734 de 329160` em 390. O zero acima não é um comparador cego
- **Arquivos:** `prints/depois-raiz-390.png`, `prints/depois-raiz-1280.png`,
  `prints/lado-a-lado-raiz-390.png`, `prints/lado-a-lado-raiz-1280.png`
- **Diferenças (RP-14):** encontradas 0 · justificadas 0 · não explicadas 0. Nenhuma linha na
  tabela de casos
- **Escopo:** `git status --porcelain` igual ao do início da passagem; nada em `src/`, nada no Git
- **Incompleto:** nada

## qa-acessibilidade

Tarefas 2.2, 2.3 e 2.4. Arquivo: A `tests/e2e/interruptor.spec.ts` (9 testes, D6 itens 1 a 7).

- **Cobertura:** a raiz não publicada (3001) × 7 larguras (360, 390, 430, 480, 768, 1024, 1280),
  em axe e rolagem; as respostas de 8 endereços nos dois modos × 7 larguras
- **Medições:** axe 0 violações em 7 de 7 larguras (20 regras aplicadas em cada) · rolagem
  horizontal 0 larguras com defeito em 7 medidas (`scrollWidth` igual a `clientWidth` em todas) ·
  `rotas verificadas: 3` no modo não publicado e 3 no publicado, em 7 de 7 larguras ·
  `respostas conferidas: 4` em 7 de 7 larguras · alvos: não medidos nesta change · foco: não
  medido nesta change
- **Verificação nova demonstrada falhando:** o spec inteiro, nas três demonstrações abaixo
- **Defeitos:** nenhum · **sem cobertura:** alvos de toque e foco visível da raiz não publicada não
  foram medidos por este spec (D9: RP-04 não se aplica; a página e os links são os mesmos de antes).
  `/em-construcao` e as páginas depois do redirecionamento não passaram por axe nem rolagem, porque
  o D6 mede só a raiz

**Comandos.** `prettier --check` e `eslint` do spec: 0 · `tsc --noEmit`: 0 ·
`CI=1 npx playwright test tests/e2e/interruptor.spec.ts`: 0, `63 passed` (9 × 7) · `npx playwright
test` inteiro: **antes 84 passed**, código 0 (35 + 49); **depois 147 passed**, código 0 (35 + 49 +
63). Em toda rodada, nada escutando em 3000 e 3001 antes (`netstat`), e
`grep -c "Creating an optimized production build"` igual a 1: o build rodou de novo.

Primeira resposta, pedido do Gabriel (saída de cada largura, igual nas 7):

```
[largura-360] respostas conferidas: 4
  nao publicado /sobre recebeu 307, Location /
  nao publicado /endereco-que-nao-existe recebeu 307, Location /
  publicado /sobre recebeu 404, Location ausente
  publicado /endereco-que-nao-existe recebeu 404, Location ausente
```

**2.4 · RP-12.** `src/proxy.ts` alterado só durante cada demonstração; depois de cada uma,
`sha1sum` deu `3fdf70edf05c3cf6b9d9527129bb7d7dd7ccd313`. `git status --porcelain src/` no fim
igual ao do início (8 linhas).

1. **Interceptador apagado** (movido para o scratchpad). Vermelho: código 1, `21 failed`,
   `42 passed`; `rotas verificadas: 0 · modo nao publicado` e `respostas conferidas: 2` nas 7. Os
   itens 1, 6 e 7 falham; o 6 também, porque o 404 de `/em-construcao` mora no interceptador.

   ```
   Error: rotas com defeito no modo nao publicado:
   /vitrine recebeu 200, Location ausente (esperado 307 para /)
   /sobre recebeu 404, Location ausente (esperado 307 para /)
   /processo-seletivo recebeu 404, Location ausente (esperado 307 para /)
   ```

   Restaurado: código 0, `63 passed`.

2. **Interceptador ignorando a variável** (`if (false && sitePublicado(...))`). Vermelho: código 1,
   `21 failed`, `42 passed`; `rotas verificadas: 0 · modo publicado` nas 7. Os itens 5, 6 e 7
   falham.

   ```
   Error: rotas com defeito no modo publicado:
   /vitrine recebeu 307, Location / (esperado 200)
   /sobre recebeu 307, Location / (esperado sem redirecionamento)
   ```

   Restaurado: código 0, `63 passed`.

3. **Regra do 404 de `/em-construcao` removida** (o `if` e a constante `CAMINHO_SEM_PAGINA`, que só
   ele usava). Vermelho: código 1, `7 failed`, `56 passed`; só o item 6, nas 7 larguras.

   ```
   Error: /em-construcao recebeu 200, Location ausente (esperado 404 sem Location)
   ```

   Restaurada: código 0, `63 passed`.

   Primeira tentativa, descartada: apagar só o `if` deixou a constante sem uso, e o build parou em
   `error TS6133: 'CAMINHO_SEM_PAGINA' is declared but its value is never read`. Vermelho pelo
   motivo errado, sem teste rodado; não conta como demonstração.

### Q6 · RP-12 do filtro

Item 4 do D6 ampliado no mesmo teste (o total de testes não muda): `/logo-liacup-256.png` 200, sem
`Location`, `image/*`; `/vitrine.rsc` e `/robots.txt` 307 para `/`, sem seguir redirecionamento.
Contador `arquivos conferidos: N`. `prettier --check`, `eslint` e `tsc --noEmit`: 0. Spec com sha1
`743aeea9d2caedbfbb172893e43ada3dc52aaaa2`. Em toda rodada: nada escutando em 3000 e 3001 antes
(`netstat`), e uma linha `Creating an optimized production build` mais uma `Compiled successfully`
na saída.

| Rodada                                       | `src/proxy.ts` (sha1) | Código | Totais                    | `arquivos conferidos` |
| -------------------------------------------- | --------------------- | ------ | ------------------------- | --------------------- |
| Verde, filtro novo                           | `9e5c262…`            | 0      | 63 passed                 | 3 em 7 de 7 larguras  |
| Vermelho, filtro antigo                      | `3fdf70e…`            | 1      | 7 failed, 56 passed       | 1 em 7 de 7 larguras  |
| Verde, filtro novo restaurado                | `9e5c262…`            | 0      | 63 passed                 | 3 em 7 de 7 larguras  |
| `CI=1 npx playwright test` inteiro, no fim   | `9e5c262…`            | 0      | **147 passed** (antes 147) | —                     |

Vermelho: só o item 4 falha, nas 7 larguras (também na nova tentativa do CI); a logo segue verde.

```
Error: arquivos com defeito no modo nao publicado:
/vitrine.rsc recebeu 404, Location ausente (esperado 307 para /)
/robots.txt recebeu 404, Location ausente (esperado 307 para /)
```

Restaurado, `sha1sum src/proxy.ts` deu `9e5c2620d352349ed5cc4b951ea69aaf67b00a6c`. Observação: com o
filtro antigo, os dois endereços escaparam do interruptor, mas responderam 404, sem conteúdo; neste
build não houve vazamento por eles. O teste prova o filtro, não um vazamento.

## revisor

_Transcrito pelo líder técnico: o revisor não tem ferramenta de escrita._

- **Veredito:** aprovado com ressalva
- **Conferiu:** 12 arquivos do diff e 17 de contexto · 4 critérios da proposta, 4 itens do briefing
  e 18 cenários · 16 regras
- **Achados:** nenhum bloqueia.
  - Deveria corrigir: `src/proxy.ts` (matcher). A regra de extensão deixa passar `/vitrine.rsc`
    e outros caminhos com extensão, que poderiam entregar a vitrine com o site não publicado. Não
    foi medido. Vai como Q6 no Portão 2.
  - Deveria corrigir: `README.md`. A frase das portas permitia reaproveitar um `npm run dev`
    aberto. **Corrigido** pelo `dev-frontend`.
  - Deveria corrigir: o cenário "Uma compilação, dois modos" diz "sem a variável", e nenhuma
    execução tinha usado a variável ausente. **Medido** pelo líder técnico, abaixo.
  - Observação: `playwright.config.ts`. A checagem "nenhum domínio externo" de
    `pagina-inicial.spec.ts` passou a rodar na raiz publicada. A raiz não publicada é o mesmo
    componente, com print idêntico byte a byte (4.1).
  - Observação: o e2e confere a imagem, mas não estilos nem fontes. Ficam cobertos pelo print da
    4.1, com 0 pixels diferentes.
  - Observação: `src/proxy.ts`. O parâmetro `request` está em inglês, e `sitePublicado` é booleano
    sem verbo, nome fixado no D2.
  - Observação: `README.md`. A frase sobre "se ela é segredo" não vale para `EMAIL_*`. Já era
    assim antes da change.
  - Observação: `docs/PADROES-DE-CODIGO.md` §1 não registra `src/proxy.ts`. Fora do escopo.
- **Não conseguiu conferir:** nenhum comando foi rodado pelo revisor, então os números dos
  relatórios são alegação para ele. Também não conferiu o comportamento da Vercel com `.rsc` e
  `.html`, nem os endereços internos do `next dev`.

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum.

- **Arquivos fora do escopo, por agente:** nenhum em nenhuma passagem. O `dev-frontend` ficou nos
  10 arquivos nominais do D10 (Q5 = a). A alteração temporária de `src/proxy.ts` pelo
  `qa-acessibilidade` foi autorizada só para a 2.4 e desfeita, com sha1
  `3fdf70edf05c3cf6b9d9527129bb7d7dd7ccd313` antes e depois.
- **CSS movido (1.3):** `git rev-parse 'HEAD:src/app/(site)/page.module.css'` e
  `git hash-object src/componentes/layout/PaginaEmConstrucao.module.css` dão o mesmo blob,
  `baceb25`. É uma renomeação com 100% de semelhança.
- **4.2 Lighthouse, sem `SITE_PUBLICADO` e sem `.env.local`:** `npm run build` código 0,
  `npm run test:desempenho` código 0. Nas 3 execuções, desempenho 100 e acessibilidade 100. O
  elemento de LCP é a logo da página em construção, então foi medido o modo não publicado.
- **4.3:** `npm run verificar` código 0 (270 arquivos rastreados e 0 artefatos indevidos; 61
  arquivos de `src/` e 0 tokens escritos à mão; 178 arquivos do build e 0 ocorrências da chave).
  `npm test`: 80 de 80 em 10 arquivos, com `Valores de SITE_PUBLICADO conferidos: 9`. Dependências
  diretas: 22. `git diff --exit-code` de `package.json`, `package-lock.json`, `lighthouserc.json`,
  `.github/` e `tokens.css`: código 0.
- **Medições da revisão, com `env -u SITE_PUBLICADO npx next start -p 3100` (variável ausente):**
  - `/` deu 200;
  - `/vitrine` deu 307 para `/`, inclusive com o cabeçalho `RSC: 1`;
  - `/vitrine.rsc`, `/vitrine.html`, `/vitrine.meta`, `/vitrine.segments/_tree.segment.rsc`,
    `/index.rsc` e `/em-construcao.rsc` deram 404, e nenhum trouxe "Vitrine do design";
  - `/qualquer.png` deu 404.

  No `next start` local não há vazamento. **Não medido na Vercel.**
- **Prints da change, que não entram no controle de versão (RP-13):** são saída de um script, e a
  única exceção registrada é `prototipo/prints/`. Os dois lado a lado vão anexados ao PR. A pasta
  `prints/` sai do repositório antes do commit, pelos comandos da entrega do Portão 2.
