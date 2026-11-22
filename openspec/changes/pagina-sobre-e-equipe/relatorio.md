# Relatório — pagina-sobre-e-equipe

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/pagina-sobre-e-equipe/proposal.md`, `design.md`, `tasks.md`,
  `specs/pagina-sobre/spec.md`, `specs/pagina-equipe/spec.md`, `specs/navegacao-publica/spec.md`,
  `specs/publicacao-do-site/spec.md`, `specs/seo/spec.md` · 16 requisitos (10 ADDED, 5 MODIFIED,
  1 REMOVED), 52 cenários · 14 tarefas. Não divide.
- **Questões em aberto:** Q1 a Q10, no `design.md`, "Open Questions": Q1 nome da liga (rec. b);
  Q2 faixa do topo (rec. b nas duas); Q3 forma dos objetivos, com prints (rec. a); Q4 títulos de
  seção (rec. a); Q5 docentes nas duas páginas (rec. a); Q6 cargo da Kerolyn (rec. b); Q7 círculo
  da foto (rec. a); Q8 fundadores (rec. a); Q9 descrições de SEO (rec. a nas duas); Q10 nota de
  fonte do §2.4 (rec. a).
- **Achados fora do briefing:** a spec `publicacao-do-site` pede 404 para `/sobre` publicado, e
  fica falsa: muda nesta change, e ela está na lista do gatilho, então o guardião faz o checklist
  inteiro; o "Conheça a Liga" aparece sozinho no hero quando `/sobre` entra na lista.
- **Incompleto:** não rodei `openspec instructions` nem `openspec validate --strict` (sem
  terminal nesta passagem); o formato segue a change arquivada `pagina-processo-seletivo`. Os
  prints da Q3 não existem: o líder técnico os gera. As contagens de caracteres são à mão.
- **Rodada do Portão 1 (22/11/2026):** ajustes só pela Q7 (fora das três opções): nas specs
  `pagina-sobre` e `pagina-equipe`, o cenário do círculo virou dois ("As iniciais no círculo", com
  "MC" e "KG" pela regra do D6, e "O contraste das iniciais"), e os cartões de cargo ficam sem
  círculo; `design.md` D5, D6, D9 (oito demonstrações), D12, fontes, riscos e Open Questions
  decididas; `tasks.md` 1.3, 2.1, 2.2, 3.1, 4.1, 5.1, 5.2, 5.4 e 6.1; `proposal.md` com a tabela
  "Decisões do Portão 1". Continuam 14 tarefas, 16 requisitos; cenários 54 (eram 52).
  No `docs/conteudo-institucional.md`, com a autorização literal do Gabriel ("Autorizo as mudanças
  no conteudo-institucional.md (§4, §4.1 e §8) …"): §4, a descrição da Equipe; §4.1, "Orientadora"
  na linha da Kerolyn e uma nota de origem; §8, a linha "Nomes da diretoria atual" e o placar. 9
  linhas acrescentadas, 2 trocadas, nenhuma outra tocada.

## Decisões do Gabriel no Portão 1

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel de 22/11/2026.

> Portão 1 da pagina-sobre-e-equipe: aprovado. Registre cada decisão literal no relatorio.md.
>
> Q1 (b). Q2 (b) nas duas páginas. Q3 (a). Q4 (a). Q5 (a). Q6 (b). Q8 (a). Q10 (a).
> Q9 (a) nas duas: Sobre com a 1ª frase do §2.4; Equipe com "Diretoria, docentes orientadoras e fundadores da Liga Acadêmica Multiprofissional de Cuidados Paliativos (LIACUP).", registrada no §4 como decisão do Gabriel de 22/11/2026.
> Q7: nenhuma das três. Docentes com as iniciais no círculo; cargos sem círculo, porque não há pessoa para mostrar. Quando a liga mandar nomes e fotos, os círculos voltam. O contraste das iniciais é medido e nomeado (RP-09).
>
> Autorizo as mudanças no conteudo-institucional.md (§4, §4.1 e §8) e na REFERENCIA-VISUAL.md §7 que estas decisões pedem (tarefa 1.3).
>
> Pode rodar o /opsx:apply. No Portão 2, traga o lado a lado das duas páginas, do menu aberto em 390, do hero da inicial com o "Conheça a Liga" e do rodapé com a coluna Conteúdo.

**Desvio das specs escritas antes do portão:** a Q7 não seguiu nenhuma opção, e as specs estavam
escritas com a (a). O `especificador` ajusta as specs, o `design.md` e o `tasks.md` antes do apply.

## Decisões do Gabriel no Portão 2 (primeira passagem, antes do archive)

Registradas pelo líder técnico, com o texto literal da mensagem de 22/11/2026.

> Commit enviado. O Gabriel confirmou no painel da Vercel o host portal-liacup-git-feat-pagina-sobre-e-equipe-liacup1.vercel.app e o commit da prévia.
>
> Decisões do Gabriel (registre literal no relatorio.md): Q11 (a). Q12 (a). Q13 (b). Q14 (a). Q15 (a). Q16 (a), aprovar os 13 prints. Q17 (a). Q18 (a). Q19 (a).
> Q13, Q17 e Q18 entram numa rodada só de correção. Se algum agente pedir correção de novo depois dela, pare e traga ao Gabriel.
>
> Aviso para o relatório: a liga ainda vai responder sobre cargos, nomes da diretoria, ligantes e fotos. A página Equipe deve mudar numa change própria quando as respostas chegarem; nada a fazer nesta.
>
> Depois da rodada: o P23 e o P24 na prévia, a correção da spec da Q11, o archive e o Portão 2 final, com os comandos Git em blocos separados e a conferência do ambiente primeiro.

- **O que cada decisão aprovou:**
  - **Q11 (a):** o cenário da spec `pagina-equipe` passa a proibir "Tesouraria" só como título de
    cargo.
  - **Q12 (a):** os números 01 a 04 ficam em `--color-accent-700`.
  - **Q13 (b):** os fundadores ficam em 5 colunas no desktop.
  - **Q14 (a):** o passo de 44 px das colunas de links do rodapé acima de 768 px vai para a
    REFERENCIA §7.
  - **Q15 (a):** o comentário da regra do degrau ganha a exceção de posição e dimensão medidas.
  - **Q16 (a):** os 13 prints viram "Ativo aprovado" na §7 do `SEGURANCA.md`.
  - **Q17 (a)** e **Q18 (a):** a forma dos testes e as 9 demonstrações do RP-12 entram na mesma
    rodada.
  - **Q19 (a):** "dois deles são fotos" no §8.
- **Commit da prévia confirmado:** o `HEAD` da branch no momento da confirmação era `6070334`
  ("feat: entrega as páginas Sobre e Equipe"), igual ao `ls-remote`.
- **Aviso da liga:** cargos, nomes da diretoria, ligantes e fotos ainda dependem da resposta da
  liga. A página Equipe muda numa change própria quando as respostas chegarem; nada a fazer nesta.

## dev-frontend

Tarefas 1.1, 2.1, 2.2, 3.1 e 4.1 (22/11/2026).

- **Arquivos (só `src/`):** A 37 · M 14 · D 4. Novos: rotas `sobre/` e `equipe/` (`page.tsx` e
  `page.module.css`); `features/sobre/` (tipos, conteúdo, regras, teste, `FaixaDoSobre`,
  `HistoriaDaLiga`, `ObjetivosDaLiga`); `features/equipe/` (tipos, conteúdo, regras com
  `iniciaisDoNome`, teste, `FaixaDaEquipe`, `CartoesDaDiretoria`, `FundadoresDiscentes`,
  `ListaDeDocentes`, `CirculoDeIniciais`, `TituloDoBloco`); `padroes/TituloDeSecao` e
  `padroes/QuadroSemFoto`; `ui/BorboletaDaLiga` (com teste). Apagados: a borboleta de `_inicio/` e o
  `TituloDeSecao` do processo seletivo. Maior componente: 67 linhas. **Fora da lista do D12:**
  `src/lib/utils/metadados.test.ts`, que usava `/sobre` como página inexistente (troquei por
  `/endereco-que-nao-existe`).
- **Tokens novos:** 27 (eram 29 antes da correção do revisor), em 47 linhas acrescentadas e 0 removidas no `tokens.css`, cada um com a origem
  medida no protótipo (Chromium, 1280 e 390 px).
- **Contraste (RP-09):**
  - faixa do Sobre sobre `--color-accent-800` #4e3260: título `--color-bg` 9,05:1, texto
    `--color-accent-200` 8,52:1;
  - iniciais `--color-accent-800`, 25 px (`--font-size-h3`, texto grande), sobre o fundo do círculo
    (`--color-quadro-sem-foto`, 8% de cinza): no Sobre, cartão `--color-surface` e fundo #e2d5bf,
    7,44:1; na Equipe, cartão `--color-bg` e fundo #ece1d1, 8,34:1;
  - número 01–04 em `--color-accent-700` sobre `--color-surface`, 6,15:1. O lilás do protótipo mede
    3,09:1, com 20 px; o `--color-accent-600` mede 4,30:1.
- **Comandos:**
  - `verificar` 0;
  - `npm test` 0, 340 de 340, com `Sobre · itens: 4 · parágrafos: 5`, `Equipe · cargos: 6 ·
    fundadores: 5 · docentes: 2` e `Equipe · iniciais: MC, KG`;
  - `build` 0;
  - `curl` na 3000: `/sobre` e `/equipe` 200, 1 `h1` cada, títulos certos; iniciais `MC` e `KG`
    em `aria-hidden="true"`; os 6 cargos e os 5 fundadores na ordem; nada de `img`, `svg` nem
    círculo nos cartões de cargo; "Conheça a Liga" leva a `/sobre`;
  - `curl` na 3001: os dois endereços dão 307 para `/`;
  - nome do cabeçalho, nome acessível e título da Início iguais aos do `HEAD`;
  - `playwright` 1: 315 passam e 7 falham. É um teste só, nas 7 larguras:
    `interruptor.spec.ts:296` espera 404 em `/sobre` publicado e recebe 200. Ficou falso pela
    spec `publicacao-do-site`, e quem o corrige é o qa. O axe dá 0 e não há rolagem horizontal nas
    4 páginas.
- **Para o líder técnico:**
  - (1) **Contagem da 1.1:** 11 `list-style: none` e 10 `role="list"`. O 11º é o `summary` das
    perguntas, que não é lista. As perguntas passaram a ficar numa `ul`, porque a proposta as conta
    entre as seis listas. Os comentários não repetem os dois termos, então a contagem só mede
    código. O lint acusa o papel redundante, como o D7 previa (medido), e é desligado só na
    linha, em 10 lugares.
  - (2) **Tarefa 4.1 contra o documento:** "Tesouraria" aparece 1 vez no texto visível de `/equipe`,
    porque é a linha do §4.3 do Diretor(a) financeiro(a). O `grep -c` cru de "semestre" dá 1, mas
    vem do JSON da lista no `<script>` (a descrição do Processo seletivo, que já existe em toda
    página). No texto visível, dá 0.
  - (3) **Variante renomeada:** a variante do título que era `perguntas` virou `grande`. A linha
    mudou em `PerguntasFrequentes.tsx`, e a tela não muda.
- **Melhorias de UI ou UX propostas** (não aplicadas):
  - os fundadores em 5 colunas no desktop, e não 6: com 6, sobra uma coluna vazia à direita;
  - o número dos objetivos em `--color-accent-700`, ainda a aprovar como diferença do gabarito,
    pelo motivo do contraste acima.
- **Incompleto:**
  - não medi o contraste das iniciais em pixel renderizado: o valor vem da conta da cor composta;
  - não gerei lado a lado (é do `guardiao-visual`);
  - não mexi no README, porque a seção de páginas já usa `/sobre` como exemplo.
- **Correção depois do guardiao-visual:**
  - arquivo: `src/componentes/layout/RodapePublico.module.css`;
  - diff: `.itens` passa de `gap: var(--space-2)` para `gap: 0`, e o `gap: var(--space-2)` volta
    só até 768 px, mantendo `.itensDeContato` em 0. Tem um comentário com o alvo de toque e o §7.
    Nenhum token novo;
  - passo medido no DOM entre os dois links da coluna Portal, publicado: 44,0 px em 1024 e em 1280;
    52,8 px em 390 e em 768, como antes. O passo do contato fica em 44,0 em todas;
  - `verificar` 0; `npm test` 0, 340 de 340; `build` 0; `playwright` 0, 406 passam e 0 falham.
    Os servidores foram derrubados.
- **Correção depois do revisor:**
  - (1) `ObjetivosDaLiga.module.css`: o comentário da cor do número passa a dizer "melhoria a
    aprovar pelo Gabriel no Portão 2, pelo contraste". A cor não muda;
  - (2) `tokens.css`: saem `--espaco-depois-do-titulo-da-equipe` e `--espaco-vertical-do-objetivo`.
    No lugar deles, os componentes usam somas de degrau, com a origem no comentário:
    `calc(var(--space-8) + var(--space-1))` no `FaixaDaEquipe.module.css` (medido: 39,6 px; eram
    40) e `calc(var(--space-2) + var(--space-3))` no `ObjetivosDaLiga.module.css` (medido: 22 px;
    eram 20). Tokens novos: de 29 para 27. `git diff --numstat` dá 47 acrescentadas e 0
    removidas. O `grep` dos dois nomes em `src` dá 0;
  - (3) `sobre/page.tsx` e `equipe/page.tsx`: sem docente, o bloco inteiro some, título incluído;
  - (4) `RodapePublico.module.css`: o comentário cita a §3 (alvo de toque) e a §7 como precedente.
    O CSS não muda;
  - `verificar` 0; `npm test` 0, 340 de 340; `build` 0; `playwright` 0, 406 passam e 0 falham.
    Os servidores foram derrubados.
- **Correção do Portão 2:**
  - Q13 (b), em `FundadoresDiscentes.module.css`: a grade passa de `repeat(6, …)` para
    `repeat(5, …)` acima de 1024 px. A origem vai no comentário, e não há token novo.
    - Medido no publicado, em 1280: 5 colunas e 1 linha, com 0,0 px à direita do último nome.
    - Em 1024 e 390: 2 colunas e 3 linhas, como antes;
  - Q15 (a), em `tokens.css`: o comentário do cabeçalho do bloco desta change ganha a regra do
    degrau para `padding`, `margin` e `gap`. Posição e dimensão medidas ficam como token, como
    os `--borboleta-1-*`. Nenhum valor muda.
    - Contra a `main`, `git diff --numstat` dá 50 acrescentadas e 0 removidas.
    - Contra o `HEAD` `6070334`, dá 4 e 1: a linha que fechava o comentário foi trocada;
  - comandos:
    - `verificar` 0;
    - `npm test` 0, 340 de 340;
    - `build` 0;
    - `playwright` 0, 406 passam e 0 falham. Nenhum e2e acusou as 5 colunas.

    Os servidores foram derrubados.

## dev-dados

- **Migrações:** `<números>` · **tabelas:** `<nomes>`
- **Acesso por linha:** `banco:rls` <código> · políticas: <n permissões, n recusas>
- **Tipos:** `banco:tipos:check` <código>
- **Incompleto:** <o que, ou "nada">

## guardiao-visual

Tarefa 6.1 (22/11/2026). `npm run build` código 0; `iniciar-servidor.mjs` publicado 3000 e não
publicado 3001, derrubados no fim (portas livres); Chromium do Playwright, escala 1, 390 × 844 e
1280 × 800, página inteira, 3 s depois das fontes; medidas no DOM do site e do protótipo aberto no
Chromium; montagem e contagem de pixels em canvas, por script no scratchpad, fora do repositório.

- **Comparado:** 2 páginas (`/sobre`, `/equipe`) × 390 e 1280; Início (cabeçalho e hero) × 390 e
  1280; menu aberto em 390, sobre `/sobre`; rodapé de `/equipe` × 390 e 1280 (o de `/sobre` está no
  lado a lado inteiro) · **11 PNG** em `prints/`: 9 `lado-a-lado-*` e 2 `raiz-nao-publicada-*`.
  Os `q3-opcao-*` ficaram intactos. Nenhuma rolagem horizontal nas 8 capturas
- **Raiz não publicada:** **0 de 329.160** (390) e **0 de 1.024.000** (1280) pixels diferentes
  contra os `raiz-nao-publicada-*` arquivados da `pagina-processo-seletivo`
- **Inicial contra o print arquivado do site:** cabeçalho 390 com 0 de 24.180 pixels diferentes;
  em 1280, só os destinos novos (x 131 a 232, y 89 a 101). Hero: só o "Conheça a Liga"
  (x 237 a 403, y 616 a 661 em 1280) e a borboleta do canto, com no máximo 4 níveis de cor de
  diferença (invisível). Botão: 167,2 × 46,4, igual ao "Quero participar"; a diferença 20 da
  change anterior ("sem Conheça a Liga") **sumiu**
- **Diretoria em 390 (D5): equilibrada.** As linhas pareiam: títulos de 1/1, 2/2 e 2/2 linhas e
  textos de 4/4, 3/3 e 3/3 linhas (80,6; 60,4; 60,4 px), colunas de 170,8 px, vão 13,2. Não
  proponho uma coluna. Em 1280, a 2ª linha usa 2 das 4 colunas e deixa a metade direita vazia;
  consequência dos seis cargos na grade de 4 do gabarito. Se o Gabriel quiser 3 + 3, é Qn
- **Fundadores (Q8 (a)):** 15,5 px, a letra dos nomes do gabarito. Em 1280, grade de 6 colunas de
  181,7 com 5 nomes, todos em 2 linhas menos o "Eloah Pires de Almeida": a 6ª coluna (x 1056 a
  1240) fica vazia, e o bloco pesa à esquerda. **Concordo com as 5 colunas do dev**: preenchem a
  largura. Em 390, 2 colunas, e o 5º nome fica sozinho à esquerda
- **Diferenças: 25** — 4 adaptação aprovada · 18 decisão do Gabriel · 2 melhoria a aprovar ·
  **1 defeito**
  1. cabeçalho 1280 · 125,2 contra 114,4 px · adaptação (§3, alvo de toque), da change anterior
  2. cabeçalho 1280 · só Início, Sobre e Equipe, sem "Painel" · decisão (páginas que existem; §4, R3)
  3. destaque, "Quero participar" e botões · `#82558f` e não o lilás · adaptação (§3, ADR-0003)
  4. página atual sublinhada no cabeçalho, no menu e, novo, no rodapé ("Sobre" e "Equipe") ·
     adaptação (§3 e ADR-0006, estado "página atual"); o rodapé do gabarito não marca nada
  5. botões de menu, de fechar e "Conheça a Liga" · borda mais escura · adaptação (ADR-0003)
  6. menu aberto · Início, Sobre (barra e sublinhado) e Equipe, mais o destaque; o gabarito tem 10
     destinos, sobre Contato · decisão (páginas que existem)
  7. hero · borboleta no quadro e lema em `#82558f` · decisão (§7)
  8. rodapé · Portal só Início e Sobre; Conteúdo só Equipe · decisão (páginas que existem)
  9. rodapé · e-mail e endereço certos · decisão (§6, §7)
  10. rodapé · ícones, "liacup.unb" sem @, passo de 44 no contato · decisão (§7)
  11. rodapé · linha final centralizada, sem o texto do protótipo · decisão (§7)
  12. rodapé 390 · sem "Painel da diretoria" · decisão (§4, R3)
  13. **rodapé 1280 · passo dos links de Portal 52,8 px contra 31,4 do gabarito** (alvo de 44
      mais 8,8 de vão; `.lista` com `gap: var(--space-2)`); em 390 o passo é 52,8 contra 53, igual.
      O alvo de 44 explica 44; os 8,8 a mais não têm registro, e a coluna de contato ao lado usa 44
      sem vão pela regra do §7 · **defeito**. Ficou visível agora, com o 2º link na coluna
  14. faixa do Sobre · sem sobretítulo, `h1` "Sobre a LIACUP" (64 e 29 px, como o gabarito) e o §2.1
      como parágrafo; faixa de 341,7 contra 313 px (1280) · decisão (§7, Q2 (b))
  15. história · §2.2 em parágrafo, sem o cartão "Pendente" · decisão (Portão 1, D4)
  16. quadro da história · borboleta, sem tracejado nem legenda; medida no print igual, cerca
      de 543 × 377 em 1280 · decisão (Portão 1, D4, regra do hero do §7)
  17. objetivos · 4 itens com `h3` e texto inteiro, contra 5 linhas curtas; página de 2739 contra
      2255 px (1280) e 4658 contra 3846 (390) · decisão (Q3 (a), Q10 (a))
  18. **números 01 a 04 · `#683f74` (`--color-accent-700`) e não `#9b6aaf`**, mesma letra de 20 px
      · **melhoria a aprovar**. Recomendo aprovar: o lilás mede 3,09:1 e o número fica visível
      (ele é `aria-hidden`, mas continua texto visível); o roxo dá 6,15:1 e mantém o tom. Não
      está na tabela do §3
  19. círculo dos docentes, nas duas páginas · iniciais "MC" e "KG" em 25 px, 74 × 74, fundo
      liso, sem tracejado nem "Foto" · decisão (§7, Q7)
  20. docente · "Kerolyn Ramos Garcia", nas duas páginas · decisão (§6)
  21. docentes · "Orientadora Geral" e "Saúde Coletiva, pós-doutora", do §4.1 · decisão (Portão 1,
      fontes do texto e Q6 (b))
  22. faixa da Equipe · sem a frase "Gestão 2026: …" · decisão (§7, Q2 (b))
  23. diretoria · 6 cargos do §4.3, contra 8 pessoas · decisão (§6)
  24. diretoria · sem círculo; cargo em `h3` 18 px e linha do §4.3 em 13 px, `#683f74`,
      centralizados; 4 colunas em 1280 e 2 em 390, como o gabarito · decisão (§7, Q7)
  25. fundadores · bloco novo no lugar de "Ligantes", só os nomes, sem círculo nem frase ·
      **melhoria a aprovar** (Q8 (a)); as 5 colunas do dev seriam um ajuste dela
