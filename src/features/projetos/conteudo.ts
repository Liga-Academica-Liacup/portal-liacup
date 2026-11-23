/*
 * O CONTEÚDO DA PÁGINA PROJETOS
 *
 * Para quem não programa: todo texto da página /projetos mora aqui, e só aqui.
 * Os componentes não guardam texto; eles recebem este conteúdo e o desenham.
 * Para trocar o texto de uma frente, troque o texto abaixo. Nenhum componente
 * precisa mudar.
 *
 * Regra: o texto é, palavra por palavra, o do docs/conteudo-institucional.md.
 * Nada é reescrito, resumido nem inventado. Um teste de ponta a ponta compara a
 * página publicada com o documento, lendo o documento.
 *
 * De onde vem cada parte (design.md da change pagina-projetos, "Fontes do texto
 * que vai ao ar"):
 *   - sobretítulo "Projetos" e título "Ensino, Extensão, Pesquisa e
 *     Secretaria": rótulos de interface (REFERENCIA-VISUAL.md, seção 7; Q2 (a)
 *     do Gabriel, 23/11/2026). Sem frase embaixo do título;
 *   - nome de cada frente: o título de nível 3 da seção 3, sem a nota de fonte
 *     entre parênteses e, na Secretaria, sem o aviso depois do travessão;
 *   - texto de Ensino, Extensão e Pesquisa: o parágrafo da seção 3, inteiro;
 *   - texto da Secretaria: o parágrafo citado da seção 3, inteiro, sem a marca
 *     de itálico (Q5 (a)), e sem nenhuma marca de rascunho, como a seção 3
 *     decide em "Como o texto provisório aparece no site".
 *
 * Quem confere este arquivo é o `conteudo.test.ts`: número de frentes diferente
 * de quatro, nome fora da ordem, texto vazio ou repetido, título da faixa que
 * não junta os quatro nomes, e termo de rascunho ou de nota de fonte deixam
 * `npm test` vermelho, nomeando a frente.
 */
import type { ConteudoDeProjetos } from './tipos'

export const CONTEUDO_DE_PROJETOS: ConteudoDeProjetos = {
  faixa: { sobretitulo: 'Projetos', titulo: 'Ensino, Extensão, Pesquisa e Secretaria' },
  frentes: [
    {
      nome: 'Ensino',
      texto:
        'Vivências teórico-práticas que complementam a formação acadêmica, estimulando uma formação humanista, reflexiva, crítica e multidisciplinar. Encontros, ações e eventos científicos, acadêmicos e humanísticos, como minicursos e simpósios. Metodologias ativas de aprendizado, como discussão e apresentação de casos, análise de artigos e construção de aulas.',
    },
    {
      nome: 'Extensão',
      texto:
        'Difusão do conhecimento em Cuidados Paliativos por meio de ações abertas à comunidade, como palestras, oficinas, rodas de conversa e campanhas educativas. Desenvolvimento de materiais educativos para pacientes e familiares sobre cuidados domiciliares, suporte emocional e autonomia. Campanhas e ações comunitárias sobre luto, espiritualidade, autonomia e planejamento de cuidados. Também entram aqui as oficinas temáticas sobre espiritualidade, escuta ativa, manejo de cuidados, suporte à família e processo do luto.',
    },
    {
      nome: 'Pesquisa',
      texto:
        'Incentivo à produção científica em Cuidados Paliativos, com investigações sobre bem-estar, qualidade de vida, manejos de cuidados, terapias alternativas, práticas humanizadas e suporte familiar. Participação em estudos sobre a aplicação prática de diretrizes e modelos de cuidado reconhecidos na área. Engajamento dos membros em estudos, publicações e eventos científicos, e participação em congressos, jornadas, simpósios e seminários.',
    },
    {
      nome: 'Secretaria',
      texto:
        'A Secretaria cuida da vida interna e da comunicação da liga: registro e assinatura das atas de reunião, comunicação com os ligantes sobre encontros e frequência, organização do arquivo físico e digital, cadastro dos membros e o retorno a quem procura a LIACUP. É a frente que mantém a liga funcionando e guarda a memória do que foi feito.',
    },
  ],
}
