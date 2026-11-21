# Proposta — layout e hero

## Why

É a primeira tela de verdade do portal e a primeira change da R1. Hoje, com o site publicado, a
raiz ainda mostra a página em construção, e nenhuma página tem cabeçalho, menu ou rodapé. Toda
página da R1 que vier depois precisa dessa moldura, e precisa de um lugar só que diga quais páginas
existem: senão cada change edita o cabeçalho, o menu, o rodapé e os testes, e um link para página
que não existe escapa (constitution, princípio 8).

O gabarito são `prototipo/prints/inicio-1280.png`, `inicio-390.png` e `menu-aberto-390.png`, só nas
partes desta change: cabeçalho, menu aberto, hero e rodapé.

## What Changes

- **A lista única de páginas públicas.** Um lugar só diz quais páginas existem, com o endereço, o
  rótulo e onde cada uma aparece (menu, coluna do rodapé, botão de destaque do cabeçalho). Menu,
  rodapé, botões e verificações leem dela. Nesta change ela tem **só a Início**. Quando a
  `pagina-processo-seletivo` acrescentar a página dela, o botão "Processo seletivo" do cabeçalho e o
  "Quero participar" do hero aparecem sem ninguém editar o cabeçalho nem o hero.
- **Cabeçalho, menu lateral e rodapé** em toda página pública, como no protótipo:
  - sem o botão "Painel" no cabeçalho e sem o "Painel da diretoria" no rodapé (o painel é da R3,
    `REFERENCIA-VISUAL.md` §4);
  - sem a linha "Protótipo do Portal LIACUP · conteúdo de demonstração";
  - rodapé com os dados certos: `liacup.unb@gmail.com`, o Instagram `liacup.unb` e "FCTS · Campus
    UnB Ceilândia · Brasília/DF" (§6 e §7, Q3 (b));
  - no rodapé, o link do Instagram e o do e-mail são clicáveis por inteiro, com o endereço escrito.
    Ao lado do ícone do Instagram o texto é `liacup.unb`, sem o @; em frase corrida, sem ícone, o @
    continua (§7, 21/11). O Instagram abre em nova aba, o e-mail abre o aplicativo de e-mail, e o
    nome acessível de cada um diz o destino em frase corrida e contém o texto escrito
    (`REFERENCIA-VISUAL.md` §7);
  - coluna de contato com um ícone decorativo ao lado de cada item (Instagram, envelope e marcador
    de localização), os três itens com passo uniforme de 44 px, e o endereço como texto, não link;
    a última linha do rodapé centralizada (§7, 21/11);
  - coluna do rodapé sem nenhuma página da lista não aparece (nesta change, a coluna "Conteúdo"
    some e a "Portal" tem só "Início");
  - menu lateral no celular: abre e fecha pelo botão, fecha no Esc, no toque fora e ao escolher,
    prende o foco e devolve o foco ao botão;
  - no desktop, a página atual marcada por uma barra de ponta redonda sob o rótulo, a 10 px do pé
    das letras em 1280 px, como no protótipo (Q6 (a), 21/11).
- **O ícone da aba** com a logo da liga, em toda página pública, a partir das variantes que já
  existem em `assets/` (`REFERENCIA-VISUAL.md` §7, 21/11). A página em construção não ganha
  ícone, porque a produção não muda.
- **O hero da página inicial:** sobretítulo, título, lema e apresentação, com o texto do
  `conteudo-institucional.md` §2.0 (Q1 (a)). O lema sai em `--color-accent-600` (Q7), e não no lilás da marca
  (`REFERENCIA-VISUAL.md` §7). No lugar da foto institucional, o quadro do protótipo com uma
  borboleta da liga grande, em opacidade baixa, sem texto e decorativa (Q2 (b), §7). Os botões
  "Quero participar" e "Conheça a Liga" **não aparecem nesta change**: as páginas deles (change 2 e
  change 4) não estão na lista.
- **O sobretítulo "UNIVERSIDADE DE BRASÍLIA"** entra como texto, como no protótipo, sem logo nem
  marca gráfica da UnB. A confirmação do uso do nome e da marca é pendência que não segura entrega
  (`PLANO-DE-DESENVOLVIMENTO.md` §11): a liga vê na prévia, e tirar é mudar uma linha.
