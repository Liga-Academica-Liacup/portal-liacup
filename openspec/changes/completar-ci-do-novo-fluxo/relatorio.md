# Relatório — completar-ci-do-novo-fluxo

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/completar-ci-do-novo-fluxo/proposal.md`, `design.md`,
  `tasks.md`, `specs/fundacao-e-ci/spec.md` e `specs/equipe-de-agentes/spec.md` · 10 requisitos:
  na `fundacao-e-ci`, 4 modificados e 4 novos; na `equipe-de-agentes`, 2 modificados · 14
  tarefas.
- **Questões em aberto** (as opções e o custo de cada uma estão na proposta):
  - Q1, a separação dos segredos: recomendo (c), um job e um ambiente por segredo;
  - Q2, a origem do build: recomendo (b), um job de build próprio, sem segredo;
  - Q3, o OpenSpec: recomendo (a), `devDependency` exata 2.1.0;
  - Q4, os 2 segredos no ambiente: recomendo (b), uma linha do Gabriel;
  - Q5, a leitura da condição do A1 com o download: recomendo (a);
  - Q6, UTF-16 e o nome na busca: recomendo (a), corrigir aqui;
  - Q7, a conferência do ambiente: recomendo (b), o E-A3 aqui e o E-A2 na `lancamento-r1`;
  - Q8, o AS-01 do relatório com o `.gitignore` no diff: recomendo (a);
  - Q9, onde fica a prova do push: recomendo (a), na `pagina-projetos`.
- **Incompleto.** Não conferi, porque não tenho rede nem terminal:
  - a hipótese da memória do executor, que motiva a Q1 (c);
  - a versão da ação de baixar anexo e a faixa do aviso de segurança dela;
  - as dependências transitivas, os scripts de instalação e a telemetria do OpenSpec 2.1.0;
  - o tamanho do anexo do build;
  - o tempo dos prints. Os tempos novos do D9 são estimativa.

  Também não rodei o `openspec validate` destes artefatos; quem roda é o líder técnico.

### A tabela das ressalvas

- **E-*** é da `endurecer-agentes-e-git-local`: G é o guardião (passagem única), e R3, a rodada 3
  do revisor.
- **ACI-*** é da `ajustar-ci-ao-novo-fluxo`:
  - A1 a A6 são da passagem 1 do guardião;
  - R1 e R3, das rodadas 1 e 3 do revisor;
  - Q4, da quarta passagem do revisor (Q11 (a));
  - B a E, I2, I3, M1 e B1, da passagem 2 do guardião;
  - T, da rodada de texto do revisor;
  - L, da seção do líder técnico.
- **ESP** é achado desta proposta.

| Origem | Código | Severidade | O que é | Destino | Motivo |
| --- | --- | --- | --- | --- | --- |
| endurecer · G | E-A2 | baixa | `.agents/` fora do AS-17 e da conferência | Q7; recomendo `lancamento-r1` | Pede escolher entre versionar, apagar ou comparar a pasta, e isso não é decisão de CI |
| endurecer · G | E-A3 | baixa | A conferência não confere os próprios arquivos | Q7 → tarefa 5.3 | Nesta change o dev escreve em `scripts/` |
| endurecer · G | E-A4 | baixa | A lista de tela alcança o `ambiente-decidido.txt` e a spec delta de spec do gatilho | tarefa 6.2 e spec delta `equipe-de-agentes` | Texto da §5 e um cenário |
| endurecer · G | E-A5 | informativa | A configuração global e a de sistema do Git não são lidas | tarefa 6.2 | Limite declarado na §5, como pede o critério |
| endurecer · G | E-A6 | informativa | Como se conclui o AS-01 do `relatorio.md` com o `.gitignore` no diff | Q8 → tarefa 6.2 | Pede regra nova na §5 |
| endurecer · G | E-A7 | informativa | "O commit da prévia" diz "antes das quatro formas" | tarefa 6.2 | Só a forma do `curl` usa a prévia |
| endurecer · R3 | E-R3.1 | baixa | `tasks.md:46` espera `Edit: 5`, e são 7 | fechada | Artefato arquivado; o 7 está no relatório arquivado, em "Aplicação da Q14 (a)" |
| endurecer · R3 | E-R3.2 | baixa | `design.md:78` diz "5 regras de `Edit`" | fechada | O mesmo motivo do E-R3.1 |
| endurecer · R3 | E-R3.3 | baixa | Frases absolutas na §5 e no README, longe do limite | tarefa 6.2 | Um ponteiro para o limite junto delas |
| endurecer · R3 | E-R3.4 | informativa | "A configuração que segura a barreira" não cita os dois `~/.claude/` | tarefa 6.2 | Texto |
| endurecer · R3 | E-R3.5 | informativa | A `EQUIPE-DE-AGENTES.md` diz "são trava" sem o limite | tarefa 6.2 | Texto |
| endurecer · R3 | E-R3.6 | informativa | A prova da Q14 não teve contraprova | fechada | A contraprova exige tirar a regra de negação, passo do Gabriel fora desta change; a propriedade se cumpre |
| endurecer · R3 | E-R3.7 | informativa | O RP-12 literal mostra sha anteriores à Q13 e à Q14 | fechada | Relatório arquivado; o sha novo está em "Aplicação da Q14 (a)" do mesmo relatório |
| ajustar-ci · G p1 | ACI-A1 | média | O `Build` roda antes da chave no job com segredo | tarefas 2.1 e 6.1, com Q1, Q2 e Q5 | Item 1 do briefing, prazo R1 |
| ajustar-ci · G p1 | ACI-A2 | baixa | `uses` em fluxo e ação local fora de `.github/actions/` não são vistos | tarefa 5.1 | O diff já mexe nas ações |
| ajustar-ci · G p1 | ACI-A3 | baixa | Chave em UTF-16 não casa | Q6 → tarefa 5.2 | O critério admite código ou limite declarado |
| ajustar-ci · G p1 | ACI-A4 | informativa | A falta de `^{}` não prova tag leve | tarefa 2.1, por evidência | `ls-remote` sem restringir a ref mostra a linha `^{}` se houver |
| ajustar-ci · G p1 | ACI-A5 | informativa | 0 segredos de organização, e o passo 5 do README | tarefas 1.1 e 2.2 | A frase do Gabriel traz "Organization vazia"; o passo 5 passa a citar a organização |
| ajustar-ci · G p1 | ACI-A6 | informativa | O caminho do archive na evidência do LB-08 e do LB-17 | fechada | A pasta `archive/2026-11-22-ajustar-ci-ao-novo-fluxo/` existe com o nome que a §6 cita |
| ajustar-ci · R1 | ACI-R1.8 | informativa | O artefato cita a §2 da `EQUIPE-DE-AGENTES.md`, e é a §7.1 | fechada | Artefato arquivado, sem efeito; já declarado na rodada 1 |
| ajustar-ci · R3 | ACI-R3.1 | baixa | O nome do arquivo e o UTF-16 ficam fora da busca | Q6 → tarefa 5.2 | O mesmo do ACI-A3 |
| ajustar-ci · R3 | ACI-R3.2 | baixa | A mensagem manda trocar a chave só se ela entrou em commit | tarefa 5.2 | A spec e a §5 mandam trocar sempre; vale nas duas opções da Q6 |
| ajustar-ci · R3 | ACI-R3.3 | baixa | Números velhos na seção do `dev-frontend` | fechada | A rodada 3 já registra os números certos, e o `ci.yml` muda de novo aqui |
| ajustar-ci · R3 | ACI-R3.4 | baixa | O e2e e a comparação de pixels são anteriores às passagens B e C | fechada | A rodada 3 já escreve por que continuam valendo |
| ajustar-ci · R3 | ACI-R3.5 | informativa | O inventário de `process.env` da §5 não traz a busca nem o `spawnSync` do teste | tarefa 6.2 | Inventário refeito, com data e com as leituras desta change |
| ajustar-ci · R3 | ACI-R3.6 | informativa | Linhas longas no `CLAUDE.md` e no README; e "ressalva aceita" | tarefa 6.2 para o README; fechada para o resto | Mexer no `CLAUDE.md` por uma quebra de linha muda arquivo do AS-17; a palavra foi corrigida na própria rodada 3 |
| ajustar-ci · Q4 | ACI-Q4.1 | baixa | O follow-up não traz "com a regra só `main`" | fechada | Arquivado; a condição inteira se cumpre aqui (1.1 e Q4) |
| ajustar-ci · Q4 | ACI-Q4.2 | baixa | O D8 e o `proposal.md:77` repetem o texto velho do LB-02 | fechada | Arquivados; o LB-02 sai da §6 aqui (6.1) |
| ajustar-ci · Q4 | ACI-Q4.3 | informativa | "O token do CI" é ambíguo, e não há texto para o caso do login local | tarefa 6.2 | A revogação já aconteceu (Gabriel, 22/11), e a §5 registra o fato |
| ajustar-ci · G p2 | ACI-B | informativa | A 1ª condição do LB-02 diz menos que o D1 | tarefa 1.1, por evidência | A evidência cobre os dois jobs, o ambiente e nenhuma execução vermelha |
| ajustar-ci · G p2 | ACI-C | informativa | A condição do A1 não fala de download, cache nem `$GITHUB_ENV` | Q5, spec delta e D2 | A leitura passa a estar escrita |
| ajustar-ci · G p2 | ACI-D | informativa | O texto não diz que a revogação acontece mesmo se for o login local | tarefa 6.2 | O mesmo do ACI-Q4.3 |
| ajustar-ci · G p2 | ACI-E | informativa | O D8, o `design.md:242-244` e o `tasks.md:64-65` têm texto velho | fechada | Arquivados, como o ACI-Q4.2 |
| ajustar-ci · G p2 | ACI-I2 | informativa | O cabeçalho da 3.1 não cita as duas linhas da §6 nem a troca do PAT | tarefa 6.1 | Declarado para cá pelo líder técnico; fora da lista do briefing |
| ajustar-ci · G p2 | ACI-I3 | informativa | O motivo da Q12 (b) omite o código de dependência | tarefa 6.1 | Item 2 do briefing |
| ajustar-ci · G p2 | ACI-M1 | média, hipótese | Desligar as chaves antigas pode não invalidar o JWT exposto | fora de escopo (R2) | `papeis-da-diretoria-no-banco`, pelo briefing |
| ajustar-ci · G p2 | ACI-B1 | baixa, hipótese | O que a chave gravou não se apaga com ela | fora de escopo (R2) | `papeis-da-diretoria-no-banco`, pelo briefing |
| ajustar-ci · T | ACI-T4 | informativa | "A metade das dependências" generaliza | fechada | A linha do LB-02 já não diz isso, e sai da §6 aqui |
| ajustar-ci · T | ACI-T5 | informativa | O caminho do aceite do A1 depende da data do archive | fechada | A pasta existe com 2026-11-22, igual à da §6 |
| ajustar-ci · T | ACI-T6 | informativa | A seção do guardião foi substituída, e não complementada | fechada | Relatório arquivado, sem efeito no que se entrega |
| ajustar-ci · L | ACI-L1.3 | lacuna de medição | Os tipos sem segredo não foram vistos numa máquina sem login | fechada como lacuna declarada | O push verde prova só o caminho com o token; ver o vermelho exigiria tirar o token do ambiente, passo do Gabriel |
| especificador | ESP-1 | sem severidade | O README diz "seis verificações", e o `verificar` encadeia sete | tarefa 6.2 | Achado nesta proposta; com o D3, passam a ser oito |

**Contagem:** 42 linhas.

| Destino | Itens |
| --- | --- |
| Tarefa de código | 6 (3 deles pela Q6 e pela Q7) |
| Texto, nas tarefas 2.2, 6.1 e 6.2 | 14 |
| Evidência, nas tarefas 1.1 e 2.1 | 2 |
| Só decisão (Q5, Q7 e Q8) | 3 |
| Fechadas com motivo | 15 |
| Fora de escopo (R2) | 2 |

**Diferença com o briefing.** O item 5 do briefing soma 32 ressalvas: 13 da `endurecer` (A2 a A7 e
as 7 da rodada 3), mais 12 da Q9 (a), 3 da Q11 (a) e os 4 informativos B a E. Os itens 1 e 2 dele
somam o A1 e o I3, e a conta vai a 34. As outras 8 linhas estão nos relatórios e não estão no
briefing:

- o I2, declarado para esta change pelo líder técnico;
- o M1 e o B1, listados só para a conta fechar;
- os informativos 4 a 6 da rodada de texto, que ficaram sem destino escrito;
- a lacuna de medição da tarefa 1.3;
- o ESP-1, achado nesta proposta.

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
