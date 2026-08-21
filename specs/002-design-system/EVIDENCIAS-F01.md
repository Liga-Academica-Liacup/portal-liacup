# Evidências da F01 — Design system em componentes

**Data**: 2026-08-21 · **Branch**: `feat/F01-design-system` · **Ambiente**: Windows 11, Node v22.22.2, npm 10.9.7

As 20 evidências do [quickstart.md](./quickstart.md). Cada item responde com número ou saída de
comando, nunca com adjetivo.

**Notação de contraste** (ADR-0003 §4.0): todo valor nomeia as duas cores e a superfície.

---

## Parte 1 — Componentes existem e são tipados

**Evidência 1 — `npm run verificar`**

```
verificar:tipos   → tsc --noEmit, zero erro
lint              → eslint ., zero erro e zero aviso
formatar:check    → All matched files use Prettier code style!
verificar:tokens  → 40 arquivos varridos em src/, sendo 1 de token
                    Nenhuma cor ou medida escrita a mao fora dos arquivos de token
```

**Evidência 2 — 7 componentes de base**

| Componente | Arquivo | Origem |
| --- | --- | --- |
| Botao | `src/componentes/ui/Botao.tsx` | `.btn` + 5 variantes |
| Cartao | `src/componentes/ui/Cartao.tsx` | `.card` + 4 partes + `.elev-*` |
| Etiqueta | `src/componentes/ui/Etiqueta.tsx` | `.tag` + 4 variantes |
| Campo | `src/componentes/ui/Campo.tsx` | `.field > label`, `.input`, `textarea.input` |
| Separador | `src/componentes/ui/Separador.tsx` | `.hr` |
| Icone | `src/componentes/ui/Icone.tsx` | F00, sem classe de origem |
| EstadoVazio | `src/componentes/padroes/EstadoVazio.tsx` | F00, sem classe de origem |

**Evidência 3 — `npm test`**

```
Test Files  8 passed (8)
     Tests  65 passed (65)
```

Eram 19 ao fim da F00. Os 46 novos cobrem renderização, variantes, interação, teclado e os estados
do campo.

**Evidência 4 — estado impossível não compila (T016)**

Com `<Etiqueta variante="roxa">`:

```
src/componentes/ui/Etiqueta.test.tsx(7,22): error TS2322:
Type '"roxa"' is not assignable to type 'VarianteDaEtiqueta | undefined'.
                                                     → código de saída 2
```

Removida a linha: **código de saída 0**. Duas execuções, dois resultados opostos.

---

## Parte 2 — A vitrine

**Evidência 5 — o que a vitrine mostra**: 8 seções (`Seções de componente na vitrine: 8`), com
todas as variantes e estados, incluindo os casos de borda: cartão sem título, sem corpo e só com
meta; etiqueta com texto longo; campo com erro, desabilitado, **erro + desabilitado**, rótulo
escondido e **dois campos com o mesmo rótulo**; e a **linha de inscrição** com campo e botão lado a
lado.

**Evidência 6 — acessibilidade**

```
Violacoes de acessibilidade na vitrine: 0
```

Em todas as 7 larguras, com axe-core nas tags `wcag2a, wcag2aa, wcag21a, wcag21aa`.

**Evidência 7 — alvos de toque**

```
[largura-360]  Alvos de toque medidos: 20 · abaixo de 44 px: 0
[largura-390]  Alvos de toque medidos: 20 · abaixo de 44 px: 0
[largura-430]  Alvos de toque medidos: 20 · abaixo de 44 px: 0
[largura-480]  Alvos de toque medidos: 20 · abaixo de 44 px: 0
[largura-768]  Alvos de toque medidos: 20 · abaixo de 44 px: 0
[largura-1024] Alvos de toque medidos: 20 · abaixo de 44 px: 0
[largura-1280] Alvos de toque medidos: 20 · abaixo de 44 px: 0
```

**O contador é o que faz o verde significar alguma coisa**: 20 elementos medidos, não 0.

**Evidência 8 — rolagem horizontal**: zero ocorrências em 360, 390, 430, 480, 768, 1024 e 1280 px.

**Evidência 9 — nenhum link público leva à vitrine**

