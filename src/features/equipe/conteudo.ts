/*
 * O CONTEÚDO DA PÁGINA EQUIPE
 *
 * Para quem não programa: todo texto da página /equipe mora aqui, e só aqui.
 * Os docentes também aparecem na página Sobre, lidos daqui. Os componentes não
 * guardam texto; eles recebem este conteúdo e o desenham. Para trocar uma
 * linha, troque o texto abaixo. Nenhum componente precisa mudar.
 *
 * Regra: o texto é, palavra por palavra, o do docs/conteudo-institucional.md.
 * Nada é reescrito, resumido nem inventado. Um teste de ponta a ponta compara a
 * página publicada com o documento, lendo o documento.
 *
 * De onde vem cada parte (design.md da change pagina-sobre-e-equipe, "Fontes
 * do texto que vai ao ar"):
 *   - sobretítulo "Equipe" e título "Quem faz a LIACUP": rótulos de interface
 *     (REFERENCIA-VISUAL.md, seção 7; Q2 (b) do Gabriel, 22/11/2026);
 *   - títulos dos blocos: rótulos do protótipo, e "Fundadores discentes", o
 *     título da seção 4.2 (REFERENCIA-VISUAL.md, seção 7; Q4 (a));
 *   - cargos: seção 4.3, colunas "Cargo" e "Em uma linha", sem os numerais
 *     romanos. Sem nome de pessoa: o documento não diz quem ocupa cada cargo;
 *   - fundadores: seção 4.2, na ordem do documento (Q8 (a));
 *   - docentes: seção 4.1, com o nome completo "Kerolyn Ramos Garcia", o
 *     cargo "Orientadora Geral" com G maiúsculo, como o documento, e o cargo
 *     "Orientadora" da Kerolyn (Q6 (b)).
 *
 * As iniciais do círculo dos docentes não ficam escritas aqui: saem do nome,
 * pela regra do `regras.ts`. Trocar o nome troca as iniciais.
 *
 * Quem confere este arquivo é o `conteudo.test.ts`: número de cargos diferente
 * de seis, de fundadores diferente de cinco, de docentes diferente de dois,
 * texto vazio ou repetido deixam `npm test` vermelho, nomeando o item.
 */
import type { ConteudoDaEquipe } from './tipos'

export const CONTEUDO_DA_EQUIPE: ConteudoDaEquipe = {
  faixa: { sobretitulo: 'Equipe', titulo: 'Quem faz a LIACUP' },
  titulos: {
    diretoria: 'Diretoria',
    fundadores: 'Fundadores discentes',
    docentes: 'Docentes orientadores',
  },
  cargos: [
    {
      cargo: 'Presidente',
      linha:
        'Intermedia a relação com a orientação, conduz as ações, coordena o processo seletivo e representa a liga',
    },
    {
      cargo: 'Vice-presidente',
      linha: 'Substitui e supervisiona junto à presidência; também coordena o processo seletivo',
    },
    {
      cargo: 'Diretor(a) financeiro(a)',
      linha: 'Tesouraria, balanços semestrais e captação de recursos',
    },
    {
      cargo: 'Secretário(a)-Geral',
      linha: 'Atas, comunicação da liga, arquivo e cadastro dos membros',
    },
    {
      cargo: 'Diretor(a) de ensino e extensão',
      linha: 'Calendário de atividades, palestrantes, material didático e ações de extensão',
    },
    {
      cargo: 'Diretor(a) de pesquisa e mídia',
      linha: 'Projetos de pesquisa, apoio a trabalhos científicos, divulgação e mídias sociais',
    },
  ],
  fundadores: [
    'Ágata Heloisa Pereira da Conceição',
    'Carlos Gabriel Moreira Novais',
    'Christian Lisboa de Souza',
    'Eloah Pires de Almeida',
    'Helena de Souza Fernandes',
  ],
  docentes: [
    {
      nome: 'Profa. Dra. Mariana Sodário Cruz',
      cargo: 'Orientadora Geral',
      formacao:
        'Graduada em Fonoaudiologia e em Ciências Econômicas, mestre e doutora em Saúde Coletiva, pós-doutora em Educação.',
    },
    {
      nome: 'Profa. Dra. Kerolyn Ramos Garcia',
      cargo: 'Orientadora',
      formacao:
        'Bacharel em Saúde Coletiva, pós-graduada em Gerontologia, mestre e doutora em Ciências e Tecnologias em Saúde.',
    },
  ],
}
