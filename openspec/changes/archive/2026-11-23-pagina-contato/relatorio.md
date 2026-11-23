# Relatório — pagina-contato

Copiado de `openspec/changes/MODELO-relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/pagina-contato/` — `proposal.md`, `design.md`, `tasks.md`,
  `specs/pagina-contato/spec.md`, `specs/navegacao-publica/spec.md`, `specs/seo/spec.md` e este
  `relatorio.md` (o `.openspec.yaml` é do líder técnico) · **14 tarefas** de 15 (a 1.1 já feita pelo
  líder técnico) · requisitos nas specs delta: `pagina-contato` 5 ADDED; `navegacao-publica` 3
  MODIFIED; `seo` 1 MODIFIED (9 requisitos, nenhum removido).
- **Questões em aberto** (opções, custo e recomendação na proposta, "Questões para o Portão 1"):
  - Q1. Frase abaixo do título: (a) nenhuma; (b) a do protótipo, "Dúvidas sobre o processo
    seletivo, convites para eventos e parcerias com serviços de saúde.", registrada no §1.
    Recomendo (a).
  - Q2. Endereço de "Onde estamos": (a) o curto do rodapé; (b) o completo do §1 com "·" no lugar do
    travessão, 92 caracteres, com o teste contando 1 troca. Recomendo (b).
  - Q3. O lugar do formulário: (a) coluna única, a esquerda do protótipo; (b) título à esquerda e
    quadros à direita; (c) o quadro da borboleta à direita. Cartões lado a lado descartados.
    Recomendo (a). Os prints são do líder técnico (tarefa 1.3).
  - Q4. Descrição para buscadores: (a) frase com o @ e o e-mail, 129 caracteres; (b) frase com a
    sede, 137; (c) o Gabriel escreve. Recomendo (a), registrada no §1.
- **Classificação prevista do guardião:** **passo 1, checklist inteiro**, porque o
  `docs/SEGURANCA.md` entra no diff (linhas de origem dos prints e da cópia do Gmail em `public/`,
  tarefa 4.2) e está na lista do gatilho. Fora ele, todo arquivo previsto está na lista de tela
  (`design.md`, D7).
- **Incompleto:** o `openspec validate pagina-contato --strict` **não foi rodado**: este agente não
  tem terminal. Os caracteres das frases da Q2 e da Q4, do título e do host foram contados à mão. A
  frase da Q1 foi lida no `prototipo/Portal-LIACUP.html` por busca de texto. O corte de colunas, a
  largura da coluna e o tamanho do círculo não foram medidos no protótipo: ficam para o dev (D4).

### Ajuste às decisões do Portão 1 (23/11/2026)

- **Artefatos alterados:** `proposal.md`, `design.md`, `tasks.md`, `specs/pagina-contato/spec.md` e
  esta seção. `specs/navegacao-publica/spec.md` e `specs/seo/spec.md` não mudaram (não falam de
  composição).
- **O que mudou:** a Q3 passou de (a) para (b) em toda a change. Spec `pagina-contato`: o requisito
  dos três canais diz a composição; o cenário "Sem formulário, no celular e no desktop" virou três,
  "Sem formulário", "Uma coluna até 1024 px" e "Título à esquerda e quadros à direita acima de 1024
  px"; o cenário dos quadros passou de "abaixo do título" para "depois do título". `design.md`: D4
  com a Q3 (b) como melhoria aprovada e a classificação do `guardiao-visual`; D1 diz que a grade é
  da rota; D6 ganha a conferência da composição e a demonstração 11; riscos e "Open Questions" com
  as decisões. `tasks.md`: linha 4, 1.2, 2.2, 3.1, 3.3 (onze demonstrações) e 4.1. `proposal.md`:
  item 2, o parágrafo das decisões, "Decidido" na Q3 e a tabela de Impact.
- **Conta:** **14 tarefas** de 15 (1.1 e 1.3 `[x]`) · requisitos: `pagina-contato` 5 ADDED,
  `navegacao-publica` 3 MODIFIED, `seo` 1 MODIFIED (9; nenhum novo, nenhum removido). Cenários da
  `pagina-contato`: 17 (eram 15).
- **O corte:** acima de 1024 px, duas colunas. Lido por busca de texto no protótipo: a grade da
  seção Contato é `data-resp`, que vira uma coluna em `@media (max-width: 1024px)`; 1024 é corte
  permitido (`PADROES-DE-CODIGO.md` §3). Das 7 larguras do RP-05, só 1280 fica em duas colunas.
- **Acréscimo que o briefing não pediu, nomeado:** a demonstração 11 do RP-12 (grade de uma coluna
  só em 1280 deixa o e2e vermelho), porque a conferência da composição é verificação nova; e, no
  D3 e no D6, tirei as frases condicionais da Q1 (b) e da Q2 (a), que deixaram de valer.
- **Questões em aberto:** nenhuma nova.
- **Correção depois do validate (código 1, aviso de requisito com mais de 500 caracteres):** o
  texto do requisito "A página Contato mostra os três canais da liga" foi encurtado para cerca de
  230 caracteres, tirando a ordem, as imagens, os dados e o detalhe das colunas, que já estão nos
  cenários. Sem divisão: a conta continua 9 requisitos (5 ADDED) e 17 cenários na `pagina-contato`.
- **Incompleto:** o `openspec validate pagina-contato --strict` **não foi rodado** depois do
  ajuste nem depois da correção (sem terminal). As proporções das colunas, o espaço entre elas e a largura máxima da seção
  não foram transcritos para a change: ficam para o dev ler na mesma grade (D4).

### Texto proposto para a tarefa 1.2

Para o líder técnico colar. Linha nova no fim da tabela "Regras de tela decididas pelo Gabriel" da
`docs/REFERENCIA-VISUAL.md` §7:

```markdown
| Contato, página | Sobretítulo "Contato" e título principal "Fale com a Liga", sem frase embaixo: a do protótipo não está no `conteudo-institucional.md`. Três quadros, nesta ordem: "Instagram", "E-mail" e "Onde estamos". Em "Onde estamos", a linha "Sede" do `conteudo-institucional.md` §1, com " — " trocado por " · " (§5): "FCTS · Campus UnB Ceilândia, QNN 14 Área Especial, Ceilândia Sul, CEP 72220-140, Brasília/DF". Sem formulário até a R4. **Melhoria aprovada sobre o protótipo:** até 1024 px, o topo e os três quadros numa coluna só; acima de 1024 px, sobretítulo e título na coluna da esquerda e os três quadros na da direita, alinhados ao topo do título. Na R4, o formulário traz de volta a composição do protótipo. "Contato", "Fale com a Liga", "Instagram", "E-mail" e "Onde estamos" são rótulos de interface, não texto do `conteudo-institucional.md` (Gabriel, 23/11, Q1 (a), Q2 (b) e Q3 (b) da `pagina-contato`) | R1 |
```

Trecho novo no `docs/conteudo-institucional.md` §1, entre o título "## 1. Identidade e dados
institucionais" e a tabela, com uma linha em branco antes e depois de cada bloco, no formato do
trecho de Projetos no §3:

```markdown
**Descrição da página Contato para buscadores** _(decisão do Gabriel, 23/11/2026, Q4 da pagina-contato)_:

> Contato da Liga Acadêmica Multiprofissional de Cuidados Paliativos (LIACUP): Instagram @liacup.unb e e-mail liacup.unb@gmail.com.
```

A frase da citação é a literal do Gabriel na Q4 (a). Com o trecho, ela é a primeira citação (`> `)
do §1, que é o que o teste da lista lê (D3).

## Decisões do Gabriel no Portão 1, 23/11/2026

Texto literal da mensagem do Gabriel:

> Portão 1 da pagina-contato: aprovado. Registre cada decisão literal no relatorio.md.
>
> Q1 (a). Q2 (b).
> Q3 (b): título à esquerda e os três contatos à direita em telas largas; no celular, como nos esboços. É melhoria sobre o protótipo, aprovada pelo Gabriel: registre na REFERENCIA-VISUAL §7, com a nota de que, na R4, o formulário traz de volta a composição do protótipo.
> Q4 (a): autorizo a frase nova no §1 do conteudo-institucional.md, como decisão do Gabriel de 23/11/2026: "Contato da Liga Acadêmica Multiprofissional de Cuidados Paliativos (LIACUP): Instagram @liacup.unb e e-mail liacup.unb@gmail.com."
>
> Pode rodar o /opsx:apply. No Portão 2, traga o lado a lado em 390 e 1280 e o do menu aberto em 390; o P23 é registrado antes do merge, e eu só faço o merge quando você disser que o registro está commitado.

A Q3 (b) não é a recomendação da proposta (Q3 (a)): o `especificador` ajusta specs, `design.md` e
`tasks.md` antes do apply. Commit da proposta: `1a65180`, igual ao `ls-remote` de
`feat/pagina-contato`.

## Evidência herdada da `pagina-projetos`

