# Proposta — montar o guardião de segurança

## Why

O princípio 6 e os requisitos RP-10 e RP-11 dizem o que a segurança exige, mas nenhum agente
confere isso por checklist: o `revisor` não tem uma linha de segurança na tabela dele. O caso
`/vitrine.rsc` da change `interruptor-em-construcao` mostrou que uma página escondida pode vazar
por endereço técnico. Quem pegou foi uma pessoa, na revisão da proposta. Não foi uma regra.

O momento é agora porque a superfície ainda é pequena. A R1 é estática. A R2 lê o banco, a R3 traz
login e painel, a R4 um formulário público com e-mail e a R5 uploads. Cada release seguinte já
nasce com a regra escrita.

## What Changes

- **Sétimo agente, `guardiao-appsec`**, em `.claude/agents/`. Só `Read`, `Glob` e `Grep`, como o
  `revisor`, então a trava é de ferramenta. Usa `model: opus`. Audita com confiança zero e não
  corrige: escreve o critério que a correção precisa cumprir. Todo achado traz código do checklist,
  severidade, confiança, arquivo:linha, cenário de ataque e critério de correção. O que ele não
  consegue verificar sem terminal vira **pedido de comando**: o líder técnico roda e devolve a saída
  literal.
- **`docs/SEGURANCA.md`**, curto: o que o portal protege, de quem, a superfície de ataque de R1 a
  R5, o **checklist AS-01 a AS-16** com códigos fixos (nove itens valem sempre, sete quando a change
  toca no assunto) e o índice de riscos aceitos. O agente aponta para o checklist e não o copia.
  Quem implementa lê o documento antes de escrever, e a primeira change de cada release atualiza a
  seção dela.
- **O guardião entra no ciclo**, depois do `revisor` e antes do archive. BLOQUEADO impede o
  Portão 2. Só o Gabriel aceita risco, por escrito. Bloqueante confirmado que já é explorável hoje
  em produção nunca vira risco aceito: vira change de correção imediata, antes de qualquer outra.
  Change só de documentação passa por uma conferência curta, de AS-01 e AS-09. Depois de qualquer
  correção, o `revisor` e o guardião rodam de novo.
- **`CLAUDE.md`** ganha o passo no ciclo, as regras de bloqueio, a trava de dois agentes, o veredito
  na seção 3 do modelo do Portão 2 e `docs/SEGURANCA.md` na tabela "O que ler antes de começar".
- **`openspec/changes/MODELO-relatorio.md`** ganha a seção `guardiao-appsec`, e a lista de escopos
  da conferência passa a dizer `guardiao-appsec` nenhum.
- **Hierarquia de decisão:** `docs/SEGURANCA.md` entra no nível 3. A constitution já foi emendada
  pelo gestor; o `context` de `openspec/config.yaml` acompanha.
- **Duas demonstrações**, que são o único exercício do guardião nesta change: a trava (pedido para
  criar arquivo, e o `git status` não muda) e o RP-12 aplicado ao próprio guardião (BLOQUEADO com
  um segredo falso e um link `javascript:` plantados, e volta ao verde depois de desfazer).

**Fora de escopo**, de propósito:

- A auditoria de linha de base da `main` inteira. Ela vira a change `auditoria-de-base-appsec`,
  que o Gabriel propõe depois do merge desta.
- A recomendação de quais itens do checklist viram verificação automática no CI. Vai junto com a
  `auditoria-de-base-appsec`.
- Mexer no CI. Nenhum arquivo de `.github/` muda.
- Dependência nova ou ferramenta de varredura instalada. Os pedidos de comando usam só `git`, `npm` e
  `curl`.
- Arquivo de `src/`, `tests/`, `supabase/` ou `scripts/` no commit. O arquivo plantado da
  demonstração é temporário e nunca entra em commit.
- `hook`, `settings.json` ou mudança de permissão.
- Teste de invasão contra o site no ar. O guardião lê código e saída de comando. Ele não ataca nada.

## Capabilities

### New Capabilities

Nenhuma. O guardião é parte do processo da equipe, e as regras dele cabem em `equipe-de-agentes`.

