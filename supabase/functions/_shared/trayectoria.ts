// Trayectoria verificada (22 nov 2026). Lógica pura: firma de los enlaces de
// confirmación y antifraude. La usan las funciones trayectoria-* y Vitest.
// Diseño: docs/superpowers/specs/2026-11-22-trayectoria-verificada-design.md

const CADUCA_MS = 30 * 24 * 3600_000;
export const MAX_CONFIRMACIONES_MES = 5;

const enc = new TextEncoder();
const b64url = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const deB64url = (s: string) => Uint8Array.from(
  atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0));

// Clave derivada con propósito propio: una firma de estos enlaces no vale para
// /acceso, /responder ni ningún otro enlace firmado, y al revés.
const clave = async (proposito = 'xpeak-trayectoria-v1') => {
  const base = (globalThis as any).Deno?.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!base) throw new Error('Sin clave para firmar');
  const raiz = await crypto.subtle.importKey('raw', enc.encode(base), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const derivada = await crypto.subtle.sign('HMAC', raiz, enc.encode(proposito));
  return crypto.subtle.importKey('raw', derivada, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
};

export function normalizarEmail(e: string): string {
  const partes = e.trim().toLowerCase().split('@');
  if (partes.length !== 2 || !partes[0] || !partes[1]) return '';
  let dominio = partes[1].replace(/\.+$/, '');
  if (dominio === 'googlemail.com') dominio = 'gmail.com';
  let usuario = partes[0].split('+')[0];
  if (dominio === 'gmail.com') usuario = usuario.replace(/\./g, '');
  return usuario ? `${usuario}@${dominio}` : '';
}

// Todas las direcciones que controla quien pide la confirmación: correo de la
// cuenta, el pendiente de cambio, el de los metadatos y el de cada identidad
// (Google, correo...). Con esto no se confirma con ninguna dirección propia
// que XPEAK conozca; las que XPEAK nunca ha visto no se pueden detectar.
export function correosDelUsuario(u: {
  email?: string | null;
  new_email?: string | null;
  user_metadata?: { email?: unknown } | null;
  identities?: { identity_data?: { email?: unknown } | null }[] | null;
}): string[] {
  const todos = [u.email, u.new_email, u.user_metadata?.email, ...(u.identities ?? []).map(i => i.identity_data?.email)];
  return [...new Set(todos.filter((x): x is string => typeof x === 'string' && x.includes('@')))];
}

export function esCorreoPropio(organizador: string, propios: string[]): boolean {
  const o = normalizarEmail(organizador);
  return !!o && propios.some(p => normalizarEmail(p) === o);
}

export const puedeConfirmarMas = (confirmadosEsteMes: number): boolean => confirmadosEsteMes < MAX_CONFIRMACIONES_MES;

export async function firmarConfirmacion(eventoId: string, confirmacionId: string): Promise<string> {
  const datos = enc.encode(JSON.stringify({ e: eventoId, c: confirmacionId, iat: Date.now() }));
  const firma = new Uint8Array(await crypto.subtle.sign('HMAC', await clave(), datos));
  return `https://xpeak.es/confirmar-evento?t=${b64url(datos)}.${b64url(firma)}`;
}

export async function leerConfirmacion(t: string): Promise<{ e: string; c: string } | null> {
  try {
    const [a, b] = t.split('.');
    if (!a || !b) return null;
    const datos = deB64url(a);
    if (!(await crypto.subtle.verify('HMAC', await clave(), deB64url(b), datos))) return null;
    const d = JSON.parse(new TextDecoder().decode(datos));
    if (typeof d?.e !== 'string' || typeof d?.c !== 'string' || typeof d?.iat !== 'number') return null;
    if (Date.now() - d.iat > CADUCA_MS) return null;
    return { e: d.e, c: d.c };
  } catch { return null; }
}

// Quién puede pedir que un organizador confirme un evento (ventaja Premium).
// El servidor decide con esto aunque la pantalla ya oculte el botón.
const TIERS_PREMIUM = ['business', 'premium', 'agency', 'elite'];
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type DecisionSolicitud = 'ok' | 'cobros_apagados' | 'no_premium' | 'correo_invalido' | 'correo_propio' | 'limite_correo' | 'limite_diario';
export const MAX_SOLICITUDES_DIA = 10;

export function decidirSolicitud(ctx: {
  cobrosActivos: boolean;
  tier: string | null;
  correoOrganizador: string;
  correosPropios: string[];
  /** Solicitudes enviadas este mes a ese correo; null si no se pudo contar (se rechaza). */
  confirmadosEsteMes: number | null;
  /** Solicitudes enviadas hoy por este profesional; null si no se pudo contar (se rechaza). */
  solicitudesHoy?: number | null;
}): DecisionSolicitud {
  if (!ctx.cobrosActivos) return 'cobros_apagados';
  if (!ctx.tier || !TIERS_PREMIUM.includes(ctx.tier)) return 'no_premium';
  if (!CORREO.test(ctx.correoOrganizador.trim())) return 'correo_invalido';
  if (esCorreoPropio(ctx.correoOrganizador, ctx.correosPropios)) return 'correo_propio';
  if (ctx.confirmadosEsteMes === null || !puedeConfirmarMas(ctx.confirmadosEsteMes)) return 'limite_correo';
  if (ctx.solicitudesHoy === null || (ctx.solicitudesHoy ?? 0) >= MAX_SOLICITUDES_DIA) return 'limite_diario';
  return 'ok';
}

// Hash del correo normalizado: se guarda esto, nunca el correo.
export async function hashEmail(e: string): Promise<string> {
  const h = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(normalizarEmail(e))));
  return Array.from(h, b => b.toString(16).padStart(2, '0')).join('');
}

