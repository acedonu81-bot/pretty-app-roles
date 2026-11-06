import { chromium } from 'playwright';
const b = await chromium.connectOverCDP('http://localhost:9222');
const ctx = b.contexts()[0];
for (const p of ctx.pages()) console.log(p.url());
const p = ctx.pages().find(x => x.url().includes('xpeak')) ?? ctx.pages()[0];
console.log(await p.evaluate(() => [...document.querySelectorAll('nav button, aside button, nav a, aside a')].map(e => (e.innerText||e.getAttribute('aria-label')||'').trim().replace(/\n/g,' ')).filter(Boolean).join(' | ')));
await p.screenshot({ path: '.sesion/probe.png' });
await b.close();
