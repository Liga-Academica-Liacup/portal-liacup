# Spec Delta — pagina-inicial

## ADDED Requirements

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
