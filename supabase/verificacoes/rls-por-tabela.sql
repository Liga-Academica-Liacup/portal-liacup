-- Situacao do controle de acesso por linha, TABELA POR TABELA.
--
-- Nao devolve "esta tudo certo": devolve a lista, para que a ausencia de uma
-- tabela na saida seja visivel. Uma consulta que nao olha nada e uma que aprova
-- tudo produzem a mesma resposta verde sem o contador (RP-12).
select
  c.relname                                as tabela,
  c.relrowsecurity                         as rls_ativo,
  (select count(*) from pg_policies p
     where p.schemaname = 'public' and p.tablename = c.relname) as politicas
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relrowsecurity asc, c.relname asc;
