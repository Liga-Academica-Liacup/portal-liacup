# Checklist de qualidade da spec: Design system em componentes (F01)

**Propósito**: validar a completude e a qualidade da especificação antes de seguir para o planejamento
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

**Cobertura**: 5 histórias priorizadas · 21 requisitos funcionais · 13 critérios de sucesso · 7
casos de borda. Todo FR tem cenário de aceite correspondente em alguma história.

**Sobre "sem detalhes de implementação"** — aprovado. Os requisitos descrevem capacidade
("união fechada de valores", "rótulo associado programaticamente"), não ferramenta. As menções a
`componentes/ui`, `liacup.css` e `tokens.css` são vocabulário dos documentos de governança
anteriores à spec, e sem elas o FR-003, o FR-009 e o FR-011 deixariam de ser verificáveis.

**Sobre os critérios de sucesso** — SC-001 a SC-012 são contáveis (7 componentes, zero violações,
zero alvos abaixo de 44 px, zero tokens alterados, número de classes restantes). O SC-011 é
qualitativo de propósito: mede se a documentação funciona, o que nenhum número captura.

**Nenhum marcador de esclarecimento foi necessário.** As duas tensões entre o `liacup.css` aprovado
e a constituição — alvo de toque de 36 px contra o mínimo de 44 px, e fonte de 14 px em campo contra
o mínimo de 16 px no mobile — não são ambiguidade da spec: são **conflito entre documentos de
governança**, e a hierarquia da constituição mais o precedente do ADR-0003 já indicam a saída. Estão
registradas em `Assumptions` com a premissa adotada explícita e o aviso de que a decisão é do
Gabriel e vira ADR.

**Descoberta que a spec registra e o plano precisa tratar**: o `Botao` entregue na F00 **já aplica
`min-height: 44px`**, o que é um desvio do `.btn` aprovado feito sem registro. Não é problema novo
criado por esta feature — é dívida herdada que esta feature torna visível. Ratificar ou reverter é
decisão do Gabriel.

**Veredito**: 16 de 16 itens aprovados. Spec pronta para `/speckit-plan`.
