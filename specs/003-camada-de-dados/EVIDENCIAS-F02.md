# Evidências — F02 Camada de dados

**Data**: 26 de agosto de 2026 · **Branch**: `feat/F02-camada-de-dados`

No precedente das F00 e F01. Cada linha traz **o que foi medido e o número**, não uma afirmação de
que está tudo certo. O que não pôde ser provado está declarado como **NÃO EXECUTADO**, com o motivo
— preencher com algo plausível é o que este arquivo existe para não fazer (Princípio VIII).

**33 evidências: 30 verificadas, 3 não executadas** (E3, E32 e E33, na seção 9).

A T059 previa 20. São 33 porque a fase 3 rendeu evidências que a tarefa não previa — a descoberta das
concessões e as três saídas do verificador. O número está aqui contado, e não arredondado para bater
com o planejado.

---

## 1. Controle de acesso por linha

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E1** | Catálogo do Postgres do projeto de **teste**, tabela por tabela | **13 verificadas · 0 sem controle de acesso · 0 sem política · 1 exceção nomeada** |
| **E2** | Catálogo do projeto de **produção**, tabela por tabela | **13 verificadas · 0 sem controle de acesso** · 12 sem política — ver E3 |
| **E3** | Estado de produção quanto às políticas | **NÃO EXECUTADO.** As migrações 0009 a 0013 não foram aplicadas em produção: pela regra do ADR-0005 §2.6, migração vai para produção **depois do merge**. Produção está **fechada**, não desprotegida — RLS ativo e nenhuma política recusa tudo. O comando ficou registrado no relatório para o Gabriel rodar |

**A exceção nomeada da E1** é `controle_de_origem`, e ela está escrita no verificador com o motivo:
só a chave de serviço escreve e lê; nem a diretoria vê.

### As três saídas do verificador (RP-12)

| # | Situação | Saída |
| --- | --- | --- |
| **E4** | Projeto inexistente, sem conseguir conectar | `=== NAO VERIFICADO ===` · **verificadas: 0** · saída 1 |
| **E5** | Conectado, com o RLS de `faq` desligado | `AUSENTE faq` · **sem controle de acesso: 1** · saída 1 |
| **E6** | Conectado, tudo ativo | `=== VERIFICADO ===` · **verificadas: 13 · sem controle: 0** · saída 0 |

As três saídas são visivelmente diferentes de propósito. Saber que o banco está fechado não é a mesma
coisa que achar que está protegido.

---

## 2. A descoberta desta feature

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E7** | Concessões de tabela para `anon`, `authenticated` e `service_role`, depois das migrações 0009 a 0011 | **Apenas REFERENCES, TRIGGER e TRUNCATE.** Nenhum SELECT, nenhum INSERT |

Com as políticas escritas e nenhuma concessão, o catálogo respondia **"RLS ativo, 4 políticas"** para
as onze coleções e o verificador ficava **verde** — e o banco recusava tudo. O Postgres tem duas
portas: a concessão diz se o papel pode tocar na tabela, a política diz quais linhas ele vê. As
migrações abriam só a segunda.

**Quem encontrou foi o teste de permissão, não o de recusa.** Os 85 testes de recusa teriam passado
todos: estava tudo mesmo recusado.

A migração 0012 concede o que faltava, e o verificador ganhou a coluna que teria pego isso —
**"política sem concessão"** agora é falha, com o motivo na mensagem.

---

## 3. Políticas de acesso

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E8** | Células da matriz exercidas pela suíte | **143 células · 58 de permissão · 85 de recusa** |
| **E9** | **P1** — política de leitura de `noticias` afrouxada para `using (true)` | **2 testes de invisibilidade falharam** (rascunho e arquivado), saída 1 |
| **E10** | **P2** — política religada | **143 passaram**, saída 0 |
| **E11** | **P3** — tabela `parcerias` criada como a F06 criaria, sem RLS e sem política | Cobertura **falhou nomeando `parcerias`** · verificadas: 14 · sem controle: 1 · sem política: 1 |

**Nenhuma célula de recusa passa por "recebi vazio" nem por "não deu erro".** Leitura bloqueada
devolve lista vazia e alteração bloqueada volta em silêncio — os dois se confundem com uma tabela
vazia e com uma alteração bem-sucedida. Toda recusa é provada por comparação com o que o cliente de
serviço enxerga: ele é a testemunha de que **havia o que esconder**, e nunca aparece no que está
sendo verificado.

A célula que quase sempre falta está coberta: **ler uma mensagem pelo identificador conhecido, com
acesso anônimo, é recusada.**

---

