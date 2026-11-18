# Contrato da camada de dados — F02

**Data**: 2026-08-21 · Requisitos: FR-005 a FR-007, FR-014 a FR-017

Este é o contrato que **toda a Fase 1 vai consumir**. Mudar a forma de uma função aqui depois quebra
as páginas que já a usarem, então a superfície é pequena de propósito.

## Onde cada coisa mora

| Arquivo | Responsabilidade | Quem pode importar |
| --- | --- | --- |
| `src/lib/supabase/navegador.ts` | Cliente público. **Só a chave pública** | Componentes de cliente |
| `src/lib/supabase/servidor.ts` | Cliente de servidor. **ÚNICO arquivo autorizado a ler a chave de serviço** | Só `features/<dominio>/dados.ts` |
| `src/lib/supabase/tipos.ts` | Tipos **gerados** do esquema | Qualquer camada |
| `features/<dominio>/dados.ts` | **Único lugar que fala com o banco** | Rotas e Server Actions |
| `features/<dominio>/regras.ts` | Regra pura, sem banco | Qualquer camada da feature |

A última coluna é a regra Z1 e Z4 do lint, já em vigor desde a F00: **nenhum componente fala com o
banco.**

## Forma das funções de leitura

Toda leitura obedece a três regras:

1. **Pede apenas as colunas que usa** (FR-006). `select('*')` é preguiça que vira lentidão.
2. **Devolve lista vazia, nunca erro, quando não há nada.** É o estado que o `EstadoVazio` da F01
   desenha, e o caso de borda "a base é consultada quando ainda está vazia".
3. **Filtra por publicado e não arquivado** na leitura pública — mesmo que a política já filtre. Duas
   camadas: a política é a que **protege**, o filtro é o que **documenta a intenção** e sobrevive a
   alguém consultar com credencial de diretoria.

## Forma das funções de escrita

1. **Toda escrita passa por Server Action ou rota de servidor**, nunca do navegador direto para o
   banco (Princípio IV).
2. **Toda entrada é validada com o mesmo esquema da tela**, em `lib/validacao` — um arquivo, dois
   usos, que é o que impede as duas validações de divergirem com o tempo.
3. **Escrita informa a versão que abriu.** Se não bater, é recusada e **devolve o conteúdo tentado**
   (FR-031, FR-032).

## O contrato da chave de serviço

**Quatro barreiras, três automáticas.** Detalhe em [research.md](../research.md) D2.

| # | Barreira | Verifica |
| --- | --- | --- |
| 1 | Nome sem o prefixo `NEXT_PUBLIC_` | O framework não expõe |
| 2 | Zona de lint: só `servidor.ts` lê a variável | **O código** |
| 3 | Script varre o **pacote compilado** atrás do valor e do nome | **O artefato** |
| 4 | `.env.example` separando segredo de público | Erro de configuração |

**A barreira 3 é a que fecha a porta.** As duas primeiras verificam o código; ela verifica o que
realmente foi entregue. Um valor chega ao navegador sem nenhum arquivo de cliente mencionar a
variável — basta um componente de servidor passá-lo como prop.

**Demonstração obrigatória, com duas barreiras vistas bloqueando:**

| # | O que fazer | Esperado |
| --- | --- | --- |
| C1 | Ler a chave de serviço num componente de cliente | A **barreira 2** quebra o CI, apontando arquivo e linha |
| C2 | Contornar a 2 passando o valor por prop de servidor para cliente | A **barreira 3** pega no pacote compilado |
| C3 | Desfazer | Verde |

Sem o C2, a barreira 3 nunca foi vista funcionando — e é ela a que existe para o caso que as outras
não pegam.

## Leitura pública: estática com revalidação

Decidido em [research.md](../research.md) D3. Não é preferência de desempenho: é o que faz **a pausa
do plano gratuito não derrubar o site público**.

Com o banco pausado, uma página dinâmica dá erro na tela; uma página estática com revalidação serve a
última versão boa e falha a atualização em silêncio. Para um site institucional, mostrar conteúdo de
alguns minutos atrás é indistinguível de estar tudo bem.

**Continua quebrado com o banco pausado, e está escrito assim**: o formulário de contato perde a
mensagem, e o painel não abre. Os dois são da F25.
