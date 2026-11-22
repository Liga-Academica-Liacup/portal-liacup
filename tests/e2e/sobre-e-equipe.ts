/*
 * Apoio comum aos specs de /sobre e /equipe (pagina-sobre-e-equipe, design.md
 * D9, item 1). Não é spec: o Playwright só roda arquivos `*.spec.ts`.
 *
 * NENHUM TEXTO DAS PÁGINAS ESTÁ ESCRITO AQUI. Tudo é lido:
 *
 *   - do docs/conteudo-institucional.md: §2.1 a §2.6 (Sobre) e §4.1 a §4.3
 *     (docentes, fundadores e cargos), como o processo-seletivo.spec.ts faz;
 *   - do docs/REFERENCIA-VISUAL.md §7: os rótulos de interface que o Gabriel
 *     registrou (Q2 (b) e Q4 (a)) e o que a faixa do protótipo tinha e não vai
 *     ao ar;
 *   - do prototipo/Portal-LIACUP.html: o que o protótipo tinha de exemplo (os
 *     oito diretores inventados, os cinco objetivos e a frase da metamorfose),
 *     para o teste provar que nada disso foi ao ar sem copiar a lista aqui.
 *
 * Se o documento mudar, os specs acompanham. Se a leitura achar menos do que o
 * documento tem, o spec para com a contagem, em vez de conferir nada e ficar
 * verde (RP-12).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Page } from '@playwright/test'

const raiz = process.cwd()
const DOCUMENTO = readFileSync(join(raiz, 'docs', 'conteudo-institucional.md'), 'utf8')
const REFERENCIA = readFileSync(join(raiz, 'docs', 'REFERENCIA-VISUAL.md'), 'utf8')
const PROTOTIPO = readFileSync(join(raiz, 'prototipo', 'Portal-LIACUP.html'), 'utf8')

export const normalizar = (texto: string) => texto.replace(/\s+/g, ' ').trim()

/* O trecho do cabeçalho `inicio` até o próximo cabeçalho de nível igual ou maior. */
function secaoDoDocumento(inicio: string): string {
  const comeco = DOCUMENTO.indexOf(`\n${inicio}`)
  if (comeco === -1) throw new Error(`conteudo-institucional.md sem a seção "${inicio}"`)
  const nivel = /^#+/.exec(inicio)?.[0] ?? '###'
  const resto = DOCUMENTO.slice(comeco + 1)
  const proximo = resto.slice(inicio.length).search(new RegExp(`\\n#{1,${nivel.length}} `))
  return proximo === -1 ? resto : resto.slice(0, inicio.length + proximo)
}

/* A nota de fonte em itálico entre parênteses do fim de um parágrafo, como "_(Estatuto, Art. 2º)_". */
const NOTA_DE_FONTE = /\s*_\(([^)]*)\)_\s*$/

export type SecaoDoSobre = {
  numero: string
  nome: string
  paragrafos: string[]
  notas: string[]
}

/*
 * Uma seção do §2: o nome do cabeçalho, sem o "— **Sobre**" (Q3 (a)), e os
 * parágrafos da citação, separados pela linha ">" vazia. A nota de fonte do
 * fim sai do parágrafo e fica guardada à parte (Q10 (a)).
 */
