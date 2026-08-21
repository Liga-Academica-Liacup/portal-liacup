# ADR-0001 — Stack tecnológico do Portal LIACUP

- **Status:** Proposta — aguardando validação final do Gabriel
- **Data:** 19 de agosto de 2026
- **Decisores:** Gabriel Andrade Almeida (decisão final), coordenação de projeto (recomendação)
- **Contexto do projeto:** Portal institucional da Liga Acadêmica Multiprofissional de Cuidados Paliativos da UnB, com site público e painel administrativo, a ser desenvolvido pelo Claude Code sob Spec-Driven Development.

---

## 1. Contexto e forças em jogo

O protótipo está aprovado. Precisamos escolher a tecnologia antes de escrever a primeira spec, porque o `plan.md` de toda feature depende dessa escolha.

As forças que realmente pesam neste projeto, em ordem de importância:

**1. Quem mantém o site depois.** Este é o fator decisivo e é fácil de subestimar. A diretoria da liga troca todo ano. O Gabriel não vai estar disponível para sempre. Um portal que só uma pessoa sabe operar morre na primeira troca de gestão. A tecnologia tem que ser comum o bastante para que um estudante futuro consiga entender, e o painel tem que ser bom o bastante para que ninguém precise mexer em código para publicar uma notícia.

**2. O desenvolvedor é uma IA.** O Claude Code escreve melhor, com menos idas e vindas, em stacks com muita documentação pública e padrões estabelecidos. Escolher algo exótico transfere risco para dentro do desenvolvimento.

**3. Orçamento de até ~R$100/ano.** Na prática: só o domínio é pago. Hospedagem e banco precisam caber em camada gratuita, e os limites dessa camada precisam estar documentados antes, não descobertos depois.

**4. O protótipo já existe em React.** O design system (`liacup.css`), os tokens, os componentes e a lógica de estado já estão escritos em uma sintaxe muito próxima de React. Escolher outra linguagem no front joga esse trabalho fora.

**5. Conteúdo, SEO e acessibilidade.** É um site institucional de saúde. Precisa ser encontrável no Google, ser lido por leitores de tela e carregar rápido em celular com internet ruim.

---

## 2. Opções consideradas

### Opção A — Next.js + TypeScript + Supabase + Vercel *(recomendada)*

Next.js (App Router) para o site e o painel, TypeScript em tudo, Supabase para banco Postgres, autenticação e armazenamento de imagens, deploy na Vercel.

**A favor**
- Uma linguagem só, do front ao back. Menos contexto para o desenvolvedor e para quem herdar.
- É a combinação mais documentada do ecossistema JavaScript hoje — exatamente onde o Claude Code erra menos.
- Supabase resolve de saída as três partes mais chatas e mais perigosas de escrever à mão: autenticação, permissões por linha (RLS) e upload de arquivos.
- O painel administrativo já desenhado e aprovado pode ser construído como está, em português, com a identidade da liga.
- Renderização no servidor: bom para SEO e para celular fraco.
- Custo: R$0 dentro dos limites.

**Contra**
- O CRUD do painel é escrito à mão (mitigado: o desenvolvedor é uma IA, e a spec descreve um formulário genérico reaproveitado por seção).
- Dependência de dois fornecedores (Vercel e Supabase), cada um com seus limites e suas regras.

### Opção B — Next.js + Payload CMS (auto-hospedado no mesmo app)

Mesma base, mas usando o Payload como CMS embutido, que já entrega painel administrativo, autenticação e modelagem de conteúdo prontos.

**A favor**
- Muito menos código de painel para escrever e manter.
- Painel testado em produção por muita gente, com upload, versionamento e rascunhos de graça.

**Contra**
- Joga fora o painel que a liga revisou e aprovou. O painel do Payload é genérico e tem vocabulário de desenvolvedor; a diretoria da liga é multiprofissional da saúde, não de tecnologia.
- Precisa de banco próprio e de um servidor que rode processo contínuo — sai da camada gratuita mais facilmente.

### Opção C — WordPress

**A favor**
- Qualquer pessoa consegue mexer; há gente que já sabe usar.
- Ecossistema de plugins enorme.

**Contra**
- Hospedagem decente é paga e recorrente — não cabe no orçamento como recorrência.
- Manutenção de segurança é obrigação contínua (WordPress desatualizado é invadido); ninguém na liga vai assumir isso.
- Reproduzir o design aprovado exigiria tema sob medida, o que anula a vantagem de simplicidade.
- É o oposto do fluxo SDD com Claude Code.

### Opção D — Django

