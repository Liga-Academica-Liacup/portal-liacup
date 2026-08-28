# Evidências — F03 Layout base

**Branch**: `feat/F03-layout-base` · **SHA inicial**: `3b2ce14fff80284e046316b3142487491f6e5e70`
**Início**: 27 de agosto de 2026

No precedente das F00, F01 e F02. Cada linha traz **o que foi medido e o número**, não a afirmação
de que está tudo certo. O que não puder ser provado fica declarado como **NÃO EXECUTADO**, com o
motivo — preencher com algo plausível é o que este arquivo existe para não fazer (Princípio VIII).

**Regra de leitura**, herdada da F02: toda evidência aparece **uma vez** na seção temática a que
pertence, e as **não executadas se repetem na seção final**, onde o motivo é explicado.

**Convenção de contraste (RP-09)**: todo número nomeia **as duas cores e a superfície**. Número
solto não vale como registro.

**Convenção das demonstrações (RP-12)**: cada verificação nova entra com cinco campos — violação
temporária nomeada, comando exato, resultado vermelho com código e mensagem, restauração, e
resultado verde com contador.

---

## 1. Linha de base — antes de qualquer alteração da F03

Medida em `3b2ce14`, com a árvore limpa. Nenhuma falha encontrada foi corrigida aqui: o objetivo é
ter o estado anterior reproduzível.

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E1** | `npm run verificar` — cadeia estática de seis verificações | **Verde, código 0.** 211 arquivos rastreados examinados contra 11 padrões de artefato · 56 arquivos varridos em `src/` pelo verificador de tokens · 298 arquivos varridos pelo verificador de chave, 57 entregues ao navegador, 0 ocorrências |
| **E2** | Dependências diretas | **execução: 4 · dev: 18 · total: 22.** Bate com o `plan.md`, que declara zero novas |
| **E3** | `npm test` — unidade | **9 arquivos · 71 testes · 71 passaram**, código 0 |
| **E4** | `npm run test:banco` — políticas de acesso | **5 arquivos · 147 testes · 147 passaram**, código 0 · **143 células verificadas: 58 de permissão, 85 de recusa** |
| **E5** | `npm run build` + `npm run test:e2e` — sete larguras | **84 passaram**, código 0, em 38,8 s |
| **E6** | `npm run test:desempenho` — Lighthouse | **Verde, código 0.** 1 URL × 3 execuções = 3 relatórios · **desempenho 0,98 · acessibilidade 1,00** nas três |
| **E7** | Perfil real do Lighthouse, lido do LHR e não da configuração | **`formFactor: mobile` · `throttlingMethod: simulate` · `screenEmulation.mobile: true`** |

### O E7 fecha a emenda E2 da Parada 1, e não por leitura de arquivo

A correção do `lighthouserc.json` — remover `preset: "desktop"`, porque **não existe**
`preset: "mobile"` e mobile é o padrão obtido pela ausência da chave — está agora **confirmada no
relatório gerado**, não na configuração que a produziu. É a distinção que o FR-039 passou a exigir
depois da Parada 1: *"o perfil mobile simulado deve ser configurado explicitamente e **conferido nos
relatórios gerados**"*.

### A queda que eu previ aconteceu, e foi de 2 pontos

No relatório da F01, medido em `preset: desktop`, o desempenho era **100**. Em mobile simulado, com
limitação de CPU e de rede, é **98**. Eu havia escrito, antes de medir, que *"é provável que o
desempenho caia abaixo de 100"* e que **o limiar de 90 não desceria por causa disso**. A direção
estava certa e a magnitude não: 98 passa com folga de 8 pontos.

Fica registrado porque é a linha de base contra a qual as dez rotas da F03 vão ser comparadas — e
porque uma queda futura para, digamos, 91 precisa ser lida contra **98**, não contra 100.

---

