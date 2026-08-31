'use client'

/*
 * Única ilha cliente da moldura: o pathname e o diálogo exigem estado do
 * navegador. O catálogo continua sendo a fonte única dos dez destinos, e o
 * corte responsivo continua exclusivamente no CSS.
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icone } from '@/componentes/ui/Icone'
import { classesDaAparencia } from '@/componentes/ui/aparencia-de-botao'
import { conversaoPrincipal, destinosSecundarios } from './destinos-publicos'
import estilos from './NavegacaoPublica.module.css'
import { usePainelDeNavegacao } from './usePainelDeNavegacao'

const ID_DO_PAINEL = 'painel-de-navegacao'

export function NavegacaoPublica() {
  const caminhoAtual = usePathname()
  const { aberto, painel, acionador, abrir, fechar } = usePainelDeNavegacao()
  const ehAtual = (caminho: string) => caminhoAtual === caminho

  return (
    <>
      {/*
       * A região existe em todas as larguras; o CSS troca somente seu conteúdo.
       * Assim acionador e painel continuam dentro do landmark de navegação.
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

      {/* A conversão fica fora do painel e visível em todas as larguras. */}
      <Link
        className={`${classesDaAparencia('primario', false)} ${estilos.conversao}`}
        href={conversaoPrincipal.caminho}
        data-testid="conversao-principal"
        aria-current={ehAtual(conversaoPrincipal.caminho) ? 'page' : undefined}
      >
        {conversaoPrincipal.rotulo}
      </Link>
    </>
  )
}