## 4. A chave de serviço

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E12** | **C1** — chave lida num componente de cliente | **Barreira 2** quebrou o lint em `DemonstracaoC1.tsx:5:17` |
| **E13** | **C2** — barreira 2 contornada de propósito, valor passado por prop de servidor para cliente | **Lint VERDE.** A **barreira 3** achou o valor em **4 arquivos** do build: `vitrine.html`, `vitrine.rsc` e dois `.segment.rsc` |
| **E14** | **C3** — desfeito, `.next` apagado por inteiro e recompilado | **149 arquivos varridos · 35 entregues ao navegador · 0 ocorrências** do valor e do nome |
| **E15** | As 6 credenciais reais do `.env` procuradas em **todos os commits** do histórico, uma a uma | **0 ocorrências.** Nenhum arquivo `.env` versionado além do `.example` |

**A E13 é a evidência que justifica a barreira 3 existir.** As duas primeiras barreiras verificam o
código; ela verifica o artefato. O valor chegou ao navegador sem nenhum arquivo de cliente mencionar
a variável.

O `.next` da E13 guardava a chave real em disco, e por isso foi apagado por inteiro antes da
recompilação — não bastava desfazer o código.

---

## 5. Dado pessoal

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E16** | **Purga executada** com dados envelhecidos de propósito | **5 registros removidos** — 3 mensagens (24 meses) e 2 registros de origem (24 horas) — e **2 preservados**, os que estavam dentro do prazo |
| **E17** | Resumos de origem no banco com formato de IP em claro | **0** |
| **E18** | Chamadas de log de `src/` e `scripts/`, auditadas uma a uma | A única do código de aplicação imprime a mensagem técnica do PostgREST e nada mais |
| **E19** | Sal do resumo versionado | **Não.** Era uma das 6 agulhas da E15 |

O resumo do endereço tem **6 testes**, entre eles o que sustenta a rotação: mesmo endereço com sal
diferente dá resumo diferente. Sem sal, a função **recusa** em vez de resumir.

**A automação da purga é adiamento registrado, não esquecimento**: ADR-0001 R6 promete purga
automática, e a F25 é a dona nominal. Registrado na spec, em `docs/DADOS-PESSOAIS.md`, na linha da
F25 do plano — e no fato de o procedimento manual ter sido **executado** (E16).

---

## 6. Dados de exemplo

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E20** | Linhas semeadas em 11 coleções | **34 linhas** — 4 projetos, 2 docentes, 5 ligantes, 8 FAQ com o texto real aprovado; o resto marcado |
| **E21** | Literais de texto no bloco de espaço reservado, sem a marca `[EXEMPLO]` | **0 de 49** |
| **E22** | Correções obrigatórias da seção 7 de `conteudo-institucional.md`, buscadas em `src/` e `supabase/` | **0 ocorrências** de `liacup@unb.br`, de "Faculdade de Medicina · Campus", de "Darcy Ribeiro" e de "Kerolyn Ramos" sem "Garcia" |

**Nenhum nome de pessoa em cargo de diretoria foi semeado**, e a ausência é a decisão: o documento
institucional traz os seis cargos do Estatuto, e **não** diz quem os ocupa. Inventar essa associação
seria repetir o erro da v1 do protótipo na informação mais fácil de acreditar.

---

## 7. Ciclo de vida

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E23** | Arquivar pelo caminho da aplicação | A linha **continua no banco**, com `arquivado = true` |
| **E24** | Arquivar um álbum com 2 fotos | **2 fotos arquivadas** junto, por gatilho; restaurar trouxe **as 2 de volta** |
| **E25** | Duas escritas informando a **mesma** versão | A segunda foi **recusada**, devolveu `conteudoTentado` intacto, e o banco ficou com o conteúdo da primeira |

---

## 8. Verificações que continuam passando

| # | Verificação | Resultado |
| --- | --- | --- |
| **E26** | `npm run verificar` | **Verde** — tipos, lint, formatação, tokens e a barreira 3 |
| **E27** | `npm test` (unidade) | **71 passaram** — eram 65 na F01, mais os 6 do resumo de origem |
| **E28** | `npm run test:banco` | **147 passaram** — 143 células de política e 4 de ciclo de vida |
| **E29** | `npm run test:e2e` | **84 passaram** — os mesmos da F01, nenhum perdido |
| **E30** | `npm run test:desempenho` | **Todas as asserções passaram**, 3 execuções do Lighthouse |
| **E31** | Dependências diretas | **22** — 4 de execução, 18 de desenvolvimento. `@supabase/ssr` **ausente**, como o plano exige |

---

## 8.1 Artefatos gerados no controle de versão (RP-13)

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E34** | Arquivos rastreados pelo git que são artefato gerado | **2 encontrados**, ambos com a linha correspondente **já presente** no `.gitignore`: `tsconfig.tsbuildinfo` e `supabase/.temp/cli-latest` |
| **E35** | Depois de tirados do rastreamento | **198 arquivos examinados contra 11 padrões · 0 artefatos indevidos · 1 versionado por decisão** *(era 2 — ver adendo)* |
| **E36** | Demonstração: `git add -f tsconfig.tsbuildinfo`, com `*.tsbuildinfo` presente no `.gitignore` | **Falhou nomeando o arquivo** e mostrando o `git rm --cached` a rodar, saída 1. Removido do rastreamento: verde, saída 0 |

