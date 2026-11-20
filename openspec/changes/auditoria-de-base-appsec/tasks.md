# Tarefas — auditoria de base de segurança

São 15 tarefas. **A parte 6 do briefing saiu**: com ela seriam 16. A recomendação de verificação
automática no CI e a busca de segredo antes do push (I3) vão direto para a change de CI,
`ajustar-ci-ao-novo-fluxo` (D12).

As tarefas seguem as recomendações das questões Q1 a Q8 do `design.md`. Uma tarefa que depende de
uma Qn diz qual. Se o Portão 1 decidir outra opção, a tarefa muda antes do `/opsx:apply`.

A ordem é fixa: primeiro as regras, depois as demonstrações, depois a auditoria (D2). Quem escreve
os documentos é o líder técnico. A constitution e o `EQUIPE-DE-AGENTES.md` são do gestor (D11).

## 1. As regras, antes da auditoria

- [ ] 1.1 **(Q2, Q7)** Escrever o modo "auditoria de base" na §5 de `docs/SEGURANCA.md`, conforme
      a D3. O texto traz:
      - a lista auditada, que é o `git ls-files` da `main`;
      - AS-01 no histórico;
      - a conferência curta, que não se aplica;
      - o `curl` em produção, que vale no modo base;
      - quando a auditoria roda;
      - os blocos e a junção da D4, com a regra "primeira que casar";
      - o formato da lista de achados;
      - a parada no bloqueante explorável;
      - a forma de `npm` da Q2 na lista fechada.

      A versão do documento sobe para 2. **Como se verifica:** aplicar os padrões de caminho da D4
      ao `git ls-files` da `main` dá 297 linhas no total, cada arquivo em um só bloco, e a contagem
      por bloco vai para o relatório. A forma nova da Q2 aparece uma vez na tabela da lista
      fechada.
- [ ] 1.2 **(Q1)** Escrever AS-17 na §4, em "quando a change toca no assunto", conforme a D5. O
      texto traz os caminhos, os quatro casos que bloqueiam, as três leituras da D5 e a regra da
      skill da Q5. Atualizar o intervalo "AS-01 a AS-16" conforme a Q1. O líder técnico muda
      `CLAUDE.md:21`, `openspec/config.yaml:51` e `.claude/agents/guardiao-appsec.md:3`, `:25` e
      `:105`. O gestor muda `docs/constitution.md:86`, com data e motivo, e
      `docs/EQUIPE-DE-AGENTES.md:29`. A frase da §4 sobre o próximo código livre passa de AS-17
      para AS-18. **Como se verifica:** a §4 tem exatamente uma linha de definição de AS-17. Uma
      busca por `AS-01 a AS-16` fora de `openspec/changes/` devolve 0 linhas. A hierarquia é a
      mesma na constitution, no `context` e no `CLAUDE.md`
- [ ] 1.3 **(Q3, Q4)** Escrever a regra do binário, conforme a D6. Entram:
      - o registro de origem, no lugar da Q4, com uma linha por padrão de caminho. A origem de
        `assets/` e de `public/` vem do Gabriel no Portão 1;
      - o tratamento do binário fora do registro;
      - as duas variantes da forma de contagem na lista fechada, com as lacunas da Q3;
      - a limitação do conteúdo comprimido.

      **Como se verifica:** cada um dos 32 binários de `git ls-files` da `main` casa com
      exatamente uma linha do registro, e nenhuma linha fica sem arquivo. A §5 diz, em uma frase,
      que zTXt, iTXt comprimido e woff2 ficam cobertos só pela origem declarada
- [ ] 1.4 Ensinar o modo base ao `.claude/agents/guardiao-appsec.md`, conforme a D4. O arquivo
      passa a dizer:
      - que lista recebe em cada modo;
      - que audita um bloco por invocação;
      - o que a junção devolve;
      - que AS-17 e a regra do binário moram na §4 e na §5, sem copiá-las.

      **Como se verifica:** `git diff main -- '.claude/agents/guardiao-appsec.md'` não toca a linha
      `tools: Read, Glob, Grep` nem a linha `model: opus`. O arquivo não traz a definição de nenhum
      código AS, só aponta para a §4

## 2. As demonstrações do RP-12

- [ ] 2.1 Demonstrar o RP-12 do AS-17, conforme a D8. A cópia `especificador-rp12.md`, com `Bash` a
      mais, vai para `.claude/agents/`. O guardião roda no modo diff. **Como se verifica:** a
      primeira invocação devolve BLOQUEADO citando AS-17 sobre a cópia. Depois de apagá-la, uma
      invocação nova não traz esse achado. O `git status --porcelain --untracked-files=all` final é
      igual ao de antes de plantar. Os dois relatórios vão literais para o `relatorio.md`
- [ ] 2.2 Demonstrar o RP-12 da regra do binário, conforme a D9. O PNG temporário em `assets/` leva
      um segredo falso num bloco tEXt. **Como se verifica:**
      - com o arquivo, a forma de contagem devolve `assets/rp12-teste.png:<n>`, com n de 1 ou mais,
        e nenhum pedaço do valor;
      - sem o arquivo, a mesma forma devolve saída vazia, com código 1;
      - o `git status` final é igual ao inicial;
      - as duas medições da D6 têm saída literal no relatório: `-a` contra o atributo `binary`, e
        `git log --all --oneline -S 'IHDR'`.

      Se `-a` não vencer o atributo, a change para e volta ao Gabriel

