/*
 * Os onze estados do Campo. É o componente com mais superfície de
 * acessibilidade do conjunto, e os casos de borda da spec vivem aqui: erro
 * combinado com desabilitado, rótulo escondido, e dois campos com o mesmo
 * rótulo — se não aparecem, ninguém nunca os vê.
 */
import { Campo } from '@/componentes/ui/Campo'
import { Amostra, Secao } from './Secao'

export function CampoDemo() {
  return (
    <Secao titulo="Campo de formulário" descricao="16 px de fonte e 44 px de altura.">
      <Amostra rotulo="Texto, e-mail e várias linhas">
        <Campo rotulo="Seu nome" />
        <Campo rotulo="Seu e-mail" tipo="email" />
        <Campo rotulo="Sua mensagem" tipo="textarea" />
      </Amostra>

      <Amostra rotulo="Com ajuda">
        <Campo rotulo="Seu e-mail" tipo="email" ajuda="Usamos só para responder você." />
      </Amostra>

      <Amostra rotulo="Com erro — texto e ícone, não só cor">
        <Campo rotulo="Seu e-mail" tipo="email" erro="Informe um e-mail válido." />
      </Amostra>

      <Amostra rotulo="Desabilitado">
        <Campo rotulo="Seu nome" desabilitado />
      </Amostra>

      <Amostra rotulo="Erro e desabilitado — o erro continua visível">
        <Campo rotulo="Seu nome" erro="Campo obrigatório." desabilitado />
      </Amostra>

      <Amostra rotulo="Rótulo escondido da tela, presente para leitor de tela">
        <Campo rotulo="Buscar no site" rotuloEscondido placeholder="Buscar" />
      </Amostra>

      <Amostra rotulo="Dois campos com o mesmo rótulo — identificadores distintos">
        <Campo rotulo="Telefone" />
        <Campo rotulo="Telefone" />
      </Amostra>
    </Secao>
  )
}
