/*
 * AS FUNÇÕES DA BUSCA DE SEGREDO ANTES DO ENVIO (change ajustar-ci-ao-novo-fluxo,
 * D5 e D6; Q3 (b)).
 *
 * Só funções, sem efeito ao ser importado e sem ler disco nem rodar o Git: quem lê é
 * o leitor que o scripts/buscar-segredo-antes-do-envio.mjs monta, e o teste
 * (tests/barreiras/busca-de-segredo.test.mjs) injeta um leitor falso.
 *
 * NUNCA IMPRIME VALOR: de cada achado sai o formato, o commit ou a árvore, o arquivo,
 * a linha e o número de caracteres do trecho achado, na marca de mascarado da §5 do
 * docs/SEGURANCA.md. Nenhuma função devolve o trecho. Achado no caminho do arquivo
 * sai como `nome do arquivo`, e o caminho não sai.
 *
 * DUAS LEITURAS DE CADA CONTEÚDO (change completar-ci-do-novo-fluxo, D6, Q6 (a)): byte
 * a byte, como latin1, e, se o conteúdo parece UTF-16, decodificado como UTF-16.
 */

/*
 * Os 6 formatos da proposta, copiados dela. Todos com comprimento MÍNIMO depois do
 * prefixo, e nenhum com comprimento exato (Q3 (b)): uma busca de tamanho exato fica
 * muda quando o formato cresce. O piso dos dois do GitHub, 60 e 30, vem do formato
 * publicado (82 e 36), com margem, e não de medição. O texto de cada expressão não
 * casa com ela própria, porque depois do prefixo vem um colchete: é isso que deixa a
 * busca passar pelos documentos que citam os formatos.
 */
export const FORMATOS = [
  { nome: 'JWT do Supabase', expressao: 'eyJhbGci[A-Za-z0-9_-]{20,}' },
  { nome: 'chave secreta do Supabase', expressao: 'sb_secret_[A-Za-z0-9_-]{10,}' },
  { nome: 'token pessoal do Supabase', expressao: 'sbp_[A-Za-z0-9]{20,}' },
  { nome: 'token granular do GitHub', expressao: 'github_pat_[A-Za-z0-9_]{60,}' },
  {
    nome: 'chave privada PEM',
    expressao: '-----BEGIN[A-Z ]*PRIVATE KEY-----\\s*[A-Za-z0-9+/=]{64,}',
  },
  { nome: 'token clássico do GitHub', expressao: 'ghp_[A-Za-z0-9]{30,}' },
]

// Executáveis que o Windows acharia na pasta atual antes do Git do PATH.
const EXECUTAVEIS_DO_GIT = new Set(['git', 'git.exe', 'git.cmd', 'git.bat', 'git.com'])

export const executaveisDoGitNaRaiz = (nomes) =>
  nomes.filter((nome) => EXECUTAVEIS_DO_GIT.has(nome.toLowerCase()))

// Linhas de um conteúdo: a última conta mesmo sem fim de linha; vazio tem 0.
export function contarLinhas(texto) {
  if (texto === '') return 0
  let quebras = 0
  for (
    let posicao = texto.indexOf('\n');
    posicao !== -1;
    posicao = texto.indexOf('\n', posicao + 1)
  ) {
    quebras += 1
  }
  return texto.endsWith('\n') ? quebras : quebras + 1
}

// Texto ou bytes, sempre como texto latin1: um caractere por byte.
const comoTexto = (conteudo) =>
  typeof conteudo === 'string' ? conteudo : conteudo.toString('latin1')

/*
 * A ordem dos bytes, se o conteúdo parece UTF-16 (D6 da completar-ci-do-novo-fluxo,
 * Q6 (a)): pela marca do começo (`FF FE` é 'le', `FE FF` é 'be'), ou, sem a marca,
 * quando mais da metade dos bytes ímpares é zero ('le': o texto em ASCII gravado com
 * dois bytes por caractere, o zero depois) ou mais da metade dos pares ('be', o zero
 * antes). Devolve { ordem, inicio } ou null. UTF-32 e texto comprimido ficam de fora
 * (limite declarado na §5 do docs/SEGURANCA.md).
 */
