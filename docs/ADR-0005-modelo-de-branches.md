# ADR-0005 — Modelo de branches

- **Status:** Aprovado
- **Data:** 21 de agosto de 2026
- **Decisor:** Gabriel Andrade Almeida
- **Relacionado a:** ADR-0001 (stack e hospedagem) · seção 8 do `PADROES-DE-CODIGO.md`
- **Origem:** o Gabriel levantou que o projeto precisa de um modelo de branches escrito. Está certo:
  viemos seguindo um por convenção desde a F00, sem nunca registrar. Isto deveria ser ADR desde
  aquela feature.

---

## 1. O problema

Duas features já foram entregues seguindo um modelo que ninguém escreveu. Funcionou porque somos
poucos e a convenção era óbvia para quem estava aqui — que é exatamente a definição de conhecimento
que se perde na troca de gestão.

Além disso, há uma lacuna real: **não existe procedimento de correção urgente**. Depois da F26 o
site está no ar, e "o que fazer quando o portal quebra numa sexta à noite" não pode ser inventado na
hora.

---

## 2. Decisão

**Adotamos GitHub Flow, acrescido do caminho de correção urgente.**

### 2.1 As regras

| Regra | Detalhe |
| --- | --- |
| `main` é sempre publicável | É o que a Vercel põe em produção. Incorporou, está no ar |
| Uma branch por feature, saindo da `main` | Nunca de outra branch de trabalho |
| Alteração proposta obrigatória | Nada entra na `main` por push direto |
| CI verde obrigatório | Sem exceção, e a proteção do ramo está configurada, não combinada |
| A branch é apagada depois de incorporada | Branch viva depois do merge é confusão futura |

### 2.2 Prefixos

| Prefixo | Para | Exemplo |
| --- | --- | --- |
| `feat/` | Feature nova | `feat/F02-camada-de-dados` |
| `fix/` | Correção de defeito | `fix/rolagem-horizontal-em-360` |
| `docs/` | Só documentação | `docs/ADR-0005-modelo-de-branches` |
| `chore/` | Manutenção sem efeito no produto | `chore/atualiza-playwright` |

Branch de feature do plano de desenvolvimento carrega o código dela: `feat/F02-...`, `feat/F13-...`.

### 2.3 Mensagem de commit

`tipo: descrição em português, no imperativo`

É o padrão que já usamos de fato desde a F00. Os tipos são os mesmos prefixos de branch, mais
`test:` e `refactor:` quando couber. O corpo da mensagem explica **por que**, não o que — o diff já
diz o que.

### 2.4 Correção urgente

**Esta é a lacuna que o GitFlow tinha resolvido e nós não tínhamos.** Depois da F26 o portal está no
ar, e a diretoria não sabe consertar código.

O procedimento é **o mesmo fluxo, com prioridade de revisão** — e é deliberado que seja o mesmo:

1. **Branch `fix/` a partir da `main`.** Nunca a partir de branch de trabalho, nunca direto na
   `main`.
2. **A correção é a menor possível.** Uma correção urgente que também "aproveita para arrumar
   aquilo" deixa de ser urgente e vira feature disfarçada.
3. **Alteração proposta, com `URGENTE` no título.** O CI roda inteiro, como sempre.
4. **CI verde continua obrigatório.** Um portal quebrado é ruim; um portal quebrado de duas formas
   diferentes é pior. As verificações levam minutos.
5. **Incorporar assim que o CI passar**, sem esperar revisão longa. A publicação é automática.
6. **Depois de estabilizar, registrar o que aconteceu**: o que quebrou, o que faltou pegar e se vira
   verificação nova. Correção urgente que não vira aprendizado volta.

**O que NÃO fazer**, escrito porque é a tentação do momento: não empurrar direto na `main`, não
desligar a proteção "só desta vez", não usar `--no-verify`. Se o CI está impedindo a correção de
uma emergência, isso é informação sobre o CI — vira tarefa, não exceção.

### 2.5 Uma exceção histórica, já registrada

