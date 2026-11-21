/*
 * O rodapé de toda página pública, como no protótipo aprovado, com os dados
 * certos da liga (REFERENCIA-VISUAL.md, seções 6 e 7).
 *
 * Não é o Rodape.tsx: aquele é o da página "Portal em construção", que não muda
 * até a lancamento-r1 (design.md da layout-e-hero, D1).
 *
 * As colunas "Portal" e "Conteúdo" leem a lista única de páginas públicas, e
 * coluna sem página não aparece, nem o título dela. Sem "Painel da diretoria"
 * (o painel é da R3) e sem a linha de demonstração do protótipo.
 *
 * Na coluna de contato, cada item tem um ícone decorativo ao lado, e o endereço
 * não é link (REFERENCIA-VISUAL.md, seção 7, regras de 21/11).
 *
 * O ano é o da compilação, e não um número escrito: escrito, ele ficaria falso
 * em janeiro sem ninguém perceber, e o site se compila a cada change.
 */
import Image from 'next/image'
import Link from 'next/link'
import { Icone } from '@/componentes/ui/Icone'
import { COLUNAS_DO_RODAPE, paginasDaColuna } from '@/lib/utils/paginas-publicas'
import { IconeDeLocalizacao } from './IconeDeLocalizacao'
import estilos from './RodapePublico.module.css'

export function RodapePublico() {
  const colunas = COLUNAS_DO_RODAPE.map((titulo) => ({
    titulo,
    paginas: paginasDaColuna(titulo),
  })).filter((coluna) => coluna.paginas.length > 0)
  const ano = new Date().getFullYear()

  return (
    <footer className={estilos.rodape}>
      <div className={estilos.colunas}>
        <div>
          <div className={estilos.marca}>
            <Image
              src="/logo-liacup-256.png"
              alt=""
              width={44}
              height={44}
              className={estilos.logo}
            />
            <span className={estilos.sigla}>LIACUP</span>
          </div>
          <p className={estilos.nomeDaLiga}>
            Liga Acadêmica Multiprofissional de Cuidados Paliativos · Universidade de Brasília.
          </p>
        </div>

        {colunas.map((coluna, indice) => (
          <nav key={coluna.titulo} aria-labelledby={`rodape-coluna-${indice}`}>
            <h2 id={`rodape-coluna-${indice}`} className={estilos.tituloDaColuna}>
              {coluna.titulo}
            </h2>
            <ul className={estilos.itens}>
              {coluna.paginas.map((pagina) => (
                <li key={pagina.endereco}>
                  <Link href={pagina.endereco} className={estilos.link}>
                    {pagina.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className={estilos.contato}>
          <h2 className={estilos.tituloDaColuna}>Contato</h2>
          <address className={`${estilos.itens} ${estilos.itensDeContato}`}>
            <a
              className={estilos.link}
              href="https://www.instagram.com/liacup.unb/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da LIACUP, @liacup.unb (abre em nova aba)"
            >
              <Icone nome="instagram" />
              <span>liacup.unb</span>
            </a>
            <a
              className={estilos.link}
              href="mailto:liacup.unb@gmail.com"
              aria-label="Escrever um e-mail para liacup.unb@gmail.com"
            >
              <Icone nome="email" />
              <span>liacup.unb@gmail.com</span>
            </a>
            <span className={estilos.endereco}>
              <IconeDeLocalizacao />
              <span>FCTS · Campus UnB Ceilândia · Brasília/DF</span>
            </span>
          </address>
        </div>
      </div>

      <div className={estilos.linhaFinal}>
        <span>© {ano} LIACUP · Universidade de Brasília</span>
      </div>
    </footer>
  )
}
