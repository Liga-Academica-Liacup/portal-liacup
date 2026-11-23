/*
 * @vitest-environment node
 *
 * O teste da busca de segredo antes do envio (change ajustar-ci-ao-novo-fluxo, D6).
 *
 * Confere as funções de scripts/buscar-segredo-antes-do-envio/funcoes.mjs com um
 * leitor de Git falso: nenhum caso roda o Git nem lê o repositório, fora o caso que
 * confere que os próprios arquivos da busca não têm chave.
 *
 * NENHUMA CHAVE FALSA ESTÁ ESCRITA INTEIRA AQUI: cada uma é montada na hora, com o
 * prefixo partido em dois pedaços e o corpo repetido, para a própria busca não achar
 * este arquivo (D6).
 *
 * O contador no fim diz quantos casos foram conferidos, porque um arquivo sem caso
 * também passaria (RP-12).
 */
import { readFileSync } from 'node:fs'
import { afterAll, describe, expect, it } from 'vitest'
import {
  buscar,
  contarLinhas,
  executar,
  FORMATOS,
  lerRevList,
  lerStatus,
  montarResumo,
  procurar,
} from '../../scripts/buscar-segredo-antes-do-envio/funcoes.mjs'

let casos = 0
const caso = (nome, corpo) =>
  it(nome, () => {
    corpo()
    casos++
  })

const junto = (...pedacos) => pedacos.join('')

/*
 * Cada formato: o prefixo partido, o corpo, o piso da proposta e o comprimento
 * publicado depois do prefixo, quando há um. `chave(modelo, comprimento)` monta uma
 * chave com esse número de caracteres depois do prefixo.
 */
const MODELOS = [
  { formato: 'JWT do Supabase', prefixo: junto('eyJh', 'bGci'), piso: 20, publicado: 28 },
  { formato: 'chave secreta do Supabase', prefixo: junto('sb_se', 'cret_'), piso: 10 },
  { formato: 'token pessoal do Supabase', prefixo: junto('sb', 'p_'), piso: 20, publicado: 40 },
  {
    formato: 'token granular do GitHub',
    prefixo: junto('github', '_pat_'),
    piso: 60,
    publicado: 82,
  },
  {
    formato: 'chave privada PEM',
    prefixo: junto('-----BEGIN ', 'PRIVATE KEY-----\n'),
    piso: 64,
    publicado: 64,
  },
  { formato: 'token clássico do GitHub', prefixo: junto('gh', 'p_'), piso: 30, publicado: 36 },
]
const chave = (modelo, comprimento) => modelo.prefixo + 'A'.repeat(comprimento)

/*
 * O objeto de um commit, como o `git cat-file commit` devolve: tree na linha 1, author
 * na 2, committer na 3, a linha vazia na 4 e a mensagem a partir da 5.
 */
const objetoDoCommit = ({
  autor = 'Nome Exemplo <nome@exemplo.org>',
  quemFezOCommit = autor,
  mensagem = 'docs: muda o texto\n',
} = {}) =>
  `tree ${'3'.repeat(40)}\nauthor ${autor} 1700000000 -0300\n` +
  `committer ${quemFezOCommit} 1700000000 -0300\n\n${mensagem}`

/*
 * Um leitor de Git falso. commits = [{ sha, arquivos: { caminho: conteúdo }, objeto }],
 * do mais novo para o mais velho, como o rev-list, com objeto vazio quando o caso não
 * dá um; arvore = { caminho: conteúdo no disco, ou null para o apagado };
 * indice = { caminho: versão preparada no índice }.
 */
