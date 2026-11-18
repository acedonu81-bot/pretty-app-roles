// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { limitesDesdeBD, setsVisibles, portafolioVisible } from './limitesPlan';

describe('limitesPlan', () => {
  it('null de la BD es ilimitado', () => {
    expect(limitesDesdeBD({ sets: null, portafolio: 20 })).toEqual({ sets: Infinity, portafolio: 20 });
    expect(limitesDesdeBD(null)).toBeNull();
  });

  it('sets: corta al límite, ilimitado enseña todos', () => {
    const s = ['a', 'b', 'c', 'd', 'e'];
    expect(setsVisibles(s, { sets: 3, portafolio: 6 })).toEqual(['a', 'b', 'c']);
    expect(setsVisibles(s, { sets: Infinity, portafolio: 20 })).toEqual(s);
    expect(setsVisibles(s, null, 4)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('portafolio: fotos primero y los vídeos rellenan lo que queda', () => {
    const fotos = ['f1', 'f2', 'f3', 'f4', 'f5'];
    const videos = ['v1', 'v2'];
    expect(portafolioVisible(fotos, videos, { sets: 3, portafolio: 6 })).toEqual({ fotos, videos: ['v1'] });
    expect(portafolioVisible(fotos, videos, { sets: 3, portafolio: 4 })).toEqual({ fotos: ['f1', 'f2', 'f3', 'f4'], videos: [] });
    expect(portafolioVisible(fotos, videos, { sets: 10, portafolio: 12 })).toEqual({ fotos, videos });
  });

  it('sin límite cargado no oculta nada', () => {
    expect(portafolioVisible(['f'], ['v'], null)).toEqual({ fotos: ['f'], videos: ['v'] });
  });
});
