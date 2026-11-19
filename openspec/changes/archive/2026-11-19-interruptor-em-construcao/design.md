# Design — interruptor "em construção"

## Context

Ver `proposal.md`, seção Why. Estado medido pelo líder técnico na `main` `73c7d89`, e lido de novo
pelo especificador:

| O que | Situação |
|---|---|
| Rotas | Só duas: `/`, que é a página em construção (`src/app/(site)/page.tsx`), e `/vitrine` (grupo `(interno)`, com `robots: noindex`). Qualquer outra responde o 404 padrão |
| Página em construção | Logo `/logo-liacup-256.png` pelo otimizador de imagem, `h1` "Portal em construção", subtítulo com o nome da liga, `LinksDeContato`, `Rodape`, estilo em `page.module.css` |
| `public/` | Um arquivo só: `logo-liacup-256.png`. Não há favicon nem `robots.txt` |
| Next.js | 16.3.1. A interceptação antes da rota se chama `proxy` (antigo `middleware`) e roda em Node.js por padrão. Variável sem prefixo `NEXT_PUBLIC_`, lida no servidor, é lida em tempo de execução |
| `playwright.config.ts` | 7 projetos de largura, `baseURL` `localhost:3000`, um `webServer` com `npm run build && npm run start`, `reuseExistingServer: !CI` |
| Specs e2e | `pagina-inicial.spec.ts` (raiz: `h1`, logo, links, axe, rolagem, nenhum domínio externo) e `vitrine.spec.ts` (precisa do site publicado) |
| CI | `npm run build`, depois `npx playwright test` sem variável, depois `lhci autorun`, que sobe `npm run start` e mede `/` |
| Testes de unidade | `vitest run` (`npm test`) |
| Dependências diretas | 22 (4 + 18), segundo o `package.json` |
| Camadas | `componentes/layout` pode importar de `ui`, `padroes` e `lib/utils`; `lib` não importa de `componentes` nem de `app` (`PADROES-DE-CODIGO.md` §1) |
| `.env.example` e README | Nenhuma variável usada ainda; o README diz "Na F00 nenhuma variavel e usada ainda", frase que esta change torna falsa |

## Goals / Non-Goals

**Goals:**

- Produção sem a variável: um endereço só no ar, a raiz, com a página em construção. Todo outro
  endereço de página leva a ela.
- Prévia com `true`: o site como ele é na `main`, sem resto da página em construção fora da raiz.
- Uma compilação serve os dois modos, e os dois são testados a cada alteração, sem mudar o CI.
- A raiz fica igual: mesmos elementos, mesmo texto, mesmo print. Os nomes de classe gerados podem
  mudar, porque o arquivo de estilo muda de lugar, e isso não é diferença visível.

A spec cita `SITE_PUBLICADO`, `true`, os status e as rotas porque são o contrato da capacidade: é
por eles que o Gabriel configura a Vercel e que o teste confere o comportamento. Não são detalhe
interno.

**Non-Goals:**

- Nenhuma página nova visível, nenhum texto novo, nenhum token novo.
- Nenhuma alteração em `.github/`, `lighthouserc.json` ou verificação existente.
- Metadados, `canonical`, sitemap, robots e 404 própria (`lancamento-r1`).

## Decisions

### D1 — Um interceptador antes da rota

Um `proxy` (convenção do Next 16), no runtime padrão (Node.js), lê `process.env.SITE_PUBLICADO` a
cada pedido e decide pela tabela abaixo. O que não está na tabela não existe: a decisão é por
caminho, e não por método.

| Pedido | Não publicado | Publicado |
|---|---|---|
| Recurso compilado, imagem ou fonte (D4) | Passa | Passa |
| `/` | **Reescrito** para `/em-construcao`: 200, endereço continua `/` | Passa: a raiz desenha a página em construção diretamente (Q1) |
| `/em-construcao` | Passa: 200 | **Reescrito** para um endereço sem página: 404 (D3) |
| Qualquer outro (`/vitrine`, `/sobre`, `/endereco-que-nao-existe`, `/api/...`) | **307** para `/` | Passa |

