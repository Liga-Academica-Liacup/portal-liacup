# Proposta — ajustar o CI ao novo fluxo

## Why

Hoje o PAT do Supabase e a chave de serviço chegam a passos do CI que rodam código do PR e das
dependências (LB-02, alta). O `ci.yml` não declara `permissions` e o checkout guarda o
`GITHUB_TOKEN` (LB-08), e as três ações estão presas por tag móvel (LB-17). Os três riscos foram
aceitos com prazo na R1 e apontam para esta change. Falta também uma busca de segredo que o Gabriel
rode antes do push. Hoje ela é a busca da Q15 da `endurecer-agentes-e-git-local`, feita à mão.
Change sem tela.

## What Changes

1. **O segredo só chega a código revisado (LB-02, Q1).** O job `Verificacoes` deixa de receber
   segredo e continua rodando em todo PR e em todo push. Os dois passos que usam segredo saem dele:
   os tipos do banco e a barreira 3. Eles vão para um job à parte, `Conferencias com segredo`, que
   só roda no push para a `main`. Esse job instala as dependências sem script de instalação, e os
   segredos ficam num ambiente do GitHub que só a `main` alcança (`design.md`, D1). Os passos do
   Gabriel no GitHub seguem a ordem do D1, que não deixa execução da `main` vermelha nem sem
   segredo, e vão na entrega do Portão 2 junto com os comandos Git.
2. **Permissões mínimas (LB-08):** o token só lê o conteúdo, e nenhum checkout guarda a credencial.
3. **Ações presas por sha (LB-17, Q6),** com a versão num comentário. Uma verificação nova acusa
   todo `uses:` preso por tag e roda no `npm run verificar` e no CI.
4. **Busca de segredo antes do push (Q3).** É um comando que o Gabriel roda com `node` direto, sem
   `npm run`, logo depois da conferência do ambiente. Ele usa só `git` de leitura e procura o
   formato de chave, nunca o nome solto. Olha cada commit de `origin/main..HEAD` e, como roda antes
   do commit, também o que ainda vai entrar nele: os arquivos rastreados alterados e os não
   rastreados que não estão ignorados. A saída diz quanto mediu e mascara o valor (D5).
5. **LB-09, Q2:** a suíte de políticas e de banco não entra no CI nesta change, e a §6 passa a
   apontá-la para a `papeis-da-diretoria-no-banco`.
6. **Textos:** o segundo comando da lista Git no `CLAUDE.md`, na `EQUIPE-DE-AGENTES.md` §2, na §5 e
   no README. Também a seção do CI do README, a §3 e a §6 do `SEGURANCA.md`, a frase da auditoria de
   base na §5 (Q4) e a linha da R1 no plano (D7, D8).

Os formatos da busca (D5) são os da Q15 e mais dois, que cito pela expressão, cujo texto não casa
com ela. **Todos dão comprimento mínimo, e nenhum dá comprimento exato** (Q3 (b), decisão do
Gabriel): `eyJhbGci[A-Za-z0-9_-]{20,}`, `sb_secret_[A-Za-z0-9_-]{10,}`, `sbp_[A-Za-z0-9]{20,}`,
`github_pat_[A-Za-z0-9_]{60,}`, `-----BEGIN[A-Z ]*PRIVATE KEY-----\s*[A-Za-z0-9+/=]{64,}` e o
token clássico do GitHub, `ghp_[A-Za-z0-9]{30,}`. O mínimo da chave privada vem da linha de 64
caracteres do PEM (RFC 7468). O piso dos dois do GitHub vem do formato publicado, com margem, e
**não de medição**: o publicado tem 82 caracteres depois do primeiro prefixo e 36 depois do
segundo, e o piso fica em 60 e 30 (decisão do Gabriel, `relatorio.md`). Uma busca de tamanho
exato ficaria muda se o formato mudasse.

**Decisão registrada para o AS-17**, se esta proposta for aprovada: muda o `CLAUDE.md`, no item 6
do modelo de entrega e no parágrafo que vem logo depois. Por isso, o líder técnico registra a linha
dele no `ambiente-decidido.txt` da change. Nada muda em `.claude/`.

## Critérios de aceite

1. O `ci.yml` tem `permissions: contents: read` só no topo, e todo checkout tem
   `persist-credentials: false`.
