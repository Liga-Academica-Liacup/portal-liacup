# Relatório — pagina-projetos

Copiado de `openspec/changes/MODELO-relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/pagina-projetos/` — `.openspec.yaml`, `proposal.md`,
  `design.md`, `tasks.md`, `specs/pagina-projetos/spec.md`, `specs/navegacao-publica/spec.md`,
  `specs/seo/spec.md` e este `relatorio.md` · **12 tarefas** de 15 · requisitos nas specs delta:
  `pagina-projetos` 4 ADDED; `navegacao-publica` 1 REMOVED, 1 ADDED e 2 MODIFIED; `seo` 1 MODIFIED
  (8 requisitos escritos, 1 removido).
- **Questões em aberto** (opções, custo e recomendação na proposta, "Questões para o Portão 1"):
  - Q1. Destino dos cinco textos do passo 7: (a) `lancamento-r1`, como o briefing; (b) aqui, como a
    Q11 (a) de lá, com o checklist inteiro; (c) change própria. Recomendo (a). Muda uma decisão
    literal do Gabriel, por isso pede confirmação dele.
  - Q2. Frase da faixa: (a) nenhuma; (b) "As quatro frentes de trabalho da Liga." como rótulo.
    Recomendo (a).
  - Q3. Descrição para buscadores: (a) frase nova no §3, 139 caracteres; (b) 1ª frase de Ensino,
    140; (c) o Gabriel escreve. Recomendo (a).
  - Q4. Interruptor: (a) requisito e e2e da própria página; (b) spec delta de
    `publicacao-do-site`, com o checklist inteiro. Recomendo (a).
  - Q5. Itálico da Secretaria: (a) sem; (b) com. Recomendo (a).
- **Classificação prevista do guardião:** com a Q1 (a) e a Q4 (a), passo 3 da conferência
  proporcional (AS-01, AS-02, AS-04, AS-07 e AS-15); lista de arquivos no `design.md`, D7. Nenhum
  arquivo planejado está no gatilho. `playwright.config.ts` e `lighthouserc.json` não estão em
  nenhuma das duas listas e ficam fora do diff.
- **Incompleto:** o `openspec validate pagina-projetos --strict` **não foi rodado**: este agente não
  tem terminal. A decisão de REMOVED mais ADDED na `navegacao-publica` segue o motivo escrito pela
  change anterior, não conferido no validador. Os caracteres da Q3 e do host foram contados à mão.
  O corte de colunas da grade não foi lido do protótipo: fica para o dev (D4).

## Passagem para a `lancamento-r1`

Vale com a Q1 (a). O gestor leva esta lista ao briefing da `lancamento-r1`. Origem: decisões do
Gabriel no Portão 2 da `completar-ci-do-novo-fluxo` (Q10 (a) e Q11 (a), 23/11/2026), relatório
arquivado em `openspec/changes/archive/2026-11-23-completar-ci-do-novo-fluxo/relatorio.md`,
"Destinos que as decisões fixam". Os três primeiros arquivos estão na lista do gatilho da
`docs/SEGURANCA.md` §5, e por isso não entram nesta change, que fica só de tela (briefing desta
change, item 2).

A coluna "O que o registro diz" resume o achado de origem; o critério exato está no relatório
arquivado, no achado citado, e é de lá que a `lancamento-r1` o lê.

