# Checklist de validação — Portal LIACUP

Aplicado por mim em **toda** feature, antes de passar para o pente fino do Gabriel.
Regra: cada item é respondido com **evidência** — um número, uma saída de comando, uma captura de tela. Nunca com adjetivo.

**Feature:** ____________ **Data:** ____________ **Branch:** ____________

---

## A. Fidelidade à spec

| #   | Item                                                                          | Como verifico                        | Resultado |
| --- | ----------------------------------------------------------------------------- | ------------------------------------ | --------- |
| A1  | Todo requisito da spec tem implementação correspondente                       | Percorro a spec item a item          |           |
| A2  | Todo critério de aceite passa                                                 | Executo cada um                      |           |
| A3  | Nada foi implementado **além** da spec                                        | Leio o diff procurando extras        |           |
| A4  | Divergências entre spec e código foram reportadas, não corrigidas em silêncio | Confiro o relatório do desenvolvedor |           |

## B. Não quebrou nada

| #   | Item                               | Como verifico                                                     | Resultado |
| --- | ---------------------------------- | ----------------------------------------------------------------- | --------- |
| B1  | Build passa                        | `npm run build`                                                   |           |
| B2  | Tipos passam                       | `tsc --noEmit` — zero erro                                        |           |
| B3  | Análise estática passa             | `npm run lint` — zero erro                                        |           |
| B4  | Testes passam                      | `npm test` — total e falhas                                       |           |
| B5  | Fluxos críticos seguem funcionando | Teste de ponta a ponta: login, publicar, excluir, enviar mensagem |           |

## C. Responsividade

| #   | Item                                                              | Como verifico                                 | Resultado |
| --- | ----------------------------------------------------------------- | --------------------------------------------- | --------- |
| C1  | Sem rolagem horizontal em 360, 390, 430, 480, 768, 1024 e 1280 px | `scrollWidth === clientWidth` em cada largura |           |
| C2  | Nenhum elemento ultrapassa a largura da tela                      | Varredura de `getBoundingClientRect`          |           |
| C3  | Cabeçalho fixo ocupa no máximo 64 px no mobile                    | Medição                                       |           |
| C4  | Nenhuma tabela com rolagem lateral no mobile                      | Inspeção das telas de lista                   |           |
| C5  | O desktop continua idêntico ao aprovado                           | Comparação visual em 1280 px                  |           |

## D. Acessibilidade

| #   | Item                                                 | Como verifico                            | Resultado |
| --- | ---------------------------------------------------- | ---------------------------------------- | --------- |
| D1  | Zero violações automáticas                           | axe-core na página                       |           |
| D2  | Contraste AA em todo texto                           | Cálculo dos pares de cor usados          |           |
| D3  | Zero alvos de toque abaixo de 44 px no mobile        | Varredura de elementos clicáveis         |           |
| D4  | Navegação completa por teclado, com foco visível     | Percurso manual com Tab                  |           |
| D5  | Todo campo tem rótulo associado                      | Varredura de `label[for]` / `aria-label` |           |
| D6  | Imagens com texto alternativo adequado               | Inspeção                                 |           |
| D7  | Estrutura de títulos coerente, sem pular níveis      | Árvore de headings                       |           |
| D8  | Avisos de erro e sucesso anunciados a leitor de tela | Presença de `aria-live`                  |           |

## E. Segurança e dados

| #   | Item                                                        | Como verifico                      | Resultado |
| --- | ----------------------------------------------------------- | ---------------------------------- | --------- |
| E1  | RLS ativa em toda tabela tocada pela feature                | Consulta ao esquema                |           |
| E2  | Nenhuma chave secreta no cliente ou no repositório          | Varredura do bundle e do histórico |           |
| E3  | Entradas validadas no servidor, não só na tela              | Leitura do código de servidor      |           |
| E4  | Nenhum dado pessoal novo sem finalidade, base legal e prazo | Comparação com o documento de LGPD |           |
| E5  | Logs sem dado pessoal                                       | Inspeção das chamadas de log       |           |
| E6  | Permissão por papel respeitada                              | Teste com usuário de cada papel    |           |

## F. Desempenho

