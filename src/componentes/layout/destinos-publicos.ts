/*
 * O QUE É
 * O catálogo canônico dos destinos do site público — **uma lista, e só uma**.
 *
 * POR QUE ELE EXISTE SEPARADO DA NAVEGAÇÃO
 * O FR-044 exige que o conjunto de páginas verificadas seja derivado da mesma
 * lista que a navegação desenha. Três consumidores leem este arquivo:
 *
 *   1. `NavegacaoPublica`, que desenha os links;
 *   2. `tests/e2e/paginas-publicas.spec.ts`, que percorre 10 páginas × 7 larguras;
 *   3. `lighthouserc.cjs`, que deriva as dez URLs medidas.
 *
 * Nenhum deles mantém cópia. Acrescentar um destino aqui faz os três reagirem —
 * e se a rota não existir, os dois verificadores ficam vermelhos nomeando o
 * caminho (SC-017). Duas listas mantidas em paralelo divergem, e a divergência
 * seria silenciosa e verde: página fora da verificação não faz nada falhar.
 *
 * O DADO MORA NO JSON, NÃO AQUI
 * Porque o `lighthouserc.cjs` e o `scripts/verificar-paginas-lighthouse.mjs`
 * rodam fora do TypeScript e precisam ler a mesma fonte. JSON é o único formato
 * que os três alcançam sem etapa de compilação.
 *
 * A VALIDAÇÃO É EXPLÍCITA E FALHA ALTO
 * Um catálogo silenciosamente errado — caminho duplicado, duas conversões
 * principais — produziria navegação errada e verificação verde. Aqui ele
 * derruba o carregamento do módulo com a mensagem dizendo qual invariante
 * quebrou. Invariantes em `specs/004-layout-base/data-model.md`, seção 1.
 */
import catalogo from './destinos-publicos.json'

export type DestinoPublico = {
  /** Texto aprovado da navegação. Único entre os dez. */
  readonly rotulo: string
  /** Rota pública exata. Única, começa com `/`, sem barra final salvo a raiz. */
  readonly caminho: string
  /** Exatamente um destino do catálogo é a conversão principal. */
  readonly ehConversaoPrincipal: boolean
}

const QUANTIDADE_ESPERADA = 10

function recusar(motivo: string): never {
  throw new Error(
    `Catálogo de destinos públicos inválido: ${motivo}. ` +
      `Corrija src/componentes/layout/destinos-publicos.json — ele é a fonte única de FR-044.`
  )
}

function validar(itens: readonly DestinoPublico[]): readonly DestinoPublico[] {
  if (itens.length !== QUANTIDADE_ESPERADA) {
    recusar(`esperados ${QUANTIDADE_ESPERADA} destinos, encontrados ${itens.length}`)
  }

  const rotulos = new Set<string>()
  const caminhos = new Set<string>()

  for (const item of itens) {
    if (item.rotulo.trim() === '') recusar(`rótulo vazio no caminho "${item.caminho}"`)
    if (!item.caminho.startsWith('/')) recusar(`caminho "${item.caminho}" não começa com "/"`)
    if (item.caminho !== '/' && item.caminho.endsWith('/')) {
      recusar(`caminho "${item.caminho}" termina com "/"`)
    }
    if (rotulos.has(item.rotulo)) recusar(`rótulo repetido "${item.rotulo}"`)
    if (caminhos.has(item.caminho)) recusar(`caminho repetido "${item.caminho}"`)
    rotulos.add(item.rotulo)
    caminhos.add(item.caminho)
  }

  const conversoes = itens.filter((item) => item.ehConversaoPrincipal)
  if (conversoes.length !== 1) {
    recusar(`esperada 1 conversão principal, encontradas ${conversoes.length}`)
  }

  return itens
}

/** Os dez destinos, congelados. Consumidor não altera a fonte única. */
export const DESTINOS_PUBLICOS: readonly DestinoPublico[] = Object.freeze(
  validar((catalogo as DestinoPublico[]).map((item) => Object.freeze({ ...item })))
)

/** O destino que o cabeçalho mantém visível fora do painel no mobile (FR-005). */
export const conversaoPrincipal: DestinoPublico =
  DESTINOS_PUBLICOS.find((destino) => destino.ehConversaoPrincipal) ??
  recusar('nenhuma conversão principal depois da validação')

/** Os nove destinos que ficam no painel lateral no mobile (FR-006). */
export const destinosSecundarios: readonly DestinoPublico[] = Object.freeze(
  DESTINOS_PUBLICOS.filter((destino) => !destino.ehConversaoPrincipal)
)

/** Só os caminhos, na ordem do catálogo. É o que as verificações percorrem. */
export const caminhosPublicos: readonly string[] = Object.freeze(
  DESTINOS_PUBLICOS.map((destino) => destino.caminho)
)

/**
 * Compara por igualdade exata. Prefixo parecido não autoriza "chutar" a página
 * atual: `/noticias-antigas` não marca `/noticias` (data-model, seção 2).
 */
export function destinoDoCaminho(caminho: string): DestinoPublico | undefined {
  return DESTINOS_PUBLICOS.find((destino) => destino.caminho === caminho)
}
