# Spec Delta — equipe-de-agentes

## MODIFIED Requirements

### Requirement: Quem revisa não consegue escrever

Os agentes que revisam o trabalho SHALL ter apenas ferramentas de leitura, sem nenhuma ferramenta de
escrita nem de execução de comando, para que a independência da revisão seja trava e não promessa.
São dois: o revisor, que confere o diff contra a proposta e os padrões, e o guardião de segurança,
que o audita contra o checklist de segurança.

#### Scenario: O revisor encontra um defeito

- **WHEN** o revisor encontra algo errado no trabalho entregue
- **THEN** descreve o defeito no relatório
- **AND** não tem caminho técnico para corrigi-lo, nem rodando comando

#### Scenario: Alguém pede ao guardião que crie um arquivo

- **WHEN** o guardião de segurança recebe o pedido de criar ou alterar um arquivo
- **THEN** não consegue, por falta de ferramenta, e diz isso no relatório
- **AND** a lista de arquivos alterados do repositório é a mesma antes e depois do pedido

### Requirement: Relatório de no máximo uma tela, com número

Todo agente SHALL devolver relatório que caiba em uma tela, com número sempre que houver número, e
SHALL declarar como incompleto o que ficou incompleto. A lista de achados de uma auditoria de
segurança fica fora da conta da tela, como a evidência literal numa entrega. O resto do relatório
do guardião cabe em uma tela.

#### Scenario: Um agente termina sua parte

- **WHEN** um agente conclui a tarefa que recebeu
- **THEN** devolve o resultado em no máximo uma tela, dizendo quanto mediu
- **AND** item pulado aparece escrito, nunca silenciado

#### Scenario: A auditoria encontra muitos achados

- **WHEN** o guardião devolve uma auditoria com mais achados do que cabem em uma tela
- **THEN** o veredito, as contagens, os pedidos de comando e o que não foi verificado cabem em uma
  tela
- **AND** a lista de achados vem depois, inteira, sem resumo no lugar dela

## ADDED Requirements

### Requirement: Toda change passa pela auditoria de segurança antes da entrega

Toda change SHALL ser auditada pelo guardião de segurança depois da revisão do diff e antes de ser
arquivada. O veredito do guardião SHALL aparecer na evidência da entrega do Portão 2. Change sem
veredito NÃO SHALL chegar ao Portão 2.

#### Scenario: Uma change termina a revisão do diff

- **WHEN** o revisor termina a revisão de uma change
- **THEN** o guardião audita a change antes de ela ser arquivada
- **AND** a entrega do Portão 2 mostra o veredito do guardião na evidência

#### Scenario: Falta o veredito

- **WHEN** uma change chega ao fim sem veredito do guardião
- **THEN** a entrega não é apresentada como pronta para o Portão 2
- **AND** a falta do veredito aparece declarada como incompleto

### Requirement: Veredito bloqueado impede o Portão 2

Com veredito BLOQUEADO, a change NÃO SHALL ir ao Portão 2. A correção SHALL ser feita por quem
implementa. Toda correção feita depois da revisão do diff SHALL passar de novo pelo revisor e,
depois dele, pelo guardião, cada um numa invocação nova, que recebe o diff corrigido e não recebe o
relatório anterior.

#### Scenario: A auditoria bloqueia

- **WHEN** o guardião devolve BLOQUEADO
- **THEN** a change volta para quem implementa, com os critérios de correção do relatório
- **AND** depois da correção, um revisor novo revisa o diff corrigido
- **AND** depois dele, um guardião novo audita o diff corrigido sem ver o relatório anterior

#### Scenario: A correção não resolve

- **WHEN** a nova auditoria também devolve BLOQUEADO
- **THEN** o ciclo de correção e nova auditoria se repete
- **AND** a change continua fora do Portão 2

### Requirement: O guardião aponta e exige, não corrige

O guardião SHALL descrever cada falha e o critério verificável que a correção precisa cumprir. Ele
NÃO SHALL escrever o código da correção. Também NÃO SHALL sugerir afrouxar regra, limiar ou
verificação para a change passar.

#### Scenario: O guardião encontra uma falha

- **WHEN** o guardião encontra uma falha de segurança
- **THEN** o relatório diz o que a correção precisa cumprir, de forma que se possa conferir depois
- **AND** o relatório não traz o código da correção
- **AND** não propõe retirar item do checklist, baixar limiar nem pular teste

### Requirement: Todo achado traz evidência, confiança e cenário

Todo achado SHALL trazer seis coisas: o código do item do checklist; a severidade (bloqueante,
alta, média, baixa ou informativa); a confiança (confirmado, provável ou hipótese); o lugar, por
arquivo e linha ou por saída de comando; o cenário concreto de ataque ou vazamento; e o critério de
correção. Achado sem cenário concreto SHALL ser informativo.

#### Scenario: Achado sem cenário

- **WHEN** o guardião aponta um problema sem conseguir descrever como ele seria explorado ou como
  vazaria
- **THEN** o achado é informativo e não bloqueia

#### Scenario: Afirmação sem lugar

- **WHEN** uma afirmação do relatório não cita arquivo e linha nem saída de comando
- **THEN** ela não conta como achado confirmado

#### Scenario: O ponto já está tratado

- **WHEN** o guardião suspeita de uma falha que o código ou um teste já trata
- **THEN** ele não a aponta como falha

### Requirement: O veredito segue uma regra fixa

O guardião SHALL emitir um destes três vereditos. BLOQUEADO, quando há achado bloqueante, de
qualquer confiança, ou alto confirmado. APROVADO COM RESSALVAS, quando o achado mais grave é alto
não confirmado, médio ou baixo. APROVADO, quando só há achados informativos ou nenhum.

