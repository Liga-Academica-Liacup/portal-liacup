# Spec Delta

## ADDED Requirements

### Requirement: A página Equipe mostra a estrutura da liga, sem nome que o documento não tem

Com o site publicado, `/equipe` SHALL mostrar, na ordem do protótipo aprovado, a faixa do topo, a
diretoria, os fundadores discentes no lugar do bloco de ligantes e os docentes orientadores. A
diretoria SHALL mostrar os seis cargos do documento de conteúdo, sem nome de pessoa, porque o
documento não diz quem ocupa cada cargo.

#### Scenario: A faixa do topo

- **WHEN** alguém abre `/equipe` com o site publicado, em qualquer largura
- **THEN** vê o sobretítulo "Equipe" e o título principal "Quem faz a LIACUP"
- **AND** não aparece "Gestão 2026" nem a frase que cita diretoria, ligantes e professoras

#### Scenario: Os seis cargos da diretoria

- **WHEN** alguém lê o bloco "Diretoria"
- **THEN** vê seis cartões, na ordem da seção 4.3 do documento de conteúdo: "Presidente",
  "Vice-presidente", "Diretor(a) financeiro(a)", "Secretário(a)-Geral", "Diretor(a) de ensino e
  extensão" e "Diretor(a) de pesquisa e mídia"
- **AND** cada cartão mostra o cargo como título de nível 3 e, abaixo, a linha do cargo na coluna
  "Em uma linha" da seção 4.3, palavra por palavra
- **AND** nenhum cartão mostra nome de pessoa, curso nem semestre
- **AND** nenhum cartão tem círculo de foto, borboleta nem imagem no lugar do círculo, porque não
  há pessoa para mostrar

#### Scenario: Os fundadores discentes

- **WHEN** alguém lê o bloco "Fundadores discentes"
- **THEN** vê os cinco nomes da seção 4.2 do documento de conteúdo, na ordem dele, como uma lista
- **AND** nenhum nome tem foto, círculo nem curso

#### Scenario: Os docentes orientadores

- **WHEN** alguém lê o bloco "Docentes orientadores"
- **THEN** vê os mesmos dois cartões da página Sobre, com os mesmos nomes, cargos e formações da
  seção 4.1 do documento de conteúdo

#### Scenario: O que o protótipo tinha e a página não tem

- **WHEN** alguém lê a página inteira
- **THEN** não aparecem o bloco "Ligantes", "Foto do ligante", "(nome pendente)", "Nomes e fotos
  entram pelo painel", nenhum dos oito nomes de exemplo da diretoria do protótipo (como "Mariana
  Castro" e "Rafael Nunes"), nem os cargos de exemplo "Diretoria científica", "Diretoria de
  extensão", "Diretoria de comunicação", "Tesouraria", "Secretaria" e "Diretoria de eventos"

#### Scenario: A ordem dos blocos no celular e no desktop

- **WHEN** a página é aberta em 390 px e em 1280 px
- **THEN** os blocos seguem a ordem da faixa, da diretoria, dos fundadores e dos docentes, e há um
  único título principal, "Quem faz a LIACUP"
- **AND** a diretoria fica em duas colunas no celular e em quatro no desktop, como no protótipo
- **AND** os títulos dos blocos são de nível 2, e nenhum título pula nível

### Requirement: A página Equipe não mostra foto de pessoa nem marcador de conteúdo pendente

Enquanto a liga não manda nomes e fotos, os cartões de cargo SHALL ficar sem círculo de foto, e o
círculo da foto de cada docente SHALL mostrar as iniciais do nome dela, tiradas do nome por uma
regra fixa, como na página Sobre, sem que o leitor de tela as leia, e com contraste medido. A
página SHALL omitir todo marcador de conteúdo pendente e todo texto de demonstração do protótipo.

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
- **AND** o registro nomeia a cor das iniciais, a cor do fundo do círculo e a superfície do cartão,
  que nesta página é outra que a do Sobre

#### Scenario: Nada pendente nem de demonstração

- **WHEN** alguém lê a página inteira
- **THEN** não aparecem "Pendente", "(pendente)" nem "Foto"

### Requirement: O texto da página Equipe é o do documento de conteúdo, conferido por teste

Todo texto institucional da página SHALL ser, palavra por palavra, o do documento de conteúdo, e um
teste SHALL comparar a página publicada com o documento, lendo o documento, e não uma cópia do
texto.

#### Scenario: A página confere com o documento

- **WHEN** os testes de ponta a ponta rodam com o site publicado
- **THEN** os seis cargos com as linhas, os cinco fundadores e os dois docentes são idênticos aos do
  documento de conteúdo
- **AND** a saída imprime quantos trechos conferiu, quantos cargos leu do documento, seis, quantos
  fundadores, cinco, e quantos docentes, dois

#### Scenario: Página e documento divergem

- **WHEN** uma palavra da página difere do documento de conteúdo, ou um cargo some da página
- **THEN** o teste fica vermelho, nomeando o trecho, o texto esperado e o recebido

### Requirement: A página Equipe segue o interruptor

A página SHALL existir só com o site publicado. Com o site não publicado, o endereço dela SHALL
levar à raiz, que mostra a página em construção.

#### Scenario: Site não publicado

- **WHEN** alguém pede `/equipe` com o site não publicado
- **THEN** a primeira resposta é 307, com destino `/`, e o navegador chega à página em construção

#### Scenario: Site publicado

- **WHEN** alguém pede `/equipe` com o site publicado
- **THEN** recebe 200, sem redirecionamento e sem destino de redirecionamento na resposta
