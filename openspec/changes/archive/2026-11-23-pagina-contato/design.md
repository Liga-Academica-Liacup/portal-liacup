# Design — página Contato

## Context

Ver `proposal.md`, seção Why. Estado lido na `main` `c12cf9b` pelo especificador:

| O que | Situação |
| --- | --- |
| Lista única | `src/lib/utils/paginas-publicas.json` com 5 entradas: `/`, `/sobre`, `/processo-seletivo` (fora do menu, destaque), `/projetos` e `/equipe` (coluna "Conteúdo") |
| Teste da lista | `paginas-publicas.test.ts` confere títulos, o menu, a coluna "Conteúdo" e cada descrição como trecho literal do documento; as de Projetos e Equipe são a primeira citação (`> `) das seções "## 3." e "## 4." |
| Rodapé | `RodapePublico.tsx` já tem Instagram (`liacup.unb`, sem @), e-mail e o endereço curto, com ícone e rótulo acessível decididos. Não muda |
| Página em construção | `LinksDeContato.tsx` traz Instagram e e-mail. Não muda até a `lancamento-r1` |
| Marcador do rodapé | `IconeDeLocalizacao.tsx`, em `componentes/layout`; o comentário diz que vira variante do `ui/Icone` "quando a página Contato precisar dele" |
| Imagens | Logo em `public/logo-liacup-256.png`; ícone do Gmail só em `assets/icone-email-gmail.png` (512 × 512) |
| Componentes de base reaproveitáveis | `ui/BorboletaDaLiga` (decorativa), `padroes/QuadroSemFoto`, `padroes/TituloDeSecao` (`h2`, não serve para o topo da página) |
| §1 do documento | Tabela de identidade: "Sede" com travessão (`FCTS — Campus UnB Ceilândia, …`), "E-mail" `` `liacup.unb@gmail.com` ``, "Instagram" `` **`@liacup.unb`** — confirmado ``. Nenhuma citação (`> `) na seção hoje |
| Gabarito | `contato-{390,1280}`: sem faixa própria, o topo da página no fundo creme; sobretítulo "CONTATO", `h1` "Fale com a Liga", a frase; três itens com círculo de 100 px à esquerda e, à direita, rótulo em maiúsculas pequenas, valor e legenda; no 3º, círculo lilás claro com borboleta. Em 1280, duas colunas, o formulário à direita; em 390, o formulário abaixo. `menu-aberto-390`: Contato é o último, antes do botão "Processo seletivo". No rodapé, o último da coluna "Conteúdo" |
| Inicial do protótipo | "Onde a Liga responde" mostra só Instagram e e-mail, cada um num quadro de superfície mais clara. É da `inicio-completo` |

## Goals / Non-Goals

**Goals:**

- A página sai da lista e dos dados; nenhum componente da página guarda texto institucional.
- Um bloco de contato só, que a inicial vai usar com dois dos três quadros.
- Nada inventado, nenhum dado errado do protótipo, nenhum serviço de terceiros.
- A produção continua igual.

**Non-Goals:** ver "Fora de escopo" da proposta.

## Decisions

### D1 — Onde cada parte mora

- **Rota** em `src/app/(site)/(publicas)/contato/`. Só compõe o topo e o bloco, e é dona da grade de
  duas colunas da Q3 (b) (D4).
- **Domínio** em `src/features/contato/`, com `tipos.ts`, `conteudo.ts` (o sobretítulo e o título),
  `conteudo.test.ts` e `componentes/TopoDoContato` (sobretítulo em parágrafo e `h1`). É a feature
  onde o formulário da R4 vai morar. O topo não importa a faixa da Equipe nem a de Projetos (uma
  feature não importa de outra); a dívida das faixas iguais, registrada na `pagina-projetos`, ganha
  um terceiro caso se o dev ler no protótipo os mesmos tokens.
