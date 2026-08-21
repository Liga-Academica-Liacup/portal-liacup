# Especificação da feature: Fundação técnica do Portal LIACUP (F00)

**Feature Branch**: `main`

**Created**: 2026-08-20

**Status**: Draft

**Input**: Descrição do usuário: "Estabelecer a fundação técnica do Portal LIACUP: o esqueleto do projeto, o sistema de verificação automática de qualidade e o fluxo de publicação contínua." (texto integral em `docs/F00-fundacao.md`, Parte 2)

---

## Resumo

Esta feature não entrega nada visível para a liga. Ela entrega a máquina que garante qualidade
em tudo o que vem depois: o esqueleto de pastas, as verificações automáticas que bloqueiam o
que viola os padrões, os primeiros testes e o caminho automático do código até o ar.

O critério que define o sucesso desta feature não é "está configurado", e sim **"foi visto
falhando"**. Verificação que ninguém viu barrar nada é verificação que ninguém sabe se funciona.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - O esqueleto roda e chega ao ar (Priority: P1)

Uma pessoa que nunca viu o projeto clona o repositório, segue apenas o que está escrito no
README e vê o portal rodando na própria máquina. A mesma base, quando incorporada ao ramo
principal, aparece publicada em um endereço na internet com uma página provisória que exibe a
logo da LIACUP e a frase "Portal em construção".

**Why this priority**: é o caminho completo do código até o ar. Sem ele provado ponta a ponta,
nenhuma das 25 features seguintes tem onde nascer, e qualquer problema de encanamento só seria
descoberto no meio de uma entrega de conteúdo.

**Independent Test**: clonar o repositório em uma pasta limpa, seguir o README e abrir o
endereço local; depois abrir o endereço publicado. Entrega valor sozinha: prova que o caminho
existe.

**Acceptance Scenarios**:

1. **Given** um repositório recém-clonado em uma máquina sem nada do projeto instalado,
   **When** a pessoa executa apenas os passos escritos no README, **Then** o portal sobe
   localmente com **um único comando** de execução e a página inicial abre sem erro no console.
2. **Given** o projeto rodando localmente, **When** a página inicial é aberta, **Then** ela
   exibe a logo da LIACUP e a frase "Portal em construção", com as cores e a tipografia vindas
   dos tokens aprovados.
3. **Given** a árvore de pastas do repositório, **When** comparada com a seção 1 de
   `docs/PADROES-DE-CODIGO.md`, **Then** todas as pastas previstas existem e cada camada tem ao
   menos um arquivo de exemplo que demonstra o que vai ali.
4. **Given** qualquer arquivo de estilo do projeto fora dos arquivos de token, **When**
   inspecionado, **Then** não contém nenhum valor de cor, espaçamento, raio, sombra ou
   tipografia escrito à mão.

---

### User Story 2 - As verificações realmente bloqueiam (Priority: P1)

Quem for manter o portal depois precisa confiar que, se escrever algo que viola os padrões, vai
ser avisado na hora — e não descobrir seis meses depois. As verificações de tipos, análise
estática, formatação, regra de dependência entre camadas e uso de tokens rodam por comando e
**são demonstradas falhando** diante de uma violação real.

**Why this priority**: é a razão de existir da feature. Um conjunto de verificações que passa
verde sem checar nada é pior do que não ter verificação, porque cria confiança falsa.

**Independent Test**: rodar cada comando de verificação no estado inicial (nenhum problema
acusado), depois introduzir de propósito uma violação de cada tipo e observar a verificação
falhar apontando o arquivo, e voltar a passar quando a violação é removida.

**Acceptance Scenarios**:

1. **Given** o projeto no estado inicial, **When** os comandos de verificação de tipos, análise
   estática e formatação são executados, **Then** os três terminam sem acusar nenhum problema.
2. **Given** um componente da camada de base (`componentes/ui`), **When** alguém escreve nele um
   import da camada de dados (`features/.../dados.ts`), **Then** a verificação falha, **aponta o
   arquivo e a linha** e nomeia a regra violada.
3. **Given** o import proibido do cenário anterior, **When** ele é removido, **Then** a mesma
   verificação volta a passar sem nenhum ajuste adicional.
4. **Given** um componente qualquer, **When** alguém escreve nele uma cor em hexadecimal ou uma
   medida em pixels fora dos arquivos de token, **Then** a verificação de tokens falha e aponta o
   arquivo.
5. **Given** uma feature que tenta importar de outra feature, **When** a verificação roda,
   **Then** ela falha — a regra vale entre features, não só entre camadas.

---

### User Story 3 - Os testes cobrem o que a constituição exige (Priority: P2)

