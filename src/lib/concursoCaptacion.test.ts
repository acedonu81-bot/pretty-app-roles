import { describe, it, expect } from 'vitest';
import { slugRef, enlacePedirVoto, mensajePedirVoto, emailValido } from './concursoCaptacion';

describe('captación del concurso', () => {
  it('el ref sale del nombre sin acentos, en minúsculas y sin símbolos', () => {
    expect(slugRef('DJ VIZARD')).toBe('dj-vizard');
    expect(slugRef('Borja.Madd')).toBe('borja-madd');
    expect(slugRef('Ñandú Ré')).toBe('nandu-re');
    expect(slugRef('  ¡¡¡  ')).toBe('dj');
    expect(slugRef(null)).toBe('dj');
    expect(slugRef('a'.repeat(80)).length).toBeLessThanOrEqual(30);
  });

  it('el enlace apunta a la página de aspirantes con su ref', () => {
    expect(enlacePedirVoto('DJ VIZARD')).toBe('https://xpeak.es/concurso-dj-madrid/aspirantes?ref=dj-vizard');
  });

  it('el mensaje lleva el enlace y dice que es gratis', () => {
    const m = mensajePedirVoto('https://xpeak.es/x');
    expect(m).toContain('https://xpeak.es/x');
    expect(m.toLowerCase()).toContain('gratis');
  });

  it('valida el email', () => {
    expect(emailValido('a@b.es')).toBe(true);
    expect(emailValido(' a@b.es ')).toBe(true);
    expect(emailValido('a@b')).toBe(false);
    expect(emailValido('sin arroba')).toBe(false);
  });
});
