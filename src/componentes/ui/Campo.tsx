/*
 * O QUE É
 * Campo de entrada de texto, de uma ou de várias linhas, com rótulo, ajuda,
 * erro e estado desabilitado. É o componente com mais superfície de
 * acessibilidade do conjunto.
 *
 * QUANDO USAR
 * Qualquer entrada de texto — nome, e-mail, mensagem.
 *
 * QUANDO NÃO USAR
 * Seleção, opção única e caixa de marcação. Entram quando houver tela que as
 * peça, na Fase 2, junto do painel.
 *
 * ARMADILHA
 * Não existe prop `temErro`. A presença de `erro` **é** o estado de erro —
 * duas props separadas permitiriam `temErro` sem mensagem, que é um campo
 * marcado como inválido sem dizer o motivo.
 *
 * FIDELIDADE
 * Converte `.field > label` e `.input`. Fonte de 16px e altura de 44px vêm da
 * ADR-0004 (2.2 e 2.1); a borda vem do adendo de contraste da ADR-0003. O
 * estado de erro **não existe no liacup.css** — é comportamento novo, sem
 * classe de origem para comparar.
 */
'use client'

import { useId } from 'react'
import estilos from './Campo.module.css'

type TipoDoCampo = 'texto' | 'email' | 'textarea'

type PropsDoCampo = {
  /** Obrigatório: não existe campo sem rótulo. */
  rotulo: string
  /** União fechada. `textarea` desenha várias linhas. */
  tipo?: TipoDoCampo
  /** Texto de apoio, anunciado junto com o rótulo. */
  ajuda?: string
  /** A presença desta mensagem é o estado de erro. */
  erro?: string
  /** Mantém o rótulo para o leitor de tela, sem ocupar espaço na tela. */
  rotuloEscondido?: boolean
  desabilitado?: boolean
  valor?: string
  aoMudar?: (valor: string) => void
  placeholder?: string
  nome?: string
}

export function Campo({
  rotulo,
  tipo = 'texto',
  ajuda,
  erro,
  rotuloEscondido = false,
  desabilitado = false,
  valor,
  aoMudar,
  placeholder,
  nome,
}: PropsDoCampo) {
  /*
   * Identificador gerado, e não derivado do texto do rótulo: dois campos com o
   * mesmo rótulo na mesma página colidiriam, e a associação apontaria em
   * silêncio para o campo errado — defeito que passa em toda verificação
   * automática, porque o HTML continua válido.
   */
  const idBase = useId()
  const idControle = `${idBase}-controle`
  const idAjuda = `${idBase}-ajuda`
  const idErro = `${idBase}-erro`

  const descritoPor = [ajuda ? idAjuda : null, erro ? idErro : null].filter(Boolean).join(' ')

  const classesDoControle = [
    estilos.controle,
    tipo === 'textarea' ? estilos.textarea : '',
    erro ? estilos.comErro : '',
  ]
    .filter(Boolean)
    .join(' ')

  const atributosComuns = {
    id: idControle,
    name: nome,
    className: classesDoControle,
    disabled: desabilitado,
    placeholder,
    value: valor,
    onChange: (evento: { target: { value: string } }) => aoMudar?.(evento.target.value),
    'aria-invalid': erro ? (true as const) : undefined,
    'aria-describedby': descritoPor || undefined,
  }

  return (
    <div className={estilos.campo}>
      <label
        htmlFor={idControle}
        className={rotuloEscondido ? estilos.rotuloEscondido : estilos.rotulo}
      >
        {rotulo}
      </label>

      {tipo === 'textarea' ? (
        <textarea {...atributosComuns} />
      ) : (
        <input type={tipo === 'email' ? 'email' : 'text'} {...atributosComuns} />
      )}

      {ajuda ? (
        <p id={idAjuda} className={estilos.ajuda}>
          {ajuda}
        </p>
      ) : null}

      {/*
        O erro é anunciado quando aparece, e não depende só de cor: traz ícone e
        texto. Continua visível quando o campo está desabilitado — esconder
        apagaria a única explicação de por que o formulário não envia.
      */}
      {erro ? (
        <p id={idErro} className={estilos.erro} role="alert" aria-live="polite">
          <span className={estilos.iconeErro} aria-hidden="true">
            !
          </span>
          {erro}
        </p>
      ) : null}
    </div>
  )
}
