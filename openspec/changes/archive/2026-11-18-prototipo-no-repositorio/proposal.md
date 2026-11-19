# Proposta — protótipo no repositório

## Why

O protótipo aprovado e os prints de referência já estão versionados, mas os prints foram tirados à
mão pelo gestor, no Chrome dele, em 18/11. Ninguém consegue refazê-los do mesmo jeito: se um print
sair cortado, no meio de uma animação ou com a fonte errada, não há como regerar e comparar. Num
projeto em que toda change de tela é conferida contra esses prints (constitution, princípio 4), o
gabarito precisa sair de um comando que qualquer pessoa da próxima diretoria roda, e não da
memória de quem clicou.

## What Changes

- **Um script que tira os prints do protótipo.** Abre o arquivo do protótipo direto do disco, sem
  rede, navega clicando no cabeçalho em 1280 px (o protótipo não tem endereço por página) e, para
  cada uma das **11 páginas públicas** — as 10 do menu e **Processo seletivo** —, tira print de
  página inteira em 1280 px e, redimensionando para 390 × 844, em 390 px. Tira também o **menu
  lateral aberto em 390 px**, sobre a página Contato, na área visível. Usa o navegador de teste que
  o projeto já tem.
- **O comando `npm run prints:prototipo`**, que antes confere se o navegador de teste está
  instalado e, se não estiver, diz o que rodar.
- **Os prints gerados substituem os do gestor**, com os mesmos nomes — `<pagina>-1280.png`,
  `<pagina>-390.png`, `menu-aberto-390.png` — e entram dois novos: `processo-seletivo-1280.png` e
  `processo-seletivo-390.png`. São 23 arquivos.
- **O script diz quanto gerou** — "gerados: N de 23" — e sai com código diferente de zero se gerar
  menos, ou se houver na pasta um PNG que ele não gerou, nomeando cada um (RP-12).
- **`prototipo/README.md` em cinco linhas:** o que é, de onde veio
  (`https://claude.ai/artifact/2JaFVq33WLXjsx8bvV17xY`), que o design não muda e como regerar.
- **A exceção do RP-13 para os prints**, registrada em `docs/PADROES-DE-CODIGO.md` §8.1 pelo líder
  técnico, com o texto aprovado no Portão 1 (`design.md`, D6). Fora do que o briefing pedia;
  aprovado pelo Gabriel e declarado na entrega.

**Critérios de aceite:** o script gera 23 arquivos e imprime quantos gerou; rodado duas vezes
seguidas, gera os mesmos 23 nomes; nenhuma dependência nova (22 diretas antes e depois,
`package-lock.json` sem diferença).

**Fora de escopo**, de propósito:

- Comparar site com protótipo. Isso é do `guardiao-visual`, nas changes de tela da R1.
- Prints do **site**, e prints automáticos no CI — são de `ajustar-ci-ao-novo-fluxo`.
- Qualquer mudança no arquivo do protótipo. Ele continua byte a byte igual.
- Qualquer mudança no CI ou em verificação existente, inclusive em `verificar:artefatos`.
- Igualdade de **bytes** entre duas execuções como critério: o critério são os nomes. Os bytes
  são medidos e registrados como informação (`design.md`, D4).
- Painel e tela de entrar do protótipo: não são páginas públicas.

## Decisões do Portão 1

- **Q1 = (b):** Processo seletivo entra; 11 páginas, 23 arquivos.
- **Q2 = (a):** os prints seguem versionados, com a exceção do RP-13 registrada em
  `PADROES-DE-CODIGO.md` §8.1 pelo líder técnico (tarefa 3.2).
- **Q3 = (a):** o menu aberto repete o print do gestor — sobre Contato, área visível 390 × 844.
- **Q4 = (a):** o `dev-frontend` implementa, com escopo exatamente `scripts/prints-do-prototipo.mjs`,
  a linha do script no `package.json`, `prototipo/prints/` e `prototipo/README.md`.

## Capabilities

### New Capabilities

- `referencia-visual`: o gabarito visual do portal — de onde ele sai, o que cobre, como se regera
  e como se lê. As specs existentes (`fundacao-e-ci`, `design-tokens`, `camada-de-dados`,
  `equipe-de-agentes`) não tratam do gabarito.

### Modified Capabilities

Nenhuma.

## Impact

| O que | Efeito | Quem escreve |
|---|---|---|
| `scripts/prints-do-prototipo.mjs` | Novo | `dev-frontend` |
| `package.json` | Uma linha em `scripts`; nenhuma dependência | `dev-frontend` |
| `prototipo/prints/` | 21 PNG trocam de conteúdo, não de nome; 2 novos | `dev-frontend`, pelo comando |
| `prototipo/README.md` | Novo | `dev-frontend` |
| `docs/PADROES-DE-CODIGO.md` §8.1 | Exceção do RP-13 (D6) | líder técnico |
| `docs/PLANO-DE-DESENVOLVIMENTO.md`, `docs/REFERENCIA-VISUAL.md` | Já atualizados pelo gestor para 11 páginas e 23 arquivos; entram no commit desta change | gestor |
| `prototipo/Portal-LIACUP.html`, `src/`, `tests/`, `.github/` | Nenhum arquivo tocado | — |
| Comportamento do site | Nenhum. A change não tem prévia visual | — |
