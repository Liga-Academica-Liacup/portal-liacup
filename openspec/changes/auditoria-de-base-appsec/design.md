# Design — auditoria de base de segurança

## Context

A motivação está em `proposal.md`, na seção Why. Os fatos abaixo foram medidos pelo líder técnico
na `main` (HEAD `8bf8204`), salvo onde está dito outro autor.

| O que | Situação |
| --- | --- |
| Arquivos rastreados | 297, por `git ls-tree -r --name-only main`. `git ls-files main` não aceita revisão e devolve 0 linhas. Binários por extensão: 32, todos PNG. São 8 em `assets/`, 23 em `prototipo/prints/` e 1 em `public/` (`logo-liacup-256.png`) |
| `.gitattributes` | Marca `*.png`, `*.jpg`, `*.woff2` e `*.ico` como `binary`. O `git grep -I` da lista fechada pula esses arquivos sem avisar |
| Origem dos binários | Os 23 de `prototipo/prints/` saem de `npm run prints:prototipo`. A origem dos outros 9 foi confirmada pelo Gabriel no Portão 1 (D6). Os 9 entraram no commit `6636202` (F00, 21/08). `public/logo-liacup-256.png` tem o mesmo blob de `assets/logo-liacup-256.png` (`bfa1d3d5`) |
| Chave de serviço | Citada em 7 arquivos: `ci.yml`, `scripts/purgar-dado-pessoal.mjs`, `scripts/verificar-chave-de-servico.mjs`, `src/lib/supabase/servidor.ts`, `supabase/migrations/0012_concessoes_de_tabela.sql`, `supabase/verificacoes/rls-por-tabela.sql` e `tests/politicas/clientes.ts` |
| Banco | 13 migrações e 13 tabelas da F02 |
| Rotas com página | `(site)/` raiz, `(site)/em-construcao` e `(interno)/vitrine`. Para o `curl`, viram `/`, `/em-construcao` e `/vitrine` |
| Produção | `https://liacup.com.br/` responde 308 para `https://www.liacup.com.br/` (P10 da `montar-guardiao-appsec`). O `www` é a produção de fato (E1) |
| `npm audit` | 34 avisos: 2 baixos, 12 moderados, 20 altos, 0 críticos. Medido na retomada da `montar-guardiao-appsec`, depois do `next` 16.4.6 |
| OpenSpec | CLI global, 2.1.0, fora do `package.json`. São 6 skills em `.claude/skills/`, todas `openspec-*`, e cada uma declara `allowed-tools: Bash(openspec:*)` no cabeçalho |
| `.agents/` | Existe no disco com as mesmas 6 skills. É ignorado pelo `.gitignore` (RP-13) e fica fora da lista auditada |
| Configuração de ambiente | `.claude/settings.json`, `.claude/settings.local.json` e `.mcp.json` não existem |
| "AS-01 a AS-16" | Aparecia em 7 lugares. Os do gestor, `docs/constitution.md:86` e `docs/EQUIPE-DE-AGENTES.md:29`, já foram emendados por ele no disco (Q1). Ficam 5, do líder técnico: `CLAUDE.md:21`, `openspec/config.yaml:51` e `.claude/agents/guardiao-appsec.md:3`, `:25` e `:105` |

**Pendências herdadas da `montar-guardiao-appsec`.** Cada uma tem bloco de destino (D4):

- `ci.yml` sem bloco `permissions:`, com ações presas por tag e credencial persistida pelo checkout
  (I1 e I2).
- `git log -S` não examina commit de merge (A4).
- A precondição da §5 não cobre `.git/config` nem `.git/info/exclude` (A5).
- O caso do `corepack`: um `packageManager` com URL faria o primeiro `npm` baixar e rodar código.
- `prototipo/Portal-LIACUP.html:1` casa com `eyJ`. É JSON em base64, sem forma de JWT, e ficou
  "para a linha de base".
