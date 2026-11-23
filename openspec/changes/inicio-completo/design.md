# Design — página inicial completa da R1

## Context

Ver `proposal.md`, seção Why. Estado lido na `main` `6bcc393` pelo especificador:

| O que | Situação |
| --- | --- |
| Rota da raiz | `src/app/(site)/(publicas)/page.tsx` só compõe `HeroDaInicial` (`_inicio/`). O comentário já diz que os blocos chegam na `inicio-completo` |
| Hero | `_inicio/HeroDaInicial.tsx` e `.module.css`: `section` com fundo da página, preenchimento de baixo `--espaco-secao`; os botões leem a lista única. **Não muda** |
| Processo seletivo | `features/processo-seletivo/conteudo.ts` (`CONTEUDO_DO_PROCESSO_SELETIVO`: `titulo`, `inscricoes.estado` `'fechado'`, `inscricoes.selo`, `inscricoes.aviso` como `TextoComLink`, com `nomeAcessivelDoLink`); `tipos.ts` com a união `SituacaoDasInscricoes`; `FaixaDoTopo.tsx` desenha o aviso com o link |
| Bloco de contato | `componentes/padroes/`: `QuadroDeContato` (variantes `externo`, `email`, `texto`; círculo `--tamanho-circulo-de-contato`, 100 px; vão `--space-4`; contraste medido só sobre `--color-bg`), `QuadroDoInstagram`, `QuadroDoEmail`, `QuadroOndeEstamos`, `ListaDeContatos` (o comentário já prevê a inicial com Instagram e E-mail), `contato-da-liga.ts` |
| Contato | `features/contato/conteudo.ts`: só o topo de `/contato` |
| Lista única | `src/lib/utils/paginas-publicas.json`, 6 entradas; `/` com título e descrição do §2.0. **Não muda** |
| e2e da raiz | `tests/e2e/pagina-inicial.spec.ts`: 200 sem redirecionamento, texto do hero, botões, quadro, borboletas, contraste do lema |
| Gabarito 1280 | Números: grade `data-resp4` dentro da seção do hero, 4 colunas, vão 18 px, margem de cima 56 px, sobra de baixo 56 px. Faixa: `section` com preenchimento 72/28 px; cartão `.cta-box` `data-resp` com fundo `--color-accent` (lilás), raio `--radius-lg` × 1,4, preenchimento 52/56 px, grade `minmax(0,1fr) auto`, vão 36 px; círculo decorativo de 280 px, `right:-70px; bottom:-90px`, `rgba(78,50,96,.35)`; selo `.tag` creme com texto `--color-accent-800`; título `h2` creme; botão creme com texto `--color-accent-800`. Contato: seção em superfície, sobretítulo, `h2` "Onde a Liga responde", frase, botão; à direita, cada canal num cartão `background: var(--color-bg)`, `--radius-lg`, preenchimento 18/22 px, grade `104px 1fr`, vão 20 px |
| Gabarito 390 | Números em 2 × 2; faixa com o botão na largura toda, abaixo do texto; contato numa coluna, o título em cima e os dois cartões abaixo |
| Lidos no `prototipo/Portal-LIACUP.html` | Os rótulos `indicadores` ("membros ativos", "cursos representados", "ações realizadas"); a frase e o botão do contato; o botão "Ver o edital" leva à página do processo seletivo |

## Goals / Non-Goals

**Goals:**

- Cada bloco lê de um lugar só de dados; nenhum componente guarda texto institucional.
- A faixa e `/processo-seletivo` leem o mesmo objeto, e não cópias.
- O bloco de contato é o da `pagina-contato`, sem copiar código, e `/contato` não muda na tela.
- A regra de camadas continua passando sem exceção.
- A produção continua igual.

**Non-Goals:** ver "Fora de escopo" da proposta. Este design também não prepara o estado
"inscrições abertas" além do que a união de tipos já obriga.

## Decisions

### D1 — Onde cada parte mora (camadas)

