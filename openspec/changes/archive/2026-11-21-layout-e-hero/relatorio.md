# Relatório — layout-e-hero

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** `openspec/changes/layout-e-hero/proposal.md`, `design.md`, `tasks.md`,
  `specs/navegacao-publica/spec.md` (nova, 5 requisitos, 20 cenários),
  `specs/pagina-inicial/spec.md` (nova, 1 requisito, 5 cenários) e `specs/fundacao-e-ci/spec.md`
  (REMOVED "Página provisória no ar" e ADDED "Página provisória enquanto o site não está
  publicado", 5 cenários) · **7 requisitos ADDED e 1 REMOVED, 30 cenários** · **15 tarefas**, sem
  folga
- **Ajuste do líder técnico, 1ª rodada:** `openspec validate --strict` recusou o MODIFIED, porque
  ele largava o cenário "A raiz com o site publicado, antes da página inicial". O requisito passou a
  REMOVED mais ADDED com nome novo, e o conteúdo não mudou. A Q2 foi refeita sobre os seis esboços
  de `prints/`, e a recomendação passou de (a) para (b), com o motivo no `design.md`
- **Ajuste do Portão 1, 20/11:** as decisões entraram na `proposal.md`, no `design.md` (D5, D6,
  fontes do texto e "Open Questions"), nas specs e nas tarefas 1.6, 1.7 e 2.1. Também entraram as
  regras da `REFERENCIA-VISUAL.md` §7 que valem nesta change:
  - os links do Instagram e do e-mail do rodapé são clicáveis por inteiro, com nova aba e
    `noopener noreferrer` no Instagram e `mailto:` no e-mail. Viraram um cenário novo em
    `navegacao-publica`;
  - o lema sai em `--color-accent-700`. O cenário do lema em `pagina-inicial` passou a exigir
    4,5:1 em toda largura.

  A nota da emenda antes da tarefa 1.7 saiu, porque o gestor já fez a emenda (§2.0). Continuam 15
  tarefas: nenhuma nova, só itens de verificação a mais nas três
- **Cabe numa change.** Se uma correção posterior acrescentar tarefa, a divisão pronta é:
  `layout-publico` (lista, cabeçalho, menu, rodapé, raiz publicada, verificações: tarefas 1.1 a
  1.6 e 2.1 a 3.3) e `hero-da-inicial` (tarefa 1.7 e o lado a lado do hero)
- **Desvios do briefing:**
  - o cenário "A raiz com o site publicado, antes da página inicial" mora em `fundacao-e-ci`, não
    em `publicacao-do-site`; a `publicacao-do-site` não muda (D2);
  - achado meu: o cenário "Visitante abre o endereço do portal" também precisa mudar, porque
    afirma "Portal em construção" na raiz sem dizer o modo (D2);
  - o "Painel da diretoria" do rodapé do protótipo também sai, além do "Painel" do cabeçalho
    (`REFERENCIA-VISUAL.md` §4);
  - "Processo seletivo sempre visível" (`REFERENCIA-VISUAL.md` §4) cede ao princípio 8 da
    constitution até a change 2;
  - a conferência de domínio externo passa a cobrir a raiz não publicada, que só a tinha porque a
    3000 mostrava a mesma página (D7, item 5);
  - o ano do rodapé é o da compilação, e não "2026" escrito (D5); se o Gabriel preferir o número
    fixo, é trocar uma linha
- **Para o gestor:** a tabela da R0 no PLANO §7 ainda dá à `ajustar-ci-ao-novo-fluxo` a "cobertura
  de e2e e Lighthouse derivada da lista de páginas", que esta change faz
- **Questões em aberto:** nenhuma. Decididas pelo Gabriel em 20/11, literal: "Portão 1 aprovado.
  Decisões do Gabriel: Q1 (a), Q2 (b), Q3 (b)."
  - Q1 (a): o texto do hero vem do `conteudo-institucional.md` §2.0;
  - Q2 (b): o quadro com uma borboleta da liga, decorativo;
  - Q3 (b): "FCTS · Campus UnB Ceilândia · Brasília/DF".
- **Incompleto:**
  - não li os arquivos da tag `arquivo/F03-layout-base`, só os cito;
  - não medi o ponto de troca do cabeçalho no protótipo; fica para a tarefa 1.4. O contraste do
    lema não depende mais de medição: a `REFERENCIA-VISUAL.md` §7 manda `--color-accent-700`,
    6,91:1 sobre `#f5ead8` pelo ADR-0003, e a tarefa 1.7 confere a cor aplicada;
  - a altura de cerca de 265 px do quadro em 390 px, citada na Q2, foi lida no esboço, não medida;
  - não rodei `openspec validate`, porque não rodo comando.

## dev-frontend

Tarefas 1.2 a 1.7 e 2.4.

- **Arquivos (A 22 · M 4 · D 1):**
  - lista: `src/lib/utils/paginas-publicas.{json,ts,test.ts}`;
  - moldura, em `src/componentes/layout/`: `Cabecalho`, `MenuLateral`, `RodapePublico` (cada um com o seu `.module.css`), `LinkDaNavegacao`, `usePainelDeNavegacao.ts` e `aparencia-de-botao.ts` com `AparenciaDeBotao.module.css`;
  - rotas: grupo novo `src/app/(site)/(publicas)/` com `layout.tsx`, `page.tsx` e `_inicio/` (`HeroDaInicial` e `BorboletaDaLiga`, cada um com o seu CSS). O hero mora em `app` porque é composição de uma página só. `src/app/(site)/page.tsx` foi apagado, e `/em-construcao` ficou fora do grupo (D1);
  - `scripts/iniciar-servidor.mjs`, novo, e `lighthouserc.publicado.js` e `lighthouserc.nao-publicado.js`, novos e depois substituídos na rodada 3 pelo `scripts/medir-desempenho.mjs`. O `lighthouserc.json` não mudou;
  - modificados: `tokens.css` (111 linhas acrescentadas, 0 removidas), `package.json` (só o `test:desempenho`) e `README.md` (só a seção "Como acrescentar uma página ao menu").
- **Tokens novos: 80**, cada um com a origem no comentário da própria linha. Quase todos vêm do protótipo (estilo do elemento, `.hdr-*`, `.t-h1`, `.drw`, `.washed`, `<symbol id="borboleta">`, `.bf-1` e `.bf-2`). As exceções:
  - `--color-borboleta-asa-de-tras` `#7a4a8c`, que não tem par na rampa;
  - `--opacidade-borboleta-do-quadro` 0,55 e `--largura-borboleta-do-quadro` 38%, medidos no esboço `qn-foto-b` da Q2;
  - onde o protótipo usa um valor a até 2 px de um degrau `--space-*`, usei o degrau (o bloco de tokens diz isso).
- **Comandos:**

  | Comando | Código | Contadores |
  | --- | --- | --- |
  | `npm run verificar` | 0 | 316 arquivos rastreados, 0 artefatos indevidos · tokens: 78 arquivos, 0 problemas · chave: 225 arquivos, 0 ocorrências |
  | `npm test` | 0 | 11 arquivos, 88 testes, 0 falhas · `Entradas da lista de páginas públicas conferidas: 1` |
  | `npm run build` | 0 | 4 rotas estáticas (`/`, `/_not-found`, `/em-construcao`, `/vitrine`) |
  | `npm run test:desempenho` | 0 | publicado: 1 página, desempenho 100 e acessibilidade 100 nas 3 execuções, com o hero · não publicado: 1 página, 100 e 100, com "Portal em construção" |
  | `npx playwright test` | 1 | 133 passaram, 14 falharam: as duas conferências do `pagina-inicial.spec.ts` antigo, nas 7 larguras, que esperam "Portal em construção" na raiz publicada. Quem reescreve esse spec é o qa, na 2.3. `interruptor.spec.ts`: verde |
  | `git diff --exit-code` em `src/proxy.ts`, `PaginaEmConstrucao*`, `Rodape.tsx`, `Rodape.module.css`, `LinksDeContato*`, `lighthouserc.json`, `.github/` e `package-lock.json` | 0 | 22 dependências diretas |

- **`curl`, nos dois modos:**
  - 1.3: a 3000 responde 200, com o título do hero 1 vez e "Portal em construção" 0. A 3001 tem "Portal em construção" 1 vez e 0 `<header>`.
  - 1.6: na 3000 aparecem `liacup.unb@gmail.com`, `@liacup.unb` e "FCTS · Campus UnB Ceilândia · Brasília/DF". O Instagram é `<a href="https://www.instagram.com/liacup.unb/" target="_blank" rel="noopener noreferrer">`, e o e-mail é `<a href="mailto:liacup.unb@gmail.com">`. `liacup@unb.br`, "Darcy Ribeiro", "Painel" e "Protótipo do Portal" dão 0 nos dois modos.
  - 1.7: "Foto institucional" dá 0 nos dois modos.
- **Nomes acessíveis (texto meu):**
  - "Instagram da LIACUP, @liacup.unb (abre em nova aba)";
  - "Escrever um e-mail para liacup.unb@gmail.com".
- **Ponto de troca do cabeçalho (1.4):** medido no protótipo, o botão de menu aparece em 1024 px e some em 1025 px (`@media (max-width: 1024px)`). Usei o mesmo corte, `max-width: 1024px`. Componentes `.tsx` entre 43 e 92 linhas (medido de novo na rodada 3: entre 43 e 92, com o `Cabecalho.tsx` em 79). Os CSS do `Cabecalho` (162), do `MenuLateral` (187) e do `HeroDaInicial` (179) passam de 150, medidos com `wc -l` na rodada 3; o limite é de componente, e fica para o revisor decidir se vale também para CSS.
- **Menu em 390 px (1.5):** conferi com Chromium conduzido por script, não por uma pessoa.
  1. Abre com "Navegação" e 1 destino, e o botão passa a `aria-expanded=true`; o botão de fechar fecha, e o botão volta a `false`.
  2. Esc fecha, e o foco volta ao botão de menu.
  3. Toque no fundo escurecido fecha, com o foco de volta. Toque dentro do menu, em área vazia, não fecha.
  4. Escolher "Início" fecha e mostra a inicial.
  5. Tab ×5 e Shift+Tab ×5 ficam sempre dentro do menu.
  6. Em 1280 px não há botão, e há 1 link em linha com `aria-current=page`.

  A rolagem da página trava com o menu aberto e destrava ao fechar.
- **Hero contra o §2.0 (1.7):** título 9/9 palavras, lema 5/5 e apresentação 34/34, sem nenhuma diferença.
  - Lema: `rgb(104, 63, 116)` (`--color-accent-700`), 20 px em 390 px, 6,91:1 sobre `#f5ead8`.
  - Quadro: `aria-hidden="true"`, 0 caracteres de texto, 1 SVG.
  - Na minha conferência rápida, nas 7 larguras: axe 0, sobra horizontal 0, 5 alvos medidos e 0 abaixo de 44 px, 0 borboletas sobre texto.
- **Melhorias propostas (para o Gabriel aprovar):**
  - um link "Pular para o conteúdo", para quem navega por teclado. Não pus porque o texto não está em nenhuma fonte;
  - mover a `BorboletaDaLiga` para `src/componentes/ui/` quando a Sobre usar, porque `ui/` está fora do meu escopo nesta change.
- **Desvios:**
  - duas ilhas cliente, e não uma: o `MenuLateral` e o `LinkDaNavegacao`, que é o menor componente que lê o endereço para marcar a página atual nos links em linha;
  - (substituído na rodada 3) as configurações do Lighthouse são `.js`, e não `.cjs`: o `eslint.config.mjs` aplica a regra `jsx-a11y` a `.cjs` sem o plugin e quebra o lint. Não mexi no lint. Elas leem os JSON com `process.getBuiltinModule('node:fs')`, porque o lint recusa `require()`.
- **Incompleto:**
  - o menu não foi conferido à mão por uma pessoa (foi por script);
  - não medi o hero com animação ligada além da pose de repouso;
  - o `pagina-inicial.spec.ts` continua vermelho até a tarefa 2.3.

### Rodada 2: correções pedidas pelo guardiao-visual

- **Arquivos (só M):**
  - `src/componentes/layout/MenuLateral.module.css`: os botões de menu e de fechar passam a `font-family: var(--font-heading)` e `font-weight: var(--font-heading-weight)`, como o `.btn` do protótipo. O "×" sai em Caprasimo (defeito do guardião);
  - `src/app/(site)/(publicas)/_inicio/HeroDaInicial.module.css`: a borboleta do quadro ganha `transform: rotate(var(--voo-giro-repouso))`, a pose de repouso de -8° do protótipo e do esboço `qn-foto-b`. Usei o token que já existia; nenhum token novo.
- **Conferido no navegador, em 390 px:** o botão de fechar tem `font-family` "Caprasimo, "Caprasimo Fallback", system-ui, sans-serif", e a borboleta do quadro está em `matrix(0.990268, -0.139173, …)`, que dá -8,0°.
- **Comandos:**

  | Comando | Código | Contadores |
  | --- | --- | --- |
  | `npm run verificar` | 0 | tokens: 78 arquivos, 0 problemas · 0 artefatos indevidos · chave: 210 arquivos, 0 ocorrências |
  | `npm test` | 0 | 11 arquivos, 88 testes, 0 falhas · `Entradas da lista de páginas públicas conferidas: 1` |
  | `npm run build` | 0 | — |
  | `npx playwright test` | 0 | 210 passaram, 42 pulados, 0 falhas |

- **Observação:** a primeira execução do `verificar` saiu com código 1 no `formatar:check`. Os dois CSS tinham sido gravados com fim de linha CRLF. Rodei o Prettier neles, e a segunda execução saiu com código 0.
- **Incompleto:** nada desta rodada.

### Rodada 3: correções pedidas pelo revisor

- **Arquivos:**
  - **M** `src/estilos/tokens.css`: `--sombra-linha-do-cabecalho` passa a `0 var(--largura-borda) 0 var(--color-divider)`, sem o 1px escrito à mão. Entra o token novo `--deslocamento-sublinhado-atual: 4px`, com a origem medida: no protótipo, a barra da página atual começa 9,4 px abaixo da linha de base do texto. No Chromium, 4px põe a barra a 9 px e 4,5px a 10 px. O diff do arquivo continua só de acréscimos: 114 linhas acrescentadas, 0 removidas;
  - **M** `src/componentes/layout/Cabecalho.module.css`: usa `var(--deslocamento-sublinhado-atual)` no lugar de `calc(var(--underline-offset) * 2)`;
  - **M** `src/componentes/layout/Cabecalho.tsx`: o link da marca tem o nome acessível **"LIACUP, página inicial"**. O nome começa pelo texto visível, por causa do controle por voz, e diz o destino;
  - **A** `scripts/medir-desempenho.mjs`, que substitui os dois `lighthouserc.*.js` (**D**). O `test:desempenho` passa a `node scripts/medir-desempenho.mjs`.
- **Por que um runner:** o `getBuiltinModule` exige Node 22.3, e o projeto aceita `>=22`. Um `.mjs` usa `import` e `fs`, que funcionam em todo Node 22 sem exceção de lint. Ele:
  - lê a lista;
  - chama o `lhci autorun --config=lighthouserc.json` uma vez por modo, com `--collect.url` e `--collect.startServerCommand` por argumento;
  - roda sem shell, então o argumento com espaço vai inteiro em qualquer terminal;
  - imprime as páginas e as notas de cada execução, lidas do `manifest.json`, que é apagado antes de cada modo para nunca mostrar nota velha.

  Limiar, preset e execuções continuam no `lighthouserc.json`, que não mudou. Também não mudaram `engines`, `package-lock.json`, `.github/` nem o `AparenciaDeBotao`. Desvio de escopo: o D9 previa um script só em `scripts/`, e agora são dois, `iniciar-servidor.mjs` e `medir-desempenho.mjs`, como o líder técnico sugeriu.
- **Comandos:**

  | Comando | Código | Contadores |
  | --- | --- | --- |
  | `npm run verificar` | 0 | tokens: 78 arquivos, 0 problemas · 0 artefatos indevidos · chave: 215 arquivos, 0 ocorrências |
  | `npm test` | 0 | 11 arquivos, 88 testes, 0 falhas · `Entradas da lista de páginas públicas conferidas: 1` |
  | `npm run build` | 0 | — |
  | `npm run test:desempenho` | 0 | publicado: `páginas medidas: 1`, desempenho 100 e acessibilidade 100 nas 3 execuções, com o servidor iniciado em `publicado` · não publicado: `páginas medidas: 1`, 100 e 100 nas 3, com o servidor iniciado em `nao-publicado` |
  | `npx playwright test` | 0 | 210 passaram, 42 pulados, 0 falhas |

- **Conferido no HTML compilado:** `<a … aria-label="LIACUP, página inicial" href="/">`. No CSS compilado, `--deslocamento-sublinhado-atual:4px` e `--sombra-linha-do-cabecalho:0 var(--largura-borda) 0 var(--color-divider)`.
- **Servidores:** todos parados.
- **Incompleto:** nada desta rodada.

### Rodada 4: ajustes de tela do Gabriel, 21/11/2026

- **Arquivos:**
  - **A** `public/`, cópias exatas, sem redimensionar (sha256 da cópia igual ao do original):
    `icone-da-aba-32.png` de `assets/logo-liacup-32.png` (`74f17fce…ea32`), `icone-da-aba-48.png`
    de `-48` (`ce16ce1b…edfe`), `icone-da-aba-96.png` de `-96` (`d1d96a3c…09e9`) e
    `icone-da-tela-de-inicio-180.png` de `-180` (`087f0630…f6c3`). `public/` fica fora de `src/`,
    e foi pedido no briefing;
  - **M** `src/app/(site)/(publicas)/layout.tsx`: `metadata.icons` com 3 `icon` (32, 48 e 96) e 1
    `apple` (180). Nada no `src/app/` raiz nem arquivo de convenção do Next;
  - **A** `src/componentes/layout/IconeDeLocalizacao.{tsx,module.css}` (27 e 9 linhas): o marcador,
    que o `ui/Icone` não tem. Instagram e envelope vêm do `ui/Icone`;
  - **M** `RodapePublico.tsx` (102 linhas): ícone decorativo em cada item de contato, texto do
    Instagram "liacup.unb", sem o @; **M** `RodapePublico.module.css`: contato com `gap: 0`, o
    endereço sem `min-height`, a linha final centralizada;
  - **M** `AparenciaDeBotao.module.css`: só o comentário, pela Q4 (c).
- **Tokens novos: 0.** O ícone herda a cor do texto, `--color-accent-200`, e o tamanho e o traço
  são `--tamanho-icone` e `--espessura-icone`.
- **Distância entre as linhas da coluna de contato** (Chromium, de topo a topo do texto; entre
  parênteses, o vão entre os textos). Os números são iguais em 390 e 1280 px:

  | | Instagram → e-mail | e-mail → endereço |
  | --- | --- | --- |
  | protótipo (`<span>` sem alvo, `gap: 9px`) | 31,4 px (9 px) | 31,4 px (9 px) |
  | site | **44 px** (22,3 px) | 32,8 px (11,2 px) |

  O protótipo dá menos de 44, então os dois links ficam a 44 px exatos: caixas de 92,7×44 e
  170,6×44, coladas, com 0 px de sobreposição. O endereço não é alvo, e começa logo depois do alvo
  do e-mail. Em 1280 px o endereço quebra em 2 linhas (43,4 px), e o ícone fica na primeira.
- **Nome acessível:** "Instagram da LIACUP, @liacup.unb (abre em nova aba)" contém o texto visível
  "liacup.unb" (WCAG 2.5.3). Href, `target` e `rel` não mudaram.
- **Conferido:** na 3100 publicada há 4 `<link>` de ícone e os 4 PNG respondem 200 `image/png`. Na
  3101 não publicada, a raiz tem 0 `<link>` de ícone e 1 "Portal em construção". Linha final: 62,4
  px de cada lado em 390 e 485 px em 1280.
- **Comandos:**

  | Comando | Código | Contadores |
  | --- | --- | --- |
  | `npm run verificar` | 0 | 316 rastreados, 0 artefatos indevidos · tokens: 80 arquivos, 0 problemas · chave: 442 arquivos, 0 ocorrências |
  | `npm test` | 0 | 11 arquivos, 88 testes, 0 falhas |
  | `npm run build` | 0 | 4 rotas (`/`, `/_not-found`, `/em-construcao`, `/vitrine`) |
  | `npm run test:desempenho` | 0 | publicado: 1 página, desempenho 99, 97, 97 e acessibilidade 100 nas 3 · não publicado: 1 página, 97 nas 3 e acessibilidade 100. **Não valem:** veja abaixo |
  | `npx playwright test` | 1 | 209 passaram, 15 falharam, 42 pulados. **Não vale:** veja abaixo |

- **Por que as duas últimas medidas não valem:** a porta 3000 já estava ocupada por um `next dev`
  (PID 26092, iniciado às 02:10, antes desta rodada; não fui eu que o subi, e não o derrubei). O
  Playwright o reaproveitou (`reuseExistingServer`), e o Lighthouse também mede a 3000.
  - 7 falhas são do pedido desta rodada: `paginas-publicas.spec.ts:42` espera "@liacup.unb" escrito
    no rodapé, e agora o texto é "liacup.unb" (7 larguras, teste da linha 360). Quem ajusta é o qa.
  - 8 falhas são do servidor de desenvolvimento: o teste de foco (linha 672, 7 larguras) passa o
    mouse sobre o `<nextjs-portal>` do overlay do `next dev`, e o `menu-por-teclado` 6 estoura o
    tempo.
- **Proposta:** nenhuma.
- **Incompleto:** `npx playwright test` e `npm run test:desempenho` contra a versão compilada,
  com a 3000 livre. Os tamanhos 192 e 512, do Android, só fazem sentido com o manifesto web: 192
  não existe em `assets/`, e 512 existe, mas não entrou. O 16 px também não existe, e o navegador
  reduz o 32.

### Rodada 5: passo uniforme de 44 px no contato do rodapé (Gabriel, 21/11/2026)

- **Arquivo:** **M** `src/componentes/layout/RodapePublico.module.css`. O `.endereco` passa a ter
  `min-height: var(--alvo-de-toque)` e `align-items: center`, como os dois links. Continua `<span>`,
  não link. **Tokens novos: 0.**
- **Distâncias** (Chromium, protótipo com 31,4 px de topo a topo e vão de 9 px nas duas
  distâncias, nas duas larguras):

  | Site | Instagram → e-mail | e-mail → endereço |
  | --- | --- | --- |
  | 390, caixa de topo a topo | 44 px, sobreposição 0 | 44 px, sobreposição 0 |
  | 390, texto de topo a topo | 44 px | 44 px |
  | 1280, caixa de topo a topo | 44 px, sobreposição 0 | 44 px, sobreposição 0 |
  | 1280, texto de topo a topo | 44 px | 33,2 px |

  Em 1280 px o endereço quebra em 2 linhas (43,4 px de texto, dentro da caixa de 44). Centrado,
  o topo do texto fica a 33,2 px do e-mail, e o centro do texto fica a 44 px do centro do e-mail.
  As três caixas medem 44 px de altura nas duas larguras.
- **Comandos** (a 3000 estava livre: 0 servidores na 3000 e na 3001 antes de cada um):

  | Comando | Código | Contadores |
  | --- | --- | --- |
  | `npm run verificar` | 0 | 316 rastreados, 0 artefatos indevidos · tokens: 80 arquivos, 0 problemas · chave: 448 arquivos, 0 ocorrências |
  | `npm test` | 0 | 11 arquivos, 88 testes, 0 falhas |
  | `npm run build` | 0 | 4 rotas (`/`, `/_not-found`, `/em-construcao`, `/vitrine`) |
  | `npm run test:desempenho` | 0 | publicado: 1 página, desempenho 100 e acessibilidade 100 nas 3 execuções · não publicado: 1 página, 100 e 100 nas 3 |
  | `npx playwright test` | 1 | 217 passaram, 7 falharam, 42 pulados |

- **As 7 falhas** são todas o mesmo teste, `paginas-publicas.spec.ts:360`, em cada uma das 7
  larguras: `Instagram: texto escrito "liacup.unb", e não "@liacup.unb" visível`. É o texto
  pedido na rodada 4, e quem ajusta o teste (linha 42) é o qa. As 8 falhas da rodada 4 que vinham
  do `next dev` sumiram.
- **Servidores:** todos parados (0 ouvindo na 3000, 3001 e 3100).
- **Incompleto:** nada desta rodada.

### Rodada 5b: primeira linha do endereço no passo de 44 px

- **Arquivo:** **M** `src/componentes/layout/RodapePublico.module.css`. O `.endereco` volta a
  `align-items: flex-start`, mantém `min-height: var(--alvo-de-toque)` e ganha `padding-block`
  igual à sobra do alvo depois de uma linha, dividida ao meio:
  `calc((var(--alvo-de-toque) - var(--line-height-body) * var(--font-size-navegacao)) / 2)`. O
  ícone ganha `margin-top` de `(linha - var(--tamanho-icone)) / 2`. Quando o texto quebra, a caixa
  cresce para baixo. **Tokens novos: 0.**
- **Medido** (Chromium, de topo a topo do texto):

  | Largura | Instagram → e-mail | e-mail → 1ª linha do endereço |
  | --- | --- | --- |
  | 390 | 44 px | 44 px |
  | 1280 | 44 px | 44 px |

  Nos três itens, nas duas larguras, o texto começa 11,1 a 11,2 px abaixo do topo da caixa, e o
  ícone 0,84 px abaixo do topo do texto. Caixas: 44 px, menos o endereço em 1280 px, que tem 65,7
  px (2 linhas). Sobreposição entre caixas: 0 px.
- **Comandos:**

  | Comando | Código | Contadores |
  | --- | --- | --- |
  | `npm run verificar` | 0 | 316 rastreados, 0 artefatos indevidos · tokens: 80 arquivos, 0 problemas · chave: 458 arquivos, 0 ocorrências |
  | `npm run build` | 0 | 4 rotas |
  | `npx playwright test` | 1 | 217 passaram, 7 falharam, 42 pulados. As 7 são o `paginas-publicas.spec.ts:360` nas 7 larguras, que espera "@liacup.unb" escrito; ajuste do qa |

- **Servidores:** todos parados.
- **Incompleto:** nada desta rodada.

### Rodada 6 (última): Q6 (a) e Q7 do Gabriel, 21/11/2026

- **Arquivos (só M):**
  - `src/componentes/layout/Cabecalho.tsx`: o rótulo dos links em linha fica num
    `<span className={estilos.rotuloDoDestino}>`;
  - `src/componentes/layout/Cabecalho.module.css`: a barra da página atual deixa de ser
    `text-decoration`, que não faz ponta redonda, e passa a `::after` do rótulo, da largura dele,
    como o `<span>` do protótipo: `border-top: var(--espessura-sublinhado-atual) solid
    var(--color-accent)`, `border-radius: var(--radius-pill)` e
    `top: calc(100% + var(--deslocamento-sublinhado-atual))`. Uso borda, e não fundo, para a barra
    continuar no modo de alto contraste. O menu lateral não mudou;
  - `src/estilos/tokens.css`: `--deslocamento-sublinhado-atual` passa de 4px a 3px, com a origem
    nova no comentário. O token é desta change: o diff contra a main continua 115 linhas
    acrescentadas e 0 removidas. **Tokens novos: 0;**
  - `src/app/(site)/(publicas)/_inicio/HeroDaInicial.module.css`: o lema em `--color-accent-600`,
    com o comentário da cor e do motivo atualizado (Q7).
- **Barra, medida em pixels** no recorte do link "Início" em 1280 px, escala 1. Medi da primeira
  linha da barra menos a última linha com tinta das letras, o mesmo método do guardião:

  | | Tinta → barra | Espessura | Largura | Raio |
  | --- | --- | --- | --- | --- |
  | print `inicio-1280.png` | **10 px** | 3 px | 32 px | 999px |
  | site com 4px (antes) | 11 px | 3 px | 32 px | — |
  | site com 3px (agora) | **10 px** | 3 px | 32 px | 999px (`--radius-pill`) |

  O protótipo aberto no Chromium dá os mesmos números do print. Cor da barra: `rgb(155, 106, 175)`,
  `--color-accent`, 3,48:1 sobre `#f5ead8`.
- **Lema:** `rgb(130, 85, 143)`, `--color-accent-600` `#82558f`, 4,84:1 sobre `--color-bg`
  `#f5ead8`.
- **Comandos:**

  | Comando | Código | Contadores |
  | --- | --- | --- |
  | `npm run verificar` | 0 | 316 rastreados, 0 artefatos indevidos · tokens: 80 arquivos, 0 problemas · chave: 443 arquivos, 0 ocorrências |
  | `npm test` | 0 | 11 arquivos, 88 testes, 0 falhas |
  | `npm run build` | 0 | 4 rotas |
  | `npx playwright test` | 1 | 237 passaram, 8 falharam, 0 pulados |

- **As 8 falhas**, as duas consequência desta rodada, e o ajuste é do qa:
  - 7 × `pagina-inicial.spec.ts:259`, uma por largura: `o lema não está em --color-accent-700`.
    O contraste não falhou;
  - 1 × `menu-por-teclado.spec.ts:291` (`largura-360`): `a página atual não está sublinhada`. O
    teste lê `text-decoration-line` do link, e a barra agora é o `::after` do rótulo.
  - As 7 do "@liacup.unb" não aparecem mais.
- **Servidores:** todos parados.
- **Incompleto:** a ponta redonda foi conferida pelo `border-radius` calculado, igual ao do
  protótipo. Na barra de 3 px, a curva não se mede em pixels.

## dev-dados

- **Migrações:** `<números>` · **tabelas:** `<nomes>`
- **Acesso por linha:** `banco:rls` <código> · políticas: <n permissões, n recusas>
- **Tipos:** `banco:tipos:check` <código>
- **Incompleto:** <o que, ou "nada">

## guardiao-visual

Tarefa 3.1. Site compilado (`npm run build`, código 0) e servido com
`node scripts/iniciar-servidor.mjs publicado 3100` e `nao-publicado 3101`; Chromium do Playwright,
escala 1, 390 × 844 e 1280 × 800, mesmo método da 1.1.

- **Comparado:** 1 página (Início: cabeçalho, hero, rodapé) × 390 e 1280 px, mais o menu aberto em
  390 px, contra `prototipo/prints/inicio-{390,1280}.png` e `menu-aberto-390.png`, recortados por
  região · lado a lado em `prints/lado-a-lado-{cabecalho-hero,rodape}-{390,1280}.png` e
  `prints/lado-a-lado-menu-aberto-390.png`
- **Página em construção:** `prints/depois-raiz-nao-publicada-{390,1280}.png` contra os `antes-*`:
  sha256 iguais (`063180ac…09e4` em 390, `8499a677…c5f7` em 1280); **0 de 329.160 e 0 de
  1.024.000 pixels diferentes**
- **Diferenças: 17** — 6 adaptação aprovada (4 do §3, 2 do §6) · 3 decisão já tomada · 7 página
  ainda não existe · 0 melhoria a aprovar · **1 defeito**
- **Cada diferença, uma linha:**
  1. cabeçalho 1280 · 125,2 px de altura contra 114,4 (+10,8): os destinos têm 44 px e não 30,4;
     o resto da medida é igual · adaptação aprovada (§3, alvo de toque)
  2. cabeçalho 390 e 1280 · sem o botão "Processo seletivo" · página ainda não existe (princípio 8)
  3. cabeçalho 1280 · sem o botão "Painel" · página ainda não existe (§4, R3)
  4. cabeçalho 1280 · 1 destino ("Início") e não 10 · página ainda não existe
  5. botões de menu e de fechar · borda `--color-neutral-600` opaca, mais escura que a do
     protótipo · adaptação aprovada (ADR-0003, adendo da borda do botão secundário; o §3 dá ao
     ADR-0003 as primitivas, mas a tabela do §3 não lista esta linha)
  6. hero 390 e 1280 · sem "Quero participar" e "Conheça a Liga"; com a coluna mais curta, texto
     e quadro se recentralizam (sobretítulo 20,8 px abaixo e quadro 17,1 px acima em 1280) ·
     página ainda não existe
  7. hero, quadro · borboleta da liga grande e clara no lugar do ícone com a legenda, sem a borda
     tracejada · decisão já tomada (Q2 (b)); a borboleta está reta, e no esboço `qn-foto-b` vinha
     inclinada
  8. hero, lema · `rgb(104, 63, 116)` e não o lilás `rgb(155, 106, 175)` · decisão já tomada (§7)
  9. menu aberto · 1 destino e sem o botão "Processo seletivo" no fim · página ainda não existe
  10. menu aberto · página atual com sublinhado, além da barra · adaptação aprovada (§3)
  11. menu aberto · o "×" do botão de fechar sai em Figtree, fino; no protótipo é Caprasimo,
      grosso (`MenuLateral.module.css`, `font-family: var(--font-body)`), sem motivo registrado
      no design · **defeito**
  12. rodapé · coluna "Portal" só com "Início" e coluna "Conteúdo" ausente; em 1280 fica o vão
      dela entre "Portal" e "Contato" · página ainda não existe
  13. rodapé · `liacup.unb@gmail.com` e "FCTS · Campus UnB Ceilândia · Brasília/DF" · adaptação
      aprovada (§6, Q3 (b))
  14. rodapé 1280 · o endereço novo, mais longo, quebra em duas linhas na coluna de 234,8 px ·
      adaptação aprovada (consequência do §6 e da Q3 (b))
  15. rodapé · links com 44 px de altura, e mais espaço entre "Início" e entre os contatos ·
      adaptação aprovada (§3, alvo de toque; §7)
  16. rodapé · sem "Protótipo do Portal LIACUP · conteúdo de demonstração" · decisão já tomada
      (proposta aprovada no Portão 1)
  17. rodapé 390 · sem o botão "Painel da diretoria" · página ainda não existe (§4, R3)
- **Diferenças sem efeito visível, não contadas:** 0,4 a 1,6 px no padding lateral e na posição
  do logo (degraus `--space-*`); altura de linha do sobretítulo 18,6 contra 19,2 px
- **Não comparado:** os blocos da inicial que esta change não traz (números, agenda, notícias,
  conteúdo, faixa do processo seletivo, contato), porque estão fora do escopo. O menu aberto do
  gabarito foi tirado na página Contato, e o do site na Início: a página atual difere por isso.
  Borboletas que voam foram comparadas paradas no atraso, não em voo
- **Rodada 2:** `npm run build` código 0, `iniciar-servidor.mjs publicado 3100`, mesmo método e
  mesmos recortes. Refeitos `lado-a-lado-cabecalho-hero-{390,1280}.png` e
  `lado-a-lado-menu-aberto-390.png`. O "×" sai em `Caprasimo, "Caprasimo Fallback", system-ui,
  sans-serif`, peso 400, 22 px, igual ao protótipo (`Caprasimo`, 400, 22 px): item 11 resolvido. A
  borboleta do quadro está em `matrix(0.990268, -0.139173, …)` = **-8,00°** em 390 e 1280, como no
  `qn-foto-b`: item 7 fica como decisão já tomada, sem a ressalva. Contra a rodada 1, os pixels
  diferentes ficam só dentro dessas duas caixas (3.358 em 390, 7.246 em 1280, 78 no menu), e o lado
  do protótipo não mudou. **Diferenças: 16** — 6 adaptação aprovada · 3 decisão já tomada · 7
  página ainda não existe · 0 melhoria a aprovar · **0 defeito** · 0 diferença nova
- **Rodada 3:** `npm run build` código 0, `publicado 3100` e `nao-publicado 3101`, mesmo método e
  mesmos recortes (os três refeitos reconstroem os arquivos antigos com 0 pixel diferente).
  Refeitos `lado-a-lado-rodape-{390,1280}.png`, `lado-a-lado-cabecalho-hero-1280.png` e
  `depois-raiz-nao-publicada-{390,1280}.png`. **Rodapé, 10 diferenças:** (1) "Portal" só com
  "Início" e sem "Conteúdo" · página ainda não existe; (2) 390 sem "Painel da diretoria" · página
  ainda não existe; (3) e-mail e endereço certos · adaptação aprovada (§6); (4) 1280, endereço em 2
  linhas · adaptação aprovada (§6, Q3 (b)); (5) título da coluna até o 1º item, 40,8 px contra 30,4
  · adaptação aprovada (§3, alvo de toque); (6) ícones de Instagram, envelope e marcador, 20 px, na
  cor do texto · decisão já tomada (§7); (7) "liacup.unb" sem @ · §7; (8) passo de 44 px contra
  31,4, igual nos três itens e nas duas larguras · §7; (9) linha final centralizada, 62,4 px de cada
  lado em 390 e 485 em 1280 · §7; (10) sem "Protótipo do Portal LIACUP…" · decisão do Portão 1.
  **Raiz não publicada:** sha256 iguais aos `antes-*`, 0 de 329.160 e 0 de 1.024.000 pixels
  diferentes. **Cabeçalho, hero e menu contra a rodada 2:** altura 61,6 e 125,2 px, `h1` em
  (17,6; 157,8) e (40; 231,3), iguais; 0 pixel diferente em 390 e no menu aberto; em 1280, 142 pixels,
  todos no sublinhado de "Início", que subiu 2 px com o `--deslocamento-sublinhado-atual: 4px` da
  rodada 3 do dev. **Defeito novo:** cabeçalho 1280, entre o pé do texto "Início" e o topo da barra
  há 5 px, no protótipo 10 px (rodada 2: 7 px); a rodada 3 do dev diz que 4px põe a barra a 9 px, e
  o print mostra a barra mais perto do texto que no gabarito. Sem efeito visível, não contado: a barra de ponta
  redonda do protótipo contra a reta do site, em escala 1. **Diferenças: 21** —
  6 adaptação aprovada · 7 decisão já tomada · 7 página ainda não existe · 0 melhoria a aprovar ·
  **1 defeito**
- **Rodada 4 (última), só cabeçalho e hero:** `npm run build` código 0, `publicado 3100`, mesmo
  método e mesmos recortes (o script reconstrói os dois PNG da rodada 3 com 0 pixel diferente).
  Refeitos `lado-a-lado-cabecalho-hero-{390,1280}.png`; o lado do protótipo não mudou. **Q6:** em
  1280 o pé das letras de "Início" fica na linha 98 e a barra começa na 108, uma diferença de 10 px;
  no gabarito 92 e 102, também 10 px (rodada 3: 5 px). A ponta é redonda: as colunas das pontas
  saem em `#cdb1c5`/`#a375b3`/`#bf9dbf`, mais claras nos cantos, como no gabarito, e não mais a
  coluna reta `#c6a8c2`. **Q7:** o lema sai em `#82558f` no print, em 390 e em 1280 (rodada 3:
  `#683f74`). **O resto não mudou:** cabeçalho com 61,6 e 125,2 px, `h1` em (17,6; 157,8) e
  (40; 231,3), rodapé em 820,4 e 661,2, iguais aos da rodada 3; os 3.117 pixels diferentes em 390
  estão todos no lema; em 1280, 5.256, sendo 207 na barra e 5.049 no lema. **Cabeçalho e hero, 8
  diferenças:** (1) 1280, 125,2 contra 114,4 px · adaptação aprovada (§3, alvo de toque); (2) sem
  "Processo seletivo" · página ainda não existe; (3) 1280 sem "Painel" · página ainda não existe;
  (4) 1280 com 1 destino e não 10 · página ainda não existe; (5) borda do botão de menu em
  `--color-neutral-600` · adaptação aprovada (ADR-0003); (6) hero sem os dois botões, texto e
  quadro recentralizados · página ainda não existe; (7) borboleta no quadro · decisão já tomada
  (Q2 (b)); (8) lema em `#82558f` e não no lilás `#9b6aaf` · decisão já tomada (§7, Q7). A barra
  sob "Início" deixou de ser diferença. **Medida registrada, não contada:** a barra tem 34 px
  (colunas 71 a 104), e a do gabarito 36 (67 a 102); no gabarito ela passa 2 px de cada lado das
  letras, no site 2 px à esquerda e 0 à direita. Já era assim na rodada 3 (35 px), e não se vê em
  escala 1. **Contador:** 2 adaptação aprovada · 2 decisão já tomada · 4 página ainda não existe ·
  0 melhoria a aprovar · **0 defeito** · pendência para o Gabriel: nenhuma

## qa-acessibilidade

Tarefas 2.1, 2.2, 2.3 e 2.5. Arquivos: `tests/e2e/paginas-publicas.spec.ts` (novo, D7 itens 1, 2
e 5), `menu-por-teclado.spec.ts` (novo, item 3), `apoio.ts` (novo), `pagina-inicial.spec.ts`
(reescrito, item 4). As páginas vêm de `PAGINAS_PUBLICAS`, e o texto do hero vem do
`conteudo-institucional.md` §2.0, lido pelo teste: nenhuma lista nem texto copiados.

- **Cobertura:** 1 página da lista (`/`) × 7 larguras, publicada; raiz não publicada × 7.
- **Comando final:** `npm run build` com código 0 · `npx playwright test` com código 0, **210 passaram,
  0 falharam, 42 pulados**. Os 42 são o `menu-por-teclado` nos 6 projetos que não o rodam: ele
  percorre as 7 larguras dentro do projeto `largura-360`. `git diff --exit-code tests/e2e/interruptor.spec.ts playwright.config.ts` com código 0.
- **Medições:**
  - `páginas verificadas: 1 de 1` em cada uma das 7 larguras;
  - `Violacoes de acessibilidade: 0` em cada largura (com o menu fechado, e também aberto nas 6 larguras que têm o menu);
  - rolagem horizontal: 0 larguras com defeito;
  - alvos: 47 medidos, 0 abaixo de 44 px (7 por largura até 1024 e 5 em 1280) · 0 campos de formulário;
  - links: 28 internos conferidos (4 por largura, 1 endereço, 200) e 14 de contato (2 por largura);
  - menu lateral testado em **6 de 7 larguras** (360 a 1024), nos 6 comportamentos; em 1280, 1 destino em linha, visível e sublinhado;
  - foco: 35 controles alcançados por Tab (5 por largura), 0 sem foco visível, 0 com o anel no hover;
  - pedidos a domínio externo: 0 em 105 pedidos na publicada e 0 em 91 na não publicada;
  - cabeçalho de celular com 61,6 px, até 64 px · Instagram aberto pelo canto do quadro em 7 abas, com 0 `window.opener` e 0 `Referer`;
  - lema `rgb(104, 63, 116)` (`--color-accent-700`) sobre `rgb(245, 234, 216)`, superfície `<body>`, **6,91:1** nas 7 larguras · borboletas: 0 sobre texto, em 8 poses do voo.
- **Nomes acessíveis conferidos:** "Instagram da LIACUP, @liacup.unb (abre em nova aba)" e
  "Escrever um e-mail para liacup.unb@gmail.com". Os dois contêm o texto escrito (WCAG 2.5.3).
  Caixas de 78×44 e 142×44, com o texto em 78×17 e 142×17.
- **Demonstrações (RP-12):** violação feita à mão e desfeita à mão, sem git. Depois:
  `sha256sum` dos 5 arquivos de `src/` igual ao de antes, e `git status --porcelain` igual ao de
  antes das demonstrações.

  | # | Violação | Vermelho | Verde |
  | --- | --- | --- | --- |
  | 1 | `"/"` repetido no JSON | `vitest` 1: `Problemas na lista: endereço "/" repetido`, conferidas 2 | 0, conferidas 1 |
  | 2 | entrada `/pagina-que-nao-existe` | 7 de 7 falharam: `/pagina-que-nao-existe recebeu 404, Location ausente`, `páginas verificadas: 1 de 2` | 7 passaram, `1 de 1` |
  | 3 | `cancel` com `preventDefault` no hook | `o menu falhou em "fecha no Esc"`, 6 larguras, `testado: 0 de 7` | 7 passaram, 6 de 7 |
  | 4 | `.destino` com `min-height: 0` | só `[largura-1280]`: `cabeçalho: <a> "Início" 44x21.69` | 7 passaram |
  | 5 | a mesma entrada do 2 | `test:desempenho` 1: `páginas medidas: 2`, e a 404 reprova | 0: `1` publicado e `1` não publicado |
  | extra | sem `rel` e sem `min-height` no link do rodapé | `rel "" sem noopener`, `caixa 77.7x21.7`, `com Referer: 1` | 2 passaram |

- **Defeitos de produto:** nenhum.
- **Para o guardiao-visual, sem medir contra o protótipo:** em 1280 px o cabeçalho tem 125 px, porque os destinos ficam numa segunda linha.
- **Sem cobertura:**
  - verificações novas que não vi falhar: foco e hover, altura do cabeçalho, borboletas, contraste do lema, quadro decorativo, texto e botões do hero, moldura só com a lista, e a raiz não publicada sem pedido externo (**demonstradas na rodada 2**);
  - `window.opener` não teve demonstração: o Chromium já aplica `noopener` a `_blank`;
  - a devolução do foco não foi demonstrada falhando: o `<dialog>` nativo devolve o foco sozinho, por isso a demonstração 3 foi o Esc;
  - nada medido em zoom de 200%, em leitor de tela real nem em navegador que não seja o Chromium;
  - o toque real (`touchscreen`) só no comportamento 3; os outros, por teclado e mouse.

### qa-acessibilidade · rodada 2 (correção pedida pelo revisor e pelo guardiao-appsec)

Rodada sobre o código atual: marca com o nome "LIACUP, página inicial" e `scripts/medir-desempenho.mjs`.

- **O que mudou nos testes:**
  - foco: o anel é medido no mesmo elemento em três estados, focado por Tab, em repouso e sob o ponteiro. Passa só se o foco muda o anel em relação ao repouso e o hover não muda. Sombra em repouso já não vale como anel;
  - novo: a raiz não publicada não tem o cabeçalho, o menu nem o rodapé da moldura. São 6 elementos procurados; o `<footer>` da página em construção não conta;
  - novo (achado A2): todo `a[href]` do `header`, do `footer` e do `dialog` que sai do site usa `https:` ou `mailto:`, e todo `target="_blank"` leva `noopener` e `noreferrer`;
  - lema: a cor e o contraste passaram a `expect.soft`, para uma falha não esconder a outra.
- **Comando final:** `npm run build` com código 0 · `npx playwright test` com código 0, **224 passaram, 0 falharam, 42 pulados** (o menu fora do projeto `largura-360`) · `git diff --exit-code tests/e2e/interruptor.spec.ts playwright.config.ts` com código 0.
- **Contadores:**
  - `páginas verificadas: 1 de 1` nas 7 larguras · axe: 0 violações em cada largura;
  - rolagem: `scrollWidth` igual a `clientWidth` nas 7 larguras;
  - alvos: 47 medidos, 0 abaixo de 44 px · links: 28 internos e 14 de contato;
  - links externos conferidos pela regra A2: 14 (7 `https:`, 7 `mailto:`), 7 com `target="_blank"`;
  - menu lateral testado em **6 de 7 larguras**, nos 6 comportamentos;
  - foco: 35 controles alcançados por Tab · 0 sem `:focus-visible` · 0 sem anel novo · 0 com o anel mudando no hover;
  - raiz não publicada: 0 de 6 elementos da moldura nas 7 larguras · pedidos externos: 0 em 91;
  - raiz publicada: 0 pedidos externos em 105 · lema 6,91:1 nas 7 larguras · 0 borboletas sobre texto · quadro com 0 caracteres · cabeçalho de celular com 61,6 px.
- **Demonstrações:** violação feita à mão e desfeita à mão, sem git. `sha256sum -c` deu OK nos 6 arquivos de `src/`. `git status --porcelain` igual ao de antes, e 0 marcas `DEMO-RP12` sobrando. A execução verde de todas é o comando final acima.

  | Verificação | Violação temporária | Vermelho |
  | --- | --- | --- |
  | texto do hero | "sublime" trocado por "bonito" no `h1` | 7 de 7: `Expected "…mais sublime…" Received "…mais bonito…"` |
  | botões do hero | filtro da lista com `\|\| true` | 7 de 7: `"Quero participar" aparece sem /processo-seletivo na lista` |
  | quadro | `<span>Foto institucional da Liga</span>` no quadro | 7 de 7: `texto dentro do quadro da foto`, 26 caracteres |
  | borboletas | `.borboletaGrande` posta a 45% do topo e 5% da esquerda | 5 de 7: `borboletaGrande sobre "A LIACUP reúne…"`; em 768 e 1024 caiu num vão, e a medida deu 0 |
  | contraste do lema | `.lema` em `--color-accent` | 7 de 7: `o lema não está em --color-accent-700` e `lema com 3.48:1, abaixo de 4,5:1` |
  | moldura só com a lista | `<a href="/sobre">` escrito à mão nos links em linha | 7 de 7: `links em linha: ["Início","Sobre"], e não ["Início"]` |
  | foco contra repouso | `.marca` com sombra parada e `outline: none` no foco | 7 de 7: `o foco não mostra anel novo` (o teste antigo deixaria passar) |
  | foco contra hover | `.marca:hover` com o contorno do foco | 7 de 7: `o hover muda o anel, que devia ser só do foco` |
  | altura do cabeçalho | `.linha` de celular com `--space-6` | 6 de 6 larguras de celular: 96,8 px, `acima de 64 px` |
  | pedido externo, raiz não publicada | `<img src="https://example.invalid/…">` na página em construção | 7 de 7: `domínios externos chamados: https://example.invalid/demo-rp12.png` |
  | moldura na raiz não publicada | `Cabecalho` e `RodapePublico` na página em construção | 7 de 7: `encontrados: 6`, os 6 nomeados |
  | links externos (A2) | Instagram com `http:` e `rel="noopener"` | 7 de 7: `sai do site por http:` e `sem noreferrer` |

- **Limite conhecido:** enquanto a lista só tem `/`, o comportamento 4 do menu ("fecha ao escolher um destino e mostra a página dele") não distingue entre ter navegado e ter ficado na mesma página. Ele confere que o menu fecha e que o endereço é o do destino, e o destino é a própria página. Passa a distinguir quando entrar a segunda página da lista. Não inventei página para isso.
- **Defeitos de produto:** nenhum.

### qa-acessibilidade · rodada 3 (rodapé novo, ícone da aba e menu por largura)

- **Arquivos:** **M** `paginas-publicas.spec.ts` (Instagram "liacup.unb"; WCAG 2.5.3 contra o texto
  lido na tela; 3 testes novos: rodapé, ícone da aba publicado, ícone na raiz não publicada) · **M**
  `menu-por-teclado.spec.ts`, reescrito: 1 teste, e cada projeto testa a própria largura. Até 1024
  px (o corte medido pelo dev na 1.4, escrito no teste para que a forma errada do cabeçalho seja
  falha, e não troca silenciosa do que se testa), os 6 comportamentos do D4 em `test.step`; em 1280,
  os destinos em linha. `interruptor.spec.ts` e `playwright.config.ts`: `git diff --exit-code` 0.
- **Comando final:** `npm run build` 0 (4 rotas) · `npx playwright test` 0, **245 passaram, 0
  falharam, 0 pulados** (eram 42) · `npm run test:desempenho` 0: publicado, `páginas medidas: 1`,
  desempenho 100 e acessibilidade 100 nas 3 execuções; não publicado, 1 página, 100 e 100 nas 3.
- **Contadores, somados nas 7 larguras:**
  - páginas verificadas: 1 de 1 em cada largura · axe: 0 violações · rolagem: `scrollWidth` igual
    a `clientWidth` em 7 de 7;
  - alvos: 47 medidos, 0 abaixo de 44 px · 0 campos de formulário · links: 28 internos e 14 de
    contato, os 14 com o texto escrito contido no nome acessível;
  - menu lateral testado em **6 larguras** (360 a 1024), 6 de 6 comportamentos em cada · 1280:
    1 destino em linha visível, "Início" sublinhado, 0 comportamentos a testar;
  - rodapé: 21 itens de contato, 21 ícones, 21 decorativos · 14 passos medidos (44 e 43,98 px), 0
    fora de 44 ± 1 · 35 alvos, 70 pares, 0 sobrepostos · linha final: 7 medidas, diferença máxima
    0,02 px;
  - ícone da aba: 28 `<link>` (21 `icon`, 7 `apple-touch-icon`), 28 com 200 `image/png` · raiz não
    publicada: 0 `<link>` de ícone em 7, com 6 `<link>` na página.
- **Demonstrações (RP-12):** feitas e desfeitas à mão em 6 arquivos de `src/`, sem git.
  `sha256sum -c` OK nos 6, 0 marcas `DEMO-RP12`, `git status --porcelain` igual ao de antes. O verde
  é o comando final.

  | Verificação | Violação temporária | Vermelho |
  | --- | --- | --- |
  | texto do Instagram | `<span>@liacup.unb</span>` | 7 de 7: `texto escrito "@liacup.unb", e não "liacup.unb"` |
  | WCAG 2.5.3 | `aria-label` sem o texto escrito | 7 de 7: `nome acessível … não contém o texto escrito` |
  | ícones decorativos | sem `aria-hidden` no marcador; sem o envelope | 7 de 7: `não é decorativo` e `tem 0 ícones` |
  | passo de 44 px | `.endereco` com `margin-top: var(--space-2)` | 7 de 7: `e-mail → endereço 52,78 px`; Instagram → e-mail ficou 44 |
  | sobreposição | alvo do e-mail sobe `--space-2`, texto no lugar | 7 de 7: `Instagram e e-mail se sobrepõem em 106,52x8,8 px` |
  | linha final | `justify-content: flex-start` | 7 de 7: `sobra 0 e 124,86 px` em 390 |
  | ícone da aba | URL do 48 trocada por arquivo inexistente | 7 de 7: `respondeu 404, tipo "text/html"` |
  | raiz não publicada | `icons` no `src/app/layout.tsx` | 7 de 7: `tem <link> de ícone: rel="icon"` |
  | menu por largura | `cancel` com `preventDefault` no hook | 6 de 6 de celular, 360 a 1024: `fecha no Esc` e `devolve o foco` (Esc), `4 de 6`; 1280 verde |

- **Achado no meu teste, corrigido antes das demonstrações:** a primeira versão media a linha final
  só no nó de texto "©", e o React grava `© {ano} LIACUP…` em três nós. Agora mede o elemento.
- **Defeitos de produto:** nenhum.
- **Sem cobertura:** a sobreposição foi medida com o menu fechado, e não entre os alvos do menu
  aberto. Em 1280 o endereço quebra em 2 linhas, e o passo vale só para a 1ª. Nada medido em zoom
  de 200%, em leitor de tela real nem fora do Chromium.

### qa-acessibilidade · rodada 4 (Q6, barra da página atual; Q7, cor do lema)

- **Investigação da falha do menu.** Ela era em **1280 px**, e não em 360: o passo "destinos em
  linha", que lia `text-decoration` no link. A Q6 trocou o sublinhado por uma barra no `::after` de
  um `<span>`. O menu lateral **não mudou**: o `MenuLateral.module.css` é das 01:09, anterior ao
  `lado-a-lado-menu-aberto-390.png` (01:14), que mostra "Início" com a barra à esquerda e o
  sublinhado, e de 360 a 1024 os 6 comportamentos passavam. Só `Cabecalho.*` mudou (03:35). O
  defeito era do teste, não do produto.
- **Arquivos:** **M** `menu-por-teclado.spec.ts`. A indicação de página atual passa a ser medida na
  tela, e não num atributo. Nos links em linha, `aria-current` e a barra do `::after`, com
  espessura, largura, ponta redonda, abaixo do rótulo e pelo menos 3:1 com o fundo (WCAG 1.4.11).
  No menu, no comportamento 1: `aria-current`, o sublinhado e a barra à esquerda, com pelo menos
  3:1. **M** `pagina-inicial.spec.ts`: o lema em `--color-accent-600`, com o mínimo de 4,5:1.
- **Pares medidos (RP-09), nas 7 larguras:**
  - lema `rgb(130, 85, 143)` (`--color-accent-600` `#82558f`, de 20 a 26 px) sobre
    `rgb(245, 234, 216)`, superfície `<body>`: **4,84:1**;
  - barra em linha em 1280 px: 33,8 × 3 px, ponta redonda, `rgb(155, 106, 175)` sobre
    `rgb(245, 234, 216)`, 3,48:1, 5,7 px abaixo da caixa do texto;
  - barra do menu de 360 a 1024 px: 4 × 22 px, mesma cor, 3,48:1, com o sublinhado.
- **Comando final:** `npm run build` 0 (4 rotas) · `npx playwright test` 0, **245 passaram, 0
  falharam, 0 pulados** · `npm run test:desempenho` 0: publicado e não publicado, 1 página cada,
  desempenho 100 e acessibilidade 100 nas 3 execuções · `git diff --exit-code` no `interruptor` e
  no `playwright.config.ts`: 0 · servidores parados: 0 ouvindo.
- **Contadores:** páginas verificadas 1 de 1 em 7 larguras · axe 0 · rolagem 0 em 7 de 7 · alvos
  47, 0 abaixo de 44 px · links 28 internos e 14 de contato · menu testado em 6 larguras, 6 de 6 · rodapé: 0
  passos fora de 44 ± 1, 0 alvos sobrepostos · ícone da aba: 4 `<link>` com 200 `image/png` em 7, e
  0 na raiz não publicada.
- **Demonstrações (RP-12):** 3 compilações, feitas e desfeitas à mão em 3 CSS de `src/`.
  `sha256sum -c` OK nos 3, 0 marcas `DEMO-RP12`, `git status --porcelain` igual ao de antes.

  | Violação temporária | Vermelho |
  | --- | --- |
  | `.lema` em `--color-accent-700` | 7 de 7: `o lema não está em --color-accent-600` (o contraste, 6,91:1, passa) |
  | `::after` com `content: none` | 1280: `não mostra a barra do ::after: a indicação ficaria só na cor` |
  | menu com `text-decoration: none` | 360 a 1024: `a página atual do menu não está sublinhada` |
  | `::after` com `border-radius: 0` | 1280: `não tem a ponta redonda (Q6)` |
  | barra do menu em `--color-accent-100` | 360 a 1024: `1.07:1, abaixo de 3:1` |
  | `::after` com `top: 0` | 1280: `sobe no rótulo, em vez de ficar abaixo dele` |
  | barra do menu com `display: none` | 360 a 1024: `não mostra a barra à esquerda do rótulo` |

- **Defeitos de produto:** nenhum.
- **Sem cobertura:** a distância de 10 px até o pé das letras, da Q6, não é medida aqui. O teste mede
  até a caixa do texto, que fica abaixo da linha de base, e não lê o print. Fica com o
  `guardiao-visual`.

### qa-acessibilidade · rodada 5 (evidência RP-12 pedida pelo revisor, e o Lighthouse)

As 5 verificações do revisor e a demonstração 5 do D7 com o `scripts/medir-desempenho.mjs`. Cada
violação foi feita à mão em `src/`, só o teste afetado rodou, e a violação foi desfeita. Os números
de linha do pedido não batiam com o `pagina-inicial.spec.ts`, que tem 335 linhas; achei as
verificações pelo conteúdo: as linhas 57 e 116.

| # | Verificação | Violação temporária | Vermelho (código 1) |
| --- | --- | --- | --- |
| 1a | raiz publicada, 200 sem Location | `redirect('/vitrine')` na `page.tsx` | 7 de 7: `a raiz publicada precisa responder 200 sem Location`, `status 307`, `location "/vitrine"` |
| 1b | raiz sem "Portal em construção" | `<p>Portal em construção</p>` no hero | 7 de 7: `Expected: 0 · Received: 1` |
| 2 | lema logo depois do `h1` | `<span />` entre o `h1` e o lema | 7 de 7: `o lema não é o elemento logo depois do título` |
| 3 | item 2 do D7, link da moldura | `<Link href="/sobre">` no cabeçalho e entrada `/pagina-que-nao-existe-DEMO-RP12` na lista | 7 de 7: `/sobre não está na lista` e, no cabeçalho e no menu, `recebeu 404, e não 200`; 7 links conferidos por largura |
| 4 | "Painel", linha FCTS, termos proibidos | `<span>Painel</span>` no cabeçalho; endereço trocado por "Campus Darcy Ribeiro · Brasília/DF" | 7 de 7: `o cabeçalho mostra "Painel"`, `o rodapé não tem a linha de endereço "FCTS…"`, `o rodapé mostra "Darcy Ribeiro"` |
| 5a | lista congelada | sem `Object.freeze` na entrada; depois, na lista | `vitest` 1: `expected false to be true`, nas duas |
| 5b | consultas leem a lista | `paginasDoMenu` sem o filtro `noMenu` | **verde, 8 de 8: o teste não falhava** (ver abaixo) |
| 5b' | idem, com o caso novo | o mesmo; depois, `estaNaLista` por começo do endereço | `vitest` 1: `paginasDoMenu: expected ['/', '/so-no-rodape', '/destaque'] to deeply equal ['/', '/destaque']`; depois, `estaNaLista, só o começo do endereço: expected true to be false` |
| D7-5 | Lighthouse pela lista | a entrada do item 3, só ela | `test:desempenho` 1: `páginas a medir: 2 (…/, …/pagina-que-nao-existe-DEMO-RP12)`, `Status code: 404`, `páginas medidas: 2`, `O Lighthouse reprovou no modo "site publicado" (código 1)`. O script não tem defeito |

- **Teste corrigido (5b):** a lista real tem uma entrada só, no menu e na coluna "Portal", e uma
  consulta que ignore o próprio filtro devolve o mesmo que a certa. Acrescentei ao
  `src/lib/utils/paginas-publicas.test.ts` o caso "cada consulta filtra pelo campo dela": ele
  recarrega o módulo com uma lista de teste de 3 páginas no lugar do JSON (`vi.doMock`). **O arquivo
  fica fora de `tests/`**, e foi mexido por pedido do líder técnico. O caso antigo continua lá.
- **Tentativa que não valeu (1a):** primeiro usei `notFound()`. O `webServer` do Playwright só
  considera a 3000 pronta abaixo de 404, então a execução parou em `Timed out waiting 180000ms from
  config.webServer`, sem rodar o teste. Troquei por `redirect`.
- **Desfeito:** `sha256sum -c` OK nos 6 arquivos de produto (`paginas-publicas.ts` e `.json`,
  `HeroDaInicial.tsx`, `RodapePublico.tsx`, `Cabecalho.tsx` e `(publicas)/page.tsx`) · 0 marcas
  `DEMO-RP12` · `git status --porcelain` igual ao de antes. O JSON voltou pela cópia de segurança,
  e não à mão; o sha256 é o de antes.
- **Comando final:** `npm test` 0, 11 arquivos e 89 testes, `Entradas … conferidas: 1` · `npm run
  build` 0 (4 rotas) · `npx playwright test` 0, **245 passaram, 0 falharam, 0 pulados** · `npm run
  test:desempenho` 0: publicado e não publicado com `páginas medidas: 1`, desempenho 100 e
  acessibilidade 100 nas 3 execuções · `git diff --exit-code` no `interruptor` e no
  `playwright.config.ts`: 0 · servidores ouvindo: 0.
- **Contadores:** páginas verificadas 1 de 1 em 7 larguras · axe 0 · rolagem 0 em 7 de 7 · alvos
  47, 0 abaixo de 44 px · links 28 internos e 14 de contato · menu 6 de 6 em 6 larguras, 1280 em
  linha · rodapé 0 passos fora de 44 ± 1 e 0 sobrepostos · ícone 4 de 4 com 200, e 0 na raiz não
  publicada.
- **Defeitos de produto:** nenhum.

## Decisões do Gabriel depois do Portão 1

Registradas pelo líder técnico. A numeração continua a do Portão 1 (Q1 a Q3).

**Q4. Dois códigos de botão** (achado 2 do `revisor`, rodada 1). O `AparenciaDeBotao`, em
`componentes/layout/`, copia o `ui/Botao` da F01 e já diverge dele (tem hover e pressionado, que o
`Botao` não tem), e mora numa pasta que `features/` não pode importar. Ele serve os botões "Quero
participar", "Conheça a Liga" e "Processo seletivo", que ainda não aparecem: as páginas deles não
estão na lista.

- (a) Unificar agora no `ui/Botao` (ganha hover, pressionado e forma de link) e tirar o
  `AparenciaDeBotao` · custo: toca componente da F01, fora do D9, e pede mais uma rodada de dev,
  qa, `revisor` e guardião.
- (c) Manter nesta change, corrigir o comentário que diz "o mesmo contrato do Botao", e unificar na
  `pagina-processo-seletivo`, onde os botões aparecem pela primeira vez · custo: dois códigos de
  botão por alguns dias, sem efeito na tela.
- Recomendação do líder técnico: (c).
- **Decisão do Gabriel, 21/11/2026, literal:** "Q4: c."

**Q5. Origem dos 15 PNG da change na §7 do `SEGURANCA.md`** (achado A1 do `guardiao-appsec`,
rodada 1). Os 6 `qn-foto-*` são os esboços do Portão 1; os 9 de evidência (`antes-*`, `depois-*`,
`lado-a-lado-*`) vêm de script temporário do `guardiao-visual`, não versionado. O líder técnico
abriu 3 deles: só telas do site e do protótipo. Total de 1,66 MB.

- (a) Versionar os 15, com a linha na §7 no caminho do archive: esboços aprovados no Portão 1, e os
  9 como evidência aprovada pelo Gabriel · custo: 15 binários a mais no repositório.
- (b) Versionar só os 6 esboços e anexar os 9 ao PR · custo: a evidência fica fora do repositório.
- Recomendação do líder técnico: (a).
- **Decisão do Gabriel, 21/11/2026, literal:** "Q5: a."

**Q6. A barra de página atual sob "Início", em 1280 px** (defeito do `guardiao-visual`, rodada 3).
A barra ficava a 5 px do pé das letras; no protótipo, a 10 px. Era a segunda rodada do
`guardiao-visual` com pedido de correção, e o líder técnico parou pela regra 4 da dieta.

- (a) Corrigir: ajustar `--deslocamento-sublinhado-atual` até 10 px, medido no print como o
  `guardiao-visual` mede, e reconferir só o cabeçalho de 1280 px · custo: mais uma rodada curta.
- (b) Aceitar os 5 px como diferença aceita · custo: 5 px de diferença contra o gabarito.
- Recomendação do líder técnico: (a).
- **Decisão do Gabriel, 21/11/2026, literal:** "Q6 (a): ajuste --deslocamento-sublinhado-atual até
  a barra sob "Início" ficar a 10 px do pé das letras em 1280 px, medindo no print do mesmo jeito
  que o guardiao-visual mede. Deixe a ponta da barra redonda, como no protótipo."

**Q7. A cor do lema** (pedida pelo Gabriel, sem pergunta do líder técnico).

- **Decisão do Gabriel, 21/11/2026, literal:** "Q7, cor do lema: troque para --color-accent-600
  (#82558f, 4,84:1 sobre #f5ead8, passa 4,5:1 em toda largura). Atualize a linha do lema na
  REFERENCIA-VISUAL §7, o comentário do HeroDaInicial.module.css, o cenário do lema na spec
  pagina-inicial e o teste de contraste: a cor esperada passa de accent-700 para accent-600, e o
  mínimo continua 4,5:1. Refaça o print lado-a-lado-cabecalho-hero em 390 e 1280."
- Feito pelo líder técnico: a linha do lema na `REFERENCIA-VISUAL.md` §7, o cenário "O lema é
  legível em toda largura" da spec `pagina-inicial` (nova linha com a cor `#82558f`) e as menções
  no `proposal.md`, no `design.md` (D6) e no `tasks.md` (1.7). `openspec validate layout-e-hero
  --strict`: código 0.
- **Também do Gabriel, 21/11:** o rodapé fica sem mudança, e esta é a última rodada do
  `dev-frontend` e do `guardiao-visual` nesta change (regra 4 da dieta). Diferença nova que o
  `guardiao-visual` achar vira pendência para o Gabriel, sem nova rodada.

**Ajustes de tela do Gabriel, 21/11/2026** (`docs/REFERENCIA-VISUAL.md` §7), que entram nesta change:
ícone da aba com a logo da liga; ícone ao lado de cada item da coluna de contato do rodapé, com o
espaçamento do protótipo e sem somar espaço visual ao alvo de 44 px; a última linha do rodapé
centralizada.

## revisor

### Rodada 1 (registrada pelo líder técnico; o revisor não escreve)

- **Veredito:** aprovado com ressalva.
- **Conferiu:** 30 arquivos · 6 critérios de aceite e 30 cenários · 32 regras.
- **Achados:** (1) 8 verificações novas nunca vistas falhando · RP-12 e critério de aceite;
  (2) `AparenciaDeBotao.module.css` duplica `ui/Botao` e diverge · ADR-0006, PADROES §1 e §3.1 (Q4);
  (3) cenário "sem cabeçalho, menu e rodapé" da raiz não publicada sem verificação automática;
  (4) `tokens.css` com 1px à mão na sombra do cabeçalho · RP-02; (5) `Cabecalho.module.css` com
  `calc(... * 2)` · RP-02, baixo; (6) nome acessível da marca sem o destino · baixo;
  (7) `process.getBuiltinModule` exige Node 22.3, e o projeto aceita `>=22`; (8) contagens velhas
  dos CSS no relatório · RP-12; (9) anel de foco aceitava qualquer sombra (parte do 1).
- **Encaminhamento:** 4 a 8 corrigidos pelo `dev-frontend` (rodada 3); 1, 3 e 9 pelo
  `qa-acessibilidade` (rodada 2); 2 decidido na Q4 (c). Sem veredito sobre: CSS acima de 150 linhas
  (o limite é de componente, não de CSS) e as duas ilhas cliente (corretas pela PADROES §2.1).
- **Não conseguiu conferir:** não roda comando; não leu `eslint.config.mjs`, o ADR-0006 nem a tag
  `arquivo/F03-layout-base`.

### Rodada 2 (invocação nova, sem o relatório anterior)

- **Veredito:** aprovado com ressalva · 35 arquivos de código, 6 critérios e 30 cenários, 30 regras.
- **Achados:** (1) média · spec e proposta exigiam "@liacup.unb" escrito; (2) média · ícone da aba,
  ícones do contato, passo de 44 px e linha centralizada fora dos artefatos; (3) média · 5
  verificações sem execução vermelha (RP-12); (4) baixa · `medir-desempenho.mjs` conta o pedido, não
  o medido; (5) baixa · lhci pode medir outro servidor com a 3000 ocupada; (6) baixa · o total de
  larguras do menu não sai impresso; (7) baixa · `usePainelDeNavegacao.ts` fora do kebab-case;
  (8) baixa · tarefas todas `[ ]`; (9) baixa · destaques e botões que esta change nunca desenha,
  sem teste, e `--font-size-h6` num botão; (10) baixa · linha em branco partindo a tabela da §7.
- **Encaminhamento:** 1, 2 e 8 pelo `especificador` (emenda dos artefatos); 3 pelo qa, rodada 5;
  10 pelo líder técnico. 4 a 7 e 9 são de código, e o Gabriel fechou as rodadas do `dev-frontend`:
  vão como pendência para o Portão 2.

### Rodada 3 (invocação nova, sem o relatório anterior)

- **Veredito:** aprovado com ressalva · 36 arquivos de código, 11 artefatos, 6 critérios e 35
  cenários, 26 regras. "O código cumpre a proposta, e nenhuma verificação foi afrouxada."
- **Achados:** (1) média, impede o Portão 2 · `tasks.md` 2.5 e 3.2 com "Falta" desatualizado e a
  conferência de escopo em branco · princípio 10 — **corrigido pelo líder técnico** (escrituração,
  sem código); (2) baixa · `medir-desempenho.mjs:77` conta o pedido, não o medido; (3) baixa · o
  total de larguras do menu não sai impresso; (4) baixa · o nome acessível da marca não contém o
  nome longo visível acima de 1024 px (WCAG 2.5.3); (5) baixa · links das colunas do rodapé sem
  marca de página atual (ADR-0006); (6) baixa · o README não diz que a página nova mora em
  `(publicas)/`; (7) baixa · o caminho do archive na §7 depende da data; (8) baixa · o
  `git diff --exit-code Rodape*` da tarefa 1.3 não cobre arquivo novo.
- **Regra 4 da dieta:** é a terceira rodada do `revisor` com pedido de correção. O líder técnico fez
  a correção de escrituração e leva ao Gabriel se o `revisor` roda uma quarta vez.

## guardiao-appsec

O guardião não escreve: o líder técnico registra o relatório em uma tela por passagem, com a lista
de achados inteira; a saída de comando e o aceite do Gabriel vão literais.

### Rodada 1

- **Veredito:** BLOQUEADO · bloqueante 0 · alta 1 · média 0 · baixa 0 · informativa 2 ·
  conferência completa.
- **Achados:**
  - A1 · AS-01 · alta · confirmado · `docs/SEGURANCA.md` §7 · os 15 PNG da change sem origem
    declarada · critério: linha na §7 com o caminho do archive, a contagem e a origem (decidido na
    Q5 (a)).
  - A2 · AS-04 · informativa · confirmado · `tests/e2e/paginas-publicas.spec.ts` · link externo
    novo na moldura sem `https:` ou sem `noopener noreferrer` não ficaria vermelho · critério: teste
    sobre todo `a[href]` da moldura (feito pelo qa, rodada 2).
  - A3 · §3 · informativa · confirmado · `docs/SEGURANCA.md` §3, R1 · a superfície nova não estava
    citada · critério: citar a lista JSON, o link externo, o Lighthouse e o script de iniciar
    (feito pelo líder técnico).
- **Pedidos de comando:** P1 · `git diff --stat main..HEAD` · código 0 · só arquivos de
  `openspec/changes/layout-e-hero/` (13 arquivos, 881 inserções). P2 a P4 · `git diff main --` nos
  três documentos · código 0 · única ocorrência dos padrões de segredo: "Secretaria". P5 a P10 ·
  `git grep -c -a --untracked -e '<padrão>' -- 'openspec/changes/layout-e-hero/relatorio.md'`
  para `eyJhbGci`, `sbp_`, `sb_secret_`, `ghp_`, `github_pat_` e `postgres://` · saída vazia,
  código 1 em todos. P11 · `curl` da prévia (AS-15) · fica para depois de a Vercel gerar o link.
- **Riscos aceitos pelo Gabriel:** nenhum.

### Rodada 2 (invocação nova, sem o relatório anterior; levantamento e decisão)

- **Veredito:** APROVADO · bloqueante 0 · alta 0 · média 0 · baixa 0 · informativa 1 ·
  conferência completa · 60 de 61 arquivos lidos (o `relatorio.md` só por busca, por regra).
- **Estado por código:** AS-01 sem segredo nas buscas, mais o I-1 · AS-02 e AS-04 a AS-09 sem
  achado · AS-03, AS-10 a AS-14 e AS-16 não se aplicam · AS-15 **não verificado**, a prévia não
  existe (P23) · AS-17 não se aplica.
- **Achados:** I-1 · AS-01 · informativa · confirmado · `docs/SEGURANCA.md` §7, linhas 371-373 e
  376-378 · os 15 prints estão declarados no caminho do archive com a data de 21/11; se o archive
  sair em outra data, ficam fora da §7 · critério: depois do `git add`,
  `git ls-files -- 'openspec/changes/archive/2026-11-21-layout-e-hero/prints'` lista os 15 PNG, com a
  saída literal na entrega.
- **Não verificado:** AS-15 (prévia); texto comprimido dentro dos PNG, coberto só pela origem
  declarada na §7; o "mesmo sha256" dos 4 ícones (o líder técnico conferiu com `sha256sum`: os 4
  pares iguais, saída na seção dev-frontend, rodada 4); os aceites citados na §7, que o gestor
  confere neste relatório.
- **Precondições da §5:** `test -e` deu 1 para `.claude/settings.json`,
  `.claude/settings.local.json` e `.mcp.json`; `git check-ignore -v -- 'public'
  'openspec/changes/layout-e-hero/prints' 'openspec/changes/layout-e-hero/relatorio.md'` deu código
  1. Todos com `MSYS_NO_PATHCONV=1`. Nenhum pedido recusado.
- **Pedidos de comando**, como foram digitados, com a saída literal. `PADRÃO` é
  `'eyJhbGciOi\|sb_secret_\|sbp_\|ghp_\|gho_\|ghs_\|github_pat_\|PRIVATE KEY\|postgres://\|postgresql://'`.

```
P1 · git log --oneline -n 5 HEAD
556d4c5 docs: propõe a change layout-e-hero
6cce396 Merge pull request #18 from Liga-Academica-Liacup/chore/auditoria-de-base-appsec
012c3bd chore: faz a auditoria de base de segurança e arquiva a change
a7283fa wip: auditoria-de-base-appsec, blocos 1 a 5 e tabela de achados
dfe4f6e docs: propõe a auditoria de base de segurança
[código de saída: 0]

P2 · git grep -c -a --untracked -e 'IHDR\|zzqq-controle-ausente' -- 'public'
public/icone-da-aba-32.png:1
public/icone-da-aba-48.png:1
public/icone-da-aba-96.png:1
public/icone-da-tela-de-inicio-180.png:1
public/logo-liacup-256.png:1
[código de saída: 0]

P3 · git grep -c -a --untracked -e PADRÃO -- 'public'
[código de saída: 1]

P4 a P12 · git grep -c -a --untracked -e PADRÃO -- 'openspec/changes/layout-e-hero/prints/<arquivo>.png',
um por arquivo: antes-raiz-nao-publicada-{1280,390}, depois-raiz-nao-publicada-{1280,390},
lado-a-lado-cabecalho-hero-{1280,390}, lado-a-lado-menu-aberto-390, lado-a-lado-rodape-{1280,390}
[saída vazia · código de saída: 1, nos nove]

P13 · git grep -c -a --untracked -e PADRÃO -- 'openspec/changes/layout-e-hero/relatorio.md'
openspec/changes/layout-e-hero/relatorio.md:1
[código de saída: 0]
  detalhe · git grep -n -I --untracked -e '<um padrão por vez>' -- 'openspec/changes/layout-e-hero/relatorio.md'
  sb_secret_, sbp_, ghp_, github_pat_ e postgres:// casam só na linha 798, o registro dos pedidos
  da rodada 1, que cita os nomes dos padrões e nenhum valor; os outros cinco padrões, código 1

P14 · git grep -n -I --untracked -e '_KEY=\|_TOKEN=\|SENHA=\|PASSWORD=' -- 'openspec/changes/layout-e-hero/relatorio.md'
[código de saída: 1]

P15 · git log --all --oneline -S 'eyJhbGciOi'      → a7283fa, 4048223, 20b30d5 · código 0
P16 · git log --all --oneline -S 'sb_secret_'      → a7283fa, 4048223, 20b30d5 · código 0
P17 · git log --all --oneline -S 'sbp_'            → a7283fa, 4048223, 20b30d5, 728a608 · código 0
P18 · git log --all --oneline -S 'ghp_'            → a7283fa, 4048223 · código 0
P19 · git log --all --oneline -S 'github_pat_'     → a7283fa, 4048223, 20b30d5 · código 0
P20 · git log --all --oneline -S 'PRIVATE KEY'     → a7283fa · código 0
P21 · git log --all --oneline -S 'postgres://'     → a7283fa, 4048223, 20b30d5 · código 0
P22 · git log --all --oneline -S 'postgresql://'   → a7283fa, 4048223 · código 0
(nenhum é o 556d4c5, o único commit da branch; todos são da história da main)

P23 · curl -q -sS -I --max-time 20 --proto =https '<prévia da change>/' · AS-15 · fica para a
seção 6 da entrega, depois de a Vercel gerar a prévia
```

- **Riscos aceitos pelo Gabriel:** nenhum.

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum.

- **Conferido em 21/11/2026**, sobre `git status --porcelain --untracked-files=all` e
  `git diff --name-status main...HEAD`, depois de cada passagem e no fim: 70 linhas na lista do diff.
- **`npm run verificar`** (líder técnico, 21/11): código 0 · tokens: 80 arquivos varridos, 0
  problemas · chave de serviço: 458 arquivos varridos, 63 entregues ao navegador, 0 ocorrências ·
  22 dependências diretas · `git diff --exit-code package-lock.json .github/`: código 0.
- **Arquivos fora do escopo, por agente:**
  - `dev-frontend` · `public/icone-da-aba-{32,48,96}.png` e `public/icone-da-tela-de-inicio-180.png`
    (pedidos pelo líder técnico para o ícone da aba; o D9 foi emendado) · `scripts/medir-desempenho.mjs`
    (rodada 3, no lugar dos dois `lighthouserc.*.js`; D9 emendado).
  - `qa-acessibilidade` · `src/lib/utils/paginas-publicas.test.ts` (rodada 5, a pedido do líder
    técnico, para um teste que não falhava quando devia).
  - `especificador`, `guardiao-visual`, `revisor` (3 invocações) e `guardiao-appsec`: nenhum.
  - **Líder técnico** · `docs/SEGURANCA.md` (§3, superfície da R1, achado A3; §7, origem de 19
    binários, Q5) · `docs/REFERENCIA-VISUAL.md` (§7, linhas do rodapé e do lema, a pedido do Gabriel)
    · os artefatos desta change (Q6, Q7, tarefas 1.4, 2.5 e 3.2) · os 6 `prints/qn-foto-*.png`
    (esboços do Portão 1).
  - **Gestor, fora deste ciclo de agentes** · `docs/PLANO-DE-DESENVOLVIMENTO.md`,
    `docs/conteudo-institucional.md` (§2.0) e `docs/REFERENCIA-VISUAL.md` (§6 e §7), no disco desde
    20/11, que o Gabriel pediu para entrar no commit desta change.
