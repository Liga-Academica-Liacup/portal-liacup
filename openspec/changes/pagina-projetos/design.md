# Design — página Projetos

## Context

Ver `proposal.md`, seção Why. Estado lido na `main` `e31d49a` pelo especificador:

| O que | Situação |
| --- | --- |
| Lista única | `src/lib/utils/paginas-publicas.json` com 4 entradas, nesta ordem: `/`, `/sobre`, `/processo-seletivo` (fora do menu, destaque), `/equipe` (coluna "Conteúdo") |
| Teste da lista | `paginas-publicas.test.ts` confere títulos, o menu `['Início', 'Sobre', 'Equipe']`, a coluna "Conteúdo" `['Equipe']` e cada descrição como trecho literal do documento; a da Equipe é a primeira citação (`> `) da seção de nível 2 "## 4." |
| e2e da entrega | `tests/e2e/paginas-publicas.spec.ts` tem a constante da entrega (endereços, menu, colunas). O resto da moldura, as listas anunciadas, a medição e o Lighthouse saem da lista sozinhos |
| Interruptor | `tests/e2e/interruptor.spec.ts` com as quatro rotas da spec `publicacao-do-site`. O `src/proxy.ts` já leva todo endereço que não é `/` nem `/em-construcao` à raiz no não publicado |
| Faixas | Cada página tem a sua: `features/processo-seletivo/componentes/FaixaDoTopo`, `features/equipe/componentes/FaixaDaEquipe` (sobretítulo e `h1`, sem frase) e `features/sobre/componentes/FaixaDoSobre` |
| §3 do documento | Quatro títulos de nível 3: "Ensino", "Extensão" e "Pesquisa" com a nota `_(Estatuto, Art. 2º § n)_` no título e um parágrafo cada; "Secretaria — ⚠️ **texto provisório**", com um parágrafo de explicação, o texto entre `> _…_` e o "Continua pendente de confirmação"; depois, "Como o texto provisório aparece no site". A primeira citação da seção é a "Escolha de palavra" |
| Plano | O `PLANO-DE-DESENVOLVIMENTO.md` §11 já registra o texto da Secretaria como pendente, e a `homologacao-r1` como a change que o recebe. Esta change não toca o plano |
| Gabarito | `projetos-{390,1280}`: faixa clara (sobretítulo "PROJETOS", `h1` em duas linhas em 390, frase); quatro cartões na superfície, com raio grande, título da frente e, dentro, uma caixa tracejada com o selo "Pendente" e "Descrição de … a ser escrita pela diretoria."; 2 colunas em 1280, 1 em 390. No rodapé, "Projetos" é o primeiro da coluna "Conteúdo", antes de "Equipe". `menu-aberto-390`: "Projetos" entre "Eventos" e "Materiais" |

## Goals / Non-Goals

**Goals:**

- A página sai da lista e dos dados; nenhum componente guarda texto.
- Nada inventado nem marcado como rascunho na tela.
- A produção continua igual.
- O diff fica todo na lista de tela da `SEGURANCA.md` §5.

**Non-Goals:** ver "Fora de escopo" da proposta.

## Decisions

### D1 — Onde a página mora

- Rota em `src/app/(site)/(publicas)/projetos/`. Só compõe a faixa e a grade.
- Domínio em `src/features/projetos/`, com `tipos.ts`, `conteudo.ts`, `conteudo.test.ts` e
  `componentes/`, como `features/equipe`.
- **Faixa própria** (`componentes/FaixaDeProjetos`), com a forma da faixa da Equipe (sobretítulo e
  `h1`), e não importada de `features/equipe`: uma feature não importa de outra, e mover a da Equipe
  para `src/componentes/padroes/` traria a Equipe para o diff e para o lado a lado. Fica registrado
  como dívida: duas faixas com a mesma forma e os mesmos tokens (Equipe e Projetos), para uma change
  que as una.
- **Cartão da frente:** o componente de base `Cartao` de `src/componentes/ui/` se ele der o raio, o
  preenchimento e a superfície do gabarito só com tokens; senão, um cartão em `features/projetos`.
  O dev registra qual.

### D2 — Que spec muda, e qual não muda

- `navegacao-publica`: REMOVED mais ADDED do requisito da lista, como na change anterior, porque o
  cenário "Nesta entrega, a lista tem a Início, o Sobre, a Equipe e o Processo seletivo" fica falso e
  o validador não deixa bloco modificado largar cenário. O requisito volta como "A lista única
  decide as páginas públicas, a ordem delas e o lugar de cada uma", e o cenário da entrega ganha um
  nome que não muda mais, "O que a lista mostra nesta entrega": a próxima página altera o corpo dele
  por MODIFIED, sem REMOVED. MODIFIED do rodapé (corpo do cenário "Coluna sem página não aparece") e
  da medição (`5 nesta entrega`).
