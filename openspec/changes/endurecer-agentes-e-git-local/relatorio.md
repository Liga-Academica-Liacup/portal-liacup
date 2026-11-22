# Relatório — endurecer-agentes-e-git-local

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** em `openspec/changes/endurecer-agentes-e-git-local/`:
  - `proposal.md`, `design.md` (D1 a D14) e `tasks.md`;
  - `specs/equipe-de-agentes/spec.md`: 5 MODIFIED e 4 ADDED, com 43 cenários;
  - `specs/camada-de-dados/spec.md`: 1 ADDED, com 3 cenários.

  No total, **10 requisitos (5 ADDED e 5 MODIFIED) e 46 cenários**, e **14 tarefas, com uma de
  folga**. Divisão pronta, se passar de 15: as tarefas 4.1 e 5.1 (itens 4 e 5 da proposta) vão para
  a `ajustar-ci-ao-novo-fluxo`.
- **Questões em aberto:** onze, todas na proposta, com opções, custo e recomendação. Q1 a Q7 vêm do
  briefing; Q8 a Q11 são minhas:
  - Q1 · forma da barreira. Recomendo (c), gancho mais regras de negação;
  - Q2 · `git fetch`. Recomendo (b), recusado;
  - Q3 · `gh`. Recomendo (b), todo recusado;
  - Q4 · `AGENTS.md`. Recomendo (c), `.gitignore` mais `agentRules: false`;
  - Q5 · LB-14. Recomendo (a), esta proposta é a decisão;
  - Q6 · a precondição da §5. Recomendo (a), igual à `main` ou ao registrado como decidido;
  - Q7 · LB-24. Recomendo (a), o ADR intocado;
  - Q8 · comando que só cita uma escrita no Git. Recomendo (a), recusado;
  - Q9 · escrita em `.git/` pelas ferramentas de arquivo. Recomendo (b), negada;
  - Q10 · `.git/config`. Recomendo (a), lista de chaves permitidas;
  - Q11 · gatilhos que não são caminho e a lista de tela. Recomendo (a), listas do D8 mais a busca
    por `process.env` e `NEXT_PUBLIC_`.
- **Desvios do briefing, com motivo:**
  - o `-c` do `git` é recusado, e não pulado. `-c core.pager=…` roda programa a partir de qualquer
    leitura (D2);
  - a conferência roda com `node` direto, e não por `npm run`, porque o `npm` lê o `.npmrc` e roda
    scripts `pre` antes dela. O `package.json` não muda (D4);
  - o teste do ambiente usa `SEGREDO_FORA_DA_LISTA`, e não `VERCEL_AUTOMATION_BYPASS_SECRET`. Com
    o nome real, o teste leria a variável pelo nome e quebraria a conferência da §5 que exige
    código 1 (D7);
  - o `.gitignore` ganha só `AGENTS.md`. Os outros arquivos do D6 são pegos pela conferência.
- **Achado:** além dos três pontos do I-01, `scripts/verificar-chave-de-servico.mjs:45` e
  `scripts/verificar-tipos-do-banco.mjs:56` também leem `process.env[…]` por nome em constante.
  Entram no texto novo (D9).
- **Incompleto:**
  - não rodei `openspec validate`, porque não tenho terminal. As descrições de requisito foram
    contadas à mão, todas abaixo de 500 caracteres;
  - fica para o `dev-frontend` medir: o campo de entrada do `mcp__terminal__run_in_terminal`, se a
    ferramenta `PowerShell` aceita regra por prefixo, e a sintaxe de caminho de `Edit` e `Write`
    em `.git/`;
  - fica para o Gabriel, no Portão 2: o valor do `remote.origin.url` que a conferência espera, que
    não li e não inventei;
  - a linha 220 do protótipo (LB-26) foi tirada do relatório da auditoria, e não relida.

## dev-frontend

- **Arquivos:** `<caminhos>` · **tokens novos:** <nome e origem, ou "nenhum">
- **Comandos:** `verificar` <código> · `npm test` <n/n> · `playwright` <n/n>
- **Melhorias de UI ou UX propostas:** <o que e por quê, ou "nenhuma">
- **Incompleto:** <o que, ou "nada">

## dev-dados

Não entra: a change não tem banco nem tabela.

## guardiao-visual

Não entra: a change não tem tela. A raiz não publicada é comparada pixel a pixel pelo
`qa-acessibilidade` (`design.md`, D11).

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
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum. Nesta change, os
escopos nominais são os do `design.md`, D13.

- **Arquivos fora do escopo, por agente:** <agente · arquivo, ou "nenhum em nenhuma passagem">