A regra: uma feature nunca importa de outra, e duas features conversam pela rota que as compõe
(`PADROES-DE-CODIGO.md` §1). Então **cada bloco mora na feature do seu domínio, e a rota da raiz os
compõe**, lendo os dados e passando por props.

- **Rota** `src/app/(site)/(publicas)/page.tsx`: compõe, na ordem, `HeroDaInicial`, os números, a
  faixa e o contato. Importa os componentes e os dados das três features (a camada `app` pode
  importar de tudo). Não guarda texto.
- **Números**, feature nova `src/features/numeros-da-liga/`: `tipos.ts`, `conteudo.ts` (os quatro
  números e os rótulos), `conteudo.test.ts` e `componentes/NumerosDaLiga`. O nome é do domínio, os
  números que a diretoria revisa na passagem de gestão (§9), e não da página. O painel da R3 edita
  esse domínio, e o `dados.ts` chega quando ele existir.
- **Faixa**, em `src/features/processo-seletivo/componentes/`, um componente novo (o dev escolhe o
  nome, por exemplo `FaixaDaInicial`), que recebe por props o `titulo`, a `SituacaoDasInscricoes` e
  o rótulo do botão. Fica na feature dona do estado das inscrições porque, quando o estado "aberto"
  entrar na união, o TypeScript aponta este componente junto com a `FaixaDoTopo`. A rota passa
  `CONTEUDO_DO_PROCESSO_SELETIVO`, o mesmo objeto que `/processo-seletivo` usa.
  - **Alternativa considerada:** o componente em `_inicio/`, lendo o conteúdo direto. A camada
    `app` permite, mas o tratamento do estado das inscrições ficaria fora do domínio dele.
    Descartada.
  - **Alternativa descartada:** uma feature `features/inicio/`. Ela não pode importar de
    `features/processo-seletivo/`, e "início" é página, não domínio.
- **Contato**, em `src/features/contato/`: `componentes/ContatoDaInicial` (sobretítulo, `h2` e a
  `ListaDeContatos` com `QuadroDoInstagram` e `QuadroDoEmail`), e os rótulos do topo do bloco em
  `conteudo.ts`, ao lado dos de `/contato`. A feature `contato` importa de `padroes`, o que é
  permitido. É também onde o formulário da R4 vai morar.
- **O link do aviso** é desenhado como na `FaixaDoTopo`. Se o dev extrair o `Aviso` para reusar nas
  duas faixas, a extração fica dentro de `features/processo-seletivo/` e a `FaixaDoTopo` não muda na
  tela. O e2e de `/processo-seletivo` continua verde sem alteração.

### D2 — Que spec muda, e qual não muda

- `pagina-inicial`: 8 requisitos ADDED. O do hero não muda. O `## Purpose` da spec principal diz
  hoje que a página "é o hero". O líder técnico o atualiza depois do archive, no molde do que fez em
  `pagina-contato` (follow-up do `tasks.md`).
- **Não mudam:** `navegacao-publica`, `seo`, `pagina-contato`, `pagina-processo-seletivo`,
  `referencia-visual`, `publicacao-do-site` e `fundacao-e-ci`. O motivo de cada uma está na proposta,
  em Capabilities.

### D3 — Os números

- Tipo: uma lista somente-leitura de `{ valor, rotulo }`, os dois `string` (o "2026" é ano, não
  quantidade, e nenhum cálculo usa os números). A ordem é a do §9.
- `conteudo.test.ts`: exige 4 itens, nenhum valor nem rótulo vazio, e imprime `números: 4`.
- Composição: uma `section` própria, logo depois da do hero, com o mesmo fundo. **O hero não muda.**
  O vão entre os botões do hero e os cartões sai do preenchimento de baixo do hero mais o de cima
  da seção nova. O dev mede o vão contra o gabarito e registra. Se a diferença só fechar mexendo no
  hero, **para e reporta**: não muda o hero.
- Lista com papel de lista explícito (`role="list"`, pelo WebKit, como as outras), sem nome
  acessível inventado: nenhum texto fora do documento e da §7, nem em `aria-label`.
