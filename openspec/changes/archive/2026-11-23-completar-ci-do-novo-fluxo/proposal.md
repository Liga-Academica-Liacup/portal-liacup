# Proposta — completar o CI do novo fluxo

## Why

A `ajustar-ci-ao-novo-fluxo` tirou o segredo do PR, mas deixou três coisas abertas, todas com prazo
na R1 e apontadas para esta change:

- a saída do LB-02, que só podia acontecer depois do primeiro push;
- o resíduo A1: no job com segredo, o `Build` roda código de dependência antes do passo que recebe
  a chave de serviço;
- as ressalvas baixas e informativas dela e da `endurecer-agentes-e-git-local`.

Faltam também duas verificações que o plano pôs no CI desde a R0: o `openspec validate` e os prints
das páginas. Change sem tela.

## What Changes

1. **A saída do LB-02 (primeira tarefa, Q5 (b) da `ajustar-ci`).** As três condições da §6 estão
   cumpridas, e a evidência vai para o relatório (tarefa 1.1):
   - execução `45099474006`, do push do merge (`d7cc5c9`), verde nos dois jobs nas duas tentativas.
     A tentativa 2 rodou depois de apagados os segredos do repositório;
   - 2 implantações no ambiente `segredos-da-main`, e a regra do ambiente só com `main`, lida pela
     API pública;
   - a confirmação do Gabriel, 22/11/2026: "tudo verde, Repository secrets e Organization vazia,
     ci-portal-liacup antigo revogado".

   A confirmação não diz "2 segredos no ambiente". Quem decide como isso se fecha é o Gabriel
   (Q4). O LB-02 vai para "Saíram da lista".
2. **O resíduo A1.** O build sai de todo job com segredo e vai para um job sem segredo (Q2). Cada
   segredo fica no seu job (Q1). O job da chave não instala dependência nenhuma: baixa o código,
   prepara o Node, baixa o build como anexo e roda a barreira 3, que só lê arquivos. Isso exige uma
   ação nova, a de baixar anexo, presa por sha como as outras (LB-17). Pela configuração, nenhum
   código de dependência roda antes da chave, nem no mesmo job que ela. A linha do A1 sai da §6
   depois da auditoria do guardião. A leitura da condição de saída com o download é a Q5.
3. **O motivo do aceite da Q12 (b)** ganha a correção do I3 do guardião: além de quem tem escrita
   no repositório, o código de dependência também alcançava o passo. O aceite, o prazo (R2) e a
   condição não mudam.
4. **`openspec validate --all --strict` no CI** (Q3), como passo do `Verificacoes` e do
   `npm run verificar`.
5. **Os prints das páginas da lista única, em 390 e 1280 px,** como anexo de toda execução do
   `Verificacoes`. A saída diz o número de páginas, de larguras e de prints. O passo fica vermelho
   se uma página não responder.
6. **As ressalvas herdadas** são 42 itens, numa tabela no `relatorio.md`, cada um com destino:
   - 6 pedem código (3 deles dependem da Q6 e da Q7);
   - 14 são só texto e cabem nas tarefas 2.2, 6.1 e 6.2;
   - 2 fecham por evidência;
   - 3 esperam decisão (Q5, Q7 e Q8);
   - 15 fecham com motivo;
   - 2 são da R2, fora de escopo.

   O briefing previa 32. A diferença está explicada no relatório.
7. **Textos:** §3, §5 e §6 do `SEGURANCA.md`, com o cabeçalho na versão 3.2; README (seção do CI,
   passo 5, a versão do OpenSpec e a tabela de comandos); `EQUIPE-DE-AGENTES.md`; e a linha 6 da
   R1 no plano.

**Decisão registrada para o AS-17,** se esta proposta for aprovada: nada muda em `.claude/`, no
`CLAUDE.md` nem no `openspec/config.yaml`. A tarefa 5.3 faz a conferência do ambiente comparar
também os próprios dois arquivos. Por isso, o líder técnico registra o sha256 deles no
`ambiente-decidido.txt` da change, citando esta proposta.

## Critérios de aceite

1. O LB-02 e o A1 estão em "Saíram da lista", com data, change e evidência. O LB-02 cita as
   execuções e a resposta da Q4. O A1 cita o `ci.yml` conferido pelo guardião. A linha da Q12 (b)
   continua na §6, com o motivo corrigido e com o aceite, o prazo e a condição iguais aos de hoje.
