# Equipe de agentes do Portal LIACUP

**Status:** aprovado pelo Gabriel junto com o plano v7, em 18/11/2026
**Repositório local:** `C:\Projetos\portal-liacup`
**Data:** 18 de novembro de 2026
**Substitui:** `agente-coordenacao-liacup.md` (o agente de coordenação no ChatGPT) e `nota-operacional-git.md`

---

## 1. Quem é quem

| Papel | Quem | Faz | Não faz |
|---|---|---|---|
| **Dono do produto e decisão final** | Gabriel | Aprova propostas, olha a prévia, decide escopo, prazo, tecnologia e visual. Executa toda operação de escrita no Git: commit, push, PR e merge. Fala com a liga | |
| **Gestor do projeto** | Claude, neste projeto do claude.ai | Mantém backlog e releases, escreve o briefing de cada change, revisa a proposta (Portão 1) e o PR (Portão 2) lendo o repositório público, mantém os documentos deste projeto, escreve os resumos para a liga | Não escreve código de produto. Não decide no lugar do Gabriel |
| **Líder técnico** | Claude Code, sessão principal no repositório | Recebe o briefing, roda o OpenSpec, divide o trabalho entre os subagentes, integra o resultado, prepara os arquivos e os comandos Git para o Gabriel | Não faz commit nem push. Não muda escopo por conta própria |
| **Subagentes** | Definidos em `.claude/agents/` | Cada um faz uma parte, com escopo fixo, e devolve um relatório curto ao líder técnico | Não falam com o Gabriel diretamente. Não saem do próprio escopo |

## 2. Os subagentes

| Nome | Entra em | Responsabilidade | Ferramentas |
|---|---|---|---|
| `especificador` | Toda change | Escreve `proposal.md`, specs e `tasks.md` a partir do briefing, no formato do OpenSpec. Aponta o que ficou vago em vez de preencher | Leitura e escrita só em `openspec/` |
| `dev-frontend` | Toda change de tela | Implementa páginas e componentes em Next.js e CSS Modules, só com tokens, seguindo `docs/PADROES-DE-CODIGO.md` | Leitura, escrita, terminal |
| `dev-dados` | A partir da R2 | Supabase: consultas, migrações, RLS, tipos gerados | Leitura, escrita, terminal |
| `guardiao-visual` | Toda change de tela | Tira prints do site e do protótipo nas mesmas larguras (390 e 1280 px), monta o lado a lado e lista as diferenças. **Não corrige nada**: aponta | Leitura, terminal (Playwright) |
| `qa-acessibilidade` | Toda change | Escreve e roda os testes e2e: axe, teclado, alvos de toque, rolagem horizontal nas larguras da definição de pronto | Leitura, escrita em `tests/`, terminal |
| `revisor` | Fim de toda change | Revisão independente do diff contra a proposta, a constitution e os padrões. Começa com contexto limpo, sem ter visto a implementação | Só leitura |
| `guardiao-appsec` | Fim de toda change, depois do revisor | Auditor de confiança zero: confere o diff contra o checklist de segurança do `docs/SEGURANCA.md` e dá o veredito BLOQUEADO, APROVADO COM RESSALVAS ou APROVADO. Não corrige; escreve o critério da correção. BLOQUEADO impede o Portão 2, e só o Gabriel aceita risco, por escrito | Só leitura |

**Dieta de processo (aprovada pelo Gabriel em 20/11/2026, depois de a `auditoria-de-base-appsec` consumir uma sessão inteira sem terminar):**

1. **Uma sessão por change.** Se não couber numa sessão do Claude Code, a change é grande demais e se divide no Portão 1.
2. **Guardião proporcional ao risco.** Em change de tela da R1, que é estática, ele confere só segredos (AS-01), exposição (AS-02), saída (AS-04), terceiros (AS-07) e cabeçalhos (AS-15). A auditoria completa roda na última change de cada release. As listas e a ordem que decidem estão na "Conferência proporcional" do `docs/SEGURANCA.md` §5, e só lá; o gatilho se decide pela lista de arquivos do diff, não por julgamento. Em vigor a partir da primeira change aprovada no Portão 1 depois do merge da `endurecer-agentes-e-git-local`.
3. **Relatório curto:** uma tela por agente, com o veredito e os achados. Nada de transcrição literal da resposta do agente no `relatorio.md`.
4. **No máximo duas rodadas por agente.** Depois de qualquer correção, o `revisor` e o `guardiao-appsec` rodam de novo; se o mesmo agente pedir correção numa terceira rodada, o líder técnico para e leva a pergunta ao Gabriel.