- Ganchos no cabeçalho de skill e de agente rodam antes de o auditor ler o diff. É o achado 1 da
  passagem 13 do revisor, que se liga à Q10 daquela change.

## Goals / Non-Goals

**Goals:**

- As regras novas existem antes da auditoria que as usa (D2).
- Todo arquivo rastreado da `main` é conferido uma vez, em um bloco, e a soma dos blocos é 297.
- Cada um dos 34 avisos do `npm audit` sai classificado, sem resumo no lugar da classificação.
- O que a busca não alcança aparece como "não verificado" ou como "coberto só pela origem
  declarada". Nunca aparece como "sem achado".

**Non-Goals:**

- Corrigir achado. A correção imediata, se houver, é outra change, que entra antes.
- Recomendar verificação automática no CI (parte 6 do briefing, D12).
- Auditar o que o `.gitignore` esconde (`.agents/`, `.env*`, `supabase/.temp/`). Só o pedido sim
  ou não de `git check-ignore` e `git ls-files` toca esses caminhos.

## Decisions

### D1 — A fronteira da spec é `equipe-de-agentes`

São 5 requisitos novos e nenhum modificado. Os requisitos atuais não mudam de comportamento.
"Toda change passa pela auditoria" continua valendo. A auditoria de base vem somada a ela e não
substitui nenhuma.

**Alternativa descartada:** uma capacidade nova, `auditoria-de-seguranca`, com os 12 requisitos
do guardião e os 5 novos. Isso exigiria remover e recriar 12 requisitos só para mudar de lugar, sem
mudança de comportamento. A recomendação de CI não entra na spec: é uma entrega de uma vez só, e
inventar requisito para ela seria satisfazer a validação.

### D2 — Primeiro as regras, depois a auditoria

A auditoria lê a `main`, mas audita com o checklist que esta change escreve: AS-17 e a regra do
binário. A ordem das tarefas é fixa:

1. As regras (grupo 1).
2. As duas demonstrações do RP-12 (grupo 2).
3. A auditoria por blocos (grupo 3).
4. O aceite, a revisão do diff e a validação (grupo 4).

Alguns arquivos mudam nesta change: `docs/SEGURANCA.md`, `.claude/agents/guardiao-appsec.md`,
`CLAUDE.md`, `openspec/config.yaml` e os dois documentos que o gestor já emendou (Q1). Eles são
lidos na versão nova, da árvore de trabalho. A versão antiga deixa de existir com o merge, e a nova
também passa pela auditoria do diff, na tarefa 4.2. Os arquivos plantados dos RP-12 não existem
durante o grupo 3. O líder técnico confere isso pelo `git status` antes do primeiro bloco.

O sha da `main` no começo do grupo 3 vai para o relatório. A contagem de 297 vale para esse sha.

### D3 — O modo base na §5

O texto novo da §5 diz:

- **A lista auditada** é a saída de `git ls-tree -r --name-only main` naquele sha. Essa é uma
  **forma nova da lista fechada**, `git ls-tree -r --name-only <rev>`, sem lacuna além de `<rev>`.
  Ela só lista nomes de arquivo, não mostra conteúdo.
- **A condição de `<caminho>`.** A §5 de hoje exige, nas formas que mostram conteúdo, que
  `<caminho>` apareça numa linha "de `git ls-files` da `main`". Essa formulação tem o mesmo defeito
  medido acima: `git ls-files main` não lê revisão. A condição passa a citar a saída de
  `git ls-tree -r --name-only main`. Como todo arquivo da lista auditada é uma linha dessa saída, a
  condição fica cumprida.
- **AS-01 no histórico:** por `git log --all --oneline -S '<texto>'`, forma que já existe, um
  padrão por pedido.
