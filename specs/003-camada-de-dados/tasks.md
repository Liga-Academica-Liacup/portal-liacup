---
description: 'Lista de tarefas — F02 Camada de dados do Portal LIACUP'
---

# Tarefas: Camada de dados (F02)

**Input**: artefatos de projeto em `specs/003-camada-de-dados/`

**Pré-requisitos**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Testes**: obrigatórios. Cada política tem teste dos **dois lados** — permissão e recusa —, e as demonstrações de bloqueio são tarefas próprias, não observação dentro de outra.

**Organização**: uma fase por história da spec, na ordem de prioridade dela. Toda tarefa cita os requisitos que cumpre, para que a cobertura seja calculável por máquina.

## Formato: `[ID] [P?] [História] Descrição`

- **[P]**: pode rodar em paralelo — arquivos diferentes, sem dependência pendente.
- **[USn]**: história a que a tarefa pertence; só nas fases de história.
- **[GABRIEL]**: depende de ação que o desenvolvedor não pode executar.

---

## Fase 1: Fundação bloqueante

**Objetivo**: as duas dependências, os dois projetos Supabase e a estrutura de arquivos, antes de qualquer tabela.

**⚠️ CRÍTICO**: T001–T006 terminam nesta ordem.

- [X] T001 [GABRIEL] Criar os **dois** projetos Supabase na conta da liga, em e-mail institucional conforme o risco R5 do ADR-0001: um de produção e um de teste. O de teste consome o segundo dos 2 projetos do plano gratuito, limite registrado em research.md D7. **Pré-requisito de infraestrutura, não requisito numerado**: sem os dois projetos não há onde criar tabela nem contra o que testar política (Dependencies da spec, sem FR/SC por definição)
- [X] T002 Instalar **exatamente duas** dependências novas — `@supabase/supabase-js` (execução) e `supabase` (desenvolvimento) —, levando o total de 20 para **22**. O `@supabase/ssr` **não entra**: ele repassa sessão por cookie entre servidor e navegador, que é o que a F14 faz, e esta feature não tem tela nem login (FR-033, RP-01, research.md D6)
- [X] T003 Registrar em `.env.example` as variáveis do Supabase, **separando visivelmente o que é segredo do que pode aparecer no navegador**, e conferir que a chave de serviço **não** recebe o prefixo `NEXT_PUBLIC_` — que é a barreira 1 (FR-017, FR-014)
- [X] T004 Criar `supabase/migrations/` e registrar em `package.json` os comandos de aplicar migração e gerar tipos, para que não sejam passos que alguém lembra de rodar (FR-005, research.md D4 e D5)
- [X] T005 Acrescentar a linha de `supabase/` e `tests/politicas/` à seção 1 de `docs/PADROES-DE-CODIGO.md`, pelo mesmo caminho que `tests/`, `scripts/` e `public/` percorreram — a regra mora no documento de origem, não só no plano. **Responde à seção 1 dos padrões de código, não a um requisito numerado**, e por isso não cita FR nem SC (Princípio I, sem FR/SC por definição)
- [X] T006 Registrar no `README.md` a consequência do research.md D4: **alterar o banco pelo painel desalinha o repositório do que está no ar**, e quem fizer isso quebra a próxima migração. **Responde ao Princípio I**, não a um requisito numerado (Princípio I, sem FR/SC por definição)

**Ponto de verificação**: `npm ci` instala sem conflito de par; a contagem de dependências diretas dá **22**.

---

## Fase 2: História 1 — O conteúdo do portal tem onde morar (P1)

**Objetivo**: as 13 tabelas existem — **todas já com controle de acesso por linha ativo** —, com os campos do protótipo aprovado, e o código chega até elas de forma tipada.

**Teste independente**: pedir a lista de notícias publicadas pelo caminho tipado e receber os dados de exemplo, sem escrever nenhuma tela.

