# Relatório — ajustar-ci-ao-novo-fluxo

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/ajustar-ci-ao-novo-fluxo/proposal.md`, `design.md`, `tasks.md`,
  `specs/fundacao-e-ci/spec.md` e `specs/equipe-de-agentes/spec.md` · 7 requisitos: na
  `fundacao-e-ci`, 1 modificado e 5 novos; na `equipe-de-agentes`, 1 novo · 11 tarefas.
- **Divisão:** com o briefing inteiro seriam 21 tarefas ou mais. Aplico a divisão que o briefing
  prevê. Ficam aqui o item 1 e a busca de segredo. Vão para a `completar-ci-do-novo-fluxo`: o
  `openspec validate` no CI, os prints como anexo, as ressalvas A2 a A7 e as 7 do revisor, e a prova
  do push (Q5).
- **Questões em aberto** (as opções e o custo de cada uma estão na proposta):
  - Q1, a forma do LB-02: recomendo (a), job só no push para a `main` com os segredos num ambiente
    restrito a ela;
  - Q2, o LB-09: recomendo (b), `papeis-da-diretoria-no-banco`;
  - Q3, a ferramenta da busca: recomendo (b), script próprio com os 5 formatos da Q15 e o token
    clássico do GitHub;
  - Q4, a auditoria de base: recomendo (b), corrigir a frase da §5;
  - Q5, a prova depois do push: recomendo (a), Portão 2 com a execução do PR, e o push na change
    seguinte;
  - Q6, a versão das ações: recomendo (a), o último patch da `v4`.
- **Pontos do briefing que não cabem como estão:**
  - a "execução real no GitHub" do job com segredo só existe depois do merge (Q5);
  - mover os tipos e a barreira 3 para depois do merge pesa contra a decisão 3 do PLANO (Q1);
  - como a busca roda antes do commit, ela precisa cobrir também a árvore de trabalho (D5);
  - a frase da §5 sobre a auditoria de base contradiz a spec (Q4).
- **Incompleto:** os itens abaixo não foram conferidos por mim, porque não tenho rede nem terminal:
  - o sha das ações;
  - o formato de 82 caracteres do token do GitHub, que tirei da memória do formato publicado e da
    regra do gitleaks, e o dev confere;
  - se o job com ambiente pede permissão além de `contents: read`;
  - o número de arquivos da `main` hoje;
  - o tempo do job com segredo, que é estimativa minha, e não medição;
  - o `openspec validate` destes artefatos, que o líder técnico roda.

### Decisões do Gabriel no Portão 1, 22/11/2026

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel.

> Portão 1 da ajustar-ci-ao-novo-fluxo: aprovado, com a divisão. Registre cada decisão literal no relatorio.md.
>
> Q1 (a). Q2 (b). Q4 (b). Q6 (a).
> Q3 (b), com comprimento mínimo em todos os formatos, não exato: o github_pat_ e o ghp_ passam a "pelo menos N" caracteres, com N medido num token real de cada tipo, sem imprimir o token. Uma busca de tamanho exato fica muda se o formato mudar.
> Q5 (b): o LB-02 só sai da §6 depois que o job com segredo for visto rodando no push para a main, na primeira tarefa da completar-ci-do-novo-fluxo (RP-12).
>
> No Portão 2, entregue os passos do Gabriel no GitHub na ordem certa, junto com os comandos Git: quando criar o ambiente segredos-da-main e a regra de branch dele, quando mover os dois segredos para o ambiente, quando apagar os do repositório, e como conferir que nenhuma execução da main fica vermelha nem roda sem segredo no meio do caminho.
>
> Pode rodar o /opsx:apply.

**Decisão do Gabriel sobre o N da Q3, 22/11/2026**, em resposta ao pedido de medição do líder
técnico (literal):

> Não vou medir: com comprimento mínimo, não precisa. Use um piso abaixo do formato publicado, sem token real: github_pat_ com pelo menos 60 caracteres depois do prefixo (publicado: 82) e ghp_ com pelo menos 30 (publicado: 36). Registre no relatório que o piso vem do formato publicado, com margem, e não de medição. Pode seguir.

O piso dos dois formatos do GitHub vem do formato publicado, com margem, e **não de medição**:
nenhum token real foi medido.

Commit da proposta, feito pelo Gabriel: `edcb28a` na `chore/ajustar-ci-ao-novo-fluxo`, igual ao
remoto. Antes da primeira passagem do apply: `git rev-list --all` com 110 linhas, conferência do
ambiente com código 0.

## dev-frontend

- **Arquivos (tarefas 1.1, 1.2, 1.3 e 2.1):** M `.github/workflows/ci.yml` (173 linhas, +86 −29) ·
  M `package.json` (só `scripts`, +2 −1) · A `scripts/verificar-acoes-presas.mjs` (148) · A
  `scripts/buscar-segredo-antes-do-envio.mjs` (104) · A `scripts/buscar-segredo-antes-do-envio/funcoes.mjs`
  (189) · A `tests/barreiras/acoes-presas.test.mjs` (178) · A `tests/barreiras/busca-de-segredo.test.mjs`
  (270) · **tokens novos:** nenhum. Nada fora do D11.
- **Ações presas (D3), sha recebido do líder técnico, sem rede:** `actions/checkout` · v4.4.0 ·
  `11d5960a326750d5838078e36cf38b85af677262` · `github.com/actions/checkout` / `actions/setup-node` ·
  v4.4.0 · `49933ea5288caeca8642d1e84afbd3f7d6820020` · `github.com/actions/setup-node` /
  `actions/upload-artifact` · v4.6.2 · `ea165f8d65b6e75b540449e92b4886f43607fa02` ·
  `github.com/actions/upload-artifact`.
- **1.1 e 1.3, os grep:** `^permissions:` 1 e `permissions:` 1 · `persist-credentials: false` 2 =
  `actions/checkout@` 2 · `uses: …@v[0-9]` 0, código 1 · `secrets\.` nas linhas 157 e 172, depois de
  `Conferencias com segredo` (linha 125) · `--ignore-scripts` 1, e o job com segredo só tem esse `npm ci`.
- **1.2, RP-12, no `ci.yml` final** (linha 47 trocada para `actions/checkout@v4`; a mesma prova no
  estado da 1.2, com a linha 36, deu código 1 e depois 0, sha256 igual):

```
=== FORA DA REGRA — ações presas ===
  .github/workflows/ci.yml:47 · presa por etiqueta ou ramo (@v4), não por commit
  arquivos: 1 · referências: 5 · presas por commit: 4 · locais: 0 · fora da regra: 1
codigo: 1
=== VERIFICADO — ações presas ===
  arquivos: 1 · referências: 5 · presas por commit: 5 · locais: 0 · fora da regra: 0