- **Não comparado:** nada. Incompleto: contraste em pixel renderizado (as cores são do estilo
  calculado); a borda dos botões e o sublinhado do rodapé não foram medidos à parte
- **Segunda passagem, rodapé:** depois da correção do dev em `RodapePublico.module.css`.
  `npm run build` saiu com 0; o site rodou publicado na 3000, derrubado no fim. Refiz
  `lado-a-lado-rodape-{390,1280}.png` com os mesmos scripts; os outros PNG não mudaram. Passo dos
  links do Portal: **44,0** em 1280 (Início em y 1199,1 e Sobre em 1243,1), igual ao da coluna de
  contato, e **52,8** em 390, como antes (gabarito: 31,4 e 53). Contra as capturas da primeira
  passagem: `/equipe` e `/sobre` em 390 têm 0 pixels diferentes; em 1280, só o link "Sobre" do
  rodapé muda (464 pixels em `/equipe` e 488 em `/sobre`, x 455 a 492), e a altura das páginas
  continua a mesma. **Diferença 13: deixa de ser defeito.** O passo de 44 contra 31,4 é o alvo de
  toque, sem vão a mais · adaptação (§3, alvo de toque; mesma forma da regra do contato no §7).
  **Total: 25**, sendo 5 adaptação aprovada, 18 decisão do Gabriel, 2 melhoria a aprovar e
  **0 defeito**
