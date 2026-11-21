# Spec Delta

## ADDED Requirements

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

#### Scenario: O segredo não está em nada rastreado

- **WHEN** o guardião pede a busca do valor do segredo na versão da change e na árvore de trabalho
- **THEN** a busca compara o valor lido da linha dele, com a mesma extração do pedido dos
  cabeçalhos, sem imprimi-lo, e devolve só nomes de arquivo e contagens
- **AND** nenhum arquivo rastreado ou ainda não commitado contém o valor
- **AND** se a busca casar com todos os arquivos, o valor está vazio, e o resultado é registrado
  como não concluído
