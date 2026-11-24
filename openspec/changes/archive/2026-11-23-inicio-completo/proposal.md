# Proposta — página inicial completa da R1

## Why

Hoje a inicial publicada só tem o hero (`layout-e-hero`). O gabarito
(`prototipo/prints/inicio-{390,1280}.png`) traz mais seis blocos. A R1 tem conteúdo para três deles:
os números da liga (`conteudo-institucional.md` §9), a faixa do processo seletivo (§5.1) e o
contato (§1). Os outros três (agenda, notícias e conteúdo educativo) são da R2 e da R5 e não entram,
nem vazios. Junto entra uma limpeza de texto do Gabriel na `REFERENCIA-VISUAL.md` §7.

## What Changes

1. **A linha da §7 sobre os links do Instagram e do e-mail fica só com a frase de 23/11** (tarefa
   1.1, pelo líder técnico, depois do Portão 1). Sai a frase de 20/11, que contradiz a de 23/11.
   Nada mais muda na linha. O resto é, letra por letra, o texto literal da Q9 (b) da `pagina-contato`
   (aceite literal em `openspec/changes/archive/2026-11-23-pagina-contato/relatorio.md`, linhas 717
   a 719). Nenhuma spec de `openspec/specs/` repete a frase de 20/11 (busca feita pelo
   especificador; só aparece em artefatos arquivados, que são histórico e não mudam).

   Antes (linha 113 de hoje):

   ```
   | Inicial, Contato e rodapé, links do Instagram e do e-mail | O quadro inteiro é clicável. **Instagram:** abre `https://www.instagram.com/liacup.unb/` em outra aba; no celular com o app instalado, o próprio sistema abre o app. **E-mail:** abre um e-mail novo no aplicativo de e-mail da pessoa, com `liacup.unb@gmail.com` no "Para" (`mailto:`). O endereço e o @ continuam escritos no quadro, para quem não tem aplicativo de e-mail configurado poder copiar (Gabriel, 20/11). O endereço e o @ continuam escritos no quadro, para leitura. Para copiar, usa-se o menu do próprio link: no e-mail, "Copiar endereço de e-mail" pelo botão direito no computador, ou tocar e segurar no celular; no Instagram, o menu copia o endereço do perfil (https://www.instagram.com/liacup.unb/). O endereço da sede, que não é link, se seleciona normalmente (Gabriel, 23/11/2026, decidido na Q8 (b) da pagina-contato). | R1 |
   ```

   Depois:

   ```
   | Inicial, Contato e rodapé, links do Instagram e do e-mail | O quadro inteiro é clicável. **Instagram:** abre `https://www.instagram.com/liacup.unb/` em outra aba; no celular com o app instalado, o próprio sistema abre o app. **E-mail:** abre um e-mail novo no aplicativo de e-mail da pessoa, com `liacup.unb@gmail.com` no "Para" (`mailto:`). O endereço e o @ continuam escritos no quadro, para leitura. Para copiar, usa-se o menu do próprio link: no e-mail, "Copiar endereço de e-mail" pelo botão direito no computador, ou tocar e segurar no celular; no Instagram, o menu copia o endereço do perfil (https://www.instagram.com/liacup.unb/). O endereço da sede, que não é link, se seleciona normalmente (Gabriel, 23/11/2026, decidido na Q8 (b) da pagina-contato). | R1 |
   ```

2. **Números**, logo abaixo do hero e no fundo dele, como no gabarito: 21, 7, 4 e 2026 (§9), em
   quatro cartões, com os rótulos da **Q1**. Ficam num arquivo de dados tipado, separado da
   composição, porque o painel vai editá-los na R3 (`design.md`, D3).
3. **Faixa do processo seletivo**, lendo o mesmo arquivo de dados da página `/processo-seletivo`,
   para as duas nunca se contradizerem. No estado fechado, o único que existe hoje: o selo
   "Inscrições fechadas", o título da **Q2**, o aviso do §5.1 (com o link do Instagram) e um botão
   para `/processo-seletivo`, com o rótulo da **Q3**. O texto do protótipo era exemplo e não vai
   ("Processo seletivo 2026.2", "Inscrições abertas", "Inscrições até 28 de agosto", "prova de
   conhecimentos", "Ver o edital"). O cartão fica em `--color-accent-600` (**Q7 (a)**), e por isso
   o botão **não é o primário de hoje**, que tem o mesmo fundo: o botão, o selo e o link do aviso
   entram com os pares medidos contra o cartão (`design.md`, D4). As cores do botão moram numa
   variante nova do contrato do botão (**Q9 (a)**), e tudo o que recebe foco dentro da faixa mostra
   o anel creme `--color-bg`, trocado no estilo da faixa e não na variante (acréscimo da Q9).
4. **Bloco de contato**, com os quadros do Instagram e do e-mail da `pagina-contato`, sem copiar
   código. O título e a frase são a **Q4 (a)**, e o botão "Mandar uma mensagem" sai (**Q5 (a)**). A
   moldura do gabarito (cartão claro e círculo de 104 px, contra 100 px no componente) é a variante
   "cartão" do quadro (**Q6 (a)**), com a condição do Gabriel: `/contato` não muda, provado pixel a
   pixel contra os prints arquivados da `pagina-contato` e pelos testes dela sem asserção alterada
   (`design.md`, D5).
5. **Nada da R2 nem da R5:** nada de "Próximos eventos", "O que anda acontecendo" nem "Conteúdo
   educativo". A página vai do hero aos números, depois à faixa e ao contato. O hero não muda.
6. **Os prints do `guardiao-visual` são binários novos.** Cada um ganha uma linha de origem no
   `docs/SEGURANCA.md` §7, no mesmo diff. Com isso o `docs/SEGURANCA.md` entra no diff, e ele está
   na lista do gatilho: **o guardião faz o checklist inteiro** (passo 1 da conferência
   proporcional), como nas changes de tela anteriores.
7. **A linha 9 da tabela da R1 do `docs/PLANO-DE-DESENVOLVIMENTO.md`** passa a dizer o que a change
   entrega (**Q8 (a)**, tarefa 1.3, pelo líder técnico). Nada mais muda no plano. Ele também está na
   lista do gatilho; a classificação do guardião continua o passo 1.

   Antes: "Números, chamadas para as páginas que existem, bloco de contato e faixa do processo
   seletivo". Depois: "Números, faixa do processo seletivo e bloco de contato; as chamadas para as
   outras páginas são os botões do hero e da faixa (Gabriel, 23/11/2026, Q8 (a) da
   inicio-completo)".

As specs e as tarefas seguem as decisões do Gabriel no Portão 1, 23/11/2026: Q1 a Q8, todas (a),
literais no `relatorio.md`; a Q6, a Q7 e a Q8 com condição, já posta nas specs, no `design.md` e nas
tarefas. A **Q9**, nascida do cuidado da Q7 (a), foi decidida em 23/11/2026: (a), com o acréscimo do
anel de foco (literal no `relatorio.md`). A **Q10**, nascida da Q9 (a), foi decidida no mesmo dia:
(a), literal no `relatorio.md`. Ficam quatro arquivos de `src/componentes/ui/` no diff.

**Critérios de aceite** (os do briefing):

- Lado a lado do `guardiao-visual` da página inteira em 390 e 1280 px, com cada diferença
  classificada. Os blocos da R2 e da R5 que faltam entram como "fora da R1".
- Texto idêntico ao documento, palavra por palavra, por teste. Números e faixa lidos dos arquivos
  de dados, também por teste.
- e2e verde nas 7 larguras, nos dois modos do interruptor; axe 0; nenhuma rolagem horizontal;
  Lighthouse ≥ 90, acessibilidade ≥ 95 e SEO ≥ 95 na raiz publicada.
- Com o site não publicado, a raiz continua a página em construção, idêntica ao print arquivado
  (`openspec/changes/archive/2026-11-23-pagina-contato/prints/raiz-nao-publicada-{390,1280}.png`).
- P23 com 200 e sem `Location` em `/`, na prévia da branch `feat/inicio-completo`, com o host e o
  commit confirmados pelo Gabriel, registrado e commitado antes do merge.
- Da condição da Q6 (a): `/contato` em 390 e 1280 px idêntica, pixel a pixel, ao recorte do site
  em `openspec/changes/archive/2026-11-23-pagina-contato/prints/lado-a-lado-contato-{390,1280}.png`,
  e os testes da `pagina-contato` verdes sem asserção alterada.
- Do cuidado da Q7 (a): o botão, o selo e o link do aviso com os pares medidos contra o cartão
  (texto ≥ 4,5:1, borda do botão e anel de foco ≥ 3:1), nomeados na §7 e no relatório.
- Da Q9 (a): a variante nova com os quatro estados, cada um com o par medido contra `#82558f`; o
  teste do contrato (botão e link da mesma variante com as mesmas classes) cobrindo a variante nova;
  e um e2e que foca pelo teclado o botão e o link do aviso e confere o anel `--color-bg`, 4,84:1
  contra o cartão, medido no pixel e nomeado na §7 e no relatório.

**Conta de tarefas: 14 de 15** (`tasks.md`). A change não se divide.

## Apontado pelo especificador

- **O plano e o briefing divergiam.** O `PLANO-DE-DESENVOLVIMENTO.md` (change 9) prometia
  "chamadas para as páginas que existem". **Decidido** na Q8 (a): nenhum bloco a mais, e a linha do
  plano muda nesta change (tarefa 1.3).
- **O 21.** O próprio §9 diz que os números "mudam com este processo seletivo: entram mais 4
  ligantes". **Decidido pelo Gabriel, 23/11/2026:** o "21" vai como está no §9, e a liga confere os
  números na homologação.
- **Nota de reúso do guardião da `pagina-contato` (I1).** O guardião deixou combinado que esta nota
  chegaria ao briefing desta change, e ela não chegou. A inicial reaproveita os quadros com os
  mesmos dados fixos. O critério do I1 (destino só `https://` e `mailto:` sem `?`) não é acionado
  aqui e continua para a primeira change que passar dado variável ao quadro (`design.md`, D5).
  Apontado, sem decisão a pedir.

## Questões para o Portão 1

Toda palavra fora do `conteudo-institucional.md` e da `REFERENCIA-VISUAL.md` §7 é uma questão. O
rótulo escolhido vai para uma linha nova da §7 (tarefa 1.2), como os da `pagina-contato`.

**Q1. Os rótulos dos números.** O §9 só diz "21 membros, 7 cursos, 4 ações, fundação em 2026".

- (a) Os rótulos do protótipo, como rótulos de interface na §7: "membros ativos", "cursos
  representados", "ações realizadas", "ano de fundação". Custo: "ativos" e "realizadas" acrescentam
  sentido ao §9; o protótipo, com esses rótulos, foi aprovado pela liga.
- (b) Só as palavras do §9: "membros", "cursos", "ações", "fundação". Custo: diferença de texto
  contra o gabarito, a classificar, e "4 ações" fica vago.
- (c) O Gabriel escreve os rótulos no §9, com autorização escrita. Custo: uma linha nova no
  documento.
- Recomendo (a), porque são os rótulos do design que a liga aprovou e nada se inventa.
- **Decidido: (a), Gabriel, 23/11/2026.**

**Q2. O título da faixa.**

- (a) "Processo seletivo", o título que a página já usa, lido do mesmo arquivo de dados, sem
  semestre. Custo: repete o rótulo do botão do cabeçalho.
- (b) O Gabriel escreve outro, registrado na §7. Custo: um rótulo novo.
- Recomendo (a), porque já está aprovado e não traz semestre nem data.
- **Decidido: (a), Gabriel, 23/11/2026.**

**Q3. O rótulo do botão da faixa** ("Ver o edital" não vai: não há edital aberto).

- (a) "Quero participar", o rótulo do hero, com o mesmo destino. Custo: dois links iguais na página,
  com o mesmo destino (o que está certo para acessibilidade); com as inscrições fechadas, o rótulo
  leva a uma página que diz que estão fechadas.
- (b) "Processo seletivo". Custo: fica logo abaixo de um título com o mesmo texto.
- (c) O Gabriel escreve outro, registrado na §7. Custo: um rótulo novo.
- Recomendo (a), porque é rótulo aprovado e o hero já faz o mesmo.
- **Decidido: (a), Gabriel, 23/11/2026.**

**Q4. O topo do bloco de contato.** O gabarito tem o sobretítulo "Contato", o título "Onde a Liga
responde" e a frase "O Instagram é o canal mais rápido. Para assuntos formais, escreva para o e-mail
da Liga." (lida no `prototipo/Portal-LIACUP.html`). Só "Contato" já está registrado na §7.

- (a) O sobretítulo "Contato" e o título "Onde a Liga responde" como rótulos de interface, sem a
  frase. Custo: uma linha a menos que o gabarito, diferença a classificar.
- (b) Os dois e a frase, com a frase registrada no §1 com autorização escrita do Gabriel. Custo: o
  site passa a prometer que o Instagram é "o canal mais rápido", um compromisso de resposta que a
  liga não escreveu.
- (c) O título "Fale com a Liga", já registrado, sem frase. Custo: o mesmo título principal da
  página Contato, como título de seção.
- Recomendo (a), pelos precedentes de Contato e Projetos (frase fora do documento não vai).
- **Decidido: (a), Gabriel, 23/11/2026.** O `conteudo-institucional.md` não muda (nem pela Q1).

**Q5. O botão "Mandar uma mensagem".** O formulário é da R4.

- (a) Sai. Custo: diferença contra o gabarito, a classificar; volta na R4.
- (b) Fica e leva a `/contato`. Custo: promete um envio de mensagem que `/contato` não tem.
- (c) Leva a `/contato` com o rótulo "Fale com a Liga". Custo: mais um rótulo na §7, num link para
  uma página que mostra os mesmos dois canais mais a sede.
- Recomendo (a), porque os dois canais estão no próprio bloco.
- **Decidido: (a), Gabriel, 23/11/2026.**

**Q6. A moldura dos quadros na inicial.** No gabarito, cada quadro é um cartão de fundo claro, com
raio, preenchimento, círculo de **104 px** e vão de 20 px. Na página Contato, o quadro não tem cartão
e o círculo tem 100 px. A §7 manda "o quadro inteiro é clicável".

- (a) O quadro compartilhado ganha uma variante de apresentação "cartão", com as medidas do
  gabarito da inicial em tokens novos. O link cobre o cartão inteiro, e `/contato` não muda,
  conferido pixel a pixel. Custo: mexe em arquivos que já existem no bloco de contato, e `/contato`
  entra na conferência visual.
- (b) A inicial põe uma moldura em volta do quadro de hoje. Custo: o link cobre só o miolo, e a
  borda do cartão não abre nada, contra a §7.
- (c) Quadros sem cartão, como em `/contato`, com 100 px. Custo: diferença visível contra o
  gabarito (sem cartão, círculo menor), a classificar como melhoria a aprovar.
- Recomendo (a), porque cumpre o gabarito e a §7 ao mesmo tempo.
- **Decidido: (a), Gabriel, 23/11/2026, com condição:** a variante "cartão" não muda nada em
  `/contato`. Prova: `/contato` em 390 e 1280 px idêntica, pixel a pixel, aos prints arquivados da
  `pagina-contato` (o recorte do site nos `lado-a-lado-contato-{390,1280}.png`; método no
  `design.md`, D5), e os testes da `pagina-contato`, e2e e unidade, verdes sem nenhuma asserção
  alterada, só acréscimo. Cenários na spec; verificação nas tarefas 2.3 e 4.1.

**Q7. A cor do cartão da faixa.** No protótipo, o cartão é lilás da marca (`#9B6AAF`), com texto
creme. O par mede 3,48:1 e reprova para o texto de 16 px (ADR-0003: o lilás não carrega texto
pequeno). A constitution (nível 1) vence o protótipo.

- (a) O cartão em `--color-accent-600` `#82558f`, o mesmo fundo do botão primário (4,84:1 com o
  creme), com o círculo decorativo do protótipo por cima. Custo: tom um pouco mais escuro que o
  gabarito, registrado na §7 como adaptação de acessibilidade.
- (b) O cartão no roxo `--color-accent-800`, como a faixa do topo de `/processo-seletivo`. Custo:
  fica mais longe do gabarito.
- Recomendo (a), porque é o lilás mais próximo que já tem par aprovado.
- **Decidido: (a), Gabriel, 23/11/2026, com um cuidado:** o botão da faixa não pode ser o primário
  de hoje, que tem o mesmo fundo `#82558f` do cartão. O botão, o selo "Inscrições fechadas" e o link
  do Instagram dentro do aviso entram cada um com o par medido contra o cartão (texto ≥ 4,5:1, borda
  ou contorno do botão ≥ 3:1), também no pior ponto sobre o círculo, nomeados na §7 e no relatório.
  Pares calculados no `design.md`, D4; requisito novo na spec; onde moram as cores do botão é a Q9.

**Q8. As "chamadas para as páginas que existem" do plano.**

- (a) Nenhum bloco a mais, como o briefing. As chamadas são os botões do hero e o da faixa. Custo: o
  plano fica dizendo uma coisa que a change não entrega; o gestor corrige o plano numa change
  própria (o plano está na lista do gatilho).
- (b) Um bloco de chamadas para Sobre, Projetos e Equipe. Custo: estrutura que o gabarito não tem,
  com texto a inventar.
- Recomendo (a), porque a estrutura da página não muda.
- **Decidido: (a), Gabriel, 23/11/2026, mais a linha do plano nesta change**, e não numa change
  própria: o guardião já vai pelo checklist inteiro por causa do `docs/SEGURANCA.md`. Tarefa 1.3;
  texto antes e depois em What Changes, item 7.

## Questões depois do Portão 1

**Q9. Onde moram as cores do botão da faixa.** Nasce do cuidado da Q7 (a). O botão da faixa tem
cores próprias (repouso creme, hover `--color-accent-200`, pressionado `--color-accent-300`, anel
`--color-bg`; `design.md`, D4). Hoje todo link com aparência de botão usa as variantes de um só
contrato visual da camada `ui` (ADR-0006; Q4 (c) da `layout-e-hero`), e o `design.md` aprovado (D8)
põe `src/componentes/ui/` entre o que não muda. Pesa só a partir da tarefa 2.2.

- (a) Uma variante nova no contrato do botão (o dev escolhe o nome, por exemplo `claro`, "sobre
  fundo escuro"), com os quatro estados. Custo: `src/componentes/ui/` entra no diff, com só linhas
  acrescentadas em `Botao.module.css` e `Botao.test.tsx` e a linha da união de variantes trocada em
  `aparencia-de-botao.ts`; o botão ganha uma quinta variante, que outras telas podem usar.
- (b) A faixa usa a aparência de botão de hoje e sobrescreve as cores no próprio estilo dela.
  Custo: os estados do botão passam a ser definidos em dois lugares, contra o contrato único do
  ADR-0006; `ui/` não muda.
- (c) Um link estilizado inteiro na faixa, sem a aparência de botão. Custo: o mesmo da (b), mais
  tamanho, alvo e preenchimento copiados.
- Recomendo (a), porque mantém um contrato só para os estados e é o mesmo caminho das variantes que
  já existem; specs e tarefas seguem a (a).
- **Decidido: (a), Gabriel, 23/11/2026, com um acréscimo.** Fica aprovada a exceção ao
  "`src/componentes/ui/` não muda", só para a variante: linhas acrescentadas e a linha da lista de
  variantes trocada. O teste do contrato (botão e link da mesma variante com as mesmas classes)
  passa a cobrir a variante nova, que tem os quatro estados do ADR-0006, cada um com o par medido
  contra `#82558f`. **Acréscimo, o anel de foco:** o anel do site, `--color-accent-700` `#683f74`,
  mede 1,43:1 sobre o cartão. Seguindo o precedente da `FaixaDoTopo` de `/processo-seletivo`, a
  faixa da inicial troca a cor do anel para `--color-bg` (4,84:1 sobre o cartão) em tudo o que
  recebe foco dentro dela, o botão e o link do Instagram no aviso. A troca fica no estilo da faixa,
  e não na variante. Medido no pixel e nomeado na §7 e no relatório (RP-09); um e2e foca o botão e
  o link pelo teclado e confere o anel. No mesmo texto, o Gabriel aprovou o corte dos prints de
  `/contato` pela moldura do lado a lado (`design.md`, D5). Aceite literal no `relatorio.md`.

**Q10. A segunda lista de variantes, no próprio botão.** Nasce da Q9 (a). Além da união
`VarianteDoBotao` (`aparencia-de-botao.ts`), o componente `Botao.tsx` tem a sua lista de variantes
aceitas na prop (linha 38: `'primario' | 'secundario' | 'fantasma'`). O teste do contrato desenha o
`Botao` e o link na mesma variante; sem essa linha trocada, o `Botao` da variante nova não compila.
A decisão da Q9 fala em "a linha da lista de variantes", no singular. Pesa já na tarefa 2.2.

- (a) Trocar também essa linha do `Botao.tsx`, só acrescentando a variante nova à lista. Custo: um
  quarto arquivo de `src/componentes/ui/` no diff, com uma linha trocada (`1 1`).
- (b) Não tocar o `Botao.tsx`: a variante nova vale só para link, e o teste dela confere a classe do
  link sem desenhar o `Botao`. Custo: o teste deixa de ser "botão e link da mesma variante com as
  mesmas classes", como a Q9 manda, e o contrato fica assimétrico.
- (c) Trocar a linha por uma derivada da união (todas menos `icone`), para a próxima variante não
  precisar dele. Custo: o mesmo da (a), e uma mudança de forma que ninguém pediu.
- Recomendo (a), porque é o único jeito de cumprir o teste do contrato como a Q9 escreveu, com a
  menor mudança; o `design.md` (D4, D8) e o texto proposto para as tarefas seguem a (a).
- **Decidido: (a), Gabriel, 23/11/2026.** Uma linha trocada e nada mais; o teste do contrato compara
  `<Botao>` e link na variante nova; ficam quatro arquivos de `ui/` no diff. Aceite literal no
  `relatorio.md`.

## Fora de escopo

- Agenda e notícias (R2), conteúdo educativo (R5) e o formulário (R4).
- A foto do hero (vem na homologação) e qualquer mudança no hero.
- Qualquer outra página. `/contato` e `/processo-seletivo` não mudam na tela.
- O estado "inscrições abertas" da faixa, com edital e datas.
- Mudar a lista única de páginas (`/` fica como está), o rodapé, o cabeçalho ou a página em
  construção.
- Mudar `docs/PADROES-DE-CODIGO.md`, `docs/conteudo-institucional.md`, qualquer spec do gatilho,
  `.github/`, `scripts/`, `package*.json`, `src/proxy.ts`, `playwright.config.ts` ou
  `lighthouserc.json`. O `docs/SEGURANCA.md` muda só na §7 (linhas de origem, total e versão). O
  `docs/PLANO-DE-DESENVOLVIMENTO.md` muda só na linha 9 da tabela da R1 (Q8 (a), tarefa 1.3);
  nenhuma outra linha dele.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `pagina-inicial`: os números, a faixa do processo seletivo, o bloco de contato, a ausência dos
  blocos da R2 e da R5, a ordem e os títulos, o texto conferido contra o documento, o interruptor e,
  pela Q9 (a), o botão da faixa no contrato único do botão e o anel de foco creme dentro dela. O
  requisito do hero não muda. Tudo entra por ADDED: **10 requisitos, 29 cenários**.

**Não mudam:** `navegacao-publica` (a lista não muda; a regra de que botão só leva a página da lista
já cobre o botão da faixa), `seo` (título e descrição da raiz iguais), `pagina-contato` (a tela não
muda; a garantia de que não muda está na spec da inicial), `pagina-processo-seletivo`,
`referencia-visual` (não repete a frase de 20/11), `publicacao-do-site` e `fundacao-e-ci`.

## Requisitos permanentes

| RP | Aplica? | Em uma linha |
| --- | --- | --- |
| RP-01 | Sim | Nenhuma dependência nova: 23 diretas antes e depois |
| RP-02 | Sim | `verificar:tokens` com código 0 |
| RP-03 | Sim | Tokens novos só acrescentados (cartões, círculo de 104 px, faixa), com origem medida no protótipo |
| RP-04 | Sim | Botão e link da faixa e os dois quadros, com os estados do ADR-0006 e alvo ≥ 44 px, medidos |
| RP-05 | Sim | Zero rolagem horizontal nas 6 páginas da lista, nas 7 larguras |
| RP-06 | Sim | Lighthouse nas 6 páginas publicadas e na raiz não publicada |
| RP-07 | Sim | axe 0 na raiz publicada e na não publicada |
| RP-08 | Sim | Cada diferença do lado a lado com veredito e motivo, os blocos da R2 e da R5 como "fora da R1" |
| RP-09 | Sim | Texto da faixa sobre o cartão e sobre o círculo; botão (texto e borda, nos quatro estados), selo, link do aviso e anel de foco contra o cartão (`design.md`, D4); quadros sobre o cartão; números sobre o fundo: pares medidos e nomeados |
| RP-10 | Sim | O segredo de bypass do P23 nunca é versionado nem impresso |
| RP-11 | Não | Nenhuma tabela de banco: os dados são arquivos estáticos |
| RP-12 | Sim | Toda verificação nova vista falhando, inclusive o anel da faixa e a variante nova no teste do contrato (`design.md`, D7) |
| RP-13 | Sim | `verificar:artefatos` com código 0; os prints entram com origem na §7 |
| RP-14 | Sim | Lado a lado do guardião e aprovação nominal do Gabriel no Portão 2 |

## Impact

| O que | Efeito | Quem escreve |
| --- | --- | --- |
| `src/` (lista nominal no `design.md`, D8) | Os três blocos, a composição da raiz, os tokens novos e, pela Q9 (a), a variante nova do botão (e a lista do `Botao.tsx`, com a Q10 (a)) | `dev-frontend` |
| `tests/e2e/` | Os blocos novos no spec da inicial; contadores das listas | `qa-acessibilidade` |
| `docs/REFERENCIA-VISUAL.md` §7 | A frase de 20/11 sai (tarefa 1.1); as linhas novas da inicial com as decisões Q1 a Q7 e os pares da faixa (tarefa 1.2) | líder técnico, depois do Portão 1 |
| `docs/PLANO-DE-DESENVOLVIMENTO.md` | Só a linha 9 da tabela da R1 (tarefa 1.3, Q8 (a)) | líder técnico, depois do Portão 1 |
| `docs/conteudo-institucional.md` | Não muda (Q1 (a) e Q4 (a)) | — |
| `docs/SEGURANCA.md` §7 | Origem dos prints, total e versão | líder técnico, antes do guardião |
| Guardião | **Passo 1, checklist inteiro**: o `docs/SEGURANCA.md` e o `docs/PLANO-DE-DESENVOLVIMENTO.md` estão na lista do gatilho | `guardiao-appsec` |
| Produção | Nada muda: o interruptor serve a página em construção na raiz | — |
| Prévias | A inicial completa | — |
