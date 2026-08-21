# Guia de validação — F01 Design system em componentes

**Data**: 2026-08-21 · **Spec**: [spec.md](./spec.md) · **Plano**: [plan.md](./plan.md)

Cobre os 13 critérios de sucesso da spec. Cada item responde com **número ou saída de comando**,
nunca com adjetivo.

## Pré-requisitos

- Node 22, o repositório na branch `feat/F01-design-system`
- `npm ci` e `npx playwright install --with-deps chromium` já rodados

---

## Parte 1 — Os componentes existem e são tipados (SC-001, SC-002)

```bash
npm run verificar
```

**Evidência 1**: os quatro passos com zero problema. O de tokens informa quantos arquivos varreu.

**Evidência 2 (SC-001)**: 7 componentes de base em `src/componentes/ui/` mais
`componentes/padroes/` — botão, cartão, etiqueta, campo, separador, ícone e estado vazio.

```bash
npm test
```

**Evidência 3 (SC-002)**: número de testes e de arquivos. **Todo** componente de base tem arquivo de
teste cobrindo renderização, variantes e interação onde há interação.

**Evidência 4 (FR-002)**: escrever uma variante inexistente — por exemplo
`<Etiqueta variante="roxa">` — e rodar `npm run verificar:tipos`. **Esperado: falha.** Remover e
passar. Duas execuções, dois resultados opostos, como nas demonstrações da F00.

---

## Parte 2 — A vitrine (SC-003, SC-004, SC-005, SC-008)

```bash
npm run dev
```

Abrir <http://localhost:3000/vitrine>.

**Evidência 5 (FR-013)**: todos os componentes aparecem, em todas as variantes e estados —
incluindo **erro**, **desabilitado**, **erro + desabilitado**, **rótulo escondido**, **cartão sem
título** e **etiqueta com texto longo**. A lista completa está em
[contracts/vitrine.md](./contracts/vitrine.md).

```bash
npm run build && npm run test:e2e
```

**Evidência 6 (SC-003)**: `Violacoes de acessibilidade: 0` na vitrine, nas 7 larguras.

**Evidência 7 (SC-004)**: a saída informa **quantos elementos interativos foram medidos** e quantos
ficaram abaixo de 44 px. O segundo número precisa ser **0**; o primeiro precisa ser **maior que
zero** — se ele for 0, o teste não mediu nada e o verde não significa nada.

**Evidência 8 (SC-005)**: zero ocorrências de rolagem horizontal em 360, 390, 430, 480, 768, 1024 e
1280 px.

**Evidência 9 (SC-008)**: o teste que varre os links da página pública encontra **zero** apontando
para `/vitrine`.

**Teste do teste**: acrescentar de propósito um link para `/vitrine` na página inicial e rodar de
novo. **Esperado: falha**, listando o link. Remover e voltar ao verde. Sem esta demonstração, o
SC-008 é promessa — mesmo raciocínio das demonstrações V1 a V5 da F00.

---

## Parte 3 — Fidelidade ao aprovado (SC-006, SC-007, SC-009)

**Evidência 10 (SC-006)**: `npm run verificar:tokens` com zero valores escritos à mão.

**Evidência 11 (SC-007)**: comparar `src/estilos/tokens.css` com a versão ao fim da F00.

```bash
git diff main -- src/estilos/tokens.css
```

**Esperado**: apenas **linhas acrescentadas**. Nenhuma linha de token existente alterada. Os 20
tokens novos batem, um a um, com a tabela de [data-model.md](./data-model.md).

**Evidência 12 (SC-009)**: contar as classes restantes no `liacup.css`.

```bash
grep -cE "^\.[a-z]" liacup.css
```

**Esperado**: **27**, contra 62 ao fim da F00. Cada bloco restante sob um cabeçalho nomeando a
feature de destino.

**Evidência 13 — a que mais importa nesta feature**: a tabela de [FIDELIDADE.md](./FIDELIDADE.md)
preenchida, componente a componente, com o valor **efetivo** do `liacup.css` — o que vale depois da
cascata, não o do primeiro bloco.

**Critério de aprovação**: **zero linhas** marcadas `corrigido`, `ratificado` ou `revertido` **sem
motivo escrito**. Foi a ausência exata desse motivo que deixou passar os três desvios do botão na
F00.

---

## Parte 4 — Quem vem depois (SC-010, SC-011, SC-012)

**Evidência 14 (SC-010)**: cada um dos 7 componentes traz no próprio arquivo **o que é, quando usar
e quando não usar**.

**Evidência 15 (SC-011)**: descrever uma tela em voz alta para alguém que não participou — "uma
lista de notícias com categoria e data" — e pedir que escolha os componentes usando só o que está
escrito nos arquivos. **Esperado**: acerta sem perguntar.

**Evidência 16 (SC-012)**: contagem de dependências diretas.

```bash
node -e "const p=require('./package.json');const d=Object.keys(p.dependencies||{}),v=Object.keys(p.devDependencies||{});console.log('execucao:',d.length,'| dev:',v.length,'| total:',d.length+v.length)"
```

**Esperado**: **3 · 17 · 20** — exatamente as mesmas da F00. Esta feature não instala nada.

**Evidência 17 (FR-020)**: o README aponta a vitrine, com o endereço, como o lugar de ver o sistema
inteiro.

---

## Parte 5 — Nada da F00 quebrou (SC-013)

```bash
npm run test:desempenho
```

**Evidência 18**: desempenho ≥ 90 e acessibilidade ≥ 95 continuam valendo. Se caírem, o limiar
**não** desce — vira tarefa de correção.

**Evidência 19**: os 35 testes de ponta a ponta da página inicial continuam passando, incluindo o
que cobra o texto acentuado e o de zero requisições externas.

**Evidência 20**: o CI inteiro verde na alteração proposta, com o botão de incorporar liberado — e
travado quando algo falha.

---

## Registro obrigatório antes de fechar

Duas coisas precisam existir em `docs/` ao fim desta feature, senão o FR-024 da F00 fica quebrado:

1. **`docs/ADR-0004-controles-e-fidelidade.md`** — as quatro decisões. É a **primeira tarefa** da
   feature, não a última.
2. **A linha do grupo `(interno)`** na seção 1 de `docs/PADROES-DE-CODIGO.md` — mesmo caminho que a
   linha do `lib` e a do `componentes/layout` percorreram: a regra mora no documento de origem, não
   só no contrato que a aplica.