O projeto tem, desde o primeiro dia, um teste de unidade e um teste de ponta a ponta rodando
por comando. O teste de ponta a ponta abre a página inicial, confirma que ela carregou, roda uma
verificação de acessibilidade que não acusa violação, e confere que não existe rolagem
horizontal nas larguras de celular, tablet e desktop.

**Why this priority**: estabelece o formato que todas as features seguintes vão copiar. Sem um
exemplo funcionando, cada feature reinventa o próprio jeito de testar — e algumas não testam.

**Independent Test**: rodar o comando de testes de unidade e o de ponta a ponta; ambos passam e
a saída mostra quantos testes rodaram.

**Acceptance Scenarios**:

1. **Given** o projeto no estado inicial, **When** o comando de teste de unidade é executado,
   **Then** ao menos um teste roda e todos passam.
2. **Given** o projeto no estado inicial, **When** o teste de ponta a ponta é executado, **Then**
   ele abre a página inicial, confirma que o conteúdo esperado carregou, e passa.
3. **Given** a página inicial aberta no teste de ponta a ponta, **When** a verificação automática
   de acessibilidade roda, **Then** ela não acusa nenhuma violação.
4. **Given** a página inicial, **When** o teste a carrega em **360, 390, 430, 480, 768, 1024 e
   1280 px** de largura, **Then** em nenhuma dessas sete larguras existe rolagem horizontal.
5. **Given** um teste falhando, **When** o desenvolvedor lê a saída, **Then** ela indica qual
   verificação falhou e em qual largura ou elemento.

---

### User Story 4 - Publicação contínua com o ramo principal protegido (Priority: P2)

Toda alteração proposta dispara sozinha todas as verificações e ganha um endereço de
pré-visualização próprio, para ser revisada antes de entrar. Alteração com verificação falhando
não consegue ser incorporada ao ramo principal. O que entra no ramo principal é publicado
automaticamente, sem nenhum passo manual.

**Why this priority**: é o que transforma as regras em barreira real. Depende das verificações
da US2 existirem primeiro, por isso vem depois delas.

**Independent Test**: abrir uma proposta de alteração deliberadamente quebrada e confirmar, na
própria interface, que o merge fica bloqueado; abrir uma proposta sadia e conferir que o endereço
de pré-visualização funciona.

**Acceptance Scenarios**:

1. **Given** uma alteração proposta em qualquer branch, **When** ela é aberta, **Then** todas as
   verificações da US2 e os testes da US3 rodam automaticamente, sem ninguém pedir.
2. **Given** uma alteração proposta com ao menos uma verificação falhando, **When** alguém tenta
   incorporá-la ao ramo principal, **Then** a incorporação é **bloqueada pela configuração do
   repositório**, não apenas desaconselhada.
3. **Given** uma alteração incorporada ao ramo principal, **When** a incorporação termina,
   **Then** a nova versão é publicada automaticamente no endereço público, sem passo manual.
4. **Given** uma alteração proposta, **When** as verificações terminam, **Then** existe um
   endereço de pré-visualização exclusivo daquela alteração, acessível para revisão.
5. **Given** o ramo principal, **When** inspecionado a qualquer momento, **Then** ele está em
   estado publicável.

---

### User Story 5 - Quem vem depois consegue assumir (Priority: P3)

Um estudante de saúde, daqui a dois anos, sem conhecer ninguém do time atual, abre o repositório
e entende o que é o portal, como rodar, como testar, como publicar, onde estão as decisões
registradas e o que fazer quando uma verificação falha.

**Why this priority**: é o Princípio I da constituição aplicado ao próprio repositório. Fica em
P3 porque descreve o que já foi construído nas histórias anteriores — mas **não é opcional**:
sem ela a feature não está pronta.

**Independent Test**: entregar o repositório a alguém que não participou e pedir que rode, teste
e explique o projeto usando somente o README.

**Acceptance Scenarios**:

1. **Given** o README, **When** lido por alguém que nunca viu o projeto, **Then** ele responde,
   em português: o que é o portal, como rodar, como testar, como publicar, onde ficam as decisões
   registradas e o que fazer quando cada verificação falha.
2. **Given** o repositório, **When** procurado por segredos, **Then** existe um arquivo de
   exemplo listando **todas** as variáveis de ambiente necessárias, cada uma com explicação do
   que é, e **nenhum valor real de segredo** está versionado — nem no estado atual, nem no
   histórico.
3. **Given** o repositório, **When** inspecionada a pasta de documentação, **Then** ADR-0001,
   ADR-0002, os padrões de código, a constituição e o conteúdo institucional estão versionados
   ali.
