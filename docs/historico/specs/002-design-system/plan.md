# Plano de implementação: Design system em componentes (F01)

**Branch**: `feat/F01-design-system` | **Data**: 2026-08-21 | **Spec**: [spec.md](./spec.md)

**Input**: Especificação em `specs/002-design-system/spec.md` + as quatro decisões do ADR-0004

## Sumário

Converter 35 das 62 classes do `liacup.css` em 7 componentes React tipados, testados e exibidos numa
vitrine interna. As 27 classes restantes ficam no arquivo, marcadas como pendentes, com a feature de
destino nomeada.

A abordagem está em [research.md](./research.md). O achado que mais muda a implementação é o **D2**:
as três últimas linhas do `liacup.css` sobrescrevem o raio e o espaçamento declarados nos blocos de
componente. Converter classe a classe, lendo só o bloco de cada uma, produziria **cinco desvios do
aprovado** numa feature cujo objetivo é fidelidade — e nenhuma verificação da F00 acusaria.

## Contexto técnico

**Linguagem/Versão**: TypeScript 5.9.3 estrito · React 19.2 · Next.js 16.3.1 (App Router)

**Dependências principais**: **nenhuma nova.** As 20 diretas da F00 bastam (research.md D10)

**Armazenamento**: nenhum. Componentes de base não conhecem banco (F02)

**Testes**: Vitest + Testing Library (unidade, por componente) · Playwright + axe-core (vitrine)

**Plataforma alvo**: navegadores modernos, mobile como caso principal

**Tipo de projeto**: biblioteca de componentes dentro da aplicação web existente

**Metas de desempenho**: as herdadas da F00 — Lighthouse desempenho ≥ 90 e acessibilidade ≥ 95

**Restrições**: zero valores de estilo escritos à mão · zero tokens existentes alterados · zero
dependências novas · zero links do site público para a vitrine · nenhum alvo de toque abaixo de
44 px · sem rolagem horizontal em 7 larguras

**Escala/Escopo**: 7 componentes de base · 20 tokens novos · 1 página de vitrine · 35 classes
migradas

## Checagem contra a constituição

*PORTÃO: precisa passar antes da Fase 0. Reavaliado após a Fase 1.*

| Princípio | Como este plano cumpre | Situação |
|---|---|---|
| **I — Quem mantém vem antes** | Cada componente traz o que é / quando usar / quando não usar; nenhuma dependência nova; três tentações recusadas por escrito (D10) | ✅ |
| **II — Acessibilidade** | Alvo de 44 px verificado por medição automática; axe sobre a vitrine; erro do campo anunciado, marcado e **não dependente só de cor**; rótulo sempre associado por `id` gerado (D5) | ✅ |
| **III — Mobile é o caso principal** | 44 px em todas as larguras, sem media query (ADR-0004 2.1); campo com 16 px para não disparar zoom no iOS (2.2); 7 larguras sem rolagem horizontal | ✅ |
| **IV — Segurança e dados** | Nenhum dado pessoal, nenhum acesso a banco, nenhum segredo. Entra na F02 | ✅ (não se aplica) |
| **V — A spec manda** | O plano descreve tecnologia; a spec descreve comportamento. O achado D2 foi reportado, não corrigido em silêncio | ✅ |
| **VI — Fidelidade ao aprovado** | Fidelidade medida contra o **valor efetivo** pós-cascata (D2); tabela de comparação por componente com veredito obrigatório (D8); os três desvios do botão da F00 revertidos | ✅ |
| **VII — Nada entra sem verificação** | Teste de unidade por componente; axe, 44 px, 7 larguras e ausência de link na vitrine, todos automatizados | ✅ |
| **VIII — Honestidade** | D8 declara que a fidelidade **não é automatizável hoje** e não finge que é; a ausência do ADR-0004 em `docs/` está registrada como primeira tarefa | ✅ |
| **IX — Componentização** | Uma responsabilidade por componente; união fechada de variantes; composição no cartão (D4); nenhum valor de estilo à mão; `ui/` sem domínio, verificado pela zona Z1 | ✅ |

**Portão: PASSA.** Nenhuma violação a justificar.

**Reavaliação após a Fase 1**: os artefatos de projeto não introduziram violação nova. Dois pontos
ficaram mais firmes: o Princípio VI ganhou um mecanismo próprio de verificação
([FIDELIDADE.md](./FIDELIDADE.md), D8), que é a lacuna que deixou passar três desvios na F00; e o
Princípio II ganhou a medição de alvo de toque com contador de elementos medidos (D7), que
distingue "nenhum abaixo de 44" de "não mediu nada". **Portão continua passando.**

## Estrutura do projeto

### Documentação (esta feature)

```text
specs/002-design-system/
├── spec.md              # Especificação
├── plan.md              # Este arquivo
├── research.md          # Fase 0 — 10 decisões
├── data-model.md        # Fase 1 — inventário de tokens e mapa das classes
├── quickstart.md        # Fase 1 — guia de validação
├── FIDELIDADE.md        # Comparação lado a lado por componente (ADR-0004, 2.4)
├── contracts/
│   ├── componentes.md   # Contrato de props de cada componente
│   └── vitrine.md       # Contrato da página de vitrine
└── checklists/
    └── requirements.md
```

### Código-fonte

