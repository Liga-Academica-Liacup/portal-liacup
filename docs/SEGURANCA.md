# Segurança do Portal LIACUP

**Versão 3 · 21 de novembro de 2026** · change `endurecer-agentes-e-git-local`: a barreira do Git,
a conferência do ambiente local, a conferência proporcional (regra 2 da dieta), a lista nova do
AS-17 e a saída de sete riscos da seção 6. A versão 2, de 20/11, veio da change
`auditoria-de-base-appsec`; a 1, de 19/11, da `montar-guardiao-appsec`

Nível 3 da hierarquia da constitution, ao lado dos padrões de código e da referência visual. Quem
implementa lê antes de escrever; o `guardiao-appsec` lê antes de auditar. A primeira change de cada
release atualiza a seção da release dela, na seção 3.

---

## 1. O que o portal protege

- **A confiança de quem chega.** O público inclui pessoas vivendo o adoecimento de alguém próximo.
  Uma página adulterada, um link que leva a golpe ou um aviso falso em nome da liga faz mal a quem
  já está fragilizado, e à liga.
- **Os dados de quem escreve para a liga**, a partir da R4: nome, e-mail e mensagem. O que se guarda,
  por quê e por quanto tempo está em [`DADOS-PESSOAIS.md`](DADOS-PESSOAIS.md).
- **O painel e as contas da diretoria**, a partir da R3: quem entra no painel publica em nome da liga.
- **As chaves do projeto**: a do Supabase, a da Vercel, a do GitHub e, na R3, a do Resend. Com
  qualquer uma delas, alguém altera o banco, o site ou a entrega sem passar pelo PR.
- **O que ainda não deve aparecer.** Até o lançamento da R1, nada além da página "Portal em
  construção" fica alcançável em produção, nem por endereço técnico.

## 2. De quem

- **Robôs automáticos**, que varrem a internet atrás de chave exposta, formulário aberto e
  dependência com falha conhecida. É o ataque mais provável, e não escolhe alvo.
- **Quem usa a marca da liga para enganar**, embutindo o site em outra página ou mandando link
  parecido.
- **Código de terceiros** que entra pelas dependências ou pelo CI.
- **Erro nosso**: chave colada no código, página publicada antes da hora, permissão larga demais. A
  diretoria muda todo ano, e quem chega não sabe o que a anterior combinou.

## 3. Superfície de ataque por release

### R1 · site estático, sobre o que a R0 deixou

- **Entra:** o interruptor `SITE_PUBLICADO`, páginas com texto fixo, o CI e as dependências.
  Desde a `layout-e-hero` (21/11/2026): a lista única de páginas públicas, em JSON, que gera os
  links da moldura e as URLs que os testes e o Lighthouse medem (AS-02, AS-04); o link externo fixo
  do rodapé para o Instagram, em nova aba, e o `mailto:` (AS-04); o script que roda o Lighthouse
  nos dois modos e o que sobe o `next start` num modo do interruptor posto pelo processo, que o CI
  executa (AS-09).
  Desde a `pagina-processo-seletivo` (21/11/2026): a página `/processo-seletivo`, com texto fixo
  vindo de um arquivo de dados versionado; o link externo fixo do aviso para o Instagram, em nova
  aba (AS-04); título, descrição, canonical e Open Graph montados a partir da lista única (AS-02); e
  o P23, pedido de cabeçalhos à prévia com o segredo de proteção da Vercel lido do `.env` local do
  líder técnico, que nunca é versionado nem impresso (AS-01, AS-15).
- **Pode dar errado:** página escondida alcançável por endereço técnico (AS-02); redirecionamento
  para fora (AS-05); link externo inseguro (AS-04); requisição a terceiro (AS-07); dependência
  vulnerável (AS-08); CI com permissão larga ou segredo no log (AS-09); cabeçalhos ausentes (AS-15).

### R2 · leitura do banco

- **Entra:** notícias e eventos lidos do Supabase.
- **Pode dar errado:** tabela sem RLS ou concessão larga (AS-10); chave de serviço no navegador
  (AS-01, AS-10); erro do banco mostrado ao visitante (AS-06).

### R3 · login e painel

- **Entra:** Supabase Auth, recuperação de senha por e-mail, escrita no banco.
- **Pode dar errado:** ação de servidor sem conferir sessão e papel, ou troca de id (AS-11);
  recuperação que revela se o e-mail existe (AS-12); entrada não validada no servidor (AS-03).

### R4 · formulário público e e-mail

- **Entra:** Fale com a Liga, caixa de mensagens, aviso por e-mail.
- **Pode dar errado:** envio em massa e robôs (AS-13); cabeçalho de e-mail montado com o que o
  visitante digitou (AS-13); dado pessoal sem prazo nem purga (AS-16).

### R5 · uploads

- **Entra:** materiais, galeria, edição de seções.
- **Pode dar errado:** arquivo de tipo ou tamanho não conferido no servidor, nome vindo do
  visitante, armazenamento aberto (AS-14).

## 4. O checklist

Os códigos são fixos. Item novo recebe o próximo código livre (AS-18), e nenhum código muda de
sentido. Todo relatório do guardião cita os achados por código.

### Sempre

- **AS-01 Segredos:** nenhuma chave, token ou senha no repositório, no histórico do diff ou no
  código que vai ao navegador; só variável `NEXT_PUBLIC_` com valor público.
- **AS-02 Exposição:** nada que não deve estar público fica alcançável, inclusive por endereço
  técnico (o caso `/vitrine.rsc` do interruptor).
- **AS-03 Entrada:** todo dado que vem de fora é validado no servidor, mesmo se já validado na tela.
- **AS-04 Saída:** nenhum HTML montado com conteúdo variável sem escape; link externo só com
  `https`, sem `javascript:`, e com `rel="noopener noreferrer"`.
- **AS-05 Redirecionamento:** só para destino fixo; nunca para endereço vindo do pedido.
- **AS-06 Erros e logs:** o usuário não vê pilha nem detalhe interno; log sem dado pessoal.
- **AS-07 Terceiros:** nenhuma requisição a domínio externo ao abrir a página, salvo decisão
  registrada.
- **AS-08 Dependências:** dependência nova justificada; nenhuma vulnerabilidade alta ou crítica
  conhecida; mudança no lockfile explicada; nenhum script de instalação novo.
- **AS-09 CI e cadeia de entrega:** workflow com permissões mínimas, nenhum segredo impresso no log,
  nenhum gatilho que rode código de fork com segredo.

### Quando a change toca no assunto

- **AS-10 Banco:** RLS em toda tabela nova, com teste que bloqueia e teste que permite; concessões
  conferidas; a chave de serviço só em código de servidor.
- **AS-11 Autorização:** toda ação de servidor e rota de API confere sessão e papel no servidor;
  nenhum acesso a registro de outro usuário trocando o id (IDOR).
