# Especificação da feature: Design system em componentes (F01)

**Feature Branch**: `feat/F01-design-system`

**Created**: 2026-08-21

**Status**: Draft

**Input**: Descrição do usuário: "Converter o design system aprovado pela liga em componentes React reaproveitáveis, cobrindo o que o site público vai consumir."

---

## Resumo

O `liacup.css` aprovado pela liga tem 62 classes de componente. A F00 deliberadamente **não** as
migrou, para não deixar duas implementações de botão convivendo — uma em CSS e outra em React. Esta
feature faz a conversão: as classes que o **site público** vai consumir viram componentes React
tipados, testados e mostrados numa página de vitrine.

O que se ganha não é código bonito: é que a partir daqui toda página do site é montada com peças que
já foram verificadas em acessibilidade, em responsividade e em fidelidade ao aprovado. Cada página
seguinte deixa de refazer essas três verificações do zero.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - As peças de base existem e são tipadas (Priority: P1)

Quem for construir a página Sobre, ou Notícias, ou Processo Seletivo, encontra pronto o botão, o
cartão, a etiqueta, o campo de formulário e o separador — cada um aceitando exatamente as variantes
que o design aprovado prevê, e recusando o que não existe.

**Why this priority**: é o objeto da feature. Sem as peças, cada página seguinte inventa a sua e o
design system aprovado vira decoração.

**Independent Test**: escrever uma variante inexistente e ver a verificação de tipos recusar;
escrever uma existente e ver funcionar.

**Acceptance Scenarios**:

1. **Given** a camada `componentes/ui`, **When** inspecionada, **Then** existem componentes para
   **botão, cartão, etiqueta, campo de formulário e separador**, somados ao **ícone** e ao
   **estado vazio** que já vieram da F00.
2. **Given** qualquer um desses componentes, **When** recebe uma variante fora do conjunto previsto,
   **Then** a verificação de tipos **falha** — estado impossível não compila.
3. **Given** qualquer um desses componentes, **When** se tenta descrever seu estado por booleanas
   combináveis, **Then** isso não é possível: a variante é **uma união fechada de valores**, não um
   conjunto de sinalizadores independentes.
4. **Given** o componente de cartão, **When** recebe conteúdo, **Then** ele o compõe por
   `children` e por partes nomeadas — e **não** por uma prop para cada formato possível.
5. **Given** qualquer componente de base, **When** seus imports são inspecionados, **Then** ele não
   conhece domínio, banco de dados nem rota (regra Z1, já verificada pelo CI).
6. **Given** qualquer arquivo de estilo dos componentes, **When** inspecionado, **Then** nenhum
   valor de cor, espaçamento, raio, sombra ou tipografia está escrito à mão.

---

### User Story 2 - O campo de formulário é utilizável por todo mundo (Priority: P1)

Uma pessoa que preenche o formulário "Fale com a Liga" — inclusive quem usa leitor de tela ou só o
teclado — entende o que cada campo pede, recebe ajuda quando existe, vê o erro quando erra, e
percebe quando um campo está desabilitado.

**Why this priority**: é o componente com mais superfície de acessibilidade do conjunto, e o único
que recebe entrada de gente. Errar aqui bloqueia o público que este site mais precisa alcançar.

**Independent Test**: navegar o campo só pelo teclado, com leitor de tela ligado, nos quatro
estados.

**Acceptance Scenarios**:

1. **Given** um campo de formulário, **When** renderizado, **Then** tem **rótulo associado**
   programaticamente ao controle — não apenas um texto posicionado ao lado.
2. **Given** um campo com texto de ajuda, **When** o controle recebe foco, **Then** a ajuda é
   anunciada junto com o rótulo.
3. **Given** um campo com erro, **When** o erro aparece, **Then** ele é **anunciado a leitor de
   tela** e o controle é marcado como inválido.
4. **Given** um campo desabilitado, **When** apresentado, **Then** isso é perceptível visualmente
   **e** programaticamente, e o campo não recebe foco por tabulação.
5. **Given** um campo com erro, **When** apresentado, **Then** a informação **não depende só da
   cor** para ser percebida.

---

### User Story 3 - A vitrine mostra o sistema inteiro (Priority: P2)

Existe um endereço interno que exibe todos os componentes, em todas as variantes e em todos os
estados — inclusive erro e desabilitado. É por ele que se revisa o design system sem precisar
navegar o site, e é sobre ele que as verificações automáticas rodam.

**Why this priority**: sem a vitrine, "todas as variantes funcionam" é afirmação sem prova, e a
verificação de acessibilidade não teria onde rodar. Vem depois da US1 porque exibe o que ela cria.

**Independent Test**: abrir o endereço e conferir que cada componente aparece com cada variante e
cada estado.

