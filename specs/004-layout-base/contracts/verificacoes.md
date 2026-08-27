# Contrato das verificações — F03

**Data**: 2026-08-27 · Requisitos: FR-037 a FR-044 · RP-04 a RP-07 e RP-12

## Matriz pública

Fonte: catálogo canônico. Escala: 10 destinos × 7 larguras = 70 combinações.

Cada combinação mede e reporta:

- status/rota;
- contagem de landmarks;
- violações axe;
- `scrollWidth` e `clientWidth`;
- altura do cabeçalho;
- quantidade de alvos e lista dos abaixo de 44 px.

Critério agregado: 10/10 por largura e 70/70 total. Contador zero é falha.

## Sete percursos de teclado

Executados em 360 px somente com teclas reais:

1. primeiro Tab alcança e torna visível o skip link;
2. Enter no skip move foco ao main;
3. Tab alcança o botão e Enter abre o painel;
4. Tab/Shift+Tab ciclam entre os focáveis do painel;
5. Esc fecha e devolve foco;
6. Enter no destino atual fecha o painel;
7. sequência de Tab corresponde à ordem visual, inclusive em desktop.

Saída obrigatória: `7/7`. Clique no backdrop, trava de rolagem e resize são casos adicionais.

## Lighthouse

`lighthouserc.cjs` deriva dez URLs do catálogo, três execuções cada, com perfil mobile simulado
explícito. `scripts/verificar-paginas-lighthouse.mjs` lê o manifest atual e exige:

- 10/10 caminhos;
- 30/30 relatórios;
- status HTTP aprovado;
- URL final esperada;
- desempenho ≥ 90 e acessibilidade ≥ 95;
- `formFactor=mobile` e throttling simulado no LHR.

## Igualdade visual

Seis pares botão/link. Para cada par, comparar as propriedades enumeradas no modelo, informar
quantidade medida e falhar nomeando propriedade, variante e dimensão divergentes.

## Demonstrações RP-12

Cada verificação nova entra em `EVIDENCIAS-F03.md` com:

| Campo | Obrigatório |
| --- | --- |
| violação temporária | mudança mínima e nomeada |
| comando | exatamente o executado |
| resultado vermelho | código e mensagem que provam detecção |
| restauração | como voltou ao estado correto |
| resultado verde | código e contador final |

Demonstração estrutural do catálogo: acrescentar destino sem rota. Playwright e Lighthouse devem
passar a cobrá-lo sem edição adicional e falhar nomeando o caminho.
