# Spec delta — equipe-de-agentes

## ADDED Requirements

### Requirement: A lista de comandos Git busca segredo antes de enviar

A lista de comandos Git de toda entrega SHALL trazer a busca de segredo logo depois da conferência
do ambiente local, antes de qualquer commit ou envio. Se a busca não terminar com nada achado, o
Gabriel SHALL parar a lista e mandar a saída ao líder técnico. Agente nenhum SHALL tirar a busca da
lista nem trocá-la de lugar.

#### Scenario: A ordem da lista

- **WHEN** uma entrega traz comandos Git para o Gabriel rodar
- **THEN** o primeiro comando é a conferência do ambiente local, e o segundo é a busca de segredo
- **AND** nenhum commit nem envio vem antes deles

#### Scenario: A busca acha uma chave

- **WHEN** a busca de segredo termina com achado
- **THEN** o Gabriel não roda mais nenhum comando da lista e manda a saída ao líder técnico
- **AND** o achado é tratado como bloqueante de segredos até prova em contrário, e chave real é
  trocada antes de qualquer commit

#### Scenario: A busca não conclui

- **WHEN** a busca de segredo termina como não verificada
- **THEN** o Gabriel para a lista do mesmo jeito, e o líder técnico diz o que falta para ela rodar