- **AS-12 Autenticação e sessão:** só pela implementação consagrada (Supabase Auth); recuperação de
  senha sem revelar se o e-mail existe.
- **AS-13 Formulário público:** limite de envio, campo armadilha contra robôs, nenhum cabeçalho de
  e-mail montado com o que o visitante digitou.
- **AS-14 Uploads:** tipo e tamanho conferidos no servidor, nome do arquivo não vem do visitante,
  regras de acesso do armazenamento testadas.
- **AS-15 Cabeçalhos:** política de conteúdo (CSP), proteção contra o site ser embutido em outro,
  `Referrer-Policy` e `Permissions-Policy`, conferidos na prévia.
- **AS-16 LGPD:** dado pessoal só com finalidade, base legal e prazo de retenção, e purga no prazo.
  A finalidade, a base e o prazo de cada dado estão em [`DADOS-PESSOAIS.md`](DADOS-PESSOAIS.md), e
  não se repetem aqui.
- **AS-17 Configuração de agente:** a pasta `.claude/` inteira (agentes, skills, `settings*.json`
  e os ganchos de `.claude/ganchos/`), `.mcp.json`, `openspec/config.yaml` e todo arquivo que uma
  ferramenta de agente de IA lê sozinha ao abrir a pasta, como instrução ou como configuração:
  `CLAUDE.md`, `CLAUDE.local.md` e `AGENTS.md` em qualquer pasta, `GEMINI.md`, `.cursorrules`,
  `.cursor/`, `.windsurfrules`, `.clinerules`, `.github/copilot-instructions.md` e
  `.github/instructions/`. Ferramenta nova com arquivo próprio ganha linha por change. Contam também
  as duas opções do `next.config.*` que fazem o Next escrever instrução a agentes no `AGENTS.md`:
  `agentRules`, que fica `false`, e `experimental.agentFeedback`, que fica desligado. No modo diff,
  vale quando o diff toca um desses caminhos, inclusive com arquivo não rastreado; no modo base,
  vale sempre. Bloqueia:
  - agente ou skill que ganha ferramenta de escrita ou de terminal sem decisão registrada. A
    ferramenta de skill (`allowed-tools`) conta como a de agente (`tools`);
  - gancho, variável de ambiente ou servidor MCP novo sem decisão do Gabriel. Gancho declarado no
    cabeçalho de agente ou de skill conta como gancho;
  - instrução que contradiz ou afrouxa regra da constitution, dos padrões de código ou deste
    documento;
  - skill gerada pelo OpenSpec alterada à mão. Só o `openspec update` muda skill: diff que toca
    `.claude/skills/` só vale se a proposta da change disser que rodou o `openspec update`, com a
    versão antes e depois, e trouxer a saída de `openspec --version`. Sem isso, BLOQUEADO. Limite
    conhecido: a regra não prova a origem, e uma alteração à mão feita junto com um update
    verdadeiro passaria. Por isso o conteúdo da skill é auditado como configuração em todo caso;
  - `agentRules` posto como verdadeiro ou tirado do `next.config.*`, ou `experimental.agentFeedback`
    ligado;
  - arquivo de instrução a agentes da lista acima que aparece no diff, rastreado ou não, inclusive
    gerado por ferramenta (o `AGENTS.md` do `next dev`, por exemplo).

  Mudança nomeada numa decisão registrada não bloqueia por causa dela, em nenhum dos seis casos.
  **Decisão registrada** é a proposta aprovada no Portão 1 que nomeia a mudança, ou o aceite escrito
  do Gabriel no `relatorio.md`. O relatório do guardião cita onde ela está.

## 5. Como um achado deixa de bloquear

- **Pela correção**, conferida numa auditoria nova do guardião.
- **Pelo aceite do Gabriel**, escrito na resposta do portão e transcrito literal, com data, no
  `relatorio.md` da change: achado, motivo, prazo (a release em que se resolve, salvo prazo mais
  curto escrito no aceite) e a change que vai resolvê-lo. O líder técnico
  acrescenta a linha na seção 6. Agente nenhum aceita risco.
- **Risco aceito não bloqueia change que não toca no ponto**, enquanto está no prazo. Vencido o
  prazo sem correção, o achado volta a bloquear.
- **Exceção:** achado **bloqueante, confirmado e já explorável hoje em produção** não vira risco
  aceito. Vira uma change de correção imediata, que entra antes de qualquer outra.

**Depois de toda correção feita depois da revisão do diff**, o `revisor` e o `guardiao-appsec` rodam
de novo, nessa ordem, cada um numa invocação nova, sem o relatório anterior.

**Conferência curta.** Change cujo diff só toca documentação que **descreve** é conferida só em
AS-01 e AS-09. Documentação que descreve é arquivo em `docs/`, em `openspec/` ou o `README.md`;
arquivo em qualquer outra pasta, mesmo que seja texto (por exemplo em `public/`, que vai ao ar),
exige o checklist inteiro. Dentro dessas três, o que **governa** também exige o checklist inteiro:
`CLAUDE.md`, `.claude/`, `openspec/config.yaml`, `openspec/specs/`, os artefatos de qualquer
change (`proposal.md`, `design.md`, `tasks.md` e a spec delta, em `openspec/changes/<change>/`),
`openspec/changes/MODELO-relatorio.md` e todo
documento de `docs/` citado na hierarquia da constitution, na tabela de leitura do `CLAUDE.md` ou
no checklist da seção 4, como o `docs/DADOS-PESSOAIS.md` de AS-16.
Na dúvida, checklist inteiro.

**Conferência proporcional** (regra 2 da dieta, Gabriel, 20/11/2026; escrita aqui pela change
`endurecer-agentes-e-git-local` e em vigor a partir da primeira change aprovada no Portão 1 depois
do merge dela). Fora da auditoria de base, o guardião confere na proporção do risco, e quem decide
é a lista de arquivos do diff, não o julgamento. A ordem é esta, e a primeira resposta "sim" vale:

1. Algum arquivo do diff está na **lista do gatilho**, ou o diff acrescenta `process.env` ou
   `NEXT_PUBLIC_`? Então o checklist inteiro.
2. A change é só de documentação que descreve? Então a conferência curta, AS-01 e AS-09.
3. A change é da R1, e todo arquivo do diff está na **lista de tela**? Então AS-01, AS-02, AS-04,
   AS-07 e AS-15.
4. Qualquer outro caso: o checklist inteiro.

O diff é o do parágrafo seguinte: `git diff --name-only main...HEAD` mais `git status --porcelain
--untracked-files=all`. A busca de conteúdo é `git diff -G 'process\.env|NEXT_PUBLIC_' --name-only
main...HEAD` e, nos arquivos não rastreados, `git grep -c --untracked`.

