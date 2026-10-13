import { describe, it, expect } from 'vitest';
import { sugerirCorreo } from './emailErrata';

describe('sugerirCorreo', () => {
  it('detecta las erratas típicas del dominio', () => {
    expect(sugerirCorreo('djmege@otlook.com')).toBe('djmege@outlook.com'); // caso real, 16 sep 2026
    expect(sugerirCorreo('ana@gmial.com')).toBe('ana@gmail.com');
    expect(sugerirCorreo('ana@gmai.com')).toBe('ana@gmail.com');
    expect(sugerirCorreo('ana@gmail.con')).toBe('ana@gmail.com');
    expect(sugerirCorreo('ana@hotmial.com')).toBe('ana@hotmail.com');
    expect(sugerirCorreo('ana@hotmai.es')).toBe('ana@hotmail.es');
    expect(sugerirCorreo('ana@yaho.es')).toBe('ana@yahoo.es');
    expect(sugerirCorreo('ana@icloud.con')).toBe('ana@icloud.com');
  });

  it('no toca los dominios correctos ni los propios de empresa', () => {
    for (const ok of ['a@gmail.com', 'a@outlook.com', 'a@hotmail.es', 'a@yahoo.es', 'a@icloud.com', 'a@msn.com',
      'info@theveggiepoint.com', 'hola@arteandrinks.com', 'a@xpeak.site', 'a@gmx.es', 'a@telefonica.net']) {
      expect(sugerirCorreo(ok)).toBeNull();
    }
  });

  it('ignora mayúsculas y espacios, y lo que no es un correo', () => {
    expect(sugerirCorreo('  Ana@GMIAL.com ')).toBe('ana@gmail.com');
    expect(sugerirCorreo('')).toBeNull();
    expect(sugerirCorreo('sin-arroba')).toBeNull();
    expect(sugerirCorreo('ana@')).toBeNull();
  });
});
