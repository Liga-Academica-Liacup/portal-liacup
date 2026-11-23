# Spec Delta — equipe-de-agentes

## MODIFIED Requirements

### Requirement: O ambiente local dos agentes é conferido antes de cada passagem

O líder técnico SHALL rodar uma conferência versionada antes de cada leva de pedidos de comando,
antes de entregar os comandos Git e depois de cada subagente. Ela compara com a versão principal,
pelo conteúdo e sem depender do que o Git esconde, a configuração e as instruções dos agentes no
disco, e lê a configuração local do Git que roda código. Diferença sem decisão registrada SHALL
parar o ciclo.

#### Scenario: Um arquivo de configuração de agente foi alterado

- **WHEN** um arquivo de configuração ou de instrução dos agentes no disco difere do da versão
  principal, ou existe só no disco
- **THEN** a conferência termina com erro e nomeia o arquivo
- **AND** o próximo agente não é chamado até o Gabriel decidir

#### Scenario: O arquivo está escondido por uma exclusão local

- **WHEN** um arquivo de configuração de agente está no disco e uma regra de exclusão local da
  máquina o esconde do estado da árvore
- **THEN** a conferência o acha do mesmo jeito
- **AND** lista também cada regra de exclusão local ativa

#### Scenario: A configuração local do Git roda código

- **WHEN** a pasta interna do Git tem um gancho ativo, uma chave de configuração fora da lista
  permitida ou atributos locais
- **THEN** a conferência para antes de rodar qualquer comando do Git
- **AND** nomeia o gancho, a chave ou o arquivo, sem mostrar valor que pareça segredo

#### Scenario: A diferença foi decidida

- **WHEN** a diferença está registrada como decidida na change em curso, com o conteúdo conferido
  e a decisão citada
- **THEN** a conferência não para por ela, e a saída cita a decisão

#### Scenario: A conferência diz quanto mediu

- **WHEN** a conferência termina, com ou sem diferença
- **THEN** a saída diz quantos arquivos comparou, quantas regras de exclusão, ganchos e chaves leu,
  e quantas diferenças aceitou por decisão

#### Scenario: A própria conferência foi alterada

- **WHEN** um dos arquivos da própria conferência no disco difere do da versão principal, sem
  decisão registrada
- **THEN** a conferência termina com erro e nomeia o arquivo, como faz com a configuração dos
  agentes
- **AND** com a diferença registrada como decidida, ela passa e cita a decisão

### Requirement: A conferência do guardião é proporcional ao risco

Fora da auditoria de base, o tamanho da conferência do guardião SHALL ser decidido pela lista de
arquivos do diff da change, inclusive os não rastreados, contra listas de caminhos escritas no
documento de segurança, e não por julgamento. A regra SHALL valer a partir da primeira change
aprovada depois de ela estar escrita.

#### Scenario: Change só de tela estática da R1

- **WHEN** todo arquivo do diff está na lista de tela, e nenhum na lista do gatilho
- **THEN** o guardião confere segredos, exposição, saída, terceiros e cabeçalhos
- **AND** o relatório diz que a conferência foi proporcional, e por quê

#### Scenario: A change toca um caminho do gatilho

- **WHEN** um arquivo do diff está na lista do gatilho, como a configuração dos agentes, os
  arquivos de configuração do Git, o CI, as dependências, o banco, o interruptor, a configuração do
  framework ou o que trata de variável de ambiente, cabeçalho, autenticação ou dado pessoal
- **THEN** o guardião aplica o checklist inteiro

#### Scenario: A change passa a ler variável de ambiente

- **WHEN** o diff acrescenta uma leitura de variável de ambiente fora dos caminhos do gatilho
- **THEN** o guardião aplica o checklist inteiro

#### Scenario: Um arquivo não está em nenhuma das listas

- **WHEN** um arquivo do diff não está na lista de tela nem na do gatilho
- **THEN** o guardião aplica o checklist inteiro

#### Scenario: A última change da release

- **WHEN** a change é a última da release
- **THEN** a auditoria de base roda, com o checklist inteiro, como antes

#### Scenario: A pasta da change traz o que governa

- **WHEN** o diff traz, dentro da pasta da change, o registro das diferenças decididas do ambiente
  ou uma spec delta de uma spec que está na lista do gatilho
- **THEN** o guardião aplica o checklist inteiro, mesmo que todo o resto do diff esteja na lista de
  tela
