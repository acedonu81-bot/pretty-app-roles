/**
 * Una solicitud a profesionales solo se manda si trae TODOS los datos (20 oct 2026).
 * Cada solicitud avisa a profesionales reales por email y push: sin fecha, sitio y
 * contacto no pueden contestar con un precio, y si se deja pasar todo, cualquiera
 * "prueba" (casos: nombre "r" repartido a 10 DJs; Kesia sin fecha ni lugar y 0
 * respuestas; un DJ usando el formulario de particular con su propio correo).
 * La base de datos vuelve a comprobar lo mismo (trigger flash_bookings_exige_datos):
 * esto es el aviso claro antes de enviar, no la única barrera.
 */

const SOLO_LETRAS = (t: string) => (t.match(/\p{L}/gu) ?? []).length;

/** Teclazos, repeticiones o palabras de prueba: "r", "jajaja", "asdf", "test"... */
export function textoBasura(texto: string): boolean {
  const t = texto.trim().toLowerCase();
  if (SOLO_LETRAS(t) < 2) return true;
  const sinEspacios = t.replace(/\s+/g, '');
  if (/^(.)\1{2,}$/u.test(sinEspacios)) return true; // aaaa
  // jajaja, jejeje, hjajajjaja: solo j/h/vocales y al menos dos "j".
  if (sinEspacios.length >= 4 && /^[jhaeiou]+$/u.test(sinEspacios) && (sinEspacios.match(/j/g) ?? []).length >= 2) return true;
  if (/\b(asdf|qwer|zxcv|xxxx|test|prueba|pruebas|probando|fake|nada|ninguno)\b/u.test(t)) return true;
  if (SOLO_LETRAS(t) >= 4 && !/[aeiouáéíóúü]/u.test(t)) return true; // sin vocales
  return false;
}

export const emailValido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
export const telefonoValido = (t: string) => t.replace(/\D/g, '').length >= 9;
export const contactoValido = (c: string) => emailValido(c) || telefonoValido(c);

/** YYYY-MM-DD de hoy en Madrid. */
export const hoyMadrid = (): string =>
  new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });

/** Fecha real (YYYY-MM-DD) de hoy o futura. "Por confirmar" y vacío no valen. */
export function fechaValida(ymd: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
  const d = new Date(`${ymd}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== ymd) return false;
  return ymd >= hoyMadrid();
}

/** Tope de profesionales a los que llega una misma solicitud (elegidos al azar). */
export const MAX_PROFESIONALES_POR_SOLICITUD = 5;

/** Mezcla Fisher-Yates sin tocar el original. */
export function barajar<T>(lista: readonly T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Elige hasta MAX_PROFESIONALES_POR_SOLICITUD profesionales al azar. */
export const elegirProfesionales = <T,>(lista: readonly T[]): T[] =>
  barajar(lista).slice(0, MAX_PROFESIONALES_POR_SOLICITUD);

export const PERSONAS_OPCIONES = ['Hasta 30', '30 a 80', '80 a 150', '150 a 300', 'Más de 300'] as const;

/** "De 22:00 a 03:00": al menos cuatro caracteres y alguna cifra. */
export const horarioValido = (h: string): boolean => h.trim().length >= 4 && /\d/.test(h);

/** Bloque que va al principio de la descripción y que la base de datos exige. */
export const detalleSolicitud = (personas: string, horario: string): string =>
  `[Personas: ${personas.replace(/[\[\]]/g, '')}] [Horario: ${horario.trim().replace(/[\[\]]/g, '')}]`;

export type DatosSolicitud = {
  name?: string;
  contact?: string;
  date?: string;
  location?: string;
  eventType?: string;
  personas?: string;
  horario?: string;
};

/** Lista, en lenguaje llano, de lo que falta o está mal. Vacía = se puede enviar. */
export function faltanDatos(d: DatosSolicitud, opts: { pideTipo?: boolean; pideDetalle?: boolean } = {}): string[] {
  const f: string[] = [];
  if (!d.name || textoBasura(d.name)) f.push('tu nombre');
  if (!d.contact || !contactoValido(d.contact)) f.push('un email o teléfono válido');
  if (opts.pideTipo && !d.eventType) f.push('el tipo de evento');
  if (!d.date || !fechaValida(d.date)) f.push('la fecha del evento');
  if (!d.location || SOLO_LETRAS(d.location) < 3 || textoBasura(d.location)) f.push('la ciudad o el lugar');
  if (opts.pideDetalle) {
    if (!d.personas) f.push('el número aproximado de personas');
    if (!d.horario || !horarioValido(d.horario)) f.push('el horario');
  }
  return f;
}

/** "Falta tu nombre, la fecha del evento y la ciudad o el lugar." */
export function mensajeFaltan(faltan: string[]): string {
  if (faltan.length === 0) return '';
  const lista = faltan.length === 1 ? faltan[0] : `${faltan.slice(0, -1).join(', ')} y ${faltan[faltan.length - 1]}`;
  return `Falta ${lista}.`;
}

// Prueba real (27 oct 2026): el particular que no sabe qué necesita pide que lo organice
// XPEAK, de momento solo en Madrid. No está en ROLES_POR_SERVICIO de particular-solicitud,
// así que no se reparte a profesionales: entra como lead general y avisa al admin.
export const SERVICIO_ORGANIZA = 'Que lo organice XPEAK';
