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
| **E52** | Pista não cromática no objeto visível, ignorando propriedades de cor | Nas sete larguras: **1 página atual visível · 8 irmãos visíveis · 1 diferença não cromática**, `text-decoration-line: "underline" vs "none"`. Em 360 px o painel é aberto antes da leitura; em 1280 px a navegação direta é lida. CTA visível isolada com e sem o estado: **`underline` vs `none`** |
| **E53** | Nome, papel e estado calculados pelo Chrome | Botão fechado: **`role=button` · `name="Abrir menu de navegação"` · `expanded=false` · `ignored=false`**; ação e propósito observados no nome acessível calculado. Painel aberto: **`role=dialog` · `modal=true` · `name="Menu de navegação"` · `ignored=false`**; propósito observado no nome acessível calculado. **`aria-controls` DOM: 1/1 · alvo DOM com `id="painel-de-navegacao"`: 1/1 · `controls AX: 0/1`**. O anúncio formal da relação **NÃO FOI VERIFICADO neste canal** e não é deduzido do atributo DOM. Limitação aceita por decisão do Gabriel, sem teste manual nesta fase e sem alteração do produto. Depois da abertura, o botão externo fica `ignored=true` por `activeModalDialog`, relacionado ao painel modal |
| **E54** | Landmarks recebidos pela árvore acessível | Matriz AX de **10 rotas × 2 larguras = 20 combinações**: **banner 1 · navigation 1 · main 1 · contentinfo 1**, zero combinação fora de **1·1·1·1**. O contador DOM permanece como defesa estrutural separada |
| **E55** | Estado vigente do fecho da fase no build de produção | **REPROVADO na execução pós-push.** `npx playwright test`: **826 casos contabilizados · 741 passaram · 75 pulados · 9 não rodaram · 1 falhou · `EXIT playwright=1`**. Falha: primeiro Tab focou o skip link com caixa `-24,97..19,03 px`, `:focus-visible=true`, mas `visível=false`. O resultado anterior — **751 passaram · 75 pulados · 0 falharam** — permanece apenas como histórico de uma execução pré-push e **não** é o fechamento vigente. `npm run verificar`: `EXIT verificar=0` · Vitest: **106/106**, `EXIT vitest=0` |
| **E56** | Fechamento corrigido da Fase 7, depois da decisão visual A e das demonstrações RP-12 | Skip link sem transição: caixa **`8,8..52,8 px`**, `top=8,8px`, `:focus-visible=true`, `visivel=true`; prova focada **10/10**, `EXIT teclado=0`. Fase 7 focada: **25 passaram · 1 pulado por painel não aplicável no desktop**, `EXIT fase7-focada=0`. Suíte integral: **826 casos contabilizados · 751 passaram · 75 pulados por não aplicabilidade · 0 falharam · 0 não rodaram · `EXIT playwright=0`**; uma única linha `PERCURSOS DE TECLADO: 7/7 · CASOS ADICIONAIS: 3/3`. Vitest: **12 arquivos · 106/106**, `EXIT vitest=0`; `npm run verificar`: `EXIT verificar=0`; `git diff --check`: `EXIT diff-check=0` |
| **E57** | Emendas de robustez do detector AX | Limite `controls AX: 0/1` aceito; correspondência DOM **1/1 + 1/1**. O tipo preserva os motivos de exclusão e seus nós relacionados. Verde focado: **1 motivo examinado · 1 `activeModalDialog` · 1 relação com `idref="painel-de-navegacao"` · 1 passou · `EXIT ax-painel=0`**. Suíte integral: **826 contabilizados · 751 passaram · 75 pulados · 0 falharam · 0 não executados · `EXIT playwright=0`**. Vitest: **106/106 · `EXIT vitest=0`**. Verificação integrada e integridade do diff repetidas depois da formatação, com os códigos registrados abaixo |

### Emendas de robustez do detector AX — E57

#### Decisão sobre a relação `controls`

- **`aria-controls` DOM: 1/1.** O botão aponta literalmente para `painel-de-navegacao`.
- **Alvo DOM: 1/1.** Existe exatamente um elemento com `id="painel-de-navegacao"`.
- **`controls AX: 0/1`.** A relação não é exposta pelo canal CDP consultado.
- **Anúncio formal da relação: NÃO VERIFICADO neste canal.** Não é deduzido do atributo DOM.
- **Decisão do Gabriel:** aceitar a limitação, sem teste manual com leitor de tela nesta fase e sem
  alterar o produto. Ação e propósito foram observados nos nomes acessíveis calculados do botão
  `"Abrir menu de navegação"` e do diálogo `"Menu de navegação"`.

#### `ignored=true` exige causa e relação exatas

1. **Violação temporária real:** somente o `id` do diálogo foi alterado para
   `painel-de-navegacao-incorreto`; o `aria-controls` do botão permaneceu
   `painel-de-navegacao`.
2. **Comando exato:**
   `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "o painel e o botao expoem nome, papel e estado calculados" --project=largura-360 --reporter=line`.
3. **Vermelho:** **1 motivo `ignored` examinado · 1 `activeModalDialog` · idref recebido
   `painel-de-navegacao-incorreto` · 0 relações com `painel-de-navegacao`**; mensagem
   `Expected: "painel-de-navegacao" · Received: "painel-de-navegacao-incorreto"`; **1 falhou ·
   `EXIT ax-painel=1`**.
4. **Restauração:** o diálogo voltou a `id={ID_DO_PAINEL}`, sem alteração do produto final.
5. **Verde:** **1 motivo `ignored` examinado · 1 `activeModalDialog` · idref recebido
   `painel-de-navegacao` · 1 relação com `painel-de-navegacao`**; DOM **1/1 + 1/1**, AX
   `controls` **0/1**; **1 passou · `EXIT ax-painel=0`**.

#### Fechamento das duas emendas

- Playwright: **826 casos contabilizados · 751 passaram · 75 pulados · 0 falharam · 0 não
  executados · `EXIT playwright=0`**.
- Vitest: **12 arquivos · 106/106 testes · `EXIT vitest=0`**.
- `npm run verificar`: **`EXIT verificar=0`**.
- `git diff --check`: **`EXIT diff-check=0`**.

### Decisão visual A — skip link, vermelho preservado e verde corrigido

1. **Violação temporária nomeada:** transição `top 0.15s ease-in-out`; o foco começava enquanto a
   caixa ainda estava fora da viewport.
2. **Comando exato:**
   `npx playwright test tests/e2e/navegacao-teclado.spec.ts --project=largura-360 --reporter=line --workers=10`.
3. **Vermelho:** primeiro Tab em `<a> "Pular para o conteúdo"`; caixa **`-24,97..19,03 px`**,
   `top=-24,9749px`, `:focus-visible=true`, `visível=false`; **1 falhou · 9 não rodaram ·
   `EXIT teclado=1`**. A execução integral pós-push permanece em E55.
4. **Restauração:** decisão A aplicada: transição removida por completo, junto do bloco
   `prefers-reduced-motion` e dos comentários mortos; nenhuma espera foi acrescentada ao teste.
5. **Verde:** caixa **`8,8..52,8 px`**, `top=8,8px`, `:focus-visible=true`, `visivel=true` logo
   após o Tab; **10 passaram · 7/7 percursos · 3/3 adicionais · uma linha de contagem ·
   `EXIT teclado=0`**.

### Demonstrações RP-12 que reabriram T033

#### Caminhos fora do catálogo

1. **Violação temporária nomeada:** igualdade exata substituída por prefixo para destinos diferentes
   de `/`.
2. **Comando exato:**
   `npx vitest run src/componentes/layout/NavegacaoPublica.test.tsx`.
3. **Vermelho:** `/noticias-antigas` marcou **1** destino (`Notícias`) e
   `/projetos-antigos` marcou **1** (`Projetos`); mensagens `expected [...] to deeply equal []`;
   **2 falharam · 11 passaram · `EXIT navegacao-unidade=1`**.
4. **Restauração:** `caminhoAtual === caminho` restaurado.
5. **Verde:** as duas rotas voltaram a **zero marcações**; **13/13 passaram ·
   `EXIT navegacao-unidade=0`**.

#### Pista não cromática no elemento visível

1. **Violação temporária nomeada:** `text-decoration` e `text-underline-offset` removidos dos
   seletores visíveis `.destino[aria-current='page']` e
   `.destinoDoPainel[aria-current='page']`.
2. **Comando exato:**
   `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "a pista da pagina atual sobrevive" --project=largura-360 --project=largura-1280 --reporter=line`.
3. **Vermelho:** em **360 e 1280 px**, **1 atual visível · 8 irmãos visíveis · 0 diferenças não
   cromáticas**; mensagem `a unica diferenca da pagina atual e a COR`; **2 falharam ·
   `EXIT pista-nao-cromatica=1`**.
4. **Restauração:** sublinhado e deslocamento restaurados nos dois seletores.
5. **Verde:** em **360 e 1280 px**, **1 atual visível · 8 irmãos visíveis · 1 diferença**, literal
   `text-decoration-line: atual "underline" vs outro "none"`; CTA `underline` vs `none`;
   **2 passaram · `EXIT pista-nao-cromatica=0`**. A suíte integral repete a prova nas sete larguras.

#### Nome acessível calculado do diálogo

1. **Violação temporária nomeada:** `aria-label="Menu de navegação"` removido do `<dialog>`.
2. **Comando exato:**
   `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "o painel tem nome acessivel calculado" --project=largura-360 --reporter=line`.
3. **Vermelho:** nó real **`role=dialog · ignored=false · name=""`**; mensagem
   `Expected: "Menu de navegação" · Received: ""`; **1 falhou · `EXIT nome-dialogo=1`**.
4. **Restauração:** nome do diálogo restaurado.
5. **Verde:** nó real **`role=dialog · ignored=false · name="Menu de navegação"`**;
   **1 passou · `EXIT nome-dialogo=0`**.

#### Estado expandido calculado do botão

1. **Violação temporária nomeada:** botão fechado forçado a `aria-expanded={true}`.
2. **Comando exato:**
   `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "o botao expoe nome e estado" --project=largura-360 --reporter=line`.
3. **Vermelho:** nó real fechado **`role=button · name="Abrir menu de navegação" ·
   ignored=false · expanded=true`**; mensagem `Expected: false · Received: true`; **1 falhou ·
   `EXIT estado-expandido=1`**.
4. **Restauração:** `aria-expanded={aberto}` restaurado.
5. **Verde:** antes de abrir, nó real **`expanded=false`**, **1 passou ·
   `EXIT estado-expandido=0`**. Depois de abrir, a consulta parcial devolveu o nó literal como
   `ignored=true` por `activeModalDialog`, relacionado a `painel-de-navegacao`; o Chrome não expôs
   nome, `expanded` ou `controls` nesse estado, e o teste limita explicitamente a alegação.

