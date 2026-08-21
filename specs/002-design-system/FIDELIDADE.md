# Comparação de fidelidade — F01

**Origem**: ADR-0004, decisão 2.4 · **Preenchido em 21/08/2026, componente a componente**

Esta tabela existe porque nenhuma verificação automática compara o resultado com o design aprovado.
O verificador de tokens confere que não há valor escrito à mão; **não confere se o token escolhido é
o certo**. Foi por essa fresta que passaram três desvios do botão na F00.

Não é automatizável hoje e não finjo que é. É leitura de duas colunas — mas é a única coisa que pega
esta classe de erro.

**Notação** (ADR-0003 §4.0): todo valor de contraste nomeia as duas cores e a superfície sobre a
qual foi medido. Número solto não vale como registro.

---

## Como ler

| Coluna | O que traz |
| --- | --- |
| **Propriedade** | A propriedade CSS |
| **Efetivo no `liacup.css`** | O valor que o navegador aplicava **depois da cascata inteira** |
| **No componente** | O token ou valor que o componente usa |
| **Veredito** | `idêntico` · `corrigido` · `ratificado` · `revertido` |

| Veredito | Quando | Exige motivo? |
| --- | --- | --- |
| **idêntico** | O componente reproduz o aprovado | Não |
| **corrigido** | Desvio deliberado por acessibilidade ou comportamento novo | **Sim** |
| **ratificado** | Desvio que já existia e foi aprovado retroativamente | **Sim** |
| **revertido** | Desvio anterior desfeito, voltando ao aprovado | **Sim** |

---

## Botao — `.btn` e variantes

| Propriedade | Efetivo no `liacup.css` | No componente | Veredito | Motivo |
| --- | --- | --- | --- | --- |
| `font-family` | `var(--font-heading)` | `var(--font-heading)` | **revertido** | A F00 usava `--font-body`. Trocar a fonte de display pela de corpo muda a personalidade do componente, e ninguém pediu (ADR-0004 2.3) |
| `font-size` | `14px` | `var(--font-size-controle)` (14px) | **revertido** | A F00 usava `--font-size-h6` (13px) — token de título aplicado em controle (ADR-0004 2.3) |
| `font-weight` | `var(--font-heading-weight)` (400) | `var(--font-heading-weight)` | **revertido** | A F00 usava `600` (ADR-0004 2.3) |
| `line-height` | `1.2` | `var(--line-height-controle)` | idêntico | — |
| `min-height` | não declarada (≈36px) | `var(--alvo-de-toque)` (44px) | **ratificado** | Regra própria da constituição, mais estrita que o AA — o WCAG 2.1 AA não exige 44px (ADR-0004 2.1) |
| `border-radius` | **`999px`** (cascata final) | `var(--radius-pill)` | idêntico | Não é o `--radius-md` do bloco |
| `border-width` | `1px` | `var(--largura-borda)` | idêntico | — |
| `gap` | `6px` | `var(--gap-controle)` | idêntico | — |
| `padding` | `var(--space-2) calc(var(--space-3) * 1.2)` | igual | idêntico | — |
| `background` primário | `var(--color-accent)` | `var(--color-accent-600)` | **corrigido** | O texto `--color-bg` sobre o fundo `--color-accent-600` mede **4,84:1**; sobre `--color-accent` media **3,48:1**. Não confundir com os 4,30:1 do accent-600 sobre a superfície da página, que é outro par (ADR-0003 §2) |
| `color` fantasma | `var(--color-accent)` | `var(--color-accent-700)` | **corrigido** | `--color-accent-700` sobre `--color-bg` mede **6,91:1**; `--color-accent` sobre `--color-bg` media **3,48:1** (ADR-0003 §2) |
| `border-color` secundário | `var(--color-divider)` | `var(--color-neutral-600)` | **corrigido** | `--color-divider` sobre `--color-surface` mede **1,37:1**; `--color-neutral-600` sobre `--color-surface` mede **3,21:1**, atingindo o mínimo de 3:1 para elemento de interface (ADR-0003 §4.1) |
| `.btn-icon` largura e altura | `36×36` | `var(--alvo-de-toque)` (44×44) | **corrigido** | Alvo de toque (ADR-0004 2.1) |
| `opacity` desabilitado | `0.45` | `var(--opacidade-desabilitado)` | idêntico | Valor mantido. O primário desabilitado mede **1,86:1** e o secundário **2,72:1**, ambos sobre `--color-bg`: isentos do critério 1.4.3, medidos e aceitos conscientemente (ADR-0004 §3) |
| par botão + campo | 14px + 14px | 14px + 16px | **corrigido** | O comentário da `.btn` registra que os 14px existiam para casar com o campo. O campo sobe por ADR-0004 2.2 e o botão fica em 14px por fidelidade: **o par se desfez sabendo**, e a vitrine mostra os dois lado a lado |

## Cartao — `.card` e partes, `.elev-*`

