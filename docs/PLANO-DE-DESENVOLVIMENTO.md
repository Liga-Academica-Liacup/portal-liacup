# Portal LIACUP · Plano de desenvolvimento v7 (reorganização)

**Status:** aprovado pelo Gabriel em 18/11/2026
**Data:** 18 de novembro de 2026
**Substitui:** a v6 de 20/08/2026, que organizava o projeto em 26 features sequenciais com Spec Kit.

## Decisões do Gabriel na aprovação (18/11/2026)

1. **Interruptor** `SITE_PUBLICADO` em vez de branch longa (seção 6).
2. **O design do protótipo não muda.** Ele foi aprovado pela liga. O que recomeça é a implementação, que não ficou boa. Melhorias de UI e UX são bem-vindas, desde que mostradas lado a lado com o protótipo e aprovadas pelo Gabriel. O site precisa ser responsivo em todas as larguras.
3. **O CI não é simplificado.** Todas as verificações ficam. A change de CI só entra para melhorar a automação e o fluxo (seção 7, R0).
4. **Conteúdo pendente não segura entrega.** Texto da Secretaria, acréscimo do FAQ 1, números da home e confirmação da marca UnB: a R1 sai sem eles, mostramos à liga e ajustamos depois.
5. **Pasta local do repositório:** `C:\Projetos\portal-liacup` (não mais `C:\Dev`).
6. **A rodada mobile v3 foi aplicada no protótipo.** Medido em 18/11: cabeçalho de 62 px em 390 px, nenhum alvo de toque abaixo de 44 px nas 10 páginas públicas em 390 px, nenhuma rolagem horizontal, menu lateral com `aria-expanded` e `aria-controls`.

Documentos que andam junto com este: `equipe-de-agentes.md` (quem faz o quê e como os agentes trabalham), `constitution-sdd.md` v3 (as regras), `referencia-visual.md` (como o visual volta a seguir o protótipo) e `historico-fase-anterior.md` (o que foi feito até agosto e o que se aprendeu).

---

## 1. Onde estamos de verdade

Medido em 18/11/2026, no repositório e no ar, não pelos documentos antigos.

| Item | Situação |
|---|---|
| Produção | `liacup.com.br` e `portal-liacup.vercel.app` mostram a página "Portal em construção" (logo, Instagram, e-mail). **Fica no ar até a R1.** |
| Repositório | `github.com/Liga-Academica-Liacup/portal-liacup`, público. Os documentos antigos citam `github.com/liacup`, que não é o endereço atual |
| `main` | `1cd261f`, de 27/08. Tem a F00 (fundação e CI), a F01 (7 componentes e vitrine), a F02 (13 tabelas no Supabase com RLS) e o RP-13 |
| `feat/F03-layout-base` | 23 commits à frente da `main`, parada desde 31/08, nunca incorporada. 75 arquivos, 8.579 linhas acrescentadas: cabeçalho, menu lateral, rodapé e dez rotas vazias |
| Ferramenta de SDD | Spec Kit 0.16.6. Não é OpenSpec |
| Domínio | Registrado, pago e apontando para a Vercel |

Em três meses foram quatro features e nenhuma página com conteúdo que a liga pudesse ver. No repositório há perto de 12.400 linhas de spec e documentação, 4.000 de código de produto, 3.400 de testes e 1.400 de scripts de verificação.

## 2. O que saiu do trilho

1. **Cascata.** As 26 features andavam em fila, e a Fase 0 inteira (fundação, design system e banco) veio antes de qualquer página. O primeiro marco que a liga veria só chegaria depois de 14 features.
2. **O processo ficou maior que o produto.** A spec da F03, que é cabeçalho e menu, tem 461 linhas, 46 requisitos e 52 tarefas. Cada feature passou por três paradas com veredito escrito, e boa parte do esforço foi verificar os próprios verificadores (RP-13, `next-env.d.ts`, proteção de branch, contagem de seletores).
3. **A fidelidade foi medida no lugar errado.** O visual foi remontado classe a classe a partir do `liacup.css`, e cada ajuste (contraste, 44 px, espaçamento) foi justificado sozinho. Nunca houve comparação de tela inteira contra o protótipo. Cada linha estava certa e o conjunto ficou diferente. O protótipo nem está no repositório.
4. **A coordenação trocou de mãos.** Claude, GPT e um agente no ChatGPT se revezaram, e regras importantes ficaram em notas fora do repositório. Foram cinco episódios de trabalho perdido no Git.
5. **Documento demais.** O projeto chegou a 41 documentos, mais da metade vereditos de rodada.

