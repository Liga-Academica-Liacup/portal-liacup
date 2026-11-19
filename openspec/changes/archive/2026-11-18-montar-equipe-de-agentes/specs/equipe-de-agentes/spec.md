# Spec Delta — equipe-de-agentes

## Purpose

Quem são os agentes que trabalham neste repositório, o escopo e as ferramentas de cada um, as
regras que todos leem antes de começar e o formato do relatório que devolvem. Existe para que a
regra valha por arquivo versionado, e não por alguém lembrar de colá-la na conversa.

## ADDED Requirements

### Requirement: Os agentes são declarados em arquivos versionados

Cada agente do projeto SHALL ter um arquivo próprio no repositório, declarando seu nome, quando
usar, as ferramentas a que tem acesso, o que faz e o que não faz. Agente combinado em conversa e
não escrito em arquivo NÃO SHALL ser considerado parte da equipe.

#### Scenario: Alguém precisa saber qual agente chamar

- **WHEN** uma pessoa ou um agente abre o repositório pela primeira vez
- **THEN** encontra um arquivo por agente, e a descrição de cada um diz em que situação usá-lo
- **AND** nenhum agente da equipe existe apenas na memória de uma conversa

### Requirement: Toda sessão começa pelas regras do projeto

O repositório SHALL carregar, sem ninguém pedir, um arquivo de raiz que apresenta o projeto, aponta
os documentos que governam a decisão e traz as regras de Git e o ciclo de uma change.

#### Scenario: Uma sessão nova começa a trabalhar

- **WHEN** um agente começa a trabalhar no repositório
- **THEN** já conhece a hierarquia de decisão, o gabarito visual e a origem dos textos
- **AND** sabe que nenhuma linha de código entra sem proposta aprovada

### Requirement: Quem revisa não consegue escrever

O agente que revisa o trabalho SHALL ter apenas ferramentas de leitura, sem nenhuma ferramenta de
escrita nem de execução de comando, para que a independência da revisão seja trava e não promessa.

#### Scenario: O revisor encontra um defeito

- **WHEN** o revisor encontra algo errado no trabalho entregue
- **THEN** descreve o defeito no relatório
- **AND** não tem caminho técnico para corrigi-lo, nem rodando comando

### Requirement: Quem confere o visual aponta, não corrige

O agente que compara as telas com o gabarito aprovado SHALL listar cada diferença visível, dizendo
onde está e se ela vem de uma adaptação de acessibilidade já aprovada ou se precisa de decisão do
Gabriel. Ele NÃO SHALL alterar o código do produto.

#### Scenario: O site saiu diferente do gabarito

- **WHEN** uma tela entregue não bate com o print de referência
- **THEN** a diferença é listada, com o lugar e o motivo provável
- **AND** o código do produto chega ao fim da conferência inalterado

### Requirement: Relatório de no máximo uma tela, com número

Todo agente SHALL devolver relatório que caiba em uma tela, com número sempre que houver número, e
SHALL declarar como incompleto o que ficou incompleto.

#### Scenario: Um agente termina sua parte

- **WHEN** um agente conclui a tarefa que recebeu
- **THEN** devolve o resultado em no máximo uma tela, dizendo quanto mediu
- **AND** item pulado aparece escrito, nunca silenciado

### Requirement: O trabalho dos agentes fica registrado no repositório

Cada change SHALL ter um registro versionado onde o trabalho de cada agente é anotado, para que
nenhum achado fique só numa conversa que ninguém mais abre.

#### Scenario: Uma change termina e alguém pergunta o que foi medido

- **WHEN** a change chega ao fim
- **THEN** o registro da change mostra o que cada agente fez, com os números que apurou
- **AND** quem assumir o projeto depois encontra isso lendo o repositório

### Requirement: Nenhum agente escreve no Git

Nenhum agente SHALL executar operação de escrita no Git — commit, push, abertura de alteração
proposta ou incorporação. Os agentes SHALL preparar os arquivos e entregar os comandos prontos
para o Gabriel executar.

#### Scenario: Uma change está pronta para entrar

- **WHEN** o trabalho de uma change termina
- **THEN** a entrega traz os arquivos prontos e os comandos de Git escritos
- **AND** a execução desses comandos é do Gabriel, não do agente
