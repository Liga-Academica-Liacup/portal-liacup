# navegacao-publica Specification

## Purpose
A moldura de toda página pública: cabeçalho, menu lateral no celular e rodapé, e a lista única que
diz quais páginas existem. Existe para que uma página nova apareça no menu, no rodapé, nos botões e
nas verificações entrando num lugar só, e para que nenhum link leve a página que ainda não existe.
Nasceu na change `layout-e-hero` (R1).

## Requirements

### Requirement: Toda página pública tem o cabeçalho do protótipo

Toda página da lista SHALL ter o cabeçalho do protótipo aprovado, sem acesso ao painel, com a
página atual marcada também por um traço sob o rótulo, e não só pela cor, com todo controle
mostrando os estados interativos que se aplicam a ele, e com o nome acessível de cada link contendo
o texto que ele mostra.

#### Scenario: Cabeçalho no celular

- **WHEN** alguém abre uma página da lista em 360 ou 390 px
- **THEN** o cabeçalho tem no máximo 64 px de altura, com a logo, o nome "LIACUP" e o botão que abre
  o menu
- **AND** não há botão "Painel"

#### Scenario: Cabeçalho no desktop

- **WHEN** alguém abre uma página da lista em 1280 px
- **THEN** o cabeçalho mostra a logo, o nome "LIACUP", o nome da liga e os destinos da lista em
  linha
- **AND** o destino da página atual é anunciado como página atual e tem uma barra sob o rótulo
- **AND** não há botão "Painel"

#### Scenario: A barra da página atual nos destinos em linha

- **WHEN** alguém abre uma página da lista em 1280 px e olha o destino da página atual
- **THEN** a barra sob o rótulo tem a ponta redonda, como no protótipo
- **AND** o topo da barra fica a 10 px do pé das letras, como no protótipo
- **AND** a barra contrasta pelo menos 3:1 com o fundo do cabeçalho

#### Scenario: O nome acessível da marca contém o que ela mostra

- **WHEN** o link da marca é lido por leitor de tela ou chamado por controle de voz, em qualquer
  largura
- **THEN** o nome acessível começa pelo texto visível nessa largura, "LIACUP" e, acima de 1024 px,
  também o nome da liga, e diz que leva à página inicial

#### Scenario: O botão de destaque na própria página

- **WHEN** alguém abre `/processo-seletivo` com o site publicado
- **THEN** o botão "Processo seletivo" do cabeçalho é anunciado como página atual e marcado também
  por um traço, e não só pela cor
- **AND** ele tem, nas outras páginas, os mesmos estados de repouso, hover, pressionado e foco do
  botão da camada base

### Requirement: As páginas públicas mostram a logo da liga como ícone da aba

Toda página da lista SHALL indicar ao navegador a logo da liga como ícone da aba e como ícone da
tela de início do celular, a partir das variantes da logo que a liga já tem. A página provisória,
que é o que a produção mostra enquanto o site não está publicado, SHALL continuar sem ícone
indicado.

#### Scenario: Ícone da aba numa página pública

- **WHEN** alguém abre uma página da lista com o site publicado
- **THEN** a aba do navegador mostra a logo da liga
- **AND** a página indica a logo em 32, 48 e 96 px para a aba e em 180 px para a tela de início do
  celular, e cada uma responde 200 como imagem

#### Scenario: A página provisória não ganha ícone

- **WHEN** alguém abre a raiz com o site não publicado
- **THEN** a página não indica nenhum ícone da aba, como antes desta entrega

### Requirement: O menu lateral do celular se opera por toque e por teclado

Nas larguras em que o cabeçalho mostra o botão de menu, os destinos SHALL ficar num menu lateral que
abre e fecha pelo botão, fecha no Esc, no toque fora e ao escolher um destino, prende o foco
enquanto aberto e devolve o foco ao botão que o abriu.

#### Scenario: Abrir e fechar pelo botão

- **WHEN** alguém ativa o botão de menu
- **THEN** o menu lateral aparece com o título "Navegação" e os destinos da lista, e o botão anuncia
  que o menu está aberto
- **AND** ativar o botão de fechar fecha o menu, e o botão de menu anuncia que está fechado

#### Scenario: Fechar no Esc, com o foco de volta

- **WHEN** o menu está aberto e a pessoa aperta Esc
- **THEN** o menu fecha e o foco volta ao botão de menu

#### Scenario: Fechar pelo toque fora

- **WHEN** o menu está aberto e a pessoa toca na área escurecida fora dele
- **THEN** o menu fecha e o foco volta ao botão de menu

#### Scenario: Fechar ao escolher um destino

- **WHEN** o menu está aberto e a pessoa escolhe um destino
- **THEN** o menu fecha e a página do destino é mostrada
- **AND** escolhido o botão "Processo seletivo" do fim do menu, o endereço passa a
  `/processo-seletivo` e o título principal passa a "Processo seletivo"