**A favor**
- Painel administrativo e autenticação já vêm prontos e são sólidos.
- Excelente para modelagem de dados.

**Contra**
- Duas linguagens no projeto (Python no back, JS no front) — mais superfície para quem herdar.
- Hospedagem gratuita para Python é bem pior que para JavaScript.
- O trabalho de front do protótipo teria que ser refeito ou adaptado.

### Opção E — Site estático com CMS no Git (Astro + Decap/Sveltia)

**A favor**
- Sem banco de dados e sem servidor: custo zero de verdade e praticamente zero manutenção.
- Conteúdo versionado no Git: nada se perde, tudo é reversível.

**Contra**
- O formulário "Fale com a Liga" precisa de um serviço externo para receber mensagens — e a caixa de entrada no painel, que a liga pediu, fica difícil.
- Publicar exige que o CMS commite no repositório, o que trava se a conta do GitHub mudar de mãos.
- Papéis e permissões (administrador, editor, colaborador) ficam presos às permissões do GitHub.

---

## 3. Decisão

**Adotamos a Opção A: Next.js (App Router) + TypeScript + Supabase + Vercel.**

O que pesou: é a opção que preserva o trabalho já aprovado (design e painel), coloca o desenvolvedor no terreno onde ele erra menos, cabe no orçamento, e deixa o caminho mais óbvio para quem vier depois. A Opção B é tecnicamente defensável e ficaria em segundo lugar; ela perde porque troca o painel em português e desenhado para a liga por um painel genérico, e a facilidade de uso pela diretoria vale mais que a economia de código — ainda mais quando o código é escrito por IA.

### Composição definida

| Camada | Escolha | Observação |
|---|---|---|
| Framework | Next.js (App Router) | React Server Components, renderização no servidor |
| Linguagem | TypeScript, modo estrito | Sem `any` implícito |
| Estilo | CSS com os tokens do `liacup.css` | Reaproveita o design system aprovado; sem framework de UI que imponha visual próprio |
| Banco | Supabase (PostgreSQL) | Com Row Level Security ligada em toda tabela |
| Autenticação | Supabase Auth | E-mail e senha; papéis administrador / editor / colaborador |
| Arquivos | Supabase Storage | Imagens e PDFs, com limite de tamanho e redimensionamento no envio |
| Hospedagem | Vercel | Plano gratuito |
| Domínio | `.com.br` ou `.org.br` | ~R$40–60/ano, único custo do projeto |
| Versionamento | GitHub | `github.com/Liga-Academica-Liacup/portal-liacup` — **público**, ver seção 4.1 |
| Testes | Vitest (unidade) + Playwright (ponta a ponta) | Playwright também cobre acessibilidade e responsividade |
| Qualidade | ESLint + Prettier + `tsc --noEmit` no CI | Bloqueia merge se falhar |

### Modelo de dados — primeiro esboço

Tabelas de conteúdo, todas com `id`, `criado_em`, `atualizado_em`, `publicado` e `autor_id`:

`noticias` (com `link_externo`), `eventos` (com `data_evento`, `passado`), `conteudos_educativos`, `leituras`, `projetos` (eixo: ensino/extensão/pesquisa/secretaria), `materiais` (arquivo), `membros` (diretoria e ligantes, com foto), `docentes`, `galeria_albuns` e `galeria_fotos`, `faq`, `processo_seletivo_itens`, `indicadores` (os números da home).

Tabelas de sistema: `perfis` (usuário + papel), `mensagens` (contato: nome, e-mail, assunto, texto, status lida/arquivada, data, IP não armazenado).

Esse esboço vira modelo definitivo no `plan.md` da primeira feature de dados. Não tratar como fechado.

---

## 4.1 Visibilidade do repositório — decidido em 21/08/2026

O repositório nasceu privado e passou a **público**. O motivo é concreto: **proteção de ramo em repositório privado exige plano pago no GitHub**. No plano gratuito, ou o repositório é público ou a proteção não existe — e sem proteção a F00 inteira perde o sentido, porque as verificações viram sugestão.

Três consequências que mudam o comportamento do projeto:

1. **Segredo commitado é permanente e público.** Apagar o arquivo não resolve: fica no histórico. A única correção real é **rotacionar a chave** no fornecedor. Isso deixa de ser higiene e passa a ser o item mais sério do checklist a partir da F02, quando as chaves do Supabase entrarem.
2. **Minutos do GitHub Actions passam a ser ilimitados.** Isso invalida metade da justificativa registrada para o CI rodar só em Linux. A decisão continua a mesma, mas pelo motivo que sempre foi o melhor: **o CI existe para espelhar produção, e a Vercel roda Linux.** Testar Windows no CI seria verificar um ambiente que ninguém usa para servir o site.
3. **Pull request vindo de fork deixa de ser hipótese.** O caso de borda previsto na spec da F00 agora é real e verificável. O GitHub não passa segredos para fluxos vindos de fork, que é o comportamento desejado; falta conferir como a Vercel trata a pré-visualização nesse caso.

