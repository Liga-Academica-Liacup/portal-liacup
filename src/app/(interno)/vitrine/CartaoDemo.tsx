import { Cartao } from '@/componentes/ui/Cartao'
import { Etiqueta } from '@/componentes/ui/Etiqueta'
import { Amostra, Secao } from './Secao'

export function CartaoDemo() {
  return (
    <Secao titulo="Cartão" descricao="Composição por partes nomeadas, todas opcionais.">
      <Amostra rotulo="Completo">
        <Cartao>
          <Cartao.Kicker>Notícia</Cartao.Kicker>
          <Cartao.Titulo>Jornada do Julho Verde</Cartao.Titulo>
          <Cartao.Corpo>Um resumo curto do que aconteceu no evento.</Cartao.Corpo>
          <Cartao.Meta>
            20/08/2026 <Etiqueta variante="destaque">Extensão</Etiqueta>
          </Cartao.Meta>
        </Cartao>
      </Amostra>

      <Amostra rotulo="Sem título">
        <Cartao>
          <Cartao.Kicker>Aviso</Cartao.Kicker>
          <Cartao.Corpo>Cartão sem título continua com espaçamento correto.</Cartao.Corpo>
        </Cartao>
      </Amostra>

      <Amostra rotulo="Sem corpo">
        <Cartao>
          <Cartao.Titulo>Somente o título</Cartao.Titulo>
          <Cartao.Meta>20/08/2026</Cartao.Meta>
        </Cartao>
      </Amostra>

      <Amostra rotulo="Só metadados">
        <Cartao>
          <Cartao.Meta>Somente metadados</Cartao.Meta>
        </Cartao>
      </Amostra>

      <Amostra rotulo="Elevações: nenhuma, sm, md, lg">
        <Cartao>
          <Cartao.Corpo>nenhuma</Cartao.Corpo>
        </Cartao>
        <Cartao elevacao="sm">
          <Cartao.Corpo>sm</Cartao.Corpo>
        </Cartao>
        <Cartao elevacao="md">
          <Cartao.Corpo>md</Cartao.Corpo>
        </Cartao>
        <Cartao elevacao="lg">
          <Cartao.Corpo>lg</Cartao.Corpo>
        </Cartao>
      </Amostra>
    </Secao>
  )
}
