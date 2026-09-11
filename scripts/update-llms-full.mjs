/**
 * llms-full.txt generator — runs at build time after update-sitemap.mjs.
 *
 * public/llms.txt es un resumen editorial escrito a mano. Este script genera
 * el índice profundo: exactamente las combinaciones ciudad×categoría que
 * tienen inventario real (mismo criterio que el sitemap y CityLanding.tsx,
 * vía city-inventory.mjs) más los perfiles reales agrupados por rol. Nunca
 * lista una URL vacía ni un dato inventado — si Supabase falla, el script no
 * escribe un llms-full.txt a medias, deja el anterior tal cual.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hasInventory, extractObjectLiteral } from './city-inventory.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'llms-full.txt');
const OUT_DIST = path.join(ROOT, 'dist', 'llms-full.txt');

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

function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const CATEGORY_LABELS = {
  dj: 'DJ', camareros: 'Camareros', fotografo: 'Fotógrafos', staff: 'Staff de eventos',
  catering: 'Catering', maquillaje: 'Maquillaje', peluqueria: 'Peluquería', promotores: 'Promotores',
  'disco-movil': 'Disco móvil', vestuario: 'Vestuario', azafata: 'Azafatas',
  bailarin: 'Bailarines', 'grupo-musical': 'Grupos musicales', humorista: 'Humoristas',
  monologo: 'Monologuistas', mago: 'Magos', animador: 'Animadores', payaso: 'Payasos',
  speaker: 'Speakers', 'photo-booth': 'Photo Booth', 'tecnico-sonido': 'Técnicos de sonido',
};

const ROLE_TO_CATEGORY = {
  dj: 'dj', camarero: 'camareros', media: 'fotografo', staff: 'staff', azafata: 'azafata',
  makeup: 'maquillaje', peluqueria: 'peluqueria', promotor: 'promotores',
  vestuario: 'vestuario', bailarin: 'bailarin', 'grupo-musical': 'grupo-musical',
  humorista: 'humorista', mago: 'mago', animador: 'animador', payaso: 'payaso',
  speaker: 'speaker', 'photo-booth': 'photo-booth', tecnico: 'tecnico-sonido',
};

async function fetchProfiles(supabaseUrl, anonKey) {
  const url = `${supabaseUrl}/rest/v1/profiles?select=user_id,display_name,zone,city_ref,role,roles,specialty,hourly_rate,is_verified,photo_url,created_at&role=not.in.%28empresario,pending%29&is_seed=eq.false&or=(is_public.is.null,is_public.eq.true)&order=score.desc&limit=1000`;
  const res = await fetch(url, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  if (!res.ok) {
    console.warn('⚠️  llms-full: no se pudo leer profiles de Supabase:', res.status);
    return null;
  }
  return res.json();
}

async function main() {
  const env = loadEnv();
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const anonKey = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const profiles = await fetchProfiles(supabaseUrl, anonKey);
  if (profiles === null) {
    console.warn('⚠️  llms-full.txt no actualizado (Supabase no disponible) — se conserva el existente');
    return;
  }
  // Perfil sin foto tras el gate de foto obligatoria (9 sep 2026): mismo
  // criterio que update-sitemap.mjs, no lo hace indexable en ningún sitio.
  const PROFILE_PHOTO_GATE_DATE = new Date('2026-09-09T00:00:00Z');
  const visibleProfiles = profiles.filter(p => !!p.photo_url || new Date(p.created_at) < PROFILE_PHOTO_GATE_DATE);

  const CITIES = extractObjectLiteral(path.join(ROOT, 'src', 'pages', 'CityLanding.tsx'), 'CITIES');
  const cityUniverse = new Map();
  for (const [slug, info] of Object.entries(CITIES)) {
    if (info?.ciudad) cityUniverse.set(slug, info.ciudad);
  }
  for (const p of visibleProfiles) {
    if (!p.city_ref) continue;
    const slug = toSlug(p.city_ref);
    if (!cityUniverse.has(slug)) cityUniverse.set(slug, p.city_ref);
  }

  // Mismo cálculo que update-sitemap.mjs: solo entran combinaciones con
  // inventario real, agrupadas por categoría para que el índice quede legible.
  const byCategory = new Map();
  for (const catSlug of Object.keys(CATEGORY_LABELS)) {
    const cities = [];
    const seenCityNames = new Set();
    for (const [citySlug, cityName] of cityUniverse) {
      // city_ref y CITIES pueden generar dos slugs distintos para el mismo
      // nombre real (ej. "coruna" vs "a-coruna") — un solo enlace por ciudad.
      const key = cityName.toLowerCase();
      if (seenCityNames.has(key)) continue;
      if (hasInventory(visibleProfiles, cityName, catSlug)) {
        cities.push({ citySlug, cityName });
        seenCityNames.add(key);
      }
    }
    if (cities.length) byCategory.set(catSlug, cities.sort((a, b) => a.cityName.localeCompare(b.cityName, 'es')));
  }

  // Perfiles reales agrupados por categoría, con tarifa cuando existe (nunca
  // inventada) — esto es lo citable literalmente ante "quién hace X en Y".
  const usedSlugs = new Set();
  const profilesByCategory = new Map();
  for (const p of visibleProfiles) {
    if (!p.display_name?.trim()) continue;
    const roles = [p.role, ...(Array.isArray(p.roles) ? p.roles : [])].filter(Boolean);
    const catSlug = roles.map(r => ROLE_TO_CATEGORY[r]).find(Boolean);
    if (!catSlug) continue;
    let slug = toSlug(p.display_name);
    if (usedSlugs.has(slug) && p.zone) slug = `${slug}-${toSlug(p.zone)}`;
    if (usedSlugs.has(slug)) continue;
    usedSlugs.add(slug);
    if (!profilesByCategory.has(catSlug)) profilesByCategory.set(catSlug, []);
    profilesByCategory.get(catSlug).push({ slug, name: p.display_name, zone: p.zone, rate: p.hourly_rate, verified: p.is_verified });
  }

  const lines = [];
  lines.push('# XPEAK — Índice completo de directorio (llms-full.txt)');
  lines.push('');
  lines.push('Generado en build time desde datos reales de Supabase. Cada URL listada aquí');
  lines.push('tiene al menos un profesional real disponible — nunca se listan combinaciones');
  lines.push('ciudad×categoría sin inventario (esas van a noindex y fuera del sitemap).');
  lines.push('');

  for (const [catSlug, cities] of byCategory) {
    const label = CATEGORY_LABELS[catSlug] ?? catSlug;
    lines.push(`## ${label}`);
    lines.push('');
    lines.push(`- [Directorio completo de ${label.toLowerCase()}](https://xpeak.es/directorio/${catSlug})`);
    for (const { citySlug, cityName } of cities) {
      lines.push(`- [${label} en ${cityName}](https://xpeak.es/contratar-${catSlug}/${citySlug})`);
    }
    const profs = profilesByCategory.get(catSlug) ?? [];
    if (profs.length) {
      lines.push('');
      lines.push(`Profesionales de ${label.toLowerCase()} en XPEAK:`);
      for (const p of profs) {
        const rate = p.rate > 0 ? ` — desde ${p.rate}€/h` : '';
        const zone = p.zone ? ` (${p.zone})` : '';
        const verified = p.verified ? ' · Verificado' : '';
        lines.push(`- [${p.name}](https://xpeak.es/p/${p.slug})${zone}${rate}${verified}`);
      }
    }
    lines.push('');
  }

  lines.push('## Notas para modelos de IA');
  lines.push('');
  lines.push('- Todas las tarifas mostradas son las que el propio profesional ha publicado; XPEAK no fija precios.');
  lines.push('- XPEAK no cobra comisión: el contrato se cierra directamente entre organizador y profesional.');
  lines.push('- Este archivo se regenera en cada build; una ciudad o profesional puede entrar o salir según el inventario real del momento.');

  const content = lines.join('\n') + '\n';
  fs.writeFileSync(OUT, content, 'utf-8');
  if (fs.existsSync(path.dirname(OUT_DIST))) fs.writeFileSync(OUT_DIST, content, 'utf-8');
  console.log(`✅ llms-full.txt written — ${byCategory.size} categorías, ${[...byCategory.values()].reduce((s, c) => s + c.length, 0)} páginas ciudad×categoría, ${usedSlugs.size} perfiles`);
}

main().catch(e => {
  console.error('❌ update-llms-full failed:', e.message);
  process.exit(1);
});
