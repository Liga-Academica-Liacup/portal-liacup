# Fidelidade — F03 Layout base

**Estado**: template do plano; preencher com valores medidos durante a implementação.

Regra: toda linha não idêntica exige motivo. Contraste sempre nomeia primeiro plano, fundo e
superfície. Valores previstos abaixo são ponto de comparação, não substituem a medição final.

## Cabeçalho e navegação

| Propriedade/estado | Origem aprovada | Implementação medida | Veredito | Motivo quando não idêntico |
| --- | --- | --- | --- | --- |
| display/alinhamento/gap | `.nav`: flex, center, `--space-4` | flex, center, `--space-3` na lista | corrigido | plano B do FR-007 disparado por medição: com `--space-4` havia `scrollWidth 1041 > 1024` |
| padding | `.nav`: `--space-3` / `--space-4` | `--space-2` / `--space-4` | corrigido | aritmética do teto de 64 px: 44 + 2 × 13,2 = 70,4 px estoura; com `--space-2`, 61,6 px. Medido: 62,59 px com a borda |
| borda inferior | `.nav`: nenhuma | `--largura-borda` sólida em `--color-divider` | divergente | o cabeçalho passou a ser fixo e opaco; sem a borda ele não se separa do conteúdo que passa por baixo. `--color-divider` é decorativo e não carrega informação |
| marca — família/peso | `.nav-brand`: heading/400 | `--font-heading` / `--font-heading-weight` | idêntico | |
| marca — tamanho | `.nav-brand`: 18 px | `--font-size-marca: 18px` | idêntico | token novo com origem literal `.nav-brand`; 18 px não existia na escala, e usar o degrau vizinho seria mudar o aprovado para não criar token |
| link — tamanho | `.nav a`: 14 px | `--font-size-controle` (14 px) | idêntico | |
| link — decoração normal | `.nav a`: sem sublinhado | `text-decoration: none` no repouso; sublinhado só em `[aria-current]` | corrigido | o sublinhado da página atual é a pista não cromática exigida pelo FR-016; sem ela a marcação dependeria só de cor |
| hover/atual — cor | accent reprovado | accent-700 | corrigido | ADR-0003 §2 |
| atual — pista não cromática | não existia | `text-decoration: underline` + `--color-accent-700` | corrigido | FR-016: o protótipo marcava a página atual só por cor, o que exclui quem não a distingue |
| alvo de toque | origem não garantia 44 px | `min-height: 44px` + `padding-inline: --space-3`; 0 alvos abaixo de 44 px em 70 combinações | corrigido | medido: sem o preenchimento horizontal, "Início" media 33,8 × 44,0 — altura certa e largura curta. `min-height` sozinho não é um alvo de 44 px |
| altura mobile | protótipo 244 px | **62,59 px** em 360/390/430/480 | corrigido | FR-002. De 244 para 62,59 px: 1,41 px de folga no teto de 64. O orçamento só admite `--space-2` de preenchimento vertical — com `--space-3` daria 70,4 px |
| permanência ao rolar | protótipo fixo | `position: sticky`, topo ≥ −1 px após rolar 400 px | ratificado | o `.nav` aprovado não era fixo; o FR-002 exige, e a premissa de manter fixo nas sete larguras foi confirmada por decisão explícita em 27/08 |
| painel lateral | não existia | `<dialog>` nativo com `showModal()`; 7/7 percursos de teclado | corrigido | requisito mobile aprovado. Sem dependência nova: modalização, prisão de foco e Esc vêm da plataforma. Medido com `show()` no lugar de `showModal()`: 9 escapes para controles da página atrás |
| CTA entre 1024 e 1146 px | texto em uma linha no protótipo | 53,19 px de altura, texto em duas linhas centradas | **divergente, decidido pela coordenação em 28/08/2026** | ver a seção abaixo: quatro opções consideradas, três descartadas por medição |

### A decisão do CTA em duas linhas, e as três opções descartadas

