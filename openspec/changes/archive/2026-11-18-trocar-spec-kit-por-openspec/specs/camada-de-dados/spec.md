# Spec Delta — camada-de-dados

## Purpose

O banco do portal descrito no repositório e não no painel: esquema versionado em migrações
numeradas, acesso por linha fechado por padrão em toda tabela, e prazo declarado para todo dado
pessoal.

## ADDED Requirements

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
