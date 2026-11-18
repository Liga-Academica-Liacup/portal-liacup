---
description: 'Lista de tarefas — F00 Fundação técnica do Portal LIACUP'
---

# Tarefas: Fundação técnica do Portal LIACUP (F00)

**Input**: documentos de projeto em `/specs/001-fundacao-tecnica/`

**Pré-requisitos**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Testes**: incluídos e obrigatórios — a spec exige teste de unidade (FR-012) e de ponta a ponta (FR-013 a FR-015) como parte da entrega.

**Organização**: agrupadas por história de usuário, na ordem de prioridade da spec.

## Formato: `[ID] [P?] [História] Descrição`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[USn]**: a qual história pertence — só nas fases de história

## Convenções de caminho

Projeto único Next.js: `src/` e `tests/` na raiz, conforme a seção 1 de `docs/PADROES-DE-CODIGO.md` e a estrutura do [plan.md](./plan.md).

---

## Fase 1: Preparação (infraestrutura compartilhada)

**Objetivo**: projeto inicializado com as versões travadas e a paridade Windows/Linux garantida desde o primeiro arquivo.

- [X] T001 Inicializar o projeto Next.js 16.3.1 com App Router e TypeScript na raiz do repositório, gerando `package.json`, `next.config.ts` e `tsconfig.json`, sem incluir nenhuma dependência fora da tabela do plan.md
- [X] T002 Travar as versões críticas em `package.json`: `typescript@5.9.3` e `eslint@^9` conforme research.md D1 e D2, e conferir que `npm ci` instala sem aviso de par incompatível
- [X] T003 [P] Declarar `engines.node: ">=22"` em `package.json` e criar `.nvmrc` com `22`, alinhados com a versão usada no CI (research.md D6)
- [X] T004 [P] Criar `.gitignore` cobrindo `node_modules`, `.next`, `.env*` exceto `.env.example`, `playwright-report`, `test-results` e `.lighthouseci`, garantindo que nenhum arquivo de ambiente entre no repositório (FR-023)
- [X] T005 [P] Criar `.gitattributes` com `* text=auto eol=lf` para normalizar fim de linha no repositório (FR-028)
- [X] T006 Configurar `tsconfig.json` em modo estrito com `strict: true`, `noUncheckedIndexedAccess: true` e `forceConsistentCasingInFileNames: true` declarado explicitamente, e o atalho `@/*` para `src/*` (FR-007, FR-028)
- [X] T007 [P] Criar `.prettierrc` com `endOfLine: "lf"` e `.prettierignore`, garantindo que o Windows não gere diferença de formatação (FR-028)
- [X] T008 Declarar em `package.json` os 13 comandos do contrato [contracts/comandos.md](./contracts/comandos.md), incluindo `verificar` encadeando tipos, lint, formatação e tokens, e `dev` como o **único comando** que sobe o projeto localmente (FR-001)

---

## Fase 2: Fundação (pré-requisitos bloqueantes)

**Objetivo**: tokens corretos e árvore de pastas completa. Sem isto, nenhuma história pode começar.

**⚠️ CRÍTICO**: nenhuma história de usuário começa antes desta fase terminar.

