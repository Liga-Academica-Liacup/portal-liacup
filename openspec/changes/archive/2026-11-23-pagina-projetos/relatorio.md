# Relatório — pagina-projetos

Copiado de `openspec/changes/MODELO-relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/pagina-projetos/` — `.openspec.yaml`, `proposal.md`,
  `design.md`, `tasks.md`, `specs/pagina-projetos/spec.md`, `specs/navegacao-publica/spec.md`,
  `specs/seo/spec.md` e este `relatorio.md` · **12 tarefas** de 15 · requisitos nas specs delta:
  `pagina-projetos` 4 ADDED; `navegacao-publica` 1 REMOVED, 1 ADDED e 2 MODIFIED; `seo` 1 MODIFIED
  (8 requisitos escritos, 1 removido).
- **Questões em aberto** (opções, custo e recomendação na proposta, "Questões para o Portão 1"):
  - Q1. Destino dos cinco textos do passo 7: (a) `lancamento-r1`, como o briefing; (b) aqui, como a
    Q11 (a) de lá, com o checklist inteiro; (c) change própria. Recomendo (a). Muda uma decisão
    literal do Gabriel, por isso pede confirmação dele.
  - Q2. Frase da faixa: (a) nenhuma; (b) "As quatro frentes de trabalho da Liga." como rótulo.
    Recomendo (a).
  - Q3. Descrição para buscadores: (a) frase nova no §3, 139 caracteres; (b) 1ª frase de Ensino,
    140; (c) o Gabriel escreve. Recomendo (a).
  - Q4. Interruptor: (a) requisito e e2e da própria página; (b) spec delta de
    `publicacao-do-site`, com o checklist inteiro. Recomendo (a).
  - Q5. Itálico da Secretaria: (a) sem; (b) com. Recomendo (a).
- **Classificação prevista do guardião:** com a Q1 (a) e a Q4 (a), passo 3 da conferência
  proporcional (AS-01, AS-02, AS-04, AS-07 e AS-15); lista de arquivos no `design.md`, D7. Nenhum
  arquivo planejado está no gatilho. `playwright.config.ts` e `lighthouserc.json` não estão em
  nenhuma das duas listas e ficam fora do diff.
- **Incompleto:** o `openspec validate pagina-projetos --strict` **não foi rodado**: este agente não
  tem terminal. A decisão de REMOVED mais ADDED na `navegacao-publica` segue o motivo escrito pela
  change anterior, não conferido no validador. Os caracteres da Q3 e do host foram contados à mão.
  O corte de colunas da grade não foi lido do protótipo: fica para o dev (D4).

## Passagem para a `lancamento-r1`

Vale com a Q1 (a). O gestor leva esta lista ao briefing da `lancamento-r1`. Origem: decisões do
Gabriel no Portão 2 da `completar-ci-do-novo-fluxo` (Q10 (a) e Q11 (a), 23/11/2026), relatório
arquivado em `openspec/changes/archive/2026-11-23-completar-ci-do-novo-fluxo/relatorio.md`,
"Destinos que as decisões fixam". Os três primeiros arquivos estão na lista do gatilho da
`docs/SEGURANCA.md` §5, e por isso não entram nesta change, que fica só de tela (briefing desta
change, item 2).

A coluna "O que o registro diz" resume o achado de origem; o critério exato está no relatório
arquivado, no achado citado, e é de lá que a `lancamento-r1` o lê.

| # | Onde, na `main` `e31d49a` | O que o registro diz | Origem |
| --- | --- | --- | --- |
| 1 | `docs/PLANO-DE-DESENVOLVIMENTO.md:113`, linha 6 da R1 | Afirma como fato o que só valia depois do passo 7; o push verde se confirma na tarefa 1.1 desta change | R3-1 e I3 |
| 2 | `docs/SEGURANCA.md` §6, a linha do A1 em "Saíram da lista" | Afirma como fato o que só valia depois do passo 7 | R3-1 e I3 |
| 3 | `docs/SEGURANCA.md` §5, a frase das formas de sim ou não depois da sublista da Q8 | Ver o achado | R3-4 |
| 4 | `docs/SEGURANCA.md`, a atribuição "visto pelo Gabriel" do I3 na linha da Q12 (b) | Apontar onde está o registro, ou trocar a atribuição pela aprovação da proposta no Portão 1 | I4 do guardião |
| 5 | `openspec/specs/fundacao-e-ci/spec.md:245-249`, o cenário "Chave gravada com dois bytes por caractere" | O cenário, com o limite declarado | R3-2 |
| 6 | `.github/workflows/ci.yml:17` e `:219-220`, o comentário | Descreve a separação dos ambientes como fato antes do passo 7 | R3-1, parte do `ci.yml` (a Q11 (a) já o mandava para a `lancamento-r1`) |
| 7 | `tests/e2e/interruptor.spec.ts` e a spec `publicacao-do-site` | Derivar as rotas verificadas do interruptor da lista única, em vez da amostra fixa de quatro | Q4 (a) desta change |
| 8 | `docs/SEGURANCA.md` §5 e §7, e `scripts/` | A regra geral de origem dos prints de change de tela e a leitura de blocos do PNG, versionada, só se cumprirem os sete critérios do `guardiao-appsec` desta change (seção `## guardiao-appsec`, passagem 1, "Decisão sobre a regra geral"): a §5 cita a regra no mesmo diff; nome fechado; leitura em `scripts/` que acusa assinatura, CRC, tipo fora de `IHDR`/`IDAT`/`IEND`, `IEND` ausente e sobra, vista falhando e no CI; verificável sem o `relatorio.md`; a aprovação não vale como condição na auditoria; inventário contável; o limite do `IDAT` escrito | Q7 (a) e Q8 (a) desta change; A1 do guardião e A1 e A2 da rodada 3 do `revisor` |

A linha 7 só vale se a Q4 for (a). A linha 8 vale pela Q8 (a). As ressalvas de código da Q10 (a) de lá já estão destinadas à
`lancamento-r1` pelo relatório arquivado, e não se repetem aqui.

## Decisões do Gabriel no Portão 1, 23/11/2026

Texto literal da mensagem do Gabriel:

> Portão 1 da pagina-projetos: aprovado. Registre cada decisão literal no relatorio.md.
>
> Q1 (a). Q2 (a). Q4 (a). Q5 (a).
> Q3 (a): autorizo a frase nova no §3 do conteudo-institucional.md, como decisão do Gabriel de 23/11/2026: "Ensino, Extensão, Pesquisa e Secretaria: as quatro frentes de trabalho da Liga Acadêmica Multiprofissional de Cuidados Paliativos (LIACUP)."
>
> Pode rodar o /opsx:apply. No Portão 2, traga o lado a lado da página e do menu aberto em 390, e os comandos Git em blocos separados, com a conferência do ambiente e a busca de segredo primeiro.

As specs, o `design.md` e o `tasks.md` já seguiam as cinco recomendações: nada muda neles.

## Decisões do Gabriel sobre a Q8 e a Q9, 23/11/2026

Texto literal da mensagem do Gabriel:

> Decisões do Gabriel (registre literal no relatorio.md):
>
> Q8 (a), na versão enxuta:
> - sai o parágrafo da regra geral do §7, e a abertura volta ao texto da main;
> - a linha de origem cobre só os 9 PNG desta change, no mesmo formato da linha da pagina-sobre-e-equipe, sem citar script novo (resolve o A2 sem prometer mais do que se confere);
> - o script de leitura de blocos do PNG sai desta change e vai para a lancamento-r1, junto com a regra geral e os 7 critérios do guardião, na "Passagem para a lancamento-r1";
> - A3 e A4 entram (proposta e D7 dizendo passo 1; SEGURANCA.md na versão 3.3).
> O revisor (4ª rodada, autorizada pelo Gabriel) e o guardião rodam só sobre o diff desta correção. Se algum pedir correção de novo, pare e traga ao Gabriel, sem nova rodada.
>
> Q9 (a): os 9 PNG estão aprovados; a linha do §7 já diz "Ativo aprovado".
>
> Depois: archive e Portão 2, com os comandos Git em blocos separados, a conferência do ambiente e a busca de segredo primeiro.

