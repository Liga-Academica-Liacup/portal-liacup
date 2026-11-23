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

### Decisões do Gabriel no Portão 1, 23/11/2026

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel.

> Portão 1 da completar-ci-do-novo-fluxo: aprovado. Registre cada decisão literal no relatorio.md.
>
> Q1 (c). Q2 (b). Q3 (a). Q5 (a). Q6 (a). Q7 (b). Q8 (a). Q9 (a).
> Q4 (b), confirmação do Gabriel, conferida na tela em 23/11/2026: "2 segredos no ambiente segredos-da-main, regra só main".
>
> Na Q1 (c), entregue no Portão 2 os passos do Gabriel no GitHub, na ordem, como na ajustar-ci: criar o ambiente novo com regra só main, pôr a chave de serviço nele, o PR com os jobs certos pulados, o merge, conferir o push verde, e só então apagar a chave do segredos-da-main. Os passos vêm em blocos curtos, com os nomes exatos dos ambientes e dos segredos.
>
> Na Q3 (a), se o OpenSpec mandar telemetria, ela fica desligada no CI e nos scripts do package.json, e o relatório diz como foi conferido.
>
> Pode rodar o /opsx:apply.

Commit da proposta, feito pelo Gabriel: `e1cbce9` na `chore/completar-ci-do-novo-fluxo`, igual ao
remoto; `git rev-list --all` com 114 linhas.

## Líder técnico — tarefa 1.1: a saída do LB-02 e o tempo do CI, 23/11/2026

Tudo pela API pública de execuções do GitHub, sem autenticação e sem `gh`, com
`curl -q -sS --max-time 20 --proto =https` sobre `https://api.github.com/repos/Liga-Academica-Liacup/portal-liacup`
(abaixo, `R`). Horários em UTC: 23/11 02h UTC é 22/11 23h em Brasília.

| Consulta | Resultado |
| --- | --- |
| `GET R/actions/runs/45099474006` | `event: push` · `head_branch: main` · `head_sha: d7cc5c9a82980dbe05a0727baf015b20ef0befdd` · `conclusion: success` · `run_attempt: 2` |
| `GET R/actions/runs/45099474006/attempts/1/jobs` | `Verificacoes` success, 02:18:48 → 02:26:50 · `Conferencias com segredo` success, 02:18:50 → 02:19:57 |
| `GET R/actions/runs/45099474006/attempts/2/jobs` | `Verificacoes` success, 02:32:57 → 02:39:40 · `Conferencias com segredo` success, 02:32:59 → 02:34:17 |
| `GET R/deployments?environment=segredos-da-main` | 2 implantações, `ref: main`, sha `d7cc5c9`, às 02:18:46 e 02:32:55, uma por tentativa |
| `GET R/environments` | `segredos-da-main` com regra `branch_policy` e `custom_branch_policies: true` |
| `GET R/environments/segredos-da-main/deployment-branch-policies` | uma regra só: `{name: "main", type: "branch"}` |
| `GET R/actions/secrets` | `401`: a contagem de segredos não se lê sem autenticação |
| `GET R/actions/runs?branch=main&event=push&per_page=10` | desde o merge do PR #23, 1 execução de push (`45099474006`), com conclusão `success`; 0 com `failure` |
| `GET R/actions/runs/45095701421/jobs` (PR #23, sha `e65e319`) | `Verificacoes` success · `Conferencias com segredo` **skipped** |

**As três condições de saída do LB-02 (§6):**

1. **O job visto rodando no push para a `main`:** as duas tentativas da `45099474006`, com os dois
   jobs verdes, e o job com segredo implantado no `segredos-da-main` (2 implantações). No PR, o job
   com segredo aparece pulado (ACI-B: os dois jobs, o ambiente e nenhuma execução vermelha).
2. **A confirmação escrita do Gabriel:** de 22/11/2026, "tudo verde, Repository secrets e
   Organization vazia, ci-portal-liacup antigo revogado" (fecha o ACI-A5 na parte da
   organização); e, na Q4 (b) do Portão 1, "2 segredos no ambiente segredos-da-main, regra só main".
   A regra só `main` também está lida pela API, acima.
3. **O PAT antigo revogado:** "ci-portal-liacup antigo revogado", na mesma frase do Gabriel. A
   ordem vem do briefing do gestor, e não da frase do Gabriel: o "Re-run all jobs" (a tentativa 2)
   foi "feito depois de apagar os segredos do repositório e revogar o PAT antigo", e ficou verde, o
   que mostra que o job recebeu um PAT válido do ambiente. Também pelo briefing, o PAT novo é
   escopado: só o projeto de produção, só Database com Read.

A linha do LB-02 sai da §6 na tarefa 6.1, e vale só com o veredito do guardião (7.3).

**Tempo do CI** (métrica da `ajustar-ci`: `updated_at − run_started_at` da última tentativa):

| Evento | Antes da `ajustar-ci` (mediana de 3) | Depois dela | Diferença |
| --- | --- | --- | --- |
| PR | 5,95 min | 7,72 min (`45095701421`, 01:38:30 → 01:46:13) | +1,77 |
| push | 5,73 min | 6,78 min (`45099474006`, tentativa 2, 02:32:53 → 02:39:40) | +1,05 |

Uma execução de cada evento, não mediana. A tentativa 1 do push levou cerca de 8,08 min pelos
horários dos jobs. A diferença mistura efeitos: a `pagina-sobre-e-equipe` pôs 2 páginas a mais no
e2e e no Lighthouse.

**Dado de entrada da tarefa 2.1 (fecha o ACI-A4)**, por
`git ls-remote --tags https://github.com/actions/<nome>`, sem restringir a ref, e
`GET https://api.github.com/repos/actions/<nome>/security-advisories`:

| Ação | Tag | sha | Linha `^{}`? | Aviso publicado |
| --- | --- | --- | --- | --- |
| `actions/checkout` | v4.4.0 | `11d5960a326750d5838078e36cf38b85af677262` | não (tag leve: o sha é o do commit) | — |
| `actions/setup-node` | v4.4.0 | `49933ea5288caeca8642d1e84afbd3f7d6820020` | não | — |
| `actions/upload-artifact` | v4.6.2 | `ea165f8d65b6e75b540449e92b4886f43607fa02` | não | nenhum |
| `actions/download-artifact` | v4.3.0 (último patch da v4) | `d3f86a106a0bac45b974a628896c90dbdf5c8093` | não | GHSA-cxww-7g56-2vh6 (CVE-2024-42471, alta, escrita fora da pasta): faixa `>= 4.0.0, < 4.1.3`, corrigida na 4.1.3; a v4.3.0 está fora |

