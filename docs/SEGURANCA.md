# Segurança do Portal LIACUP

**Versão 2 · 20 de novembro de 2026** · change `auditoria-de-base-appsec`: AS-17, o modo
auditoria de base, a regra do binário e o registro de origem da seção 7. A versão 1, de 19/11, veio
da change `montar-guardiao-appsec`

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
- **AS-17 Configuração de agente:** `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`,
  `.claude/settings*.json`, `.mcp.json` e `openspec/config.yaml`. No modo diff, vale quando o diff
  toca um desses caminhos, inclusive com arquivo não rastreado; no modo base, vale sempre.
  Bloqueia:
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
    verdadeiro passaria. Por isso o conteúdo da skill é auditado como configuração em todo caso.

  Mudança nomeada numa decisão registrada não bloqueia por causa dela, em nenhum dos quatro casos.
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

**Três formas com o segredo de proteção da Vercel** (change `pagina-processo-seletivo`, decisões do
Gabriel de 21/11/2026, Q8 (b) e ajuste 2 do Portão 1). Ficam fora da tabela porque têm `|`. A
primeira mede os cabeçalhos da **prévia da branch**, que a Vercel protege com login; as outras duas
confirmam que o valor do segredo não está em nada rastreado nem na árvore de trabalho (AS-01):

```bash
{ printf 'x-vercel-protection-bypass: '; sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n'; printf '\n'; } | curl -q -sS -I --max-time 20 --proto =https -H @- 'https://<host><caminho>'
sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F -f - <rev>
sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --untracked -f -
sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --cached -f -
```

A segunda forma roda uma vez para **cada** commit de `git rev-list main..HEAD`, com `<rev>` igual
ao sha do commit, porque o push publica também os commits intermediários da branch. A terceira
cobre a árvore de trabalho, e a quarta, o índice. O endereço vai entre aspas simples, como nas
outras formas da tabela.

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
- `<caminho>`: o mesmo padrão e a mesma conferência de rota do `<endereço>` abaixo (`/` sozinho, ou
  uma página estática que existe no site).
- **Variável ausente:** se o `.env` não tiver a linha `VERCEL_AUTOMATION_BYPASS_SECRET=`, o líder
  técnico para e avisa o Gabriel. Não procura o segredo em nenhum outro lugar.
- **Antes de cada uso das três formas**, o líder técnico registra, só por contagem e sem ler o
  valor, a forma da linha no `.env`: uma linha só com o nome, e nenhuma com aspas, `#`, valor
  vazio, espaço ou tab logo depois do `=`, ou espaço ou tab no fim. O espaço do fim se conta
  **depois** de tirar o `\r`, para um espaço antes do `\r` não escapar. O `\r` do fim é esperado e o
  `tr` o tira. O registro diz o método usado. Linha fora dessa forma: o pedido para e o Gabriel é
  avisado, porque a busca procuraria outro texto e daria um "nada achado" falso.
- **Nas duas buscas,** só o código 1 com saída vazia conclui "nada achado". Qualquer outro
  resultado é **não concluído**, inclusive o código 128 ("no pattern given", que é o que o valor
  vazio dá) e uma saída que liste arquivos demais para ser o segredo. Qualquer `arquivo:contagem`
  na saída é achado de AS-01, bloqueante até prova em contrário. O histórico anterior à branch não
  é buscado, porque o `git log -S` exigiria o valor como argumento; os commits da branch, sim,
  um por um, pela segunda forma.
- **Nenhum código lê a variável.** O líder técnico confere, fora da lista fechada e por conta
  própria, na árvore de trabalho inteira, inclusive o que não é rastreado, que
  `git grep -c --untracked -e 'VERCEL_AUTOMATION_BYPASS_SECRET' -- . ':!docs' ':!openspec'
  ':!README.md' ':!.env.example'` dá código 1, e entrega a saída ao guardião. Só esses quatro
  caminhos podem citar o nome. A Vercel também expõe esse nome como
  variável de sistema nos deployments, e o `next dev` local carrega o `.env` inteiro no servidor:
  código que lesse a variável poderia imprimi-la na compilação ou no log.

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
  comentário do PR não vale. O pedido escolhe só o caminho, e ele precisa passar nas duas
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

