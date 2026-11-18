// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { fuenteVisita } from './fuenteVisita';

describe('fuenteVisita', () => {
  it('sin referrer es directo', () => {
    expect(fuenteVisita({ referrer: '' })).toBe('directo');
    expect(fuenteVisita({})).toBe('directo');
  });

  it('los enlaces de Inicio marcan su origen con ?v=', () => {
    expect(fuenteVisita({ search: '?v=inicio_premium', referrer: 'https://xpeak.es/dashboard' })).toBe('inicio_premium');
    expect(fuenteVisita({ search: '?v=inicio_nuevo' })).toBe('inicio_nuevo');
  });

  it('un ?v= inventado se ignora', () => {
    expect(fuenteVisita({ search: '?v=hackeo', referrer: '' })).toBe('directo');
    expect(fuenteVisita({ search: '?v=interno', referrer: 'https://www.google.com/' })).toBe('buscador');
  });

  it('buscadores', () => {
    expect(fuenteVisita({ referrer: 'https://www.google.com/' })).toBe('buscador');
    expect(fuenteVisita({ referrer: 'https://www.google.es/search?q=dj' })).toBe('buscador');
    expect(fuenteVisita({ referrer: 'https://www.bing.com/' })).toBe('buscador');
    expect(fuenteVisita({ referrer: 'https://duckduckgo.com/' })).toBe('buscador');
  });

  it('redes sociales', () => {
    expect(fuenteVisita({ referrer: 'https://l.instagram.com/?u=x' })).toBe('redes');
    expect(fuenteVisita({ referrer: 'https://www.instagram.com/' })).toBe('redes');
    expect(fuenteVisita({ referrer: 'https://www.facebook.com/' })).toBe('redes');
    expect(fuenteVisita({ referrer: 'https://www.tiktok.com/' })).toBe('redes');
    expect(fuenteVisita({ referrer: 'https://t.co/abc' })).toBe('redes');
    expect(fuenteVisita({ referrer: 'https://wa.me/' })).toBe('redes');
  });

  it('dentro de XPEAK es interno y otra web es otra_web', () => {
    expect(fuenteVisita({ referrer: 'https://xpeak.es/dashboard', hostActual: 'xpeak.es' })).toBe('interno');
    expect(fuenteVisita({ referrer: 'https://www.xpeak.site/', hostActual: 'xpeak.es' })).toBe('interno');
    expect(fuenteVisita({ referrer: 'https://blog-de-bodas.example/post' })).toBe('otra_web');
  });

  it('si ya navegó dentro de la web, el referrer de la primera carga no vale', () => {
    expect(fuenteVisita({ referrer: 'https://www.google.com/', enEntrada: false })).toBe('interno');
    expect(fuenteVisita({ search: '?v=inicio_premium', referrer: 'https://www.google.com/', enEntrada: false })).toBe('inicio_premium');
    expect(fuenteVisita({ referrer: 'https://www.google.com/', enEntrada: true })).toBe('buscador');
  });

  it('un dominio que solo contiene "google" no cuenta como buscador', () => {
    expect(fuenteVisita({ referrer: 'https://googleblog-falso.example/' })).toBe('otra_web');
  });
});
