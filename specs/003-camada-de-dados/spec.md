# Especificação da feature: Camada de dados (F02)

**Feature Branch**: `feat/F02-camada-de-dados`

**Created**: 2026-08-21

**Status**: Draft

**Input**: Descrição do usuário: "Esquema no Supabase, políticas de acesso por linha, cliente tipado e dados de exemplo. Nenhuma tela."

---

## Resumo

Última feature da Fase 0, e a que destrava toda a Fase 1. Entrega **onde o conteúdo do portal vai
morar**: as coleções, quem pode ler e escrever cada uma, o caminho tipado para chegar até elas, e
dados de exemplo que permitem construir as páginas seguintes sem esperar a diretoria preencher nada.

Não entrega nenhuma tela. Componente de base não conhece banco — é a regra Z1, verificada pelo lint
desde a F00, e ela continua valendo.

Duas coisas nesta feature são de risco alto e por isso têm requisito próprio: **a chave de serviço
nunca pode chegar ao navegador**, e **as políticas de acesso precisam ser testadas provando que
bloqueiam**, não só que permitem.

## Clarifications

### Session 2026-08-21

- Q: A purga das mensagens com mais de 24 meses acontece automaticamente, ou é um passo manual? → A: Procedimento manual documentado **e testado** nesta feature; a automação é da F25. **Adiamento registrado**, não escolha livre — ver abaixo.
- Q: O endereço de IP de quem envia mensagem pode ser guardado, e por quanto tempo? → A: Apenas um **resumo irreversível** do IP, em tabela separada da mensagem, apagado em 24 horas.
- Q: Quando a diretoria apaga uma notícia, o registro some do banco ou fica arquivado? → A: **Arquivado**, e recuperável **pela própria diretoria** pelo painel.
- Q: Se duas pessoas editarem o mesmo conteúdo ao mesmo tempo, o que acontece? → A: O segundo a salvar é **avisado** e não sobrescreve — **sem perder o texto digitado**.
- Q: O que acontece com as fotos quando um álbum da galeria é apagado? → A: Acompanham o álbum: arquivadas junto, recuperáveis junto.

**A purga automática já era promessa de um ADR aprovado.** O ADR-0001, risco R6, mitiga o vazamento
de dado pessoal com "RLS obrigatória, nenhuma chave secreta no cliente, validação no servidor,
retenção definida e **purga automática**". A resposta acima **não escolhe** entre manual e
automático: ela **adia** algo que já foi prometido, porque criar um segundo agendador antes daquele
que vai ficar é desperdício. O adiamento é registrado em três lugares para não evaporar em silêncio:
aqui, na linha da **F25** do `PLANO-DE-DESENVOLVIMENTO.md`, e no fato de que o procedimento manual
**é testado nesta feature** — procedimento que nunca foi executado é procedimento que não funciona.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - O conteúdo do portal tem onde morar (Priority: P1)

Quem for construir a página de Notícias, de Eventos ou de Equipe encontra a coleção pronta, com os
campos que o protótipo aprovado usa e os tipos correspondentes já disponíveis no código.

**Why this priority**: é o objeto da feature. Sem as coleções, nenhuma página da Fase 1 pode começar.

**Independent Test**: pedir a lista de notícias publicadas pelo caminho tipado e receber os dados de
exemplo, sem escrever nenhuma tela.

**Acceptance Scenarios**:

1. **Given** o esquema criado, **When** inspecionado, **Then** existem as coleções de **notícias**
   (com link externo), **eventos**, **projetos** nos quatro eixos, **materiais**, **recomendações de
   leitura**, **ligantes**, **docentes orientadores**, **álbuns** e **fotos** da galeria,
   **conteúdos educativos**, **perguntas frequentes** e **mensagens**.
2. **Given** qualquer coleção de conteúdo, **When** inspecionada, **Then** ela distingue **rascunho**
   de **publicado**, e registra quando foi criada e quando foi alterada.
3. **Given** o código do portal, **When** consulta uma coleção, **Then** recebe dados **tipados** —
   um campo que não existe não compila.
4. **Given** qualquer consulta, **When** escrita, **Then** ela pede **apenas as colunas que usa**.

---

### User Story 2 - Quem não é da diretoria não consegue escrever (Priority: P1)

