import { describe, expect, it } from 'vitest';
import { esEnlaceInterno, formatoMencion, idCortoDeSlug, ordenarComunicados, porcentajes, slugNovedad, textoPlano, trocearCuerpo } from './comunicados';

const ID = '0b8f3c1e-1234-4abc-9def-1234567890ab';

describe('comunicados', () => {
  it('trocea el texto y deja las menciones como enlaces', () => {
    expect(trocearCuerpo(`Y el ganador es @[DJ Vizard](${ID}). Enhorabuena`)).toEqual([
      { tipo: 'texto', valor: 'Y el ganador es ' },
      { tipo: 'mencion', nombre: 'DJ Vizard', userId: ID },
      { tipo: 'texto', valor: '. Enhorabuena' },
    ]);
  });

  it('sin menciones devuelve el texto entero', () => {
    expect(trocearCuerpo('Hola')).toEqual([{ tipo: 'texto', valor: 'Hola' }]);
  });

  it('una arroba suelta no es mención', () => {
    expect(trocearCuerpo('escribe a @xpeak')).toEqual([{ tipo: 'texto', valor: 'escribe a @xpeak' }]);
  });

  it('el texto plano quita la marca de la mención', () => {
    expect(textoPlano(`Gana @[DJ Vizard](${ID})\n\nbien`)).toBe('Gana DJ Vizard bien');
  });

  it('el formato de mención limpia corchetes del nombre', () => {
    expect(formatoMencion('DJ [Vizard]', ID)).toBe(`@[DJ Vizard](${ID})`);
  });

  it('fijados primero y luego el más reciente', () => {
    const r = ordenarComunicados([
      { id: 'a', fijado: false, created_at: '2026-11-05' },
      { id: 'b', fijado: true, created_at: '2026-11-01' },
      { id: 'c', fijado: false, created_at: '2026-11-06' },
    ]);
    expect(r.map(x => x.id)).toEqual(['b', 'c', 'a']);
  });

  it('slug de novedad con id corto y vuelta atrás', () => {
    const s = slugNovedad('¡Y el ganador del Concurso DJ es…!', ID);
    expect(s).toBe('y-el-ganador-del-concurso-dj-es-0b8f3c1e');
    expect(idCortoDeSlug(s)).toBe('0b8f3c1e');
    expect(idCortoDeSlug('sin-id')).toBeNull();
  });

  it('porcentajes de encuesta', () => {
    expect(porcentajes([1, 3])).toEqual([25, 75]);
    expect(porcentajes([0, 0])).toEqual([0, 0]);
  });

  it('distingue enlaces internos', () => {
    expect(esEnlaceInterno('/dashboard?view=navidad')).toBe(true);
    expect(esEnlaceInterno('//evil.com')).toBe(false);
    expect(esEnlaceInterno('https://xpeak.es')).toBe(false);
  });
});