## 2. Fonte única dos destinos (FR-044 · SC-017)

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E8** | **T003 — vermelho antes do catálogo.** `npx vitest run src/componentes/layout/destinos-publicos.test.ts` com o teste escrito e o catálogo ainda inexistente | **Código 1 · `Test Files 1 failed` · `Tests no tests`** — falha na resolução de `./destinos-publicos`. Zero testes executados, que é o vermelho honesto: não havia o que medir |
| **E9** | **T004 — verde com contador.** Mesmo comando depois do JSON e do adaptador | **Código 0 · 8 testes.** Contadores impressos: **`Destinos no catálogo: 10`** · **`Rótulos únicos: 10 · caminhos únicos: 10`** · **`Conversões principais declaradas: 1`** |
| **E10** | **T006 — `lhci` contra as nove rotas ausentes**, antes de qualquer rota ser criada | **Código 1.** `Runtime error encountered: Lighthouse was unable to reliably load the page you requested. (Status code: 404)` |
| **E11** | **T006 — o pós-verificador sobre o mesmo estado.** `node scripts/verificar-paginas-lighthouse.mjs` | **Código 1 · `caminhos medidos: 1/10` · `relatorios lidos: 3/30` · `problemas encontrados: 9`**, cada um nomeando o caminho: `/sobre: NENHUM relatorio — o destino esta no catalogo e nao foi medido` |
| **E12** | URLs derivadas do catálogo pelo `lighthouserc.cjs`, conferidas fora do teste | **10 URLs**, uma por destino, e `perfil: mobile simulate` |

### O E11 pegou o caso que ele existe para pegar — e por um caminho que eu não tinha planejado

O manifest que o verificador leu era o da **linha de base**, com três relatórios de `/` apenas: o
`lhci` abortou no 404 e não escreveu manifest novo. O verificador não se enganou com isso. Disse
**1/10** e **3/30**, e nomeou os nove ausentes.

É exatamente o quarto caso listado no cabeçalho do script — *"relatório velho na pasta inflando a
contagem"* — e ele apareceu sozinho, sem ser encenado. Um verificador que só olhasse notas teria
lido três relatórios com desempenho 0,98 e ficado verde.

### Achado da Fase 2: o primeiro `.cjs` do repositório derrubou o lint inteiro

Não é defeito do `lighthouserc.cjs`; é uma fragilidade do `eslint.config.mjs` que só podia aparecer
quando surgisse um arquivo fora das extensões que o `eslint-config-next` cobre.

Dois blocos aplicavam regras **de plugin** — `jsx-a11y/*` e `import/no-restricted-paths` — **sem
`files`**, isto é, a todo arquivo. Num `.cjs`, onde o config do Next não registra os plugins, o
ESLint aborta com `could not find plugin`, **sem apontar a causa** e derrubando o lint do projeto
inteiro. Enquanto só existiram `.ts`, `.tsx`, `.mts` e `.mjs`, ninguém podia notar.

| Correção | Prova de que não afrouxou |
| --- | --- |
| `jsx-a11y` restrito a `**/*.jsx`, `**/*.tsx` | `.tsx` temporário com `<img>` sem `alt` → **erro `jsx-a11y/alt-text`, código 1** |
| `import/no-restricted-paths` restrito às extensões com plugin | `src/componentes/ui/` temporário importando de `features/` → **erro `import/no-restricted-paths`, código 1** |
| `@typescript-eslint/no-require-imports` desligado só em `**/*.cjs` | `require` é a única forma que existe em CommonJS; o produto é todo ESM e continua proibido |

**A barreira da chave de serviço foi deixada global de propósito**, e isso também foi medido: um
`.cjs` temporário lendo `process.env.SUPABASE_SERVICE_ROLE_KEY` → **erro `no-restricted-syntax`,
código 1**. Regra de plugin ganhou `files`; regra do núcleo, não — um arquivo novo, em qualquer
extensão, nasce proibido de ler a credencial.

**Por que isto não é conserto silencioso**: mexer numa verificação sem demonstrar que ela continua
mordendo é o que o RP-12 proíbe. As quatro provas acima foram executadas, cada uma isolada, antes de
a cadeia voltar ao verde.

## 3. Moldura e dez rotas (US1 · FR-001 a FR-004, FR-020 a FR-025, FR-046)

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E13** | **T007 — vermelho antes da mudança semântica.** `npx vitest run src/componentes/layout/LinksDeContato.test.tsx` com o componente ainda como `<nav>` | **Código 1 · 2 falharam, 4 passaram.** A mensagem nomeia o elemento: `expected document not to contain element, found <nav aria-label="Canais de contato da LIACUP">` |
| **E14** | **T009 — verde.** Mesmo comando depois de `<address>` | **Código 0 · 6 testes.** Contador: `Canais de contato renderizados: 2` |
| **E15** | **T008 — vermelho da matriz**, antes das rotas. `npx playwright test --project=largura-360 tests/e2e/paginas-publicas.spec.ts` | **Código 1 · 50 falharam, 42 passaram** · `páginas verificadas: 1/10 · destinos do catálogo: 10` · `destinos do catálogo sem rota: /sobre, /noticias, /conteudo-educativo, /eventos, /projetos, /materiais, /galeria, /processo-seletivo, /contato` |
| **E16** | **T014 — a mesma matriz depois da moldura e das dez rotas** | **`páginas verificadas: 10/10`** · **`banner 1 · navigation 1 · main 1 · contentinfo 1`** nas dez rotas · **21 falharam, 71 passaram** |
| **E17** | Unidade, depois da Fase 3 | **10 arquivos · 82 testes**, código 0 (eram 79 no fim da Fase 2) |
| **E18** | Cadeia estática | **Código 0** · 217 artefatos examinados · 74 arquivos varridos pelo verificador de tokens |

