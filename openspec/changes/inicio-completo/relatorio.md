# Relatório — inicio-completo

Copiado de `openspec/changes/MODELO-relatorio.md` no começo da change. Cada agente escreve a
própria seção; a do agente que não entrou recebe uma linha dizendo por quê. Número quando houver
número. Incompleto declarado incompleto.

## especificador

- **Artefatos:** em `openspec/changes/inicio-completo/`: `proposal.md` (231 linhas), `design.md`
  (267), `tasks.md` (118), `specs/pagina-inicial/spec.md` (211) e este `relatorio.md`. O
  `.openspec.yaml` é do líder técnico. **13 tarefas** de 15 · `pagina-inicial`: **8 requisitos
  ADDED**, 23 cenários, nenhum MODIFIED nem REMOVED. Nenhuma outra spec muda (motivo de cada uma na
  proposta, em Capabilities).
- **Questões em aberto** (opções, custo e recomendação na proposta, "Questões para o Portão 1"; as
  specs seguem a recomendação):
  - Q1. Rótulos dos números: (a) os do protótipo; (b) só as palavras do §9; (c) o Gabriel escreve.
    Recomendo (a).
  - Q2. Título da faixa: (a) "Processo seletivo"; (b) outro. Recomendo (a).
  - Q3. Botão da faixa: (a) "Quero participar"; (b) "Processo seletivo"; (c) outro. Recomendo (a).
  - Q4. Topo do contato: (a) "Contato" e "Onde a Liga responde", sem frase; (b) com a frase do
    protótipo, no §1; (c) "Fale com a Liga". Recomendo (a).
  - Q5. "Mandar uma mensagem": (a) sai; (b) fica e leva a `/contato`; (c) leva a `/contato` como
    "Fale com a Liga". Recomendo (a).
  - Q6. Moldura dos quadros (cartão e círculo de 104 px contra 100): (a) variante "cartão" do
    quadro, link no cartão inteiro; (b) moldura em volta, com o link só no miolo; (c) sem cartão.
    Recomendo (a).
  - Q7. Cor do cartão da faixa (lilás com creme mede 3,48:1): (a) `--color-accent-600`; (b)
    `--color-accent-800`. Recomendo (a).
  - Q8. "Chamadas para as páginas que existem" do plano, que o briefing não traz: (a) nenhum bloco a
    mais; (b) um bloco novo. Recomendo (a).
- **Apontado sem decidir** (proposta, seção "Apontado pelo especificador"): o §9 avisa que o "21"
  muda com o processo seletivo, e a tela vai dizer 21 até a homologação. A nota de reúso do I1 da
  `pagina-contato` não chegou ao briefing, e o critério dela não é acionado aqui.
- **Conferido:** a frase de 20/11 só aparece na `REFERENCIA-VISUAL.md` (linha 113) e em artefatos
  arquivados, e não em `openspec/specs/` nem em `src/` ou `tests/`. O resto da linha confere com o
  texto literal da Q9 (b) (`archive/2026-11-23-pagina-contato/relatorio.md`, linha 719). O
  `paginas-publicas.json` não precisa mudar. Medidas lidas no `prototipo/Portal-LIACUP.html` por
  busca de texto: o cartão do contato da inicial (grade `104px 1fr`, vão 20, preenchimento 18/22,
  fundo `--color-bg`, `--radius-lg`); o cartão da faixa (fundo `--color-accent`, texto
  `--color-bg`, círculo de 280 px); a grade dos números (`data-resp4`, 4 colunas, vão 18).
- **Classificação prevista do guardião:** **passo 1, checklist inteiro**, porque o
  `docs/SEGURANCA.md` entra no diff com as linhas de origem dos prints (tarefa 4.2) e está na lista
  do gatilho.
- **Incompleto:**
  - `npx openspec instructions` e `npx openspec validate inicio-completo --strict` **não foram
    rodados**: este agente não tem terminal. As regras e os templates foram lidos direto do schema
    `spec-driven` em `node_modules/@fission-ai/openspec/schemas/`. **Código de saída do validate:
    não medido.**
  - O número de linhas dos artefatos foi lido pelo número da última linha. Os caracteres do host do
    P23 (46) foram contados à mão.
  - Não medidos no protótipo, e deixados para o dev: o corte responsivo do `data-resp4` e do
    `.cta-box`, as fontes e o fundo dos cartões dos números, e o vão entre o hero e os números.
  - A proposta tem 231 linhas, mais que a da `pagina-contato` (192): o antes e o depois da linha
    113 e as oito Qn ocupam espaço. Pode passar dos cinco minutos de leitura.

## dev-frontend

Pendente: entra depois do Portão 1.

## dev-dados

Não entra: a change não tem banco, migração nem tipo gerado.

## guardiao-visual

Pendente: entra depois do Portão 1.

## qa-acessibilidade

Pendente: entra depois do Portão 1.

## revisor

Pendente: entra depois do Portão 1.

## guardiao-appsec

O guardião não escreve: o líder técnico registra o relatório em uma tela por passagem, com a lista
de achados inteira; a saída de comando e o aceite do Gabriel vão literais.

Pendente: entra depois do Portão 1.

## Líder técnico — conferência de escopo

Escopo de escrita é instrução, não trava: depois de cada passagem, o `git status` só pode mostrar
arquivos do escopo daquele agente. Escopos esperados — `especificador` `openspec/` ·
`dev-frontend` `src/` · `dev-dados` `src/` e `supabase/` · `guardiao-visual` prints da change ·
`qa-acessibilidade` `tests/` · `revisor` nenhum · `guardiao-appsec` nenhum.

- **Arquivos fora do escopo, por agente:** <agente · arquivo, ou "nenhum em nenhuma passagem">
