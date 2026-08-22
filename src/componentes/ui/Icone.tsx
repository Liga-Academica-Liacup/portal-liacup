/*
 * O QUE É
 * Ícone decorativo da camada base. Um componente com prop de variante, e não um
 * arquivo por ícone: o tipo fechado em união de strings faz o TypeScript
 * recusar um nome que não existe, e o conjunto fica visível num lugar só.
 *
 * QUANDO USAR
 * Ao lado de um texto que já diz o que a coisa é — um link de contato, um botão
 * com rótulo.
 *
 * QUANDO NÃO USAR
 * Sozinho, carregando significado. Todo ícone aqui é decorativo: `aria-hidden` e
 * `focusable="false"` são fixos, não props. Um ícone que precisa ser anunciado
 * exige rótulo, e isso é outro componente. Dentro de um botão sem texto, quem
 * carrega o nome acessível é o botão — a variante `icone` do Botao exige
 * `aria-label` pelo tipo, justamente por isso.
 *
 * FIDELIDADE
 * Não vem do liacup.css: nasceu na F00, junto dos links de contato. Não tem
 * classe de origem para comparar e por isso não aparece no FIDELIDADE.md.
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
