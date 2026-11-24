# Referência visual do Portal LIACUP

**Status:** aprovado pelo Gabriel junto com o plano v7, em 18/11/2026
**Data:** 18 de novembro de 2026
**Substitui:** `design-system-e-pendencias.md` (paleta antiga do Canva, já superada), `adr-0004-alvos-de-toque-e-tipografia.md`, `auditoria-mobile-v3.md`, `prompt-claude-design-v2.md`, `prompt-claude-design-v3-mobile.md` e `revisao-v2-liga.md`

---

## 1. A fonte da verdade

**O protótipo aprovado pela liga, no Claude Design.** Link: `https://claude.ai/artifact/2JaFVq33WLXjsx8bvV17xY`. Arquivo exportado recebido do Gabriel em 18/11/2026: `Protótipo do site _ Portal LIACUP.html` (1,3 MB, autocontido, roda offline).

**O design não muda.** Foi aprovado pela liga. O que recomeça é a implementação no site.

A change `prototipo-no-repositorio` põe o arquivo em `prototipo/` e, para cada uma das 11 páginas públicas, um print de página inteira em 390 px e outro em 1280 px em `prototipo/prints/`, mais o menu aberto em 390 px: 23 arquivos. A 11ª página, Processo seletivo, abre pelo botão do cabeçalho e não pelo menu; ela ficou fora dos 21 prints que o gestor gerou em 18/11, e a change a acrescenta. Esses prints são o gabarito de toda change de tela.

**A rodada mobile v3 foi aplicada no protótipo.** Medido em 18/11, renderizando o arquivo no Chrome:

| Medida | 390 px | 1280 px |
|---|---|---|
| Altura do cabeçalho | **62 px** (era 244) | 114,4 px |
| Alvos de toque abaixo de 44 px, nas 10 páginas medidas (Processo seletivo não foi medida) | **0** | entre 22 e 32 por página (links do menu e botões do desktop) |
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
| Bloco de contato: as legendas "Foto de perfil do Instagram da liga", "Perfil do Instagram" e "Logo do e-mail" | Eram só instruções do protótipo dizendo qual imagem ia em cada lugar. **Não aparecem.** No Instagram vai a logo da liga; no e-mail, o ícone do Gmail; sem legenda embaixo (decisão do Gabriel, 20/11) |
| Processo seletivo: "Inscrições abertas até 28/08", "Prova de conhecimentos", entrevista "de 15 minutos", "Aula de integração" e as datas do cronograma | Eram exemplo. O edital 02/2026 tinha duas etapas (formulário e entrevista online); desde 21/11/2026 a página mostra as cinco etapas do `conteudo-institucional.md` §5.5, por decisão do Gabriel no Portão 2 da `pagina-processo-seletivo`, sem datas. A página nasce no estado "inscrições fechadas". Texto e etapas vêm do `conteudo-institucional.md` §5; do protótipo vale só a composição |

## 7. Regras de tela decididas pelo Gabriel

O protótipo é o guia do resultado mais próximo a que se quer chegar, não a palavra final. Ajustes aparecem no caminho da construção e ficam registrados aqui (Gabriel, 20/11/2026).

