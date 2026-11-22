# Spec Delta — equipe-de-agentes

## MODIFIED Requirements

### Requirement: Nenhum agente escreve no Git

Nenhum agente, inclusive o líder técnico, SHALL executar operação de escrita no Git: nada que mude
o índice, a árvore de trabalho por meio do Git, as referências, a configuração ou o remoto, nem
operação na hospedagem do repositório, como abrir alteração proposta ou incorporar. Os agentes
SHALL preparar os arquivos e entregar os comandos prontos para o Gabriel executar.

#### Scenario: Uma change está pronta para entrar

- **WHEN** o trabalho de uma change termina
- **THEN** a entrega traz os arquivos prontos e os comandos de Git escritos
- **AND** a execução desses comandos é do Gabriel, não do agente

#### Scenario: O líder técnico precisa de uma referência atualizada do remoto

- **WHEN** uma conferência depende de buscar no remoto o que ainda não está na cópia local
- **THEN** o líder técnico não busca: pede ao Gabriel que busque
- **AND** a conferência só continua depois disso

### Requirement: O que o guardião não verifica sozinho vira pedido de comando

Quando uma conferência depender de rodar um comando, o guardião SHALL pedir o comando exato e dizer
o que a saída precisa mostrar. O líder técnico SHALL rodar o pedido só com o ambiente local
conferido e sem diferença por decidir, e SHALL devolver a saída literal e o código de saída, sem
resumo. O guardião SHALL decidir com base nela. Sem saída, o item SHALL ficar declarado como não
verificado.

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

#### Scenario: O ambiente em que os pedidos rodariam mudou

- **WHEN** a conferência do ambiente local acusa uma diferença sem decisão registrada
- **THEN** o líder técnico não roda nenhum pedido daquela leva
- **AND** os pedidos ficam como não verificados, com o motivo, até o Gabriel decidir

#### Scenario: A configuração dos agentes muda dentro da change, com decisão

- **WHEN** a change em curso altera a configuração dos agentes, e a alteração está registrada como
  decidida, com o conteúdo conferido
- **THEN** a conferência do ambiente passa, e os pedidos rodam
- **AND** se o conteúdo mudar depois do registro, a conferência para de novo

### Requirement: A configuração dos agentes é item do checklist

O checklist de segurança SHALL ter um item para a configuração dos agentes: as regras que eles
leem, as ferramentas de cada um, os ganchos, as variáveis de ambiente, os servidores de ferramentas
externas, as instruções geradas pela ferramenta de especificação e os arquivos de instrução a
agentes de IA que qualquer ferramenta lê sozinha. Uma mudança nessa configuração SHALL bloquear nos
casos descritos nos cenários.

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

#### Scenario: Aparece um arquivo de instrução a agentes

- **WHEN** o diff traz, rastreado ou não, um arquivo de instrução a agentes de IA da lista do
  documento de segurança, em qualquer pasta, sem decisão registrada
- **THEN** o guardião devolve BLOQUEADO, citando o item de configuração dos agentes

#### Scenario: O framework volta a poder escrever instrução a agentes

- **WHEN** uma mudança religa a geração de instrução a agentes pelo framework, tira o desligamento
  dela, ou liga o retorno experimental a agentes do framework, sem decisão registrada
- **THEN** o guardião devolve BLOQUEADO, citando o item de configuração dos agentes

#### Scenario: A mudança foi decidida

- **WHEN** a mudança na configuração está nomeada na proposta que o Gabriel aprovou
- **THEN** o item não bloqueia por causa dela
- **AND** o relatório cita onde a decisão está registrada

### Requirement: Change só de documentação tem conferência curta

Uma change cujo diff só toca documentação SHALL ser conferida apenas quanto a segredos e à cadeia
de entrega. O guardião SHALL confirmar pela lista de arquivos do diff que a change é só de
documentação antes de encurtar a conferência. As regras e as definições dos agentes, que mudam o
que eles podem fazer, NÃO SHALL contar como documentação. Arquivo do diff que exige o checklist
inteiro pela conferência proporcional SHALL prevalecer.

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

#### Scenario: Change que mistura documentação e tela

- **WHEN** o diff toca documentação que descreve e arquivos de tela, e nenhum caminho do gatilho
- **THEN** a conferência é a proporcional da change de tela, e não a curta

### Requirement: Os cabeçalhos da prévia são conferidos sem expor o segredo de acesso

