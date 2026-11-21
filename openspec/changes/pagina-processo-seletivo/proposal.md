# Proposta — página do processo seletivo

## Why

O processo seletivo é a conversão principal do portal (`REFERENCIA-VISUAL.md` §4), e a página dele
ainda não existe. Por isso o cabeçalho ainda não mostra o botão "Processo seletivo", e o hero ainda
não mostra o "Quero participar". O Edital 02/2026 encerrou em 31/08, então a página nasce no estado
"inscrições fechadas", que é o caso normal fora de edital (`conteudo-institucional.md` §5.1).

Junto com a página entram quatro coisas que mexem nos mesmos arquivos ou dependem dela: a base de
SEO aprovada pelo Gabriel em 21/11, a unificação dos dois códigos de botão (Q4 (c) da
`layout-e-hero`), as pendências baixas que o `revisor` deixou na `layout-e-hero` e o P23 funcionando
na prévia.

## What Changes

1. **A página `/processo-seletivo`, estado "inscrições fechadas".** Composição de
   `prototipo/prints/processo-seletivo-{390,1280}.png`, com texto e dados do
   `conteudo-institucional.md` §5 e §6. Do protótipo vale só a composição (`REFERENCIA-VISUAL.md`
   §6). Os blocos, na ordem do gabarito:
   - **faixa escura do topo:** o selo "Inscrições fechadas", o título "Processo seletivo" sem
     semestre, a apresentação do §5.2 e o aviso de inscrições fechadas, com o convite para o
     Instagram (texto na **Q1**). Ficam fora os botões "Fazer inscrição" e "Baixar o edital";
   - **coluna "Como funciona":** as duas etapas do §5.5, sem datas;
   - **quadro "Quem pode se inscrever":** o texto do §5.3 e os três pré-requisitos do §5.4;
   - **perguntas frequentes:** as 8 do §6, abertas e fechadas pelo teclado e pelo toque, com o
     estado lido pelo leitor de tela. A pergunta "O que cai na prova" do protótipo não existe.
   Ficam fora o §5.7 (desempate e cargo em disputa) e todo o cronograma antigo. Os títulos de seção
   e os sobretítulos do protótipo estão na **Q3**, e as notas de fonte das respostas do §6 na **Q4**.
2. **A página entra na lista única** como destaque, fora do menu e fora das colunas do rodapé, como
   no gabarito. O botão "Processo seletivo" do cabeçalho e do fim do menu lateral e o "Quero
   participar" do hero aparecem sozinhos, sem ninguém editar o cabeçalho nem o hero.
3. **O conteúdo da página fica num arquivo de dados tipado, separado da composição.** O cronograma,
   o edital, o botão de inscrição e as perguntas passam a ser editáveis pelo painel na R3 (§5.1).
   O estado "inscrições abertas" **não** entra, salvo decisão do Gabriel na **Q2**.
4. **Unificação dos botões (Q4 (c) da `layout-e-hero`, decisão do Gabriel, literal: "Q4: c.").** O
   briefing não cita, mas a decisão põe a unificação nesta change, onde os botões aparecem pela
   primeira vez. O botão da camada base ganha os estados de hover, pressionado e página atual e a
   forma de link, e o código de botão da camada de layout sai. Entra na conta de tarefas (1.2).
5. **Pendências baixas do `revisor` na `layout-e-hero`:**
   - o nome acessível da marca passa a conter o nome longo visível acima de 1024 px (WCAG 2.5.3);
   - os links das colunas do rodapé marcam a página atual;
   - a medição de desempenho imprime quantas páginas mediu de fato, e não quantas pediu;
   - o teste do menu imprime em quantas larguras testou, do total;
   - o README diz onde a página nova mora;
   - o arquivo do hook do menu passa a kebab-case;
   - o botão de destaque do celular deixa de usar o tamanho de fonte de título 6. Passa a um
     tamanho de controle, medido no protótipo (`design.md`, D12).
6. **O P23 passa a funcionar.** Ele roda na prévia da branch, e não no deployment de produção. O
   `curl` leva o cabeçalho de bypass da proteção da Vercel, com o segredo lido só da linha dele no
   `.env`, sem carregar o resto do arquivo e sem imprimir o segredo. A forma nova entra na lista
   fechada do `SEGURANCA.md` §5, com o padrão do host na **Q8**. O `guardiao-appsec` confere que o
   segredo não aparece em nada rastreado.
7. **A base de SEO**, com a regra aprovada em 21/11:
   - a seção **11** dos `PADROES-DE-CODIGO.md`, que é a próxima livre: a numeração vai de 1 a 10,
     com a 8.1;
   - "SEO" na linha do Lighthouse CI da §9, e o item de página pública no checklist da §10;
   - título e descrição declarados na entrada de cada página da lista, e uma função só que os
     transforma em metadados, com canonical absoluto em `https://liacup.com.br` e Open Graph;
   - título e descrição da Início e do Processo seletivo (**Q6**);
   - a categoria SEO no Lighthouse com nota mínima de 95, e o teste que percorre a lista.
   A página em construção de produção não muda (**Q5**, **Q7**).

**Critérios de aceite** (os do briefing):

- Lado a lado do `guardiao-visual` em 390 e 1280 px contra o gabarito. Cada diferença recebe um
  veredito: adaptação aprovada, decisão do Gabriel (§6 e §7 da `REFERENCIA-VISUAL.md`), melhoria
  proposta ou defeito.
- Texto da página idêntico ao `conteudo-institucional.md` §5 e §6, palavra por palavra, conferido
  por teste.