**Acceptance Scenarios**:

1. **Given** a vitrine, **When** aberta, **Then** exibe **todos** os componentes de base, cada um em
   **todas** as suas variantes e estados, incluindo **erro** e **desabilitado**.
2. **Given** o site público, **When** navegado por qualquer caminho a partir da página inicial,
   **Then** **não** existe link que leve à vitrine.
3. **Given** a vitrine, **When** a verificação automática de acessibilidade roda sobre ela,
   **Then** acusa **zero violações**.
4. **Given** a vitrine, **When** medidos todos os alvos clicáveis, **Then** **nenhum** tem menos de
   **44 pixels** em qualquer dimensão.
5. **Given** a vitrine, **When** carregada em 360, 390, 430, 480, 768, 1024 e 1280 px, **Then** não
   há rolagem horizontal em nenhuma dessas larguras.
6. **Given** a vitrine, **When** um componente novo é acrescentado ao sistema e não aparece nela,
   **Then** isso é considerado entrega incompleta.

---

### User Story 4 - A conversão é fiel e rastreável (Priority: P2)

A aparência de cada componente corresponde ao que a liga aprovou. E quem olhar o arquivo original
consegue dizer, sem adivinhar, o que já virou componente e o que ainda falta.

**Why this priority**: é o Princípio VI aplicado. Conversão que "melhora" o design por conta própria
descarta a revisão pela qual a liga passou.

**Independent Test**: comparar cada componente com a classe correspondente do `liacup.css`; abrir o
arquivo original e listar o que resta.

**Acceptance Scenarios**:

1. **Given** cada componente convertido, **When** comparado com a classe de origem no `liacup.css`,
   **Then** a aparência corresponde, com as reatribuições do ADR-0003 já aplicadas.
2. **Given** o arquivo de tokens, **When** comparado com o estado ao fim da F00, **Then** **nenhum
   valor de token foi alterado**. Token novo pode ter sido criado, e cada um tem justificativa
   escrita.
3. **Given** o `liacup.css`, **When** inspecionado ao fim da feature, **Then** as classes já
   convertidas **saíram** dele, e o que resta está **identificável** como pendente de conversão.
4. **Given** qualquer desvio deliberado do aprovado, **When** existir, **Then** está registrado por
   escrito com o motivo — não aplicado em silêncio.

---

### User Story 5 - Quem vem depois sabe usar sem perguntar (Priority: P3)

Um estudante que assume o projeto abre um componente e entende, ali mesmo, o que ele é, quando usar
e quando **não** usar. E sabe onde ver o sistema inteiro de uma vez.

**Why this priority**: é o Princípio I aplicado ao design system. Fica em P3 porque documenta o que
as anteriores constroem — mas sem ela a feature não está pronta.

**Independent Test**: pedir a alguém que não participou para escolher o componente certo para uma
tela descrita em voz alta, usando só o que está escrito nos arquivos.

**Acceptance Scenarios**:

1. **Given** qualquer componente de base, **When** aberto, **Then** traz no próprio arquivo uma
   explicação curta de **o que é, quando usar e quando não usar**.
2. **Given** o README, **When** lido, **Then** aponta a vitrine como o lugar de ver o sistema
   inteiro, com o endereço.
3. **Given** um componente com armadilha conhecida — por exemplo, ícone decorativo contra ícone com
   significado —, **When** documentado, **Then** o "quando não usar" nomeia a armadilha.

---

### Edge Cases

- **Um campo de formulário sem rótulo visível** (busca com lupa, por exemplo). O rótulo continua
  obrigatório, apenas apresentado de forma acessível a leitor de tela sem ocupar espaço na tela. A
  vitrine mostra esse caso.
- **Um campo com erro e desabilitado ao mesmo tempo.** Combinação improvável mas possível: a
  apresentação precisa ser definida, não acidental.
- **Um cartão sem título, ou sem corpo, ou só com imagem.** Composição precisa aguentar as partes
  faltando sem quebrar o espaçamento.
- **Uma etiqueta com texto longo em 360 px.** Não pode empurrar a largura da página nem cortar o
  texto de forma ilegível.
- **Um botão de ícone sem texto.** Precisa de rótulo acessível, senão o leitor de tela anuncia um
  botão sem nome. É o caso que o `Icone` da F00 explicitamente **não** cobre.
- **Dois campos com o mesmo rótulo na mesma página.** A associação rótulo-controle precisa continuar
  correta, sem identificadores colidindo.
- **A vitrine cresce e passa a ter dezenas de exemplos.** Precisa continuar sem rolagem horizontal e
  com estrutura de títulos coerente, sem pular níveis.

## Requirements *(mandatory)*

