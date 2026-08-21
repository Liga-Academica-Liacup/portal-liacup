# F00 — Runbook do Gabriel (Windows + Git Bash)

Divisão em uma frase: **você prepara o terreno e aperta os botões que exigem login; o Claude Code escreve tudo que é código.**

---

## Quem faz o quê

| Tarefa                                                        | Quem        |
| ------------------------------------------------------------- | ----------- |
| Instalar Node, Python, uv, Claude Code                        | **Você**    |
| Criar o repositório no GitHub                                 | **Você**    |
| Rodar `specify init`                                          | **Você**    |
| Conectar o repositório à Vercel                               | **Você**    |
| Proteger o ramo principal                                     | **Você**    |
| Escrever a spec, o plano e as tarefas                         | Claude Code |
| Escrever todo o código, configuração e testes                 | Claude Code |
| Configurar o CI, o lint, os testes, os scripts de verificação | Claude Code |
| Rodar as verificações e mostrar as evidências                 | Claude Code |
| Revisar antes de você olhar                                   | Eu          |
| Aprovar e mandar seguir                                       | **Você**    |

Nada de configuração manual da sua parte dentro do projeto. Se você se pegar editando um arquivo de configuração, algo saiu do trilho — é trabalho do Claude Code.

---

## Parte A — Instalar (uma vez só)

Tudo no **PowerShell**, não no Git Bash, porque os instaladores são para Windows:

```powershell
winget install OpenJS.NodeJS.LTS
winget install Python.Python.3.12
winget install astral-sh.uv
winget install Anthropic.ClaudeCode
```

Feche e reabra o terminal. Depois, **no Git Bash**, confira:

```bash
node -v      # v20 ou superior
python --version
uv --version
git --version
claude --version
```

Se algum não responder, o terminal não pegou o PATH novo — feche tudo e abra de novo.

---

## Parte B — Ajustar o Git antes de qualquer coisa

Isto evita um problema chato e específico do Windows: o Git converte quebras de linha automaticamente, o formatador reclama de arquivo inteiro, e o CI vermelho sem motivo aparente.

```bash
git config --global core.autocrlf input
git config --global init.defaultBranch main
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

E, no PowerShell **como administrador**, uma vez:

```powershell
git config --system core.longpaths true
```

Sem isso, `node_modules` estoura o limite de caminho do Windows e a instalação falha no meio.

---

## Parte C — Escolher a pasta do projeto

Três armadilhas do Windows que custam horas:

1. **Nada de acento no caminho.** `C:\Users\gabri\Downloads\Protótipo do site` tem "ó" e vai dar problema em alguma ferramenta. Use algo como `C:\dev\`.
2. **Fora do OneDrive.** Sincronização em cima de `node_modules` trava build e corrompe arquivo.
3. **Sem espaço no nome da pasta**, por garantia.

```bash
mkdir -p /c/dev && cd /c/dev
```

---

## Parte D — Criar o repositório

No navegador, em `github.com/liacup`: novo repositório chamado **`portal-liacup`**, **privado**, **sem** README, `.gitignore` ou licença — o Spec Kit cria a estrutura e arquivo pré-existente atrapalha.

> Aproveite e confirme se `liacup` é uma **organização** ou uma conta de usuário. Se for conta de usuário, considere converter para organização agora, enquanto está vazio. Numa organização, cada diretor entra com o próprio login; numa conta compartilhada, a troca de gestão vira compartilhar senha.

---

## Parte E — Rodar o Spec Kit

No Git Bash, dentro de `/c/dev`:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

specify init portal-liacup --integration claude --script sh

cd portal-liacup
git remote add origin https://github.com/liacup/portal-liacup.git
```

**Sobre o `--script sh`:** no Windows o padrão do Spec Kit é gerar scripts de PowerShell. Como o Claude Code no Windows executa comandos pelo Git Bash, os scripts em `sh` costumam encaixar melhor. Se algum comando `/speckit.*` reclamar de script não encontrado ou não executável, refaça com `--script ps` — não é erro seu, é só a variante errada para o seu ambiente.

Depois, copie a pasta `docs/` e a pasta `assets/` do pacote que te mandei para dentro de `portal-liacup/`. É o que dá ao Claude Code acesso à constitution, aos padrões, aos ADRs, ao conteúdo institucional e à logo.

---

## Parte F — O que você cola no Claude Code

Abra o Claude Code dentro de `/c/dev/portal-liacup` e siga esta ordem. **Não pule os pontos de parada.**

### 1. Constitution

```
/speckit.constitution
```

Cole em seguida o conteúdo inteiro de `docs/constitution.md`.

### 2. Contexto do projeto

Antes de especificar, dê o mapa ao Claude Code:

> Antes de começarmos, leia os arquivos da pasta `docs/`: `constitution.md`, `PADROES-DE-CODIGO.md`, `ADR-0001-stack.md`, `ADR-0002-envio-de-email.md` e `conteudo-institucional.md`. Eles são as regras deste projeto e valem mais que qualquer preferência sua de implementação. O `PADROES-DE-CODIGO.md` define a estrutura de pastas e as regras de componentização que o CI vai cobrar. Me confirme, em poucas linhas, o que você entendeu que são as restrições inegociáveis.

Leia a resposta. Se ele não mencionar a regra de dependência entre camadas, a proibição de valor de estilo escrito à mão e o português no código, ele não leu direito — mande ler de novo.

### 3. Spec

```
/speckit.specify
```

Cole a **Parte 2** do `F00-fundacao.md` (o bloco todo que começa em "Estabelecer a fundação técnica").

### 🛑 **PONTO DE PARADA 1** — me mande o `spec.md` gerado antes de seguir.

### 4. Plano e tarefas

```
/speckit.plan
/speckit.tasks
/speckit.analyze
```

### 🛑 **PONTO DE PARADA 2** — me mande o `plan.md` e o `tasks.md`.

### 5. Implementação

```
/speckit.implement
```

### 6. Pedido de evidências

Quando ele terminar, cole isto:

> Agora me prove que as verificações funcionam. Para cada item abaixo, execute e me mostre a saída real do terminal, não uma descrição:
>
> 1. Escreva um import proibido pela regra de camadas (por exemplo, um componente de `componentes/ui` importando de `lib/supabase` ou de `features/`). Rode o lint e mostre a falha apontando o arquivo. Depois remova o import e mostre o lint passando.
> 2. Escreva uma cor em hexadecimal direto num componente. Rode a verificação de tokens e mostre a falha. Depois remova e mostre passando.
> 3. Mostre a saída de: verificação de tipos, lint, formatação, teste de unidade e teste de ponta a ponta.
> 4. Mostre a saída da verificação de acessibilidade na página inicial.
> 5. Mostre a saída do teste que confere ausência de rolagem horizontal em 360, 768 e 1280 pixels.
> 6. Liste todas as dependências instaladas e a justificativa de cada uma, e confirme que batem com o `plan.md`.
> 7. Confirme que nenhum segredo está versionado e mostre o arquivo de exemplo de variáveis de ambiente.

### 🛑 **PONTO DE PARADA 3** — me mande tudo isso. Eu aplico o checklist e te devolvo com o que olhar.

---

## Parte G — Depois que eu aprovar

**Primeiro push:**

```bash
git add -A
git commit -m "feat: fundação do projeto (F00)"
git push -u origin main
```

**Conectar a Vercel:** em `vercel.com`, entrar com o GitHub da liga, _Add New Project_, importar `liacup/portal-liacup`, aceitar os padrões de Next.js e publicar. Guarde o endereço `.vercel.app` que aparecer — é ele que eu vou conferir.

**Proteger o ramo principal:** no GitHub, _Settings › Branches › Add branch protection rule_ para `main`, marcando exigência de pull request antes do merge e exigência de que as verificações passem — selecionando as que apareceram depois do primeiro CI rodar.

> Essa proteção só funciona depois que o CI rodou pelo menos uma vez, porque antes disso o GitHub não sabe quais verificações existem. É o último passo, não o primeiro.

**Teste final, e é o que mais importa:** crie um branch, quebre alguma coisa de propósito, abra um pull request e confirme que o merge fica bloqueado. Se der para fazer o merge com o CI vermelho, a proteção não está valendo — e aí todo o resto da F00 é decoração.

---

## Parte H — Problemas comuns no Windows

| Sintoma                                | Causa provável                    | O que fazer                                                                          |
| -------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| Comando `/speckit.*` não acha o script | Variante de script errada         | Refazer o init com `--script ps`                                                     |
| Formatador acusa o arquivo inteiro     | Quebra de linha CRLF              | `git config --global core.autocrlf input` e pedir um `.gitattributes` ao Claude Code |
| `npm install` falha no meio            | Limite de caminho do Windows      | `git config --system core.longpaths true` como administrador                         |
| Instalação absurdamente lenta          | Antivírus varrendo `node_modules` | Adicionar a pasta do projeto às exclusões do Windows Defender                        |
| Terminal trava em pergunta interativa  | Git Bash com CLI interativo       | Rodar com `winpty` na frente, ou usar o PowerShell para esse comando                 |
| Arquivo some ou build quebra sozinho   | Projeto dentro do OneDrive        | Mover para `C:\dev`                                                                  |
| Playwright não roda                    | Navegadores não baixados          | `npx playwright install`                                                             |

---

## Resumo do fluxo

```
VOCÊ      instala → cria o repo → specify init → copia docs/
CLAUDE    lê o contexto → spec
EU        🛑 valido a spec
CLAUDE    plano → tarefas
EU        🛑 valido plano e tarefas
CLAUDE    implementa → mostra as evidências
EU        🛑 aplico o checklist
VOCÊ      pente fino → push → Vercel → proteção do ramo → teste do bloqueio
```
