# Relatório — pagina-sobre-e-equipe

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/pagina-sobre-e-equipe/proposal.md`, `design.md`, `tasks.md`,
  `specs/pagina-sobre/spec.md`, `specs/pagina-equipe/spec.md`, `specs/navegacao-publica/spec.md`,
  `specs/publicacao-do-site/spec.md`, `specs/seo/spec.md` · 16 requisitos (10 ADDED, 5 MODIFIED,
  1 REMOVED), 52 cenários · 14 tarefas. Não divide.
- **Questões em aberto:** Q1 a Q10, no `design.md`, "Open Questions": Q1 nome da liga (rec. b);
  Q2 faixa do topo (rec. b nas duas); Q3 forma dos objetivos, com prints (rec. a); Q4 títulos de
  seção (rec. a); Q5 docentes nas duas páginas (rec. a); Q6 cargo da Kerolyn (rec. b); Q7 círculo
  da foto (rec. a); Q8 fundadores (rec. a); Q9 descrições de SEO (rec. a nas duas); Q10 nota de
  fonte do §2.4 (rec. a).
- **Achados fora do briefing:** a spec `publicacao-do-site` pede 404 para `/sobre` publicado, e
  fica falsa: muda nesta change, e ela está na lista do gatilho, então o guardião faz o checklist
  inteiro; o "Conheça a Liga" aparece sozinho no hero quando `/sobre` entra na lista.
- **Incompleto:** não rodei `openspec instructions` nem `openspec validate --strict` (sem
  terminal nesta passagem); o formato segue a change arquivada `pagina-processo-seletivo`. Os
  prints da Q3 não existem: o líder técnico os gera. As contagens de caracteres são à mão.

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
- **Passagem do `especificador` (22/11, antes do Portão 1):** 10 arquivos novos, todos em
  `openspec/changes/pagina-sobre-e-equipe/`; nenhum fora do escopo. `git diff --cached --name-only`
  vazio; `HEAD` `6cc85a6`, `rev-list --all` 104 e `ls-remote origin main` `6cc85a6`, iguais antes e
  depois; `conferir-ambiente-local --change pagina-sobre-e-equipe` com código 0 antes e depois;
  `openspec validate pagina-sobre-e-equipe --strict` com código 0.
- **Prints da Q3, origem:** os seis `prints/q3-opcao-{a,b,c}-{390,1280}.png` são esboços estáticos
  para decisão, não telas do site. Foram gerados pelo líder técnico com um script Playwright fora
  do repositório: HTML com o texto do §2.3 ao §2.6 sem a nota da Q10, cores do `tokens.css` e
  Caprasimo e Figtree do Google Fonts, só no esboço. Fontes carregadas e nenhuma rolagem horizontal
  nas 6 capturas. Uma faixa escura no topo de cada print diz "ESBOÇO PARA DECISÃO, NÃO É O SITE".
  Os prints da Q7, que eram opcionais, não foram gerados.
