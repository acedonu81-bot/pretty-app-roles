import { describe, it, expect } from 'vitest';
import { textoVisible } from '../AdminBandejaXpeak';

describe('textoVisible', () => {
  it('traduce el marcado de acuerdos del chat', () => {
    expect(textoVisible('[[acuerdo:propuesto|ACUERDO|x]]')).toBe('Propuesta de contrato');
    expect(textoVisible('[[acuerdo:aceptado|x]]')).toBe('Acuerdo aceptado');
    expect(textoVisible('[[acuerdo:cancelado|x]]')).toBe('Acuerdo cancelado');
  });
  it('deja el texto normal tal cual y vacío si no hay', () => {
    expect(textoVisible('Hola Néstor')).toBe('Hola Néstor');
    expect(textoVisible(null)).toBe('');
  });
});
