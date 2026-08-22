# Pesquisa — Fase 0 · F01 Design system em componentes

**Data**: 2026-08-21 · **Spec**: [spec.md](./spec.md) · **Branch**: `feat/F01-design-system`

A F00 fixou a stack e as verificações. Esta pesquisa resolve o que fica abaixo disso: como converter
62 classes CSS em componentes React sem repetir o erro que a F00 cometeu — desviar do aprovado sem
perceber.

---

## D1 — As quatro decisões do ADR-0004 são a base desta feature

**Decisão**: adotar integralmente as quatro decisões que o Gabriel registrou, e tratá-las como
entrada fixa desta feature, não como assunto reaberto no plano.

| # | Decisão | Efeito no código |
|---|---|---|
| 2.1 | Alvo de toque **44×44 px**, em todas as larguras, sem media query | `.btn-icon` 36→44 · `.input` `min-height` 36→44 · `Botao` da F00 **ratificado** |
| 2.2 | Campo de entrada com **16 px** | `.input`, `textarea` e `select` 14→16. **Botão continua em 14** |
| 2.3 | Tipografia do botão **volta ao aprovado** | família `--font-heading`, peso `--font-heading-weight`, tamanho 14 px |
| 2.4 | **Fidelidade vira item de validação** | comparação lado a lado por componente, classificando cada diferença |

**Pendência que bloqueia a implementação, não o plano**: o texto do ADR-0004 **ainda não está em
`docs/`**. O FR-024 da F00 exige as decisões versionadas no repositório, e o item H2 do checklist de
validação cobra isso. As quatro decisões estão descritas na íntegra na entrada deste plano; falta o
arquivo. É a **primeira tarefa** da feature.

---

## D2 — O que a leitura ingênua do `liacup.css` faria de errado

**Este é o achado mais importante desta pesquisa.**

As três últimas linhas do arquivo, depois de todos os blocos de componente, são:

```css
.card, .dialog { border-radius: calc(var(--radius-lg) * 1.15); }
.btn, .tag, .seg, .input { border-radius: 999px; }
.input { padding-inline: 14px; }
```

Elas **sobrescrevem** o que os blocos anteriores declararam. Quem converter classe a classe, lendo
só o bloco de cada componente, vai produzir:

| Componente | O que o bloco declara | O que o navegador realmente aplica |
|---|---|---|
| Botão | `border-radius: var(--radius-md)` (16px) | **999px — pílula** |
| Etiqueta | `calc(var(--radius-md) * 0.75)` (12px) | **999px — pílula** |
| Campo | `var(--radius-md)` (16px) | **999px — pílula** |
| Campo | `padding: 6px 10px` | **`padding: 6px 14px`** |
| Cartão | `var(--radius-md)` (16px) | **`calc(var(--radius-lg) * 1.15)` ≈ 32px** |

**Decisão**: a fidelidade é medida contra o **resultado computado** — o que o navegador aplica
depois da cascata inteira —, nunca contra o primeiro bloco onde a classe aparece.

**Razão**: converter pelo bloco produziria cinco desvios do aprovado numa única feature, todos
invisíveis para as verificações da F00 e todos parecendo obviamente certos. É exatamente a classe de
erro que a decisão 2.4 existe para pegar, e ela apareceria na primeira tentativa se ninguém tivesse
lido o fim do arquivo.

**Consequência prática**: a comparação lado a lado de cada componente inclui uma coluna com o valor
**efetivo**, e a leitura do `liacup.css` é sempre do arquivo inteiro, nunca do trecho.

---

## D3 — Os tokens novos que a conversão exige

**Decisão**: criar **20 tokens novos**, todos com valores lidos literalmente do `liacup.css`.
Nenhum valor inventado, nenhum valor existente alterado, exceto o tamanho do campo autorizado pelo
ADR-0004 2.2.

