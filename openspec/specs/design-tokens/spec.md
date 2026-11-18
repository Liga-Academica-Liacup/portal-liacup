# design-tokens Specification

## Purpose
A única fonte de cor, espaçamento, raio, sombra e tipografia do portal, os componentes de base que
a consomem. A vitrine interna onde eles se conferem não entra nesta spec: a R1 refaz os
componentes e decide se ela fica.

## Requirements

### Requirement: Valor visual só vem de token

Nenhum valor de cor, espaçamento, raio, sombra ou tamanho de fonte SHALL ser escrito à mão fora de
`src/estilos/tokens.css`, e a regra SHALL ser verificada por comando, não por disciplina.

#### Scenario: Alguém escreve uma cor dentro de um componente

- **WHEN** um arquivo fora de `tokens.css` traz uma cor em hexadecimal ou uma medida em pixels
- **THEN** `npm run verificar:tokens` falha
- **AND** a saída diz o valor encontrado e qual token usar no lugar

### Requirement: Token novo se cria, token existente não se altera

O conjunto de tokens SHALL poder crescer, e um token já existente SHALL só mudar de valor por
decisão registrada em ADR, porque ele é identidade aprovada pela liga.

#### Scenario: Uma tela precisa de um valor que não existe

- **WHEN** alguém precisa de um valor que nenhum token oferece
- **THEN** cria um token novo, com origem nomeada
- **AND** a diferença do `tokens.css` mostra só linhas acrescentadas

### Requirement: Componente de base não conhece o produto

Os componentes de `src/componentes/ui/` SHALL receber props e desenhar, sem conhecer banco de
dados, rota ou qualquer domínio do produto.

#### Scenario: Componente de base tenta importar de uma feature

- **WHEN** um arquivo de `componentes/ui/` importa de `features/` ou de `lib/supabase/`
- **THEN** `npm run lint` falha pela regra de dependência entre camadas
