# Design — página inicial completa da R1

## Context

Ver `proposal.md`, seção Why. Estado lido na `main` `6bcc393` pelo especificador:

| O que | Situação |
| --- | --- |
| Rota da raiz | `src/app/(site)/(publicas)/page.tsx` só compõe `HeroDaInicial` (`_inicio/`). O comentário já diz que os blocos chegam na `inicio-completo` |
| Hero | `_inicio/HeroDaInicial.tsx` e `.module.css`: `section` com fundo da página, preenchimento de baixo `--espaco-secao`; os botões leem a lista única. **Não muda** |
| Processo seletivo | `features/processo-seletivo/conteudo.ts` (`CONTEUDO_DO_PROCESSO_SELETIVO`: `titulo`, `inscricoes.estado` `'fechado'`, `inscricoes.selo`, `inscricoes.aviso` como `TextoComLink`, com `nomeAcessivelDoLink`); `tipos.ts` com a união `SituacaoDasInscricoes`; `FaixaDoTopo.tsx` desenha o aviso com o link |
| Bloco de contato | `componentes/padroes/`: `QuadroDeContato` (variantes `externo`, `email`, `texto`; círculo `--tamanho-circulo-de-contato`, 100 px; vão `--space-4`; contraste medido só sobre `--color-bg`), `QuadroDoInstagram`, `QuadroDoEmail`, `QuadroOndeEstamos`, `ListaDeContatos` (o comentário já prevê a inicial com Instagram e E-mail), `contato-da-liga.ts` |
| Contato | `features/contato/conteudo.ts`: só o topo de `/contato` |
| Lista única | `src/lib/utils/paginas-publicas.json`, 6 entradas; `/` com título e descrição do §2.0. **Não muda** |
| e2e da raiz | `tests/e2e/pagina-inicial.spec.ts`: 200 sem redirecionamento, texto do hero, botões, quadro, borboletas, contraste do lema |
| Gabarito 1280 | Números: grade `data-resp4` dentro da seção do hero, 4 colunas, vão 18 px, margem de cima 56 px, sobra de baixo 56 px. Faixa: `section` com preenchimento 72/28 px; cartão `.cta-box` `data-resp` com fundo `--color-accent` (lilás), raio `--radius-lg` × 1,4, preenchimento 52/56 px, grade `minmax(0,1fr) auto`, vão 36 px; círculo decorativo de 280 px, `right:-70px; bottom:-90px`, `rgba(78,50,96,.35)`; selo `.tag` creme com texto `--color-accent-800`; título `h2` creme; botão creme com texto `--color-accent-800`. Contato: seção em superfície, sobretítulo, `h2` "Onde a Liga responde", frase, botão; à direita, cada canal num cartão `background: var(--color-bg)`, `--radius-lg`, preenchimento 18/22 px, grade `104px 1fr`, vão 20 px |
| Gabarito 390 | Números em 2 × 2; faixa com o botão na largura toda, abaixo do texto; contato numa coluna, o título em cima e os dois cartões abaixo |
| Lidos no `prototipo/Portal-LIACUP.html` | Os rótulos `indicadores` ("membros ativos", "cursos representados", "ações realizadas"); a frase e o botão do contato; o botão "Ver o edital" leva à página do processo seletivo |

## Goals / Non-Goals

**Goals:**

- Cada bloco lê de um lugar só de dados; nenhum componente guarda texto institucional.
- A faixa e `/processo-seletivo` leem o mesmo objeto, e não cópias.
- O bloco de contato é o da `pagina-contato`, sem copiar código, e `/contato` não muda na tela.
- A regra de camadas continua passando sem exceção.
- A produção continua igual.

**Non-Goals:** ver "Fora de escopo" da proposta. Este design também não prepara o estado
"inscrições abertas" além do que a união de tipos já obriga.

## Decisions

### D1 — Onde cada parte mora (camadas)

A regra: uma feature nunca importa de outra, e duas features conversam pela rota que as compõe
(`PADROES-DE-CODIGO.md` §1). Então **cada bloco mora na feature do seu domínio, e a rota da raiz os
compõe**, lendo os dados e passando por props.

- **Rota** `src/app/(site)/(publicas)/page.tsx`: compõe, na ordem, `HeroDaInicial`, os números, a
  faixa e o contato. Importa os componentes e os dados das três features (a camada `app` pode
  importar de tudo). Não guarda texto.
- **Números**, feature nova `src/features/numeros-da-liga/`: `tipos.ts`, `conteudo.ts` (os quatro
  números e os rótulos), `conteudo.test.ts` e `componentes/NumerosDaLiga`. O nome é do domínio, os
  números que a diretoria revisa na passagem de gestão (§9), e não da página. O painel da R3 edita
  esse domínio, e o `dados.ts` chega quando ele existir.