- **A correção, pelo líder técnico:** o `docs/SEGURANCA.md` foi refeito a partir da `main`, com só
  três mudanças: o cabeçalho na versão 3.3 (A4); a linha dos 9 PNG no formato da linha da
  `pagina-sobre-e-equipe`, "Ativo aprovado … Aprovados pelo Gabriel na Q9 (a), 23/11/2026, antes do
  Portão 2", sem citar script; e o total de 79 para 88. `git diff --numstat main --
  docs/SEGURANCA.md`: 5 acrescentadas e 2 removidas. A proposta (fora de escopo e a linha do
  guardião no Impact) e o `design.md` (Goals e D7) dizem que o `SEGURANCA.md` entrou pela Q7 (a)
  e que a conferência é o passo 1 (A3). A regra geral e a leitura de blocos foram para a linha 8 da
  "Passagem para a `lancamento-r1`". Com a Q9 (a), o A5 do guardião deixa de existir: não há troca
  depois do Portão 2.

## Prova do push da `completar-ci-do-novo-fluxo`

Tarefa 1.1 (Q9 (a) de lá), líder técnico, 23/11/2026, 14:13 UTC. Pela API pública do GitHub, sem
autenticação e sem `gh`, `curl -q -sS --max-time 20 --proto =https` sobre
`https://api.github.com/repos/Liga-Academica-Liacup/portal-liacup` (R). JSON reduzido aos campos do
critério:

```
== GET R/actions/runs?per_page=12 · http 200 (duas linhas)
45185945480 #44 push main e31d49a completed success 1 2026-11-23T13:38:35Z 2026-11-23T13:47:26Z
45184520538 #43 pull_request chore/completar-ci-do-novo-fluxo 2138893 completed success 1 2026-11-23T13:30:02Z 2026-11-23T13:37:14Z
== GET R/actions/runs/45185945480/jobs · http 200
jobs: 4 · success: 4
Tipos do banco · success · 1 min 10 s
Build para a barreira da chave · success · 1 min 19 s
Verificacoes · success · 8 min 49 s
Chave fora do pacote · success · 0 min 7 s
== GET R/deployments?environment=chave-de-servico-da-main · http 200
implantações: 1 · refs: ["main"]
8000304899 main e31d49a 2026-11-23T13:39:56Z
== GET R/deployments?environment=segredos-da-main · http 200
implantações: 3 · refs: ["main"]
8000273315 main e31d49a 2026-11-23T13:38:36Z
7989009319 main d7cc5c9 2026-11-23T02:32:55Z
7988826856 main d7cc5c9 2026-11-23T02:18:46Z
== GET R/actions/runs/45184520538/artifacts · http 200 · anexos: 1
prints-do-site · 1240438 bytes · expira 2026-11-30T13:34:18Z · expirado: false
== GET R/actions/runs/45185945480/artifacts · http 200 · anexos: 2
prints-do-site · 1240759 bytes · expira 2026-11-30T13:43:27Z · expirado: false
build-para-a-chave · 2253924 bytes · expira 2026-11-24T13:39:51Z · expirado: false
== GET R/environments · http 200
[{"name":"chave-de-servico-da-main","policy":{"protected_branches":false,"custom_branch_policies":true}},{"name":"Preview","policy":null},{"name":"Production","policy":null},{"name":"segredos-da-main","policy":{"protected_branches":false,"custom_branch_policies":true}}]
== GET R/environments/chave-de-servico-da-main/deployment-branch-policies · http 200
{"total_count":1,"branch_policies":[{"name":"main","type":"branch"}]}
== GET R/environments/segredos-da-main/deployment-branch-policies · http 200
{"total_count":1,"branch_policies":[{"name":"main","type":"branch"}]}
```

- **Confirmação do Gabriel, literal** (briefing desta change, 23/11/2026): "Todos os passos foram
  feitos até o 8". E, do briefing do gestor que o Gabriel colou: "Os dois ambientes com 1 segredo cada, vistos pelo
  Gabriel na tela." A
  existência e o número dos segredos não se leem sem autenticação: valem como palavra do Gabriel.
- **O que a API confirma:** a #44, do push do merge (`e31d49a`), com os quatro jobs em `success`; a
  duração da execução, 8 min 51 s; nos dois ambientes, só implantações de `ref: main` (1 e 3) e uma
  regra só, `main`, de tipo `branch` (critério do M1 de lá, depois do push).
- **O que a API não confirma:** a #44 está na tentativa 1. O "Re-run all jobs" do passo 5 do
  Migration Plan de lá, depois de apagar a chave do `segredos-da-main`, **não aparece** como nova
  tentativa da #44. Não visto, com essas palavras; a confirmação do Gabriel acima é a única fonte
  de que o passo 5 foi feito.
- **I1, o anexo do `.next` (`build-para-a-chave`):** 2.253.924 bytes, expira em 24/11/2026. O número
  de arquivos dentro dele e a ausência de nome começando com `.env` **não foram medidos**: baixar o
  anexo pela API pede autenticação, e nenhum agente a tem.
- **Tempo do PR #24 (#43):** 7,2 min · contra 5,95: +1,25 min (+21 %) · contra 5,73: +1,47 min
  (+26 %).

## dev-frontend

Tarefas 2.1, 2.2 e 2.3, 23/11/2026.

- **Arquivos:** A `src/features/projetos/{tipos,conteudo,regras,conteudo.test}.ts`,
  `src/features/projetos/componentes/{FaixaDeProjetos,GradeDeFrentes,CartaoDaFrente}.{tsx,module.css}`,
  `src/app/(site)/(publicas)/projetos/page.tsx` · M `src/lib/utils/paginas-publicas.json` (+9 −0,
  `/projetos` entre `/processo-seletivo` e `/equipe`), `paginas-publicas.test.ts` (+11 −5: título,
  menu, coluna "Conteúdo" e a descrição contra a 1ª citação do "## 3."), `src/estilos/tokens.css`
  (+16 −0). Linhas: `CartaoDaFrente.tsx` 28, `FaixaDeProjetos.tsx` 29, `GradeDeFrentes.tsx` 35,
  `page.tsx` 30.
- **Tokens novos** (protótipo, página Projetos): `--espaco-fim-da-secao-de-projetos` 80 px
  (padding-bottom da seção), `--radius-cartao-da-frente` `calc(var(--radius-lg) * 1.3)` (raio do
  `<article>`), `--font-size-titulo-da-frente` 28 px e `--line-height-titulo-da-frente` 1.1 (`h2`),
  `--font-size-texto-da-frente` 16 px e `--largura-texto-da-frente` 56ch (parágrafo). A faixa usa os
  tokens da faixa da Equipe, que o protótipo escreve igual (D1).
- **Corte de colunas:** a grade é `[data-resp3]`, com `repeat(2, minmax(0,1fr))` no estilo; a regra
  `@media (max-width: 1024px)` mantém 2 colunas, e `@media (max-width: 768px)` `[data-resp3] {
  grid-template-columns: 1fr }` passa a 1. **1 coluna até 768 px, 2 acima.** Medido no Chromium: 1
  coluna em 390 e 768, 2 em 1280; alturas em 1280 317/317 e 292/292; rolagem horizontal 0.
- **Cartão:** um cartão próprio, `CartaoDaFrente` (`<li>` com `h2` e `p`), e não o `Cartao` de
  `ui/`: ele dá raio `--radius-xl` (32,2 px, e não 36,4), preenchimento `--space-3` e a letra do
  `.card`, sem prop para os do gabarito (D1).
- **RP-09, sobre a superfície do cartão `--color-surface` #ebddc5:** título `--color-accent-800`
  #4e3260, **8,05:1**, a 28 px (texto grande); parágrafo `--color-neutral-800` #474238, **7,45:1**, a
  16 px. Na faixa, sobre `--color-bg` #f5ead8: sobretítulo `--color-accent-700` #683f74 6,91:1;
  título `--color-accent-800` 9,05:1. Medido pela fórmula do WCAG 2.x.
