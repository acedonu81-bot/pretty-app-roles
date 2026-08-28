/**
 * Post-prerender: inyecta AggregateRating real en las páginas /p/{slug}.
 *
 * PublicProfile.tsx sí genera el schema aggregateRating, pero depende de un
 * fetch async a Supabase que el prerender SSR (renderToString) NUNCA ejecuta,
 * así que el HTML servido a Google y a las IAs sale sin estrellas. Esto lo
 * arregla consultando las reviews aprobadas en build time e inyectando el
 * <script type="application/ld+json"> con AggregateRating directamente en el
 * HTML de cada perfil que tenga reseñas.
 *
 * Ejecutar después de prerender-content.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE = 'https://xpeak.es';

function readEnv() {
  const out = {};
  for (const f of ['.env', '.env.production']) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf-8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) out[m[1]] ??= m[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  return out;
}

function toSlug(name) {
  return String(name).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function sbFetch(supabaseUrl, key, query) {
  // Sin timeout, un Supabase lento/inalcanzable cuelga el pipeline de build
  // entero de forma indefinida (visto en la práctica: 15+ min sin avanzar).
  const res = await fetch(`${supabaseUrl}/rest/v1/${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) { console.warn('  ⚠ Supabase', res.status, query.slice(0, 60)); return []; }
  return res.json();
}

async function main() {
  const env = readEnv();
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !key) { console.warn('  ⚠ Sin credenciales Supabase — se omite prerender de reseñas'); return; }

  // Perfiles reales (mismo criterio que sitemap) para mapear user_id → slug
  const profiles = await sbFetch(supabaseUrl, key,
    'profiles?select=user_id,display_name,zone&role=neq.empresario&is_seed=eq.false&limit=1000');
  // Reviews aprobadas
  const reviews = await sbFetch(supabaseUrl, key,
    'reviews?select=reviewed_user_id,rating&approved=eq.true');

  if (!reviews.length) { console.log('  → 0 reseñas aprobadas: nada que inyectar'); return; }

  // Agregar rating por usuario
  const byUser = new Map();
  for (const r of reviews) {
    if (!r.reviewed_user_id || typeof r.rating !== 'number') continue;
    const cur = byUser.get(r.reviewed_user_id) ?? { sum: 0, n: 0 };
    cur.sum += r.rating; cur.n += 1;
    byUser.set(r.reviewed_user_id, cur);
  }

  // Reconstruir el slug igual que el sitemap (display_name, colisión → zone → user_id)
  const usedSlugs = new Set();
  const slugByUser = new Map();
  for (const p of profiles) {
    if (!p.user_id) continue;
    let slug = p.display_name ? toSlug(p.display_name) : null;
    if (slug && usedSlugs.has(slug) && p.zone) slug = `${slug}-${toSlug(p.zone)}`;
    if (!slug || usedSlugs.has(slug)) slug = p.user_id;
    usedSlugs.add(slug);
    slugByUser.set(p.user_id, slug);
  }

  let injected = 0;
  for (const [userId, agg] of byUser) {
    const slug = slugByUser.get(userId);
    if (!slug) continue;
    const htmlFile = path.join(DIST, 'p', slug, 'index.html');
    if (!fs.existsSync(htmlFile)) continue;
    let doc = fs.readFileSync(htmlFile, 'utf-8');
    if (doc.includes('"AggregateRating"')) continue; // ya presente

    const ratingValue = (agg.sum / agg.n).toFixed(1);
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      itemReviewed: { '@type': 'Person', name: slug, url: `${BASE}/p/${slug}` },
      ratingValue,
      reviewCount: agg.n,
      bestRating: '5',
      worstRating: '1',
    };
    const script = `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
    doc = doc.replace('</head>', `${script}\n</head>`);
    fs.writeFileSync(htmlFile, doc);
    injected++;
  }
  console.log(`  → AggregateRating inyectado en ${injected} perfiles con reseñas reales`);
}

main().catch(e => { console.error('❌ prerender-reviews:', e.message); });
