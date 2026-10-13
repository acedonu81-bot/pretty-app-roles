import { logEvent } from '@/lib/track';

/**
 * Medición del asistente de bienvenida (OnboardingWizard). Antes no dejaba
 * ningún rastro: DjPTC (13 oct 2026) llegó del anuncio, se registró, entró
 * al panel y se fue sin foto, y no había forma de saber si abandonó al ver lo
 * que se le pedía o si la foto le falló (los fallos solo eran un toast).
 *
 * Va como 'auth_paso' con detalle "asistente …" porque log_analytics_event ya
 * acepta ese nombre: no hace falta tocar la base de datos. Consulta:
 * select detalle, count(*) from analytics_events
 * where event_name = 'auth_paso' and detalle like 'asistente%' group by 1
 */
export function logAsistente(detalle: string) {
  void logEvent('auth_paso', '/dashboard', `asistente ${detalle}`.slice(0, 120));
}

export function resumenAsistente(e: {
  paso: number; rol: string; foto: boolean; ciudad: boolean; bio: number; seg: number;
}) {
  const sn = (v: boolean) => (v ? 'si' : 'no');
  return `paso=${e.paso} rol=${e.rol || 'ninguno'} foto=${sn(e.foto)} ciudad=${sn(e.ciudad)} bio=${e.bio} seg=${e.seg}`;
}
