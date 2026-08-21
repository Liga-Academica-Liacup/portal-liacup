import type { Metadata } from 'next'
import { Botao } from '@/componentes/ui/Botao'
import { Campo } from '@/componentes/ui/Campo'
import { Cartao } from '@/componentes/ui/Cartao'
import { Etiqueta } from '@/componentes/ui/Etiqueta'
import { Icone } from '@/componentes/ui/Icone'
import { Separador } from '@/componentes/ui/Separador'
import { EstadoVazio } from '@/componentes/padroes/EstadoVazio'
import { Amostra, Secao } from './Secao'
import estilos from './page.module.css'

/*
 * Vitrine do design system.
 *
 * Não é página do site: mora no grupo de rotas (interno), não recebe link de
 * nenhuma página pública e não é indexada. É onde a liga revisa o sistema e
 * onde as quatro verificações automáticas rodam.
 *
 * Regra de crescimento: componente novo que não aparece aqui é entrega
 * incompleta.
 */
export const metadata: Metadata = {
  title: 'Vitrine do design system — Portal LIACUP',
  robots: { index: false, follow: false },
}

const TEXTO_LONGO = 'Cuidados paliativos na atenção primária à saúde da pessoa idosa'

export default function PaginaDaVitrine() {
  return (
    <main className={estilos.pagina}>
      <h1>Vitrine do design system</h1>

      <p className={estilos.aviso}>
        Página interna. Não faz parte do site público, não recebe link de nenhuma página pública e
        não é indexada por buscador. Serve para revisar todos os componentes, em todas as variantes
        e em todos os estados, de uma vez só.
      </p>

      <Secao
        titulo="Botão"
        descricao="Quatro variantes. A de ícone mede 44 × 44 e exige rótulo acessível."
      >
        <Amostra rotulo="Variantes">
          <Botao>Primário</Botao>
          <Botao variante="secundario">Secundário</Botao>
          <Botao variante="fantasma">Fantasma</Botao>
          <Botao variante="icone" aria-label="Fechar aviso">
            <Icone nome="email" />
          </Botao>
        </Amostra>

        <Amostra rotulo="Desabilitado — medido em 1,86:1 no primário, isento e aceito (ADR-0004)">
          <Botao disabled>Primário</Botao>
          <Botao variante="secundario" disabled>
            Secundário
          </Botao>
          <Botao variante="fantasma" disabled>
            Fantasma
          </Botao>
        </Amostra>

        <Amostra rotulo="Largura total">
          <Botao larguraTotal>Enviar mensagem</Botao>
        </Amostra>
      </Secao>

      <Secao
        titulo="Linha de inscrição — o par que se desfez"
        descricao="O comentário do .btn no liacup.css diz que os 14 px do botão existiam para casar com os 14 px do campo, porque os dois ficam lado a lado aqui. O campo subiu para 16 px por acessibilidade (ADR-0004 2.2) e o botão ficou em 14 px por fidelidade (2.3). Este bloco existe para que a diferença seja vista, não deduzida."
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

      <Secao titulo="Cartão" descricao="Composição por partes nomeadas, todas opcionais.">
        <Amostra rotulo="Completo">
          <Cartao>
            <Cartao.Kicker>Notícia</Cartao.Kicker>
            <Cartao.Titulo>Jornada do Julho Verde</Cartao.Titulo>
            <Cartao.Corpo>Um resumo curto do que aconteceu no evento.</Cartao.Corpo>
            <Cartao.Meta>
              20/08/2026 <Etiqueta variante="destaque">Extensão</Etiqueta>
            </Cartao.Meta>
          </Cartao>
        </Amostra>

        <Amostra rotulo="Sem título">
          <Cartao>
            <Cartao.Kicker>Aviso</Cartao.Kicker>
            <Cartao.Corpo>Cartão sem título continua com espaçamento correto.</Cartao.Corpo>
          </Cartao>
        </Amostra>

        <Amostra rotulo="Sem corpo">
          <Cartao>
            <Cartao.Titulo>Somente o título</Cartao.Titulo>
            <Cartao.Meta>20/08/2026</Cartao.Meta>
          </Cartao>
        </Amostra>

        <Amostra rotulo="Só metadados">
          <Cartao>
            <Cartao.Meta>Somente metadados</Cartao.Meta>
          </Cartao>
        </Amostra>

        <Amostra rotulo="Elevações: nenhuma, sm, md, lg">
          <Cartao>
            <Cartao.Corpo>nenhuma</Cartao.Corpo>
          </Cartao>
          <Cartao elevacao="sm">
            <Cartao.Corpo>sm</Cartao.Corpo>
          </Cartao>
          <Cartao elevacao="md">
            <Cartao.Corpo>md</Cartao.Corpo>
          </Cartao>
          <Cartao elevacao="lg">
            <Cartao.Corpo>lg</Cartao.Corpo>
          </Cartao>
        </Amostra>
      </Secao>

      <Secao titulo="Etiqueta" descricao="Classifica. Não é interativa.">
        <Amostra rotulo="Variantes">
          <Etiqueta variante="destaque">Destaque</Etiqueta>
          <Etiqueta variante="apoio">Apoio</Etiqueta>
          <Etiqueta variante="neutra">Neutra</Etiqueta>
          <Etiqueta variante="contorno">Contorno</Etiqueta>
        </Amostra>

        <Amostra rotulo="Texto longo — quebra linha em vez de empurrar a página">
          <Etiqueta variante="neutra">{TEXTO_LONGO}</Etiqueta>
        </Amostra>
      </Secao>

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

      <Secao titulo="Separador" descricao="Decorativo por padrão; semântico quando divide assunto.">
        <Amostra rotulo="Decorativo — não anunciado">
          <div className={estilos.blocoLargo}>
            <Separador />
          </div>
        </Amostra>
        <Amostra rotulo="Semântico — anunciado">
          <div className={estilos.blocoLargo}>
            <Separador decorativo={false} />
          </div>
        </Amostra>
      </Secao>

      <Secao titulo="Ícone" descricao="Sempre decorativo, sempre acompanhado de texto.">
        <Amostra rotulo="As duas variantes">
          <Icone nome="instagram" />
          <Icone nome="email" />
        </Amostra>
      </Secao>

      <Secao titulo="Estado vazio" descricao="Carregando, vazio e erro.">
        <Amostra rotulo="Tom status">
          <EstadoVazio
            titulo="Nada publicado ainda"
            descricao="Quando houver conteúdo, aparece aqui."
          />
        </Amostra>
        <Amostra rotulo="Tom alerta">
          <EstadoVazio
            tom="alerta"
            titulo="Não foi possível carregar"
            descricao="Tente novamente em alguns instantes."
          />
        </Amostra>
      </Secao>
    </main>
  )
}