- [X] T009 Extrair de `liacup.css` **apenas o bloco `:root`** (linhas 6 a 65, as custom properties) para `src/estilos/tokens.css`, preservando o cabeçalho de comentário original e **sem alterar nenhum valor** — o arquivo passa a ser o que os padrões definem: única fonte de cor, espaçamento, raio, sombra e tipografia (FR-006)
- [X] T010 Extrair de `liacup.css` o reset e as **regras de elemento** (`*`, `body`, `h1`–`h6`, `p`, `a`, `img`, `figure`, `figcaption`, `:focus-visible`, `::selection`) para `src/estilos/global.css`, aplicando aqui duas reatribuições do ADR-0003: `a` passa a usar `var(--color-accent-700)` e o texto secundário passa a usar `var(--color-neutral-700)` (FR-005, FR-026)
- [X] T011 Descartar da migração as **~35 classes de componente** de `liacup.css` (`.btn` e variantes, `.card`, `.input`, `.field`, `.radio`, `.seg`, `.tag`, `.nav`, `.table`, `.dialog`, `.hr`, `.elev-*`, `.washed`) — elas são **insumo da F01**, onde cada uma vira componente React conforme a seção 2 dos padrões. Trazê-las agora criaria duas implementações de botão convivendo, uma em CSS e outra no `Botao.tsx` da T017, e na F01 ninguém saberia qual manda (FR-006, Princípio IX)
- [X] T012 Remover o `@import` de `fonts.googleapis.com` (linha 4 de `liacup.css`) na migração e manter intactas as escalas de espaçamento fracionário, que o ADR-0003 seção 4 manda não tocar (FR-027)
- [X] T013 Criar a árvore completa de `src/` conforme a seção 1 de `docs/PADROES-DE-CODIGO.md`: `app/(site)`, `app/(painel)`, `app/api`, `componentes/{ui,layout,padroes}`, `features`, `lib/{supabase,validacao,email,utils}` e `estilos`, sem pasta faltando e sem pasta extra não prevista (FR-002, SC-013)
- [X] T014 [P] Criar um `README.md` curto em cada pasta que só ganha conteúdo depois — `src/app/(painel)`, `src/app/api`, `src/lib/supabase` e `src/lib/email` — dizendo o que vai ali e em qual feature entra (FR-003)
- [X] T015 Criar `src/app/layout.tsx` com `<html lang="pt-BR">`, carregando Caprasimo e Figtree por `next/font/google`, que baixa em build e serve pelo próprio domínio (FR-027)
- [X] T016 [P] Conferir que `docs/` está versionada com ADR-0001, ADR-0002, ADR-0003, `PADROES-DE-CODIGO.md`, `constitution.md` e `conteudo-institucional.md` (FR-024)

---

## Fase 3: História 1 — O esqueleto roda e chega ao ar (P1)

**Objetivo**: provar que o caminho do código até o ar existe, com uma página provisória que respeita os tokens.

**Teste independente**: clonar em pasta limpa, seguir só o README, rodar `npm run dev` e ver a página. Depois abrir o endereço publicado.

- [X] T017 [P] [US1] Criar o componente de exemplo da camada base em `src/componentes/ui/Botao.tsx`, com props tipadas, variante em vez de booleanas e nenhum valor de estilo escrito à mão. A variante primária usa `var(--color-accent-600)`, que é onde a reatribuição de botão do ADR-0003 deve viver segundo os padrões — não em CSS solto (FR-003, FR-026)
- [X] T018 [P] [US1] Criar o componente de exemplo de layout em `src/componentes/layout/Rodape.tsx`, usando só tokens (FR-003)
- [X] T019 [P] [US1] Criar a composição de exemplo em `src/componentes/padroes/EstadoVazio.tsx`, demonstrando o tratamento de estado vazio que todo componente de dado deve ter (FR-003)
- [X] T020 [US1] Criar a feature de exemplo em `src/features/exemplo/` com `tipos.ts`, `regras.ts` (função pura, sem banco e sem React), `dados.ts` (forma do acesso a dados, com dados em memória e comentário de que a conexão real chega na F02) e `componentes/ListaDeExemplos.tsx` tratando os **três estados obrigatórios — carregando, erro e vazio** —, reaproveitando o `EstadoVazio` da T019. Este arquivo é o molde que as 25 features seguintes vão copiar: exemplar incompleto propaga a falha (FR-003, Princípio IX, seção 2.6 dos padrões). **Depende da T019**
- [X] T021 [P] [US1] Criar o utilitário de exemplo em `src/lib/utils/formatar-data.ts` e o esquema de exemplo em `src/lib/validacao/` (FR-003)
- [X] T022 [US1] Copiar `assets/logo-liacup-256.png` para `public/` e criar a página provisória em `src/app/(site)/page.tsx` com a logo e a frase "Portal em construção", usando HTML semântico e `alt="Logo da LIACUP"` (FR-004)
- [X] T023 [US1] Servir a logo pelo componente de imagem do Next em `src/app/(site)/page.tsx`, com `width`/`height` explícitos e `priority`, usando a variante dimensionada (256 KB → 78 KB, ou 180/96 conforme o tamanho de exibição) e **nunca** `assets/logo-liacup.png`, que tem 749 KB e reprovaria o LCP (R1a, FR-029)
- [X] T024 [US1] Conferir que toda cor, espaçamento e tipografia da página provisória vem de `var(--token)`, sem nenhum valor literal (FR-005)