// ── Pregunta "¿se cerró el acuerdo?" (se mide cuántos acuerdos salen de XPEAK) ──

export type Contratacion = { origen: 'flash' | 'solicitud'; origen_id: string; fecha: string; titulo: string; partes: string[] };
export type Pregunta = { origen: 'flash' | 'solicitud'; origen_id: string; user_id: string; titulo: string; fecha: string };

const DIA = 24 * 3600_000;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

// A cada parte de una contratación cuyo evento pasó hace 3 a 60 días y a quien
// aún no se le ha preguntado. Los más antiguos ya no se preguntan.
export function contratacionesParaPreguntar(ahora: Date, contrataciones: Contratacion[], yaPreguntados: Set<string>): Pregunta[] {
  const salida: Pregunta[] = [];
  for (const c of contrataciones) {
    if (!FECHA.test(c.fecha)) continue;
    const t = new Date(`${c.fecha}T00:00:00Z`).getTime();
    if (Number.isNaN(t)) continue;
    const hoy = new Date(`${ahora.toISOString().slice(0, 10)}T00:00:00Z`).getTime();
    const pasados = (hoy - t) / DIA; // días naturales
    if (pasados < 3 || pasados > 60) continue;
    for (const u of new Set(c.partes.filter(Boolean))) {
      if (yaPreguntados.has(`${c.origen}:${c.origen_id}:${u}`)) continue;
      salida.push({ origen: c.origen, origen_id: c.origen_id, user_id: u, titulo: c.titulo, fecha: c.fecha });
    }
  }
  return salida;
}

export const acuerdoCerrado = (respuestas: Array<'si' | 'no' | null>): boolean =>
  respuestas.length >= 2 && respuestas.every(r => r === 'si');

export async function firmarAcuerdo(origen: 'flash' | 'solicitud', origenId: string, userId: string): Promise<string> {
  const datos = enc.encode(JSON.stringify({ o: origen, i: origenId, u: userId, iat: Date.now() }));
  const firma = new Uint8Array(await crypto.subtle.sign('HMAC', await clave('xpeak-acuerdo-v1'), datos));
  return `https://xpeak.es/acuerdo-cerrado?t=${b64url(datos)}.${b64url(firma)}`;
}

export async function leerAcuerdo(t: string): Promise<{ o: 'flash' | 'solicitud'; i: string; u: string } | null> {
  try {
    const [a, b] = t.split('.');
    if (!a || !b) return null;
    const datos = deB64url(a);
    if (!(await crypto.subtle.verify('HMAC', await clave('xpeak-acuerdo-v1'), deB64url(b), datos))) return null;
    const d = JSON.parse(new TextDecoder().decode(datos));
    if ((d?.o !== 'flash' && d?.o !== 'solicitud') || typeof d?.i !== 'string' || typeof d?.u !== 'string' || typeof d?.iat !== 'number') return null;
    if (Date.now() - d.iat > CADUCA_MS) return null;
    return { o: d.o, i: d.i, u: d.u };
  } catch { return null; }
}

// El sello fuerte ("Contrato XPEAK") solo sube si el evento de la trayectoria
// sigue siendo el de la contratación: mismo título, fecha y profesional.
export function eventoCoincide(
  evento: { titulo: string; fecha: string; user_id: string } | null,
  acuerdo: { titulo: string; fecha: string; profesionalId: string | null },
): boolean {
  return !!evento && !!acuerdo.profesionalId && evento.user_id === acuerdo.profesionalId
    && evento.titulo === acuerdo.titulo && evento.fecha === acuerdo.fecha;
}
