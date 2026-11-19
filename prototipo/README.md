Esta pasta guarda o protótipo do Portal LIACUP (`Portal-LIACUP.html`) e, em `prints/`, os 23 prints dele que são o gabarito de toda tela do site.

O protótipo veio de https://claude.ai/artifact/2JaFVq33WLXjsx8bvV17xY e está aqui como foi aprovado, sem nenhuma alteração.

O design foi aprovado pela liga e não muda: o arquivo do protótipo não se edita.

Para regerar os prints, rode `npm run prints:prototipo` (na primeira vez, antes, `npx playwright install --with-deps chromium`); só se regera quando o arquivo do protótipo muda.

A regra de como usar o gabarito ao conferir uma tela está em [`docs/REFERENCIA-VISUAL.md`](../docs/REFERENCIA-VISUAL.md); atenção: o protótipo traz dados de exemplo errados (e-mail, sede, cargos), e as correções obrigatórias estão na seção 6 desse documento, então não copie esses dados do gabarito.