## dev-frontend

**Passagem A, 23/11/2026: as tarefas 2.1, 3.1, 3.2 e 4.1.**

- **Arquivos:** M `.github/workflows/ci.yml`, `package.json` e `package-lock.json` (este só pela
  instalação) · A `scripts/validar-specs.mjs` (91 linhas) e `scripts/prints-do-site.mjs` (150) ·
  M `tasks.md` (só as caixas) · **tokens novos:** nenhum. Nada em `src/`, `tests/` ou `docs/`.
- **Comandos:** `npm run verificar` 0 · `npm test` 0, 391/391 em 21 arquivos ·
  `npx playwright test` 0, 413 passados · `npm run build` 0.
- **2.1, o `ci.yml`.** `verificar:acoes` 0: `referências: 12 · presas por commit: 12 · fora da
  regra: 0`, e `grep -c 'uses:'` dá 12 · `grep -n 'secrets\.'`: 2 linhas, a 253 (`Tipos do banco`)
  e a 297 (`Chave fora do pacote`) · `environment:` 2: `segredos-da-main` e
  `chave-de-servico-da-main` · `npm run build` nas linhas 126 (`Verificacoes`) e 201 (o job do
  build) · `continue-on-error` 0 · `permissions:` 1 · `persist-credentials: false` 4, igual a
  `actions/checkout@` 4. Os passos antes do segredo, lidos com o parser de YAML:
  - `Tipos do banco`: checkout (sem credencial) · setup-node (sem cache) · `npm ci --ignore-scripts`;
  - `Chave fora do pacote` (`needs: build-para-a-chave`): checkout (sem credencial) · setup-node
    (sem cache) · `actions/download-artifact` para `.next`. Sem `npm ci`; o passo roda
    `node scripts/verificar-chave-de-servico.mjs`.
  - **Fora da letra da tarefa:** `include-hidden-files: true` no envio do `.next`. O README da
    `upload-artifact` presa (v4.6.2, linha 439) define como oculto "files within folders beginning
    with `.`". Sem a opção, o anexo sairia vazio e o `if-no-files-found: error` deixaria o job
    vermelho. O build roda sem segredo, e o `next.config.ts` não usa `standalone`, que copiaria o
    `.env` para dentro do `.next`.
- **3.1, o OpenSpec.** `"hasInstallScript": true`: 3 antes e 3 depois; 0 entre as 57 entradas novas
  do lockfile · a instalação diz `added 59 packages`; o lockfile foi de 836 para 893 entradas, com
  0 saídas e 1 alterada (a raiz) · `npm ls --depth=0` traz `@fission-ai/openspec@2.1.0`; são 23
  diretas no `package.json` (22 antes). O `npm ls` também lista `@emnapi/runtime` e
  `@img/sharp-wasm32` como `extraneous`: são opcionais do `sharp` que já estavam no lockfile,
  iguais antes e depois, instalados na pasta local · `npm audit --audit-level=high`: código 1 antes
  e depois, com `2 low, 12 moderate, 20 high, 0 critical` nas duas vezes, o mesmo conjunto e os
  mesmos nós; nenhum aviso novo · `openspec --version` (global) e `npx --no-install openspec
  --version` (local): `2.1.0` os dois.
  - **Observação para o guardião:** o OpenSpec pede `zod ^4.4.3` e resolve para o
    `node_modules/zod@4.4.3` que já existia, já com aviso alto (`zod <4.6.6`, GHSA-mrhx-c7xc-m3w5).
    O aviso não é novo, mas agora o OpenSpec também o carrega. Ele valida só arquivos do próprio
    repositório.
- **3.1, a telemetria**, conferida no pacote local `node_modules/@fission-ai/openspec/dist/`:
  - telemetria para `https://edge.openspec.dev` (`telemetry/index.js:31`), pelo `fetch` da
    `:43`. O `trackCommand` (`:147`) volta na `:148-149` se `isTelemetryEnabled()` é falso, e esta
    volta falso na `:77-78` quando `isTelemetryOptedOutByEnv()` é verdadeiro. Isso acontece com
    `OPENSPEC_TELEMETRY` fora de `1/true/yes/on` ou com `DO_NOT_TRACK` fora de `0/false/no/off`
    (`telemetry/opt-out.js:14-26`);
  - checagem de versão no registro: o `checkForCliUpdate` volta `disabled` na
    `core/version-check.js:378`, antes de chamar o `httpsGet`, porque o `isCheckEnabled` dá falso
    na `:66-67` (`OPENSPEC_NO_UPDATE_CHECK` definido) e na `:74-75` (opt-out da telemetria);
  - a dependência `skills@1.8.1` tem uma telemetria dela (`skills/dist/_chunks/remove.mjs:3390`,
    para `skills.sh`), que só manda se `DISABLE_TELEMETRY` e `DO_NOT_TRACK` estiverem os dois
    ausentes (`:3357`). O `DO_NOT_TRACK=1` também a desliga;
  - como ficou desligada: o `scripts/validar-specs.mjs` roda o `bin` do pacote com
    `process.execPath`, por `spawnSync` sem shell, e põe as três variáveis no ambiente. O passo do
    CI repete as três no `env:`. O OpenSpec também se desliga sozinho com `CI=true`;
  - **limite:** não medi o tráfego de rede. A prova é a leitura do código e a execução com as
    variáveis postas.
