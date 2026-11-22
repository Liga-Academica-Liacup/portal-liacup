# Spec Delta — camada-de-dados

## ADDED Requirements

### Requirement: Os testes de política carregam só as variáveis que usam

Os testes de política SHALL levar do arquivo local de ambiente para o processo só as variáveis de
uma lista fechada, por nome, e nenhuma outra. Pedir uma variável fora da lista SHALL falhar,
dizendo o nome pedido e a lista, sem mostrar valor de nenhuma variável.

#### Scenario: O arquivo local tem um segredo de outra finalidade

- **WHEN** o arquivo local de ambiente traz, além das variáveis da lista, o segredo de acesso às
  prévias da hospedagem
- **THEN** o segredo não entra no ambiente dos testes de política
- **AND** as variáveis da lista entram, e o ambiente do processo continua valendo mais que o
  arquivo

#### Scenario: Um teste pede variável fora da lista

- **WHEN** um teste de política pede uma variável que não está na lista
- **THEN** o pedido falha antes de ler o ambiente, com o nome pedido e a lista
- **AND** nenhum valor aparece na mensagem

#### Scenario: O carregador volta a levar o arquivo inteiro

- **WHEN** alguém muda o carregador para levar ao processo uma variável fora da lista
- **THEN** a suíte de unidade fica vermelha, sem depender do banco de teste
- **AND** a saída diz quantas variáveis o arquivo de teste tinha e quantas entraram