4. **Given** uma verificação que falhou, **When** a pessoa consulta o README, **Then** encontra o
   que aquela verificação checa e como corrigir.

---

### Edge Cases

- **A pessoa clona em uma máquina sem as ferramentas instaladas.** O README precisa dizer o que
  instalar antes, com versão mínima; a mensagem de erro de versão incompatível não pode ser o
  primeiro contato dela com o projeto.
- **O teste de ponta a ponta roda em uma máquina onde o navegador de teste não foi baixado.** O
  comando precisa falhar com instrução do que fazer, não com erro cru.
- **Alguém escreve uma cor válida dentro do arquivo de tokens.** A verificação de tokens **não**
  pode acusar isso — é exatamente o lugar certo. Falso positivo aqui destrói a confiança na
  verificação.
- **Alguém usa `!important` para vencer estilo de terceiro.** Permitido apenas com comentário
  explicando qual estilo está sendo vencido; sem comentário, é violação.
- **Desenvolvimento em Windows, verificação em Linux.** O sistema de arquivos do Windows ignora
  caixa e o do CI não: um import escrito `componentes/Ui/Botao` funciona na máquina de quem
  escreveu e quebra no CI. O mesmo vale para a conversão de fim de linha, que pode fazer a
  verificação de formatação acusar o arquivo inteiro como alterado. As duas diferenças precisam ser
  pegas antes do CI, não por ele.
- **A proteção do ramo principal é configurada antes do primeiro CI rodar.** Nesse momento o
  repositório ainda não conhece as verificações existentes, então a proteção fica vazia e não
  barra nada. A ordem correta precisa estar documentada.
- **Uma alteração vinda de um fork.** O endereço de pré-visualização e as verificações precisam
  se comportar de forma previsível — e, se houver limitação, ela precisa estar registrada.
- **Duas alterações propostas ao mesmo tempo.** Cada uma tem seu próprio endereço de
  pré-visualização; um não sobrescreve o outro.

## Requirements _(mandatory)_

### Requisitos funcionais — Esqueleto e página provisória

- **FR-001**: O projeto **DEVE** subir localmente com um único comando de execução, a partir de
  um repositório recém-clonado, seguindo apenas o que está escrito no README.
- **FR-002**: A estrutura de pastas **DEVE** ser exatamente a definida na seção 1 de
  `docs/PADROES-DE-CODIGO.md`, com todas as pastas criadas.
- **FR-003**: Cada camada da estrutura **DEVE** conter ao menos um arquivo de exemplo que
  demonstre o que pertence àquela camada, servindo de modelo para as features seguintes.
- **FR-004**: O projeto **DEVE** ter uma página inicial provisória exibindo a logo da LIACUP, a
  frase "Portal em construção" e links de contato para o Instagram e o e-mail da liga.
- **FR-005**: Toda cor, espaçamento, raio, sombra e tipografia usados na página provisória
  **DEVEM** vir dos tokens; nenhum valor escrito à mão fora dos arquivos de token.
- **FR-006**: Os tokens **DEVEM** vir do `liacup.css` aprovado pela liga, transcritos **sem
  alteração de valor**, com as correções obrigatórias do ADR-0003 aplicadas. Nenhum valor de token
  é alterado: o que muda é **qual token cada papel usa** e a **remoção do carregamento externo de
  fontes**.
- **FR-026**: As quatro reatribuições de papel do ADR-0003 **DEVEM** estar aplicadas: botão
  primário usa `accent-600`, link usa `accent-700`, texto secundário usa `neutral-700` e texto em
  verde usa `accent-2-700`.
- **FR-027**: As fontes Caprasimo e Figtree **DEVEM** ser servidas pelo próprio domínio, com o
  `@import` do Google removido do arquivo de tokens, de modo que o carregamento da página inicial
  não faça **nenhuma requisição a domínio de terceiro**.

### Requisitos funcionais — Verificação automática

- **FR-007**: **DEVEM** existir comandos separados e documentados para verificação de tipos,
  análise estática e formatação, e os três **DEVEM** terminar sem acusar problema no estado
  inicial do projeto.
- **FR-008**: A regra de dependência entre camadas da seção 1 de `docs/PADROES-DE-CODIGO.md`
  **DEVE** ser verificada automaticamente, incluindo a proibição de uma feature importar de outra
  feature.
- **FR-009**: Quando a regra de dependência é violada, a verificação **DEVE** falhar identificando
  o arquivo, a linha e a regra violada.
- **FR-010**: **DEVE** existir verificação automática que falhe quando alguém escrever cor ou
  medida à mão fora dos arquivos de token, e que **não** acuse os próprios arquivos de token.