- Cartão: o fundo, o raio, o preenchimento, a fonte do número (Caprasimo) e a do rótulo são lidos
  do protótipo e viram tokens novos se não existirem. A grade sai do `data-resp4`: 4 colunas em
  1280 e 2 × 2 em 390. Nas larguras intermediárias, o dev lê o corte do `data-resp4` no CSS do
  protótipo, dentro dos cortes permitidos (480, 768, 1024), e registra.
- Contraste (RP-09): o número em `--color-accent-800` e o rótulo em texto secundário
  (`--color-neutral-700`, §3), contra o fundo do cartão, medidos e nomeados.

### D4 — A faixa do processo seletivo

- **Conteúdo:** o selo `inscricoes.selo`, o `titulo` como `h2` (Q2 (a)), o aviso
  `inscricoes.aviso` com o link, e o botão. **Sem a apresentação** do §5.2, que o briefing não pede
  e o gabarito não tem.
- **O rótulo do botão** (Q3) entra no `CONTEUDO_DO_PROCESSO_SELETIVO` como campo novo (por exemplo,
  `chamadaDaInicial.rotuloDoBotao`), com o tipo em `tipos.ts` e a conferência de não vazio em
  `conteudo.test.ts`. Só linhas acrescentadas nesses três arquivos. Com a Q3 (a), o texto é
  "Quero participar", o rótulo que o hero já usa; o hero continua com o dele, e a duplicação fica
  registrada como dívida pequena (dois lugares com o mesmo rótulo).
- **O botão segue a lista única:** aparece só se `/processo-seletivo` estiver na lista
  (`estaNaLista`, como o hero). É um link com aparência de botão (`aparenciaDeBotao`), com os
  estados do ADR-0006.
- **A troca exaustiva pelo estado:** a faixa trata `inscricoes.estado` por `switch` exaustivo, para
  o estado "aberto" não passar calado quando entrar.
- **Cor do cartão (Q7):** com a (a), o fundo é `--color-accent-600` `#82558f`, texto creme
  `--color-bg` (4,84:1). O círculo decorativo é o do protótipo, com cor e posição em tokens novos.
  O dev mede o pior caso de texto e do link sobre o círculo, com o hover e o pressionado. Se algum
  par ficar abaixo de 4,5:1, **para e reporta**, sem trocar cor por conta própria. O selo segue o
  `.tag` da inicial do protótipo (fundo creme e texto `--color-accent-800`), e não o selo verde da
  `/processo-seletivo`: cada tela segue o seu gabarito.
- **O link do aviso** sobre o cartão: creme sublinhado, com foco claro (como a `FaixaDoTopo`, que
  troca o anel por `--color-bg` sobre fundo escuro), alvo de 44 px e o nome acessível que já está
  no conteúdo.
- **Composição:** a grade `minmax(0,1fr) auto` do `.cta-box` acima do corte e uma coluna abaixo,
  com o botão na largura toda em 390. O corte vem do `data-resp` do protótipo e é lido pelo dev.

### D5 — O bloco de contato

- **Topo (Q4 (a)):** sobretítulo "Contato" em parágrafo e `h2` "Onde a Liga responde", sem frase e
  sem botão (Q5 (a)). Seção em superfície, como o gabarito.
- **Moldura (Q6 (a)):** o `QuadroDeContato` ganha uma prop de variante de apresentação, por exemplo
  `apresentacao: 'solto' | 'cartao'`, com `'solto'` como padrão (§2.3: variante, e não booleana;
  prop opcional com padrão declarado). `QuadroDoInstagram` e `QuadroDoEmail` repassam a prop. No
  `'cartao'`: fundo `--color-bg`, `--radius-lg`, preenchimento 18/22 px, círculo de 104 px e vão de
  20 px, lidos do protótipo e postos em tokens novos. O **link é o próprio cartão**, com a camada
  de cobertura que já existe, e o foco contorna o cartão. Em `'solto'`, nada muda: `/contato` fica
  pixel a pixel igual, e o `guardiao-visual` confere em 390 e 1280.
