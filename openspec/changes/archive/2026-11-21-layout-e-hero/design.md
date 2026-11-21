# Design — layout e hero

## Context

Ver `proposal.md`, seção Why. Estado lido na `main` `6cce396` pelo especificador:

| O que | Situação |
| --- | --- |
| Rotas de `(site)` | `/` (`page.tsx`, desenha `PaginaEmConstrucao`) e `/em-construcao` (desenha o mesmo). Não há `layout.tsx` no grupo |
| Interruptor | `src/proxy.ts`. Não publicado: `/` é reescrito para `/em-construcao`; todo outro endereço leva 307 para `/`. Publicado: `/` passa direto para `page.tsx`; `/em-construcao` dá 404 |
| Página em construção | `PaginaEmConstrucao` compõe logo, `h1`, `LinksDeContato` e `Rodape` (só a linha institucional) |
| `public/` | Só `logo-liacup-256.png` (esta change acrescenta os 4 ícones do D10) |
| e2e | 7 projetos de largura; servidor 3000 publicado (`baseURL`) e 3001 não publicado. `pagina-inicial.spec.ts` confere a raiz **da 3000**, esperando "Portal em construção", e é o único lugar que confere "nenhum pedido a domínio externo". `interruptor.spec.ts` confere a raiz da 3001 (conteúdo, axe, rolagem) e as rotas `/vitrine`, `/sobre`, `/processo-seletivo`, `/em-construcao` e `/endereco-que-nao-existe` |
| Lighthouse | `lighthouserc.json`: `startServerCommand` `npm run start`, sem variável, uma URL (`http://localhost:3000/`), preset desktop. Mede o modo não publicado no CI; na máquina com `.env.local` em `true`, mede o publicado |
| Dependências diretas | 22 (4 + 18) |
| Referência de comportamento | A tag `arquivo/F03-layout-base` tem `src/componentes/layout/destinos-publicos.{json,ts}`, `NavegacaoPublica`, `usePainelDeNavegacao.ts`, `tests/e2e/navegacao-teclado.spec.ts` e `varredura-de-larguras.spec.ts`. **O especificador não leu esses arquivos** (não roda `git show`); o dev pode aproveitar comportamento e testes, nunca a aparência |

## Goals / Non-Goals

**Goals:**

- Uma moldura (cabeçalho, menu, rodapé) para toda página pública, que só mostra o que está na
  lista.
- A raiz publicada mostra a inicial com o hero; a produção continua byte a byte igual na tela.
- Toda página que entrar na lista é medida pelo e2e e pelo Lighthouse sem ninguém editar teste.

**Non-Goals:** ver "Fora de escopo" da proposta.

## Decisions

### D1 — A moldura vale para as páginas públicas, não para a página em construção

O layout com cabeçalho e rodapé fica num grupo de rotas que contém a raiz e as páginas públicas
futuras, e **não** contém `/em-construcao`. Grupo de rotas não muda endereço, então:

- `src/proxy.ts` não muda: a raiz não publicada continua reescrita para `/em-construcao`, que
  continua sem moldura;
- `PaginaEmConstrucao`, `Rodape` e `LinksDeContato` não mudam (`git diff --exit-code` sobre os três
  e o CSS deles);
- a raiz (`page.tsx`) troca a página em construção pela inicial. Como no D3 da
  `interruptor-em-construcao`, isso não a põe no ar: em produção o interruptor nem chega à raiz.

**Alternativa descartada:** pôr o layout no grupo `(site)` inteiro e esconder o cabeçalho na página
em construção por condição. Mudaria a página de produção e criaria uma regra que alguém esquece.

**Consequência aceita:** dois rodapés convivem até a `lancamento-r1`, o antigo (só na página em
construção) e o novo. A `lancamento-r1`, que desliga a página em construção, apaga o antigo.

### D2 — Que spec muda, e qual não muda

- **`fundacao-e-ci`: REMOVED "Página provisória no ar" e ADDED "Página provisória enquanto o site
  não está publicado".** O validador do OpenSpec não deixa um bloco MODIFIED largar nem renomear
  cenário, então o requisito sai e volta com nome novo; o conteúdo é o mesmo. Duas mudanças:
  - o cenário "A raiz com o site publicado, antes da página inicial" vira "A raiz com o site
    publicado", que mostra a inicial e não a página provisória;
  - o cenário "Visitante abre o endereço do portal" ganha "com o site não publicado". Sem isso ele
    passa a ser falso: diz que **toda** abertura da raiz mostra "Portal em construção". Este
    segundo ponto não estava no briefing nem na conferência do líder técnico.
