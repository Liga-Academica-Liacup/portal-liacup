# ADR-0004 — Tamanho dos controles, tipografia do botão e verificação de fidelidade

- **Status:** Aprovado
- **Data:** 20 de agosto de 2026
- **Decisor:** Gabriel Andrade Almeida
- **Relacionado a:** ADR-0003 (tokens e acessibilidade) · Princípios II, III e VI da constitution
- **Origem:** levantado na validação do plano da F01. Ao comparar o `liacup.css` aprovado com a
  constitution, dois números não cabiam juntos — e a comparação revelou um terceiro problema, que é
  o mais interessante dos três.

---

## 1. O que está em jogo

O `liacup.css` aprovado pela liga define os controles assim:

```css
.btn   { font-family: var(--font-heading); font-weight: var(--font-heading-weight);
         font-size: 14px; border: 1px solid transparent; }
.btn-icon { width: 36px; height: 36px; }
.input { min-height: 36px; font-size: 14px; }
```

A constitution exige alvos de toque de 44×44 px (Princípio II) e campos de formulário com 16 px ou
mais no mobile (Princípio III). Os números não cabem juntos, e é preciso decidir qual vence — com
registro, porque o Princípio VI exige aval explícito para mudança visual.

E há um agravante: o `Botao` entregue na F00 **já se desviou do aprovado, sem registro**. Ao
comparar os dois arquivos, o desvio é maior do que havia sido notado.

---

## 2. As quatro decisões

### 2.1 Alvo de toque: 44×44 px, em todas as larguras

**Decisão: adotar 44 px e ratificar retroativamente o `Botao` da F00.**

Antes de justificar, uma precisão que importa: **44×44 px não é exigência do WCAG 2.1 nível AA.**
No WCAG 2.1 esse número aparece no critério 2.5.5, que é nível **AAA**. O WCAG 2.2 acrescentou o
critério 2.5.8 em nível AA, com **24×24 px**. Ou seja, os 36 px do design aprovado **passam no AA de
ambos**.

Os 44 px são **regra nossa**, escrita na constitution, mais estrita que o exigido. Ela continua
valendo, por três motivos:

1. É o mínimo recomendado pelas diretrizes de interface da Apple (44 pt) e próxima da do Material
   (48 dp). Não é número inventado.
2. O Princípio III diz que o mobile é o caso principal e que toda tela é verificada primeiro em
   360 px. Se o mobile é a referência, **o tamanho do mobile é o tamanho base** — reduzir no desktop
   é que seria a exceção a justificar, não o contrário.
3. O público inclui pessoas idosas e pessoas lidando com o adoecimento de alguém próximo. Errar o
   alvo e clicar em outra coisa é um custo que recai justamente sobre quem menos precisa dele.

**Um único valor, sem media query.** Dois tamanhos para o mesmo controle é complexidade que quem
mantém paga para sempre, e a diferença de 8 px num controle de desktop é densidade, não defeito.

O `.btn-icon` de 36×36 passa a **44×44**. O `.input` passa de `min-height: 36px` para **44 px**.

### 2.2 Fonte do campo de formulário: 16 px

**Decisão: adotar 16 px em `input`, `textarea` e `select`.**

Este caso é diferente do anterior: não é uma regra nossa contra um número aprovado, é um **defeito
observável**. O Safari do iPhone dá zoom automático na página quando o usuário toca em um campo com
fonte menor que 16 px, e a página fica torta até a pessoa pinçar de volta. Não é preferência
estética; é a interface se desmontando na mão de quem usa.

**Só os controles de entrada.** O botão continua em 14 px — botão não dispara zoom, e mexer nele sem
necessidade seria desvio gratuito.

### 2.3 Tipografia do botão: voltar ao aprovado

Aqui a decisão vai no sentido contrário das duas anteriores, e é a descoberta desta análise.

O `Botao` entregue na F00 tem **três desvios** do `.btn` aprovado, nenhum registrado:

| Propriedade | `.btn` aprovado | `Botao` da F00 | Situação |
|---|---|---|---|
| Família | `var(--font-heading)` — Caprasimo | `var(--font-body)` — Figtree | ❌ Desvio |
| Tamanho | 14 px | `var(--font-size-h6)` — 13 px | ❌ Desvio, e token de título usado como fonte de controle |
| Peso | `var(--font-heading-weight)` — 400 | 600 | ❌ Desvio |
| Altura mínima | não definida (≈36 px) | `var(--alvo-de-toque)` — 44 px | ✅ Ratificado em 2.1 |

