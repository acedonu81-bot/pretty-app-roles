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

function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  const raw = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

// Mismo mapeo slug-categoría → roles-BD que ROLE_MAP en CityLanding.tsx —
// debe mantenerse en sincronía si ese mapeo cambia.
const ROLE_MAP = {
  dj: ['dj'], camareros: ['camarero', 'staff'], fotografo: ['media'], staff: ['staff', 'promotor'],
  catering: ['empresario'], maquillaje: ['makeup'], peluqueria: ['peluqueria'], promotores: ['promotor'],
  'disco-movil': ['dj'], vestuario: ['vestuario', 'staff'], azafata: ['azafata'],
  bailarin: ['bailarin'], 'grupo-musical': ['grupo-musical'],
  humorista: ['humorista'], monologo: ['humorista'], monologos: ['humorista'],
  mago: ['mago'], animador: ['animador'], animadores: ['animador'],
  payaso: ['payaso'], payasos: ['payaso'], speaker: ['speaker'],
  'photo-booth': ['photo-booth'],
};

// Una sola query trae todos los perfiles activos; se filtra/ordena en memoria
// por ciudad+categoría al vuelo, igual que el hook useCityProfessionals hace
// en el navegador — evita miles de round-trips (una por cada una de las
// ~2.100 páginas ciudad×categoría).
async function fetchAllProfilesForPrerender() {
  try {
    const env = loadEnv();
    const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
    const anonKey = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !anonKey) {
      console.warn('  ⚠ Sin credenciales Supabase — páginas ciudad/categoría se prerenderizan sin profesionales');
      return [];
    }
    const url = `${supabaseUrl}/rest/v1/profiles?select=user_id,display_name,photo_url,bio,zone,role,score,is_verified,is_primary,is_early_adopter_override&role=neq.empresario&is_seed=eq.false&limit=1000`;
    const res = await fetch(url, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
    if (!res.ok) {
      console.warn('  ⚠ No se pudieron cargar profesionales para el prerender:', res.status);
      return [];
    }
    return await res.json();
  } catch (e) {
    console.warn('  ⚠ Fetch de profesionales para prerender omitido:', e.message);
    return [];
  }
}

function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapProfile(p) {
  return {
    id: p.user_id,
    display_name: p.display_name ?? 'Profesional',
    photo_url: p.photo_url,
    bio: p.bio,
    city: p.zone,
    role: p.role,
    score: p.score ?? 0,
    slug: toSlug(p.display_name ?? p.user_id),
    is_verified: p.is_verified ?? false,
    is_early_adopter: !!p.is_early_adopter_override,
  };
}

// Reproduce la lógica de useCityProfessionals: hasta 6 profesionales de la
// ciudad (por score desc); si no hay ninguno, hasta 4 sugerencias nacionales.
function resolveProfilesForCity(allProfiles, ciudad, categorySlug) {
  const roles = ROLE_MAP[categorySlug] ?? ['dj'];
  const byRole = allProfiles.filter(p => roles.includes(p.role));
  const inCity = byRole
    .filter(p => p.zone && p.zone.toLowerCase().includes(ciudad.toLowerCase()))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 6);
  if (inCity.length > 0) {
    return { profs: inCity.map(mapProfile), suggestions: [] };
  }
  const suggestions = [...byRole].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 4);
  return { profs: [], suggestions: suggestions.map(mapProfile) };
}

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

// Rutas de ocasión /:ocasion/contratar-:rol → OccasionLanding. Se leen de
// ROLES_POR_OCASION (OccasionLanding.tsx) y se registran como rutas explícitas
// en App.tsx, así que todas existen y no generan 404s.
const OCC_ROLES = extractObjectLiteral(path.join(ROOT, 'src', 'pages', 'OccasionLanding.tsx'), 'ROLES_POR_OCASION');
let occCount = 0;
for (const [occSlug, roleSlugs] of Object.entries(OCC_ROLES)) {
  for (const roleSlug of roleSlugs) {
    const routePath = `/${occSlug}/contratar-${roleSlug}`;
    if (!APP.includes(`path="${routePath}"`)) continue; // solo rutas realmente registradas
    routes.push({ routePath, file: 'OccasionLanding.tsx' });
    occCount++;
  }
}
console.log(`  → ${occCount} rutas ocasión/rol añadidas al prerender de contenido`);

// Rutas de directorio /directorio/:rol → DirectorioPublico. Finitas (un slug
// por rol en ROLE_CONFIG), a diferencia de /p/:slug que depende de perfiles
// reales en Supabase y no se prerenderiza.
const ROLE_CONFIG = extractObjectLiteral(path.join(ROOT, 'src', 'pages', 'DirectorioPublico.tsx'), 'ROLE_CONFIG');
let dirCount = 0;
for (const roleSlug of Object.keys(ROLE_CONFIG)) {
  routes.push({ routePath: `/directorio/${roleSlug}`, file: 'DirectorioPublico.tsx', routePattern: '/directorio/:rol' });
  dirCount++;
}
console.log(`  → ${dirCount} rutas de directorio/rol añadidas al prerender de contenido`);

