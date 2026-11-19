# Segurança do Portal LIACUP

**Versão 1 · 19 de novembro de 2026** · change `montar-guardiao-appsec`. O Portão 1 aprovou a
proposta e o checklist; este texto é conferido pelo gestor no Portão 2

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

Os códigos são fixos. Item novo recebe o próximo código livre (AS-17), e nenhum código muda de
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
| `git ls-files -- '<caminho>'` | Se um arquivo é rastreado; saída vazia quer dizer que não é |
| `git check-ignore -v -- '<caminho>'` | Se um arquivo é ignorado, e por qual regra |
| `npm ls --depth=0` | Dependências diretas instaladas |
| `npm audit --audit-level=high` | Vulnerabilidade alta ou crítica conhecida (AS-08) |
| `curl -q -sS -I --max-time 20 --proto =https '<endereço>'` | Cabeçalhos que o site devolve (AS-15); o `-q`, primeiro, ignora o `.curlrc` |

As lacunas:

- `<rev>`: `HEAD`, `main`, `origin/main` ou um sha de 7 a 40 caracteres hexadecimais.
- `<caminho>`: entre aspas simples, só com letras sem acento, números, `/`, `.`, `_` e `-`, sem
  começar com `-` ou `/` e sem `..`. Nas formas que mostram conteúdo (`git grep` e `git diff`), o
  `<caminho>` é **um arquivo, nunca uma pasta nem `.`**: ele aparece, letra por letra, numa linha de
  `git ls-files` da `main` ou da lista de arquivos do diff que o guardião recebeu. Pasta inteira se
  busca arquivo por arquivo. Nessas formas, o líder técnico recusa também, **pelo nome e sem
  depender do `.gitignore`**, todo caminho cujo último
  trecho começa com `.env`, e todo caminho que o `.gitignore` da `main` ignora. Se o diff mexe no
  `.gitignore`, essas duas formas só valem para arquivos já rastreados na `main`: o `.gitignore`
  está no diff, e o diff não pode desfazer a regra que o protege. Nas formas que só respondem sim
  ou não (`git ls-files` e `git check-ignore`), vale qualquer caminho no padrão, inclusive
  `.env.local`.
- `<texto>`: entre aspas simples, sem aspas simples dentro e sem quebra de linha.
- `<número>`: de 1 a 200.
- `<endereço>`: o **líder técnico** monta, a partir de `https://liacup.com.br`,
  `https://portal-liacup.vercel.app` ou da prévia da change. O host da prévia é o que o painel da
  Vercel do projeto mostra para a branch, e começa com `portal-liacup-`; link de prévia colado num
  comentário do PR não vale. O pedido escolhe só o caminho, e ele precisa passar nas duas
  conferências: **o padrão**, que é `/` sozinho ou `/` seguido de trechos de letras minúsculas sem
  acento, números e `-`, separados por `/` (nada de espaço, `;`, `@`, `$`, aspas, `[` nem `(`); e
  **a rota**, que é uma página estática que existe no site, uma pasta com `page.tsx` em `src/app/`
  escrita como o visitante a vê, sem os grupos entre parênteses (`src/app/(site)/em-construcao`
  vira `/em-construcao`). Pasta com `[` no nome (rota dinâmica) é recusada, porque o código da
  change poderia repassar o trecho do pedido para fora. O endereço vai entre aspas simples. Antes
  de rodar, o líder técnico confere que o host do endereço montado é exatamente um dos três.

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
| — | Nenhum risco aceito até agora | — | — | — |
