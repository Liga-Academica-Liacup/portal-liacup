# Design — completar o CI do novo fluxo

## Context

O motivo está na proposta, em "Why". O estado de hoje que molda a solução:

- **O `ci.yml` tem dois jobs.** O `Verificacoes` roda em PR e em push, sem segredo. Ele compila no
  passo `Build` e de novo dentro do `npx playwright test`, porque o servidor do e2e roda
  `npm run build && npm run start`. O `Conferencias com segredo` roda só no push para a `main`, no
  ambiente `segredos-da-main`, com estes passos: checkout, setup-node sem cache,
  `npm ci --ignore-scripts`, tipos (com o token), `npm run build` e a barreira 3 (com a chave). O
  `Build` desse job é o A1.
- **A barreira 3 só importa `node:fs` e `node:path` e só lê o `.next`.** Não precisa de
  `node_modules`. Os tipos chamam a CLI do Supabase (dependência) com `npx`, dentro do passo que
  recebe o token, por desenho.
- **O job com segredo de hoje** (instalação sem scripts, tipos e build) levou 1,12 min e 1,30 min
  nas duas tentativas da execução `45099474006`. Então o build com `npm ci --ignore-scripts` funciona
  e cabe em pouco mais de 1 min.
- **O ruleset `main-protegida` exige só o check `Verificacoes`.** O que precisa barrar o merge tem
  de ser passo dele. Job novo com outro nome não entra no ruleset.
- **O CLI do OpenSpec é global**, na versão 2.1.0, e o README diz que ele não entra no
  `package.json`. As skills de `.claude/skills/` chamam o global.
- **O repositório é público.** Todo anexo do CI pode ser baixado por qualquer conta do GitHub
  enquanto não expira.
- **A lista única** (`src/lib/utils/paginas-publicas.json`) tem hoje 4 páginas: `/`, `/sobre`,
  `/processo-seletivo` e `/equipe`. O Lighthouse já a lê e sobe o servidor no modo explícito por
  `scripts/iniciar-servidor.mjs`.
- **O `.gitignore` já ignora `test-results/`** (linha 16). Diff que mexe no `.gitignore` restringe
  as buscas do guardião (§5 e A6 da `endurecer`).

## Goals / Non-Goals

**Goals:**

- Nenhum código de dependência no mesmo job que a chave de serviço, e cada segredo num ambiente só
  dele. Isso vale pela configuração do GitHub, sem depender do texto de um passo.
- As verificações novas e as que mudam com contador, vistas falhando (RP-12).
- Nenhum arquivo de `src/`, `public/` ou `tests/e2e/` alterado.

**Non-Goals:**

- Mudar o que a barreira 3 mede. O LB-10 continua na `papeis-da-diretoria-no-banco`.
- Comparar os prints com o protótipo no CI.
- Provar que a dependência do lockfile é honesta (AS-08). Um build adulterado pode fazer a
  barreira 3 dar VERIFICADO falso, mas não alcança a chave.

## Decisions

### D1 · Os jobs do push (Q1 (c), Q2 (b))

| Job | Quando | Ambiente | Passos, na ordem |
| --- | --- | --- | --- |
| `Verificacoes` | PR e push | nenhum | os de hoje, mais o passo do D3 depois das ações presas e o dos prints (D5) depois do e2e |
| `Build para a barreira da chave` | só push na `main` | nenhum | checkout · setup-node sem cache · `npm ci --ignore-scripts` · `npm run build` · envio do `.next` como anexo, sem `.next/cache`, por 1 dia |
| `Tipos do banco` | só push na `main` | `segredos-da-main`, só com o token | checkout · setup-node sem cache · `npm ci --ignore-scripts` · tipos, com o token e a `NEXT_PUBLIC_SUPABASE_URL` só nesse passo |
| `Chave fora do pacote` | só push na `main`, depois do build | ambiente novo, `chave-de-servico-da-main`, só com a chave | checkout · setup-node sem cache · download do anexo para `.next` · `node scripts/verificar-chave-de-servico.mjs`, com a chave só nesse passo |

- **O `if:` é do evento**, como hoje (`github.event_name == 'push' && github.ref ==
  'refs/heads/main'`), nos três jobs do push. Nenhum `continue-on-error`.
