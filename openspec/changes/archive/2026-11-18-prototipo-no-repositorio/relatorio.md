# Relatório — prototipo-no-repositorio

Copiado de `openspec/changes/MODELO-relatorio.md`. Cada agente escreve a própria seção; a do agente
que não entrou recebe uma linha dizendo por quê. Número quando houver número. Incompleto declarado
incompleto.

## especificador

- **Artefatos (estado atual, depois da rodada 6):** `openspec/changes/prototipo-no-repositorio/`
  `proposal.md`, `specs/referencia-visual/spec.md` (capacidade nova), `design.md`, `tasks.md` ·
  5 requisitos, 13 cenários · 15 tarefas (o teto)
- **Questões em aberto (estado atual):** nenhuma. Q1 a Q7 foram decididas pelo Gabriel no
  Portão 1 e nas rodadas de apply
- **Incompleto:** não rodei `openspec instructions` antes de cada artefato nem
  `openspec validate --strict` em nenhuma rodada, porque este agente não tem ferramenta de
  terminal. A validação é do líder técnico. A altura da janela em 1280 px (800) não está no
  briefing e foi fixada no `design.md` D4 como detalhe de implementação
- **Rodada 1 (superada):** 5 requisitos, 9 cenários, 15 tarefas, redigidos com 10 páginas e
  21 arquivos. Ficaram abertas Q1 (10 ou 11 páginas), Q2 (RP-13) e Q3 (menu aberto); as três
  foram decididas no Portão 1 (rodada 2)
- **Rodada 2 (Portão 1):** aplicadas Q1 = b, Q2 = a, Q3 = a, Q4 = a e as emendas E1 a E3 —
  21 → 23 em tudo; D6 com o texto final e o lugar exato em PADROES §8.1; PNG estranho vira falha
  dentro da tarefa 1.5; proposta reduzida a cerca de 700 palavras. Agora são 5 requisitos,
  11 cenários e 15 tarefas. Questões em aberto: nenhuma. Continuo sem rodar o `validate`
- **Rodada 3 (apply, Q5 = a e Q6 = a; a parte das animações foi superada na rodada 4):** a
  demonstração de falha espera `21 de 23`, porque a página perde os dois prints (tarefa 1.5 e
  D5). O D4 tira `animation: none` da folha injetada, que deixava as borboletas a 0°, e deixa o
  congelamento para o print, "no primeiro quadro, a −8°". Essa afirmação era **falsa** e saiu na
  rodada 4.
  Registra também o ponteiro fora do link e o navegador sem rede. A tarefa 1.3 confere a borboleta
  inclinada e o botão sem hover. Spec intocada; caixas de `tasks.md` intocadas
- **Rodada 4 (apply, Q7 = a; a forma de achar as borboletas e a demonstração foram superadas na
  rodada 6):** a frase da rodada 3 sobre `animations: 'disabled'` era falsa (ele cancela a
  animação infinita, 0°) e saiu do D4. Agora a animação infinita pausa no início do primeiro
  ciclo, descontando o atraso, e o print sai com `'allow'`. Entrou a conferência das borboletas:
  −8° ± 0,5°, linha `borboletas: N de M a -8°` e código 1 fora da tolerância. Ela está na tarefa
  1.3, com os recortes em `recortes/`. Nessa rodada a conferência contava só as animações em
  execução, e a demonstração trocava a constante. Na spec, o requisito de
  estabilidade passa a falar da pose de repouso, com 2 cenários novos, e "cada print que faltou".
  Ficam 5 requisitos, 13 cenários e 15 tarefas. Caixas de `tasks.md` intocadas
- **Rodada 5:** o D4 registra as duas esperas de desenho medidas pelo `dev-frontend`. Depois de
  cada troca de largura, dois quadros: `noticias-390`, de 9/20 defeituosos para 0/20. Antes de
  todo print, esconder e mostrar a página: `sobre-1280`, de 1/15 para 0/25, com o mecanismo não
  confirmado. A prova são 10 de 10 execuções com sha256 idênticos. Bytes continuam medida
  informativa, porque são estáveis nesta máquina e não entre máquinas. Spec e `tasks.md`
  intocadas
- **Rodada 6 (reprovação do revisor):**
  - D4: as borboletas passam a ser achadas pela marcação do protótipo, ou seja, a declaração
    `voa` no próprio HTML, esteja a animação rodando ou não. Antes, uma animação desligada dava
    `0 de 0` com código 0.
  - D4: o total zero de borboletas é falha.
  - D4: está declarado o limite conhecido, com `animations: 'allow'` fixo e comentado.
  - D5: qualquer arquivo fora dos 23 conta como estranho, de qualquer extensão, e a saída diz
    quantos arquivos a pasta tinha. O código 1 passou a listar as quatro condições.
  - Tarefa 1.3: a demonstração do RP-12 usa violação real, `animation: none` injetado, em vez de
    trocar a constante.
  - Tarefa 1.5: o estranho da demonstração não é PNG.
  - Corrigi esta seção: as linhas do topo dizem o estado atual, e as rodadas 1, 3 e 4 dizem o que
    foi superado. Spec intocada; caixas intocadas