function lerSecaoDoSobre(numero: string): SecaoDoSobre {
  const secao = secaoDoDocumento(`### ${numero}`)
  const cabecalho = secao.split('\n')[0] ?? ''
  const nome = normalizar(/^### [\d.]+\s+(.+?)\s+—\s+\*\*Sobre\*\*\s*$/.exec(cabecalho)?.[1] ?? '')
  if (!nome) throw new Error(`§${numero} sem o nome no cabeçalho "${cabecalho}"`)
  const paragrafos: string[] = []
  const notas: string[] = []
  let atual: string[] = []
  const fechar = () => {
    if (atual.length === 0) return
    const bruto = normalizar(atual.join(' '))
    const nota = NOTA_DE_FONTE.exec(bruto)
    if (nota) notas.push(`(${nota[1]})`)
    paragrafos.push(nota ? normalizar(bruto.slice(0, nota.index)) : bruto)
    atual = []
  }
  for (const linha of secao.split('\n').slice(1)) {
    if (!linha.startsWith('>')) {
      fechar()
      continue
    }
    const conteudo = linha.replace(/^>\s?/, '')
    if (conteudo.trim() === '') fechar()
    else atual.push(conteudo)
  }
  fechar()
  if (paragrafos.length === 0) throw new Error(`§${numero} sem parágrafo citado`)
  return { numero, nome, paragrafos, notas }
}

export type Docente = { nome: string; cargo: string; formacao: string }

/*
 * §4.1: "- **Nome** — Cargo. Formação." O cargo vai até o primeiro ". ", e a
 * formação é o resto (design.md, Riscos: com a Q6 (b), as duas linhas têm a
 * mesma forma). O spec imprime as três partes de cada docente.
 */
function lerDocentes(): Docente[] {
  const secao = secaoDoDocumento('### 4.1')
  return [...secao.matchAll(/^- \*\*(.+?)\*\* — (.+?)\. (.+)$/gm)].map((achado) => ({
    nome: normalizar(achado[1] ?? ''),
    cargo: normalizar(achado[2] ?? ''),
    formacao: normalizar(achado[3] ?? ''),
  }))
}

/*
 * A regra das iniciais do D6, escrita de novo aqui, de propósito, e não
 * importada do src: se a regra do src errar, o teste discorda dela. Tira toda
 * palavra que termina em ponto ("Profa.", "Dra."), junta a primeira letra da
 * primeira palavra que sobra e a da última, em maiúsculas.
 */
export function iniciaisPelaRegraDoD6(nome: string): string {
  const palavras = nome.split(/\s+/).filter((palavra) => palavra !== '' && !palavra.endsWith('.'))
  const primeira = palavras[0] ?? ''
  const ultima = palavras.length > 1 ? (palavras[palavras.length - 1] ?? '') : ''
  return `${Array.from(primeira)[0] ?? ''}${Array.from(ultima)[0] ?? ''}`.toLocaleUpperCase('pt-BR')
}

/* A linha de uma regra da REFERENCIA-VISUAL.md §7, pelo começo da célula "Tela". */
function linhaDaReferencia(tela: string): string {
  const linha = REFERENCIA.split('\n').find((linhaDaTabela) =>
    linhaDaTabela.startsWith(`| ${tela} |`)
  )
  if (!linha) throw new Error(`REFERENCIA-VISUAL.md §7 sem a linha "${tela}"`)
  return linha
}

function ler(padrao: RegExp, texto: string, nome: string): string {
  const achado = padrao.exec(texto)?.[1]
  if (!achado) throw new Error(`não achei ${nome}`)
  return normalizar(achado)
}

export type TituloDeBloco = { titulo: string; sobretitulo: string }

function lerReferencia() {
  const faixaDoSobre = linhaDaReferencia('Sobre, faixa do topo')
  const faixaDaEquipe = linhaDaReferencia('Equipe, faixa do topo')
  const titulos = linhaDaReferencia('Sobre e Equipe, títulos de seção')
  const sobre = ler(/Sobre: (.+?)\. Equipe:/, titulos, 'os títulos do Sobre na §7')
  const equipe = ler(/Equipe: (.+?)\. Títulos do protótipo/, titulos, 'os títulos da Equipe na §7')
  const blocosDoSobre: TituloDeBloco[] = [
    ...sobre.matchAll(/"([^"]+)" \((?:sobretítulo )?"([^"]+)"\)/g),
  ].map((achado) => ({ titulo: achado[1] ?? '', sobretitulo: achado[2] ?? '' }))
  const blocosDaEquipe: TituloDeBloco[] = [...equipe.matchAll(/"([^"]+)"/g)].map((achado) => ({
    titulo: achado[1] ?? '',
    sobretitulo: '',
  }))
  if (blocosDoSobre.length !== 3 || blocosDaEquipe.length !== 3) {
    throw new Error(
      `REFERENCIA-VISUAL.md §7: ${blocosDoSobre.length} títulos do Sobre e ${blocosDaEquipe.length} da Equipe, e não 3 e 3`
    )
  }
  return {
    sobre: {
      tituloPrincipal: ler(
        /Título principal "([^"]+)"/,
        faixaDoSobre,
        'o título principal do Sobre na §7'
      ),
      tituloDoPrototipo: ler(/O título "([^"]+)"/, faixaDoSobre, 'o título do protótipo na §7'),
      blocos: blocosDoSobre,
    },
    equipe: {
      sobretitulo: ler(/Sobretítulo "([^"]+)"/, faixaDaEquipe, 'o sobretítulo da Equipe na §7'),
      tituloPrincipal: ler(
        /título principal "([^"]+)"/,
        faixaDaEquipe,
        'o título principal da Equipe na §7'
      ),
      fraseDoPrototipo: ler(/sem a frase "([^"]+)"/, faixaDaEquipe, 'a frase da Equipe na §7'),
      blocos: blocosDaEquipe,
    },
  }
}

