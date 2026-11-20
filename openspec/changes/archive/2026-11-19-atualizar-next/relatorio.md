# Relatório — atualizar-next

Copiado de `openspec/changes/MODELO-relatorio.md`. Cada agente escreve a própria seção; a do agente
que não entrou recebe uma linha dizendo por quê. Número quando houver número. Incompleto declarado
incompleto.

## especificador

- **Artefatos:** `openspec/changes/atualizar-next/` `proposal.md`, `design.md` (D1 a D6),
  `tasks.md`, sem `specs/` (`skip_specs: true`) · 0 requisitos · 12 tarefas
- **Questões em aberto:** Q1 (o crítico do `proxy-addr` entra?) e Q2 (quem executa a troca)
- **Incompleto:** não rodei `openspec instructions`, `openspec validate --strict` nem
  `openspec status`, porque este agente não roda comando e não tem ferramenta de terminal nesta
  passagem. Segui a forma dos artefatos arquivados da `interruptor-em-construcao`. A validação é do
  líder técnico
- **Rodada 2 (Portão 1, 19/11/2026):** aplicadas Q1 = a, Q2 = a e as emendas do `sharp` e da
  evidência. `proposal.md`: "Decisões pendentes" virou "Decisões do Portão 1"; o `proxy-addr` deixou
  de ser condicional; os critérios ganharam `sharp` 0.35.5 ou acima, `proxy-addr` 2.0.8, o
  `npm ls` antes e depois e o resumo do diff do lock. `tasks.md`: escopos fixos; a 1.2 guarda a
  cópia do lock e o `npm ls` dos quatro; a 2.1 para e volta ao Gabriel se o `sharp` não subir; a
  2.2 deixou de ser condicional; a 3.5 tem só a opção (a), o `npm ls` e o resumo do diff do lock.
  `design.md`: D3 e Open Questions. Continuam 12 tarefas; nenhuma questão nova. `validate` não
  rodado nesta rodada também

## dev-frontend

Tarefas 2.1, 2.2 e 3.1, em 19/11/2026. Node 22.22.2, npm 10.9.7. `<tmp>` = pasta `atualizar-next`
no scratchpad da sessão, fora do repositório.

- **Arquivos:** `package.json`, `package-lock.json` · **tokens novos:** nenhum · nenhuma linha de
  `src/`, `tests/`, `scripts/`, `.github/` ou configuração
