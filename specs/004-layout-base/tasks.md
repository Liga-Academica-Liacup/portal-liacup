---
description: 'Decomposição executável e ordenada da F03 — Layout base'
---

# Tarefas: Layout base (F03)

**Input**: documentos de desenho em `specs/004-layout-base/`  
**Pré-requisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`,
`quickstart.md` e `.specify/memory/constitution.md`

**Testes**: obrigatórios. A spec exige testes de unidade, Playwright, axe-core, teclado real,
responsividade e Lighthouse. Toda verificação nova deve ser vista falhando antes da implementação
correspondente e voltar ao verde com contador objetivo (FR-041/RP-12).

**Organização**: tarefas agrupadas por história. Como US1–US5 têm prioridade P1 e compartilham a
mesma moldura, a ordem abaixo respeita dependências técnicas: primeiro a estrutura comum, depois a
navegação responsiva, então a medição dimensional final, o comportamento de teclado e os estados
acessíveis. US4 e US5 podem avançar em paralelo depois de US3.

## Formato: `[ID] [P?] [Story] Descrição com caminho`

- **[P]**: pode avançar em paralelo porque toca arquivos diferentes e não depende de tarefa
  incompleta.
- **[Story]**: história atendida pela tarefa.
- A ordem dos IDs é a ordem segura para uma única pessoa desenvolvedora.
- Nenhuma tarefa autoriza dependência nova, conteúdo de F04–F13, breakpoint fora de 480/768/1024
  ou componente não declarado.

## Fase 1: Preparação e linha de base

**Objetivo**: preservar o estado inicial e abrir o registro auditável da implementação.

- [ ] T001 Criar `specs/004-layout-base/EVIDENCIAS-F03.md` com branch, SHA inicial, estrutura por requisito, campos de comando/código/contador e seções separadas para cada demonstração vermelho→verde
- [ ] T002 Executar a linha de base de `specs/004-layout-base/quickstart.md` e registrar em `specs/004-layout-base/EVIDENCIAS-F03.md` os totais reais de `npm run verificar`, `npm test`, `npm run test:banco`, `npm run test:e2e`, build, dependências 4+18=22 e Lighthouse atual, sem corrigir falha encontrada

**Checkpoint**: estado anterior à F03 reproduzível e nenhuma dependência alterada.

---

## Fase 2: Fundação bloqueadora

**Objetivo**: estabelecer a fonte única dos destinos e a infraestrutura de medição antes da
moldura.

**Crítico**: nenhuma história começa antes de o catálogo canônico estar verde.

- [ ] T003 Escrever primeiro os testes de quantidade, rótulos, caminhos únicos, formato de rota e única conversão principal em `src/componentes/layout/destinos-publicos.test.ts`, executar o teste focado ainda sem o catálogo e registrar o vermelho em `specs/004-layout-base/EVIDENCIAS-F03.md`
- [ ] T004 Criar os dez itens exatos em `src/componentes/layout/destinos-publicos.json` e o adaptador somente leitura com validação explícita em `src/componentes/layout/destinos-publicos.ts`, então tornar `src/componentes/layout/destinos-publicos.test.ts` verde com contador 10/10
- [ ] T005 [P] Criar em `tests/e2e/apoio/medicoes.ts` funções reutilizáveis para medir landmarks acessíveis, rolagem horizontal, altura do cabeçalho, alvos de toque visíveis e propriedades calculadas, sem copiar destinos nem definir breakpoint em TypeScript
- [ ] T006 [P] Substituir `lighthouserc.json` por `lighthouserc.cjs` derivando dez URLs de `src/componentes/layout/destinos-publicos.json` e declarando `formFactor=mobile`, emulação de tela mobile e `throttlingMethod=simulate`; criar `scripts/verificar-paginas-lighthouse.mjs` para conferir no manifest atual 10/10 caminhos, 30/30 relatórios, três execuções, status HTTP, URL final e perfil, encadear o pós-verificador em `package.json` e executar contra as rotas ainda ausentes para registrar o vermelho nominal antes de qualquer rota ser criada

**Checkpoint**: uma única lista alimenta aplicação, Playwright e Lighthouse; ausência de rota fica
vermelha.

---

## Fase 3: US1 — A mesma moldura em toda página (P1) 🎯

**Objetivo**: entregar dez rotas com o mesmo header/nav/main/footer e contatos corretos, sem
conteúdo antecipado.

**Teste independente**: abrir cada caminho do catálogo e comprovar resposta válida, `h1` próprio,
uma moldura estrutural idêntica, uma região de cada papel e marca apontando para `/`.

### Testes e evidência vermelha

- [ ] T007 [P] [US1] Ampliar `src/componentes/layout/LinksDeContato.test.tsx` para exigir os dois destinos preservados, contêiner `address` nomeado e ausência de landmark `navigation`, executar o teste focado e registrar o vermelho antes da mudança semântica
- [ ] T008 [P] [US1] Migrar os cenários ainda válidos de `tests/e2e/pagina-inicial.spec.ts` e substituí-lo por `tests/e2e/paginas-publicas.spec.ts` com casos derivados do catálogo para status, URL final, `h1`, marca, header/nav/main/footer únicos, igualdade estrutural e zero requisição externa; executar contra o estado atual e registrar caminhos e contagens que falharam

### Implementação

- [ ] T009 [P] [US1] Atualizar semântica e comentários de `src/componentes/layout/LinksDeContato.tsx` e `src/componentes/layout/LinksDeContato.module.css`, e compor linha institucional, sede curta e contatos em `src/componentes/layout/Rodape.tsx` e `src/componentes/layout/Rodape.module.css`
- [ ] T010 [P] [US1] Criar a navegação estrutural baseada somente no catálogo em `src/componentes/layout/NavegacaoPublica.tsx` e `src/componentes/layout/NavegacaoPublica.module.css`, sem estado de negócio e sem uma segunda lista de destinos
- [ ] T011 [US1] Criar `src/componentes/layout/Cabecalho.tsx`, `src/componentes/layout/Cabecalho.module.css`, `src/app/(site)/layout.tsx` e `src/app/(site)/layout.module.css` compondo skip link primeiro, header, uma navegação, `main#conteudo-principal[tabIndex=-1]` e rodapé, mantendo `src/app/layout.tsx` exclusivamente global
- [ ] T012 [P] [US1] Reduzir `src/app/(site)/page.tsx` e `src/app/(site)/page.module.css` ao conteúdo provisório permitido para Início, removendo da página os contatos e o rodapé agora fornecidos pelo layout
- [ ] T013 [P] [US1] Criar as nove rotas explícitas `src/app/(site)/sobre/page.tsx`, `src/app/(site)/noticias/page.tsx`, `src/app/(site)/conteudo-educativo/page.tsx`, `src/app/(site)/eventos/page.tsx`, `src/app/(site)/projetos/page.tsx`, `src/app/(site)/materiais/page.tsx`, `src/app/(site)/galeria/page.tsx`, `src/app/(site)/processo-seletivo/page.tsx` e `src/app/(site)/contato/page.tsx`, cada uma somente com `h1` e “Página em construção”
- [ ] T014 [US1] Executar os testes focados de `src/componentes/layout/LinksDeContato.test.tsx` e `tests/e2e/paginas-publicas.spec.ts`, registrar 10/10 rotas e landmarks em `specs/004-layout-base/EVIDENCIAS-F03.md` e parar se qualquer página tiver conteúdo institucional além do rodapé aprovado