codigo: 0
antes e depois: 8b6a0f04f2d3c6bf3d7530a48fc0c21eb0d881e65bee3c491cd83a519ae3c1b9
```

- **1.3, a instalação**, na pasta temporária só com os dois arquivos (`test -e .npmrc` 1 nas duas
  pastas, registro `https://registry.npmjs.org/`): `npm ci --ignore-scripts` código 0, `added 745
  packages, and audited 746 packages in 1m` · `npx supabase --version` código 0, `2.115.0`. Na mesma
  pasta, com a cópia dos arquivos rastreados e sem `.env`, o `npm run build` deu 0. Pasta apagada.
- **1.3, sem segredo** (cópia sem `.env`, `env -i` com `PATH` e `SYSTEMROOT`, e `HOME`,
  `USERPROFILE`, `APPDATA` e `LOCALAPPDATA` numa pasta vazia):
  - barreira 3 depois do build: `=== PARCIALMENTE VERIFICADO ===`, código 1;
  - tipos: **o primeiro isolamento deu código 0** (`=== VERIFICADO — tipos do banco ===`). O
    login da CLI está no Gerenciador de Credenciais do Windows (alvo `Supabase CLI:supabase`), que
    variável de ambiente não esconde. Isso é falha do isolamento, e não defeito do script, então não
    corrigi nada. Com `SUPABASE_PROFILE=supabase-staging`, perfil sem credencial guardada, deu
    `=== NAO VERIFICADO — tipos do banco ===`, com `Access token not provided`, código 1. Com
    `SUPABASE_ACCESS_TOKEN` inválido, também 1.
- **Comandos:** `npm run verificar` código 0 · `npm test` código 0, 383 testes em 21 arquivos, 0
  falhas (`casos da verificação das ações presas: 11` · `casos da busca de segredo: 30`) ·
  `playwright` não rodei (é da 4.1) · `node scripts/buscar-segredo-antes-do-envio.mjs` código 0,
  `commits: 1 · arquivos: 25 (dos commits: 7 · da árvore: 18) · linhas: 4736 · formatos: 6 ·
  achados: 0`, com os 5 arquivos novos entre os da árvore · as 6 expressões terminam em `{n,}`, 0
  exatas.
- **Desvio de forma:** o teste das ações presas roda o script como processo, em pastas temporárias.
  O D11 dá um arquivo só ao D4, e o script não tem teste de "fui chamado direto?" (achado 2).
- **Propostas:** atualizar a frase final do `scripts/verificar-tipos-do-banco.mjs`, que ainda diz
  "SUPABASE_ACCESS_TOKEN no repositorio" (agora o segredo fica no ambiente). Está fora do meu escopo.
- **Incompleto:** a prova dos tipos sem credencial foi feita por um perfil sem credencial, e não
  numa máquina sem login. A prova real é a primeira execução do push (Q5 (b)).

### Passagem B, 22/11/2026 (achados 3, 4, 5, 9 e 10 da rodada 1 do revisor)

- **3** · `ci.yml:144-149`: o comentário diz o que o lockfile mostra (nem o `supabase` nem os 8
  `@supabase/cli-*` 2.115.0 têm script de instalação), que a 1.3 rodou `npm ci --ignore-scripts` no
  Windows e que o pacote do Linux só roda no primeiro push para a `main`.
- **4** · `busca-de-segredo.test.mjs:162`: a fixture agora apaga a chave. O `SHA_1` acrescenta,
  o `SHA_2` (mais novo) tira a linha, e a árvore fica vazia. O caso acusa `1111111 · notas.txt:3`
  e não cita `2222222`.
- **5** · `funcoes.mjs:109` (`lerStatus` devolve `{ caminho, versaoNoIndice }`, com X fora de
  espaço, `?` e `D`; conflito de merge lança, o que dá 2) · `funcoes.mjs:150` (versão do índice
  examinada; igual à do disco conta uma vez, como da árvore) · `buscar-segredo-antes-do-envio.mjs:90`
  (`cat-file blob :<caminho>`). Casos novos em `:193`, `:209` e `:305`, com o leitor falso.
  **A saída mudou de formato:** `(dos commits: a · da árvore: b · do índice: i)`, e o achado do
  índice sai como `índice`. O `design.md:151` ainda dá o formato antigo, e ele está fora do meu
  escopo. A spec não precisou mudar: ela já diz "o que ainda vai entrar num commit".
- **9** · nenhum nome de uma letra nos 5 arquivos (o `grep` deu código 1).
- **10** · `verificar-acoes-presas.mjs:48` e `:82` (`restoDoUses`): agora o script vê `uses:` em
  mapa de uma linha, logo depois de `{` ou de `,`, com o comentário depois de `}`. Casos novos em
  `acoes-presas.test.mjs:95` (presa, 3 formas, verde) e `:142` (por etiqueta, 3 formas, e por
  commit sem versão, vermelho).
- **Vistos falhando:** sem o ramo do mapa e sem a leitura do índice, 4 falhas (os 4 casos novos),
  e o código voltou com o sha256 igual.
- **Comandos** (`test -e .npmrc` 1 · registro `https://registry.npmjs.org/`): `npm test` código 0,
  388 testes em 21 arquivos, 0 falhas (`casos da busca de segredo: 33` ·
  `casos da verificação das ações presas: 13`) · `npm run verificar` código 0, `arquivos: 1 ·
  referências: 5 · presas por commit: 5 · locais: 0 · fora da regra: 0` · `verificar:acoes` com a
  `ci.yml:52` em `@v4`: código 1, `fora da regra: 1`; restaurado: código 0, sha256 `97676a6a…734a4`,
  igual ao de depois da correção do comentário · `node scripts/buscar-segredo-antes-do-envio.mjs`
  código 0, `commits: 1 · arquivos: 26 (dos commits: 7 · da árvore: 19 · do índice: 0) · linhas:
  5244 · formatos: 6 · achados: 0` · `playwright` não rodei.
- **Incompleto:** o leitor real do índice não foi visto com uma mudança preparada, porque isso
  exige `git add`. Vi só a forma `git cat-file blob :package.json`, que deu o mesmo sha256 do
  `HEAD:package.json`.

### Passagem C, 22/11/2026 (achados 2 e 3 da rodada 2 do revisor)

- **2, a mensagem** · `buscar-segredo-antes-do-envio.mjs:92` (`mensagemDoCommit`, por
  `cat-file commit <sha>`: o objeto inteiro, com `author`, `committer` e a mensagem) ·
  `funcoes.mjs:127` e `:158`: o achado sai como `<sha curto> · mensagem do commit:<linha>`, com a
  linha da saída de `git cat-file commit <sha>`, mascarado como os outros. **Contador:** um campo
  novo logo depois de `commits`, `commits: C · mensagens: M · arquivos: …`, e as linhas da
  mensagem entram em `linhas`; nada mais da linha mudou (`funcoes.mjs:188`). Casos novos em
  `busca-de-segredo.test.mjs:195` (chave na mensagem acha), `:211` (autor e quem fez o commit) e
  `:237` (mensagem sem chave não acha).
- **3, os nomes** · `n` → `comprimento` (teste `:62`) · `args` → `argumentos` (script `:45`) ·
  `xy` → `estado` (`funcoes.mjs:118`) · `item` → `entrada` (`verificar-acoes-presas.mjs:111` e
  `:118`). A busca, sobre os 5 arquivos, pega declaração, parâmetro, argumento e espalhamento de
  até 3 letras e 22 abreviações comuns:
  `grep -nE '(\b(const|let|var|function)\s+[A-Za-z_$]{1,3}\b|[(,]\s*(\.\.\.)?[A-Za-z_$]{1,3}\s*[,)=]|\b[A-Za-z_$]{1,3}\s*=>|\.\.\.[A-Za-z_$]{1,3}\b|\b(args|argv|opts|cfg|msg|res|req|err|tmp|idx|cb|fn|el|val|obj|arr|str|num|xy|item)\b)'`,
  sem as linhas de comentário. Saída: 16 linhas, código 0, todas `sha` (termo do Git, §6), `SHA`,
  `uso`, o `...new` de `[...new Set(…)]` ou o `num` português dentro de texto.
