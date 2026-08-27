# Especificação da feature: Layout base (F03)

**Feature Branch**: `feat/F03-layout-base`

**Created**: 2026-08-26

**Status**: Draft

**Input**: Descrição do usuário: "O cabeçalho, o menu mobile, o rodapé e a navegação que todas as páginas do site público vão usar. Nenhum conteúdo de página."

---

## Resumo

Primeira feature da Fase 1 e a primeira que o visitante vê. Entrega a **moldura** de todas as
páginas públicas: cabeçalho, painel lateral de navegação no mobile, rodapé, os dez destinos e o
caminho de teclado que atravessa tudo isso.

Não entrega conteúdo de página. As páginas entram da F04 em diante — mas entrega **dez rotas**, uma
por destino, as nove ainda sem conteúdo visivelmente marcadas como em construção (FR-015). São dez
páginas sob verificação, não uma.

Três coisas nesta feature são de risco alto e por isso têm requisito próprio:

1. **O cabeçalho do protótipo consome quase um terço da tela do celular.** O diagnóstico mediu
   **244 px, fixo** — 29% de um iPhone de 390×844 e 37% de um iPhone SE. Como é fixo, esse terço
   não volta ao rolar. O Princípio III diz que o mobile é o caso principal; um cabeçalho assim
   contradiz isso em toda página do site de uma vez só.
2. **A conversão principal do site — "Processo seletivo" — não pode morar dentro de um menu
   recolhido.** Quem chega pelo Instagram no celular precisa encontrá-la sem descobrir antes que
   existe um botão de menu.
3. **O axe-core não testa operabilidade por teclado.** Esta é justamente a feature da navegação:
   prisão de foco, retorno de foco, ordem de foco e link de pular conteúdo passam inteiros pelo
   axe sem acusar nada. Precisam de verificação própria, que percorra de verdade e conte.

A feature também converte as classes `.nav` e `.nav-brand` do `liacup.css`, aplicando a correção de
contraste já anotada no próprio arquivo e já decidida na ADR-0003 §2. Não é decisão nova: é dívida
com endereço.

## Clarifications

### Session 2026-08-26

- Q: O rodapé traz o endereço da sede? → A: **Forma curta — "FCTS · Campus UnB Ceilândia".** Fecha o FR-025. Sem CEP nem logradouro; o endereço completo, se for ao ar, é da F13.
- Q: Para onde apontam os nove destinos que ainda não têm página? → A: **Rota mínima por destino, visivelmente marcada como em construção.** Fecha o FR-015. Esta feature passa a entregar **dez** páginas.
- Q: "Processo seletivo" é link de texto ou link com aparência de botão? → A: **Link com aparência de botão**, com o componente novo **declarado como escopo** da F03. Fecha o FR-008.
- Q: Em que largura os destinos passam a aparecer direto no cabeçalho? → A: **1024 px**, com plano B autorizado: se a medição reprovar, reduzir o espaçamento entre itens ao degrau anterior de token; se ainda assim reprovar, parar e reportar.
- Q: A marca do cabeçalho é texto, logo, ou os dois? → A: **Só texto**, fiel ao `.nav-brand` aprovado.

A premissa do **cabeçalho fixo em todas as larguras** foi mantida de pé por decisão explícita, não
por omissão.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Toda página do site tem a mesma moldura (Priority: P1)

Quem visita o portal encontra o mesmo cabeçalho e o mesmo rodapé em qualquer página, e a marca no
cabeçalho sempre leva de volta à página inicial.

**Why this priority**: é o objeto da feature. Sem a moldura, cada página da F04 em diante
reinventaria a própria — que é exatamente o novelo que o Princípio 9 existe para impedir.

**Independent Test**: abrir cada página pública entregue e conferir que cabeçalho e rodapé são os
mesmos, sem escrever nenhum conteúdo de página.

**Acceptance Scenarios**:

1. **Given** qualquer página pública, **When** carregada, **Then** ela apresenta **um** cabeçalho e
   **um** rodapé, idênticos aos das demais.
2. **Given** o cabeçalho, **When** a marca é acionada, **Then** o visitante vai para a página
   inicial.
3. **Given** qualquer página pública, **When** inspecionada por leitor de tela, **Then** existem as
   regiões de referência **cabeçalho**, **navegação**, **conteúdo principal** e **rodapé** —
   **uma de cada**, identificáveis.
4. **Given** o rodapé, **When** lido, **Then** ele traz a linha institucional da liga e os canais de
   contato.

---

### User Story 2 - O cabeçalho devolve a tela ao celular (Priority: P1)

Quem abre o portal no celular vê o conteúdo da página, não a moldura. O cabeçalho fixo ocupa no
máximo **64 px** de altura.

