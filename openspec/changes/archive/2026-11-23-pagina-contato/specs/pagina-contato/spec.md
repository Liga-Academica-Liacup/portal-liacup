# Spec Delta

## ADDED Requirements

### Requirement: A página Contato mostra os três canais da liga

Com o site publicado, `/contato` SHALL mostrar, sem formulário, o sobretítulo, o título principal e
três quadros de contato, numa coluna até 1024 px e com o título à esquerda e os quadros à direita
acima disso, composição aprovada pelo Gabriel sobre o protótipo.

#### Scenario: O topo da página

- **WHEN** alguém abre `/contato` com o site publicado, em qualquer largura
- **THEN** vê o sobretítulo "Contato" e o título principal "Fale com a Liga"
- **AND** não aparece frase abaixo do título, nem a do protótipo, que fala de dúvidas, convites e
  parcerias

#### Scenario: Os três quadros

- **WHEN** alguém lê a página depois do título, em qualquer largura
- **THEN** vê três quadros, anunciados por leitor de tela como uma lista de três itens: "Instagram",
  com a logo da liga e `@liacup.unb`; "E-mail", com o ícone do Gmail e `liacup.unb@gmail.com`; e
  "Onde estamos", com a borboleta da liga e o endereço "FCTS · Campus UnB Ceilândia, QNN 14 Área
  Especial, Ceilândia Sul, CEP 72220-140, Brasília/DF"
- **AND** a logo, o ícone e a borboleta são decorativos e não são anunciados por leitor de tela
- **AND** a página tem um único título principal, e nenhum título pula nível

#### Scenario: Sem formulário

- **WHEN** a página é aberta em qualquer largura
- **THEN** não há nenhum campo de formulário, nem botão de envio, nem o título "Mande uma mensagem"

#### Scenario: Uma coluna até 1024 px

- **WHEN** a página é aberta em 360, 390, 430, 480, 768 ou 1024 px
- **THEN** o sobretítulo e o título vêm primeiro e os três quadros vêm abaixo deles, numa coluna só
- **AND** não há rolagem horizontal

#### Scenario: Título à esquerda e quadros à direita acima de 1024 px

- **WHEN** a página é aberta em 1280 px
- **THEN** o sobretítulo e o título ficam na coluna da esquerda, e os três quadros, um abaixo do
  outro, ficam na coluna da direita, inteiros à direita do título
- **AND** os quadros ficam alinhados ao topo do título: a coluna dos quadros começa na mesma altura
  da coluna do título
- **AND** a ordem de leitura e de foco é a mesma do celular: sobretítulo, título e os quadros na
  ordem Instagram, E-mail, Onde estamos
- **AND** não há rolagem horizontal

### Requirement: Os quadros do Instagram e do e-mail são links inteiros

Os quadros do Instagram e do e-mail SHALL ser clicáveis em toda a área, com o destino que as regras
de tela do projeto decidem, o dado continuando escrito na tela, um nome acessível que começa pelo
texto visível e os estados interativos de todo controle. O quadro "Onde estamos" SHALL ser texto, e
não link.

#### Scenario: O Instagram

- **WHEN** alguém toca ou clica em qualquer ponto do quadro do Instagram, e não só no texto
- **THEN** abre `https://www.instagram.com/liacup.unb/` em nova aba, sem dar à página aberta acesso
  à página de origem nem o endereço de origem
- **AND** o nome acessível do link começa por "Instagram" e `@liacup.unb`, nessa ordem, e diz que
  abre em nova aba

#### Scenario: O e-mail

- **WHEN** alguém toca ou clica em qualquer ponto do quadro do e-mail
- **THEN** abre um e-mail novo para `liacup.unb@gmail.com` no aplicativo de e-mail da pessoa, na
  mesma aba
- **AND** o nome acessível do link começa por "E-mail" e `liacup.unb@gmail.com`, nessa ordem

#### Scenario: O endereço não é link

- **WHEN** alguém toca no quadro "Onde estamos"
- **THEN** nada acontece: o endereço é texto, que se pode selecionar e copiar