- **`publicacao-do-site` não muda.** Nenhum cenário dela fala da raiz publicada. `/sobre` e
  `/processo-seletivo` continuam sem página nesta change, então continuam com 307 no modo não
  publicado e 404 no publicado; `/vitrine` continua igual; `/em-construcao` continua com 404 no
  publicado. O `interruptor.spec.ts` deve passar **sem nenhuma alteração**
  (`git diff --exit-code tests/e2e/interruptor.spec.ts`). Quando a change 2 criar
  `/processo-seletivo`, é ela que atualiza esses cenários, como a D6 da `interruptor-em-construcao`
  já previa para `/sobre`.
- `referencia-visual` e `design-tokens` não mudam.

### D3 — A lista única

- **Formato:** um arquivo JSON com a lista, e um módulo TypeScript que o lê com tipo e oferece as
  consultas (páginas do menu, páginas de cada coluna do rodapé, página de destaque, "este endereço
  está na lista?"). JSON porque a configuração do Lighthouse (D8) precisa lê-lo sem compilar
  TypeScript.
- **Onde:** em `src/lib/utils/`, porque é a única pasta que todas as camadas podem importar
  (`PADROES-DE-CODIGO.md` §1): o layout, a página inicial e os testes.
- **Cada entrada:** endereço, rótulo, e onde aparece: no menu (sim ou não), em qual coluna do
  rodapé ("Portal", "Conteúdo" ou nenhuma) e se é o destaque do cabeçalho. A ordem da lista é a do
  menu do protótipo (`menu-aberto-390.png`).
- **Nesta change:** uma entrada, Início (`/`), no menu e na coluna "Portal".
- **Os botões do hero** consultam a lista pelo endereço: "Quero participar" só existe se
  `/processo-seletivo` estiver nela, "Conheça a Liga" só se `/sobre` estiver. O destaque do
  cabeçalho e o botão do fim do menu lateral vêm da entrada marcada como destaque.
- **Teste de unidade** da lista: endereços começam com `/` e não se repetem, todo rótulo é não
  vazio, no máximo uma página de destaque. Imprime quantas entradas conferiu.
- **README:** uma seção curta, "Como acrescentar uma página ao menu", em linguagem de quem não
  programa: a página nova entra na lista **na mesma change** que cria a página, e nunca antes.

### D4 — Cabeçalho e menu lateral

- **Celular:** cabeçalho de até 64 px com logo, "LIACUP" e o botão de menu (`REFERENCIA-VISUAL.md`
  §4). **Desktop:** logo, "LIACUP", o nome da liga com "· UnB", e os links da lista em linha. O
  ponto em que um vira o outro é o do protótipo, levado para o corte mais próximo entre 480, 768 e
  1024 px (`PADROES-DE-CODIGO.md` §3); o dev mede no protótipo e registra no relatório.
- **Página atual:** marcada para leitor de tela e por um traço, não só por cor (adaptação
  aprovada). Nos destinos em linha, o traço é a barra do protótipo sob o rótulo, com a ponta
  redonda e o topo a 10 px do pé das letras em 1280 px, medido no print como o `guardiao-visual`
  mede (Q6 (a), 21/11/2026). No menu lateral, o sublinhado e a barra à esquerda do protótipo.
- **Menu lateral:** diálogo modal, com título "Navegação" e botão de fechar, como no protótipo. Abre
  e fecha pelo botão (que anuncia aberto ou fechado), fecha no Esc, no toque fora e ao escolher um
  destino, prende o foco enquanto aberto e devolve o foco ao botão que o abriu. A tag
  `arquivo/F03-layout-base` tem essa lógica com `<dialog>` nativo e testes de teclado; pode ser
  aproveitada.
- **Estados do ADR-0006** em todo link e botão: repouso, hover, pressionado, `focus-visible` e
  página atual. Desabilitado não se aplica.
- **Alvos de 44 px** em todas as larguras, inclusive os links em linha do desktop, que no protótipo
  têm de 22 a 32 px: cresce o preenchimento, não a letra (adaptação aprovada).
- O `'use client'` fica só no componente do menu (`PADROES-DE-CODIGO.md` §2.1). Cada componente com
  até 150 linhas.

### D5 — Rodapé

Componente novo, na camada de layout, sem tocar no `Rodape` atual (D1). Marca com logo, "LIACUP" e
o nome da liga; colunas "Portal" e "Conteúdo" lidas da lista, e coluna sem página não aparece;
coluna "Contato" com o Instagram `liacup.unb`, `liacup.unb@gmail.com` e a linha de endereço "FCTS ·
Campus UnB Ceilândia · Brasília/DF" (Q3 (b), `REFERENCIA-VISUAL.md` §7); linha final "© <ano>
LIACUP · Universidade de Brasília". Nada de "Painel da diretoria" nem da linha de protótipo.

- **Coluna de contato** (`REFERENCIA-VISUAL.md` §7, ajustes de 21/11/2026):
  - um ícone decorativo ao lado de cada item: Instagram, envelope e marcador de localização, na cor
    do texto, escondidos do leitor de tela;
  - os três itens com passo uniforme de 44 px, do topo do texto de um ao topo da primeira linha do
    seguinte, sem somar espaço visual ao alvo de toque. O protótipo tem 31,4 px, que não cabe com o
    alvo de 44 px. Quando o endereço quebra em duas linhas, o passo vale até a primeira;
  - o endereço é texto, não link;
  - ao lado do ícone do Instagram o texto é `liacup.unb`, sem o @; em frase corrida, sem ícone, o @
    continua.
- **Linha final** centralizada, já que o texto da direita do protótipo saiu (§7, 21/11).

- **Links do Instagram e do e-mail** (`REFERENCIA-VISUAL.md` §7):
  - o elemento do link inteiro é clicável, e não só o texto, com pelo menos 44 × 44 px;
  - o Instagram abre `https://www.instagram.com/liacup.unb/` em nova aba, com
    `rel="noopener noreferrer"`;
  - o e-mail abre `mailto:liacup.unb@gmail.com`;
  - o endereço e o perfil continuam escritos, para quem não tem aplicativo de e-mail poder copiar;
  - o nome acessível diz o destino em frase corrida e contém o texto escrito na tela (WCAG 2.5.3),
    por exemplo que o Instagram abre em nova aba e que o e-mail abre um e-mail novo para
    `liacup.unb@gmail.com`. Na frase corrida do Instagram o @ continua. O texto exato fica com o
    dev, sem inventar conteúdo institucional, e o relatório o registra.

- **O ano** é o da compilação, e não o "2026" escrito. Escrito, ele fica falso em janeiro de 2027
  sem ninguém perceber; o site se compila a cada change. Se o Gabriel preferir o número fixo, é
  trocar uma linha.
- **Contraste:** texto e títulos de coluna sobre o roxo escuro do rodapé com o par medido e
  registrado (RP-09).

### D6 — Hero

- Sobretítulo, título (`h1` da página), lema e apresentação, palavra por palavra do
  `conteudo-institucional.md` §2.0 (Q1 (a)). O sobretítulo "Universidade de Brasília" vem do
  protótipo e do nome da liga (§1). Nenhum texto fora dessas fontes.
- **O lema em `--color-accent-600`, em toda largura** (`REFERENCIA-VISUAL.md` §7; Q7 do Gabriel,
  21/11/2026, que trocou o `--color-accent-700` decidido no Portão 1). O lilás da marca `#9B6AAF`
  sobre o creme `#f5ead8` mede 3,48:1, e no celular o lema tem 20 px, então não conta como texto
  grande. O par `--color-accent-600` `#82558f` sobre `#f5ead8` é o do botão primário do ADR-0003,
  4,84:1, e passa de 4,5:1 em toda largura. O `qa-acessibilidade` confere a cor aplicada e registra o par (RP-09).
- **Borboletas:** as do protótipo em volta do hero, decorativas, escondidas do leitor de tela, nunca
  por cima de texto, respeitando a redução de movimento. Sem cor escrita à mão no desenho delas.
- **Botões:** pela lista (D3). Nesta change, nenhum aparece, e o hero não reserva espaço para eles.
- **Foto (Q2 (b), `REFERENCIA-VISUAL.md` §7):** o quadro do protótipo, com a superfície, o raio e a
  sombra dele, e uma borboleta da liga grande no centro, em opacidade baixa, sem texto e sem ícone,
  escondida do leitor de tela. A opacidade baixa não pode ser cor escrita à mão: vem de token, novo
  se preciso, com origem nomeada (RP-03). Não vai ao ar texto de marcação como "Foto institucional
  da Liga". Quando a liga mandar a foto, na homologação da R1, troca só o conteúdo do quadro.
- **Onde o hero mora:** é composição de uma página só, não componente reutilizável. O dev escolhe o
  lugar dentro da regra de camadas, que o lint verifica, e registra no relatório.

### D7 — Verificações e RP-12

O `qa-acessibilidade` escreve:

1. **Páginas da lista, site publicado, sete larguras:** para cada página, 200 sem redirecionamento,
   cabeçalho e rodapé presentes, axe 0, nenhuma rolagem horizontal, todo link e botão do cabeçalho,
   do menu aberto e do rodapé com pelo menos 44 × 44 px, e nenhum pedido a domínio externo. Nos
   links do Instagram e do e-mail do rodapé: o endereço, o alvo de nova aba e o `rel` do Instagram,
   o `mailto:` do e-mail, `liacup.unb` e o endereço escritos, e um nome acessível que diz o destino
   e contém o texto escrito (D5). Na coluna de contato, o ícone decorativo de cada item, o passo
   de 44 px e os alvos sem sobreposição; a linha final centralizada; e o ícone da aba nas páginas
   da lista e a ausência dele na raiz não publicada (D10).
   Imprime `[largura-N] páginas verificadas: <n>` e quantos alvos mediu.
2. **Todo link da moldura leva a página que existe:** cada link interno do cabeçalho, do menu e do
   rodapé aponta para um endereço da lista. Imprime quantos conferiu.
3. **Menu lateral por teclado**, nas larguras em que o botão de menu aparece: os seis
   comportamentos do D4. Nas outras, confere que os links em linha estão visíveis. Imprime em
   quantas larguras testou o menu, para que "não testou" não pareça "passou".
4. **A raiz publicada** (o spec que hoje espera "Portal em construção" na 3000): passa a esperar o
   título do hero e a ausência de "Portal em construção".
5. **Nenhum pedido a domínio externo na raiz não publicada**, que hoje só tinha essa conferência
   por acaso, porque a 3000 mostrava a mesma página.

Cinco demonstrações de falha, cada uma com a execução vermelha e a verde no relatório:

1. **Lista, unidade:** um endereço repetido deixa o teste de unidade vermelho, nomeando-o.
2. **Lista, e2e:** uma entrada temporária para um endereço sem página deixa o item 1 vermelho,
   nomeando o endereço e o status; retirada, verde com `páginas verificadas: 1`.
3. **Menu:** sem o fechamento no Esc (ou sem a devolução do foco), o item 3 fica vermelho nomeando
   o comportamento.
4. **Alvo:** um link do cabeçalho reduzido abaixo de 44 px deixa o item 1 vermelho, nomeando o
   elemento e a largura.
5. **Lighthouse:** com a mesma entrada temporária do item 2 na lista, a saída diz 2 páginas
   medidas no modo publicado; retirada, 1. Isso prova que a cobertura vem da lista. **O limiar em
   si não é demonstrado falhando de novo**: ele não muda nesta change, e a demonstração dele é da
   F00.

### D8 — Lighthouse nos dois modos, sem dependência nova

- O comando de desempenho roda o Lighthouse **duas vezes**, uma depois da outra, na porta 3000:
  1. **publicado**, com as URLs montadas a partir da lista;
  2. **não publicado**, só a raiz, que é a produção.
- Cada execução sobe o servidor com o modo **explícito** (`true` ou `false`), para o `.env.local` de
  quem roda não trocar o modo, como o `playwright.config.ts` já faz.
- Variável de ambiente no comando de iniciar não funciona igual no Git Bash, no `cmd` e no Linux do
  CI. Em vez de acrescentar `cross-env` (RP-01), um script curto em Node inicia o servidor com o
  modo pedido.
- **Como ficou** (relatório, `dev-frontend`, rodada 3, achado 7 do `revisor`): as duas
  configurações `lighthouserc.*.js` da primeira rodada exigiam Node 22.3, e o projeto aceita
  `>=22`. Deram lugar a um segundo script, `scripts/medir-desempenho.mjs`, que lê a lista e chama
  o Lighthouse uma vez por modo, com as URLs e o comando de iniciar por argumento. Limiar, preset e
  execuções continuam no `lighthouserc.json`, que não muda.
- A saída diz quantas páginas mediu em cada modo.
- Limiar e preset não mudam. `.github/` não muda: o passo do CI chama o mesmo comando.
- **Custo:** o passo de desempenho do CI passa a medir pelo menos 2 páginas em vez de 1, e cresce a
  cada página da lista.

### D9 — Escopo nominal

| Quem | Arquivos |
| --- | --- |
| `dev-frontend` | `src/lib/utils/` (a lista, o módulo e o teste dela); `src/componentes/layout/` (cabeçalho, menu, rodapé novos, o ícone de localização do rodapé e os CSS deles); `src/app/(site)/` (o layout das páginas públicas, a raiz, o hero e a mudança de grupo que o D1 pedir); `src/estilos/tokens.css` só com linhas acrescentadas; `public/icone-da-aba-{32,48,96}.png` e `public/icone-da-tela-de-inicio-180.png` (D10); em `scripts/`, o script de iniciar e o `medir-desempenho.mjs` do D8; `package.json`, só o comando de desempenho; `README.md`, só a seção do D3. Os `lighthouserc.*.js` da primeira rodada saíram na rodada 3, e o `lighthouserc.json` não muda |
| `qa-acessibilidade` | `tests/e2e/` (spec novo da moldura e das páginas da lista, spec novo do menu por teclado, `pagina-inicial.spec.ts` reescrito). `interruptor.spec.ts` não muda |
| `guardiao-visual` | `openspec/changes/layout-e-hero/prints/` |

Não mudam: `src/proxy.ts`, `PaginaEmConstrucao*`, `Rodape*`, `LinksDeContato*`,
`playwright.config.ts`, `.github/`, `package-lock.json`, `lighthouserc.json`. Arquivo fora destas
listas é desvio, e vai nomeado na entrega.

**Desvio do líder técnico, registrado aqui:** ele editou documentos fora de `openspec/`, para
cumprir decisões do Gabriel e achados do `guardiao-appsec`:

- `docs/SEGURANCA.md` §3 (a superfície nova da R1, achado A3) e §7 (a origem dos 15 PNG da change,
  Q5 (a), e dos 4 ícones de `public/`);
- `docs/REFERENCIA-VISUAL.md` §7 (a linha do lema, Q7, e as linhas de 21/11: ícone da aba, coluna
  de contato e última linha do rodapé);
- os artefatos desta change (`proposal.md`, `design.md`, `tasks.md` e a spec `pagina-inicial`,
  na Q7).

### D10 — O ícone da aba

Pedido do Gabriel em 21/11/2026 (`REFERENCIA-VISUAL.md` §7), entra nesta change como exceção ao
"fora de escopo" dos metadados, que continuam da `lancamento-r1`.

- Os 4 arquivos de `public/` são cópias exatas das variantes que já existem em `assets/` (32, 48,
  96 e 180 px), sem redimensionar: 3 para a aba e 1 para a tela de início do celular.
- Ficam declarados só no layout das páginas públicas, e não no layout de todo o site: a página em
  construção, que é a produção, continua sem ícone indicado (D1).

### Fontes do texto que vai ao ar

| Texto | Fonte |
| --- | --- |
| Título, lema e apresentação do hero | `conteudo-institucional.md` §2.0 (Q1 (a)) |
| Linha de endereço do rodapé | `REFERENCIA-VISUAL.md` §7 (Q3 (b)) |
| Sobretítulo "Universidade de Brasília", nome da liga | `conteudo-institucional.md` §1 e protótipo; marca UnB pendente (PLANO §11) |
| E-mail, Instagram, sede | `conteudo-institucional.md` §1 e §7; `REFERENCIA-VISUAL.md` §6 |
| Rótulos de interface: "Início", "Navegação", "Portal", "Conteúdo", "Contato", nomes acessíveis dos botões | Protótipo. São rótulos de navegação, não texto institucional |

## Risks / Trade-offs

| Risco | Mitigação |
| --- | --- |
| A página de produção mudar sem ninguém ver | D1; prints antes e depois; `git diff --exit-code` nos arquivos dela; `interruptor.spec.ts` sem alteração e verde |
| Menu com um item só parecer pobre na prévia | É a regra do princípio 8. O guardião registra como diferença do gabarito, com veredito "adaptação: página ainda não existe" |
| "Processo seletivo sempre visível" (`REFERENCIA-VISUAL.md` §4) contra "o menu mostra só página que existe" (constitution, princípio 8) | Vence a constitution (nível 1). O botão aparece na change 2, sozinho |
| A lista e uma página divergirem (página criada sem entrar na lista, ou o contrário) | Item 2 do D7 pega link sem página; o README diz que as duas coisas entram na mesma change |
| O desenho das borboletas trazer cor em hexadecimal e quebrar `verificar:tokens` | Cor por token ou pela cor herdada do texto |
| O teste do menu passar sem testar, numa largura em que o botão não aparece | Contador de larguras do item 3 do D7 |
| A `ajustar-ci-ao-novo-fluxo` repetir a cobertura derivada da lista | A tabela da R0 no PLANO §7 ainda cita "cobertura de e2e e Lighthouse derivada da lista de páginas" nela; a da R1 já não. Fica para o gestor acertar o PLANO |

## Open Questions

Nenhuma aberta. O aceite literal do Gabriel, em 20/11/2026: "Portão 1 aprovado. Decisões do
Gabriel: Q1 (a), Q2 (b), Q3 (b)." As opções ficam abaixo como registro.

### Decisões depois do Portão 1 (21/11/2026)

As opções, os custos e os aceites literais estão no `relatorio.md`, seção "Decisões do Gabriel
depois do Portão 1". Aqui, só onde cada uma entrou:

| Qn | Decisão | Onde entrou |
| --- | --- | --- |
| Q4 (c) | O `AparenciaDeBotao` fica, com o comentário corrigido; a unificação com o `Botao` é da `pagina-processo-seletivo` | D9, sem mudança de escopo |
| Q5 (a) | Os 15 PNG da change são versionados, com a origem na `SEGURANCA.md` §7 | D9, desvio do líder técnico |
| Q6 (a) | A barra da página atual a 10 px do pé das letras em 1280 px, com a ponta redonda | D4; spec `navegacao-publica` |
| Q7 | O lema em `--color-accent-600` | D6; spec `pagina-inicial`; `REFERENCIA-VISUAL.md` §7 |
| §7, 21/11 | Ícone da aba com a logo da liga | D10; spec `navegacao-publica` |
| §7, 21/11 | Coluna de contato com ícone em cada item e passo de 44 px; `liacup.unb` sem o @ ao lado do ícone | D5; spec `navegacao-publica` |
| §7, 21/11 | Última linha do rodapé centralizada | D5; spec `navegacao-publica` |

A Q6 não tem linha na `REFERENCIA-VISUAL.md` §7: vale pelo aceite no `relatorio.md`.

### Q1 — O parágrafo de apresentação do hero

**Decidido (Gabriel, 20/11): (a).** O gestor já pôs título, lema e apresentação no
`conteudo-institucional.md` §2.0. A tarefa 1.7 confere o texto contra ele.

O protótipo diz: "A LIACUP reúne estudantes de diversas áreas do conhecimento em torno do ensino, da
pesquisa e da extensão em cuidados paliativos. Aqui fica guardado, em um só lugar, tudo o que a
Liga produz." A `REFERENCIA-VISUAL.md` §5 registra a revisão da liga ("diversas áreas do
conhecimento"), mas a frase inteira não está no `conteudo-institucional.md`, que é a fonte de todo
texto (princípio 5). O título e o lema também só estão na `REFERENCIA-VISUAL.md` §5.

- **(a)** Usar a frase do protótipo, revisada pela liga, depois de uma emenda ao
  `conteudo-institucional.md`, decidida pelo Gabriel, com uma seção "Início — hero" que registra
  título, lema e parágrafo, com a fonte (protótipo aprovado e revisão de 13/08). Custo: uma emenda
  de documento antes da implementação, escrita pelo líder técnico ou pelo gestor. E a segunda
  frase promete "tudo o que a Liga produz" num site que, no lançamento, terá poucas páginas: a liga
  deve vê-la na prévia sabendo disso.
- **(b)** Usar a Apresentação do §2.1 (a da Sobre). Custo: nenhuma emenda, mas o mesmo parágrafo
  abre a Sobre na change 4, e o texto tem cerca do dobro do tamanho do protótipo, o que muda o
  equilíbrio do hero contra o gabarito. Título e lema continuam sem registro no documento de
  conteúdo.
- **(c)** Sair sem parágrafo até a liga confirmar. Custo: o hero fica com sobretítulo, título e
  lema, sem botões nesta change: mais vazio que o gabarito, e uma diferença a registrar. Pôr o
  parágrafo depois é mudar uma linha.
- **Recomendo (a)**, porque o texto já foi aprovado e revisado pela liga, e a emenda põe título,
  lema e parágrafo na fonte única que a constitution exige.

### Q2 — O espaço da foto institucional

**Decidido (Gabriel, 20/11): (b).** Registrado também na `REFERENCIA-VISUAL.md` §7. Aplicado no
D6.

A foto não existe. Os esboços estão em
`openspec/changes/layout-e-hero/prints/qn-foto-<a|b|c>-<390|1280>.png`, seis arquivos feitos pelo
líder técnico. São esboço, não implementação: partem do protótipo e trocam só o quadro. Por isso o
cabeçalho que aparece neles ainda é o do protótipo, com "Processo seletivo" e "Painel", e os
números foram cortados.

- **(a)** Hero em coluna única, sem o quadro. Custo:
  - em 1280 px a composição do hero muda: o título passa a duas linhas largas, e a metade direita
    fica vazia. É mudança na composição de uma página aprovada (princípio 4), e só entra com o
    aval do Gabriel;
  - no esboço, a borboleta pequena, a que fica a 42% da direita, cai por cima da palavra
    "sublime" do título em 1280 px. Pela `REFERENCIA-VISUAL.md` §4, borboleta decorativa nunca
    fica por cima de texto, então ela teria de mudar de lugar, e esse lugar novo não está no
    protótipo;
  - quando a foto chegar, uma change volta às duas colunas.

  Em 390 px é a saída mais limpa, porque o hero termina no parágrafo, sem bloco abaixo.
- **(b)** Quadro com a superfície, o raio e a sombra do protótipo, e uma borboleta da liga grande
  no centro, com opacidade baixa, escondida do leitor de tela, sem texto. Custo:
  - mantém a composição do gabarito nas duas larguras, e usa só o símbolo da liga;
  - a borboleta grande no quadro é um uso novo dela, que não está no protótipo, e entra como
    melhoria a aprovar;
  - em 390 px, o quadro é um bloco de cerca de 265 px de altura entre o parágrafo e o rodapé;
  - quando a foto chegar, troca só o conteúdo do quadro.
- **(c)** Quadro igual ao de (b), com a logo da liga no centro, o mesmo arquivo do cabeçalho,
  também decorativa e sem texto. Custo:
  - mantém a composição do gabarito, como (b);
  - a logo aparece duas vezes na mesma tela, no cabeçalho e no quadro;
  - o texto em volta da logo fica pequeno e ilegível no quadro, e, escondido do leitor de tela, é
    texto que só quem enxerga recebe pela metade;
  - o arquivo de 256 px, ampliado, pode perder nitidez em tela de alta densidade, e vira a maior
    imagem da primeira tela, com peso no Lighthouse;
  - em 390 px, o mesmo bloco de (b).
- Descartada: o espaço vazio com a proporção reservada, sem fundo nem borda, que a primeira versão
  desta questão trazia. Lê como defeito de layout.
- **Recomendo (b), e não mais (a).** Os esboços mostraram duas coisas:
  - (a) muda a composição do hero aprovado e ainda exige um lugar novo para a borboleta;
  - o quadro com a borboleta não lê como rascunho, que era o motivo pelo qual eu recomendava (a):
    não tem texto de marcação nem ícone de imagem ausente, e só usa o símbolo da liga.

  Entre (b) e (c), (b) não repete a logo e não traz texto ilegível.

### Q3 — A linha de endereço no rodapé

**Decidido (Gabriel, 20/11): (b).** "FCTS · Campus UnB Ceilândia · Brasília/DF", registrado também
na `REFERENCIA-VISUAL.md` §7. Aplicado no D5.

O protótipo diz "Campus Darcy Ribeiro · Brasília/DF". O briefing e a `REFERENCIA-VISUAL.md` §6 dão
"FCTS · Campus UnB Ceilândia".

- **(a)** "FCTS · Campus UnB Ceilândia", como no briefing. Custo: tira "Brasília/DF", que não
  estava errado.
- **(b)** "FCTS · Campus UnB Ceilândia · Brasília/DF". Custo: nenhum texto inventado (a sede no
  `conteudo-institucional.md` §1 termina em "Brasília/DF"), mas a linha fica mais longa e pode
  quebrar em duas em 360 px.
- **Recomendo (b)**, porque a correção obrigatória troca só o que estava errado e mantém o resto do
  protótipo.
