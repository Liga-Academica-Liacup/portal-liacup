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
  return [...secao.matchAll(/^- \*\*(.+?)\*\* — (.+?)\. (.+)$/gm)].map((m) => ({
    nome: normalizar(m[1] ?? ''),
    cargo: normalizar(m[2] ?? ''),
    formacao: normalizar(m[3] ?? ''),
  }))
}

/*
 * A regra das iniciais do D6, escrita de novo aqui, de propósito, e não
 * importada do src: se a regra do src errar, o teste discorda dela. Tira toda
 * palavra que termina em ponto ("Profa.", "Dra."), junta a primeira letra da
 * primeira palavra que sobra e a da última, em maiúsculas.
 */
export function iniciaisPelaRegraDoD6(nome: string): string {
  const palavras = nome.split(/\s+/).filter((p) => p !== '' && !p.endsWith('.'))
  const primeira = palavras[0] ?? ''
  const ultima = palavras.length > 1 ? (palavras[palavras.length - 1] ?? '') : ''
  return `${Array.from(primeira)[0] ?? ''}${Array.from(ultima)[0] ?? ''}`.toLocaleUpperCase('pt-BR')
}

/* A linha de uma regra da REFERENCIA-VISUAL.md §7, pelo começo da célula "Tela". */
function linhaDaReferencia(tela: string): string {
  const linha = REFERENCIA.split('\n').find((l) => l.startsWith(`| ${tela} |`))
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
  ].map((m) => ({ titulo: m[1] ?? '', sobretitulo: m[2] ?? '' }))
  const blocosDaEquipe: TituloDeBloco[] = [...equipe.matchAll(/"([^"]+)"/g)].map((m) => ({
    titulo: m[1] ?? '',
    sobretitulo: '',
  }))
  if (blocosDoSobre.length !== 3 || blocosDaEquipe.length !== 3) {
    throw new Error(
      `REFERENCIA-VISUAL.md §7: ${blocosDoSobre.length} títulos do Sobre e ${blocosDaEquipe.length} da Equipe, e não 3 e 3`
    )
  }
  return {
    sobre: {
      h1: ler(/Título principal "([^"]+)"/, faixaDoSobre, 'o título principal do Sobre na §7'),
      tituloDoPrototipo: ler(/O título "([^"]+)"/, faixaDoSobre, 'o título do protótipo na §7'),
      blocos: blocosDoSobre,
    },
    equipe: {
      sobretitulo: ler(/Sobretítulo "([^"]+)"/, faixaDaEquipe, 'o sobretítulo da Equipe na §7'),
      h1: ler(/título principal "([^"]+)"/, faixaDaEquipe, 'o título principal da Equipe na §7'),
      fraseDoPrototipo: ler(/sem a frase "([^"]+)"/, faixaDaEquipe, 'a frase da Equipe na §7'),
      blocos: blocosDaEquipe,
    },
  }
}

export type DiretorDeExemplo = { nome: string; cargo: string; curso: string }

/*
 * O que o protótipo tinha de exemplo, lido dele. O arquivo traz os dados num
 * JSON com as aspas escapadas (\") e a barra como /.
 */
