# ADR-0003 — Fonte da verdade dos tokens, correções de contraste e hospedagem das fontes

- **Status:** Proposta — aguardando validação do Gabriel
- **Data:** 19 de agosto de 2026
- **Origem:** levantado na validação da spec da F00. O Claude Code reportou que o `liacup.css` não estava no repositório; ao localizá-lo, encontrei três questões que precisam de decisão **antes** da F01.

---

## 1. Qual arquivo é a fonte da verdade dos tokens

Existem hoje duas paletas circulando, e isso precisa acabar antes de alguém escrever a primeira linha de CSS.

| Origem                        | Valores                                                                          | O que é                                                                               |
| ----------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **`liacup.css`**              | accent `#9B6AAF` · accent-800 `#4E3260` · fundo `#f5ead8` · superfície `#ebddc5` | O arquivo que o protótipo aprovado realmente renderiza                                |
| Tabela do documento de aceite | `#B79AC3` · `#40224F` · `#9DB39A` · branco                                       | Amostragem que **eu** fiz da imagem da logo, para descrever a identidade no documento |

**Decisão: o `liacup.css` é a fonte da verdade.** É o arquivo que gerou as telas que a liga viu, revisou e aprovou. A tabela do documento de aceite descreve a paleta _da logo_, que é o material de origem — próxima, mas não idêntica.

**Consequência:** a tabela da seção 3 do documento de aceite passa a ser descritiva, não normativa. Corrijo isso na próxima versão do documento, com uma nota explicando a diferença. Nenhum retrabalho de código, porque nada foi escrito ainda — foi por pouco.

O arquivo vai para o repositório em `src/estilos/tokens.css`, com o cabeçalho original preservado.

---

## 2. Três defeitos de contraste no `liacup.css`

Medi todos os pares de cor que o arquivo usa. Três reprovam no critério AA da WCAG 2.1 para texto normal, que exige 4.5:1.

| Onde                                           | Par de cores                           | Medido     | Situação                                                |
| ---------------------------------------------- | -------------------------------------- | ---------- | ------------------------------------------------------- |
| **`.btn-primary`**                             | creme `#f5ead8` sobre accent `#9B6AAF` | **3,48:1** | ❌ Falha. O botão usa fonte de 14px, que é texto normal |
| **Links** (`a { color: var(--color-accent) }`) | `#9B6AAF` sobre creme                  | **3,48:1** | ❌ Falha                                                |
| **`.text-muted`** e `--color-neutral-600`      | `#82796a` sobre creme                  | **3,61:1** | ❌ Falha                                                |
| Texto em `--color-accent-2-500`                | `#8fa073` sobre creme                  | **2,37:1** | ❌ Falha até para texto grande. Só serve como fundo     |

Para referência, o que **passa** e não muda: texto principal sobre creme (13,95:1), creme sobre o roxo escuro do rodapé (9,05:1), etiquetas com fundo claro e texto escuro.

Detalhe revelador: no protótipo final, o Claude Design já tinha corrigido os links por fora, com um `a { color: var(--color-accent-700) }` embutido na página. O arquivo de tokens ficou com o valor que falha. É exatamente assim que um defeito de acessibilidade sobrevive — corrigido na tela, intacto na origem.

### Correção proposta — quatro trocas de token, sem cor nova

| Uso                     | De                             | Para                             | Passa a medir |
| ----------------------- | ------------------------------ | -------------------------------- | ------------- |
| Fundo de botão primário | `--color-accent-500` `#9B6AAF` | `--color-accent-600` `#82558f`   | **4,84:1** ✅ |
| Cor de link             | `--color-accent-500`           | `--color-accent-700` `#683f74`   | **6,91:1** ✅ |
| Texto secundário        | `--color-neutral-600`          | `--color-neutral-700` `#645c50`  | **5,53:1** ✅ |
| Texto em verde          | `--color-accent-2-500`         | `--color-accent-2-700` `#56633f` | **5,43:1** ✅ |

Nenhuma cor nova entra. São passos que já existem na mesma rampa, meio tom mais escuros. Visualmente quase idêntico; do ponto de vista de quem tem baixa visão, é a diferença entre ler e não ler.

O `#9B6AAF` continua existindo e continua sendo a cor da marca — só não carrega texto pequeno em cima.

### Quinta reatribuição — o anel de foco *(acrescentada em 20/08/2026)*

Registrada depois, na validação da implementação da F00. O `liacup.css` usava `--color-accent` no
indicador de foco:

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
}
```

| Uso | De | Para | Passa a medir |
| --- | --- | --- | --- |
| Anel de foco (`:focus-visible`) | `--color-accent` `#9B6AAF` | `--color-accent-700` `#683f74` | **6,91:1** |

**Esta não corrige defeito.** O critério da WCAG 2.1 para indicador de foco é **3:1**, e o
`--color-accent` sobre creme mede **3,48:1** — já passava. A troca leva a 6,91:1, o que é melhor
para quem navega por teclado com baixa visão, mas foi **escolha, não correção**.

Fica registrada aqui exatamente por isso: mudança que não era obrigatória é a que mais precisa
estar escrita, senão vira alteração sem dono no código. Mesmo princípio que levou a regra do `lib`
para a tabela da seção 1 dos padrões de código, em vez de deixá-la morando só no contrato da F00.

Com ela, são **cinco** reatribuições no total — quatro corrigem reprovação no AA, uma é melhoria
deliberada. Nenhuma cor nova entra em nenhuma delas.

### Por que isso vence a fidelidade ao aprovado

O Princípio 6 da constitution manda seguir a identidade aprovada. O Princípio 2 diz que WCAG AA é requisito de entrega e que feature que quebra acessibilidade não é feature pronta. Os dois estão no mesmo documento e a hierarquia interna resolve: acessibilidade não é preferência estética, é o que decide se uma parte do público consegue usar o site.

