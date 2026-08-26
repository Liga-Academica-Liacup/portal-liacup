-- Situacao de cada tabela do esquema publico: controle de acesso, politicas e
-- CONCESSOES.
--
-- A coluna de concessoes existe por um erro real: as onze colecoes ficaram com
-- controle de acesso ativo e quatro politicas cada, e mesmo assim recusavam
-- tudo, porque nenhum papel tinha SELECT nem INSERT. O Postgres tem duas portas
-- — a concessao diz se o papel pode tocar na tabela, a politica diz quais linhas
-- ele ve — e uma consulta que olha so a segunda da verde para um banco fechado.
select
  c.relname as tabela,
  c.relrowsecurity as rls_ativo,
  (
    select count(*) from pg_policies p
     where p.schemaname = 'public' and p.tablename = c.relname
  ) as politicas,
  (
    select count(*) from information_schema.role_table_grants g
     where g.table_schema = 'public'
       and g.table_name = c.relname
       and g.grantee in ('anon', 'authenticated', 'service_role')
       and g.privilege_type in ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
  ) as concessoes
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relrowsecurity asc, c.relname asc;