- **O bloco de contato** em `src/componentes/padroes/`, pela tabela de camadas do
  `PADROES-DE-CODIGO.md` §1: importa só de `ui` e `lib/utils`, não conhece rota, banco nem feature.
  Não fica em `features/contato`, porque a inicial, se um dia virar feature, não poderia importá-lo;
  e não fica em `layout`, porque não é moldura. Forma, por composição (§2.4):
  - um **quadro de contato** genérico: a figura à esquerda (recebida como filho), o rótulo, o valor
    e, se houver destino, o quadro inteiro como link (`variante` `'externo' | 'email' | 'texto'`,
    nunca booleanas);
  - três quadros prontos, com os dados da liga: **Instagram**, **E-mail** e **Onde estamos**;
  - uma **lista** que os agrupa, com papel de lista explícito.
  A página usa a lista com os três; a inicial vai usar a lista com Instagram e E-mail, sem copiar
  nada. Os dados (endereço do Instagram, @, e-mail e sede) ficam escritos num lugar só, num arquivo
  de dados ao lado do bloco. O dev escolhe os nomes; cada arquivo com até 150 linhas.
- **O rodapé não passa a usar esses dados** nesta change: mexer nele traz o rodapé ao lado a lado e
  ao diff. Fica como dívida, com o nome: os dados de contato escritos no bloco, no rodapé e na
  página em construção.
- **"Onde estamos" usa a borboleta** (`ui/BorboletaDaLiga`), como o protótipo, e não o marcador de
  localização. O `IconeDeLocalizacao` fica como está, em `layout`: a página não precisa dele, e
  movê-lo para o `ui/Icone` traria o rodapé e a camada `ui` ao diff. A `REFERENCIA-VISUAL.md` §5
  manda tirar a borboleta só do Instagram e do e-mail.
- **O ícone do Gmail vai para `public/icone-email-gmail.png`**, cópia idêntica de `assets/` (mesmo
  sha256), como a logo e os ícones da aba já foram. Alternativa considerada: importar a imagem de
  `assets/` pelo código, sem binário novo rastreado. Descartada: o caminho de `src/` para `assets/`
  não está na tabela de camadas, e o precedente do projeto é a cópia em `public/`. O custo da cópia é
  uma linha no `docs/SEGURANCA.md` §7, no mesmo diff, que já entra pelos prints (D7).

### D2 — Que spec muda, e qual não muda

- `pagina-contato`: nova, cinco requisitos.
- `navegacao-publica`: MODIFIED do requisito da lista (corpo do cenário "O que a lista mostra nesta
  entrega", como a `pagina-projetos` previu, sem REMOVED), do rodapé (cenário "Coluna sem página não
  aparece") e da medição (`6 nesta entrega`).
- `seo`: MODIFIED do cenário "Os títulos e as descrições desta entrega".
- **Não mudam:** `publicacao-do-site` (precedente da Q4 (a) da `pagina-projetos`: o requisito do
  interruptor fica na spec nova e o e2e da página o prova, sem tocar `tests/e2e/interruptor.spec.ts`);
  `pagina-inicial`; `fundacao-e-ci`.

### D3 — A lista

- Entrada nova, **depois de `/equipe`**: `/contato`, rótulo "Contato", `noMenu` `true`,
  `colunaDoRodape` "Conteúdo", `destaque` `false`. Menu: Início, Sobre, Projetos, Equipe, Contato.
  Coluna "Conteúdo": Projetos, Equipe, Contato.
- Título pelo `tituloEsperado`: "Contato · LIACUP" (16 caracteres).
- Descrição pela Q4. Com a (a), a frase fica no §1 na forma da do §3 e do §4: a linha
  "**Descrição da página Contato para buscadores** _(decisão do Gabriel, <data>, Q4 da
  pagina-contato)_:" e a frase como citação, **logo abaixo do título "## 1."**, antes da tabela, para
  ser a primeira citação da seção, que é o que o teste da lista lê. Com a Q1 (a), nenhuma frase da
  faixa entra no §1. O texto pronto está no `relatorio.md`, "Texto proposto para a tarefa 1.2".

### D4 — A composição de `/contato`

Do protótipo vale a composição, com a mudança da Q3 (b) abaixo; o texto vem dos dados (D5).

- **Topo:** sobretítulo "Contato" em parágrafo e `h1` "Fale com a Liga", no fundo da página, como o
  gabarito (sem faixa de outra cor). Com a Q1 (a), sem frase.
