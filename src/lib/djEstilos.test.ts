import { describe, it, expect } from 'vitest';
import { FAMILIAS_ESTILO, familiaPorLabel, encajaEnFamilia, grafiasFamilia } from './djEstilos';

const fam = (l: string) => familiaPorLabel(l)!;

describe('djEstilos', () => {
  it('ignora mayúsculas y tildes al encajar', () => {
    expect(encajaEnFamilia(['BACHATA'], fam('Reggaetón y latino'))).toBe(true);
    expect(encajaEnFamilia(['Reggaeton'], fam('Reggaetón y latino'))).toBe(true);
    expect(encajaEnFamilia(['HIT DEL MOMENTO'], fam('Comercial'))).toBe(true);
    expect(encajaEnFamilia(['INDIE'], fam('Chill e indie'))).toBe(true);
  });
  it('Progressive a secas es house, no trance', () => {
    expect(encajaEnFamilia(['Progressive'], fam('House'))).toBe(true);
    expect(encajaEnFamilia(['Progressive'], fam('Trance'))).toBe(false);
    expect(encajaEnFamilia(['Progressive Trance'], fam('Trance'))).toBe(true);
  });
  it('etiquetas de servicio no caen en ningún estilo', () => {
    expect(FAMILIAS_ESTILO.some(f => encajaEnFamilia(['Bodas', 'Iluminación', 'DJ incluido'], f))).toBe(false);
  });
  it('la web pública pide también las grafías sin tilde y en mayúsculas', () => {
    const g = grafiasFamilia(fam('Reggaetón y latino'));
    expect(g).toEqual(expect.arrayContaining(['Reggaetón', 'Reggaeton', 'BACHATA', 'URBAN']));
  });
  it('sin estilos no sale en ninguna familia', () => {
    expect(FAMILIAS_ESTILO.some(f => encajaEnFamilia([], f))).toBe(false);
    expect(FAMILIAS_ESTILO.some(f => encajaEnFamilia(null, f))).toBe(false);
  });
});
