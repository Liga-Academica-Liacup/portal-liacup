# Relatório — pagina-processo-seletivo

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** em `openspec/changes/pagina-processo-seletivo/`:
  - `proposal.md`, `design.md` e `tasks.md`;
  - `specs/pagina-processo-seletivo/spec.md`: nova, 6 requisitos e 17 cenários;
  - `specs/seo/spec.md`: nova, 5 requisitos e 13 cenários;
  - `specs/navegacao-publica/spec.md`: 1 REMOVED, 1 ADDED e 4 MODIFIED, com 26 cenários;
  - `specs/equipe-de-agentes/spec.md`: 1 ADDED, com 5 cenários.

  No total, **13 requisitos ADDED, 4 MODIFIED e 1 REMOVED, com 61 cenários**, e **15 tarefas, sem
  folga**, com o item de SEO dentro. As contagens são as de depois da emenda do Portão 1; antes
  dela eram 55 cenários.
- **Q4 (c) da `layout-e-hero`:** entrou como item herdado, na tarefa 1.2, e cabe na conta. Por isso
  não virou Qn.
- **Divisão pronta**, se uma correção acrescentar tarefa: o SEO inteiro (tarefas 2.1 a 2.3 e as
  partes de SEO da 3.2 e da 3.3) vai para a `pagina-sobre-e-equipe`.
- **Questões em aberto:** nenhuma depois do Portão 1. Abaixo, o que levei ao portão, com as minhas
  recomendações; as opções, os custos e os caracteres estão no `design.md`, "Open Questions":
  - Q1 · o texto do aviso de inscrições fechadas. Recomendo (b): "As inscrições estão fechadas.
    Acompanhe a Liga no Instagram @liacup.unb para saber quando abre o próximo processo seletivo."
    Era texto fora do documento;
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

### Emenda depois do Portão 1 (21/11/2026)

Aplica as decisões do Gabriel: Q1 (b), Q2 (a) a Q7 (a), Q8 (b) com o time `liacup1`, e a Q9 da
`layout-e-hero` (a). Nenhuma tarefa nova: continuam 15.

- **`docs/conteudo-institucional.md`:** uma inserção só, no §5.1, logo depois do parágrafo "Quando
  não houver processo seletivo aberto…". Entrou o aviso da Q1 (b), com a origem "decisão do Gabriel
  em 21/11, Q1 da pagina-processo-seletivo", com autorização expressa do Gabriel. Nenhuma outra
  linha mudou.
- **`proposal.md`:**
  - o item 1 traz o aviso exato, os títulos e sobretítulos da Q3 (a) e as respostas sem as notas de
    fonte (Q4 (a));
  - o item 3 tira o "salvo decisão", pela Q2 (a);
  - o item 6 traz o host da Q8 (b), e o item 7 os títulos e as descrições da Q6 (a) e o SEO só no
    publicado (Q7 (a));
  - seção nova, "Decisões do Portão 1", com a letra de cada decisão e onde ela entrou;
  - o fora de escopo diz que o estado aberto fica fora pela Q2 (a);
  - no Impact: o D13 no lugar do D10, o `lighthouserc.json` sem mudança e a linha dos dois
    documentos tocados no Portão 1.
- **`specs/pagina-processo-seletivo`:**
  - o cenário da faixa exige o aviso palavra por palavra, com a origem no §5.1, e o nome acessível
    do link com o texto visível;
  - cenário novo dos títulos e sobretítulos (Q3 (a)), no lugar da remissão à Qn;
  - o requisito do texto inclui o aviso e tira as notas de fonte, com cenário novo (Q4 (a)).
- **`specs/seo`:**
  - cenário novo com os títulos e as descrições da Q6 (a);
  - cenário novo: a raiz não publicada imprime o SEO sem reprovar (Q7 (a)).
- **`specs/equipe-de-agentes`:** o requisito passa a dizer que o host é conferido letra por letra e
  que o segredo vai pela entrada padrão. Os cenários:
  - novos: o host exato, com `liacup1` e o host desta change; o host cortado pela Vercel, com
    recusa; e a variável ausente, em que o líder técnico para e avisa;
  - a busca do valor usa a mesma extração e mantém a regra do valor vazio.
- **`design.md`:**
  - D4 e D5 com o aviso, os títulos, a Q2 (a) e a Q4 (a);
  - D8 com a regra das notas de fonte no teste;
  - D11 com a forma do Gabriel (`{ printf …; sed … | tr -d '\r\n'; printf '\n'; } | curl … -H @-`),
    o host exato, a recusa por corte, a regra da variável ausente, os fatos medidos (1 linha, 0
    aspas, 0 `\r`) e as buscas com a mesma extração;
  - D13 com as duas inserções do Portão 1;
  - o risco do `canonical`: o dev para e o líder técnico traz o caso como Qn nova;
  - as fontes do texto atualizadas;
  - Q1 a Q8 marcadas como decididas, sem apagar as opções.