**Checkpoint**: US1 verificável nas dez rotas; nenhum conteúdo das features seguintes foi criado.

---

## Fase 4: US3 — Conversão principal visível e navegação responsiva (P1)

**Objetivo**: manter “Processo seletivo” visível abaixo de 1024 px, oferecer os outros nove destinos
no painel e mostrar navegação direta completa a partir de 1024 px.

**Teste independente**: nas cinco larguras abaixo de 1024 px, CTA e botão aparecem e nove destinos
ficam no diálogo; em 1024/1280 px, os dez destinos estão diretos e acionador/diálogo não pertencem à
árvore acessível.

### Testes e evidência vermelha

- [ ] T015 [P] [US3] Criar `src/componentes/ui/LinkComAparenciaDeBotao.test.tsx` e ampliar `src/componentes/ui/Botao.test.tsx` com contratos de tipo e execução que rejeitem `className`/`style` nos dois, `icone`/`disabled` no link, e cubram `href`, três variantes e largura total; registrar vermelho de tipos/unidade antes da implementação
- [ ] T016 [P] [US3] Ampliar `src/componentes/ui/Icone.test.tsx` e `tests/e2e/vitrine.spec.ts` para exigir exatamente quatro ícones e seis pares botão/link identificáveis, comparando as propriedades calculadas contratadas; registrar vermelho com o número de pares antes da implementação
- [ ] T017 [P] [US3] Acrescentar a `tests/e2e/paginas-publicas.spec.ts` casos derivados do catálogo para CTA, nove destinos do painel, dez destinos desktop, ausência acessível do diálogo/acionador no desktop e alvo do acionador ≥44 px; registrar vermelho nas larguras afetadas

