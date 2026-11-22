# Design — páginas Sobre e Equipe

## Context

Ver `proposal.md`, seção Why. Estado lido na `main` `6cc85a6` pelo especificador:

| O que | Situação |
| --- | --- |
| Lista única | `src/lib/utils/paginas-publicas.json` com 2 entradas (`/`, `/processo-seletivo`). `tituloEsperado` monta `<rótulo> · LIACUP`, e a Início usa `NOME_DA_LIGA` = "Liga Acadêmica Multiprofissional de Cuidados Paliativos" |
| Cabeçalho | `Cabecalho.tsx` tem outra constante `NOME_DA_LIGA` = "Liga Acadêmica Multiprofissional de Cuidados Paliativos · UnB", que desenha o nome visível acima de 1024 px e o nome acessível da marca |
| Hero | `HeroDaInicial.tsx` já tem o botão "Conheça a Liga" para `/sobre`, que aparece sozinho quando `/sobre` entra na lista (`estaNaLista`) |
| Borboleta | `src/app/(site)/(publicas)/_inicio/BorboletaDaLiga.tsx`; o comentário dela já diz que, quando o Sobre precisar dela, o lugar certo é `src/componentes/ui/` |
| Título de seção | `src/features/processo-seletivo/componentes/TituloDeSecao.tsx`, com o tipo `TituloDeSecao` em `tipos.ts`: mesmo nome para tipo e componente (achado 5 do `revisor`, Q20) |
| Listas sem marcador | `list-style: none` em 6 lugares: `Cabecalho`, `MenuLateral`, `RodapePublico`, `Etapas`, `QuemPodeSeInscrever`, `PerguntasFrequentes`. Nenhum com `role="list"` |
| Interruptor | `tests/e2e/interruptor.spec.ts` usa `/sobre` como rota "sem página": espera 404 no publicado. Fica falso nesta change |
| Gabarito | `sobre-{390,1280}`: faixa roxa (sobretítulo, `h1`, frase), "Como a Liga começou" com cartão "Pendente" e quadro "Foto de uma atividade da Liga", "O que a Liga se propõe a fazer" em fundo de superfície (título à esquerda, 5 linhas numeradas à direita, com filete entre elas; empilhado em 390), "Professores orientadores" com 2 cartões. `equipe-{390,1280}`: faixa clara (sobretítulo, `h1`, frase), "Diretoria" em grade de círculos (4 colunas em 1280, 2 em 390), faixa de superfície com "Ligantes" e "Docentes orientadores". `menu-aberto-390`: 10 destinos e o botão de destaque |

## Goals / Non-Goals

**Goals:**

