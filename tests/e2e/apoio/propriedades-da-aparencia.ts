/*
 * A lista de propriedades comparadas entre `Botao` e `LinkComAparenciaDeBotao`
 * — DERIVADA do CSS da origem única, nunca digitada.
 *
 * POR QUE NÃO UMA LISTA ESCRITA À MÃO
 *
 * Se a lista fosse digitada, **a lista seria a cobertura**. Uma propriedade que
 * ninguém lembrou de listar poderia divergir para sempre em silêncio, com o
 * teste verde tendo comparado corretamente um conjunto incompleto. É a vitrine
 * da F01 de novo: cada verificação media certo uma página que não mostrava
 * tudo.
 *
 * Derivando do `AparenciaDeBotao.module.css`, acrescentar uma propriedade à
 * origem única estende a comparação sozinho — o mesmo formato do FR-044, um
 * nível abaixo.
 *
 * POR QUE NÃO COMPARAR TUDO O QUE O NAVEGADOR CALCULA
 *
 * Porque `<button>` e `<a>` têm padrões de agente de usuário diferentes:
 * `cursor`, `text-decoration`, `appearance` e alinhamento divergem por motivos
 * que não têm nada a ver com a aparência compartilhada. Comparar tudo obrigaria
 * a manter uma lista de exclusões — que é a primeira armadilha pelo avesso, uma
 * lista à mão decidindo o que **não** conta.
 *
 * Por isso "idêntica" significa, com precisão: **idêntica nas propriedades que a
 * origem compartilhada declara**. O que o CSS comum não declara, o componente
 * não promete.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/*
 * A raiz vem de `process.cwd()`, e nao de `import.meta.url`: o Playwright
 * transpila estes arquivos para CommonJS, onde `import.meta` nao existe. O
 * `playwright.config.ts` roda a partir da raiz do repositorio, entao o caminho
 * abaixo resolve. Se um dia deixar de resolver, a funcao falha alto em vez de
 * devolver lista vazia — ver o `throw` mais adiante.
 */
const CSS_DA_APARENCIA = resolve(process.cwd(), 'src/componentes/ui/AparenciaDeBotao.module.css')

/*
 * Propriedades que existem no CSS mas não descrevem a aparência em repouso, e
 * cuja comparação diria algo diferente do que se quer saber.
 *
 * A lista é curta de propósito e cada linha diz por quê. Ela NÃO é lista de
 * exclusão de divergências: é a fronteira entre "aparência" e "mecanismo de
 * layout do próprio contêiner".
 */
const NAO_DESCREVEM_APARENCIA = new Set([
  'transition', // o estado final é comparado; o caminho até ele, não
  'content', // pseudo-elemento não tem estilo calculado no elemento
])

/** Expande atalhos para as longhands que o navegador realmente calcula. */
const EXPANSOES: Record<string, string[]> = {
  padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  border: ['border-top-width', 'border-top-style', 'border-top-color'],
  'border-width': ['border-top-width', 'border-right-width'],
  'border-radius': ['border-top-left-radius', 'border-bottom-right-radius'],
  font: ['font-family', 'font-size', 'font-weight'],
  gap: ['row-gap', 'column-gap'],
}

/**
 * Lê o CSS da origem única e devolve as propriedades declaradas nele.
 *
 * Falha alto se o arquivo não existir ou não declarar nada: uma lista vazia
 * faria o teste comparar zero propriedades e passar — que é o verde que não
 * mediu nada (RP-12).
 */
export function propriedadesDeclaradasNaAparencia(): string[] {
  let css: string
  try {
    css = readFileSync(CSS_DA_APARENCIA, 'utf8')
  } catch {
    throw new Error(
      `Nao foi possivel ler ${CSS_DA_APARENCIA}. ` +
        'A comparacao de aparencia deriva a lista dele; sem o arquivo ela compararia nada.'
    )
  }

  const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const declaradas = new Set<string>()

  // Grupo NOMEADO de propósito. A primeira versão usava grupos posicionais e
  // desestruturava o grupo errado — ver PISO_DE_SANIDADE abaixo.
  for (const encontrado of semComentarios.matchAll(/(?:^|[;{])\s*(?<propriedade>[a-z-]+)\s*:/g)) {
    const propriedade = encontrado.groups?.propriedade
    if (!propriedade || propriedade.startsWith('--')) continue
    if (NAO_DESCREVEM_APARENCIA.has(propriedade)) continue
    for (const nome of EXPANSOES[propriedade] ?? [propriedade]) declaradas.add(nome)
  }

  const lista = [...declaradas].sort()

  /*
   * PISO DE SANIDADE — e a razao de ele existir e um defeito real, cometido
   * aqui em 27/08/2026.
   *
   * A primeira versao desta funcao desestruturava o grupo 1 do regex em vez do
   * 2, e o grupo 1 era `(^|[;{])`. O conjunto derivado ficou com DOIS itens:
   * `'{'` e `';'`. O teste da vitrine entao comparou
   * `getComputedStyle(...).getPropertyValue('{')` nos dois elementos, que
   * devolve string vazia em ambos — logo sempre coincidia. Saida:
   *
   *     Pares visuais: 6/6 · propriedades comparadas por par: 2 · pares divergentes: 0
   *
   * Seis de seis pares, zero divergencias, e comparando duas coisas que nao
   * existem. Quem pegou foi o CONTADOR, nao a asserção: sem ele, "0 divergentes"
   * e "comparei nada" tem exatamente a mesma cara.
   *
   * O piso nao e uma lista de propriedades — seria a lista digitada que esta
   * funcao existe para evitar. E um numero minimo: a origem unica declara
   * dezenas de propriedades, e derivar menos de uma duzia significa que o
   * PARSER quebrou, nao que o CSS encolheu.
   */
  const PISO_DE_SANIDADE = 12
  if (lista.length < PISO_DE_SANIDADE) {
    throw new Error(
      `${CSS_DA_APARENCIA}: derivadas apenas ${lista.length} propriedades ` +
        `(${lista.join(', ')}), abaixo do piso de ${PISO_DE_SANIDADE}. ` +
        'A origem unica declara muito mais que isso: numero baixo aqui significa ' +
        'que a leitura do CSS quebrou, e a comparacao passaria sem medir nada.'
    )
  }
  return lista
}