#### Scenario: O foco fica preso no menu aberto

- **WHEN** o menu está aberto e a pessoa avança com Tab além do último controle dele, ou volta com
  Shift+Tab antes do primeiro
- **THEN** o foco continua dentro do menu, e nenhum elemento da página por trás o recebe

#### Scenario: O teste do menu diz onde testou

- **WHEN** os testes de teclado do menu rodam nas sete larguras
- **THEN** a saída imprime em quantas larguras o menu lateral foi testado, e de quantas larguras no
  total
- **AND** nas larguras sem botão de menu, os destinos em linha estão visíveis

### Requirement: Toda página pública tem o rodapé do protótipo, com os dados certos

Toda página da lista SHALL ter o rodapé do protótipo aprovado, com os dados de contato confirmados
da liga, cada um com um ícone ao lado, as colunas de destinos lidas da lista, sem coluna vazia, com a
página atual marcada nas colunas, sem acesso ao painel, sem a linha de demonstração do protótipo e
com a última linha centralizada.

#### Scenario: Os dados de contato certos

- **WHEN** alguém lê o rodapé de uma página da lista
- **THEN** vê `liacup.unb`, sem o @, ao lado do ícone do Instagram, com link para
  `https://www.instagram.com/liacup.unb/`, e `liacup.unb@gmail.com`, com link de e-mail para esse
  endereço
- **AND** vê a linha de endereço "FCTS · Campus UnB Ceilândia · Brasília/DF"
- **AND** não aparecem `liacup@unb.br` nem "Darcy Ribeiro"

#### Scenario: A coluna de contato

- **WHEN** alguém lê a coluna de contato do rodapé, em qualquer largura
- **THEN** o Instagram, o e-mail e o endereço têm cada um um ícone ao lado: o do Instagram, um
  envelope e um marcador de localização
- **AND** os ícones são decorativos e não são anunciados por leitor de tela
- **AND** os três itens começam a 44 px um do outro, medido do topo do texto de um ao topo da
  primeira linha do seguinte, e os alvos de toque dos dois links não se sobrepõem
- **AND** o endereço é texto, e não link

#### Scenario: A última linha do rodapé

- **WHEN** alguém lê a última linha do rodapé, em qualquer largura
- **THEN** "© <ano> LIACUP · Universidade de Brasília" aparece centralizada, com a mesma sobra de
  cada lado

#### Scenario: Os links do Instagram e do e-mail no rodapé

- **WHEN** alguém toca ou clica em qualquer ponto do elemento do link do Instagram ou do link do
  e-mail no rodapé, e não só no texto
- **THEN** o do Instagram abre `https://www.instagram.com/liacup.unb/` em nova aba, sem dar à página
  aberta acesso à página de origem nem o endereço de origem
- **AND** o do e-mail abre um e-mail novo para `liacup.unb@gmail.com` no aplicativo de e-mail da
  pessoa
- **AND** `liacup.unb` e `liacup.unb@gmail.com` continuam escritos na tela
- **AND** o nome acessível de cada link diz o destino em frase corrida e contém o texto escrito na
  tela; no do Instagram, que é frase corrida, o @ continua

#### Scenario: O que o rodapé do protótipo tinha e o site não tem

- **WHEN** alguém lê o rodapé de uma página da lista
- **THEN** não aparecem "Painel da diretoria" nem "Protótipo do Portal LIACUP · conteúdo de
  demonstração"

#### Scenario: Coluna sem página não aparece

- **WHEN** nenhuma página da lista pertence a uma coluna de destinos do rodapé
- **THEN** essa coluna não aparece, nem o título dela
- **AND** nesta entrega as duas colunas aparecem: "Portal", com "Início" e "Sobre", e "Conteúdo",
  com "Projetos", "Equipe" e "Contato", nessa ordem

#### Scenario: A página atual nas colunas do rodapé

- **WHEN** alguém abre uma página que está numa coluna do rodapé
- **THEN** o link dela na coluna é anunciado como página atual e marcado também por um traço, e não
  só pela cor
- **AND** nenhum outro link das colunas é anunciado como página atual

### Requirement: Toda página da lista é medida, e a medição diz quanto mediu

Os testes de ponta a ponta SHALL medir cada página da lista com o site publicado, nas larguras de
360, 390, 430, 480, 768, 1024 e 1280 px, quanto a violações de acessibilidade, rolagem horizontal,
alvos de toque e pedidos a domínio externo, e a medição de desempenho SHALL medir cada página da
lista com o site publicado e a raiz com o site não publicado. Cada medição SHALL imprimir quantas
páginas e quantos elementos mediu, e cada medição nova SHALL ter sido vista falhando e
voltando ao verde.

