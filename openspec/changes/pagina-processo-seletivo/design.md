# Design — página do processo seletivo

## Context

Ver `proposal.md`, seção Why. Estado lido na `main` `33077f4` pelo especificador:

| O que | Situação |
| --- | --- |
| Lista única | `src/lib/utils/paginas-publicas.json` (dados, lidos pelo `scripts/medir-desempenho.mjs` sem compilar TS) e `paginas-publicas.ts` (tipos, `problemasDaLista`, consultas). Uma entrada, `/`, com `endereco`, `rotulo`, `noMenu`, `colunaDoRodape` e `destaque` |
| Metadados | `src/app/layout.tsx` exporta `title: 'Portal LIACUP'` e uma descrição que **não está** no `conteudo-institucional.md`, e já tem `lang="pt-BR"`. O layout de `(publicas)` exporta só `icons`. A página em construção (`/em-construcao`, fora de `(publicas)`) herda os metadados da raiz, e é ela que a produção serve na raiz |
| Botões | `ui/Botao` (F01: só `<button>`, sem hover nem pressionado) e `componentes/layout/aparencia-de-botao.ts` com `AparenciaDeBotao.module.css` (link com aparência de botão, com hover, pressionado e página atual). Usados pelo destaque do cabeçalho, pelo fim do menu lateral e pelos botões do hero |
| Hero | Mostra "Quero participar" só se `/processo-seletivo` estiver na lista (`estaNaLista`) |
| Lighthouse | `lighthouserc.json` com desempenho ≥ 90 e acessibilidade ≥ 95, preset desktop, 3 execuções. `scripts/medir-desempenho.mjs` roda um modo por vez e imprime `páginas medidas: ${urls.length}`, que é o pedido, não o medido |
| e2e | `paginas-publicas.spec.ts`, `menu-por-teclado.spec.ts`, `pagina-inicial.spec.ts`, `interruptor.spec.ts` (já confere `/processo-seletivo` nos dois modos: 307 para `/` no não publicado; sem redirecionamento e sem a página em construção no publicado) |
| P23 | `SEGURANCA.md` §5: `curl -q -sS -I --max-time 20 --proto =https '<endereço>'`, host da prévia "que começa com `portal-liacup-`", tirado do painel da Vercel. Na `layout-e-hero` ele bateu no login da Vercel e mirou o deployment de produção |
| `.env` | No `.gitignore`. Uma linha começa com `VERCEL_AUTOMATION_BYPASS_SECRET=` (contada pelo líder técnico, sem ler o valor). O nome não está no `.env.example` |
| Gabarito | `prototipo/prints/processo-seletivo-{390,1280}.png`: faixa roxa com selo, `h1`, parágrafo e dois botões; "Como funciona" (linha do tempo) e "Quem pode se inscrever" (quadro com lista), lado a lado em 1280 e um abaixo do outro em 390; perguntas com "+"; a página não está no menu nem nas colunas do rodapé, só no botão de destaque |

## Goals / Non-Goals

**Goals:**

- A página nova sai da lista e dos dados, e a composição não guarda texto.
- A produção continua igual na tela **e** no cabeçalho do documento.
- Toda verificação nova é vista falhando (RP-12), e o P23 roda sem o segredo aparecer em lugar
  nenhum.

**Non-Goals:** ver "Fora de escopo" da proposta. Além disso, nenhuma configuração nova da Vercel é
feita por agente: o segredo de bypass já existe no `.env` do Gabriel.

## Decisions

### D1 — Onde a página mora

- A rota fica em `src/app/(site)/(publicas)/processo-seletivo/page.tsx`, dentro da moldura. Grupo de
  rotas não muda endereço, e o interruptor (`src/proxy.ts`) não muda: com o site não publicado, todo
  endereço que não é `/` nem `/em-construcao` já leva 307 para `/`.
- O domínio vai para `src/features/processo-seletivo/`: `tipos.ts` (o tipo do conteúdo),
  `conteudo.ts` (o dado tipado) e `componentes/` (as seções da página). É a pasta que a
  `PADROES-DE-CODIGO.md` §1 dá a um domínio, e é onde o `dados.ts` vai morar na R3, quando o painel
  assumir o conteúdo (§5.1). A rota só compõe.
- **Alternativa descartada:** uma pasta `_processo-seletivo/` em `app`, como o `_inicio/` do hero. O
  hero é composição de uma página; este conteúdo vira dado do banco na R3 e precisa de camada de
  dados.

### D2 — Que spec muda, e qual não muda

