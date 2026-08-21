import { Separador } from '@/componentes/ui/Separador'
import { Amostra, Secao } from './Secao'
import estilos from './page.module.css'

export function SeparadorDemo() {
  return (
    <Secao titulo="Separador" descricao="Decorativo por padrão; semântico quando divide assunto.">
      <Amostra rotulo="Decorativo — não anunciado">
        <div className={estilos.blocoLargo}>
          <Separador />
        </div>
      </Amostra>
      <Amostra rotulo="Semântico — anunciado">
        <div className={estilos.blocoLargo}>
          <Separador decorativo={false} />
        </div>
      </Amostra>
    </Secao>
  )
}
