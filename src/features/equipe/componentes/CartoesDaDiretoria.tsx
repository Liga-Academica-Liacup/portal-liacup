/*
 * "Diretoria": os seis cargos da seção 4.3 do documento, na grade do
 * protótipo (quatro colunas no desktop, duas no celular).
 *
 * Sem nome de pessoa, curso nem semestre: o documento não diz quem ocupa cada
 * cargo. E sem círculo de foto, borboleta ou imagem: não há pessoa para
 * mostrar (Q7 do Gabriel, 22/11/2026). Cada cartão tem o cargo em <h3>, no
 * lugar do nome, e a linha do cargo, no lugar de "cargo · curso". Os círculos
 * voltam quando a liga mandar nomes e fotos, numa change própria.
 *
 * Carregando, erro e vazio: o vazio é impossível hoje, porque o dado é
 * estático e o teste de unidade do conteúdo exige os seis cargos. Os três
 * estados chegam na R3, com o banco (design.md da change, D8).
 */
import type { CargoDaDiretoria } from '../tipos'
import estilos from './CartoesDaDiretoria.module.css'
import { TituloDoBloco } from './TituloDoBloco'

type PropsDosCartoesDaDiretoria = {
  titulo: string
  cargos: readonly CargoDaDiretoria[]
}

export function CartoesDaDiretoria({ titulo, cargos }: PropsDosCartoesDaDiretoria) {
  if (cargos.length === 0) return null

  return (
    <section className={estilos.secao} aria-labelledby="titulo-da-diretoria">
      <div className={estilos.conteudo}>
        <TituloDoBloco id="titulo-da-diretoria">{titulo}</TituloDoBloco>
        {/* Papel de lista explícito: o Safari tira o papel de toda lista sem marcador
            (design.md da change pagina-sobre-e-equipe, D7). */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima */}
        <ul role="list" className={estilos.grade}>
          {cargos.map((item) => (
            <li key={item.cargo} className={estilos.cartao}>
              <h3 className={estilos.cargo}>{item.cargo}</h3>
              <p className={estilos.linha}>{item.linha}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