### As 21 falhas restantes são de fase posterior, e estão nomeadas

O checkpoint da Fase 3 é *"US1 verificável nas dez rotas"* — **10/10 e landmarks 1·1·1·1 estão
cumpridos**. As falhas que sobram pertencem a US3 (Fase 4) e US2 (Fase 5), e ficam declaradas em vez
de escondidas:

| Falha | Número medido | Quem resolve |
| --- | --- | --- |
| Rolagem horizontal em 360 px | `scrollWidth 765 maior que clientWidth 360` | **Fase 4** — nove destinos vão para o painel; hoje os dez estão lado a lado |
| Alvos de toque | **14 medidos · 3 abaixo de 44 px** | **Fase 4/5** — ver abaixo |

### O achado da Fase 3: `min-height: 44px` não é um alvo de 44 px

Os três alvos reprovados são os de rótulo curto:

```
a "Início"  33.8 × 44.0
a "Sobre"   37.3 × 44.0
a "Galeria" 43.6 × 44.0
```

**A altura está certa em todos.** O que falta é **largura** — o `.nav a` do `liacup.css` não tem
preenchimento horizontal, então o alvo é do tamanho do texto. "Início" tem seis letras e por isso
mede 33,8 px de largura, mesmo com `min-height: var(--alvo-de-toque)` aplicado.

Isto é exatamente o tipo de defeito que uma verificação de uma dimensão só deixa passar: um
verificador que medisse `height >= 44` reportaria **zero falhas** e estaria errado em três alvos. A
função `medirAlvosDeToque` compara **as duas dimensões**, e foi por isso que apareceu.

Fica registrado aqui porque a correção é da Fase 4/5 e a causa é desta.

### E19 — O `aria-label` do `<address>` é anunciado. A hipótese contrária foi medida e não se sustenta

Levantou-se, na revisão da Fase 3, que `<address>` mapearia para `generic`, que `generic` é papel em
que a ARIA **proíbe** nomeação, e que portanto o `aria-label` seria marcação morta. A dúvida era
legítima e o pedido foi explícito: medir, e reportar mesmo se contradissesse quem levantou.

**Contradiz.** Três ferramentas foram consultadas e duas respostas apareceram:

| Fonte | O que respondeu |
| --- | --- |
| **Árvore do Chrome** (CDP `Accessibility.getFullAXTree`) | `role="group"` · `name="Canais de contato da LIACUP"` · **`ignorado=false`** |
| **axe-core**, regra `aria-prohibited-attr` (tags `cat.aria`, **`wcag2a`**, `wcag412`) | **0 ocorrências** — a regra existe, rodou, e não considera o rótulo proibido aqui |
| **`getByRole` do Playwright** | **não encontra** o elemento: não mapeia `<address>` para `group` |
| `dom-accessibility-api` (jsdom/Testing Library) | encontra `group` com o nome |

O `<address>` mapeia para **`group`**, não para `generic`, e `group` **admite** nomeação. A árvore do
navegador é a que decide o que chega ao leitor de tela, e ela expõe o nome sem ignorá-lo.

**Detalhe que fecha a dúvida sobre o axe**: a regra está em `wcag2a`, então ela já rodava dentro do
filtro `['wcag2a','wcag2aa','wcag21a','wcag21aa']` usado nas dez rotas. O silêncio dela não era
ausência de cobertura.

**A divergência do Playwright fica registrada de propósito**, para ninguém "corrigir" isto de novo a
partir da ferramenta errada: `getByRole('group')` devolvendo zero descreve o modelo do Playwright,
não o que o leitor de tela recebe.

#### Adendo — o que o zero do axe significa, medido no bundle instalado

A primeira versão deste registro tratou o zero do axe como prova de que o rótulo é permitido. **Não
é**, e a correção veio de abrir o `node_modules/axe-core/axe.js`. A entrada do elemento é:

```js
address: {
  contentTypes: [ 'flow' ],
  allowedRoles: true
},
```

