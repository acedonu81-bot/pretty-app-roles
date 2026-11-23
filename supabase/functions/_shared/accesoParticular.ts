// Enlace de acceso para particulares sin contraseña (31 oct 2026).
// Los enlaces mágicos de Supabase son de un solo uso, caducan y cada uno nuevo
// anula el anterior (Cristina y Patricia nunca entraron: tenían 3 correos con
// enlace y ninguno servía). Aquí el correo lleva un enlace FIRMADO y duradero a
// xpeak.es/acceso; el enlace mágico real se genera al pulsar el botón (POST),
// así que ni caduca antes de tiempo ni lo gastan los antivirus del correo.
const CADUCA_MS = 7 * 24 * 3600_000;
const enc = new TextEncoder();
const b64url = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const deB64url = (s: string) => Uint8Array.from(
  atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0));
// Clave derivada de la de servicio con un propósito propio: una firma de estos
// enlaces no vale para los otros enlaces firmados (confirmar solicitud, baja) y
// al revés. Sin clave de servicio no se firma nada.
const clave = async () => {
  const base = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!base) throw new Error('Sin clave para firmar');
  const raiz = await crypto.subtle.importKey('raw', enc.encode(base), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const derivada = await crypto.subtle.sign('HMAC', raiz, enc.encode('xpeak-acceso-particular-v1'));
  return crypto.subtle.importKey('raw', derivada, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
};

export interface DatosAcceso { u: string; d: string; iat: number }

// Solo rutas del panel, sin escapar de xpeak.es.
const DESTINO = /^\/dashboard(\?[A-Za-z0-9=&%._~!'()*-]*)?$/;
export const destinoValido = (d: string) => DESTINO.test(d);

export async function firmarAcceso(userId: string, destino: string): Promise<string | null> {
  if (!destinoValido(destino)) return null;
  const datos = enc.encode(JSON.stringify({ u: userId, d: destino, iat: Date.now() } satisfies DatosAcceso));
  const firma = new Uint8Array(await crypto.subtle.sign('HMAC', await clave(), datos));
  return `https://xpeak.es/acceso?t=${b64url(datos)}.${b64url(firma)}`;
}

export async function leerAcceso(t: string): Promise<DatosAcceso | null> {
  try {
    const [a, b] = t.split('.');
    if (!a || !b) return null;
    const datos = deB64url(a);
    if (!(await crypto.subtle.verify('HMAC', await clave(), deB64url(b), datos))) return null;
    const d = JSON.parse(new TextDecoder().decode(datos)) as DatosAcceso;
    if (Date.now() - d.iat > CADUCA_MS || !destinoValido(d.d)) return null;
    return d;
  } catch { return null; }
}

// Botones "Me interesa" / "No, gracias" del correo al particular (18 nov 2026,
// ficha XDS 78,7: los profesionales contestan y ningún particular respondía, 2
// de 3 no llegaban a entrar). La firma lleva quién responde (u) y a qué
// profesional (p); la respuesta se elige en xpeak.es/responder con un POST, así
// que un antivirus que abra el enlace no contesta por el cliente. Clave propia:
// una firma de acceso no vale como respuesta ni al revés.
// Mismo plazo que el enlace de acceso: el botón no debe dar más tiempo de
// entrada que el propio correo.
const CADUCA_RESPUESTA_MS = CADUCA_MS;
const claveRespuesta = async () => {
  const base = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!base) throw new Error('Sin clave para firmar');
  const raiz = await crypto.subtle.importKey('raw', enc.encode(base), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const derivada = await crypto.subtle.sign('HMAC', raiz, enc.encode('xpeak-respuesta-particular-v1'));
  return crypto.subtle.importKey('raw', derivada, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export interface DatosRespuesta { u: string; p: string; iat: number }

export async function firmarRespuesta(userId: string, profesionalId: string): Promise<string | null> {
  if (!UUID.test(userId) || !UUID.test(profesionalId)) return null;
  const datos = enc.encode(JSON.stringify({ u: userId, p: profesionalId, iat: Date.now() } satisfies DatosRespuesta));
  const firma = new Uint8Array(await crypto.subtle.sign('HMAC', await claveRespuesta(), datos));
  return `${b64url(datos)}.${b64url(firma)}`;
}

export async function leerRespuesta(t: string): Promise<DatosRespuesta | null> {
  try {
    const [a, b] = t.split('.');
    if (!a || !b) return null;
    const datos = deB64url(a);
    if (!(await crypto.subtle.verify('HMAC', await claveRespuesta(), deB64url(b), datos))) return null;
    const d = JSON.parse(new TextDecoder().decode(datos)) as DatosRespuesta;
    if (Date.now() - d.iat > CADUCA_RESPUESTA_MS || !UUID.test(d.u) || !UUID.test(d.p)) return null;
    return d;
  } catch { return null; }
}