#### Landmarks recebidos pela árvore acessível

1. **Violação temporária nomeada:** `<footer role="navigation">`, convertendo o rodapé em um segundo
   landmark de navegação e removendo seu papel de `contentinfo`.
2. **Comando exato:**
   `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "tem exatamente uma região de cada papel" --project=largura-360 --project=largura-1280 --reporter=line`.
3. **Vermelho:** nas **20 combinações AX**, `banner 1 · navigation 2 · main 1 · contentinfo 0`;
   mensagem `landmarks recebidos pela arvore acessivel`; **20 falharam ·
   `EXIT landmarks-ax=1`**.
4. **Restauração:** papel explícito removido; `<footer>` voltou ao papel nativo.
5. **Verde:** nas **20 combinações AX**, `banner 1 · navigation 1 · main 1 · contentinfo 1`;
   **20 passaram · `EXIT landmarks-ax=0`**.

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

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E55** | Declarações de cor **derivadas** dos três componentes da moldura | **11 declarações**, das quais **8 exigem par medido** (3 são superfície) |
| **E56** | Pares de contraste medidos | **10 pares · 0 declarações sem medição** |
| **E57** | Bordas | **3 medidas · 3 com veredito e motivo escritos** |
| **E58** | **T037 — vermelho.** `--color-accent-700` → `--color-accent` na linha 124 do `NavegacaoPublica.module.css` | **EXIT=1** · `link atual e hover na navegacao direta ... razao 3.48:1 · limite 4.5:1 · REPROVA` e `link atual e hover no painel ... 3.09:1 · limite 4.5:1 · REPROVA` |
| **E59** | **T037 — verde**, depois de restaurar | **EXIT=0** · 8 declarações derivadas · 10 pares · 0 sem medição |
| **E60** | **T038 —** família `.nav` no `liacup.css` | **0 ocorrências** de `^.nav`, e a pendência do cabeçalho removida junto |
| **E61** | **T038 —** contagem de seletores pendentes | **27 → 22**, por comando reproduzível escrito no próprio banner |
| **E62** | **T039 —** tokens existentes alterados | **0 linhas** removidas ou alteradas no diff de `tokens.css` contra a `main` |
| **E63** | **T039 —** tokens acrescentados | **1**: `--font-size-marca: 18px`, origem literal `.nav-brand` |
| **E64** | Suíte de ponta a ponta completa | **752 passaram · 0 falharam · 81 puladas** |
| **E65** | Unidade | **12 arquivos · 106 testes** |

### O conjunto de pares é derivado, e por isso ele achou o que "nove" escondia

A tarefa falava em **nove** combinações. Nove era contado à mão. Derivando das declarações de cor
que os três componentes escrevem, o número real de pares medidos é **dez** — e a diferença não é
aritmética: o **ícone do acionador do painel** (`--color-accent-700` sobre `--color-bg`, 6,91:1)
não estava na lista de nove. Ele é a única coisa visível do painel no mobile antes de alguém tocar
nele.

O detector imprime **declarações derivadas**, **pares medidos** e **declarações sem medição**. Regra
de cor nova em qualquer um dos três arquivos aparece como declaração sem medição, e o teste fica
vermelho até alguém medi-la.

**Um falso positivo do próprio derivador, corrigido antes de valer:** a primeira versão aceitava
qualquer `var()` numa propriedade `border*`, e `border-radius: var(--radius-pill)` entrou como se
fosse cor. Um par a mais, vindo de uma declaração sem nada a medir, é o mesmo defeito da lista
digitada — só que com cara de derivação. Passou a exigir referência a cor.

### O limite é derivado do veredito

Borda julgada **necessária** carrega o mínimo de 3:1 da SC 1.4.11; julgada **decorativa** não tem
mínimo. O limite não é escrito ao lado do veredito: é **calculado a partir dele**. Assim não existe o
estado em que alguém marca "necessária" e esquece o 3:1 — e trocar o veredito de uma borda é
suficiente para o teste passar a cobrá-la.

Os três vereditos, com o critério e o motivo de cada um, estão no `FIDELIDADE.md`. O da borda do
cabeçalho é o mais discutível e está escrito por extenso, com o caminho de conserto pronto caso a
coordenação decida o contrário.

### Uma imprecisão do meu registro, declarada

No detector, o **hex é medido** e o **nome do token é digitado** ao lado. Na demonstração vermelha
isso apareceu: a saída imprimiu `--color-accent-700 #9b6aaf`, quando `#9b6aaf` é o
`--color-accent`. O número está certo e o rótulo mentiu.

Fica registrado porque é a mesma família de tudo o que esta feature vem catalogando: o hex é
resultado, o nome é configuração, e só o primeiro sobrevive a alguém mexer no CSS. Quem ler a saída
deve confiar no hex.

## 9. Verificação transversal e demonstrações RP-12

### T042 — os dois agregados, derivados

```
[largura-360] páginas verificadas: 10/10 · combinações página/largura: 7 larguras × 10 destinos = 70/70
```

O **70** sai de `LARGURAS` (importado do `playwright.config.ts`) × `DESTINOS_PUBLICOS`. Nenhum dos
dois é digitado. Há asserção contra a matriz perder larguras: uma largura removida encolheria o
total sem nenhum caso ficar vermelho, e a matriz diria "70/70" do que sobrou.

### T043 — o 11º destino, e a guarda que impedia a demonstração

**Primeira tentativa, e o achado.** Acrescentei `Parcerias` ao catálogo sem tocar em consumidor
nenhum, e o **build caiu antes de qualquer verificador rodar**:

```
Catálogo de destinos públicos inválido: esperados 10 destinos, encontrados 11.
```

A causa era `QUANTIDADE_ESPERADA = 10` no adaptador. Reportei em vez de contornar, e a contagem que
eu trouxe estava incompleta: eu disse "dois lugares"; a coordenação contou **cinco**, e um deles era
um `toBe(9)` num arquivo que **não importava o catálogo nenhuma vez** — o `navegacao-teclado.spec.ts`,
enquanto o arquivo irmão escrevia `DESTINOS_PUBLICOS.length - 1` em duas linhas. Mesma feature,
mesma quantidade, dois métodos.

**A decisão, com a hierarquia da constitution resolvendo sozinha**: o `data-model.md` é plano
(nível 5), o FR-044 e o SC-017 são spec (nível 4), e o número menor vence. A guarda saiu. Não foi a
spec cedendo ao plano — foi o plano voltando para dentro dela.

| Onde | Antes | Depois |
| --- | --- | --- |
| `destinos-publicos.ts:40` | `QUANTIDADE_ESPERADA = 10` | removido; sobra `itens.length === 0`, que é propriedade |
| `navegacao-teclado.spec.ts:216` | `toBe(9)` | `toBe(DESTINOS_PUBLICOS.length - 1)`, com o catálogo importado |
| `paginas-publicas.spec.ts:521` | `toBe(70)` | **fica**, como âncora deliberada, com o motivo escrito |
| `destinos-publicos.test.ts` | dez pares digitados | **fica** — ali é o contrato declarado |
| `data-model.md` §1 | "exatamente 10 itens" | **fica**, agora dizendo **onde** é cobrado |

**As validações estruturais do `validar()` ficaram todas**: catálogo não vazio, rótulo não vazio,
caminho absoluto, ausência de barra final, rótulos e caminhos sem repetição e uma conversão
principal. O tamanho era a contagem de hoje congelada. A nova condição de carregamento é
`itens.length > 0`; o conjunto vigente de dez pares continua cobrado pelo contrato fechado em
`destinos-publicos.test.ts`.

A guarda de catálogo vazio foi exercitada separadamente. Violação temporária: substituir somente o
conteúdo do JSON por `[]`.

```text
COMANDO: npx vitest run src/componentes/layout/destinos-publicos.test.ts
Error: Catálogo de destinos públicos inválido: catálogo vazio. Corrija src/componentes/layout/destinos-publicos.json — ele é a fonte única de FR-044.
Test Files  1 failed (1)
Tests  no tests
EXIT catalogo-vazio=1
```

Depois de restaurar literalmente os dez itens:

```text
COMANDO: npx vitest run src/componentes/layout/destinos-publicos.test.ts
Test Files  1 passed (1)
Tests  8 passed (8)
EXIT catalogo-restaurado=0
```

**A demonstração refeita, com os três vermelhos nominais e nenhum consumidor tocado.** Os comandos
são os pontos de entrada reais dos três detectores; as saídas abaixo foram preservadas da execução
com `/parcerias` no catálogo:

| Verificador | Comando | Saída literal preservada | Código |
| --- | --- | --- | ---: |
| Playwright | `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "a matriz cobre todos os destinos do catálogo" --project=largura-360 --reporter=line` | `páginas verificadas: 10/11` · `7 larguras × 11 destinos = 77/77` · `destinos do catálogo sem rota: /parcerias` | **1** |
| Lighthouse | `npx lhci autorun` | `Runtime error ... (Status code: 404)` | **1** |
| Pós-verificador | `node scripts/verificar-paginas-lighthouse.mjs` | `caminhos medidos: 10/11` · `relatorios lidos: 30/33` · `/parcerias: NENHUM relatorio` | **1** |

O Vitest **NÃO FOI EXECUTADO durante o vermelho com o 11º destino**. Não se infere contador: o
contrato fechado conserva `toHaveLength(10)` e os dez pares, portanto uma execução nesse estado
poderia acrescentar falhas além dos três verificadores nominais acima.

**O 70 → 77 é o que faltava.** A demonstração anterior, removendo uma rota, deixava
`DESTINOS_PUBLICOS.length` em 10 — então a parte que o FR-044 existe para provar, **a contagem
seguindo o catálogo**, nunca tinha sido vista mudando.

**Restauração medida em 28/08/2026:**

```text
COMANDO: npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "a matriz cobre todos os destinos do catálogo" --project=largura-360 --reporter=line
[largura-360] páginas verificadas: 10/10 · combinações página/largura: 7 larguras × 10 destinos = 70/70
1 passed (13.6s)
EXIT matriz-focada=0
```

```text
COMANDO: npm run test:desempenho
Checking assertions against 10 URL(s), 30 total run(s)
caminhos do catalogo: 10
caminhos medidos: 10/10
relatorios lidos: 30/30
execucoes por caminho esperadas: 3
perfil exigido: mobile / simulate
problemas encontrados: 0
10/10 caminhos e 30/30 relatorios, todos em mobile/simulate, sem redirecionamento e sem erro de status.
EXIT test-desempenho=0
```