2. **Lido no `ci.yml`,** em cada job que cita `secrets.`:
   - cada job cita um segredo só;
   - antes do primeiro passo com segredo, só aparecem as formas permitidas: baixar o código sem
     guardar a credencial, preparar o Node sem cache, instalar com `--ignore-scripts` ou baixar o
     anexo do build. Nenhum job com segredo tem `npm run build`;
   - no job da chave não há `npm ci`.

   A lista de passos de cada job vai para o relatório.
3. O `openspec validate` é visto vermelho com uma spec inválida plantada, nomeando o item, e volta
   ao verde com a contagem de itens (RP-12).
4. A rotina dos prints diz `páginas: 4 · larguras: 2 · prints: 8`, com 4 sendo o tamanho da lista
   única hoje. Ela é vista vermelha com uma página plantada que não existe, e volta ao verde (RP-12).
   Na execução do PR, o anexo dos prints aparece com 8 arquivos.
5. As verificações que mudam pelas ressalvas de código são vistas falhando e voltando, com contador
   (RP-12):
   - as ações presas, com a forma compacta e a ação local fora da pasta de sempre;
   - a busca de segredo, pela Q6;
   - a conferência do ambiente, com um arquivo dela alterado, pela Q7.

   `verificar:acoes` termina com `fora da regra: 0`.
6. **Tempo do CI**, em minutos, no relatório:
   - antes da `ajustar-ci`: mediana de 3 execuções, PR 5,95 e push 5,73;
   - depois dela: uma execução de cada evento, PR 7,72 (`45095701421`, +1,77) e push 6,78
     (`45099474006`, tentativa 2, +1,05);
   - depois desta change: o PR na entrega do Portão 2, e o push confirmado pelo Gabriel depois do
     merge.
7. `npm run verificar`, `npm test`, `npx playwright test` e `openspec validate --all --strict`
   terminam com código 0. Nenhuma tela muda:
   - `git diff --exit-code main -- src public tests/e2e playwright.config.ts` termina com 0;
   - a raiz não publicada fica idêntica, pixel a pixel, aos prints `raiz-nao-publicada-{390,1280}`
     arquivados da `pagina-sobre-e-equipe`.
8. A tabela das ressalvas no `relatorio.md` fecha com 42 linhas, nenhuma sem destino cumprido ou
   decidido.

**Conta de tarefas: 14, com uma de folga** (`tasks.md`). A Q7 (a) não muda a conta, porque cabe na
tarefa 5.3. Com a Q6 (b), a tarefa 5.2 encolhe para uma linha.

## Questões para o Portão 1

A spec delta e as tarefas seguem as recomendações. Se o Gabriel escolher outra opção, o
especificador ajusta antes do apply.

**Q1. Como os segredos se separam.**

- (a) Um job por segredo, os dois no ambiente `segredos-da-main`. · custo: nenhum passo do Gabriel.
  **Hipótese, não conferida:** o executor recebe no começo do job todo segredo que o job pode
  citar. Código com `sudo` no mesmo job lê a memória do processo do executor, o caminho do ataque à
  ação `tj-actions/changed-files` em 2025. Se for assim, a CLI do Supabase, no job dos tipos,
  alcançaria a chave mesmo sem o job citá-la.
- (b) Um job só, com a chave primeiro e os tipos depois. · custo: o download e o passo da chave
  ficam antes do token, fora da condição do A1. A CLI roda no mesmo job que teve a chave.
- (c) Um job e um ambiente por segredo. O `segredos-da-main` fica só com o token, e um ambiente
  novo, também só `main`, recebe a chave. · custo: o Gabriel cria o ambiente e põe a chave nele (o
  valor se lê de novo no painel do Supabase). Depois do push verde, apaga a chave do
  `segredos-da-main`. O README ganha uma linha no passo 5.
- Recomendo (c): a separação passa a valer pela configuração do GitHub, sem depender da hipótese.

**Q2. De onde vem o build que o job da chave lê.**

- (a) O `Build` do `Verificacoes`, enviado como anexo logo depois dele e antes do e2e, que compila
  de novo, só no push. · custo: o job da chave espera o `Verificacoes` inteiro, e estimo, sem ter
  medido, cerca de 1 min a mais no push. Com o `Verificacoes` vermelho na `main`, a barreira 3 não
  roda naquele push. E o build sai de um job que já rodou `npm ci` com scripts, o lint e os testes.
- (b) Um job de build próprio, sem segredo, só no push, com `npm ci --ignore-scripts`, o build e o
  envio do anexo, em paralelo com o `Verificacoes`. · custo: um job a mais no `ci.yml` (cerca de 20
  linhas) e cerca de 1,3 min de máquina por push. Esse número vem do job com segredo de hoje, que
  faz a mesma instalação e o build: 1,12 e 1,30 min. Estimo que a espera do push não mude.
