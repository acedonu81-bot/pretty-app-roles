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

// Rutas dinámicas /contratar-:categoria/:ciudad → CityLanding. StaticRouter
// soporta cualquier location string, así que basta con expandir cada
// combinación real (misma fuente que prerender-meta.mjs) y apuntarlas todas
// al mismo componente.
function extractObjectLiteral(filePath, exportName) {
  const src = fs.readFileSync(filePath, 'utf8');
  const marker = `export const ${exportName}`;
  const markerIdx = src.indexOf(marker);
  if (markerIdx === -1) throw new Error(`${marker} not found in ${filePath}`);
  const braceStart = src.indexOf('{', src.indexOf('=', markerIdx));
  let depth = 0, end = -1;
  for (let i = braceStart; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error(`Unbalanced braces reading ${exportName}`);
  // eslint-disable-next-line no-eval
  const obj = eval(`(${src.slice(braceStart, end + 1)})`);
  // Alias post-objeto tipo "CATEGORY_DATA.animadores = CATEGORY_DATA.animador;"
  const aliasRe = new RegExp(`${exportName}\\.(\\w+)\\s*=\\s*${exportName}\\.(\\w+);`, 'g');
  for (const m of src.slice(end + 1).matchAll(aliasRe)) {
    obj[m[1]] = obj[m[2]];
  }
  return obj;
}

// CATEGORIES (CityLanding.tsx) es la fuente real que consume el componente en
// runtime, sin restricción de ciudades — a diferencia de CATEGORY_DATA.cities
// (CategoryLanding.tsx) que es solo una lista curada corta para /contratar-X
// sin ciudad. Solo se generan combinaciones cuya ruta /contratar-X/:ciudad
// esté realmente registrada en App.tsx (evita prerenderizar 404s).
const CITY_CATEGORIES = extractObjectLiteral(path.join(ROOT, 'src', 'pages', 'CityLanding.tsx'), 'CATEGORIES');
const CITIES = extractObjectLiteral(path.join(ROOT, 'src', 'pages', 'CityLanding.tsx'), 'CITIES');
const routedCitySlugs = [...APP.matchAll(/<Route path="\/contratar-([a-z-]+)\/:ciudad"/g)].map(m => m[1]);
let dynamicCount = 0;
for (const catSlug of routedCitySlugs) {
  if (!CITY_CATEGORIES[catSlug]) continue;
  for (const citySlug of Object.keys(CITIES)) {
    routes.push({ routePath: `/contratar-${catSlug}/${citySlug}`, file: 'CityLanding.tsx', routePattern: `/contratar-${catSlug}/:ciudad` });
    dynamicCount++;
  }
}
console.log(`  → ${dynamicCount} rutas ciudad/categoría dinámicas añadidas al prerender de contenido`);

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
for (const { routePath, file, routePattern } of routes) {
  const htmlFile = routePath === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, routePath.slice(1), 'index.html');
  if (!fs.existsSync(htmlFile)) { missing++; continue; }
  try {
    const { html, headScripts } = await renderPage(file, routePath, routePattern);
    let doc = fs.readFileSync(htmlFile, 'utf8');
    // Sustituye el shell vacío (incluido el texto oculto legacy) por contenido real
    doc = doc.replace(/<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>|\n\s*<\/body>)/, `<div id="root">${html}</div>\n  `);
    // JSON-LD y demás scripts de Helmet que aún no estén en el head
    if (headScripts && !doc.includes(headScripts.slice(0, 120))) {
      doc = doc.replace('</head>', `${headScripts}\n</head>`);
    }
    // Coherencia de autor: los artículos de blog declaran author Person:Daniel
    // en su JSON-LD, así que su <meta author> global "XPEAK" contradice esa
    // señal E-E-A-T. Alinéala a la persona en las rutas de blog; el resto del
    // sitio conserva la marca como autor.
    if (routePath.startsWith('/blog/')) {
      doc = doc.replace(
        /<meta name="author" content="XPEAK"\s*\/>/,
        '<meta name="author" content="Daniel, Fundador de XPEAK" />'
      );
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
