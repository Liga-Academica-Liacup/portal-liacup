# camada-de-dados Specification

## Purpose
O banco do portal descrito no repositório e não no painel: esquema versionado em migrações
numeradas, acesso por linha fechado por padrão em toda tabela, e prazo declarado para todo dado
pessoal.

## Requirements

### Requirement: O esquema mora no repositório

Esquema, políticas de acesso e dados de exemplo SHALL viver versionados em `supabase/`, em
migrações numeradas que rodam em ordem, e NÃO SHALL ser alterados pelo painel do Supabase.

#### Scenario: O banco precisa de uma tabela nova

- **WHEN** alguém precisa criar ou alterar uma tabela
- **THEN** escreve uma migração numerada em `supabase/migrations/`
- **AND** o repositório continua sendo a descrição completa do que está no ar

### Requirement: Toda tabela nasce fechada

Cada uma das 13 tabelas SHALL ter controle de acesso por linha ativo na mesma migração que a cria,
e cada política SHALL ser testada provando que **bloqueia**, não só que permite.

#### Scenario: Suíte de políticas roda

- **WHEN** `npm run test:banco` executa
- **THEN** cada política é exercida nos dois sentidos, permissão e recusa
- **AND** a saída informa quantas células de recusa foram verificadas

### Requirement: Concessão e política se conferem juntas

A verificação de acesso SHALL mostrar, por tabela, concessão e política lado a lado, e SHALL
falhar quando encontrar política sem concessão.

#### Scenario: Tabela ganha política e fica sem concessão

- **WHEN** uma tabela tem política definida e nenhuma concessão ao papel que a usa
- **THEN** `npm run banco:rls` falha
- **AND** a saída nomeia a tabela, porque a tabela recusa tudo e parece configurada

### Requirement: Os tipos conferem com o esquema

Os tipos gerados a partir do esquema SHALL ser versionados e SHALL falhar a verificação quando
divergirem do banco, para que "os tipos estão atualizados" seja medição e não promessa.

#### Scenario: Alguém altera o banco e esquece de regerar

- **WHEN** o esquema muda e `src/lib/supabase/tipos.ts` continua o antigo
- **THEN** `npm run banco:tipos:check` falha

### Requirement: Dado pessoal tem prazo, conteúdo do site não se apaga

Dado pessoal SHALL ser removido em definitivo ao fim do prazo declarado, e conteúdo do site
SHALL ser arquivado em vez de removido.

#### Scenario: A purga mensal roda

- **WHEN** alguém roda `npm run purgar:dado-pessoal`
- **THEN** mensagens com mais de 24 meses e registros de origem com mais de 24 horas são apagados
- **AND** a saída informa quantos registros saíram, distinguindo "apagados: 0" de "NAO EXECUTADA"

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
