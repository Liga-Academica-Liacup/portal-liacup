# Banco de dados

Tudo o que define o banco mora **aqui, versionado** — esquema, políticas de acesso e dados de
exemplo. O painel do Supabase serve para **olhar**, nunca para alterar.

## Por que não pelo painel

Esquema criado clicando no painel existe apenas na conta de quem clicou: não tem histórico, não tem
revisão e não pode ser recriado. Um projeto que a diretoria herda precisa poder ser reconstruído do
zero a partir deste repositório (Princípio I).

**Alterar o banco pelo painel desalinha o repositório do que está no ar**, e quem fizer isso quebra
a próxima migração.

## Estrutura

| Pasta         | O que é                                                                             |
| ------------- | ----------------------------------------------------------------------------------- |
| `migrations/` | Esquema e políticas, em arquivos numerados. Rodam em ordem, uma vez cada            |
| `seed.sql`    | Dados de exemplo. Texto real onde a liga aprovou; espaço reservado marcado onde não |

## Regra que não se negocia

**Toda tabela nasce com controle de acesso por linha ativo, na mesma migração que a cria** (RP-11).
Acesso ativado sem política **recusa tudo** — é o padrão seguro. Ativa primeiro, abre depois.

A chave pública do Supabase vai para o navegador de propósito. Tabela sem controle de acesso mais
essa chave é tabela aberta para qualquer pessoa ler e escrever.
