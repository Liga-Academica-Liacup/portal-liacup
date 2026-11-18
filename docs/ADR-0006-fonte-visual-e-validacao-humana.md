# ADR-0006 — Fonte visual, estados interativos e validação humana

- **Status:** Aprovado
- **Data:** 1º de setembro de 2026
- **Decisor:** Gabriel
- **Relacionado a:** ADR-0003 (tokens e acessibilidade) · ADR-0004 (controles e fidelidade)

## Contexto

As F01 e F03 passaram nas verificações automáticas, mas o resultado renderizado divergiu
materialmente do protótipo aprovado. Comparar propriedades CSS calculadas, contraste, geometria e
acessibilidade continua necessário, porém não valida por si só composição, hierarquia, identidade
visual ou acabamento.

## Decisão

As fontes de verdade têm papéis distintos:

| Fonte | Governa |
| --- | --- |
| Protótipo completo aprovado | composição, hierarquia, distribuição visual e identidade das áreas da página |
| `liacup.css` e ADR-0003 | paleta, tokens e primitivas do design system |
| `docs/conteudo-institucional.md` | fatos, textos, contatos e endereço institucionais |
| Decisão explícita do Gabriel | conflito entre versões do protótipo ou entre as fontes acima |

Todo controle interativo passa a exigir, quando aplicável, estados de repouso, hover, pressionado,
`focus-visible`, desabilitado e página atual. O retorno visual de hover, pressão e foco é imediato:
não depende de rede, de navegação concluída nem do término de animação. Animação nunca é necessária
para entender a mudança de estado e deve respeitar a redução de movimento.

Uma feature visual só fecha depois de comparação humana registrada com a referência aprovada, nas
larguras e estados aplicáveis. A automação mede estrutura, geometria, acessibilidade e propriedades;
a validação humana mede composição, hierarquia e acabamento. Uma não substitui a outra.

## Consequências

F01 e F03 ficam reabertas até nova implementação, validação visual e aprovação nominal do Gabriel.
F04 permanece bloqueada até esse fechamento. O RP-14 formaliza esse portão permanente.

Este ADR restringe a expressão “`liacup.css` é a fonte da verdade”, presente no ADR-0003, ao contexto
de paleta, tokens e primitivas. Também amplia o método do ADR-0004: a comparação tabular de CSS é
necessária, mas insuficiente. Não revoga nenhuma decisão já aprovada sobre acessibilidade, contraste,
alvo de toque, tipografia ou estado desabilitado.