## 3. O que muda

| Antes | Agora |
|---|---|
| Spec Kit: spec, plan, tasks | **OpenSpec**: explore, propose, apply, archive |
| 26 features em fila | **Releases pequenas**, cada uma publicável sozinha |
| Três paradas com veredito longo | **Dois portões**: a proposta e o PR com prévia |
| Fidelidade por propriedade de CSS | **Fidelidade por tela**: print do protótipo ao lado do print do site, nas mesmas larguras |
| Coordenação trocando de ferramenta | **Eu como gestor** neste projeto; **Claude Code como líder técnico** com uma equipe de subagentes no repositório |
| Verificação da verificação | **Definição de pronto curta** e CI com o essencial |

## 4. O que fica

- **Stack** (ADR-0001, validado): Next.js, TypeScript, Supabase, Vercel.
- **E-mail** (ADR-0002, validado): Resend com domínio próprio. Só entra na R3.
- **Paleta, contraste e fontes locais** (ADR-0003, validado) e as duas regras de controle: alvo de toque de 44 px e campo com fonte de 16 px.
- **Fontes de verdade visual, estados interativos e validação visual humana** (ADR-0006, aprovado pelo Gabriel em 01/09). A consequência que ele previa, reabrir F01 e F03, é exatamente o recomeço deste plano.
- **Conteúdo institucional** e as decisões D1 a D6 (`conteudo-institucional.md` e `relatorio-divergencias.md`).
- **Contas da liga**, domínio, Vercel e o CI básico.
- **A camada de dados da F02**, que está na `main`. Fica dormente até a R2. Não é apagada.
- **Estrutura de pastas e regra de camadas** (`padroes-de-codigo.md`).
- **A página "Portal em construção"** em produção, até o lançamento da R1.

## 5. O que recomeça

- **A implementação do visual.** O design do protótipo continua valendo como está. Os componentes da F01 e o layout da F03 são refeitos a partir dele, tela por tela, com liberdade para melhorias de UI e UX aprovadas pelo Gabriel. Os tokens (cores, fontes e escala de espaçamento do `liacup.css`) continuam, porque são da identidade aprovada.
- **A branch da F03 não é incorporada.** Ela vira a tag `arquivo/F03-layout-base`, para consulta. A lógica do menu lateral com `<dialog>` nativo e os testes de teclado servem de referência.
- **O Spec Kit sai.** A pasta `.specify`, as skills `speckit-*` e as pastas `specs/001` a `004` vão para `docs/historico/`, fora do caminho.

## 6. Como o "em construção" continua no ar enquanto o site cresce

**Decidido: um interruptor por variável de ambiente**, `SITE_PUBLICADO`.

- Em produção ele fica desligado e toda rota responde a página em construção.
- Nas prévias da Vercel ele fica ligado, e a liga vê o site real pelo link de prévia.
- Todo trabalho entra na `main` em pedaços pequenos, sem branch de longa duração.
- Lançar a R1 é ligar a variável em produção. Voltar atrás é desligar.

A alternativa descartada era uma branch `desenvolvimento` de longa duração, que foi o que travou a F03 (23 commits sem chegar à `main`).

## 7. Releases

Cada release é publicável. Cada item da lista é uma *change* do OpenSpec, pensada para caber em um a três dias de trabalho dos agentes.

### R0 · Reorganização (nenhuma página nova)

