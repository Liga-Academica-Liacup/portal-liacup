-- Dados de exemplo do Portal LIACUP (F02, T045 a T049).
--
-- DUAS REGRAS, E ELAS SE OPOEM DE PROPOSITO:
--
--   1. Onde existe TEXTO REAL APROVADO pela liga, ele entra literal, sem
--      reescrita e sem "melhoria" (Principio VI). E o caso das quatro frentes de
--      trabalho, das duas orientadoras, das perguntas frequentes inteiras e dos
--      nomes dos fundadores discentes.
--
--   2. Onde NAO existe texto aprovado, o espaco reservado entra marcado com
--      [EXEMPLO], visivel em qualquer tela e em qualquer consulta. Na v1 do
--      prototipo foram inventados e-mail, endereco e cargos plausiveis o
--      bastante para alguem tomar por verdadeiros — e alguem tomou. Texto
--      inventado que parece institucional e o unico erro desta feature que sai
--      do repositorio e chega a quem le o site.
--
-- O QUE NAO ENTRA AQUI, e a ausencia e a decisao: nenhum nome de pessoa em
-- cargo de diretoria. Os seis cargos do Estatuto estao no documento
-- institucional; QUEM os ocupa, nao. Inventar essa associacao seria exatamente
-- o erro da regra 2, na informacao mais facil de acreditar.
--
-- SOBRE O TEXTO DA SECRETARIA — leia antes de mudar:
-- Ele e provisorio e esta pendente de confirmacao da liga. A tarefa T046 pede
-- espaco reservado marcado; a secao 3 de docs/conteudo-institucional.md decide o
-- contrario, e com todas as letras: as quatro frentes vao ao ar "sem marcacao
-- visivel de rascunho para o visitante", porque texto meio-pronto com aviso de
-- "em construcao" passa imagem pior que texto enxuto e correto, e a pendencia
-- fica registrada do nosso lado. As duas instrucoes nao cabem juntas.
-- Aqui vale a decisao do documento institucional, que e o texto aprovado pela
-- liga (Principio VI), e a pendencia fica registrada como a secao 3 manda: neste
-- comentario e no PLANO-DE-DESENVOLVIMENTO.md. A divergencia esta reportada.
--
-- IDEMPOTENTE: apaga o que semeou antes de semear de novo, para poder rodar
-- quantas vezes for preciso sem duplicar.

-- Limpeza do que este arquivo semeou ------------------------------------------
delete from public.galeria_fotos;
delete from public.galeria_albuns;
delete from public.noticias;
delete from public.eventos;
delete from public.conteudos_educativos;
delete from public.projetos;
delete from public.materiais;
delete from public.leituras;
delete from public.faq;
delete from public.ligantes;
delete from public.docentes;

-- =============================================================================
-- TEXTO REAL APROVADO
-- =============================================================================

-- As quatro frentes de trabalho (conteudo-institucional.md, secao 3) -----------
insert into public.projetos (titulo, eixo, descricao, ordem, publicado) values
('Ensino', 'ensino',
 'Vivências teórico-práticas que complementam a formação acadêmica, estimulando uma formação humanista, reflexiva, crítica e multidisciplinar. Encontros, ações e eventos científicos, acadêmicos e humanísticos, como minicursos e simpósios. Metodologias ativas de aprendizado, como discussão e apresentação de casos, análise de artigos e construção de aulas.',
 1, true),
('Extensão', 'extensao',
 'Difusão do conhecimento em Cuidados Paliativos por meio de ações abertas à comunidade, como palestras, oficinas, rodas de conversa e campanhas educativas. Desenvolvimento de materiais educativos para pacientes e familiares sobre cuidados domiciliares, suporte emocional e autonomia. Campanhas e ações comunitárias sobre luto, espiritualidade, autonomia e planejamento de cuidados. Também entram aqui as oficinas temáticas sobre espiritualidade, escuta ativa, manejo de cuidados, suporte à família e processo do luto.',
 2, true),