- **2.1** `npm install next@16.4.6 eslint-config-next@16.4.6 --save-exact` código 0 ("added 2
  packages, changed 9 packages, and audited 746 packages") · `git diff --stat package.json` →
  `1 file changed, 2 insertions(+), 2 deletions(-)`, as linhas `"next": "16.3.1"` →
  `"next": "16.4.6"` e `"eslint-config-next": "16.3.1"` → `"eslint-config-next": "16.4.6"` ·
  `grep -c '"16.4.6"' package.json` → 2, sem `^` · `npm ls next eslint-config-next` código 0,
  `eslint-config-next@16.4.6` e `next@16.4.6` · `npm ls sharp` código 0, `next@16.4.6` →
  `sharp@0.35.5` (**critério de aceite atendido, sem forçar versão**) · dependências diretas:
  4 + 18 = 22
- **2.2** cópia em `<tmp>/lock-pos-next.json`; `npm update proxy-addr` código 0 ·
  `npm ls proxy-addr` código 0, `@lhci/cli@0.15.1` → `express@4.22.2` → `proxy-addr@2.0.8` ·
  `diff` com a cópia: só a entrada `node_modules/proxy-addr` (conferido com `node -e` comparando
  todas as entradas de `packages`: 1 entrada diferente). Diff literal:

```
9148,9150c9148,9150
<       "version": "2.0.7",
<       "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
<       "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
---
>       "version": "2.0.8",
>       "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.8.tgz",
>       "integrity": "sha512-5nnx0yGyVUcY6t9RnWcARWtwT9F1D8O9rt08htPvnd49W1IgZtmLkhu9WfMzQj1cFxjHIO6connUNVW5k7AVyQ==",
9158a9159,9162
>       },
>       "funding": {
>         "type": "opencollective",
>         "url": "https://opencollective.com/express"
```

  Além de version, resolved e integrity, a entrada ganhou o campo `funding`, que vem do próprio
  `proxy-addr@2.0.8`. Nenhum outro pacote mudou · `git diff --stat package.json` igual ao da 2.1
- **3.1 `npm run verificar`** código 0: artefatos 289 arquivos rastreados, 11 padrões, 1
  versionado por decisão, 0 indevidos · tipos `✓ Types generated successfully` e `tsc --noEmit`
  sem erro · lint `eslint .` sem nenhum aviso nem erro com o `eslint-config-next@16.4.6` ·
  formatação `All matched files use Prettier code style!` · tokens 61 arquivos varridos, 1 de
  token, nenhuma cor ou medida à mão · chave 178 arquivos varridos, 40 entregues ao navegador, 0
  ocorrências do valor, 0 do nome
- **3.1 `npm test`** código 0 · 10 arquivos, 80 de 80 testes, igual à linha de base da 1.2
- **`playwright`:** não rodado por mim; é a tarefa 3.2, fora das minhas tarefas
- **Melhorias de UI ou UX propostas:** nenhuma
- **Incompleto:** o `verificar:chave` varreu o `.next/` que existia, que é a build do
  `next@16.3.1` feita pelo guardião na 1.3 (`BUILD_ID` de 20:37:08, antes do install de 20:39). A
  chave na build do 16.4.6 fica conferida só quando a 3.3 ou a 3.4 compilarem de novo e o
  `verificar:chave` rodar sobre essa build

## dev-dados

Não entrou: a change não toca no banco (só entra a partir da R2).

## guardiao-visual

### Rodada 1, antes (tarefa 1.3, 19/11/2026)

- **Build:** `npm run build` código 0 · cabeçalho `▲ Next.js 16.3.1 (Turbopack)` ·
  `- Environments: .env` · sem `.env.local`; `SITE_PUBLICADO` ausente do `.env` (0 ocorrências) e
  do ambiente (`env | grep SITE_PUBLICADO` vazio, código 1)
- **Servidor:** `npx next start -p 3000`, sem `SITE_PUBLICADO`; raiz com status 200, a página
  "Portal em construção"; logo `/_next/image?url=%2Flogo-liacup-256.png&w=256&q=75` carregada em
  256 × 256. Derrubado depois: nenhum `LISTENING` na 3000, `curl` código 7
- **Prints:** página inteira, `deviceScaleFactor` 1, viewport de altura 844, espera `networkidle`,
  logo `complete && naturalWidth > 0` e `document.fonts.ready`

| Arquivo em `prints/` | Bytes 16 a 23 | Largura × altura | `sha256sum` |
| --- | --- | --- | --- |
| `antes-raiz-390.png` | `0000 0186 0000 034c` | 390 × 844 | `063180ace458cf9e5cdccd86667bf848b759d2d44c2174f29157ac8eefec09e4` |
| `antes-raiz-1280.png` | `0000 0500 0000 034c` | 1280 × 844 | `d826caf89849654b79033aaf51f256f0e25b7574afd15d197a0fd83951eceef8` |

- **Comparador visto falhando (RP-12):** RGBA pixel a pixel com o `sharp` do projeto. Script e
  comparador fora do repositório, no scratchpad da sessão (`script-prints/prints.js <antes|depois>`
  e `script-prints/comparar.js <a> <b>`); cópia de teste também no scratchpad
  - `antes-raiz-390.png` consigo mesmo: `pixels totais: 329160` · `pixels diferentes: 0` · código 0
  - contra cópia com 10 pixels invertidos: `pixels totais: 329160` · `pixels diferentes: 10` ·
    código 1
  - 390 contra 1280: `dimensoes diferentes: 390x844x4 vs 1280x844x4` · código 1
- **Comparado:** nada ainda. Esta rodada só produz a linha de base; a comparação antes e depois é a
  tarefa 3.4. Não houve comparação com o protótipo: fora do escopo desta change (D4)
- **Diferenças:** não se aplica nesta rodada
- **Não comparado:** "depois", porque o next 16.4.6 ainda não foi instalado

### Rodada 2, depois (tarefa 3.4, 19/11/2026)

- **Build:** `npm run build` código 0 · cabeçalho `▲ Next.js 16.4.6 (Turbopack)` ·
  `- Environments: .env` · sem `.env.local`; `SITE_PUBLICADO` ausente do `.env` (0) e do ambiente
  (`env | grep` código 1) · instalados `next` 16.4.6 e `sharp` 0.35.5 (`npm ls sharp`)
- **Servidor:** `npx next start -p 3000` (`▲ Next.js 16.4.6`), raiz com status 200, logo
  `/_next/image?url=%2Flogo-liacup-256.png&w=256&q=75` em 256 × 256. Derrubado: nenhum
  `LISTENING` na 3000, `curl` código 7
- **Prints:** o mesmo `prints.js`, agora com `depois`; mesmo procedimento da rodada 1

| Largura | Bytes 16 a 23 antes / depois | `sha256sum` antes = depois | `cmp` | `comparar.js` |
| --- | --- | --- | --- | --- |
| 390 | `0000 0186 0000 034c` / igual (390 × 844) | `063180ace458cf9e5cdccd86667bf848b759d2d44c2174f29157ac8eefec09e4` | código 0, idênticos | `pixels totais: 329160` · `pixels diferentes: 0` · código 0 |
| 1280 | `0000 0500 0000 034c` / igual (1280 × 844) | `d826caf89849654b79033aaf51f256f0e25b7574afd15d197a0fd83951eceef8` | código 0, idênticos | `pixels totais: 1080320` · `pixels diferentes: 0` · código 0 |

- **Comparador visto falhando, com o `sharp` 0.35.5:** `antes-raiz-1280.png` contra uma cópia do
  `depois-raiz-1280.png` com 10 pixels invertidos (cópia no scratchpad): `pixels totais: 1080320`
  · `pixels diferentes: 10` · código 1
- **Comparado:** 1 página (raiz, "Portal em construção") × 390 e 1280, antes e depois da troca
- **Diferenças:** 0. Lado a lado não gerado, porque nenhuma largura teve pixel diferente
- **Não comparado:** as outras larguras e a raiz com `SITE_PUBLICADO`, porque estão fora do D4

## qa-acessibilidade

Tarefas 3.2 e 3.3, em 19/11/2026, com `next@16.4.6`. Nenhum teste escrito nem alterado. Logs
completos em `<tmp>/e2e-3.2.log`, `<tmp>/build-3.3.log` e `<tmp>/lhci-3.3.log`.

- **Antes de rodar:** `netstat -ano | grep -E ':300[01] .*LISTEN'` vazio (código 1) ·
  `env | grep SITE_PUBLICADO` vazio · sem `.env.local` · `.env` com 0 ocorrências de
  `SITE_PUBLICADO`. Depois de cada tarefa, portas livres de novo (mesmo `grep`, código 1)
- **3.2 `npm run test:e2e`** código 0 (do npm, com `pipefail`) · **147 passed** · 0 failed ·
  0 skipped · 0 flaky (147 linhas de teste no log, todas `ok`; igual ao total da 1.2) ·
  `grep -c "Creating an optimized production build"` → 1 · cabeçalho
  `▲ Next.js 16.4.6 (Turbopack)`, `- Environments: .env`; os dois `next start` (3000 e 3001)
  com `▲ Next.js 16.4.6`
- **Cobertura:** raiz publicada (3000), raiz não publicada (3001), `/vitrine`, e `/sobre`,
  `/em-construcao` e endereço inexistente pelas respostas do interruptor × 7 larguras (360, 390,
  430, 480, 768, 1024, 1280)
- **Medições (3.2), por largura, iguais nas 7:**
  - interruptor: `rotas verificadas: 3 · modo nao publicado` 7 de 7 e
    `rotas verificadas: 3 · modo publicado` 7 de 7 · `arquivos conferidos: 3` · `respostas
    conferidas: 4`
  - axe: raiz não publicada 0 violações, 20 regras aplicadas · raiz publicada 0 · vitrine 0 ·
    21 medições, 0 com violação
  - rolagem horizontal: raiz não publicada `scrollWidth` = `clientWidth` nas 7 (360 a 1280) · raiz
    publicada e vitrine passaram nas 7, sem contador impresso · 0 larguras com defeito
  - alvos de toque (vitrine): 24 medidos / 0 abaixo de 44 px, em cada uma das 7
  - foco (vitrine): 18 elementos com foco verificado / 0 sem foco visível, em cada uma das 7
  - também: 0 requisições a domínio externo, 8 seções na vitrine, 0 links para `/vitrine`,
    `noindex, nofollow`, em cada uma das 7
- **3.3 `npm run build`** código 0 (`▲ Next.js 16.4.6 (Turbopack)`, `- Environments: .env`) ·
  **`npm run test:desempenho`** código 0 · `Checking assertions against 1 URL(s), 3 total run(s)` ·
  `assertion-results.json` = `[]`. Lighthouse 12.6.1, preset desktop, 1 URL
  (`http://localhost:3000/`, que sem `SITE_PUBLICADO` é a página "Portal em construção"), 3
  execuções. Cada execução, lida de `categories.*.score*100` nos 3 `lhr-*.json` desta execução
  (20:45:33, 20:45:47, 20:45:59; os de 10:53 foram substituídos):

| Execução | Desempenho (≥ 90) | Acessibilidade (≥ 95) |
| --- | --- | --- |
| 1 | 100 | 100 |
| 2 (representativa no `manifest.json`) | 100 | 100 |
| 3 | 100 | 100 |

- `.lighthouseci/` ignorado pelo git (`.gitignore:18`), 0 linhas dele no `git status`
- **Verificação nova demonstrada falhando:** nenhuma verificação nova
- **Defeitos:** nenhum · **sem cobertura:** Lighthouse só na raiz não publicada, em desktop (é o
  que o `lighthouserc.json` mede); raiz publicada e `/vitrine` sem Lighthouse. Fonte de 16 px em
  campo de formulário e diálogo (foco preso, Esc, devolução do foco) não medidos: não há
  formulário nem diálogo nas páginas cobertas. Teclado medido só na vitrine (foco visível); na raiz
  não medido

## revisor

Transcrito pelo líder técnico, porque o revisor não tem ferramenta de escrita.

### Rodada 1 (19/11/2026)

- **Veredito:** aprovado com ressalva
- **Conferiu:** 11 arquivos · 6 critérios de aceite · 9 regras (princípios 1 e 10; RP-01, RP-12,
  RP-13; Q1 = a, Q2 = a, emenda do `sharp`, emenda de evidência)
- **Achados:**
  - `relatorio.md` (3.5) · "17 `@img/sharp-*`", mas o lock tem 16, e com 17 a soma daria 43 e
    não 42 · RP-12, princípio 10 → **corrigido** para 16, com a soma escrita
  - `relatorio.md` (2.1 contra 3.5) · o "added 2 packages" não estava explicado ao lado do "0
    entraram" · princípio 10 → **explicado** na seção 3.5, com os 2 declarados não identificados
  - `relatorio.md` (conferência de escopo) · os escopos eram os do modelo e não registravam a
    Q2 = a → **corrigido**
  - `proposal.md` (Impact) · a lista do lock não cita `eslint-config-next` e `fastq`, que o
    relatório declara. Sem violação → **não alterado**: a proposta está aprovada, e a diferença
    fica declarada na entrega do Portão 2
  - Pendentes da 4.2: a frase sobre o guardião-appsec, a linha de fora do escopo e os 4 PNG →
    **feitos** na 4.2
- **Não conseguiu conferir:** sem terminal, não provou o `package.json` contra a `main`, a
  contagem completa do lock nem a intocabilidade de `src/`, `tests/`, `scripts/`, `.github/` e
  `lighthouserc.json`. Não rodou `npm ls`, `npm audit`, testes, prints nem hashes

### Rodada 2 (19/11/2026)

- **Veredito:** aprovado
- **Conferiu:** 3 arquivos (`relatorio.md`, `package-lock.json`, `tasks.md`) e a pasta da change
  · 5 achados da rodada 1 · 3 regras (RP-12, RP-13, princípio 10). Os 5 foram tratados como
  escrito, e o do `proposal.md` (Impact) basta declarar na entrega
- **Achados:** `tasks.md` com a 4.1 e a 4.2 ainda `[ ]` → **marcadas** antes do archive ·
  `relatorio.md` "835 entradas" sem dizer que exclui a raiz → **corrigido** para "835 sem a raiz
  (836 com ela)". Nenhum reprova
- **Não conseguiu conferir:** as execuções de `git diff`, `git status`, `verificar:artefatos` e
  `prettier --check` que o líder mediu (o revisor conferiu o texto, não as execuções), e os
  `sha256sum` das cópias dos PNG fora do repositório. As medições do líder: `git diff --stat
  03a81e9 -- src tests scripts .github lighthouserc.json next.config.* playwright.config.*` com 0
  linhas; `git diff 03a81e9 -- package.json` com 2 linhas trocadas (`next` e
  `eslint-config-next`)

## Líder técnico — linha de base (tarefas 1.1 e 1.2, 19/11/2026, antes de instalar)

`<tmp>` = pasta `atualizar-next` no scratchpad da sessão, fora do repositório.

- **1.1 Registro:** `npm view next dist-tags.latest` → `16.4.6` ·
  `npm view eslint-config-next@16.4.6 version` → `16.4.6` ·
  `npm view next@16.4.6 optionalDependencies.sharp` → `^0.35.5`. As três como esperado
- **1.2 Audit:** `npm audit` código 1 · crítico 2, alto 21, moderado 12, baixo 2, info 0 (37) ·
  `npm audit --audit-level=critical` código 1 · cópia do lock em `<tmp>/lock-antes.json`
- **1.2 `npm ls next sharp eslint-config-next proxy-addr`** (código 0):

```
+-- @lhci/cli@0.15.1
| `-- express@4.22.2
|   `-- proxy-addr@2.0.7
+-- eslint-config-next@16.3.1
`-- next@16.3.1
  `-- sharp@0.35.3
```

- **1.2 Testes:** `npx vitest run` código 0 · 10 arquivos, 80 de 80 testes ·
  `npx playwright test --list` → `Total: 147 tests in 3 files`

## Líder técnico — números de depois (tarefa 3.5) e reconferência da 3.1

- **`npm run verificar` de novo sobre a build do 16.4.6** (`.next/BUILD_ID` 20:44, cabeçalho
  `▲ Next.js 16.4.6`): código 0 · artefatos 289 examinados, 0 indevidos · tokens 61 arquivos, 0
  escritos à mão · chave 196 arquivos varridos, 45 entregues ao navegador, 0 do valor, 0 do nome.
  Fecha o incompleto do dev-frontend, cujo `verificar:chave` leu a build do 16.3.1
- **Audit por severidade:**

| Severidade | Antes | Depois |
| ---------- | ----- | ------ |
| Crítico    | 2     | 0      |
| Alto       | 21    | 20     |
| Moderado   | 12    | 12     |
| Baixo      | 2     | 2      |
| Info       | 0     | 0      |
| Total      | 37    | 34     |

- `npm audit --audit-level=critical`: código 1 antes, **código 0 depois**. Saíram do audit
  `next`, `sharp` e `proxy-addr`; nenhum pacote entrou. Os 34 restantes são da
  `auditoria-de-base-appsec`
- **`npm ls next sharp eslint-config-next proxy-addr` depois** (código 0):

```
+-- @lhci/cli@0.15.1
| `-- express@4.22.2
|   `-- proxy-addr@2.0.8
+-- eslint-config-next@16.4.6
`-- next@16.4.6
  `-- sharp@0.35.5
```

- **Diff do `package-lock.json`** (entradas `packages` de `<tmp>/lock-antes.json` contra o lock
  atual): **42 mudaram de versão, 0 entraram, 0 saíram.** Todos pertencem às árvores de `next`,
  `sharp`, `eslint-config-next` ou `proxy-addr`:
  - `next` 16.3.1 → 16.4.6 e `eslint-config-next` 16.3.1 → 16.4.6
  - 10 `@next/*` 16.3.1 → 16.4.6: `env`, `eslint-plugin-next` e 8 `swc-*` de plataforma
  - `sharp` 0.35.3 → 0.35.5, 16 `@img/sharp-*` de plataforma 0.35.3 → 0.35.5, 10
    `@img/sharp-libvips-*` 1.3.2 → 1.3.4, e `sharp/node_modules/semver` 7.8.5 → 7.8.6
  - `fastq` 1.20.1 → 1.20.3, cujo único caminho é `eslint-config-next` → `@next/eslint-plugin-next`
    → `fast-glob` → `@nodelib/fs.walk`: o npm o resolveu de novo ao instalar o
    `eslint-config-next`
  - `proxy-addr` 2.0.7 → 2.0.8 (Q1 = a; a 2.2 provou que essa foi a única entrada que mudou)
  - Soma: 2 + 10 + 1 + 16 + 10 + 1 + 1 + 1 = 42 (contagem corrigida depois do revisor: a
    primeira versão dizia 17 `@img/sharp-*`, que somaria 43)
- **"added 2 packages" da 2.1 contra "0 entraram" no lock:** são contagens diferentes. O lock tem
  835 entradas de `packages` sem a raiz `""` (836 com ela) antes e depois, e nenhum nome entrou nem saiu. O "added" do npm conta
  pacotes gravados em `node_modules/`, e 745 das 835 entradas estão em disco nesta máquina (as
  outras 90 são binários opcionais de outras plataformas). **Não identifiquei quais foram os 2**:
  o `node_modules/` de antes não foi guardado, então não há como comparar

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos desta change (Q2 = a): `especificador`
`openspec/changes/atualizar-next/` · `dev-frontend` `package.json`, `package-lock.json` e a própria
seção do relatório · `guardiao-visual` `openspec/changes/atualizar-next/prints/` e a própria seção ·
`qa-acessibilidade` só a própria seção (nenhum teste escrito) · `revisor` nenhum · `dev-dados` não
entrou. `node_modules/`, `.next/` e `.lighthouseci/` mudam por consequência e são ignorados pelo
git.

- **`git status` depois de cada passagem:** especificador, só arquivos da change · guardião
  (1.3), mais os 2 PNG de antes · dev-frontend, mais `package.json` e `package-lock.json` · qa,
  nenhum arquivo novo · guardião (3.4), mais os 2 PNG de depois · revisor, nenhuma mudança
- **Arquivos fora do escopo, por agente:** nenhum em nenhuma passagem

## Líder técnico — fechamento (tarefa 4.2)

- **Incompleto, com essas palavras:** o guardião-appsec não auditou esta branch, porque o arquivo
  dele só existe na branch `chore/montar-guardiao-appsec`. Ele audita esta troca quando a `main`
  entrar na branch da change 6
- **Prints:** os 4 PNG de `prints/` foram apagados do repositório antes do `openspec archive`
  (RP-13). Cópias, com os mesmos `sha256sum`, ficaram fora do repositório para o Gabriel ver
