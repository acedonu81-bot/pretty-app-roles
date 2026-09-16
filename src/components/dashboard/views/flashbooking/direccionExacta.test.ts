import { describe, it, expect } from 'vitest';
import { puedeVerDireccionExacta } from './SolicitudesTab';

describe('puedeVerDireccionExacta', () => {
  it('la oculta mientras la solicitud está pendiente', () => {
    expect(puedeVerDireccionExacta('pending')).toBe(false);
  });

  it('la oculta si se rechazó o canceló', () => {
    expect(puedeVerDireccionExacta('rejected')).toBe(false);
    expect(puedeVerDireccionExacta('cancelled')).toBe(false);
  });

  it('la muestra con el trato cerrado', () => {
    // 'accepted' es histórico y 'confirmed' el valor que se escribe hoy: los
    // registros viejos deben seguir viendo la dirección.
    for (const s of ['confirmed', 'accepted', 'completed', 'closed']) {
      expect(puedeVerDireccionExacta(s)).toBe(true);
    }
  });

  it('la oculta si no hay estado', () => {
    expect(puedeVerDireccionExacta(null)).toBe(false);
  });
});