// Rutas de eventos /socials/:slug → SocialEvent. Igual que /p/:slug, depende
// de datos reales en Supabase — se resuelven con la misma consulta que
// prerender-meta.mjs ya hace para generar la ruta con sus meta tags.
const socialEvents = [];
try {
  const env = loadEnv();
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const anonKey = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (supabaseUrl && anonKey) {
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch(
      `${supabaseUrl}/rest/v1/dance_socials?select=id,event_name,style,city,venue,event_date,description,link_url,user_id&event_date=gte.${today}&order=event_date.asc&limit=500`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } }
    );
    if (res.ok) {
      const events = await res.json();
      for (const e of events) {
        const slug = `${toSlug(e.event_name)}-${e.id.slice(0, 8)}`;
        const routePath = `/socials/${slug}`;
        routes.push({ routePath, file: 'SocialEvent.tsx', routePattern: '/socials/:slug' });
        socialEvents.push({ routePath, event: e });
      }
    }
  }
} catch (e) {
  console.warn('  ⚠ No se pudieron cargar eventos para el prerender de /socials/:slug:', e.message);
}
console.log(`  → ${socialEvents.length} rutas de evento añadidas al prerender de contenido`);

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

const allProfiles = await fetchAllProfilesForPrerender();
console.log(`  → ${allProfiles.length} profesionales cargados para resolver contenido de páginas ciudad/categoría`);

let ok = 0, failed = 0, missing = 0;
const failures = [];
for (const { routePath, file, routePattern } of routes) {
  const htmlFile = routePath === '/'
    ? path.join(DIST, 'index.html')
    : path.join(DIST, routePath.slice(1), 'index.html');
  if (!fs.existsSync(htmlFile)) { missing++; continue; }
  try {
    let preloadedProfiles;
    let preloadedSocialEvent;
    if (file === 'CityLanding.tsx') {
      const catSlug = routePattern.split('/contratar-')[1]?.split('/')[0];
      const citySlug = routePath.split('/').pop();
      const cityInfo = CITIES[citySlug];
      if (cityInfo && catSlug) {
        preloadedProfiles = resolveProfilesForCity(allProfiles, cityInfo.ciudad, catSlug);
      }
    }
    if (file === 'SocialEvent.tsx') {
      const found = socialEvents.find(se => se.routePath === routePath);
      const organizer = found ? allProfiles.find(p => p.user_id === found.event.user_id) : null;
      preloadedSocialEvent = found ? { ...found.event, organizer_name: organizer?.display_name ?? null } : null;
    }
    const { html, headScripts } = await renderPage(file, routePath, routePattern, preloadedProfiles, preloadedSocialEvent);
    let doc = fs.readFileSync(htmlFile, 'utf8');
    // Sustituye el shell vacío (incluido el texto oculto legacy) por contenido real
    doc = doc.replace(/<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>|\n\s*<\/body>)/, `<div id="root">${html}</div>\n  `);
    // Una página ciudad×categoría sin profesionales renderiza "Aún no hay":
    // es thin content y no debe indexarse. index.html trae un robots global
    // "index, follow" que Helmet no puede sustituir en el HTML servido, así
    // que se reescribe aquí. Mismo criterio de inventario que usa
    // scripts/update-sitemap.mjs para excluirla del sitemap.
    if (file === 'CityLanding.tsx' && !(preloadedProfiles?.profs?.length)) {
      doc = doc.replace(
        /<meta name="robots" content="index, follow"\s*\/>/,
        '<meta name="robots" content="noindex, follow" />'
      );
    }
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
      // Blogs con BlogAnswerBox ("Respuesta rápida") declaran esas clases CSS —
      // les añadimos SpeakableSpecification para que asistentes de voz
      // (Google Assistant) puedan leer la respuesta directamente.
      if (doc.includes('xpeak-speakable-answer') && !doc.includes('SpeakableSpecification')) {
        const speakable = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          url: `https://xpeak.es${routePath}`,
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.xpeak-speakable-question', '.xpeak-speakable-answer'],
          },
        });
        doc = doc.replace('</head>', `<script type="application/ld+json">${speakable}</script>\n</head>`);
      }
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

// El bundle SSR importa src/integrations/supabase/client.ts, cuyo cliente usa
// autoRefreshToken: true — en Node eso arranca un setInterval que nunca se
// limpia y deja el event loop vivo indefinidamente aunque el script ya haya
// terminado su trabajo (visto en la práctica: 2388 páginas ok, proceso nunca
// sale). Salida explícita para no depender de que Node cierre el loop solo.
process.exit(0);
