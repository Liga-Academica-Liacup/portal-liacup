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
 * A VALIDAÇÃO É EXPLÍCITA E FALHA ALTO — E SÓ VALIDA PROPRIEDADES
 * Um catálogo silenciosamente errado — caminho duplicado, duas conversões
 * principais, caminho malformado — produziria navegação errada e verificação
 * verde. Aqui ele derruba o carregamento do módulo dizendo qual invariante
 * quebrou.
 *
 * O TAMANHO NÃO É VALIDADO AQUI, e isso foi decidido em 28/08/2026.
 * Havia uma guarda numérica fixa em 10 nesta função, e ela **derrubava o build**
 * assim que um destino era acrescentado ao JSON — antes de qualquer verificador
 * rodar. Isso impedia exatamente a demonstração que o SC-017 exige com estas
 * palavras: *"acrescentar um destino sem tocar em mais nada deixa a verificação
 * vermelha, nomeando a página que ficou de fora"*.
 *
 * A hierarquia da constitution resolve: o `data-model.md` é plano (nível 5), o
 * FR-044 e o SC-017 são spec (nível 4), e o número menor vence. Não é a spec
 * cedendo ao plano; é o plano voltando para dentro dela.
 *
 * As outras cinco checagens ficam, porque são **propriedades do objeto**:
 * rótulo não vazio, caminho absoluto, sem barra final, sem repetição, uma
 * conversão principal. O tamanho era a contagem de hoje congelada — a única
 * linha que não descrevia uma propriedade, e a única que atrapalhava.
 *
 * QUEM COBRA O CONJUNTO FECHADO agora: `destinos-publicos.test.ts`, onde a lista
 * dos dez pares é o **contrato declarado** — lugar certo para lista digitada,
 * porque ali o teste existe justamente para dizer que o catálogo é *este*. E,
 * do outro lado, o `paginas-publicas.spec.ts`, que nomeia o caminho sem rota.
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

function recusar(motivo: string): never {
  throw new Error(
    `Catálogo de destinos públicos inválido: ${motivo}. ` +
      `Corrija src/componentes/layout/destinos-publicos.json — ele é a fonte única de FR-044.`
  )
}

function validar(itens: readonly DestinoPublico[]): readonly DestinoPublico[] {
  /*
   * A única checagem de contagem que é propriedade, e não a contagem de hoje:
   * catálogo vazio não é catálogo. Sem ela, um JSON esvaziado por acidente
   * deixaria a navegação sem nenhum link e todas as verificações medindo zero
   * páginas — que é o verde que não mediu nada.
   */
  if (itens.length === 0) recusar('catálogo vazio')

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
