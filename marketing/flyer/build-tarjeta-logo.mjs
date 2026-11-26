import QRCode from 'qrcode';
import { chromium } from 'playwright';
import fs from 'fs';
const qr = (t, dark = '#14110A') => QRCode.toString(t, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark, light: '#00000000' } });
const [qw, qi] = await Promise.all([
  qr('https://xpeak.es/?utm_source=tarjeta_logo&utm_medium=print&utm_campaign=tarjeta_web'),
  qr('https://www.instagram.com/xpeaksite')]);
const IG = (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r=".7" fill="${c}"/></svg>`;
const grain = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>`)}`;
// Logo oficial de la app: cuadrado redondeado + X (letra) — mismos puntos que xpeak-icon-512.png
const XP = '157,126 212,126 257,196 302,126 356,126 284,238 362,356 306,356 257,282 206,356 150,356 229,238';
const badge = (bg, fg, id) => `<svg viewBox="0 0 512 512" width="100%" height="100%">
 <defs><linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">${bg}</linearGradient>
 <linearGradient id="sh${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
 <rect width="512" height="512" rx="118" fill="url(#bg${id})"/><rect width="512" height="512" rx="118" fill="url(#sh${id})"/>
 <polygon points="${XP}" fill="${fg}" stroke="${fg}" stroke-width="10" stroke-linejoin="round"/></svg>`;
const GOLD = '<stop offset="0" stop-color="#F5D77A"/><stop offset=".5" stop-color="#D4AF37"/><stop offset="1" stop-color="#B8941E"/>';
const BLK = '<stop offset="0" stop-color="#2A2A2D"/><stop offset="1" stop-color="#0A0A0A"/>';
const css = (B) => `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@500;600;700&display=swap');
*{box-sizing:border-box;margin:0}body{font-family:Inter,sans-serif}
.c{width:${85+2*B}mm;height:${55+2*B}mm;position:relative;overflow:hidden;page-break-after:always}
.c::after{content:"";position:absolute;inset:0;background:url("${grain}");mix-blend-mode:overlay;opacity:.14;pointer-events:none}
.syne{font-family:Syne,sans-serif;font-weight:800}
.d{background:radial-gradient(90% 120% at 100% 0%,#2E2711 0%,#15120A 50%,#0A0908 100%);color:#F5F4F0}
.g{background:linear-gradient(135deg,#F5D77A 0%,#D4AF37 48%,#B8941E 100%);color:#14110A}
.fr{position:absolute;left:${B+3.5}mm;right:${B+3.5}mm;top:${B+3.5}mm;bottom:${B+3.5}mm;border:.18mm solid rgba(212,175,55,.6)}
.g .fr{border-color:rgba(20,17,10,.35)}
.in{position:absolute;left:${B+8}mm;right:${B+8}mm;top:${B+8}mm;bottom:${B+8}mm}
.bd{position:absolute;left:0;top:0;width:11mm;height:11mm;filter:drop-shadow(0 .7mm 1.2mm rgba(0,0,0,.5))}
.g .bd{filter:drop-shadow(0 .6mm 1mm rgba(60,40,0,.4))}
.tag{position:absolute;left:0;top:15mm;font-size:6.4pt;font-weight:500;line-height:1.5;color:rgba(245,244,240,.72);max-width:38mm}
.url{position:absolute;left:0;bottom:0;font-size:19pt;line-height:.9;letter-spacing:-.01em;color:#F5F4F0}.url b{color:#E2BD4A;font-weight:800}
.tile{position:absolute;right:0;bottom:0;width:19mm;height:19mm;background:#F5F4F0;border-radius:2.2mm;padding:1.9mm}
.d .tile{box-shadow:0 0 0 .25mm #D4AF37,0 1.2mm 4mm rgba(0,0,0,.55)}
.g .tile{background:#FFFDF7;box-shadow:0 1.2mm 3mm rgba(60,40,0,.4)}
.tile svg{width:100%;height:100%;display:block}
.ig{position:absolute;left:0;top:0;display:flex;align-items:center;gap:2mm;font-size:6.2pt;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.ig i{width:6.5mm;height:6.5mm;border-radius:50%;border:.25mm solid #14110A;display:flex;align-items:center;justify-content:center}.ig i svg{width:3.5mm;height:3.5mm}
.cta{position:absolute;left:0;top:11mm;font-size:6.4pt;font-weight:600;line-height:1.5;color:rgba(20,17,10,.75);max-width:36mm}
.handle{position:absolute;left:0;bottom:0;font-size:14pt;line-height:.9;letter-spacing:-.01em}
.bd2{position:absolute;right:0;top:0;width:9mm;height:9mm;filter:drop-shadow(0 .6mm 1mm rgba(0,0,0,.35))}`;
const front = (B) => `<div class="c d"><div class="fr"></div><div class="in">
 <div class="bd">${badge(GOLD,'#0A0A0A','a')}</div>
 <div class="tag">Profesionales y organizadores de eventos, en un solo sitio.</div>
 <div class="url syne">xpeak<b>.es</b></div><div class="tile">${qw}</div></div></div>`;
const back = (B) => `<div class="c g"><div class="fr"></div><div class="in">
 <div class="ig"><i>${IG('#14110A')}</i>Instagram</div>
 <div class="cta">Síguenos y entérate de todo<br>lo que se mueve en eventos.</div>
 <div class="bd2">${badge(BLK,'#E2BD4A','b')}</div>
 <div class="handle syne">@xpeaksite</div><div class="tile">${qi}</div></div></div>`;
const page = (B, n) => `<!doctype html><meta charset=utf-8><style>${css(B)}@page{size:${85+2*B}mm ${55+2*B}mm;margin:0}</style><body>${n}</body>`;
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const mm = 96 / 25.4;
for (const [B, tag] of [[0, 'sin-sangrado'], [3, 'imprenta-sangrado-3mm']]) {
  const pngs = [];
  for (const [name, fn] of [['FRENTE', front], ['REVERSO', back]]) {
    const p = await browser.newPage({ viewport: { width: Math.round((85+2*B)*mm), height: Math.round((55+2*B)*mm) }, deviceScaleFactor: 3.125 });
    await p.setContent(page(B, fn(B))); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
    const f = `tarjeta-logo-${name}-${tag}.png`; await p.screenshot({ path: f }); pngs.push(f); await p.close();
  }
  const p = await browser.newPage();
  const imgs = pngs.map(f => `<img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="display:block;width:${85+2*B}mm;height:${55+2*B}mm;page-break-after:always">`).join('');
  await p.setContent(`<style>@page{size:${85+2*B}mm ${55+2*B}mm;margin:0}body{margin:0}</style>${imgs}`);
  await p.pdf({ path: `tarjeta-xpeak-logo-${tag}.pdf`, width: `${85+2*B}mm`, height: `${55+2*B}mm`, printBackground: true });
  await p.close();
}
await browser.close();
