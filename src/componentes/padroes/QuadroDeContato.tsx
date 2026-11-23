/*
 * Um quadro de contato: o círculo com a imagem à esquerda e, à direita, o
 * rótulo e o dado, como os canais da página Contato do protótipo, sem a
 * legenda de baixo (REFERENCIA-VISUAL.md, seção 6).
 *
 * A imagem entra como filho, para cada canal trazer a sua (composição antes de
 * configuração, PADROES-DE-CODIGO.md, 2.4). Ela é decorativa: o rótulo e o dado
 * já dizem tudo.
 *
 * A variante diz o que o quadro faz, sem booleanas soltas:
 *   - "externo": o quadro inteiro é um link para outro site, em nova aba, sem
 *     dar à página aberta acesso à de origem nem o endereço de origem;
 *   - "email": o quadro inteiro é um link que abre um e-mail novo, na mesma aba;
 *   - "texto": o quadro é só texto, que se pode selecionar e copiar.
 * (REFERENCIA-VISUAL.md, seção 7, "links do Instagram e do e-mail".)
 *
 * O nome acessível do link é o texto visível, na ordem: rótulo e dado. No
 * externo, termina dizendo que abre em nova aba.
 *
 * Não sabe em que página está, nem em que coluna: quem posiciona é a rota.
 */
import type { ReactNode } from 'react'
import estilos from './QuadroDeContato.module.css'

type Destino =
  | { variante: 'externo'; endereco: string }
  | { variante: 'email'; endereco: string }
  | { variante: 'texto' }

type PropsDoQuadroDeContato = Destino & {
  rotulo: string
  valor: string
  /** A imagem do círculo, decorativa. */
  children: ReactNode
}

/** O aviso só para leitor de tela, no fim do nome do link externo. */
const AVISO_DE_NOVA_ABA = '(abre em nova aba)'

export function QuadroDeContato(props: PropsDoQuadroDeContato) {
  const { rotulo, valor, children } = props

  /* Os espaços entre os pedaços não aparecem (cada um é uma linha), mas
     separam as palavras no nome acessível: "Instagram @liacup.unb". */
  const conteudo = (
    <>
      <span className={estilos.figura} aria-hidden="true">
        {children}
      </span>
      <span className={estilos.texto}>
        <span className={estilos.rotulo}>{rotulo}</span>{' '}
        <span className={estilos.valor}>{valor}</span>
        {props.variante === 'externo' ? (
          <>
            {' '}
            <span className={estilos.soParaLeitorDeTela}>{AVISO_DE_NOVA_ABA}</span>
          </>
        ) : null}
      </span>
    </>
  )

  if (props.variante === 'externo') {
    return (
      <a
        className={`${estilos.quadro} ${estilos.link}`}
        href={props.endereco}
        target="_blank"
        rel="noopener noreferrer"
      >
        {conteudo}
      </a>
    )
  }

  if (props.variante === 'email') {
    return (
      <a className={`${estilos.quadro} ${estilos.link}`} href={`mailto:${props.endereco}`}>
        {conteudo}
      </a>
    )
  }

  return <div className={estilos.quadro}>{conteudo}</div>
}
