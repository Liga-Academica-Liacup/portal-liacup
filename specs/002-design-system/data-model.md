# Modelo — F01 Design system em componentes

**Data**: 2026-08-21 · **Spec**: [spec.md](./spec.md)

## Esta feature não tem modelo de dados

Nenhuma entidade, nenhuma tabela, nenhum dado pessoal. Componentes de base não conhecem domínio: é
a regra Z1, verificada pelo lint desde a F00. O banco entra na **F02**.

O que existe de estruturado são **duas coisas**: o inventário de tokens e o mapa de conversão das
classes. As duas são o que o Princípio VI exige que seja rastreável.

---

## 1. Tokens

### Regra que não muda

- **Valor de token existente NÃO se altera.** As rampas de cor foram geradas em OKLCH numa escala
  compartilhada de luminosidade; mexer num degrau desalinha os outros.
- **Token novo pode ser criado, com justificativa.**
- Todo token novo desta feature tem valor **lido literalmente do `liacup.css`**, com duas exceções
  que o ADR-0004 autoriza expressamente e que estão marcadas abaixo.

### Os 20 tokens novos

| Token | Valor | Origem no `liacup.css` | Observação |
|---|---|---|---|
| `--font-size-controle` | `14px` | `.btn` | Existe para **não** reaproveitar `--font-size-h6` (13px) como fonte de controle |
| `--font-size-campo` | `16px` | `.input` era `14px` | ⚠️ **ADR-0004 2.2** — único valor alterado, contra o zoom do Safari |
| `--font-size-rotulo` | `12px` | `.field > label` | |
| `--margem-abaixo-rotulo` | `5px` | `.field > label` | Não reaproveita `--space-1` (4,4px) |
| `--font-size-cartao-titulo` | `17px` | `.card-title` | |
| `--font-size-cartao-corpo` | `13px` | `.card-body` | |
| `--font-size-cartao-meta` | `11px` | `.card-meta` | |
| `--font-size-kicker` | `10px` | `.card-kicker` | |
| `--font-size-etiqueta` | `11px` | `.tag` | |
| `--line-height-controle` | `1.2` | `.btn` e `.card-title` | |
| `--letter-spacing-kicker` | `0.1em` | `.card-kicker` | |
| `--letter-spacing-etiqueta` | `0.02em` | `.tag` | |
| `--gap-controle` | `6px` | `.btn` e `.card-meta` | Não é `--space-1` (4,4px) nem `--space-2` (8,8px) |
| `--padding-campo-y` | `6px` | `.input` | |
| `--padding-campo-x` | `14px` | cascata final do `.input` | Não é o `10px` do bloco — ver [research.md](./research.md) D2 |
| `--padding-etiqueta-y` | `3px` | `.tag` | |
| `--padding-etiqueta-x` | `10px` | `.tag` | |
| `--altura-minima-textarea` | `90px` | `textarea.input` | |
| `--radius-xl` | `calc(var(--radius-lg) * 1.15)` | cascata final de `.card` e `.dialog` | Raio de escala compartilhado; não é raio de componente |
| `--opacidade-desabilitado` | `0.45` | `.btn:disabled` | |
| `--opacidade-cartao-corpo` | `0.8` | `.card-body` | Mesma regra aplicada à opacidade desabilitada: ambos são tokenizados |

Os três tokens de 11px têm papéis diferentes: `--font-size-legenda` (F00) para `figcaption`,
`--font-size-cartao-meta` para metadados e `--font-size-etiqueta` para classificação. Devem ser
reavaliados juntos se a liga decidir aumentar legendas, mas não se fundem por coincidirem em valor.

### Tokens da F00 que esta feature usa e não altera

`--alvo-de-toque` (44px, ratificado pelo ADR-0004 2.1) · `--radius-pill` (999px) ·
`--largura-borda` (1px) · `--font-heading` · `--font-heading-weight` (400) · `--font-body` ·
toda a paleta e as escalas de espaçamento, raio e sombra.

---

## 2. Mapa de conversão das classes

### O que vira componente nesta feature — 35 classes

