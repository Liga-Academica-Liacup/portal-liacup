# Pesquisa — Fase 0 · F03 Layout base

**Data**: 2026-08-27 · **Spec**: [spec.md](./spec.md) · **Branch**: `feat/F03-layout-base`

Esta pesquisa fecha as decisões técnicas abaixo da spec aprovada. A direção é deliberadamente
simples: HTML nativo, uma ilha cliente pequena, zero dependências novas e uma fonte única para os
dez destinos que o visitante e as verificações percorrem.

---

## D1 — A moldura pública vive no layout do grupo `(site)`

**Decisão**: criar `src/app/(site)/layout.tsx` como Server Component. Ele compõe, nesta ordem, o
link de pular conteúdo, `Cabecalho`, um único `<main id="conteudo-principal" tabIndex={-1}>` e
`Rodape`. O `src/app/layout.tsx` continua cuidando somente de idioma, fontes, metadados globais e
CSS global.

**Razão**: a moldura pertence a todas as páginas públicas e a nenhuma página interna. Colocá-la no
layout raiz faria `/vitrine` e o futuro painel administrativo receberem cabeçalho e rodapé do site.
Repeti-la em dez páginas criaria dez pontos de manutenção.

**Alternativas recusadas**:

- layout raiz: contamina `(interno)` e `(painel)`;
- composição em cada `page.tsx`: duplica a moldura e permite divergência silenciosa.

---

## D2 — Um catálogo JSON é a única fonte dos dez destinos

**Decisão**: versionar `src/componentes/layout/destinos-publicos.json` com exatamente dez objetos:
`rotulo`, `caminho` e `ehConversaoPrincipal`. Um adaptador TypeScript no mesmo diretório expõe o
tipo somente leitura e valida unicidade, quantidade e existência de uma única conversão principal.

O mesmo JSON é consumido por:

1. navegação renderizada;
2. Playwright;
3. `lighthouserc.cjs`;
4. o verificador dos relatórios do Lighthouse.

**Razão**: JSON é entendido nativamente pelo TypeScript (`resolveJsonModule`) e por uma configuração
CJS, sem transpilar TypeScript dentro do Lighthouse. A validação fica no adaptador; o dado continua
existindo uma vez só.

**Alternativas recusadas**:

- três listas em TS, teste e configuração: viola FR-044/SC-017;
- carregar `.ts` por `require()` no CJS: funciona hoje no Node 22, mas acopla a configuração ao
  suporte de remoção de tipos do runtime;
- rota dinâmica criada do catálogo: esconderia uma rota ausente e impediria a demonstração
  falhar→verde do SC-017.

---

## D3 — Nove rotas explícitas, finas e substituíveis

**Decisão**: manter `/` como décima rota e criar nove pastas explícitas em `src/app/(site)/`, uma por
destino. Cada `page.tsx` contém somente um `<h1>` com o nome da página e um aviso visível de que ela
está em construção. Não usa conteúdo institucional e não usa `EstadoVazio`, cujo contrato proíbe
aviso geral de página.

**Razão**: nas F04–F13 cada página provisória é substituída no próprio endereço. A estrutura fica
óbvia para quem lista a árvore, e a ausência de um arquivo produz 404 — exatamente o modo de falha
que a verificação deve detectar.

**Alternativas recusadas**:

- `[pagina]/page.tsx`: esconde as rotas e faz destino novo parecer entregue automaticamente;
- `EstadoVazio`: o próprio componente diz “quando não usar: como aviso geral da página”;
- adiantar conteúdo: invade F04–F13.

---

## D4 — A interação fica numa ilha cliente apoiada em `<dialog>` nativo

**Decisão**: `Cabecalho` e `Rodape` permanecem Server Components. Somente a navegação responsiva é
Client Component, porque precisa de `usePathname`, estado, eventos e APIs do navegador. O painel
lateral usa `<dialog>.showModal()`:

- modalização e foco contido vêm da plataforma;
- `cancel` trata Esc;
- clique no próprio backdrop fecha;
- `close` sincroniza estado e devolve foco ao acionador nas três formas normais de fechamento;
- a rolagem do `body` é bloqueada enquanto aberto e restaurada ao valor anterior no cleanup;
- ao passar para desktop, um listener observa se o acionador ficou oculto pelo CSS, fecha o diálogo
  e remove a trava sem tentar focar um elemento invisível.

O ponto de corte existe somente no CSS (`@media (min-width: 1024px)`). O JavaScript consulta a
visibilidade calculada do acionador, sem repetir `1024`.

