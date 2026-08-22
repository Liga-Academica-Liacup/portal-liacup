import { EstadoVazio } from '@/componentes/padroes/EstadoVazio'
import { Amostra, Secao } from './Secao'

export function EstadoVazioDemo() {
  return (
    <Secao titulo="Estado vazio" descricao="Os três estados que todo componente de dado trata.">
      <Amostra rotulo="Carregando">
        <EstadoVazio titulo="Carregando..." descricao="Buscando os itens." />
      </Amostra>
      <Amostra rotulo="Vazio — tom status">
        <EstadoVazio
          titulo="Nada publicado ainda"
          descricao="Quando houver conteúdo, ele aparece aqui."
        />
      </Amostra>
      <Amostra rotulo="Erro — tom alerta">
        <EstadoVazio
          tom="alerta"
          titulo="Não foi possível carregar"
          descricao="Tente novamente em alguns instantes."
        />
      </Amostra>
    </Secao>
  )
}
