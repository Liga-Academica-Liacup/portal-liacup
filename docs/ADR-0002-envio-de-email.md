# ADR-0002 — Envio de e-mail transacional

- **Status:** Proposta — aguardando validação final do Gabriel
- **Data:** 19 de agosto de 2026
- **Relacionado a:** ADR-0001 (stack)
- **Restrição imposta pelo cliente:** custo recorrente zero. Se a única saída fosse paga, o recurso ficaria de fora.

---

## 1. Por que essa decisão existe

O portal precisa enviar e-mail em pelo menos quatro situações:

1. **Aviso de nova mensagem de contato** para a diretoria — sem isso, a caixa de entrada do painel só é vista por quem lembra de entrar nela.
2. **Confirmação para quem escreveu** — a pessoa que usa o "Fale com a Liga" precisa saber que a mensagem chegou.
3. **Recuperação de senha** do painel — sem isso, diretor que esquece a senha fica trancado do lado de fora, e alguém precisa mexer no banco.
4. **Convite de novo usuário** quando a diretoria muda — é o mecanismo de passagem de bastão do painel.

O item 3 é o que transforma isso de "bom ter" em requisito. Uma troca de gestão com senha perdida e sem recuperação por e-mail é exatamente o cenário que mata o portal.

**Descoberta que fecha a questão:** o serviço de e-mail embutido do Supabase envia **2 mensagens por hora** e a própria Supabase diz, na documentação, que ele serve para exploração, testes e projetos de brinquedo, e recomenda configurar SMTP próprio para qualquer outro uso. Não há SLA de entrega nem de disponibilidade. Ou seja: não dá para depender dele nem para recuperação de senha.

---

## 2. Opções consideradas

| Opção                                          | Gratuito?   | Volume                        | Avaliação                                                                                                                                                                                                   |
| ---------------------------------------------- | ----------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Serviço embutido do Supabase**               | Sim         | 2/hora                        | Descartado. O próprio fornecedor desaconselha fora de teste                                                                                                                                                 |
| **Resend**                                     | Sim         | 3.000/mês, 100/dia, 1 domínio | **Escolhido**                                                                                                                                                                                               |
| **Brevo**                                      | Sim         | ~300/dia                      | Plano B. Volume diário maior, porém mais peso de plataforma de marketing do que precisamos                                                                                                                  |
| **Gmail via SMTP** (a conta da liga já existe) | Sim         | ~500/dia                      | Descartado. Exige senha de aplicativo guardada como segredo, quebra se alguém ativa verificação em duas etapas ou troca a senha, e uso automatizado é área cinzenta nos termos. Frágil demais para sucessão |
| **Amazon SES**                                 | Não de fato | —                             | Descartado. Exige cartão cadastrado e a camada gratuita real depende de rodar dentro da AWS                                                                                                                 |
| **Nenhum envio de e-mail**                     | —           | —                             | Descartado. Sem recuperação de senha, o painel vira armadilha                                                                                                                                               |

---

## 3. Decisão

**Adotamos o Resend no plano gratuito**, com o domínio `liacup.com.br` verificado, usado em duas frentes:

1. Como **SMTP customizado do Supabase Auth**, atendendo recuperação de senha e convite de usuário.
2. Como **API de envio** do portal, atendendo aviso de nova mensagem e confirmação de recebimento.

### Por que o Resend

- 3.000 mensagens por mês e 100 por dia. Nossa estimativa realista é de 30 a 60 mensagens por mês — sobra folga de duas ordens de grandeza para picos de processo seletivo.
- Um domínio verificado é exatamente o que precisamos: teremos um.
- Integra como SMTP, que é o formato que o Supabase Auth pede.
- Sem marca do fornecedor no corpo do e-mail — importante para um portal institucional.

### Endereços definidos

| Endereço                     | Uso                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| `nao-responda@liacup.com.br` | Remetente de tudo que é automático                                                          |
| `contato@liacup.com.br`      | Endereço de resposta (`Reply-To`) nas confirmações, encaminhado para `liacup.unb@gmail.com` |

**Regra técnica que não pode ser violada:** o remetente é sempre `@liacup.com.br`, nunca `@gmail.com`. Enviar por um serviço externo usando um endereço `@gmail.com` como remetente falha na verificação de DMARC do Google e a mensagem cai em spam ou é rejeitada. O e-mail da liga continua sendo o `liacup.unb@gmail.com` — ele é para onde as coisas chegam, não de onde saem.

### DNS necessário no Registro.br

