# Design — protótipo no repositório

## Context

Ver `proposal.md` — Why. Estado medido em 18/11/2026, lendo o repositório e o arquivo do
protótipo:

| O que | Situação |
|---|---|
| `prototipo/Portal-LIACUP.html` | 1.376.572 bytes, versionado desde `735bbd3`, autocontido |
| `prototipo/prints/` | 21 PNG versionados, tirados pelo gestor no Chrome |
| Navegação do protótipo | Por estado, não por endereço: todo link é `href="#"` com tratador de clique. Não há como abrir uma página pela URL |
| Lista do menu no protótipo | `NAV`: `home`, `sobre`, `noticias`, `educativo`, `eventos`, `projetos`, `materiais`, `equipe`, `galeria`, `contato` |
| Fora do menu | `seletivo` (botão de destaque do cabeçalho e botão no fim do menu lateral) e o painel (tela de entrar + painel) |
| Animações | `<main>` entra com `animation: entra .3s`; a gaveta do menu com `gavetaEntra .22s`; as borboletas voam com `voa 7s/9s infinite`. O `prefers-reduced-motion` do protótipo só desliga a gaveta, não as borboletas nem o `<main>` |
| Fontes | Caprasimo e Figtree embutidas no arquivo; nenhum recurso externo encontrado |
| Estado persistido | Nenhum uso de `localStorage`; a única data do relógio só aparece ao enviar o formulário de contato |
| `@playwright/test` | 1.62.1, já é devDependency |
| `scripts/verificar-navegador.mjs` | Já existe; confere o navegador antes do `playwright test` |
| Dependências diretas | 22 (4 + 18) |
| `.prettierignore` | Exclui `prototipo/` inteiro |
| `eslint .` | Varre `scripts/` |

## Goals / Non-Goals

**Goals:**

- O gabarito passa a ser reproduzível por um comando, por qualquer pessoa, offline.
- O comando diz quanto gerou e falha quando gera menos ou encontra imagem que não gerou (RP-12).
- Duas execuções na mesma máquina dão os mesmos 23 nomes, e o mais perto possível dos mesmos
  bytes.

A spec cita o comando `npm run prints:prototipo` e os nomes dos PNG porque eles são o contrato da
capacidade — é por eles que quem confere e quem regera encontra o gabarito —, não detalhe interno.

**Non-Goals:**

- Nenhuma alteração no protótipo nem em `src/`, `tests/` ou `.github/`.
- Nenhuma verificação nova no CI nem alteração em verificação existente.
- Nenhum print do site e nenhuma comparação site × protótipo.
- Igualdade de bytes como critério (D4).

## Decisions

### D1 — Script Node com a biblioteca do Playwright, sem o executor de testes

O script usa `chromium` de `@playwright/test`, já instalado, e roda com `node`. Não é um teste:
não passa pelo `playwright test`, não tem asserção nem relatório, e não muda `playwright.config.ts`.
**Alternativa descartada:** escrever como teste do Playwright. Misturaria geração de gabarito com
a suíte de ponta a ponta, que o CI roda em toda alteração, e o gabarito não deve mudar a cada PR.

### D2 — O comando reaproveita a conferência do navegador

`"prints:prototipo": "node scripts/verificar-navegador.mjs && node scripts/prints-do-prototipo.mjs"`,
o mesmo encadeamento de `test:e2e`. Quem não tem o navegador recebe a mensagem que já existe, em
português, com o comando de instalação. Nada é duplicado.

### D3 — Navegar por clique, em 1280 px, conferindo o título

O protótipo é aberto por `file://` (caminho resolvido a partir da raiz do projeto, não do diretório
corrente). Para cada página, em janela de 1280 px:

1. clica no link do cabeçalho com o rótulo da página;
2. espera o `<h1>` esperado ficar visível — é a prova de que chegou na página certa, e não numa
   página anterior que ainda está na tela;
3. tira o print de página inteira em 1280 px;
4. redimensiona para 390 × 844, tira o print de página inteira em 390 px;
5. volta a janela para 1280 px antes da próxima página.