- `navegacao-publica`: REMOVED mais ADDED da lista (o cenário "Nesta entrega, a lista tem só a
  Início" fica falso), e MODIFIED do cabeçalho, do menu, do rodapé e da medição.
- `equipe-de-agentes`: ADDED, o P23 com o segredo.
- **Não mudam**, e por quê:
  - `publicacao-do-site`: os cenários usam `/processo-seletivo` só como rota que leva 307 no não
    publicado e que não mostra a página em construção no publicado. Os dois continuam verdadeiros.
    `/sobre` continua sem página. `git diff --exit-code tests/e2e/interruptor.spec.ts` com código 0;
  - `fundacao-e-ci`: o cenário "Visitante abre outro endereço com o site não publicado" cita
    `/processo-seletivo`, e continua verdadeiro;
  - `pagina-inicial`: "Botões só para páginas que existem" já diz que o botão aparece quando a
    página entra na lista.

### D3 — A lista

- Dois campos novos em toda entrada: `titulo` e `descricao` (regra de SEO, `PADROES` §11).
- A entrada nova: `endereco` `/processo-seletivo`, `rotulo` "Processo seletivo", `noMenu` `false`,
  `colunaDoRodape` `null`, `destaque` `true`. No gabarito a página não está no menu nem no rodapé, só
  no botão de destaque (`REFERENCIA-VISUAL.md` §1). Fica depois da Início.
- `problemasDaLista` passa a acusar: título ou descrição vazios, título fora do formato
  `<rótulo> · LIACUP` (a Início é a exceção, com o nome da liga), descrição fora de 70 a 160
  caracteres (contados em caracteres, não em bytes) e título ou descrição repetidos, sempre
  nomeando o endereço. O teste imprime quantas entradas conferiu.
- O JSON continua sendo o dado, porque o script do Lighthouse o lê sem compilar.

### D4 — A composição da página

Do protótipo vale só a composição (`REFERENCIA-VISUAL.md` §6). O texto vem dos dados (D5).

- **Faixa do topo:** o selo, o `h1` "Processo seletivo", o §5.2 e o aviso do §5.1 (Q1 (b)): "As
  inscrições estão fechadas. Acompanhe a Liga no Instagram @liacup.unb para saber quando abre o
  próximo processo seletivo.". O link é o "@liacup.unb" da frase. O selo segue o do
  protótipo (fundo verde claro, texto escuro). Se o `guardiao-visual` ou o dev acharem que o verde
  lê como "aberto", isso vira **melhoria proposta** no lado a lado, para o Gabriel aprovar no
  Portão 2; o sentido já vai no texto do selo. O aviso tem o link do Instagram em nova aba, com
  `rel="noopener noreferrer"`, e nome acessível que diz o destino e contém o texto visível. Na frase
  corrida o @ continua (`REFERENCIA-VISUAL.md` §7). Os pares de cor sobre o roxo da faixa são
  medidos e nomeados (RP-09).
- **Etapas (emenda do Portão 2):** a linha do tempo do protótipo, com **cinco** marcadores, como o
  gabarito, e sem datas. As cinco são as do §5.5, decididas pelo Gabriel em 21/11/2026: "Inscrição
  por formulário", "Análise do produto", "Entrevista online via Meet", "Resultado" e "Integração".
  O nome da etapa em negrito e, abaixo, o resto da linha do §5.5 ("etapa eliminatória."), sem o
  " · ", que vira a quebra de linha. As palavras são as do documento. Antes da emenda eram dois
  marcadores, as duas etapas do edital (item 4.2).
  **Alternativa:** a linha inteira numa linha só, com o " · ". Fica pior no 390, e o protótipo
  separa título e descrição.
- **Quem pode se inscrever (emenda do Portão 2, com a correção do Gabriel no item 2):** o quadro
  do protótipo, com **quatro itens em lista, como o gabarito, e nenhum parágrafo**. Os quatro são
  os da subseção "Texto da página" do §5.3, a única do §5.3 e do §5.4; o §5.4 só remete a ela. O
  texto do edital, que fica abaixo, como fonte, não vai ao ar. O item 3 ("Faltas não justificadas
  acima de 50% levam ao desligamento da Liga.") vem do **Edital, item 2.2**, e não da linha
  "frequência mínima para certificação" do protótipo, que não tem fonte. A nota de fonte do item 3
  não vai ao ar, pela mesma regra das respostas (Q4 (a)). Antes da correção, o quadro tinha um
  parágrafo e três itens. O `guardiao-visual` diz se o quadro ficou na medida do gabarito.
- **Títulos e sobretítulos (Q3 (a)):** "Como funciona" com o sobretítulo "Etapas", "Quem pode se
  inscrever" com "Requisitos", e "Perguntas que sempre chegam" com "FAQ". O líder técnico os
  registrou na `REFERENCIA-VISUAL.md` §7 no Portão 1. A hierarquia é `h1` na faixa e `h2` em cada
  seção. As perguntas não são títulos (D6).
- **Botões:** nenhum na página, no estado fechado.
- Cada componente até 150 linhas; nenhum valor visual à mão; token novo só acrescentado, com origem
  medida no protótipo (RP-02, RP-03).

### D5 — O arquivo de dados

- `tipos.ts` declara o conteúdo com o estado como união de valores possíveis, hoje com um só,
  `'fechado'`. Pela Q2 (a), o estado aberto não existe no tipo. Quando entrar, numa change própria,
  ele acrescenta um valor à união, e o TypeScript aponta todo lugar que precisa tratá-lo.
- `conteudo.ts` traz: o selo, a apresentação, o aviso (o texto e o link), as cinco etapas (nome e
  caráter, emenda do Portão 2), os **quatro itens** de quem pode se inscrever, os da "Texto da
  página" do §5.3, sem a nota de fonte do item 3 e **sem campo de parágrafo** (correção do Gabriel
  no item 2), e as oito perguntas, cada uma com a resposta sem a nota de fonte (Q4 (a)). Também os
  títulos e sobretítulos das seções (Q3 (a)).
- **Teste de unidade** do conteúdo: 5 etapas (eram 2 antes da emenda do Portão 2), 4 itens de quem
  pode se inscrever (eram um parágrafo e 3 pré-requisitos antes da correção), 8 perguntas, nada
  vazio, nenhuma pergunta repetida. Imprime as contagens.
- **O teste do texto contra o documento é de ponta a ponta** (D8, item 1). Ele lê o
  `conteudo-institucional.md`, como o `pagina-inicial.spec.ts` já faz com o §2.0, e compara com a
  página publicada, não com o arquivo de dados. Assim pega também texto que a composição escreva por
  conta própria.

### D6 — As perguntas frequentes

- Cada pergunta é um `<details>` com um `<summary>`, em Server Component, sem JavaScript.
  - Enter e Espaço abrem e fecham nativamente, e o navegador expõe o estado expandido ou recolhido
    ao leitor de tela.
  - A busca do navegador abre a resposta que contém o termo.
  - Todas começam fechadas, como no protótipo.
- O `<summary>` tem alvo de pelo menos 44 px de altura e a largura da coluna. O "+" do protótipo é
  decorativo (`aria-hidden`), e vira "−" quando a pergunta está aberta. Hover, pressionado e
  `focus-visible` seguem o ADR-0006.
- A pergunta não é título: um `h3` dentro do `<summary>` perde a semântica, porque o papel de
  botão torna os filhos apresentacionais. O título da seção é `h2`.
- **Alternativa:** `<button aria-expanded aria-controls>` numa ilha cliente. Fica para o caso de o
  qa medir que um leitor de tela do teste não anuncia o estado do `<details>`. O que decide é o
  qa, e a troca vai registrada no relatório.

### D7 — Botão unificado (Q4 (c) da `layout-e-hero`)

- O contrato visual passa a ser um só, na camada base:
  - o `Botao.module.css` ganha hover (só com `@media (hover: hover)`), pressionado e página atual
    (`aria-current="page"`, com o sublinhado), copiados do `AparenciaDeBotao.module.css`;
  - uma função na camada base, ao lado do `Botao`, devolve as classes de link com aparência de
    botão. Ela não conhece rota: quem a usa escolhe o elemento, o `LinkDaNavegacao` no cabeçalho e
    o `Link` no hero;
  - o `Botao` passa a usar a mesma função.
- Saem `componentes/layout/aparencia-de-botao.ts` e `AparenciaDeBotao.module.css`. O cabeçalho, o
  menu lateral e o hero importam da camada base, como a tabela de camadas permite.
- **Teste:** o `Botao.test.tsx` ganha o caso "botão e link da mesma variante têm as mesmas classes".
- A vitrine continua abrindo. Se ela mostrar o botão, mostra também o link com aparência de botão.

### D8 — Verificações e RP-12

O `qa-acessibilidade` escreve, lendo a lista e o documento de conteúdo, sem copiar texto:

1. **Spec da página do processo seletivo**, nas 7 larguras, com o site publicado:
   - o aviso do §5.1 e os trechos do §5.2 a §5.5 e do §6 conferidos com a página, imprimindo
     quantos. No §5.3, o teste lê só os quatro itens da lista da subseção "Texto da página", e não
     a nota em itálico acima dela nem o texto do edital abaixo; o §5.4 não tem texto próprio na
     página. O teste exige 4 itens no quadro e nenhum parágrafo nele, e imprime quantos itens leu
     (correção do Gabriel no item 2). No §5.5, lê as cinco etapas e imprime quantas leu (emenda do
     Portão 2). Pela Q4 (a), o teste tira a nota de fonte em itálico entre parênteses do fim de
     cada resposta e de cada item antes de comparar, e confere que nenhuma nota aparece na página;
   - a ausência dos termos da spec (desempate, prova, 2026.2, datas do §5.6);
   - as 8 perguntas: Enter abre, Espaço fecha, sem a página rolar, estado anunciado, 44 px, foco
     visível, imprimindo quantas mediu;
   - axe 0 com todas fechadas e com todas abertas;
   - o link do aviso: destino, nova aba, `rel` e nome acessível.
2. **Um `h1` por página e nenhum nível pulado**, percorrendo a lista. Imprime quantas páginas
   conferiu.
3. **Ajustes nos specs existentes:**
   - `páginas verificadas: 2 de 2`;
   - o menu imprime "testado em N de 7 larguras";
   - o comportamento 4 do menu passa a navegar de verdade, pelo botão "Processo seletivo";
   - a marca com o nome longo no nome acessível acima de 1024 px;
   - a página atual nas colunas do rodapé, e o destaque marcado em `/processo-seletivo`;
   - o "Quero participar" aparece e leva a `/processo-seletivo`, e o "Conheça a Liga" não aparece.

Demonstrações de falha, cada uma com a saída vermelha e a verde no relatório:

| # | Violação temporária | Vermelho esperado |
| --- | --- | --- |
| 1 | Título da Início repetido no Processo seletivo (critério do briefing) | unidade: o título e os dois endereços |
| 2 | Descrição com 69 caracteres | unidade: o endereço e "69" |
| 3 | Uma pergunta sem resposta nos dados | unidade: a pergunta |
| 4 | Uma palavra trocada numa resposta | e2e: o trecho, o esperado e o recebido |
| 5 | Pergunta que abre só por clique, sem Enter e Espaço | e2e: a pergunta e a tecla |
| 6 | Um segundo `h1` na página nova | e2e: a página e os dois títulos |
| 7 | A página nova dizendo ao buscador que não indexe | Lighthouse: SEO abaixo de 95, nomeando a página |
| 8 | O resultado do Lighthouse apagado antes da contagem | o script imprime `páginas medidas: 0` e reprova |
| 9 | Sem a marca de página atual nas colunas do rodapé | e2e: o link e a página |
| 10 | Nome acessível da marca sem o nome longo | e2e: só em 1280, o texto visível e o nome |

Depois das demonstrações, `git status --porcelain` igual ao de antes, e `sha256sum -c` dos arquivos
tocados com OK.

### D9 — Lighthouse com SEO

- O `lighthouserc.json` **não muda**. O preset já coleta a categoria SEO, e ela vem no
  `manifest.json` de cada execução.
- O `scripts/medir-desempenho.mjs` passa a:
  - contar as páginas medidas pelas URLs distintas do `manifest.json`, e não pelas pedidas;
    manifesto ausente dá 0 e reprova;
  - imprimir desempenho, acessibilidade e SEO de cada execução;
  - no modo publicado, reprovar quando o SEO de alguma execução ficar abaixo de 95, nomeando a
    página. No modo não publicado, só imprimir a nota (Q7 (a)).
- **`noindex`:** a medição é local, contra a versão compilada, e nenhuma página declara `noindex`.
  Nada sai da conta. A regra de tirar só o `is-crawlable` vale quando a medição for feita num
  endereço de prévia, que a Vercel marca com `X-Robots-Tag: noindex`, e o relatório diz isso. Nesta
  change isso não acontece no CI.
- **Emenda do Portão 2:** o cenário "Endereço de prévia marcado pela hospedagem" saiu da spec `seo`
  desta change e vai para a `lancamento-r1`, com a frase do requisito que o sustentava. Nesta change
  nenhum código nem procedimento o exercitava (achado 5 do `revisor`, rodada 2), e o P23 mede
  cabeçalhos com `curl -I`, sem rodar o Lighthouse na prévia, então não o cobre.
- **Por que no script, e não numa asserção do `lighthouserc.json`:** a asserção do arquivo vale para
  os dois modos, e a Q7 (a) decidiu o mínimo só no publicado. O limiar de desempenho e acessibilidade
  continua no `lighthouserc.json`, sem mudança.

### D10 — `montarMetadados` e a raiz

- `src/lib/utils/metadados.ts`, função pura: recebe o endereço, acha a entrada na lista e devolve
  um `Metadata` com:
  - `title` absoluto;
  - `description`;
  - `metadataBase` `https://liacup.com.br`;
  - `alternates.canonical` igual ao endereço;
  - `openGraph` com o mesmo título, a mesma descrição, a `url`, `locale` `pt_BR` e `type`
    `website`.
  Endereço fora da lista lança erro na compilação, e o teste de unidade cobre isso.
- Cada página de `(publicas)` exporta `metadata = montarMetadados('<endereço>')`. Nenhuma escreve
  metadados à mão.
- **A raiz não muda (Q5 (a)).** "Partir da raiz" quer dizer que a função não repete o que a raiz já
  dá (o idioma, as fontes) nem o que o layout de `(publicas)` dá (os ícones). Ela sobrescreve só
  título e descrição, e acrescenta canonical e Open Graph. A página em construção continua com o
  título e a descrição de hoje.
- **Conferência da produção:** antes de mexer, o dev grava os metadados do `<head>` da raiz não
  publicada (título, `meta`, `link`), com `curl -s` na 3001. Depois compara. O byte a byte do HTML
  não serve, porque o build muda o nome dos arquivos compilados.

### D11 — O P23

- **Onde:** na prévia da branch (ambiente Preview, com `SITE_PUBLICADO=true`), nos caminhos `/` e
  `/processo-seletivo`.
- **O host (Q8 (b), Gabriel, 21/11/2026):** exatamente
  `portal-liacup-git-<branch>-liacup1.vercel.app`, com `<branch>` igual ao nome da branch em
  minúsculas e `/` trocado por `-`, e `liacup1` como identificador do time. Nesta change:
  `portal-liacup-git-feat-pagina-processo-seletivo-liacup1.vercel.app`, com 55 caracteres antes de
  `.vercel.app` (conferido pelo líder técnico com `wc -c`). A conferência compara letra por letra
  antes de ler o segredo. Se a Vercel cortar o rótulo (acima de 63 caracteres), a conferência
  recusa, o P23 para, e o líder técnico pede ao Gabriel o host exato daquela change.
- **Forma nova da lista fechada** do `SEGURANCA.md` §5, a do Gabriel, em que `<host>` é o host
  acima e o caminho é `/` ou `/processo-seletivo`:

  ```bash
  { printf 'x-vercel-protection-bypass: '; sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n'; printf '\n'; } | curl -q -sS -I --max-time 20 --proto =https -H @- "https://<host>/"
  ```

  - O `sed` lê só a linha do nome e não carrega o resto do `.env` no ambiente. O `tr` tira o `\r`
    do fim, porque o `.env` é do Windows, e a quebra de linha.
  - O valor nunca é argumento de comando: vai pela entrada padrão para o `curl`, que lê o cabeçalho
    de `@-`.
  - Sem `-L`: o `curl` não segue redirecionamento, então o cabeçalho não vai para outro host.
  - `-I` imprime os cabeçalhos da resposta, e não os do pedido. Sem `-v`.
  - A saída é mascarada pela regra da §5. Não se manda `x-vercel-set-bypass-cookie`, então a
    resposta não traz cookie de acesso.
  - Falha fechada: valor errado dá 401 ou a tela de login, e nunca vazamento.
- **Fatos medidos pelo líder técnico no Portão 1, só com contagem:** 1 linha com o nome no `.env`,
  0 com aspas no começo do valor e 0 com `\r`. **Correção do líder técnico no apply (21/11):** a
  contagem do `\r` do Portão 1 estava errada. Medida de novo com um script que só conta, deu 1
  linha com `\r`, 0 com aspas, 0 com espaço no fim, 0 com `#` e valor não vazio. O `tr -d '\r\n'`
  da forma cobre o `\r`, que é o caso que o Gabriel previu ("o `.env` é do Windows").
- **Variável ausente:** se o `.env` não tiver a linha `VERCEL_AUTOMATION_BYPASS_SECRET=`, o líder
  técnico para e avisa o Gabriel. Não procura o segredo em outro lugar.
- **Busca do valor em nada rastreado** (AS-01), duas formas novas, com a mesma extração do pedido,
  que só devolvem `arquivo:contagem`:

  ```bash
  sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F -f - HEAD
  sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --untracked -f -
  ```

  Código 1 com saída vazia quer dizer nada achado. O `.env` é ignorado, e por isso não entra na
  busca `--untracked`. Valor vazio casa com tudo: se a saída listar todo arquivo, o líder técnico
  registra "valor vazio" e não conclui. O histórico não é buscado, porque o `git log -S` exigiria
  o valor como argumento.
- **Antes da primeira execução**, o líder técnico confere `curl --version` (o `@-` em `-H` existe
  desde a 7.55) e `MSYS_NO_PATHCONV=1`, como as outras formas.
- **Também:** o nome `VERCEL_AUTOMATION_BYPASS_SECRET` entra no `.env.example`, sem valor, marcado
  como segredo de uso local do líder técnico. O README ganha uma linha na seção de variáveis.
- **O relatório** registra o P23 e a Q9 da `layout-e-hero`, que ficaram fora do relatório
  arquivado. A Q9 da `layout-e-hero` foi decidida (a), e o texto literal está transcrito na seção
  "Decisões do Gabriel no Portão 1" do `relatorio.md`.

### D12 — Pendências da `layout-e-hero`

| Pendência | Como |
| --- | --- |
| Nome acessível da marca | Sem `aria-label`: o nome vem do texto visível, com ", página inicial" num trecho só para leitor de tela. Acima de 1024 px o nome inclui o nome longo, porque ele está visível |
| Página atual no rodapé | Os links das colunas usam o `LinkDaNavegacao`, que já marca `aria-current`, com sublinhado no CSS do rodapé |
| `páginas medidas` | D9 |
| Total de larguras do menu | O teste imprime `menu lateral testado em N de 7 larguras` |
| README | Na seção "Como acrescentar uma página ao menu": a página mora em `src/app/(site)/(publicas)/<endereço>/`, e o exemplo do JSON ganha `titulo` e `descricao`. **Achado meu:** a tabela do interruptor ainda diz que a raiz publicada mostra "A página em construção, até a página inicial nova ficar pronta", o que é falso desde a `layout-e-hero`. A linha é corrigida na mesma tarefa |
| `usePainelDeNavegacao.ts` | Renomeado para `use-painel-de-navegacao.ts` (`PADROES` §6), com os imports |
| `--font-size-h6` no botão de destaque do celular | O dev mede o tamanho do botão do cabeçalho no protótipo em 390 px. Se for 13 px, cria um token novo de controle no celular, com a origem. Se não, usa `--font-size-controle`. O token de título não é reaproveitado em controle |

### D13 — Escopo nominal

| Quem | Arquivos |
| --- | --- |
| `dev-frontend` | `src/app/(site)/(publicas)/processo-seletivo/`; as `page.tsx` de `(publicas)` (só os metadados); `src/features/processo-seletivo/`; `src/lib/utils/paginas-publicas.{json,ts,test.ts}` e `metadados.{ts,test.ts}`; `src/componentes/ui/Botao*` e o arquivo novo de aparência de botão; `src/componentes/layout/` (apagar os dois arquivos de aparência, cabeçalho, menu, rodapé, o hook renomeado); `src/app/(site)/(publicas)/_inicio/HeroDaInicial.tsx` (só o import); `src/app/(interno)/vitrine/` só se a vitrine quebrar; `src/estilos/tokens.css` só com linhas acrescentadas; `scripts/medir-desempenho.mjs`; `README.md` (D12 e D11) |
| `qa-acessibilidade` | `tests/e2e/` (spec novo da página, `paginas-publicas`, `menu-por-teclado`, `pagina-inicial`). `interruptor.spec.ts` e `playwright.config.ts` não mudam |
| `guardiao-visual` | `openspec/changes/pagina-processo-seletivo/prints/` |
| Líder técnico | `docs/PADROES-DE-CODIGO.md` (§9, §10 e §11); `docs/SEGURANCA.md` (§5: forma nova, lacuna do host e formas de busca; §3: a superfície nova; §7: os prints da change); `.env.example` (uma linha, o nome sem valor); `docs/REFERENCIA-VISUAL.md` §7 (os títulos da Q3 (a), já feito no Portão 1) |
| `especificador` | Além de `openspec/changes/pagina-processo-seletivo/`, no `docs/conteudo-institucional.md`, sempre com autorização expressa do Gabriel: no Portão 1, uma inserção no §5.1, o aviso da Q1 (b); no Portão 2, a troca do §5.5 pelas cinco etapas, a subseção "Texto da página" no §5.3 e no §5.4, acima do texto do edital, e uma linha no §8; na correção do item 2, a "Texto da página" do §5.3 com a lista de quatro itens, e a do §5.4 trocada por uma remissão a ela |

Não mudam: `src/proxy.ts`, `src/app/layout.tsx` (Q5 (a)), `src/app/(site)/em-construcao/`,
`PaginaEmConstrucao*`, `Rodape*`, `LinksDeContato*`, `lighthouserc.json`, `playwright.config.ts`,
`.github/`, `package.json`, `package-lock.json`. Arquivo fora destas listas é desvio, e vai nomeado
na entrega.

### Fontes do texto que vai ao ar

| Texto | Fonte |
| --- | --- |
| Apresentação | `conteudo-institucional.md` §5.2 |
| Quem pode se inscrever (os quatro itens) | §5.3, subseção "Texto da página" (decisão do Gabriel, 21/11/2026, Portão 2, com a correção do item 2); o §5.4 remete a ela. O item 3 vem do Edital, item 2.2, e não do protótipo. O texto do edital fica abaixo, como fonte, e não vai ao ar |
| Etapas | §5.5, cinco itens (decisão do Gabriel, 21/11/2026, Portão 2), no lugar das duas do edital, item 4.2 |
| Perguntas e respostas | §6, sem as notas de fonte (Q4 (a)) |
| Selo "Inscrições fechadas" | Briefing do gestor, apoiado no §5.1 ("as inscrições estão fechadas") |
| Aviso de inscrições fechadas | §5.1, inserido pelo `especificador` no Portão 1 com autorização do Gabriel (Q1 (b), "decisão do Gabriel em 21/11, Q1 da pagina-processo-seletivo") |
| Títulos e sobretítulos das seções | Protótipo, com "Cronograma" trocado por "Etapas" (Q3 (a)); registrados na `REFERENCIA-VISUAL.md` §7 pelo líder técnico no Portão 1 |
| Título "Processo seletivo" | §5 e protótipo, sem o semestre |
| Títulos e descrições de SEO | Q6 (a): os títulos do formato da regra; as descrições são a primeira frase do §2.0 e a do §5.2 |
| Nomes acessíveis (link do aviso, marca) | Rótulos de interface, registrados no relatório pelo dev, sem texto institucional novo |

## Risks / Trade-offs

| Risco | Mitigação |
| --- | --- |
| A auditoria `canonical` do Lighthouse falhar porque mede um canonical em `liacup.com.br` com a página servida em `localhost` | O dev olha a auditoria na primeira medição. Se ela falhar por esse motivo, o dev para, e o líder técnico traz o caso ao Gabriel como Qn nova. A auditoria não se desliga e o limiar não se baixa sem decisão do Gabriel |
| A página em construção mudar no `<head>` sem ninguém ver | Q5 (a), a raiz intacta; os metadados do `<head>` da 3001 antes e depois (D10); os prints contra os `depois-raiz-nao-publicada-*` arquivados da `layout-e-hero`, que são o estado atual da produção |
| O segredo de bypass vazar | D11: nunca é argumento, nunca é impresso, a busca devolve só contagem, e o host é conferido letra por letra antes (Q8 (b)) |
| `<details>` com anúncio de estado diferente entre leitores de tela | O qa mede o estado no Chromium. Leitor de tela real fica sem cobertura, e isso é declarado. A alternativa do D6 está pronta |
| 15 tarefas sem folga | A divisão está na proposta: o item 7 inteiro sai para a `pagina-sobre-e-equipe` |
| A descrição de 155 caracteres do Processo seletivo ficar perto do limite | O teste mede. Se o §5.2 mudar e a frase passar de 160, o teste fica vermelho e pede decisão |
| O aviso prometer o que a liga não faz | Q1 (b): o aviso convida a acompanhar a liga, sem afirmar onde o edital sai |

## Open Questions

Uma aberta: a Q15, adiada pelo Gabriel no Portão 2. As oito do Portão 1 foram decididas pelo
Gabriel em 21/11/2026; o texto literal está no `relatorio.md`, seção "Decisões do Gabriel no Portão
1", transcrito pelo líder técnico. As opções ficam abaixo como registro. As do Portão 2 estão em
"Q10 a Q16", logo depois da tabela. Na origem, toda opção de texto que não vinha do
`conteudo-institucional.md` estava marcada **(fora do documento)**. Os caracteres foram contados à
mão pelo especificador, e o teste da tarefa 2.2 confere.

| Qn | Decisão |
| --- | --- |
| Q1 | (b) · Gabriel, 21/11/2026, Portão 1 |
| Q2 | (a) · Gabriel, 21/11/2026, Portão 1 |
| Q3 | (a) · Gabriel, 21/11/2026, Portão 1 |
| Q4 | (a) · Gabriel, 21/11/2026, Portão 1 |
| Q5 | (a) · Gabriel, 21/11/2026, Portão 1 |
| Q6 | (a) no título e (a) nas descrições · Gabriel, 21/11/2026, Portão 1 |
| Q7 | (a) · Gabriel, 21/11/2026, Portão 1 |
| Q8 | (b), time `liacup1` · Gabriel, 21/11/2026, Portão 1 |

### Q10 a Q16 — Portão 2, primeira passagem

Decididas pelo Gabriel em 21/11/2026, no Portão 2, antes do archive, menos a Q15, **adiada**. O
texto literal está no `relatorio.md`, seção "Decisões do Gabriel no Portão 2 (primeira passagem,
antes do archive)". As opções escolhidas, como o líder técnico as levou na entrega do Portão 2,
estão na terceira coluna; as não escolhidas eram: Q10 (b) manter a letra 0 e declarar não
verificado fora do Chromium; Q11 (b) aceitar os meios degraus; Q12 (b) unificar o comportamento
agora; Q13 (a) desvio para a próxima change que mexer na vitrine; Q14 (b) pôr o selo no
`conteudo-institucional.md` §5.1; Q16 (a) nenhuma melhoria agora e (c) o botão de 12,5 px e um
destaque próprio para o aviso.