O pedido de comando que lê os cabeçalhos da prévia (AS-15) SHALL mirar a prévia da branch da
change, num host conferido letra por letra, e SHALL passar pela proteção de acesso da hospedagem com
o segredo de automação lido só da linha dele no arquivo local de ambiente, enviado pela entrada
padrão. O segredo NÃO SHALL aparecer em argumento de comando, saída, relatório, log nem arquivo
rastreado.

#### Scenario: A prévia responde

- **WHEN** o líder técnico roda o pedido dos cabeçalhos contra a prévia da branch, em `/` e em
  `/processo-seletivo`, depois de a hospedagem gerá-la
- **THEN** a resposta é 200, sem destino de redirecionamento, e não a tela de login da hospedagem
- **AND** a saída vai literal para o registro da change, com o código de saída, e sem o segredo

#### Scenario: O host é o endereço de branch exato

- **WHEN** o líder técnico monta o endereço do pedido
- **THEN** o host é exatamente `portal-liacup-git-<branch>-liacup1.vercel.app`, com `<branch>` igual
  ao nome da branch em minúsculas e `/` trocado por `-`; nesta change,
  `portal-liacup-git-feat-pagina-processo-seletivo-liacup1.vercel.app`
- **AND** a conferência compara o host letra por letra antes de ler o segredo

#### Scenario: A prévia serve o commit da change

- **WHEN** o pedido dos cabeçalhos com o segredo de automação vai rodar
- **THEN** antes, o Gabriel confere no painel da hospedagem que a prévia da branch serve o commit
  certo, e confirma o host
- **AND** o pedido só roda depois dessa confirmação, registrada na change, sem consulta por linha
  de comando de agente

#### Scenario: Host fora do padrão ou cortado pela hospedagem

- **WHEN** o host não é exatamente o esperado, inclusive quando a hospedagem corta o rótulo de mais
  de 63 caracteres
- **THEN** o líder técnico recusa o pedido, o segredo não é lido, e a recusa vai para o registro da
  change
- **AND** o pedido só volta com o host exato daquela change, informado pelo Gabriel

#### Scenario: A variável não existe no arquivo local

- **WHEN** o arquivo local de ambiente não tem a linha do segredo de automação
- **THEN** o líder técnico para e avisa o Gabriel
- **AND** não procura o segredo em nenhum outro lugar

#### Scenario: O cliente de linha de comando não lê o cabeçalho da entrada padrão

- **WHEN** a versão do cliente que faz o pedido é anterior à que lê cabeçalho da entrada padrão
- **THEN** o líder técnico não roda o pedido, e o registra como não verificado, com o motivo

#### Scenario: O segredo não está em nada rastreado

- **WHEN** o guardião pede a busca do valor do segredo na versão da change e na árvore de trabalho
- **THEN** a busca compara o valor lido da linha dele, com a mesma extração do pedido dos
  cabeçalhos, sem imprimi-lo, e devolve só nomes de arquivo e contagens
- **AND** nenhum arquivo rastreado ou ainda não commitado contém o valor
- **AND** se a busca casar com todos os arquivos, o valor está vazio, e o resultado é registrado
  como não concluído

#### Scenario: A busca cobre todo commit que o envio publica

- **WHEN** o guardião pede a busca do valor do segredo commit a commit
- **THEN** o líder técnico confere antes que a versão principal local é a mesma do remoto, e só
  então busca em cada commit da branch que não está nela
- **AND** se as duas forem diferentes, a busca não roda, e o líder técnico pede ao Gabriel que
  atualize a versão principal local

## ADDED Requirements

### Requirement: A recusa de escrita no Git é barreira, e não instrução

O repositório SHALL trazer, versionada, uma barreira que examina todo comando de agente, em toda
ferramenta que roda comando, antes de ele rodar. Ela SHALL recusar todo uso do Git fora de uma lista fechada de operações de leitura,
onde quer que ele apareça no comando, e todo uso da ferramenta de linha de comando da hospedagem do
repositório. Comando que ela não consegue analisar, e erro dela mesma, SHALL dar recusa.

#### Scenario: Um subagente tenta mexer no índice

- **WHEN** um subagente manda remover um arquivo do índice ou acrescentar um a ele
- **THEN** o comando não roda, e a resposta diz que quem escreve no Git é o Gabriel
- **AND** a lista de arquivos preparados para commit fica igual à de antes

#### Scenario: A escrita vem disfarçada