- **A conferência curta não se aplica.** O modo base é sempre o checklist inteiro, AS-01 a AS-17.
- **As precondições da §5 valem iguais:** ambiente, `.npmrc`, registro e `MSYS_NO_PATHCONV=1`.
- **Os hosts do `curl` passam a ser quatro (E1).** A lacuna `<endereço>` aceita
  `https://liacup.com.br`, `https://www.liacup.com.br`, `https://portal-liacup.vercel.app` e a
  prévia da change. O motivo: `liacup.com.br` responde 308 para o `www`, então o `www` é a
  produção de fato. A conferência do host montado vale igual: o host é exatamente um dos quatro.
- **O `curl` em produção vale como resultado no modo base**, porque produção é a `main`. É o
  contrário do modo diff, em que produção não mede a change. O host de produção é o `www`, e os
  caminhos possíveis são `/`, `/em-construcao` e `/vitrine`.
- **Quando roda:** nesta change e na última change de cada release, antes de a release ir ao ar.
  Pelo plano de hoje, são a `ajustar-ci-ao-novo-fluxo` na R0 e a `lancamento-r1` na R1.
- **O formato da lista de achados:** as seis coisas, mais a release e a change proposta, ordenadas
  por severidade.
- **A parada:** se um bloco acha bloqueante confirmado e já explorável hoje em produção, o líder
  técnico para os blocos seguintes, reporta ao Gabriel e espera a change de correção imediata.
  Depois do merge dela, o bloco afetado roda de novo, numa invocação nova, e os blocos seguintes
  continuam. É o caminho do `next` na change anterior.

O `MODELO-relatorio.md` não muda. O formato da lista mora na §5, porque só o modo base usa a lista.

**Alternativa descartada:** auditar a `main` como se fosse um diff contra a árvore vazia. Isso
mistura os dois modos e deixa a conferência curta aplicável por engano.

### D4 — Os blocos e a junção (Q7)

Cada arquivo de `git ls-tree -r --name-only main` cai em exatamente um bloco, pela primeira regra
que casar, na ordem da tabela.

| Bloco | Caminhos | Códigos em foco |
| --- | --- | --- |
| 1. Configuração de agente e governança | `CLAUDE.md`, `.claude/`, `.mcp.json`, `openspec/`, `docs/`, `README.md` | AS-17, AS-01, AS-09 |
| 2. Dependências | `package.json`, `package-lock.json`, `.nvmrc` | AS-08, o `corepack` |
| 3. Banco | `supabase/`, `tests/politicas/`, `tests/banco/`, `src/lib/supabase/` | AS-10, AS-16, AS-01 |
| 4. Código do site e ativos | `src/`, `public/`, `assets/`, `prototipo/`, `tests/e2e/`, `next.config.ts` | AS-02 a AS-07, AS-15, AS-01 nos 32 binários |
| 5. CI e cadeia de entrega | `.github/`, `scripts/` e todo arquivo que não casou acima (configuração da raiz: `.gitignore`, `.gitattributes`, `lighthouserc.json`, `vitest*`, `eslint.config.mjs`, `tsconfig.json`, `.prettier*`) | AS-09, AS-01, AS-10 nos dois scripts com a chave de serviço |

Cada código do checklist é conferido em todo bloco a que se aplica. A coluna "em foco" diz onde o
código pesa mais, e não limita a conferência.

A configuração de agente vem primeiro. Se `.claude/` ou o `CLAUDE.md` da `main` tiverem um gancho
ou uma ferramenta a mais, esse problema precisa aparecer antes de qualquer outra invocação.

**Cada bloco** roda numa invocação nova do guardião. A invocação de levantamento recebe a lista do
bloco e devolve achados e pedidos. O líder técnico roda os pedidos que passam na lista fechada.
Depois vem uma invocação de decisão, também nova, igual ao modo diff. Bloco sem pedido dispensa a
invocação de decisão.

**A junção** é uma invocação nova que recebe, pelo texto que o líder técnico cola, os cinco
relatórios de bloco e o resultado dos pedidos de AS-01 no histórico. Ela devolve:

- o estado final de cada código, AS-01 a AS-17;
- a soma dos arquivos por bloco, que precisa dar 297;
- a lista de achados ordenada.

O guardião continua sem abrir o `relatorio.md`.

### D5 — AS-17 (configuração de agente)

O texto vai na §4, em "quando a change toca no assunto". No modo diff, ele se aplica quando o diff
toca algum dos caminhos dele, inclusive arquivo não rastreado. No modo base, ele se aplica sempre.
Caminhos: `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`, `.claude/settings*.json`, `.mcp.json`
e `openspec/config.yaml`.

Bloqueia, como diz o briefing:

- agente que ganha ferramenta de escrita ou de terminal sem decisão registrada;
- gancho, variável de ambiente ou servidor MCP novo sem decisão do Gabriel;
- instrução que enfraquece regra da constitution, dos padrões ou do `SEGURANCA.md`;
- skill gerada pelo OpenSpec alterada à mão.

**Como se confere a skill (Q5 (b)).** Diff que toca `.claude/skills/` só vale se a proposta da
change disser que rodou `openspec update`, com a versão antes e depois. Ele também precisa trazer a
saída de `openspec --version`. Sem isso, BLOQUEADO. O `openspec --version` é forma nova da lista
fechada, só de leitura e sem lacuna. No modo base, o guardião confere o conteúdo das 6 skills como
configuração: `allowed-tools`, ganchos e instruções. Limite declarado: a regra não prova a origem.
Uma alteração à mão feita junto com um update verdadeiro passaria.

Três leituras do texto do briefing, que o Portão 1 não emendou:

- **"Ferramenta" inclui o `allowed-tools` de skill**, e não só o `tools` de agente. As 6 skills já
  declaram `Bash(openspec:*)`. Skill que ganha outra ferramenta é o mesmo caso que agente que ganha
  ferramenta.
- **"Gancho" inclui o declarado no cabeçalho de agente ou de skill**, e não só o do `settings.json`.
- **"Decisão registrada"** é a proposta aprovada no Portão 1 que nomeia a mudança, ou o aceite
  escrito do Gabriel no `relatorio.md`.

Esta change também mexe em `.claude/agents/guardiao-appsec.md`. A mudança não acrescenta
ferramenta, e a decisão é esta proposta, então ela não deve bloquear. A auditoria do diff (4.2)
confere isso como qualquer outra mudança de AS-17.

**O intervalo (Q1 (b)).** Nos 5 lugares do líder técnico, "AS-01 a AS-16" vira "o checklist de
segurança", sem intervalo. A linha `:105` do agente passa a dizer "cada código da §4". A frase da
§4 sobre o próximo código livre passa a citar AS-18.

### D6 — Segredo em binário (Q3 (b), Q4 (a) com (i))

- **O registro de origem** é uma tabela nova no `docs/SEGURANCA.md` (Q4 (a)), com estas linhas:

  | Caminho | Arquivos | Origem |
  | --- | --- | --- |
  | `prototipo/prints/*.png` | 23 | Gerado por rotina versionada: saída de `npm run prints:prototipo` |
  | `assets/logo-liacup.png` | 1 | Ativo aprovado: logo oficial enviada pela liga, em alta resolução e fundo transparente. Está registrada como resolvida no plano de agosto e no `conteudo-institucional.md` |
  | `assets/icone-email-gmail.png` | 1 | Ativo aprovado: ícone do Gmail entregue pela liga para o contato |
  | `assets/logo-liacup-{32,48,96,180,256,512}.png` | 6 | Ativo aprovado: gerados pela coordenação a partir da logo oficial, no pacote da F00 |
  | `public/logo-liacup-256.png` | 1 | Ativo aprovado: cópia idêntica de `assets/logo-liacup-256.png`, com o mesmo blob, `bfa1d3d5` |

  São 32 arquivos. Os 9 de `assets/` e `public/` entraram no commit `6636202` (F00, 21/08). As 6
  logos derivadas contam como "ativo aprovado", e não como "gerado por rotina versionada": a rotina
  da coordenação que as gerou não está no repositório.