- **Faixa**, em `src/features/processo-seletivo/componentes/`, um componente novo (o dev escolhe o
  nome, por exemplo `FaixaDaInicial`), que recebe por props o `titulo`, a `SituacaoDasInscricoes` e
  o rótulo do botão. Fica na feature dona do estado das inscrições porque, quando o estado "aberto"
  entrar na união, o TypeScript aponta este componente junto com a `FaixaDoTopo`. A rota passa
  `CONTEUDO_DO_PROCESSO_SELETIVO`, o mesmo objeto que `/processo-seletivo` usa.
  - **Alternativa considerada:** o componente em `_inicio/`, lendo o conteúdo direto. A camada
    `app` permite, mas o tratamento do estado das inscrições ficaria fora do domínio dele.
    Descartada.
  - **Alternativa descartada:** uma feature `features/inicio/`. Ela não pode importar de
    `features/processo-seletivo/`, e "início" é página, não domínio.
- **Contato**, em `src/features/contato/`: `componentes/ContatoDaInicial` (sobretítulo, `h2` e a
  `ListaDeContatos` com `QuadroDoInstagram` e `QuadroDoEmail`), e os rótulos do topo do bloco em
  `conteudo.ts`, ao lado dos de `/contato`. A feature `contato` importa de `padroes`, o que é
  permitido. É também onde o formulário da R4 vai morar.
- **O link do aviso** tem a estrutura do da `FaixaDoTopo` (alvo de 44 px, nova aba, nome
  acessível), mas **não as cores dos estados**: o hover `--color-accent-300` e o pressionado
  `--color-fundo-pressionado-sobre-escuro` da `FaixaDoTopo` reprovam sobre o cartão da inicial (D4).
  Se o dev extrair o `Aviso` para reusar nas duas faixas, a extração fica dentro de
  `features/processo-seletivo/`, as cores dos estados ficam com cada faixa, e a `FaixaDoTopo` não
  muda na tela. O e2e de `/processo-seletivo` continua verde sem alteração.

### D2 — Que spec muda, e qual não muda

- `pagina-inicial`: 10 requisitos ADDED, 29 cenários (pela Q9 (a), um requisito novo do contrato do
  botão, com um cenário, e o cenário do anel creme no requisito dos pares). O do hero não muda. O `## Purpose` da spec principal diz
  hoje que a página "é o hero". O líder técnico o atualiza depois do archive, no molde do que fez em
  `pagina-contato` (follow-up do `tasks.md`).
- **Não mudam:** `navegacao-publica`, `seo`, `pagina-contato`, `pagina-processo-seletivo`,
  `referencia-visual`, `publicacao-do-site` e `fundacao-e-ci`. O motivo de cada uma está na proposta,
  em Capabilities.

### D3 — Os números

- Tipo: uma lista somente-leitura de `{ valor, rotulo }`, os dois `string` (o "2026" é ano, não
  quantidade, e nenhum cálculo usa os números). A ordem é a do §9.
- `conteudo.test.ts`: exige 4 itens, nenhum valor nem rótulo vazio, e imprime `números: 4`.
- Composição: uma `section` própria, logo depois da do hero, com o mesmo fundo. **O hero não muda.**
  O vão entre os botões do hero e os cartões sai do preenchimento de baixo do hero mais o de cima
  da seção nova. O dev mede o vão contra o gabarito e registra. Se a diferença só fechar mexendo no
  hero, **para e reporta**: não muda o hero.
- Lista com papel de lista explícito (`role="list"`, pelo WebKit, como as outras), sem nome
  acessível inventado: nenhum texto fora do documento e da §7, nem em `aria-label`.
- Cartão: o fundo, o raio, o preenchimento, a fonte do número (Caprasimo) e a do rótulo são lidos
  do protótipo e viram tokens novos se não existirem. A grade sai do `data-resp4`: 4 colunas em
  1280 e 2 × 2 em 390. Nas larguras intermediárias, o dev lê o corte do `data-resp4` no CSS do
  protótipo, dentro dos cortes permitidos (480, 768, 1024), e registra.
- Contraste (RP-09): o número em `--color-accent-800` e o rótulo em texto secundário
  (`--color-neutral-700`, §3), contra o fundo do cartão, medidos e nomeados.

### D4 — A faixa do processo seletivo

- **Conteúdo:** o selo `inscricoes.selo`, o `titulo` como `h2` (Q2 (a)), o aviso
  `inscricoes.aviso` com o link, e o botão. **Sem a apresentação** do §5.2, que o briefing não pede
  e o gabarito não tem.
- **O rótulo do botão** (Q3) entra no `CONTEUDO_DO_PROCESSO_SELETIVO` como campo novo (por exemplo,
  `chamadaDaInicial.rotuloDoBotao`), com o tipo em `tipos.ts` e a conferência de não vazio em
  `conteudo.test.ts`. Só linhas acrescentadas nesses três arquivos. Com a Q3 (a), o texto é
  "Quero participar", o rótulo que o hero já usa; o hero continua com o dele, e a duplicação fica
  registrada como dívida pequena (dois lugares com o mesmo rótulo).
- **O botão segue a lista única:** aparece só se `/processo-seletivo` estiver na lista
  (`estaNaLista`, como o hero). É um link com aparência de botão (`aparenciaDeBotao`), com os
  estados do ADR-0006, mas **não na variante `primario`**: o fundo dela é o `#82558f` do cartão
  (Q7 (a), cuidado do Gabriel). As cores do botão estão abaixo.