- **Lista do gatilho:**
  - `.claude/`, `CLAUDE.md`, `.mcp.json`, `openspec/config.yaml`,
    `openspec/changes/MODELO-relatorio.md` e os arquivos de instrução a agentes do AS-17;
  - todo arquivo ou pasta cujo nome começa com `.git`, em qualquer pasta (`.gitignore`,
    `.gitattributes`, `.github/`, o que inclui o CI), mais `.npmrc` e `.nvmrc`;
  - `package.json` e `package-lock.json`;
  - `supabase/`, `src/lib/supabase/`, `tests/politicas/` e `tests/banco/`;
  - `src/proxy.ts`, `next.config.*` e `vercel.json`;
  - `.env*` e `scripts/`;
  - `src/app/(interno)/` e todo `route.ts`;
  - `docs/constitution.md`, `docs/PADROES-DE-CODIGO.md`, `docs/SEGURANCA.md`,
    `docs/DADOS-PESSOAIS.md`, `docs/EQUIPE-DE-AGENTES.md`, `docs/PLANO-DE-DESENVOLVIMENTO.md` e
    `docs/ADR-*`;
  - as specs `equipe-de-agentes`, `camada-de-dados`, `fundacao-e-ci` e `publicacao-do-site`.
- **Lista de tela:**
  - `src/app/(site)/`, fora os `route.ts`, `src/componentes/`, `src/features/`, `src/estilos/` e
    `src/lib/utils/`;
  - `public/`, `assets/` e `tests/e2e/`;
  - `README.md`, `docs/conteudo-institucional.md` e `docs/REFERENCIA-VISUAL.md`;
  - `openspec/changes/<change>/` e o caminho dela em `openspec/changes/archive/`;
  - as specs de `openspec/specs/` que não estão no gatilho.

  Na conferência curta, os artefatos da change e os documentos citados no `CLAUDE.md` governam e
  pedem o checklist inteiro. A ordem acima decide antes: uma change da R1 só de tela que também
  mexe neles fica no passo 3, e não no 2.
- **Quem aplica:** o líder técnico manda ao guardião a lista do diff e a classificação, com o passo
  que decidiu. O guardião confere a classificação pela própria lista e, se discordar, aplica o
  checklist inteiro e diz por quê.
- A auditoria completa roda na última change de cada release (modo auditoria de base, abaixo).

**O diff da change** é tudo o que mudou entre a `main` e a árvore de trabalho: o que já foi
commitado na branch (`git diff --name-status main...HEAD`), o que ainda não foi e o que não é
rastreado (`git status --porcelain --untracked-files=all`). É essa lista, das duas saídas juntas,
que o guardião recebe, e é sobre ela que valem as regras desta seção.

**Modo auditoria de base.** Além do diff de cada change, o guardião audita a `main` inteira:

- **Quando roda:** na `auditoria-de-base-appsec`, a primeira, e na última change de cada release,
  antes de a release ir ao ar (hoje, a `ajustar-ci-ao-novo-fluxo` na R0 e a `lancamento-r1` na R1).
- **A lista auditada** é a saída de `git ls-tree -r --name-only main`, no sha que o líder técnico
  anota no relatório antes do primeiro bloco. (`git ls-files main` não lê revisão e devolve vazio.)
  O número de arquivos conferidos precisa ser igual ao número de linhas dessa saída.
- **AS-01 também no histórico**, pela forma `git log --all --oneline -S '<texto>'`, um padrão por
  pedido. Limite conhecido: o `-S` não examina commit de merge; o estado final é coberto pela busca
  na `main`.
- **Sempre o checklist inteiro** da seção 4. A conferência curta não se aplica. As precondições
  desta seção (ambiente, `.npmrc`, registro e `MSYS_NO_PATHCONV=1`) valem iguais.
- **O `curl` em produção vale como resultado**, porque produção é a `main`. O host é o
  `https://www.liacup.com.br`, porque o `liacup.com.br` responde 308 para ele.
- **Por blocos.** Cada arquivo da lista cai em exatamente um bloco, pela primeira linha que casar,
  nesta ordem:

  | Bloco | Caminhos |
  | --- | --- |
  | 1. Configuração de agente e governança | `CLAUDE.md`, `.claude/`, `.mcp.json`, `openspec/`, `docs/`, `README.md` |
  | 2. Dependências | `package.json`, `package-lock.json`, `.nvmrc` |
  | 3. Banco | `supabase/`, `tests/politicas/`, `tests/banco/`, `src/lib/supabase/` |
  | 4. Código do site e ativos | `src/`, `public/`, `assets/`, `prototipo/`, `tests/e2e/`, `next.config.ts` |
  | 5. CI e cadeia de entrega | `.github/`, `scripts/` e todo arquivo que não casou acima |

  Cada bloco roda numa invocação nova do guardião, com levantamento, pedidos de comando e decisão;
  bloco sem pedido dispensa a decisão. A **junção** é outra invocação nova, que recebe os relatórios
  dos blocos colados pelo líder técnico e devolve o estado final, único, de cada código, a soma dos
  arquivos por bloco e a lista de achados.
- **A lista de achados** é ordenada por severidade. Cada item traz as seis coisas de todo achado, a
  release em que deve ser resolvido (o guardião diz, pela superfície da seção 3) e a change proposta
  para resolvê-lo (o líder técnico agrupa). Vários itens podem apontar a mesma change.
- **A parada:** bloqueante confirmado e já explorável hoje em produção **não entra na lista**. O
  líder técnico para os blocos seguintes e leva o achado ao Gabriel, que abre a correção imediata.
  Depois do merge dela, o bloco afetado roda de novo e os seguintes continuam.
- **O aceite** da lista é dado pelo Gabriel numa entrega intermediária, depois da junção e antes da
  revisão do diff da change. O líder técnico transcreve o aceite literal e acrescenta as linhas da
  seção 6; só então rodam o `revisor` e o guardião sobre o diff. Achado não aceito continua
  bloqueando.

**Arquivo binário.** O `git grep -I` pula binário sem avisar, e o `.gitattributes` da `main` marca
`*.png`, `*.jpg`, `*.woff2` e `*.ico` como `binary`. Por isso:

- **Todo binário do que for auditado tem origem declarada na seção 7.** Binário fora dela é achado
  de AS-01, alto e confirmado: a falta da linha é o que está confirmado.
- **A busca de AS-01 cobre binário** pelas duas formas de contagem da lista fechada, que devolvem só
  `arquivo:número`, nunca o conteúdo. Medido em 20/11: com `-a`, a busca examina o arquivo marcado
  como `binary`, que o `-I` pula; e o `git log -S` alcança texto dentro de binário.
