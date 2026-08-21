---
description: 'Lista de tarefas — F01 Design system em componentes do Portal LIACUP'
---

# Tarefas: Design system em componentes (F01)

**Input**: artefatos de projeto em `specs/002-design-system/`

**Pré-requisitos**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [FIDELIDADE.md](./FIDELIDADE.md), [quickstart.md](./quickstart.md)

**Testes**: obrigatórios. Cada componente tem teste de unidade; a vitrine tem as quatro verificações de ponta a ponta do contrato.

**Organização**: uma fase por história da spec, na ordem de prioridade dela. Esta lista foi **re-derivada contra a `spec.md` restaurada** — a versão anterior tinha sido montada sem ela, e três das cinco histórias tinham ficado sem fase, levando junto o FR-008, o FR-019, o SC-007, o SC-010 e o SC-011.

## Formato: `[ID] [P?] [História] Descrição`

- **[P]**: pode rodar em paralelo — arquivos diferentes, sem dependência pendente.
- **[USn]**: história a que a tarefa pertence; só nas fases de história.
- Toda tarefa cita os requisitos que cumpre, para que a cobertura seja calculável por máquina e não dependa de leitura.

---

## Fase 1: Decisões e fundação bloqueante

**Objetivo**: registrar as decisões que autorizam os desvios **antes** de escrever componente ou CSS.

**⚠️ CRÍTICO**: T001–T006 terminam nesta ordem; nenhuma tarefa de componente começa antes.

- [X] T001 Criar `docs/ADR-0004-controles-e-fidelidade.md` com as decisões 2.1 (alvo 44×44), 2.2 (campo 16px), 2.3 (tipografia do botão 14px/heading/400) e 2.4 (tabela de fidelidade), incluindo a consequência conhecida de o par botão+campo deixar de compartilhar tamanho de fonte (FR-012)
- [X] T002 Atualizar a seção 1 de `docs/PADROES-DE-CODIGO.md` com `src/app/(interno)/` como quarto grupo de rotas, para ferramentas internas não públicas como a vitrine (FR-014)
- [X] T003 Adendar `docs/ADR-0003-tokens-e-acessibilidade.md`: registrar as quatro reatribuições medidas — `.card-meta` para `--color-neutral-700` (4,92:1), `.card-kicker` e `.tag-outline` para `--color-accent-700` (6,15:1), `.input` e `.btn-secondary` para borda `--color-neutral-600` (3,21:1) — e registrar que `.card-body` (7,18:1), rótulo de campo (5,31:1) e botão desabilitado (2,72:1, isento da SC 1.4.3) **não mudam**, para ninguém "consertar" depois (FR-009, FR-012)
- [X] T004 Acrescentar os 21 tokens inventariados em `src/estilos/tokens.css`, incluindo `--margem-abaixo-rotulo`, `--radius-xl` e `--opacidade-cartao-corpo`, sem alterar nenhum token existente, conforme a tabela de `data-model.md` (FR-005, FR-010, SC-006, SC-007)
- [X] T005 Atualizar `liacup.css` **antes de qualquer remoção de classe**: dobrar o valor efetivo para dentro dos **seis** blocos que a cascata final sobrescreve — `border-radius: calc(var(--radius-lg) * 1.15)` em `.card` e `.dialog`; `border-radius: 999px` em `.btn`, `.tag`, `.seg` e `.input`; e `padding-inline: 14px` em `.input` — usando **os literais que a cascata de fato produzia**, nunca `--radius-xl` nem `--radius-pill`, que **não existem no `:root` do `liacup.css`** e deixariam `.dialog` e `.seg` sem raio nenhum quando o arquivo é lido isolado. Só então remover as três regras finais compartilhadas (**62 → 59** seletores). Com cada bloco declarando o próprio valor efetivo, nenhuma ordem de leitura consegue errar — que é o modo de falha do D2 (FR-009, FR-011)
- [X] T006 Anotar em `liacup.css` os **três** valores reprovados que permanecem entre as classes pendentes, cada um com a correção da ADR-0003 em comentário ao lado do valor original: `.text-muted` (3,58:1) → `--color-neutral-700`; `.nav a:hover` e `.nav a[aria-current='page']` (3,48:1) → `--color-accent-700`; `.table th` (3,97:1) → `--color-neutral-700`. Nenhum sai da contagem de pendências. **Não mexer** em `.dialog-body` (8,34:1) nem `.seg-opt` (13,95:1), que passam (FR-011, FR-012)

**Ponto de verificação**: ADR-0004 e o adendo existem; os seis blocos declaram o próprio valor efetivo com literais que resolvem dentro do `liacup.css`; as três regras finais saíram (62 → 59); os três valores reprovados que ficam estão anotados.

---

## Fase 2: História 1 — As peças de base existem e são tipadas (P1)

