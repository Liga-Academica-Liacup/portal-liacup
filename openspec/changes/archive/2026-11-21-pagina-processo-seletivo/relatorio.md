# Relatório — pagina-processo-seletivo

Copie para `openspec/changes/<change>/relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** em `openspec/changes/pagina-processo-seletivo/`:
  - `proposal.md`, `design.md` e `tasks.md`;
  - `specs/pagina-processo-seletivo/spec.md`: nova, 6 requisitos e 17 cenários;
  - `specs/seo/spec.md`: nova, 5 requisitos e 13 cenários;
  - `specs/navegacao-publica/spec.md`: 1 REMOVED, 1 ADDED e 4 MODIFIED, com 26 cenários;
  - `specs/equipe-de-agentes/spec.md`: 1 ADDED, com 5 cenários.

  No total, **13 requisitos ADDED, 4 MODIFIED e 1 REMOVED, com 61 cenários**, e **15 tarefas, sem
  folga**, com o item de SEO dentro. As contagens são as de depois da emenda do Portão 1; antes
  dela eram 55 cenários.
- **Q4 (c) da `layout-e-hero`:** entrou como item herdado, na tarefa 1.2, e cabe na conta. Por isso
  não virou Qn.
- **Divisão pronta**, se uma correção acrescentar tarefa: o SEO inteiro (tarefas 2.1 a 2.3 e as
  partes de SEO da 3.2 e da 3.3) vai para a `pagina-sobre-e-equipe`.
- **Questões em aberto:** nenhuma depois do Portão 1. Abaixo, o que levei ao portão, com as minhas
  recomendações; as opções, os custos e os caracteres estão no `design.md`, "Open Questions":
  - Q1 · o texto do aviso de inscrições fechadas. Recomendo (b): "As inscrições estão fechadas.
    Acompanhe a Liga no Instagram @liacup.unb para saber quando abre o próximo processo seletivo."
    Era texto fora do documento;
  - Q2 · o estado "inscrições abertas". Recomendo (a), não fazer agora: custaria mais 3 tarefas,
    tiraria o SEO, e falta o link do edital;
  - Q3 · os títulos e sobretítulos das seções. Recomendo (a): os do protótipo, com "Cronograma"
    trocado por "Etapas";
  - Q4 · as notas de fonte nas respostas do §6. Recomendo (a), não vão ao ar;
  - Q5 · os metadados da raiz. Recomendo (a), a raiz intacta;
  - Q6 · o título da Início e as descrições. Recomendo (a), com 64 caracteres no título e
    descrições de 129 e 155, as primeiras frases do §2.0 e do §5.2;
  - Q7 · o SEO no modo não publicado. Recomendo (a), o mínimo só no publicado;
  - Q8 · o host da prévia no pedido com o segredo. Recomendo (b), o endereço de branch exato.
- **Desvios e achados:**
  - a página fica fora do menu e das colunas do rodapé, como no gabarito e na `REFERENCIA-VISUAL.md`
    §1. O briefing só diz que ela "entra na lista";
  - `publicacao-do-site`, `fundacao-e-ci` e `pagina-inicial` não mudam: os cenários continuam
    verdadeiros (D2);
  - a regra do `noindex` foi estreitada: vale só para o endereço de prévia, marcado pela Vercel. Uma
    página que se declara não indexável reprova, porque senão a regra esconderia a falha mais cara
    de SEO;
  - a tabela do interruptor no README ainda diz que a raiz publicada mostra a página em construção,
    o que é falso desde a `layout-e-hero`. A correção entrou na tarefa 1.5;
  - a numeração dos `PADROES-DE-CODIGO.md` é a do briefing: a seção 11 é a próxima livre.
- **Incompleto:**
  - os caracteres das descrições e dos títulos foram contados à mão, e não por comando;
  - não li o ADR-0006, a tag `arquivo/F03-layout-base` nem o `paginas-publicas.spec.ts` e o
    `menu-por-teclado.spec.ts` inteiros;
  - não confirmei duas coisas que a primeira execução confirma: que o `curl -H @-` e o
    `git grep -f -` leem da entrada padrão no Git Bash do Gabriel, e que a auditoria `canonical` do
    Lighthouse aceita um canonical em outro host. As duas estão como risco no `design.md`;
  - não medi o tamanho da fonte do botão de destaque no protótipo (tarefa 1.5);
  - não rodei `openspec validate`, porque não rodo comando.

### Emenda depois do Portão 1 (21/11/2026)

Aplica as decisões do Gabriel: Q1 (b), Q2 (a) a Q7 (a), Q8 (b) com o time `liacup1`, e a Q9 da
`layout-e-hero` (a). Nenhuma tarefa nova: continuam 15.

- **`docs/conteudo-institucional.md`:** uma inserção só, no §5.1, logo depois do parágrafo "Quando
  não houver processo seletivo aberto…". Entrou o aviso da Q1 (b), com a origem "decisão do Gabriel
  em 21/11, Q1 da pagina-processo-seletivo", com autorização expressa do Gabriel. Nenhuma outra
  linha mudou.
- **`proposal.md`:**
  - o item 1 traz o aviso exato, os títulos e sobretítulos da Q3 (a) e as respostas sem as notas de
    fonte (Q4 (a));
  - o item 3 tira o "salvo decisão", pela Q2 (a);
  - o item 6 traz o host da Q8 (b), e o item 7 os títulos e as descrições da Q6 (a) e o SEO só no
    publicado (Q7 (a));
  - seção nova, "Decisões do Portão 1", com a letra de cada decisão e onde ela entrou;
  - o fora de escopo diz que o estado aberto fica fora pela Q2 (a);
  - no Impact: o D13 no lugar do D10, o `lighthouserc.json` sem mudança e a linha dos dois
    documentos tocados no Portão 1.
- **`specs/pagina-processo-seletivo`:**
  - o cenário da faixa exige o aviso palavra por palavra, com a origem no §5.1, e o nome acessível
    do link com o texto visível;
  - cenário novo dos títulos e sobretítulos (Q3 (a)), no lugar da remissão à Qn;
  - o requisito do texto inclui o aviso e tira as notas de fonte, com cenário novo (Q4 (a)).
- **`specs/seo`:**
  - cenário novo com os títulos e as descrições da Q6 (a);
  - cenário novo: a raiz não publicada imprime o SEO sem reprovar (Q7 (a)).
- **`specs/equipe-de-agentes`:** o requisito passa a dizer que o host é conferido letra por letra e
  que o segredo vai pela entrada padrão. Os cenários:
  - novos: o host exato, com `liacup1` e o host desta change; o host cortado pela Vercel, com
    recusa; e a variável ausente, em que o líder técnico para e avisa;
  - a busca do valor usa a mesma extração e mantém a regra do valor vazio.
- **`design.md`:**
  - D4 e D5 com o aviso, os títulos, a Q2 (a) e a Q4 (a);
  - D8 com a regra das notas de fonte no teste;
  - D11 com a forma do Gabriel (`{ printf …; sed … | tr -d '\r\n'; printf '\n'; } | curl … -H @-`),
    o host exato, a recusa por corte, a regra da variável ausente, os fatos medidos (1 linha, 0
    aspas, 0 `\r`) e as buscas com a mesma extração;
  - D13 com as duas inserções do Portão 1;
  - o risco do `canonical`: o dev para e o líder técnico traz o caso como Qn nova;
  - as fontes do texto atualizadas;
  - Q1 a Q8 marcadas como decididas, sem apagar as opções.
- **`tasks.md`:**
  - o "Antes do apply" passa a "Já feito no Portão 1";
  - a 1.3 confere o aviso exato e os títulos;
  - a 2.2 confere os títulos de SEO;
  - a 2.3 imprime o SEO da raiz não publicada, e diz o que fazer se o `canonical` falhar;
  - a 3.1 inclui o aviso e tira as notas de fonte;
  - a 4.1 traz a forma do Gabriel, o host, a regra da variável ausente e mais um `grep`;
  - o P23 do follow-up traz o host desta change.
- **Incompleto da emenda:** nada novo. Os itens acima continuam valendo.

### Emenda do Portão 2 (21/11/2026)

Aplica as mudanças de conteúdo do Gabriel e a saída do cenário de prévia. **Continuam 15 tarefas**,
sem tarefa nova. Requisitos: 13 ADDED, 4 MODIFIED, 1 REMOVED, sem mudança. Cenários: **60** (eram
61): `pagina-processo-seletivo` 17, `seo` 12 (eram 13), `navegacao-publica` 26, `equipe-de-agentes` 5.

- **`docs/conteudo-institucional.md`**, com autorização expressa do Gabriel: §5.5 trocado pelos 5
  itens literais, no formato `<nome> · <caráter>`, com a fonte "decisão do Gabriel, 21/11/2026"; no
  §5.3 e no §5.4, acima do texto do edital, `#### Texto da página` com os textos literais e a
  origem; **inserido também** `#### Texto do edital, mantido como fonte` antes do texto do edital,
  para ele não cair dentro da subseção nova; §8, uma linha com o "produto" e o "no portal" (R3).
  Os títulos `###` do §5.3 e do §5.4 ficaram como estavam, com a nota do edital.
- **Specs:** `pagina-processo-seletivo` com 5 etapas nos cenários "As etapas", "A página confere
  com o documento" e "O lugar dos dados é conferido"; "Quem pode se inscrever" e o requisito do
  texto citam a "Texto da página". `seo` sem o cenário de prévia, sem a frase do requisito que o
  sustentava, e com a `lancamento-r1` no Purpose.
- **`design.md`:** D4, D5, D8 e D9, as fontes do texto, o D13 e "Q10 a Q16" com decisão e data.
- **`tasks.md`:** 1.1 (`etapas: 5`), 1.3, 3.1 e 5.1 com a linha "rodada do Portão 2".
- **`proposal.md`:** item 1, o critério do `noindex`, "Emenda do Portão 2", fora de escopo e Impact.
- **Correção do Gabriel no item 2:** o `conteudo-institucional.md` §5.3 "Texto da página" passou a
  ser a lista dos 4 itens literais (o item 3 com a nota "_(Edital, item 2.2)_"), e a do §5.4 virou
  remissão a ela; na spec, 4 cenários e o texto de 1 requisito (mesmas contagens; "As notas de
  fonte" passou a cobrir também os itens); D4, D5, D8, D13 e fontes; as tarefas 1.1
  (`quem pode se inscrever: 4`), 1.3 e 3.1; o item 1 e a emenda da proposta. Ainda 15 tarefas.
- **Desvios:** a Q10, a Q11 e a Q12 foram postas na 1.3, junto da rodada do dev, embora a Q10 mexa
  na marca, da 1.5. Os checkboxes de 1.1, 1.3, 3.1 e 5.1 continuam marcados: desmarcar é do líder
  técnico.
- **Achados para o líder técnico, sem mudar nada:**
  - o `conteudo-institucional.md` §5.1 diz "Etapas · Formulário e entrevista" e "Pré-requisitos ·
    Três itens do Edital, item 2", e o placar do §8 diz "de 14 itens", agora 15. Não mudei, porque
    "nenhuma outra linha muda";
  - a `REFERENCIA-VISUAL.md` §6 ainda diz "O edital tem duas etapas (formulário e entrevista
    online)", e "Integração" vira etapa enquanto "Aula de integração" segue proibida na spec.
- **Incompleto:**
  - as opções e os custos da Q10 a Q16 **não estão no repositório**: registrei a letra, a data e o
    assunto pelo encaminhamento do relatório. O assunto da **Q16 não consegui identificar**;
  - não rodei `openspec validate`, porque não rodo comando.

## P23 e Q9 da `layout-e-hero` (pedido do briefing)

Registro do que ficou fora do relatório arquivado da `layout-e-hero`, com o que se sabe pelo
briefing desta change.

- **P23 da `layout-e-hero`:** `curl -q -sS -I --max-time 20 --proto =https '<prévia da change>/'`
  (AS-15). Rodou depois do PR e bateu no login da Vercel. Mirou o deployment de produção, que tem o
  interruptor desligado, e não a prévia da branch. AS-15 ficou **não verificado** naquela change.
- **Q9 da `layout-e-hero`:** decisão do Gabriel sobre o AS-15 não verificado lá. Foi decidida
  (a), e o texto literal está transcrito na seção "Decisões do Gabriel no Portão 1".
- **Nesta change:** o P23 passa a rodar na prévia da branch, com o cabeçalho de bypass, no host
  `portal-liacup-git-feat-pagina-processo-seletivo-liacup1.vercel.app` (`design.md`, D11, e Q8
  (b)). A saída vai para a seção do `guardiao-appsec` desta change, depois de a Vercel gerar a
  prévia.