| Propriedade | Efetivo no `liacup.css` | No componente | Veredito | Motivo |
| --- | --- | --- | --- | --- |
| `border-radius` | **`calc(var(--radius-lg) * 1.15)`** (cascata final) | `var(--radius-xl)` | idêntico | Mesmo valor, agora nomeado. Não é o `--radius-md` do bloco |
| `background` | `var(--color-surface)` | igual | idêntico | — |
| `padding` | `var(--space-3)` | igual | idêntico | — |
| `gap` | `var(--space-2)` | igual | idêntico | — |
| `.card-kicker` `color` | `var(--color-accent)` | `var(--color-accent-700)` | **corrigido** | `--color-accent` sobre `--color-surface` mede **3,09:1**, reprovado para texto de 10px. `--color-accent-700` sobre `--color-surface` mede **6,15:1**. O `--color-accent-600` **não bastaria**: 4,30:1 sobre a superfície (ADR-0003 §4.1) |
| `.card-kicker` `font-size` | `10px` | `var(--font-size-kicker)` | idêntico | — |
| `.card-kicker` `letter-spacing` | `0.1em` | `var(--letter-spacing-kicker)` | idêntico | — |
| `.card-title` `font-size` | `17px` | `var(--font-size-cartao-titulo)` | idêntico | — |
| `.card-title` família e peso | `--font-heading` / `--font-heading-weight` | iguais | idêntico | — |
| `.card-body` `font-size` | `13px` | `var(--font-size-cartao-corpo)` | idêntico | — |
| `.card-body` `opacity` | `0.8` | `var(--opacidade-cartao-corpo)` | idêntico | `--color-text` a 80% sobre `--color-surface` mede **7,19:1**. Passa folgado; **não alterar** |
| `.card-meta` `color` | `color-mix(--color-text 50%)` | `var(--color-neutral-700)` | **corrigido** | `color-mix(--color-text 50%)` sobre `--color-surface` mede **3,01:1**, reprovado para texto de 11px. `--color-neutral-700` sobre `--color-surface` mede **4,92:1** (ADR-0003 §4.1) |
| `.card-meta` `font-size` | `11px` | `var(--font-size-cartao-meta)` | idêntico | — |
| `.card-meta` `gap` | `6px` | `var(--gap-controle)` | idêntico | — |
| `.elev-sm/md/lg` | `var(--shadow-sm/md/lg)` | variante `elevacao` | idêntico | Vira prop em vez de classe utilitária: sombra é propriedade de superfície, não peça independente |

## Etiqueta — `.tag` e variantes

| Propriedade | Efetivo no `liacup.css` | No componente | Veredito | Motivo |
| --- | --- | --- | --- | --- |
| `border-radius` | **`999px`** (cascata final) | `var(--radius-pill)` | idêntico | Não é o `calc(--radius-md * 0.75)` do bloco |
| `font-size` | `11px` | `var(--font-size-etiqueta)` | idêntico | — |
| `letter-spacing` | `0.02em` | `var(--letter-spacing-etiqueta)` | idêntico | — |
| `padding` | `3px 10px` | `var(--padding-etiqueta-y) var(--padding-etiqueta-x)` | idêntico | — |
| `.tag-accent` | `accent-100` / `accent-800` | iguais | idêntico | — |
| `.tag-accent-2` | `accent-2-100` / `accent-2-800` | iguais | idêntico | — |
| `.tag-neutral` | `neutral-100` / `neutral-800` | iguais | idêntico | — |
| `.tag-outline` `color` | `var(--color-accent)` | `var(--color-accent-700)` | **corrigido** | `--color-accent` como texto sobre `--color-bg` mede **3,48:1**, reprovado para 11px. `--color-accent-700` sobre `--color-bg` mede **6,91:1** (ADR-0003 §4.1) |
| `.tag-outline` `border-color` | `var(--color-accent)` | `var(--color-accent)` | idêntico | A borda é elemento gráfico, não texto: mede **3,48:1** sobre `--color-bg` e o mínimo para elemento gráfico é 3:1. **Passa, e por isso não muda** |
| quebra de texto longo | não declarada | `overflow-wrap: anywhere` | **corrigido** | Caso de borda da spec: etiqueta com texto longo em 360px não pode empurrar a largura da página. Comportamento novo, sem classe de origem |

## Campo — `.field > label`, `.input`, `textarea.input`

