# Plano de implementação: Camada de dados (F02)

**Branch**: `feat/F02-camada-de-dados` | **Data**: 2026-08-21 | **Spec**: [spec.md](./spec.md)

**Input**: Especificação em `specs/003-camada-de-dados/spec.md`, com as cinco clarificações de 21/08

## Sumário

Cria as **12 coleções** onde o conteúdo do portal vai morar, as políticas que dizem quem lê e quem
escreve cada uma, o caminho tipado até elas e dados de exemplo com o texto real já aprovado pela
liga. Nenhuma tela.

Três coisas neste plano recebem tratamento explícito porque separam "está escrito" de "está
garantido": **como o teste prova que a política bloqueia** ([research.md](./research.md) D1), **como
a chave de serviço é impedida de chegar ao navegador por verificação automática** (D2), e **o que
acontece quando o Supabase pausa por inatividade** (D3).

## Contexto técnico

**Linguagem/Versão**: TypeScript 5.9.3 estrito · Next.js 16.3.1 · Node 22

**Dependências principais**: `@supabase/supabase-js` 2.112.x · `supabase` (linha de comando)
2.115.x — **duas novas**, de 20 para **22**, justificadas em D6

**Armazenamento**: PostgreSQL no Supabase, com controle de acesso por linha em **todas** as tabelas

**Testes**: Vitest para regras puras e para as políticas, contra um **projeto Supabase de teste**
separado do de produção (D7)

**Plataforma alvo**: leitura pública estática com revalidação; escrita autenticada no servidor

**Metas de desempenho**: as herdadas — Lighthouse desempenho ≥ 90 e acessibilidade ≥ 95

**Restrições**: zero tabelas sem política · zero escritas anônimas bem-sucedidas · zero ocorrências
da chave de serviço no pacote compilado · zero IPs em claro · zero registros removidos ao serem
apagados · custo recorrente R$0

**Escala/Escopo**: 12 coleções de conteúdo + 1 de controle de origem · ~40 políticas · dados de
exemplo em todas · nenhuma tela

## Checagem contra a constituição

*PORTÃO: precisa passar antes da Fase 0. Reavaliado após a Fase 1.*

| Princípio | Como este plano cumpre | Situação |
|---|---|---|
| **I — Quem mantém vem antes** | Esquema em arquivos versionados, nunca no painel (D4); tipos gerados, nunca à mão (D5); **duas** dependências justificadas uma a uma, e uma terceira nomeada como prevista para a F14 e não instalada aqui; comportamento da pausa escrito no README | ✅ |
| **II — Acessibilidade** | Não se aplica: nenhuma tela. As telas que consomem estes dados são da Fase 1 | ✅ |
| **III — Mobile é o caso principal** | Leitura estática com revalidação, que é o que mantém o site rápido em celular com internet ruim | ✅ |
| **IV — Segurança e dados** | **É o coração da feature.** RLS em toda tabela, com teste de bloqueio por linha de política (D1); chave de serviço barrada por quatro camadas, três automáticas (D2); validação no servidor; retenção de 24 meses no esquema; log sem dado pessoal | ✅ |
| **V — A spec manda** | O plano descreve tecnologia; a spec descreve comportamento. A contradição entre ADR-0001 e ADR-0002 foi reportada e corrigida por adendo, não contornada | ✅ |
| **VI — Fidelidade ao aprovado** | Dados de exemplo usam o texto real de `conteudo-institucional.md`; onde não há texto aprovado, espaço reservado **visivelmente marcado** | ✅ |
| **VII — Nada entra sem verificação** | Cada política com teste dos dois lados; demonstração obrigatória de bloqueio, no padrão V1–V5 da F00 | ✅ |
| **VIII — Honestidade** | O adiamento da purga automática está registrado como adiamento, citando o ADR-0001 R6; o comportamento da pausa é descrito inclusive no que continua quebrado | ✅ |
| **IX — Componentização** | Acesso a dados só em `features/<dominio>/dados.ts`; regra pura em `regras.ts`; nenhum componente fala com o banco — zona Z1, já verificada pelo lint | ✅ |

**Portão: PASSA.**

**Reavaliação após a Fase 1**: os artefatos de projeto não introduziram violação nova. O Princípio IV
ficou mais firme com a barreira 3 do D2 — a verificação do **artefato compilado**, e não só do
código, que é a única capaz de pegar vazamento por caminho indireto. **Portão continua passando.**

## Estrutura do projeto

### Documentação (esta feature)

```text
specs/003-camada-de-dados/
├── spec.md · plan.md · research.md · data-model.md · quickstart.md
├── contracts/
│   ├── politicas-de-acesso.md   # A matriz de quem pode o quê, e o teste de cada célula
│   └── camada-de-dados.md       # O contrato de leitura e escrita que a Fase 1 vai consumir
└── checklists/requirements.md
```

### Código-fonte

```text
supabase/
├── migrations/            # Esquema, políticas e purga — numerados e versionados (D4)
└── seed.sql               # Dados de exemplo com o texto real aprovado

src/
├── lib/supabase/
│   ├── navegador.ts       # Cliente público. Só a chave pública
│   ├── servidor.ts        # Cliente de servidor. ÚNICO arquivo que pode ler a chave de serviço
│   └── tipos.ts           # GERADO a partir do esquema. Não editar à mão (D5)
├── features/<dominio>/
│   ├── dados.ts           # Único lugar que fala com o banco
│   ├── regras.ts          # Regra pura, testável sem banco
│   └── tipos.ts
└── lib/utils/resumo-de-origem.ts   # Resumo irreversível do IP, sem dependência (D8)

scripts/
├── verificar-chave-de-servico.mjs  # Barreira 3: varre o pacote compilado (D2)
└── purgar-dado-pessoal.mjs         # Procedimento de purga, executável e testado

tests/politicas/           # Um arquivo por coleção: permite E recusa
docs/                      # ADR-0002 com o adendo do E3, README com a pausa e a purga
```

