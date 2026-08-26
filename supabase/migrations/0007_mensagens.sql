-- ============================================================================
-- F02 · 0007 — Mensagens do "Fale com a Liga"
-- ============================================================================
-- A UNICA tabela desta feature com DADO PESSOAL DE TERCEIROS: nome, e-mail e
-- texto livre de quem nao conhecemos.
--
-- NENHUM ENDERECO DE IP AQUI — nem em claro, nem resumido. E o que mantem
-- LITERALMENTE verdadeira a frase "IP nao armazenado" do ADR-0001, secao 3. O
-- limite contra robo usa a tabela separada da migracao 0008.
--
-- Retencao: 24 MESES a partir de `recebida_em`. Finalidade declarada: receber e
-- responder contatos de quem procura a liga. Base legal: legitimo interesse na
-- comunicacao institucional. Ver data-model.md secao 5.
-- ============================================================================

create type public.situacao_da_mensagem as enum (
  'nao_lida',
  'lida',
  'arquivada'
);

create table public.mensagens (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null check (length(nome) between 1 and 200),
  email       text not null check (length(email) between 3 and 320),
  assunto     text check (length(assunto) <= 200),
  texto       text not null check (length(texto) between 1 and 5000),
  situacao    public.situacao_da_mensagem not null default 'nao_lida',
  recebida_em timestamptz not null default now(),
  alterado_em timestamptz not null default now()
);

-- Os limites de tamanho nao sao enfeite: o texto vem de quem nao conhecemos, e
-- campo livre sem teto e porta de entrada de lixo. Caso de borda da spec.
comment on column public.mensagens.recebida_em is
  'Marca o inicio dos 24 meses de retencao (FR-018). A purga usa esta coluna.';
comment on table public.mensagens is
  'DADO PESSOAL. Retencao de 24 meses. Purga: scripts/purgar-dado-pessoal.mjs. Sem IP, por decisao do ADR-0001 secao 3.';

create index mensagens_recebida_em_idx on public.mensagens (recebida_em);

create trigger tocar_alterado_em before update on public.mensagens
  for each row execute function public.tocar_alterado_em();

alter table public.mensagens enable row level security;