**307, com `/` como destino e sem a busca original.** É o redirecionamento temporário padrão do Next
(`NextResponse.redirect`), e o Gabriel decidiu o temporário porque as páginas vão existir (Q2). O
destino é montado a partir do endereço do pedido, então o cabeçalho `Location` pode vir absoluto.
O e2e compara só o caminho. A busca (`?x=1`) não é levada, porque a raiz não usa nenhuma.

**`/api/...` também recebe 307.** É falha fechada: hoje não há nenhuma rota de API, e a primeira
que precisar funcionar em produção antes da R1 revê esta regra na própria change.

**Alternativa descartada: decidir no layout raiz.** As páginas estáticas são geradas na
compilação, e o layout leria a variável nesse momento, não na hora do pedido. Isso quebraria a
regra "uma compilação, dois modos", ou obrigaria a tornar todas as páginas dinâmicas, com custo no
Lighthouse. O interceptador roda a cada pedido e não muda como as páginas são geradas.

### D2 — O valor exato, numa função pura com teste de unidade

Uma função pura, `sitePublicado(valor)`, recebe o valor da variável e devolve `true` só para
`valor === 'true'`. Sem `trim` e sem caixa baixa: `TRUE`, ` true`, `1`, `sim`, vazio e ausente dão
`false`. Falha fechada: um erro de digitação na Vercel esconde o site, não o expõe.

Um teste de unidade cobre os casos do cenário "Valores parecidos não publicam", mais o `true`, e
imprime quantos casos conferiu (9). RP-12: trocar a comparação por uma insensível a caixa deixa o
teste vermelho, nomeando `TRUE` e `True`; desfeita a troca, verde.

### D3 — A página em construção mora num lugar só (Q1 e Q3)

O conteúdo de hoje de `src/app/(site)/page.tsx` e do `page.module.css` dele passa, **sem mudar a
marcação nem o estilo**, para um componente único, `PaginaEmConstrucao`, em `componentes/layout/`,
porque ele compõe `LinksDeContato` e `Rodape`, que moram ali. Ele não conhece rota nem variável.
Dois lugares o usam:

- **a raiz**, que continua sendo a página em construção até a `pagina-inicial` (Q1 = a);
- **a rota própria `/em-construcao`**, que é o destino da reescrita da raiz no modo não publicado
  (Q3 = c).

Por que a raiz não publicada é reescrita para a rota própria, em vez de passar direto: quando a
`pagina-inicial` trocar a raiz, o interruptor continua mostrando a página em construção em
produção sem ninguém lembrar de mexer nele. Se a raiz passasse direto, a página inicial nova iria
ao ar assim que entrasse na `main`.

**O 404 de `/em-construcao` no modo publicado** sai do próprio interceptador: ele reescreve o
pedido para um caminho reservado que não tem página, sem extensão e fora de `/_next/`, e o portal
responde a página não encontrada normal, com status 404. Alternativas descartadas:

- a página `/em-construcao` ler a variável e chamar `notFound()`. Ela deixaria de ser estática, e
  é ela que responde a raiz da produção, medida pelo Lighthouse;
- o interceptador devolver uma resposta 404 vazia. O visitante veria uma tela em branco, diferente
  do 404 de qualquer outro endereço.

**A rota própria não leva `noindex`.** Em produção, o que ela entrega é a resposta da raiz, e um
`noindex` ali tiraria o site do buscador.

### D4 — O que passa sem desvio (Q6 = a)

Nos dois modos, o interceptador **não** toca em só três grupos de caminho:

- os recursos compilados (`/_next/static/...`);
- o otimizador de imagem (`/_next/image...`), por onde a logo passa;
- os arquivos com extensão de imagem ou de fonte, e só estas 9: `png`, `jpg`, `jpeg`, `webp`,
  `avif`, `svg`, `ico`, `woff`, `woff2` (`/logo-liacup-256.png`, `/favicon.ico` quando existir).