- `seo`: MODIFIED do cenário "Os títulos e as descrições desta entrega".
- **Não mudam:** `publicacao-do-site` (Q4 (a); o cenário "Valores parecidos não publicam" já diz
  que os demais endereços de página levam à página em construção); `pagina-inicial` (nenhum botão
  novo no hero); `fundacao-e-ci`.

### D3 — A lista

- Entrada nova, entre `/processo-seletivo` e `/equipe`: `/projetos`, rótulo "Projetos", `noMenu`
  `true`, `colunaDoRodape` "Conteúdo", `destaque` `false`. Menu: Início, Sobre, Projetos, Equipe.
  Coluna "Conteúdo": Projetos, Equipe.
- Título pelo `tituloEsperado`: "Projetos · LIACUP" (17 caracteres).
- Descrição pela Q3. Com a (a), a frase fica no §3 na forma da do §4: a linha "**Descrição da página
  Projetos para buscadores** _(decisão do Gabriel, <data>, Q3 da pagina-projetos)_:" e a frase como
  citação, **logo abaixo do título "## 3."**, antes de "Decisão D3", para ser a primeira citação da
  seção, que é o que o teste da lista lê (como o §4). O teste de unidade confere a descrição contra
  essa citação, o título, o menu e a coluna "Conteúdo".

### D4 — A composição de `/projetos`

Do protótipo vale a composição; o texto vem dos dados (D5).

- **Faixa do topo (Q2):** a faixa clara do gabarito. Sobretítulo "Projetos" em parágrafo e `h1`
  "Ensino, Extensão, Pesquisa e Secretaria". Com a (a), sem frase.
- **Grade:** uma lista de quatro itens, com `role="list"` se não tiver marcador visível (requisito
  "Lista sem marcador visível" da `navegacao-publica`). Cada item é um cartão: o nome da frente em
  `h2` e o parágrafo do §3. Sem a caixa tracejada e sem o selo: o parágrafo fica direto no cartão,
  abaixo do título, no preenchimento do cartão. Hierarquia `h1` → `h2`, sem `h3`.
- **Colunas:** 2 em 1280 e 1 em 390, como o gabarito. O corte entre uma e duas o dev lê no CSS do
  `prototipo/Portal-LIACUP.html` e registra no relatório; o e2e o usa.
- **Altura:** os textos têm tamanhos diferentes (Extensão é o mais longo). Cartões da mesma linha
  ficam com a mesma altura, como os do gabarito; o `guardiao-visual` julga o equilíbrio em 1280 e
  768.
- **Secretaria (Q5):** com a (a), mesma letra e mesmo estilo dos outros três, sem itálico.
- **Contraste (RP-09):** o dev mede o título e o parágrafo contra a superfície do cartão e registra
  as cores e a superfície. Mínimo de 4,5:1 no parágrafo; o título, se for texto grande, 3:1, com o
  tamanho registrado. Só tokens.

### D5 — Os dados

- `features/projetos/conteudo.ts`: a faixa (sobretítulo e título) e as quatro frentes (nome e
  texto), na ordem do §3. Sem a nota de fonte, sem "⚠️", sem marca de itálico.
- **Teste de unidade:** quatro frentes, nomes "Ensino", "Extensão", "Pesquisa" e "Secretaria" nessa
  ordem, nada vazio, nada repetido; o título da faixa igual aos quatro nomes juntos ("A, B, C e D"),
  para os dois não se desencontrarem; nenhum texto com "Pendente", "a ser escrit", "provisório",
  "eixo", "Estatuto", "_" ou "⚠". Imprime `frentes: 4`.
- **O teste do texto contra o documento é de ponta a ponta** (D6), lendo o
  `conteudo-institucional.md`, como os da Equipe e do Sobre.
- Carregando, erro e vazio: o vazio é impossível hoje (dado estático, contagem exigida pelo teste).
  Os três estados chegam quando o detalhamento vier pelo painel, fora desta change.

### D6 — Verificações e RP-12

O `qa-acessibilidade` escreve, lendo o documento, a `REFERENCIA-VISUAL.md` §7 e o protótipo, sem
copiar texto:

