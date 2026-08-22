/**
 * Sitemap generator — runs at build time after vite build.
 * Merges static URLs + dynamic public profiles from Supabase.
 * Output: public/sitemap.xml
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'sitemap.xml');
const OUT_DIST = path.join(ROOT, 'dist', 'sitemap.xml');
const TODAY = new Date().toISOString().slice(0, 10);

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
async function fetchProfiles(supabaseUrl, anonKey) {
  const url = `${supabaseUrl}/rest/v1/profiles?select=user_id,display_name,zone,updated_at,role&role=neq.empresario&order=updated_at.desc&limit=1000`;
  const res = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    console.warn('⚠️  Could not fetch profiles from Supabase:', res.status);
    return [];
  }
  return res.json();
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

// ─── Static URL list ──────────────────────────────────────────────────────
function staticUrls(today) {
  const lines = [];

  // Core
  lines.push('  <!-- Core -->');
  lines.push(url('https://xpeak.es/', today, 'weekly', '1.0'));
  lines.push(url('https://xpeak.es/sobre-nosotros', today, 'monthly', '0.6'));

  // Category landings
  lines.push('\n  <!-- Category landings -->');
  const cats = ['dj','staff','fotografo','camareros','catering','maquillaje','peluqueria','promotores','vestuario','disco-movil','mago','humorista','animador','speaker','bailarin','payaso'];
  const catPri = { dj: '0.9', staff: '0.9', camareros: '0.9', catering: '0.9', fotografo: '0.8', maquillaje: '0.8', peluqueria: '0.8', promotores: '0.8', 'disco-movil': '0.8', vestuario: '0.7', mago: '0.8', humorista: '0.8', animador: '0.8', speaker: '0.7', bailarin: '0.7', payaso: '0.7' };
  for (const c of cats) {
    lines.push(url(`https://xpeak.es/contratar-${c}`, today, 'weekly', catPri[c] || '0.8'));
  }

  // Directorio público — páginas core de producto
  lines.push('\n  <!-- Directorio público -->');
  const dirSlugs = ['dj','fotografo','staff','camareros','maquillaje','peluqueria','promotores','catering','grupo-musical','animador','mago','humorista','bailarin','speaker','vestuario','photo-booth'];
  for (const s of dirSlugs) {
    lines.push(url(`https://xpeak.es/directorio/${s}`, today, 'daily', '0.9'));
  }

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
    toledo:'0.70', albacete:'0.70', caceres:'0.68', merida:'0.68', huelva:'0.68',
    jaen:'0.68', almeria:'0.68', cadiz:'0.70', 'jerez-de-la-frontera':'0.68',
    marbella:'0.72', cartagena:'0.68', tarragona:'0.68', girona:'0.68', lleida:'0.67',
    gijon:'0.70', 'ciudad-real':'0.68', cuenca:'0.65', guadalajara:'0.65',
    segovia:'0.68', avila:'0.65', zamora:'0.65', palencia:'0.65', soria:'0.63',
    ourense:'0.65', lugo:'0.65', pontevedra:'0.68', huesca:'0.65', teruel:'0.63',
    lanzarote:'0.70', fuerteventura:'0.70',
    torrevieja:'0.65', benidorm:'0.70', gandia:'0.65', denia:'0.65', castellon:'0.68',
    reus:'0.65', sitges:'0.67', menorca:'0.68', ceuta:'0.63', melilla:'0.63',
  };
  const catsByCity = ['dj','camareros','fotografo','catering','maquillaje','peluqueria','staff','disco-movil','promotores','vestuario','mago','humorista','animador','bailarin','speaker','monologo','payaso'];

  for (const cat of catsByCity) {
    lines.push(`\n  <!-- ${cat} por ciudad -->`);
    for (const city of cities) {
      const pri = parseFloat(cityPri[city] || '0.7');
      const adjusted = (Math.min(pri, 0.85)).toFixed(2);
      lines.push(url(`https://xpeak.es/contratar-${cat}/${city}`, today, 'weekly', adjusted));
    }
  }

  // Special landings
  lines.push('\n  <!-- Special landings -->');
  lines.push(url('https://xpeak.es/bodas', today, 'weekly', '0.90'));
  lines.push(url('https://xpeak.es/presupuesto-boda', today, 'monthly', '0.85'));
  lines.push(url('https://xpeak.es/precios', today, 'monthly', '0.7'));

  // Blog index
  lines.push('\n  <!-- Blog -->');
  lines.push(url('https://xpeak.es/blog', today, 'weekly', '0.7'));

  // Blog posts (dates reflect actual publish dates)
  const posts = [
    ['https://xpeak.es/blog/fotografo-boda-granada', '2026-06-08', '0.80'],
    ['https://xpeak.es/blog/fotografo-boda-alicante', '2026-06-08', '0.80'],
    ['https://xpeak.es/blog/fotografo-boda-zaragoza', '2026-06-08', '0.80'],
    ['https://xpeak.es/blog/fotografo-boda-tenerife', '2026-06-08', '0.80'],
    ['https://xpeak.es/blog/fotografo-boda-murcia', '2026-06-08', '0.78'],
    ['https://xpeak.es/blog/fotografo-boda-cordoba', '2026-06-08', '0.78'],
    ['https://xpeak.es/blog/grupo-musical-para-boda-precio', '2026-06-08', '0.82'],
    ['https://xpeak.es/blog/dj-techno-madrid', '2026-06-08', '0.80'],
    ['https://xpeak.es/blog/fotografo-comunion-barcelona', '2026-06-08', '0.78'],
    ['https://xpeak.es/blog/catering-boda-precio-por-persona', '2026-06-08', '0.82'],
    ['https://xpeak.es/blog/como-organizar-fiesta-de-empresa', '2026-06-08', '0.80'],
    ['https://xpeak.es/blog/checklist-organizar-evento-sala', '2026-06-10', '0.85'],
    ['https://xpeak.es/blog/antelacion-reservar-proveedores-boda', '2026-06-10', '0.85'],
    ['https://xpeak.es/blog/como-funciona-flash-booking-xpeak', '2026-06-10', '0.88'],
    ['https://xpeak.es/blog/personal-extra-hosteleria-temporada', '2026-06-10', '0.85'],
    ['https://xpeak.es/blog/disco-movil-verbenas-fiestas-pueblo', '2026-06-10', '0.84'],
    ['https://xpeak.es/blog/fiesta-privada-villa-ibiza', '2026-06-10', '0.86'],
    ['https://xpeak.es/blog/fotografo-boda', '2026-06-08', '0.78'],
    ['https://xpeak.es/blog/fotografo-boda-bilbao', '2026-06-03', '0.78'],
    ['https://xpeak.es/blog/fotografo-boda-malaga', '2026-06-03', '0.78'],
    ['https://xpeak.es/blog/fotografo-boda-mallorca', '2026-06-03', '0.80'],
    ['https://xpeak.es/blog/10-errores-contratar-dj-boda', '2026-05-18', '0.80'],
    ['https://xpeak.es/blog/musica-en-vivo-para-bodas', '2026-05-16', '0.80'],
    ['https://xpeak.es/blog/maestro-de-ceremonias-boda-precio-guia', '2026-05-16', '0.80'],
    ['https://xpeak.es/blog/wedding-planner-precio-espana', '2026-05-07', '0.75'],
    ['https://xpeak.es/blog/como-contratar-personal-para-un-evento', '2026-05-07', '0.75'],
    ['https://xpeak.es/blog/dj-residente-discoteca-precio', '2026-05-07', '0.75'],
    ['https://xpeak.es/blog/catering-comuniones-precio-persona', '2026-05-07', '0.75'],
    ['https://xpeak.es/blog/dj-boda-civil-precio-canciones', '2026-05-04', '0.75'],
    ['https://xpeak.es/blog/catering-boda-precio-por-persona', '2026-05-04', '0.75'],
    ['https://xpeak.es/blog/videografo-bodas-precio', '2026-05-04', '0.75'],
    ['https://xpeak.es/blog/tendencias-bodas-2026', '2026-05-04', '0.70'],
    ['https://xpeak.es/blog/animadores-infantiles-comuniones-cumpleanos', '2026-05-04', '0.70'],
    ['https://xpeak.es/blog/como-organizar-fiesta-empresa', '2026-05-04', '0.75'],
    ['https://xpeak.es/blog/precio-azafatas-eventos-espana', '2026-05-04', '0.70'],
    ['https://xpeak.es/blog/contratar-barman-evento-privado', '2026-05-04', '0.70'],
    ['https://xpeak.es/blog/contratar-fotografo-de-bodas', '2026-05-03', '0.75'],
    ['https://xpeak.es/blog/staff-de-discoteca-funciones-y-salario', '2026-05-03', '0.70'],
    ['https://xpeak.es/blog/catering-para-eventos-de-empresa', '2026-05-03', '0.70'],
    ['https://xpeak.es/blog/disco-movil-para-comuniones', '2026-05-03', '0.70'],
    ['https://xpeak.es/blog/promotores-de-eventos-que-hacen', '2026-05-03', '0.70'],
    ['https://xpeak.es/blog/maquillaje-nupcial-precio-guia', '2026-05-03', '0.70'],
    ['https://xpeak.es/blog/dj-para-cumpleanos-precio', '2026-05-03', '0.75'],
    ['https://xpeak.es/blog/como-organizar-evento-corporativo', '2026-05-03', '0.75'],
    ['https://xpeak.es/blog/musica-para-bodas-guia', '2026-05-03', '0.75'],
    ['https://xpeak.es/blog/fotografia-eventos-nocturnos', '2026-05-03', '0.70'],
    ['https://xpeak.es/blog/cuanto-cuesta-una-boda-en-espana', '2026-05-02', '0.75'],
    ['https://xpeak.es/blog/dj-para-bodas-vs-discoteca', '2026-04-29', '0.75'],
    ['https://xpeak.es/blog/cuantos-camareros-necesito-para-mi-boda', '2026-04-29', '0.80'],
    ['https://xpeak.es/blog/cuanto-cobra-un-camarero-de-eventos', '2026-04-29', '0.75'],
    ['https://xpeak.es/blog/cuanto-cobra-un-dj-en-espana', '2026-04-28', '0.75'],
  ];
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

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  const env = loadEnv();
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const anonKey = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

  console.log('📍 Fetching public profiles from Supabase...');
  const profiles = await fetchProfiles(supabaseUrl, anonKey);
  console.log(`✅ Found ${profiles.length} real profiles`);

  const profileLines = ['\n  <!-- Perfiles reales -->'];
  const usedSlugs = new Set();
  for (const p of profiles) {
    if (!p.user_id) continue;
    if (p.user_id.startsWith('11111111-')) continue;
    const lastmod = p.updated_at ? p.updated_at.slice(0, 10) : TODAY;
    let slug = p.display_name ? toSlug(p.display_name) : null;
    if (slug && usedSlugs.has(slug) && p.zone) slug = `${slug}-${toSlug(p.zone)}`;
    if (!slug || usedSlugs.has(slug)) slug = p.user_id;
    usedSlugs.add(slug);
    profileLines.push(url(`https://xpeak.es/p/${slug}`, lastmod, 'weekly', '0.65'));
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${staticUrls(TODAY)}
${profileLines.join('\n')}

</urlset>`;

  fs.writeFileSync(OUT, sitemap, 'utf-8');
  if (fs.existsSync(path.dirname(OUT_DIST))) fs.writeFileSync(OUT_DIST, sitemap, 'utf-8');
  const lineCount = sitemap.split('\n').length;
  console.log(`✅ sitemap.xml written — ${lineCount} lines, ${profiles.length} real profiles`);
}

main().catch(e => {
  console.error('❌ update-sitemap failed:', e.message);
  process.exit(1);
});
