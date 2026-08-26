# Portal LIACUP

Site institucional da **Liga Academica Multiprofissional de Cuidados Paliativos** da Universidade
de Brasilia (FCTS · Campus UnB Ceilandia).

Se voce esta lendo isto porque assumiu o projeto e nao conhece ninguem do time anterior: este
arquivo foi escrito para voce. Ele responde o que e o portal, como rodar, como testar, como
publicar, onde estao as decisoes e o que fazer quando alguma verificacao reclamar.

> **Estado atual: fundacao tecnica (F00).** O que esta no ar e uma pagina provisoria com a logo e
> a frase "Portal em construção". Ela existe so para provar que o caminho do codigo ate o ar
> funciona. As paginas de verdade — Sobre, Projetos, Equipe, Noticias, Processo Seletivo — ainda
> nao foram construidas.

---

## O que voce precisa instalar antes

| Ferramenta                    | Versao minima    | Para que                                  |
| ----------------------------- | ---------------- | ----------------------------------------- |
| [Node.js](https://nodejs.org) | **22**           | Roda o projeto. A versao esta no `.nvmrc` |
| [Git](https://git-scm.com)    | qualquer recente | Baixa e versiona o codigo                 |

Confira com `node -v`. Se aparecer algo menor que 22, instale a versao 22 antes de continuar.

## Como rodar

```bash
git clone <endereco-do-repositorio> portal-liacup
```

```bash
npm install
```

```bash
npm run dev
```

Abra <http://localhost:3000>. **`npm run dev` e o unico comando para trabalhar no projeto.**

## Como testar

```bash
npm run verificar
```

Roda as quatro verificacoes em sequencia — tipos, analise estatica, formatacao e tokens — e para na
primeira que falhar.

```bash
npm test
```

```bash
npm run test:e2e
```

Na primeira vez, o teste de ponta a ponta pede que voce instale o navegador. Ele diz o comando.

## Todos os comandos

| Comando                    | O que faz                                      |
| -------------------------- | ---------------------------------------------- |
| `npm run dev`              | Sobe o projeto para trabalhar                  |
| `npm run build`            | Gera a versao de producao                      |
| `npm start`                | Sobe a versao ja compilada                     |
| `npm run verificar`        | Tipos + analise estatica + formatacao + tokens |
| `npm run verificar:tipos`  | So a verificacao de tipos                      |
| `npm run lint`             | So a analise estatica                          |
| `npm run formatar:check`   | Confere formatacao sem alterar arquivo         |
| `npm run formatar`         | Corrige a formatacao                           |
| `npm run verificar:tokens` | Procura cor e medida escritas a mao            |
| `npm test`                 | Testes de unidade                              |
| `npm run test:watch`       | Testes de unidade, reexecutando ao salvar      |
| `npm run test:e2e`         | Testes de ponta a ponta, nas 7 larguras        |
| `npm run test:desempenho`  | Lighthouse contra a versao compilada           |

---

## Quando uma verificacao falha

Nenhuma destas verificacoes existe para atrapalhar. Cada uma impede um problema especifico. Se uma
delas reclamar, ela esta fazendo o trabalho dela.

### `verificar:tipos` reclamou

**O que checa:** que os tipos batem, e que a caixa dos caminhos de import esta correta.

**Por que existe:** o Windows ignora maiuscula e minuscula em nome de arquivo; o Linux, onde o CI
roda, nao ignora. Um import escrito `componentes/Ui/Botao` funciona na sua maquina e quebra no CI.

**O que fazer:** a mensagem diz o arquivo e a linha. Se for caixa de import, corrija para bater
exatamente com o nome do arquivo.

### `lint` reclamou sobre `import/no-restricted-paths`

**O que checa:** a regra de dependencia entre camadas da secao 1 de `docs/PADROES-DE-CODIGO.md`.

**Por que existe:** e o que impede o projeto de virar um novelo. Se cada pedaco puder importar de
qualquer outro, em seis meses ninguem consegue mexer em nada sem entender tudo.

**O que fazer:** a mensagem diz qual camada tentou importar de qual. As regras principais:

- `componentes/ui` nao conhece feature, banco nem rota — recebe props e desenha;
- **uma feature nunca importa de outra** — duas features que precisam conversar conversam pela
  rota que as compoe, em `src/app/`;
- `lib` nao importa de `features`, `componentes` nem `app`.

Voce **nao** precisa registrar nada ao criar uma feature nova: a protecao dela e gerada sozinha.

### `verificar:tokens` reclamou

**O que checa:** cor ou medida escrita a mao fora de `src/estilos/tokens.css`.

**Por que existe:** uma cor solta num componente e uma cor que ninguem mais encontra quando a
identidade muda. Token e o unico lugar onde cor e medida moram.

**O que fazer:** a mensagem diz o valor encontrado **e qual token usar no lugar**. Se o valor
realmente nao existir como token, crie um em `tokens.css` — criar token novo e permitido; alterar
o valor de um token existente, nao.

### `formatar:check` reclamou

**O que fazer:** rode `npm run formatar`. Nao ha discussao de estilo neste projeto.

### `test:e2e` reclamou de rolagem horizontal

**O que checa:** que nenhuma pagina gera barra de rolagem lateral em 360, 390, 430, 480, 768, 1024
e 1280 px.

**Por que existe:** a maior parte do publico chega pelo celular, vindo do Instagram. Rolagem
lateral no celular e o defeito que mais irrita e o mais facil de nao perceber no computador.

**O que fazer:** a mensagem diz **qual largura** falhou. Geralmente e um elemento com largura fixa
onde deveria haver largura maxima.

### `test:e2e` reclamou de acessibilidade

**O que checa:** o axe-core roda sobre a pagina e nao pode acusar nenhuma violacao.

**Por que existe:** este e um site de saude, lido por pessoas idosas, por pessoas em sofrimento e
por pessoas com deficiencia. Acessibilidade e requisito de entrega, nao polimento.

**O que fazer:** a saida do axe descreve a violacao e o elemento. Os erros mais comuns sao imagem
sem texto alternativo, campo sem rotulo e contraste insuficiente.

### `test:desempenho` reclamou

**O que checa:** Lighthouse na versao compilada, exigindo desempenho maior ou igual a 90 e
acessibilidade maior ou igual a 95.

**O que NAO fazer:** baixar o limiar em `lighthouserc.json`. Se a nota caiu, alguma coisa piorou —
quase sempre uma imagem grande demais. Corrija a causa.

---

## Como publicar

Nao ha passo manual. O que entra na `main` vai para o ar sozinho, e toda alteracao proposta ganha
um endereco de pre-visualizacao proprio.

O modelo de branches é **GitHub Flow**, escrito no
[`docs/ADR-0005-modelo-de-branches.md`](docs/ADR-0005-modelo-de-branches.md). Em uma frase:
**a `main` é sempre publicável, tudo entra por alteração proposta com CI verde, e incorporou está no
ar.**

O fluxo de trabalho, da F01 em diante:

1. crie um branch **a partir da `main`**: `git checkout -b feat/F02-camada-de-dados`;
2. abra uma alteracao proposta (pull request);
3. o CI roda todas as verificacoes automaticamente;
4. revise pelo endereco de pre-visualizacao;
5. incorpore. **Com o CI vermelho, o botao de incorporar fica bloqueado.**
6. apague a branch depois de incorporada.

**Se o portal quebrar em produção**: branch `fix/` a partir da `main`, a menor correção possível,
alteração proposta com `URGENTE` no título. O CI verde continua obrigatório — leva minutos, e é o
que impede uma correção apressada de quebrar outra coisa. O procedimento completo está no ADR-0005,
seção 2.4.

> A F00 foi desenvolvida direto na `main`, como excecao de arranque: nao havia CI nem protecao a
> respeitar ainda, e o primeiro CI precisa rodar uma vez para que as verificacoes passem a existir.

### Configuracao inicial — feita uma vez, pelo responsavel do projeto

Estes tres passos acontecem nas interfaces do GitHub e da Vercel, **nesta ordem**:

1. **Conectar a Vercel.** Em vercel.com, entrar com a conta do GitHub da liga, _Add New Project_,
   importar o repositorio e aceitar os padroes de Next.js. Isso ja entrega publicacao automatica da
   `main` e pre-visualizacao por alteracao proposta.
2. **Deixar o primeiro CI rodar.** Abra qualquer alteracao proposta e espere terminar.
3. **Proteger o ramo principal.** No GitHub, _Settings › Branches › Add branch protection rule_
   para `main`, exigindo alteracao proposta antes de incorporar e exigindo que as verificacoes
   passem — selecionando as que apareceram no passo 2.

> **A ordem importa e nao e detalhe.** A protecao so pode ser configurada depois que o CI rodou uma
> vez, porque antes disso o GitHub nao sabe quais verificacoes existem: a protecao fica vazia,
> parece configurada e nao barra nada.

**Depois de configurar, teste.** Crie um branch, quebre alguma coisa de proposito, abra uma
alteracao proposta e confirme que o botao de incorporar fica bloqueado. Se der para incorporar com
o CI vermelho, a protecao nao esta valendo — e todo o resto e decoracao.

### Alteracao vinda de fork e propostas simultaneas

- **Fork:** por seguranca, o GitHub nao entrega os segredos do repositorio para alteracoes vindas
  de fork. As verificacoes que nao dependem de segredo rodam normalmente. Como a liga trabalha com
  branches do proprio repositorio, isso nao afeta o dia a dia.
- **Duas propostas ao mesmo tempo:** cada uma recebe seu proprio endereco de pre-visualizacao. Uma
  nao sobrescreve a outra.

---

## Onde ficam as decisoes

Nada neste projeto foi decidido por preferencia pessoal. Tudo o que e regra esta escrito em
`docs/`, e em caso de conflito vale a ordem abaixo — numero menor vence:

| #   | Documento                                                | O que decide                                 |
| --- | -------------------------------------------------------- | -------------------------------------------- |
| 1   | [`docs/constitution.md`](docs/constitution.md)           | Os 9 principios inegociaveis do projeto      |
| 2   | Documento de aceite assinado pela liga                   | O que foi aprovado com a diretoria           |
| 3   | [`docs/PADROES-DE-CODIGO.md`](docs/PADROES-DE-CODIGO.md) | Estrutura de pastas, componentizacao, testes |
| 4   | `specs/<feature>/spec.md`                                | O comportamento daquela feature              |
| 5   | `specs/<feature>/plan.md`                                | A tecnologia daquela feature                 |

Decisoes de arquitetura ficam em ADRs, que **nao se editam**: decisao nova substitui a anterior com
um ADR novo.

- [`docs/ADR-0001-stack.md`](docs/ADR-0001-stack.md) — por que Next.js, TypeScript, Supabase e Vercel
- [`docs/ADR-0002-envio-de-email.md`](docs/ADR-0002-envio-de-email.md) — por que Resend
- [`docs/ADR-0004-controles-e-fidelidade.md`](docs/ADR-0004-controles-e-fidelidade.md) — tamanho dos controles e verificação de fidelidade
- [`docs/ADR-0005-modelo-de-branches.md`](docs/ADR-0005-modelo-de-branches.md) — GitHub Flow, e por que não GitFlow
- [`docs/ADR-0003-tokens-e-acessibilidade.md`](docs/ADR-0003-tokens-e-acessibilidade.md) — de onde
  vem os tokens e as correcoes de contraste

Outros documentos uteis: [`docs/conteudo-institucional.md`](docs/conteudo-institucional.md) (os
textos aprovados pela liga), [`docs/checklist-validacao.md`](docs/checklist-validacao.md) (o que e
conferido antes de cada entrega) e
[`docs/PLANO-DE-DESENVOLVIMENTO.md`](docs/PLANO-DE-DESENVOLVIMENTO.md).

---

## O banco de dados

Tudo o que define o banco — esquema, políticas de acesso e dados de exemplo — mora **versionado** em
`supabase/`, não no painel do Supabase.

> **Nunca altere o banco pelo painel.** Ele serve para olhar. Alterar por lá **desalinha o
> repositório do que está no ar**, e quem fizer isso quebra a próxima migração. Esquema criado
> clicando existe só na conta de quem clicou: sem histórico, sem revisão, impossível de recriar.

| Comando                     | O que faz                                               |
| --------------------------- | ------------------------------------------------------- |
| `npm run banco:migrar`      | Aplica as migrações pendentes                           |
| `npm run banco:tipos`       | Regenera os tipos a partir do esquema                   |
| `npm run banco:tipos:check` | Falha se os tipos versionados estiverem velhos          |
| `npm run banco:rls`         | Lista tabela por tabela: acesso, políticas e concessões |

**Antes de qualquer comando de banco, entre na sua conta:** `npx supabase login`. Nenhuma senha de
banco fica no `.env` — os comandos acima falam com o Supabase pela sua conta, e os identificadores
dos projetos saem das próprias URLs, que não são segredo.

**Toda tabela nasce com controle de acesso por linha ativo**, na mesma migração que a cria. Acesso
ativado sem política recusa tudo — ativa primeiro, abre depois. A chave pública do Supabase vai para
o navegador de propósito, e é só isso que impede qualquer pessoa de ler e escrever no banco.

> **Duas portas, não uma.** No Postgres, a **concessão** diz se um papel pode tocar na tabela e a
> **política** diz quais linhas ele vê. Uma tabela com políticas e sem concessão recusa tudo, e
> parece configurada. O `npm run banco:rls` mostra as duas colunas por isso — e falha quando encontra
> política sem concessão.

**Migração vai para produção depois do merge, nunca antes.** Durante o desenvolvimento, aplique só no
projeto de teste — é lá que ela deve quebrar. O ADR-0005 explica por quê e registra a única exceção
já aberta.

## Quando o site fica esquisito num domingo

O Supabase do plano gratuito **pausa o banco por inatividade**. Ninguém aperta nada: ele simplesmente
para de responder até alguém entrar no painel e reativar. Esta seção existe para que a primeira
pessoa a encontrar o site estranho ache a explicação aqui, em vez de descobrir sozinha no pior
momento.

**O que acontece, por tipo de página:**

| Página                       | Com o banco pausado                                         |
| ---------------------------- | ----------------------------------------------------------- |
| Páginas públicas de conteúdo | **Continuam no ar**, mostrando a última versão boa          |
| A atualização dessas páginas | Falha em silêncio — o conteúdo fica alguns minutos atrasado |
| **Formulário de contato**    | **A mensagem não é gravada.** Quem escreveu perde o texto   |
| **Painel administrativo**    | **Não abre**                                                |

As páginas públicas sobrevivem porque o conteúdo é lido de forma **estática com revalidação**, nunca
consultando o banco a cada acesso. **Isso não resolve a pausa — resolve que a pausa não derruba o
site.** Para quem visita, conteúdo de alguns minutos atrás é indistinguível de estar tudo em dia.

**O que continua quebrado, e está escrito assim de propósito:** o formulário e o painel exigem o
banco vivo. Não há como contornar isso do lado do site. A rotina que evita a pausa — e o monitor que
avisa antes de alguém reclamar — é da **F25**.

**O que fazer agora, se acontecer:** entre no painel do Supabase com a conta da liga e reative o
projeto. Ele volta em alguns minutos, e nada foi perdido além das mensagens que alguém tentou enviar
enquanto estava fora.

## Apagar dado pessoal

O portal guarda dado de duas coisas, as duas vindas do formulário de contato: **as mensagens**, por
**24 meses**, e um **resumo do endereço de quem enviou** — que não permite voltar ao endereço —, por
**24 horas**. Passado o prazo, esse dado precisa sair do banco. É uma obrigação, não uma faxina.

**Enquanto isso não é automático, depende de alguém rodar um comando.** A automação é da F25.
Rode isto **uma vez por mês** — anote no calendário da diretoria, junto das outras tarefas fixas:

```bash
npm run purgar:dado-pessoal
```

Antes de apagar de verdade, dá para ver o que sairia sem tirar nada:

```bash
npm run purgar:dado-pessoal:simular
```

**Como saber que deu certo.** O comando responde com duas linhas e um total, assim:

```text
  mensagens            prazo: 24 meses   apagados: 3
  controle_de_origem   prazo: 24 horas   apagados: 2

  total apagado: 5 registro(s)
```

**"apagados: 0" é um resultado bom** — quer dizer que nada tinha passado do prazo ainda. O que não é
bom é a mensagem `NAO EXECUTADA`: aí a purga não conseguiu nem olhar, e precisa rodar de novo. As
duas coisas são diferentes de propósito, porque "não havia o que apagar" e "não consegui apagar" se
parecem demais quando ninguém diz qual foi.

**O que é apagado não volta.** Não há lixeira, e é assim mesmo: dado pessoal guardado numa lixeira
continua guardado. Para o conteúdo do site é o contrário — apagar notícia, evento ou projeto apenas
arquiva, e o banco recusa a remoção definitiva até para a diretoria.

Finalidade, base legal e o que exatamente é guardado estão em
[docs/DADOS-PESSOAIS.md](docs/DADOS-PESSOAIS.md).

## O design system: onde ver o sistema inteiro

O portal tem um conjunto de componentes de base — botão, cartão, etiqueta, campo de formulário,
separador, ícone e estado vazio — convertidos do design que a liga aprovou.

**Para ver todos eles, em todas as variantes e todos os estados, de uma vez só, abra a vitrine:**

```bash
npm run dev
```

Depois acesse <http://localhost:3000/vitrine>. Em produção, o mesmo endereço, no domínio do portal.

A vitrine é interna: **não recebe link de nenhuma página pública e não é indexada por buscador**.
Ela existe para revisar o design system sem precisar navegar o site, e é sobre ela que rodam as
verificações de acessibilidade, de alvo de toque e de responsividade. Um teste automático falha se
alguém acrescentar um link do site público para ela.

**Regra ao criar componente novo**: se ele não aparece na vitrine, a entrega não está completa.

A explicação de **quando usar e quando não usar** cada componente fica no próprio arquivo dele, em
`src/componentes/ui/`. A vitrine mostra; o arquivo explica.

## Como o codigo esta organizado

```
src/
  app/            Rotas. So composicao e carregamento de dados
  app/(interno)/  Ferramentas internas, nao publicas — a vitrine mora aqui
  componentes/
    ui/           Blocos base. Nao conhecem feature, banco nem rota
    layout/       Cabecalho, rodape, menu
    padroes/      Composicoes reutilizaveis
  features/       Uma pasta por dominio. Uma NUNCA importa da outra
    exemplo/      Modelo a copiar: dados.ts, regras.ts, tipos.ts, componentes/
  lib/            Supabase, validacao, e-mail, funcoes puras
  estilos/        tokens.css (unica fonte de cor e medida) e global.css
tests/e2e/        Testes de ponta a ponta
scripts/          Verificacoes proprias do projeto
docs/             Decisoes, padroes e conteudo aprovado
specs/            Specs, planos e tarefas de cada feature
```

`src/features/exemplo/` existe de proposito: e o **molde** que as features seguintes copiam. Ele
mostra onde mora o acesso a dados, onde mora a regra de negocio, e como um componente que exibe
dado trata os tres estados obrigatorios — carregando, erro e vazio.

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha. **Nenhum segredo real entra no repositorio.**
Na F00 nenhuma variavel e usada ainda; elas estao listadas para que ninguem descubra tarde.

## Dependencias

O projeto tem **20 dependencias diretas** — 3 de execucao e 17 de desenvolvimento —, e cada uma
esta justificada em [`specs/001-fundacao-tecnica/plan.md`](specs/001-fundacao-tecnica/plan.md).

**Dependencia nova se justifica na tabela do plano ANTES de entrar, nao depois.** Nao e burocracia:
cada biblioteca e uma coisa a mais para a proxima pessoa entender.
