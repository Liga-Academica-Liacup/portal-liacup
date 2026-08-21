# Divergências e decisões — Estatuto × Edital × Formulário × Protótipo

**Aberto em 19/08/2026 · Fechado em 19/08/2026**
**Status: RESOLVIDO.** Todas as decisões tomadas pelo Gabriel. A F12 (Processo Seletivo) está liberada.

Este arquivo guarda o rastro completo: o que estava em conflito, o que foi decidido e o que aceitamos junto com a decisão. Se daqui a um ano alguém perguntar "por que o site diz 50% se o estatuto diz 75%", a resposta está aqui.

---

## Quadro de decisões

| #      | Conflito                                              | Decisão                                                                                                                | Quem decidiu              |
| ------ | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| D1     | Desligamento por falta: 50% (edital) × 75% (estatuto) | **Publicar 50%** — foi o que a liga pediu                                                                              | Gabriel, a pedido da liga |
| D2     | Desempate: arquivo criativo × IRA                     | **Não publicar.** Fica a cargo da liga, no edital                                                                      | Gabriel                   |
| D3     | Eixos: 3 (estatuto) × 4 com Secretaria (liga)         | **Publicar os 4**, como a liga pediu                                                                                   | Gabriel, a pedido da liga |
| D4     | Diretoria: 6 cargos (estatuto) × 8 (protótipo)        | **Os 6 do Art. 11º**                                                                                                   | Gabriel                   |
| D5     | Nome do cargo em disputa                              | **Não especificar cargo** na página. Fica genérico; a liga detalha no edital ou no formulário                          | Gabriel                   |
| D6     | Certificado: 1 ano × 2 semestres + 75% de presença    | **"A cada 2 semestres completos, emitido via SIGAA"** — sem a condição de presença                                     | Gabriel                   |
| Escopo | Inscrição no portal × Google Forms                    | **Página fica, inscrição não.** O portal traz informações, FAQ e edital; o botão redireciona para o formulário da liga | Gabriel                   |

---

## Riscos aceitos junto com as decisões

Registro do que fica em aberto no mundo real, mesmo com a decisão tomada. Nenhum deles bloqueia o desenvolvimento.

### RA1 — O site vai publicar uma regra diferente da do estatuto (D1)

O portal dirá que mais de 50% de faltas não justificadas leva ao desligamento. O Estatuto assinado, no Art. 4º § 6º, diz que menos de 75% de presença desliga automaticamente. A contradição continua existindo entre os dois documentos; o site apenas segue o edital.

**Detalhe que muda a recomendação:** o Estatuto, no Art. 28º, só pode ser alterado **após 1 ano** de vigência, mediante Assembleia Geral. Como ele é de 2026, mexer nele agora não é opção. Então o caminho prático não é emendar o estatuto — é **alinhar o texto do próximo edital**, que a liga controla e pode reescrever a qualquer momento.

**Sugestão para a liga, sem urgência:** no Edital 03, usar a mesma formulação do estatuto. Custo zero, e some a contradição.

### RA2 — "Secretaria" aparece como frente de trabalho, e o estatuto a trata como cargo (D3)

O Estatuto (Art. 2º) organiza a liga no tripé ensino-pesquisa-extensão, e o formulário que os candidatos estão preenchendo agora diz "3 eixos". Secretaria, no Art. 11º IV, é cargo da diretoria.

**Mitigação que proponho, e que resolve sem contrariar a liga:** na página Projetos, chamar os quatro blocos de **"frentes de trabalho"** ou **"áreas de atuação"**, e não de "eixos". A liga tem as quatro frentes que pediu, e o site deixa de afirmar que a liga tem quatro eixos — o que contradiria o estatuto e o próprio formulário. É mudança de uma palavra.

Se você preferir "eixos" mesmo assim, é só dizer e eu uso.

### RA3 — Falta o texto da frente "Secretaria"

Ensino, Extensão e Pesquisa têm descrição pronta no Estatuto, Art. 2º. Secretaria não tem, porque lá ela é cargo. Preparei uma proposta a partir das atribuições do Art. 15º — está em `conteudo-institucional.md`, **claramente marcada como proposta**. Não vai para o ar sem a liga confirmar ou reescrever.

### RA4 — O edital tem dois itens "7.4" e um link de formulário não conferido

Ao publicar o edital no portal, renumero o segundo 7.4 para 7.5 e o seguinte para 7.6, mantendo o texto intacto. E continua valendo o pedido: confira se `forms.gle/17pXRp9WESirg1vh6` leva ao mesmo formulário do link longo que você me passou. Link errado no edital é inscrição perdida.

---

## O que muda no produto

| Página                | Efeito                                                                                                                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Processo Seletivo** | Liberada. Traz apresentação, pré-requisitos, etapas, cronograma, FAQ e o edital vigente. Botão "Fazer inscrição" abre o formulário da liga em nova aba. Sem critério de desempate e sem cargo específico |
| **Projetos**          | Quatro frentes: Ensino, Extensão, Pesquisa e Secretaria                                                                                                                                                  |
| **Equipe**            | Seis cargos do Estatuto, Art. 11º                                                                                                                                                                        |
| **Contato e rodapé**  | E-mail e endereço corrigidos                                                                                                                                                                             |

Os textos finais estão em `conteudo-institucional.md`, seções 3, 4 e 5.
