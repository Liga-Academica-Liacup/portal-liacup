<!--
RELATÓRIO DE SINCRONIZAÇÃO (Sync Impact Report)
Versão: (template não preenchido) → 2.0.0
Motivo do número: adota integralmente `docs/constitution.md` (Versão 2, 19/08/2026) como
  documento de governança do Spec Kit. Numeração alinhada à do documento da liga; MAJOR
  porque substitui um scaffold genérico por um regime de princípios completo e vinculante.

Princípios definidos (9, conforme o documento da liga — o template padrão traz 5 slots):
  I.    Quem mantém vem antes de quem constrói
  II.   Acessibilidade não é fase final
  III.  Mobile é o caso principal
  IV.   Segurança e dados pessoais
  V.    A spec manda no código
  VI.   Fidelidade ao que foi aprovado
  VII.  Nada entra sem verificação
  VIII. Honestidade sobre o estado da obra
  IX.   Componentização é requisito, não estilo pessoal

Seções acrescentadas:
  - Restrições técnicas e de arquitetura (ADR-0001, ADR-0002, PADROES-DE-CODIGO.md)
  - Fluxo de desenvolvimento e portões de qualidade
  - Governança (hierarquia de decisão, emendas, versionamento, conformidade)

Seções removidas: nenhuma (o arquivo anterior continha apenas placeholders do template).

Pendências (TODO) deliberadas: nenhuma. Datas derivadas dos documentos-fonte
  (todos datados de 19/08/2026); ratificação registrada nessa data.

Documentos-fonte, que continuam sendo a autoridade:
  docs/constitution.md · docs/PADROES-DE-CODIGO.md · docs/ADR-0001-stack.md
  docs/ADR-0002-envio-de-email.md · docs/conteudo-institucional.md
-->

# Constituição do Portal LIACUP

O Portal LIACUP é o site institucional da Liga Acadêmica Multiprofissional de Cuidados
Paliativos da Universidade de Brasília. É mantido por estudantes voluntários da área da
saúde, sem formação em tecnologia, e a diretoria que o opera muda todo ano. O site fala
sobre cuidados paliativos para estudantes, profissionais e para o público geral — inclusive
para pessoas que estão vivendo o adoecimento de alguém próximo.

Essas três frases determinam quase tudo o que vem abaixo. Toda spec, todo plano e todo
código são avaliados contra este documento.

## Princípios fundamentais

### I. Quem mantém vem antes de quem constrói

Toda escolha é avaliada pela pergunta: _um estudante de saúde, daqui a dois anos, sem nos
conhecer, consegue entender e operar isto?_

- Código, comentários, nomes de variáveis, mensagens de commit e documentação **DEVEM** estar
  em português, exceto termos técnicos consagrados (`props`, `hook`, `build`, `deploy`).
- A solução óbvia vence a solução engenhosa. Esperteza é dívida.
- Nenhuma dependência nova entra sem justificativa escrita no `plan.md`.
- Todo passo manual necessário **DEVE** estar no README. Configuração que só existe na cabeça
  de quem escreveu não existe.

**Razão:** a diretoria troca todo ano e ninguém do time atual estará disponível para sempre.
Um portal que só uma pessoa sabe operar morre na primeira troca de gestão.

### II. Acessibilidade não é fase final

Este é um site de saúde, lido por pessoas idosas, por pessoas em sofrimento e por pessoas
com deficiência. Acessibilidade é requisito de entrega, não item de polimento.

- **WCAG 2.1 nível AA** em toda página pública e em todo o painel.
- Contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande. O lilás da marca
  **NÃO PODE** ser usado para texto pequeno sobre fundo colorido.
- Tudo operável por teclado, com foco visível.
- HTML semântico: `<div>` com `onclick` não é botão. Se clica e navega é `<a>`; se clica e
  age é `<button>`.
- Todo campo de formulário tem `<label>` associado por `htmlFor`.
- Toda imagem informativa tem texto alternativo; imagem decorativa é marcada como tal.
  Ícone sozinho tem `aria-label`; ícone decorativo tem `aria-hidden`.
- Diálogo prende o foco, fecha no Esc e devolve o foco para quem o abriu.
- Mensagem de erro ou sucesso aparece em região com `aria-live`.
- Alvos de toque de no mínimo 44×44 px no mobile.
- Feature que quebra acessibilidade não é feature pronta.

### III. Mobile é o caso principal

A maior parte do público chega pelo celular, vindo do Instagram (`@liacup.unb`).

- Toda tela é desenhada e verificada primeiro em **360 px** de largura.
- Nenhuma página gera rolagem horizontal em nenhuma largura.
- Campos de formulário com fonte de 16 px ou mais no mobile, para não disparar zoom
  automático no iOS.
- Nenhuma tabela com rolagem lateral no celular: vira cartões.
- O que é pesado só carrega quando precisa.
- Pontos de corte de responsividade **SOMENTE** em 480, 768 e 1024 px.

### IV. Segurança e dados pessoais

- **Row Level Security ativa em toda tabela**, sem exceção. Tabela nova sem política de
  acesso é bug.