export function ordemDoUtf16(bytes) {
  if (bytes.length < 2) return null
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return { ordem: 'le', inicio: 2 }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return { ordem: 'be', inicio: 2 }
  let zerosPares = 0
  let zerosImpares = 0
  for (let posicao = 0; posicao < bytes.length; posicao++) {
    if (bytes[posicao] !== 0) continue
    if (posicao % 2 === 0) zerosPares += 1
    else zerosImpares += 1
  }
  const pares = Math.ceil(bytes.length / 2)
  const impares = Math.floor(bytes.length / 2)
  if (zerosImpares * 2 > impares) return { ordem: 'le', inicio: 0 }
  if (zerosPares * 2 > pares) return { ordem: 'be', inicio: 0 }
  return null
}

// Os bytes decodificados como UTF-16 na ordem dada, sem a marca e sem o byte sobrando.
function decodificarUtf16(bytes, { ordem, inicio }) {
  const fim = inicio + Math.floor((bytes.length - inicio) / 2) * 2
  const trecho = Buffer.from(bytes.subarray(inicio, fim))
  return (ordem === 'be' ? trecho.swap16() : trecho).toString('utf16le')
}

// Os achados dos 6 formatos num texto, sem o trecho.
function procurarNoTexto(texto) {
  const achados = []
  for (const { nome, expressao } of FORMATOS) {
    for (const encontro of texto.matchAll(new RegExp(expressao, 'g'))) {
      achados.push({
        formato: nome,
        linha: contarLinhas(texto.slice(0, encontro.index + 1)),
        caracteres: encontro[0].length,
      })
    }
  }
  return achados
}

const mesmoAchado = (primeiro, segundo) =>
  primeiro.formato === segundo.formato &&
  primeiro.linha === segundo.linha &&
  primeiro.caracteres === segundo.caracteres

/*
 * Procura os 6 formatos num conteúdo. Recebe texto ou bytes: bytes são lidos como
 * latin1, um caractere por byte, para o binário não comprimido também ser lido; e,
 * se parecem UTF-16 (ordemDoUtf16), também decodificados assim. O achado que sai nas
 * duas leituras, com o mesmo formato, linha e número de caracteres, conta uma vez.
 * Devolve [{ formato, linha, caracteres }], sem o trecho.
 */
export function procurar(conteudo) {
  const achados = procurarNoTexto(comoTexto(conteudo))
  const ordem = typeof conteudo === 'string' ? null : ordemDoUtf16(conteudo)
  if (ordem !== null) {
    const daLeituraEmBytes = [...achados]
    for (const achado of procurarNoTexto(decodificarUtf16(conteudo, ordem))) {
      const repetido = daLeituraEmBytes.findIndex((outro) => mesmoAchado(outro, achado))
      if (repetido === -1) achados.push(achado)
      else daLeituraEmBytes.splice(repetido, 1)
    }
  }
  return achados.sort((primeiro, segundo) => primeiro.linha - segundo.linha)
}

/*
 * A saída de `git rev-list --parents <intervalo>`: uma linha por commit, o sha e os
 * pais. Devolve [{ sha, pais }].
 */
export function lerRevList(texto) {
  return texto
    .split('\n')
    .map((linha) => linha.trim())
    .filter((linha) => linha !== '')
    .map((linha) => {
      const [sha, ...pais] = linha.split(' ')
      if (!/^[0-9a-f]{40,64}$/.test(sha)) throw new Error('git rev-list devolveu linha estranha')
      return { sha, pais }
    })
}

// Uma lista separada por NUL (`-z`), sem o vazio do fim.
export const lerListaZ = (texto) => texto.split('\0').filter((caminho) => caminho !== '')

// Os pares XY de arquivo em conflito de merge: o índice não tem uma versão só.
const EM_CONFLITO = new Set(['DD', 'AU', 'UD', 'UA', 'DU', 'AA', 'UU'])

