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
| `dev-frontend` | Toda change de tela | Implementa páginas e componentes em Next.js e CSS Modules, só com tokens, seguindo `padroes-de-codigo.md` | Leitura, escrita, terminal |
| `dev-dados` | A partir da R2 | Supabase: consultas, migrações, RLS, tipos gerados | Leitura, escrita, terminal |
| `guardiao-visual` | Toda change de tela | Tira prints do site e do protótipo nas mesmas larguras (390 e 1280 px), monta o lado a lado e lista as diferenças. **Não corrige nada**: aponta | Leitura, terminal (Playwright) |
| `qa-acessibilidade` | Toda change | Escreve e roda os testes e2e: axe, teclado, alvos de toque, rolagem horizontal nas larguras da definição de pronto | Leitura, escrita em `tests/`, terminal |
| `revisor` | Fim de toda change | Revisão independente do diff contra a proposta, a constitution e os padrões. Começa com contexto limpo, sem ter visto a implementação | Só leitura |

**Regra de relatório para todos:** no máximo uma tela, com número quando houver número ("0 violações em 6 páginas", não "ficou acessível"), e o que ficou incompleto escrito como incompleto.

## 3. Como os agentes conversam

O Claude Code orquestra: chama cada subagente com uma tarefa e recebe de volta o relatório. A memória compartilhada é o próprio repositório, para nada ficar só numa conversa:

- `openspec/changes/<change>/` guarda proposta, specs e tarefas, e um `relatorio.md` onde cada subagente registra o que fez e o que achou;
- `openspec/specs/` guarda a descrição do sistema como ele é depois de cada change arquivada;
- `CLAUDE.md` na raiz traz as regras que todo agente lê ao começar: constitution, padrões, referência visual, regras de Git.

O gestor (eu) conversa com o Claude Code através do Gabriel: eu escrevo o briefing e os ajustes de portão aqui no projeto, o Gabriel cola no Claude Code, e eu leio o resultado direto no repositório.

Se a versão do Claude Code do Gabriel tiver o modo de equipes em que os agentes trocam mensagens entre si, dá para ligá-lo depois. Confiro isso na change `montar-equipe-de-agentes`, em vez de supor.

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
Líder técnico   /opsx:archive  (antes do PR: a main é protegida)
Líder técnico   entrega arquivos + comandos Git + mensagem de commit
Gabriel         commit, push, PR  ->  Vercel gera a prévia
PORTÃO 2        gestor confere o PR, Gabriel olha a prévia e faz o merge
```

## 5. Modelo de arquivo de subagente

Os seis arquivos entram no repositório na change `montar-equipe-de-agentes`. O formato é este:

```markdown
---
name: guardiao-visual
description: Compara as telas do site com o protótipo aprovado. Use ao fim de toda change que mexe em tela.
tools: Read, Glob, Grep, Bash
---
Você compara, não corrige.
1. Leia docs/referencia-visual.md.
2. Suba o site em modo de produção e tire prints das páginas da change em 390 e 1280 px.
3. Pegue os prints de referência em prototipo/prints/ nas mesmas larguras.
4. Gere o lado a lado em openspec/changes/<change>/prints/.
5. Liste cada diferença visível: onde, o que mudou, e se ela vem de uma regra
   de acessibilidade do ADR-0003 (pode ficar) ou não (precisa de aval do Gabriel).
Relatório de no máximo uma tela.
```

## 6. Regras de Git

Cada uma custou pelo menos um episódio de trabalho perdido nesta obra.

1. **Quem escreve no Git é o Gabriel.** Os agentes preparam os arquivos e entregam os comandos prontos. Mensagem no padrão convencional, em português, **sem rodapé de coautoria**.
2. **Commitar e enviar ao fim de cada change ou de cada dia**, o que vier primeiro. Commit local não é cópia de segurança.
3. **Fechar o GitHub Desktop antes de usar o Git pelo terminal.** Ele faz stash automático ao trocar de branch e deixa `index.lock` preso. Foi assim que a spec da F01 sumiu.
4. **Apagar branch com `git branch -d`, minúsculo, pelo terminal.** O botão do GitHub Desktop equivale a `-D` e apaga mesmo com trabalho não incorporado.
5. **Conferir o resultado, não a aparência:** `git status --porcelain` vazio e `git rev-parse HEAD` igual ao `git ls-remote origin <branch>`.
6. **Uma change, uma branch curta**, incorporada em poucos dias. Nada de branch de semanas.
