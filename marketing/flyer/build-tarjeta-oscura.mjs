import QRCode from 'qrcode';
import { chromium } from 'playwright';
import fs from 'fs';
const qr = (t, dark = '#14110A') => QRCode.toString(t, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark, light: '#00000000' } });
const [qw, qi] = await Promise.all([
  qr('https://xpeak.es/?utm_source=tarjeta_oscura&utm_medium=print&utm_campaign=tarjeta_web'),
  qr('https://www.instagram.com/xpeaksite')]);
const IG = (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r=".7" fill="${c}"/></svg>`;
const X3D = `data:image/png;base64,${fs.readFileSync('xpeak-x3d.png').toString('base64')}`;
const grain = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>`)}`;
const X = (cx, cy, r, w, fill) => `
 <line x1="${cx-r}" y1="${cy-r}" x2="${cx+r}" y2="${cy+r}" stroke="${fill}" stroke-width="${w}"/>
 <line x1="${cx+r}" y1="${cy-r}" x2="${cx-r}" y2="${cy+r}" stroke="${fill}" stroke-width="${w}"/>`;
const css = (B) => `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@500;600;700&display=swap');
*{box-sizing:border-box;margin:0}body{font-family:Inter,sans-serif}
.c{width:${85+2*B}mm;height:${55+2*B}mm;position:relative;overflow:hidden;page-break-after:always}
.c>svg.art{position:absolute;inset:0;width:100%;height:100%}
.c::after{content:"";position:absolute;inset:0;background:url("${grain}");mix-blend-mode:overlay;opacity:.16;pointer-events:none}
.syne{font-family:Syne,sans-serif;font-weight:800}
.d{background:radial-gradient(120% 140% at 82% 0%,#2B2410 0%,#15120A 48%,#0A0908 100%);color:#F5F4F0}
.l{background:radial-gradient(110% 130% at 85% 5%,#FFFDF6 0%,#F5F4F0 55%,#EAE5D6 100%);color:#0D0D0D}
.in{position:absolute;left:${B+7}mm;right:${B+7}mm;top:${B+7}mm;bottom:${B+7}mm}
.x3{position:absolute;pointer-events:none;filter:drop-shadow(0 1.4mm 1.6mm rgba(0,0,0,.55)) drop-shadow(0 0 5mm rgba(212,175,55,.28))}
.l .x3{filter:drop-shadow(0 .6mm .8mm rgba(90,60,0,.35))}
.kick{position:absolute;left:0;top:0;font-size:5.2pt;font-weight:700;letter-spacing:.17em;text-transform:uppercase;line-height:1.75;color:#D4AF37;white-space:nowrap}
.url{position:absolute;left:0;bottom:0;font-size:20pt;line-height:.9;letter-spacing:-.01em;color:#F5F4F0}
.url b{color:#E2BD4A;font-weight:800}
.tile{position:absolute;right:0;bottom:0;width:19mm;height:19mm;background:#F5F4F0;border-radius:2.2mm;padding:1.9mm}
.d .tile{box-shadow:0 0 0 .25mm #D4AF37,0 1.2mm 4mm rgba(0,0,0,.55)}
.l .tile{background:#FFFDF7;box-shadow:0 0 0 .25mm #D4AF37,0 1mm 3mm rgba(120,90,10,.25)}
.tile svg{width:100%;height:100%;display:block}
.ig{position:absolute;left:0;top:0;display:flex;align-items:center;gap:2mm;font-size:6.2pt;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#8A6D0F}
.ig i{width:6.5mm;height:6.5mm;border-radius:50%;border:.25mm solid #B8941E;display:flex;align-items:center;justify-content:center}.ig i svg{width:3.5mm;height:3.5mm}
.handle{position:absolute;left:0;bottom:0;font-size:14pt;line-height:.9;letter-spacing:-.01em;color:#0D0D0D}
.cta{position:absolute;left:0;top:11mm;font-size:6.4pt;font-weight:600;line-height:1.5;color:#5b4f2c;max-width:36mm}`;
const defs = `<defs>
 <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="50" y1="-4" x2="82" y2="34"><stop offset="0" stop-color="#F5D77A"/><stop offset=".5" stop-color="#D4AF37"/><stop offset="1" stop-color="#9C7A16"/></linearGradient>
 <linearGradient id="gs" gradientUnits="userSpaceOnUse" x1="70" y1="3" x2="80" y2="13"><stop offset="0" stop-color="#E9C45A"/><stop offset="1" stop-color="#B8941E"/></linearGradient>
 <radialGradient id="halo"><stop offset="0" stop-color="#D4AF37" stop-opacity=".30"/><stop offset="1" stop-color="#D4AF37" stop-opacity="0"/></radialGradient>
 <clipPath id="cl"><rect x="3.5" y="3.5" width="78" height="48"/></clipPath></defs>`;
const frame = (c, o) => `<rect x="3.5" y="3.5" width="78" height="48" fill="none" stroke="${c}" stroke-width=".18" opacity="${o}"/>`;
const front = (B) => `<div class="c d">
 <svg class="art" viewBox="0 0 ${85+2*B} ${55+2*B}" preserveAspectRatio="none">${defs}
  <g transform="translate(${B} ${B})">
   <circle cx="66" cy="16" r="36" fill="url(#halo)"/>
   ${frame('#D4AF37', .7)}
  </g></svg>
 <img class="x3" src="${X3D}" style="left:${B+39}mm;top:${B-7.5}mm;width:50mm;height:50mm">
 <div class="in"><div class="kick">Profesionales y<br>organizadores de eventos<br>en un solo sitio</div><div class="url syne">xpeak<b>.es</b></div><div class="tile">${qw}</div></div></div>`;
const back = (B) => `<div class="c l">
 <svg class="art" viewBox="0 0 ${85+2*B} ${55+2*B}" preserveAspectRatio="none">${defs}
  <g transform="translate(${B} ${B})">${frame('#B8941E', .65)}</g></svg>
 <img class="x3" src="${X3D}" style="left:${B+61}mm;top:${B-3}mm;width:20mm;height:20mm">
 <div class="in"><div class="ig"><i>${IG('#B8941E')}</i>Instagram</div><div class="cta">Síguenos y entérate de todo<br>lo que se mueve en eventos.</div><div class="handle syne">@xpeaksite</div><div class="tile">${qi}</div></div></div>`;
const page = (B, n) => `<!doctype html><meta charset=utf-8><style>${css(B)}@page{size:${85+2*B}mm ${55+2*B}mm;margin:0}</style><body>${n}</body>`;
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const mm = 96 / 25.4;
for (const [B, tag] of [[0, 'sin-sangrado'], [3, 'imprenta-sangrado-3mm']]) {
  const pngs = [];
  for (const [name, fn] of [['FRENTE', front], ['REVERSO', back]]) {
    const p = await browser.newPage({ viewport: { width: Math.round((85+2*B)*mm), height: Math.round((55+2*B)*mm) }, deviceScaleFactor: 3.125 });
    await p.setContent(page(B, fn(B))); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
    const f = `tarjeta-oscura-${name}-${tag}.png`; await p.screenshot({ path: f }); pngs.push(f); await p.close();
  }
  const p = await browser.newPage();
  const imgs = pngs.map(f => `<img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="display:block;width:${85+2*B}mm;height:${55+2*B}mm;page-break-after:always">`).join('');
  await p.setContent(`<style>@page{size:${85+2*B}mm ${55+2*B}mm;margin:0}body{margin:0}</style>${imgs}`);
  await p.pdf({ path: `tarjeta-xpeak-oscura-${tag}.pdf`, width: `${85+2*B}mm`, height: `${55+2*B}mm`, printBackground: true });
  await p.close();
}
await browser.close();
