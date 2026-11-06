// Por rol: directorio en el panel (sesión CDP :9222), ficha pública de un perfil real y landing pública.
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
const root = '/Users/danielacedonunez/Downloads/Música/+XPEAK/Xpeak Marketing/Instagram Predis/01-roles';
const SOLO = process.argv[2];
// [carpeta, vista panel, landing, uid, nombre-fichero, consentimiento]
const R = [
  ['alquiler-equipos','alquiler','contratar-alquiler-equipos','ee823fe9-7c59-4678-8ce7-fc5bd6db73bc','eventos-pro-sound',false],
  ['animador','animador','contratar-animador','dd5e6fb2-42c9-4e77-86ba-142cd38900af','ole-hop-animaciones',true],
  ['azafata','azafata','contratar-azafata','a19f39b0-c245-417a-9214-74a1a5a480b1','lucia-tafalla',true],
  ['bailarin','bailarin','contratar-bailarin','1c9ef05a-e930-4840-8833-08d4565d14a2','mariane',false],
  ['camarero','camarero','contratar-camareros','9aef0d30-91a1-47ce-b24e-ebe7e4f642cc','marc-sanchis',false],
  ['catering','catering','contratar-catering','dbecdc2d-dd4f-4245-b87d-bd753a8443ce','daniela-catering',false],
  ['disco-movil','disco-movil','contratar-disco-movil','7e2bcda5-13d6-48b1-bf0c-752e39f9e954','dj-karloss',true],
  ['food-truck','food-truck','contratar-food-truck','92f7a533-72fe-429e-83b4-75b551624e0c','vulcano-grill',false],
  ['grupo-musical','grupo-musical','contratar-grupo-musical','3302cc8f-27e3-4d55-89fb-62c5f4eb47f3','7motivos',false],
  ['limpieza','limpieza',null,'de826001-d06d-482b-b61e-e887df75c55b','bubble-limpiezas',true],
  ['mago','mago','contratar-mago','ca69a9c7-1fc0-4701-9ad9-8bc898cc125b','guillemagic',false],
  ['maquillaje','makeup','contratar-maquillaje','0f07ab07-d86c-4b44-9663-7593064ea1b0','daniel-guzman',true],
  ['fotografo-media','media','contratar-fotografo','bfc25c21-4141-4040-b82d-6e930fe3a75c','babucha-photography',false],
  ['peluqueria','peluqueria','contratar-peluqueria','d66a72a9-0d2c-4768-959c-e3b7f79ec5a4','jaime',false],
  ['photo-booth','photo-booth','contratar-photo-booth','818599b0-ec5e-4977-8632-61825e7aa0d0','vanessa-ledezma',false],
  ['promotor','promotor','contratar-promotores','df79957d-680e-4b2d-bb4d-a096c16f6009','felix-sasian',false],
  ['speaker','speaker','contratar-speaker','b1570b30-c62b-4cf3-98e1-c643c29f18bf','susana-lopez',false],
  ['staff','staff','contratar-staff','a19026c9-1001-4a75-89cf-f4cb9aad00f8','aitana-lopez',false],
].filter(r => !SOLO || r[0] === SOLO);
const VIS = { escritorio: [1440, 900, 2, false], movil: [390, 844, 3, true] };
const save = async (p, dir, name) => { fs.mkdirSync(dir, { recursive: true }); await p.screenshot({ path: path.join(dir, name + '.png') }); };
const cookies = async p => { await p.waitForTimeout(2000); const r = p.getByRole('button', { name: /^Rechazar$/ }).first(); if (await r.isVisible().catch(()=>false)) await r.click().catch(()=>{}); };
// 1) Panel con la sesión de Daniel
const cdpB = await chromium.connectOverCDP('http://localhost:9222');
const ctx = cdpB.contexts()[0];
for (const [vn, [w,h,dpr,mob]] of Object.entries(VIS)) {
  const p = await ctx.newPage(); const s = await ctx.newCDPSession(p);
  await s.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: mob });
  for (const [dir, view] of R) {
    try {
      await p.goto(`https://xpeak.es/dashboard?view=${view}`, { waitUntil: 'domcontentloaded' });
      await p.waitForTimeout(5000); await cookies(p);
      for (const t of [/^Entendido$/, /^Omitir/]) { const b = p.getByRole('button', { name: t }).first(); if (await b.isVisible().catch(()=>false)) await b.click().catch(()=>{}); }
      await p.waitForTimeout(700);
      await save(p, path.join(root, dir), `panel-directorio-${vn}`); console.log('OK panel', dir, vn);
    } catch (e) { console.log('FALLO panel', dir, vn, e.message.split('\n')[0]); }
  }
  await p.close();
}
await cdpB.close();
// 2) Páginas públicas sin sesión
const b = await chromium.launch({ channel: 'chrome', headless: true });
for (const [vn, [w,h,dpr,mob]] of Object.entries(VIS)) {
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: mob, hasTouch: mob, locale: 'es-ES' });
  for (const [dir, , landing, uid, nom, cons] of R) {
    const pages = [[`ficha-publica-${nom}${cons ? '' : '-SIN-consentimiento'}`, `/p/${uid}?interno=1`]];
    if (landing) pages.push([`landing-${landing}`, `/${landing}?interno=1`]);
    for (const [name, route] of pages) {
      const p = await c.newPage();
      try {
        await p.goto('https://xpeak.es' + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await p.waitForTimeout(3000); await cookies(p);
        await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,100));} window.scrollTo(0,0); });
        await p.waitForTimeout(800);
        await save(p, path.join(root, dir), `${name}-${vn}`); console.log('OK', dir, name, vn);
      } catch (e) { console.log('FALLO', dir, name, vn, e.message.split('\n')[0]); }
      await p.close();
    }
  }
  await c.close();
}
await b.close();