## dev-frontend

**Estado atual (rodada 5).** As linhas de cima valem hoje; o histórico está abaixo, e o que
deixou de valer está marcado como **superado**, sem ser apagado.

- **Arquivos:** `scripts/prints-do-prototipo.mjs` (novo, 322 linhas) · `package.json` (uma
  linha, `prints:prototipo`) · `prototipo/prints/` (23 PNG) · `prototipo/README.md` (novo,
  5 linhas) · **tokens novos:** nenhum
- **O script hoje:** abre o protótipo sem rede, navega por clique e só tira o print depois de
  achar o título. Antes de cada print: dois quadros de desenho depois de cada troca de largura;
  esconde e mostra a página; congela as animações (as finitas vão até o fim, a `voa` para no
  atraso dela); confere as borboletas e só então tira o print com `animations: 'allow'`. As
  borboletas são achadas pela marcação (`style` com `voa`, rodando ou não, visíveis nesta
  largura), e cada uma tem de estar a −8° ± 0,5°. Ao fim imprime `gerados`, `arquivos na pasta`,
  `estranhos` (qualquer extensão), `borboletas medidas no total` e `borboletas fora da pose`.
  Sai com 1 se faltou print, se há estranho, se alguma borboleta está fora da pose ou se o total
  de borboletas é zero. O `catch` diz qual passo falhou e a primeira linha do erro
- **Comandos (rodada 5):** `eslint` 0 · `prettier --check` 0 · `node --check` 0 ·
  `npm run prints:prototipo` 0 com `gerados: 23 de 23`, `arquivos na pasta: 23`,
  `estranhos: 0`, `borboletas medidas no total: 3`, `borboletas fora da pose: 0` · por print:
  `inicio-1280` 2 de 2 a −8°, `inicio-390` 1 de 1, os outros 21 prints 0 de 0 (23 linhas) ·
  3 execuções seguidas com sha256 idênticos entre si e iguais ao `sha-final-01` da rodada 4 ·
  `package-lock.json` sem diferença · 22 dependências diretas · protótipo intocado
- **Tarefa 1.3 (b), violação real:** `animation: none !important` injetado nas borboletas deu
  `0 de 2 a -8° (medido: 0.0°, 0.0°)` em `inicio-1280`, `0 de 1` em `inicio-390`,
  `fora da pose: inicio-1280.png` e `fora da pose: inicio-390.png`, código 1. Desfeito com
  `cmp` idêntico: código 0. **Total zero:** com o nome procurado trocado para `voo`, deu
  `borboletas medidas no total: 0`, `nenhuma borboleta encontrada`, código 1; desfeito: 0
- **Tarefa 1.4:** `node -e` lendo os bytes 16 a 23 de cada PNG. Todos os `-1280` têm 1280 de
  largura, todos os `-390` têm 390, e `menu-aberto-390.png` tem 390 × 844: 23 de 23 conferem
- **Tarefa 1.5:**
  - Título trocado: `falhou galeria — o título "Título que não existe" não apareceu na tela`,
    `21 de 23`, faltaram `galeria-1280.png` e `galeria-390.png`, código 1.
  - Desfeito: `23 de 23`, código 0.
  - `nota.txt` na pasta: `arquivos na pasta: 24`, `estranhos: 1`, código 1, e o arquivo não foi
    apagado.
  - Removido: código 0.
  - Mensagem de outra falha: com uma pasta no lugar de `galeria-390.png`, a saída diz
    `o print galeria-390.png não foi tirado (EISDIR…)`, `22 de 23`, código 1
- **Tarefa 2.4:** com `PLAYWRIGHT_BROWSERS_PATH="$(mktemp -d)"`, sai a mensagem em português
  "O navegador de teste do Playwright nao esta instalado nesta maquina", com
  `npx playwright install --with-deps chromium`, código 1, e os prints ficam inalterados.
  Antes da mensagem aparece a pilha de erro crua do Node, que vem de `verificar-navegador.mjs`,
  fora do meu escopo
- **Melhorias de UI ou UX propostas:** nenhuma de tela. Para `verificar-navegador.mjs`, fora do
  meu escopo: esconder a pilha crua do Node antes da mensagem
- **Incompleto:** nada nas tarefas 1.1 a 3.1. Não medido: bytes em outra máquina, e o mecanismo
  interno do navegador por trás do pixel que sobrava em `sobre-1280`

**Histórico**

