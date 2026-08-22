/*
 * O QUE É
 * Superfície que agrupa informação relacionada. Composição pura: aceita
 * `children` e partes nomeadas, todas opcionais e em qualquer ordem.
 *
 * QUANDO USAR
 * Agrupar informação que se repete em lista — notícia, evento, material,
 * membro da equipe.
 *
 * QUANDO NÃO USAR
 * Como caixa decorativa para dar fundo a qualquer coisa. Cartão sem conteúdo
 * agrupado é uma <div> com sombra, e vira ruído numa página cheia deles.
 *
 * ARMADILHA
 * O `nivel` do título é obrigatoriamente escolhido por quem compõe: um cartão
 * dentro de uma seção <h2> precisa de <h3>. O componente não tem como saber
 * onde está, e título fora de ordem quebra a navegação por cabeçalhos do leitor
 * de tela — item D7 do checklist de validação.
 *
 * FIDELIDADE
 * Raio --radius-xl, que é o valor efetivo do .card depois da cascata final do
 * liacup.css, e não o --radius-md declarado no bloco. Cor do kicker e da meta
 * corrigidas pelo adendo da ADR-0003.
 */
import type { ReactNode } from 'react'
import estilos from './Cartao.module.css'

type Elevacao = 'nenhuma' | 'sm' | 'md' | 'lg'
type NivelDeTitulo = 2 | 3 | 4 | 5 | 6

type PropsDoCartao = {
  children: ReactNode
  /** Profundidade da sombra. União fechada: `.elev-sm`, `.elev-md`, `.elev-lg`. */
  elevacao?: Elevacao
}

export function Cartao({ children, elevacao = 'nenhuma' }: PropsDoCartao) {
  const classes = [estilos.cartao, elevacao !== 'nenhuma' ? estilos[elevacao] : '']
    .filter(Boolean)
    .join(' ')

  return <article className={classes}>{children}</article>
}

/** Texto curto em caixa alta acima do título. Converte `.card-kicker`. */
function Kicker({ children }: { children: ReactNode }) {
  return <p className={estilos.kicker}>{children}</p>
}

/** Título do cartão. Converte `.card-title`. O nível é escolha de quem compõe. */
function Titulo({ children, nivel = 3 }: { children: ReactNode; nivel?: NivelDeTitulo }) {
  const Tag = `h${nivel}` as const
  return <Tag className={estilos.titulo}>{children}</Tag>
}

/** Corpo do cartão. Converte `.card-body`. */
function Corpo({ children }: { children: ReactNode }) {
  return <p className={estilos.corpo}>{children}</p>
}

/** Linha de metadados, ex.: data e categoria. Converte `.card-meta`. */
function Meta({ children }: { children: ReactNode }) {
  return <div className={estilos.meta}>{children}</div>
}

Cartao.Kicker = Kicker
Cartao.Titulo = Titulo
Cartao.Corpo = Corpo
Cartao.Meta = Meta
