# Proposta — páginas Sobre e Equipe

## Why

A R1 precisa dizer quem é a liga e quem a faz. O `conteudo-institucional.md` já tem o texto
aprovado para as duas páginas (§2.1 a §2.6 e §4), e o protótipo tem a composição delas
(`prototipo/prints/sobre-{390,1280}.png` e `equipe-{390,1280}.png`). Junto entram as duas
pendências que a `pagina-processo-seletivo` deixou para cá: a Q20 (a) e as seções 11.2 e 11.3 dos
`PADROES-DE-CODIGO.md`, que faltaram na R1-2.

## What Changes

1. **Pendências da `pagina-processo-seletivo`:**
   - toda lista sem marcador visível das páginas públicas passa a ser anunciada como lista pelo
     VoiceOver do iPhone: as seis que existem hoje (menu do cabeçalho, menu lateral, colunas do
     rodapé, etapas, quem pode se inscrever, perguntas) e as das páginas novas;
   - as duas constantes do nome da liga, conforme a **Q1**; o tipo e o componente de título de
     seção deixam de ter o mesmo nome, e o componente passa a uma camada comum, porque as três
     páginas o usam;
   - a 11.2 e a 11.3 entram nos `PADROES-DE-CODIGO.md`, com o texto do briefing, colado como está.
2. **`/sobre`**, na composição do gabarito, com o texto do §2.1 a §2.6 e do §4.1:
   - faixa do topo conforme a **Q2**;
   - "Como a Liga começou": o §2.2, ao lado do quadro da foto, que fica como o hero da inicial
     (borboleta da liga grande, em opacidade baixa, sem texto; `REFERENCIA-VISUAL.md` §7);
   - "O que a Liga se propõe a fazer": o §2.3 a §2.6 inteiros, na forma da **Q3**, sem cortar
     texto. Os cinco objetivos do protótipo eram exemplo e saem;
   - os docentes do §4.1, conforme a **Q5** e a **Q6**, com o nome "Kerolyn Ramos Garcia".
3. **`/equipe`**, na composição do gabarito, com o texto do §4:
   - faixa do topo conforme a **Q2**;
   - a diretoria: os seis cargos do §4.3, cada um com a linha dele, sem nome, sem curso e sem
     foto. Os oito cargos e os nomes do protótipo eram exemplo e saem;
   - os fundadores discentes do §4.2, onde a **Q8** decidir;
   - os docentes do §4.1, se a **Q5** os mantiver aqui;
   - o bloco "Ligantes" não aparece até a liga mandar nomes e fotos.
4. **Nenhuma foto de pessoa (Q7, decisão do Gabriel fora das três opções).** Os docentes, nas
   duas páginas, têm as iniciais no círculo ("MC" e "KG", pela regra mecânica do `design.md`, D6),
   decorativas, com o contraste medido e nomeado (RP-09). Os cartões de cargo ficam sem círculo,
   porque não há pessoa para mostrar; os círculos voltam quando a liga mandar nomes e fotos.
   Nenhum "(pendente)", "Foto" ou texto de demonstração na tela.
5. **A lista única ganha Sobre e Equipe**, na ordem do menu do protótipo (Início, Sobre, Equipe), e
   no rodapé Sobre fica na coluna "Portal" e Equipe na "Conteúdo", como no gabarito. Títulos "Sobre
   · LIACUP" e "Equipe · LIACUP"; descrições pela **Q9**. Efeitos que vêm sozinhos da lista, e que
   o briefing não cita: o botão "Conheça a Liga" aparece no hero da inicial (a spec
   `pagina-inicial` já manda isso), e a coluna "Conteúdo" do rodapé aparece pela primeira vez.
6. **O conteúdo institucional.** No §8, a pendência "nomes da diretoria atual", com o placar
   corrigido; e o texto que as Qn mandarem registrar (Q2, Q6, Q9). Quem escreve é o
   `especificador`, só depois da decisão escrita do Gabriel. Os rótulos de interface (títulos de
   seção, **Q4**) vão para a `REFERENCIA-VISUAL.md` §7, pelo líder técnico.

As specs seguem as decisões do Portão 1 (tabela abaixo). Só a Q7 saiu da recomendação, e as specs,
o `design.md` e o `tasks.md` foram ajustados a ela antes do apply.