- **Rodada 1:** criei o script, a linha do `package.json`, o README e os 23 prints. Rodaram
  `verificar` 0 (artefatos: 259 rastreados, 0 indevidos), `npm test` 71/71 e `playwright` 84/84.
  Duas execuções seguidas deram os mesmos 23 nomes e 23 de 23 iguais byte a byte.
  - **Superado:** "a tarefa esperava `22 de 23`". A tarefa foi corrigida para `21 de 23`, que é
    o que o script dá: a página perde os dois prints.
  - **Superado:** as borboletas a 0° pela folha com `animation: none`. Saiu na rodada 3.
- **Rodada 2, interrompida (superada pela 3):** sem `animation: none`, com
  `animations: 'disabled'`, as borboletas continuaram a 0°, porque essa opção cancela a animação
  infinita. Parei e reportei.
- **Rodada 3:** congelamento no atraso e `animations: 'allow'`; borboletas a −8°.
  - Conta corrigida: `inicio-1280` 2 de 2, `inicio-390` 1 de 1 e os outros **21** prints 0 de 0.
    Antes estava escrito 20, o que somava 22 e não 23.
  - **Superado:** a demonstração com "−2° esperado", que trocava a constante. A rodada 5 usa
    violação real.
  - **Superado:** a conferência só pelas animações em execução. A rodada 5 acha as borboletas
    pela marcação.
- **Rodada 4 (determinismo):**
  - `noticias-390`: o print saía antes de o navegador terminar de desenhar depois da troca para
    390 px. Sem espera, 9 defeituosos em 20. Com dois quadros depois da troca de largura, 0 em
    20. Com a espera só depois da navegação, 10 em 20. O estado do `<image-slot>` era igual
    nos bons e nos defeituosos.
  - `sobre-1280`: sobrava 1 pixel da marca de "página atual" de Início (x 67, y 103). Só com
    os dois quadros, 1 variação em 15 execuções. Com `redesenharTudo()`, 0 variações em 25: 15
    execuções diretas do script, mais as 10 oficiais.
  - Prova: 10 execuções de `npm run prints:prototipo`, todas com código 0 e `23 de 23`, e as 10
    listas `sha-final-01` a `10` idênticas.
  - As 6 execuções seguintes foram as demonstrações. RP-12 com −2°: 1; desfeito: 0. Na 1.5:
    1, 0, 1, 0. Só a última teve o sha256 comparado, e era igual ao `sha-final-01`; nas outras 5
    registrei o código e o contador, não o sha.
  - `menu-aberto-390` mudou 50 pixels no botão de menu, atrás do véu, sem diferença visível.
  - **Superado:** o RP-12 com −2° (ver rodada 3).
- **Rodada 5 (reprovação do revisor):**
  - Borboletas achadas pela marcação; o total zero agora é falha; comentário do `'allow'`.
  - Mensagem do `catch` por passo; estranho de qualquer extensão, com `arquivos na pasta`.
  - `!important` comentado (PADROES §3).
  - Booleanos com verbo (`usaBotaoDeDestaque`, `ehPaginaInteira`, `temFalha`,
    `mediuAlgumaBorboleta`) e `aba` para a aba do navegador.
  - README: a 5ª linha avisa dos dados de exemplo errados e aponta para a seção 6 da
    REFERENCIA-VISUAL.
  - Os prints não mudaram desde a rodada 4.

## dev-dados

- Não entrou: a change não lê nem grava no banco.

## guardiao-visual

- Não entrou: a change não tem tela do site. Os prints são do próprio protótipo, que é o
  gabarito; não há site para comparar com ele.

## qa-acessibilidade

- Não entrou: a change não cria nem altera página do site, e não há teste novo em `tests/`. O
  e2e existente rodou sem mudança (84 de 84) na conferência do líder técnico.

## revisor

Escrita pelo líder técnico a partir dos relatórios do revisor, que não tem ferramenta de escrita.

- **Veredito:** 1ª passagem **reprovado**; 2ª passagem, com contexto limpo, **aprovado com
  ressalvas**
- **Conferiu (2ª):** 13 arquivos · 5 requisitos e 13 cenários · 3 critérios de aceite ·
  15 tarefas · 5 PNG abertos
- **Achados da 1ª (13):** 1 bloqueava — a conferência das borboletas só via animações em
  execução, então `animation: none` dava "0 de 0" e código 0. Na 2ª: 10 resolvidos, 1 resolvido
  em parte (5, lado a lado da 2.2), 1 não resolvido (6, contadores do `verificar` final fora do
  relatório; registrados agora na seção do líder técnico) e 1 decisão do Gabriel (10, tabela do
  RP-13 em PADROES §8.1 × exceção "não mecânica", emenda sem data)
