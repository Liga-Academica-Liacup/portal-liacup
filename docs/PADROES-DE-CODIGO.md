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

- Uma feature, um branch: `feat/F06-noticias`.
- Commits no padrão convencional, com descrição em português: `feat: adiciona filtro por categoria nas notícias`.
- Pull request descreve o que muda, o que foi testado e como verificar.
- Nada entra na `main` com CI vermelho.
- `main` está sempre publicável.

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
