// Estadísticas según el plan (18 nov 2026, decisiones de Daniel):
// - Esencial: solo las visitas del mes; el resto, difuminado con invitación a Profesional.
// - Profesional (y fundadores): todo lo de siempre.
// - Premium: además, visitas día a día, de dónde llegan y exportar.
// - Antes del lanzamiento ('pre'): todo abierto, como hasta ahora.
// El plan lo calcula la BD (mi_plan_efectivo); aquí solo se traduce a qué se enseña.

export type PlanEfectivo = 'pre' | 'free' | 'starter' | 'business';

export type Acceso = { basicas: boolean; avanzadas: boolean };

export function accesoEstadisticas(plan: string | null | undefined): Acceso {
  switch (plan) {
    case 'free': return { basicas: false, avanzadas: false };
    case 'starter': return { basicas: true, avanzadas: false };
    case 'business':
    case 'pre': return { basicas: true, avanzadas: true };
    default: return { basicas: true, avanzadas: false }; // aún cargando: no se enseña de más
  }
}

export const ETIQUETA_FUENTE: Record<string, string> = {
  directo: 'Enlace directo',
  buscador: 'Buscadores (Google y otros)',
  redes: 'Redes sociales',
  otra_web: 'Otras webs',
  inicio_premium: 'Destacado en el Inicio de XPEAK',
  inicio_nuevo: 'Tarjeta de nuevos en Inicio',
  interno: 'Dentro de XPEAK',
};

const celda = (v: string | number): string => {
  const s = String(v);
  // Evita que Excel interprete texto como fórmula (=, +, -, @) y escapa comillas y separadores.
  const seguro = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[";\n\r]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro;
};

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// CSV con ; (el Excel en español lo abre en columnas). El BOM lo añade quien descarga.
export function csvEstadisticas(d: {
  generado: string;
  anio: number;
  visitasDia: { dia: string; visitas: number }[];
  origen: { fuente: string; visitas: number }[];
  mensajesMes: number[];
  conversacionesMes: number[];
  totales: { visitas: number; mensajes: number; solicitudes: number; conversaciones: number };
}): string {
  const f = (...c: (string | number)[]) => c.map(celda).join(';');
  const filas: string[] = [
    f('Estadísticas de tu perfil en XPEAK'), f('Generado', d.generado), '',
    f('Totales'), f('Visitas al perfil', d.totales.visitas), f('Mensajes recibidos', d.totales.mensajes),
    f('Solicitudes Flash', d.totales.solicitudes), f('Conversaciones', d.totales.conversaciones), '',
    f('Visitas por día'), f('Día', 'Visitas'), ...d.visitasDia.map(v => f(v.dia, v.visitas)), '',
    f('De dónde llegan las visitas (desde que se registra el origen)'), f('Origen', 'Visitas'),
    ...d.origen.map(o => f(ETIQUETA_FUENTE[o.fuente] ?? o.fuente, o.visitas)), '',
    f(`Mensajes y conversaciones por mes ${d.anio}`), f('Mes', 'Mensajes recibidos', 'Conversaciones nuevas'),
    ...MESES.map((m, i) => f(m, d.mensajesMes[i] ?? 0, d.conversacionesMes[i] ?? 0)),
  ];
  return filas.join('\r\n');
}

// Primer instante del mes en curso en hora de Madrid, como ISO en UTC. Tiene en
// cuenta el cambio de hora (UTC+1 en invierno, UTC+2 en verano) del propio día 1.
export function inicioMesMadrid(ahora: Date = new Date()): string {
  const [y, m] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit' })
    .format(ahora).split('-').map(Number);
  const mediodia = new Date(Date.UTC(y, m - 1, 1, 12));
  const gmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', timeZoneName: 'longOffset' })
    .formatToParts(mediodia).find(p => p.type === 'timeZoneName')?.value ?? 'GMT+1';
  const mt = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(gmt);
  const offsetMin = mt ? (mt[1] === '-' ? -1 : 1) * (Number(mt[2]) * 60 + Number(mt[3] ?? 0)) : 60;
  return new Date(Date.UTC(y, m - 1, 1) - offsetMin * 60_000).toISOString();
}
