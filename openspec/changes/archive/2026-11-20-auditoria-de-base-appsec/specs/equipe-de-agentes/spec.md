# Spec Delta — equipe-de-agentes

## ADDED Requirements

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