- Recomendo (b): roda menos código antes do build, e a barreira 3 não depende do e2e.

**Q3. O OpenSpec no CI.**

- (a) `devDependency` exata, `@fission-ai/openspec@2.1.0`, no lockfile. · custo: as dependências
  diretas passam de 22 para 23 (RP-01). O motivo: validar no portão as specs que são o contrato de
  toda change.
  - As dependências transitivas e os scripts de instalação não estão medidos. O apply confere, e se
    aparecer script de instalação novo, para e volta ao Gabriel (AS-08).
  - O README deixa de dizer que o CLI "não entra no `package.json`". O global continua para os
    `/opsx:*`, na mesma versão, e passam a ser duas instalações para manter iguais.
- (b) `npx` com a versão presa, sem lockfile, só no CI. · custo: as dependências do CLI se resolvem
  em cada execução, sem a integridade do lockfile, num job que roda em todo PR. O `verificar` local
  não valida.
- Recomendo (a).

**Q4. A confirmação dos 2 segredos no ambiente.** A frase do Gabriel não diz "2 no ambiente". A
regra só `main` está confirmada pela API. A contagem de segredos não se lê sem autenticação (401).

- (a) A tentativa 2, verde depois de apagados os do repositório, vale como prova, registrada como
  dedução: o job só fica verde tendo recebido os dois. · custo: nenhum. Mas a §6 pede a confirmação
  por escrito, e a dedução não é ela.
- (b) O Gabriel confirma numa linha, na resposta deste portão: "2 segredos no ambiente
  segredos-da-main, regra só main". · custo: uma linha.
- Recomendo (b): é o que a condição de saída escrita pede.

**Q5. A leitura da condição de saída do A1** (informativo C do guardião). A letra diz: antes de
cada `secrets.`, só checkout, setup-node e `npm ci --ignore-scripts`. Ela não diz se o download de
anexo vale.

- (a) A condição se lê como no requisito novo da spec: download de anexo por ação presa e setup-node
  sem cache são permitidos, e nenhum passo anterior roda código de dependência nem do build. O
  guardião confere por essa leitura, e o `design.md` (D2) diz o que cada passo permitido escreve no
  ambiente dos seguintes. · custo: nenhum.
- (b) A letra fica. · custo: não há como a barreira 3 ler o build sem baixá-lo. O A1 continua na §6
  e vence na `lancamento-r1`.
- Recomendo (a).

**Q6. A busca de segredo e o UTF-16** (A3 da `ajustar-ci`, e o 1 da rodada 3 do revisor).

- (a) Corrigir aqui: texto em UTF-16, com e sem marca de ordem de bytes, e o nome do arquivo
  passam a ser examinados. · custo: a tarefa 5.2, com casos novos.
- (b) Só declarar os dois limites na §5, com esta decisão. · custo: uma chave gravada em UTF-16
  por um programa do Windows (o `>` do PowerShell 5.1) passa muda.
- Nas duas, a mensagem passa a mandar trocar a chave sempre (o 2 da rodada 3).
- Recomendo (a).

**Q7. A conferência do ambiente** (A2 e A3 do guardião da `endurecer`).

- (a) Os dois aqui, na tarefa 5.3. A conferência compara os próprios arquivos com a `main`. E o
  `.agents/` entra no AS-17 e na conferência, comparado pelo conteúdo com o `.claude/skills/`, de
  que é cópia (`.gitignore:44-48`). · custo: regra nova, sem medida de quantos arquivos diferem
  hoje.
- (b) O A3 aqui. O A2 vai para a `lancamento-r1`, cuja auditoria de base lê o AS-17 inteiro, e lá
  se escolhe entre versionar, apagar ou comparar o `.agents/`. · custo: o `.agents/` fica fora da
  conferência até lá.
- (c) Os dois numa change própria, logo depois desta. · custo: uma change a mais na R1.
- Recomendo (b): nesta change, o `dev-frontend` escreve em `scripts/`, e é a conferência que segura
  cada passagem. O A2 pede uma escolha que não é de CI.

**Q8. O AS-01 do `relatorio.md` quando o diff mexe no `.gitignore`** (A6 da `endurecer`).

- (a) A §5 passa a dizer como se conclui nesse caso. O líder técnico confere por
  `git check-ignore -v`, que vale para qualquer caminho, que o `relatorio.md` não é ignorado. Então
  roda a busca de segredo antes do envio e põe o código e os contadores no relatório. · custo: um
  parágrafo na §5.
- (b) Fica como hoje: o item fica não verificado e vai ao Gabriel no portão, em toda change que
  mexer no `.gitignore`. · custo: a decisão se repete.
