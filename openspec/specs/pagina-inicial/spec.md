# pagina-inicial Specification

## Purpose
O que a página inicial mostra a quem chega ao portal, com o texto aprovado pela liga e sem nada
inventado. Na R1, são o hero (sobretítulo, título, lema, apresentação e o quadro no lugar da foto),
os números da liga, a faixa do processo seletivo e o bloco de contato; a agenda, as notícias e o
conteúdo educativo entram na R2 e na R5. Nasceu na change `layout-e-hero` e foi completada na
`inicio-completo` (R1).

## Requirements

### Requirement: A página inicial abre com o hero aprovado pela liga

Com o site publicado, a raiz SHALL mostrar a página inicial, aberta pelo hero do protótipo aprovado:
o sobretítulo, e o título, o lema e a apresentação aprovados pela liga, sem nenhum texto inventado.
Os botões do hero SHALL aparecer só quando a página a que levam estiver na lista de páginas
públicas. Enquanto a foto institucional não chega, o espaço dela SHALL mostrar o quadro do protótipo
com uma borboleta da liga, decorativa, e nunca SHALL mostrar imagem inventada nem texto de
marcação.

#### Scenario: Título e lema

- **WHEN** alguém abre a raiz com o site publicado
- **THEN** o título principal da página é "Cuidar é o ato mais sublime da conexão humana"
- **AND** logo abaixo está o lema "Curar às vezes, confortar sempre"
- **AND** acima do título está o sobretítulo "Universidade de Brasília"

#### Scenario: O parágrafo de apresentação

- **WHEN** alguém lê o hero
- **THEN** o parágrafo de apresentação é, palavra por palavra, "A LIACUP reúne estudantes de
  diversas áreas do conhecimento em torno do ensino, da pesquisa e da extensão em cuidados
  paliativos. Aqui fica guardado, em um só lugar, tudo o que a Liga produz."

#### Scenario: Botões só para páginas que existem

- **WHEN** a página de Processo seletivo e a página Sobre não estão na lista de páginas públicas
- **THEN** o hero não mostra "Quero participar" nem "Conheça a Liga"
- **AND** quando uma delas entra na lista, o botão correspondente aparece e leva a ela

#### Scenario: Sem foto, o quadro mostra uma borboleta da liga

- **WHEN** alguém abre a raiz com o site publicado, em qualquer largura
- **THEN** o espaço da foto mostra o quadro do protótipo com uma borboleta da liga grande, em
  opacidade baixa, sem texto
- **AND** não aparece nenhum texto como "Foto institucional da Liga", nenhum ícone de imagem
  ausente e nenhuma imagem que não seja da liga
- **AND** o quadro e as borboletas do hero são decorativos: não são anunciados por leitor de tela e
  não ficam por cima de texto

#### Scenario: O lema é legível em toda largura

- **WHEN** o contraste do lema é medido contra o fundo, em cada uma das sete larguras
- **THEN** atinge pelo menos 4,5:1, porque no celular o lema não é texto grande
- **AND** a cor do lema é o lilás escurecido do botão primário do ADR-0003, `#82558f`, e não o
  lilás da marca `#9B6AAF`
- **AND** o registro nomeia as duas cores e a superfície medida

### Requirement: A inicial mostra os números da liga logo abaixo do hero

Com o site publicado, a raiz SHALL mostrar, logo abaixo do hero e no mesmo fundo dele, os quatro
números aprovados pela liga, cada um num cartão com o seu rótulo, sem título de seção e sem nenhum
texto inventado.

#### Scenario: Os quatro números

- **WHEN** alguém abre a raiz com o site publicado, em qualquer largura
- **THEN** logo depois do hero vê, nesta ordem, "21" com "membros ativos", "7" com "cursos
  representados", "4" com "ações realizadas" e "2026" com "ano de fundação"
- **AND** o leitor de tela anuncia uma lista de quatro itens, cada um com o número e o rótulo juntos

#### Scenario: A disposição no celular e no desktop

- **WHEN** a página é aberta em 390 px
- **THEN** os quatro cartões ficam em duas colunas de dois, como no gabarito
- **AND** em 1280 px os quatro ficam numa linha só
- **AND** em nenhuma das sete larguras há rolagem horizontal

### Requirement: Os números moram num lugar só, separado da composição

