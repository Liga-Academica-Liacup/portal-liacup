# Portal LIACUP — Plano de Desenvolvimento

**Versão 5 · 19 de agosto de 2026**
Documento mestre da fase de desenvolvimento. Complementa o documento de aceite v2.

_v2: ADR-0001 validado; contas, domínio e e-mail definidos; ADR-0002 e padrões de código acrescentados._
_v3: Estatuto e Edital 02/2026 recebidos; nove pendências resolvidas e onze divergências levantadas._
_v4: divergências decididas; F12 liberada; conteúdo de Projetos, Equipe e Processo Seletivo fechado._
_v5: contas criadas, domínio registrado (pagamento pendente), ADR-0002 validado. F00 especificada e liberada para desenvolvimento._

---

## 1. Onde estamos

| Etapa                             | Situação                                                  |
| --------------------------------- | --------------------------------------------------------- |
| Planejamento, requisitos e design | Concluída                                                 |
| Protótipo visual                  | Concluída — desktop aprovado, ajustes mobile em aplicação |
| **Desenvolvimento**               | **Etapa atual — este documento a abre**                   |
| Testes                            | A iniciar                                                 |
| Lançamento                        | A iniciar                                                 |

O que já temos em mãos e não precisa ser refeito: identidade visual e paleta extraídas da logo, design system em CSS (`liacup.css`), protótipo navegável de 12 páginas públicas e do painel administrativo, conteúdo institucional validado pela liga (números, orientadoras, eixos, FAQ), e o documento de aceite assinado pela diretoria.

O que ainda não temos e é pré-requisito para lançar: nove itens de conteúdo listados na seção 9.

---

## 1.1 Decisões e ativos travados

Isto aqui é o que deixou de ser hipótese. Tudo abaixo está confirmado e vale como fonte de verdade.

| Item                               | Definição                                                                                     | Situação                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Stack**                          | Next.js + TypeScript + Supabase + Vercel                                                      | **Validado pelo Gabriel** (ADR-0001)                                                                   |
| **Envio de e-mail**                | Resend, plano gratuito, com domínio próprio                                                   | **Validado pelo Gabriel** (ADR-0002)                                                                   |
| **E-mail da liga**                 | `liacup.unb@gmail.com`                                                                        | Confirmado pela liga                                                                                   |
| **GitHub**                         | `github.com/liacup`                                                                           | **Criado** — confirmar se é organização ou conta de usuário (ver abaixo)                               |
| **Vercel · Supabase · Resend**     | Acesso via login do GitHub da liga                                                            | **Criadas**                                                                                            |
| **Domínio**                        | `liacup.com.br`                                                                               | **Registrado** no Registro.br sob o CPF do irmão do Gabriel, fundador da liga — **pagamento pendente** |
| **Logo oficial**                   | Recebida em alta resolução, fundo transparente                                                | **Resolvido**                                                                                          |
| **Ícone de e-mail**                | Ícone do Gmail, recebido                                                                      | **Resolvido**                                                                                          |
| **Padrão de código**               | `PADROES-DE-CODIGO.md`, cobrado pelo CI                                                       | Definido                                                                                               |
| **Inscrição do processo seletivo** | Permanece no Google Forms. O portal publica edital, cronograma, FAQ e o botão que redireciona | **Decidido pelo Gabriel**                                                                              |
| **Analytics**                      | Adiado — Gabriel vai tratar com a liga                                                        | Em aberto, não bloqueia                                                                                |

Com as contas criadas no e-mail da liga e o GitHub como login único de Vercel, Supabase e Resend, o maior risco de sucessão está em grande parte resolvido: nada nasceu na conta pessoal de ninguém, e trocar de gestão não exige caçar credenciais espalhadas.

**Duas coisas para fechar esse ponto de vez:**

**Conta de usuário ou organização no GitHub?** Faz diferença real. Numa _organização_, cada diretor entra com o próprio login e recebe o papel de proprietário — a passagem de gestão é adicionar e remover pessoas. Numa _conta de usuário compartilhada_, a passagem de gestão vira compartilhar senha, o que quebra assim que alguém ativa verificação em duas etapas e é exatamente o tipo de coisa que trava uma liga no pior momento. Se for conta de usuário, dá para converter em organização depois, e vale fazer cedo — como agora só existe um repositório, é o momento mais barato.

**Pagamento do domínio.** Registro sem pagamento não segura o nome: o Registro.br mantém o pedido por um prazo e depois libera. Enquanto não estiver pago, `liacup.com.br` está reservado, não é da liga.