- **FR-011**: O funcionamento das verificações dos FR-009 e FR-010 **DEVE** ser demonstrado com
  evidência de falha e de retorno ao verde — a demonstração faz parte da entrega, não é opcional.
- **FR-028**: O projeto **DEVE** se comportar de forma idêntica em Windows e em Linux. Diferença
  de caixa em caminho de import **DEVE** ser detectada pela verificação de tipos, e a normalização
  de fim de linha **DEVE** estar declarada no repositório, não deixada a cargo da configuração
  local de cada máquina.
- **FR-029**: **DEVE** existir verificação automatizada de desempenho e acessibilidade **por
  página**, rodando no CI, com os limiares registrados: **desempenho ≥ 90** e **acessibilidade
  ≥ 95**. O escopo desta feature é montar o mecanismo e registrar os limiares — **não** otimizar
  desempenho.
- **FR-012**: **DEVE** existir ao menos um teste de unidade, passando, cobrindo um artefato de
  exemplo do projeto.
- **FR-013**: **DEVE** existir ao menos um teste de ponta a ponta, passando, que abra a página
  inicial e confirme que ela carregou.
- **FR-014**: O teste de ponta a ponta **DEVE** rodar verificação automática de acessibilidade
  sobre a página inicial, sem nenhuma violação acusada.
- **FR-015**: O teste de ponta a ponta **DEVE** verificar ausência de rolagem horizontal em
  **360, 390, 430, 480, 768, 1024 e 1280 px** de largura.

### Requisitos funcionais — Publicação

- **FR-016**: Toda alteração proposta **DEVE** disparar automaticamente todas as verificações dos
  FR-007 a FR-015.
- **FR-017**: O ramo principal **DEVE** estar protegido por configuração do repositório, de modo
  que uma alteração com qualquer verificação falhando **não possa** ser incorporada.
- **FR-018**: Toda alteração incorporada ao ramo principal **DEVE** ser publicada automaticamente
  no endereço público, sem passo manual.
- **FR-019**: Toda alteração proposta **DEVE** gerar um endereço de pré-visualização exclusivo,
  acessível antes da incorporação.
- **FR-020**: A ordem de configuração da proteção do ramo principal (que só é possível depois do
  primeiro CI ter rodado) **DEVE** estar documentada como passo operacional.

### Requisitos funcionais — Documentação e sucessão

- **FR-021**: O README **DEVE** explicar, em português e para quem nunca viu o projeto: o que é o
  portal, como rodar, como testar, como publicar, onde ficam as decisões registradas e o que
  fazer quando uma verificação falha.
- **FR-022**: **DEVE** existir arquivo de exemplo de variáveis de ambiente listando todas as
  variáveis necessárias, cada uma com explicação do que é.
- **FR-023**: Nenhum segredo real **PODE** estar versionado, nem no estado atual nem no
  histórico do repositório.
- **FR-024**: ADR-0001, ADR-0002, os padrões de código, a constituição e o conteúdo institucional
  **DEVEM** estar versionados em pasta de documentação dentro do repositório.
- **FR-025**: Toda dependência adicionada **DEVE** estar justificada por escrito no `plan.md`, e a
  lista de dependências instaladas **DEVE** bater com essa justificativa, item a item.

### Escopo — o que **não** entra nesta feature

Configuração de Supabase, banco de dados e RLS (F02) · autenticação (F14) · envio de e-mail
(F13) · qualquer página real do site (Fase 1) · domínio próprio · biblioteca de componentes de
terceiros — o design system da liga é o nosso · qualquer dependência além das necessárias para o
que está descrito acima.

## Success Criteria _(mandatory)_

### Resultados mensuráveis

- **SC-001**: Uma pessoa que nunca viu o projeto consegue, a partir de um clone limpo e usando só
  o README, ver o portal rodando na própria máquina em **menos de 15 minutos**, sem precisar
  perguntar nada a ninguém.
- **SC-002**: Os comandos de verificação de tipos, análise estática e formatação retornam
  **zero problema** no estado inicial.
- **SC-003**: Em uma demonstração gravada ou registrada, um import proibido faz a verificação
  falhar apontando o arquivo, e removê-lo faz a verificação voltar a passar — **duas execuções,
  dois resultados opostos**.
- **SC-004**: Em demonstração equivalente, uma cor escrita à mão fora dos arquivos de token faz a
  verificação de tokens falhar apontando o arquivo.
- **SC-005**: **100%** dos testes existentes passam: ao menos 1 de unidade e ao menos 1 de ponta
  a ponta.
