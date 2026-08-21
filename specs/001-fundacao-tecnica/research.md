# Pesquisa — Fase 0 · F00 Fundação técnica

**Data**: 2026-08-20 · **Spec**: [spec.md](./spec.md)

O ADR-0001 já fixou a stack (Next.js + TypeScript + Supabase + Vercel) e o ADR-0002 o envio de
e-mail. Esta pesquisa **não reabre essas decisões**. Ela resolve o que ficou aberto abaixo delas:
quais versões, quais ferramentas de verificação, e como cada regra dos padrões de código vira
verificação automática que realmente falha.

Ambiente verificado nesta máquina: **Node v22.22.2**, **npm 10.9.7**, **git 2.45.1.windows**.

---

## D1 — Versão do TypeScript: 5.9.x, e não a mais recente

**Decisão**: TypeScript **5.9.3**.

**Razão**: `typescript@latest` hoje é **7.0.2**, mas o `typescript-eslint@8.67.0` declara como par
compatível `typescript >=4.8.4 <6.1.0`. Instalar o TypeScript 7 quebraria a análise estática na
instalação — exatamente o FR-007, que exige zero problemas no estado inicial. O TypeScript 6 está
só em `beta`. A faixa 5.9.x é a última estável dentro da janela suportada por todo o ecossistema
de lint.

**Alternativas consideradas**: TypeScript 7 com a análise estática desligada para arquivos `.ts`
— rejeitada, esvazia o FR-008 e o FR-028. TypeScript 6 beta — rejeitada, versão não estável em
fundação de projeto que outra pessoa vai manter.

**Quando revisitar**: quando o `typescript-eslint` publicar major com suporte a TS 7.

---

## D2 — Versão do ESLint: 9, e não a 10

**Decisão**: ESLint **9.x** (linha `maintenance`, hoje 9.39.5).

**Razão**: o `eslint@latest` é 10.8.1, mas os dois plugins que os padrões de código nomeiam
declaram par compatível só até a 9:

| Plugin                          | Par declarado                 |
| ------------------------------- | ----------------------------- |
| `eslint-plugin-import@2.32.0`   | `eslint: ^2 \|\| ... \|\| ^9` |
| `eslint-plugin-jsx-a11y@6.10.2` | `eslint: ^3 \|\| ... \|\| ^9` |

Com npm 10, conflito de par derruba a instalação. Um projeto que não instala do zero viola o
FR-001 antes de qualquer outra coisa. O `eslint-config-next@16.3.1` pede `eslint >=9.0.0`, então a
9 satisfaz todo mundo.

**Alternativas consideradas**: ESLint 10 + `eslint-plugin-import-x` (fork mantido, aceita
`^10`) — rejeitada por dois motivos: os padrões de código nomeiam `import/no-restricted-paths` do
`eslint-plugin-import`, e trocar por um fork é uma decisão de arquitetura que merece ADR próprio,
não uma escolha silenciosa de plano. ESLint 10 com `--force` na instalação — rejeitada, é
dívida disfarçada de conveniência.

**Quando revisitar**: quando `eslint-plugin-import` publicar suporte a ESLint 10. Registrar como
tarefa de manutenção, não como urgência.

---

## D3 — Como a regra de camadas vira verificação que não apodrece

**Decisão**: `import/no-restricted-paths` no `eslint.config.mjs`, com as zonas de features
**geradas em tempo de carga** lendo o conteúdo de `src/features/`.

**Razão**: a regra "uma feature nunca importa de outra" precisa de uma zona por feature. Escrever
essas zonas à mão significa que criar a feature nova e esquecer de registrar a zona deixa o
buraco aberto — e ninguém descobre, porque a verificação continua verde. Como o arquivo de
configuração é JavaScript, ele lê os diretórios de `src/features/` e emite uma zona por feature
automaticamente. Feature nova nasce protegida, sem ninguém lembrar de nada. É o Princípio IX
aplicado à própria ferramenta: regra que depende de disciplina humana degrada.

As zonas fixas (as quatro linhas da tabela da seção 1 dos padrões) ficam escritas literalmente,
porque são estáveis.

**Alternativas consideradas**: `eslint-plugin-boundaries` — mais expressivo, mas é dependência a
mais e os padrões de código nomeiam outra ferramenta. Zonas escritas à mão — rejeitada pelo motivo
acima.

---

## D4 — Verificação de tokens: script próprio, zero dependência

**Decisão**: script Node em `scripts/verificar-tokens.mjs`, sem nenhuma biblioteca.

**Razão**: o que precisa ser detectado é estreito e específico do projeto — cor em hexadecimal,
`rgb()`/`hsl()` literais e medidas em `px` fora dos arquivos de token. Uma dependência de lint de
CSS traria centenas de regras que ninguém pediu, e cada uma delas é uma decisão futura para quem
herdar. Um script de ~60 linhas que qualquer pessoa lê inteiro é mais manutenível do que uma
configuração que ninguém entende.

**Regras exatas do script** — escritas aqui porque falso positivo destrói a confiança na
verificação (caso de borda da spec):