### Implementação

- [ ] T018 [P] [US3] Extrair a origem visual única para `src/componentes/ui/AparenciaDeBotao.module.css` e `src/componentes/ui/aparencia-de-botao.ts`, refatorar `src/componentes/ui/Botao.tsx` para usar essa origem e remover `src/componentes/ui/Botao.module.css` sem alterar a API existente além de omitir `style`
- [ ] T019 [US3] Criar `src/componentes/ui/LinkComAparenciaDeBotao.tsx` como `a` real com `href` obrigatório, variantes `primario|secundario|fantasma`, `larguraTotal` e atributos seguros, consumindo exclusivamente a aparência de T018
- [ ] T020 [P] [US3] Acrescentar somente `abrir` e `fechar` à união e ao `Record` de `src/componentes/ui/Icone.tsx`, preservando `aria-hidden`/`focusable=false` e documentando o motivo no componente
- [ ] T021 [US3] Atualizar `src/app/(interno)/vitrine/BotaoDemo.tsx`, `src/app/(interno)/vitrine/IconeDemo.tsx` e `src/app/(interno)/vitrine/page.tsx` com os seis pares identificáveis e quatro ícones, sem criar variantes de link sem consumidor
- [ ] T022 [US3] Transformar `src/componentes/layout/NavegacaoPublica.tsx` na única ilha cliente, completar `src/componentes/layout/NavegacaoPublica.module.css` e ajustar `src/componentes/layout/Cabecalho.tsx`/`src/componentes/layout/Cabecalho.module.css` para CTA com link-botão, acionador nativo e `dialog`; o CSS detém o corte de 1024 px e o TypeScript consulta visibilidade calculada
- [ ] T023 [US3] Executar tipos, unidades e os casos focados de `tests/e2e/paginas-publicas.spec.ts`/`tests/e2e/vitrine.spec.ts`, registrar 10 destinos, quatro ícones, seis de seis pares e todos os alvos medidos em `specs/004-layout-base/EVIDENCIAS-F03.md`

**Checkpoint**: US3 funcional sem duplicar aparência, destinos ou breakpoint.

---

## Fase 5: US2 — Cabeçalho devolve a tela ao celular (P1)

**Objetivo**: medir a moldura completa e fechar a geometria final do cabeçalho fixo.

**Teste independente**: altura numérica nas sete larguras, máximo de 64 px em 360/390/430/480,
permanência após rolagem e zero rolagem horizontal.

### Testes e evidência vermelha

