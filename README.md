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

O fluxo de trabalho, da F01 em diante:

1. crie um branch: `git checkout -b feat/F01-design-system`;
2. abra uma alteracao proposta (pull request);
3. o CI roda todas as verificacoes automaticamente;
4. revise pelo endereco de pre-visualizacao;
5. incorpore. **Com o CI vermelho, o botao de incorporar fica bloqueado.**

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
- [`docs/ADR-0003-tokens-e-acessibilidade.md`](docs/ADR-0003-tokens-e-acessibilidade.md) — de onde
  vem os tokens e as correcoes de contraste

Outros documentos uteis: [`docs/conteudo-institucional.md`](docs/conteudo-institucional.md) (os
textos aprovados pela liga), [`docs/checklist-validacao.md`](docs/checklist-validacao.md) (o que e
conferido antes de cada entrega) e
[`docs/PLANO-DE-DESENVOLVIMENTO.md`](docs/PLANO-DE-DESENVOLVIMENTO.md).

---

## Como o codigo esta organizado

```
src/
  app/            Rotas. So composicao e carregamento de dados
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