- **A variante nova do botão (Q9 (a), decidida pelo Gabriel em 23/11/2026).** As cores do botão
  moram numa variante nova do contrato do botão da camada `ui` (ADR-0006), e não no estilo da
  faixa. O dev escolhe o nome (por exemplo `claro`, "sobre fundo escuro"). Exceção aprovada ao
  "`src/componentes/ui/` não muda" (D8), só para isto:
  - `Botao.module.css`: **só linhas acrescentadas**, com os estados da variante: repouso (fundo
    `--color-bg`, texto `--color-accent-800`), hover dentro de `@media (hover: hover)` (fundo
    `--color-accent-200`), pressionado (fundo `--color-accent-300`), cada um com o par da tabela
    abaixo medido contra o cartão `#82558f`. O foco da variante é o do site: o botão guarda o fundo
    do estado em que está, e o anel vem do `:focus-visible` global; **a cor do anel não fica na
    variante** (ver "O anel de foco", abaixo). O desabilitado e a página atual são as regras comuns
    de `.botao`, que a variante não muda; a página atual não acontece na faixa (o botão leva a
    `/processo-seletivo`, e a faixa está em `/`).
  - `aparencia-de-botao.ts`: **a linha da união `VarianteDoBotao` trocada** (`1 1`), e nada mais. O
    `VarianteDoLinkBotao` deriva dela e já inclui a variante nova.
  - `Botao.tsx`: a prop tem a sua própria lista de variantes (linha 38). Pela **Q10 (a)** do
    Gabriel, 23/11/2026, **essa linha trocada** (`1 1`), só com a variante nova acrescentada à lista;
    sem ela, o teste do contrato não compila.
  - `Botao.test.tsx`: **só linhas acrescentadas.** O teste do contrato, o `it.each` "botao e link da
    variante %s, largura %s, tem as mesmas classes" (perto da linha 100), ganha as linhas da
    variante nova, em largura natural e total: botão e link da variante nova têm as mesmas classes,
    e a classe da variante está nelas.
- **A troca exaustiva pelo estado:** a faixa trata `inscricoes.estado` por `switch` exaustivo, para
  o estado "aberto" não passar calado quando entrar.
- **Cor do cartão (Q7 (a), decidida):** o fundo é `--color-accent-600` `#82558f`, com título, aviso
  e link em `--color-bg` `#f5ead8`. O selo segue o `.tag` da inicial do protótipo (fundo creme e
  texto `--color-accent-800`), e não o selo verde da `/processo-seletivo`: cada tela segue o seu
  gabarito. O aviso fica em `--color-bg`, como o texto do `.cta-box`, e não em `--color-accent-200`
  como na `FaixaDoTopo` (mediria 4,55:1 sobre o cartão, sem folga).
- **O círculo decorativo** é o do protótipo: `rgba(78,50,96,.35)`, que é `--color-accent-800`
  `#4e3260` a 35 %. Token novo, por exemplo `--color-circulo-do-cartao-da-faixa:
  color-mix(in srgb, var(--color-accent-800) 35%, transparent)`, com a origem no protótipo; posição
  e tamanho também em tokens novos com origem. Sobre o cartão, ele compõe `#70497f` (calculado,
  canal a canal em sRGB, arredondado). Ele **escurece** o cartão: todo par de texto claro sobe sobre
  ele, e todo par de fundo claro contra a superfície também. Por isso o **pior ponto** de cada par
  abaixo é o cartão sem círculo; o dev confirma no pixel desenhado, nas 7 larguras, onde o círculo
  passa por baixo de texto ou do botão.

**Os pares da faixa (RP-09).** Calculados pelo especificador a partir dos hexadecimais do
`src/estilos/tokens.css`, pela fórmula de luminância relativa do WCAG 2.x, arredondados para baixo.
O dev mede de novo e registra no relatório; se algum der abaixo do mínimo, **para e reporta**, sem
trocar cor por conta própria. Nenhum token existente muda.