| Qn | Assunto | Decisão e opção escolhida |
| --- | --- | --- |
| Q10 | Achado 3 do `revisor`, rodada 2: o trecho ", página inicial" escondido com letra de tamanho 0 | (a) · voltar à caixa de 1 px (técnica C7), sem o espaço antes da vírgula · Gabriel, 21/11/2026, Portão 2 |
| Q11 | Achado 4 do `revisor`, rodada 2: meios degraus da escala nos CSS das etapas e do quadro (RP-02) | (a) · trocar por degrau, soma de degraus ou token novo com origem · Gabriel, 21/11/2026, Portão 2 |
| Q12 | Achado 6 do `revisor`, rodada 2: lista vazia, que some a seção em duas composições e a mantém numa | (a) · declarar: o vazio é impossível hoje (dado estático, o teste de unidade exige as contagens); carregando, erro e vazio chegam na R3, com o banco · sem código · Gabriel, 21/11/2026, Portão 2 |
| Q13 | Achado 1 do `revisor`, rodada 2: a vitrine sem o link com aparência de botão (D7 contra D13) | (b) · acrescentar o link à vitrine na rodada da Q10 · Gabriel, 21/11/2026, Portão 2 |
| Q14 | Achado 2 do `revisor`, rodada 2: o selo "Inscrições fechadas" sem registro | (a) · registrar na `REFERENCIA-VISUAL.md` §7 como rótulo de interface · Gabriel, 21/11/2026, Portão 2; feito pelo líder técnico |
| Q15 | F-05 do `guardiao-appsec`, rodada 2: a linha dos prints na `SEGURANCA.md` §7 | **Adiada** · Gabriel, 21/11/2026: os prints mudam com o conteúdo novo, e a questão volta ao Portão 2 depois da rodada |
| Q16 | Melhorias propostas pelo `dev-frontend` na rodada 1 | (b) · só o botão de destaque com 12,5 px até 480 px, como o `.hdr-cta` do gabarito, com token novo · Gabriel, 21/11/2026, Portão 2 |