Por que tantos: o verificador de tokens da F00 detecta cores, funções de cor, `px` e `!important`;
ele exige token para **15 dos 20** valores. Os outros cinco (valores sem unidade, em e opacidade)
são tokens por consistência semântica, não por imposição do CI. Ou os 15 valores detectáveis viram
token, ou o CI fecha a porta.

| Token | Valor | De onde vem |
|---|---|---|
| `--font-size-controle` | `14px` | `.btn` — decisão 2.3 |
| `--font-size-campo` | `16px` | ADR-0004, decisão 2.2 (era 14px) |
| `--font-size-rotulo` | `12px` | `.field > label` |
| `--margem-abaixo-rotulo` | `5px` | `.field > label` |
| `--font-size-cartao-titulo` | `17px` | `.card-title` |
| `--font-size-cartao-corpo` | `13px` | `.card-body` |
| `--font-size-cartao-meta` | `11px` | `.card-meta` |
| `--font-size-kicker` | `10px` | `.card-kicker` |
| `--font-size-etiqueta` | `11px` | `.tag` |
| `--line-height-controle` | `1.2` | `.btn` e `.card-title` |
| `--letter-spacing-kicker` | `0.1em` | `.card-kicker` |
| `--letter-spacing-etiqueta` | `0.02em` | `.tag` |
| `--gap-controle` | `6px` | `.btn` e `.card-meta` |
| `--padding-campo-y` | `6px` | `.input` |
| `--padding-campo-x` | `14px` | cascata final do `.input` |
| `--padding-etiqueta-y` | `3px` | `.tag` |
| `--padding-etiqueta-x` | `10px` | `.tag` |
| `--altura-minima-textarea` | `90px` | `textarea.input` |
| `--radius-xl` | `calc(var(--radius-lg) * 1.15)` | cascata final de `.card` e `.dialog` |
| `--opacidade-desabilitado` | `0.45` | `.btn:disabled` |
| `--opacidade-cartao-corpo` | `0.8` | `.card-body` |

Os papéis distintos em 11px são deliberados: `--font-size-legenda` (F00) é legenda de figura,
`--font-size-cartao-meta` é metadado de cartão e `--font-size-etiqueta` é classificação. Se a
decisão futura for aumentar legendas, os três devem ser avaliados juntos — não coincidirem de valor
não os torna o mesmo papel.

**Alternativa considerada**: reaproveitar tokens existentes de valor próximo — `--font-size-h6`
(13px) no lugar de 14px, `--space-1` (4,4px) no lugar de 6px. **Rejeitada**, e é o erro que a
decisão 2.3 corrige: token com nome de uma coisa aplicado em outra vira número mágico com nome
bonito. Mesmo raciocínio da borda do botão, corrigido no fim da F00.

---

## D4 — Composição do cartão

**Decisão**: `Cartao` aceita `children`, e as partes nomeadas são **componentes próprios**
exportados juntos — `Cartao.Kicker`, `Cartao.Titulo`, `Cartao.Corpo`, `Cartao.Meta` —, todos
opcionais e em qualquer ordem.

**Razão**: o FR-004 pede composição, e o caso de borda "cartão sem título, ou sem corpo, ou só com
imagem" precisa funcionar sem prop condicional. Com partes nomeadas, quem monta escolhe o que
existe; o cartão não precisa saber o que vai dentro.

**Alternativa considerada**: props `titulo`, `corpo`, `kicker`, `meta`, `imagem`. **Rejeitada** pelo
motivo escrito na seção 2.4 dos padrões: um `<Cartao>` com 12 props para cobrir todos os formatos
cresce para sempre; um que aceita `children` não.

**A elevação é variante, não componente**: `elevacao?: 'nenhuma' | 'sm' | 'md' | 'lg'`, mapeando as
classes `.elev-*`. Sombra é propriedade de superfície, não peça independente.

---

## D5 — O campo de formulário e o problema do identificador

**Decisão**: o `Campo` gera seu próprio identificador com o mecanismo nativo do React para isso
(`useId`), e liga rótulo, ajuda e erro ao controle por `id`, `aria-describedby` e `aria-invalid`.