| Change | O que entrega |
|---|---|
| `trocar-spec-kit-por-openspec` | `openspec init`, contexto do projeto preenchido com a constitution v3, Spec Kit e specs antigas movidos para `docs/historico/` |
| `montar-equipe-de-agentes` | `CLAUDE.md` do repositório e os subagentes em `.claude/agents/`, conforme `equipe-de-agentes.md` |
| `interruptor-em-construcao` | A variável `SITE_PUBLICADO` e a página em construção servida em produção para toda rota |
| `prototipo-no-repositorio` | Arquivo do protótipo em `prototipo/`, o script que tira os prints e os prints de referência das 10 páginas em 390 e 1280 px |
| `ajustar-ci-ao-novo-fluxo` | Todas as verificações atuais ficam. Entram: validação do OpenSpec, prints automáticos das páginas como anexo do CI e cobertura de e2e e Lighthouse derivada da lista de páginas |

Ao fim da R0, o Gabriel recebe um link de prévia que ainda mostra pouco, e um repositório pronto para andar rápido.

### R1 · Site institucional mínimo (o lançamento)

Conteúdo fixo, vindo do `conteudo-institucional.md`. Nenhum banco, nenhum formulário, nenhum dado pessoal coletado. O menu mostra só as páginas que existem e cresce a cada release, sem rota vazia.

| Change | O que entrega |
|---|---|
| `layout-publico` | Cabeçalho, menu lateral no celular e rodapé, iguais ao protótipo |
| `pagina-inicial` | Hero, frase, números e chamadas para Sobre, Projetos e Processo seletivo |
| `pagina-sobre-e-equipe` | Apresentação, história, objetivo, finalidade, docentes, fundadores e os seis cargos do Estatuto |
| `pagina-projetos` | As quatro frentes de trabalho |
| `pagina-processo-seletivo` | Apresentação, pré-requisitos, etapas, FAQ e o estado "inscrições fechadas" com convite para o Instagram |
| `pagina-contato` | E-mail, Instagram e sede (FCTS, Campus UnB Ceilândia), sem formulário |
| `lancamento-r1` | Metadados, `sitemap.xml`, imagem de compartilhamento, página 404, nota de privacidade curta, e o interruptor ligado em produção |

### R2 · Notícias e eventos

| Change | O que entrega |
|---|---|
| `leitura-de-noticias-e-eventos` | Leitura do Supabase com o esquema da F02, com dados inseridos por nós |
| `pagina-noticias` | Lista, filtro por categoria e cartão com link externo |
| `pagina-eventos` | Próximos e anteriores |
| `inicio-com-agenda-e-noticias` | A home ganha os blocos dinâmicos |
| `banco-sempre-acordado` | Rotina que impede a pausa do Supabase e aviso de indisponibilidade |

### R3 · Painel mínimo

Login com recuperação de senha (Supabase Auth com Resend), painel com listar, criar, editar e excluir notícias e eventos, exclusão com confirmação. **Teste de aceite da release:** uma pessoa da liga publica uma notícia sozinha.

### R4 · Fale com a Liga

Formulário de contato, caixa de mensagens no painel, aviso por e-mail, aviso de privacidade no formulário, retenção e purga.

### R5 · Acervo e acabamento

Materiais, conteúdo educativo e recomendações de leitura, galeria (Julho Verde), edição das demais seções no painel, usuários e papéis, exportar e importar conteúdo, manual de operação e passagem de bastão.

**R1 a R3 são o núcleo.** Do R4 em diante a ordem pode mudar conforme a liga pedir.

## 8. Ritmo

- **Sprint de uma semana.** Começa com o briefing das changes e termina com um link de prévia.
- **A cada duas sprints**, uma prévia para a liga, com um resumo curto em linguagem não técnica.
- **Limites que impedem o inchaço:** a proposta de uma change cabe em cinco minutos de leitura, e uma change tem no máximo umas quinze tarefas. Passou disso, quebra em duas.

## 9. O ciclo de uma change, passo a passo

