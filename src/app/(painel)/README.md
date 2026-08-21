# Painel administrativo

Ainda vazio. As rotas do painel entram na **F14** (autenticacao) e nas features de
conteudo que vierem depois.

Regra da camada: aqui so mora composicao e carregamento de dados. Regra de negocio
vive em `features/<dominio>/regras.ts`, e acesso a banco em `features/<dominio>/dados.ts`.
