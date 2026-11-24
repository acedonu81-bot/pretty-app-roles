import { describe, it, expect } from 'vitest';
import { avisoOfertasMes, ofertasMesDesdeBD, sinOfertasEsteMes } from './ofertasMes';

describe('Una oferta al mes en el nivel base', () => {
  it('sin fila o sin tope no avisa de nada', () => {
    expect(ofertasMesDesdeBD(null)).toBeNull();
    expect(avisoOfertasMes(null)).toBeNull();
    expect(avisoOfertasMes({ limite: null, usadas: 7 })).toBeNull();
    expect(sinOfertasEsteMes({ limite: null, usadas: 7 })).toBe(false);
  });

  it('con la oferta del mes sin gastar, explica el tope y sigue pudiendo apuntarse', () => {
    const o = ofertasMesDesdeBD({ limite: 1, usadas: 0 });
    expect(sinOfertasEsteMes(o)).toBe(false);
    expect(avisoOfertasMes(o)).toMatch(/1 oferta al mes/);
  });

  it('gastada la del mes, no puede apuntarse y se le dice qué hacer', () => {
    const o = ofertasMesDesdeBD({ limite: 1, usadas: 1 });
    expect(sinOfertasEsteMes(o)).toBe(true);
    expect(avisoOfertasMes(o)).toMatch(/Ya has usado tu oferta de este mes/);
  });

  it('una fila con campos nulos cuenta como sin gastar y sin tope', () => {
    expect(ofertasMesDesdeBD({ limite: null, usadas: null })).toEqual({ limite: null, usadas: 0 });
  });
});