- **Limite conhecido:** texto comprimido dentro do binário (bloco zTXt, iTXt comprimido, o arquivo
  woff2 inteiro) não aparece numa busca por texto. Esse arquivo fica **coberto só pela origem
  declarada**, com essas palavras no relatório, e o AS-01 não aparece como conferido por busca nele.
  O mesmo vale para o `prototipo/Portal-LIACUP.html`, que é texto: a linha 220 é o conteúdo de
  `<script type="__bundler/manifest">` (linha 219), um JSON de uma linha com 1.192.346 caracteres e
  9 entradas em base64, 4 `text/javascript` com `compressed: true`, 4 `font/woff2` e 1 `image/png`,
  essas duas com `compressed: false` (relido pelo líder técnico em 21/11/2026). Esse conteúdo fica
  **coberto só pela origem declarada**, o protótipo aprovado pela liga (`REFERENCIA-VISUAL.md` §1).

**Pedido de comando.** O guardião não tem terminal; o que ele não verifica sozinho volta como
pedido. O motivo das regras abaixo é o texto auditado: um comentário plantado no código pode tentar
levar o guardião a pedir um comando que roda código ou manda o repositório para fora. Por isso a
lista é **fechada**: o pedido escolhe uma destas formas e preenche só as lacunas. Forma que não está
aqui, opção a mais ou lacuna fora do padrão, o líder técnico recusa, e a recusa vai para o
relatório.

| Forma | Para quê |
| --- | --- |
| `git log --all --oneline -S '<texto>'` | Em que commits um texto entrou ou saiu, sem mostrar o conteúdo (AS-01) |
| `git log --oneline -n <número> <rev>` | Histórico recente |
| `git grep -n -I -e '<texto>' <rev> -- '<caminho>'` | Onde um texto aparece num commit |
| `git grep -n -I --untracked -e '<texto>' -- '<caminho>'` | Onde um texto aparece na árvore de trabalho, inclusive em arquivo ainda não commitado, como o `relatorio.md` da change (AS-01) |
| `git diff --stat <rev>..<rev>` | Quais arquivos mudaram entre dois pontos |
| `git diff <rev> -- '<caminho>'` | O que mudou num arquivo rastreado |
| `git grep -c -a -e '<texto>' <rev> -- '<caminho>'` | Quantas vezes um texto aparece em cada arquivo de um commit, binário inclusive, sem mostrar o conteúdo (AS-01) |
| `git grep -c -a --untracked -e '<texto>' -- '<caminho>'` | O mesmo na árvore de trabalho, inclusive em arquivo ainda não commitado (AS-01) |
| `git ls-files -- '<caminho>'` | Se um arquivo é rastreado; saída vazia quer dizer que não é |
| `git ls-tree -r --name-only <rev>` | A lista de arquivos de um commit, só os nomes (modo base) |
| `git check-ignore -v -- '<caminho>'` | Se um arquivo é ignorado, e por qual regra |
| `npm ls --depth=0` | Dependências diretas instaladas |
| `npm audit --audit-level=high` | Vulnerabilidade alta ou crítica conhecida (AS-08) |
| `npm audit --omit=dev` | Os avisos que chegam à produção, sem as dependências de desenvolvimento (AS-08) |
| `openspec --version` | A versão do OpenSpec que gerou as skills (AS-17) |
| `curl -q -sS -I --max-time 20 --proto =https '<endereço>'` | Cabeçalhos que o site devolve (AS-15); o `-q`, primeiro, ignora o `.curlrc` |

**Quatro formas com o segredo de proteção da Vercel** (change `pagina-processo-seletivo`, decisões do
Gabriel de 21/11/2026, Q8 (b) e ajuste 2 do Portão 1). Ficam fora da tabela porque têm `|`. A
primeira mede os cabeçalhos da **prévia da branch**, que a Vercel protege com login; as outras três
confirmam que o valor do segredo não está nos commits da branch, na árvore de trabalho nem no índice
(AS-01):

```bash
{ printf 'x-vercel-protection-bypass: '; sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n'; printf '\n'; } | curl -q -sS -I --max-time 20 --proto =https -H @- 'https://<host><rota>'
sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F -f - <rev>
sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --untracked -f -
sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --cached -f -
```

A segunda forma roda uma vez para **cada** commit de `git rev-list main..HEAD`, com `<rev>` igual
ao sha do commit, porque o push publica também os commits intermediários da branch. **Antes dela**,
o líder técnico registra `git rev-parse main` e o sha de `git ls-remote origin refs/heads/main`. A
busca commit a commit só roda se os dois forem iguais, e então cobre todo commit que o push da
branch publica. Se forem diferentes, o líder técnico para e pede ao Gabriel o `git fetch` e a
atualização da `main` local, porque nenhum agente roda `git fetch`. A terceira forma cobre a árvore
de trabalho, e a quarta, o índice. O endereço vai entre aspas simples, como nas outras formas da
tabela.

- **Antes da primeira execução** das quatro formas, o líder técnico confere `curl --version`: o
  `-H @-` existe desde a 7.55. Versão anterior: não roda, e o item fica não verificado.
- **O commit da prévia.** Antes das quatro formas, quem confere que a prévia serve o commit certo
  da change é o Gabriel, no painel da Vercel, junto com o host. O líder técnico pede essa
  conferência e registra a resposta dele no `relatorio.md` antes de ler o segredo. Nenhum agente
  consulta o commit da prévia por linha de comando: o `gh` é recusado a agente pela barreira do Git.

- O `sed` lê só a linha `VERCEL_AUTOMATION_BYPASS_SECRET=` do `.env`, sem carregar o resto do
  arquivo no ambiente, e o `tr` tira o `\r` (o `.env` é do Windows) e a quebra de linha. O valor
  nunca é argumento de comando: vai pela entrada padrão, para o `curl` (`-H @-`) ou para o `git
  grep` (`-f -`).
- O `curl` roda sem `-v` e sem `-L`: `-I` imprime só os cabeçalhos da **resposta**, nunca os do
  pedido, e o cabeçalho não segue redirecionamento para outro host. Não se manda
  `x-vercel-set-bypass-cookie`, então a resposta não traz cookie de acesso. A saída passa pelo
  mascaramento desta seção como qualquer outra.
- `<host>`: **exatamente** `portal-liacup-git-<branch>-liacup1.vercel.app`, em que `<branch>` é o
  nome da branch da change em minúsculas, com `/` trocado por `-`, e `liacup1` é o identificador do
  time na Vercel (Gabriel, Q8 (b)). A parte antes de `.vercel.app` só tem letras minúsculas sem
  acento, números e `-`, com até 63 caracteres; fora disso, o pedido é recusado antes de qualquer
  outra conferência. Na `pagina-processo-seletivo`:
  `portal-liacup-git-feat-pagina-processo-seletivo-liacup1.vercel.app`. O líder técnico monta o
  host pela regra e o compara, **letra por letra**, com o que o painel da Vercel mostra para a
  branch, **antes** de ler o segredo. Se a parte antes de `.vercel.app` passar de 63 caracteres, a
  Vercel corta o rótulo, a comparação recusa, o pedido para, e o líder técnico pede ao Gabriel o
  host exato daquela change. Esta forma não vale para `liacup.com.br`, `www.liacup.com.br` nem
  `portal-liacup.vercel.app`: lá vale a forma sem segredo da tabela.
