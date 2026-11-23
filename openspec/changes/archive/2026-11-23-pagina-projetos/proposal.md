# Proposta — página Projetos

## Why

A R1 precisa mostrar o que a liga faz. O `conteudo-institucional.md` §3 já tem o texto das quatro
frentes de trabalho (Ensino, Extensão, Pesquisa e Secretaria), e o protótipo tem a composição
(`prototipo/prints/projetos-{390,1280}.png`): faixa com sobretítulo e título, e quatro cartões em
grade. É a linha 7 da R1 no plano. Junto entra o que a `completar-ci-do-novo-fluxo` deixou para a
primeira tarefa desta change (Q9 (a) e Q11 (a) de lá).

## What Changes

1. **A prova do push da `completar-ci-do-novo-fluxo`** (Q9 (a) de lá), no `relatorio.md`, pelo
   líder técnico, pela API pública e sem `gh`: a confirmação literal do Gabriel, os jobs da execução
   #44, as implantações dos dois ambientes, os anexos (I1) e o tempo do PR #24 (`design.md`, D9). Os
   segredos não se leem sem autenticação: vale a palavra do Gabriel, escrita como tal.
2. **Os cinco textos que anteciparam o passo 7 não mudam aqui (Q1).** Moram em três arquivos da
   lista do gatilho (`docs/SEGURANCA.md`, `docs/PLANO-DE-DESENVOLVIMENTO.md` e a spec
   `fundacao-e-ci`). Vão para a `lancamento-r1` com o comentário do `ci.yml`, listados na seção
   "Passagem para a `lancamento-r1`" do `relatorio.md`. **Desvio declarado:** a Q11 (a) do Gabriel
   os mandava para a 1ª tarefa desta change; o briefing manda o contrário, para ela ficar só de tela.
3. **`/projetos`**, na composição do gabarito, com o texto do §3:
   - faixa do topo: sobretítulo "Projetos" e título principal "Ensino, Extensão, Pesquisa e
     Secretaria", rótulos de interface tirados do §3, registrados na `REFERENCIA-VISUAL.md` §7; a
     frase de baixo do protótipo, que promete um painel, não vai ao ar, e o que fica no lugar dela é
     a **Q2**;
   - quatro cartões, na ordem do §3: o nome da frente como título e o parágrafo do §3 como corpo,
     sem a nota de fonte (precedente da Q4 (a) da `pagina-processo-seletivo`). Na Secretaria, só o
     parágrafo citado, sem o aviso "texto provisório", sem o parágrafo "O Estatuto não descreve…",
     sem o "Continua pendente de confirmação" e sem marca de rascunho, como o §3 decide em "Como o
     texto provisório aparece no site". O itálico do documento é a **Q5**;
   - nenhum selo "Pendente", nenhuma caixa tracejada, nenhuma frase "a ser escrita pela diretoria";
     a palavra é "frentes de trabalho", nunca "eixos".
4. **A lista única ganha Projetos**, na ordem do menu do protótipo (Início, Sobre, Projetos,
   Equipe) e, no rodapé, na coluna "Conteúdo", antes de Equipe. Título "Projetos · LIACUP";
   descrição pela **Q3**.
5. **O interruptor** leva `/projetos` à página em construção quando o site não está publicado. Onde
   isso se prova é a **Q4**.

As specs e as tarefas seguem as recomendações das Qn. Se o Gabriel decidir outra opção, o
especificador ajusta specs, `design.md` e `tasks.md` antes do apply.

**Critérios de aceite** (os do briefing):

- Lado a lado do `guardiao-visual` em 390 e 1280 px da página e do menu aberto em 390, com cada
  diferença classificada. Entram também o cabeçalho em 1280 e o rodapé, que ganham o destino novo.
- Texto idêntico ao documento, palavra por palavra, por teste que lê o documento; nenhum "Pendente"
  nem "a ser escrita" na tela.
- e2e verde nas 7 larguras, nos dois modos do interruptor; axe 0; nenhuma rolagem horizontal;
  Lighthouse ≥ 90, acessibilidade ≥ 95 e SEO ≥ 95 na página nova, publicada.
- Com o site não publicado, `/projetos` responde 307 para `/`, e a página em construção continua
  idêntica.
