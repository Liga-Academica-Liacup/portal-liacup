# Plano de implementação: Fundação técnica do Portal LIACUP (F00)

**Branch**: `main` (exceção de arranque — ver Assumptions da spec) | **Data**: 2026-08-20 | **Spec**: [spec.md](./spec.md)

**Input**: Especificação em `specs/001-fundacao-tecnica/spec.md`, emendada em 2026-08-20

## Sumário

Montar o esqueleto do Portal LIACUP com a árvore de pastas da seção 1 dos padrões de código, uma
página provisória que prova o caminho do código até o ar, e — o que de fato importa — o conjunto
de verificações automáticas que **barram** o que viola os padrões: tipos, análise estática,
formatação, regra de dependência entre camadas, uso de tokens, testes de unidade e de ponta a
ponta com acessibilidade e responsividade, e medidor de desempenho por página.

A abordagem técnica está fechada pelo ADR-0001 e detalhada em [research.md](./research.md). Os dois
pontos que exigiram pesquisa real foram as **versões** (o `typescript@latest` e o `eslint@latest`
de hoje quebrariam a instalação — ver D1 e D2) e **como fazer a regra de camadas não apodrecer**
quando features novas nascerem (D3).

## Contexto técnico

**Linguagem/Versão**: TypeScript **5.9.3** em modo estrito · Node **22 LTS** (`engines` + `.nvmrc`)

**Dependências principais**: Next.js **16.3.1** (App Router) · React **19.2.x** — 20 dependências
no total, cada uma justificada na tabela abaixo

**Armazenamento**: nenhum. Supabase e banco entram na F02

**Testes**: Vitest 4.x + jsdom + Testing Library (unidade) · Playwright 1.62.x + `@axe-core/playwright` (ponta a ponta)

**Plataforma alvo**: navegadores modernos, celular como caso principal · publicação na Vercel

**Tipo de projeto**: aplicação web (Next.js App Router, um único projeto)

**Metas de desempenho**: Lighthouse desempenho ≥ 90 e acessibilidade ≥ 95 na página inicial,
verificados no CI. Montar o mecanismo é o escopo; otimizar não é

**Restrições**: zero requisição a domínio externo no carregamento da página (SC-014) · zero
rolagem horizontal em 7 larguras · comportamento idêntico em Windows e Linux · custo recorrente
R$0 · nenhuma biblioteca de componentes de terceiros

**Escala/Escopo**: uma página provisória, ~10 arquivos de exemplo (um por camada), 8 comandos de
verificação, 1 fluxo de CI

## Checagem contra a constituição

_PORTÃO: precisa passar antes da Fase 0. Reavaliado após a Fase 1._

| Princípio                            | Como este plano cumpre                                                                                                                                                                        | Situação                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **I — Quem mantém vem antes**        | Código, comandos e README em português; nomes consagrados mantidos onde o ecossistema espera (D11); toda dependência justificada na tabela abaixo; nenhum passo manual fora do README         | ✅                                 |
| **II — Acessibilidade**              | `jsx-a11y` na análise estática; axe-core dentro do teste de ponta a ponta com zero violações; Lighthouse acessibilidade ≥ 95; HTML semântico na página provisória; logo com texto alternativo | ✅                                 |
| **III — Mobile é o caso principal**  | Verificação de rolagem horizontal em 360, 390, 430, 480, 768, 1024 e 1280 px; pontos de corte restritos a 480/768/1024 pela verificação de tokens                                             | ✅                                 |
| **IV — Segurança e dados**           | Nenhum dado pessoal nesta feature; `.env.example` sem valor real; `.gitignore` cobrindo `.env*`; varredura do histórico como evidência                                                        | ✅ (RLS e validação entram na F02) |
| **V — A spec manda**                 | Plano descreve tecnologia, spec descreve comportamento; divergências das larguras e do ADR-0003 reportadas, não corrigidas em silêncio                                                        | ✅                                 |
| **VI — Fidelidade ao aprovado**      | Tokens transcritos do `liacup.css` sem alteração de valor; só mudam papéis (ADR-0003); página provisória usa a logo entregue; nenhum texto institucional inventado                            | ✅                                 |
| **VII — Nada entra sem verificação** | É o objeto da feature. Verificações demonstradas **falhando** (FR-011), não só configuradas                                                                                                   | ✅                                 |
| **VIII — Honestidade**               | Pendência do ADR-0003 registrada; adição de `tests/` à árvore declarada; as 4 dependências de teste de componente sinalizadas para decisão                                                    | ✅                                 |
| **IX — Componentização**             | Árvore da seção 1 criada inteira; regra de camadas verificada com zonas geradas automaticamente (D3); zero valor de estilo à mão; exemplos por camada servem de modelo                        | ✅                                 |

**Portão: PASSA.** Nenhuma violação a justificar — a seção "Rastreamento de complexidade" fica
vazia de propósito.

