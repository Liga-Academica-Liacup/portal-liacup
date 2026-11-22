# Spec Delta

## MODIFIED Requirements

### Requirement: Com o site publicado, o portal responde normalmente

Com o site publicado, cada endereço SHALL responder a página que existe nele, ou a resposta de
página não encontrada, sem redirecionamento. O endereço próprio da página em construção SHALL
responder como página não encontrada, para que nada dela sobre depois do lançamento.

#### Scenario: A ferramenta interna abre com o site publicado

- **WHEN** alguém abre `/vitrine` com o site publicado
- **THEN** vê a vitrine do design system, e não a página em construção

#### Scenario: Endereço sem página, com o site publicado

- **WHEN** alguém pede `/endereco-que-nao-existe` com o site publicado
- **THEN** recebe status 404, sem redirecionamento e sem destino de redirecionamento na resposta

#### Scenario: O endereço próprio da página em construção, com o site publicado

- **WHEN** alguém pede `/em-construcao` com o site publicado
- **THEN** recebe status 404, e não a página em construção

### Requirement: Os dois modos são verificados a cada alteração

Os testes de ponta a ponta SHALL verificar os dois modos sobre as mesmas quatro rotas, `/vitrine`,
`/sobre`, `/equipe` e `/processo-seletivo`, imprimindo quantas verificaram, e SHALL conferir o
status e o destino da primeira resposta de `/sobre` e de um endereço inexistente. A verificação do
modo não publicado SHALL ter sido vista falhando com o interruptor removido, e voltando ao verde.

#### Scenario: Modo não publicado

- **WHEN** os testes de ponta a ponta rodam contra o portal com o site não publicado
- **THEN** cada uma das quatro rotas responde primeiro com 307 para a raiz, e, seguido o
  redirecionamento, mostra a logo, a frase "Portal em construção" e os canais de Instagram e e-mail
- **AND** a raiz tem zero violações de acessibilidade e nenhuma rolagem horizontal em nenhuma das
  sete larguras
- **AND** a saída imprime `rotas verificadas: 4`

#### Scenario: A primeira resposta, sem seguir redirecionamento

- **WHEN** os testes pedem `/sobre` e `/endereco-que-nao-existe` sem seguir redirecionamento
- **THEN** com o site não publicado, os dois recebem 307, e o caminho do destino é `/`, venha ele
  absoluto ou relativo
- **AND** com o site publicado, `/sobre` recebe 200 e `/endereco-que-nao-existe` recebe 404, os dois
  sem destino de redirecionamento

#### Scenario: Modo publicado

- **WHEN** os testes de ponta a ponta rodam contra o portal com o site publicado
- **THEN** nenhuma das mesmas quatro rotas mostra a página em construção
- **AND** a saída imprime `rotas verificadas: 4`

#### Scenario: O interruptor some do código

- **WHEN** o interruptor é removido e os testes do modo não publicado rodam
- **THEN** ficam vermelhos, nomeando as rotas que responderam sem redirecionar para a raiz
- **AND** com o interruptor de volta, ficam verdes de novo