export type DiretorDeExemplo = { nome: string; cargo: string; curso: string }

/*
 * O que o protótipo tinha de exemplo, lido dele. O arquivo traz os dados num
 * JSON com as aspas escapadas com barra invertida e a barra como "u002F".
 */
function lerPrototipo(tituloAntigo: string) {
  const diretoria: DiretorDeExemplo[] = [
    ...PROTOTIPO.matchAll(
      /tipo: \\"Diretoria\\", nome: \\"([^"\\]+)\\", cargo: \\"([^"\\]+)\\", curso: \\"([^"\\]+)\\"/g
    ),
  ].map((achado) => ({ nome: achado[1] ?? '', cargo: achado[2] ?? '', curso: achado[3] ?? '' }))
  const blocoDosObjetivos = /objetivos: \[([\s\S]*?)\]/.exec(PROTOTIPO)?.[1] ?? ''
  const objetivos = [...blocoDosObjetivos.matchAll(/texto: \\"([^"\\]+)\\"/g)].map(
    (achado) => achado[1] ?? ''
  )
  const titulo = tituloAntigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const frase = new RegExp(`>${titulo}<\\\\u002Fh1>\\\\n\\s*<p[^>]*>([^<]+)<\\\\u002Fp>`).exec(
    PROTOTIPO
  )?.[1]
  if (diretoria.length !== 8 || objetivos.length !== 5 || !frase) {
    throw new Error(
      `protótipo: ${diretoria.length} diretores de exemplo, ${objetivos.length} objetivos e frase` +
        ` da faixa ${frase ? 'achada' : 'não achada'}, e não 8, 5 e achada`
    )
  }
  return { diretoria, objetivos, fraseDaMetamorfose: normalizar(frase) }
}

export type Cargo = { cargo: string; linha: string }

