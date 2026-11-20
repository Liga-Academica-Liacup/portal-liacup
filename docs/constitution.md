# Constitution · Portal LIACUP

**Versão 3.1 · 19 de novembro de 2026** · a v3 foi aprovada pelo Gabriel junto com o plano v7 em 18/11; a 3.1 acrescenta o `docs/SEGURANCA.md` à hierarquia (decisão do Gabriel na Q3 da change `montar-guardiao-appsec`)

A v3 encurta a v2 (19/08/2026): mantém os princípios de produto, troca o Spec Kit pelo OpenSpec e tira as regras que tinham virado verificação da verificação. Este texto alimenta o contexto do projeto no OpenSpec e o `CLAUDE.md` do repositório.

---

## Contexto

O Portal LIACUP é o site da Liga Acadêmica Multiprofissional de Cuidados Paliativos da Universidade de Brasília. É mantido por estudantes da saúde, sem formação em tecnologia, e a diretoria muda todo ano. O público inclui estudantes, profissionais e pessoas vivendo o adoecimento de alguém próximo, e a maioria chega pelo celular, vinda do Instagram.

## 1. Quem mantém vem antes de quem constrói

- Código, nomes, comentários, commits e documentação em português, salvo termo técnico consagrado.
- A solução óbvia vence a engenhosa.
- Dependência nova só com motivo escrito na proposta da change.
- Passo manual que existir está escrito no README.

## 2. Acessibilidade faz parte da entrega

- WCAG 2.1 AA em toda página. Pares de cor conforme o ADR-0003: o lilás `#9B6AAF` não carrega texto pequeno.
- Tudo operável por teclado, com foco visível. HTML semântico.
- Alvo de toque de pelo menos 44 × 44 px. Campo de formulário com fonte de 16 px.
- Toda imagem informativa tem texto alternativo.

## 3. O celular é o caso principal

- Toda tela é conferida primeiro em 360 e 390 px.
- Nenhuma página tem rolagem horizontal em nenhuma largura.
- Tabela vira cartões no celular.

## 4. O protótipo aprovado é a referência visual

- O design do protótipo foi aprovado pela liga e não muda. A referência é a **tela** do protótipo, não uma classe de CSS isolada. A fidelidade se confere com print do protótipo ao lado do print do site, nas mesmas larguras.
- Melhorias de UI e UX são bem-vindas, mostradas lado a lado no PR e aprovadas pelo Gabriel. Paleta, fontes, borboletas e a estrutura das páginas não mudam.
- O site é responsivo em toda largura, não só nas larguras dos prints.
- As adaptações de acessibilidade listadas em `referencia-visual.md` entram sem perguntar.
- Nenhum valor de cor, espaçamento, raio, sombra ou tipografia escrito à mão: sempre token.

## 5. O texto da liga vai ao ar como está

- O conteúdo vem de `conteudo-institucional.md`. Nada é reescrito, resumido ou "melhorado".
- Nada é inventado. Num site sobre cuidados paliativos, texto plausível e falso é pior que ausência.
- Conteúdo pendente da liga não segura entrega: vai o que está aprovado no `conteudo-institucional.md`, a liga vê e ajustamos depois.

## 6. Segurança e dados pessoais

- Row Level Security em toda tabela. Nenhum segredo no cliente ou no repositório.
- Toda entrada validada no servidor.
- Nenhum dado pessoal coletado sem finalidade, base legal e prazo de retenção declarados.
- Autenticação por implementação consagrada (Supabase Auth).

## 7. Spec antes de código, e spec pequena

- Nenhum código sem proposta do OpenSpec aprovada pelo Gabriel.
- A proposta descreve comportamento e critério de aceite; o design técnico fica em `design.md`.
- A proposta cabe em cinco minutos de leitura e a change tem no máximo umas quinze tarefas. Passou disso, vira duas changes.
- Se a spec estiver errada, o agente para e reporta. Não corrige por conta própria.

## 8. Entrega pequena e frequente

- Toda change deixa a `main` publicável e chega à `main` em poucos dias.
- O que ainda não deve aparecer fica atrás do interruptor `SITE_PUBLICADO`, nunca numa branch longa.
- O menu mostra só página que existe. Nenhuma rota vazia.

## 9. Componentização

- Um componente, uma responsabilidade, até 150 linhas.
- Componentes de base não conhecem banco, rota nem regra de negócio.
- Uma feature nunca importa de outra. Acesso a dado só na camada de dados.
- Todo componente que mostra dado trata carregando, erro e vazio.

## 10. Honestidade sobre o estado da obra

- O incompleto é declarado incompleto.
- Relatório com número quando houver número.
- Item pulado é dito, nunca silenciado.

---

## Hierarquia

1. Esta constitution
2. O documento de aceite assinado pela liga
3. `docs/PADROES-DE-CODIGO.md`, `docs/REFERENCIA-VISUAL.md` e `docs/SEGURANCA.md` (o checklist de segurança AS-01 a AS-16 mora neste)
4. A proposta e as specs da change
5. O `design.md` da change
6. Preferência de implementação

Conflito entre níveis: vence o número menor. Conflito no mesmo nível: parar e perguntar ao Gabriel.

A constitution muda por decisão do Gabriel, registrada com data e motivo.