**Why this priority**: é o defeito mais caro do protótipo e o único que aparece em **toda** página
do site. Corrigi-lo depois da F04 significaria refazer o encaixe de todas as páginas já prontas.

**Independent Test**: medir a altura do cabeçalho em cada uma das sete larguras e comparar com
64 px. Medida, não estimada.

**Acceptance Scenarios**:

1. **Given** o site em 360, 390, 430 e 480 px, **When** o cabeçalho é medido, **Then** a altura é
   **≤ 64 px**, e o número medido é reportado.
2. **Given** o site em 768, 1024 e 1280 px, **When** o cabeçalho é medido, **Then** a altura é
   reportada como número — a exigência dos 64 px é do mobile, mas a medição é das sete.
3. **Given** qualquer largura, **When** a página é rolada, **Then** o cabeçalho permanece visível.
4. **Given** qualquer largura, **When** a página é carregada, **Then** **não há rolagem horizontal**.

---

### User Story 3 - A conversão principal não se esconde (Priority: P1)

No celular, "Processo seletivo" está visível no cabeçalho, fora do menu recolhido. Os outros nove
destinos ficam no painel lateral, aberto por um botão do cabeçalho. Em larguras de desktop, os
destinos aparecem direto no cabeçalho, sem painel e sem botão de abrir.

**Why this priority**: é a razão de o site existir para a liga. Um destino que exige descobrir um
botão de menu antes de ser encontrado perde a maior parte de quem chegaria nele.

**Independent Test**: em cada largura de mobile, conferir que "Processo seletivo" está visível sem
nenhuma interação; em cada largura de desktop, conferir que não existe botão de abrir menu.

**Acceptance Scenarios**:

1. **Given** o site em largura de mobile, **When** a página carrega, **Then** "Processo seletivo"
   está visível no cabeçalho **sem** nenhuma interação.
2. **Given** o site em largura de mobile, **When** a página carrega, **Then** os **nove** demais
   destinos **não** estão visíveis, e existe um botão que abre o painel lateral.
3. **Given** o site em largura de desktop, **When** a página carrega, **Then** os destinos aparecem
   direto no cabeçalho e **não existe** botão de abrir menu nem painel lateral.
4. **Given** o botão de abrir o painel, **When** medido, **Then** seu alvo de toque é **≥ 44 px** em
   todas as larguras.

---

### User Story 4 - Quem usa só o teclado atravessa o site inteiro (Priority: P1)

Uma pessoa que não usa mouse chega a todos os destinos, abre e fecha o painel lateral, e nunca fica
presa nem perde o lugar do foco.

**Why this priority**: é a metade da acessibilidade que **o axe-core não cobre**. Nesta feature, é a
maior parte do que existe para dar errado — e o item que passaria verde sem ninguém notar.

**Independent Test**: percorrer a página só com teclado, num percurso automatizado que **conta** os
passos e verifica onde o foco parou. Verificar o resultado, não a configuração: conferir que
`aria-expanded` existe no HTML é checar configuração; conferir que o foco realmente não sai do
painel é checar resultado (RP-12).

**Acceptance Scenarios**:

1. **Given** a página recém-carregada, **When** o visitante pressiona **Tab** pela primeira vez,
   **Then** o foco vai para o **link de pular para o conteúdo**, e ele fica **visível**.
2. **Given** o link de pular para o conteúdo em foco, **When** acionado, **Then** o foco passa a
   estar no **conteúdo principal**.
3. **Given** o cabeçalho no mobile, **When** o visitante navega por teclado, **Then** o botão do
   painel é **alcançável e acionável** pelo teclado.
4. **Given** o painel aberto, **When** o visitante pressiona **Tab** repetidamente, **Then** o foco
   percorre os itens do painel e **volta ao início** em vez de sair para o conteúdo atrás.
5. **Given** o painel aberto, **When** o visitante pressiona **Esc**, **Then** o painel fecha e o
   foco **retorna ao botão que o abriu**.
6. **Given** o painel aberto, **When** um destino é escolhido, **Then** o painel fecha.
7. **Given** o painel aberto, **When** o visitante toca fora dele, **Then** o painel fecha.
8. **Given** qualquer página, **When** o percurso de foco é registrado, **Then** a **ordem de foco
   corresponde à ordem visual** dos elementos.
9. **Given** o painel aberto, **When** o visitante tenta rolar, **Then** **o conteúdo atrás não
   rola**.

---

### User Story 5 - Quem usa leitor de tela sabe onde está e o que o botão faz (Priority: P1)

O leitor de tela anuncia em que página o visitante está, se o painel está aberto ou fechado, e qual
região aquele botão controla.