- **SC-006**: A verificação automática de acessibilidade da página inicial retorna **zero
  violações**.
- **SC-007**: A página inicial apresenta **zero** ocorrências de rolagem horizontal nas sete
  larguras verificadas (360, 390, 430, 480, 768, 1024 e 1280 px).
- **SC-008**: Uma proposta de alteração deliberadamente quebrada tem a incorporação ao ramo
  principal **bloqueada**, comprovada por evidência da própria interface do repositório.
- **SC-009**: Uma alteração incorporada ao ramo principal aparece publicada no endereço público
  **sem nenhuma intervenção manual**.
- **SC-010**: Cada alteração proposta gera **um** endereço de pré-visualização próprio e
  funcional.
- **SC-011**: Varredura do repositório e do histórico encontra **zero** segredos reais.
- **SC-012**: O número de dependências instaladas é **igual** ao número de dependências
  justificadas no `plan.md`.
- **SC-013**: A árvore de pastas do repositório corresponde **item a item** à seção 1 de
  `docs/PADROES-DE-CODIGO.md`, sem pasta faltando e sem pasta extra não prevista.
- **SC-014**: O carregamento da página inicial faz **zero** requisições a domínios externos.

## Dependencies

- **`liacup.css` aprovado pela liga — resolvido.** O arquivo está no repositório e é a origem dos
  tokens, que vão para `src/estilos/tokens.css`. Os valores são transcritos, não derivados nem
  inventados (Princípio VI).
- **ADR-0003 — parte da origem dos tokens.** Define as correções obrigatórias aplicadas na
  transcrição: as quatro reatribuições de papel (FR-026) e a remoção do carregamento externo de
  fontes (FR-027). Nenhum valor de token muda por causa dele.
- **Ativos de marca** — `assets/logo-liacup.png` e variantes já estão no repositório e são
  suficientes para a página provisória (FR-004).
- **Ações do Gabriel, fora do que o desenvolvedor pode fazer** (conforme `docs/F00-runbook-gabriel.md`):
  criar o repositório remoto, conectar a hospedagem e aplicar a proteção do ramo principal na
  interface do provedor. Os FR-017, FR-018 e FR-019 dependem dessas ações; a entrega do
  desenvolvedor é a configuração versionada mais o passo a passo documentado.

## Assumptions

- **Stack já decidida, não reaberta aqui**: Next.js (App Router), TypeScript estrito, Vercel,
  Vitest e Playwright, conforme ADR-0001. Esta spec descreve capacidade, não escolhe ferramenta;
  a escolha já está registrada e só muda por novo ADR.
- **"Um único comando"** significa um comando de execução do projeto (ex.: iniciar o servidor de
  desenvolvimento), pressupondo a instalação de pré-requisitos descrita no README. Instalar
  runtime e dependências não conta como violação do FR-001.
- **Larguras verificadas no teste de ponta a ponta — divergência resolvida pelo Gabriel.** A
  versão anterior desta spec pedia três larguras (360, 768, 1280) contra as seis do
  `docs/checklist-validacao.md`, item C1. A divergência foi reportada e o Gabriel decidiu por
  **sete**: 360, 390, 430, 480, 768, 1024 e 1280 px — as seis do checklist mais 480 px, que é um
  dos pontos de corte de responsividade definidos nos padrões de código. O item C1 do checklist de
  validação **já foi atualizado para as mesmas sete larguras**, então spec e checklist estão
  alinhados.
- **A F00 é exceção de arranque, desenvolvida na `main`.** Não há CI nem proteção de ramo a
  respeitar ainda, e o primeiro CI precisa rodar para que as verificações passem a existir e possam
  ser exigidas na configuração do repositório. **Da F01 em diante toda feature tem branch próprio e
  entra por alteração proposta**, conforme a seção 8 dos padrões de código.
- **Arquivo de exemplo por camada**: são exemplos mínimos e reais (um componente de base, um
  padrão, uma feature com `dados.ts`/`regras.ts`/`tipos.ts`, um utilitário), servindo de modelo —
  não são conteúdo do site nem esboço de feature futura.
- **Variáveis de ambiente**: o arquivo de exemplo lista as que já se sabe necessárias, incluindo
  as de F02 e F13 marcadas como ainda não usadas, para que ninguém descubra tarde. Nenhuma delas
  é configurada nesta feature.
- **Nenhum dado pessoal é coletado nesta feature**, portanto não há requisito de LGPD, RLS ou
  retenção aqui. Isso entra na F02.
- **Publicação em endereço `.vercel.app`** enquanto o domínio próprio não é registrado; a troca de
  domínio não é escopo desta feature.
