# F00 — Fundação do projeto

**Primeira feature do Portal LIACUP.** Não entrega nada visível para a liga: entrega a máquina que garante qualidade em tudo o que vem depois. É a única feature em que vale gastar tempo com encanamento, porque ela é o que impede as outras vinte e cinco de degradarem.

**Pré-requisitos já atendidos:** contas de GitHub, Vercel, Supabase e Resend criadas no e-mail da liga; ADR-0001 e ADR-0002 validados; padrões de código e constitution definidos.
**Não depende de:** domínio pago, conteúdo da liga, Supabase configurado.

---

## Parte 1 — O que você roda antes (Gabriel)

O passo a passo completo, com os comandos para Windows e Git Bash, está em **`F00-runbook-gabriel.md`**. Em resumo: instalar as ferramentas, criar o repositório, rodar `specify init portal-liacup --integration claude` e conectar a Vercel.

Depois, dentro do Claude Code, na ordem:

1. `/speckit.constitution` — colando o conteúdo de `constitution.md`
2. `/speckit.specify` — colando a Parte 2 deste documento
3. `/speckit.plan`
4. `/speckit.tasks`
5. `/speckit.analyze`
6. `/speckit.implement`

Entre o 2 e o 3, e entre o 4 e o 5, **me mande o resultado**. São os dois pontos de parada do ciclo.

---

## Parte 2 — Texto para o `/speckit.specify`

> Estabelecer a fundação técnica do Portal LIACUP: o esqueleto do projeto, o sistema de verificação automática de qualidade e o fluxo de publicação contínua.
>
> Ao final desta feature, deve ser verdade que:
>
> **Sobre o projeto**
>
> - O projeto roda localmente com um único comando, a partir de um repositório recém-clonado, seguindo apenas o que está escrito no README.
> - A estrutura de pastas é exatamente a definida em `PADROES-DE-CODIGO.md`, seção 1, com todas as pastas criadas e um arquivo de exemplo em cada camada mostrando o que vai ali.
> - Existe uma página inicial provisória que exibe a logo da LIACUP e a frase "Portal em construção", usando as cores e a tipografia dos tokens. Ela existe só para provar que o caminho do código até o ar funciona.
> - Os tokens de design vêm do arquivo aprovado da liga e são a única fonte de cor, espaçamento, raio, sombra e tipografia.
>
> **Sobre a verificação automática**
>
> - Verificação de tipos, análise estática e formatação rodam por comando e não acusam nenhum problema no estado inicial.
> - A regra de dependência entre camadas é verificada automaticamente. Deve ser possível demonstrar que ela funciona: ao escrever um import proibido — por exemplo, um componente de base importando da camada de dados — a verificação falha e aponta o arquivo. Essa demonstração faz parte da entrega.
> - Existe verificação automática que falha quando alguém escreve cor ou medida à mão fora dos arquivos de token.
> - Existe pelo menos um teste de unidade e um teste de ponta a ponta, ambos passando. O teste de ponta a ponta abre a página inicial, confirma que ela carregou e roda uma verificação de acessibilidade que não acusa violação.
> - O teste de ponta a ponta verifica também que não há rolagem horizontal em 360, 768 e 1280 pixels de largura.
>
> **Sobre a publicação**
>
> - Toda alteração proposta dispara automaticamente todas as verificações acima.
> - Alteração com verificação falhando não pode ser incorporada ao ramo principal. Essa proteção está configurada, não apenas combinada.
> - Alteração incorporada ao ramo principal é publicada automaticamente, sem passo manual.
> - Toda alteração proposta gera um endereço de pré-visualização próprio, para revisão antes de incorporar.
>
> **Sobre quem vem depois**
>
> - O README explica, em português e para alguém que nunca viu o projeto: o que é o portal, como rodar, como testar, como publicar, onde ficam as decisões registradas e o que fazer quando uma verificação falha.
> - Existe um arquivo de exemplo listando todas as variáveis de ambiente necessárias, com explicação do que é cada uma. Nenhum segredo real está no repositório.
> - As decisões já tomadas (ADR-0001 e ADR-0002), os padrões de código, a constitution e o conteúdo institucional estão versionados dentro do repositório, em uma pasta de documentação.
>
> Restrições: nenhuma dependência além das necessárias para o que está descrito acima, e cada uma justificada no plano. Sem biblioteca de componentes de terceiros — o design system da liga é o nosso. Sem configuração de Supabase nesta feature: ela entra na F02.

---

## Parte 3 — O que eu vou validar

Além do checklist padrão, esta feature tem verificações próprias. Vou pedir evidência de cada uma:

| #   | Item                                           | Evidência que eu peço                                                           |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | Projeto roda do zero seguindo só o README      | Clonar em pasta limpa e rodar                                                   |
| 2   | Estrutura de pastas conforme os padrões        | Árvore de diretórios                                                            |
| 3   | **A regra de camadas realmente bloqueia**      | Saída da verificação falhando no import proibido, e passando depois de removido |
| 4   | **A verificação de tokens realmente bloqueia** | Mesma coisa: uma cor escrita à mão faz falhar                                   |
| 5   | Tipos, análise estática e formatação limpos    | Saída dos três comandos                                                         |
| 6   | Testes passando                                | Saída do teste de unidade e do de ponta a ponta                                 |
| 7   | Acessibilidade sem violação na página inicial  | Saída da verificação                                                            |
| 8   | Sem rolagem horizontal em 360, 768 e 1280      | Saída do teste                                                                  |
| 9   | **Alteração com erro é barrada de verdade**    | Uma proposta de alteração quebrada, mostrando o bloqueio                        |
| 10  | Publicação automática funciona                 | Endereço no ar com a página provisória                                          |
| 11  | Pré-visualização por alteração funciona        | Endereço de pré-visualização                                                    |
| 12  | Nenhum segredo no repositório                  | Varredura do histórico                                                          |
| 13  | README compreensível por quem não participou   | Leitura crítica                                                                 |
| 14  | Toda dependência justificada no plano          | Comparação da lista de dependências com o plano                                 |

Os itens **3, 4 e 9** são os que mais importam. Verificação que não foi vista falhando é verificação que ninguém sabe se funciona — e é assim que projeto passa seis meses com um CI verde que não checa nada.

---

## Parte 4 — Fora de escopo nesta feature

Supabase e banco de dados (F02) · qualquer página real do site (Fase 1) · autenticação (F14) · envio de e-mail (F13) · domínio próprio, que entra quando o registro estiver pago · conteúdo institucional, que já está escrito e só é versionado aqui.

---

## Parte 5 — Riscos desta feature

| Risco                                                       | Mitigação                                                      |
| ----------------------------------------------------------- | -------------------------------------------------------------- |
| Excesso de encanamento: gastar dias configurando ferramenta | O escopo acima é o teto. Nada além dele entra sem falar comigo |
| CI verde que não verifica nada                              | Itens 3, 4 e 9 da validação existem exatamente para isso       |
| Dependência demais entrando "porque é padrão"               | Toda dependência justificada no plano, e eu conto              |
| Free tier da Vercel: uso não comercial                      | Já registrado no ADR-0001 como risco R2, com plano B nomeado   |