**Why this priority**: indicar a página atual só por cor deixa de fora tanto quem usa leitor de tela
quanto quem não distingue as cores. É o mesmo defeito, duas vezes.

**Independent Test**: inspecionar os nomes acessíveis e os estados anunciados, e conferir que a
página atual é anunciada além de ser destacada visualmente.

**Acceptance Scenarios**:

1. **Given** qualquer página, **When** o destino correspondente é lido pelo leitor de tela, **Then**
   ele é anunciado como a **página atual**.
2. **Given** qualquer página, **When** olhada, **Then** o destino correspondente é destacado
   **visualmente**, e o destaque **não depende só de cor**.
3. **Given** o botão do painel, **When** lido, **Then** ele anuncia se o painel está **aberto ou
   fechado** e **qual região** ele controla.
4. **Given** o painel, **When** lido, **Then** ele tem **nome acessível**.

---

### User Story 6 - O `.nav` sai do `liacup.css` já corrigido (Priority: P2)

As classes `.nav` e `.nav-brand` deixam de existir no arquivo de origem, viram componente, e a
reprovação de contraste anotada nas linhas 171–175 do próprio arquivo é corrigida na conversão.

**Why this priority**: é dívida com endereço e prazo — o comentário no arquivo já diz o que fazer e
já aponta a decisão que o autoriza. Deixar para depois é deixar um defeito de contraste conhecido no
ar, no elemento que aparece em toda página.

**Independent Test**: procurar `.nav` no `liacup.css` e não encontrar; contar os seletores restantes;
medir o contraste da cor de link do cabeçalho contra as duas superfícies.

**Acceptance Scenarios**:

1. **Given** o `liacup.css`, **When** procurado por `.nav` e `.nav-brand`, **Then** eles **não
   existem** — nem ativos, nem comentados. O histórico do Git guarda o que havia.
2. **Given** o `liacup.css`, **When** os seletores restantes são contados, **Then** o número é
   **declarado** e bate com o comentário do próprio arquivo. Hoje são **27**; a família `.nav` são
   **5** deles (`.nav`, `.nav-brand`, `.nav a`, `.nav a:hover`, `.nav a[aria-current]`).
3. **Given** o cabeçalho convertido, **When** o link em `:hover` e o link da página atual são
   medidos, **Then** eles usam `--color-accent-700` `#683f74`, e **não** `--color-accent`.
4. **Given** cada combinação de cor que o cabeçalho e o rodapé produzem, **When** medida, **Then** o
   valor é registrado **nomeando as duas cores e a superfície** — inclusive as que passam.

---

### Edge Cases

- **A janela é redimensionada de mobile para desktop com o painel aberto.** O painel deixa de
  existir naquela largura: ele fecha, a trava de rolagem sai, e o foco não fica preso num elemento
  que sumiu.
- **A pessoa escolhe o destino da página em que já está.** O painel fecha do mesmo jeito. O destino
  continua marcado como página atual.
- **O foco está dentro do painel e o painel fecha por toque fora dele.** O foco volta para o botão,
  igual ao Esc — senão ele cai no começo da página e a pessoa perde o lugar.
- **Alguém abre o site com o JavaScript ainda carregando.** O cabeçalho, os destinos e o rodapé já
  precisam estar lá; o que depende de interação é o painel.
- **O nome de um destino é longo demais para a largura disponível.** "Conteúdo educativo" e
  "Processo seletivo" são os dois maiores. Em nenhuma largura isso pode virar rolagem horizontal —
  é a restrição que decide onde a navegação direta no cabeçalho começa a caber (ver FR-014).
- **A página em que o visitante está não é nenhum dos dez destinos.** Nenhum destino é marcado como
  atual. Nada quebra, e a marcação não "chuta" o mais parecido.
- **Alguém abre o painel e usa Shift+Tab logo no primeiro item.** O foco vai para o **último** item
  do painel, não para o cabeçalho atrás.

## Requirements *(mandatory)*

### Requisitos funcionais — Cabeçalho

- **FR-001**: Toda página pública **DEVE** apresentar o **mesmo** cabeçalho e o **mesmo** rodapé.
- **FR-002**: Em largura de mobile, o cabeçalho **DEVE** ser fixo e ocupar **no máximo 64 px** de
  altura.
- **FR-003**: A altura do cabeçalho **DEVE** ser **medida e reportada como número** em cada uma das
  sete larguras — 360, 390, 430, 480, 768, 1024 e 1280 px. Estimativa não conta.
- **FR-004**: A marca no cabeçalho **DEVE** levar à página inicial, e **DEVE** ser **só texto**,
  fiel ao `.nav-brand` aprovado. Logo no cabeçalho seria desvio a registrar no `FIDELIDADE.md` e
  gastaria orçamento horizontal em 360 px, onde a conversão e o botão do painel também moram.
