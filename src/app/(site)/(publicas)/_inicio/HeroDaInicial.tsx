/*
 * O hero da página inicial, como no protótipo aprovado.
 *
 * Texto, letra por letra, do docs/conteudo-institucional.md, seção 2.0 (título,
 * lema e apresentação, Q1 (a) da layout-e-hero). O sobretítulo "Universidade
 * de Brasília" vem do protótipo e do nome da liga (seção 1).
 *
 * Mora aqui, em src/app, e não em src/componentes, porque é composição de uma
 * página só. A pasta começa com "_" para o Next não a tratar como endereço.
 *
 * Os botões consultam a lista única de páginas públicas: cada um só aparece se
 * a página a que leva estiver na lista. Sem nenhum, o hero não guarda espaço.
 *
 * No lugar da foto institucional, que a liga manda na homologação da R1, fica o
 * quadro do protótipo com uma borboleta da liga grande, decorativa e sem texto
 * (Q2 (b), REFERENCIA-VISUAL.md seção 7). Quando a foto chegar, troca só o
 * conteúdo do quadro.
 */
import Link from 'next/link'
import { aparenciaDeBotao, type VarianteDoLinkBotao } from '@/componentes/layout/aparencia-de-botao'
import { estaNaLista } from '@/lib/utils/paginas-publicas'
import { BorboletaDaLiga } from './BorboletaDaLiga'
import estilos from './HeroDaInicial.module.css'

type BotaoDoHero = {
  endereco: string
  rotulo: string
  variante: VarianteDoLinkBotao
}

/* Os botões do protótipo, na ordem dele. Aparecem sozinhos quando a página
   entra na lista: Processo seletivo na change 2, Sobre na change 4. */
const BOTOES_DO_HERO: readonly BotaoDoHero[] = [
  { endereco: '/processo-seletivo', rotulo: 'Quero participar', variante: 'primario' },
  { endereco: '/sobre', rotulo: 'Conheça a Liga', variante: 'secundario' },
]

export function HeroDaInicial() {
  const botoes = BOTOES_DO_HERO.filter((botao) => estaNaLista(botao.endereco))

  return (
    <section className={estilos.hero}>
      <BorboletaDaLiga className={`${estilos.borboletaQueVoa} ${estilos.borboletaGrande}`} />
      <BorboletaDaLiga className={`${estilos.borboletaQueVoa} ${estilos.borboletaPequena}`} />

      <div className={estilos.grade}>
        <div className={estilos.texto}>
          <p className={estilos.sobretitulo}>Universidade de Brasília</p>
          <h1 className={estilos.titulo}>Cuidar é o ato mais sublime da conexão humana</h1>
          <p className={estilos.lema}>Curar às vezes, confortar sempre</p>
          <p className={estilos.apresentacao}>
            A LIACUP reúne estudantes de diversas áreas do conhecimento em torno do ensino, da
            pesquisa e da extensão em cuidados paliativos. Aqui fica guardado, em um só lugar, tudo
            o que a Liga produz.
          </p>
          {botoes.length > 0 ? (
            <div className={estilos.botoes}>
              {botoes.map((botao) => (
                <Link
                  key={botao.endereco}
                  href={botao.endereco}
                  className={`${aparenciaDeBotao(botao.variante)} ${estilos.botao}`}
                >
                  {botao.rotulo}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className={estilos.quadro} aria-hidden="true">
          <BorboletaDaLiga className={estilos.borboletaDoQuadro} />
        </div>
      </div>
    </section>
  )
}
