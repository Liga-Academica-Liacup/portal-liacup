/*
 * A LISTA ÚNICA DAS PÁGINAS PÚBLICAS
 *
 * Para quem não programa: o arquivo `paginas-publicas.json`, ao lado deste, diz
 * quais páginas do site existem. O menu, o rodapé, o botão de destaque do
 * cabeçalho, os botões do hero, os testes e o Lighthouse leem dele. Página fora
 * da lista não aparece em lugar nenhum; página na lista aparece em todos os
 * lugares marcados nela, sem ninguém editar o cabeçalho, o rodapé ou o hero.
 *
 * Regra: a página entra na lista NA MESMA change que cria a página, nunca antes
 * (constitution, princípio 8). O passo a passo está no README, seção "Como
 * acrescentar uma página ao menu".
 *
 * O dado mora em JSON, e não aqui, porque a configuração do Lighthouse precisa
 * lê-lo sem compilar TypeScript (design.md da change layout-e-hero, D3).
 *
 * Quem confere a lista é o teste `paginas-publicas.test.ts`: endereço que não
 * começa com "/" ou fora do formato (minúsculo, hífen, sem acento), endereço
 * repetido, rótulo vazio, coluna desconhecida, mais de
 * uma página de destaque, título ou descrição vazios, título fora do formato,
 * descrição fora do tamanho e título ou descrição repetidos deixam `npm test`
 * vermelho, nomeando a entrada.
 *
 * O título e a descrição viram os metadados da página (aba, buscador,
 * compartilhamento) pelo `montarMetadados`, em `metadados.ts`. A regra é a do
 * docs/PADROES-DE-CODIGO.md, seção 11.
 */
import lista from './paginas-publicas.json'

/** As colunas de destinos do rodapé, na ordem em que aparecem. */
export const COLUNAS_DO_RODAPE = ['Portal', 'Conteúdo'] as const

export type ColunaDoRodape = (typeof COLUNAS_DO_RODAPE)[number]

/** O nome da liga por extenso, que a Início usa no título (PADROES, 11.1). */
export const NOME_DA_LIGA = 'Liga Acadêmica Multiprofissional de Cuidados Paliativos'

/** O fim de todo título: "<Nome da página> · LIACUP". */
export const FIM_DO_TITULO = ' · LIACUP'

/**
 * O formato do endereço (PADROES, 11.1): a Início, "/", ou uma ou mais partes
 * de letras minúsculas, números e hífen, cada uma depois de uma "/". Recusa
 * maiúscula, sublinhado, acento, ponto, barra no fim e "//", que o navegador
 * lê como endereço de outro site ("//exemplo.com").
 */
export const FORMATO_DO_ENDERECO = /^\/$|^(\/[a-z0-9-]+)+$/

/** O tamanho da descrição, em caracteres (PADROES, 11.1). */
export const TAMANHO_DA_DESCRICAO = { minimo: 70, maximo: 160 } as const

export type PaginaPublica = {
  /** Endereço da página, começando com "/". Ex.: "/sobre". */
  readonly endereco: string
  /** Texto do link no menu e no rodapé. Ex.: "Sobre". */
  readonly rotulo: string
  /** Título da aba e do buscador. Ex.: "Sobre · LIACUP". */
  readonly titulo: string
  /** Resumo para o buscador: uma frase do conteudo-institucional.md, de 70 a 160 caracteres. */
  readonly descricao: string
  /** Aparece no menu do cabeçalho e no menu lateral do celular. */
  readonly noMenu: boolean
  /** Em qual coluna do rodapé o link aparece, ou `null` para nenhuma. */
  readonly colunaDoRodape: ColunaDoRodape | null
  /** É o botão de destaque do cabeçalho e do fim do menu lateral. No máximo uma. */
  readonly destaque: boolean
}

/** A entrada como vem do JSON, antes de conferida. */
type EntradaDaLista = {
  endereco: string
  rotulo: string
  titulo: string
  descricao: string
  noMenu: boolean
  colunaDoRodape: string | null
  destaque: boolean
}

/**
 * Diz o que está errado na lista, uma frase por problema. Lista vazia de
 * problemas quer dizer lista válida. Função pura, para o teste poder chamá-la.
 */