- As duas páginas saem da lista e dos dados; nenhuma composição guarda texto.
- Nada inventado na tela: o que o documento não tem fica fora (PLANO §12, "o que falta fica fora da
  tela, não aparece como rascunho").
- A produção continua igual.

**Non-Goals:** ver "Fora de escopo" da proposta.

## Decisions

### D1 — Onde as páginas moram

- Rotas em `src/app/(site)/(publicas)/sobre/` e `equipe/`. O interruptor não muda: todo endereço
  que não é `/` nem `/em-construcao` já leva 307 no não publicado.
- Domínios em `src/features/sobre/` (faixa, história, objetivos) e `src/features/equipe/` (cargos,
  fundadores, docentes), cada um com `tipos.ts`, `conteudo.ts` e `componentes/`, como a
  `pagina-processo-seletivo` (D1 de lá). Na R3, nomes e fotos da equipe viram dado do banco, e o
  `dados.ts` mora aqui.
- **Docentes nas duas páginas (Q5 (a)):** os dados e o cartão moram em `features/equipe`. A rota
  `/sobre` compõe o bloco de docentes importando de `features/equipe`, o que a tabela de camadas
  permite (`app` importa de tudo); `features/sobre` não importa de `features/equipe`.

### D2 — Que spec muda, e qual não muda

- `navegacao-publica`: REMOVED mais ADDED da lista (o cenário "Nesta entrega" fica falso, e o
  validador não deixa MODIFIED largar cenário, como na change anterior); MODIFIED do rodapé e da
  medição, que mudam só o corpo de cenários de nome igual; ADDED das listas anunciadas.
- `publicacao-do-site`: MODIFIED de dois requisitos. `/sobre` deixa de ser exemplo de página
  inexistente; o 404 publicado fica com `/endereco-que-nao-existe`, e `/equipe` entra nas rotas dos
  dois modos (3 para 4).
- `seo`: MODIFIED do cenário "Os títulos e as descrições desta entrega".
- **Não mudam:** `pagina-inicial` ("Botões só para páginas que existem" já diz que o botão aparece
  quando a página entra na lista); `fundacao-e-ci` (cita `/sobre` como "exista a página ou não");
  `pagina-processo-seletivo` (as listas dela ficam cobertas pelo requisito novo da
  `navegacao-publica`, que vale para toda página da lista).

### D3 — A lista

- Entradas novas, na ordem do menu do protótipo:
  - `/sobre`, rótulo "Sobre", `noMenu` `true`, `colunaDoRodape` "Portal", logo depois da Início;
  - `/equipe`, rótulo "Equipe", `noMenu` `true`, `colunaDoRodape` "Conteúdo", no fim.
  - O Processo seletivo fica onde está: ele não entra no menu nem no rodapé, então a posição dele
    não muda nada na tela.
- Títulos pelo `tituloEsperado`: "Sobre · LIACUP" (14 caracteres) e "Equipe · LIACUP" (15).
- Descrições pela Q9. Contadas à mão pelo especificador; o teste de unidade confere.
- Nenhuma mudança no `problemasDaLista`: ele já confere tudo o que a 11.1 pede.

### D4 — A composição de `/sobre`

Do protótipo vale a composição; o texto vem dos dados (D8).

- **Faixa do topo (Q2):** a faixa roxa do gabarito. Com a recomendação (b): `h1` "Sobre a LIACUP"
  (rótulo de interface, registrado na `REFERENCIA-VISUAL.md` §7) e o §2.1 como parágrafo, no lugar
  da frase. A borboleta clara do canto continua, decorativa. O par de cor do texto sobre o roxo é
  medido e nomeado (RP-09).
- **"Como a Liga começou":** o §2.2 em parágrafo, sem o cartão tracejado "Pendente". O quadro da
  foto fica como o do hero da inicial (`REFERENCIA-VISUAL.md` §7): borboleta da liga grande, em
  opacidade baixa, sem texto, `aria-hidden`. Lado a lado em 1280, empilhado em 390, como o gabarito.
  O quadro é um componente novo em `src/componentes/padroes/`; o hero **não** é migrado para ele
  nesta change, para a inicial não mudar um pixel. Fica registrado como dívida: dois quadros com os
  mesmos tokens.
- **"O que a Liga se propõe a fazer" (Q3):** com a recomendação (a), quatro linhas numeradas 01 a
  04, cada uma com o nome da seção do documento em `h3` e o texto inteiro dela. O número é
  decorativo (`aria-hidden`), porque a lista ordenada já o anuncia.
- **Docentes:** D6.
- Títulos e sobretítulos das seções: Q4. Hierarquia `h1` na faixa, `h2` nos blocos, `h3` nos itens
  e nos nomes dos docentes.

### D5 — A composição de `/equipe`

- **Faixa do topo (Q2):** a faixa clara do gabarito. Com a recomendação (b): sobretítulo "Equipe" e
  `h1` "Quem faz a LIACUP", sem a frase "Gestão 2026: …".
- **Diretoria (Q7, decisão do Gabriel):** a grade do gabarito, 4 colunas em 1280 e 2 em 390,
  **sem círculo**: não há pessoa para mostrar. Cada cartão: o cargo em `h3` no lugar do nome e a
  linha do §4.3 no lugar de "cargo · curso", centralizados como no gabarito. Os numerais romanos do
  §4.3 não vão à tela; o gabarito não os tem. A grade sem círculos e com a linha do §4.3, mais
  longa que "Medicina · 8º semestre", é diferença decidida: o `guardiao-visual` a classifica como
  decisão do Gabriel e diz se a grade continua equilibrada em 390. Se não estiver, propõe uma
  coluna em 390 como melhoria a aprovar. Quando a liga mandar nomes e fotos, os círculos voltam,
  numa change própria.
- **Fundadores discentes (Q8):** com a recomendação (a), no lugar do bloco "Ligantes", na faixa de
  superfície, com o `h2` "Fundadores discentes" (título do §4.2) e os cinco nomes na letra dos nomes
  do gabarito, sem círculo. Composição nova sobre a área do protótipo: entra no lado a lado como
  **melhoria a aprovar**.
- **Docentes:** D6, sobre a superfície, como o gabarito.

### D6 — Camada comum

- `TituloDeSecao` (sobretítulo e `h2`) passa para `src/componentes/padroes/`, usado pelas três
  features. O tipo do texto ganha nome próprio (`TextoDoTituloDeSecao`), e o componente mantém o
  nome (Q20). O `processo-seletivo` muda só os imports.
- `BorboletaDaLiga` passa para `src/componentes/ui/`, como o comentário dela já previa. Continua
  necessária fora da inicial: no quadro da história e no canto da faixa do Sobre, que são de
  `features/sobre`, e uma feature não importa de `app`. O hero muda só o import, e o lado a lado da
  inicial confere que nada mudou além do botão novo. Ela **não** vai em círculo nenhum (Q7).
- **Círculo com as iniciais (Q7, decisão do Gabriel):** só nos cartões de docente, no tamanho do
  círculo do cartão do gabarito. Mora em `features/equipe/componentes/`, porque só o cartão de
  docente o usa; não vai para `ui/`.
  - **A regra das iniciais** é função pura em `features/equipe/regras.ts`, com teste de unidade:
    do nome como está no §4.1, tira as palavras de tratamento que terminam em ponto ("Profa.",
    "Dra."), e junta a primeira letra da primeira palavra que sobra e a da última, em maiúsculas.
    "Profa. Dra. Mariana Sodário Cruz" dá **"MC"**; "Profa. Dra. Kerolyn Ramos Garcia" dá
    **"KG"**. As iniciais não ficam escritas nos dados: saem do nome, e trocar o nome troca as
    iniciais.
  - **Leitor de tela:** o círculo inteiro, com as iniciais, é `aria-hidden`. O nome completo está
    no `h3` ao lado, e as iniciais não são lidas duas vezes.
  - **Contraste (RP-09):** o dev mede a cor das iniciais contra o fundo do círculo, nas duas
    superfícies de cartão (no Sobre, o cartão de superfície sobre o creme; na Equipe, o cartão
    creme sobre a superfície), e registra no relatório as duas cores e a superfície de cada uma.
    Mínimo de 4,5:1; 3:1 só se as iniciais tiverem pelo menos 24 px (ou 18,66 px em negrito), com
    o tamanho registrado. Só tokens: se nenhum par existente passar, token novo com origem.
  - Quando a foto chegar, ela substitui as iniciais dentro do mesmo círculo.
- **Cartão de docente:** em `features/equipe/componentes/`, usado nas duas rotas. Círculo com as
  iniciais, nome em `h3`, cargo e formação em parágrafos.

### D7 — Pendências da Q20

- **Listas:** `role="list"` nas seis listas sem marcador de hoje e em toda lista nova sem marcador
  (objetivos, diretoria, fundadores, docentes). O briefing diz "nas listas sem marcador", sem
  restringir às duas que a Q20 nomeou; as quatro da moldura custam um atributo cada. O lint de
  acessibilidade pode acusar o papel redundante: se acusar, o dev desliga a regra só na linha, com
  o motivo (WebKit) no comentário, e registra no relatório. A regra do lint não se desliga no
  projeto.
- **Nome da liga (Q1):** com a recomendação (b), uma constante só, a de `paginas-publicas.ts`
  (sem "· UnB"), e o cabeçalho compõe o nome visível com um sufixo próprio, " · UnB". Texto
  visível, nome acessível e título da Início ficam iguais ao de hoje, conferidos pelos testes que já
  existem.

### D8 — Os dados

- `features/sobre/conteudo.ts`: título da faixa e apresentação (§2.1), história (§2.2), os quatro
  itens (nome e parágrafos; o §2.3 com dois), sem a nota "(Estatuto, Art. 2º)" (Q10), e os títulos
  das seções (Q4).
- `features/equipe/conteudo.ts`: os seis cargos (cargo e linha), os cinco fundadores, os dois
  docentes (nome, cargo e formação) e os títulos.
- **Teste de unidade** de cada um: nada vazio, nada repetido, e as contagens `itens: 4 ·
  parágrafos: 5` no Sobre e `cargos: 6 · fundadores: 5 · docentes: 2` na Equipe, impressas.
- **O teste do texto contra o documento é de ponta a ponta** (D9), lendo o
  `conteudo-institucional.md`, como o do processo seletivo: pega também texto que a composição
  escreva por conta própria.
- Carregando, erro e vazio: o vazio é impossível hoje (dado estático, contagens exigidas pelo
  teste). Os três estados chegam na R3, com o banco, como a Q12 (a) da change anterior.

### D9 — Verificações e RP-12

O `qa-acessibilidade` escreve, lendo a lista e o documento, sem copiar texto:

1. Spec de `/sobre` e spec de `/equipe`, nas 7 larguras, publicado: os trechos conferidos com o
   documento, com as contagens; a ausência dos termos das specs; um `h1`; axe 0; as iniciais "MC"
   e "KG" visíveis e fora da árvore de acessibilidade, calculadas no teste pela mesma regra a
   partir dos nomes lidos do documento; e, na Equipe, nenhum círculo nem imagem nos seis cartões de
   cargo.
2. Ajustes: `páginas verificadas: 4 de 4`; o `interruptor.spec.ts` na forma nova da
   `publicacao-do-site` (`rotas verificadas: 4`); o `pagina-inicial.spec.ts` com o "Conheça a Liga"
   presente e levando a `/sobre`; o menu e o rodapé com os destinos novos; e a verificação das
   listas anunciadas, percorrendo a lista de páginas e imprimindo quantas listas conferiu.

Demonstrações de falha, cada uma com a saída vermelha e a verde no relatório:

| # | Violação temporária | Vermelho esperado |
| --- | --- | --- |
| 1 | Uma palavra trocada no §2.2 da página | e2e: o trecho, o esperado e o recebido |
| 2 | Um cargo a menos nos dados da Equipe | unidade: a contagem; e2e: o cargo que falta |
| 3 | "Kerolyn Ramos" sem "Garcia" nos dados | e2e: o nome esperado e o recebido |
| 4 | Uma lista sem `role="list"` | e2e: a página e a lista |
| 5 | Descrição do Sobre com 161 caracteres | unidade: o endereço e "161" |
| 6 | Um segundo `h1` em `/equipe` | e2e: a página e os dois títulos |
| 7 | A regra das iniciais pegando a segunda palavra no lugar da última ("KR") | unidade: o nome, "KG" esperado e "KR" recebido |
| 8 | O círculo com as iniciais sem `aria-hidden` | e2e: a página e as iniciais que apareceram na árvore de acessibilidade |

Depois, `git status --porcelain` igual ao de antes e `sha256sum -c` com OK nos arquivos tocados.

### D10 — `PADROES-DE-CODIGO.md` §11.2 e §11.3

O texto do briefing, colado como está, depois da 11.1 e antes da linha "Aprovada pelo Gabriel em
21/11/2026…", que passa a valer para a 11.1. O líder técnico escreve. Nada da 11.2 é implementado
aqui: sitemap, `robots.txt`, JSON-LD e `noindex` são da `lancamento-r1`.

### D11 — O P23

Pela forma da `SEGURANCA.md` §5, sem mudança nela. Host exato
`portal-liacup-git-feat-pagina-sobre-e-equipe-liacup1.vercel.app` (52 caracteres antes de
`.vercel.app`, contados à mão; abaixo do corte de 63), rotas `/sobre` e `/equipe`. O Gabriel
confirma o host e o commit no painel da Vercel antes.

### D12 — Escopo nominal

| Quem | Arquivos |
| --- | --- |
| `dev-frontend` | `src/app/(site)/(publicas)/sobre/` e `equipe/`; `src/features/sobre/` e `src/features/equipe/`; `src/componentes/padroes/` (título de seção, quadro); `src/componentes/ui/` (só a borboleta; o círculo com as iniciais e a regra delas ficam em `features/equipe`, D6); `src/app/(site)/(publicas)/_inicio/` (só o import da borboleta, e o arquivo antigo apagado); `src/features/processo-seletivo/` (imports, tipo renomeado, `role="list"`); `src/componentes/layout/` (`Cabecalho`, `MenuLateral`, `RodapePublico`: `role="list"` e, no cabeçalho, a Q1); `src/lib/utils/paginas-publicas.{json,ts,test.ts}`; `src/estilos/tokens.css` só com linhas acrescentadas |
| `qa-acessibilidade` | `tests/e2e/` (dois specs novos; `paginas-publicas`, `interruptor`, `pagina-inicial`, `menu-por-teclado`, `processo-seletivo` se a verificação das listas morar nele). `playwright.config.ts` não muda |
| `guardiao-visual` | `openspec/changes/pagina-sobre-e-equipe/prints/` |
| Líder técnico | `docs/PADROES-DE-CODIGO.md` §11.2 e §11.3; `docs/REFERENCIA-VISUAL.md` §7 (Q2, Q4, Q7, no Portão 1); os prints das opções da Q3 em `openspec/changes/pagina-sobre-e-equipe/prints/`, antes do Portão 1, com o esboço fora de `src/` |
| `especificador` | Além desta pasta, no `docs/conteudo-institucional.md`, com a autorização escrita do Gabriel de 22/11/2026 (§4, §4.1 e §8), **feito no Portão 1**: no §4, a descrição da Equipe (Q9 (a)); no §4.1, "Orientadora" na linha da Kerolyn e uma nota de origem abaixo da nota do nome (Q6 (b)); no §8, a linha "Nomes da diretoria atual" e o placar ("de 16 itens, 9 resolvidos", "Restam 7"). A Q2 (b) não acrescenta texto ao documento |

Não mudam: `src/proxy.ts`, `src/app/layout.tsx`, `src/app/(site)/em-construcao/`,
`PaginaEmConstrucao*`, `lighthouserc.json`, `scripts/`, `playwright.config.ts`, `.github/`,
`package.json`, `package-lock.json`. Arquivo fora destas listas é desvio, e vai nomeado na entrega.

**Conferência proporcional do guardião** (`SEGURANCA.md` §5): o diff previsto toca
`docs/PADROES-DE-CODIGO.md` e, no archive, `openspec/specs/publicacao-do-site/`, os dois na **lista
do gatilho**. Pelo passo 1, **checklist inteiro**. Sem os dois, o resto do diff estaria todo na
lista de tela (passo 3). Tirar a 11.2 e a 11.3 daqui não mudaria a classificação, porque a spec
`publicacao-do-site` precisa mudar de qualquer jeito.

### Fontes do texto que vai ao ar

| Texto | Fonte |
| --- | --- |
| Faixa do Sobre | Q2: título "Sobre a LIACUP" (rótulo) e §2.1 |
| História | §2.2 |
| O que a Liga se propõe a fazer | §2.3 a §2.6; nomes dos itens são os títulos das seções do documento, sem "— Sobre" (Q3 (a)); nota de fonte fora (Q10) |
| Docentes | §4.1; cargo da Mariana "Orientadora Geral", com G maiúsculo, como o documento (o protótipo tem "geral"); cargo da Kerolyn "Orientadora", inserido no §4.1 pela Q6 (b) |
| Iniciais no círculo dos docentes | Não são texto novo: saem do nome do §4.1 pela regra do D6 ("MC" e "KG"), e não são anunciadas |
| Faixa da Equipe | Q2: "Equipe" e "Quem faz a LIACUP" (rótulos) |
| Cargos e linhas | §4.3, colunas "Cargo" e "Em uma linha" |
| Fundadores | §4.2, na ordem do documento |
| Títulos e sobretítulos de seção | Q4 |
| Títulos e descrições de SEO | D3 e Q9 |

## Risks / Trade-offs

| Risco | Mitigação |
| --- | --- |
| Texto longo do §2.3 a §2.6 (cerca de 1.850 caracteres) deixar o Sobre muito comprido em 390 | É o texto aprovado e não se corta. Os prints da Q3 mostram o tamanho de cada forma antes da decisão |
| A grade da diretoria sem círculos ficar rala no desktop ou apertada em 390 | Diferença decidida pela Q7; o `guardiao-visual` julga o equilíbrio e, se preciso, propõe uma coluna em 390 como melhoria a aprovar |
| Nenhum par de tokens existente dar o contraste das iniciais nas duas superfícies de cartão | Token novo, acrescentado, com origem; o par medido e nomeado no relatório (RP-09) |
| A regra das iniciais mudar de resultado se o nome do §4.1 ganhar outro tratamento ("Prof.", "Me.") | A regra tira toda palavra que termina em ponto, não uma lista fixa; o teste de unidade cobre os dois nomes de hoje e um com outro tratamento |
| O teste de texto ler o §4.1 errado, porque a linha mistura nome, cargo e formação com "—" e "." | Com a Q6 (b), as duas linhas têm a mesma forma: nome, "—", cargo até o primeiro ". ", formação. O qa imprime as três partes de cada docente; a demonstração 3 confere |
| O papel de lista acusado pelo lint como redundante | D7: desliga só na linha, com motivo; a regra do projeto não muda |
| 14 tarefas, com uma de folga | A divisão está na proposta: a `/equipe` sai inteira |
| `openspec validate` recusar o delta | O especificador não rodou o validador (sem terminal). O líder técnico roda antes do Portão 1 |

## Open Questions

**Todas decididas pelo Gabriel em 22/11/2026, no Portão 1.** O texto literal está no
`relatorio.md`, seção "Decisões do Gabriel no Portão 1", transcrito pelo líder técnico. As opções
ficam abaixo como registro.

| Qn | Decisão |
| --- | --- |
| Q1 | (b) |
| Q2 | (b) nas duas páginas |
| Q3 | (a) |
| Q4 | (a) |
| Q5 | (a) |
| Q6 | (b) |
| Q7 | **Nenhuma das três:** docentes com as iniciais no círculo; cargos sem círculo; os círculos voltam com nomes e fotos; contraste das iniciais medido e nomeado (D5, D6) |
| Q8 | (a) |
| Q9 | (a) nas duas; a frase da Equipe registrada no §4 como decisão do Gabriel de 22/11/2026 |
| Q10 | (a) |

Na origem: os caracteres foram contados à mão pelo especificador, e o teste de unidade confere.
Opção marcada **(fora do documento)** trazia texto que não estava no `conteudo-institucional.md`.

### Q1 — As duas constantes do nome da liga

O briefing diz que "viram um só"; a pendência registrada da Q20 (a) diz "nomes distintos". Os
valores diferem: o cabeçalho mostra "… Cuidados Paliativos · UnB"; o título da Início não tem
"· UnB".

- **(a)** Nomes distintos, como o registro da Q20: cada constante com o nome do que ela é (o nome
  no cabeçalho e o nome no título). Custo: o nome da liga continua escrito em dois lugares.
- **(b)** Uma constante só, sem "· UnB", e o cabeçalho acrescenta " · UnB" como sufixo próprio.
  Custo: nenhum na tela nem no título; é a leitura que concilia o briefing e a Q20.
- **(c)** Um valor só, literal. Custo: ou o cabeçalho perde "· UnB" (diferença contra o gabarito),
  ou o título da Início ganha "· UnB" (muda o SEO e a spec `seo`).
- **Recomendo (b)**, porque o nome fica num lugar só e nada muda na tela nem no título.

### Q2 — A faixa do topo do Sobre e da Equipe

Os textos da faixa não estão no documento: "A borboleta não é enfeite" e a frase da metamorfose
(Sobre), "Quem faz a LIACUP" e "Gestão 2026: diretoria, ligantes e duas professoras
orientadoras." (Equipe).

**Sobre:**

- **(a)** O protótipo: sobretítulo "Sobre a LIACUP", `h1` "A borboleta não é enfeite" e a frase,
  registrados no `conteudo-institucional.md` §2.1 pelo `especificador`; o §2.1 entra como segundo
  parágrafo da faixa. Custo: texto novo no documento, com fonte só no protótipo; a faixa fica com
  cerca do dobro da altura em 390.
- **(b)** `h1` "Sobre a LIACUP" (rótulo de interface, na `REFERENCIA-VISUAL.md` §7) e o §2.1 como
  parágrafo, sem a frase. Custo: some o título de identidade; diferença a classificar no lado a
  lado.

**Equipe:**

- **(a)** O protótipo inteiro, registrado no §4. Custo: a frase cita ligantes, que a página não
  mostra, e uma "Gestão 2026" sem nenhum nome.
- **(b)** Sobretítulo "Equipe" e `h1` "Quem faz a LIACUP", como rótulos de interface, sem a frase.
  Custo: uma linha a menos que o gabarito.
- **(c)** Só o `h1` "Equipe". Custo: a faixa perde o título do gabarito.
- **Recomendo (b) nas duas**, porque põem o §2.1 no lugar natural dele e não acrescentam ao
  documento texto que a página contradiz.

### Q3 — A forma de "O que a Liga se propõe a fazer"

O §2.3 (dois parágrafos), o §2.4, o §2.5 e o §2.6, inteiros. Composição comum às três: fundo de
superfície; em 1280, sobretítulo "Objetivos" e o `h2` na coluna da esquerda (cerca de um terço),
as linhas na da direita, com o filete de 1 px entre elas, como o gabarito; em 390, tudo empilhado.
Prints que o líder técnico gera, com o texto real do documento:
`prints/q3-opcao-a-390.png`, `q3-opcao-a-1280.png`, `q3-opcao-b-390.png`, `q3-opcao-b-1280.png`,
`q3-opcao-c-390.png` e `q3-opcao-c-1280.png`.

- **(a)** Quatro linhas numeradas 01 a 04, o número na letra e na cor do gabarito, à esquerda; à
  direita, o nome da seção do documento ("Objetivo geral", "Finalidade institucional", "Impacto
  social", "Protagonismo estudantil") em `h3` e, abaixo, os parágrafos. Custo: o número sugere
  sequência entre aspectos que não são passos.
- **(b)** As mesmas quatro linhas, sem número: o `h3` e os parágrafos ocupam a coluna inteira.
  Custo: mais longe do gabarito; diferença a classificar.
- **(c)** Cinco linhas numeradas 01 a 05, sem título, uma por parágrafo: 01 e 02 são os dois
  parágrafos do §2.3, 03 o §2.4, 04 o §2.5, 05 o §2.6. Custo: a 02 ("Todas essas metas…") não se
  sustenta sozinha, e sem título o leitor não distingue finalidade de impacto.
- **Recomendo (a)**, porque mantém a composição numerada e usa títulos que o próprio documento dá.

### Q4 — Títulos e sobretítulos das seções

Sobre: "Nossa história" / "Como a Liga começou", "Objetivos" / "O que a Liga se propõe a fazer",
"Orientação" / "Professores orientadores". Equipe: "Diretoria", "Docentes orientadores" e, pela Q8,
"Fundadores discentes" (título do §4.2).

- **(a)** Os do protótipo, registrados na `REFERENCIA-VISUAL.md` §7 como rótulos de interface,
  como a Q3 (a) da `pagina-processo-seletivo`. Custo: rótulos fora do documento.
- **(b)** Os do protótipo com concordância: "Professoras orientadoras" e "Docentes orientadoras".
  Custo: diferença contra o gabarito, e o rótulo muda se entrar um professor.
- **(c)** Os títulos do documento ("História", "Objetivo geral", "Fundadoras e orientadoras").
  Custo: "Objetivo geral" não cobre o bloco inteiro; sobretítulos somem.
- **Recomendo (a)**, pelo precedente da Q3 (a).

### Q5 — Docentes nas duas páginas ou numa só

- **(a)** Nas duas, como o protótipo, com o mesmo cartão e o mesmo dado. Custo: o mesmo texto em
  duas páginas.
- **(b)** Só na Equipe. Custo: o Sobre perde um bloco do gabarito.
- **(c)** Só no Sobre. Custo: a Equipe perde as orientadoras, contra a `REFERENCIA-VISUAL.md` §5
  ("Equipe … com docentes orientadores").
- **Recomendo (a)**, porque é a composição aprovada.

### Q6 — A linha de cargo da Kerolyn

O §4.1 dá "Orientadora Geral" à Mariana e nenhum cargo à Kerolyn; o título do §4.1 é "Fundadoras e
orientadoras"; o protótipo mostra "Orientadora".

- **(a)** Sem linha de cargo no cartão dela. Custo: cartões assimétricos.
- **(b)** "Orientadora", acrescentado à linha dela no §4.1 pelo `especificador`. Custo: muda uma
  linha do documento; apoiado pelo título do §4.1.
- **Recomendo (b)**, porque o documento já a chama de orientadora e os cartões ficam iguais.

### Q7 — O círculo da foto de docentes e cargos

**Decidida: nenhuma das três · Gabriel, 22/11/2026, Portão 1.** Docentes com as iniciais no
círculo; cargos sem círculo, porque não há pessoa para mostrar. A regra das iniciais e o contraste
estão no D6. Os prints opcionais abaixo não foram pedidos.

Igual nas duas páginas. Prints opcionais, se o Gabriel quiser ver antes:
`prints/q7-opcao-{a,b,c}-390.png`, da diretoria.

- **(a)** Borboleta da liga em opacidade baixa no círculo, decorativa, como o quadro do hero.
  Custo: oito borboletas na Equipe (seis cargos e dois docentes).
- **(b)** Iniciais nos docentes e borboleta nos cargos, que não têm pessoa. Custo: dois tratamentos
  na mesma página.
- **(c)** Sem círculo. Custo: a grade da diretoria perde o elemento que a compõe; diferença grande
  contra o gabarito.
- **Recomendo (a)**, porque segue a regra já decidida para o hero e vale para cargo sem pessoa.

### Q8 — Onde entram os fundadores discentes (§4.2)

- **(a)** Na Equipe, no lugar do bloco "Ligantes", com o título do §4.2 e os cinco nomes, sem
  círculo. Custo: composição nova sobre a área do protótipo, a aprovar no lado a lado.
- **(b)** No Sobre, depois da história. Custo: bloco novo numa página que não o tem.
- **(c)** Fora desta change. Custo: o PLANO §7 lista os fundadores nesta change.
- **Recomendo (a)**, porque o §4.2 é da seção Equipe e a área dos ligantes está livre.

### Q9 — Descrições de SEO do Sobre e da Equipe

O §2.1 é uma frase só, com cerca de 290 caracteres; não cabe em 160. O §4 não tem prosa.

**Sobre:**

- **(a)** A primeira frase do §2.4, inteira: "A LIACUP, sempre pautada em princípios éticos e
  humanitários, tem como objetivo o cuidado integral e o bem-estar no contexto dos Cuidados
  Paliativos.", **149** caracteres.
- **(b)** A primeira frase do §2.2, inteira: "A liga surge a partir do interesse de um grupo de
  discentes ao terem contato com o tema através de uma matéria ministrada pela professora Mariana
  Sodário.", **154**. Custo: fala da origem, não do que a liga é.

**Equipe** (nenhum trecho serve):

- **(a)** **(fora do documento)** "Diretoria, docentes orientadoras e fundadores da Liga Acadêmica
  Multiprofissional de Cuidados Paliativos (LIACUP).", **114** caracteres, registrada no §4 pelo
  `especificador`. Vale com a Q8 (a).
- **(b)** **(fora do documento)** "Diretoria e docentes orientadoras da Liga Acadêmica
  Multiprofissional de Cuidados Paliativos (LIACUP).", **102**. Para a Q8 (b) ou (c).
- **(c)** O Gabriel escreve outra, de 70 a 160 caracteres.
- **Recomendo (a) nas duas**, porque a do Sobre é frase aprovada inteira e a da Equipe descreve
  exatamente o que a página mostra.

### Q10 — A nota de fonte do §2.4

O §2.4 termina com "_(Estatuto, Art. 2º)_".

- **(a)** Fora da tela e fora da comparação do teste, pela regra da Q4 (a) da
  `pagina-processo-seletivo`. Custo: a exceção ao "palavra por palavra" passa a valer também aqui.
- **(b)** Na tela. Custo: anotação do documento no meio do texto da página.
- **Recomendo (a)**, pelo precedente.