Os quatro números e os rótulos SHALL ficar num lugar só de dados, separado da composição da página,
para que a diretoria os revise na passagem de gestão sem mexer na composição e para que o painel da
R3 possa assumir esse lugar.

#### Scenario: Trocar um número

- **WHEN** quem mantém troca "21" por outro número no lugar dos dados
- **THEN** a inicial mostra o número novo, e nenhuma linha da composição mudou

#### Scenario: O lugar dos dados é conferido

- **WHEN** o lugar dos dados tem um número vazio, um rótulo vazio ou uma quantidade de números
  diferente de quatro
- **THEN** a verificação de unidade fica vermelha, nomeando o item
- **AND** a saída imprime quantos números conferiu

### Requirement: A inicial mostra a faixa do processo seletivo no estado das inscrições

Com o site publicado, a raiz SHALL mostrar, depois dos números, a faixa do processo seletivo do
protótipo, com o estado das inscrições lido do mesmo lugar de dados da página do processo seletivo,
sem nenhum texto de exemplo do protótipo.

#### Scenario: Inscrições fechadas

- **WHEN** alguém abre a raiz com o site publicado e as inscrições estão fechadas
- **THEN** a faixa mostra, nesta ordem, o selo "Inscrições fechadas", o título de seção "Processo
  seletivo", o aviso "As inscrições estão fechadas. Acompanhe a Liga no Instagram @liacup.unb para
  saber quando abre o próximo processo seletivo." e o botão "Quero participar", que leva a
  `/processo-seletivo`
- **AND** o `@liacup.unb` do aviso é um link para `https://www.instagram.com/liacup.unb/`, que abre
  em nova aba sem dar à página aberta acesso à página de origem nem o endereço de origem, e cujo
  nome acessível diz o destino e contém o texto visível do link

#### Scenario: Nada do exemplo do protótipo

- **WHEN** alguém lê a faixa, em qualquer largura
- **THEN** não aparecem "2026.2", "Inscrições abertas", "28 de agosto", "prova de conhecimentos",
  "Ver o edital" nem nenhuma data

#### Scenario: A faixa e a página nunca se contradizem

- **WHEN** quem mantém troca o selo ou o aviso das inscrições no lugar dos dados do processo
  seletivo
- **THEN** a faixa da inicial e a página `/processo-seletivo` mostram o mesmo texto novo
- **AND** nenhuma linha da composição da inicial nem da página do processo seletivo mudou

#### Scenario: O botão só leva a página que existe

- **WHEN** a página do processo seletivo não está na lista de páginas públicas
- **THEN** a faixa não mostra o botão "Quero participar"

#### Scenario: A faixa é legível

- **WHEN** o contraste de cada texto da faixa é medido contra a superfície em que ele está, inclusive
  sobre o círculo decorativo, nas sete larguras
- **THEN** cada um atinge pelo menos 4,5:1
- **AND** nenhum texto pequeno fica sobre o lilás da marca `#9B6AAF`
- **AND** o registro nomeia as duas cores e a superfície de cada medida

#### Scenario: Teclado, foco e toque na faixa

- **WHEN** alguém percorre a faixa com Tab
- **THEN** o link do aviso e o botão recebem foco, cada um com o contorno de foco visível sobre a
  faixa
- **AND** cada um mostra os estados de repouso, hover, pressionado e foco, e mede pelo menos 44 ×
  44 px

### Requirement: O botão, o selo e o link da faixa se destacam do cartão

O botão da faixa SHALL ter fundo diferente do fundo do cartão. O texto do botão, do selo "Inscrições
fechadas" e do link do aviso SHALL medir pelo menos 4,5:1 contra a superfície em que está, e a borda
do botão e o contorno de foco SHALL medir pelo menos 3:1 contra o cartão, em cada estado, no pior
ponto, inclusive sobre o círculo decorativo.

#### Scenario: O botão em cada estado

- **WHEN** o botão da faixa é medido em repouso, hover, pressionado e foco, nas sete larguras
- **THEN** o texto dele atinge pelo menos 4,5:1 contra o fundo do próprio botão
- **AND** o fundo do botão atinge pelo menos 3:1 contra o cartão e contra o círculo decorativo, no
  ponto em que a diferença é menor
- **AND** o fundo do botão em repouso não é a cor do cartão

#### Scenario: O foco visível sobre o cartão