- **O `needs:`** só no job da chave, apontando o do build. Se o build ficar vermelho, a chave
  aparece pulada. Na `main`, isso é vermelho visível e correção imediata, e nunca verde sem
  segredo.
- **A barreira 3 roda com o `node` direto**, e não com `npm run`. Sem `node_modules`, o `npm` ainda
  leria o `.npmrc` e rodaria os scripts `pre` e `post`. O `node` roda só o arquivo, como a
  conferência do ambiente.
- **Por que um ambiente por segredo (Q1 (c)).** Hipótese, não conferida: o executor recebe no
  começo do job os segredos que o job pode citar, e um passo com `sudo` lê a memória do processo do
  executor. Se for assim, a CLI do Supabase, no job dos tipos, alcançaria a chave se as duas
  estivessem no mesmo ambiente. Com um ambiente por segredo, o GitHub nem entrega a chave ao job
  dos tipos. O `segredos-da-main` fica com o token, e a chave vai para o ambiente novo. Assim, o
  token não precisa ser trocado: o valor da chave se lê de novo no painel do Supabase, e o do token
  não.
- **Por que o build próprio (Q2 (b)).** Antes do build só rodam o checkout, o Node e a instalação
  sem scripts, em vez do `npm ci` com scripts, do lint e dos testes do `Verificacoes`. E a barreira
  3 não depende do e2e.
- **Alternativas:** a (a) e a (b) da Q1, e a (a) da Q2, com o custo na proposta.

### D2 · A condição do A1, passo a passo (Q5 (a))

O que cada passo permitido antes de um `secrets.` faz no ambiente dos passos seguintes (informativo
C do guardião):

| Passo | Roda código de dependência? | Escreve no ambiente dos passos seguintes? |
| --- | --- | --- |
| checkout, `persist-credentials: false` | não; ação oficial presa | não grava credencial (LB-08) |
| setup-node sem `cache` | não; ação oficial presa | põe o Node no caminho (`$GITHUB_PATH`); é o único |
| `npm ci --ignore-scripts` | não; o `npm` vem com o Node, e nenhum script de pacote roda | não; grava `node_modules`, que nenhum passo anterior ao segredo executa |
| download do anexo | não; ação oficial presa | não; grava só os arquivos do anexo na pasta de destino |

O `$GITHUB_ENV` não é escrito por nenhum desses passos. O guardião confere pela leitura do
`ci.yml`, com a lista de passos de cada job no relatório.

### D3 · O OpenSpec no portão (Q3 (a))

- `@fission-ai/openspec` entra como `devDependency`, com a versão exata `2.1.0`, no lockfile.
- O script `verificar:specs` é `openspec validate --all --strict`. Ele entra no `verificar`, logo
  depois do `verificar:acoes`, e vira passo do `Verificacoes` logo depois das ações presas.
- **Antes de aceitar a dependência,** o dev confere três coisas e põe os números no relatório:
  - quantas entradas do lockfile têm `"hasInstallScript": true` antes e depois. Hoje são 3. Se o
    número subir, para e volta ao Gabriel (AS-08);
  - quantos pacotes a instalação acrescenta;
  - o `npm audit --audit-level=high` antes e depois. Nenhum aviso alto ou crítico novo pode vir da
    dependência.
- **Não conferido nesta proposta:** se o CLI manda telemetria. O dev confere na documentação da
  2.1.0. Se mandar, o passo desliga pela opção documentada, com o motivo no relatório.
- **Duas instalações, uma versão.** O global continua para os `/opsx:*`. O README passa a dizer que
  as duas ficam na 2.1.0, e que trocar de versão é uma change que muda as duas.
- **RP-12:** uma change descartável plantada em `openspec/changes/`, com um requisito sem cenário,
  dá código diferente de 0 e nomeia o item. Apagada, a validação volta a 0 com a linha `Totals`.

### D4 · Ações presas: a ação nova e as formas que faltavam (A2 e A4 da `ajustar-ci`)

- **A ação nova é `actions/download-artifact`,** no último patch da `v4`, que conversa com o
  `upload-artifact` v4.6.2 já em uso (mesma regra da Q6 (a) da `ajustar-ci`). O líder técnico lê o
  sha com `git ls-remote --tags https://github.com/actions/<nome>`, sem restringir a uma ref, para
  a linha `^{}` aparecer se a tag for anotada. Ele faz isso para a ação nova e para as três de hoje,
  o que fecha o A4. Antes de passar o sha, confere no aviso de segurança publicado do repositório
  da ação que a versão está fora de toda faixa afetada. Houve um aviso de extração fora da pasta de
  destino, corrigido dentro da `v4`.
