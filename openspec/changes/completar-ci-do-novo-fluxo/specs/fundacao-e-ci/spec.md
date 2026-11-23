# Spec Delta — fundacao-e-ci

## MODIFIED Requirements

### Requirement: O CI é o portão, e não avisa sem barrar

Toda alteração proposta SHALL passar pelo job `Verificacoes`, sem nenhuma etapa que avise e deixe
passar, e a `main` SHALL recusar incorporação com ele vermelho. As conferências que precisam de
segredo SHALL rodar em jobs à parte, só sobre a versão principal, também sem nenhuma etapa que
avise e deixe passar.

#### Scenario: Alteração proposta com verificação vermelha

- **WHEN** uma alteração proposta quebra qualquer das verificações do job `Verificacoes`
- **THEN** o job `Verificacoes` fica vermelho
- **AND** o botão de incorporar fica bloqueado, sem dispensa para administrador

#### Scenario: As conferências com segredo numa alteração proposta

- **WHEN** o CI roda sobre uma alteração proposta
- **THEN** os jobs que recebem segredo, e o job sem segredo que prepara o que eles leem, aparecem
  como pulados, e não como verdes
- **AND** o job `Verificacoes` roda inteiro, sem eles

#### Scenario: Conferência com segredo falha na versão principal

- **WHEN** a versão principal recebe uma incorporação e uma conferência que precisa de segredo
  falha
- **THEN** o job daquela conferência fica vermelho na execução da versão principal
- **AND** a falha diz o que encontrou, sem mostrar valor de segredo

#### Scenario: Conferência com segredo sem o segredo

- **WHEN** um job com segredo roda na versão principal e o segredo de que ele precisa não chega
- **THEN** a conferência que usa esse segredo termina como não verificada, e o job fica vermelho
- **AND** nenhum job com segredo fica verde sem ter recebido o seu segredo

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

#### Scenario: A referência vem na forma compacta

- **WHEN** um fluxo do CI refere uma ação externa por etiqueta dentro de uma lista ou de um mapa
  escritos numa linha só
- **THEN** a verificação falha e nomeia o arquivo e a linha, como na forma de várias linhas

#### Scenario: A ação do próprio repositório fica fora da pasta de sempre

- **WHEN** um fluxo usa uma ação do próprio repositório guardada em qualquer pasta, e essa ação
  refere uma ação externa por etiqueta
- **THEN** a verificação lê a definição dessa ação, falha e nomeia o arquivo e a linha dela

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

#### Scenario: Chave gravada com dois bytes por caractere

- **WHEN** um arquivo a enviar traz uma chave no formato real gravada em UTF-16, de qualquer ordem
  de bytes, com ou sem a marca de ordem no começo
- **THEN** a busca falha e nomeia o arquivo, a linha e o formato

#### Scenario: Chave no nome do arquivo

- **WHEN** o nome ou o caminho de um arquivo a enviar contém uma chave no formato real
- **THEN** a busca falha e diz que o achado está no nome, sem mostrar o valor

### Requirement: A busca de segredo diz o que achou sem mostrar o valor

A busca SHALL dizer quantos commits, arquivos, linhas e formatos examinou, e quantos achados teve.
Cada achado SHALL trazer o commit ou a árvore, o arquivo, a linha e o formato, com o valor trocado
pela marca de mascarado e o número de caracteres. Achado, não verificado e nada achado SHALL ter
códigos de saída diferentes.

#### Scenario: Um achado

- **WHEN** a busca encontra uma chave
- **THEN** a saída traz a marca de mascarado com o número de caracteres, e nenhum trecho do valor
- **AND** termina com o código de achado
- **AND** manda tirar o valor e trocar a chave, mesmo que ela ainda não tenha entrado em commit

#### Scenario: Nada achado

- **WHEN** a busca examina tudo o que vai ser enviado e não encontra chave
- **THEN** termina com código 0 e diz quantos commits, arquivos, linhas e formatos examinou

#### Scenario: Nada a enviar

- **WHEN** não há commit à frente da versão principal remota nem mudança na árvore de trabalho
- **THEN** a saída diz que examinou 0 commits e 0 arquivos, com essas palavras, e termina com
  código 0

## ADDED Requirements

### Requirement: Nenhum código de dependência roda antes do segredo

Em todo job que recebe segredo, os passos anteriores ao primeiro que o recebe SHALL ser só estes:
baixar o código sem guardar a credencial, preparar o ambiente de execução na versão fixada e sem
cache, instalar as dependências sem script de instalação, ou baixar um anexo feito por um job sem
segredo, com ação presa. Nenhum passo anterior SHALL rodar código de dependência nem do build. O
build SHALL ser feito só em job sem segredo.