**Reavaliação após a Fase 1**: os artefatos de projeto ([data-model.md](./data-model.md),
[contracts/](./contracts/), [quickstart.md](./quickstart.md)) não introduziram nenhuma violação
nova. Dois pontos ficaram mais firmes do que estavam antes do projeto: o Princípio IX ganhou a
geração automática de zonas (D3), que tira a regra de camadas das mãos da disciplina humana; e o
Princípio VIII ganhou três registros explícitos — a ausência do ADR-0003, a adição de `tests/` à
árvore, e as quatro dependências de teste de componente sinalizadas para decisão. **Portão continua
passando.**

## Estrutura do projeto

### Documentação (esta feature)

```text
specs/001-fundacao-tecnica/
├── spec.md              # Especificação, emendada
├── plan.md              # Este arquivo
├── research.md          # Fase 0 — 11 decisões técnicas
├── data-model.md        # Fase 1 — sem modelo de dados nesta feature
├── quickstart.md        # Fase 1 — guia de validação com as 14 evidências
├── contracts/
│   ├── comandos.md      # Contrato dos comandos de verificação
│   └── regras-de-camada.md  # Contrato da regra de dependência entre camadas
└── checklists/
    └── requirements.md  # Checklist de qualidade da spec
```

### Código-fonte (raiz do repositório)

```text
src/
├── app/
│   ├── (site)/
│   │   └── page.tsx                    # Página provisória (FR-004)
│   ├── (painel)/                       # Vazio nesta feature, com README explicando
│   ├── api/                            # Vazio nesta feature, com README explicando
│   └── layout.tsx                      # Fontes próprias (FR-027) e idioma pt-BR
├── componentes/
│   ├── ui/
│   │   ├── Botao.tsx                   # Exemplo da camada base
│   │   └── Botao.test.tsx              # Exemplo de teste de unidade (FR-012)
│   ├── layout/
│   │   └── Rodape.tsx                  # Exemplo da camada de layout
│   └── padroes/
│       └── EstadoVazio.tsx             # Exemplo de composição reutilizável
├── features/
│   └── exemplo/                        # Feature de exemplo — modelo das futuras
│       ├── componentes/ListaDeExemplos.tsx
│       ├── dados.ts                    # Único lugar que falaria com o banco
│       ├── regras.ts                   # Regra pura, testável sem banco
│       ├── regras.test.ts              # Exemplo de teste de regra
│       └── tipos.ts
├── lib/
│   ├── supabase/                       # Vazio nesta feature (F02), com README
│   ├── validacao/                      # Exemplo de esquema compartilhado
│   ├── email/                          # Vazio nesta feature (F13), com README
│   └── utils/
│       └── formatar-data.ts            # Exemplo de função pura genérica
└── estilos/
    ├── tokens.css                      # SÓ o bloco :root — origem única de cor/espaço/raio/sombra/tipografia
    └── global.css                      # Reset + regras de elemento. Único ponto de entrada de estilo

tests/
└── e2e/
    └── pagina-inicial.spec.ts          # Carregamento + axe + 7 larguras

scripts/
└── verificar-tokens.mjs                # Verificação de tokens, sem dependência

docs/                                   # ADRs, padrões, constituição, conteúdo (FR-024)
.github/workflows/ci.yml                # Todas as verificações (FR-016)
eslint.config.mjs · tsconfig.json · .prettierrc · .gitattributes · .nvmrc
lighthouserc.json · playwright.config.ts · vitest.config.ts
.env.example · README.md
```

**Decisão de estrutura**: projeto único Next.js, com a árvore de `src/` **idêntica à seção 1 de
`docs/PADROES-DE-CODIGO.md`**. Pastas que só ganham conteúdo em features futuras
(`(painel)`, `api`, `lib/supabase`, `lib/email`) são criadas com um `README.md` curto dizendo o que
vai ali e em qual feature — pasta vazia não sobrevive ao Git e comentário solto não explica nada.
`tests/`, `scripts/` e `public/` na raiz são adições deliberadas, registradas em
[research.md](./research.md) D9.

### O que do `liacup.css` **não** entra na F00

O `liacup.css` tem 259 linhas e **não é um arquivo de tokens**: o bloco `:root` ocupa as linhas 6 a
65, e as ~194 restantes são o reset, regras de elemento e **cerca de 35 classes de componente**
(`.btn` e variantes, `.card`, `.input`, `.field`, `.radio`, `.seg`, `.tag`, `.nav`, `.table`,
`.dialog`, `.hr`, `.elev-*`, `.washed`).

A migração é dividida em três destinos:

| Parte do `liacup.css`       | Destino                            | Quando                  |
| --------------------------- | ---------------------------------- | ----------------------- |
| Bloco `:root` (linhas 6–65) | `src/estilos/tokens.css`           | **F00** (T009)          |
| Reset e regras de elemento  | `src/estilos/global.css`           | **F00** (T010)          |
| ~35 classes de componente   | Viram componentes React, uma a uma | **F01** (T011 registra) |

**Por que as classes de componente não vêm agora**: trazê-las faria a F00 terminar com duas
implementações de botão convivendo — `.btn-primary` em CSS e `Botao.tsx` em React (T017) —, e na
F01 ninguém saberia qual manda. Além disso, `tokens.css` deixaria de ser o que a seção 1 dos
padrões define: única fonte de cor, espaçamento, raio, sombra e tipografia. As classes seguem
existindo no `liacup.css` original como insumo da F01.

