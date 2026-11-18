// Referidos: el enlace de invitación (xpeak.es/auth?mode=register&ref=CODIGO) y el
// descuento por amigos (10 % con uno que paga, 20 % con dos o más).
import { supabase } from '@/integrations/supabase/client';

const CLAVE = 'xpeak_ref';

export const descuentoReferidos = (pagando: number) => (pagando >= 2 ? 20 : pagando === 1 ? 10 : 0);

export const enlaceInvitacion = (codigo: string) => `https://xpeak.es/auth?mode=register&ref=${codigo}`;

// Se guarda al llegar con ?ref=, con la hora: sobrevive a la vuelta de Google.
export function guardarRefPendiente(codigo: string) {
  try { if (codigo.trim()) localStorage.setItem(CLAVE, JSON.stringify({ c: codigo.trim(), t: Date.now() })); } catch { /* sin almacenamiento */ }
}

// Un código del navegador solo vale si se guardó ANTES de crear la cuenta (o justo al
// crearla): así un enlace abierto después por alguien ya registrado no le cambia el
// padrino. Caduca a los 30 días.
const MARGEN_ALTA_MS = 10 * 60 * 1000;
const CADUCA_MS = 30 * 24 * 60 * 60 * 1000;
export function codigoValidoDelNavegador(guardado: string | null, creadaEn: string | undefined, ahora = Date.now()): string | null {
  if (!guardado || !creadaEn) return null;
  try {
    const { c, t } = JSON.parse(guardado) as { c?: string; t?: number };
    if (!c || typeof t !== 'number') return null;
    if (ahora - t > CADUCA_MS) return null;
    if (t > new Date(creadaEn).getTime() + MARGEN_ALTA_MS) return null;
    return c;
  } catch { return null; }
}

// Apunta al padrino una sola vez, con la sesión ya iniciada. El código sale de los
// datos del alta por correo (se escriben al registrarse) o del navegador si se guardó
// antes de crear la cuenta (altas con Google).
export async function registrarPadrinoPendiente(user: { id: string; created_at?: string; user_metadata?: Record<string, unknown> } | null) {
  if (!user) return null;
  const hecho = `${CLAVE}_hecho_${user.id}`;
  let guardado: string | null = null;
  try {
    if (localStorage.getItem(hecho)) return null;
    guardado = localStorage.getItem(CLAVE);
  } catch { /* sin almacenamiento */ }
  const codigo = (typeof user.user_metadata?.ref === 'string' ? user.user_metadata.ref : null)
    || codigoValidoDelNavegador(guardado, user.created_at);
  if (!codigo) { try { localStorage.removeItem(CLAVE); } catch { /* */ } return null; }
  const { data, error } = await (supabase as any).rpc('registrar_padrino', { p_codigo: codigo });
  if (error) return null; // se reintenta en la siguiente carga
  try { localStorage.removeItem(CLAVE); localStorage.setItem(hecho, String(data)); } catch { /* sin almacenamiento */ }
  return data as string;
}

export async function leerMisReferidos(): Promise<{ invitados: number; pagando: number }> {
  const { data, error } = await (supabase as any).rpc('mis_referidos');
  if (error || !data?.[0]) return { invitados: 0, pagando: 0 };
  return { invitados: data[0].invitados ?? 0, pagando: data[0].pagando ?? 0 };
}
