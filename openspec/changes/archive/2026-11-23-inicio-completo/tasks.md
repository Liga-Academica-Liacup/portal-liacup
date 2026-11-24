# Tarefas — página inicial completa da R1

14 tarefas, uma de folga. Comandos em sintaxe de bash (Git Bash). Escopos nominais no `design.md`,
D8. As tarefas seguem as decisões do Gabriel no Portão 1, 23/11/2026 (Q1 a Q8, todas (a), literais
no `relatorio.md`), a Q9 (a), decidida no mesmo dia com o acréscimo do anel de foco, e a
Q10 (a), decidida no mesmo dia (quatro arquivos de `ui/` no diff).

**Antes do apply, fora da conta:** o líder técnico roda
`npx openspec validate inicio-completo --strict` (o especificador não tem terminal).

## 1. Documentos

- [x] 1.1 **Líder técnico, depois do Portão 1:** na `REFERENCIA-VISUAL.md` §7, linha "Inicial,
      Contato e rodapé, links do Instagram e do e-mail", apagar só a frase de 20/11 e o espaço antes
      dela. A linha fica como o "Depois" da proposta, item 1. Verificar:
      - `grep -c 'poder copiar' docs/REFERENCIA-VISUAL.md` dá 0;
      - `grep -c -F` com o texto literal da Q9 (b), da proposta, dá 1;
      - `git diff --word-diff main -- docs/REFERENCIA-VISUAL.md` mostra um trecho removido, a frase de
        20/11, e nenhum acrescentado;
      - `npx playwright test tests/e2e/contato.spec.ts` com código 0.
- [x] 1.2 **Líder técnico, depois do Portão 1, com as decisões escritas do Gabriel:** na §7, as
      linhas novas da inicial, cada rótulo entre aspas, para o e2e ler:
      - "Inicial, números" (Q1 (a));
      - "Inicial, faixa do processo seletivo" (Q2 (a), Q3 (a) e Q7 (a)), **nomeando os pares do
        `design.md`, D4**, cada um com as duas cores e a superfície: o cartão `--color-accent-600`
        `#82558f` como adaptação de acessibilidade do lilás `#9B6AAF`; título, aviso e link em
        `--color-bg` sobre o cartão, 4,84:1; o selo, texto `--color-accent-800` sobre `--color-bg`,
        9,05:1; o botão, fora da variante primária, com o texto e a borda contra o cartão em
        repouso, hover e pressionado (pior caso 3,61:1 na borda); o anel de foco `--color-bg`
        contra o cartão, 4,84:1; o link em hover e pressionado com os fundos que escurecem, 5,23:1 e
        5,67:1; e que o círculo decorativo escurece o cartão, e o pior ponto é o cartão sem ele.
        Os números entram como os calculados no D4; se o dev medir outro na tarefa 2.2, o líder
        técnico troca o número na linha antes da tarefa 4.1, e a troca vai ao relatório;
      - "Inicial, bloco de contato" (Q4 (a), Q5 (a) e Q6 (a), com a condição de `/contato` não
        mudar).

      O `conteudo-institucional.md` não muda. Verificar: `grep -c '^| Inicial, '
      docs/REFERENCIA-VISUAL.md` dá 7 (as 4 de hoje, contadas à mão pelo especificador, mais as 3
      novas); `grep -c -F '#82558f' docs/REFERENCIA-VISUAL.md` maior que antes da tarefa;
      `git diff --numstat main -- docs/REFERENCIA-VISUAL.md docs/conteudo-institucional.md` com 1
      linha removida no total, a da tarefa 1.1, e nenhuma linha no `conteudo-institucional.md`; as
      decisões literais do Gabriel no `relatorio.md`.
