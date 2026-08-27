# Contrato dos componentes — F03

**Data**: 2026-08-27 · Requisitos: FR-008 a FR-013, FR-021 a FR-030, FR-045 e FR-046

## `LinkComAparenciaDeBotao`

Componente de `componentes/ui/`, genérico e sem conhecimento de rota.

| Prop | Tipo | Padrão | Observação |
| --- | --- | --- | --- |
| `href` | string obrigatória | — | link sempre navega; não existe estado sem destino |
| `children` | ReactNode | — | composição |
| `variante` | `primario \| secundario \| fantasma` | `primario` | somente variantes textuais compartilhadas |
| `larguraTotal` | boolean | `false` | ocupação de espaço, combina com qualquer variante |
| demais | atributos seguros de `<a>` | — | `className`, `style` e `children` são omitidos |

Renderiza `<a>`, nunca `<button>`. Não oferece `icone` nem `disabled`.

## Aparência compartilhada

`Botao` e `LinkComAparenciaDeBotao` recebem classes de `aparencia-de-botao.ts` e do mesmo
`AparenciaDeBotao.module.css`. Nenhum CSS específico pode repetir variante, tipografia, padding,
borda, cor, fundo, raio ou altura.

O tipo de `Botao` passa a omitir também `style`, fechando o contrato já documentado na F01.

## `Cabecalho`

Server Component sem props de domínio. Compõe marca, CTA e navegação responsiva a partir do catálogo.
Não conhece banco, feature nem `app`.

## `NavegacaoPublica`

Única ilha cliente. Responsabilidades:

- derivar página atual com `usePathname`;
- sincronizar botão/diálogo;
- abrir/fechar e devolver foco;
- bloquear/restaurar rolagem;
- reagir à mudança para desktop sem duplicar o breakpoint em TypeScript.

Não busca dados e não contém texto institucional.

## `Rodape`

Server Component. Contém:

- “Liga Acadêmica Multiprofissional de Cuidados Paliativos · Universidade de Brasília”;
- “FCTS · Campus UnB Ceilândia”;
- `LinksDeContato` com os valores já existentes.

## `LinksDeContato`

Mantém os dois links e passa a renderizar `<address aria-label="Canais de contato da LIACUP">`.
Não cria landmark de navegação. O teste existente continua cobrando os mesmos destinos e passa a
cobrar a semântica de contato.

## `Icone`

União fechada com exatamente quatro nomes:

```text
instagram · email · abrir · fechar
```

Todos continuam `aria-hidden` e `focusable="false"`. O botão carrega o nome acessível.

## Vitrine

Mostra:

- quatro ícones, com motivo dos dois acréscimos;
- pares botão/link nas variantes `primario`, `secundario` e `fantasma`;
- cada variante em largura normal e total;
- dados de marcação que permitam ao teste identificar os seis pares sem depender da ordem do DOM.

A saída E2E deve declarar “6/6 pares visuais” e comparar apenas as propriedades contratadas em
[data-model.md](../data-model.md).
