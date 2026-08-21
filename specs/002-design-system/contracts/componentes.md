# Contrato dos componentes de base — F01

**Data**: 2026-08-21 · Fonte: `docs/PADROES-DE-CODIGO.md` seção 2 · Requisitos: FR-001 a FR-008

Este é o contrato entre o design system e todas as páginas que virão. Uma vez publicado, mudar a
forma de uma prop aqui quebra as features seguintes — então a superfície é pequena de propósito.

**Regra transversal**: toda variante é **união fechada de strings**. Booleana só onde ela não
descreve variante visual e não permite estado impossível — há exatamente **três** no conjunto
inteiro, e cada uma está justificada abaixo.

---

## `Botao`

| Prop | Tipo | Padrão | Observação |
|---|---|---|---|
| `children` | `ReactNode` | — | Composição, não prop `texto` |
| `variante` | `'primario' \| 'secundario' \| 'fantasma' \| 'icone'` | `'primario'` | `icone` mede 44×44 (ADR-0004 2.1) |
| `larguraTotal` | `boolean` | `false` | ✅ Booleana justificada: não é variante visual, é ocupação de espaço; combina com qualquer variante |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Padrão explícito evita envio acidental de formulário |
| demais | atributos nativos de `<button>` | — | `className` **não** é aceita: estilo é do componente |

**Tipografia — restaurada ao aprovado (ADR-0004 2.3)**: família `--font-heading`, peso
`--font-heading-weight` (400), tamanho `--font-size-controle` (14px). Raio: `--radius-pill`.

**Quando usar**: ação que *acontece* — enviar, confirmar, abrir, filtrar.
**Quando NÃO usar**: navegação. Se leva a outro endereço, é `<a>`, não botão. Regra da seção 5 dos
padrões.

**`variante="icone"` exige rótulo acessível**: `aria-label` obrigatório, porque o `Icone` é sempre
decorativo e não anuncia nada. Sem ele, o leitor de tela lê um botão sem nome.

---

## `Cartao`

Composição por partes nomeadas, todas opcionais e em qualquer ordem (research.md D4).

| Componente | Props | Observação |
|---|---|---|
| `Cartao` | `children`, `elevacao?: 'nenhuma' \| 'sm' \| 'md' \| 'lg'` | Padrão `'nenhuma'`. Raio `--radius-xl` |
| `Cartao.Kicker` | `children` | Texto curto em caixa alta acima do título |
| `Cartao.Titulo` | `children`, `nivel?: 2 \| 3 \| 4 \| 5 \| 6` | `nivel` escolhe a tag `<h*>` — o cartão não pode furar a hierarquia de títulos da página onde está |
| `Cartao.Corpo` | `children` | |
| `Cartao.Meta` | `children` | Linha de metadados, ex.: data e categoria |

**`nivel` é união fechada de números, não booleana**, e é obrigatoriamente uma escolha de quem
compõe: um cartão dentro de uma seção `<h2>` precisa de `<h3>`, e o componente não tem como saber
disso sozinho. Sem essa prop, a estrutura de títulos quebra em toda página com cartões — item D7 do
checklist de validação.

**Quando usar**: agrupar informação relacionada que se repete em lista — notícia, evento, material.
**Quando NÃO usar**: como caixa decorativa para dar fundo a qualquer coisa. Cartão sem conteúdo
agrupado é `<div>` com sombra.

---

## `Etiqueta`

| Prop | Tipo | Padrão |
|---|---|---|
| `children` | `ReactNode` | — |
| `variante` | `'destaque' \| 'apoio' \| 'neutra' \| 'contorno'` | `'neutra'` |

Mapeia `.tag-accent`, `.tag-accent-2`, `.tag-neutral` e `.tag-outline`. Raio `--radius-pill`.

