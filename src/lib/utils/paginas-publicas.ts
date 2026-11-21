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
 * começa com "/", endereço repetido, rótulo vazio, coluna desconhecida ou mais
 * de uma página de destaque deixam `npm test` vermelho, nomeando a entrada.
 */
import lista from './paginas-publicas.json'

/** As colunas de destinos do rodapé, na ordem em que aparecem. */
export const COLUNAS_DO_RODAPE = ['Portal', 'Conteúdo'] as const

export type ColunaDoRodape = (typeof COLUNAS_DO_RODAPE)[number]

export type PaginaPublica = {
  /** Endereço da página, começando com "/". Ex.: "/sobre". */
  readonly endereco: string
  /** Texto do link no menu e no rodapé. Ex.: "Sobre". */
  readonly rotulo: string
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

  for (const entrada of entradas) {
    const nome = `"${entrada.endereco}"`
    if (!entrada.endereco.startsWith('/')) problemas.push(`endereço ${nome} não começa com "/"`)
    if (vistos.has(entrada.endereco)) problemas.push(`endereço ${nome} repetido`)
    vistos.add(entrada.endereco)
    if (entrada.rotulo.trim() === '') problemas.push(`rótulo vazio no endereço ${nome}`)
    const coluna = entrada.colunaDoRodape
    if (coluna !== null && !(COLUNAS_DO_RODAPE as readonly string[]).includes(coluna)) {
      problemas.push(`coluna do rodapé "${coluna}" desconhecida no endereço ${nome}`)
    }
  }

  const destaques = entradas.filter((entrada) => entrada.destaque)
  if (destaques.length > 1) {
    const enderecos = destaques.map((entrada) => `"${entrada.endereco}"`).join(', ')
    problemas.push(`${destaques.length} páginas de destaque (${enderecos}); o máximo é uma`)
  }

  return problemas
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