Uma pessoa qualquer na internet consegue **ler** o conteúdo publicado do portal e **não consegue**
alterar nada. A diretoria autenticada consegue escrever. As mensagens do "Fale com a Liga" são o
caso invertido: qualquer pessoa envia, só a diretoria lê.

**Why this priority**: é o único item desta feature capaz de causar dano irreversível, junto com a
chave de serviço. Uma política de escrita aberta é o portal desfigurado ou apagado por qualquer um.

**Independent Test**: tentar cada operação proibida com acesso anônimo e receber recusa; tentar cada
operação permitida e receber sucesso.

**Acceptance Scenarios**:

1. **Given** acesso anônimo, **When** lê uma coleção de conteúdo, **Then** recebe **apenas o que
   está publicado** — rascunho não aparece.
2. **Given** acesso anônimo, **When** tenta **criar, alterar ou apagar** qualquer conteúdo, **Then**
   a operação é **recusada**.
3. **Given** acesso autenticado da diretoria, **When** escreve conteúdo, **Then** a operação é
   aceita, e o rascunho é visível para ela.
4. **Given** acesso anônimo, **When** envia uma mensagem pelo "Fale com a Liga", **Then** a inserção
   é aceita.
5. **Given** acesso anônimo, **When** tenta **ler** as mensagens, **Then** a operação é
   **recusada** — mesmo conhecendo o identificador de uma mensagem específica.
6. **Given** qualquer política, **When** verificada, **Then** existe um teste que prova que ela
   **bloqueia** o caso proibido. Política testada só pelo caminho feliz não é política.
7. **Given** qualquer coleção, **When** criada, **Then** ela já nasce com controle de acesso por
   linha ativo. Coleção sem política é bug, não pendência.

---

### User Story 3 - A chave de serviço nunca chega ao navegador (Priority: P1)

A credencial que ignora todas as políticas de acesso existe apenas no servidor. Nenhum caminho a
leva para o código que roda na máquina de quem visita o site.

**Why this priority**: é o item de dano irreversível desta feature. Uma chave de serviço publicada
dá a qualquer pessoa acesso total ao banco, e não há como "despublicar" o que já foi baixado.

**Independent Test**: procurar a credencial no que é entregue ao navegador e não encontrá-la.

**Acceptance Scenarios**:

1. **Given** o pacote entregue ao navegador, **When** procurado pela credencial de serviço, **Then**
   ela **não aparece**.
2. **Given** um arquivo que roda no navegador, **When** alguém tenta usar a credencial de serviço
   nele, **Then** isso é **impedido automaticamente** — por verificação, não por lembrança.
3. **Given** o repositório e seu histórico, **When** varridos, **Then** **nenhuma credencial real**
   está versionada.
4. **Given** o arquivo de exemplo de variáveis de ambiente, **When** lido, **Then** ele diz
   claramente qual variável é segredo e qual pode aparecer no navegador.

---

### User Story 4 - Dado pessoal tem prazo desde o primeiro dia (Priority: P2)

As mensagens do "Fale com a Liga" guardam nome, e-mail e texto livre — dado pessoal de terceiros. O
prazo de retenção existe **desde a criação da tabela**, não como tarefa futura.

**Why this priority**: retrofit de retenção em base com dado real é muito mais caro que fazer certo
com a tabela vazia, e envolve apagar dado de gente de verdade sob pressão.

**Independent Test**: conferir que cada mensagem registra quando chegou e que o procedimento de
purga está escrito e é executável.

**Acceptance Scenarios**:

1. **Given** a coleção de mensagens, **When** uma mensagem é gravada, **Then** fica registrado
   **quando ela chegou**.
2. **Given** o prazo de retenção de **24 meses**, **When** consultado, **Then** ele está escrito na
   documentação junto com a finalidade e a base legal da coleta.
3. **Given** o procedimento de purga, **When** lido por quem opera o portal, **Then** ele diz o que
   apagar, quando e como — sem exigir conhecimento de banco de dados.
4. **Given** qualquer registro de erro do sistema, **When** inspecionado, **Then** ele **não contém
   dado pessoal**.

---

### User Story 5 - Dá para construir as páginas antes de a diretoria preencher (Priority: P2)

Quem for montar a página de Notícias na Fase 1 encontra notícias de exemplo já no banco, com texto
que ou é o real aprovado pela liga, ou está **visivelmente marcado** como espaço reservado.

**Why this priority**: sem dados de exemplo, cada página da Fase 1 começa com tela vazia e ninguém
consegue verificar responsividade nem acessibilidade de uma lista que não existe.

