/*
 * Os números da liga, logo abaixo do hero e no mesmo fundo dele, cada um num
 * cartão com o rótulo embaixo, como no protótipo aprovado (design.md da change
 * inicio-completo, D3). Sem título de seção: o protótipo não tem.
 *
 * Os números chegam por props, e quem os lê de `conteudo.ts` é a rota da
 * inicial. O componente não guarda texto.
 *
 * A seção é própria, e não um pedaço do hero: o hero não muda. O vão entre os
 * botões do hero e os cartões é o fim do hero (--espaco-secao), como a margem
 * de cima da grade no protótipo.
 *
 * Carregando, erro e vazio: o vazio é impossível hoje, porque o dado é
 * estático e o teste de unidade exige os quatro números; sem nenhum, a seção
 * não aparece nem guarda espaço. Carregando e erro chegam com o painel da R3,
 * quando os números vierem do banco.
 */
import type { NumerosDaLiga as ListaDeNumeros } from '../tipos'
import estilos from './NumerosDaLiga.module.css'

type PropsDosNumerosDaLiga = {
  numeros: ListaDeNumeros
}

export function NumerosDaLiga({ numeros }: PropsDosNumerosDaLiga) {
  if (numeros.length === 0) return null

  return (
    <section className={estilos.secao}>
      {/* Papel de lista explícito: o Safari tira o papel de toda lista sem marcador
          (design.md da change pagina-sobre-e-equipe, D7). Sem nome acessível:
          nenhum texto fora do documento e da seção 7, nem em aria-label. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima */}
      <ul role="list" className={estilos.grade}>
        {numeros.map((numero) => (
          <li key={numero.rotulo} className={estilos.cartao}>
            {/* O espaço não aparece (cada um é uma linha), mas separa o número
                do rótulo no que o leitor de tela anuncia: "21 membros ativos". */}
            <span className={estilos.valor}>{numero.valor}</span>{' '}
            <span className={estilos.rotulo}>{numero.rotulo}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