- **3.2.** `npm run verificar:specs` 0, com `Totals: 13 passed, 0 failed (13 items)`. `verificar:specs`
  aparece 1 vez no `ci.yml` e 2 no `package.json`. RP-12, com `openspec/changes/demo-rp12-invalida/`
  plantada (um requisito ADDED sem cenário), código 1:

  ```
  Totals: 13 passed, 1 failed (14 items)
  ✗ change/demo-rp12-invalida
    ✗ [ERROR] fundacao-e-ci/spec.md: ADDED "Requisito sem cenario" must include at least one scenario
  ```

  Apagada a pasta, código 0, com `Totals: 13 passed, 0 failed (13 items)`, e o
  `git status --porcelain` igual ao de antes, conferido com `diff`. O script também termina como
  NÃO VERIFICADO, com código 1, sem a linha `Totals` ou com 0 itens. Esse caso eu não vi falhar.
- **4.1.** Depois do `npm run build`, `npm run prints:site` dá 0, com
  `páginas: 4 · larguras: 2 · prints: 8`, e `ls test-results/prints-do-site | wc -l` dá 8. Também dá 0
  logo depois do `npx playwright test`, como no CI. A porta 3002 fica sem processo escutando no
  fim. O sha256 de `paginas-publicas.json` era `e7a0e121…03ddb8e` antes. RP-12, com
  `/pagina-que-nao-existe` acrescentada, código 1:

  ```
  páginas: 5 · larguras: 2 · prints: 8
    falhou: /pagina-que-nao-existe em 390 px: status 404
    falhou: /pagina-que-nao-existe em 1280 px: status 404
  ```

  Restaurada a lista, o código é 0 com `páginas: 4 · larguras: 2 · prints: 8`, e o sha256 é igual,
  `e7a0e121…03ddb8e`. Com a lista `[]`, `NÃO VERIFICADO — prints das páginas`, com código 1.
  `verificar:artefatos` dá 0, e `git status` não mostra `test-results/`. No `ci.yml`, o passo
  "Prints das paginas" vem logo depois do e2e, o envio `prints-do-site` logo depois dele (sem
  `if:`, então só com os anteriores verdes, `if-no-files-found: error` e `retention-days: 7`), e
  então o Lighthouse.
- **Melhorias de UI ou UX propostas:** nenhuma. **Proposta de CI**, fora desta passagem: o
  `Guardar relatorios quando algo falha` envia `.lighthouseci/` sem `include-hidden-files`. Pela
  mesma regra da v4.6.2, essa pasta fica de fora do anexo sem nenhum aviso.
- **Incompleto:** a 4.1 fica com `- [ ]`. O último item dela, o anexo `prints-do-site` na API
  pública e `prints: 8` no log da execução do PR, só se confere no Portão 2. Tudo o mais da 4.1
  está cumprido acima. Não medidos: o tráfego de rede do OpenSpec; o anexo do build e o download
  dele, que só rodam no push para a `main`.

**Passagem B, 23/11/2026: as tarefas 5.1, 5.2 e 5.3.**

- **Arquivos:** M `scripts/verificar-acoes-presas.mjs`, `scripts/buscar-segredo-antes-do-envio.mjs`
  (só o cabeçalho) e `…/funcoes.mjs`, `scripts/conferir-ambiente-local.mjs` (só o cabeçalho) e
  `…/funcoes.mjs`, os três testes de `tests/barreiras/` · M `tasks.md` (caixas) · **tokens
  novos:** nenhum. Nada em `src/`, `docs/`, no `ci.yml` nem no `package*.json`.
- **Comandos:** `npm run verificar` 0 (`Totals: 13 passed, 0 failed`) · `npm test` 0, 411/411 em
  21 arquivos · casos: ações presas 21 (eram 13), busca de segredo 47 (eram 36), conferência do
  ambiente 45 (eram 44; o contador dela sai por `console.log`, que o Vitest esconde, e o número
  vem da contagem de testes do arquivo) · `npx playwright test` 0, 413 passados.
- **5.1.** A linha é lida depois de quantos `- ` houver e de uma `chave: `; se o valor começa em
  `{` ou `[`, cada `uses` logo depois de `{`, `[` ou `,`, fora de aspas, conta, com o comentário do
  fim da linha. A ação local `./…` é lida no `action.yml`/`action.yaml` da pasta, em qualquer pasta,
  e as locais que ela cita também. **Fora da letra:** ação local sem definição, ou que sai do
  repositório, fica fora da regra (antes contava como local sem ser lida). RP-12, com as linhas
  66 a 69 do `ci.yml` trocadas por `- { name: Baixar o codigo, uses: actions/checkout@v4, with: {
  persist-credentials: false } }`, código 1:

  ```
  .github/workflows/ci.yml:66 · presa por etiqueta ou ramo (@v4), não por commit
  arquivos: 1 · referências: 12 · presas por commit: 11 · locais: 0 · fora da regra: 1
  ```

  Desfeita, código 0 com `presas por commit: 12 · fora da regra: 0`; `sha256sum` `57ce0bc4…ba691c2`
  antes e depois.
- **5.2.** UTF-16 pela marca `FF FE`/`FE FF` ou, sem marca, com mais da metade dos bytes ímpares
  (LE) ou pares (BE) zero; achado nas duas leituras, com o mesmo formato, linha e tamanho, conta
  uma vez. O caminho passa pelos formatos nos commits e na árvore (uma vez por caminho); com achado
  no nome, **todo** achado daquele arquivo sai como `nome do arquivo`, senão o caminho levaria o
  valor à saída. `grep -c 'se ele já entrou num commit'` dá 0. RP-12, com `demo-rp12-utf16.txt`
  não rastreado, em UTF-16LE sem marca (`6c 00 69 00 …`), montado por `node -e` com o prefixo
  partido, código 1:

  ```
  token clássico do GitHub · árvore · demo-rp12-utf16.txt:2 · [MASCARADO · 40 caracteres · demo-rp12-utf16.txt:2]
  Não envie. Tire o valor e troque a chave.
  commits: 1 · mensagens: 1 · arquivos: 27 (dos commits: 7 · da árvore: 20 · do índice: 0) · linhas: 19705 · formatos: 6 · achados: 1
  ```

  Antes e depois de apagado, código 0 com `arquivos: 26 (dos commits: 7 · da árvore: 19 · do
  índice: 0) · linhas: 19702 · formatos: 6 · achados: 0`.
