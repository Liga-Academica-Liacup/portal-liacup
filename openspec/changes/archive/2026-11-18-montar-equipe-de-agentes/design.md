# Design — montar a equipe de agentes

## Context

Ver `proposal.md` — Why. O estado medido do repositório em 18/11/2026, depois da change
`trocar-spec-kit-por-openspec` (incorporada na `main` pelo PR #12):

| O que | Situação |
|---|---|
| `CLAUDE.md` na raiz | Não existe |
| `.claude/` | Só `skills/`, com as seis skills do OpenSpec |
| `.claude/agents/` | Não existe |
| Gabarito visual | `prototipo/Portal-LIACUP.html` e **21 prints** em `prototipo/prints/` já versionados |
| `openspec/specs/` | Três specs: `fundacao-e-ci`, `design-tokens`, `camada-de-dados` |
| Claude Code | **2.1.212** |

O `guardiao-visual` já tem gabarito, então o agente nasce útil em vez de nascer esperando outra
change. O que ele ainda não tem é página para comparar: a primeira tela é da R1.

## Goals / Non-Goals

**Goals:**

- As regras do projeto passam a valer por arquivo versionado, carregado sozinho, em vez de por
  memória de quem abre a conversa.
- Cada agente tem escopo estreito o suficiente para que o relatório dele seja curto.
- O que é trava fica trava; o que é só instrução fica dito como instrução.

**Non-Goals:**

- Nenhum arquivo de `src/`, `tests/`, `scripts/` ou `supabase/`.
- Nenhuma verificação nova no CI — isso é `ajustar-ci-ao-novo-fluxo`.
- Nenhum agente além dos seis do documento, e nenhum modo de mensagens ligado.
- Nenhum `hook` e nenhuma mudança de permissão.

## Decisions

### D0 — O `CLAUDE.md` carrega o modelo de entrega porque é onde ele é lido

O protocolo de retorno (seção 7 do documento) tem o princípio de cada parte no documento e o
**modelo literal no `CLAUDE.md`**, por um motivo mecânico: o `CLAUDE.md` entra em toda sessão
sozinho, e um formato de entrega que depende de alguém abrir outro arquivo é um formato que não
vale no dia em que ninguém abriu. O documento explica por que cada parte existe; o `CLAUDE.md` diz
como ela se escreve.

### D1 — `CLAUDE.md` é curto e aponta, em vez de repetir

O arquivo da raiz entra em toda sessão e é lido antes de qualquer coisa. Repetir a constitution,
os padrões e a referência visual dentro dele criaria uma segunda fonte que envelhece sozinha —
exatamente o problema que o plano v7 chama de "documento demais". Então ele traz o projeto em
cinco linhas, a lista do que ler, as regras de Git na íntegra (são sete linhas e cada uma custou
um episódio de trabalho perdido) e o ciclo de uma change.
**Alternativa descartada:** copiar os dez princípios para dentro dele. Eles já estão no `context`
do `openspec/config.yaml`, que o OpenSpec lê em toda geração de artefato. Duas cópias divergem.

### D2 — As ferramentas de cada agente saem do que ele precisa fazer, não de um padrão

| Agente | Ferramentas | Por quê |
|---|---|---|
| `especificador` | leitura + escrita | Escreve em `openspec/`, e só lá |
| `dev-frontend` | leitura, escrita, comando | Implementa e roda os testes do que implementou |
| `dev-dados` | leitura, escrita, comando | Migrações e tipos gerados exigem comando |
| `guardiao-visual` | leitura, comando | Precisa subir o site e tirar print; não precisa editar |
| `qa-acessibilidade` | leitura, escrita, comando | Escreve teste e roda |
| `revisor` | **só leitura** | Sem caminho de escrita, a independência é trava |

### D3 — O `revisor` começa com contexto limpo

É o que `docs/EQUIPE-DE-AGENTES.md` pede, e o motivo é concreto: um revisor que acompanhou a
implementação herda as justificativas de quem implementou e para de ver o que está errado. Ele
recebe o diff e a proposta, não a conversa.

### D4 — Escopo de escrita é instrução para os cinco, e trava só para o `revisor`

Ampliado no Portão 1 (E1). A lista de ferramentas concede capacidade — ler, escrever, rodar
comando — e **não restringe pasta**. Então `especificador`, `dev-frontend`, `dev-dados`,
`guardiao-visual` e `qa-acessibilidade` têm escopo por instrução, não por trava. O `revisor`, sem
ferramenta de escrita nem de terminal, é o único com trava real.

A consequência prática está no `CLAUDE.md` como obrigação do líder técnico: **depois de chamar
qualquer subagente, conferir que o `git status` só mostra arquivos do escopo dele**. Cada arquivo
de agente repete isso em uma linha, no lugar onde seria lido. É a distinção do RP-12 — "configurei
o agente para não sair da pasta" é configuração; "o `git status` não mostra nada fora dela" é
resultado — e é o que impede a equipe de confiar numa restrição que não existe.

### D5 — O modelo de `relatorio.md` fica em `openspec/changes/`, e isso foi medido

O modelo mora em `openspec/changes/MODELO-relatorio.md` e cada change copia. Criar o
`relatorio.md` vazio em toda change nova exigiria um passo que ninguém executa, e um relatório
vazio versionado parece um relatório que ninguém escreveu.

**Medido antes de decidir (E4):** com o arquivo no lugar, `openspec list` mostra uma única change,
`montar-equipe-de-agentes`, e `openspec validate --all --strict` devolve `4 passed, 0 failed` com
código 0. O OpenSpec lê pastas dentro de `changes/`, não arquivos soltos — então o modelo convive
ali sem virar change fantasma. O destino alternativo, `docs/MODELO-RELATORIO.md`, não foi
necessário.
**Alternativa descartada:** pôr o modelo dentro de `.claude/agents/`. Ele não é um agente, e a
pasta ficaria com dois tipos de coisa.

### D6 — Nada de mensagens entre agentes nesta versão (ver Q2 da proposta)

Medido: não existe modo para ligar. O que existe é mensagem entre sessões, e a resposta de um
subagente volta para a sessão-mãe, não para o subagente que escreveu. A orquestração com relatório
fica, e a memória compartilhada continua sendo o repositório.

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| O `CLAUDE.md` crescer até ninguém ler | Limite declarado no próprio arquivo: ele aponta, não repete. Regra nova vai para o documento de origem |
| Um agente sair do escopo porque a instrução é só instrução | Escopo declarado em cada arquivo e conferência por `git status` depois de cada passagem, como obrigação do líder técnico no `CLAUDE.md` (D4) |
| Os seis agentes nunca serem exercitados de verdade antes da R1 | O `revisor` é demonstrado nesta própria change, sobre o diff dela. Os outros cinco só na primeira change de tela, e isso fica dito como incompleto |
| A `description` de um agente ficar vaga e ele nunca ser chamado | Cada `description` diz a situação de uso, não a função. É critério de aceite |
| O `guardiao-visual` não ter página para comparar ainda | Ele nasce com gabarito (21 prints) e sem tela. Declarado, não escondido |
| Duplicar regra entre `CLAUDE.md` e o `context` do OpenSpec | D1: o `CLAUDE.md` aponta para os documentos; os princípios ficam só no `context` |

## Open Questions

Nenhuma que mude as specs, a abordagem ou as tarefas. Q1 e Q2 da proposta pedem decisão do Gabriel
no Portão 1, e as duas já têm recomendação escrita; se Q1 for decidida ao contrário — tirando
`Bash` do `guardiao-visual` —, ele deixa de poder tirar prints e a tarefa 2.4 muda.