- **Contraste (RP-09):** o rótulo e o dado sobre o cartão `--color-bg` já estão medidos (5,53:1 e
  9,05:1). O hover e o pressionado são medidos de novo sobre o fundo do cartão; o sobretítulo e o
  título, sobre a superfície da seção.
- **Teste de unidade:** o `ListaDeContatos.test.tsx` ganha a composição da inicial com
  `'cartao'` e imprime `quadros na composição da inicial: 2`, que já existe, e
  `apresentação cartão: 2`.
- **Nota de reúso (I1 da `pagina-contato`):** os dados continuam fixos (`contato-da-liga.ts`). O
  critério do I1 (destino só `https://`, `mailto:` sem `?`, `&` nem quebra de linha) não é acionado,
  e o destino dele não muda: a primeira change que passar dado variável ao quadro.
- **Com a Q6 (c):** nenhum arquivo de `padroes/` muda, e a seção usa os quadros como estão.

### D6 — A composição da raiz

- A ordem no código é a de leitura, em toda largura: hero, números, faixa, contato. Nenhuma grade
  reordena.
- Títulos: o `h1` do hero; o `h2` da faixa; o `h2` do contato. Os números não têm título.
- Fundos (gabarito): hero e números no fundo da página; a faixa numa seção no fundo da página, com o
  cartão; o contato em superfície.
- A rota da raiz não ganha `metadata` nova: continua `montarMetadados('/')`.

### D7 — Verificações e RP-12

O `qa-acessibilidade` escreve no `tests/e2e/pagina-inicial.spec.ts` (e num apoio de leitura do
documento, se não couber), lendo o documento, a §7 e o protótipo, sem copiar texto:

1. **Números:** do §9, os quatro da frase "Os indicadores aprovados (…)", lidos entre parênteses.
   Imprime `números lidos do documento: 4`. Os rótulos vêm da linha nova da §7. Confere a ordem, a
   lista de 4 itens e a disposição (2 colunas em 390, 4 em 1280).
2. **Faixa:** o aviso do §5.1, palavra por palavra; o selo e o título, da §7. Confere o link (destino,
   nova aba, `rel` sem acesso nem origem, nome acessível com o texto visível), o botão com destino
   `/processo-seletivo` e os termos proibidos ("2026.2", "Inscrições abertas", "28 de agosto",
   "prova de conhecimentos", "Ver o edital", datas no formato dd/mm). **Fonte única:** abre
   `/processo-seletivo`, lê o selo e o aviso de lá e compara com os da faixa; imprime
   `faixa e página: 2 trechos iguais`. **Contraste** de cada texto da faixa sobre o cartão e sobre o
   círculo, como o teste do lema, com as cores nomeadas.
3. **Contato:** o @ e o e-mail do §1; o sobretítulo e o título da §7; a lista de 2 itens; um ponto
   perto do canto de cada cartão pertence ao link; o nome acessível começa pelo texto visível; os
   termos proibidos (a frase, "Mandar uma mensagem", "Onde estamos", `liacup@unb.br`, as legendas do
   §6, o travessão).
4. **Fora da R1:** os termos do requisito, lidos do protótipo; nenhuma `section` sem texto.
5. **Ordem e títulos:** a sequência dos blocos; 1 `h1`, 2 `h2`, nenhum salto; a ordem de foco igual
   nas 7 larguras.
6. Os contadores das medições gerais (`listas-anunciadas`, alvos) sobem sozinhos.
   `paginas-publicas.spec.ts`, `interruptor.spec.ts` e `playwright.config.ts` **não mudam**.

Demonstrações de falha, cada uma com a saída vermelha e a verde no relatório:

