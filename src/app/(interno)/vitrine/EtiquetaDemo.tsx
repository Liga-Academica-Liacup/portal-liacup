import { Etiqueta } from '@/componentes/ui/Etiqueta'
import { Amostra, Secao } from './Secao'

const TEXTO_LONGO = 'Cuidados paliativos na atenção primária à saúde da pessoa idosa'

export function EtiquetaDemo() {
  return (
    <Secao titulo="Etiqueta" descricao="Classifica. Não é interativa.">
      <Amostra rotulo="Variantes">
        <Etiqueta variante="destaque">Destaque</Etiqueta>
        <Etiqueta variante="apoio">Apoio</Etiqueta>
        <Etiqueta variante="neutra">Neutra</Etiqueta>
        <Etiqueta variante="contorno">Contorno</Etiqueta>
      </Amostra>

      <Amostra rotulo="Texto longo — quebra linha em vez de empurrar a página">
        <Etiqueta variante="neutra">{TEXTO_LONGO}</Etiqueta>
      </Amostra>
    </Secao>
  )
}