function lerPrototipo(tituloAntigo: string) {
  const diretoria: DiretorDeExemplo[] = [
    ...PROTOTIPO.matchAll(
      /tipo: \\"Diretoria\\", nome: \\"([^"\\]+)\\", cargo: \\"([^"\\]+)\\", curso: \\"([^"\\]+)\\"/g
    ),
  ].map((m) => ({ nome: m[1] ?? '', cargo: m[2] ?? '', curso: m[3] ?? '' }))
  const blocoDosObjetivos = /objetivos: \[([\s\S]*?)\]/.exec(PROTOTIPO)?.[1] ?? ''
  const objetivos = [...blocoDosObjetivos.matchAll(/texto: \\"([^"\\]+)\\"/g)].map(
    (m) => m[1] ?? ''
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
  const s42 = secaoDoDocumento('### 4.2')
  const tituloDo42 = ler(/^### 4\.2\s+(.+?)\s+_\(/, s42, 'o título do §4.2')
  const linhaDosFundadores =
    s42
      .split('\n')
      .slice(1)
      .find((l) => l.trim() !== '' && !l.startsWith('#')) ?? ''
  const fundadores = linhaDosFundadores.split(' · ').map(normalizar).filter(Boolean)
  const cargos: Cargo[] = [
    ...secaoDoDocumento('### 4.3').matchAll(/^\|\s*[IVX]+\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/gm),
  ].map((m) => ({ cargo: normalizar(m[1] ?? ''), linha: normalizar(m[2] ?? '') }))

  if (docentes.length !== 2 || fundadores.length !== 5 || cargos.length !== 6) {
    throw new Error(
      `§4: ${docentes.length} docentes, ${fundadores.length} fundadores e ${cargos.length} cargos lidos, e não 2, 5 e 6`
    )
  }
  return { apresentacao, historia, itens, docentes, tituloDo42, fundadores, cargos }
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
    const n = (t: string | null | undefined) => (t ?? '').replace(/\s+/g, ' ').trim()
    const main = document.querySelector('main')
    if (!main) throw new Error('a página não tem <main>')
    const h1s = Array.from(main.querySelectorAll('h1'))
    const h1 = h1s[0]
    const faixa = h1?.closest('section') ?? null
    const anterior = h1?.previousElementSibling
    const blocos = Array.from(main.querySelectorAll('h2')).map((h2) => {
      const secao = h2.closest('section') ?? h2.parentElement
      const antes = h2.previousElementSibling
      const lista = secao?.querySelector('ul, ol') ?? null
      const depois = (el: Element) =>
        h2.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
      return {
        titulo: n(h2.textContent),
        nivel: 2,
        sobretitulo: antes?.tagName === 'P' ? n(antes.textContent) : '',
        paragrafos: Array.from(secao?.querySelectorAll('p') ?? [])
          .filter((p) => depois(p) && !p.closest('li'))
          .map((p) => n(p.textContent)),
        tipoDaLista: lista ? lista.tagName.toLowerCase() : null,
        itens: Array.from(lista?.children ?? [])
          .filter((li) => li.tagName === 'LI')
          .map((li) => ({
            titulo: li.querySelector('h3') ? n(li.querySelector('h3')?.textContent) : null,
            paragrafos: Array.from(li.querySelectorAll('p')).map((p) => n(p.textContent)),
            decorativos: Array.from(li.querySelectorAll('[aria-hidden="true"]')).map((e) =>
              n(e.textContent)
            ),
            texto: n(li.textContent),
          })),
      }
    })
    /*
     * Todo nó de texto do <main>. Não é o innerText: ele aplica o
     * text-transform, e o sobretítulo "Objetivos" sairia "OBJETIVOS".
     */
    const partes: string[] = []
    const caminho = document.createTreeWalker(main, NodeFilter.SHOW_TEXT)
    for (let no = caminho.nextNode(); no; no = caminho.nextNode()) partes.push(no.textContent ?? '')
    return {
      h1s: h1s.map((h) => n(h.textContent)),
      sobretituloDaFaixa: anterior?.tagName === 'P' ? n(anterior.textContent) : '',
      paragrafosDaFaixa: Array.from(faixa?.querySelectorAll('p') ?? [])
        .filter((p) => p !== anterior)
        .map((p) => n(p.textContent)),
      blocos,
      textoDoConteudo: n(partes.join(' ')),
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
    for (let no = caminho.nextNode(); no; no = caminho.nextNode()) {
      if (no.parentElement?.closest('script, style, noscript, template')) continue
      partes.push(no.textContent ?? '')
    }
    return partes.join(' ').replace(/\s+/g, ' ')
  })
}

export type Trecho = { nome: string; esperado: string; recebido: string }

export function compararTrechos(trechos: Trecho[]): string[] {
  return trechos
    .filter((t) => t.recebido !== t.esperado)
    .map(
      (t) =>
        `trecho "${t.nome}" difere do documento:\n    esperado: "${t.esperado}"\n    recebido: "${t.recebido}"`
    )
}

/*
 * Tirado do texto do <main> cada esperado, uma vez cada, do mais longo ao mais
 * curto, o que sobra é texto que a composição escreveu por conta própria.
 */
