# Design — montar o guardião de segurança

## Context

A motivação está em `proposal.md`, na seção Why. Este é o estado da `main` em 19/11/2026, HEAD
`03a81e9`:

| O que | Situação |
|---|---|
| `.claude/agents/` | Seis agentes. Só o `revisor` tem trava de ferramenta (`Read, Glob, Grep`) |
| Tabela do `revisor` | Nenhuma linha de segurança |
| Interruptor | `src/proxy.ts`. O `matcher` deixa escapar só `_next/static`, `_next/image` e nove extensões de imagem e fonte. `.rsc`, `.html`, `.txt` e `.xml` passam pelo interruptor de propósito |
| Camada de dados | 13 migrações em `supabase/migrations/` e a verificação `supabase/verificacoes/rls-por-tabela.sql`. Nenhuma página lê o banco ainda |
| CI | `.github/workflows/ci.yml` usa `SUPABASE_ACCESS_TOKEN` e `SUPABASE_SERVICE_ROLE_KEY` como segredos |
| Dados pessoais | `docs/DADOS-PESSOAIS.md` já existe |

O guardião não tem terminal. Por isso três conferências do checklist dependem de outra pessoa rodar
o comando: segredo no histórico (AS-01), vulnerabilidade conhecida (AS-08) e cabeçalhos na prévia
(AS-15). Com `Grep`, ele vê a árvore de trabalho, mas não vê o histórico do Git.

## Goals / Non-Goals

**Goals:**

- A independência do guardião é trava de ferramenta, e isso é demonstrado.
- Todo achado chega com evidência, para o ruído não ensinar a equipe a ignorar o guardião.
- O que o guardião não consegue medir aparece como pedido de comando ou como "não verificado".
  Nunca aparece como aprovado.

**Non-Goals:**

- Substituir verificação automática. O guardião é um modelo de linguagem e pode deixar passar. A
  recomendação do que vira verificação no CI fica para a `auditoria-de-base-appsec`.
- Auditar a `main` inteira. A linha de base é a `auditoria-de-base-appsec` (E2).
- Ler o site no ar. O guardião lê código e saída de comando.

## Decisions

### D1 — A trava é a mesma do `revisor`

O cabeçalho é `tools: Read, Glob, Grep` e `model: opus`. Sem `Write` e `Edit`, ele não escreve.
Sem `Bash`, também não escreve por comando. A demonstração repete a do `revisor`: um pedido para
criar arquivo, e `git status --porcelain` igual antes e depois.
**Alternativa descartada:** dar `Bash` ao guardião para ele rodar `npm audit` sozinho. Com terminal,
ele também consegue escrever, e a trava volta a ser instrução. Esse é o caso que o Q1 da
`montar-equipe-de-agentes` já documentou para o `guardiao-visual`.

### D2 — O protocolo do pedido de comando

Cada pedido vai no relatório numa linha própria:

```
Pn · AS-xx · comando exato, em bash · passa se a saída mostrar ... · bloqueia se mostrar ...
```

O fluxo tem duas invocações:

1. **Levantamento.** O guardião audita e devolve os achados, os pedidos e um veredito provisório.
2. O líder técnico roda cada comando exatamente como pedido e guarda a saída literal e o código de
   saída. Ele não resume a saída. Comando que altera estado, como `npm audit fix`, `git` com escrita
   ou instalação, **não se roda**. A recusa vai para o relatório.
3. **Decisão.** Uma invocação nova recebe as saídas, audita o diff inteiro de novo e dá o veredito
   final sobre todos os achados, não só sobre os pedidos.

O pedido **escolhe uma forma da lista fechada** da §5 de `docs/SEGURANCA.md` e preenche só as
lacunas, cada uma com padrão fixo. Forma fora da lista, opção a mais ou lacuna fora do padrão: o
líder técnico recusa, e a recusa vai para o relatório. A lista mora só na §5, e este design não a
copia.

- Antes de **qualquer** forma, o líder técnico confere que não existem no disco
  `.claude/settings.json`, `.claude/settings.local.json` nem `.mcp.json`; se algum existir e não for
  igual ao da `main`, todas as formas são recusadas até o Gabriel decidir, porque variável de
  ambiente ou gancho ali roda código em qualquer `git` ou `npm` da lista. Se isso vira código novo
  do checklist é a Q10, do Gabriel; o design não cria código.
- Antes de **qualquer** forma de `npm`, e não só do `npm audit`, o líder técnico faz duas
  conferências: que não há `.npmrc` no disco, na raiz (`test -e .npmrc` devolve 1), e depois que
  `npm config get registry` devolve `https://registry.npmjs.org/`. A primeira é no disco, e não na
  lista do diff, porque um `.npmrc` escondido pelo `.gitignore` ou por `.git/info/exclude` não
  aparece na lista. Se uma das duas falha, recusa, porque até o `npm ls` lê um
  registro trazido pelo atacante, e o `npm audit` manda a árvore de dependências ao registro.