- **WHEN** a escrita vem com a pasta do repositório indicada antes da operação, dentro de outro
  interpretador de comandos, depois de um separador de comandos ou dentro de uma substituição de
  comando
- **THEN** a barreira recusa do mesmo jeito

#### Scenario: A escrita vem por outra ferramenta de comando

- **WHEN** um agente manda acrescentar um arquivo ao índice, em simulação, por cada uma das
  ferramentas que rodam comando na sessão
- **THEN** cada uma recusa
- **AND** o registro da change diz qual camada recusou em cada caso

#### Scenario: Um agente tenta digitar no terminal de quem opera

- **WHEN** um agente tenta usar a ferramenta que digita comandos no terminal de quem opera os
  agentes, com qualquer comando
- **THEN** a ferramenta é recusada no projeto, inteira

#### Scenario: O agente só lê

- **WHEN** um agente pede o estado da árvore, uma diferença ou o histórico
- **THEN** o comando roda normalmente

#### Scenario: O comando só cita uma escrita no Git

- **WHEN** um comando que não é do Git traz, como texto, uma operação de escrita do Git
- **THEN** a barreira recusa, porque não separa citação de invocação

#### Scenario: A barreira não consegue decidir

- **WHEN** a barreira não reconhece uma opção, não consegue ler o comando ou falha por dentro
- **THEN** o comando não roda

#### Scenario: Os ganchos estão desligados

- **WHEN** os ganchos estão desligados nas configurações pessoais de quem opera os agentes
- **THEN** as formas diretas de escrita no Git continuam recusadas pelas regras de permissão do
  projeto
- **AND** a conferência do ambiente local acusa que os ganchos estão desligados

#### Scenario: Uma ferramenta de arquivo tenta escrever na pasta interna do Git

- **WHEN** um agente tenta criar ou alterar arquivo dentro da pasta interna do Git com uma
  ferramenta de escrita de arquivo
- **THEN** a escrita é recusada

#### Scenario: A lista de decisões é testada

- **WHEN** a suíte de unidade roda
- **THEN** ela confere uma tabela de comandos permitidos e recusados, com as formas disfarçadas
- **AND** a saída diz quantos comandos conferiu, quantos permitiu e quantos recusou

### Requirement: A configuração que segura a barreira só muda pelo Gabriel

A configuração dos agentes do projeto e a pessoal, e a pasta dos ganchos, SHALL ter regra de
negação de escrita por ferramenta de arquivo. A barreira SHALL recusar, em toda ferramenta de
comando, todo comando que cite esses caminhos ou rode com a pasta atual dentro da configuração dos
agentes, com falso positivo aceito. Mudá-los SHALL ser passo do Gabriel. A lista de comandos Git de
toda change SHALL começar pela conferência do ambiente local.

#### Scenario: Um subagente tenta escrever a configuração por ferramenta de arquivo

- **WHEN** um subagente tenta criar ou alterar, com uma ferramenta de escrita de arquivo, a
  configuração dos agentes do projeto, a pessoal ou um arquivo da pasta dos ganchos
- **THEN** a escrita é recusada pela regra de negação
- **AND** nenhum arquivo novo aparece na configuração dos agentes

#### Scenario: Um comando cita a configuração

- **WHEN** um comando, por qualquer das ferramentas que rodam comando, cita o caminho da
  configuração dos agentes ou da pasta dos ganchos, mesmo só como texto
- **THEN** a barreira recusa, e a resposta diz que mudar esses arquivos é passo do Gabriel
- **AND** um comando que lê outro arquivo roda normalmente

#### Scenario: O comando roda de dentro da configuração

- **WHEN** a pasta atual de um comando está dentro da pasta de configuração dos agentes
- **THEN** a barreira recusa, mesmo que o comando não cite o caminho

#### Scenario: A configuração precisa mudar

- **WHEN** uma change precisa mudar a configuração dos agentes do projeto, a pessoal ou os ganchos
- **THEN** o líder técnico prepara o conteúdo novo fora do repositório e entrega o comando pronto
- **AND** quem o roda é o Gabriel, no terminal dele

#### Scenario: A lista de comandos Git começa pela conferência

- **WHEN** uma entrega traz comandos Git para o Gabriel rodar
- **THEN** o primeiro comando é a conferência do ambiente local, com o nome da change
- **AND** se ela sair com código diferente de 0, o Gabriel não roda mais nenhum comando da lista e
  manda a saída ao líder técnico

### Requirement: O ambiente local dos agentes é conferido antes de cada passagem

