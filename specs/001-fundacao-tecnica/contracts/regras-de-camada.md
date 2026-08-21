# Contrato da regra de dependência entre camadas — F00

**Data**: 2026-08-20 · Atualizado em 2026-08-21 (Z4) · Fonte: `docs/PADROES-DE-CODIGO.md`, seção 1 · Requisitos: FR-008, FR-009, FR-011

Esta é a regra que impede o projeto de virar um novelo em seis meses. Ela não é uma recomendação de
revisão: é verificada por `import/no-restricted-paths` no `eslint.config.mjs` e **quebra o CI**.

## A tabela, que é a fonte da verdade

| Camada                    | Pode importar de                                           | Nunca importa de                              |
| ------------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| `src/componentes/ui`      | `src/estilos`, `src/lib/utils`                             | `src/features`, `src/lib/supabase`, `src/app` |
| `src/componentes/padroes` | `src/componentes/ui`, `src/lib/utils`                      | `src/features`, `src/lib/supabase`            |
| `src/componentes/layout`  | `src/componentes/ui`, `src/componentes/padroes`, `src/lib/utils` | `src/features`, `src/lib/supabase`, `src/app` |
| `src/features/X`          | `src/componentes/ui`, `src/componentes/padroes`, `src/lib` | **qualquer `src/features/Y`**                 |
| `src/lib`                 | `src/lib/utils`                                            | `src/features`, `src/componentes`, `src/app`  |
| `src/app`                 | tudo                                                       | —                                             |

## Zonas fixas

Escritas literalmente na configuração, porque são estáveis:

| #   | Alvo (quem é restringido) | Origem proibida                               |
| --- | ------------------------- | --------------------------------------------- |
| Z1  | `src/componentes/ui`      | `src/features`, `src/lib/supabase`, `src/app` |
| Z2  | `src/componentes/padroes` | `src/features`, `src/lib/supabase`            |
| Z3  | `src/lib`                 | `src/features`, `src/componentes`, `src/app`  |
| Z4  | `src/componentes/layout`  | `src/features`, `src/lib/supabase`, `src/app` |

Z3 é **cópia direta da tabela**, que ganhou a linha do `lib` em 20/08/2026: camada de apoio que
conhece quem apoia deixa de ser apoio. A regra nasceu como leitura inferida neste contrato e foi
promovida ao documento de origem — é lá que ela mora agora, e aqui ela só é aplicada.

**Z4** entrou em 21/08/2026, pelo mesmo caminho. Ela apareceu como observação na entrega dos
links de contato: `componentes/layout` importava de `componentes/ui` e passava no lint — mas
passava por **ausência de regra**, não por regra. A camada não tinha zona nenhuma, então um
cabeçalho podia importar de `features` e nada barrava. A linha foi para a tabela da seção 1 dos
padrões, e a zona veio atrás. Um cabeçalho não conhece notícia: quem compõe é a rota, que passa
por props.

## Zonas geradas — a parte que não pode apodrecer

A regra "uma feature nunca importa de outra" precisa de **uma zona por feature**. Escrever essas
zonas à mão significa que criar `features/eventos` e esquecer de registrá-la deixa o buraco aberto,
com o CI verde. Então a configuração lê os diretórios de `src/features/` no momento em que carrega
e emite, para cada feature `X`:

```text
alvo:    src/features/X
proibido: src/features   (exceto a própria X)
```

Feature nova nasce protegida, sem ninguém lembrar de nada. É o Princípio IX aplicado à ferramenta:
regra que depende de disciplina humana degrada.

## Como duas features conversam

Pela rota que as compõe, em `src/app/`. Se `noticias` e `eventos` precisam aparecer juntas, quem
junta é a página — nunca uma delas importando a outra.

## Demonstração obrigatória (FR-011)

Não basta configurar. A entrega inclui evidência de que a regra **falha** diante de violação real e
**volta a passar** quando ela sai. Quatro casos, cada um com as duas execuções:

| #   | Violação introduzida de propósito                                         | Esperado                                                                      |
| --- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| V1  | `src/componentes/ui/Botao.tsx` importa de `src/features/exemplo/dados.ts` | `npm run lint` falha, apontando arquivo, linha e `import/no-restricted-paths` |
| V2  | `src/features/exemplo` importa de uma segunda feature de teste            | `npm run lint` falha                                                          |
| V5  | `src/componentes/layout/Rodape.tsx` importa de `src/features/exemplo/dados.ts` | `npm run lint` falha, apontando arquivo, linha e a regra |
| V3  | Nenhuma violação (estado inicial)                                         | `npm run lint` passa com zero erro                                            |

**V2 é o caso que mais importa**, porque é o que a geração automática de zonas existe para cobrir.
Se ele passar quando deveria falhar, a regra **não está pronta** — e isso precisa aparecer na
demonstração, antes da entrega, não depois.

A demonstração é feita em alteração descartável, nunca incorporada ao ramo principal.

## Mensagem de falha

Precisa dizer, em português: qual arquivo, qual linha, qual camada tentou importar de qual, e por
que isso não é permitido. Mensagem que só diz "restricted path" obriga a próxima pessoa a caçar a
regra na configuração — e quem caça regra acaba desligando regra.