**Todo o resto passa pelo interruptor**, inclusive caminhos terminados em `.rsc`, `.html`, `.txt`
e `.xml`.

**Motivo.** O Next guarda o conteúdo das páginas compiladas em arquivos `.rsc`, `.html` e `.meta`.
Se um desses for servido por um endereço próprio, como `/vitrine.rsc`, ele entrega a página sem
passar pelo interruptor, e a vitrine apareceria com o site não publicado. No `next start` local, o
líder técnico mediu 404 nesses endereços; **na Vercel, isso não foi medido**. A lista fechada não
depende dessa medição: o que não é imagem nem fonte é tratado como endereço de página, e a falha é
fechada.

**Alternativa descartada: a regra genérica de extensão** (passar qualquer caminho cujo último
trecho tenha extensão de arquivo), que era a primeira versão deste D4. Ela deixava passar os
`.rsc`, `.html` e `.meta` das páginas compiladas, e a segurança do modo não publicado dependeria de
como cada hospedagem serve esses arquivos, o que só foi medido no `next start` local. A página em
construção depende de imagem, fonte, estilo e script, e os dois últimos já vêm de
`/_next/static/`; nada mais precisa passar.

**Consequências aceitas:**

- `/robots.txt` e `/sitemap.xml` recebem 307 para a raiz enquanto o site não estiver publicado. Eles
  não existem hoje; a `lancamento-r1` os cria e revê esta regra na própria change.
- Um arquivo de outra extensão posto em `public/`, como um PDF, recebe 307 enquanto o site não
  estiver publicado. Quem precisar dele antes da R1 revê esta lista na própria change.
- Extensão em maiúsculas (`/LOGO.PNG`): a comparação diferencia maiúsculas, então, com o site não
  publicado, o endereço recebe 307 para `/` (falha fechada, medido pelo `dev-frontend`). Os
  arquivos de `public/` usam extensão em minúsculas.
- Com o site não publicado, uma imagem que não existe (`/qualquer.png`) responde 404, e não 307.
  Imagem não é endereço de página.

### D5 — Uma compilação, dois servidores no e2e, sem mudar o CI

O `webServer` do `playwright.config.ts` vira uma lista de dois, nesta ordem:

| Porta | Modo | Comando | `env` |
|---|---|---|---|
| 3000 | publicado | `npm run build && npm run start` | `SITE_PUBLICADO=true` |
| 3001 | não publicado | `npm run start -- -p 3001` | `SITE_PUBLICADO=false` |

- A porta 3000 fica publicada para que `pagina-inicial.spec.ts` e `vitrine.spec.ts` rodem sem
  nenhuma mudança. A raiz publicada é a mesma página (Q1 = a), então o spec da raiz continua
  valendo.
- O segundo servidor só inicia: usa a compilação do primeiro. O Playwright sobe os servidores na
  ordem da lista e espera cada um responder antes do próximo. A tarefa 2.1 confere isso pela saída,
  com uma compilação só.
- **`false` explícito, e não variável ausente**, no servidor não publicado. O `next start` lê o
  `.env.local` de quem roda, e quem tiver `SITE_PUBLICADO=true` ali (Q4) veria o servidor 3001
  publicado. O valor do processo tem precedência sobre o arquivo.
- **O CI não muda.** Ele já roda `npx playwright test`, que agora sobe os dois servidores. O
  Lighthouse sobe `npm run start` sem a variável, ou seja, mede `/` no modo não publicado, que é o
  que a produção mostra (RP-06). Na máquina de quem tem `.env.local` com `true`, o Lighthouse mede
  o modo publicado. A raiz é a mesma página até a `pagina-inicial`.

### D6 — O spec novo, nas sete larguras

Um spec novo, `tests/e2e/interruptor.spec.ts`. As primeiras respostas são pedidas **sem seguir
redirecionamento** (`maxRedirects: 0`). O destino é comparado pelo caminho, com
`new URL(location, origem).pathname`, porque o `Location` pode vir absoluto.

