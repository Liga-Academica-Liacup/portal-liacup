# Histórico da fase anterior (agosto de 2026)

**Data:** 18 de novembro de 2026
Resumo do que foi construído entre 12/08 e 31/08/2026, antes da reorganização. Os documentos de rodada (vereditos de parada, decisões pontuais, runbook e briefings da F00 a F03) foram apagados deste projeto nesta data; o rastro técnico completo continua no repositório, nas pastas `specs/` e no histórico do Git.

## O que existe

| Entrega | Onde | Situação |
|---|---|---|
| Protótipo navegável (12 páginas e painel) | Claude Design | Aprovado pela liga; ainda fora do repositório |
| Documento de aceite v2 | `.docx` entregue à liga | Assinado |
| F00 · fundação, CI, deploy contínuo, página "Portal em construção" | `main`, PR #4 (teste de proteção) | No ar |
| F01 · 7 componentes de base e a vitrine em `/vitrine` | `main`, PR #5 | Será refeita a partir do protótipo |
| ADR-0005 · modelo de branches | `main`, PR #6 | Vale com o ajuste de branches curtas |
| F02 · 13 tabelas, RLS, concessões, purga, dados de exemplo | `main`, PR #9 | Dormente até a R2 |
| RP-13 · artefato gerado fora do controle de versão | `main`, PR #10 | Sai do caminho obrigatório do CI |
| F03 · cabeçalho, menu lateral, rodapé, dez rotas vazias | `feat/F03-layout-base`, 23 commits, não incorporada | Vira a tag `arquivo/F03-layout-base` |

Na `main` há também `docs/` com ADR-0001 a 0005, constitution v2, padrões, conteúdo institucional e divergências. O `docs/OPERACAO-GIT.md` existe só na branch da F03.

## O que se aprendeu e continua valendo

1. **Verificação que passa não prova nada se não foi vista falhando.** O CI da F00 chegou a passar sem checar nada.
2. **Medir a configuração não é medir o resultado.** O banco dizia "RLS ativo, 4 políticas" enquanto recusava tudo, porque faltavam as concessões de tabela. Teste de recusa precisa de teste de permissão no mesmo caminho.
3. **Trabalho que não está no remoto não existe.** Cinco episódios: stash automático do GitHub Desktop, arquivos nunca commitados, commits não enviados, branch apagada com `-D`, planejamento inteiro solto no disco. As regras estão em `equipe-de-agentes.md`, seção 6.
4. **Fidelidade conferida propriedade por propriedade não garante a tela.** Cada ajuste justificado, conjunto diferente do protótipo. Por isso a comparação passa a ser por print.
5. **Processo também precisa de limite.** Specs de 400 linhas e três paradas por feature produziram rigor e nenhuma página para a liga em três meses.

## Números do repositório em 18/11/2026 (branch da F03)

Código de produto em `src/`: cerca de 4.000 linhas · testes: 3.400 · scripts de verificação: 1.400 · specs: 9.500 · `docs/`: 2.900.