function leitorFalso({
  commits = [],
  arvore = {},
  indice = {},
  faltaOrigem = false,
  deveFalharNoCommit = false,
} = {}) {
  const doCommit = (sha) => commits.find((commit) => commit.sha === sha)
  return {
    origem: () => {
      if (faltaOrigem) throw new Error('sem origin/main')
    },
    commits: () =>
      commits.map((commit) => ({ sha: commit.sha, pais: commit.pais ?? ['0'.repeat(40)] })),
    mensagemDoCommit: (sha) => Buffer.from(doCommit(sha).objeto ?? '', 'latin1'),
    arquivosDoCommit: ({ sha }) => Object.keys(doCommit(sha).arquivos),
    conteudoNoCommit: (sha, caminho) => {
      if (deveFalharNoCommit) throw new Error('git cat-file terminou com erro')
      return Buffer.from(doCommit(sha).arquivos[caminho], 'latin1')
    },
    arquivosDaArvore: () =>
      [...new Set([...Object.keys(arvore), ...Object.keys(indice)])].map((caminho) => ({
        caminho,
        temVersaoNoIndice: caminho in indice,
      })),
    conteudoNoDisco: (caminho) =>
      arvore[caminho] === undefined || arvore[caminho] === null
        ? null
        : Buffer.from(arvore[caminho], 'latin1'),
    conteudoNoIndice: (caminho) => Buffer.from(indice[caminho], 'latin1'),
  }
}

function rodar(opcoes, nomesNaRaiz = ['package.json', 'scripts']) {
  const linhas = []
  const codigo = executar({
    leitor: leitorFalso(opcoes),
    nomesNaRaiz,
    imprimir: (linha) => linhas.push(linha),
  })
  return { codigo, saida: linhas.join('\n') }
}

const SHA_1 = '1'.repeat(40)
const SHA_2 = '2'.repeat(40)

describe('os formatos', () => {
  caso('são os 6 da proposta, e cada expressão termina em comprimento mínimo {n,}', () => {
    expect(FORMATOS.map((formato) => formato.nome)).toEqual(MODELOS.map((modelo) => modelo.formato))
    for (const { expressao } of FORMATOS) expect(expressao).toMatch(/\{\d+,\}$/)
  })
  for (const modelo of MODELOS) {
    caso(`${modelo.formato}: acha no piso, e não acha um caractere abaixo`, () => {
      expect(procurar(`x ${chave(modelo, modelo.piso)} y`)).toEqual([
        {
          formato: modelo.formato,
          linha: 1,
          caracteres: modelo.prefixo.length + modelo.piso,
        },
      ])
      expect(procurar(`x ${chave(modelo, modelo.piso - 1)} y`)).toEqual([])
    })
    caso(`${modelo.formato}: acha a chave mais longa que o publicado, com o trecho inteiro`, () => {
      const comprimento = (modelo.publicado ?? modelo.piso) + 37
      const achados = procurar(`linha 1\nlinha 2 ${chave(modelo, comprimento)}\n`)
      expect(achados).toEqual([
        { formato: modelo.formato, linha: 2, caracteres: modelo.prefixo.length + comprimento },
      ])
    })
  }
  caso('o prefixo solto e o prefixo com pouco texto depois não acham', () => {
    const texto = MODELOS.map(
      (modelo) => `${modelo.prefixo} · ${modelo.prefixo}abc · \`${modelo.prefixo}\``
    ).join('\n')
    expect(procurar(texto)).toEqual([])
  })
  caso('o texto de cada expressão, como os documentos citam, não acha', () => {
    const texto = FORMATOS.map(
      (formato) => `\`${formato.expressao}\` e /${formato.expressao}/g`
    ).join('\n')
    expect(procurar(texto)).toEqual([])
  })
  caso('os arquivos da busca e este teste não têm chave escrita inteira', () => {
    for (const relativo of [
      '../../scripts/buscar-segredo-antes-do-envio.mjs',
      '../../scripts/buscar-segredo-antes-do-envio/funcoes.mjs',
      './busca-de-segredo.test.mjs',
    ]) {
      expect(procurar(readFileSync(new URL(relativo, import.meta.url)))).toEqual([])
    }
  })
})