- [ ] T024 [US2] Completar em `tests/e2e/paginas-publicas.spec.ts` as medições de altura, posição após rolagem e `scrollWidth<=clientWidth` nas 70 combinações; executar primeiro e, se a estrutura já passar naturalmente, introduzir uma violação temporária isolada para provar cada detector vermelho antes de restaurá-la

### Implementação

- [ ] T025 [US2] Acrescentar somente `--font-size-marca: 18px` com origem literal `.nav-brand` em `src/estilos/tokens.css`, sem alterar qualquer token existente
- [ ] T026 [US2] Ajustar `src/componentes/layout/Cabecalho.module.css`, `src/componentes/layout/NavegacaoPublica.module.css` e `src/app/(site)/layout.module.css` usando exclusivamente tokens para cabeçalho fixo, orçamento mobile ≤64 px e ausência de overflow; em 1024 px aplicar apenas o plano B `--space-4`→`--space-3` se a medição reprovar e parar se ainda não couber
- [ ] T027 [US2] Executar a matriz de `tests/e2e/paginas-publicas.spec.ts` e registrar em `specs/004-layout-base/EVIDENCIAS-F03.md` as sete alturas, 70/70 combinações, zero overflow e evidência de permanência ao rolar

**Checkpoint**: US2 comprovada por números depois de todos os controles reais existirem.

---

## Fase 6: US4 — Percurso integral por teclado (P1)

**Objetivo**: tornar o painel operável sem mouse, com foco contido, fechamento previsível e estado
do fundo restaurado.

**Teste independente**: sete percursos reais em 360 px produzem 7/7; backdrop, trava de rolagem e
resize mobile→desktop passam como casos adicionais.

### Testes e evidência vermelha

- [ ] T028 [US4] Criar `tests/e2e/navegacao-teclado.spec.ts` com sete percursos usando somente `page.keyboard.press`: primeiro Tab/skip visível, Enter/`main` focado, Tab+Enter/abertura, Tab+Shift+Tab/ciclo, Esc/retorno, Enter no destino atual/fechamento e sequência Tab/ordem visual; acrescentar casos de backdrop, scroll lock e resize, executar cada caso focado antes da correção e registrar sete vermelhos individualizados, ou induzir uma violação temporária isolada se algum já passar

### Implementação

- [ ] T029 [US4] Implementar em `src/componentes/layout/NavegacaoPublica.tsx` abertura por `showModal()`, sincronização pelo evento `close` e fechamento por destino, `cancel`/Esc e clique no próprio backdrop, sempre devolvendo foco ao acionador visível
- [ ] T030 [US4] Implementar em `src/componentes/layout/NavegacaoPublica.tsx` bloqueio/restauração do valor anterior de `body.style.overflow` em fechamento, unmount e resize, fechando ao passar para desktop sem focar elemento oculto e sem repetir `1024` no TypeScript
- [ ] T031 [P] [US4] Completar em `src/componentes/layout/NavegacaoPublica.module.css` a apresentação lateral, backdrop e estados aberto/fechado usando tokens, preservando a modalização e o foco nativos do `dialog`
- [ ] T032 [US4] Executar `tests/e2e/navegacao-teclado.spec.ts` em 360 px, registrar 7/7 e os casos adicionais em `specs/004-layout-base/EVIDENCIAS-F03.md` e confirmar restauração de foco/rolagem após cada forma de fechamento

**Checkpoint**: US4 passa por interação real, não por inspeção de atributos.

---

## Fase 7: US5 — Estado e propósito anunciados (P1)

**Objetivo**: expor página atual, estado do painel e landmarks sem depender apenas de cor.

**Teste independente**: em cada rota existe um único `aria-current=page` correspondente, ou zero
fora do catálogo; botão anuncia estado/região e diálogo tem nome acessível.

### Testes e evidência vermelha