## 3. A auditoria de base, por blocos

Cada bloco é uma invocação nova do guardião, com levantamento, pedidos e decisão (D4). O sha da
`main` vai para o relatório antes do primeiro bloco. Bloqueante confirmado e explorável hoje em
produção para tudo (D3).

- [ ] 3.1 Bloco 1, configuração de agente e governança. O guardião audita contra AS-17 o
      `CLAUDE.md`, os 7 agentes, as 6 skills, `openspec/` e `docs/`. Confere também a ausência de
      `.claude/settings*.json` e `.mcp.json`, os ganchos no cabeçalho e o `.git/config` (A5).
      **Como se verifica:** o relatório do bloco dá o estado de AS-01, AS-09 e AS-17, e o número de
      arquivos do bloco bate com o da 1.1
- [ ] 3.2 Bloco 2, dependências. O guardião classifica os 34 avisos conforme a D7 e confere o
      `corepack`. **Como se verifica:** a tabela tem 34 linhas, uma por aviso, e nenhuma coluna
      vazia. A soma por severidade bate com o `npm audit --audit-level=high` do dia, com a saída
      literal e o código de saída
- [ ] 3.3 Bloco 3, banco. O guardião audita as 13 migrações, as políticas e concessões das 13
      tabelas, `supabase/verificacoes/`, `tests/politicas/` e `src/lib/supabase/servidor.ts`.
      **Como se verifica:** o relatório diz, para cada uma das 13 tabelas, se tem RLS, quais
      concessões tem e o teste que bloqueia e o que permite, ou a falta deles
- [ ] 3.4 Bloco 4, código do site e ativos. O guardião audita:
      - `src/proxy.ts`, a rota `/vitrine` e `public/`;
      - AS-15, pela configuração e pelo `curl` em produção nas três rotas;
      - os 32 binários, com a forma de contagem;
      - o `eyJ` de `prototipo/Portal-LIACUP.html:1`.

      **Como se verifica:** o relatório dá o estado de AS-02 a AS-07 e de AS-15, com a saída
      literal de cada `curl`. Cada binário tem uma de duas coisas: contagem, ou "coberto só pela
      origem declarada"
- [ ] 3.5 Bloco 5, CI e cadeia de entrega. O guardião audita:
      - o `ci.yml`: `permissions` (I2), ações por tag, credencial do checkout e gatilhos;
      - os dois scripts que usam a chave de serviço;
      - a configuração da raiz.

      **Como se verifica:** o relatório dá o estado de AS-09, e de AS-01 e AS-10 nos 7 arquivos que
      citam a chave de serviço
- [ ] 3.6 **(Q8)** A junção, numa invocação nova, conforme a D4. Ela faz AS-01 no histórico, dá o
      estado final de AS-01 a AS-17 e monta a lista de achados ordenada por severidade. O
      guardião diz a release de cada achado, e o líder técnico propõe a change, agrupando. A lista
      vai para o `relatorio.md` e para a entrega intermediária do aceite (Q6). **Como se
      verifica:**
      - a soma dos arquivos dos cinco blocos é 297;
      - cada código, de AS-01 a AS-17, tem um único estado final;
      - todo item da lista tem as seis coisas, a release e a change;
      - nenhum item é bloqueante confirmado e explorável em produção.

## 4. Aceite, revisão do diff e validação

- [ ] 4.1 **(Q6)** Transcrever o aceite do Gabriel, conforme a D10. O aceite literal, com data, vai
      para o `relatorio.md`, e a linha de cada achado aceito vai para a §6. **Como se verifica:**
      toda linha nova da §6 aponta um aceite literal no `relatorio.md`, com código, achado, prazo e
      change. Achado não aceito aparece como "não aceito, continua bloqueando", e não na §6
- [ ] 4.2 Chamar o `revisor` e depois o guardião, no modo diff, sobre o diff desta change, cada um
      numa invocação nova. Pedir também a busca de segredo no `relatorio.md` (§5). **Como se
      verifica:**
      - o veredito do guardião não é BLOQUEADO;
      - a busca no `relatorio.md` tem saída mascarada e código de saída;
      - o `git status --porcelain --untracked-files=all` é igual antes e depois de cada um dos dois.
- [ ] 4.3 Rodar `npm run verificar` e `openspec validate --all --strict`, sem nenhum arquivo
      plantado no disco. **Como se verifica:** código de saída 0 nos dois, com a saída guardada
      para a seção 3 da entrega

## Workflow follow-up

- Rodar `openspec archive auditoria-de-base-appsec` **antes do PR**, e depois
  `openspec validate --all --strict` de novo. O resultado esperado: a spec de `equipe-de-agentes`
  com 22 requisitos, e a change em `openspec/changes/archive/`.
- Entregar o Portão 2 no modelo do `CLAUDE.md`, com o veredito do guardião e a contagem da lista
  por severidade na seção 3. A branch sugerida é `chore/auditoria-de-base-appsec`, a mensagem vai
  em arquivo, com `git commit -F`, e os documentos do gestor (Q1) entram no mesmo commit.
- A parte 6 (recomendação de CI) e a I3 vão para o briefing da `ajustar-ci-ao-novo-fluxo`, que é
  também a última change da R0 e roda a próxima auditoria de base.
- Incompleto declarado desde já: nenhum achado é corrigido nesta change. AS-15 contra a prévia não
  se mede, porque não há mudança de site.