- `<rota>`: lacuna própria desta forma, diferente do `<caminho>` das formas de `git`. É `/` sozinho,
  ou `/` seguido de trechos de letras minúsculas sem acento, números e `-`, separados por `/`, e
  precisa ser uma página estática que existe no site, com a mesma conferência de rota do
  `<endereço>` abaixo. Ex.: `/` e `/processo-seletivo`.
- **Variável ausente:** se o `.env` não tiver a linha `VERCEL_AUTOMATION_BYPASS_SECRET=`, o líder
  técnico para e avisa o Gabriel. Não procura o segredo em nenhum outro lugar.
- **Antes de cada uso das quatro formas**, o líder técnico registra, só por contagem e sem ler o
  valor, a forma da linha no `.env`: uma linha só com o nome, e nenhuma com aspas, `#`, valor
  vazio, espaço ou tab logo depois do `=`, ou espaço ou tab no fim. O espaço do fim se conta
  **depois** de tirar o `\r`, para um espaço antes do `\r` não escapar. O `\r` do fim é esperado e o
  `tr` o tira. O registro diz o método usado. Linha fora dessa forma: o pedido para e o Gabriel é
  avisado, porque a busca procuraria outro texto e daria um "nada achado" falso.
- **Nas três buscas,** só o código 1 com saída vazia conclui "nada achado". Qualquer outro
  resultado é **não concluído**, inclusive o código 128 ("no pattern given", que é o que o valor
  vazio dá) e uma saída que liste arquivos demais para ser o segredo. Qualquer `arquivo:contagem`
  na saída é achado de AS-01, bloqueante até prova em contrário. O histórico anterior à branch não
  é buscado, porque o `git log -S` exigiria o valor como argumento; os commits da branch, sim,
  um por um, pela segunda forma.
- **Nenhum código lê a variável pelo nome.** O líder técnico confere, fora da lista fechada e por conta
  própria, na árvore de trabalho inteira, inclusive o que não é rastreado, que
  `git grep -c --untracked -e 'VERCEL_AUTOMATION_BYPASS_SECRET' -- . ':!docs' ':!openspec'
  ':!README.md' ':!.env.example'` dá código 1, e entrega a saída ao guardião. Só esses quatro
  caminhos podem citar o nome. A Vercel também expõe esse nome como
  variável de sistema nos deployments, e o `next dev` local carrega o `.env` inteiro no servidor:
  código que lesse a variável poderia imprimi-la na compilação ou no log. **Limite conhecido:** a
  conferência pega só a leitura pelo nome, e não a leitura dinâmica. **Leitura dinâmica** é ler
  `process.env` com um nome que vem de variável ou de argumento, percorrer o ambiente, ou repassá-lo
  inteiro. Hoje:
  - **leitura dinâmica restrita:** `tests/politicas/ambiente.ts`, em que `exigir(nome)` e o
    carregador leem `process.env[nome]` com nome que vem de argumento, mas recusam antes todo nome
    fora da lista do arquivo; e `tests/barreiras/ambiente-dos-testes-de-politica.test.ts`, que
    percorre o ambiente só para salvá-lo e restaurá-lo, sem imprimir;
  - **leitura por nome fixo:** `scripts/purgar-dado-pessoal.mjs:36`, com o nome que o chamador passa
    sempre como constante, `scripts/verificar-chave-de-servico.mjs:45`,
    `scripts/verificar-tipos-do-banco.mjs:56`, e a conferência do ambiente local, que lê `PATH` e
    `SYSTEMROOT` e só os repassa ao Git;
  - **ambiente repassado inteiro:** `scripts/iniciar-servidor.mjs:39`, ao `next start`, sem imprimi-lo.

  Linhas conferidas em 21/11/2026.

As lacunas:

- `<rev>`: `HEAD`, `main`, `origin/main` ou um sha de 7 a 40 caracteres hexadecimais.
- `<caminho>`: entre aspas simples, só com letras sem acento, números, `/`, `.`, `_` e `-`, sem
  começar com `-` ou `/` e sem `..`. Nas formas que mostram conteúdo (`git grep -n` e `git diff`),
  o `<caminho>` é **um arquivo, nunca uma pasta nem `.`**: ele aparece, letra por letra, numa linha
  de `git ls-tree -r --name-only main` ou da lista de arquivos do diff que o guardião recebeu. Pasta
  inteira se busca arquivo por arquivo. **Única exceção:** nas duas formas de contagem (`git grep
  -c -a`), que nunca mostram conteúdo, o `<caminho>` pode ser também uma das pastas que guardam
  binário: `assets`, `prototipo/prints` ou `public`. Nas formas de conteúdo e de contagem, o líder
  técnico recusa também, **pelo nome e sem
  depender do `.gitignore`**, todo caminho cujo último
  trecho começa com `.env`, e todo caminho que o `.gitignore` da `main` ignora. Se o diff mexe no
  `.gitignore`, as formas de conteúdo (`git grep -n` e `git diff`) e as duas de contagem só valem
  para arquivos já rastreados na `main`, e a exceção de pasta das formas de contagem deixa de valer: o `.gitignore`
  está no diff, e o diff não pode desfazer a regra que o protege. Nas formas que só respondem sim
  ou não (`git ls-files` e `git check-ignore`), vale qualquer caminho no padrão, inclusive
  `.env.local`.
- `<texto>`: entre aspas simples, sem aspas simples dentro e sem quebra de linha.
- `<número>`: de 1 a 200.
- `<endereço>`: o **líder técnico** monta, a partir de `https://liacup.com.br`,
  `https://www.liacup.com.br` (a produção de fato, porque o primeiro responde 308 para ele),
  `https://portal-liacup.vercel.app` ou da prévia da change. O host da prévia é o que o painel da
  Vercel do projeto mostra para a branch, e começa com `portal-liacup-`; link de prévia colado num
  comentário do PR não vale. O pedido escolhe só a rota, no padrão da lacuna `<rota>`, e ela precisa passar nas duas
  conferências: **o padrão**, que é `/` sozinho ou `/` seguido de trechos de letras minúsculas sem
  acento, números e `-`, separados por `/` (nada de espaço, `;`, `@`, `$`, aspas, `[` nem `(`); e
  **a rota**, que é uma página estática que existe no site, uma pasta com `page.tsx` em `src/app/`
  escrita como o visitante a vê, sem os grupos entre parênteses (`src/app/(site)/em-construcao`
  vira `/em-construcao`). Pasta com `[` no nome (rota dinâmica) é recusada, porque o código da
  change poderia repassar o trecho do pedido para fora. O endereço vai entre aspas simples. Antes
  de rodar, o líder técnico confere que o host do endereço montado é exatamente um dos quatro.