- [ ] T033 [US5] Criar `src/componentes/layout/NavegacaoPublica.test.tsx` para caminho exato e caminho sem correspondência e acrescentar a `tests/e2e/paginas-publicas.spec.ts` testes de `aria-current`, pista não cromática, `aria-expanded`, `aria-controls`, nome do diálogo e exatamente um landmark acessível de cada papel; registrar vermelho focado antes da correção

### Implementação

- [ ] T034 [US5] Derivar o destino atual por igualdade exata com `usePathname` em `src/componentes/layout/NavegacaoPublica.tsx`, aplicar `aria-current=page` e sincronizar `aria-expanded`/`aria-controls` com o diálogo real
- [ ] T035 [US5] Implementar em `src/componentes/layout/NavegacaoPublica.module.css` a pista visual não cromática e revisar `src/componentes/layout/Cabecalho.tsx`, `src/app/(site)/layout.tsx` e `src/componentes/layout/LinksDeContato.tsx` para garantir uma única região banner/navigation/main/contentinfo
- [ ] T036 [US5] Executar os testes focados nas dez rotas em mobile e desktop, registrar contagens de landmarks e páginas atuais em `specs/004-layout-base/EVIDENCIAS-F03.md` e confirmar zero marcação em rota fora do catálogo

**Checkpoint**: US5 anunciada corretamente e sem landmark duplicado.

---

## Fase 8: US6 — Conversão fiel da família `.nav` (P2)

**Objetivo**: remover a fonte legada, aplicar a correção de contraste aprovada e fechar a
fidelidade com medidas reproduzíveis.

**Teste independente**: zero ocorrência da família `.nav` no `liacup.css`, contagem 27→22,
`accent-700` nos estados contratados e todas as combinações do cabeçalho/rodapé registradas.

### Testes e evidência vermelha

- [ ] T037 [US6] Acrescentar a `tests/e2e/paginas-publicas.spec.ts` medições das combinações de texto, CTA, link atual/hover, bordas e separadores usando `tests/e2e/apoio/medicoes.ts`; executar com violação temporária isolada para provar o detector de contraste e registrar pares nomeados no vermelho

### Implementação e registro

- [ ] T038 [P] [US6] Remover de `liacup.css` os cinco seletores `.nav`, `.nav-brand`, `.nav a`, `.nav a:hover` e `.nav a[aria-current='page']`, apagar a pendência correspondente e atualizar a contagem reproduzível sob o banner de 27 para 22
- [ ] T039 [P] [US6] Auditar `src/estilos/tokens.css` e registrar em `specs/004-layout-base/FIDELIDADE.md` que a diferença contém somente o acréscimo `--font-size-marca`, com zero token existente alterado
- [ ] T040 [US6] Preencher em `specs/004-layout-base/FIDELIDADE.md` os valores efetivos de navegação, rodapé, seis pares compartilhados, nove combinações de contraste, contagens e motivo/veredito de toda linha não idêntica
- [ ] T041 [US6] Executar as buscas e medições de `liacup.css`/`tests/e2e/paginas-publicas.spec.ts`, registrar zero ocorrências, 22 seletores e todos os pares de cor nomeados em `specs/004-layout-base/EVIDENCIAS-F03.md`

**Checkpoint**: US6 fecha a dívida do `liacup.css` sem apagar pendências de outras features.

---

## Fase 9: Verificação transversal e encerramento

**Objetivo**: provar que os incrementos funcionam juntos e que cada verificador mede o resultado
real.