- [X] T007 [US1] Criar a migração da base comum das coleções de conteúdo: identificador, **publicado**, **arquivado**, criado em, **alterado em** (que é também a marca de versão do FR-031), autor e ordem, conforme data-model.md §1 (FR-002, FR-003, FR-028, FR-031)
- [X] T008 [P] [US1] Criar a migração das coleções de **notícias** (com link externo), **eventos** (com data do evento e passado) e **conteúdos educativos**, com os campos do protótipo (FR-001, FR-004). **A migração ativa o controle de acesso por linha nas tabelas que cria**, na mesma migração: acesso ativado sem política **recusa tudo**, que é o padrão seguro — ativa primeiro, abre depois (FR-008, RP-11)
- [X] T009 [P] [US1] Criar a migração de **projetos**, com o eixo em **lista fechada** — ensino, extensão, pesquisa e secretaria —, recusada pelo banco e não pela tela (FR-001, FR-004). **A migração ativa o controle de acesso por linha nas tabelas que cria**, na mesma migração: acesso ativado sem política **recusa tudo**, que é o padrão seguro — ativa primeiro, abre depois (FR-008, RP-11)
- [X] T010 [P] [US1] Criar a migração de **materiais**, **recomendações de leitura** e **perguntas frequentes** (FR-001, FR-004). **A migração ativa o controle de acesso por linha nas tabelas que cria**, na mesma migração: acesso ativado sem política **recusa tudo**, que é o padrão seguro — ativa primeiro, abre depois (FR-008, RP-11)
- [X] T011 [P] [US1] Criar a migração de **ligantes** (com "é diretoria") e **docentes orientadores**, com os campos de `conteudo-institucional.md` §4 (FR-001, FR-004). **A migração ativa o controle de acesso por linha nas tabelas que cria**, na mesma migração: acesso ativado sem política **recusa tudo**, que é o padrão seguro — ativa primeiro, abre depois (FR-008, RP-11)
- [X] T012 [P] [US1] Criar a migração de **álbuns** e **fotos** da galeria, com a foto referenciando o álbum (FR-001, FR-004). **A migração ativa o controle de acesso por linha nas tabelas que cria**, na mesma migração: acesso ativado sem política **recusa tudo**, que é o padrão seguro — ativa primeiro, abre depois (FR-008, RP-11)
- [X] T013 [US1] Criar a migração de **mensagens** com nome, e-mail, assunto, texto, situação e **recebida em** — e **nenhum endereço de IP**, nem em claro nem resumido, que é o que mantém verdadeira a frase do ADR-0001 §3. Com esta, fecham as **12 coleções** do SC-001 (FR-001, FR-018, SC-001). **A migração ativa o controle de acesso por linha nas tabelas que cria**, na mesma migração: acesso ativado sem política **recusa tudo**, que é o padrão seguro — ativa primeiro, abre depois (FR-008, RP-11)
- [X] T014 [US1] Criar a migração da tabela de **controle de origem**, separada da de mensagens, com o resumo irreversível do endereço e o momento (FR-026). **A migração ativa o controle de acesso por linha nas tabelas que cria**, na mesma migração: acesso ativado sem política **recusa tudo**, que é o padrão seguro — ativa primeiro, abre depois (FR-008, RP-11)
- [X] T015 [US1] **Provar que nenhuma tabela existe sem controle de acesso por linha**: consultar o catálogo do Postgres e listar **tabela por tabela com a situação**, não uma afirmação. A saída informa **quantas tabelas foram verificadas** e quantas estão sem — se o contador vier zero, a consulta não olhou nada e o verde não significa nada (FR-008, SC-002, RP-11, RP-12)
- [X] T016 [US1] Gerar `src/lib/supabase/tipos.ts` a partir do esquema e versioná-lo, sem escrever nenhum tipo de tabela à mão (FR-005, research.md D5)
- [X] T017 [US1] Acrescentar ao CI um passo que **regenera os tipos e falha se o resultado diferir do versionado** — sem ele, "os tipos estão atualizados" é promessa (FR-005)
- [X] T018 [US1] Criar `src/lib/supabase/navegador.ts` e `src/lib/supabase/servidor.ts`, sendo o segundo o **único arquivo autorizado a ler a chave de serviço** (FR-014, contracts/camada-de-dados.md)
- [X] T019 [US1] Criar `src/features/<dominio>/dados.ts` para uma coleção de referência, com leitura que **pede apenas as colunas que usa**, **devolve lista vazia em vez de erro** e filtra por publicado e não arquivado (FR-006, FR-007)
- [X] T020 [US1] Demonstrar que o caminho é tipado: pedir um campo inexistente, rodar `npm run verificar:tipos` e registrar a **falha**; remover e registrar o verde. Duas execuções, dois resultados opostos (FR-005, SC-009)

