import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Desligado de propósito (Q4 (c) da endurecer-agentes-e-git-local). Ligado, o `next dev` escreve
  // um AGENTS.md com instruções a agentes de IA sempre que detecta um na sessão, e esse arquivo é
  // configuração de agente fora da revisão (AS-17). Com `false`, o Next apaga o bloco dele e o
  // arquivo, se ficar vazio. A opção experimental de feedback de agente, que escreve no mesmo
  // arquivo, fica fora deste config, desligada. Voltar este valor a verdadeiro, tirá-lo ou ligar
  // aquela é decisão do Gabriel (AS-17).
  agentRules: false,
}

export default nextConfig