**Não publicado** (endereço absoluto `http://localhost:3001`):

1. **As três rotas:** para `/vitrine`, `/sobre` e `/processo-seletivo`, a primeira resposta é 307
   com caminho de destino `/`. Seguido o redirecionamento, o endereço final é `/`, o `h1` é "Portal
   em construção", a logo está carregada (largura natural maior que zero, prova de que o D4 deixou
   a imagem passar) e os dois links de contato têm os endereços certos. Imprime
   `[largura-N] rotas verificadas: 3`.
2. **A raiz:** 200, o endereço continua `/`, os mesmos itens de conteúdo, axe com zero violações e
   nenhuma rolagem horizontal. Como todo endereço leva à raiz, ela é a única página que o visitante
   recebe, e é nela que o RP-05 e o RP-07 se medem.
3. **`/em-construcao`:** 200, sem `Location`, `h1` "Portal em construção".
4. **Arquivo direto:** `/logo-liacup-256.png` responde 200, sem `Location`, com tipo de conteúdo de
   imagem. `/vitrine.rsc` e `/robots.txt` respondem 307, com caminho de destino `/` no `Location`
   (Q6 = a, D4).

**Publicado** (`baseURL`):

5. **As três rotas:** `/vitrine` mostra o `h1` "Vitrine do design system"; em `/sobre` e
   `/processo-seletivo`, o `h1` não é "Portal em construção". Imprime
   `[largura-N] rotas verificadas: 3`.
6. **`/em-construcao`:** 404, sem `Location`.

**Primeira resposta nos dois modos (pedido do Gabriel):**

7. `/sobre` e `/endereco-que-nao-existe`. No não publicado, 307 com caminho de destino `/`. No
   publicado, 404 e sem `Location`. Imprime `[largura-N] respostas conferidas: 4`.

**Consequência do item 7, aceita:** quando a `pagina-sobre-e-equipe` criar `/sobre`, o 404 do modo
publicado deixa de valer, e o teste fica vermelho. Essa change atualiza o teste, trocando `/sobre`
por 200 ou por outra rota que ainda não exista. O endereço inexistente mantém a conferência
permanente.

O contador é por rota **verificada até o fim**, não por rota tentada. Rota que falha não conta, e a
mensagem do teste nomeia a rota e o status que recebeu.

**Por que nas sete larguras, e não numa só:** a rolagem horizontal da raiz no modo que a produção
mostra se mede por largura (RP-05). Rodar o resto numa largura só exigiria filtro por projeto na
configuração, mais engenhoso que o padrão, para poupar poucos segundos de respostas pequenas.

### D7 — RP-12: cinco demonstrações de falha

Cada uma tem duas execuções registradas no `relatorio.md`, a vermelha e a verde:

1. **Valor exato** (D2): com a comparação insensível a caixa, o teste de unidade fica vermelho.
2. **Interruptor removido** (critério do briefing): com o interceptador apagado temporariamente, o
   spec do modo não publicado fica vermelho. `/vitrine` responde 200 em vez de 307, e `/sobre`,
   `/processo-seletivo` e `/endereco-que-nao-existe` respondem 404 em vez de 307. Restaurado,
   verde.
3. **Interruptor sempre desligado:** com o interceptador ignorando a variável, o spec do modo
   publicado fica vermelho. `/vitrine` responde 307 em vez de 200, e `/sobre` 307 em vez de 404.
   Restaurado, verde.
4. **Regra do 404 de `/em-construcao` removida:** o item 6 do D6 fica vermelho, com 200 em vez de
   404. Restaurada, verde.
5. **Matcher antigo** (Q6 = a): com a regra genérica de extensão de volta no lugar da lista do D4,
   o item 4 do D6 fica vermelho em `/vitrine.rsc` e `/robots.txt`, que respondem sem o 307 para a
   raiz. Com a lista do D4, verde. `/logo-liacup-256.png` fica verde nas duas execuções.

