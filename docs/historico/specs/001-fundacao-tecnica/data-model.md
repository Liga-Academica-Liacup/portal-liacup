# Modelo de dados — F00 Fundação técnica

**Data**: 2026-08-20 · **Spec**: [spec.md](./spec.md)

## Esta feature não tem modelo de dados

Nenhuma entidade, nenhuma tabela, nenhum dado pessoal. A spec é explícita: Supabase, banco e RLS
entram na **F02**. Registrar isso é mais honesto do que inventar um esboço de modelo agora —
esboço prematuro vira decisão que ninguém lembra de ter tomado (Princípio VIII).

O primeiro esboço de tabelas está no ADR-0001, seção 3, e vira modelo definitivo no `plan.md` da
F02. **Não tratar como fechado.**

Consequências diretas para esta feature:

- Nenhum requisito de RLS, validação de servidor, retenção ou base legal se aplica aqui.
- `src/lib/supabase/` é criada **vazia**, com um `README.md` dizendo o que vai ali e em qual
  feature.
- `src/features/exemplo/dados.ts` existe como **modelo de forma**, não como acesso real: mostra
  onde uma leitura de banco vai morar, com dados em memória e um comentário dizendo que a conexão
  real chega na F02.

---

## O que existe de estruturado: os tokens

A única informação com forma definida nesta feature são os tokens de design, extraídos do
`liacup.css` para `src/estilos/tokens.css`. Eles não são dados de aplicação — são a origem única de
estilo (Princípio IX) — mas têm estrutura, e é ela que a verificação do FR-010 protege.

### O que vem do `liacup.css` e o que fica para a F01

O `liacup.css` tem 259 linhas e **não é um arquivo de tokens**. Só o bloco `:root` é:

| Parte                                                                                                                                               | Linhas  | Destino                            | Quando  |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------- | ------- |
| Cabeçalho de comentário                                                                                                                             | 1–3     | Preservado no topo de `tokens.css` | F00     |
| `@import` do Google                                                                                                                                 | 4       | **Removido** (FR-027)              | F00     |
| Bloco `:root` — as custom properties                                                                                                                | 6–65    | `src/estilos/tokens.css`           | **F00** |
| Reset e regras de elemento (`body`, `h1`–`h6`, `p`, `a`, `img`, `figure`, `figcaption`, foco, seleção)                                              | 67–107  | `src/estilos/global.css`           | **F00** |
| ~35 classes de componente (`.btn`, `.card`, `.input`, `.field`, `.radio`, `.seg`, `.tag`, `.nav`, `.table`, `.dialog`, `.hr`, `.elev-*`, `.washed`) | 110–259 | Viram componentes React, uma a uma | **F01** |

**As classes de componente não entram na F00**, e isso é decisão, não esquecimento. Trazê-las faria
a feature terminar com duas implementações de botão convivendo — `.btn-primary` em CSS e
`Botao.tsx` em React — e na F01 ninguém saberia qual manda. Elas continuam existindo no
`liacup.css` original, que é o insumo da F01.

### Famílias de token

| Família                   | Papel                               | Exemplos conferidos no `liacup.css`                                |
| ------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| Base                      | Fundo, superfície, texto, divisória | `--color-bg`, `--color-surface`, `--color-text`, `--color-divider` |
| Rampa neutra              | 9 degraus de neutro                 | `--color-neutral-100` … `--color-neutral-900`                      |
| Rampa de destaque (lilás) | 9 degraus do lilás da marca         | `--color-accent-100` … `--color-accent-900`                        |
| Rampa de apoio (sálvia)   | 9 degraus do verde de apoio         | `--color-accent-2-100` … `--color-accent-2-900`                    |
| Tipografia                | Famílias e escala                   | `--font-heading` (Caprasimo), `--font-body` (Figtree)              |
| Espaçamento, raio, sombra | Escalas estruturais                 | vindas do sistema, sem alteração                                   |

### Regra de alteração (FR-006)

- **Valor de token não muda.** As rampas vieram geradas em OKLCH numa escala compartilhada de
  luminosidade; mexer em um degrau desalinha os outros.
- **O que muda é qual token cada papel usa** — as quatro reatribuições do ADR-0003 (FR-026).
- **Token novo pode ser criado**; token existente não se altera sem passar pelo design.

### As quatro reatribuições do ADR-0003 (FR-026)

| Papel            | Token que passa a ser usado | Valor conferido | Onde é aplicada                                                                                    |
| ---------------- | --------------------------- | --------------- | -------------------------------------------------------------------------------------------------- |
| Botão primário   | `--color-accent-600`        | `#82558f`       | `src/componentes/ui/Botao.tsx` (T017) — é onde a regra de botão deve viver, não em CSS solto       |
| Link             | `--color-accent-700`        | `#683f74`       | `src/estilos/global.css` (T010) — `a` é regra de elemento                                          |
| Texto secundário | `--color-neutral-700`       | `#645c50`       | `src/estilos/global.css` (T010)                                                                    |
| Texto em verde   | `--color-accent-2-700`      | `#56633f`       | **F01** — nenhum elemento da F00 usa verde; fica registrada no ADR-0003 até haver o que reatribuir |

Os quatro tokens existem no `liacup.css` com esses valores — conferido. O texto aprovado está em
`docs/ADR-0003-tokens-e-acessibilidade.md`, com o contraste medido de cada troca:

| Papel            | Antes     | Depois        |
| ---------------- | --------- | ------------- |
| Botão primário   | 3,48:1 ❌ | **4,84:1** ✅ |
| Link             | 3,48:1 ❌ | **6,91:1** ✅ |
| Texto secundário | 3,61:1 ❌ | **5,53:1** ✅ |
| Texto em verde   | 2,37:1 ❌ | **5,43:1** ✅ |

Nenhuma cor nova entra — são degraus que já existem na mesma rampa. O `#9B6AAF` continua sendo a
cor da marca; só não carrega texto pequeno em cima. As escalas de espaçamento fracionário
(`--space-1: 4.4px`) **não mudam**: são o que gerou as telas aprovadas.

### Carregamento de fontes (FR-027)

O `liacup.css` traz, na **linha 4**, um `@import` para `fonts.googleapis.com` com Caprasimo e
Figtree. Ele **sai** na transcrição: as fontes passam a ser servidas pelo próprio domínio
(ver [research.md](./research.md) D5), e o SC-014 exige zero requisições externas no carregamento da
página inicial.
