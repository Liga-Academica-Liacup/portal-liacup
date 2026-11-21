# Spec Delta

## Purpose

A página do processo seletivo, a conversão principal do portal: diz quem pode entrar na liga, como
é a seleção e o que perguntam com frequência, com o texto aprovado pela liga, e avisa quando as
inscrições estão fechadas para ninguém chegar numa página vazia. Nasceu na change
`pagina-processo-seletivo` (R1).

## ADDED Requirements

### Requirement: A página mostra o estado de inscrições fechadas

Com o site publicado, `/processo-seletivo` SHALL mostrar, na ordem do protótipo aprovado, a faixa
do topo, a coluna das etapas, o quadro de quem pode se inscrever e as perguntas frequentes. Fora
de edital, a faixa do topo SHALL anunciar que as inscrições estão fechadas e convidar a acompanhar a
liga no Instagram, sem botão de inscrição nem link de edital.

#### Scenario: A faixa do topo

- **WHEN** alguém abre `/processo-seletivo` com o site publicado, em qualquer largura
- **THEN** vê, nesta ordem, o selo "Inscrições fechadas", o título principal "Processo seletivo",
  sem semestre, a apresentação da liga sobre o processo seletivo e o aviso de inscrições fechadas
- **AND** o aviso é, palavra por palavra, o do documento de conteúdo (seção 5.1): "As inscrições
  estão fechadas. Acompanhe a Liga no Instagram @liacup.unb para saber quando abre o próximo
  processo seletivo."
- **AND** o aviso tem um link para `https://www.instagram.com/liacup.unb/`, que abre em nova aba
  sem dar à página aberta acesso à página de origem nem o endereço de origem, e cujo nome acessível
  diz o destino e contém o texto visível do link
- **AND** não aparecem "Fazer inscrição" nem "Baixar o edital"

#### Scenario: As etapas

- **WHEN** alguém lê a coluna das etapas
- **THEN** vê as duas etapas da seleção, a inscrição por formulário e a entrevista online, cada uma
  com o caráter dela (eliminatória ou classificatória), e nenhuma data

#### Scenario: Quem pode se inscrever

- **WHEN** alguém lê o quadro de quem pode se inscrever
- **THEN** vê o texto de quem pode se inscrever e, depois dele, os três pré-requisitos, em lista

#### Scenario: Títulos e sobretítulos das seções

- **WHEN** alguém lê os títulos das três seções abaixo da faixa
- **THEN** vê "Como funciona", com o sobretítulo "Etapas"; "Quem pode se inscrever", com o
  sobretítulo "Requisitos"; e "Perguntas que sempre chegam", com o sobretítulo "FAQ"
- **AND** não aparece o sobretítulo "Cronograma"

#### Scenario: A ordem dos blocos no celular e no desktop

- **WHEN** a página é aberta em 390 px e em 1280 px
- **THEN** os blocos seguem a ordem do protótipo: a faixa do topo, depois as etapas e o quadro de
  quem pode se inscrever (um abaixo do outro no celular, lado a lado no desktop) e, por último, as
  perguntas frequentes
- **AND** há um único título principal, "Processo seletivo"

### Requirement: O texto da página é o do documento de conteúdo, conferido por teste

Todo texto institucional da página SHALL ser, palavra por palavra, o do documento de conteúdo
aprovado pela liga (aviso, apresentação, quem pode se inscrever, pré-requisitos, etapas e perguntas
frequentes), e um teste SHALL comparar a página publicada com o documento, lendo o documento, e não
uma cópia do texto. As notas de fonte do fim das respostas não vão ao ar.

#### Scenario: A página confere com o documento

- **WHEN** os testes de ponta a ponta rodam com o site publicado
- **THEN** o aviso, a apresentação, o texto de quem pode se inscrever, os três pré-requisitos, as
  duas etapas e as oito perguntas, com as respostas, são idênticos aos do documento de conteúdo
- **AND** a saída imprime quantos trechos conferiu