| Elemento e estado | Frente | Superfície | Cartão `#82558f` | Círculo `#70497f` | Mínimo |
| --- | --- | --- | --- | --- | --- |
| Título `h2`, aviso, link em repouso | texto `--color-bg` `#f5ead8` | cartão ou círculo | **4,84:1** | 5,98:1 | 4,5 |
| Selo "Inscrições fechadas" | texto `--color-accent-800` `#4e3260` | fundo do selo `--color-bg` | 9,05:1 (sobre o selo) | igual | 4,5 |
| Selo, borda (informativo; não é controle) | fundo `--color-bg` | cartão ou círculo | 4,84:1 | 5,98:1 | — |
| Botão, repouso | texto `--color-accent-800` | fundo `--color-bg` | 9,05:1 (sobre o botão) | igual | 4,5 |
| Botão, repouso, borda | fundo `--color-bg` | cartão ou círculo | **4,84:1** | 5,98:1 | 3 |
| Botão, hover | texto `--color-accent-800` | fundo `--color-accent-200` `#eee0f4` | 8,51:1 (sobre o botão) | igual | 4,5 |
| Botão, hover, borda | fundo `--color-accent-200` | cartão ou círculo | **4,55:1** | 5,63:1 | 3 |
| Botão, pressionado | texto `--color-accent-800` | fundo `--color-accent-300` `#dcc5e8` | 6,76:1 (sobre o botão) | igual | 4,5 |
| Botão, pressionado, borda | fundo `--color-accent-300` | cartão ou círculo | **3,61:1** | 4,47:1 | 3 |
| Botão e link, `focus-visible` | anel `--color-bg` (trocado no estilo da faixa, não na variante), `--focus-ring-width` com `--focus-ring-offset` | cartão ou círculo | **4,84:1** | 5,98:1 | 3 |
| Link, hover | texto `--color-bg` | `--color-fundo-hover` (7 % de `--color-text`) sobre o cartão, `#7b5187`; sobre o círculo, `#6a4678` | **5,23:1** | 6,39:1 | 4,5 |
| Link, pressionado | texto `--color-bg` | `--color-fundo-pressionado` (14 % de `--color-text`) sobre o cartão, `#744d7f`; sobre o círculo, `#654371` | **5,67:1** | 6,79:1 | 4,5 |

Em negrito, o pior ponto de cada par. O botão em `focus-visible` guarda o fundo do estado em que
está; o anel fica fora dele, sobre o cartão, pelo deslocamento de 2 px.

- **Os estados do botão** usam só degraus da rampa que já existem (`--color-bg`,
  `--color-accent-200`, `--color-accent-300`), escolhidos pelo contraste: o repouso é o do protótipo
  (botão creme, texto `--color-accent-800`); o hover e o pressionado escurecem o botão um degrau da
  rampa cada, e o pressionado é o de menor folga contra o cartão (3,61:1). O hover fica em `@media (hover:
  hover)`, como no `Botao`. Se o protótipo tiver hover próprio para esse botão, o dev registra, e a
  diferença entra na classificação do `guardiao-visual`.
- **O anel de foco (acréscimo do Gabriel à Q9 (a), 23/11/2026).** O anel do site, o
  `:focus-visible` do `global.css` em `--color-accent-700` `#683f74`, mede **1,42:1** contra o
  cartão (calculado 1,428:1: o texto do Gabriel diz 1,43:1, arredondado ao mais próximo; aqui fica
  1,42:1, arredondado para baixo como a tabela; é o mesmo valor), e `--color-text` mede 2,88:1: os dois reprovam. Por isso o **estilo da
  faixa** declara `outline-color: var(--color-bg)` para **tudo o que recebe foco dentro dela**: o
  botão e o link do Instagram no aviso. É o precedente de
  `src/features/processo-seletivo/componentes/FaixaDoTopo.module.css` (linha 109, `.link:focus-visible
  { outline-color: var(--color-bg); }`). A troca é só da cor: a largura e o deslocamento continuam
  os do site. **Fica no estilo da faixa, e não na variante.** O anel mede **4,84:1** contra o cartão
  (`--color-bg` `#f5ead8` sobre `--color-accent-600` `#82558f`) e 5,98:1 sobre o círculo. O dev
  mede no pixel, e o par é nomeado na §7 e no relatório com os outros (RP-09).
  - **Consequência, apontada sem decisão a pedir:** a variante sozinha não traz anel legível sobre
    fundo escuro. Outra tela que a usar precisa trocar a cor do anel no próprio bloco, como a faixa.
    Cabe no comentário da variante, para a próxima diretoria achar.
- **O link do aviso** sobre o cartão: creme sublinhado, alvo de 44 px e o nome acessível que já está
  no conteúdo. **Os estados da `FaixaDoTopo` não servem aqui**: o hover `--color-accent-300` mede
  3,61:1 sobre o cartão, e o pressionado `--color-fundo-pressionado-sobre-escuro` compõe `#926a99`,
  em que o creme mede 3,71:1. Qualquer fundo que clareie o cartão também reprova (o creme sobre o
  cartão com 7 % de `--color-bg` por cima, `#8a5f94`, mede 4,25:1). Por isso os estados do link **escurecem** o fundo, com os tokens
  existentes `--color-fundo-hover` e `--color-fundo-pressionado`, e o texto fica creme.
- **A medir pelo dev:** cada par da tabela no pixel desenhado (as composições de cor por
  transparência dependem do arredondamento do navegador, e os valores calculados podem variar em
  0,01 ou 0,02); onde o círculo passa por baixo de texto e do botão em cada largura; o estado
  pressionado sobre o círculo, se o botão ficar sobre ele em 390.
- **Composição:** a grade `minmax(0,1fr) auto` do `.cta-box` acima do corte e uma coluna abaixo,
  com o botão na largura toda em 390. O corte vem do `data-resp` do protótipo e é lido pelo dev.

### D5 — O bloco de contato

