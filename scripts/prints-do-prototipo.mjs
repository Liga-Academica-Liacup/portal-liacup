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
 * Duas palavras, para não confundir: "aba" é a aba do navegador que o script
 * controla; "página" é uma página do protótipo (Início, Sobre, Contato...).
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
    usaBotaoDeDestaque: true,
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
 * As borboletas do protótipo voam com a animação `voa`, que começa e termina
 * inclinada a -8° e passa por -2° no meio: -8° é a pose de repouso. Todo print
 * tem que mostrar as borboletas a -8°. A tolerância cobre só o arredondamento
 * da conta, não uma pose "mais ou menos": -2°, o meio do voo, fica bem fora.
 */
const animacaoDasBorboletas = 'voa'
const poseDeRepouso = -8
const tolerancia = 0.5

/*
 * Esta folha de estilo desliga as transições e o cursor de texto. As animações
 * não são desligadas aqui: desligadas, as borboletas ficariam retas, a 0°, uma
 * pose que o protótipo nunca mostra. Quem cuida delas é congelarAnimacoes().
 * O `!important` é para vencer o estilo do próprio protótipo, que é de terceiro
 * e não se edita (docs/PADROES-DE-CODIGO.md, seção 3).
 */
const semTransicao = `
  *, *::before, *::after {
    transition: none !important;
    caret-color: transparent !important;
  }
`

/*
 * Espera o navegador desenhar a tela duas vezes. Depois de trocar de página ou
 * de largura, o desenho não fica pronto na hora. Sem esta espera, o print às
 * vezes saía antes do fim: em Notícias, a 390 px, o espaço da foto do 2º card
 * vinha sem o contorno e sem o texto, em cerca de metade das vezes.
 */
async function esperarDesenho(aba) {
  await aba.evaluate(
    () => new Promise((pronto) => requestAnimationFrame(() => requestAnimationFrame(pronto)))
  )
}

// Troca a largura da janela e espera o navegador redesenhar a página nela.
async function mudarLargura(aba, tamanho) {
  await aba.setViewportSize(tamanho)
  await esperarDesenho(aba)
}

/*
 * Obriga o navegador a desenhar a página inteira de novo. Ao trocar de página,
 * ele só redesenha o que mudou, e às vezes sobrava um resto da página anterior:
 * em Sobre, a 1280 px, um pixel da marca de "página atual" de Início aparecia
 * em umas execuções e não em outras. Esconder a página por dois quadros e
 * mostrá-la de novo apaga esse resto.
 */
async function redesenharTudo(aba) {
  await aba.evaluate(() => document.documentElement.style.setProperty('visibility', 'hidden'))
  await esperarDesenho(aba)
  await aba.evaluate(() => document.documentElement.style.removeProperty('visibility'))
  await esperarDesenho(aba)
}

// Espera tudo o que muda a aparência da página: fontes, imagens e o desenho.
async function esperarPaginaPronta(aba) {
  await aba.evaluate(() => document.fonts.ready.then(() => true))
  await aba.waitForFunction(() => [...document.images].every((imagem) => imagem.complete))
  await aba.evaluate(() => window.scrollTo(0, 0))
  await redesenharTudo(aba)
}

/*
 * Para as animações num ponto fixo antes do print, para todo print sair igual.
 * - As que têm fim (a entrada da página, a gaveta do menu) vão até o fim.
 * - As que não têm fim (o voo das borboletas) param no começo do primeiro
 *   ciclo, onde a borboleta está a -8°. Uma das borboletas espera 0,8 s antes
 *   de começar a voar; por isso cada uma para no próprio atraso, e não no
 *   tempo zero: no tempo zero essa borboleta ainda estaria reta, a 0°.
 */
async function congelarAnimacoes(aba) {
  await aba.evaluate(() => {
    for (const animacao of document.getAnimations()) {
      const tempo = animacao.effect.getComputedTiming()
      if (tempo.iterations === Infinity) {
        animacao.pause()
        animacao.currentTime = tempo.delay
      } else {
        animacao.finish()
      }
    }
  })
}

