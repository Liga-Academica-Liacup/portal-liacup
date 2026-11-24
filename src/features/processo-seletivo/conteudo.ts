/*
 * O CONTEÚDO DA PÁGINA DO PROCESSO SELETIVO
 *
 * Para quem não programa: todo texto da página /processo-seletivo mora aqui, e
 * só aqui. Os componentes não guardam texto; eles recebem este conteúdo e o
 * desenham. Para trocar uma pergunta, troque o texto abaixo. Nenhum componente
 * precisa mudar.
 *
 * Regra: o texto é, palavra por palavra, o do docs/conteudo-institucional.md.
 * Nada é reescrito, resumido nem inventado. Um teste de ponta a ponta compara a
 * página publicada com o documento, lendo o documento.
 *
 * De onde vem cada parte:
 *   - título, apresentação: seção 5 e 5.2;
 *   - selo "Inscrições fechadas": briefing da change, apoiado na seção 5.1;
 *   - aviso de inscrições fechadas: seção 5.1 (decisão do Gabriel, Q1 (b));
 *   - etapas: seção 5.5, as cinco (decisão do Gabriel, 21/11/2026). O " · "
 *     vira a quebra entre o nome e o caráter;
 *   - quem pode se inscrever: os quatro itens da subseção "Texto da página"
 *     da seção 5.3, que vale também pela 5.4, sem a nota de fonte em itálico
 *     do item 3 (Q4 (a)). O texto do edital, abaixo dela no documento, é a
 *     fonte e não vai ao ar;
 *   - perguntas e respostas: seção 6, sem a nota de fonte em itálico do fim
 *     de cada resposta (decisão do Gabriel, Q4 (a));
 *   - títulos e sobretítulos das seções: rótulos do protótipo, com
 *     "Cronograma" trocado por "Etapas" (REFERENCIA-VISUAL.md, seção 7; Q3 (a));
 *   - nome acessível do link: o mesmo rótulo do link do Instagram no rodapé.
 *   - rótulo do botão da faixa da página inicial: "Quero participar", o do
 *     botão do hero, na REFERENCIA-VISUAL.md, seção 7 (Q3 (a) do Gabriel na
 *     change inicio-completo, 23/11/2026). A faixa lê o título e as
 *     inscrições deste mesmo objeto, para nunca contradizer esta página.
 *
 * Quem confere este arquivo é o `conteudo.test.ts`: pergunta sem resposta,
 * item vazio, número de itens diferente de quatro ou de etapas diferente de
 * cinco deixam `npm test`
 * vermelho, nomeando o item.
 */
import type { ConteudoDoProcessoSeletivo } from './tipos'

export const CONTEUDO_DO_PROCESSO_SELETIVO: ConteudoDoProcessoSeletivo = {
  titulo: 'Processo seletivo',
  apresentacao:
    'A LIACUP seleciona novos ligantes por meio de processo seletivo, aberto a estudantes de graduação da Universidade de Brasília a partir do segundo semestre. Cada processo tem seu próprio edital, com o número de vagas, as áreas e o cronograma daquele semestre.',
  inscricoes: {
    estado: 'fechado',
    selo: 'Inscrições fechadas',
    aviso: {
      antesDoLink: 'As inscrições estão fechadas. Acompanhe a Liga no Instagram ',
      textoDoLink: '@liacup.unb',
      depoisDoLink: ' para saber quando abre o próximo processo seletivo.',
      endereco: 'https://www.instagram.com/liacup.unb/',
      nomeAcessivelDoLink: 'Instagram da LIACUP, @liacup.unb (abre em nova aba)',
    },
  },
  secoes: {
    etapas: { sobretitulo: 'Etapas', titulo: 'Como funciona' },
    requisitos: { sobretitulo: 'Requisitos', titulo: 'Quem pode se inscrever' },
    perguntas: { sobretitulo: 'FAQ', titulo: 'Perguntas que sempre chegam' },
  },
  chamadaDaInicial: { rotuloDoBotao: 'Quero participar' },
  etapas: [
    { nome: 'Inscrição por formulário', carater: 'Etapa eliminatória.' },
    { nome: 'Análise do produto', carater: 'Etapa eliminatória.' },
    { nome: 'Entrevista online via Meet', carater: 'Etapa classificatória, para os convocados.' },
    { nome: 'Resultado', carater: 'Divulgação no Instagram da Liga.' },
    { nome: 'Integração', carater: 'Encontro de boas-vindas.' },
  ],
  quemPodeSeInscrever: [
    'Estar matriculado em curso de graduação da UnB, a partir do 2º semestre.',
    'Disponibilidade média de 10 horas semanais para as atividades da Liga.',
    'Faltas não justificadas acima de 50% levam ao desligamento da Liga.',
    'Afinidade e interesse pela temática dos cuidados paliativos.',
  ],
  perguntas: [
    {
      pergunta: 'Precisa ser de qual curso?',
      resposta:
        'Graduações da FCTS, Faculdade de Saúde, Faculdade de Medicina, Faculdade de Direito, Departamento de Psicologia e Serviço Social. Outros cursos podem ser considerados mediante análise da coordenação da LIACUP.',
    },
    {
      pergunta: 'A partir de que semestre posso entrar?',
      resposta: 'A partir do segundo semestre.',
    },
    {
      pergunta: 'Quanto tempo por semana?',
      resposta: 'Em média 10 horas semanais.',
    },
    {
      pergunta: 'E se eu faltar?',
      resposta:
        'Participações não justificadas, ao se acumularem em mais de 50%, culminam no desligamento do ligante do projeto.',
    },
    {
      pergunta: 'Tem certificado?',
      resposta:
        'Sim. O certificado é emitido via SIGAA a cada 2 semestres completos, contendo a carga horária cumprida.',
    },
    {
      pergunta: 'Tem mensalidade?',
      resposta: 'A semestralidade é de R$ 15,00. Os eventos são gratuitos.',
    },
    {
      pergunta: 'Com que frequência são as reuniões?',
      resposta: 'Quinzenais.',
    },
    {
      pergunta: 'Ligante recebe bolsa ou remuneração?',
      resposta: 'Não. Nenhum serviço prestado na liga é remunerado.',
    },
  ],
}