- **Terceira passagem, Sobre e Equipe:** depois da troca de dois espaços por somas de degrau.
  `npm run build` saiu com 0; o site rodou publicado na 3000, derrubado no fim. Refiz
  `lado-a-lado-sobre-{390,1280}.png` e `lado-a-lado-equipe-{390,1280}.png` com os mesmos scripts;
  os outros PNG não mudaram. Comparei com as capturas da segunda passagem, pixel a pixel e no DOM:
  - **Equipe:** a altura continua 2329 (390) e 1457 (1280). Tudo abaixo do título sobe **0,4 px**
    (Diretoria em y 220,1 → 219,7 e 313,8 → 313,4; o rodapé igual). Pixels mudam da linha 277 (390)
    e 317 (1280) até o rodapé, só pelo antisserrilhado do meio pixel; não se vê na tela
  - **Sobre:** cada objetivo ganha 2 px em cima e 2 embaixo. Os `h3` descem 2, 6, 10 e 14 px, e os
    docentes e o rodapé descem 16 (390: Professores orientadores em y 3324,1 → 3340,1; 1280: 2098,1
    → 2114,1). A página vai de 4658 para **4674** (390) e de 2739 para **2755** (1280). Até o começo
    dos objetivos (linha 1498 em 390, 1091 em 1280), 0 pixels diferentes. Do fim deles para baixo,
    deslocado 16 px: 0 em 390 e 4 em 1280 (máximo de 6 níveis de cor, no ícone do contato,
    invisível)
  - **Vereditos:** nenhuma das 25 diferenças muda. A 17 só atualiza a altura (2755 contra 2255 e
    4674 contra 3846). Total: 25, sendo 5 adaptação aprovada, 18 decisão do Gabriel, 2 melhoria a
    aprovar e **0 defeito**. O bloco de docentes vazio não aparece hoje e não foi comparado
