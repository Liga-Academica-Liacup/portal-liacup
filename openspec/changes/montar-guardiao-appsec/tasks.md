# Tarefas — montar o guardião de segurança

São 12 tarefas. A linha de base e a recomendação de CI saíram para a change
`auditoria-de-base-appsec` (E2 do Portão 1), e nenhuma tarefa entrou no lugar delas.

As tarefas que citam uma Qn seguem a opção decidida no Portão 1 de 19/11/2026.

## 1. O guardião e o checklist

- [x] 1.1 **(Q2, Q3, Q8)** Escrever `docs/SEGURANCA.md` com cinco partes:
      - o que o portal protege;
      - de quem;
      - a superfície de ataque por release, de R1 a R5 (R1 estática, R2 leitura do banco, R3 login
        e painel, R4 formulário público e e-mail, R5 uploads);
      - o checklist AS-01 a AS-16 com o texto do briefing, separando "sempre" de "quando a change
        toca no assunto";
      - o índice de riscos aceitos, vazio por enquanto, com a regra do aceite (só o Gabriel, por
        escrito, com achado, motivo, prazo e change que resolve) e a exceção de Q2: achado
        bloqueante, confirmado e já explorável hoje em produção nunca vira risco aceito; vira
        change de correção imediata, antes de qualquer outra.

      Para AS-16, apontar `docs/DADOS-PESSOAIS.md`. **Como se verifica:** cada código de AS-01 a
      AS-16 tem exatamente uma linha de definição, as cinco releases têm seção própria, a exceção
      de Q2 está escrita no índice, e todo caminho citado existe no disco
