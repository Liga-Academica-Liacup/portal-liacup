#!/usr/bin/env node
/*
 * Tira os prints do protótipo aprovado pela liga: o gabarito contra o qual toda
 * tela do site é conferida. Roda com `npm run prints:prototipo`.
 *
 * Por que existe: os prints antigos foram tirados à mão, e ninguém conseguia
 * refazê-los do mesmo jeito. Este script abre o arquivo do protótipo direto do
 * disco, sem rede, e tira sempre os mesmos 23 prints, com os mesmos nomes.
 *
 * Como ele anda pelo protótipo: o protótipo não tem endereço por página (todo
 * link é "#"), então o script clica no cabeçalho, como uma pessoa faria, e só
 * tira o print depois de ver o título (<h1>) da página certa na tela.
 *
 * Ver openspec/changes/prototipo-no-repositorio/design.md, decisões D3 a D5.
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

// Os caminhos partem da raiz do projeto, e não da pasta onde o comando foi
// digitado, para o script funcionar de qualquer lugar.
const raiz = fileURLToPath(new URL('..', import.meta.url))
const enderecoDoPrototipo = pathToFileURL(join(raiz, 'prototipo', 'Portal-LIACUP.html')).href
const pastaDosPrints = join(raiz, 'prototipo', 'prints')

/*
 * A lista é escrita à mão, de propósito: os nomes dos arquivos são fixos e não
 * dependem do que está no HTML. É isso que garante os mesmos nomes sempre.
 * Contato fica por último porque o menu aberto é tirado sobre ela.
 */
const paginas = [
  { arquivo: 'inicio', rotulo: 'Início', titulo: 'Cuidar é o ato mais sublime da conexão humana' },
  { arquivo: 'sobre', rotulo: 'Sobre', titulo: 'A borboleta não é enfeite' },
  { arquivo: 'noticias', rotulo: 'Notícias', titulo: 'O que a Liga tem feito' },
  {
    arquivo: 'conteudo-educativo',
    rotulo: 'Conteúdo educativo',
    titulo: 'Perguntas que a gente ouve o tempo todo',
  },
  { arquivo: 'eventos', rotulo: 'Eventos', titulo: 'Agenda da Liga' },
  { arquivo: 'projetos', rotulo: 'Projetos', titulo: 'Ensino, Extensão, Pesquisa e Secretaria' },
  { arquivo: 'materiais', rotulo: 'Materiais', titulo: 'Biblioteca da Liga' },
  { arquivo: 'equipe', rotulo: 'Equipe', titulo: 'Quem faz a LIACUP' },
  { arquivo: 'galeria', rotulo: 'Galeria', titulo: 'Registros' },
  // Processo seletivo não está no menu: abre pelo botão de destaque do cabeçalho.
  {
    arquivo: 'processo-seletivo',
    rotulo: 'Processo seletivo',
    titulo: 'Processo seletivo 2026.2',
    botaoDeDestaque: true,
  },
  { arquivo: 'contato', rotulo: 'Contato', titulo: 'Fale com a Liga' },
]

const larguraGrande = { width: 1280, height: 800 }
const larguraCelular = { width: 390, height: 844 }

// Os 23 nomes que o script gera: dois por página e o menu aberto.
const nomesEsperados = [
  ...paginas.flatMap((pagina) => [`${pagina.arquivo}-1280.png`, `${pagina.arquivo}-390.png`]),
  'menu-aberto-390.png',
]

// Quanto tempo esperar pelo título de uma página antes de contá-la como falta.
const esperaPeloTitulo = 5000

/*
 * O protótipo anima a entrada da página e faz as borboletas voarem sem parar, e
 * não desliga isso quando o sistema pede menos movimento. Esta folha de estilo
 * desliga toda animação e transição, para nenhum print sair no meio de uma.
 */
