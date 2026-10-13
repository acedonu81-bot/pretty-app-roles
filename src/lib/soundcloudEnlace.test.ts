import { describe, it, expect } from 'vitest';
import { leerEnlaceSoundcloud } from './soundcloudEnlace';

describe('leerEnlaceSoundcloud', () => {
  it('enlace largo: lo deja limpio, sin el rastreo de compartir', () => {
    expect(leerEnlaceSoundcloud('https://soundcloud.com/dj-pepe/sesion-octubre?si=abc123&utm_source=clipboard&utm_medium=text'))
      .toEqual({ tipo: 'largo', url: 'https://soundcloud.com/dj-pepe/sesion-octubre' });
  });

  it('enlace del móvil (m.soundcloud.com) o sin https', () => {
    expect(leerEnlaceSoundcloud('https://m.soundcloud.com/dj-pepe/sesion')).toEqual({ tipo: 'largo', url: 'https://soundcloud.com/dj-pepe/sesion' });
    expect(leerEnlaceSoundcloud('soundcloud.com/dj-pepe/sesion')).toEqual({ tipo: 'largo', url: 'https://soundcloud.com/dj-pepe/sesion' });
  });

  it('enlace corto de la app, aunque venga con el texto de compartir', () => {
    expect(leerEnlaceSoundcloud('Escucha Sesión octubre de DJ Pepe en #SoundCloud https://on.soundcloud.com/AbC123xYz'))
      .toEqual({ tipo: 'corto', url: 'https://on.soundcloud.com/AbC123xYz' });
  });

  it('no vale el perfil (falta la sesión) ni otras webs', () => {
    expect(leerEnlaceSoundcloud('https://soundcloud.com/dj-pepe')).toBeNull();
    expect(leerEnlaceSoundcloud('https://www.mixcloud.com/dj-pepe/sesion/')).toBeNull();
    expect(leerEnlaceSoundcloud('')).toBeNull();
  });
});
