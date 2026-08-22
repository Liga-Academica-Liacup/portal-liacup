# Pesquisa — Fase 0 · F02 Camada de dados

**Data**: 2026-08-21 · **Spec**: [spec.md](./spec.md) · **Branch**: `feat/F02-camada-de-dados`

O ADR-0001 já fixou Supabase. Esta pesquisa resolve o que fica abaixo disso — e três decisões dela
foram pedidas explicitamente na validação do clarify, por serem as que separam "está escrito" de
"está garantido".

Ambiente verificado: Node v22.22.2 · npm 10.9.7.

---

## D1 — Como o teste prova que a política **bloqueia**

**Pedido explicitamente na validação. É o item que dá sentido a toda a US2.**

**Decisão**: para cada linha de política, **dois** testes com clientes diferentes — um que prova a
permissão e outro que prova a **recusa** —, e a suíte falha se qualquer caminho negado devolver
sucesso.

O erro clássico é testar só com o cliente autenticado, ver tudo funcionar e concluir que a política
está certa. Uma política escrita ao contrário, ou uma tabela sem política nenhuma, passa nesse teste.

**Como fica na prática**:

| Cliente | Papel no teste |
|---|---|
| **Anônimo** (chave pública) | Prova o que o público **consegue** e o que ele **não consegue** |
| **Autenticado** (sessão de diretoria) | Prova o que a diretoria consegue |
| **De serviço** | **Só na preparação e limpeza** do teste, nunca no que está sendo verificado |

A separação do cliente de serviço é o que impede o teste de mentir: se ele preparar *e* verificar,
está ignorando as políticas nos dois lados e não testa nada.

**Matriz mínima, por coleção de conteúdo** — cada célula é um teste:

| Operação | Anônimo | Autenticado |
|---|---|---|
| Ler publicado | permite | permite |
| **Ler rascunho** | **recusa** | permite |
| **Criar** | **recusa** | permite |
| **Alterar** | **recusa** | permite |
| **Apagar** (arquivar) | **recusa** | permite |

E a matriz **invertida** da coleção de mensagens, que é o caso que mais erra:

| Operação | Anônimo | Autenticado |
|---|---|---|
| Inserir | permite | permite |
| **Ler a lista** | **recusa** | permite |
| **Ler uma mensagem pelo identificador** | **recusa** | permite |
| Alterar, apagar | **recusa** | permite |

A última linha da tabela invertida é a que quase sempre falta: uma política que esconde a lista mas
deixa buscar por identificador conhecido **não protege nada**, porque identificador vaza.

**Demonstração obrigatória, no padrão das V1–V5 da F00**: desligar a política de uma coleção, ver o
teste **falhar**, religar e ver voltar ao verde. Política que ninguém viu bloqueando é política que
ninguém sabe se funciona.

**Alternativa considerada**: testar as políticas lendo o SQL e conferindo que existem. **Rejeitada** —
verifica que a política foi escrita, não que ela faz o que diz. É a mesma diferença entre o
verificador de tokens e a tabela de fidelidade da F01.

---

## D2 — Como a chave de serviço é impedida de chegar ao navegador

**Pedido explicitamente na validação. É o único item desta feature capaz de dano irreversível.**

**Decisão**: **quatro barreiras**, das quais três são automáticas. Nenhuma delas sozinha basta.

| # | Barreira | O que pega | Automática? |
|---|---|---|---|
| 1 | **Nome da variável sem o prefixo público** | O Next só expõe ao navegador o que começa com `NEXT_PUBLIC_`. A chave de serviço nunca recebe esse prefixo | Sim, pelo framework |
| 2 | **Zona de lint**: só um arquivo pode ler a chave | Qualquer outro arquivo que tente ler a variável de serviço quebra o CI, apontando arquivo e linha | Sim |
| 3 | **Verificação do pacote compilado**: script varre a saída do build atrás do valor da chave e do nome dela | O caso que as duas anteriores não pegam — vazamento por caminho indireto, por exemplo um valor repassado de servidor para componente de cliente | Sim |
| 4 | Arquivo de exemplo separando segredo de público | Erro humano na configuração | Não |

**A barreira 3 é a que realmente fecha a porta**, e é a que quase todo projeto não tem: as duas
primeiras verificam o **código**, ela verifica o **artefato**. Um valor pode chegar ao navegador sem
que nenhum arquivo de cliente mencione a variável — basta um componente de servidor passá-lo como
prop para um componente de cliente.

**Demonstração obrigatória**: colocar de propósito a chave num componente de cliente, ver a barreira
2 quebrar o CI; contornar a barreira 2 passando o valor por prop, ver a **barreira 3** pegar no
pacote compilado; desfazer e ver o verde voltar. **Duas barreiras vistas bloqueando, não uma.**

