# Modelo de dados — F02 Camada de dados

**Data**: 2026-08-21 · **Spec**: [spec.md](./spec.md)

Esta é a primeira feature do projeto que **tem** modelo de dados. O esboço do ADR-0001, seção 3,
vira aqui o modelo definitivo — o próprio ADR manda não tratá-lo como fechado.

---

## 1. O que toda coleção de conteúdo tem

Onze das doze coleções são de conteúdo e compartilham a mesma base. Definir isso uma vez evita que
cada tabela invente a sua.

| Campo | Para quê | Vem de |
| --- | --- | --- |
| Identificador | Chave do registro | — |
| **Publicado** | Distingue rascunho de publicado | FR-002 |
| **Arquivado** | Apagar arquiva em vez de remover | FR-028, clarify Q3 |
| Criado em | Quando o registro nasceu | FR-003 |
| **Alterado em** | Quando mudou pela última vez — **e é também a marca de versão** do FR-031 | FR-003, FR-031 |
| Autor | Quem criou | ADR-0001 §3 |
| Ordem | Posição quando a exibição é ordenada à mão | protótipo |

**O campo "alterado em" faz dois trabalhos**, e é deliberado: ele registra a última alteração *e*
serve de marca de versão para a detecção de edição concorrente. Quem salva informa qual versão
abriu; se não bater, a escrita é recusada. Um campo a menos para manter em sincronia.

**O autor não é vínculo obrigatório**: quando alguém sai da diretoria, o conteúdo **não vai junto**.
O portal sobrevive à troca de gestão — é o Princípio I aplicado ao esquema.

---

## 2. As doze coleções

### Conteúdo do site público — onze

| Coleção | Campos próprios | Origem |
| --- | --- | --- |
| **Notícias** | título, resumo, corpo, imagem, **link externo**, data | protótipo · ADR-0001 §3 |
| **Eventos** | título, descrição, **data do evento**, local, **passado**, inscrição | protótipo · ADR-0001 §3 |
| **Projetos** | título, descrição, **eixo** | `conteudo-institucional.md` §3 |
| **Materiais** | título, descrição, arquivo, tipo | protótipo |
| **Recomendações de leitura** | título, autoria, referência, link | protótipo |
| **Ligantes** | nome, cargo, curso, foto, **é diretoria** | `conteudo-institucional.md` §4.3 |
| **Docentes orientadores** | nome, titulação, formação, foto | `conteudo-institucional.md` §4.1 |
| **Álbuns da galeria** | título, descrição, data, capa | protótipo |
| **Fotos da galeria** | álbum, arquivo, legenda | protótipo |
| **Conteúdos educativos** | título, descrição, formato, link | protótipo |
| **Perguntas frequentes** | pergunta, resposta | `conteudo-institucional.md` §6 |

**O eixo dos projetos é lista fechada**: ensino, extensão, pesquisa e secretaria. Valor fora dela é
recusado pelo banco, não pela tela — o mesmo raciocínio das uniões fechadas da F01. O
`conteudo-institucional.md` §3 registra que o texto da **secretaria é provisório** e ainda depende de
confirmação da liga; isso vai no dado de exemplo como espaço reservado marcado.

### Mensagens — a única com dado pessoal

| Campo | Observação |
| --- | --- |
| Nome, e-mail, assunto, texto | **Dado pessoal de terceiros** |
| **Recebida em** | Marca o início dos 24 meses de retenção (FR-018) |
| Situação | Não lida, lida, arquivada |

**Nenhum endereço de IP nesta tabela**, nem em claro nem resumido. É o que mantém literalmente
verdadeira a frase do ADR-0001 §3.

### A tabela de controle de origem — separada de propósito

| Campo | Observação |
| --- | --- |
| **Resumo do endereço** | Irreversível, com sal secreto e rotacionável (FR-027) |
| Momento | Para a janela de tempo do limite |

Apagada em **24 horas** pelo **mesmo** procedimento de purga das mensagens — não há um segundo
mecanismo, porque dois procedimentos de purga é um que ninguém executa.