- **Binário fora do registro** é achado de AS-01, alto e confirmado (Q4 (i)), então BLOQUEADO até
  a linha entrar. A falta da linha é o que está confirmado.
- **A forma de contagem** entra na lista fechada da §5. Ela usa `-c`, que devolve só
  `arquivo:número`, e `-a`, que trata binário como texto. Há uma variante para uma versão
  registrada (`<rev>`) e outra para a árvore de trabalho (`--untracked`). Pela Q3 (b), `<caminho>`
  pode ser um arquivo ou uma das pastas com binário: `assets`, `prototipo/prints` e `public`. É a
  única exceção à regra "arquivo, nunca pasta", e vale porque a saída não mostra conteúdo. As
  outras recusas da §5 valem iguais. **A medir na tarefa 2.2:** se `-a` vence o atributo `binary`
  do `.gitattributes`. Se não vencer, a forma não serve, e a change para e volta ao Gabriel.
- **Histórico de binário.** Não se presume que `git log -S` ache texto dentro de binário. A tarefa
  2.2 mede isso com `git log --all --oneline -S 'IHDR'`, porque todo PNG tem esse texto no
  cabeçalho. Se a saída trouxer os commits que acrescentaram os PNG, o `-S` alcança binário. Se
  vier vazia, a §5 escreve que o histórico de binário fica coberto só pela origem declarada e pela
  contagem em cada `<rev>`.
- **Limitação escrita na §5:** texto dentro de bloco comprimido não aparece numa busca por texto.
  Entram aí zTXt, iTXt comprimido e o arquivo woff2 inteiro, que é comprimido. É isso que a origem
  declarada cobre. O relatório diz "coberto só pela origem declarada" para esses casos.

**Alternativa descartada:** o guardião ler o binário com a própria ferramenta de leitura. O `Read`
mostra a imagem, não os metadados, e o `Grep` pula binário. Foi esse o cenário da Q11.

### D7 — A classificação dos 34 avisos (Q2 (c))

A lista fechada ganha a forma `npm audit --omit=dev`, sem lacuna e com as mesmas precondições de
`npm`. Ela conta os avisos que chegam à produção. "Quem traz" sai da leitura do lockfile.

O bloco 2 devolve uma tabela com uma linha por aviso e estas colunas:

- pacote e versão;
- severidade;
- produção ou desenvolvimento, conferido contra a saída de `npm audit --omit=dev`;
- onde roda: navegador, servidor, compilação, CI ou só a máquina de quem desenvolve;
- quem o traz, pela cadeia até uma dependência direta;
- se é explorável hoje: sim, não ou hipótese, com o motivo.

A soma por severidade precisa bater com o `npm audit`. A classificação da change anterior (I1 da
passagem 6) é ponto de partida, mas não é resultado: o guardião confere de novo.

### D8 — RP-12 do AS-17

1. O líder técnico guarda o `git status --porcelain --untracked-files=all`.
2. Copia `.claude/agents/especificador.md` para `.claude/agents/especificador-rp12.md`, troca o
   `name` para `especificador-rp12` e acrescenta `Bash` à linha `tools`. O `especificador` serve
   porque não tem `Bash` (`Read, Glob, Grep, Write, Edit`), e porque não é o `revisor` nem o
   guardião. O `name` diferente evita que a cópia ocupe o lugar do agente verdadeiro.
3. Chama o guardião **no modo diff**, com a lista do diff desta change, sem apontar o arquivo
   plantado. O modo base não serve aqui: a lista dele é a `main`, e a cópia não é rastreada.
   Espera BLOQUEADO citando AS-17.