- **5.3.** `ARQUIVOS_DA_CONFERENCIA` entra no `ehVigiado`. A conferência real, código 1:

  ```
  DIFERENÇA · arquivo diferente da main: scripts/conferir-ambiente-local.mjs · sha256 21d45617010606baa1b3c8184a54f55163e594e9d89e62e4e5dbb11a9f17c36c
  DIFERENÇA · arquivo diferente da main: scripts/conferir-ambiente-local/funcoes.mjs · sha256 0b38a5ee1cc3601f56d60fbd35860ac1e328524e3a04d82084676160accd02fc
  arquivos comparados: 20 · iguais à main: 18 · diferentes: 2 (aceitos por decisão: 0) · …
  ```

- **Melhorias propostas:** nenhuma de UI ou UX.
- **Incompleto:** a 5.3 fica com `- [ ]`: falta o registro dos dois sha256 no
  `ambiente-decidido.txt` e o RP-12 com registro, que são do líder técnico.

## Líder técnico — tarefas 2.2, 5.3 (registro), 6.1 e 6.2, 23/11/2026

**5.3, o registro e o RP-12 com registro.** O líder técnico conferiu os dois sha256 que o
`dev-frontend` deu (`sha256sum`, iguais) e escreveu o `ambiente-decidido.txt` com as duas linhas,
citando a proposta aprovada. Saída da conferência, literal (as linhas `ACEITA` repetidas nos passos
2 e 3 são as do passo 1; o comentário da decisão foi cortado aqui com `…`):

```
=== passo 1, com registro
registro: 2 linhas (openspec/changes/completar-ci-do-novo-fluxo/ambiente-decidido.txt)
ACEITA · arquivo diferente da main: scripts/conferir-ambiente-local.mjs · arquivo scripts/conferir-ambiente-local.mjs 21d45617010606baa1b3c8184a54f55163e594e9d89e62e4e5dbb11a9f17c36c  # …
ACEITA · arquivo diferente da main: scripts/conferir-ambiente-local/funcoes.mjs · arquivo scripts/conferir-ambiente-local/funcoes.mjs 0b38a5ee1cc3601f56d60fbd35860ac1e328524e3a04d82084676160accd02fc  # …
arquivos comparados: 20 · iguais à main: 18 · diferentes: 2 (aceitos por decisão: 2) · regras de exclusão: 0 · ganchos do Git ativos: 0 · chaves do .git/config: 18 (fora da lista: 0) · ganchos do Claude Code: ligados
código 0
=== passo 2, com uma linha a mais em scripts/conferir-ambiente-local/funcoes.mjs
AVISO · linha do registro sem diferença: arquivo scripts/conferir-ambiente-local/funcoes.mjs 0b38a5ee…  # …
DIFERENÇA · arquivo diferente da main: scripts/conferir-ambiente-local/funcoes.mjs · sha256 9c2e06fde514f5fb9b5e860ea2ea86b8d37b3b4b16e505585c4dd814188dac83
arquivos comparados: 20 · iguais à main: 18 · diferentes: 2 (aceitos por decisão: 1) · regras de exclusão: 0 · ganchos do Git ativos: 0 · chaves do .git/config: 18 (fora da lista: 0) · ganchos do Claude Code: ligados
código 1
=== passo 3, desfeita
arquivos comparados: 20 · iguais à main: 18 · diferentes: 2 (aceitos por decisão: 2) · regras de exclusão: 0 · ganchos do Git ativos: 0 · chaves do .git/config: 18 (fora da lista: 0) · ganchos do Claude Code: ligados
código 0
```

A linha a mais foi posta com `>>` e desfeita copiando de volta a cópia tirada antes; o sha256 do
`funcoes.mjs` depois do passo 3 é `0b38a5ee…02fc`, o registrado.

**2.2, 6.1 e 6.2, as conferências de texto** (cada `grep` no `README.md`, no `ci.yml`, no
`docs/SEGURANCA.md`, no `docs/EQUIPE-DE-AGENTES.md` e no plano):

| Conferência | Resultado |
| --- | --- |
| `grep -c 'chave-de-servico-da-main' README.md .github/workflows/ci.yml` | 3 e 3 |
| `grep -c 'Conferencias com segredo' README.md .github/workflows/ci.yml` | 0 e 0 |
| LB-02 e A1 na tabela aberta da §6 | 0 |
| LB-02 e A1 em "Saíram da lista", com a change | 2 |
| `grep -c 'I3 do guardião' docs/SEGURANCA.md` (linha da Q12 (b), prazo R2 e change iguais) | 1 |
| `grep -c '^\*\*Versão 3.2' docs/SEGURANCA.md` (cita as duas linhas da §6 e a troca do PAT da 3.1, ACI-I2) | 1 |
| `grep -c 'antes das quatro formas' docs/SEGURANCA.md` (E-A7) | 0 |
| `grep -c 'contra engano' docs/EQUIPE-DE-AGENTES.md` (E-R3.5) | 1 |
| contagem do `verificar` no README, `grep -cE '\*\*(seis\|sete)\*\* verifica\|As (seis\|sete):'` (ESP-1) | 0; o README diz "oito" nas duas linhas |
| `grep -c 'Desde a .completar-ci-do-novo-fluxo.' docs/SEGURANCA.md` (§3) | 1 |
| `grep -c 'Q8 (a)' docs/SEGURANCA.md` (E-A6, o parágrafo das lacunas e o cabeçalho) | 2 |
| `grep -c 'configuração global' docs/SEGURANCA.md` (E-A5) | 1 |
| os dois caminhos `~/.claude/` em "A configuração que segura a barreira" (E-R3.4) | 1 |
| `grep -c 'refeitas em 23/11/2026' docs/SEGURANCA.md` (inventário de `process.env`, ACI-R3.5) | 1 |
| `grep -c 'nenhum no nível da organização' README.md` (passo 5, ACI-A5) | 1 |
| `grep -c 'Implementado na branch em 23/11/2026' docs/PLANO-DE-DESENVOLVIMENTO.md` (linha 6 da R1, refeito depois do achado 6 da rodada 1 do revisor) | 1 |
| `npx prettier --check .` | código 0 |

