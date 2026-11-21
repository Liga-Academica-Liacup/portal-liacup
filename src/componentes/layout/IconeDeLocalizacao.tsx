/*
 * Marcador de localização, ao lado do endereço no rodapé das páginas públicas
 * (REFERENCIA-VISUAL.md, seção 7, "Rodapé, coluna de contato").
 *
 * Mora em componentes/layout, e não como variante do ui/Icone, porque esta
 * change não mexe em componentes/ui. Segue o mesmo desenho do Icone: grade de
 * 24, traço em currentColor, decorativo (aria-hidden e focusable="false"
 * fixos). Quando a página Contato precisar dele, vira a variante "localizacao"
 * do Icone, e este arquivo sai.
 */
import estilos from './IconeDeLocalizacao.module.css'

export function IconeDeLocalizacao() {
  return (
    <svg
      className={estilos.icone}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-icone="localizacao"
    >
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" stroke="currentColor" />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" />
    </svg>
  )
}
