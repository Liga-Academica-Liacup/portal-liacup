# Spec Delta

## MODIFIED Requirements

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

- **WHEN** alguém lê os metadados da Início, do Sobre, da Equipe e do Processo seletivo
- **THEN** o título da Início é "Liga Acadêmica Multiprofissional de Cuidados Paliativos · LIACUP",
  o do Sobre é "Sobre · LIACUP", o da Equipe é "Equipe · LIACUP" e o do Processo seletivo é
  "Processo seletivo · LIACUP"
- **AND** a descrição da Início e a do Processo seletivo são a primeira frase, inteira e sem
  mudança, da apresentação da página no documento de conteúdo (seções 2.0 e 5.2)
- **AND** a descrição do Sobre é a primeira frase, inteira e sem mudança, da finalidade
  institucional (seção 2.4)
- **AND** a descrição da Equipe é a frase registrada para ela na seção 4 do documento de conteúdo,
  inteira e sem mudança

#### Scenario: Título repetido

- **WHEN** duas entradas da lista têm o mesmo título
- **THEN** a verificação fica vermelha, nomeando o título e os dois endereços
- **AND** desfeita a repetição, volta ao verde

#### Scenario: Descrição fora do tamanho

- **WHEN** uma descrição tem menos de 70 ou mais de 160 caracteres
- **THEN** a verificação fica vermelha, nomeando o endereço e o número de caracteres
