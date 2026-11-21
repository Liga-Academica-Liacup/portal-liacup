'use client'

/*
 * Link de navegação que sabe se leva à página atual.
 *
 * É a menor ilha cliente possível: só ele precisa ler o endereço da barra
 * (usePathname), para marcar a página atual com aria-current="page". O
 * cabeçalho e o rodapé continuam no servidor (PADROES-DE-CODIGO.md, 2.1).
 * A aparência da página atual fica no CSS de quem usa, pelo seletor
 * [aria-current='page'].
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type PropsDoLinkDaNavegacao = {
  /** Endereço da lista de páginas públicas. Ex.: "/sobre". */
  endereco: string
  children: ReactNode
  className?: string
  /** Chamado ao escolher o destino. O menu lateral usa para fechar. */
  aoEscolher?: () => void
}

export function LinkDaNavegacao({
  endereco,
  children,
  className = '',
  aoEscolher = undefined,
}: PropsDoLinkDaNavegacao) {
  const enderecoAtual = usePathname()

  return (
    <Link
      href={endereco}
      className={className}
      aria-current={enderecoAtual === endereco ? 'page' : undefined}
      onClick={aoEscolher}
    >
      {children}
    </Link>
  )
}
