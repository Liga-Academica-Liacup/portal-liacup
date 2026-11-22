/*
 * A borboleta, símbolo da liga, desenhada como no protótipo aprovado
 * (<symbol id="borboleta">). Sempre decorativa: escondida do leitor de tela e
 * fora da ordem de foco. Quem usa decide o tamanho, o lugar e a opacidade pela
 * className.
 *
 * As cores das asas vêm dos tokens, no CSS ao lado: nenhuma cor escrita aqui.
 * Os números abaixo são o desenho, no sistema de coordenadas do viewBox, e não
 * medidas de tela.
 *
 * Mora em src/componentes/ui/ desde a change pagina-sobre-e-equipe (D6): a
 * inicial e a página Sobre a usam, e uma feature não importa de src/app/. Até
 * ali, morava junto do hero da inicial.
 */
import estilos from './BorboletaDaLiga.module.css'

type PropsDaBorboleta = {
  className?: string
}

export function BorboletaDaLiga({ className = '' }: PropsDaBorboleta) {
  return (
    <svg
      className={`${estilos.borboleta} ${className}`}
      viewBox="0 0 100 84"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={estilos.asaDeTras}
        d="M50 42C50 42 36 6 20 8 4 10 2 30 12 38c-8 4-10 22 2 30 14 9 36-26 36-26z"
      />
      <path
        className={estilos.asaDaFrente}
        d="M50 42s14-36 30-34c16 2 18 22 8 30 8 4 10 22-2 30-14 9-36-26-36-26z"
      />
      <path
        className={estilos.asaClara}
        d="M50 42s-9-18-20-18-13 12-8 16c-5 4-4 14 5 16 11 2 23-14 23-14z"
      />
      <path
        className={estilos.asaMaisClara}
        d="M50 42s9-18 20-18 13 12 8 16c5 4 4 14-5 16-11 2-23-14-23-14z"
      />
      <rect className={estilos.corpo} x="47.5" y="20" width="5" height="46" rx="2.5" />
      <path className={estilos.antenas} d="M50 22c-3-6-9-9-13-8M50 22c3-6 9-9 13-8" />
    </svg>
  )
}