1. **Spec de `/projetos`**, nas 7 larguras, publicado:
   - do §3, as quatro frentes: o nome é o título de nível 3 sem a nota `_( … )_` e sem o que vem
     depois de " — "; o texto de Ensino, Extensão e Pesquisa é o parágrafo do título; o da
     Secretaria é a citação `> _…_`, sem `> ` e sem `_`. Conferidos palavra por palavra, com a
     sobra de texto fora do documento e dos rótulos;
   - os rótulos da faixa, da linha "Projetos, faixa do topo" da §7;
   - ausentes do texto visível: "Pendente", "a ser escrita", "texto provisório", "pendente de
     confirmação", "O Estatuto não descreve", "Estatuto", "eixo", e a frase da faixa do protótipo,
     lida dele;
   - um `h1`, quatro `h2` na ordem do §3, os quatro cartões numa lista; as colunas pelo corte do
     D4; o parágrafo da Secretaria com o mesmo estilo de letra dos outros três (Q5 (a));
   - axe 0 e nenhuma rolagem horizontal;
   - **o interruptor (Q4 (a)):** `/projetos` pedido sem seguir redirecionamento dá 307 com destino
     `/` no servidor não publicado, e, seguido, chega à página em construção; no publicado, 200 sem
     `Location`. Imprime `projetos no interruptor: 2 de 2 modos`.
2. **Ajustes:** a constante da entrega do `paginas-publicas.spec.ts` (cinco endereços, menu e
   colunas). `páginas verificadas: 5 de 5` sai sozinho da lista.
3. **Não mudam:** `interruptor.spec.ts` (`rotas verificadas: 4`), `playwright.config.ts`.

Demonstrações de falha, cada uma com a saída vermelha e a verde no relatório:

| # | Violação temporária | Vermelho esperado |
| --- | --- | --- |
| 1 | Uma palavra trocada no texto de Extensão nos dados | e2e: o trecho, o esperado e o recebido |
| 2 | Uma frente a menos nos dados | unidade: a contagem; e2e: a frente que falta |
| 3 | "Pendente" acrescentado ao texto da Secretaria nos dados | unidade e e2e: o termo e onde |
| 4 | O parágrafo da Secretaria em itálico | e2e: a frente e o estilo recebido |
| 5 | Descrição de Projetos com 161 caracteres | unidade: o endereço e "161" |
| 6 | `/projetos` depois de `/equipe` na lista | unidade: o menu esperado e o recebido |
| 7 | A lista dos cartões sem o papel de lista | e2e das listas anunciadas: a página e a lista |
| 8 | A conferência do 307 apontada, no próprio teste, para o servidor publicado | e2e: "200 sem Location (esperado 307 para /)" |

Depois, `git status --porcelain` igual ao de antes e `sha256sum -c` com OK nos arquivos tocados.
Nenhuma demonstração toca `src/proxy.ts`, que está no gatilho.

### D7 — Escopo nominal e conferência proporcional

| Quem | Arquivos |
| --- | --- |
| `dev-frontend` | `src/app/(site)/(publicas)/projetos/`; `src/features/projetos/`; `src/lib/utils/paginas-publicas.{json,test.ts}`; `src/estilos/tokens.css` só com linhas acrescentadas, se preciso |
| `qa-acessibilidade` | `tests/e2e/` (spec novo da página, e um apoio de leitura do documento se ele não couber no spec; `paginas-publicas.spec.ts`) |
| `guardiao-visual` | `openspec/changes/pagina-projetos/prints/` |
| Líder técnico | `docs/REFERENCIA-VISUAL.md` §7, no Portão 1; o `relatorio.md` desta change |
| `especificador` | `openspec/changes/pagina-projetos/`; e, com a Q3 (a) ou (c) e a autorização escrita do Gabriel, o §3 do `docs/conteudo-institucional.md`, no Portão 1 |

**Não mudam:** `src/proxy.ts`, `src/app/layout.tsx`, `src/app/(site)/em-construcao/`,
`src/componentes/layout/`, `src/features/` fora de `projetos/`, `tests/e2e/interruptor.spec.ts`,
`playwright.config.ts`, `lighthouserc.json`, `scripts/`, `.github/`, `package.json`,
`package-lock.json`, `docs/SEGURANCA.md`, `docs/PLANO-DE-DESENVOLVIMENTO.md`, `docs/PADROES-DE-CODIGO.md`
e `openspec/specs/`. Arquivo fora das listas acima é desvio, e vai nomeado na entrega.

**Conferência proporcional do guardião** (`SEGURANCA.md` §5). Todo arquivo previsto está na lista
de tela: `src/app/(site)/` sem `route.ts`, `src/features/`, `src/lib/utils/`, `src/estilos/`,
`tests/e2e/`, `docs/REFERENCIA-VISUAL.md`, `docs/conteudo-institucional.md` e
`openspec/changes/pagina-projetos/` (sem `ambiente-decidido.txt` e sem spec delta de spec do
gatilho). Nenhum acrescenta `process.env` nem `NEXT_PUBLIC_`. A change é da R1. Pelo **passo 3**:
AS-01, AS-02, AS-04, AS-07 e AS-15. Cuidado: `playwright.config.ts` e `lighthouserc.json` não estão
em nenhuma das duas listas; tocar um deles leva ao passo 4, o checklist inteiro. A Q1 (b) ou a Q4 (b)
levam ao passo 1.