| Arquivo | Rótulo no cabeçalho | Título esperado (`<h1>`) |
|---|---|---|
| `inicio` | Início | Cuidar é o ato mais sublime da conexão humana |
| `sobre` | Sobre | A borboleta não é enfeite |
| `noticias` | Notícias | O que a Liga tem feito |
| `conteudo-educativo` | Conteúdo educativo | Perguntas que a gente ouve o tempo todo |
| `eventos` | Eventos | Agenda da Liga |
| `projetos` | Projetos | Ensino, Extensão, Pesquisa e Secretaria |
| `materiais` | Materiais | Biblioteca da Liga |
| `equipe` | Equipe | Quem faz a LIACUP |
| `galeria` | Galeria | Registros |
| `processo-seletivo` | Processo seletivo (botão de destaque do cabeçalho) | Processo seletivo 2026.2 |
| `contato` | Contato | Fale com a Liga |

A correspondência título → página foi lida no HTML (Notícias e Conteúdo educativo pelo sobretítulo
logo acima de cada `<h1>`), e a tarefa 1.2 a confirma na execução. Processo seletivo não está no
menu: abre-se pelo link `hdr-cta` do cabeçalho, de texto "Processo seletivo". O mesmo texto aparece
em chamadas dentro das páginas (a de Início, por exemplo), então o clique é **restrito ao
cabeçalho** para não depender da página em que se está.

Contato fica por último de propósito. O menu (Q3 = a): depois de Contato, a janela vai a 390 × 844,
o script clica no botão de menu, espera a gaveta aberta e tira o print **da área visível**, não da
página inteira — com Contato marcado como página atual, como no print do gestor.

A lista é **nominal** no script: os nomes de arquivo são constantes, não derivados do HTML. É o que
garante os mesmos nomes em toda execução.

### D4 — Determinismo: o que o script fixa, e por que bytes são medida e não critério

O que se fixa: janela de tamanho fixo (1280 × 800 e 390 × 844), escala de pixel 1, contexto de
navegador novo a cada execução, `document.fonts.ready` antes de cada print, redução de movimento
emulada, e uma folha de estilo injetada que desliga só `transition` e o cursor de texto. As
animações são tratadas pelo próprio script, antes de cada print:

- **as finitas** (a `entra` do `<main>`, a da gaveta do menu) vão até o fim;
- **as infinitas** (as borboletas, `voa`) são pausadas no **início do primeiro ciclo**,
  descontando o atraso: o tempo corrente de cada uma vira igual ao atraso dela, e não ao tempo 0
  do documento;
- o print sai com `animations: 'allow'`, para o Playwright não desfazer o congelamento.

**Por que assim (rodadas 3 e 4, Q6 e Q7 do Portão de apply).** A `voa` vai de `rotate(-8deg)` em
0% a −2° em 50% e volta a −8° em 100%: **−8° é a pose de repouso** da borboleta no protótipo.
Duas tentativas anteriores deixaram as borboletas a 0°, pose que o protótipo nunca exibe e que a
constitution não admite (princípio 4, borboletas não mudam):

- `animation: none` na folha injetada tira a animação e deixa o estilo de base, sem rotação;
- `animations: 'disabled'` do print **cancela** a animação infinita, com o mesmo efeito — ele não
  para no primeiro quadro, como a rodada 3 supunha.

E pausar no tempo 0 do documento também não serve: uma borboleta usa `voa 7s ease-in-out
infinite`, e a outra `voa 9s ease-in-out infinite .8s`. Durante o atraso de 0,8 s a animação ainda
não se aplica, e essa borboleta ficaria a 0°. Por isso o tempo corrente é o atraso de cada uma.

**A conferência das borboletas (RP-12; corrigida na rodada 6, depois da reprovação do
revisor).** No momento de cada print — inclusive o do menu —, o script acha as borboletas pela
**marcação do protótipo**: todo elemento cuja declaração de animação no próprio HTML (atributo
`style`) usa `voa`, **esteja a animação rodando ou não**. De cada uma, lê o ângulo no estilo
computado (o ângulo da matriz de `transform`). Esperado: **−8°, com tolerância de ±0,5°**. A saída
traz, por página e largura, uma linha como `borboletas: 2 de 2 a -8°`; página sem borboleta
declarada imprime `borboletas: 0 de 0` e não é falha. Se alguma estiver fora da tolerância, a linha
diz quantas e o script nomeia a página e a largura e sai com código 1 — junto com as faltas e os
estranhos do D5, na mesma saída final. A tolerância existe para arredondamento da matriz, não para
pose aproximada: −2°, o outro extremo da `voa`, fica bem fora dela.

Por que pela marcação, e não pelas animações em execução: a versão anterior contava só as
animações `voa` **rodando**. Com a animação desligada — `animation: none`, ou uma regra futura de
redução de movimento no protótipo —, as borboletas sumiam da lista, a saída dava `0 de 0` e o
código era 0. É exatamente a falha que esta change existe para pegar, e o requisito da spec manda
falhar nesse caso. Pela marcação, a borboleta sem animação continua na conta, aparece a 0° e
reprova.

