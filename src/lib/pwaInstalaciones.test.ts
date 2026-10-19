import { describe, it, expect } from 'vitest';
import { agruparInstalacionesPwa, type EventoPwa } from './pwaInstalaciones';

const ev = (display_name: string | null, evento: string, instalado_en: string, rol: string | null = 'dj'): EventoPwa =>
  ({ display_name, rol, evento, instalado_en, device: 'mobile' });

describe('agruparInstalacionesPwa', () => {
  // Caso real del panel (13 oct 2026): Dj eloy salía 12 veces, una por cada apertura.
  const eventos: EventoPwa[] = [
    ev('N.MARTIN', 'pwa_installed', '2026-10-12T22:35:08Z'),
    ...Array.from({ length: 10 }, (_, i) =>
      ev('Dj eloy', 'pwa_session', `2026-10-12T${String(19 - i).padStart(2, '0')}:00:00Z`, 'disco-movil')),
    ev('Dj eloy', 'pwa_installed', '2026-10-12T08:00:00Z', 'disco-movil'),
    ev('Gonzalo DJ', 'pwa_session', '2026-10-11T19:24:18Z'),
  ];

  it('una fila por persona, no por apertura', () => {
    const personas = agruparInstalacionesPwa(eventos);
    expect(personas.map(p => p.display_name)).toEqual(['N.MARTIN', 'Dj eloy', 'Gonzalo DJ']);
  });

  it('quien instaló cuenta como "instaló", aunque luego la abra muchas veces', () => {
    const eloy = agruparInstalacionesPwa(eventos).find(p => p.display_name === 'Dj eloy')!;
    expect(eloy.instalo).toBe(true);
    expect(eloy.aperturas).toBe(10);
    expect(eloy.ultima).toBe('2026-10-12T19:00:00Z');
  });

  it('quien solo abre la app es "ya la tenía"', () => {
    const gonzalo = agruparInstalacionesPwa(eventos).find(p => p.display_name === 'Gonzalo DJ')!;
    expect(gonzalo.instalo).toBe(false);
    expect(gonzalo.aperturas).toBe(1);
  });

  const anon = (detalle: string, instalado_en: string): EventoPwa =>
    ({ display_name: null, rol: null, evento: 'pwa_session', instalado_en, device: 'mobile', detalle });

  it('anónimos con id de aparato: una fila por aparato', () => {
    const personas = agruparInstalacionesPwa([
      anon('android#aaa', '2026-10-19T10:00:00Z'),
      anon('android#aaa', '2026-10-18T10:00:00Z'),
      anon('iphone#bbb', '2026-10-17T10:00:00Z'),
    ]);
    expect(personas).toHaveLength(2);
    expect(personas[0]).toMatchObject({ sistema: 'android', aperturas: 2 });
    expect(personas[1]).toMatchObject({ sistema: 'iphone', aperturas: 1 });
  });

  // Caso real del panel (19 oct 2026): 12 filas "Visitante anónimo" seguidas.
  it('anónimos sin id: todos en una sola fila, al final', () => {
    const personas = agruparInstalacionesPwa([
      anon('android', '2026-10-19T10:00:00Z'),
      ev('Gonzalo DJ', 'pwa_session', '2026-10-15T10:00:00Z'),
      anon('mac', '2026-10-17T10:00:00Z'),
      anon('android', '2026-10-13T10:00:00Z'),
    ]);
    expect(personas).toHaveLength(2);
    expect(personas[1]).toMatchObject({ sinIdentificar: true, aperturas: 3, sistema: 'android, mac' });
  });
});
