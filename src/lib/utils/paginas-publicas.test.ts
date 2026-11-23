import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterAll, describe, expect, it, vi } from 'vitest'
import {
  ENTRADAS_DA_LISTA,
  PAGINAS_PUBLICAS,
  contarCaracteres,
  estaNaLista,
  paginaDeDestaque,
  paginasDaColuna,
  paginasDoMenu,
  problemasDaLista,
  tituloEsperado,
} from './paginas-publicas'

/*
 * Confere a lista única das páginas públicas (design.md da layout-e-hero, D3, e
 * da pagina-processo-seletivo, D3).
 *
 * O primeiro teste é o que importa: ele lê o JSON de verdade e fica vermelho
 * nomeando a entrada errada. Os outros mostram que a conferência pega cada
 * problema, com listas inventadas aqui mesmo, para ninguém precisar estragar o
 * JSON para ver a conferência funcionar.
 *
 * O número de entradas conferidas e os caracteres de cada descrição saem
 * impressos no fim: sem eles, "nada falhou" e "nada foi conferido" dão a mesma
 * saída (RP-12).
 */
let entradasConferidas = 0
let caracteresDasDescricoes: string[] = []
let descricoesAchadas = 0

/** O documento de onde sai todo texto do site, em NFC, para "ã" bater com "ã". */
function lerConteudoInstitucional(): string {
  // A partir da raiz do projeto, onde o `npm test` roda: no ambiente jsdom o
  // import.meta.url não é um caminho de arquivo.
  const caminho = join(process.cwd(), 'docs', 'conteudo-institucional.md')
  return readFileSync(caminho, 'utf8').normalize('NFC')
}

/**
 * A primeira frase da primeira citação da seção "### <numero> ...": do começo
 * da citação até o primeiro ponto seguido de espaço ou do fim da linha. Seção
 * ou citação ausente lança erro nomeando a seção, para o teste não passar em
 * silêncio comparando com nada.
 */
