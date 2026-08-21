# Guia de validação — F00 Fundação técnica

**Data**: 2026-08-20 · **Spec**: [spec.md](./spec.md) · **Plano**: [plan.md](./plan.md)

Este guia serve para **provar** que a F00 está pronta. Ele cobre as 14 evidências da Parte 3 de
`docs/F00-fundacao.md` e os 14 critérios de sucesso da spec.

Regra da casa: cada item é respondido com **evidência** — um número, uma saída de comando, uma
captura. Nunca com adjetivo. "0 elementos abaixo de 44 px", não "ficou bom no celular".

## Pré-requisitos

- Node **22 LTS** (a versão está no `.nvmrc` e em `engines`)
- Git
- Uma pasta limpa, fora do projeto atual — a validação começa por um clone do zero

---

## Parte 1 — O projeto roda do zero (SC-001, FR-001)

```bash
git clone <endereço-do-repositório> validacao-f00 && cd validacao-f00 && npm ci && npm run dev
```

**Esperado**: o servidor sobe e a página inicial abre. Cronometrar: o alvo do SC-001 é **menos de
15 minutos** para alguém que nunca viu o projeto, seguindo só o README.

**Evidência 1**: tempo medido, e a saída dos comandos.

**Evidência 2 (SC-013)**: a árvore de pastas, comparada item a item com a seção 1 dos padrões.

```bash
git ls-files | grep "^src/" | sed 's|/[^/]*$||' | sort -u
```

**Evidência 3 (FR-004, FR-005)**: a página inicial mostra a logo da LIACUP e "Portal em
construção", com as cores e a tipografia dos tokens.

**Evidência 4 (SC-014, FR-027)**: com as ferramentas de desenvolvedor abertas na aba de rede,
recarregar a página. **Zero requisições a domínio externo** — nada de `fonts.googleapis.com`.

---

## Parte 2 — As verificações passam no estado inicial (SC-002)

```bash
npm run verificar
```

**Esperado**: os quatro passos passam — tipos, análise estática, formatação e tokens.

**Evidência 5**: a saída dos quatro, com **zero problema** em cada um.

---

## Parte 3 — As verificações realmente falham (SC-003, SC-004, FR-011)

Esta é a parte que mais importa. Verificação que ninguém viu falhando é verificação que ninguém
sabe se funciona. Cada caso tem **duas execuções e dois resultados opostos**.

Faça em alteração descartável. Nada disso é incorporado.

### V1 — Componente de base importando da camada de dados

Acrescentar em `src/componentes/ui/Botao.tsx`:

```ts
import { listarExemplos } from '@/features/exemplo/dados'
```

```bash
npm run lint
```

**Esperado**: falha apontando o arquivo, a linha e `import/no-restricted-paths`. Remover a linha e
rodar de novo: passa.

**Evidência 6**: as duas saídas, lado a lado.

### V2 — Uma feature importando de outra _(o caso que mais importa)_

Criar `src/features/segunda/` e, de dentro de `src/features/exemplo/`, importar dela.

```bash
npm run lint
```

**Esperado**: falha. Se **passar**, a geração automática de zonas não está funcionando e a regra
não está pronta — ver [contracts/regras-de-camada.md](./contracts/regras-de-camada.md).

**Evidência 7**: as duas saídas.

### V3 — Cor escrita à mão fora dos tokens

Acrescentar `color: #82558f;` em qualquer componente.

```bash
npm run verificar:tokens
```

**Esperado**: falha apontando arquivo, linha, o valor encontrado **e qual token usar no lugar**.

**Evidência 8**: as duas saídas.

### V4 — O falso positivo que não pode acontecer

Sem alterar nada, rodar a verificação de tokens com o `src/estilos/tokens.css` cheio de
hexadecimais — que é onde eles devem estar.

**Esperado**: **passa**. Se acusar o arquivo de tokens, a verificação está errada e ninguém vai
confiar nela.

**Evidência 9**: a saída passando.

---

## Parte 4 — Os testes (SC-005, SC-006, SC-007)

```bash
npm test
```

**Evidência 10**: quantos testes rodaram e quantos passaram. Mínimo: 1 de unidade.

```bash
npm run test:e2e
```

**Esperado**: a página inicial carrega, o axe-core não acusa violação, e não há rolagem horizontal
em **360, 390, 430, 480, 768, 1024 e 1280 px**.

