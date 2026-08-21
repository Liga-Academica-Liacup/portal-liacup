/*
 * A "linha de inscrição" que o comentário original da .btn descreve.
 *
 * Existe para tornar VISÍVEL o par que se desfez: o campo subiu para 16 px por
 * acessibilidade (ADR-0004 2.2) e o botão ficou em 14 px por fidelidade (2.3).
 * Sem este bloco, a única regressão visual comprovada da decisão 2.2 não
 * apareceria em lugar nenhum da verificação.
 */
import { Botao } from '@/componentes/ui/Botao'
import { Campo } from '@/componentes/ui/Campo'
import { Amostra, Secao } from './Secao'
import estilos from './page.module.css'

export function LinhaDeInscricaoDemo() {
  return (
    <Secao
      titulo="Linha de inscrição — o par que se desfez"
      descricao="O comentário da .btn no liacup.css diz que os 14 px do botão existiam para casar com os 14 px do campo, porque os dois ficam lado a lado aqui. Este bloco existe para que a diferença seja vista, não deduzida."
    >
      <Amostra rotulo="Campo de 16 px ao lado de botão de 14 px">
        <div className={estilos.linhaDeInscricao}>
          <div className={estilos.colunaDoCampo}>
            <Campo rotulo="Seu e-mail" tipo="email" placeholder="voce@exemplo.com" />
          </div>
          <Botao>Inscrever</Botao>
        </div>
      </Amostra>
    </Secao>
  )
}