function lerDocumento() {
  const sobre = ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6'].map(lerSecaoDoSobre)
  const [apresentacao, historia, ...itens] = sobre
  if (!apresentacao || !historia || itens.length !== 4) throw new Error('§2.1 a §2.6 incompletas')

  const docentes = lerDocentes()
  const secaoDosFundadores = secaoDoDocumento('### 4.2')
  const tituloDosFundadores = ler(/^### 4\.2\s+(.+?)\s+_\(/, secaoDosFundadores, 'o título do §4.2')
  const linhaDosFundadores =
    secaoDosFundadores
      .split('\n')
      .slice(1)
      .find((linhaDaSecao) => linhaDaSecao.trim() !== '' && !linhaDaSecao.startsWith('#')) ?? ''
  const fundadores = linhaDosFundadores.split(' · ').map(normalizar).filter(Boolean)
  const cargos: Cargo[] = [
    ...secaoDoDocumento('### 4.3').matchAll(/^\|\s*[IVX]+\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/gm),
  ].map((achado) => ({ cargo: normalizar(achado[1] ?? ''), linha: normalizar(achado[2] ?? '') }))

  if (docentes.length !== 2 || fundadores.length !== 5 || cargos.length !== 6) {
    throw new Error(
      `§4: ${docentes.length} docentes, ${fundadores.length} fundadores e ${cargos.length} cargos lidos, e não 2, 5 e 6`
    )
  }
  return { apresentacao, historia, itens, docentes, tituloDosFundadores, fundadores, cargos }
}

export const DOC = lerDocumento()
export const ROTULOS = lerReferencia()
export const PROTOTIPO_DE_EXEMPLO = lerPrototipo(ROTULOS.sobre.tituloDoPrototipo)

/* ------------------------------------------------------------------------ */
/* A página                                                                  */
/* ------------------------------------------------------------------------ */

export type ItemLido = {
  titulo: string | null
  paragrafos: string[]
  decorativos: string[]
  texto: string
}

export type BlocoLido = {
  titulo: string
  nivel: number
  sobretitulo: string
  paragrafos: string[]
  tipoDaLista: string | null
  itens: ItemLido[]
}

/*
 * O que o <main> mostra, lido pela estrutura (h1, h2, listas, parágrafos), e
 * não por classe CSS. Cada bloco é o que vem de um h2 até o próximo, dentro da
 * <section> dele.
 */
export async function lerPagina(page: Page) {
  return page.evaluate(() => {
    const limpar = (texto: string | null | undefined) => (texto ?? '').replace(/\s+/g, ' ').trim()
    const main = document.querySelector('main')
    if (!main) throw new Error('a página não tem <main>')
    const titulosPrincipais = Array.from(main.querySelectorAll('h1'))
    const tituloPrincipal = titulosPrincipais[0]
    const faixa = tituloPrincipal?.closest('section') ?? null
    const anterior = tituloPrincipal?.previousElementSibling
    const blocos = Array.from(main.querySelectorAll('h2')).map((tituloDoBloco) => {
      const secao = tituloDoBloco.closest('section') ?? tituloDoBloco.parentElement
      const antes = tituloDoBloco.previousElementSibling
      const lista = secao?.querySelector('ul, ol') ?? null
      const vemDepois = (elemento: Element) =>
        tituloDoBloco.compareDocumentPosition(elemento) & Node.DOCUMENT_POSITION_FOLLOWING
      return {
        titulo: limpar(tituloDoBloco.textContent),
        nivel: 2,
        sobretitulo: antes?.tagName === 'P' ? limpar(antes.textContent) : '',
        paragrafos: Array.from(secao?.querySelectorAll('p') ?? [])
          .filter((paragrafo) => vemDepois(paragrafo) && !paragrafo.closest('li'))
          .map((paragrafo) => limpar(paragrafo.textContent)),
        tipoDaLista: lista ? lista.tagName.toLowerCase() : null,
        itens: Array.from(lista?.children ?? [])
          .filter((filho) => filho.tagName === 'LI')
          .map((itemDaLista) => ({
            titulo: itemDaLista.querySelector('h3')
              ? limpar(itemDaLista.querySelector('h3')?.textContent)
              : null,
            paragrafos: Array.from(itemDaLista.querySelectorAll('p')).map((paragrafo) =>
              limpar(paragrafo.textContent)
            ),
            decorativos: Array.from(itemDaLista.querySelectorAll('[aria-hidden="true"]')).map(
              (decorativo) => limpar(decorativo.textContent)
            ),
            texto: limpar(itemDaLista.textContent),
          })),
      }
    })
    /*
     * Todo nó de texto do <main>. Não é o innerText: ele aplica o
     * text-transform, e o sobretítulo "Objetivos" sairia "OBJETIVOS".
     */
    const partes: string[] = []
    const caminho = document.createTreeWalker(main, NodeFilter.SHOW_TEXT)
    for (let noDeTexto = caminho.nextNode(); noDeTexto; noDeTexto = caminho.nextNode()) {
      partes.push(noDeTexto.textContent ?? '')
    }
    return {
      titulosPrincipais: titulosPrincipais.map((titulo) => limpar(titulo.textContent)),
      sobretituloDaFaixa: anterior?.tagName === 'P' ? limpar(anterior.textContent) : '',
      paragrafosDaFaixa: Array.from(faixa?.querySelectorAll('p') ?? [])
        .filter((paragrafo) => paragrafo !== anterior)
        .map((paragrafo) => limpar(paragrafo.textContent)),
      blocos,
      textoDoConteudo: limpar(partes.join(' ')),
      imagens: main.querySelectorAll('img, picture, video, canvas').length,
    }
  })
}

/*
 * O texto que alguém lê na página inteira: os nós de texto do <body>, fora de
 * <script>, <style>, <noscript> e <template>. O JSON da lista única vai num
 * <script> e tem "semestre" (a descrição do Processo seletivo): ele não é
 * texto visível e não conta.
 */
export async function textoVisivelDaPagina(page: Page): Promise<string> {
  return page.evaluate(() => {
    const partes: string[] = []
    const caminho = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let noDeTexto = caminho.nextNode(); noDeTexto; noDeTexto = caminho.nextNode()) {
      if (noDeTexto.parentElement?.closest('script, style, noscript, template')) continue
      partes.push(noDeTexto.textContent ?? '')
    }
    return partes.join(' ').replace(/\s+/g, ' ')
  })
}

export type Trecho = { nome: string; esperado: string; recebido: string }

