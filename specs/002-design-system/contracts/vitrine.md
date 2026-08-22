# Contrato da vitrine — F01

**Data**: 2026-08-21 · Requisitos: FR-013 a FR-017 · Critérios: SC-003, SC-004, SC-005, SC-008

A vitrine é onde o design system deixa de ser afirmação e vira coisa olhável. É por ela que a liga
revisa o resultado, e é sobre ela que as verificações automáticas rodam.

## Endereço e visibilidade

| Item | Decisão |
|---|---|
| Endereço | `/vitrine` |
| Localização | `src/app/(interno)/vitrine/` — terceiro grupo de rotas, irmão de `(site)` e `(painel)` |
| Publicada? | **Sim.** A revisão da liga acontece pelo endereço de pré-visualização; página que não existe lá não pode ser revisada |
| Linkada? | **Não.** Nenhuma página pública aponta para ela |
| Indexada? | **Não.** `robots: { index: false, follow: false }` |

**Por que publicada e não bloqueada em produção**: o problema real que o FR-014 resolve é o público
topar com a vitrine navegando o site. Não linkada e não indexada resolve isso. Bloquear em produção
resolveria também, e de quebra impediria a revisão — que é a razão de ela existir.

## O que a vitrine precisa mostrar

Uma seção por componente, e dentro dela **todas** as variantes e **todos** os estados:

| Componente | O que precisa aparecer |
|---|---|
| `Botao` | 4 variantes × estados normal, desabilitado e largura total · a variante `icone` com `aria-label` · **linha de inscrição**: botão e campo lado a lado |
| `Cartao` | 4 níveis de elevação · cartão completo · **sem título** · **sem corpo** · só com meta |
| `Etiqueta` | 4 variantes · uma com **texto longo**, para provar a quebra de linha em 360 px |
| `Campo` | tipos texto, email e textarea · **com ajuda** · **com erro** · **desabilitado** · **erro + desabilitado** · **rótulo escondido** · **dois campos com o mesmo rótulo** |
| `Separador` | decorativo e semântico |
| `Icone` | as duas variantes |
| `EstadoVazio` | tom status e tom alerta |

**Os casos de borda da spec são itens de vitrine, não notas de rodapé.** Cartão sem título, etiqueta
com texto longo, campo com erro e desabilitado ao mesmo tempo, dois campos com o mesmo rótulo — se
não estão na vitrine, ninguém nunca os vê.

**Linha de inscrição**: além das seções isoladas, a vitrine mostra um `Campo` e um `Botao` lado a
lado, como o comentário original da `.btn` descreve. O campo passa a 16px por acessibilidade e o
botão fica em 14px por fidelidade; este bloco torna visível o emparelhamento deliberadamente desfeito.

**Regra de crescimento** (FR-013): componente novo que não aparece na vitrine é entrega incompleta.

## Estrutura de títulos

A vitrine tem `<h1>` único e uma `<h2>` por componente. Nada pula nível — é o item D7 do checklist
de validação, e uma página com dezenas de exemplos é justamente onde a hierarquia costuma quebrar.

## As quatro verificações automáticas

Rodam em `tests/e2e/vitrine.spec.ts`, nas mesmas 7 larguras do resto do projeto.

| # | O que verifica | Critério de aprovação | Saída |
|---|---|---|---|
| 1 | Acessibilidade com axe-core | **zero** violações | imprime o número |
| 2 | Alvo de toque | **zero** elementos interativos com lado < 44px | imprime **quantos foram medidos** e quais falharam |
| 3 | Rolagem horizontal | `scrollWidth <= clientWidth` nas 7 larguras | nomeia a largura que falhou |
| 4 | Ausência de link | **zero** links da página pública apontam para `/vitrine` | lista os que apontarem |

**A verificação 2 imprime quantos elementos mediu** pelo mesmo motivo que o verificador de tokens
imprime quantos arquivos varreu: sem o contador, "nenhum abaixo de 44" e "não mediu nada" produzem a
mesma saída verde.

**Detalhe que evita falso positivo na verificação 2**: elementos escondidos ou de dimensão zero são
ignorados — não são alvo de toque de ninguém. Fica escrito no teste, não implícito.

**A verificação 4 é a que transforma o FR-014 em regra**: sem ela, "a vitrine não é alcançável" é
promessa que a primeira pessoa distraída quebra. Com ela, o link acidental fecha o CI.

## O que a vitrine NÃO é

- **Não é página do site.** Não recebe navegação, rodapé nem identidade de página pública.
- **Não é documentação.** A explicação de quando usar e quando não usar mora no arquivo de cada
  componente (FR-019). A vitrine mostra; o arquivo explica.
- **Não é playground interativo.** Sem controles para alternar props ao vivo — isso é ferramenta, e
  ferramenta é dependência que ninguém pediu.
