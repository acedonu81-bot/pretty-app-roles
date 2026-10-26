import QRCode from 'qrcode';
import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path'; import { pathToFileURL } from 'url';
const base = 'https://xpeak.site/auth?mode=register';
const url = (role) => `${base}&role=${role}&utm_source=flyer&utm_medium=print&utm_campaign=flyer_${role}`;
const qr = (t) => QRCode.toString(t, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#241C08', light: '#FFFFFF' } });
const [qe, qp] = await Promise.all([qr(url('empresario')), qr(url('profesional'))]);
const photo = pathToFileURL(path.resolve('../../public/images/pexels/1763075.jpg')).href;
const IG = () => `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r=".6" fill="#fff"/></svg>`;
const TTP = 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z';
const TT = () => `<svg viewBox="-1 -1 26 26"><path d="${TTP}" fill="#25F4EE" transform="translate(-.9 -.7)"/><path d="${TTP}" fill="#FE2C55" transform="translate(.9 .7)"/><path d="${TTP}" fill="#fff"/></svg>`;
const [qi, qt] = await Promise.all([qr('https://www.instagram.com/xpeaksite'), qr('https://www.tiktok.com/@xpeak30')]);
const icon = pathToFileURL(path.resolve('xpeak-icon.png')).href;
const html = `<!doctype html><html lang="es"><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@500;600;700;800&display=swap');
@page{size:105mm 148mm;margin:0}
*{box-sizing:border-box;margin:0}
body{font-family:Inter,Helvetica,Arial,sans-serif;color:#241C08}
.page{width:105mm;height:148mm;position:relative;overflow:hidden;background:#FFFDF7;display:flex;flex-direction:column;page-break-after:always}
.syne{font-family:Syne,Inter,sans-serif;font-weight:800}
.gold{text-shadow:none;background:linear-gradient(90deg,#E9C866,#FBE9A0 50%,#E9C866);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero{height:62mm;padding:6mm 7mm 0;background:linear-gradient(180deg,rgba(36,28,8,.78),rgba(36,28,8,.92)),url("${photo}") center 30%/cover;color:#fff;position:relative}
.mark{width:12mm;height:12mm;border-radius:2.8mm;display:block;box-shadow:0 .8mm 2mm rgba(0,0,0,.35)}.mark.big{width:19mm;height:19mm;border-radius:4.4mm}
h1{font-size:15pt;line-height:1.12;margin-top:3.5mm;text-shadow:0 .4mm 1.6mm rgba(0,0,0,.6)}.sub{text-shadow:0 .3mm 1.2mm rgba(0,0,0,.7)}
.sub{font-size:8pt;line-height:1.35;margin-top:2.6mm;font-weight:600;color:#FFF3C7;max-width:88mm}
.cards{display:flex;gap:4mm;margin:-9mm 5.5mm 0;position:relative}
.card{flex:1;border-radius:4mm;padding:3.6mm 3mm 3mm;text-align:center;display:flex;flex-direction:column;align-items:center;position:relative;box-shadow:0 1.2mm 3mm rgba(36,28,8,.18)}
.card.e{background:linear-gradient(160deg,#F2D675,#D4AF37 55%,#B8941E);color:#241C08}
.card.p{background:linear-gradient(160deg,#F1F6FF,#D6E4FF);border:.3mm solid #BFD3FF;color:#1E3A8A}
.sticker{position:absolute;top:-2.6mm;right:-1.8mm;background:#059669;color:#fff;font-weight:800;font-size:6.6pt;letter-spacing:.05em;text-transform:uppercase;padding:1.1mm 2.3mm;border-radius:10mm;transform:rotate(6deg);box-shadow:0 .6mm 1.4mm rgba(0,0,0,.25)}
.tag{font-weight:800;font-size:6.3pt;letter-spacing:.06em;text-transform:uppercase;padding:1.1mm 2.4mm;border-radius:10mm;white-space:nowrap;background:#fff}
.e .tag{color:#7a5d00}.p .tag{color:#2563EB}
.card h2{min-height:9.5mm;display:flex;align-items:center;font-size:10pt;margin:2mm 0 .8mm;line-height:1.1}
.card p{font-size:7.2pt;line-height:1.3;min-height:12.5mm;font-weight:600}
.qr{width:33mm;height:33mm;background:#fff;border-radius:2.5mm;padding:2mm;margin-top:.8mm}.qr svg{width:100%;height:100%;display:block}
.scan{font-size:7.6pt;font-weight:800;margin-top:1.8mm}
.p .scan{color:#2563EB}
.social{margin-top:auto;padding:0 0 4.5mm;display:flex;justify-content:center;gap:5mm;align-items:center;font-weight:700;font-size:8pt}
.social div{display:flex;align-items:center;gap:1.8mm}
.ic{width:6.5mm;height:6.5mm;border-radius:50%;background:#241C08;display:flex;align-items:center;justify-content:center}.ic svg{width:3.6mm;height:3.6mm}.ic.ig{background:linear-gradient(45deg,#F9A13A,#DD2A7B 50%,#8134AF 80%,#515BD4)}.ic.tt{background:#010101}
/* sangrado 3mm */
.bleed .page{width:111mm;height:154mm;padding:0 3mm 3mm}
.bleed .hero{margin:0 -3mm;height:65mm;padding:9mm 10mm 0}
/* reverso */
.card.ig{background:linear-gradient(160deg,#F9A13A,#DD2A7B 55%,#8134AF);color:#fff}
.card.tt{background:linear-gradient(160deg,#2b2b2b,#010101);color:#fff}
.ig .tag{color:#DD2A7B}.tt .tag{color:#010101}
.card.ig h2,.card.tt h2{min-height:9.5mm;font-family:Inter,sans-serif;font-weight:800;font-size:11.5pt}
.url{font-size:11pt;background:#241C08;color:#F2D675;padding:2mm 6mm;border-radius:10mm}
.back{background:linear-gradient(160deg,#F2D675,#D4AF37 55%,#B8941E);align-items:center;justify-content:center;text-align:center;padding:0 9mm}
.back h2{font-size:13.5pt;line-height:1.1;margin-top:6mm;color:#241C08}
.back p.t{font-size:8.5pt;font-weight:600;margin-top:2mm}
.row{display:flex;align-items:center;gap:3.5mm;background:#fff;border-radius:5mm;padding:3mm 4mm;width:100%;margin-top:4mm;text-align:left;box-shadow:0 1.2mm 3mm rgba(36,28,8,.2)}
.row .ic{width:11mm;height:11mm}.row .ic svg{width:6mm;height:6mm}.row .tx{flex:1}.row .q{width:19mm;height:19mm;flex:none}.row .q svg{width:100%;height:100%;display:block}
.row b{display:block;font-size:12pt}.row span{font-size:8pt;color:#6b5a22;font-weight:600}
.back .url{margin-top:7mm;font-size:12pt;background:#241C08;color:#F2D675;padding:2.4mm 6mm;border-radius:10mm}
</style><body>
<div class="page" id="f">
 <div class="hero"><img class="mark" src="${icon}">
  <h1 class="syne">¿Organizas<br>o trabajas<br><span class="gold">en eventos?</span></h1>
  <div class="sub">DJs, fotógrafos, camareros, food trucks y más. Sin intermediarios y 0 comisión.</div></div>
 <div class="cards">
  <div class="card e"><div class="tag">Organizo eventos</div><h2 class="syne">Empresario u organizador</h2><p>Publica lo que necesitas y te responden los profesionales disponibles.</p><div class="qr">${qe}</div><div class="scan">Escanea y publica</div></div>
  <div class="card p"><div class="tag">Trabajo en eventos</div><h2 class="syne">Profesional</h2><p>Crea tu perfil con fotos y tarifa y recibe avisos de eventos en tu zona.</p><div class="qr">${qp}</div><div class="scan">Escanea y crea tu perfil</div></div>
 </div>
 <div class="social"><div><span class="ic ig">${IG()}</span>@xpeaksite</div><div><span class="ic tt">${TT()}</span>@xpeak30</div></div>
</div>
<div class="page" id="b">
 <div class="hero"><img class="mark" src="${icon}">
  <h1 class="syne">Síguenos y<br>entérate de<br><span class="gold">los bolos</span></h1>
  <div class="sub">Novedades, eventos y profesionales de XPEAK cada semana.</div></div>
 <div class="cards">
  <div class="card ig"><div class="tag">Instagram</div><h2 class="syne">@xpeaksite</h2><p>Escanea el código y síguenos para no perderte nada.</p><div class="qr">${qi}</div><div class="scan">Escanea y síguenos</div></div>
  <div class="card tt"><div class="tag">TikTok</div><h2 class="syne">@xpeak30</h2><p>Escanea el código y síguenos para no perderte nada.</p><div class="qr">${qt}</div><div class="scan">Escanea y síguenos</div></div>
 </div>
 <div class="social"><span class="url syne">xpeak.site</span></div>
</div>
</body></html>`;
const K = 0.7048; // A6 (105 mm) -> A7 (74 mm)
const escala = (css) => css
  .replace(/(\d*\.?\d+)mm/g, (m, v) => `${(parseFloat(v) * K).toFixed(2)}mm`)
  .replace(/(\d*\.?\d+)pt/g, (m, v) => `${Math.max(6, parseFloat(v) * 0.8).toFixed(1)}pt`);
const htmlA7 = html.replace('Empresario u organizador', 'Organizador').replace('>Organizo eventos<', '>Organizo<').replace('>Trabajo en eventos<', '>Trabajo<').replace(/<style>([\s\S]*?)<\/style>/, (m, css) => {
  const sinSangrado = css.replace(/\/\* sangrado 3mm \*\/[\s\S]*?(?=\/\* reverso \*\/)/, '');
  const [importFuentes, resto] = [sinSangrado.match(/@import url\([^)]*\);/)[0], sinSangrado.replace(/@import url\([^)]*\);/, '')];
  return `<style>${importFuentes}${escala(resto)}
@page{size:74mm 105mm;margin:0}
.page{width:74mm;height:105mm}
.bleed .page{width:80mm;height:111mm;padding:0 3mm 3mm}
.bleed .hero{margin:0 -3mm;height:46.7mm;padding:7.2mm 7.9mm 0}
</style>`;
});
fs.writeFileSync('flyer-a7.html', htmlA7);
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 420, height: 600 }, deviceScaleFactor: 8 });
await p.goto(pathToFileURL(path.resolve('flyer-a7.html')).href, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.locator('#f').screenshot({ path: 'flyer-xpeak-A7-frente.png' });
await p.locator('#b').screenshot({ path: 'flyer-xpeak-A7-reverso.png' });
await p.evaluate(() => document.body.classList.add('bleed'));
await p.locator('#f').screenshot({ path: 'bleed-a7-frente.png' });
await p.locator('#b').screenshot({ path: 'bleed-a7-reverso.png' });
const img = (n) => 'data:image/png;base64,' + fs.readFileSync(n).toString('base64');
const pdf = async (path_, w, h, imgs) => {
  const q = await b.newPage();
  await q.setContent(`<style>@page{size:${w}mm ${h}mm;margin:0}*{margin:0}img{display:block;width:${w}mm;height:${h}mm;page-break-after:always}</style>` + imgs.map(i => `<img src="${img(i)}">`).join(''));
  await q.pdf({ path: path_, width: w + 'mm', height: h + 'mm', printBackground: true }); await q.close();
};
const dl = process.env.HOME + '/Downloads/';
await pdf('flyer-xpeak-A7.pdf', 74, 105, ['flyer-xpeak-A7-frente.png', 'flyer-xpeak-A7-reverso.png']);
await pdf(dl + 'flyer-xpeak-A7-FRENTE-sangrado-3mm.pdf', 80, 111, ['bleed-a7-frente.png']);
await pdf(dl + 'flyer-xpeak-A7-REVERSO-sangrado-3mm.pdf', 80, 111, ['bleed-a7-reverso.png']);
await pdf(dl + 'flyer-xpeak-A7-IMPRENTA-sangrado-3mm.pdf', 80, 111, ['bleed-a7-frente.png', 'bleed-a7-reverso.png']);
await b.close();
