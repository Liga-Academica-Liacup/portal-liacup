# equipe-de-agentes Specification

## Purpose
Quem são os agentes que trabalham neste repositório, o escopo e as ferramentas de cada um, as
regras que todos leem antes de começar e o formato do relatório que devolvem. Existe para que a
regra valha por arquivo versionado, e não por alguém lembrar de colá-la na conversa.

## Requirements

### Requirement: Os agentes são declarados em arquivos versionados

Cada agente do projeto SHALL ter um arquivo próprio no repositório, declarando seu nome, quando
usar, as ferramentas a que tem acesso, o que faz e o que não faz. Agente combinado em conversa e
não escrito em arquivo NÃO SHALL ser considerado parte da equipe.

#### Scenario: Alguém precisa saber qual agente chamar

- **WHEN** uma pessoa ou um agente abre o repositório pela primeira vez
- **THEN** encontra um arquivo por agente, e a descrição de cada um diz em que situação usá-lo
- **AND** nenhum agente da equipe existe apenas na memória de uma conversa

### Requirement: Toda sessão começa pelas regras do projeto

O repositório SHALL carregar, sem ninguém pedir, um arquivo de raiz que apresenta o projeto, aponta
os documentos que governam a decisão e traz as regras de Git e o ciclo de uma change.

#### Scenario: Uma sessão nova começa a trabalhar

- **WHEN** um agente começa a trabalhar no repositório
- **THEN** já conhece a hierarquia de decisão, o gabarito visual e a origem dos textos
- **AND** sabe que nenhuma linha de código entra sem proposta aprovada

### Requirement: Quem revisa não consegue escrever

Os agentes que revisam o trabalho SHALL ter apenas ferramentas de leitura, sem nenhuma ferramenta de
escrita nem de execução de comando, para que a independência da revisão seja trava e não promessa.
São dois: o revisor, que confere o diff contra a proposta e os padrões, e o guardião de segurança,
que o audita contra o checklist de segurança.

#### Scenario: O revisor encontra um defeito

- **WHEN** o revisor encontra algo errado no trabalho entregue
- **THEN** descreve o defeito no relatório
- **AND** não tem caminho técnico para corrigi-lo, nem rodando comando

#### Scenario: Alguém pede ao guardião que crie um arquivo

- **WHEN** o guardião de segurança recebe o pedido de criar ou alterar um arquivo
- **THEN** não consegue, por falta de ferramenta, e diz isso no relatório
- **AND** a lista de arquivos alterados do repositório é a mesma antes e depois do pedido

### Requirement: Quem confere o visual aponta, não corrige

O agente que compara as telas com o gabarito aprovado SHALL listar cada diferença visível, dizendo
onde está e se ela vem de uma adaptação de acessibilidade já aprovada ou se precisa de decisão do
Gabriel. Ele NÃO SHALL alterar o código do produto.

#### Scenario: O site saiu diferente do gabarito

- **WHEN** uma tela entregue não bate com o print de referência
- **THEN** a diferença é listada, com o lugar e o motivo provável
- **AND** o código do produto chega ao fim da conferência inalterado

### Requirement: Relatório de no máximo uma tela, com número

Todo agente SHALL devolver relatório que caiba em uma tela, com número sempre que houver número, e
SHALL declarar como incompleto o que ficou incompleto. A lista de achados de uma auditoria de
segurança fica fora da conta da tela, como a evidência literal numa entrega. O resto do relatório
do guardião cabe em uma tela.

#### Scenario: Um agente termina sua parte

- **WHEN** um agente conclui a tarefa que recebeu
- **THEN** devolve o resultado em no máximo uma tela, dizendo quanto mediu
- **AND** item pulado aparece escrito, nunca silenciado

#### Scenario: A auditoria encontra muitos achados

- **WHEN** o guardião devolve uma auditoria com mais achados do que cabem em uma tela
- **THEN** o veredito, as contagens, os pedidos de comando e o que não foi verificado cabem em uma
  tela
- **AND** a lista de achados vem depois, inteira, sem resumo no lugar dela