1. **Gestor:** escreve o briefing da change (o quê, por quê, critérios de aceite, prints de referência) e salva no projeto.
2. **Gabriel:** cola o briefing no Claude Code.
3. **Claude Code:** roda `/opsx:propose`. O subagente especificador escreve `proposal.md`, as specs e `tasks.md` dentro de `openspec/changes/<change>/`.
4. **Portão 1.** Gestor revisa a proposta lendo o repositório; Gabriel aprova ou pede ajuste. Nenhuma linha de código antes disso.
5. **Claude Code:** roda `/opsx:apply`. Desenvolvedor implementa, QA testa, guardião visual compara com o protótipo, revisor revisa o diff.
6. **Claude Code:** roda `/opsx:archive` antes do PR. As specs da change entram em `openspec/specs/` e a change vai para `openspec/changes/archive/`. É antes, e não depois do merge, porque a `main` é protegida: arquivar depois exigiria um segundo PR só para isso.
7. **Claude Code:** entrega os arquivos prontos e a lista de comandos Git com a mensagem de commit.
8. **Gabriel:** faz o commit, o push e abre o PR. A Vercel gera a prévia.
9. **Portão 2.** Gestor confere o PR contra a definição de pronto e os prints; Gabriel olha a prévia e faz o merge. Se o Portão 2 pedir ajuste, a change volta do arquivo antes do merge.

## 10. Definição de pronto

Uma change está pronta quando:

1. os critérios de aceite da proposta passam;
2. o CI está verde, com todas as verificações que ele já tem: tipos, lint, formatação, tokens, unidade, e2e (zero violações do axe e sem rolagem horizontal em 360, 390, 768, 1024 e 1280 px) e Lighthouse;
3. o PR traz os prints do protótipo e do site lado a lado em 390 e 1280 px, com as diferenças listadas e aceitas pelo Gabriel;
4. todo texto vem do `conteudo-institucional.md`, e nada foi inventado;
5. alvos de toque têm pelo menos 44 px, campos usam fonte de 16 px, os pares de cor seguem o ADR-0003 e cada controle mostra os estados interativos do ADR-0006;
6. o subagente revisor aprovou.

## 11. Pendências que dependem da liga ou do Gabriel

| Item | Bloqueia |
|---|---|
**Decisão de 18/11: nenhum destes itens segura entrega.** Seguimos com o que temos, mostramos à liga e ajustamos depois.

| Item | Como entra até a liga responder |
|---|---|
| ~~Arquivo do protótipo~~ | **Recebido em 18/11**, com a rodada mobile v3 aplicada |
| Texto da frente Secretaria | Vai o texto provisório do `conteudo-institucional.md` §3 |
| Acréscimo do FAQ item 1 | Vai a resposta atual |
| Números da home | Vão os aprovados: 21 membros, 7 cursos, 4 ações, fundação em 2026 |
| Confirmação do uso do nome e da marca UnB | A R1 é mostrada à liga antes; o ajuste vem depois |
| Fotos dos ligantes | A R1 sai sem elas |
| Notícias: quadros 2 e 3 com a mesma descrição | Decidir na R2 |
| Definição da seção Materiais e fotos do Julho Verde | R5 |
| Licença do repositório | Não bloqueia |

O Edital 02/2026 encerrou em 31/08. A página de Processo seletivo nasce no estado "inscrições fechadas", que é o caso normal fora de edital.

## 12. Riscos

| Risco | O que fazemos |
|---|---|
| O processo voltar a inchar | Limite de tamanho da proposta e de tarefas. O gestor corta escopo antes do Portão 1 |
| O visual divergir de novo | Prints lado a lado obrigatórios desde a primeira change de layout, julgados pelo Gabriel |
| Melhoria de UI virar redesenho | Toda melhoria aparece lado a lado com o protótipo no PR, com o motivo, e só entra com aval do Gabriel. Paleta, fontes, borboletas e a estrutura das páginas não mudam |
| Os agentes gastarem esforço verificando a si mesmos | Cada subagente tem escopo fixo, e relatório de no máximo uma tela |
| O conteúdo da liga atrasar | A R1 sai com o que está aprovado; o que falta fica fora da tela, não aparece como rascunho |