function primeiraFraseDaApresentacao(documento: string, numero: string): string {
  const linhas = documento.split(/\r?\n/)
  const inicio = linhas.findIndex((linha) => linha.startsWith(`### ${numero} `))
  if (inicio === -1) throw new Error(`seção ${numero} não encontrada no conteudo-institucional.md`)
  const fim = linhas.findIndex((linha, i) => i > inicio && /^#{1,3} /.test(linha))
  const secao = linhas.slice(inicio + 1, fim === -1 ? undefined : fim)
  const citacao = secao.find((linha) => linha.startsWith('> '))
  if (citacao === undefined) throw new Error(`seção ${numero} sem citação no documento`)
  const texto = citacao.slice(2).trim()
  const ponto = /\.(\s|$)/.exec(texto)
  return ponto === null ? texto : texto.slice(0, ponto.index + 1)
}

/**
 * A primeira citação (as linhas que começam com "> ") logo abaixo do título
 * "## <numero>. ..." de uma seção de nível 2, inteira. A descrição da Equipe
 * mora assim no §4, como decisão do Gabriel (Q9 (a) da pagina-sobre-e-equipe),
 * a de Projetos no §3 (Q3 (a) da pagina-projetos) e a de Contato no §1 (Q4 (a)
 * da pagina-contato).
 */
function citacaoDaSecaoDeNivel2(documento: string, numero: string): string {
  const linhas = documento.split(/\r?\n/)
  const inicio = linhas.findIndex((linha) => linha.startsWith(`## ${numero}. `))
  if (inicio === -1) throw new Error(`seção ${numero} não encontrada no conteudo-institucional.md`)
  const fim = linhas.findIndex((linha, i) => i > inicio && /^#{1,3} /.test(linha))
  const secao = linhas.slice(inicio + 1, fim === -1 ? undefined : fim)
  const citacao = secao.find((linha) => linha.startsWith('> '))
  if (citacao === undefined) throw new Error(`seção ${numero} sem citação no documento`)
  return citacao.slice(2).trim()
}

/** Uma entrada válida, inventada aqui, com título no formato e descrição própria. */
function entrada(
  endereco: string,
  rotulo: string,
  extra: { destaque?: boolean; colunaDoRodape?: string | null } = {}
) {
  return {
    endereco,
    rotulo,
    titulo: tituloEsperado({ endereco, rotulo }),
    descricao: `Descrição de teste da página ${rotulo}, inventada aqui, com o tamanho certo para a lista.`,
    noMenu: true,
    colunaDoRodape: 'Portal' as string | null,
    destaque: false,
    ...extra,
  }
}

const valida = entrada('/', 'Início')

describe('lista de páginas públicas', () => {
  it('a lista do site não tem nenhum problema', () => {
    const problemas = problemasDaLista(ENTRADAS_DA_LISTA)
    entradasConferidas = ENTRADAS_DA_LISTA.length
    caracteresDasDescricoes = ENTRADAS_DA_LISTA.map(
      (pagina) => `"${pagina.endereco}" ${contarCaracteres(pagina.descricao)}`
    )
    expect(problemas, `Problemas na lista: ${problemas.join('; ')}`).toEqual([])
    expect(ENTRADAS_DA_LISTA.length, 'a lista não pode estar vazia').toBeGreaterThan(0)
  })

  it('os títulos desta entrega são os da Q6 (a) e do D3 da pagina-sobre-e-equipe, da pagina-projetos e da pagina-contato', () => {
    const titulos = Object.fromEntries(PAGINAS_PUBLICAS.map((p) => [p.endereco, p.titulo]))
    expect(titulos['/']).toBe('Liga Acadêmica Multiprofissional de Cuidados Paliativos · LIACUP')
    expect(titulos['/sobre']).toBe('Sobre · LIACUP')
    expect(titulos['/processo-seletivo']).toBe('Processo seletivo · LIACUP')
    expect(titulos['/projetos']).toBe('Projetos · LIACUP')
    expect(titulos['/equipe']).toBe('Equipe · LIACUP')
    expect(titulos['/contato']).toBe('Contato · LIACUP')
  })

  it('o menu e o rodapé seguem a ordem do protótipo: Início, Sobre, Projetos, Equipe e Contato', () => {
    const rotulos = (paginas: readonly { rotulo: string }[]) => paginas.map((p) => p.rotulo)
    expect(rotulos(paginasDoMenu())).toEqual(['Início', 'Sobre', 'Projetos', 'Equipe', 'Contato'])
    expect(rotulos(paginasDaColuna('Portal'))).toEqual(['Início', 'Sobre'])
    expect(rotulos(paginasDaColuna('Conteúdo'))).toEqual(['Projetos', 'Equipe', 'Contato'])
  })

  /*
   * A descrição é texto que vai ao ar: sai do conteudo-institucional.md como
   * está, sem reescrita (constitution; Q6 (a) do Gabriel). A da Início é a
   * primeira frase da apresentação do §2.0; a do Processo seletivo, a primeira
   * frase da apresentação do §5.2. "Apresentação" é a primeira citação (as
   * linhas que começam com "> ") da seção.
   */
  it('cada descrição é um trecho literal do conteudo-institucional.md, e as desta entrega são as da Q6 (a)', () => {
    const documento = lerConteudoInstitucional()
    const fora = ENTRADAS_DA_LISTA.filter(
      (pagina) => !documento.includes(pagina.descricao.normalize('NFC'))
    ).map((pagina) => `"${pagina.endereco}": "${pagina.descricao}"`)
    descricoesAchadas = ENTRADAS_DA_LISTA.length - fora.length
    expect(fora, 'descrições que não estão no conteudo-institucional.md').toEqual([])

    const descricoes = Object.fromEntries(PAGINAS_PUBLICAS.map((p) => [p.endereco, p.descricao]))
    expect(descricoes['/'], 'a da "/" é a primeira frase do §2.0').toBe(
      primeiraFraseDaApresentacao(documento, '2.0')
    )
    expect(descricoes['/processo-seletivo'], 'a da "/processo-seletivo" é a do §5.2').toBe(
      primeiraFraseDaApresentacao(documento, '5.2')
    )
    // Q9 (a) da pagina-sobre-e-equipe: a 1ª frase do §2.4 e a frase do §4.
    expect(descricoes['/sobre'], 'a da "/sobre" é a 1ª frase do §2.4').toBe(
      primeiraFraseDaApresentacao(documento, '2.4')
    )
    expect(descricoes['/equipe'], 'a da "/equipe" é a citação do §4').toBe(
      citacaoDaSecaoDeNivel2(documento, '4')
    )
    // Q3 (a) da pagina-projetos: a frase registrada logo abaixo do título "## 3.".
    expect(descricoes['/projetos'], 'a da "/projetos" é a citação do §3').toBe(
      citacaoDaSecaoDeNivel2(documento, '3')
    )
    // Q4 (a) da pagina-contato: a frase registrada logo abaixo do título "## 1.".
    expect(descricoes['/contato'], 'a da "/contato" é a citação do §1').toBe(
      citacaoDaSecaoDeNivel2(documento, '1')
    )
  })

  it('acusa endereço repetido, nomeando-o', () => {
    const problemas = problemasDaLista([entrada('/a', 'A'), entrada('/a', 'Outra')])
    expect(problemas).toEqual(['endereço "/a" repetido'])
  })

  it('acusa endereço que não começa com "/"', () => {
    expect(problemasDaLista([entrada('sobre', 'Sobre')])).toEqual([
      'endereço "sobre" não começa com "/"',
    ])
  })

  /*
   * PADROES-DE-CODIGO.md, 11.1: endereço em minúsculo, com hífen, sem acento.
   * "//exemplo.com" é o caso que importa: começa com "/", mas o navegador o lê
   * como outro site (guardião, F-04).
   */
  it('acusa endereço fora do formato: outro site, maiúscula, sublinhado, acento ou barra no fim', () => {
    const errados = ['//exemplo.com', '/Processo_Seletivo', '/sobre/', '/notícias', '/a//b']
    // Todos de uma vez: o vermelho mostra cada endereço, e não só o primeiro.
    const achados = Object.fromEntries(
      errados.map((endereco) => [endereco, problemasDaLista([entrada(endereco, 'Uma página')])])
    )
    const esperados = Object.fromEntries(
      errados.map((endereco) => [
        endereco,
        [
          `endereço "${endereco}" fora do formato: só "/" ou partes de letras minúsculas, ` +
            'números e hífen, cada uma depois de uma "/", sem acento',
        ],
      ])
    )
    expect(achados).toEqual(esperados)
  })

  it('aceita a Início e endereços de uma ou mais partes no formato', () => {
    const certos = ['/', '/processo-seletivo', '/projetos/ensino', '/edital-02-2026']
    const achados = certos.map((endereco) => problemasDaLista([entrada(endereco, 'Uma página')]))
    expect(achados).toEqual(certos.map(() => []))
  })

  it('acusa rótulo vazio', () => {
    expect(problemasDaLista([{ ...valida, rotulo: '  ' }])).toEqual([
      'rótulo vazio no endereço "/"',
    ])
  })

  it('acusa coluna do rodapé desconhecida', () => {
    expect(problemasDaLista([{ ...valida, colunaDoRodape: 'Painel' }])).toEqual([
      'coluna do rodapé "Painel" desconhecida no endereço "/"',
    ])
  })

  it('acusa mais de uma página de destaque', () => {
    const problemas = problemasDaLista([
      entrada('/a', 'A', { destaque: true }),
      entrada('/b', 'B', { destaque: true }),
    ])
    expect(problemas).toEqual(['2 páginas de destaque ("/a", "/b"); o máximo é uma'])
  })

  it('acusa título repetido, nomeando o título e os dois endereços', () => {
    const repetida = { ...entrada('/b', 'B'), titulo: 'A · LIACUP' }
    expect(problemasDaLista([entrada('/a', 'A'), repetida])).toEqual([
      'título "A · LIACUP" no endereço "/b" fora do formato; o esperado é "B · LIACUP"',
      'título "A · LIACUP" repetido nos endereços "/a" e "/b"',
    ])
  })

  it('acusa título fora do formato, e a Início com o nome da liga por extenso', () => {
    expect(problemasDaLista([{ ...entrada('/a', 'A'), titulo: 'LIACUP · A' }])).toEqual([
      'título "LIACUP · A" no endereço "/a" fora do formato; o esperado é "A · LIACUP"',
    ])
    expect(problemasDaLista([{ ...valida, titulo: 'Início · LIACUP' }])).toEqual([
      'título "Início · LIACUP" no endereço "/" fora do formato; o esperado é ' +
        '"Liga Acadêmica Multiprofissional de Cuidados Paliativos · LIACUP"',
    ])
  })

  it('acusa título e descrição vazios', () => {
    expect(problemasDaLista([{ ...valida, titulo: ' ', descricao: '' }])).toEqual([
      'título vazio no endereço "/"',
      'descrição vazia no endereço "/"',
    ])
  })

  it('acusa descrição fora de 70 a 160 caracteres, contados em caracteres e não em bytes', () => {
    // "ã" ocupa dois bytes: contados em bytes, 69 dariam 138 e passariam.
    expect(problemasDaLista([{ ...valida, descricao: 'ã'.repeat(69) }])).toEqual([
      'descrição com 69 caracteres no endereço "/"; o tamanho é de 70 a 160',
    ])
    expect(problemasDaLista([{ ...valida, descricao: 'a'.repeat(161) }])).toEqual([
      'descrição com 161 caracteres no endereço "/"; o tamanho é de 70 a 160',
    ])
    expect(problemasDaLista([{ ...valida, descricao: 'ã'.repeat(70) }])).toEqual([])
    expect(problemasDaLista([{ ...valida, descricao: 'a'.repeat(160) }])).toEqual([])
  })

  it('acusa descrição repetida, nomeando os dois endereços', () => {
    const repetida = { ...entrada('/b', 'B'), descricao: entrada('/a', 'A').descricao }
    expect(problemasDaLista([entrada('/a', 'A'), repetida])).toEqual([
      'descrição repetida nos endereços "/a" e "/b"',
    ])
  })

  it('as consultas leem a lista, e não uma cópia', () => {
    expect(paginasDoMenu()).toEqual(PAGINAS_PUBLICAS.filter((pagina) => pagina.noMenu))
    expect(paginasDaColuna('Portal')).toEqual(
      PAGINAS_PUBLICAS.filter((pagina) => pagina.colunaDoRodape === 'Portal')
    )
    expect(paginaDeDestaque()).toEqual(PAGINAS_PUBLICAS.find((pagina) => pagina.destaque))
    expect(estaNaLista('/')).toBe(PAGINAS_PUBLICAS.some((pagina) => pagina.endereco === '/'))
    expect(estaNaLista('/endereco-que-nao-existe')).toBe(false)
  })

  /*
   * Com a lista de verdade, uma consulta que ignorasse o próprio filtro poderia
   * devolver o mesmo que a certa, e o teste de cima passaria (visto na rodada 5
   * do qa da layout-e-hero). Aqui o módulo é carregado de novo lendo uma lista
   * de teste no lugar do JSON, com uma página em cada situação, e cada consulta
   * tem de separar as dela.
   */
  it('cada consulta filtra pelo campo dela, numa lista de teste com uma página de cada tipo', async () => {
    const listaDeTeste = [
      entrada('/', 'Início'),
      { ...entrada('/so-no-rodape', 'Só no rodapé'), noMenu: false, colunaDoRodape: 'Conteúdo' },
      entrada('/destaque', 'Destaque', { colunaDoRodape: null, destaque: true }),
    ]
    const enderecos = (paginas: readonly { endereco: string }[]) =>
      paginas.map((pagina) => pagina.endereco)
    vi.resetModules()
    vi.doMock('./paginas-publicas.json', () => ({ default: listaDeTeste }))
    try {
      const modulo = await import('./paginas-publicas')
      expect(enderecos(modulo.PAGINAS_PUBLICAS), 'o módulo não leu a lista de teste').toEqual(
        enderecos(listaDeTeste)
      )
      expect(enderecos(modulo.paginasDoMenu()), 'paginasDoMenu').toEqual(['/', '/destaque'])
      expect(enderecos(modulo.paginasDaColuna('Portal')), 'coluna Portal').toEqual(['/'])
      expect(enderecos(modulo.paginasDaColuna('Conteúdo')), 'coluna Conteúdo').toEqual([
        '/so-no-rodape',
      ])
      expect(modulo.paginaDeDestaque()?.endereco, 'paginaDeDestaque').toBe('/destaque')
      expect(modulo.estaNaLista('/so-no-rodape'), 'estaNaLista, página da lista').toBe(true)
      expect(modulo.estaNaLista('/so-no'), 'estaNaLista, só o começo do endereço').toBe(false)
      expect(modulo.estaNaLista('/sobre'), 'estaNaLista, página fora da lista').toBe(false)
    } finally {
      vi.doUnmock('./paginas-publicas.json')
      vi.resetModules()
    }
  })

  it('a lista vem congelada, para nenhum componente alterá-la', () => {
    expect(Object.isFrozen(PAGINAS_PUBLICAS)).toBe(true)
    expect(PAGINAS_PUBLICAS.every((pagina) => Object.isFrozen(pagina))).toBe(true)
  })

  /*
   * process.stdout, e não console.log: o Vitest esconde o console.log de um
   * afterAll, e o contador precisa aparecer na saída de `npm test`.
   */
  afterAll(() => {
    process.stdout.write(
      `Entradas da lista de páginas públicas conferidas: ${entradasConferidas}\n` +
        `Caracteres de cada descrição: ${caracteresDasDescricoes.join(' · ')}\n` +
        `Descrições achadas no conteudo-institucional.md: ${descricoesAchadas} de ${entradasConferidas}\n`
    )
  })
})