**Independent Test**: pedir cada coleção e receber registros suficientes para montar uma lista, um
detalhe e um estado vazio.

**Acceptance Scenarios**:

1. **Given** os dados de exemplo, **When** o conteúdo real aprovado existe em
   `docs/conteudo-institucional.md` — os números da home, as orientadoras, os quatro eixos, o FAQ —,
   **Then** o texto usado é **o real**, sem reescrita.
2. **Given** os dados de exemplo, **When** não existe conteúdo aprovado para aquele campo, **Then** o
   valor é um espaço reservado **visivelmente marcado como tal**.
3. **Given** qualquer dado de exemplo, **When** lido por alguém, **Then** **não é possível confundi-lo
   com informação institucional verdadeira**.
4. **Given** cada coleção, **When** consultada, **Then** tem registros suficientes para exercitar
   lista, item único e o caso de coleção vazia.

---

### Edge Cases

- **Uma mensagem chega com texto muito longo, ou com script dentro.** O campo é texto livre vindo de
  quem não conhecemos: precisa ter limite e ser tratado como dado não confiável.
- **Duas pessoas da diretoria editam a mesma notícia ao mesmo tempo.** O segundo a salvar é avisado
  de que o conteúdo mudou desde que ele abriu, **sem perder o que digitou** (FR-031, FR-032).
- **Um conteúdo é despublicado ou apagado depois de ter estado no ar.** Some da leitura pública e
  continua **recuperável pela diretoria** pelo painel (FR-028, FR-029).
- **Um álbum da galeria é apagado com fotos dentro.** As fotos são arquivadas junto e recuperadas
  junto (FR-030).
- **O formulário de contato é usado por robô em massa.** A coleção de mensagens não pode virar porta
  de entrada de lixo sem limite.
- **A diretoria muda e o autor de um conteúdo não existe mais.** O conteúdo não pode sumir junto.
- **A base é consultada quando ainda está vazia.** Toda leitura precisa devolver lista vazia em vez
  de erro — é o estado que o `EstadoVazio` da F01 existe para desenhar.

## Requirements *(mandatory)*

### Requisitos funcionais — Coleções

- **FR-001**: **DEVEM** existir coleções para **notícias** (com link externo), **eventos**,
  **projetos** (nos quatro eixos: ensino, extensão, pesquisa e secretaria), **materiais**,
  **recomendações de leitura**, **ligantes**, **docentes orientadores**, **álbuns de galeria**,
  **fotos de galeria**, **conteúdos educativos**, **perguntas frequentes** e **mensagens**.
- **FR-002**: Toda coleção de conteúdo **DEVE** distinguir **rascunho** de **publicado**.
- **FR-003**: Toda coleção **DEVE** registrar quando o registro foi criado e quando foi alterado
  pela última vez.
- **FR-004**: Os campos de cada coleção **DEVEM** corresponder ao que o protótipo aprovado e o
  `docs/conteudo-institucional.md` usam — não a um modelo genérico.
- **FR-005**: O código **DEVE** acessar as coleções por um caminho **tipado**: campo inexistente ou
  de tipo errado **não compila**.
- **FR-006**: Toda consulta **DEVE** pedir apenas as colunas que usa.
- **FR-007**: Todo acesso a dados **DEVE** viver na camada de dados da feature correspondente.
  Nenhum componente fala com o banco (regra Z1, já verificada pelo lint).

### Requisitos funcionais — Controle de acesso

- **FR-008**: **Toda** coleção **DEVE** nascer com controle de acesso por linha **ativo**. Coleção
  sem política é bug.
- **FR-009**: Conteúdo **publicado DEVE** ser legível sem autenticação; **rascunho NÃO PODE** ser
  legível sem autenticação.
- **FR-010**: Criar, alterar e apagar conteúdo **DEVE** exigir autenticação da diretoria.
- **FR-011**: A coleção de mensagens **DEVE** aceitar **inserção anônima** e **recusar leitura
  anônima**, inclusive quando o identificador do registro é conhecido.
- **FR-012**: Cada política **DEVE** ter um teste que prova que ela **bloqueia** o caso proibido —
  não apenas que permite o caso autorizado.
- **FR-013**: A demonstração de que as políticas bloqueiam **DEVE** fazer parte da entrega, com
  evidência da recusa.

### Requisitos funcionais — Segredo

