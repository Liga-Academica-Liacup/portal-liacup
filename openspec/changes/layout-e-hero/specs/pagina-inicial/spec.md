# Spec Delta — pagina-inicial

## ADDED Requirements

### Requirement: A página inicial abre com o hero aprovado pela liga

Com o site publicado, a raiz SHALL mostrar a página inicial, aberta pelo hero do protótipo aprovado:
o sobretítulo, o título e o lema pedidos pela liga e o parágrafo de apresentação decidido no Portão
1, sem nenhum texto inventado. Os botões do hero SHALL aparecer só quando a página a que levam
estiver na lista de páginas públicas. O espaço da foto institucional SHALL seguir a decisão do
Portão 1, e nunca SHALL mostrar imagem inventada nem texto de marcação.

#### Scenario: Título e lema

- **WHEN** alguém abre a raiz com o site publicado
- **THEN** o título principal da página é "Cuidar é o ato mais sublime da conexão humana"
- **AND** logo abaixo está o lema "Curar às vezes, confortar sempre"
- **AND** acima do título está o sobretítulo "Universidade de Brasília"

#### Scenario: O parágrafo de apresentação

- **WHEN** alguém lê o hero
- **THEN** o parágrafo de apresentação é, palavra por palavra, o decidido no Portão 1 e registrado
  no documento de conteúdo institucional, ou não há parágrafo, se essa for a decisão

#### Scenario: Botões só para páginas que existem

- **WHEN** a página de Processo seletivo e a página Sobre não estão na lista de páginas públicas
- **THEN** o hero não mostra "Quero participar" nem "Conheça a Liga"
- **AND** quando uma delas entra na lista, o botão correspondente aparece e leva a ela

#### Scenario: Sem foto, nada de marcação no lugar dela

- **WHEN** alguém abre a raiz com o site publicado, em qualquer largura
- **THEN** não aparece nenhum texto como "Foto institucional da Liga", nenhum ícone de imagem
  ausente e nenhuma imagem que não seja da liga
- **AND** as borboletas do hero são decorativas: não são anunciadas por leitor de tela e não ficam
  por cima de texto

#### Scenario: O lema em lilás continua legível

- **WHEN** o contraste do lema é medido contra o fundo, em 360 e em 1280 px
- **THEN** atinge 4,5:1, ou 3:1 nas larguras em que o lema é texto grande
- **AND** o registro nomeia as duas cores e a superfície medida