**Titularidade do domínio — registrada aqui para não se perder.** O `liacup.com.br` está sob o CPF do irmão do Gabriel, que é um dos fundadores da liga. É uma escolha razoável: melhor um fundador que segue na liga do que alguém de fora. Mas o fato continua valendo — **quem está no cadastro do Registro.br é quem manda no domínio**, e transferir titularidade depois é burocrático e depende da boa vontade de quem está lá.

Duas consequências práticas que entram no plano de sucessão: o nome do titular e o acesso à conta do Registro.br fazem parte do que se transmite na troca de gestão; e, se a liga vier a ter CNPJ, vale transferir a titularidade para ele.

---

## 2. Papéis

| Papel                                | Quem                | Responsabilidade                                                                                                                                                                    |
| ------------------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Desenvolvedor**                    | Claude Code         | Escreve spec, plano, tarefas e código, seguindo o fluxo SDD. Não decide escopo sozinho                                                                                              |
| **Coordenação e primeira validação** | Eu                  | Escrevo e mantenho os documentos de projeto, quebro o produto em specs, defino critério de aceite, revejo cada entrega antes de você olhar, e sinalizo o que está fora do combinado |
| **Validação final e decisão**        | Gabriel             | Passa o pente fino depois de mim e dá o siga / não siga. Decisões de escopo, prazo e tecnologia são suas                                                                            |
| **Cliente**                          | Diretoria da LIACUP | Fornece conteúdo, valida o que é visível para o usuário, aprova entregas de fase                                                                                                    |

**Regra de ouro do fluxo:** nada vai para o Gabriel sem passar pela minha validação, e nada vai para a liga sem passar pela do Gabriel. Se eu reprovar, volta para o Claude Code com o problema descrito — não com a solução pronta, para não enviesar a correção.

### O ciclo de uma feature

```
1. Coordenação  →  define a feature e o critério de aceite
2. Claude Code  →  /speckit.specify        gera spec.md
3. Coordenação  →  revisa a spec  ◄── primeiro ponto de parada
4. Claude Code  →  /speckit.plan           gera plan.md
5. Claude Code  →  /speckit.tasks          gera tasks.md
6. Coordenação  →  revisa plano e tarefas  ◄── segundo ponto de parada
7. Claude Code  →  /speckit.implement      escreve o código
8. Coordenação  →  aplica o checklist de validação  ◄── terceiro ponto de parada
9. Gabriel      →  pente fino e decisão    ◄── portão final
10. Merge e deploy
```

Revisar a spec **antes** do código é o que dá economia real: um erro de entendimento corrigido no passo 3 custa um parágrafo; o mesmo erro descoberto no passo 8 custa uma feature inteira.

---

## 3. O SDD neste projeto

Usaremos o **Spec Kit** do GitHub, que tem integração oficial com o Claude Code.

