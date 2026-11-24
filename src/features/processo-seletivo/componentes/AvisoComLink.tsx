/*
 * O aviso das inscrições com o link no meio, num lugar só para as duas faixas
 * que o mostram: a do topo de /processo-seletivo e a da página inicial
 * (design.md da change inicio-completo, D1).
 *
 * O texto chega do conteudo.ts. O link abre o Instagram em nova aba, sem dar à
 * página aberta acesso a esta (noopener) nem o endereço de origem
 * (noreferrer). O nome acessível diz o destino e contém o texto visível,
 * "@liacup.unb" (WCAG 2.5.3).
 *
 * As cores e os estados do link ficam com cada faixa, pelas classes que ela
 * passa: o fundo de cada uma é outro, e os pares de contraste também.
 */
import type { TextoComLink } from '../tipos'

type PropsDoAvisoComLink = {
  aviso: TextoComLink
  classes: {
    paragrafo: string | undefined
    link: string | undefined
  }
}

export function AvisoComLink({ aviso, classes }: PropsDoAvisoComLink) {
  return (
    <p className={classes.paragrafo}>
      {aviso.antesDoLink}
      <a
        className={classes.link}
        href={aviso.endereco}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={aviso.nomeAcessivelDoLink}
      >
        {aviso.textoDoLink}
      </a>
      {aviso.depoisDoLink}
    </p>
  )
}