**Objetivo**: os cinco componentes existem, com variantes em união fechada e nenhum valor de estilo à mão.

**Teste independente**: escrever uma variante inexistente e ver a verificação de tipos recusar; escrever uma existente e ver funcionar.

- [X] T007 [P] [US1] Atualizar `src/componentes/ui/Botao.tsx` e `Botao.module.css` para as quatro variantes do contrato, restaurando fonte `--font-heading` / peso 400 / `--font-size-controle`, raio pílula, 44px mantidos, opacidade desabilitada tokenizada e as cores do adendo da ADR-0003. Incluir no topo do arquivo o bloco **o que é / quando usar / quando não usar** (FR-001, FR-002, FR-003, FR-005, FR-009, FR-019)
- [X] T008 [US1] Atualizar `src/componentes/ui/Botao.test.tsx` cobrindo renderização, as quatro variantes, `type="button"`, botão de ícone com nome acessível, desabilitado, largura total, **navegação por Tab e ativação por Enter e Espaço** (FR-008, FR-018, SC-002)
- [X] T009 [P] [US1] Criar `src/componentes/ui/Cartao.tsx` e `Cartao.module.css` com composição por `children` e partes nomeadas, elevação em união fechada, `--radius-xl`, opacidade tokenizada e as cores corrigidas de kicker e meta. Incluir o bloco **o que é / quando usar / quando não usar** (FR-001, FR-002, FR-003, FR-004, FR-005, FR-009, FR-019)
- [X] T010 [US1] Criar `src/componentes/ui/Cartao.test.tsx` cobrindo cartão completo, ausência independente de título e de corpo, só meta, os quatro níveis de elevação e os níveis de título 2–6 (FR-004, FR-018, SC-002)
- [X] T011 [P] [US1] Criar `src/componentes/ui/Etiqueta.tsx` e `Etiqueta.module.css` com as quatro variantes, raio pílula, quebra segura de texto longo e `--color-accent-700` no contorno. Incluir o bloco **o que é / quando usar / quando não usar** (FR-001, FR-002, FR-003, FR-005, FR-009, FR-019)
- [X] T012 [US1] Criar `src/componentes/ui/Etiqueta.test.tsx` cobrindo as variantes, texto longo e ausência de comportamento interativo (FR-018, SC-002)
- [X] T013 [P] [US1] Criar `src/componentes/ui/Separador.tsx` e `Separador.module.css` convertendo `.hr`, com `decorativo` padrão e altura `var(--largura-borda)`. Incluir o bloco **o que é / quando usar / quando não usar** (FR-001, FR-002, FR-003, FR-005, FR-009, FR-019)
- [X] T014 [US1] Criar `src/componentes/ui/Separador.test.tsx` cobrindo os modos decorativo e semântico (FR-018, SC-002)
- [X] T015 [P] [US1] Criar `src/componentes/ui/Campo.tsx` e `Campo.module.css` na forma tipada: `tipo` em união fechada (texto, email, textarea), fonte `--font-size-campo` (16px), altura `--alvo-de-toque` (44px), borda `--color-neutral-600`, nenhum valor à mão. Incluir o bloco **o que é / quando usar / quando não usar**. O contrato de acessibilidade vem na Fase 3 (FR-001, FR-002, FR-003, FR-005, FR-009, FR-019)
- [X] T016 [US1] Demonstrar que estado impossível não compila: escrever `<Etiqueta variante="roxa">`, rodar `npm run verificar:tipos` e registrar a **falha**; remover e registrar o retorno ao verde. Duas execuções, dois resultados opostos — promovida da Evidência 4 do quickstart (FR-002)

**Ponto de verificação**: os cinco componentes existem, cada um com o bloco de documentação; variante inválida não compila, comprovado.

---

## Fase 3: História 2 — O campo de formulário é utilizável por todo mundo (P1)

**Objetivo**: o componente com mais superfície de acessibilidade do conjunto cumpre o contrato inteiro.

**Teste independente**: navegar o campo só pelo teclado, com leitor de tela ligado, nos quatro estados.

- [X] T017 [US2] Implementar em `src/componentes/ui/Campo.tsx` o contrato de acessibilidade: `useId` para o identificador, `<label htmlFor>` sempre presente, ajuda e erro ligados por `aria-describedby`, `aria-invalid` no erro, erro em região `aria-live="polite"`, e `rotuloEscondido` mantendo o rótulo para leitor de tela (FR-006, FR-007)
- [X] T018 [US2] Fazer a mensagem de erro do `Campo` não depender só de cor: **texto e ícone** além da borda, e manter o erro visível quando o campo está desabilitado — esconder apagaria a única explicação de por que o formulário não envia (FR-007)
- [X] T019 [US2] Garantir no `Campo` a operabilidade por teclado com foco visível, usando o anel já decidido na ADR-0003 (`--focus-ring-width`, `--color-accent-700`), inclusive no `textarea` (FR-008)
- [X] T020 [US2] Criar `src/componentes/ui/Campo.test.tsx` cobrindo associação rótulo-controle, ajuda, erro anunciado e marcado, **dois campos com o mesmo rótulo**, rótulo escondido, textarea, desabilitado, **erro + desabilitado** e alcance por Tab (FR-006, FR-007, FR-008, FR-018, SC-002)

