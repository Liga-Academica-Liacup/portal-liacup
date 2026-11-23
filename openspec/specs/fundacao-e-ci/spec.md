# fundacao-e-ci Specification

## Purpose
O esqueleto do portal e o portão automático que o protege: o projeto Next.js com TypeScript
estrito, as verificações que rodam na máquina de quem escreve e no CI, e a página provisória que
prova que o caminho do código até o ar funciona.

## Requirements

### Requirement: Uma verificação local reúne todas as conferências

O projeto SHALL oferecer um comando único que roda todas as conferências de qualidade e para na
primeira que falhar, para que ninguém precise lembrar a lista nem a ordem.

#### Scenario: Quem escreve roda a verificação antes de propor

- **WHEN** alguém roda `npm run verificar`
- **THEN** as conferências rodam em sequência
- **AND** a primeira que falhar interrompe a execução e diz o que encontrou

### Requirement: O CI é o portão, e não avisa sem barrar

Toda alteração proposta SHALL passar pelo job `Verificacoes`, sem nenhuma etapa que avise e deixe
passar, e a `main` SHALL recusar incorporação com ele vermelho. As conferências que precisam de
segredo SHALL rodar num job à parte, só sobre a versão principal, também sem nenhuma etapa que
avise e deixe passar.

#### Scenario: Alteração proposta com verificação vermelha

- **WHEN** uma alteração proposta quebra qualquer das verificações do job `Verificacoes`
- **THEN** o job `Verificacoes` fica vermelho
- **AND** o botão de incorporar fica bloqueado, sem dispensa para administrador

#### Scenario: As conferências com segredo numa alteração proposta

- **WHEN** o CI roda sobre uma alteração proposta
- **THEN** o job das conferências com segredo aparece como pulado, e não como verde
- **AND** o job `Verificacoes` roda inteiro, sem elas

#### Scenario: Conferência com segredo falha na versão principal

- **WHEN** a versão principal recebe uma incorporação e uma conferência que precisa de segredo
  falha
- **THEN** o job das conferências com segredo fica vermelho na execução da versão principal
- **AND** a falha diz o que encontrou, sem mostrar valor de segredo

#### Scenario: Conferência com segredo sem o segredo

- **WHEN** o job das conferências com segredo roda na versão principal e um segredo de que ele
  precisa não chega
- **THEN** a conferência que usa esse segredo termina como não verificada, e o job fica vermelho
- **AND** o job nunca fica verde sem ter recebido os segredos

### Requirement: Acessibilidade e responsividade medidas, não prometidas

Toda página entregue SHALL ser medida automaticamente quanto a violações de acessibilidade e a
rolagem horizontal, com o resultado expresso em número.

#### Scenario: Teste de ponta a ponta roda sobre as páginas

- **WHEN** o CI roda os testes de ponta a ponta
- **THEN** o axe-core acusa zero violações
- **AND** nenhuma página tem rolagem horizontal em 360, 390, 430, 480, 768, 1024 e 1280 px

### Requirement: Desempenho medido contra a versão compilada

O CI SHALL medir desempenho e acessibilidade por página com o Lighthouse, sempre contra a versão
compilada, e SHALL reprovar quando a nota cair abaixo do limiar.

#### Scenario: Uma imagem pesada entra no projeto

- **WHEN** o Lighthouse roda sobre a versão compilada
- **THEN** reprova se o desempenho ficar abaixo de 90 ou a acessibilidade abaixo de 95
- **AND** o limiar não é baixado para fazer a medição passar

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

### Requirement: O segredo só chega a código já revisado

O CI SHALL entregar segredo só a job que roda sobre a versão principal, depois da incorporação, e
cuja instalação de dependências não executa script de instalação. A plataforma do CI SHALL recusar
o segredo à execução de qualquer outro ramo, mesmo quando a alteração proposta muda o próprio fluxo
do CI.

#### Scenario: Alteração proposta não recebe segredo

- **WHEN** o CI roda sobre uma alteração proposta
- **THEN** nenhum passo recebe segredo
- **AND** a configuração do job que roda nela não cita segredo nenhum

#### Scenario: Um fluxo alterado pede o segredo

- **WHEN** uma alteração proposta muda o fluxo do CI para pedir o segredo num ramo que não é a
  versão principal
- **THEN** a plataforma do CI não entrega o segredo àquela execução

#### Scenario: A instalação do job com segredo

- **WHEN** o job com segredo instala as dependências
- **THEN** nenhum script de instalação de dependência roda
- **AND** as ferramentas que as conferências com segredo usam estão disponíveis, e as conferências
  terminam com o mesmo resultado que teriam com a instalação completa

### Requirement: O CI roda com as permissões mínimas

O fluxo do CI SHALL declarar só a permissão de ler o conteúdo do repositório, e nenhum job SHALL
ampliá-la. A cópia do código feita no CI SHALL não guardar a credencial da execução depois de
baixar o código.

#### Scenario: Um passo tenta escrever no repositório