**A prévia ainda não existe quando o guardião audita**: ele roda antes do archive e do PR. Por isso,
um pedido de AS-15 sobre o que a change muda fica **não verificado**, com esse motivo, e o líder
técnico põe o `curl` contra a prévia na seção 6 da entrega, para rodar depois que a Vercel gerar o
link e antes do merge. O `curl` em produção mede a `main`, não a change, e não serve de resultado
dela.

**A conferência do ambiente local.** Antes de **cada** leva de formas, antes de entregar os
comandos Git ao Gabriel e depois de cada passagem de subagente, o líder técnico roda
`node scripts/conferir-ambiente-local.mjs --change <change>`, com o `node` direto e sem `npm run`
(o `npm` leria o `.npmrc` e rodaria scripts antes dela), e só segue com código 0. Ela existe porque
um gancho, uma variável de ambiente ou uma chave do Git posta no lugar errado roda código em
qualquer `git` ou `npm` da lista. A conferência:

- **lê como texto, antes de rodar qualquer `git`,** o `.git/config` contra uma lista de chaves
  permitidas (chave fora da lista, `include` ou `includeIf` param; ela imprime o nome da chave, nunca
  o valor), os arquivos de `.git/hooks/` que não terminam em `.sample`, as linhas ativas de
  `.git/info/exclude` e de `.git/info/attributes`, e o `disableAllHooks` das configurações do
  Claude Code. Se algo parar aqui, ela sai sem rodar o Git;
- **compara com a `main`, pelo conteúdo e sem depender do `git status`,** todo arquivo da lista do
  AS-17 que está no disco, inclusive o que o `.gitignore` ou o exclude escondem. Arquivo diferente,
  só no disco ou só na `main` é diferença;
- **aceita uma diferença só se ela estiver decidida:** registrada pelo líder técnico em
  `openspec/changes/<change>/ambiente-decidido.txt`, com o sha256 do conteúdo e a decisão citada (a
  proposta aprovada no Portão 1 ou o aceite escrito do Gabriel). Assim o `.claude/settings.json`
  vale igual ao da `main` ou igual ao registrado como decidido na change em curso.
  `.claude/settings.local.json` e `.mcp.json`, que não existem na `main`, param a conferência até o
  Gabriel decidir;
- **diz quanto mediu:** arquivos comparados, iguais, diferentes e aceitos, regras de exclusão,
  ganchos do Git ativos, chaves do `.git/config` e se os ganchos do Claude Code estão ligados.

**A barreira do Git.** Todo comando de agente, pelas três ferramentas que rodam comando (`Bash`,
`PowerShell` e `mcp__terminal__run_in_terminal`), passa por `.claude/ganchos/barrar-git-de-escrita.mjs`,
registrado em `.claude/settings.json`. Ele deixa passar só a lista de leitura do `git` e recusa
todo o resto, inclusive o `gh` e o que não conseguir analisar. As regras de negação do mesmo arquivo
seguram as formas diretas com os ganchos desligados; a `mcp__terminal__run_in_terminal`, que digita
no terminal do Gabriel, fica negada inteira no projeto. Por causa da barreira, um pedido de comando
que só **cita** uma escrita no Git (um `<texto>` como `git push`) também é recusado; o líder técnico
registra a recusa e o guardião lê o arquivo pela própria ferramenta de leitura.

**A configuração que segura a barreira** (decisão do Gabriel, 21/11/2026, depois de o passo 4 da
demonstração mostrar que um `.claude/settings.local.json` com `disableAllHooks` desliga o gancho):
`.claude/settings.json`, `.claude/settings.local.json` e `.claude/ganchos/` têm regra de negação de
escrita, e o gancho recusa todo comando que cite `.claude/settings` ou `.claude/ganchos` (falso
positivo aceito). Mudar esses arquivos é passo do Gabriel: o líder técnico prepara o conteúdo e
entrega o comando, como no Git. E o primeiro comando da lista de comandos Git de toda change é
`node scripts/conferir-ambiente-local.mjs --change <change>`, no terminal do Gabriel; se não sair com
código 0, o Gabriel para.

**Limite conhecido** (Gabriel, Q13 (b), 22/11/2026): **a barreira é contra engano, não contra
agente que esconde o comando.** Contra isso valem as leituras depois de cada passagem (índice,
`HEAD`, commits alcançáveis, remoto e conferência do ambiente) e o fato de que só o Gabriel faz
push. O gancho lê o texto do comando, e deixa passar, entre outros:

- o nome que o shell monta na hora a partir de texto fixo: `${X:-git} add .`, `$'\x67it' add .`,
  `g{i..i}t add .`, `/mingw64/bin/g?t.exe add .` e `$(printf 'g%s' it)`;
- um script ou programa que roda o Git por dentro: `sh scripts/x.sh`, `node arquivo.mjs` ou
  `npm run <qualquer>`, com o `git add` escrito no arquivo, e não no comando.

As leituras, feitas pelo líder técnico depois de cada passagem: `git diff --cached
--name-only` vazio (pega `add`, `rm`, `restore --staged`); `git rev-parse HEAD` e o número de linhas
de `git rev-list --all` iguais aos de antes (pegam commit, tag e branch novos, que não mudam o
índice); `git ls-remote origin <branch>` igual ao de antes (pega push); e a conferência do ambiente.
Mudança que nenhuma dessas leituras mostra não é pega.

**A configuração protegida e o guardião.** Como o gancho recusa todo comando que cite
`.claude/settings` ou `.claude/ganchos`, uma forma da lista fechada com `<caminho>` nesses arquivos
(por exemplo `git diff main -- '.claude/settings.json'`) é recusada também ao líder técnico. Nesse
caso o guardião lê o arquivo pela própria ferramenta de leitura, e a comparação com a `main` vem da
conferência do ambiente, que dá o sha256 do disco e o confronta com o registro da change; se o
guardião precisar do diff linha a linha, o líder técnico pede ao Gabriel que rode a forma no
terminal dele e devolve a saída literal.

Antes de **qualquer** forma de `npm`, o líder técnico confere primeiro que **não existe `.npmrc`
no disco**, na raiz do repositório, com `test -e .npmrc` devolvendo código 1. A conferência é no
disco e não na lista do diff, porque um `.npmrc` escondido pelo `.gitignore` ou por
`.git/info/exclude` não aparece na lista, e o próprio `npm config` já leria esse arquivo. Depois, que `npm config get registry`
devolve `https://registry.npmjs.org/`; se não, recusa. O `npm audit` manda a árvore de dependências
ao registro configurado, e o npm lê o `.npmrc` em todo comando.

Se o diff da change toca algum `.gitattributes`, de qualquer pasta, a busca de AS-01 nas formas
de `git grep` **não pode concluir "sem achado"**: um atributo `-diff` ou `binary` faz o `git grep
-I` pular o arquivo em silêncio. O item fica **não verificado**, com esse motivo, e o guardião lê o
arquivo com a própria ferramenta de leitura.