describe('o que a busca examina', () => {
  caso('a chave num commit intermediário, apagada no commit seguinte, é achada', () => {
    // O SHA_1 acrescenta a chave na linha 3; o SHA_2, mais novo, tira a linha. No
    // último estado, e na árvore, a chave não existe mais: só o commit intermediário a tem.
    const resultado = rodar({
      commits: [
        { sha: SHA_2, arquivos: { 'notas.txt': 'a\nb\n' } },
        { sha: SHA_1, arquivos: { 'notas.txt': `a\nb\n${chave(MODELOS[0], 40)}\n` } },
      ],
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain(
      'JWT do Supabase · 1111111 · notas.txt:3 · [MASCARADO · 48 caracteres · notas.txt:3]'
    )
    expect(resultado.saida).not.toContain('2222222')
    expect(resultado.saida).toContain(
      'commits: 2 · mensagens: 2 · arquivos: 2 (dos commits: 2 · da árvore: 0 · do índice: 0) · ' +
        'linhas: 5 · formatos: 6 · achados: 1'
    )
  })
  caso('a chave na mensagem do commit é achada, com o local da mensagem', () => {
    // A mensagem começa na linha 5 do objeto; a chave fica na linha 7.
    const mensagem = `feat: muda a busca\n\nchave colada: ${chave(MODELOS[3], 82)}\n`
    const resultado = rodar({
      commits: [{ sha: SHA_1, arquivos: { 'a.md': 'um\n' }, objeto: objetoDoCommit({ mensagem }) }],
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain(
      'token granular do GitHub · 1111111 · mensagem do commit:7 · ' +
        '[MASCARADO · 93 caracteres · mensagem do commit:7]'
    )
    expect(resultado.saida).toContain(
      'commits: 1 · mensagens: 1 · arquivos: 1 (dos commits: 1 · da árvore: 0 · do índice: 0) · ' +
        'linhas: 8 · formatos: 6 · achados: 1'
    )
  })
  caso('a chave no autor ou em quem fez o commit, no nome ou no e-mail, é achada', () => {
    const resultado = rodar({
      commits: [
        {
          sha: SHA_2,
          arquivos: {},
          objeto: objetoDoCommit({ autor: `Nome <${chave(MODELOS[5], 36)}@exemplo.org>` }),
        },
        {
          sha: SHA_1,
          arquivos: {},
          objeto: objetoDoCommit({ quemFezOCommit: `${chave(MODELOS[2], 40)} <a@exemplo.org>` }),
        },
      ],
    })
    expect(resultado.codigo).toBe(1)
    // No SHA_2, quem fez o commit é o próprio autor: a chave está nas linhas 2 e 3.
    expect(resultado.saida).toContain('token clássico do GitHub · 2222222 · mensagem do commit:2')
    expect(resultado.saida).toContain('token clássico do GitHub · 2222222 · mensagem do commit:3')
    expect(resultado.saida).toContain(
      'token pessoal do Supabase · 1111111 · mensagem do commit:3 · ' +
        '[MASCARADO · 44 caracteres · mensagem do commit:3]'
    )
    expect(resultado.saida).toContain('mensagens: 2 · arquivos: 0')
    expect(resultado.saida).toContain('achados: 3')
  })
  caso('a mensagem sem chave, mesmo citando o prefixo, não acha', () => {
    const mensagem = `fix: cita ${MODELOS[0].prefixo} e ${MODELOS[3].prefixo}abc, sem chave\n`
    const resultado = rodar({
      commits: [{ sha: SHA_1, arquivos: {}, objeto: objetoDoCommit({ mensagem }) }],
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain('NADA ACHADO')
    expect(resultado.saida).not.toContain('MASCARADO')
    expect(resultado.saida).toContain(
      'commits: 1 · mensagens: 1 · arquivos: 0 (dos commits: 0 · da árvore: 0 · do índice: 0) · ' +
        'linhas: 5 · formatos: 6 · achados: 0'
    )
  })
  caso('a chave num arquivo da árvore é achada, e o apagado é pulado', () => {
    const resultado = rodar({
      arvore: { 'a.txt': `${chave(MODELOS[5], 36)}`, 'apagado.txt': null },
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain(
      'token clássico do GitHub · árvore · a.txt:1 · [MASCARADO · 40 caracteres · a.txt:1]'
    )
    expect(resultado.saida).toContain(
      'arquivos: 1 (dos commits: 0 · da árvore: 1 · do índice: 0) · linhas: 1'
    )
  })
  caso('a chave na versão do índice, diferente do disco, é achada no índice', () => {
    // `MM`: a chave foi preparada com git add e depois tirada do disco, sem novo add.
    const resultado = rodar({
      arvore: { 'a.txt': 'a\nsem chave\n' },
      indice: { 'a.txt': `a\n${chave(MODELOS[0], 40)}\n` },
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain(
      'JWT do Supabase · índice · a.txt:2 · [MASCARADO · 48 caracteres · a.txt:2]'
    )
    expect(resultado.saida).not.toContain('· árvore ·')
    expect(resultado.saida).toContain(
      'commits: 0 · mensagens: 0 · arquivos: 2 (dos commits: 0 · da árvore: 1 · do índice: 1) · ' +
        'linhas: 4 · formatos: 6 · achados: 1'
    )
  })
  caso('índice igual ao disco conta uma vez só; apagado do disco e no índice é lido', () => {
    const chaveNoIndice = `${chave(MODELOS[2], 40)}\n`
    const resultado = rodar({
      arvore: { 'igual.txt': chaveNoIndice, 'sumiu.txt': null },
      indice: { 'igual.txt': chaveNoIndice, 'sumiu.txt': chaveNoIndice },
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain('token pessoal do Supabase · árvore · igual.txt:1')
    expect(resultado.saida).not.toContain('índice · igual.txt')
    expect(resultado.saida).toContain('token pessoal do Supabase · índice · sumiu.txt:1')
    expect(resultado.saida).toContain(
      'arquivos: 2 (dos commits: 0 · da árvore: 1 · do índice: 1) · linhas: 2 · formatos: 6 · ' +
        'achados: 2'
    )
  })
  caso('a chave dentro de um binário não comprimido é achada', () => {
    const binario = String.fromCharCode(0, 255, 137, 80, 0) + chave(MODELOS[2], 40) + '\0\0'
    const resultado = rodar({ arvore: { 'imagem.png': binario } })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain('token pessoal do Supabase · árvore · imagem.png:1')
  })
  caso('a chave privada com o corpo na linha de baixo é achada na linha do cabeçalho', () => {
    const resultado = rodar({
      arvore: { 'k.pem': `x\n${chave(MODELOS[4], 64)}\n${'B'.repeat(20)}\n` },
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain('chave privada PEM · árvore · k.pem:2')
  })
  caso('a saída nunca traz trecho do valor', () => {
    const resultado = rodar({
      arvore: Object.fromEntries(
        MODELOS.map((modelo, posicao) => [`arquivo${posicao}`, chave(modelo, 90)])
      ),
    })
    expect(resultado.codigo).toBe(1)
    expect(resultado.saida).toContain('achados: 6')
    expect(resultado.saida).not.toMatch(/A{6}/)
    for (const modelo of MODELOS) expect(resultado.saida).not.toContain(modelo.prefixo.trim())
  })
  caso('nada achado: código 0, com os contadores', () => {
    const resultado = rodar({
      commits: [{ sha: SHA_1, arquivos: { 'a.md': 'um\ndois\n' } }],
      arvore: { 'b.md': 'três' },
    })
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain('NADA ACHADO')
    expect(resultado.saida).toContain(
      'commits: 1 · mensagens: 1 · arquivos: 2 (dos commits: 1 · da árvore: 1 · do índice: 0) · ' +
        'linhas: 3 · formatos: 6 · achados: 0'
    )
  })
  caso('nada a enviar: diz que examinou 0 commits e 0 arquivos, com código 0', () => {
    const resultado = rodar({})
    expect(resultado.codigo).toBe(0)
    expect(resultado.saida).toContain('examinou 0 commits e 0 arquivos')
  })
})

describe('o que não verifica', () => {
  caso('sem origin/main: código 2, e nada examinado', () => {
    const resultado = rodar({ faltaOrigem: true, arvore: { 'a.txt': chave(MODELOS[0], 40) } })
    expect(resultado.codigo).toBe(2)
    expect(resultado.saida).toContain('NAO VERIFICADO')
    expect(resultado.saida).not.toContain('MASCARADO')
  })
  caso('o Git com erro no meio da busca: código 2', () => {
    const resultado = rodar({
      deveFalharNoCommit: true,
      commits: [{ sha: SHA_1, arquivos: { 'a.md': 'x' } }],
    })
    expect(resultado.codigo).toBe(2)
    expect(resultado.saida).toContain('o Git falhou: git cat-file terminou com erro')
  })
  caso('um executável do Git na raiz: código 2, antes de rodar o Git', () => {
    const resultado = rodar({}, ['package.json', 'Git.EXE'])
    expect(resultado.codigo).toBe(2)
    expect(resultado.saida).toContain('executável do Git na raiz do projeto: Git.EXE')
  })
})

describe('as leituras da saída do Git', () => {
  caso('rev-list --parents: sha e pais, e linha estranha lança', () => {
    expect(lerRevList(`${SHA_1} ${SHA_2}\n${SHA_2}\n`)).toEqual([
      { sha: SHA_1, pais: [SHA_2] },
      { sha: SHA_2, pais: [] },
    ])
    expect(() => lerRevList('fatal: x\n')).toThrow()
  })
  caso('status -z: o caminho antigo do renomeado fica de fora', () => {
    expect(lerStatus(' M a.md\0R  novo.md\0velho.md\0?? pasta/c d.txt\0 D e.md\0')).toEqual([
      { caminho: 'a.md', temVersaoNoIndice: false },
      { caminho: 'novo.md', temVersaoNoIndice: true },
      { caminho: 'pasta/c d.txt', temVersaoNoIndice: false },
      { caminho: 'e.md', temVersaoNoIndice: false },
    ])
  })
  caso('status -z: X preparado marca a versão do índice, D no índice não, conflito lança', () => {
    expect(
      lerStatus('MM a.md\0AM b.md\0M  c.md\0AD d.md\0T  e.md\0D  f.md\0RM g.md\0h.md\0')
    ).toEqual([
      { caminho: 'a.md', temVersaoNoIndice: true },
      { caminho: 'b.md', temVersaoNoIndice: true },
      { caminho: 'c.md', temVersaoNoIndice: true },
      { caminho: 'd.md', temVersaoNoIndice: true },
      { caminho: 'e.md', temVersaoNoIndice: true },
      { caminho: 'f.md', temVersaoNoIndice: false },
      { caminho: 'g.md', temVersaoNoIndice: true },
    ])
    for (const conflito of ['UU', 'AA', 'DU', 'UD']) {
      expect(() => lerStatus(`${conflito} x.md\0`)).toThrow('conflito de merge')
    }
  })
  caso('contarLinhas e o resumo', () => {
    expect([
      contarLinhas(''),
      contarLinhas('a'),
      contarLinhas('a\n'),
      contarLinhas('a\nb'),
    ]).toEqual([0, 1, 1, 2])
    expect(
      montarResumo({
        commits: 0,
        mensagens: 0,
        dosCommits: 0,
        daArvore: 0,
        doIndice: 0,
        linhas: 0,
        achados: [],
      })
    ).toBe(
      'commits: 0 · mensagens: 0 · arquivos: 0 (dos commits: 0 · da árvore: 0 · do índice: 0) · ' +
        'linhas: 0 · formatos: 6 · achados: 0'
    )
  })
  caso('buscar devolve a medida sem o trecho achado', () => {
    const medida = buscar(leitorFalso({ arvore: { 'a.txt': chave(MODELOS[1], 12) } }))
    expect(medida.achados).toEqual([
      {
        formato: 'chave secreta do Supabase',
        linha: 1,
        caracteres: 22,
        origem: 'árvore',
        arquivo: 'a.txt',
      },
    ])
  })
})

/*
 * process.stdout, e não console.log: o Vitest esconde o console.log, e o contador
 * precisa aparecer na saída de `npm test` (o mesmo de src/lib/utils/site-publicado.test.ts).
 */
afterAll(() => {
  process.stdout.write(`casos da busca de segredo: ${casos}
`)
})

// Roda por último no arquivo: a ordem dos testes de um arquivo é a de declaração.
it('a busca de segredo conferiu pelo menos um caso', () => {
  expect(casos).toBeGreaterThan(0)
})