/*
 * A saída de `git status --porcelain -z --untracked-files=all`. Cada registro é
 * `XY caminho`; no renomeado e no copiado, o registro seguinte é o caminho antigo, e
 * fica de fora. Devolve [{ caminho, temVersaoNoIndice }]: temVersaoNoIndice é verdadeiro
 * quando o X diz que há uma versão preparada no índice para o próximo commit (X
 * diferente de espaço, de `?` e de `D`, que é apagado no índice). O apagado do disco
 * é pulado por quem lê o disco. Arquivo em conflito lança: não há o que examinar
 * antes de o conflito ser resolvido.
 */
export function lerStatus(texto) {
  const registros = texto.split('\0')
  const arquivos = []
  for (let indice = 0; indice < registros.length; indice++) {
    const registro = registros[indice]
    if (registro === '') continue
    if (registro.length < 4 || registro[2] !== ' ') {
      throw new Error('git status devolveu registro estranho')
    }
    const estado = registro.slice(0, 2)
    if (EM_CONFLITO.has(estado)) throw new Error('há arquivo em conflito de merge: resolva antes')
    arquivos.push({ caminho: registro.slice(3), temVersaoNoIndice: !/[ ?D]/.test(estado[0]) })
    if (/[RC]/.test(estado)) indice += 1
  }
  return arquivos
}

// O lugar do achado na mensagem, no campo do arquivo: `<sha> · mensagem do commit:<linha>`.
export const LOCAL_DA_MENSAGEM = 'mensagem do commit'

// O lugar do achado no caminho do arquivo, que nunca sai: `<origem> · nome do arquivo:<linha>`.
export const LOCAL_DO_NOME = 'nome do arquivo'

// O que fazer com um achado, sem condição: a chave que chegou ao disco já vazou (D6, Q6 (a)).
export const MENSAGEM_DO_ACHADO = 'Não envie. Tire o valor e troque a chave.'

/*
 * A busca, depois de executar() conferir a origin/main. O leitor tem: commits()
 * ([{ sha, pais }]), mensagemDoCommit(sha) (o objeto do commit: o cabeçalho, com o
 * autor e quem fez o commit, e a mensagem), arquivosDoCommit(commit),
 * conteudoNoCommit(sha, caminho),
 * arquivosDaArvore() ([{ caminho, temVersaoNoIndice }]), conteudoNoDisco(caminho) (null
 * para o apagado) e conteudoNoIndice(caminho). Na árvore, a versão do disco e a do
 * índice são examinadas; se forem iguais, o arquivo conta uma vez só, como da
 * árvore. O caminho de cada arquivo examinado, nos commits e na árvore, também passa
 * pelos formatos (examinarNome). Erro do Git lança, e executar() o transforma em não
 * verificado.
 */