- **WHEN** o botão ou o link do aviso recebe foco pelo teclado
- **THEN** o contorno de foco atinge pelo menos 3:1 contra o cartão e contra o círculo decorativo

#### Scenario: O anel de foco da faixa é o creme do fundo da página

- **WHEN** alguém percorre a faixa com Tab e o link do aviso e o botão recebem foco, um de cada vez
- **THEN** cada um mostra o contorno de foco na cor creme do fundo da página, `--color-bg`
  `#f5ead8`, e não na cor do contorno de foco do resto do site, `--color-accent-700` `#683f74`
- **AND** o contorno mede 4,84:1 contra o cartão `#82558f`, e o registro nomeia as duas cores e a
  superfície

#### Scenario: O selo e o link do aviso

- **WHEN** o selo e o link do aviso são medidos, o link em repouso, hover e pressionado
- **THEN** o texto do selo atinge pelo menos 4,5:1 contra o fundo do selo
- **AND** o texto do link atinge pelo menos 4,5:1 contra o que estiver atrás dele, cartão, círculo
  ou fundo do estado
- **AND** o registro de cada medida nomeia as duas cores e a superfície

### Requirement: O botão da faixa segue o contrato único do botão do site

O botão da faixa SHALL usar uma aparência própria do contrato único de botão do site, para fundo
escuro, com os estados de repouso, hover, pressionado e foco. Essa aparência SHALL ser a mesma num
botão e num link que parece botão, como as outras aparências do contrato, e as outras aparências e
as telas que já as usam SHALL continuar como estão.

#### Scenario: O contrato cobre a aparência nova

- **WHEN** as verificações de unidade do botão rodam
- **THEN** um botão e um link com aparência de botão, na aparência nova, em largura natural e em
  largura total, saem com a mesma aparência, como já se confere para as outras aparências
- **AND** nenhuma conferência que já existia nessas verificações foi alterada nem removida

### Requirement: A inicial termina no bloco de contato com o Instagram e o e-mail

Com o site publicado, a raiz SHALL mostrar, depois da faixa e antes do rodapé, o bloco de contato:
o sobretítulo, o título de seção e os quadros do Instagram e do e-mail da página Contato, cada um
num cartão clicável em toda a área, sem frase, sem botão e sem dado errado do protótipo.

#### Scenario: O bloco

- **WHEN** alguém lê o bloco de contato, em qualquer largura
- **THEN** vê o sobretítulo "Contato", o título de seção "Onde a Liga responde" e dois cartões,
  anunciados por leitor de tela como uma lista de dois itens: "Instagram", com a logo da liga e
  `@liacup.unb`, e "E-mail", com o ícone do Gmail e `liacup.unb@gmail.com`
- **AND** a logo e o ícone são decorativos e não são anunciados por leitor de tela
- **AND** não aparecem a frase "O Instagram é o canal mais rápido. Para assuntos formais, escreva
  para o e-mail da Liga.", o botão "Mandar uma mensagem" nem o quadro "Onde estamos"

#### Scenario: Os cartões são links inteiros

- **WHEN** alguém toca ou clica em qualquer ponto de um cartão, inclusive no preenchimento e perto
  dos cantos, e não só no texto
- **THEN** o do Instagram abre `https://www.instagram.com/liacup.unb/` em nova aba, sem dar à página
  aberta acesso à página de origem nem o endereço de origem, e o do e-mail abre um e-mail novo para
  `liacup.unb@gmail.com` no aplicativo de e-mail da pessoa, na mesma aba
- **AND** o nome acessível de cada link começa pelo rótulo e pelo dado escritos no cartão, nessa
  ordem, e o do Instagram diz que abre em nova aba

#### Scenario: Teclado, foco e toque nos cartões

- **WHEN** alguém percorre o bloco com Tab
- **THEN** cada cartão recebe foco, com o contorno de foco visível em volta do cartão inteiro
- **AND** cada cartão mostra os estados de repouso, hover, pressionado e foco, e mede pelo menos 44
  × 44 px

#### Scenario: Nada errado nem de demonstração

- **WHEN** alguém lê o bloco de contato
- **THEN** não aparecem `liacup@unb.br`, "Perfil do Instagram", "Logo do e-mail" nem "Foto de perfil
  do Instagram da liga", e nenhum texto do bloco tem travessão

#### Scenario: A página Contato não muda