**Ponto de verificação — PARADA B**: 12 coleções mais a de controle de origem no banco, **zero tabelas sem RLS provado por consulta ao catálogo**, tipos gerados e uma leitura tipada devolvendo dado. Nenhum commit desta feature tem tabela sem RLS, em momento nenhum.

---

## Fase 3: História 2 — Quem não é da diretoria não consegue escrever (P1)

**Objetivo**: as políticas existem **e são vistas bloqueando**. O controle de acesso já está ativo desde a Fase 2, recusando tudo; esta fase **abre o que deve ser aberto**. É o que dá sentido a toda a feature.

**Teste independente**: tentar cada operação proibida com acesso anônimo e receber recusa; tentar cada permitida e receber sucesso.

- [ ] T021 [US2] Escrever as políticas das 11 coleções de conteúdo conforme a matriz de contracts/politicas-de-acesso.md: público lê só o publicado e não arquivado; a diretoria autenticada escreve; **remoção definitiva recusada até para a diretoria**, porque apagar arquiva (FR-009, FR-010, FR-028)
- [ ] T022 [US2] Escrever as políticas da coleção de **mensagens**, que é a matriz invertida: inserção anônima permitida, **leitura anônima recusada — inclusive por identificador conhecido** (FR-011)
- [ ] T023 [US2] Escrever as políticas da tabela de controle de origem: nenhum acesso anônimo em nenhuma operação (FR-026)
- [ ] T024 [US2] Montar a infraestrutura de teste de política com os **três clientes separados** — anônimo, autenticado e de serviço —, com o de serviço restrito à preparação e limpeza e **nunca presente no que está sendo verificado**. Se ele preparar e verificar, ignora as políticas dos dois lados e a suíte fica verde com o banco aberto (FR-012, research.md D1)
- [ ] T025 [P] [US2] Escrever em `tests/politicas/` os testes de **permissão** de cada célula da matriz, para as 11 coleções de conteúdo (FR-012)
- [ ] T026 [P] [US2] Escrever os testes de **recusa** de cada célula da matriz, para as 11 coleções — incluindo ler rascunho, ler arquivado, criar, alterar e arquivar com acesso anônimo. Uma célula de recusa só passa se a operação **falhar**: receber lista vazia **não é** o mesmo que ser recusado (FR-012, SC-004, SC-006)
- [ ] T027 [US2] Escrever os testes das mensagens nos dois lados, com atenção à célula que quase sempre falta: **ler uma mensagem pelo identificador conhecido com acesso anônimo precisa ser recusado**. Esconder a lista e deixar buscar por identificador não protege nada, porque identificador vaza (FR-011, FR-012, SC-005)
- [ ] T028 [US2] Fazer a suíte imprimir **quantas células foram verificadas e quantas são de recusa**. Se o número de recusas for zero, o teste não provou bloqueio nenhum, só permissão — mesmo raciocínio do contador de alvos de toque da F01 (FR-012, SC-003)
- [ ] T029 [US2] **Demonstração P1 e P2**: desligar a política de leitura de uma coleção, rodar a suíte e registrar a **falha** do teste de bloqueio de rascunho; religar e registrar o verde. Duas execuções, dois resultados opostos, no padrão V1–V5 da F00 (FR-013, SC-003)
- [ ] T030 [US2] **Demonstração P3**: criar uma tabela nova **sem política**, rodar a verificação de cobertura e registrar a **falha nomeando a tabela**; remover e registrar o verde. É o que garante que "coleção sem política é bug" vale para as tabelas que **ainda não existem** — sem ele, a F06 cria uma tabela, esquece a política, e nada avisa (FR-008, FR-013, SC-002)