| # | Violação temporária | Vermelho esperado |
| --- | --- | --- |
| 1 | "21" trocado por "22" no lugar dos números | e2e: o trecho, o esperado do §9 e o recebido |
| 2 | Três números no lugar dos dados | unidade: a quantidade |
| 3 | Uma palavra do aviso trocada no conteúdo do processo seletivo | e2e da inicial: o trecho; e2e de `/processo-seletivo`: o trecho |
| 4 | A faixa com o aviso escrito na composição, e o conteúdo alterado | e2e: "faixa e página divergem", com os dois textos |
| 5 | "Ver o edital" no lugar do rótulo do botão | e2e: o termo e onde |
| 6 | Uma seção "Próximos eventos" vazia, com `h2` | e2e: o termo e a seção sem texto |
| 7 | O link do contato só no miolo, e não no cartão inteiro | e2e: o cartão e o ponto fora do link |
| 8 | O fundo do cartão da faixa no lilás da marca | e2e de contraste: o texto, as duas cores e a medida |
| 9 | A lista dos números sem o papel de lista | e2e das listas anunciadas: a página e a lista |

Depois, `git status --porcelain` igual ao de antes, `sha256sum -c` com OK nos arquivos tocados e
`git grep -c --untracked DEMO-RP12 -- src tests/e2e` com código 1. Nenhuma demonstração toca
`src/proxy.ts`.

### D8 — Escopo nominal e conferência proporcional

| Quem | Arquivos |
| --- | --- |
| `dev-frontend` | `src/app/(site)/(publicas)/page.tsx` (e um `page.module.css` ao lado, se a composição pedir); `src/features/numeros-da-liga/` (nova); em `src/features/processo-seletivo/`, o componente novo da faixa e só linhas acrescentadas em `conteudo.ts`, `tipos.ts` e `conteudo.test.ts`; em `src/features/contato/`, o componente novo e só linhas acrescentadas em `conteudo.ts`, `tipos.ts` e `conteudo.test.ts`; com a Q6 (a), `src/componentes/padroes/QuadroDeContato.{tsx,module.css}`, `QuadroDoInstagram.tsx`, `QuadroDoEmail.tsx` e `ListaDeContatos.test.tsx`; `src/estilos/tokens.css` só com linhas acrescentadas |
| `qa-acessibilidade` | `tests/e2e/pagina-inicial.spec.ts` e, se preciso, um apoio de leitura novo em `tests/e2e/` |
| `guardiao-visual` | `openspec/changes/inicio-completo/prints/` |
| Líder técnico | `docs/REFERENCIA-VISUAL.md` §7 (tarefas 1.1 e 1.2); `docs/conteudo-institucional.md` só com a Q1 (c) ou a Q4 (b); `docs/SEGURANCA.md` §7 (tarefa 4.2); o `relatorio.md` |
| `especificador` | `openspec/changes/inicio-completo/` |

**Não mudam:** `src/app/(site)/(publicas)/_inicio/`, `src/lib/utils/paginas-publicas.json` e o teste
dela, `src/proxy.ts`, `src/app/layout.tsx`, `src/app/(site)/em-construcao/`, `src/componentes/layout/`,
`src/componentes/ui/`, os outros arquivos de `src/componentes/padroes/` (e todos eles, com a Q6 (c)),
`src/features/processo-seletivo/componentes/` existentes, `src/features/contato/componentes/TopoDoContato*`,
as rotas das outras páginas, `assets/`, `public/`, `tests/e2e/paginas-publicas.spec.ts`,
`tests/e2e/interruptor.spec.ts`, `playwright.config.ts`, `lighthouserc.json`, `scripts/`, `.github/`,
`package.json`, `package-lock.json`, `docs/PLANO-DE-DESENVOLVIMENTO.md`, `docs/PADROES-DE-CODIGO.md`
e `openspec/specs/`. Arquivo fora das listas é desvio, nomeado na entrega.

**Conferência proporcional do guardião** (`SEGURANCA.md` §5): os prints do `guardiao-visual` são
binários novos, e a §7 manda a linha de origem no mesmo diff. Com isso o **`docs/SEGURANCA.md` entra
no diff**, e ele está na lista do gatilho: **passo 1, checklist inteiro.** Todo o resto do diff
previsto está na lista de tela, e nenhum arquivo acrescenta `process.env` nem `NEXT_PUBLIC_`.