- **Topo (Q4 (a)):** sobretítulo "Contato" em parágrafo e `h2` "Onde a Liga responde", sem frase e
  sem botão (Q5 (a)). Seção em superfície, como o gabarito.
- **Moldura (Q6 (a)):** o `QuadroDeContato` ganha uma prop de variante de apresentação, por exemplo
  `apresentacao: 'solto' | 'cartao'`, com `'solto'` como padrão (§2.3: variante, e não booleana;
  prop opcional com padrão declarado). `QuadroDoInstagram` e `QuadroDoEmail` repassam a prop. No
  `'cartao'`: fundo `--color-bg`, `--radius-lg`, preenchimento 18/22 px, círculo de 104 px e vão de
  20 px, lidos do protótipo e postos em tokens novos. O **link é o próprio cartão**, com a camada
  de cobertura que já existe, e o foco contorna o cartão. Em `'solto'`, nada muda.
- **A condição da Q6 (a), do Gabriel:** a variante "cartão" não muda nada em `/contato`. A prova
  tem duas partes, e as duas entram no relatório:
  1. **Pixel a pixel contra o arquivo.** A pasta
     `openspec/changes/archive/2026-11-23-pagina-contato/prints/` **não tem print só do site** de
     `/contato`: tem `lado-a-lado-contato-390.png` (874 × 2649) e `lado-a-lado-contato-1280.png`
     (2654 × 1298), com o protótipo à esquerda e a captura do site à direita, cada uma numa moldura
     de 1 px, sob duas linhas de legenda. As larguras fecham com escala 1, sem redimensionar: 30 +
     (1 + 390 + 1) + 30 + (1 + 390 + 1) + 30 = 874, e o mesmo com 1280 dá 2654. A captura do site
     começa, então, em x = 453 (390) e x = 1343 (1280), com 390 e 1280 px de largura (**inferido
     pelas dimensões, não medido**). **Este método, o corte pela moldura do lado a lado, foi
     aprovado pelo Gabriel em 23/11/2026** (junto da Q9; literal no `relatorio.md`): é melhor que os
     prints do CI, que rodam noutra máquina e desenham a fonte de outro jeito. Ele deixa de ser
     condicional; continua valendo só a conferência da moldura, abaixo. O `guardiao-visual` localiza a moldura da direita pela linha de
     1 px, confere esses x, recorta o miolo da moldura (sem a linha) e compara com a captura de
     `/contato` desta branch feita pelo mesmo método da `pagina-contato` (Chromium do Playwright,
     escala 1, janelas 390 × 844 e 1280 × 800, página inteira, movimento reduzido, depois das fontes
     e imagens). Esperado: mesmas dimensões e **0 pixel diferente** nas duas larguras. Os outros
     `lado-a-lado-*` (cabeçalho, rodapé, menu, estados, esboço) não entram nesta prova.
  2. **Os testes da `pagina-contato` sem asserção alterada.** O e2e `tests/e2e/contato.spec.ts` e
     os testes de unidade `src/componentes/padroes/ListaDeContatos.test.tsx` e
     `src/features/contato/conteudo.test.ts` passam, e `git diff --numstat main` nesses três
     arquivos mostra **0 linha removida** (só acréscimo). Se alguma linha que já existe precisar
     mudar, o dev para e reporta.

  Se a moldura não for achada onde as dimensões dizem, ou se a diferença não for 0, o
  `guardiao-visual` para e reporta; ninguém troca o arquivo de referência.
- **Contraste (RP-09):** o rótulo e o dado sobre o cartão `--color-bg` já estão medidos (5,53:1 e
  9,05:1). O hover e o pressionado são medidos de novo sobre o fundo do cartão; o sobretítulo e o
  título, sobre a superfície da seção.
- **Teste de unidade:** o `ListaDeContatos.test.tsx` ganha a composição da inicial com
  `'cartao'` e imprime `quadros na composição da inicial: 2`, que já existe, e
  `apresentação cartão: 2`.
- **Nota de reúso (I1 da `pagina-contato`):** os dados continuam fixos (`contato-da-liga.ts`). O
  critério do I1 (destino só `https://`, `mailto:` sem `?`, `&` nem quebra de linha) não é acionado,
  e o destino dele não muda: a primeira change que passar dado variável ao quadro.

### D6 — A composição da raiz

- A ordem no código é a de leitura, em toda largura: hero, números, faixa, contato. Nenhuma grade
  reordena.
- Títulos: o `h1` do hero; o `h2` da faixa; o `h2` do contato. Os números não têm título.
- Fundos (gabarito): hero e números no fundo da página; a faixa numa seção no fundo da página, com o
  cartão; o contato em superfície.
- A rota da raiz não ganha `metadata` nova: continua `montarMetadados('/')`.

### D7 — Verificações e RP-12

O `qa-acessibilidade` escreve no `tests/e2e/pagina-inicial.spec.ts` (e num apoio de leitura do
documento, se não couber), lendo o documento, a §7 e o protótipo, sem copiar texto:

1. **Números:** do §9, os quatro da frase "Os indicadores aprovados (…)", lidos entre parênteses.
   Imprime `números lidos do documento: 4`. Os rótulos vêm da linha nova da §7. Confere a ordem, a
   lista de 4 itens e a disposição (2 colunas em 390, 4 em 1280).
2. **Faixa:** o aviso do §5.1, palavra por palavra; o selo e o título, da §7. Confere o link (destino,
   nova aba, `rel` sem acesso nem origem, nome acessível com o texto visível), o botão com destino
   `/processo-seletivo` e os termos proibidos ("2026.2", "Inscrições abertas", "28 de agosto",
   "prova de conhecimentos", "Ver o edital", datas no formato dd/mm). **Fonte única:** abre
   `/processo-seletivo`, lê o selo e o aviso de lá e compara com os da faixa; imprime
   `faixa e página: 2 trechos iguais`. **Contraste** de cada texto da faixa sobre o cartão e sobre o
   círculo, como o teste do lema, com as cores nomeadas; e os pares da tabela do D4: o texto do
   selo e do botão sobre o fundo de cada um, o fundo do botão contra o cartão em repouso, hover e
   pressionado, o anel de foco do botão e do link contra o cartão, e o link nos três estados.
   **Anel de foco (Q9 (a), acréscimo):** o teste foca pelo teclado (Tab, não `focus()` direto) o
   link do aviso e o botão da faixa e, em cada um, confere que o anel aparece (estilo diferente de
   `none` e largura maior que 0) e que a cor dele é `--color-bg` `#f5ead8`, e não o anel do site;
   imprime as duas cores e a medida contra o cartão.
3. **Contato:** o @ e o e-mail do §1; o sobretítulo e o título da §7; a lista de 2 itens; um ponto
   perto do canto de cada cartão pertence ao link; o nome acessível começa pelo texto visível; os
   termos proibidos (a frase, "Mandar uma mensagem", "Onde estamos", `liacup@unb.br`, as legendas do
   §6, o travessão).
4. **Fora da R1:** os termos do requisito, lidos do protótipo; nenhuma `section` sem texto.
5. **Ordem e títulos:** a sequência dos blocos; 1 `h1`, 2 `h2`, nenhum salto; a ordem de foco igual
   nas 7 larguras.
6. Os contadores das medições gerais (`listas-anunciadas`, alvos) sobem sozinhos.
   `paginas-publicas.spec.ts`, `interruptor.spec.ts` e `playwright.config.ts` **não mudam**.

Demonstrações de falha, cada uma com a saída vermelha e a verde no relatório:

| # | Violação temporária | Vermelho esperado |
| --- | --- | --- |
| 1 | "21" trocado por "22" no lugar dos números | e2e: o trecho, o esperado do §9 e o recebido |
| 2 | Três números no lugar dos dados | unidade: a quantidade |
| 3 | Uma palavra do aviso trocada no conteúdo do processo seletivo | e2e da inicial: o trecho; e2e de `/processo-seletivo`: o trecho |
| 4 | A faixa com o aviso escrito na composição, e o conteúdo alterado | e2e: "faixa e página divergem", com os dois textos |
| 5 | "Ver o edital" no lugar do rótulo do botão | e2e: o termo e onde |
| 6 | Uma seção "Próximos eventos" vazia, com `h2` | e2e: o termo e a seção sem texto |
| 7 | O link do contato só no miolo, e não no cartão inteiro | e2e: o cartão e o ponto fora do link |
| 8 | O fundo do cartão da faixa no lilás da marca | e2e de contraste: o texto, as duas cores e a medida |
| 9 | A lista dos números sem o papel de lista | e2e das listas anunciadas: a página e a lista |
| 10 | O botão da faixa na variante `primario` | e2e de contraste: o fundo do botão contra o cartão, as duas cores e a medida (1:1) |
| 11 | A troca da cor do anel tirada do estilo da faixa | e2e do anel: o elemento focado, a cor esperada `#f5ead8` e a recebida `#683f74`, e a medida contra o cartão |
| 12 | A classe da variante nova apagada do estilo do botão | e2e de contraste da faixa: o fundo do botão contra o cartão, as duas cores e a medida |

As demonstrações 11 e 12 entram pela Q9 (a): o RP-12 manda ver falhar toda verificação nova.
**Troca da demonstração 12 (Gabriel, 23/11/2026, Q13 (a) da `inicio-completo`):** o vermelho
esperado era o teste de unidade do contrato, mas o Vitest não enxerga a classe CSS e saiu com
código 0 (22 de 22). A demonstração 12 passa a ser o e2e de contraste da faixa, visto vermelho
com a mesma violação. O teste do contrato continua conferindo que botão e link da variante
`claro` têm as mesmas classes.

Depois, `git status --porcelain` igual ao de antes, `sha256sum -c` com OK nos arquivos tocados e
`git grep -c --untracked DEMO-RP12 -- src tests/e2e` com código 1. Nenhuma demonstração toca
`src/proxy.ts`.

### D8 — Escopo nominal e conferência proporcional