- **FR-014**: A credencial de serviço **NÃO PODE** aparecer no pacote entregue ao navegador.
- **FR-015**: O uso da credencial de serviço em código de navegador **DEVE** ser impedido por
  verificação automática, não por disciplina.
- **FR-016**: **Nenhuma credencial real PODE** estar versionada, nem no estado atual nem no
  histórico.
- **FR-017**: O arquivo de exemplo de variáveis de ambiente **DEVE** distinguir claramente o que é
  segredo do que pode aparecer no navegador.

### Requisitos funcionais — Dado pessoal

- **FR-018**: Cada mensagem **DEVE** registrar quando chegou.
- **FR-019**: O prazo de retenção de **24 meses** **DEVE** estar documentado junto com a finalidade
  declarada e a base legal da coleta.
- **FR-020**: **DEVE** existir procedimento de purga escrito, executável por quem opera o portal sem
  conhecimento de banco de dados.
- **FR-021**: Nenhum registro de erro **PODE** conter dado pessoal.
- **FR-025**: O procedimento manual de purga **DEVE** ser **executado ao menos uma vez** nesta
  feature, com evidência do resultado. Procedimento escrito e nunca executado é procedimento que não
  funciona.
- **FR-026**: O limite de envio de mensagens **DEVE** usar um **resumo irreversível** do endereço de
  IP, guardado em **tabela separada da mensagem** e apagado em **24 horas** pelo mesmo procedimento
  do FR-020 — sem um segundo mecanismo de purga.
- **FR-027**: O sal usado no resumo do IP **DEVE** ser secreto e rotacionável. Sal fixo e público
  torna o resumo reversível por força bruta: o espaço de endereços IPv4 tem cerca de 4,3 bilhões de
  valores, o que uma máquina comum percorre em minutos. **Resumo de IP continua sendo dado pessoal
  pseudonimizado sob a LGPD, não dado anônimo** — e é por isso que ele tem prazo próprio.

### Requisitos funcionais — Dados de exemplo

- **FR-022**: Onde existe conteúdo aprovado em `docs/conteudo-institucional.md`, os dados de exemplo
  **DEVEM** usar **o texto real**, sem reescrita.
- **FR-023**: Onde não existe conteúdo aprovado, o valor **DEVE** ser espaço reservado
  **visivelmente marcado**, impossível de confundir com informação institucional verdadeira.
- **FR-024**: Cada coleção **DEVE** ter registros suficientes para exercitar lista, item único e
  coleção vazia.

### Requisitos funcionais — Ciclo de vida do conteúdo

- **FR-028**: Apagar conteúdo **DEVE** arquivá-lo: some da leitura pública e da lista normal, e
  **não** é removido do banco.
- **FR-029**: O esquema **DEVE** permitir **listar o que está arquivado e restaurá-lo**. Arquivar só
  é recuperação se a diretoria conseguir ver e restaurar **pelo painel** — se apenas quem tem acesso
  ao banco consegue, é backup com outro nome.
- **FR-030**: Apagar um álbum **DEVE** arquivar as fotos dentro dele, recuperáveis junto com o álbum.
- **FR-031**: O esquema **DEVE** permitir detectar que um conteúdo foi alterado por outra pessoa
  desde que foi aberto para edição, para que o segundo a salvar **não sobrescreva em silêncio**.
- **FR-032**: Ao detectar a alteração concorrente, **o texto digitado pela pessoa NÃO PODE ser
  perdido**, e o aviso **DEVE** dizer o que fazer — não apenas que houve conflito. A redação final é
  da F17; a F02 garante que o esquema sustenta os dois.

### Escopo — o que **não** entra nesta feature

- **Nenhuma tela.** Nem pública, nem de painel.
- **Autenticação real** — entra na **F14**. Esta feature define as políticas; quem faz login é a F14.
- **Upload de imagem** — entra na **F18**. A galeria tem as coleções, não o envio de arquivo.
- Envio de e-mail (F13) · rotina contra a pausa do plano gratuito (F25) · qualquer componente novo.

## Success Criteria *(mandatory)*

### Resultados mensuráveis

- **SC-001**: **12 coleções** criadas, cobrindo tudo o que o protótipo aprovado exibe.
- **SC-002**: **100%** das coleções com controle de acesso por linha ativo — zero exceções.
- **SC-003**: **100%** das políticas com teste que prova o **bloqueio**, não só a permissão.
- **SC-004**: **Zero** operações de escrita bem-sucedidas com acesso anônimo, em todas as coleções
  de conteúdo.
