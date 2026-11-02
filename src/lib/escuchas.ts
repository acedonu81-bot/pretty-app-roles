// Escuchas de los sets (perfil de DJ, fase 3, 1 nov 2026). Una escucha vale
// con 5 minutos de reproducción REAL: saltar con la onda o la tracklist no
// suma. El servidor (registrar_escucha) se encarga de "una por persona y set
// al día", del propio DJ y del tráfico propio.

export const SEGUNDOS_ESCUCHA = 300;
const CLAVE_VISITANTE = 'xpeak_visitante';

/**
 * Suma el avance natural entre dos lecturas de la posición. Un salto hacia
 * delante (más de 3 s entre lecturas, que llegan cada ~0,25-1 s) o hacia
 * atrás no cuenta como escuchado.
 */
export const sumarEscuchado = (acumulado: number, anterior: number | null, actual: number): number => {
  if (anterior === null) return acumulado;
  const avance = actual - anterior;
  return avance > 0 && avance <= 3 ? acumulado + avance : acumulado;
};

/** Id anónimo y estable de este navegador, para no contar dos veces la misma escucha. */
export const idVisitante = (): string => {
  try {
    let id = localStorage.getItem(CLAVE_VISITANTE);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(CLAVE_VISITANTE, id); }
    return id;
  } catch {
    return crypto.randomUUID();
  }
};

/** Navegadores del equipo (?interno=1) y desarrollo local: no cuentan. */
export const navegadorNoCuenta = (): boolean => {
  try {
    if (localStorage.getItem('xpeak_interno') === '1') return true;
    if (new URLSearchParams(location.search).get('interno') === '1') return true;
    if (navigator.webdriver) return true;
    return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  } catch {
    return false;
  }
};
