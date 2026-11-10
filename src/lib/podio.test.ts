import { describe, expect, it } from 'vitest';
import { puestosPorDj, subirPodio } from '@/lib/podio';
import { leerMensajeMixcloud } from '@/hooks/useMixcloudWidget';
import { leerMensajeHearthis } from '@/hooks/useHearthisWidget';

describe('podio en el directorio', () => {
  it('se queda con el mejor puesto de cada DJ', () => {
    const m = puestosPorDj([
      { dj_user_id: 'a', puesto: 3 }, { dj_user_id: 'b', puesto: 2 }, { dj_user_id: 'a', puesto: 1 },
    ]);
    expect(m.get('a')).toBe(1);
    expect(m.get('b')).toBe(2);
  });

  it('sube a los del podio por puesto y deja al resto en su orden', () => {
    const lista = ['x', 'y', 'oro', 'z', 'bronce', 'plata'];
    const puestos = new Map([['oro', 1], ['plata', 2], ['bronce', 3]] as const);
    expect(subirPodio(lista, s => s, new Map(puestos))).toEqual(['oro', 'plata', 'bronce', 'x', 'y', 'z']);
  });

  it('sin podio no toca nada', () => {
    const lista = ['b', 'a'];
    expect(subirPodio(lista, s => s, new Map())).toBe(lista);
  });
});

describe('mensajes del reproductor de Mixcloud', () => {
  const msg = (type: string, data?: unknown) => JSON.stringify({ mixcloud: 'playerWidget', type, data });

  it('entiende ready, progress, play y pausa', () => {
    expect(leerMensajeMixcloud(msg('ready'))).toEqual({ tipo: 'ready' });
    expect(leerMensajeMixcloud(msg('event', { eventName: 'progress', args: [42.5, 3600] }))).toEqual({ tipo: 'progress', posicion: 42.5 });
    expect(leerMensajeMixcloud(msg('event', { eventName: 'play', args: [] }))).toEqual({ tipo: 'play' });
    expect(leerMensajeMixcloud(msg('event', { eventName: 'ended', args: [] }))).toEqual({ tipo: 'pause' });
  });

  it('ignora lo que no es de su reproductor', () => {
    expect(leerMensajeMixcloud('no es json')).toBeNull();
    expect(leerMensajeMixcloud(JSON.stringify({ type: 'ready' }))).toBeNull();
    expect(leerMensajeMixcloud(msg('methodResponse', { methodId: 1 }))).toBeNull();
  });
});

describe('mensajes del reproductor de hearthis', () => {
  it('play y resume suenan; pause, stop y finish paran', () => {
    expect(leerMensajeHearthis({ action: 'play', id: 1 })).toEqual({ tipo: 'sonando' });
    expect(leerMensajeHearthis({ action: 'resume', id: 1 })).toEqual({ tipo: 'sonando' });
    expect(leerMensajeHearthis({ action: 'pause', id: 1 })).toEqual({ tipo: 'parado' });
    expect(leerMensajeHearthis({ action: 'finish', id: 1 })).toEqual({ tipo: 'parado' });
  });

  it('la acción numérica es el segundo por el que va', () => {
    expect(leerMensajeHearthis({ action: 0, id: 1 })).toEqual({ tipo: 'sonando', posicion: 0 });
    expect(leerMensajeHearthis({ action: 17, id: 1 })).toEqual({ tipo: 'sonando', posicion: 17 });
  });

  it('ignora lo que no es suyo', () => {
    expect(leerMensajeHearthis({ playing: 'x' })).toBeNull();
    expect(leerMensajeHearthis(null)).toBeNull();
    expect(leerMensajeHearthis({ action: -1 })).toBeNull();
  });
});
