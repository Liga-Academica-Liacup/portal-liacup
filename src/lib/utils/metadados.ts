/*
 * Os metadados de cada página pública: título, descrição, endereço canônico e
 * os dados de compartilhamento (Open Graph). Uma função só, para nenhuma página
 * escrevê-los à mão (docs/PADROES-DE-CODIGO.md, seção 11).
 *
 * Cada página da lista declara:
 *
 *   export const metadata = montarMetadados('/processo-seletivo')
 *
 * e a função lê o título e a descrição da entrada dela na lista única
 * (paginas-publicas.json). Página nova na lista ganha os metadados sem ninguém
 * escrevê-los.
 *
 * O que a função NÃO repete, porque outro lugar já dá: o idioma e as fontes
 * (src/app/layout.tsx) e os ícones da aba (o layout de (publicas)). O layout
 * raiz não muda: a página em construção da produção continua com o título e a
 * descrição de hoje (decisão do Gabriel, Q5 (a) da pagina-processo-seletivo).
 */
import type { Metadata } from 'next'
import { PAGINAS_PUBLICAS } from './paginas-publicas'

/** O endereço oficial do site. O canônico de toda página parte dele. */
export const ENDERECO_DO_SITE = 'https://liacup.com.br'

/**
 * Monta os metadados da página do endereço dado. Endereço fora da lista lança
 * erro, e o erro aparece na compilação (`npm run build`), antes de ir ao ar.
 */
export function montarMetadados(endereco: string): Metadata {
  const pagina = PAGINAS_PUBLICAS.find((entrada) => entrada.endereco === endereco)
  if (!pagina) {
    throw new Error(
      `O endereço "${endereco}" não está na lista de páginas públicas ` +
        '(src/lib/utils/paginas-publicas.json). Acrescente a página à lista, com título e ' +
        'descrição, na mesma change que a cria.'
    )
  }

  return {
    metadataBase: new URL(ENDERECO_DO_SITE),
    // absolute: o título vai como está, sem modelo de título de nenhum layout.
    title: { absolute: pagina.titulo },
    description: pagina.descricao,
    alternates: { canonical: pagina.endereco },
    openGraph: {
      title: pagina.titulo,
      description: pagina.descricao,
      url: pagina.endereco,
      locale: 'pt_BR',
      type: 'website',
    },
  }
}