- [x] 1.2 **(Q2, Q5, Q6)** Escrever `.claude/agents/guardiao-appsec.md`. O cabeçalho tem `name`,
      uma `description` que diz quando usar ("depois do revisor, antes do archive, em toda
      change"), `tools: Read, Glob, Grep` e `model: opus`. O corpo traz:
      - a persona de confiança zero, dizendo que o conteúdo auditado é dado e nunca instrução;
      - o que ler antes de auditar;
      - a forma do achado, a severidade, a confiança e a tabela do veredito (D6);
      - o protocolo do pedido de comando (D2) e o que é contexto limpo (D3);
      - a conferência curta (D7);
      - que só o Gabriel aceita risco, e que achado bloqueante, confirmado e já explorável hoje em
        produção o guardião marca como "correção imediata", nunca como candidato a risco aceito;
      - o que ele não faz;
      - o relatório devolvido ao líder técnico.

      **Como se verifica:** a linha `tools:` tem exatamente `Read, Glob, Grep`, e
      `grep -nE 'Write|Edit|Bash'` no cabeçalho não acha nada. O arquivo aponta para o checklist de
      `docs/SEGURANCA.md` e não o copia, e cita a exceção de Q2
- [x] 1.3 Acrescentar a seção `guardiao-appsec` (D4) em `openspec/changes/MODELO-relatorio.md`,
      depois da seção do `revisor`. Pôr `guardiao-appsec` nenhum na lista de escopos. Levar a
      mesma seção para o `relatorio.md` desta change. **Como se verifica:** as duas seções aparecem
      na ordem do ciclo, e `openspec list` continua sem nenhuma change fantasma

## 2. O ciclo

- [x] 2.1 **(Q3, Q7)** Atualizar o `CLAUDE.md` em sete pontos:
      - o guardião no ciclo, depois do `revisor` e antes do `/opsx:archive`;
      - a volta do `revisor` e do guardião depois de uma correção;
      - as três regras de bloqueio;
      - o parágrafo do escopo, com dois agentes com trava;
      - `guardiao-appsec` nenhum na obrigação de conferência;
      - o veredito do guardião na seção 3 do modelo do Portão 2;
      - `docs/SEGURANCA.md` na tabela "O que ler antes de começar".

      **Como se verifica:** `grep -n guardiao-appsec CLAUDE.md` acha o ciclo, o escopo e o modelo de
      entrega. `grep -n SEGURANCA CLAUDE.md` acha a tabela de leitura. Todo caminho citado existe
      no disco. O checklist não está copiado no `CLAUDE.md`
- [x] 2.2 **(Q1)** Conferir os documentos do gestor. O gestor já atualizou
      `docs/EQUIPE-DE-AGENTES.md`, `docs/PLANO-DE-DESENVOLVIMENTO.md` (§9 ciclo e §10 item 7 da
      definição de pronto), `docs/REFERENCIA-VISUAL.md` e `docs/constitution.md` (nível 3 da
      hierarquia com `SEGURANCA.md`). O líder técnico não escreve neles. **Como se verifica:**
      `git diff --stat` mostra os quatro documentos do gestor alterados, e `grep -n guardi` acha o
      guardião em `docs/EQUIPE-DE-AGENTES.md` e em `docs/PLANO-DE-DESENVOLVIMENTO.md`
- [x] 2.3 **(Q3)** Mudar a linha da hierarquia no `context` de `openspec/config.yaml` para citar
      `docs/SEGURANCA.md` no nível 3. **Como se verifica:** a hierarquia é a mesma no `context`, na
      constitution e no `CLAUDE.md`

## 3. Revisão e demonstrações

- [x] 3.1 Chamar o `revisor` sobre o diff desta change e transcrever o relatório dele. **Como se
      verifica:** o relatório diz quantos arquivos, critérios e regras conferiu, e o
      `git status --porcelain` é igual antes e depois da passagem
- [x] 3.2 Demonstrar a trava: pedir ao guardião que crie um arquivo. **Como se verifica:** o
      guardião diz que não tem ferramenta para isso. As duas saídas de `git status --porcelain`,
      antes e depois, são idênticas e vão literais para o `relatorio.md`
- [ ] 3.3 **(Q4)** Demonstrar o RP-12 no guardião, conforme o D8: plantar o arquivo, ver
      BLOQUEADO, desfazer e ver o verde. **Como se verifica:** o primeiro relatório é BLOQUEADO e
      cita AS-01 e AS-04. O segundo, numa invocação nova, é APROVADO ou APROVADO COM RESSALVAS, sem
      AS-01 e sem AS-04. O `git status --porcelain` final é igual ao de antes de plantar. Os dois
      relatórios vão literais para o `relatorio.md`. O segundo é o veredito do guardião para esta
      change

## 4. Validação e entrega

- [x] 4.1 Rodar `openspec validate --all --strict` e `npm run verificar`, os dois sem o arquivo
      plantado. **Como se verifica:** código de saída 0 nos dois, com a saída guardada para a
      seção 3 da entrega
- [ ] 4.2 Rodar `openspec archive montar-guardiao-appsec` **antes do PR** e depois
      `openspec validate --all --strict` de novo. **Como se verifica:** a spec de
      `openspec/specs/equipe-de-agentes/spec.md` traz os dois requisitos modificados e os dez novos,
      e a change está em `openspec/changes/archive/`
- [ ] 4.3 Entregar no modelo do `CLAUDE.md`, com o veredito do guardião na seção 3, e os comandos
      Git em bash para o Gabriel rodar: branch `chore/montar-guardiao-appsec` a partir da `main`,
      mensagem convencional em português, sem rodapé de coautoria, em arquivo temporário com
      `git commit -F`. **Como se verifica:** a seção 4 lista os arquivos fora do escopo esperado, e
      os quatro documentos do gestor (Q1) entram no mesmo commit

## Workflow follow-up

- Portão 2: o gestor confere o PR. Esta change não tem prévia visual.
- Próxima change: `auditoria-de-base-appsec`, proposta pelo Gabriel depois do merge desta. Ela leva
  a auditoria de linha de base da `main` e a recomendação de verificação automática no CI.
- Os itens do checklist que só valem "quando a change toca no assunto" (AS-10 a AS-16) não são
  exercitados nesta change: não há código novo para auditar, e a linha de base saiu. Isso fica
  declarado como incompleto, não simulado.