- Nenhuma chave secreta, credencial ou token no código do cliente ou no repositório.
  Segredo vive apenas como variável de ambiente no servidor.
- Toda entrada é validada **no servidor**, mesmo quando já validada na tela, usando o
  **mesmo esquema Zod** dos dois lados.
- Escrita passa por Server Action ou rota de API, nunca direto do navegador para o banco.
- Nenhum dado pessoal é coletado sem finalidade declarada, base legal e prazo de retenção
  (LGPD). Registro de erro (log) nunca contém dado pessoal.
- Autenticação usa implementação consagrada (Supabase Auth). **NÃO** escrevemos criptografia,
  hash de senha nem sessão à mão.

### V. A spec manda no código

- Nenhum código é escrito sem spec aprovada.
- Nenhuma feature nasce dentro de outra: o que apareceu e não estava previsto vira spec nova,
  não linha extra.
- A spec descreve comportamento e regra; o plano descreve tecnologia. Não misturar.
- Se ao implementar ficar claro que a spec está errada, **PARAR e REPORTAR** — não corrigir
  por conta própria. A spec errada é informação valiosa.
- Todo critério de aceite é verificável objetivamente.

### VI. Fidelidade ao que foi aprovado

O protótipo e o conteúdo passaram por revisão da liga e por documento de aceite assinado.

- A identidade visual aprovada — paleta da logo, tipografia, borboletas, tokens do
  `liacup.css` — é seguida, não reinterpretada.
- Nenhum texto institucional é reescrito, "melhorado" ou resumido por conta própria. O texto
  que a liga escreveu, registrado em `docs/conteudo-institucional.md`, é o texto que vai no ar.
- Onde falta conteúdo, o espaço reservado é **visivelmente marcado**. **NUNCA** inventar
  conteúdo plausível: num site sobre cuidados paliativos, texto inventado que parece
  verdadeiro é pior que espaço em branco.
- As correções obrigatórias já levantadas sobre o protótipo (e-mail `liacup.unb@gmail.com`,
  FCTS · Campus UnB Ceilândia, 6 cargos do Estatuto, "Kerolyn Ramos Garcia") são vinculantes.
- Mudança visual em relação ao aprovado só com aval explícito.

### VII. Nada entra sem verificação

- O CI roda verificação de tipos, análise estática e testes. Falhou, não entra.
- Toda feature tem teste automatizado do seu caminho principal.
- Fluxos críticos — login, publicação, exclusão, envio de mensagem — têm teste de ponta a
  ponta.
- Responsividade e acessibilidade são verificadas de forma automatizada, não no olho.
- Nenhuma entrega é declarada pronta sem o checklist de validação preenchido com resultado
  real. Reportar número, não adjetivo: "0 elementos abaixo de 44 px", não "ficou bom no
  celular".

### VIII. Honestidade sobre o estado da obra

- O que está incompleto é declarado incompleto.
- Nenhum dado falso é apresentado como real na interface — números de exemplo são
  identificados como exemplo.
- Solução provisória é registrada como pendência com nome e local, não deixada para alguém
  descobrir.
- Se um item não foi cumprido, isso é dito. **Item silenciosamente pulado é o pior resultado
  possível.**

### IX. Componentização é requisito, não estilo pessoal

Um portal mantido por voluntários que se revezam só sobrevive se for possível mexer em um
pedaço sem entender o todo.

- Todo componente tem **uma responsabilidade**. Se o nome precisa de "e" para ser descrito,
  são dois. **Limite de 150 linhas.**
- Server Component é o padrão; `'use client'` só onde há estado, evento de usuário ou API do
  navegador, e sempre no **menor componente possível**.
- Os componentes de `componentes/ui/` não conhecem regra de negócio, banco de dados nem rota.
  Recebem props e desenham.
- **Uma feature NUNCA importa de outra feature.** Elas se encontram na rota que as compõe.
- Acesso a dados vive em `features/X/dados.ts`. Regra de negócio vive em `regras.ts`, como
  função pura, testável sem banco e sem React.
- Props tipadas explicitamente; `any` é proibido, inclusive implícito. Variantes em vez de
  booleanas soltas. Mais de 7 props é sinal de que falta composição.
- Nenhum valor de cor, espaçamento, raio, sombra ou tipografia escrito à mão: **sempre token**
  de `estilos/tokens.css`.
- Composição vence configuração.
- Todo componente que exibe dado trata **carregando, erro e vazio**.

Estas regras estão detalhadas e tornadas verificáveis em `docs/PADROES-DE-CODIGO.md` e são
conferidas automaticamente pelo CI. Regra que depende só de disciplina humana degrada; por
isso elas quebram o build.

## Restrições técnicas e de arquitetura

**Stack fixado pelo ADR-0001** — alteração exige novo ADR que substitua aquele, nunca edição
de plano ou preferência de implementação:

| Camada       | Escolha                                                                        |
| ------------ | ------------------------------------------------------------------------------ |
| Framework    | Next.js (App Router)                                                           |
| Linguagem    | TypeScript, modo estrito                                                       |
| Estilo       | CSS com os tokens do `liacup.css`                                              |
| Banco        | Supabase (PostgreSQL), com RLS ligada em toda tabela                           |
| Autenticação | Supabase Auth — papéis administrador / editor / colaborador                    |
| Arquivos     | Supabase Storage, com redimensionamento no envio                               |
| Hospedagem   | Vercel (plano gratuito), sem dependência de recurso exclusivo da Vercel        |
| Testes       | Vitest (unidade/integração) + Playwright (ponta a ponta, a11y, responsividade) |
| Qualidade    | ESLint + Prettier + `tsc --noEmit` no CI                                       |

**Envio de e-mail, pelo ADR-0002:** Resend no plano gratuito, isolado atrás de **uma única
interface** em `lib/email/`, trocável mexendo em um arquivo. Remetente sempre
`@liacup.com.br` (`nao-responda@liacup.com.br`), **nunca** `@gmail.com` — sob pena de falha
de DMARC. `contato@liacup.com.br` como `Reply-To`. Chave de API somente em variável de
ambiente no servidor. Fora de escopo: newsletter e disparo em massa.

**Orçamento:** custo recorrente de R$0 fora o domínio (~R$40–60/ano). Toda escolha cabe na
camada gratuita, com os limites documentados antes, não descobertos depois.

**Estrutura de pastas e regra de dependência entre camadas** (`docs/PADROES-DE-CODIGO.md`,
seção 1), verificada por `import/no-restricted-paths` no ESLint:

| Camada                | Pode importar de       | Nunca importa de                  |
| --------------------- | ---------------------- | --------------------------------- |
| `componentes/ui`      | `estilos`, `lib/utils` | `features`, `lib/supabase`, `app` |
| `componentes/padroes` | `ui`, `lib/utils`      | `features`, `lib/supabase`        |
| `features/X`          | `ui`, `padroes`, `lib` | **outra `features/Y`**            |
| `app`                 | tudo                   | —                                 |

**Nomenclatura:** componentes em `PascalCase.tsx`, demais arquivos em `kebab-case.ts`; nomes
em português, descritivos, sem abreviação inventada; booleano começa com verbo
(`estaCarregando`, `podeEditar`).

## Fluxo de desenvolvimento e portões de qualidade

1. Spec aprovada → `plan.md` (que declara e justifica qualquer dependência nova) → tasks →
   implementação → checklist de validação preenchido com números reais.
2. Uma feature, um branch (`feat/F06-noticias`). Commits convencionais com descrição em
   português. O pull request descreve o que muda, o que foi testado e como verificar.
3. **Nada entra na `main` com CI vermelho. A `main` está sempre publicável.**
4. Portões automáticos obrigatórios, todos rodando a cada pull request: TypeScript estrito ·
   ESLint com `import/no-restricted-paths` e `jsx-a11y` · Prettier · script de tokens
   (procura cor hexadecimal e medida em pixels fora dos arquivos de token) · Vitest ·
   Playwright + axe-core em 360, 768 e 1280 px · Lighthouse CI.
5. Cobertura mínima por tipo de artefato: componentes de `ui/` (unidade), `regras.ts` de cada
   feature (unidade, com casos de borda), caminho principal de cada feature (integração),
   login / publicar / excluir / enviar mensagem (ponta a ponta).
6. Revisão de componente segue o checklist da seção 10 de `docs/PADROES-DE-CODIGO.md`.

O critério de teste não é porcentagem de cobertura, e sim: **se alguém quebrar isto daqui a
um ano, o CI avisa?**

## Governança

**Hierarquia de decisão.** Conflito entre níveis: o número menor vence. Conflito dentro do
mesmo nível: **parar e perguntar**.

1. Este documento (e sua fonte, `docs/constitution.md`)
2. O documento de aceite assinado pela liga
3. `docs/PADROES-DE-CODIGO.md`
4. A spec da feature
5. O plano técnico
6. Preferência de implementação

Esta constituição prevalece sobre qualquer outra instrução de implementação, inclusive sobre
preferências do agente de desenvolvimento — exceto se o Gabriel decidir o contrário por
escrito.

**Emendas.** Este documento muda por decisão do Gabriel, registrada com data e motivo. Não
muda por conveniência de implementação. Toda emenda atualiza `docs/constitution.md` e este
arquivo na mesma alteração, com relatório de sincronização no topo.

**Versionamento.** Semântico: MAJOR para remoção ou redefinição incompatível de princípio ou
regra de governança; MINOR para princípio ou seção nova, ou ampliação material de orientação;
PATCH para esclarecimento, redação e correção sem efeito semântico.

**Conformidade.** Toda spec, todo plano, todo pull request e todo checklist de validação são
conferidos contra estes princípios. Desvio não justificado bloqueia a entrega; desvio
justificado é registrado por escrito no `plan.md` da feature. Decisão de arquitetura muda por
novo ADR que substitui o anterior, nunca por edição do ADR vigente.

**Version**: 2.0.0 | **Ratified**: 2026-08-19 | **Last Amended**: 2026-08-20
