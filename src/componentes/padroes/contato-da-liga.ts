/*
 * OS DADOS DE CONTATO DA LIGA, NUM LUGAR SÓ
 *
 * Para quem não programa: o Instagram, o e-mail e o endereço que aparecem nos
 * quadros de contato moram aqui, e só aqui. A página Contato usa os três; a
 * inicial vai usar o Instagram e o e-mail. Para trocar um dado, troque aqui.
 * Nenhum componente precisa mudar.
 *
 * De onde vem cada dado (design.md da change pagina-contato, "Fontes do texto
 * que vai ao ar"):
 *   - o @ do Instagram, o e-mail e o endereço: docs/conteudo-institucional.md,
 *     seção 1, células "Instagram", "E-mail" e "Sede", palavra por palavra. No
 *     endereço, o travessão do documento vira " · " (Q2 (b) do Gabriel,
 *     23/11/2026; REFERENCIA-VISUAL.md, seção 5);
 *   - o endereço do perfil do Instagram: REFERENCIA-VISUAL.md, seção 7;
 *   - "Instagram", "E-mail" e "Onde estamos": rótulos de interface, registrados
 *     na REFERENCIA-VISUAL.md, seção 7, linha "Contato, página".
 *
 * Dívida conhecida (design.md, D1): o rodapé e a página em construção ainda
 * escrevem os mesmos dados por conta própria, e não leem daqui.
 *
 * Quem confere este arquivo é o `ListaDeContatos.test.tsx`: travessão,
 * `liacup@unb.br`, "Darcy Ribeiro" ou "Faculdade de Medicina" em qualquer
 * texto deixam `npm test` vermelho. Se o texto bate com o documento, quem
 * confere é o teste de ponta a ponta, que lê o documento.
 */

export type CanalDeContato = {
  /** O rótulo em maiúsculas pequenas, acima do dado. */
  readonly rotulo: string
  /** O dado escrito na tela, para quem quiser copiar. */
  readonly valor: string
}

export const CONTATO_DA_LIGA = {
  instagram: {
    rotulo: 'Instagram',
    valor: '@liacup.unb',
    endereco: 'https://www.instagram.com/liacup.unb/',
  },
  email: {
    rotulo: 'E-mail',
    valor: 'liacup.unb@gmail.com',
  },
  sede: {
    rotulo: 'Onde estamos',
    valor:
      'FCTS · Campus UnB Ceilândia, QNN 14 Área Especial, Ceilândia Sul, CEP 72220-140, Brasília/DF',
  },
} as const satisfies {
  instagram: CanalDeContato & { readonly endereco: string }
  email: CanalDeContato
  sede: CanalDeContato
}