**Ponto de verificação**: os quatro estados do campo funcionam por teclado e são anunciados corretamente.

---

## Fase 4: História 3 — A vitrine mostra o sistema inteiro (P2)

**Objetivo**: exibir todos os componentes, em todas as variantes e estados, e converter as quatro promessas do contrato em falhas automatizadas.

**Teste independente**: abrir `/vitrine`, encontrar uma seção por componente, e confirmar que o site público não oferece caminho até ela.

- [ ] T021 [US3] Criar `src/app/(interno)/vitrine/Secao.tsx`, `page.tsx` e `page.module.css`, com metadados `robots: { index: false, follow: false }`, `<h1>` único e um `<h2>` por componente, sem pular nível (FR-013, FR-014)
- [ ] T022 [US3] Montar em `src/app/(interno)/vitrine/page.tsx` todas as variantes, estados e casos de borda de `contracts/vitrine.md` — incluindo cartão sem título, etiqueta com texto longo, campo com erro + desabilitado, dois campos com o mesmo rótulo — e a **linha de inscrição** com `Campo` e `Botao` lado a lado, que torna visível o par 16px/14px deliberadamente desfeito (FR-013)
- [ ] T023 [US3] Criar `tests/e2e/vitrine.spec.ts` com axe-core sobre `/vitrine` nas sete larguras, imprimindo o número de violações (FR-015, SC-003)
- [ ] T024 [US3] Acrescentar em `tests/e2e/vitrine.spec.ts` a medição de todos os alvos interativos visíveis, falhando abaixo de 44px e imprimindo **quantos foram medidos** e quais falharam — sem o contador, "nenhum abaixo de 44" e "não mediu nada" produzem a mesma saída verde (FR-016, SC-004)
- [ ] T025 [US3] Acrescentar em `tests/e2e/vitrine.spec.ts` a checagem de `scrollWidth <= clientWidth` em 360, 390, 430, 480, 768, 1024 e 1280px, nomeando a largura na falha (FR-017, SC-005)
- [ ] T026 [US3] Acrescentar em `tests/e2e/vitrine.spec.ts` a varredura dos links da página pública, falhando se algum apontar para `/vitrine` (FR-014, SC-008)
- [ ] T027 [US3] Demonstrar a verificação anterior: acrescentar de propósito um link para `/vitrine` na página inicial, rodar e registrar a **falha** com o link listado; remover e registrar o verde. Mesmo raciocínio das demonstrações V1 a V5 da F00 (FR-014, SC-008)
- [ ] T028 [US3] Conferir na vitrine que todo elemento interativo tem **foco visível** ao ser alcançado por Tab, percorrendo a página inteira (FR-008)

**Ponto de verificação**: axe zero, nenhum alvo abaixo de 44px com contador maior que zero, sete larguras sem rolagem horizontal, e a varredura de links vista falhando e voltando ao verde.

---

## Fase 5: História 4 — A conversão é fiel e rastreável (P2)

**Objetivo**: o que foi convertido corresponde ao aprovado, e o que falta continua identificável.

**Teste independente**: comparar cada componente com a classe de origem; abrir o `liacup.css` e listar o que resta.

- [ ] T029 [US4] Remover de `liacup.css` as **32** classes convertidas — as três de cascata já saíram na T005, então 59 − 32 = **27** — e agrupar as 27 restantes sob cabeçalhos nomeando a feature de destino, confirmando que `.dialog`, `.seg` e os três valores anotados preservam as decisões das T005 e T006 (FR-011, SC-009)
- [ ] T030 [US4] Preencher por componente as tabelas de `specs/002-design-system/FIDELIDADE.md`, comparando sempre contra o **valor efetivo pós-cascata**, com as três linhas de cor do `Botao`, as quatro correções de contraste, a opacidade do cartão, a linha do separador e a linha do par 14px/16px. **Zero vereditos não idênticos sem motivo escrito** (FR-009, FR-012)
- [ ] T031 [US4] Verificar que nenhum token existente foi alterado: `git diff main -- src/estilos/tokens.css` só pode mostrar **linhas acrescentadas**, e os 20 tokens novos batem um a um com a tabela do `data-model.md` — promovida da Evidência 11 do quickstart (FR-010, SC-007)
- [ ] T032 [US4] Conferir a contagem final com `grep -cE "^\.[a-z]" liacup.css` e registrar o número, que precisa ser **27** (FR-011, SC-009)

