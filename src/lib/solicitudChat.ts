/**
 * Datos de la solicitud que originó una conversación (31 oct 2026). El chat no
 * los enseñaba y los profesionales preguntaban lo que la clienta ya había
 * rellenado ("¿dónde sería?", "¿querías fotomatones?"), y uno cerró un acuerdo
 * en Madrid para un evento en Alcalá. event_description viene como
 * "[Personas: 20] [Horario: de 17 a 22] [Particular] [Cumpleaños] texto libre".
 */
export interface SolicitudChat {
  fecha: string; // YYYY-MM-DD o ''
  lugar: string;
  personas: string;
  horario: string;
  tipo: string;
}

const ETIQUETAS_PROPIAS = /^(personas|horario)\s*:/i;

export function leerSolicitud(r: { event_date?: string | null; event_location?: string | null; event_description?: string | null }): SolicitudChat {
  const desc = r.event_description ?? '';
  const etiquetas = [...desc.matchAll(/\[([^\]]*)\]/g)].map(m => m[1].trim());
  const valor = (clave: RegExp) => etiquetas.find(e => clave.test(e))?.replace(clave, '').trim() ?? '';
  const sueltas = etiquetas.filter(e => !ETIQUETAS_PROPIAS.test(e) && !/^particular$/i.test(e));
  const deTexto = /evento de tipo ([^.]+)\./i.exec(desc)?.[1]?.trim();
  const fecha = /^\d{4}-\d{2}-\d{2}/.test(r.event_date ?? '') ? String(r.event_date).slice(0, 10) : '';
  return {
    fecha,
    lugar: (r.event_location ?? '').trim().replace(/^por confirmar$/i, ''),
    personas: valor(/^personas\s*:/i),
    horario: valor(/^horario\s*:/i),
    tipo: sueltas[0] ?? deTexto ?? '',
  };
}

export const fechaLegible = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
};