const semAnimacao = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
`

// Espera tudo o que muda a aparência da página: fontes e imagens carregadas.
async function esperarPaginaPronta(pagina) {
  await pagina.evaluate(() => document.fonts.ready.then(() => true))
  await pagina.waitForFunction(() => [...document.images].every((imagem) => imagem.complete))
  await pagina.evaluate(() => window.scrollTo(0, 0))
}

async function tirarPrint(pagina, nome, paginaInteira) {
  await esperarPaginaPronta(pagina)
  await pagina.screenshot({
    path: join(pastaDosPrints, nome),
    fullPage: paginaInteira,
    animations: 'disabled',
    caret: 'hide',
  })
}

// Clica no cabeçalho e espera o título da página. Devolve o título encontrado.
async function abrir(pagina, { rotulo, titulo, botaoDeDestaque }) {
  const cabecalho = pagina.locator('header')
  const link = botaoDeDestaque
    ? cabecalho.getByRole('link', { name: rotulo, exact: true })
    : cabecalho
        .getByRole('navigation', { name: 'Navegação principal' })
        .getByRole('link', { name: rotulo, exact: true })
  await link.click()
  // Tira o ponteiro de cima do link clicado: senão o print mostra o botão no
  // estado de "mouse em cima", e não em repouso. O canto (0, 0) fica fora de
  // qualquer link nas duas larguras.
  await pagina.mouse.move(0, 0)

  const tituloNaTela = pagina.getByRole('heading', { level: 1, name: titulo, exact: true })
  await tituloNaTela.waitFor({ state: 'visible', timeout: esperaPeloTitulo })
  return (await tituloNaTela.innerText()).trim()
}

// O menu lateral aberto, em 390 px, só a área visível da tela.
async function tirarPrintDoMenu(pagina) {
  await pagina.setViewportSize(larguraCelular)
  await pagina.getByRole('button', { name: 'Abrir menu de navegação' }).click()
  await pagina.mouse.move(0, 0)
  await pagina.locator('#menu-mobile').waitFor({ state: 'visible', timeout: esperaPeloTitulo })
  await tirarPrint(pagina, 'menu-aberto-390.png', false)
}

const gerados = []
const navegador = await chromium.launch()

try {
  // Navegador novo a cada execução, sem rede, com tamanho e escala fixos.
  const contexto = await navegador.newContext({
    viewport: larguraGrande,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    offline: true,
  })
  const pagina = await contexto.newPage()
  await pagina.goto(enderecoDoPrototipo)
  await pagina.addStyleTag({ content: semAnimacao })

  for (const item of paginas) {
    try {
      await pagina.setViewportSize(larguraGrande)
      const encontrado = await abrir(pagina, item)
      await tirarPrint(pagina, `${item.arquivo}-1280.png`, true)
      gerados.push(`${item.arquivo}-1280.png`)

      await pagina.setViewportSize(larguraCelular)
      await tirarPrint(pagina, `${item.arquivo}-390.png`, true)
      gerados.push(`${item.arquivo}-390.png`)

      console.log(`ok     ${item.arquivo} — título encontrado: "${encontrado}"`)
    } catch {
      // Uma página que falha não interrompe as outras: a saída mostra todas as faltas.
      console.log(`falhou ${item.arquivo} — título "${item.titulo}" não apareceu na tela`)
    }
  }

  try {
    await tirarPrintDoMenu(pagina)
    gerados.push('menu-aberto-390.png')
    console.log('ok     menu-aberto-390 — menu lateral aberto sobre Contato')
  } catch {
    console.log('falhou menu-aberto-390 — o menu lateral não abriu')
  }
} finally {
  await navegador.close()
}

// O contador (RP-12): quanto gerou, de quanto esperava, e o que faltou.
const faltaram = nomesEsperados.filter((nome) => !gerados.includes(nome))
console.log(`\ngerados: ${gerados.length} de ${nomesEsperados.length}`)
for (const nome of faltaram) console.log(`  faltou: ${nome}`)

// Imagens na pasta que o script não gera. Ele não apaga nenhuma: isso é decisão
// de uma pessoa. Só diz qual é.
const estranhos = readdirSync(pastaDosPrints).filter(
  (nome) => nome.toLowerCase().endsWith('.png') && !nomesEsperados.includes(nome)
)
console.log(`estranhos: ${estranhos.length}`)
for (const nome of estranhos) console.log(`  estranho: ${nome}`)

if (faltaram.length > 0 || estranhos.length > 0) process.exitCode = 1