**Razão**: o HTML dos destinos existe antes da hidratação, enquanto o código cliente fica restrito
ao comportamento que realmente exige navegador. O `<dialog>` reduz o código de foco e inércia.

**Alternativas recusadas**:

- biblioteca de drawer/focus-lock/body-scroll-lock: dependência nova para comportamento nativo;
- prisão de foco manual: mais código e mais estados de borda;
- cabeçalho inteiro cliente: amplia desnecessariamente a fronteira de hidratação.

---

## D5 — A aparência de botão é um módulo compartilhado, não copiado

**Decisão**: extrair de `Botao.module.css` um único `AparenciaDeBotao.module.css` e um helper
`aparencia-de-botao.ts`, ambos em `componentes/ui`. `Botao` e o novo
`LinkComAparenciaDeBotao` importam os mesmos mapas e classes.

O link renderiza `<a>`, exige `href`, aceita somente `primario | secundario | fantasma` e
`larguraTotal`, além dos atributos nativos seguros. `className` e `style` são omitidos dos dois
componentes. `Botao` mantém sua variante `icone` e seu estado `disabled`, que não são copiados para
o link sem consumidor real.

**Razão**: FR-045 exige que uma alteração visual alcance os dois sem edição dupla. Compartilhar
somente valores ou copiar CSS não cria essa garantia. Fechar `style` também corrige uma abertura
atual do tipo de `Botao` que contradiz o contrato da F01.

**Alternativas recusadas**:

- `Botao` polimórfico com `as="a"`: mistura ação e navegação e multiplica estados impossíveis;
- CSS duplicado: duas fontes de verdade;
- variante de ícone ou link desabilitado: API especulativa, recusada por Gabriel em 27/08/2026;
- CVA, clsx ou biblioteca de componentes: nova dependência sem problema correspondente.

---

## D6 — A igualdade visual é medida em propriedades contratadas

**Decisão**: a vitrine mostra pares `Botao`/`LinkComAparenciaDeBotao` nas três variantes textuais,
em largura normal e total. O Playwright compara propriedades calculadas relevantes: display,
alinhamento, gap, padding, bordas, tipografia, cor, fundo, raio, altura mínima, largura quando total,
cursor e decoração de texto. A saída informa quantos pares foram comparados.

**Razão**: importar o mesmo módulo prova origem única; comparar `getComputedStyle` prova resultado.
Comparar a `CSSStyleDeclaration` inteira seria instável por diferenças nativas irrelevantes entre
`button` e `a`.

**Alternativas recusadas**:

- revisão visual sem medição: não atende “verificado, não olhado”;
- screenshot de referência: adiciona arquivos binários e instabilidade entre ambientes.

---

## D7 — Uma única região de navegação por página

**Decisão**: `LinksDeContato` continua sendo o componente e a fonte dos dois contatos confirmados,
mas seu contêiner muda de `<nav>` para `<address aria-label="Canais de contato da LIACUP">`.
Somente a navegação principal usa `<nav>`.

No responsivo, a navegação desktop e a do diálogo podem existir no HTML, desde que o CSS exponha
somente uma delas à árvore de acessibilidade em cada largura. O teste conta landmarks acessíveis.

**Razão**: mover o componente atual para o rodapé sem essa mudança produziria dois landmarks de
navegação e reprovaria FR-020/SC-014.

**Alternativa recusada**: manter `<nav>` e relaxar o teste. O conflito é semântico, não do teste.

---

## D8 — Conversão fiel da família `.nav`

**Decisão**: remover os cinco seletores `.nav`, `.nav-brand`, `.nav a`, `.nav a:hover` e
`.nav a[aria-current='page']`, atualizando a contagem pendente de 27 para 22. Classes explícitas são
aplicadas somente a links textuais, para não sobrescrever a CTA.

A marca usa um único token novo, `--font-size-marca: 18px`, com origem literal no `.nav-brand`.
Hover e página atual usam `--color-accent-700`; a página atual recebe ainda indicação não cromática.
O orçamento mobile é alvo de 44 px mais `--space-2` vertical (61,6 px), abaixo do limite de 64 px.
Em 1024 px usa-se primeiro `--space-4`; se a medição não couber, o plano B aprovado reduz para
`--space-3` e, se ainda falhar, a implementação para.

**Razão**: preserva valores efetivos, aplica a correção de contraste já decidida e evita seletor
descendente genérico afetar o link-botão.