export function problemasDaLista(entradas: readonly EntradaDaLista[]): string[] {
  const problemas: string[] = []
  const vistos = new Set<string>()
  const donoDoTitulo = new Map<string, string>()
  const donoDaDescricao = new Map<string, string>()

  for (const entrada of entradas) {
    const nome = `"${entrada.endereco}"`
    if (!entrada.endereco.startsWith('/')) problemas.push(`endereço ${nome} não começa com "/"`)
    else if (!FORMATO_DO_ENDERECO.test(entrada.endereco)) {
      problemas.push(
        `endereço ${nome} fora do formato: só "/" ou partes de letras minúsculas, ` +
          'números e hífen, cada uma depois de uma "/", sem acento'
      )
    }
    if (vistos.has(entrada.endereco)) problemas.push(`endereço ${nome} repetido`)
    vistos.add(entrada.endereco)
    if (entrada.rotulo.trim() === '') problemas.push(`rótulo vazio no endereço ${nome}`)
    const coluna = entrada.colunaDoRodape
    if (coluna !== null && !(COLUNAS_DO_RODAPE as readonly string[]).includes(coluna)) {
      problemas.push(`coluna do rodapé "${coluna}" desconhecida no endereço ${nome}`)
    }
    problemas.push(...problemasDoTitulo(entrada, donoDoTitulo))
    problemas.push(...problemasDaDescricao(entrada, donoDaDescricao))
  }

  const destaques = entradas.filter((entrada) => entrada.destaque)
  if (destaques.length > 1) {
    const enderecos = destaques.map((entrada) => `"${entrada.endereco}"`).join(', ')
    problemas.push(`${destaques.length} páginas de destaque (${enderecos}); o máximo é uma`)
  }

  return problemas
}

/** O título que a entrada deve ter: o nome da liga na Início, o rótulo nas outras. */
export function tituloEsperado(entrada: Pick<EntradaDaLista, 'endereco' | 'rotulo'>): string {
  return `${entrada.endereco === '/' ? NOME_DA_LIGA : entrada.rotulo}${FIM_DO_TITULO}`
}

/** Título vazio, fora do formato ou repetido. `donos` guarda quem já usou cada um. */
function problemasDoTitulo(entrada: EntradaDaLista, donos: Map<string, string>): string[] {
  const nome = `"${entrada.endereco}"`
  const titulo = entrada.titulo.trim()
  if (titulo === '') return [`título vazio no endereço ${nome}`]
  const problemas: string[] = []
  const esperado = tituloEsperado(entrada)
  if (entrada.titulo !== esperado) {
    problemas.push(
      `título "${entrada.titulo}" no endereço ${nome} fora do formato; o esperado é "${esperado}"`
    )
  }
  const dono = donos.get(titulo)
  if (dono !== undefined) {
    problemas.push(`título "${entrada.titulo}" repetido nos endereços "${dono}" e ${nome}`)
  } else donos.set(titulo, entrada.endereco)
  return problemas
}

/**
 * Descrição vazia, fora do tamanho ou repetida. O tamanho conta caracteres, e
 * não bytes: "ã" é um caractere, mesmo ocupando dois bytes.
 */
function problemasDaDescricao(entrada: EntradaDaLista, donos: Map<string, string>): string[] {
  const nome = `"${entrada.endereco}"`
  const descricao = entrada.descricao.trim()
  if (descricao === '') return [`descrição vazia no endereço ${nome}`]
  const problemas: string[] = []
  const caracteres = contarCaracteres(entrada.descricao)
  const { minimo, maximo } = TAMANHO_DA_DESCRICAO
  if (caracteres < minimo || caracteres > maximo) {
    problemas.push(
      `descrição com ${caracteres} caracteres no endereço ${nome}; o tamanho é de ${minimo} a ${maximo}`
    )
  }
  const dono = donos.get(descricao)
  if (dono !== undefined) {
    problemas.push(`descrição repetida nos endereços "${dono}" e ${nome}`)
  } else donos.set(descricao, entrada.endereco)
  return problemas
}

/** Quantos caracteres o texto tem, e não quantos bytes nem unidades de UTF-16. */
export function contarCaracteres(texto: string): number {
  return Array.from(texto.normalize('NFC')).length
}

/** As entradas do JSON, na ordem do menu do protótipo. */
export const ENTRADAS_DA_LISTA: readonly EntradaDaLista[] = lista

/** A lista, congelada: quem lê não altera. */
export const PAGINAS_PUBLICAS: readonly PaginaPublica[] = Object.freeze(
  ENTRADAS_DA_LISTA.map((entrada) => Object.freeze({ ...entrada }) as PaginaPublica)
)

/** As páginas do menu do cabeçalho e do menu lateral. */
export function paginasDoMenu(): readonly PaginaPublica[] {
  return PAGINAS_PUBLICAS.filter((pagina) => pagina.noMenu)
}

/** As páginas de uma coluna do rodapé. Coluna sem página não aparece. */
export function paginasDaColuna(coluna: ColunaDoRodape): readonly PaginaPublica[] {
  return PAGINAS_PUBLICAS.filter((pagina) => pagina.colunaDoRodape === coluna)
}

/** A página do botão de destaque, ou `undefined` se nenhuma estiver marcada. */
export function paginaDeDestaque(): PaginaPublica | undefined {
  return PAGINAS_PUBLICAS.find((pagina) => pagina.destaque)
}

/** Diz se o endereço está na lista. Comparação exata: "/sobre-x" não é "/sobre". */
export function estaNaLista(endereco: string): boolean {
  return PAGINAS_PUBLICAS.some((pagina) => pagina.endereco === endereco)
}
