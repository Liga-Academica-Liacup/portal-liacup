# Comparação de fidelidade — F01

**Origem**: ADR-0004, decisão 2.4 · **Preenchido durante a implementação, componente a componente**

Esta tabela existe porque nenhuma verificação automática da F00 compara o resultado com o design
aprovado. O verificador de tokens confere que não há valor escrito à mão; **não confere se o token
escolhido é o certo**. Foi por essa fresta que passaram três desvios do botão na F00.

Não é automatizável hoje e não finjo que é. É leitura de duas colunas — mas é a única coisa que pega
esta classe de erro.

---

## Como preencher

Uma tabela por componente. Toda propriedade que o `liacup.css` declara vira uma linha. Quatro
colunas:

| Coluna | O que traz |
|---|---|
| **Propriedade** | A propriedade CSS |
| **Efetivo no `liacup.css`** | O valor que o navegador aplica **depois da cascata inteira** — não o do primeiro bloco. Ver [research.md](./research.md) D2 |
| **No componente** | O token ou valor que o componente usa |
| **Veredito** | `idêntico` · `corrigido` · `ratificado` · `revertido` |

### Os quatro vereditos

| Veredito | Quando usar | Exige motivo escrito? |
|---|---|---|
| **idêntico** | O componente reproduz o aprovado | Não |
| **corrigido** | Desvio deliberado por acessibilidade, autorizado pelo ADR-0004 | **Sim** |
| **ratificado** | Desvio que já existia e foi aprovado retroativamente | **Sim** |
| **revertido** | Desvio anterior desfeito, voltando ao aprovado | **Sim** |

**Linha marcada `corrigido`, `ratificado` ou `revertido` sem motivo escrito é linha reprovada.** Era
exatamente o que faltava nos três desvios do botão: nenhum deles teria motivo, porque ninguém parou
para escrever um.

---

## Botao — a completar na implementação

Já se sabe, pelo ADR-0004, o que estas linhas vão dizer:

| Propriedade | Efetivo no `liacup.css` | No componente | Veredito | Motivo |
|---|---|---|---|---|
| `font-family` | `var(--font-heading)` | `var(--font-heading)` | **revertido** | A F00 usava `--font-body`. Trocar a fonte de display pela de corpo muda a personalidade do componente, e ninguém pediu (ADR-0004 2.3) |
| `font-size` | `14px` | `var(--font-size-controle)` | **revertido** | A F00 usava `--font-size-h6` (13px) — token de título aplicado em controle (ADR-0004 2.3) |
| `font-weight` | `var(--font-heading-weight)` (400) | `var(--font-heading-weight)` | **revertido** | A F00 usava `600` (ADR-0004 2.3) |
| `min-height` | não declarada (≈36px) | `var(--alvo-de-toque)` (44px) | **ratificado** | Regra própria da constituição, mais estrita que o AA (ADR-0004 2.1) |
| `border-radius` | **`999px`** (cascata final) | `var(--radius-pill)` | idêntico | — |
| `background` primário | `var(--color-accent)` | `var(--color-accent-600)` | **corrigido** | **4,84:1 do texto do botão (`--color-bg`) sobre o fundo `--color-accent-600`** — não confundir com os 4,30:1 do accent-600 sobre a superfície da página, que é outro par e não se aplica aqui. Reatribuição registrada na ADR-0003 |
| `background` fantasma | transparente | transparente | idêntico | — |
| `color` fantasma | `var(--color-accent)` | `var(--color-accent-700)` | **corrigido** | 6,15:1 sobre a superfície; `--color-accent` mede 3,48:1 |
| `border-color` secundário | `var(--color-divider)` | `var(--color-neutral-600)` | **corrigido** | A borda atual mede 1,36:1; neutral-600 mede 3,21:1 e é a única delimitação do campo/superfície |
| `.btn-icon` | `36×36` | `44×44` | **corrigido** | Alvo de toque (ADR-0004 2.1) |
| par botão + campo | 14px + 14px | 14px + 16px | **corrigido** | Campo sobe por ADR-0004 2.2; o botão fica em 14px sabendo que o par original se desfez, exibido na vitrine |
| demais | | | | a completar |

## Cartao — a completar

Atenção à linha do raio: o bloco declara `--radius-md`, mas o efetivo é `calc(var(--radius-lg) * 1.15)` e o componente usa `--radius-xl`.

| Propriedade | Efetivo | No componente | Veredito | Motivo |
|---|---|---|---|---|
| `color` de `.card-meta` | `color-mix(text 50%)` | `--color-neutral-700` | **corrigido** | 3,01:1 falha para texto de 11px; neutral-700 mede 4,92:1 sobre superfície |
| `color` de `.card-kicker` | `--color-accent` | `--color-accent-700` | **corrigido** | Accent-600 ainda mede 4,30:1; accent-700 mede 6,15:1 sobre superfície |
| `opacity` de `.card-body` | `0.8` | `var(--opacidade-cartao-corpo)` | idêntico | 7,18:1; não alterar |

## Etiqueta — a completar

Atenção ao raio: o bloco declara `calc(--radius-md * 0.75)`; o efetivo é `999px`.

| Propriedade | Efetivo | No componente | Veredito | Motivo |
|---|---|---|---|---|
| `color` de `.tag-outline` | `--color-accent` | `--color-accent-700` | **corrigido** | 3,48:1 falha para texto de 11px; accent-700 mede 6,15:1 sobre superfície |

## Campo — a completar

Três linhas já conhecidas:

| Propriedade | Efetivo | No componente | Veredito | Motivo |
|---|---|---|---|---|
| `min-height` | `36px` | `var(--alvo-de-toque)` | **corrigido** | Alvo de toque (ADR-0004 2.1) |
| `font-size` | `14px` | `var(--font-size-campo)` (16px) | **corrigido** | O Safari do iPhone dá zoom abaixo de 16px e desmonta a página na mão de quem usa (ADR-0004 2.2) |
| `padding-inline` | **`14px`** (cascata final) | `var(--padding-campo-x)` | idêntico | Não é o `10px` do bloco |
| `border-color` | `var(--color-divider)` | `var(--color-neutral-600)` | **corrigido** | O divisor mede 1,36:1; neutral-600 mede 3,21:1 e o campo e a página diferem só 1,13:1 |
| `color` do rótulo | `color-mix(text 70%)` | equivalente aprovado | idêntico | 5,31:1; não alterar |

## Separador — a completar

| Propriedade | Efetivo | No componente | Veredito | Motivo |
|---|---|---|---|---|
| `height` | `1px` | `var(--largura-borda)` | idêntico | Token de largura de borda é reutilizado para a espessura do separador; decisão registrada, não escolha implícita |

## Utilitária pendente — `.text-muted`

| Propriedade | Efetivo original | Fica no `liacup.css` | Veredito | Motivo |
|---|---|---|---|---|
| `color` | `color-mix(text 55%)` (3,58:1) | `var(--color-neutral-700)` | **corrigido** | Mesmo papel da `.texto-secundario` já convertida na F00; a ADR-0003 já reprovou o valor original |

---

## Fora de escopo de conversão

`Icone` e `EstadoVazio` nasceram na F00 e **não vêm do `liacup.css`**. Não têm classe de origem
para comparar; aparecem na vitrine, mas não nesta tabela.

---

## Resumo — a preencher ao fim

| Veredito | Quantidade |
|---|---|
| idêntico | |
| corrigido | |
| ratificado | |
| revertido | |
| **sem motivo escrito** | **precisa ser 0** |
