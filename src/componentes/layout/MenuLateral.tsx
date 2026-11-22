'use client'

/*
 * O botão de menu do celular e o menu lateral que ele abre.
 *
 * Aparece até 1024 px, que é onde o protótipo troca os links em linha pelo
 * botão (medido no protótipo: botão visível em 1024 px, escondido em 1025 px).
 * O comportamento está todo no usePainelDeNavegacao; aqui fica só o desenho.
 *
 * Os destinos e o botão de destaque chegam por props, lidos da lista única de
 * páginas públicas pelo Cabecalho. Este componente não sabe que páginas há.
 */
import type { PaginaPublica } from '@/lib/utils/paginas-publicas'
import { aparenciaDeBotao } from '@/componentes/ui/aparencia-de-botao'
import { LinkDaNavegacao } from './LinkDaNavegacao'
import estilos from './MenuLateral.module.css'
import { usePainelDeNavegacao } from './use-painel-de-navegacao'

const ID_DO_MENU = 'menu-lateral'
const ID_DO_TITULO = 'menu-lateral-titulo'

type PropsDoMenuLateral = {
  /** Páginas do menu, na ordem da lista. */
  paginas: readonly PaginaPublica[]
  /** Página do botão do fim do menu, se houver uma marcada como destaque. */
  destaque?: PaginaPublica
}

export function MenuLateral({ paginas, destaque = undefined }: PropsDoMenuLateral) {
  const { aberto, painel, acionador, abrir, fechar } = usePainelDeNavegacao()

  return (
    <>
      <button
        ref={acionador}
        type="button"
        className={estilos.acionador}
        aria-label="Abrir menu de navegação"
        aria-expanded={aberto}
        aria-controls={ID_DO_MENU}
        onClick={() => (aberto ? fechar() : abrir())}
      >
        <svg className={estilos.icone} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <dialog ref={painel} id={ID_DO_MENU} className={estilos.menu} aria-labelledby={ID_DO_TITULO}>
        <div className={estilos.topo}>
          <span id={ID_DO_TITULO} className={estilos.titulo}>
            Navegação
          </span>
          <button
            type="button"
            className={estilos.fechar}
            aria-label="Fechar menu"
            onClick={fechar}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav aria-label="Navegação do site">
          {/* Papel de lista explícito: o Safari tira o papel de toda lista sem marcador,
              e o VoiceOver deixa de dizer quantos itens há (design.md da change
              pagina-sobre-e-equipe, D7). */}
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- WebKit, ver acima */}
          <ul role="list" className={estilos.lista}>
            {paginas.map((pagina) => (
              <li key={pagina.endereco}>
                <LinkDaNavegacao
                  endereco={pagina.endereco}
                  className={estilos.destino}
                  aoEscolher={fechar}
                >
                  <span className={estilos.marcaAtual} aria-hidden="true" />
                  {pagina.rotulo}
                </LinkDaNavegacao>
              </li>
            ))}
          </ul>
        </nav>

        {destaque ? (
          <LinkDaNavegacao
            endereco={destaque.endereco}
            className={`${aparenciaDeBotao('primario', 'total')} ${estilos.destaque}`}
            aoEscolher={fechar}
          >
            {destaque.rotulo}
          </LinkDaNavegacao>
        ) : null}
      </dialog>
    </>
  )
}