**Ponto de verificação**: zero operações proibidas bem-sucedidas, com o contador de células de recusa maior que zero, e as três demonstrações registradas.

---

## Fase 4: História 3 — A chave de serviço nunca chega ao navegador (P1)

**Objetivo**: quatro barreiras, três automáticas, e **duas delas vistas bloqueando**.

**Teste independente**: procurar a credencial no que é entregue ao navegador e não encontrá-la.

- [ ] T031 [US3] Acrescentar ao `eslint.config.mjs` a **barreira 2**: uma zona que permite ler a variável da chave de serviço **apenas** em `src/lib/supabase/servidor.ts`, com mensagem em português apontando arquivo, linha e o motivo (FR-015)
- [ ] T032 [US3] Criar `scripts/verificar-chave-de-servico.mjs` — a **barreira 3** —, que varre a **saída compilada** do build atrás do valor e do nome da chave, imprimindo **quantos arquivos varreu** e quantas ocorrências achou. Sem o contador, "nenhuma ocorrência" e "não varreu nada" produzem a mesma saída verde (FR-014, SC-007)
- [ ] T033 [US3] Encadear a barreira 3 no comando `verificar` e no CI, **depois do build**, porque ela verifica o artefato e não o código (FR-014)
- [ ] T034 [US3] **Demonstração C1**: ler a chave de serviço num componente de cliente, rodar o lint e registrar a **falha da barreira 2** com arquivo e linha (FR-015)
- [ ] T035 [US3] **Demonstração C2**: contornar a barreira 2 de propósito, passando o valor por prop de um componente de servidor para um de cliente, e registrar a **barreira 3 pegando no pacote compilado**. É a demonstração que existe para o caso que as outras não pegam — sem ela, a barreira 3 nunca foi vista funcionando (FR-014, SC-007)
- [ ] T036 [US3] **Demonstração C3**: desfazer as duas e registrar o verde (FR-014, FR-015)
- [ ] T037 [US3] Varrer o repositório e o histórico por credenciais reais e registrar zero ocorrências (FR-016, SC-008)

**Ponto de verificação**: duas barreiras vistas bloqueando, não uma, e o contador de arquivos varridos maior que zero.

---

## Fase 5: História 4 — Dado pessoal tem prazo desde o primeiro dia (P2)

**Objetivo**: a retenção existe no esquema, e o procedimento de purga é **executado**, não só escrito.

**Teste independente**: conferir que cada mensagem registra quando chegou e que a purga roda e apaga o que deve.

- [ ] T038 [US4] Criar `src/lib/utils/resumo-de-origem.ts` com o resumo irreversível do endereço usando a biblioteca padrão do Node, **sem dependência nova**, com **sal secreto e rotacionável** lido de variável de ambiente. Sal fixo e público torna o resumo reversível por força bruta: o espaço IPv4 tem cerca de 4,3 bilhões de valores, que uma máquina comum percorre em minutos (FR-026, FR-027)
- [ ] T039 [P] [US4] Documentar em `docs/` a **finalidade declarada, a base legal e o prazo de 24 meses** da coleta das mensagens, conforme data-model.md §5 (FR-019, SC-010)
- [ ] T040 [US4] Criar `scripts/purgar-dado-pessoal.mjs`: apaga mensagens com mais de 24 meses **e** registros de origem com mais de 24 horas, **no mesmo procedimento** — dois mecanismos de purga é um que ninguém executa (FR-020, FR-026)
- [ ] T041 [US4] Escrever o procedimento de purga no `README.md` em linguagem que **quem opera o portal entenda sem conhecer banco de dados**: o que apaga, quando rodar e como saber que deu certo (FR-020, SC-010)
- [ ] T042 [US4] **Executar o procedimento de purga ao menos uma vez**, com dados de teste envelhecidos de propósito, e registrar o **número de registros afetados**. Procedimento escrito e nunca executado é procedimento que não funciona — e é o que impede o adiamento da purga automática de virar esquecimento (FR-025, SC-013)
- [ ] T043 [US4] Conferir que **nenhum endereço de IP em claro** existe no banco e que o sal **não** está versionado (FR-021, SC-014)
- [ ] T044 [US4] Conferir que nenhum registro de erro contém dado pessoal (FR-021)

