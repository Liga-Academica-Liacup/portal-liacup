# Checklist de validação — Portal LIACUP

Aplicado por mim em **toda** feature, antes de passar para o pente fino do Gabriel.
Regra: cada item é respondido com **evidência** — um número, uma saída de comando, uma captura de tela. Nunca com adjetivo.

**Feature:** ____________ **Data:** ____________ **Branch:** ____________

---

## A. Fidelidade à spec

| #   | Item                                                                          | Como verifico                        | Resultado |
| --- | ----------------------------------------------------------------------------- | ------------------------------------ | --------- |
| A1  | Todo requisito da spec tem implementação correspondente                       | Percorro a spec item a item          |           |
| A2  | Todo critério de aceite passa                                                 | Executo cada um                      |           |
| A3  | Nada foi implementado **além** da spec                                        | Leio o diff procurando extras        |           |
| A4  | Divergências entre spec e código foram reportadas, não corrigidas em silêncio | Confiro o relatório do desenvolvedor |           |

## B. Não quebrou nada

| #   | Item                               | Como verifico                                                     | Resultado |
| --- | ---------------------------------- | ----------------------------------------------------------------- | --------- |
| B1  | Build passa                        | `npm run build`                                                   |           |
| B2  | Tipos passam                       | `tsc --noEmit` — zero erro                                        |           |
| B3  | Análise estática passa             | `npm run lint` — zero erro                                        |           |
| B4  | Testes passam                      | `npm test` — total e falhas                                       |           |
| B5  | Fluxos críticos seguem funcionando | Teste de ponta a ponta: login, publicar, excluir, enviar mensagem |           |

## C. Responsividade

| #   | Item                                                              | Como verifico                                 | Resultado |
| --- | ----------------------------------------------------------------- | --------------------------------------------- | --------- |
| C1  | Sem rolagem horizontal em 360, 390, 430, 480, 768, 1024 e 1280 px | `scrollWidth === clientWidth` em cada largura |           |
| C2  | Nenhum elemento ultrapassa a largura da tela                      | Varredura de `getBoundingClientRect`          |           |
| C3  | Cabeçalho fixo ocupa no máximo 64 px no mobile                    | Medição                                       |           |
| C4  | Nenhuma tabela com rolagem lateral no mobile                      | Inspeção das telas de lista                   |           |
| C5  | O desktop continua idêntico ao aprovado                           | Comparação visual em 1280 px                  |           |

## D. Acessibilidade

| #   | Item                                                 | Como verifico                            | Resultado |
| --- | ---------------------------------------------------- | ---------------------------------------- | --------- |
| D1  | Zero violações automáticas                           | axe-core na página                       |           |
| D2  | Contraste AA em todo texto                           | Cálculo dos pares de cor usados          |           |
| D3  | Zero alvos de toque abaixo de 44 px no mobile        | Varredura de elementos clicáveis         |           |
| D4  | Navegação completa por teclado, com foco visível     | Percurso manual com Tab                  |           |
| D5  | Todo campo tem rótulo associado                      | Varredura de `label[for]` / `aria-label` |           |
| D6  | Imagens com texto alternativo adequado               | Inspeção                                 |           |
| D7  | Estrutura de títulos coerente, sem pular níveis      | Árvore de headings                       |           |
| D8  | Avisos de erro e sucesso anunciados a leitor de tela | Presença de `aria-live`                  |           |

## E. Segurança e dados

| #   | Item                                                        | Como verifico                      | Resultado |
| --- | ----------------------------------------------------------- | ---------------------------------- | --------- |
| E1  | RLS ativa em toda tabela tocada pela feature                | Consulta ao esquema                |           |
| E2  | Nenhuma chave secreta no cliente ou no repositório          | Varredura do bundle e do histórico |           |
| E3  | Entradas validadas no servidor, não só na tela              | Leitura do código de servidor      |           |
| E4  | Nenhum dado pessoal novo sem finalidade, base legal e prazo | Comparação com o documento de LGPD |           |
| E5  | Logs sem dado pessoal                                       | Inspeção das chamadas de log       |           |
| E6  | Permissão por papel respeitada                              | Teste com usuário de cada papel    |           |

## F. Desempenho

| #   | Item                                         | Como verifico               | Resultado |
| --- | -------------------------------------------- | --------------------------- | --------- |
| F1  | Lighthouse desempenho ≥ 90 em página pública | Execução em mobile simulado |           |
| F2  | Lighthouse acessibilidade ≥ 95               | Idem                        |           |
| F3  | Imagens otimizadas e dimensionadas           | Inspeção da rede            |           |
| F4  | Nada carregado que não seja usado na tela    | Análise do bundle           |           |

## G. Conteúdo

| #   | Item                                                  | Como verifico                         | Resultado |
| --- | ----------------------------------------------------- | ------------------------------------- | --------- |
| G1  | Nenhum texto inventado apresentado como real          | Leitura de todo texto novo            |           |
| G2  | Espaços reservados visivelmente marcados              | Inspeção visual                       |           |
| G3  | Textos institucionais idênticos ao aprovado pela liga | Comparação com o documento de revisão |           |
| G4  | Português correto, com acentuação                     | Revisão de texto                      |           |

## H. Manutenção

| #   | Item                                                          | Como verifico                                | Resultado |
| --- | ------------------------------------------------------------- | -------------------------------------------- | --------- |
| H1  | README atualizado se algo mudou no funcionamento              | Leitura                                      |           |
| H2  | Decisão técnica com alternativa real virou ADR                | Confiro se há decisão não registrada         |           |
| H3  | Dependência nova está justificada no plano                    | Comparação do `package.json` com o `plan.md` |           |
| H4  | Código compreensível por quem não participou                  | Leitura crítica do diff                      |           |
| H5  | Pendências registradas como tarefa, não como comentário solto | Varredura de `TODO` no código                |           |

---

## Veredito

- [ ] **Aprovado** — segue para o pente fino do Gabriel
- [ ] **Aprovado com ressalvas** — segue, com as pendências abaixo registradas como tarefa
- [ ] **Reprovado** — volta para o Claude Code

**Itens reprovados:**

**Pendências registradas:**

**Observação para o Gabriel — onde olhar com atenção:**

---

### Como eu reporto

Três linhas, sempre no mesmo formato:

1. **O que entrou:** a feature em uma frase.
2. **Checklist:** quantos itens passaram, quais falharam e o número que sustenta cada resposta.
3. **O que ficou:** pendências, riscos novos e o ponto onde seu olho vai render mais.
