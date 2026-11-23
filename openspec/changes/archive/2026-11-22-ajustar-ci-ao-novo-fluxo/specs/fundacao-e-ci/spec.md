# Spec delta — fundacao-e-ci

## MODIFIED Requirements

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

## ADDED Requirements

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