- **Os três quadros**, numa lista de três itens, na ordem Instagram, E-mail, Onde estamos. Cada um:
  círculo de 100 px à esquerda (medida do gabarito; o dev lê no CSS e registra) e, à direita, o
  rótulo e o valor. Sem a legenda de baixo. O rótulo não é título: a página tem um `h1` só, e a
  lista se anuncia com três itens; assim o bloco serve na inicial, debaixo de outro `h2`, sem mudar
  de nível.
  - **Instagram:** a logo da liga no círculo, decorativa (`alt=""`); valor `@liacup.unb`, com o @
    (`REFERENCIA-VISUAL.md` §7, "o endereço e o @ continuam escritos no quadro"; o "sem @" da §7 é
    da coluna do rodapé). O quadro inteiro é um link para `https://www.instagram.com/liacup.unb/`,
    em nova aba, sem dar à página aberta acesso à de origem nem o endereço de origem.
  - **E-mail:** o ícone do Gmail no círculo, decorativo; valor `liacup.unb@gmail.com`; o quadro
    inteiro é um link `mailto:liacup.unb@gmail.com`, na mesma aba.
  - **Onde estamos:** o círculo lilás claro com a borboleta, decorativa; valor pela Q2; texto, e não
    link.
  - **Nome acessível** dos dois links: começa pelo texto visível do quadro, na ordem (rótulo e
    valor), e o do Instagram termina dizendo que abre em nova aba. Sem nome acessível que esconda o
    texto visível.
  - **Estados (ADR-0006):** repouso, hover, pressionado e `focus-visible` nos dois quadros
    clicáveis, com os tokens dos links que já existem; o foco contorna o quadro inteiro. O quadro de
    texto não tem estado.
- **A composição, Q3 (b): melhoria aprovada pelo Gabriel sobre o protótipo** (Portão 1, 23/11/2026,
  literal no `relatorio.md`). Esboço aprovado: `prints/q3-opcao-b-1280.png`; em 390,
  `prints/q3-opcao-b-390.png`, igual ao das outras opções.
  - **Até 1024 px, inclusive:** uma coluna, o topo e, abaixo dele, a lista dos três quadros. É o
    gabarito de 390 sem a frase e sem o formulário.
  - **Acima de 1024 px:** duas colunas. Sobretítulo e título na da esquerda; a lista dos três
    quadros na da direita, onde o protótipo põe o formulário, alinhada ao topo do título (as duas
    colunas começam na mesma altura). Com a Q1 (a), a coluna da esquerda fica com duas linhas.
  - **O corte** é o da grade `data-resp` da seção Contato do protótipo, que passa a uma coluna em
    `@media (max-width: 1024px)` (lido pelo especificador por busca de texto no
    `prototipo/Portal-LIACUP.html`), e é um dos cortes permitidos (`PADROES-DE-CODIGO.md` §3). As
    proporções das duas colunas, o espaço entre elas e a largura máxima da seção, o dev lê no CSS
    dessa mesma grade e registra no relatório, com os tokens que usou; nenhum valor solto.
  - **A ordem no código é a de leitura:** o topo, depois a lista. A grade só posiciona; não
    reordena, e o foco segue a mesma ordem em toda largura.
  - **A grade é da rota, não do bloco** (D1). O bloco de contato não sabe em que coluna está nem
    quantas colunas a página tem: a `inicio-completo` reaproveita a lista de quadros sem herdar a
    grade.
  - **No lado a lado**, o `guardiao-visual` classifica a posição dos quadros acima de 1024 px e a
    ausência do formulário como "melhoria aprovada pelo Gabriel (Q3 (b))", e não como defeito nem
    como melhoria a aprovar.
  - **Na R4, o formulário traz de volta a composição do protótipo:** a lista volta para a coluna da
    esquerda, abaixo do título, e o formulário ocupa a da direita, com lado a lado novo. A mudança é
    na rota; o bloco não muda. A regra fica na `REFERENCIA-VISUAL.md` §7 (tarefa 1.2).
- **Contraste (RP-09):** o dev mede o rótulo (maiúsculas pequenas, cinza no protótipo), o valor e o
  sobretítulo contra o fundo, nomeia o par e registra. Mínimo de 4,5:1; o rótulo cinza do protótipo,
  se não passar, usa `--color-neutral-700` (`REFERENCIA-VISUAL.md` §3, texto secundário).