/*
 * Acha as borboletas pela marcação do protótipo — todo elemento que declara a
 * animação `voa` no próprio HTML —, esteja a animação rodando ou não. Assim,
 * se alguém (ou o próprio protótipo) desligar o voo, a borboleta continua na
 * conta, aparece reta e reprova. Só entram as que aparecem nesta largura: o
 * protótipo esconde uma delas no celular, e ela não está no print.
 * Devolve o ângulo de cada uma, lido no estilo calculado pelo navegador.
 */
async function angulosDasBorboletas(aba) {
  return aba.evaluate((nomeDaAnimacao) => {
    const borboletas = [...document.querySelectorAll('[style]')].filter(
      (elemento) =>
        elemento.style.animationName
          .split(',')
          .map((nome) => nome.trim())
          .includes(nomeDaAnimacao) && elemento.checkVisibility()
    )
    return borboletas.map((borboleta) => {
      const matriz = new DOMMatrixReadOnly(getComputedStyle(borboleta).transform)
      return (Math.atan2(matriz.b, matriz.a) * 180) / Math.PI
    })
  }, animacaoDasBorboletas)
}

// Confere a pose das borboletas no momento do print e anota quem saiu dela.
async function conferirBorboletas(aba, nome) {
  const angulos = await angulosDasBorboletas(aba)
  totalDeBorboletas += angulos.length
  const naPose = angulos.filter((angulo) => Math.abs(angulo - poseDeRepouso) <= tolerancia)
  let linha = `       ${nome} · borboletas: ${naPose.length} de ${angulos.length} a ${poseDeRepouso}°`
  if (naPose.length < angulos.length) {
    foraDaPose.push(nome)
    linha += ` (medido: ${angulos.map((angulo) => `${angulo.toFixed(1)}°`).join(', ')})`
  }
  console.log(linha)
}

async function tirarPrint(aba, nome, ehPaginaInteira) {
  await esperarPaginaPronta(aba)
  await congelarAnimacoes(aba)
  await conferirBorboletas(aba, nome)
  /*
   * 'allow' é obrigatório. As animações já estão congeladas, e a conferência
   * das borboletas roda ANTES do print: ela não enxergaria uma opção que
   * mexesse nas animações durante a captura. Com 'disabled', o Playwright
   * cancelaria o voo depois da conferência, e as borboletas sairiam retas, a
   * 0°, com a conferência dizendo que estava tudo certo.
   */
  await aba.screenshot({
    path: join(pastaDosPrints, nome),
    fullPage: ehPaginaInteira,
    animations: 'allow',
    caret: 'hide',
  })
}

// Clica no cabeçalho e espera o título da página. Devolve o título encontrado.
async function abrir(aba, { rotulo, titulo, usaBotaoDeDestaque }) {
  const cabecalho = aba.locator('header')
  const link = usaBotaoDeDestaque
    ? cabecalho.getByRole('link', { name: rotulo, exact: true })
    : cabecalho
        .getByRole('navigation', { name: 'Navegação principal' })
        .getByRole('link', { name: rotulo, exact: true })
  await link.click()
  // Tira o ponteiro de cima do link clicado: senão o print mostra o botão no
  // estado de "mouse em cima", e não em repouso. O canto (0, 0) fica fora de
  // qualquer link nas duas larguras.
  await aba.mouse.move(0, 0)

  const tituloNaTela = aba.getByRole('heading', { level: 1, name: titulo, exact: true })
  await tituloNaTela.waitFor({ state: 'visible', timeout: esperaPeloTitulo })
  return (await tituloNaTela.innerText()).trim()
}

// A primeira linha da mensagem de erro, para a saída dizer o que aconteceu.
function resumoDoErro(erro) {
  return String(erro?.message ?? erro).split('\n')[0]
}

const gerados = []
const foraDaPose = []
let totalDeBorboletas = 0
const navegador = await chromium.launch()

