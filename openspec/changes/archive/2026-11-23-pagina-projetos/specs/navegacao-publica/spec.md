# Spec Delta

## REMOVED Requirements

### Requirement: A lista única decide as páginas públicas, onde aparecem e em que ordem

**Reason**: o cenário "Nesta entrega, a lista tem a Início, o Sobre, a Equipe e o Processo seletivo"
fica falso quando Projetos entra na lista, e o validador não deixa um bloco modificado largar
cenário. O requisito volta, com o mesmo conteúdo, como "A lista única decide as páginas públicas, a
ordem delas e o lugar de cada uma", e o cenário da entrega ganha um nome que não muda de uma página
para outra, "O que a lista mostra nesta entrega".
**Migration**: nenhuma para quem visita. Os cenários "Uma página nova entra na lista" e "Nenhum link
da moldura leva a página que não existe" voltam iguais no requisito novo.

## ADDED Requirements

### Requirement: A lista única decide as páginas públicas, a ordem delas e o lugar de cada uma

O portal SHALL manter uma lista única das páginas públicas, com o endereço e o rótulo de cada uma e
o lugar onde ela aparece. O menu, o rodapé, o botão de destaque do cabeçalho e os botões que levam a
outras páginas SHALL mostrar só páginas que estão nessa lista, na ordem do menu do protótipo
aprovado, e nenhum desses lugares SHALL precisar de alteração para uma página nova aparecer.

#### Scenario: O que a lista mostra nesta entrega

- **WHEN** alguém abre uma página da lista com o site publicado
- **THEN** a lista tem a Início, o Sobre, Projetos, a Equipe e o Processo seletivo
- **AND** o menu mostra "Início", "Sobre", "Projetos" e "Equipe", nessa ordem, e nenhum outro
  destino
- **AND** a coluna "Portal" do rodapé mostra "Início" e "Sobre", e a coluna "Conteúdo" mostra
  "Projetos" e "Equipe", nessa ordem
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

## MODIFIED Requirements

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
  com "Projetos" e "Equipe", nessa ordem

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
  número de páginas da lista (5 nesta entrega), e quantos alvos mediu

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