- **Quarta passagem, Processo seletivo** (achado 3 do revisor): `npm run build` saiu com 0; o site
  rodou publicado na 3000, derrubado no fim. Capturei `/processo-seletivo` em 390 e 1280 e comparei
  com a coluna do site em `archive/2026-11-21-pagina-processo-seletivo/prints/lado-a-lado-processo-seletivo-*.png`,
  recortada em x 453 e x 1343, y 63, alinhamento conferido com 0 pixels no cabeçalho em 390. Gerei
  `lado-a-lado-processo-seletivo-{390,1280}.png`, gabarito contra site, como na change anterior.
  - **Mudanças de estrutura desta change** (perguntas em `ul`/`li`, `TituloDeSecao` em
    `componentes/padroes/`, `role="list"`): **0 pixels diferentes** no `main`, de 943.410 em 390
    (y 62 a 2481) e de 2.342.400 em 1280 (y 125 a 1955). A tela não mudou
  - **Cabeçalho:** 0 de 24.180 em 390. Em 1280, 527 de 160.000, só em x 131 a 232 e y 89 a 101,
    que são os destinos Sobre e Equipe · decisão (diferença 2, páginas que existem)
  - **Rodapé 390:** igual até y 2776 (marca, texto e "Portal"/Início). Dali para baixo, 8.337
    pixels diferentes até y 3054, porque entraram o link Sobre (passo de 52,8, como o gabarito) e a
    coluna Conteúdo com Equipe. A página vai de 3055 para 3219 · decisão (diferença 8, páginas que
    existem)
  - **Rodapé 1280:** 965 de 440.320, em x 456 a 805 e y 2014 a 2111, que são o link Sobre no passo
    de 44 e a coluna Conteúdo. A altura continua 2299 · decisão (diferença 8) e adaptação
    (diferença 13, alvo de toque)
  - **Total desta comparação:** 8.337 pixels em 390 e 1.492 em 1280, todos no cabeçalho e no
    rodapé. Nenhum vem da troca de estrutura. Não há diferença nova, e as 25 mantêm o veredito
    (0 defeito)
- **Quinta passagem, Portão 2:** depois da Q13 (b). `npm run build` saiu com 0; o site rodou
  publicado na 3000, derrubado no fim. Refiz `lado-a-lado-equipe-{390,1280}.png` com os mesmos
  scripts; os outros PNG não mudaram. Contra a terceira passagem, pixel a pixel:
  - `/equipe` em 390: **0** de 908.310 pixels diferentes
  - `/equipe` em 1280: **13.724** de 1.864.960, só em x 49 a 1232 e y 731 a 766, a linha dos nomes
    dos fundadores. A grade passa de 6 colunas de 181,7 px a **5 de 222,4**, com vão de 22. A
    largura fica preenchida, sem coluna vazia. Três nomes cabem numa linha e dois ficam em duas
    ("Ágata Heloisa Pereira da Conceição" e "Carlos Gabriel Moreira Novais"). A altura da linha
    (34,7) e a da página (1457) não mudam
  - `/sobre`, conferido junto: 0 pixels diferentes em 390 e em 1280
  - **Vereditos novos:** a 13 (passo de 44 no rodapé) passa a decisão do Gabriel, pela Q14 (a); a
    18 (números 01 a 04 em `--color-accent-700`), pela Q12 (a); e a 25 (fundadores, agora em 5
    colunas), pela Q13 (b). **Total: 25**, sendo 4 adaptação aprovada, 21 decisão do Gabriel,
    0 melhoria a aprovar e **0 defeito**

## qa-acessibilidade

Tarefas 5.1 a 5.4 (22/11/2026). Novos: `tests/e2e/sobre.spec.ts`, `equipe.spec.ts`,
`listas-anunciadas.spec.ts` e `sobre-e-equipe.ts` (apoio). Ajustados: `interruptor`,
`paginas-publicas` e `pagina-inicial`. `npx playwright test` 0, **406 de 406**, com build novo;
`lint`, `formatar:check`, `tsc` e `npm test` (340 de 340) com 0; `playwright.config.ts` sem diff.

- **Cobertura:** 4 páginas da lista (`/`, `/sobre`, `/equipe`, `/processo-seletivo`) × 7 larguras,
  publicado; raiz não publicada × 7; interruptor nos dois modos. Texto lido do documento: Sobre
  15 trechos (§2.1 1 · §2.2 1 · §2.3 2 · §2.4 1 · §2.5 1 · §2.6 1 parágrafos; 4 itens; nota
  "(Estatuto, Art. 2º)" tirada) mais 8 rótulos; Equipe 21 trechos (`cargos: 6 · fundadores: 5 ·
  docentes: 2`) mais 10 rótulos; texto fora do documento: 0 caracteres nas duas.
- **Medições:** axe 0 violações (4 páginas × 7, e `/sobre` e `/equipe` à parte) · rolagem horizontal
  0 de 28 medidas · alvos 63 medidos por largura até 1024 (51 em 1280) / 0 abaixo de 44 px · foco 43
  por largura (51 em 1280) / 0 sem foco visível · `páginas verificadas: 4 de 4` · `rotas
  verificadas: 4` nos dois modos, `/sobre` 200 e `/endereco-que-nao-existe` 404 no publicado ·
  listas sem marcador: `/` 4, `/sobre` 6, `/processo-seletivo` 7, `/equipe` 7, todas com
  `role="list"` · `iniciais: MC, KG` (fora da árvore de acessibilidade, lida pelo CDP), 74 × 74
  px; contraste `--color-accent-800` a 25 px (texto grande) sobre `rgba(127,127,127,0.08)`: Sobre,
  cartão `--color-surface` #ebddc5, 7,47:1; Equipe, cartão `--color-bg` #f5ead8, 8,36:1 ·
  `círculos nos cargos: 0` em 6 cartões; grade 2 colunas até 1024 e 4 em 1280 · quadro da história
  ao lado em 1280 e abaixo em 390; 0 decorações por cima de texto.
- **Demonstrações RP-12** (vermelho em 390 px, build novo; verde na rodada final):
  1. "matéria" → "disciplina" no §2.2: `trecho "§2.2, história" difere`, esperado e recebido · verde.
  2. Sem o Diretor(a) financeiro(a): unidade `5 cargos; a seção 4.3 tem 6`; e2e `§4.3, cargo 3`
     esperado "Diretor(a) financeiro(a)", recebido "Secretário(a)-Geral", e `5 cargos` · verde.
  3. "Kerolyn Ramos": `§4.1, docente 2, nome` esperado e recebido, `"Kerolyn Ramos" sem "Garcia":
     1` e iniciais "KR" · verde.
  4. Fundadores sem `role="list"`: `/equipe: lista sem marcador e sem role="list": <ul> ... em
     "Fundadores discentes"` · verde.
  5. Descrição do Sobre com 161: `descrição com 161 caracteres no endereço "/sobre"` · verde.
  6. Segundo `h1` em `/equipe`: `/equipe: 2 títulos de nível 1 ... "Quem faz a LIACUP" e
     "Diretoria"` · verde.
  7. Regra com a segunda palavra: unidade `expected 'KR' to be 'KG'` (o nome só aparece na linha
     de código citada) e `MS, KR`; e2e `iniciais "MC"/"KG" não aparecem` · verde.
  8. Círculo sem `aria-hidden`: `iniciais na árvore de acessibilidade: MC (papel StaticText)`, em
     `/sobre` e `/equipe` · verde.
  - Fora do D9: contraste (cor `--color-surface`): `contraste abaixo de 3:1 · ... 1.08:1`; círculo
    num cartão de cargo: `cartão "Presidente": <div> redondo 74 px`; rótulo "Sobre DEMO-RP12": o
    teste novo "nesta entrega" ficou vermelho, e o dinâmico do menu, verde · verde.
  - Depois: `sha256sum -c` OK nos 9 arquivos; `git grep -c DEMO-RP12 -- src` e o mesmo com
    `--untracked` dão 1; `git status --porcelain` igual ao de antes.
- **Defeitos em `src/`:** nenhum.
- **Achados para o líder técnico:**
  - **Q11:** o cenário "O que o protótipo tinha e a página não tem", da `pagina-equipe`, lido ao pé
    da letra, contradiz o documento: proíbe "Tesouraria", que está na linha do §4.3. O teste confere
    a intenção (nenhum título é cargo de exemplo, lidos do protótipo), com comentário. Spec não
    editada.
  - **Tarefa 5.4:** `git grep -c DEMO-RP12` sem caminho sai 0 sempre (o `tasks.md`, relatórios
    arquivados e `tests/barreiras/` citam a marca). Sem `--untracked`, ele não vê os arquivos novos
    de `src/`: na demonstração 1 não achou a marca em `features/sobre/conteudo.ts`. A forma que
    mede é `git grep --untracked -c DEMO-RP12 -- src`.
