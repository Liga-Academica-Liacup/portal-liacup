# Spec Delta

## ADDED Requirements

### Requirement: A página Sobre mostra os blocos do protótipo, com o texto da liga

Com o site publicado, `/sobre` SHALL mostrar, na ordem do protótipo aprovado, a faixa do topo, a
história da liga ao lado do quadro da foto, o que a liga se propõe a fazer e os docentes
orientadores, com todo texto institucional vindo do documento de conteúdo e nenhum texto de exemplo
do protótipo.

#### Scenario: A faixa do topo

- **WHEN** alguém abre `/sobre` com o site publicado, em qualquer largura
- **THEN** vê o título principal "Sobre a LIACUP" e, abaixo dele, a apresentação da seção 2.1 do
  documento de conteúdo, palavra por palavra
- **AND** não aparecem "A borboleta não é enfeite" nem a frase sobre a metamorfose das borboletas

#### Scenario: A história e o quadro da foto

- **WHEN** alguém lê o bloco "Como a Liga começou", com o sobretítulo "Nossa história"
- **THEN** vê a história da seção 2.2 do documento de conteúdo, palavra por palavra
- **AND** ao lado dela, no desktop, e abaixo dela, no celular, está o quadro do protótipo com uma
  borboleta da liga grande, em opacidade baixa, sem texto
- **AND** o quadro e a borboleta são decorativos: não são anunciados por leitor de tela e não ficam
  por cima de texto

#### Scenario: O que a Liga se propõe a fazer

- **WHEN** alguém lê o bloco "O que a Liga se propõe a fazer", com o sobretítulo "Objetivos"
- **THEN** vê quatro itens numerados de 01 a 04, nesta ordem: "Objetivo geral", com os dois
  parágrafos da seção 2.3; "Finalidade institucional", com a seção 2.4; "Impacto social", com a
  seção 2.5; e "Protagonismo estudantil", com a seção 2.6
- **AND** cada texto aparece inteiro, sem corte, palavra por palavra
- **AND** o nome de cada item é título de nível 3, abaixo do título do bloco
- **AND** não aparece nenhum dos cinco objetivos do protótipo

#### Scenario: Os docentes orientadores

- **WHEN** alguém lê o bloco "Professores orientadores", com o sobretítulo "Orientação"
- **THEN** vê dois cartões, na ordem da seção 4.1 do documento de conteúdo
- **AND** o primeiro tem o nome "Profa. Dra. Mariana Sodário Cruz", o cargo "Orientadora Geral" e a
  formação da seção 4.1, palavra por palavra
- **AND** o segundo tem o nome "Profa. Dra. Kerolyn Ramos Garcia", o cargo "Orientadora" e a
  formação da seção 4.1, palavra por palavra
- **AND** o nome da segunda docente aparece sempre completo, e nunca como "Kerolyn Ramos" sozinho

#### Scenario: A ordem dos blocos no celular e no desktop

- **WHEN** a página é aberta em 390 px e em 1280 px
- **THEN** os blocos seguem a ordem do protótipo, e há um único título principal, "Sobre a LIACUP"
- **AND** os títulos dos blocos são de nível 2, e nenhum título pula nível

### Requirement: A página Sobre não mostra foto de pessoa nem marcador de conteúdo pendente

Enquanto a liga não manda fotos, o círculo da foto de cada docente SHALL mostrar as iniciais do
nome dela, tiradas do nome por uma regra fixa, como na página Equipe, sem que o leitor de tela as
leia, e com contraste medido. A página SHALL omitir todo marcador de conteúdo pendente e todo
texto de demonstração do protótipo.

#### Scenario: As iniciais no círculo

- **WHEN** alguém olha o cartão de um docente, em qualquer largura
- **THEN** o círculo da foto mostra as iniciais do nome da seção 4.1 do documento de conteúdo: a
  primeira letra da primeira palavra e a da última palavra do nome, sem os tratamentos "Profa." e
  "Dra.", em maiúsculas, "MC" para Mariana Sodário Cruz e "KG" para Kerolyn Ramos Garcia
- **AND** o círculo e as iniciais não são anunciados por leitor de tela, porque o nome completo
  está escrito ao lado
- **AND** nenhuma imagem de pessoa aparece

#### Scenario: O contraste das iniciais

- **WHEN** o contraste das iniciais é medido contra o fundo do círculo, no cartão da página
- **THEN** atinge pelo menos 4,5:1, ou 3:1 se as iniciais forem texto grande (pelo menos 24 px, ou
  18,66 px em negrito), com o tamanho registrado
- **AND** o registro nomeia a cor das iniciais, a cor do fundo do círculo e a superfície do cartão

#### Scenario: Nada pendente nem de demonstração

- **WHEN** alguém lê a página inteira
- **THEN** não aparecem "Pendente", "(pendente)", "Foto", "Foto de uma atividade da Liga", "Texto da
  história da Liga a ser escrito pela diretoria" nem "painel administrativo"

### Requirement: O texto da página Sobre é o do documento de conteúdo, conferido por teste

Todo texto institucional da página SHALL ser, palavra por palavra, o do documento de conteúdo, e um
teste SHALL comparar a página publicada com o documento, lendo o documento, e não uma cópia do
texto. A nota de fonte em itálico entre parênteses do fim de uma seção, como "(Estatuto, Art. 2º)",
SHALL ficar fora da página e fora da comparação.

#### Scenario: A página confere com o documento

- **WHEN** os testes de ponta a ponta rodam com o site publicado
- **THEN** a apresentação, a história, os quatro itens do que a liga se propõe a fazer e os dois
  docentes são idênticos aos do documento de conteúdo
- **AND** a saída imprime quantos trechos conferiu e quantos parágrafos leu de cada seção

#### Scenario: A nota de fonte

- **WHEN** a seção 2.4 do documento termina com "(Estatuto, Art. 2º)"
- **THEN** a página mostra a seção sem a nota, e o teste compara sem ela
- **AND** nenhuma nota de fonte aparece na página

#### Scenario: Página e documento divergem

- **WHEN** uma palavra da página difere do documento de conteúdo
- **THEN** o teste fica vermelho, nomeando o trecho, o texto esperado e o recebido

### Requirement: A página Sobre segue o interruptor

A página SHALL existir só com o site publicado. Com o site não publicado, o endereço dela SHALL
levar à raiz, que mostra a página em construção.

#### Scenario: Site não publicado

- **WHEN** alguém pede `/sobre` com o site não publicado
- **THEN** a primeira resposta é 307, com destino `/`, e o navegador chega à página em construção

#### Scenario: Site publicado

- **WHEN** alguém pede `/sobre` com o site publicado
- **THEN** recebe 200, sem redirecionamento e sem destino de redirecionamento na resposta