#### Scenario: As notas de fonte das respostas

- **WHEN** uma resposta do documento termina com uma nota de fonte em itálico entre parênteses, como
  "(Edital, 2.2)" ou "(decisão D6)"
- **THEN** a página mostra a resposta sem a nota, e o teste compara a resposta sem ela
- **AND** nenhuma nota de fonte aparece na página

#### Scenario: Página e documento divergem

- **WHEN** uma palavra da página difere do documento de conteúdo
- **THEN** o teste fica vermelho, nomeando o trecho, o texto esperado e o recebido

### Requirement: A página não traz o que a liga deixou de fora

A página SHALL omitir o critério de desempate, o cargo ou a área em disputa, o cronograma de edital
encerrado e todo texto de exemplo do protótipo.

#### Scenario: Nada do protótipo nem do edital encerrado

- **WHEN** alguém lê a página inteira, com todas as perguntas abertas
- **THEN** não aparecem "desempate", "Prova de conhecimentos", "O que cai na prova", "Aula de
  integração", "2026.2", "Inscrições abertas" nem nenhuma data do cronograma do Edital 02/2026

### Requirement: As perguntas frequentes abrem e fecham por teclado e por toque

As oito perguntas SHALL aparecer na ordem do documento de conteúdo, fechadas quando a página abre.
Cada uma SHALL abrir e fechar a resposta pelo toque, pelo clique, pelo Enter e pelo Espaço, anunciar
ao leitor de tela se está aberta ou fechada, ter alvo de pelo menos 44 × 44 px e foco visível.

#### Scenario: Abrir e fechar pelo teclado

- **WHEN** a pessoa chega a uma pergunta com Tab e aperta Enter
- **THEN** a resposta aparece, e a pergunta é anunciada como expandida
- **AND** apertar Espaço na mesma pergunta fecha a resposta, e ela é anunciada como recolhida, sem a
  página rolar

#### Scenario: Abrir pelo toque

- **WHEN** a pessoa toca uma pergunta no celular
- **THEN** a resposta aparece, e um segundo toque a fecha

#### Scenario: Alvo e foco

- **WHEN** os testes medem as perguntas nas sete larguras
- **THEN** cada pergunta tem pelo menos 44 × 44 px e mostra o foco ao receber Tab
- **AND** a saída imprime quantas perguntas mediu

#### Scenario: Nada escondido de quem não usa mouse

- **WHEN** a pessoa percorre a página só com o teclado
- **THEN** alcança e abre todas as oito perguntas, e lê cada resposta aberta
- **AND** a página não acusa violação de acessibilidade com as perguntas fechadas nem com todas
  abertas

### Requirement: O conteúdo da página muda sem mexer na composição

O texto e os dados da página SHALL ficar num lugar só, separado da composição, para que trocar uma
pergunta, um pré-requisito ou o aviso não exija mudar a composição da página, e para que o painel
da R3 possa assumir esse lugar.

#### Scenario: Trocar uma pergunta

- **WHEN** quem mantém troca o texto de uma pergunta no lugar dos dados
- **THEN** a página mostra o texto novo, e nenhuma linha da composição mudou

#### Scenario: O lugar dos dados é conferido

- **WHEN** o lugar dos dados tem uma pergunta sem resposta, um pré-requisito vazio ou um número de
  etapas diferente de dois
- **THEN** a verificação de unidade fica vermelha, nomeando o item

### Requirement: A página segue o interruptor

A página SHALL existir só com o site publicado. Com o site não publicado, o endereço dela SHALL
levar à raiz, que mostra a página em construção.

#### Scenario: Site não publicado

- **WHEN** alguém pede `/processo-seletivo` com o site não publicado
- **THEN** a primeira resposta é 307, com destino `/`, e o navegador chega à página em construção

#### Scenario: Site publicado

- **WHEN** alguém pede `/processo-seletivo` com o site publicado
- **THEN** recebe 200, sem redirecionamento e sem destino de redirecionamento na resposta