- **Sem cobertura:** Safari e VoiceOver de verdade (o projeto só tem Chromium: mede-se o
  atributo, não o anúncio); contraste em pixel renderizado (é estilo calculado e composto). Os
  termos proibidos da Equipe, fora "Diretoria de comunicação", não foram vistos falhando um a um.
- **Segunda passagem, RP-12** (ressalva 6 do `revisor`; `src/` com as mudanças do dev):
  1. `/sobre` com 404 no publicado. Tirá-la da lista não serve: `npm run build` sai 1 (`O endereço
     "/sobre" não está na lista`), e nada roda. Usei `notFound()` temporário na página: vermelho
     `publicado: /sobre recebeu 404, Location ausente (esperado 200 sem Location)`, nos testes das
     quatro rotas e da primeira resposta · verde.
  2. "Conheça a Liga" tirado do hero: vermelho `"Conheça a Liga" ausente com /sobre na lista` (a
     conferência que já existia no teste; a linha nova dos dois botões só dispara com `/sobre`
     fora da lista, o que a compilação já barra) · verde.
  - Depois: `sha256sum -c` OK nos 3 arquivos; `git status --porcelain` igual ao de antes.
    `git grep --untracked -c DEMO-RP12 -- src tests` sai 0, porque `tests/barreiras/` cita a marca
    de propósito; `-- src tests/e2e` sai 1. `npm run build` 0 e `npx playwright test` 0, 406 de
    406. Servidores derrubados.
- **Terceira passagem** (achado 1 do `revisor`; só `tests/e2e/equipe.spec.ts`):
  - Os cargos de exemplo do protótipo voltam à busca no texto visível inteiro, menos os que
    aparecem numa linha do §4.3, calculados pelo teste. São 7 procurados (Presidência,
    Vice-presidência e os cinco da spec), e "Tesouraria" fica só nos títulos (Q11), por estar na
    linha do Diretor(a) financeiro(a). A busca diferencia maiúscula, então o "presidência" do
    §4.3 não colide.
  - RP-12: "Diretoria de comunicação" num `<p>` de `/equipe` deu vermelho `a página mostra:
    Diretoria de comunicação` · verde.
  - Depois: `sha256sum -c` OK; `git grep --untracked -c DEMO-RP12 -- src tests/e2e` sai 1;
    `git status` igual ao de antes; `npm run build` 0; `npx playwright test` 0, 406 de 406.
    Servidores derrubados.
- **Passagem do Portão 2** (Q13 (b), Q17 (a), Q18 (a)):
  - **Q17 (a):** a quebra de linha literal do `equipe.spec.ts` virou `\n`. Os nomes de uma ou duas
    letras viraram nomes descritivos no `sobre-e-equipe.ts`, no `sobre.spec.ts` e também no
    `equipe.spec.ts`; os campos `h1` e `h1s` viraram `tituloPrincipal` e `titulosPrincipais`.
    Conferido pela árvore do compilador do TypeScript, e não só por `grep`: sobra só `id`, a
    propriedade da violação do axe. Os 58 títulos de teste não mudaram.
  - **Fundadores (Q13 (b)):** teste novo. Mede 5 colunas numa linha só em 1280 e 2 colunas em 3
    linhas de 360 a 1024, nas 7 larguras.
  - **RP-12** (vermelho, depois verde; 3 compilações, cada violação no seu teste):
    1. Ordem do menu (`/equipe` antes de `/sobre` no JSON): `expected [ 'Início', 'Equipe',
       'Sobre' ] to deeply equal [ 'Início', 'Sobre', 'Equipe' ]`.
    2. Descrições contra o documento, com uma frase literal de outra seção, para passar da
       conferência `fora`: `a da "/sobre" é a 1ª frase do §2.4` e `a da "/equipe" é a citação do
       §4` (`citacaoDaSecaoDeNivel2`).
    3. `BorboletaDaLiga.test.tsx`: `aria-hidden="false"` dá `expected 'false' to be 'true'`; sem a
       classe de quem usa, `to include 'de-quem-usa'`.
    4. Posição do quadro: `em 1280 px o quadro não está ao lado do texto` e `em 390 px o quadro não
       está abaixo do texto`.
    5. Colunas: `a grade tem 3 colunas em 1280 px, e não 4`; `a grade dos fundadores tem 4 colunas
       em 1280 px, e não 5` e `ocupam 2 linhas`.
    6. Fundadores só com o nome: `fundador 1 tem mais que o nome` (os 5).
    7. Decoração por cima de texto: `borboleta ... sobre "Sobre a LIACUP"`.
    8. Imagens: `imagem no conteúdo, e a liga não mandou foto`, em `/sobre` e `/equipe`.
    9. Termos proibidos do Sobre: `a página mostra: Pendente | (Estatuto, Art. 2º) | Estatuto`.
    10. `pagina-inicial.spec.ts`, "nesta entrega os dois botões": é alcançável, e fica. Ela dispara
        quando a página e a entrada do Sobre saem juntas, e a compilação passa assim. Vermelho
        com "Conheça a Liga" faltando. São remoções, então não há linha para a marca; a volta
        está no `sha256sum -c`.
  - Nos itens 1 e 2, o JSON não aceita comentário, e a marca foi como chave `"DEMO-RP12": true`.
  - Depois: `sha256sum -c` OK nos 10 arquivos; `git grep --untracked -c DEMO-RP12 -- src
    tests/e2e` sai 1; `git status --porcelain` igual ao de antes.
  - Rodada final:
    - `npm run lint` 0;
    - `npm run formatar:check` 0;
    - `npx tsc --noEmit` 0;
    - `npm test` 0, 340 de 340;
    - `npm run build` 0;
    - `npx playwright test` 0, **413 de 413**.
  - Servidores derrubados.

## revisor

O revisor não escreve: o líder técnico registra.

**Primeira passagem (22/11):**

- **Veredito:** aprovado com ressalva. Nada bloqueia.
- **Conferiu:** 72 dos 83 arquivos, 7 critérios de aceite e 21 regras.
- **Achados:**
  1. `tests/e2e/equipe.spec.ts` confere a intenção do cenário da "Tesouraria", e não a letra. É a
     Q11, para o Gabriel; o revisor concorda que a spec precisa ser corrigida antes do archive.
  2. O `RodapePublico.module.css` mudou o passo das colunas, fora do D12, com o comentário citando a
     §7 em vez da §3. Vai como desvio na entrega; o comentário foi corrigido.
  3. O comentário da cor do número em `ObjetivosDaLiga.module.css` dizia "adaptação", e ela é
     melhoria a aprovar. Corrigido.
  4. Dois tokens novos contrariavam a regra do degrau do próprio `tokens.css`. Foram apagados e
     trocados por somas de degrau.
  5. Checkboxes do `tasks.md` em branco. O líder técnico marca antes do archive.
  6. Verificações novas não vistas falhando (RP-12). O interruptor e o hero foram demonstrados na
     segunda passagem do qa; colunas da grade, posição do quadro e termos proibidos ficam
     declarados.
  7. "Três deles são fotos", no §8, com duas linhas de fotos. O erro é anterior; mexer no texto
     exige o Gabriel.
  8. O texto da 11.2 e da 11.3 não está transcrito no relatório nem no D10, e as duas seções não
     têm linha de aprovação. Informativo.
  9. O título do bloco de docentes ficava sozinho na tela com a lista vazia. Corrigido: o bloco
     inteiro some.
- **Não conseguiu conferir:** se a 11.2 e a 11.3 batem com o briefing, que não está no
  repositório; os PNG; nenhum comando rodado; o P23; Safari e VoiceOver de verdade.

**Correções depois da primeira passagem:** os achados 2 (comentário), 3, 4 e 9, pelo
`dev-frontend`; a segunda passagem RP-12 do qa; a terceira passagem do `guardiao-visual`.

**Segunda passagem (22/11, invocação nova, sem a seção anterior):**