**Sem `implicitRole`** — e `implicitRole` aparece só **18 vezes** no bundle inteiro. O axe não
atribui papel implícito a `<address>` naquela tabela.

Mas o zero **também não é vazio**, e isso só apareceu ao ler as linhas vizinhas. O axe tem um sinal
próprio e explícito para o caso, usado em **38 entradas** — e o elemento imediatamente anterior o
carrega:

```js
abbr: {
  contentTypes: [ 'phrasing', 'flow' ],
  allowedRoles: true,
  namingProhibited: true      // ← abbr tem
},
address: {
  contentTypes: [ 'flow' ],
  allowedRoles: true          // ← address NÃO tem
},
```

Então o zero do `aria-prohibited-attr` diz uma coisa modesta e verdadeira: **`<address>` não está na
lista de 38 elementos em que o axe proíbe nomeação, ao contrário do vizinho `abbr`.** É evidência
fraca, não prova — e continua não sendo o que decide.

**O que decide é a árvore do Chrome**, e a decisão de ir até ela foi tomada *antes* de saber o
resultado, que é a única hora em que dá para julgar o método. Parar no axe teria acertado a
conclusão pelo motivo errado.

### E21 — Ferramenta que não enxerga não é atributo que não existe

Nome dado à classe, porque ela vai voltar.

O `getByRole('group')` do Playwright devolve **zero** para um elemento cujo nome acessível o Chrome
expõe. Lido sem cuidado, "a ferramenta não achou" vira "o atributo não funciona" — e a conclusão
errada fica com cara de medição.

É a mesma família de **"não executado" que era "não executado por mim"**, das E32/E33 da F02: o
sujeito da frase some, e sobra uma afirmação sobre o mundo que na verdade era uma afirmação sobre
quem olhou.

**Limite de cobertura, declarado**: o teste de unidade roda em **jsdom**, e prova que o
`dom-accessibility-api` expõe o nome. Quem prova o **Chrome** é a leitura do CDP registrada em E19,
que foi feita uma vez e não é permanente. Os dois concordam hoje. Cada um cobre o que alcança, e
vale saber qual prova o quê.

### E20 — A crítica metodológica estava certa, e o teste mudou

A conclusão não se sustentou; **o método sim**. O teste cobrava
`getAttribute('aria-label')`, o que prova que o atributo está no DOM e **não** que ele é anunciado —
"anunciado" e "ignorado" produzem exatamente o mesmo atributo. Verificação de configuração, no
formato mais inocente possível, e na mesma família do que quase entregou um banco quebrado fechado
na F02.

Passou a cobrar o **nome acessível exposto**, computado pelas regras da especificação:

```js
expect(screen.getByRole('group', { name: 'Canais de contato da LIACUP' })).toBeInTheDocument()
```

**Visto falhando nas duas regressões que ele existe para pegar** — cada uma isolada, com restauração:

| Violação temporária | Resultado |
| --- | --- |
| `aria-label` removido | **Código 1 · 1 de 6 falhou** — `Unable to find an accessible element with the role "group" and name "Canais de contato da LIACUP"` |
| `<address>` trocado por `<div>` | **Código 1 · 2 de 6 falharam** |
| Restaurado | **Código 0 · 6 passaram**, árvore limpa |

O teste anterior passaria nas duas.

### Duas antecipações declaradas, para não passarem como desvio silencioso

1. **O token `--font-size-marca` entrou no T011, não no T025.** O `Cabecalho.module.css` precisa do
   tamanho da marca para existir, e escrever `18px` à mão reprovaria o `verificar:tokens`. O
   conteúdo é exatamente o que o T025 pede — um token novo, origem literal `.nav-brand`, nenhum
   token existente alterado. Quando a Fase 5 chegar ao T025, ele confere em vez de criar.
2. **`src/app/(site)/pagina-em-construcao.module.css` não está na lista de arquivos do `plan.md`.**
   As nove páginas provisórias são idênticas na aparência; nove cópias do mesmo CSS divergem na
   primeira vez que alguém ajustar uma. Um módulo compartilhado, nenhum componente novo.

