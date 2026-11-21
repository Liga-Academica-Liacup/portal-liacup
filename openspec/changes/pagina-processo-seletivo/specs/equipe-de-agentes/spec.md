# Spec Delta

## ADDED Requirements

### Requirement: Os cabeçalhos da prévia são conferidos sem expor o segredo de acesso

O pedido de comando que lê os cabeçalhos da prévia (AS-15) SHALL mirar a prévia da branch da
change, e não a produção, e SHALL passar pela proteção de acesso da hospedagem com o segredo de
automação lido só da linha dele no arquivo local de ambiente. O segredo NÃO SHALL aparecer em
argumento de comando, saída, relatório, log nem arquivo rastreado.

#### Scenario: A prévia responde

- **WHEN** o líder técnico roda o pedido dos cabeçalhos contra a prévia da branch, depois de a
  hospedagem gerá-la
- **THEN** a resposta é 200, sem destino de redirecionamento, e não a tela de login da hospedagem
- **AND** a saída vai literal para o registro da change, com o código de saída, e sem o segredo

#### Scenario: Host fora do padrão

- **WHEN** o endereço montado para o pedido não tem exatamente o host da prévia da branch no padrão
  escrito no documento de segurança
- **THEN** o líder técnico recusa o pedido, e a recusa vai para o registro da change
- **AND** o segredo não é lido

#### Scenario: O segredo não está em nada rastreado

- **WHEN** o guardião pede a busca do valor do segredo na versão da change e na árvore de trabalho
- **THEN** a busca compara o valor lido da linha dele sem imprimi-lo e devolve só nomes de arquivo e
  contagens
- **AND** nenhum arquivo rastreado ou ainda não commitado contém o valor
