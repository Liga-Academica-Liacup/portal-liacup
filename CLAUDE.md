# Portal LIACUP — regras para quem trabalha neste repositório

Este arquivo entra em toda sessão sozinho. Ele **aponta**, não repete: regra nova vai para o
documento de origem, não para cá.

## O projeto em cinco linhas

1. É o site da Liga Acadêmica Multiprofissional de Cuidados Paliativos da Universidade de Brasília.
2. Quem mantém são estudantes da saúde, sem formação em tecnologia, e a diretoria muda todo ano.
3. O público inclui pessoas vivendo o adoecimento de alguém próximo, e a maioria chega pelo celular.
4. Stack: Next.js, TypeScript, Supabase e Vercel. Código, nomes e commits em português.
5. O que está no ar hoje é a página "Portal em construção", até o lançamento da R1.

## O que ler antes de começar

| Documento                                                              | O que decide                                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`docs/constitution.md`](docs/constitution.md)                         | Os dez princípios e a hierarquia de decisão                                    |
| [`docs/PADROES-DE-CODIGO.md`](docs/PADROES-DE-CODIGO.md)               | Pastas, camadas, componentes, testes e os requisitos permanentes RP-01 a RP-14 |
| [`docs/REFERENCIA-VISUAL.md`](docs/REFERENCIA-VISUAL.md)               | O protótipo aprovado como gabarito, e o que pode ser diferente dele            |
| [`docs/conteudo-institucional.md`](docs/conteudo-institucional.md)     | Todo texto que vai ao ar. Nada é reescrito nem inventado                       |
| [`docs/PLANO-DE-DESENVOLVIMENTO.md`](docs/PLANO-DE-DESENVOLVIMENTO.md) | As releases, o ciclo de uma change e a definição de pronto                     |
| [`docs/EQUIPE-DE-AGENTES.md`](docs/EQUIPE-DE-AGENTES.md)               | Quem faz o quê, e o protocolo de retorno                                       |

Em conflito, vence o número menor da hierarquia da constitution. Conflito no mesmo nível: **parar e
perguntar ao Gabriel**. Os dez princípios não estão repetidos aqui — eles ficam no campo `context`
de [`openspec/config.yaml`](openspec/config.yaml), que o OpenSpec lê em toda geração de artefato.

## O ciclo de uma change

```
Gestor          briefing da change
Gabriel         cola no Claude Code
Líder técnico   /opsx:propose  ->  especificador escreve a proposta
PORTÃO 1        gestor revisa, Gabriel aprova
Líder técnico   /opsx:apply    ->  dev-frontend / dev-dados implementam
                               ->  qa-acessibilidade testa
                               ->  guardiao-visual compara com o protótipo
                               ->  revisor revisa o diff
Líder técnico   /opsx:archive  (antes do PR: a main é protegida)
Líder técnico   entrega arquivos + comandos Git + mensagem de commit
Gabriel         commit, push, PR  ->  Vercel gera a prévia
PORTÃO 2        gestor confere o PR, Gabriel olha a prévia e faz o merge
```

**Nenhuma linha de código sem proposta aprovada pelo Gabriel.** Se a spec estiver errada, pare e
reporte; não corrija por conta própria.

## Escopo de escrita é instrução, não trava

A lista de `tools` de um subagente concede capacidade — ler, escrever, rodar comando — e **não
restringe pasta**. Então o escopo de `especificador`, `dev-frontend`, `dev-dados`,
`guardiao-visual` e `qa-acessibilidade` vale por instrução. Só o `revisor`, sem nenhuma ferramenta
de escrita ou de terminal, tem trava de verdade.

**Obrigação do líder técnico:** depois de chamar qualquer subagente, conferir que o `git status` só
mostra arquivos do escopo daquele agente. Arquivo fora do escopo entra na seção 4 da entrega, pelo
nome.

Cada agente registra o que fez em `openspec/changes/<change>/relatorio.md`, copiado de
[`openspec/changes/MODELO-relatorio.md`](openspec/changes/MODELO-relatorio.md).

## Regras de Git

Nenhuma destas é preferência. Cada uma custou pelo menos um episódio de trabalho perdido.

1. **Quem escreve no Git é o Gabriel.** Os agentes preparam os arquivos e entregam os comandos
   prontos. Mensagem no padrão convencional, em português, **sem rodapé de coautoria**.
2. **Commitar e enviar ao fim de cada change ou de cada dia**, o que vier primeiro. Commit local
   não é cópia de segurança.
3. **Fechar o GitHub Desktop antes de usar o Git pelo terminal.** Ele faz stash automático ao
   trocar de branch e deixa `index.lock` preso. Foi assim que a spec da F01 sumiu.
4. **Apagar branch com `git branch -d`, minúsculo, pelo terminal.** O botão do GitHub Desktop
   equivale a `-D` e apaga mesmo com trabalho não incorporado.
5. **Conferir o resultado, não a aparência:** `git status --porcelain` vazio e `git rev-parse HEAD`
   igual ao `git ls-remote origin <branch>`.
6. **Uma change, uma branch curta**, incorporada em poucos dias. Nada de branch de semanas.
7. **O terminal do Gabriel é o Git Bash (MINGW64).** Todo comando entregue vem em sintaxe de bash.
   Mensagem de commit com mais de uma linha vai num arquivo temporário e entra com
   `git commit -F <arquivo>`.

## Modelo de entrega, obrigatório em todo portão

Fora a evidência literal, a entrega **cabe em uma tela**.

```markdown
### Portão <1 ou 2> · <nome-da-change>

**Estado:** <uma linha> · **Pede ao Gabriel:** <aprovar | decidir Qn | rodar os comandos Git>

**1. Decisões do Gabriel** (ou "Nenhuma.")
Qn. <pergunta em uma linha>

- (a) <opção> · custo: <...>
- (b) <opção> · custo: <...>
- Recomendo (x), porque <uma frase>.

A numeração Qn não muda entre rodadas da mesma change.

**2. Para o gestor conferir**
Branch `<nome>` · HEAD `<sha curto ou "sem commit">` · artefatos: `<caminhos>`
Comandos que reproduzem os números da seção 3: `<comandos>`

**3. Evidência**

| Comando | Código de saída | Contadores |
| ------- | --------------- | ---------- |

Saída literal curta quando ela for o critério de aceite; nunca resumo no lugar dela.

**4. Mudanças**
A <n> · M <n> · R <n> · D <n>. Arquivos fora do escopo esperado: <lista ou "nenhum">.

**5. Desvios do briefing e incompleto**

- Desvio: <o que, e por quê>
- Não feito ou não medido: <com essas palavras>

**6. Próximo passo**
Comandos em bash; mensagem de commit em arquivo, com git commit -F.
```

## O que nunca muda sem decisão escrita do Gabriel

- Paleta, fontes, borboletas e a estrutura das páginas do protótipo aprovado.
- Qualquer token existente em `src/estilos/tokens.css`. Token novo se cria; existente não se altera.
- Qualquer texto de `docs/conteudo-institucional.md`.
- Qualquer verificação do CI. Verificação não se afrouxa para fazer uma entrega passar.
