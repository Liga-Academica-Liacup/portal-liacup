# Relatório — prototipo-no-repositorio

Copiado de `openspec/changes/MODELO-relatorio.md`. Cada agente escreve a própria seção; a do agente
que não entrou recebe uma linha dizendo por quê. Número quando houver número. Incompleto declarado
incompleto.

## especificador

- **Artefatos:** `openspec/changes/prototipo-no-repositorio/proposal.md`,
  `specs/referencia-visual/spec.md` (capacidade nova), `design.md`, `tasks.md` · 5 requisitos,
  9 cenários · 15 tarefas (o teto)
- **Questões em aberto:** Q1 (10 ou 11 páginas: Processo seletivo existe no protótipo e ficou fora
  do briefing; recomendo incluir) · Q2 (RP-13: manter versionados com emenda em
  `PADROES-DE-CODIGO.md` §8.1, que é desvio do briefing; não versionar; ou declarar gabarito, não
  artefato; recomendo a emenda) · Q3 (menu aberto sobre qual página e em qual recorte; recomendo
  repetir o print do gestor: Contato, área visível 390 × 844). Artefatos redigidos com (a) nas
  três, e cada uma diz o que muda se a resposta for outra
- **Incompleto:** não rodei `openspec instructions` antes de cada artefato nem
  `openspec validate --strict` ao final: este agente não tem ferramenta de terminal. A estrutura
  seguiu as changes arquivadas, que passaram no `validate --strict`. A validação fica para o líder
  técnico. A altura da janela em 1280 px (800) não está no briefing e foi fixada no `design.md` D4
  como detalhe de implementação, não como requisito
- **Rodada 2 (Portão 1):** aplicadas Q1 = b, Q2 = a, Q3 = a, Q4 = a e as emendas E1 a E3 —
  21 → 23 em tudo; D6 com o texto final e o lugar exato em PADROES §8.1; PNG estranho vira falha
  dentro da tarefa 1.5; proposta reduzida a cerca de 700 palavras. Agora são 5 requisitos,
  11 cenários e 15 tarefas. Questões em aberto: nenhuma. Continuo sem rodar o `validate`

## dev-frontend

- **Arquivos:** `scripts/prints-do-prototipo.mjs` (novo) · `package.json` (uma linha,
  `prints:prototipo`) · `prototipo/prints/` (21 ` M`, 2 `??`: `processo-seletivo-1280.png` e
  `-390.png`) · `prototipo/README.md` (novo, 5 linhas) · **tokens novos:** nenhum
- **Comandos:** `verificar` 0 (artefatos 259 rastreados, 0 indevidos) · `npm test` 71/71 ·
  `playwright` 84/84 · `npm run prints:prototipo` 0, `gerados: 23 de 23`, `estranhos: 0` ·
  duas execuções seguidas: mesmos 23 nomes, 23 de 23 byte a byte iguais · dependências diretas
  22 antes e depois, `package-lock.json` sem diferença · protótipo com o mesmo sha256
- **Tarefa 1.5:** título trocado deu `gerados: 21 de 23` (faltou `galeria-1280.png` e
  `galeria-390.png`), código 1 — a tarefa esperava `22 de 23`. Uma página sem título não gera
  nenhum dos dois prints dela, então 22 só sairia tirando o print em 390 de página não
  conferida. Comportamento mantido; a divergência é da expectativa da tarefa, não da spec
- **Fora do design, para conferir:** o ponteiro sai de cima do link clicado
  (`mouse.move(0, 0)`), senão `processo-seletivo-1280.png` mostrava o botão de destaque em
  hover. A folha de estilo do D4 tira a inclinação de −8° das borboletas, que fica em 0°
- **Melhorias de UI ou UX propostas:** nenhuma de tela. Proposta para `verificar-navegador.mjs`
  (fora do meu escopo): a pilha de erro crua do Node aparece antes da mensagem em português,
  porque o filho herda o stderr
- **Incompleto:** nada das tarefas 1.1 a 3.1. Lado a lado antigo × novo (2.2) fica no
  scratchpad, fora do repositório, como pedido

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

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum.

- **Arquivos fora do escopo, por agente:** <agente · arquivo, ou "nenhum em nenhuma passagem">