**Ponto de verificação**: `npm run dev` sobe e a página abre com a logo e a frase, sem erro no console.

---

## Fase 4: História 2 — As verificações realmente bloqueiam (P1)

**Objetivo**: as regras dos padrões de código viram verificação que falha de verdade. É a razão de existir da feature.

**Teste independente**: rodar cada verificação no estado inicial (limpa), introduzir cada violação e ver a verificação falhar apontando o arquivo, depois removê-la e ver voltar ao verde.

- [X] T025 [US2] Criar `eslint.config.mjs` em formato flat, estendendo `eslint-config-next` e habilitando `jsx-a11y` recomendado (FR-007)
- [X] T026 [US2] Acrescentar em `eslint.config.mjs` as três zonas fixas de `import/no-restricted-paths` da tabela de [contracts/regras-de-camada.md](./contracts/regras-de-camada.md): Z1 para `componentes/ui`, Z2 para `componentes/padroes` e Z3 para `lib`, esta última agora cópia direta da tabela dos padrões (FR-008)
- [X] T027 [US2] Implementar em `eslint.config.mjs` a geração automática de zonas por feature, lendo os diretórios de `src/features/` em tempo de carga e emitindo uma zona por feature, para que feature nova nasça protegida sem ninguém registrar nada (FR-008, research.md D3)
- [X] T028 [US2] Escrever as mensagens de violação em português, dizendo qual camada tentou importar de qual e por que não é permitido, em vez do texto padrão da regra (FR-009)
- [X] T029 [US2] Criar `scripts/verificar-tokens.mjs` sem nenhuma dependência, aplicando as sete regras da tabela de research.md D4, inclusive permitir hexadecimal dentro de `src/estilos/tokens.css` e `px` só nos pontos de corte 480, 768 e 1024 (FR-010)
- [X] T030 [US2] Fazer a mensagem de falha de `scripts/verificar-tokens.mjs` indicar arquivo, linha, o valor encontrado **e qual token usar no lugar** (FR-010, [contracts/comandos.md](./contracts/comandos.md))
- [X] T031 [US2] Rodar `npm run verificar` no estado inicial e registrar a saída dos quatro passos com zero problema (FR-007, SC-002)
- [X] T032 [US2] **Demonstração V1**: em alteração descartável, importar `@/features/exemplo/dados` dentro de `src/componentes/ui/Botao.tsx`, rodar `npm run lint`, registrar a falha com arquivo e linha, remover o import e registrar o retorno ao verde (FR-011, SC-003)
- [X] T033 [US2] **Demonstração V2**: criar `src/features/segunda/` temporária, importá-la de dentro de `src/features/exemplo/`, rodar `npm run lint` e registrar a falha — se passar, a geração automática de zonas do T027 não está funcionando e a regra não está pronta (FR-011, SC-003)
- [X] T034 [US2] **Demonstração V3**: escrever `color: #82558f` em um componente, rodar `npm run verificar:tokens`, registrar a falha com o token sugerido, remover e registrar o verde (FR-011, SC-004)
- [X] T035 [US2] **Demonstração V4 (o verificador não está cego)**: numa **única execução**, escrever `#82558f` em `src/estilos/tokens.css` (onde é permitido) **e** o mesmo valor, no mesmo formato, em `src/componentes/ui/Botao.tsx` (onde deve ser acusado), rodar `npm run verificar:tokens` e registrar os **vereditos opostos para o mesmo valor** — o que prova que ele varre os dois arquivos e decide pelo local. Fazer a saída informar **quantos arquivos foram varridos**, para que um verificador que não varre nada seja distinguível de um que aprova (FR-010)

**Ponto de verificação**: as quatro demonstrações registradas, cada uma com duas execuções e resultados opostos.

---

## Fase 5: História 3 — Os testes cobrem o que a constituição exige (P2)

**Objetivo**: deixar pronto o formato de teste que todas as features seguintes vão copiar.