**Razão**: é o caso de borda "dois campos com o mesmo rótulo na mesma página". Identificador
derivado do texto do rótulo colidiria, e a associação silenciosamente apontaria para o campo errado
— defeito que passa em toda verificação automática porque o HTML continua válido.

**Estrutura de acessibilidade decidida**:

| Elemento | Ligação |
|---|---|
| Rótulo | `<label htmlFor={id}>` — sempre presente, mesmo quando visualmente escondido |
| Ajuda | `aria-describedby` inclui o id da ajuda |
| Erro | `aria-describedby` inclui o id do erro; `aria-invalid="true"` no controle |
| Erro | região com `aria-live="polite"`, para ser anunciado quando aparece |
| Desabilitado | `disabled` nativo — tira da ordem de tabulação por conta própria |

**Erro não depende só de cor** (FR-007): além da cor da borda, o erro traz **texto** e um ícone.
Quem não distingue vermelho de cinza continua sabendo que errou.

**Rótulo visualmente escondido**: prop `rotuloEscondido?: boolean` — é o único caso em que uma
booleana é apropriada, porque não descreve variante visual do componente e não cria estado
impossível. Fica registrado para não parecer descuido diante da regra "variante em vez de booleana".

---

## D6 — Onde a vitrine mora

**Decisão**: um terceiro grupo de rotas, `src/app/(interno)/vitrine/`, irmão de `(site)` e
`(painel)`.

**Razão**: a vitrine não é página pública nem tela de painel. Colocá-la dentro de `(site)` misturaria
ferramenta de desenvolvimento com o site que a liga mostra para o público, e a primeira pessoa a
listar as páginas do site encontraria uma que não é do site.

**Registrado como adição à seção 1 dos padrões**: o documento prevê `(site)`, `(painel)` e `api`.
`(interno)` é o quarto. Pelo padrão já estabelecido duas vezes nesta obra — a linha do `lib` e a do
`componentes/layout` —, a regra vai para o documento de origem, não fica só aqui.

**Como fica fora do alcance do público** (FR-014):

1. **Nenhum link** a partir de qualquer página pública;
2. `robots: { index: false, follow: false }` nos metadados da rota, para não ser indexada;
3. um teste de ponta a ponta que **varre os links da página pública** e falha se algum apontar para
   a vitrine.

**O item 3 é o que transforma a regra em verificação.** Sem ele, "não é alcançável" é promessa; com
ele, é algo que quebra o CI quando alguém acrescentar o link sem querer.

**Alternativa considerada**: publicar a vitrine só fora de produção. **Rejeitada** — a revisão da
liga acontece pelo endereço de pré-visualização, e uma página que não existe lá não pode ser
revisada. Não indexada e não linkada resolve o problema real, que é o público topar com ela.

---

## D7 — Como verificar 44 px automaticamente

**Decisão**: no teste de ponta a ponta sobre a vitrine, medir o retângulo de **todos** os elementos
interativos (`a`, `button`, `input`, `textarea`, `select`, `[role="button"]`) e falhar se algum
tiver largura ou altura menor que 44. A saída informa **quantos** foram medidos e **quais**
falharam.

**Razão**: o SC-004 pede número, não adjetivo. E o contador de elementos medidos é o que distingue
"nenhum abaixo de 44" de "não mediu nada" — mesmo raciocínio que levou o verificador de tokens a
imprimir quantos arquivos varreu.

**Detalhe que evita falso positivo**: elementos escondidos (`display: none`) e de largura zero são
ignorados, porque não são alvo de toque de ninguém. Isso fica escrito no teste, não implícito.

---

## D8 — A verificação de fidelidade, que não é automatizável

**Decisão**: uma tabela de comparação por componente, versionada em
`specs/002-design-system/FIDELIDADE.md`, com quatro colunas: propriedade · valor efetivo no
`liacup.css` · valor no componente · veredito (**idêntico**, **corrigido**, **ratificado** ou
**revertido**).

