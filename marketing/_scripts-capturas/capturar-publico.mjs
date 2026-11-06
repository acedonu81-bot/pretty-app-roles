// Capturas de páginas PÚBLICAS de xpeak.es para contenido de Instagram.
// Uso: node marketing/instagram/scripts/capturar-publico.mjs
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = '/Users/danielacedonunez/Downloads/Música/+XPEAK/Xpeak Marketing/Instagram Predis';
const BASE = 'https://xpeak.es';
const SOLO = process.argv[2];
const T0 = [
  // [carpeta, nombre, ruta]
  ['02-secciones/ficha-publica', 'dj-daniel-torrez', '/p/8570ba10-5e38-4a4a-a934-849bbe30924b'],
  ['02-secciones/ficha-publica', 'dj-ruben-trias', '/p/9c94a53b-0532-45ac-af69-488329a5d73f'],
  ['02-secciones/ficha-publica', 'dj-zulo-creativo', '/p/ab1f4291-68d7-40e7-bde4-9b652151f061'],
  ['02-secciones/ficha-publica', 'dj-vizard', '/p/93d516b7-fbe6-4e16-a05a-63a048d239c3'],
  ['02-secciones/feed-descubrir', 'descubrir', '/descubrir'],
  ['02-secciones/landing-y-captacion', 'home', '/'],
  ['02-secciones/landing-y-captacion', 'contratar-dj', '/contratar-dj'],
  ['02-secciones/landing-y-captacion', 'contratar-dj-madrid', '/contratar-dj/madrid'],
  ['02-secciones/landing-y-captacion', 'navidad', '/navidad'],
  ['02-secciones/blog', 'blog-indice', '/blog'],
  ['02-secciones/blog', 'cuanto-cobra-un-dj', '/blog/cuanto-cobra-un-dj-en-espana'],
];
const T = SOLO ? T0.filter(t => t[1].includes(SOLO)) : T0;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const vistas = {
  escritorio: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  movil: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
};
for (const [vn, opts] of Object.entries(vistas)) {
  const ctx = await browser.newContext({ ...opts, locale: 'es-ES' });
  for (const [dir, name, route] of T) {
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route + (route.includes('?') ? '&' : '?') + 'interno=1', { waitUntil: 'networkidle', timeout: 45000 });
      // cerrar banner de cookies (espera a que aparezca)
      await page.waitForTimeout(2500);
      const rech = page.getByRole('button', { name: /^Rechazar$/ }).first();
      if (await rech.isVisible().catch(() => false)) await rech.click().catch(() => {});
      await page.waitForTimeout(600);
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(800);
      const file = path.join(root, dir, `${name}-${vn}.png`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      await page.screenshot({ path: file, fullPage: false });
      console.log('OK', dir, name, vn);
    } catch (e) { console.log('FALLO', route, vn, e.message.split('\n')[0]); }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