## Dependências e justificativa (FR-025)

**Total: 20** — 3 de execução, 17 de desenvolvimento. Este é o número a comparar com o
`package.json` na validação (SC-012).

### De execução (3)

| #   | Dependência        | Por que é necessária                                                             |
| --- | ------------------ | -------------------------------------------------------------------------------- |
| 1   | `next` 16.3.1      | O framework do ADR-0001. Traz roteamento, renderização no servidor e `next/font` |
| 2   | `react` 19.2.x     | Par obrigatório do Next                                                          |
| 3   | `react-dom` 19.2.x | Par obrigatório do Next                                                          |

### De desenvolvimento (17)

| #   | Dependência                 | Por que é necessária                                                                                                  | Requisito            |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 4   | `typescript` 5.9.3          | Verificação de tipos em modo estrito. Versão travada por D1                                                           | FR-007, FR-028       |
| 5   | `@types/node`               | Tipos do Node para os scripts e a configuração                                                                        | FR-007               |
| 6   | `@types/react`              | Tipos do React                                                                                                        | FR-007               |
| 7   | `@types/react-dom`          | Tipos do React DOM                                                                                                    | FR-007               |
| 8   | `eslint` ^9                 | Análise estática. Versão travada por D2                                                                               | FR-007               |
| 9   | `eslint-config-next` 16.3.1 | Regras do Next já ajustadas; evita configurar à mão o que o framework espera                                          | FR-007               |
| 10  | `eslint-plugin-import`      | Fornece `import/no-restricted-paths`, nomeada na seção 9 dos padrões. Declarada explicitamente porque a regra é nossa | **FR-008, FR-009**   |
| 11  | `eslint-plugin-jsx-a11y`    | Erros básicos de semântica e rótulo, nomeada na seção 9 dos padrões                                                   | FR-007, Princípio II |
| 12  | `prettier`                  | Formatação sem discussão, nomeada na seção 9                                                                          | FR-007, FR-028       |
| 13  | `vitest` 4.x                | Testes de unidade, nomeada no ADR-0001                                                                                | FR-012               |
| 14  | `@vitejs/plugin-react`      | Sem ele o Vitest não entende JSX — necessária para testar componentes                                                 | FR-012               |
| 15  | `jsdom`                     | Ambiente de DOM para o teste de componente                                                                            | FR-012               |
| 16  | `@testing-library/react`    | Renderiza componente no teste do jeito que o usuário vê, não pelo detalhe interno                                     | FR-012               |
| 17  | `@testing-library/jest-dom` | Asserções legíveis de DOM. Sem ela o teste vira comparação de string                                                  | FR-012               |
| 18  | `@playwright/test` 1.62.x   | Teste de ponta a ponta, nomeada no ADR-0001                                                                           | FR-013, FR-015       |
| 19  | `@axe-core/playwright`      | Acessibilidade dentro do teste de ponta a ponta, nomeada na seção 9                                                   | FR-014               |
| 20  | `@lhci/cli`                 | Lighthouse CI por página, nomeada na seção 9                                                                          | FR-029               |

**Sinalizado para decisão do Gabriel**: as de número **14 a 17** existem só para permitir testar
_componentes_. Se a F00 testasse apenas uma função pura, seriam 16 dependências em vez de 20. Ficam
porque a seção 7 dos padrões exige teste de unidade para todo componente de `ui/` em **toda**
feature futura, e o papel da F00 é deixar esse caminho pronto. Cortar as quatro é uma escolha
legítima — só transfere o trabalho para a F01. Ver [research.md](./research.md) D8.

**Não entram**: `eslint-config-prettier` (o ESLint 9 não liga regras de formatação, e a
configuração do Next não traz regras estilísticas — seria dependência para resolver um conflito que
não existe) · qualquer biblioteca de componentes · qualquer coisa de Supabase, banco ou e-mail.

## Riscos deste plano

| Risco                                                                            | Como o plano reage                                                                                                                       |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Lighthouse ≥ 90 falhar já na página provisória                                   | O limiar **não** é baixado. Resultado vermelho aqui é informação sobre a configuração base, e vira tarefa de correção                    |
| Zonas geradas do `import/no-restricted-paths` não pegarem o caso feature↔feature | O FR-011 obriga demonstrar a falha. Se não falhar na demonstração, a regra não está pronta — e isso aparece antes da entrega, não depois |
| Falso positivo na verificação de tokens                                          | Regras exatas escritas em D4, incluindo o que **não** pode acusar. A validação testa os dois lados                                       |
| Instalação quebrar por par incompatível                                          | Já é a razão de D1 e D2. As versões estão travadas com motivo escrito                                                                    |
| Proteção do ramo configurada cedo demais e ficar vazia                           | Ordem documentada no README (FR-020) e verificada com uma proposta quebrada de propósito (SC-008)                                        |

## Rastreamento de complexidade

Sem violações da constituição a justificar. Seção mantida vazia de propósito.