Os outros textos, sem `grep` próprio: E-A4 na lista do gatilho e na de tela da conferência
proporcional; E-R3.3, o ponteiro para o limite junto do "só" e do "todo" na §5 e no README;
ACI-Q4.3 e ACI-D, a revogação do PAT antigo escrita como fato na §5; ACI-R3.6, as duas linhas
longas do README quebradas (a do `CLAUDE.md` fica, porque é arquivo do AS-17); a Q1 (c) na §5 e no
README (passo 5, quadro do CI e item "Fork"); a Q3 (a) em "A versão do OpenSpec importa"; e o E-A2
como destino na linha da `lancamento-r1` do plano. **Desvio da letra da 6.2:** o `grep` da tarefa,
`grep -cE 'As (seis|sete)' README.md`, acha "As seis skills", que está certo (são seis skills), e
por isso a conferência usou a forma da tabela.

## dev-dados

Não entrou: a change não lê nem grava no banco nem altera esquema (fora de escopo: LB-09, M1 e B1,
na R2). O passo dos tipos do banco só muda de job no `ci.yml`.

## guardiao-visual

Não entrou: change sem tela. Nenhum arquivo de `src/`, `public/` ou `tests/e2e/` muda, e a raiz não
publicada foi comparada pixel a pixel pelo `qa-acessibilidade` (7.1, D10).

## qa-acessibilidade

Tarefa 7.1 (23/11/2026). Precondições: `test -e .npmrc` código 1 · registro
`https://registry.npmjs.org/` · portas 3000 e 3001 livres antes e depois · HEAD `e1cbce9`.

- **`npx playwright test`:** código 0 · **413 passed**, 0 falhos, 0 flaky, 0 pulados (1,2 min),
  com build novo (o `npm run build` rodou dentro da suíte, pelo `webServer` da 3000).
  Playwright 1.62.1. Cobertura: as páginas da suíte (raiz, `/sobre`, `/processo-seletivo`,
  `/equipe`, vitrine e raiz não publicada) × 7 larguras (360 a 1280). Tab: 43 controles
  (51 em 1280) / 0 sem foco visível, 0 foco igual ao repouso, 0 anel que muda no hover.
- **Raiz não publicada (D10):** método do `guardiao-visual` da `pagina-sobre-e-equipe`.
  `node scripts/iniciar-servidor.mjs nao-publicado 3001` sobre o build da suíte; script
  temporário no scratchpad, fora do repositório: Chromium do Playwright 151.0.7922.34,
  `deviceScaleFactor` 1, viewport 390 × 844 e 1280 × 800, `fullPage: true`, `networkidle`,
  3 s depois de `document.fonts.ready`; comparação canal a canal (RGBA) em canvas, sem
  tolerância, contra `archive/2026-11-22-pagina-sobre-e-equipe/prints/raiz-nao-publicada-*`.
  - 390: novo 390 × 844, referência 390 × 844 · **0 / 329.160** · status 200 · rolagem 390 = 390
  - 1280: novo 1280 × 800, referência 1280 × 800 · **0 / 1.024.000** · status 200 · rolagem
    1280 = 1280
- **Comparação vista falhando (RP-12):** com 3 × 2 px vermelhos injetados no print novo,
  6 diferentes em cada largura (caixa x 10 a 12, y 10 a 11), código 1; sem a injeção, 0 de novo
  nas duas, código 0.
- **`git diff --exit-code main -- src public tests/e2e playwright.config.ts`:** código 0, antes e
  depois da passagem.
- **Temporários:** `scratchpad/qa/` (script e 2 prints) e o log da suíte apagados; servidor da
  3001 derrubado. Nada versionado escrito; só esta seção e a caixa da 7.1.
- **Verificação nova demonstrada falhando:** nenhuma verificação nova no repositório (a
  comparação temporária foi vista falhando, acima).
- **Defeitos:** nenhum · **sem cobertura:** contagem de nós do axe por página (a saída só diz
  passa ou falha); a contagem de alvos de toque desta execução não foi transcrita (os testes de
  alvo passaram nas 7 larguras); prints só da raiz não publicada, em 390 e 1280.

## revisor

### Rodada 1, 23/11/2026 (invocação nova, contexto limpo)

- **Veredito:** aprovado com ressalva · 24 de 25 arquivos (o `package-lock.json` não foi lido) · 8
  de 8 critérios e as 2 instruções do Gabriel · 12 regras. O critério 2 conferido no `ci.yml`: um
  segredo por job (linhas 253 e 297), num `environment:` diferente cada; antes do `secrets.`, só as
  formas permitidas; `npm run build` só nas linhas 126 e 201, sem segredo; nenhum `npm ci` no job
  da chave. A tabela das ressalvas fecha em 42 (6/14/2/3/15/2). A telemetria conferida no código
  do pacote. Nenhuma verificação afrouxada.
- **Achados:**
  1. média · `SEGURANCA.md`, parágrafo da Q8 (a): "entre os arquivos examinados da árvore" não se
     lê, porque a busca só imprime contadores; e o arquivo commitado sem mudança é lido nos
     commits. **Pede correção.**
  2. média · `SEGURANCA.md`, inventário de `process.env`: faltam 5 processos filhos que herdam o
     ambiente (`verificar-tipos-do-banco.mjs:88`, com o PAT, `medir-desempenho.mjs:82`,
     `verificar-rls.mjs:118`, `verificar-navegador.mjs:10`, `verificar-artefatos.mjs:95`). **Pede
     correção.**
  3. baixa · `buscar-segredo-antes-do-envio/funcoes.mjs:493-498`: com chave no nome, o achado do
     conteúdo também sai como `nome do arquivo:<linha>`, e aponta o lugar errado; não vaza valor.
  4. baixa · `verificar-acoes-presas.mjs`, `restosDaLinha`: mapa de fluxo em várias linhas com
     `uses:` depois de vírgula na continuação não é contado nem recusado, sem limite declarado.
  5. baixa · linhas longas desta change no `README.md:384` e no `SEGURANCA.md:370` e `:533`.
  6. baixa · o plano diz "Entregue" antes do guardião e do push; a §5 diz que o
     `segredos-da-main` "guarda só o PAT", o que só vale depois do passo 5 do Migration Plan.
  7. baixa · `relatorio.md`: `dev-dados` e `guardiao-visual` com o texto do modelo; o
     `.lighthouseci/` fica fora do anexo de falha (regra dos arquivos ocultos da
     `upload-artifact` v4.6.2), defeito anterior a esta change, sem destino.
  8. informativa · o `include-hidden-files: true` está certo e é necessário; ninguém listou o
     conteúdo do anexo do `.next` (para o guardião e o primeiro push).
  9. informativa · ação local sem `action.yml` fora da regra: mais estrito, aceito.
  10. informativa · a telemetria fica ligada no OpenSpec global dos `/opsx:*` e não se sabe qual
      binário rodou o `openspec validate` da 7.2; estender a regra é decisão do Gabriel.
  11. informativa · `validar-specs.mjs:91` confia no código do OpenSpec, não confere `failed = 0`
      nem exige a 2.1.0; o aviso em modo estrito não foi demonstrado.
  12. informativa · `prints-do-site.mjs` usa a porta fixa 3002; um servidor velho nela, na máquina,
      daria prints dele.
  13. informativa · "Saíram da lista" cita o caminho do archive de 23/11 e o guardião antes de ele
      rodar.
