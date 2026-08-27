import { Icone } from '@/componentes/ui/Icone'
import { Amostra, Secao } from './Secao'

/*
 * Os QUATRO ícones da união fechada.
 *
 * `instagram` e `email` vêm da F00, com os links de contato. `abrir` e `fechar`
 * entraram na F03, e a extensão da união foi **pré-autorizada** pela spec
 * (FR-029) — é a única permitida na feature. Qualquer quinto nome é desvio a
 * reportar, e o teste cobra o número exato justamente por isso.
 */
export function IconeDemo() {
  return (
    <Secao
      titulo="Ícone"
      descricao="Sempre decorativo, sempre acompanhado de texto. Quatro nomes na união fechada: nome fora dela não compila."
    >
      <Amostra rotulo="Contato — vieram da F00">
        <Icone nome="instagram" />
        <Icone nome="email" />
      </Amostra>

      <Amostra rotulo="Painel lateral — acrescentados na F03, pré-autorizados pelo FR-029">
        <Icone nome="abrir" />
        <Icone nome="fechar" />
      </Amostra>
    </Secao>
  )
}