- [x] 1.3 **Líder técnico, depois do Portão 1 (Q8 (a)):** na linha 9 da tabela da R1 do
      `docs/PLANO-DE-DESENVOLVIMENTO.md`, trocar "Números, chamadas para as páginas que existem,
      bloco de contato e faixa do processo seletivo" por "Números, faixa do processo seletivo e
      bloco de contato; as chamadas para as outras páginas são os botões do hero e da faixa
      (Gabriel, 23/11/2026, Q8 (a) da inicio-completo)". Nada mais muda no plano. Verificar:
      - `git diff --numstat main -- docs/PLANO-DE-DESENVOLVIMENTO.md` dá `1	1` (uma linha trocada);
      - `grep -c -F 'Números, faixa do processo seletivo e bloco de contato; as chamadas para as
        outras páginas são os botões do hero e da faixa (Gabriel, 23/11/2026, Q8 (a) da
        inicio-completo)' docs/PLANO-DE-DESENVOLVIMENTO.md` dá 1 (o texto numa linha só, no
        comando);
      - `grep -c 'chamadas para as páginas que existem' docs/PLANO-DE-DESENVOLVIMENTO.md` dá 0.

## 2. A página

- [x] 2.1 Os números em `src/features/numeros-da-liga/`, com tipos, conteúdo, teste de unidade e o
      componente (D1, D3). Verificar: `npm test` com código 0, imprimindo `números: 4`; `npm run
      lint` e `npm run verificar:tokens` com código 0; `wc -l` de cada arquivo novo com até 150
      linhas; no relatório, o vão entre o hero e os cartões medido contra o gabarito em 390 e 1280,
      o corte do `data-resp4` e os pares de contraste nomeados (RP-09).
- [x] 2.2 A faixa em `src/features/processo-seletivo/componentes/`, o rótulo do botão no conteúdo e,
      pela Q9 (a), a variante nova do botão na camada `ui`, com repouso, hover, pressionado e foco,
      e o anel de foco `--color-bg` no estilo da faixa, e não na variante, para o botão e o link do
      aviso (D1, D4). Verificar: `npm test` com código 0, com o teste do contrato do
      `Botao.test.tsx` ("botao e link da variante %s, largura %s, tem as mesmas classes") rodando a
      variante nova em largura natural e total; `git diff --numstat main --
      src/features/processo-seletivo/conteudo.ts src/features/processo-seletivo/tipos.ts
      src/features/processo-seletivo/conteudo.test.ts src/componentes/ui/Botao.module.css
      src/componentes/ui/Botao.test.tsx` com 0 linhas removidas, `src/componentes/ui/aparencia-de-botao.ts`
      com `1 1` (a união) e, com a Q10 (a), `src/componentes/ui/Botao.tsx` com `1 1` (a lista da
      prop); `grep -c 'outline-color: var(--color-bg)'` no `.module.css` da faixa nova dá pelo
      menos 1, e `grep -c outline src/componentes/ui/Botao.module.css` imprime 0 (o anel não fica
      na variante); `git diff --exit-code main --
      src/features/processo-seletivo/componentes/FaixaDoTopo.tsx
      src/features/processo-seletivo/componentes/FaixaDoTopo.module.css` com código 0, ou, se o
      `Aviso` for extraído, `npx playwright test tests/e2e/processo-seletivo.spec.ts` verde sem
      alteração no spec; `npm run verificar:tokens` com código 0 e `git diff --numstat main --
      src/estilos/tokens.css` com 0 linhas removidas; no relatório, **cada par da tabela do D4
      medido no pixel desenhado**, com as duas cores e a superfície, sobre o cartão `#82558f` e no
      pior ponto sobre o círculo, nos estados de repouso, hover, pressionado e foco, **o anel
      `--color-bg` do botão e do link contra o cartão (4,84:1 calculado)**, e o que difere do
      calculado (RP-09). Par abaixo do mínimo: para e reporta.