**Critérios de aceite** (os do briefing):

- Lado a lado do `guardiao-visual` em 390 e 1280 px das duas páginas e do menu aberto em 390, com
  cada diferença classificada. Entram também o hero da inicial, que ganha o "Conheça a Liga", e o
  rodapé, que ganha a coluna "Conteúdo".
- Texto das duas páginas idêntico ao documento, palavra por palavra, por teste que lê o documento.
- e2e verde nas 7 larguras, nos dois modos do interruptor; axe 0; nenhuma rolagem horizontal;
  Lighthouse ≥ 90, acessibilidade ≥ 95 e SEO ≥ 95 nas páginas novas, publicadas.
- Com o site não publicado, `/sobre` e `/equipe` respondem 307 para `/`, e a página em construção
  continua idêntica.
- P23 com 200 e sem `Location` em `/sobre` e `/equipe`, na prévia da branch
  `feat/pagina-sobre-e-equipe`, no host `portal-liacup-git-feat-pagina-sobre-e-equipe-liacup1.vercel.app`
  (D11 da change anterior), com o host e o commit confirmados pelo Gabriel no painel da Vercel.
- Nenhum "(pendente)", "Foto" ou texto de demonstração na tela.
- Q7: iniciais "MC" e "KG" fora da árvore de acessibilidade, com o par de cor (cor das iniciais,
  fundo do círculo e superfície do cartão) nomeado e medido em pelo menos 4,5:1, ou 3:1 se as
  iniciais forem texto grande, nas duas páginas; nenhum círculo nos cartões de cargo.

**Conta de tarefas: 14 de 15** (`tasks.md`). A change não se divide. Se uma correção passar de 15,
a `/equipe` sai inteira para uma change própria (tarefas 4.1 e 5.2, e as partes de Equipe da 2.2,
5.3 e 6.1), com as decisões do Portão 1 valendo para ela.

## Decisões do Portão 1 (22/11/2026)

O texto literal do Gabriel fica no `relatorio.md`, seção "Decisões do Gabriel no Portão 1",
transcrito pelo líder técnico. As opções e os custos ficam no `design.md`, "Open Questions".

| Qn | Decisão | Onde entrou |
| --- | --- | --- |
| Q1 (b) | Uma constante do nome da liga; o cabeçalho acrescenta " · UnB" | Item 1; D7 |
| Q2 (b) nas duas | Sobre: `h1` "Sobre a LIACUP" e o §2.1. Equipe: "Equipe" e "Quem faz a LIACUP", sem a frase | Itens 2 e 3; specs `pagina-sobre` e `pagina-equipe`; D4, D5; `REFERENCIA-VISUAL.md` §7, pelo líder técnico |
| Q3 (a) | Quatro linhas numeradas, com o título da seção do documento | Item 2; D4 |
| Q4 (a) | Títulos e sobretítulos do protótipo, como rótulos de interface | Itens 2 e 3; `REFERENCIA-VISUAL.md` §7, pelo líder técnico |
| Q5 (a) | Docentes nas duas páginas | Itens 2 e 3; D1 |
| Q6 (b) | "Orientadora" na linha da Kerolyn | Item 2; `conteudo-institucional.md` §4.1, pelo `especificador` |
| Q7 | **Nenhuma das três:** iniciais nos docentes, cargos sem círculo, contraste medido e nomeado | Item 4; specs `pagina-sobre` e `pagina-equipe`; D5, D6; `REFERENCIA-VISUAL.md` §7, pelo líder técnico |
| Q8 (a) | Fundadores na Equipe, no lugar de "Ligantes" | Item 3; D5 |
| Q9 (a) nas duas | Sobre: 1ª frase do §2.4. Equipe: a frase registrada no §4 | Item 5; spec `seo`; `conteudo-institucional.md` §4, pelo `especificador` |
| Q10 (a) | Nota de fonte do §2.4 fora da tela | Item 2; spec `pagina-sobre`; D8 |

## Fora de escopo

- Fotos de qualquer pessoa, nomes da diretoria atual, o bloco "Ligantes".
- Painel, edição pelo painel e qualquer outra página.
- Sitemap, `robots.txt`, JSON-LD e `noindex` fora de produção: a 11.2 entra só como regra escrita, e
  a implementação continua da `lancamento-r1`.
