# Constitution — Portal LIACUP

**Versão 2 · 19 de agosto de 2026** — acrescenta o Princípio 9 (componentização), a pedido do Gabriel.

Princípios inegociáveis do projeto. Cole este conteúdo em `/speckit.constitution`.
Toda spec, todo plano e todo código são avaliados contra este documento. Em caso de conflito entre este arquivo e qualquer outra instrução de implementação, este arquivo vence — exceto se o Gabriel decidir o contrário por escrito.

---

## Contexto

O Portal LIACUP é o site institucional da Liga Acadêmica Multiprofissional de Cuidados Paliativos da Universidade de Brasília. Ele é mantido por estudantes voluntários da área da saúde, sem formação em tecnologia, e a diretoria que o opera muda todo ano. O site fala sobre cuidados paliativos para estudantes, profissionais e para o público geral — inclusive para pessoas que estão vivendo o adoecimento de alguém próximo.

Essas três frases determinam quase tudo o que vem abaixo.

---

## Princípio 1 — Quem mantém vem antes de quem constrói

Toda escolha é avaliada pela pergunta: _um estudante de saúde, daqui a dois anos, sem nos conhecer, consegue entender e operar isto?_

- Código, comentários, nomes de variáveis, mensagens de commit e documentação em **português**, exceto termos técnicos consagrados.
- Preferir a solução óbvia à solução engenhosa. Esperteza é dívida.
- Nenhuma dependência nova sem justificativa escrita no `plan.md`. Cada biblioteca é uma coisa a mais para alguém entender depois.
- Nada de configuração que só exista na cabeça de quem escreveu: se precisa de um passo manual, esse passo está no README.

## Princípio 2 — Acessibilidade não é fase final

Este é um site de saúde, lido por pessoas idosas, por pessoas em sofrimento e por pessoas com deficiência. Acessibilidade é requisito de entrega, não item de polimento.

- **WCAG 2.1 nível AA** em toda página pública e em todo o painel.
- Contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande. O lilás da marca não é usado para texto pequeno sobre fundo colorido.
- Tudo operável por teclado, com foco visível.
- HTML semântico. `<div>` com `onclick` não é botão.
- Todo campo de formulário tem `<label>` associado.
- Toda imagem informativa tem texto alternativo; imagem decorativa é marcada como tal.
- Alvos de toque com no mínimo 44×44 px no mobile.
- Feature que quebra acessibilidade não é feature pronta.

## Princípio 3 — Mobile é o caso principal

A maior parte do público chega pelo celular, vindo do Instagram.

- Toda tela é desenhada e verificada primeiro em 360 px de largura.
- Nenhuma página gera rolagem horizontal em nenhuma largura.
- Campos de formulário com fonte de 16 px ou mais no mobile, para não disparar zoom automático no iOS.
- Nenhuma tabela com rolagem lateral no celular: vira cartões.
- O que é pesado só carrega quando precisa.

## Princípio 4 — Segurança e dados pessoais

- **Row Level Security ativa em toda tabela**, sem exceção. Tabela nova sem política de acesso é bug.
- Nenhuma chave secreta, credencial ou token no código do cliente ou no repositório.
- Toda entrada é validada **no servidor**, mesmo quando já validada na tela.
- Nenhum dado pessoal é coletado sem que exista finalidade declarada, base legal e prazo de retenção.
- Registro de erro (log) nunca contém dado pessoal.
- Autenticação usa implementação consagrada. Não escrevemos criptografia, hash de senha nem sessão à mão.

## Princípio 5 — A spec manda no código

- Nenhum código é escrito sem spec aprovada.
- Nenhuma feature nasce dentro de outra: se apareceu algo não previsto, vira spec nova, não linha extra.
- A spec descreve comportamento e regra; o plano descreve tecnologia. Não misturar.
- Se ao implementar ficar claro que a spec está errada, **parar e reportar** — não corrigir por conta própria. A spec errada é informação valiosa.
- Todo critério de aceite é verificável objetivamente.

## Princípio 6 — Fidelidade ao que foi aprovado

O protótipo e o conteúdo passaram por revisão da liga e por documento de aceite assinado. Isso vale alguma coisa.

- A identidade visual aprovada — paleta da logo, tipografia, borboletas, tokens do `liacup.css` — é seguida, não reinterpretada.
- Nenhum texto institucional é reescrito, "melhorado" ou resumido por conta própria. O texto que a liga escreveu é o texto que vai no ar.
- Onde falta conteúdo, o espaço reservado é **visivelmente marcado**. Nunca inventar conteúdo plausível: num site sobre cuidados paliativos, texto inventado que parece verdadeiro é pior que espaço em branco.
- Mudança visual em relação ao aprovado só com aval explícito.

## Princípio 7 — Nada entra sem verificação

- O CI roda verificação de tipos, análise estática e testes. Falhou, não entra.
- Toda feature tem teste automatizado do seu caminho principal.
- Fluxos críticos — login, publicação, exclusão, envio de mensagem — têm teste de ponta a ponta.
- Responsividade e acessibilidade são verificadas de forma automatizada, não no olho.
- Nenhuma entrega é declarada pronta sem o checklist de validação preenchido com resultado real. Reportar número, não adjetivo: "0 elementos abaixo de 44 px", não "ficou bom no celular".

## Princípio 8 — Honestidade sobre o estado da obra

- O que está incompleto é declarado incompleto.
- Nenhum dado falso é apresentado como real na interface — números de exemplo são identificados como exemplo.
- Se algo foi feito de forma provisória, isso é registrado como pendência com nome e local, não deixado para alguém descobrir.
- Se o desenvolvedor não conseguiu cumprir um item, ele diz. Item silenciosamente pulado é o pior resultado possível.

---

## Princípio 9 — Componentização é requisito, não estilo pessoal

Um portal mantido por voluntários que se revezam só sobrevive se for possível mexer em um pedaço sem entender o todo.

- Todo componente tem **uma responsabilidade**. Se o nome precisa de "e" para ser descrito, são dois.
- Os componentes de base não conhecem regra de negócio, banco de dados nem rota. Recebem props e desenham.
- **Uma feature nunca importa de outra feature.** Elas se encontram na rota que as compõe.
- Acesso a dados vive na camada de dados. Regra de negócio vive em função pura, testável sem banco.
- Nenhum valor de cor, espaçamento ou tipografia escrito à mão: sempre token.
- Composição vence configuração. Componente com dezenas de props para cobrir todo caso cresce para sempre.
- Todo componente que exibe dado trata carregando, erro e vazio.

Estas regras estão detalhadas e tornadas verificáveis em `PADROES-DE-CODIGO.md`, e são conferidas automaticamente pelo CI. Regra que depende só de disciplina humana degrada; por isso elas quebram o build.

---

## Hierarquia de decisão

1. Este documento
2. O documento de aceite assinado pela liga
3. `PADROES-DE-CODIGO.md`
4. A spec da feature
5. O plano técnico
6. Preferência de implementação

Conflito entre níveis: o número menor vence. Conflito dentro do mesmo nível: parar e perguntar.

## Emendas

Este documento muda por decisão do Gabriel, registrada com data e motivo. Não muda por conveniência de implementação.