| #   | Item                                         | Como verifico               | Resultado |
| --- | -------------------------------------------- | --------------------------- | --------- |
| F1  | Lighthouse desempenho ≥ 90 em página pública | Execução em mobile simulado |           |
| F2  | Lighthouse acessibilidade ≥ 95               | Idem                        |           |
| F3  | Imagens otimizadas e dimensionadas           | Inspeção da rede            |           |
| F4  | Nada carregado que não seja usado na tela    | Análise do bundle           |           |

## G. Conteúdo

| #   | Item                                                  | Como verifico                         | Resultado |
| --- | ----------------------------------------------------- | ------------------------------------- | --------- |
| G1  | Nenhum texto inventado apresentado como real          | Leitura de todo texto novo            |           |
| G2  | Espaços reservados visivelmente marcados              | Inspeção visual                       |           |
| G3  | Textos institucionais idênticos ao aprovado pela liga | Comparação com o documento de revisão |           |
| G4  | Português correto, com acentuação                     | Revisão de texto                      |           |

## H. Manutenção

| #   | Item                                                          | Como verifico                                | Resultado |
| --- | ------------------------------------------------------------- | -------------------------------------------- | --------- |
| H1  | README atualizado se algo mudou no funcionamento              | Leitura                                      |           |
| H2  | Decisão técnica com alternativa real virou ADR                | Confiro se há decisão não registrada         |           |
| H3  | Dependência nova está justificada no plano                    | Comparação do `package.json` com o `plan.md` |           |
| H4  | Código compreensível por quem não participou                  | Leitura crítica do diff                      |           |
| H5  | Pendências registradas como tarefa, não como comentário solto | Varredura de `TODO` no código                |           |

---

## Veredito

- [ ] **Aprovado** — segue para o pente fino do Gabriel
- [ ] **Aprovado com ressalvas** — segue, com as pendências abaixo registradas como tarefa
- [ ] **Reprovado** — volta para o Claude Code

**Itens reprovados:**

**Pendências registradas:**

**Observação para o Gabriel — onde olhar com atenção:**

---

### Como eu reporto

Três linhas, sempre no mesmo formato:

1. **O que entrou:** a feature em uma frase.
2. **Checklist:** quantos itens passaram, quais falharam e o número que sustenta cada resposta.
3. **O que ficou:** pendências, riscos novos e o ponto onde seu olho vai render mais.


---

# Preenchimento — F01 Design system em componentes

**Feature:** F01 · **Data:** 21/08/2026 · **Branch:** `feat/F01-design-system`

Evidências completas em `specs/002-design-system/EVIDENCIAS-F01.md`.

## A. Fidelidade à spec

| # | Resultado |
|---|---|
| A1 | 21 de 21 requisitos funcionais com tarefa e implementação |
| A2 | 13 de 13 critérios de sucesso; 2 não executáveis por mim, declarados (SC-011 e CI) |
| A3 | Nada além da spec. 3 tentações de dependência recusadas |
| A4 | 5 divergências reportadas, nenhuma corrigida em silêncio |

## B. Não quebrou nada

| # | Resultado |
|---|---|
| B1 | `npm run build` — 3 rotas geradas |
| B2 | `tsc --noEmit` — 0 erros |
| B3 | `eslint .` — 0 erros, 0 avisos |
| B4 | 65 de unidade, 84 de ponta a ponta — 149 no total, 0 falhas |
| B5 | Não se aplica: login, publicação e exclusão entram na F02 e na F14 |

## C. Responsividade

| # | Resultado |
|---|---|
| C1 | 0 ocorrências de rolagem horizontal em 360, 390, 430, 480, 768, 1024 e 1280 px |
| C2 | Coberto pelo C1 na vitrine |
| C3 | Não se aplica: sem cabeçalho fixo ainda |
| C4 | Não se aplica: sem tabela ainda |
| C5 | 60 linhas comparadas no FIDELIDADE.md contra o valor efetivo pós-cascata |

## D. Acessibilidade

| # | Resultado |
|---|---|
| D1 | 0 violações do axe-core na vitrine, nas 7 larguras |
| D2 | 4 defeitos de contraste medidos e corrigidos; 5 pares medidos que passam e não mudam |
| D3 | **20 alvos medidos, 0 abaixo de 44 px** |
| D4 | 15 elementos com foco verificado, 0 sem foco visível |
| D5 | Todo campo com `<label htmlFor>`; identificador gerado por `useId` |
| D6 | Não se aplica: nenhuma imagem nova |
| D7 | `<h1>` único e um `<h2>` por componente; `Cartao.Titulo` recebe o nível de quem compõe |
| D8 | Erro do campo em `role="alert"` com `aria-live="polite"` |

