/**
 * Post-build: escribe dist/home-data.json con los datos que la portada pedía
 * a Supabase en CADA visita (reseñas aprobadas, perfiles nuevos por rol,
 * recuentos por rol). Así una visita sin sesión no toca la base: lo sirve la
 * CDN. Si Supabase falla en el build no se escribe nada y la portada cae a las
 * consultas en vivo (Landing.tsx). Se refresca en cada deploy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

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

async function sbFetch(url, key, query) {
  const res = await fetch(`${url}/rest/v1/${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${res.status} ${query}`);
  return res.json();
}

const env = readEnv();
const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const key = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key || !fs.existsSync(DIST)) {
  console.log('  → home-data omitido (sin credenciales o sin dist)');
  process.exit(0);
}

try {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [reviews, recent, roles] = await Promise.all([
    sbFetch(url, key, 'reviews?select=id,reviewer_name,reviewer_role,reviewer_avatar,comment,rating,event_type&approved=eq.true&order=created_at.desc&limit=30'),
    sbFetch(url, key, `profiles?select=role,display_name,created_at&created_at=gte.${encodeURIComponent(since)}`),
    sbFetch(url, key, 'profiles?select=role&role=not.in.(empresario,pending)&limit=100000'),
  ]);
  const freshRoles = {};
  for (const r of recent) {
    if (!r.role || !r.display_name || r.display_name.trim().length < 2) continue;
    if (!freshRoles[r.role] || r.created_at > freshRoles[r.role]) freshRoles[r.role] = r.created_at;
  }
  const roleCounts = {};
  for (const r of roles) if (r.role) roleCounts[r.role] = (roleCounts[r.role] ?? 0) + 1;
  fs.writeFileSync(path.join(DIST, 'home-data.json'), JSON.stringify({ reviews, freshRoles, roleCounts }));
  console.log(`  → home-data.json: ${reviews.length} reseñas, ${Object.keys(freshRoles).length} roles nuevos, ${roles.length} perfiles`);
} catch (e) {
  console.log(`  → home-data omitido (${e.message}); la portada usará consultas en vivo`);
}