A Q10, a Q11 e a Q12 pedem código e entram na terceira rodada do `dev-frontend`, autorizada pelo
Gabriel "só com o que está aqui". Se sobrar diferença depois dela, vira Qn nova, sem quarta
rodada.

### Q1 — O texto do aviso de inscrições fechadas

**Decidida: (b) · Gabriel, 21/11/2026, Portão 1.** O texto entrou no `conteudo-institucional.md`
§5.1, inserido pelo `especificador` com autorização do Gabriel, com a origem "decisão do Gabriel em
21/11, Q1 da pagina-processo-seletivo".

O §5.1 pede "um aviso de que as inscrições estão fechadas e um convite para acompanhar o
Instagram", mas não traz o texto.

- **(a)**, a sugestão do gestor **(fora do documento)**: "As inscrições estão fechadas. O próximo
  edital é divulgado no Instagram da Liga, @liacup.unb." Custo: afirma onde o edital sai, e nenhuma
  fonte diz isso (o edital, item 7.4, só diz que o **resultado** sai nas redes sociais). Se a liga
  divulgar o próximo edital por outro canal, o site promete o que não acontece.
- **(b)** **(fora do documento)**: "As inscrições estão fechadas. Acompanhe a Liga no Instagram
  @liacup.unb para saber quando abre o próximo processo seletivo." Custo: é a mais longa, com cerca
  de 3 linhas em 390 px. Usa a expressão "acompanhe a Liga no Instagram @liacup.unb" do §2.0, que
  ainda é proposta do gestor a validar pela liga, e não afirma canal oficial.
