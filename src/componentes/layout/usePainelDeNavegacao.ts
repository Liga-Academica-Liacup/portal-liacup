import { useCallback, useEffect, useRef, useState } from 'react'

export function usePainelDeNavegacao() {
  const [aberto, setAberto] = useState(false)
  const painel = useRef<HTMLDialogElement>(null)
  const acionador = useRef<HTMLButtonElement>(null)
  const overflowAnterior = useRef<string | null>(null)

  const travarRolagem = useCallback(() => {
    // Preserva inclusive um valor inline não vazio definido por outro recurso.
    if (overflowAnterior.current === null) {
      overflowAnterior.current = document.body.style.overflow
    }
    document.body.style.overflow = 'hidden'
  }, [])

  const destravarRolagem = useCallback(() => {
    if (overflowAnterior.current !== null) {
      document.body.style.overflow = overflowAnterior.current
      overflowAnterior.current = null
    }
  }, [])

  const abrir = useCallback(() => {
    painel.current?.showModal()
    travarRolagem()
    setAberto(true)
  }, [travarRolagem])

  const fechar = useCallback(() => {
    painel.current?.close()
  }, [])

  const acionadorVisivel = useCallback(() => {
    const alvo = acionador.current
    if (!alvo) return false

    // Mede display, visibility e opacity; offsetParent é só o fallback legado.
    if (typeof alvo.checkVisibility === 'function') {
      return alvo.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
    }
    return Boolean(alvo.offsetParent)
  }, [])

  useEffect(() => {
    const dialogo = painel.current
    if (!dialogo) return

    // O close nativo sincroniza close(), Esc e cancel em um único ponto.
    const aoFechar = () => {
      destravarRolagem()
      setAberto(false)
      // No desktop, não devolve o foco a um acionador oculto.
      if (acionadorVisivel()) acionador.current?.focus()
    }

    // O backdrop não é um nó: seu clique chega ao próprio dialog nativo.
    const aoClicar = (evento: MouseEvent) => {
      if (evento.target === dialogo) dialogo.close()
    }

    dialogo.addEventListener('close', aoFechar)
    dialogo.addEventListener('click', aoClicar)
    return () => {
      dialogo.removeEventListener('close', aoFechar)
      dialogo.removeEventListener('click', aoClicar)
      destravarRolagem()
    }
  }, [destravarRolagem, acionadorVisivel])

  useEffect(() => {
    const aoRedimensionar = () => {
      /*
       * O breakpoint pertence ao CSS. Perguntar pela visibilidade mantém o
       * TypeScript desacoplado do número e fecha o painel quando ele deixa de
       * fazer sentido no layout direto.
       */
      if (!acionadorVisivel() && painel.current?.open) painel.current.close()
    }

    window.addEventListener('resize', aoRedimensionar)
    return () => window.removeEventListener('resize', aoRedimensionar)
  }, [acionadorVisivel])

  return { aberto, painel, acionador, abrir, fechar }
}