## Decisões do Gabriel no Portão 1

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel de 21/11/2026. A
numeração Q1 a Q8 é a do Portão 1 desta change; a Q9 é a da `layout-e-hero`.

**Veredito, literal:** "Portão 1 da pagina-processo-seletivo: aprovado. Registre cada decisão no
relatorio.md com o texto literal."

**Q1 a Q8, literal:**

> Q1 (b): "As inscrições estão fechadas. Acompanhe a Liga no Instagram @liacup.unb para saber quando abre o próximo processo seletivo."
> Q2 (a). Q3 (a). Q4 (a). Q5 (a). Q6 (a). Q7 (a).
> Q8 (b). O slug do time é liacup1. Host esperado nesta change: portal-liacup-git-feat-pagina-processo-seletivo-liacup1.vercel.app (55 caracteres antes de .vercel.app). A conferência compara letra por letra. Se a Vercel cortar o rótulo (acima de 63), a conferência recusa, o P23 para e você me pede o host exato daquela change.

**Q9 da `layout-e-hero`, literal:**

> Q9 da layout-e-hero, decisão (a), texto literal: "Q9: fique com a (a). O AS-15 fica registrado como não verificado na layout-e-hero. A correção entra na próxima change, para o teste de prévia não falhar de novo nas changes seguintes."

**Ajustes, literal:**