| Quem | Arquivos |
| --- | --- |
| `dev-frontend` | `src/app/(site)/(publicas)/page.tsx` (e um `page.module.css` ao lado, se a composição pedir); `src/features/numeros-da-liga/` (nova); em `src/features/processo-seletivo/`, o componente novo da faixa e só linhas acrescentadas em `conteudo.ts`, `tipos.ts` e `conteudo.test.ts`; em `src/features/contato/`, o componente novo e só linhas acrescentadas em `conteudo.ts`, `tipos.ts` e `conteudo.test.ts`; pela Q6 (a), `src/componentes/padroes/QuadroDeContato.{tsx,module.css}`, `QuadroDoInstagram.tsx`, `QuadroDoEmail.tsx` e `ListaDeContatos.test.tsx` (este só com linhas acrescentadas); pela Q9 (a), decidida, `src/componentes/ui/Botao.module.css` e `Botao.test.tsx` só com linhas acrescentadas, e `src/componentes/ui/aparencia-de-botao.ts` com a linha da união trocada; com a recomendação da Q10, `src/componentes/ui/Botao.tsx` com a linha da lista da prop trocada; `src/estilos/tokens.css` só com linhas acrescentadas |
| `qa-acessibilidade` | `tests/e2e/pagina-inicial.spec.ts` e, se preciso, um apoio de leitura novo em `tests/e2e/` |
| `guardiao-visual` | `openspec/changes/inicio-completo/prints/` |
| Líder técnico | `docs/REFERENCIA-VISUAL.md` §7 (tarefas 1.1 e 1.2); `docs/PLANO-DE-DESENVOLVIMENTO.md`, só a linha 9 da tabela da R1 (tarefa 1.3, Q8 (a)); `docs/SEGURANCA.md` §7 (tarefa 4.2); o `relatorio.md` |
| `especificador` | `openspec/changes/inicio-completo/` |

**Não mudam:** `src/app/(site)/(publicas)/_inicio/`, `src/lib/utils/paginas-publicas.json` e o teste
dela, `src/proxy.ts`, `src/app/layout.tsx`, `src/app/(site)/em-construcao/`, `src/componentes/layout/`,
`src/componentes/ui/` fora os três arquivos da Q9 (a) e o `Botao.tsx` da Q10 (a) (com a Q10 (b), só os três), os outros
arquivos de `src/componentes/padroes/`, `src/features/processo-seletivo/componentes/` existentes,
`src/features/contato/componentes/TopoDoContato*`, as rotas das outras páginas, `assets/`, `public/`,
`tests/e2e/contato.spec.ts`, `tests/e2e/paginas-publicas.spec.ts`, `tests/e2e/interruptor.spec.ts`,
`playwright.config.ts`, `lighthouserc.json`, `scripts/`, `.github/`, `package.json`,
`package-lock.json`, `docs/conteudo-institucional.md` (Q1 (a) e Q4 (a) decididas), o resto do
`docs/PLANO-DE-DESENVOLVIMENTO.md`, `docs/PADROES-DE-CODIGO.md` e `openspec/specs/`. Arquivo fora das
listas é desvio, nomeado na entrega.

**Conferência proporcional do guardião** (`SEGURANCA.md` §5): **passo 1, checklist inteiro**, por
dois arquivos da lista do gatilho (`SEGURANCA.md` §5, "Lista do gatilho", a linha dos `docs/`):

- o **`docs/SEGURANCA.md`**, porque os prints do `guardiao-visual` são binários novos, e a §7 manda a
  linha de origem no mesmo diff (tarefa 4.2);
- o **`docs/PLANO-DE-DESENVOLVIMENTO.md`**, porque a Q8 (a) do Gabriel troca nesta change a linha 9
  da tabela da R1 (tarefa 1.3). Sozinho, ele já levaria ao passo 1; com o `docs/SEGURANCA.md` no
  diff, a classificação não muda, e foi por isso que o Gabriel o trouxe para cá.

Todo o resto do diff previsto está na lista de tela, e nenhum arquivo acrescenta `process.env` nem
`NEXT_PUBLIC_`.

### D9 — O P23

Pela forma da `SEGURANCA.md` §5, sem mudança nela. Host exato
`portal-liacup-git-feat-inicio-completo-liacup1.vercel.app` (46 caracteres antes de `.vercel.app`,
contados à mão; abaixo do corte de 63), rota `/`. O Gabriel confirma o host, letra por letra, e o
commit no painel da Vercel antes do `curl`. A resposta esperada é `200`, sem `Location`, com
`X-Matched-Path: /` (e não `/em-construcao`). Fica registrado no `relatorio.md` e commitado antes do
merge.

### Fontes do texto que vai ao ar

| Texto | Fonte |
| --- | --- |
| "21", "7", "4", "2026" | `conteudo-institucional.md` §9 |
| Rótulos dos números | Q1 (a): protótipo, rótulos de interface na §7 |
| "Inscrições fechadas" | §7, linha "Processo seletivo, selo da faixa do topo" |
| Título da faixa | Q2 (a): o `titulo` do conteúdo do processo seletivo |
| Aviso | §5.1 |
| Rótulo do botão da faixa | Q3 (a): "Quero participar", do hero, na §7 |
| "Contato" e o título do bloco | Q4 (a): "Contato" (já na §7) e "Onde a Liga responde", rótulo de interface na §7 |
| "Instagram", "E-mail", `@liacup.unb`, `liacup.unb@gmail.com` | §7, linha "Contato, página", e §1 |