('Pesquisa', 'pesquisa',
 'Incentivo à produção científica em Cuidados Paliativos, com investigações sobre bem-estar, qualidade de vida, manejos de cuidados, terapias alternativas, práticas humanizadas e suporte familiar. Participação em estudos sobre a aplicação prática de diretrizes e modelos de cuidado reconhecidos na área. Engajamento dos membros em estudos, publicações e eventos científicos, e participação em congressos, jornadas, simpósios e seminários.',
 3, true),
-- Texto provisorio. Ver o bloco "SOBRE O TEXTO DA SECRETARIA" no topo do arquivo.
('Secretaria', 'secretaria',
 'A Secretaria cuida da vida interna e da comunicação da liga: registro e assinatura das atas de reunião, comunicação com os ligantes sobre encontros e frequência, organização do arquivo físico e digital, cadastro dos membros e o retorno a quem procura a LIACUP. É a frente que mantém a liga funcionando e guarda a memória do que foi feito.',
 4, true);

-- As duas orientadoras (secao 4.1) --------------------------------------------
-- "Kerolyn Ramos Garcia", nome completo, e uma das correcoes obrigatorias da
-- secao 7: o prototipo trazia "Kerolyn Ramos".
insert into public.docentes (nome, titulacao, formacao, ordem, publicado) values
('Mariana Sodário Cruz', 'Profa. Dra. — Orientadora Geral',
 'Graduada em Fonoaudiologia e em Ciências Econômicas, mestre e doutora em Saúde Coletiva, pós-doutora em Educação.',
 1, true),
('Kerolyn Ramos Garcia', 'Profa. Dra.',
 'Bacharel em Saúde Coletiva, pós-graduada em Gerontologia, mestre e doutora em Ciências e Tecnologias em Saúde.',
 2, true);

-- Os fundadores discentes (secao 4.2) -----------------------------------------
-- Nomes reais, do Estatuto, Art. 7. `eh_diretoria` fica FALSO em todos: o
-- documento institucional registra que sao fundadores, e NAO diz quem ocupa
-- cargo de diretoria. Marcar alguem como diretoria aqui seria inventar.
insert into public.ligantes (nome, eh_diretoria, ordem, publicado) values
('Ágata Heloisa Pereira da Conceição', false, 1, true),
('Carlos Gabriel Moreira Novais',      false, 2, true),
('Christian Lisboa de Souza',          false, 3, true),
('Eloah Pires de Almeida',             false, 4, true),
('Helena de Souza Fernandes',          false, 5, true);

-- As perguntas frequentes, inteiras (secao 6) ---------------------------------
insert into public.faq (pergunta, resposta, ordem, publicado) values
('Precisa ser de qual curso?',
 'Graduações da FCTS, Faculdade de Saúde, Faculdade de Medicina, Faculdade de Direito, Departamento de Psicologia e Serviço Social. Outros cursos podem ser considerados mediante análise da coordenação da LIACUP.', 1, true),
('A partir de que semestre posso entrar?', 'A partir do segundo semestre.', 2, true),
('Quanto tempo por semana?', 'Em média 10 horas semanais.', 3, true),
('E se eu faltar?',
 'Participações não justificadas, ao se acumularem em mais de 50%, culminam no desligamento do ligante do projeto.', 4, true),
('Tem certificado?',
 'Sim. O certificado é emitido via SIGAA a cada 2 semestres completos, contendo a carga horária cumprida.', 5, true),
('Tem mensalidade?', 'A semestralidade é de R$ 15,00. Os eventos são gratuitos.', 6, true),
('Com que frequência são as reuniões?', 'Quinzenais.', 7, true),
('Ligante recebe bolsa ou remuneração?',
 'Não. Nenhum serviço prestado na liga é remunerado.', 8, true);

-- =============================================================================
-- ESPACO RESERVADO — tudo daqui para baixo leva [EXEMPLO] no texto visivel
-- =============================================================================

