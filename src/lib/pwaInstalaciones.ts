/** Fila tal cual la devuelve panel_analytics_pwa_instalaciones: un evento, no una persona. */
export type EventoPwa = {
  instalado_en: string; device: string | null;
  display_name: string | null; rol: string | null; evento: string;
};

export type PersonaPwa = {
  display_name: string | null; rol: string | null; device: string | null;
  /** Hubo 'pwa_installed' en el rango: la instaló ahora, no "ya la tenía". */
  instalo: boolean;
  /** Veces que abrió la web en modo app ('pwa_session'). */
  aperturas: number;
  /** Último evento de esa persona. */
  ultima: string;
};

/**
 * Agrupa los eventos PWA por persona. 'pwa_session' se registra en cada
 * apertura, así que contar filas inflaba el panel: Dj eloy salía 12 veces y
 * "Ya la tienen puesta: 11" eran en realidad 2 personas (13 oct 2026).
 * La RPC no devuelve user_id, así que se agrupa por nombre + rol; los
 * anónimos no se pueden juntar y cada evento queda como una fila.
 */
export function agruparInstalacionesPwa(eventos: EventoPwa[]): PersonaPwa[] {
  const porPersona = new Map<string, PersonaPwa>();
  eventos.forEach((e, idx) => {
    const clave = e.display_name ? `${e.display_name}|${e.rol ?? ''}` : `anonimo:${idx}`;
    let p = porPersona.get(clave);
    if (!p) {
      p = { display_name: e.display_name, rol: e.rol, device: e.device, instalo: false, aperturas: 0, ultima: e.instalado_en };
      porPersona.set(clave, p);
    }
    if (e.evento === 'pwa_installed') p.instalo = true;
    if (e.evento === 'pwa_session') p.aperturas += 1;
    if (new Date(e.instalado_en) > new Date(p.ultima)) {
      p.ultima = e.instalado_en;
      p.device = e.device;
    }
  });
  return [...porPersona.values()].sort((a, b) => new Date(b.ultima).getTime() - new Date(a.ultima).getTime());
}