**Quando usar**: classificar — categoria de notícia, eixo de projeto, situação de processo seletivo.
**Quando NÃO usar**: como botão. Etiqueta não clica; se precisa clicar, é botão ou link com
aparência de etiqueta, e isso é outra conversa.

**Caso de borda coberto**: texto longo em 360 px não pode empurrar a largura da página — a etiqueta
quebra linha em vez de estourar.

---

## `Campo`

O componente com mais superfície de acessibilidade do conjunto (research.md D5).

| Prop | Tipo | Padrão | Observação |
|---|---|---|---|
| `rotulo` | `string` | — | **Obrigatório.** Não existe campo sem rótulo |
| `tipo` | `'texto' \| 'email' \| 'textarea'` | `'texto'` | União fechada |
| `ajuda` | `string` | — | Ligado por `aria-describedby` |
| `erro` | `string` | — | Presença dele **é** o estado de erro. Não existe prop `temErro` separada — seria estado impossível esperando acontecer |
| `rotuloEscondido` | `boolean` | `false` | ✅ Booleana justificada: o rótulo continua existindo para leitor de tela, só não ocupa espaço na tela |
| `desabilitado` | `boolean` | `false` | ✅ Booleana justificada: é o `disabled` nativo, que já tira da ordem de tabulação |
| `id` | `string` | gerado | Gerado com `useId` se não vier — resolve o caso de dois campos com o mesmo rótulo |

**Contrato de acessibilidade — cada linha é verificável**:

| Situação | O que o componente garante |
|---|---|
| Sempre | `<label htmlFor={id}>` associado ao controle |
| Com ajuda | id da ajuda entra em `aria-describedby` |
| Com erro | id do erro entra em `aria-describedby`; `aria-invalid="true"` |
| Com erro | erro em região `aria-live="polite"`, anunciado ao aparecer |
| Com erro | erro tem **texto e ícone**, não só cor da borda (FR-007) |
| Desabilitado | `disabled` nativo; fora da ordem de tabulação |
| Mobile | fonte `--font-size-campo` (16px), para o Safari não dar zoom |
| Sempre | altura mínima `--alvo-de-toque` (44px) |

**Erro e desabilitado ao mesmo tempo** (caso de borda da spec): o campo fica desabilitado e a
mensagem de erro **continua visível**. Esconder o erro ao desabilitar apagaria a única explicação de
por que o formulário não envia.

**Quando usar**: qualquer entrada de texto de uma ou várias linhas.
**Quando NÃO usar**: seleção, opção única e caixa de marcação — entram quando houver tela que as
peça (Fase 2).

---

## `Separador`

| Prop | Tipo | Padrão |
|---|---|---|
| `decorativo` | `boolean` | `true` |

Converte `.hr`. ✅ **Booleana justificada**: separador decorativo recebe `role="presentation"` e
some para o leitor de tela; separador semântico permanece como `<hr>` anunciável, quando de fato
divide dois assuntos. É a diferença entre ruído e informação para quem ouve a página.

**Quando usar**: dividir blocos de assunto diferente.
**Quando NÃO usar**: criar respiro entre elementos — para isso existe espaçamento por token.

---

## `Icone` e `EstadoVazio` — entregues na F00

Não mudam nesta feature. Aparecem na vitrine e entram na tabela de fidelidade como **fora de
escopo de conversão** (não vieram do `liacup.css`).

O `Icone` mantém `aria-hidden` e `focusable="false"` fixos: é sempre decorativo, sempre acompanhado
de texto. Ícone com significado próprio precisa de rótulo e seria outro componente — está escrito no
próprio arquivo desde a F00.

---

## O que NÃO entra no contrato

- Nenhum componente aceita `className` ou `style` de fora. Estilo é responsabilidade do componente;
  abrir essa porta desfaz o design system em três features.
- Nenhum componente de base recebe dado de domínio. Recebe texto e `children`.
- Tabela, diálogo, opção e seletor segmentado: **Fase 2**, junto das telas do painel que os usam.