- P23 com 200 e sem `Location` em `/projetos`, na prévia da branch `feat/pagina-projetos`, no host
  `portal-liacup-git-feat-pagina-projetos-liacup1.vercel.app`, com o host e o commit confirmados
  pelo Gabriel no painel da Vercel.

**Conta de tarefas: 12 de 15** (`tasks.md`). A change não se divide.

## Questões para o Portão 1

As opções saem do §3, do §1 e dos precedentes. Caracteres contados à mão pelo especificador; o teste
de unidade confere.

**Q1. Para onde vão os cinco textos que anteciparam o passo 7?**

- (a) Para a `lancamento-r1`, com o comentário do `ci.yml`, listados no `relatorio.md` desta change.
  Custo: muda a Q11 (a) do Gabriel; os textos ficam na `main` como estão até a `lancamento-r1`,
  com a `pagina-contato`, a `inicio-completo` e a `homologacao-r1` no meio.
- (b) Para a 1ª tarefa desta change, como a Q11 (a). Custo: o diff toca três arquivos do gatilho, e
  o guardião passa ao checklist inteiro (passo 1 da conferência proporcional); a sessão pode não
  caber.
- (c) Numa change própria, só de texto, logo depois desta. Custo: uma sessão a mais, com o checklist
  inteiro, porque os três arquivos governam.
- Recomendo (a), porque é o que o briefing manda e mantém esta change na conferência de tela.

**Q2. O que fica no lugar da frase da faixa?**

- (a) Nada: sobretítulo e título, como a Equipe (Q2 (b) da `pagina-sobre-e-equipe`). Custo: uma
  linha a menos que o gabarito, diferença a classificar.
- (b) "As quatro frentes de trabalho da Liga.", registrada como rótulo de interface na
  `REFERENCIA-VISUAL.md` §7, só com palavras do §3. Custo: texto que não está no documento.
- Recomendo (a), pelo precedente da Equipe e porque nada se inventa.

**Q3. A descrição de Projetos para buscadores.** Nenhum trecho do §3 descreve a página inteira:
cada parágrafo descreve uma frente.

- (a) **(fora do documento)** "Ensino, Extensão, Pesquisa e Secretaria: as quatro frentes de
  trabalho da Liga Acadêmica Multiprofissional de Cuidados Paliativos (LIACUP).", **139**
  caracteres, só com o título do §3 e o nome do §1, registrada no §3 pelo `especificador`, com a
  autorização escrita do Gabriel, como a da Equipe no §4 (Q9 (a) de lá). Custo: uma frase nova no
  documento.
- (b) A primeira frase de Ensino, inteira: "Vivências teórico-práticas que complementam a formação
  acadêmica, estimulando uma formação humanista, reflexiva, crítica e multidisciplinar.", **140**.
  Custo: o buscador mostra uma frente só como se fosse a página.
- (c) O Gabriel escreve outra, de 70 a 160 caracteres. Custo: o registro no §3, igual à (a).
- Recomendo (a), porque descreve exatamente o que a página mostra, com palavras que o documento já
  tem.

**Q4. Onde se prova o interruptor em `/projetos`?** A spec `publicacao-do-site` fixa "as mesmas
quatro rotas" e `rotas verificadas: 4`, e está no gatilho.

- (a) Num requisito da spec nova `pagina-projetos`, verificado pelo e2e da própria página, sem tocar
  `publicacao-do-site` nem o teste do interruptor, que continua com 4. Custo: a amostra de rotas do
  interruptor fica atrás das páginas; vai uma nota para a `lancamento-r1` derivar as rotas dele da
  lista única.
- (b) Spec delta de `publicacao-do-site` com cinco rotas. Custo: o diff entra no gatilho, e o
  guardião passa ao checklist inteiro.
- Recomendo (a), porque a spec da Equipe já tem um requisito igual, e a change continua só de tela,
  como o briefing pede.

**Q5. O itálico do parágrafo da Secretaria.** No §3 ele está em itálico; nos outros três, não. O
protótipo não mostra a Secretaria com texto real.

