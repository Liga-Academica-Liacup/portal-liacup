# Design — atualizar o Next

## Context

Ver `proposal.md`, seção Why. Estado medido pelo líder técnico em 19/11/2026, na `main` `03a81e9`:

| O que | Situação |
|---|---|
| Instalado | `next@16.3.1` e `eslint-config-next@16.3.1`, fixos, sem `^`; `sharp@0.35.3`, opcional do `next`. Node 22.22.2, npm 10.9.7 |
| Registro | `next` `latest` = 16.4.6 (09/11/2026); a linha 16.4 vai de 16.4.0 a 16.4.6. `eslint-config-next@16.4.6` existe. `next@16.4.6` pede `sharp` `^0.35.5`, a mais recente |
| `npm audit` | 37 avisos: crítico 2, alto 21, moderado 12, baixo 2, info 0 |
| Críticos | `next`, faixa 16.0.0 a 16.4.4, correção 16.4.6. `proxy-addr@2.0.7`, via `@lhci/cli`, só em desenvolvimento, correção 2.0.8 dentro da faixa `~2.0.7` do `express` |
| Dependências diretas | 22 (4 + 18) |
| Página em construção | Logo pelo otimizador de imagem; fontes do `next/font/google`, baixadas na compilação e servidas pelo próprio domínio |

## Goals / Non-Goals

**Goals:** fechar os avisos do `next` e do `sharp` sem mudar nada que o visitante veja, e provar
isso com número.

**Non-Goals:** qualquer outro aviso do `npm audit`, qualquer outra dependência, qualquer linha de
`src/`, `tests/`, `scripts/` ou do CI.

## Decisions

### D1 — 16.4.6, e não 16.4.1

As duas execuções remotas (GHSA-2464-fhr4-w9xw e GHSA-673q-mjm6-r5xr) afetam até 16.4.0, então
16.4.1 as fecharia. Mas a faixa crítica do `npm audit` vai até 16.4.4, com altos e moderados nela.
16.4.6 é a `latest`, fecha a faixa inteira e é a correção que o próprio `npm audit` propõe. É a
solução óbvia: a versão que o registro chama de atual.

**Se o registro mostrar outra versão** na hora da troca (uma 16.4.7, ou a `latest` fora da 16.4),
a troca não segue: o agente para e reporta. O alvo desta proposta é 16.4.6.

### D2 — `--save-exact`

Sem ele, o `npm install pacote@versão` grava `^16.4.6` e muda a forma do `package.json`, que hoje
fixa as duas. A versão fixa é o que faz duas máquinas e o CI instalarem o mesmo `next`.

### D3 — O `sharp` não é instalado à parte

Ele não é dependência direta, e o `next@16.4.6` já pede `^0.35.5`. Instalá-lo à parte criaria a
23ª dependência direta (RP-01). A tarefa confere a versão que veio, que é critério de aceite (emenda do Portão 1); abaixo de
0.35.5, para e volta ao Gabriel, sem forçar nada.

### D4 — Prints antes e depois, pixel a pixel

- **Onde:** `openspec/changes/atualizar-next/prints/`, como na `interruptor-em-construcao`. Os
  prints "antes" têm de sobreviver entre passagens de agentes diferentes, e a pasta temporária de
  uma sessão pode ser limpa. Pelo RP-13, a pasta não entra no Git: ela é apagada **antes do
  `openspec archive` e do commit**, e os números ficam no relatório. O `verificar:artefatos` só vê
  arquivo rastreado, então a proteção é o `git status` da tarefa 4.2.
- **Como:** o mesmo procedimento da `interruptor-em-construcao` (1.1 e 4.1): build de produção,
  `npm run start` **sem `SITE_PUBLICADO`**, que é o modo da produção, e o Chromium do
  `@playwright/test` 1.62.1, que esta change não troca. Espera a logo carregada e
  `document.fonts.ready`; página inteira em 390 × 844 e 1280 × 844. O script fica fora do
  repositório.
- **Comparação:** RGBA pixel a pixel, com a contagem de pixels diferentes por largura. **Esperado:
  0.** O `cmp` byte a byte vai junto, como informação: bytes diferentes com pixels iguais não
  reprovam.
- **O comparador é visto acusando diferença** (RP-12): uma vez, com uma mudança de estilo injetada
  num print de teste, fora do repositório.

### D5 — Sem delta de spec

Ver `proposal.md`. A `fundacao-e-ci` diz que o portal é um projeto Next.js, e continua sendo; nenhum
cenário cita versão. Inventar um requisito de versão só para ter delta seria requisito para
satisfazer validação.

### D6 — Requisitos permanentes

| RP | Aplica? | Como |
|---|---|---|
| RP-01 | Sim | 22 diretas antes e depois; `package.json` com duas linhas trocadas |
| RP-02, RP-03, RP-09 | Não se aplica | Nenhum estilo, token ou cor |
| RP-04, RP-05, RP-07 | Sim, sem teste novo | O que os specs e2e existentes já medem, nos dois modos e nas 7 larguras |
| RP-06 | Sim | `npm run test:desempenho`, com os números |
| RP-08, RP-14 | Sim | D4: diferença esperada zero |
| RP-10, RP-11 | Não se aplica | Nenhum segredo, nenhum banco |
| RP-12 | Sim | O comparador do D4 visto falhando; nenhuma verificação permanente nova |
| RP-13 | Sim | Prints e saída do `npm audit` fora do Git; `npm run verificar:artefatos` com código 0 |

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| O `sharp` novo ou o `next` novo redimensionar a logo com outros pixels | O D4 mede. Diferença maior que zero não é corrigida aqui: para, o guardião faz o lado a lado, e vai ao Gabriel |
| As fontes do Google, baixadas em cada compilação, mudarem entre a build de antes e a de depois | Mesmo efeito: aparece no D4, e o print diz onde |
| O `eslint-config-next` novo trazer regra que reprova código existente | O `npm run verificar` mostra. Mudar código ou desligar regra está fora de escopo: para e reporta |
| O `npm update proxy-addr` mover mais que o `proxy-addr` | A tarefa 2.2 confere a diferença do `package-lock.json` antes de seguir |
| Os prints entrarem no commit | Apagados antes do `archive`; `git status --porcelain` na tarefa 4.2 |
| A troca não ser auditada pelo guardião-appsec nesta branch | Declarado incompleto; ele audita quando a `main` entrar na branch da change 6 |

## Open Questions

Nenhuma aberta. Q1 = (a) e Q2 = (a), mais as emendas do `sharp` e da evidência, foram decididas
pelo Gabriel no Portão 1, em 19/11/2026, e estão na proposta, em "Decisões do Portão 1".