- **O A2.** A verificação passa a ver `uses:` dentro de lista e de mapa escritos numa linha só (por
  exemplo `steps: [{ uses: … }]`). Também passa a ler o `action.yml` ou `action.yaml` de toda ação
  local citada por `uses: ./…`, em qualquer pasta, além de `.github/actions/`. A saída e os
  códigos não mudam.

### D5 · Os prints das páginas

- **A rotina** é `scripts/prints-do-site.mjs`, exposta como `npm run prints:site`.
  - Lê a lista única e sobe o `next start` no modo publicado por `scripts/iniciar-servidor.mjs`,
    como o Lighthouse.
  - Usa o Chromium que o CI já instala, em 390 × 844 e 1280 × 800, que são as medidas dos prints
    do protótipo e do método do `guardiao-visual`.
  - Tira cada print de página inteira, depois de as fontes carregarem, com movimento reduzido.
- **Onde grava:** `test-results/prints-do-site/<página>-<largura>.png`, com `inicio` para `/`. A
  pasta já é ignorada, então o diff não toca no `.gitignore` (Q8). Limite declarado: o
  `playwright test` limpa `test-results/` ao começar, e na máquina os prints duram até o próximo
  e2e.
- **A saída:** `páginas: P · larguras: 2 · prints: N`.
  - Página com status diferente de 200 dá código 1 e nomeia a página.
  - Lista vazia, ou `N` diferente de `P × 2`, dá NÃO VERIFICADO, também com código 1.
- **No CI:** o passo "Prints das paginas" vem logo depois do e2e e antes do Lighthouse. O envio do
  anexo `prints-do-site` roda só com os passos anteriores verdes, com `if-no-files-found: error` e
  7 dias de retenção, no PR e no push.
- **RP-12:** uma página que não existe, acrescentada à lista só durante a demonstração, dá código
  1 e nomeia a página. A lista restaurada volta a 0, com o sha256 igual ao de antes.
- **Alternativas descartadas:**
  - um teste do e2e que grava os prints mexeria em `tests/e2e/`, rodaria nas 7 larguras e
    misturaria print com resultado de teste;
  - uma pasta nova no `.gitignore` poria o `.gitignore` no diff.

### D6 · A busca de segredo (Q6 (a), A3 e o 1 e o 2 da rodada 3 da `ajustar-ci`)

- **UTF-16.** Além da leitura de hoje, byte a byte, o conteúdo também é decodificado como UTF-16
  nestes casos:
  - quando começa com a marca de ordem de bytes (`FF FE` ou `FE FF`);
  - quando, sem a marca, a maior parte dos bytes pares ou ímpares é zero.

  A busca roda sobre o texto decodificado também. Achado nas duas leituras conta uma vez.
- **O nome.** O caminho de cada arquivo examinado, nos commits, na árvore e no índice, também passa
  pelos formatos. O achado sai como `nome do arquivo`, mascarado como os outros.
- **A mensagem** passa a ser "Não envie. Tire o valor e troque a chave.", sem condição.
- **Casos novos:** UTF-16LE com e sem marca, UTF-16BE com marca, chave no nome e o texto da
  mensagem. As chaves continuam montadas por concatenação.
- **RP-12 na máquina:** um arquivo não rastreado em UTF-16LE, sem marca, com chave falsa dá 1.
  Apagado, a busca volta a 0.
- **Limite que fica, declarado na §5:** outras codificações, como UTF-32, e texto comprimido.

### D7 · A conferência compara os próprios arquivos (Q7 (b), A3 da `endurecer`)

- `scripts/conferir-ambiente-local.mjs` e `scripts/conferir-ambiente-local/funcoes.mjs` entram na
  lista do que a conferência compara com a `main` pelo conteúdo, como a lista do AS-17.
- Como esta change altera os dois arquivos, o líder técnico registra o sha256 dos dois no
  `ambiente-decidido.txt`, citando a proposta aprovada. A conferência dá 0 com
  `aceitos por decisão: 2`.
- **RP-12:** uma linha a mais num dos dois, sem registro, dá código 1 e nomeia o arquivo. Desfeita
  a mudança, a conferência volta a 0.