- **Vista falhando:** sem a linha `funcoes.mjs:158`, os 3 casos novos falharam (34 de 37
  passaram); de volta, `sha256sum -c` deu `OK`, código 0.
- **Comandos** (`test -e .npmrc` 1 · registro `https://registry.npmjs.org/`): `npm test` código 0,
  391 testes em 21 arquivos, 0 falhas (`casos da busca de segredo: 36` ·
  `casos da verificação das ações presas: 13`) · `npm run verificar` código 0 ·
  `node scripts/buscar-segredo-antes-do-envio.mjs` código 0, `commits: 1 · mensagens: 1 ·
  arquivos: 26 (dos commits: 7 · da árvore: 19 · do índice: 0) · linhas: 5423 · formatos: 6 ·
  achados: 0` (rodada depois desta seção escrita) · `playwright` não rodei.
- **Fora do meu escopo:** o `design.md` D5 ainda dá a saída e a lista do Git sem a mensagem.
  Booleanos sem verbo (`versaoNoIndice`, `semOrigem`, `falhaNoCommit`) ficaram, porque não
  estavam no pedido.

## dev-dados

Não entrou: a change não lê nem grava no banco (LB-09 foi para a R2 pela Q2 (b)).

## guardiao-visual

Não entrou: a change não tem tela. A prova de que nenhuma tela muda é a comparação da raiz não
publicada pelo `qa-acessibilidade` (D10).

## qa-acessibilidade

Tarefas 2.2 e 4.1 (22/11/2026). Change sem tela; nada versionado criado. `git status --porcelain
--untracked-files=all` igual antes e depois (19 linhas, `diff` código 0).

- **2.2, RP-12 da busca (D6).** Passo 1 lê 26 arquivos: 7 do commit `edcb28a` e 19 da árvore,
  com `proposal.md`, `design.md` e `relatorio.md` desta change nas duas listas. Passo 2:
  `qa-chave-falsa.txt` na raiz, `git check-ignore -v` código 1, chave no formato do JWT gerada
  por `node -e` com o prefixo em dois pedaços, na linha 2. Maior trecho do valor presente na
  saída: 2 caracteres (coincidência de letras), nenhum `eyJ`.

```text
passo 1 · codigo: 0
=== NADA ACHADO — busca de segredo ===
  commits: 1 · arquivos: 26 (dos commits: 7 · da árvore: 19) · linhas: 4933 · formatos: 6 · achados: 0

passo 2 · codigo: 1
=== ACHADO — segredo no que vai ser enviado ===
  JWT do Supabase · árvore · qa-chave-falsa.txt:2 · [MASCARADO · 72 caracteres · qa-chave-falsa.txt:2]
  Não envie. Tire o valor do arquivo e, se ele já entrou num commit, troque a chave.
  commits: 1 · arquivos: 27 (dos commits: 7 · da árvore: 20) · linhas: 4935 · formatos: 6 · achados: 1

passo 3 (arquivo apagado) · codigo: 0
=== NADA ACHADO — busca de segredo ===
  commits: 1 · arquivos: 26 (dos commits: 7 · da árvore: 19) · linhas: 4933 · formatos: 6 · achados: 0
```

- **4.1, antes do npm:** `test -e .npmrc` código 1 · `npm config get registry` devolve
  `https://registry.npmjs.org/` (código 0).
- **`npx playwright test`:** código 0 · **413 passed**, 0 falhas, 0 flaky, 0 pulados, com
  build novo · 4 páginas × 7 larguras: rolagem `scrollWidth = clientWidth` em 28 de 28 ·
  alvos 63 medidos (51 em 1280) / 0 abaixo de 44 px · Tab 43 controles (51 em 1280) / 0 sem
  foco visível · 28 testes com axe passam (a saída não imprime a contagem de nós).
- **Raiz não publicada (D10):** método do `guardiao-visual` da `pagina-sobre-e-equipe`:
  `iniciar-servidor.mjs nao-publicado 3001` sobre o build da suíte, Chromium, escala 1,
  390 × 844 e 1280 × 800, página inteira, 3 s depois das fontes, comparação em canvas.
  **0 / 329.160** (390) e **0 / 1.024.000** (1280) pixels diferentes, status 200, rolagem 0.
  A comparação foi vista falhando: com 3 × 2 px vermelhos injetados, 6 diferentes em cada
  largura (caixa x 10 a 12, y 10 a 11), código 1; sem a injeção, 0 de novo, código 0.
- **`git diff --exit-code main -- src tests/e2e public playwright.config.ts`:** código 0.
- **Temporários:** a pasta `scratchpad/qa/` (script e 2 prints) e `qa-chave-falsa.txt` foram
  apagadas; servidor da 3001 derrubado, portas 3000 e 3001 livres.
- **Defeitos:** nenhum · **sem cobertura:** contagem de nós do axe por página (só passa ou
  falha).

## revisor

### Rodada 1, 22/11/2026 (invocação nova, contexto limpo)

- **Veredito:** aprovado com ressalva · 21 de 21 arquivos · 8 critérios de aceite (1, 2, 4, 5 e 7
  cumpridos; 3 e 6 em parte, com o resto para o Portão 2 e a `completar-ci-do-novo-fluxo` pela
  Q5 (b); 8 pendente da 4.3) · 14 regras.
- **Achados:**
  1. baixa · `CLAUDE.md:184`: "antes de qualquer `git`" virou "antes de qualquer `git add`", o que
     afrouxa a conferência do ambiente (§5);
  2. baixa · `docs/PLANO-DE-DESENVOLVIMENTO.md:98` e `:11`: a linha da R0 ainda dá à change o
     `openspec validate` e os prints, e a :11 aponta a "seção 7, R0";
  3. baixa · `.github/workflows/ci.yml:146-147`: "executado na tarefa 1.3", mas a 1.3 rodou no
     Windows, e o pacote da CLI para Linux só roda no primeiro push;
  4. baixa · `tests/barreiras/busca-de-segredo.test.mjs:139-153`: o caso diz "apagada no commit
     seguinte" e nenhum commit apaga; o leitor real do Git nunca foi visto falhando com chave num
     commit (RP-12);
  5. baixa · `scripts/buscar-segredo-antes-do-envio.mjs:84-86` e `funcoes.mjs:126-131`: a árvore é
     lida do disco, e não do índice; uma versão já preparada (`MM`, `AM`) não é examinada (AS-01);
  6. baixa · `docs/SEGURANCA.md` §6: as linhas do LB-02, LB-08 e LB-17 esperam a 4.3, que mudaria o
     texto depois da revisão;
  7. informativa · `README.md:260-262`: o item "Fork" ficou velho, porque hoje nenhum PR recebe
     segredo;
  8. informativa · `proposal.md:31` e `design.md:177` citam a §2 da `EQUIPE-DE-AGENTES.md`, e a
     tabela alterada é a da §7.1;
  9. informativa · nomes de uma letra nos scripts novos (PADROES §6);
  10. informativa · `verificar-acoes-presas.mjs:41`: `uses:` em mapa de uma linha não é visto.
- **Não conseguiu conferir** (sem terminal): os sha oficiais das tags, o sha256 do `CLAUDE.md`, os
  códigos dos comandos, o que mudou fora dos 21 arquivos, a busca sobre um commit real com chave e
  o que só aparece no GitHub. Os seis primeiros estão na tarefa 4.2 e no D3 deste relatório.
