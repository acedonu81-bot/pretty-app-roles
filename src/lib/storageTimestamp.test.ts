import { describe, it, expect } from 'vitest';
import { fechaSubidaStorage } from './storageTimestamp';

describe('fechaSubidaStorage', () => {
  it('extrae el timestamp del nombre de archivo (PortfolioUpload/AudioUpload: {Date.now()}-{nombre})', () => {
    const url = 'https://x.supabase.co/storage/v1/object/public/audio-sessions/u1/portfolio/1789651404214-foto.jpg';
    expect(fechaSubidaStorage(url)).toBe(new Date(1789651404214).toISOString());
  });

  it('funciona igual para sessions/ (audio subido como archivo)', () => {
    const url = 'https://x.supabase.co/storage/v1/object/public/audio-sessions/u1/sessions/1787686786708-Para_Bee.mp3';
    expect(fechaSubidaStorage(url)).toBe(new Date(1787686786708).toISOString());
  });

  it('devuelve null para URLs externas sin ese patrón (SoundCloud, HearThis...)', () => {
    expect(fechaSubidaStorage('https://on.soundcloud.com/zz9c4bk2HJ3UoZwGaB')).toBeNull();
    expect(fechaSubidaStorage('https://hearthis.at/66b3e056eab6f/')).toBeNull();
  });

  it('devuelve null para null/undefined', () => {
    expect(fechaSubidaStorage(null)).toBeNull();
    expect(fechaSubidaStorage(undefined)).toBeNull();
  });

  it('devuelve null si el número no es un timestamp plausible (demasiado corto)', () => {
    expect(fechaSubidaStorage('https://x.supabase.co/storage/v1/object/public/audio-sessions/u1/portfolio/5-foto.jpg')).toBeNull();
  });
});
