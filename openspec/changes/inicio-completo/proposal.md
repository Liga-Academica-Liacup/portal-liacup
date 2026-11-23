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
   conhecimentos", "Ver o edital"). A cor do cartão é a **Q7** (`design.md`, D4).
4. **Bloco de contato**, com os quadros do Instagram e do e-mail da `pagina-contato`, sem copiar
   código. O título e a frase são a **Q4**, e o botão "Mandar uma mensagem" é a **Q5**. A moldura do
   gabarito (cartão claro e círculo de 104 px, contra 100 px no componente) é a **Q6**
   (`design.md`, D5).
5. **Nada da R2 nem da R5:** nada de "Próximos eventos", "O que anda acontecendo" nem "Conteúdo
   educativo". A página vai do hero aos números, depois à faixa e ao contato. O hero não muda.
6. **Os prints do `guardiao-visual` são binários novos.** Cada um ganha uma linha de origem no
   `docs/SEGURANCA.md` §7, no mesmo diff. Com isso o `docs/SEGURANCA.md` entra no diff, e ele está
   na lista do gatilho: **o guardião faz o checklist inteiro** (passo 1 da conferência
   proporcional), como nas changes de tela anteriores.

**As specs e as tarefas seguem a recomendação de cada Qn.** Se o Gabriel decidir outra opção, o
especificador ajusta specs, `design.md` e `tasks.md` antes do apply, como na Q3 (b) da
`pagina-contato`.

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

**Conta de tarefas: 13 de 15** (`tasks.md`). A change não se divide.

## Apontado pelo especificador, sem decidir

- **O plano e o briefing divergem.** O `PLANO-DE-DESENVOLVIMENTO.md` (change 9) promete "chamadas
  para as páginas que existem". O briefing não traz esse bloco, e o gabarito não tem bloco com esse
  nome. É a **Q8**.
- **O 21 pode estar velho.** O próprio §9 diz que os números "mudam com este processo seletivo:
  entram mais 4 ligantes". O plano põe "números atualizados" na `homologacao-r1`. Esta change
  publica o que está aprovado no §9 (princípio 5: conteúdo pendente não segura entrega), e a liga
  confere na homologação. Fica registrado para o Gabriel saber que a tela vai dizer 21.
- **Nota de reúso do guardião da `pagina-contato` (I1).** O guardião deixou combinado que esta nota
  chegaria ao briefing desta change, e ela não chegou. A inicial reaproveita os quadros com os
  mesmos dados fixos. O critério do I1 (destino só `https://` e `mailto:` sem `?`) não é acionado
  aqui e continua para a primeira change que passar dado variável ao quadro (`design.md`, D5).

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

**Q2. O título da faixa.**

- (a) "Processo seletivo", o título que a página já usa, lido do mesmo arquivo de dados, sem
  semestre. Custo: repete o rótulo do botão do cabeçalho.
- (b) O Gabriel escreve outro, registrado na §7. Custo: um rótulo novo.
- Recomendo (a), porque já está aprovado e não traz semestre nem data.

**Q3. O rótulo do botão da faixa** ("Ver o edital" não vai: não há edital aberto).

- (a) "Quero participar", o rótulo do hero, com o mesmo destino. Custo: dois links iguais na página,
  com o mesmo destino (o que está certo para acessibilidade); com as inscrições fechadas, o rótulo
  leva a uma página que diz que estão fechadas.
- (b) "Processo seletivo". Custo: fica logo abaixo de um título com o mesmo texto.
- (c) O Gabriel escreve outro, registrado na §7. Custo: um rótulo novo.
- Recomendo (a), porque é rótulo aprovado e o hero já faz o mesmo.

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

**Q5. O botão "Mandar uma mensagem".** O formulário é da R4.

- (a) Sai. Custo: diferença contra o gabarito, a classificar; volta na R4.
- (b) Fica e leva a `/contato`. Custo: promete um envio de mensagem que `/contato` não tem.
- (c) Leva a `/contato` com o rótulo "Fale com a Liga". Custo: mais um rótulo na §7, num link para
  uma página que mostra os mesmos dois canais mais a sede.
- Recomendo (a), porque os dois canais estão no próprio bloco.

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