**Alternativa considerada**: confiar no prefixo do framework (barreira 1) sozinho. **Rejeitada** —
ele protege contra o descuido de nomear errado, não contra repassar o valor adiante. E o custo de
errar aqui é acesso total ao banco, sem volta.

---

## D3 — O que acontece quando o Supabase pausa por inatividade

**Pedido explicitamente na validação: não resolver aqui, mas dizer qual é o comportamento, porque
hoje ninguém sabe.**

O plano gratuito **pausa o projeto após 7 dias sem atividade**. Um portal institucional de baixo
tráfego, com páginas em cache, passa uma semana sem consultar o banco com facilidade — um recesso, um
feriado prolongado.

**O comportamento depende de como cada página busca dado**, e é isso que ninguém sabe hoje:

| Tipo de página | O que acontece com o banco pausado |
|---|---|
| Página **estática**, gerada no build | **Continua no ar**, servida da borda. Ninguém percebe nada — mostra o conteúdo do último build |
| Página que **revalida** de tempos em tempos | Continua servindo a versão em cache; a tentativa de atualizar falha em silêncio e o conteúdo **congela na última versão boa** |
| Página **dinâmica**, que lê a cada acesso | **Erro na tela.** É o pior caso |
| **Formulário de contato** | A mensagem **não é gravada**. Quem escreveu acha que enviou |

**Decisão desta feature**: o conteúdo público é lido de forma **estática com revalidação**, nunca
dinâmica a cada acesso. Isso não resolve a pausa — resolve que **a pausa não derruba o site
público**: no pior caso o portal mostra conteúdo de alguns minutos atrás, o que para um site
institucional é indistinguível de estar tudo bem.

**O que continua quebrado e não é resolvido aqui**: o formulário de contato perde a mensagem, e o
painel administrativo não abre. Os dois exigem o banco vivo.

**Fica para a F25**, como o ADR-0001 já registra no risco R1: rotina que consulta o banco a cada
poucos dias, monitor externo de disponibilidade avisando por e-mail, e instruções de como despausar
no manual de operação.

**O que esta feature entrega sobre isso**: a escolha de leitura acima, e o comportamento escrito no
README — para que a primeira pessoa a encontrar o site esquisito num domingo ache a explicação em
vez de descobrir sozinha.

---

## D4 — O esquema mora no repositório, não no painel do Supabase

**Decisão**: todo o esquema, todas as políticas e todos os dados de exemplo vivem em **arquivos SQL
numerados e versionados** em `supabase/migrations/`. O painel do Supabase é usado para **olhar**,
nunca para alterar.

**Razão**: Princípio I. Esquema criado clicando no painel existe apenas na conta de quem clicou; não
tem histórico, não tem revisão e não pode ser recriado. Um projeto que a diretoria herda precisa
poder ser reconstruído do zero a partir do repositório.

**Consequência prática que precisa estar no README**: alterar o banco pelo painel **desalinha** o
repositório do que está no ar. Se alguém fizer isso, o próximo a rodar as migrações vai ter uma
surpresa.

---

## D5 — Tipos gerados a partir do esquema, não escritos à mão

**Decisão**: os tipos das tabelas são **gerados pela ferramenta de linha de comando do Supabase** e
versionados; nenhum tipo de tabela é escrito à mão.

**Razão**: tipo escrito à mão diverge do banco no primeiro `ALTER TABLE`, e a divergência é
silenciosa — o código compila, e o erro aparece em produção. Gerado, a divergência vira erro de
compilação, que é o FR-005.

**Custo**: a ferramenta entra como **dependência de desenvolvimento**, e a geração precisa ser um
comando registrado — não um passo que alguém lembra de rodar.

**Verificação que fecha o ciclo**: um passo no CI regenera os tipos e falha se o resultado diferir do
que está versionado. Sem isso, "os tipos estão atualizados" é promessa.

---

## D6 — Dependências novas: três, e o que cada uma custa

Esta é a primeira feature desde a F00 que **precisa** instalar algo. As 20 atuais viram **23**.

