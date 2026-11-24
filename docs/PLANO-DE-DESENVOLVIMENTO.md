# Portal LIACUP · Plano de desenvolvimento v7 (reorganização)

**Status:** aprovado pelo Gabriel em 18/11/2026
**Data:** 18 de novembro de 2026
**Substitui:** a v6 de 20/08/2026, que organizava o projeto em 26 features sequenciais com Spec Kit.

## Decisões do Gabriel na aprovação (18/11/2026)

1. **Interruptor** `SITE_PUBLICADO` em vez de branch longa (seção 6).
2. **O design do protótipo não muda.** Ele foi aprovado pela liga. O que recomeça é a implementação, que não ficou boa. Melhorias de UI e UX são bem-vindas, desde que mostradas lado a lado com o protótipo e aprovadas pelo Gabriel. O site precisa ser responsivo em todas as larguras.
3. **O CI não é simplificado.** Todas as verificações ficam. A change de CI só entra para melhorar a automação e o fluxo (seção 7, R0; desde 20/11, na R1).
4. **Conteúdo pendente não segura entrega.** Texto da Secretaria, acréscimo do FAQ 1, números da home e confirmação da marca UnB: a R1 sai sem eles, mostramos à liga e ajustamos depois.
5. **Pasta local do repositório:** `C:\Projetos\portal-liacup` (não mais `C:\Dev`).
6. **A rodada mobile v3 foi aplicada no protótipo.** Medido em 18/11: cabeçalho de 62 px em 390 px, nenhum alvo de toque abaixo de 44 px em 390 px nas 10 páginas medidas (de 11; a de Processo seletivo, aberta pelo botão do cabeçalho, ficou fora da medição), nenhuma rolagem horizontal, menu lateral com `aria-expanded` e `aria-controls`.

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
| `prototipo-no-repositorio` | Arquivo do protótipo em `prototipo/`, o script que tira os prints e os prints de referência das 11 páginas públicas em 390 e 1280 px |
| `montar-guardiao-appsec` | O sétimo agente, guardião de segurança, como etapa obrigatória antes do Portão 2, com checklist de bloqueio e `docs/SEGURANCA.md`. Ideia do Gabriel, 19/11 |
| `atualizar-next` | **Correção imediata**, aberta pelo primeiro veredito do guardião em 19/11: o `next` 16.3.1 está na faixa de duas falhas críticas de execução remota de código (uma delas a CVE-2026-96889, no otimizador de imagem). Sobe para a versão corrigida mais recente da linha 16.4 |
| `auditoria-de-base-appsec` | Auditoria de linha de base da `main` inteira pelo guardião, com cada achado ligado a uma release. Saiu da `montar-guardiao-appsec` pela E2 |
| `ajustar-ci-ao-novo-fluxo` | **Passou para a R1** (linha 5 da tabela da R1, ordem do Gabriel de 20/11) e foi dividida no Portão 1 dela, em 22/11: o `openspec validate` e os prints foram para a `completar-ci-do-novo-fluxo`. Texto original: todas as verificações atuais ficam. Entram: validação do OpenSpec, prints automáticos das páginas como anexo do CI e cobertura de e2e e Lighthouse derivada da lista de páginas |

Ao fim da R0, o Gabriel recebe um link de prévia que ainda mostra pouco, e um repositório pronto para andar rápido.

### R1 · Site institucional mínimo (o lançamento)

Conteúdo fixo, vindo do `conteudo-institucional.md`. Nenhum banco, nenhum formulário, nenhum dado pessoal coletado. O menu, o rodapé e os botões mostram só as páginas que existem, a partir de uma lista única que também alimenta os testes; cada página nova se acrescenta a ela. Ordem decidida pelo Gabriel em 20/11: as duas changes técnicas que sobraram da R0 entram entre as páginas.

