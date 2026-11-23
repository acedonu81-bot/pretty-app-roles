import { describe, it, expect } from 'vitest';
import { sanitizeInput, RAZON_CONTACTO } from './contentFilter';

// El chat deja pasar teléfonos, redes y correos (19 nov 2026); el resto de
// campos (bio, nombre...) los siguen frenando por defecto.
describe('sanitizeInput con permitirContacto', () => {
  it('por defecto bloquea teléfono, @ y correo con el motivo de contacto', () => {
    expect(sanitizeInput('llámame al 612 345 678').reason).toBe(RAZON_CONTACTO);
    expect(sanitizeInput('mi instagram es @daniela').reason).toBe(RAZON_CONTACTO);
    expect(sanitizeInput('daniela@correo.com').reason).toBe(RAZON_CONTACTO);
  });
  it('en el chat los permite', () => {
    expect(sanitizeInput('llámame al 612 345 678', 'default', { permitirContacto: true }).clean).toBe(true);
    expect(sanitizeInput('mi instagram es @daniela', 'default', { permitirContacto: true }).clean).toBe(true);
    expect(sanitizeInput('daniela@correo.com y mi whatsapp wa.me/34612345678', 'default', { permitirContacto: true }).clean).toBe(true);
  });
  it('permitir contacto no desbloquea el resto de filtros', () => {
    expect(sanitizeInput('<script>alert(1)</script>', 'default', { permitirContacto: true }).clean).toBe(false);
  });
});