export function compararTrechos(trechos: Trecho[]): string[] {
  return trechos
    .filter((trecho) => trecho.recebido !== trecho.esperado)
    .map(
      (trecho) =>
        `trecho "${trecho.nome}" difere do documento:\n    esperado: "${trecho.esperado}"\n    recebido: "${trecho.recebido}"`
    )
}

/*
 * Tirado do texto do <main> cada esperado, uma vez cada, do mais longo ao mais
 * curto, o que sobra é texto que a composição escreveu por conta própria.
 */
export function sobraDoTexto(texto: string, esperados: string[]): string {
  let sobra = texto
  for (const esperado of [...esperados].sort(
    (primeiro, segundo) => segundo.length - primeiro.length
  )) {
    if (esperado) sobra = sobra.replace(esperado, ' ')
  }
  return normalizar(sobra)
}

/* ------------------------------------------------------------------------ */
/* As iniciais dos docentes                                                  */
/* ------------------------------------------------------------------------ */

export type MedidaDasIniciais = {
  visiveis: string[]
  foraDaArvoreNoDom: string[]
  naArvore: string[]
  contrastes: string[]
  falhas: string[]
}

/* Luminância relativa da WCAG 2. */
function luminancia([vermelho, verde, azul]: number[]) {
  const canal = (valor = 0) => {
    const fracao = valor / 255
    return fracao <= 0.03928 ? fracao / 12.92 : ((fracao + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * canal(vermelho) + 0.7152 * canal(verde) + 0.0722 * canal(azul)
}

function contraste(corDoTexto: number[], corDoFundo: number[]): number {
  const [clara = 0, escura = 0] = [luminancia(corDoTexto), luminancia(corDoFundo)].sort(
    (uma, outra) => outra - uma
  )
  return (clara + 0.05) / (escura + 0.05)
}

/*
 * As iniciais de cada docente na página: visíveis, fora da árvore de
 * acessibilidade e com contraste medido (RP-09).
 *
 *   - Visíveis: um elemento do <main> com exatamente as iniciais calculadas,
 *     com caixa e visível.
 *   - Fora da árvore: medido na árvore de acessibilidade do Chromium, pelo
 *     protocolo do DevTools, e não só pelo atributo: nenhum nó não ignorado
 *     tem as iniciais como nome. O atributo aria-hidden é conferido junto.
 *   - Contraste: a cor das iniciais contra o fundo do círculo, composto sobre
 *     a superfície opaca abaixo dele (o fundo do círculo é translúcido). O
 *     mínimo é 4,5:1; 3:1 só com 24 px, ou 18,66 px em negrito (texto grande).
 *     O registro nomeia as duas cores e a superfície.
 */
export async function medirIniciais(page: Page, iniciais: string[]): Promise<MedidaDasIniciais> {
  const medida: MedidaDasIniciais = {
    visiveis: [],
    foraDaArvoreNoDom: [],
    naArvore: [],
    contrastes: [],
    falhas: [],
  }
  const circulos = await page.evaluate((procuradas) => {
    const limpar = (texto: string | null) => (texto ?? '').replace(/\s+/g, ' ').trim()
    const cor = (texto: string) => {
      const achado = /rgba?\(([^)]+)\)/.exec(texto)
      const partes = (achado?.[1] ?? '')
        .split(/[\s,/]+/)
        .filter(Boolean)
        .map(Number)
      return [partes[0] ?? 0, partes[1] ?? 0, partes[2] ?? 0, partes[3] ?? 1]
    }
    const main = document.querySelector('main')
    return procuradas.map((iniciais) => {
      const achados = Array.from(main?.querySelectorAll<HTMLElement>('*') ?? []).filter(
        (candidato) => limpar(candidato.textContent) === iniciais && candidato.children.length === 0
      )
      const elemento = achados[0]
      if (!elemento) return { iniciais, achados: 0 }
      const caixa = elemento.getBoundingClientRect()
      /* As camadas de fundo do elemento para cima, até a primeira opaca. */
      const camadas: { cor: number[]; onde: string }[] = []
      for (let atual: Element | null = elemento; atual; atual = atual.parentElement) {
        const fundo = cor(getComputedStyle(atual).backgroundColor)
        if ((fundo[3] ?? 0) === 0) continue
        camadas.push({
          cor: fundo,
          onde: `<${atual.tagName.toLowerCase()} class="${String(atual.className)}">`,
        })
        if ((fundo[3] ?? 0) >= 1) break
      }
      const estilo = getComputedStyle(elemento)
      return {
        iniciais,
        achados: achados.length,
        visivel: elemento.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }),
        caixa: `${Math.round(caixa.width)}x${Math.round(caixa.height)}`,
        temCaixa: caixa.width > 0 && caixa.height > 0,
        foraDaArvore: elemento.closest('[aria-hidden="true"]') !== null,
        cor: cor(estilo.color),
        tamanho: parseFloat(estilo.fontSize),
        peso: Number(estilo.fontWeight) || 400,
        camadas,
      }
    })
  }, iniciais)

  for (const circulo of circulos) {
    if (!('cor' in circulo)) {
      medida.falhas.push(
        `iniciais "${circulo.iniciais}" não aparecem em nenhum elemento do conteúdo`
      )
      continue
    }
    if (circulo.achados !== 1)
      medida.falhas.push(`iniciais "${circulo.iniciais}" em ${circulo.achados} elementos, e não 1`)
    if (circulo.visivel && circulo.temCaixa)
      medida.visiveis.push(`${circulo.iniciais} (${circulo.caixa})`)
    else
      medida.falhas.push(
        `iniciais "${circulo.iniciais}" não estão visíveis (caixa ${circulo.caixa})`
      )
    if (circulo.foraDaArvore) medida.foraDaArvoreNoDom.push(circulo.iniciais)
    else
      medida.falhas.push(`iniciais "${circulo.iniciais}" fora de elemento com aria-hidden="true"`)

    /* Compõe do fundo opaco para cima. */
    const camadas = [...circulo.camadas].reverse()
    const base = camadas[0]
    if (!base || (base.cor[3] ?? 0) < 1) {
      medida.falhas.push(
        `iniciais "${circulo.iniciais}": nenhuma superfície opaca abaixo do círculo`
      )
      continue
    }
    let fundo = base.cor.slice(0, 3)
    for (const camada of camadas.slice(1)) {
      const alfa = camada.cor[3] ?? 1
      fundo = fundo.map((canal, indice) => alfa * (camada.cor[indice] ?? 0) + (1 - alfa) * canal)
    }
    const razao = contraste(circulo.cor, fundo)
    const grande = circulo.tamanho >= 24 || (circulo.tamanho >= 18.66 && circulo.peso >= 700)
    const minimo = grande ? 3 : 4.5
    const rgb = (valores: number[]) => `rgb(${valores.slice(0, 3).map(Math.round).join(', ')})`
    const linha =
      `${circulo.iniciais}: cor ${rgb(circulo.cor)} a ${circulo.tamanho}px peso ${circulo.peso}` +
      ` (${grande ? 'texto grande, mínimo 3:1' : 'texto normal, mínimo 4,5:1'})` +
      ` sobre o fundo do círculo ${camadas
        .slice(1)
        .map((camada) => `rgba(${camada.cor.join(', ')}) ${camada.onde}`)
        .join(' + ')}` +
      ` composto na superfície ${rgb(base.cor)} ${base.onde} = ${rgb(fundo)}: ${razao.toFixed(2)}:1`
    medida.contrastes.push(linha)
    if (razao < minimo) medida.falhas.push(`contraste abaixo de ${minimo}:1 · ${linha}`)
  }

  /* A árvore de acessibilidade do Chromium, inteira, pelo protocolo do DevTools. */
  const sessaoDoDevTools = await page.context().newCDPSession(page)
  try {
    await sessaoDoDevTools.send('Accessibility.enable')
    const { nodes: nosDaArvore } = await sessaoDoDevTools.send('Accessibility.getFullAXTree')
    for (const procurada of iniciais) {
      const nosComAsIniciais = nosDaArvore.filter(
        (noDaArvore) =>
          !noDaArvore.ignored && normalizar(String(noDaArvore.name?.value ?? '')) === procurada
      )
      for (const noDaArvore of nosComAsIniciais) {
        medida.naArvore.push(`${procurada} (papel ${String(noDaArvore.role?.value ?? '?')})`)
      }
    }
  } finally {
    await sessaoDoDevTools.detach()
  }
  for (const achado of medida.naArvore) {
    medida.falhas.push(`iniciais na árvore de acessibilidade: ${achado}`)
  }
  return medida
}