- **A raiz com o site publicado mostra a página inicial.** Em produção nada muda: o interruptor
  continua desligado e a página em construção continua idêntica, sem cabeçalho e sem rodapé novos.
- **As verificações passam a ler a lista.** O e2e mede cada página da lista nas sete larguras e
  imprime quantas mediu. A conferência de "nenhum pedido a domínio externo", que hoje roda na raiz
  publicada, passa a rodar em cada página da lista **e** na raiz não publicada, para a página de
  produção não perder a cobertura que tinha. O Lighthouse mede cada página da lista com o site
  publicado **e continua** medindo a raiz não publicada, que é o que a produção mostra. Isto **amplia** duas verificações do
  CI, sem afrouxar nenhuma; aprovar esta proposta é a decisão escrita que a mudança exige.

**Critérios de aceite:**

- Lado a lado do `guardiao-visual` em 390 e 1280 px contra o gabarito, só das partes desta change.
  Cada diferença listada: adaptação aprovada (`REFERENCIA-VISUAL.md` §3), melhoria proposta ou
  defeito.
- Menu lateral: abre e fecha pelo botão, fecha no Esc, no toque fora e ao escolher, prende e
  devolve o foco, verificado por teclado no e2e.
- e2e verde nas 7 larguras, nos dois modos do interruptor; axe 0; nenhuma rolagem horizontal;
  alvos de 44 px com o número de elementos medidos; a saída imprime `páginas verificadas: 1`.
- Lighthouse com desempenho ≥ 90 e acessibilidade ≥ 95 na raiz publicada e na raiz não publicada,
  com a saída dizendo quantas páginas mediu em cada modo.
- A página em construção de produção continua idêntica: print antes e depois em 390 e 1280 px, e
  os arquivos dela sem diferença, sem ícone da aba indicado.
- Toda verificação nova é vista falhando e voltando ao verde (RP-12).

## Fora de escopo

- Números, eventos, notícias, conteúdo educativo, faixa do processo seletivo e bloco de contato da
  inicial: são da `inicio-completo` (R1, change 8), da R2 e da R5.
- Qualquer outra página, inclusive Processo seletivo e Sobre. A página 404 própria, os metadados,
  `sitemap.xml` e `robots.txt` são da `lancamento-r1`. **Exceção:** o ícone da aba entrou nesta
  change por decisão do Gabriel em 21/11 (`REFERENCIA-VISUAL.md` §7), nos tamanhos 32, 48 e 96 px
  para a aba e 180 px para a tela de início do celular. O resto dos metadados continua fora.
- O link para o painel (R3).
- A foto institucional, que a liga manda na homologação da R1. No lugar dela não vai texto de
  marcação nem imagem que não seja da liga.
- Mudar a página em construção, o interruptor ou a spec `publicacao-do-site` (ver D2 do design).
- Mudar `.github/`, o limiar do Lighthouse ou qualquer verificação existente para menos.
- Ligar o interruptor em produção (`lancamento-r1`).

## Decisões do Portão 1 (20/11/2026)

Aceite do Gabriel, literal: "Portão 1 aprovado. Decisões do Gabriel: Q1 (a), Q2 (b), Q3 (b)."
As opções e os custos ficam no `design.md`, seção "Open Questions".

- **Q1 (a):** título, lema e apresentação do hero vêm do `conteudo-institucional.md` §2.0, que o
  gestor já emendou.
- **Q2 (b):** o quadro do protótipo, com uma borboleta da liga grande, em opacidade baixa, sem
  texto, escondida do leitor de tela. Os esboços estão em
  `openspec/changes/layout-e-hero/prints/qn-foto-<a|b|c>-<390|1280>.png`.
- **Q3 (b):** "FCTS · Campus UnB Ceilândia · Brasília/DF".
- **Regras novas da `REFERENCIA-VISUAL.md` §7**, que valem nesta change: os links do Instagram e
  do e-mail do rodapé são clicáveis por inteiro, e o lema sai em `--color-accent-600` (trocado do `--color-accent-700` pela Q7, 21/11).

## Decisões depois do Portão 1 (21/11/2026)

Os aceites literais estão no `relatorio.md`, seção "Decisões do Gabriel depois do Portão 1".

- **Q4 (c):** o `AparenciaDeBotao` fica nesta change, com o comentário corrigido, e se unifica ao
  `Botao` na `pagina-processo-seletivo`.
