# Tarefas — página do processo seletivo

15 tarefas, sem folga. Se uma correção acrescentar tarefa, o grupo 2 inteiro (SEO) e as partes de
SEO da 3.2 e da 3.3 saem para a `pagina-sobre-e-equipe` (proposta). Comandos em sintaxe de bash
(Git Bash). Escopos nominais no `design.md`, D13. As tarefas aplicam as decisões do Gabriel no
Portão 1, em 21/11/2026: Q1 (b), Q2 (a), Q3 (a), Q4 (a), Q5 (a), Q6 (a), Q7 (a) e Q8 (b).

**Já feito no Portão 1, antes do apply:** o aviso da Q1 (b) está no `conteudo-institucional.md`
§5.1, inserido pelo `especificador` com autorização do Gabriel. Os títulos e sobretítulos da Q3 (a)
estão na `REFERENCIA-VISUAL.md` §7, registrados pelo líder técnico.

**Rodada do Portão 2 (21/11/2026), sem tarefa nova:** o Gabriel decidiu Q10 (a), Q11 (a), Q12 (a),
Q13 (b), Q14 (a) e Q16 (b), adiou a Q15 e trocou conteúdo. Já feito antes do código, pelo
`especificador`, com autorização do Gabriel: no `conteudo-institucional.md`, o §5.5 com cinco
etapas e a subseção "Texto da página" no §5.3 e no §5.4, acima do texto do edital, que fica como
fonte; uma linha no §8. **Correção do Gabriel no item 2**, na mesma rodada: o cartão "Quem pode se
inscrever" passa a 4 itens, sem parágrafo; a "Texto da página" do §5.3 é a lista dos 4, e a do
§5.4 virou remissão a ela. A terceira rodada do `dev-frontend`, a atualização do qa e os prints novos
entram nas tarefas 1.1, 1.3, 3.1 e 5.1, nas linhas marcadas "rodada do Portão 2". Continuam 15.

## 1. A página e a moldura

- [x] 1.1 Os dados do processo seletivo (D5): o tipo, com o estado `'fechado'`, e o conteúdo, com
      o teste de unidade. Verificar: `npm test` com código 0, e a saída imprime `etapas: 5 ·
      quem pode se inscrever: 4 · perguntas: 8`.
      - **Rodada do Portão 2:** as cinco etapas do §5.5 e os quatro itens da "Texto da página" do
        §5.3, sem a nota de fonte do item 3, no lugar do texto do edital; o dado não tem campo de
        parágrafo. Antes da emenda a saída era `etapas: 2`, e antes da correção do item 2,
        `pré-requisitos: 3`.
- [x] 1.2 Botão unificado, Q4 (c) da `layout-e-hero` (D7). Verificar:
      - `npm test` com código 0, com o caso novo do `Botao.test.tsx`;
      - `git ls-files src/componentes/layout | grep -ci aparencia` dá 0;
      - `npm run lint` e `npm run verificar:tokens` com código 0;
      - na 3000 publicada, `/vitrine` responde 200.