O líder técnico roda as formas no Git Bash com `MSYS_NO_PATHCONV=1` no ambiente. Sem isso, o
Git Bash troca um `<texto>` que começa com `/` por um caminho do Windows antes de entregá-lo ao
`git`, e a busca falha em silêncio, o que viraria um "sem achado" falso.

**Segredo nunca é transcrito.** A saída volta literal e com o código de saída, sem resumo, **com uma
exceção**: valor que pareça chave, token, senha ou cadeia de conexão é trocado por
`[MASCARADO · <n> caracteres · arquivo:linha]`, tanto na saída de comando quanto no relatório do
guardião. O `relatorio.md` vai para um repositório público. Antes de entregar a change, o líder
técnico pede ao guardião a busca de segredo no `relatorio.md` pela forma `git grep --untracked`, e
o mascaramento é conferido de novo nessa saída. Segredo real encontrado é achado
bloqueante de AS-01, e o líder técnico avisa o Gabriel para trocar a chave antes de qualquer commit.

## 6. Riscos aceitos em aberto

A auditoria seguinte começa por aqui, e é só por aqui que o guardião conhece um risco aceito. Uma
linha por risco, apontando o `relatorio.md` onde está o aceite literal. Sai da lista quando a
correção foi auditada. Bloqueante confirmado e explorável hoje em produção nunca entra nesta lista
(seção 5).

| Código | Achado | Prazo | Change que resolve | Aceite |
| --- | --- | --- | --- | --- |
| LB-01 · AS-10 · bloqueante | Qualquer conta autenticada do Supabase vale como diretoria: lê mensagens e rascunhos e altera conteúdo. **Condição do aceite:** cadastro público e login anônimo desligados em produção até a R2 (conferido pelo Gabriel em 20/11: desligados, 0 contas, 0 mensagens). O Gabriel confere de novo no painel antes de cada release; se a condição cair, o LB-01 volta a bloquear | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em separado |
| LB-02 · AS-09 · alta | O PAT do Supabase e a chave de serviço chegam a passos do CI que rodam código do PR e das dependências | R1 | `ajustar-ci-ao-novo-fluxo` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-03 · AS-10 · alta | O seed apaga sem filtro as 11 coleções do projeto ligado, que pode ser o de produção | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-04 · AS-13 · alta | O anônimo insere em `mensagens` direto pela API, sem limite, e escolhe `situacao` e `recebida_em` | R4 | `seguranca-do-formulario` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-07 · AS-15 · média | Produção não manda CSP, proteção contra embutimento, `Referrer-Policy`, `Permissions-Policy` nem `nosniff` | R1 | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-08 · AS-09 · média | O `ci.yml` não tem `permissions` e o checkout persiste o `GITHUB_TOKEN` | R1 | `ajustar-ci-ao-novo-fluxo` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-09 · AS-10 · média | A suíte de políticas e de banco não roda no CI | R2 | `ajustar-ci-ao-novo-fluxo` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-10 · AS-10 · média | A barreira 3 procura a chave de serviço num build que nunca a teve, e diz VERIFICADO | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-11 · AS-10 · média | O lint não pega a chave de serviço lida por desestruturação de `process.env` | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-12 · AS-10 · média | Um autenticado altera nome, e-mail, texto e `recebida_em` de mensagem de terceiro | R4 | `seguranca-do-formulario` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-13 · AS-16 · média | A purga é manual e os textos divergem sobre a frequência, contra um prazo de 24 h; o script mira produção por padrão | R4 | `seguranca-do-formulario` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-16 · AS-08 · baixa | `vite` e `vitest` vulneráveis, exploráveis só com servidor local do vite ouvindo | R1 | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-17 · AS-09 · baixa | As ações do CI estão presas por tag móvel, não por sha | R1 | `ajustar-ci-ao-novo-fluxo` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-18 · AS-02 · baixa | Com o site publicado, `/vitrine` fica no ar com campos que não enviam nada | R1 | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-19 · AS-04 · baixa | As colunas de URL aceitam `javascript:` e `http:`, e a leitura não confere o esquema | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-20 · AS-10 · baixa | O verificador de RLS soma concessões e ignora visões, funções e TRUNCATE, TRIGGER e REFERENCES | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-21 · AS-10 · baixa | Os scripts leem só o `.env` e tiram só aspas duplas, e podem dar VERIFICADO falso | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-22 · AS-01 · baixa | O protótipo traz uma credencial de demonstração que não pode virar a conta real | R3 | `seguranca-do-painel` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-23 · AS-13 · baixa | A confirmação por e-mail divide a cota do Resend com a recuperação de senha, sem limite global | R4 | `seguranca-do-formulario` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-27 · AS-08 · informativa | 34 avisos do `npm audit`, 20 altos, um deles de produção (`source-map-js`), sem cenário concreto | R1 | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-28 · AS-02 · informativa | `/_next/static` e imagens passam pelo interruptor; cada arquivo de `public/` precisa estar aprovado | R1 | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-29 · AS-10 · informativa | Nenhuma tabela usa `FORCE ROW LEVEL SECURITY`, sem decisão registrada | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-30 · AS-02 · informativa | O anônimo lê `autor_id` das linhas publicadas | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-31 · AS-10 · informativa | O `verificar-rls` usa `--linked` com `--project-ref` e pode rotular o projeto errado | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-32 · AS-03 · informativa | `alterarComVersao` grava qualquer coluna que recebe | R3 | `seguranca-do-painel` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-33 · AS-06 · informativa | A mensagem crua do banco volta ao chamador | R3 | `seguranca-do-painel` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-34 · AS-15 · informativa | Produção responde `Access-Control-Allow-Origin: *`, que não pode ir para página com sessão | R3 | `seguranca-do-painel` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-35 · AS-08 · informativa | O Node 22 do `.nvmrc` sai de suporte em 30/04/2027 | R1 (o Node 22 sai de suporte em 30/04/2027) | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |

### Saíram da lista

Cada linha saiu depois de conferida pelo `guardiao-appsec` (decisão da auditoria da change, APROVADO
COM RESSALVAS, 22/11/2026). A evidência está no relatório da change, na seção citada.

