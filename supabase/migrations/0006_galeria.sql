-- ============================================================================
-- F02 · 0006 — Albuns e fotos da galeria
-- ============================================================================
-- Decisao do clarify, pergunta 5: apagar um album ARQUIVA as fotos dentro dele,
-- e restaurar traz as duas coisas de volta (FR-030).
--
-- Por isso a chave estrangeira NAO tem ON DELETE CASCADE: exclusao definitiva
-- nao e operacao desta aplicacao. O RESTRICT torna isso explicito — se algum dia
-- alguem tentar apagar de verdade um album com fotos, o banco recusa em vez de
-- levar as fotos junto em silencio.
-- ============================================================================

create table public.galeria_albuns (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null check (length(titulo) between 1 and 200),
  descricao   text,
  data_album  date,
  capa_url    text,
  publicado   boolean not null default false,
  arquivado   boolean not null default false,
  criado_em   timestamptz not null default now(),
  alterado_em timestamptz not null default now(),
  autor_id    uuid references auth.users (id) on delete set null,
  ordem       integer not null default 0
);

create table public.galeria_fotos (
  id          uuid primary key default gen_random_uuid(),
  album_id    uuid not null references public.galeria_albuns (id) on delete restrict,
  arquivo_url text,
  legenda     text,
  publicado   boolean not null default false,
  arquivado   boolean not null default false,
  criado_em   timestamptz not null default now(),
  alterado_em timestamptz not null default now(),
  autor_id    uuid references auth.users (id) on delete set null,
  ordem       integer not null default 0
);

create index galeria_fotos_album_id_idx on public.galeria_fotos (album_id);

comment on constraint galeria_fotos_album_id_fkey on public.galeria_fotos is
  'RESTRICT de proposito: apagar arquiva (FR-028), e o arquivamento do album desce para as fotos (FR-030). Exclusao definitiva nao e operacao da aplicacao.';

create trigger tocar_alterado_em before update on public.galeria_albuns
  for each row execute function public.tocar_alterado_em();
create trigger tocar_alterado_em before update on public.galeria_fotos
  for each row execute function public.tocar_alterado_em();

alter table public.galeria_albuns enable row level security;
alter table public.galeria_fotos  enable row level security;