| Propriedade | Efetivo no `liacup.css` | No componente | Veredito | Motivo |
| --- | --- | --- | --- | --- |
| `min-height` | `36px` | `var(--alvo-de-toque)` (44px) | **corrigido** | Alvo de toque (ADR-0004 2.1) |
| `font-size` | `14px` | `var(--font-size-campo)` (16px) | **corrigido** | O Safari do iPhone dá zoom automático abaixo de 16px e a página fica torta na mão de quem usa (ADR-0004 2.2) |
| `border-radius` | **`999px`** (cascata final) | `var(--radius-pill)` | idêntico | Não é o `--radius-md` do bloco |
| `padding` | **`6px 14px`** (cascata final) | `var(--padding-campo-y) var(--padding-campo-x)` | idêntico | Não é o `6px 10px` do bloco |
| `background` | `var(--color-surface)` | igual | idêntico | — |
| `border-color` | `var(--color-divider)` | `var(--color-neutral-600)` | **corrigido** | `--color-divider` sobre `--color-surface` mede **1,37:1**. `--color-surface` e `--color-bg` diferem só **1,13:1** entre si, então a borda é a única coisa que diz onde o campo começa. `--color-neutral-600` sobre `--color-surface` mede **3,21:1** (ADR-0003 §4.1) |
| `caret-color` | `var(--color-accent)` | `var(--color-accent-700)` | **corrigido** | Coerência com a cor de foco, que a ADR-0003 §4.1 já reatribuiu para accent-700. O cursor de texto é traço fino e o valor mais escuro o torna visível sobre `--color-surface` |
| `.field > label` `font-size` | `12px` | `var(--font-size-rotulo)` | idêntico | — |
| `.field > label` `margin-bottom` | `5px` | `var(--margem-abaixo-rotulo)` | idêntico | — |
| `.field > label` `color` | `color-mix(--color-text 70%)` | `var(--color-neutral-700)` | **corrigido** | O original **passa**: mede 5,31:1 sobre `--color-surface` e 5,63:1 sobre `--color-bg`. A troca é por **coerência**, não por contraste — `--color-neutral-700` (4,92:1 sobre superfície) é o token de texto secundário que a ADR-0003 §2 fixou, e manter um `color-mix` avulso reintroduziria valor sem token |
| `textarea` `min-height` | `90px` | `var(--altura-minima-textarea)` | idêntico | — |
| `textarea` `resize` | `vertical` | igual | idêntico | — |
| `:focus-visible` | `border-color: var(--color-accent)` | `--color-accent-700` mais anel | **corrigido** | Coerência com o anel de foco reatribuído na ADR-0003 §4.1, quinta reatribuição |
| estado de **erro** | **não existe** no `liacup.css` | ícone, texto e borda `--color-accent-700` | **corrigido** | Comportamento novo, sem classe de origem. A cor é `--color-accent-700` porque o sistema **não tem token de vermelho** e inventar cor é proibido; o erro não depende de cor de qualquer forma — traz ícone e texto (FR-007) |

## Separador — `.hr`

| Propriedade | Efetivo no `liacup.css` | No componente | Veredito | Motivo |
| --- | --- | --- | --- | --- |
| `height` | `1px` | `var(--largura-borda)` | idêntico | Mesmo valor. O token é de largura de borda e está sendo reaproveitado para espessura de traço — **decisão registrada aqui**, não escolha de quem digitou. Criar `--espessura-separador` com o mesmo 1px seria token novo sem ganho |
| `border` | `0` | igual | idêntico | — |
| `margin` | `var(--space-4) 0` | igual | idêntico | — |
| `background` | `var(--color-divider)` | igual | idêntico | Aqui o divisor é **elemento decorativo**, não delimitador de controle: nada depende de percebê-lo, então o 1,37:1 do campo não se aplica como defeito |
| papel semântico | `<hr>` sempre anunciado | `role="presentation"` por padrão | **corrigido** | Comportamento novo. Separador decorativo anunciado a cada respiro visual atrapalha quem ouve a página; `decorativo={false}` mantém o `<hr>` anunciável |

## Utilitária que fica — `.text-muted`

| Propriedade | Efetivo original | Estado no `liacup.css` | Veredito | Motivo |
| --- | --- | --- | --- | --- |
| `color` | `color-mix(--color-text 55%)` | anotado, não convertido | **corrigido em comentário** | Mede **3,57:1** sobre `--color-bg`, reprovado no AA. O comentário aponta `--color-neutral-700` (5,53:1 sobre `--color-bg`). Mesmo papel da `.texto-secundario` já convertida na F00 |

---

## Fora de escopo de conversão

`Icone` e `EstadoVazio` nasceram na F00 e **não vêm do `liacup.css`**. Não têm classe de origem para
comparar; aparecem na vitrine, mas não nesta tabela.

---

## Resumo por veredito

| Veredito | Quantidade |
| --- | --- |
| idêntico | 38 |
| corrigido | 17 |
| corrigido em comentário | 1 |
| ratificado | 1 |
| revertido | 3 |
| **Total de linhas** | **60** |
| **sem motivo escrito** | **0** |

**Zero linhas não idênticas sem motivo.** As 22 que exigem motivo — 17 corrigidas, 1 corrigida em
comentário, 1 ratificada e 3 revertidas — trazem todas o par de cores medido ou a decisão de origem
nomeada.

Os números desta tabela foram **contados por script** sobre as próprias linhas do documento, não
estimados. A primeira versão que escrevi dizia 33/15/1/3 de memória e errava em cinco linhas — o
mesmo tipo de erro que o resto deste arquivo existe para pegar.
