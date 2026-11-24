import QRCode from 'qrcode';
import { chromium } from 'playwright';
import fs from 'fs';
const qr = (t, dark = '#14110A') => QRCode.toString(t, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark, light: '#00000000' } });
const [qw, qi] = await Promise.all([
  qr('https://xpeak.es/?utm_source=tarjeta&utm_medium=print&utm_campaign=tarjeta_web'),
  qr('https://www.instagram.com/xpeaksite')]);
const IG = `<svg viewBox="0 0 24 24" fill="none" stroke="#14110A" stroke-width="2" stroke-linecap="butt"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r=".7" fill="#14110A"/></svg>`;
const grain = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>`)}`;
// X de marca: dos trazos redondeados (mismo trazo que el icono oficial), en mm
const X = (cx, cy, r, w, fill, extra = '') => `
 <line x1="${cx-r}" y1="${cy-r}" x2="${cx+r}" y2="${cy+r}" stroke="${fill}" stroke-width="${w}" stroke-linecap="butt" ${extra}/>
 <line x1="${cx+r}" y1="${cy-r}" x2="${cx-r}" y2="${cy+r}" stroke="${fill}" stroke-width="${w}" stroke-linecap="butt" ${extra}/>`;
const css = (B) => `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@500;600;700&display=swap');
*{box-sizing:border-box;margin:0}body{font-family:Inter,sans-serif}
.c{width:${85+2*B}mm;height:${55+2*B}mm;position:relative;overflow:hidden;page-break-after:always}
.c>svg.art{position:absolute;inset:0;width:100%;height:100%}
.c::after{content:"";position:absolute;inset:0;background:url("${grain}");mix-blend-mode:multiply;opacity:.10;pointer-events:none}
.syne{font-family:Syne,sans-serif;font-weight:800}
.f{background:radial-gradient(110% 130% at 85% 5%,#FFFDF6 0%,#F5F4F0 55%,#EAE5D6 100%);color:#0D0D0D}
.b{background:linear-gradient(135deg,#F5D77A 0%,#D4AF37 45%,#B8941E 100%);color:#14110A}
.in{position:absolute;left:${B+6}mm;right:${B+6}mm;top:${B+6}mm;bottom:${B+6}mm}
.url{position:absolute;left:0;bottom:0;font-size:19pt;line-height:.9;letter-spacing:-.01em;color:#0D0D0D}
.sub{position:absolute;left:0;top:0;font-size:6.6pt;font-weight:600;line-height:1.45;color:#5b4f2c;max-width:30mm}
.tile{position:absolute;right:0;bottom:0;width:21mm;height:21mm;background:#F5F4F0;border-radius:2.6mm;padding:2mm;box-shadow:0 1mm 3.5mm rgba(120,90,10,.35);border:.2mm solid #E6D9A8}
.tile svg{width:100%;height:100%;display:block}
.b .tile{box-shadow:0 1.2mm 3mm rgba(60,40,0,.35)}
.handle{position:absolute;left:0;bottom:0;font-size:13.5pt;line-height:.9;letter-spacing:-.01em}
.ig{position:absolute;left:0;top:0;display:flex;align-items:center;gap:2mm;font-size:6.6pt;font-weight:700}
.ig i{width:7mm;height:7mm;border-radius:50%;border:.3mm solid #14110A;display:flex;align-items:center;justify-content:center}.ig i svg{width:3.8mm;height:3.8mm}`;
const defs = `<defs>
 <linearGradient id="g1" gradientUnits="userSpaceOnUse" x1="50" y1="-2" x2="78" y2="36"><stop offset="0" stop-color="#F5D77A"/><stop offset=".45" stop-color="#D4AF37"/><stop offset="1" stop-color="#B8941E"/></linearGradient>
 <linearGradient id="g2" gradientUnits="userSpaceOnUse" x1="95" y1="-8" x2="40" y2="55"><stop offset="0" stop-color="#F5D77A"/><stop offset=".45" stop-color="#D4AF37"/><stop offset="1" stop-color="#B8941E"/></linearGradient>
 <linearGradient id="wo" gradientUnits="userSpaceOnUse" x1="50" y1="-2" x2="78" y2="36"><stop offset="0" stop-color="#F8E3A0"/><stop offset="1" stop-color="#DDBC52"/></linearGradient><linearGradient id="w" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="60" y2="60"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity=".06"/></linearGradient>
 <radialGradient id="halo"><stop offset="0" stop-color="#D4AF37" stop-opacity=".28"/><stop offset="1" stop-color="#D4AF37" stop-opacity="0"/></radialGradient><filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5"/></filter></defs>`;
const front = (B) => `<div class="c f">
 <svg class="art" viewBox="0 0 ${85+2*B} ${55+2*B}" preserveAspectRatio="none">${defs}
  <g transform="translate(${B} ${B})">
   <circle cx="64" cy="17" r="34" fill="url(#halo)"/>
   ${X(63,17,21,7.5,'url(#g1)')}
  </g></svg>
 <div class="in"><div class="sub">Profesionales y organizadores de eventos, en un solo sitio.</div><div class="url syne">xpeak.es</div><div class="tile">${qw}</div></div></div>`;
const back = (B) => `<div class="c b">
 <svg class="art" viewBox="0 0 ${85+2*B} ${55+2*B}" preserveAspectRatio="none">${defs}
  <g transform="translate(${B} ${B})">${X(63,17,21,7.5,'url(#wo)')}</g></svg>
 <div class="in"><div class="ig"><i>${IG}</i>Instagram</div><div class="handle syne">@xpeaksite</div><div class="tile">${qi}</div></div></div>`;
const page = (B, n) => `<!doctype html><meta charset=utf-8><style>${css(B)}@page{size:${85+2*B}mm ${55+2*B}mm;margin:0}</style><body>${n}</body>`;
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const mm = 96 / 25.4;
for (const [B, tag] of [[0, 'sin-sangrado'], [3, 'imprenta-sangrado-3mm']]) {
  const pngs = [];
  for (const [name, fn] of [['FRENTE', front], ['REVERSO', back]]) {
    const p = await browser.newPage({ viewport: { width: Math.round((85+2*B)*mm), height: Math.round((55+2*B)*mm) }, deviceScaleFactor: 3.125 });
    await p.setContent(page(B, fn(B))); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
    const f = `tarjeta-${name}-${tag}.png`; await p.screenshot({ path: f }); pngs.push(f); await p.close();
  }
  const p = await browser.newPage();
  const imgs = pngs.map(f => `<img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="display:block;width:${85+2*B}mm;height:${55+2*B}mm;page-break-after:always">`).join('');
  await p.setContent(`<style>@page{size:${85+2*B}mm ${55+2*B}mm;margin:0}body{margin:0}</style>${imgs}`);
  await p.pdf({ path: `tarjeta-xpeak-${tag}.pdf`, width: `${85+2*B}mm`, height: `${55+2*B}mm`, printBackground: true });
  await p.close();
}
await browser.close();