- **Encaminhamento:** o líder técnico corrige 1, 2, 6 e 7, e conferiu o 3 no lockfile (o
  `@supabase/cli-linux-x64` 2.115.0 não tem script de instalação, como nenhum dos 8 pacotes de
  plataforma); o `dev-frontend` corrige 3, 4 (nome do caso), 5, 9 e 10. A metade "vista falhando
  num commit real" do 4 não se faz por agente, porque exige `git commit`: vai ao Gabriel como Q7 no
  Portão 2, com uma demonstração num repositório descartável fora do projeto. O 8 fica, declarado:
  é a referência de seção num artefato aprovado, sem efeito no que se entrega. Depois, revisor e
  guardião rodam de novo, cada um numa invocação nova.

### Rodada 2, 22/11/2026 (invocação nova, contexto limpo, depois da passagem B)

- **Veredito:** aprovado com ressalva · 21 de 21 arquivos · 8 critérios (1, 2 e 4 cumpridos, 8 no
  texto; 3 e 6 em parte, pela Q5 (b); 5 e 7 sem terminal) · 14 regras.
- **Achados:**
  1. média · `relatorio.md`, 2.2 e 4.2: evidência anterior à passagem B (sem "do índice"; 383
     testes e 30 casos), e o `openspec validate --all --strict` não refeito depois das últimas
     edições (RP-12, princípio 10);
  2. média · `funcoes.mjs:141-147` e `SEGURANCA.md` §5: a busca não lê a mensagem nem o autor dos
     commits, que o push publica, e o limite não está declarado (AS-01);
  3. baixa · `busca-de-segredo.test.mjs:62` (`n`) e `buscar-segredo-antes-do-envio.mjs:42`
     (`args`), contra a conferência de nomes que o relatório dava como feita (PADROES §6);
  4. baixa · `relatorio.md`: o sha256 do `CLAUDE.md` citado ficou velho;
  5. baixa · `SEGURANCA.md` §6: LB-08 e LB-17 já em "Saíram da lista" antes do guardião;
  6. informativa · `CLAUDE.md`, README e §5 não diziam que a busca lê o índice;
  7. informativa · README, "Fork": a garantia é não haver segredo no nível do repositório, e não o
     conteúdo do `ci.yml`;
  8. informativa · `SEGURANCA.md:3-6`: o resumo da 3.1 não citava a §6, e uma linha passava de 100
     colunas;
  9. informativa · `SEGURANCA.md` §6: a evidência supõe o archive em 22/11;
  10. informativa · `funcoes.mjs:29`: a chave PEM numa linha só, com `\n` como texto, não casa, e o
      limite não estava declarado.
- **Encaminhamento:**
  - O `dev-frontend` corrigiu o 2 e o 3 na passagem C.
  - O líder técnico corrigiu:
    - o 1: a 2.2 e a 4.2 refeitas abaixo, sobre o código final;
    - o 4: o sha abaixo;
    - o 6, o 7 e o 8 nos textos;
    - o 10, como limite declarado na §5, porque a expressão é a aprovada;
    - os três booleanos que não começavam com verbo, apontados pelo `dev-frontend` na passagem C:
      `temVersaoNoIndice`, `faltaOrigem` e `deveFalharNoCommit`.
  - O 5 fica, declarado: as linhas valem só com o veredito do guardião desta change, que as confere
    pela própria seção dele. Se ele não confirmar, elas voltam para a tabela antes do archive. Mover
    depois do guardião mudaria o diff depois da revisão (achado 6 da rodada 1).
  - O 9 fica: o archive sai em 22/11. Se cair noutra data, o caminho muda no mesmo diff, como na
    §7.
  - A mensagem do commit que ainda vai ser feito não existe quando a busca roda. Isso foi declarado
    na §5.

### Rodada 3, 22/11/2026 (invocação nova, contexto limpo, depois da passagem C e dos booleanos)

- **Veredito:** aprovado com ressalva · **nenhum achado pede correção antes do Portão 2** · 21 de
  21 arquivos · 8 critérios (1, 2, 4 e 8 cumpridos; 3 e 6 em parte, pela Q5 (b); 5 e 7 sem
  terminal) · 14 regras. Confirmados sem achado: o `ci.yml` contra D1 a D3, nada afrouxado além da
  Q1 (a), Git só de leitura, saída sem o valor, a cobertura de commit (mensagem e autor), árvore e
  índice, as 6 expressões de mínimo, 36 e 13 casos sem chave inteira, os nomes e a mesma ordem
  conferência → busca → `git add` nos cinco textos.
- **Achados, todos como ressalva declarada** (nenhum corrigido, porque corrigir abriria uma quarta
  rodada):
  1. baixa · `docs/SEGURANCA.md:507-512`: dois limites da busca não declarados: o nome do arquivo
     não é examinado, e texto em UTF-16 não casa (lido byte a byte em latin1);
  2. baixa · `funcoes.mjs:230`: a mensagem manda trocar a chave só "se ele já entrou num commit",
     e a spec `equipe-de-agentes` e a §5 mandam trocar sempre;
  3. baixa · `relatorio.md`, seção `dev-frontend` (1.1 e 1.3): números de linha e tamanhos
     anteriores à passagem B. Hoje o `ci.yml` tem 175 linhas, com `secrets.` em 159 e 174;
  4. baixa · `relatorio.md`, seção `qa-acessibilidade` (4.1): o `playwright` (413) e a comparação
     pixel a pixel rodaram antes das passagens B e C. Continuam valendo pelo `git diff --exit-code
     main -- src tests/e2e public playwright.config.ts` com código 0, porque B e C não tocaram
     tela, mas isso precisa estar escrito, e está aqui;
  5. informativa · `docs/SEGURANCA.md:400-411`: o inventário de leitura de `process.env` não traz a
     busca (`PATH` e `SYSTEMROOT` por nome fixo) nem o `spawnSync` sem `env` de
     `acoes-presas.test.mjs:41`, que repassa o ambiente herdado;
  6. informativa · forma: linhas longas no `CLAUDE.md:184` e no `README.md:357`; e "Ressalva
     aceita pelo líder técnico" na 1.3 é lacuna de medição, não risco aceito. Agente nenhum aceita
     risco, e a palavra fica corrigida aqui: **lacuna de medição declarada**.
- **Encaminhamento:** os 6 vão à seção 5 da entrega do Portão 2. O 1, o 2 e o 5 entram como
  pedido para a `completar-ci-do-novo-fluxo`, que já mexe na busca e na §5.

### Rodada de texto, 22/11/2026 (invocação nova, contexto limpo, só o diff de `git diff 08ba82f`)

- **Veredito:** aprovado com ressalva · 4 de 4 arquivos (111 linhas) · 3 decisões e 6 regras.
  Nenhuma frase afrouxa regra. A linha do A1 traz os cinco elementos da §5. A lista da Q9 (12
  itens) bate com os achados baixos e informativos abertos.