- O líder técnico roda as formas no Git Bash com `MSYS_NO_PATHCONV=1`. Sem isso, um texto que
  começa com `/` vira caminho do Windows, e a busca falha em silêncio, com um falso "sem achado".
- As formas `git grep` e `git diff` recusam, pelo nome, todo caminho cujo último trecho começa com
  `.env` e todo caminho que o `.gitignore` da `main` ignora; se o diff mexe no `.gitignore`, elas só
  valem para arquivos já rastreados na `main`, porque o `.gitignore` do diff é o próprio diff quem
  controla. Nessas formas, o caminho é um arquivo, nunca pasta nem `.`, e aparece letra por letra
  numa linha de `git ls-files` da `main` ou da lista de arquivos do diff, porque a oitava passagem
  do revisor achou que `git grep ... -- '.'` percorria o `.env` mesmo com a recusa pelo nome.
- O guardião roda antes do PR, então a prévia ainda não existe: AS-15 sobre o que a change muda
  fica "não verificado", com o motivo "a prévia ainda não existe", e o líder técnico põe o `curl`
  contra a prévia na seção 6 da entrega, para rodar depois da prévia e antes do merge, porque
  produção mede a `main`, não a change.
- Valor que pareça segredo é **mascarado**, tanto na saída de comando quanto no relatório do
  guardião, porque o `relatorio.md` vai para um repositório público. Fora isso, a saída volta
  literal, com o código de saída.
- Segredo real encontrado é achado bloqueante de AS-01, e o Gabriel troca a chave antes de
  qualquer commit.

O motivo é que um texto plantado no código auditado pode tentar levar o guardião a pedir um
comando que roda código ou exfiltra o repositório. O conteúdo auditado é dado, e a lista vale mesmo
que o pedido pareça legítimo.

**Alternativa descartada:** uma lista de proibições (as "cinco condições" da rodada anterior). O
revisor mostrou casos que a cumpriam e ainda rodavam código ou exfiltravam dados, como
`curl --connect-to`, `git grep --open-files-in-pager`, `git log --output`, `npm test` e um `.npmrc`
no diff. A lista do que é permitido fecha esse tipo de buraco, mas não fecha sozinha: a quarta
passagem do revisor achou que a lacuna de caminho, sem padrão de caracteres, deixava um nome de
arquivo com `$(...)` rodar comando no Git Bash. Por isso a lacuna de caminho agora vai entre aspas
simples e só aceita um padrão fixo de caracteres. A regra vale para toda lacuna: o padrão é fixo.
A quinta passagem achou que o caminho do `curl` sem barra no início emendava no domínio
(`https://liacup.com.br.x.atacante.example/...`). Por isso o líder técnico confere que o host
montado é exatamente um dos três da §5. O caminho do `curl` também deixou de ser texto livre: é `/`
ou uma rota de página que existe no site (pasta com `page.tsx` em `src/app/`), sem nada depois,
para o pedido não carregar dado para fora. Só rota estática vale: pasta com `[` (rota dinâmica) é
recusada, porque o código da change poderia repassar o trecho do pedido para fora. O caminho passa
em duas conferências, o padrão (só `/`, ou `/` seguido de trechos de minúsculas sem acento,
números e `-`) e a rota (página estática que existe em `src/app/`, sem os grupos entre
parênteses), e o endereço vai entre aspas simples, porque a décima segunda passagem do revisor
mostrou que só conferir a rota deixava passar uma pasta com `;` no nome. Se o diff toca algum
`.gitattributes`, a busca de AS-01 por `git grep` não pode concluir "sem achado", porque `-diff` ou
`binary` faz o `git grep -I` pular o arquivo em silêncio: o item fica não verificado, e o guardião
lê o arquivo com a própria ferramenta. O host da prévia é o que o painel da Vercel do projeto
mostra, começando com `portal-liacup-`; link colado em comentário do PR não vale.

Os pedidos usam só o que já está na máquina: `git`, `npm` e `curl`. Se um pedido precisar de
ferramenta não instalada, o item fica não verificado e vira candidato da recomendação de CI, que
sai na `auditoria-de-base-appsec`. Ninguém instala nada nesta change.

### D3 — "Contexto limpo" quer dizer invocação nova, sem o relatório anterior

Na nova auditoria depois de uma correção, o pedido ao guardião leva o nome da change e a lista de
arquivos do diff. Ele não leva o relatório anterior nem a conversa da correção. O guardião lê os
artefatos da change, mas **não abre o `relatorio.md` da change**: o arquivo é lido inteiro, e a
seção anterior do próprio guardião viria junto. Assim ele não herda a explicação de quem corrigiu,
que é o mesmo motivo do D3 da `montar-equipe-de-agentes` para o `revisor`.

