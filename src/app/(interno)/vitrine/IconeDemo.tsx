import { Icone } from '@/componentes/ui/Icone'
import { Amostra, Secao } from './Secao'

export function IconeDemo() {
  return (
    <Secao titulo="Ícone" descricao="Sempre decorativo, sempre acompanhado de texto.">
      <Amostra rotulo="As duas variantes">
        <Icone nome="instagram" />
        <Icone nome="email" />
      </Amostra>
    </Secao>
  )
}
