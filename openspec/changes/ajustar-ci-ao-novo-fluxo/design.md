# Design — ajustar o CI ao novo fluxo

## Context

O motivo está na proposta, em "Why". O estado de hoje que molda a solução:

- O `ci.yml` tem um job, `Verificacoes`, que roda em `pull_request` e em `push` para a `main`. Não
  declara `permissions` e usa `actions/checkout@v4`, `actions/setup-node@v4` e
  `actions/upload-artifact@v4`. O `npm ci` roda antes dos dois passos que recebem segredo: os tipos
  do banco, com `SUPABASE_ACCESS_TOKEN`, e a barreira 3, com `SUPABASE_SERVICE_ROLE_KEY`, que vem
  depois do `npm run build` do código do PR. As branches são do próprio repositório, então o
  `pull_request` recebe os segredos.
- O canal que importa não é só o passo com segredo. Qualquer passo anterior do **mesmo job** roda
  código do PR ou das dependências e pode escrever em `$GITHUB_ENV` ou em `$GITHUB_PATH`, por
  exemplo um `NODE_OPTIONS=--require …`, que vale para os passos seguintes. Por isso o segredo
  precisa de outro job, e não só de outro passo.
- No `package-lock.json` há 3 entradas com `"hasInstallScript": true`: `fsevents` 2.3.2 e 2.3.3
  (só macOS) e `unrs-resolver` 1.12.2 (do lint). O `supabase` 2.115.0 **não** tem script de
  instalação: o binário vem pela dependência opcional `@supabase/cli-linux-x64` 2.115.0, também sem
  script. Logo, `npm ci --ignore-scripts` entrega a CLI que o `banco:tipos:check` chama por `npx`
  (lido no lockfile, ainda não executado; a tarefa 1.3 executa).