- **FR-005**: Em largura de mobile, o destino **"Processo seletivo" DEVE** permanecer visível no
  cabeçalho, **fora** do painel recolhido, sem exigir nenhuma interação prévia.
- **FR-006**: Em largura de mobile, os **nove** demais destinos **DEVEM** ficar no painel lateral,
  aberto por um botão do cabeçalho.
- **FR-007**: A partir de **1024 px**, os destinos **DEVEM** aparecer direto no cabeçalho, **sem**
  painel lateral e **sem** botão de abrir. Abaixo disso vale o painel. **Plano B autorizado**: se a
  medição do FR-038 reprovar em 1024, reduzir o espaçamento entre itens ao **degrau anterior de
  token**; se ainda assim reprovar, **parar e reportar** — não inventar ponto de corte fora de 480,
  768 e 1024, que a seção 3 dos padrões chama de dívida.
- **FR-008**: A conversão "Processo seletivo" no cabeçalho **DEVE** ser um **link com aparência de
  botão**. Ele navega, então é `<a>` — nunca um `<button>` que navega. O componente **não existe** e
  é **declarado como escopo desta feature**, com os requisitos FR-045 e SC-018 governando como ele
  carrega a aparência.

### Requisitos funcionais — Painel lateral

- **FR-009**: O painel **DEVE** fechar de **três** formas: ao escolher um destino, ao pressionar
  **Esc**, e ao tocar fora dele.
- **FR-010**: Enquanto o painel está aberto, o conteúdo atrás **NÃO PODE** rolar.
- **FR-011**: Enquanto o painel está aberto, o foco de teclado **NÃO PODE** sair dele.
- **FR-012**: Ao fechar, o foco **DEVE** voltar para o botão que o abriu — qualquer que tenha sido a
  forma de fechar.
- **FR-013**: O botão **DEVE** declarar, de forma que o leitor de tela anuncie, **se o painel está
  aberto ou fechado** e **qual região ele controla**. O painel **DEVE** ter **nome acessível**.

### Requisitos funcionais — Navegação

- **FR-014**: **DEVEM** existir **dez** destinos: Início, Sobre, Notícias, Conteúdo educativo,
  Eventos, Projetos, Materiais, Galeria, Processo seletivo e Contato.
