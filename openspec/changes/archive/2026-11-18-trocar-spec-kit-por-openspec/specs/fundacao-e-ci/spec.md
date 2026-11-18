# Spec Delta — fundacao-e-ci

## Purpose

O esqueleto do portal e o portão automático que o protege: o projeto Next.js com TypeScript
estrito, as verificações que rodam na máquina de quem escreve e no CI, e a página provisória que
prova que o caminho do código até o ar funciona.

## ADDED Requirements

### Requirement: Página provisória no ar

Enquanto as páginas institucionais não existem, o portal SHALL responder com uma página
provisória que identifica a liga e oferece os canais que já funcionam.

#### Scenario: Visitante abre o endereço do portal

- **WHEN** uma pessoa abre a raiz do site
- **THEN** vê a logo da liga, a frase "Portal em construção" e os canais de Instagram e e-mail
- **AND** nenhuma rota promete página que ainda não existe

### Requirement: Uma verificação local reúne todas as conferências

O projeto SHALL oferecer um comando único que roda todas as conferências de qualidade e para na
primeira que falhar, para que ninguém precise lembrar a lista nem a ordem.

#### Scenario: Quem escreve roda a verificação antes de propor

- **WHEN** alguém roda `npm run verificar`
- **THEN** as conferências rodam em sequência
- **AND** a primeira que falhar interrompe a execução e diz o que encontrou

### Requirement: O CI é o portão, e não avisa sem barrar

Toda alteração proposta SHALL passar por um job único de verificações, sem nenhuma etapa que
avise e deixe passar, e a `main` SHALL recusar incorporação com o CI vermelho.

#### Scenario: Alteração proposta com verificação vermelha

- **WHEN** uma alteração proposta quebra qualquer das verificações
- **THEN** o job `Verificacoes` fica vermelho
- **AND** o botão de incorporar fica bloqueado, sem dispensa para administrador

### Requirement: Acessibilidade e responsividade medidas, não prometidas

Toda página entregue SHALL ser medida automaticamente quanto a violações de acessibilidade e a
rolagem horizontal, com o resultado expresso em número.

#### Scenario: Teste de ponta a ponta roda sobre as páginas

- **WHEN** o CI roda os testes de ponta a ponta
- **THEN** o axe-core acusa zero violações
- **AND** nenhuma página tem rolagem horizontal em 360, 390, 430, 480, 768, 1024 e 1280 px

### Requirement: Desempenho medido contra a versão compilada

O CI SHALL medir desempenho e acessibilidade por página com o Lighthouse, sempre contra a versão
compilada, e SHALL reprovar quando a nota cair abaixo do limiar.

#### Scenario: Uma imagem pesada entra no projeto

- **WHEN** o Lighthouse roda sobre a versão compilada
- **THEN** reprova se o desempenho ficar abaixo de 90 ou a acessibilidade abaixo de 95
- **AND** o limiar não é baixado para fazer a medição passar
