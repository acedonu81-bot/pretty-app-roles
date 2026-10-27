import { describe, it, expect } from 'vitest';
import { estadoInscripcionMadrid, concursoActivo, concursoEnRevision } from './concursoMadrid';

const perfil = (p: Partial<{ photo_url: string | null; bio: string | null; region: string | null }>) =>
  ({ photo_url: 'https://x/foto.jpg', bio: 'DJ de bodas', region: 'Madrid', ...p });

describe('estadoInscripcionMadrid', () => {
  it('DJ de la Comunidad de Madrid con foto y bio puede inscribirse', () => {
    expect(estadoInscripcionMadrid([perfil({})])).toBe('ok');
  });

  it('sin foto o sin bio primero tiene que completar el perfil', () => {
    expect(estadoInscripcionMadrid([perfil({ photo_url: null })])).toBe('falta_perfil');
    expect(estadoInscripcionMadrid([perfil({ bio: '  ' })])).toBe('falta_perfil');
  });

  it('fuera de la Comunidad de Madrid no puede inscribirse', () => {
    expect(estadoInscripcionMadrid([perfil({ region: 'Andalucía' })])).toBe('fuera_de_madrid');
  });

  it('sin ciudad en la ficha (región vacía) tampoco, hasta que la ponga', () => {
    expect(estadoInscripcionMadrid([perfil({ region: null })])).toBe('fuera_de_madrid');
  });

  it('basta con que uno de sus perfiles sea de Madrid', () => {
    expect(estadoInscripcionMadrid([perfil({ region: 'Galicia' }), perfil({ photo_url: null, region: 'Madrid' })])).toBe('ok');
  });
});

describe('concursoActivo', () => {
  it('activo del 13 oct a las 00:00 al 2 nov a las 23:59 (hora de Madrid)', () => {
    expect(concursoActivo(new Date('2026-10-12T23:59:00+02:00'))).toBe(false);
    expect(concursoActivo(new Date('2026-10-13T00:00:00+02:00'))).toBe(true);
    expect(concursoActivo(new Date('2026-11-02T23:59:00+01:00'))).toBe(true);
    expect(concursoActivo(new Date('2026-11-03T00:00:00+01:00'))).toBe(false);
  });
});

describe('concursoEnRevision', () => {
  it('solo del cierre al anuncio del ganador', () => {
    expect(concursoEnRevision(new Date('2026-11-02T23:59:00+01:00'))).toBe(false);
    expect(concursoEnRevision(new Date('2026-11-03T00:00:00+01:00'))).toBe(true);
    expect(concursoEnRevision(new Date('2026-11-09T23:00:00+01:00'))).toBe(true);
    expect(concursoEnRevision(new Date('2026-11-10T00:00:00+01:00'))).toBe(false);
  });
});