| # | Change | O que entrega |
|---|---|---|
| 1 | `layout-e-hero` | Cabeçalho, menu lateral no celular, rodapé e o hero da página inicial. Com o site publicado, a raiz passa a mostrar a inicial. Nasce a lista única de páginas |
| 2 | `pagina-processo-seletivo` | A conversão principal: apresentação, quem pode, pré-requisitos, etapas, FAQ, estado "inscrições fechadas". O botão do cabeçalho e o "Quero participar" aparecem |
| 3 | `endurecer-agentes-e-git-local` | Os 7 achados de configuração de agente e Git local da auditoria, e a regra 2 da dieta escrita na §5 do `SEGURANCA.md` e na spec |
| 4 | `pagina-sobre-e-equipe` | Apresentação, história, objetivo, finalidade, impacto, docentes, fundadores e os seis cargos |
| 5 | `ajustar-ci-ao-novo-fluxo` | O segredo do CI só no push para a `main`, num ambiente que só ela alcança (LB-02), permissões mínimas (LB-08), ações presas por sha com a verificação (LB-17) e a busca de segredo antes do push. O LB-09 foi para a `papeis-da-diretoria-no-banco`. Dividida no Portão 1 (Gabriel, 22/11/2026). A cobertura do e2e e do Lighthouse pela lista de páginas já entra na change 1 |
| 6 | `completar-ci-do-novo-fluxo` | As três condições de saída do LB-02 da §6: o job com segredo visto no primeiro push para a `main`, a confirmação escrita do Gabriel sobre os segredos e o PAT antigo revogado; a correção do resíduo A1 da `ajustar-ci-ao-novo-fluxo` (Q8 (b)) e as ressalvas baixas e informativas dela (Q9 (a), Gabriel, 22/11/2026); a validação do OpenSpec e os prints automáticos das páginas como anexo do CI; e as ressalvas da `endurecer-agentes-e-git-local` (A2 a A7 do guardião e as 7 da terceira rodada do revisor). **Implementado na branch em 23/11/2026** (as saídas do LB-02 e do A1 valem com o veredito do guardião da change, e o push verde depois do merge se confirma na primeira tarefa da `pagina-projetos`, Q9 (a)): o LB-02 e o A1 fora da §6; o CI em quatro jobs, com um ambiente por segredo (`segredos-da-main` para o PAT, `chave-de-servico-da-main` para a chave) e o build num job sem segredo; o OpenSpec como `devDependency` exata, validado no CI sem telemetria; os prints das páginas como anexo; e as 42 ressalvas com destino no relatório da change, o E-A2 (`.agents/`) para a `lancamento-r1` (Q7 (b)) |
| 7 | `pagina-projetos` | As quatro frentes de trabalho |
| 8 | `pagina-contato` | E-mail, Instagram e sede, sem formulário |
| 9 | `inicio-completo` | Números, faixa do processo seletivo e bloco de contato; as chamadas para as outras páginas são os botões do hero e da faixa (Gabriel, 23/11/2026, Q8 (a) da inicio-completo) |
| 10 | `homologacao-r1` | O site da R1 inteiro num endereço próprio, só para a liga: valida textos e telas, dá o aceite e entrega o conteúdo que falta (foto do hero, texto da Secretaria, acréscimo do FAQ 1, números atualizados, fotos dos ligantes). O endereço não é indexado por buscadores. Decisão do Gabriel, 20/11 |
| 11 | `lancamento-r1` | Aplica o que a liga mandou na homologação, os 6 achados da auditoria para a R1 (inclusive cabeçalhos de segurança), metadados, `sitemap.xml`, 404, nota de privacidade, auditoria completa do guardião e o interruptor ligado em produção. Também a pasta `.agents/` no AS-17 e na conferência do ambiente, versionada, apagada ou comparada (E-A2 da `endurecer-agentes-e-git-local`, Q7 (b) da `completar-ci-do-novo-fluxo`, Gabriel, 23/11/2026) |

Ficam para depois, na página inicial: próximos eventos e notícias (R2) e conteúdo educativo (R5).

### R2 · Notícias e eventos