| # | Onde, na `main` `e31d49a` | O que o registro diz | Origem |
| --- | --- | --- | --- |
| 1 | `docs/PLANO-DE-DESENVOLVIMENTO.md:113`, linha 6 da R1 | Afirma como fato o que só valia depois do passo 7; o push verde se confirma na tarefa 1.1 desta change | R3-1 e I3 |
| 2 | `docs/SEGURANCA.md` §6, a linha do A1 em "Saíram da lista" | Afirma como fato o que só valia depois do passo 7 | R3-1 e I3 |
| 3 | `docs/SEGURANCA.md` §5, a frase das formas de sim ou não depois da sublista da Q8 | Ver o achado | R3-4 |
| 4 | `docs/SEGURANCA.md`, a atribuição "visto pelo Gabriel" do I3 na linha da Q12 (b) | Apontar onde está o registro, ou trocar a atribuição pela aprovação da proposta no Portão 1 | I4 do guardião |
| 5 | `openspec/specs/fundacao-e-ci/spec.md:245-249`, o cenário "Chave gravada com dois bytes por caractere" | O cenário, com o limite declarado | R3-2 |
| 6 | `.github/workflows/ci.yml:17` e `:219-220`, o comentário | Descreve a separação dos ambientes como fato antes do passo 7 | R3-1, parte do `ci.yml` (a Q11 (a) já o mandava para a `lancamento-r1`) |
| 7 | `tests/e2e/interruptor.spec.ts` e a spec `publicacao-do-site` | Derivar as rotas verificadas do interruptor da lista única, em vez da amostra fixa de quatro | Q4 (a) desta change |

A linha 7 só vale se a Q4 for (a). As ressalvas de código da Q10 (a) de lá já estão destinadas à
`lancamento-r1` pelo relatório arquivado, e não se repetem aqui.

## Prova do push da `completar-ci-do-novo-fluxo`

A escrever pelo líder técnico na tarefa 1.1 (`design.md`, D9).

## dev-frontend

- **Arquivos:** `<caminhos>` · **tokens novos:** <nome e origem, ou "nenhum">
- **Comandos:** `verificar` <código> · `npm test` <n/n> · `playwright` <n/n>
- **Melhorias de UI ou UX propostas:** <o que e por quê, ou "nenhuma">
- **Incompleto:** <o que, ou "nada">

## dev-dados

Não entra: a change não tem banco.

## guardiao-visual

- **Comparado:** <n> páginas × <larguras> · lado a lado em `openspec/changes/pagina-projetos/prints/`
- **Diferenças:** <n> — <n> adaptação aprovada · <n> correção obrigatória · <n> melhoria a
  aprovar · <n> defeito
- **Cada diferença, uma linha:** <onde · o que mudou · caso>
- **Não comparado:** <qual página e por quê, ou "nada">

## qa-acessibilidade

- **Cobertura:** <páginas> × <larguras>
- **Medições:** axe <n> violações · rolagem horizontal <n> larguras com defeito · alvos <n>
  medidos / <n> abaixo de 44 px · foco <n> / <n> sem foco visível
- **Verificação nova demonstrada falhando:** <qual, ou "nenhuma verificação nova">
- **Defeitos:** <arquivo · largura · o que> · **sem cobertura:** <o que, ou "nada">

## revisor

- **Veredito:** <aprovado | aprovado com ressalva | reprovado>
- **Conferiu:** <n> arquivos · <n> critérios de aceite · <n> regras
- **Achados:** <arquivo · o que está errado · regra violada, ou "nenhum">
- **Não conseguiu conferir:** <o que, ou "nada">

## guardiao-appsec

O guardião não escreve: o líder técnico registra o relatório em uma tela por passagem, com a lista
de achados inteira; a saída de comando e o aceite do Gabriel vão literais.

- **Veredito:** <BLOQUEADO | APROVADO COM RESSALVAS | APROVADO> · bloqueante <n> · alta <n> ·
  média <n> · baixa <n> · informativa <n> · conferência <completa | curta (AS-01 e AS-09)>
- **Achados:** <código · severidade · confiança · arquivo:linha · cenário · critério, ou "nenhum">
- **Pedidos de comando:** <Pn · AS-xx · comando · saída literal, mascarada · código de saída; ou
  Pn · AS-xx · recusado · motivo; ou "nenhum">
- **Riscos aceitos pelo Gabriel:** <código · achado · aceite literal do Gabriel · motivo · prazo ·
  change que resolve · data, ou "nenhum">

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum.

- **Arquivos fora do escopo, por agente:** <agente · arquivo, ou "nenhum em nenhuma passagem">
