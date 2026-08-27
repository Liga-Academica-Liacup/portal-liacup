# Specification Quality Checklist: Layout base (F03)

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-08-26
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

**16 de 16 · fechada em 26/08/2026**, no Ponto de Parada 1.

Os três marcadores [NEEDS CLARIFICATION] foram respondidos e integrados:

- **FR-008** — link com aparência de botão; o componente que falta entra como **escopo declarado**,
  governado por FR-045 e SC-018 para não criar segunda fonte de verdade de aparência;
- **FR-015** — rota mínima por destino, visivelmente marcada. Esta feature passa a entregar **dez**
  páginas, e as dez entram sob RP-04, RP-05, RP-06 e RP-07;
- **FR-025** — sede em forma curta, "FCTS · Campus UnB Ceilândia", com fonte nomeada.

Cinco emendas do Ponto de Parada 1 integradas: **E1** (FR-044, SC-017 — uma lista, dois
consumidores), **E2** (FR-039 — preset mobile, e a contradição de três features corrigida no
`lighthouserc.json` e anotada no checklist), **E3** (SC-008 — regra de contagem escrita junto do
número), **E4** (FR-045, SC-018 — origem única de aparência), **E5** (FR-046 — os comentários
desatualizados ganharam dono).

Duas correções técnicas aprovadas por Gabriel em 27/08/2026, antes do plano:

- **FR-039** — Lighthouse não possui `preset: "mobile"`; o contrato passa a exigir perfil mobile
  simulado configurado explicitamente e conferido nos relatórios;
- **FR-045 / SC-018** — o link compartilha somente as variantes textuais e os estados que têm
  consumidor real, sem inventar variante de ícone nem estado desabilitado.

Duas verificações desta lista são deliberadamente **mais frouxas** que a spec, e isso está aqui para
não parecer descuido: a spec exige número medido (altura do cabeçalho, alvos, contraste), e esta
lista só confere que o requisito **pede** o número. Quem mede é o `tasks.md`.