### Requirement: O trabalho dos agentes fica registrado no repositório

Cada change SHALL ter um registro versionado onde o trabalho de cada agente é anotado, para que
nenhum achado fique só numa conversa que ninguém mais abre.

#### Scenario: Uma change termina e alguém pergunta o que foi medido

- **WHEN** a change chega ao fim
- **THEN** o registro da change mostra o que cada agente fez, com os números que apurou
- **AND** quem assumir o projeto depois encontra isso lendo o repositório

### Requirement: Nenhum agente escreve no Git

Nenhum agente SHALL executar operação de escrita no Git — commit, push, abertura de alteração
proposta ou incorporação. Os agentes SHALL preparar os arquivos e entregar os comandos prontos
para o Gabriel executar.

#### Scenario: Uma change está pronta para entrar

- **WHEN** o trabalho de uma change termina
- **THEN** a entrega traz os arquivos prontos e os comandos de Git escritos
- **AND** a execução desses comandos é do Gabriel, não do agente

### Requirement: Toda change passa pela auditoria de segurança antes da entrega

Toda change SHALL ser auditada pelo guardião de segurança depois da revisão do diff e antes de ser
arquivada. O veredito do guardião SHALL aparecer na evidência da entrega do Portão 2. Change sem
veredito NÃO SHALL chegar ao Portão 2.

#### Scenario: Uma change termina a revisão do diff

- **WHEN** o revisor termina a revisão de uma change
- **THEN** o guardião audita a change antes de ela ser arquivada
- **AND** a entrega do Portão 2 mostra o veredito do guardião na evidência

#### Scenario: Falta o veredito

- **WHEN** uma change chega ao fim sem veredito do guardião
- **THEN** a entrega não é apresentada como pronta para o Portão 2
- **AND** a falta do veredito aparece declarada como incompleto

### Requirement: Veredito bloqueado impede o Portão 2

Com veredito BLOQUEADO, a change NÃO SHALL ir ao Portão 2. A correção SHALL ser feita por quem
implementa. Toda correção feita depois da revisão do diff SHALL passar de novo pelo revisor e,
depois dele, pelo guardião, cada um numa invocação nova, que recebe o diff corrigido e não recebe o
relatório anterior.

#### Scenario: A auditoria bloqueia

- **WHEN** o guardião devolve BLOQUEADO
- **THEN** a change volta para quem implementa, com os critérios de correção do relatório
- **AND** depois da correção, um revisor novo revisa o diff corrigido
- **AND** depois dele, um guardião novo audita o diff corrigido sem ver o relatório anterior

#### Scenario: A correção não resolve

- **WHEN** a nova auditoria também devolve BLOQUEADO
- **THEN** o ciclo de correção e nova auditoria se repete
- **AND** a change continua fora do Portão 2

### Requirement: O guardião aponta e exige, não corrige

O guardião SHALL descrever cada falha e o critério verificável que a correção precisa cumprir. Ele
NÃO SHALL escrever o código da correção. Também NÃO SHALL sugerir afrouxar regra, limiar ou
verificação para a change passar.

#### Scenario: O guardião encontra uma falha

- **WHEN** o guardião encontra uma falha de segurança
- **THEN** o relatório diz o que a correção precisa cumprir, de forma que se possa conferir depois
- **AND** o relatório não traz o código da correção
- **AND** não propõe retirar item do checklist, baixar limiar nem pular teste

### Requirement: Todo achado traz evidência, confiança e cenário

Todo achado SHALL trazer seis coisas: o código do item do checklist; a severidade (bloqueante,
alta, média, baixa ou informativa); a confiança (confirmado, provável ou hipótese); o lugar, por
arquivo e linha ou por saída de comando; o cenário concreto de ataque ou vazamento; e o critério de
correção. Achado sem cenário concreto SHALL ser informativo.

#### Scenario: Achado sem cenário

- **WHEN** o guardião aponta um problema sem conseguir descrever como ele seria explorado ou como
  vazaria
- **THEN** o achado é informativo e não bloqueia

#### Scenario: Afirmação sem lugar

