# Proposta — página Contato

## Why

A R1 precisa de um lugar onde quem chega ao site encontra a liga: o Instagram, o e-mail e a sede. Os
três dados estão confirmados no `conteudo-institucional.md` §1, e o protótipo tem a composição
(`prototipo/prints/contato-{390,1280}.png`): sobretítulo, título, três quadros de contato à esquerda
e o formulário à direita. O formulário é da R4 e não entra. Junto entra o que a `pagina-projetos`
deixou para a primeira tarefa desta change (Q10 (b) de lá).

## What Changes

1. **A evidência herdada da `pagina-projetos` e a prova do push pela execução #46**, no
   `relatorio.md`, pelo líder técnico (tarefa 1.1, já feita; `design.md`, D9).
2. **`/contato`**, na composição do gabarito, sem o formulário:
   - topo: sobretítulo "Contato" e título principal "Fale com a Liga", rótulos de interface
     registrados na `REFERENCIA-VISUAL.md` §7. A frase de baixo do protótipo não está no documento:
     a **Q1** decide;
   - três quadros, nesta ordem, cada um com o rótulo, o dado e uma imagem à esquerda:
     **Instagram**, com a logo da liga e `@liacup.unb`, o quadro inteiro clicável, em nova aba;
     **E-mail**, com o ícone do Gmail e `liacup.unb@gmail.com`, o quadro inteiro clicável, abrindo
     um e-mail novo; **Onde estamos**, com a borboleta do protótipo e a sede do §1, como texto, e
     não como link. Qual endereço é a **Q2**; onde o documento tem travessão, a tela usa "·"
     (`REFERENCIA-VISUAL.md` §5);
   - sem as legendas "Perfil do Instagram", "Logo do e-mail" e "Foto de perfil do Instagram da liga"
     (`REFERENCIA-VISUAL.md` §6), sem nenhum dado errado do protótipo (`liacup@unb.br`, "Faculdade
     de Medicina", "Darcy Ribeiro") e sem nenhum campo de formulário;
   - o que fica no lugar do formulário é a **Q3**, com print de cada opção em 390 e 1280.
3. **O bloco de contato é um componente só**, que a `inicio-completo` vai reaproveitar com o
   Instagram e o e-mail, sem copiar código (`design.md`, D1).
4. **A lista única ganha Contato**, a última do menu, como no protótipo (Início, Sobre, Projetos,
   Equipe, Contato), e, no rodapé, a última da coluna "Conteúdo". Título "Contato · LIACUP";
   descrição pela **Q4**.
5. **O interruptor** leva `/contato` à página em construção quando o site não está publicado,
   provado na spec e no e2e da própria página, como a Q4 (a) da `pagina-projetos`.
6. **Os prints desta change** (os da Q3 e os do `guardiao-visual`) e a cópia do ícone do Gmail em
   `public/` são binários novos: ganham linha de origem no `docs/SEGURANCA.md` §7, no mesmo diff.
   **Com isso o `docs/SEGURANCA.md` entra no diff, ele está na lista do gatilho, e o guardião faz
   o checklist inteiro** (passo 1 da conferência proporcional). É o custo conhecido até a regra
   geral dos prints, na `lancamento-r1`.

As specs e as tarefas seguem as recomendações das Qn. Se o Gabriel decidir outra opção, o
especificador ajusta specs, `design.md` e `tasks.md` antes do apply.

**Critérios de aceite** (os do briefing):

- Lado a lado do `guardiao-visual` em 390 e 1280 px da página e do menu aberto em 390, com cada
  diferença classificada. Entram também o cabeçalho em 1280 e o rodapé, que ganham o destino novo.
- Texto idêntico ao documento, palavra por palavra, por teste que lê o documento; nenhum dado errado
  do protótipo na tela (`liacup@unb.br`, "Faculdade de Medicina", "Darcy Ribeiro").
- Os links do Instagram e do e-mail fazem o que a `REFERENCIA-VISUAL.md` §7 manda, por teste.
- e2e verde nas 7 larguras, nos dois modos do interruptor; axe 0; nenhuma rolagem horizontal;
  Lighthouse ≥ 90, acessibilidade ≥ 95 e SEO ≥ 95 na página nova, publicada.
- Com o site não publicado, `/contato` responde 307 para `/`, e a página em construção continua
  idêntica.
- P23 com 200 e sem `Location` em `/contato`, na prévia da branch `feat/pagina-contato`, no host
  `portal-liacup-git-feat-pagina-contato-liacup1.vercel.app`, com o host e o commit confirmados
  pelo Gabriel, registrado antes do merge.

**Conta de tarefas: 14 de 15** (`tasks.md`). A change não se divide.

## Questões para o Portão 1

Caracteres contados à mão pelo especificador; o teste de unidade confere.

**Q1. A frase abaixo do título.** O protótipo traz "Dúvidas sobre o processo seletivo, convites
para eventos e parcerias com serviços de saúde." (lida no `prototipo/Portal-LIACUP.html`), que não
está no documento.

- (a) Sem frase: sobretítulo e título, como a Equipe e Projetos. Custo: uma linha a menos que o
  gabarito, diferença a classificar; os quadros sobem.
- (b) A frase do protótipo, registrada no `conteudo-institucional.md` §1 com a autorização escrita
  do Gabriel. Custo: o site passa a convidar "parcerias com serviços de saúde", um compromisso que a
  liga não escreveu em nenhum documento.
- Recomendo (a), pelos dois precedentes e porque nada se inventa.

**Q2. O endereço de "Onde estamos".**

- (a) O curto do rodapé: "FCTS · Campus UnB Ceilândia · Brasília/DF". Custo: nenhum texto novo (a
  regra já está na `REFERENCIA-VISUAL.md` §7, para o rodapé), mas a página de contato repete o
  rodapé da mesma tela e não traz QNN nem CEP. O teste confere contra a linha do rodapé na §7, e
  não contra o §1.
- (b) O completo do §1, com o travessão trocado por "·": **"FCTS · Campus UnB Ceilândia, QNN 14
  Área Especial, Ceilândia Sul, CEP 72220-140, Brasília/DF"** (92 caracteres). Custo: 3 a 4 linhas
  em 390, contra 2 no gabarito; e uma tensão com "texto idêntico, palavra por palavra": as palavras
  são as do §1, mas um sinal muda. O teste lê a célula "Sede" do §1, troca " — " por " · ", exige
  exatamente **1** troca (e imprime a contagem) e compara o resultado com a tela; um travessão na
  tela deixa o teste vermelho. A troca fica registrada na linha da §7.
- Recomendo (b), porque quem abre a página Contato procura como chegar, e o texto vem direto do §1.

**Q3. O que fica no lugar do formulário.** Prints de cada opção em 390 e 1280, feitos pelo líder
técnico depois desta proposta, em `prints/q3-opcao-{a,b,c}-{390,1280}.png`, como esboço estático
com a faixa "ESBOÇO PARA DECISÃO, NÃO É O SITE" (método da Q3 da `pagina-sobre-e-equipe`). Nenhuma
traz conteúdo novo nem serviço de terceiros. Em 390, as três são iguais: uma coluna, sem formulário.

- (a) **Coluna única, a esquerda do protótipo.** Em 1280, sobretítulo, título e os três quadros
  ficam onde o gabarito os põe, na largura da coluna esquerda; a metade direita fica vazia, no fundo
  creme. Custo: o desktop fica desequilibrado, diferença a classificar. Na R4, o formulário entra à
  direita sem mexer em nada.
- (b) **Título à esquerda, quadros à direita.** Em 1280, sobretítulo e título na coluna esquerda, e
  os três quadros na coluna do formulário, alinhados ao topo do título. Custo: muda a posição dos
  quadros contra o gabarito (estrutura da página, melhoria a aprovar); com a Q1 (a), a coluna
  esquerda fica com duas linhas; na R4, os quadros voltam para a esquerda, com lado a lado novo.
- (c) **Quadro da borboleta no lugar do formulário.** Em 1280, a coluna esquerda como na (a); à
  direita, o quadro sem foto que a inicial e o Sobre já usam (superfície, borboleta grande em
  opacidade baixa, sem texto). Abaixo do corte de duas colunas, o quadro não aparece. Custo:
  elemento decorativo onde o protótipo tem formulário (melhoria a aprovar); pode parecer espaço
  reservado esperando conteúdo; sai na R4.
- Descartada: os três quadros como cartões lado a lado em 1280. A página Contato do protótipo não
  tem cartão, e o endereço da Q2 (b) quebraria em 4 ou 5 linhas num terço da largura.
- Recomendo (a), porque é o protótipo menos o formulário, sem nada novo a aprovar, e a R4 só
  acrescenta.

**Q4. A descrição de Contato para buscadores** (`PADROES-DE-CODIGO.md` §11.1). Nenhum trecho do
documento descreve a página: as duas frases com "Instagram" (§2.0 e §5.1) falam da agenda e do
processo seletivo.

- (a) **(fora do documento)** "Contato da Liga Acadêmica Multiprofissional de Cuidados Paliativos
  (LIACUP): Instagram @liacup.unb e e-mail liacup.unb@gmail.com.", **129** caracteres, só com
  palavras e dados do §1, registrada no §1 com a autorização escrita do Gabriel, como as de Projetos
  e Equipe. Custo: uma frase nova no documento.
- (b) **(fora do documento)** "Instagram, e-mail e sede da Liga Acadêmica Multiprofissional de
  Cuidados Paliativos (LIACUP), na FCTS, Campus UnB Ceilândia, Brasília/DF.", **137** caracteres,
  mesmo registro. Custo: o buscador mostra os canais sem os endereços.
- (c) O Gabriel escreve outra, de 70 a 160 caracteres. Custo: o mesmo registro no §1.
- Recomendo (a), porque quem procura o contato da liga já lê o @ e o e-mail no resultado da busca.

## Fora de escopo

- O formulário, a caixa de mensagens e o envio de e-mail (R4).
- O bloco de contato na inicial ("Onde a Liga responde"): é da `inicio-completo`, que reaproveita o
  componente desta change.
- Mapa embutido, botão "Como chegar" ou qualquer serviço de terceiros.
- Mudar o rodapé, a página em construção (`LinksDeContato`) ou o marcador de localização do rodapé.
- Qualquer outra página.
- Mudar `docs/PLANO-DE-DESENVOLVIMENTO.md`, `docs/PADROES-DE-CODIGO.md`, qualquer spec do gatilho,
  `.github/`, `scripts/`, `package*.json`, `src/proxy.ts`, `playwright.config.ts` ou
  `lighthouserc.json`. O `docs/SEGURANCA.md` muda só na §7 (linhas de origem, total e versão).

## Capabilities

### New Capabilities

- `pagina-contato`: o que `/contato` mostra, o comportamento dos dois links, o texto conferido
  contra o documento e o interruptor nela.

### Modified Capabilities

- `navegacao-publica`: a lista com seis páginas (o cenário "O que a lista mostra nesta entrega" muda
  por MODIFIED, como a `pagina-projetos` previu); o rodapé com Contato na coluna "Conteúdo"; a
  medição com 6 páginas.
- `seo`: os títulos e as descrições desta entrega passam a seis.

## Requisitos permanentes

| RP | Aplica? | Em uma linha |
| --- | --- | --- |
| RP-01 | Sim | Nenhuma dependência nova: 23 diretas antes e depois |
| RP-02 | Sim | `verificar:tokens` com código 0 |
| RP-03 | Sim | Token novo só acrescentado, com origem medida no protótipo |
| RP-04 | Sim | Os dois quadros clicáveis com os estados do ADR-0006 e alvo ≥ 44 px, medidos |
| RP-05 | Sim | Zero rolagem horizontal nas 6 páginas da lista, nas 7 larguras |
| RP-06 | Sim | Lighthouse nas 6 páginas publicadas e na raiz não publicada |
| RP-07 | Sim | axe 0 na página nova e na raiz não publicada |
| RP-08 | Sim | Cada diferença do lado a lado com veredito e motivo |
| RP-09 | Sim | Rótulos e dados dos quadros sobre o fundo, com o par medido e nomeado |
| RP-10 | Sim | O segredo de bypass do P23 nunca é versionado nem impresso |
| RP-11 | Não | Nenhuma tabela |
| RP-12 | Sim | Toda verificação nova vista falhando (`design.md`, D6) |
| RP-13 | Sim | `verificar:artefatos` com código 0; os prints e a cópia do Gmail entram com origem |
| RP-14 | Sim | Lado a lado do guardião e aprovação nominal do Gabriel no Portão 2 |

## Impact

| O que | Efeito | Quem escreve |
| --- | --- | --- |
| `src/` e `public/` (lista nominal no `design.md`, D7) | A página, o bloco de contato, a lista com 6 entradas e a cópia do ícone do Gmail | `dev-frontend` |
| `tests/e2e/` | Spec da página; `paginas-publicas` ajustado | `qa-acessibilidade` |
| `docs/REFERENCIA-VISUAL.md` §7 | Os rótulos e as decisões da Q1 a Q3 | líder técnico, no Portão 1 |
| `docs/conteudo-institucional.md` §1 | A descrição para buscadores (Q4) e, se a Q1 for (b), a frase | líder técnico, com autorização escrita do Gabriel, no Portão 1 |
| `docs/SEGURANCA.md` §7 | Origem dos prints e da cópia do Gmail, total e versão 3.4 | líder técnico, antes do guardião |
| Guardião | **Passo 1, checklist inteiro**: o `docs/SEGURANCA.md` está na lista do gatilho (`design.md`, D7) | `guardiao-appsec` |
| Produção | Nada muda: o interruptor leva `/contato` à página em construção | — |
| Prévias | A página, o destino no menu e no rodapé | — |