## 4. Conversão visível, navegação responsiva e aparência única (US3 · FR-005 a FR-008, FR-026 a FR-030, FR-045 · SC-018)

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E22** | **T015 — vermelho no tipo.** `npx tsc --noEmit` com os contratos escritos e os componentes ainda sem eles | **Código 2.** `TS2578: Unused '@ts-expect-error'` na linha do `style` do `Botao` — provando que ele **ainda não era recusado** · `TS2307` link inexistente · `TS2322` `'abrir' \| 'fechar'` não atribuível a `NomeDoIcone` |
| **E23** | **T018/T019/T020 — verde.** Mesmo comando | **Código 0** — e o verde aqui significa que as diretivas passaram a ser **usadas**: as recusas funcionam, não apenas compilam |
| **E24** | `Botao.module.css` depois do T018 | **Não existe.** `ls src/componentes/ui/Botao*.css` não devolve nada, e nenhuma referência a ele sobrou no repositório |
| **E25** | **SC-018 — os seis pares** | **6/6 pares · 29 propriedades comparadas por par · 0 divergentes** · **29 derivadas / 29 reconhecidas** pelo navegador |
| **E26** | Ícones da união fechada, na vitrine | **4 distintos**: `abrir, email, fechar, instagram` |
| **E27** | Suíte de ponta a ponta completa, sete larguras | **726 passaram · 0 falharam · 2 puladas** (o alvo do acionador não existe no desktop) |
| **E28** | Altura do cabeçalho, as sete larguras | **360: 62,59 · 390: 62,59 · 430: 62,59 · 480: 62,59 · 768: 62,59 · 1024: 71,78 · 1280: 62,59 px** |
| **E29** | Alvos de toque, contagem original conferida literalmente | **0 abaixo de 44 px** · painel fechado: **6 no mobile**, **14 no desktop**. O registro anterior estava invertido e os nove destinos do painel ainda não pertenciam à medição |
| **E30** | Unidade | **11 arquivos · 93 testes** (eram 82) |

### O achado da fase: o contador pegou um defeito meu

A comparação dos seis pares **passou** na primeira execução:

```
Pares visuais: 6/6 · propriedades comparadas por par: 2 · pares divergentes: 0
```

**Dois.** Eu desestruturei o grupo 1 do regex em vez do 2, e o grupo 1 era `(^|[;{])` — o conjunto
derivado continha `'{'` e `';'`. O teste comparou `getPropertyValue('{')` nos dois elementos, que
devolve string vazia em ambos, e portanto **sempre coincidia**.

Seis de seis pares, zero divergências, comparando duas coisas que não existem. **A asserção estava
correta e passaria para sempre.** Quem acusou foi o contador ao lado dela — que é o argumento
inteiro do RP-12 numa linha de saída.

Vale o registro sobre o método: a exigência do contador nasceu na F00 contra um CI que não checava
nada, e três features depois pegou um defeito de regex num teste de comparação visual. Regra que só
serve para o caso que a criou não teria pego este.

**Duas defesas foram acrescentadas, e a segunda substitui um número mágico por uma propriedade do
objeto:**

| Defesa | Pega | Visto falhando |
| --- | --- | --- |
| Piso de sanidade (12) | quebra catastrófica | a saída `2` acima |
| `CSS.supports(nome, 'initial')` | quebra **parcial** | propriedade plausível e inexistente no CSS: **30 derivadas / 29 reconhecidas**, código 1, nomeando `aparencia-do-controle` |

O piso sozinho deixaria passar quinze nomes plausíveis e errados. A validade não depende de quantos
nomes sobraram.

### O segundo achado: o landmark de navegação sumiu no mobile

Ao esconder a navegação direta abaixo de 1024 px, a primeira versão escondia o `<nav>` **inteiro**.
Medido: **`navigation 0`** nas dez rotas em 360 px. Como `display: none` tira o elemento da árvore
de acessibilidade, a página ficava **sem nenhum landmark de navegação justamente no caso
principal** — quem navega por regiões no leitor de tela não encontrava o menu do site no celular.

Corrigido: o `<nav>` existe nas sete larguras e só o conteúdo dele troca; o acionador e o painel
moram dentro dele, porque **são** a navegação. Depois: `banner 1 · navigation 1 · main 1 ·
contentinfo 1` nas dez rotas, em 360 e em 1280.

### O plano B do FR-007 foi disparado por medição, e só ele

| Antes | Depois |
| --- | --- |
| `gap: var(--space-4)` (17,6 px) · **`scrollWidth 1041` contra `clientWidth 1024`** nas dez rotas | `gap: var(--space-3)` (13,2 px) · **zero rolagem horizontal** nas sete larguras |

Faltavam **17 px** — quase exatamente um `--space-4`. A spec autorizou, **antes de medir**, uma
única saída: descer o espaçamento ao degrau anterior de token. Nenhum ponto de corte novo fora de
480/768/1024 foi inventado.

### A terceira saída do `<Link>`, e por que ela não afrouxa o FR-045

