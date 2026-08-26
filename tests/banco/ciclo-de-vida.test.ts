/*
 * T054 — os tres comportamentos do ciclo de vida (FR-028 a FR-032, SC-015).
 *
 *   1. arquivar NAO remove, e o arquivado continua encontravel;
 *   2. arquivar um album leva as fotos junto, e restaurar traz as duas de volta;
 *   3. a segunda escrita da mesma versao e RECUSADA, devolvendo o que a pessoa
 *      tentou salvar.
 *
 * O terceiro e o unico que precisa de duas pessoas para acontecer na vida real,
 * e por isso e o que quase nunca e testado: aqui as duas sao dois clientes.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { clienteAutenticado, clienteDeServico, semTipos, type Cliente } from '../politicas/clientes'
import { MARCA } from '../politicas/colecoes'
import { limpar } from '../politicas/preparo'
import { alterarComVersao, arquivar, restaurar } from '@/lib/supabase/ciclo-de-vida'

let servico: Cliente
let diretoria: Cliente

beforeAll(async () => {
  servico = clienteDeServico()
  diretoria = await clienteAutenticado()
  await limpar(servico, ['noticias', 'galeria_fotos', 'galeria_albuns'])
}, 120_000)

afterAll(async () => {
  await limpar(servico, ['noticias', 'galeria_fotos', 'galeria_albuns'])
}, 120_000)

async function criarNoticia() {
  const { data, error } = await semTipos(servico)
    .from('noticias')
    .insert({ titulo: MARCA, publicado: true, arquivado: false })
    .select('id, alterado_em')
    .single()
  if (error || !data) throw new Error(`preparacao falhou: ${error?.message}`)
  return data as { id: string; alterado_em: string }
}

describe('arquivar nao remove (FR-028, FR-029)', () => {
  it('apagar pelo caminho da aplicacao marca arquivado, e a linha continua no banco', async () => {
    const noticia = await criarNoticia()

    const r = await arquivar(semTipos(diretoria), 'noticias', noticia.id, noticia.alterado_em)
    expect(r.ok, 'a diretoria deveria conseguir arquivar').toBe(true)

    /* A testemunha e o cliente de servico: ele ve tudo, e por isso e ele que
       pode afirmar que a linha NAO sumiu. */
    const depois = await semTipos(servico)
      .from('noticias')
      .select('id, arquivado')
      .eq('id', noticia.id)
    expect(depois.data ?? [], 'arquivar removeu a linha').toHaveLength(1)
    expect((depois.data as { arquivado: boolean }[])[0]?.arquivado).toBe(true)
  })

  it('a consulta de arquivados encontra o que foi arquivado', async () => {
    const arquivadas = await semTipos(diretoria).from('noticias').select('id').eq('arquivado', true)
    expect(
      (arquivadas.data ?? []).length,
      'arquivar sem como olhar o arquivo e apagar'
    ).toBeGreaterThan(0)
  })
})

describe('arquivar um album leva as fotos (FR-030)', () => {
  it('desce no arquivamento e volta na restauracao', async () => {
    const album = await semTipos(servico)
      .from('galeria_albuns')
      .insert({ titulo: MARCA, publicado: true, arquivado: false })
      .select('id, alterado_em')
      .single()
    if (album.error) throw new Error(`preparacao falhou: ${album.error.message}`)
    const { id: albumId, alterado_em: versao } = album.data as {
      id: string
      alterado_em: string
    }

    await semTipos(servico)
      .from('galeria_fotos')
      .insert([
        { album_id: albumId, legenda: MARCA, publicado: true, arquivado: false },
        { album_id: albumId, legenda: MARCA, publicado: true, arquivado: false },
      ])

    const arquivado = await arquivar(semTipos(diretoria), 'galeria_albuns', albumId, versao)
    expect(arquivado.ok).toBe(true)

    const fotosArquivadas = await semTipos(servico)
      .from('galeria_fotos')
      .select('id')
      .eq('album_id', albumId)
      .eq('arquivado', true)
    expect(
      (fotosArquivadas.data ?? []).length,
      'album arquivado com fotos publicadas nao e estado intermediario, e vazamento'
    ).toBe(2)

    /* A versao mudou ao arquivar: para restaurar e preciso a nova. */
    const atual = await semTipos(servico)
      .from('galeria_albuns')
      .select('alterado_em')
      .eq('id', albumId)
      .single()
    const versaoNova = (atual.data as { alterado_em: string }).alterado_em

    const restaurado = await restaurar(semTipos(diretoria), 'galeria_albuns', albumId, versaoNova)
    expect(restaurado.ok).toBe(true)

    const fotosDeVolta = await semTipos(servico)
      .from('galeria_fotos')
      .select('id')
      .eq('album_id', albumId)
      .eq('arquivado', false)
    expect((fotosDeVolta.data ?? []).length, 'restaurar deixou fotos para tras').toBe(2)
  })
})

describe('edicao concorrente (FR-031, FR-032)', () => {
  it('a segunda escrita da mesma versao e recusada, e devolve o que foi tentado', async () => {
    const noticia = await criarNoticia()

    /* Duas pessoas abrem a MESMA versao. */
    const versaoQueAmbasAbriram = noticia.alterado_em

    const primeira = await alterarComVersao(
      semTipos(diretoria),
      'noticias',
      noticia.id,
      versaoQueAmbasAbriram,
      { titulo: `${MARCA} salvo pela primeira pessoa` }
    )
    expect(primeira.ok, 'a primeira escrita deveria passar').toBe(true)

    const tentativaDaSegunda = { titulo: `${MARCA} texto longo que a segunda pessoa escreveu` }
    const segunda = await alterarComVersao(
      semTipos(diretoria),
      'noticias',
      noticia.id,
      versaoQueAmbasAbriram,
      tentativaDaSegunda
    )

    expect(segunda.ok, 'a segunda escrita sobrescreveu a primeira em silencio').toBe(false)
    if (segunda.ok) return
    expect(segunda.motivo).toBe('conflito')
    /* O que impede a perda barulhenta: avisar sem devolver e pior que nao avisar. */
    if (segunda.motivo !== 'conflito') return
    expect(segunda.conteudoTentado, 'a recusa perdeu o texto da pessoa').toEqual(tentativaDaSegunda)

    /* E o banco ficou com o da primeira, nao com o da segunda. */
    const noBanco = await semTipos(servico)
      .from('noticias')
      .select('titulo')
      .eq('id', noticia.id)
      .single()
    expect((noBanco.data as { titulo: string }).titulo).toBe(`${MARCA} salvo pela primeira pessoa`)
  })
})