- Trocar o hero da inicial pelo quadro comum: o hero fica como está (D5 do `design.md`).
- Baixar limiar, tirar verificação ou mexer em `.github/`, `package.json` ou `src/proxy.ts`.

## Capabilities

### New Capabilities

- `pagina-sobre`: o que `/sobre` mostra, com o texto conferido contra o documento de conteúdo.
- `pagina-equipe`: o que `/equipe` mostra, sem nome, foto nem bloco que a liga ainda não mandou.

### Modified Capabilities

- `navegacao-publica`: a lista com quatro páginas, em REMOVED mais ADDED, porque o cenário "Nesta
  entrega" fica falso; o rodapé com a coluna "Conteúdo"; a medição com 4 páginas; e, ADDED, as
  listas sem marcador anunciadas como lista.
- `publicacao-do-site`: `/sobre` passa a existir. O cenário que pedia 404 para `/sobre` publicado
  fica falso; passa a pedir 200, e o 404 fica com o endereço inexistente. `/equipe` entra nas rotas
  verificadas nos dois modos.
- `seo`: os títulos e as descrições desta entrega passam a quatro.

## Requisitos permanentes

| RP | Aplica? | Em uma linha |
| --- | --- | --- |
| RP-01 | Sim | Nenhuma dependência nova: 22 diretas antes e depois |
| RP-02 | Sim | `verificar:tokens` com código 0 |
| RP-03 | Sim | Token novo só acrescentado, com origem medida no protótipo |
| RP-04 | Sim | Nenhum controle novo nas páginas; os da moldura continuam medidos, com contador |
| RP-05 | Sim | Zero rolagem horizontal nas 4 páginas da lista, nas 7 larguras |
| RP-06 | Sim | Lighthouse nas 4 páginas publicadas e na raiz não publicada, com SEO ≥ 95 |
| RP-07 | Sim | axe 0 nas páginas novas e na raiz não publicada |
| RP-08 | Sim | Cada diferença do lado a lado com veredito e motivo |
| RP-09 | Sim | Texto sobre a faixa escura do Sobre e iniciais no círculo dos docentes, nas duas superfícies de cartão, com o par medido e nomeado |
| RP-10 | Sim | O segredo de bypass do P23 nunca é versionado nem impresso |
| RP-11 | Não | Nenhuma tabela |
| RP-12 | Sim | Toda verificação nova vista falhando (`design.md`, D9) |
| RP-13 | Sim | `verificar:artefatos` com código 0; os prints da change entram com origem |
| RP-14 | Sim | Lado a lado do guardião e aprovação nominal do Gabriel no Portão 2 |

## Impact

| O que | Efeito | Quem escreve |
| --- | --- | --- |
| `src/` (lista nominal no `design.md`, D12) | Duas páginas, dados delas, lista com 4 entradas, listas anunciadas, nome da liga, título de seção e borboleta numa camada comum | `dev-frontend` |
| `tests/e2e/` | Specs das duas páginas; `paginas-publicas`, `interruptor`, `pagina-inicial` e `menu-por-teclado` ajustados | `qa-acessibilidade` |
| `docs/PADROES-DE-CODIGO.md` §11.2 e §11.3 | Texto do briefing, colado | líder técnico |
| `docs/REFERENCIA-VISUAL.md` §7 | Rótulos e regras decididos na Q2, Q4 e Q7 | líder técnico, no Portão 1 |
| `docs/conteudo-institucional.md` §4, §4.1 e §8 | Descrição da Equipe (Q9), "Orientadora" (Q6), pendência nova e placar | `especificador`, com autorização escrita do Gabriel, no Portão 1 (feito) |
| Guardião | O diff toca `docs/PADROES-DE-CODIGO.md` e a spec `publicacao-do-site`, que estão na lista do gatilho: **checklist inteiro** (passo 1 da conferência proporcional) | `guardiao-appsec` |
| Produção | Nada muda: o interruptor leva `/sobre` e `/equipe` à página em construção | — |
| Prévias | As duas páginas, o "Conheça a Liga" e a coluna "Conteúdo" | — |