- **SC-005**: **Zero** leituras de mensagem bem-sucedidas com acesso anônimo.
- **SC-006**: **Zero** rascunhos visíveis com acesso anônimo.
- **SC-007**: **Zero** ocorrências da credencial de serviço no pacote entregue ao navegador,
  verificado automaticamente.
- **SC-008**: **Zero** credenciais reais no repositório e no histórico.
- **SC-009**: **100%** das coleções acessíveis por caminho tipado; campo inexistente não compila,
  demonstrado com duas execuções de resultado oposto.
- **SC-010**: Prazo de retenção, finalidade e base legal documentados, e procedimento de purga
  executável por quem não conhece banco de dados.
- **SC-011**: **Zero** textos institucionais inventados nos dados de exemplo; todo espaço reservado
  visivelmente marcado.
- **SC-013**: O procedimento de purga é **executado ao menos uma vez** nesta feature, com o número
  de registros afetados registrado.
- **SC-014**: **Zero** endereços de IP em claro no banco; o resumo tem prazo de 24 horas e sal
  secreto.
- **SC-015**: **Zero** registros de conteúdo removidos do banco ao serem apagados pela diretoria —
  todos arquivados e recuperáveis.
- **SC-012**: Todas as verificações herdadas continuam passando: tipos, análise estática, formatação,
  tokens, camadas, testes de unidade e de ponta a ponta, e medidor de desempenho.

## Dependencies

- **F00 e F01 concluídas** — CI, verificações, tokens e componentes já existem e não são refeitos.
- **Projeto no Supabase criado** na conta da liga, conforme o pré-requisito registrado no ADR-0001,
  risco R5: contas em e-mail institucional, nunca pessoal.
- **`docs/conteudo-institucional.md`** — a fonte do conteúdo aprovado que os dados de exemplo usam.
- **ADR-0001, seção 3** — o primeiro esboço de tabelas, que esta feature transforma em modelo
  definitivo. O próprio ADR diz para **não tratar como fechado**.

## Assumptions

- **Papéis da diretoria**: o ADR-0001 prevê administrador, editor e colaborador. Esta feature assume
  que as políticas distinguem **anônimo** de **autenticado**, e deixa a diferenciação entre os três
  papéis para a **F14**, junto com quem os atribui. Políticas por papel sem sistema de papéis seriam
  regra sem quem a cumpra.
- **Autor do conteúdo**: cada registro guarda quem o criou, mas o conteúdo **não é apagado** quando a
  pessoa sai da diretoria — o portal sobrevive à troca de gestão, que é o Princípio I.
- **Foto da galeria**: a coleção guarda a referência ao arquivo; o envio do arquivo é F18.
- **Processo seletivo e indicadores da home**: o ADR-0001 os lista como coleções próprias. Ficam
  **fora** do FR-001 porque a descrição desta feature não os incluiu; entram na feature que
  construir a página correspondente. Registrado para não parecer esquecimento.
- **Limite de mensagens por origem**: o ADR-0002 previa limite por IP e janela de tempo, e o
  ADR-0001 especificava a tabela de mensagens com "IP não armazenado" — **os dois se
  contradiziam**. Resolvido pelo resumo irreversível em tabela separada (FR-026, FR-027): a frase do
  ADR-0001 continua **literalmente verdadeira**, porque é da tabela de mensagens que ela fala, e o
  limite do ADR-0002 passa a ser implementável. Adendo escrito no ADR-0002, com referência cruzada
  no ADR-0001. Esta feature cria a coleção e o limite; o formulário que a alimenta é a F13.

### A pausa do plano gratuito, registrada para não virar surpresa

O Supabase **pausa o projeto após 7 dias sem atividade** no plano gratuito. Um portal institucional
de baixo tráfego, com páginas em cache, pode passar uma semana sem consultar o banco — e voltar de
um feriado prolongado com o site fora do ar.

**Não é para resolver aqui**: a rotina agendada e o monitor de disponibilidade são da **F25**, e
estão registrados no ADR-0001 como risco R1. Fica escrito nesta spec porque é a partir desta feature
que existe um banco para pausar, e porque a primeira pessoa a encontrar o site fora do ar num
domingo precisa achar a explicação em vez de descobrir sozinha.
