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

- [ ] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [ ] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

Três marcadores [NEEDS CLARIFICATION] permanecem abertos de propósito, em FR-008, FR-015 e FR-025.
Os três são decisões de escopo ou de conteúdo institucional que mudam o que se constrói e o que se
testa, e não têm padrão razoável que possa ser adotado em silêncio:

- **FR-008** — a aparência da conversão "Processo seletivo" decide se falta um componente (achado
  registrado na seção "Achado" da spec);
- **FR-015** — o destino dos nove links sem página decide se esta feature entrega 1 ou 10 páginas
  sob RP-06 e RP-07;
- **FR-025** — o endereço da sede no rodapé é dado institucional com fonte nomeada, e o Princípio 6
  proíbe decidir por conta própria o que da liga aparece na tela.

Enquanto os três estiverem abertos, "todos os requisitos funcionais têm critério de aceite claro"
fica desmarcado — é o mesmo motivo, contado uma vez só.

Duas verificações desta lista são deliberadamente **mais frouxas** que a spec, e isso está aqui para
não parecer descuido: a spec exige número medido (altura do cabeçalho, alvos, contraste), e esta
lista só confere que o requisito **pede** o número. Quem mede é o `tasks.md`.
