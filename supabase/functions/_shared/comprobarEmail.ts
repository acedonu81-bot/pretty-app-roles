// Comprueba antes del alta que el email puede recibir correo: que el dominio
// no esté en la lista de desechables (public.blocked_email_domains) y que
// exista y tenga servidor de correo (MX, o A/AAAA como permite el RFC 5321).
// La confirmación por email está desactivada, así que esto es lo único que
// impide registrarse con "pepe@noexiste.xyz" (14 oct 2026).
//
// Ante cualquier fallo propio (DNS caído, timeout, error de BD) deja pasar:
// es mejor colar un email raro que perder un alta real.

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export type ResultadoEmail = { ok: true } | { ok: false; error: string };

const DOH = 'https://cloudflare-dns.com/dns-query';

// true = tiene registros, false = el dominio no existe o no tiene ninguno,
// 'nulo' = MX "0 ." (RFC 7505: declara que no acepta correo), null = no se pudo saber.
async function tieneRegistro(dominio: string, tipo: 'MX' | 'A' | 'AAAA'): Promise<boolean | 'nulo' | null> {
  try {
    const res = await fetch(`${DOH}?name=${encodeURIComponent(dominio)}&type=${tipo}`, {
      headers: { accept: 'application/dns-json' },
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return null;
    const r = await res.json();
    // Status 3 = NXDOMAIN (el dominio no existe). 0 = respuesta válida.
    if (r.Status === 3) return false;
    if (r.Status !== 0) return null;
    const codigo = { MX: 15, A: 1, AAAA: 28 }[tipo];
    const respuestas = (r.Answer ?? []).filter((a: { type: number }) => a.type === codigo);
    if (tipo === 'MX' && respuestas.length > 0 && respuestas.every((a: { data: string }) => /^\d+\s+\.?$/.test(a.data.trim()))) {
      return 'nulo';
    }
    return respuestas.length > 0;
  } catch {
    return null;
  }
}

export async function comprobarEmail(admin: SupabaseClient, email: string): Promise<ResultadoEmail> {
  const dominio = email.split('@')[1]?.trim().toLowerCase().replace(/\.$/, '');
  if (!dominio) return { ok: false, error: 'Email no válido' };

  const { data: bloqueado, error } = await admin.rpc('email_domain_blocked', { p_email: email });
  if (error) console.warn('[comprobarEmail] lista de desechables no disponible', error.message);
  if (bloqueado === true) {
    return { ok: false, error: 'No se admiten emails temporales. Usa tu correo habitual.' };
  }

  const noRecibe = { ok: false as const, error: `El dominio "${dominio}" no recibe correo. Revisa que el email esté bien escrito.` };
  const mx = await tieneRegistro(dominio, 'MX');
  if (mx === 'nulo') return noRecibe;
  if (mx !== false) return { ok: true };
  // Sin MX: el correo puede ir igualmente al registro A/AAAA del dominio.
  const [a, aaaa] = await Promise.all([tieneRegistro(dominio, 'A'), tieneRegistro(dominio, 'AAAA')]);
  if (a === false && aaaa === false) return noRecibe;
  return { ok: true };
}