- [ ] T042 Consolidar `tests/e2e/paginas-publicas.spec.ts` para que o catálogo gere exatamente 70 casos página/largura e a saída declare 10/10 por largura e 70/70 no total, sem lista de caminhos copiada
- [ ] T043 Demonstrar FR-044/SC-017 acrescentando temporariamente um 11º destino sem rota em `src/componentes/layout/destinos-publicos.json`, registrar em `specs/004-layout-base/EVIDENCIAS-F03.md` os vermelhos nominais de `tests/e2e/paginas-publicas.spec.ts` e `scripts/verificar-paginas-lighthouse.mjs` sem editar consumidores, restaurar o catálogo e obter 10/10, 70/70 e 30/30
- [ ] T044 Demonstrar isoladamente as verificações novas de rota/status, landmarks, altura, overflow e alvos em `tests/e2e/paginas-publicas.spec.ts`, registrando violação, comando, código, contador vermelho, restauração e contador verde em `specs/004-layout-base/EVIDENCIAS-F03.md`
- [ ] T045 Demonstrar isoladamente os sete percursos e os casos adicionais de `tests/e2e/navegacao-teclado.spec.ts`, completando em `specs/004-layout-base/EVIDENCIAS-F03.md` as sete provas vermelho→verde e o agregado 7/7
- [ ] T046 Demonstrar em `tests/e2e/vitrine.spec.ts` uma divergência temporária de aparência e, em `scripts/verificar-paginas-lighthouse.mjs`, violações temporárias de cobertura/perfil/status/URL final, registrando detecção e restauração em `specs/004-layout-base/EVIDENCIAS-F03.md`
- [ ] T047 Varrer `src/`, `tests/`, `scripts/`, `liacup.css`, `lighthouserc.cjs` e `package.json` e registrar em `specs/004-layout-base/EVIDENCIAS-F03.md` zero e-mail inventado, zero “Faculdade de Medicina · Campus Darcy Ribeiro”, nove avisos provisórios sem conteúdo institucional, quatro ícones exatos, cinco seletores removidos, um token novo, dependências 4+18=22, Server Components por padrão e todos os componentes dentro do limite de 150 linhas
- [ ] T048 Executar `npm test` e `npm run test:banco` e registrar totais reais, arquivos, testes passados/falhos e preservação das suítes em `specs/004-layout-base/EVIDENCIAS-F03.md`
- [ ] T049 Executar `npm run build` e `npm run test:e2e`, registrar rotas geradas, 10/10, 70/70, alvos medidos, sete alturas, 7/7 teclado, 6/6 pares e zero axe/overflow em `specs/004-layout-base/EVIDENCIAS-F03.md`
- [ ] T050 Executar `npm run test:desempenho` contra o build e registrar em `specs/004-layout-base/EVIDENCIAS-F03.md` 10/10 caminhos, 30/30 relatórios, três execuções por rota, status/URL final, perfil mobile simulado e menores notas de desempenho/acessibilidade
- [ ] T051 Atualizar em `README.md` toda referência ao `lighthouserc.json`, que o T006 substitui por `lighthouserc.cjs` — hoje a linha 153 ("**O que NAO fazer:** baixar o limiar em `lighthouserc.json`") é a única instrução do repositório contra afrouxar o limiar, e depois do T006 ela aponta para um arquivo que não existe; varrer `README.md` inteiro por `lighthouserc` e registrar em `specs/004-layout-base/EVIDENCIAS-F03.md` a contagem de ocorrências antes e depois, com zero apontando para o nome antigo
- [ ] T052 Completar o veredito de `specs/004-layout-base/FIDELIDADE.md` e o resumo final de `specs/004-layout-base/EVIDENCIAS-F03.md`, executar por último `npm run verificar`, então conferir `git diff --check` e `git status -sb` e parar para revisão sem commit, push, PR ou merge

---

## Dependências e ordem de execução

### Dependências de fase

- **Fase 1**: começa imediatamente e preserva a linha de base.
- **Fase 2**: depende da Fase 1 e bloqueia todas as histórias.
- **US1**: depende do catálogo e das medições fundacionais.
- **US3**: depende da moldura da US1; cria a estrutura real que será medida.
- **US2**: depende da US3 para não medir um cabeçalho incompleto.
- **US4**: depende do painel criado na US3.
- **US5**: depende da navegação criada na US3 e pode avançar em paralelo com US4.
- **US6**: depende de US1, US2, US3 e US5 para medir o resultado visual final.
- **Fase 9**: depende de todas as histórias desejadas.

