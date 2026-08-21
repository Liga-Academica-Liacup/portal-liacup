#!/usr/bin/env node
/*
 * Antes de rodar o teste de ponta a ponta, confere se o navegador do Playwright
 * esta baixado. Sem isto, quem clona o projeto recebe um erro cru do Playwright
 * que nao diz o que fazer — e caso de borda registrado na spec da F00.
 */
import { execFileSync } from 'node:child_process'

try {
  execFileSync(process.execPath, [
    '-e',
    "const {chromium}=require('@playwright/test');const c=chromium.executablePath();require('node:fs').accessSync(c)",
  ])
} catch {
  console.error(
    '\nO navegador de teste do Playwright nao esta instalado nesta maquina.\n\n' +
      'Rode uma vez:\n\n' +
      '  npx playwright install --with-deps chromium\n\n' +
      'Depois repita o comando. Ver README.md, secao "quando uma verificacao falha".\n'
  )
  process.exit(1)
}