### D9 — O P23

Pela forma da `SEGURANCA.md` §5, sem mudança nela. Host exato
`portal-liacup-git-feat-inicio-completo-liacup1.vercel.app` (46 caracteres antes de `.vercel.app`,
contados à mão; abaixo do corte de 63), rota `/`. O Gabriel confirma o host, letra por letra, e o
commit no painel da Vercel antes do `curl`. A resposta esperada é `200`, sem `Location`, com
`X-Matched-Path: /` (e não `/em-construcao`). Fica registrado no `relatorio.md` e commitado antes do
merge.

### Fontes do texto que vai ao ar

| Texto | Fonte |
| --- | --- |
| "21", "7", "4", "2026" | `conteudo-institucional.md` §9 |
| Rótulos dos números | Q1; com a (a), protótipo, rótulos de interface na §7 |
| "Inscrições fechadas" | §7, linha "Processo seletivo, selo da faixa do topo" |
| Título da faixa | Q2; com a (a), o `titulo` do conteúdo do processo seletivo |
| Aviso | §5.1 |
| Rótulo do botão da faixa | Q3; com a (a), "Quero participar", do hero, na §7 |
| "Contato" e o título do bloco | Q4; com a (a), "Contato" (já na §7) e "Onde a Liga responde", rótulo de interface na §7 |
| "Instagram", "E-mail", `@liacup.unb`, `liacup.unb@gmail.com` | §7, linha "Contato, página", e §1 |

## Risks / Trade-offs

| Risco | Mitigação |
| --- | --- |
| O vão entre o hero e os números não fechar sem mexer no hero | D3: o dev mede e registra; se só fechar mexendo no hero, para e reporta; o `guardiao-visual` classifica |
| A variante "cartão" mudar `/contato` sem ninguém ver | `'solto'` como padrão; o `guardiao-visual` compara `/contato` antes e depois em 390 e 1280, com 0 px de diferença; o e2e de `/contato` continua verde sem alteração |
| Um texto da faixa reprovar sobre o círculo decorativo | O e2e de contraste mede sobre o círculo (D7, item 2); se reprovar, o dev para e reporta |
| A faixa ler uma cópia do aviso, e não o conteúdo | A rota passa o objeto; o e2e compara a faixa com `/processo-seletivo`; demonstrações 3 e 4 |
| O "21" estar velho na data do lançamento | Apontado na proposta; o plano já põe números atualizados na `homologacao-r1` |
| Mexer no `conteudo.ts` do processo seletivo quebrar a página | Só linhas acrescentadas; `git diff --numstat` com 0 removidas; o e2e de `/processo-seletivo` sem alteração |
| `openspec validate` recusar o delta | O especificador não rodou o validador (sem terminal). O líder técnico roda antes do Portão 1 |

## Open Questions

As oito Qn estão na proposta, seção "Questões para o Portão 1", com opções, custo e recomendação.
Todas mudam specs ou tarefas e precisam de decisão no Portão 1. Este design e as specs seguem a
recomendação de cada uma.

| Qn | Assunto | Recomendação |
| --- | --- | --- |
| Q1 | Rótulos dos números | (a) os do protótipo, na §7 |
| Q2 | Título da faixa | (a) "Processo seletivo" |
| Q3 | Rótulo do botão da faixa | (a) "Quero participar" |
| Q4 | Topo do bloco de contato | (a) "Contato" e "Onde a Liga responde", sem frase |
| Q5 | Botão "Mandar uma mensagem" | (a) sai |
| Q6 | Moldura dos quadros na inicial | (a) variante "cartão" do quadro, link no cartão inteiro |
| Q7 | Cor do cartão da faixa | (a) `--color-accent-600` |
| Q8 | "Chamadas" do plano | (a) nenhum bloco a mais |