O pós-verificador também foi repetido sozinho: `node scripts/verificar-paginas-lighthouse.mjs`
imprimiu `caminhos medidos: 10/10`, `relatorios lidos: 30/30`, `problemas encontrados: 0` e
`EXIT pos-verificador=0`.

**Validações transversais vigentes desta parada:**

```text
COMANDO: npx vitest run
Test Files  12 passed (12)
Tests  106 passed (106)
EXIT vitest=0

COMANDO: npx playwright test
Running 833 tests using 10 workers
81 skipped
752 passed (1.6m)
EXIT playwright=0

COMANDO: npm run verificar
artefatos gerados rastreados indevidamente: 0
All matched files use Prettier code style!
Nenhuma cor ou medida escrita a mao fora dos arquivos de token.
22 seletores contados, e o banner declara 22.
nenhuma ocorrencia do valor nem do nome da chave de servico.
EXIT verificar=0

COMANDO: GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=safe.directory GIT_CONFIG_VALUE_0=C:/Dev/portal-liacup git diff --check
EXIT diff-check=0
```

**Restauração e resíduos.** As cinco buscas abaixo não encontraram ocorrência; `rg` devolve 1
justamente quando não há correspondência:

```text
rg -n --fixed-strings '/parcerias' src tests scripts lighthouserc.cjs package.json
EXIT busca-parcerias=1 — nenhuma ocorrência
rg -n --fixed-strings 'QUANTIDADE_ESPERADA' src tests
EXIT busca-guarda=1 — nenhuma ocorrência
rg -n --fixed-strings 'toBe(9)' src tests
EXIT busca-toBe9=1 — nenhuma ocorrência
rg -n --fixed-strings 'a matriz cobre todos os destinos do catálogo, e nenhum a mais' tests
EXIT busca-titulo-antigo=1 — nenhuma ocorrência
rg --files -g '*parcerias*' -g '*.tmp' -g '*.bak' -g '*tempor*'
EXIT busca-arquivos-temporarios=1 — nenhum arquivo
```

O título vigente é `a matriz cobre todos os destinos do catálogo`; o teste de teclado deriva os
nove destinos secundários por `DESTINOS_PUBLICOS.length - 1`. O `toBe(70)` permanece no teste da
matriz como âncora deliberada: a derivação declara quanto foi percorrido, e a âncora reprova se uma
largura ou a composição fechada vigente encolher ou crescer sem revisão consciente.

### A demonstração por remoção de rota fica no registro

Ela exercita a outra ponta — destino que existe e rota que sumiu — e os três verificadores ficaram
vermelhos nomeando `/eventos`: `páginas verificadas: 9/10`, `Status code: 404`, e
`caminhos medidos: 1/10 · relatorios lidos: 3/30`.

O `1/10` do pós-verificador tem explicação e não é defeito: o `lhci` abortou no 404 e **não escreveu
manifest novo**, então o script leu o anterior. É o quarto caso que ele existe para pegar —
relatório velho inflando contagem — e ele não se enganou.

### Item para a F04, com o número que o sustenta

O teste da matriz se chamava *"a matriz cobre todos os destinos do catálogo, **e nenhum a mais**"*, e
a segunda metade **não era medida por nada**: **zero** verificações do repositório enumeram
`src/app/(site)` para comparar com o catálogo. Uma rota criada sem destino correspondente não é
pega pela validação, nem pelo E2E, nem pelo Lighthouse.

**Feito agora, custo zero**: o título passou a dizer o que ele mede.

**Proposto para a F04, e é decisão do Gabriel**: a igualdade de conjunto nas duas direções — rotas
derivadas de `readdirSync('src/app/(site)')` de um lado, catálogo do outro — pegaria remoção,
acréscimo sem rota **e** rota sem destino. É verificador novo, script novo, passo de CI novo e
demonstração de RP-12 nova; pelo Princípio 5, vira spec nova e não linha extra na última fase desta.

### T044 — rota/status, landmarks, altura, overflow e alvos

#### Inventário das asserções

| Família | Teste exato | Asserções | Resultado real × configuração | Evidência anterior | O que faltava |
| --- | --- | ---: | --- | --- | --- |
| Rota/status | `responde sem erro e não redireciona para outro destino` | **3** | **3 reais**: resposta não nula, status `<400`, pathname final igual ao catálogo | E15/E16 não têm o mesmo comando vermelho/verde nem código verde | demonstração completa nova |
| Rota/status | `a matriz cobre todos os destinos do catálogo` | **4** | **2 reais**: ausentes e total de respostas `<400`; **2 de configuração/contrato**: 7 larguras e 70 combinações | **T043 completa** | nada; reutilizada |
| Landmarks | `tem exatamente uma região de cada papel` | **2** | **2 reais**: papéis calculados na árvore AX em 360/1280 e defesa estrutural DOM | **E54 + demonstração RP-12 completa** | nada; reutilizada |
| Altura | `o cabeçalho cabe no orçamento e permanece visível ao rolar` | **4** | **4 reais**: header encontrado, altura renderizada, rolagem aplicada e topo depois da rolagem | E31/E33 não têm o mesmo comando verde e todos os códigos | demonstração completa nova da altura; permanência roda no mesmo teste |
| Overflow | `não gera rolagem horizontal` | **1** | **1 real**: `scrollWidth <= clientWidth` da geometria renderizada | E36 não tem comando, códigos e verde equivalente | demonstração completa nova |
| Alvos | `nenhum alvo de toque abaixo de 44 px` | **4** | **4 reais**: cobertura fechada, pequenos fechados, destinos que entram ao abrir e pequenos abertos; a terceira compara o resultado ao tamanho derivado do catálogo | E15/E34/E38 não formam par com mesmo comando e códigos | demonstração completa nova no painel aberto |
| Alvos | `o acionador do painel tem alvo de toque suficiente` | **2** | **2 reais**: largura e altura de `boundingBox()` contra 44 px | só verdes agregados | demonstração completa nova específica |

Totais: **rota/status 7 asserções (5 de resultado, 2 de configuração) · landmarks 2 · altura 4 ·
overflow 1 · alvos 6**. Foram executadas **5 demonstrações novas** e reutilizadas **2 evidências
anteriores completas**: T043 para a cobertura da matriz e E54 para landmarks.

#### Demonstrações isoladas

| Família | Violação | Comando | Vermelho | EXIT | Restauração | Verde | EXIT |
| --- | --- | --- | --- | ---: | --- | --- | ---: |
| Rota/status | Somente o caminho de `Sobre` no catálogo: `/sobre` → `/rota-t044-ausente`; nenhuma rota criada | `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "responde sem erro e não redireciona para outro destino" --project=largura-360 --reporter=line` | `/rota-t044-ausente: status 404` · `Expected: < 400` · `Received: 404` · **1 falhou · 9 passaram** | **1** | caminho restaurado para `/sobre` | **10 passaram** | **0** |
| Landmarks — **reuso E54** | `<footer role="navigation">`: segundo `navigation` e perda de `contentinfo` | `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "tem exatamente uma região de cada papel" --project=largura-360 --project=largura-1280 --reporter=line` | 20 combinações AX: `banner 1 · navigation 2 · main 1 · contentinfo 0` · **20 falharam** | **1** | papel explícito removido; papel nativo restaurado | 20 combinações AX: `banner 1 · navigation 1 · main 1 · contentinfo 1` · **20 passaram** | **0** |
| Altura | Somente `padding` vertical do `.cabecalho`: `--space-2` → `--space-3` | `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "o cabeçalho cabe no orçamento e permanece visível ao rolar" --project=largura-360 --reporter=line` | `<header>` em 360 px: **71,38 px**, `Expected: <= 64`, `Received: 71.38` nas dez rotas · **10 falharam** | **1** | `padding` vertical restaurado para `--space-2` | `<header>` **62,59 px** nas dez rotas; permanência também executada · **10 passaram** | **0** |
| Overflow | Somente `.cabecalho`: `width: calc(100vw + var(--space-6))` | `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "não gera rolagem horizontal" --project=largura-360 --reporter=line` | geometria real: `scrollWidth 386 maior que clientWidth 360`, `Expected: <= 360`, `Received: 386` nas dez rotas · **10 falharam** | **1** | declaração de largura removida | **10 passaram** | **0** |
| Alvos do painel | Somente `.destinoDoPainel`: `min-height: var(--space-6)`; links continuaram visíveis e acessíveis | `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "nenhum alvo de toque abaixo de 44 px" --project=largura-360 --reporter=line` | fechado: **6 medidos · 0 pequenos**; aberto: **15 medidos · 9 acrescentados · 9 pequenos**; cada link **269,8×26,4**, mínimo 44 · **10 falharam** | **1** | `min-height` temporário removido | fechado **6/0**; aberto **15/9/0** · **10 passaram** | **0** |
| Alvo do acionador | Somente `.acionador`: largura `--alvo-de-toque` → `--space-6`; altura e visibilidade preservadas | `npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "o acionador do painel tem alvo de toque suficiente" --project=largura-360 --reporter=line` | `[360px] acionador: 26.390625×44` · mínimo `>=44` · **1 falhou** | **1** | largura restaurada para `--alvo-de-toque` | `[360px] acionador: 44×44` · **1 passou** | **0** |
| Cobertura da matriz — **reuso T043** | 11º destino `/parcerias`, sem rota nem consumidor | comando focado registrado em T043 | `10/11` · `77/77` · `/parcerias` nomeada · **1 falhou** | **1** | catálogo literal de dez destinos restaurado | `10/10` · `70/70` · **1 passou** | **0** |

Validação focada conjunta, depois de todas as restaurações:

```text
COMANDO: npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "responde sem erro|tem exatamente uma região de cada papel|não gera rolagem horizontal|o cabeçalho cabe no orçamento|nenhum alvo de toque abaixo de 44 px|a matriz cobre todos os destinos do catálogo|o acionador do painel tem alvo de toque suficiente" --reporter=line
Running 364 tests using 10 workers
2 skipped
362 passed (1.1m)
EXIT t044-focada=0
```

As duas puladas são o teste específico do acionador nos projetos 1024 e 1280 px, onde ele não
existe por contrato; os alvos desktop continuam medidos pelo varredor geral, com **14 alvos e zero
pequenos**.

A prova de rota/status acima é especificamente de **rota ausente**, não de redirecionamento: a
resposta existiu, trouxe **404** e reprovou antes da asserção seguinte. O mesmo teste mede
separadamente o pathname final e o compara ao caminho do catálogo quando a resposta tem status
abaixo de 400; não se declara aqui uma demonstração de redirecionamento que não foi executada.