4. Apaga a cópia e confere que o `git status` voltou ao do passo 1.
5. Chama uma invocação nova e espera o achado de AS-17 sobre a cópia sumir.

A cópia nunca entra em commit, ninguém a invoca, e ela é apagada antes da passagem seguinte de
qualquer agente. Nenhum `npm run verificar` roda enquanto ela existe.

### D9 — RP-12 do binário

1. O líder técnico guarda o `git status`.
2. Cria `assets/rp12-teste.png`, não rastreado, com um comando de uma linha que usa o Node já
   instalado. Nenhum arquivo de `scripts/` e nenhuma dependência nova entram. O PNG leva um bloco
   tEXt não comprimido com um segredo falso, num formato que não é de chave real de provedor.
3. Roda a forma de contagem na árvore de trabalho, com `<caminho>` `assets`. Espera
   `assets/rp12-teste.png:<n>`, com n de 1 ou mais, e nenhum pedaço do valor na saída.
4. Apaga o arquivo, roda a mesma forma e espera saída vazia, com código 1. Confere que o
   `git status` voltou ao do passo 1.
5. Faz as duas medições da D6: `-a` contra o atributo `binary`, e `git log -S 'IHDR'`.

A pasta `assets/` foi escolhida porque não vai ao ar. Em `public/` um erro de commit publicaria o
arquivo.

### D10 — O aceite (Q6 (a))

A junção (3.6) termina numa entrega curta ao Gabriel, no modelo do `CLAUDE.md`, só com a lista. O
Gabriel aceita os achados um por um ou em bloco, com a release como prazo, ou recusa. O líder
técnico então faz duas coisas:

- transcreve o aceite literal, com data, no `relatorio.md`;
- acrescenta as linhas na §6.

Só depois disso rodam o `revisor` e o guardião sobre o diff (4.2). Assim, eles veem a §6 como ela
vai entrar na `main`, e não há rodada extra depois do Portão 2.

É um desvio aprovado do briefing, que punha o aceite no Portão 2. O Portão 2 passa a conferir o
aceite já transcrito.

Achado que o Gabriel não aceitar continua bloqueando. A change não chega ao Portão 2 até haver
correção, que é outra change, entrando antes.

A regra mecânica da A3 da change anterior vale aqui. Uma linha da §6 incluída no próprio diff não
vale como aceite pela linha. O guardião confere que cada linha nova da §6 aponta um aceite que o
líder técnico transcreveu, e o gestor confere o aceite literal no Portão 2.

### D11 — Quem escreve cada arquivo

| Quem | Arquivos |
| --- | --- |
| Líder técnico | `docs/SEGURANCA.md`, `.claude/agents/guardiao-appsec.md`, `CLAUDE.md`, a linha da hierarquia em `openspec/config.yaml` e as transcrições do `relatorio.md`. Nenhum desses arquivos está no escopo de um subagente; é o mesmo caso da D11 da `montar-guardiao-appsec` |
| Gestor (Q1) | `docs/constitution.md:86` e `docs/EQUIPE-DE-AGENTES.md:29`, já emendados no disco. Entram no commit da change. O líder técnico não escreve neles; confere |
| Ninguém | `src/`, `tests/`, `supabase/`, `scripts/`, `.github/` e as dependências. Nenhum dev entra nesta change |

### D12 — A parte 6 sai

Com a parte 6 seriam 16 tarefas. Pela regra do briefing, ela vai para a change de CI
(`ajustar-ci-ao-novo-fluxo`), junto com a I3 (busca de segredo antes de cada envio). Os blocos
deixam no relatório o insumo dela: para cada item conferido aqui à mão, se a conferência é mecânica.
Isso é observação, não recomendação com custo.

## Risks / Trade-offs