- **Nada de terceiros:** nenhum mapa, nenhuma imagem de fora, nenhum pedido a domínio externo ao
  abrir a página (a medição da lista já confere).

### D5 — Os dados

- `features/contato/conteudo.ts`: o sobretítulo e o título. O teste de unidade confere os dois não
  vazios e imprime `contato · topo: 2 rótulos`.
- O arquivo de dados do bloco (D1): endereço do Instagram, @, e-mail e sede. O teste de unidade do
  bloco renderiza a lista com os três quadros e com só Instagram e E-mail (a composição da
  inicial), e imprime `quadros: 3` e `quadros na composição da inicial: 2`; confere `href`,
  `target` e `rel` dos dois links e que nenhum texto tem "—", `liacup@unb.br`, "Darcy Ribeiro" ou
  "Faculdade de Medicina".
- **O texto contra o documento é conferido de ponta a ponta** (D6), lendo o
  `conteudo-institucional.md` e a `REFERENCIA-VISUAL.md` §7, como em Projetos.
- Carregando, erro e vazio: dado estático, o vazio é impossível hoje (o teste exige a contagem).

### D6 — Verificações e RP-12

O `qa-acessibilidade` escreve, lendo o documento, a `REFERENCIA-VISUAL.md` §7 e o protótipo, sem
copiar texto:

1. **Spec de `/contato`**, nas 7 larguras, publicado:
   - do §1, lidos da tabela: o @ da célula "Instagram" (o trecho entre crases, sem `**` e sem
     " — confirmado"); o e-mail da célula "E-mail", sem crases; a sede da célula "Sede", com " — "
     trocado por " · ", contando as trocas (exige 1 e imprime `travessões trocados: 1`), pela Q2
     (b). Conferidos palavra por palavra, com a sobra de texto fora do documento e dos rótulos;
   - os rótulos (sobretítulo, título, "Instagram", "E-mail", "Onde estamos"), da linha nova da §7;
   - ausentes do texto visível: `liacup@unb.br`, "Faculdade de Medicina", "Darcy Ribeiro",
     "Perfil do Instagram", "Logo do e-mail", "Foto de perfil", "Reuniões", "Imprensa", o
     travessão, a frase do protótipo (com a Q1 (a)) e os textos do formulário, lidos do protótipo
     ("Mande uma mensagem", "Enviar mensagem" e os rótulos dos campos); nenhum campo de formulário;
   - os links: o do Instagram com o destino, nova aba e `rel` sem acesso nem origem; o do e-mail com
     `mailto:`; um ponto perto do canto de cada quadro, longe do texto, pertence ao link (sem abrir o
     Instagram de verdade); o nome acessível começa pelo texto visível; o quadro "Onde estamos" não
     é link; as imagens decorativas, fora do leitor de tela;
   - um `h1`, nenhum `h2` no conteúdo, a lista anunciada com 3 itens; alvo de cada quadro clicável
     ≥ 44 × 44 px; foco visível nos dois;
   - a composição da Q3 (b): de 360 a 1024, a lista inteira abaixo do título; em 1280, a lista
     inteira à direita do título e o topo dela na altura do topo da coluna do título, com a
     diferença impressa em px; a ordem de foco, topo e depois Instagram e E-mail, igual nas 7
     larguras. Imprime `composição: 6 larguras em uma coluna, 1 em duas`;
   - axe 0 e nenhuma rolagem horizontal;
   - **o interruptor:** `/contato` sem seguir redirecionamento dá 307 com destino `/` no não
     publicado e, seguido, chega à página em construção; no publicado, 200 sem `Location`. Imprime
     `contato no interruptor: 2 de 2 modos`.
2. **Ajustes:** a constante da entrega do `paginas-publicas.spec.ts` (seis endereços, menu e
   colunas). `páginas verificadas: 6 de 6` sai sozinho da lista.
3. **Não mudam:** `interruptor.spec.ts` (`rotas verificadas: 4`), `playwright.config.ts`.

Demonstrações de falha, cada uma com a saída vermelha e a verde no relatório:

