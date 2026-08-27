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

_A preencher na Fase 3._

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
