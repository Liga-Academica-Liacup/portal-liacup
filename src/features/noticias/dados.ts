/*
 * Unico lugar desta feature que fala com o banco (Principio IX, zona Z1 do lint).
 * Nenhum componente chama o banco direto.
 *
 * Esta e a COLECAO DE REFERENCIA da F02: as demais leituras publicas copiam a
 * forma daqui. Tres regras do contrato, e cada uma esta marcada abaixo no ponto
 * em que e cumprida (contracts/camada-de-dados.md).
 */
import { criarClienteDeLeituraPublica, criarClienteDeServidor } from '@/lib/supabase/servidor'
import type { NoticiaPublica } from './tipos'

/*
 * REGRA 1 (FR-006): pede apenas as colunas que usa. `select('*')` traz corpo,
 * autor e marcas de edicao em toda listagem — preguica que vira lentidao no
 * celular com rede lenta, que e o caso principal (Principio III).
 */
const COLUNAS = 'id, titulo, resumo, imagem_url, link_externo, data_noticia'

/**
 * Noticias visiveis para quem visita o site, da mais recente para a mais antiga.
 *
 * Devolve lista vazia quando nao ha nada E quando a consulta falha — os dois
 * casos desenham o `EstadoVazio` da F01, e nenhum derruba a pagina. Com o banco
 * pausado pelo plano gratuito, a pagina estatica serve a ultima versao boa e
 * esta atualizacao falha em silencio, que e o comportamento decidido em D3.
 */
export async function listarNoticiasPublicadas(): Promise<NoticiaPublica[]> {
  /* Leitura publica e estatica com revalidacao: e o que faz a pausa do plano
     gratuito nao derrubar o site (research.md D3). */
  const supabase = criarClienteDeLeituraPublica()

  /*
   * REGRA 3: filtra por publicado e nao arquivado mesmo que a politica ja filtre.
   * Duas camadas com papeis diferentes: a politica e a que PROTEGE; o filtro e o
   * que DOCUMENTA A INTENCAO e sobrevive a alguem consultar isto com credencial
   * de diretoria, que ve rascunho.
   */
  const { data, error } = await supabase
    .from('noticias')
    .select(COLUNAS)
    .eq('publicado', true)
    .eq('arquivado', false)
    .order('data_noticia', { ascending: false })

  /*
   * REGRA 2 (FR-007): devolve lista vazia em vez de erro. O log leva a mensagem
   * do banco e nada mais — nem dado de quem visita, nem credencial (FR-021).
   */
  if (error) {
    console.error(`[noticias] leitura publica falhou: ${error.message}`)
    return []
  }

  return (data ?? []).map((linha) => ({
    id: linha.id,
    titulo: linha.titulo,
    resumo: linha.resumo,
    imagemUrl: linha.imagem_url,
    linkExterno: linha.link_externo,
    dataNoticia: linha.data_noticia,
  }))
}

/**
 * Noticias ARQUIVADAS (FR-029).
 *
 * Existe porque arquivar sem ter como olhar o arquivo e apagar com passos
 * extras. A tela que consome esta funcao e da F16.
 *
 * Com credencial anonima esta consulta devolve lista vazia, e nao por erro: a
 * politica de leitura publica so mostra o que esta publicado e nao arquivado. Ela
 * so traz conteudo para quem esta autenticado, que e o comportamento pretendido
 * — e passa a ser exercido de verdade quando a F14 trouxer o login.
 */
export async function listarNoticiasArquivadas(): Promise<NoticiaPublica[]> {
  const supabase = criarClienteDeServidor()

  const { data, error } = await supabase
    .from('noticias')
    .select(COLUNAS)
    .eq('arquivado', true)
    .order('data_noticia', { ascending: false })

  if (error) {
    console.error(`[noticias] leitura de arquivadas falhou: ${error.message}`)
    return []
  }

  return (data ?? []).map((linha) => ({
    id: linha.id,
    titulo: linha.titulo,
    resumo: linha.resumo,
    imagemUrl: linha.imagem_url,
    linkExterno: linha.link_externo,
    dataNoticia: linha.data_noticia,
  }))
}
