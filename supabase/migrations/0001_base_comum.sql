-- ============================================================================
-- F02 · 0001 — Base comum das colecoes de conteudo
-- ============================================================================
-- Nao cria tabela. Cria o que TODAS as colecoes de conteudo compartilham, para
-- que cada tabela nao invente a sua versao.
--
-- Ver specs/003-camada-de-dados/data-model.md, secao 1.
-- ============================================================================

-- Atualiza `alterado_em` a cada escrita.
--
-- Este campo faz DOIS trabalhos, e e deliberado: registra a ultima alteracao E
-- serve de marca de versao para a deteccao de edicao concorrente (FR-031).
-- Quem abre um registro para editar recebe este valor; ao salvar, devolve. Se
-- nao bater, a escrita e recusada. Um campo a menos para manter em sincronia.
create or replace function public.tocar_alterado_em()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.alterado_em = now();
  return new;
end;
$$;

comment on function public.tocar_alterado_em() is
  'Atualiza alterado_em a cada escrita. O campo e tambem a marca de versao da edicao concorrente (F02, FR-031).';