O reuso de landmarks preserva os limites da Fase 7: o resultado calculado é lido pelo canal AX
somente em 360 e 1280 px, e a contagem DOM permanece uma defesa estrutural separada. A violação e o
verde têm comando, contador e código próprios, portanto E54 satisfaz integralmente T044 sem nova
execução.

### T045 — sete percursos de teclado e três casos adicionais

#### Inventário e decisão de reuso

O arquivo contém exatamente **7 percursos principais + 3 casos adicionais**. Os dez casos rodam no
projeto `largura-360`; os percursos principais usam modo serial, e o fechamento integral foi
executado explicitamente em um worker.

| Caso | Invariante medida | Evidência anterior | Campos presentes | O que faltava |
| --- | --- | --- | --- | --- |
| 1 — primeiro Tab/skip visível | elemento focado, caixa na viewport, `:focus-visible` e visibilidade real | **E55 + E56**, em “Decisão visual A” | violação, comando, medição nominal, contador/código vermelho, restauração, mesmo comando verde, contador/código verde | nada; **reutilizada** |
| 2 — skip move foco ao `main` | `document.activeElement.id` depois de Enter | E41 + tabela antiga RP-12 | resultado verde e tentativa sem `tabIndex` que continuou verde | demonstração completa que alcançasse a asserção |
| 3 — botão alcançável/acionável | Tab chega ao acionador; Enter abre o painel e muda o estado | E42 + tabela antiga RP-12 | resultado e violação descritos | comando, saídas, contadores, códigos, restauração e verde equivalente |
| 4 — ciclo Tab/Shift+Tab | 28 teclas, destinos percorridos e nenhum controle externo alcançado | E43 + tabela antiga RP-12 | medição verde e vermelho de 9 escapes | comando, códigos, contadores, restauração e verde equivalente |
| 5 — Esc/retorno | painel fechado, foco no acionador e `aria-expanded=false` | E44 + tabela antiga RP-12 | verde; retirada antiga do foco explícito continuou verde pela restituição nativa | violação que alcançasse uma asserção de resultado e ciclo completo |
| 6 — destino por teclado | Enter navega para o `href` focado e deixa o diálogo fechado | E45 + tabela antiga RP-12 | fechamento verde e violação descritos; a URL era só impressa antes de terminar | asserção da navegação real e demonstração completa |
| 7 — ordem visual | sequência observada de Tab comparada à geometria | E46 + tabela antiga RP-12 | verde e violação descritos | comando, códigos, contadores, restauração e verde equivalente |
| 8 — resize | painel fecha, overflow é restaurado e foco não fica invisível | registro explicativo posterior | invariante e verde agregado | demonstração completa individual |
| 9 — backdrop | clique no próprio backdrop fecha e devolve foco | verde agregado | comportamento final | demonstração completa individual |
| 10 — scroll lock | durante=`hidden`; depois=valor inline anterior | verde agregado | comportamento final | valor anterior não vazio e demonstração completa individual |

Somente o caso 1 satisfazia todos os campos e foi reutilizado. Foram executadas **9 demonstrações
novas**. A execução completa anterior `7/7 · 3/3`, sozinha, não foi usada como substituta das
provas individuais.

#### Correções de sensibilidade do próprio detector

- O `afterAll` cobrava `7/7 · 3/3` até em execução filtrada para um caso. Agora conta os casos
  realmente executados: em execução focada não emite nem exige agregado; na execução integral, com
  dez casos executados, as quatro asserções de total e unicidade continuam obrigatórias. Nenhuma
  asserção de comportamento foi removida ou afrouxada.
- O percurso 6 agora captura o `href` do elemento realmente focado e espera a URL correspondente.
  Antes, uma execução verde imprimiu `destino "Sobre" · URL: /`: comprovava fechamento, mas não a
  navegação. Essa execução não foi contada; o vermelho e o verde abaixo foram refeitos depois da
  correção.
- O scroll lock agora começa com `body.style.overflow="clip"`. Com o valor anterior vazio,
  restaurar corretamente e simplesmente executar `overflow = ''` eram indistinguíveis. O valor
  não vazio torna a preservação observável.
- No backdrop, a mensagem deixou de afirmar estaticamente “painel fechado” e passou a imprimir o
  valor real de `HTMLDialogElement.open`.

#### Demonstrações isoladas

Todos os comandos novos abaixo são idênticos entre vermelho e verde, usam somente o teste
correspondente, o projeto `largura-360` e um worker.

| Caso | Violação | Comando | Vermelho | EXIT | Restauração | Verde | EXIT |
| --- | --- | --- | --- | ---: | --- | --- | ---: |
| 1 — skip visível — **reuso E55/E56** | transição `top 0.15s ease-in-out` manteve a caixa parcialmente fora da viewport no primeiro frame | `npx playwright test tests/e2e/navegacao-teclado.spec.ts --project=largura-360 --reporter=line --workers=10` | caixa `-24,97..19,03 px` · `:focus-visible=true` · `visível=false` · **1 falhou · 9 não rodaram** | **1** | transição removida por decisão visual A, sem espera no teste | caixa `8,8..52,8 px` · `:focus-visible=true` · `visível=true` · **10 passaram** | **0** |
| 2 — foco no `main` | `href` do skip apontou somente para `#conteudo-inexistente-t045` | `npx playwright test tests/e2e/navegacao-teclado.spec.ts --grep "2 — acionar o link move o FOCO para o conteúdo principal" --project=largura-360 --reporter=line --workers=1` | `depois do Enter, foco em: <a> id=""` · esperado `conteudo-principal`, recebido vazio · **1 falhou** | **1** | `href="#conteudo-principal"` restaurado | `depois do Enter, foco em: <main> id="conteudo-principal"` · **1 passou** | **0** |
| 3 — botão alcançável/acionável | somente `tabIndex={-1}` no acionador, que saiu da ordem de Tab | `npx playwright test tests/e2e/navegacao-teclado.spec.ts --grep "3 — o botão do painel é alcançável e acionável por teclado" --project=largura-360 --reporter=line --workers=1` | `botão do painel alcançado por Tab: false` · esperado `true` · **1 falhou** | **1** | `tabIndex` temporário removido | `botão do painel alcançado por Tab: true`; Enter abriu o diálogo e confirmou o estado · **1 passou** | **0** |
| 4 — ciclo de foco | somente `show()` no lugar de `showModal()`; o fundo deixou de ficar inerte | `npx playwright test tests/e2e/navegacao-teclado.spec.ts --grep "4 — com o painel aberto, Tab percorre e VOLTA ao início" --project=largura-360 --reporter=line --workers=1` | **28 teclas · 9 destinos · 2 paradas vazias · 9 escapes**, nomeando CTA, contatos, skip e marca · **1 falhou** | **1** | `showModal()` restaurado | **28 teclas · 9 destinos · 2 paradas vazias · 0 escapes** · **1 passou** | **0** |
| 5 — Esc/retorno | listener temporário de `cancel` chamou `preventDefault()`, impedindo o Esc de fechar | `npx playwright test tests/e2e/navegacao-teclado.spec.ts --grep "5 — Esc fecha e devolve o foco ao botão" --project=largura-360 --reporter=line --workers=1` | diálogo permaneceu com `open=""`; esperado sem atributo `open` · **1 falhou** | **1** | listener temporário removido; comportamento nativo restaurado | painel fechado · foco em `testid="abrir-painel"` · `aria-expanded=false` · **1 passou** | **0** |
| 6 — destino/fechamento | somente `onClick={fechar}` removido do link do painel | `npx playwright test tests/e2e/navegacao-teclado.spec.ts --grep "6 — escolher um destino pelo teclado fecha o painel" --project=largura-360 --reporter=line --workers=1` | Enter navegou de fato: `"Sobre" · URL: /sobre`; diálogo permaneceu `open` · **1 falhou** | **1** | `onClick={fechar}` restaurado | Enter navegou para `URL: /sobre` e o diálogo ficou sem `open` · **1 passou** | **0** |
| 7 — ordem visual | skip link movido temporariamente para depois do `<header>` | `npx playwright test tests/e2e/navegacao-teclado.spec.ts --grep "7 — a ordem de foco corresponde à ordem visual" --project=largura-360 --reporter=line --workers=1` | **5 elementos · 1 fora da ordem**, nominalmente `Pular para o conteúdo` · **1 falhou** | **1** | skip restaurado antes do `<header>` | **5 elementos · 0 fora da ordem visual** · **1 passou** | **0** |
| 8 — resize | no breakpoint desktop, `display:none` foi trocado somente por `opacity:0`; o elemento invisível continuou focável | `npx playwright test tests/e2e/navegacao-teclado.spec.ts --grep "redimensionar para desktop com o painel aberto destrava a rolagem e não deixa foco órfão" --project=largura-360 --reporter=line --workers=1` | `overflow="" · painel aberto=false · foco em <button> · foco orfao=true` · **1 falhou** | **1** | `display:none` restaurado | `overflow="" · painel aberto=false · foco em <body> · foco orfao=false` · **1 passou** | **0** |
| 9 — backdrop | somente o registro do listener `click` do diálogo foi removido | `npx playwright test tests/e2e/navegacao-teclado.spec.ts --grep "clicar no backdrop fecha e devolve o foco ao acionador" --project=largura-360 --reporter=line --workers=1` | clique nas coordenadas do backdrop: `painel aberto=true · foco em testid="painel-de-navegacao"` · **1 falhou** | **1** | listener `click` restaurado | `painel aberto=false · foco em testid="abrir-painel"` · **1 passou** | **0** |
| 10 — scroll lock | restauração correta trocada somente por `document.body.style.overflow = ''` | `npx playwright test tests/e2e/navegacao-teclado.spec.ts --grep "a rolagem do fundo é travada e restaurada ao valor anterior" --project=largura-360 --reporter=line --workers=1` | `antes="clip" · durante="hidden" · depois=""`; esperado `clip`, recebido vazio · **1 falhou** | **1** | atribuição por `overflowAnterior.current` restaurada | `antes="clip" · durante="hidden" · depois="clip"` · **1 passou** | **0** |

A primeira tentativa de provocar o percurso 5 desviando o foco dentro do evento `close` continuou
verde: a restituição nativa do `<dialog>` prevaleceu. Ela não foi contada como demonstração. O
vermelho registrado é o bloqueio real do evento `cancel`, que alcançou a asserção de fechamento;
o verde subsequente confirmou conjuntamente fechamento, foco no acionador visível e estado
`aria-expanded=false`.

#### Agregado final

