/*
 * O comportamento do menu lateral, separado do desenho dele.
 *
 * Vem da tag arquivo/F03-layout-base (só o comportamento; a aparência de lá não
 * vale). O menu é um <dialog> nativo aberto com showModal(), que já deixa a
 * página por trás inerte e fecha no Esc. Este hook acrescenta:
 *
 *   - fechar no toque fora (no fundo escurecido);
 *   - prender o foco: Tab depois do último controle volta ao primeiro, e
 *     Shift+Tab antes do primeiro vai ao último;
 *   - devolver o foco ao botão que abriu, ao fechar de qualquer jeito;
 *   - travar a rolagem da página enquanto o menu está aberto;
 *   - fechar sozinho quando a janela cresce e o botão de menu some.
 *
 * O ponto de troca (1024 px) mora só no CSS. Aqui se pergunta ao navegador se
 * o botão está visível, para o número não ficar escrito em dois lugares.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

const FOCAVEIS = 'a[href], button:not([disabled])'

export function usePainelDeNavegacao() {
  const [aberto, setAberto] = useState(false)
  const painel = useRef<HTMLDialogElement>(null)
  const acionador = useRef<HTMLButtonElement>(null)
  const overflowAnterior = useRef<string | null>(null)

  const destravarRolagem = useCallback(() => {
    if (overflowAnterior.current !== null) {
      document.body.style.overflow = overflowAnterior.current
      overflowAnterior.current = null
    }
  }, [])

  const acionadorVisivel = useCallback(() => {
    const alvo = acionador.current
    if (!alvo) return false
    if (typeof alvo.checkVisibility === 'function') {
      return alvo.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
    }
    return Boolean(alvo.offsetParent)
  }, [])

  const abrir = useCallback(() => {
    const dialogo = painel.current
    if (!dialogo || dialogo.open) return
    dialogo.showModal()
    if (overflowAnterior.current === null) overflowAnterior.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setAberto(true)
  }, [])

  const fechar = useCallback(() => {
    painel.current?.close()
  }, [])

  useEffect(() => {
    const dialogo = painel.current
    if (!dialogo) return

    // O evento close cobre os três jeitos de fechar: botão, Esc e toque fora.
    const aoFechar = () => {
      destravarRolagem()
      setAberto(false)
      if (acionadorVisivel()) acionador.current?.focus()
    }

    // O fundo escurecido não é um elemento: o toque nele chega ao <dialog>,
    // com a posição fora do retângulo do menu.
    const aoClicar = (evento: MouseEvent) => {
      if (evento.target !== dialogo) return
      const area = dialogo.getBoundingClientRect()
      const dentro =
        evento.clientX >= area.left &&
        evento.clientX <= area.right &&
        evento.clientY >= area.top &&
        evento.clientY <= area.bottom
      if (!dentro) dialogo.close()
    }

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key !== 'Tab') return
      const focaveis = Array.from(dialogo.querySelectorAll<HTMLElement>(FOCAVEIS))
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      if (!primeiro || !ultimo) return
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primeiro.focus()
      }
    }

    const aoRedimensionar = () => {
      if (dialogo.open && !acionadorVisivel()) dialogo.close()
    }

    dialogo.addEventListener('close', aoFechar)
    dialogo.addEventListener('click', aoClicar)
    dialogo.addEventListener('keydown', aoTeclar)
    window.addEventListener('resize', aoRedimensionar)
    return () => {
      dialogo.removeEventListener('close', aoFechar)
      dialogo.removeEventListener('click', aoClicar)
      dialogo.removeEventListener('keydown', aoTeclar)
      window.removeEventListener('resize', aoRedimensionar)
      destravarRolagem()
    }
  }, [destravarRolagem, acionadorVisivel])

  return { aberto, painel, acionador, abrir, fechar }
}
