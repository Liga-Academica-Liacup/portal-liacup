-- ============================================================================
-- F02 · 0004 — Materiais, recomendacoes de leitura e perguntas frequentes
-- ============================================================================

create table public.materiais (
  id           uuid primary key default gen_random_uuid(),
  titulo       text not null check (length(titulo) between 1 and 200),
  descricao    text,
  arquivo_url  text,
  tipo         text,
  publicado    boolean not null default false,
  arquivado    boolean not null default false,
  criado_em    timestamptz not null default now(),
  alterado_em  timestamptz not null default now(),
  autor_id     uuid references auth.users (id) on delete set null,
  ordem        integer not null default 0
);

comment on column public.materiais.arquivo_url is
  'Referencia ao arquivo. O ENVIO do arquivo e da F18; aqui so mora o endereco.';

create table public.leituras (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null check (length(titulo) between 1 and 200),
  autoria     text,
  referencia  text,
  link        text,
  publicado   boolean not null default false,
  arquivado   boolean not null default false,
  criado_em   timestamptz not null default now(),
  alterado_em timestamptz not null default now(),
  autor_id    uuid references auth.users (id) on delete set null,
  ordem       integer not null default 0
);

create table public.faq (
  id          uuid primary key default gen_random_uuid(),
  pergunta    text not null check (length(pergunta) between 1 and 300),
  resposta    text not null,
  publicado   boolean not null default false,
  arquivado   boolean not null default false,
  criado_em   timestamptz not null default now(),
  alterado_em timestamptz not null default now(),
  autor_id    uuid references auth.users (id) on delete set null,
  ordem       integer not null default 0
);

create trigger tocar_alterado_em before update on public.materiais
  for each row execute function public.tocar_alterado_em();
create trigger tocar_alterado_em before update on public.leituras
  for each row execute function public.tocar_alterado_em();
create trigger tocar_alterado_em before update on public.faq
  for each row execute function public.tocar_alterado_em();

alter table public.materiais enable row level security;
alter table public.leituras  enable row level security;
alter table public.faq       enable row level security;