```text
COMANDO: npx playwright test tests/e2e/navegacao-teclado.spec.ts --project=largura-360 --reporter=line --workers=1
Running 10 tests using 1 worker
percurso 7/7 verificado: ordem de foco corresponde à ordem visual
caso adicional 3/3 verificado: trava de rolagem restaura o valor anterior
PERCURSOS DE TECLADO: 7/7 · CASOS ADICIONAIS: 3/3
10 passed (11.4s)
EXIT teclado-agregado=0
```

Houve **uma única linha agregada**, **10 testes passados**, **zero falhas**, **zero não executados**
e código **0**.

#### Restauração e validações locais da T045

```text
COMANDO: npx prettier --write specs/004-layout-base/EVIDENCIAS-F03.md specs/004-layout-base/tasks.md tests/e2e/navegacao-teclado.spec.ts
EXIT prettier-t045=0

COMANDO: GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=safe.directory GIT_CONFIG_VALUE_0=C:/Dev/portal-liacup git diff --check
EXIT diff-check=0
```

As buscas no código por `#conteudo-inexistente-t045`, `tabIndex={-1}` no acionador,
`painel.current?.show()`, listener temporário de `cancel`, `opacity: 0;` no CSS do painel,
desvio para `marca-do-cabecalho` e `document.body.style.overflow = ''` encerraram com código **1**:
nenhuma ocorrência. A menção ao fragmento temporário permanece apenas nesta evidência, de
propósito. As confirmações positivas encontraram exatamente a fiação restaurada:
`dialogo.addEventListener('click', aoClicar)`, `onClick={fechar}` e restauração por
`overflowAnterior.current`, todas com código **0**. O diff dos três arquivos de produto usados nas
violações — `NavegacaoPublica.tsx`, `NavegacaoPublica.module.css` e `layout.tsx` — ficou vazio.

### T046 — aparência calculada e pós-verificador do Lighthouse

#### Inventário antes das violações

| Detector | Entrada observada | Saída nominal esperada | Evidência anterior completa |
| --- | --- | --- | --- |
| Aparência calculada | seis pares `button`/`link`; propriedades derivadas de `AparenciaDeBotao.module.css` | quantidade de propriedades, par e diferenças `propriedade: botao … contra link …` | **não**; E25 continha somente o verde |
| Cobertura | catálogo, 30 entradas do manifest e os JSONs apontados | caminho sem relatório e contagens de caminhos/relatórios | **sim; T043**, com `/parcerias`, códigos e restauração |
| `formFactor` | `configSettings.formFactor` | recebido contra `mobile` | **não**; E7 só registrava o perfil correto |
| `throttlingMethod` | `configSettings.throttlingMethod` | recebido contra `simulate` | **não** |
| Status | `audits["http-status-code"].score` | caminho e auditoria nominalmente reprovada | **não**; o 404 de T043 ocorreu antes de gerar novo relatório |
| URL final | `finalDisplayedUrl ?? finalUrl ?? entrada.url` | caminho pedido, caminho final e redirecionamento | **não** |

A categoria de perfil foi tratada como **duas verificações e duas demonstrações**, sem fundir os
contadores.

#### Validade do conjunto basal

O manifest vigente tinha **30 entradas e 30 JSONs distintos apontados, todos existentes**, com
exatamente três entradas por cada uma das dez rotas. Os 72 `.report.json` antigos soltos na pasta
não foram contados: o verificador leu somente os nomes apontados pelo manifest. O manifest foi
gravado em `2026-08-28T20:26:52.392Z`; os 30 relatórios apontados têm `mtime` entre
`20:26:52.178Z` e `20:26:52.391Z`, confirmando o mesmo lote materializado pelo manifest.

```text
COMANDO: node scripts/verificar-paginas-lighthouse.mjs
caminhos do catalogo: 10
caminhos medidos: 10/10
relatorios lidos: 30/30
execucoes por caminho esperadas: 3
perfil exigido: mobile / simulate
problemas encontrados: 0
10/10 caminhos e 30/30 relatorios, todos em mobile/simulate, sem redirecionamento e sem erro de status.
EXIT lighthouse-basal=0
```

Antes das cópias controladas:

```text
SHA256 manifest=C369587129E7A7CCEA97AA694D7EE4D03463C2DE9785995E000D22B297B21DE8
relatorio escolhido=localhost--2026_08_28_20_20_22.report.json
SHA256 relatorio original=6CCACE8B811A9A6AE2C2C1F20022CF6F1F820DFB88D61A9FDC1F6007662A99FF
```

Para as quatro demonstrações do pós-verificador, o relatório original nunca foi alterado. Uma
cópia temporária foi criada, somente a primeira entrada de uma cópia controlada do manifest
apontou para ela, e apenas o campo nomeado em cada linha abaixo foi mudado. Depois de cada vermelho,
o manifest original foi reposto antes do verde e a cópia do relatório foi removida.

#### Demonstrações isoladas

| Detector | Violação isolada | Comando | Vermelho | EXIT | Restauração | Verde | EXIT |
| --- | --- | --- | --- | ---: | --- | --- | ---: |
| Aparência calculada — **nova** | somente o link do par `primario-normal` recebeu `min-height: var(--space-8)` por seletor local da vitrine; a propriedade pertence à lista derivada | `npx playwright test tests/e2e/vitrine.spec.ts --grep "os seis pares botao/link tem aparencia calculada identica" --project=largura-360 --reporter=line` | **31 derivadas/31 reconhecidas · 6/6 pares · 1 divergente**: `primario-normal: min-height: botao "44px" contra link "35.2px"` · **1 falhou** | **1** | seletor temporário removido | **31/31 propriedades · 6/6 pares · 0 divergentes · 1 passou** | **0** |
| Cobertura — **reuso T043** | 11º destino `/parcerias`, sem relatório | `node scripts/verificar-paginas-lighthouse.mjs` | `caminhos medidos: 10/11` · `relatorios lidos: 30/33` · `/parcerias: NENHUM relatorio` | **1** | catálogo de dez destinos e manifest íntegro restaurados | `10/10` · `30/30` · `problemas encontrados: 0` | **0** |
| `formFactor` — **nova** | na cópia de um relatório de `/`, somente `mobile` → `desktop`; `throttlingMethod=simulate` preservado | `node scripts/verificar-paginas-lighthouse.mjs` | `10/10` · `30/30` · **1 problema**: `/: formFactor "desktop", esperado "mobile"` | **1** | manifest original reposto e relatório temporário removido | `mobile / simulate` · **0 problemas** · `10/10 · 30/30` | **0** |
| `throttlingMethod` — **nova** | na cópia de um relatório de `/`, somente `simulate` → `provided`; `formFactor=mobile` preservado | `node scripts/verificar-paginas-lighthouse.mjs` | `10/10` · `30/30` · **1 problema**: `/: throttlingMethod "provided", esperado "simulate"` | **1** | manifest original reposto e relatório temporário removido | `mobile / simulate` · **0 problemas** · `10/10 · 30/30` | **0** |
| Status — **nova** | na cópia de um relatório de `/`, somente `audits["http-status-code"].score: 1 → 0`; URLs e perfil preservados | `node scripts/verificar-paginas-lighthouse.mjs` | `10/10` · `30/30` · **1 problema**: `/: auditoria http-status-code reprovou — a rota respondeu com erro` | **1** | manifest original reposto e relatório temporário removido | sem erro de status · **0 problemas** · `10/10 · 30/30` | **0** |
| URL final — **nova** | pedido do manifest preservado em `/`; somente o campo prioritário `finalDisplayedUrl` mudou de `/` para `/sobre`; `finalUrl` continuou `/` | `node scripts/verificar-paginas-lighthouse.mjs` | `10/10` · `30/30` · **1 problema**: `/: redirecionou para /sobre — a rota pedida nao foi a medida` | **1** | manifest original reposto e relatório temporário removido | sem redirecionamento · **0 problemas** · `10/10 · 30/30` | **0** |

Foram executadas **5 demonstrações novas** e reutilizada **1 evidência completa**, a cobertura da
T043. A primeira tentativa do vermelho visual usou seletor sem classe local e foi recusada pelo CSS
Modules antes de chegar ao teste; ela não foi contada. A violação registrada usa `.par[...] a`,
alcança o navegador e reprova exatamente um par em exatamente uma propriedade calculada.

#### Fechamento restaurado da T046

Depois da última restauração e já sem o auxiliar temporário, os dois verificadores foram repetidos:

```text
COMANDO: npx playwright test tests/e2e/vitrine.spec.ts --grep "os seis pares botao/link tem aparencia calculada identica" --project=largura-360 --reporter=line
Propriedades derivadas: 31 · reconhecidas pelo navegador: 31
Pares visuais: 6/6 · propriedades comparadas por par: 31 · pares divergentes: 0
1 passed (11.2s)
EXIT aparencia-final=0

COMANDO: node scripts/verificar-paginas-lighthouse.mjs
caminhos do catalogo: 10
caminhos medidos: 10/10
relatorios lidos: 30/30
execucoes por caminho esperadas: 3
perfil exigido: mobile / simulate
problemas encontrados: 0
10/10 caminhos e 30/30 relatorios, todos em mobile/simulate, sem redirecionamento e sem erro de status.
EXIT lighthouse-final=0
```

Os hashes finais permaneceram idênticos aos basais:

```text
SHA256 manifest final=C369587129E7A7CCEA97AA694D7EE4D03463C2DE9785995E000D22B297B21DE8
SHA256 relatorio original final=6CCACE8B811A9A6AE2C2C1F20022CF6F1F820DFB88D61A9FDC1F6007662A99FF
temporarios lighthouse restantes=0
```

Formatação e restauração local:

```text
EXIT prettier-t046=0
EXIT diff-check=0
EXIT busca-seletor-temporario=1 — nenhuma ocorrência no CSS da vitrine
EXIT busca-manifest-temporario=1 — nenhuma referência T046 no manifest
EXIT busca-auxiliar-t046=1 — auxiliar ausente
temporarios lighthouse restantes=0
```

O relatório original terminou novamente com `formFactor=mobile`,
`throttlingMethod=simulate`, `http-status-code.score=1`, `finalDisplayedUrl=/` e `finalUrl=/`. O diff
dos arquivos de produto/configuração usados nas violações — `page.module.css`,
`verificar-paginas-lighthouse.mjs` e `lighthouserc.cjs` — ficou vazio.

### T047 — varredura transversal do resultado

#### E66 — limite físico e separação semântica da navegação

O vermelho foi medido sobre a população definida antes da contagem: todos os `.tsx` de produção em
`src/`, incluindo páginas e layouts; testes, declarações, CSS e arquivos gerados ficaram fora.
Foram **36 componentes**: `NavegacaoPublica.tsx` era o maior, com **254 linhas físicas**, havia
**1 acima de 150**, com excesso de **104 linhas**, e `Campo.tsx` tinha **131**. O comando saiu com
**EXIT=1**.

