-- T051 — arquivar um album desce para as fotos, e restaurar traz as duas coisas
-- de volta (FR-030).
--
-- POR QUE NO BANCO E NAO NA APLICACAO: um album arquivado cujas fotos continuam
-- publicadas nao e um estado intermediario, e um vazamento — as fotos seguem
-- aparecendo na galeria com o album fora do ar. Se a descida morasse na
-- aplicacao, ela valeria para o caminho que lembrou de chamar a funcao, e a F16
-- (tela de arquivados) ou a F18 (upload) abririam o buraco sem perceber.
--
-- O gatilho so age quando `arquivado` MUDA. Sem essa condicao, qualquer edicao
-- de titulo do album reescreveria todas as fotos, mexendo no `alterado_em` de
-- cada uma — e o `alterado_em` e tambem a marca de versao da edicao concorrente
-- (FR-031). Um efeito colateral desses transforma "salvar o titulo do album" em
-- "invalidar a edicao que alguem tinha aberto em cada foto".
--
-- RESTAURAR E O MESMO CAMINHO, de volta: como o gatilho copia o valor novo, por
-- `arquivado = false` no album desarquiva as fotos junto. Nao ha "restaurar
-- parcialmente" — e a simetria que faz o desfazer ser confiavel.
--
-- Lembrando o que ja estava decidido em 0006: a foto referencia o album com
-- `on delete restrict`, nao `cascade`. Apagar album NAO leva a galeria junto;
-- apagar arquiva, e a remocao definitiva e recusada de todo jeito.

create or replace function public.descer_arquivamento_para_as_fotos()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.galeria_fotos
     set arquivado = new.arquivado
   where album_id = new.id
     and arquivado is distinct from new.arquivado;
  return new;
end;
$$;

create trigger galeria_albuns_desce_arquivamento
  after update of arquivado on public.galeria_albuns
  for each row
  when (old.arquivado is distinct from new.arquivado)
  execute function public.descer_arquivamento_para_as_fotos();