- **(c)** **(fora do documento)**: "As inscrições estão fechadas no momento. Acompanhe a Liga no
  Instagram @liacup.unb." Custo: é a mais curta, e não diz para que acompanhar.
- A opção escolhida entra no `conteudo-institucional.md` §5.1, e o teste lê de lá.
- **Recomendo (b)**, porque convida sem afirmar um fato que nenhuma fonte confirma.

### Q2 — O estado "inscrições abertas", agora ou depois

**Decidida: (a) · Gabriel, 21/11/2026, Portão 1.** O estado aberto fica fora de escopo.

- **(a)** Não fazer. O tipo do conteúdo prevê o estado como união, hoje só com `'fechado'`. Custo:
  se um edital abrir antes da R3, é preciso uma change curta, estimada em 5 a 7 tarefas (dados do
  edital, cronograma, "Fazer inscrição", link do edital, testes, lado a lado). E o endereço do
  edital (PDF) não está no `conteudo-institucional.md`: o §5.1 diz "Link para o PDF", sem endereço.
- **(b)** Fazer agora: selo, cronograma, "Fazer inscrição" para o formulário do §5.8 em nova aba e
  link do edital, ligados pelo arquivo de dados. Custo:
  - **mais 3 tarefas**: os componentes e os dados do estado aberto; o e2e dele, que precisa de um
    jeito de mostrar o estado aberto sem publicá-lo; e o lado a lado do estado aberto. São 18, então
    o item 7 (SEO) sai inteiro e fica 15, sem folga;
  - o link do edital fica pendente;
  - não há cronograma vigente para pôr no ar, e o do Edital 02/2026 não pode ir como exemplo;
  - o código fica sem uso em produção, testado só por dado de teste.