```text
src/
├── app/
│   ├── (site)/                      # Público — inalterado nesta feature
│   └── (interno)/                   # NOVO grupo de rotas (research.md D6)
│       └── vitrine/
│           ├── page.tsx             # Vitrine, com robots noindex
│           ├── page.module.css
│           └── Secao.tsx            # Moldura de cada bloco da vitrine
├── componentes/ui/
│   ├── Botao.tsx + .module.css + .test.tsx    # COMPLETADO: variantes e tipografia
│   ├── Icone.tsx + .module.css + .test.tsx    # Existe (F00)
│   ├── Cartao.tsx + .module.css + .test.tsx   # NOVO — com partes nomeadas
│   ├── Etiqueta.tsx + .module.css + .test.tsx # NOVO
│   ├── Campo.tsx + .module.css + .test.tsx    # NOVO
│   └── Separador.tsx + .module.css + .test.tsx # NOVO
├── componentes/padroes/
│   └── EstadoVazio.tsx                        # Existe (F00)
└── estilos/tokens.css                         # +20 tokens novos

tests/e2e/vitrine.spec.ts            # axe · 44px · 7 larguras · ausência de link
liacup.css                           # 35 classes removidas, 27 marcadas como pendentes
docs/ADR-0004-controles-e-fidelidade.md   # PRIMEIRA TAREFA
docs/PADROES-DE-CODIGO.md            # +linha do grupo (interno) na seção 1
```

**Decisão de estrutura**: os 7 componentes vivem em `componentes/ui/`, camada já protegida pela
zona Z1 do lint — nenhum deles pode conhecer feature, banco ou rota, e isso quebra o CI se alguém
tentar. A vitrine vive num grupo de rotas novo, `(interno)`, registrado em D6 e levado para a seção 1
dos padrões.

## O que muda em relação ao aprovado, e por quê

Resumo executável das quatro decisões do ADR-0004. **Toda linha aqui é desvio deliberado com aval
explícito** — é o que o Princípio VI exige.

| Onde | `liacup.css` aprovado | Fica | Motivo | Veredito |
|---|---|---|---|---|
| `.btn-icon` | 36×36 px | **44×44** | Regra própria da constituição, mais estrita que o AA | Corrigido |
| `.input` altura | `min-height: 36px` | **44px** | Idem | Corrigido |
| `.input` fonte | 14px | **16px** | Safari do iPhone dá zoom abaixo de 16px | Corrigido |
| `Botao` família | *(F00 usou `--font-body`)* | **`--font-heading`** | Volta ao aprovado | **Revertido** |
| `Botao` tamanho | *(F00 usou `--font-size-h6`, 13px)* | **`--font-size-controle`, 14px** | Volta ao aprovado | **Revertido** |
| `Botao` peso | *(F00 usou 600)* | **`--font-heading-weight`, 400** | Volta ao aprovado | **Revertido** |
| `Botao` altura | *(F00 usou 44px)* | **44px** | Ratificado pela decisão 2.1 | Ratificado |
| `.btn` fonte | 14px | **14px** | Mantida sabendo que o campo passa a 16px; a vitrine prova o emparelhamento que a origem descreve | Idêntico |

As três linhas marcadas **Revertido** são a parte que menos parece urgente e mais importa: não há
defeito de acessibilidade nelas. É fidelidade pura, e foi o que quase se perdeu.

## Dependências e justificativa

**Total: 20 — as mesmas da F00.** Nenhuma entra, nenhuma sai. A tabela justificada continua sendo a
do [plan.md da F00](../001-fundacao-tecnica/plan.md).

O que esta feature precisa e já tem: React (componentes), CSS Modules — nativo do Next, sem pacote —,
Vitest e Testing Library (unidade), Playwright e `@axe-core/playwright` (vitrine).

Três tentações nomeadas e recusadas antes de aparecerem, em [research.md](./research.md) D10:
biblioteca de variantes de classe, biblioteca de componentes acessíveis, e
`@testing-library/user-event`.

## Riscos deste plano

| Risco | Como o plano reage |
|---|---|
| **Converter pelo bloco e ignorar a cascata final** | D2 é explícito: fidelidade contra o valor **efetivo**. A tabela de FIDELIDADE.md tem coluna própria para isso |
| Desvio novo entrar sem registro, como na F00 | Toda diferença precisa de veredito escrito. Linha sem motivo é linha reprovada (D8) |
| Vitrine ganhar link do site público sem querer | Teste de ponta a ponta varre os links da página pública e falha (D6, item 3) |
| Verificação de 44 px passar sem medir nada | O teste imprime **quantos** elementos mediu (D7) |
| Explosão de tokens novos virar desculpa para inventar valor | Os 20 estão enumerados em D3, cada um com a linha de origem. Token fora dessa lista precisa de justificativa nova |
| Contraste reprovado em componente ainda não exibido na F00 | Adendo à ADR-0003, com as quatro reatribuições e as medições, é concluído antes da implementação dos componentes |
| Regra final de cascata afetar classe que fica para a Fase 2 | Os valores efetivos de `.dialog` e `.seg` entram em seus blocos antes de remover as regras compartilhadas |
| `--font-size-h6` (13px) ser reaproveitado como fonte de controle | É exatamente o erro que a decisão 2.3 corrige. `--font-size-controle` existe para isso |

## Rastreamento de complexidade

Sem violações da constituição a justificar. Seção mantida vazia de propósito.