Vale lembrar que o próprio documento de aceite, assinado pela liga, já traz a nota: _"o lilás da logo é claro demais para texto pequeno sobre fundo colorido... o site usa o lilás nas áreas decorativas e nos títulos grandes, e um roxo mais fechado onde há texto corrido"_. Esta decisão só aplica no código o que já estava escrito lá.

---

## 3. As fontes não podem vir do Google em tempo de execução

O `liacup.css` traz, na linha 4:

```css
@import url('https://fonts.googleapis.com/css2?family=Caprasimo...&family=Figtree...');
```

Isso significa que **todo visitante do portal faz uma requisição aos servidores do Google**, entregando o endereço de IP dele. Num site institucional de saúde, sobre cuidados paliativos, cujo público inclui pacientes e familiares, é uma transferência de dado a terceiro que ninguém pediu e que nada exige.

Há também o custo técnico: `@import` bloqueia a renderização e é a forma mais lenta de carregar fonte.

**Decisão:** as duas fontes — Caprasimo e Figtree — são **hospedadas junto com o site**. O Next.js resolve isso de forma nativa: ele baixa a fonte em tempo de build e serve do próprio domínio, sem nenhuma requisição ao Google quando alguém acessa a página. Melhora o desempenho, elimina a transferência de dado e não muda uma vírgula do visual.

O `@import` sai do arquivo de tokens.

---

## 4. O que fica como está

Os espaçamentos fracionários (`--space-1: 4.4px`, `--space-2: 8.8px`) são incomuns e produzem valores quebrados, mas são a escala que gerou as telas aprovadas. **Não mexer.** Normalizar para múltiplos de 4 mudaria sutilmente todo o layout aprovado em troca de elegância que ninguém vê.

Raios, sombras e a estrutura de classes de componente também ficam intactos.

---

## 4.1 Adendo de 21/08/2026 — quatro defeitos nos componentes convertidos na F01

Levantado no planejamento da F01, ao medir **todas** as cores dos 35 seletores que viram componente.
Estes quatro não apareceram na medição original porque a página provisória da F00 não tinha cartão,
etiqueta nem campo na tela — o mesmo motivo pelo qual as quatro reatribuições da seção 2 precisaram
entrar sem nada usando.

| Onde | Par medido | Medido | Situação |
| --- | --- | --- | --- |
| `.card-meta` | `color-mix(text 50%)` sobre **superfície**, 11px | **3,01:1** | ❌ Falha (exige 4,5) |
| `.card-kicker` | `--color-accent` sobre **superfície**, 10px | **3,09:1** | ❌ Falha (exige 4,5) |
| `.tag-outline` | `--color-accent` como texto sobre **fundo**, 11px | **3,48:1** | ❌ Falha (exige 4,5) |
| `.input` e `.btn-secondary` | borda `--color-divider` sobre **superfície** | **1,37:1** | ❌ Falha (exige 3,0) |

**O quarto é o mais grave e o único que o axe-core NÃO pega**: não existe regra de axe para
contraste de borda de controle. E o campo tem fundo `--color-surface` sobre página `--color-bg`, que
contrastam **1,13:1** entre si — a borda é a **única** coisa que diz onde o campo começa.

### Correção — quatro reatribuições, nenhuma cor nova

| Uso | De | Para | Passa a medir |
| --- | --- | --- | --- |
| Texto de metadados do cartão | `color-mix(text 50%)` | `--color-neutral-700` | **4,92:1** sobre superfície ✅ |
| Kicker do cartão | `--color-accent` | `--color-accent-700` | **6,15:1** sobre superfície ✅ |
| Texto da etiqueta de contorno | `--color-accent` | `--color-accent-700` | **6,15:1** sobre superfície ✅ |
| Borda de campo e de botão secundário | `--color-divider` | `--color-neutral-600` | **3,21:1** sobre superfície ✅ |

**Atenção ao kicker**: o `--color-accent-600` **não basta** — mede 4,30:1 sobre a superfície, abaixo
dos 4,5 exigidos para texto de 10px. Precisa do 700.

### O que NÃO muda, e por quê

Registrado para ninguém "consertar" depois:

| Onde | Par medido | Medido | Veredito |
| --- | --- | --- | --- |
| `.card-body` | texto com `opacity: 0.8` sobre superfície | **7,19:1** | ✅ Passa folgado |
| `.field > label` | `color-mix(text 70%)` sobre superfície | **5,33:1** | ✅ Passa |
| `.field > label` | `color-mix(text 70%)` sobre fundo | **5,65:1** | ✅ Passa |
| `.btn:disabled` — secundário | texto com `opacity: 0.45` sobre fundo | **2,72:1** | ✅ **Isento** |
| `.btn:disabled` — primário | grupo com `opacity: 0.45` sobre fundo | **1,86:1** | ✅ **Isento** |

**Botão desabilitado é isento do critério 1.4.3 do WCAG**, que exclui expressamente componentes
desabilitados. Os números estão aqui porque são baixos e vão chamar atenção de quem revisar; não são
defeito e não devem ser "corrigidos".

O rótulo de campo aparece com **dois** valores porque depende de onde o campo está — sobre a página
ou dentro de um cartão. Ambos passam, então a decisão não muda; os dois estão registrados porque
número sem o par nomeado é o defeito que a tabela de fidelidade existe para pegar.

---

## 5. Consequências

- A F01 (design system em código) começa de um arquivo único, correto e acessível.
- A verificação automática de tokens da F00 passa a ter o que verificar de verdade.
- O documento de aceite ganha uma nota de correção na próxima revisão.
- Nenhum retrabalho: tudo isso foi pego antes da primeira linha de código de produto.
