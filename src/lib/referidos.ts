// Referidos: el enlace de invitación (xpeak.es/auth?mode=register&ref=CODIGO) y el
// descuento por amigos (10 % con uno que paga, 20 % con dos o más).
import { supabase } from '@/integrations/supabase/client';

const CLAVE = 'xpeak_ref';

export const descuentoReferidos = (pagando: number) => (pagando >= 2 ? 20 : pagando === 1 ? 10 : 0);

export const enlaceInvitacion = (codigo: string) => `https://xpeak.es/auth?mode=register&ref=${codigo}`;

// Se guarda al llegar con ?ref=: sobrevive a la vuelta de Google y a confirmar el correo.
export function guardarRefPendiente(codigo: string) {
  try { if (codigo.trim()) localStorage.setItem(CLAVE, codigo.trim()); } catch { /* sin almacenamiento */ }
}

// Apunta al padrino una sola vez, con la sesión ya iniciada. El código sale del
// navegador o de los datos del alta por correo (si confirma desde otro dispositivo).
export async function registrarPadrinoPendiente(user: { id: string; user_metadata?: Record<string, unknown> } | null) {
  if (!user) return null;
  const hecho = `${CLAVE}_hecho_${user.id}`;
  let codigo: string | null = null;
  try {
    if (localStorage.getItem(hecho)) return null;
    codigo = localStorage.getItem(CLAVE);
  } catch { /* sin almacenamiento */ }
  codigo = codigo || (typeof user.user_metadata?.ref === 'string' ? user.user_metadata.ref : null);
  if (!codigo) return null;
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
