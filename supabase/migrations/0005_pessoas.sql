-- ============================================================================
-- F02 · 0005 — Ligantes e docentes orientadores
-- ============================================================================
-- Campos conforme docs/conteudo-institucional.md, secao 4.
--
-- A diretoria tem SEIS cargos, definidos no Estatuto (secao 4.3). O prototipo
-- mostrava oito inventados, e isso consta como correcao obrigatoria na secao 7
-- do mesmo documento. O cargo fica em texto livre porque o Estatuto pode mudar
-- por decisao da liga; a lista dos seis entra no dado de exemplo.
-- ============================================================================

create table public.ligantes (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null check (length(nome) between 1 and 200),
  cargo        text,
  curso        text,
  foto_url     text,
  eh_diretoria boolean not null default false,
  publicado    boolean not null default false,
  arquivado    boolean not null default false,
  criado_em    timestamptz not null default now(),
  alterado_em  timestamptz not null default now(),
  autor_id     uuid references auth.users (id) on delete set null,
  ordem        integer not null default 0
);

comment on column public.ligantes.eh_diretoria is
  'Distingue quem ocupa cargo da diretoria de quem e ligante sem cargo. Nao tem relacao com permissao de acesso: quem pode escrever no portal e definido na F14.';

create table public.docentes (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null check (length(nome) between 1 and 200),
  titulacao   text,
  formacao    text,
  foto_url    text,
  publicado   boolean not null default false,
  arquivado   boolean not null default false,
  criado_em   timestamptz not null default now(),
  alterado_em timestamptz not null default now(),
  autor_id    uuid references auth.users (id) on delete set null,
  ordem       integer not null default 0
);

create trigger tocar_alterado_em before update on public.ligantes
  for each row execute function public.tocar_alterado_em();
create trigger tocar_alterado_em before update on public.docentes
  for each row execute function public.tocar_alterado_em();

alter table public.ligantes enable row level security;
alter table public.docentes enable row level security;
