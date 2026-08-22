# Checklist de qualidade da spec: Camada de dados (F02)

**Propósito**: validar completude e qualidade da especificação antes do planejamento
**Criado em**: 2026-08-21
**Feature**: [spec.md](../spec.md)

## Qualidade do conteúdo

- [x] Sem detalhes de implementação (linguagens, frameworks, APIs)
- [x] Focado em valor para o usuário e necessidade do projeto
- [x] Escrito para quem não é da área técnica
- [x] Todas as seções obrigatórias preenchidas

## Completude dos requisitos

- [x] Nenhum marcador [NEEDS CLARIFICATION] restante
- [x] Requisitos testáveis e sem ambiguidade
- [x] Critérios de sucesso mensuráveis
- [x] Critérios de sucesso independentes de tecnologia
- [x] Todos os cenários de aceite definidos
- [x] Casos de borda identificados
- [x] Escopo claramente delimitado
- [x] Dependências e premissas identificadas

## Prontidão da feature

- [x] Todo requisito funcional tem critério de aceite claro
- [x] As histórias cobrem os fluxos principais
- [x] A feature atende aos resultados mensuráveis dos Critérios de Sucesso
- [x] Nenhum detalhe de implementação vaza para a especificação

## Notas

**Cobertura após o clarify**: 5 histórias · **32 requisitos funcionais** (eram 24) · **15 critérios
de sucesso** (eram 12) · 7 casos de borda, **três deles agora resolvidos** em vez de perguntas em
aberto.

**Revalidado em 21/08/2026, após as cinco clarificações.** Os 16 itens continuam aprovados, e três
ficaram mais firmes: os casos de borda de edição concorrente, exclusão e álbum com fotos deixaram de
descrever um problema para descrever um comportamento (FR-028 a FR-032).

**Três histórias em P1**, o que é incomum e deliberado: as coleções (US1) destravam a Fase 1 inteira,
e o controle de acesso (US2) e o segredo (US3) são os dois itens desta feature capazes de causar
**dano irreversível**. Nenhum dos três pode ficar para depois.

**Sobre "sem detalhes de implementação"** — aprovado. Os requisitos descrevem capacidade
("legível sem autenticação", "impedido por verificação automática"), não ferramenta. O Supabase
aparece só em `Dependencies` e `Assumptions`, como restrição preexistente do ADR-0001.

**Uma contradição entre ADRs aprovados foi encontrada e corrigida.** O ADR-0001 especificava a
tabela de mensagens com "IP não armazenado"; o ADR-0002, risco E3, mandava limitar spam "por IP e
por janela de tempo". Resolvido pelo resumo irreversível em tabela separada, com adendo no ADR-0002
e referência cruzada no ADR-0001.

**Um adiamento foi registrado em vez de passar como escolha.** O ADR-0001 R6 já prometia "purga
automática". A F02 entrega o procedimento manual **testado** e adia a automação para a F25, que
passou a ser sua dona nominal no `PLANO-DE-DESENVOLVIMENTO.md`.

**Nenhum marcador de esclarecimento** foi usado antes do clarify: as lacunas encontradas viraram premissa escrita —
os três papéis da diretoria ficando para a F14, o processo seletivo e os indicadores fora do FR-001,
e a pausa do plano gratuito registrada mas não resolvida aqui. O `/speckit-clarify` roda em seguida
justamente porque esta feature toca regra de negócio e dado pessoal.

**Veredito**: 16 de 16 aprovados. Clarify concluído e integrado; plano e artefatos da Fase 1
escritos. Pronta para `/speckit-tasks`.
