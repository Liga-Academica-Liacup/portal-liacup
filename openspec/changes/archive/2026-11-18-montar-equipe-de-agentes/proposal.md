# Proposta — montar a equipe de agentes

## Why

`docs/EQUIPE-DE-AGENTES.md` descreve seis subagentes com escopo fixo, as regras de Git que custaram
cinco episódios de trabalho perdido e o ciclo de uma change. Nada disso está no repositório: hoje
`.claude/` tem apenas `skills/`, não existe `CLAUDE.md` na raiz, e todo agente que abre o projeto
começa sem saber que o visual tem gabarito, que o texto da liga não se reescreve e que ninguém
escreve no Git além do Gabriel.

O documento é a decisão; esta change é a decisão passando a valer. Enquanto ela não entra, cada
regra depende de alguém lembrar de colá-la no começo da conversa — que é exatamente como regras
importantes ficaram em notas fora do repositório na fase anterior.

## What Changes

- **`CLAUDE.md` na raiz.** O que é o projeto em cinco linhas, os documentos que todo agente lê ao
  começar, as regras de Git da seção 6 e o ciclo de uma change da seção 4. É o arquivo que o Claude
  Code carrega sozinho, sem ninguém pedir.
- **Seis subagentes em `.claude/agents/`**: `especificador`, `dev-frontend`, `dev-dados`,
  `guardiao-visual`, `qa-acessibilidade` e `revisor`. Cada um com `name`, `description` e `tools`
  no cabeçalho, escopo fixo, o que **não** faz, e relatório de no máximo uma tela com número
  quando houver número.
- **O `revisor` recebe só leitura** — `Read`, `Glob`, `Grep`. Sem `Bash` e sem `Edit`, ele não
  consegue escrever nem rodando comando.
- **O `guardiao-visual` não edita código**, e precisa de `Bash` para subir o site e tirar prints.
  Essa combinação tem um limite real, tratado em Q1.
- **Um modelo de `relatorio.md`** para cada change usar em `openspec/changes/<change>/`, onde cada
  subagente registra o que fez, com número, e o que ficou incompleto.
- **Resposta medida sobre o modo de equipes**, que o documento deixou em aberto na seção 3: ela
  está em Q2 e **nada foi ligado**.
- **`docs/EQUIPE-DE-AGENTES.md` atualizado pelo gestor** — seções 3 (a medição e o escopo como
  instrução), 6 (a sétima regra de Git) e 7 (o protocolo de retorno) — entra no commit desta
  change.

**Fora de escopo**, de propósito:

- Nenhuma tela, nenhuma rota, nenhum arquivo de `src/`, `tests/` ou `supabase/`.
- Nenhuma verificação nova no CI. Automatizar a conferência da equipe é candidata à change
  `ajustar-ci-ao-novo-fluxo`, não a esta.
- Nenhum `hook`, nenhum `settings.json` de permissão, nenhum agente além dos seis do documento.
- Nenhum modo de mensagens entre agentes ligado.

## Capabilities

### New Capabilities

- `equipe-de-agentes`: quem são os agentes do projeto, o escopo e as ferramentas de cada um, as
  regras que todos leem antes de começar e o formato do relatório que devolvem. É contrato, não
  documentação: um agente que ganhe ferramenta de escrita sem decisão registrada é uma regressão
  verificável.

### Modified Capabilities

Nenhuma. As três specs existentes — `fundacao-e-ci`, `design-tokens` e `camada-de-dados` —
descrevem o produto, e esta change não toca no produto.

## Impact

| O que | Efeito |
|---|---|
| `CLAUDE.md` | Arquivo novo na raiz, carregado automaticamente em toda sessão |
| `.claude/agents/` | Pasta nova, seis arquivos |
| `openspec/changes/montar-equipe-de-agentes/` | Proposta, spec, design e tarefas |
| `openspec/changes/MODELO-relatorio.md` | Modelo que cada change copia |
| `docs/EQUIPE-DE-AGENTES.md` | Seções 3, 6 e 7, atualizadas pelo gestor |
| `src/`, `tests/`, `scripts/`, `supabase/`, `.github/` | Nenhum arquivo tocado |
| Dependências do projeto | **Nenhuma nova** |
| Comportamento do site | **Nenhum**. A change não tem prévia visual |

## Q1 — escopo de escrita é instrução, não trava (**aprovado e ampliado no Portão 1**)

O `guardiao-visual` precisa de `Bash` para subir o site em modo de produção e tirar prints com o
Playwright. `Bash` permite escrever arquivo. Então a frase "não corrige nada, aponta" é uma
**instrução**, não uma trava — e o projeto já aprendeu, no RP-12, que configuração e resultado não
são a mesma coisa.

O Portão 1 aprovou a recomendação e **ampliou para todos os cinco agentes com ferramenta de
escrita ou de terminal**: a lista de ferramentas não restringe pasta, então nenhum deles tem trava
de pasta. Só o `revisor` tem.

| Agente | Escopo de escrita | Trava? |
|---|---|---|
| `especificador` | `openspec/` | Não — instrução |
| `dev-frontend` | `src/` | Não — instrução |
| `dev-dados` | `src/`, `supabase/` | Não — instrução |
| `guardiao-visual` | só os prints da change | Não — instrução |
| `qa-acessibilidade` | `tests/` | Não — instrução |
| `revisor` | nenhum | **Sim** — sem ferramenta de escrita nem de terminal |

Cada arquivo de agente declara o próprio escopo de pastas e diz, em uma linha, que a conferência é
pelo `git status` depois da passagem. No `CLAUDE.md` isso entra como **obrigação do líder
técnico**: depois de chamar qualquer subagente, conferir que o `git status` só mostra arquivos do
escopo dele. É a distinção do RP-12 — "configurei o agente para não sair da pasta" é configuração;
"o `git status` não mostra nada fora dela" é resultado.

## Q2 — O modo de equipes: medido, não existe para ligar (**aceito no Portão 1**)

A seção 3 de `docs/EQUIPE-DE-AGENTES.md` deixou isso em aberto. Medido na máquina do Gabriel,
Claude Code **2.1.212**:

| Pergunta | Resposta medida |
|---|---|
| Existe um "modo de equipes" para ligar? | **Não.** Não há comando nem opção de configuração que ligue troca de mensagens entre subagentes |
| Os agentes conseguem se falar? | **Entre sessões, sim**, pelas ferramentas `SendMessage` e `ListAgents`. Entre subagentes da mesma sessão, não |
| Por quê | A documentação da própria ferramenta declara: a mensagem de um subagente sai sob o endereço da **sessão-mãe**, e a resposta volta para a sessão-mãe, não para o subagente. Diálogo de ida e volta entre dois subagentes não se fecha |
| O que existe hoje | Orquestração com relatório — o líder técnico chama cada subagente e integra o resultado. É exatamente o que o documento já descreve |

Há um caminho para conversa de verdade: transformar cada agente em **sessão própria**, com
`claude agents`. Não recomendo agora, por três motivos — as fronteiras de permissão são por sessão,
e uma sessão poderia fazer o que outra teve negado, num projeto cuja primeira regra de Git é que
nenhum agente escreve no Git; a memória compartilhada que o documento escolheu é o repositório, e
ela já funciona; e seis sessões paralelas são seis contextos a pagar para coordenar o que hoje uma
coordena.

**Nada foi ligado.** O gestor já registrou esse resultado na seção 3 de
`docs/EQUIPE-DE-AGENTES.md`; a tarefa 4.2 apenas anota a medição no relatório da change.