2. Todo `uses:` está preso por sha de 40 caracteres, com a versão no comentário. A verificação nova
   fica vermelha com uma ação presa por tag, nomeando o arquivo e a linha, e volta ao verde, com o
   contador de referências (RP-12).
3. Nenhum passo do job `Verificacoes` cita segredo. O job com segredo roda só no push para a `main`,
   no ambiente restrito a ela, e instala com `--ignore-scripts`. Os dois scripts com segredo saem
   vermelhos quando o segredo falta, com o código de saída no relatório (tarefa 1.3). Na execução
   do PR, o job com segredo aparece pulado. A entrega do Portão 2 traz os passos do Gabriel no
   GitHub na ordem do D1, junto com os comandos Git. A primeira execução real do job com segredo,
   a confirmação de 0 segredos no repositório e 2 no ambiente, e a conferência das execuções da
   `main` ficam para a primeira tarefa da `completar-ci-do-novo-fluxo` (Q5 (b)).
4. A busca de segredo fica vermelha com uma chave falsa no formato certo, na árvore de trabalho e
   num commit intermediário (este pelo teste), sem imprimir o valor. Volta ao verde sem ela, e não
   acusa os artefatos desta change, que citam as expressões. Todos os 6 formatos dão comprimento
   mínimo, e uma chave mais longa que o publicado também é acusada. A saída diz quantos commits,
   arquivos, linhas e formatos examinou (RP-12).
5. A conferência do ambiente sai com 0, com a linha do `CLAUDE.md` aceita por decisão.
6. O tempo do CI antes e depois, em minutos, no relatório. Antes, pela mediana das 3 execuções mais
   recentes de cada evento (API pública de execuções do GitHub, levantada pelo líder técnico em
   22/11/2026): **pull_request 5,95 min; push 5,73 min**. Depois: o do PR na entrega do Portão 2,
   e o do push na primeira tarefa da `completar-ci-do-novo-fluxo` (Q5 (b)).
7. `npm run verificar`, `npm test`, `npx playwright test` e `openspec validate --all --strict` com
   código 0. A raiz não publicada fica idêntica, pixel a pixel, ao print arquivado da
   `pagina-sobre-e-equipe`, em 390 e 1280 px.
8. A §6 sem LB-08 e LB-17, que vão para "Saíram da lista". O LB-02 **fica na §6** (Q5 (b)): a
   linha dele diz que a correção está feita na configuração e espera a execução do push na
   primeira tarefa da `completar-ci-do-novo-fluxo`, que é quando ele sai. A linha do LB-09 aponta
   a change da Q2.

**Conta de tarefas: 11, com quatro de folga** (`tasks.md`). Com todo o briefing, seriam 21 ou
mais, então aplico a divisão que ele prevê (ver "Fora de escopo").

## Questões do Portão 1, decididas pelo Gabriel em 22/11/2026

As decisões literais estão no `relatorio.md`, em "Decisões do Gabriel no Portão 1". Q1 (a), Q2 (b),
Q4 (b) e Q6 (a) seguem a recomendação. Q3 (b) veio com comprimento mínimo em todos os formatos.
Q5 ficou na (b), e não na recomendação.

**Q1. A forma do LB-02.**

- (a) Job à parte, só no push para a `main`, com os segredos num ambiente do GitHub cuja regra só
  aceita a `main`. · custo: o Gabriel cria o ambiente, muda os 2 segredos para lá e apaga os do
  repositório. Estimo, sem ter medido, 3 a 4 min a mais de máquina por push, em paralelo, o que não
  muda a espera. O PR perde menos de 1 min. Os tipos divergentes e a barreira 3, inclusive a busca
  pelo nome, que não precisa de segredo, só aparecem depois do merge: a `main` fica vermelha com a
  Vercel já tendo publicado.
- (b) Ambiente com aprovação manual, rodando também no PR. · custo: o Gabriel aprova cada execução,
  PR e push, e o job entra como verificação exigida no ruleset. O código do PR recebe o segredo
  depois da aprovação, e a espera inclui a pessoa.
- (c) Igual a (a), com os segredos no repositório. · custo: nenhum passo manual. Um PR que mude o
  `ci.yml` volta a alcançar o segredo, e a proteção fica só no texto do fluxo.