A primeira versão do cabeçalho usava o `LinkComAparenciaDeBotao`, que renderiza `<a>` puro e
**recarrega a página inteira**. Para a conversão principal do site — cujo público chega pelo
Instagram, no celular, muitas vezes em rede ruim — esse é o custo mais caro possível, e o Lighthouse
não mostraria, porque mede carga inicial.

O T018 criou a peça que dispensa a escolha: `classesDaAparencia` é **função pura**, sem rota e sem
componente, e `componentes/layout` **pode** conhecer rota. Então o cabeçalho usa
`<Link className={classesDaAparencia('primario', false)}>`: navegação de cliente, mesma origem única
de aparência, e nenhum buraco de `className` aberto no componente.

**A divisão fica por significado**, e esclarece o escopo do componente: rota interna usa `<Link>` com
a função; **destino externo** usa o componente — que é o caso do "Fazer inscrição" da F12, para o
formulário da liga, onde tem de ser um `<a>` de verdade.

## 5. Geometria do cabeçalho (US2 · FR-002, FR-003, FR-038)

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E31** | **T024 — vermelho da altura.** Troca temporária e isolada do padding vertical de `--space-2` para `--space-3`, em 360 px | **Código 1** · altura **71,38 px**, acima do teto de 64 px. Restaurado para `--space-2` |
| **E32** | **T024 — o primeiro vermelho de permanência não apareceu** com `position: static` | O teste passou porque a página provisória não tinha altura para rolar: `rolagemAplicada` era zero e o `if` pulava a asserção. Era verde sem medição |
| **E33** | **T024 — vermelho real da permanência**, depois de o medidor criar altura temporária e exigir rolagem > 0 | **Código 1** · `topo -400 depois de 400 px` com `position: static`. O medidor restaura a altura inline e a posição da página depois de cada caso |
| **E34** | Cobertura dos alvos móveis com o painel aberto, nas dez rotas | Painel fechado: **6** medidos. Painel aberto: **15** medidos, exatamente **9 acrescentados**, **zero** abaixo de 44 px. Em desktop: **14** medidos e painel ausente da árvore acessível |
| **E35** | Origem dos 71,78 px em 1024 | Lista direta **44,69 px**, maior item **44 px**: **1 linha**, com só **0,34 px** de desnível subpixel entre topos. Filhos do cabeçalho: marca `73,02×44`, navegação `784,23×44,69`, CTA **`96,38×53,19`** — é a CTA que quebra o texto |
| **E36** | Tentativa isolada de manter a CTA em uma linha | Cabeçalho caiu para **63,28 px**, mas a CTA foi a `153,73×44` e as dez rotas reprovaram: **`scrollWidth 1064 > 1024`**. Restaurado. O plano B do FR-007 já havia sido aplicado; novo breakpoint ou novo aperto são proibidos. Divergência registrada em `FIDELIDADE.md` |
| **E37** | T025 | `--font-size-marca: 18px` já havia entrado no T011 por necessidade de compilação, com origem literal `.nav-brand`; conferido: um token novo, nenhum token existente alterado |
| **E38** | **T027 — matriz completa no build final** | **726 passaram · 0 falharam · 2 puladas e cobertas** · 70/70 combinações públicas com zero overflow · rolagem de **400 px realmente aplicada** em cada medição · alturas 360/390/430/480/768/1280: **62,59 px**, 1024: **71,78 px** · mobile **6 fechado / 15 aberto / 9 acrescentados / zero pequenos** · desktop **14 / zero pequenos** |

## 6. Percurso por teclado (US4 · FR-009 a FR-012, FR-017 a FR-019, FR-042)

**`PERCURSOS DE TECLADO: 7/7`**, em 360 px, só com `page.keyboard.press`. Nenhum `element.focus()`
para posicionar o foco, nenhum `click()` para abrir o painel.

| # | Percurso | Número medido |
| --- | --- | --- |
| **E40** | 1 — primeiro Tab alcança o link de pular | `<a> "Pular para o conteúdo"` · caixa **8,8..52,8 px**, `top=8,8 px`, `:focus-visible=true` · **visível = true** |
| **E41** | 2 — Enter no link move o foco | foco em `<main> id="conteudo-principal"` |
| **E42** | 3 — botão alcançável e acionável | alcançado por Tab · `open` e `aria-expanded="true"` |
| **E43** | 4 — Tab e Shift+Tab não escapam | **28 teclas · 9 destinos distintos · 2 paradas vazias do navegador · 0 escapes para controle da página** |
| **E44** | 5 — Esc fecha e devolve o foco | foco em `testid="abrir-painel"` · `aria-expanded="false"` |
| **E45** | 6 — escolher destino fecha o painel | destino "Sobre" por Enter · painel sem `open` |
| **E46** | 7 — ordem de foco = ordem visual | **5 elementos na sequência · 0 fora de ordem** |

