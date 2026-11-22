/*
 * "O que a Liga se propõe a fazer": as seções 2.3 a 2.6 do documento,
 * inteiras, em quatro linhas numeradas de 01 a 04 (Q3 (a) do Gabriel,
 * 22/11/2026). Cada linha tem o título da seção do documento em <h3> e os
 * parágrafos dela.
 *
 * É uma lista ordenada: o leitor de tela já anuncia a posição de cada item.
 * Por isso o número desenhado é decorativo e não é lido (design.md da change,
 * D4). No desktop, o título do bloco fica numa coluna à esquerda; no celular,
 * acima das linhas, como no protótipo.
 *
 * Carregando, erro e vazio: o vazio é impossível hoje, porque o dado é
 * estático e o teste de unidade do conteúdo exige os quatro itens. Os três
 * estados chegam na R3, com o banco (design.md da change, D8).
 */
import { TituloDeSecao, type TextoDoTituloDeSecao } from '@/componentes/padroes/TituloDeSecao'
import type { ItemDosObjetivos } from '../tipos'
import estilos from './ObjetivosDaLiga.module.css'

type PropsDosObjetivosDaLiga = {
  titulo: TextoDoTituloDeSecao
  itens: readonly ItemDosObjetivos[]
}

/** "01", "02"... como no protótipo. */
function numeroDoItem(indice: number): string {
  return String(indice + 1).padStart(2, '0')
}

export function ObjetivosDaLiga({ titulo, itens }: PropsDosObjetivosDaLiga) {
  if (itens.length === 0) return null

  return (
    <section className={estilos.secao} aria-labelledby="titulo-dos-objetivos">
      <div className={estilos.grade}>
        <div>
          <TituloDeSecao
            titulo={titulo}
            id="titulo-dos-objetivos"
            tamanho="grande"
            espacoAbaixo="nenhum"
          />
        </div>
        {/* Papel de lista explícito: o Safari tira o papel de toda lista sem marcador
            (design.md da change, D7). */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima */}
        <ol role="list" className={estilos.lista}>
          {itens.map((item, indice) => (
            <li key={item.nome} className={estilos.item}>
              <span className={estilos.numero} aria-hidden="true">
                {numeroDoItem(indice)}
              </span>
              <div>
                <h3 className={estilos.nome}>{item.nome}</h3>
                {item.paragrafos.map((paragrafo) => (
                  <p key={paragrafo} className={estilos.paragrafo}>
                    {paragrafo}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
