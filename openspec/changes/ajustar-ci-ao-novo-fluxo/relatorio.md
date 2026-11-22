# Relatório — ajustar-ci-ao-novo-fluxo

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/ajustar-ci-ao-novo-fluxo/proposal.md`, `design.md`, `tasks.md`,
  `specs/fundacao-e-ci/spec.md` e `specs/equipe-de-agentes/spec.md` · 7 requisitos: na
  `fundacao-e-ci`, 1 modificado e 5 novos; na `equipe-de-agentes`, 1 novo · 11 tarefas.
- **Divisão:** com o briefing inteiro seriam 21 tarefas ou mais. Aplico a divisão que o briefing
  prevê. Ficam aqui o item 1 e a busca de segredo. Vão para a `completar-ci-do-novo-fluxo`: o
  `openspec validate` no CI, os prints como anexo, as ressalvas A2 a A7 e as 7 do revisor, e a prova
  do push (Q5).
- **Questões em aberto** (as opções e o custo de cada uma estão na proposta):
  - Q1, a forma do LB-02: recomendo (a), job só no push para a `main` com os segredos num ambiente
    restrito a ela;
  - Q2, o LB-09: recomendo (b), `papeis-da-diretoria-no-banco`;
  - Q3, a ferramenta da busca: recomendo (b), script próprio com os 5 formatos da Q15 e o token
    clássico do GitHub;
  - Q4, a auditoria de base: recomendo (b), corrigir a frase da §5;
  - Q5, a prova depois do push: recomendo (a), Portão 2 com a execução do PR, e o push na change
    seguinte;
  - Q6, a versão das ações: recomendo (a), o último patch da `v4`.
- **Pontos do briefing que não cabem como estão:**
  - a "execução real no GitHub" do job com segredo só existe depois do merge (Q5);
  - mover os tipos e a barreira 3 para depois do merge pesa contra a decisão 3 do PLANO (Q1);
  - como a busca roda antes do commit, ela precisa cobrir também a árvore de trabalho (D5);
  - a frase da §5 sobre a auditoria de base contradiz a spec (Q4).
- **Incompleto:** os itens abaixo não foram conferidos por mim, porque não tenho rede nem terminal:
  - o sha das ações;
  - o formato de 82 caracteres do token do GitHub, que tirei da memória do formato publicado e da
    regra do gitleaks, e o dev confere;
  - se o job com ambiente pede permissão além de `contents: read`;
  - o número de arquivos da `main` hoje;
  - o tempo do job com segredo, que é estimativa minha, e não medição;
  - o `openspec validate` destes artefatos, que o líder técnico roda.

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