- **Veredito:** aprovado com ressalva. Nada bloqueia.
- **Conferiu:** 72 dos 83 arquivos, 7 critérios de aceite e 18 regras.
- **Achados:**
  1. `equipe.spec.ts` deixou de procurar no texto visível cinco cargos de exemplo que não colidem
     com o §4.3. Corrigido pelo qa na terceira passagem: são 7 procurados no texto visível, e só
     "Tesouraria" fica nos títulos. O vermelho foi demonstrado.
  2. O passo de 44 px das colunas do rodapé muda a moldura de todas as páginas, fora do D12 e sem
     e2e que o confira. Vai ao Gabriel no Portão 2.
  3. As perguntas em `ul`/`li` mudam o DOM do `/processo-seletivo`, que já tinha passado pelo
     Portão 2. Conferido na quarta passagem do `guardiao-visual`: 0 pixels diferentes no conteúdo;
     as diferenças ficam só no cabeçalho e no rodapé, pelas páginas novas.
  4. Três posições da borboleta da faixa (30, 8 e −12 px) contrariam a regra do degrau ao pé da
     letra, com o precedente do `.bf-1` da `layout-e-hero`. Vai ao Gabriel no Portão 2.
  5. O `TituloDeSecao` é usado por duas páginas, e não por três como diz a proposta; a Equipe tem
     o `TituloDoBloco`. Informativo.
- **Não conseguiu conferir:** a 11.2 e a 11.3 contra o briefing; os PNG; nenhum número medido; o
  Lighthouse sobre o `src/` final (medido depois pelo líder técnico, abaixo); Safari e VoiceOver; o
  P23.

**Terceira passagem (22/11, invocação nova, depois da correção em `equipe.spec.ts`):**

- **Veredito:** aprovado com ressalva. Nada bloqueia.
- **Conferiu:** 72 dos 85 arquivos, 7 critérios de aceite, as 10 decisões do Portão 1 e 14 regras.
- **Achados:**
  1. RP-12: três verificações novas sem vermelho registrado. São a ordem do menu e do rodapé
     (`paginas-publicas.test.ts:115-120`), as descrições do Sobre e da Equipe contra o documento
     (`:144-150`, `:60-74`) e o `BorboletaDaLiga.test.tsx`. Ou se demonstram, ou se declaram.
  2. Forma, baixa: uma quebra de linha literal dentro da template string em
     `equipe.spec.ts:244-245`.
  3. Nomenclatura, baixa (PADROES §6): nomes de uma letra em `sobre-e-equipe.ts` e
     `sobre.spec.ts`.
  4. Informativo: o nome da liga escrito à mão em `RodapePublico.tsx:48`, fora da Q1.
  5. Informativo: o `menu-por-teclado.spec.ts`, citado no Impact e no D12, não mudou, e não
     precisava, porque lê a lista.
- **Decisão do líder técnico:** é a terceira rodada em que o revisor pede correção (dieta, regra 4).
  Não houve nova rodada de correção pelos achados dele: o 1 vai declarado, e o 2 e o 3 vão ao
  Gabriel no Portão 2.
- **Lint, formatação e `tsc` depois da última edição do qa:** confirmados pelo `npm run verificar`
  com código 0, rodado depois.

**Quarta passagem (22/11, invocação nova, depois da correção do `SEGURANCA.md` §7):**

- **Veredito:** aprovado com ressalva. Nada bloqueia.
- **Conferiu:** 96 arquivos (76 lidos, 19 PNG contados), 7 critérios de aceite e 15 regras.
  - O texto que vai ao ar, palavra por palavra: nenhuma diferença.
  - A §7 do `SEGURANCA.md`: 6 e 13 no disco, e total 79.
- **Achados:**
  1. O `docs/SEGURANCA.md` fica fora do D12 e do Impact. Vai pelo nome na seção 4 da entrega.
  2. "Ativo a aprovar" na §7 só vale até o Portão 2. Antes do merge, a linha recebe o aceite do
     Gabriel, com a Qn.
  3. RP-12: além das já declaradas, outras verificações novas não foram vistas falhando:
     - a decoração por cima de texto (`sobre.spec.ts:284-299`);
     - as imagens no conteúdo igual a 0 (`sobre.spec.ts:253`, `equipe.spec.ts:346`);
     - os termos proibidos do Sobre (`sobre.spec.ts:204-225`);
     - `pagina-inicial.spec.ts:180-183`.
  4. O `menu-por-teclado.spec.ts` está citado no Impact e no D12, mas não mudou, e não precisava,
     porque lê a lista. Informativo.
  5. "A 37 · M 14 · D 4" na seção do dev ficou velho: são 15 M depois da correção do rodapé.
     Informativo.
  6. `--coluna-do-numero-do-objetivo: 44px` é a soma exata de `--space-6` com `--space-4`. É o
     mesmo caso das posições da borboleta, com o precedente de `--coluna-do-marcador-da-lista`.
     Informativo.

**Quinta passagem (22/11, invocação nova, depois da rodada do Portão 2):**

- **Veredito:** reprovado, por um achado só (o 1).
- **Conferiu:** os 11 arquivos da rodada, 64 do diff contra a `main` (61 inteiros), as 9 decisões
  do Portão 2, 7 critérios de aceite e 13 regras.
- **Achados:**
  1. **Correção necessária, bloqueia.** Em `tests/e2e/equipe.spec.ts:252-253` a quebra de linha
     literal dentro da template string continua lá: a Q17 (a) não entrou inteira. Além disso, a
     seção do qa diz que ela "virou `\n`" (Princípio 10). Conferido pelo líder técnico com
     `sed -n 248,256p | cat -A`.
  2. Informativo, desvio: a correção da Q11 também acrescentou "Presidência" e "Vice-presidência",
     com maiúscula, aos cargos proibidos na spec. É mais rígido, e o e2e já conferia.
  3. Informativo: comentários velhos depois das decisões:
     - `equipe.spec.ts:52-59` ("Q11 a decidir");
     - `ObjetivosDaLiga.module.css:7-10` ("melhoria a aprovar");
     - `FundadoresDiscentes.tsx:5-6` ("a aprovar no lado a lado");
     - `RodapePublico.module.css:65-69`, que não cita a linha da Q14 na §7.
  4. Informativo, PADROES §6: nomes de uma letra fora do alcance da Q17, em
     `src/features/equipe/conteudo.test.ts:67-68`, `src/lib/utils/paginas-publicas.test.ts:116`,
     `tests/e2e/listas-anunciadas.spec.ts:75-76` e `tests/e2e/paginas-publicas.spec.ts:602-610`.
  5. Informativo, RP-12: o teste novo dos fundadores exige 2 colunas até 1024 px e 1 linha acima.
     As 3 linhas até 1024 px são só impressas.
- **Desvio declarado pelo revisor:** leu sem querer as seções `revisor` e `guardiao-appsec`
  (linhas 437 a 607) antes de passar a ler pelos títulos. Diz que os achados vêm do diff e do
  disco.