#### Scenario: Achado alto confirmado

- **WHEN** a auditoria tem um achado de severidade alta com confiança confirmado
- **THEN** o veredito é BLOQUEADO

#### Scenario: Bloqueante ainda em hipótese

- **WHEN** a auditoria tem um achado bloqueante com confiança hipótese
- **THEN** o veredito é BLOQUEADO
- **AND** o relatório traz o pedido de comando que confirmaria ou descartaria a hipótese

#### Scenario: Só achados informativos

- **WHEN** todos os achados da auditoria são informativos
- **THEN** o veredito é APROVADO

### Requirement: O que o guardião não verifica sozinho vira pedido de comando

Quando uma conferência depender de rodar um comando, o guardião SHALL pedir o comando exato e dizer
o que a saída precisa mostrar. O líder técnico SHALL devolver a saída literal e o código de saída,
sem resumo, e o guardião SHALL decidir com base nela. Sem saída, o item SHALL ficar declarado como
não verificado.

#### Scenario: A conferência depende de comando

- **WHEN** o guardião precisa saber se há vulnerabilidade conhecida nas dependências ou se há
  segredo no histórico
- **THEN** o relatório traz o comando exato e o que a saída precisa mostrar para passar
- **AND** o pedido, a saída literal e a decisão ficam no registro da change

#### Scenario: A saída não chega

- **WHEN** um pedido de comando fica sem saída, inclusive o dos cabeçalhos da prévia, que ainda não
  existe quando o guardião audita
- **THEN** o item aparece como não verificado, com essas palavras
- **AND** não aparece como aprovado

### Requirement: Só o Gabriel aceita um risco

Um achado que bloqueia SHALL deixar de bloquear só de duas formas: pela correção, ou pelo aceite do
Gabriel, por escrito. Nenhum agente SHALL aceitar risco. A forma do aceite e a exceção do achado já
explorável em produção estão nos cenários.

#### Scenario: O Gabriel aceita um risco

- **WHEN** o Gabriel aceita, por escrito, um risco apontado pelo guardião
- **THEN** o registro da change traz o aceite literal, com data, o achado, o motivo, o prazo e a
  change que vai resolvê-lo
- **AND** o documento de segurança lista o risco entre os aceitos em aberto
- **AND** uma change seguinte que não toca no ponto não é bloqueada por ele dentro do prazo

#### Scenario: O achado já é explorável em produção

- **WHEN** o achado é bloqueante, confirmado, e já explorável hoje em produção
- **THEN** não pode virar risco aceito
- **AND** vira uma change de correção imediata, que entra antes de qualquer outra

#### Scenario: Um agente tenta aceitar o risco

- **WHEN** um agente considera que um achado bloqueante pode esperar
- **THEN** o achado continua bloqueando até haver correção ou aceite escrito do Gabriel

#### Scenario: O prazo vence

- **WHEN** o prazo de um risco aceito vence sem a correção
- **THEN** o achado volta a bloquear

### Requirement: Change só de documentação tem conferência curta

Uma change cujo diff só toca documentação SHALL ser conferida apenas quanto a segredos e à cadeia
de entrega. O guardião SHALL confirmar pela lista de arquivos do diff que a change é só de
documentação antes de encurtar a conferência. As regras e as definições dos agentes, que mudam o
que eles podem fazer, NÃO SHALL contar como documentação.

#### Scenario: Change só de texto

- **WHEN** o diff de uma change só toca documentação
- **THEN** o guardião confere apenas segredos e a cadeia de entrega
- **AND** o relatório diz que a conferência foi curta, e por quê

#### Scenario: Change que se diz de documentação, mas não é

- **WHEN** o diff toca um arquivo que não é documentação
- **THEN** o guardião aplica o checklist inteiro

#### Scenario: Change que muda as regras dos agentes

- **WHEN** o diff só toca texto, mas muda as regras ou a definição de algum agente
- **THEN** o guardião aplica o checklist inteiro

### Requirement: O checklist de segurança tem códigos fixos

As conferências de segurança SHALL formar um checklist em que cada item tem um código fixo. Todo
relatório do guardião SHALL citar os achados por esse código, e SHALL dizer por que cada item ficou
sem conferência. Um código NÃO SHALL ser renumerado. Item novo recebe código novo.

#### Scenario: O relatório cobre o checklist

- **WHEN** o guardião termina uma auditoria
- **THEN** cada item do checklist aparece como conferido, com o que foi lido, ou como não aplicável
  ou não verificado, com o motivo
- **AND** cada achado cita o código do item

#### Scenario: O checklist ganha um item

- **WHEN** um item novo entra no checklist
- **THEN** recebe o próximo código livre, e nenhum código existente muda de significado

### Requirement: A superfície de ataque de cada release está escrita

O projeto SHALL manter um documento de segurança que diz o que o portal protege, de quem, e a
superfície de ataque de cada release, junto com o checklist. Quem implementa SHALL poder lê-lo
antes de escrever o código. O guardião SHALL lê-lo antes de auditar. A primeira change de cada
release SHALL atualizar a seção dela.

#### Scenario: Alguém vai implementar uma change

- **WHEN** quem implementa começa uma change
- **THEN** encontra no documento de segurança o checklist e a superfície da release em que está

#### Scenario: A primeira change de uma release

- **WHEN** a primeira change de uma release chega à auditoria sem ter atualizado a seção da release
  no documento de segurança
- **THEN** o guardião aponta a falta no relatório
