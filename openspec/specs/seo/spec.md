# seo Specification

## Purpose
Que quem procura a liga num buscador a encontre: cada página pública declara título e descrição
próprios, com texto da liga, e todos os metadados saem de um lugar só, conferidos a cada alteração.
Nasceu na change `pagina-processo-seletivo` (R1); sitemap, robots, dados estruturados e a medição
num endereço de prévia que a hospedagem marca como não indexável são da `lancamento-r1`.

## Requirements

### Requirement: Toda página pública declara título e descrição próprios

Cada página da lista única de páginas públicas SHALL declarar, na entrada dela, um título no formato
`<Nome da página> · LIACUP` (a Início, com o nome da liga por extenso) e uma descrição de 70 a 160
caracteres, tirada do documento de conteúdo. Nenhum título e nenhuma descrição SHALL se repetir
entre páginas.

#### Scenario: A lista é conferida

- **WHEN** a verificação de unidade da lista roda
- **THEN** confere, em cada entrada, título e descrição não vazios, o formato do título, a
  descrição entre 70 e 160 caracteres e nenhuma repetição entre páginas
- **AND** a saída imprime quantas entradas conferiu

#### Scenario: Os títulos e as descrições desta entrega

- **WHEN** alguém lê os metadados da Início, do Sobre, de Projetos, da Equipe, de Contato e do
  Processo seletivo
- **THEN** o título da Início é "Liga Acadêmica Multiprofissional de Cuidados Paliativos · LIACUP",
  o do Sobre é "Sobre · LIACUP", o de Projetos é "Projetos · LIACUP", o da Equipe é "Equipe ·
  LIACUP", o de Contato é "Contato · LIACUP" e o do Processo seletivo é "Processo seletivo · LIACUP"
- **AND** a descrição da Início e a do Processo seletivo são a primeira frase, inteira e sem
  mudança, da apresentação da página no documento de conteúdo (seções 2.0 e 5.2)
- **AND** a descrição do Sobre é a primeira frase, inteira e sem mudança, da finalidade
  institucional (seção 2.4)
- **AND** a descrição de Projetos é a frase registrada para ela na seção 3 do documento de
  conteúdo, inteira e sem mudança
- **AND** a descrição da Equipe é a frase registrada para ela na seção 4 do documento de conteúdo,
  inteira e sem mudança
- **AND** a descrição de Contato é a frase registrada para ela na seção 1 do documento de conteúdo,
  inteira e sem mudança

#### Scenario: Título repetido

- **WHEN** duas entradas da lista têm o mesmo título
- **THEN** a verificação fica vermelha, nomeando o título e os dois endereços
- **AND** desfeita a repetição, volta ao verde

#### Scenario: Descrição fora do tamanho

- **WHEN** uma descrição tem menos de 70 ou mais de 160 caracteres
- **THEN** a verificação fica vermelha, nomeando o endereço e o número de caracteres

### Requirement: Os metadados de cada página saem da lista, por uma função só

O título, a descrição, o endereço canônico e os dados de compartilhamento (Open Graph) de cada
página da lista SHALL ser montados a partir da entrada dela, por uma função só. Nenhuma página SHALL
declarar esses metadados à mão.

#### Scenario: O que a página entrega ao buscador

- **WHEN** alguém pede uma página da lista com o site publicado
- **THEN** o cabeçalho do documento traz o título e a descrição da entrada dela
- **AND** um endereço canônico absoluto, `https://liacup.com.br` seguido do endereço da página
- **AND** título e descrição de compartilhamento iguais aos da página
- **AND** o documento declara o idioma `pt-BR`

#### Scenario: Página nova na lista

- **WHEN** uma change acrescenta uma página à lista, com título e descrição
- **THEN** a página ganha os metadados sem que ninguém os escreva nela

### Requirement: Uma página, um título principal

Toda página da lista SHALL ter exatamente um título principal, e os títulos SHALL descer de nível
sem pular nenhum.

#### Scenario: Os títulos de cada página

- **WHEN** os testes de ponta a ponta percorrem a lista com o site publicado
- **THEN** cada página tem um título de nível 1, e nenhum título pula nível em relação ao anterior
- **AND** a saída imprime quantas páginas conferiu

#### Scenario: Dois títulos principais

- **WHEN** uma página da lista passa a ter dois títulos de nível 1
- **THEN** o teste fica vermelho, nomeando a página e os dois títulos

### Requirement: A nota de SEO é medida e tem mínimo

A medição de desempenho SHALL medir a categoria SEO de cada página da lista, com o site publicado,
contra a versão compilada, e SHALL reprovar abaixo de 95. Uma página que se declara não indexável
SHALL reprovar.

#### Scenario: As páginas da lista

- **WHEN** a medição de desempenho roda com o site publicado
- **THEN** imprime a nota de SEO de cada página da lista, em cada execução
- **AND** reprova se alguma ficar abaixo de 95

#### Scenario: A raiz com o site não publicado

- **WHEN** a medição de desempenho roda com o site não publicado
- **THEN** imprime a nota de SEO da raiz em cada execução, sem reprovar por ela

#### Scenario: A página se declara não indexável

- **WHEN** uma página da lista passa a dizer ao buscador que não deve ser indexada
- **THEN** a nota de SEO dela cai abaixo de 95 e a medição reprova, nomeando a página

### Requirement: A página provisória não muda nos metadados

Enquanto o site não está publicado, a página em construção SHALL entregar o mesmo título, a mesma
descrição e nenhum endereço canônico, dado de compartilhamento ou ícone a mais do que entregava
antes desta change.

#### Scenario: A raiz não publicada

- **WHEN** alguém pede a raiz com o site não publicado
- **THEN** o título é "Portal LIACUP", a descrição é a de antes, e não há endereço canônico nem
  dado de compartilhamento
- **AND** a tela é a mesma de antes, pixel a pixel, em 390 e 1280 px