#### Scenario: As páginas da lista nas sete larguras

- **WHEN** os testes de ponta a ponta rodam com o site publicado
- **THEN** cada página da lista tem zero violações de acessibilidade, nenhuma rolagem horizontal e
  nenhum pedido a domínio externo, e todo link e botão do cabeçalho, do menu e do rodapé mede pelo
  menos 44 × 44 px
- **AND** a saída de cada largura imprime `páginas verificadas: <n> de <n>`, com `<n>` igual ao
  número de páginas da lista (6 nesta entrega), e quantos alvos mediu

#### Scenario: A página de produção não perde cobertura

- **WHEN** os testes de ponta a ponta rodam com o site não publicado
- **THEN** a raiz não faz nenhum pedido a domínio externo, além de continuar sem violação de
  acessibilidade e sem rolagem horizontal

#### Scenario: Uma página entra na lista e passa a ser medida

- **WHEN** uma entrada nova é acrescentada à lista, e nenhum teste é alterado
- **THEN** os testes de ponta a ponta e a medição de desempenho passam a medi-la
- **AND** os contadores da saída sobem em um

#### Scenario: Uma entrada da lista aponta para endereço sem página

- **WHEN** a lista tem uma entrada cujo endereço responde 404
- **THEN** os testes de ponta a ponta ficam vermelhos, nomeando o endereço e o status recebido

#### Scenario: Desempenho nos dois modos

- **WHEN** a medição de desempenho roda contra a versão compilada
- **THEN** mede cada página da lista com o site publicado e a raiz com o site não publicado, cada
  modo com o servidor iniciado no modo explícito, sem depender da configuração da máquina
- **AND** reprova se alguma ficar abaixo de 90 em desempenho ou de 95 em acessibilidade
- **AND** a saída diz quantas páginas mediu em cada modo, contadas no resultado da medição, e não
  na lista de endereços pedidos

### Requirement: Lista sem marcador visível continua anunciada como lista

Em toda página da lista, cada lista mostrada sem marcador visível (sem bolinha nem número
desenhados pelo navegador), na moldura ou no conteúdo, SHALL continuar exposta ao leitor de tela
como lista, com o número de itens, inclusive no navegador do iPhone, que deixa de anunciar essas
listas quando nada o diz.

#### Scenario: As listas da moldura e das páginas

- **WHEN** os testes de ponta a ponta percorrem as páginas da lista com o site publicado
- **THEN** toda lista sem marcador visível declara explicitamente o papel de lista
- **AND** a saída imprime quantas listas conferiu em cada página

#### Scenario: Uma lista perde o papel

- **WHEN** uma lista sem marcador visível deixa de declarar o papel de lista
- **THEN** o teste fica vermelho, nomeando a página e a lista

### Requirement: A lista única decide as páginas públicas, a ordem delas e o lugar de cada uma

O portal SHALL manter uma lista única das páginas públicas, com o endereço e o rótulo de cada uma e
o lugar onde ela aparece. O menu, o rodapé, o botão de destaque do cabeçalho e os botões que levam a
outras páginas SHALL mostrar só páginas que estão nessa lista, na ordem do menu do protótipo
aprovado, e nenhum desses lugares SHALL precisar de alteração para uma página nova aparecer.

#### Scenario: O que a lista mostra nesta entrega

- **WHEN** alguém abre uma página da lista com o site publicado
- **THEN** a lista tem a Início, o Sobre, Projetos, a Equipe, Contato e o Processo seletivo
- **AND** o menu mostra "Início", "Sobre", "Projetos", "Equipe" e "Contato", nessa ordem, e nenhum
  outro destino
- **AND** a coluna "Portal" do rodapé mostra "Início" e "Sobre", e a coluna "Conteúdo" mostra
  "Projetos", "Equipe" e "Contato", nessa ordem
- **AND** o cabeçalho e o fim do menu lateral mostram o botão "Processo seletivo", que leva a
  `/processo-seletivo`
- **AND** o hero da inicial mostra "Quero participar", que leva a `/processo-seletivo`, e "Conheça
  a Liga", que leva a `/sobre`

#### Scenario: Uma página nova entra na lista

- **WHEN** uma change cria a página de Processo seletivo e a acrescenta à lista, marcada como
  destaque
- **THEN** o botão "Processo seletivo" aparece no cabeçalho e no fim do menu lateral, e o "Quero
  participar" aparece no hero
- **AND** nenhuma linha do cabeçalho, do menu, do rodapé ou do hero foi alterada para isso

#### Scenario: Nenhum link da moldura leva a página que não existe

- **WHEN** os testes seguem cada link interno do cabeçalho, do menu e do rodapé, com o site
  publicado
- **THEN** cada um leva a um endereço da lista, que responde 200
- **AND** a saída imprime quantos links conferiu
