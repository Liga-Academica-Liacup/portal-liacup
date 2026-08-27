'use client'

/*
 * A navegação do site público — a ÚNICA ilha cliente da moldura.
 *
 * Tudo o mais na F03 é Server Component. Este arquivo é cliente porque precisa
 * de estado de interface e de eventos de teclado; o `'use client'` fica no menor
 * componente possível, como manda a seção 2.1 dos padrões.
 *
 * FONTE ÚNICA
 * Os destinos vêm de `destinos-publicos.ts` e de lugar nenhum mais. Não há lista
 * escrita aqui, e é essa ausência que faz o FR-044 valer.
 *
 * O CORTE DE 1024 px MORA NO CSS, e não neste arquivo.
 * A navegação direta e o acionador do painel são mostrados e escondidos por
 * media query. O TypeScript nunca compara larguras: quando precisa saber se o
 * painel ainda faz sentido, ele **pergunta ao navegador** se o acionador está
 * visível. Repetir `1024` aqui criaria a segunda fonte que o plano proíbe — e a
 * que diverge é sempre a que ninguém lembra de atualizar.
 *
 * O PAINEL É UM `<dialog>` NATIVO
 * `showModal()` traz de graça, e implementado pelo navegador, o que uma
 * biblioteca de drawer venderia: modalização, prisão de foco, fechamento por
 * Esc e inertização do resto da página. O plano recusou dependência para painel
 * lateral, prisão de foco e trava de rolagem justamente porque o miolo já
 * existe na plataforma (research.md, D4/D5/D9).
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Icone } from '@/componentes/ui/Icone'
import { DESTINOS_PUBLICOS, destinosSecundarios } from './destinos-publicos'
import estilos from './NavegacaoPublica.module.css'

const ID_DO_PAINEL = 'painel-de-navegacao'

export function NavegacaoPublica() {
  const caminhoAtual = usePathname()
  const [aberto, setAberto] = useState(false)
  const painel = useRef<HTMLDialogElement>(null)
  const acionador = useRef<HTMLButtonElement>(null)
  const overflowAnterior = useRef<string | null>(null)

  /*
   * Trava a rolagem do fundo guardando o valor ANTERIOR, e não assumindo que
   * era vazio. Restaurar para `''` funcionaria hoje e apagaria em silêncio um
   * `overflow` que outra coisa tivesse definido.
   */
  const travarRolagem = useCallback(() => {
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

  /*
   * Um ÚNICO ponto de sincronização: o evento `close` do próprio `<dialog>`.
   *
   * Ele dispara para todas as formas de fechar — `close()`, Esc tratado pelo
   * navegador, e o `cancel` — então o estado e a rolagem não podem ficar
   * dessincronizados por um caminho que alguém esqueceu de cobrir. Devolver o
   * foco aqui também garante que Esc e escolha de destino terminem igual.
   */
  useEffect(() => {
    const dialogo = painel.current
    if (!dialogo) return

    const aoFechar = () => {
      destravarRolagem()
      setAberto(false)
      // Só devolve o foco a um acionador que exista e esteja visível: no
      // desktop ele sai da árvore, e focar elemento oculto perde o foco na
      // página inteira.
      if (acionador.current?.offsetParent) acionador.current.focus()
    }

    /*
     * Clique no backdrop. O alvo do evento é o próprio `<dialog>` quando o
     * clique cai fora do conteúdo — o backdrop não é um elemento separado.
     *
     * Registrado aqui pelo `ref`, e não como `onClick` no JSX, de propósito: o
     * `jsx-a11y` recusa manipulador de clique em elemento não interativo, e ele
     * tem razão. Contornar com um `onKeyDown` de fachada só para calar a regra
     * seria pior — Esc já é tratado pelo próprio `<dialog>` e cai no mesmo
     * `close` acima. Assim toda a fiação nativa do painel fica num lugar só.
     */
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
  }, [destravarRolagem])

  /*
   * Ao passar para desktop com o painel aberto, ele deixa de existir. Fecha, e a
   * checagem é "o acionador ainda está visível?", não "a largura é maior que
   * 1024" — o corte continua morando só no CSS.
   */
  useEffect(() => {
    const aoRedimensionar = () => {
      const acionadorSumiu = !acionador.current?.offsetParent
      if (acionadorSumiu && painel.current?.open) painel.current.close()
    }
    window.addEventListener('resize', aoRedimensionar)
    return () => window.removeEventListener('resize', aoRedimensionar)
  }, [])

  const ehAtual = (caminho: string) => caminhoAtual === caminho

  return (
    <>
      {/*
       * O `<nav>` EXISTE EM TODAS AS LARGURAS, e só o conteúdo dele troca.
       *
       * A primeira versão escondia o `<nav>` inteiro abaixo de 1024 px, e o
       * teste de landmarks pegou: `navigation 0` nas dez rotas no mobile. Como
       * `display: none` tira o elemento da árvore de acessibilidade, a página
       * ficava **sem nenhum landmark de navegação** justamente no caso
       * principal — quem navega por regiões no leitor de tela não achava o menu
       * do site no celular.
       *
       * Agora a região é a mesma nas sete larguras; o que aparece dentro dela é
       * que muda. O acionador e o painel moram aqui dentro pelo mesmo motivo:
       * são a navegação, e não algo ao lado dela.
       */}
      <nav className={estilos.navegacao} aria-label="Navegação principal">
        <ul className={estilos.lista} data-testid="navegacao-direta">
          {destinosSecundarios.map((destino) => (
            <li key={destino.caminho}>
              <Link
                className={estilos.destino}
                href={destino.caminho}
                aria-current={ehAtual(destino.caminho) ? 'page' : undefined}
              >
                {destino.rotulo}
              </Link>
            </li>
          ))}
        </ul>

        <button
          ref={acionador}
          type="button"
          className={estilos.acionador}
          data-testid="abrir-painel"
          aria-expanded={aberto}
          aria-controls={ID_DO_PAINEL}
          aria-label={aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          onClick={() => (aberto ? fechar() : abrir())}
        >
          <Icone nome={aberto ? 'fechar' : 'abrir'} />
        </button>

        <dialog
          ref={painel}
          id={ID_DO_PAINEL}
          data-testid="painel-de-navegacao"
          className={estilos.painel}
          aria-label="Menu de navegação"
        >
          <ul className={estilos.listaDoPainel}>
            {destinosSecundarios.map((destino) => (
              <li key={destino.caminho}>
                <Link
                  className={estilos.destinoDoPainel}
                  href={destino.caminho}
                  aria-current={ehAtual(destino.caminho) ? 'page' : undefined}
                  onClick={fechar}
                >
                  {destino.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </dialog>
      </nav>
    </>
  )
}

/** Exportado para o teste de unidade da Fase 7 conferir a derivação exata. */
export const totalDeDestinos = DESTINOS_PUBLICOS.length