#### Scenario: O job da chave de serviço, lido na configuração

- **WHEN** alguém lê a configuração do job que recebe a chave de serviço
- **THEN** antes do passo da chave só há baixar o código, preparar o ambiente e baixar o anexo do
  build
- **AND** o job não instala dependência nem compila, e o passo da chave só lê os arquivos do build,
  sem executá-los

#### Scenario: O job dos tipos do banco, lido na configuração

- **WHEN** alguém lê a configuração do job que recebe o token do banco
- **THEN** antes do passo do token só há baixar o código, preparar o ambiente e instalar as
  dependências sem script de instalação

#### Scenario: O build que o job da chave lê

- **WHEN** a versão principal recebe uma incorporação
- **THEN** o build que a barreira da chave varre é feito num job sem nenhum segredo e chega ao job
  da chave como anexo da mesma execução

#### Scenario: O anexo do build não chega

- **WHEN** o job da chave roda e o anexo do build falta ou vem vazio
- **THEN** o job fica vermelho, com a conferência como não verificada, e não verde

### Requirement: Cada segredo fica sozinho no seu job e no seu ambiente

Cada segredo do CI SHALL ficar num ambiente próprio, que a plataforma do CI só entrega à versão
principal, e SHALL ser citado por um job só. Nenhum job SHALL ter acesso a mais de um segredo.

#### Scenario: A configuração dos jobs com segredo

- **WHEN** alguém lê a configuração do CI
- **THEN** cada job que cita segredo cita um só, e usa um ambiente que não guarda nenhum outro
- **AND** o job que roda código de dependência com o token do banco não tem acesso à chave de
  serviço

#### Scenario: A configuração da plataforma

- **WHEN** o Gabriel confere a configuração do repositório depois do primeiro push verde
- **THEN** cada ambiente tem um segredo só e a regra só da versão principal
- **AND** o nível do repositório e o da organização não têm nenhum segredo

### Requirement: As specs da ferramenta de especificação são validadas no portão

O job `Verificacoes` e a verificação local SHALL validar, em modo estrito, todas as specs e todas
as changes em andamento, com a versão da ferramenta de especificação presa no projeto. A validação
SHALL falhar também por aviso, e SHALL dizer quantos itens validou.

#### Scenario: Uma spec inválida numa alteração proposta

- **WHEN** uma alteração proposta traz uma spec ou uma change inválida, como um requisito sem
  cenário
- **THEN** o job `Verificacoes` fica vermelho, nomeando o item
- **AND** o botão de incorporar fica bloqueado

#### Scenario: Um aviso em modo estrito

- **WHEN** um cenário não tem o gatilho ou o resultado, o que a ferramenta trata como aviso
- **THEN** a validação falha do mesmo jeito

#### Scenario: Tudo válido

- **WHEN** todas as specs e changes são válidas
- **THEN** a validação passa e diz quantos itens validou e quantos falharam

#### Scenario: A versão da ferramenta

- **WHEN** a validação roda no CI ou na máquina
- **THEN** ela usa a versão presa no projeto, igual à versão documentada para quem mantém

### Requirement: Os prints das páginas públicas acompanham cada execução

O job `Verificacoes` SHALL guardar, como anexo baixável de cada execução em que os passos
anteriores passam, um print de página inteira de cada página da lista única de páginas públicas,
com o site publicado, em 390 e 1280 px.
A saída SHALL dizer quantas páginas, larguras e prints fez. Página que não responde SHALL deixar o
job vermelho.

#### Scenario: Uma execução sobre uma alteração proposta

- **WHEN** o CI roda sobre uma alteração proposta e as verificações anteriores passam
- **THEN** a execução traz o anexo dos prints, com o número de páginas da lista vezes 2 arquivos
- **AND** a saída diz o número de páginas, de larguras e de prints

#### Scenario: Uma página da lista não responde

- **WHEN** uma página da lista única não responde com sucesso
- **THEN** o passo fica vermelho e nomeia a página
- **AND** o job `Verificacoes` fica vermelho

#### Scenario: A lista não chega

- **WHEN** a rotina dos prints encontra a lista única vazia, ou termina com menos prints do que
  páginas vezes larguras
- **THEN** ela termina como não verificada, com erro, e não como aprovada

#### Scenario: Uma página nova entra na lista

- **WHEN** uma página é acrescentada à lista única
- **THEN** a execução seguinte traz os prints dela, sem ninguém editar a rotina dos prints