### Requisitos funcionais — Componentes de base

- **FR-001**: **DEVEM** existir componentes de base para **botão, cartão, etiqueta, campo de
  formulário e separador**, somados ao **ícone** e ao **estado vazio** entregues na F00.
- **FR-002**: Cada componente **DEVE** expressar suas variantes como **união fechada de valores**;
  combinação de booleanas que permita estado impossível **NÃO PODE** compilar.
- **FR-003**: Nenhum componente de base **PODE** conhecer domínio, banco de dados ou rota. Recebe
  props e desenha.
- **FR-004**: O cartão **DEVE** aceitar conteúdo por composição — `children` e partes nomeadas —, e
  **NÃO** por uma prop para cada formato possível.
- **FR-005**: Todo valor de cor, espaçamento, raio, sombra e tipografia **DEVE** vir dos tokens.
  Nenhum valor escrito à mão (já verificado pelo CI desde a F00).
- **FR-006**: O campo de formulário **DEVE** tratar **rótulo associado, texto de ajuda, mensagem de
  erro e estado desabilitado**.
- **FR-007**: A mensagem de erro do campo **DEVE** ser anunciada a leitor de tela, marcar o controle
  como inválido, e **não depender apenas da cor** para ser percebida.
- **FR-008**: Componente de base que aceite interação **DEVE** ser operável por teclado, com foco
  visível.

### Requisitos funcionais — Fidelidade ao aprovado

- **FR-009**: A aparência de cada componente **DEVE** corresponder à classe de origem no
  `liacup.css`, com as reatribuições do ADR-0003 aplicadas.
- **FR-010**: **Nenhum valor de token PODE ser alterado.** Token novo pode ser criado, com
  justificativa escrita.
- **FR-011**: As classes convertidas **DEVEM** sair do `liacup.css`, e o que ainda não foi convertido
  **DEVE** permanecer identificável como pendente.
- **FR-012**: Qualquer desvio deliberado do design aprovado **DEVE** ser registrado por escrito com o
  motivo, e ter aval explícito — nunca aplicado em silêncio (Princípio VI).

### Requisitos funcionais — Vitrine e verificação

- **FR-013**: **DEVE** existir uma página interna de vitrine exibindo todos os componentes de base,
  em **todas** as variantes e **todos** os estados, incluindo erro e desabilitado.
- **FR-014**: A vitrine **NÃO PODE** ser alcançável pela navegação do site público — nenhum link
  leva a ela a partir de qualquer página pública.
- **FR-015**: A verificação automática de acessibilidade **DEVE** rodar sobre a vitrine e acusar
  **zero violações**.
- **FR-016**: **Nenhum alvo de toque da vitrine PODE** ter menos de **44 pixels** em qualquer
  dimensão, e isso **DEVE** ser verificado automaticamente.
- **FR-017**: A vitrine **NÃO PODE** gerar rolagem horizontal em 360, 390, 430, 480, 768, 1024 e
  1280 px, verificado automaticamente.
- **FR-018**: Todo componente de base **DEVE** ter teste de unidade cobrindo **renderização,
  variantes e interação** quando houver interação.

### Requisitos funcionais — Documentação

- **FR-019**: Cada componente **DEVE** trazer, no próprio arquivo, explicação curta de **o que é,
  quando usar e quando não usar**.
- **FR-020**: O README **DEVE** apontar a vitrine como o lugar de ver o sistema inteiro, com o
  endereço.
- **FR-021**: Toda dependência nova **DEVE** estar justificada por escrito no `plan.md` antes de
  entrar, e a contagem de dependências diretas **DEVE** bater com a tabela do plano.

### Escopo — o que **não** entra nesta feature

- **Nenhuma página real do site.** Sobre, Projetos, Equipe, Notícias e Processo Seletivo continuam
  fora.
- **Nenhum componente que só o painel administrativo usa** — tabela, diálogo, seletor segmentado e
  campo de opção entram na Fase 2, junto das telas que os consomem.
- **Nenhuma biblioteca de componentes de terceiros.** O design system da liga é o nosso.
- **Nenhuma dependência nova sem justificativa escrita no plano.**
- **Navegação do site** (cabeçalho, menu) fica para a feature que entrega o primeiro layout público.
- Supabase e banco (F02), autenticação (F14), envio de e-mail (F13).

## Success Criteria *(mandatory)*

### Resultados mensuráveis

- **SC-001**: **7 componentes de base** disponíveis — botão, cartão, etiqueta, campo, separador,
  ícone e estado vazio.
- **SC-002**: **100%** dos componentes de base têm teste de unidade cobrindo renderização e
  variantes, e interação onde há interação.
