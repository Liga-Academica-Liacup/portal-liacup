/*
 * GARANTIA DE TIPO GERADO — este arquivo existe para FALHAR.
 *
 * NAO E CODIGO DE PRODUTO. Nada o importa, e e assim de proposito. Se voce
 * chegou aqui "limpando codigo morto", leia antes de apagar: apagar este
 * arquivo nao quebra nada hoje, e e exatamente esse o problema que ele resolve.
 *
 * O QUE ELE GUARDA
 *
 * O `next-env.d.ts` deixou de ser versionado (RP-13). Quem o regera e
 * `next typegen`, encadeado dentro de `verificar:tipos`:
 *
 *     "verificar:tipos": "next typegen && tsc --noEmit"
 *
 * Esse `next typegen &&` e uma garantia de UMA LINHA, e garantia de uma linha
 * evapora. Apague-a e, num clone limpo, o `next-env.d.ts` nao existe: some com
 * ele o `declare module '*.png'` que o Next declara em
 * `next/image-types/global`. Sem este arquivo, TUDO CONTINUARIA VERDE — a
 * cadeia inteira, o verificar:artefatos, os 71 testes — porque hoje nao ha uma
 * unica linha no repositorio que importe uma imagem estaticamente.
 *
 * A demonstracao de FALHA foi feita quando o arquivo saiu do controle de
 * versao (evidencia E38): arquivo temporario com import de .png, `TS2307` e
 * codigo 2 sem o `next-env.d.ts`, codigo 0 com ele. Mas ela foi feita com um
 * arquivo temporario, que foi apagado — provou que o modo de falha EXISTE e
 * nao deixou nada provando que o conserto CONTINUA valendo.
 *
 * E a licao que a F02 escreveu uma feature atras, na mesma forma: teste de
 * recusa nao distingue "corretamente bloqueado" de "quebrado fechado". So o
 * teste de permissao separa os dois. A recusa foi demonstrada e descartada; a
 * permissao e este arquivo.
 *
 * POR QUE IMPORTACAO SO DE TIPO
 *
 * `import type` e apagada na compilacao: nao vira `require`, nao entra em
 * pacote, e nenhum executor de teste precisa saber carregar um `.png`. O que
 * sobra e exatamente o que se quer verificar — que a DECLARACAO existe —, sem
 * arrastar junto um segundo motivo de falhar, que seria o primeiro candidato a
 * ser desligado quando incomodasse.
 *
 * COMO VER ELE FALHAR
 *
 *     mv next-env.d.ts /tmp/ && npx tsc --noEmit    # vermelho, aponta ESTA linha
 *     mv /tmp/next-env.d.ts . && npx tsc --noEmit   # verde
 *
 * LIMITE CONHECIDO, para ninguem confiar demais
 *
 * Numa maquina onde ja se rodou `next dev` ou `next build`, o `next-env.d.ts`
 * existe em disco mesmo sem o `next typegen`. Entao tirar o `next typegen &&`
 * pode continuar verde LOCALMENTE e ficar vermelho no CI, que roda em clone
 * limpo. O CI e o portao, e e la que a garantia morde. Nao e a mesma coisa que
 * morder nos dois lugares, e por isso esta escrito aqui em vez de omitido.
 *
 * O TypeScript tambem nao confere se o arquivo `.png` existe: a declaracao e
 * um curinga (`*.png`). Este arquivo guarda a DECLARACAO, nao a imagem.
 */
import type imagemImportadaEstaticamente from '../public/logo-liacup-256.png'

/** O que o Next promete devolver quando uma imagem e importada estaticamente. */
type ImagemEstatica = typeof imagemImportadaEstaticamente

/*
 * Segunda metade da garantia: nao basta a declaracao existir, ela precisa
 * continuar tendo o formato que quem usa espera. Se um dia o `StaticImageData`
 * mudar de forma, isto vira `never` e a atribuicao abaixo nao compila — com
 * mensagem apontando para ca, e nao para a primeira tela que usar imagem.
 */
type TemOFormatoQueONextPromete = ImagemEstatica extends {
  src: string
  width: number
  height: number
}
  ? true
  : never

export const tiposGeradosDoNextEstaoPresentes: TemOFormatoQueONextPromete = true