try {
  // Navegador novo a cada execução, sem rede, com tamanho e escala fixos.
  const contexto = await navegador.newContext({
    viewport: larguraGrande,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    offline: true,
  })
  const aba = await contexto.newPage()
  await aba.goto(enderecoDoPrototipo)
  await aba.addStyleTag({ content: semTransicao })

  for (const pagina of paginas) {
    // O que o script está fazendo agora. Se algo der errado, a saída diz qual
    // passo falhou, e não sempre "título não apareceu".
    let passo = `o título "${pagina.titulo}" não apareceu na tela`
    try {
      await mudarLargura(aba, larguraGrande)
      const encontrado = await abrir(aba, pagina)
      console.log(`ok     ${pagina.arquivo} — título encontrado: "${encontrado}"`)

      passo = `o print ${pagina.arquivo}-1280.png não foi tirado`
      await tirarPrint(aba, `${pagina.arquivo}-1280.png`, true)
      gerados.push(`${pagina.arquivo}-1280.png`)

      passo = `o print ${pagina.arquivo}-390.png não foi tirado`
      await mudarLargura(aba, larguraCelular)
      await tirarPrint(aba, `${pagina.arquivo}-390.png`, true)
      gerados.push(`${pagina.arquivo}-390.png`)
    } catch (erro) {
      // Uma página que falha não interrompe as outras: a saída mostra todas as faltas.
      console.log(`falhou ${pagina.arquivo} — ${passo} (${resumoDoErro(erro)})`)
    }
  }

  // O menu lateral aberto, em 390 px, sobre Contato, só a área visível da tela.
  let passo = 'o menu lateral não abriu'
  try {
    await mudarLargura(aba, larguraCelular)
    await aba.getByRole('button', { name: 'Abrir menu de navegação' }).click()
    await aba.mouse.move(0, 0)
    await aba.locator('#menu-mobile').waitFor({ state: 'visible', timeout: esperaPeloTitulo })
    console.log('ok     menu-aberto-390 — menu lateral aberto sobre Contato')

    passo = 'o print menu-aberto-390.png não foi tirado'
    await tirarPrint(aba, 'menu-aberto-390.png', false)
    gerados.push('menu-aberto-390.png')
  } catch (erro) {
    console.log(`falhou menu-aberto-390 — ${passo} (${resumoDoErro(erro)})`)
  }
} finally {
  await navegador.close()
}

// O contador (RP-12): quanto gerou, de quanto esperava, e o que faltou.
const faltaram = nomesEsperados.filter((nome) => !gerados.includes(nome))
console.log(`\ngerados: ${gerados.length} de ${nomesEsperados.length}`)
for (const nome of faltaram) console.log(`  faltou: ${nome}`)

// Todo arquivo da pasta que o script não gera, de qualquer tipo. Ele não apaga
// nenhum: isso é decisão de uma pessoa. Só diz qual é.
const naPasta = readdirSync(pastaDosPrints)
const estranhos = naPasta.filter((nome) => !nomesEsperados.includes(nome))
console.log(`arquivos na pasta: ${naPasta.length}`)
console.log(`estranhos: ${estranhos.length}`)
for (const nome of estranhos) console.log(`  estranho: ${nome}`)

// Prints em que alguma borboleta não estava na pose de repouso, por página e largura.
console.log(`borboletas medidas no total: ${totalDeBorboletas}`)
console.log(`borboletas fora da pose: ${foraDaPose.length}`)
for (const nome of foraDaPose) console.log(`  fora da pose: ${nome}`)

// O protótipo tem borboletas: zero no total quer dizer que a medição quebrou,
// e "nada medido" não pode sair como se estivesse tudo certo.
const mediuAlgumaBorboleta = totalDeBorboletas > 0
if (!mediuAlgumaBorboleta) {
  console.log('  nenhuma borboleta encontrada: a conferência não mediu nada')
}

const temFalha = faltaram.length > 0 || estranhos.length > 0 || foraDaPose.length > 0
if (temFalha || !mediuAlgumaBorboleta) process.exitCode = 1