**Teste independente**: `npm test` e `npm run test:e2e` passam, e a saída mostra quantos testes rodaram.

- [X] T036 [US3] Criar `vitest.config.ts` com ambiente `jsdom`, `@vitejs/plugin-react` e o atalho `@/` apontando para `src/`
- [X] T037 [P] [US3] Criar o teste de unidade de componente em `src/componentes/ui/Botao.test.tsx`, com Testing Library, cobrindo renderização, evento e variantes (FR-012, SC-005)
- [X] T038 [P] [US3] Criar o teste de unidade de regra pura em `src/features/exemplo/regras.test.ts`, incluindo casos de borda (FR-012, SC-005)
- [X] T039 [US3] Criar `playwright.config.ts` apontando para `tests/e2e/`, com `webServer` subindo a versão compilada e as sete larguras registradas como projetos ou parâmetros
- [X] T040 [US3] Criar `tests/e2e/pagina-inicial.spec.ts` verificando que a página carrega e que a logo e a frase "Portal em construção" aparecem (FR-013)
- [X] T041 [US3] Acrescentar em `tests/e2e/pagina-inicial.spec.ts` a verificação de acessibilidade com `@axe-core/playwright`, exigindo zero violação (FR-014, SC-006)
- [X] T042 [US3] Acrescentar em `tests/e2e/pagina-inicial.spec.ts` a verificação de ausência de rolagem horizontal comparando `scrollWidth` com `clientWidth` em 360, 390, 430, 480, 768, 1024 e 1280 px, nomeando a largura em cada falha (FR-015, SC-007)
- [X] T043 [US3] Acrescentar em `tests/e2e/pagina-inicial.spec.ts` a verificação de que o carregamento da página inicial não dispara **nenhuma requisição a domínio externo**, interceptando o tráfego de rede e falhando se qualquer host fora do próprio site for chamado (FR-027, SC-014)
- [X] T044 [US3] Fazer `npm run test:e2e` falhar com instrução de instalar o navegador quando ele não estiver baixado, em vez de erro cru (caso de borda da spec)

**Ponto de verificação**: `npm test` e `npm run test:e2e` passam, com zero violação de acessibilidade e sete larguras sem rolagem horizontal.

---

## Fase 6: História 4 — Publicação contínua com o ramo principal protegido (P2)

**Objetivo**: transformar as verificações em barreira real. Depende da Fase 4 estar pronta.

**Teste independente**: abrir uma proposta quebrada de propósito e confirmar que o merge fica bloqueado; abrir uma sadia e conferir o endereço de pré-visualização.

- [X] T045 [US4] Criar `.github/workflows/ci.yml` rodando em `ubuntu-latest` e disparando em toda alteração proposta e em push na `main`, com Node 22 e cache de `npm ci` (FR-016)
- [X] T046 [US4] Encadear em `.github/workflows/ci.yml` os passos na ordem do contrato — tipos, lint, formatação, tokens, testes de unidade, build —, cada um com nome próprio na interface e **nenhum** com `continue-on-error` (FR-016)
- [X] T047 [US4] Acrescentar em `.github/workflows/ci.yml` o passo `npx playwright install --with-deps chromium` **antes** do `test:e2e`, porque a máquina do CI vem sem navegador e essa é a causa mais comum de primeiro CI vermelho (R3, FR-016)
- [X] T048 [US4] Criar `lighthouserc.json` com os limiares `performance >= 0.90` e `accessibility >= 0.95` em modo que **falha** a verificação, apontando para a página inicial (FR-029)
- [X] T049 [US4] Configurar o passo de Lighthouse em `.github/workflows/ci.yml` para rodar contra a **versão compilada** (`npm run build` + `npm start`), nunca contra o servidor de desenvolvimento, cujo número não descreve o que o visitante recebe (R1b, FR-029)
- [X] T050 [US4] Documentar em `README.md` o passo a passo para o Gabriel conectar o repositório à Vercel, que entrega publicação automática da `main` e endereço de pré-visualização por alteração proposta (FR-018, FR-019)
- [X] T051 [US4] Documentar em `README.md` o passo a passo da proteção do ramo principal, **destacando que ela só pode ser configurada depois do primeiro CI ter rodado**, porque antes disso o GitHub não conhece as verificações e a proteção fica vazia (FR-017, FR-020)
- [X] T052 [US4] Documentar em `README.md` o comportamento esperado em **alteração vinda de fork** (segredos do repositório não ficam disponíveis, então a pré-visualização e alguns passos do CI se comportam de forma diferente) e em **duas propostas simultâneas** (cada uma tem endereço de pré-visualização próprio, sem uma sobrescrever a outra), registrando qualquer limitação encontrada (FR-019, casos de borda da spec)