| # | Violação temporária | Vermelho esperado |
| --- | --- | --- |
| 1 | Uma letra trocada no e-mail nos dados do bloco | e2e: o trecho, o esperado e o recebido |
| 2 | A sede com " — " no lugar de " · " | unidade: o termo; e2e: o trecho e o travessão |
| 3 | `liacup@unb.br` acrescentado a um valor | unidade e e2e: o termo e onde |
| 4 | O link do Instagram sem nova aba | e2e: o link e o atributo recebido |
| 5 | O link do Instagram sem `noreferrer` | e2e: o link e o `rel` recebido |
| 6 | O link só no texto do valor, e não no quadro inteiro | e2e: o quadro e o ponto fora do link |
| 7 | Descrição de Contato com 161 caracteres | unidade: o endereço e "161" |
| 8 | `/contato` antes de `/equipe` na lista | unidade: o menu esperado e o recebido |
| 9 | A lista dos quadros sem o papel de lista | e2e das listas anunciadas: a página e a lista |
| 10 | A conferência do 307 apontada, no próprio teste, para o servidor publicado | e2e: "200 sem Location (esperado 307 para /)" |
| 11 | A grade da rota com uma coluna só em toda largura | e2e da composição: a largura (1280), a posição esperada da lista e a recebida |

Depois, `git status --porcelain` igual ao de antes, `sha256sum -c` com OK nos arquivos tocados e
`git grep -c --untracked DEMO-RP12 -- src tests/e2e` com código 1 (a forma restrita que a
`pagina-projetos` deixou). Nenhuma demonstração toca `src/proxy.ts`.

### D7 — Escopo nominal e conferência proporcional

| Quem | Arquivos |
| --- | --- |
| `dev-frontend` | `src/app/(site)/(publicas)/contato/`; `src/features/contato/`; o bloco em `src/componentes/padroes/` (arquivos novos só); `src/lib/utils/paginas-publicas.{json,test.ts}`; `src/estilos/tokens.css` só com linhas acrescentadas, se preciso; `public/icone-email-gmail.png` (cópia) |
| `qa-acessibilidade` | `tests/e2e/` (spec novo da página, e um apoio de leitura do documento se não couber no spec; `paginas-publicas.spec.ts`) |
| `guardiao-visual` | `openspec/changes/pagina-contato/prints/` |
| Líder técnico | `docs/REFERENCIA-VISUAL.md` §7 e `docs/conteudo-institucional.md` §1, no Portão 1; os prints da Q3; `docs/SEGURANCA.md` §7 (tarefa 4.2); o `relatorio.md` |
| `especificador` | `openspec/changes/pagina-contato/` |

**Não mudam:** `src/proxy.ts`, `src/app/layout.tsx`, `src/app/(site)/em-construcao/`,
`src/app/(site)/(publicas)/page.tsx` e `_inicio/`, `src/componentes/layout/`, `src/componentes/ui/`,
os arquivos que já existem em `src/componentes/padroes/`, `src/features/` fora de `contato/`,
`assets/`, `tests/e2e/interruptor.spec.ts`, `playwright.config.ts`, `lighthouserc.json`,
`scripts/`, `.github/`, `package.json`, `package-lock.json`, `docs/PLANO-DE-DESENVOLVIMENTO.md`,
`docs/PADROES-DE-CODIGO.md` e `openspec/specs/`. Arquivo fora das listas é desvio, nomeado na
entrega.

**Conferência proporcional do guardião** (`SEGURANCA.md` §5), sem rodeio: os prints da Q3, os do
`guardiao-visual` e a cópia do Gmail em `public/` são binários novos, e a §7 manda a linha de origem
no mesmo diff. Com isso o **`docs/SEGURANCA.md` entra no diff**, e ele está na lista do gatilho:
**passo 1, checklist inteiro.** Todo o resto do diff previsto está na lista de tela (`src/app/(site)/`
sem `route.ts`, `src/componentes/`, `src/features/`, `src/estilos/`, `src/lib/utils/`, `public/`,
`tests/e2e/`, `docs/REFERENCIA-VISUAL.md`, `docs/conteudo-institucional.md` e
`openspec/changes/pagina-contato/`, sem `ambiente-decidido.txt` e sem spec delta do gatilho), e
nenhum arquivo acrescenta `process.env` nem `NEXT_PUBLIC_`. É o custo conhecido até a regra geral
dos prints, na `lancamento-r1`.

