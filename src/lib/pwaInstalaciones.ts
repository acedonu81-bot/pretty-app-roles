/** Fila tal cual la devuelve panel_analytics_pwa_instalaciones: un evento, no una persona. */
export type EventoPwa = {
  instalado_en: string; device: string | null;
  display_name: string | null; rol: string | null; evento: string;
  /** Sistema (iphone, android...) desde que se registra; null en eventos anteriores. */
  detalle?: string | null;
};

export type PersonaPwa = {
  display_name: string | null; rol: string | null; device: string | null;
  /** Hubo 'pwa_installed' en el rango: la instaló ahora, no "ya la tenía". */
  instalo: boolean;
  /** iphone, android, ipad, windows, mac, otro; null si solo hay eventos antiguos sin ese dato. */
  sistema: string | null;
  /** Veces que abrió la web en modo app ('pwa_session'). */
  aperturas: number;
  /** Último evento de esa persona. */
  ultima: string;
  /**
   * Fila que junta TODAS las aperturas anónimas sin id de aparato (las de antes
   * del 19 oct 2026 o de quien no aceptó cookies de analítica): no se sabe
   * cuántas personas son, así que no cuentan como personas en el total.
   */
  sinIdentificar?: boolean;
};

/** detalle llega como "android" o, con id de aparato, "android#k3j9...". */
function partirDetalle(detalle: string | null | undefined): { sistema: string | null; aparato: string | null } {
  if (!detalle) return { sistema: null, aparato: null };
  const [sistema, aparato] = detalle.split('#');
  return { sistema: sistema || null, aparato: aparato || null };
}

/**
 * Agrupa los eventos PWA por persona. 'pwa_session' se registra en cada
 * apertura, así que contar filas inflaba el panel: Dj eloy salía 12 veces y
 * "Ya la tienen puesta: 11" eran en realidad 2 personas (13 oct 2026).
 * La RPC no devuelve user_id, así que se agrupa por nombre + rol. Los
 * anónimos se agrupan por id de aparato si lo hay; los que no lo tienen van
 * todos a una sola fila "sin identificar" en vez de repetirse uno por evento.
 */
export function agruparInstalacionesPwa(eventos: EventoPwa[]): PersonaPwa[] {
  const porPersona = new Map<string, PersonaPwa>();
  eventos.forEach((e) => {
    const { sistema, aparato } = partirDetalle(e.detalle);
    const clave = e.display_name ? `${e.display_name}|${e.rol ?? ''}` : aparato ? `aparato:${aparato}` : 'sin-identificar';
    let p = porPersona.get(clave);
    if (!p) {
      p = { display_name: e.display_name, rol: e.rol, device: e.device, instalo: false, sistema: null, aperturas: 0, ultima: e.instalado_en };
      if (clave === 'sin-identificar') p.sinIdentificar = true;
      porPersona.set(clave, p);
    }
    if (p.sinIdentificar) {
      // Lista de sistemas distintos ("android, mac, iphone"): ninguno manda.
      if (sistema && !(p.sistema ?? '').split(', ').includes(sistema)) p.sistema = p.sistema ? `${p.sistema}, ${sistema}` : sistema;
    } else if (!p.sistema && sistema) {
      // Los eventos llegan del más reciente al más antiguo: manda el primer sistema que aparezca.
      p.sistema = sistema;
    }
    if (e.evento === 'pwa_installed') p.instalo = true;
    if (e.evento === 'pwa_session') p.aperturas += 1;
    if (new Date(e.instalado_en) > new Date(p.ultima)) {
      p.ultima = e.instalado_en;
      p.device = e.device;
    }
  });
  // La fila sin identificar va siempre la última: no es una persona.
  return [...porPersona.values()].sort((a, b) => Number(!!a.sinIdentificar) - Number(!!b.sinIdentificar) ||
    new Date(b.ultima).getTime() - new Date(a.ultima).getTime());
}