#### Scenario: Teclado, foco e toque

- **WHEN** alguém percorre a página com Tab
- **THEN** os dois quadros clicáveis recebem foco, cada um com o contorno de foco visível em volta
  do quadro inteiro, e o quadro "Onde estamos" não recebe foco
- **AND** cada quadro clicável mostra os estados de repouso, hover, pressionado e foco, e mede pelo
  menos 44 × 44 px

### Requirement: A página Contato não mostra dado errado, legenda de demonstração nem serviço de terceiros

A página SHALL omitir os dados de exemplo do protótipo que as correções obrigatórias apontam, as
legendas que eram instruções do protótipo, o travessão no texto da tela e todo conteúdo de serviço
de terceiros.

#### Scenario: Nada errado nem de demonstração

- **WHEN** alguém lê a página inteira
- **THEN** não aparecem `liacup@unb.br`, "Faculdade de Medicina", "Darcy Ribeiro", "Perfil do
  Instagram", "Logo do e-mail", "Foto de perfil do Instagram da liga", "Reuniões" nem "Imprensa"
- **AND** nenhum texto da página tem travessão

#### Scenario: Sem serviço de terceiros

- **WHEN** alguém abre a página
- **THEN** a página não faz nenhum pedido a domínio externo, e não mostra mapa nem conteúdo de outro
  site

### Requirement: O texto da página Contato é o do documento de conteúdo, conferido por teste

O @ do Instagram, o e-mail e o endereço SHALL ser os da seção 1 do documento de conteúdo, palavra
por palavra, com o travessão do endereço trocado por "·", e um teste SHALL comparar a página
publicada com o documento, lendo o documento, e não uma cópia do texto. Os rótulos SHALL ser os
registrados como rótulos de interface nas regras de tela do projeto.

#### Scenario: A página confere com o documento

- **WHEN** os testes de ponta a ponta rodam com o site publicado
- **THEN** o @ do Instagram, o e-mail e o endereço são idênticos aos da seção 1 do documento de
  conteúdo, com exatamente um travessão trocado por "·" no endereço
- **AND** nenhum texto da página fica fora do documento e dos rótulos registrados
- **AND** a saída imprime quantos trechos conferiu e quantos travessões trocou, um

#### Scenario: Página e documento divergem

- **WHEN** uma letra da página difere do documento de conteúdo, ou o endereço aparece com o
  travessão
- **THEN** o teste fica vermelho, nomeando o trecho, o texto esperado e o recebido

#### Scenario: Os links divergem da regra de tela

- **WHEN** o link do Instagram deixa de abrir em nova aba, ou passa a dar à página aberta acesso à
  de origem, ou um dos dois links deixa de cobrir o quadro inteiro
- **THEN** o teste fica vermelho, nomeando o quadro e o que recebeu

### Requirement: A página Contato segue o interruptor

A página SHALL existir só com o site publicado. Com o site não publicado, o endereço dela SHALL
levar à raiz, que mostra a página em construção, sem nenhuma mudança nela. A verificação SHALL
cobrir os dois modos e imprimir quantos verificou.

#### Scenario: Site não publicado

- **WHEN** alguém pede `/contato` com o site não publicado
- **THEN** a primeira resposta é 307, com destino `/`, e o navegador chega à página em construção,
  com a logo, a frase "Portal em construção" e os canais de Instagram e e-mail
- **AND** a página em construção é a mesma de antes desta entrega, pixel a pixel, em 390 e 1280 px

#### Scenario: Site publicado

- **WHEN** alguém pede `/contato` com o site publicado
- **THEN** recebe 200, sem redirecionamento e sem destino de redirecionamento na resposta

#### Scenario: A verificação diz o que verificou

- **WHEN** os testes de ponta a ponta da página rodam
- **THEN** a saída imprime em quantos dos dois modos o endereço foi verificado, dois
- **AND** com a verificação do modo não publicado apontada para o site publicado, ela fica vermelha,
  nomeando o status e o destino recebidos