**Zero no total é falha.** Se a soma de borboletas de todos os prints der zero, o comando sai com
código 1: o protótipo tem borboletas, então zero no total significa que a medição quebrou, e
"nada medido" não pode sair verde (RP-12).

**Limite conhecido.** A conferência roda **antes** do print e não enxerga o que uma opção do
próprio print faça durante a captura — `animations: 'disabled'` cancelaria as animações depois de
medidas e antes de fotografadas, com a conferência verde. Por isso o script fixa
`animations: 'allow'`, com um comentário no código dizendo por quê. Trocar essa opção é desfazer a
garantia sem que nenhuma verificação perceba.

Duas medidas acrescentadas pelo `dev-frontend` na implementação, registradas aqui:

- **O ponteiro sai de cima do link depois de cada clique.** Sem isso, o ponteiro continua sobre o
  último controle clicado e o botão Processo seletivo sai no print em estado de hover.
- **O navegador do script roda sem rede** (contexto `offline`). O protótipo é autocontido; se
  algum recurso dependesse de rede, ele faltaria em toda execução, e não só em algumas — o que
  mantém o resultado igual entre quem roda com e sem internet.

**Duas esperas de desenho, acrescentadas pela implementação (rodada 5, medido pelo
`dev-frontend`):**

| Instabilidade | Causa medida | Correção | Antes → depois |
|---|---|---|---|
| `noticias-390.png` saía às vezes sem o contorno tracejado e sem o texto "Imagem da publicação" do 2º cartão | O print saía antes de o navegador terminar de desenhar depois da troca de largura 1280 → 390 | Depois de cada troca de largura, esperar dois quadros de desenho | 9 defeituosos em 20 → 0 em 20 |
| `sobre-1280.png` variava em 1 pixel (x 67, y 103): resto da marca de "página atual" debaixo de Início | O navegador só redesenha o que mudou ao trocar de página. Os dois quadros acima não bastaram (1 em 15) | Antes de todo print, esconder a página por dois quadros e mostrá-la de novo, mais dois quadros | 1 em 15 → 0 em 25 |

O mecanismo interno do navegador por trás da segunda instabilidade **não foi confirmado**; o que
está registrado é o efeito medido e a correção que o eliminou.

**Prova:** 10 execuções seguidas, com as listas de sha256 dos 23 arquivos idênticas nas 10.

Por que bytes não são critério, mesmo assim: o briefing pede os mesmos nomes, e a estabilidade de
bytes acima vale **nesta máquina**. A rasterização de fonte e de
imagem muda entre sistemas operacionais e versões do navegador, então o mesmo comando dá bytes
diferentes no Windows do Gabriel e num Linux. Exigir bytes iguais faria o critério depender da
máquina. **Medida informativa:** a tarefa 2.3 roda duas vezes na mesma máquina e registra quantos
dos 23 arquivos saíram byte a byte iguais. Se esse número for menor que 23, é sinal de
não-determinismo restante e vai para o relatório como achado, não como reprovação.

A altura da janela em 1280 px (800) não está no briefing. Ela quase não afeta o resultado — o
print é de página inteira e o único `min-height: 100dvh` do protótipo é o contêiner geral, mais
baixo que qualquer página —, mas fica escrita aqui para não variar entre quem roda.

### D5 — O contador e a falha (RP-12)

Ao fim, o script imprime `gerados: N de 23` e a lista dos que faltaram. Uma página que não chega
ao título esperado em tempo razoável conta como falta; o script segue para as próximas, para que a
saída mostre **todas** as faltas de uma vez.

Depois, diz quantos arquivos a pasta `prototipo/prints/` tinha e lista **todo arquivo** dela que
não está entre os 23 nomes, de qualquer extensão, não só PNG — `estranhos: N`, seguido de cada
nome. O script **não apaga** nenhum: apagar arquivo que alguém pôs ali é decisão de pessoa, e a
saída diz qual é.

Código 1 se N < 23, **ou** se houver algum estranho, **ou** se alguma borboleta estiver fora da
pose, **ou** se o total de borboletas medidas for zero (D4). Código 0 só com 23 de 23, zero
estranhos e todas as borboletas na pose. Isso vive dentro do script e não vira verificação nova no
CI.

