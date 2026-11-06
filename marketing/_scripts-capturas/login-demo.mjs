// Login manual asistido: rellena el formulario y espera a que se resuelva Turnstile (clic humano si lo pide).
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [email, pass, out] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome', headless: false, args: ['--disable-blink-features=AutomationControlled'] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-ES' });
const p = await ctx.newPage();
await p.goto('https://xpeak.es/auth?interno=1', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(3000);
await p.getByRole('button', { name: /aceptar/i }).first().click({ timeout: 2000 }).catch(() => {});
await p.getByRole('button', { name: /Entrar/ }).first().click({ timeout: 3000 }).catch(() => {});
await p.locator('input[type=email]').fill(email);
await p.locator('input[type=password]').fill(pass);
// intento de clic en el checkbox de Turnstile; si no, lo hace la persona
const fr = p.frameLocator('iframe[src*="challenges.cloudflare"]').first();
await fr.locator('input[type=checkbox], label').first().click({ timeout: 8000 }).catch(() => {});
for (let i = 0; i < 60; i++) {
  const btn = p.locator('button[type=submit]').filter({ hasText: /^\s*Entrar/ }).first();
  if (await btn.isEnabled().catch(() => false)) { await btn.click(); break; }
  await p.waitForTimeout(3000);
}
await p.waitForURL(/dashboard/, { timeout: 60000 }).catch(() => {});
await p.waitForTimeout(5000);
console.log(p.url());
await ctx.storageState({ path: path.join(root, '.sesion', out) });
await b.close();
