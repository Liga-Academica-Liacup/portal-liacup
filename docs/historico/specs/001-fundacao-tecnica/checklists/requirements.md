# Checklist de qualidade da spec: Fundação técnica do Portal LIACUP (F00)

**Propósito**: validar a completude e a qualidade da especificação antes de seguir para o planejamento
**Criado em**: 2026-08-20 · **Revalidado em**: 2026-08-20 (após as seis emendas do Gabriel)
**Feature**: [spec.md](../spec.md)

## Qualidade do conteúdo

- [x] Sem detalhes de implementação (linguagens, frameworks, APIs)
- [x] Focado em valor para o usuário e necessidade do projeto
- [x] Escrito para quem não é da área técnica
- [x] Todas as seções obrigatórias preenchidas

## Completude dos requisitos

- [x] Nenhum marcador [NEEDS CLARIFICATION] restante
- [x] Requisitos testáveis e sem ambiguidade
- [x] Critérios de sucesso mensuráveis
- [x] Critérios de sucesso independentes de tecnologia
- [x] Todos os cenários de aceite definidos
- [x] Casos de borda identificados
- [x] Escopo claramente delimitado
- [x] Dependências e premissas identificadas

## Prontidão da feature

- [x] Todo requisito funcional tem critério de aceite claro
- [x] As histórias cobrem os fluxos principais
- [x] A feature atende aos resultados mensuráveis dos Critérios de Sucesso
- [x] Nenhum detalhe de implementação vaza para a especificação

## Notas

**Sobre "sem detalhes de implementação"** — item aprovado com ressalva consciente. Esta é uma
feature de infraestrutura cujo _assunto_ é a estrutura do repositório, e essa estrutura já está
fixada por documentos de governança anteriores à spec. Os requisitos funcionais descrevem
capacidade ("verificação automática de tipos", "endereço de pré-visualização"), nunca ferramenta.
As menções nominais a tecnologia estão confinadas às seções **Assumptions** e **Dependencies**,
como restrições preexistentes (ADR-0001) e não como escolha feita aqui. As referências a
`componentes/ui`, `dados.ts` e `regras.ts` são vocabulário da própria seção 1 de
`docs/PADROES-DE-CODIGO.md` — sem elas os FR-008 e FR-009 deixariam de ser verificáveis.

**Sobre os critérios de sucesso** — SC-002 a SC-014 são todos contáveis (zero problemas, zero
violações, zero requisições externas, número de dependências, duas execuções com resultados
opostos), conforme o Princípio VII: "reportar número, não adjetivo".

## Emendas aplicadas (2026-08-20)

Seis emendas do Gabriel, aplicadas de forma cirúrgica sem reescrever o restante do documento:

| #   | Emenda                                                                        | Onde                                                                                      |
| --- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Larguras passam de 3 para **7** (360, 390, 430, 480, 768, 1024, 1280 px)      | US3 cenário 4 · FR-015 · SC-007 · Assumptions                                             |
| 2   | Tokens vêm do `liacup.css` com as correções do **ADR-0003**                   | FR-006 reescrito · **FR-026** (reatribuições) · **FR-027** (fontes próprias) · **SC-014** |
| 3   | Paridade **Windows/Linux**                                                    | novo caso de borda · **FR-028**                                                           |
| 4   | **Medidor por página** no CI (desempenho ≥ 90, acessibilidade ≥ 95)           | **FR-029**                                                                                |
| 5   | Branch da feature passa a ser **`main`**, como exceção de arranque            | cabeçalho · Assumptions                                                                   |
| 6   | `liacup.css` **deixa de ser bloqueio**; ADR-0003 entra como origem dos tokens | Dependencies                                                                              |

Totais após as emendas: **29 requisitos funcionais** (era 25) e **14 critérios de sucesso**
(era 13). A numeração dos FR não é sequencial na leitura do documento — FR-026 e FR-027 ficam
junto ao FR-006, na seção de tokens, e FR-028 e FR-029 junto às demais verificações. A
numeração pedida foi preservada; a posição segue o assunto.

**Divergência de larguras — encerrada.** Reportada na versão anterior (3 na spec contra 6 no
`docs/checklist-validacao.md`, item C1), foi decidida pelo Gabriel em 7 larguras: as 6 do
checklist mais 480 px, ponto de corte previsto nos padrões de código. A spec agora é o
superconjunto das duas listas.

**Bloqueio anterior — encerrado.** O `liacup.css` está no repositório e vai para
`src/estilos/tokens.css`. O FR-006 não depende mais de entrega externa.

## Pendência encerrada

**O ADR-0003 está em `docs/ADR-0003-tokens-e-acessibilidade.md`** desde 20/08/2026. O FR-026 e o
FR-024 não têm mais bloqueio. O documento confirma as quatro trocas de token com as razões de
contraste medidas (3,48:1 → 4,84:1 no botão; 3,48:1 → 6,91:1 no link; 3,61:1 → 5,53:1 no texto
secundário; 2,37:1 → 5,43:1 no verde) e a remoção do `@import` do Google.

**Veredito**: 16 de 16 itens aprovados. Spec emendada e pronta para `/speckit-plan`.