Escrita pelo líder técnico. Tarefa 1.1 (Q10 (b) da `pagina-projetos`). Evidência vinda da sessão
da `pagina-projetos`, 23/11/2026, colada pelo Gabriel no briefing desta change, transcrita literal:

P23 e produção:

| Comando | Código | Resultado |
| --- | --- | --- |
| Host da prévia, montado pela regra contra o painel | — | portal-liacup-git-feat-pagina-projetos-liacup1.vercel.app, igual letra por letra; 46 caracteres antes de .vercel.app |
| Commit da prévia, dito pelo Gabriel | — | b2572e6fcec925f93b4d1769bfbce5167947b147 = git rev-parse HEAD = ls-remote da branch |
| Forma da linha do .env, só por contagem | — | 1 linha com o nome · 0 fora da forma · curl 8.7.1 |
| P23, forma com o segredo, em /projetos | 0 | HTTP/1.1 200 OK, sem Location, X-Matched-Path: /projetos, X-Robots-Tag: noindex, X-Vercel-Cache: PRERENDER |
| Forma 3, segredo na árvore de trabalho | 1 | saída vazia |
| Forma 4, segredo no índice | 1 | saída vazia |
| Produção, curl -I https://www.liacup.com.br/ | 0 | 200, X-Matched-Path: /em-construcao |
| Produção, curl -I https://www.liacup.com.br/projetos | 0 | 307, Location: / |

Busca commit a commit e push #46:

| Comando | Código | Resultado |
| --- | --- | --- |
| conferir-ambiente-local --change pagina-projetos | 0 | 20 comparados · 20 iguais · 15 chaves do .git/config, 0 fora da lista |
| git rev-parse main e git ls-remote origin refs/heads/main | — | c12cf9b337d6ab70d02754593ba85bb65a5ca2a5 nos dois |
| Forma 2 do segredo, <rev> = fd31de0 | 1 | saída vazia |
| Forma 2 do segredo, <rev> = b2572e6 | 1 | saída vazia |
| API pública, jobs da #46 (id 45216646759, push do merge c12cf9b) | — | http 200 · jobs: 4 · success: 4 · Verificacoes 9 min 24 s · Build para a barreira da chave 54 s · Tipos do banco 46 s · Chave fora do pacote 17 s |
| API pública, implantações do chave-de-servico-da-main | — | 2, todas com ref: main (c12cf9b e e31d49a) |

Desvio: o merge do PR #25 (c12cf9b, 16:27 UTC) veio antes do P23 (16:38 UTC).

## Prova do push: execução #46

Escrita pelo líder técnico. Tarefa 1.1, 23/11/2026, 17:00:42 UTC. Pela API pública do GitHub, sem
autenticação e sem `gh`, `curl -q -sS --max-time 20 --proto =https` sobre
`https://api.github.com/repos/Liga-Academica-Liacup/portal-liacup` (R). JSON reduzido aos campos do
critério:

```
== GET R/actions/runs?per_page=6 · http 200
45216646759 #46 push main c12cf9b completed success tentativa 1 2026-11-23T16:27:05Z 2026-11-23T16:36:32Z
45214873733 #45 pull_request feat/pagina-projetos b2572e6 completed success tentativa 1 2026-11-23T16:17:46Z 2026-11-23T16:26:23Z
45185945480 #44 push main e31d49a completed success tentativa 1 2026-11-23T13:38:35Z 2026-11-23T13:47:26Z
45184520538 #43 pull_request chore/completar-ci-do-novo-fluxo 2138893 completed success tentativa 1 2026-11-23T13:30:02Z 2026-11-23T13:37:14Z
45099474006 #42 push main d7cc5c9 completed success tentativa 2 2026-11-23T02:18:45Z 2026-11-23T02:39:40Z
45095701421 #41 pull_request chore/ajustar-ci-ao-novo-fluxo e65e319 completed success tentativa 1 2026-11-23T01:38:30Z 2026-11-23T01:46:13Z
== GET R/actions/runs/45216646759/jobs · http 200
jobs: 4 · success: 4
Verificacoes · success · 9 min 24 s
Build para a barreira da chave · success · 0 min 54 s
Tipos do banco · success · 0 min 46 s
Chave fora do pacote · success · 0 min 17 s
== GET R/deployments?environment=chave-de-servico-da-main · http 200
implantações: 2 · refs: ["main"]
8004561196 main c12cf9b 2026-11-23T16:28:02Z
8000304899 main e31d49a 2026-11-23T13:39:56Z
== GET R/deployments?environment=segredos-da-main · http 200
implantações: 4 · refs: ["main"]
8004537203 main c12cf9b 2026-11-23T16:27:06Z
8000273315 main e31d49a 2026-11-23T13:38:36Z
7989009319 main d7cc5c9 2026-11-23T02:32:55Z
7988826856 main d7cc5c9 2026-11-23T02:18:46Z
```

- **A #44 está em `tentativa 1`:** o Re-run não aconteceu, como o Gabriel disse. A #46 é o push do
  merge da `pagina-projetos` (`c12cf9b`), com os quatro jobs verdes; os números batem com a
  evidência herdada acima.
- **Decisão do Gabriel, literal:** "Re-run da #44: não aconteceu. Vale como prova a execução #46, do
  push do merge da pagina-projetos: às 10:50 de 23/11 o Gabriel já via 1 segredo em cada ambiente,
  então a chave já tinha saído do segredos-da-main, e a #46 (16:27 UTC) rodou os quatro jobs
  verdes."
- **Palavra do Gabriel, não medida:** a saída da chave do `segredos-da-main` antes da #46. A API
  pública não lê segredos; ela mostra só que a #46 implantou nos dois ambientes, a partir da
  `main`.

## Prints da Q3 (tarefa 1.3)

Escrito pelo líder técnico. Os seis `prints/q3-opcao-{a,b,c}-{390,1280}.png` são esboços estáticos
para decisão, não telas do site. Foram gerados pelo líder técnico com um script Playwright
temporário, fora do repositório, **sobre o protótipo**: abre `prototipo/Portal-LIACUP.html` do
disco, vai a Contato pelo menu, e no DOM tira o formulário, tira a frase da faixa (Q1 (a)), troca os
espaços de imagem pela logo e pelo ícone do Gmail de `assets/`, tira as legendas (§6), troca
`liacup@unb.br` e o endereço pelos dados certos (endereço completo da Q2 (b)), corrige o rodapé e
tira a linha de demonstração dele; depois aplica a composição de cada opção. Cabeçalho, menu e
rodapé continuam os do protótipo (com Notícias, Materiais, Galeria e "Painel", que o site não tem):
o que se decide é só o corpo da página. Uma faixa escura no topo diz "ESBOÇO PARA DECISÃO, NÃO É O
SITE". Fontes carregadas nas 6 capturas (Caprasimo e Figtree, as do próprio protótipo); rolagem
horizontal 0 nas 6. Em 390 as três opções são iguais, como a proposta prevê: os três PNG de 390 têm
o mesmo sha256 (`c7c068a5faea38ee…`).

## dev-frontend

Tarefas 2.1, 2.2 e 2.3, 23/11/2026, sobre `1a65180`. As três marcadas `[x]`.

- **Arquivos:** A `src/componentes/padroes/{contato-da-liga.ts, QuadroDeContato.{tsx,module.css},
  QuadroDoInstagram.tsx, QuadroDoEmail.tsx, QuadroOndeEstamos.tsx, FigurasDeContato.module.css,
  ListaDeContatos.{tsx,module.css,test.tsx}}`, `src/features/contato/{tipos,conteudo,conteudo.test}.ts`,
  `src/features/contato/componentes/TopoDoContato.{tsx,module.css}`,
  `src/app/(site)/(publicas)/contato/page.{tsx,module.css}`, `public/icone-email-gmail.png` (sha256
  `5d635b96…87d2`, igual ao de `assets/`) · M `paginas-publicas.json` (+9 −0, depois de `/equipe`),
  `paginas-publicas.test.ts` (+11 −5), `tokens.css` (+23 −0). Maior arquivo: 118 linhas.
- **Tokens novos** (protótipo, seção Contato, salvo o último): `--largura-da-secao-de-contato` 1100 px,
  `--colunas-do-contato` `minmax(0,1fr) minmax(0,1.1fr)`, `--espaco-entre-colunas-do-contato` 64 px
  (max-width, colunas e gap da grade `[data-resp]`), `--espaco-fim-da-secao-de-contato` 80 px,
  `--font-size-titulo-do-contato` `clamp(36px,4.4vw,52px)` e `--line-height-titulo-do-contato` 1.05
  (`h1`), `--tamanho-circulo-de-contato` 100 px, `--largura-borboleta-de-contato` 44 px (`<svg
  width="44">`), `--font-size-valor-de-contato` 16 px; `--tamanho-icone-do-email` 52 px, medido no
  esboço `q3-opcao-b-1280.png` (o "M" com 49,5 px, 96 % da imagem; fundo `--color-neutral-100`).
