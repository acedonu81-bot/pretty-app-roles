// Trayectoria verificada (22 nov 2026): eventos en los que ha trabajado cada
// profesional. Diseño: docs/superpowers/specs/2026-11-22-trayectoria-verificada-design.md
// La marca (estado/origen) la pone siempre el servidor; aquí solo se lee.
import { supabase } from '@/integrations/supabase/client';
import { planDe } from '@/lib/ventajasPlan';

export type EventoTrayectoria = {
  id: string;
  titulo: string;
  tipo: string | null;
  fecha: string;
  ciudad: string | null;
  lugar: string | null;
  foto_url: string | null;
  estado: 'declarado' | 'pendiente' | 'confirmado';
  origen: 'declarado' | 'xpeak';
};

export type NuevoEvento = Pick<EventoTrayectoria, 'titulo' | 'fecha'> & Partial<Pick<EventoTrayectoria, 'tipo' | 'ciudad' | 'lugar' | 'foto_url'>>;

// "pendiente" se enseña como "Declarado": hasta que el organizador confirma no prueba nada.
export const MARCA = { declarado: 'Declarado', pendiente: 'Declarado', confirmado: 'Confirmado', xpeak: 'Contrato XPEAK' } as const;
export const marcaDe = (e: Pick<EventoTrayectoria, 'estado' | 'origen'>) => (e.origen === 'xpeak' ? MARCA.xpeak : MARCA[e.estado]);

export const puedePedirConfirmacion = (tier: string | null | undefined, cobros: boolean): boolean =>
  cobros && !!tier && planDe(tier) === 'business';

// La tabla es nueva y aún no está en los tipos generados de Supabase.
const tabla = () => (supabase as any).from('trayectoria_eventos');

export async function listarMisEventos(): Promise<EventoTrayectoria[]> {
  const { data, error } = await tabla().select('id, titulo, tipo, fecha, ciudad, lugar, foto_url, estado, origen').order('fecha', { ascending: false });
  if (error) throw error;
  return (data ?? []) as EventoTrayectoria[];
}

export async function crearEvento(e: NuevoEvento): Promise<void> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error('Inicia sesión');
  const { error } = await tabla().insert({ ...e, user_id: u.user.id });
  if (error) throw error;
}

export async function borrarEvento(id: string): Promise<void> {
  const { error } = await tabla().delete().eq('id', id);
  if (error) throw error;
}

export async function pedirConfirmacion(eventoId: string, email: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('trayectoria-solicitar', { body: { evento_id: eventoId, email_organizador: email } });
  if (error || !data?.ok) throw new Error((data as any)?.error ?? 'No se pudo enviar');
}

export async function trayectoriaPublica(userId: string): Promise<EventoTrayectoria[]> {
  const { data, error } = await (supabase as any).rpc('trayectoria_publica', { p_user_id: userId });
  if (error) return [];
  return (data ?? []) as EventoTrayectoria[];
}

export async function confirmadosDe(userIds: string[]): Promise<Record<string, number>> {
  if (!userIds.length) return {};
  const { data, error } = await (supabase as any).rpc('trayectoria_confirmados', { p_user_ids: userIds.slice(0, 200) });
  if (error) return {};
  return Object.fromEntries(((data ?? []) as { user_id: string; confirmados: number }[]).map(r => [r.user_id, r.confirmados]));
}