- [x] 2.3 O bloco de contato em `src/features/contato/`, e a variante "cartão" do quadro em
      `src/componentes/padroes/` (D1, D5; Q6 (a)). Verificar: `npm test` com código 0, imprimindo
      `quadros na composição da inicial: 2` e `apresentação cartão: 2`; `npm run lint` com código 0
      (a regra de camadas passa); `git diff --numstat main -- src/features/contato/conteudo.ts
      src/features/contato/tipos.ts` com 0 linhas removidas; no relatório, o hover e o pressionado
      medidos sobre o cartão. **Condição da Q6 (a), parte dos testes:** `npx playwright test
      tests/e2e/contato.spec.ts` com código 0; `npm test` com código 0 (inclui
      `ListaDeContatos.test.tsx` e `src/features/contato/conteudo.test.ts`); `git diff --numstat
      main -- tests/e2e/contato.spec.ts src/componentes/padroes/ListaDeContatos.test.tsx
      src/features/contato/conteudo.test.ts` com **0 linha removida** em cada um (só acréscimo). Se
      alguma linha que já existe precisar mudar, o dev para e reporta.
- [x] 2.4 A rota da raiz, na ordem do D6. Verificar, com `npm run build`, a 3000 publicada e a 3001
      não publicada, por `curl -s`:
      - `git diff --exit-code main -- 'src/app/(site)/(publicas)/_inicio' src/lib/utils/paginas-publicas.json
        src/proxy.ts` com código 0;
      - na 3000, `/` responde 200, com 1 `<h1>`, e `grep -c` de `>Processo seletivo</h2>` e de
        `>Onde a Liga responde</h2>` dá 1 em cada um (o rodapé tem `<h2>` próprios; a contagem dentro
        do `<main>` é do e2e, tarefa 3.1);
      - `grep -c` no HTML de `/` de "Próximos eventos", "O que anda acontecendo", "Conteúdo
        educativo", "2026.2", "Ver o edital", "Mandar uma mensagem", "canal mais rápido",
        `liacup@unb.br`, "Perfil do Instagram" e "—" dá 0 em cada um;
      - na 3001, o HTML de `/` traz "Portal em construção" e nenhum dos números.

## 3. Verificações

- [x] 3.1 **qa:** os blocos novos no spec da inicial (D7, itens 1 a 5), com os pares da faixa do D4.
      Verificar: `npx playwright test` inteiro verde nos dois modos, nas 7 larguras, e a saída
      imprime quantos trechos conferiu, `números lidos do documento: 4`, `faixa e página: 2 trechos
      iguais`, as medidas de contraste da faixa com as cores nomeadas (texto, selo, botão nos
      quatro estados, borda do botão, anel de foco e link nos três estados, sobre o cartão e sobre o
      círculo), o e2e do anel (o teclado foca, por Tab, o link do aviso e o botão da faixa, e cada um
      mostra o anel visível em `--color-bg` `#f5ead8`, com as duas cores e a medida contra o cartão
      impressas), os termos proibidos procurados e os achados (0), `páginas verificadas: 6 de 6`,
      `rotas verificadas: 4` e `Violacoes de acessibilidade: 0`; `git diff --exit-code main --
      tests/e2e/paginas-publicas.spec.ts tests/e2e/interruptor.spec.ts tests/e2e/contato.spec.ts
      playwright.config.ts` com código 0.
- [x] 3.2 RP-12: as doze demonstrações do D7 (a 11 e a 12 pela Q9 (a)), cada uma com a saída vermelha e a verde no relatório.
      Verificar: depois delas, `git status --porcelain` igual ao de antes, `sha256sum -c` com OK nos
      arquivos tocados e `git grep -c --untracked DEMO-RP12 -- src tests/e2e` com código 1.

## 4. Conferência

- [x] 4.1 **Guardião visual:** lado a lado da raiz inteira em 390 e 1280 px contra `inicio-*`, com
      cada diferença classificada. Os blocos de agenda, notícias e conteúdo educativo entram como
      "fora da R1"; a frase e o botão do contato, os rótulos e o texto da faixa, a cor do cartão e as
      cores do botão entram como decisão do briefing ou do Gabriel (Q1 a Q7, Q9); o hero, como já
      aprovado na `layout-e-hero`. A raiz não publicada contra os prints arquivados da
      `pagina-contato` (`raiz-nao-publicada-{390,1280}.png`). **Condição da Q6 (a), parte da
      tela:** `/contato` em 390 e 1280 contra o recorte do site em
      `openspec/changes/archive/2026-11-23-pagina-contato/prints/lado-a-lado-contato-390.png` e
      `lado-a-lado-contato-1280.png`, pelo método do `design.md`, D5, aprovado pelo Gabriel em
      23/11/2026 (moldura da direita achada pela
      linha de 1 px, x 453 e 1343 conferidos, miolo recortado; captura nova pelo mesmo método da
      `pagina-contato`). Verificar: os PNG em `openspec/changes/inicio-completo/prints/`; cada
      diferença no relatório com veredito; na raiz não publicada e em `/contato`, as mesmas
      dimensões e **0 pixel diferente** em cada largura, com a contagem (`0 de N`) e a posição do
      recorte no relatório. Moldura fora do lugar ou diferença maior que 0: para e reporta.
