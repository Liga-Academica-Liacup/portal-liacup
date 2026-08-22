# Guia de validação — F02 Camada de dados

**Data**: 2026-08-21 · **Spec**: [spec.md](./spec.md) · **Plano**: [plan.md](./plan.md)

Cobre os 15 critérios de sucesso. Cada item responde com **número ou saída de comando**, nunca com
adjetivo.

## Pré-requisitos

- Node 22, branch `feat/F02-camada-de-dados`
- **Dois projetos Supabase** na conta da liga: produção e teste, criados em e-mail institucional
  (ADR-0001, risco R5)
- Credenciais do projeto de teste em `.env.local`, e nos segredos do repositório para o CI

---

## Parte 1 — As coleções existem e são tipadas

**Evidência 1**: `npm run verificar` com zero problemas nos quatro passos.

**Evidência 2 (SC-001)**: **12 coleções** criadas, listadas a partir do próprio banco.

**Evidência 3 (SC-009)**: pedir um campo que não existe e ver a verificação de tipos **falhar**;
remover e ver passar. Duas execuções, dois resultados opostos.

**Evidência 4 (D5)**: regenerar os tipos e conferir que o resultado é **idêntico** ao versionado. Se
diferir, o versionado está velho — e o passo do CI falha por isso.

---

## Parte 2 — As políticas bloqueiam *(a parte que mais importa)*

**Evidência 5 (SC-002)**: **100%** das tabelas com controle de acesso por linha ativo, contado a
partir do banco. O número precisa ser **12 de 12**, não "todas".

**Evidência 6 (SC-003, SC-004, SC-005, SC-006)**: a suíte de políticas, com o total de células
verificadas e quantas são de recusa.

**Esperado**: **zero** operações proibidas bem-sucedidas, e o número de células de recusa **maior que
zero** — se for zero, o teste não provou bloqueio nenhum, só permissão.

**Evidência 7 — as três demonstrações de [contracts/politicas-de-acesso.md](./contracts/politicas-de-acesso.md)**:

| # | O que provar | Esperado |
| --- | --- | --- |
| P1 | Desligar a política de leitura de uma coleção | O teste de bloqueio de rascunho **falha** |
| P2 | Religar | Volta ao verde |
| P3 | Criar tabela sem política | A verificação de cobertura **falha**, nomeando a tabela |

**Sem a P3, a regra "coleção sem política é bug" não vale para as tabelas que ainda não existem.**

---

## Parte 3 — A chave de serviço *(dano irreversível)*

**Evidência 8 (SC-007)**: o script que varre o pacote compilado, informando **quantos arquivos
varreu** e quantas ocorrências achou. Ocorrências precisa ser **0**; arquivos varridos precisa ser
**maior que 0**.

**Evidência 9 — as três demonstrações de [contracts/camada-de-dados.md](./contracts/camada-de-dados.md)**:

| # | O que fazer | Esperado |
| --- | --- | --- |
| C1 | Ler a chave num componente de cliente | A **barreira 2** quebra o CI, com arquivo e linha |
| C2 | Contornar a 2 passando o valor por prop | A **barreira 3** pega no pacote compilado |
| C3 | Desfazer | Verde |

**O C2 é o que prova a barreira que existe para o caso que as outras não pegam.**

**Evidência 10 (SC-008)**: varredura do repositório e do histórico — zero credenciais reais.

---

## Parte 4 — Dado pessoal

**Evidência 11 (SC-013)**: o procedimento de purga **executado**, com o número de registros afetados.
Procedimento escrito e nunca executado é procedimento que não funciona.

**Evidência 12 (SC-014)**: zero endereços de IP em claro no banco; a tabela de origem guarda só o
resumo, e o sal não está versionado.

**Evidência 13**: retenção de 24 meses, finalidade e base legal documentadas, e o procedimento
legível por quem não conhece banco de dados.

---

## Parte 5 — Ciclo de vida

**Evidência 14 (SC-015)**: apagar um conteúdo pelo caminho da aplicação e confirmar que ele **continua
no banco**, marcado como arquivado, e que aparece na consulta de arquivados.

**Evidência 15**: arquivar um álbum e confirmar que as fotos foram junto; restaurar e confirmar que
voltaram.

**Evidência 16**: simular edição concorrente — abrir duas vezes, salvar as duas — e confirmar que a
segunda é **recusada** e que a recusa **devolve o conteúdo tentado**. A devolução é o item que
importa: sem ela, trocamos perda silenciosa por perda barulhenta.

---

## Parte 6 — Dados de exemplo e fidelidade

**Evidência 17 (SC-011)**: leitura crítica dos dados de exemplo. Todo texto ou é o real aprovado, ou
está **visivelmente marcado** como espaço reservado. Zero textos institucionais inventados.

**Evidência 18**: as correções obrigatórias de `conteudo-institucional.md` §7 entram corretas desde o
primeiro dado — e-mail `liacup.unb@gmail.com`, FCTS · Campus UnB Ceilândia, **6** cargos,
"Kerolyn Ramos Garcia".

---

## Parte 7 — Nada quebrou

**Evidência 19 (SC-012)**: `npm test`, `npm run test:e2e` e `npm run test:desempenho` — os 65 de
unidade e os 84 de ponta a ponta da F01 continuam passando, e os limiares **não** descem.

**Evidência 20**: contagem de dependências. **Esperado: 23** — 5 de execução e 18 de
desenvolvimento. Três a mais que a F01, cada uma na tabela do plano.

---

## O que este guia NÃO prova, e por quê

- **A pausa do plano gratuito**: o comportamento está descrito em [research.md](./research.md) D3 e
  no README, mas provar exige esperar 7 dias sem atividade. A rotina anti-pausa é da **F25**.
- **Os três papéis da diretoria**: esta feature distingue anônimo de autenticado. Administrador,
  editor e colaborador são da **F14**.
- **A tela de arquivados**: o esquema sustenta listar e restaurar; a tela é da **F16**.

Os três estão declarados em vez de preenchidos com algo plausível.