**Regra de relatório para todos:** no máximo uma tela (no `guardiao-appsec`, uma tela fora a lista de achados, que vem inteira), com número quando houver número ("0 violações em 6 páginas", não "ficou acessível"), e o que ficou incompleto escrito como incompleto.

## 3. Como os agentes conversam

O Claude Code orquestra: chama cada subagente com uma tarefa e recebe de volta o relatório. A memória compartilhada é o próprio repositório, para nada ficar só numa conversa:

- `openspec/changes/<change>/` guarda proposta, specs e tarefas, e um `relatorio.md` onde cada subagente registra o que fez e o que achou;
- `openspec/specs/` guarda a descrição do sistema como ele é depois de cada change arquivada;
- `CLAUDE.md` na raiz traz as regras que todo agente lê ao começar: constitution, padrões, referência visual, regras de Git.

O gestor (eu) conversa com o Claude Code através do Gabriel: eu escrevo o briefing e os ajustes de portão aqui no projeto, o Gabriel cola no Claude Code, e eu leio o resultado direto no repositório.

**Medido em 18/11/2026, Claude Code 2.1.212:** não existe modo de equipes para ligar. Subagentes da mesma sessão não conversam entre si: a mensagem de um subagente sai e volta pela sessão principal. Sessões diferentes conseguem trocar mensagens, mas cada agente como sessão própria foi descartado: as permissões são por sessão (uma poderia fazer o que outra teve negado), a memória compartilhada já é o repositório, e seriam seis contextos para coordenar o que um coordena. Fica a orquestração com relatório.

**Escopo de escrita é instrução, não trava**, para todo agente que tem ferramenta de escrita ou de terminal (`especificador`, `dev-frontend`, `dev-dados`, `guardiao-visual`, `qa-acessibilidade`). A lista de ferramentas não restringe pasta. Por isso o líder técnico confere pelo resultado: depois de cada passagem, o `git status` só pode mostrar arquivos dentro do escopo daquele agente. Só o `revisor` e o `guardiao-appsec`, sem nenhuma ferramenta de escrita, têm trava de verdade. **A escrita no Git por comando, e a escrita na configuração que segura a barreira (`.claude/settings*.json` e `.claude/ganchos/`), são trava** desde a change `endurecer-agentes-e-git-local`, para todo agente, inclusive o líder técnico; as regras estão no `CLAUDE.md` e no `docs/SEGURANCA.md` §5. A trava é contra engano, não contra agente que esconde o comando: o gancho lê o texto do comando e deixa passar o nome montado pelo shell na hora e o script que roda o Git por dentro. Contra isso valem as leituras do líder técnico depois de cada passagem e o fato de que só o Gabriel faz push (`docs/SEGURANCA.md` §5, "Limite conhecido").

## 4. O ciclo, visto pela equipe

```
Gestor          briefing da change
Gabriel         cola no Claude Code
Líder técnico   /opsx:propose  ->  especificador escreve a proposta
PORTÃO 1        gestor revisa, Gabriel aprova
Líder técnico   /opsx:apply    ->  dev-frontend / dev-dados implementam
                               ->  qa-acessibilidade testa
                               ->  guardiao-visual compara com o protótipo
                               ->  revisor revisa o diff
                               ->  guardiao-appsec audita (BLOQUEADO volta para o dev)
Líder técnico   /opsx:archive  (antes do PR: a main é protegida)
Líder técnico   entrega arquivos + comandos Git + mensagem de commit
Gabriel         commit, push, PR  ->  Vercel gera a prévia
PORTÃO 2        gestor confere o PR, Gabriel olha a prévia e faz o merge
```

## 5. Modelo de arquivo de subagente

Os arquivos dos agentes ficam em `.claude/agents/` (os seis primeiros entraram na change `montar-equipe-de-agentes`, o `guardiao-appsec` na `montar-guardiao-appsec`). O formato é este:

```markdown
---
name: guardiao-visual
description: Compara as telas do site com o protótipo aprovado. Use ao fim de toda change que mexe em tela.
tools: Read, Glob, Grep, Bash
---
Você compara, não corrige.
1. Leia docs/REFERENCIA-VISUAL.md.
2. Suba o site em modo de produção e tire prints das páginas da change em 390 e 1280 px.
3. Pegue os prints de referência em prototipo/prints/ nas mesmas larguras.
4. Gere o lado a lado em openspec/changes/<change>/prints/.
5. Liste cada diferença visível: onde, o que mudou, e se ela vem de uma regra
   de acessibilidade do ADR-0003 (pode ficar) ou não (precisa de aval do Gabriel).
Relatório de no máximo uma tela.
```

## 6. Regras de Git

Cada uma custou pelo menos um episódio de trabalho perdido nesta obra.

1. **Quem escreve no Git é o Gabriel.** Os agentes preparam os arquivos e entregam os comandos prontos. A barreira do Git recusa a escrita a agente; a recusa não se contorna. Mensagem no padrão convencional, em português, **sem rodapé de coautoria**.
2. **Commitar e enviar ao fim de cada change ou de cada dia**, o que vier primeiro. Commit local não é cópia de segurança.
3. **Fechar o GitHub Desktop antes de usar o Git pelo terminal.** Ele faz stash automático ao trocar de branch e deixa `index.lock` preso. Foi assim que a spec da F01 sumiu.
4. **Apagar branch com `git branch -d`, minúsculo, pelo terminal.** O botão do GitHub Desktop equivale a `-D` e apaga mesmo com trabalho não incorporado.
5. **Conferir o resultado, não a aparência:** `git status --porcelain` vazio e `git rev-parse HEAD` igual ao `git ls-remote origin <branch>`.
6. **Uma change, uma branch curta**, incorporada em poucos dias. Nada de branch de semanas.
7. **O terminal do Gabriel é o Git Bash (MINGW64).** Todo comando entregue vem em sintaxe de bash. Mensagem de commit com mais de uma linha vai num arquivo temporário e entra com `git commit -F <arquivo>`.

## 7. Protocolo de retorno

O trabalho passa por três mãos (Claude Code, Gabriel, gestor), e cada retorno tem um formato fixo para ninguém precisar caçar o que importa.

### 7.1 Claude Code para o Gabriel (e o gestor)

O modelo literal fica no `CLAUDE.md`, que todo agente carrega sozinho. O princípio de cada parte:

| Parte | Regra |
|---|---|
| Cabeçalho | Portão, change, estado em uma linha e **o que se pede ao Gabriel** (aprovar, decidir Qn, commitar) |
| Decisões | Primeiro, antes de qualquer evidência. Cada Qn com opções, custo de cada uma e a recomendação. A numeração Qn não muda entre rodadas |
| Para o gestor conferir | Branch, `HEAD`, caminhos dos artefatos e os comandos que reproduzem cada número. É o que permite ao gestor conferir no repositório em vez de acreditar no relato |
| Evidência | Comando, código de saída e contadores. Saída literal curta, nunca resumo |
| Mudanças | Contagem A/M/R/D e qualquer arquivo fora do escopo esperado |
| Desvios e incompleto | O que saiu diferente do briefing, e o que não foi feito ou não foi medido, com essas palavras |
| Próximo passo | Comandos em bash, mensagem de commit em arquivo com `git commit -F`. O primeiro é sempre `node scripts/conferir-ambiente-local.mjs --change <change>`, e o segundo, `node scripts/buscar-segredo-antes-do-envio.mjs`; o Gabriel para se qualquer um dos dois não der 0 |

### 7.2 Gestor para o Gabriel

1. **Primeira linha:** veredito (aprovado, aprovado com emendas, reprovado) e o que o Gabriel faz agora.
2. **Decisões do Gabriel**, se houver: opções, custo e a recomendação.
3. **O que o gestor conferiu**, com número, em poucas linhas.
4. **Emendas** numeradas, cada uma com o motivo em uma frase.
5. **Um bloco único para colar** no Claude Code, completo, que termina pedindo a entrega no formato do `CLAUDE.md`.
6. **Comandos Git**, se houver, em bash.

Fora o bloco para colar, cabe em uma tela.