- **Não conseguiu conferir** (sem terminal): o `package-lock.json`; os números do relatório; os
  sha das ações e a faixa do aviso; a raiz, o conteúdo e o tamanho do anexo do build; o
  `document.images.every(complete)` com imagem preguiçosa no CI; o tráfego de rede do OpenSpec.
- **Encaminhamento do líder técnico:** corrigidos no texto o 1 (três leituras que se leem), o 2
  (inventário com os 5, o da CLI com o PAT nomeado), o 5 (as três linhas quebradas), o 6 (o plano
  diz "Implementado na branch", com a condição; a §5 diz que o `segredos-da-main` fica só com o PAT
  depois do passo 5) e o 7 (as duas seções preenchidas). O 13 é a regra da 6.1: as linhas voltam à
  §6 se o guardião não confirmar ou se o archive cair noutra data. O 3, o 4, o `.lighthouseci/` do
  7, o 10, o 11 e o 12 vão ao Gabriel no Portão 2, com destino (Q10 e Q11). Depois das correções, o
  `revisor` e o `guardiao-appsec` rodam de novo, cada um numa invocação nova.

### Rodada 2, 23/11/2026 (invocação nova; a rodada 1 só foi lida no fim)

- **Veredito:** aprovado com ressalva · 24 de 25 arquivos · 8 critérios e as 2 instruções · 12
  regras. `ci.yml`: 2 `secrets.` (253 e 297) em 2 ambientes (226 e 268), só as formas permitidas
  antes, `npm run build` só em 126 e 201, 12 `uses:` presos, 1 `permissions:`, 0
  `continue-on-error`. Casos novos 8 + 11 + 1, que batem com 391 → 411. Tabela das ressalvas com 42
  linhas, recontada destino por destino. Critérios 4 e 6 com a parte do PR e do push pendente,
  declarada; o critério 1 depende da 7.3.
- **Achados, todos de texto, cinco pedindo correção:**
  1. baixa · `relatorio.md:379`: o `grep` de "Entregue em 23/11/2026" ficou velho. **Pede correção.**
  2. baixa · `SEGURANCA.md:372`: "antes de ler o segredo" contradiz a frase nova de que as buscas
     no Git não esperam a conferência do commit da prévia. **Pede correção.**
  3. baixa · `SEGURANCA.md:610`: "não alcança a chave" é absoluto, e a chave fica nos dois
     ambientes até o passo 5. **Pede correção.**
  4. baixa · `SEGURANCA.md:598-601`: o PAT escopado atribuído ao Gabriel, quando a fonte é o
     briefing; e a dedução "deixou de existir com o push verde". **Pede correção.**
  5. baixa · `README.md:680`: "20 dependências diretas"; são 23. **Pede correção.**
  6. baixa · `SEGURANCA.md:580`: o limite do UTF-16 decidido pelo arquivo inteiro não está
     declarado.
  7. informativa · `README.md:385` e `SEGURANCA.md:553` ainda longas.
  8. informativa · o `taskkill` de `prints-do-site.mjs:78` fora do inventário.
  9. informativa · `tasks.md:48`: a 2.2 com `- [ ]` sem motivo escrito.
- **Rodada 1, situação:** 1, 2, 6, 7 e 9 resolvidos (o 2 com o 8 acima e o 6 com o 1 e o 3
  acima); 5 parcial (o 7 acima); 3, 4, 10, 11 e 12 vão ao Gabriel; 8 para o guardião e o primeiro
  push; 13 até a 7.3.
- **Não conseguiu conferir:** o `package-lock.json`; os números e as saídas literais; os sha256 do
  `ambiente-decidido.txt`; os sha das ações; o anexo do `.next`; a imagem preguiçosa no CI; o
  tráfego de rede do OpenSpec; os passos do Gabriel no GitHub.