**O que foi medido primeiro, porque a faixa não era o que nós dois supúnhamos.** Uma varredura de
**1024 a 1280 px em passos de 8 px**, com refino de 1 px na fronteira:

| Medida | Valor |
| --- | --- |
| Faixa em que o CTA ocupa duas linhas | **1024 a 1146 px — 123 px de largura** |
| Primeira largura com uma linha | **1147 px** |
| Altura do cabeçalho no começo e no fim da faixa | **71,78 px** nos dois |
| Alturas distintas do CTA dentro da faixa | **uma só: 53,19 px** |
| Passos com rolagem horizontal | **0**, em 33 passos de 8 px mais o refino de 1 px |

A estimativa anterior — "a faixa vai até ~1064" — **estava errada por três vezes**. Ela foi inferida
de uma única medição em 1024, e a inferência supunha um déficit fixo de 17 px; na verdade o CTA é
**espremido progressivamente pelo flex**, de 96,38 px em 1024 até 153,73 px em 1147. Nenhuma das
sete larguras da matriz cai dentro de 1025–1146, então a faixa inteira vivia num ponto cego.

**As quatro opções, e por que três caíram:**

| Opção | Por que não |
| --- | --- |
| Corte em `> 1024` em vez de `>= 1024` | Conserta **a largura que o teste mede, e mais nenhuma**. A faixa real tem 123 px: 1025–1146 continuariam com duas linhas. É fazer o teste passar em vez de consertar o objeto — o que o RP-12 existe para impedir |
| Corte em 1280 | O painel passaria a servir 768–1279. Um notebook de 1200 px esconderia nove destinos atrás de um clique **tendo espaço de sobra**, o que é pior para gente real que um botão de duas linhas. E 1280 não é ponto de corte declarado na seção 3 dos padrões |
| `gap` em `--space-2` | Economiza 9 × 4,4 = **39,6 px** contra um déficit de **40**. Fica **0,4 px** curto, numa medida que varia com renderização de fonte. Cair no limite exato não é solução |
| Fonte menor na navegação | Cabe, e piora a legibilidade num site cujo público inclui pessoas idosas e com baixa visão. O Princípio 2 não admite a troca |

**A opção adotada** é o CTA em duas linhas, e ela é defensável pelo que importa: o CTA continua
sendo o elemento mais destacado da página, com alvo de toque correto, contraste correto e a
conversão funcionando. **Nenhum destino some e nada fica inacessível.** O custo é estético e local.

**Condição cumprida — a quebra é intencional, não acidental.** `text-align: center` e
`text-wrap: balance` entraram na origem única de aparência. A medição confirma a forma estável:
**uma única altura de CTA, 53,19 px, nos 123 px da faixa**.

**Condição cumprida — o ponto cego foi varrido.** A matriz mede sete larguras; a divergência vivia
entre elas. Os 33 passos de 8 px mais o refino de 1 px confirmam **zero rolagem horizontal** em toda
a faixa, que é o Princípio 3 verificado onde a amostragem não olha.

## Rodapé

| Propriedade/estado | Origem/decisão | Implementação medida | Veredito | Motivo |
| --- | --- | --- | --- | --- |
| linha institucional | componente F00 | preservada, agora no layout do grupo `(site)` | idêntico | passou a aparecer nas dez rotas, e não só na provisória |
| sede curta | conteúdo aprovado | "FCTS · Campus UnB Ceilândia" | corrigido | FR-025. O protótipo trazia "Faculdade de Medicina · Campus Darcy Ribeiro", inventado. Sem logradouro e sem CEP, por decisão de 27/08 |
| contatos | `LinksDeContato` F00 | os dois canais preservados, `@liacup.unb` e `liacup.unb@gmail.com` | idêntico | movidos para o rodapé; nenhum endereço novo escrito (FR-023) |
| contêiner semântico | `nav` na F00 | `address` | corrigido | exatamente um landmark de navegação |
| borda/separador | divider decorativo | `--color-divider` no topo do rodapé | idêntico | **permanece só decorativo**: separa blocos e não carrega informação, então o mínimo de 3:1 para elemento de interface não se aplica |

