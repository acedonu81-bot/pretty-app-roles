import { describe, expect, it } from 'vitest';
import { CADUCA_NUNCA, resumenSinTitulo, esEnlaceInterno, esParaSiempre, formatoMencion, idCortoDeSlug, ordenarComunicados, porcentajes, slugNovedad, textoPlano, tipoDe, trocearCuerpo, etiquetaDestino, dominioDeUrl } from './comunicados';

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

  it('para siempre se reconoce y una fecha normal no', () => {
    expect(esParaSiempre(CADUCA_NUNCA)).toBe(true);
    expect(esParaSiempre('2026-12-06T10:00:00.000Z')).toBe(false);
  });

  it('el extracto no repite el titulo', () => {
    expect(resumenSinTitulo('EL CARIÑO EN LA MEZCLA Y si hablamos', 'El cariño en la mezcla')).toBe('Y si hablamos');
    expect(resumenSinTitulo('Otro texto', 'Título')).toBe('Otro texto');
  });

  it('distingue enlaces internos', () => {
    expect(esEnlaceInterno('/dashboard?view=navidad')).toBe(true);
    expect(esEnlaceInterno('//evil.com')).toBe(false);
    expect(esEnlaceInterno('https://xpeak.es')).toBe(false);
  });

  it('los comunicados sin tipo o con tipo raro cuentan como de XPEAK', () => {
    expect(tipoDe({})).toBe('xpeak');
    expect(tipoDe({ tipo: null })).toBe('xpeak');
    expect(tipoDe({ tipo: 'otra-cosa' })).toBe('xpeak');
    expect(tipoDe({ tipo: 'noticia' })).toBe('noticia');
    expect(tipoDe({ tipo: 'comunidad' })).toBe('comunidad');
  });

  it('el destino junta la categoria principal y las extra', () => {
    expect(etiquetaDestino({ categoria: 'sala' })).toBe('Sala, Catering, Locales & Limpieza');
    expect(etiquetaDestino({ categoria: 'sala', categorias_extra: ['organizadores'] })).toBe('Sala, Catering, Locales & Limpieza + Organizadores');
  });

  it('convierte las URL del texto en enlaces sin llevarse el punto final', () => {
    expect(trocearCuerpo('Fuente: https://www.boe.es/eli/es/rd/2010/02/26/199. Fin')).toEqual([
      { tipo: 'texto', valor: 'Fuente: ' },
      { tipo: 'enlace', url: 'https://www.boe.es/eli/es/rd/2010/02/26/199' },
      { tipo: 'texto', valor: '. Fin' },
    ]);
    expect(trocearCuerpo('sin enlaces')).toEqual([{ tipo: 'texto', valor: 'sin enlaces' }]);
    expect(dominioDeUrl('https://www.boe.es/eli/x')).toBe('boe.es');
  });

  it('un enlace con texto muestra solo el texto y la URL queda detras', () => {
    expect(trocearCuerpo('Fuente: [Concello de Ortigueira](https://festivaldeortigueira.com/a.pdf). Fin')).toEqual([
      { tipo: 'texto', valor: 'Fuente: ' },
      { tipo: 'enlace', url: 'https://festivaldeortigueira.com/a.pdf', texto: 'Concello de Ortigueira' },
      { tipo: 'texto', valor: '. Fin' },
    ]);
  });

  it('el texto plano deja solo el texto de los enlaces con formato', () => {
    expect(textoPlano('Fuentes [BOE: RD 199/2010](https://www.boe.es/eli/es/rd/2010/02/26/199) fin')).toBe('Fuentes BOE: RD 199/2010 fin');
  });
});
