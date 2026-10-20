import { describe, it, expect } from 'vitest';
import { coincideBusqueda } from './busquedaTexto';

const dj = ['Ana Beat', 'Techno / House', 'Madrid', 'DJ de bodas', ['Flamenco House', 'Techno Flamenco', 'Comercial']];

describe('coincideBusqueda', () => {
  it('encuentra el estilo nuevo en los géneros', () => {
    expect(coincideBusqueda(dj, 'flamenco house')).toBe(true);
    expect(coincideBusqueda(dj, 'techno flamenco')).toBe(true);
    expect(coincideBusqueda(dj, 'flamenco')).toBe(true);
  });
  it('da igual el orden de las palabras', () => {
    expect(coincideBusqueda(['x', ['Techno Flamenco']], 'flamenco techno')).toBe(true);
  });
  it('ignora tildes y mayúsculas', () => {
    expect(coincideBusqueda([['Flamenco Fusión']], 'FUSION flamenco')).toBe(true);
  });
  it('junta palabras de campos distintos (estilo + ciudad)', () => {
    expect(coincideBusqueda(dj, 'flamenco house madrid')).toBe(true);
    expect(coincideBusqueda(dj, 'flamenco house barcelona')).toBe(false);
  });
  it('no inventa coincidencias', () => {
    expect(coincideBusqueda([['Tech House']], 'flamenco')).toBe(false);
    expect(coincideBusqueda([null, undefined, []], 'flamenco')).toBe(false);
  });
  it('búsqueda vacía no filtra', () => {
    expect(coincideBusqueda(dj, '   ')).toBe(true);
  });
});
