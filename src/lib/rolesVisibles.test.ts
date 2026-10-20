import { describe, it, expect } from 'vitest';
import { apareceEnRol } from './rolesVisibles';

describe('apareceEnRol', () => {
  it('el rol principal siempre vale, tenga los roles que tenga', () => {
    expect(apareceEnRol({ role: 'animador', roles: ['animador', 'mago', 'speaker', 'event_manager', 'makeup'] }, ['animador'])).toBe(true);
  });
  it('caso real: animadora con 5 roles no sale como maquilladora', () => {
    expect(apareceEnRol({ role: 'animador', roles: ['animador', 'mago', 'speaker', 'event_manager', 'makeup'] }, ['makeup', 'peluqueria'])).toBe(false);
  });
  it('dos oficios sí valen: staff + azafata, DJ + disco móvil', () => {
    expect(apareceEnRol({ role: 'staff', roles: ['staff', 'azafata'] }, ['azafata'])).toBe(true);
    expect(apareceEnRol({ role: 'dj', roles: ['dj', 'disco-movil'] }, ['disco-movil'])).toBe(true);
  });
  it('sin roles adicionales solo cuenta el principal', () => {
    expect(apareceEnRol({ role: 'dj', roles: [] }, ['makeup'])).toBe(false);
    expect(apareceEnRol({ role: 'makeup', roles: null }, ['makeup'])).toBe(true);
  });
});
