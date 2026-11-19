# Proposta — atualizar o Next

## Why

Na change `montar-guardiao-appsec`, o guardião deu BLOQUEADO pelo `next@16.3.1` da `main`: a faixa
de 16.0.0 a 16.4.4 tem avisos críticos de execução remota de código. Pela regra da Q2 daquela
change, achado bloqueante confirmado e explorável em produção vira correção imediata. A página em
construção usa o otimizador de imagem, e o interruptor deixa `/_next/image` passar sem desvio: o
otimizador está exposto em produção.

Medido pelo líder técnico em 19/11/2026: `npm audit` com **37 avisos** (crítico 2, alto 21,
moderado 12, baixo 2, info 0), e `npm audit --audit-level=critical` com código 1. Os dois críticos
são o `next` e o `proxy-addr` (Q1).

Registro, sem tomar partido: o briefing associa a CVE-2026-96889 ao GHSA-2464-fhr4-w9xw; o
`npm audit` a associa ao aviso do `sharp` (GHSA-wq5f-xc86-pv6w), e o GHSA-2464 é o do `next` sobre
SVG no otimizador.

## What Changes

- **`next` e `eslint-config-next` de 16.3.1 para 16.4.6**, a `latest` do registro e a última da
  linha 16.4, que é a correção proposta pelo `npm audit`, sem troca de major. As duas continuam
  fixas, sem `^`.
- O `sharp`, dependência opcional do `next`, sobe junto: o `next@16.4.6` pede `^0.35.5`, versão que
  corrige os dois avisos altos dele. A versão instalada vai para o relatório.
- **Só se Q1 = (a):** o `proxy-addr` passa de 2.0.7 para 2.0.8, só no `package-lock.json`.

**Justificativa de dependência (princípio 1 e RP-01).** Nenhuma dependência entra nem sai: as
mesmas 22 diretas (4 + 18), com versão nova em duas.

**Sem delta de spec.** As specs de `openspec/specs/` descrevem comportamento (página em construção,
interruptor, CI), e nenhum requisito fixa versão de pacote. O comportamento observável não muda.

**Critérios de aceite:**

- `npm ls next` e `npm ls eslint-config-next` mostram 16.4.6.
- `npm audit --audit-level=critical` sai com código 0 (ver Q1). Totais do `npm audit` por
  severidade, antes e depois, no relatório.
- `npm run verificar`, `npm test`, `npm run test:e2e` (os dois modos do interruptor) e
  `npm run test:desempenho` verdes, com os números no relatório.
- A raiz fica idêntica: prints em 390 e 1280 px antes e depois, com **0 pixels diferentes**.
- O revisor aprova.

## Fora de escopo, de propósito

- Os outros avisos do `npm audit`, que são da change futura `auditoria-de-base-appsec`.
- Qualquer outra dependência, e qualquer mudança em `src/`, `tests/`, `scripts/`, `.github/` ou
  `lighthouserc.json`. Se a versão nova exigir mudança de código, a change para e volta ao Gabriel.
- A versão citada em `docs/historico/`, que registra o passado.

**Incompleto, declarado desde já:** o guardião-appsec não audita esta branch, porque o arquivo
dele só existe na branch `chore/montar-guardiao-appsec`. Ele audita esta troca quando a `main`
entrar na branch da change 6.

## Decisões pendentes do Gabriel

**Q1. O crítico do `proxy-addr` (desenvolvimento, só no CI) entra nesta change?** Ele vem de
`@lhci/cli@0.15.1 -> express@4.22.2 -> proxy-addr@2.0.7` (GHSA-jqcg-44mw-7w3h, falsificação de
IP) e não vai para produção. Com o escopo "só o que anda com o `next`", o critério
`npm audit --audit-level=critical` com código 0 não passa.

- (a) Entra: `npm update proxy-addr` move só o `package-lock.json` para 2.0.8, dentro da faixa
  `~2.0.7` do `express`; o `package.json` não muda · custo: uma linha a mais de escopo, fora do
  "só o que anda com o `next`".
- (b) Não entra: o critério passa a ser `npm audit --omit=dev --audit-level=critical` · custo: muda
  um critério de aceite do briefing; o crítico do CI espera a `auditoria-de-base-appsec`.
- (c) Não entra e o critério fica como está · custo: Portão 2 com um critério reprovado e declarado.
- Recomendação do líder técnico: (a), porque é correção de lockfile dentro de semver de uma
  dependência transitiva, cumpre o critério sem afrouxá-lo, e deixar um crítico conhecido aberto
  contradiz a mesma regra da Q2 que motivou esta change.

**Q2. Quem executa a troca?** O briefing não diz, e `package.json` e `package-lock.json` não estão
no escopo de nenhum agente.

- (a) O `dev-frontend`, com escopo nominal nos dois arquivos; os prints com o `guardiao-visual` ·
  custo: um escopo nominal a mais para conferir no `git status`.
- (b) O líder técnico, direto · custo: quem coordena também implementa, e a conferência de escopo
  perde o par agente e arquivo.
- Recomendo (a), o mesmo arranjo da Q5 da `interruptor-em-construcao`.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

Nenhuma (ver "Sem delta de spec").

## Impact

`package.json`: duas linhas. `package-lock.json`: o `next`, os `@next/*`, o `sharp` e o que eles
puxam, mais o `proxy-addr` se Q1 = (a). Nenhum arquivo de `src/`, `tests/`, `scripts/` ou do CI.
Em produção, a mesma página em construção, servida pelo `next` corrigido.