**Ponto de verificação**: 27 classes restantes, todas identificáveis; tabela de fidelidade sem nenhuma linha órfã de motivo.

---

## Fase 6: História 5 — Quem vem depois sabe usar sem perguntar (P3)

**Objetivo**: o Princípio I aplicado ao design system. Não é opcional: sem esta fase a feature não está pronta.

**Teste independente**: pedir a alguém que não participou para escolher o componente certo para uma tela descrita em voz alta, usando só o que está escrito nos arquivos.

- [ ] T033 [US5] Conferir que os **sete** componentes de base — os cinco convertidos mais `Icone` e `EstadoVazio` da F00 — trazem no próprio arquivo o bloco **o que é / quando usar / quando não usar**, e que o "quando não usar" nomeia a armadilha conhecida de cada um. São **7 componentes de base** disponíveis ao fim da feature (FR-019, SC-001, SC-010)
- [ ] T034 [US5] Atualizar `README.md` apontando `/vitrine` como o lugar de ver o sistema inteiro, com o endereço e a regra de que ela não recebe link público (FR-020)
- [ ] T035 [US5] Descrever uma tela em voz alta para alguém que não participou — "uma lista de notícias com categoria e data" — e registrar se a pessoa escolhe os componentes certos **sem perguntar nada** (SC-011)
- [ ] T036 [US5] Conferir que a contagem de dependências diretas continua em **3 de execução e 17 de desenvolvimento, total 20** — esta feature não instala nada (FR-021, SC-012)

**Ponto de verificação**: alguém de fora escolhe o componente certo usando só os arquivos.

---

## Fase 7: Polimento e evidências finais

- [ ] T037 Executar `npm run verificar`, `npm test`, `npm run build && npm run test:e2e` e `npm run test:desempenho`, confirmando que nada da F00 quebrou — os 35 testes da página inicial continuam passando e os limiares **não** descem (SC-013)
- [ ] T038 Registrar as evidências em `specs/002-design-system/EVIDENCIAS-F01.md`, arquivo próprio seguindo o precedente do `EVIDENCIAS-F00.md` — o `quickstart.md` é o guia, não o registro (SC-013, Princípio VII)
- [ ] T039 Preencher `docs/checklist-validacao.md` para a F01 com resultado real em cada item: contraste, 44px, sete larguras, 27 classes restantes, 20 tokens, fidelidade e ausência de link público. **Esta tarefa responde à constituição, não a um requisito numerado** — o checklist de validação é exigência do Princípio VII e por isso não cita FR nem SC; registrado aqui para a contagem mecânica não acusar ausência (Princípio VII, sem FR/SC por definição)

---

## Dependências entre fases

```text
Fase 1 (T001–T006, bloqueante e sequencial)
   ↓
Fase 2 — US1 (P1)  peças tipadas
   ↓
Fase 3 — US2 (P1)  campo acessível        depende do Campo criado na T015
   ↓
Fase 4 — US3 (P2)  vitrine                exibe o que US1 e US2 construíram
   ↓
Fase 5 — US4 (P2)  fidelidade e limpeza
   ↓
Fase 6 — US5 (P3)  documentação
   ↓
Fase 7 — evidências
```

**Sobre a prioridade da vitrine**: a spec a define como **P2**, e as tarefas seguem a spec. A versão anterior desta lista a marcava P1, contradizendo a spec em silêncio — o Princípio V põe a spec acima das tarefas. A P2 também é coerente: a vitrine exibe o que a US1 e a US2 produzem, então não pode precedê-las.

## Oportunidades de paralelismo

| Fase | Tarefas paralelas | Por que dá |
|---|---|---|
| 2 | T007, T009, T011, T013, T015 | Um componente por par de arquivos, sem interseção |

Os testes de cada componente vêm **depois** do componente correspondente, e as quatro verificações da vitrine são cumulativas no mesmo arquivo — por isso sequenciais.

## Estratégia de implementação

**Ordem recomendada**: Fase 1 inteira → Fase 2 (os cinco componentes em paralelo, testes na sequência) → Fase 3 → Fase 4 → Fase 5 → Fase 6 → Fase 7.

**Onde não cortar caminho**: a Fase 1 existe para que os desvios sejam autorizados **antes** de virarem código. Começar pelos componentes e registrar depois é exatamente como os três desvios do botão entraram na F00.

## Fora de escopo, registrado

Nenhuma página real do site · nenhum componente exclusivo do painel — tabela, diálogo, opção e seletor segmentado ficam para a Fase 2 · nenhuma biblioteca de componentes de terceiros · nenhuma dependência nova · navegação do site, que entra com o primeiro layout público.