## Risks / Trade-offs

| Risco | Mitigação |
| --- | --- |
| O vão entre o hero e os números não fechar sem mexer no hero | D3: o dev mede e registra; se só fechar mexendo no hero, para e reporta; o `guardiao-visual` classifica |
| A variante "cartão" mudar `/contato` sem ninguém ver | `'solto'` como padrão; o `guardiao-visual` compara `/contato` com o recorte do site nos prints arquivados da `pagina-contato`, em 390 e 1280, com 0 pixel de diferença (D5); os testes da `pagina-contato` sem linha removida |
| O recorte dos prints arquivados não bater (moldura fora do lugar, fonte desenhada de outro jeito) | O `guardiao-visual` para e reporta, e o Gabriel decide; a referência arquivada não se troca |
| Um texto da faixa reprovar sobre o círculo decorativo | O círculo escurece o cartão, e o pior ponto calculado é o cartão (D4); o e2e de contraste mede sobre o círculo também (D7, item 2); se reprovar, o dev para e reporta |
| Reusar os estados do link da `FaixaDoTopo` na faixa da inicial | D4: o hover e o pressionado de lá medem 3,61:1 e 3,71:1 sobre o cartão; a demonstração 8 do D7 cobre o fundo, e o e2e mede o link nos três estados |
| O botão da faixa sair na variante `primario`, da cor do cartão | D4 e Q9; o cenário "O botão em cada estado" exige fundo diferente do cartão e borda ≥ 3:1 |
| O anel do site (1,42:1) aparecer sobre o cartão | D4: a faixa troca a cor do anel para `--color-bg` em tudo o que recebe foco nela; e2e pelo teclado no botão e no link; demonstração 11 |
| Outra tela usar a variante nova sobre fundo escuro sem trocar o anel | Apontado no D4; cabe no comentário da variante |
| A variante nova existir só no link, e não no `Botao` | Q10 (a): a lista da prop do `Botao.tsx` ganha a variante, e o teste do contrato desenha os dois (o tipo do `Botao` não deixa a variante faltar); a demonstração 12, depois da Q13 (a), é o e2e de contraste e não cobre este risco |
| A faixa ler uma cópia do aviso, e não o conteúdo | A rota passa o objeto; o e2e compara a faixa com `/processo-seletivo`; demonstrações 3 e 4 |
| O "21" estar velho na data do lançamento | Decidido pelo Gabriel no Portão 1: vai como está no §9, e a liga confere os números na `homologacao-r1` |
| Mexer no `conteudo.ts` do processo seletivo quebrar a página | Só linhas acrescentadas; `git diff --numstat` com 0 removidas; o e2e de `/processo-seletivo` sem alteração |
| `openspec validate` recusar o delta | O especificador não rodou o validador (sem terminal). O líder técnico roda antes do Portão 1 |

## Open Questions

As oito Qn do Portão 1 foram decididas pelo Gabriel em 23/11/2026, todas na opção (a), três delas
com condição (aceite literal no `relatorio.md`). A Q9, nascida do cuidado da Q7 (a), foi decidida no
mesmo dia: (a), com o acréscimo do anel de foco e a aprovação do corte dos prints de `/contato`. A
Q10 nasceu da Q9 (a) e foi decidida no mesmo dia: (a), literal no `relatorio.md`.

| Qn | Assunto | Estado |
| --- | --- | --- |
| Q1 | Rótulos dos números | Decidida: (a) os do protótipo, na §7 |
| Q2 | Título da faixa | Decidida: (a) "Processo seletivo" |
| Q3 | Rótulo do botão da faixa | Decidida: (a) "Quero participar" |
| Q4 | Topo do bloco de contato | Decidida: (a) "Contato" e "Onde a Liga responde", sem frase |
| Q5 | Botão "Mandar uma mensagem" | Decidida: (a) sai |
| Q6 | Moldura dos quadros na inicial | Decidida: (a), com a condição de `/contato` igual aos prints arquivados e os testes dela sem asserção alterada (D5) |
| Q7 | Cor do cartão da faixa | Decidida: (a) `--color-accent-600`, com o botão fora da variante `primario` e os pares medidos (D4) |
| Q8 | "Chamadas" do plano | Decidida: (a), com a linha 9 do plano trocada nesta change (tarefa 1.3) |
| Q9 | Onde moram as cores do botão da faixa | Decidida: (a) variante nova no contrato do botão da camada `ui`, com o anel `--color-bg` no estilo da faixa (D4) |
| Q10 | A lista de variantes da prop do `Botao.tsx` | Decidida: (a) a linha trocada, com a variante nova acrescentada; quatro arquivos de `ui/` no diff |
