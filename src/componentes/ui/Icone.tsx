/*
 * Componente de icone da camada base.
 *
 * Burro de proposito, como todo componente de ui/: nao sabe o que e um canal de
 * contato, nao conhece rota nem banco. Recebe o nome do desenho e desenha.
 *
 * Um componente com prop de variante, e nao um arquivo por icone, pelo mesmo
 * motivo do Botao.tsx: o tipo fechado em uniao de strings faz o TypeScript
 * recusar um nome que nao existe, e o conjunto de icones fica visivel num lugar
 * so em vez de espalhado pela pasta.
 *
 * Todo icone aqui e DECORATIVO: vem sempre acompanhado do texto do link. Por
 * isso `aria-hidden` e `focusable="false"` sao fixos e nao props — leitor de tela
 * anunciaria o mesmo conteudo duas vezes, e no Internet Explorer legado o SVG
 * entra na ordem de tabulacao sem o `focusable`. Icone que carrega significado
 * sozinho precisa de rotulo, e ai e outro componente.
 */
import estilos from './Icone.module.css'

type NomeDoIcone = 'instagram' | 'email'

type PropsDoIcone = {
  /** Qual desenho mostrar. Nome fora da uniao nao compila. */
  nome: NomeDoIcone
}

const DESENHOS: Record<NomeDoIcone, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" />
    </>
  ),
}

export function Icone({ nome }: PropsDoIcone) {
  return (
    <svg
      className={estilos.icone}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-icone={nome}
    >
      {DESENHOS[nome]}
    </svg>
  )
}
