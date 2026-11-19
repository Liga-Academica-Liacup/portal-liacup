# Tarefas — protótipo no repositório

15 tarefas — o teto da constitution. Decisões do Portão 1 já aplicadas: 11 páginas e 23 arquivos,
prints versionados com a exceção do RP-13, menu aberto sobre Contato. Comandos em sintaxe de bash
(Git Bash). Quem implementa as seções 1 a 3.1 é o `dev-frontend`, com escopo exatamente
`scripts/prints-do-prototipo.mjs`, a linha do script no `package.json`, `prototipo/prints/` e
`prototipo/README.md`; a 3.2 é do líder técnico.

## 1. O script

- [x] 1.1 Escrever `scripts/prints-do-prototipo.mjs` com a lista nominal das 11 páginas, os
      rótulos do cabeçalho, os títulos esperados e os nomes de arquivo do `design.md` D3, abrindo
      o protótipo por `file://` a partir da raiz do projeto. Verificar: `node --check
      scripts/prints-do-prototipo.mjs` e `npx eslint scripts/prints-do-prototipo.mjs` com código 0
- [x] 1.2 Navegação em 1280 px por clique no cabeçalho — Processo seletivo pelo botão de destaque,
      com o clique restrito ao cabeçalho —, esperando o `<h1>` de cada página antes do print, e
      Contato por último. Verificar: a saída do script lista, por página, o título encontrado, e
      os 11 conferem com a tabela do D3
- [ ] 1.3 Determinismo do D4 — janela fixa, escala 1, contexto novo, fontes carregadas, redução de
      movimento, animações e transições desligadas, cursor escondido. Verificar abrindo
      `inicio-1280.png`, `inicio-390.png` e `menu-aberto-390.png`: borboletas e conteúdo em
      opacidade plena, títulos em Caprasimo, nenhuma página em transição
- [x] 1.4 Print em 390 × 844 de página inteira para cada página, voltando a 1280 px antes da
      seguinte, e o menu aberto sobre Contato na área visível. Verificar a largura e a altura
      lidas do cabeçalho de cada PNG com `node -e` (bytes 16 a 23): todo `-1280` com 1280 de
      largura, todo `-390` com 390, e `menu-aberto-390.png` com 390 × 844
- [ ] 1.5 Contador, estranhos e falha (RP-12, D5): imprimir `gerados: N de 23` e os que faltaram,
      depois `estranhos: N` e o nome de cada PNG da pasta fora dos 23; código 1 se N < 23 ou se
      houver estranho; nada é apagado. Verificar com quatro execuções registradas, cada uma com
      `echo $?`: título esperado trocado por um inexistente (`22 de 23`, nomeia o print, 1);
      troca desfeita (`23 de 23`, 0); um PNG estranho copiado para `prototipo/prints/`
      (`estranhos: 1`, nomeia o arquivo, 1); estranho removido (`estranhos: 0`, 0)

## 2. O comando e o gabarito

- [x] 2.1 Acrescentar `"prints:prototipo"` ao `package.json`, encadeando a conferência do
      navegador (D2). Verificar: `npm run prints:prototipo; echo $?` imprime `23 de 23`,
      `estranhos: 0` e 0; `git diff --exit-code package-lock.json` com código 0; contagem de
      dependências diretas igual a 22 antes e depois
- [ ] 2.2 Rodar o comando para substituir os prints do gestor. Verificar: `ls prototipo/prints |
      wc -l` = 23; `git status --porcelain prototipo/prints` com 21 linhas ` M` e 2 `??`
      (`processo-seletivo-1280.png` e `processo-seletivo-390.png`), nenhuma ` D`; o lado a lado
      antigo × novo de `inicio` e `contato` em 1280 px anexado ao relatório
- [ ] 2.3 Rodar duas vezes seguidas. Verificar: `ls prototipo/prints` antes e depois da segunda
      execução, comparados com `diff`, sem diferença, com 23 nomes (critério); `sha256sum` das duas
      rodadas comparado e o número de arquivos byte a byte iguais registrado no relatório
      (informativo, D4)
- [x] 2.4 Navegador ausente: `PLAYWRIGHT_BROWSERS_PATH="$(mktemp -d)" npm run prints:prototipo;
      echo $?`. Verificar: mensagem em português com o comando de instalação, código diferente de
      zero, e `git status --porcelain prototipo/prints` igual ao de antes
- [x] 2.5 Protótipo intacto. Verificar: `git status --porcelain prototipo/Portal-LIACUP.html`
      vazio depois de todas as execuções acima

## 3. Documentação e a exceção do RP-13

- [x] 3.1 Escrever `prototipo/README.md` em cinco linhas (D7), com o link
      `https://claude.ai/artifact/2JaFVq33WLXjsx8bvV17xY` e o comando `npm run prints:prototipo`.
      Verificar: `grep -c . prototipo/README.md` = 5, `grep -c "2JaFVq33WLXjsx8bvV17xY"` = 1 e
      `grep -c "prints:prototipo"` = 1
- [x] 3.2 **Líder técnico:** aplicar em `docs/PADROES-DE-CODIGO.md` §8.1 as duas edições do D6,
      literalmente. Verificar: `git diff docs/PADROES-DE-CODIGO.md` mostra só a troca de
      "Hoje é **uma**:" por "Hoje são **duas**:" e o acréscimo do D6; `npm run verificar:artefatos`
      com código 0 e os contadores dele na entrega; `git diff --stat scripts/verificar-artefatos.mjs`
      vazio

## 4. Conferência e entrega

- [ ] 4.1 Rodar `npm run verificar` e registrar código e contadores de cada etapa no relatório
- [ ] 4.2 Chamar o `revisor` sobre o diff; verificar que o relatório dele traz quantos arquivos e
      critérios conferiu, e que `git status` depois da passagem não mudou
- [ ] 4.3 `openspec validate prototipo-no-repositorio --strict`, `openspec archive` antes do PR e
      `openspec validate --all --strict` de novo; entregar ao Gabriel no modelo do `CLAUDE.md`,
      com os comandos Git em bash e a mensagem em arquivo para `git commit -F`, incluindo no mesmo
      commit `docs/PLANO-DE-DESENVOLVIMENTO.md` e `docs/REFERENCIA-VISUAL.md`, já atualizados pelo
      gestor. Verificar: `openspec/specs/referencia-visual/spec.md` existe, a change está em
      `openspec/changes/archive/` e `git status --porcelain` lista os dois documentos do gestor
