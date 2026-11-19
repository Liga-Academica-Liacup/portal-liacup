# Tarefas — montar a equipe de agentes

15 tarefas — o teto da constitution. A tarefa 2.4 depende de Q1 e a 4.2 registra o resultado de
Q2, as duas na `proposal.md`.

## 1. As regras na raiz

- [x] 1.1 Escrever `CLAUDE.md` com o projeto em cinco linhas, a lista dos documentos que todo
      agente lê ao começar, o ciclo de uma change da seção 4 e **(E2)** as **sete** regras de Git
      da seção 6 — a sétima diz que o terminal do Gabriel é o Git Bash (MINGW64), que todo comando
      vem em sintaxe de bash e que mensagem de commit com mais de uma linha entra com
      `git commit -F <arquivo>`. Inclui **(E3)** o modelo literal de entrega de portão, com a
      regra de que fora da evidência literal a entrega cabe em uma tela, e **(E1)** a obrigação do
      líder técnico de conferir, depois de chamar qualquer subagente, que o `git status` só mostra
      arquivos do escopo dele. Verificar que todo caminho citado no arquivo existe no disco e que
      ele não repete os dez princípios, que já estão no `context` do `openspec/config.yaml`

## 2. Os seis agentes

- [x] 2.1 `.claude/agents/especificador.md` — escreve proposta, specs e tarefas a partir do
      briefing, e aponta o que ficou vago em vez de preencher; escopo de escrita **`openspec/`**;
      **(E1)** o arquivo declara esse escopo e diz em uma linha que ele é instrução, não trava, e
      que a conferência é pelo `git status` depois da passagem; verificar que a `description` diz
      quando usar e que o arquivo declara o que ele não faz
- [x] 2.2 `.claude/agents/dev-frontend.md` — implementa páginas e componentes só com token,
      seguindo `docs/PADROES-DE-CODIGO.md`, com os três estados obrigatórios e o limite de 150
      linhas; escopo de escrita **`src/`**, com a linha do **(E1)**; verificar que a `description`
      diz quando usar e que o arquivo cita os padrões pelo caminho
- [x] 2.3 `.claude/agents/dev-dados.md` — consultas, migrações, controle de acesso por linha e
      tipos gerados, com a regra de que acesso a banco vive só na camada de dados; escopo de
      escrita **`src/` e `supabase/`**, com a linha do **(E1)**; verificar que a `description` diz
      quando usar e que o arquivo proíbe alterar o banco pelo painel
- [x] 2.4 **(Q1/E1)** `.claude/agents/guardiao-visual.md` — tira os prints das páginas da change
      em 390 e 1280 px, monta o lado a lado contra `prototipo/prints/` e lista cada diferença, sem
      corrigir nada; escopo de escrita **só os prints da change**, com a linha do **(E1)** e a
      conferência explícita de que o `git status` não pode mostrar nada em `src/`; verificar que a
      `description` diz quando usar
- [x] 2.5 `.claude/agents/qa-acessibilidade.md` — escreve e roda os testes de ponta a ponta nas
      larguras da definição de pronto, e relata com o número de elementos medidos; escopo de
      escrita **`tests/`**, com a linha do **(E1)**; verificar que a `description` diz quando
      usar
- [x] 2.6 `.claude/agents/revisor.md` — revisão independente do diff contra a proposta, a
      constitution e os padrões, começando com contexto limpo, **só com ferramentas de leitura**;
      verificar que o cabeçalho não traz nenhuma ferramenta de escrita nem de comando

## 3. O registro de cada change

- [x] 3.1 Escrever `openspec/changes/MODELO-relatorio.md`: uma seção por agente, com espaço para
      o que fez, os números que apurou e o que ficou incompleto; **(E4)** provar com
      `openspec list` e `openspec validate --all --strict` que o OpenSpec ignora um arquivo solto
      nessa pasta, e, se não ignorar, mover o modelo para `docs/MODELO-RELATORIO.md` e ajustar as
      referências; verificar que o modelo cabe em uma tela e que o `CLAUDE.md` e o arquivo de cada
      agente apontam para ele

## 4. Conferir o que foi feito

- [x] 4.1 Conferir os seis arquivos: `ls .claude/agents/` devolve seis, cada um tem `name`,
      `description` e `tools` no cabeçalho, e nenhuma `description` descreve só a função sem dizer
      a situação de uso
- [x] 4.2 **(Q2)** Anotar no relatório da change a medição do modo de equipes — versão 2.1.212,
      nenhum modo para ligar, mensagem de subagente volta para a sessão-mãe. O gestor já registrou
      o resultado na seção 3 de `docs/EQUIPE-DE-AGENTES.md`; **nada é ligado**
- [x] 4.3 Rodar `openspec validate --all --strict` e guardar a saída
- [x] 4.4 Rodar `npm run verificar` e `npm test`, registrando o resultado com número; esta change
      não mexe em tela, então não há prints nem Lighthouse a comparar

## 5. Demonstração e entrega

- [x] 5.1 Chamar o `revisor` sobre o diff desta própria change e colar o relatório dele na
      entrega; verificar que ele apontou pelo menos o que conferiu, com número, e que o diff de
      `src/` continua vazio depois da passagem dele
- [x] 5.2 Rodar `openspec archive` **antes do PR** e `openspec validate --all --strict` de novo;
      verificar que `openspec/specs/equipe-de-agentes/spec.md` existe e que a change está em
      `openspec/changes/archive/`
- [x] 5.3 Entregar ao Gabriel, **no formato do modelo de entrega do `CLAUDE.md`**, o relatório e
      os comandos Git em sintaxe de bash para **ele** rodar — branch
      `chore/montar-equipe-de-agentes` a partir da `main`, mensagem no padrão convencional em
      português, sem rodapé de coautoria, em arquivo temporário com `git commit -F`; conferir que
      `docs/EQUIPE-DE-AGENTES.md`, já atualizado pelo gestor nas seções 3, 6 e 7, entra no mesmo
      commit

## Workflow follow-up

- Portão 2: o gestor confere o PR e o Gabriel incorpora. Esta change não tem prévia visual.
- Cinco dos seis agentes só serão exercitados de verdade na primeira change de tela, na R1. Só o
  `revisor` é demonstrado aqui, e isso fica declarado como incompleto em vez de simulado.