- Recomendo (a). Esta change não mexe no `.gitignore`: os prints vão para uma pasta que ele já
  ignora (`design.md`, D5).

**Q9. Onde fica a prova do push desta change.** O briefing pede que o Gabriel confirme o push verde
depois do merge, quando a change já está arquivada.

- (a) Na primeira tarefa da change seguinte, a `pagina-projetos`, como a Q5 (b) da `ajustar-ci`
  fez com esta. Se o push ficar vermelho, a correção é imediata. · custo: a prova fica numa change
  seguinte.
- (b) Num PR só do relatório arquivado, logo depois do push. · custo: um PR e um ciclo de CI a
  mais, e o arquivo arquivado mudando depois do archive.
- Recomendo (a).

## Fora de escopo

- **Banco (R2):** o LB-09, o M1 e o B1, na `papeis-da-diretoria-no-banco`.
- **Telas**, e qualquer arquivo de `src/`, `public/` ou `tests/e2e/`.
- **Cabeçalhos de segurança** (LB-07), na `lancamento-r1`.
- O `.claude/`, o `CLAUDE.md` e o `openspec/config.yaml`.
- Trocar a major das ações (LB-35, na `lancamento-r1`).
- Pôr no CI a comparação dos prints com o protótipo. Esta change só anexa os prints. A comparação
  continua com o `guardiao-visual`.
- Provar a dependência já no lockfile (AS-08). O job dos tipos ainda roda a CLI do Supabase com o
  token, por desenho.

## Capabilities

### New Capabilities

Nenhuma. Tudo fica na `fundacao-e-ci` e na `equipe-de-agentes`, que estão na lista do gatilho.

### Modified Capabilities

- `fundacao-e-ci`:
  - MODIFIED: "O CI é o portão, e não avisa sem barrar" (jobs com segredo, no plural); "Toda ação
    externa do CI é presa por versão imutável" (forma compacta e ação local); "A busca de segredo
    cobre tudo o que o envio publica" (UTF-16 e nome, Q6); "A busca de segredo diz o que achou sem
    mostrar o valor" (trocar a chave sempre).
  - ADDED: nenhum código de dependência antes do segredo; um segredo por job e por ambiente; as
    specs validadas no CI; os prints como anexo.
- `equipe-de-agentes`, MODIFIED: "O ambiente local dos agentes é conferido antes de cada passagem"
  (os próprios arquivos, Q7) e "A conferência do guardião é proporcional ao risco" (o A4 da
  `endurecer`).

## Requisitos permanentes

| RP | Aplica? | Em uma linha |
| --- | --- | --- |
| RP-01 | Sim | Q3 (a): 22 → 23 diretas, com o motivo acima; uma ação nova no CI, a de baixar anexo, presa por sha |
| RP-02, RP-03 | Sim | `verificar:tokens` com 0, e `tokens.css` intocado |
| RP-04 a RP-09 | Não | Nenhuma tela muda. O e2e e o Lighthouse rodam como hoje, e a raiz é comparada pixel a pixel |
| RP-10 | Sim | É o assunto do A1. Os anexos saem de jobs sem segredo, e o repositório é público |
| RP-11 | Não | Nenhuma tabela |
| RP-12 | Sim | Vistos falhando e voltando, com contador: `openspec validate`, prints, ações presas, busca (Q6) e conferência (Q7) |
| RP-13 | Sim | Os prints são gerados e não entram no Git: vão para pasta já ignorada, e `verificar:artefatos` fica com 0 |
| RP-14 | Não | Nenhuma tela |

## Impact

| O que | Efeito | Quem escreve |
| --- | --- | --- |
| `.github/workflows/ci.yml` | Jobs do push redesenhados (Q1, Q2), ação de baixar anexo, passos do `openspec validate` e dos prints | `dev-frontend` |
| `package.json`, `package-lock.json` | `devDependency` do OpenSpec (Q3) e scripts novos | `dev-frontend` |
| `scripts/` e `tests/barreiras/` | Rotina dos prints; ações presas (A2); busca (Q6); conferência (Q7), com os testes | `dev-frontend` |
| `docs/SEGURANCA.md` §3, §5, §6 e cabeçalho, `README.md`, `docs/EQUIPE-DE-AGENTES.md`, `docs/PLANO-DE-DESENVOLVIMENTO.md` §7 | Os textos | líder técnico |
| Configuração do GitHub | Q1 (c): o ambiente novo da chave, e a chave apagada do `segredos-da-main` depois do push verde | Gabriel |
| `src/`, `public/`, `tests/e2e/`, `.claude/`, `CLAUDE.md`, produção | Nada muda | — |