| # | Dependência | Tipo | Por que é necessária | Alternativa rejeitada |
|---|---|---|---|---|
| 21 | `@supabase/supabase-js` | Execução | O cliente do banco escolhido no ADR-0001. Sem ele não há como falar com o Supabase | Escrever chamadas HTTP à mão: reimplementaria autenticação, refresh de sessão e tratamento de erro — mais código nosso para manter, exatamente o oposto do Princípio I |
| 22 | `@supabase/ssr` | Execução | Faz a sessão funcionar entre servidor e navegador no App Router. Sem ele, a sessão da diretoria não sobrevive à navegação | Gerenciar cookie de sessão à mão: é criptografia e sessão escritas por nós, que o Princípio IV proíbe expressamente |
| 23 | `supabase` (linha de comando) | Desenvolvimento | Gera os tipos a partir do esquema (D5) e roda as migrações | Gerar tipo à mão: divergência silenciosa (D5). Usar só o painel: esquema fora do repositório (D4) |

**Nenhuma outra entra.** Duas tentações nomeadas e recusadas antecipadamente: biblioteca de
validação de esquema além do que já existe em `lib/validacao`, e biblioteca de acesso a dados por
cima do cliente do Supabase — a segunda seria uma camada sobre uma camada, e a seção 4 dos padrões
já define onde o acesso mora.

---

## D7 — Onde os testes de política rodam

**Decisão**: contra um **projeto Supabase de teste separado do de produção**, com as mesmas
migrações aplicadas.

**Razão**: as políticas de acesso por linha são executadas pelo banco. Testá-las exige um banco de
verdade — um substituto em memória verificaria o nosso código, não a política, que é justamente o
que precisa ser verificado.

**Alternativa considerada**: subir o Supabase localmente pela ferramenta de linha de comando.
Funciona e é o caminho mais limpo, **mas exige Docker instalado** em qualquer máquina que rode os
testes, inclusive a de quem herdar o projeto. É custo de entrada alto para um projeto mantido por
estudantes de saúde.

**Consequência assumida**: o plano gratuito permite **2 projetos**, e este consome o segundo.
Registrado como limite: não sobra projeto para um terceiro ambiente. Se um dia for preciso, a saída é
o caminho local com Docker.

**No CI**: as credenciais do projeto de teste entram como segredos do repositório. Alteração vinda de
fork não os recebe — comportamento já documentado no README na F01 — e por isso os testes de política
não rodam em fork. Fica escrito para não parecer falha.

---

## D8 — O resumo do IP, sem dependência nova

**Decisão**: resumo criptográfico com sal secreto, usando a biblioteca padrão do Node. Zero
dependências.

**O que o clarify decidiu e por quê** (FR-026, FR-027):

- resumo **irreversível** do endereço, nunca o endereço em claro;
- **tabela separada** da mensagem — é o que mantém literalmente verdadeira a frase "IP não
  armazenado" do ADR-0001 sobre a tabela de mensagens;
- apagado em **24 horas**, pelo **mesmo** procedimento de purga das mensagens;
- **sal secreto e rotacionável**: o espaço de endereços IPv4 tem cerca de 4,3 bilhões de valores, que
  uma máquina comum percorre em minutos. Com sal fixo e público, "irreversível" é falso.

**Resumo de IP continua sendo dado pessoal pseudonimizado sob a LGPD**, não dado anônimo. É por isso
que tem prazo próprio, e não porque "é só um hash".

---

## D9 — Arquivar, versionar e não perder texto

Traduz para o esquema o que o clarify decidiu nas perguntas 3, 4 e 5.

| Decisão | Como o esquema sustenta |
|---|---|
| Apagar **arquiva** (FR-028) | Uma marca de arquivamento por registro; a leitura pública e a lista normal a ignoram |
| A diretoria **lista e restaura** (FR-029) | A marca é reversível, e a consulta de arquivados existe. A **tela** é da F16, já registrada no plano |
| Álbum arquivado **leva as fotos** (FR-030) | A marca desce para as fotos do álbum |
| Edição concorrente **avisa** (FR-031) | Cada registro carrega a marca de quando foi alterado pela última vez; quem salva informa qual versão abriu, e a escrita é recusada se não bater |
| **O texto não se perde** (FR-032) | A recusa devolve o conteúdo que a pessoa tentou salvar, para a tela repor. É a diferença entre trocar perda silenciosa por perda barulhenta e resolver de verdade |

O último é o que mais importa e o que mais se esquece: avisar sem devolver o texto é pior do que não
avisar, porque a pessoa vê o aviso **e** perde o trabalho.

---

## Nenhum ponto em aberto

Todos os itens marcados como `NEEDS CLARIFICATION` no contexto técnico foram resolvidos acima, e as
cinco decisões do `/speckit-clarify` estão traduzidas para o esquema em D8 e D9.

**Dois pré-requisitos que não dependem de mim**, e sem os quais a implementação não começa: o projeto
Supabase de produção e o de teste, criados na conta da liga em e-mail institucional, conforme o risco
R5 do ADR-0001.