- **WHEN** uma afirmação do relatório não cita arquivo e linha nem saída de comando
- **THEN** ela não conta como achado confirmado

#### Scenario: O ponto já está tratado

- **WHEN** o guardião suspeita de uma falha que o código ou um teste já trata
- **THEN** ele não a aponta como falha

### Requirement: O veredito segue uma regra fixa

O guardião SHALL emitir um destes três vereditos. BLOQUEADO, quando há achado bloqueante, de
qualquer confiança, ou alto confirmado. APROVADO COM RESSALVAS, quando o achado mais grave é alto
não confirmado, médio ou baixo. APROVADO, quando só há achados informativos ou nenhum.

#### Scenario: Achado alto confirmado

- **WHEN** a auditoria tem um achado de severidade alta com confiança confirmado
- **THEN** o veredito é BLOQUEADO

#### Scenario: Bloqueante ainda em hipótese

- **WHEN** a auditoria tem um achado bloqueante com confiança hipótese
- **THEN** o veredito é BLOQUEADO
- **AND** o relatório traz o pedido de comando que confirmaria ou descartaria a hipótese

#### Scenario: Só achados informativos

- **WHEN** todos os achados da auditoria são informativos
- **THEN** o veredito é APROVADO

### Requirement: O que o guardião não verifica sozinho vira pedido de comando

Quando uma conferência depender de rodar um comando, o guardião SHALL pedir o comando exato e dizer
o que a saída precisa mostrar. O líder técnico SHALL devolver a saída literal e o código de saída,
sem resumo, e o guardião SHALL decidir com base nela. Sem saída, o item SHALL ficar declarado como
não verificado.

#### Scenario: A conferência depende de comando

- **WHEN** o guardião precisa saber se há vulnerabilidade conhecida nas dependências ou se há
  segredo no histórico
- **THEN** o relatório traz o comando exato e o que a saída precisa mostrar para passar
- **AND** o pedido, a saída literal e a decisão ficam no registro da change

#### Scenario: A saída não chega

- **WHEN** um pedido de comando fica sem saída, inclusive o dos cabeçalhos da prévia, que ainda não
  existe quando o guardião audita
- **THEN** o item aparece como não verificado, com essas palavras
- **AND** não aparece como aprovado

### Requirement: Só o Gabriel aceita um risco

Um achado que bloqueia SHALL deixar de bloquear só de duas formas: pela correção, ou pelo aceite do
Gabriel, por escrito. Nenhum agente SHALL aceitar risco. A forma do aceite e a exceção do achado já
explorável em produção estão nos cenários.

#### Scenario: O Gabriel aceita um risco

- **WHEN** o Gabriel aceita, por escrito, um risco apontado pelo guardião
- **THEN** o registro da change traz o aceite literal, com data, o achado, o motivo, o prazo e a
  change que vai resolvê-lo
- **AND** o documento de segurança lista o risco entre os aceitos em aberto
- **AND** uma change seguinte que não toca no ponto não é bloqueada por ele dentro do prazo

#### Scenario: O achado já é explorável em produção

- **WHEN** o achado é bloqueante, confirmado, e já explorável hoje em produção
- **THEN** não pode virar risco aceito
- **AND** vira uma change de correção imediata, que entra antes de qualquer outra

#### Scenario: Um agente tenta aceitar o risco

- **WHEN** um agente considera que um achado bloqueante pode esperar
- **THEN** o achado continua bloqueando até haver correção ou aceite escrito do Gabriel

#### Scenario: O prazo vence

- **WHEN** o prazo de um risco aceito vence sem a correção
- **THEN** o achado volta a bloquear

### Requirement: Change só de documentação tem conferência curta

Uma change cujo diff só toca documentação SHALL ser conferida apenas quanto a segredos e à cadeia
de entrega. O guardião SHALL confirmar pela lista de arquivos do diff que a change é só de
documentação antes de encurtar a conferência. As regras e as definições dos agentes, que mudam o
que eles podem fazer, NÃO SHALL contar como documentação.

#### Scenario: Change só de texto

