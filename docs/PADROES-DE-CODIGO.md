# Padrões de código — Portal LIACUP

**Versão 1 · 19 de agosto de 2026**
Este documento existe porque "bem componentizado" e "boas práticas" são frases que não se verificam. Aqui elas viram regra checável. Todo `plan.md` do SDD segue este arquivo, e o checklist de validação cobra o cumprimento.

O princípio por trás de tudo: **um estudante de saúde, daqui a dois anos, sem nos conhecer, precisa conseguir abrir este código e entender.** Quando uma regra abaixo parecer excessiva, é essa a pergunta que a justifica.

---

## 1. Estrutura de pastas

```
src/
  app/                      Rotas do Next.js. Só composição e carregamento de dados.
    (site)/                 Site público
    (painel)/               Painel administrativo
    (interno)/              Ferramentas internas, nao publicas (ex.: vitrine do design system)
    api/                    Rotas de servidor
  componentes/
    ui/                     Blocos base, sem nenhuma regra de negócio
                            Botao, Campo, Cartao, Tag, Dialogo, Aviso, Abas
    layout/                 Cabecalho, Rodape, MenuMobile, ShellPainel
    padroes/                Composições reutilizáveis
                            ListaDeCartoes, TabelaResponsiva, EstadoVazio, Paginacao
  features/                 Uma pasta por domínio do produto
    noticias/
      componentes/          Componentes que só fazem sentido em notícias
      dados.ts              Toda leitura e escrita no banco
      tipos.ts              Tipos do domínio
      regras.ts             Regra de negócio pura, testável sem banco
    eventos/  equipe/  materiais/  galeria/  mensagens/  ...
  lib/
    supabase/               Clientes de servidor e de navegador
    validacao/              Esquemas de validação (Zod), compartilhados entre tela e servidor
    email/                  Envio de e-mail, isolado atrás de uma única interface
    utils/                  Funções puras genéricas
  estilos/
    tokens.css              Única fonte de cor, espaçamento, raio, sombra e tipografia
    global.css
```

Cinco pastas de raiz completam a árvore, acrescentadas conforme foram sendo necessárias e registradas
aqui em vez de aparecerem sem aviso:

```
tests/e2e/                  Testes de ponta a ponta. Nao pertencem a nenhuma camada de src/
scripts/                    Verificacoes proprias do projeto
public/                     Arquivo estatico. Convencao obrigatoria do Next
supabase/                   Esquema, politicas e dados de exemplo, versionados (F02)
  migrations/               Arquivos numerados, rodam em ordem
tests/politicas/            Testes de politica de acesso: permissao E recusa (F02)
```

**Regra de dependência entre camadas** — vale mais que a estrutura em si:

| Camada | Pode importar de | Nunca importa de |
|---|---|---|
| `componentes/ui` | `estilos`, `lib/utils` | `features`, `lib/supabase`, `app` |
| `componentes/padroes` | `ui`, `lib/utils` | `features`, `lib/supabase` |
| `componentes/layout` | `ui`, `padroes`, `lib/utils` | `features`, `lib/supabase`, `app` |
| `features/X` | `ui`, `padroes`, `lib` | **outra `features/Y`** |
| `lib` | `lib/utils` | `features`, `componentes`, `app` |
| `app` | tudo | — |

O grupo `(interno)` foi acrescentado em 21/08/2026, na F01. Ele existe porque a vitrine do design system não é página pública nem tela de painel: colocá-la em `(site)` misturaria ferramenta de desenvolvimento com o site que a liga mostra ao público, e a primeira pessoa a listar as páginas do site encontraria uma que não é do site. O que mora em `(interno)` é publicado, mas **não recebe link de nenhuma página pública e não é indexado por buscador**.

Duas features que precisam conversar conversam pela rota que as compõe, não uma dentro da outra. Isso é o que impede o projeto de virar um novelo em seis meses.

A linha do `componentes/layout` foi acrescentada em 21/08/2026. Ela estava faltando: as zonas verificadas cobriam `ui`, `padroes` e `lib`, e `layout` ficava sem restrição nenhuma — um cabeçalho podia importar de `features` e nada barrava. Um cabeçalho não conhece notícia: quem compõe é a rota, que passa por props.

A linha do `lib` foi acrescentada em 20/08/2026: camada de apoio que conhece quem apoia deixa de ser apoio. Estava implícita na tabela e passou a ser explícita depois de aparecer como leitura inferida no contrato de camadas da F00 — regra tem que morar no documento de origem, não só no contrato que a aplica.

