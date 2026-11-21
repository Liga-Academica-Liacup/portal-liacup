/*
 * O Botao e o link com aparência de botão, lado a lado: um contrato visual só
 * (aparencia-de-botao.ts; design.md da pagina-processo-seletivo, D7).
 *
 * Este arquivo é o lugar único onde essa matriz vive. Variante nova ou estado
 * novo entra aqui, e a conferência de completude é contar linhas × colunas —
 * não caçar amostras espalhadas por uma página que só cresce.
 *
 * O que está parado na tela: o Botao em quatro variantes, em repouso,
 * desabilitado e com largura total; o link em três variantes (a de ícone é só
 * do Botao), em repouso e como página atual, com o sublinhado. O link não tem
 * desabilitado: link que não leva a lugar nenhum não é link.
 * O que só aparece com a mão: hover (passar o mouse, só onde há mouse),
 * pressionado (clicar ou tocar e segurar) e o anel de foco (Tab), nos dois.
 */
import Link from 'next/link'
import { Botao } from '@/componentes/ui/Botao'
import { aparenciaDeBotao } from '@/componentes/ui/aparencia-de-botao'
import { Icone } from '@/componentes/ui/Icone'
import { Amostra, Secao } from './Secao'

export function BotaoDemo() {
  return (
    <Secao
      titulo="Botão"
      descricao="O botão em quatro variantes e o link com aparência de botão em três, com as mesmas classes. A de ícone mede 44 × 44 e exige rótulo acessível pelo tipo, não por revisão. Hover, pressionado e foco aparecem com o mouse, o toque e o Tab."
    >
      <Amostra rotulo="Normal">
        <Botao>Primário</Botao>
        <Botao variante="secundario">Secundário</Botao>
        <Botao variante="fantasma">Fantasma</Botao>
        <Botao variante="icone" aria-label="Enviar e-mail">
          <Icone nome="email" />
        </Botao>
      </Amostra>

      <Amostra rotulo="Desabilitado — medidos sobre --color-bg: primário 1,86:1, secundário 2,72:1, ícone 2,10:1. Isentos do critério 1.4.3 e aceitos conscientemente (ADR-0004 §3)">
        <Botao disabled>Primário</Botao>
        <Botao variante="secundario" disabled>
          Secundário
        </Botao>
        <Botao variante="fantasma" disabled>
          Fantasma
        </Botao>
        <Botao variante="icone" aria-label="Enviar e-mail (desabilitado)" disabled>
          <Icone nome="email" />
        </Botao>
      </Amostra>

      <Amostra rotulo="Largura total — combina com qualquer variante, que é a justificativa da booleana no contrato">
        <Botao larguraTotal>Primário</Botao>
        <Botao variante="secundario" larguraTotal>
          Secundário
        </Botao>
        <Botao variante="fantasma" larguraTotal>
          Fantasma
        </Botao>
        <Botao variante="icone" aria-label="Enviar e-mail (largura total)" larguraTotal>
          <Icone nome="email" />
        </Botao>
      </Amostra>

      <Amostra rotulo="Link com aparência de botão, em repouso — navega, por isso é <a> e não <button>">
        <Link href="/vitrine" className={aparenciaDeBotao('primario')}>
          Primário
        </Link>
        <Link href="/vitrine" className={aparenciaDeBotao('secundario')}>
          Secundário
        </Link>
        <Link href="/vitrine" className={aparenciaDeBotao('fantasma')}>
          Fantasma
        </Link>
      </Amostra>

      <Amostra rotulo='Link com aparência de botão, página atual — aria-current="page" e o sublinhado, para não depender só da cor'>
        <Link href="/vitrine" aria-current="page" className={aparenciaDeBotao('primario')}>
          Primário
        </Link>
        <Link href="/vitrine" aria-current="page" className={aparenciaDeBotao('secundario')}>
          Secundário
        </Link>
        <Link href="/vitrine" aria-current="page" className={aparenciaDeBotao('fantasma')}>
          Fantasma
        </Link>
      </Amostra>
    </Secao>
  )
}