- **Limite, declarado na §5:** uma edição que apaga a própria comparação passa nela. Contra isso
  valem o `git status` depois de cada passagem e o checklist inteiro do guardião, porque `scripts/`
  está no gatilho.

### D8 · Os textos

- **`SEGURANCA.md` §6** (tarefa 6.1). A §6 só aceita a saída depois da auditoria, então estas duas
  linhas valem só com o veredito do guardião desta change; sem ele, voltam à tabela antes do
  archive:
  - o LB-02 vai para "Saíram da lista", com a execução `45099474006`, as implantações, a regra só
    `main`, a frase do Gabriel e a resposta da Q4;
  - o A1 também, com o `ci.yml` lido pelo guardião e a Q5.

  A linha da Q12 (b) ganha, depois do motivo, a correção do I3: "além de quem tem escrita, o código
  de dependência também alcançava o passo (I3 do guardião, visto pelo Gabriel em 22/11/2026)". O
  aceite, o prazo e as condições ficam iguais.
- **Cabeçalho:** a versão 3.2, citando também o que a 3.1 deixou de citar (I2): as duas linhas
  novas da §6 e a troca do PAT.
- **§3, R1:** o que entra desde esta change: os quatro jobs, os dois ambientes, o anexo do build e
  o dos prints, públicos, a ação nova e o OpenSpec no portão.
- **§5:**
  - E-A4: a pasta da change, no que governa, vai para o gatilho;
  - E-A5: o limite da configuração global e de sistema do Git;
  - E-A6: o parágrafo da Q8;
  - E-A7: "antes da primeira forma";
  - E-R3.3: o ponteiro para o limite junto das frases absolutas;
  - E-R3.4: os dois caminhos `~/.claude/` da Q14;
  - ACI-R3.5: o inventário de `process.env`, refeito com data;
  - ACI-Q4.3 e ACI-D: a revogação do PAT como fato;
  - a troca do PAT com a Q1 (c);
  - os limites da busca (D6) e da conferência (D7).
- **README:**
  - o quadro do CI, o passo 5 (dois ambientes, e nenhum segredo no repositório nem na organização,
    que é o ACI-A5) e o item "Fork";
  - "A versão do OpenSpec importa" (D3);
  - "Como testar" e "Todos os comandos": hoje dizem "seis", e o `verificar` encadeia sete; com o
    D3, são oito. Entram também `verificar:specs` e `prints:site`;
  - o ponteiro do E-R3.3 e a linha longa do ACI-R3.6.
- **`EQUIPE-DE-AGENTES.md`:** "são trava" ganha o limite "contra engano, não contra agente que
  esconde o comando" (E-R3.5).
- **Plano §7, R1, linha 6:** o que a change entregou.

Os códigos E-* são da `endurecer-agentes-e-git-local`, e os ACI-*, da `ajustar-ci-ao-novo-fluxo`,
como na tabela das ressalvas do `relatorio.md`.

### D9 · O tempo do CI

A métrica é a da `ajustar-ci`: `updated_at − run_started_at` da última tentativa, pela API pública
de execuções.

| Evento | Antes da `ajustar-ci` (mediana de 3) | Depois dela (1 execução) | Diferença |
| --- | --- | --- | --- |
| PR | 5,95 min | 7,72 min (`45095701421`) | +1,77 |
| push | 5,73 min | 6,78 min (`45099474006`, tentativa 2) | +1,05 |

- A tentativa 1 do push levou cerca de 8,08 min pelos horários dos jobs.
- Uma execução não é mediana. E a diferença pode misturar efeitos: a `pagina-sobre-e-equipe`
  acrescentou 2 páginas ao e2e e ao Lighthouse, e não está separado o que é do CI novo.
- **Depois desta change:** o PR vai na entrega do Portão 2, pela execução do PR. O push vai depois
  do merge, com a confirmação do Gabriel.
- **Estimativa, não medida:**
  - o PR cresce o tempo dos prints, de 0,5 a 1 min, mais alguns segundos do `openspec validate`;
  - a espera do push segue a do `Verificacoes`, porque os outros três jobs rodam em paralelo e
    levam, juntos, menos que ele.

### D10 · A raiz não publicada