- **WHEN** o diff de uma change só toca documentação
- **THEN** o guardião confere apenas segredos e a cadeia de entrega
- **AND** o relatório diz que a conferência foi curta, e por quê

#### Scenario: Change que se diz de documentação, mas não é

- **WHEN** o diff toca um arquivo que não é documentação
- **THEN** o guardião aplica o checklist inteiro

#### Scenario: Change que muda as regras dos agentes

- **WHEN** o diff só toca texto, mas muda as regras ou a definição de algum agente
- **THEN** o guardião aplica o checklist inteiro

### Requirement: O checklist de segurança tem códigos fixos

As conferências de segurança SHALL formar um checklist em que cada item tem um código fixo. Todo
relatório do guardião SHALL citar os achados por esse código, e SHALL dizer por que cada item ficou
sem conferência. Um código NÃO SHALL ser renumerado. Item novo recebe código novo.

#### Scenario: O relatório cobre o checklist

- **WHEN** o guardião termina uma auditoria
- **THEN** cada item do checklist aparece como conferido, com o que foi lido, ou como não aplicável
  ou não verificado, com o motivo
- **AND** cada achado cita o código do item

#### Scenario: O checklist ganha um item

- **WHEN** um item novo entra no checklist
- **THEN** recebe o próximo código livre, e nenhum código existente muda de significado

### Requirement: A superfície de ataque de cada release está escrita

O projeto SHALL manter um documento de segurança que diz o que o portal protege, de quem, e a
superfície de ataque de cada release, junto com o checklist. Quem implementa SHALL poder lê-lo
antes de escrever o código. O guardião SHALL lê-lo antes de auditar. A primeira change de cada
release SHALL atualizar a seção dela.

#### Scenario: Alguém vai implementar uma change

- **WHEN** quem implementa começa uma change
- **THEN** encontra no documento de segurança o checklist e a superfície da release em que está

#### Scenario: A primeira change de uma release

- **WHEN** a primeira change de uma release chega à auditoria sem ter atualizado a seção da release
  no documento de segurança
- **THEN** o guardião aponta a falta no relatório

### Requirement: A versão principal inteira é auditada antes de cada release ir ao ar

Além da auditoria de cada change, o guardião de segurança SHALL auditar com o checklist inteiro
todos os arquivos rastreados da versão principal do repositório e, quanto a segredos, também o
histórico. Essa auditoria de base SHALL rodar na última change de cada release, antes de a release
ir ao ar, e SHALL ser feita por partes, juntadas no fim.

#### Scenario: A última change de uma release chega à auditoria

- **WHEN** a última change de uma release é auditada
- **THEN** o guardião audita também todos os arquivos rastreados da versão principal, e não só o
  que a change mudou
- **AND** o número de arquivos conferidos é igual ao número de arquivos rastreados, e os dois
  números aparecem no relatório

#### Scenario: Um segredo saiu do código, mas ficou no histórico

- **WHEN** um segredo foi apagado de um arquivo numa versão antiga e não existe mais na versão
  principal
- **THEN** a auditoria de base o encontra pelo histórico
- **AND** o relatório diz em que versões ele aparece, sem reproduzir o valor

#### Scenario: A auditoria é feita por partes

- **WHEN** a auditoria de base é dividida em partes
- **THEN** cada arquivo rastreado cai em exatamente uma parte
- **AND** a junção mostra, uma vez só, o estado final de cada código do checklist

### Requirement: A auditoria de base termina numa lista de achados com prazo

Cada achado da auditoria de base SHALL entrar numa lista ordenada por severidade. Cada item traz as
seis coisas de todo achado, a release em que deve ser resolvido e a change proposta para
resolvê-lo. Achado bloqueante, confirmado e já explorável hoje em produção NÃO SHALL entrar na
lista.

#### Scenario: A auditoria de base termina

- **WHEN** a junção das partes termina
- **THEN** a lista traz os achados do mais grave ao menos grave
- **AND** nenhum item fica sem release ou sem change proposta, e vários itens podem apontar a
  mesma change

#### Scenario: Aparece um bloqueante já explorável em produção