**Por que separada**: ela é o que torna o limite do ADR-0002 E3 possível sem violar o "IP não
armazenado" do ADR-0001. A separação não é organização, é o que faz as duas afirmações continuarem
verdadeiras ao mesmo tempo.

**Resumo de IP é dado pessoal pseudonimizado sob a LGPD, não dado anônimo.** Por isso tem prazo
próprio, e não porque "é só um hash".

---

## 3. Ciclo de vida de um conteúdo

```text
rascunho ──publicar──► publicado ──despublicar──► rascunho
    │                      │
    └──────arquivar────────┘
                │
                ▼
           arquivado ──restaurar──► volta ao estado anterior
```

| Estado | Público vê? | Diretoria vê? |
| --- | --- | --- |
| Rascunho | **Não** | Sim, na lista normal |
| Publicado | Sim | Sim |
| Arquivado | **Não** | Sim, **na lista de arquivados** |

**Arquivado não é sinônimo de apagado.** A diretoria precisa conseguir **listar e restaurar pelo
painel** (FR-029) — se só quem tem acesso ao banco consegue, é backup com outro nome. A **tela** que
faz isso é da **F16**, já registrada no `PLANO-DE-DESENVOLVIMENTO.md`.

**Arquivar um álbum arquiva as fotos dentro dele**, e restaurar traz as duas coisas de volta
(FR-030).

---

## 4. Edição concorrente

Quem abre um registro para editar recebe também a marca de quando ele foi alterado pela última vez.
Ao salvar, devolve essa marca. Se ela não bater com a do banco, **a escrita é recusada**.

**A recusa devolve o conteúdo que a pessoa tentou salvar** (FR-032). Isto não é detalhe de tela: se a
recusa descartar o texto, trocamos perda silenciosa por perda barulhenta, que é pior — a pessoa vê o
aviso **e** perde o trabalho.

A redação da mensagem é da **F17**. O que a F02 garante é que o esquema sustenta as duas coisas: a
detecção e a devolução.

---

## 5. Retenção de dado pessoal

| Item | Valor |
| --- | --- |
| **Finalidade declarada** | Receber e responder contatos de quem procura a liga |
| **Base legal** | Legítimo interesse na comunicação institucional |
| **Prazo** | **24 meses** a partir do recebimento |
| **Purga** | Procedimento **manual documentado e testado** nesta feature |
| **Automação** | **F25** — ver abaixo |

**O ADR-0001, risco R6, já prometia "purga automática".** A decisão de manter manual nesta feature é
**adiamento registrado**, não escolha livre: criar um segundo agendador antes do que vai ficar é
desperdício. O adiamento está em três lugares — na spec, na linha da F25 do plano de desenvolvimento,
e no fato de o procedimento manual ser **executado ao menos uma vez** aqui (FR-025).

Procedimento escrito e nunca executado é procedimento que não funciona.

---

## 6. Dados de exemplo

| Onde há conteúdo aprovado | Onde não há |
| --- | --- |
| **Usa o texto real**, sem reescrita: os quatro eixos, as duas orientadoras, o FAQ inteiro, os indicadores da home, o e-mail e o Instagram | **Espaço reservado visivelmente marcado**, impossível de confundir com informação verdadeira |

A regra vem do Princípio VI e de uma lição registrada: na v1 do protótipo foram inventados e-mail,
endereço e cargos plausíveis o bastante para alguém tomar por verdadeiros, e isso ainda consta como
correção obrigatória em `conteudo-institucional.md` §7.

**As correções obrigatórias já conhecidas entram corretas desde o primeiro dado**: e-mail
`liacup.unb@gmail.com`, FCTS · Campus UnB Ceilândia, os **6** cargos do Estatuto, e
"Kerolyn Ramos Garcia".

Cada coleção recebe registros suficientes para exercitar **lista, item único e coleção vazia** — o
terceiro é o estado que o `EstadoVazio` da F01 existe para desenhar, e sem dado ele nunca é
verificado.
