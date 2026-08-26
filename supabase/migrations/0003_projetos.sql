-- ============================================================================
-- F02 · 0003 — Projetos, nas quatro frentes de trabalho
-- ============================================================================

-- Lista fechada, recusada PELO BANCO e nao pela tela — mesmo raciocinio das
-- unioes fechadas dos componentes da F01: estado impossivel nao entra.
--
-- As quatro frentes vem de docs/conteudo-institucional.md, secao 3. O documento
-- registra que o texto da SECRETARIA e provisorio e ainda depende de
-- confirmacao da liga; isso aparece marcado no dado de exemplo, nao aqui.
create type public.eixo_de_projeto as enum (
  'ensino',
  'extensao',
  'pesquisa',
  'secretaria'
);

create table public.projetos (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null check (length(titulo) between 1 and 200),
  descricao   text,
  eixo        public.eixo_de_projeto not null,
  publicado   boolean not null default false,
  arquivado   boolean not null default false,
  criado_em   timestamptz not null default now(),
  alterado_em timestamptz not null default now(),
  autor_id    uuid references auth.users (id) on delete set null,
  ordem       integer not null default 0
);

create trigger tocar_alterado_em before update on public.projetos
  for each row execute function public.tocar_alterado_em();

alter table public.projetos enable row level security;
