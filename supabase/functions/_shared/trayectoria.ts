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
const clave = async () => {
  const base = (globalThis as any).Deno?.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!base) throw new Error('Sin clave para firmar');
  const raiz = await crypto.subtle.importKey('raw', enc.encode(base), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const derivada = await crypto.subtle.sign('HMAC', raiz, enc.encode('xpeak-trayectoria-v1'));
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

export type DecisionSolicitud = 'ok' | 'cobros_apagados' | 'no_premium' | 'correo_invalido' | 'correo_propio' | 'limite_correo';

export function decidirSolicitud(ctx: {
  cobrosActivos: boolean;
  tier: string | null;
  correoOrganizador: string;
  correosPropios: string[];
  confirmadosEsteMes: number;
}): DecisionSolicitud {
  if (!ctx.cobrosActivos) return 'cobros_apagados';
  if (!ctx.tier || !TIERS_PREMIUM.includes(ctx.tier)) return 'no_premium';
  if (!CORREO.test(ctx.correoOrganizador.trim())) return 'correo_invalido';
  if (esCorreoPropio(ctx.correoOrganizador, ctx.correosPropios)) return 'correo_propio';
  if (!puedeConfirmarMas(ctx.confirmadosEsteMes)) return 'limite_correo';
  return 'ok';
}

// Hash del correo normalizado: se guarda esto, nunca el correo.
export async function hashEmail(e: string): Promise<string> {
  const h = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(normalizarEmail(e))));
  return Array.from(h, b => b.toString(16).padStart(2, '0')).join('');
}
