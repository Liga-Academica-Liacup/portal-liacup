# Dado pessoal no Portal LIACUP

**Feature de origem**: F02 — camada de dados · **Requisitos**: FR-019, FR-020, FR-025 a FR-027

Este documento existe para uma pergunta que a liga vai receber mais cedo ou mais tarde, de alguém que
escreveu pelo formulário: **o que vocês guardam de mim, por quê, e por quanto tempo?** A resposta
precisa estar escrita antes de a pergunta chegar.

Ele descreve o que o **banco de dados** faz. A política de privacidade publicada no site é da
**F24**, e vai se apoiar neste texto.

---

## 1. O que o portal guarda

Só duas coisas, e as duas vêm do formulário de contato.

### 1.1 A mensagem

| Campo | Para quê |
| --- | --- |
| Nome | Saber a quem responder |
| E-mail | Ter como responder |
| Assunto | Encaminhar para a pessoa certa da diretoria |
| Texto | A mensagem em si |
| Situação | Se já foi lida, respondida ou arquivada |
| Recebida em | **Onde o prazo de retenção começa a contar** |

**Não há campo de endereço de IP na tabela de mensagens** — nem em claro, nem resumido. Isso mantém
verdadeira, ao pé da letra, a frase do ADR-0001 §3.

### 1.2 O controle de origem

Guarda um **resumo irreversível** do endereço de quem enviou, e o momento. Serve para uma coisa só:
responder "esta mensagem veio da mesma origem da anterior?", que é o que permite conter alguém
enchendo o formulário automaticamente.

**Fica numa tabela separada, de propósito.** Assim ele não é lido junto com a mensagem por acidente,
e tem prazo próprio — muito mais curto.

**Por que resumo e não o endereço.** O resumo usa um **sal secreto**, guardado como variável de
ambiente e trocável a qualquer momento. Sem o sal, ou com sal público, o resumo seria reversível: o
espaço de endereços IPv4 inteiro tem cerca de 4,3 bilhões de valores, e uma máquina comum percorre
isso em minutos montando a tabela inversa completa. Não existe resumo forte o bastante para um
espaço desse tamanho — **o que protege é o segredo**. Trocar o sal invalida todos os resumos
anteriores de uma vez, que é exatamente o que se espera de uma rotação.

---

## 2. Finalidade, base legal e prazo

| Item | Valor |
| --- | --- |
| **Finalidade declarada** | Receber e responder contatos de quem procura a liga |
| **Base legal** | Legítimo interesse na comunicação institucional |
| **Prazo das mensagens** | **24 meses** a partir do recebimento |
| **Prazo do controle de origem** | **24 horas** a partir do registro |
| **Purga** | Procedimento manual documentado, **executado e verificado** na F02 |
| **Automação da purga** | **F25** — adiamento registrado, ver seção 4 |

Os dois prazos são muito diferentes porque os dois dados são muito diferentes. A mensagem é uma
conversa que a liga pode precisar retomar; o resumo de origem é um controle operacional que perde a
utilidade no dia seguinte.

---

## 3. Como o dado é apagado

Um comando só, com os dois prazos dentro:

```bash
npm run purgar:dado-pessoal
```

O procedimento em linguagem de quem opera o portal está no [README](../README.md), seção **"Apagar
dado pessoal"**. Dois mecanismos de purga são, na prática, um que ninguém executa.

**A remoção é definitiva e não tem como desfazer.** É deliberado: guardar "apagado, mas ainda ali"
não é apagar, e a pessoa que pediu para sair do banco não saiu.

Vale notar o contraste com o resto do portal. Para o conteúdo — notícias, eventos, projetos —
**apagar arquiva**, e a remoção definitiva é recusada até para a diretoria, por duas camadas
independentes no banco. A purga de dado pessoal é a **única** operação do sistema que remove de
verdade, e ela roda com a credencial de serviço, fora do alcance de qualquer tela.

---

## 4. O que ainda não é automático, e está escrito assim

O **ADR-0001, risco R6, promete purga automática**. A F02 entrega o procedimento **manual**, e isso é
um **adiamento registrado**, não uma escolha livre: montar um agendador só para isto, antes de
existir o agendador que a F25 vai criar de todo jeito, é trabalho jogado fora.

O adiamento está registrado em três lugares, para não evaporar:

1. na spec da F02 e neste documento;
2. na linha da **F25** do plano de desenvolvimento, que é a **dona nominal** da automação;
3. no fato de o procedimento manual ter sido **executado** na F02, com dados envelhecidos de
   propósito — 5 registros removidos, 2 dentro do prazo preservados.

**Enquanto a F25 não chega, o prazo depende de alguém rodar o comando.** Isto é o que está
efetivamente no ar hoje, e é assim que deve ser lido.

---

## 5. O que o portal não faz

- **Não usa rastreadores nem medição de audiência.** O analytics está registrado como adiado no
  plano de desenvolvimento, e nada foi instalado.
- **Não guarda endereço de IP em claro**, em nenhuma tabela.
- **Não registra dado pessoal em log de erro.** Os logs levam a mensagem técnica da falha e nada
  mais — quem investiga um erro não precisa saber quem estava do outro lado.
- **Não compartilha dado com terceiros**, com uma exceção necessária e nomeada: o envio de e-mail
  passa pelo serviço do ADR-0002, que vê o e-mail de destino porque é o que entrega a mensagem.