- **WHEN** `/contato` é aberta em 390 e 1280 px com o site publicado, depois desta entrega, e
  capturada como na entrega da página Contato
- **THEN** a captura é idêntica, pixel a pixel e no tamanho, à captura de `/contato` guardada no
  registro arquivado daquela entrega, na mesma largura

#### Scenario: As verificações da página Contato continuam as mesmas

- **WHEN** as verificações de ponta a ponta e de unidade da página Contato rodam depois desta
  entrega
- **THEN** todas passam
- **AND** nenhuma conferência que já existia foi alterada nem removida: só há conferências
  acrescentadas

### Requirement: A inicial não mostra os blocos que a R1 não tem para mostrar

A raiz SHALL omitir os blocos de agenda, de notícias e de conteúdo educativo do protótipo, sem bloco
vazio, sem espaço reservado e sem aviso de que virão, até as releases que os trazem.

#### Scenario: Sem agenda, notícias nem conteúdo educativo

- **WHEN** alguém lê a raiz inteira com o site publicado, em qualquer largura
- **THEN** não aparecem "Próximos eventos", "Ver agenda completa", "O que anda acontecendo", "Todas
  as notícias", "Conteúdo educativo", "Cuidados paliativos, explicados sem rodeio" nem "Ler o
  material"
- **AND** não aparece a mensagem de quando não há evento futuro, nem nenhuma seção sem conteúdo

### Requirement: A inicial segue a ordem do protótipo, com um título principal

A raiz SHALL mostrar os blocos na ordem do protótipo, sem os que ficam fora da R1: o hero, os
números, a faixa do processo seletivo e o contato. A página SHALL ter um único título principal, o
do hero, e nenhum título SHALL pular nível.

#### Scenario: A ordem dos blocos

- **WHEN** a raiz é aberta em qualquer das sete larguras
- **THEN** os blocos vêm nesta ordem: o hero, os números, a faixa do processo seletivo e o contato
- **AND** a ordem de foco por Tab segue a ordem de leitura

#### Scenario: Os títulos

- **WHEN** os títulos da raiz são lidos por leitor de tela
- **THEN** o único título principal é "Cuidar é o ato mais sublime da conexão humana"
- **AND** a faixa e o contato têm cada um um título de seção, um nível abaixo do principal, e os
  números não têm título

### Requirement: O texto da inicial é o do documento de conteúdo, conferido por teste

Os números SHALL ser os da seção 9 do documento de conteúdo, o aviso o da seção 5.1, o @ e o e-mail
os da seção 1, e os rótulos os registrados nas regras de tela do projeto. Um teste SHALL comparar a
raiz publicada com esses documentos, lendo os documentos, e não uma cópia do texto.

#### Scenario: A inicial confere com o documento

- **WHEN** os testes de ponta a ponta rodam com o site publicado
- **THEN** os quatro números são os da seção 9, o aviso é o da seção 5.1, palavra por palavra, e o
  @ e o e-mail são os da seção 1
- **AND** nenhum texto dos blocos novos fica fora do documento e dos rótulos registrados
- **AND** a saída imprime quantos trechos conferiu e quantos números leu do documento, quatro

#### Scenario: Página e documento divergem

- **WHEN** um número, uma palavra do aviso ou uma letra do @ ou do e-mail da inicial difere do
  documento
- **THEN** o teste fica vermelho, nomeando o trecho, o texto esperado e o recebido

#### Scenario: A faixa diverge da página do processo seletivo

- **WHEN** o selo ou o aviso da faixa da inicial difere do da página `/processo-seletivo`
- **THEN** o teste fica vermelho, nomeando as duas páginas e os dois textos

### Requirement: A inicial completa só aparece com o site publicado

Com o site não publicado, a raiz SHALL continuar mostrando a página em construção, sem nenhuma
mudança e sem nenhum dos blocos novos. Com o site publicado, a raiz SHALL responder sem
redirecionamento.

#### Scenario: Site não publicado

- **WHEN** alguém pede a raiz com o site não publicado
- **THEN** vê a página em construção, igual pixel a pixel aos prints arquivados dela, em 390 e
  1280 px
- **AND** nenhum número, faixa ou bloco de contato desta entrega aparece

#### Scenario: Site publicado

- **WHEN** alguém pede a raiz com o site publicado
- **THEN** recebe 200, sem redirecionamento e sem destino de redirecionamento na resposta