É o mesmo método da `ajustar-ci` (D10 dela). O `qa` tira os prints da raiz não publicada em 390 e
1280 px com um script temporário, fora do repositório. Depois compara pixel a pixel com
`openspec/changes/archive/2026-11-22-pagina-sobre-e-equipe/prints/raiz-nao-publicada-{390,1280}.png`
e dá `pixels diferentes / total` de cada largura. Nada é versionado, e a §7 não ganha linha.

### D11 · Escopos nominais

- **`dev-frontend`:**
  - `.github/workflows/ci.yml` e `package.json` (devDependency e scripts);
  - `package-lock.json`, só pela instalação do D3;
  - `scripts/prints-do-site.mjs`, `scripts/verificar-acoes-presas.mjs`, os arquivos da busca e os
    da conferência;
  - os testes em `tests/barreiras/`.
- **`qa-acessibilidade`:** nada versionado.
- **Líder técnico:** os textos do D8, o `ambiente-decidido.txt`, os sha do D4 e o `relatorio.md`.
- **Gabriel:** o ambiente novo e a chave no GitHub, e a resposta da Q4.

## Risks / Trade-offs

- [A hipótese do D1 é falsa] → A Q1 (c) só custa um ambiente a mais e um passo do Gabriel.
  Continua certa com ou sem a hipótese.
- [A ação de baixar anexo extrai fora da pasta] → Versão fora de toda faixa de aviso publicado
  (D4), presa por sha e conferida pelo guardião.
- [O OpenSpec traz script de instalação ou transitiva vulnerável] → O apply para e volta ao
  Gabriel, com a opção (b) da Q3 como saída.
- [O global e o local do OpenSpec saem de versão] → O README diz que os dois andam juntos, e a
  tarefa 3.1 confere `openspec --version` e `npx openspec --version` iguais.
- [Print instável por fonte ou animação] → Espera das fontes e movimento reduzido. Se ficar
  instável, corrige-se a causa: não entra repetição nem aviso que deixa passar.
- [Anexo público] → O build sai de job sem segredo, e os prints mostram o site publicado antes do
  lançamento. Os textos já estão no repositório, e os lado a lado das mesmas páginas estão
  versionados no arquivo (§7). O build expira em 1 dia.
- [O tamanho do anexo do build e o tempo do download não estão medidos] → Medidos no primeiro push,
  no relatório. Se o download passar de 1 min, o anexo fica só com o que a barreira 3 varre.
- [O A1 sai pela configuração, e a prova real é o push] → No follow-up, o Gabriel confirma os
  quatro jobs verdes. Se o push ficar vermelho, a correção é imediata, antes de qualquer outra
  change.
- [O Gabriel faz o merge sem o ambiente novo] → O GitHub cria o ambiente sem a regra e sem a chave.
  A barreira 3 termina como parcialmente verificada, código 1, e a `main` fica vermelha, nunca
  verde. O passo 2 do Migration Plan vem antes do merge.
- [Uma edição que apaga a autoconferência passa nela] → `git status` e checklist inteiro (D7).

## Migration Plan

1. Na branch: as tarefas 1.1 a 7.2.
2. **Antes do merge, o Gabriel:** cria o ambiente `chave-de-servico-da-main`, com a regra de
   branch só `main` e sem revisor obrigatório, e põe nele `SUPABASE_SERVICE_ROLE_KEY`, com o valor
   lido de novo no painel do Supabase. A chave continua no `segredos-da-main`, e o fluxo antigo da
   `main` segue com segredo.
3. **No PR:** `Verificacoes` verde, com a validação e o anexo dos prints, e os três jobs do push
   pulados.
4. **Merge.** O push roda os quatro jobs. A chave vem do ambiente novo, e o token, do
   `segredos-da-main`.
5. **Só com esse push verde, o Gabriel:**
   - apaga `SUPABASE_SERVICE_ROLE_KEY` do `segredos-da-main`;
   - roda "Re-run all jobs" e confirma o verde de novo;
   - confirma por escrito um segredo por ambiente, a regra só `main` nos dois e nenhum no
     repositório nem na organização.
6. **Volta:** reverter o commit do `ci.yml`. Se a chave já saiu do `segredos-da-main`, ela volta
   para lá. O ambiente novo pode ficar, porque sem uso não faz nada.

## Open Questions

- Os nomes dos três jobs do push e o do ambiente novo podem mudar no apply sem mudar spec nem
  tarefa, desde que o `Verificacoes` continue com esse nome.
