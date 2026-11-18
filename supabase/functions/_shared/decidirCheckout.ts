import { esProfesional, esPlanPago, esCiclo, tierDesdeEstado } from './stripePlanes.ts';

export type Decision =
  | { tipo: 'checkout' }
  | { tipo: 'portal' }
  | { tipo: 'error'; codigo: 'cobros_apagados' | 'no_profesional' | 'plan_invalido' };

export function decidirCheckout(e: {
  cobrosActivos: boolean;
  perfiles: { role: string | null; roles: string[] | null }[];
  suscripcion: { estado: string | null } | null;
  plan: string;
  ciclo: string;
}): Decision {
  if (!e.cobrosActivos) return { tipo: 'error', codigo: 'cobros_apagados' };
  if (!e.perfiles.some(esProfesional)) return { tipo: 'error', codigo: 'no_profesional' };
  if (!esPlanPago(e.plan) || !esCiclo(e.ciclo)) return { tipo: 'error', codigo: 'plan_invalido' };
  const viva = e.suscripcion?.estado && tierDesdeEstado(e.suscripcion.estado, 'starter') !== 'free';
  return viva ? { tipo: 'portal' } : { tipo: 'checkout' };
}
