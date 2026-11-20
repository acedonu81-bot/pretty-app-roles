import { describe, it, expect } from 'vitest';
import { directoVigente, enlaceDirectoValido, puedeHacerDirecto, DIRECTO_HORAS_MAX } from './directo';

const ahora = Date.parse('2026-11-20T20:00:00Z');
const hace = (h: number) => new Date(ahora - h * 3_600_000).toISOString();

describe('directoVigente', () => {
  it('cuenta si está marcado, con enlace y reciente', () => {
    expect(directoVigente({ is_live: true, stream_url: 'https://twitch.tv/x', live_started_at: hace(1) }, ahora)).toBe(true);
  });
  it('caduca pasadas 8 horas', () => {
    expect(directoVigente({ is_live: true, stream_url: 'https://twitch.tv/x', live_started_at: hace(DIRECTO_HORAS_MAX + 0.1) }, ahora)).toBe(false);
  });
  it('no cuenta sin marca, sin enlace o sin hora de inicio', () => {
    expect(directoVigente({ is_live: false, stream_url: 'https://twitch.tv/x', live_started_at: hace(1) }, ahora)).toBe(false);
    expect(directoVigente({ is_live: true, stream_url: '', live_started_at: hace(1) }, ahora)).toBe(false);
    expect(directoVigente({ is_live: true, stream_url: 'https://twitch.tv/x', live_started_at: null }, ahora)).toBe(false);
    expect(directoVigente({ is_live: true, stream_url: 'https://twitch.tv/x', live_started_at: 'no-fecha' }, ahora)).toBe(false);
  });
});

describe('enlaceDirectoValido', () => {
  it('acepta Twitch y YouTube, con o sin https', () => {
    expect(enlaceDirectoValido('https://www.twitch.tv/djkevin')).toBe(true);
    expect(enlaceDirectoValido('twitch.tv/djkevin')).toBe(true);
    expect(enlaceDirectoValido('https://youtu.be/abc')).toBe(true);
    expect(enlaceDirectoValido('https://www.youtube.com/watch?v=abc')).toBe(true);
  });
  it('rechaza otras webs y canal vacío', () => {
    expect(enlaceDirectoValido('https://instagram.com/x')).toBe(false);
    expect(enlaceDirectoValido('https://twitch.tv/')).toBe(false);
    expect(enlaceDirectoValido('https://eviltwitch.tv.example.com/x')).toBe(false);
    expect(enlaceDirectoValido('')).toBe(false);
  });
});

describe('puedeHacerDirecto', () => {
  it('todos los roles profesionales sí, el empresario no', () => {
    for (const r of ['dj', 'staff', 'media', 'catering', 'mago', 'tecnico']) expect(puedeHacerDirecto(r)).toBe(true);
    expect(puedeHacerDirecto('empresario')).toBe(false);
    expect(puedeHacerDirecto(undefined)).toBe(false);
  });
});