- **FR-015**: Cada destino **DEVE** ter uma rota que responde. Os que ainda não têm página recebem
  uma **rota mínima, visivelmente marcada como em construção** — Princípio 6 ("o espaço reservado é
  visivelmente marcado") e Princípio 8 ("o que está incompleto é declarado incompleto"). A rota
  mínima **NÃO PODE** conter conteúdo institucional: ela é o aviso de que a página ainda não existe,
  não um rascunho dela. Consequência declarada: esta feature entrega **dez** páginas, e as dez
  entram sob RP-04, RP-05, RP-06 e RP-07.
- **FR-016**: A página em que o visitante está **DEVE** ser indicada **visualmente** e também
  **anunciada** ao leitor de tela. A indicação visual **NÃO PODE** depender só de cor.
- **FR-017**: **DEVE** existir um **link de pular para o conteúdo**, que é o **primeiro** elemento a
  receber foco na página e fica **visível** quando recebe foco.
- **FR-018**: Acionar o link de pular para o conteúdo **DEVE** mover o foco para o conteúdo
  principal.
- **FR-019**: A **ordem de foco DEVE** seguir a **ordem visual** dos elementos.
- **FR-020**: Cada página **DEVE** ter as regiões de referência **cabeçalho**, **navegação**,
  **conteúdo principal** e **rodapé** — **uma de cada**, identificáveis por leitor de tela.

### Requisitos funcionais — Rodapé

- **FR-021**: O rodapé **DEVE** trazer a linha institucional e os canais de contato da liga.
- **FR-022**: Os canais de contato **DEVEM** usar o componente já existente
  `src/componentes/layout/LinksDeContato.tsx`, com os valores já confirmados: `liacup.unb@gmail.com`
  e `@liacup.unb`.
- **FR-023**: **NENHUM** endereço de e-mail, perfil ou telefone novo **PODE** ser escrito em nenhum
  arquivo desta feature. O e-mail inventado que aparece no protótipo (o do domínio `unb.br`)
  **NÃO PODE** existir em nenhum arquivo entregue — verificado por varredura, não por leitura.
- **FR-024**: **NENHUM** dado institucional que não esteja em `docs/conteudo-institucional.md` com
  **fonte nomeada PODE** aparecer na tela.
- **FR-025**: O rodapé **DEVE** trazer a sede em **forma curta** — "FCTS · Campus UnB Ceilândia" —,
  com fonte nomeada em `docs/conteudo-institucional.md` §1 (Estatuto, Art. 1º). **NENHUM** endereço
  postal completo entra: nem logradouro, nem CEP. O protótipo traz "Faculdade de Medicina · Campus
  Darcy Ribeiro", que é inventado; a §7 do mesmo documento manda corrigir, e é o que esta linha faz.

### Requisitos funcionais — Fidelidade e estilo

- **FR-026**: A feature **DEVE** usar apenas os componentes que a F01 entregou — `Botao`, `Cartao`,
  `Etiqueta`, `Campo`, `Separador`, `Icone`, `EstadoVazio` — mais os componentes de layout que ela
  própria cria.
- **FR-027**: **Zero** valores de cor, espaçamento, raio, sombra ou tipografia escritos à mão.
  Origem: **RP-02**.
- **FR-028**: **NENHUM** token existente **PODE** ser alterado. Token novo, se houver, tem **origem
  nomeada e justificativa escrita**. Origem: **RP-03**.
- **FR-029**: **Uma** extensão está pré-autorizada, e só ela: acrescentar à união fechada de
  `NomeDoIcone` os desenhos que o cabeçalho exige — **abrir** e **fechar** o menu. Os dois **DEVEM**
  ser registrados como acréscimo, com o motivo.
- **FR-030**: Se faltar **qualquer outro** componente, a implementação **DEVE parar e reportar**.
  Não improvisar um, não escrever estilo solto para contornar. Componente faltando é **achado** da
  feature.

### Requisitos funcionais — Conversão do `.nav`

- **FR-031**: `.nav` e `.nav-brand` **DEVEM** sair do `liacup.css` — nem ativos, nem comentados.
- **FR-032**: A contagem de seletores restantes no `liacup.css` **DEVE** ser **declarada** como
  número. Hoje são **27**; a família `.nav` são **5** deles.
- **FR-033**: A conversão **DEVE** aplicar a correção anotada nas linhas 171–175 do próprio arquivo:
  o link em `:hover` e o link da página atual usam `--color-accent`, que mede **3,48:1 sobre
  `--color-bg` `#f5ead8`** e reprova o AA. Passam a usar **`--color-accent-700` `#683f74`**, que
  mede **6,91:1 sobre `--color-bg` `#f5ead8`** e **6,15:1 sobre `--color-surface` `#ebddc5`**. É a
  reatribuição de cor de link já decidida na **ADR-0003 §2** — **não é decisão nova**.
- **FR-034**: **DEVEM** ser medidas **todas** as combinações de cor que o cabeçalho e o rodapé
  produzem, não só a corrigida — incluindo **contraste de borda e de separador**, que o axe-core
  **não** verifica. Na F01, quatro defeitos apareceram justamente nas combinações que ninguém tinha
  olhado, e o da borda de controle nenhuma regra de axe pega.
- **FR-035**: Toda diferença em relação ao design aprovado **DEVE** ter **veredito e motivo escrito**
  no `FIDELIDADE.md` da feature. Origem: **RP-08**.
- **FR-036**: Todo valor de contraste **DEVE** nomear **as duas cores e a superfície**. Número solto
  não vale como registro. Origem: **RP-09**.

### Requisitos funcionais — Verificação

- **FR-037**: **Zero** alvos de toque abaixo de **44 px**, com o **número de elementos medidos** na
  saída. Origem: **RP-04**.
- **FR-038**: **Zero** rolagem horizontal em **360, 390, 430, 480, 768, 1024 e 1280 px**. Origem:
  **RP-05**.
- **FR-039**: Lighthouse **desempenho ≥ 90** e **acessibilidade ≥ 95**, contra a versão
  **compilada** e em **mobile simulado**. Origem: **RP-06**. O preset **DEVE** estar declarado, e o
  número só vale no preset declarado. **Contradição corrigida nesta feature**: o item F1 do
  `docs/checklist-validacao.md` manda "execução em mobile simulado" desde a F00, e o
  `lighthouserc.json` fixava `preset: desktop`. Os dois se contradiziam por escrito havia três
  features. Foi inofensivo porque nenhuma delas era sobre o mobile; **esta é** — o objeto inteiro da
  F03 é derrubar um cabeçalho que come 29% de um iPhone. Medir isso em desktop é medir outra coisa.
- **FR-040**: **Zero** violações do axe-core em **toda página entregue**. Origem: **RP-07**.
- **FR-041**: Toda verificação nova **DEVE** ser demonstrada **falhando** diante de violação real e
  voltando ao verde, **DEVE dizer quanto mediu**, e **DEVE checar o resultado, não a configuração**.
  Origem: **RP-12**.
- **FR-042**: A operabilidade por teclado **DEVE** ter verificação própria, separada do axe, que
  **percorra de verdade e conte**, cobrindo os sete percursos: primeiro Tab alcança o link de pular
  e ele fica visível; acionar o link move o foco para o conteúdo; o botão do menu é alcançável e
  acionável por teclado; com o painel aberto, Tab percorre os itens e volta ao início; Esc fecha e
  devolve o foco ao botão; escolher um destino fecha o painel; a ordem de foco corresponde à ordem
  visual.
- **FR-043**: A contagem de **dependências diretas DEVE** ser declarada, e toda dependência nova
  **DEVE** estar justificada por escrito no `plan.md` **antes** de entrar. Origem: **RP-01**.
- **FR-044**: O conjunto de páginas verificadas **DEVE** ser **derivado da mesma lista de destinos
  que a navegação desenha** — **uma lista, dois consumidores**. Acrescentar um destino **NÃO PODE**
  deixar uma página fora da verificação. Vale para **todas** as verificações por página: axe,
  rolagem horizontal, alvo de toque, altura do cabeçalho e Lighthouse.
- **FR-045**: O `Botao` e o link com aparência de botão **DEVEM** ter uma **única origem de
  aparência**. Alteração visual em um **DEVE** aparecer no outro **sem edição em dois lugares**.
- **FR-046**: Os comentários de `src/componentes/layout/Rodape.tsx` e
  `src/componentes/layout/LinksDeContato.tsx` **DEVEM** ser atualizados nesta feature. Os dois
  descrevem hoje um arranjo que esta feature desfaz — que o rodapé traz só a linha institucional e
  que os canais de contato moram fora dele. Comentário que descreve o arranjo antigo é pior que
  comentário nenhum, porque é lido como se valesse.

### Requisitos permanentes aplicáveis

Da seção 8.1 de `docs/PADROES-DE-CODIGO.md`. Esta feature não os redescobre: cita.

| RP | Aplica? | Observação |
| --- | --- | --- |
| **RP-01** dependências declaradas e justificadas | **Sim** | FR-043. A expectativa é **zero** novas — ver Restrições |
| **RP-02** zero valores de estilo à mão | **Sim** | FR-027. Primeira feature de tela desde a F01 |
| **RP-03** nenhum token alterado | **Sim** | FR-028. Token novo com origem nomeada é permitido; alterar existente, não |
| **RP-04** alvo de toque 44 px | **Sim** | FR-037, com o número de elementos medidos |
| **RP-05** sete larguras sem rolagem | **Sim** | FR-038. É onde um cabeçalho de dez destinos pode quebrar |
| **RP-06** Lighthouse 90 / 95 | **Sim** | FR-039, contra a versão compilada e em **mobile simulado** — o preset era desktop e contradizia o checklist |
| **RP-07** zero violações do axe | **Sim** | FR-040, em toda página entregue |
| **RP-08** diferença do aprovado com veredito | **Sim** | FR-035. `.nav` e `.nav-brand` são convertidos aqui |
| **RP-09** contraste nomeia as duas cores | **Sim** | FR-033, FR-034, FR-036 |
| **RP-10** nenhum segredo no repositório | Sim | Herdado; esta feature não introduz credencial |
| **RP-11** RLS ativa e política testada bloqueando | **Não** | Nenhuma tabela nesta feature — a moldura não lê banco |
| **RP-12** verificação vista falhando, com contador | **Sim** | FR-041, FR-042, SC-017. As verificações de teclado são novas |
| **RP-13** artefato gerado fora do controle de versão | **Sim** | Herdado. Esta feature acrescenta rotas e componentes, nenhum artefato gerado — mas o verificador roda no CI como os demais |

### Achado — falta um componente, e ele entra como escopo declarado

Registrado aqui porque **componente faltando é informação, não obstáculo a contornar** (FR-030).

O `Botao` da F01 renderiza `<button>` e o comentário do próprio arquivo diz, em "QUANDO NÃO USAR",
que navegação não é papel dele: se leva a outro endereço, é `<a>`. A seção 5 dos padrões diz o
mesmo. Com o FR-008 decidido, **falta um componente**, e ele entra nesta feature **declarado**, não
como extra silencioso.

**Ele não é especulativo.** Tem três consumidores nomeados antes de existir: o cabeçalho aqui, a
chamada da home na F04, e o "Botão de inscrição" que o `docs/conteudo-institucional.md` §5.1 já
especifica para a F12 — um link para o formulário externo da liga. É o oposto da API adivinhada que
a F01 recusou.

**O risco não é o componente; é como ele carrega a aparência.** Uma cópia própria do visual do
`Botao` são duas fontes de verdade para a mesma aparência, e a próxima correção de contraste acerta
uma e esquece a outra. É a classe da cascata escondida que a F01 pegou no `liacup.css` — só que
criada nova, hoje, de propósito. Por isso o FR-045 exige **origem única de aparência**, e o SC-018
exige que a igualdade seja **verificada, não olhada**, com os dois lado a lado na vitrine.

A vitrine não é enfeite aqui: foi nela que os quatro defeitos de contraste da F01 apareceram,
porque foi a primeira vez que todas as combinações estiveram juntas na mesma tela.

### Escopo — o que **não** entra nesta feature

- **O conteúdo das páginas** — F04 em diante. Nem "de brinde". A rota mínima do FR-015 **não é
  exceção a isto**: ela declara que a página ainda não existe e não carrega uma linha de conteúdo
  institucional. Se alguém sentir vontade de "só adiantar o texto do Sobre", isso é F05.
- **O painel administrativo** — Fase 2.
- **A autenticação** — F14.
- **Qualquer componente que só o painel usa.**
- Nenhuma leitura de banco: a moldura não conhece feature nem dado.

### Restrições

- **Nenhuma dependência nova sem justificativa escrita no `plan.md`, antes de entrar** (RP-01). Em
  particular: **nenhuma biblioteca de terceiros** para painel lateral, prisão de foco ou trava de
  rolagem. Esses três comportamentos são o miolo desta feature e cabem em código próprio, legível
  por quem vier depois (Princípio 1).
- **A spec descreve comportamento e regra.** Tecnologia é assunto do `plan.md`.
- **Se ao implementar ficar claro que algum critério aqui está errado ou impossível, parar e
  reportar** — não corrigir por conta própria (Princípio 5).

## Success Criteria *(mandatory)*

### Resultados mensuráveis

- **SC-001**: Altura do cabeçalho **≤ 64 px** em 360, 390, 430 e 480 px, com o **número medido**
  reportado em cada uma das **sete** larguras. Ponto de partida documentado: **244 px** no protótipo.
- **SC-002**: **Zero** rolagem horizontal nas **sete** larguras.
- **SC-003**: **Zero** alvos de toque abaixo de **44 px**, com o **número de elementos medidos** na
  saída — não apenas "zero falhas".
- **SC-004**: **Zero** violações do axe-core em **100%** das páginas entregues.
- **SC-005**: Lighthouse **desempenho ≥ 90** e **acessibilidade ≥ 95** contra a versão compilada.
- **SC-006**: **7 de 7** percursos de teclado verificados por percurso real (FR-042), cada um
  demonstrado **falhando** e voltando ao verde.
- **SC-007**: **100%** das combinações de cor do cabeçalho e do rodapé medidas e registradas com
  **as duas cores e a superfície nomeadas** — incluindo as que passam e incluindo bordas e
  separadores.
- **SC-008**: **Zero** ocorrências de `.nav` e `.nav-brand` no `liacup.css`, e a contagem de
  seletores restantes declarada: **27 hoje, 22 depois**.

  **Regra de contagem, porque o número sozinho não é reproduzível**: contam-se os **seletores
  abaixo do banner "O QUE AINDA NAO FOI CONVERTIDO", separados por vírgula**. O mesmo arquivo
  admite outras leituras defensáveis — **59** se forem todos os seletores, incluindo `body`, `h1`,
  `a` e o reset; **29** se forem as classes de componente incluindo as que estão acima do banner. A
  diferença entre 27 e 29 é `.washed` (L75) e `.text-muted` (L104), que **seguem no arquivo, fora
  desta conta e fora desta feature**. `.text-muted` não é neutro: está no encerramento da Fase 0
  como pendência aberta, com **3,58:1** medido. Esta feature não o toca, e não o esconde.

  Mesma ambiguidade do SC-012 da F00, que precisou da emenda R2. Mesmo remédio: a regra de contagem
  vai escrita junto do número.
- **SC-009**: **Zero** ocorrências do e-mail inventado do protótipo em qualquer arquivo entregue,
  verificado por varredura.
- **SC-010**: **Zero** dados institucionais na tela sem fonte nomeada em
  `docs/conteudo-institucional.md`.
- **SC-011**: **Zero** valores de estilo escritos à mão, e **zero** linhas alteradas de token
  existente — a diferença do `tokens.css` mostra só linhas acrescentadas, se houver.
- **SC-012**: **Zero** dependências novas, ou cada nova justificada por escrito no `plan.md` antes de
  entrar, com a contagem declarada. Hoje: **22 diretas — 4 de execução e 18 de desenvolvimento**.
- **SC-013**: **Zero** linhas de diferença em relação ao design aprovado sem veredito e motivo no
  `FIDELIDADE.md`.
- **SC-014**: **Uma** de cada região de referência por página — cabeçalho, navegação, conteúdo
  principal e rodapé —, verificado em **100%** das páginas entregues.
- **SC-015**: Exatamente **dois** nomes acrescentados à união `NomeDoIcone`, ambos com motivo
  registrado. Um terceiro é desvio a reportar.
- **SC-016**: Todas as verificações herdadas continuam passando: tipos, análise estática, formatação,
  tokens, camadas, testes de unidade, de ponta a ponta e de políticas.
- **SC-017**: O **número de páginas verificadas é reportado** e é **igual ao número de destinos
  entregues**. Hoje: **10 e 10**. **Demonstrado falhando (RP-12)**: acrescentar um destino sem tocar
  em mais nada deixa a verificação **vermelha, nomeando a página que ficou de fora**.
- **SC-018**: O `Botao` e o link com aparência de botão aparecem **lado a lado na vitrine**, em
  **todas as variantes e estados**, e a **aparência calculada dos dois é idêntica — verificado, não
  olhado**. O alvo do link é **≥ 44 px**.

## Dependencies

- **F00, F01 e F02 concluídas.** CI, verificações, tokens e os sete componentes de base já existem e
  não são refeitos.
- **`src/componentes/layout/LinksDeContato.tsx`** — já existe, com os valores confirmados. Esta
  feature **usa**, não reescreve.
- **`docs/conteudo-institucional.md`** — única fonte do que pode aparecer na tela.
- **ADR-0003 §2** — autoriza a cor de link corrigida. **ADR-0004 §2.1** — os 44 px.
- **`liacup.css`, linhas 168–175** — a anotação de origem da correção do `.nav`.

## Assumptions

Padrões adotados onde a descrição não decidiu. Cada um é reversível na resposta ao clarify.

- **O cabeçalho é fixo em todas as larguras**, não só no mobile. O critério nomeia o mobile porque é
  lá que os 64 px doem; um comportamento só é menos coisa para quem mantém entender (Princípio 1).
- **"Equipe" não é um destino separado.** Os dez destinos batem com o plano de desenvolvimento, onde
  a F05 é "Sobre, Equipe e Docentes" — Equipe vive dentro de Sobre.
- **O rodapé não repete a navegação.** Ele traz a linha institucional e os canais de contato, como
  descrito. Repetir dez destinos no rodapé é decisão da F04 em diante, se alguém quiser.
- **Os canais de contato passam a morar no rodapé.** Hoje o `LinksDeContato` é renderizado dentro do
  `<main>` da página provisória, e os comentários de `Rodape.tsx` e `LinksDeContato.tsx` descrevem
  esse arranjo. **Isto deixou de ser premissa e virou o FR-046**: premissa não tem dono e nenhuma
  tarefa a cobra — foi por isso que subiu para requisito.
- **A moldura não trata carregando, erro e vazio.** A seção 2.6 dos padrões cobre componente que
  **exibe dado**; a moldura não exibe dado nenhum. Isso volta a valer na F04.
- **Os 64 px e os 44 px cabem juntos, mas com folga apertada.** 44 px de alvo mais `--space-2`
  (8,8 px) acima e abaixo dão **61,6 px** — cabem. Com `--space-3` (13,2 px) dariam **70,4 px** —
  não cabem. O orçamento vertical do cabeçalho no mobile é, na prática, um valor de espaçamento só.
  Registrado aqui porque é o tipo de aritmética que se descobre tarde.
- **Dez destinos lado a lado no cabeçalho são apertados mesmo em 1024 px.** Estimativa com a
  tipografia aprovada de 14 px: cerca de 644 px de texto mais cerca de 158 px de espaçamento entre
  itens, mais a marca e o preenchimento, chegam perto dos 1024 px antes de a conversão entrar. **É
  estimativa, não medição.** A largura foi decidida em 1024 com plano B (FR-007), e quem dá o
  veredito é o FR-038 — a medição, não esta conta.
- **A verificação por página passa a ser derivada, não escrita à mão.** Acrescentar as nove URLs ao
  `lighthouserc.json` e nove `page.goto` ao teste de ponta a ponta funcionaria hoje e criaria duas
  listas mantidas em paralelo — a dos destinos que a navegação desenha e a das páginas que a
  verificação visita. Listas paralelas divergem, e aqui a divergência é **silenciosa e verde**. É o
  que o FR-044 e o SC-017 existem para impedir. **Como derivar é assunto do `plan.md`**; a spec só
  exige que seja uma lista só.
