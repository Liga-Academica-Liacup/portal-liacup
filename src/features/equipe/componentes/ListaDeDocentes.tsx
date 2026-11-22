/*
 * Os cartões dos docentes orientadores, na ordem da seção 4.1 do documento:
 * o círculo com as iniciais, o nome em <h3>, o cargo e a formação. As
 * páginas Sobre e Equipe mostram os mesmos cartões, com o mesmo dado (Q5 (a)
 * do Gabriel, 22/11/2026); muda só a cor do cartão, como no protótipo.
 *
 * Quem dá o título do bloco é a rota, porque cada página tem o seu
 * ("Professores orientadores" no Sobre, "Docentes orientadores" na Equipe).
 *
 * Carregando, erro e vazio: o vazio é impossível hoje, porque o dado é
 * estático e o teste de unidade do conteúdo exige os dois docentes. Os três
 * estados chegam na R3, com o banco (design.md da change, D8).
 */
import type { Docente } from '../tipos'
import { CirculoDeIniciais } from './CirculoDeIniciais'
import estilos from './ListaDeDocentes.module.css'

/**
 * A cor do cartão, contra o fundo da seção: 'superficie' no Sobre, sobre o
 * creme, com a sombra fina; 'creme' na Equipe, sobre a superfície, sem sombra.
 */
type FundoDoCartao = 'superficie' | 'creme'

type PropsDaListaDeDocentes = {
  docentes: readonly Docente[]
  fundo: FundoDoCartao
}

export function ListaDeDocentes({ docentes, fundo }: PropsDaListaDeDocentes) {
  if (docentes.length === 0) return null

  return (
    <>
      {/* Papel de lista explícito: o Safari tira o papel de toda lista sem marcador
          (design.md da change pagina-sobre-e-equipe, D7). */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima */}
      <ul role="list" className={estilos.grade}>
        {docentes.map((docente) => (
          <li key={docente.nome} className={`${estilos.cartao} ${estilos[fundo]}`}>
            <CirculoDeIniciais nome={docente.nome} />
            <div className={estilos.texto}>
              <h3 className={estilos.nome}>{docente.nome}</h3>
              <p className={estilos.cargo}>{docente.cargo}</p>
              <p className={estilos.formacao}>{docente.formacao}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