Antes de **qualquer** forma, o líder técnico confere que não existe no disco nenhum destes
arquivos, que mudam o ambiente em que os comandos rodam: `.claude/settings.json`,
`.claude/settings.local.json` e `.mcp.json` (cada `test -e` devolve código 1). Se algum existir e
não estiver igual ao da `main`, todas as formas são recusadas até o Gabriel decidir, porque uma
variável de ambiente ou um gancho posto ali roda código em qualquer `git` ou `npm` da lista.

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
| LB-05 · AS-17 · média | Arquivo de `.claude/` alterado ou escondido por `.git/info/exclude` não para o ciclo antes do próximo agente | R0 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-06 · AS-09 · média | A precondição da §5 não confere `.git/config`, `.git/hooks/` nem `.git/info/exclude` | R0 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-07 · AS-15 · média | Produção não manda CSP, proteção contra embutimento, `Referrer-Policy`, `Permissions-Policy` nem `nosniff` | R1 | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-08 · AS-09 · média | O `ci.yml` não tem `permissions` e o checkout persiste o `GITHUB_TOKEN` | R1 | `ajustar-ci-ao-novo-fluxo` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-09 · AS-10 · média | A suíte de políticas e de banco não roda no CI | R2 | `ajustar-ci-ao-novo-fluxo` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-10 · AS-10 · média | A barreira 3 procura a chave de serviço num build que nunca a teve, e diz VERIFICADO | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-11 · AS-10 · média | O lint não pega a chave de serviço lida por desestruturação de `process.env` | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-12 · AS-10 · média | Um autenticado altera nome, e-mail, texto e `recebida_em` de mensagem de terceiro | R4 | `seguranca-do-formulario` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-13 · AS-16 · média | A purga é manual e os textos divergem sobre a frequência, contra um prazo de 24 h; o script mira produção por padrão | R4 | `seguranca-do-formulario` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-14 · AS-17 · baixa | O `allowed-tools: Bash(openspec:*)` das 6 skills não tem decisão registrada | R0 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-15 · AS-08 · baixa | O README instala o OpenSpec sem fixar a versão | R0 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-16 · AS-08 · baixa | `vite` e `vitest` vulneráveis, exploráveis só com servidor local do vite ouvindo | R1 | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-17 · AS-09 · baixa | As ações do CI estão presas por tag móvel, não por sha | R1 | `ajustar-ci-ao-novo-fluxo` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-18 · AS-02 · baixa | Com o site publicado, `/vitrine` fica no ar com campos que não enviam nada | R1 | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-19 · AS-04 · baixa | As colunas de URL aceitam `javascript:` e `http:`, e a leitura não confere o esquema | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-20 · AS-10 · baixa | O verificador de RLS soma concessões e ignora visões, funções e TRUNCATE, TRIGGER e REFERENCES | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-21 · AS-10 · baixa | Os scripts leem só o `.env` e tiram só aspas duplas, e podem dar VERIFICADO falso | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-22 · AS-01 · baixa | O protótipo traz uma credencial de demonstração que não pode virar a conta real | R3 | `seguranca-do-painel` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-23 · AS-13 · baixa | A confirmação por e-mail divide a cota do Resend com a recuperação de senha, sem limite global | R4 | `seguranca-do-formulario` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-24 · AS-09 · informativa | O caminho da correção urgente não diz que o guardião audita antes do merge | R0 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-25 · AS-17 · informativa | A hierarquia do README não traz o `SEGURANCA.md` | R0 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-26 · AS-01 · informativa | O protótipo guarda conteúdo comprimido que só a origem declarada cobre, sem estar nomeado na §7 | R0 | `endurecer-agentes-e-git-local` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-27 · AS-08 · informativa | 34 avisos do `npm audit`, 20 altos, um deles de produção (`source-map-js`), sem cenário concreto | R1 | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-28 · AS-02 · informativa | `/_next/static` e imagens passam pelo interruptor; cada arquivo de `public/` precisa estar aprovado | R1 | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-29 · AS-10 · informativa | Nenhuma tabela usa `FORCE ROW LEVEL SECURITY`, sem decisão registrada | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-30 · AS-02 · informativa | O anônimo lê `autor_id` das linhas publicadas | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-31 · AS-10 · informativa | O `verificar-rls` usa `--linked` com `--project-ref` e pode rotular o projeto errado | R2 | `papeis-da-diretoria-no-banco` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-32 · AS-03 · informativa | `alterarComVersao` grava qualquer coluna que recebe | R3 | `seguranca-do-painel` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-33 · AS-06 · informativa | A mensagem crua do banco volta ao chamador | R3 | `seguranca-do-painel` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-34 · AS-15 · informativa | Produção responde `Access-Control-Allow-Origin: *`, que não pode ir para página com sessão | R3 | `seguranca-do-painel` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |
| LB-35 · AS-08 · informativa | O Node 22 do `.nvmrc` sai de suporte em 30/04/2027 | R1 (o Node 22 sai de suporte em 30/04/2027) | `lancamento-r1` | `openspec/changes/archive/2026-11-20-auditoria-de-base-appsec/relatorio.md`, "Aceite do Gabriel", 20/11/2026, em bloco |

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
| `openspec/changes/archive/2026-11-21-pagina-processo-seletivo/prints/{lado-a-lado,raiz-nao-publicada}-*.png` | 9 | **Aprovação pendente** (Portão 2 da `pagina-processo-seletivo`): 7 lado a lado do protótipo e do site e 2 prints da página em construção, tirados pelo `guardiao-visual` com o método escrito no `relatorio.md` da change (script temporário, não versionado). Esta linha passa a "Ativo aprovado", com a data e o aceite do Gabriel transcrito no `relatorio.md`, antes do merge |

Os 9 de `assets/` e `public/` entraram no commit `6636202` (F00, 21/08/2026). Origem confirmada
pelo Gabriel no Portão 1 da `auditoria-de-base-appsec`, em 20/11/2026. Os 15 prints da
`layout-e-hero` ficam na pasta da change até o `openspec archive`, que os leva para o caminho da
tabela no mesmo diff. Os 9 prints da `pagina-processo-seletivo` seguem a mesma regra. Total: 60 arquivos.
