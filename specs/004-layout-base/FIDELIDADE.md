# Fidelidade — F03 Layout base

**Estado**: template do plano; preencher com valores medidos durante a implementação.

Regra: toda linha não idêntica exige motivo. Contraste sempre nomeia primeiro plano, fundo e
superfície. Valores previstos abaixo são ponto de comparação, não substituem a medição final.

## Cabeçalho e navegação

| Propriedade/estado | Origem aprovada | Implementação medida | Veredito | Motivo quando não idêntico |
| --- | --- | --- | --- | --- |
| display/alinhamento/gap | `.nav` efetivo | PREENCHER | PREENCHER | |
| padding | `.nav`: `--space-3` / `--space-4` | PREENCHER | PREENCHER | |
| borda inferior | `.nav`: nenhuma | PREENCHER | PREENCHER | |
| marca — família/peso | `.nav-brand`: heading/400 | PREENCHER | PREENCHER | |
| marca — tamanho | `.nav-brand`: 18 px | PREENCHER | PREENCHER | token novo com origem literal |
| link — tamanho | `.nav a`: 14 px | PREENCHER | PREENCHER | |
| link — decoração normal | `.nav a`: sem sublinhado | PREENCHER | PREENCHER | |
| hover/atual — cor | accent reprovado | accent-700 | corrigido | ADR-0003 §2 |
| atual — pista não cromática | não existia | PREENCHER | PREENCHER | FR-016 |
| alvo de toque | origem não garantia 44 px | PREENCHER | PREENCHER | RP-04 |
| altura mobile | protótipo 244 px | PREENCHER | PREENCHER | FR-002 |
| permanência ao rolar | protótipo fixo | PREENCHER | PREENCHER | |
| painel lateral | não existia | PREENCHER | PREENCHER | requisito mobile aprovado |
| CTA em 1024 px | texto em uma linha no protótipo | 96,38 × 53,19 px, texto em duas linhas | divergente, aceito no limite | sem quebra mede 153,73 × 44 px e gera `scrollWidth 1064 > 1024`; o plano B autorizado já foi consumido e o FR-007 proíbe novo breakpoint |

## Rodapé

| Propriedade/estado | Origem/decisão | Implementação medida | Veredito | Motivo |
| --- | --- | --- | --- | --- |
| linha institucional | componente F00 | PREENCHER | PREENCHER | |
| sede curta | conteúdo aprovado | PREENCHER | PREENCHER | FR-025 |
| contatos | `LinksDeContato` F00 | PREENCHER | PREENCHER | movidos para o rodapé |
| contêiner semântico | `nav` na F00 | `address` | corrigido | exatamente um landmark de navegação |
| borda/separador | divider decorativo | PREENCHER | PREENCHER | declarar se permanece só decorativo |

## Aparência compartilhada

| Variante/dimensão | Pares medidos | Propriedades divergentes | Veredito | Motivo |
| --- | ---: | ---: | --- | --- |
| primário normal | PREENCHER | PREENCHER | PREENCHER | |
| secundário normal | PREENCHER | PREENCHER | PREENCHER | |
| fantasma normal | PREENCHER | PREENCHER | PREENCHER | |
| primário largura total | PREENCHER | PREENCHER | PREENCHER | |
| secundário largura total | PREENCHER | PREENCHER | PREENCHER | |
| fantasma largura total | PREENCHER | PREENCHER | PREENCHER | |

## Contrastes obrigatórios

| Primeiro plano | Fundo/superfície | Valor previsto | Valor medido | Veredito |
| --- | --- | ---: | ---: | --- |
| `--color-text` `#201e1d` | `--color-bg` `#f5ead8` | 13,95:1 | PREENCHER | PREENCHER |
| `--color-text` `#201e1d` | `--color-surface` `#ebddc5` | 12,40:1 | PREENCHER | PREENCHER |
| `--color-accent-700` `#683f74` | `--color-bg` `#f5ead8` | 6,91:1 | PREENCHER | PREENCHER |
| `--color-accent-700` `#683f74` | `--color-surface` `#ebddc5` | 6,15:1 | PREENCHER | PREENCHER |
| `--color-neutral-700` `#645c50` | `--color-bg` `#f5ead8` | 5,53:1 | PREENCHER | PREENCHER |
| `--color-neutral-700` `#645c50` | `--color-surface` `#ebddc5` | 4,92:1 | PREENCHER | PREENCHER |
| `--color-bg` `#f5ead8` | CTA `--color-accent-600` `#82558f` | 4,84:1 | PREENCHER | PREENCHER |
| `--color-neutral-600` `#82796a` | `--color-surface` `#ebddc5` | 3,21:1 | PREENCHER | PREENCHER |
| `--color-divider` composto | superfície em que aparecer | 1,37:1 previsto | PREENCHER | só pode ser decorativo |

## Contagem da fonte

| Medida | Antes | Depois esperado | Depois medido | Veredito |
| --- | ---: | ---: | ---: | --- |
| seletores pendentes sob o banner | 27 | 22 | PREENCHER | PREENCHER |
| seletores da família `.nav` | 5 | 0 | PREENCHER | PREENCHER |
| nomes em `NomeDoIcone` | 2 | 4 | PREENCHER | PREENCHER |
| tokens existentes alterados | 0 | 0 | PREENCHER | PREENCHER |
| tokens novos | 0 | 1 | PREENCHER | `--font-size-marca`, origem `.nav-brand` |

## Veredito final

- Linhas não idênticas sem motivo: **PREENCHER**
- Combinações de cor medidas: **PREENCHER/PREENCHER**
- Resultado: **PREENCHER**
