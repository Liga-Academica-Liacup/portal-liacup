# Relatório — pagina-contato

Copiado de `openspec/changes/MODELO-relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/pagina-contato/` — `proposal.md`, `design.md`, `tasks.md`,
  `specs/pagina-contato/spec.md`, `specs/navegacao-publica/spec.md`, `specs/seo/spec.md` e este
  `relatorio.md` (o `.openspec.yaml` é do líder técnico) · **14 tarefas** de 15 (a 1.1 já feita pelo
  líder técnico) · requisitos nas specs delta: `pagina-contato` 5 ADDED; `navegacao-publica` 3
  MODIFIED; `seo` 1 MODIFIED (9 requisitos, nenhum removido).
- **Questões em aberto** (opções, custo e recomendação na proposta, "Questões para o Portão 1"):
  - Q1. Frase abaixo do título: (a) nenhuma; (b) a do protótipo, "Dúvidas sobre o processo
    seletivo, convites para eventos e parcerias com serviços de saúde.", registrada no §1.
    Recomendo (a).
  - Q2. Endereço de "Onde estamos": (a) o curto do rodapé; (b) o completo do §1 com "·" no lugar do
    travessão, 92 caracteres, com o teste contando 1 troca. Recomendo (b).
  - Q3. O lugar do formulário: (a) coluna única, a esquerda do protótipo; (b) título à esquerda e
    quadros à direita; (c) o quadro da borboleta à direita. Cartões lado a lado descartados.
    Recomendo (a). Os prints são do líder técnico (tarefa 1.3).
  - Q4. Descrição para buscadores: (a) frase com o @ e o e-mail, 129 caracteres; (b) frase com a
    sede, 137; (c) o Gabriel escreve. Recomendo (a), registrada no §1.
- **Classificação prevista do guardião:** **passo 1, checklist inteiro**, porque o
  `docs/SEGURANCA.md` entra no diff (linhas de origem dos prints e da cópia do Gmail em `public/`,
  tarefa 4.2) e está na lista do gatilho. Fora ele, todo arquivo previsto está na lista de tela
  (`design.md`, D7).
- **Incompleto:** o `openspec validate pagina-contato --strict` **não foi rodado**: este agente não
  tem terminal. Os caracteres das frases da Q2 e da Q4, do título e do host foram contados à mão. A
  frase da Q1 foi lida no `prototipo/Portal-LIACUP.html` por busca de texto. O corte de colunas, a
  largura da coluna e o tamanho do círculo não foram medidos no protótipo: ficam para o dev (D4).

## Evidência herdada da `pagina-projetos`

Escrita pelo líder técnico. Tarefa 1.1 (Q10 (b) da `pagina-projetos`). Evidência vinda da sessão
da `pagina-projetos`, 23/11/2026, colada pelo Gabriel no briefing desta change, transcrita literal:

P23 e produção:

| Comando | Código | Resultado |
| --- | --- | --- |
| Host da prévia, montado pela regra contra o painel | — | portal-liacup-git-feat-pagina-projetos-liacup1.vercel.app, igual letra por letra; 46 caracteres antes de .vercel.app |
| Commit da prévia, dito pelo Gabriel | — | b2572e6fcec925f93b4d1769bfbce5167947b147 = git rev-parse HEAD = ls-remote da branch |
| Forma da linha do .env, só por contagem | — | 1 linha com o nome · 0 fora da forma · curl 8.7.1 |
| P23, forma com o segredo, em /projetos | 0 | HTTP/1.1 200 OK, sem Location, X-Matched-Path: /projetos, X-Robots-Tag: noindex, X-Vercel-Cache: PRERENDER |
| Forma 3, segredo na árvore de trabalho | 1 | saída vazia |
| Forma 4, segredo no índice | 1 | saída vazia |
| Produção, curl -I https://www.liacup.com.br/ | 0 | 200, X-Matched-Path: /em-construcao |
| Produção, curl -I https://www.liacup.com.br/projetos | 0 | 307, Location: / |

Busca commit a commit e push #46:

| Comando | Código | Resultado |
| --- | --- | --- |
| conferir-ambiente-local --change pagina-projetos | 0 | 20 comparados · 20 iguais · 15 chaves do .git/config, 0 fora da lista |
| git rev-parse main e git ls-remote origin refs/heads/main | — | c12cf9b337d6ab70d02754593ba85bb65a5ca2a5 nos dois |
| Forma 2 do segredo, <rev> = fd31de0 | 1 | saída vazia |
| Forma 2 do segredo, <rev> = b2572e6 | 1 | saída vazia |
| API pública, jobs da #46 (id 45216646759, push do merge c12cf9b) | — | http 200 · jobs: 4 · success: 4 · Verificacoes 9 min 24 s · Build para a barreira da chave 54 s · Tipos do banco 46 s · Chave fora do pacote 17 s |
| API pública, implantações do chave-de-servico-da-main | — | 2, todas com ref: main (c12cf9b e e31d49a) |

Desvio: o merge do PR #25 (c12cf9b, 16:27 UTC) veio antes do P23 (16:38 UTC).

## Prova do push: execução #46