- **(c)** Só o tipo do estado aberto, sem tela. Custo: código que nenhuma verificação vê falhar
  (RP-12).
- **Recomendo (a)**, porque falta o dado (edital e cronograma vigentes), e uma change curta quando
  o edital existir sai mais barata que código sem uso.

### Q3 — Os títulos de seção e os sobretítulos

**Decidida: (a) · Gabriel, 21/11/2026, Portão 1.** O registro na `REFERENCIA-VISUAL.md` §7 foi
feito pelo líder técnico no Portão 1.

O protótipo tem os sobretítulos "CRONOGRAMA", "REQUISITOS" e "FAQ" e os títulos "Como funciona",
"Quem pode se inscrever" e "Perguntas que sempre chegam". O documento tem as seções "Etapas", "Quem
pode se inscrever", "Pré-requisitos" e "Perguntas frequentes". A `REFERENCIA-VISUAL.md` §6 diz que o
texto do protótipo desta página era exemplo, mas lista só datas, etapas e o selo.

- **(a)** Os títulos do protótipo, e os sobretítulos do protótipo com "Cronograma" trocado por
  "Etapas" (§5.5), porque a coluna não tem datas. Custo: "Como funciona" e "Perguntas que sempre
  chegam" ficam como rótulos de interface do protótipo, fora do `conteudo-institucional.md`. É
  preciso registrá-los numa linha da `REFERENCIA-VISUAL.md` §7.
