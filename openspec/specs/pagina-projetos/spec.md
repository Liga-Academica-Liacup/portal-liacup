# pagina-projetos Specification

## Purpose
A página Projetos: mostra as quatro frentes de trabalho da liga (Ensino, Extensão, Pesquisa e
Secretaria) com o texto do `conteudo-institucional.md` §3, palavra por palavra, sem nota de fonte
nem marca de rascunho, e leva à página em construção quando o site não está publicado. Nasceu na
change `pagina-projetos` (R1); muda numa change própria quando a liga detalhar as frentes.

## Requirements

### Requirement: A página Projetos mostra as quatro frentes de trabalho

Com o site publicado, `/projetos` SHALL mostrar, na composição do protótipo aprovado, a faixa do
topo e as quatro frentes de trabalho da seção 3 do documento de conteúdo, Ensino, Extensão, Pesquisa
e Secretaria, nessa ordem, cada uma num cartão com o nome dela e o texto dela.

#### Scenario: A faixa do topo

- **WHEN** alguém abre `/projetos` com o site publicado, em qualquer largura
- **THEN** vê o sobretítulo "Projetos" e o título principal "Ensino, Extensão, Pesquisa e
  Secretaria"
- **AND** não aparece frase abaixo do título, nem a do protótipo, que fala do detalhamento escrito
  pela diretoria e publicado pelo painel

#### Scenario: Os quatro cartões

- **WHEN** alguém lê a página abaixo da faixa
- **THEN** vê quatro cartões, na ordem "Ensino", "Extensão", "Pesquisa" e "Secretaria", anunciados
  por leitor de tela como uma lista de quatro itens
- **AND** cada cartão tem o nome da frente como título de nível 2 e, abaixo, o texto da frente, sem
  caixa interna, selo nem outro título

#### Scenario: A grade no celular e no desktop

- **WHEN** a página é aberta em 390 px e em 1280 px
- **THEN** os cartões ficam em uma coluna no celular e em duas no desktop, como no protótipo
- **AND** a página tem um único título principal, e nenhum título pula nível

#### Scenario: A palavra certa

- **WHEN** alguém lê a página inteira
- **THEN** as quatro são tratadas como frentes de trabalho, e a palavra "eixo" não aparece

### Requirement: A página Projetos não mostra marcador de rascunho nem texto de demonstração

A página SHALL mostrar o texto da Secretaria como mostra o das outras três frentes, sem nenhuma
marca de que ele é provisório, como a seção 3 do documento de conteúdo decide, e SHALL omitir todo
marcador de conteúdo pendente e todo texto de demonstração do protótipo.

#### Scenario: Nada pendente nem de demonstração

- **WHEN** alguém lê a página inteira
- **THEN** não aparecem "Pendente", "a ser escrita", nem nenhuma das frases "Descrição de … a ser
  escrita pela diretoria." do protótipo

#### Scenario: A Secretaria sem marca de rascunho

- **WHEN** alguém lê o cartão da Secretaria
- **THEN** vê só o texto da frente, com a mesma letra, o mesmo estilo e a mesma cor do texto das
  outras três
- **AND** não aparecem "texto provisório", o símbolo de aviso, "pendente de confirmação", a
  explicação de que o Estatuto não descreve a Secretaria como frente, nem a alternativa de mídia e
  comunicação

#### Scenario: Sem nota de fonte

- **WHEN** alguém lê os nomes e os textos das frentes
- **THEN** não aparece nenhuma nota de fonte entre parênteses, como "(Estatuto, Art. 2º § 1º)"

### Requirement: O texto da página Projetos é o do documento de conteúdo, conferido por teste

Todo texto institucional da página SHALL ser, palavra por palavra, o da seção 3 do documento de
conteúdo, e um teste SHALL comparar a página publicada com o documento, lendo o documento, e não uma
cópia do texto. Os rótulos da faixa SHALL ser os registrados como rótulos de interface nas regras
de tela do projeto.

#### Scenario: A página confere com o documento

- **WHEN** os testes de ponta a ponta rodam com o site publicado
- **THEN** o nome e o texto de cada uma das quatro frentes são idênticos aos da seção 3 do
  documento de conteúdo, sem a nota de fonte, e o texto da Secretaria é o parágrafo citado da
  seção, inteiro
- **AND** nenhum texto da página fica fora do documento e dos rótulos registrados
- **AND** a saída imprime quantos trechos conferiu e quantas frentes leu do documento, quatro

#### Scenario: Página e documento divergem

- **WHEN** uma palavra da página difere do documento de conteúdo, ou uma frente some da página
- **THEN** o teste fica vermelho, nomeando o trecho, o texto esperado e o recebido

### Requirement: A página Projetos segue o interruptor

A página SHALL existir só com o site publicado. Com o site não publicado, o endereço dela SHALL
levar à raiz, que mostra a página em construção, sem nenhuma mudança nela. A verificação SHALL
cobrir os dois modos e imprimir quantos verificou.

#### Scenario: Site não publicado

- **WHEN** alguém pede `/projetos` com o site não publicado
- **THEN** a primeira resposta é 307, com destino `/`, e o navegador chega à página em construção,
  com a logo, a frase "Portal em construção" e os canais de Instagram e e-mail
- **AND** a página em construção é a mesma de antes desta entrega, pixel a pixel, em 390 e 1280 px

#### Scenario: Site publicado

- **WHEN** alguém pede `/projetos` com o site publicado
- **THEN** recebe 200, sem redirecionamento e sem destino de redirecionamento na resposta

#### Scenario: A verificação diz o que verificou

- **WHEN** os testes de ponta a ponta da página rodam
- **THEN** a saída imprime em quantos dos dois modos o endereço foi verificado, dois
- **AND** com a verificação do modo não publicado apontada para o site publicado, ela fica vermelha,
  nomeando o status e o destino recebidos