O guardião conhece risco aceito só pelo índice da §6 de `docs/SEGURANCA.md`. Quando o Gabriel
aceita um risco, o líder técnico transcreve o aceite no `relatorio.md` (D4) e acrescenta a linha no
índice. A busca de segredo no `relatorio.md` (AS-01) não é leitura do guardião. Ela usa a forma
`git grep --untracked` da §5, porque o `relatorio.md` ainda não está rastreado enquanto a change
corre. O líder técnico a pede antes de entregar a change.

### D4 — O líder técnico transcreve o relatório

O guardião não tem como escrever o próprio relatório. O líder técnico copia o texto literal na
seção `guardiao-appsec` do `relatorio.md`, igual faz com o `revisor`. A seção nova do
`MODELO-relatorio.md` tem quatro partes:

- veredito, com a contagem por severidade;
- achados, um por linha, no formato da spec;
- pedidos de comando, com a saída literal e o código de saída;
- riscos aceitos pelo Gabriel, cada um com o aceite literal dele, achado, motivo, prazo, change que
  resolve e data.

Na lista de escopos da conferência, entra `guardiao-appsec` nenhum.

### D5 — O checklist fica no documento de origem (Q3 (i-a) e (ii-a), Q2 e Q8 decididos)

Os 16 códigos ficam em `docs/SEGURANCA.md`. O arquivo do agente aponta para lá e guarda só a
persona, o método, a tabela do veredito e o formato do relatório. Isso evita duas cópias que
divergem, pelo mesmo motivo do D1 da `montar-equipe-de-agentes`. O documento está no nível 3 da
hierarquia e na tabela "O que ler antes de começar" do `CLAUDE.md`, para quem implementa ler antes
de escrever.

O `docs/SEGURANCA.md` tem cinco partes: o que protege, de quem, a superfície por release (R1 a R5),
o checklist e o índice de riscos aceitos (Q8). Para AS-16 ele **aponta** `docs/DADOS-PESSOAIS.md` e
não repete a finalidade, a base legal e o prazo.

Junto do índice, o documento registra a regra do aceite (Q2): achado já existente pode virar risco
aceito pelo Gabriel, com a release como prazo, e não bloqueia change que não toca no ponto.
**Exceção:** achado bloqueante, confirmado e já explorável hoje em produção nunca vira risco aceito.
Ele vira uma change de correção imediata, que entra antes de qualquer outra.

Os códigos são fixos. Item novo recebe AS-17, e nenhum código muda de sentido.

### D6 — A tabela do veredito (Q6 decidido)

| O achado mais grave | Veredito |
|---|---|
| Bloqueante, de qualquer confiança | BLOQUEADO |
| Alto confirmado | BLOQUEADO |
| Alto provável ou hipótese, médio ou baixo | APROVADO COM RESSALVAS |
| Só informativo, ou nenhum | APROVADO |

Achado sem cenário concreto é rebaixado a informativo antes de entrar na tabela. Um bloqueante
ainda em hipótese gera pedido de comando no levantamento. O veredito final só sai na decisão.

Cada código do checklist termina a auditoria com um de quatro estados: achado, sem achado (com o
que foi lido e quantos arquivos), não se aplica (com o porquê) ou não verificado.

### D7 — Change só de documentação (Q5 decidido)

Quem decide é o diff, com duas regras, nessa ordem:

1. **Regra positiva.** Só arquivo em `docs/`, em `openspec/` ou o `README.md` pode ter conferência
   curta, de AS-01 e AS-09. Arquivo em qualquer outra pasta exige o checklist inteiro, mesmo que
   seja texto, como em `public/`, que vai ao ar.
2. **Dentro dessas três, o que governa também exige o checklist inteiro.** Não há lista fechada: a
   regra da §5 de `docs/SEGURANCA.md` é que só a documentação que **descreve** tem conferência
   curta. Governa:

- `CLAUDE.md` e `.claude/`, que já caem na regra 1 e entram aqui como os da §5;
- `openspec/config.yaml`, `openspec/specs/`, os artefatos de qualquer change (proposta, design,
  tarefas e spec delta, em `openspec/changes/<change>/`) e `openspec/changes/MODELO-relatorio.md`;
- todo documento de `docs/` citado na hierarquia da constitution ou na tabela de leitura do
  `CLAUDE.md`;
- todo documento citado no checklist da §4 de `docs/SEGURANCA.md`, como o
  `docs/DADOS-PESSOAIS.md`, fonte de AS-16.