Ao verificar o domínio, o Resend fornece os registros. Serão necessários: SPF, DKIM e, recomendado, DMARC em modo de monitoramento no começo. Isso vai para o runbook de produção.

---

## 4. Consequências

**Positivas**

- Recuperação de senha funciona, então a troca de gestão não trava.
- Quem escreve para a liga recebe confirmação — melhora a percepção de que o portal é vivo.
- Custo recorrente segue zero. O domínio continua sendo o único gasto.

**Negativas e limites assumidos**

- Mais um fornecedor na conta da liga. Vai para a lista de contas do plano de sucessão.
- 100 mensagens por dia é teto rígido. Se um dia a liga quiser disparar comunicado para uma lista grande, isso não é o lugar — e não deve ser resolvido "dando um jeito" aqui.
- Retenção de 30 dias nos registros de envio. Suficiente para depurar, insuficiente para auditoria longa. Não é problema no nosso caso.

---

## 5. Riscos

| #   | Risco                                                             | Mitigação                                                                                                                                                              |
| --- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E1  | O Resend muda o plano gratuito                                    | O envio fica isolado atrás de uma única função do nosso código. Trocar de fornecedor é mexer em um arquivo, não no portal inteiro. Plano B nomeado: Brevo              |
| E2  | Configuração de DNS mal feita joga tudo em spam                   | Verificar entrega com uma ferramenta de teste antes do lançamento; deixar o passo a passo no runbook                                                                   |
| E3  | O formulário de contato vira porta de spam e queima a cota diária | Limite de envio por IP e por janela de tempo, campo armadilha invisível para robôs, e limite máximo de mensagens por hora. Nada de CAPTCHA de terceiro sem necessidade |
| E4  | A chave de API vaza                                               | Ela vive apenas como variável de ambiente no servidor. Nunca no cliente, nunca no repositório. Item já coberto no checklist de validação                               |
| E5  | Ninguém lê o e-mail da liga                                       | O aviso vai para o endereço da liga, e a caixa de entrada do painel mostra contador de não lidas. Redundância proposital                                               |

---

## 5.1 Adendo de 21/08/2026 — correção do E3

Levantado no `/speckit-clarify` da F02. O E3 acima manda mitigar spam com "limite de envio por IP e
por janela de tempo". O **ADR-0001** especifica a tabela `mensagens` com "data, **IP não
armazenado**". Os dois não podem valer como estão escritos: não se limita por IP sem guardar o IP.

**Correção do E3**: o limite passa a ser por **resumo irreversível do endereço de IP**, guardado em
**tabela separada da mensagem** e apagado em **24 horas**.

Por que isto precisa os dois ADRs em vez de sacrificar um:

- a frase "IP não armazenado" do ADR-0001 fala da **tabela de mensagens**, e continua
  **literalmente verdadeira**: nenhum IP, nem em claro nem resumido, é gravado junto da mensagem;
- o limite do ADR-0002 passa a ser implementável, porque o resumo é suficiente para reconhecer
  repetição vinda da mesma origem numa janela curta.

**Duas condições que não são detalhe:**

1. **O sal do resumo é secreto e rotacionável.** Sal fixo e público torna o resumo reversível por
   força bruta — o espaço de endereços IPv4 tem cerca de 4,3 bilhões de valores, que uma máquina
   comum percorre em minutos. Sem sal secreto, "resumo irreversível" é falso.
2. **A tabela é apagada em 24 horas pelo mesmo procedimento de purga das mensagens.** Não se cria um
   segundo mecanismo: dois procedimentos de purga é um que ninguém executa.

**Resumo de IP continua sendo dado pessoal pseudonimizado sob a LGPD, não dado anônimo.** É por isso
que ele tem prazo próprio e tabela própria, e não porque "é só um hash".

---

## 6. Escopo — o que **não** entra

- Newsletter e disparo em massa. Está na lista de evoluções futuras do documento de aceite e continua lá.
- Inscrição em evento por e-mail.
- Qualquer coisa que aproxime o portal de ferramenta de marketing.

---

## 7. Se a validação for negativa

Se você preferir não adicionar mais um fornecedor agora, a alternativa é: sem envio de e-mail no lançamento, com **duas condições obrigatórias** — a senha do painel é redefinida manualmente por quem tiver acesso ao Supabase, e isso fica escrito no manual de operação em destaque. Não recomendo, mas é uma decisão sua, e é reversível: dá para acrescentar o envio depois sem refazer nada.
