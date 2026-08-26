-- ============================================================================
-- F02 · 0002 — Noticias, eventos e conteudos educativos
-- ============================================================================
-- RP-11: toda tabela nasce com controle de acesso por linha ATIVO, na mesma
-- migracao que a cria. Acesso ativado sem politica RECUSA TUDO — e o padrao
-- seguro. As politicas que abrem o que deve ser aberto vem na migracao 0009.
--
-- A chave publica do Supabase vai para o navegador de proposito. Tabela sem
-- controle de acesso mais essa chave e tabela aberta para qualquer um ler e
-- escrever.
-- ============================================================================

create table public.noticias (
  id            uuid primary key default gen_random_uuid(),
  titulo        text not null check (length(titulo) between 1 and 200),
  resumo        text check (length(resumo) <= 500),
  corpo         text,
  imagem_url    text,
  link_externo  text,
  data_noticia  date not null default current_date,
  publicado     boolean not null default false,
  arquivado     boolean not null default false,
  criado_em     timestamptz not null default now(),
  alterado_em   timestamptz not null default now(),
  autor_id      uuid references auth.users (id) on delete set null,
  ordem         integer not null default 0
);

comment on column public.noticias.link_externo is
  'Noticia que aponta para fora do portal. Previsto no ADR-0001, secao 3.';
comment on column public.noticias.autor_id is
  'Quem criou. ON DELETE SET NULL de proposito: quando alguem sai da diretoria, o conteudo NAO vai junto (Principio I).';

create table public.eventos (
  id            uuid primary key default gen_random_uuid(),
  titulo        text not null check (length(titulo) between 1 and 200),
  descricao     text,
  data_evento   timestamptz not null,
  local         text,
  inscricao_url text,
  publicado     boolean not null default false,
  arquivado     boolean not null default false,
  criado_em     timestamptz not null default now(),
  alterado_em   timestamptz not null default now(),
  autor_id      uuid references auth.users (id) on delete set null,
  ordem         integer not null default 0
);

-- DESVIO REGISTRADO em relacao ao esboco do ADR-0001 secao 3, que listava um
-- campo `passado`. Ele NAO existe aqui: um booleano gravado envelhece sozinho e
-- passa a mentir no dia seguinte ao evento. `passado` e derivado de
-- `data_evento` no momento da leitura, em regras.ts, como funcao pura.
-- O proprio ADR-0001 manda nao tratar o esboco como fechado.
comment on column public.eventos.data_evento is
  'Fonte da verdade. O estado "passado" e derivado dela na leitura, nao gravado.';

create table public.conteudos_educativos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null check (length(titulo) between 1 and 200),
  descricao   text,
  formato     text,
  link        text,
  publicado   boolean not null default false,
  arquivado   boolean not null default false,
  criado_em   timestamptz not null default now(),
  alterado_em timestamptz not null default now(),
  autor_id    uuid references auth.users (id) on delete set null,
  ordem       integer not null default 0
);

create trigger tocar_alterado_em before update on public.noticias
  for each row execute function public.tocar_alterado_em();
create trigger tocar_alterado_em before update on public.eventos
  for each row execute function public.tocar_alterado_em();
create trigger tocar_alterado_em before update on public.conteudos_educativos
  for each row execute function public.tocar_alterado_em();

-- RP-11 — ativa primeiro, abre depois.
alter table public.noticias             enable row level security;
alter table public.eventos              enable row level security;
alter table public.conteudos_educativos enable row level security;
