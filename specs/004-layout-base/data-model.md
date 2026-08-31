# Modelo de dados de interface — F03 Layout base

**Data**: 2026-08-27 · **Spec**: [spec.md](./spec.md) · **Plano**: [plan.md](./plan.md)

Esta feature não cria tabela nem persistência. O “modelo de dados” descreve os dados estáticos e os
estados de interface que precisam permanecer coerentes entre componentes e verificações.

## 1. `DestinoPublico`

Fonte única: `src/componentes/layout/destinos-publicos.json`.

| Campo | Tipo | Regra |
| --- | --- | --- |
| `rotulo` | string não vazia | texto aprovado da navegação; único entre os dez itens |
| `caminho` | string iniciada por `/` | rota pública exata; única; sem barra final salvo `/` |
| `ehConversaoPrincipal` | boolean | exatamente um item `true`: `/processo-seletivo` |

### Conjunto fechado

| Ordem | Rótulo | Caminho | Conversão |
| ---: | --- | --- | --- |
| 1 | Início | `/` | não |
| 2 | Sobre | `/sobre` | não |
| 3 | Notícias | `/noticias` | não |
| 4 | Conteúdo educativo | `/conteudo-educativo` | não |
| 5 | Eventos | `/eventos` | não |
| 6 | Projetos | `/projetos` | não |
| 7 | Materiais | `/materiais` | não |
| 8 | Galeria | `/galeria` | não |
| 9 | Processo seletivo | `/processo-seletivo` | **sim** |
| 10 | Contato | `/contato` | não |

### Invariantes

- exatamente 10 itens no conjunto vigente — cobrado no **contrato de conjunto fechado**
  (`destinos-publicos.test.ts`), e **não** na validação de carregamento do módulo: o carregamento
  valida as propriedades estruturais abaixo e que o catálogo não esteja vazio. A antiga guarda de
  tamanho derrubava o build antes de qualquer consumidor ou verificador reagir ao acréscimo exigido
  pelo FR-044/SC-017 (decisão de 28/08/2026);
- 10 rótulos e 10 caminhos únicos;
- exatamente uma conversão principal;
- o processo seletivo continua pertencendo ao conjunto total, mesmo aparecendo fora do painel no
  mobile;
- a navegação, o teste E2E e o Lighthouse consomem o mesmo arquivo, sem cópia.

## 2. `EstadoDaRotaPublica`

Não é persistido. É derivado do caminho atual e do catálogo.

| Estado | Condição | Resultado |
| --- | --- | --- |
| `atual` | caminho atual igual ao destino | `aria-current="page"` + marcador visual não cromático |
| `naoAtual` | caminho diferente | link normal |
| `semCorrespondencia` | caminho não existe no catálogo | nenhum destino é marcado |

Comparação é exata. Prefixo parecido não autoriza “chutar” a página atual.

## 3. `EstadoDoPainelDeNavegacao`

Estado local da ilha cliente. Não vai para URL, cookie ou armazenamento.

| Estado | Dialog | Rolagem de fundo | Foco |
| --- | --- | --- | --- |
| `fechado` | fechado/fora da árvore acessível | restaurada | fluxo normal |
| `aberto` | `showModal()` | bloqueada | contido no diálogo |

### Transições

| Origem | Evento | Destino | Pós-condição |
| --- | --- | --- | --- |
| fechado | ativar botão | aberto | primeiro item útil recebe foco |
| aberto | Esc | fechado | foco volta ao botão |
| aberto | escolher destino | fechado | navegação acontece; foco não fica preso |
| aberto | clicar backdrop | fechado | foco volta ao botão |
| aberto | viewport passa a desktop | fechado | rolagem é restaurada; foco vai para alvo visível seguro |
| aberto | unmount | fechado | valor anterior de `body.style.overflow` é restaurado |

### Invariantes

- `aria-expanded` reflete o estado real;
- `aria-controls` aponta para o id do diálogo;
- o painel tem nome acessível;
- Tab e Shift+Tab não saem do diálogo aberto;
- botão invisível no desktop nunca recebe foco programático.

## 4. `VarianteDaAparenciaDeBotao`

União compartilhada pelo helper visual.

| Variante | `Botao` | `LinkComAparenciaDeBotao` |
| --- | --- | --- |
| `primario` | sim | sim |
| `secundario` | sim | sim |
| `fantasma` | sim | sim |
| `icone` | sim | **não** — sem consumidor de link-ícone |

`larguraTotal` é uma dimensão independente e compartilhada. `disabled` pertence somente ao botão;
o link exige `href` e continua sendo navegação real.

### Propriedades visuais contratadas

Display/alinhamento · gap · padding · borda por lado · tipografia · cor · fundo · raio · altura
mínima · largura total · cursor · decoração de texto. Essas propriedades são comparadas na vitrine
para cada combinação compartilhada.

## 5. `ResultadoDePaginaVerificada`

Produzido em memória durante Playwright, uma linha por combinação destino/largura.

| Campo | Tipo | Regra de aprovação |
| --- | --- | --- |
| `caminho` | caminho do catálogo | rota responde sem 404/redirecionamento indevido |
| `largura` | 360, 390, 430, 480, 768, 1024 ou 1280 | uma das sete permitidas |
| `landmarks` | contagem por papel | 1 cabeçalho, 1 navegação, 1 main, 1 rodapé |
| `violacoesAxe` | inteiro | 0 |
| `scrollWidth/clientWidth` | números | `scrollWidth <= clientWidth` |
| `alturaCabecalho` | número | ≤ 64 nas quatro larguras mobile; reportada nas sete |
| `alvosMedidos` | inteiro | > 0 |
| `alvosPequenos` | lista | vazia |

Agregação obrigatória: 10/10 páginas em cada largura e 70/70 combinações totais.

## 6. `ResultadoDoLighthouse`

Derivado de `.lighthouseci/manifest.json` e do LHR apontado por cada `jsonPath`.

| Campo | Origem | Regra |
| --- | --- | --- |
| pathname pedido/final | manifest + LHR | pertence ao catálogo e não redireciona inesperadamente |
| execuções por pathname | multiconjunto do manifest | exatamente 3 |
| status HTTP | auditoria `http-status-code` | score 1 |
| desempenho | summary/LHR | ≥ 0,90 |
| acessibilidade | summary/LHR | ≥ 0,95 |
| `formFactor` | `configSettings` | `mobile` |
| throttling | `configSettings` | método `simulate` |

Agregação obrigatória: 10/10 caminhos distintos e 30/30 relatórios da execução atual.

## 7. `RegistroDeFidelidade`

Persistido somente como documentação em `FIDELIDADE.md`.

| Campo | Regra |
| --- | --- |
| propriedade/estado | identifica exatamente o que foi comparado |
| origem aprovada | valor efetivo do `liacup.css` ou decisão/ADR |
| implementação | valor calculado ou comportamento entregue |
| contraste | nomeia primeiro plano, fundo e superfície |
| veredito | `idêntico`, `corrigido`, `ratificado` ou `revertido` |
| motivo | obrigatório quando o veredito não é `idêntico` |

Nenhum registro deste arquivo substitui medição automatizada quando ela é possível.
