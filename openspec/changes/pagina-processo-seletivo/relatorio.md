# Relatório — pagina-processo-seletivo

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** em `openspec/changes/pagina-processo-seletivo/`:
  - `proposal.md`, `design.md` e `tasks.md`;
  - `specs/pagina-processo-seletivo/spec.md`: nova, 6 requisitos e 15 cenários;
  - `specs/seo/spec.md`: nova, 5 requisitos e 11 cenários;
  - `specs/navegacao-publica/spec.md`: 1 REMOVED, 1 ADDED e 4 MODIFIED, com 26 cenários;
  - `specs/equipe-de-agentes/spec.md`: 1 ADDED, com 3 cenários.

  No total, **13 requisitos ADDED, 4 MODIFIED e 1 REMOVED, com 55 cenários**, e **15 tarefas, sem
  folga**, com o item de SEO dentro.
- **Q4 (c) da `layout-e-hero`:** entrou como item herdado, na tarefa 1.2, e cabe na conta. Por isso
  não virou Qn.
- **Divisão pronta**, se uma correção acrescentar tarefa: o SEO inteiro (tarefas 2.1 a 2.3 e as
  partes de SEO da 3.2 e da 3.3) vai para a `pagina-sobre-e-equipe`.
- **Questões em aberto** (opções, custos e caracteres no `design.md`, "Open Questions"):
  - Q1 · o texto do aviso de inscrições fechadas. Recomendo (b): "As inscrições estão fechadas.
    Acompanhe a Liga no Instagram @liacup.unb para saber quando abre o próximo processo seletivo."
    É texto fora do documento, e entra por emenda do gestor;
  - Q2 · o estado "inscrições abertas". Recomendo (a), não fazer agora: custaria mais 3 tarefas,
    tiraria o SEO, e falta o link do edital;
  - Q3 · os títulos e sobretítulos das seções. Recomendo (a): os do protótipo, com "Cronograma"
    trocado por "Etapas";
  - Q4 · as notas de fonte nas respostas do §6. Recomendo (a), não vão ao ar;
  - Q5 · os metadados da raiz. Recomendo (a), a raiz intacta;
  - Q6 · o título da Início e as descrições. Recomendo (a), com 64 caracteres no título e
    descrições de 129 e 155, as primeiras frases do §2.0 e do §5.2;
  - Q7 · o SEO no modo não publicado. Recomendo (a), o mínimo só no publicado;
  - Q8 · o host da prévia no pedido com o segredo. Recomendo (b), o endereço de branch exato.
- **Desvios e achados:**
  - a página fica fora do menu e das colunas do rodapé, como no gabarito e na `REFERENCIA-VISUAL.md`
    §1. O briefing só diz que ela "entra na lista";
  - `publicacao-do-site`, `fundacao-e-ci` e `pagina-inicial` não mudam: os cenários continuam
    verdadeiros (D2);
  - a regra do `noindex` foi estreitada: vale só para o endereço de prévia, marcado pela Vercel. Uma
    página que se declara não indexável reprova, porque senão a regra esconderia a falha mais cara
    de SEO;
  - a tabela do interruptor no README ainda diz que a raiz publicada mostra a página em construção,
    o que é falso desde a `layout-e-hero`. A correção entrou na tarefa 1.5;
  - a numeração dos `PADROES-DE-CODIGO.md` é a do briefing: a seção 11 é a próxima livre.
- **Incompleto:**
  - os caracteres das descrições e dos títulos foram contados à mão, e não por comando;
  - não li o ADR-0006, a tag `arquivo/F03-layout-base` nem o `paginas-publicas.spec.ts` e o
    `menu-por-teclado.spec.ts` inteiros;
  - não confirmei duas coisas que a primeira execução confirma: que o `curl -H @-` e o
    `git grep -f -` leem da entrada padrão no Git Bash do Gabriel, e que a auditoria `canonical` do
    Lighthouse aceita um canonical em outro host. As duas estão como risco no `design.md`;
  - não medi o tamanho da fonte do botão de destaque no protótipo (tarefa 1.5);
  - não rodei `openspec validate`, porque não rodo comando.

## P23 e Q9 da `layout-e-hero` (pedido do briefing)

Registro do que ficou fora do relatório arquivado da `layout-e-hero`, com o que se sabe pelo
briefing desta change.

- **P23 da `layout-e-hero`:** `curl -q -sS -I --max-time 20 --proto =https '<prévia da change>/'`
  (AS-15). Rodou depois do PR e bateu no login da Vercel. Mirou o deployment de produção, que tem o
  interruptor desligado, e não a prévia da branch. AS-15 ficou **não verificado** naquela change.
- **Q9 da `layout-e-hero`:** decisão do Gabriel registrando que o AS-15 não foi verificado lá.
  **Texto literal da Q9: a pedir ao Gabriel no Portão 1.** O texto não está no repositório: o
  líder técnico buscou "Q9" em `openspec/` e `docs/` sem achar.
- **Nesta change:** o P23 passa a rodar na prévia da branch, com o cabeçalho de bypass (`design.md`,
  D11, e Q8). A saída vai para a seção do `guardiao-appsec` desta change, depois de a Vercel gerar a
  prévia.

## dev-frontend

- **Arquivos:** `<caminhos>` · **tokens novos:** <nome e origem, ou "nenhum">
- **Comandos:** `verificar` <código> · `npm test` <n/n> · `playwright` <n/n>
- **Melhorias de UI ou UX propostas:** <o que e por quê, ou "nenhuma">
- **Incompleto:** <o que, ou "nada">

## dev-dados

Não entra: a change não tem banco nem tabela.

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
