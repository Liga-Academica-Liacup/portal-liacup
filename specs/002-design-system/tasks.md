---
description: 'Lista de tarefas — F01 Design system em componentes do Portal LIACUP'
---

# Tarefas: Design system em componentes (F01)

**Input**: artefatos de projeto em `specs/002-design-system/`

**Pré-requisitos**: [plan.md](./plan.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [FIDELIDADE.md](./FIDELIDADE.md) e
[quickstart.md](./quickstart.md)

**Testes**: obrigatórios. Cada componente tem teste unitário; a vitrine tem as quatro verificações
de ponta a ponta definidas no contrato.

**Observação honesta**: `spec.md` não está presente neste diretório. As tarefas abaixo foram
derivadas dos sete artefatos existentes e dos critérios FR/SC que eles referenciam. Restaurar a spec
antes de implementar continua necessário para cumprir o Princípio V.

## Formato: `[ID] [P?] [História] Descrição`

- **[P]**: executável em paralelo somente após as dependências declaradas.
- **[USn]**: história a que a tarefa pertence; só aparece nas fases de história.

---

## Fase 1: Decisões e fundação bloqueante

**Objetivo**: registrar as decisões que autorizam os desvios antes de escrever componente ou CSS.

**⚠️ CRÍTICO**: T001–T005 devem terminar nesta ordem; nenhuma tarefa de componente começa antes.

- [ ] T001 Criar `docs/ADR-0004-controles-e-fidelidade.md` com as decisões 2.1 (44×44), 2.2 (campo 16px), 2.3 (tipografia do botão 14px/heading/400) e 2.4 (tabela de fidelidade), incluindo a consequência conhecida de o par botão+campo deixar de compartilhar tamanho de fonte
- [ ] T002 Atualizar a seção 1 de `docs/PADROES-DE-CODIGO.md` com `src/app/(interno)/` como quarto grupo de rotas, para ferramentas internas não públicas como a vitrine
- [ ] T003 Adendar `docs/ADR-0003-tokens-e-acessibilidade.md` antes da implementação: registrar as quatro reatribuições medidas — `.card-meta` para `--color-neutral-700` (4,92:1), `.card-kicker` e `.tag-outline` para `--color-accent-700` (6,15:1), `.input` e `.btn-secondary` para borda `--color-neutral-600` (3,21:1) — e registrar que `.card-body` (7,18:1), rótulo de campo (5,31:1) e botão desabilitado (2,72:1, isento) não mudam
- [ ] T004 Acrescentar os 20 tokens inventariados em `src/estilos/tokens.css`, incluindo `--margem-abaixo-rotulo`, `--radius-xl` e `--opacidade-cartao-corpo`, sem alterar tokens existentes e em conformidade com `specs/002-design-system/data-model.md`
- [ ] T005 Atualizar `liacup.css` **antes de remover classes F01**: dobrar `border-radius: var(--radius-xl)` no bloco `.dialog` e `border-radius: var(--radius-pill)` no bloco `.seg`; só então remover as regras finais compartilhadas, preservando o valor efetivo das classes da Fase 2 e a contagem SC-009 de 27
- [ ] T006 Atualizar `.text-muted` em `liacup.css` para `var(--color-neutral-700)` e comentar a reatribuição da ADR-0003, sem removê-la da contagem de pendências; o `color-mix(... 55%)` de 3,58:1 não pode permanecer como valor vivo

**Ponto de verificação**: ADR-0004 e o adendo de contraste existem; `liacup.css` preserva `.dialog`
e `.seg` com os valores pós-cascata dentro dos próprios blocos.

---

## Fase 2: História 1 — Quem constrói páginas recebe componentes fiéis e acessíveis (P1)

**Objetivo**: converter as 35 classes previstas em componentes tipados, sem números soltos, e provar
o contrato unitariamente.

**Teste independente**: `npm test` passa para cada componente; `npm run verificar:tokens` não
encontra valores manuais nos módulos.

- [ ] T007 [US1] Atualizar `src/componentes/ui/Botao.tsx` e `src/componentes/ui/Botao.module.css` para as quatro variantes do contrato, restaurando fonte heading/400/14px, usando raio pílula, mantendo 44px, tokenizando a opacidade desabilitada e aplicando as cores e a borda aprovadas no adendo da ADR-0003
- [ ] T008 [US1] Atualizar `src/componentes/ui/Botao.test.tsx` para cobrir renderização, quatro variantes, `type="button"`, botão de ícone com nome acessível, estado desabilitado e largura total
- [ ] T009 [US1] Criar `src/componentes/ui/Cartao.tsx` e `src/componentes/ui/Cartao.module.css` com composição por `children`, partes nomeadas e elevação fechada, usando `--radius-xl`, opacidade tokenizada e as cores corrigidas de kicker/meta
- [ ] T010 [US1] Criar `src/componentes/ui/Cartao.test.tsx` cobrindo cartão completo, ausência independente de título/corpo, só meta, níveis de elevação e níveis de título 2–6
- [ ] T011 [US1] Criar `src/componentes/ui/Etiqueta.tsx` e `src/componentes/ui/Etiqueta.module.css` com as quatro variantes, raio pílula, quebra segura de texto longo e `--color-accent-700` na variante de contorno
- [ ] T012 [US1] Criar `src/componentes/ui/Etiqueta.test.tsx` cobrindo variantes, texto longo e ausência de comportamento interativo
- [ ] T013 [US1] Criar `src/componentes/ui/Campo.tsx` e `src/componentes/ui/Campo.module.css` com `useId`, rótulo obrigatório, ajuda/erro ligados por ARIA, `aria-live`, erro também textual e com ícone, texto/email/textarea, fonte 16px, altura 44px e borda `--color-neutral-600`
- [ ] T014 [US1] Criar `src/componentes/ui/Campo.test.tsx` cobrindo associação rótulo-controle, ajuda, erro, dois rótulos iguais, rótulo escondido, textarea, desabilitado e erro+desabilitado
- [ ] T015 [US1] Criar `src/componentes/ui/Separador.tsx` e `src/componentes/ui/Separador.module.css` convertendo `.hr`, com `decorativo` padrão e altura `var(--largura-borda)`
- [ ] T016 [US1] Criar `src/componentes/ui/Separador.test.tsx` cobrindo os modos decorativo e semântico
- [ ] T017 [US1] Remover de `liacup.css` somente as 35 classes convertidas, agrupar as 27 restantes em cabeçalhos com feature de destino e confirmar que `.dialog`, `.seg` e `.text-muted` preservam as decisões das T005–T006
- [ ] T018 [US1] Preencher por componente as tabelas em `specs/002-design-system/FIDELIDADE.md`, incluindo as três linhas de cor de `Botao`, as quatro correções de contraste, a opacidade de cartão, a linha do separador e a linha explícita do par 14px/16px; deixar zero vereditos não idênticos sem motivo

**Ponto de verificação**: os 7 componentes de base existem (incluindo `Icone` e `EstadoVazio` da
F00), 35 classes saíram, 27 ficaram identificadas e todas as diferenças intencionais estão
registradas.

---

## Fase 3: História 2 — A liga revisa o sistema numa vitrine interna (P1)

**Objetivo**: expor todas as variantes e casos de borda em `/vitrine`, publicada mas não linkada nem
indexada.

**Teste independente**: abrir `/vitrine`, encontrar uma seção de cada componente e verificar que o
site público não oferece link até ela.

- [ ] T019 [US2] Criar `src/app/(interno)/vitrine/Secao.tsx`, `src/app/(interno)/vitrine/page.tsx` e `src/app/(interno)/vitrine/page.module.css` com metadados `noindex,nofollow`, h1 único e h2 por componente
- [ ] T020 [US2] Montar em `src/app/(interno)/vitrine/page.tsx` todas as variantes, estados e casos de borda de `specs/002-design-system/contracts/vitrine.md`, incluindo a **linha de inscrição** com `Campo` e `Botao` lado a lado para tornar visível o par 16px/14px
- [ ] T021 [US2] Atualizar `README.md` com o endereço `/vitrine`, sua finalidade de revisão e a regra de que ela não recebe link público

---

## Fase 4: História 3 — A manutenção detecta regressões da vitrine (P2)

**Objetivo**: converter as quatro promessas do contrato em falhas automatizadas nas sete larguras.

**Teste independente**: `npm run build && npm run test:e2e` passa; introduzir cada falha descrita no
contrato faz o teste correspondente falhar.

- [ ] T022 [US3] Criar `tests/e2e/vitrine.spec.ts` com axe-core sobre `/vitrine` nas sete larguras e saída com o total de violações
- [ ] T023 [US3] Acrescentar em `tests/e2e/vitrine.spec.ts` a medição de todos os alvos interativos visíveis, falhando abaixo de 44px e imprimindo quantidade medida e elementos que falharam
- [ ] T024 [US3] Acrescentar em `tests/e2e/vitrine.spec.ts` a checagem de `scrollWidth <= clientWidth` em 360, 390, 430, 480, 768, 1024 e 1280px, identificando a largura na falha
- [ ] T025 [US3] Acrescentar em `tests/e2e/vitrine.spec.ts` a varredura dos links da página pública, falhando se algum apontar para `/vitrine`

---

## Fase 5: Polimento e evidências finais

- [ ] T026 Executar `npm run verificar`, `npm test`, `npm run build && npm run test:e2e` e `npm run test:desempenho`, registrando as 20 evidências em `specs/002-design-system/quickstart.md` sem baixar limiares
- [ ] T027 Preencher `docs/checklist-validacao.md` para a F01 com resultados reais: contraste, 44px, sete larguras, 27 classes restantes, 20 tokens, fidelidade e ausência de link público
- [ ] T028 Executar `/speckit.analyze` após as tarefas e os artefatos estarem completos, corrigindo qualquer achado CRITICAL/HIGH antes de `/speckit.implement`

## Dependências e paralelismo

```text
T001 → T002 → T003 → T004 → T005 → T006
                                      ↓
                       US1 (T007–T018) → US2 (T019–T021) → US3 (T022–T025)
                                                               ↓
                                                         T026–T028
```

Após T006, os pares T007/T009/T011/T013/T015 podem avançar em paralelo se cada responsável mantiver
seus próprios arquivos; o mesmo vale para seus testes somente depois do componente correspondente.
As quatro verificações de ponta a ponta são cumulativas no mesmo arquivo e, por isso, sequenciais.

## Estratégia de entrega

**MVP**: Fases 1 e 2 — componentes fiéis e acessíveis, com suas tabelas de fidelidade preenchidas.
A feature só fica pronta com a vitrine e as quatro verificações: sem elas a liga não consegue revisar
e o CI não consegue impedir regressões.

## Validação de formato

As 28 tarefas seguem `- [ ] T### [P?] [US?] descrição com caminho`; as tarefas de história usam
`[US1]`, `[US2]` ou `[US3]`, e as fundações/polimento não usam rótulo de história.
