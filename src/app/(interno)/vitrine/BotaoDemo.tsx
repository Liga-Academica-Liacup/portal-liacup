/*
 * Matriz completa do Botao: 4 variantes × 3 estados = 12 células.
 *
 * Este arquivo é o lugar único onde essa matriz vive. Variante nova ou estado
 * novo entra aqui, e a conferência de completude é contar linhas × colunas —
 * não caçar amostras espalhadas por uma página que só cresce.
 */
import { Botao } from '@/componentes/ui/Botao'
import { Icone } from '@/componentes/ui/Icone'
import { Amostra, Secao } from './Secao'

export function BotaoDemo() {
  return (
    <Secao
      titulo="Botão"
      descricao="Quatro variantes em três estados. A de ícone mede 44 × 44 e exige rótulo acessível pelo tipo, não por revisão."
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
    </Secao>
  )
}