**Q7. A cor do cartão da faixa.** No protótipo, o cartão é lilás da marca (`#9B6AAF`), com texto
creme. O par mede 3,48:1 e reprova para o texto de 16 px (ADR-0003: o lilás não carrega texto
pequeno). A constitution (nível 1) vence o protótipo.

- (a) O cartão em `--color-accent-600` `#82558f`, o mesmo fundo do botão primário (4,84:1 com o
  creme), com o círculo decorativo do protótipo por cima. Custo: tom um pouco mais escuro que o
  gabarito, registrado na §7 como adaptação de acessibilidade.
- (b) O cartão no roxo `--color-accent-800`, como a faixa do topo de `/processo-seletivo`. Custo:
  fica mais longe do gabarito.
- Recomendo (a), porque é o lilás mais próximo que já tem par aprovado.

**Q8. As "chamadas para as páginas que existem" do plano.**

- (a) Nenhum bloco a mais, como o briefing. As chamadas são os botões do hero e o da faixa. Custo: o
  plano fica dizendo uma coisa que a change não entrega; o gestor corrige o plano numa change
  própria (o plano está na lista do gatilho).
- (b) Um bloco de chamadas para Sobre, Projetos e Equipe. Custo: estrutura que o gabarito não tem,
  com texto a inventar.
- Recomendo (a), porque a estrutura da página não muda.

## Fora de escopo

- Agenda e notícias (R2), conteúdo educativo (R5) e o formulário (R4).
- A foto do hero (vem na homologação) e qualquer mudança no hero.
- Qualquer outra página. `/contato` e `/processo-seletivo` não mudam na tela.
- O estado "inscrições abertas" da faixa, com edital e datas.
- Mudar a lista única de páginas (`/` fica como está), o rodapé, o cabeçalho ou a página em
  construção.
- Mudar `docs/PLANO-DE-DESENVOLVIMENTO.md`, `docs/PADROES-DE-CODIGO.md`, qualquer spec do gatilho,
  `.github/`, `scripts/`, `package*.json`, `src/proxy.ts`, `playwright.config.ts` ou
  `lighthouserc.json`. O `docs/SEGURANCA.md` muda só na §7 (linhas de origem, total e versão).

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `pagina-inicial`: os números, a faixa do processo seletivo, o bloco de contato, a ausência dos
  blocos da R2 e da R5, a ordem e os títulos, o texto conferido contra o documento e o interruptor.
  O requisito do hero não muda. Tudo entra por ADDED.

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
| RP-09 | Sim | Texto da faixa sobre o cartão e sobre o círculo, quadros sobre o cartão, números sobre o fundo: pares medidos e nomeados |
| RP-10 | Sim | O segredo de bypass do P23 nunca é versionado nem impresso |
| RP-11 | Não | Nenhuma tabela de banco: os dados são arquivos estáticos |
| RP-12 | Sim | Toda verificação nova vista falhando (`design.md`, D7) |
| RP-13 | Sim | `verificar:artefatos` com código 0; os prints entram com origem na §7 |
| RP-14 | Sim | Lado a lado do guardião e aprovação nominal do Gabriel no Portão 2 |

## Impact

| O que | Efeito | Quem escreve |
| --- | --- | --- |
| `src/` (lista nominal no `design.md`, D8) | Os três blocos, a composição da raiz e os tokens novos | `dev-frontend` |
| `tests/e2e/` | Os blocos novos no spec da inicial; contadores das listas | `qa-acessibilidade` |
| `docs/REFERENCIA-VISUAL.md` §7 | A frase de 20/11 sai (tarefa 1.1); as linhas novas da inicial com as decisões Q1 a Q7 (tarefa 1.2) | líder técnico, depois do Portão 1 |
| `docs/conteudo-institucional.md` | Só se a Q1 (c) ou a Q4 (b) forem escolhidas | líder técnico, com autorização escrita do Gabriel |
| `docs/SEGURANCA.md` §7 | Origem dos prints, total e versão | líder técnico, antes do guardião |
| Guardião | **Passo 1, checklist inteiro**: o `docs/SEGURANCA.md` está na lista do gatilho | `guardiao-appsec` |
| Produção | Nada muda: o interruptor serve a página em construção na raiz | — |
| Prévias | A inicial completa | — |
