# Spec Delta — fundacao-e-ci

## MODIFIED Requirements

### Requirement: Página provisória no ar

Enquanto o site não está publicado, o portal SHALL mostrar na raiz e no endereço próprio dela uma
página provisória que identifica a liga e oferece os canais que já funcionam, com a mesma aparência
e o mesmo texto de antes do interruptor. Todo outro endereço de página SHALL levar à raiz por
redirecionamento temporário. Enquanto a página inicial não existe, a raiz SHALL mostrar essa página
também com o site publicado.

#### Scenario: Visitante abre o endereço do portal

- **WHEN** uma pessoa abre a raiz do site
- **THEN** recebe status 200 e vê a logo da liga, a frase "Portal em construção", o nome da liga e
  os canais de Instagram e e-mail, com `/` na barra do navegador
- **AND** nenhuma rota promete página que ainda não existe

#### Scenario: Visitante abre outro endereço com o site não publicado

- **WHEN** uma pessoa abre qualquer outro endereço de página com o site não publicado, exista a
  página ou não, como `/sobre`, `/processo-seletivo` ou `/endereco-que-nao-existe`
- **THEN** a primeira resposta é um redirecionamento temporário (307) cujo destino é a raiz
- **AND** o navegador chega à raiz e mostra a página provisória

#### Scenario: A ferramenta interna fica escondida

- **WHEN** uma pessoa abre `/vitrine` com o site não publicado
- **THEN** é redirecionada temporariamente para a raiz e vê a página provisória, sem nenhum
  componente da vitrine

#### Scenario: O endereço próprio da página provisória

- **WHEN** uma pessoa abre `/em-construcao` com o site não publicado
- **THEN** recebe status 200 e vê a página provisória, sem redirecionamento

#### Scenario: A raiz com o site publicado, antes da página inicial

- **WHEN** uma pessoa abre a raiz com o site publicado, antes de a página inicial do site existir
- **THEN** recebe status 200 e vê a mesma página provisória, com `/` na barra do navegador
