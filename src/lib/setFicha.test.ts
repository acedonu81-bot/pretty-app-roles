import { describe, expect, it } from 'vitest';
import { fichaTieneContenido, formatTiempo, parseTiempo, parseTracklistTexto, tituloPorDefecto, tracklistDesdeBD } from './setFicha';

describe('parseTiempo', () => {
  it('lee minutos y horas', () => {
    expect(parseTiempo('0:00')).toBe(0);
    expect(parseTiempo('14:20')).toBe(860);
    expect(parseTiempo('1:02:03')).toBe(3723);
  });
  it('rechaza lo que no es un tiempo', () => {
    expect(parseTiempo('14')).toBeNull();
    expect(parseTiempo('14:7')).toBeNull();
    expect(parseTiempo('14:60')).toBeNull();
    expect(parseTiempo('abc')).toBeNull();
  });
});

describe('formatTiempo', () => {
  it('formatea con y sin horas', () => {
    expect(formatTiempo(0)).toBe('0:00');
    expect(formatTiempo(860)).toBe('14:20');
    expect(formatTiempo(3723)).toBe('1:02:03');
  });
});

describe('parseTracklistTexto', () => {
  it('entiende los formatos habituales y ordena por minuto', () => {
    const temas = parseTracklistTexto([
      '2. 03:20 Fisher – Losing It',
      '1. 00:00 Chris Lake - Turn Off The Lights',
      '[14:05] Mau P - Drugs From Amsterdam',
      'Tracklist:',
      '20:00 sin separador',
    ].join('\n'));
    expect(temas).toEqual([
      { t: 0, artista: 'Chris Lake', tema: 'Turn Off The Lights' },
      { t: 200, artista: 'Fisher', tema: 'Losing It' },
      { t: 845, artista: 'Mau P', tema: 'Drugs From Amsterdam' },
    ]);
  });
  it('mantiene guiones dentro del nombre del tema', () => {
    expect(parseTracklistTexto('05:00 Artista - Tema - Extended Mix')).toEqual([
      { t: 300, artista: 'Artista', tema: 'Tema - Extended Mix' },
    ]);
  });
});

describe('tracklistDesdeBD', () => {
  it('descarta filas mal formadas', () => {
    expect(tracklistDesdeBD(null)).toEqual([]);
    expect(tracklistDesdeBD([{ t: 60, artista: 'A', tema: 'B' }, { t: 'x' }, null])).toEqual([
      { t: 60, artista: 'A', tema: 'B' },
    ]);
  });
});

describe('tituloPorDefecto', () => {
  it('limpia el nombre del archivo subido', () => {
    expect(tituloPorDefecto('https://x.supabase.co/storage/v1/object/public/audio-sessions/u/sessions/1789043913026-Sesion_techno_old_school._.._Jsus_.m4a', 1))
      .toBe('Sesion techno old school Jsus');
  });
  it('usa el tramo del set en los enlaces', () => {
    expect(tituloPorDefecto('https://soundcloud.com/dj-vizard/dj-vizard-live-sala-dlocos?in=x', 1)).toBe('Dj vizard live sala dlocos');
  });
  it('cae a "Set N" si no hay nada legible', () => {
    expect(tituloPorDefecto('https://on.soundcloud.com/', 2)).toBe('Set 2');
    expect(tituloPorDefecto('no es una url', 3)).toBe('Set 3');
  });
});

describe('fichaTieneContenido', () => {
  const vacia = { set_url: 'u', titulo: null, portada_url: null, etiquetas: [], bpm: null, mood: null, tracklist: [] };
  it('una ficha vacía no cuenta', () => {
    expect(fichaTieneContenido(vacia)).toBe(false);
    expect(fichaTieneContenido(null)).toBe(false);
  });
  it('con cualquier dato sí', () => {
    expect(fichaTieneContenido({ ...vacia, bpm: 124 })).toBe(true);
  });
});
