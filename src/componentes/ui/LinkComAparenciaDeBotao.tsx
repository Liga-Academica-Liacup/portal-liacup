/*
 * O QUE É
 * Um link com a aparência de botão. Renderiza `<a>`, sempre.
 *
 * POR QUE ELE EXISTE
 * A conversão principal do site precisa **parecer** um botão e **navegar**. As
 * duas coisas juntas não cabem no `Botao`: ele renderiza `<button>`, e um
 * `<button>` que navega quebra o menu de contexto, o abrir em nova aba e o que o
 * leitor de tela anuncia.
 *
 * Faltava componente, e isso foi tratado como achado da feature (FR-030) em vez
 * de contornado com estilo solto. Ele não é especulativo: tem três consumidores
 * nomeados antes de existir — o cabeçalho (FR-005), a chamada da home na F04 e o
 * "Botão de inscrição" que o `conteudo-institucional.md` §5.1 já especifica para
 * a F12.
 *
 * A APARÊNCIA É A MESMA DO BOTÃO, e isso é verificado (FR-045, SC-018)
 * Os dois consomem `AparenciaDeBotao.module.css` pelo mesmo
 * `classesDaAparencia`. Nenhum dos dois tem CSS próprio de aparência: o
 * `Botao.module.css` foi apagado. A vitrine compara as propriedades calculadas
 * dos seis pares, e a lista comparada é derivada daquele CSS — acrescentar uma
 * propriedade lá estende a comparação sozinho.
 *
 * TRÊS VARIANTES, NÃO QUATRO
 * Não existe link-ícone: seria API sem consumidor real, que é o que a F01
 * recusou. O tipo cobra isso, não a revisão.
 *
 * NAVEGAÇÃO DE PÁGINA INTEIRA, E ISSO É DELIBERADO
 * Ele não usa o `<Link>` do Next, então a navegação recarrega a página em vez de
 * ser feita no cliente. É a escolha óbvia em vez da engenhosa (Princípio 1): um
 * primitivo de `ui/` que não conhece rota é o que a regra de camadas pede, e
 * embrulhar o `<Link>` aqui exigiria devolver o controle de `className` que este
 * componente existe para fechar. O custo é uma navegação completa num link do
 * cabeçalho, e ele é medido pelo Lighthouse nas dez rotas. Se um dia doer, é
 * decisão nomeada para reabrir, não descuido.
 */
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { classesDaAparencia, type VarianteCompartilhada } from './aparencia-de-botao'

type PropsDoLink = {
  /** Destino. Obrigatório: link sempre navega, e sem destino não é link. */
  href: string
  /** Conteúdo. Composição, não uma prop `texto`. */
  children: ReactNode
  /** Somente as variantes textuais compartilhadas com o `Botao`. */
  variante?: VarianteCompartilhada
  /** Ocupa toda a largura disponível. Combina com qualquer variante. */
  larguraTotal?: boolean
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'style' | 'children' | 'href'>

export function LinkComAparenciaDeBotao({
  href,
  children,
  variante = 'primario',
  larguraTotal = false,
  ...atributos
}: PropsDoLink) {
  return (
    <a href={href} className={classesDaAparencia(variante, larguraTotal)} {...atributos}>
      {children}
    </a>
  )
}
