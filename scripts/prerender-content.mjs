/**
 * Post-build content prerender.
 * Renders each static route's React component to real HTML (via the SSR
 * bundle built from src/entry-prerender.tsx) and injects it into the
 * corresponding dist/[path]/index.html created by prerender-meta.mjs.
 * Crawlers then see full page content instead of an empty SPA shell.
 *
 * Run after prerender-meta.mjs:
 *   vite build --ssr src/entry-prerender.tsx --outDir dist-ssr
 *   node scripts/prerender-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const APP = fs.readFileSync(path.join(ROOT, 'src', 'App.tsx'), 'utf8');

// Routes que nunca deben prerenderizarse con contenido (app privada / auth)
const SKIP = new Set(['/auth', '/dashboard', '/admin-beta', '/baja-emails', '/eliminar-cuenta']);

// name → archivo de página, desde los lazy imports de App.tsx
const componentFiles = new Map();
for (const m of APP.matchAll(/const (\w+) = lazy\(\(\) => import\("\.\/pages\/(\w+)"\)\)/g)) {
  componentFiles.set(m[1], `${m[2]}.tsx`);
}
for (const m of APP.matchAll(/^import (\w+) from ["']\.\/pages\/(\w+)["'];?$/gm)) {
  componentFiles.set(m[1], `${m[2]}.tsx`);
}

// path → component name, desde las <Route> de App.tsx (solo rutas estáticas)
const routes = [];
for (const m of APP.matchAll(/<Route path="([^"]+)" element={<(\w+)/g)) {
  const [, routePath, name] = m;
  if (routePath.includes(':') || routePath.includes('*')) continue;
  if (SKIP.has(routePath)) continue;
  const file = componentFiles.get(name);
  if (file) routes.push({ routePath, file });
}

// Shims mínimos de navegador para componentes que los tocan durante el render
const memStorage = () => {
  const s = new Map();
  return {
    getItem: (k) => (s.has(k) ? s.get(k) : null),
    setItem: (k, v) => s.set(k, String(v)),
    removeItem: (k) => s.delete(k),
    clear: () => s.clear(),
    key: (i) => [...s.keys()][i] ?? null,
    get length() { return s.size; },
  };
};
globalThis.localStorage ??= memStorage();
globalThis.sessionStorage ??= memStorage();
globalThis.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });

const { renderPage } = await import(path.join(ROOT, 'dist-ssr', 'entry-prerender.js'));

let ok = 0, failed = 0, missing = 0;
const failures = [];
for (const { routePath, file } of routes) {
  const htmlFile = routePath === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, routePath.slice(1), 'index.html');
  if (!fs.existsSync(htmlFile)) { missing++; continue; }
  try {
    const { html, headScripts } = await renderPage(file, routePath);
    let doc = fs.readFileSync(htmlFile, 'utf8');
    // Sustituye el shell vacío (incluido el texto oculto legacy) por contenido real
    doc = doc.replace(/<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>|\n\s*<\/body>)/, `<div id="root">${html}</div>\n  `);
    // JSON-LD y demás scripts de Helmet que aún no estén en el head
    if (headScripts && !doc.includes(headScripts.slice(0, 120))) {
      doc = doc.replace('</head>', `${headScripts}\n</head>`);
    }
    fs.writeFileSync(htmlFile, doc);
    ok++;
  } catch (e) {
    failed++;
    failures.push(`${routePath} (${file}): ${e.message?.slice(0, 120)}`);
  }
}

console.log(`Prerender content: ${ok} páginas con HTML real, ${failed} fallidas, ${missing} sin archivo dist`);
if (failures.length) {
  console.log('Fallos (se quedan como shell SPA):');
  for (const f of failures.slice(0, 20)) console.log('  -', f);
}
if (ok === 0) {
  console.error('ERROR: ninguna página prerenderizada con contenido');
  process.exit(1);
}