A **F00 foi desenvolvida direto na `main`**, como exceção de arranque: não havia CI nem proteção a
respeitar ainda, e o primeiro CI precisa rodar uma vez para que as verificações passem a existir e
possam ser exigidas. Está registrado na spec da F00 e no README. **Da F01 em diante, sempre branch.**

---

## 3. Alternativa recusada: GitFlow

O Gabriel propôs GitFlow. Recomendei contra e ele acatou. Os motivos ficam registrados aqui porque
**alguém vai propor GitFlow de novo daqui a seis meses** — é o modelo mais conhecido, e a resposta
precisa estar pronta em vez de ser reconstruída do zero.

Não é que o GitFlow seja ruim. É que ele resolve problemas que este projeto não tem, e cobra por
isso.

### 3.1 Foi desenhado para outro tipo de software

O GitFlow foi publicado para software **versionado, com várias linhas de release vivas ao mesmo
tempo** — o caso de quem mantém a 2.3 e a 3.0 em paralelo porque há clientes em cada uma.

O próprio autor acrescentou depois uma nota ao artigo original dizendo que, para aplicação web de
**entrega contínua**, um fluxo mais simples costuma servir melhor. Este portal é exatamente isso:
uma aplicação web, uma versão viva, publicada continuamente.

### 3.2 Quebraria a propriedade mais valiosa que temos

A Vercel publica a `main`. Hoje vale: **incorporou, está no ar.**

Com `develop` como branch de integração, produção passa a ficar atrás por um merge de `develop` para
`main` que **ninguém é responsável por disparar**. Numa liga em que a diretoria troca todo ano, um
passo que depende de alguém lembrar é um passo que não acontece.

### 3.3 `release/*` estabiliza versão numerada, e não há versão

O papel da branch de release é congelar um conjunto de mudanças para estabilizar antes de publicar
com número. Aqui não há número de versão, não há congelamento e não há janela de publicação: o que
está pronto vai ao ar.

### 3.4 Dobraria o CI e enfraqueceria a evidência

Duas incorporações por feature fazem o CI rodar duas vezes — o dobro de minutos no plano gratuito,
para verificar o mesmo código.

E, pior que o custo: a evidência que hoje é **"CI verde na `main`"** viraria "verde no `develop`, e
depois torça para o merge para `main` não trazer surpresa". Todo o aparato de verificação da F00
existe para que a `main` seja confiável; um degrau intermediário dilui isso.

### 3.5 O `develop` viraria tronco desprotegido

A proteção de branch está configurada na `main`. Com GitFlow, o trabalho real passaria a acontecer
contra o `develop`, que precisaria da própria proteção — mais configuração para manter, e uma
segunda chance de alguém esquecer.

### 3.6 `develop` integra trabalho de várias pessoas, e somos um

A razão de existir do `develop` é acumular o trabalho de vários desenvolvedores antes de uma
release. Aqui é **um desenvolvedor, uma feature por vez**, com pontos de parada de revisão entre
elas. Não há o que integrar.

---

## 4. Consequências

**Positivas**

- O modelo que já seguíamos passa a estar escrito, e quem herdar o projeto encontra a regra.
- A lacuna real — correção urgente — ganha procedimento, antes de existir urgência.
- "Incorporou, está no ar" continua valendo, e é a propriedade que torna a publicação confiável.

**Negativas e limites assumidos**

- Sem branch de release, não dá para congelar um conjunto de mudanças e estabilizar antes de
  publicar. Se um dia o portal precisar disso — por exemplo, para uma versão apresentada num evento
  em data marcada —, isto aqui será reaberto.
- Toda correção urgente paga o tempo do CI. É aceito conscientemente: são minutos, e é o que impede
  que uma correção apressada quebre outra coisa.

---

## 5. Como revisitar

Reabrir se: (a) o projeto passar a ter mais de um desenvolvedor trabalhando ao mesmo tempo em
features que se sobrepõem; (b) surgir necessidade de versão numerada com mais de uma linha viva;
ou (c) a publicação automática a partir da `main` deixar de ser possível. Alteração vira ADR novo
que substitui este, não edição deste.