### D8 — Documentação

- **`.env.example` (Q4 = a):** um bloco próprio, fora do bloco do Supabase, com
  `SITE_PUBLICADO=true`. O comentário diz que a variável não é segredo (RP-10), que só `true`
  publica, que o valor deste arquivo vale só para a máquina de quem o copia, que em produção ela
  fica **ausente** até a R1 e que nas prévias é `true`.
- **README, seção "Variaveis de ambiente":** a frase "Na F00 nenhuma variavel e usada ainda" é
  corrigida, porque deixa de ser verdade. A seção explica a variável em linguagem de quem não
  programa:
  - o que ela faz, e o que o visitante vê em cada modo, inclusive o redirecionamento para a raiz;
  - Production sem a variável e Preview com `true`, na tela de variáveis do projeto na Vercel;
  - que **mudar a variável só vale depois de uma nova implantação**, e como pedir uma;
  - lançar a R1 é pôr `true` em Production e implantar de novo, e voltar atrás é apagar e
    implantar de novo;
  - como ver o site na própria máquina (`.env.local`).
- **README, seção "Como testar":** uma linha dizendo que o e2e sobe dois servidores, nas portas
  3000 e 3001, um em cada modo, e que a 3000 precisa estar livre ou publicada.

O passo a passo da Vercel **para o Gabriel desta vez** é entregue pelo líder técnico no Portão 2.
O README é o passo a passo permanente.

### D9 — Requisitos permanentes

| RP | Aplica? | Como |
|---|---|---|
| RP-01 | Sim | Nenhuma dependência nova: 22 antes e depois, `package-lock.json` sem diferença |
| RP-02, RP-03 | Não se aplica | Nenhum valor de estilo novo; o CSS só muda de lugar, com o mesmo conteúdo. `tokens.css` sem diferença |
| RP-04 | Não se aplica | A página em construção não tem alvo novo, e os links de contato são os mesmos já medidos |
| RP-05, RP-07 | Sim | Na raiz não publicada, nas sete larguras (D6, item 2) |
| RP-06 | Sim | O Lighthouse do CI mede `/` no modo não publicado, sem mudança; números no relatório |
| RP-08, RP-14 | Sim | Lado a lado da raiz antes (`main`) e depois (não publicada) em 390 e 1280, nas tarefas do guardião, fora da spec permanente (E1) |
| RP-09 | Não se aplica | Nenhuma cor nova |
| RP-10 | Sim | A variável não é segredo, e o `.env.example` diz isso |
| RP-11 | Não se aplica | Nenhum banco |
| RP-12 | Sim | D7, com contadores na saída (D2, D6) |
| RP-13 | Sim | Nenhum artefato gerado entra; `npm run verificar:artefatos` com código 0 |

### D10 — Escopo nominal do `dev-frontend` (Q5 = a)

| Arquivo | Efeito |
|---|---|
| `src/proxy.ts` | Novo: o interceptador (D1, D3, D4) |
| `src/lib/utils/site-publicado.ts` | Novo: a função do valor exato (D2) |
| `src/lib/utils/site-publicado.test.ts` | Novo: o teste de unidade (D2) |
| `src/componentes/layout/PaginaEmConstrucao.tsx` | Novo: o conteúdo da página de hoje (D3) |
| `src/componentes/layout/PaginaEmConstrucao.module.css` | Movido de `src/app/(site)/page.module.css`, sem mudar o conteúdo |
| `src/app/(site)/page.tsx` | Alterado: passa a usar o componente |
| `src/app/(site)/em-construcao/page.tsx` | Novo: a rota própria |
| `playwright.config.ts` | Dois servidores (D5) |
| `.env.example`, `README.md` | D8 |