| Tela | Regra | Release |
|---|---|---|
| Inicial, hero | Sem foto institucional por enquanto: o quadro do protótipo fica com uma borboleta da liga grande, em opacidade baixa, sem texto. A liga manda a foto na homologação da R1 | R1 |
| Rodapé | Endereço "FCTS · Campus UnB Ceilândia · Brasília/DF" | R1 |
| Inicial, "Próximos eventos" | **Nenhum evento futuro:** o bloco continua, com a mensagem do `conteudo-institucional.md` §2.0, sem parecer erro nem tela vazia. **Um evento:** o layout fica equilibrado com um cartão só, sem espaço sobrando. **Mais de três:** mostra os três próximos, do mais perto ao mais distante, e o "Ver agenda completa" leva aos outros | R2 |
| Inicial e Contato, bloco de contato | Logo da liga no Instagram e ícone do Gmail no e-mail, sem as legendas do protótipo (§6) | R1 |
| Inicial, Contato e rodapé, links do Instagram e do e-mail | O quadro inteiro é clicável. **Instagram:** abre `https://www.instagram.com/liacup.unb/` em outra aba; no celular com o app instalado, o próprio sistema abre o app. **E-mail:** abre um e-mail novo no aplicativo de e-mail da pessoa, com `liacup.unb@gmail.com` no "Para" (`mailto:`). O endereço e o @ continuam escritos no quadro, para leitura. Para copiar, usa-se o menu do próprio link: no e-mail, "Copiar endereço de e-mail" pelo botão direito no computador, ou tocar e segurar no celular; no Instagram, o menu copia o endereço do perfil (https://www.instagram.com/liacup.unb/). O endereço da sede, que não é link, se seleciona normalmente (Gabriel, 23/11/2026, decidido na Q8 (b) da pagina-contato). | R1 |
| Inicial, lema do hero | "Curar às vezes, confortar sempre" sai em `--color-accent-600` (`#82558f`, 4,84:1 sobre `#f5ead8`, passa de 4,5:1 em toda largura) e não no lilás da marca: no celular ele tem 20 px, não conta como texto grande, e o lilás mede 3,48:1 sobre o fundo (ADR-0003). Trocado do `--color-accent-700` pelo Gabriel em 21/11 (Q7 da `layout-e-hero`) | R1 |
| Aba do navegador | Ícone da aba com a logo da liga, nos tamanhos que os navegadores e o celular pedem, a partir das variantes que já existem em `assets/` (Gabriel, 21/11) | R1 |
| Rodapé, coluna de contato | Instagram, e-mail e endereço com ícone ao lado de cada um (Instagram, envelope e marcador de localização) e com o espaçamento do protótipo. O alvo de toque de 44 px continua, mas sem somar espaço visual entre as linhas: os três itens com passo uniforme de 44 px; o protótipo tem 31,4 px, que não cabe com o alvo de toque (Gabriel, 21/11). Ao lado do ícone do Instagram, o texto é `liacup.unb`, sem o @ (Gabriel, 21/11). Em frase corrida, sem ícone, o @ continua, como em "acompanhe a Liga no Instagram @liacup.unb" | R1 |
| Rodapé, última linha | "© 2026 LIACUP · Universidade de Brasília" centralizado, já que o texto da direita do protótipo saiu (Gabriel, 21/11) | R1 |
| Processo seletivo, títulos de seção | Títulos do protótipo: "Como funciona", "Quem pode se inscrever" e "Perguntas que sempre chegam". Sobretítulos do protótipo, com "Cronograma" trocado por "Etapas" (`conteudo-institucional.md` §5.5), porque a coluna não tem datas: "Etapas", "Requisitos" e "FAQ". São rótulos de interface, não texto do `conteudo-institucional.md` (Gabriel, 21/11, Q3 (a) da `pagina-processo-seletivo`) | R1 |
| Processo seletivo, selo da faixa do topo | "Inscrições fechadas", com as cores e o tamanho do selo do protótipo. É rótulo de interface do estado fechado, não texto do `conteudo-institucional.md` (Gabriel, 21/11, Q14 (a) da `pagina-processo-seletivo`) | R1 |
| Sobre, faixa do topo | Título principal "Sobre a LIACUP", sem sobretítulo, e a apresentação do `conteudo-institucional.md` §2.1 como parágrafo. O título "A borboleta não é enfeite" e a frase sobre a metamorfose do protótipo não vão ao ar. "Sobre a LIACUP" é rótulo de interface, não texto do `conteudo-institucional.md` (Gabriel, 22/11, Q2 (b) da `pagina-sobre-e-equipe`) | R1 |
| Equipe, faixa do topo | Sobretítulo "Equipe" e título principal "Quem faz a LIACUP", sem a frase "Gestão 2026: diretoria, ligantes e duas professoras orientadoras.". São rótulos de interface, não texto do `conteudo-institucional.md` (Gabriel, 22/11, Q2 (b) da `pagina-sobre-e-equipe`) | R1 |
| Sobre e Equipe, títulos de seção | Sobre: "Como a Liga começou" (sobretítulo "Nossa história"), "O que a Liga se propõe a fazer" ("Objetivos") e "Professores orientadores" ("Orientação"). Equipe: "Diretoria", "Fundadores discentes" (título do `conteudo-institucional.md` §4.2) e "Docentes orientadores". Títulos do protótipo; são rótulos de interface, não texto do `conteudo-institucional.md` (Gabriel, 22/11, Q4 (a) da `pagina-sobre-e-equipe`) | R1 |
| Sobre e Equipe, círculo da foto | Sem foto de pessoa. Docentes: o círculo mostra as iniciais do nome do `conteudo-institucional.md` §4.1, a primeira letra da primeira e da última palavra, sem os tratamentos ("MC" e "KG"), decorativas e com o contraste medido e nomeado (RP-09). Cargos da diretoria: sem círculo, porque não há pessoa para mostrar. Os círculos voltam quando a liga mandar nomes e fotos (Gabriel, 22/11, Q7 da `pagina-sobre-e-equipe`) | R1 |
| Projetos, faixa do topo | Sobretítulo "Projetos" e título principal "Ensino, Extensão, Pesquisa e Secretaria", os nomes das quatro frentes do `conteudo-institucional.md` §3, sem frase embaixo: a do protótipo prometia um painel que ainda não existe. Os quatro cartões trazem o texto do §3, sem as notas de fonte, sem selo "Pendente", sem caixa tracejada e sem itálico na Secretaria. "Projetos" e o título são rótulos de interface, não texto do `conteudo-institucional.md` (Gabriel, 23/11, Q2 (a) e Q5 (a) da `pagina-projetos`) | R1 |
| Rodapé, colunas de links | Acima de 768 px, os links das colunas "Portal" e "Conteúdo" têm passo uniforme de 44 px, sem vão a mais, como a coluna de contato: o protótipo tem 31,4 px, que não cabe com o alvo de toque. Até 768 px, o passo continua o do protótipo (52,8 px contra 53) (Gabriel, 22/11, Q14 (a) da `pagina-sobre-e-equipe`) | R1 |
| Contato, página | Sobretítulo "Contato" e título principal "Fale com a Liga", sem frase embaixo: a do protótipo não está no `conteudo-institucional.md`. Três quadros, nesta ordem: "Instagram", "E-mail" e "Onde estamos". Em "Onde estamos", a linha "Sede" do `conteudo-institucional.md` §1, com " — " trocado por " · " (§5): "FCTS · Campus UnB Ceilândia, QNN 14 Área Especial, Ceilândia Sul, CEP 72220-140, Brasília/DF". Sem formulário até a R4. **Melhoria aprovada sobre o protótipo:** até 1024 px, o topo e os três quadros numa coluna só; acima de 1024 px, sobretítulo e título na coluna da esquerda e os três quadros na da direita, alinhados ao topo do título. Na R4, o formulário traz de volta a composição do protótipo. "Contato", "Fale com a Liga", "Instagram", "E-mail" e "Onde estamos" são rótulos de interface, não texto do `conteudo-institucional.md` (Gabriel, 23/11, Q1 (a), Q2 (b) e Q3 (b) da `pagina-contato`) | R1 |
| Inicial, números | Logo abaixo do hero, no fundo dele, os quatro números do `conteudo-institucional.md` §9 (21, 7, 4 e 2026), em quatro cartões, com os rótulos do protótipo: "membros ativos", "cursos representados", "ações realizadas" e "ano de fundação". São rótulos de interface, não texto do `conteudo-institucional.md`. Os números moram num arquivo de dados tipado, que o painel edita na R3; o "21" vai como está no §9, e a liga confere os números na homologação. Número em `--color-accent-800` `#4e3260` sobre o cartão `--color-surface` `#ebddc5`, 8,04:1; rótulo em `--color-neutral-700` `#645c50` sobre o mesmo cartão, 4,91:1. O preenchimento lateral do cartão é 22 px, contra 24 px no protótipo, pela regra do `tokens.css` (degrau da escala de espaço a 2 px ou menos) (Gabriel, 23/11, Q1 (a) e Q11 (a) da `inicio-completo`) | R1 |
| Inicial, faixa do processo seletivo | Entre os números e o contato. Lê o mesmo arquivo de dados da página `/processo-seletivo`, para as duas nunca se contradizerem. No estado fechado: o selo "Inscrições fechadas", o título "Processo seletivo", o aviso do `conteudo-institucional.md` §5.1 com o link do Instagram e o botão "Quero participar", que leva a `/processo-seletivo`. O texto de exemplo do protótipo ("Processo seletivo 2026.2", "Inscrições até 28 de agosto", "prova de conhecimentos", "Ver o edital") não vai. **Adaptação de acessibilidade:** o cartão sai em `--color-accent-600` `#82558f`, e não no lilás `#9B6AAF`, que com o texto creme mede 3,48:1 (ADR-0003). Pares medidos no pixel contra o cartão `#82558f`: título, aviso e link em `--color-bg` `#f5ead8`, 4,84:1; o link no hover, sobre `#7a5186`, 5,26:1, e pressionado, sobre `#744d7e`, 5,68:1; o selo, texto `--color-accent-800` `#4e3260` sobre o fundo `--color-bg`, 9,05:1, e o fundo do selo contra o cartão, 4,84:1. O botão é a variante `claro` do contrato do botão, e não a primária, cujo fundo é o próprio `#82558f`: o texto `--color-accent-800` mede 9,05:1 sobre `--color-bg` em repouso, 8,51:1 sobre `--color-accent-200` no hover e 6,76:1 sobre `--color-accent-300` pressionado; o fundo do botão contra o cartão mede 4,84:1, 4,55:1 e 3,61:1. O anel de foco do botão e do link é `--color-bg` contra o cartão, 4,84:1, posto no estilo da faixa e não na variante, como na faixa do topo de `/processo-seletivo`. Como na faixa do topo, a caixa de 44 px do link do aviso é mais alta que a linha, e o anel cruza as letras das linhas vizinhas, onde fica creme sobre creme (de 98 a 193 de cerca de 600 pixels do anel, conforme a largura); aceito assim, e a correção das duas faixas fica para a `lancamento-r1` (Q12 (c)). O círculo decorativo (desenhado `#6f487f`) escurece o cartão, e o pior ponto de cada par é o cartão sem ele. "Processo seletivo" e "Quero participar" são rótulos de interface já aprovados, não texto do `conteudo-institucional.md` (Gabriel, 23/11, Q2 (a), Q3 (a), Q7 (a), Q9 (a), Q10 (a) e Q12 (c) da `inicio-completo`) | R1 |
| Inicial, bloco de contato | Sobretítulo "Contato" e título da seção "Onde a Liga responde", sem a frase do protótipo e sem o botão "Mandar uma mensagem": o formulário é da R4. Dois quadros, "Instagram" e "E-mail", os mesmos da página Contato, na apresentação "cartão" do gabarito da inicial: cartão `--color-bg` com círculo de 104 px, e o link cobrindo o cartão inteiro (regra dos links do Instagram e do e-mail, acima). A apresentação "cartão" não muda nada em `/contato`. O rótulo do quadro sai em `--color-neutral-700` `#645c50`, e não no `--color-neutral-600` do protótipo, que mede 3,61:1: 5,53:1 sobre o cartão `#f5ead8`, 4,97:1 no hover, sobre `#ecddd4`, e 4,56:1 pressionado, no pior caso, sobre `#e4d3d0` (4,57:1 sobre `#e5d3d1`, que a suavização dá em outras larguras e que o comentário do CSS cita). O vão entre o círculo e o texto do cartão é 22 px, contra 20 px no protótipo, pela regra do `tokens.css` (degrau da escala de espaço a 2 px ou menos). "Onde a Liga responde" é rótulo de interface, não texto do `conteudo-institucional.md` (Gabriel, 23/11, Q4 (a), Q5 (a), Q6 (a) e Q11 (a) da `inicio-completo`) | R1 |
