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
  e passa a ser a `main` inteira (`git ls-files` da `main`), com o histórico para AS-01. Roda nesta
  change e na última change de cada release, antes de a release ir ao ar. É feita por blocos e
  juntada no fim.
- **AS-17, configuração de agente:** `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`,
  `.claude/settings*.json`, `.mcp.json` e `openspec/config.yaml`. Bloqueia:
  - agente que ganha ferramenta de escrita ou de terminal sem decisão registrada;
  - gancho, variável de ambiente ou servidor MCP novo sem decisão do Gabriel;
  - instrução que enfraquece regra da constitution, dos padrões ou do próprio `SEGURANCA.md`;
  - skill gerada pelo OpenSpec alterada à mão.
- **Segredo em arquivo binário.** Todo binário do que for auditado tem origem declarada, e a busca
  de AS-01 cobre binários sem imprimir o conteúdo. A forma nova de pedido de comando, se for
  preciso, entra na lista fechada da §5 e só conta, nunca mostra. Uma limitação fica escrita: texto
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
parte 6 sai e vai direto para a change de CI** (`ajustar-ci-ao-novo-fluxo`). Ficam 15. Se a Q6 for
decidida pela opção (b), sobra uma vaga, e a parte 6 pode voltar (ver `design.md`).

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
| `docs/SEGURANCA.md` | §4 ganha AS-17. §5 ganha o modo base, a regra do binário e as formas novas da lista fechada (Q2, Q3). Ganha também a origem dos binários (Q4). A §6 recebe as linhas aceitas (Q6). Versão 2 (líder técnico) |
| `.claude/agents/guardiao-appsec.md` | Modo base, blocos e junção. `tools` igual (líder técnico) |
| `CLAUDE.md`, `openspec/config.yaml` | O intervalo "AS-01 a AS-16", conforme a Q1 (líder técnico) |
| `docs/constitution.md`, `docs/EQUIPE-DE-AGENTES.md` | O mesmo intervalo, conforme a Q1 (gestor, por decisão do Gabriel) |
| `openspec/changes/auditoria-de-base-appsec/relatorio.md` | A lista de achados e as passagens do guardião (líder técnico transcreve) |
| `src/`, `tests/`, `supabase/`, `scripts/`, `.github/`, dependências | Nada muda |
| Comportamento do site | Nenhum. Não há prévia visual |

## Questões para o Portão 1

As opções, o custo de cada uma e a recomendação estão em `design.md`, seção "Questões para o
Portão 1".

- **Q1.** Quem atualiza o "AS-01 a AS-16" nos 7 lugares que o citam, e se o texto passa a ser
  "AS-01 a AS-17" ou "o checklist", sem intervalo.
- **Q2.** Se a lista fechada ganha forma nova de `npm` para separar aviso de produção de aviso de
  desenvolvimento.
- **Q3.** A forma nova de contagem para binário: arquivo por arquivo ou pasta inteira.
- **Q4.** Onde mora a origem declarada dos binários, e o que acontece com binário fora dela.
- **Q5.** Como o guardião confere que uma skill não foi alterada à mão.
- **Q6.** Quando o Gabriel aceita os riscos: numa entrega antes do archive, ou no Portão 2 com a
  change voltando do arquivo.
- **Q7.** Os cinco blocos do briefing absorvem o resto da `main`, ou entra um sexto bloco.
- **Q8.** Quem preenche a release e a change de cada achado da lista.