- **Achados:**
  1. baixa · `docs/SEGURANCA.md:519` e `:579`: a revogação do PAT antigo virou **condição de
     saída** do LB-02, e as três condições são atribuídas à Q5 (b). O Gabriel decidiu a revogação
     como passo depois do passo 4, e a Q5 (b) cobre só o job visto no push;
  2. baixa · `docs/SEGURANCA.md:580`: o motivo do A1 corta a segunda metade do motivo literal ("e
     a change seguinte já mexe no CI");
  3. baixa · `docs/PLANO-DE-DESENVOLVIMENTO.md:113` ("tira o LB-02 da §6") e, fora do diff,
     `tasks.md:122-127` (a 4.3 manda escrever "a correção está feita na configuração") e
     `tasks.md:147-150` (o follow-up sem a revogação) divergem da §6 nova;
  4. informativa · `SEGURANCA.md:579`: "a metade das dependências" generaliza; o A1 é a chave de
     serviço depois do `Build`;
  5. informativa · o caminho do aceite do A1 depende da data do archive, como o A6;
  6. informativa · `relatorio.md`, guardião: "nenhum até aqui. A1 vai a ele como Q8." foi
     substituído, e não complementado.
- **Não conseguiu conferir:** a literalidade das aspas contra a mensagem do Gabriel, o diff inteiro
  por comando, a seção 6 da entrega e se o PAT antigo é o mesmo do login local da CLI (se for, a
  revogação quebra o `banco:tipos:check` na máquina do Gabriel).
- **Pede correção:** sim, 1, 2 e 3. É o terceiro pedido de correção do `revisor` nesta change
  (rodadas 1, 2 e esta). Pela regra 4 da dieta, o líder técnico parou, sem corrigir, e levou ao
  Gabriel. O `guardiao-appsec` não rodou sobre a rodada de texto.

### Decisões do Gabriel sobre Q10 e Q11, e a saída da Q7, 22/11/2026

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel.

> Decisões do Gabriel (registre literal no relatorio.md):
> Q10 (a): a revogação do PAT antigo é condição de saída do LB-02, junto com as outras duas; a atribuição passa a "Q5 (b) e Portão 2". Antes de revogar, o Gabriel confere no Supabase (Account, Access Tokens) que o token do CI não é o do login local da CLI.
> Q11 (a): autorizo a quarta passagem, só sobre o diff dos 3 achados de texto, com o revisor e o guardião. Se o revisor pedir correção de novo sobre esse texto, o achado vai declarado para a completar-ci-do-novo-fluxo, sem quinta passagem.
>
> Q7: o gestor leu o demonstracao-q7.sh, e o Gabriel rodou a partir do /tmp. Resultado, para o relatório:
> - casos 1, 2 e 3: código 1, com o achado mascarado (48 caracteres) no commit e5... intermediário (a.txt:1), na mensagem do commit (linha 6) e no índice (b.txt:1). O leitor real foi visto falhando nos três caminhos que o RP-12 pedia.
> - caso 4: código 1, por erro da demonstração, não da busca. O git rm -q --cached b.txt foi recusado ("staged content different from both the file and the HEAD"; faltou -f), então a chave ficou no índice e a busca a achou de novo, corretamente.
> - o caminho limpo da busca real já está demonstrado no repositório (RP-12 0 → 1 → 0, e o commit wip com achados: 0). Não é preciso rodar de novo.
> - pasta temporária apagada; a cópia do script em C:\Projetos foi removida pelo Gabriel.
>
> Depois: o archive e o Portão 2 final, com os comandos Git em blocos separados (a conferência do ambiente e a busca de segredo primeiro) e os passos do Gabriel no GitHub, na ordem, já com o PAT novo e a revogação.

**RP-12 do leitor real (Q7), pelo Gabriel:** a busca foi vista falhando, com código 1 e o valor
mascarado, nos três caminhos que só o leitor real alcança: chave num commit intermediário apagada
no seguinte, chave na mensagem de commit e chave só no índice. O defeito do caso 4 é do script da
demonstração (faltou `-f` no `git rm --cached`), escrito pelo líder técnico, e não da busca. O
caminho limpo (código 0) fica provado pelo RP-12 da tarefa 4.2 e pela busca do commit wip.
Conferido pelo líder técnico depois da mensagem: `git status --porcelain --untracked-files=all` só
com os 4 arquivos da rodada de texto, sem cópia do script no repositório.

### Revisor, quarta passagem, 22/11/2026 (invocação nova, só o diff dos 3 achados, Q11 (a))

- **Veredito:** aprovado com ressalva · 4 arquivos, 73 linhas · as 3 correções conferem: a
  conferência do token e a atribuição "Q10 (a)" e "Q5 (b) e Portão 2" na §5 e na §6; o motivo do
  A1 igual ao literal da Q8 (b); o plano e o `tasks.md` com as três condições e a revogação.
  Nenhuma frase afrouxa regra nem aceita risco no lugar do Gabriel.
- **Achados, declarados para a `completar-ci-do-novo-fluxo` sem quinta passagem (Q11 (a)):**
  1. baixa · `tasks.md:148-149`: o follow-up não traz "com a regra só `main`" da condição 2;
  2. baixa · `design.md:202-204` (D8) ainda diz que a linha do LB-02 diz "a correção está feita
     na configuração"; `proposal.md:77` repete, como registro do Portão 1;
  3. informativa · `SEGURANCA.md:519`: "o token do CI" é ambíguo entre o PAT antigo e o novo, e
     nenhum texto diz o que fazer se o antigo for o do login local (a decisão também não diz).

### Guardião, passagem 2, 22/11/2026: levantamento sobre o diff de texto depois de `08ba82f`

- **Veredito provisório:** APROVADO COM RESSALVAS · bloqueante 0 · alta 0 · média 1 · baixa 0 ·
  informativa 4 · checklist inteiro sobre o diff (passo 1: `docs/SEGURANCA.md` e o plano estão no
  gatilho). AS-01 sem achado nos 4 arquivos; AS-09 com A a E; AS-17 e os demais não se aplicam.
  Confirmou que a linha nova do A1 na §6 traz achado, motivo, prazo, change e aceite do Gabriel, e
  que a §5 nova bate com a §6 e o D1.
- **Achados:**
  - **A · AS-09 (com AS-01) · média · provável:** `SEGURANCA.md:515` e `:520`, `design.md:66-67`.
    A chave de serviço teve a mesma exposição que o PAT (o passo dela vinha depois do `npm run
    build` do PR, no mesmo job), mas "mantém o valor", e nenhuma condição do LB-02 nem linha da §6
    registra isso. Critério: antes de o LB-02 sair, (a) uma quarta condição com valor novo da
    chave no ambiente e o antigo invalidado no Supabase, ou (b) uma linha própria na §6 com o
    aceite escrito do Gabriel. **Pede decisão do Gabriel (Q12).**
  - B · informativa · a 1ª condição do LB-02 na §6 diz menos que o `tasks.md` e o D1 (os dois
    jobs, o ambiente e nenhuma execução vermelha);
  - C · informativa · a condição de saída do A1 não diz se o download de artefato é permitido,
    vale só para "o job", não exige setup-node sem `cache` e não nomeia o `$GITHUB_ENV`;
  - D · informativa · o texto não diz que a revogação acontece mesmo se o token for o do login
    local;
  - E · informativa · `design.md:202-204` (D8), `:242-244` e `tasks.md:64-65` com texto velho (o
    mesmo do achado 2 da quarta passagem do revisor).
- **Pedidos de comando** (Git Bash, `MSYS_NO_PATHCONV=1`, conferência código 0 antes), R = o
  `relatorio.md` desta change, todos na forma `git grep -c -a --untracked -e '<texto>' -- 'R'`:
  - P1 `'eyJ[A-Za-z0-9_-]\{10,\}\.eyJ[A-Za-z0-9_-]\{10,\}'` · P2 `'sb_secret_[A-Za-z0-9_-]\{10,\}'`
    · P3 `'sbp_[A-Za-z0-9]\{20,\}'` · P4 `'github_pat_[A-Za-z0-9_]\{60,\}'` · P5
    `'ghp_[A-Za-z0-9]\{30,\}'` · P6 `'-----BEGIN [A-Z ]*PRIVATE KEY-----'` · saída vazia ·
    `[código de saída: 1]` nos 6;
  - P7 `'Decisões do Gabriel no Portão 2'` · `…/relatorio.md:1` · `[código de saída: 0]`;
  - P8 `'o build da Vercel já roda com as variáveis de produção'` · `…/relatorio.md:2` ·
    `[código de saída: 0]`;
  - P9 `'mantém o valor'` · `…/relatorio.md:1` · `[código de saída: 0]` (a ocorrência é a decisão
    literal do Gabriel).
- **Encaminhamento:** a decisão do guardião, numa invocação nova, fica para depois da Q12, junto
  com o texto que ela pedir. B a E vão declarados para a `completar-ci-do-novo-fluxo`, como a Q9
  (a).

### Decisão do Gabriel sobre a Q12, 22/11/2026

Registrada pelo líder técnico, com o texto literal da mensagem do Gabriel.

> Q12 (b), decisão do Gabriel (registre literal no relatorio.md): a chave de serviço do CI é do formato antigo, em JWT (o .env local é eyJ..., conferido pelo gestor sem ler o valor). Trocá-la agora exigiria girar o segredo JWT do projeto, com efeito na chave anônima, na Vercel e no .env. Fica aceita por escrito, numa linha própria da §6:
> - motivo: só quem tem escrita no repositório alcançava o passo (PR de fork não recebe segredo), e o banco está dormente na R1, sem página que o leia;
> - prazo: R2, na papeis-da-diretoria-no-banco, que migra para as chaves novas do Supabase (sb_publishable_ e sb_secret_) e desliga as chaves antigas, o que invalida a chave exposta;
> - condição: se o banco de produção passar a ter dado pessoal real antes disso, a troca vem antes.
> O PAT segue como decidido na Q10: novo no ambiente e o antigo revogado.
>
> O revisor não roda de novo (Q11 (a)). O guardião decide numa invocação nova, sobre esse texto e as saídas de P1 a P9. Depois: o archive e o Portão 2 final, com os comandos Git em blocos separados (conferência do ambiente e busca de segredo primeiro) e os passos do Gabriel no GitHub, na ordem.

- **Risco aceito pelo Gabriel:** A da passagem 2 do guardião · AS-09 com AS-01 · média · a chave
  de serviço, em JWT, chegou a passos do CI que rodavam código de PR e mantém o valor · aceite
  literal acima · motivo, prazo R2, change `papeis-da-diretoria-no-banco` e condição como no
  aceite · 22/11/2026. Linha própria na §6, escrita pelo líder técnico.

### Guardião, passagem 2, decisão, 22/11/2026 (invocação nova, só o texto depois de `08ba82f`)

- **Veredito final:** **APROVADO COM RESSALVAS** · bloqueante 0 · alta 0 · média 1 (hipótese) ·
  baixa 1 (hipótese) · informativa 3 · checklist inteiro sobre o diff (passo 1). AS-01 sem achado
  no diff nem no `relatorio.md` (P1 a P6); AS-09 e AS-10 com os achados abaixo; os demais não se
  aplicam.
- **Achado A do levantamento:** respondido pelo aceite do Gabriel, Q12 (b). A linha nova da §6 tem
  achado, motivo, prazo R2, change, ponteiro do aceite e a condição de troca antecipada; nenhum
  aceite de agente; prazo R2 coerente com a §5 (não é bloqueante confirmado e explorável hoje: o
  banco está sem contas e sem mensagens pela condição do LB-01, e a migração vem "antes de tudo na
  R2"). LB-02, A1, a §5 nova, o D1 e o `tasks.md` concordam entre si.
- **Achados (lista inteira), todos declarados, sem nova passagem:**
  - **M1 · AS-01 com AS-09 · média · hipótese:** `SEGURANCA.md:584`. Desligar as chaves antigas
    pode não invalidar o JWT exposto, se o segredo JWT legado continuar entre as chaves de
    verificação; com a `sb_publishable_` no `apikey` e o JWT antigo no `Authorization`, o banco o
    aceitaria como `service_role`. Critério: a condição de saída exige também o segredo JWT legado
    revogado, com confirmação escrita do Gabriel no relatório da `papeis-da-diretoria-no-banco`;
  - **B1 · AS-10 · baixa · hipótese:** invalidar a chave não apaga o que alguém tenha gravado com
    ela (conta pela API de administração, notícia com link `javascript:`). Critério: antes de
    qualquer change da R2 que leia o banco, contagem registrada de contas, linhas por tabela exposta
    e objetos do armazenamento, igual à esperada;
  - I1 · informativa · confirmado: o caminho do archive nas linhas 583 e 584 precisa ser o real
    (conferido abaixo, depois do archive);
  - I2 · informativa · confirmado: o cabeçalho da versão 3.1 não cita as duas linhas novas da §6
    nem a troca do PAT;
  - I3 · informativa · provável: o motivo da Q12 (b) diz "só quem tem escrita no repositório
    alcançava o passo", mas o código de dependência também alcançava, sem escrita. O motivo é do
    Gabriel; vai a ele na entrega, para registrar que viu.
- **Pedidos de comando** (conferência código 0 antes), na forma `git grep -c -a --untracked -e
  '<texto>' -- '<relatorio.md desta change>'`:
  - P10 `'Decisão do Gabriel sobre a Q12'` · `…/relatorio.md:1` · `[código de saída: 0]`;
  - P11 `'PR de fork não recebe segredo'` · `…/relatorio.md:1` · `[código de saída: 0]`;
  - P12 `'passar a ter dado pessoal real'` · `…/relatorio.md:1` · `[código de saída: 0]`.
- **Encaminhamento do líder técnico:** M1 e B1 entram como requisito da condição de saída para a
  `papeis-da-diretoria-no-banco`, que é a change que tira a linha da §6; I1 conferido no archive; I2
  declarado para a `completar-ci-do-novo-fluxo`; I3 vai ao Gabriel na entrega.

### Tarefa 4.3, conferida pelo líder técnico, 22/11/2026

`sed -n '/^## 6\./,/^### Saíram da lista/p' docs/SEGURANCA.md | grep -cE '^\| LB-(08|17) '` → 0 ·
a mesma faixa com `'^\| LB-02 .*completar-ci-do-novo-fluxo'` → 1 · "Saíram da lista" com
`'^\| LB-(08|17) .*ajustar-ci-ao-novo-fluxo'` → 2. Revisor: aprovado com ressalva (rodadas 1 a 3,
de texto e quarta passagem). Guardião: APROVADO COM RESSALVAS nas duas passagens, nenhum BLOQUEADO
aberto.

## guardiao-appsec

O guardião não escreve: o líder técnico registra o relatório em uma tela por passagem, com a lista
de achados inteira; a saída de comando e o aceite do Gabriel vão literais.

### Passagem 1, 22/11/2026: levantamento e decisão (duas invocações novas)

- **Veredito final:** **APROVADO COM RESSALVAS** · bloqueante 0 · alta 0 · média 1 · baixa 2 ·
  informativa 3 · conferência completa (passo 1 da conferência proporcional: o diff toca a lista do
  gatilho e acrescenta `process.env`; o guardião concordou). 20 de 21 arquivos conferidos; o
  `relatorio.md` não foi aberto, por regra, e foi coberto por P1 a P12.
- **Estados:** AS-01 com o achado A3 e sem segredo nos 20 arquivos nem no `relatorio.md`;
  AS-06, AS-08 e AS-17 sem achado (o `CLAUDE.md` muda com decisão registrada e conferência 0);
  AS-09 com A1, A2, A4, A5 e A6; AS-02 a AS-05, AS-07, AS-10 a AS-16 não se aplicam (nenhum
  arquivo de `src/`, `public/`, banco, cabeçalho ou dado pessoal no diff; LB-07 segue aberto).
- **Riscos da §6:** **LB-08 sai** (`permissions` só no topo, `persist-credentials: false` em 2 de
  2 checkouts). **LB-17 sai** (5 de 5 `uses:` presos por sha, iguais ao `ls-remote` das tags
  oficiais abaixo; a verificação roda no CI e no `verificar`). **LB-09 fica**, coerente com a Q2
  (b). **LB-02 fica** (Q5 (b)), e o texto "correção feita na configuração" diz mais do que a
  correção cobre (A1).
- **Achados (lista inteira):**
  - **A1 · AS-09 · média · confirmado:** no job `conferencias-com-segredo`, o `Build`
    (`ci.yml:164-165`) roda código de dependência antes do passo que recebe a chave de serviço
    (`ci.yml:172-175`). Cenário: dependência maliciosa já no lockfile da `main` reescreve o script
    da barreira 3 no disco do executor ou põe um `npm` falso no `$GITHUB_PATH`, e o passo seguinte
    manda a chave para fora. Média, e não alta, porque o código do PR já não alcança o segredo.
    Critério: o LB-02 não sai enquanto, num job com segredo, um passo que roda código de
    dependência ou do build vier antes do passo com segredo, salvo aceite do Gabriel numa linha
    própria da §6. Corrigido, a prova é ler o `ci.yml`: antes de cada `secrets.`, só checkout,
    setup-node e `npm ci --ignore-scripts`. Em qualquer caso, a linha do LB-02 não diz "correção
    feita" com o resíduo aberto. **Pede decisão do Gabriel (Q8).**
  - **A2 · AS-09 · baixa · confirmado:** `verificar-acoes-presas.mjs:42` e `:48` não veem `uses`
    em sequência em fluxo (`steps: [{ uses: … }]`), e ação local fora de `.github/actions/` não é
    lida. Critério: caso de teste com essa forma presa por tag sai fora da regra, com código 1.
  - **A3 · AS-01 · baixa · confirmado:** `funcoes.mjs:54-56` lê em latin1, e uma chave em UTF-16
    (o `>` do Windows PowerShell 5.1) não casa; o limite não está na §5. Critério: caso de teste
    em UTF-16LE, com e sem BOM, sai com 1, ou o limite escrito na §5 com decisão do Gabriel.
  - **A4 · AS-09 · informativa · hipótese:** a falta de `^{}` no `ls-remote` com ref completa não
    prova tag leve. Critério: leitura que mostraria a linha descascada, ou a execução do PR com as
    3 ações resolvidas.
  - **A5 · AS-09 · informativa · hipótese:** segredo no nível da organização chegaria a qualquer
    job. Critério: a confirmação da `completar-ci-do-novo-fluxo` traz 0 segredos de organização
    visíveis ao repositório, e o passo 5 do README diz que nenhum vai para a organização.
  - **A6 · AS-09 · informativa · confirmado:** a evidência do LB-08 e do LB-17 aponta o caminho do
    archive com data 22/11, que ainda não existe. Critério: no diff do archive, o caminho igual ao
    da pasta criada.
- **Pedidos de comando** (Git Bash, `MSYS_NO_PATHCONV=1`; precondições: conferência código 0,
  `test -e .npmrc` código 1, registro `https://registry.npmjs.org/`, `git rev-parse main` =
  `git ls-remote origin refs/heads/main` = `c32142cf06dc8664bba1a623829de508a316baf6`, `git
  rev-list main..HEAD` = `edcb28a7222be257b47c31acde8d6651db8822e9`, `curl` 8.7.1):
  - P1 a P6 · AS-01 · `git grep -c -a --untracked -e '<formato>' -- '<relatorio.md desta
    change>'`, com os 6 formatos em BRE (JWT com cabeçalho e carga, `sb_secret_` 10+, `sbp_` 20+,
    `github_pat_` 60+, `ghp_` 30+, cabeçalho PEM) · saída vazia · `[código de saída: 1]` nos 6;
  - P7 a P12 · AS-01 · os mesmos 6, na forma `git grep -c -a -e '<formato>' edcb28a -- '<o mesmo
    arquivo>'` · saída vazia · `[código de saída: 1]` nos 6;
  - P13 a P16 · AS-01 · `git diff edcb28a -- '<arquivo>'` de `proposal.md` (175 linhas), `design.md`
    (164), `tasks.md` (179) e `specs/fundacao-e-ci/spec.md` (42) · `[código de saída: 0]` nos 4 ·
    linhas removidas com formato de chave ou `MASCARADO`: 0 em cada. A saída é o próprio diff da
    change, entregue inteira ao guardião, e se reproduz pelo mesmo comando.
- **Fora da lista fechada, pelo líder técnico** (registro do critério do A3 do levantamento,
  `git ls-remote --tags https://github.com/actions/<nome> refs/tags/<tag>`, 22/11/2026):

```
11d5960a326750d5838078e36cf38b85af677262	refs/tags/v4.4.0     (actions/checkout · [código: 0])
49933ea5288caeca8642d1e84afbd3f7d6820020	refs/tags/v4.4.0     (actions/setup-node · [código: 0])
ea165f8d65b6e75b540449e92b4886f43607fa02	refs/tags/v4.6.2     (actions/upload-artifact · [código: 0])
```

- **Não verificado:** a configuração do GitHub (o ambiente, a regra só `main`, 2 segredos no
  ambiente, 0 no repositório e 0 na organização) e a primeira execução do job com segredo, que só
  existem depois do merge (Q5 (b)).
- **Riscos aceitos pelo Gabriel:** o resíduo do A1, pela Q8 (b) abaixo · AS-09 · média · o
  `Build` do job com segredo roda código de dependência antes do passo que recebe a chave de
  serviço · aceite literal abaixo · motivo: o build da Vercel já roda com as variáveis de produção,
  então o job do CI não abre exposição nova, e a change seguinte já mexe no CI · prazo R1 ·
  `completar-ci-do-novo-fluxo` · 22/11/2026.

### Decisões do Gabriel no Portão 2, 22/11/2026

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel.

> Commit wip enviado.
>
> Decisões do Gabriel (registre literal no relatorio.md):
> Q8 (b): o resíduo A1 fica aceito por escrito, numa linha própria da §6, com prazo R1 e a correção na completar-ci-do-novo-fluxo. Motivo: o build da Vercel já roda com as variáveis de produção, então o job do CI não abre exposição nova; e a change seguinte já mexe no CI.
> Q9 (a): as ressalvas baixas e informativas vão declaradas para a completar-ci-do-novo-fluxo.
> Q7 (a): o Gabriel roda o demonstracao-q7.sh depois de o gestor ler o script. A saída vem na próxima mensagem.
>
> Ajuste nos passos do Gabriel no GitHub: no passo 1, o PAT do Supabase do ambiente é um token novo, gerado agora; depois do passo 4, o Gabriel revoga o antigo no Supabase. A chave de serviço mantém o valor. Atualize os passos e registre na §5.
>
> Faça a rodada de texto da Q8 e da Q9, com o revisor e o guardião só sobre esse diff, e espere a saída da Q7 para fechar o archive.

Commit wip, feito pelo Gabriel: `08ba82f` na `chore/ajustar-ci-ao-novo-fluxo`, igual ao remoto;
`git rev-list --all` com 111 linhas; conferência do ambiente com código 0. A rodada de texto parte
dele.

**As ressalvas que vão para a `completar-ci-do-novo-fluxo` (Q9 (a)),** além da correção do
resíduo A1 (Q8 (b)) e da prova do push (Q5 (b)):

- do guardião: A2 (`uses` em sequência em fluxo e ação local fora de `.github/actions/`), A3
  (chave em UTF-16), A4 (prova de tag leve), A5 (0 segredos de organização na confirmação, e o
  passo 5 do README), A6 (o caminho do archive na evidência do LB-08 e do LB-17);
- do revisor, rodada 3: 1 (nome do arquivo e UTF-16 fora da busca, como limite ou correção),
  2 (a mensagem da busca manda trocar a chave sempre), 3 e 4 (números velhos no relatório desta
  change, já declarados), 5 (o inventário de `process.env` da §5 com a busca e o `spawnSync` do
  teste), 6 (forma);
- do revisor, rodada 1: 8 (a referência à §2 da `EQUIPE-DE-AGENTES.md`, que é a §7.1).

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum.

Nesta change, os escopos nominais são os do `design.md`, D11.

- **Arquivos fora do escopo, por agente:** nenhum em nenhuma passagem. `especificador` (duas
  passagens): só `openspec/changes/ajustar-ci-ao-novo-fluxo/` · `dev-frontend`: só os arquivos do
  D11 · `qa-acessibilidade`: só a própria seção deste relatório, com o `git status` de 19 linhas
  igual antes e depois.
- **Depois de cada passagem:** `git diff --cached --name-only` vazio · `git rev-parse HEAD`
  `edcb28a` · `git rev-list --all` 110 linhas · `git ls-remote origin
  refs/heads/chore/ajustar-ci-ao-novo-fluxo` `edcb28a` · conferência do ambiente código 0 (depois
  do registro do `CLAUDE.md`: `diferentes: 1 (aceitos por decisão: 1)`).
- **Escrito pelo líder técnico:** os textos do D7 e do D8 (`CLAUDE.md`, `README.md`,
  `docs/SEGURANCA.md` §3, §5 e o LB-09 na §6, `docs/EQUIPE-DE-AGENTES.md` §2,
  `docs/PLANO-DE-DESENVOLVIMENTO.md` §7), o `ambiente-decidido.txt` (1 linha, `CLAUDE.md` sha256
  `e4c72144…3aab`, atualizado depois do achado 1 da rodada 1 e do achado 6 da rodada 2), a §6 do
  `SEGURANCA.md` (LB-02, LB-08 e LB-17), a D5 do `design.md` (índice, mensagem e saída, achados da
  passagem B e C), a troca dos três booleanos, os checkboxes e este relatório.
- **Desvio:** a frase final de `scripts/verificar-tipos-do-banco.mjs:50` dizia para pôr o token
  "no repositorio"; passou a dizer "no ambiente segredos-da-main" (proposta do `dev-frontend`). É uma
  linha de mensagem, fora das tarefas, declarada aqui e na entrega.
- **Ressalva aceita pelo líder técnico na 1.3:** a prova dos tipos sem segredo usou um perfil da CLI
  sem credencial, porque o login local mora no Gerenciador de Credenciais do Windows, que variável
  de ambiente não esconde. A prova numa máquina sem login é a primeira execução do push (Q5 (b)).

### Tarefa 4.2, refeita sobre o código final (depois da passagem C e da troca dos booleanos), 22/11/2026

| Comando | Código | Contadores |
| --- | --- | --- |
| `test -e .npmrc` · `npm config get registry` | 1 · 0 | não existe · `https://registry.npmjs.org/` |
| `npm run verificar` | 0 | ações `arquivos: 1 · referências: 5 · presas por commit: 5 · locais: 0 · fora da regra: 0` · tokens 130 arquivos · barreira 3 com 606 arquivos varridos, 103 entregues ao navegador |
| `npm test` | 0 | 21 arquivos, 391 testes · busca 36 casos · ações 13 casos |
| `openspec validate --all --strict` | 0 | `Totals: 13 passed, 0 failed (13 items)` |
| Dependências diretas | — | 22 (`dependencies` + `devDependencies`) |
| `git diff --exit-code --stat main -- package-lock.json .claude src` | 0 | nenhuma diferença |
| `node scripts/conferir-ambiente-local.mjs --change ajustar-ci-ao-novo-fluxo` | 0 | `arquivos comparados: 18 · iguais à main: 17 · diferentes: 1 (aceitos por decisão: 1)` · `CLAUDE.md` sha256 `e4c7214463710085bf381495de3312a7b4981f5adf7b0650155e52b9a6303aab` |
| `git status --porcelain --untracked-files=all` | 0 | 19 linhas, todas do D11 ou dos textos do líder técnico |

**RP-12 da busca, refeito pelo líder técnico sobre o código final** (o mesmo método da 2.2:
`lt-chave-falsa.txt` na raiz, `git check-ignore -v` com código 1, chave no formato do JWT gerada por
`node -e` com o prefixo partido em dois; `git status` igual antes e depois):

```text
=== passo 1
=== NADA ACHADO — busca de segredo ===
  commits: 1 · mensagens: 1 · arquivos: 26 (dos commits: 7 · da árvore: 19 · do índice: 0) · linhas: 5427 · formatos: 6 · achados: 0
código 0
=== passo 2
=== ACHADO — segredo no que vai ser enviado ===
  JWT do Supabase · árvore · lt-chave-falsa.txt:2 · [MASCARADO · 66 caracteres · lt-chave-falsa.txt:2]
  Não envie. Tire o valor do arquivo e, se ele já entrou num commit, troque a chave.
  commits: 1 · mensagens: 1 · arquivos: 27 (dos commits: 7 · da árvore: 20 · do índice: 0) · linhas: 5429 · formatos: 6 · achados: 1
código 1
=== passo 3
=== NADA ACHADO — busca de segredo ===
  commits: 1 · mensagens: 1 · arquivos: 26 (dos commits: 7 · da árvore: 19 · do índice: 0) · linhas: 5427 · formatos: 6 · achados: 0
código 0
```

Nesta máquina, a busca não foi vista falhando pelo leitor real numa chave dentro de um commit, numa
mensagem de commit nem no índice, porque cada um desses exige `git commit` ou `git add`. Esses três
caminhos ficam provados só pelo leitor falso dos testes, até a demonstração que vai ao Gabriel no
Portão 2 (Q7). As contagens da busca acima mudam com o próprio relatório, que é lido por ela.

**Tempo do CI antes** (proposta, critério 6): mediana das 3 execuções mais recentes de cada evento,
pela API pública de execuções do GitHub (`updated_at − run_started_at`), levantada pelo líder
técnico em 22/11/2026: pull_request 5,95 min (5,45 · 5,95 · 7,17); push 5,73 min (5,07 · 5,73 ·
7,22). O "depois" do PR vai na entrega do Portão 2; o do push, na `completar-ci-do-novo-fluxo`.
