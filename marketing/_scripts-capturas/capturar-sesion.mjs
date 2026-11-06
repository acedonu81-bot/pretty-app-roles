// Captura vistas del dashboard usando el Chrome ya logueado (CDP :9222).
// Uso: node scripts/capturar-sesion.mjs <carpeta-destino-roles> <prefijo>
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = '/Users/danielacedonunez/Downloads/Música/+XPEAK/Xpeak Marketing/Instagram Predis';
const [destRol, prefijo] = process.argv.slice(2);
// [carpeta, nombre, vista]
const V = [
  [destRol, 'panel-inicio-explorar', 'explorar'],
  [destRol, 'panel-rol-dj', 'dj'],
  [destRol, 'mi-perfil', 'profile'],
  [destRol, 'ficha', 'ficha'],
  ['02-secciones/feed-descubrir', 'feed-panel', 'feed'],
  ['02-secciones/calendario', 'calendario', 'calendar'],
  ['02-secciones/contratos', 'contratos', 'contracts'],
  ['02-secciones/mensajes', 'mensajes', 'messages'],
  ['02-secciones/estadisticas', 'estadisticas', 'stats'],
  ['02-secciones/flash-booking', 'flash-booking', 'flashbooking'],
  ['02-secciones/resenas', 'resenas', 'resenas'],
  ['02-secciones/mapa', 'mapa', 'mapa'],
  ['02-secciones/recursos', 'recursos', 'resources'],
  ['02-secciones/explorar', 'top-weekend', 'topweekend'],
];
const b = await chromium.connectOverCDP('http://localhost:9222');
const ctx = b.contexts()[0];
const vistas = { escritorio: [1440, 900, 2, false], movil: [390, 844, 3, true] };
for (const [vn, [w, h, dpr, mob]] of Object.entries(vistas)) {
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: mob });
  for (const [dir, name, view] of V) {
    try {
      await p.goto(`https://xpeak.es/dashboard?view=${view}`, { waitUntil: 'domcontentloaded' });
      await p.waitForTimeout(5000);
      for (const t of [/^Rechazar$/, /^Aceptar$/]) { const bt = p.getByRole('button', { name: t }).first(); if (await bt.isVisible().catch(()=>false)) { await bt.click().catch(()=>{}); break; } }
      for (const t of [/^Entendido$/, /^Omitir/, /^Cerrar/]) { const bt = p.getByRole('button', { name: t }).first(); if (await bt.isVisible().catch(()=>false)) await bt.click().catch(()=>{}); }
      await p.locator('button[aria-label*="errar"], button[aria-label*="lose"]').first().click({ timeout: 800 }).catch(()=>{});
      await p.waitForTimeout(800);
      const file = path.join(root, dir, `${prefijo ? prefijo + '-' : ''}${name}-${vn}.png`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      await p.screenshot({ path: file });
      console.log('OK', dir, name, vn);
    } catch (e) { console.log('FALLO', view, vn, e.message.split('\n')[0]); }
  }
  await p.close();
}
await b.close();
