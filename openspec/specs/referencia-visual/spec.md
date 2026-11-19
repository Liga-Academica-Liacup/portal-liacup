# referencia-visual Specification

## Purpose
O gabarito visual do portal: os prints do protótipo aprovado pela liga, contra os quais toda tela
do site é conferida. Existe para que o gabarito saia de um comando que qualquer pessoa repete, e
não da mão de quem tirou o print uma vez.

## Requirements

### Requirement: O gabarito se regera com um comando

O projeto SHALL oferecer um comando único, `npm run prints:prototipo`, que gera todos os prints do
gabarito a partir do arquivo do protótipo guardado no repositório, sem acesso à rede e sem nenhum
passo manual além de rodá-lo.

#### Scenario: Alguém da próxima diretoria precisa refazer o gabarito

- **WHEN** uma pessoa roda `npm run prints:prototipo` numa máquina com o navegador de teste do
  projeto instalado
- **THEN** os prints do gabarito são gerados de novo, no mesmo lugar e com os mesmos nomes
- **AND** nenhum clique, nenhuma rede e nenhum programa além dos que o projeto já usa foram
  necessários

#### Scenario: O navegador de teste não está instalado

- **WHEN** uma pessoa roda o comando numa máquina sem o navegador de teste
- **THEN** o comando para antes de gerar qualquer print, com código diferente de zero
- **AND** diz em português qual comando rodar para instalar o navegador

### Requirement: O gabarito cobre cada página pública nas duas larguras de referência

O gabarito SHALL conter, para cada uma das 11 páginas públicas do protótipo — Início, Sobre,
Equipe, Projetos, Notícias, Eventos, Galeria, Materiais, Conteúdo educativo, Processo seletivo e
Contato —, um print de página inteira em 1280 px e outro em 390 px, e SHALL conter também o menu
lateral aberto em 390 px, num total de 23 arquivos com nome fixo.

#### Scenario: O guardião visual procura o gabarito de uma página

- **WHEN** alguém procura o gabarito de uma página pública
- **THEN** encontra `<pagina>-1280.png` com 1280 px de largura e `<pagina>-390.png` com 390 px de
  largura, cada um com a página inteira, do cabeçalho ao rodapé
- **AND** encontra `menu-aberto-390.png` com o menu lateral aberto sobre a página Contato, na área
  visível de 390 × 844 px

#### Scenario: A página que não está no menu também tem gabarito

- **WHEN** alguém procura o gabarito de Processo seletivo, que se abre pelo botão de destaque do
  cabeçalho e não por um item do menu
- **THEN** encontra `processo-seletivo-1280.png` e `processo-seletivo-390.png`, como as demais

#### Scenario: O protótipo tem telas que não são públicas

- **WHEN** o gabarito é gerado
- **THEN** a tela de entrar e o painel administrativo do protótipo não entram nele

### Requirement: A geração diz quanto gerou e falha quando o gabarito não fecha

Ao terminar, o comando SHALL imprimir quantos prints gerou, quantos esperava e quais imagens da
pasta do gabarito ele não gerou, e SHALL sair com código diferente de zero sempre que gerar menos
que o esperado ou encontrar alguma imagem que não gerou, nomeando cada uma.

#### Scenario: Todas as páginas foram encontradas e a pasta está limpa

- **WHEN** o comando consegue abrir todas as páginas e o menu, e a pasta só tem as imagens que ele
  gera
- **THEN** imprime que gerou 23 de 23 prints e que não há imagem estranha
- **AND** sai com código zero

#### Scenario: Uma página não foi encontrada

- **WHEN** o comando não consegue chegar a uma das páginas esperadas
- **THEN** imprime quantos gerou de 23 e nomeia cada print que faltou
- **AND** sai com código diferente de zero, para que nenhuma verificação trate o resultado como
  verde

#### Scenario: Há na pasta uma imagem que o comando não gerou

- **WHEN** a pasta do gabarito contém uma imagem fora dos 23 nomes, deixada por alguém ou por um
  nome antigo
- **THEN** o comando a lista como estranha, pelo nome
- **AND** sai com código diferente de zero, sem apagá-la

### Requirement: Gerar o gabarito é estável e não toca no protótipo

Duas execuções seguidas do comando SHALL produzir exatamente o mesmo conjunto de nomes de arquivo,
com cada print tirado depois de as fontes carregarem, com as entradas de página concluídas e as
borboletas na pose de repouso do protótipo. O comando SHALL conferir essa pose em cada print e
falhar se alguma borboleta estiver fora dela. O arquivo do protótipo SHALL continuar idêntico.

#### Scenario: O comando roda duas vezes seguidas

- **WHEN** o comando roda duas vezes, uma depois da outra
- **THEN** a lista de nomes de arquivo do gabarito é a mesma nas duas vezes, sem nome a mais nem a
  menos
- **AND** nenhum print mostra texto na fonte de reserva nem página em transição

#### Scenario: As borboletas saem na pose do protótipo

- **WHEN** o comando tira o print de uma página, em qualquer das duas larguras
- **THEN** imprime, para essa página e largura, quantas borboletas animadas encontrou e quantas
  estão na pose de repouso do protótipo
- **AND** uma página sem borboleta animada aparece com zero de zero, e isso não é falha

#### Scenario: Uma borboleta sai fora da pose de repouso

- **WHEN** alguma borboleta, no momento do print, não está na pose de repouso do protótipo
- **THEN** o comando nomeia a página e a largura em que isso aconteceu
- **AND** sai com código diferente de zero

#### Scenario: Alguém confere o que o comando alterou

- **WHEN** o comando termina
- **THEN** as únicas alterações no repositório são nos prints do gabarito
- **AND** o arquivo do protótipo aprovado pela liga está byte a byte igual ao de antes

### Requirement: O gabarito se explica para quem não roda comando

A pasta do protótipo SHALL trazer uma explicação curta que diz o que ela contém, de onde o
protótipo veio, que o design não muda e como regerar os prints, e os prints SHALL poder ser vistos
na página do repositório sem rodar nada.

#### Scenario: Uma pessoa da liga abre a pasta do protótipo no navegador

- **WHEN** alguém abre a pasta do protótipo na página do repositório
- **THEN** lê, em até cinco linhas, o que é, o endereço de origem do protótipo, que o design foi
  aprovado e não muda, e o comando que regera os prints
- **AND** consegue abrir qualquer print do gabarito ali mesmo, sem instalar nem rodar nada