O ciclo de vida do diálogo foi extraído para `usePainelDeNavegacao.ts`: estado, refs, abertura e
fechamento, preservação do `overflow` anterior, evento `close`, backdrop nativo, visibilidade do
acionador e resize. `NavegacaoPublica.tsx` reteve composição, pathname, catálogo, textos, classes,
IDs, `data-testid` e atributos ARIA. O breakpoint continuou somente no CSS e a fronteira
`'use client'` continuou no componente que importa o hook.

```text
COMANDO: população de `rg --files src -g '*.tsx' -g '!*.test.tsx' -g '!*.d.ts'`, linhas físicas por `@(Get-Content -LiteralPath $arquivo).Count`, limite `-gt 150`
componentes examinados=36
131 src\componentes\ui\Campo.tsx
92 src\componentes\layout\NavegacaoPublica.tsx
acima de 150=0
a partir de 130=1
PROXIMO 131 src\componentes\ui\Campo.tsx
hook extraido=86 src\componentes\layout\usePainelDeNavegacao.ts
EXIT limite=0
```

A população e o método são os mesmos do vermelho. O hook `.ts` também foi contado explicitamente
para não esconder tamanho pela extensão: **86 linhas**. A estrutura ficou em um export por arquivo;
`NavegacaoPublica` importa `usePainelDeNavegacao`, e nenhuma página ou layout ganhou diretiva
cliente.

Regressões executadas depois da extração:

```text
COMANDO: npm run verificar:tipos
Types generated successfully
tsc --noEmit sem diagnóstico
EXIT tipos=0

COMANDO: npx eslint src/componentes/layout/NavegacaoPublica.tsx src/componentes/layout/usePainelDeNavegacao.ts
EXIT lint-focado=0

COMANDO: npx vitest run src/componentes/layout/NavegacaoPublica.test.tsx --reporter=verbose
Test Files  1 passed (1)
Tests  13 passed (13)
EXIT unidade=0

COMANDO: npx playwright test tests/e2e/navegacao-teclado.spec.ts --project=largura-360 --reporter=line --workers=1
PERCURSOS DE TECLADO: 7/7 · CASOS ADICIONAIS: 3/3
10 passed
EXIT teclado=0

COMANDO: npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "responde sem erro|tem exatamente uma região de cada papel|não gera rolagem horizontal|o cabeçalho cabe no orçamento|nenhum alvo de toque abaixo de 44 px|a matriz cobre todos os destinos do catálogo|o acionador do painel tem alvo de toque suficiente" --reporter=line
Running 364 tests using 10 workers
2 skipped
362 passed
EXIT t044-pos-refatoracao=0

COMANDO: npx playwright test tests/e2e/paginas-publicas.spec.ts --grep "o painel e o botao expoem nome, papel e estado calculados" --project=largura-360 --reporter=line
aria-controls DOM: 1/1
alvo DOM com id="painel-de-navegacao": 1/1
activeModalDialog encontrados: 1
relacoes com painel-de-navegacao: 1
controls AX: 0/1
1 passed
EXIT ax-painel=0
```

A execução de teclado emitiu a linha agregada uma única vez e confirmou skip visível, abertura,
ciclo, Esc, destino, ordem, resize, backdrop e restauração de `overflow="clip"`. A execução T044
preservou 10/10 rotas, landmarks DOM/AX, alturas, zero overflow e alvos; os dois skips são o teste
específico do acionador nos projetos 1024 e 1280, onde ele é ausente por contrato. Houve zero
falhas e zero casos não executados nas três execuções Playwright.

#### E67 — frase institucional não autorizada, vermelho e correção documental

As buscas literal e tolerante encontraram **1 ocorrência** em
`src/componentes/layout/Rodape.tsx:15`, existente desde `07398017`. Era comentário, não conteúdo
renderizado, mas ainda violava o contrato de zero ocorrências no escopo. Ambas as buscas saíram
**0** porque encontraram a correspondência. Por decisão expressa do Gabriel, somente o comentário
foi reescrito; a decisão passou a ser descrita sem repetir a frase proibida no código.

```text
COMANDO LITERAL: rg -n -i -F 'Faculdade de Medicina · Campus Darcy Ribeiro' src tests scripts liacup.css lighthouserc.cjs package.json
VERMELHO: 1 ocorrência — src/componentes/layout/Rodape.tsx:15
EXIT vermelho-literal=0

COMANDO LITERAL: rg -n -U -i -P 'Faculdade\s+de\s+Medicina\s*(?:·|&middot;|&#183;|&#x[Bb]7;)\s*Campus\s+Darcy\s+Ribeiro' src tests scripts liacup.css lighthouserc.cjs package.json
VERMELHO: 1 ocorrência — src/componentes/layout/Rodape.tsx:15
EXIT vermelho-tolerante=0

RESTAURAÇÃO: comentário autorizado, sem alteração de import, JSX, texto renderizado ou CSS

MESMO COMANDO LITERAL: rg -n -i -F 'Faculdade de Medicina · Campus Darcy Ribeiro' src tests scripts liacup.css lighthouserc.cjs package.json
ocorrencias literais=0
EXIT verde-literal=1 — zero correspondências é o resultado esperado do rg

MESMO COMANDO TOLERANTE: rg -n -U -i -P 'Faculdade\s+de\s+Medicina\s*(?:·|&middot;|&#183;|&#x[Bb]7;)\s*Campus\s+Darcy\s+Ribeiro' src tests scripts liacup.css lighthouserc.cjs package.json
ocorrencias tolerantes=0
EXIT verde-tolerante=1 — zero correspondências é o resultado esperado do rg
```

O `git diff -- src/componentes/layout/Rodape.tsx` contém somente a substituição de três linhas do
comentário por três linhas; o código executável é idêntico.

#### E68 — nove verificações consolidadas

| Verificação | Escopo | Examinados | Resultado | Esperado | EXIT |
| --- | --- | ---: | --- | --- | ---: |
| E-mail institucional inventado | `src/`, `tests/`, `scripts/` e três arquivos-raiz | 115 arquivos; 10 padrões em 5 arquivos | **0 inventados no produto** | 0 | **0** |
| Frase institucional não autorizada | mesmo escopo, busca literal + tolerante | 115 arquivos | vermelho 1; depois **0 + 0** | 0 | **1 + 1 do `rg`**, esperado sem correspondência |
| Avisos provisórios | catálogo e páginas públicas | 10 destinos; 9 subrotas | **9/9**, um aviso por rota e 0 texto institucional extra | 9/9 | **0** |
| Ícones | tipo, implementação, vitrine e teste | 4 fontes; 4 nomes | **4**, nenhum ausente ou adicional | 4 | **0** |
| Seletores `.nav` | `liacup.css` sem comentários + verificador | 5 nomes; 22 seletores pendentes | cinco contagens **0**; total e banner **22** | 0; 22 | **0** |
| Token novo | `tokens.css` no SHA inicial da F03 contra estado atual | 88 → 89 tokens | **1 novo**, 0 removidos, 0 existentes alterados | 1; 0; 0 | **0** |
| Dependências | objetos JSON de `package.json` | 4 + 18 entradas | **22**, chaves repetidas 0 | 4 + 18 | **0** |
| Server Components por padrão | `page.tsx`/`layout.tsx` e fronteiras cliente em `src/` | 13 páginas/layouts; 36 TSX | **13/13 servidor**, 0 páginas/layouts cliente; 2 ilhas justificadas | 13/13 | **0** |
| Limite físico | `.tsx` de produção em `src/`; hook extraído conferido à parte | 36 componentes + hook | maior 131; **0 acima de 150**; hook 86 | 0 | **0** |

##### E-mails encontrados e classificação

```text
COMANDO: rg -n -i -P '[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}' src tests scripts liacup.css lighthouserc.cjs package.json
arquivos examinados=115 — src=85 · tests=17 · scripts=10 · raízes=3
padrões encontrados=10 em 5 arquivos
```

- `liacup.unb@gmail.com`: 7 ocorrências entre produto, comentário de fonte e teste; endereço oficial
  documentado.
- `diretoria.teste@example.com` e `contato@example.com`: 2 fixtures de política, não exibidas.
- `voce@exemplo.com`: 1 placeholder da vitrine interna, não apresentado como contato institucional.
- E-mails institucionais inventados no produto: **0**; `EXIT inventado-email=0`.

##### Nove avisos derivados das rotas

| Rota | Arquivo | Aviso renderizado | Conteúdo institucional presente |
| --- | --- | ---: | ---: |
| `/sobre` | `src/app/(site)/sobre/page.tsx` | 1 | 0 |
| `/noticias` | `src/app/(site)/noticias/page.tsx` | 1 | 0 |
| `/conteudo-educativo` | `src/app/(site)/conteudo-educativo/page.tsx` | 1 | 0 |
| `/eventos` | `src/app/(site)/eventos/page.tsx` | 1 | 0 |
| `/projetos` | `src/app/(site)/projetos/page.tsx` | 1 | 0 |
| `/materiais` | `src/app/(site)/materiais/page.tsx` | 1 | 0 |
| `/galeria` | `src/app/(site)/galeria/page.tsx` | 1 | 0 |
| `/processo-seletivo` | `src/app/(site)/processo-seletivo/page.tsx` | 1 | 0 |
| `/contato` | `src/app/(site)/contato/page.tsx` | 1 | 0 |

O comando leu os dez itens de `destinos-publicos.json`, excluiu apenas `/`, abriu o `page.tsx`
correspondente e contou o `<p>` exato. Cada rota renderiza somente seu `h1` e “Página em
construção”: **9/9**, zero data, local, contato, processo, equipe, evento ou outra informação
institucional inventada; `EXIT avisos=0`. São nove implementações de página e nove avisos.

##### Quatro ícones exatos

```text
COMANDO: derivação por regex da união NomeDoIcone, chaves de DESENHOS, props de IconeDemo e array esperado em vitrine.spec.ts
tipo=4: abrir, email, fechar, instagram
implementados=4: abrir, email, fechar, instagram
vitrine=4: abrir, email, fechar, instagram
teste=4: abrir, email, fechar, instagram
ausentes=0 adicionais=0
EXIT icones=0
```

As fontes foram `src/componentes/ui/Icone.tsx`,
`src/app/(interno)/vitrine/IconeDemo.tsx` e `tests/e2e/vitrine.spec.ts`; a expectativa do teste não
foi usada como fonte única.

##### Cinco seletores ausentes e total reproduzível

Depois de remover comentários antes da leitura e usar a mesma população iniciada em `.radio` do
verificador:

```text
.nav=0
.nav-brand=0
.nav a=0
.nav a:hover=0
.nav a[aria-current='page']=0
seletores contados=22
banner=22
familia nav total=0
EXIT seletores-nominais=0

COMANDO: npm run verificar:seletores
contados: 22
declarados no banner: 22
=== VERIFICADO — seletores pendentes no liacup.css ===
EXIT verificar-seletores=0
```

##### Um token novo

A linha de base autoritativa é o SHA inicial documentado da F03,
`3b2ce14fff80284e046316b3142487491f6e5e70`. O `origin/main` avançou; o merge-base móvel atual é
`1cd261fdab01cef76e8802faf4b145baaeb1dd03`, por isso ele não substitui a fotografia limpa já
registrada no início desta evidência.

```text
COMANDO: git show 3b2ce14fff80284e046316b3142487491f6e5e70:src/estilos/tokens.css; mapas derivados de declarações --nome: valor; comparados ao arquivo atual
tokens linha-base=88 estado-atual=89
acrescentados=1: --font-size-marca=18px
removidos=0
existentes alterados=0
EXIT tokens=0
```

O diff contém somente o comentário de origem e `--font-size-marca: 18px; /* .nav-brand */`; não há
movimentação ou reformatação de token existente.

##### Dependências 4 + 18

`package.json` foi lido como JSON; as chaves brutas de cada objeto também foram agrupadas para não
deixar uma repetição ser ocultada pelo parser.

```text
dependencies=4: @supabase/supabase-js, next, react, react-dom
devDependencies=18: @axe-core/playwright, @lhci/cli, @playwright/test, @testing-library/jest-dom, @testing-library/react, @types/node, @types/react, @types/react-dom, @vitejs/plugin-react, eslint, eslint-config-next, eslint-plugin-import, eslint-plugin-jsx-a11y, jsdom, prettier, supabase, typescript, vitest
total=22
chaves repetidas=0
EXIT dependencias=0
```

##### Server Components por padrão

| Arquivo | Tem `use client` | Motivo para cliente | Classificação |
| --- | --- | --- | --- |
| `src/app/layout.tsx` | não | nenhum | Server Component |
| `src/app/(site)/layout.tsx` | não | nenhum | Server Component |
| `src/app/(site)/page.tsx` | não | nenhum | Server Component |
| `src/app/(site)/sobre/page.tsx` | não | nenhum | Server Component |
| `src/app/(site)/noticias/page.tsx` | não | nenhum | Server Component |
| `src/app/(site)/conteudo-educativo/page.tsx` | não | nenhum | Server Component |
| `src/app/(site)/eventos/page.tsx` | não | nenhum | Server Component |
| `src/app/(site)/projetos/page.tsx` | não | nenhum | Server Component |
| `src/app/(site)/materiais/page.tsx` | não | nenhum | Server Component |
| `src/app/(site)/galeria/page.tsx` | não | nenhum | Server Component |
| `src/app/(site)/processo-seletivo/page.tsx` | não | nenhum | Server Component |
| `src/app/(site)/contato/page.tsx` | não | nenhum | Server Component |
| `src/app/(interno)/vitrine/page.tsx` | não | nenhum | Server Component |

```text
COMANDO: rg --files src/app -g 'page.tsx' -g 'layout.tsx'; busca de diretiva no início de cada arquivo
paginas-layouts=13 clientes=0 servidores=13
tsx-producao=36 fronteiras-cliente=2
src/componentes/layout/NavegacaoPublica.tsx
src/componentes/ui/Campo.tsx
EXIT server-components=0
```

As duas ilhas são mínimas e justificadas: `NavegacaoPublica` usa `usePathname` e o hook com estado,
refs, efeitos e APIs de `window`/`document`; `Campo` usa `useId` e normaliza `onChange`. A moldura e
as páginas estáticas permanecem servidor; `Cabecalho` importa somente a ilha da navegação, e a
vitrine servidor importa demos que delimitam o uso de `Campo`.

### T048 — preservação das suítes de unidade e banco

#### E69 — destino efetivo e segurança do banco

Antes das suítes, o estado local tinha oito arquivos rastreados modificados e o novo
`usePainelDeNavegacao.ts`; nenhum arquivo de teste unitário ou de banco estava removido ou
renomeado. Foram lidos `vitest.config.mts`, `vitest.banco.config.mts` e os auxiliares
`ambiente.ts`, `clientes.ts`, `colecoes.ts`, `matriz.ts` e `preparo.ts`, além do teste de ciclo de
vida. Nenhum valor secreto foi impresso.

Os testes de banco consomem somente estes nomes:

- `SUPABASE_TESTE_URL`;
- `SUPABASE_TESTE_ANON_KEY`;
- `SUPABASE_TESTE_SERVICE_ROLE_KEY`.

As três vieram efetivamente de `.env`; os auxiliares não leem `NEXT_PUBLIC_SUPABASE_URL` nem
`SUPABASE_SERVICE_ROLE_KEY`. O hostname efetivo foi
`obzlanpzqoilzxpjooyq.supabase.co`, portanto o ref usado pela suíte foi
`obzlanpzqoilzxpjooyq`.

A distinção entre “projeto ligado” e “projeto usado pelos testes” foi conferida, não presumida:

```text
ref ligado pela CLI=yrmingntgzsojwnqfhmn
name=portal-liacup-producao

ref efetivo da SUPABASE_TESTE_URL=obzlanpzqoilzxpjooyq
URL e projeto ligado coincidem=False

COMANDO: npx supabase projects list --output json; filtragem local somente pelo ref efetivo
projetos correspondentes ao ref efetivo=1
ref=obzlanpzqoilzxpjooyq
name=portal-liacup-teste
status=ACTIVE_HEALTHY
region=sa-east-1
EXIT projetos=0
```

Assim, a CLI local está ligada à produção, mas isso não define o destino da suíte. O valor
efetivamente entregue aos clientes de teste aponta para outro ref, identificado pelo catálogo de
projetos como **`portal-liacup-teste`**, saudável e separado da produção. Só depois dessa prova a
suíte de banco foi autorizada a rodar.

#### E70 — inventário coletável antes da execução

O Vitest padrão usa sua inclusão padrão e exclui explicitamente `node_modules/**`, `tests/e2e/**`,
`tests/politicas/**`, `tests/banco/**` e `.next/**`. A enumeração resultou em **12 arquivos**, sem
nenhum arquivo de banco:

```text
src/componentes/layout/destinos-publicos.test.ts
src/componentes/layout/LinksDeContato.test.tsx
src/componentes/layout/NavegacaoPublica.test.tsx
src/componentes/ui/Botao.test.tsx
src/componentes/ui/Campo.test.tsx
src/componentes/ui/Cartao.test.tsx
src/componentes/ui/Etiqueta.test.tsx
src/componentes/ui/Icone.test.tsx
src/componentes/ui/LinkComAparenciaDeBotao.test.tsx
src/componentes/ui/Separador.test.tsx
src/features/exemplo/regras.test.ts
src/lib/utils/resumo-de-origem.test.ts
arquivos unidade=12
arquivos de banco na unidade=0
```

A configuração de banco inclui apenas `tests/politicas/**/*.test.ts` e
`tests/banco/**/*.test.ts`. Foram enumerados **5 arquivos**:

```text
tests/banco/ciclo-de-vida.test.ts
tests/politicas/conteudo-permissao.test.ts
tests/politicas/conteudo-recusa.test.ts
tests/politicas/mensagens.test.ts
tests/politicas/zz-relatorio.test.ts
arquivos banco=5 — politicas=4 · banco=1
```

`isolate: false`, `fileParallelism: false`, `pool: 'forks'`, `minForks: 1` e `maxForks: 1`
permaneceram inalterados. A busca por `.only(`, `.skip(` e `.todo(` encontrou **zero** nos dois
escopos. O diff contra `HEAD` encontrou **zero arquivos de teste removidos ou renomeados**; os dois
testes localmente modificados são E2E e não pertencem a nenhuma das duas configurações desta
tarefa.

#### E71 — execuções literais e preservação

```text
COMANDO LITERAL: npm test

> portal-liacup@0.1.0 test
> vitest run

RUN  v4.1.11 C:/Dev/portal-liacup

Test Files  12 passed (12)
Tests  106 passed (106)
Start at  18:26:43
Duration  31.56s (transform 4.81s, setup 50.71s, import 15.14s, tests 3.57s, environment 273.85s)
EXIT unidade=0
```

Os **12 arquivos inventariados foram os 12 coletados**. Isso inclui integralmente
`NavegacaoPublica.test.tsx` e `destinos-publicos.test.ts`; não houve execução focada substituindo a
suíte. Falhos, pulados e pendentes: **0**.

```text
COMANDO LITERAL: npm run test:banco

> portal-liacup@0.1.0 test:banco
> vitest run --config vitest.banco.config.mts

RUN  v4.1.11 C:/Dev/portal-liacup

celulas verificadas: 143 · de permissao: 58 · de recusa: 85

Test Files  5 passed (5)
Tests  147 passed (147)
Start at  18:27:33
Duration  25.37s (transform 90ms, setup 0ms, import 1.01s, tests 24.17s, environment 0ms)
EXIT banco=0
```

Os **5 arquivos inventariados foram os 5 coletados**. Falhos, pulados e pendentes: **0**. A
presença nominal de `conteudo-permissao.test.ts` e `conteudo-recusa.test.ts`, somada ao contador
derivado de **58 permissões e 85 recusas**, prova que a suíte não ficou verde exercitando apenas um
lado da matriz.

| Suíte | Arquivos | Passados | Falhos | Pulados | Piso | Preservada |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Unidade | 12 | 106 | 0 | 0 | 71 | **sim** |
| Banco | 5 | 147 | 0 | 0 | 147 | **sim** |

A unidade igualou o total vigente mais recente, E65: **12 arquivos e 106 testes**; portanto não
houve variação a explicar nesta rodada. O crescimento histórico desde o piso de 71 já está
nominalmente distribuído na cronologia anterior. O banco igualou E4: **5 arquivos, 147 testes e 143
células (58/85)**. Nenhuma das duas suítes caiu, perdeu arquivo ou foi restringida por `.only`.

Depois da suíte, uma leitura sem conteúdo e sem credenciais contou a marca
`[TESTE-DE-POLITICA]%` nas onze coleções de conteúdo e em `mensagens`:

```text
colecoes examinadas=12
linhas marcadas restantes=0
erros=0
EXIT limpeza-remota=0
```

Nenhum dado marcado ficou no projeto de teste; nenhum arquivo de fixture, configuração ou teste de
banco apareceu modificado no estado local.

### T049 — build de produção e suíte ponta a ponta integral

