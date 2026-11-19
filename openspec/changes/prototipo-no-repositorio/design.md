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
emulada, e animações desligadas no print — as finitas terminam e as infinitas (borboletas) voltam
ao quadro inicial — além de uma folha de estilo injetada que zera `animation` e `transition`, porque
o protótipo não respeita a redução de movimento no `<main>` nem nas borboletas. O cursor de texto é
escondido.

Por que bytes não são critério: o briefing pede os mesmos nomes. A rasterização de fonte e de
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

Depois, lista os PNG da pasta `prototipo/prints/` que não estão entre os 23 nomes — `estranhos: N`,
seguido de cada nome. O script **não apaga** nenhum: apagar arquivo que alguém pôs ali é decisão de
pessoa, e a saída diz qual é.

Código 1 se N < 23 **ou** se houver algum estranho; código 0 só com 23 de 23 e zero estranhos.
Isso vive dentro do script e não vira verificação nova no CI.

Demonstração (tarefa 1.5), quatro execuções registradas: um título esperado trocado por um
inexistente (`22 de 23`, nomeia o print, código 1); desfeita a troca (`23 de 23`, código 0); um PNG
estranho copiado para a pasta (`estranhos: 1`, nomeia o arquivo, código 1); removido o estranho
(`estranhos: 0`, código 0).

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
| O print sair no meio de uma animação | D4: animações desligadas e espera do título e das fontes. Conferido na tarefa 1.3 |
| O link do cabeçalho não estar visível em 1280 px | O cabeçalho em 1280 px tem 114,4 px e traz os links (medido pelo gestor em `REFERENCIA-VISUAL.md` §1); a tarefa 1.2 confirma |
| O `dev-frontend` trabalhar fora do `src/`, que é o escopo dele de costume | Escopo desta change fixado no Portão 1 (Q4): exatamente `scripts/prints-do-prototipo.mjs`, a linha no `package.json`, `prototipo/prints/` e `prototipo/README.md`. O líder técnico confere pelo `git status` |

## Open Questions

Nenhuma. Q1 = (b), Q2 = (a), Q3 = (a) e Q4 = (a) foram decididas no Portão 1 e estão na proposta,
em "Decisões do Portão 1".