O `qa-acessibilidade` escreve `tests/e2e/interruptor.spec.ts`. Arquivo fora destas listas é desvio,
e vai nomeado para a entrega.

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| A variável ser embutida na compilação, e uma compilação não servir os dois modos | O próprio e2e de dois servidores: com uma compilação só, um dos dois specs fica vermelho |
| Os dois servidores subirem ao mesmo tempo, e o segundo iniciar sem compilação ou durante a recompilação | Ordem da lista (D5), conferida na tarefa 2.1 pela saída: uma compilação, depois os dois servidores respondendo |
| O `.env.local` de quem roda publicar o servidor 3001 | `SITE_PUBLICADO=false` explícito no `env` daquele servidor (D5) |
| Um servidor de desenvolvimento aberto na 3000, sem `true`, ser reaproveitado localmente (`reuseExistingServer`) | Comportamento que já existe hoje. O README diz que o e2e local espera a 3000 livre ou publicada |
| O interceptador desviar um recurso, e a página perder a logo ou o estilo | D4. O spec novo confere a logo carregada depois do redirecionamento e o arquivo pedido direto |
| `/em-construcao` responder 200 em produção, com o mesmo conteúdo da raiz, e um buscador registrá-lo como cópia | Nenhum link aponta para ele, e o redirecionamento de todo o resto já tira as cópias que existiriam. `canonical` é da `lancamento-r1`. Decidido assim no Portão 1 (Q3 = c) |
| O teste do 404 de `/sobre` no modo publicado ficar vermelho quando a página existir | Esperado (D6). A change que criar `/sobre` atualiza o teste |
| Mudar a variável na Vercel e achar que já valeu | README (D8): só vale depois de nova implantação |
| A Vercel servir de outra forma que o `next start` local | Conferido na prévia do Portão 2 (`/vitrine` abre, `/em-construcao` dá 404) e na produção depois do merge (`/vitrine` dá 307 para a raiz), no passo a passo do líder técnico |

## Open Questions

Nenhuma aberta. Q1 a Q5 foram decididas pelo Gabriel no Portão 1, e a Q6 no Portão 2, todas em
19/11/2026:

- **Q1 = (a).** Com o site publicado, a raiz continua sendo a página em construção, desenhada
  diretamente, até a `pagina-inicial`.
- **Q2 = decisão própria, fora das opções (a) e (b).** Com o site não publicado, todo endereço de
  página que não é `/` nem `/em-construcao` recebe 307 para a raiz. Motivo: não dar ao buscador
  cópias da raiz, em endereços que hoje dão 404. Aplicada no D1.
- **Q3 = (c).** A rota própria `/em-construcao` responde 200 no modo não publicado e 404 no
  publicado. A raiz não publicada a serve sem mudar o endereço. Aplicada no D1 e no D3.
- **Q4 = (a).** `SITE_PUBLICADO=true` no `.env.example`, comentado como "só para a sua máquina".
  Aplicada no D8.
- **Q5 = (a).** O `dev-frontend`, com o escopo nominal do D10.

Também do Portão 1: **E1**, o cenário de aparência saiu da spec (RP-08 no D9), e o **pedido novo**
de conferir status e `Location` de `/sobre` e `/endereco-que-nao-existe` nos dois modos (D6, item
7). Nenhuma questão nova surgiu nesta rodada.

- **Q6 (a), decidida em 19/11/2026 no Portão 2.** Levantada pelo revisor: a regra genérica de
  extensão deixava passar `/vitrine.rsc` e outros arquivos das páginas compiladas. Decisão: o
  interceptador deixa de fora só `/_next/static`, `/_next/image` e as 9 extensões de imagem ou
  fonte; todo o resto, inclusive `.rsc`, `.html`, `.txt` e `.xml`, passa pelo interruptor. O teste
  do modo não publicado ganha `/vitrine.rsc` e `/robots.txt` com 307 para `/`, e
  `/logo-liacup-256.png` com 200, visto vermelho com o matcher antigo e verde com o novo (RP-12).
  Aplicada no D1 (rótulo da primeira linha da tabela), no D4, no D6 (item 4) e no D7 (demonstração
  5).