- **(b)** Tudo do documento: os títulos "Etapas", "Quem pode se inscrever" e "Perguntas
  frequentes", sem sobretítulos. Custo: os sobretítulos são parte da composição. Sem eles, e com os
  títulos trocados, ficam duas a três diferenças a registrar contra o gabarito.
- **(c)** O protótipo inteiro, com "Cronograma". Custo: o sobretítulo anuncia um cronograma que a
  página não mostra.
- **Recomendo (a)**, porque mantém a composição e só tira o rótulo que ficaria falso.

### Q4 — As notas de fonte nas respostas do §6

**Decidida: (a) · Gabriel, 21/11/2026, Portão 1.**

Sete das oito respostas terminam com uma nota em itálico, como "_(Edital, 1.1 e 2.1)_", "_(Edital,
2.2 — decisão D1)_" e "_(decisão D6)_".

- **(a)** Não vão ao ar. São anotação do documento, e duas citam decisões internas (D1 e D6). Custo:
  a regra "palavra por palavra" ganha uma exceção escrita: o teste tira a nota em itálico entre
  parênteses do fim da resposta antes de comparar.
- **(b)** Vão ao ar inteiras. Custo: o visitante lê "decisão D1" e "decisão D6", que não querem
  dizer nada fora da liga.
- **(c)** Vão só as referências ao edital e ao estatuto, sem "decisão Dn". Custo: é edição do
  texto, que o princípio 5 só permite com emenda.