- **Achados novos da 2ª (6), nenhum bloqueia:** 14 registro escrito da 1.3(c) (feito agora,
  seção do líder técnico) · 15 a prova de "total zero" troca o nome procurado em vez de tirar a
  borboleta do DOM · 16 os PNG de `recortes/` são derivados e não têm exceção no RP-13 · 17 sem
  contagem esperada por página, uma borboleta removida passa · 18 o `catch` atribui ao título uma
  falha na troca para 1280 px · 19 numeração das rodadas diverge entre design e relatório
- **Não conseguiu conferir:** nenhum número por execução própria (sha256, códigos, contadores),
  o ângulo em graus (só a olho) e as dimensões dos 23 PNG (abriu 5)

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos nesta change — `especificador`
`openspec/changes/prototipo-no-repositorio/` · `dev-frontend` (decisão do Gabriel, Q4)
exatamente `scripts/prints-do-prototipo.mjs`, a linha `prints:prototipo` do `package.json`,
`prototipo/prints/` e `prototipo/README.md`, mais a própria seção deste relatório · `revisor`
nenhum · `dev-dados`, `guardiao-visual` e `qa-acessibilidade` não entraram.

- **Arquivos fora do escopo, por agente:** nenhum em nenhuma passagem (6 do especificador, 5 do
  dev-frontend, 1 do revisor), conferido com `git status --porcelain --untracked-files=all`
  depois de cada uma.
- **Escritos pelo líder técnico:** `docs/PADROES-DE-CODIGO.md` (tarefa 3.2, emenda do RP-13
  com o texto do D6), as caixas de `tasks.md`, as seções acima de quem não entrou, a do revisor
  (ele não tem ferramenta de escrita) e `recortes/` (três recortes da borboleta do Início:
  1280 e 390 do print final, e 1280 do print do gestor, para comparar).
- **Escritos pelo gestor:** `docs/PLANO-DE-DESENVOLVIMENTO.md` e `docs/REFERENCIA-VISUAL.md`
  (11 páginas e 23 prints), que entram no commit desta change.
- **Instabilidade achada na conferência:** em 5 execuções do script da rodada 3,
  `noticias-390.png` saiu 1 vez sem o contorno e o texto do 2º cartão, e `sobre-1280.png`
  variou 1 vez em 1 pixel. O print defeituoso era o mesmo do commit wip `a95ed11`. Corrigido na
  rodada 4 do dev-frontend; depois disso, 2 execuções minhas e 3 dele deram sha256 idênticos.
- **Tarefa 2.2, lado a lado:** o antigo × novo de `inicio` e `contato` em 1280 px ficou no
  scratchpad, fora do repositório, e é da rodada 1. No lugar dele, `recortes/` traz a
  comparação que importou (a borboleta), e o diff de imagens do PR mostra o antigo × novo de
  cada um dos 23 PNG. Por isso a caixa da 2.2 está desmarcada: o critério "anexado ao relatório"
  não foi cumprido.
- **Conferência final (tarefa 4.1), depois da rodada de correção do revisor:**
  `npm run verificar` 0 (artefatos: 269 rastreados examinados contra 11 padrões, 0 indevidos ·
  Prettier sem diferença · tokens: 56 arquivos varridos em `src/` · chave de serviço: 149
  varridos, 35 entregues ao navegador, 0 ocorrências) · `npm test` 0, 71 de 71 · `npm run
  test:e2e` 0, 84 de 84 · `openspec validate prototipo-no-repositorio --strict` 0 · duas
  execuções de `npm run prints:prototipo`, ambas 0, com `gerados: 23 de 23`,
  `arquivos na pasta: 23`, `estranhos: 0`, `borboletas medidas no total: 3`,
  `borboletas fora da pose: 0`, e os 23 sha256 idênticos entre elas e iguais ao `sha-final-01`
  da rodada 4.
- **Tarefa 1.3(c), o que o líder técnico viu nos PNG:** borboleta do topo inclinada nos
  recortes de `inicio-1280` e `inicio-390` (reta no print da rodada 2, inclinada no do gestor);
  botão Processo seletivo em repouso, sem hover; títulos em Caprasimo; 2º cartão de
  `noticias-390` com contorno e texto; conteúdo em opacidade plena, nada em transição.
- **Achado 15 do revisor (prova do total zero):** mantida. Trocar o nome procurado reproduz o
  modo de falha que a regra protege (a busca quebrar e não achar nada); tirar a borboleta do DOM
  provaria a mesma linha de código.
- **Não feito, registrado como sugestão:** contagem esperada por página (achado 17) e a mensagem
  do `catch` na troca para 1280 px (achado 18).
- **Numeração das rodadas (achado 19):** cada agente conta as próprias passagens. A correção
  depois da reprovação é a rodada 6 do especificador e a 5 do dev-frontend; as esperas de
  desenho são a 5 do especificador e a 4 do dev-frontend.