### O contador também precisou provar que contava o conjunto certo

A primeira saída somava os sete percursos e os três casos adicionais no mesmo acumulador:
**`10/7`**. Separar os conjuntos revelou um segundo defeito: com workers paralelos, cada processo
carregava o módulo com o array zerado e a saída virou **`1/7` sete vezes**. Nenhum dos dois números
descrevia a cobertura, embora ambos parecessem medição.

O arquivo passou a rodar em série somente no projeto `largura-360`, com um único `afterAll` depois
dos dois grupos e quatro asserções: total e unicidade de **7 percursos**, total e unicidade de **3
casos adicionais**. Nos seis projetos não aplicáveis, não imprime `0/7`. Prova focada, inclusive
pedindo dez workers com
`npx playwright test tests/e2e/navegacao-teclado.spec.ts --project=largura-360 --reporter=line --workers=10`:
**10 testes rodaram em 1 worker · 10 passaram · uma única saída final**:

```text
PERCURSOS DE TECLADO: 7/7 · CASOS ADICIONAIS: 3/3
```

### As sete demonstrações RP-12 — e **duas** revelaram detector insensível

| # | Violação temporária | Resultado |
| --- | --- | --- |
| 1 | `:focus-visible` deixa o link fora da tela | **falhou** ✅ |
| 2 | `tabIndex={-1}` removido do `<main>` | **PASSOU** ⚠️ |
| 3 | `tabIndex={-1}` no acionador | **falhou** ✅ |
| 4 | `show()` em vez de `showModal()` | **falhou** ✅ |
| 5 | retorno de foco ao acionador removido | **PASSOU** ⚠️ |
| 6 | `onClick={fechar}` removido do destino | **falhou** ✅ |
| 7 | skip link movido para depois do `<header>` | **falhou** ✅ |

**A demonstração 4 é a que mais vale**, porque mostra a asserção medindo o risco certo. Com `show()`
no lugar de `showModal()`, a saída nomeou **9 escapes**, e os nomes são exatamente os controles da
página atrás:

```
Tab 9: "Processo seletivo" | Tab 10: "@liacup.unb" | Tab 11: "liacup.unb@gmail.com"
Tab 14: "LIACUP" | Shift+Tab 5: "Processo seletivo" ...
```

### Os dois detectores insensíveis, e por que não são o mesmo tipo de problema

**Os percursos 2 e 5 continuam verificando o resultado certo. O que eles não conseguem é atribuir
esse resultado ao nosso código** — porque o navegador já faz a mesma coisa sozinho:

| Percurso | O que o Chromium faz sem a nossa linha |
| --- | --- |
| 2 | foca o alvo do fragmento mesmo sem `tabIndex={-1}` |
| 5 | o `<dialog>` devolve o foco a quem o abriu, nativamente, ao fechar |

**Nenhuma das duas linhas foi removida**, e o motivo está escrito: as duas existem para navegadores
em que o comportamento nativo difere, e `tabIndex={-1}` no `<main>` é a recomendação padrão
justamente porque nem todo navegador foca o alvo do fragmento. O que **não** se pode dizer é que
estes testes provam que as linhas são necessárias — eles provam que o **resultado** acontece.

Registrado porque é a distinção que esta obra persegue, aparecendo pelo avesso: aqui a verificação
mede o resultado certo, e a tentação seria concluir que ela valida a implementação. Ela valida o
comportamento; a implementação é uma das duas causas possíveis.

## 7. Estado e propósito anunciados (US5 · FR-013, FR-016, FR-020)

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E50** | Derivação da página atual, unidade | **13 testes**: um destino marcado em cada uma das **dez** rotas, **zero** em `/noticias-antigas`, **zero** em `/projetos-antigos` e estado/região do acionador conferidos |
| **E51** | Marcação nas dez páginas, em 360 e 1280 px | Nove destinos: **2 no DOM · 1 visível · 1 distinto**. Conversão principal: **1 no DOM · 1 visível · 1 distinto**. Token exato `page` em todos os vinte casos |
| **E52** | Pista não cromática, ignorando toda propriedade de cor | Link do menu: **3 diferenças em 360 px · 7 em 1280 px**, encabeçadas por `text-decoration: "underline" vs "none"`. CTA isolada com e sem o estado: **`underline` vs `none`** nas duas larguras |
| **E53** | Nome acessível do painel e estado do botão | `aria-controls="painel-de-navegacao"` · `aria-expanded` de `false` para `true` ao abrir · nome do painel **"Menu de navegação"** |
| **E54** | Landmarks | **1·1·1·1** nas dez rotas, em 360 e 1280 px |
| **E55** | Fecho da fase no build de produção | `npm run verificar`: verde · Vitest: **106/106** · Playwright: **826 casos, 751 passaram, 75 pulados por não aplicabilidade, 0 falharam** · aparência: **31/31 propriedades, 6/6 pares, 0 divergentes** |

