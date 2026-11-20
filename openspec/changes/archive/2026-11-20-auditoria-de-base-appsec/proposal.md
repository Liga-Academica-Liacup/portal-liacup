# Proposta — auditoria de base de segurança

## Why

Até agora o guardião só auditou diffs. Ninguém leu a `main` inteira contra o checklist, e o próprio
guardião deixou duas lacunas registradas na `montar-guardiao-appsec`: a configuração dos agentes
não tem código no checklist (Q10 daquela change), e a busca de segredo pula arquivo binário sem
avisar (Q11). Hoje são 297 arquivos rastreados na `main`, 32 deles binários, 34 avisos do
`npm audit` sem dono, nenhum cabeçalho de segurança e um CI sem bloco `permissions`.

O momento é agora, antes da R1, porque o lançamento liga o interruptor e põe a `main` no ar. O que
for achado vira lista com dono e prazo. Nada de produto é corrigido aqui.

## What Changes

- **Modo "auditoria de base"** na §5 de `docs/SEGURANCA.md`. A lista auditada deixa de ser o diff
  e passa a ser a `main` inteira (`git ls-tree -r --name-only main`), com o histórico para AS-01.
  Roda nesta change e na última change de cada release, antes de a release ir ao ar. É feita por
  blocos e juntada no fim. A forma de `curl` ganha o host `https://www.liacup.com.br`, que é a
  produção de fato (E1).
- **AS-17, configuração de agente:** `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`,
  `.claude/settings*.json`, `.mcp.json` e `openspec/config.yaml`. Bloqueia:
  - agente que ganha ferramenta de escrita ou de terminal sem decisão registrada;
  - gancho, variável de ambiente ou servidor MCP novo sem decisão do Gabriel;
  - instrução que enfraquece regra da constitution, dos padrões ou do próprio `SEGURANCA.md`;
  - skill gerada pelo OpenSpec alterada à mão.
- **Segredo em arquivo binário.** Todo binário do que for auditado tem origem declarada, e a busca
  de AS-01 cobre binários sem imprimir o conteúdo. A forma nova de contagem entra na lista
  fechada da §5 e só conta, nunca mostra. O registro de origem dos 32 binários fica no
  `SEGURANCA.md`. Uma limitação fica escrita: texto
  dentro de bloco comprimido não aparece em busca por texto, e quem cobre esse caso é a origem
  declarada.
- **O `guardiao-appsec.md`** passa a conhecer o modo base, os blocos e a junção. A lista de
  ferramentas dele não muda.
- **A auditoria em si**, por blocos: dependências, CI e cadeia de entrega, banco, código do site,
  configuração de agente. No fim, a junção. Pontos que o guardião olha, sem se limitar a eles:
  - os 34 avisos do `npm audit`, cada um com produção ou desenvolvimento, onde roda e se é
    explorável hoje;
  - o `ci.yml` sem `permissions` (I2 da change anterior);
  - os 7 arquivos que citam a chave de serviço;
  - as políticas e concessões das 13 tabelas;
  - o `src/proxy.ts`, a rota `/vitrine`, a pasta `public/` e os cabeçalhos (AS-15).
- **A lista de achados** vai no `relatorio.md`, ordenada por severidade. Cada achado traz as seis
  coisas de sempre, a release em que se resolve e a change proposta para resolvê-lo. Bloqueante
  confirmado e já explorável hoje em produção não entra na lista: a auditoria para, e vira correção
  imediata, como o `next`.
- **Duas demonstrações do RP-12.** A primeira põe `Bash` a mais numa cópia temporária de um agente
  e espera BLOQUEADO citando AS-17. A segunda planta um PNG temporário com um segredo falso nos
  metadados e espera a busca achá-lo sem mostrar o valor. As duas são desfeitas no fim.

**Contagem de tarefas.** Com a parte 6 do briefing (recomendação de verificação automática no CI,
incluída a busca de segredo antes do push, I3), seriam 16 tarefas. Pela regra do briefing, **a
parte 6 sai e vai direto para a change de CI** (`ajustar-ci-ao-novo-fluxo`). Ficam 15.

## Fora de escopo

- Corrigir qualquer achado: dependência, CI, banco, código ou cabeçalho. Cada achado vira item da
  lista, com release e change.
- A recomendação de verificação automática no CI e a busca de segredo antes do push (parte 6 e
  I3), que vão para a change de CI.
- Arquivos de `src/`, `tests/`, `supabase/`, `scripts/`, `.github/`, `package.json` e
  `package-lock.json`. Nenhum entra no commit. Os dois arquivos plantados nos RP-12 são temporários
  e nunca entram em commit.
- Dependência nova ou ferramenta de varredura instalada.
- Mudar a lista de ferramentas de qualquer agente, criar `settings.json`, gancho ou `.mcp.json`.
- Ler o histórico de outras branches além do que `git log --all` já alcança, e atacar o site no ar.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `equipe-de-agentes`: **5 requisitos novos**, nenhum modificado:
  - a auditoria de base da versão principal antes de cada release;
  - a lista de achados com release e change;
  - a configuração dos agentes no checklist;
  - a origem declarada de todo binário;
  - a busca de segredo que alcança binário sem mostrar conteúdo.

  As regras do guardião já moram nessa spec (12 dos 17 requisitos). Abrir outra capacidade
  separaria o checklist da auditoria que o usa. A parte 6 não vira requisito: é uma recomendação
  de uma vez só, não um comportamento do sistema.

## Impact

| O que | Efeito |
| --- | --- |
| `docs/SEGURANCA.md` | §4 ganha AS-17. A §5 ganha o modo base, a regra do binário e cinco formas novas na lista fechada. São elas: `git ls-tree -r --name-only <rev>`, as duas de contagem de binário, `npm audit --omit=dev` e `openspec --version`. O `curl` passa a ter quatro hosts (E1). Entra o registro de origem dos 32 binários. A §6 recebe as linhas aceitas. Versão 2 (líder técnico) |
| `.claude/agents/guardiao-appsec.md` | Modo base, blocos e junção, e "o checklist de segurança" no lugar do intervalo. `tools` igual (líder técnico) |
| `CLAUDE.md`, `openspec/config.yaml` | "AS-01 a AS-16" vira "o checklist de segurança" (Q1 (b), líder técnico) |
| `docs/constitution.md`, `docs/EQUIPE-DE-AGENTES.md` | Já emendados pelo gestor no disco (Q1 (b)). Entram no commit da change |
| `openspec/changes/auditoria-de-base-appsec/relatorio.md` | A lista de achados e as passagens do guardião (líder técnico transcreve) |
| `src/`, `tests/`, `supabase/`, `scripts/`, `.github/`, dependências | Nada muda |
| Comportamento do site | Nenhum. Não há prévia visual |

## Decisões do Portão 1 (20/11/2026)

O texto de cada decisão está em `design.md`, seção "Decisões do Portão 1".

- Q1 (b), Q2 (c), Q3 (b), Q4 (a) com (i), Q5 (b), Q6 (a), Q7 (a) e Q8 (b).
- E1: `https://www.liacup.com.br` entra entre os hosts do `curl`.

**Desvio aprovado do briefing (Q6 (a)).** O briefing punha o aceite dos riscos no Portão 2. Ele
passa para uma entrega intermediária, depois da junção da auditoria e antes da revisão do diff. O
Portão 2 confere o aceite já transcrito e as linhas da §6 no mesmo PR.

**Correção de fato.** `git ls-files main` não aceita revisão e devolve 0 linhas. A lista da
`main` é `git ls-tree -r --name-only main`, que devolve 297 (medido pelo líder técnico).
