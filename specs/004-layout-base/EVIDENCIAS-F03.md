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

_A preencher na Fase 4._

## 5. Geometria do cabeçalho (US2 · FR-002, FR-003, FR-038)

_A preencher na Fase 5._

## 6. Percurso por teclado (US4 · FR-009 a FR-012, FR-017 a FR-019, FR-042)

_A preencher na Fase 6._

## 7. Estado e propósito anunciados (US5 · FR-013, FR-016, FR-020)

_A preencher na Fase 7._

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
