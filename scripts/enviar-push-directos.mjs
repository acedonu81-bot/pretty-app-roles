// Push de estreno de los directos (20 nov 2026), como XPEAK, a todos los usuarios con
// notificaciones activadas excepto las cuentas "pending" (sin rol). Entran también los
// perfiles sin foto.
//
//   node scripts/enviar-push-directos.mjs                 -> solo cuenta y lista (no envía)
//   node scripts/enviar-push-directos.mjs --solo <user_id> -> prueba a UNA cuenta (la tuya)
//   node scripts/enviar-push-directos.mjs --enviar         -> envía a todos
//
// Necesita en el entorno SUPABASE_SERVICE_ROLE_KEY (no está en el repo) y VITE_SUPABASE_URL.
import { readFileSync } from 'node:fs';

const env = { ...process.env };
try {
  for (const l of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
    const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^"|"$/g, '');
  }
} catch { /* sin .env */ }

const URL_BASE = env.VITE_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !KEY) { console.error('Falta VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.'); process.exit(1); }

const TITULO = 'Ya puedes hacer directos en XPEAK';
const CUERPO = 'Emite por Twitch y apareces en directo en la portada y en tu ficha. Lo estamos estrenando: puede que aún no esté disponible para ti.';
const DESTINO = '/dashboard';

const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const get = async (ruta) => {
  const r = await fetch(`${URL_BASE}/rest/v1/${ruta}`, { headers: H });
  if (!r.ok) throw new Error(`${ruta} -> ${r.status} ${await r.text()}`);
  return r.json();
};

const solo = process.argv.includes('--solo') ? process.argv[process.argv.indexOf('--solo') + 1] : null;
const enviar = process.argv.includes('--enviar');

const subs = await get('push_subscriptions?select=user_id');
const conPush = [...new Set(subs.map(s => s.user_id))];
const perfiles = await get(`profiles?select=user_id,role&user_id=in.(${conPush.join(',')})`);
const validos = new Set(perfiles.filter(p => p.role && p.role !== 'pending').map(p => p.user_id));
let destinos = conPush.filter(u => validos.has(u));
console.log(`Con push: ${conPush.length} · tras quitar pending: ${destinos.length}`);

if (solo) destinos = destinos.filter(u => u === solo);
if (!solo && !enviar) { console.log('Simulacro: no se ha enviado nada. Usa --solo <user_id> para probar o --enviar para mandar.'); process.exit(0); }
if (destinos.length === 0) { console.error('Ningún destinatario que cumpla las condiciones.'); process.exit(1); }

let ok = 0, sin = 0, fallos = 0;
for (const user_id of destinos) {
  const r = await fetch(`${URL_BASE}/functions/v1/send-push`, {
    method: 'POST', headers: { ...H, 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, title: TITULO, body: CUERPO, url: DESTINO, tag: 'directos-estreno' }),
  });
  const j = await r.json().catch(() => ({}));
  if (r.ok && j.sent > 0) ok++; else if (r.ok) sin++; else { fallos++; console.error(user_id.slice(0, 8), r.status, JSON.stringify(j)); }
}
console.log(`Enviados: ${ok} · sin dispositivo activo: ${sin} · fallos: ${fallos}`);
