# Evidências da F00 — Fundação técnica

**Data**: 2026-08-20 · **Branch**: `main` (exceção de arranque) · **Ambiente**: Windows 11, Node v22.22.2, npm 10.9.7

Cobertura dos 14 itens da Parte 3 de `docs/F00-fundacao.md`. Cada item responde com número ou
saída de comando, nunca com adjetivo.

---

## 1. Projeto roda do zero seguindo só o README ✅

`npm install` → 729 pacotes, **sem nenhum conflito de par** (`ERESOLVE`). `npm run dev` sobe e a
página abre. `npm run build` compila em 13,5 s, gerando 2 rotas estáticas.

O que evitou o tropeço clássico aqui foi a pesquisa de versões (research.md D1 e D2): o
`typescript@latest` de hoje é **7.0.2**, e o `typescript-eslint` só aceita `<6.1.0`; o
`eslint@latest` é **10.8.1**, e os plugins nomeados nos padrões declaram compatibilidade só até a
**9**. Instalar "o mais novo" quebraria a instalação antes da primeira linha de código.

## 2. Estrutura de pastas conforme os padrões ✅

17 diretórios sob `src/`, batendo item a item com a seção 1 de `docs/PADROES-DE-CODIGO.md`. 23
arquivos. Pastas que só ganham conteúdo depois (`(painel)`, `api`, `lib/supabase`, `lib/email`)
têm um `README.md` dizendo o que vai ali e em qual feature.

Três pastas de raiz são adições deliberadas, registradas em research.md D9: `tests/e2e/`,
`scripts/` e `public/` — esta última é convenção obrigatória do Next para arquivo estático.

## 3. A regra de camadas realmente bloqueia ✅ *(item crítico)*

**V1 — `componentes/ui` importando da camada de dados:**

```
14:32  error  Unexpected path "@/features/exemplo/dados" imported in restricted zone.
componentes/ui nao pode importar de features. A camada base nao conhece dominio:
ela recebe props e desenha. Ver docs/PADROES-DE-CODIGO.md, secao 1  import/no-restricted-paths
✖ 1 problem (1 error, 0 warnings)     → código de saída 1
```

Removido o import: código de saída **0**.

**V2 — uma feature importando de outra** *(o caso que mais importa)*:

```
17:24  error  A feature "exemplo" nao pode importar de outra feature. Duas features que
precisam conversar conversam pela rota que as compoe, em src/app/.   → código de saída 1
```

E a prova de que a geração automática de zonas funciona: bastou criar a pasta
`src/features/segunda/` para a zona dela aparecer, **sem ninguém registrar nada**.

```
zonas totais: 10
  gerada -> ./src/features/exemplo | proibido: ./src/features | exceto: [ './exemplo' ]
  gerada -> ./src/features/segunda | proibido: ./src/features | exceto: [ './segunda' ]
```

## 4. A verificação de tokens realmente bloqueia ✅ *(item crítico)*

Redesenhada conforme o refinamento M2: o **mesmo valor**, no **mesmo formato**, em dois arquivos,
numa **única execução**, com vereditos opostos.

```
Verificacao de tokens: 17 arquivo(s) varrido(s) em src/, sendo 1 arquivo(s) de token
onde cor e medida sao permitidas.

1 problema(s):
  src\componentes\ui\Botao.module.css:44  #82558f  — cor escrita a mao; use var(--color-accent-600)
                                                     → código de saída 1
```

O `#82558f` colocado ao mesmo tempo em `tokens.css` **não** foi acusado. Isso distingue um
verificador que decide pelo local de um que está cego — a contagem de arquivos varridos está na
saída justamente para isso.

**Durante a implementação ele pegou três violações reais**, uma delas minha: um `256px` dentro de
comentário de bloco (falso positivo, corrigido no script) e dois `1px solid` escritos à mão
(corrigidos com o token `--largura-borda`).

## 5. Tipos, análise estática e formatação limpos ✅

```
npm run verificar
  verificar:tipos   → tsc --noEmit, zero erro
  lint              → eslint ., zero erro e zero aviso
  formatar:check    → All matched files use Prettier code style!
  verificar:tokens  → 19 arquivos varridos, nenhuma cor ou medida escrita a mão
```

## 6. Testes passando ✅

- **Unidade**: `Test Files 2 passed (2)` · `Tests 12 passed (12)` — 6 do `Botao` e 6 das regras puras.
- **Ponta a ponta**: `28 passed (27.0s)` — 4 testes × 7 larguras.

## 7. Acessibilidade sem violação ✅

`Violacoes de acessibilidade: 0` em todas as sete larguras, com axe-core nas tags
`wcag2a, wcag2aa, wcag21a, wcag21aa`.

## 8. Sem rolagem horizontal ✅