- (a) Sem itálico, como os outros três. Custo: nenhum na tela.
- (b) Em itálico, como o documento. Custo: um cartão diferente dos outros, que é a marca de rascunho
  que o §3 manda não mostrar.
- Recomendo (a), porque o §3 decide "sem marcação visível de rascunho".

## Fora de escopo

- O detalhamento das frentes pela liga, o painel e qualquer outra página.
- Os cinco textos do passo 7 e o comentário do `ci.yml` (Q1).
- Botão para Projetos no hero da inicial: chamadas para as páginas são da `inicio-completo`.
- Mudar `docs/PLANO-DE-DESENVOLVIMENTO.md`, qualquer spec do gatilho,
  `.github/`, `scripts/`, `package*.json`, `src/proxy.ts`, `playwright.config.ts` ou
  `lighthouserc.json`. O `docs/SEGURANCA.md` entrou depois, pela Q7 (a) e pela Q8 (a) do Gabriel:
  só a linha de origem dos 9 prints no §7, o total e a versão 3.3.

## Capabilities

### New Capabilities

- `pagina-projetos`: o que `/projetos` mostra, com o texto conferido contra o documento, e o
  interruptor nela (Q4 (a)).

### Modified Capabilities

- `navegacao-publica`: a lista com cinco páginas, em REMOVED mais ADDED, porque o cenário "Nesta
  entrega, a lista tem a Início, o Sobre, a Equipe e o Processo seletivo" fica falso; o rodapé com
  Projetos na coluna "Conteúdo"; a medição com 5 páginas.
- `seo`: os títulos e as descrições desta entrega passam a cinco.

## Requisitos permanentes

| RP | Aplica? | Em uma linha |
| --- | --- | --- |
| RP-01 | Sim | Nenhuma dependência nova: 23 diretas antes e depois |
| RP-02 | Sim | `verificar:tokens` com código 0 |
| RP-03 | Sim | Token novo só acrescentado, com origem medida no protótipo |
| RP-04 | Sim | Nenhum controle novo na página; o destino novo da moldura medido, com contador |
| RP-05 | Sim | Zero rolagem horizontal nas 5 páginas da lista, nas 7 larguras |
| RP-06 | Sim | Lighthouse nas 5 páginas publicadas e na raiz não publicada, com SEO ≥ 95 |
| RP-07 | Sim | axe 0 na página nova e na raiz não publicada |
| RP-08 | Sim | Cada diferença do lado a lado com veredito e motivo |
| RP-09 | Sim | Texto dos cartões sobre a superfície, com o par medido e nomeado |
| RP-10 | Sim | O segredo de bypass do P23 nunca é versionado nem impresso |
| RP-11 | Não | Nenhuma tabela |
| RP-12 | Sim | Toda verificação nova vista falhando (`design.md`, D6) |
| RP-13 | Sim | `verificar:artefatos` com código 0; os prints da change entram com origem |
| RP-14 | Sim | Lado a lado do guardião e aprovação nominal do Gabriel no Portão 2 |

## Impact

| O que | Efeito | Quem escreve |
| --- | --- | --- |
| `src/` (lista nominal no `design.md`, D7) | A página, os dados dela e a lista com 5 entradas | `dev-frontend` |
| `tests/e2e/` | Spec da página; `paginas-publicas` ajustado | `qa-acessibilidade` |
| `docs/REFERENCIA-VISUAL.md` §7 | Os rótulos da faixa (e a frase, se a Q2 for (b)) | líder técnico, no Portão 1 |
| `docs/conteudo-institucional.md` §3 | A descrição para buscadores, se a Q3 for (a) ou (c) | `especificador`, com autorização escrita do Gabriel, no Portão 1 |
| `relatorio.md` desta change | A prova do push e a passagem para a `lancamento-r1` | líder técnico e `especificador` |
| Guardião | Previsto no Portão 1: passo 3 (AS-01, AS-02, AS-04, AS-07 e AS-15). **Depois da Q7 (a): passo 1, checklist inteiro**, porque o `docs/SEGURANCA.md` está na lista do gatilho (`design.md`, D7) | `guardiao-appsec` |
| Produção | Nada muda: o interruptor leva `/projetos` à página em construção | — |
| Prévias | A página, o destino no menu e no rodapé | — |
