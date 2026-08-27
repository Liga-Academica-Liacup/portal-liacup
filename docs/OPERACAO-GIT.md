# Operação do Git — Portal LIACUP

**Versão 1 · 27 de agosto de 2026**

Este documento não ensina Git. Ele registra **quatro regras que já custaram trabalho perdido neste
repositório**, cada uma com o episódio que a pagou.

Elas existiam antes deste arquivo — e moravam **fora do repositório**, nas notas de projeto de quem
revisa. Foi assim que a mesma perda aconteceu **cinco vezes**: a lição acumulada nunca atravessou
para o lugar onde o trabalho acontece. É a classe de defeito que este projeto vem catalogando —
o documento existe e não está onde importa —, só que desta vez o documento era sobre não perder
documento.

O [`ADR-0005`](ADR-0005-modelo-de-branches.md) decide o **modelo** de branches. Este arquivo trata
da **operação diária** dele, e a seção 8 do [`PADROES-DE-CODIGO.md`](PADROES-DE-CODIGO.md) continua
sendo a regra de commits e branches.

---

## 1. Commitar e enviar ao fim de cada fase — não ao fim da feature

**A regra.** Toda fase de um `tasks.md` termina com `git add -A`, `git commit` e `git push`. Não se
espera a feature ficar pronta.

**Por que.** O GitHub Desktop **guarda a árvore de trabalho automaticamente** ao trocar de branch, e
não avisa. Trabalho não commitado desaparece sem pergunta e sem confirmação. Não é hipótese: foi o
primeiro dos cinco episódios, na F01.

**Por que enviar também, e não só commitar.** Commit que fica na máquina morre com a máquina. Três
dos cinco episódios foram trabalho que **existia localmente** e não estava no remoto — entre eles
sete commits da F02 e o commit do RP-13, que ficou **inalcançável** e só foi recuperado pelo reflog.

**Isto não afrouxa portão nenhum.** Commitar numa branch de trabalho não põe nada na `main`. Os
portões são o **pull request**, o ruleset **`main-protegida`** (ativo, alvo `main`, lista de dispensa
vazia) e as **revisões**. Nenhum dos três é tocado por um commit numa branch. O que atravessa sem
portão é o trabalho **não** commitado, que some sem deixar rastro.

**Commitar estado vermelho é correto.** O RP-12 exige que toda verificação nova seja vista falhando.
Um commit é o registro mais barato dessa execução. Fase que termina em vermelho declarado é história
útil.

---

## 2. Fechar o GitHub Desktop antes de usar o Git pelo terminal

**A regra.** Desktop fechado antes de rodar `git` no terminal.

**Por que.** Os dois competem pelo mesmo `.git/index.lock`. O Desktop deixa o arquivo preso, e o
comando do terminal falha com uma mensagem que não explica a causa. Já aconteceu aqui, e a saída
improvisada — renomear o `index.lock` para destravar — deixa um resto órfão em `.git/` que ninguém
mais sabe de onde veio.

---

## 3. Apagar branch de trabalho com `-d` minúsculo, pelo terminal

**A regra.**

```bash
git branch -d feat/F03-layout-base
```

Se ele **recusar** com *"not fully merged"*, **há commit não incorporado**. Leia antes de forçar.
Essa recusa é a única defesa automática que existe contra apagar trabalho.

**Nunca `-D` maiúsculo** sem ter lido o que ele vai levar.

### Os dois botões, porque um perde trabalho e o outro não

| Onde | O que apaga | Seguro? |
| --- | --- | --- |
| **GitHub Desktop** | A cópia **local** | **Não.** É `git branch -D`, sempre forçado |
| **Site do GitHub**, depois do merge | A branch **remota** | **Sim** — e ainda oferece *Restore branch* |

O botão do Desktop foi verificado no binário instalado (`app-3.6.4`): `deleteLocalBranch` monta
`["branch","-D",nome]`, e **não existe caminho com `-d` no código**. Ele nunca recusa. E é oferecido
justamente **depois de incorporar o PR** — que é exatamente quando pode haver commit posterior ao
merge. Foi assim que o commit do RP-13 ficou inalcançável.

O botão do site é seguro, e vale saber disso: medo do botão errado é o que leva alguém a nunca
apagar branch nenhuma, e daí a vinte branches velhas e à próxima confusão.

**O `BranchPruner` automático do Desktop está inocente**, e isso foi medido, não suposto: ele também
força, mas só considera branches que saem de `git branch --merged`, com filtro adicional de reflog de
14 dias. Os logs desta máquina não têm uma única linha `Pruned branch`. Suspeita não conferida vira
folclore, e folclore faz a próxima pessoa desconfiar da ferramenta errada.

---

## 4. Conferir o resultado, não a aparência

**A regra.** Ao encerrar qualquer trecho de trabalho, reportar **dois números**:

```bash
git status --porcelain | wc -l          # tem que ser 0
git rev-parse HEAD                       # tem que ser igual ao de baixo
git ls-remote origin <sua-branch>
```

**Pendências zero E os dois SHAs iguais.** Um mede a árvore; o outro prova que o remoto tem o
trabalho.

**Por que não basta o `git status -sb | head -1`.** Ele procura `[ahead N]`, e há dois casos em que
ele fica calado com trabalho preso: quando **não há commit** — arquivo `??` não deixa nada à frente
de nada — e quando a branch **não tem upstream**, em que o marcador simplesmente não aparece. Os dois
casos aconteceram aqui.

**Por que não basta contar pendências.** Zero pendências com o commit preso na máquina devolve o
mesmo zero que zero pendências com tudo enviado. Foi essa diferença que custou os sete commits da
F02.

É o **RP-12 aplicado à conferência operacional**: `git status` confirma que a configuração local
*parece* limpa; comparar os SHAs confirma que o **resultado** pretendido — o trabalho estar onde os
outros olham — aconteceu.

---

## 5. Por que nenhuma verificação automática pega isto

Vale escrever, para ninguém procurar a proteção que não existe:

| Defesa | Por que é cega para trabalho não commitado |
| --- | --- |
| `git status -sb \| head -1` | Procura `[ahead N]`; sem commit não há nada à frente |
| **RP-13** (`verificar:artefatos`) | Pergunta o que está **rastreado**; arquivo `??` não é rastreado |
| CI | Só roda sobre o que foi **enviado** |
| Ruleset `main-protegida` | Só age quando alguém tenta **incorporar** |

O RP-13 impede que artefato gerado **entre**. Nada impede que trabalho de verdade **não entre**. Por
isso as regras acima são operacionais e não têm script: elas dependem de estarem escritas onde quem
trabalha lê — que é a razão de este arquivo existir.

---

## 6. O que ainda não está decidido

**Rebase contra merge para atualizar uma branch de trabalho.** O `ADR-0005` não menciona nenhum dos
dois — zero ocorrências de "rebase" e de "force". A F03 foi atualizada por rebase com envio forçado;
numa branch de uma pessoa é inofensivo, e a Fase 2 tem mais gente. *"Reescrevi a branch que você
tinha baixado"* não avisa ninguém.

Fica registrado como decisão pendente do ADR-0005: qual dos dois vale e, se for rebase, que ele
**para na branch de trabalho**.