| Change | O que entrega |
|---|---|
| `papeis-da-diretoria-no-banco` | **Antes de tudo na R2.** A migração para as chaves novas do Supabase (`sb_publishable_` e `sb_secret_`), com as antigas desligadas, que invalida a chave de serviço exposta no CI (risco aceito pelo Gabriel na Q12 (b) da `ajustar-ci-ao-novo-fluxo`, 22/11/2026; antes, se o banco de produção passar a ter dado pessoal real). Os 10 achados de banco da auditoria, entre eles o LB-01: papel atribuído por administrador, recusa testada para conta comum. Até lá, cadastro público e login anônimo desligados em produção |
| `leitura-de-noticias-e-eventos` | Leitura do Supabase com o esquema da F02, com dados inseridos por nós |
| `pagina-noticias` | Lista, filtro por categoria e cartão com link externo |
| `pagina-eventos` | Próximos e anteriores |
| `inicio-com-agenda-e-noticias` | A home ganha os blocos dinâmicos |
| `banco-sempre-acordado` | Rotina que impede a pausa do Supabase e aviso de indisponibilidade |

### R3 · Painel mínimo

Começa pela `seguranca-do-painel` (4 achados da auditoria). Login com recuperação de senha (Supabase Auth com Resend), painel com listar, criar, editar e excluir notícias e eventos, exclusão com confirmação. **Teste de aceite da release:** uma pessoa da liga publica uma notícia sozinha.

- **Edital como arquivo** (Gabriel, 21/11/2026, Portão 2 da `pagina-processo-seletivo`): upload do PDF do edital pelo painel, com "Baixar o edital" baixando esse arquivo; só PDF conferido pelo conteúdo, limite de tamanho, escrita só para a diretoria, download como anexo com nome gerado pelo sistema. Entra no escopo da `seguranca-do-painel`.

### R4 · Fale com a Liga

Começa pela `seguranca-do-formulario` (4 achados da auditoria). Formulário de contato, caixa de mensagens no painel, aviso por e-mail, aviso de privacidade no formulário, retenção e purga.

### R5 · Acervo e acabamento

Materiais, conteúdo educativo e recomendações de leitura, galeria (Julho Verde), edição das demais seções no painel, usuários e papéis, exportar e importar conteúdo, manual de operação e passagem de bastão.

**R1 a R3 são o núcleo.** Do R4 em diante a ordem pode mudar conforme a liga pedir.

## 8. Ritmo

- **Sprint de uma semana.** Começa com o briefing das changes e termina com um link de prévia.
- **A cada duas sprints**, uma prévia para a liga, com um resumo curto em linguagem não técnica.
- **Limites que impedem o inchaço:** a proposta de uma change cabe em cinco minutos de leitura, e uma change tem no máximo umas quinze tarefas. Passou disso, quebra em duas.
- **Dieta de processo (20/11):** uma sessão do Claude Code por change; guardião proporcional ao risco da release; relatório de uma tela por agente, sem transcrição literal; no máximo duas rodadas por agente. Detalhes em `EQUIPE-DE-AGENTES.md` §2.

## 9. O ciclo de uma change, passo a passo

1. **Gestor:** escreve o briefing da change (o quê, por quê, critérios de aceite, prints de referência) e salva no projeto.
2. **Gabriel:** cola o briefing no Claude Code.
3. **Claude Code:** roda `/opsx:propose`. O subagente especificador escreve `proposal.md`, as specs e `tasks.md` dentro de `openspec/changes/<change>/`.
4. **Portão 1.** Gestor revisa a proposta lendo o repositório; Gabriel aprova ou pede ajuste. Nenhuma linha de código antes disso.
5. **Claude Code:** roda `/opsx:apply`. Desenvolvedor implementa, QA testa, guardião visual compara com o protótipo, revisor revisa o diff, e o guardião de segurança audita por último. BLOQUEADO volta para o dev. Depois de **qualquer** correção, o revisor e o guardião rodam de novo, com contexto limpo. Se o mesmo agente pedir correção numa terceira rodada, o líder técnico para e leva ao Gabriel o que está girando, em vez de seguir corrigindo.
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
6. o subagente revisor aprovou;
7. o guardião de segurança não deu BLOQUEADO, ou o Gabriel aceitou por escrito cada risco que sobrou, com motivo, prazo e a change que vai resolver. Achado bloqueante confirmado que já seja explorável em produção não se aceita: vira change de correção imediata.

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