**Instalação e início do repositório:**

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init portal-liacup --integration claude
```

Isso instala os comandos como skills em `.claude/skills` e cria a estrutura de specs.

**Comandos que vamos usar, na ordem:**

| Comando                 | Para que serve                                        | Quando                                      |
| ----------------------- | ----------------------------------------------------- | ------------------------------------------- |
| `/speckit.constitution` | Grava os princípios do projeto                        | Uma vez, no início                          |
| `/speckit.specify`      | Descreve **o que** construir, em linguagem de produto | Início de cada feature                      |
| `/speckit.clarify`      | Levanta o que ficou vago na spec                      | Sempre que a spec tocar em regra de negócio |
| `/speckit.plan`         | Descreve **como** construir, com o stack definido     | Depois da spec aprovada                     |
| `/speckit.tasks`        | Quebra em tarefas executáveis                         | Depois do plano                             |
| `/speckit.analyze`      | Confere se spec, plano e tarefas conversam entre si   | Antes de implementar                        |
| `/speckit.implement`    | Escreve o código                                      | Depois do meu aval                          |
| `/speckit.checklist`    | Gera checklist de qualidade da feature                | Complementa meu checklist fixo              |

**Duas disciplinas que não podem ser afrouxadas:**

1. **A spec não fala de tecnologia.** Ela descreve comportamento, regra e critério de aceite. Se aparecer "usar `useState`" numa spec, a spec está errada. Tecnologia é assunto do `plan.md`.
2. **Uma feature por branch, uma spec por feature.** Nada de spec guarda-chuva que faz meio site. Se a spec não cabe em uma leitura de cinco minutos, ela precisa ser quebrada.

---

## 4. Mapa de documentos

### Já existem

| Documento                      | Onde             | Papel                                                                              |
| ------------------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| Proposta e aceite v2           | `.docx` entregue | Contrato com a liga: escopo, identidade, MVP                                       |
| Revisão v2 da liga             | projeto          | Conteúdo validado e ambiguidades                                                   |
| Design system e pendências     | projeto          | Paleta, tipografia, componentes                                                    |
| Auditoria mobile v3            | projeto          | Medições de responsividade                                                         |
| **ADR-0001 — stack**           | este pacote      | Decisão de tecnologia — **validada**                                               |
| **ADR-0002 — envio de e-mail** | este pacote      | Provedor de e-mail transacional                                                    |
| **Padrões de código**          | este pacote      | Componentização e boas práticas, verificáveis                                      |
| **Conteúdo institucional**     | este pacote      | Textos e dados da liga aprovados para o site                                       |
| **Relatório de divergências**  | este pacote      | Conflitos entre Estatuto, Edital, formulário e protótipo — aguarda decisão da liga |
| **Constitution**               | este pacote      | Princípios inegociáveis                                                            |
| **Checklist de validação**     | este pacote      | Meu portão de qualidade                                                            |
| **Este plano**                 | este pacote      | Como o desenvolvimento acontece                                                    |

### A escrever durante o desenvolvimento

| Documento                            | Quando                                                | Quem escreve                                |
| ------------------------------------ | ----------------------------------------------------- | ------------------------------------------- |
| `README.md` do repositório           | Fase 0                                                | Claude Code, eu reviso                      |
| Modelo de dados definitivo           | Fase 0, com a primeira feature de dados               | Claude Code no `plan.md`                    |
| ADRs adicionais                      | Sempre que uma decisão técnica tiver alternativa real | Claude Code propõe, eu formalizo            |
| `spec.md` / `plan.md` / `tasks.md`   | Uma trinca por feature                                | Claude Code                                 |
| **Manual de operação do painel**     | Antes do lançamento                                   | Eu — em português simples, para a diretoria |
| **Política de privacidade e LGPD**   | Antes do lançamento                                   | Eu, com validação do Gabriel                |
| **Plano de passagem de bastão**      | Antes do lançamento                                   | Eu                                          |
| Relatório de testes e acessibilidade | Fase de testes                                        | Claude Code executa, eu reviso              |
| Runbook de produção                  | Lançamento                                            | Eu                                          |

### A escrever no fim

Um documento de encerramento de projeto, com o que foi entregue, o que ficou de fora e por quê, e o que a liga precisa saber para tocar sozinha.

---

## 5. Fases e backlog

Cada linha da tabela vira uma trinca spec/plan/tasks. A ordem importa: ela foi montada para que cada feature só dependa de coisas já prontas.

### Fase 0 — Fundação

| #   | Feature                                                               | Por que primeiro                 |
| --- | --------------------------------------------------------------------- | -------------------------------- |
| F00 | Repositório, CI, ambientes e deploy contínuo                          | Sem isso nada é verificável      |
| F01 | Design system em código (tokens, tipografia, botões, campos, cartões) | Toda tela depende dele           |
| F02 | Camada de dados: esquema, RLS, cliente do Supabase, dados de exemplo  | Todo o resto lê ou escreve daqui |

### Fase 1 — Site público

| #   | Feature                                                          |
| --- | ---------------------------------------------------------------- |
| F03 | Layout base: cabeçalho, menu mobile em drawer, rodapé, navegação |
| F04 | Página inicial (hero, indicadores, agenda, notícias, chamadas)   |
| F05 | Sobre, Equipe e Docentes                                         |
| F06 | Notícias: lista, filtro por categoria, link externo no cartão    |
| F07 | Conteúdo educativo e Recomendações de leitura                    |
| F08 | Eventos: próximos e anteriores                                   |
| F09 | Projetos: os quatro eixos                                        |
| F10 | Materiais: listagem e download                                   |
| F11 | Galeria: álbuns e fotos                                          |
| F12 | Processo seletivo e perguntas frequentes                         |
| F13 | Contato e formulário "Fale com a Liga"                           |

### Fase 2 — Painel administrativo

| #   | Feature                                                                  |
| --- | ------------------------------------------------------------------------ |
| F14 | Autenticação real: login, sessão, recuperação de senha, papéis           |
| F15 | Estrutura do painel: layout, menu, controle de acesso por papel          |
| F16 | CRUD genérico: listar, criar, editar, excluir com confirmação e desfazer. **Inclui listar o que está arquivado e restaurar** — decidido no clarify da F02: excluir arquiva em vez de apagar, e arquivar só é recuperação se a diretoria conseguir ver e restaurar pelo painel |
| F17 | Formulários por seção, reaproveitando um formulário por coleção          |
| F18 | Upload de imagens com redimensionamento e limite de tamanho              |
| F19 | Caixa de mensagens: lista, leitura, arquivar, excluir, contador          |
| F20 | Usuários e permissões                                                    |
| F21 | Exportar e importar conteúdo (backup manual pela diretoria)              |

### Fase 3 — Pronto para o mundo

| #   | Feature                                                                |
| --- | ---------------------------------------------------------------------- |
| F22 | SEO: metadados, Open Graph, `sitemap.xml`, dados estruturados          |
| F23 | Acessibilidade WCAG 2.1 AA e desempenho                                |
| F24 | LGPD: política de privacidade, base legal, retenção e purga            |
| F25 | Observabilidade: monitor de disponibilidade, rotina anti-pausa, backup. **Dona nominal da automação da purga de dado pessoal** — o ADR-0001 R6 promete "purga automática"; a F02 entrega o procedimento manual testado e adia a automação para cá, junto do agendador que já vai existir |
| F26 | Domínio, produção, manual de operação e passagem de bastão             |

**26 features.** Sem prazo fixo, o que importa não é a data e sim a ordem: nunca começar uma fase com a anterior pela metade.

### Marcos para mostrar à liga

- **M1 — Fim da Fase 1:** site público navegável com conteúdo real. É o momento de a liga ver e reagir.
- **M2 — Fim da Fase 2:** a diretoria consegue publicar sem ajuda. Teste de verdade: uma pessoa da liga publica uma notícia sozinha, sem ninguém do lado.
- **M3 — Fim da Fase 3:** no ar, no domínio próprio, com manual entregue.

---

## 6. Definition of Ready e Definition of Done

### Pronto para começar (Definition of Ready)

Uma feature só entra em desenvolvimento se:

1. A spec descreve comportamento, não implementação.
2. Todo critério de aceite é verificável — dá para dizer "passou" ou "não passou" sem discussão.
3. Os dados de que ela depende existem ou têm origem definida.
4. O conteúdo real necessário está disponível, ou está explicitamente marcado como espaço reservado.
5. Não há pergunta em aberto capaz de mudar o desenho da solução.

### Pronto de verdade (Definition of Done)

Uma feature só é dada como concluída se **todos** os itens do checklist de validação passarem, incluindo o checklist de revisão de componente do `PADROES-DE-CODIGO.md`. Sem exceção "a gente arruma depois" — item que fica para depois vira tarefa registrada, não é dívida invisível.

---

## 7. Riscos do projeto

Riscos de tecnologia estão no ADR-0001. Estes são os de projeto.

| #   | Risco                                                                             | Impacto                             | O que fazemos                                                                                                              |
| --- | --------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| P1  | **O conteúdo real não chega.** Nove itens dependem da liga. Sem eles não se lança | Bloqueia o lançamento               | Cobrança nominal com responsável e prazo; o desenvolvimento não para, usa espaço reservado marcado                         |
| P2  | **Aumento de escopo.** "Já que estamos mexendo, dá para colocar..."               | Projeto não termina                 | Tudo que não está no MVP do documento de aceite vira lista de melhorias futuras. Só entra por decisão explícita do Gabriel |
| P3  | **Sucessão.** Ninguém assume depois                                               | O portal morre                      | Manual de operação, contas em nome da liga, passagem de bastão gravada — todas na Fase 3, nenhuma opcional                 |
| P4  | **A liga só vê o resultado no fim** e descobre tarde que não era aquilo           | Retrabalho grande                   | Os três marcos M1, M2 e M3 existem para isso. Mostrar cedo, mostrar feio, mostrar sempre                                   |
| P5  | **Validação por IA vira carimbo.** Eu aprovar tudo sem rigor                      | Qualidade cai e ninguém percebe     | O checklist é objetivo e mensurável, não impressionista. Eu reporto número, não adjetivo                                   |
| P6  | **Dados pessoais tratados sem base legal** (mensagens, processo seletivo)         | Exposição jurídica da liga e da UnB | F24 é obrigatória antes do lançamento, não depois                                                                          |
| P7  | **Uso da marca UnB.** A logo e o nome usam "UnB"                                  | Pedido de remoção                   | Confirmar com a coordenação do curso ou a instituição antes do lançamento. Baixo custo agora, caro depois                  |

---

## 8. LGPD e questões institucionais

O portal coleta dados pessoais em pelo menos dois pontos: o formulário "Fale com a Liga" (nome, e-mail, mensagem) e, futuramente, o processo seletivo. Isso não é detalhe burocrático — é a Lei 13.709/2018 e a liga é parte de uma universidade pública.

O mínimo que precisa existir antes do lançamento:

- **Política de privacidade** acessível de qualquer página, em linguagem clara.
- **Base legal declarada** para cada dado coletado. Para o formulário de contato, o consentimento do titular ao enviar.
- **Finalidade e prazo de retenção** definidos: por quanto tempo a liga guarda uma mensagem de contato, e o que acontece depois. Sugestão: purga automática após 24 meses.
- **Canal para exercício de direitos** — quem quiser saber, corrigir ou apagar seus dados precisa saber a quem escrever.
- **Aviso no próprio formulário**, antes do envio, não escondido no rodapé.
- **Sem cookies de rastreio** sem consentimento. Se houver analytics, que seja sem cookies.

Não sou advogado e isto não é parecer jurídico. Vale a liga consultar a assessoria jurídica da UnB ou a coordenação do curso antes de publicar a política — em geral a universidade já tem modelo institucional.

Além disso, confirmar com a UnB o uso do nome e da marca no site e na logo.

---

## 9. Dependências de conteúdo — bloqueiam o lançamento

Nenhuma impede desenvolver; todas impedem lançar. **Nove das quatorze já saíram da lista**, com o Relato, o Estatuto e o Edital 02/2026.

| Item                                      | Situação                            |
| ----------------------------------------- | ----------------------------------- |
| Logo em alta resolução · logo do e-mail   | **Resolvido**                       |
| História, Objetivo e Apresentação da Liga | **Resolvido**                       |
| E-mail oficial · @ do Instagram           | **Resolvido**                       |
| Descrição dos eixos de Projetos           | **Resolvido** — Estatuto, Art. 2º   |
| Edital, cronograma e link de inscrição    | **Resolvido** — Edital 02/2026      |
| FAQ item 1                                | Provavelmente resolvido — confirmar |
| Foto de perfil do Instagram               | Pendente                            |
| Fotos do Julho Verde                      | Pendente                            |
| Fotos dos ligantes                        | Pendente                            |
| Definição da seção Materiais              | Pendente                            |
| Notícias — quadros 2 e 3 idênticos        | Pendente                            |

Os textos aprovados e as fontes estão em `conteudo-institucional.md`.

### Divergências: resolvidas

O Estatuto, o Edital e o formulário divergiam em quatro pontos que o site publicaria lado a lado. Todas as decisões foram tomadas e estão em `RELATORIO-DIVERGENCIAS.md`, junto com os riscos aceitos. **A F12 está liberada.**

Uma decisão de escopo saiu daí e vale destacar: a página de Processo Seletivo permanece — com apresentação, pré-requisitos, etapas, cronograma, edital e FAQ — mas **o portal não recebe inscrição**. O botão redireciona para o formulário da liga.

### Correções obrigatórias no protótipo

Três dados que eu inventei como exemplo e que agora sabemos estarem errados: o e-mail `liacup@unb.br`, o endereço "Faculdade de Medicina · Campus Darcy Ribeiro" e os oito cargos de diretoria. Todos são plausíveis o bastante para alguém tomar por verdadeiros. Saem antes de qualquer publicação.

## 10. Primeiros passos concretos

Os três primeiros passos da v1 eram de governança. Um já está feito.

| #   | Passo                                                                  | Situação                                    |
| --- | ---------------------------------------------------------------------- | ------------------------------------------- |
| 1   | Organização no GitHub em nome da liga                                  | **Feito** — `github.com/liacup`             |
| 2   | Contas de Vercel, Supabase e Resend criadas com `liacup.unb@gmail.com` | A fazer — **não usar conta pessoal**        |
| 3   | Registrar `liacup.com.br` no Registro.br                               | A fazer — definir antes quem será o titular |
| 4   | Criar o repositório `portal-liacup` na organização                     | A fazer                                     |
| 5   | `specify init portal-liacup --integration claude`                      | Comigo                                      |
| 6   | `/speckit.constitution` com a constitution v2                          | Comigo                                      |
| 7   | Abrir a F00 e seguir o ciclo da seção 2                                | Comigo                                      |

Os passos 2 e 3 dependem de você e da liga. Os passos 4 a 7 eu conduzo com o Claude Code assim que os anteriores estiverem prontos — e o passo 3 destrava a verificação do domínio no Resend, que é pré-requisito do envio de e-mail.

## 11. Como acompanhamos

A cada feature concluída eu reporto, em três linhas: o que entrou, o resultado do checklist com números, e o que ficou pendente. A cada marco, um resumo maior para a liga, em linguagem não técnica.

Se em algum momento eu perceber que estamos construindo algo diferente do que foi aprovado, ou que uma decisão sua e uma decisão da liga se contradizem, meu trabalho é parar e apontar — não seguir e entregar algo que ninguém pediu.