## E. Segurança e dados

Não se aplica: nenhum dado pessoal, nenhum acesso a banco, nenhum segredo. Entra na F02.

## F. Desempenho

| # | Resultado |
|---|---|
| F1 | Lighthouse desempenho **100** (limiar 90) |
| F2 | Lighthouse acessibilidade **100** (limiar 95) |
| F3 | Não se aplica: nenhuma imagem nova |
| F4 | 20 dependências diretas, as mesmas da F00 |

> ⚠️ **Estes dois números foram medidos em `preset: desktop`**, e os itens F1 e F2 deste checklist
> sempre disseram "execução em mobile simulado". A contradição estava por escrito desde a F00, no
> `lighthouserc.json`, e passou por três features sem ser notada — foi inofensiva porque nenhuma
> delas era sobre o mobile. **Corrigido na F03**: a chave `preset` saiu do `lighthouserc.json`, e o
> Lighthouse voltou ao padrão dele, que é mobile simulado. Não existe `preset: "mobile"` — os únicos
> presets são `perf`, `experimental` e `desktop`; mobile é o padrão, obtido pela ausência da chave.
>
> **Consequência a esperar, declarada antes de medir**: o mobile simulado aplica limitação de CPU e
> de rede que o desktop não aplica. É provável que o desempenho caia abaixo de 100. O limiar de 90
> **não desce** por causa disso — se cair abaixo dele, é trabalho, não motivo para reabrir o limiar.

## G. Conteúdo

| # | Resultado |
|---|---|
| G1 | Nenhum texto inventado. A vitrine usa exemplos rotulados como exemplos |
| G2 | 27 classes pendentes marcadas com a feature de destino |
| G3 | Não se aplica: nenhum texto institucional nesta feature |
| G4 | Português com acentuação em todo texto de tela |

## H. Manutenção

| # | Resultado |
|---|---|
| H1 | README com a seção da vitrine e o endereço |
| H2 | ADR-0004 criado; ADR-0003 com dois adendos |
| H3 | 0 dependências novas |
| H4 | Os 7 componentes com o que é / quando usar / quando não usar |
| H5 | 3 valores reprovados que ficam, anotados no `liacup.css` com a correção |

## Veredito

- [x] **Aprovado com ressalvas** — segue, com as pendências abaixo registradas

**Pendências:**

1. **SC-011** não executado: precisa de uma pessoa que não participou.
2. **CI e merge barrado** a confirmar na alteração proposta.
3. **`.nav`, `.table` e `.text-muted`** ficam com valor reprovado no `liacup.css`, anotados com a
   correção. Viram tarefa nas features que os converterem.

# Preenchimento — F02 Camada de dados

**Feature:** F02 · **Data:** 26/08/2026 · **Branch:** `feat/F02-camada-de-dados`

Evidências completas em `specs/003-camada-de-dados/EVIDENCIAS-F02.md` — 33 evidências, 30 verificadas
e 3 declaradas como não executadas.

## A. Fidelidade à spec

| #   | Resultado                                                                                                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | 33 FR percorridos; 60 tarefas, 60 concluídas                                                                                                  |
| A2  | 16 SC; 15 verificados, o SC-002 verificado no projeto de teste e pendente em produção até o merge (E3)                                        |
| A3  | Uma adição além do previsto: a migração 0012 de concessões. Sem ela as políticas escritas não fazem nada — E7                                  |
| A4  | Uma divergência reportada e não corrigida em silêncio: T046 × seção 3 de `conteudo-institucional.md`, sobre o texto da Secretaria. Seção 10 das evidências |

## B. Não quebrou nada

| #   | Resultado                                                                       |
| --- | ------------------------------------------------------------------------------- |
| B1  | `npm run build` — verde                                                         |
| B2  | `tsc --noEmit` — 0 erro                                                         |
| B3  | `npm run lint` — 0 erro                                                         |
| B4  | `npm test` — 71 passaram, 0 falharam (eram 65 na F01). `npm run test:banco` — 147 passaram |
| B5  | Publicar, arquivar e escrita concorrente exercidos em `tests/banco/`; login é da F14, e envio de mensagem tem a inserção anônima coberta em `tests/politicas/` |

