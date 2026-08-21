/*
 * MOLDE. Este arquivo e o modelo que as features seguintes copiam, entao ele
 * precisa estar completo — exemplar incompleto propaga a falha.
 *
 * A secao 2.6 dos padroes e o Principio IX da constitution exigem que todo
 * componente que mostra dado trate os TRES estados: carregando, erro e vazio.
 * Os tres estao aqui, reaproveitando o EstadoVazio da camada de padroes.
 *
 * Repare tambem que este componente NAO busca dado: ele recebe por props. Quem
 * busca e a rota que o compoe. Componente que busca e desenha sao dois
 * componentes (secao 2.2).
 */
import { EstadoVazio } from '@/componentes/padroes/EstadoVazio'
import type { Exemplo } from '../tipos'

type PropsDaLista = {
  itens: readonly Exemplo[]
  estaCarregando?: boolean
  temErro?: boolean
}

export function ListaDeExemplos({ itens, estaCarregando = false, temErro = false }: PropsDaLista) {
  if (estaCarregando) {
    return <EstadoVazio titulo="Carregando..." descricao="Buscando os itens." />
  }

  if (temErro) {
    return (
      <EstadoVazio
        tom="alerta"
        titulo="Não foi possível carregar"
        descricao="Tente novamente em alguns instantes."
      />
    )
  }

  if (itens.length === 0) {
    return (
      <EstadoVazio
        titulo="Nada publicado ainda"
        descricao="Quando houver conteúdo, ele aparece aqui."
      />
    )
  }

  return (
    <ul>
      {itens.map((item) => (
        <li key={item.id}>{item.titulo}</li>
      ))}
    </ul>
  )
}