- O ruleset `main-protegida` exige o check `Verificacoes` pelo nome (README, "Configuração
  inicial"). Um job novo com outro nome não entra no ruleset e não muda o que bloqueia o merge.
- A conferência do ambiente compara o `CLAUDE.md` com a `main`, e por isso a mudança dele precisa de
  uma linha no `ambiente-decidido.txt` da change.

## Goals / Non-Goals

**Goals:**

- Nenhum segredo alcançável por código não revisado, garantido pela configuração do GitHub e não só
  pelo texto do `ci.yml`.
- As duas verificações novas com contador e vistas falhando (RP-12).
- A busca de segredo usando só `node` e `git` de leitura, sem nenhuma dependência.

**Non-Goals:**

- Mudar o que a barreira 3 mede. O LB-10, que diz que ela procura a chave num build que nunca a
  teve, continua na `papeis-da-diretoria-no-banco`.
- Separar o build da barreira 3 em dois jobs com artefato entre eles: ver D1, alternativas.
- Trocar a major das ações (Q6).

## Decisions

### D1 · Dois jobs, e o segredo num ambiente que só a `main` alcança (Q1 (a))

- **`Verificacoes`** (o nome não muda, porque o ruleset o exige) roda em PR e em push, como hoje,
  sem os dois passos com segredo e sem nenhum `secrets.` ou `vars.` de segredo. Ganha o passo da
  verificação das ações presas (D4).
- **`Conferencias com segredo`** tem `if: github.event_name == 'push' && github.ref ==
  'refs/heads/main'` e `environment: segredos-da-main`. Os passos: checkout (D2), setup-node sem
  `cache`, `npm ci --ignore-scripts`, os tipos do banco (com o token e a `NEXT_PUBLIC_SUPABASE_URL`
  só nesse passo), `npm run build` sem segredo no ambiente, e a barreira 3 com a chave só nesse
  passo. Nenhum `continue-on-error`. O `if:` é do evento, e não da presença do segredo, então o
  comentário do `ci.yml` sobre "nenhum `if:` que pule quando o segredo falta" continua valendo.
  Ele é reescrito para dizer essa diferença.
- **O ambiente `segredos-da-main`** tem a regra de branches de implantação só com `main` e nenhum
  revisor obrigatório. Os 2 segredos vão para ele e saem do nível do repositório. Um PR que mude o
  `ci.yml` para usar o ambiente é recusado pelo GitHub, porque o ref do PR não é a `main`. O
  Gabriel faz esse passo manual antes de abrir o PR (tarefa 1.4), e ele fica escrito no README.
- **Sem cache no job com segredo:** custa uns 30 s de download e tira a dúvida sobre o escopo do
  cache entre ramos.
- **Alternativas:** a (b) e a (c) da Q1. Também pensei em separar o build e a barreira 3 em jobs
  diferentes, com o `.next` como artefato, para o código de dependência do build não alcançar o
  passo da chave. Descartei: o código é o da `main`, já revisado, e o resíduo é de dependência
  comprometida, que é o AS-08 (Risks).

### D2 · Permissões e checkout (LB-08)

`permissions: contents: read` no topo do fluxo, e nenhum `permissions` por job. O `upload-artifact`
não precisa de permissão do `GITHUB_TOKEN`. Todo `actions/checkout` ganha `persist-credentials:
false`.

### D3 · Ações presas (LB-17, Q6 (a))

A forma é `uses: actions/checkout@<sha de 40> # v4.x.y`. O dev busca o sha do último patch da `v4`
de cada ação na referência da tag do repositório oficial (`github.com/actions/<nome>`). Se a tag for
anotada, usa o sha do **commit** para onde ela aponta, e não o do objeto da tag. O relatório traz a
tabela ação · tag · sha · endereço consultado. A verificação do D4 confere a forma, mas não que o
sha é o oficial: isso é a tabela, conferida pelo guardião.

### D4 · A verificação das ações presas

O script fica em `scripts/verificar-acoes-presas.mjs`, com a função pura testada em
`tests/barreiras/acoes-presas.test.mjs`. Ele é exposto como `npm run verificar:acoes`, encadeado no
`verificar`, e roda como passo do `Verificacoes`.

- **O que lê:** todo `.github/workflows/*.yml` e `*.yaml`, e `action.yml` em `.github/actions/`,
  se existir.
- **O que aceita:** uma linha `uses:` aceita `dono/repo(/caminho)@<40 hex>` seguido de `# v…`. A
  ação local (`./…`) é contada à parte. `docker://` só com `@sha256:`.
- **O que recusa:** todo o resto, com `arquivo:linha`.
- **A saída:** `arquivos: A · referências: R · presas por commit: C · locais: L · fora da regra:
  F`. Zero arquivos é NÃO VERIFICADO, com código 1.

### D5 · A busca de segredo (Q3 (b))

O script fica em `scripts/buscar-segredo-antes-do-envio.mjs`, com as funções puras em
`scripts/buscar-segredo-antes-do-envio/funcoes.mjs` (o mesmo desenho da conferência do ambiente) e
o teste em `tests/barreiras/busca-de-segredo.test.mjs`. Roda com
`node scripts/buscar-segredo-antes-do-envio.mjs`, sem `npm run` e sem entrada no `package.json`.

- **O Git que usa,** só da lista de leitura da barreira: `rev-parse --verify origin/main`,
  `rev-list origin/main..HEAD`, `show --name-only --format= -z <sha>` (no merge,
  `diff --name-only -z <sha>^1 <sha>`), `cat-file` para ler cada blob, e
  `status --porcelain -z --untracked-files=all`.
- **O que cobre:** em cada commit do intervalo, cada arquivo que o commit mudou, com o conteúdo
  naquele commit. Na árvore, cada arquivo rastreado alterado e cada não rastreado que não está
  ignorado, lido do disco; os apagados são pulados. Ela cobre a árvore porque roda **antes** do
  `git add` (proposta, item 4). Um arquivo ignorado e forçado com `git add -f` aparece no índice e
  é coberto.
- **Os formatos:** os 6 da proposta. O texto de cada expressão não casa com ela própria, porque
  depois do prefixo vem `[`. É isso que deixa a busca rodar sobre os relatórios que citam os
  formatos.
- **Binário:** o conteúdo é lido em bytes, como `latin1`. Conteúdo comprimido não aparece, que é o
  mesmo limite da §5.
- **A saída:** `commits: C · arquivos: F (dos commits: a · da árvore: b) · linhas: L · formatos: 6
  · achados: K`. Cada achado sai como `<formato> · <sha curto | árvore> · arquivo:linha ·
  [MASCARADO · <n> caracteres · arquivo:linha]`. Nada a enviar sai como "examinou 0 commits e 0
  arquivos".
- **Códigos:** 0 sem achado, 1 com achado, 2 não verificado (sem `origin/main`, fora de um
  repositório, ou `git` com erro).
- **`origin/main` velho:** se o Gabriel não rodou `git fetch`, o intervalo só fica maior, e a busca
  examina a mais, nunca a menos.

### D6 · Como a busca é vista falhando (RP-12)

- **No teste,** as chaves falsas são montadas na hora, por concatenação. Nenhuma fica escrita
  inteira em arquivo versionado. Os casos: cada formato acha; o prefixo solto e o texto da expressão
  não acham; o commit intermediário apagado depois acha, com um leitor de Git falso injetado; o
  binário não comprimido acha; a falta de `origin/main` dá 2. A saída do teste diz quantos casos
  rodou.
- **Na máquina, pelo `qa`:** (1) a busca sobre a branch como está dá 0, com os contadores, e os
  arquivos lidos incluem os artefatos desta change; (2) um arquivo não rastreado na raiz, com nome
  que `git check-ignore` confirma não ignorado, ganha uma chave falsa no formato do JWT, gerada por
  `node -e` com o prefixo partido em dois pedaços, e a busca dá 1, com `arquivo:linha` e o valor
  mascarado; (3) o arquivo sai e a busca volta a 0, com os mesmos contadores do passo 1. Nenhum
  commit é feito.

### D7 · O segundo comando da lista Git

Os textos mudam no `CLAUDE.md` (item 6 do modelo de entrega e o parágrafo que vem logo depois), na
tabela da `EQUIPE-DE-AGENTES.md` §2 (linha "Próximo passo"), na §5 ("A configuração que segura a
barreira", a frase do primeiro comando) e no README ("A barreira do Git"). Em todos, a regra é a
mesma: o segundo comando é `node scripts/buscar-segredo-antes-do-envio.mjs`, e o Gabriel para se não
der 0. Depois, o líder técnico registra o sha256 do `CLAUDE.md` novo no `ambiente-decidido.txt`
desta change, citando esta proposta aprovada no Portão 1. A conferência precisa dar 0 com
`aceitos por decisão: 1`.

### D8 · Os outros textos

- **`SEGURANCA.md` §3, R1:** o que entra desde esta change: o job com segredo no ambiente, a
  verificação das ações e a busca (AS-01, AS-09).
- **`SEGURANCA.md` §5:** a frase da auditoria de base (Q4 (b)), e o limite da busca: conteúdo
  comprimido, e só os 6 formatos.
- **`SEGURANCA.md` §6:** a linha do LB-09 muda de change (Q2 (b)), e LB-02, LB-08 e LB-17 vão para
  "Saíram da lista" depois do guardião (Q5 (a)).
- **`PLANO-DE-DESENVOLVIMENTO.md` §7, R1:** a linha 5 diz o que esta change entrega, e a
  `completar-ci-do-novo-fluxo` entra como 6, renumerando as seguintes.
- **README:** a seção do CI deixa de dizer "O CI e um job so" e explica os dois jobs e o ambiente.
  O passo manual do ambiente entra na "Configuração inicial".

### D9 · O tempo do CI

O "antes" vem da proposta, critério 6, com a fonte. O "depois" do PR é a duração da execução do PR
desta change (`updated_at − run_started_at`, mesma API), e vai na entrega do Portão 2. O do push
vai para a `completar-ci-do-novo-fluxo` (Q5 (a)).

### D10 · A raiz não publicada

O `qa` tira os prints da raiz não publicada em 390 e 1280 px com um script temporário, fora do
repositório, e compara pixel a pixel com
`openspec/changes/archive/2026-11-22-pagina-sobre-e-equipe/prints/raiz-nao-publicada-{390,1280}.png`.
O relatório traz `pixels diferentes / total` de cada largura. Os prints não são versionados, então
não há linha nova na §7 (RP-13). A alternativa era versioná-los como nas changes de tela, mas aqui
eles não provam nada além do número.

### D11 · Escopos nominais

- `dev-frontend`: `.github/workflows/ci.yml`, os scripts do D4 e do D5, os dois testes em
  `tests/barreiras/` e `package.json` (só `scripts`).
- `qa-acessibilidade`: nada versionado. O arquivo do D6 e os prints do D10 são criados e apagados.
- Líder técnico: os textos do D7 e do D8, o `ambiente-decidido.txt` e o `relatorio.md`.
- Gabriel: o ambiente e os segredos no GitHub.

## Risks / Trade-offs

- [Tipos divergentes e barreira 3 só aparecem depois do merge, com a Vercel já publicando] → A R1
  não lê o banco, e o site está atrás do interruptor. Uma falha no push vira change de correção
  imediata. Trazer essas conferências de volta ao PR, por exemplo com a Q1 (b), fica para a
  `papeis-da-diretoria-no-banco` decidir.
- [O job com segredo ainda roda código de dependência revisado: a CLI do Supabase recebe o token
  por desenho, e o build roda o Next] → Lockfile preso e AS-08. Fora do escopo, e declarado na
  proposta.
- [Os segredos continuam no nível do repositório por esquecimento] → A tarefa 1.4 exige a resposta
  do Gabriel com "0 segredos no repositório", e o guardião confere a resposta.
- [O ambiente só aceita a `main`, então não há como testar o job antes do merge] → A configuração é
  conferida pelo revisor e pelo guardião, e a primeira execução é a prova (Q5). **Não conferido
  nesta proposta:** se o job com ambiente pede alguma permissão além de `contents: read`. Se o push
  falhar por permissão, a correção é a primeira tarefa da `completar-ci-do-novo-fluxo`.
- [Sha que não é o oficial] → A tabela do D3, com o endereço consultado. A verificação do D4 só vê a
  forma.
- [A busca não pega formato fora dos 6, nem conteúdo comprimido] → Os limites ficam escritos na §5.
  Formato novo, como a chave do Resend na R3, entra por change.
- [O Gabriel edita algo entre a busca e o push] → A lista é conferência, busca, `add`, `commit`,
  `push`, sem edição no meio. Se houver edição, a busca roda de novo.

## Migration Plan

1. Na branch: as tarefas 1.1 a 3.1.
2. Antes de abrir o PR, o Gabriel cria o ambiente, põe os 2 segredos nele e apaga os do repositório
   (tarefa 1.4). Não há outro push na `main` nesse meio-tempo, então o fluxo antigo não roda sem
   segredo.
3. No PR: `Verificacoes` verde, e `Conferencias com segredo` pulado.
4. Depois do merge, o push roda os dois jobs, e a prova vai para a `completar-ci-do-novo-fluxo`.
5. **Volta:** reverter o commit do `ci.yml` e recriar os 2 segredos no nível do repositório. O
   ambiente pode ficar, porque sem uso ele não faz nada.

## Open Questions

- O nome do ambiente (`segredos-da-main`) e o do job (`Conferencias com segredo`) podem mudar no
  apply sem mudar spec nem tarefa, desde que o nome do job não seja `Verificacoes`.