- **Decisão do líder técnico:** pela instrução do Gabriel ("Se algum agente pedir correção de novo
  depois dela, pare e traga ao Gabriel"), a correção não foi feita. O achado 1 vai ao Gabriel.

**6.2 de novo, sobre o `src/` final:**

- `npm run verificar` 0; `npm test` 0, com 340 de 340; `npm run build` 0;
  `npm run test:desempenho` 0.
- Publicado, `páginas medidas: 4 de 4`, com desempenho, acessibilidade e SEO em 100 nas 3 rodadas
  de cada página.
- Não publicado, `1 de 1`: desempenho 100, acessibilidade 100 e SEO 92, que é só impresso.

- **Fonte da 11.2 e da 11.3 (achado 8):** é o briefing do gestor da change, colado pelo Gabriel no
  Claude Code em 22/11/2026 e aprovado no Portão 1. O texto em `docs/PADROES-DE-CODIGO.md` é cópia
  literal dele, sem linha de aprovação, como o briefing mandou ("para colar como está").

## guardiao-appsec

O guardião não escreve: o líder técnico registra o relatório em uma tela por passagem, com a lista
de achados inteira; a saída de comando e o aceite do Gabriel vão literais.

**Primeira passagem (22/11, invocação nova):**

- **Veredito:** BLOQUEADO · bloqueante 0 · alta 1 · média 1 · baixa 0 · informativa 1 ·
  conferência completa.
  - Passo 1 da conferência proporcional: `docs/PADROES-DE-CODIGO.md` e o delta
    `publicacao-do-site` estão no gatilho.
  - Nada é explorável em produção.
  - Não verificado: AS-15, porque a prévia não existe (LB-07 aceito, a change não mexe em
    cabeçalho).
- **Achados:**
  1. **AS-01 · alta · confirmado** · `docs/SEGURANCA.md` §7.
     - **Cenário:** nenhuma linha de origem para os 19 PNG da change (6 já no `9291dd9`); `*.png`
       é `binary` e o `-I` pula esses arquivos.
     - **Critério:** linha na §7 pelo caminho do archive, com contagem, origem e quem aprovou, e o
       total atualizado; buscas P22 a P40 com código 1; a aprovação que falta escrita antes do
       merge.
  2. **AS-09 · média · confirmado** · a lista entregue ao guardião.
     - **Cenário:** só o `git status`, sem o `git diff --name-status main...HEAD` (faltavam 10
       arquivos do commit); e o `git diff --exit-code` dos caminhos que não mudam, rodado sem
       `main`, comparava a árvore com o índice.
     - **Critério:** a lista é a união das duas saídas, com A/M/D, e as medidas de "não mudou"
       são feitas contra a `main`.
  3. **AS-16 · informativa · confirmado** · `src/features/equipe/conteudo.ts:69-89`.
     - **Cenário:** nomes de 5 estudantes e 2 docentes publicados, sem finalidade, base legal nem
       prazo em `docs/DADOS-PESSOAIS.md`.
     - **Critério:** antes de irem ao ar em produção, fica escrito isso e quem responde a um pedido
       de retirada.
     - **Release:** R1, `lancamento-r1`.
- **Riscos aceitos pelo Gabriel:** nenhum novo. LB-07, LB-16, LB-18, LB-27 e LB-28 no prazo, não
  tocados.

**Correções do líder técnico:**

- **Achado 1:** duas linhas novas na §7 do `SEGURANCA.md`.
  - 6 `q3-opcao-*`, aprovados na Q3 (a) do Portão 1;
  - 13 `{lado-a-lado,raiz-nao-publicada}-*`, a aprovar pelo Gabriel no Portão 2;
  - o total passa de 60 para 79, com o caminho do archive em 22/11 e a nota de que ele muda se o
    archive cair em outra data.
  - Contagem no disco: 19 = 6 + 13.
  - `git ls-files` da pasta `prints/`: 6, os do commit.
- **Achado 2:** a lista é a união de `git diff --name-status main...HEAD` (16 A) com
  `git status --porcelain --untracked-files=all`, em 102 linhas e 96 caminhos distintos.
  - No gatilho: `docs/PADROES-DE-CODIGO.md`, `docs/SEGURANCA.md` e o delta `publicacao-do-site`.
  - `git diff --exit-code --stat main --` de `package.json`, `package-lock.json`, `src/proxy.ts`,
    `next.config.ts`, `lighthouserc.json`, `.github/`, `playwright.config.ts`, `scripts/`,
    `src/app/layout.tsx`, `.claude/`, `CLAUDE.md`, `.gitattributes`, `.gitignore`, `.npmrc`,
    `.nvmrc`, `.mcp.json`, `openspec/config.yaml` e `vercel.json`: código 0, saída vazia.
  - Arquivos `.env*` no diff contra a `main`: 0.

**Pedidos de comando, rodados pelo líder técnico, todos da lista fechada:**

- **P1** · AS-01/08/09/17 · `git diff --stat main..HEAD`: 16 arquivos, todos em
  `openspec/changes/pagina-sobre-e-equipe/` (6 PNG `Bin 0 -> …`), `16 files changed, 1206
  insertions(+)`, código 0.
- **P2 a P8** · AS-08/02/15/09/01 · `git diff main -- '<arquivo>'` para `package.json`,
  `package-lock.json`, `src/proxy.ts`, `next.config.ts`, `.github/workflows/ci.yml`,
  `.gitattributes` e `.gitignore`: saída vazia, código 0 em todos.
- **P9, P10** · AS-01 · `git ls-files -- '.env'` e `-- '.env.local'`: saída vazia, código 0.
- **P11, P12** · AS-01 · `git check-ignore -v -- '.env'`: `.gitignore:10:.env	.env`;
  `-- '.env.local'`: `.gitignore:11:.env.*	.env.local`. Código 0 nos dois.
- **P13 a P16** · AS-01 · `git log --all --oneline -S '<texto>'` para `sb_secret_`, `sbp_`, o
  cabeçalho JWT e `github_pat_`: `9291dd9` não aparece em nenhum (contagem 0).
- **P17 a P21** · AS-01 · `git grep -c -a --untracked -e '<texto>' -- '<relatorio.md>'` para os 5
  textos: saída vazia, código 1 em todos.
- **P22 a P34** · AS-01 · `git grep -c -a --untracked -e 'tEXt\|iTXt\|zTXt\|eXIf' -- '<png>'` nos
  13 PNG da árvore: saída vazia, código 1 em todos.
- **P35 a P40** · AS-01 · a mesma busca em `9291dd9` nos 6 `q3-opcao-*`: saída vazia, código 1 em
  todos.
- **Precondições do P41 a P43:**
  - `git rev-parse main` e `git ls-remote origin refs/heads/main` iguais: `6cc85a6d9d5b…`.
  - Forma da linha no `.env`, só por contagem com `grep -c`, sem ler o valor: 1 linha com o nome;
    0 com aspas, `#`, vazio, espaço ou tab logo depois do `=`; 0 com espaço ou tab no fim depois de
    tirar o `\r` (`tr -d '\r'`).
  - `git rev-list main..HEAD`: só `9291dd9537ede1050bcb08b17943e7e5e4bea3e2`.
- **P41** · AS-01 · segunda forma, `<rev>` `9291dd9…`: saída vazia, código 1.
- **P42** · AS-01 · terceira forma (`--untracked`): saída vazia, código 1.
- **P43** · AS-01 · quarta forma (`--cached`): saída vazia, código 1.
- **Nome da variável fora dos quatro caminhos** (`git grep -c --untracked -e
  'VERCEL_AUTOMATION_BYPASS_SECRET' -- . ':!docs' ':!openspec' ':!README.md' ':!.env.example'`):
  saída vazia, código 1.

**Segunda passagem (22/11, invocação nova, sem a anterior), com a decisão:**

- **Veredito:** APROVADO · bloqueante 0 · alta 0 · média 0 · baixa 0 · informativa 1 · conferência
  completa.
  - O diff toca `docs/SEGURANCA.md`, `docs/PADROES-DE-CODIGO.md` e o delta `publicacao-do-site`,
    todos no gatilho.
  - 96 arquivos distintos: 58 lidos, 18 por busca, 2 PNG vistos.
  - Não verificado: AS-15, porque a prévia não existe (LB-07 aceito).
- **Achado A1 · AS-01 · informativa · confirmado** · `docs/SEGURANCA.md:599`.
  - **Cenário:** a linha dos 13 prints diz "Ativo a aprovar", e o caminho é o do archive com
    `2026-11-22`.
  - **Critério:**
    - antes do merge, "Ativo aprovado", com a Qn e a data do Portão 2;
    - depois do archive, `git ls-tree -r --name-only HEAD` mostra os 13 e os 6 exatamente no
      caminho das linhas;
    - o total de 79 continua batendo.
- **Pedidos de comando desta passagem**, rodados pelo líder técnico, todos da lista fechada:
  - **P1 a P9**, `git diff main -- '<arquivo>'` para `package.json`, `package-lock.json`,
    `.github/workflows/ci.yml`, `src/proxy.ts`, `next.config.ts`, `.gitignore`, `.gitattributes`,
    `lighthouserc.json` e `playwright.config.ts`: saída vazia, código 0.
  - **P10**, `git diff --stat main..HEAD`: `16 files changed, 1206 insertions(+)`, 0 caminhos fora
    da pasta da change.
  - **P11**, `git check-ignore -v -- '.env'`: `.gitignore:10:.env	.env`, código 0.
  - **P12 a P17**, `git grep -c -a --untracked -e '<texto>' -- '<relatorio.md>'`:
    - `eyJhbGci`, `ghp_`, `PRIVATE KEY` e `postgresql://`: saída vazia, código 1;
    - `sbp_`: `openspec/changes/pagina-sobre-e-equipe/relatorio.md:1`, código 0;
    - `github_pat_`: `openspec/changes/pagina-sobre-e-equipe/relatorio.md:1`, código 0.
    - Pela forma `git grep -n -I --untracked`, as duas são as linhas 490 e 491 deste relatório,
      com o nome dos padrões entre crases, sem valor. O guardião concluiu: não é segredo, e não é
      achado.
  - **Precondições do P18 ao P20**, iguais às da primeira passagem: `main` = remoto = `6cc85a6d…`;
    a linha do `.env` na forma certa (1 · 0 · 0); um commit na branch.
  - **P18** (`9291dd9`), **P19** (`--untracked`) e **P20** (`--cached`): saída vazia, código 1.
  - **P21, P22 e P25 a P28**, `git grep -c -a -e '<texto>' 9291dd9 -- '<relatorio.md>'` para
    `eyJhbGci`, `sbp_`, `ghp_`, `github_pat_`, `PRIVATE KEY` e `postgresql://`: saída vazia,
    código 1.
  - **P23 e P24** (prévia, `/sobre` e `/equipe`): depois do push e da confirmação do Gabriel no
    painel da Vercel.
- **Riscos aceitos pelo Gabriel nesta change:** nenhum.
- **AS-16 (A3 da primeira passagem, informativo):** os nomes da equipe publicados ainda não têm
  finalidade, base legal, prazo nem responsável por um pedido de retirada. Fica para a
  `lancamento-r1`, antes de irem ao ar em produção.

**Terceira passagem (22/11, invocação nova, depois da rodada do Portão 2), com a decisão:**

- **Veredito:** APROVADO · bloqueante 0 · alta 0 · média 0 · baixa 0 · informativa 2 ·
  conferência completa.
  - Riscos aceitos que a prévia confirma, sem que a change toque no ponto: LB-07 e LB-34.
  - Não verificado: nada.
- **Desvio declarado pelo guardião:** viu sem querer trechos desta seção, as linhas 612 a 667, e
  as seções de outros agentes pelo `diff-rodada-portao2.patch`. Diz que não os usou como evidência.
- **Achados:**
  - **A1 · AS-15 · informativa · confirmado.** P23 e P24 mediram a prévia do `6070334`, anterior à
    rodada.
    - **Critério:**
      - registrar isso;
      - depois do commit da rodada, o `git diff --stat 6070334..<HEAD novo>` não pode listar
        `next.config.*`, `vercel.json`, `src/proxy.ts` nem `src/app/**/layout.tsx`;
      - se listar, P23 e P24 rodam de novo.
  - **A2 · AS-02 e AS-04 · informativa · confirmado** · `docs/SEGURANCA.md:39-54`. A §3 da R1 não
    ganhou a linha desta change. É opcional; decide o Gabriel.
- **Pedidos de comando**, rodados pelo líder técnico com `MSYS_NO_PATHCONV=1`, todos da lista
  fechada:
  - **Precondições:**
    - conferência do ambiente 0;
    - `main` = remoto = `6cc85a6d…`;
    - curl 8.7.1;
    - a linha do `.env` na forma certa (1 · 0 · 0);
    - `git rev-list main..HEAD` = `6070334d…` e `9291dd95…`;
    - o host montado pela regra, com 52 caracteres, igual letra por letra ao confirmado pelo
      Gabriel.
  - **P23** (`/sobre`) e **P24** (`/equipe`), na prévia do `6070334`: código 0 nos dois.
    - `HTTP/1.1 200 OK`, sem `location` e sem `set-cookie`.
    - `X-Matched-Path: /sobre` e `/equipe`; `X-Robots-Tag: noindex`;
      `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
    - `Content-Length` 45623 e 35404.
  - **P25 e P26** (segunda forma, `9291dd9` e `6070334`), **P27** (`--untracked`) e **P28**
    (`--cached`): saída vazia, código 1.
  - **P29 a P32** (`git log --all --oneline -S`, para `sb_secret_`, `sbp_`, `eyJhbGciOi` e
    `github_pat_`):
    - o `6070334` aparece em `sb_secret_`, `sbp_` e `github_pat_`, junto com commits anteriores à
      branch;
    - o `9291dd9` não aparece em nenhum;
    - `eyJhbGciOi` não traz nenhum commit da branch.
  - **P33 a P36** (`git grep -n -I --untracked` no `relatorio.md`):
    - as linhas 612, 613, 658, 659 e 667, só com o nome dos padrões entre crases;
    - `eyJhbGciOi`: código 1.
    - O guardião concluiu: o `6070334` aparece por causa desse registro, e não há valor.
  - **P37 e P38** (`tEXt`, `TXt` em `lado-a-lado-equipe-1280.png`): saída vazia, código 1.
  - **P39** (`git ls-files -- '.env'`): vazio. **P40**: `.gitignore:10:.env	.env`.
  - **Conferência do nome:** saída vazia, código 1.

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum.

- **Arquivos fora do escopo, por agente:** <agente · arquivo, ou "nenhum em nenhuma passagem">
- **Passagem do `especificador` (22/11, antes do Portão 1):** 10 arquivos novos, todos em
  `openspec/changes/pagina-sobre-e-equipe/`; nenhum fora do escopo. `git diff --cached --name-only`
  vazio; `HEAD` `6cc85a6`, `rev-list --all` 104 e `ls-remote origin main` `6cc85a6`, iguais antes e
  depois; `conferir-ambiente-local --change pagina-sobre-e-equipe` com código 0 antes e depois;
  `openspec validate pagina-sobre-e-equipe --strict` com código 0.
- **Prints da Q3, origem:** os seis `prints/q3-opcao-{a,b,c}-{390,1280}.png` são esboços estáticos
  para decisão, não telas do site. Foram gerados pelo líder técnico com um script Playwright fora
  do repositório: HTML com o texto do §2.3 ao §2.6 sem a nota da Q10, cores do `tokens.css` e
  Caprasimo e Figtree do Google Fonts, só no esboço. Fontes carregadas e nenhuma rolagem horizontal
  nas 6 capturas. Uma faixa escura no topo de cada print diz "ESBOÇO PARA DECISÃO, NÃO É O SITE".
  Os prints da Q7, que eram opcionais, não foram gerados.
- **Tarefas do líder técnico:**
  - 1.2: a 11.2 e a 11.3 entraram coladas como estão; `git diff --numstat` deu 22 linhas
    acrescentadas e 0 removidas.
    - Desvio do D10: ficaram **depois** da linha "Aprovada pelo Gabriel em 21/11/2026…", e não
      antes, para essa linha continuar colada à 11.1, que é a seção que ela registra.
  - 1.3: as quatro linhas da `REFERENCIA-VISUAL.md` §7, com o texto que o `especificador` propôs.
- **Passagens:** `dev-frontend`, `qa-acessibilidade`, `guardiao-visual`, a correção do rodapé e a
  segunda passagem do `guardiao-visual`.
  - Arquivos fora do escopo de pasta de cada agente: nenhum.
  - Fora das listas nominais do D12, três arquivos:
    - `src/lib/utils/metadados.test.ts`, do dev: troca `/sobre` por `/endereco-que-nao-existe`;
    - o passo de 44 px em `src/componentes/layout/RodapePublico.module.css`, do dev: correção do
      defeito 13 do `guardiao-visual` (no D12, esse arquivo só levava o `role="list"`);
    - `docs/SEGURANCA.md` §7, do líder técnico: correção do achado 1 do guardião.
  - Depois de cada passagem: índice vazio; `HEAD` `9291dd9`, `rev-list --all` 105 e
    `ls-remote origin feat/pagina-sobre-e-equipe` `9291dd9`, iguais; conferência do ambiente com
    código 0.
- **Q11, erro de spec, para o Gabriel no Portão 2:** o cenário "O que o protótipo tinha e a página
  não tem", da spec `pagina-equipe`, proíbe "Tesouraria". A linha do §4.3 do Diretor(a)
  financeiro(a) ("Tesouraria, balanços semestrais e captação de recursos") contém a palavra e vai ao
  ar. A spec não foi corrigida. O e2e confere a intenção: nenhum título de cargo é um cargo de
  exemplo do protótipo.
- **Comandos da tarefa 1.1 e da 5.4 que não medem como estão escritos:**
  - 1.1, `list-style: none` contra `role="list"`: dá 11 contra 10, porque o 11º é o `summary` das
    perguntas, que não é lista.
  - 5.4: `git grep -c DEMO-RP12` sem caminho sempre acha a marca nos documentos. A forma que mede é
    `git grep --untracked -c DEMO-RP12 -- src`, que saiu com código 1.
- **6.2:**
  - `npm run verificar` 0; `npm run build` 0; `npm run test:desempenho` 0.
  - No publicado, `páginas medidas: 4 de 4`: `/`, `/sobre`, `/processo-seletivo` e `/equipe`, com
    desempenho, acessibilidade e SEO em 100 nas 3 rodadas.
  - No não publicado, `páginas medidas: 1 de 1`: desempenho 100, acessibilidade 100 e SEO 92, que
    é só impresso.
  - 22 dependências diretas.
  - `git diff --exit-code` de `package.json`, `package-lock.json`, `src/proxy.ts`,
    `lighthouserc.json`, `.github/`, `playwright.config.ts`, `scripts/` e `src/app/layout.tsx`: 0.