export function buscar(leitor) {
  const medida = {
    commits: 0,
    mensagens: 0,
    dosCommits: 0,
    daArvore: 0,
    doIndice: 0,
    linhas: 0,
    achados: [],
  }
  const examinar = (conteudo, origem, arquivo) => {
    medida.linhas += contarLinhas(comoTexto(conteudo))
    for (const achado of procurar(conteudo)) medida.achados.push({ ...achado, origem, arquivo })
  }
  /*
   * O caminho também passa pelos formatos. Com achado no nome, todo achado daquele
   * arquivo sai como `nome do arquivo`, porque o caminho levaria o valor à saída.
   * Devolve o nome que vai para a saída.
   */
  const examinarNome = (caminho, origem) => {
    const noNome = procurar(caminho)
    for (const achado of noNome) {
      medida.achados.push({ ...achado, origem, arquivo: LOCAL_DO_NOME })
    }
    return noNome.length > 0 ? LOCAL_DO_NOME : caminho
  }
  for (const commit of leitor.commits()) {
    medida.commits += 1
    const shaCurto = commit.sha.slice(0, 7)
    medida.mensagens += 1
    examinar(leitor.mensagemDoCommit(commit.sha), shaCurto, LOCAL_DA_MENSAGEM)
    for (const arquivo of leitor.arquivosDoCommit(commit)) {
      medida.dosCommits += 1
      const nome = examinarNome(arquivo, shaCurto)
      examinar(leitor.conteudoNoCommit(commit.sha, arquivo), shaCurto, nome)
    }
  }
  for (const { caminho, temVersaoNoIndice } of leitor.arquivosDaArvore()) {
    const noDisco = leitor.conteudoNoDisco(caminho)
    const noIndice = temVersaoNoIndice ? leitor.conteudoNoIndice(caminho) : null
    const examinaOIndice =
      noIndice !== null && (noDisco === null || comoTexto(noDisco) !== comoTexto(noIndice))
    if (noDisco === null && !examinaOIndice) continue
    // O nome conta uma vez por caminho da árvore, mesmo com as duas versões lidas.
    const nome = examinarNome(caminho, noDisco !== null ? 'árvore' : 'índice')
    if (noDisco !== null) {
      medida.daArvore += 1
      examinar(noDisco, 'árvore', nome)
    }
    if (examinaOIndice) {
      medida.doIndice += 1
      examinar(noIndice, 'índice', nome)
    }
  }
  return medida
}

export const mascarar = ({ caracteres, arquivo, linha }) =>
  `[MASCARADO · ${caracteres} caracteres · ${arquivo}:${linha}]`

export const descreverAchado = (achado) =>
  `${achado.formato} · ${achado.origem} · ${achado.arquivo}:${achado.linha} · ${mascarar(achado)}`

export const totalDeArquivos = (medida) => medida.dosCommits + medida.daArvore + medida.doIndice

export const montarResumo = (medida) =>
  `commits: ${medida.commits} · mensagens: ${medida.mensagens} · ` +
  `arquivos: ${totalDeArquivos(medida)} (dos commits: ` +
  `${medida.dosCommits} · da árvore: ${medida.daArvore} · do índice: ${medida.doIndice}) · ` +
  `linhas: ${medida.linhas} · formatos: ${FORMATOS.length} · achados: ${medida.achados.length}`

/*
 * Roda a busca e diz o resultado. Devolve o código de saída: 0 sem achado, 1 com
 * achado, 2 não verificado (Git na raiz, sem origin/main, fora de um repositório ou
 * Git com erro).
 */
export function executar({ leitor, nomesNaRaiz, imprimir }) {
  const naoVerificou = (motivo) => {
    imprimir('=== NAO VERIFICADO — busca de segredo ===')
    imprimir(`  ${motivo}`)
    imprimir('  Nada foi examinado, então NADA foi provado: não envie.')
    return 2
  }
  const executaveis = executaveisDoGitNaRaiz(nomesNaRaiz)
  if (executaveis.length > 0) {
    return naoVerificou(`executável do Git na raiz do projeto: ${executaveis.join(', ')}`)
  }
  try {
    leitor.origem()
  } catch {
    return naoVerificou(
      'sem a referência origin/main, ou fora de um repositório: rode `git fetch origin` ' +
        'e a busca de novo'
    )
  }
  let medida
  try {
    medida = buscar(leitor)
  } catch (erro) {
    return naoVerificou(`o Git falhou: ${erro?.message}`)
  }
  imprimir('')
  if (medida.commits === 0 && totalDeArquivos(medida) === 0) {
    imprimir('examinou 0 commits e 0 arquivos: nada a enviar')
  }
  if (medida.achados.length > 0) {
    imprimir('=== ACHADO — segredo no que vai ser enviado ===')
    medida.achados.forEach((achado) => imprimir(`  ${descreverAchado(achado)}`))
    imprimir(`  ${MENSAGEM_DO_ACHADO}`)
  } else {
    imprimir('=== NADA ACHADO — busca de segredo ===')
  }
  imprimir(`  ${montarResumo(medida)}`)
  return medida.achados.length > 0 ? 1 : 0
}