**Decisão: restaurar família, tamanho e peso do aprovado.** Aqui **não há defeito de acessibilidade
a corrigir** — é fidelidade pura, e o Princípio VI manda seguir o que a liga aprovou. Trocar a fonte
do botão de uma serifada de display para a fonte de corpo muda a personalidade do componente, e
ninguém pediu.

Isso exige um token novo: **`--font-size-controle: 14px`**. Usar `--font-size-h6` como fonte de
botão é o mesmo erro semântico da borda corrigida no fim da F00 — token com nome de uma coisa
aplicado em outra vira número mágico com nome bonito.

### 2.4 A verificação que faltava

Os três desvios de 2.3 passaram por **todas** as verificações da F00 sem acusar nada, porque nenhuma
delas compara o resultado com o design aprovado. O verificador de tokens confere que não há valor
escrito à mão; **não confere se o token escolhido é o certo**.

**Decisão: a fidelidade à classe de origem passa a ser item explícito de validação, componente a
componente, começando na F01.**

Na prática: para cada componente convertido, uma comparação lado a lado entre a classe do
`liacup.css` e o resultado, com as diferenças listadas e cada uma classificada como **corrigida**,
**ratificada** ou **revertida** — e com **motivo escrito**. Linha sem motivo é linha reprovada.

Vive em `specs/<feature>/FIDELIDADE.md`.

**Não é automatizável hoje e não vou fingir que é.** Comparar aparência renderizada com CSS de
origem exigiria comparação visual por imagem, que traz dependência nova, instabilidade entre
sistemas operacionais e uma pasta de imagens de referência para alguém manter. Para 7 componentes, o
custo não se paga. É leitura de duas colunas — mas é a única coisa que pega esta classe de erro.

**Quando revisitar**: se o sistema passar de ~15 componentes, comparação visual automatizada volta à
mesa.

---

## 3. Consequências

- O `.btn-icon`, o `.input` e o `Botao` **mudam de tamanho** em relação ao aprovado. Mudança pequena
  e para cima, no sentido de ficar mais fácil de acertar com o dedo.
- O `Botao` **volta a parecer** o botão que a liga aprovou.
- Entram dois tokens novos: `--font-size-controle: 14px` e `--font-size-campo: 16px`. **Nenhum valor
  de token existente é alterado.**
- A vitrine da F01 mostra os controles já com estes tamanhos, e é onde a liga vê o resultado.

### A consequência que não é óbvia: o par botão + campo se desfez

As linhas 120–121 do `liacup.css` trazem, em comentário do próprio autor do design:

```css
font-size: 14px; ... /* matches the .input's 14px — the pair sits side by side in sign-up rows */
```

O 14 px do botão **existe para casar com o 14 px do campo**, porque os dois ficam lado a lado nas
linhas de inscrição. A decisão 2.2 sobe o campo para 16 px e a 2.3 mantém o botão em 14 px: **o
valor do botão continua idêntico, mas a intenção registrada na origem deixa de valer.**

Isso é assumido conscientemente. A alternativa — subir o botão junto — seria desvio gratuito do
aprovado, sem defeito que o justifique.

Para que a regressão não fique invisível, **a vitrine da F01 mostra um bloco com botão e campo lado
a lado**, a "linha de inscrição" que o comentário descreve, e o `FIDELIDADE.md` traz uma linha
dizendo que o 14 px foi mantido **sabendo** que o par se desfez.

---

## 4. O padrão por trás disto, que vale mais que as quatro decisões

Em duas features, **três desvios** do design aprovado entraram sem registro — o anel de foco na F00,
e agora família, tamanho e peso do botão. Nenhum foi má-fé: todos pareceram obviamente certos na
hora de escrever.

É exatamente esse o problema. **Desvio que parece obviamente certo é o que não se registra**, e é
por isso que a fidelidade precisa de uma verificação própria, separada da de tokens e da de
acessibilidade.

As três decisões de acessibilidade deste ADR são boas; o que quase se perdeu foi a que não tinha
nada a ver com acessibilidade.

---

## 5. Como revisitar

Este ADR é reaberto se: (a) a constitution mudar o mínimo de alvo de toque; (b) o Safari deixar de
dar zoom abaixo de 16 px, o que tiraria a base da decisão 2.2; ou (c) o design system passar de ~15
componentes, o que reabre a decisão 2.4. Alteração vira novo ADR que substitui este, não edição
deste.