### D8 — O P23

Pela forma da `SEGURANCA.md` §5, sem mudança nela. Host exato
`portal-liacup-git-feat-pagina-contato-liacup1.vercel.app` (45 caracteres antes de `.vercel.app`,
contados à mão; abaixo do corte de 63), rota `/contato`. O Gabriel confirma o host, letra por letra,
e o commit no painel da Vercel antes do `curl`. Registrado antes do merge.

### D9 — A evidência herdada (tarefa 1.1)

Feita pelo líder técnico antes desta proposta, nas seções "Evidência herdada da `pagina-projetos`" e
"Prova do push: execução #46" do `relatorio.md`. Pela API pública do GitHub, sem autenticação e sem
`gh`. O critério está na tarefa 1.1.

### Fontes do texto que vai ao ar

| Texto | Fonte |
| --- | --- |
| Sobretítulo "Contato" | Rótulo do menu do protótipo; rótulo de interface na `REFERENCIA-VISUAL.md` §7 |
| Título "Fale com a Liga" | Protótipo; rótulo de interface na §7 |
| Frase abaixo do título | Nenhuma (Q1 (a)) |
| "Instagram", "E-mail", "Onde estamos" | Protótipo; rótulos de interface na §7 |
| `@liacup.unb` | `conteudo-institucional.md` §1, célula "Instagram" |
| `liacup.unb@gmail.com` | §1, célula "E-mail" |
| Endereço | §1, célula "Sede", com " — " trocado por " · " (Q2 (b)) |
| Rótulo "Contato" no menu e no rodapé | Protótipo, como os outros rótulos da lista |
| Título e descrição para buscadores | D3 e Q4 |

## Risks / Trade-offs

| Risco | Mitigação |
| --- | --- |
| O endereço longo (Q2 (b)) quebrar mal ao lado do círculo em 360 | O e2e confere a rolagem em 360; o `guardiao-visual` olha a quebra e, se preciso, propõe melhoria a aprovar |
| O bloco nascer com a forma da página e não servir à inicial, que põe cada quadro numa superfície clara | A figura e a moldura entram por composição (D1); o teste de unidade renderiza a composição da inicial; a superfície é da `inicio-completo` |
| Dados de contato escritos em três lugares (bloco, rodapé, página em construção) | Dívida nomeada (D1); o rodapé e a página em construção têm teste próprio dos dados |
| O teste ler a célula errada da tabela do §1, ou o "— confirmado" do Instagram | A regra do D6 lê pelo nome da linha e pelo trecho entre crases; a demonstração 1 confere |
| A frase da Q4 (a) não ser a primeira citação do §1 | D3: logo abaixo do título "## 1."; o teste de unidade fica vermelho se não for |
| A grade de duas colunas entrar no bloco e a inicial herdá-la | D1 e D4: a grade é da rota; o teste de unidade do bloco renderiza a composição da inicial; o `revisor` confere no diff |
| A R4 ter de desfazer a composição da Q3 (b) | A regra da §7 já diz que o formulário traz de volta a do protótipo; a mudança fica na rota, com lado a lado novo |
| `openspec validate` recusar o delta | O especificador não rodou o validador (sem terminal). O líder técnico roda antes do Portão 1 |

## Open Questions

Nenhuma. As quatro foram decididas pelo Gabriel no Portão 1, 23/11/2026; o texto literal está no
`relatorio.md`, seção "Decisões do Gabriel no Portão 1, 23/11/2026". As opções e os custos ficam na
proposta, seção "Questões para o Portão 1".

| Qn | Assunto | Decisão do Gabriel |
| --- | --- | --- |
| Q1 | Frase abaixo do título | (a) nenhuma |
| Q2 | Endereço de "Onde estamos" | (b) o completo do §1, com "·" |
| Q3 | O lugar do formulário | (b) título à esquerda e quadros à direita acima de 1024 px; uma coluna até 1024 px. Melhoria aprovada sobre o protótipo; na R4, o formulário traz de volta a composição do protótipo. Não era a recomendação (a) |
| Q4 | Descrição para buscadores | (a) frase com o @ e o e-mail, registrada no §1 |