| Situação                                                             | Veredito                                    |
| -------------------------------------------------------------------- | ------------------------------------------- |
| Hexadecimal, `rgb()`, `hsl()`, `oklch()` em `src/estilos/tokens.css` | **Permitido** — é o lugar certo             |
| Hexadecimal em qualquer outro arquivo de `src/`                      | **Falha**                                   |
| `px` em condição de media query com valor 480, 768 ou 1024           | **Permitido** — pontos de corte dos padrões |
| `px` em media query com qualquer outro valor                         | **Falha** — valor solto é dívida            |
| `px` em declaração de propriedade fora de `tokens.css`               | **Falha**                                   |
| `0`, `0px`, `1px` de borda, `50%`, `100%`, unidades relativas        | **Permitido**                               |
| `!important` sem comentário na mesma linha ou na anterior            | **Falha**                                   |

**Alternativas consideradas**: Stylelint com regras customizadas — rejeitada por peso e por
superfície de configuração. `grep` no CI — rejeitada, não roda igual em Windows e Linux.

---

## D5 — Fontes servidas pelo próprio domínio (FR-027)

**Decisão**: `next/font/google` para Caprasimo e Figtree, com o `@import` do Google removido do
arquivo de tokens.

**Razão**: apesar do nome, `next/font/google` **não** faz requisição do navegador para o Google.
Ele baixa os arquivos no momento do build e os serve pelo próprio domínio, com o CSS embutido.
É exatamente o que o ADR-0003 pede, sem baixar binário à mão, sem versionar fonte no repositório e
sem passo manual para quem vier depois. O SC-014 (zero requisições externas) fica satisfeito por
construção, e o teste de ponta a ponta comprova.

**Alternativa considerada**: `next/font/local` com os `.woff2` commitados. Vantagem real — build
funciona sem rede e não depende do Google continuar publicando. Rejeitada para esta feature por
custar um passo de download manual de arquivo de terceiro e binários no repositório, sem ganho
visível agora. **Fica registrada como plano B nomeado**: se o build sem rede virar requisito, a
troca é local, dentro de um arquivo.

---

## D6 — Paridade Windows/Linux (FR-028)

**Decisão**: três mecanismos, todos declarados no repositório.

1. **Caixa em caminho de import** — `forceConsistentCasingInFileNames: true` no `tsconfig.json`.
   Escrito explicitamente mesmo sendo padrão no TypeScript 5, porque o FR-028 exige que esteja
   declarado, não presumido. O desenvolvimento acontece em Windows (sistema de arquivos que ignora
   caixa) e a verificação roda em Linux (que não ignora): sem isso, `componentes/Ui/Botao` funciona
   na máquina de quem escreveu e quebra no CI.
2. **Fim de linha** — `.gitattributes` com `* text=auto eol=lf` e `endOfLine: "lf"` no Prettier.
   Sem isso, a verificação de formatação acusa o arquivo inteiro como alterado só por causa do
   sistema operacional.
3. **Node fixado** — campo `engines` no `package.json` e arquivo `.nvmrc`, com a mesma versão
   maior usada no CI. O Next 16 exige `node >=20.9.0`; adotamos Node 22 LTS, que é o desta máquina.

---

## D7 — Medidor de desempenho e acessibilidade por página (FR-029)

**Decisão**: `@lhci/cli` (Lighthouse CI) no fluxo do CI, com limiares `performance >= 0.90` e
`accessibility >= 0.95` em modo que **falha** a verificação, aplicado à página inicial.

**Razão**: é a ferramenta nomeada na seção 9 dos padrões de código. Os limiares ficam registrados
em arquivo versionado, então mudá-los é uma alteração visível e revisável, não um ajuste de
bastidor. O escopo aqui é montar o mecanismo e registrar os limiares — **não** otimizar
desempenho, conforme o próprio FR-029.

**Risco assumido e registrado**: uma página provisória com uma logo e uma frase deve passar folgado
nos dois limiares. Se não passar, o resultado é informação valiosa sobre a configuração base, não
motivo para baixar o limiar. Baixar limiar para o build ficar verde é o oposto do que esta feature
existe para impedir.

---

## D8 — Testes: Vitest para unidade, Playwright para ponta a ponta

**Decisão**: Vitest **4.x** com `jsdom` e Testing Library; Playwright **1.62.x** com
`@axe-core/playwright`.

**Razão**: são as ferramentas nomeadas no ADR-0001 e na seção 9 dos padrões. O
`@axe-core/playwright` é o caminho consagrado para o item "axe-core rodando dentro do teste de
ponta a ponta". O Next 16 declara `@playwright/test ^1.51.1` como par opcional, então a 1.62 está
dentro da faixa.

**Ponto de atenção honesto**: `jsdom`, `@vitejs/plugin-react`, `@testing-library/react` e
`@testing-library/jest-dom` são **quatro dependências** que existem só para permitir testar
componentes. Se a F00 testasse apenas uma função pura, as quatro sairiam. Elas ficam porque a
seção 7 dos padrões exige teste de unidade para todo componente de `ui/` em toda feature futura, e
o papel da F00 é deixar esse caminho pronto — senão a F01 inventa o dela. **Está sinalizado para o
Gabriel decidir**: cortar as quatro deixa a F00 mais magra e transfere o trabalho para a F01.