- Recomendei (a): só ela recusa o segredo a qualquer ramo pela configuração do GitHub, e a R1 não
  tem banco. O PLANO (decisão 3) diz que todas as verificações ficam. Elas ficam, mas o PR deixa de
  ver duas, e só o Gabriel aceita isso.
- **Decidido: (a).**

**Q2. O LB-09.**

- (a) A suíte entra aqui, no job da `main`, com os 3 segredos do projeto de teste no mesmo
  ambiente. · custo: 2 tarefas (13 no total). O Gabriel confirma que o projeto de teste existe e
  não é o de produção, porque a suíte cria e apaga linhas no projeto para onde as variáveis
  apontam. A suíte nunca rodou no CI, e o tempo dela não está medido.
- (b) Vai para a `papeis-da-diretoria-no-banco` (R2), quando o banco volta a importar. · custo: só
  muda a coluna "Change que resolve" da §6, e o prazo continua R2.
- Recomendei (b): o LB-03 está aberto e nenhuma página da R1 lê o banco.
- **Decidido: (b).**

**Q3. A ferramenta da busca.**

- (a) Script próprio, com os 5 formatos acima. · custo: cerca de 150 linhas e o teste. Nenhuma
  dependência.
- (b) O mesmo, mais o token clássico do GitHub. · custo: uma linha. A auditoria de base já procurava
  esse prefixo.
- (c) O binário `gitleaks` 8.30.1 (MIT). · custo: o Gabriel instala o binário e confere o checksum,
  um passo manual no README e uma ferramenta nova (RP-01). O autor declarou o projeto só em
  correções de segurança, e o falso positivo nos sha256 dos registros não está medido.
- (d) A `gitleaks-action`. · custo: é EULA desde a v2, exige `GITLEAKS_LICENSE` em repositório de
  organização (o README fala em chave gratuita, o LICENSE.txt fala em faixas pagas) e depende do
  Node 20. Ela roda no CI, que vem depois do push, então não atende ao briefing.
- Recomendei (b): é a solução óbvia, sem terceiro, com os formatos que o Gabriel já fixou.
- **Decidido: (b), com comprimento mínimo em todos os formatos, e não exato.** O piso dos dois do
  GitHub vem do formato publicado, com margem, e não de medição (ver os formatos acima).

**Q4. A auditoria de base.** A §5 diz "hoje, a `ajustar-ci-ao-novo-fluxo` na R0 e a
`lancamento-r1` na R1". O plano de 20/11 pôs esta change como a 5ª da R1. A spec `equipe-de-agentes`,
o `CLAUDE.md` e a `EQUIPE-DE-AGENTES.md` §2 mandam a auditoria na última change de cada release.

- (a) Rodar a auditoria de base aqui. · custo: 5 blocos e a junção, pelo menos 6 invocações do
  guardião sobre a `main` inteira (eram 297 arquivos em 20/11; hoje não contei). Não cabe numa
  sessão junto com a change.
- (b) Corrigir a frase para "hoje, a `lancamento-r1` na R1", com o guardião passando o checklist
  inteiro só no diff. · custo: uma linha na §5.
- Recomendei (b), porque a frase ficou velha quando o plano mudou, e as outras três fontes
  concordam entre si.
- **Decidido: (b).**

**Q5. A prova que só existe depois do push.** A execução real do job com segredo e o tempo do push
só existem depois do merge, ou seja, depois do Portão 2 e da change arquivada.

- (a) A entrega do Portão 2 traz a execução do PR: o job pulado e o tempo do PR. O push depois do
  merge vira a primeira tarefa da `completar-ci-do-novo-fluxo`. O LB-02 sai da §6 nesta change, pela
  auditoria da configuração, e volta para a §6 se o push falhar. · custo: a prova fica numa change
  seguinte.
- (b) Igual, mas o LB-02 só sai da §6 na change seguinte. · custo: o risco segue aberto alguns dias.
- (c) Um commit a mais na branch depois do PR, com o tempo do PR. · custo: uma nova rodada de CI e
  de revisão, e o push continua para depois.
- Recomendei (a): o Portão 2 já confere a prévia do mesmo jeito.
- **Decidido: (b).** O LB-02 só sai da §6 depois que o job com segredo for visto rodando no push
  para a `main`, na primeira tarefa da `completar-ci-do-novo-fluxo` (RP-12).