### Grafo das histórias

```text
Fundação
  └── US1 (moldura e rotas)
        └── US3 (CTA, painel e navegação responsiva)
              ├── US2 (geometria final do cabeçalho)
              ├── US4 (teclado, foco e rolagem)
              └── US5 (estado anunciado e landmarks)
                    └── US6 (conversão e fidelidade)
```

### Ordem interna obrigatória

- Teste/verificador é escrito e executado vermelho antes da correção correspondente.
- Se o estado atual já passar, uma violação mínima e temporária prova o detector e é restaurada.
- Catálogo precede consumidores.
- Aparência compartilhada precede botão/link.
- Estrutura do painel precede foco, scroll lock e resize.
- Medição de fidelidade usa o resultado final, nunca estimativa do plano.
- Documentação recebe números reais antes do último `npm run verificar`.

## Oportunidades de paralelismo

- T005 e T006 após T004.
- T007 e T008.
- T009, T010, T012 e T013 depois dos testes vermelhos, respeitando T011 como composição final.
- T015, T016 e T017.
- T020 em paralelo com T018/T019; T021 e T022 após os componentes que consomem.
- T031 em paralelo com a lógica de T029/T030.
- US4 e US5 depois de US3, desde que alterações concorrentes em
  `src/componentes/layout/NavegacaoPublica.tsx` sejam coordenadas.
- T038 e T039.
- T048 e as buscas somente leitura de T047, depois de todo código pronto.
- T051 depende do T006 — só faz sentido depois que o `lighthouserc.cjs` existe —, e é somente
  leitura e escrita em `README.md`, então roda em paralelo com T047 a T050.

## Exemplo de execução paralela: US3

```text
Pessoa A: T015 → T018 → T019
Pessoa B: T016 → T020
Pessoa C: T017
Barreira: T019 + T020 concluídas
Pessoa A/B: T021 e T022 em arquivos distintos
Integração: T023
```

## Estratégia de entrega

### MVP estrutural

O menor incremento demonstrável é **Fundação + US1**: dez rotas e uma moldura única. Ele não deve
ser publicado isoladamente, porque US2–US5 também são P1 e fecham mobile, conversão e
acessibilidade da mesma moldura.

### Entrega incremental segura

1. Fundação torna catálogo e verificadores consumidores de uma fonte única.
2. US1 entrega a estrutura comum e as rotas provisórias.
3. US3 coloca os controles reais e a navegação responsiva.
4. US2 mede e fecha a geometria completa, não uma versão parcial.
5. US4 e US5 fecham interação e anúncio; podem avançar em paralelo com coordenação do arquivo
   cliente.
6. US6 remove a origem legada e registra a fidelidade.
7. Fase 9 prova a integração e termina na cadeia oficial.

## Critérios independentes por história

| História | Critério de teste independente |
| --- | --- |
| US1 | 10/10 rotas com a mesma moldura, marca para `/`, um header/nav/main/footer e rodapé aprovado |
| US2 | sete alturas reportadas, quatro ≤64 px, header fixo e zero overflow em 70/70 |
| US3 | CTA e acionador abaixo de 1024; nove destinos no painel; dez diretos e nenhum painel acessível em desktop; 6/6 pares |
| US4 | 7/7 percursos reais, três fechamentos, foco devolvido, fundo travado/restaurado e resize seguro |
| US5 | página atual exata, pista não cromática, estado/região anunciados e landmarks únicos |
| US6 | `.nav` 5→0, contagem 27→22, `accent-700` e 100% dos pares de contraste/fidelidade registrados |

## Validação do formato

Todas as tarefas usam checkbox, ID sequencial, marcador `[P]` apenas quando o arquivo/dependência
permite, rótulo `[USn]` somente nas fases de história e pelo menos um caminho exato. Nenhuma tarefa
de implementação fica sem verificação objetiva correspondente.
