# fundacao-e-ci Specification

## Purpose
O esqueleto do portal e o portão automático que o protege: o projeto Next.js com TypeScript
estrito, as verificações que rodam na máquina de quem escreve e no CI, e a página provisória que
prova que o caminho do código até o ar funciona.

## Requirements

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