export function sobraDoTexto(texto: string, esperados: string[]): string {
  let sobra = texto
  for (const esperado of [...esperados].sort((a, b) => b.length - a.length)) {
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
function luminancia([r, g, b]: number[]) {
  const canal = (valor = 0) => {
    const c = valor / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
}

function contraste(a: number[], b: number[]): number {
  const [clara = 0, escura = 0] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
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
    const n = (t: string | null) => (t ?? '').replace(/\s+/g, ' ').trim()
    const cor = (texto: string) => {
      const m = /rgba?\(([^)]+)\)/.exec(texto)
      const partes = (m?.[1] ?? '')
        .split(/[\s,/]+/)
        .filter(Boolean)
        .map(Number)
      return [partes[0] ?? 0, partes[1] ?? 0, partes[2] ?? 0, partes[3] ?? 1]
    }
    const main = document.querySelector('main')
    return procuradas.map((iniciais) => {
      const achados = Array.from(main?.querySelectorAll<HTMLElement>('*') ?? []).filter(
        (e) => n(e.textContent) === iniciais && e.children.length === 0
      )
      const e = achados[0]
      if (!e) return { iniciais, achados: 0 }
      const caixa = e.getBoundingClientRect()
      /* As camadas de fundo do elemento para cima, até a primeira opaca. */
      const camadas: { cor: number[]; onde: string }[] = []
      for (let atual: Element | null = e; atual; atual = atual.parentElement) {
        const fundo = cor(getComputedStyle(atual).backgroundColor)
        if ((fundo[3] ?? 0) === 0) continue
        camadas.push({
          cor: fundo,
          onde: `<${atual.tagName.toLowerCase()} class="${String(atual.className)}">`,
        })
        if ((fundo[3] ?? 0) >= 1) break
      }
      const estilo = getComputedStyle(e)
      return {
        iniciais,
        achados: achados.length,
        visivel: e.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }),
        caixa: `${Math.round(caixa.width)}x${Math.round(caixa.height)}`,
        temCaixa: caixa.width > 0 && caixa.height > 0,
        foraDaArvore: e.closest('[aria-hidden="true"]') !== null,
        cor: cor(estilo.color),
        tamanho: parseFloat(estilo.fontSize),
        peso: Number(estilo.fontWeight) || 400,
        camadas,
      }
    })
  }, iniciais)

  for (const c of circulos) {
    if (!('cor' in c)) {
      medida.falhas.push(`iniciais "${c.iniciais}" não aparecem em nenhum elemento do conteúdo`)
      continue
    }
    if (c.achados !== 1)
      medida.falhas.push(`iniciais "${c.iniciais}" em ${c.achados} elementos, e não 1`)
    if (c.visivel && c.temCaixa) medida.visiveis.push(`${c.iniciais} (${c.caixa})`)
    else medida.falhas.push(`iniciais "${c.iniciais}" não estão visíveis (caixa ${c.caixa})`)
    if (c.foraDaArvore) medida.foraDaArvoreNoDom.push(c.iniciais)
    else medida.falhas.push(`iniciais "${c.iniciais}" fora de elemento com aria-hidden="true"`)

    /* Compõe do fundo opaco para cima. */
    const camadas = [...c.camadas].reverse()
    const base = camadas[0]
    if (!base || (base.cor[3] ?? 0) < 1) {
      medida.falhas.push(`iniciais "${c.iniciais}": nenhuma superfície opaca abaixo do círculo`)
      continue
    }
    let fundo = base.cor.slice(0, 3)
    for (const camada of camadas.slice(1)) {
      const alfa = camada.cor[3] ?? 1
      fundo = fundo.map((canal, i) => alfa * (camada.cor[i] ?? 0) + (1 - alfa) * canal)
    }
    const razao = contraste(c.cor, fundo)
    const grande = c.tamanho >= 24 || (c.tamanho >= 18.66 && c.peso >= 700)
    const minimo = grande ? 3 : 4.5
    const rgb = (v: number[]) => `rgb(${v.slice(0, 3).map(Math.round).join(', ')})`
    const linha =
      `${c.iniciais}: cor ${rgb(c.cor)} a ${c.tamanho}px peso ${c.peso}` +
      ` (${grande ? 'texto grande, mínimo 3:1' : 'texto normal, mínimo 4,5:1'})` +
      ` sobre o fundo do círculo ${camadas
        .slice(1)
        .map((k) => `rgba(${k.cor.join(', ')}) ${k.onde}`)
        .join(' + ')}` +
      ` composto na superfície ${rgb(base.cor)} ${base.onde} = ${rgb(fundo)}: ${razao.toFixed(2)}:1`
    medida.contrastes.push(linha)
    if (razao < minimo) medida.falhas.push(`contraste abaixo de ${minimo}:1 · ${linha}`)
  }

  /* A árvore de acessibilidade do Chromium, inteira. */
  const cdp = await page.context().newCDPSession(page)
  try {
    await cdp.send('Accessibility.enable')
    const { nodes } = await cdp.send('Accessibility.getFullAXTree')
    for (const procurada of iniciais) {
      const nos = nodes.filter(
        (no) => !no.ignored && normalizar(String(no.name?.value ?? '')) === procurada
      )
      for (const no of nos) {
        medida.naArvore.push(`${procurada} (papel ${String(no.role?.value ?? '?')})`)
      }
    }
  } finally {
    await cdp.detach()
  }
  for (const achado of medida.naArvore) {
    medida.falhas.push(`iniciais na árvore de acessibilidade: ${achado}`)
  }
  return medida
}