- Perguntas frequentes que abrem e fecham pelo teclado (Enter e Espaço), com alvo de 44 px e estado
  anunciado. Nada fica escondido para quem não usa mouse.
- e2e verde nas 7 larguras, nos dois modos do interruptor, com axe 0 e nenhuma rolagem horizontal.
  Lighthouse ≥ 90 em desempenho e ≥ 95 em acessibilidade na página nova, publicada.
- Lighthouse SEO ≥ 95 na Início e no Processo seletivo. Se o endereço medido tiver `noindex`, só a
  auditoria `is-crawlable` sai da conta, e o relatório diz isso.
- O teste da lista acusa título repetido: uma repetição plantada fica vermelha e, desfeita, volta ao
  verde.
- Com o site não publicado, `/processo-seletivo` responde 307 para `/`, e a página em construção de
  produção continua idêntica.
- P23 com 200 e sem `Location` na prévia da branch.

**Conta de tarefas: 15, sem folga** (`tasks.md`). Com o item 7 dentro, a change cabe. Se uma
correção posterior acrescentar tarefa, **o item 7 sai inteiro para a `pagina-sobre-e-equipe`**: as
tarefas 2.1 a 2.3 e as partes de SEO da 3.2 e da 3.3.

## Fora de escopo

- O estado "inscrições abertas" (selo, cronograma, "Fazer inscrição", link do edital), salvo
  decisão do Gabriel na Q2.
- Formulário próprio de inscrição, painel, edição de conteúdo e qualquer outra página.
- Sitemap, `robots.txt`, JSON-LD e imagem de Open Graph, que são da `lancamento-r1`.
- Mudar a página em construção, o interruptor, a spec `publicacao-do-site` ou a `pagina-inicial`.
  Os cenários delas continuam verdadeiros com a página nova (`design.md`, D2).
- Baixar limiar, tirar verificação ou mexer em `.github/`.
- A conferência do menu à mão (tarefa 1.5 da `layout-e-hero`). Fica com o Gabriel, na prévia desta
  change, em 390 px, como pede o briefing.

## Capabilities

### New Capabilities

- `pagina-processo-seletivo`: o que a página do processo seletivo mostra em cada estado, o texto
  conferido contra o documento de conteúdo e as perguntas frequentes operáveis por teclado e toque.
- `seo`: título, descrição, canonical e Open Graph de cada página pública, um `h1` por página, a nota
  mínima de SEO e a página provisória sem mudança nos metadados.

### Modified Capabilities

- `navegacao-publica`:
  - a lista passa a ter a Início e o Processo seletivo, em REMOVED mais ADDED com nome novo, porque
    o cenário "Nesta entrega, a lista tem só a Início" fica falso e o validador não deixa um bloco
    modificado largá-lo;
  - o cabeçalho ganha o nome acessível da marca com o texto visível;
  - o rodapé marca a página atual nas colunas;
  - o teste do menu imprime o total de larguras;
  - a medição imprime quantas páginas mediu de fato.
- `equipe-de-agentes`: o pedido dos cabeçalhos da prévia passa pela proteção da Vercel sem expor o
  segredo (ADDED).

## Requisitos permanentes

| RP | Aplica? | Em uma linha |
| --- | --- | --- |
| RP-01 | Sim | Nenhuma dependência nova: 22 diretas antes e depois |
| RP-02 | Sim | `verificar:tokens` com código 0 |
| RP-03 | Sim | Token novo só acrescentado, com origem; nenhum existente alterado |
| RP-04 | Sim | 44 px nos botões das perguntas e no link do aviso, medidos com contador nas 7 larguras |
| RP-05 | Sim | Zero rolagem horizontal nas duas páginas da lista, nas 7 larguras |
| RP-06 | Sim | Lighthouse nas duas páginas publicadas e na raiz não publicada, mais SEO ≥ 95 |
| RP-07 | Sim | axe 0 nas duas páginas e na raiz não publicada, com as perguntas abertas e fechadas |
| RP-08 | Sim | Cada diferença do lado a lado com veredito e motivo |
| RP-09 | Sim | Selo e aviso sobre a faixa escura com o par medido e nomeado |
| RP-10 | Sim | O segredo de bypass nunca é versionado, impresso nem transcrito |
| RP-11 | Não | Nenhuma tabela |
| RP-12 | Sim | Toda verificação nova vista falhando (`design.md`, D8) |
| RP-13 | Sim | `verificar:artefatos` com código 0; os prints da change entram com origem na §7 |
| RP-14 | Sim | Lado a lado do guardião e aprovação nominal do Gabriel no Portão 2 |

## Impact

| O que | Efeito | Quem escreve |
| --- | --- | --- |
| `src/` (lista nominal no `design.md`, D10) | Página nova, dados dela, lista com 2 entradas e metadados, `montarMetadados`, botão unificado, pendências da moldura | `dev-frontend` |
| `scripts/medir-desempenho.mjs`, `lighthouserc.json` | SEO no modo publicado e contador real | `dev-frontend` |
| `tests/e2e/` | Spec da página nova; `paginas-publicas`, `menu-por-teclado` e `pagina-inicial` ajustados | `qa-acessibilidade` |
| `docs/PADROES-DE-CODIGO.md` §9, §10 e §11; `docs/SEGURANCA.md` §5 e §7; `.env.example`; `README.md` | Regra de SEO; forma nova do P23; origem dos prints; nome da variável | líder técnico (docs) e `dev-frontend` (README) |
| `src/proxy.ts`, página em construção, `.github/`, dependências | Nada muda | — |
| Produção | Nada muda | — |
| Prévias | Botão "Processo seletivo", "Quero participar" e a página nova | — |