### Modified Capabilities

- `equipe-de-agentes`: **2 requisitos modificados**. "Quem revisa não consegue escrever" passa a
  valer também para o guardião. "Relatório de no máximo uma tela" deixa a lista de achados fora da
  conta. **10 requisitos novos**: a auditoria obrigatória, o bloqueio, apontar sem corrigir, a
  forma do achado, o veredito, o pedido de comando, o aceite de risco, a conferência curta, o
  checklist e o documento de segurança. O "sete agentes" fica no `CLAUDE.md` e nos documentos do
  gestor, porque a spec não conta agentes.

## Impact

| O que | Efeito |
|---|---|
| `.claude/agents/guardiao-appsec.md` | Novo (líder técnico) |
| `docs/SEGURANCA.md` | Novo (líder técnico) |
| `CLAUDE.md` | Ciclo, regras de bloqueio, trava de dois agentes, modelo do Portão 2, tabela de leitura (líder técnico) |
| `openspec/changes/MODELO-relatorio.md` | Seção `guardiao-appsec` e escopo "nenhum" (líder técnico) |
| `openspec/config.yaml` | Muda o `context`, só a linha da hierarquia, para citar `docs/SEGURANCA.md` no nível 3 (líder técnico) |
| `docs/EQUIPE-DE-AGENTES.md`, `docs/PLANO-DE-DESENVOLVIMENTO.md` | Já atualizados pelo gestor: guardião na equipe, no ciclo (§9) e no item 7 da definição de pronto (§10). Entram no commit |
| `docs/constitution.md` | Já emendada pelo gestor: `SEGURANCA.md` no nível 3 da hierarquia. Entra no commit |
| `docs/REFERENCIA-VISUAL.md` | Entra no commit por decisão do Gabriel, sem relação com segurança: uma linha nova na tabela de correções do protótipo, sobre o Processo seletivo |
| `src/`, `tests/`, `supabase/`, `scripts/`, `.github/` | Nenhum arquivo no commit |
| Dependências | **Nenhuma nova** |
| Comportamento do site | **Nenhum**. Não há prévia visual |

## Decisões do Portão 1 (19/11/2026)

- **Q1 (a).** O gestor atualizou `EQUIPE-DE-AGENTES.md`, `PLANO-DE-DESENVOLVIMENTO.md`,
  `REFERENCIA-VISUAL.md` e `constitution.md`. Os quatro entram no commit desta change.
- **Q2 (a), com exceção.** Achado já existente vira risco aceito pelo Gabriel, com release atribuída,
  e não bloqueia change que não toca no ponto. Exceção: bloqueante confirmado que já é explorável
  hoje em produção não vira risco aceito; vira change de correção imediata, antes de qualquer outra.
- **Q3 (i-a) e (ii-a).** O checklist mora em `docs/SEGURANCA.md`, que entra na tabela de leitura do
  `CLAUDE.md` e no nível 3 da hierarquia, também no `context` do `config.yaml`.
- **Q4 (a).** O RP-12 roda sobre o diff desta change. APROVADO COM RESSALVAS conta como verde se
  AS-01 e AS-04 sumirem.
- **Q5 (a).** "Só de documentação" é decidido pelo diff: `docs/`, `openspec/` e `README.md`.
  `CLAUDE.md` e `.claude/` exigem auditoria completa.
- **Q6 (a).** BLOQUEADO para bloqueante de qualquer confiança ou alto confirmado.
- **Q7 (a).** Correção depois do `revisor` chama o `revisor` e o guardião de novo, com contexto
  limpo.
- **Q8 (a).** O Gabriel escreve o aceite na resposta do portão, o líder técnico transcreve literal
  com data no `relatorio.md`, e `docs/SEGURANCA.md` mantém o índice dos riscos aceitos em aberto.
- **E1.** A proposta encolheu para cinco minutos de leitura.
- **E2.** A linha de base e a recomendação de CI saem para a `auditoria-de-base-appsec`. Aqui, o
  guardião é exercitado só pelos critérios de aceite.