- **WHEN** um passo do CI tenta escrever no repositório com a credencial da execução
- **THEN** a plataforma recusa, porque a credencial só lê

#### Scenario: Um passo procura a credencial na cópia do código

- **WHEN** um passo posterior ao download lê a configuração do Git da cópia do código
- **THEN** não encontra credencial guardada

### Requirement: Toda ação externa do CI é presa por versão imutável

Toda ação externa usada pelo CI SHALL ser referida pelo identificador completo do commit, com a
versão legível num comentário na mesma linha. Uma verificação, que roda na máquina e no CI, SHALL
acusar com arquivo e linha toda referência por etiqueta, ramo ou sem o comentário, e SHALL dizer
quantas referências conferiu.

#### Scenario: Uma ação presa por etiqueta

- **WHEN** um fluxo do CI refere uma ação externa por etiqueta de versão ou por ramo
- **THEN** a verificação falha e nomeia o arquivo e a linha
- **AND** diz quantas referências conferiu e quantas estão fora da regra

#### Scenario: Uma ação presa sem a versão no comentário

- **WHEN** uma ação externa é referida pelo commit, sem a versão num comentário na mesma linha
- **THEN** a verificação falha e nomeia o arquivo e a linha

#### Scenario: Todas as ações presas

- **WHEN** toda ação externa está presa pelo commit, com a versão no comentário
- **THEN** a verificação passa e diz quantos arquivos de fluxo leu e quantas referências conferiu
- **AND** a ação do próprio repositório, se houver, é aceita e contada à parte

#### Scenario: Nenhum fluxo encontrado

- **WHEN** a verificação não encontra nenhum arquivo de fluxo do CI
- **THEN** ela termina como não verificada, com erro, e não como aprovada

### Requirement: A busca de segredo cobre tudo o que o envio publica

O projeto SHALL oferecer uma busca de segredo que o Gabriel roda antes de enviar ao repositório
remoto, sem o gerenciador de pacotes e com o Git só para leitura. Ela SHALL examinar cada commit
ainda não enviado à versão principal remota e as mudanças da árvore de trabalho que ainda vão
entrar num commit, procurando o formato de uma chave real, e não o prefixo solto. Cada formato
SHALL exigir um comprimento mínimo depois do prefixo, e nunca um comprimento exato.

#### Scenario: Chave num commit intermediário

- **WHEN** um commit ainda não enviado acrescenta uma chave no formato real, e um commit seguinte a
  apaga
- **THEN** a busca falha e nomeia o commit, o arquivo, a linha e o formato

#### Scenario: Chave na árvore de trabalho

- **WHEN** um arquivo rastreado alterado, ou um arquivo não rastreado que não está ignorado, tem uma
  chave no formato real e ainda não entrou em commit
- **THEN** a busca falha e nomeia o arquivo, a linha e o formato

#### Scenario: Chave mais longa que o formato publicado

- **WHEN** um arquivo a enviar tem uma chave com o prefixo de um formato conhecido e mais
  caracteres do que o formato publicado
- **THEN** a busca falha e nomeia o arquivo, a linha e o formato
- **AND** o número de caracteres da saída é o do trecho achado inteiro

#### Scenario: Texto que só cita o formato

- **WHEN** um arquivo cita o prefixo de uma chave, ou a própria expressão do formato, sem o
  comprimento de uma chave real
- **THEN** a busca não acusa esse arquivo

#### Scenario: Chave dentro de arquivo binário

- **WHEN** um arquivo binário a enviar traz, em texto não comprimido, uma chave no formato real
- **THEN** a busca falha e nomeia o arquivo
- **AND** o limite do conteúdo comprimido fica declarado na documentação de segurança

#### Scenario: Sem a referência da versão principal remota

- **WHEN** a máquina não tem a referência local da versão principal remota, ou o Git falha
- **THEN** a busca termina como não verificada, com um código de saída diferente do de achado e do
  de nada achado

### Requirement: A busca de segredo diz o que achou sem mostrar o valor

A busca SHALL dizer quantos commits, arquivos, linhas e formatos examinou, e quantos achados teve.
Cada achado SHALL trazer o commit ou a árvore, o arquivo, a linha e o formato, com o valor trocado
pela marca de mascarado e o número de caracteres. Achado, não verificado e nada achado SHALL ter
códigos de saída diferentes.

#### Scenario: Um achado

- **WHEN** a busca encontra uma chave
- **THEN** a saída traz a marca de mascarado com o número de caracteres, e nenhum trecho do valor
- **AND** termina com o código de achado

#### Scenario: Nada achado

- **WHEN** a busca examina tudo o que vai ser enviado e não encontra chave
- **THEN** termina com código 0 e diz quantos commits, arquivos, linhas e formatos examinou

#### Scenario: Nada a enviar

- **WHEN** não há commit à frente da versão principal remota nem mudança na árvore de trabalho
- **THEN** a saída diz que examinou 0 commits e 0 arquivos, com essas palavras, e termina com
  código 0