**Alternativas recusadas**:

- manter classes comentadas: comentário continua sendo lido como referência vigente;
- alterar token existente: viola RP-03;
- inventar ponto de corte: viola os padrões.

---

## D9 — Os dois ícones entram no conjunto fechado existente

**Decisão**: `NomeDoIcone` ganha exatamente `abrir` e `fechar`, além de `instagram` e `email`. Os
desenhos ficam no mesmo `Record`, continuam decorativos e o nome acessível permanece no botão.
Teste e vitrine passam a cobrir os quatro nomes.

**Razão**: a união fechada torna falta ou nome inválido um erro de compilação e cumpre SC-015.

**Alternativas recusadas**: biblioteca de ícones ou um arquivo por desenho; aumentam superfície sem
melhorar o contrato atual.

---

## D10 — Playwright percorre 10 páginas × 7 larguras a partir do catálogo

**Decisão**: uma suíte `paginas-publicas.spec.ts` importa o catálogo e, por página/largura, mede:
resposta bem-sucedida, um cabeçalho/nav/main/rodapé, axe, rolagem horizontal, alvos de toque e altura
numérica do cabeçalho. A saída agrega `10/10` páginas por largura e os contadores de cada medição.

Uma suíte focada em 360 px percorre de verdade os sete caminhos de teclado usando
`page.keyboard.press`; ela inclui Tab inicial, skip link, abertura, ciclo Tab/Shift+Tab, Esc,
escolha de destino e ordem de foco. A ordem visual em desktop é calculada pelas coordenadas dos
elementos e comparada à sequência de Tab, para não deixar CSS `order` escapar.

Clique fora, trava de rolagem e resize mobile→desktop entram como casos adicionais, sem adulterar o
contador obrigatório `7/7`.

**Razão**: uma lista alimenta todos os percursos, e a saída distingue “passou” de “não mediu”.

**Alternativas recusadas**:

- `.focus()`/`.click()` nos sete percursos: testa configuração, não uso real por teclado;
- 70 blocos copiados: duplicação que diverge quando uma página muda;
- comparar ordem do DOM apenas: não detecta reordenação visual por CSS.

---

## D11 — Lighthouse usa as mesmas dez rotas e prova o que auditou

**Decisão**: substituir `lighthouserc.json` por `lighthouserc.cjs`. A configuração carrega o JSON
canônico e gera dez URLs. O perfil declara explicitamente `formFactor: 'mobile'`, emulação de tela
mobile e `throttlingMethod: 'simulate'`; não existe `preset: 'mobile'`.

Depois do `lhci autorun`, `scripts/verificar-paginas-lighthouse.mjs` lê somente o
`.lighthouseci/manifest.json` da execução atual e os `jsonPath` apontados por ele. O script verifica:

- 10/10 caminhos distintos e 3 execuções por caminho (30/30);
- URL pedida/final e auditoria de status HTTP bem-sucedida;
- perfil mobile e simulação presentes nos relatórios;
- contadores impressos na saída.

`npm run test:desempenho` encadeia os dois comandos; o CI não precisa mudar.

**Razão**: configuração derivada evita lista paralela; inspeção do relatório prova execução real.
Uma página 404 não pode passar apenas por ter boa pontuação de desempenho.

**Alternativas recusadas**:

- manter `lighthouserc.json`: não consegue derivar URLs;
- procurar todos os JSONs da pasta: mistura relatórios antigos e `assertion-results.json`;
- inventar preset mobile: opção inexistente na versão instalada.

---

## D12 — Zero dependências novas e demonstrações permanentes

**Decisão**: manter 22 dependências diretas — 4 de execução e 18 de desenvolvimento. React/Next,
CSS Modules, Vitest, Testing Library, Playwright, axe-core e LHCI já cobrem todo o plano.

Toda verificação nova é demonstrada falhando e voltando ao verde. O registro fica em
`EVIDENCIAS-F03.md`, com violação temporária, comando, saída/código e restauração. A demonstração do
SC-017 acrescenta um destino sem rota ao catálogo: Playwright e Lighthouse passam a cobrá-lo sem
edição em outra lista e falham nomeando o caminho.

**Razão**: atende RP-01 e RP-12 sem criar ferramenta que a próxima diretoria precise aprender.

**Alternativas recusadas**: dependências de drawer, foco, scroll lock, variantes ou ícones. Todas
resolvem com mais superfície problemas já cobertos pela plataforma e pelo projeto.