- [x] 1.3 A página `/processo-seletivo` e a entrada dela na lista (D1, D3, D4), sem as perguntas.
      Verificar, com `npm run build`, a 3000 publicada e a 3001 não publicada, por `curl -s`:
      - na 3000, `/processo-seletivo` responde 200, com 1 `<h1>` "Processo seletivo";
      - a 3000 tem o selo, o §5.2, o aviso do §5.1 ("As inscrições estão fechadas. Acompanhe a
        Liga no Instagram @liacup.unb para saber quando abre o próximo processo seletivo."), os
        títulos e sobretítulos da Q3 (a), 0 ocorrências de "Cronograma", e o link
        `https://www.instagram.com/liacup.unb/` com `target="_blank"` e
        `rel="noopener noreferrer"`;
      - `grep -c` de "Fazer inscrição", "Baixar o edital", "desempate", "2026.2" e "28/08" na
        resposta dá 0;
      - a raiz da 3000 tem o botão "Processo seletivo" e o "Quero participar", e não tem "Conheça a
        Liga";
      - na 3001, `curl -s -o /dev/null -w '%{http_code} %{redirect_url}'` em `/processo-seletivo`
        dá `307` para `/`;
      - nenhum componente novo com mais de 150 linhas (`wc -l`);
      - **rodada do Portão 2:** a resposta de `/processo-seletivo` na 3000 tem as cinco etapas do
        §5.5, na ordem, e, no quadro de quem pode se inscrever, os quatro itens da "Texto da
        página" do §5.3, na ordem, e nenhum `<p>`; `grep -c` de "supracitadas", de "regularmente
        matriculad", de "Edital, item 2.2" e de "Matrícula ativa" dá 0. Na mesma rodada, a Q10, a Q11 e a Q12 (a), na forma das
        opções da entrega do Portão 2, com o resultado de cada uma no relatório.
- [x] 1.4 As perguntas frequentes (D6). Verificar:
      - na 3000, a resposta de `/processo-seletivo` tem 8 `<details>`, nenhum com `open`;
      - o dev confere à mão em 390 px Enter, Espaço, toque e Tab, e registra o resultado no
        relatório;
      - `npm run verificar:tokens` com código 0.
- [x] 1.5 Pendências da `layout-e-hero` na moldura e no README (D12): nome acessível da marca,
      página atual nas colunas do rodapé, hook em kebab-case, tamanho de fonte do botão de
      destaque, README ("onde a página mora", os campos novos da lista e a linha velha da tabela do
      interruptor). Verificar:
      - na 3000, o link da marca não tem `aria-label`, e o texto dele contém "Liga Acadêmica
        Multiprofissional de Cuidados Paliativos";
      - `git ls-files src | grep -c usePainelDeNavegacao` dá 0;
      - `grep -c "font-size-h6" src/componentes/layout/Cabecalho.module.css` dá 0, com a medida do
        protótipo no relatório;
      - `npm run lint` e `npm run formatar:check` com código 0.

## 2. SEO

- [x] 2.1 **Líder técnico:** a seção 11 dos `PADROES-DE-CODIGO.md`, com o texto aprovado em 21/11;
      "SEO" na linha do Lighthouse CI da §9; o item de página pública no checklist da §10.
      Verificar: `grep -c "^## 11. SEO" docs/PADROES-DE-CODIGO.md` dá 1, e `git diff
      docs/PADROES-DE-CODIGO.md` só tem linhas acrescentadas, fora a da §9.
- [x] 2.2 Título e descrição na lista, validados no `problemasDaLista`, e o `montarMetadados` com o
      teste dele, aplicado na Início e no Processo seletivo (D3, D10, Q5 (a), Q6 (a)). Verificar:
      - `npm test` com código 0, com `Entradas da lista de páginas públicas conferidas: 2` e os
        caracteres de cada descrição impressos (129 e 155, contados à mão no Portão 1);
      - os títulos "Liga Acadêmica Multiprofissional de Cuidados Paliativos · LIACUP" e "Processo
        seletivo · LIACUP";
      - na 3000, o `<head>` de `/` e de `/processo-seletivo` tem o título, a descrição,
        `<link rel="canonical" href="https://liacup.com.br/...">` e `og:title` e `og:description`
        iguais;
      - os metadados do `<head>` da raiz da 3001 iguais aos gravados antes da mudança (D10), e
        `git diff --exit-code src/app/layout.tsx src/app/\(site\)/em-construcao` com código 0.
- [x] 2.3 O Lighthouse com SEO e o contador real (D9, Q7 (a)). Verificar: `npm run build && npm
      run test:desempenho` com código 0, e a saída tem:
      - `páginas medidas: 2` no publicado e `1` no não publicado, lidos do manifesto;
      - desempenho, acessibilidade e SEO de cada execução, com SEO ≥ 95 nas duas páginas
        publicadas, e a nota da raiz não publicada impressa sem reprovar;
      - a auditoria `canonical` aprovada. Se ela falhar porque mede `liacup.com.br` com a página
        em `localhost`, o dev para, e o líder técnico traz o caso ao Gabriel como Qn nova. A
        auditoria não se desliga sem decisão;
      - `git diff --exit-code lighthouserc.json .github/` com código 0.

## 3. Verificações

- [x] 3.1 **qa:** o spec da página do processo seletivo (D8, item 1), com o texto lido do
      `conteudo-institucional.md`, o aviso do §5.1 incluído e as notas de fonte tiradas das respostas
      (Q4 (a)). Verificar: `npx playwright test` verde nas 7
      larguras, e a saída de cada largura imprime quantos trechos conferiu, `perguntas medidas: 8`,
      os alvos medidos e `Violacoes de acessibilidade: 0`, com as perguntas fechadas e abertas.
      - **Rodada do Portão 2:** o spec lê os quatro itens da lista da subseção "Texto da página"
        do §5.3, e não a nota acima dela nem o texto do edital abaixo, e lê as cinco etapas do
        §5.5; exige 4 itens no quadro de quem pode se inscrever e nenhum parágrafo nele; a saída
        de cada largura imprime `etapas: 5` e `quem pode se inscrever: 4` junto da contagem de
        trechos.
- [x] 3.2 **qa:** um `h1` por página da lista (D8, item 2), mais os ajustes nos specs existentes
      (D8, item 3). Verificar:
      - `npx playwright test` inteiro verde nos dois modos;
      - a saída tem `páginas verificadas: 2 de 2` e `menu lateral testado em 6 de 7 larguras`;
      - `git diff --exit-code tests/e2e/interruptor.spec.ts playwright.config.ts` com código 0.
- [x] 3.3 RP-12: as dez demonstrações do D8, cada uma com a saída vermelha e a verde no relatório. A
      primeira é o título repetido, que é critério do briefing. Verificar: depois delas, `git status
      --porcelain` igual ao de antes, `sha256sum -c` com OK nos arquivos tocados e 0 marcas
      `DEMO-RP12` (`git grep -c DEMO-RP12` com código 1).

## 4. P23

- [x] 4.1 **Líder técnico:** no `SEGURANCA.md`:
      - §5: a forma nova do `curl`, a do Gabriel (`{ printf …; sed -n … .env | tr -d '\r\n';
        printf '\n'; } | curl … -H @- "https://<host>/"`), e as duas formas de busca do valor,
        com a mesma extração (D11);
      - a lacuna `<host>`: exatamente `portal-liacup-git-<branch>-liacup1.vercel.app` (Q8 (b)),
        conferido letra por letra, com recusa se a Vercel cortar o rótulo;
      - a regra "variável ausente no `.env`: para e avisa o Gabriel";
      - §3, R1: a superfície nova (a página, o link do aviso, o P23 com segredo).
      E no `.env.example`, o nome `VERCEL_AUTOMATION_BYPASS_SECRET` sem valor. Verificar:
      - `grep -c "x-vercel-protection-bypass" docs/SEGURANCA.md` dá pelo menos 1;
      - `grep -c "liacup1.vercel.app" docs/SEGURANCA.md` dá pelo menos 1;
      - `grep -c "^VERCEL_AUTOMATION_BYPASS_SECRET=$" .env.example` dá 1;
      - `git check-ignore -v -- .env` com código 0.

## 5. Conferência

- [x] 5.1 **Guardião visual:** lado a lado de `/processo-seletivo` em 390 e 1280 px contra
      `processo-seletivo-{390,1280}.png`, e o cabeçalho e o hero da Início com os botões novos. Inclui
      a raiz não publicada contra os `depois-raiz-nao-publicada-*` arquivados da `layout-e-hero`.
      Depois, o líder técnico acrescenta a linha dos prints na `SEGURANCA.md` §7. Verificar:
      - os PNG em `openspec/changes/pagina-processo-seletivo/prints/`;
      - cada diferença no relatório com veredito;
      - 0 pixel diferente na raiz não publicada;
      - a linha da §7 com a contagem igual a `ls prints | wc -l`;
      - **rodada do Portão 2:** prints novos de `/processo-seletivo` em 390 e 1280 px contra
        `processo-seletivo-390.png` e `-1280.png`, com a linha do tempo de cinco marcadores, e o
        veredito escrito sobre se o quadro de requisitos ficou na medida do gabarito. O caminho dos
        prints na §7 só é fixado no archive, com a data real, e a Q15 volta ao Gabriel com eles.
- [x] 5.2 `npm run verificar` com código 0, com os contadores de cada etapa no relatório. Verificar
      também:
      - 22 dependências diretas;
      - `git diff --exit-code package.json package-lock.json src/proxy.ts` com código 0;
      - `git status --porcelain` só com arquivos do D13, conferido pelo líder técnico na seção
        "Líder técnico — conferência de escopo".
- [ ] 5.3 `revisor` sobre o diff e `guardiao-appsec` com o checklist inteiro (a regra 2 da dieta
      ainda não vale), com as duas buscas do valor do segredo (D11). Verificar: o veredito de cada
      um no relatório, nenhum BLOQUEADO aberto, e `git status` igual antes e depois das duas
      passagens.

## Workflow follow-up

- `openspec validate pagina-processo-seletivo --strict` com código 0.
- `openspec archive pagina-processo-seletivo` antes do PR, porque a `main` é protegida. Depois,
  `openspec validate --all --strict`, com `pagina-processo-seletivo` e `seo` criadas e, em
  `navegacao-publica`, "Uma lista única decide quais páginas públicas existem" trocado por "A lista
  única decide quais páginas públicas existem e onde aparecem".
- Entrega ao Gabriel no modelo do `CLAUDE.md`.
- Depois de a Vercel gerar a prévia, e antes do merge: o **P23** pela forma nova, em
  `https://portal-liacup-git-feat-pagina-processo-seletivo-liacup1.vercel.app/` e em
  `/processo-seletivo`, depois de conferir o host letra por letra, com 200 e sem `Location`. A
  saída vai literal e mascarada para o relatório, e o AS-15 da change sai de "não verificado". Se
  a Vercel tiver cortado o rótulo, ou se o `.env` não tiver a variável, o P23 para e o líder
  técnico pede ao Gabriel o host exato ou a variável.
- Na prévia, o **Gabriel confere o menu à mão em 390 px** (tarefa 1.5 da `layout-e-hero`), agora
  com o botão "Processo seletivo" no fim do menu.
- Depois do merge, em produção: a raiz continua mostrando a página em construção, e
  `/processo-seletivo` leva 307 para `/`.