- **Q5 (a):** os 15 PNG da change são versionados, com a origem na `SEGURANCA.md` §7.
- **Q6 (a):** a barra da página atual nos destinos em linha fica a 10 px do pé das letras em
  1280 px, com a ponta redonda.
- **Q7:** o lema em `--color-accent-600`.
- **Ajustes de tela da `REFERENCIA-VISUAL.md` §7:** o ícone da aba; o ícone ao lado de cada item
  da coluna de contato, com passo uniforme de 44 px; `liacup.unb` sem o @ ao lado do ícone do
  Instagram; a última linha do rodapé centralizada.

## Capabilities

### New Capabilities

- `navegacao-publica`: a lista única de páginas públicas, o cabeçalho, o ícone da aba, o menu
  lateral, o rodapé e a medição de toda página da lista.
- `pagina-inicial`: o que a página inicial mostra. Nesta change, só o hero; a `inicio-completo`
  acrescenta o resto.

### Modified Capabilities

- `fundacao-e-ci`: o requisito "Página provisória no ar" sai (REMOVED) e volta com nome novo,
  "Página provisória enquanto o site não está publicado" (ADDED), com o mesmo conteúdo para a
  produção e a raiz publicada mostrando a inicial. Sai e volta porque o OpenSpec não deixa um bloco
  modificado largar o cenário que ficou falso. **Desvio do briefing:** ele aponta o cenário em
  `publicacao-do-site`, mas o cenário "A raiz com o site publicado, antes da página inicial" mora
  em `fundacao-e-ci`. A `publicacao-do-site` não muda (D2).

## Requisitos permanentes

| RP | Aplica? | Em uma linha |
| --- | --- | --- |
| RP-01 | Sim | Nenhuma dependência nova: 22 diretas antes e depois (D8) |
| RP-02 | Sim | Nenhum valor visual escrito à mão: `verificar:tokens` com código 0 |
| RP-03 | Sim | Token novo só acrescentado, com origem nomeada; nenhum existente alterado |
| RP-04 | Sim | Alvos de 44 px no cabeçalho, no menu e no rodapé, medidos com contador nas 7 larguras |
| RP-05 | Sim | Zero rolagem horizontal em toda página da lista, nas 7 larguras |
| RP-06 | Sim | Lighthouse na raiz publicada e na não publicada |
| RP-07 | Sim | axe 0 em toda página da lista e na raiz não publicada |
| RP-08 | Sim | Cada diferença do lado a lado com veredito e motivo |
| RP-09 | Sim | Todo par de cor novo nomeia as duas cores e a superfície (o lema em `--color-accent-600`, o rodapé roxo) |
| RP-10 | Sim | Nenhum segredo e nenhuma variável nova |
| RP-11 | Não | Nenhum banco nem tabela |
| RP-12 | Sim | Cinco demonstrações de falha, com contador em toda verificação nova (D7) |
| RP-13 | Sim | Nenhum artefato gerado entra: `verificar:artefatos` com código 0 |
| RP-14 | Sim | Fidelidade humana: lado a lado do guardião e aprovação nominal do Gabriel no Portão 2 |

Campo de formulário com fonte de 16 px: não se aplica, porque não há campo nesta change.

## Impact

| O que | Efeito | Quem escreve |
| --- | --- | --- |
| `src/` (lista nominal no `design.md`, D9) | Lista única, cabeçalho, menu, rodapé, hero, layout das páginas públicas, raiz | `dev-frontend` |
| `public/` | 4 ícones novos, cópias das variantes da logo em `assets/` | `dev-frontend` |
| `scripts/`, script de desempenho no `package.json`, `README.md` | Lighthouse lendo a lista nos dois modos, com o `lighthouserc.json` intocado; como acrescentar uma página | `dev-frontend` |
| `tests/e2e/` | Medição das páginas da lista, teclado do menu, spec da raiz publicada reescrito | `qa-acessibilidade` |
| Página em construção, interruptor, `Rodape`, `LinksDeContato` | Nenhuma diferença | — |
| `.github/`, `src/estilos/tokens.css` (linhas existentes), dependências | Nada muda | — |
| Produção | Nada muda | — |
| Prévias | A raiz mostra cabeçalho, hero e rodapé | — |