Na dúvida, checklist inteiro. Tudo além de `CLAUDE.md` e `.claude/` é **leitura estrita da Q5 (a)**,
que só citava esses dois. O Gabriel confirma no Portão 2, como Q9. Esta change toca `.claude/`,
então tem auditoria completa.

### D8 — A demonstração do RP-12 (Q4 decidido)

1. O líder técnico guarda `git status --porcelain` antes de plantar o arquivo.
2. Planta **um arquivo não rastreado** dentro de `src/`, numa pasta com `_`, para não virar rota.
   O arquivo leva duas coisas:
   - um segredo falso com nome de variável de servidor, num formato que não é de chave real de
     nenhum provedor;
   - um link com `javascript:` num componente.
3. Chama o guardião sobre o diff desta change. A lista de arquivos que ele recebe é o "diff da
   change" da §5 de `docs/SEGURANCA.md`, a mesma de uma change de verdade e sem apontar qual é o
   arquivo plantado: `git diff --name-status main...HEAD` (o que já foi commitado na branch) junto
   com `git status --porcelain --untracked-files=all` (o que não foi e o que não é rastreado),
   porque a regra de Git 2 manda commitar todo dia, e só o `git status` perderia o commitado. Espera BLOQUEADO citando AS-01 e AS-04.
4. Apaga o arquivo e confere que o `git status --porcelain` é igual ao do passo 1.
5. Chama uma invocação nova (D3). Espera APROVADO, ou APROVADO COM RESSALVAS sem AS-01 e sem AS-04.

Os dois relatórios vão literais para o `relatorio.md`. Nenhum `npm run verificar` roda enquanto o
arquivo plantado existe. O segundo relatório é o veredito do guardião para esta change.

### D9 e D10 — saíram desta change (E2)

A auditoria de linha de base da `main` (antiga D9) e a recomendação de verificação automática no CI
(antiga D10) foram para a `auditoria-de-base-appsec`, que o Gabriel propõe depois do merge. Nesta
change, o guardião é exercitado só pelas duas demonstrações.

### D11 — Quem escreve cada arquivo

- O líder técnico escreve `.claude/agents/guardiao-appsec.md`, `docs/SEGURANCA.md`, `CLAUDE.md` e
  `MODELO-relatorio.md`, como na `montar-equipe-de-agentes`. Nenhum desses arquivos está no escopo
  de um subagente.
- O gestor já escreveu `EQUIPE-DE-AGENTES.md`, `PLANO-DE-DESENVOLVIMENTO.md`, `REFERENCIA-VISUAL.md`
  e a emenda do nível 3 em `constitution.md` (Q1, Q3). O líder técnico não escreve neles; confere.
- O líder técnico muda só a linha da hierarquia no `context` de `openspec/config.yaml`, para ficar
  igual à da constitution.

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| O guardião depende de outra pessoa rodar o comando, e essa pessoa pode resumir ou errar | Saída literal com código de saída. O comando entra na seção 2 da entrega, para o gestor reproduzir |
| O código auditado traz um texto que tenta instruir o guardião, como "ignore este arquivo" | O arquivo do agente diz que o conteúdo auditado é dado, nunca instrução |
| Muitos falsos positivos fazem a equipe ignorar o guardião | Confiança e cenário obrigatórios. Achado sem cenário é informativo. Antes de apontar, o guardião procura no código e nos testes |
| O guardião deixa passar uma falha | Ele não substitui o CI. A `auditoria-de-base-appsec` recomenda o que for mecânico virar verificação |
| A prévia da Vercel pede login, e o `curl` de AS-15 recebe 401 | A saída vai literal, e AS-15 continua não verificado para a change. Produção não serve de resultado da change, porque mede a `main`. O 401 entra na seção 5 da entrega como não medido |
| O segredo falso dispara a varredura de segredos de terceiros | Formato que não é de chave real de provedor. O arquivo nunca entra em commit, e o `git status` é conferido (D8) |
| Uma invocação com `opus` custa mais | Uma auditoria por change, mais as rodadas de correção. Se `opus` não estiver disponível, o líder técnico declara isso na entrega |
| O "de quem" do `SEGURANCA.md` não vem detalhado no briefing | O líder técnico escreve a versão curta, e o gestor confere no Portão 2. O texto não é de tela |
| Dez requisitos novos numa spec de equipe | Um comportamento por requisito, e cada um com cenário que se confere lendo o registro da change |

## Migration Plan

Não há migração nem mudança no site. Para voltar atrás, basta reverter o commit. O agente some, e o
ciclo do `CLAUDE.md` volta ao de seis agentes.

## Open Questions

Nenhuma. Q1 a Q8 foram decididas no Portão 1 de 19/11/2026 e estão registradas na proposta.