Essa regra é **verificada pelo ESLint** (`import/no-restricted-paths`), não pela boa vontade de quem escreve. Violação quebra o CI.

---

## 2. Componentes

### 2.1 Server Component é o padrão

Todo componente nasce como Server Component. `'use client'` só entra quando há estado, evento de usuário ou API do navegador — e sempre **no menor componente possível**.

Errado: marcar a página inteira como cliente porque um botão precisa de `onClick`.
Certo: a página continua no servidor e só o botão é cliente.

### 2.2 Um componente, uma responsabilidade

- Se o nome precisa de "e" para descrever o que ele faz, são dois componentes.
- **Limite de 150 linhas.** Passou disso, quebrar. Não é número mágico, é gatilho de conversa.
- Componente que busca dado **e** desenha tela são dois componentes: um busca, outro recebe por props.

### 2.3 Props

- Sempre tipadas de forma explícita. `any` é proibido, inclusive implícito.
- **Variante em vez de booleanas.** `variante="primario" | "secundario" | "fantasma"`, nunca `ehPrimario` + `ehSecundario` — que permitem estados impossíveis.
- Mais de 7 props é sinal de que falta composição. Prefira `children` e slots.
- Nada de passar prop por mais de dois níveis só para chegar embaixo. Se acontecer, ou compõe diferente, ou usa contexto.
- Toda prop opcional tem valor padrão declarado.

### 2.4 Composição antes de configuração

Um `<Cartao>` que aceita `children` vence um `<Cartao>` com 12 props para cobrir todos os formatos. O segundo cresce para sempre; o primeiro não.

### 2.5 Os componentes de `ui/` são burros de propósito

Eles não sabem o que é uma notícia. Não chamam banco. Não conhecem rota. Recebem props e desenham. É isso que os torna reaproveitáveis e testáveis — e é a diferença entre um design system e uma pasta com arquivos dentro.

### 2.6 Todo componente que mostra dado trata três estados

**Carregando**, **erro** e **vazio**. Os três, sempre, com texto em português que ajude quem está do outro lado. "Nenhuma notícia publicada ainda" é resposta; tela em branco não é.

---

## 3. Estilo

- **Nenhuma cor, espaçamento, raio, sombra ou tamanho de fonte escrito à mão fora de `tokens.css`.** Nada de `#8A5A9E` ou `padding: 13px` dentro de componente — sempre `var(--color-accent)`, `var(--space-3)`.
- Os tokens vêm do `liacup.css` já aprovado. Token novo se cria; token existente não se altera sem passar pelo design.
- Ponto de corte de responsividade só nos valores definidos: 480, 768, 1024 px. Valor solto no meio do caminho é dívida.
- Nada de `!important`, exceto para vencer estilo de terceiro — e com comentário explicando qual.
- Verificação: script no CI procura cor em hexadecimal e medida em pixels fora dos arquivos de token. Achou, falhou.

**Limitação conhecida do verificador, para ninguém perder uma hora achando que quebrou alguma coisa:**
ele varre arquivos `.tsx` inteiros e não distingue valor de estilo de **texto de tela**. Escrever
`16px` dentro de uma frase — numa legenda, num aviso, num rótulo de exemplo — faz o verificador
acusar, mesmo não sendo estilo nenhum.

A saída é escrever a medida em prosa **com espaço**: `16 px`. Isso não colide com o verificador,
porque CSS nunca aceita espaço antes da unidade, e de quebra é a forma tipograficamente correta em
português. Não é gambiarra: é a distinção real entre os dois usos.

Ensinar o verificador a ignorar literais de string em `.tsx` é possível e fica registrado como
melhoria futura — não foi feito na F01 porque a regra do espaço resolve o caso sem tornar o script
mais difícil de ler, e o script ser legível inteiro é o que o mantém confiável.

---

## 4. Dados e regra de negócio

- **Acesso ao banco vive só em `features/X/dados.ts`.** Componente nenhum chama Supabase direto.
- Regra de negócio vive em `regras.ts`, como função pura, sem banco e sem React — porque assim ela é testável de verdade.
- Toda entrada é validada com o **mesmo esquema Zod** na tela e no servidor. Um arquivo, dois usos: é o que impede a validação do cliente e a do servidor de divergirem com o tempo.
- Escrita passa por Server Action ou rota de API, nunca direto do navegador para o banco.
- Toda consulta traz só as colunas que usa. `select('*')` é preguiça que vira lentidão.