### D8 — O P23

Pela forma da `SEGURANCA.md` §5, sem mudança nela. Host exato
`portal-liacup-git-feat-pagina-projetos-liacup1.vercel.app` (46 caracteres antes de `.vercel.app`,
contados à mão; abaixo do corte de 63), rota `/projetos`. O Gabriel confirma o host, letra por
letra, e o commit no painel da Vercel antes da forma do `curl`.

### D9 — A prova do push (tarefa 1.1)

Pela API pública do GitHub, sem autenticação, na forma do M1 da `completar-ci-do-novo-fluxo`
(`curl -q -sS --max-time 20 --proto =https`, raiz `https://api.github.com/repos/Liga-Academica-Liacup/portal-liacup`),
cada resposta reduzida aos campos do critério:

- `/actions/runs/45185945480/jobs` (execução #44, push do merge, `e31d49a`): nome, conclusão e
  duração de cada job; esperados os quatro (Verificacoes, Build para a barreira da chave, Tipos do
  banco, Chave fora do pacote), todos `success`;
- `/deployments?environment=chave-de-servico-da-main` e `?environment=segredos-da-main`: só
  `ref: main` (critério do M1 de lá);
- `/actions/runs/<id>/artifacts` da #43 (id 45184520538) e da #44: nome, tamanho e expiração (I1).
  O número de arquivos do anexo do `.next` e a ausência de nome começando com `.env` exigem baixar o
  anexo, o que pede autenticação: ficam "não medido", com esse motivo;
- a confirmação do Gabriel, literal, e a existência dos segredos como palavra dele;
- o tempo do PR #24: execução #43, 13:30:02Z a 13:37:14Z, 7 min 12 s = 7,2 min, contra 5,95 (+1,25
  min, +21 %) e 5,73 (+1,47 min, +26 %).

Nenhum agente usa `gh`. O líder técnico escreve no `relatorio.md`, seção "Prova do push da
`completar-ci-do-novo-fluxo`".

### Fontes do texto que vai ao ar

| Texto | Fonte |
| --- | --- |
| Sobretítulo "Projetos" | Título do §3 e rótulo do menu do protótipo; rótulo de interface na `REFERENCIA-VISUAL.md` §7 |
| Título "Ensino, Extensão, Pesquisa e Secretaria" | Os quatro nomes do §3; rótulo de interface na §7 |
| Frase da faixa | Nenhuma (Q2 (a)) |
| Nome de cada frente | Título de nível 3 do §3, sem a nota e sem o aviso da Secretaria |
| Texto de Ensino, Extensão e Pesquisa | O parágrafo do §3, inteiro |
| Texto da Secretaria | A citação do §3, inteira, sem a marca de itálico (Q5 (a)) |
| Rótulo "Projetos" no menu e no rodapé | Protótipo, como os outros rótulos da lista |
| Título e descrição para buscadores | D3 e Q3 |

## Risks / Trade-offs

| Risco | Mitigação |
| --- | --- |
| Cartões de alturas muito diferentes em 1280 (Extensão tem quatro frases, cerca de 510 caracteres; Ensino, três frases, cerca de 350; estimados à mão) | Mesma altura na linha, como o gabarito; o `guardiao-visual` julga e, se preciso, propõe melhoria a aprovar |
| O `h1` longo quebrar mal em 360 | É o título do gabarito; o e2e confere a rolagem em 360, e o `guardiao-visual` olha a quebra |
| O leitor do §3 no teste pegar o parágrafo errado da Secretaria (são três blocos) | A regra do D6 pega só a citação `> `; a demonstração 1 e a contagem por frente conferem |
| A frase da Q3 (a) não ser a primeira citação do §3 | D3: ela entra logo abaixo do título "## 3."; o teste de unidade fica vermelho se não for |
| A amostra de rotas do interruptor ficar atrás das páginas (Q4 (a)) | Nota na passagem para a `lancamento-r1`: derivar as rotas do interruptor da lista única |
| `openspec validate` recusar o delta | O especificador não rodou o validador (sem terminal). O líder técnico roda antes do Portão 1 |

## Open Questions

As cinco estão na proposta, seção "Questões para o Portão 1", com opções, custo e recomendação. O
texto literal das decisões do Gabriel vai para o `relatorio.md`, transcrito pelo líder técnico.

| Qn | Assunto | Recomendação |
| --- | --- | --- |
| Q1 | Destino dos cinco textos do passo 7 | (a) `lancamento-r1` |
| Q2 | Frase da faixa | (a) nenhuma |
| Q3 | Descrição para buscadores | (a) frase registrada no §3 |
| Q4 | Onde se prova o interruptor | (a) spec e e2e da página |
| Q5 | Itálico da Secretaria | (a) sem itálico |