Demonstração (tarefa 1.5), quatro execuções registradas: um título esperado trocado por um
inexistente (`21 de 23`, porque a página perde os dois prints, 1280 e 390; nomeia os dois; código
1); desfeita a troca (`23 de 23`, código 0); um arquivo estranho que **não é PNG** copiado para a
pasta (`estranhos: 1`, nomeia o arquivo, código 1); removido o estranho (`estranhos: 0`,
código 0).

### D6 — A exceção do RP-13 para os prints: texto final

Aprovado no Portão 1 (Q2 = a, com a emenda E1). O líder técnico aplica em
`docs/PADROES-DE-CODIGO.md` §8.1, no parágrafo que começa com "**A exceção é nominal, e o motivo
dela nomeia um comando.**", em duas edições:

**Edição 1 — troca de frase.** Onde está:

> Hoje é **uma**:

passa a estar:

> Hoje são **duas**:

(com os dois-pontos do original, porque a frase seguinte, sobre `src/lib/supabase/tipos.ts`, fica
como está e continua sendo a primeira das duas.)

**Edição 2 — acréscimo**, no mesmo parágrafo, logo depois de "falha se o versionado divergir.":

> E `prototipo/prints/*.png`, os 23 prints do protótipo aprovado, saída de
> `npm run prints:prototipo`. O motivo é o único desta lista que **não é mecânico**: o gabarito
> precisa ser visto no GitHub por quem confere o Portão 2 sem rodar comando — o gestor e a liga.
> Não fica à deriva porque o design não muda; regerar é decisão, e o diff dos 23 arquivos aparece
> inteiro no PR que a tomar. O gabarito só se regera quando o arquivo do protótipo muda, porque
> regerar em outra máquina altera pixels sem que nada tenha mudado.

Nada mais em §8.1 muda. A frase "trazia **duas**", na subseção "Por que 'motivo escrito' não
bastava", é histórica e fica como está.

Isso está **fora do que o briefing pedia**, foi aprovado pelo Gabriel e é declarado na entrega. O
`scripts/verificar-artefatos.mjs` **não** é alterado: nenhum padrão dele casa com
`prototipo/prints/`, então registrar a exceção no `VERSIONADO_POR_DECISAO` não teria efeito, e
acrescentar padrão seria mudar verificação do CI.

### D7 — README do protótipo em cinco linhas, fora do Prettier

O `.prettierignore` já exclui `prototipo/`, então o `prototipo/README.md` não é formatado e não
quebra `formatar:check`. Cinco linhas, uma ideia por linha: o que é; de onde veio, com o link;
que o design foi aprovado pela liga e não muda; como regerar, e que só se regera quando o arquivo
do protótipo muda (`npm run prints:prototipo`, e
`npx playwright install --with-deps chromium` na primeira vez, a mesma instrução que a
conferência do navegador já dá); onde está a regra de uso
(`docs/REFERENCIA-VISUAL.md`). O texto é técnico, não texto de tela, então não vem do
`conteudo-institucional.md`.

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Os prints novos diferirem dos do gestor (navegador e máquina diferentes) | Esperado: é a troca que o briefing pede. O lado a lado antigo × novo de 2 páginas vai no relatório (tarefa 2.2), para o gestor ver que é o mesmo design |
| Regerar em outra máquina produzir 23 arquivos modificados por diferença de rasterização | O gabarito só se regera quando o arquivo do protótipo muda; o diff aparece inteiro no PR (D6) |
| Um título do protótipo mudar e o script parar de achar a página | É o comportamento desejado: falha com código 1 e nomeia a página (D5) |
| O print sair no meio de uma animação, ou com a borboleta fora da pose | D4: finitas até o fim, infinitas pausadas no início do primeiro ciclo, espera do título e das fontes, e a conferência das borboletas, que falha com código 1. Conferido na tarefa 1.3 |
| O link do cabeçalho não estar visível em 1280 px | O cabeçalho em 1280 px tem 114,4 px e traz os links (medido pelo gestor em `REFERENCIA-VISUAL.md` §1); a tarefa 1.2 confirma |
| O `dev-frontend` trabalhar fora do `src/`, que é o escopo dele de costume | Escopo desta change fixado no Portão 1 (Q4): exatamente `scripts/prints-do-prototipo.mjs`, a linha no `package.json`, `prototipo/prints/` e `prototipo/README.md`. O líder técnico confere pelo `git status` |

## Open Questions

Nenhuma. Q1 = (b), Q2 = (a), Q3 = (a) e Q4 = (a) foram decididas no Portão 1 e estão na proposta,
em "Decisões do Portão 1".