O líder técnico SHALL rodar uma conferência versionada antes de cada leva de pedidos de comando,
antes de entregar os comandos Git e depois de cada subagente. Ela compara com a versão principal,
pelo conteúdo e sem depender do que o Git esconde, a configuração e as instruções dos agentes no
disco, e lê a configuração local do Git que roda código. Diferença sem decisão registrada SHALL
parar o ciclo.

#### Scenario: Um arquivo de configuração de agente foi alterado

- **WHEN** um arquivo de configuração ou de instrução dos agentes no disco difere do da versão
  principal, ou existe só no disco
- **THEN** a conferência termina com erro e nomeia o arquivo
- **AND** o próximo agente não é chamado até o Gabriel decidir

#### Scenario: O arquivo está escondido por uma exclusão local

- **WHEN** um arquivo de configuração de agente está no disco e uma regra de exclusão local da
  máquina o esconde do estado da árvore
- **THEN** a conferência o acha do mesmo jeito
- **AND** lista também cada regra de exclusão local ativa

#### Scenario: A configuração local do Git roda código

- **WHEN** a pasta interna do Git tem um gancho ativo, uma chave de configuração fora da lista
  permitida ou atributos locais
- **THEN** a conferência para antes de rodar qualquer comando do Git
- **AND** nomeia o gancho, a chave ou o arquivo, sem mostrar valor que pareça segredo

#### Scenario: A diferença foi decidida

- **WHEN** a diferença está registrada como decidida na change em curso, com o conteúdo conferido
  e a decisão citada
- **THEN** a conferência não para por ela, e a saída cita a decisão

#### Scenario: A conferência diz quanto mediu

- **WHEN** a conferência termina, com ou sem diferença
- **THEN** a saída diz quantos arquivos comparou, quantas regras de exclusão, ganchos e chaves leu,
  e quantas diferenças aceitou por decisão

### Requirement: A conferência do guardião é proporcional ao risco

Fora da auditoria de base, o tamanho da conferência do guardião SHALL ser decidido pela lista de
arquivos do diff da change, inclusive os não rastreados, contra listas de caminhos escritas no
documento de segurança, e não por julgamento. A regra SHALL valer a partir da primeira change
aprovada depois de ela estar escrita.

#### Scenario: Change só de tela estática da R1

- **WHEN** todo arquivo do diff está na lista de tela, e nenhum na lista do gatilho
- **THEN** o guardião confere segredos, exposição, saída, terceiros e cabeçalhos
- **AND** o relatório diz que a conferência foi proporcional, e por quê

#### Scenario: A change toca um caminho do gatilho

- **WHEN** um arquivo do diff está na lista do gatilho, como a configuração dos agentes, os
  arquivos de configuração do Git, o CI, as dependências, o banco, o interruptor, a configuração do
  framework ou o que trata de variável de ambiente, cabeçalho, autenticação ou dado pessoal
- **THEN** o guardião aplica o checklist inteiro

#### Scenario: A change passa a ler variável de ambiente

- **WHEN** o diff acrescenta uma leitura de variável de ambiente fora dos caminhos do gatilho
- **THEN** o guardião aplica o checklist inteiro

#### Scenario: Um arquivo não está em nenhuma das listas

- **WHEN** um arquivo do diff não está na lista de tela nem na do gatilho
- **THEN** o guardião aplica o checklist inteiro

#### Scenario: A última change da release

- **WHEN** a change é a última da release
- **THEN** a auditoria de base roda, com o checklist inteiro, como antes

### Requirement: Ferramenta do projeto não deixa instrução a agentes no repositório

Nenhuma ferramenta do projeto SHALL deixar na árvore de trabalho um arquivo de instrução a agentes
de IA que não seja versionado e revisado. Esse tipo de arquivo SHALL ficar fora do controle de
versão em qualquer clone, sem depender de configuração local da máquina.

#### Scenario: O servidor de desenvolvimento roda com um agente na sessão

- **WHEN** alguém sobe o servidor de desenvolvimento a partir de uma sessão de agente
- **THEN** nenhum arquivo de instrução a agentes aparece na raiz
- **AND** o estado da árvore não acusa arquivo novo

#### Scenario: Um clone novo, sem exclusão local

- **WHEN** um clone novo, sem nenhuma regra de exclusão local, ganha esse arquivo por outra via
- **THEN** o Git o ignora pela regra versionada
- **AND** o arquivo não é rastreado
