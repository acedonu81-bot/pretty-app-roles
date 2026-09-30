import { describe, it, expect } from 'vitest';
import { fotoOptimizada } from './imagen';

const base = 'https://x.supabase.co/storage/v1/object/public/audio-sessions/u/foto.jpg';

describe('fotoOptimizada', () => {
  it('pide a Supabase la foto redimensionada', () => {
    expect(fotoOptimizada(base, 600)).toBe('https://x.supabase.co/storage/v1/render/image/public/audio-sessions/u/foto.jpg?width=600&resize=contain&quality=72');
  });
  it('no toca URLs que no son de Storage', () => {
    expect(fotoOptimizada('/images/pexels/roles/dj.jpg', 600)).toBe('/images/pexels/roles/dj.jpg');
  });
  it('no toca URLs que ya llevan parámetros', () => {
    expect(fotoOptimizada(base + '?v=2', 600)).toBe(base + '?v=2');
  });
  it('vacío o nulo se devuelve igual', () => {
    expect(fotoOptimizada(null, 600)).toBe('');
    expect(fotoOptimizada('', 600)).toBe('');
  });
});