- **`tasks.md`:**
  - o "Antes do apply" passa a "Já feito no Portão 1";
  - a 1.3 confere o aviso exato e os títulos;
  - a 2.2 confere os títulos de SEO;
  - a 2.3 imprime o SEO da raiz não publicada, e diz o que fazer se o `canonical` falhar;
  - a 3.1 inclui o aviso e tira as notas de fonte;
  - a 4.1 traz a forma do Gabriel, o host, a regra da variável ausente e mais um `grep`;
  - o P23 do follow-up traz o host desta change.
- **Incompleto da emenda:** nada novo. Os itens acima continuam valendo.

## P23 e Q9 da `layout-e-hero` (pedido do briefing)

Registro do que ficou fora do relatório arquivado da `layout-e-hero`, com o que se sabe pelo
briefing desta change.

- **P23 da `layout-e-hero`:** `curl -q -sS -I --max-time 20 --proto =https '<prévia da change>/'`
  (AS-15). Rodou depois do PR e bateu no login da Vercel. Mirou o deployment de produção, que tem o
  interruptor desligado, e não a prévia da branch. AS-15 ficou **não verificado** naquela change.
- **Q9 da `layout-e-hero`:** decisão do Gabriel sobre o AS-15 não verificado lá. Foi decidida
  (a), e o texto literal está transcrito na seção "Decisões do Gabriel no Portão 1".
- **Nesta change:** o P23 passa a rodar na prévia da branch, com o cabeçalho de bypass, no host
  `portal-liacup-git-feat-pagina-processo-seletivo-liacup1.vercel.app` (`design.md`, D11, e Q8
  (b)). A saída vai para a seção do `guardiao-appsec` desta change, depois de a Vercel gerar a
  prévia.

## Decisões do Gabriel no Portão 1

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel de 21/11/2026. A
numeração Q1 a Q8 é a do Portão 1 desta change; a Q9 é a da `layout-e-hero`.

**Veredito, literal:** "Portão 1 da pagina-processo-seletivo: aprovado. Registre cada decisão no
relatorio.md com o texto literal."

**Q1 a Q8, literal:**

> Q1 (b): "As inscrições estão fechadas. Acompanhe a Liga no Instagram @liacup.unb para saber quando abre o próximo processo seletivo."
> Q2 (a). Q3 (a). Q4 (a). Q5 (a). Q6 (a). Q7 (a).
> Q8 (b). O slug do time é liacup1. Host esperado nesta change: portal-liacup-git-feat-pagina-processo-seletivo-liacup1.vercel.app (55 caracteres antes de .vercel.app). A conferência compara letra por letra. Se a Vercel cortar o rótulo (acima de 63), a conferência recusa, o P23 para e você me pede o host exato daquela change.

**Q9 da `layout-e-hero`, literal:**

> Q9 da layout-e-hero, decisão (a), texto literal: "Q9: fique com a (a). O AS-15 fica registrado como não verificado na layout-e-hero. A correção entra na próxima change, para o teste de prévia não falhar de novo nas changes seguintes."

**Ajustes, literal:**

> Ajustes, sem tarefa nova (o total continua 15):
> 1. O texto da Q1 entra no docs/conteudo-institucional.md pelo especificador, nesta change, no §5.1, logo depois do parágrafo "Quando não houver processo seletivo aberto", com a origem "decisão do Gabriel em 21/11, Q1 da pagina-processo-seletivo". Não é emenda do gestor.
> 2. A forma do P23 na lista fechada do SEGURANCA.md lê só a linha do segredo, tira o \r do fim (o .env é do Windows), manda o cabeçalho pela entrada padrão e não usa -v. Algo nesta linha:
>    { printf 'x-vercel-protection-bypass: '; sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n'; printf '\n'; } | curl -q -sS -I --max-time 20 --proto =https -H @- "https://<host>/"
>    Se a variável não existir no .env, pare e diga. Não procure o segredo em outro lugar.
> 3. Se a auditoria canonical do Lighthouse falhar por medir liacup.com.br em localhost, pare e traga como Qn. Não desligue a auditoria sem decisão.

**Feito pelo líder técnico no Portão 1:**

- `docs/REFERENCIA-VISUAL.md` §7: linha nova com os títulos e sobretítulos da Q3 (a).
- Conferido, só por contagem e sem ler o valor: o `.env` tem 1 linha que começa com
  `VERCEL_AUTOMATION_BYPASS_SECRET=`, 0 com aspas no começo do valor e 0 com `\r`; o `.env` está no
  `.gitignore` (linha 10). O host da Q8 tem 55 caracteres antes de `.vercel.app` (`wc -c`).
- Conferido: o `git grep -c -a -F -f - HEAD` lê o padrão da entrada padrão no Git Bash (git
  2.45.1): padrão inexistente deu código 1 com saída vazia; `Secretaria` deu
  `HEAD:docs/conteudo-institucional.md:5`, código 0. O `curl` é o 8.7.1, que aceita `-H @-`.

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