| Risco | Mitigação |
| --- | --- |
| São pelo menos 12 invocações de `opus`: 5 blocos, as decisões, a junção, 2 do RP-12 e a do diff | Bloco sem pedido dispensa a decisão. O número de invocações vai para o relatório |
| A auditoria acha bloqueante explorável e a change fica parada | É a regra. A correção imediata entra antes, como o `next`, e o bloco roda de novo (D3) |
| O Gabriel não aceita algum achado, e a change não pode corrigir | O achado continua bloqueando, e vira change de correção antes desta fechar (D10) |
| `git log -S` não examina commit de merge (A4) | A busca no histórico declara esse limite. A contagem por `<rev>` na `main` cobre o estado final |
| Busca por texto não acha conteúdo comprimido | A origem declarada cobre, e o relatório diz "coberto só pela origem declarada" (D6) |
| A forma `-a` não vence o atributo `binary` | Medido na 2.2. Se falhar, a change para e volta ao Gabriel, sem inventar outra forma |
| A forma de contagem por pasta, na árvore de trabalho, mostra o nome de um arquivo não rastreado | A saída só traz nome e contagem, nunca conteúdo. É o custo aceito na Q3 (b) |
| A regra da skill (Q5 (b)) não prova a origem | Limite declarado na D5. O conteúdo da skill é auditado como configuração em todo caso |
| A cópia do agente plantada em `.claude/agents/` é carregada como agente na sessão | Ninguém a invoca, ela é apagada antes da passagem seguinte e o `git status` é conferido (D8) |
| Gancho no cabeçalho de agente ou skill roda antes de o guardião ler (passagem 13) | O bloco 1 vem primeiro (D4). Mudar o `CLAUDE.md` para "parar antes do próximo agente" é mudança de processo e fica fora desta change, como achado possível do bloco 1 |
| `.agents/` existe no disco, ignorado, com cópias das skills | Fica fora da lista por definição (D3). Registrado aqui para não parecer esquecido |
| Duas auditorias de base seguidas na R0: esta e a `ajustar-ci-ao-novo-fluxo` | A segunda começa pela §6 e por esta lista, mas continua sendo da `main` inteira, como manda o briefing. O custo dela é declarado na proposta da change de CI |
| Dar nome de dono à lista sem ser dono do backlog | Pela Q8 (b), o guardião sugere a release pela §3, e quem agrupa em change é o líder técnico. O Gabriel ratifica no aceite |

## Migration Plan

Não há migração nem mudança no site. Para voltar atrás, basta reverter o commit: o checklist volta
a AS-16, a §5 perde o modo base e a §6 perde as linhas aceitas.

## Decisões do Portão 1 (20/11/2026)

- **Q1 (b).** "O checklist de segurança", sem intervalo. O gestor já emendou
  `docs/constitution.md` e `docs/EQUIPE-DE-AGENTES.md`, que entram no commit; os outros 5 lugares
  são do líder técnico (D5).
- **Q2 (c).** Uma forma nova, `npm audit --omit=dev`; "quem traz" sai da leitura do lockfile (D7).
- **Q3 (b).** Na forma de contagem, `<caminho>` pode ser uma das pastas com binário (D6).
- **Q4 (a) com (i).** O registro de origem é uma tabela no `docs/SEGURANCA.md`. Binário fora dele é
  AS-01 alto confirmado. A origem dos 9 binários foi confirmada pelo Gabriel (D6).
- **Q5 (b).** Skill só muda com `openspec update` declarado na proposta e com a saída de
  `openspec --version` (D5).
- **Q6 (a).** O aceite é dado numa entrega intermediária, antes da revisão do diff. É desvio
  aprovado do briefing (D10).
- **Q7 (a).** Os cinco blocos do briefing, com a tabela da D4.
- **Q8 (b).** O guardião diz a release, e o líder técnico agrupa os achados em changes.
- **E1.** `https://www.liacup.com.br` entra entre os hosts da forma de `curl`, que passam a ser
  quatro. O `www` é a produção de fato (D3).
