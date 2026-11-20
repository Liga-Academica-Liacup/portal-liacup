# Relatório — auditoria-de-base-appsec

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/auditoria-de-base-appsec/proposal.md`, `design.md`,
  `tasks.md` e `specs/equipe-de-agentes/spec.md` · **5 requisitos** novos em `equipe-de-agentes`,
  0 modificados, 15 cenários. A spec passa de 17 para 22 requisitos · **15 tarefas**. A parte 6 do
  briefing saiu: com ela seriam 16 (D12)
- **Fronteira:** `equipe-de-agentes`, como na `montar-guardiao-appsec`. As regras do guardião já
  moram nela. A parte 6 não virou requisito, porque é uma recomendação de uma vez só (D1)
- **Questões em aberto:** Q1 a Q8, em `design.md`, seção "Questões para o Portão 1". Cada uma tem
  opções, custo e recomendação. Recomendo:
  - Q1 (b): "o checklist", sem intervalo;
  - Q2 (c): só `npm audit --omit=dev`;
  - Q3 (b): contagem por pasta;
  - Q4 (a) com (i): tabela no `SEGURANCA.md`, e binário fora dela bloqueia;
  - Q5 (b): declaração do `openspec update` mais `openspec --version`;
  - Q6 (a): entrega intermediária para o aceite, antes da revisão do diff;
  - Q7 (a): os cinco blocos do briefing;
  - Q8 (b): o guardião diz a release, e o líder técnico agrupa em change.
- **Achado no levantamento:** "AS-01 a AS-16" aparece em 7 lugares, não em 6. Falta na contagem
  do líder técnico a linha `.claude/agents/guardiao-appsec.md:3`, a `description`.
- **Incompleto:**
  - a origem de `assets/` (8 PNG) e de `public/logo-liacup-256.png` não está escrita, e não a
    inventei: depende do Gabriel (Q4);
  - não medi o que a D6 deixa para a tarefa 2.2: se `git grep -a` vence o atributo `binary`, e se
    `git log -S` acha texto em binário;
  - não rodei `openspec validate`, porque não rodo comando.

## dev-frontend

- **Arquivos:** `<caminhos>` · **tokens novos:** <nome e origem, ou "nenhum">
- **Comandos:** `verificar` <código> · `npm test` <n/n> · `playwright` <n/n>
- **Melhorias de UI ou UX propostas:** <o que e por quê, ou "nenhuma">
- **Incompleto:** <o que, ou "nada">

## dev-dados

- **Migrações:** `<números>` · **tabelas:** `<nomes>`
- **Acesso por linha:** `banco:rls` <código> · políticas: <n permissões, n recusas>
- **Tipos:** `banco:tipos:check` <código>
- **Incompleto:** <o que, ou "nada">

## guardiao-visual

- **Comparado:** <n> páginas × <larguras> · lado a lado em `openspec/changes/<change>/prints/`
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

O guardião não escreve: o líder técnico transcreve o relatório literal, uma subseção por passagem.

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
