/*
 * Os SEIS PARES botão/link, lado a lado — a evidência viva do SC-018.
 *
 * 3 variantes compartilhadas × 2 larguras = 6 pares. A variante `icone` e o
 * estado `disabled` não aparecem aqui porque não existem no link: seriam API sem
 * consumidor real, que é o que a F01 recusou.
 *
 * POR QUE LADO A LADO, E NÃO EM SEÇÕES SEPARADAS
 * Foi na vitrine da F01 que os quatro defeitos de contraste apareceram, porque
 * foi a primeira vez que todas as combinações estiveram juntas na mesma tela.
 * Aqui vale o mesmo: uma divergência de aparência entre um `<button>` e um `<a>`
 * é invisível quando os dois estão em páginas diferentes, e salta quando estão
 * encostados.
 *
 * O `data-par-visual` vai no CONTÊINER, não nos controles. `Botao` e
 * `LinkComAparenciaDeBotao` recusam pelo tipo o que não está no contrato —
 * `data-*` inclusive —, e essa recusa é parte do que faz a origem única de
 * aparência valer. O teste se adapta ao componente; afrouxar o componente para o
 * teste conseguir medir seria medir outra coisa.
 */
import { Botao } from '@/componentes/ui/Botao'
import { LinkComAparenciaDeBotao } from '@/componentes/ui/LinkComAparenciaDeBotao'
import type { VarianteCompartilhada } from '@/componentes/ui/aparencia-de-botao'
import { Amostra, Secao } from './Secao'
import estilos from './page.module.css'

const VARIANTES: readonly VarianteCompartilhada[] = ['primario', 'secundario', 'fantasma']

function Par({
  variante,
  larguraTotal,
}: {
  variante: VarianteCompartilhada
  larguraTotal: boolean
}) {
  const chave = `${variante}-${larguraTotal ? 'largura-total' : 'normal'}`
  return (
    <div className={estilos.par} data-par-visual={chave}>
      <Botao variante={variante} larguraTotal={larguraTotal}>
        Botão
      </Botao>
      <LinkComAparenciaDeBotao
        href="/processo-seletivo"
        variante={variante}
        larguraTotal={larguraTotal}
      >
        Link
      </LinkComAparenciaDeBotao>
    </div>
  )
}

export function ParesVisuaisDemo() {
  return (
    <Secao
      titulo="Botão e link com a mesma aparência"
      descricao="Seis pares: três variantes compartilhadas em duas larguras. Os dois consomem AparenciaDeBotao.module.css, e o Botao.module.css foi apagado — não existe segunda fonte de verdade para consertar por engano. O teste de ponta a ponta compara as propriedades calculadas, e a lista comparada é derivada daquele CSS."
    >
      {VARIANTES.map((variante) => (
        <Amostra key={variante} rotulo={`${variante} — largura normal`}>
          <Par variante={variante} larguraTotal={false} />
        </Amostra>
      ))}

      {VARIANTES.map((variante) => (
        <Amostra key={`${variante}-total`} rotulo={`${variante} — largura total`}>
          <Par variante={variante} larguraTotal />
        </Amostra>
      ))}
    </Secao>
  )
}
