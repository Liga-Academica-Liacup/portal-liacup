# Contrato das políticas de acesso — F02

**Data**: 2026-08-21 · Requisitos: FR-008 a FR-013 · Critérios: SC-002 a SC-006

Esta é a fronteira entre o que qualquer pessoa na internet pode fazer e o que só a diretoria pode.
Ela é aplicada **pelo banco**, não pela tela — uma tela que esquece de verificar não abre buraco, e é
esse o ponto.

## A matriz

Cada célula é **um teste**. As marcadas em negrito são as que provam bloqueio.

### As onze coleções de conteúdo

| Operação | Anônimo | Diretoria autenticada |
| --- | --- | --- |
| Ler publicado | permite | permite |
| **Ler rascunho** | **RECUSA** | permite |
| **Ler arquivado** | **RECUSA** | permite |
| **Criar** | **RECUSA** | permite |
| **Alterar** | **RECUSA** | permite |
| **Arquivar** | **RECUSA** | permite |
| **Remover de verdade** | **RECUSA** | **RECUSA** — apagar arquiva (FR-028) |

A última linha é a única em que a diretoria também é recusada, e é deliberada: a exclusão definitiva
não é uma operação da aplicação. Isso protege a diretoria dela mesma.

### Mensagens — a matriz invertida

| Operação | Anônimo | Diretoria autenticada |
| --- | --- | --- |
| Inserir | **permite** | permite |
| **Ler a lista** | **RECUSA** | permite |
| **Ler uma mensagem pelo identificador conhecido** | **RECUSA** | permite |
| **Alterar** | **RECUSA** | permite (marcar como lida, arquivar) |
| **Remover** | **RECUSA** | **RECUSA** — só a purga remove |

**A terceira linha é a que quase sempre falta.** Uma política que esconde a lista mas deixa buscar
por identificador **não protege nada**: identificador vaza em link, em log, em captura de tela.

### Controle de origem

Nenhum acesso anônimo, em nenhuma operação. Só o servidor escreve e lê, e só a purga remove.

## Como cada célula é testada

**Três clientes, com papéis que não se misturam:**

| Cliente | Papel |
| --- | --- |
| **Anônimo** | Exerce as células da coluna "Anônimo" |
| **Autenticado** | Exerce as células da coluna "Diretoria" |
| **De serviço** | **Só preparação e limpeza.** Nunca aparece no que está sendo verificado |

**A separação do cliente de serviço é o que impede o teste de mentir.** Se ele preparar *e*
verificar, ignora as políticas nos dois lados: a suíte fica verde com o banco inteiro aberto.

**Uma célula de recusa só passa se a operação falhar.** Receber lista vazia não é o mesmo que ser
recusado, e o teste distingue os dois: uma política ausente pode devolver vazio por acaso.

## Demonstração obrigatória (FR-013)

No padrão das V1 a V5 da F00 — verificação que ninguém viu falhar é verificação que ninguém sabe se
funciona.

| # | O que fazer | Esperado |
| --- | --- | --- |
| P1 | Desligar a política de leitura de uma coleção | O teste de bloqueio de rascunho **falha** |
| P2 | Religar | Volta ao verde |
| P3 | Criar uma tabela nova **sem** política | A verificação de cobertura **falha**, nomeando a tabela |

**P3 é o que mais importa a longo prazo**: ele garante que a regra "coleção sem política é bug" vale
para as tabelas que ainda não existem. Sem ele, a F06 cria uma tabela, esquece a política, e nada
avisa.

## O que estas políticas ainda não distinguem

O ADR-0001 prevê três papéis: administrador, editor e colaborador. **Esta feature distingue apenas
anônimo de autenticado.** A diferenciação entre os três, e quem os atribui, é da **F14** — política
por papel sem sistema de papéis seria regra sem quem a cumpra.

Registrado para não parecer esquecimento: quando a F14 chegar, esta matriz ganha colunas, e os testes
de bloqueio junto.