**Ponto de verificação**: CI verde numa proposta sadia, com todos os passos nomeados e visíveis para seleção na proteção do ramo.

---

## Fase 7: História 5 — Quem vem depois consegue assumir (P3)

**Objetivo**: o Princípio I aplicado ao próprio repositório. Não é opcional: sem esta fase a feature não está pronta.

**Teste independente**: entregar o repositório a alguém que não participou e pedir que rode, teste e explique o projeto usando só o README.

- [X] T053 [US5] Escrever `README.md` em português explicando o que é o portal, como rodar, como testar e como publicar, para quem nunca viu o projeto (FR-021)
- [X] T054 [US5] Acrescentar em `README.md` a seção "quando uma verificação falha", com uma entrada por comando: o que ele checa, por que a regra existe e o que fazer para corrigir (FR-021)
- [X] T055 [US5] Acrescentar em `README.md` os pré-requisitos com versão mínima e o apontamento para `docs/` como lugar das decisões registradas (FR-021, FR-024, caso de borda da spec)
- [X] T056 [P] [US5] Criar `.env.example` listando todas as variáveis de ambiente conhecidas, cada uma com explicação em português e **sem nenhum valor real**, marcando as de F02 e F13 como ainda não usadas (FR-022)
- [X] T057 [US5] Varrer o repositório e o histórico do Git por segredos e registrar o resultado com zero ocorrência (FR-023, SC-011)
- [X] T058 [US5] Conferir a contagem de dependências **diretas** de `package.json` — `dependencies` + `devDependencies`, sem transitivas — contra a tabela do [plan.md](./plan.md), com o alvo de 3 de execução e 17 de desenvolvimento, total 20 (R2, FR-025, SC-012)
- [X] T059 [US5] Registrar em `README.md` que dependência nova precisa ser justificada na tabela do plano **antes** de entrar, não depois (R2, FR-025)

**Ponto de verificação**: alguém de fora roda, testa e explica o projeto usando só o README.

---

## Fase 8: Polimento e evidências finais

**Objetivo**: produzir as evidências que o Gabriel vai cobrar, com número e não com adjetivo.

- [X] T060 Executar o [quickstart.md](./quickstart.md) inteiro em clone limpo e registrar as 22 evidências, cronometrando o tempo do SC-001 a partir de um clone limpo, seguindo só o README (FR-001, SC-001; alvo: menos de 15 minutos)
- [X] T061 [P] Registrar a saída de `npm run test:desempenho` com as notas de desempenho e acessibilidade contra os limiares; se reprovar, abrir tarefa de correção — **o limiar não desce** (FR-029, R1)
- [X] T062 Preencher `docs/checklist-validacao.md` para a F00 com resultado real em cada item, reportando número e não adjetivo (Princípio VII)

---

## Fase 9: Bloqueadas em ação do Gabriel

**⚠️ A implementação para aqui.** Estas três tarefas dependem de ações que só o Gabriel pode
executar na interface do GitHub e da Vercel — conectar o repositório à hospedagem e configurar a
proteção do ramo principal, conforme `docs/F00-runbook-gabriel.md`, Parte G. O desenvolvedor
entrega tudo o que está versionado e o passo a passo; **nenhuma destas pode ser marcada como feita
por quem implementa**.

**Ordem obrigatória**: conectar a Vercel → deixar o primeiro CI rodar → só então configurar a
proteção do ramo. Antes disso o GitHub não conhece as verificações e a proteção fica vazia.

