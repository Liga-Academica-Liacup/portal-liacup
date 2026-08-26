-- ============================================================================
-- F02 · 0008 — Controle de origem, para limitar robo no formulario
-- ============================================================================
-- Esta tabela existe para resolver uma CONTRADICAO entre dois ADRs aprovados:
--
--   ADR-0001 secao 3 : a tabela `mensagens` guarda "data, IP nao armazenado"
--   ADR-0002 risco E3: limitar spam "por IP e por janela de tempo"
--
-- Nao se limita por IP sem guardar o IP. A saida, registrada no adendo de
-- 21/08/2026 do ADR-0002: um RESUMO IRREVERSIVEL do endereco, em tabela
-- SEPARADA da mensagem, apagado em 24 HORAS.
--
-- A separacao nao e organizacao: e o que faz as duas afirmacoes continuarem
-- verdadeiras ao mesmo tempo. A frase do ADR-0001 fala da tabela `mensagens`, e
-- continua literalmente correta.
--
-- RESUMO DE IP CONTINUA SENDO DADO PESSOAL PSEUDONIMIZADO SOB A LGPD, nao dado
-- anonimo. E por isso que tem prazo proprio e tabela propria, e nao porque "e so
-- um hash".
--
-- O sal e SECRETO e ROTACIONAVEL, lido de SAL_DO_RESUMO_DE_ORIGEM. Sal fixo e
-- publico tornaria o resumo reversivel por forca bruta: o espaco de enderecos
-- IPv4 tem cerca de 4,3 bilhoes de valores, que uma maquina comum percorre em
-- minutos.
-- ============================================================================

create table public.controle_de_origem (
  id                 uuid primary key default gen_random_uuid(),
  resumo_do_endereco text not null,
  momento            timestamptz not null default now()
);

create index controle_de_origem_resumo_momento_idx
  on public.controle_de_origem (resumo_do_endereco, momento);

comment on table public.controle_de_origem is
  'DADO PESSOAL PSEUDONIMIZADO. Retencao de 24 HORAS, apagada pelo MESMO procedimento das mensagens — dois mecanismos de purga e um que ninguem executa.';

alter table public.controle_de_origem enable row level security;
