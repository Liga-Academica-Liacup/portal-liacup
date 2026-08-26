-- T022 — politicas das mensagens: a matriz INVERTIDA (FR-011).
--
-- Nas colecoes de conteudo, o anonimo le e nao escreve. Aqui e o contrario: ele
-- escreve — e o formulario de contato — e nao le NADA.
--
-- A LINHA QUE QUASE SEMPRE FALTA: ler uma mensagem pelo identificador conhecido
-- tambem e recusada. Uma politica que esconde a lista mas deixa buscar por
-- identificador nao protege nada, porque identificador vaza em link, em log e em
-- captura de tela. Aqui isso sai de graca: nao existe politica de select para o
-- anonimo, e sem politica a operacao e recusada — por lista ou por id, o mesmo.

create policy "qualquer pessoa envia mensagem"
  on public.mensagens
  for insert to anon
  with check (true);

create policy "diretoria le as mensagens"
  on public.mensagens
  for select to authenticated
  using (true);

-- Marcar como lida e arquivar sao alteracoes da coluna situacao.
create policy "diretoria marca e arquiva mensagem"
  on public.mensagens
  for update to authenticated
  using (true) with check (true);

-- SEM POLITICA DE SELECT PARA O ANONIMO e SEM POLITICA DE DELETE PARA NINGUEM.
-- A mensagem so sai do banco pela purga dos 24 meses, que roda com a chave de
-- servico. Diretoria apagando mensagem a mao e o caminho mais curto para perder
-- prova de algo que a liga precise mostrar depois.