- **WHEN** uma parte da auditoria encontra um achado bloqueante, confirmado e já explorável hoje em
  produção
- **THEN** a auditoria para, e o achado é levado ao Gabriel antes de qualquer outra parte
- **AND** ele vira uma change de correção imediata e não entra na lista

### Requirement: A configuração dos agentes é item do checklist

O checklist de segurança SHALL ter um item para a configuração dos agentes: as regras que eles
leem, as ferramentas de cada um, os ganchos, as variáveis de ambiente, os servidores de ferramentas
externas e as instruções geradas pela ferramenta de especificação. Uma mudança nessa configuração
SHALL bloquear nos casos descritos nos cenários.

#### Scenario: Um agente ganha terminal sem decisão

- **WHEN** uma mudança dá a um agente ferramenta de escrita ou de execução de comando sem decisão
  registrada
- **THEN** o guardião devolve BLOQUEADO, citando o item de configuração dos agentes
- **AND** depois de desfeita a mudança, uma auditoria nova não traz mais esse achado

#### Scenario: Aparece um gancho, uma variável de ambiente ou um servidor novo

- **WHEN** uma mudança acrescenta gancho, variável de ambiente ou servidor de ferramentas externas
  sem decisão do Gabriel
- **THEN** o guardião devolve BLOQUEADO, citando o item de configuração dos agentes

#### Scenario: Uma instrução afrouxa uma regra

- **WHEN** uma mudança faz a instrução de um agente contradizer ou afrouxar uma regra da
  constitution, dos padrões de código ou do documento de segurança
- **THEN** o guardião devolve BLOQUEADO, citando o item de configuração dos agentes

#### Scenario: Uma instrução gerada é alterada à mão

- **WHEN** uma instrução gerada pela ferramenta de especificação muda sem ter sido regenerada por
  ela
- **THEN** o guardião devolve BLOQUEADO, citando o item de configuração dos agentes

#### Scenario: A mudança foi decidida

- **WHEN** a mudança na configuração está nomeada na proposta que o Gabriel aprovou
- **THEN** o item não bloqueia por causa dela
- **AND** o relatório cita onde a decisão está registrada

### Requirement: Todo arquivo binário tem origem declarada

Todo arquivo binário do que for auditado SHALL ter origem declarada num registro versionado: gerado
por uma rotina versionada no repositório, ou ativo aprovado. Binário sem origem declarada SHALL ser
apontado como achado do item de segredos.

#### Scenario: Uma change acrescenta um binário sem origem

- **WHEN** um arquivo binário aparece no que foi auditado sem origem declarada
- **THEN** o guardião o aponta como achado do item de segredos, citando o arquivo

#### Scenario: O binário tem origem declarada

- **WHEN** um arquivo binário tem origem declarada
- **THEN** o relatório cita a origem ao dar o estado do item de segredos para esse arquivo

### Requirement: A busca de segredo alcança arquivo binário sem mostrar o conteúdo

A busca de segredo SHALL examinar também os arquivos binários, numa versão registrada e na cópia de
trabalho, e SHALL devolver só o nome do arquivo e o número de ocorrências, nunca o conteúdo. O que
uma busca por texto não alcança dentro de um binário SHALL ficar declarado no relatório como
coberto só pela origem declarada.

#### Scenario: Um segredo falso nos metadados de uma imagem

- **WHEN** uma imagem traz, em texto legível nos metadados, um valor com forma de segredo
- **THEN** a busca de segredo acha o arquivo
- **AND** a saída mostra o nome do arquivo e a contagem, sem o valor

#### Scenario: O arquivo é marcado como binário pela configuração do repositório

- **WHEN** a configuração do repositório marca um tipo de arquivo como binário
- **THEN** a busca de segredo examina esse arquivo mesmo assim
- **AND** não conclui "sem achado" por tê-lo pulado

#### Scenario: O texto está comprimido dentro do binário

- **WHEN** um binário guarda texto em forma comprimida, que a busca por texto não lê
- **THEN** o relatório diz que esse arquivo está coberto só pela origem declarada
- **AND** o item de segredos não aparece como conferido por busca nesse arquivo
