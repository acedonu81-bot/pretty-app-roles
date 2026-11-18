// Cobros con Stripe desde el panel. Solo web; en la app nativa no se llama.
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type PlanPago = 'starter' | 'business';
export type Ciclo = 'mensual' | 'anual';

export const cobrosActivos = () => import.meta.env.VITE_COBROS_ACTIVOS === 'true';

async function abrir(funcion: string, cuerpo?: Record<string, string>) {
  const { data, error } = await supabase.functions.invoke(funcion, { body: cuerpo ?? {} });
  if (error || !data?.url) {
    toast.error('No se ha podido abrir el pago. Inténtalo de nuevo en un momento.');
    return;
  }
  window.location.assign(data.url);
}

export const iniciarPago = (plan: PlanPago, ciclo: Ciclo) => abrir('crear-checkout', { plan, ciclo });
export const abrirPortal = () => abrir('portal-cliente');

export interface MiSuscripcion { estado: string | null; periodo_fin: string | null; cancela_al_final: boolean }

export async function leerMiSuscripcion(): Promise<MiSuscripcion | null> {
  const { data } = await (supabase as any).from('suscripciones').select('estado, periodo_fin, cancela_al_final').maybeSingle();
  return data ?? null;
}
