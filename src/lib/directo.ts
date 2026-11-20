// Directos de XPEAK (20 nov 2026): cualquier profesional puede emitir por
// Twitch (o YouTube) y XPEAK incrusta el reproductor. No hay API de Twitch:
// el profesional pulsa "Empezar directo" y la hora de inicio queda en
// profiles.live_started_at. Si olvida terminarlo, caduca a las 8 h.
export const DIRECTO_HORAS_MAX = 8;

export interface DirectoPerfil {
  is_live?: boolean | null;
  stream_url?: string | null;
  live_started_at?: string | null;
}

export const directoCaducaDesde = (ahora: number = Date.now()): string =>
  new Date(ahora - DIRECTO_HORAS_MAX * 3_600_000).toISOString();

/** Un directo cuenta solo si está marcado, tiene enlace y empezó hace menos de 8 h. */
export const directoVigente = (p: DirectoPerfil, ahora: number = Date.now()): boolean => {
  if (!p.is_live || !p.stream_url || !p.live_started_at) return false;
  const inicio = Date.parse(p.live_started_at);
  if (Number.isNaN(inicio)) return false;
  return ahora - inicio < DIRECTO_HORAS_MAX * 3_600_000;
};

/** El empresario contrata, no emite. El resto de roles puede hacer directos. */
const ROLES_SIN_DIRECTO = new Set(['empresario', 'particular']);
export const puedeHacerDirecto = (role?: string | null): boolean =>
  !!role && !ROLES_SIN_DIRECTO.has(role);

/** Solo enlaces de Twitch o YouTube: son los que el reproductor sabe incrustar. */
export const enlaceDirectoValido = (url: string): boolean => {
  try {
    const u = new URL(/^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`);
    const h = u.hostname.replace(/^www\./, '').toLowerCase();
    if (h === 'twitch.tv' || h.endsWith('.twitch.tv')) return u.pathname.split('/').filter(Boolean).length > 0;
    if (h === 'youtu.be') return u.pathname.split('/').filter(Boolean).length > 0;
    if (h === 'youtube.com' || h.endsWith('.youtube.com')) {
      // En YouTube cada directo tiene su propio enlace de vídeo; el enlace del canal (@nombre)
      // no se puede incrustar, así que no se acepta.
      const seg = u.pathname.split('/').filter(Boolean);
      return !!u.searchParams.get('v') || (['live', 'shorts', 'embed'].includes(seg[0]) && !!seg[1] && seg[1] !== 'live_stream');
    }
    return false;
  } catch {
    return false;
  }
};