```
Links da pagina publica apontando para /vitrine: 0
meta robots da vitrine: noindex, nofollow
```

**Teste do teste (T027)** — com um link para `/vitrine` acrescentado de propósito na home:

```
Links da pagina publica apontando para /vitrine: 1
Error: a vitrine nao pode ser alcancavel pela navegacao publica; encontrados: /vitrine
1 failed
```

Removido o link: `Links da pagina publica apontando para /vitrine: 0` · **1 passed**.

**Evidência extra — foco visível (FR-008)**, que o axe **não** cobre:

```
Elementos com foco verificado: 15 · sem foco visível: 0
```

---

## Parte 3 — Fidelidade ao aprovado

**Evidência 10 — tokens**: `verificar:tokens` com 40 arquivos varridos e zero valores à mão.

**Evidência 11 — nenhum token existente alterado**

```
git diff --numstat main HEAD -- src/estilos/tokens.css
  37 acrescentadas | 0 removidas
```

Zero linhas removidas. **21 custom properties** novas, batendo uma a uma com a tabela do
[data-model.md](./data-model.md).

**Evidência 12 — classes restantes no `liacup.css`**

```
grep -cE "^\.[a-z]" liacup.css
27
```

De 62 para 27: a Fase 1 removeu as 3 regras de cascata compartilhada (62 → 59) e a T029 removeu as
32 convertidas (59 → 27). As 27 restantes: 6 `.seg`, 6 `.radio`, 5 `.dialog`, 4 `.table`, 4 `.nav`,
1 `.washed`, 1 `.text-muted` — todas sob cabeçalho nomeando a feature de destino.

**Evidência 13 — a tabela de fidelidade**

[FIDELIDADE.md](./FIDELIDADE.md), contado por script sobre as próprias linhas:

| Veredito | Quantidade |
| --- | --- |
| idêntico | 38 |
| corrigido | 17 |
| corrigido em comentário | 1 |
| ratificado | 1 |
| revertido | 3 |
| **Total** | **60** |
| **sem motivo escrito** | **0** |

---

## Parte 4 — Quem vem depois

**Evidência 14 — bloco de documentação**: os **7 de 7** trazem `O QUE É`, `QUANDO USAR` e
`QUANDO NÃO USAR`. O `Icone` e o `EstadoVazio`, herdados da F00, tinham prosa mas não o bloco
estruturado — foram acrescentados na T033.

**Evidência 15 — teste com pessoa de fora (SC-011)**: **não executado**. Depende de uma pessoa que
não participou, e não há como eu produzir essa evidência sozinho. Fica como item para o Gabriel
aplicar, com a tela sugerida no quickstart: "uma lista de notícias com categoria e data".

**Evidência 16 — dependências**

```
execucao: 3 | dev: 17 | total: 20
```

Exatamente as mesmas da F00. **Esta feature não instalou nada.** Três tentações recusadas:
`clsx`/`cva` para juntar classes, biblioteca de componentes acessíveis, e `@testing-library/user-event`
pela segunda vez.

**Evidência 17 — README**: aponta `/vitrine` como o lugar de ver o sistema inteiro, com o endereço,
a regra de que não recebe link público e a regra de crescimento.

---

## Parte 5 — Nada da F00 quebrou

**Evidência 18 — desempenho**

```
desempenho: 100 | acessibilidade: 100   (3 execuções, página inicial compilada)
```

Contra os limiares de 90 e 95. Nenhum limiar foi baixado.

**Evidência 19 — testes de ponta a ponta**

```
84 passed (44.0s)
```

Eram 35 ao fim da F00; a vitrine acrescentou 49 (7 testes × 7 larguras). Os 35 originais continuam
passando, incluindo o do texto acentuado e o de `Requisicoes a dominio externo: 0`.

**Evidência 20 — CI**: a ser confirmado na alteração proposta, que roda as 13 etapas do fluxo.

---

## O que não foi possível provar aqui

- **SC-011** (pessoa de fora escolhe o componente certo) — precisa de outra pessoa.
- **Evidência 20** (CI verde e merge barrado) — precisa da alteração proposta aberta no GitHub.

Os dois estão declarados como não executados em vez de preenchidos com algo plausível.