**Razão**: é a decisão 2.4 do ADR-0004. Não tento automatizar e não finjo que dá: comparar
aparência renderizada com CSS de origem exigiria comparação visual por imagem, que traz dependência
nova, instabilidade entre sistemas operacionais e uma pasta de imagens de referência para alguém
manter. O custo não se paga para 7 componentes.

**O que a torna útil em vez de burocrática**: toda diferença precisa de veredito **explícito**. Uma
linha marcada "corrigido" sem motivo escrito é uma linha reprovada. Foi assim que os três desvios do
botão passariam a ser pegos — nenhum deles teria veredito.

**Quando revisitar**: se o sistema passar de ~15 componentes, comparação visual automatizada volta à
mesa.

---

## D9 — O que sai do `liacup.css` e o que fica

**Decisão**: as classes convertidas são **removidas** do arquivo; as não convertidas ficam, sob um
cabeçalho que diz explicitamente que estão pendentes e em qual feature entram.

| Classe | Destino | Quando |
|---|---|---|
| `.btn` e variantes (15) | `Botao` | **F01** |
| `.card` e partes (6) | `Cartao` | **F01** |
| `.tag` e variantes (5) | `Etiqueta` | **F01** |
| `.field`, `.input` e estados (5) | `Campo` | **F01** |
| `.hr` (1) | `Separador` | **F01** |
| `.elev-*` (3) | variante do `Cartao` | **F01** |
| `.nav` e partes (4) | Cabeçalho | feature do primeiro layout público |
| `.table` (4), `.dialog` (5), `.radio` (6), `.seg` (6) | painel | **Fase 2** |
| `.washed` (1), `.text-muted` (1) | utilitárias | avaliar quando houver uso |

**35 classes saem nesta feature; 27 ficam**, cada uma sob um cabeçalho de pendência nomeando a
feature de destino. Antes de retirar as duas regras compartilhadas da cascata, seus valores efetivos
entram nos blocos de `.dialog` e `.seg`: raio de `calc(var(--radius-lg) * 1.15)` para diálogo e
`999px` para seletor segmentado. Assim, as classes pendentes preservam a aparência e o SC-009
continua em 27, sem criar duas regras de substituição.

`.text-muted` permanece contabilizada como utilitária pendente, mas é reatribuída para
`--color-neutral-700`, com comentário para ADR-0003: o equivalente `.texto-secundario` já foi
convertido na F00 e o `color-mix(... 55%)` original mede 3,58:1, reprovado. Não fica valor reprovado
vivo na fonte de referência.

**Razão de remover em vez de comentar**: classe comentada continua sendo lida como se valesse, e a
próxima pessoa não sabe se é referência ou lixo. O histórico do Git guarda o que saiu.

---

## D10 — Nenhuma dependência nova

**Decisão**: a feature entrega com as **20 dependências** já instaladas. Nada entra.

**Razão**: tudo o que ela precisa já está no projeto — React para os componentes, CSS Modules
(nativo do Next) para o estilo, Vitest e Testing Library para os testes de unidade, Playwright e
axe-core para a vitrine.

**Três tentações nomeadas e recusadas antecipadamente**, para que não entrem "porque é padrão":

| Tentação | Por que não |
|---|---|
| Biblioteca de variantes de classe (`clsx`, `cva`) | A junção de classes cabe em três linhas de código nosso. O `Botao` da F00 já faz assim |
| Biblioteca de componentes acessíveis (Radix, Headless UI) | Restrição explícita da spec: o design system da liga é o nosso. E nenhum componente desta feature tem comportamento complexo o bastante para justificar |
| `@testing-library/user-event` | Já recusada na F00; `fireEvent` cobre o que estes componentes fazem |

---

## Nenhum ponto em aberto

Todos os itens marcados como `NEEDS CLARIFICATION` no contexto técnico foram resolvidos acima.

**Uma pendência de registro, que não bloqueia o plano**: o texto do **ADR-0004 precisa ir para
`docs/`** antes da implementação começar (ver D1). É a primeira tarefa.
