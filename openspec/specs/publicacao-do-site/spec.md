# publicacao-do-site Specification

## Purpose
O interruptor que decide se o público vê o site ou só a página em construção. Existe para que todo
trabalho entre na `main` em pedaços pequenos sem aparecer em produção antes do lançamento: lançar
é ligar o interruptor, e voltar atrás é desligá-lo.

## Requirements

### Requirement: Só um valor exato publica o site

O portal SHALL considerar o site publicado somente quando a variável `SITE_PUBLICADO` tiver
exatamente o texto `true`. Qualquer outro valor, inclusive a ausência da variável, SHALL manter o
site não publicado. Um erro de configuração esconde o site, nunca o expõe.

#### Scenario: O valor exato publica

- **WHEN** o portal responde com `SITE_PUBLICADO` igual a `true`
- **THEN** o site está publicado

#### Scenario: Valores parecidos não publicam

- **WHEN** o portal responde com `SITE_PUBLICADO` ausente, vazio, `TRUE`, `True`, `1`, `sim`,
  `false` ou ` true` (com espaço)
- **THEN** o site não está publicado: a raiz mostra a página em construção, e os demais endereços
  de página levam a ela

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

### Requirement: A página em construção chega inteira

Com o site não publicado, as imagens, as fontes, os estilos e os scripts de que a página em
construção depende SHALL ser servidos normalmente, sem redirecionamento nem troca pela própria
página, para que ela apareça completa a quem chega por qualquer endereço.

#### Scenario: A logo aparece depois do redirecionamento

- **WHEN** alguém abre `/processo-seletivo` com o site não publicado
- **THEN** chega à raiz, e a logo da liga aparece carregada, e não como imagem quebrada

#### Scenario: Um arquivo público é pedido diretamente

- **WHEN** alguém pede diretamente o arquivo de imagem da logo, com o site não publicado
- **THEN** recebe a imagem, com status 200 e sem redirecionamento

### Requirement: O modo é decidido quando o site responde, não quando é compilado

A mesma versão compilada do portal SHALL servir qualquer dos dois modos, conforme o valor de
`SITE_PUBLICADO` presente quando o servidor inicia, sem precisar compilar de novo para trocar de
modo.

#### Scenario: Uma compilação, dois modos

- **WHEN** a mesma versão compilada é iniciada duas vezes, uma com `SITE_PUBLICADO` igual a `true`
  e outra sem a variável
- **THEN** na primeira, `/vitrine` mostra a vitrine
- **AND** na segunda, `/vitrine` é redirecionada para a raiz, que mostra a página em construção

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

### Requirement: Quem mantém sabe operar o interruptor

O guia do projeto e a lista de variáveis de ambiente SHALL explicar, sem exigir leitura de código,
o que `SITE_PUBLICADO` faz, o único valor que publica, como ela fica em produção e nas prévias, que
uma mudança na hospedagem só vale depois de uma nova implantação, e como ver o site publicado na
própria máquina.

#### Scenario: A diretoria do ano seguinte precisa lançar o site, ou voltar atrás

- **WHEN** uma pessoa sem formação em tecnologia lê o guia do projeto
- **THEN** encontra onde a variável se configura em produção e nas prévias, e o valor de cada uma
- **AND** encontra que, depois de mudar a variável, é preciso implantar de novo para a mudança
  valer