> Ajustes, sem tarefa nova (o total continua 15):
> 1. O texto da Q1 entra no docs/conteudo-institucional.md pelo especificador, nesta change, no §5.1, logo depois do parágrafo "Quando não houver processo seletivo aberto", com a origem "decisão do Gabriel em 21/11, Q1 da pagina-processo-seletivo". Não é emenda do gestor.
> 2. A forma do P23 na lista fechada do SEGURANCA.md lê só a linha do segredo, tira o \r do fim (o .env é do Windows), manda o cabeçalho pela entrada padrão e não usa -v. Algo nesta linha:
>    { printf 'x-vercel-protection-bypass: '; sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n'; printf '\n'; } | curl -q -sS -I --max-time 20 --proto =https -H @- "https://<host>/"
>    Se a variável não existir no .env, pare e diga. Não procure o segredo em outro lugar.
> 3. Se a auditoria canonical do Lighthouse falhar por medir liacup.com.br em localhost, pare e traga como Qn. Não desligue a auditoria sem decisão.

**Feito pelo líder técnico no Portão 1:**

- `docs/REFERENCIA-VISUAL.md` §7: linha nova com os títulos e sobretítulos da Q3 (a).
- Conferido, só por contagem e sem ler o valor: o `.env` tem 1 linha que começa com
  `VERCEL_AUTOMATION_BYPASS_SECRET=`, 0 com aspas no começo do valor e 0 com `\r`; o `.env` está no
  `.gitignore` (linha 10). O host da Q8 tem 55 caracteres antes de `.vercel.app` (`wc -c`).
- Conferido: o `git grep -c -a -F -f - HEAD` lê o padrão da entrada padrão no Git Bash (git
  2.45.1): padrão inexistente deu código 1 com saída vazia; `Secretaria` deu
  `HEAD:docs/conteudo-institucional.md:5`, código 0. O `curl` é o 8.7.1, que aceita `-H @-`.

## Decisões do Gabriel no Portão 2 (primeira passagem, antes do archive)

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel de 21/11/2026. A
numeração continua a da change (Q10 a Q16).

> Decisões do Gabriel no Portão 2 (registre literal no relatorio.md):
> Q10 (a). Q11 (a). Q12 (a). Q13 (b). Q14 (a). Q16 (b).
> Q15: adiada. Os prints mudam com o conteúdo abaixo; traga de novo depois da rodada.
> Autorizo a terceira rodada do dev-frontend, só com o que está aqui. Se ainda sobrar diferença depois dela, vira Qn, sem quarta rodada.
>
> Mudanças de conteúdo, decididas pelo Gabriel em 21/11. O especificador emenda primeiro o conteudo-institucional, as specs e o tasks.md, sem tarefa nova; se a emenda passar de 15 tarefas ou pedir algo além disto, pare e mostre antes do código.
>
> 1. §5.5 Etapas, com a fonte "decisão do Gabriel, 21/11/2026" no lugar de "(Edital, item 4.2)", em 5 itens:
>    1. Inscrição por formulário · etapa eliminatória.
>    2. Análise do produto · etapa eliminatória.
>    3. Entrevista online via Meet · etapa classificatória, para os convocados.
>    4. Resultado · divulgação no Instagram da Liga.
>    5. Integração · encontro de boas-vindas.
>    Anote no §8 (pendências) que falta a liga descrever o "produto" em uma linha, e que "no portal" entra no item 4 quando o painel publicar resultados (R3). O teste passa a exigir 5 etapas.
> 2. §5.3 e §5.4: o texto do edital fica no documento como fonte. Acima dele, uma subseção "Texto da página", que é o que vai ao ar e o que o teste palavra por palavra confere:
>    - Quem pode se inscrever: "Estudantes de graduação da UnB a partir do segundo semestre, dos cursos da FCTS, da Faculdade de Saúde, da Faculdade de Medicina, de Direito, Psicologia e Serviço Social. Outros cursos passam por análise da coordenação."
>    - Pré-requisitos: "Matrícula ativa na UnB, em um dos cursos aceitos." · "10 horas por semana para as atividades da Liga." · "Afinidade e interesse por cuidados paliativos."
>    O guardiao-visual compara com o processo-seletivo-390.png e o -1280.png e diz se o quadro ficou na medida do gabarito.
> 3. Edital como arquivo: fora desta change. Acrescente na R3 do docs/PLANO-DE-DESENVOLVIMENTO.md uma linha: upload do PDF do edital pelo painel, com "Baixar o edital" baixando esse arquivo; só PDF conferido pelo conteúdo, limite de tamanho, escrita só para a diretoria, download como anexo com nome gerado pelo sistema; entra no escopo da seguranca-do-painel.
>
> Outros pontos:
> - Agente não roda comando de escrita no Git, nem git rm nem git restore --staged. Repita a regra a cada subagente nesta sessão e registre o caso da rodada 1 no relatório como achado para a endurecer-agentes-e-git-local.
> - O cenário "Endereço de prévia marcado pela hospedagem" da spec seo: ou o P23 na prévia o cobre, com evidência, ou ele sai desta change para a lancamento-r1. Diga qual.
> - O caminho dos prints na §7 só é fixado no archive, com a data real.
> - Depois da rodada: revisor e guardiao-appsec em invocação nova, o guardião com o checklist inteiro, e o P23 na prévia da branch. Volte com o Portão 2 de novo, com a Q15 e os prints novos.

**Correção do Gabriel no item 2, literal** (mesma data, durante a terceira rodada; o líder técnico
parou o `revisor` e o `guardiao-appsec`, que estavam rodando sobre o cartão antigo, para rodarem de
novo depois desta correção):

> Correção do Gabriel no item 2 do bloco anterior, dentro da mesma terceira rodada (vale também se o dev já tiver feito o cartão):
>
> O cartão "Quem pode se inscrever" passa a ter 4 itens, como o gabarito, sem parágrafo antes. Substitua a subseção "Texto da página" do conteudo-institucional e o dado da página por:
> - Estar matriculado em curso de graduação da UnB, a partir do 2º semestre.
> - Disponibilidade média de 10 horas semanais para as atividades da Liga.
> - Faltas não justificadas acima de 50% levam ao desligamento da Liga.
> - Afinidade e interesse pela temática dos cuidados paliativos.
>
> O item dos 50% vem do Edital, item 2.2, e não da linha "frequência mínima para certificação" do protótipo, que não tem fonte. O teste passa a exigir 4 itens no cartão e nenhum parágrafo. O resto do bloco anterior fica como está.

**Achado para a `endurecer-agentes-e-git-local`** (pedido do Gabriel): na rodada 1 desta change,
o `dev-frontend` rodou `git rm` nos dois arquivos de aparência de botão e desfez com `git restore
--staged` nesses dois caminhos. O índice voltou ao de antes (`git diff --cached --name-only` vazio,
conferido pelo líder técnico), mas agente não roda comando de escrita no Git. Hoje a regra é só
instrução: a lista de `tools` do `dev-frontend` dá terminal sem restringir o `git`. Critério para a
change: uma barreira que recuse `git` de escrita a subagente (permissão negada ou gancho), vista
recusando um `git rm`.

**Cenário "Endereço de prévia marcado pela hospedagem" (spec `seo`):** sai desta change para a
`lancamento-r1`. O P23 mede cabeçalhos com `curl -I`, não roda o Lighthouse na prévia, e por isso
não cobre o cenário, que é sobre a nota de SEO medida num endereço com `noindex`.

## Decisões do Gabriel no Portão 2 (segunda passagem, antes do archive)

Registradas pelo líder técnico, com o texto literal da mensagem do Gabriel de 21/11/2026.

> Decisões do Gabriel (registre literal no relatorio.md):
> Q15 (a). Q18 (a). Q20 (a), com o role="list" como primeiro item da pagina-sobre-e-equipe.
> Q17: nem (a), nem (b), nem (c). O AGENTS.md foi posto no .git/info/exclude pelo Gabriel: fica fora do Git sem mexer no .gitignore. A endurecer-agentes-e-git-local decide a barreira versionada e o põe na lista do AS-17. Registre como achado para ela.
> Q19 (a), com duas mudanças:
> - Sem quarta invocação do revisor. O guardiao-appsec confere só a §5 do SEGURANCA.md e o D11; o gestor confere o resto pelo diff.
> - Autorizo a correção da tabela do §5.1 e do placar do §8 do conteudo-institucional.md.
> Junto com a Q19, só texto: a linha de cada etapa começa com maiúscula, como no gabarito ("Etapa eliminatória.", "Etapa classificatória, para os convocados.", "Divulgação no Instagram da Liga.", "Encontro de boas-vindas."), no §5.5 do conteudo-institucional e no conteudo.ts. Rode npm test e npx playwright test e refaça por script os lados a lados afetados, sem nova passagem do guardiao-visual.
> Selo "Inscrições fechadas": fica verde, como o gabarito. A pergunta sobre a cor vai para a homologacao-r1; registre como pendência.
>
> Depois: o P23 na prévia da branch, assim que o Gabriel confirmar o host no painel da Vercel, e o archive. Volte com o Portão 2 final e os comandos Git do archive.

**Achado para a `endurecer-agentes-e-git-local`** (Q17, pedido do Gabriel): o `next dev` escreve
um `AGENTS.md` na raiz, com instruções dirigidas a agentes de IA (mandam ler
`node_modules/next/dist/docs/` antes de escrever código e induzem o commit), e o recria a cada
execução. O Gabriel o pôs no `.git/info/exclude` desta máquina, que não é versionado (LB-05). A
change decide a barreira versionada, que vale em qualquer clone, e põe o `AGENTS.md` (e arquivos de
instrução a agentes do mesmo tipo) na lista do AS-17. Critério do guardião (F2, rodada 3):
`git ls-files -- 'AGENTS.md'` vazio, e `git status --porcelain` sem ele depois de um `next dev`.

**Pendências registradas:**

- **Q20 (a), para a `pagina-sobre-e-equipe`, como primeiro item:** `role="list"` nas listas sem
  marcador (`Etapas` e `QuemPodeSeInscrever`), para o VoiceOver anunciá-las como lista; e nomes
  distintos para as duas constantes `NOME_DA_LIGA` (`Cabecalho.tsx` e `paginas-publicas.ts`) e para
  o tipo e o componente `TituloDeSecao`.
- **Para a `homologacao-r1`:** a cor do selo "Inscrições fechadas". Ele fica verde, como o selo do
  gabarito; a pergunta é se o verde lê como "aberto" para quem chega.

## dev-frontend

Tarefas 1.1 a 1.5, 2.2 e 2.3. Checkboxes do `tasks.md` não marcados (o líder técnico marca).

- **Arquivos (A 20 · M 18 · D 3; o hook vira R 1 depois do commit):**
  - novos: `src/features/processo-seletivo/` (`tipos.ts`, `conteudo.ts`, `regras.ts`,
    `conteudo.test.ts`, `componentes/` com `FaixaDoTopo`, `Etapas`, `QuemPodeSeInscrever`,
    `PerguntasFrequentes` e `TituloDeSecao`, cada um com o seu CSS); a rota
    `src/app/(site)/(publicas)/processo-seletivo/` (`page.tsx`, `page.module.css`);
    `src/componentes/ui/aparencia-de-botao.ts`; `src/lib/utils/metadados.{ts,test.ts}`;
  - alterados: `Botao.{tsx,module.css,test.tsx}`; `Cabecalho.{tsx,module.css}`,
    `MenuLateral.{tsx,module.css}`, `RodapePublico.{tsx,module.css}`; `HeroDaInicial.tsx` (só o
    import); `(publicas)/page.tsx` (só os metadados); `paginas-publicas.{json,ts,test.ts}`;
    `tokens.css`; `scripts/medir-desempenho.mjs`; `README.md`; esta seção;
  - apagados: `layout/aparencia-de-botao.ts`, `layout/AparenciaDeBotao.module.css` e
    `layout/usePainelDeNavegacao.ts` (renomeado para `use-painel-de-navegacao.ts`). Fora do índice
    do Git, porque não toco no Git: o `git ls-files` só zera depois do commit do Gabriel.
- **Tokens novos: 32**, todos acrescentados (`git diff src/estilos/tokens.css`: 60 linhas
  acrescentadas, 0 removidas), com a origem na linha: 30 medidos no protótipo aberto no Chromium
  (faixa, seções, linha do tempo, quadro, perguntas, `.t-h2` até 768 e 480 px) e 2 com outra origem
  nomeada: `--color-fundo-pressionado-sobre-escuro` (o `--color-fundo-pressionado` com a cor clara)
  e `--tamanho-so-para-leitor-de-tela` (1 px, WCAG C7).
- **Por tarefa:**

  | Tarefa | Verificação | Código | Contadores |
  | --- | --- | --- | --- |
  | 1.1 | `npm test` | 0 | 12 arquivos, 99 testes · `etapas: 2 · pré-requisitos: 3 · perguntas: 8` · 24 de 24 trechos do `conteudo.ts` achados no `conteudo-institucional.md` (teste temporário, apagado) |
  | 1.2 | `npm test` · `lint` · `verificar:tokens` · `/vitrine` na 3000 | 0 · 0 · 0 · 200 | 103 testes (4 casos novos "botão e link têm as mesmas classes") · `aparencia` em `src/componentes/layout`: 0 no disco, 2 no `git ls-files` até o commit |
  | 1.3 | `curl` na 3000 e na 3001 · `wc -l` | — | `/processo-seletivo` 200, 1 `<h1>` "Processo seletivo"; aviso igual ao §5.1 (`true`); link com `target="_blank"` e `rel="noopener noreferrer"`; "Cronograma", "Fazer inscrição", "Baixar o edital", "desempate", "2026.2", "28/08": 0 cada; raiz com "Processo seletivo" e "Quero participar", "Conheça a Liga" 0; 3001: `307 http://localhost:3001/`; `.tsx` novos de 31 a 57 linhas |
  | 1.4 | `curl` · Playwright · `verificar:tokens` | — · — · 0 | 8 `<details>`, 0 com `open`; em 390 px, **por script, não à mão**: 8 de 8 abrem no Enter, fecham no Espaço sem rolar, abrem e fecham no toque, mudam `expanded` na árvore de acessibilidade do Chromium (papel `DisclosureTriangle`) e medem ≥ 44 px (62 a 82,5); Tab alcança 8 de 8, 8 com anel de foco |
  | 1.5 | `curl` · `grep` · `lint` · `formatar:check` | — · — · 0 · 0 | marca sem `aria-label`, nome "LIACUP Liga Acadêmica Multiprofissional de Cuidados Paliativos · UnB, página inicial" em 1280 e "LIACUP, página inicial" até 1024; `font-size-h6` no `Cabecalho.module.css`: 0; rodapé em `/`: "Início" com `aria-current` e sublinhado; em `/processo-seletivo`: o destaque do cabeçalho com `aria-current` e sublinhado, "Início" sem |
  | 2.2 | `npm test` · `curl` · `diff` · `git diff --exit-code` | 0 · — · 0 · 0 | `Entradas … conferidas: 2` · `Caracteres de cada descrição: "/" 129 · "/processo-seletivo" 155` · `Páginas com metadados conferidos: 2 de 2`; títulos, descrição, canônico e `og:*` no `<head>` das duas; metadados do `<head>` da raiz da 3001 iguais aos gravados antes da primeira mudança; layout raiz e `em-construcao` sem diferença |
  | 2.3 | `npm run build && npm run test:desempenho` | 0 | publicado: `páginas medidas: 2 de 2 pedidas`, desempenho 99 a 100, acessibilidade 100 e SEO 100 nas 6 execuções (rodada final, depois da correção do link) · não publicado: `1 de 1`, 100/100 e SEO 92 impresso sem reprovar (falha só `robots-txt`, o caso previsto na Q7) · `canonical` com score 1 nas duas publicadas (coleta avulsa) · `git diff --exit-code lighthouserc.json .github/`: 0 |

- **Medida do botão de destaque no protótipo, em 390 px:** `.hdr-cta` com **12,5 px**, `padding`
  10 px 12 px, 133 × 44 px, só até 480 px; de 481 a 1024 px é o `.btn`, 14 px. Pela regra do D12
  (não é 13 px), usei `--font-size-controle` (14 px) até 1024 px: em 360 px o botão mede 148 × 44,
  sem rolagem horizontal e com o cabeçalho em 61,6 px.
- **Nomes acessíveis (rótulos meus, sem texto institucional novo):** o link do aviso reusa o do
  rodapé, "Instagram da LIACUP, @liacup.unb (abre em nova aba)"; a marca termina em ", página
  inicial", só para leitor de tela, como o `aria-label` antigo.
- **Conferido de passagem, por script, nas 7 larguras:** rolagem horizontal 0 nas duas páginas, com
  as perguntas fechadas e abertas; axe 0 nas duas, com as perguntas fechadas e abertas; link do aviso
  100 × 44 px; menu lateral em 390 px leva a `/processo-seletivo` e fecha.
- **Comandos finais:** `verificar` 0 (365 rastreados, 0 artefatos; tokens: 97 arquivos, 0
  problemas; chave: 476 arquivos, 0 ocorrências) · `npm test` 0, 13 arquivos, 113 de 113 ·
  `npx playwright test` 0, 245 de 245, com `páginas verificadas: 2 de 2` nas 7 larguras · 22 dependências diretas · `git diff --exit-code` em `proxy.ts`, layout
  raiz, `em-construcao`, `PaginaEmConstrucao*`, `Rodape*`, `LinksDeContato*`, `lighthouserc.json`,
  `playwright.config.ts`, `.github/`, `package*.json`, `tests/` e vitrine: 0.
- **Correção depois da primeira rodada do e2e:** o `npx playwright test` saiu com código 1, 238
  passaram e 7 falharam, o mesmo defeito nas 7 larguras: o link do aviso media 99,92 × 43,98 px
  (subpixel). Acrescentei `min-height: var(--alvo-de-toque)` ao link; o spec voltou a 84 de 84 e a
  suíte a 245 de 245. Defeito meu, achado pelo e2e do qa, e não pela minha conferência, que
  arredondava para 44,0.
- **Desvios:**
  - rodei `git rm` nos dois arquivos de aparência e desfiz na hora com `git restore --staged` nos
    mesmos dois caminhos: o índice voltou ao que era, e a remoção ficou só no disco. Daí em diante,
    só Git de leitura;
  - o canônico da Início sai `https://liacup.com.br`, sem a barra: é o Next que normaliza; a URL é
    a mesma de `https://liacup.com.br/`;
  - o D7 diz que a vitrine mostra também o link com aparência de botão; a vitrine não quebrou, e
    pela instrução de escopo não mexi nela.
- **Melhorias de UI ou UX propostas (para o Gabriel aprovar no lado a lado):**
  - botão de destaque no celular em 12,5 px até 480 px, como o `.hdr-cta` do protótipo, com um token
    novo: hoje sai 14 px, 15 px mais largo;
  - o aviso de inscrições fechadas com algum destaque próprio (hoje tem a mesma letra da
    apresentação), porque é a mensagem que quem chega procura;
  - hover e pressionado nas variantes `fantasma` e `icone` do `Botao`, que ainda não têm (o D7 só
    pediu as do link);
  - o README diz "20 dependencias diretas"; são 22.
- **Incompleto:**
  - a conferência de Enter, Espaço, toque e Tab em 390 px **não foi à mão**: foi por script
    Playwright temporário, fora de `tests/`, no scratchpad, que não fica no repositório;
  - leitor de tela real não testado: o estado expandido foi lido na árvore de acessibilidade do
    Chromium;
  - os specs de `tests/e2e/` não foram ajustados (são do qa, tarefas 3.x).

### Rodada 2 (correção: revisor 2, 3, 4 e 6; guardião F-04; observação do qa)

- **Arquivos (só M, nenhum novo):** `paginas-publicas.{ts,test.ts}`, `scripts/medir-desempenho.mjs`,
  `Botao.module.css`, `Cabecalho.{tsx,module.css}`, `tokens.css` (+3 tokens; o
  `--tamanho-so-para-leitor-de-tela` da rodada 1, que não está na `main`, virou
  `--font-size-so-para-leitor-de-tela`; `git diff --numstat`: 78 acrescentadas, 0 removidas). JSON
  igual ao de antes (`sha256sum -c` OK). `git status --porcelain`: as mesmas 59 linhas de antes.
  Nenhum Git de escrita; índice vazio.
- **Por item:**
  1. teste novo lê o `conteudo-institucional.md`: cada descrição é trecho literal, a da `/` é a
     primeira frase da primeira citação do §2.0 e a da `/processo-seletivo` a do §5.2. Imprime
     `Descrições achadas no conteudo-institucional.md: 2 de 2`. **Vermelho** ("segundo" trocado por
     "terceiro" no JSON): código 1, `1 de 2`, `"/processo-seletivo": "… a partir do terceiro
     semestre."`. **Verde** (JSON copiado de volta, `sha256sum` OK): código 0, 18 de 18.
  2. `FORMATO_DO_ENDERECO = /^\/$|^(\/[a-z0-9-]+)+$/`; fora dele: `endereço "<e>" fora do formato:
     só "/" ou partes de letras minúsculas, números e hífen, cada uma depois de uma "/", sem acento`.
     Teste escrito antes: **vermelho**, `"//exemplo.com": []`, `"/Processo_Seletivo": []` (e
     `/sobre/`, `/notícias`, `/a//b`), 1 falha de 17; **verde** depois da regra, 17 de 17. Endereço
     sem "/" no começo continua com a mensagem antiga, só ela.
  3. `SEO_MINIMO = 0.95`, comparado com a nota do Lighthouse sem arredondar; `Math.round` só na
     impressão. Chamada isolada das linhas do script, no scratchpad: `SEO 0.945: impresso 95 ·
     reprova agora: true · reprovava antes: false` (0,949 igual; 0,95 e 1 passam; sem nota
     reprova). Execução reprovada imprime também a nota crua, para "SEO 95" não aparecer ao lado de
     "abaixo de 95".
  4. `fantasma` e `icone`: hover em `@media (hover: hover)` e pressionado, `:not(:disabled)`, com
     `--color-fundo-hover-fantasma` (10%) e `--color-fundo-pressionado-fantasma` (18%) da cor de
     destaque, origem `.btn-ghost:hover` e `:active` do protótipo. Texto 6,22:1 e 5,70:1 sobre
     `--color-bg`. Vitrine 200, por script: hover 0,10, pressionado 0,18, foco pelo Tab com o anel
     sólido de 2 px e fundo transparente, nas duas variantes.
  5. `.linha .destaque`, como o `.menu .destaque`; o `font-size` do celular saiu (igual ao do
     `.botao`). Antes e depois: **148,45 × 44** em 360, 390 e 1024 e **153,73 × 44** em 1280.
  6. o ", página inicial" saiu de bloco à parte (`position: absolute`, que o navegador separa com
     espaço) e entrou em linha no último texto visível: um na sigla, só até 1024 px, e um no nome da
     liga. Letra 0 (token novo), `letter-spacing: normal`, sem quebra. Chromium e Playwright:
     "LIACUP, página inicial" até 1024 e "… · UnB, página inicial" acima. Geometria visível
     (cabeçalho, logo, sigla, nome, destaque, menu) igual com e sem o trecho: 14 de 14.
- **Verificações finais:** `npm test` 0, 13 arquivos, 116 de 116 · `npm run verificar` 0 (365
  rastreados, 0 artefatos; tokens: 97 arquivos; chave: 476 arquivos, 0 ocorrências) ·
  `npx playwright test` 0, 308 passaram, 0 falharam · `npm run build && npm run test:desempenho` 0:
  publicado `2 de 2`, 100/100/SEO 100 nas 6 execuções; não publicado `1 de 1`, 100/100, SEO 92 só
  impresso. Servidores derrubados (portas 3000 e 3001 livres).
- **Desvio:** a vitrine não mudou (D13). O `.env.example`, `docs/` e `tests/e2e/` não foram tocados.
- **Incompleto:** leitor de tela real não testado; o nome foi lido no Chromium (CDP) e no
  Playwright. Letra de tamanho 0 no Safari com VoiceOver **não medida** (só há Chromium instalado).

### Rodada 3 (Portão 2)

Só os itens autorizados (Q10 (a), Q11 (a), Q12 (a), Q13 (b), Q16 (b) e o conteúdo emendado). Nenhum
Git de escrita. `tests/e2e/`, `docs/` e README não tocados.

- **Arquivos (só M):** `conteudo.ts`, `conteudo.test.ts`, `regras.ts`, `Etapas.{tsx,module.css}`,
  `QuemPodeSeInscrever.{tsx,module.css}`, `PerguntasFrequentes.tsx`, `Cabecalho.{tsx,module.css}`,
  `vitrine/BotaoDemo.tsx`, `tokens.css` (`git diff --numstat main`: 88 acrescentadas, 0 removidas).
- **Por item:**
  1. **Conteúdo:** as 5 etapas do §5.5 (nome · caráter, palavra por palavra), o "Texto da página"
     do §5.3 e os 3 do §5.4. `NUMERO_DE_ETAPAS = 5`. Lidos na página (390, 360, 1280): 5
     marcadores, os 5 textos, o parágrafo e os 3 itens iguais ao documento; rolagem 0.
  2. **Q10:** a caixa de 1 px com `position: absolute` só no ", página inicial" **põe o espaço**
     (medido: "LIACUP , página inicial"); `inline-block` de 1 px também, e ainda quebra a sigla em 360
     (19,55 para 39,09 px de altura). O que dá as duas coisas: o **nome inteiro** na caixa de 1 px
     (C7), um trecho por lado do ponto de troca, e o texto da tela com `aria-hidden`, desenhado
     pelas mesmas constantes. Chromium (CDP): "LIACUP, página inicial" de 360 a 1024 e "LIACUP Liga
     Acadêmica Multiprofissional de Cuidados Paliativos · UnB, página inicial" em 1025 e 1280, nas
     duas páginas. Marca e anel de foco iguais aos da rodada 2: 121,13 × 44 (até 1024) e 391,17 × 46
     (acima). Token `--font-size-so-para-leitor-de-tela` (só da branch) trocado por
     `--tamanho-so-para-leitor-de-tela: 1px`, origem "WCAG C7, a caixa de 1 px".
  3. **Q11:** `--espaco-abaixo-do-nome-da-etapa: 2px` (protótipo: `margin: 0 0 2px` do título do
     item) e `--espaco-vertical-do-item-da-lista: 11px` (protótipo: `padding: 11px 0` do item);
     nenhum degrau nem soma de dois a 2 px. Outros meios degraus nos CSS da change: nenhum (os
     `/ 2` restantes centram bolinha ou alvo, não são degrau).
  4. **Q13:** vitrine com o link com aparência de botão em 3 variantes, em repouso e página atual;
     comentário diz o que está parado e o que só aparece com a mão. Medido em 390: 6 links, 44 px
     de altura; hover, pressionado e sublinhado com `aria-current` iguais aos do botão.
  5. **Q16:** `--font-size-controle-celular: 12.5px` (protótipo: `.hdr-cta` até 480 px); padding nos
     degraus. **Antes → depois**, 360: 148,45 × 44 → 135,58 × 44 (a sigla deixa de ser apertada,
     61,58 → 67,94 px); 390: 148,45 × 44 → 135,58 × 44 (gabarito 133 × 44). Cabeçalho 61,59 px,
     rolagem 0. De 481 px para cima, igual (148,45 e 153,73).
  6. **Q12:** comentário em `Etapas.tsx` e `PerguntasFrequentes.tsx`.
- **Verificações:** `npm test` 0 · 13 arquivos, 116 de 116 · `etapas: 5 · pré-requisitos: 3 ·
  perguntas: 8` — `npm run verificar` 0 · 392 rastreados, 0 artefatos; tokens 97 arquivos, 0
  problemas; chave 526 arquivos, 0 ocorrências — `npm run build && npm run test:desempenho` 0 ·
  publicado `2 de 2`, 100/100/SEO 100 nas 6; não publicado `1 de 1`, 100/100, SEO 92 só impresso —
  `npx playwright test` **1**, nenhum teste rodou: `processo-seletivo.spec.ts` falha ao carregar,
  `Error: §5.4 com 6 itens, e não 3` (linha 134; o §5.4 tem agora o texto da página e o do edital),
  e a linha 135 espera 2 etapas no formato antigo. É o texto novo, que o qa ajusta. Sem esse arquivo
  (os outros 5 specs): código 0, **280 passaram, 0 falharam**. Servidores derrubados.
- **Desvio:** a Q10 não ficou como "o trecho ', página inicial'" na caixa: a caixa leva o nome
  inteiro, e o texto da tela sai da árvore de acessibilidade. O D12 diz "o nome vem do texto
  visível"; agora vem de uma cópia dele, feita das mesmas constantes. Se o Gabriel não aceitar,
  vira Qn: (a) esta; (b) a letra 0 da rodada 2; (c) a caixa só no trecho, com o espaço.
- **Fora do escopo:** o `next dev` que subi para medir criou `AGENTS.md` na raiz (não rastreado,
  19:21:42). Tentei apagar e a permissão foi negada; fica para o líder técnico.
- **Incompleto:** leitor de tela real não testado (nome lido no Chromium, por CDP). Os e2e do
  `processo-seletivo.spec.ts` não rodaram.

### Rodada 3, correção do cartão

- **O que mudou:** o dado `quemPodeSeInscrever` passou a ser a lista dos 4 itens do §5.3 "Texto da
  página", literais, sem a nota "_(Edital, item 2.2)_" do item 3. O parágrafo e o campo
  `preRequisitos` saíram. A regra acusa número de itens diferente de 4
  (`NUMERO_DE_ITENS_DE_QUEM_PODE_SE_INSCREVER`), item vazio e item com nota de fonte no fim (a
  expressão aceita agora o `_` do itálico). O `QuemPodeSeInscrever` ficou só com a lista: o `<ul>`
  é o próprio quadro; saíram `.texto` e `.lista`, sem token novo.
- **Arquivos (M):** `tipos.ts`, `conteudo.ts`, `regras.ts`, `conteudo.test.ts`,
  `QuemPodeSeInscrever.{tsx,module.css}`, `processo-seletivo/page.tsx` (só as props).
- **Medida do quadro (produção, `next start`; o gabarito medido no protótipo aberto no Chromium):**

  | Largura | Gabarito | Gabarito com os 4 textos novos | Portal |
  | --- | --- | --- | --- |
  | 1280 | x 668 · 472 × 336 | 472 × 336 | x 668 · 472 × 326,8 |
  | 390 | 354 × 384 | 354 × 360 | 354,8 × 350,0 |

  As quebras de linha são as mesmas do gabarito com os textos novos (em 390: 3, 2, 2 e 2 linhas). A
  bolinha está a 30 px da borda e o texto a 66 px, como no gabarito; a bolinha começa 18,1 px abaixo
  do topo do item, contra 19. A diferença de altura (9,2 px em 1280 e 10 px em 390) vem de duas
  medidas que já existiam: o padding vertical de 26,4 px (`--space-6`) contra 28, e a linha de
  23,25 px (`--line-height-body` 1,55) contra 24. Não mexi nelas.
- **Verificações:** `npm test` 0 · 13 arquivos, 118 de 118 · `etapas: 5 · quem pode se
  inscrever: 4 · perguntas: 8` — `npm run verificar` 0 · 392 rastreados, 0 artefatos; tokens 97
  arquivos, 0 problemas; chave 526 arquivos, 0 ocorrências — `npm run build && npm run
  test:desempenho` 0 · publicado `2 de 2`, 100/100/SEO 100 nas 6; não publicado `1 de 1`, 100/100,
  SEO 92 só impresso — `npx playwright test` **1**, nenhum teste rodou: o `processo-seletivo.spec.ts`
  (já alterado pelo qa) falha ao carregar, `Error: §5.4 sem a seção "#### Texto da página"`
  (linha 72). O §5.4 agora só remete ao §5.3, e o qa ajusta o spec. Os outros 5 specs: código 0,
  **280 passaram, 0 falharam**. Servidores derrubados. Não rodei `next dev`.
- **Incompleto:** os e2e do `processo-seletivo.spec.ts` não rodaram. O `AGENTS.md` da raiz continua
  lá, o da primeira passagem: não foi recriado.

## dev-dados

Não entra: a change não tem banco nem tabela.

## guardiao-visual

Tarefa 5.1. `npm run build` código 0; `node scripts/iniciar-servidor.mjs publicado 3000` e
`nao-publicado 3001`, derrubados no fim; Chromium do Playwright, escala 1, 390 × 844 e 1280 × 800,
página inteira, 3 s de espera depois das fontes; recortes e montagem em canvas, por script no
scratchpad, fora do repositório.

- **Comparado:** 2 páginas (`/processo-seletivo` inteira; Início, cabeçalho e hero) × 390 e 1280,
  o menu aberto em 390 e o rodapé de `/processo-seletivo` × 390 e 1280 · **9 PNG** em `prints/`:
  7 `lado-a-lado-*` e 2 `raiz-nao-publicada-*`
- **Raiz não publicada:** **0 de 329.160** (390) e **0 de 1.024.000** (1280) pixels diferentes contra
  os `depois-raiz-nao-publicada-*` arquivados
- **Arranjo:** em 1280, "Como funciona" e "Quem pode se inscrever" lado a lado, `h2` em x 140 e 668,
  y 683,5 os dois (gabarito: 140 e 668, na mesma linha); em 390, um abaixo do outro, x 17,6, y 701,3
  e 975,2. Ordem faixa, etapas, requisitos, perguntas, igual. Do fim da faixa ao `h2`: 103,7 contra
  103,1 px
- **Contraste (RP-09), igual em 390 e 1280:** selo `#272e1b` sobre `#ccdbb2` (fundo do selo), 11 px:
  **9,61:1** · aviso `#eee0f4` sobre a faixa `#4e3260`: **8,52:1**, e sobre o círculo decorativo
  (composto lido no print, `#68457b`): **6,09:1** · link `#f5ead8` sobre `#4e3260`: **9,05:1**, sobre
  o círculo **6,47:1** (só em 390 o link passa sobre ele) · destaque `#f5ead8` sobre `#82558f`: 4,84:1
- **Rodapé:** o destaque "Processo seletivo" **não aparece** no rodapé do gabarito nem no do site,
  em nenhuma largura (0 links); no site ele fica no cabeçalho e no fim do menu (D3)
- **Diferenças: 23** — 4 adaptação aprovada · 18 decisão · 1 melhoria a aprovar · **0 defeito**
  1. cabeçalho 1280 · 125,2 contra 114,4 px · adaptação (§3, alvo de toque)
  2. cabeçalho 1280 · só "Início" nos destinos · decisão (páginas ainda não existem)
  3. cabeçalho 1280 · sem "Painel"; o destaque vai à ponta direita (x 1060 a 1214, contra 932 a 1081) · decisão (§4, R3)
  4. destaque, botão do menu e "Quero participar" · `#82558f` e não o lilás `#9b6aaf` · adaptação (§3)
  5. destaque em `/processo-seletivo` · sublinhado de página atual · adaptação (§3)
  6. destaque 390 · 14 px, 148,5 × 44, contra 12,5 px, 133 × 44 · segue o D12; voltar a 12,5 é **melhoria proposta** do dev-frontend
  7. faixa · selo "Inscrições fechadas", mesmas cores e 11 px · decisão (§6)
  8. faixa · `h1` sem "2026.2" · decisão (§6)
  9. faixa · parágrafo do §5.2, mais longo · decisão (§6)
  10. faixa · aviso do §5.1 com link sublinhado no lugar dos dois botões; faixa com 536 contra 491 (390) e 454,5 contra 411,5 (1280) · decisão (§6, Q1 (b), Q2 (a))
  11. "Etapas" no lugar de "Cronograma" · decisão (§7, linha da Q3)
  12. linha do tempo com 2 marcadores sem datas, contra 5 com datas · decisão (§6)
  13. quadro de requisitos com o §5.3 em parágrafo e 3 itens, contra 4 · decisão (§6)
  14. 8 perguntas do §6, contra 6, sem "O que cai na prova" · decisão (§6)
  15. rodapé · "Portal" só com "Início", sem "Conteúdo"; vão em 1280 · decisão (páginas ainda não existem)
  16. rodapé · e-mail e endereço certos, endereço em 2 linhas em 1280 · decisão (§6, §7)
  17. rodapé · ícones, "liacup.unb" sem @, passo de 44 px · decisão (§7)
  18. rodapé · linha final centralizada, sem "Protótipo do Portal LIACUP…" · decisão (§7)
  19. rodapé 390 · sem "Painel da diretoria" · decisão (§4, R3)
  20. hero · sem "Conheça a Liga" · decisão (spec `pagina-inicial`: `/sobre` não existe)
  21. hero · borboleta no quadro e lema em `#82558f` · decisão (§7), igual à `layout-e-hero`
  22. botões de menu e de fechar · borda mais escura · adaptação (ADR-0003), igual à `layout-e-hero`
  23. menu aberto · só "Início", com sublinhado; o gabarito foi tirado na Contato · decisão (páginas ainda não existem). O botão "Processo seletivo" está no fim do menu, 294 × 44, largura da coluna, como no gabarito
- **Melhorias do dev-frontend:** a do 12,5 px é a diferença 6. A do aviso com destaque próprio
  **não é diferença hoje**: o aviso sai com a letra da apresentação (18 px, `#eee0f4`); viraria
  diferença nova se aprovada. **Selo verde (D4):** cor idêntica ao selo "abertas" do gabarito; o
  sentido vai no texto, a 9,61:1. Não proponho troca; fica a observação para o Gabriel
- **Não comparado:** nada. Incompleto: as perguntas abertas não foram comparadas (o gabarito só tem
  fechadas); a medida de contraste sobre o círculo usa a cor lida no print, não a declarada no CSS

### Rodada 2 (Portão 2)

Mesmo método da rodada 1: `npm run build` código 0, `iniciar-servidor.mjs` publicado 3000 e não
publicado 3001 (derrubados, portas livres), Chromium escala 1, página inteira; medidas por script
no scratchpad, no protótipo aberto no Chromium e no site. Os **9 PNG** em `prints/` foram refeitos
com os mesmos nomes. `git status`: só os 7 `lado-a-lado-*` mudaram; os 2 `raiz-*` saíram iguais.

- **Raiz não publicada:** **0 de 329.160** (390) e **0 de 1.024.000** (1280) pixels diferentes
- **1. Quadro "Quem pode se inscrever"** (site contra gabarito): **na medida.** Em 1280, x 668 e
  largura 472, iguais; altura **290,3 contra 336** (−45,7), com 7 linhas (parágrafo de 4 e 3 itens
  de 1) contra 8; bolinha em x 698,8 contra 698 e texto em x **734 contra 734**; passo dos itens
  45,3 (uma linha) contra 70 (duas). A coluna mede 384,3 ao lado de 480 do "Como funciona" (sobra
  95,7 abaixo do quadro); no gabarito, 424,4 ao lado de 484,3 (sobra 59,9). Em 390, largura 354,8
  contra 354; altura **406,6 contra 384** (+22,6), 12 linhas (parágrafo de 6 e 3 itens de 2) contra
  10; texto em x 83,6 contra 84; passo 68,5 contra 70. O "Perguntas" fica em y 1841 contra 1840,9.
  Do fim do `h2` ao quadro: 26,4 contra 22,0, nas duas larguras; vem da rodada 1 (o CSS do quadro
  só mudou no `padding` dos itens, agora 11 px como o gabarito) e não conto como diferença à parte
- **2. Linha do tempo:** 5 marcadores de 15 px, `#9b6aaf`, nos dois. Em 1280, passo **77,2 contra
  78,4**; do 1º ao 5º, 308,8 contra 313,5; coluna 480 contra 484,3. Em 390, passo 77,2 contra 101,6
  nos 4 primeiros e 78,4 no último, porque o gabarito tem data e descrição de 2 linhas; do 1º ao 5º,
  308,8 contra 383,1; coluna 469,9 contra 543,9 (−74). Marcador em x 140 contra 141 (17,6 contra 19)
- **3. Botão de destaque em 390:** **135,6 × 44**, 12,5 px, `padding` 8,8 × 13,2, x 184,0 a 319,6;
  gabarito 133,2 × 44, 12,5 px, `padding` 10 × 12, x 184,8 a 318,0. Sobra **+2,4 px** de largura,
  do `padding` nos degraus da escala (13,2, e não 12). Rodada 1: 148,5 × 44. Em 1280, igual (153,7)
- **4. Marca:** sem mudança. 390: 121,13 × 44 em (17,59; 8,8), e o cabeçalho de x 0 a 169 tem **0 de
  10.370** pixels diferentes da rodada 1, nas duas páginas; o que mudou no cabeçalho está só em x 171
  a 305 (o botão). 1280: 391,17 × 46 em (66,39; 13,19), cabeçalho inteiro **0 de 160.000**. A caixa
  de 1 px não aparece em nenhum print
- **Sem mudança contra a rodada 1:** faixa do topo, pixel a pixel (0 diferentes); hero (diferença
  máxima de 1 nível de cor no canto da borboleta decorativa); menu aberto, menos o botão do cabeçalho
  atrás do painel; rodapé, só deslocado (390: y 2539 → 2537,8; 1280: 2068,1 → 1954,6)
- **Tabela da rodada 1, atualizada: 23 diferenças** — 4 adaptação aprovada · 19 decisão · 0 melhoria
  a aprovar · **0 defeito**. Sumiu: nenhuma. Nova: nenhuma. Mudaram 3:
  - 6\. destaque 390 · 12,5 px, 135,6 × 44 contra 133,2 × 44 · **decisão**, Q16 (b) (Portão 2,
    21/11). Era melhoria proposta. Os 2,4 px que sobram não são defeito pelo meu critério; se o
    Gabriel quiser os 133 exatos, é Qn (a regra dele: sem quarta rodada)
  - 12\. linha do tempo · 5 marcadores sem data, nome e caráter, contra 5 com data e descrição ·
    **decisão** (§6, linha das cinco etapas do §5.5)
  - 13\. quadro · parágrafo do "Texto da página" do §5.3 e 3 pré-requisitos curtos do §5.4, contra 4
    itens · **decisão** (Portão 2, mudança de conteúdo 2)
  - as outras 20 seguem iguais, com o mesmo veredito. Efeito da 12 e da 13 em 1280: a página caiu de
    2413 para 2299 px (gabarito 2122), e o "Perguntas" subiu de y 1421 para 1307,5 (gabarito 1257,3)
- **Não comparado:** nada. Incompleto: as perguntas abertas, como na rodada 1

### Rodada 3 (correção do cartão)

Mesmo método da rodada 2: `npm run build` código 0, servidores 3000 e 3001 de produção,
derrubados no fim, portas livres. Os **9 PNG** foram refeitos com os mesmos nomes; o `git status`
ficou igual ao de antes da passagem.

- **Raiz não publicada:** **0 de 329.160** (390) e **0 de 1.024.000** (1280) pixels diferentes
- **Só o cartão mudou:** contra os prints da rodada 2, o cabeçalho, a faixa, o hero e o menu têm 0
  pixels diferentes; em 1280, a página inteira só muda em x 668 a 1139, y 777 a 1071 (o cartão)
- **Cartão: na medida do gabarito.**
  - Largura e posição: 472 em x 668, igual (1280); 354,8 em x 17,6, contra 354 em x 18 (390)
  - Altura: **326,8 contra 336** (1280) e **350 contra 384** (390). O gabarito impresso tem outro
    texto no 3º e no 4º item; com os 4 textos novos postos no protótipo, ele mede 336 e **360**
  - Texto a 66 px da borda nos dois; bolinha a 30,8 contra 30, centrada na 1ª linha (no gabarito,
    0,5 px abaixo do meio)
  - Quebras: iguais às do gabarito com os textos novos. 1280: 2, 2, 2 e 2 linhas, com as mesmas
    palavras no fim de cada linha. 390: 3, 2, 2 e 2. O 1º e o 2º item quebram como no gabarito
    impresso
  - Colunas em 1280: "Como funciona" 480 contra 484,3; "Quem pode se inscrever" **420,8 contra
    424,4**. Do fim do cartão ao fim da linha do tempo: 59,2 contra 59,9
  - Em 390, o "Perguntas" sobe para y 1784,4 (gabarito 1840,9) e a página tem 3055 px (era 3112)
- **A explicação do dev se confirma.** Pus no navegador, sem tocar no código, o `padding` vertical
  de 28 e a linha de 24 no cartão do site: ele mediu **336** (1280) e **360** (390), o mesmo que o
  gabarito com os textos novos, com os 4 itens nas mesmas posições (42, 112, 182 e 252 px do topo
  em 1280). Só o `padding`: 330 e 353,3. Só a linha: 332,8 e 356,8
- **Tabela de diferenças: 23**, com 4 adaptação aprovada, 19 decisão, 0 melhoria a aprovar e
  **0 defeito**. Muda a 13:
  - 13\. cartão · 4 itens sem parágrafo, como o gabarito; o 3º e o 4º com o texto da correção, e a
    altura 9,2 px (1280) e 10 px (390) menor, do `padding` de 26,4 e da linha de 23,25 que já
    existiam · **decisão** (correção do Gabriel no item 2, literal no relatório)
  - A diferença de 26,4 contra 22,0 do fim do `h2` ao cartão continua, da rodada 1, e não conto à
    parte. Nada no cartão é defeito pelo meu critério; se o Gabriel quiser os 336 e os 360 exatos,
    é Qn

## qa-acessibilidade

Tarefas 3.1, 3.2 e 3.3. Checkboxes não marcados.

- **Arquivos:** novo `tests/e2e/processo-seletivo.spec.ts` (6 testes); alterados
  `paginas-publicas.spec.ts` (3 testes novos: `h1` e níveis, página atual no rodapé e destaque,
  nome da marca), `menu-por-teclado.spec.ts` (comportamento 4 navega pelo destaque; total de
  larguras) e `pagina-inicial.spec.ts` (o botão do hero é seguido pelo clique). Nenhuma asserção
  removida. `git diff --exit-code tests/e2e/interruptor.spec.ts playwright.config.ts`: 0.
- **Cobertura:** `/` e `/processo-seletivo` × 360, 390, 430, 480, 768, 1024 e 1280, publicado (3000),
  e a raiz não publicada (3001) pelos specs que já existiam.
- **Comandos:** `npx playwright test` (os dois servidores) **0, 308 de 308** (eram 245; +63 = 9
  testes × 7) · `npm test` 0, 113 de 113 · `npm run build && npm run test:desempenho` 0 ·
  `prettier --check tests/e2e` 0 · `eslint tests/e2e` 0 · `tsc --noEmit` 0.
- **Medições, somadas nas 7 larguras:** axe **0** em 21 medições (publicado, fechadas e abertas,
  não publicado) · rolagem horizontal **0 de 7** larguras, com as perguntas fechadas e abertas ·
  alvos da moldura e da página **190 medidos / 0 abaixo de 44 px**; perguntas **56 / 0** (menor
  324,81 × 62 em 360) · foco **154 controles por Tab / 0 sem foco visível**; perguntas 56 / 0.
- **Por largura:** `trechos … conferidos: 27` (§5 1 · §5.1 1 · §5.2 1 · §5.3 1 · §5.4 3 · §5.5 4 ·
  §6 16) e 7 rótulos, 34 de 34 iguais · notas de fonte tiradas: 7, na página: 0 · texto fora do
  documento: 0 caracteres · 19 termos proibidos (9 da spec, 10 datas do §5.6), 0 achados ·
  `perguntas medidas: 8` · Enter abriu 8, Espaço fechou 8, página rolou 0, estado anunciado 8 de 8
  · toque abre e fecha 8 · link do aviso com destino, nova aba, `rel`, nome, 99,92 × 44 px, sem
  `window.opener` e sem Referer · `páginas verificadas: 2 de 2` · `páginas com os títulos
  conferidos: 2 de 2` · `menu lateral testado em 6 de 7 larguras` (na linha da última largura a
  terminar).
- **D6:** o Chromium expõe o `<summary>` como `DisclosureTriangle` com `expanded` false, true,
  false. A alternativa `<button aria-expanded>` **não é necessária**.
- **Defeitos em `src/`:** nenhum. Observação, sem falha: o nome da marca sai "LIACUP , página
  inicial", com espaço antes da vírgula (o Chromium separa o trecho só para leitor de tela).
- **Achado no critério da 3.3:** `git grep -c` da marca de demonstração dá **código 0** já antes das
  demonstrações, porque `tasks.md` (1) e o relatório arquivado da `layout-e-hero` (6) citam o nome
  da marca. Depois: as mesmas 2 linhas, iguais às de antes; em `src scripts tests` o `git grep -c`
  dá **1**, e o `grep -rc`, que inclui os não rastreados, também. O critério precisa ser reescrito
  pelo líder técnico; não mexi nele. Por isso esta seção não escreve o nome da marca.
- **Duas demonstrações acharam fraqueza no meu teste, corrigida antes do vermelho registrado:** na
  5, o Espaço contava "fechou" numa pergunta que nem abriu (agora é medido sozinho); na 10, o
  "texto visível" da marca incluía o trecho só para leitor de tela (agora só conta texto com mais de
  1 px).
- **Restauração:** `git status --porcelain` igual ao gravado antes (`diff` 0, 35 linhas);
  `sha256sum -c` 7 de 7 OK; cópias byte a byte (`cp -p`).
- **Sem cobertura:** leitor de tela real (só a árvore do Chromium); toque em aparelho real (só a
  emulação do Playwright); a posição lado a lado em 1280 e um abaixo do outro em 390 (só a ordem no
  DOM; fica com o `guardiao-visual`); contraste da faixa roxa (RP-09) não medido por mim; outros
  navegadores além do Chromium.

| # | Violação temporária (arquivo) | Vermelho | Verde |
| --- | --- | --- | --- |
| 1 | título da Início no Processo seletivo (`paginas-publicas.json`) | `npm test` 1: `título "Liga Acadêmica … · LIACUP" repetido nos endereços "/" e "/processo-seletivo"` | 113 de 113 |
| 2 | descrição com 69 caracteres (`paginas-publicas.json`) | `npm test` 1: `descrição com 69 caracteres no endereço "/processo-seletivo"` | 113 de 113, 129 e 155 |
| 3 | "Com que frequência…" sem resposta (`conteudo.ts`) | `npm test` 1: `pergunta "Com que frequência são as reuniões?" sem resposta` | 113 de 113 |
| 4 | "Quinzenais." trocado por "Mensais." (`conteudo.ts`) | e2e 7 de 7 falham: `trecho "§6, resposta de …" esperado "Quinzenais." recebido "Mensais."` | 308 de 308 |
| 5 | pergunta 3 sem Enter e Espaço, por script (`PerguntasFrequentes.tsx`) | e2e 7 de 7: `pergunta 3 "Quanto tempo por semana?": a tecla Enter não abriu` e `a tecla Espaço não fechou`; toque segue verde | 308 de 308 |
| 6 | segundo `h1` (`processo-seletivo/page.tsx`) | e2e 7 de 7: `/processo-seletivo: 2 títulos de nível 1 …: "Processo seletivo" e "Como funciona a seleção"` | 308 de 308 |
| 7 | `robots: { index: false }` (`processo-seletivo/page.tsx`) | código 1: SEO 66 nas 3 execuções; `SEO abaixo de 95 … em: http://localhost:3000/processo-seletivo` | código 0, SEO 100 nas 6; não publicado 92 só impresso |
| 8 | manifesto apagado antes da contagem (`medir-desempenho.mjs`) | código 1: `páginas medidas: 0 de 2 pedidas` · `mediu 0 de 2 páginas` | código 0, `2 de 2` e `1 de 1` |
| 9 | colunas do rodapé com `Link` em vez do `LinkDaNavegacao` (`RodapePublico.tsx`) | e2e 7 de 7: `/: rodapé, link "Início" (href /) sem aria-current="page"` | 308 de 308 |
| 10 | `aria-hidden` no nome longo (`Cabecalho.tsx`) | e2e **só 1280** falha (6 verdes): visível "LIACUP Liga … · UnB", nome "LIACUP , página inicial" | 308 de 308 |

### Rodada 2 (correção: revisor, achado 1)

- **Arquivo:** só `tests/e2e/paginas-publicas.spec.ts`, 2 testes novos logo depois dos do ícone, e 3
  importações (`node:crypto`, `node:fs`, `node:path`). Contra a cópia de antes da rodada: 0 linhas
  removidas. Nenhum checkbox marcado, nenhum Git de escrita, `.env` não aberto.
- **Teste 1, publicado (3000):** percorre `PAGINAS_PUBLICAS` e confere em cada página, **cada
  etiqueta uma vez só**: `<title>` = `titulo`; `meta description` = `descricao`; `link canonical` =
  `https://liacup.com.br` + endereço (escrito no teste, e não importado de `metadados.ts`, para não
  partir do mesmo valor da função); `og:title`, `og:description`; `og:url` = o canônico entregue;
  `html[lang=pt-BR]`. **A Início sai `https://liacup.com.br`, sem a barra** (aceita com ou sem;
  imprime qual achou). Saída: `páginas com metadados conferidos: 2 de 2`, nas 7 larguras.
- **Teste 2, não publicado (3001), a raiz:** `<title>` = "Portal LIACUP" (uma vez); a descrição
  **lida do `src/app/layout.tsx`** (o `title` e o `description` do primeiro nível do `metadata`;
  se não achar, falha dizendo que o teste precisa ser revisto), e não copiada; 0 `link canonical`; 0
  `meta[property^="og:"]`; `lang` pt-BR. Ler do arquivo só prova que a página entrega o que o
  arquivo diz, e não que é "a de antes" (spec seo): por isso o teste guarda também o **SHA-256** da
  descrição de hoje (igual à da `main`, 108 caracteres). Trocá-la exige trocar a impressão, com
  decisão do Gabriel. Saída: `<title> 1 ("Portal LIACUP") · meta description 1, igual à do
  layout.tsx: true · SHA-256 … igual à de antes: true · link canonical: 0 · meta og:*: 0`, nas 7.
- **RP-12**, violações marcadas `DEMO-RP12`, desfeitas com `cp -p` da cópia:

| # | Violação temporária | Vermelho | Verde |
| --- | --- | --- | --- |
| a | `processo-seletivo/page.tsx` sem o `montarMetadados` (import e export) | código 1, teste 1 falha em 7 de 7, `1 de 2`: `/processo-seletivo: <title>: "Portal LIACUP", esperado "Processo seletivo · LIACUP"`, a descrição da raiz no lugar da dela, e `link canonical`, `og:title`, `og:description`, `og:url`: `0 no <head>, e não 1`. O teste 2 segue verde (7) | na execução da (b), com a `page.tsx` já restaurada: teste 1 verde em 7 de 7, `2 de 2` |
| b | `layout.tsx` com `metadataBase` + `openGraph` | código 1, teste 2 falha em 7 de 7: `meta og:*: 4, e não 0 (og:title=… og:description=… og:url="https://liacup.com.br" og:type="website")`. O teste 1 segue verde (7, `2 de 2`) | suíte final, 322 de 322 |
| c | `layout.tsx` com `alternates.canonical` e "institucional" trocado por "oficial" na descrição (as duas conferências que a (b) não exercita) | código 1, 7 de 7: `a description mudou (SHA-256 8eae0a4b…, a de antes é 84cffcf3…)` e `link canonical: 1, e não 0 (["https://liacup.com.br"])` | 322 de 322 |

- **Restauração:** `sha256sum -c` 2 de 2 OK (`page.tsx`, `layout.tsx`); `git status --porcelain`
  igual ao gravado antes (`diff` 0, 37 linhas); `grep -rn DEMO-RP12 src tests scripts`: nenhuma
  ocorrência (código 1). A suíte final recompilou com o código restaurado (portas livres antes).
- **Verificações finais:** `npx playwright test` **código 0, 322 passaram, 0 falharam** (308 + 2
  testes × 7 larguras) · `npx prettier --check tests/e2e` 0 · `npx eslint tests/e2e` 0. Portas 3000
  e 3001 livres no fim.
- **Defeitos em `src/`:** nenhum.
- **Sem cobertura:** o `<head>` na prévia da Vercel (só na compilação local; P23 é do líder
  técnico); `og:locale` e `og:type` das páginas publicadas não conferidos (D10 os pede, o pedido e a
  spec não); a impressão SHA-256 não pega mudança só de aspas ou de quebra de linha no arquivo que
  não mude o texto, o que é o desejado; outros navegadores além do Chromium.

### Ajuste do Portão 2

- **Arquivos (só M):** `tests/e2e/processo-seletivo.spec.ts` (+99 −24) e `paginas-publicas.spec.ts`
  (+19 −9). As linhas removidas são o leitor antigo do §5.3 a §5.5, a exigência de 2 etapas, o
  `/página inicial/` (trocado por uma regra mais dura) e comentários. Nenhuma outra asserção saiu.
  Nenhum Git de escrita, `.env` não aberto, nenhum `next dev`, nenhum checkbox marcado.
- **`processo-seletivo.spec.ts`:** o §5.3 e o §5.4 são lidos **só da subseção "Texto da página"**
  (o §5.3 exige uma citação só); o §5.5 no formato `N. Nome · caráter.`, com `ETAPAS_EXIGIDAS = 5`
  (o carregamento para se o documento tiver outro número), e o nome e o caráter conferidos
  separados na página, como antes. O texto do edital (1 parágrafo do §5.3 e 3 itens do §5.4, lidos
  do documento) e 7 marcas dele (`supracitad`, `regularmente matriculad`, …; cada uma precisa estar
  no texto do edital, senão o spec para) entram na busca do que **não** pode aparecer, com todas as
  perguntas abertas.
- **Marca (`paginas-publicas.spec.ts`):** continua medindo o certo. O "visível" vem dos pixels
  (texto de elemento visível e maior que 1 px, mesmo com `aria-hidden`) e o nome da árvore; então,
  se a cópia para leitor de tela se separar do texto da tela, o teste fica vermelho. Exige agora o
  nome começando pelo visível (WCAG 2.5.3), **terminando em ", página inicial"** e **sem espaço antes
  da vírgula**. O comentário de "1 px" foi reescrito para a técnica da rodada 3.
- **Por largura (360, 390, 430, 480, 768, 1024, 1280):** `trechos … conferidos: 33` (§5 1 · §5.1 1 ·
  §5.2 1 · §5.3 1 · §5.4 3 · §5.5 10 · §6 16) e 7 rótulos, **40 de 40** iguais · `etapas lidas do
  documento: 5 · na página: 5` · texto fora do documento: 0 caracteres · notas de fonte na página: 0
  · **30 termos proibidos** (9 da spec · 10 datas do §5.6 · 11 do edital), **0 achados** ·
  `perguntas medidas: 8` · marca conferida em 2 de 2 páginas.
- **Somado nas 7 larguras:** `Violacoes de acessibilidade: 0` em 21 medições · rolagem horizontal 0
  em 7 de 7 · alvos **190 medidos / 0 abaixo de 44 px**; perguntas **56 / 0** (a menor: 324,81 × 62
  em 360) · foco **154 controles por Tab / 0 sem foco visível**.
- **RP-12** (violações marcadas `DEMO-RP12`, desfeitas com `cp -p` da cópia):

| # | Violação temporária | Vermelho | Verde |
| --- | --- | --- | --- |
| a | etapa "Integração" tirada do `conteudo.ts` | código 1, 7 de 7: `a página tem 4 etapas, e o documento 5`, `… e não 5`, `etapas … na página: 4`, etapa 5 `recebido: "(ausente)"` | 322 de 322 |
| b | "paliativos" trocado por "intensivos" no pré-requisito 3 (`conteudo.ts`) | 7 de 7: `esperado: "Afinidade e interesse por cuidados paliativos." recebido: "… intensivos."` · `iguais: 36 de 40` (com a, c) | 322 de 322 |
| c | o parágrafo do edital no lugar do "Texto da página" do §5.3 (`conteudo.ts`) | 7 de 7, nos dois testes: o trecho do §5.3 difere, e `achados: 4` (o parágrafo inteiro, `regularmente matriculad`, `Faculdade de Ciências e Tecnologias em Saúde`, `poderão ser considerados`) | 322 de 322 |
| d | `DESTINO_DA_MARCA = ' , página inicial'` (`Cabecalho.tsx`) | 7 de 7, nas 2 páginas: `nome acessível "LIACUP , página inicial": o nome tem espaço antes da vírgula` (e "… · UnB , página inicial" em 1280) · `marca conferida em 0 de 2` | 322 de 322 |
| e | `ETAPAS_EXIGIDAS = 4` no spec, documento com 5 | código 1 ao carregar: `Error: §5.5 com 5 etapas, e não 4` | `sha256sum -c` OK, 322 de 322 |

  a, b, c e d numa compilação só: `21 failed` (3 testes × 7), cada defeito com a sua mensagem.
- **Restauração:** `sha256sum -c` OK em `conteudo.ts`, `Cabecalho.tsx`, `conteudo-institucional.md`
  e no spec da (e); `grep -rn DEMO-RP12 src tests docs`: 0; `git status --porcelain` igual ao de
  antes (22 linhas) mais os 2 specs; índice vazio. A suíte final recompilou (portas livres antes e
  depois).
- **Verificações:** `npx playwright test` **código 0, 322 passaram, 0 falharam** · `npx prettier
  --check tests/e2e` 0 · `npx eslint tests/e2e` 0 · `npx tsc --noEmit` 0.
- **Defeitos em `src/`:** nenhum.
- **Sem cobertura:** leitor de tela real (o nome é lido na árvore do Chromium); a caixa de 1 px com
  `clip-path` no Safari com VoiceOver, **não medida** (só há Chromium); toque em aparelho real; o
  arranjo lado a lado em 1280 (só a ordem no DOM, fica com o `guardiao-visual`); contraste não
  medido por mim.
- **Correção do cartão (item 2), vale no lugar do §5.3 e §5.4 de cima:** o cartão é lido só da
  lista do §5.3 "Texto da página" (4 itens, a nota do item 3 tirada e conferida fora da página); o
  §5.4 só pelo edital; exigidos **4 itens e 0 parágrafos** no quadro; a linha sem fonte do protótipo
  entra na busca. Por largura (7): `trechos … conferidos: 33` (§5.3 4), 40 de 40 · `quem pode se
  inscrever: 4 (na página: 4 itens, 0 parágrafos)` · notas de fonte 8, na página 0 · **33 termos
  proibidos** (9 · 10 datas · 11 do edital · 3 da linha sem fonte), 0 achados. **RP-12:** item 4
  tirado do `conteudo.ts`, 7 de 7 vermelhos (`tem 3 itens, e não 4`); um `<p>` antes da lista no
  `QuemPodeSeInscrever.tsx`, 7 de 7 (`tem 1 parágrafos, e não 0`); `sha256sum -c` 3 de 3 OK,
  `git status --porcelain` igual (`diff` 0, 33 linhas). `npx playwright test` **0, 322 de 322** ·
  axe 0 em 21 · rolagem 0 em 7 · alvos 190 / 0 e perguntas 56 / 0 · Tab 154 / 0 · `prettier` 0 ·
  `eslint` 0. Spec: +152 −41 no total da passagem.

## revisor

### Rodada 1 (registrada pelo líder técnico; o revisor não escreve)

- **Veredito:** aprovado com ressalva · 49 arquivos do diff · 8 critérios de aceite e 61 cenários
  (55 com teste ou procedimento) · 14 regras.
- **Achados:** (1) média · nenhum teste permanente lê o `<head>`: os cenários de metadados da spec
  `seo` e a raiz não publicada só tinham o `curl` da tarefa 2.2; (2) média · nada confere a
  `descricao` da lista contra o `conteudo-institucional.md`; (3) baixa · `medir-desempenho.mjs`
  compara o SEO depois de arredondar (0,945 passava); (4) baixa · variantes `fantasma` e `icone` do
  `Botao` sem hover e pressionado (ADR-0006); (5) baixa · a vitrine não mostra o link com aparência
  de botão (D7), mas o D13 só a libera se quebrar; (6) baixa · `.destaque` do cabeçalho dependia da
  ordem dos CSS; (7) baixa · o `.env.example` manda copiar para `.env.local`, e o P23 lê o `.env`.
- **Encaminhamento:** 1 pelo `qa-acessibilidade` (rodada 2); 2, 3, 4 e 6 pelo `dev-frontend`
  (rodada 2); 7 pelo líder técnico; 5 vai como desvio para o Gabriel no Portão 2.
- **Não conseguiu conferir:** não roda comando; não tem o `tokens.css` da `main`; não leu as
  demonstrações do RP-12; o cenário "Endereço de prévia marcado pela hospedagem" (spec `seo`) não
  tem código nesta change (D9).

### Rodada 2 (invocação nova, sem o relatório anterior)

- **Veredito:** aprovado com ressalva · 47 arquivos · 8 critérios e 61 cenários (59 cobertos) ·
  os 14 RP, 12 seções da PADROES e 5 princípios. Nenhuma verificação afrouxada.
- **Achados, todos baixos:** (1) a vitrine não mostra o link com aparência de botão (D7 contra
  D13); (2) o selo "Inscrições fechadas" é texto de tela sem registro no `conteudo-institucional.md`
  nem na REFERENCIA-VISUAL §7; (3) o trecho ", página inicial" fica escondido com letra de tamanho
  0, que não é a técnica C7 citada como origem, e o WebKit/VoiceOver pode descartá-lo; o comentário
  de `paginas-publicas.spec.ts:1696` ainda fala em 1 px; (4) meios degraus da escala em
  `Etapas.module.css:39` e `QuemPodeSeInscrever.module.css:29`, que o `verificar:tokens` não pega
  (RP-02); (5) o cenário "Endereço de prévia marcado pela hospedagem" (spec `seo`) não tem código
  nem procedimento; (6) lista vazia some a seção em `Etapas` e `PerguntasFrequentes`, e mantém em
  `QuemPodeSeInscrever`; falta dizer por que carregando e erro não se aplicam; (7) a linha da §7
  aponta para o caminho do archive, que ainda não existe.
- **Encaminhamento (regra 4 da dieta):** 3, 4 e 6 pedem código, e seriam a terceira rodada do
  `dev-frontend`: vão ao Gabriel como Q10 a Q12. 1 e 2 vão como Q13 e Q14. 5 e 7 vão declarados na
  entrega (o 7 se resolve no archive, conferido com `verificar:artefatos`).
- **Não conseguiu conferir:** linhas de token da `main`; as saídas e as demonstrações do RP-12; a
  medida do botão em 390 px; leitor de tela real; o P23.

### Rodada 3 (invocação nova, depois da rodada do Portão 2 e da correção do cartão)

Uma invocação anterior, lançada antes da correção do cartão, foi parada pelo líder técnico sem
relatório.

- **Veredito:** aprovado com ressalva · 58 de 68 arquivos · 8 critérios e 61 cenários · 26 regras.
  Nenhuma verificação afrouxada.
- **Achados:** (1) média · `Cabecalho.tsx:64-75` · o nome acessível da marca é uma cópia inteira na
  caixa de 1 px, com o texto visível em `aria-hidden`: cumpre a spec e o WCAG 2.5.3, mas contraria a
  letra do D12 e vai além da Q10 (a); (2) média · `docs/SEGURANCA.md` §5 · o título diz "Três
  formas" e são quatro; "as duas buscas" são três; a lacuna `<caminho>` tem duas regras que não
  convivem (começa ou não com "/"); o D11 e a 4.1 não registram a busca por commit e a do índice;
  (3) baixa · `conteudo-institucional.md` §5.1 e placar do §8 desatualizados; (4) baixa · `Etapas` e
  `QuemPodeSeInscrever` com `list-style: none` sem `role="list"` (Safari e VoiceOver deixam de
  anunciar a lista); (5) baixa · duas constantes `NOME_DA_LIGA` com valores diferentes, e o tipo e o
  componente `TituloDeSecao` com o mesmo nome.
- **Encaminhamento (regra 4 da dieta):** é a terceira rodada do `revisor` com pedido de correção. O
  líder técnico para e leva ao Gabriel (Q18 a Q20).

## guardiao-appsec

O guardião não escreve: o líder técnico registra o relatório em uma tela por passagem, com a lista
de achados inteira; a saída de comando e o aceite do Gabriel vão literais.

### Rodada 1

- **Veredito:** APROVADO (provisório, até P1 a P7) · bloqueante 0 · alta 0 · média 0 · baixa 0 ·
  informativa 4 · conferência completa · 58 arquivos.
- **Estado por código:** AS-01 informativos F-01 a F-03, busca do valor pendente de P1 e P2 ·
  AS-02, AS-04 a AS-09 sem achado · AS-03, AS-10 a AS-14, AS-16 e AS-17 não se aplicam · AS-15
  **não verificado** (a prévia não existe; P8 e P9 para a seção 6 da entrega).
- **Achados:**
  - F-01 · AS-01 · informativa · confirmado · `docs/SEGURANCA.md` §7 · a linha dos 9 prints dizia
    "Ativo aprovado" com a aprovação ainda futura · critério: citar a aprovação do Gabriel, com
    data, antes do merge — **corrigido pelo líder técnico**: a linha diz "Aprovação pendente" até
    o Portão 2.
  - F-02 · AS-01 · informativa · provável · `.env.example` · o texto dizia que o segredo não vai
    para a Vercel, que o expõe como variável de sistema; o `next dev` carrega o `.env` inteiro ·
    critério: dizer onde o segredo existe e garantir que nenhum código lê a variável —
    **corrigido pelo líder técnico** no `.env.example` e na §5 (regra "Nenhum código lê a
    variável").
  - F-03 · AS-01 · informativa · provável · `docs/SEGURANCA.md` §5 · o valor vazio dá código 128,
    não "casa com tudo", e linha com aspas, espaço ou `#` daria "nada achado" falso · critério: só
    código 1 com saída vazia conclui, e a forma da linha é registrada antes de cada busca —
    **corrigido pelo líder técnico** na §5.
  - F-04 · AS-04 e AS-05 · informativa · hipótese · `src/lib/utils/paginas-publicas.ts` ·
    `problemasDaLista` aceitava `//dominio.externo` · critério: recusar endereço fora de
    `^/$|^(/[a-z0-9-]+)+$`, visto falhando — **corrigido pelo `dev-frontend`** (rodada 2).
- **Pedidos de comando**, como foram digitados, com `MSYS_NO_PATHCONV=1`. Antes, a forma da linha
  no `.env`, só por contagem: 1 linha com o nome, 0 com aspas, 1 com `\r`, 0 com espaço no fim, 0
  com `#`, valor não vazio.

```
P1 · sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F -f - HEAD
[saída vazia · código de saída: 1]

P2 · sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --untracked -f -
[saída vazia · código de saída: 1]

P3 a P7 · git grep -c -a --untracked -e '<padrão>' -- 'openspec/changes/pagina-processo-seletivo/relatorio.md'
para eyJ, sbp_, sb_secret_, ghp_ e github_pat_
[saída vazia · código de saída: 1, nos cinco]
```

- **Riscos aceitos pelo Gabriel:** nenhum.

### Rodada 2 (invocação nova, sem o relatório anterior)

- **Veredito:** APROVADO COM RESSALVAS (depois de P1 a P11) · bloqueante 0 · alta 0 · média 1 ·
  baixa 4 · informativa 0 · conferência completa · 59 arquivos (38 inteiros, 14 em parte, 7 por
  busca ou não lidos por regra).
- **Estado por código:** AS-01 achados F-01 a F-05 · AS-02, AS-04 a AS-09 sem achado · AS-03,
  AS-10 a AS-14, AS-16 e AS-17 não se aplicam · AS-15 **não verificado** (a prévia não existe; P12
  e P13 para a seção 6 da entrega).
- **Achados:**
  - F-01 · AS-01 · média · confirmado · `docs/SEGURANCA.md` §5 · a conferência "nenhum código lê
    a variável" olhava só o HEAD e três pastas, e a implementação está sem commit; ficavam de fora
    `next.config.ts` e outros · critério: árvore de trabalho inteira, com não rastreados, fora de
    `docs/`, `openspec/`, `README.md` e `.env.example` — **corrigido pelo líder técnico** na §5;
    rodado: código 1, saída vazia.
  - F-02 · AS-01 · baixa · confirmado · §5 · a busca do valor não cobria os commits intermediários
    da branch nem o índice · critério: cada commit de `main..HEAD` e o índice — **corrigido** na §5
    (segunda forma por commit, quarta forma no índice); rodado: código 1 nos 2 commits e no índice.
  - F-03 · AS-01 · baixa · hipótese · §5 · contar espaço no fim depois de tirar o `\r`, e espaço
    depois do `=` · **corrigido** na §5; rodado: 0 e 0.
  - F-04 · AS-01 · baixa · hipótese · §5 · `<host>` sem padrão e endereço entre aspas duplas ·
    **corrigido** na §5: só `[a-z0-9-]`, até 63 caracteres, e aspas simples. **Desvio** da forma
    literal do Gabriel, que usava aspas duplas; vai na entrega.
  - F-05 · AS-01 · baixa · confirmado · §7 · "Aprovação pendente" não é origem aceita, e o caminho
    supõe o archive · critério: "Ativo aprovado" com o aceite literal do Gabriel e o caminho igual
    ao da pasta depois do archive — **depende do Gabriel no Portão 2** (Q15).
- **Pedidos de comando**, como foram digitados, com `MSYS_NO_PATHCONV=1`. Forma da linha, só por
  contagem (o espaço do fim contado depois de tirar o `\r`): 1 linha, 0 com aspas, 1 com `\r`, 0
  com espaço ou tab no fim, 0 com `#`, 0 com espaço ou tab depois do `=`, valor não vazio.

```
P1 · sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F -f - HEAD
[saída vazia · código de saída: 1]

P2 · sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --untracked -f -
[saída vazia · código de saída: 1]

P3 · git check-ignore -v -- '.env'
.gitignore:10:.env	.env
[código de saída: 0]

P4 · git ls-files -- '.env'
[saída vazia · código de saída: 0]

P5, P9, P10, P11 · git grep -c -a --untracked -e '<padrão>' -- 'openspec/changes/pagina-processo-seletivo/relatorio.md'
para eyJhbGci, PRIVATE KEY, postgresql:// e postgres://
[saída vazia · código de saída: 1, nos quatro]

P6, P7, P8 · a mesma forma, para sbp_, ghp_ e github_pat_
openspec/changes/pagina-processo-seletivo/relatorio.md:1
[código de saída: 0, nos três]
  detalhe · git grep -n -I --untracked -e '<padrão>' -- 'openspec/changes/pagina-processo-seletivo/relatorio.md'
  os três casavam só na linha 500 (no momento da busca), o registro dos pedidos da rodada 1, que cita os nomes dos
  padrões e nenhum valor: "para eyJ, sbp_, sb_secret_, ghp_ e github_pat_"

Conferências da §5 corrigida (líder técnico):
git grep -c --untracked -e VERCEL_AUTOMATION_BYPASS_SECRET -- . ':!docs' ':!openspec' ':!README.md' ':!.env.example'
[saída vazia · código de saída: 1]
valor, pela segunda forma, em 30479fb e 41e129b (git rev-list main..HEAD): saída vazia, código 1 nos dois
valor, pela quarta forma (índice): saída vazia, código 1
```

- **Riscos aceitos pelo Gabriel:** nenhum.

### Rodada 3 (invocação nova, depois da rodada do Portão 2 e da correção do cartão)

Uma invocação anterior, lançada antes da correção do cartão, foi parada pelo líder técnico sem
relatório.

- **Veredito:** APROVADO COM RESSALVAS (depois dos pedidos abaixo) · bloqueante 0 · alta 0 · média
  2 · baixa 1 · informativa 1 · conferência completa · 68 arquivos e o `AGENTS.md`.
- **Estado por código:** AS-01 F1 e F4 · AS-17 F2 · AS-02, AS-04 a AS-09 sem achado · AS-03, AS-10
  a AS-14 e AS-16 não se aplicam · AS-15 **não verificado** (a prévia tem o `bff7ee8`).
- **Achados:**
  - F1 · AS-01 · média · confirmado · `docs/SEGURANCA.md` §7 · os 9 PNG com "Aprovação pendente",
    que não é origem aceita · critério: "Ativo aprovado" com o aceite do Gabriel e o caminho do
    archive com a data real · **depende da Q15**. Chegar ao merge pendente vira alta e BLOQUEADO.
  - F2 · AS-17 · média · confirmado · `AGENTS.md` na raiz, não rastreado e não ignorado, escrito
    pelo `next dev`, com instruções a agentes de IA que mandam ler `node_modules/next/dist/docs/` e
    induzem o commit · critério: não entra em commit sem decisão do Gabriel; se ficar, entra no
    AS-17 auditado; se não, um mecanismo versionado impede que reapareça ou seja rastreado (não vale
    o `.git/info/exclude`) · **Q17**.
  - F3 · AS-01 e AS-09 · baixa · confirmado · `docs/SEGURANCA.md` §5 e `design.md` D11 · o mesmo
    achado 2 do `revisor` (contagem das formas; D11 com aspas duplas e só duas buscas) · **Q19**.
  - F4 · AS-01 · informativa · confirmado · `.env.example` e `README.md` dizem que nenhum arquivo
    lê a variável, mas `tests/politicas/ambiente.ts` (fora do diff) carrega o `.env` inteiro no
    ambiente · critério: dizer "pelo nome" e declarar o `ambiente.ts` · **Q19**.
- **Pedidos de comando**, como foram digitados, com `MSYS_NO_PATHCONV=1`. A forma da linha do
  `.env` foi registrada antes (igual à rodada 2).

```
P1 · git log --oneline -n 10 HEAD
bff7ee8 wip: implementa a pagina-processo-seletivo antes das decisões do Portão 2
30479fb docs: emenda a proposta da pagina-processo-seletivo com o Portão 1
41e129b docs: propõe a change pagina-processo-seletivo
33077f4 Merge pull request #19 from Liga-Academica-Liacup/feat/layout-e-hero
(mais 6 linhas da história da main)
[código de saída: 0] · main..HEAD: bff7ee8 30479fb 41e129b

P2 a P4 · sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F -f - <rev>
com 41e129b, 30479fb e bff7ee8
[saída vazia · código de saída: 1, nos três]

P5 · sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --untracked -f -
[saída vazia · código de saída: 1]

P6 · sed -n 's/^VERCEL_AUTOMATION_BYPASS_SECRET=//p' .env | tr -d '\r\n' | git grep -c -a -F --cached -f -
[saída vazia · código de saída: 1]

C1 · git grep -c --untracked -e 'VERCEL_AUTOMATION_BYPASS_SECRET' -- . ':!docs' ':!openspec' ':!README.md' ':!.env.example'
[saída vazia · código de saída: 1]

P7 · git diff main -- 'package.json' · e · git diff main -- 'package-lock.json'
[saída vazia · código de saída: 0, nos dois]

P8 · git check-ignore -v -- '.env'
.gitignore:10:.env	.env
[código de saída: 0]

P9 · git ls-files -- 'AGENTS.md'
[saída vazia · código de saída: 0]

P10 · git check-ignore -v -- 'AGENTS.md'
[saída vazia · código de saída: 1]

P11 a P19 · git grep -c -a --untracked -e 'TXt' -- 'openspec/changes/pagina-processo-seletivo/prints/<png>'
um por PNG, nos 9
[saída vazia · código de saída: 1, nos nove]
```

- **P20 e P21 (P23, AS-15):** ficam para depois do próximo push, com o host conferido.
- **Encaminhamento (regra 4 da dieta):** é a terceira rodada do `guardiao-appsec` com pedido de
  correção. O líder técnico para e leva ao Gabriel (Q15, Q17 e Q19).
- **Riscos aceitos pelo Gabriel:** nenhum.

### Rodada 4 (invocação nova, escopo reduzido pela Q19 (a): só a §5 do `SEGURANCA.md` e o D11)

- **Veredito:** APROVADO COM RESSALVAS · bloqueante 0 · alta 0 · média 0 · baixa 1 · informativa 3
  · 3 arquivos do escopo e 3 de apoio lidos. As cinco correções da Q19 conferidas; as quatro formas
  continuam seguras; nenhuma regra nova abre pedido antes recusado.
- **Achados (nenhum corrigido nesta change, por decisão do Gabriel: sem nova passagem):**
  - B-01 · AS-01 · baixa · hipótese · `docs/SEGURANCA.md` §5 e D11 · a busca por commit usa
    `main..HEAD` com a `main` local; um commit local fora do `origin/main` sairia no push sem busca
    · critério: o intervalo cobre todo commit que o push publica (`origin/main..HEAD` depois de
    atualizar, ou `main` local igual ao `origin/main` registrada antes da busca). **Nesta change:**
    P1 e P2 mostram `main` e `origin/main` iguais (`33077f4`), então o caso não ocorre.
  - I-01 · AS-01 · informativa · confirmado · §5 · "nenhum código lê o ambiente de forma dinâmica"
    é impreciso: `ambiente.ts:42` e `purgar-dado-pessoal.mjs:36` leem `process.env[nome]` com nomes
    literais de quem chama, e `iniciar-servidor.mjs:39` repassa o ambiente inteiro ao filho, sem
    imprimir · critério: dizer o que conta como dinâmica e citar os três pontos.
  - I-02 · AS-15 · informativa · confirmado · D11 · a pré-condição do `curl --version` e a rota
    restrita a `/` e `/processo-seletivo` estão só no D11, e a §5 é a fonte única · critério:
    passar a pré-condição para a §5, ou marcar no D11 como exigência só desta change.
  - I-03 · AS-15 · informativa · confirmado · §5, parágrafo do `<endereço>` · chama de "caminho"
    um valor que começa com `/`, e colide em nome com a lacuna `<caminho>` · critério: usar `<rota>`
    ou dizer que não é a lacuna.
  - **Encaminhamento:** os quatro vão como pendência para a `endurecer-agentes-e-git-local`, que
    mexe na §5.
- **Pedidos de comando**, como foram digitados, com `MSYS_NO_PATHCONV=1`:

```
P1 · git log --oneline -n 5 main
33077f4 Merge pull request #19 from Liga-Academica-Liacup/feat/layout-e-hero
(mais 4 linhas)
[código de saída: 0]

P2 · git log --oneline -n 5 origin/main
33077f4 Merge pull request #19 from Liga-Academica-Liacup/feat/layout-e-hero
(mais 4 linhas, iguais às do P1)
[código de saída: 0]
```

- **Riscos aceitos pelo Gabriel:** nenhum.

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum.

- **Conferido em 21/11/2026**, sobre `git status --porcelain --untracked-files=all`, depois de
  cada passagem e antes do `revisor`: 58 linhas.
- **`npm run verificar`** (líder técnico): código 0 · artefatos: 365 arquivos rastreados, 0
  indevidos · tokens: 97 arquivos varridos em `src/`, 0 problemas · chave de serviço: 476 arquivos
  varridos, 64 entregues ao navegador, 0 ocorrências · 22 dependências diretas · `git diff
  --exit-code` em `package.json`, `package-lock.json`, `src/proxy.ts`, `src/app/layout.tsx`,
  `lighthouserc.json`, `playwright.config.ts`, `.github/` e `tests/e2e/interruptor.spec.ts`:
  código 0. `npm test` (líder técnico): código 0, 113 de 113.
- **Arquivos fora do escopo, por agente:**
  - `especificador` · `docs/conteudo-institucional.md` (uma inserção no §5.1, a Q1 (b)), com
    autorização expressa do Gabriel no Portão 1.
  - `dev-frontend` · `scripts/medir-desempenho.mjs` e `README.md`, previstos no D13. **Desvio:**
    rodou `git rm` nos dois arquivos de aparência de botão e desfez com `git restore --staged` só
    nesses dois caminhos; o índice voltou ao de antes (`git diff --cached --name-only` vazio,
    conferido pelo líder técnico). Agente não escreve no Git.
  - `qa-acessibilidade` · nenhum. As violações do RP-12 em `src/` e `scripts/` voltaram ao byte
    original (`sha256sum -c` OK nos 7 arquivos).
  - `guardiao-visual` · nenhum.
  - **Líder técnico** · `docs/PADROES-DE-CODIGO.md` (§9, §10, §11), `docs/SEGURANCA.md` (§3, §5,
    §7), `.env.example`, `docs/REFERENCIA-VISUAL.md` (§7, Q3 (a)) e os artefatos desta change
    (checkboxes e esta seção).
- **Segunda passagem do Portão 2 (líder técnico, 21/11/2026):** com a autorização do Gabriel, o
  líder técnico editou, além dos documentos do seu escopo, o `docs/conteudo-institucional.md` (§5.1,
  placar do §8 e as linhas das etapas com maiúscula) e o `src/features/processo-seletivo/conteudo.ts`
  (as mesmas linhas das etapas, só texto), e a spec e o design no mesmo ponto. Depois: `npm test`
  código 0, 118 de 118; `npm run build` código 0; `npx playwright test` código 0, 322 de 322, com
  `iguais: 40 de 40` e `etapas … na página: 5` nas 7 larguras. Os lados a lados afetados
  (`lado-a-lado-processo-seletivo-{390,1280}.png`) foram refeitos pelo script do `guardiao-visual`
  no scratchpad, sem nova passagem dele; os outros 7 PNG ficaram os aprovados (o script também
  regerou o cabeçalho, o hero e o menu, com diferença de bytes sem mudança de conteúdo, e o líder
  técnico os devolveu à versão aprovada). Raiz não publicada: 0 de 329.160 e 0 de 1.024.000 pixels
  diferentes.
- **Critério literal da 3.3:** `git grep -c DEMO-RP12` dá código 0 antes e depois das
  demonstrações, porque o nome da marca aparece no `tasks.md` desta change e no relatório
  arquivado da `layout-e-hero`. Rodado pelo líder técnico, restrito ao código: `git grep -c
  DEMO-RP12 -- src scripts tests` código 1, e `grep -rc` (inclui não rastreados) sem nenhum
  arquivo com contagem acima de 0. Vai como desvio no Portão 2.