| Classes de origem | Componente | Variantes |
|---|---|---|
| `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-icon`, `.btn-block` e estados (15) | `Botao` | `primario` · `secundario` · `fantasma` · `icone` |
| `.card`, `.card-kicker`, `.card-title`, `.card-body`, `.card-meta` (5) + `.elev-sm/md/lg` (3) | `Cartao` + partes nomeadas | elevação: `nenhuma` · `sm` · `md` · `lg` |
| `.tag`, `.tag-accent`, `.tag-accent-2`, `.tag-neutral`, `.tag-outline` (5) | `Etiqueta` | `destaque` · `apoio` · `neutra` · `contorno` |
| `.field > label`, `.input`, `.input:hover`, `.input:focus-visible`, `textarea.input` (5) | `Campo` | `tipo`: `texto` · `email` · `textarea` |
| `.hr` (1) | `Separador` | — |

Somados ao `Icone` e ao `EstadoVazio` entregues na F00, fecham os **7 componentes de base** do
SC-001.

### O que fica no `liacup.css` — 27 classes

Cada bloco recebe um cabeçalho nomeando a feature de destino, para que ninguém perca o que falta:

| Classes | Quantidade | Destino |
|---|---|---|
| `.nav`, `.nav-brand`, `.nav a`, `.nav a:hover` | 4 | Feature do primeiro layout público (cabeçalho) |
| `.table` e partes | 4 | Fase 2 — painel |
| `.dialog` e partes | 5 | Fase 2 — painel |
| `.radio` e estados | 6 | Fase 2 — painel |
| `.seg`, `.seg-opt` e estados | 6 | Fase 2 — painel |
| `.washed`, `.text-muted` | 2 | Utilitárias — avaliar quando houver uso real; `.text-muted` já usa a reatribuição da ADR-0003 |

O SC-009 mede isso: o número de classes restantes precisa ser **menor** que ao fim da F00, e cada
restante precisa ser identificável como pendente.

---

## 3. A cascata que muda cinco valores

Registrado aqui porque é o detalhe que a conversão erraria sozinha. As três últimas linhas do
`liacup.css` sobrescrevem os blocos anteriores:

```css
.card, .dialog { border-radius: calc(var(--radius-lg) * 1.15); }
.btn, .tag, .seg, .input { border-radius: 999px; }
.input { padding-inline: 14px; }
```

Nomes de token abaixo são os do **nosso** `tokens.css`; no `liacup.css` os mesmos valores
aparecem como literais.

| Componente | Bloco declara | **Efetivo** — é o que vale |
|---|---|---|
| `Botao` | `--radius-md` (16px) | **`--radius-pill`** (999px) |
| `Etiqueta` | `calc(--radius-md * 0.75)` (12px) | **`--radius-pill`** |
| `Campo` | `--radius-md` (16px) | **`--radius-pill`** |
| `Campo` | `padding: 6px 10px` | **`6px 14px`** |
| `Cartao` | `--radius-md` (16px) | **`--radius-xl`** (~32px) |

**Os seis blocos afetados recebem o próprio valor efetivo antes de as três regras finais serem
removidas** — não só as duas classes da Fase 2. Se a remoção acontecer primeiro, quem abrir o arquivo
para converter o `Cartao` lê `--radius-md` (16px) com a linha que a sobrescrevia já apagada: é o
modo de falha do D2, reintroduzido pela ordem das tarefas.

| Bloco | Valor efetivo a dobrar para dentro | Destino |
|---|---|---|
| `.card` | `border-radius: calc(var(--radius-lg) * 1.15)` | F01 — `Cartao` |
| `.btn` | `border-radius: 999px` | F01 — `Botao` |
| `.tag` | `border-radius: 999px` | F01 — `Etiqueta` |
| `.input` | `border-radius: 999px` **e** `padding-inline: 14px` | F01 — `Campo` |
| `.dialog` | `border-radius: calc(var(--radius-lg) * 1.15)` | **Fase 2** |
| `.seg` | `border-radius: 999px` | **Fase 2** |

**Literal, nunca token nosso.** O `:root` do `liacup.css` define apenas `--radius-sm` (8px),
`--radius-md` (16px) e `--radius-lg` (28px). Escrever `var(--radius-xl)` ou `var(--radius-pill)` ali
deixaria `.dialog` e `.seg` **sem raio nenhum** quando o arquivo é lido isolado — o oposto de
preservar o valor efetivo. Os dois tokens foram criados no **nosso** `tokens.css`; o `liacup.css` é
o registro do que a liga aprovou, não um consumidor do nosso arquivo.

**Contagem**: remover as três regras compartilhadas leva de **62 para 59** seletores; a T017 remove
as 32 classes convertidas restantes, fechando em **27** (SC-009).

**A fidelidade é medida contra a coluna da direita.** Ver [research.md](./research.md) D2 e a tabela
de [FIDELIDADE.md](./FIDELIDADE.md).