Escrita pelo líder técnico. Tarefa 1.1, 23/11/2026, 17:00:42 UTC. Pela API pública do GitHub, sem
autenticação e sem `gh`, `curl -q -sS --max-time 20 --proto =https` sobre
`https://api.github.com/repos/Liga-Academica-Liacup/portal-liacup` (R). JSON reduzido aos campos do
critério:

```
== GET R/actions/runs?per_page=6 · http 200
45216646759 #46 push main c12cf9b completed success tentativa 1 2026-11-23T16:27:05Z 2026-11-23T16:36:32Z
45214873733 #45 pull_request feat/pagina-projetos b2572e6 completed success tentativa 1 2026-11-23T16:17:46Z 2026-11-23T16:26:23Z
45185945480 #44 push main e31d49a completed success tentativa 1 2026-11-23T13:38:35Z 2026-11-23T13:47:26Z
45184520538 #43 pull_request chore/completar-ci-do-novo-fluxo 2138893 completed success tentativa 1 2026-11-23T13:30:02Z 2026-11-23T13:37:14Z
45099474006 #42 push main d7cc5c9 completed success tentativa 2 2026-11-23T02:18:45Z 2026-11-23T02:39:40Z
45095701421 #41 pull_request chore/ajustar-ci-ao-novo-fluxo e65e319 completed success tentativa 1 2026-11-23T01:38:30Z 2026-11-23T01:46:13Z
== GET R/actions/runs/45216646759/jobs · http 200
jobs: 4 · success: 4
Verificacoes · success · 9 min 24 s
Build para a barreira da chave · success · 0 min 54 s
Tipos do banco · success · 0 min 46 s
Chave fora do pacote · success · 0 min 17 s
== GET R/deployments?environment=chave-de-servico-da-main · http 200
implantações: 2 · refs: ["main"]
8004561196 main c12cf9b 2026-11-23T16:28:02Z
8000304899 main e31d49a 2026-11-23T13:39:56Z
== GET R/deployments?environment=segredos-da-main · http 200
implantações: 4 · refs: ["main"]
8004537203 main c12cf9b 2026-11-23T16:27:06Z
8000273315 main e31d49a 2026-11-23T13:38:36Z
7989009319 main d7cc5c9 2026-11-23T02:32:55Z
7988826856 main d7cc5c9 2026-11-23T02:18:46Z
```

- **A #44 está em `tentativa 1`:** o Re-run não aconteceu, como o Gabriel disse. A #46 é o push do
  merge da `pagina-projetos` (`c12cf9b`), com os quatro jobs verdes; os números batem com a
  evidência herdada acima.
- **Decisão do Gabriel, literal:** "Re-run da #44: não aconteceu. Vale como prova a execução #46, do
  push do merge da pagina-projetos: às 10:50 de 23/11 o Gabriel já via 1 segredo em cada ambiente,
  então a chave já tinha saído do segredos-da-main, e a #46 (16:27 UTC) rodou os quatro jobs
  verdes."
- **Palavra do Gabriel, não medida:** a saída da chave do `segredos-da-main` antes da #46. A API
  pública não lê segredos; ela mostra só que a #46 implantou nos dois ambientes, a partir da
  `main`.

## Prints da Q3 (tarefa 1.3)

Escrito pelo líder técnico. Os seis `prints/q3-opcao-{a,b,c}-{390,1280}.png` são esboços estáticos
para decisão, não telas do site. Foram gerados pelo líder técnico com um script Playwright
temporário, fora do repositório, **sobre o protótipo**: abre `prototipo/Portal-LIACUP.html` do
disco, vai a Contato pelo menu, e no DOM tira o formulário, tira a frase da faixa (Q1 (a)), troca os
espaços de imagem pela logo e pelo ícone do Gmail de `assets/`, tira as legendas (§6), troca
`liacup@unb.br` e o endereço pelos dados certos (endereço completo da Q2 (b)), corrige o rodapé e
tira a linha de demonstração dele; depois aplica a composição de cada opção. Cabeçalho, menu e
rodapé continuam os do protótipo (com Notícias, Materiais, Galeria e "Painel", que o site não tem):
o que se decide é só o corpo da página. Uma faixa escura no topo diz "ESBOÇO PARA DECISÃO, NÃO É O
SITE". Fontes carregadas nas 6 capturas (Caprasimo e Figtree, as do próprio protótipo); rolagem
horizontal 0 nas 6. Em 390 as três opções são iguais, como a proposta prevê: os três PNG de 390 têm
o mesmo sha256 (`c7c068a5faea38ee…`).

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

- **Comparado:** <n> páginas × <larguras> · lado a lado em `openspec/changes/pagina-contato/prints/`
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
- **Passagem do `especificador` (23/11, antes do Portão 1):** 7 arquivos novos, todos em
  `openspec/changes/pagina-contato/`; nenhum fora do escopo. `git diff --cached --name-only`
  vazio; `HEAD` `c12cf9b`, `rev-list --all` 120 e `ls-remote origin main` `c12cf9b`, iguais antes e
  depois; `conferir-ambiente-local --change pagina-contato` com código 0 antes e depois;
  `openspec validate pagina-contato --strict` com código 0 ("Change 'pagina-contato' is valid").