| Código | Achado | Saiu em | Change | Evidência |
| --- | --- | --- | --- | --- |
| LB-05 · AS-17 · média | Arquivo de `.claude/` alterado ou escondido por `.git/info/exclude` não parava o ciclo antes do próximo agente | 22/11/2026 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-22-endurecer-agentes-e-git-local/relatorio.md`, "RP-12 do D4, literal" e tarefa 2.1: a conferência do ambiente local lê o disco e para |
| LB-06 · AS-09 · média | A precondição da §5 não conferia `.git/config`, `.git/hooks/` nem `.git/info/exclude` | 22/11/2026 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-22-endurecer-agentes-e-git-local/relatorio.md`, "RP-12 do D4, literal" e tarefa 2.1: a conferência lê os três antes de rodar o Git |
| LB-14 · AS-17 · baixa | O `allowed-tools: Bash(openspec:*)` das 6 skills não tinha decisão registrada | 22/11/2026 | `endurecer-agentes-e-git-local` | Por decisão: Q5 (a) do Portão 1, em `openspec/changes/archive/2026-11-22-endurecer-agentes-e-git-local/relatorio.md`, "Decisões do Gabriel no Portão 1" |
| LB-15 · AS-08 · baixa | O README instalava o OpenSpec sem fixar a versão | 22/11/2026 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-22-endurecer-agentes-e-git-local/relatorio.md`, "Tarefa 6.2 e as verificações de texto" (tarefa 5.3): `@fission-ai/openspec@2.1.0` |
| LB-24 · AS-09 · informativa | O caminho da correção urgente não dizia que o guardião audita antes do merge | 22/11/2026 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-22-endurecer-agentes-e-git-local/relatorio.md`, "Tarefa 6.2 e as verificações de texto" (tarefa 5.3): README e `PADROES-DE-CODIGO.md` §8; ADR-0005 intocado (Q7 (a)) |
| LB-25 · AS-17 · informativa | A hierarquia do README não trazia o `SEGURANCA.md` | 22/11/2026 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-22-endurecer-agentes-e-git-local/relatorio.md`, "Tarefa 6.2 e as verificações de texto" (tarefa 5.3) |
| LB-26 · AS-01 · informativa | O protótipo guardava conteúdo comprimido que só a origem declarada cobre, sem estar nomeado | 22/11/2026 | `endurecer-agentes-e-git-local` | Linha 220 relida pelo líder técnico (ajuste 4 do Portão 1); o arquivo fica nomeado no "Limite conhecido" do arquivo binário, na §5 |

## 7. Origem dos arquivos binários

Todo arquivo binário rastreado tem uma linha aqui (regra da seção 5). A origem é **gerado por
rotina versionada** no repositório, ou **ativo aprovado**, com quem aprovou. Change que acrescenta
binário acrescenta a linha no mesmo diff; sem ela, é achado de AS-01, alto e confirmado.

| Caminho | Arquivos | Origem |
| --- | --- | --- |
| `prototipo/prints/*.png` | 23 | Gerado por rotina versionada: saída de `npm run prints:prototipo` (RP-13) |
| `assets/logo-liacup.png` | 1 | Ativo aprovado: logo oficial enviada pela liga, em alta resolução e fundo transparente, registrada como resolvida no plano de agosto e no `conteudo-institucional.md` |
| `assets/icone-email-gmail.png` | 1 | Ativo aprovado: ícone do Gmail entregue pela liga para o contato |
| `assets/logo-liacup-{32,48,96,180,256,512}.png` | 6 | Ativo aprovado: gerados pela coordenação a partir da logo oficial, no pacote da F00. A rotina que os gerou não está no repositório |
| `public/logo-liacup-256.png` | 1 | Ativo aprovado: cópia idêntica de `assets/logo-liacup-256.png`, com o mesmo blob (`bfa1d3d5`) |
| `public/icone-da-aba-{32,48,96}.png` e `public/icone-da-tela-de-inicio-180.png` | 4 | Ativo aprovado: cópias idênticas de `assets/logo-liacup-{32,48,96,180}.png` (mesmo sha256 e mesmo blob), o ícone da aba pedido pelo Gabriel na `REFERENCIA-VISUAL.md` §7 em 21/11/2026 (`layout-e-hero`) |
| `openspec/changes/archive/2026-11-21-layout-e-hero/prints/qn-foto-{a,b,c}-{390,1280}.png` | 6 | Ativo aprovado: esboços do espaço da foto do hero, feitos pelo líder técnico sobre o protótipo, vistos e decididos pelo Gabriel no Portão 1 da `layout-e-hero` (Q2, 20/11/2026) |
| `openspec/changes/archive/2026-11-21-layout-e-hero/prints/{antes,depois}-raiz-nao-publicada-{390,1280}.png` | 4 | Ativo aprovado: prints da página em construção antes e depois da `layout-e-hero`, tirados pelo `guardiao-visual` com o método escrito no `relatorio.md` da change (script temporário, não versionado). Aprovados pelo Gabriel na Q5 (a), 21/11/2026 |
| `openspec/changes/archive/2026-11-21-layout-e-hero/prints/lado-a-lado-*.png` | 5 | Ativo aprovado: lado a lado do protótipo e do site, montados pelo `guardiao-visual` com o método escrito no `relatorio.md` da change (script temporário, não versionado). Aprovados pelo Gabriel na Q5 (a), 21/11/2026 |
| `openspec/changes/archive/2026-11-21-pagina-processo-seletivo/prints/{lado-a-lado,raiz-nao-publicada}-*.png` | 9 | Ativo aprovado: 7 lado a lado do protótipo e do site e 2 prints da página em construção, tirados pelo `guardiao-visual` com o método escrito no `relatorio.md` da change (script temporário, não versionado); os 2 lado a lado da página, refeitos pelo líder técnico com o mesmo script depois da Q19. Aprovados pelo Gabriel na Q15 (a), 21/11/2026, Portão 2. O caminho é o do `openspec archive`, feito em 21/11/2026 |
| `openspec/changes/archive/2026-11-22-pagina-sobre-e-equipe/prints/q3-opcao-{a,b,c}-{390,1280}.png` | 6 | Ativo aprovado: esboços estáticos da Q3, com o texto do `conteudo-institucional.md` §2.3 a §2.6, gerados pelo líder técnico com um script Playwright temporário, fora do repositório, com o método escrito no `relatorio.md` da change. Vistos e decididos pelo Gabriel no Portão 1 da `pagina-sobre-e-equipe` (Q3 (a), 22/11/2026) |
| `openspec/changes/archive/2026-11-22-pagina-sobre-e-equipe/prints/{lado-a-lado,raiz-nao-publicada}-*.png` | 13 | Ativo aprovado: 11 lado a lado do protótipo e do site e 2 prints da página em construção, tirados pelo `guardiao-visual` com o método escrito no `relatorio.md` da change (script temporário, não versionado). Aprovados pelo Gabriel na Q16 (a), 22/11/2026, Portão 2 |

Os 9 de `assets/` e `public/` entraram no commit `6636202` (F00, 21/08/2026). Origem confirmada
pelo Gabriel no Portão 1 da `auditoria-de-base-appsec`, em 20/11/2026. Os 15 prints da
`layout-e-hero` ficam na pasta da change até o `openspec archive`, que os leva para o caminho da
tabela no mesmo diff. Os 9 prints da `pagina-processo-seletivo` seguem a mesma regra, e os 19 da
`pagina-sobre-e-equipe` também: se o archive cair em outra data, o caminho das duas linhas muda no
mesmo diff. Total: 79 arquivos.
