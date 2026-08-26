-- T021 a T023, segunda metade — as CONCESSOES sem as quais as politicas nao
-- fazem nada.
--
-- POR QUE ESTA MIGRACAO EXISTE, escrito por inteiro porque foi um erro real e
-- caro de perceber:
--
-- O Postgres tem duas portas, e as duas precisam abrir. A primeira e a
-- CONCESSAO (grant): o papel tem ou nao tem direito de ler aquela tabela. A
-- segunda e a POLITICA: das linhas que ele pode ler, quais sao. A politica
-- filtra linhas; ela nao concede direito nenhum.
--
-- As tabelas desta feature nasceram com controle de acesso ativo e, nas
-- migracoes 0009 a 0011, ganharam politicas. O catalogo passou a responder
-- "RLS ativo, 4 politicas" para as onze colecoes — e o verificador ficou verde.
-- E estava tudo fechado: anon, authenticated e service_role tinham apenas
-- REFERENCES, TRIGGER e TRUNCATE. Nenhum SELECT, nenhum INSERT. As politicas
-- eram decoracao sobre uma porta trancada por outro motivo.
--
-- Quem encontrou isso foi o teste de PERMISSAO, nao o de recusa. Os testes de
-- recusa passariam todos: tudo estava mesmo recusado. E o verde mais perigoso
-- desta feature — o site inteiro vazio, com todos os indicadores de seguranca
-- acesos.
--
-- DELETE NAO E CONCEDIDO A NINGUEM, E ISSO E DELIBERADO (FR-028).
-- Nas migracoes 0009 e 0010 a remocao ja era recusada por ausencia de politica.
-- Aqui ela passa a ser recusada tambem por ausencia de concessao — duas camadas
-- independentes, porque "apagar arquiva" e a regra que protege a diretoria dela
-- mesma, e uma regra dessas nao deve depender de um unico mecanismo.
-- So a chave de servico remove, e so na purga.

-- As onze colecoes de conteudo -------------------------------------------------
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
    -- Quem visita so precisa ler. A politica decide QUAIS linhas.
    execute format('grant select on public.%I to anon', t);
    -- A diretoria le, cria e altera. Arquivar e alterar.
    execute format('grant select, insert, update on public.%I to authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to service_role', t);
  end loop;
end $$;

-- Mensagens: a matriz invertida ------------------------------------------------
-- O anonimo escreve e NAO le. Sem a concessao de select para ele, a leitura por
-- identificador conhecido e recusada na primeira porta, antes de qualquer
-- politica — que e onde essa recusa deve morar.
grant insert on public.mensagens to anon;
grant select, insert, update on public.mensagens to authenticated;
grant select, insert, update, delete on public.mensagens to service_role;

-- Controle de origem: so o servidor -------------------------------------------
-- Sem concessao para anon nem para authenticated, em nenhuma operacao. Nem a
-- diretoria ve esta tabela, porque nao ha nada que ela precise fazer com ela.
grant select, insert, update, delete on public.controle_de_origem to service_role;