**Decisão de estrutura**: `supabase/` e `tests/politicas/` na raiz são adições deliberadas à seção 1
dos padrões, pelo mesmo caminho que `tests/`, `scripts/` e `public/` percorreram — registradas em
[research.md](./research.md) e levadas à seção 1 do documento de origem.

## Os três pontos exigidos na validação

### 1. Como o teste prova que a política **bloqueia**

Detalhado em [research.md](./research.md) D1 e em
[contracts/politicas-de-acesso.md](./contracts/politicas-de-acesso.md).

Em resumo: **dois testes por linha de política** — um que prova a permissão, outro que prova a
recusa —, com clientes diferentes. O cliente de serviço só aparece na preparação e na limpeza,
**nunca no que está sendo verificado**: se ele preparar e verificar, ignora as políticas nos dois
lados e o teste não testa nada.

A linha que quase sempre falta está na matriz: **ler uma mensagem pelo identificador conhecido**.
Uma política que esconde a lista mas deixa buscar por identificador não protege nada, porque
identificador vaza.

**Demonstração obrigatória**: desligar a política de uma coleção, ver o teste falhar, religar e ver
voltar ao verde — o padrão V1–V5 da F00.

### 2. Como a chave de serviço é impedida de chegar ao navegador

Detalhado em D2. **Quatro barreiras, três automáticas:**

1. **Nome sem o prefixo público** — o framework só expõe o que começa com `NEXT_PUBLIC_`;
2. **Zona de lint** — só `src/lib/supabase/servidor.ts` pode ler a variável de serviço; qualquer
   outro arquivo quebra o CI apontando arquivo e linha;
3. **Verificação do pacote compilado** — script varre a saída do build atrás do valor e do nome da
   chave;
4. Arquivo de exemplo separando segredo de público.

**A barreira 3 é a que fecha a porta**, e é a que quase todo projeto não tem: as duas primeiras
verificam o **código**, ela verifica o **artefato**. Um valor chega ao navegador sem nenhum arquivo
de cliente mencionar a variável — basta um componente de servidor passá-lo como prop.

**Demonstração obrigatória, com duas barreiras vistas bloqueando**: pôr a chave num componente de
cliente e ver a barreira 2 quebrar; contornar a barreira 2 passando o valor por prop e ver a
**barreira 3** pegar no pacote compilado; desfazer e ver o verde voltar.

### 3. O que acontece quando o Supabase pausa por inatividade

Detalhado em D3. **Não é resolvido aqui** — a rotina anti-pausa é da F25, como o ADR-0001 R1 já
registra. O que este plano faz é **dizer qual é o comportamento**, porque hoje ninguém sabe:

| Tipo de página | Com o banco pausado |
|---|---|
| Estática, gerada no build | **Continua no ar.** Ninguém percebe |
| Estática com revalidação | Serve a última versão boa; a atualização falha em silêncio |
| Dinâmica, lê a cada acesso | **Erro na tela** |
| Formulário de contato | A mensagem **não é gravada** |

**Decisão desta feature**: o conteúdo público é lido de forma **estática com revalidação**, nunca
dinâmica a cada acesso. Isso não resolve a pausa — resolve que **a pausa não derruba o site
público**.

**O que continua quebrado e está escrito assim**: o formulário perde a mensagem e o painel não abre.
Os dois exigem o banco vivo, e os dois são da F25.

## Dependências e justificativa

**Total: 22** — 4 de execução, 18 de desenvolvimento. **Duas** novas, a primeira vez desde a F00.

| # | Dependência | Tipo | Por quê |
|---|---|---|---|
| 21 | `@supabase/supabase-js` | Execução | O cliente do banco do ADR-0001. Cria as conexões anônima, autenticada e de serviço que os testes de política exercem |
| 22 | `supabase` (CLI) | Desenvolvimento | Gera os tipos a partir do esquema (D5) e roda as migrações |

**O `@supabase/ssr` foi cogitado e não entra.** Ele serve para repassar a sessão por cookie entre
servidor e navegador — que é exatamente o que a **F14** faz, e esta feature não tem tela nem login.
Os testes de política autenticam dentro do Node, o que o `supabase-js` resolve sozinho. **Previsto
para a F14, não instalado aqui** (D6).

As 20 anteriores continuam justificadas nos planos da F00 e da F01. Duas tentações recusadas
antecipadamente em D6.

## Riscos deste plano

| Risco | Como o plano reage |
|---|---|
| **Testar só o caminho feliz da política** | D1 exige dois testes por linha, e a demonstração de bloqueio faz parte da entrega |
| **Chave de serviço vazar por caminho indireto** | A barreira 3 verifica o artefato compilado, não o código |
| Teste de política preparado com o cliente de serviço e verificado com ele também | Escrito em D1 como regra: o cliente de serviço não aparece no que está sendo verificado |
| Esquema alterado pelo painel, desalinhando o repositório | D4, e a consequência escrita no README |
| Tipos divergirem do banco em silêncio | D5: gerados, e um passo no CI falha se o versionado diferir |
| Segundo projeto Supabase consumir a cota de 2 do plano gratuito | Registrado em D7 como limite assumido |
| Purga automática do ADR-0001 R6 evaporar no adiamento | Registrada em três lugares, e o procedimento manual é **executado** nesta feature |

## Rastreamento de complexidade

Sem violações da constituição a justificar.
