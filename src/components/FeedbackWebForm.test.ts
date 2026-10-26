import { describe, it, expect } from 'vitest';
import { limpiarFeedback } from './FeedbackWebForm';

describe('limpiarFeedback', () => {
  it('quita emails y teléfonos pero deja el texto', () => {
    const t = limpiarFeedback('Escribidme a ana@gmail.com o al 612 345 678, me falta ver precios');
    expect(t).not.toContain('@');
    expect(t).not.toMatch(/612/);
    expect(t).toContain('me falta ver precios');
  });
  it('no toca fechas ni cifras cortas', () => {
    expect(limpiarFeedback('El 12/12 cobro 80 euros')).toBe('El 12/12 cobro 80 euros');
  });
  it('recorta a 1000', () => {
    expect(limpiarFeedback('a'.repeat(1500)).length).toBe(1000);
  });
});