---

## 5. Acessibilidade dentro do componente

Não é etapa de revisão, é parte de escrever o componente:

- Elemento semântico correto. Se clica e navega, é `<a>`; se clica e age, é `<button>`.
- Todo campo tem `<label>` associado por `htmlFor`.
- Ícone sozinho tem `aria-label`; ícone decorativo tem `aria-hidden`.
- Componente interativo funciona por teclado, com foco visível.
- Diálogo prende o foco, fecha no Esc e devolve o foco para quem o abriu.
- Mensagem de erro ou sucesso aparece em região com `aria-live`.

---

## 6. Nomenclatura

- Arquivos de componente em `PascalCase.tsx`; os demais em `kebab-case.ts`.
- Componentes, variáveis, funções e comentários **em português**. Termos técnicos consagrados ficam em inglês (`props`, `hook`, `build`, `deploy`).
- Nome descreve o quê, não o como: `ListaDeNoticias`, não `MapeadorDeArrayDeNoticias`.
- Booleano começa com verbo: `estaCarregando`, `temErro`, `podeEditar`.
- Nada de abreviação inventada. `mensagem`, não `msg`.

---

## 7. Testes

| O quê | Como |
|---|---|
| Componentes de `ui/` | Teste de unidade: renderiza, responde a evento, respeita variantes |
| `regras.ts` de cada feature | Teste de unidade, incluindo os casos de borda |
| Caminho principal de cada feature | Teste de integração |
| Login, publicar, excluir, enviar mensagem | Teste de ponta a ponta (Playwright) |
| Acessibilidade | axe-core rodando dentro do teste de ponta a ponta |
| Responsividade | Playwright em 360, 768 e 1280 px, checando ausência de rolagem horizontal |

Teste não é sobre porcentagem de cobertura. É sobre: **se alguém quebrar isso daqui a um ano, o CI avisa?**

---

## 8. Git

O modelo de branches é **GitHub Flow**, decidido e justificado no
[`ADR-0005`](ADR-0005-modelo-de-branches.md) — que também registra por que o GitFlow foi recusado,
para a pergunta não voltar do zero daqui a seis meses.

- Uma feature, um branch, **sempre saindo da `main`**: `feat/F06-noticias`.
- Prefixos: `feat/` para feature, `fix/` para defeito, `docs/` para documentação, `chore/` para
  manutenção. Branch do plano de desenvolvimento carrega o código: `feat/F02-...`.
- Commits no padrão `tipo: descrição em português`, no imperativo. O corpo explica **por quê**; o
  diff já diz o quê.
- Pull request descreve o que muda, o que foi testado e como verificar.
- Nada entra na `main` com CI vermelho, e a proteção está **configurada**, não combinada.
- `main` está sempre publicável: é o que a Vercel põe em produção. **Incorporou, está no ar.**
- A branch é **apagada depois de incorporada**.

**Correção urgente**: branch `fix/` a partir da `main`, a menor correção possível, alteração
proposta com `URGENTE` no título, CI verde continua obrigatório, incorporar assim que passar. Nunca
push direto, nunca desligar a proteção, nunca `--no-verify` — se o CI impede a correção de uma
emergência, isso é informação sobre o CI e vira tarefa, não exceção. Procedimento completo no
ADR-0005, seção 2.4.

---

## 8.1 Requisitos permanentes

Regras que valem para **toda** feature, numeradas para que cada spec as **cite** em vez de
redescobri-las. Elas existiam antes desta seção — espalhadas entre a constitution, estes padrões, os
ADRs e o quickstart de quem lembrou. Foi assim que a contagem de dependências, que era FR na F00,
virou evidência de quickstart na F01 e simplesmente não apareceu na F02.

**Como usar**: a spec de cada feature lista os RP que se aplicam. Para os que **não** se aplicam, ela
diz por quê — "nenhuma tela nesta feature" é resposta suficiente para os de interface.

**O que NÃO entra aqui**: regra que valeu para uma feature só. Esta seção perde o sentido se virar
depósito.