**Ponto de verificação**: a purga rodou, com número, e zero IPs em claro.

---

## Fase 6: História 5 — Dá para construir as páginas antes de a diretoria preencher (P2)

**Objetivo**: dados de exemplo com o texto real aprovado, e espaço reservado visivelmente marcado onde não há.

**Teste independente**: pedir cada coleção e receber registros suficientes para lista, item único e coleção vazia.

- [ ] T045 [US5] Criar `supabase/seed.sql` usando o **texto real** de `conteudo-institucional.md` onde ele existe: os quatro eixos, as duas orientadoras, o FAQ inteiro, os indicadores da home, o e-mail e o Instagram (FR-022, SC-011)
- [ ] T046 [US5] Marcar **visivelmente** todo espaço reservado onde não há conteúdo aprovado — inclusive o texto da **secretaria**, que `conteudo-institucional.md` §3 registra como provisório e pendente de confirmação da liga (FR-023, SC-011)
- [ ] T047 [US5] Garantir que as correções obrigatórias de `conteudo-institucional.md` §7 entram **corretas desde o primeiro dado**: `liacup.unb@gmail.com`, FCTS · Campus UnB Ceilândia, os **6** cargos do Estatuto e "Kerolyn Ramos Garcia" (FR-022, SC-011)
- [ ] T048 [US5] Dar a cada coleção registros suficientes para exercitar **lista, item único e coleção vazia** — o terceiro é o estado que o `EstadoVazio` da F01 desenha, e sem dado ele nunca é verificado (FR-024)
- [ ] T049 [US5] Ler criticamente todo o dado de exemplo procurando texto que possa ser confundido com informação institucional verdadeira, e registrar zero ocorrências. Na v1 do protótipo foram inventados e-mail, endereço e cargos plausíveis o bastante para alguém tomar por verdadeiros (FR-023, SC-011)

**Ponto de verificação**: zero textos institucionais inventados.

---

## Fase 7: Ciclo de vida — arquivar, restaurar e edição concorrente

**Objetivo**: as decisões do clarify viram comportamento verificável.

- [ ] T050 Implementar o arquivamento: apagar pelo caminho da aplicação **marca como arquivado e não remove**, e a consulta de arquivados existe (FR-028, FR-029, SC-015)
- [ ] T051 Fazer o arquivamento de um álbum **descer para as fotos**, e a restauração trazer as duas coisas de volta (FR-030)
- [ ] T052 Implementar a detecção de edição concorrente: a escrita informa qual versão abriu, e é **recusada** se não bater com a do banco (FR-031)
- [ ] T053 Fazer a recusa **devolver o conteúdo que a pessoa tentou salvar**. Avisar sem devolver troca perda silenciosa por perda barulhenta, que é pior — a pessoa vê o aviso **e** perde o trabalho. A redação da mensagem é da F17; o esquema que a sustenta é daqui (FR-032)
- [ ] T054 Escrever os testes dos três comportamentos: arquivar não remove, álbum leva as fotos, e a segunda escrita é recusada devolvendo o conteúdo (FR-028 a FR-032, SC-015)