- [ ] T063 [GABRIEL] **Evidência do merge barrado**: abrir uma alteração proposta deliberadamente quebrada, tentar incorporá-la à `main` e capturar o bloqueio na interface do GitHub — se der para incorporar com o CI vermelho, a proteção não está valendo e todo o resto é decoração (SC-008, FR-017)
- [ ] T064 [GABRIEL] Registrar o endereço público com a página provisória no ar e o endereço de pré-visualização de uma alteração proposta (SC-009, SC-010, FR-018, FR-019)
- [ ] T065 [GABRIEL] Verificar na prática o comportamento em **alteração vinda de fork** e em **duas propostas simultâneas**, confirmando que cada uma tem endereço de pré-visualização próprio, e registrar o resultado no `README.md` junto do que a T052 documentou (FR-019, casos de borda da spec)

**Ponto de verificação**: os itens 9, 10 e 11 da Parte 3 de `docs/F00-fundacao.md` — o merge barrado, a publicação automática e a pré-visualização — comprovados com evidência da interface.

---

## Dependências entre fases

```text
Fase 1 (Preparação)
   ↓
Fase 2 (Fundação — bloqueante)
   ↓
   ├─→ Fase 3 (US1) ──┐
   └─→ Fase 4 (US2) ──┤
                      ↓
                 Fase 5 (US3)   depende de US1 (página) e US2 (lint limpo)
                      ↓
                 Fase 6 (US4)   depende de US2 e US3 (o CI roda o que elas criaram)
                      ↓
                 Fase 7 (US5)   documenta o que as anteriores construíram
                      ↓
                 Fase 8 (Evidências do que é nosso)
                      ↓
                 Fase 9 (Bloqueadas em ação do Gabriel — a implementação para aqui)
```

**Independência real**: US1 e US2 podem ser tocadas em paralelo depois da Fase 2 — uma mexe em componentes e página, a outra em configuração de lint e script de tokens. US3 em diante é sequencial, porque cada uma verifica o que a anterior produziu.

## Oportunidades de paralelismo

| Fase | Tarefas paralelas      | Por que dá                                                                                                                                  |
| ---- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | T003, T004, T005, T007 | Arquivos de configuração distintos, sem dependência entre si                                                                                |
| 2    | T012, T014, T016       | Estilos, READMEs de pasta e conferência de `docs/` não se tocam                                                                             |
| 3    | T017, T018, T019, T021 | Um arquivo de exemplo por camada, independentes. **T020 saiu da lista**: passou a reaproveitar o `EstadoVazio` da T019 e agora depende dela |
| 5    | T037, T038             | Teste de componente e teste de regra, arquivos diferentes                                                                                   |
| 8    | T060, T061             | Execução do quickstart e coleta do medidor de desempenho, independentes                                                                     |

## Estratégia de implementação

**MVP mínimo defensável**: Fases 1, 2 e 3 — o esqueleto roda e a página abre. Entrega valor sozinha porque prova o caminho do código até a tela.

**Mas o MVP não é a feature.** A F00 só cumpre seu propósito com a Fase 4, que é onde as regras viram barreira. Parar no MVP entrega um projeto bonito sem nenhuma garantia — exatamente o cenário que a Parte 5 de `docs/F00-fundacao.md` chama de "CI verde que não checa nada".

**Ordem recomendada**: Fase 1 → 2 → (3 e 4 em paralelo) → 5 → 6 → 7 → 8, com as evidências sendo coletadas ao longo do caminho e não empurradas para o fim.

**Onde a implementação para**: no fim da Fase 8. As três tarefas da Fase 9 estão marcadas com
`[GABRIEL]` porque dependem de ações na interface do GitHub e da Vercel que o desenvolvedor não
tem como executar. Marcá-las como feitas sem terem sido é o pior resultado possível (Princípio
VIII) — elas ficam abertas, e a entrega é o resto pronto mais as evidências do que é nosso.

## Fora de escopo, registrado

Supabase, banco e RLS (F02) · autenticação (F14) · envio de e-mail (F13) · qualquer página real do site (Fase 1 do plano de desenvolvimento) · domínio próprio · biblioteca de componentes de terceiros.

**CI em Windows**: deliberadamente fora. Os três mecanismos de paridade do research.md D6 travam a diferença na máquina de quem escreve, e uma matriz com Windows dobraria o consumo de minutos do plano gratuito para reconferir o que já está travado.
