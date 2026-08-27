# Contrato de navegação pública — F03

**Data**: 2026-08-27 · Requisitos: FR-001 a FR-020, FR-044

## Rotas públicas

Os dez caminhos e rótulos são os de [data-model.md](../data-model.md). O arquivo executável único é
`src/componentes/layout/destinos-publicos.json`.

Cada caminho deve:

- responder sem erro;
- renderizar a moldura pública;
- ter um `<h1>` próprio;
- não redirecionar para outro destino;
- participar automaticamente de Playwright e Lighthouse.

As nove páginas ainda não implementadas exibem somente o título e “Página em construção”. Nenhuma
frase institucional, número ou associação de pessoa é permitida.

## Moldura

Ordem semântica obrigatória:

```text
link de pular conteúdo
header
  marca → /
  nav acessível
  CTA → /processo-seletivo
main#conteudo-principal[tabindex=-1]
  conteúdo da rota
footer
  linha institucional
  sede curta
  address com os dois canais confirmados
```

Exatamente um landmark acessível de cada papel: banner, navigation, main e contentinfo.

## Comportamento por largura

| Largura | Navegação direta | CTA processo | Botão do painel | Painel |
| --- | --- | --- | --- | --- |
| 360, 390, 430, 480, 768 | escondida | visível | visível | disponível e fechado |
| 1024, 1280 | visível | parte da navegação direta | ausente da árvore acessível | ausente da árvore acessível |

O cabeçalho permanece visível durante rolagem. Nas quatro larguras mobile mede no máximo 64 px; nas
sete a altura é registrada.

## Página atual

- comparação exata entre pathname e catálogo;
- `aria-current="page"` no link correspondente;
- pista visual que não depende somente de cor;
- caminho fora do catálogo marca zero itens.

## Painel lateral

- botão nativo com nome acessível, `aria-expanded` e `aria-controls`;
- `<dialog>` modal com nome acessível;
- fecha por destino, Esc e backdrop;
- Tab/Shift+Tab permanecem dentro enquanto aberto;
- rolagem de fundo fica bloqueada e é restaurada ao fechar/unmount/resize;
- fechamento normal devolve foco ao acionador;
- mudança para desktop nunca tenta focar acionador invisível.

## Fonte única

Destino acrescentado ao JSON deve automaticamente:

1. aparecer na navegação adequada;
2. entrar no percurso Playwright;
3. entrar nas URLs do Lighthouse;
4. falhar nomeando o caminho se a rota não existir.
