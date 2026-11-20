# Relatório — layout-e-hero

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/layout-e-hero/proposal.md`, `design.md`, `tasks.md`,
  `specs/navegacao-publica/spec.md` (nova, 5 requisitos, 19 cenários),
  `specs/pagina-inicial/spec.md` (nova, 1 requisito, 5 cenários) e `specs/fundacao-e-ci/spec.md`
  (REMOVED "Página provisória no ar" e ADDED "Página provisória enquanto o site não está
  publicado", 5 cenários) · **7 requisitos ADDED e 1 REMOVED, 29 cenários** · **15 tarefas**, sem
  folga
- **Ajuste do líder técnico, 1ª rodada:** `openspec validate --strict` recusou o MODIFIED, porque
  ele largava o cenário "A raiz com o site publicado, antes da página inicial". O requisito passou a
  REMOVED mais ADDED com nome novo, e o conteúdo não mudou. A Q2 foi refeita sobre os seis esboços
  de `prints/`, e a recomendação passou de (a) para (b), com o motivo no `design.md`
- **Cabe numa change.** Se uma correção do Portão 1 acrescentar tarefa, a divisão pronta é:
  `layout-publico` (lista, cabeçalho, menu, rodapé, raiz publicada, verificações: tarefas 1.1 a
  1.6 e 2.1 a 3.3) e `hero-da-inicial` (tarefa 1.7, Q1 e Q2, e o lado a lado do hero)
- **Desvios do briefing:**
  - o cenário "A raiz com o site publicado, antes da página inicial" mora em `fundacao-e-ci`, não
    em `publicacao-do-site`; a `publicacao-do-site` não muda (D2);
  - achado meu: o cenário "Visitante abre o endereço do portal" também precisa mudar, porque
    afirma "Portal em construção" na raiz sem dizer o modo (D2);
  - o "Painel da diretoria" do rodapé do protótipo também sai, além do "Painel" do cabeçalho
    (`REFERENCIA-VISUAL.md` §4);
  - "Processo seletivo sempre visível" (`REFERENCIA-VISUAL.md` §4) cede ao princípio 8 da
    constitution até a change 2;
  - a conferência de domínio externo passa a cobrir a raiz não publicada, que só a tinha porque a
    3000 mostrava a mesma página (D7, item 5);
  - o ano do rodapé é o da compilação, e não "2026" escrito (D5); se o Gabriel preferir o número
    fixo, é trocar uma linha
- **Para o gestor:** a tabela da R0 no PLANO §7 ainda dá à `ajustar-ci-ao-novo-fluxo` a "cobertura
  de e2e e Lighthouse derivada da lista de páginas", que esta change faz
- **Questões em aberto:** Q1 (parágrafo do hero), Q2 (espaço da foto), Q3 (linha de endereço do
  rodapé), com opções, custo e recomendação no `design.md`
- **Incompleto:**
  - não li os arquivos da tag `arquivo/F03-layout-base`, só os cito;
  - não medi o ponto de troca do cabeçalho no protótipo nem o contraste do lema no tamanho real:
    ficam para as tarefas 1.4 e 2.1;
  - a altura de cerca de 265 px do quadro em 390 px, citada na Q2, foi lida no esboço, não medida;
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