**Evidência 11**: a saída, com o número de violações de acessibilidade (**deve ser 0**) e as sete
larguras verificadas nomeadas.

```bash
npm run test:desempenho
```

**Evidência 12 (FR-029)**: as notas de desempenho e acessibilidade, contra os limiares **≥ 90** e
**≥ 95**. Se falhar, o limiar **não** é baixado — vira tarefa de correção.

---

## Parte 5 — Windows e Linux (FR-028)

**Evidência 13**: `.gitattributes` com `* text=auto eol=lf`, `endOfLine: "lf"` no Prettier e
`forceConsistentCasingInFileNames: true` no `tsconfig.json`, todos versionados.

**Teste real**: mudar a caixa de um import (`@/componentes/Ui/Botao`) e rodar
`npm run verificar:tipos`. **Esperado**: falha na máquina Windows também, não só no CI.

**Evidência 14**: a saída da falha.

---

## Parte 6 — Publicação e proteção (SC-008, SC-009, SC-010)

Estes três dependem de ações do Gabriel na interface do GitHub e da Vercel — ver
`docs/F00-runbook-gabriel.md`, Parte G.

**Ordem obrigatória (FR-020)**: a proteção do ramo principal só pode ser configurada **depois** do
primeiro CI ter rodado. Antes disso o GitHub não conhece as verificações e a proteção fica vazia:
parece configurada e não barra nada.

| #   | O que provar                                    | Como                                                     | Evidência                                |
| --- | ----------------------------------------------- | -------------------------------------------------------- | ---------------------------------------- |
| 15  | Toda alteração proposta dispara as verificações | Abrir uma proposta qualquer                              | Lista de verificações rodando            |
| 16  | **Alteração quebrada é barrada de verdade**     | Abrir proposta com erro de propósito e tentar incorporar | Captura do botão de incorporar bloqueado |
| 17  | Cada proposta tem endereço de pré-visualização  | Abrir o endereço                                         | O endereço, funcionando                  |
| 18  | O que entra na `main` é publicado sozinho       | Incorporar e esperar                                     | Endereço público com a página provisória |

O item **16 é o mais importante da feature**. Se der para incorporar com o CI vermelho, a proteção
não está valendo — e todo o resto da F00 é decoração.

---

## Parte 7 — Quem vem depois (SC-011, SC-012)

**Evidência 19 (FR-021)**: alguém que não participou lê o README e consegue rodar, testar e
explicar o projeto. Leitura crítica, não checagem de existência.

**Evidência 20 (SC-011, FR-023)**: varredura do repositório **e do histórico** por segredos.

```bash
git log -p --all | grep -nE "(SUPABASE|RESEND|SECRET|API_KEY|TOKEN)[A-Z_]*\s*=\s*[^\s]" | head -20
```

**Esperado**: nenhuma ocorrência com valor real. O `.env.example` lista as variáveis com explicação
e **sem valor** (FR-022).

**Evidência 21 (SC-012, FR-025)**: contagem de dependências contra a tabela do plano.

```bash
node -e "const p=require('./package.json');const d=Object.keys(p.dependencies||{}),v=Object.keys(p.devDependencies||{});console.log('execucao:',d.length,'| dev:',v.length,'| total:',d.length+v.length);console.log([...d,...v].join('\n'))"
```

**Esperado**: **3 de execução, 17 de desenvolvimento, 20 no total**, cada uma na tabela do
[plan.md](./plan.md). Número diferente do plano é divergência a reportar, não a arredondar.

**Evidência 22 (FR-024)**: `docs/` versionada com ADR-0001, ADR-0002, padrões de código,
constituição e conteúdo institucional.

---

## Nota sobre a contagem de dependências (R2)

O SC-012 conta **dependências diretas declaradas no `package.json`** — `dependencies` +
`devDependencies` — e **não** as transitivas. O comando da evidência 21 já lê exatamente esses dois
campos. O número a bater é **20: 3 de execução e 17 de desenvolvimento**.

Qualquer dependência que apareça sem estar na tabela do [plan.md](./plan.md) precisa ser
justificada **antes** de entrar, não depois. Dependência que chega junto de outra e vira uso direto
sem passar pela tabela é o começo do "porque é padrão" que a Parte 5 da F00 lista como risco.
