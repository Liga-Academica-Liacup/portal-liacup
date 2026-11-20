# Spec Delta — fundacao-e-ci

## REMOVED Requirements

### Requirement: Página provisória no ar

**Reason**: O requisito manda a raiz mostrar a página provisória também com o site publicado,
"enquanto a página inicial não existe", e o cenário "A raiz com o site publicado, antes da página
inicial" deixa de ser verdade quando a página inicial passa a existir. O cenário "Visitante abre o
endereço do portal" também fica falso, porque não diz o modo. Um bloco modificado não pode largar
cenário, então o requisito sai inteiro e volta com nome novo.

**Migration**: O requisito "Página provisória enquanto o site não está publicado", acrescentado
abaixo, substitui este. Ele mantém os cenários do site não publicado, dá o modo ao cenário da raiz,
e troca o cenário da raiz publicada pelo que mostra a página inicial. Nada muda para quem visita a
produção.

## ADDED Requirements

### Requirement: Página provisória enquanto o site não está publicado

Enquanto o site não está publicado, o portal SHALL mostrar na raiz e no endereço próprio dela uma
página provisória que identifica a liga e oferece os canais que já funcionam, com a mesma aparência
e o mesmo texto de antes do interruptor, sem o cabeçalho e sem o rodapé das páginas públicas. Todo
outro endereço de página SHALL levar à raiz por redirecionamento temporário. Com o site publicado, a
raiz SHALL mostrar a página inicial, e não a página provisória.

#### Scenario: Visitante abre o endereço do portal

- **WHEN** uma pessoa abre a raiz do site com o site não publicado
- **THEN** recebe status 200 e vê a logo da liga, a frase "Portal em construção", o nome da liga e
  os canais de Instagram e e-mail, com `/` na barra do navegador
- **AND** não vê o cabeçalho, o menu nem o rodapé das páginas públicas
- **AND** nenhuma rota promete página que ainda não existe

#### Scenario: Visitante abre outro endereço com o site não publicado

- **WHEN** uma pessoa abre qualquer outro endereço de página com o site não publicado, exista a
  página ou não, como `/sobre`, `/processo-seletivo` ou `/endereco-que-nao-existe`
- **THEN** a primeira resposta é um redirecionamento temporário (307) cujo destino é a raiz
- **AND** o navegador chega à raiz e mostra a página provisória

#### Scenario: A ferramenta interna fica escondida

- **WHEN** uma pessoa abre `/vitrine` com o site não publicado
- **THEN** é redirecionada temporariamente para a raiz e vê a página provisória, sem nenhum
  componente da vitrine

#### Scenario: O endereço próprio da página provisória

- **WHEN** uma pessoa abre `/em-construcao` com o site não publicado
- **THEN** recebe status 200 e vê a página provisória, sem redirecionamento

#### Scenario: A raiz com o site publicado

- **WHEN** uma pessoa abre a raiz com o site publicado
- **THEN** recebe status 200 e vê a página inicial, com o cabeçalho, o hero e o rodapé, com `/` na
  barra do navegador
- **AND** não vê a frase "Portal em construção"
