/*
 * O CONTEÚDO DA PÁGINA SOBRE
 *
 * Para quem não programa: todo texto da página /sobre mora aqui, e só aqui,
 * fora os docentes orientadores, que moram em src/features/equipe/conteudo.ts
 * (as duas páginas mostram os mesmos). Os componentes não guardam texto; eles
 * recebem este conteúdo e o desenham. Para trocar um parágrafo, troque o texto
 * abaixo. Nenhum componente precisa mudar.
 *
 * Regra: o texto é, palavra por palavra, o do docs/conteudo-institucional.md.
 * Nada é reescrito, resumido nem inventado. Um teste de ponta a ponta compara a
 * página publicada com o documento, lendo o documento.
 *
 * De onde vem cada parte (design.md da change pagina-sobre-e-equipe, "Fontes
 * do texto que vai ao ar"):
 *   - título "Sobre a LIACUP": rótulo de interface (REFERENCIA-VISUAL.md,
 *     seção 7; Q2 (b) do Gabriel, 22/11/2026);
 *   - apresentação: seção 2.1;
 *   - história: seção 2.2;
 *   - o que a Liga se propõe a fazer: seções 2.3 a 2.6, inteiras, com o título
 *     de cada seção sem o "— Sobre" (Q3 (a)). A nota de fonte do fim da 2.4,
 *     "(Estatuto, Art. 2º)", não vai ao ar (Q10 (a));
 *   - títulos e sobretítulos das seções: rótulos do protótipo
 *     (REFERENCIA-VISUAL.md, seção 7; Q4 (a)).
 *
 * Quem confere este arquivo é o `conteudo.test.ts`: item sem nome ou sem
 * parágrafo, item repetido, nota de fonte copiada junto ou número de itens
 * diferente de quatro deixam `npm test` vermelho, nomeando o item.
 */
import type { ConteudoDoSobre } from './tipos'

export const CONTEUDO_DO_SOBRE: ConteudoDoSobre = {
  titulo: 'Sobre a LIACUP',
  apresentacao:
    'A Liga Acadêmica Multiprofissional de Cuidados Paliativos (LIACUP) é um projeto que une o ensino, pesquisa e extensão para dar enfoque a importância dos cuidados paliativos como uma abordagem cujo acesso e conhecimento deve abranger não só a comunidade acadêmica, como a população em geral.',
  historia: {
    secao: { sobretitulo: 'Nossa história', titulo: 'Como a Liga começou' },
    texto:
      'A liga surge a partir do interesse de um grupo de discentes ao terem contato com o tema através de uma matéria ministrada pela professora Mariana Sodário. Um dos fatores que mais intrigou os estudantes, além da escassez de disciplinas que centralizasse os cuidados paliativos, refletindo a falta de difusão do tema até mesmo dentro do campo acadêmico, foi a ausência de políticas públicas consolidadas e difusas entre a população, haja vista o grande impacto positivo que esta abordagem possui, trazendo conforto àqueles que possuem uma condição que ameace sua vida.',
  },
  objetivos: {
    secao: { sobretitulo: 'Objetivos', titulo: 'O que a Liga se propõe a fazer' },
    itens: [
      {
        nome: 'Objetivo geral',
        paragrafos: [
          'O objetivo da LIACUP é desenvolver futuros profissionais que entendam a relação saúde-doença de uma forma mais holística, sendo capaz de acolher o binômio paciente-familiar, olhando para as necessidades do paciente, durante o adoecimento, como também para o familiar, cujo acompanhamento começa junto ao paciente e se prolonga até o momento do luto.',
          'Todas essas metas são atingidas através de ações, como aulas para os ligantes, podendo ser conduzidas por docentes do projeto ou da comunidade externa, discussões de artigos, atividades práticas, colaborações com outros projetos, entre outros.',
        ],
      },
      {
        nome: 'Finalidade institucional',
        paragrafos: [
          'A LIACUP, sempre pautada em princípios éticos e humanitários, tem como objetivo o cuidado integral e o bem-estar no contexto dos Cuidados Paliativos. Para isso, adota o tripé ensino-pesquisa-extensão de forma integrada, buscando gerar impacto acadêmico, social e formativo para o corpo discente da UnB e contribuir com o fortalecimento da saúde.',
        ],
      },
      {
        nome: 'Impacto social',
        paragrafos: [
          'O impacto produzido pela LIACUP é refletido por diversas formas, seja através dos materiais informativos que produzimos (cuja finalidade é tornar o saber científico acessível a população), seja pela articulação da liga com instâncias próximas ao poder público, como a Academia Distrital de Cuidados Paliativos do Distrito Federal (ADCP-DF), ou até mesclando ambos os públicos através de eventos na universidade, gerando um debate com visões diversas; dentre outras formas que o projeto se destaca na sociedade.',
        ],
      },
      {
        nome: 'Protagonismo estudantil',
        paragrafos: [
          'Com a permissão da coordenadora do projeto, a maioria das atividades são organizadas pelos estudantes, desde a escolha do profissional e do tema para as aulas e debates, até a produção de eventos (como a Jornada do Julho Verde), o que nos ajuda a desenvolver diferentes aspectos para nossas futuras profissões, como a maturidade para lidar com temas delicados, a valorização de evidências científicas fortes, formação de networking, entre outros.',
        ],
      },
    ],
  },
  secaoDosDocentes: { sobretitulo: 'Orientação', titulo: 'Professores orientadores' },
}
