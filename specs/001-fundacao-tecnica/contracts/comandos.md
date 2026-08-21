# Contrato dos comandos — F00

**Data**: 2026-08-20

Este é o contrato entre o projeto e quem o mantém. Cada comando tem nome estável, uma
responsabilidade, código de saída previsível e uma mensagem de falha que diz o que fazer. Quem vier
depois vai conhecer o projeto por estes comandos antes de ler qualquer código — então eles são
interface pública, não detalhe.

**Regra geral de código de saída**: `0` significa aprovado, qualquer outro valor significa
reprovado. O CI depende disso; não há comando que "avisa mas passa".

## Comandos de execução

| Comando         | Faz                                                          | Sai com 0 quando              | Mensagem de falha diz                                      |
| --------------- | ------------------------------------------------------------ | ----------------------------- | ---------------------------------------------------------- |
| `npm run dev`   | Sobe o projeto localmente. **É o "único comando" do FR-001** | não se aplica (fica rodando)  | qual porta está ocupada, ou qual versão do Node é esperada |
| `npm run build` | Gera a versão de produção                                    | a compilação termina sem erro | o arquivo e a linha do erro                                |
| `npm start`     | Sobe a versão já compilada                                   | não se aplica                 | que falta rodar `npm run build` antes                      |

## Comandos de verificação

| Comando                    | Faz                                                                     | Sai com 0 quando              | Mensagem de falha diz                                         | Requisito              |
| -------------------------- | ----------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------- | ---------------------- |
| `npm run verificar`        | Roda os quatro abaixo em sequência e para no primeiro que falhar        | os quatro passam              | qual dos quatro falhou                                        | FR-007                 |
| `npm run verificar:tipos`  | Verificação de tipos, modo estrito, sem emitir arquivo                  | zero erro de tipo             | arquivo, linha e o tipo esperado                              | FR-007, FR-028         |
| `npm run lint`             | Análise estática: regras do Next, acessibilidade e **regra de camadas** | zero erro                     | arquivo, linha e o nome da regra violada                      | FR-007, FR-008, FR-009 |
| `npm run formatar:check`   | Confere formatação sem alterar arquivo                                  | tudo formatado                | a lista de arquivos fora do padrão                            | FR-007                 |
| `npm run formatar`         | Corrige a formatação, alterando arquivos                                | sempre, salvo erro de leitura | —                                                             | conveniência           |
| `npm run verificar:tokens` | Procura cor e medida escritas à mão fora dos arquivos de token          | nenhuma ocorrência            | arquivo, linha, o valor encontrado e qual token usar no lugar | FR-010                 |

**Detalhe que define o valor da verificação de tokens**: a mensagem precisa dizer _qual token usar
no lugar_, não só apontar o erro. "Cor `#82558f` na linha 12 — use `var(--color-accent-600)`" é
resposta; "valor proibido" não é.

## Comandos de teste

| Comando                   | Faz                                                                               | Sai com 0 quando                          | Requisito              |
| ------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------- |
| `npm test`                | Testes de unidade, uma vez                                                        | todos passam                              | FR-012                 |
| `npm run test:watch`      | Testes de unidade, reexecutando ao salvar                                         | não se aplica                             | conveniência           |
| `npm run test:e2e`        | Testes de ponta a ponta: carregamento, acessibilidade e 7 larguras                | todos passam                              | FR-013, FR-014, FR-015 |
| `npm run test:desempenho` | Lighthouse na página inicial **da versão compilada**, com os limiares registrados | desempenho ≥ 90 **e** acessibilidade ≥ 95 | FR-029                 |

**O medidor roda contra `npm run build` + `npm start`, nunca contra `npm run dev`.** Em modo de
desenvolvimento não há minificação nem otimização de imagem, e o número que sai não descreve o que
o visitante recebe — é ruído com aparência de medição.

**`npm run test:e2e` em máquina sem o navegador de teste baixado** precisa falhar dizendo o comando
que instala o navegador — não com erro cru. É caso de borda explícito da spec.

## Contrato do CI (FR-016)

Toda alteração proposta dispara, sem ninguém pedir:

```text
npm ci  →  verificar:tipos  →  lint  →  formatar:check  →  verificar:tokens
        →  test  →  build  →  npx playwright install --with-deps chromium
        →  test:e2e  →  test:desempenho
```

**O passo de instalar o navegador do Playwright não é opcional.** É a causa mais comum de primeiro
CI vermelho: a máquina do CI vem sem navegador, e o teste de ponta a ponta falha com erro que não
tem nada a ver com o código. Ele vem depois do `build` para aproveitar o cache e antes do
`test:e2e`, que é quem precisa dele.

**Onde o CI roda**: só em **Linux**, deliberadamente. Os três mecanismos de paridade do
[research.md](../research.md) D6 — caixa de import travada pela verificação de tipos, fim de linha
normalizado no repositório e versão do Node fixada — travam a diferença entre Windows e Linux na
origem, na máquina de quem escreve. Uma matriz com Windows dobraria o consumo de minutos do plano
gratuito para reconferir o que já está travado.

- **Ordem importa**: o que é barato e falha rápido vem primeiro. Ninguém espera o Playwright
  para descobrir que faltou uma vírgula.
- **Nenhuma etapa é `continue-on-error`.** Etapa que avisa e deixa passar é decoração.
- Cada etapa aparece com nome próprio na interface do repositório, porque a proteção do ramo
  principal (FR-017) é configurada selecionando essas verificações pelo nome.

## Contrato com quem vier depois (FR-021)

O README precisa responder, para cada comando de verificação: **o que ele checa**, **por que a
regra existe** e **o que fazer quando ele falha**. Comando que falha sem explicação vira comando
que a próxima pessoa desliga.
