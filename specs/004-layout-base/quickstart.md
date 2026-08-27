# Guia de validação — F03 Layout base

**Data**: 2026-08-27 · **Spec**: [spec.md](./spec.md) · **Plano**: [plan.md](./plan.md)

Este guia define as evidências que o Codex desenvolvedor deve produzir. Não substitui `tasks.md` e
não contém implementação.

## Pré-requisitos

- branch `feat/F03-layout-base` baseada na `main` com o RP-13;
- Node 22+, `npm ci` e Chromium do Playwright instalados;
- nenhuma variável secreta nova;
- servidor livre nas portas usadas por Next/Lighthouse.

## 1. Cadeia estática e dependências

```bash
npm run verificar
```

**Esperado**: seis verificações agregadas verdes, artefatos com contador, `next typegen` antes do
TypeScript, lint, formatação, tokens e chave do build sem ocorrência.

```bash
node -e "const p=require('./package.json');const d=Object.keys(p.dependencies||{}),v=Object.keys(p.devDependencies||{});console.log('execucao:',d.length,'| dev:',v.length,'| total:',d.length+v.length)"
```

**Esperado**: `execucao: 4 | dev: 18 | total: 22`.

## 2. Unidade e contratos

```bash
npm test
```

Registrar quantidade de arquivos e testes. Cobertura mínima nova:

- `LinkComAparenciaDeBotao`: link real, href obrigatório, três variantes e largura total;
- tipo recusa `className`, `style`, `icone` e `disabled` no link;
- `Botao` continua funcionando e passa a recusar `style`;
- `Icone`: quatro nomes exatos;
- `LinksDeContato`: dois destinos preservados e contêiner `address`.

## 3. Matriz de dez páginas e sete larguras

```bash
npm run build
npm run test:e2e
```

Saídas objetivas esperadas:

- `10/10` páginas em cada largura e `70/70` combinações;
- zero rotas ausentes ou redirecionadas;
- uma região banner/navigation/main/contentinfo por página;
- zero violações axe;
- zero rolagem horizontal;
- altura reportada nas sete larguras e ≤ 64 nas quatro mobile;
- quantidade de alvos > 0 e zero abaixo de 44 px;
- `7/7` percursos de teclado;
- seis de seis pares visuais botão/link idênticos nas propriedades contratadas.

## 4. Demonstrações das verificações

Cada demonstração é feita isoladamente, registrada em `EVIDENCIAS-F03.md` e desfeita antes da
seguinte. Nunca combinar duas violações na mesma prova.

### Catálogo único

Acrescentar temporariamente um 11º destino ao JSON sem criar rota.

```bash
npm run test:e2e
npm run test:desempenho
```

**Vermelho esperado**: ambos nomeiam o caminho ausente sem nenhuma edição nos testes/configuração.
Restaurar e obter `10/10`, `70/70` e `30/30`.

### Landmarks, altura e teclado

Para cada verificação nova, introduzir uma violação mínima correspondente e executar somente o
teste focado. Registrar comando, código não zero e mensagem específica. Restaurar e registrar o
contador verde. Os sete percursos de teclado são demonstrados um a um.

Ver [contracts/verificacoes.md](./contracts/verificacoes.md) para a matriz obrigatória.

## 5. Lighthouse mobile

```bash
npm run build
npm run test:desempenho
```

**Esperado**:

- 10/10 caminhos distintos;
- 30/30 relatórios atuais;
- três execuções por caminho;
- status HTTP aprovado e URL final correta;
- perfil mobile e throttling simulado confirmados no LHR;
- desempenho ≥ 90 e acessibilidade ≥ 95.

Relatório antigo na pasta não pode alterar a contagem; a fonte é o `manifest.json` da execução
atual.

## 6. Fidelidade e conteúdo

Preencher [FIDELIDADE.md](./FIDELIDADE.md). Critérios:

- zero linha não idêntica sem motivo;
- toda medição de contraste nomeia primeiro plano, fundo e superfície;
- cinco seletores `.nav` removidos e contagem 27 → 22 reproduzível;
- `tokens.css` mostra somente o acréscimo do token da marca;
- exatamente dois ícones acrescentados;
- zero ocorrência do e-mail inventado e de “Faculdade de Medicina · Campus Darcy Ribeiro” nos
  arquivos entregues;
- nove páginas provisórias contêm aviso de construção e nenhum conteúdo institucional.

## 7. Cadeia completa antes do PR

Executar, nesta ordem:

```bash
npm run verificar
npm test
npm run test:banco
npm run test:e2e
npm run test:desempenho
```

O CI acrescenta build, conferência dos tipos do banco e verificação da chave no artefato compilado.
Nada entra com check `Verificacoes` vermelho.

## Registro de entrega

O relatório final deve informar, no mínimo:

- SHA e branch;
- 10/10 rotas e 70/70 combinações;
- alturas nas sete larguras;
- quantidade de alvos medidos;
- 7/7 teclado;
- 6/6 pares visuais;
- 71+ testes unitários e 147 testes de banco preservados, com os novos totais reais;
- 84+ testes E2E preservados, com o novo total real;
- Lighthouse 10/10 e 30/30;
- dependências 4 + 18 = 22;
- zero pendência silenciosa.