### O décimo destino estava fora da implementação — vermelho antes do fecho

O primeiro teste unitário filtrava a conversão principal e, portanto, provava somente as nove rotas
do painel. Ao derivar os casos dos **dez** itens do catálogo e executar
`npm test -- NavegacaoPublica.test.tsx --run`, o vermelho foi nominal:

```text
marca exatamente um destino em /processo-seletivo
esperado 1 · recebido 0
12 passaram · 1 falhou
```

O CTA ficava no Server Component `Cabecalho`, fora da única ilha que conhece `usePathname`. Ele foi
movido para o fragmento de `NavegacaoPublica`, sem mudar sua posição no DOM, sua aparência
compartilhada nem sua disponibilidade fora do painel. Resultado verde: **13/13** na unidade; no
Playwright focado —
`npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "estado e proposito anunciados" --project=largura-360 --project=largura-1280 --reporter=line`
— **5 passaram e 1 foi pulado porque o painel não existe no desktop**, cobrindo as dez rotas em 360
e 1280 px.

### O canal mais forte não estava disponível, e isso fica escrito

A intenção era cobrar **"anunciado"** pela árvore de acessibilidade, como se fez com o `<address>` na
Fase 3. **Medido em 28/08/2026: o `Accessibility.getFullAXTree` deste Chrome não expõe
`aria-current` como propriedade do nó.** O link "Sobre", visível e com `aria-current="page"` no DOM,
volta assim:

```
role=link name="Sobre" ignored=false props=[["focusable",true],["url","http://localhost:3000/sobre"]]
```

Nem `current`, nem nada equivalente. A primeira versão do teste lia zero e eu atribuí ao painel
fechado no mobile — **explicação errada**: o zero aparecia igual em 1280 px, com a navegação visível.
A causa é a ausência da propriedade no canal, não a visibilidade.

**O que o teste passa a provar, e o que não prova:**

| Prova | Como |
| --- | --- |
| Exatamente um destino distinto marcado, e visível | contagem no DOM com `checkVisibility` |
| O token é exatamente `page` | valor comparado; token inválido não seria anunciado |
| Nenhuma marcação fora do catálogo | teste de unidade, com `/noticias-antigas` e `/projetos-antigos` |
| O valor é válido para leitor de tela | axe-core nas dez rotas, regra `aria-valid-attr-value`, **zero violações** |

**Isto é mais fraco que o caso do `<address>`**, onde a árvore expôs o nome e respondeu direto. Fica
registrado qual ferramenta prova o quê, em vez de escrever "anunciado" e deixar a impressão de que a
árvore confirmou.

### Limite real no celular

Nas nove rotas secundárias, a pista fica dentro do painel e aparece quando ele é aberto; navegação
recolhida não consegue mostrar simultaneamente os nove destinos. Na rota de conversão, porém, o CTA
permanece visível e agora mostra a página atual mesmo com o painel fechado. A formulação anterior
dizia que a conversão continuava visível, mas não verificava se ela própria era o destino atual; foi
essa contradição que expôs o décimo caso ausente.

## 8. Conversão da família `.nav` e contraste (US6 · FR-031 a FR-036)

_A preencher na Fase 8._

## 9. Verificação transversal e demonstrações RP-12

_A preencher na Fase 9._

## 10. O que NÃO foi executado, e por quê

_A preencher ao final. Vazio até aqui._

---

## Estado do trabalho no controle de versão

Conferido ao fim de cada fase, conforme `docs/OPERACAO-GIT.md` §4 — **dois números**, porque contar
pendências sozinho não distingue "tudo enviado" de "commit preso na máquina".

| Fase | Pendências (`git status --porcelain \| wc -l`) | `HEAD` igual ao `ls-remote`? |
| --- | --- | --- |
| 1 | _a registrar_ | _a registrar_ |