- **Encaminhamento do líder técnico:** corrigidos o 1 (o `grep` de "Implementado na branch em
  23/11/2026"), o 2 ("antes da forma do `curl`"), o 3 ("depois do passo 5" e a janela declarada),
  o 4 (a fonte do escopo e da ordem é o briefing; a dedução saiu), o 5 (23: 4 de execução e 19 de
  desenvolvimento, com a origem das outras declarada como não reconferida), o 6 (o limite escrito na
  §5), o 7 (as duas linhas quebradas) e o 8 (o `taskkill` no inventário). O 9: a 2.2 fica aberta só
  pelo último item dela, os passos do Gabriel na entrega do Portão 2, que se marca quando a entrega
  sai. Pela regra 4 da dieta, a rodada 3 do `revisor` é a última: se pedir correção de novo, o líder
  técnico para e leva ao Gabriel.

### Rodada 3, 23/11/2026 (invocação nova; as rodadas 1 e 2 só foram lidas no fim)

- **Veredito:** aprovado com ressalva · **nenhum achado pede correção antes do Portão 2** · 24 de
  25 arquivos · 8 de 8 critérios, as 9 decisões e as 2 instruções · 12 regras. `ci.yml`: 4 jobs, 2
  `secrets.` (253 e 297) em 2 ambientes (226 e 268), só as formas permitidas antes, `npm run build`
  só em 126 e 201, 1 `permissions:`, 0 `continue-on-error`. Telemetria conferida no pacote local.
  As specs delta mantêm todos os cenários da principal. O inventário de `process.env`: 16 de 16
  linhas batem com o código. A tabela: 42 linhas.
- **Achados, como ressalva declarada (nenhum corrigido, para não abrir uma quarta rodada):**
  1. baixa · `ci.yml:17` e `:219-220`, o plano (`:113`) e a linha do A1 em "Saíram da lista"
     descrevem como fato o que só vale depois do passo 5 do Migration Plan, contra a "Janela
     declarada" da §5;
  2. baixa · `specs/fundacao-e-ci/spec.md:124-128`: o cenário do UTF-16 promete mais do que o
     código faz (o trecho UTF-16 dentro de arquivo que não é UTF-16), e não tem a linha do limite
     declarado, como o cenário do binário;
  3. baixa · `README.md:686` e `PADROES-DE-CODIGO.md:248` (RP-01) dizem que a dependência nova se
     justifica na tabela do `plan.md`, e esta change a justifica na proposta; onde a justificativa
     mora desde o OpenSpec é decisão do Gabriel;
  4. informativa · `SEGURANCA.md:484-486`: a frase das formas de sim ou não ficou logo depois da
     sublista da Q8 e pode ser lida como parte dela;
  5. informativa · a conferência de escopo não cita as rodadas do `revisor` (registradas abaixo).
- **Encaminhamento:** concorda com o encaminhamento da rodada 1 ao Gabriel. Rodadas 1 e 2: os 7
  achados que pediam correção, resolvidos. Os 5 desta rodada vão ao Gabriel no Portão 2 (Q11).
- **Escopo do `revisor`, nas três rodadas:** `git status --porcelain` igual antes e depois, e
  `git diff --cached --name-only` vazio.

## guardiao-appsec

O guardião não escreve: o líder técnico registra o relatório em uma tela por passagem, com a lista
de achados inteira; a saída de comando e o aceite do Gabriel vão literais.

### Passagem 1, 23/11/2026: levantamento e decisão (duas invocações novas, depois da rodada 3 do revisor)

- **Veredito final:** **APROVADO COM RESSALVAS** · bloqueante 0 · alta 0 · média 1 (hipótese) ·
  baixa 0 · informativa 4 · **conferência completa** (passo 1 da conferência proporcional: o diff
  toca `.github/`, `scripts/`, `package*.json`, `docs/SEGURANCA.md`, o `ambiente-decidido.txt` e as
  specs delta do gatilho; o guardião concordou). 24 de 25 arquivos lidos; o `relatorio.md` coberto
  só por P1 a P12.
- **Estados:** AS-01 sem achado nos 25 (P1 a P12 com código 1 e saída vazia; nenhum binário novo);
  AS-02 com I1; AS-06 e AS-07 sem achado (as 3 variáveis no script e no `ci.yml`; os prints só em
  `localhost:3002`); AS-08 com I2 (57 entradas novas, todas do `registry.npmjs.org` com
  `integrity`, 0 linhas removidas, 0 `hasInstallScript` novos); AS-09 com M1 e I3, e I4; AS-17 sem
  achado (o `ambiente-decidido.txt` com 2 linhas e a decisão citada; conferência com
  `aceitos por decisão: 2`); AS-03 a AS-05, AS-10 a AS-16 não se aplicam.
- **A1 lido no `ci.yml`:** antes do `secrets.` do job dos tipos (`:229-255`), checkout sem
  credencial, setup-node sem cache e `npm ci --ignore-scripts`; antes do da chave (`:271-298`),
  checkout sem credencial, setup-node sem cache e `download-artifact` v4.3.0; `npm run build` só em
  `:126` e `:201`, sem ambiente; `secrets.` só em `:253` e `:297`; 1 `permissions`, 0
  `continue-on-error`, 4 checkouts com `persist-credentials: false`, 12 de 12 `uses:` presos.
- **Riscos da §6:** **LB-02 sai** (as três condições: a execução `45099474006` e as 2 implantações
  com `ref: main`, a regra única `main`; as frases do Gabriel de 22/11 e da Q4 (b); o PAT antigo
  revogado). Ressalva: a tabela das execuções é a redução do líder técnico, e não o JSON bruto; vale
  porque a API fica fora da lista fechada e o caminho previsto é a tarefa 1.1. **A1 sai**, pela
  leitura do `ci.yml` (Q5 (a)). **A linha da Q12 (b) confere** com o aceite literal arquivado
  (motivo original, prazo R2, change, condição e ponteiro iguais).
- **Achados (lista inteira):**
  - **M1 · AS-09 · média · hipótese** · `ci.yml:268`, README passo 5, Migration Plan passos 2 e 5.
    Cenário: o `chave-de-servico-da-main` nasce sem a regra só `main` (criado assim, ou pelo GitHub
    quando um job o referencia), a chave entra nele, e um PR de branch do próprio repositório tira o
    `if:` e recebe a `SUPABASE_SERVICE_ROLE_KEY`. Critério: entre pôr a chave e o merge, o líder
    técnico lê pela API pública e registra aqui, literal, `GET R/environments/chave-de-servico-da-main`
    com `custom_branch_policies: true`, `.../deployment-branch-policies` com uma regra só
    `{name: "main", type: "branch"}`, e `GET R/deployments?environment=chave-de-servico-da-main`
    com 0 implantações. **Fora disso, não há merge.** Depois do push, as implantações desse
    ambiente mostram só `ref: main`.
  - **I1 · AS-02 · informativa · confirmado** · `ci.yml:206-215`: o `.next` vai como anexo público
    por 1 dia, com arquivos ocultos e sem lista; leva chaves geradas pelo build (pré-visualização,
    cifra das Server Actions) de um build que não vai ao ar. Critério: na 1ª tarefa da
    `pagina-projetos`, o número de arquivos do anexo e nenhum nome começando com `.env`; este build
    nunca é publicado nem promovido.
  - **I2 · AS-08 · informativa · confirmado** · o OpenSpec usa o `zod` já no lockfile, com o aviso
    alto GHSA-mrhx-c7xc-m3w5 (LB-27); uma spec gigante num PR esgotaria a memória do job sem
    segredo, com o CI vermelho como efeito. Critério: na `lancamento-r1`, resolvido ou de volta ao
    Gabriel; até lá, o P14 com o mesmo conjunto.
  - **I3 · AS-09 · informativa · confirmado** · `SEGURANCA.md:723` contra `:617-620`: a evidência do
    A1 cita "um job e um ambiente por segredo", e até o passo 5 a chave está no `segredos-da-main`.
    Critério: a linha apoia a saída só na leitura do `ci.yml`, ou diz que a separação só termina no
    passo 5, registrado na 1ª tarefa da `pagina-projetos`.
  - **I4 · AS-09 · informativa · provável** · `SEGURANCA.md:680`, "visto pelo Gabriel em
    22/11/2026": o relatório arquivado da `ajustar-ci` só diz que o I3 "vai ao Gabriel na entrega".
    Critério: apontar onde está o registro, ou trocar a atribuição pela aprovação da proposta no
    Portão 1. Nota do líder técnico: a frase vem do briefing do gestor desta change ("visto pelo
    Gabriel em 22/11"), que o Gabriel colou; o registro dela fica sendo o briefing.
- **Pedidos de comando** (Git Bash, `MSYS_NO_PATHCONV=1`; precondições: conferência do ambiente
  com código 0 e `aceitos por decisão: 2`; `test -e .npmrc` código 1; registro
  `https://registry.npmjs.org/`; `git rev-parse main` = `git ls-remote origin refs/heads/main` =
  `d7cc5c9a82980dbe05a0727baf015b20ef0befdd`; `git rev-list main..HEAD` =
  `e1cbce91dcee47cf6978d7b26ac2eacfb428ddcd`; `curl` 8.7.1):
  - P1 a P6 · AS-01 · `git grep -c -a --untracked -e '<formato>' -- 'openspec/changes/completar-ci-do-novo-fluxo/relatorio.md'`,
    com os 6 formatos (JWT, `sb_secret_`, `sbp_`, `github_pat_`, PEM, `ghp_`) · saída vazia ·
    `[código de saída: 1]` nos 6;
  - P7 a P12 · AS-01 · os mesmos 6, `git grep -c -a -e '<formato>' e1cbce9 -- '<o mesmo arquivo>'`
    · saída vazia · `[código de saída: 1]` nos 6;
  - P13 · AS-08 · `npm ls --depth=0` · `[código de saída: 0]` · 23 diretas, com
    `@fission-ai/openspec@2.1.0`, e duas linhas `extraneous` (`@emnapi/runtime@1.11.3` e
    `@img/sharp-wasm32@0.35.5`), que já estão no lockfile da `main` (2 de 2 entradas);
  - P14 · AS-08 · `npm audit --audit-level=high` · `[código de saída: 1]` ·
    `34 vulnerabilities (2 low, 12 moderate, 20 high)`, o mesmo total de antes; das 57 entradas
    novas do lockfile, só `@fission-ai/openspec/node_modules/brace-expansion` tem nome de pacote com
    aviso, e está em 5.0.13, fora das faixas `<=1.1.20` e `4.0.0 - 5.0.11`.
- **Não verificado:** o ambiente `chave-de-servico-da-main` (ainda não existe: é o M1); a hipótese
  da Q1 (c) até o passo 5 (a janela declarada na §5); o push dos quatro jobs (só depois do merge,
  Q9 (a)).
- **Riscos aceitos pelo Gabriel:** nenhum.

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum.

Nesta change, por decisão do D11, o `dev-frontend` escreve também em `.github/`, `package.json`,
`package-lock.json`, `scripts/` e `tests/barreiras/`, e o líder técnico em `docs/`, `README.md` e no
`ambiente-decidido.txt`.

- **Arquivos fora do escopo, por agente:** nenhum em nenhuma passagem. Depois de cada uma
  (especificador, `dev-frontend` A e B, `qa-acessibilidade`): `git diff --cached --name-only` vazio;
  HEAD `e1cbce9` e `git rev-list --all` com 114 linhas, iguais aos de antes; `git ls-remote origin
  chore/completar-ci-do-novo-fluxo` igual a `e1cbce9`; conferência do ambiente com código 0 (depois
  da passagem B, com 1 até o registro, como esperado, e 0 com `aceitos por decisão: 2`).

### Tarefa 7.2, 23/11/2026

| Comando | Código | Contadores |
| --- | --- | --- |
| `node scripts/conferir-ambiente-local.mjs --change completar-ci-do-novo-fluxo` | 0 | 20 comparados · 18 iguais · 2 diferentes, aceitos por decisão: 2 |
| `npm run verificar` | 0 | artefatos VERIFICADO · ações `referências: 12 · presas por commit: 12 · fora da regra: 0` · specs `Totals: 13 passed, 0 failed (13 items)` · tokens `arquivos varridos: 606` · chave VERIFICADO |
| `npm test` | 0 | 411 de 411, 21 arquivos |
| `openspec validate --all --strict` | 0 | `Totals: 13 passed, 0 failed (13 items)` |
| dependências diretas | — | 23 (eram 22); o `package-lock.json` com 894 linhas a mais, só da instalação do OpenSpec da 3.1 (57 entradas novas, nenhuma com script de instalação) |
| `git diff --exit-code main -- .claude CLAUDE.md openspec/config.yaml src` | 0 | nada mudou |
| `git status --porcelain --untracked-files=all` | — | 20 linhas, todas do D11 |
| tabela das ressalvas | — | 42 linhas |
| `node scripts/buscar-segredo-antes-do-envio.mjs` | 0 | `commits: 1 · mensagens: 1 · arquivos: 27 (dos commits: 7 · da árvore: 20 · do índice: 0) · linhas: 19864 · formatos: 6 · achados: 0` |
| `npx playwright test` (`qa-acessibilidade`, 7.1) | 0 | 413 passados |

Destinos da tabela das ressalvas, conferidos: as 6 de código feitas (2.1, 5.1, 5.2 e 5.3); as de
texto feitas (2.2, 6.1 e 6.2, com os `grep` da seção anterior do líder técnico); as de decisão
decididas no Portão 1 (Q5 (a); Q7 (b), com o E-A2 escrito na linha da `lancamento-r1`; Q8 (a)); as
15 fechadas com motivo; e as 2 da R2 sem mudança.
