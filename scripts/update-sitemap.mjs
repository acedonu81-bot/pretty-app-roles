/**
 * Sitemap generator — runs at build time after vite build.
 * Merges static URLs + dynamic public profiles from Supabase.
 * Output: public/sitemap.xml
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { hasInventory, contentDate, extractObjectLiteral } from './city-inventory.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'sitemap.xml');
const OUT_DIST = path.join(ROOT, 'dist', 'sitemap.xml');
const TODAY = new Date().toISOString().slice(0, 10);

// Fecha real del último commit que tocó un archivo — evita declarar lastmod
// falso (fecha del build) en páginas cuyo contenido no ha cambiado.
const gitDateCache = new Map();
function lastCommitDate(relPath) {
  if (gitDateCache.has(relPath)) return gitDateCache.get(relPath);
  let date = TODAY;
  try {
    const out = execSync(`git log -1 --format=%ad --date=short -- "${relPath}"`, { cwd: ROOT, encoding: 'utf8' }).trim();
    if (out) date = out;
  } catch {}
  gitDateCache.set(relPath, date);
  return date;
}

// ─── Load .env manually (no dotenv dep needed) ────────────────────────────
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

// ─── Fetch all public profiles from Supabase ─────────────────────────────
// Se excluye 'pending' además de 'empresario': son altas que no han elegido
// oficio todavía, así que su ficha no describe ningún servicio. Indexarlas
// manda a Google a páginas vacías, y eso penaliza al dominio entero — es
// justo lo contrario de lo que busca tener 380 URLs indexables.
// Sin foto no genera URL indexable, retroactivo desde el 16 sep 2026.

// Un fallo de Supabase NO puede degradarse a "0 perfiles": con la lista vacía
// este script escribía un sitemap sin ninguna ficha y con las ~2.200 URLs
// ciudad×categoría sin podar (exactamente al revés de lo que toca), y ese
// archivo sobrescribía el bueno en public/ y dist/. Pasó dos veces el 11 sep
// 2026 durante una caída de PostgREST y hubo que revertirlo a mano las dos.
// Abortar deja intacto el sitemap anterior, que siempre es mejor que uno vacío.
function abortarPorSupabase(que, detalle) {
  console.error(`❌ update-sitemap: no se pudo leer ${que} de Supabase (${detalle}).`);
  console.error('   Se aborta el build SIN tocar sitemap.xml: un sitemap vacío es peor que uno desactualizado.');
  console.error('   Comprueba el estado del proyecto y repite el build cuando responda.');
  process.exit(1);
}

async function fetchProfiles(supabaseUrl, anonKey) {
  const url = `${supabaseUrl}/rest/v1/profiles?select=user_id,display_name,zone,city_ref,updated_at,created_at,role,roles,is_primary,photo_url&role=not.in.%28empresario,pending%29&is_seed=eq.false&or=(is_public.is.null,is_public.eq.true)&order=updated_at.desc&limit=1000`;
  let res;
  try {
    res = await fetch(url, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    abortarPorSupabase('profiles', e.message);
  }
  if (!res.ok) abortarPorSupabase('profiles', `HTTP ${res.status}`);
  const rows = await res.json();
  const visibles = rows.filter(p => !!p.photo_url);
  // Responder 200 con una lista vacía también es anómalo: hay 40+ perfiles
  // reales publicados. Si algún día no quedara ninguno de verdad, este guard
  // salta y se quita a mano, que es justo la revisión que uno querría.
  if (visibles.length === 0) abortarPorSupabase('profiles', '0 perfiles visibles, algo va mal');
  return visibles;
}

function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── URL helpers ──────────────────────────────────────────────────────────
function url(loc, lastmod, changefreq, priority) {
  return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

// ─── Blog posts ───────────────────────────────────────────────────────────
// Fuente: BLOG_POSTS en src/data/blogPosts.ts. El path del componente de cada
// post se resuelve desde las <Route path="/blog/..."> de App.tsx para poder
// usar su fecha real de último commit (mismo criterio que el resto del sitemap).
function buildBlogPostEntries() {
  const dataSrc = fs.readFileSync(path.join(ROOT, 'src', 'data', 'blogPosts.ts'), 'utf8');
  const slugs = [...dataSrc.matchAll(/slug:\s*'(\/blog\/[^']+)'/g)].map(m => m[1]);

  const appSrc = fs.readFileSync(path.join(ROOT, 'src', 'App.tsx'), 'utf8');
  const importMap = {};
  for (const m of appSrc.matchAll(/const (\w+) = lazy\(\(\) => import\("\.\/pages\/(\w+)"\)\);/g)) {
    importMap[m[1]] = m[2];
  }
  const routeToComponent = {};
  for (const m of appSrc.matchAll(/<Route path="(\/blog\/[^"]+)" element=\{<(\w+)/g)) {
    routeToComponent[m[1]] = m[2];
  }

  const entries = [];
  for (const slug of slugs) {
    const component = routeToComponent[slug];
    if (!component) {
      console.warn(`⚠️  update-sitemap: ${slug} está en BLOG_POSTS pero no tiene <Route> en App.tsx: se omite.`);
      continue;
    }
    const file = importMap[component];
    const lastmod = file ? lastCommitDate(`src/pages/${file}.tsx`) : TODAY;
    entries.push([`https://xpeak.es${slug}`, lastmod, '0.75']);
  }
  return entries;
}

// ─── Static URL list ──────────────────────────────────────────────────────
function staticUrls(today, indexableCities, cityContentDates) {
  const lines = [];
  const categoryLandingDate = lastCommitDate('src/pages/CategoryLanding.tsx');
  const cityLandingDate = lastCommitDate('src/pages/CityLanding.tsx');
  const directorioDate = lastCommitDate('src/pages/DirectorioPublico.tsx');
  const landingDate = lastCommitDate('src/pages/Landing.tsx');
  const sobreNosotrosDate = lastCommitDate('src/pages/SobreNosotros.tsx');
  const autorDanielDate = lastCommitDate('src/pages/AutorDaniel.tsx');
  const soporteDate = lastCommitDate('src/pages/Soporte.tsx');

  // Core
  lines.push('  <!-- Core -->');
  lines.push(url('https://xpeak.es/', landingDate, 'weekly', '1.0'));
  lines.push(url('https://xpeak.es/sobre-nosotros', sobreNosotrosDate, 'monthly', '0.6'));
  lines.push(url('https://xpeak.es/autor/daniel', autorDanielDate, 'monthly', '0.4'));
  lines.push(url('https://xpeak.es/soporte', soporteDate, 'monthly', '0.5'));

  // Category landings
  lines.push('\n  <!-- Category landings -->');
  const cats = ['dj','staff','azafata','fotografo','camareros','catering','maquillaje','peluqueria','promotores','vestuario','disco-movil','mago','humorista','animador','animadores','speaker','bailarin','payaso','payasos','grupo-musical','photo-booth','monologo','tecnico-sonido','locales-eventos'];
  const catPri = { dj: '0.9', staff: '0.9', azafata: '0.9', camareros: '0.9', catering: '0.9', fotografo: '0.8', maquillaje: '0.8', peluqueria: '0.8', promotores: '0.8', 'disco-movil': '0.8', vestuario: '0.7', mago: '0.8', humorista: '0.8', animador: '0.8', animadores: '0.8', speaker: '0.7', bailarin: '0.7', payaso: '0.7', payasos: '0.7', 'grupo-musical': '0.75', 'photo-booth': '0.75', monologo: '0.75', 'tecnico-sonido': '0.8', 'locales-eventos': '0.8' };
  for (const c of cats) {
    lines.push(url(`https://xpeak.es/contratar-${c}`, categoryLandingDate, 'weekly', catPri[c] || '0.8'));
  }

  // Directorio público — páginas core de producto
  lines.push('\n  <!-- Directorio público -->');
  const dirSlugs = ['dj','fotografo','staff','azafata','camareros','maquillaje','promotores','catering','grupo-musical','animador','mago','humorista','bailarin','speaker','vestuario','photo-booth','wedding-planner','diseno-grafico','tecnico-sonido','djs-emergentes','locales-eventos'];
  for (const s of dirSlugs) {
    lines.push(url(`https://xpeak.es/directorio/${s}`, directorioDate, 'daily', '0.9'));
  }

  lines.push(url('https://xpeak.es/socials', directorioDate, 'daily', '0.8'));

  // City landings — todas las capitales de provincia + grandes ciudades de España
  // IMPORTANTE: cada slug debe existir en CITIES de src/pages/CityLanding.tsx
  // (si no existe, la URL redirige a home = soft-404 para Google)
  const cities = [
    // Tier 1 — máximo tráfico
    'madrid','barcelona','valencia','sevilla','bilbao','malaga','ibiza','palma',
    // Tier 2 — capitales grandes
    'zaragoza','murcia','alicante','granada','cordoba','sansebastian','santander',
    'valladolid','santiago','pamplona','vitoria','logrono',
    // Galicia
    'vigo','coruna','ourense','lugo','pontevedra',
    // Asturias y Cantabria
    'oviedo','gijon',
    // Canarias
    'tenerife','laspalmas','lanzarote','fuerteventura','lapalma','costaadeje',
    // Extremadura
    'badajoz','caceres',
    // Castilla y León
    'salamanca','burgos','leon','segovia','avila','soria',
    // Castilla-La Mancha
    'toledo','albacete','cuenca','guadalajara','talavera',
    // Andalucía resto
    'huelva','jaen','almeria','cadiz','jerez','marbella','estepona','fuengirola','torremolinos','benalmadena',
    // Aragón resto
    'huesca','teruel',
    // Cataluña resto
    'tarragona','lleida','girona','reus','sitges','badalona','hospitalet','terrassa','sabadell','mataro','manresa','cornella','vilanova','elmasnou',
    // C. Valenciana resto
    'castellon','torrevieja','benidorm','gandia','denia','elche','elda','orihuela','calpe','javea',
    // Murcia resto
    'cartagena',
    // Baleares
    'menorca','formentera',
    // Área metropolitana de Madrid
    'alcorcon','mostoles','fuenlabrada','leganes','getafe','pozuelo','majadahonda','valdemoro',
  ];
  const cityPri = {
    madrid:'0.90', barcelona:'0.90', ibiza:'0.88', palma:'0.85', valencia:'0.85',
    sevilla:'0.85', malaga:'0.83', bilbao:'0.82', zaragoza:'0.80', alicante:'0.80',
    granada:'0.78', cordoba:'0.78', 'san-sebastian':'0.78', murcia:'0.77', tenerife:'0.77',
    'las-palmas':'0.77', vigo:'0.75', 'a-coruna':'0.75', oviedo:'0.73', santander:'0.73',
    valladolid:'0.73', 'santiago-de-compostela':'0.73', pamplona:'0.72', vitoria:'0.72',
    logrono:'0.70', badajoz:'0.70', salamanca:'0.70', burgos:'0.70', leon:'0.70',
    toledo:'0.70', albacete:'0.70', caceres:'0.68', huelva:'0.68',
    jaen:'0.68', almeria:'0.68', cadiz:'0.70', 'jerez-de-la-frontera':'0.68',
    marbella:'0.72', cartagena:'0.68', tarragona:'0.68', girona:'0.68', lleida:'0.67',
    gijon:'0.70', 'ciudad-real':'0.68', cuenca:'0.65', guadalajara:'0.65',
    segovia:'0.68', avila:'0.65', zamora:'0.65', palencia:'0.65', soria:'0.63',
    ourense:'0.65', lugo:'0.65', pontevedra:'0.68', huesca:'0.65', teruel:'0.63',
    lanzarote:'0.70', fuerteventura:'0.70',
    torrevieja:'0.65', benidorm:'0.70', gandia:'0.65', denia:'0.65', castellon:'0.68',
    reus:'0.65', sitges:'0.67', menorca:'0.68', ceuta:'0.63', melilla:'0.63',
  };
  const catsByCity = ['dj','camareros','fotografo','catering','maquillaje','peluqueria','staff','azafata','disco-movil','promotores','vestuario','mago','humorista','animador','animadores','bailarin','speaker','monologo','monologos','payaso','payasos','grupo-musical','photo-booth','tecnico-sonido','locales-eventos'];

  // Solo se publican las ciudades con al menos un profesional real. Una página
  // que dice "Aún no hay" es thin content: enseña a Google que el dominio
  // publica páginas vacías y arrastra a las que sí tienen inventario.
  // Las excluidas siguen siendo accesibles, pero salen del sitemap y
  // CityLanding.tsx las marca noindex. En cuanto una ciudad gana su primer
  // profesional vuelve a entrar sola en el siguiente build.
  let skippedCities = 0;
  for (const cat of catsByCity) {
    lines.push(`\n  <!-- ${cat} por ciudad -->`);
    for (const city of cities) {
      if (!indexableCities.has(`${cat}/${city}`)) { skippedCities++; continue; }
      const pri = parseFloat(cityPri[city] || '0.7');
      const adjusted = (Math.min(pri, 0.85)).toFixed(2);
      // lastmod del contenido (perfiles mostrados), no de la plantilla: si se
      // usa la fecha del componente, miles de páginas cambian de fecha a la vez
      // sin que su contenido cambie y Google deja de fiarse de la señal.
      const lm = cityContentDates.get(`${cat}/${city}`) || cityLandingDate;
      lines.push(url(`https://xpeak.es/contratar-${cat}/${city}`, lm, 'weekly', adjusted));
    }
  }
  console.log(`   combinaciones indexables: ${indexableCities.size} · ${skippedCities} URLs ciudad×categoría omitidas por falta de inventario`);

  // Occasion landings — eje ocasión × rol (GEO/AEO). Fuente: ROLES_POR_OCASION
  // en src/pages/OccasionLanding.tsx (misma fuente que registra las rutas).
  try {
    const occSrc = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'OccasionLanding.tsx'), 'utf8');
    const marker = 'export const ROLES_POR_OCASION';
    const mi = occSrc.indexOf(marker);
    if (mi !== -1) {
      const bs = occSrc.indexOf('{', occSrc.indexOf('=', mi));
      let d = 0, end = -1;
      for (let i = bs; i < occSrc.length; i++) { if (occSrc[i] === '{') d++; else if (occSrc[i] === '}') { d--; if (d === 0) { end = i; break; } } }
      // eslint-disable-next-line no-eval
      const occRoles = eval(`(${occSrc.slice(bs, end + 1)})`);
      const occasionDate = lastCommitDate('src/pages/OccasionLanding.tsx');
      lines.push('\n  <!-- Occasion × rol landings (GEO/AEO) -->');
      for (const [occSlug, roleSlugs] of Object.entries(occRoles)) {
        for (const roleSlug of roleSlugs) {
          lines.push(url(`https://xpeak.es/${occSlug}/contratar-${roleSlug}`, occasionDate, 'weekly', '0.85'));
        }
      }
    }
  } catch (e) {
    console.warn('  ⚠ No se pudieron añadir rutas de ocasión al sitemap:', e.message);
  }

  // Special landings
  lines.push('\n  <!-- Special landings -->');
  lines.push(url('https://xpeak.es/bodas', lastCommitDate('src/pages/BodasLanding.tsx'), 'weekly', '0.90'));
  lines.push(url('https://xpeak.es/presupuesto-boda', lastCommitDate('src/pages/PresupuestoBoda.tsx'), 'monthly', '0.85'));
  lines.push(url('https://xpeak.es/checklist-evento-empresa', lastCommitDate('src/pages/ChecklistEventoEmpresa.tsx'), 'monthly', '0.82'));
  lines.push(url('https://xpeak.es/organizar-eventos', lastCommitDate('src/pages/OrganizadoresLanding.tsx'), 'weekly', '0.90'));
  lines.push(url('https://xpeak.es/precios', lastCommitDate('src/pages/Precios.tsx'), 'monthly', '0.7'));

  // Blog index
  lines.push('\n  <!-- Blog -->');
  lines.push(url('https://xpeak.es/blog', lastCommitDate('src/pages/BlogIndex.tsx'), 'weekly', '0.7'));

  // Blog posts — leídos de BLOG_POSTS (src/data/blogPosts.ts) en vez de una
  // lista a mano: la lista hardcodeada se desincronizó silenciosamente y 72
  // artículos ya publicados llevaban meses sin salir en el sitemap (13 sep
  // 2026). El path del componente real de cada post se resuelve desde las
  // <Route> de App.tsx para poder usar su fecha de último commit.
  const posts = buildBlogPostEntries();
  for (const [loc, lastmod, pri] of posts) {
    lines.push(url(loc, lastmod, 'monthly', pri));
  }


  // Nota: /privacidad, /terminos, /aviso-legal y /cookies se excluyen a propósito.
  // Esas páginas llevan <meta name="robots" content="noindex"> en el código (son legales,
  // no deben indexarse) — incluirlas aquí genera un conflicto que Search Console marca como error.

  return lines.join('\n');
}

// ─── Demo profile slugs (always included) ────────────────────────────────
const DEMO_SLUGS = [
  'luna-deep','mc-rafaga','sara-beats','carla-vega','marcos-rios',
  'patricia-sanz','nadia-glamour','ivan-stylez','alicia-moon','diego-noir',
  'carlos-flash','marta-lens','zoe-viral','alex-neon','paula-motion',
  'ruben-vj','laura-promo','javi-street',
];

// ─── Fetch upcoming dance socials from Supabase ───────────────────────────
async function fetchSocialEvents(supabaseUrl, anonKey) {
  const today = new Date().toISOString().slice(0, 10);
  const url = `${supabaseUrl}/rest/v1/dance_socials?select=id,event_name,event_date,created_at&event_date=gte.${today}&order=event_date.asc&limit=500`;
  let res;
  try {
    res = await fetch(url, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
  } catch (e) {
    abortarPorSupabase('dance_socials', e.message);
  }
  if (!res.ok) abortarPorSupabase('dance_socials', `HTTP ${res.status}`);
  // A diferencia de profiles, 0 eventos SÍ es un estado legítimo (no siempre
  // hay socials futuras publicadas), así que aquí no se comprueba la longitud.
  return res.json();
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  const env = loadEnv();
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const anonKey = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

  console.log('📍 Fetching public profiles from Supabase...');
  const profiles = await fetchProfiles(supabaseUrl, anonKey);
  console.log(`✅ Found ${profiles.length} real profiles`);

  // Ciudades indexables — se derivan del inventario real, no de una lista fija.
  const CITIES = extractObjectLiteral(path.join(ROOT, 'src', 'pages', 'CityLanding.tsx'), 'CITIES');
  // Aquí `profiles` siempre trae filas reales: fetchProfiles aborta el build si
  // Supabase falla o devuelve 0. El inventario se mide con el MISMO criterio
  // que usa la página. Desde que CityLanding.tsx dejó de filtrar por is_primary
  // (marcaba el perfil principal de una agencia, no "perfil publicable"),
  // cuenta cualquier perfil real.
  const inventoryProfiles = profiles;
  // Set de claves "categoria/ciudad" con inventario real.
  const CATS_BY_CITY = ['dj','camareros','fotografo','catering','maquillaje','peluqueria','staff','azafata','disco-movil','promotores','vestuario','mago','humorista','animador','animadores','bailarin','speaker','monologo','monologos','payaso','payasos','grupo-musical','photo-booth'];
  const indexableCities = new Set();
  const cityContentDates = new Map();
  // Universo de ciudades = las de CITIES (que aportan copy editorial: venues,
  // precios, estacionalidad) MAS las city_ref reales de los perfiles. Antes
  // solo se recorria CITIES, asi que un profesional de una ciudad ausente de
  // esa lista no generaba pagina por mucho inventario que hubiera: el 2 sep
  // 2026 una profesional de Benidorm no tenia ninguna URL. city_ref la
  // calcula la BD (city_ref_from_zone), asi que un pueblo pequeño cuenta como
  // inventario de su ciudad grande de referencia.
  const cityUniverse = new Map();
  for (const [citySlug, info] of Object.entries(CITIES)) {
    if (info?.ciudad) cityUniverse.set(citySlug, info.ciudad);
  }
  for (const p of inventoryProfiles) {
    const ref = p.city_ref;
    if (!ref) continue;
    const slug = toSlug(ref);
    if (!cityUniverse.has(slug)) cityUniverse.set(slug, ref);
  }

  for (const [citySlug, cityName] of cityUniverse) {
    for (const cat of CATS_BY_CITY) {
      if (hasInventory(inventoryProfiles, cityName, cat)) {
        indexableCities.add(`${cat}/${citySlug}`);
        const d = contentDate(inventoryProfiles, cityName, cat);
        if (d) cityContentDates.set(`${cat}/${citySlug}`, d);
      }
    }
  }

  console.log('📍 Fetching upcoming dance socials from Supabase...');
  const socialEvents = await fetchSocialEvents(supabaseUrl, anonKey);
  console.log(`✅ Found ${socialEvents.length} upcoming events`);

  const profileLines = ['\n  <!-- Perfiles reales -->'];
  const usedSlugs = new Set();
  for (const p of profiles) {
    if (!p.user_id) continue;
    if (p.user_id.startsWith('11111111-')) continue;
    const lastmod = p.updated_at ? p.updated_at.slice(0, 10) : TODAY;
    let slug = p.display_name ? toSlug(p.display_name) : null;
    if (slug && usedSlugs.has(slug) && p.zone) slug = `${slug}-${toSlug(p.zone)}`;
    // Sin nombre no hay slug, y el fallback al UUID metía en el sitemap URLs
    // que el prerender no genera: Google recibía un 404 servido con el HTML de
    // la portada (soft-404), que es peor que no listar la URL. Medido el 3 sep
    // 2026: 2 de las 388 URLs del sitemap estaban así. Un perfil sin nombre
    // tampoco tiene ficha que enseñar, así que se omite hasta que lo rellene.
    if (!slug || usedSlugs.has(slug)) continue;
    usedSlugs.add(slug);
    profileLines.push(url(`https://xpeak.es/p/${slug}`, lastmod, 'weekly', '0.65'));
  }

  const eventLines = ['\n  <!-- Eventos reales (dance_socials) -->'];
  for (const e of socialEvents) {
    if (!e.id || !e.event_name) continue;
    const lastmod = e.created_at ? e.created_at.slice(0, 10) : TODAY;
    const slug = `${toSlug(e.event_name)}-${e.id.slice(0, 8)}`;
    eventLines.push(url(`https://xpeak.es/socials/${slug}`, lastmod, 'weekly', '0.6'));
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${staticUrls(TODAY, indexableCities, cityContentDates)}
${profileLines.join('\n')}
${eventLines.join('\n')}

</urlset>`;

  fs.writeFileSync(OUT, sitemap, 'utf-8');
  if (fs.existsSync(path.dirname(OUT_DIST))) fs.writeFileSync(OUT_DIST, sitemap, 'utf-8');
  const lineCount = sitemap.split('\n').length;
  console.log(`✅ sitemap.xml written: ${lineCount} lines, ${profiles.length} real profiles, ${socialEvents.length} events`);
}

main().catch(e => {
  console.error('❌ update-sitemap failed:', e.message);
  process.exit(1);
});
