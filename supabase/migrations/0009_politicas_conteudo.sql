-- T021 — politicas das 11 colecoes de conteudo (FR-009, FR-010, FR-028).
--
-- O controle de acesso ja esta ativo desde a migracao que criou cada tabela, e
-- ativo sem politica RECUSA TUDO. Esta migracao nao protege nada: ela ABRE o que
-- deve ser aberto. E a ordem certa — ativa primeiro, abre depois.
--
-- A matriz esta em contracts/politicas-de-acesso.md. Em uma linha: o publico le
-- o que esta publicado e nao arquivado; quem esta autenticado le tudo e escreve;
-- e NINGUEM remove de verdade, nem a diretoria.
--
-- POR QUE UM LACO E NAO 44 COMANDOS ESCRITOS A MAO: as onze colecoes recebem
-- exatamente as mesmas quatro politicas. Escritas uma a uma, "exatamente as
-- mesmas" viraria coisa a conferir com o olho, e a decima primeira tabela e a
-- que ganha a politica sutilmente diferente que ninguem percebe. Aqui, ou todas
-- tem, ou o laco falha.
--
-- ESTA FEATURE DISTINGUE APENAS ANONIMO DE AUTENTICADO. Os tres papeis do
-- ADR-0001 — administrador, editor e colaborador — sao da F14: politica por
-- papel sem sistema de papeis seria regra sem quem a cumpra.

do $$
declare
  t text;
  colecoes text[] := array[
    'noticias', 'eventos', 'conteudos_educativos', 'projetos',
    'materiais', 'leituras', 'faq', 'ligantes', 'docentes',
    'galeria_albuns', 'galeria_fotos'
  ];
begin
  foreach t in array colecoes loop

    -- Quem visita o site le o que a liga publicou e nao arquivou. Rascunho e
    -- arquivado ficam de fora aqui, no banco — nao na tela.
    execute format(
      'create policy "publico le o que esta publicado" on public.%I
         for select to anon
         using (publicado and not arquivado)', t);

    -- Quem esta autenticado e da diretoria: le inclusive rascunho e arquivado,
    -- que e o que faz a tela de revisao e a de arquivados existirem.
    execute format(
      'create policy "diretoria le tudo" on public.%I
         for select to authenticated
         using (true)', t);

    execute format(
      'create policy "diretoria cria" on public.%I
         for insert to authenticated
         with check (true)', t);

    -- Arquivar E uma alteracao: marca a coluna arquivado. Por isso nao ha
    -- politica separada de arquivamento — teria de valer exatamente o mesmo.
    execute format(
      'create policy "diretoria altera e arquiva" on public.%I
         for update to authenticated
         using (true) with check (true)', t);

    -- NAO HA POLITICA DE DELETE, E E DE PROPOSITO (FR-028).
    -- Com o controle de acesso ativo, operacao sem politica e recusada. Entao a
    -- remocao definitiva e recusada para todo mundo, inclusive a diretoria: e
    -- assim que "apagar arquiva" deixa de depender de a aplicacao lembrar.
    -- Isto protege a diretoria dela mesma. So a chave de servico passa, e ela so
    -- e usada na purga.

  end loop;
end $$;