**Ponto de verificação**: zero registros removidos do banco ao serem apagados pela aplicação.

---

## Fase 8: Leitura pública e a pausa do plano gratuito

- [ ] T055 Configurar a leitura do conteúdo público como **estática com revalidação**, nunca dinâmica a cada acesso. Isso não resolve a pausa do plano gratuito — resolve que **a pausa não derruba o site público** (FR-006, research.md D3)
- [ ] T056 Escrever no `README.md` o comportamento com o banco pausado, **por tipo de página**, incluindo o que **continua quebrado**: o formulário perde a mensagem e o painel não abre, ambos da F25. A primeira pessoa a encontrar o site esquisito num domingo precisa achar a explicação em vez de descobrir sozinha. **Responde ao Princípio I**, não a um requisito numerado (Princípio I, sem FR/SC por definição, research.md D3)

---

## Fase 9: Polimento e evidências

- [ ] T057 Executar `npm run verificar`, `npm test`, `npm run build && npm run test:e2e` e `npm run test:desempenho`, confirmando que os 65 testes de unidade e os 84 de ponta a ponta da F01 continuam passando e que os limiares **não** descem (SC-012)
- [ ] T058 Conferir a contagem de dependências diretas e registrar o número: **esperado 22 — 4 de execução e 18 de desenvolvimento**. O `@supabase/ssr` **não pode aparecer**: ele é da F14, e sua ausência aqui é verificável junto da contagem (FR-033, SC-016, RP-01)
- [ ] T059 Registrar as 20 evidências em `specs/003-camada-de-dados/EVIDENCIAS-F02.md`, arquivo próprio no precedente das F00 e F01, declarando como **não executado** o que não puder ser provado em vez de preencher com algo plausível (SC-012, Princípio VIII)
- [ ] T060 Preencher `docs/checklist-validacao.md` para a F02 com resultado real em cada item. **Esta tarefa responde à constituição, não a um requisito numerado** — o checklist é exigência do Princípio VII e por isso não cita FR nem SC (Princípio VII, sem FR/SC por definição)

---

## Dependências entre fases

```text
Fase 1 (fundação, sequencial, começa por ação do Gabriel na T001)
   ↓
Fase 2 — US1 (P1)  coleções e caminho tipado
   ↓
Fase 3 — US2 (P1)  políticas e as três demonstrações de bloqueio
   ↓
Fase 4 — US3 (P1)  chave de serviço e as três demonstrações de barreira
   ↓
Fase 5 — US4 (P2)  dado pessoal e a purga executada
   ↓
Fase 6 — US5 (P2)  dados de exemplo
   ↓
Fase 7 (ciclo de vida) → Fase 8 (leitura e pausa) → Fase 9 (evidências)
```

**A T001 bloqueia tudo**: sem os dois projetos Supabase não há onde criar tabela nem contra o que
testar política.

## Oportunidades de paralelismo

| Fase | Tarefas paralelas | Por que dá |
|---|---|---|
| 2 | T008, T009, T010, T011, T012 | Uma migração por grupo de coleções, arquivos distintos |
| 3 | T025, T026 | Permissão e recusa em arquivos separados, depois da T024 |
| 5 | T039 | Documentação de retenção, independente do script |

## Estratégia de implementação

**Onde não cortar caminho**: a Fase 3 é a razão de existir desta feature. Escrever as políticas sem
as demonstrações T029 e T030 entrega um banco que **parece** protegido — e a diferença entre parecer
e ser só aparece quando alguém tenta.

**A T035 parece redundante e não é**: ela contorna de propósito a barreira que acabou de ser
provada, para exercitar a seguinte. É a única forma de saber que a barreira 3 funciona.

## Fora de escopo, registrado

Nenhuma tela · autenticação real e os três papéis da diretoria (F14) · upload de imagem (F18) ·
envio de e-mail (F13) · rotina anti-pausa e automação da purga (F25) · tela de arquivados (F16).