**Q6. A versão das ações.**

- (a) Prender o último patch da major em uso (`v4` das três). · custo: nenhum comportamento muda.
- (b) Subir cada uma para a major mais nova. · custo: ler as notas de mudança, com risco de
  comportamento novo no `upload-artifact`, e uma tarefa a mais.
- Recomendei (a). A troca de major pode ir junto com o LB-35 na `lancamento-r1`.
- **Decidido: (a).**

## Fora de escopo

- **`completar-ci-do-novo-fluxo`**, que entra logo depois desta (divisão do briefing): o
  `openspec validate --all --strict` e os prints das páginas da lista única, em 390 e 1280 px, como
  anexo do CI; as ressalvas da `endurecer-agentes-e-git-local` (A2 a A7 do guardião e as 7 da
  rodada 3 do revisor); e, na primeira tarefa dela, a prova do push da Q5, a confirmação de 0
  segredos no repositório e a saída do LB-02 da §6. Os critérios de aceite do briefing sobre a spec
  inválida plantada e os prints vão com ela.
- Telas, banco (R2), cabeçalhos de segurança (`lancamento-r1`) e o `.claude/`.
- Rodar a busca de segredo no CI: lá ela chega depois do push.
- Proteger contra dependência já comprometida no lockfile, que é o AS-08. O job com segredo ainda
  roda código revisado de dependência: a CLI do Supabase e o build (D1).

## Capabilities

### New Capabilities

Nenhuma. A busca fica na `fundacao-e-ci`, que está na lista do gatilho. Uma spec nova cairia na
lista de tela.

### Modified Capabilities

- `fundacao-e-ci`: MODIFIED "O CI é o portão, e não avisa sem barrar" (o segredo sai do job
  `Verificacoes`). ADDED: segredo só em código revisado, permissões mínimas, ações presas, e a busca
  de segredo em dois requisitos.
- `equipe-de-agentes`: ADDED, a lista de comandos Git busca segredo antes de enviar.

A spec delta segue as decisões do Portão 1.

## Requisitos permanentes

| RP | Aplica? | Em uma linha |
| --- | --- | --- |
| RP-01 | Sim | Nenhuma dependência nova: 22 diretas antes e depois. As 3 ações são as mesmas, só presas. Com Q3 (c), entra uma ferramenta nova, com motivo |
| RP-02, RP-03 | Sim | `verificar:tokens` com 0, e `tokens.css` intocado |
| RP-04 a RP-09 | Não | Nenhuma tela. O e2e continua verde como hoje, e a raiz é comparada pixel a pixel |
| RP-10 | Sim | É o assunto: o segredo sai do PR e a busca vem antes do push |
| RP-11 | Não | Nenhuma tabela (LB-09 na Q2) |
| RP-12 | Sim | As duas verificações novas, vistas falhando e voltando, com contador: ações presas (arquivos, referências, presas, por tag) e busca (commits, arquivos, linhas, formatos, achados). A terceira do briefing, o `openspec validate`, vai para a `completar-ci-do-novo-fluxo` |
| RP-13 | Sim | Nenhum gerado versionado. Os prints da comparação da raiz não entram no Git (D10) |
| RP-14 | Não | Nenhuma tela |

## Impact

| O que | Efeito | Quem escreve |
| --- | --- | --- |
| `.github/workflows/ci.yml` | Dois jobs, permissões, ações presas, passo novo | `dev-frontend` |
| `scripts/` e `tests/barreiras/` | A verificação das ações presas e a busca de segredo, com os testes | `dev-frontend` |
| `package.json` | Só `scripts`: `verificar:acoes`, encadeado no `verificar`. O lockfile não muda | `dev-frontend` |
| `CLAUDE.md`, `README.md`, `docs/SEGURANCA.md` §3, §5 e §6, `docs/EQUIPE-DE-AGENTES.md` §2, `docs/PLANO-DE-DESENVOLVIMENTO.md` §7 | Os textos | líder técnico |
| Configuração do GitHub | Ambiente `segredos-da-main`, os segredos postos nele antes do merge e os do repositório apagados depois do push verde, na ordem do D1 (Q1 (a)) | Gabriel |
| `src/`, `tests/e2e/`, `public/`, `.claude/`, lockfile, produção | Nada muda | — |