## Aparência compartilhada

| Variante/dimensão | Pares medidos | Propriedades divergentes | Veredito | Motivo |
| --- | ---: | ---: | --- | --- |
| primário normal | 1 | **0** | idêntico | 31 propriedades comparadas, derivadas do `AparenciaDeBotao.module.css` |
| secundário normal | 1 | **0** | idêntico | 31 propriedades comparadas, derivadas do `AparenciaDeBotao.module.css` |
| fantasma normal | 1 | **0** | idêntico | 31 propriedades comparadas, derivadas do `AparenciaDeBotao.module.css` |
| primário largura total | 1 | **0** | idêntico | 31 propriedades comparadas, derivadas do `AparenciaDeBotao.module.css` |
| secundário largura total | 1 | **0** | idêntico | 31 propriedades comparadas, derivadas do `AparenciaDeBotao.module.css` |
| fantasma largura total | 1 | **0** | idêntico | 31 propriedades comparadas, derivadas do `AparenciaDeBotao.module.css` |

**Total: 6/6 pares · 31 propriedades por par · 0 divergentes.** A lista de propriedades é derivada
do CSS da origem única, e não digitada — lista escrita à mão seria a cobertura. Duas defesas contra
derivação quebrada: piso de sanidade (12) e `CSS.supports` por nome, esta última vista pegando
**30 derivadas / 29 reconhecidas** quando uma propriedade inexistente foi injetada no CSS. Depois
da demonstração, `text-align` e `text-wrap` entraram na origem única e a derivação subiu sozinha para
**31 derivadas / 31 reconhecidas**, sem editar a lista do teste.

## Contrastes obrigatórios

| Primeiro plano | Fundo/superfície | Valor previsto | Valor medido | Veredito |
| --- | --- | ---: | ---: | --- |
| `--color-text` `#201e1d` | `--color-bg` `#f5ead8` | 13,95:1 | PREENCHER | PREENCHER |
| `--color-text` `#201e1d` | `--color-surface` `#ebddc5` | 12,40:1 | PREENCHER | PREENCHER |
| `--color-accent-700` `#683f74` | `--color-bg` `#f5ead8` | 6,91:1 | PREENCHER | PREENCHER |
| `--color-accent-700` `#683f74` | `--color-surface` `#ebddc5` | 6,15:1 | PREENCHER | PREENCHER |
| `--color-neutral-700` `#645c50` | `--color-bg` `#f5ead8` | 5,53:1 | PREENCHER | PREENCHER |
| `--color-neutral-700` `#645c50` | `--color-surface` `#ebddc5` | 4,92:1 | PREENCHER | PREENCHER |
| `--color-bg` `#f5ead8` | CTA `--color-accent-600` `#82558f` | 4,84:1 | PREENCHER | PREENCHER |
| `--color-neutral-600` `#82796a` | `--color-surface` `#ebddc5` | 3,21:1 | PREENCHER | PREENCHER |
| `--color-divider` composto | superfície em que aparecer | 1,37:1 previsto | PREENCHER | só pode ser decorativo |

## Contagem da fonte

| Medida | Antes | Depois esperado | Depois medido | Veredito |
| --- | ---: | ---: | ---: | --- |
| seletores pendentes sob o banner | 27 | 22 | PREENCHER | PREENCHER |
| seletores da família `.nav` | 5 | 0 | PREENCHER | PREENCHER |
| nomes em `NomeDoIcone` | 2 | 4 | PREENCHER | PREENCHER |
| tokens existentes alterados | 0 | 0 | PREENCHER | PREENCHER |
| tokens novos | 0 | 1 | PREENCHER | `--font-size-marca`, origem `.nav-brand` |

## Veredito final

- Linhas não idênticas sem motivo: **PREENCHER**
- Combinações de cor medidas: **PREENCHER/PREENCHER**
- Resultado: **PREENCHER**