- **Recomendo (a)**, porque a nota diz de onde veio a resposta e não faz parte dela.

### Q5 — Os metadados da raiz e a página em construção

**Decidida: (a) · Gabriel, 21/11/2026, Portão 1.**

A página em construção herda os metadados do layout raiz, e o critério de aceite exige que ela
continue idêntica.

- **(a)** A raiz fica intacta. `montarMetadados` põe `metadataBase`, canonical e Open Graph só nas
  páginas da lista. Custo: a produção continua com "Portal LIACUP" e com uma descrição que não está
  no `conteudo-institucional.md` até a `lancamento-r1`. "Partir da raiz" passa a querer dizer não
  repetir o que ela já dá.
- **(b)** `metadataBase` na raiz. Custo: toca o arquivo que a produção usa. Sozinho, ele não gera
  tag, mas qualquer metadado relativo que entrar depois na raiz muda a produção, e a conferência do
  `<head>` passa a ser obrigatória a cada change.
- **(c)** Trocar a descrição da raiz por texto do documento. Custo: muda a produção, contra o
  critério de aceite. Só com decisão nova.
- **Recomendo (a)**, porque a produção não muda e a `lancamento-r1` acerta a raiz quando desligar a
  página em construção.

### Q6 — Título e descrição da Início e do Processo seletivo

**Decidida: título (a) e descrições (a) · Gabriel, 21/11/2026, Portão 1.**

O Processo seletivo não tem questão no título: "Processo seletivo · LIACUP", com 26 caracteres. As
questões são duas.

**Título da Início** ("a Início usa o nome da liga por extenso"):

- **(a)** "Liga Acadêmica Multiprofissional de Cuidados Paliativos · LIACUP", 64 caracteres. Segue o
  formato `<Nome> · LIACUP` ao pé da letra.
- **(b)** "LIACUP · Liga Acadêmica Multiprofissional de Cuidados Paliativos", 64 caracteres. A sigla
  aparece primeiro no resultado da busca, onde o título acima de cerca de 60 caracteres é cortado.
  Foge do formato.

**Descrições.** Nenhum parágrafo inteiro cabe em 160: o do §2.0 tem 191 e o do §5.2 tem 258.

- **(a)** A primeira frase de cada um, inteira e sem mudança. Início, do §2.0: "A LIACUP reúne
  estudantes de diversas áreas do conhecimento em torno do ensino, da pesquisa e da extensão em
  cuidados paliativos.", com **129** caracteres. Processo seletivo, do §5.2: "A LIACUP seleciona
  novos ligantes por meio de processo seletivo, aberto a estudantes de graduação da Universidade de
  Brasília a partir do segundo semestre.", com **155**. Custo: é um trecho, e não o parágrafo; quem
  ler o princípio 5 ("nada é resumido") ao pé da letra pode ver corte.
- **(b)** Para a Início, **(fora do documento)**, composta dos campos do §1: "Liga Acadêmica
  Multiprofissional de Cuidados Paliativos da Universidade de Brasília.", com **84** caracteres.
  Para o Processo seletivo, a mesma frase de (a). Custo: a da Início não é trecho literal.
- **Recomendo título (a) e descrições (a)**, porque seguem o formato da regra e usam frases
  aprovadas inteiras.

### Q7 — SEO no modo não publicado

**Decidida: (a) · Gabriel, 21/11/2026, Portão 1.**

- **(a)** O mínimo de 95 vale só no modo publicado. O não publicado imprime a nota sem reprovar.
  Custo: a página que a produção mostra fica sem mínimo de SEO até a `lancamento-r1`, mas o número
  fica visível no CI.
- **(b)** O mínimo vale nos dois modos. Custo: a página em construção pode ficar abaixo de 95. Por
  exemplo, no não publicado o `/robots.txt` leva 307 para a raiz, e o Lighthouse lê HTML no lugar
  dele. Corrigir exigiria mexer na produção, fora do escopo, e a change travaria.
- **Recomendo (a)**, porque mede sem prender a change a uma página que ela não pode mudar.

### Q8 — O host da prévia no pedido com o segredo

**Decidida: (b) · Gabriel, 21/11/2026, Portão 1.** O identificador do time é `liacup1`, e o host
desta change é `portal-liacup-git-feat-pagina-processo-seletivo-liacup1.vercel.app` (D11).

Hoje a lacuna aceita o host da prévia que "começa com `portal-liacup-`", tirado do painel da Vercel.
Com o segredo no pedido, um host parecido, como um projeto `portal-liacup-x` de outra conta,
receberia o segredo.

- **(a)** Manter a regra atual. Custo: a única barreira é o líder técnico copiar o host certo do
  painel. Um engano manda o segredo para fora.
- **(b)** Exigir o endereço de branch da Vercel, exato:
  `portal-liacup-git-<branch>-<time>.vercel.app`. O `<time>` fica escrito no `SEGURANCA.md`, e o
  `<branch>` é o nome da branch em minúsculas, com `/` trocado por `-`. Custo: o Gabriel informa o
  identificador do time uma vez. Branch de nome muito longo, que a Vercel encurta, não casa e é
  recusada (falha fechada).
- **(c)** O Gabriel cola o host exato na resposta do Portão 2 de cada change. Custo: um passo manual
  a mais por change, e o host vem de mensagem, não do painel.
- **Recomendo (b)**, porque o host fica conferível letra por letra, e o erro recusa em vez de vazar.