## C. Responsividade

Não se aplica: nenhuma tela nova. Os 84 testes de ponta a ponta da F01, que medem as sete larguras,
continuam passando.

## D. Acessibilidade

Não se aplica: nenhuma tela nova. Zero violações de axe-core nas páginas existentes, medido de novo.

## E. Segurança e dados

| #   | Resultado                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| E1  | **13 tabelas verificadas, 0 sem controle de acesso**, nos dois projetos. Políticas: teste completo, produção depois do merge (E1, E2, E3)   |
| E2  | Bundle: 149 arquivos varridos, 35 entregues ao navegador, **0 ocorrências**. Histórico: 6 credenciais reais buscadas em todos os commits, **0 ocorrências** |
| E3  | O banco valida: enum fechado no eixo de projeto, CHECK de tamanho nas mensagens — um deles recusou um INSERT durante o teste da purga        |
| E4  | Finalidade, base legal e os dois prazos em `docs/DADOS-PESSOAIS.md`; purga **executada**, 5 removidos e 2 preservados                        |
| E5  | Chamadas de log de `src/` e `scripts/` auditadas uma a uma: nenhuma leva dado pessoal                                                        |
| E6  | Parcial e declarado: esta feature distingue **anônimo de autenticado**. Os três papéis do ADR-0001 são da F14 — 85 células de recusa cobrem o que existe hoje |

## F. Desempenho

| #   | Resultado                                                             |
| --- | --------------------------------------------------------------------- |
| F1  | Todas as asserções do Lighthouse passaram, 3 execuções                |
| F2  | Idem                                                                  |
| F3  | Não se aplica: nenhuma imagem nova                                    |
| F4  | **22 dependências diretas** — 4 de execução, 18 de desenvolvimento. `@supabase/ssr` ausente, e a ausência é verificada junto da contagem |

## G. Conteúdo

| #   | Resultado                                                                                        |
| --- | ------------------------------------------------------------------------------------------------ |
| G1  | 49 literais no bloco de espaço reservado do seed, **0 sem a marca `[EXEMPLO]`**                   |
| G2  | Idem. A exceção — o texto da Secretaria — está na divergência reportada em A4                    |
| G3  | Frentes de trabalho, orientadoras, fundadores e FAQ entram literais. As 4 correções obrigatórias conferidas: **0 ocorrências** dos valores errados |
| G4  | Revisado                                                                                          |

## H. Manutenção

| #   | Resultado                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------ |
| H1  | README ganhou três seções: apagar dado pessoal, o comportamento com o banco pausado e as duas portas do Postgres |
| H2  | ADR-0005 ganhou a seção de migrações. A decisão das concessões está na própria migração 0012, com o motivo por extenso |
| H3  | 2 dependências novas, as previstas no plano. Nenhuma além                                                     |
| H4  | Cada migração e cada script explicam **por que**, não o que                                                   |
| H5  | 0 `TODO` no código. As pendências estão na seção 9 das evidências e no relatório                              |

---

## Veredito

- [x] **Aprovado com ressalvas** — segue, com as pendências abaixo registradas

**Itens reprovados:** nenhum.

**Pendências registradas:**

1. Aplicar as migrações 0009 a 0013 em **produção**, depois do merge (E3).
2. Cadastrar `SUPABASE_ACCESS_TOKEN` e `SUPABASE_SERVICE_ROLE_KEY` como segredos do repositório, e
   `NEXT_PUBLIC_SUPABASE_URL` como variável. Sem eles, os dois passos novos do CI ficam **vermelhos
   dizendo que não verificaram** — que é o comportamento correto, e deixa o CI desta branch vermelho.
3. Confirmar com a liga o texto da **Secretaria**, ainda provisório.

**Observação para o Gabriel — onde olhar com atenção:**

A **E7**: as políticas ficaram escritas e inertes por falta de concessão, com todos os indicadores de
segurança verdes. É o tipo de verde que este projeto inteiro existe para não aceitar, e ele passou
por aqui. Vale conferir se a coluna de concessões do verificador cobre o que você esperaria dela.