- **Grade lida no protótipo:** corte `@media (max-width: 1024px)` → `[data-resp] {1fr; gap 34px}`
  (aqui `--space-8`, 35,2 px); colunas 1fr e 1,1fr; 64 px entre elas; largura máxima 1100 px.
  **Círculo:** 100 × 100 px. **Posição medida (3000):** 1280, lista **à direita** do topo, x 647,3
  contra topo x 90 (w 493,3), topos iguais em y 181,2 (**diferença 0,0 px**), colunas 493,3 + 542,7;
  1024, lista **abaixo**, 35,2 px sob o topo, uma coluna de 971,2 px. Rolagem 0 nas 7 larguras.
- **RP-09, pela fórmula do WCAG 2.x, sobre `--color-bg` #f5ead8:** sobretítulo `--color-accent-700`
  6,91:1; título e dado `--color-accent-800` 9,05:1; rótulo **`--color-neutral-700` 5,53:1** (o
  `--color-neutral-600` do protótipo dá 3,61:1, reprovado). No hover (#ecddd4): rótulo 4,97, dado
  8,14; pressionado (#e5d3d1): rótulo 4,57, dado 7,48. Anel de foco `--color-accent-700` 6,91:1.
- **Estados (ADR-0006):** repouso sem fundo; hover e pressionado com os fundos do Botao fantasma e o
  dado sublinhado; foco no anel do `global.css`, que segue o raio e contorna o quadro. O link tem
  `::after` retangular: os 4 cantos a 1 px pertencem ao link, nos 2 links, em 390 e 1280.
- **Comandos:** `npm run lint` 0 · `verificar:tokens` 0 (158 arquivos) · `npm run verificar` 0
  (specs 14 passed, 0 failed; chave 662 arquivos) · `npm test` 0, 24 arquivos, **427 testes, 0
  falhas**, com `quadros: 3`, `quadros na composição da inicial: 2`, `contato · topo: 2 rótulos` e
  `Entradas da lista de páginas públicas conferidas: 6` · `git diff --exit-code main --
  src/componentes/layout src/componentes/ui` 0 · `npm run build` 0 (`○ /contato`) · `curl -s` 3000
  `/contato` 200, 1 `<h1>` "Fale com a Liga", `<title>Contato · LIACUP</title>`, os 7 termos da 2.3
  com 0 cada · 3001 `/contato` `307 http://localhost:3001/` · servidores derrubados no fim.
- **`npx playwright test`: código 1, 441 passaram, 7 falharam**, as 7 no mesmo teste
  (`paginas-publicas.spec.ts:599`, uma por largura): a constante da entrega espera 5 páginas e o
  menu sem Contato. É a tarefa 3.2 do `qa-acessibilidade`, fora do `src/`. Na mesma execução:
  `páginas verificadas: 6 de 6`, `rotas verificadas: 4`, axe 0, foco visível em 73 controles (390).
- **Melhorias de UI ou UX propostas:** nenhuma além da Q3 (b). A forma arredondada do hover e do
  foco nos quadros clicáveis não está no protótipo (lá não são links): fica para o
  `guardiao-visual` classificar.
- **Incompleto:** o e2e não está verde (7 falhas acima, esperadas até a 3.2). As demonstrações de
  falha do D6 são do `qa-acessibilidade`. O `@media (hover: hover)` do hover não foi medido em
  aparelho de toque de verdade.
- **Q5 (a), 23/11:** "aprovado pelo Gabriel na Q5 (a) da pagina-contato, 23/11/2026" nos comentários
  de `--tamanho-icone-do-email` (`tokens.css`) e de `.circuloDoEmail` (`FigurasDeContato.module.css`),
  sem valor alterado · `verificar:tokens` 0 (158 arquivos) · `lint` 0 · `prettier --check` 0 ·
  `git diff --numstat main -- src/estilos/tokens.css` `23 0`.

## dev-dados

Não entrou: a change não lê nem grava no banco (R1, conteúdo fixo).

## guardiao-visual

Tarefa 4.1, 23/11/2026, árvore de trabalho da `feat/pagina-contato` sobre `1a65180`. `npm run build`
código 0 (`○ /contato`); `iniciar-servidor.mjs` publicado 3000 e não publicado 3001, derrubados no
fim (3000 a 3002 livres). Chromium do Playwright, escala 1, 390 × 844 e 1280 × 800, página inteira,
movimento reduzido, depois das fontes e imagens; medidas no DOM do site e do protótipo; captura,
recorte e montagem por script no scratchpad, fora do repositório. **Origem dos PNG (RP-13):** cada
`lado-a-lado-*` põe `prototipo/prints/` à esquerda (no do esboço, `prints/q3-opcao-b-1280.png`) e a
captura do site à direita; os `raiz-nao-publicada-*` são a captura da 3001. Os 6 `q3-opcao-*` não
foram tocados.

- **Comparado:** `/contato` × 390 e 1280, e 1280 contra o esboço da Q3 (b); menu aberto 390;
  cabeçalho 1280; rodapé × 390 e 1280; estados dos quadros em 1280; raiz não publicada × 390 e 1280
  · **10 PNG** em `openspec/changes/pagina-contato/prints/`:
  `lado-a-lado-{contato-390,contato-1280,contato-esboco-q3b-1280,menu-aberto-390,cabecalho-1280,rodape-390,rodape-1280,estados-1280}.png`
  e `raiz-nao-publicada-{390,1280}.png` · rolagem horizontal 0 nas 2 larguras
- **Raiz não publicada:** **0 de 329.160** (390) e **0 de 1.024.000** (1280) pixels diferentes
  contra os arquivados da `pagina-projetos`; sha256 iguais
- **Contra o esboço Q3 (b), 1280:** corpo de 470 contra 471 px; coluna da esquerda na mesma caixa
  (x 90, 386 × 83); a da direita em x 647, 501 × 335 contra 336; topo da lista e do sobretítulo
  alinhados (diferença 0,0 px). Difere em: rótulos mais escuros (item 8); Gmail inteiro, cantos
  retos, 52 px, contra o do esboço 1 a 2 px maior e com os cantos de baixo cortados (item 5);
  cabeçalho e rodapé, que no esboço são os do protótipo (itens 10 a 20). Em 390, os blocos do corpo
  a 1 px ou menos do esboço
- **Diferenças: 20** — 6 adaptação aprovada · 4 correção obrigatória · 9 regra ou decisão do
  Gabriel ou do briefing (1 delas a melhoria aprovada Q3 (b)) · **1 melhoria a aprovar** · **0
  defeito**
  1. corpo 1280 · sem formulário; quadros na coluna da direita; página de 941 contra 1206 px ·
     melhoria aprovada pelo Gabriel (Q3 (b)), referência `q3-opcao-b-1280.png`
  2. topo · sem a frase; em 390 a lista sobe para 35,2 px sob o título · decisão (Q1 (a))
  3. quadros · sem as legendas "Foto de perfil…" e "Logo do e-mail" · correção obrigatória (§6)
  4. Instagram · logo da liga no círculo de 100 px, no lugar do espaço tracejado · decisão (§5, §7)
  5. E-mail · ícone do Gmail de 52 px num círculo `--color-neutral-100` (#f9f4ed), no lugar do
     espaço tracejado · **melhoria a aprovar**: a §7 decide o ícone, não o tamanho nem o fundo; não
     está na tabela da §3; segue o esboço que o Gabriel viu na Q3, a 2 px ou menos. Recomendo
     aceitar, numa linha no Portão 2. **Superado** (nota do líder técnico, Q7 (a)): o Gabriel
     aprovou na Q5 (a), 23/11/2026; o item passa a decisão do Gabriel, e a contagem fica 0
     melhoria a aprovar
  6. E-mail · `liacup.unb@gmail.com` · correção obrigatória (§6)
  7. Onde estamos · endereço completo, 2 linhas em 1280 e 4 em 390 · correção obrigatória (§6) com a
     forma da Q2 (b)
  8. rótulos · `--color-neutral-700` #645c50 contra #82796a do protótipo · adaptação (§3, ADR-0003)
  9. Instagram e E-mail · hover e pressionado com fundo em pílula (o do `.btn-ghost` do protótipo,
     lilás a 10 %) e dado sublinhado; foco com anel de 2 px `--color-accent-700` em pílula; repouso
     igual ao protótipo · adaptação (§3, ADR-0006): a §7 faz do quadro um controle, e o ADR-0006
     pede os estados; a forma é a dos botões fantasma do próprio protótipo
  10. cabeçalho 1280 · 125,2 contra 114,4 px; links com 44 px de largura mínima, vãos entre os textos
      de 26,0, 21,0, 17,9 e 17,9 px contra 22 no protótipo · adaptação (§3, alvo de toque); vem do
      cabeçalho, fora do diff desta change
  11. cabeçalho e menu · só Início, Sobre, Projetos, Equipe e Contato, sem os outros 5 nem "Painel"
      · regra (páginas que existem; §4, R3)
  12. "Processo seletivo" no cabeçalho e no menu · `#82558f` · adaptação (§3, ADR-0003)
  13. página atual · no menu, barra e sublinhado em "Contato" (gabarito: só barra); no rodapé,
      "Contato" sublinhado; no cabeçalho, a barra como no gabarito · adaptação (§3)
  14. botões de abrir e fechar o menu · borda mais escura · adaptação (ADR-0003)
  15. menu aberto e rodapé · Contato como último destino; "Conteúdo" com Projetos, Equipe e Contato,
      na ordem do gabarito; "Portal" só Início e Sobre · regra (páginas que existem)
  16. rodapé 1280 · passo de 44 px contra 31,4 em Portal e Conteúdo · regra (§7, Q14 (a))
  17. rodapé · e-mail e "FCTS · Campus UnB Ceilândia · Brasília/DF" · correção obrigatória (§6)
  18. rodapé · ícones, "liacup.unb" sem @, passo de 44 no contato · regra (§7)
  19. rodapé · linha final centralizada, sem "Protótipo do Portal LIACUP…" · regra (§7)
  20. rodapé 390 · sem "Painel da diretoria" · regra (§4, R3)
- **Medido, não contado (sem efeito visível):** vão entre quadros 17,6 contra 18 px; sobretítulo a
  56 px do fim do cabeçalho nos dois; altura de linha do sobretítulo 18,6 contra 19,2; cabeçalho 390
  com 61,6 contra 62
- **Não comparado:** nada. Incompleto: contraste em pixel renderizado (cores do estilo calculado);
  o estado pressionado não foi capturado (só o estilo lido); hover em aparelho de toque

## qa-acessibilidade

Tarefas 3.1, 3.2 e 3.3, 23/11/2026. A `tests/e2e/contato.spec.ts` (979 linhas, 7 testes) · M
`tests/e2e/paginas-publicas.spec.ts` (+5 −5: `ENTREGA` com 6 endereços, menu com Contato, "Conteúdo"
Projetos, Equipe, Contato; nome e comentário do teste). As três marcadas `[x]`.

- **Cobertura:** 6 páginas da lista × 7 larguras (360 a 1280); `/contato` nos 2 modos; a composição e
  a ordem de foco de `/contato` nas 7 larguras dentro de cada projeto.
- **Medições** (`npx playwright test`, **código 0, 497 passaram, 0 falharam**): axe **0** (49 linhas
  `Violacoes de acessibilidade: 0`, nenhuma com 1 ou mais; `/contato` 0 nas 7) · rolagem horizontal
  **0** larguras com defeito (`/contato` scrollWidth = clientWidth nas 7) · alvos **115** medidos /
  **0** abaixo de 44 px de 360 a 1024, **97** / **0** em 1280; quadros clicáveis **2** / **0** (232,8
  × 100 e 306,1 × 100 px em 360) · foco **73** / **0** sem foco visível de 360 a 1024, **97** / **0**
  em 1280; nos 2 quadros, contorno `2px solid rgb(104, 63, 116)`, nenhum em repouso e no hover ·
  campos de formulário: 0 · `páginas verificadas: 6 de 6` (7 larguras) e `rotas verificadas: 4` (14
  linhas, os 2 modos) · `npm test` 0 (427 testes) · `lint` 0 · `verificar:tipos` 0 · `prettier
  --check` dos 2 arquivos 0 · `git diff --exit-code tests/e2e/interruptor.spec.ts playwright.config.ts` 0.
- **Contadores de `/contato`, nas 7 larguras:** trechos do §1 **3** (Instagram, E-mail, Sede) ·
  rótulos da §7 **6** (5 e a frase ausente) · com divergência **0** · `travessões trocados: 1` ·
  `quadros: 3` (`<a>`, `<a>`, `<div>`) · texto fora do documento **0** caracteres · só para leitor de
  tela 1, "(abre em nova aba)" · termos proibidos **27** (9 da spec e 5 exemplos dos canais lidos do
  protótipo, na página; a frase e 12 textos do formulário lidos do protótipo, no conteúdo; "E-mail"
  fora, por ser rótulo da §7) · achados **0** · `links conferidos: 2 de 2`, 4 de 4 cantos no link
  em cada (o mais perto a 25 px do texto), aba nova sem `opener` e sem `Referer`, `mailto:` no clique ·
  1 `h1`, nenhum `h2`, 1 lista anunciada com 3 itens, 3 imagens e 0 anunciadas · `composição: 6
  larguras em uma coluna, 1 em duas` (1280: lista 64 px à direita do topo, **diferença de topo 0 px**)
  · foco `Instagram → E-mail` igual nas 7 · `contato no interruptor: 2 de 2 modos`.
- **Verificação nova demonstrada falhando** (RP-12; cada uma vermelha com código 1 e verde com código 0
  depois de desfeita pela cópia; e2e nas 7 larguras):

| # | Violação (`DEMO-RP12`) | Vermelho | Verde |
| --- | --- | --- | --- |
| 1 | `gmial` no e-mail | 7 falhas: `trecho "§1, E-mail" difere (palavra 1: esperado "liacup.unb@gmail.com", recebido "liacup.unb@gmial.com")` | 7 de 7, `com divergência: 0` |
| 2 | sede com " — " | unidade 2 falhas: `termos proibidos achados no bloco: … [ '—' ]`; e2e 14: `(palavra 2: esperado "·", recebido "—")` e `"—" em quadro 3` | unidade 6 de 6; e2e 14 de 14, `achados: 0` |
| 3 | `liacup@unb.br` no @ | unidade 2: `[ "liacup@unb.br" ]` e nome `Instagram @liacup.unb liacup@unb.br (…)`; e2e 14: `"liacup@unb.br" em quadro 1` | 6 de 6; 14 de 14 |
| 4 | sem `target` | 7: `quadro "Instagram": o link tem target null, e não "_blank"` | 7 de 7, `2 de 2` |
| 5 | `rel="noopener"` | 7: `rel "noopener", sem noreferrer` e `a aba nova recebeu Referer "http://localhost:3000/"` | 7 de 7 |
| 6 | link só no valor | 7: `o ponto (20, 217), canto superior esquerdo, a 119 px do texto, fora do link: caiu em <div>` (4 cantos) e `o link mede 207.2 × 24.8 px, abaixo de 44` | 7 de 7, 4 de 4 cantos |
| 7 | descrição com 161 | unidade 2: `descrição com 161 caracteres no endereço "/contato"; o tamanho é de 70 a 160` | 19 de 19, `"/contato" 129` |
| 8 | `/contato` antes de `/equipe` | unidade 1: menu esperado `…"Equipe", "Contato"`, recebido `…"Contato", "Equipe"` | 19 de 19 |
| 9 | `ul` sem `role` | `listas-anunciadas` 7: `/contato: lista sem marcador e sem role="list": <ul> no conteúdo, 3 itens` | 7 de 7, `sem role="list": 0` |
| 10 | 307 pedido à 3000 | 7: `modo não publicado: /contato recebeu 200 sem Location (esperado 307 para /)` · `1 de 2 modos` | 7 de 7, `2 de 2 modos` |
| 11 | grade `minmax(0, 1fr)` | 7: `1280 px: esperada a lista inteira à direita do título (x ≥ 1190), recebida abaixo (lista em x 90, y 331.5 …)` · `7 larguras em uma coluna, 0 em duas` | 7 de 7, `6 … 1 em duas` |

- **Depois da 11:** `sha256sum -c` **OK** nos 6 arquivos tocados (`contato-da-liga.ts`,
  `QuadroDeContato.tsx`, `paginas-publicas.json`, `ListaDeContatos.tsx`, `contato.spec.ts`,
  `page.module.css`; nenhuma em `src/proxy.ts`) · `git status --porcelain --untracked-files=all` igual
  ao de antes da 1 (diff 0) · `git grep -c --untracked DEMO-RP12 -- src tests/e2e` **código 1**. No
  JSON, sem comentário possível, o marcador foi texto da descrição (7) e chave `"DEMO-RP12"` (8).
- **Defeito do meu teste, achado na 6 e corrigido:** com o link fora do canto, o teste esperava a aba
  nova até o tempo limite, em vez de nomear o canto, e media o alvo pelo quadro, e não pelo link. Por
  isso a 4 e a 5 foram refeitas com o spec final; a suíte inteira rodou de novo depois (os números acima).
- **Defeitos na página:** nenhum · **sem cobertura:** VoiceOver e WebKit de verdade (papel de lista pelo
  atributo e pela árvore do Chromium); toque em aparelho de verdade (`@media (hover: hover)`); a página
  em construção "pixel a pixel" (é do `guardiao-visual`); contraste só pelo axe (os pares do dev não
  foram medidos de novo); o estado pressionado não foi medido; diálogo: nenhum novo, e o do menu só
  pela suíte que já existe (verde).

## revisor

Passagem 1, 23/11/2026, registrada pelo líder técnico.

- **Veredito:** aprovado com ressalva
- **Conferiu:** 34 de 50 arquivos do diff (os 33 de texto e 1 PNG) · 6 critérios de aceite (o P23
  declarado em aberto na 4.5) e os 17 cenários da spec `pagina-contato` · 20 regras (PADROES §1,
  §2.2 a §2.4, §2.6, §3, §3.1, §5, §10, §11.1; RP-02, RP-03, RP-09, RP-12, RP-13; `SEGURANCA.md`
  §7; princípios 4, 5, 8, 9 e 10).
- **Achados:**
  1. `docs/SEGURANCA.md:752` e `relatorio.md`: os 10 PNG do `guardiao-visual` citam "Q6", que
     nenhum artefato definia; a origem ficou pendente, e não "ativo aprovado" com quem aprovou.
     Regras: `SEGURANCA.md` §7, numeração Qn do `CLAUDE.md`, princípio 10.
  2. `src/estilos/tokens.css:454` (`--tamanho-icone-do-email`, 52 px) e
     `FigurasDeContato.module.css:15-21` (fundo `--color-neutral-100`): origem no esboço da Q3,
     não no protótipo; a Q3 (b) aprovou a composição, não o tamanho nem o fundo do ícone. Pede
     aprovação nominal do Gabriel. Regras: RP-03 como a proposta o escreve, princípio 4.
  3. Observação, não defeito: `tests/e2e/contato.spec.ts:662` compara o nome acessível sem
     distinguir maiúsculas; a forma exata está coberta em `ListaDeContatos.test.tsx:70` e `:78`.
- **Não conseguiu conferir:** os hunks e os números de `git diff` (sem terminal); o sha256 da cópia
  do Gmail; 15 dos 16 PNG; as saídas de lint, testes, Playwright, Lighthouse e artefatos; os
  contrastes do RP-09; a leitura de tela dos rótulos em maiúsculas por CSS.
- **Destino dos achados, pelo líder técnico:** o 1 e o 2 não pedem correção de código: pedem
  decisão do Gabriel, que passam a ser a Q5 e a Q6 (seção seguinte), feitas antes do guardião para a
  linha do §7 já entrar final. O 3 fica como observação.

Passagem 2, 23/11/2026, numa invocação nova, sem a seção anterior como entrada, depois da Q5 (a),
da Q6 (a) e da troca dos comentários do ícone. Registrada pelo líder técnico.

- **Veredito:** aprovado com ressalva. Nenhum defeito de código, camada, token ou texto.
- **Conferiu:** 32 de 33 arquivos de texto (fora o `.openspec.yaml`), 1 PNG visto e os 16 de
  `prints/` contados pelo nome · 6 critérios de aceite, 17 cenários de `pagina-contato`, 3
  MODIFIED de `navegacao-publica` e 1 de `seo`, as decisões Q1 a Q6 · 19 regras. Os 9 tokens do
  protótipo conferidos no `Portal-LIACUP.html`; a soma do §7 dá 105.
- **Achados:**
  1. `docs/SEGURANCA.md:750` · baixa · a linha da cópia `public/icone-email-gmail.png` diz "Ativo
     aprovado" sem quem aprovou nem quando · `SEGURANCA.md` §7, princípio 10.
  2. `relatorio.md:493-496` · baixa · o parágrafo da tarefa 4.2 ainda diz "a aprovar … (Q6)", sem
     nota de que foi superado · princípio 10.
  3. Observação, não defeito: `ListaDeContatos.tsx:32-33` usa `key={indice}` sobre
     `Children.toArray`, que já dá chave; com zero filhos sai um `<ul>` vazio (o D5 declara o vazio
     impossível hoje).
- **Não conseguiu conferir:** os hunks de `git diff` (aceitou os números do líder técnico); o
  sha256 da cópia; 16 de 17 PNG; as saídas dos comandos; as demonstrações do RP-12; os contrastes;
  o estado pressionado; o `openspec validate`.
- **Correção, pelo líder técnico:** o achado 1, com "Aprovada pelo Gabriel no Portão 1 da
  `pagina-contato`, 23/11/2026, com a proposta (item 6) e o `design.md` (D1)" na linha; o achado 2,
  com a nota "superado" no parágrafo da 4.2. O 3 fica como observação. Depois da correção, o
  `revisor` roda de novo (passagem 3) e o `guardiao-appsec` roda.

Passagem 3, 23/11/2026, numa invocação nova, depois da correção da passagem 2. Registrada pelo líder
técnico.

- **Veredito:** aprovado com ressalva. Nenhum defeito de código, camada, token, texto ou
  verificação.
- **Conferiu:** 32 de 33 arquivos de texto e 1 de 17 binários · 6 critérios de aceite (5
  sustentados; o P23 em aberto, na 4.5), 17 cenários, 3 MODIFIED de `navegacao-publica` e 1 de
  `seo`, as decisões Q1 a Q6 · 21 regras. 9 dos 10 tokens novos conferidos no protótipo; o 10º é a
  Q5 (a). O §7 cobre 1 + 6 + 10 arquivos, com quem aprovou, e soma 105.
- **Achado que pede correção:** 1. `relatorio.md:486` · baixa · o campo "Arquivos fora do escopo,
  por agente" ainda é o texto do modelo, e faltam as conferências do `dev-frontend` na Q5 (a) e
  das passagens 1 e 2 do `revisor` · princípio 10 e obrigação do líder técnico no `CLAUDE.md`.
- **Observações:** o item 5 e o resumo do `guardiao-visual` sem nota de que a Q5 (a) decidiu; a
  Q5 (a) só nos comentários, sem linha na `REFERENCIA-VISUAL.md` §7; `QuadroDeContato.module.css:42-46`,
  a camada `::after` cobre também o texto do dado e pode impedir a seleção do @ e do e-mail; a
  inicial do protótipo usa círculo de 104 px e vão de 20 px, diferença futura para a
  `inicio-completo`; `contato.spec.ts:662` sem distinguir maiúsculas.
- **Não conseguiu conferir:** o mesmo da passagem 2.
- **Parada, pelo líder técnico:** é a terceira rodada seguida em que o `revisor` pede correção. Pela
  regra 4 da dieta, o líder técnico parou e levou ao Gabriel (Q7 e Q8, abaixo), sem corrigir. O
  `guardiao-appsec` ainda não rodou.
- **Medição da observação do `::after`, pelo líder técnico** (servidor publicado na 3000, Chromium
  do Playwright, 1280 px, script temporário fora do repositório): no centro do texto do e-mail e do
  @, `document.elementFromPoint` devolve o `<a>`, e o triplo clique seleciona `""` nos dois; no
  endereço, que não é link, devolve o `SPAN` e seleciona a linha. O servidor foi parado (0 processo
  na porta 3000).

Passagem 4, 23/11/2026, autorizada na Q7 (a), só sobre as correções da Q7 (a) e da Q8 (b), numa
invocação nova. Registrada pelo líder técnico.

- **Veredito:** aprovado com ressalva. As cinco correções fazem o que as decisões literais pedem.
- **Conferiu:** 5 correções em 2 arquivos, palavra por palavra contra as decisões; contradição
  procurada em 5 lugares (constitution, `conteudo-institucional.md`, §7 linhas 112 e 126, spec
  `pagina-contato`, D4); o leitor da §7 no e2e (`contato.spec.ts:86-109`), que da linha 113 só lê o
  destino do Instagram; a conta de 175 testes (25 × 7 larguras).
- **Achado que pede correção:** 1. `docs/REFERENCIA-VISUAL.md:113` e este relatório · baixa · a §7
  diz que a cópia pelo menu foi "conferida em 23/11/2026", e nenhum registro diz quem a conferiu
  nem como; o "tocar e segurar" no celular nunca foi medido aqui. O texto da §7 é literal do
  Gabriel; falta a linha de quem conferiu, ou "não medido" · princípio 10.
- **Observações:** 2. o menu do link do Instagram copia `https://www.instagram.com/liacup.unb/`, e
  não `@liacup.unb`; "Copiar endereço de e-mail" só existe no `mailto:`. 3. a célula 113 tem duas
  frases seguidas que começam por "O endereço e o @ continuam escritos no quadro", com motivos
  diferentes (20/11 e 23/11). 4. o resumo do `guardiao-visual` ainda diz "1 melhoria a aprovar";
  só o item 5 tem a nota. 5. o registro do `guardiao-visual` não cita o `conferir-ambiente-local`,
  e só a passagem da proposta cita o `ls-remote`. 6. `contato-da-liga.ts:31` diz "para quem
  quiser copiar", e depois da Q8 (b) o texto dos links não se seleciona.
- **Não conseguiu conferir:** os números de `git diff`; a execução do e2e; o `git status` de cada
  passagem; o `prettier`; o menu de contexto real.
- **Parada, pelo líder técnico:** o `revisor` pediu correção de novo. Pela Q7 (a), parado sem
  nova rodada e levado ao Gabriel (Q9). O `guardiao-appsec` não rodou.

## Questões ao Gabriel antes do Portão 2

A numeração continua a do Portão 1 (Q1 a Q4).

**Q5. O ícone do Gmail no quadro "E-mail".** No protótipo, o espaço é um `image-slot` vazio, sem
tamanho de ícone. O site segue o esboço que o Gabriel viu na Q3: o ícone com 52 px num círculo
`--color-neutral-100` de 100 px (`prints/lado-a-lado-contato-1280.png` e
`lado-a-lado-contato-esboco-q3b-1280.png`).

- (a) Aceitar como está, com a origem "esboço da Q3, aprovado na Q5 (a)" no comentário do token.
  Custo: nenhum.
- (b) O ícone ocupando o círculo inteiro, sem fundo, como a logo do Instagram. Custo: o dev muda
  dois arquivos, e o e2e, o lado a lado, o revisor e o guardião rodam de novo.
- Recomendo (a), porque a marca do Gmail precisa de margem para não ser cortada pelo círculo.

**Q6. Os 10 PNG do `guardiao-visual`** (`prints/lado-a-lado-*` e `raiz-nao-publicada-*`) como
ativos versionados.

- (a) Aprovar os 10. A linha do `SEGURANCA.md` §7 passa a dizer "Ativo aprovado … Aprovados pelo
  Gabriel na Q6 (a), 23/11/2026, antes do Portão 2", como a da `pagina-projetos`. Custo: nenhum.
- (b) Aprovar só alguns ou pedir outro. Custo: o `guardiao-visual` refaz, e a linha muda.
- Recomendo (a).

## Decisões do Gabriel sobre a Q5 e a Q6, 23/11/2026

Texto literal da mensagem do Gabriel:

> Decisões do Gabriel (registre literal no relatorio.md):
> Q5 (a): o ícone do Gmail fica como está, 52 px num círculo --color-neutral-100.
> Q6 (a): aprovados os 10 PNG do guardiao-visual. A pasta prints/ tem 16 arquivos: confira que a linha do SEGURANCA.md §7 cobre também os 6 esboços da Q3 (q3-opcao-*), que já estão no commit 1a65180, aprovados como esboço na Q3. Se a linha cobrir só os 10, ajuste para os 16 antes de chamar o guardião.
>
> Depois: guardiao-appsec com o checklist inteiro, archive e Portão 2. O P23 em /contato é registrado e commitado antes do merge, e o Gabriel só faz o merge quando você disser que o registro está commitado.

- **Conferido, líder técnico:** a pasta `prints/` tem 16 PNG, e o `docs/SEGURANCA.md` §7 os cobre
  em duas linhas: `q3-opcao-{a,b,c}-{390,1280}.png` (6, "vistos e decididos pelo Gabriel no
  Portão 1 … (Q3 (b))") e `{lado-a-lado,raiz-nao-publicada}-*.png` (10). A segunda passou de "a
  aprovar" para "Ativo aprovado … Aprovados pelo Gabriel na Q6 (a), 23/11/2026, antes do Portão 2".
  Não foi preciso juntar as duas.
- **Q5 (a):** o `dev-frontend` acrescenta "aprovado pelo Gabriel na Q5 (a)" aos dois comentários de
  origem do ícone (`tokens.css` e `FigurasDeContato.module.css`); nenhum valor muda.
- Correção depois da revisão do diff: o `revisor` roda de novo, numa invocação nova, sem o
  relatório anterior, e depois o `guardiao-appsec`.

**Q7. Como seguir depois da terceira rodada do `revisor`.** O que ele pede é registro do próprio
líder técnico (o campo de escopo do relatório), sem código.

- (a) O líder técnico preenche o campo de escopo e põe a nota "superado" no item 5 do
  `guardiao-visual`; o `revisor` roda uma 4ª vez, só sobre o diff dessa correção (como a 4ª
  rodada autorizada na `pagina-projetos`), e o `guardiao-appsec` roda com o checklist inteiro. Se
  algum pedir correção de novo, para e volta ao Gabriel, sem nova rodada. Custo: uma passagem curta
  do `revisor`.
- (b) Preencher e seguir direto ao guardião, sem 4ª passagem do `revisor`. Custo: contraria a
  regra de que toda correção depois da revisão passa pelo `revisor` de novo.
- Recomendo (a).

**Q8. O @ e o e-mail não se selecionam com o mouse.** A camada que faz os cantos do quadro abrirem
o link cobre também o texto; medido: triplo clique seleciona `""` no e-mail e no @. A §7 manda o
endereço e o @ escritos "para quem não tem aplicativo de e-mail configurado poder copiar". Copiar
pelo menu do botão direito ("Copiar endereço de e-mail" ou "Copiar endereço do link") continua
funcionando, mas não o texto.

- (a) O `dev-frontend` põe o texto acima da camada, para ele ser selecionável, e os cantos continuam
  do link; o `qa-acessibilidade` acrescenta a seleção ao e2e, vista falhando; o `guardiao-visual`
  confere o 1280; depois, `revisor` e guardião. Custo: uma volta de dev, qa e conferência, dentro
  desta sessão.
- (b) Aceitar como está e registrar na §7 que se copia pelo menu do link. Custo: quem usa o celular
  sem aplicativo de e-mail depende de saber pressionar e segurar o link.
- Recomendo (a), porque a §7 escreveu o motivo do texto visível, e a correção é pequena.

## Decisões do Gabriel sobre a Q7 e a Q8, 23/11/2026

Texto literal da mensagem do Gabriel:

> Decisões do Gabriel (registre literal no relatorio.md):
>
> Q7 (a): preencha o campo "Arquivos fora do escopo, por agente" e a nota "superado" no item 5 do guardião visual. O revisor roda uma 4ª vez, só sobre essas correções e a linha da Q8. Se ele ou o guardião pedirem correção de novo, pare sem nova rodada.
>
> Q8 (b), com registro: o quadro inteiro continua abrindo o link, inclusive no texto, que é a regra principal da §7. Pôr o texto acima da camada faria o clique no @ e no e-mail selecionar em vez de abrir. Na linha da §7 da REFERENCIA-VISUAL sobre os links do Instagram e do e-mail, acrescente: o endereço e o @ continuam escritos no quadro para leitura; a cópia é pelo menu do próprio link (no computador, botão direito, "Copiar endereço de e-mail"; no celular, tocar e segurar), conferida em 23/11/2026 (Q8 (b) da pagina-contato). O endereço da sede, que não é link, continua selecionável.
>
> Depois: guardiao-appsec com o checklist inteiro, archive e Portão 2. O P23 em /contato é registrado e commitado antes do merge.

- **Feito pelo líder técnico:** o campo de escopo preenchido (seção "Líder técnico — conferência
  de escopo"); a nota "superado" no item 5 do `guardiao-visual`; na `REFERENCIA-VISUAL.md` §7, a
  linha "Inicial, Contato e rodapé, links do Instagram e do e-mail" com o acréscimo da Q8 (b), no
  fim da célula, sem apagar o texto de 20/11.

**Q9. Quem conferiu a cópia pelo menu do link** (achado 1 da passagem 4 do `revisor`). A §7 diz
"conferida em 23/11/2026", e o relatório não registra a conferência: o líder técnico mediu só o
triplo clique, no Chromium, em 1280. O Playwright não abre o menu de contexto nativo, e nenhum
aparelho de toque foi usado. Observação junto: no Instagram, o menu copia o endereço
`https://www.instagram.com/liacup.unb/`, e não o `@liacup.unb`; "Copiar endereço de e-mail" só
existe no e-mail.

- (a) O Gabriel conferiu, no computador e no celular. O relatório registra "conferida pelo
  Gabriel, 23/11/2026", literal, e o guardião roda. Custo: nenhum.
- (b) Ninguém conferiu ainda. O relatório registra "não medido", e o Gabriel troca, na §7,
  "conferida em 23/11/2026" por "decidida em 23/11/2026" (texto dele). Se quiser, também diz que no
  Instagram o menu copia o endereço do perfil. Depois o guardião roda. Custo: uma linha da §7.
- Recomendo (a) se o Gabriel testou nos dois aparelhos; se não testou, (b), porque é o que o
  relatório consegue sustentar.

## guardiao-appsec

O guardião não escreve: o líder técnico registra o relatório em uma tela por passagem, com a lista
de achados inteira; a saída de comando e o aceite do Gabriel vão literais.

### Passagem 1, 23/11/2026 (levantamento e decisão, em duas invocações novas)

- **Veredito:** **APROVADO** · bloqueante 0 · alta 0 · média 0 · baixa 0 · informativa 2 ·
  **conferência completa** (passo 1: `docs/SEGURANCA.md` no diff e na lista do gatilho; o guardião
  concordou). 49 de 50 arquivos conferidos. O `relatorio.md` não foi aberto, pela regra do agente,
  e ficou coberto pelos pedidos P4 a P9. O líder técnico tinha pedido a leitura dele na primeira
  invocação, e o guardião recusou com razão. Os 17 PNG novos foram lidos um a um até o `IEND`, com
  0 ocorrência dos seis formatos de chave.
- **Estados:** AS-01 sem achado (P1 a P9, conferência pelo nome, os 17 PNG e a origem da §7 nas
  linhas 750 a 752, soma 105; o conteúdo comprimido dos PNG fica coberto só pela origem
  declarada); AS-02 com I2; AS-04 com I1; AS-05, AS-07, AS-08 e AS-09 sem achado; AS-15 **não
  verificado** (a prévia ainda não tem o código: P23, tarefa 4.5); AS-03, AS-06, AS-10 a AS-14,
  AS-16 e AS-17 não se aplicam. Não verificado também: as aprovações da §7 que só este relatório
  registra, e as saídas do e2e e do Lighthouse.
- **Achados (lista inteira):**
  - **I1 · AS-04 · informativa · confirmado** · `src/componentes/padroes/QuadroDeContato.tsx:25-27`,
    `:67` e `:78`. Nas variantes `externo` e `email`, o `endereco: string` aceita qualquer texto,
    e o `href` e o `mailto:` são montados sem conferir o esquema. Hoje os dados vêm de constantes
    (`contato-da-liga.ts:39`, `QuadroDoEmail.tsx:18`), com o destino testado
    (`ListaDeContatos.test.tsx:65,76`). Cenário: um reúso futuro passa ao quadro uma URL lida do
    banco, que aceita `javascript:` e `http:` (LB-19). Critério: a variante `externo` só com
    `https://`, por tipo ou por conferência, como `src/features/processo-seletivo/regras.ts:46`;
    teste de unidade com `javascript:` e `http:` recusados; o `mailto:` só com um endereço de
    e-mail, sem `?`, `&` nem quebra de linha. Destino, pelo guardião: R2, a primeira change que
    passar dado variável ao quadro. **Proposta do líder técnico:** nenhuma change da R2 planejada
    passa dado do banco ao bloco de contato (os dados de contato são fixos até a edição das seções
    no painel, na R5). O critério entra na change que primeiro fizer isso, e o gestor o leva ao
    briefing da `inicio-completo` como nota de reúso.
  - **I2 · AS-02 · informativa · confirmado** · `public/icone-email-gmail.png` com
    `src/proxy.ts:90`. O `.png` escapa do interruptor e fica alcançável em produção antes do
    lançamento: é o ícone público do Gmail, sem nada da liga que ainda não deva aparecer. Está
    dentro do LB-28 (§6, prazo R1), cuja condição a §7, linha 750, cumpre. Critério: nada nesta
    change; a `lancamento-r1` confere o arquivo junto com os outros de `public/`. Destino: R1,
    `lancamento-r1`.
- **Pedidos de comando** (Git Bash, `MSYS_NO_PATHCONV=1`). Precondições: a linha do `.env`, só por
  contagem, com 1 linha com o nome e 0 fora da forma; `curl 8.7.1`; `test -e .npmrc` com código 1;
  `git rev-parse main` = `ls-remote origin refs/heads/main` = `c12cf9b`; `git rev-list main..HEAD`
  só com `1a65180`; conferência do ambiente com código 0.
  - P1 · AS-01 · forma do segredo na árvore de trabalho (`git grep -c -a -F --untracked -f -`) ·
    saída vazia · `[código de saída: 1]`
  - P2 · AS-01 · a mesma no índice (`--cached`) · saída vazia · `[código de saída: 1]`
  - P3 · AS-01 · a mesma no commit `1a65180` · saída vazia · `[código de saída: 1]`
  - P4 a P9 · AS-01 · `git grep -c -a --untracked -e '<formato>' --
    'openspec/changes/pagina-contato/relatorio.md'` com `eyJhbGci`, `sb_secret_`, `sbp_`,
    `ghp_`, `github_pat_` e `PRIVATE KEY` · saída vazia nos seis · `[código de saída: 1]` nos
    seis
  - Conferência pelo nome, do líder técnico (§5) · `git grep -c --untracked -e
    'VERCEL_AUTOMATION_BYPASS_SECRET' -- . ':!docs' ':!openspec' ':!README.md' ':!.env.example'` ·
    saída vazia · `[código de saída: 1]`
  - Pendente: P23 · AS-15 · a forma do `curl` com o segredo, em `/contato` da prévia, depois do
    push e antes do merge (tarefa 4.5).
- **Riscos aceitos pelo Gabriel:** nenhum novo. O I2 fica dentro do LB-28 e o I1 dentro do LB-19,
  ambos aceitos antes e no prazo.

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum.

- **Arquivos fora do escopo, por agente:** nenhum em nenhuma passagem. Conferido depois de cada
  uma pelo `git status --porcelain --untracked-files=all`, com índice vazio, `HEAD` `1a65180`,
  `rev-list --all` 121 e `conferir-ambiente-local` com código 0 (antes do commit da proposta,
  `HEAD` `c12cf9b` e 120):
  - `especificador` (proposta e ajuste à Q3 (b)): só `openspec/changes/pagina-contato/`;
  - `dev-frontend` (2.1 a 2.3): só o escopo do D7; na correção da Q5 (a), só os comentários de
    `src/estilos/tokens.css:454` e `src/componentes/padroes/FigurasDeContato.module.css:13-15`,
    com `git status` igual ao de antes e `tokens.css` ainda `23 0`;
  - `qa-acessibilidade`: só `tests/e2e/contato.spec.ts` e `tests/e2e/paginas-publicas.spec.ts`;
  - `guardiao-visual`: só os 10 PNG em `prints/`;
  - `revisor`, passagens 1, 2 e 3: nenhum arquivo; `git status` igual antes e depois de cada uma
    (comparado com o arquivo de status guardado antes da passagem 1, sem diferença);
  - as seções de cada agente e as marcas em `tasks.md` ficam fora desta contagem, porque são o
    escopo comum da change.
- **Passagem do `especificador` (23/11, antes do Portão 1):** 7 arquivos novos, todos em
  `openspec/changes/pagina-contato/`; nenhum fora do escopo. `git diff --cached --name-only`
  vazio; `HEAD` `c12cf9b`, `rev-list --all` 120 e `ls-remote origin main` `c12cf9b`, iguais antes e
  depois; `conferir-ambiente-local --change pagina-contato` com código 0 antes e depois;
  `openspec validate pagina-contato --strict` com código 0 ("Change 'pagina-contato' is valid").
- **Passagem do `especificador` (ajuste à Q3 (b), 23/11):** 5 arquivos modificados, todos em
  `openspec/changes/pagina-contato/`; nenhum fora do escopo. Índice vazio; `HEAD` `1a65180` e
  `rev-list --all` 121, iguais antes e depois; `conferir-ambiente-local` com código 0 (as chaves do
  `.git/config` passaram de 15 para 18 com o `git push -u` do Gabriel, 0 fora da lista). O
  `validate --strict` deu código 1 na primeira volta (requisito com mais de 500 caracteres) e
  código 0 depois da correção do especificador.
- **Tarefa 1.2, líder técnico:** a linha "Contato, página" na `REFERENCIA-VISUAL.md` §7 e o trecho
  da descrição no `conteudo-institucional.md` §1, colados do texto proposto acima.
  `grep -c '^| Contato, página' docs/REFERENCIA-VISUAL.md` dá 1; `grep -c '^> Contato da Liga
  Acadêmica Multiprofissional' docs/conteudo-institucional.md` dá 1; `git diff --numstat main`:
  `1 0 docs/REFERENCIA-VISUAL.md` e `4 0 docs/conteudo-institucional.md`; a descrição tem 129
  caracteres (`node`, por código de ponto); `prettier --check` limpo nos dois.
- **Passagem do `dev-frontend`:** 18 arquivos novos e 3 modificados, todos no escopo do D7
  (`src/app/(site)/(publicas)/contato/`, `src/features/contato/`, arquivos novos em
  `src/componentes/padroes/`, `paginas-publicas.{json,test.ts}`, `tokens.css` +23 −0 e
  `public/icone-email-gmail.png`, sha256 igual ao de `assets/`). Nenhum fora do escopo. Índice
  vazio; `HEAD` `1a65180` e `rev-list --all` 121, iguais; `conferir-ambiente-local` com código 0;
  `git diff -G 'process\.env|NEXT_PUBLIC_'` vazio e `git grep -c --untracked` nos novos com código
  1; portas 3000 e 3001 livres.
- **Passagem do `qa-acessibilidade`:** só `tests/e2e/contato.spec.ts` (novo) e
  `tests/e2e/paginas-publicas.spec.ts` (+5 −5), além da seção dele e das marcas em `tasks.md`.
  `git diff --stat -- src` igual ao deixado pelo dev (3 arquivos, +43 −5); `git grep -c --untracked
  DEMO-RP12 -- src tests/e2e` com código 1; ambiente com código 0; `HEAD` e `rev-list` iguais.
- **Passagem do `guardiao-visual`:** só os 10 PNG novos em `prints/` e a seção dele. Os 6
  `q3-opcao-*` intactos. Índice vazio; `HEAD` e `rev-list` iguais.
- **Tarefa 4.2, líder técnico:** no `docs/SEGURANCA.md`, o cabeçalho na versão 3.4 e, na §7, três
  linhas: a cópia `public/icone-email-gmail.png` (1), os `q3-opcao-*` (6) e os PNG do
  `guardiao-visual` (10), estes "a aprovar pelo Gabriel no Portão 2 (Q6)" (**superado:** depois da
  Q6 (a) a linha diz "Ativo aprovado … Aprovados pelo Gabriel na Q6 (a)", e a da cópia do Gmail
  ganhou quem aprovou, achado 1 da passagem 2 do `revisor`), e o total de 88 para
  105. `grep -c 'pagina-contato' docs/SEGURANCA.md` dá 5 (cabeçalho, as três linhas e o parágrafo
  final); `git diff --numstat main -- docs/SEGURANCA.md` dá `7 2`, só nos trechos `@@ -3`
  (cabeçalho), `@@ -747,0 +750,3` e `@@ -754` (§7); a soma da coluna "Arquivos" dá 105;
  `npm run verificar:artefatos` com código 0 (545 rastreados examinados); `prettier --check` limpo.
  O `git hash-object` para o blob da cópia foi recusado pela barreira do Git (fora da lista de
  leitura): a linha cita só o sha256.
- **Tarefa 4.3, líder técnico:** `npm run verificar` com código 0 (último passo `✓ spec/seo`);
  `npm run build` com código 0 (`○ /contato`); `npm run test:desempenho` com código 0:
  `[desempenho · site publicado] páginas medidas: 6 de 6 pedidas`, todas com desempenho 100,
  acessibilidade 100 e SEO 100 nas três execuções, `/contato` inclusive;
  `[desempenho · site não publicado] páginas medidas: 1 de 1 pedidas`, a raiz com 100, 100 e SEO 92
  (só impresso neste modo, sem mínimo). 23 dependências diretas. `git diff --exit-code main --
  package.json package-lock.json src/proxy.ts lighthouserc.json playwright.config.ts .github/
  scripts/ docs/PLANO-DE-DESENVOLVIMENTO.md docs/PADROES-DE-CODIGO.md
  openspec/specs/publicacao-do-site openspec/specs/fundacao-e-ci` com código 0.
- **Depois da Q8 (b), líder técnico:** `git diff --numstat main -- docs/REFERENCIA-VISUAL.md` dá
  `2 1` (a linha "Contato, página" nova e a linha dos links com o acréscimo). Como o e2e lê a §7,
  `npx playwright test tests/e2e/contato.spec.ts tests/e2e/paginas-publicas.spec.ts` rodou de novo:
  código 0, 175 passaram; `travessões trocados: 1` nas 7 larguras; 97 controles alcançados por Tab
  em 1280, 0 sem foco visível. `prettier --check` limpo.

## Decisão do Gabriel sobre a Q9, 23/11/2026

Texto literal da mensagem do Gabriel:

> Q9 (b), decisão do Gabriel (registre literal): ninguém conferiu ainda; registre "não medido". Troque o texto que entrou na REFERENCIA-VISUAL §7 pela Q8 (b) por este, que é do Gabriel:
>
> "O endereço e o @ continuam escritos no quadro, para leitura. Para copiar, usa-se o menu do próprio link: no e-mail, "Copiar endereço de e-mail" pelo botão direito no computador, ou tocar e segurar no celular; no Instagram, o menu copia o endereço do perfil (https://www.instagram.com/liacup.unb/). O endereço da sede, que não é link, se seleciona normalmente (Gabriel, 23/11/2026, decidido na Q8 (b) da pagina-contato)."
>
> É texto do Gabriel trocando texto do Gabriel, sem código: não abre nova rodada do revisor. Siga ao guardião com o checklist inteiro, archive e Portão 2. No Portão 2, inclua um passo para o Gabriel na prévia: abrir o menu do link do e-mail e do Instagram, no computador e no celular, e dizer o que foi copiado; o resultado entra no registro do P23, antes do merge.

- **Cópia pelo menu do link: não medido.** Nem no computador nem no celular, até esta data. O
  Gabriel confere na prévia, no Portão 2, e o resultado entra no registro do P23, antes do merge.
- **Feito pelo líder técnico:** na `REFERENCIA-VISUAL.md` §7, linha "Inicial, Contato e rodapé,
  links do Instagram e do e-mail", o texto da Q8 (b) trocado pelo texto literal acima, depois do
  "(Gabriel, 20/11).". `git diff --numstat main -- docs/REFERENCIA-VISUAL.md` continua `2 1`;
  `prettier --check` limpo; `npx playwright test tests/e2e/contato.spec.ts` com código 0, 49
  passaram (o leitor da §7 lê o primeiro destino entre crases, que não mudou). Sem nova rodada do
  `revisor`, por decisão do Gabriel.
- **Archive, líder técnico, 23/11/2026:** `npx openspec validate pagina-contato --strict` com
  código 0; `npx openspec archive pagina-contato --yes` com código 0 (13 de 14 tarefas: a 4.5, o
  P23, só roda depois do push; "Totals: + 5, ~ 4, - 0, → 0"; `pagina-contato` criada,
  `navegacao-publica` com 3 modificados, `seo` com 1). A change foi para
  `openspec/changes/archive/2026-11-23-pagina-contato/`, o caminho que as linhas do
  `docs/SEGURANCA.md` §7 já citam, e os 16 PNG foram junto. O primeiro `npx openspec validate
  --all --strict` deu 13 de 14: o `## Purpose` da spec nova era o texto provisório do archive.
  Escrito o Purpose em `openspec/specs/pagina-contato/spec.md`, no molde do de `pagina-projetos`;
  depois, 14 de 14. `npm run verificar` e `npm run verificar:artefatos` com código 0 (545
  rastreados examinados).

## P23 e conferência do menu dos links (tarefa 4.5)

Registrado pelo líder técnico antes do merge, 23/11/2026, 20:19:15 UTC, no terminal Bash do
Windows, com `MSYS_NO_PATHCONV=1`.

**Confirmado pelo Gabriel no painel da Vercel, literal (antes do `curl`):**

> Domains
> portal-liacup-git-feat-pagina-contato-liacup1.vercel.app
> commit: https://github.com/Liga-Academica-Liacup/portal-liacup/commit/7c6858dd80f1e1fe53dc6416660632b2afc7fceb

| Comando | Código | Resultado |
| --- | --- | --- |
| Host, contra o D8 | — | `portal-liacup-git-feat-pagina-contato-liacup1.vercel.app`, igual letra por letra; 45 caracteres antes de `.vercel.app` |
| Commit da prévia contra a branch | — | `7c6858dd80f1e1fe53dc6416660632b2afc7fceb` = `rev-parse HEAD` = `ls-remote` de `feat/pagina-contato`; `status --porcelain` vazio |
| Forma da linha do `.env`, só por contagem | — | 1 linha com o nome · 0 fora da forma · `curl 8.7.1` |
| `conferir-ambiente-local --change pagina-contato` | 0 | 20 comparados · 20 iguais · 18 chaves do `.git/config`, 0 fora da lista |
| `rev-parse main` e `ls-remote origin refs/heads/main` | — | `c12cf9b337d6ab70d02754593ba85bb65a5ca2a5` nos dois; `main..HEAD`: `7c6858d` e `1a65180` |
| P23, forma com o segredo, em `/contato` | 0 | `HTTP/1.1 200 OK`, sem `Location`, `X-Matched-Path: /contato`, `X-Robots-Tag: noindex`, `X-Vercel-Cache: HIT`; 18 cabeçalhos, 0 `Location`, 0 `set-cookie` |
| Forma 2, `<rev>` = `1a65180` | 1 | saída vazia |
| Forma 2, `<rev>` = `7c6858d` | 1 | saída vazia |
| Forma 3, segredo na árvore de trabalho | 1 | saída vazia |
| Forma 4, segredo no índice | 1 | saída vazia |
| Produção, `curl -I https://www.liacup.com.br/` | 0 | `200`, `X-Matched-Path: /em-construcao` |
| Produção, `curl -I https://www.liacup.com.br/contato` | 0 | `307`, `Location: /` |

- **AS-15 da prévia:** a resposta de `/contato` traz `X-Robots-Tag: noindex`. Os cabeçalhos de
  segurança da produção continuam sob o LB-07, para a `lancamento-r1`.

**Cópia pelo menu dos links, conferida pelo Gabriel na prévia, literal:**

> copias:INSTAGRAM
> @liacup.unb
> (abre em nova aba)
> https://www.instagram.com/liacup.unb/
> liacup.unb@gmail.com

- **Leitura do líder técnico, para o Gabriel confirmar:**
  - no e-mail, a cópia deu `liacup.unb@gmail.com`;
  - no Instagram, deu o endereço do perfil, `https://www.instagram.com/liacup.unb/`, como a §7
    (Q9 (b)) diz;
  - as três primeiras linhas parecem ser o texto do link copiado ("Copiar texto do link"): o rótulo,
    o @ e o "(abre em nova aba)" que só o leitor de tela anuncia.
- **Não informado:** em que aparelho cada cópia foi feita (computador ou celular). Fica como o
  Gabriel escreveu.