- **Comandos:** `npm run lint` 0 · `npm run verificar:tokens` 0 (141 arquivos varridos) ·
  `npm run verificar:tipos` 0 · `npm test` 0, 22 arquivos, 419 testes, 0 falhas, com
  `Projetos · frentes: 4`, `Projetos · nomes, na ordem: Ensino, Extensão, Pesquisa, Secretaria` e
  `Entradas da lista de páginas públicas conferidas: 5` · `npm run build` 0 (`○ /projetos`) ·
  `git diff --numstat src/estilos/tokens.css` `16 0`.
- **`curl -s` da 2.3** (`node scripts/iniciar-servidor.mjs publicado 3000` e `nao-publicado 3001`,
  derrubados no fim): 3000 `/projetos` `200`, 1 `<h1>` "Ensino, Extensão, Pesquisa e Secretaria",
  `<title>Projetos · LIACUP</title>`; `grep -c` de "Pendente", "a ser escrita", "texto provisório",
  "Estatuto" e "eixo": 0, 0, 0, 0, 0; 3001 `/projetos` `307 http://localhost:3001/`.
- **RP-12, demonstrações de unidade** (D6), cada uma com a violação temporária, vermelho com
  código 1 e verde com código 0 depois de desfeita:
  - 2, Secretaria tirada dos dados: `3 frentes; a seção 3 tem 4` e
    `Projetos · frentes: 3`; verde `frentes: 4`, 7 de 7.
  - 3, "Pendente. " no texto da Secretaria:
    `termo "Pendente" no texto da frente "Secretaria"`; verde 7 de 7.
  - 5, descrição de `/projetos` com 161 caracteres: `descrição com 161 caracteres no endereço
    "/projetos"; o tamanho é de 70 a 160`; verde 19 de 19.
  - 6, `/projetos` depois de `/equipe`: menu esperado `Início, Sobre, Projetos, Equipe`, recebido
    `Início, Sobre, Equipe, Projetos`; verde 19 de 19.
  - Depois: `sha256sum -c` OK em `conteudo.ts` e `paginas-publicas.json`; `git status --porcelain`
    igual ao de antes; nenhum `DEMO-RP12` em `src/`.