| # | Requisito permanente | Origem | Como se verifica |
|---|---|---|---|
| **RP-01** | A contagem de **dependências diretas** é declarada, e cada nova é justificada por escrito no `plan.md` **antes** de entrar | F00 FR-025 | Contagem de `dependencies` + `devDependencies`, comparada com a tabela do plano |
| **RP-02** | **Zero** valores de cor, espaçamento, raio, sombra ou tipografia escritos à mão fora de `tokens.css` | Seção 3 · F00 FR-010 | `npm run verificar:tokens` |
| **RP-03** | **Nenhum token existente é alterado** sem ADR. Token novo tem **origem nomeada** | ADR-0003 · F01 FR-010 | Diferença do `tokens.css` mostra só linhas acrescentadas |
| **RP-04** | Alvo de toque de **44 px** em todas as larguras | Princípio II · ADR-0004 2.1 | Medição no teste de ponta a ponta, **com o número de elementos medidos** |
| **RP-05** | **Zero** rolagem horizontal em 360, 390, 430, 480, 768, 1024 e 1280 px | Princípio III · checklist C1 | `scrollWidth <= clientWidth` nas sete larguras |
| **RP-06** | Lighthouse **desempenho ≥ 90** e **acessibilidade ≥ 95** | Seção 9 · F00 FR-029 | `npm run test:desempenho`, contra a versão compilada |
| **RP-07** | **Zero** violações do axe-core em toda página entregue | Princípio II · F00 FR-014 | axe dentro do teste de ponta a ponta |
| **RP-08** | Toda diferença em relação ao design aprovado tem **veredito e motivo escrito** | ADR-0004 2.4 | `FIDELIDADE.md` da feature: zero linhas não idênticas sem motivo |
| **RP-09** | Todo valor de contraste **nomeia as duas cores e a superfície** medida | ADR-0003 §4.0 | Leitura: número solto não vale como registro |
| **RP-10** | **Nenhum segredo** no repositório nem no histórico | Princípio IV · F00 FR-023 | Varredura do estado atual e do histórico |
| **RP-11** | Toda tabela nasce com **controle de acesso por linha ativo**, e a política é testada provando que **bloqueia** — não só que permite | Princípio IV · F02 | Suíte de políticas, com o número de células de recusa verificadas |
| **RP-12** | **Verificação que ninguém viu falhar não conta.** Toda verificação nova é demonstrada **falhando** diante de violação real e voltando ao verde. E toda verificação **diz quanto mediu** — arquivos varridos, elementos medidos, células checadas | F00 (V1–V5) · F01 · F02 | Duas execuções registradas com resultados opostos, **e o contador na saída** |

**O RP-12 é o que sustenta os outros onze**, e tem duas metades que se completam:

- **vista falhando** — sem isso, uma verificação quebrada e uma satisfeita produzem a mesma saída
  verde. Foi o que a F00 aprendeu com o CI que não checava nada;
- **com contador** — sem isso, **"nada falhou" e "nada foi medido" produzem a mesma saída verde**.
  Foi o que pegou os 20 alvos de toque da F01: o número estava honesto, mas media uma página que não
  mostrava tudo. Um verificador que varre zero arquivos e um que aprova tudo são indistinguíveis sem
  o contador.

---

## 9. Ferramentas que fazem cumprir

Regra que depende de disciplina humana degrada. Estas são automáticas:

| Ferramenta | O que garante |
|---|---|
| TypeScript em modo estrito | Sem `any`, sem tipo implícito |
| ESLint + `import/no-restricted-paths` | Regra de dependência entre camadas |
| ESLint acessibilidade (`jsx-a11y`) | Erros básicos de semântica e rótulo |
| Prettier | Formatação, sem discussão |
| Script de tokens no CI | Cor e medida escritas à mão |
| Vitest | Unidade e integração |
| Playwright + axe | Ponta a ponta, acessibilidade, responsividade |
| Lighthouse CI | Desempenho e acessibilidade por página |

Todas rodam no CI a cada pull request. Falhou, não entra.

---

## 10. Checklist de revisão de componente

Uso na validação de cada feature:

- [ ] É Server Component, ou o `'use client'` está no menor escopo possível
- [ ] Tem uma responsabilidade só, e cabe em 150 linhas
- [ ] Não conhece banco de dados nem rota, se for de `ui/`
- [ ] Props tipadas, sem `any`, com variantes em vez de booleanas soltas
- [ ] Nenhum valor de estilo escrito à mão
- [ ] Trata carregando, erro e vazio
- [ ] Semântica, rótulos, teclado e foco corretos
- [ ] Nomes em português e descritivos
- [ ] Tem teste
- [ ] Não importa de outra feature
