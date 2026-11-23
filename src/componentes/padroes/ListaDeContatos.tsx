/*
 * A lista dos quadros de contato, um abaixo do outro, na ordem em que vierem.
 *
 * Quem usa escolhe os quadros, por composição:
 *   - a página Contato: Instagram, E-mail e Onde estamos;
 *   - a inicial (change inicio-completo): Instagram e E-mail.
 *
 *   <ListaDeContatos>
 *     <QuadroDoInstagram />
 *     <QuadroDoEmail />
 *   </ListaDeContatos>
 *
 * Cada quadro vira um item da lista, e o leitor de tela anuncia quantos são.
 * A lista não sabe em que coluna está nem quantas colunas a página tem: a
 * grade é de quem a usa (design.md da change pagina-contato, D1 e D4).
 */
import { Children, type ReactNode } from 'react'
import estilos from './ListaDeContatos.module.css'

type PropsDaListaDeContatos = {
  /** Os quadros, na ordem de leitura. */
  children: ReactNode
}

export function ListaDeContatos({ children }: PropsDaListaDeContatos) {
  return (
    /* Papel de lista explícito: o Safari tira o papel de toda lista sem
       marcador, e o VoiceOver deixa de dizer quantos itens há (design.md da
       change pagina-sobre-e-equipe, D7). */
    // eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima
    <ul role="list" className={estilos.lista}>
      {Children.toArray(children).map((quadro, indice) => (
        <li key={indice}>{quadro}</li>
      ))}
    </ul>
  )
}