### Adendo de 26/08/2026 — a exceção que não sobreviveu à medição

Este commit ficou **inalcançável** por um tempo: foi feito sobre `feat/F02-camada-de-dados` depois
do merge do PR #9, e a branch foi apagada em seguida. Recuperado do reflog na F03 e incorporado por
PR próprio. As três evidências abaixo são da recuperação.

| # | O que foi medido | Resultado |
| --- | --- | --- |
| **E37** | `tsc --noEmit` **sem** `.next` e **sem** `next-env.d.ts` — o estado real de um clone novo se o arquivo for desrastreado | **Código 0.** O motivo escrito da exceção — "a verificação de tipos quebraria" — era **previsão, e falsa**. A exceção caiu e o arquivo saiu do controle de versão |
| **E38** | O custo de tirá-lo, medido **antes** de tirar: arquivo temporário com `import de .png`, que depende do `declare module '*.png'` que o `next-env.d.ts` traz | **Sem** o arquivo: `TS2307` apontando o `import` do png, **sem citar** o arquivo que falta, código **2**. **Com** o arquivo: código **0**. Defesa escolhida: `next typegen` encadeado em `verificar:tipos`, que o regenera **idêntico** sem build inteiro — medido, código 0 |
| **E39** | Demonstração do verificador com a lista de exceções já corrigida: `git add -f next-env.d.ts` | **Falhou nomeando o arquivo**, saída 1 — provando que a remoção da exceção **teve efeito**. `git add -f tsconfig.tsbuildinfo`: falhou igual, saída 1. Estado final: **198 examinados · 11 padrões · 1 exceção · 0 indevidos**, saída 0 |

**A emenda que isto produziu no RP-13**: o motivo de uma exceção passa a ter de **nomear o comando
que demonstra o que quebra**, e esse comando é executado quando a exceção entra. A condição
anterior — "exceção sem motivo é falha" — pegava **ausência** de motivo e não pegava **motivo
errado**. É a distinção configuração contra resultado do RP-12, aplicada à lista de exceções do
próprio requisito que a criou.

**O `.gitignore` não cobria coisa nenhuma nesses dois casos, e parecia cobrir.** Ele diz ao git o que
não acrescentar; não tem efeito sobre o que já está rastreado. Por isso o verificador não lê o
`.gitignore` — ele pergunta ao git **o que está rastreado agora**.

As cinco pastas conferidas por pedido do Gabriel — `.next/`, `coverage/`, `playwright-report/`,
`test-results/` e `.lighthouseci/` — **já estavam** no `.gitignore` e nenhuma tinha arquivo
rastreado. O buraco não estava onde a lista sugeria.

---

## 9. O que NÃO foi executado, e por quê

| # | Item | Motivo |
| --- | --- | --- |
| **E3** | Políticas em produção | Migrações 0009 a 0013 vão para produção **depois do merge**, pela regra do ADR-0005 §2.6. Produção hoje: 13 tabelas, RLS ativo em todas, nenhuma política — **fechada**, não desprotegida |
| **E32** | Passo de CI "Tipos do banco conferem com o esquema" **rodando no CI** | Depende do segredo `SUPABASE_ACCESS_TOKEN` e da variável `NEXT_PUBLIC_SUPABASE_URL` no repositório, que só o Gabriel pode cadastrar. O script foi provado **localmente**, verde e vermelho: com o arquivo versionado deliberadamente desatualizado, apontou **219 linhas divergentes** e as três primeiras, e voltou ao verde depois |
| **E33** | Passo de CI "Chave de serviço fora do pacote compilado" **rodando no CI** | Depende do segredo `SUPABASE_SERVICE_ROLE_KEY` no repositório. Provado localmente em E13 e E14 |

**Os dois passos de CI não têm `if:` que os pule quando o segredo falta.** Sem o segredo eles ficam
**vermelhos dizendo que NÃO VERIFICARAM**, que é a verdade, em vez de verdes por omissão. Isso
significa que o CI desta branch fica vermelho até os segredos serem cadastrados — e é o
comportamento correto.

---

## 10. Divergência reportada

**A T046 e a seção 3 de `docs/conteudo-institucional.md` se contradizem** sobre o texto da
Secretaria. A tarefa manda marcar visivelmente todo espaço reservado, "inclusive o texto da
secretaria"; o documento decide, com todas as letras, que as quatro frentes vão ao ar **sem marcação
visível de rascunho para o visitante**, porque texto meio-pronto com aviso de "em construção" passa
imagem pior que texto enxuto e correto, e a pendência fica registrada do nosso lado.

**Resolvido a favor do documento aprovado pela liga** (Princípio VI), com o motivo escrito no topo de
`supabase/seed.sql` e a pendência registrada onde a seção 3 manda.
