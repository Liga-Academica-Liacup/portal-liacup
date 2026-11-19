# Proposta — interruptor "em construção"

## Why

O plano v7 (seção 6) decidiu que a produção continua mostrando "Portal em construção" até a R1, e
que as prévias da Vercel mostram o site real. Sem um interruptor, cada página da R1 que entrar na
`main` vai direto para o ar, meio pronta; a alternativa, uma branch longa, foi o que travou a F03.
Hoje a raiz é a página em construção e `/vitrine` está aberta a quem souber o endereço.

## What Changes

- **A variável `SITE_PUBLICADO`.** Só o texto exato `true` publica o site. Ausente, vazia, `TRUE`,
  `1` ou `false`: o site fica não publicado. Se a configuração estiver errada, o site fica
  escondido, nunca exposto.
- **Site não publicado:**
  - a raiz responde 200 com a página em construção de hoje (logo, frase, nome da liga, Instagram e
    e-mail), com o endereço `/` na barra;
  - `/em-construcao`, o endereço próprio da página, responde 200 com ela;
  - qualquer outro endereço de página, exista ou não, recebe **redirecionamento temporário (307)
    para a raiz**. Vale para `/vitrine`, `/sobre`, `/processo-seletivo` e
    `/endereco-que-nao-existe`. Fica um endereço só para o buscador, e "temporário" porque as
    páginas vão existir;
  - imagens, fontes, estilos e scripts passam sem desvio, senão a página perde a logo.
- **Site publicado:** o site responde normalmente, sem redirecionamento. `/vitrine` mostra a
  vitrine. Endereço sem página responde 404. `/em-construcao` também responde 404, para não sobrar
  página esquecida depois do lançamento. A raiz continua mostrando a página em construção até a
  `pagina-inicial` (Q1).
- **A página em construção não muda de aparência nem de texto.** Nenhum texto novo vai ao ar.
- **O modo é lido quando o site responde, não quando é compilado.** Uma versão compilada serve os
  dois modos, e é isso que permite o e2e abaixo sem mexer no CI.
- **e2e nos dois modos**, com um servidor para cada modo e uma só compilação.
- **`.env.example` e README** explicam a variável: o que faz, o único valor que publica, como fica
  em produção (sem a variável) e nas prévias (`true`), que mudança na Vercel só vale depois de nova
  implantação, e como ver o site na própria máquina.

**Critérios de aceite:**

- Modo não publicado: `/vitrine`, `/sobre` e `/processo-seletivo` levam à página em construção. O
  teste afirma duas coisas: a primeira resposta (307, com destino na raiz) e a página final.
  Modo publicado: as mesmas 3 não mostram a página em construção. A saída imprime
  `rotas verificadas: 3` em cada modo.
- Pedido sem seguir redirecionamento, para `/sobre` e `/endereco-que-nao-existe`: no modo não
  publicado, 307 com o caminho do destino igual a `/`; no modo publicado, 404 sem destino.
- O teste do modo não publicado é visto falhando com o interruptor removido e volta ao verde. As
  duas saídas vão para o `relatorio.md` (RP-12).
- Nada da F03 entra.

## Fora de escopo, de propósito

- Tudo da F03: cabeçalho, menu, rodapé novo, rotas da R1. A página inicial nova é da
  `pagina-inicial`.
- Qualquer mudança no CI (`.github/`, `lighthouserc.json`) ou em verificação existente.
- Mudar a aparência ou o texto da página em construção.
- Metadados, `canonical`, `sitemap.xml`, `robots.txt` e página 404 própria: são da `lancamento-r1`.
- A configuração da Vercel em si: quem faz é o Gabriel. O líder técnico entrega o passo a passo na
  entrega. Esta change só garante que o README explica.
- Ligar o interruptor em produção: isso é a `lancamento-r1`.

## Decisões do Portão 1 (19/11/2026)

- **Q1 = (a):** com o site publicado, a raiz continua sendo a página em construção, desenhada
  diretamente, até a `pagina-inicial`.
- **Q2 = nenhuma das duas, decisão própria do Gabriel:** com o site não publicado, todo endereço que
  não é a raiz, `/em-construcao` ou arquivo recebe 307 para a raiz. Motivo: hoje esses endereços
  dão 404 em produção, e respondê-los com 200 e o conteúdo da raiz faria o buscador indexar cópias.
- **Q3 = (c):** a rota própria é `/em-construcao`. No modo não publicado, a raiz serve essa página
  sem mudar o endereço. No modo publicado, `/em-construcao` responde 404.
- **Q4 = (a):** no `.env.example`, `SITE_PUBLICADO=true`, comentado como "só para a sua máquina".
- **Q5 = (a):** o `dev-frontend` escreve, com escopo nominal nos arquivos do interruptor,
  `playwright.config.ts`, `.env.example` e `README.md`. O `qa-acessibilidade` escreve o spec novo.
- **E1:** o cenário "A aparência não muda" sai da spec. A comparação antes/depois continua nas
  tarefas do guardião (1.1 e 4.1).
- **Pedido novo:** o par ligado/desligado confere o status e o destino do redirecionamento de
  `/sobre` e `/endereco-que-nao-existe` nos dois modos.

Nenhuma questão nova.

## Capabilities

### New Capabilities

- `publicacao-do-site`: o interruptor que decide se o público vê o site ou só a página em
  construção. Cobre o valor que publica, o comportamento do modo publicado, os recursos que passam
  sem desvio, a leitura na hora da resposta, a verificação nos dois modos e a documentação para quem
  mantém.

### Modified Capabilities

- `fundacao-e-ci`: o requisito "Página provisória no ar" passa a dizer o que cada endereço faz
  enquanto o site não está publicado. A raiz mostra a página, `/em-construcao` também, e todo outro
  endereço de página leva à raiz.

## Impact

| O que | Efeito | Quem escreve |
|---|---|---|
| Arquivos do interruptor em `src/` (lista nominal no `design.md`, D10) | Interceptador novo, função do valor exato e o teste dela, e a página em construção num lugar só | `dev-frontend` |
| `playwright.config.ts`, `.env.example`, `README.md` | Dois servidores numa compilação, e a variável explicada | `dev-frontend` |
| `tests/e2e/` | Spec novo dos dois modos | `qa-acessibilidade` |
| `.github/`, `lighthouserc.json`, `src/estilos/tokens.css`, `package.json` | Nenhum arquivo tocado | — |
| Produção | A raiz mostra o mesmo. Endereços que davam 404 passam a dar 307 para a raiz, e `/vitrine` também | — |
| Prévias | Com `true` na Vercel, iguais a hoje, mais `/em-construcao` com 404. Sem a variável, comportam-se como a produção | Gabriel, na Vercel |

Nenhuma dependência nova (RP-01).