- **Melhorias de UI ou UX propostas:** nenhuma.
- **Suíte inteira:** `npm run verificar` 0 · `npx playwright test` **1: 406 passaram, 7
  falharam**, as 7 no mesmo teste ("nesta entrega, a lista tem Início, Sobre, Equipe e Processo
  seletivo…", `tests/e2e/paginas-publicas.spec.ts:596`, uma por largura): a constante da entrega
  ainda espera 4 páginas, e a lista tem 5. Ajustá-la é a tarefa 3.2 do `qa-acessibilidade`, fora do
  `src/`. Na mesma execução, `páginas verificadas: 5 de 5` (7 larguras) e `rotas verificadas: 4`.
- **Incompleto:** o e2e não está verde (7 falhas acima, esperadas até a 3.2). As demonstrações de
  e2e do D6 (1, 2, 3, 4, 7 e 8) são do `qa-acessibilidade`. Os 20 px do preenchimento do cartão até 768 px ficam em
  22 px (soma de `--space-2` e `--space-3`, a 2 px), e os 20 px da faixa e da grade, em
  `--space-4`, como a faixa da Equipe: diferenças para o `guardiao-visual` classificar.

## dev-dados

Não entra: a change não tem banco.

## guardiao-visual

Tarefa 4.1, 23/11/2026. `npm run build` código 0 (`○ /projetos`); `iniciar-servidor.mjs` publicado
3000 e não publicado 3001, derrubados no fim (3000 a 3002 livres). Chromium do Playwright, escala 1,
390 × 844, 768 × 1024 e 1280 × 800, página inteira, movimento reduzido, depois das fontes e imagens;
medidas no DOM do site e do protótipo aberto no Chromium; captura, recorte e montagem por script no
scratchpad, fora do repositório. **Origem dos PNG (RP-13):** cada `lado-a-lado-*` põe
`prototipo/prints/` à esquerda e a captura do site à direita (árvore de trabalho da
`feat/pagina-projetos` sobre `fd31de0`); o de 768 põe à esquerda o protótipo renderizado em 768, que
não é gabarito; os `raiz-nao-publicada-*` são a captura da 3001.

- **Comparado:** `/projetos` × 390 e 1280 (e 768, só para o D4); menu aberto em 390, sobre
  `/projetos`; cabeçalho 1280; rodapé × 390 e 1280; raiz não publicada × 390 e 1280 · **9 PNG** em
  `openspec/changes/pagina-projetos/prints/`: `lado-a-lado-{projetos-390,projetos-1280,projetos-768,menu-aberto-390,cabecalho-1280,rodape-390,rodape-1280}.png`
  e `raiz-nao-publicada-{390,1280}.png` · rolagem horizontal 0 nas 3 larguras
- **Raiz não publicada:** **0 de 329.160** (390) e **0 de 1.024.000** (1280) pixels diferentes
  contra os `raiz-nao-publicada-*` arquivados da `pagina-sobre-e-equipe`; sha256 iguais
- **D4, altura e equilíbrio:** em 1280, linhas de 317,1/317,1 e 292,3/292,3 (gabarito 221,4); o
  texto mais curto deixa 49,5 px no pé do Ensino e 24,7 no da Secretaria, com nome e texto
  alinhados no topo: equilibrado. Em 768, 1 coluna, cartões na altura natural (212; 286,4; 236,8;
  212), texto em 56ch (574,3 px) com 114,5 px livres à direita, como o ramo com texto do protótipo:
  equilibrado. Não proponho mudança
- **Diferenças: 17** — 4 adaptação aprovada · 1 correção obrigatória · 11 regra do Gabriel ou do
  briefing · 1 a aprovar pelo Gabriel · **0 defeito**
  1. cabeçalho 1280 · 125,2 contra 114,4 px · adaptação (§3, alvo de toque)
  2. cabeçalho 1280 · Início, Sobre, Projetos e Equipe, sem os outros 6 nem "Painel" · regra
     (páginas que existem; §4, R3)
  3. "Processo seletivo" no cabeçalho e no menu · `#82558f` · adaptação (§3, ADR-0003)
  4. página atual · no menu, barra e sublinhado em "Projetos" (gabarito: só barra); no rodapé,
     "Projetos" sublinhado (gabarito: nada); no cabeçalho, a barra como no gabarito · adaptação (§3)
  5. botões de abrir e fechar o menu · borda mais escura · adaptação (ADR-0003)
  6. menu aberto · Início, Sobre, Projetos, Equipe e o destaque, Projetos entre Sobre e Equipe como
     no gabarito, que tem 10 destinos, sobre Contato · regra (páginas que existem)
  7. faixa · sem a frase; a grade sobe 59 px (1280) e 97,4 (390), e o vão do título à grade fica
     43,9 px, o do parágrafo à grade no gabarito · regra (§7, Q2 (a))
  8. cartões · texto do §3 no lugar do exemplo; 292,3 a 317,1 px de altura contra 221,4 (1280) e
     311,2 a 435,1 contra 217,4 (390); página de 1374 contra 1266 e 2659 contra 2535 · regra (§7,
     Portão 1)
  9. cartões · sem caixa tracejada nem selo "Pendente"; parágrafo direto no cartão, 16 px,
     `#474238`, 56ch, o ramo com texto do próprio protótipo; Secretaria sem itálico, igual às outras
     · regra (§7, Q5 (a), D4)
  10. preenchimento do cartão · até 768, 22 px nos quatro lados contra 22/20 (texto com 310,8 contra
      314 px de largura em 390); em 1280, 35,2/39,6 contra 34/38 · regra do degrau, a 2 px ou menos
      (`tokens.css`; Gabriel, Q11 (a) da `pagina-processo-seletivo` e Q15 (a) da
      `pagina-sobre-e-equipe`)
  11. laterais da faixa e da grade · `--space-4` (17,6 px) até 768: em 390, a 0,4 px do gabarito (18,
      dentro da regra); em 1280, conteúdo em x 40 nos dois; **de 481 a 768 px, 17,6 contra os 20 do
      protótipo, 2,4 px, fora do limite de 2 px da regra do degrau**, igual à faixa da Equipe · **a
      aprovar pelo Gabriel** (não é melhoria; não há gabarito nessa faixa de largura). Recomendo
      aceitar: 2,4 px não se veem, e acertar mexeria também na Equipe
  12. rodapé · Portal só Início e Sobre; Conteúdo só Projetos e Equipe, Projetos antes, como no
      gabarito · regra (páginas que existem)
  13. rodapé 1280 · passo de 44 px contra 31,4 em Portal e Conteúdo (em 390, 52,8 contra 53) ·
      regra (§7, Q14 (a))
  14. rodapé · `liacup.unb@gmail.com` e "FCTS · Campus UnB Ceilândia · Brasília/DF", em 2 linhas em
      1280 · correção obrigatória (§6)
  15. rodapé · ícones, "liacup.unb" sem @, passo de 44 no contato · regra (§7)
  16. rodapé · linha final centralizada, sem "Protótipo do Portal LIACUP…" · regra (§7)
  17. rodapé 390 · sem "Painel da diretoria" · regra (§4, R3)
- **Medido, não contado (sem efeito visível):** cabeçalho 390 com 61,6 contra 62; altura de linha
  do sobretítulo 18,6 contra 19,2; margem do `h2` 13,2 contra 14; linha do texto do cartão 24,8 px
  (`--line-height-body` 1,55) contra os 25,6 que o ramo com texto do protótipo herdaria (1,6), até
  6,4 px num cartão de 8 linhas
- **Não comparado:** nada. Incompleto: contraste em pixel renderizado (cores do estilo calculado);
  a 768 não tem gabarito, e o lado esquerdo dela é o protótipo com o exemplo

## qa-acessibilidade

Tarefas 3.1, 3.2 e 3.3, 23/11/2026. A `tests/e2e/projetos.spec.ts` (666 linhas, 5 testes) · M
`tests/e2e/paginas-publicas.spec.ts` (+11 −8: a constante `ENTREGA` com 5 endereços, menu Início,
Sobre, Projetos, Equipe, "Conteúdo" Projetos, Equipe; nome e comentário do teste).

- **Cobertura:** 5 páginas da lista × 7 larguras (360 a 1280), e `/projetos` nos 2 modos.
- **Medições** (`npx playwright test`, **código 0, 448 passaram, 0 falharam**): axe **0**
  violações (42 linhas `Violacoes de acessibilidade: 0`, nenhuma com 1 ou mais; `/projetos` 0 nas 7) ·
  rolagem horizontal **0** larguras com defeito (`/projetos` scrollWidth = clientWidth nas 7) · alvos
  **86** medidos / **0** abaixo de 44 px de 360 a 1024, **71** / **0** em 1280 · foco **56** / **0**
  sem foco visível de 360 a 1024, **71** / **0** em 1280 · campos de formulário: 0 · `páginas
  verificadas: 5 de 5` e `rotas verificadas: 4` (os dois modos) nas 7 larguras.
- **`/projetos`, nas 7 larguras:** trechos do §3 conferidos **8** (4 nomes, 4 textos) · rótulos da §7
  **3** · com divergência **0** · `frentes: 4` lidas do documento (1 título de nível 3 fora delas,
  "Como o texto provisório aparece no site"; 3 notas de fonte tiradas) · texto fora do documento
  **0** caracteres · termos proibidos procurados **18** (10 da spec, a frase da faixa e os 4
  exemplos dos cartões lidos do protótipo, 3 notas do §3) · achados **0** · h1 1, h2 4 na ordem,
  1 lista anunciada com 4 itens, cada cartão só `h2` e `p` · letra da Secretaria igual à das outras
  em 9 propriedades (16px, normal, 400, rgb(71, 66, 56)) · colunas **1** em 360, 390, 430, 480 e
  768, **2** em 1024 e 1280 (corte do dev: 1 até 768, 2 acima) · alturas iguais por linha (1280:
  317.1/317.1 · 292.3/292.3) · `projetos no interruptor: 2 de 2 modos` (3001: 307 para `/`, seguido
  até a página em construção com logo e os 2 canais; 3000: 200 sem `Location`).
- **Outros comandos:** `npm run lint` 0 · `npm run verificar:tipos` 0 · `npx prettier --check` dos
  2 arquivos 0 · `git diff --exit-code tests/e2e/interruptor.spec.ts playwright.config.ts` 0 ·
  `git diff --exit-code src/proxy.ts` 0.
- **Verificação nova demonstrada falhando** (RP-12; cada uma com vermelho código 1 e verde código 0
  depois de desfeita pela cópia; o verde é o mesmo spec, 7 de 7 larguras):
  - 1, "conhecimento" → "saber" em Extensão: 7 falhas, `trecho "§3, texto de "Extensão"
    (parágrafo)" difere do documento (palavra 3: esperado "conhecimento", recebido "saber")`, com
    o esperado e o recebido inteiros; verde 35 de 35.
  - 2, Secretaria tirada dos dados: 14 falhas, `a frente "Secretaria" do §3 não está na página` e
    `os h2 são ["Ensino","Extensão","Pesquisa"], e não [...,"Secretaria"]`; verde 35 de 35.
  - 3, "Pendente. " no texto da Secretaria: 14 falhas, `"Pendente" em cartão "Secretaria"` e o
    trecho da Secretaria `(palavra 1: esperado "A", recebido "Pendente.")`; verde 35 de 35.
  - 4, itálico no parágrafo da Secretaria (CSS do cartão): 7 falhas, `a frente "Secretaria" tem
    fontStyle "italic", e "Ensino" "normal"`; verde 35 de 35.
  - 7, `role="list"` tirado da grade: `listas-anunciadas.spec.ts` 7 falhas, `/projetos: lista sem
    marcador e sem role="list": <ul> no conteúdo, 4 itens, o 1º "EnsinoVivências…"`, `sem
    role="list": 1`; verde 7 de 7, `sem role="list": 0`.
  - 8, a conferência do 307 apontada para a 3000 no próprio spec: 7 falhas, `modo não publicado:
    /projetos recebeu 200 sem Location (esperado 307 para /)` e `projetos no interruptor: 1 de 2
    modos`; verde 7 de 7, `2 de 2 modos`.
  - Depois da última: `sha256sum -c` **OK** nos 4 arquivos tocados (`conteudo.ts`,
    `CartaoDaFrente.module.css`, `GradeDeFrentes.tsx`, `projetos.spec.ts`; nenhuma tocou
    `paginas-publicas.json` nem `src/proxy.ts`) · `git status --porcelain --untracked-files=all`
    igual ao de antes (diff 0) · `git grep -c --untracked DEMO-RP12 -- src tests/e2e` **código
    1**. O `git grep -c DEMO-RP12` sem escopo, como está na 3.3, dá **código 0**, e já dava antes da
    primeira demonstração: o termo está no `tasks.md` e neste relatório (no texto da própria
    verificação), nos relatórios arquivados e em `tests/barreiras/`. Por isso a 3.3 **não foi
    marcada**: a verificação escrita não passa, e a decisão sobre o escopo dela é do líder técnico.
- **Defeitos:** nenhum · **sem cobertura:** o VoiceOver e o WebKit de verdade (o papel de lista é
  medido pelo atributo e pela árvore do Chromium); a página em construção "pixel a pixel" (é do
  `guardiao-visual`); o contraste de `/projetos` só pelo axe (os pares do dev não foram medidos de
  novo aqui); diálogo: nenhum novo nesta change, e o do menu lateral não foi medido de novo por mim
  fora da suíte que já existe (verde).

## revisor

### Rodada 1, 23/11/2026

- **Veredito:** aprovado com ressalva · 27 arquivos (fora os 9 PNG, só contados) · 5 critérios de
  aceite, 12 cenários da spec `pagina-projetos`, os MODIFIED de `navegacao-publica` e `seo` sem
  cenário perdido, 12 tarefas e as decisões Q1 a Q7 · RP-01 a RP-14, os 15 itens da §10 dos padrões,
  §11.1, §1, §2.2, §2.6, §3 e os princípios 5, 9 e 10. Texto das quatro frentes idêntico ao §3,
  palavra por palavra; descrição igual à citação do §3 (139 caracteres); nenhuma importação entre
  features; componentes com 28, 29, 35 e 30 linhas; CSS só com `var()`.
- **Achados:**
  1. média · `SEGURANCA.md` §7, linha dos 9 PNG: "Ativo aprovado" e "Decisão do Gabriel, Q7 (a)"
     afirmam uma aprovação que só vem no Portão 2. **Pede correção.**
  2. baixa · `SEGURANCA.md` §7: a regra geral diz "sem linha própria", a abertura do §7 não foi
     emendada e a change mantém linha própria. Não pede correção antes do guardião.
  3. média · `tasks.md` 4.2 e 4.3 e `design.md` D7 desatualizados depois da Q7 (a): o
     `SEGURANCA.md` na lista do `git diff --exit-code`, o passo 3 e "Não mudam". **Pede correção.**
  4. média · `relatorio.md`, 4.2: "tokens 624 arquivos varridos"; o verificador de tokens varre 141
     (o 624 é da verificação da chave). **Pede correção.**
  5. média · `tasks.md` 1.2 marcada sem as três verificações no relatório. **Pede correção.**
  6. baixa · `tasks.md` 3.3 marcada com a verificação escrita que sai 0; o desvio só no relatório.
  7. baixa · "Arquivos fora do escopo" com o marcador do modelo.
  8. informativa · `GradeDeFrentes.tsx:21`, `return null` no vazio, declarado no D5 e impossível pelo
     teste.
  9. cosmético · `tests/e2e/paginas-publicas.spec.ts:584-586` e `regras.ts:10`.
- **Não conseguiu conferir:** a diferença contra a `main` (sem terminal); os PNG; os números dos
  comandos; o P23 (tarefa 4.4); o mérito de segurança da regra geral (é do guardião).
- **Encaminhamento do líder técnico:** corrigidos o 1 (a linha diz que entrou pela Q7 (a) e que os
  prints só se aprovam no Portão 2), o 2 (a abertura do §7 cita a regra geral; ela diz "sem precisar
  de linha própria", e a linha dos 9 é o primeiro caso dela), o 3 (nota da Q7 (a) na 4.2, na 4.3 e no
  D7, com o passo 1), o 4 (as duas saídas literais), o 5 (as três verificações, com os números), o 6
  (o desvio escrito na própria 3.3) e o 7 (os dois arquivos do líder técnico nomeados). O 8 e o 9
  ficam. `npx prettier --check` e `openspec validate pagina-projetos --strict` com código 0 depois
  das correções. O `revisor` roda de novo numa invocação nova, e depois o `guardiao-appsec`.

### Rodada 2, 23/11/2026 (invocação nova; a rodada 1 só foi lida no fim)

- **Veredito:** aprovado com ressalva · 26 de 27 arquivos que não são PNG (o `.openspec.yaml` não
  lido) · 5 critérios (4 cumpridos pelo registro, o P23 aberto) · 12 cenários da
  `pagina-projetos`, os blocos de `navegacao-publica` e `seo` sem cenário perdido · 12 tarefas
  (10 `[x]` com a verificação registrada) · Q1 a Q7 contra o texto literal · 11 trechos de texto
  idênticos ao §3 e à §7 · numstat recontado (`SEGURANCA.md` 16 2, a correção do líder técnico
  certa) · RP-02, RP-03, RP-09 (7,45:1 e 8,05:1 recalculados), RP-12, §1, §2, §2.6 e §11.1.
- **Achados:**
  1. média · `SEGURANCA.md:729-730`: a abertura do §7 ainda manda "acrescenta a linha", contra a
     regra geral "sem precisar de linha própria", e cita a regra sem a condição de o guardião
     mantê-la. **Pede correção.**
  2. baixa · `SEGURANCA.md:746`: "Ativo aprovado" na coluna, e "não estão aprovados" no texto.
  3. baixa · `relatorio.md` e `tasks.md` 4.2: "os outros continuam com código 0" sem nova execução
     depois da Q7 (a). **Pede a nova execução.**
  4. baixa · `design.md:25`, `:157` e `:164` e `proposal.md:124-125` e `:170` desatualizados,
     corrigidos só pela nota da Q7 (a). Pede declaração na entrega.
  5. baixa · `design.md` e `tasks.md` editados no apply sem dizer por quem. Pede declaração.
  6. informativa · `relatorio.md:110-111`: a frase "vistos pelo Gabriel" é do briefing.
  7. informativa · `proposal.md:151`: o RP-06 sugere SEO ≥ 95 também na raiz não publicada (mede
     92, sem mínimo nesse modo por decisão anterior).
- **Rodada 1, situação:** 4, 5, 6 e 7 resolvidos; 1 e 2 parciais (achados 2 e 1 acima); 3 pela nota
  (achado 4); 8 e 9 ficam.
- **Não conseguiu conferir:** o diff contra a `main` (contou lendo os arquivos), o `.openspec.yaml`,
  `tests/e2e/sobre-e-equipe.ts`, os PNG, as saídas de comando, os pares da faixa, a origem dos 6
  tokens, o P23 e o mérito de segurança da regra geral.
- **Encaminhamento do líder técnico:** corrigidos o 1 (a abertura diz "enquanto a regra geral
  estiver em vigor" e "acrescenta a linha no mesmo diff, ou cumpre as condições da regra geral"),
  o 2 (categoria nova "ativo a aprovar", com o portão; a linha dos 9 diz "a aprovar no Portão 2", e
  o líder técnico troca por "aprovado" com a decisão literal antes do merge), o 3 (a nova execução,
  código 0, em "Líder técnico — passagens"), o 5 (quem editou, na mesma seção) e o 6 (a fonte da
  frase). O 4 e o 7 vão declarados na seção 5 da entrega. Pela regra 4 da dieta, a rodada 3 do
  `revisor` é a última: se pedir correção de novo, o líder técnico para e leva ao Gabriel.

### Rodada 3, 23/11/2026 (invocação nova; as rodadas 1 e 2 só foram lidas no fim)

- **Veredito:** aprovado com ressalva · 26 de 27 arquivos que não são PNG · 5 critérios (o P23
  aberto) · 12 cenários, os blocos de `navegacao-publica` e `seo` sem cenário perdido · 12
  tarefas, 10 `[x]` com a verificação · Q1 a Q7 · texto das 4 frentes e a descrição (139)
  idênticos · total de 88 no §7 conferido · RP-09 8,05:1 · nenhuma importação entre features.
- **Achados:**
  - **A1 · média · pede correção:** `SEGURANCA.md:748` e `:761-764` contra a leitura de blocos do
    relatório: a regra diz "só `IHDR`, `IDAT` e `IEND`", e o script só acusa `tEXt`, `zTXt`,
    `iTXt`, falta de `IEND` e sobra; um `eXIf` ou bloco privado passa com 0 achados (RP-12).
  - **A2 · média · ressalva:** a terceira condição da regra geral (aprovação no Portão 2) não pode
    estar cumprida na auditoria, que vem antes; a regra não tem o estado "a aprovar".
  - **A3 · baixa:** o plano de desfazer a regra não cita a abertura do §7 nem a última frase da linha.
  - **A4 · baixa:** quem marcou a 3.3 não está declarado (foi o líder técnico, depois de conferir a
    forma restrita).
  - **A5 · baixa:** `design.md` e `proposal.md` com o texto anterior à Q7 (a), coberto pela nota.
  - **A6 e A7 · informativas:** a existência dos segredos se apoia na frase do briefing; o
    `return null` do `GradeDeFrentes.tsx:21`.
- **Encaminhamento do líder técnico:** pela regra 4 da dieta, a terceira rodada que pede correção
  para o ciclo e vai ao Gabriel (Q8). Nada foi corrigido depois desta rodada. O `guardiao-appsec`
  rodou antes da entrega, só para leitura, para o Gabriel decidir uma vez só.

### Rodada 4, 23/11/2026 (autorizada pelo Gabriel na Q8 (a); só o diff da correção)

- **Veredito:** aprovado com ressalva · **não pede correção** · os 4 arquivos do diff da correção
  contra os atuais, mais `tasks.md` 4.2 e 4.3 · a Q8 (a) cumprida nos 4 itens e a Q9 (a), nada a
  mais nem a menos · `grep` de "regra geral" e "a aprovar" no `SEGURANCA.md`: 0 · a linha nova no
  formato da linha da `pagina-sobre-e-equipe` · total de 88 nas 13 linhas da tabela · numstat 5 e 2
  recontado · a §5 (`:306`) e a abertura do §7 coerentes de novo.
- **Ressalvas, nenhuma corrigida (decisão do Gabriel: sem nova rodada):**
  1. baixa · a frase "O corpo do `design.md` … e o da `proposal.md` ficam como foram aprovados no
     Portão 1", em "Líder técnico — passagens", ficou falsa: a correção da Q8 (a) mexeu nos dois.
  2. baixa · `tasks.md` 4.2: "linha do §7 e regra geral"; a regra geral saiu (é o N1 do guardião).
  3. informativa · "Passagem para a `lancamento-r1`", abertura: "fica só de tela" não vale desde a
     Q7 (a).
  4. informativa · a linha 8 da passagem resume os 7 critérios; o texto exato é o da passagem 1 do
     guardião, que a linha cita.
  5. informativa · o `docs/SEGURANCA.md` não está na tabela de quem escreve do D7; o desvio está
     nomeado em "Líder técnico — passagens" e na nota da Q7 (a) do D7.

## guardiao-appsec

O guardião não escreve: o líder técnico registra o relatório em uma tela por passagem, com a lista
de achados inteira; a saída de comando e o aceite do Gabriel vão literais.

### Passagem 1, 23/11/2026 (depois da rodada 3 do `revisor`)

- **Veredito:** **BLOQUEADO** · bloqueante 0 · alta 1 (confirmada) · média 1 (provável) · baixa 0 ·
  informativa 3 · **conferência completa** (passo 1: `docs/SEGURANCA.md` no diff; o guardião
  concordou). 35 de 36 arquivos lidos; o `relatorio.md` coberto só por P6.
- **Estados:** AS-01 com A1 e A2; AS-02 sem achado (`src/proxy.ts:43-61` responde 307 em
  `/projetos`, e o matcher pega `/projetos.rsc`; teste em `tests/e2e/projetos.spec.ts:611-666`);
  AS-04 sem achado (texto como filho JSX, sem HTML cru nem link externo novo); AS-05, AS-06, AS-07,
  AS-08 e AS-09 sem achado; AS-15 não verificado (a prévia ainda não tem o código; P23 na 4.4; em
  produção, o LB-07); AS-03, AS-10 a AS-14, AS-16 e AS-17 não se aplicam.
- **Decisão sobre a regra geral (Q7 (a)): não fica.** Ela afrouxa um controle do AS-01. Volta na
  `lancamento-r1` só se cumprir sete critérios: (1) a §5 ("Arquivo binário", `:304-305`) cita a
  regra no mesmo diff; (2) nome fechado, só `lado-a-lado-*.png` e `raiz-nao-publicada-*.png` em
  `prints/` da change e do archive; (3) leitura de blocos versionada em `scripts/`, que imprime
  cada tipo com a contagem, sai com código diferente de 0 com assinatura errada, CRC inválido, tipo
  fora de `IHDR`/`IDAT`/`IEND`, `IEND` ausente ou sobra, vista falhando e rodando no CI; (4)
  verificável sem o `relatorio.md`, pela saída do CI ou forma nova da lista fechada; (5) a
  aprovação não vale como condição na auditoria: "a aprovar" até o Portão 2, registrada num arquivo
  que o guardião lê; (6) inventário contável no modo base; (7) o limite do `IDAT` escrito.
- **Achados (lista inteira):**
  - **A1 · AS-01 · alta · confirmado** · `SEGURANCA.md:757-767` (regra geral), `:727-728` e
    `:731-732` (abertura) e a última frase de `:748`, contra `:304-305`. As condições 1 e 2 moram
    no relatório, que o guardião não abre; a 3 vem depois da auditoria; a 2 promete mais que a
    leitura; não há padrão de nome. Cenário: um `lado-a-lado-x.png` de outra ferramenta com
    `iCCP`, `eXIf` ou bloco privado comprimido guardando texto do terminal ou do `.env` passa
    pela leitura, pelo `git grep -a` e pela auditoria, e vai ao repositório público. Critério: o
    parágrafo sai; a abertura volta ao texto da `main`; a última frase da `:748` sai; `git diff
    main -- 'docs/SEGURANCA.md'` mostra só a linha da tabela e "Os 9 da `pagina-projetos` também.
    Total: 88 arquivos.".
  - **A2 · AS-01 · média · provável** · `SEGURANCA.md:748` afirma "só `IHDR`, `IDAT` e `IEND`",
    mais do que a leitura acusa. Critério: (a) a linha diz só o que a leitura confere, ou (b) a
    leitura imprime todo tipo por PNG e o relatório traz "arquivos: 9 · tipos fora de
    IHDR/IDAT/IEND: 0", que a linha cita; e o caminho da linha é o do archive de fato.
  - **A3 · AS-01 · informativa · confirmado** · `proposal.md:124-126` e `:170`, `design.md:157`:
    o `SEGURANCA.md` fora de escopo e o passo 3. Critério: os trechos dizem que ele entrou pela
    Q7 (a) e que a conferência é o passo 1.
  - **A4 · AS-01 · informativa · confirmado** · `SEGURANCA.md:3`: o cabeçalho continua "Versão 3.2".
    Critério: o cabeçalho registra a versão e a change, ou a entrega diz por que não.
  - **A5 · AS-01 · informativa · confirmado** · `SEGURANCA.md:748` manda trocar "a aprovar" por
    "aprovado" depois do Portão 2, num arquivo do gatilho depois da auditoria. Critério: a entrega
    mostra o `git diff` dessa edição com só a troca e a decisão literal.
- **Pedidos de comando** (Git Bash, `MSYS_NO_PATHCONV=1`; precondições: conferência do ambiente
  com código 0, 20 de 20 iguais; `test -e .npmrc` código 1; HEAD = `ls-remote` = `fd31de0`;
  `curl 8.7.1`):
  - P1 a P4 · AS-01 · `git diff main -- '<arquivo>'` em `docs/SEGURANCA.md`, `src/estilos/tokens.css`,
    `docs/REFERENCIA-VISUAL.md` e `docs/conteudo-institucional.md` · `[código de saída: 0]` nos
    4. A saída é o próprio diff, reproduzível pelo mesmo comando, e não vai transcrita: P1 mostra
    só a §7 (a abertura, a linha, o total e a regra geral), sem mudança na §4, na §5 nem na §6; P2,
    só linhas acrescentadas, o bloco "Tokens da change pagina-projetos", sem `url(` nem
    `@import`; P3, só a linha "Projetos, faixa do topo"; P4, só a linha da descrição e a citação
    no §3. Nenhum valor de chave.
  - P5 · AS-01 · `git grep -c -a --untracked -e 'eyJhbGciOi\|sb_secret_\|sbp_\|github_pat_\|ghp_\|PRIVATE KEY' -- 'docs/SEGURANCA.md'`
    · `docs/SEGURANCA.md:1` · `[código de saída: 0]` (controle: a alternância funciona).
  - P6 · a mesma forma em `openspec/changes/pagina-projetos/relatorio.md` · saída vazia ·
    `[código de saída: 1]`. P7 não rodou (o P6 não deu contagem).
  - P8 a P16 · a mesma forma em cada um dos 9 PNG de `openspec/changes/pagina-projetos/prints/` ·
    saída vazia · `[código de saída: 1]` nos 9.
  - P17 · AS-01 · `sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --untracked -f -`
    · saída vazia · `[código de saída: 1]`. Forma da linha registrada antes, só por contagem
    (`grep -c`): 1 linha com o nome; 0 linhas com aspas, `#`, valor vazio, espaço ou tab depois do
    `=`, ou espaço ou tab no fim depois de tirar o `\r`.
- **Riscos aceitos pelo Gabriel:** nenhum.

### Passagem 2, 23/11/2026 (só o diff da correção da Q8 (a) e da Q9 (a); levantamento e decisão, duas invocações novas)

- **Veredito final:** **APROVADO** · bloqueante 0 · alta 0 · média 0 · baixa 0 · informativa 1 ·
  conferência completa (passo 1; o guardião concordou).
- **Estado da passagem 1:** A1 fechado (P1 com exatamente o cabeçalho −1/+3, +1 linha da tabela e o
  total −1/+1); A2 resolvido (a linha não cita leitura de blocos nem script, no formato da linha da
  `pagina-sobre-e-equipe`); A3 resolvido (`proposal.md` e `design.md` dizem passo 1); A4 resolvido
  (versão 3.3); A5 não existe mais (a linha já diz "Ativo aprovado"). O estado de A2 a A5 é o do
  levantamento; a invocação de decisão não os reconferiu, porque o texto deles mora no
  `relatorio.md`, que ela não abre.
- **Achado:** **N1 · AS-09 · informativa · confirmado** · `tasks.md:84-85` diz que o
  `docs/SEGURANCA.md` muda por "linha do §7 e regra geral", e o P1 mostra que a regra geral não
  entrou. Sem cenário de ataque. Critério: a 4.2 descreve a mudança como o P1 a mostra, sem citar
  "regra geral". Não corrigido, pela decisão do Gabriel de não abrir nova rodada; vai declarado na
  entrega.
- **Pedidos de comando** (Git Bash, `MSYS_NO_PATHCONV=1`; conferência do ambiente com código 0, 20
  de 20 iguais):
  - P1 · AS-01 · `git diff main -- 'docs/SEGURANCA.md'`, linhas `+` e `-` · `[código de saída: 0]`:
    ```
    -**Versão 3.2 · 23 de novembro de 2026** · change `completar-ci-do-novo-fluxo`: na §3, os quatro
    +**Versão 3.3 · 23 de novembro de 2026** · change `pagina-projetos`: na §7, a linha de origem dos 9
    +prints da change e o total de 88 (Q7 (a), Q8 (a) e Q9 (a) do Gabriel). A versão 3.2, também de
    +23/11, veio da change `completar-ci-do-novo-fluxo`: na §3, os quatro
    +| `openspec/changes/archive/2026-11-23-pagina-projetos/prints/{lado-a-lado,raiz-nao-publicada}-*.png` | 9 | Ativo aprovado: 7 lado a lado do protótipo e do site e 2 prints da página em construção, tirados pelo `guardiao-visual` com o método escrito no `relatorio.md` da change (script temporário, não versionado). Aprovados pelo Gabriel na Q9 (a), 23/11/2026, antes do Portão 2 |
    -mesmo diff. Total: 79 arquivos.
    +mesmo diff. Os 9 da `pagina-projetos` também. Total: 88 arquivos.
    ```
  - P2 a P7 · AS-01 · `git grep -n -I --untracked -e '<prefixo>' -- 'openspec/changes/pagina-projetos/relatorio.md'`
    com `sb_secret_`, `sbp_`, `eyJ`, `github_pat_`, `ghp_` e `PRIVATE KEY` · `[código de saída: 0]`
    nos seis, sempre 1 linha, a que registra o P5 da passagem 1 com a expressão de busca. A linha não
    vai transcrita; os 3 caracteres depois de cada ocorrência: `sb_secret_\|s`, `sbp_\|g`, `eyJhbG`
    (`hbGciOi` e depois `\`), `github_pat_\|g`, `ghp_\|P` e `PRIVATE KEY' -`. `grep -c -E
    '<prefixo>[A-Za-z0-9_.-]{16,}'` deu 0 nos seis; nenhum bloco `-----BEGIN`.
  - P8 · AS-01 · forma da linha do `.env` por contagem (1 linha com o nome; 0 fora da forma) e
    `sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --untracked -f -`
    · saída vazia · `[código de saída: 1]`.
- **Não verificado:** A2 a A5 na invocação de decisão (ver acima); a leitura da linha 488 do
  `relatorio.md` pelo guardião, que não abre o arquivo (vale a saída de P2 a P7); AS-15 da página,
  no P23 da tarefa 4.4, depois do push.
- **Riscos aceitos pelo Gabriel:** nenhum.

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum.

- **Arquivos fora do escopo, por agente:** nenhum em nenhuma passagem de subagente. Do líder
  técnico, fora da coluna dele no D7: o §3 do `docs/conteudo-institucional.md` (tarefa 1.2, coluna
  do `especificador`) e o `docs/SEGURANCA.md` §7 (Q7 (a)). Detalhe em "Líder técnico — passagens".

## Líder técnico — passagens, 23/11/2026

- **Escopo, depois de cada passagem** (`especificador`, `dev-frontend`, `qa-acessibilidade`,
  `guardiao-visual`): nenhum arquivo fora do escopo do D7; `git diff --cached --name-only` vazio;
  HEAD `fd31de0` e `git rev-list --all` com 118 linhas, iguais aos de antes (o commit `fd31de0` da
  proposta é do Gabriel, entre o Portão 1 e o apply); `git ls-remote origin feat/pagina-projetos`
  igual a `fd31de0`; conferência do ambiente com código 0 (20 comparados, 20 iguais). As chaves do
  `.git/config` foram de 15 para 18 com o `push -u` do Gabriel, 0 fora da lista.
- **Tarefa 1.2, verificações:** `grep -c '^| Projetos, faixa do topo' docs/REFERENCIA-VISUAL.md`
  dá 1; `grep -c '^> Ensino, Extensão, Pesquisa e Secretaria: as quatro frentes de trabalho'
  docs/conteudo-institucional.md` dá 1; `git diff --numstat main --` dá `1 0` no
  `docs/REFERENCIA-VISUAL.md` e `4 0` no `docs/conteudo-institucional.md` (0 linhas removidas).
  O aceite literal do Gabriel está em "Decisões do Gabriel no Portão 1".
- **Tarefa 1.2, desvio:** a frase do §3 foi escrita pelo líder técnico, e não pelo `especificador`
  (escopo dele é `openspec/`); texto idêntico ao autorizado na Q3 (a).
- **Tarefa 3.3, desvio:** `git grep -c DEMO-RP12` sem caminho sai com 0 antes e depois das
  demonstrações, porque o termo está no próprio `tasks.md`, nos relatórios e em `tests/barreiras/`.
  Conferido na forma restrita: `git grep -c --untracked DEMO-RP12 -- src tests/e2e`, código 1.
- **Tarefa 4.2:**

| Comando | Código | Contadores |
| --- | --- | --- |
| `npm run verificar` | 0 | artefatos VERIFICADO · ações 12 de 12 presas · specs `13 passed, 0 failed` · tokens `141 arquivo(s) varrido(s) em src/` · chave `624 arquivo(s) varridos, 106 deles entregues ao navegador` |
| `npm run build` | 0 | `○ /projetos` |
| `npm run test:desempenho` | 0 | publicado: `páginas medidas: 5 de 5`, `/projetos` desempenho 100, acessibilidade 100, SEO 100 nas 3 execuções · não publicado: `1 de 1`, 100/100, SEO 92 (sem mínimo nesse modo) |
| `npm test` | 0 | 22 arquivos, 419 testes |
| dependências diretas | — | 23, iguais às da `main` |
| `git diff --exit-code main -- package.json package-lock.json src/proxy.ts lighthouserc.json playwright.config.ts .github/ scripts/ docs/SEGURANCA.md docs/PLANO-DE-DESENVOLVIMENTO.md docs/PADROES-DE-CODIGO.md openspec/specs/publicacao-do-site openspec/specs/fundacao-e-ci` | 0 | nada mudou |

- **Achado do líder técnico, antes do `revisor`:** os 9 PNG de `prints/` são binários novos, e a
  `docs/SEGURANCA.md` §7 manda a change que acrescenta binário acrescentar a linha de origem no
  mesmo diff; sem ela, é achado de AS-01, alto. O `SEGURANCA.md` está na lista do gatilho. A
  proposta previu o passo 3 sem ver isso. Vai ao Gabriel como Q7, antes do `revisor`.
  **Atualização depois da Q7 (a):** com o `docs/SEGURANCA.md` no diff, a linha do `git diff
  --exit-code` acima deixa de valer para esse arquivo (ele muda por decisão); os outros continuam
  sem mudança. **Medido de novo depois da Q7 (a)**, sem o `docs/SEGURANCA.md`: `git diff
  --exit-code --stat main -- package.json package-lock.json src/proxy.ts lighthouserc.json
  playwright.config.ts .github/ scripts/ docs/PLANO-DE-DESENVOLVIMENTO.md docs/PADROES-DE-CODIGO.md
  openspec/specs/publicacao-do-site openspec/specs/fundacao-e-ci`, saída vazia, código 0.
- **Quem editou o `design.md` e o `tasks.md` no apply:** o líder técnico, fora da coluna dele no D7
  (que dá esses arquivos ao `especificador`): as notas depois da Q7 (a) no D7, na 4.2 e na 4.3, e o
  desvio escrito na 3.3, pela rodada 1 do `revisor`; e os `[x]` das tarefas 1.1, 1.2, 4.1 e 4.2. O
  corpo do `design.md` (linhas do passo 3 e de "Não mudam") e o da `proposal.md` ficam como foram
  aprovados no Portão 1; a nota da Q7 (a) é o que vale.

## Decisões do Gabriel sobre a Q6 e a Q7, 23/11/2026

Texto literal da mensagem do Gabriel:

> Decisões do Gabriel (registre literal no relatorio.md):
> Q6 (a): os 2,4 px entre 481 e 768 px ficam aceitos, como na Equipe.
> Q7 (a): a linha de origem dos PNG entra no §7. Como o guardião passa ao checklist inteiro nesta change de qualquer jeito, escreva a linha já como regra geral para os prints de lado a lado e da raiz não publicada de toda change de tela, em openspec/changes/<change>/prints/ e em openspec/changes/archive/*/prints/, com a condição que o guardião exigir (por exemplo, PNG sem bloco de texto, conferido por script). O guardião decide se a regra geral fica. Se não ficar, a linha cobre só os 9 PNG desta change, e a regra geral vai para a lancamento-r1.
>
> Depois: revisor e guardião, archive, e o Portão 2 com os comandos Git em blocos separados, com a conferência do ambiente e a busca de segredo primeiro.

- **O que mudou:** `docs/SEGURANCA.md` §7 ganhou a linha dos 9 PNG desta change, já no caminho do
  archive de 23/11/2026; o total foi de 79 para 88; e entrou o parágrafo da regra geral. Se o
  guardião não a mantiver, o parágrafo sai, a linha fica, e a regra geral entra na "Passagem para a
  `lancamento-r1`". Com o `SEGURANCA.md` no diff, a conferência proporcional fica no **passo 1**:
  checklist inteiro. **Depois da Q8 (a):** o parágrafo e a abertura nova saíram; ver "Decisões do
  Gabriel sobre a Q8 e a Q9".

## Leitura de blocos dos PNG (condição da Q7 (a))

**Depois da Q8 (a), esta leitura não é condição de nada nesta change:** a linha do §7 não a cita,
e ela vai para a `lancamento-r1` (linha 8 da passagem). Fica aqui como registro do que se rodou.

Script temporário do líder técnico, fora do repositório (`$TEMP/blocos-png.mjs`), texto inteiro:

```js
import { readFileSync } from 'node:fs'
const ASSINATURA = '89504e470d0a1a0a'
let comTexto = 0
for (const arquivo of process.argv.slice(2)) {
  const b = readFileSync(arquivo)
  if (b.subarray(0, 8).toString('hex') !== ASSINATURA) { console.log(`${arquivo}: não é PNG`); comTexto++; continue }
  const tipos = {}
  let i = 8, fim = false
  while (i + 8 <= b.length) {
    const tam = b.readUInt32BE(i); const tipo = b.subarray(i + 4, i + 8).toString('latin1')
    tipos[tipo] = (tipos[tipo] || 0) + 1; i += 12 + tam
    if (tipo === 'IEND') { fim = true; break }
  }
  const sobra = b.length - i
  const texto = ['tEXt', 'zTXt', 'iTXt'].filter((t) => tipos[t])
  if (texto.length || !fim || sobra) comTexto++
  console.log(`${arquivo}: ${Object.entries(tipos).map(([t, n]) => `${t}×${n}`).join(' ')} · bytes depois do IEND: ${sobra}`)
}
console.log(`PNG conferidos: ${process.argv.length - 2} · com bloco de texto, sem IEND ou com sobra: ${comTexto}`)
process.exit(comTexto ? 1 : 0)
```

`node "$TEMP/blocos-png.mjs" openspec/changes/pagina-projetos/prints/*.png`, código 0:

```
openspec/changes/pagina-projetos/prints/lado-a-lado-cabecalho-1280.png: IHDR×1 IDAT×13 IEND×1 · bytes depois do IEND: 0
openspec/changes/pagina-projetos/prints/lado-a-lado-menu-aberto-390.png: IHDR×1 IDAT×15 IEND×1 · bytes depois do IEND: 0
openspec/changes/pagina-projetos/prints/lado-a-lado-projetos-1280.png: IHDR×1 IDAT×84 IEND×1 · bytes depois do IEND: 0
openspec/changes/pagina-projetos/prints/lado-a-lado-projetos-390.png: IHDR×1 IDAT×88 IEND×1 · bytes depois do IEND: 0
openspec/changes/pagina-projetos/prints/lado-a-lado-projetos-768.png: IHDR×1 IDAT×84 IEND×1 · bytes depois do IEND: 0
openspec/changes/pagina-projetos/prints/lado-a-lado-rodape-1280.png: IHDR×1 IDAT×18 IEND×1 · bytes depois do IEND: 0
openspec/changes/pagina-projetos/prints/lado-a-lado-rodape-390.png: IHDR×1 IDAT×22 IEND×1 · bytes depois do IEND: 0
openspec/changes/pagina-projetos/prints/raiz-nao-publicada-1280.png: IHDR×1 IDAT×19 IEND×1 · bytes depois do IEND: 0
openspec/changes/pagina-projetos/prints/raiz-nao-publicada-390.png: IHDR×1 IDAT×18 IEND×1 · bytes depois do IEND: 0
PNG conferidos: 9 · com bloco de texto, sem IEND ou com sobra: 0
```

Sobre os 43 PNG já arquivados (`git ls-files 'openspec/changes/archive/*/prints/*.png'`), código 0:
`PNG conferidos: 43 · com bloco de texto, sem IEND ou com sobra: 0`.

RP-12, vista falhando: uma cópia de `lado-a-lado-cabecalho-1280.png` em `$TEMP`, com um bloco
`tEXt` ("Comment", "teste") posto antes do `IEND`, deu código 1, e a cópia foi apagada:

```
com-texto.png: IHDR×1 IDAT×13 tEXt×1 IEND×1 · bytes depois do IEND: 0
PNG conferidos: 1 · com bloco de texto, sem IEND ou com sobra: 1
```

Uma cópia com 1 byte depois do `IEND` também contou como achado (`bytes depois do IEND: 1`).
