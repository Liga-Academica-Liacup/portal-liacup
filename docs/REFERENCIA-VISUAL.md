# Referência visual do Portal LIACUP

**Status:** aprovado pelo Gabriel junto com o plano v7, em 18/11/2026
**Data:** 18 de novembro de 2026
**Substitui:** `design-system-e-pendencias.md` (paleta antiga do Canva, já superada), `adr-0004-alvos-de-toque-e-tipografia.md`, `auditoria-mobile-v3.md`, `prompt-claude-design-v2.md`, `prompt-claude-design-v3-mobile.md` e `revisao-v2-liga.md`

---

## 1. A fonte da verdade

**O protótipo aprovado pela liga, no Claude Design.** Link: `https://claude.ai/artifact/2JaFVq33WLXjsx8bvV17xY`. Arquivo exportado recebido do Gabriel em 18/11/2026: `Protótipo do site _ Portal LIACUP.html` (1,3 MB, autocontido, roda offline).

**O design não muda.** Foi aprovado pela liga. O que recomeça é a implementação no site.

A change `prototipo-no-repositorio` põe o arquivo em `prototipo/` e, para cada uma das 10 páginas públicas, um print de página inteira em 390 px e outro em 1280 px em `prototipo/prints/`. Esses prints são o gabarito de toda change de tela.

**A rodada mobile v3 foi aplicada no protótipo.** Medido em 18/11, renderizando o arquivo no Chrome:

| Medida | 390 px | 1280 px |
|---|---|---|
| Altura do cabeçalho | **62 px** (era 244) | 114,4 px |
| Alvos de toque abaixo de 44 px, nas 10 páginas | **0** | entre 22 e 32 por página (links do menu e botões do desktop) |
| Páginas com rolagem horizontal | **0 de 10** | 0 de 10 |
| Menu lateral | existe, com `aria-expanded`, `aria-controls` e botão de fechar | não se aplica |

O protótipo vale, portanto, para o celular e para o desktop.

## 2. Como se confere

1. O subagente `guardiao-visual` tira o print da página nova nas mesmas larguras do gabarito.
2. Os dois vão lado a lado no PR.
3. Cada diferença visível é listada: ou é uma das adaptações da seção 3, ou precisa do aval do Gabriel.

Não se confere mais propriedade por propriedade. A tela inteira é o que a liga aprovou e é o que se compara.

## 3. O que pode ser diferente do protótipo

**Melhorias de UI e UX são bem-vindas** (decisão do Gabriel, 18/11): hierarquia, respiro, estados de interação, leitura no celular, comportamento responsivo entre as larguras. A regra é uma só: a melhoria aparece no PR lado a lado com o protótipo, com o motivo em uma linha, e entra com o aval do Gabriel. Paleta, fontes, borboletas e a estrutura de cada página não mudam.

**O site precisa ser responsivo em toda largura**, não só nas larguras dos prints. Os prints em 390 e 1280 px são o gabarito; o e2e confere também 360, 768 e 1024 px.

### Adaptações de acessibilidade já aprovadas

Estas entram sem perguntar.

| O quê | Como fica | Origem |
|---|---|---|
| Fundo do botão primário | `--color-accent-600` `#82558f` (4,84:1 com o texto creme) | ADR-0003 |
| Cor de link | `--color-accent-700` `#683f74` (6,91:1 sobre `#f5ead8`) | ADR-0003 |
| Texto secundário | `--color-neutral-700` `#645c50` (5,53:1 sobre `#f5ead8`) | ADR-0003 |
| Texto em verde | `--color-accent-2-700` `#56633f` (5,43:1 sobre `#f5ead8`) | ADR-0003 |
| Fontes | Caprasimo e Figtree servidas pelo próprio site, sem Google Fonts | ADR-0003 |
| Alvo de toque | Pelo menos 44 × 44 px; o visual pode crescer em preenchimento | Constitution |
| Campos de formulário | Fonte de 16 px, para o iPhone não dar zoom | Constitution |
| Página atual no menu | Indicada também por sublinhado, não só por cor | WCAG |

Base da paleta, do `liacup.css`: lilás da marca `#9B6AAF`, roxo escuro `#4E3260`, fundo creme `#f5ead8`, superfície `#ebddc5`. Títulos em Caprasimo, corpo em Figtree. As borboletas são o símbolo da liga.

### Estados interativos (ADR-0006, aprovado pelo Gabriel em 01/09/2026)

Todo controle mostra, quando se aplica: repouso, hover (só onde há hover), pressionado (mouse, caneta e toque), `focus-visible`, desabilitado e página atual. O retorno de hover, pressão e foco é imediato: não espera rede, navegação nem fim de animação. Foco é distinguível de hover. Controles equivalentes, como o botão e o link com aparência de botão, compartilham os mesmos estados. Nada depende de animação para ser entendido, e a redução de movimento é respeitada.

Papéis das fontes, também do ADR-0006: o protótipo governa composição, hierarquia e identidade das páginas; o `liacup.css` e o ADR-0003 governam paleta, tokens e primitivas; o `conteudo-institucional.md` governa textos e dados; conflito entre elas, decide o Gabriel.

## 4. Regras do celular

Vieram da auditoria de 14/08 e já estão no protótipo desde a rodada v3. Ficam escritas porque são o que o site precisa manter:

- cabeçalho de até 64 px, com logo, nome curto e botão de menu;
- os destinos num menu lateral que fecha ao escolher, no Esc e ao tocar fora, prende o foco e devolve o foco ao botão;
- "Processo seletivo" sempre visível, como conversão principal;
- o acesso ao painel fica no rodapé, discreto, e só existe quando houver painel (R3);
- imagens com proporção em vez de altura fixa, `100dvh` no lugar de `100vh`;
- borboleta decorativa nunca por cima de texto;
- tabela vira cartões.

## 5. O que a liga pediu e o site precisa refletir

Da revisão de 13/08, caso o protótipo não mostre algum destes pontos:

- Hero: "Cuidar é o ato mais sublime da conexão humana", com o lema "Curar às vezes, confortar sempre" logo abaixo;
- "diversas áreas do conhecimento" no lugar de "de toda área da saúde", e sem travessão nos textos de apresentação e de conteúdos educativos;
- sem a seção "No que a gente acredita";
- Equipe sem coordenadores, com docentes orientadores e foto dos ligantes;
- Galeria sem congressos, com o álbum Julho Verde;
- Contato sem "Reuniões" e "Imprensa";
- ícones de Instagram e e-mail com a logo da liga e o ícone do Gmail, não borboletas.

## 6. Correções obrigatórias sobre o protótipo

Dados que eram exemplo no protótipo e estão errados. Conferido em 18/11: o arquivo ainda traz `liacup@unb.br` e "Darcy Ribeiro" (3 ocorrências cada). O site usa o certo:

| No protótipo | O certo |
|---|---|
| `liacup@unb.br` | `liacup.unb@gmail.com` |
| Faculdade de Medicina, Campus Darcy Ribeiro | FCTS, Campus UnB Ceilândia |
| Oito cargos de diretoria | Os seis do Estatuto, Art. 11º |
| Kerolyn Ramos | Kerolyn Ramos Garcia |
| Credenciais de demonstração do login | Saem; o login real é da R3 |