- [x] 4.2 **Líder técnico, antes do guardião:** no `docs/SEGURANCA.md` §7, a linha de origem dos PNG
      do `guardiao-visual` (no caminho do archive, como as anteriores), o total novo e a versão com
      o nome da change. Verificar: `grep -c 'inicio-completo' docs/SEGURANCA.md` com as linhas
      esperadas; `git diff --numstat main -- docs/SEGURANCA.md` mostrando só a §7 e o cabeçalho; o
      total igual à soma da coluna "Arquivos"; `npm run verificar:artefatos` com código 0.
- [x] 4.3 `npm run verificar` e `npm run build && npm run test:desempenho` com código 0. Verificar:
      `páginas medidas: 6` no publicado e `1` no não publicado; desempenho ≥ 90, acessibilidade ≥ 95
      e SEO ≥ 95 em `/`; 23 dependências diretas; `git diff --exit-code main -- package.json
      package-lock.json src/proxy.ts lighthouserc.json playwright.config.ts .github/ scripts/
      docs/PADROES-DE-CODIGO.md docs/conteudo-institucional.md openspec/specs` com código 0. O
      `docs/PLANO-DE-DESENVOLVIMENTO.md` sai deste comando: muda na tarefa 1.3, conferida lá.
- [x] 4.4 `revisor` sobre o diff e `guardiao-appsec` pela conferência proporcional (D8). O líder
      técnico manda ao guardião a lista do diff (`git diff --name-only main...HEAD` mais
      `git status --porcelain --untracked-files=all`), a busca `git diff -G 'process\.env|NEXT_PUBLIC_'
      --name-only main...HEAD` (e `git grep -c --untracked` nos não rastreados) e a classificação:
      **passo 1, checklist inteiro**, por dois arquivos da lista do gatilho: o `docs/SEGURANCA.md`
      (linhas de origem dos prints, tarefa 4.2) e o `docs/PLANO-DE-DESENVOLVIMENTO.md` (a linha 9
      da tabela da R1, Q8 (a), tarefa 1.3). Verificar: nenhum arquivo da lista fora da lista de
      tela, fora esses dois; a busca vazia; o veredito de cada um no relatório; nenhum BLOQUEADO
      aberto; `git status` igual antes e depois das duas passagens.
- [ ] 4.5 **Depois do push, antes do merge:** o P23 (D9) em
      `https://portal-liacup-git-feat-inicio-completo-liacup1.vercel.app/`, pelas formas da
      `SEGURANCA.md` §5. Verificar: a confirmação do Gabriel do host, letra por letra, e do commit no
      painel, registrada antes do `curl`; a resposta com `200`, sem `Location` e com
      `X-Matched-Path: /`, literal e mascarada no relatório; as buscas do segredo com código 1 e
      saída vazia; o registro commitado antes do merge.

## Workflow follow-up

- `npx openspec validate inicio-completo --strict` com código 0.
- `npx openspec archive inicio-completo` antes do PR. Depois, o `## Purpose` de
  `openspec/specs/pagina-inicial/spec.md` atualizado (hoje diz que a página "é o hero"), e
  `npx openspec validate --all --strict`. Se o archive cair em outra data, o caminho da linha do §7
  muda no mesmo diff.
- Entrega ao Gabriel no modelo do `CLAUDE.md`.
- Depois do merge, em produção: a raiz continua mostrando a página em construção.
