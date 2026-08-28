/*
 * A moldura de todas as páginas públicas.
 *
 * ORDEM SEMÂNTICA OBRIGATÓRIA (contracts/navegacao.md):
 *
 *   link de pular conteúdo   ← primeiro focável da página (FR-017)
 *   header                   ← marca, navegação, conversão
 *   main#conteudo-principal  ← destino do skip link (FR-018)
 *   footer                   ← linha institucional, sede, contatos
 *
 * POR QUE O SKIP LINK VEM ANTES DO <header>
 * Porque ele precisa ser o **primeiro** elemento a receber foco (FR-017), e a
 * ordem de foco segue a ordem do documento. Pô-lo dentro do cabeçalho o
 * colocaria depois da marca — e alguém que navega por teclado teria de passar
 * pela navegação inteira antes de encontrar o atalho que existe justamente para
 * pular a navegação.
 *
 * POR QUE O <main> TEM tabIndex={-1}
 * Um elemento sem foco natural não recebe foco ao ser alvo de um link de
 * fragmento no **Safari** e no **Firefox**: a página rola, e o foco fica onde
 * estava. No Chromium ele recebe — medido em 28/08/2026, removendo o atributo e
 * vendo o percurso 2 continuar verde. Isto é: este teste NÃO prova que a linha
 * é necessária, e a linha fica pelos dois navegadores nomeados acima. O
 * `tabIndex={-1}` torna o `<main>` focável por programa sem entrar na ordem de
 * Tab. É a diferença entre o skip link mover a tela e mover o FOCO — e só o
 * segundo serve para quem depende do teclado.
 *
 * `src/app/layout.tsx` continua exclusivamente global: fontes, `<html lang>` e
 * metadados. A moldura pública é deste grupo de rotas, porque o painel
 * administrativo da Fase 2 não a usa.
 */
import { Cabecalho } from '@/componentes/layout/Cabecalho'
import { Rodape } from '@/componentes/layout/Rodape'
import estilos from './layout.module.css'

export default function LayoutDoSite({ children }: { children: React.ReactNode }) {
  return (
    <div className={estilos.moldura}>
      <a className={estilos.pularParaConteudo} href="#conteudo-principal">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo-principal" tabIndex={-1} className={estilos.principal}>
        {children}
      </main>
      <Rodape />
    </div>
  )
}