---

## D9 — Onde ficam os testes

**Decisão**: teste de unidade **ao lado do arquivo testado** (`Botao.test.tsx` junto de
`Botao.tsx`); teste de ponta a ponta em `tests/e2e/`, na raiz.

**Razão**: a seção 1 dos padrões descreve a árvore de `src/` e não menciona testes. Colocar o
teste de unidade ao lado mantém a promessa de que dá para mexer em um pedaço sem procurar em outro
lugar. O teste de ponta a ponta não pertence a nenhuma camada de `src/` — ele exercita o site
inteiro pelo navegador —, então fica fora, em `tests/e2e/`.

**Registrado como adição deliberada à árvore**: `tests/` na raiz não está na seção 1 dos padrões.
Não é pasta "extra não prevista" no sentido do SC-013 — é onde o Playwright vive —, mas é uma
diferença em relação ao documento e por isso está escrita aqui em vez de aparecer sem aviso.

O mesmo vale para outras duas pastas de raiz, pelo mesmo motivo e com a mesma honestidade:

| Pasta        | Por que existe                                                                          | Por que não está nos padrões                                                                                          |
| ------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `tests/e2e/` | Onde o Playwright vive                                                                  | Não pertence a nenhuma camada de `src/`                                                                               |
| `scripts/`   | Onde mora `verificar-tokens.mjs`                                                        | Ferramenta do projeto, não código do produto                                                                          |
| `public/`    | Onde o Next serve arquivo estático — é de lá que a logo da página provisória sai (T022) | Convenção obrigatória do framework: arquivo servido estaticamente **precisa** estar em `public/`, não é escolha nossa |

Nenhuma das três é pasta extra no sentido do SC-013. Estão aqui para que a conferência da árvore
encontre a explicação em vez de encontrar uma surpresa.

---

## D10 — Publicação, proteção de ramo e pré-visualização

**Decisão**: GitHub Actions roda todas as verificações; a Vercel, conectada ao repositório, cuida
de publicar a `main` e de gerar a pré-visualização por alteração proposta.

**Razão**: a integração da Vercel com o Git já entrega o FR-018 e o FR-019 sem nenhum código —
publicação automática do ramo principal e um endereço de pré-visualização por proposta. Escrever
isso à mão em Actions seria trabalho para reproduzir pior o que já existe pronto.

**Divisão do trabalho, que é a parte importante** (conforme `docs/F00-runbook-gabriel.md`):

| Parte                                 | Quem entrega              | Como fica versionado       |
| ------------------------------------- | ------------------------- | -------------------------- |
| Fluxo de CI com todas as verificações | Desenvolvedor             | `.github/workflows/ci.yml` |
| Conectar o repositório à Vercel       | **Gabriel**, na interface | passo a passo no README    |
| Proteção do ramo principal            | **Gabriel**, na interface | passo a passo no README    |

**Ordem que precisa estar documentada (FR-020)**: a proteção do ramo só pode ser configurada
**depois** do primeiro CI ter rodado, porque antes disso o GitHub não sabe quais verificações
existem e a proteção fica vazia — parece configurada e não barra nada. É o último passo, não o
primeiro.

---

## D11 — Nomes dos comandos

**Decisão**: comandos em português onde são nossos, mantendo os nomes consagrados do ecossistema
onde a ferramenta espera (`dev`, `build`, `start`, `lint`, `test`).

| Comando                    | O que faz                                                         |
| -------------------------- | ----------------------------------------------------------------- |
| `npm run dev`              | Sobe o projeto localmente — é o "único comando" do FR-001         |
| `npm run verificar`        | Roda tipos + análise estática + formatação + tokens, em sequência |
| `npm run verificar:tipos`  | Só a verificação de tipos                                         |
| `npm run lint`             | Só a análise estática                                             |
| `npm run formatar:check`   | Só a verificação de formatação                                    |
| `npm run verificar:tokens` | Só a verificação de tokens                                        |
| `npm test`                 | Testes de unidade                                                 |
| `npm run test:e2e`         | Testes de ponta a ponta                                           |

**Razão**: o Princípio I pede português, e a seção 6 dos padrões abre exceção para termos técnicos
consagrados. `npm run dev` e `npm test` são convenção do ecossistema que toda documentação externa
usa; renomeá-los faria quem vem depois procurar o que não existe. O que é nosso — `verificar`,
`formatar`, `verificar:tokens` — fica em português.

---

## Nenhum ponto em aberto

Todos os itens marcados como `NEEDS CLARIFICATION` no contexto técnico foram resolvidos acima.

**Pendência encerrada**: o ADR-0003 está em `docs/ADR-0003-tokens-e-acessibilidade.md`. Ele
confirma D5 (fontes hospedadas junto com o site, `@import` removido) e fixa as quatro trocas de
token com contraste medido. Os tokens citados existem no `liacup.css` — conferido: `accent-600`,
`accent-700`, `neutral-700`, `accent-2-700`, e o `@import` do Google na linha 4.