- **SC-003**: A verificação automática de acessibilidade sobre a vitrine retorna **zero violações**.
- **SC-004**: **Zero** alvos de toque abaixo de 44 pixels na vitrine, medido automaticamente e
  reportado como número.
- **SC-005**: **Zero** ocorrências de rolagem horizontal na vitrine nas **sete** larguras
  verificadas.
- **SC-006**: **Zero** valores de cor, espaçamento, raio, sombra ou tipografia escritos à mão fora
  do arquivo de tokens.
- **SC-007**: **Zero** valores de token alterados em relação ao fim da F00; todo token novo tem
  justificativa escrita.
- **SC-008**: **Zero** links do site público levam à vitrine, verificado automaticamente.
- **SC-009**: O número de classes restantes no `liacup.css` é **menor** que ao fim da F00, e as
  restantes são identificáveis uma a uma como pendentes.
- **SC-010**: **100%** dos componentes de base trazem no arquivo o que é, quando usar e quando não
  usar.
- **SC-011**: Uma pessoa que não participou escolhe o componente certo para uma tela descrita, usando
  só o que está escrito nos arquivos, **sem perguntar nada**.
- **SC-012**: O número de dependências diretas é **igual** ao declarado na tabela do `plan.md`.
- **SC-013**: Todas as verificações herdadas da F00 continuam passando: tipos, análise estática,
  formatação, tokens, camadas, testes e medidor de desempenho.

## Dependencies

- **F00 concluída** — a fundação entrega os tokens em `src/estilos/tokens.css`, a regra de camadas
  verificada, o verificador de tokens, os testes de unidade e de ponta a ponta, e o CI. Esta feature
  constrói em cima disso e **não** refaz nada.
- **`liacup.css` na raiz** — as 62 classes de componente que a F00 deliberadamente deixou para cá.
  É o insumo desta feature.
- **ADR-0003** — as reatribuições de token e a decisão sobre fontes, que precisam estar aplicadas em
  cada componente convertido.
- **Componentes já entregues na F00** — `Botao`, `Icone` e `EstadoVazio` existem e serão
  **completados**, não recriados: o botão ainda não tem todas as variantes previstas no `liacup.css`.

## Assumptions

- **Escopo de "o que o site público vai consumir"**: botão, cartão, etiqueta, campo de formulário e
  separador, conforme a lista da descrição. Tabela, diálogo, seletor segmentado e campo de opção
  existem no `liacup.css` mas ficam para a Fase 2, com as telas do painel que os usam.
- **"Campo de formulário"** cobre entrada de texto de uma linha e de várias linhas, que é o que o
  `liacup.css` prevê na mesma classe. Seleção, opção e caixa de marcação entram quando houver tela
  que as peça.
- **A vitrine é publicada, apenas não é linkada.** Precisa estar no ar para que a verificação
  automática rode sobre ela e para que a revisão aconteça pelo endereço de pré-visualização. Fica em
  endereço fixo, sem link a partir de nenhuma página pública, e marcada para não ser indexada por
  buscador.
- **A escala de elevação** (`--shadow-sm/md/lg`) entra como variante do cartão, não como componente
  próprio: sombra é propriedade de superfície, não peça independente.

### Duas tensões entre o aprovado e a constituição, que precisam de decisão sua

Levantadas na leitura do `liacup.css`, registradas aqui em vez de resolvidas em silêncio
(Princípio VIII). São o mesmo tipo de questão que gerou o ADR-0003, e provavelmente geram um
**ADR-0004**:

1. **`.btn-icon` mede 36×36 px** e **`.input` tem `min-height: 36px`**. O Princípio II exige alvos
   de toque de no mínimo **44×44 px** no mobile, e o item D3 do checklist de validação cobra "zero
   alvos abaixo de 44 px". Os dois números não cabem juntos. O `Botao` da F00 já resolveu isso por
   conta própria aplicando `min-height: 44px` — o que significa que **já existe um desvio do
   aprovado em produção**, e ele precisa ser ratificado ou revertido.

2. **`.input` e `.btn` usam `font-size: 14px`**. O Princípio III exige **16 px ou mais** em campo de
   formulário no mobile, para não disparar zoom automático no iOS. Também não cabem juntos.

O precedente do ADR-0003 — "acessibilidade não é preferência estética, é o que decide se uma parte
do público consegue usar o site" — aponta para a acessibilidade vencer nos dois casos. Mas
Princípio VI exige **aval explícito** para mudança visual em relação ao aprovado, então a decisão é
sua e o registro é um ADR, não uma linha de plano.

**Esta spec assume que a acessibilidade vence** e que o desvio será registrado em ADR próprio. Se a
decisão for outra, o FR-016 e o SC-004 precisam mudar antes da implementação.