`scrollWidth <= clientWidth` em **360, 390, 430, 480, 768, 1024 e 1280 px**. Cada largura é um
projeto próprio do Playwright, então a saída nomeia qual falhou quando falha.

## 9. Alteração com erro é barrada de verdade ⏸️ **bloqueado — depende do Gabriel**

Tarefa **T063**, marcada `[GABRIEL]`. Exige a proteção do ramo configurada na interface do GitHub,
o que só é possível **depois** do primeiro CI ter rodado. O que está entregue: o fluxo em
`.github/workflows/ci.yml` com **13 etapas nomeadas**, nenhuma com `continue-on-error`, e o passo a
passo no README com a ordem obrigatória.

## 10. Publicação automática ⏸️ **bloqueado — depende do Gabriel**

Tarefa **T064**. Depende de conectar o repositório à Vercel.

## 11. Pré-visualização por alteração ⏸️ **bloqueado — depende do Gabriel**

Tarefa **T065**, junto da verificação de fork e de propostas simultâneas.

## 12. Nenhum segredo no repositório ✅

Histórico com **0 commits** (o projeto ainda não foi enviado), varredura por
`SUPABASE|RESEND|SECRET|API_KEY|TOKEN` seguidos de valor: **nenhuma ocorrência**. O `.env.example`
lista 6 variáveis com explicação e **nenhum valor real**; `.gitignore` cobre `.env*` com exceção do
próprio exemplo.

## 13. README compreensível por quem não participou ✅

294 linhas em português, com: o que é o portal, pré-requisitos com versão mínima, como rodar,
como testar, tabela dos 13 comandos, **uma seção por verificação explicando o que ela checa, por
que existe e o que fazer quando falha**, como publicar, a ordem obrigatória da configuração
inicial, onde ficam as decisões e como o código está organizado.

## 14. Toda dependência justificada no plano ✅

**20 dependências diretas — 3 de execução e 17 de desenvolvimento**, batendo exatamente com a
tabela do `plan.md`. Contagem sobre `dependencies` + `devDependencies`, sem transitivas (R2).

Duas tentações recusadas durante a implementação:

- `@eslint/eslintrc` (para `FlatCompat`) — evitada ao descobrir que o `eslint-config-next` 16 já é
  config flat nativa;
- `@testing-library/user-event` — trocada por `fireEvent`, que já vem no `@testing-library/react`.

---

## Item extra verificado: desempenho e paridade

**Lighthouse na versão compilada**, 3 execuções: **desempenho 100** e **acessibilidade 100**, contra
limiares de 90 e 95. O refinamento R1 funcionou — a página usa `logo-liacup-256.png` (78 KB) e não o
original de 749 KB.

**Paridade Windows/Linux (FR-028)**, testada de verdade:

```
error TS1261: Already included file name '.../componentes/Layout/Rodape.tsx' differs from
file name '.../componentes/layout/Rodape.tsx' only in casing.     → código de saída 2
```

A caixa errada é pega **no Windows**, antes de chegar ao CI.

**Requisições a domínio externo no carregamento: 0.** Nenhuma chamada a `fonts.googleapis.com` —
as fontes são baixadas no build e servidas pelo próprio domínio (ADR-0003 seção 3).

---

## Três coisas que eu quero que você olhe

1. **O npm marca a linha 9.x do ESLint como descontinuada.** A escolha continua certa — os plugins
   `eslint-plugin-import` e `eslint-plugin-jsx-a11y` declaram compatibilidade só até a 9, e forçar a
   10 quebraria a instalação. Mas é dívida com data: revisitar quando o `eslint-plugin-import`
   publicar suporte à 10. Registrado em research.md D2.

2. **`npm audit` aponta 10 vulnerabilidades, todas do `@lhci/cli`.** São transitivas do Lighthouse
   CI (`puppeteer-core`, `glob@7`, `tmp`), todas em `devDependencies`: nunca vão para o navegador
   nem para produção. Não corrigi porque `npm audit fix --force` trocaria a versão do Lighthouse CI
   sem passar pela tabela de dependências.

3. **O `prettier --write .` alcançou `docs/` e `specs/` numa execução.** Normalizou marcação
   markdown (alinhamento de tabela, `*x*` → `_x_`) nos documentos da liga. O conteúdo não mudou —
   as quatro medidas de contraste do ADR-0003 seguem lá —, mas a ferramenta não devia tocar em
   documento de governança. Corrigido: `docs/`, `specs/` e `.specify/` entraram no `.prettierignore`.


---

## Correções do Ponto de Parada 3 — aplicadas em 20/08/2026

Três ressalvas do veredito, todas corrigidas antes do primeiro push.

### 1. Acentuação no texto que chega à tela

O FR-004 especifica a frase **com** acento; sem o til, o requisito não estava cumprido. Corrigido
em 7 arquivos:

| Arquivo | Antes | Depois |
| --- | --- | --- |
| `src/app/(site)/page.tsx` | Portal em construcao · Liga Academica | **Portal em construção** · **Liga Acadêmica** |
| `src/app/layout.tsx` | Liga Academica … Brasilia | **Liga Acadêmica … Brasília** (vira `<meta description>`) |
| `src/features/exemplo/componentes/ListaDeExemplos.tsx` | Nao foi possivel carregar · conteudo | **Não foi possível carregar** · **conteúdo** |
| `src/componentes/layout/Rodape.tsx` | Liga Academica … Brasilia | **Liga Acadêmica … Brasília** |
| `src/lib/validacao/exemplo.ts` | Este campo e obrigatorio. | **Este campo é obrigatório.** |
| `src/features/exemplo/dados.ts` | Rascunho nao publicado | **Rascunho não publicado** |
| `tests/e2e/pagina-inicial.spec.ts` | cobrava o texto sem acento | passa a cobrar **Portal em construção** |

Os três últimos não estavam na lista do veredito, mas chegam à tela pela mesma regra: o rodapé é
renderizado na página provisória, a mensagem de validação aparece quando houver formulário, e
`dados.ts` alimenta o molde. Corrigidos junto.

**A prova não é a leitura do arquivo, é o teste**: `tests/e2e/pagina-inicial.spec.ts` agora exige
`toHaveText('Portal em construção')` e os **28 testes passam** — é o navegador confirmando que o
acento renderiza. Antes, esse teste teria falhado.

Comentários de código seguem sem acento, conforme combinado — eles não chegam ao usuário.

### 2. Quinta reatribuição registrada no ADR-0003

Acrescentada a seção **"Quinta reatribuição — o anel de foco"** em
`docs/ADR-0003-tokens-e-acessibilidade.md`, com a medida (`--color-accent` 3,48:1 →
`--color-accent-700` 6,91:1) e a observação explícita de que **o valor anterior já atendia ao
mínimo de 3:1 da WCAG para indicador de foco**: foi escolha, não correção de defeito.

O documento agora fecha em **cinco** reatribuições — quatro corrigem reprovação no AA, uma é
melhoria deliberada.

### 3. Borda do botão de volta a 1px

`src/componentes/ui/Botao.module.css` usava `var(--focus-ring-width)` (2px) onde a `.btn` aprovada
usava 1px. Trocado por `var(--largura-borda)`, o token criado para exatamente isso, que estava sem
uso. Comentário no arquivo registra o porquê: token semântico usado fora do papel dele é número
mágico com nome bonito.

O `--largura-borda` agora tem **3 usos** — `Botao`, `Rodape` e `EstadoVazio`.

### Reverificação após as correções

```
npm run verificar   → 0 erros nos quatro passos
npm test            → Tests 12 passed (12)
npm run build       → ok
npx playwright test → 28 passed
```


---

## V5 — a zona do `componentes/layout` (acrescentada em 21/08/2026)

Última correção antes do push, e veio de uma observação que eu mesmo levantei ao entregar os links
de contato: `componentes/layout` importava de `componentes/ui` e passava no lint — mas passava por
**ausência de regra**, não por regra. A camada não tinha zona nenhuma, então um cabeçalho podia
importar de `features` e nada barrava.

A linha foi para a tabela da seção 1 de `docs/PADROES-DE-CODIGO.md`, e a zona **Z4** veio atrás em
`eslint.config.mjs`, junto das outras três fixas. São agora **12 zonas** — 9 fixas mais as geradas
por feature.

**Com a violação** (`import { listarExemplos } from '@/features/exemplo/dados'` dentro de
`src/componentes/layout/Rodape.tsx`):

```
C:\Dev\portal-liacup\src\componentes\layout\Rodape.tsx
  9:32  error  Unexpected path "@/features/exemplo/dados" imported in restricted zone.
  componentes/layout nao pode importar de features. Um cabecalho nao conhece noticia:
  quem compoe e a rota, que passa por props. Ver docs/PADROES-DE-CODIGO.md, secao 1
  import/no-restricted-paths

✖ 1 problem (1 error, 0 warnings)     → código de saída 1
```

**Sem a violação**: código de saída **0**.

Arquivo, linha, regra e o porquê — no mesmo padrão de V1 e V2. Zona que ninguém viu falhar é zona
que ninguém sabe se funciona.

### Estado final das verificações

```
npm run verificar   → 0 erros nos quatro passos, 25 arquivos varridos pelo verificador de tokens
npm test            → Test Files 4 passed (4) · Tests 19 passed (19)
npm run build       → Compiled successfully · 3 páginas estáticas
npm run test:e2e    → 35 passed · 0 violações de acessibilidade · 0 requisições externas
```