#### E72 — build de produção em executor com acesso normal às fontes

Comando literal:

```text
npm run build
```

Saída literal relevante:

```text
▲ Next.js 16.3.1 (Turbopack)
- Environments: .env

✓ Compiled successfully in 653ms
✓ Finished TypeScript in 3.5s
✓ Collecting page data using 14 workers in 3.2s
✓ Generating static pages using 14 workers (13/13) in 861ms
✓ Finalizing page optimization in 33ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /contato
├ ○ /conteudo-educativo
├ ○ /eventos
├ ○ /galeria
├ ○ /materiais
├ ○ /noticias
├ ○ /processo-seletivo
├ ○ /projetos
├ ○ /sobre
└ ○ /vitrine

○  (Static)  prerendered as static content
EXIT build=0
```

O build foi executado sem alterar fontes, CSS, configuração do Next, DNS, hosts ou testes. As fontes remotas foram acessadas pelo executor autorizado; não foi usado cache como prova, resposta simulada nem `NEXT_FONT_GOOGLE_MOCKED_RESPONSES`.

#### E73 — Playwright integral, sem filtro e com todos os projetos

Comando literal:

```text
npm run test:e2e
```

Saída literal de início e encerramento:

```text
> portal-liacup@0.1.0 test:e2e
> node scripts/verificar-navegador.mjs && playwright test

Running 833 tests using 10 workers

81 skipped
752 passed (1.2m)
EXIT e2e=0
```

Total contabilizado: `833 = 752 passados + 81 pulados`; falhas: `0`; casos `did not run`: `0`. Os 81 pulados são os casos condicionais já previstos por largura, não uma redução por `grep`, projeto removido ou `.only`.

Contadores literais emitidos durante a execução integral:

```text
[largura-360] páginas verificadas: 10/10 · combinações página/largura: 7 larguras × 10 destinos = 70/70
PERCURSOS DE TECLADO: 7/7 · CASOS ADICIONAIS: 3/3
Pares visuais: 6/6 · propriedades comparadas por par: 31 · pares divergentes: 0
Varredura 1024–1280 px, passo 8: 33 larguras medidas · com rolagem horizontal: 0
Alvos de toque medidos: 36 · abaixo de 44 px: 0
Violacoes de acessibilidade na vitrine: 0
```

O contador `páginas verificadas: 10/10` e a matriz `70/70` foram emitidos para os sete projetos de largura: `360`, `390`, `430`, `480`, `768`, `1024` e `1280` px. Portanto, não se trata apenas da largura usada no trecho literal acima.

| Largura | Altura medida do cabeçalho | Limite aplicável e resultado | Alvos da navegação pública |
| ---: | ---: | --- | --- |
| 360 px | 62,59 px | máximo mobile 64 px: dentro | fechado 6; aberto 15; 9 destinos adicionados; 0 abaixo de 44 px |
| 390 px | 62,59 px | máximo mobile 64 px: dentro | fechado 6; aberto 15; 9 destinos adicionados; 0 abaixo de 44 px |
| 430 px | 62,59 px | máximo mobile 64 px: dentro | fechado 6; aberto 15; 9 destinos adicionados; 0 abaixo de 44 px |
| 480 px | 62,59 px | máximo mobile 64 px: dentro | fechado 6; aberto 15; 9 destinos adicionados; 0 abaixo de 44 px |
| 768 px | 62,59 px | sem teto numérico mobile; permanência do cabeçalho aprovada | fechado 6; aberto 15; 9 destinos adicionados; 0 abaixo de 44 px |
| 1024 px | 71,78 px | sem teto numérico mobile; permanência do cabeçalho aprovada | 14 medidos; 0 abaixo de 44 px |
| 1280 px | 62,59 px | sem teto numérico mobile; permanência do cabeçalho aprovada | 14 medidos; 0 abaixo de 44 px |

Além da navegação pública, a vitrine mediu `36` alvos em cada largura, com `0` abaixo de 44 px. As 70 verificações de páginas públicas e as 7 da vitrine concluíram sem overflow horizontal; a varredura intermediária acrescentou 33 larguras entre 1024 e 1280 px, também com `0` overflow. As 70 varreduras axe das páginas públicas e as 7 da vitrine não acusaram violações. Os seis pares visuais permaneceram idênticos nas 31 propriedades comparadas.

Após build e E2E, antes deste registro documental, `git diff --name-status` permaneceu idêntico ao inventário anterior da T049: nenhum arquivo rastreado foi criado ou alterado pelas duas execuções.

### T050 — Lighthouse contra o build de produção

#### E74 — execução válida em Docker Linux e leitura do manifest atual

As duas tentativas locais anteriores no Windows foram falhas de infraestrutura do executor, não do produto: a primeira não obteve o WebSocket do Chrome e recebeu `Acesso negado` ao tentar encerrar a instância; a segunda, já com o executável do Chromium do Playwright confirmado existente, falhou em `spawn EPERM`. Nenhuma delas é usada como evidência de resultado Lighthouse, e nenhuma alteração de código, configuração ou teste foi feita para contorná-las.

A execução isolada válida ocorreu em Docker Linux. O pós-verificador executado em seguida no Windows concluiu com `EXIT pos-verificador-windows=0`; como ele está encadeado ao êxito do processo Docker, confirma a conclusão válida, mas não se registra uma linha literal `EXIT docker-t050=0`, pois ela não foi preservada.

Para a leitura de resultado, foram abertos **somente** o `manifest.json` atual e os **30 JSONs apontados por ele** — nenhum relatório solto histórico. A leitura encontrou:

```text
manifest=30
arquivos lidos=30
rotas=10
execucoes por rota=3
status HTTP aprovados=30/30
URL final igual a solicitada=30/30
perfil mobile=30/30
throttling simulate=30/30
desempenho >= 0.90=30/30
acessibilidade >= 0.95=30/30
problemas encontrados=0
EXIT pos-verificador-windows=0
```

Os 10 caminhos são `/`, `/sobre`, `/noticias`, `/conteudo-educativo`, `/eventos`, `/projetos`, `/materiais`, `/galeria`, `/processo-seletivo` e `/contato`: **10/10** medidos, com **30/30** relatórios e três execuções de cada rota. O pós-verificador confirmou, em cada relatório, ausência de redirecionamento e de erro de status.

| Métrica mínima | Valor | Rota | Execução no manifest |
| --- | ---: | --- | ---: |
| Desempenho | 0,98 (98) | `/` | 1ª das 3 |
| Acessibilidade | 1,00 (100) | `/` | 1ª das 3 |

As asserções do LHCI são `performance >= 0.90` e `accessibility >= 0.95`; os 30 relatórios satisfazem ambas. O perfil observado nos próprios LHRs é `mobile/simulate`, e o pós-verificador encontrou **zero** problemas.

### T051 — referência operacional do Lighthouse

#### E75 — README aponta para a configuração efetiva

Antes da alteração, a varredura integral de `README.md` encontrou uma única referência ao nome antigo, na orientação que proíbe afrouxar o limiar:

```text
COMANDO: rg -n -F 'lighthouserc.json' README.md
153:**O que NAO fazer:** baixar o limiar em `lighthouserc.json`. Se a nota caiu, alguma coisa piorou —
contagem antes=1
EXIT antes=0
```

`lighthouserc.cjs` existe na raiz e é a configuração efetiva do LHCI. A única orientação foi atualizada para esse nome; nenhum limiar, comando ou comportamento foi alterado. A mesma busca após a atualização ficou vazia, enquanto a busca pelo nome efetivo retornou exatamente a orientação corrigida:

```text
MESMO COMANDO: rg -n -F 'lighthouserc.json' README.md
contagem depois=0
EXIT depois=1

COMANDO: rg -n -F 'lighthouserc.cjs' README.md
153:**O que NAO fazer:** baixar o limiar em `lighthouserc.cjs`. Se a nota caiu, alguma coisa piorou —
contagem nome efetivo=1
EXIT nome efetivo=0
```

### T052 — fechamento da F03

#### E76 — integridade final e entrega para revisão

| Verificação | Resultado |
| --- | --- |
| T043–T051 exigidas | todas marcadas `[X]` |
| Marcador `PREENCHER` em `FIDELIDADE.md` | 0 ocorrências |
| Alterações temporárias | 0 remanescentes; as violações demonstrativas foram restauradas nas evidências E58–E75 |
| Relatórios Lighthouse rastreados | 0; `.lighthouseci/` e seu `manifest.json` permanecem ignorados |
| Arquivo novo | `usePainelDeNavegacao.ts` legítimo: extração da única ilha cliente, importada por `NavegacaoPublica.tsx` |
| Segredos e artefatos | 0 artefatos gerados indevidamente rastreados; verificador de chave encontrou 0 ocorrências de nome ou valor no material entregue ao navegador |

Validação final, executada com `safe.directory` declarado somente para o processo:

```text
COMANDO: npm run verificar
artefatos rastreados examinados=243 · artefatos gerados indevidos=0
tokens: 80 arquivos varridos · ocorrências fora dos tokens=0
seletores pendentes=22 · banner=22
chave: 318 arquivos varridos · 83 entregues ao navegador · valor=0 · nome=0
EXIT verificar=0

COMANDO: git diff --check
EXIT diff-check=0
```

O fechamento é enviado em um único commit da branch `feat/F03-layout-base`. A conferência pós-envio
exige e confirma os dois números de entrega: `git status --porcelain | wc -l = 0` e `HEAD local =
refs/heads/feat/F03-layout-base` no remoto. A F03 fica **concluída para revisão**, sem PR ou merge.

## 10. O que NÃO foi executado, e por quê

- O Vitest não foi executado durante a violação temporária do 11º destino; por isso nenhum contador
  unitário foi inferido para esse vermelho. A guarda de catálogo vazio foi demonstrada em execução
  separada, antes e depois da restauração.
- A primeira chamada de `git diff --check`, sem declarar o `safe.directory` exigido pelo ambiente,
  não reconheceu o repositório e saiu 129. Ela foi repetida com a configuração explícita acima e
  saiu 0; a tentativa 129 não indicava erro de whitespace no diff.
- Nenhuma tarefa da F03 ficou para a próxima parada. A T052 encerra a feature e para para revisão,
  sem iniciar outra fase.

---

## Estado do trabalho no controle de versão

Conferido ao fim de cada fase, conforme `docs/OPERACAO-GIT.md` §4 — **dois números**, porque contar
pendências sozinho não distingue "tudo enviado" de "commit preso na máquina".

| Fase | Pendências (`git status --porcelain \| wc -l`) | `HEAD` igual ao `ls-remote`? |
| --- | --- | --- |
| 1 | _a registrar_ | _a registrar_ |