-- Noticias: a liga ainda nao entregou texto de noticia nenhum.
insert into public.noticias (titulo, resumo, corpo, data_noticia, ordem, publicado, arquivado) values
('[EXEMPLO] Título de notícia para desenhar a listagem',
 '[EXEMPLO] Resumo de duas linhas, do tamanho que a lista de notícias vai receber de verdade, para o cartão ser desenhado no comprimento certo.',
 '[EXEMPLO] Corpo da notícia. Este texto não é da LIACUP e não deve ir ao ar: existe para as páginas terem o que mostrar antes de a diretoria escrever a primeira notícia de verdade.',
 '2026-08-01', 1, true, false),
('[EXEMPLO] Segunda notícia, para a lista ter mais de um item',
 '[EXEMPLO] Resumo curto.',
 '[EXEMPLO] Corpo da notícia.', '2026-07-15', 2, true, false),
('[EXEMPLO] Notícia arquivada, para a tela de arquivados ter o que mostrar',
 '[EXEMPLO] Resumo curto.',
 '[EXEMPLO] Corpo da notícia.', '2026-06-10', 3, true, true);

-- Eventos: as fotos do Julho Verde estao como pendencia na secao 8, e nao ha
-- descricao aprovada de evento nenhum. Entra marcado.
insert into public.eventos (titulo, descricao, local, data_evento, ordem, publicado) values
('[EXEMPLO] Evento futuro, para a lista de próximos',
 '[EXEMPLO] Descrição do evento.', '[EXEMPLO] Local a definir', '2027-03-20', 1, true),
('[EXEMPLO] Evento já realizado, para a lista de passados',
 '[EXEMPLO] Descrição do evento.', '[EXEMPLO] Local a definir', '2026-05-10', 2, true);

-- Materiais: a propria DEFINICAO da secao esta pendente (secao 8).
insert into public.materiais (titulo, descricao, tipo, ordem, publicado) values
('[EXEMPLO] Material de apoio', '[EXEMPLO] Descrição do material.', '[EXEMPLO] tipo', 1, true),
('[EXEMPLO] Segundo material', '[EXEMPLO] Descrição do material.', '[EXEMPLO] tipo', 2, true);

-- Conteudos educativos: sem material aprovado ate agora.
insert into public.conteudos_educativos (titulo, descricao, formato, ordem, publicado) values
('[EXEMPLO] Conteúdo educativo', '[EXEMPLO] Descrição.', '[EXEMPLO] formato', 1, true),
('[EXEMPLO] Segundo conteúdo educativo', '[EXEMPLO] Descrição.', '[EXEMPLO] formato', 2, true);

-- Leituras: AS TRES FICAM COMO RASCUNHO, DE PROPOSITO (T048).
-- E assim que o estado vazio da F01 passa a ser verificavel: a colecao tem dado,
-- o painel mostra tres linhas, e a pagina publica mostra o EstadoVazio. Sem uma
-- colecao nessa situacao, o terceiro estado nunca e exercido — e ele e o mais
-- provavel no primeiro dia no ar.
insert into public.leituras (titulo, autoria, referencia, ordem, publicado) values
('[EXEMPLO] Recomendação de leitura', '[EXEMPLO] Autoria', '[EXEMPLO] Referência', 1, false),
('[EXEMPLO] Segunda recomendação',    '[EXEMPLO] Autoria', '[EXEMPLO] Referência', 2, false),
('[EXEMPLO] Terceira recomendação',   '[EXEMPLO] Autoria', '[EXEMPLO] Referência', 3, false);

-- Galeria: as fotos do Julho Verde e as dos ligantes estao pendentes (secao 8).
insert into public.galeria_albuns (id, titulo, descricao, data_album, ordem, publicado) values
('00000000-0000-4000-8000-000000000001', '[EXEMPLO] Álbum de atividade',
 '[EXEMPLO] Descrição do álbum.', '2026-07-01', 1, true);

insert into public.galeria_fotos (album_id, legenda, ordem, publicado) values
('00000000-0000-4000-8000-000000000001', '[EXEMPLO] Legenda da foto', 1, true),
('00000000-0000-4000-8000-000000000001', '[EXEMPLO] Legenda da segunda foto', 2, true);

-- Mensagens e controle de origem NAO sao semeados: dado pessoal, ainda que
-- inventado, nao deve nascer junto com o banco. A caixa de entrada vazia e o
-- estado real de um portal que acabou de subir.