**Decisão em aberto:** o repositório não tem arquivo de licença. Repositório público sem licença significa, juridicamente, todos os direitos reservados — nenhuma outra liga acadêmica pode reaproveitar o código. Para um projeto de extensão de universidade pública provavelmente não é o desejado. A liga precisa decidir, junto com a questão do uso da marca UnB.

---

## 5. Consequências

**Positivas**
- Custo recorrente de R$0 fora o domínio.
- O protótipo aprovado vira código sem retrabalho de design.
- Autenticação e permissões usam uma implementação testada, não caseira — que é onde projetos pequenos costumam abrir buraco de segurança.
- O deploy é automático a cada merge; não há ritual manual para quem vier depois.

**Negativas e limites que assumimos conscientemente**
- Dependemos de duas empresas e das regras delas, que podem mudar.
- O CRUD do painel é código nosso: é nosso para manter e nosso para consertar.

---

## 6. Riscos desta decisão e como reagimos

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | **Supabase pausa o projeto após 7 dias sem atividade** (regra do plano gratuito). Um site institucional de baixo tráfego pode ficar uma semana sem consulta ao banco se as páginas estiverem em cache. | Média | Site fora do ar até alguém despausar | Rotina agendada que consulta o banco a cada poucos dias; monitor externo de disponibilidade avisando por e-mail; instruções de como despausar no manual de operação |
| R2 | **O plano gratuito da Vercel é para uso pessoal e não comercial.** Uma liga acadêmica sem fins lucrativos deve caber, mas é uma área cinzenta nos termos. | Baixa | Necessidade de migrar de hospedagem | Plano B documentado: migrar para Cloudflare Pages/Workers, cujos termos gratuitos são explicitamente mais permissivos. A arquitetura não deve criar dependência de recurso exclusivo da Vercel |
| R3 | **Limites do plano gratuito do Supabase:** 500 MB de banco, 1 GB de arquivos, 5 GB de tráfego/mês, no máximo 2 projetos. | Média (galeria de fotos) | Site trava ao subir fotos | Redimensionar e comprimir toda imagem no envio (máximo 1600px, ~300 KB); alertar no painel quando passar de 70% do armazenamento; documentar o número aproximado de fotos que cabe |
| R4 | **Ninguém assume o projeto quando o Gabriel sair.** | Alta se ignorada | O portal apodrece | Manual de operação em linguagem simples; todas as contas em e-mail institucional da liga, nunca pessoal; sessão de passagem de bastão gravada; código comentado em português |
| R5 | **Contas pessoais bloqueiam a sucessão** (GitHub, Vercel, Supabase e domínio no nome do Gabriel). | Alta se ignorada | Perda de controle do portal | Criar tudo com um e-mail da liga desde o primeiro dia. Este é um pré-requisito, não uma tarefa futura |
| R6 | **Vazamento de dados pessoais** das mensagens de contato e do processo seletivo. | Baixa | Sério: exposição de terceiros e infração à LGPD | RLS obrigatória, nenhuma chave secreta no cliente, validação no servidor, retenção definida e purga automática |

---

## 7. Decisões deixadas em aberto (não bloqueiam o início)

1. **Domínio.** `liacup.com.br`, `liacup.org.br` ou pedir subdomínio na UnB. O subdomínio institucional dá credibilidade, mas depende de aprovação da universidade e de prazo que não controlamos. Recomendação: registrar o domínio próprio agora e tratar o subdomínio da UnB como melhoria futura.
2. **Envio de e-mail** (aviso de nova mensagem de contato, recuperação de senha). Resolvido na feature de contato; opções gratuitas existem, a escolha depende do volume.
3. **Analytics.** Se entrar, tem que ser sem cookies e sem rastreio pessoal, por causa da LGPD.

---

## 8. Como revisitar

Este ADR não é eterno. Ele deve ser reaberto se: (a) a Vercel ou o Supabase mudarem regras de forma que nos tirem da camada gratuita; (b) o volume de conteúdo passar dos limites documentados em R3; (c) surgir uma pessoa mantenedora com perfil técnico muito diferente. Alteração de decisão vira um novo ADR que substitui este, não uma edição deste.
